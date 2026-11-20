---
title: "Determinism is a feature: byte-identical AI artifacts"
description: "If compiling the same workload twice gives you two different files, you can't diff builds, verify integrity, or trust a rollback. Here's how Aether makes compilation reproducible."
date: 2026-11-10
tag: Engineering
author: Orbis Mind
readingTime: "4 min read"
---

Reproducible builds are table stakes for serious software — compilers, container images,
language toolchains all strive for them. AI tooling mostly doesn't. We think that's a mistake,
and Aether treats determinism as a hard requirement.

## Why it matters

Compiling an AI workload produces an `.ae` artifact: the execution plan, the selected model,
optimized prompts, cost estimates, and the integrity metadata around them. If two compilations
of the *same* input produce *different* bytes, you lose a lot:

- **You can't diff builds.** Was that change intentional, or just a new random ID? You can't tell.
- **You can't verify integrity.** A checksum is meaningless if the "correct" value changes every build.
- **You can't trust a rollback.** Rolling back should give you exactly what you had before — bit for bit.
- **Caching and CI get flaky.** Non-determinism turns "did anything change?" into a coin flip.

## The two leaks we closed

Early on, Aether's artifacts were not reproducible, and the causes were the classic two:

1. **A random plan ID.** Each compile generated a fresh identifier. The fix: make the plan ID
   **content-addressed** — derived from the plan's contents — so identical plans get identical IDs.
2. **A wall-clock timestamp.** The build time was `time.Now()`, baked into the artifact. The
   fix: honor `SOURCE_DATE_EPOCH`, the same convention reproducible-build toolchains use, so the
   timestamp is an input you control rather than ambient state.

With both closed, the same spec compiles to a **byte-identical** `.ae` artifact. That's a
property you can assert in a test — and we do.

## Integrity you can actually check

Determinism and integrity go together. The v2 artifact format stores a full SHA-256 and
**verifies it on read**, with a guard against decompression bombs and strict bounds checking so
a corrupt file returns a typed error instead of panicking. It still reads legacy v1 artifacts.
Because builds are reproducible, that hash is a stable contract: anyone can recompile and
confirm they got exactly the artifact you shipped.

> A build you can't reproduce is a build you can't verify. Determinism isn't pedantry — it's
> what makes every downstream guarantee (diffing, caching, rollback, integrity) possible.

It's a small-sounding property with outsized consequences. If you want the details, the
[compiler pillar](/docs#compiler) in the docs covers the artifact format and the determinism
guarantees end to end.
