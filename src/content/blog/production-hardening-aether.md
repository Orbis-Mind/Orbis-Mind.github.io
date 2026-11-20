---
title: "From prototype to production: hardening Aether's runtime"
description: "What it actually took to move Aether from a green test suite to a runtime we'd trust in production — typed errors, bounded retries, verified artifacts, and a refusal to paper over defects."
date: 2026-11-19
tag: Reliability
author: Orbis Mind
readingTime: "6 min read"
---

A green test suite is not the same thing as a production-ready system. Aether compiled,
vetted, formatted, and passed `go test -race` cleanly — and still hid a set of prototype
defects that would have bitten someone in production. This note is about closing that gap,
and the principle that guided it: **never silently patch, always document and fix with a test.**

## The defects green hid

A focused engineering audit reproduced real problems empirically, not hypothetically:

- A corrupt `.ae` artifact could **panic** on an out-of-bounds slice instead of returning an error.
- Compilation was **non-deterministic** — a random plan ID and a wall-clock timestamp leaked
  into the artifact, so the same input produced different bytes.
- Artifact integrity was only ever checked against a 4-byte checksum, so silent corruption
  could slip through on read.
- The runtime took no `context.Context`, so there was no clean way to cancel in-flight work.

None of these show up as a failing test until you write the test that looks for them.

## What hardening meant, concretely

We fixed each finding and backed it with a regression or fuzz test:

- **No panics on bad input.** Artifact decoding is now bounds-checked and size-limited; a
  corrupt file returns a typed error. We fuzz the decoder so the guarantee keeps holding.
- **Deterministic compilation.** Plan IDs are content-addressed and the build timestamp is
  derived from `SOURCE_DATE_EPOCH`. The same spec now compiles to a **byte-identical** `.ae`
  artifact — a property you can actually test in CI.
- **Verified integrity.** The v2 artifact format stores a full SHA-256 and verifies it on
  read, with a guard against decompression bombs. It still reads legacy v1 files.
- **Context everywhere.** `RunContext` / `RunStreamContext` thread a `context.Context` through
  the whole runtime; the CLI wires `signal.NotifyContext`, so Ctrl-C cancels cleanly and the
  cancellation propagates into provider calls and even the backoff sleep.

## Failure handling is a feature, not a catch block

The most consequential change was treating reliability as part of the compiled plan rather
than something bolted on at call sites. Errors are **typed**: a missing API key or an
un-pulled model is *permanent* and fails fast to the next fallback; a timeout or a transient
network blip is *retryable* with bounded, jittered backoff. A timeout is never misreported as
"unreachable." Every `ExecutionResult` carries the outcome, the retry count, and the model
actually used — nothing is swallowed.

> The rule we kept coming back to: if the code doesn't do it, the docs don't claim it. Every
> capability is labelled implemented, partial, or planned — and the audit's own findings are
> written down, not quietly erased.

## Why zero dependencies made this easier

Aether is pure Go standard library — no third-party packages. That is a constraint, but
during hardening it was a gift: the entire surface area was ours to audit, there were no
transitive CVEs to chase, and a single static binary is trivial to reason about. Releases are
reproducible (`-trimpath`) and ship an SBOM and `SHA256SUMS`.

Production readiness isn't a milestone you cross once. But a runtime that refuses to panic on
bad input, compiles deterministically, verifies what it reads, and cancels cleanly is a very
different thing from a prototype that merely passes its tests. That's the bar we're building to.

Read the architecture in the [documentation](/docs), or dive into the code at
[Orbis-Mind/aether](https://github.com/Orbis-Mind/aether).
