---
title: "Feature Specification: Append Gateway and Legacy Projection"
description: "Build the canonical persistence boundary the deep-loop modes never had: an append gateway that authorizes and fences every mode event, and a per-event projection that keeps the legacy state files readable for their existing consumers."
trigger_phrases:
  - "append gateway"
  - "mode event gateway"
  - "legacy projection service"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Authored the gateway and projection contract"
    next_safe_action: "Implement the gateway append path"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/cutover-binding/resolve-cutover-binding.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-engine.ts"
    completion_pct: 10
    open_questions:
      - "Which failure mode should a projection refresh error take: block the append or degrade to stale?"
    answered_questions:
      - "Bindings resolve from the environment; the resolver landed and is verified"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Append Gateway and Legacy Projection

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Owner skill** | system-deep-loop |
| **Origin** | Census finding: no code-level write path exists for mode state |
| **Depends on** | None; this phase is the predecessor for every other enablement phase |
| **Authority posture** | Builds the boundary only; authority does not move in this phase |

> Phase adjacency under `012-runtime-enablement` (navigation order, not a hard runtime dependency): predecessor
> `none` (first sibling); successor `002-deep-research-enablement`.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The authority selector is defined as "the one route decision a mode adapter would consult at its canonical
persistence boundary." For every deep-loop mode, that boundary does not exist. A census of `deep-research` found no
executable writer for `deep-research-state.jsonl`: the only executable references are the derived-file reducer
`scripts/reduce-state.cjs` and the helper `scripts/divergent-research-pivot.ts`. The raw append-only evidence is
written by agents following prose instructions — `references/state/state-jsonl.md` directs leaf agents to append
records directly.

An unauthenticated, unfenced, agent-driven append cannot carry authority. Nothing validates the event envelope,
nothing serialises concurrent writers, and nothing produces a receipt. The substrate that does all three exists and
is unreachable.

### Purpose

Build the missing boundary as a gateway agents call instead of writing files, and make the legacy files a projection
of the ledger rather than a parallel source of truth.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** In every confirmed case the actor is the operator or
> a stale local file, not a remote attacker. Read every P0 and P1 below as **cutover-readiness and robustness risk,
> not breach risk**. A finding's severity label is not a licence to treat it as a security incident.

### Non-Goals

- Moving authority for any mode. This phase builds the path; `002` and `003` move authority through it.
- Changing what agents record. The gateway accepts the records the protocol already defines.
- Retiring the direct-append protocol text — that is `004`, and it must not happen while the gateway is unproven.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- An append gateway module that takes a mode, a run directory, and an event record, and performs: envelope
  preparation through the mode's ledger schema, authorization through the transition gateway, and a fenced append
  through `appendAuthorizedThroughFence`.
- A CLI entry point agents and scripts can invoke without constructing runtime objects themselves.
- A projection refresh that materialises the mode's legacy state file from ledger events at the manifest's declared
  `refreshBoundary`.
- A reader-contract test proving the projected file satisfies every executable consumer found by census, not the
  single reader the manifest names.

### Out of Scope

- Protocol document changes telling agents to use the gateway (`002` for deep-research, `003` for the fleet).
- Any authority-state transition.
- Deleting or rewriting the legacy append instructions.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| `runtime/lib/mode-append-gateway/` | New — the gateway module |
| `runtime/lib/cutover-binding/` | Existing — consumed for actor/capability resolution |
| `runtime/scripts/` | New CLI entry point |
| `runtime/lib/legacy-projections/` | Consumed; extended only if the reader contract requires it |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Every append through the gateway produces a durable receipt or fails; there is no silent-success path.
- **REQ-002**: The gateway refuses an append it cannot authorize, and the refusal names which check failed.
- **REQ-003**: Concurrent appends to one mode's ledger serialise through the existing fence rather than a new lock.
- **REQ-004**: After an append, the mode's legacy state file reflects the new event at the manifest's declared refresh
  boundary.
- **REQ-005**: The projected legacy file satisfies all six executable consumers identified by census, verified by
  running them against a projected file rather than by inspection.
- **REQ-006**: The gateway resolves its own bindings; no caller supplies an actor, capability, or commit.
- **REQ-007**: The gateway is reachable from a shell script or an agent without constructing a runtime object, because
  the callers that most need it are not TypeScript callers.
- **REQ-008**: This phase changes no mode's authority state and adds no call site outside itself.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A gateway append against a temporary ledger returns a receipt, and the event is present and readable
  through the authorized ledger's own read path.
- **SC-002**: An append with a deliberately corrupted envelope is refused, and the refusal is proven by watching the
  check fail before the guard is added.
- **SC-003**: Two concurrent gateway appends to the same mode both succeed and produce a totally ordered ledger, with
  no lost write.
- **SC-004**: A projected legacy state file is byte-comparable to one an agent would have written for the same event
  sequence, or the differences are enumerated and each one justified.
- **SC-005**: `fanout-run.cjs`, `fanout-merge.cjs`, `fanout-salvage.cjs`, `verify-iteration.cjs`, `reduce-state.cjs`
  and `divergent-research-pivot.ts` each run successfully against a projected file.
- **SC-006**: The whole runtime unit suite is re-run and reported as a delta against a captured baseline, not as a
  bare pass.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| The projection diverges from what agents currently write | Six consumers break at once, including live fan-out orchestration | SC-005 runs the real consumers against a projected file before any protocol change |
| A projection refresh failure after a successful append | The ledger and the readable file disagree, and the disagreement is invisible | Decide the failure mode explicitly (see open questions) and test whichever is chosen |
| Fence contention under fan-out load | Appends serialise behind each other and slow a run | Measured, not assumed: the append fence was benchmarked at roughly 10 ms on a path already dominated by an fsync |
| Gateway becomes a second source of truth alongside direct appends | Two writers, no ordering | Direct-append retirement is a named later phase; until then the gateway is additive and the legacy writer remains canonical |

**Dependencies**: the authorized ledger, the transition authorization gateway, the fenced writer, the legacy
projection engine, and the binding resolver — all landed.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. When a projection refresh fails after a durable append has already succeeded, should the gateway report failure to
   the caller — implying the append did not happen, which is false — or succeed while recording that the readable
   projection is stale? The append is already durable at that point, so the honest options are "succeed with a stale
   marker" or "succeed and retry the refresh"; reporting failure would misrepresent the ledger state. To be decided
   during implementation with the decision recorded, not inferred.
<!-- /ANCHOR:questions -->
