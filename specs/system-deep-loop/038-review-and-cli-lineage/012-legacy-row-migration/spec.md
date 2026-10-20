---
title: "Feature Specification: Phase 12: legacy-row-migration"
description: "Phase 11 made the reducer and idea rows survive a projection replace, but seven other legacy row kinds were still pinned and lost in a ledger-backed run, most upcast arms took the append time, a mistyped field got a generic refusal, and the rejected-pattern halt named no gateway path. This phase migrates those rows, closes the four gaps around them, records the migration row after session classification in the research and review workflows, and refuses a mistyped config field by name."
trigger_phrases:
  - "legacy row migration"
  - "phase 12 legacy row migration"
  - "pinned legacy rows"
  - "upcast keeps row timestamp"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: legacy-row-migration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/158-open-items-live-hop-and-legacy-rows` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-gateway-enforcement-and-projection-hygiene |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the related deep-loop suites, the stem census, the bootstrap test and the typecheck pass, and `validate.sh` on this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the deep-loop review and CLI lineage specification.

**Scope Boundary**: The five Known Limitations phase 011 recorded: the still-pinned legacy rows, upcast arms that took the append time, the generic refusal for a mistyped field, the missing operator path for rejection rows in a ledger-backed run, and the camelCase removal and reset names in `state-jsonl.md`.

**Dependencies**:
- Phase 011's registered reducer and idea stems and its field-for-field projection arm.

**Deliverables**:
- Eleven new research stems with schema rules, census entries, projection arms and upcaster translation.
- The research workflows route the lifecycle rows that now have a stem through the gateway.
- Every upcast arm keeps the row's own UTC timestamp, and a mistyped field gets a named refusal.
- The rejected-pattern halt and two reference docs name the gateway path, in snake_case.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research upcaster pinned pivot rows, `stuckRecovery`, `userPaused`, `novelty_signal_inert`, `trend_flatline`, `migration` and `min_iterations_guard_pass`, so none of them could reach the ledger. In a ledger-backed run the next projection replace dropped any of them from the state log, and the workflows only printed the pause, recovery and guard rows instead of recording them. Every upcast arm except the idea and conflict rows took the append time, so each projected row lost its own timestamp. A wrongly typed value such as `run: "4"` reached the schema and came back with its generic error. The rejected-pattern halt told the operator to remove or reset a pattern but not how to do it without the edit being replaced, and `state-jsonl.md` named the removal and reset rows in camelCase while the code and the feature catalog use snake_case.

### Purpose
Every legacy row a research run writes survives a projection replace with its own fields and its own timestamp, and an operator can act on a refusal or a halt from the message alone.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stems, schema rules, types, census entries and projection arms for `user_paused`, `stuck_recovery`, `min_iterations_guard_pass`, `migration`, `novelty_signal_inert`, `trend_flatline`, `pivot_override_accepted`, `pivot_started`, `pivot_selected`, `pivot_completed` and `pivot_failed`.
- The upcaster translates those rows, keeps every row's own UTC timestamp, and names a mistyped field.
- Both research workflows send the pause, recovery, guard, override and migration rows through the gateway. The migration row is appended once per session at the top of the iteration loop, after session classification and the run opening.
- The config arm refuses a wrongly typed count, topic or executor by name, and carries a count written as a plain digit string as that number with a warning.
- Both review workflows only move legacy `scratch/` review state before classification. A resume or synthesis then sets the moved hand-written state log aside, opens the run from the moved config and replays its iteration rows through the gateway, and `deep_review.migration` is appended once right after the loop's lock refresh.
- The halt message, `state-jsonl.md` and `loop-protocol.md` name the gateway path in snake_case.

### Out of Scope
- Review-mode rows: the review gateway has no legacy upcaster, and its rows travel under explicit stems already.
- Rows that stay pinned with no stem: `config_warning`, `graph_convergence`, `lock_released`, `schema_mismatch`, `manualStop`, `pivot_confirm_accepted` and the run-now and synthesis rows.
- An upcaster for the other legacy review row kinds, such as `claim_adjudication`. A moved log keeps them only in its set-aside file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`, `deep-research-ledger-schema.ts` | Modify | Stems, data types, census, rules, mistyped-field finder |
| `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modify | Translation, own timestamp, named mistyped refusal |
| `runtime/lib/legacy-projections/deep-research-contract.ts`, `runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Modify | Projection arms, reducer no-op arms |
| Research workflow YAMLs and the compiled research contract | Modify | Routing, migration step after classification, halt message |
| `deep-research/references/state/state-jsonl.md`, `deep-research/references/protocol/loop-protocol.md` | Modify | snake_case names, operator path |
| Review workflow YAMLs, the compiled review contract and `deep-review/references/protocol/loop-protocol.md` | Modify | Move-only rehome, adoption of a moved state log, migration step after classification |
| Runtime tests | Modify | Failing-first tests and the census count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the seven pinned row kinds upcasts to a registered stem and projects back as the same row, and a ledger-backed run keeps the rows its workflows record. |
| REQ-002 | Every upcast arm keeps the legacy row's own UTC timestamp as the event time. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A wrongly typed field is refused with a reason that names the row kind and the field. |
| REQ-004 | The rejected-pattern halt and the reference docs give the gateway command for a removal or reset, and the docs use the names the code emits. |
| REQ-005 | Each change has a test that fails on the pre-phase sources, and the census, typecheck and related suites pass. |
| REQ-006 | Both research workflows append the migration row through the gateway after session classification and the run opening, with no log-only exception left. |
| REQ-007 | The config arm refuses a wrongly typed count, topic or executor as `run-initialized-fields-mistyped:<field>`, and converts only a lossless digit-string count, with a warning. |
| REQ-008 | Both review workflows append `deep_review.migration` through the gateway after session classification and the run opening, and a moved legacy state log is adopted so later appends pass the gateway. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In a ledger-backed run, the guard, recovery, override and pause rows appended through the real gateway CLI are still in the state log, field for field, after the next append, and the config and iteration rows carry their own timestamps.
- **SC-002**: The related deep-loop suites pass, and strict validation of this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The pause, recovery, guard and override rows now go through the gateway, so a refused one halts the step | Medium | The bookkeeping-emission suite drives every rendered workflow row through the real gateway CLI |
| Risk | A ledger written with the new stems cannot be read by a runtime that predates them | Medium | Same posture as phase 011; reverting needs the consumers reverted too |
| Risk | Appending the migration row before session classification would create the state log and turn a fresh packet into a partial one | High if early | The row is appended once per session at the top of the iteration loop, and a test pins it after classification and the run opening in both workflows |
| Risk | Adopting a moved review log replaces its hand-written config row with the projected one and keeps only its iteration rows in the state log | Medium | The hand-written log is set aside unchanged as `deep-review-state.legacy.jsonl`, and the replay reports how many rows it kept only there. No scratch-era review log exists on disk today |
| Risk | A config row already on disk with a mistyped count would now halt its run | Low | A lossless digit-string count converts with a warning. A survey of 1,148 state logs found no config row with a mistyped count, topic or executor |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The mistyped-field check runs once per upcast over the row's own fields, with no extra ledger read.

### Security
- **NFR-S01**: The new stems keep the schema's forbidden mutable field check, including inside the structured pivot fields.

### Reliability
- **NFR-R01**: A row with no timestamp still upcasts and takes the append time, and a timestamp that is not a UTC instant leaves a warning instead of a refusal on the arms that accepted it before.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A stuck recovery row may carry the workflow's fields or the documented ones, and both shapes round-trip.
- A trend advisory written with a null timestamp is refused, because the projection could not write it back.

### Error Scenarios
- `run: "4"` on an idea row is refused with `idea-observed-fields-mistyped:run`.
- A pause row whose `stopReason` is not `userPaused` is refused with `user-paused-fields-mistyped:stopReason`.
- A config row with `maxIterations: "4"` is carried as 4 with a warning, and `"4.0"`, `"04"` or `-1` is refused with `run-initialized-fields-mistyped:maxIterations`.

### State Transitions
- A pivot row that a research state log never held before still upcasts when an operator records it, keyed by its `pivotId`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Schema, types, upcaster, projector, reducer, two workflows, two docs |
| Risk | 12/25 | The ledger registry and the workflow append path change |
| Research | 8/20 | Producer census per row kind, migration timing |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Whether the other legacy review row kinds should get an upcaster, so a moved log keeps them in the state log too, is a later phase's call.
<!-- /ANCHOR:questions -->

---
