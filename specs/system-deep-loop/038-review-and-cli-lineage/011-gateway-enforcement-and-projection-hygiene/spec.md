---
title: "Feature Specification: Phase 11: gateway-enforcement-and-projection-hygiene"
description: "Phase 10 fixed the brief that let a CLI lineage hand-write its state log, but only a prompt enforced the rule, a refused append left duplicates, and the projection lost topics and reducer rows. This phase makes the gateway rule mechanical and the projection lossless for those rows."
trigger_phrases:
  - "gateway enforcement and projection hygiene"
  - "phase 11 gateway enforcement"
  - "state log unattributed"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: gateway-enforcement-and-projection-hygiene

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `worktrees/156-session-relaunch-post-fix-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-config-row-projection-refusal |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the related deep-loop suites, the stem census and the typecheck pass, and `validate.sh` on this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the deep-loop review and CLI lineage specification.

**Scope Boundary**: The open items phase 010 recorded, and the items each fix surfaced: provenance enforcement, retry duplicates, config-row topics, the CLI lineage reducer step, lineages that never call the gateway, and reducer and idea rows a projection replace dropped. The operator asked on 2026-10-19 for "all open items".

**Dependencies**:
- Phase 010's brief fix, merged to main.

**Deliverables**:
- A provenance refusal before the ledger append, an idempotent append, and a runner failure class for an unattributed state log.
- Topics in research and review config rows, and lossless reducer and idea events.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Only a prompt kept CLI lineages from writing the state log, and the gateway noticed a hand-written row only after it had appended the event, so every retry stored another copy. The projector wrote the run id into the config row's topic for research and review. A cli-pi lineage never ran the reducer, so its merge carried an unverified-provenance warning. A lineage that never called the gateway looked like a success. The reducer's own rows and the research agent's idea rows were dropped by the next projection replace, so an idea could never be promoted in a ledger-backed run.

### Purpose
The gateway rule is enforced by code, a retry is stored once, and every row a run writes survives the projection.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Gateway: provenance check before authorization, idempotent append on an input-derived key, a conflict refusal for a reused key.
- Runner: `unattributed_state_log` failure class, not retried; the brief names the reducer step.
- Schemas, types, projector and upcaster: `topic` on research and review `run_initialized`; registered stems for `question_conflict`, `idea_promoted`, `idea_observed` and the rejection rows; upcasting instead of pinning those rows.
- The reducer routes its rows through the gateway in ledger-backed runs.

### Out of Scope
- Legacy rows still pinned: pivots, `stuckRecovery`, `userPaused`, `novelty_signal_inert`, `trend_flatline`, `migration`, `min_iterations_guard_pass`.
- Doc naming differences between `state-jsonl.md` and the feature catalog.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/mode-append-gateway/append-mode-event.ts`, `runtime/scripts/append-mode-event.cjs` | Modify | Provenance and idempotency |
| `runtime/scripts/fanout-run.cjs`, `scripts/lib/cli-guards.cjs`, `fanout-pool.cjs` | Modify | Failure class, brief reducer step |
| Ledger schemas, types, reducers, projection contracts, `legacy-compatibility.ts` | Modify | Topic and lossless rows |
| `deep-research/scripts/reduce-state.cjs` | Modify | Rows through the gateway |
| Research and review workflow YAMLs, compiled contracts | Modify | Send the topic |
| Runtime tests and `tests/helpers/gateway-backed-lineage.ts` | Create and modify | Failing-first tests, gateway-backed stubs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A hand-written config row is refused before the ledger is touched, and a lineage whose state log the ledger never produced fails with its own class. |
| REQ-002 | A retried identical event is stored once. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Research and review config rows carry the run's topic, and the reducer, conflict and idea rows survive a projection replace. |
| REQ-004 | Each change has a test that fails on the pre-phase sources, and the stem census and typecheck pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Luna's real iteration event, replayed on a copy of its lineage, is refused with `STATE_LOG_UNATTRIBUTED` and leaves no ledger frame.
- **SC-002**: The related deep-loop suites pass, and strict validation of this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Identical events sent on purpose now collapse to one | Low | The key comes from the whole event as handed over; a caller that means a repeat names its own key |
| Risk | The reducer now spawns the gateway in ledger-backed runs | Medium | A refusal throws instead of losing the row; a run without a ledger keeps the direct append |
| Risk | The summary gains a failure class | Low | `fanout-pool` rollups and their tests carry the new key |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The provenance and idempotency checks share one ledger read.

### Security
- **NFR-S01**: The attribution guard in the shadow projection store stays as the last check.

### Reliability
- **NFR-R01**: Old ledgers without `topic` still project, falling back to the run id.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A blank or oversized topic is left out, so the run still opens.
- A legacy idea row with undocumented alias fields is refused with a named reason.

### Error Scenarios
- A reused key on a different event kind is refused with `IDEMPOTENCY_CONFLICT` before any append.

### State Transitions
- A projection failure after a clean append replays the stored event on retry and reports `idempotentReplay: true`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Gateway, runner, schemas, reducers, projector, upcaster, workflows |
| Risk | 12/25 | The ledger append path and the event registry change |
| Research | 8/20 | Each fix located the next gap |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether to migrate the remaining pinned legacy rows is a later phase's call.
<!-- /ANCHOR:questions -->

---
