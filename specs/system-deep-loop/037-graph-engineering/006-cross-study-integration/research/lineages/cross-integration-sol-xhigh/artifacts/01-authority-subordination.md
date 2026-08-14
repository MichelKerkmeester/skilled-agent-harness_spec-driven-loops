# P1 — Authority-Subordination Contract

## Decision

The graph engine is a proposal, orchestration, and evidence plane. It never becomes an authority plane. S1 defines graph state as a projection; S3 explicitly separates admission from authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:18]

## Current mode: `legacy_authoritative_dark_observer`

1. Legacy executes and produces the externally visible result.
2. The graph/harness pipeline may compile, admit, evaluate, and settle a candidate in shadow.
3. The dark 036 adapter records only after the legacy result and returns that result unchanged.
4. Divergence is evidence; it cannot alter the live cursor, effect, or result. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110]

## Target mode: `036_authoritative`

`proposal -> graph admission -> return admission -> D/C/G/H/R/M evidence -> belief usability -> convergence eligibility -> organization policy -> durable human gate if ASK -> 036 authorize-and-append`

All stages emit typed evidence. Only the last operation mutates authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67] [INFERENCE: this order is the minimal non-circular composition of the studies.]

## No-bypass invariants

- Graph admission is never transition authorization.
- Return acceptance never self-promotes.
- Belief or convergence never compensates for missing evidence.
- Policy ASK never defaults to ALLOW.
- Human approval never bypasses current-head, epoch, fence, capability, or policy checks.
- A dark result never changes the external legacy result.
- Absence of authoritative context produces actionable refusal. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:330] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95]

## Proof obligation

Mutants that skip any stage must be killed at the skipped stage's earliest owner and must yield no authorized append.
