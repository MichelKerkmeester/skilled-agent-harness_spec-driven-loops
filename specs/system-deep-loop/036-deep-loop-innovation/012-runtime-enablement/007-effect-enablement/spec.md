---
title: "Feature Specification: Effect Enablement"
description: "Wire the live executor dispatch through the audited path so a mode's real external actions record a fail-closed effect intent and confirmation into the ledger the cutover certificate reads, instead of leaving that ledger with no producer."
trigger_phrases:
  - "effect enablement"
  - "effect producer at dispatch"
  - "fail-closed effect record"
  - "wire the audited dispatch"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement"
    last_updated_at: "2026-08-21T16:10:00Z"
    last_updated_by: "claude"
    recent_action: "Corrected the seam after confirming the audited dispatch has zero production callers"
    next_safe_action: "Capture the baseline, then wire the live launcher through the audited path"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The audited dispatch has zero production callers; the live launcher is fanout-run.cjs"
      - "The consumer reads runDirectory/mode-effect-ledger; the producer must write there"
      - "Wire the substrate: the operator chose the correct, larger path over a narrow shim"
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
| **Authority posture** | No authority moves; this phase supplies the effect evidence a later flip requires |

> Phase adjacency under `012-runtime-enablement` (navigation order): predecessor `006-enablement-closeout`
> (allocation order only — this phase was allocated last); successor `none` (final sibling). Logically this
> phase is a dependency of the flip, not a step after closeout: it unblocks `002` and `003`, whose
> certificates cannot pass without it.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A cutover certificate attests that a run's external effects were recorded and confirmed, deriving that from an effect
ledger. Confirmed by execution, nothing writes to one, and the machinery that could is dark:

- `runAuditedExecutorCommand` and its async form — the audited wrapper that brackets the real child-process spawn — have
  **zero production callers**. They are exercised only by tests. The wrapper is landed but unwired.
- The effect gateway in `receipts-and-effect-recovery` is constructed only by rollback drills.
- The **only** effect-ledger consumer is the per-mode enablement step in `enable-modes.cjs`, which reads
  `${runDirectory}/${mode}-effect-ledger`. The per-mode resume adapters read effect intents for crash recovery; they do
  not produce them.

So the ledger the certificate reads has no writer, and the audited path that would write it is never called. The
certificate's coverage check runs `[].every(...)` over an empty list — which is `true` — and a run whose effects were
never recorded is indistinguishable from a run that had none. The restart-facts reader already refuses over an absent
effect ledger rather than reporting that vacuous clean bill of health; that refusal is exactly what blocks the flip.

An earlier reading of this phase named `executor-audit.ts` as the seam. That was wrong: the function there is never
called in production, and it holds no binding to the mode or the run directory the consumer reads, so a producer placed
there could not be observed by the consumer — the packet's own recurring defect.

The live executor launcher is `fanout-run.cjs`. It already knows the mode (`loopType`) and the run directory
(`lineageDir`), and it spawns the executor child today **without** the audited wrapper. That is the seam.

### Purpose

Route the live dispatch in `fanout-run.cjs` through the audited executor path, and record a durable effect-intent before
the real spawn and an effect-confirmation after it settles, into `${lineageDir}/${mode}-effect-ledger` — the exact
ledger the enablement step reads. Record fail-closed: if the intent cannot be durably written, the spawn does not
happen. This puts the producer on a genuinely live path the consumer observes, so the certificate's coverage check
becomes an assertion over records that describe real external actions instead of a vacuous pass over nothing.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The actor in every confirmed case is the operator or an
> unwired subsystem, not a remote attacker. Read every P0 below as **cutover-readiness and evidence-integrity risk, not
> breach risk**.

### Non-Goals

- The authority flip itself. This phase supplies evidence; `002`/`003`/`005` perform the move.
- The projection passthrough for pinned legacy events. That stranding bites at legacy-writer retirement and belongs to
  `004`, with its own operator decision already recorded.
- Fabricating effect records for actions that did not occur. A record is written only around the real spawn.
- Any change to the effect model, the gateway's recovery machinery, or the certificate's derivation.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Route the live executor spawn in `fanout-run.cjs` through the audited executor path, so the real external action is
  the one that gets recorded.
- Construct the per-run effect ledger keyed `${mode}-effect-ledger` under the lineage run directory the launcher already
  knows.
- Write a durable effect-intent before the spawn crosses the process boundary, and an effect-confirmation after the
  dispatch settles, sharing one stable effect id.
- Fail closed: if the intent cannot be durably recorded, refuse the spawn loudly and structurally.
- Prove the enablement consumer, pointed at a real lineage run directory, observes the records instead of refusing.

### Coverage and the Mode-Name Mapping

`fanout-run.cjs` uses `loopType` values `research` and `review`, while the canonical mode names — and the effect-ledger
ids the consumer reads — are `deep-research` and `deep-review`. The launcher already carries that mapping (its
`agentName` derivation). The effect ledger MUST be keyed by the canonical name, so `${lineageDir}/deep-research-effect-ledger`
matches what the enablement step reads; keying it by the raw `loopType` would write where the consumer never looks.

`fanout-run.cjs` is the launcher for the two modes that fan out — deep-research and deep-review. The pilot flip (`002`)
is deep-research, so wiring this launcher unblocks the pilot directly. The other six modes dispatch single-executor
through a different path; producing their effects is a documented follow-on within the fleet work, not part of this
launcher's wiring.

### Authorized Cross-Packet Surface

The live launcher `fanout-run.cjs` and the audited executor library `lib/deep-loop/executor-audit.ts` are owned by the
executor-and-cli-hardening and fanout-parity work, not by this packet, and the whole-system gate audits them. Editing
them is normally out of this packet's scope. The operator authorized this phase to modify them, because the effect
producer must sit where the real external action occurs, and that is the live dispatch. The edits are confined to
routing the spawn through the audited path and to effect recording; they add no unrelated dispatch behavior.

### Out of Scope

- The flip, legacy-writer retirement, the whole-system gate, and closeout.
- The projection passthrough for pinned events.
- Any surface other than the live launcher, the audited executor path, the effect-ledger construction they need, the
  enablement consumer's observation of the result, and the tests that prove it.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| `scripts/fanout-run.cjs` (fanout-owned, authorized) | Routes the live executor spawn through the audited path; constructs the per-run effect ledger |
| `lib/deep-loop/executor-audit.ts` (executor-hardening-owned, authorized) | Emits a fail-closed effect intent before spawn and a confirmation after settle, into the run's effect ledger |
| Effect-recording tests | New coverage: the intent/confirm pair on a real dispatch, the fail-closed negative control, and the enablement consumer observing the populated ledger |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: The live executor spawn is routed through the audited executor path; the unaudited direct spawn no longer
  reaches an executor without effect recording.
- **REQ-002**: A durable effect-intent record is written before the real dispatch crosses the process boundary.
- **REQ-003**: An effect-confirmation record is written after the dispatch settles, sharing the intent's effect id.
- **REQ-004**: Both records are written to `${lineageDir}/${mode}-effect-ledger` — the exact ledger and directory the
  enablement step reads.
- **REQ-005**: If the intent cannot be durably recorded, no child process is spawned; the refusal is loud and
  structured, not a silent skip.
- **REQ-006**: The enablement step, pointed at a lineage run directory populated by a real dispatch, observes the
  records rather than refusing over an absent producer.
- **REQ-007**: The existing fan-out behavior — concurrency cap, streaming, liveness, salvage — is preserved; the change
  adds recording, not new dispatch semantics.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A real dispatch writes exactly one intent and one confirmation sharing an effect id, proven by reading the
  ledger under the lineage directory, not by reading the code.
- **SC-002**: When durable intent recording is forced to fail, zero child processes are spawned — proven by a negative
  control that perturbs only the recording step and asserts no spawn, then restores and asserts a spawn.
- **SC-003**: The enablement step, run over a lineage directory populated by a real dispatch, returns non-empty effect
  coverage instead of the refusal-over-absence — the exact vacuity the reader guards against is gone end to end.
- **SC-004**: The regression surface (the fan-out and executor-audit suites — baseline 8 files, 235 tests, all passing)
  is re-run and stays green, and the full runtime suite is reported as a delta with no new failing file attributable to
  this change.
- **SC-005**: The scoped diff touches only the live launcher, the audited executor path, their effect-ledger
  construction, and the tests.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| Fail-closed halts a hot path | A ledger fault stops a live fan-out dispatch | The operator ratified fail-closed over vacuity; the intent write is the cheapest durable step and its failure signals a real ledger fault |
| The edit lands on a heavily-tested cross-packet launcher | A regression in fan-out concurrency, liveness, or salvage | REQ-007 preserves fan-out behavior; the fan-out suite is re-run as a delta and must stay green |
| Producer and consumer disagree on the ledger location | A producer the consumer cannot observe — the packet's recurring defect | REQ-004 fixes the location to `${lineageDir}/${mode}-effect-ledger`; SC-003 proves the consumer observes it end to end |
| The negative control cannot actually fail | A green fail-closed test that proves nothing | SC-002 perturbs only the recording step and requires zero spawns, then restores and requires a spawn |

**Dependencies**: the effect gateway and event contracts in `receipts-and-effect-recovery` (landed, unwired); the
audited executor wrapper `executor-audit.ts` (landed, unwired — this phase is its first production caller); the
restart-facts reader's effect-ledger contract (landed, refuses on absence).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. The seam is confirmed (`fanout-run.cjs`, which holds the mode and run-directory binding), the ledger
location is fixed by the consumer's contract, and the two decisions are settled by the operator: recording fails closed,
and this phase is authorized to wire the substrate across the packet boundary. The remaining unknowns are implementation
details — how the `.cjs` launcher calls the TypeScript audited path, and the exact intent payload at the seam — which the
setup task resolves by reading the shipped contracts.
<!-- /ANCHOR:questions -->
