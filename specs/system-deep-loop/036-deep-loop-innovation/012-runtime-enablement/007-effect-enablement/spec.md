---
title: "Feature Specification: Effect Enablement"
description: "Record a durable, fail-closed effect intent and confirmation around the real executor dispatch, so a cutover certificate observes real effect evidence instead of passing over an empty list."
trigger_phrases:
  - "effect enablement"
  - "effect producer at dispatch"
  - "fail-closed effect record"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement"
    last_updated_at: "2026-08-21T15:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase to home the effect producer with cross-packet authorization"
    next_safe_action: "Capture the runtime baseline, then wire the fail-closed producer at the spawn seam"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/restart-observation/restart-facts-reader.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The producer lives in a new 012 child, authorized to edit the 007-owned dispatch file"
      - "Effect recording fails closed: no durable intent, no spawn"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Effect Enablement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-21 |
| **Owner skill** | system-deep-loop |
| **Authority posture** | No authority moves in this phase; it supplies the evidence a later flip requires |

> Phase adjacency under `012-runtime-enablement` (navigation order): predecessor `006-enablement-closeout`
> (allocation order only — this phase was allocated last); successor `none` (final sibling). Logically this
> phase is a dependency of the flip, not a step after closeout: it unblocks `002` and `003`, whose
> certificates cannot pass without it.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A cutover certificate attests that a run's external effects were all recorded and confirmed. It derives that from an
effect ledger. No production code writes to one. Only rollback drills construct an effect gateway; the real dispatch
path writes nothing. So the certificate's coverage check runs `[].every(...)` over an empty list, which is `true`, and
a run whose effects were never recorded is indistinguishable from a run that had none.

The restart-facts reader already refuses to answer over an absent effect ledger rather than reporting a vacuous clean
bill of health. That refusal is correct, and it is exactly what blocks the flip: the evidence the certificate needs
cannot be observed because nothing produces it.

The real external action is the executor dispatch. `runAuditedExecutorCommandAsync` spawns a child process at
`executor-audit.ts:1075` — it costs money, reaches the network, and must not be performed twice across a crash. An
intent/completion receipt pair already brackets that spawn, but it writes MAC-signed files best-effort, not durable
effect-ledger events, and it silently returns when no receipt directory is configured.

### Purpose

Emit a durable effect-intent record before the real dispatch crosses the process boundary, and an effect-confirmation
after it settles, into the per-run effect ledger the certificate reads. Record fail-closed: if the intent cannot be
durably written, the dispatch does not happen. This turns the certificate's coverage check from a vacuous pass over an
empty list into an assertion over records that describe real external actions.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The actor in every confirmed case is the operator or
> an unwired subsystem, not a remote attacker. Read every P0 below as **cutover-readiness and evidence-integrity risk,
> not breach risk**.

### Non-Goals

- The authority flip itself. This phase supplies evidence; `002`/`003`/`005` perform the move.
- The projection passthrough for pinned legacy events. That stranding bites at legacy-writer retirement and belongs to
  `004`, with its own operator decision already recorded.
- Fabricating effect records for actions that did not occur. A record is written only where a real external action is
  about to happen or has just settled.
- Any change to the effect model, the gateway's recovery machinery, or the certificate's derivation.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Write a durable effect-intent record before the real child-process spawn, and an effect-confirmation after the
  dispatch settles, sharing one stable effect id.
- Route both records to the per-run effect ledger the restart-facts reader reads, so the certificate's coverage check
  observes them.
- Fail closed: if the intent cannot be durably recorded, refuse the spawn loudly and structurally rather than
  proceeding.
- Preserve the existing best-effort receipt pair; do not silently break or duplicate it.

### Authorized Cross-Packet Surface

`lib/deep-loop/executor-audit.ts` is owned by `007-executor-and-cli-hardening` and audited by the whole-system gate in
`004-gate-closeout-and-drift`. Editing it is normally out of this packet's scope. The operator explicitly authorized
this phase to modify it, because the effect producer must sit at the one place a real external action occurs, and that
place is this file. The edit is scoped strictly to effect recording and adds no unrelated behavior.

### Out of Scope

- The flip, legacy-writer retirement, the whole-system gate, and closeout.
- The projection passthrough for pinned events.
- Any surface other than the dispatch seam, the effect-ledger construction it needs, and the tests that prove it.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| `lib/deep-loop/executor-audit.ts` (007-owned, authorized) | Emits a fail-closed effect intent before spawn and a confirmation after settle |
| Effect-ledger construction in the dispatch path | A per-run effect ledger is constructed so the records have a home |
| Effect-recording tests | New coverage: the intent/confirm pair, the fail-closed negative control, and the coverage check reading real records |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: A durable effect-intent record is written before the real dispatch crosses the process boundary.
- **REQ-002**: An effect-confirmation record is written after the dispatch settles, carrying the observed outcome.
- **REQ-003**: If the intent cannot be durably recorded, no child process is spawned. The refusal is loud and
  structured, not a silent skip.
- **REQ-004**: The intent and its confirmation share one stable effect id, so a resumed run can recognise an
  already-performed effect through the gateway's existing recovery path.
- **REQ-005**: Both records go to the effect ledger the restart-facts reader reads, so the certificate's coverage check
  observes real records rather than an empty list.
- **REQ-006**: The existing best-effort receipt pair around the spawn is preserved, neither broken nor duplicated.
- **REQ-007**: The change to the 007-owned dispatch file is confined to effect recording and introduces no unrelated
  behavior on the hot path.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A real dispatch writes exactly one intent and one confirmation sharing an effect id, proven by reading
  the ledger, not the code.
- **SC-002**: When durable intent recording is forced to fail, zero child processes are spawned — proven by a negative
  control that perturbs only the recording step and asserts no spawn, then restores and asserts a spawn.
- **SC-003**: The restart-facts reader, run over a ledger populated by a real dispatch, returns non-empty effect
  coverage instead of the vacuous empty-list pass — the exact ambiguity the reader refuses on is gone.
- **SC-004**: The runtime suite is re-run and reported as a delta against a captured baseline, with no new failing file
  attributable to this change.
- **SC-005**: The scoped diff touches only the dispatch seam, its effect-ledger construction, and the tests; the
  best-effort receipt pair is unchanged in behavior.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| Fail-closed halts a hot path | A ledger fault stops every deep-loop dispatch | The operator ratified fail-closed over vacuity; the intent write is the cheapest durable step and its failure is the signal, not noise |
| Wrapping the append CLI instead of the real action | Records attesting to nothing; a fabrication that cannot be refused downstream | The producer sits at the real `spawn`, not around a ledger append; a record is written only where an external action occurs |
| The edit lands on a cross-packet hot-path file | A change the owning packet's gate does not expect | The authorization is recorded here; the edit is confined to effect recording and re-runs the whole-system suite as a delta |
| The negative control cannot actually fail | A green fail-closed test that proves nothing | SC-002 perturbs only the recording step and requires zero spawns, then restores and requires a spawn |

**Dependencies**: the effect gateway and event contracts in `receipts-and-effect-recovery` (landed, unwired); the
restart-facts reader's effect-ledger contract (landed, refuses on absence).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. The two decisions this phase turned on are settled by the operator: effect recording fails closed,
and this phase is authorized to edit the 007-owned dispatch file. The remaining unknowns are implementation details —
the exact effect-ledger id and the shape of the intent payload at the seam — which the setup task resolves by reading
the shipped contracts rather than by deciding.
<!-- /ANCHOR:questions -->
