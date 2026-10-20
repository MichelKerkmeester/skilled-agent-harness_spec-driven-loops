---
title: "Implementation Plan: Phase 12: legacy-row-migration"
description: "Register stems for the seven still-pinned legacy row kinds, route the workflow rows that now have a stem through the gateway, keep every row's own timestamp, name a mistyped field, and give the rejected-pattern halt its gateway path, each with a failing-first test."
trigger_phrases:
  - "legacy row migration plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: legacy-row-migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime, CommonJS scripts, YAML workflows |
| **Framework** | The deep-loop ledger, append gateway and legacy projections |
| **Storage** | Ledger frames and the projected `deep-research-state.jsonl` |
| **Testing** | vitest, the stem census, `node --test`, `npm run typecheck` |

### Overview
One round on phase 011's pattern: each pinned row kind gets a stem whose payload keeps the row's own field names, a projection arm that writes the row back in its documented key order, and an upcaster shape. The upcaster then keeps every row's own UTC timestamp and checks each field against its schema rule before the schema sees it. The workflows send the rows that now have a stem through the gateway, and the migration row is appended at the top of the iteration loop, after session classification. The config arm refuses a mistyped field by name. The review workflows follow the same order: the rehome step only moves files, a resume adopts the moved hand-written state log, and the migration row is appended right after the loop's lock refresh.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The ledger is the authority and the state log its projection. A row that must survive has a registered stem, an upcaster shape that carries its fields as written, and a projection arm that rebuilds the exact legacy row.

### Key Components
- **`REDUCER_READ_ROW_SHAPES`**: one shape per field-for-field row kind, now including the lifecycle, advisory and pivot rows.
- **`findMistypedDeepResearchField`**: the first field whose value breaks its schema rule, so the upcaster refuses with `<kind>-fields-mistyped:<field>`.
- **The timestamp rule**: after any arm, a row's own UTC `timestamp` becomes the event time. A timestamp that is not a UTC instant leaves the append time and a warning.
- **`step_record_artifact_migration`**: a once-per-session step at the top of the iteration loop that appends the migration row the canonical-name step detected.
- **`on_moved_legacy_state`**: the review classification hook that sets a moved hand-written state log aside, opens the run from the moved config and replays its iteration rows through the gateway.
- **`legacyConfigFields`**: checks a config row's counts, topic and executor, and converts a lossless digit-string count.

### Data Flow
A legacy row reaches the gateway CLI. The upcaster picks the stem, checks the shape, the field types and the timestamp, and hands over the row's own time as the event time. The gateway appends, and the projection rebuilds the row in its legacy shape.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Research stem registry and census | Registered stems and producers | update: eleven stems, all reserved | stem census |
| Legacy upcaster | Pinned seven row kinds, append time on most arms, silent config defaults | update: translate, own timestamp, named mistyped refusal on every arm | ledger-schema tests |
| Research projection contract | No arm for the pinned rows | update: field-for-field arms | ledger-schema round trips |
| Research workflows | Printed pause, recovery, guard, override and migration rows | update: append through the gateway, migration after classification | bookkeeping-emission suite |
| Review workflows | Appended the migration row before classification into a moved log the gateway refuses | update: move only, adopt the moved log after classification, migration step right after the loop's lock refresh | review run-open suite |
| Rejected-pattern halt and docs | Named no gateway path, camelCase names | update | halt-message test, doc read |

Required inventories:
- Same-class producers: the census reports 86 registered, 23 spoken, 0 violations. The trend advisories are registry-only in the reducer, and the pivot lifecycle rows go to the pivot's own council state log, so neither has a research state-log producer to route.
- Consumers of changed symbols: the projection contract, the ledger reducer's exhaustive stem switches, both reducers' dashboard status, and the compiled research contract.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Upcaster, schema, projector round trips, mistyped and timestamp cases | vitest |
| Integration | Lifecycle rows through the real gateway CLI in a ledger-backed run | vitest |
| Workflow | Every rendered research workflow row through the gateway, the halt message | vitest |
| Census | Registered and spoken stems | `check-ledger-stem-producers.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011's field-for-field arm | Internal | Green | No shape to extend |
| `compile-command-contracts.cjs` | Internal | Green | The drift check would flag the edited workflows and protocol doc |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a deep-research run regresses after merge.
- **Procedure**: revert the phase commit and rebuild the compiled research contract. A ledger written meanwhile with the new stems needs the revert of its consumers too.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Failing tests ──► Stems + upcaster + projector ──► Workflows + docs ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Failing tests | Phase 011 | Implementation |
| Implementation | Failing tests | Verify |
| Verify | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | Producer census per row kind |
| Core Implementation | Med | One round on phase 011's pattern |
| Verification | Med | Related sweep, census, typecheck, red swap |
| **Total** | | **About half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no stored data rewritten
- [x] Feature flag configured: not applicable
- [x] Monitoring alerts set: refusals keep landing in `gateway-refusals.jsonl`

### Rollback Procedure
1. Revert the phase commit.
2. Rerun `compile-command-contracts.cjs --command deep/research --write`.
3. Rerun the related deep-loop suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
