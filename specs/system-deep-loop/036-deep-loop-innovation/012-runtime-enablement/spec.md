---
title: "Runtime Enablement"
description: "Turn the dark deep-loop substrate on: build the append gateway and legacy projection the modes lack, migrate each mode's write protocol onto it, flip authority serially across all seven modes, retire the legacy writers, gate the whole system, and document the result."
trigger_phrases:
  - "runtime enablement"
  - "deep-loop turn on"
  - "activate authorized ledger"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed enablement into six sequenced phases"
    next_safe_action: "Build phase 001 append gateway and projection"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator ratified a direct flip with no rollback window"
      - "Bindings resolve from the environment, never from operator input"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Runtime Enablement

> Phase adjacency under `036-deep-loop-innovation` (navigation order): predecessor
> `011-cli-pi-fanout-execution`; successor `none` (latest sibling).

<!-- ANCHOR:root-purpose -->
## Root Purpose

The epic built a complete parallel runtime — typed ledger, reducers, receipts, fencing, shadow parity, cutover
coordinator — and never connected it to anything. The coordinator's own header records that it "is never invoked
against a real mode's registry root or a real ledger by this build," and a call-site search confirms no consumer of
`CutoverCoordinator` or `selectCanonicalAuthority` exists outside `lib/per-mode-authority-flip/`. Legacy writers
remain canonical for all seven canonical modes: `research`, `review`, `ai-council`, `agent-improvement`,
`model-benchmark`, `skill-benchmark`, and `alignment`.

This packet closes that gap. It exists because the cutover packets that preceded it assumed a canonical persistence
boundary was merely unwired; a census proved there is no such boundary in code at all. Mode state is appended by
agents following prose protocol, so enablement has to **build** the boundary before authority can move through it.

The operator ratified a direct flip: no rollback window, legacy writers retired at flip time, and every
execution-time binding resolved from the environment rather than requested from a person.

<!-- /ANCHOR:root-purpose -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| # | Phase | Purpose | Status |
|---|-------|---------|--------|
| 001 | `001-append-gateway-and-projection/` | Build the write path the modes lack: an append gateway that authorizes and fences every event, plus the per-event projection that keeps the legacy state files readable for their six consumers. | Planned |
| 002 | `002-deep-research-enablement/` | Migrate the deep-research write protocol onto the gateway and flip its authority. The pilot mode proves the pattern end to end on a live mode. | Planned |
| 003 | `003-fleet-enablement/` | Apply the proven pattern to the remaining six modes, serially, as an automated loop the operator does not drive by hand. | Planned |
| 004 | `004-legacy-writer-retirement/` | Retire the direct-append protocol paths once every mode reads and writes through the gateway. | Planned |
| 005 | `005-whole-system-gate/` | Execute the frozen-SHA whole-system gate against the enabled runtime and record a blocking verifier receipt. | Planned |
| 006 | `006-enablement-closeout/` | Reconcile status across the epic and document the enabled system: feature catalog, manual-testing playbook, and mode READMEs. | Planned |
| 007 | `007-effect-enablement/` | Record a durable, fail-closed effect intent and confirmation around the real executor dispatch, so a cutover certificate observes real effect evidence instead of an empty list. Late-allocated dependency of the `002`/`003` flip, not a post-closeout step. | Planned |
| 008 | `008-ledger-read-cache/` | Give `AppendOnlyLedger` an opt-in, default-off verified-events read cache so the effect producer's per-lineage ledger stops paying the exclusive-lock read floor on every read. Dependency of `007`: removes the serialization the effect producer otherwise adds to the fan-out pool. | Planned |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:what-needs-done -->
## What Needs Done

Enablement is serial by construction, not by preference. `requestCutover` rejects a multi-mode request outright with
`MULTI_MODE_REQUEST_REJECTED`, so "flip everything" executes as an automated loop over one mode at a time. Phases 002
and 003 therefore differ in scale, not in mechanism.

Two constraints shape every phase:

**The gateway must exist before authority can move.** Phase 001 is a hard predecessor for everything after it. There
is no shortcut in which a mode flips first and gains a write path later, because the authority selector is defined as
the decision a mode adapter makes at its canonical persistence boundary.

**The legacy file stays readable after the legacy writer dies.** The projection manifest already specifies this: the
research state surface is `disposition: 'project'`, `serializerId: 'legacy-jsonl-row-v1'`, `refreshBoundary: 'event'`.
Retiring a writer is not the same as deleting a file, and six executable consumers — including the fan-out
orchestration that drives live multi-model runs — read those files today.

With no rollback window, phase 005 is the first whole-system evidence that arrives after authority has already moved.
That ordering is a consequence of the ratified path and is recorded here so it is not mistaken for an oversight.
<!-- /ANCHOR:what-needs-done -->
