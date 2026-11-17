---
title: "Implementation Plan: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry"
description: "Three small changes in divergent-pivot.ts: cap council seat outputs at 3 per council attempt with at most one retry per pivot, as the operator decided on 2026-11-17, stop enforcing the unreachable minRemainingIterations guard while still reading the field, and retry a council round once on a quorum failure within the seat budget."
trigger_phrases:
  - "pivot hygiene plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`divergent-pivot.ts`), its CommonJS CLI (`divergent-pivot.cjs`) and the two deep workflow YAMLs |
| **Framework** | system-deep-loop divergent convergence mode and its internal three-seat council vote (`runtime/lib/council/multi-seat-dispatch.cjs`), not the deprecated ai-council mode |
| **Storage** | Persisted pivot config and usage (`usageAtStart`, limits) in the pivot's event records |
| **Testing** | Vitest: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/...` |

### Overview
The seat-cap and dead-guard changes live in `divergent-pivot.ts`. The retry spans the workflow, because the workflow drives the council round: finalize marks a first quorum failure as retryable, and each workflow YAML then re-enters prepare once, which opens a fresh attempt of three seats. ADR-001 gives each council attempt its own cap of 3 seat outputs and allows at most one retry per pivot, so one pivot uses at most 6.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `decision-record.md` ADR-001 is `Accepted` (OD-001, OD-002); no task waits on it
- [ ] The limit check still sits at `divergent-pivot.ts:733-741` and the persisted-limits reader at :1023-1035
- [ ] The REQ-006 suites pass on the unchanged tree (baseline captured)

### Definition of Done
- [ ] Every P0 requirement in `spec.md` is met
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts tests/unit/divergent-pivot-cli.vitest.ts` passes with the new cases
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm run typecheck` exits 0
- [ ] Both compiled contracts are regenerated and `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0
- [ ] The changelog entry and the council playbook retry scenario exist
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded retry inside an existing budget check.

### Key Components
- **Limit check** (`divergent-pivot.ts:729-741`): caps seat outputs at 3 per council attempt (ADR-001) and drops the unreachable `minRemainingIterations` comparison.
- **Usage accounting** (:1485-1486): records the real seat outputs of the pivot, 3 or 6, instead of a fixed `+ 3`, so the cap sees retries.
- **Resume and the cap check**: `prepare` runs `preflightFailure(config, usage)` (:1284) on every call, including a resume of a started pivot (`resumed` at :1244 does not skip it). Once usage is scoped to the current attempt, a resumed attempt that already holds 1 or 2 seat returns would fail `usage.councilSeatOutputs + 3 > 3`. The seat-cap check therefore runs only when an attempt is opened, not when an open attempt is resumed; a REQ-005 case resumes an attempt with 2 seat returns and is not refused.
- **Usage counting** (`divergent-research-pivot.ts:420`, `divergent-review-pivot.ts:405`): today both count every `pivot_seat_returned` event under the artifact root, a lifetime number that `divergent-pivot.ts` only receives. Both filter to the current pivot id and attempt, so the per-attempt check sees the right number.
- **Attempt identity**: an attempt number, 1 or 2, joins the pivot's data. Attempt 1 keeps today's ids and paths, so pivots written before this change still load. Attempt 2 gets its own seat event ids (`seatEventId`, :600-601), its own seat output paths (`buildPivotCouncilPaths`, :807-830), and attempt-scoped lookups in place of `eventByName` (:596-598, which returns the first match). The persisted config (:1130-1165) records the attempt and accepts `invariants.rounds` of 1 or 2 instead of only 1. Seat ids stay `seat-001` to `seat-003`, because `REQUIRED_SEAT_IDS` (:283) is enforced by index (:500-501) and both YAML `for_each` lines name them.
- **Non-terminal first failure**: a retryable first-attempt quorum failure must not write the terminal `pivot_failed` event (:1295, :1441), which the readers at :1210 and :1395 treat as the pivot's end. It writes a distinct per-attempt failure event instead; `PIVOT_LIFECYCLE_STATES` (:290-297) and `PivotEventName` (:146-153) gain the matching entries.
- **Finalize** (`divergent-pivot.ts`, which classifies quorum through `failureReasonForQuorum`, :719-728): on `council_all_seats_rejected`, `council_return_quorum_failed` or `council_parse_quorum_failed`, and only on the first round, returns the failure with a retryable flag when the pivot has not retried yet, so the retry attempt gets its own 3 seats; `council_agreement_failed` is never retryable.
- **Prepare** (`divergent-pivot.ts` through `divergent-pivot.cjs prepare`): on a retry, reopens the same pivot as attempt 2 with three fresh seat dispatches under the same seat ids instead of starting a new pivot, so `maxPivots` is not charged twice.
- **Workflow loop** (`deep-research.yaml` failure branch after `step_finalize_divergent_pivot`, :1112-1207; `deep-review.yaml` after :1206): the loop that re-enters dispatch. When finalize returns retryable, the branch goes back to `step_prepare_divergent_pivot` once, then through `step_dispatch_pivot_seat`, `step_record_pivot_seat` and `step_finalize_divergent_pivot` again; any second failure takes the existing fail-closed path.
- **Config and persisted-limit readers** (:463, :1023-1035): keep accepting `minRemainingIterations` so older persisted pivots still load.

### Data Flow
A legal stop under `divergent` mode runs the workflow's pivot steps: prepare checks limits and returns seat prompts, the workflow dispatches and records three seats, and finalize classifies quorum, then agreement, then records the outcome and usage. The retry adds one loop in the workflow from a retryable finalize result back to prepare, limited to one retry per pivot.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the operator's seat-cap decisions (3 per council attempt, at most one retry per pivot) in `decision-record.md` and captures the REQ-006 baseline. Implementation edits `divergent-pivot.ts` for the dead guard, then the seat scope, then the attempt identity and retry signal, scopes the seat count in both pivot scripts, carries the signal through `divergent-pivot.cjs`, adds the one-time re-entry to both workflow YAMLs and regenerates both compiled contracts last. Verification runs the new retry, agreement, attempt-identity, scoped-count, persisted-limit and seat-scope cases and the REQ-006 suites, then adds the changelog entry and the playbook scenario. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Proving tests from parent `research.md` §20 Slice L: `divergent-pivot` (`tests/integration/divergent-pivot.vitest.ts`) and `council/multi-seat-dispatch` (`tests/council/multi-seat-dispatch.vitest.ts`). The new retry, attempt-identity and scoped-count cases go in `tests/integration/divergent-pivot.vitest.ts`, because the workflow and `divergent-pivot.ts` drive the seats; `multi-seat-dispatch.vitest.ts` stays in the baseline only. This plan adds `tests/unit/divergent-pivot-cli.vitest.ts` to the baseline because it drives the same limits through the CLI, and `check-contract-drift.vitest.ts` and `compile-command-contracts.vitest.ts` for the two regenerated contracts.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator decision on parent §12 item 4 is recorded (ADR-001 Accepted: 3 seat outputs per council attempt, at most one retry per pivot, at most 6 per pivot). No other slice must land first. `../010-research-frontier-mode/` and `../011-review-frontier-mode/` should land after this one, because they gate the same pivot branches in both YAMLs and edit the same pivot scripts.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: divergent runs refuse or repeat pivots in a way the new cases did not predict. Revert the slice's commit and regenerate both compiled contracts. Pivot records written while it was live may show 6 seat outputs for one pivot, which the old code reads as ordinary usage. A pivot that retried has an attempt-2 config with `invariants.rounds: 2`, which the old reader refuses; such a pivot is closed by then, so only a resume of that exact pivot is affected.
<!-- /ANCHOR:rollback -->

---
