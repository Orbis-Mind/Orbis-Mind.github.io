---
title: "Why we compile AI workloads instead of wiring them"
description: "Separating what to run from how it runs turns a tangle of imperative glue into an artifact you can validate, ship, and observe. That separation is the whole idea behind Aether."
date: 2026-11-18
tag: Architecture
author: Orbis Mind
readingTime: "5 min read"
---

Most AI workloads are built imperatively: pick a model, call an API, bolt on a retry, hope
for the best. It works until it doesn't — and the reason it stops working is structural.

## The coupling problem

Writing a workload by hand couples the **definition** of the work to the **mechanics** of
running it. The model name, the budget, the retry policy, the fallback order, the caching
rules — all of it is tangled into the same procedural code that makes the call. So:

- Changing a model means rewriting code, not editing a config.
- There is no plan to validate before you run — the first validation is production.
- There is no artifact to ship, diff, or roll back.
- There is no consistent place to observe what actually happened.

You end up re-implementing the same reliability scaffolding in every project, slightly
differently each time, with no shared notion of "correct."

## Compilation separates the two

Aether asks a narrower, more answerable question:

> How can an AI workload be compiled into an executable plan and executed reliably and
> efficiently under changing runtime conditions?

You declare *what* to run and *under what constraints* in a single `agent.ae.yaml`. Aether
compiles that definition into a validated, deterministic **execution plan** — selecting a
model under your policy, optimizing prompts, estimating cost, and emitting an
integrity-verified `.ae` artifact. The runtime then executes that plan with retries,
fallback, caching, memory, and observability.

The payoff is everything a compiler gives any other kind of program:

- **Validation before execution.** Strict YAML and schema checks reject tabs, duplicate keys,
  and unknown fields *with line numbers* — at compile time, not at 2 a.m.
- **An artifact you can ship.** The `.ae` file is content-addressed and byte-identical for the
  same input. You can diff two builds and see exactly what changed.
- **A single place for policy.** Cost, quality, latency, and privacy constraints live in one
  declarative block and are enforced by the compiler's routing pipeline.
- **Reliability by construction.** Failure handling is compiled into the plan, not scattered
  across call sites.

## Routing is a supporting capability, not the product

It's tempting to describe this as "a model router." It isn't. Routing is one step inside
compilation — the compiler picks a model because it has to pick *something* to run, and it
does so under your constraints using measured quality when it's available. But the product is
the compiler and the runtime: the thing that turns a declaration into a plan and runs that
plan reliably. A router with no plan, no artifact, and no execution semantics solves a much
smaller problem.

## Honest about scope

Today a *workload* in Aether is a single model operation with its policy, memory, and tools,
compiled to a linear plan. Multi-operation execution graphs — DAGs, cross-operation
scheduling, recovery — are the [roadmap](/docs#roadmap), and we mark that boundary everywhere.
The single-operation compiler is the single-node case of the graph compiler we're building
toward. Starting from a correct, reliable node is the right way to get there.

If the separation of *what* from *how* resonates, the [Aether overview](/aether) walks through
the full compile-and-run lifecycle.
