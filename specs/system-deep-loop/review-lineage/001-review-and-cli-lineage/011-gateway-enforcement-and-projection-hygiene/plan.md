---
title: "Implementation Plan: Phase 11: gateway-enforcement-and-projection-hygiene"
description: "Enforce the gateway rule in code, make the append idempotent, carry topics, and register the reducer and idea rows so the projection keeps them, each with a failing-first test."
trigger_phrases:
  - "gateway enforcement plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: gateway-enforcement-and-projection-hygiene

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime, CommonJS scripts, YAML workflows |
| **Framework** | The deep-loop ledger, append gateway and legacy projections |
| **Storage** | Ledger frames and the projected `deep-*-state.jsonl` |
| **Testing** | vitest, the stem census, `npm run typecheck` |

### Overview
Three rounds, each closing the gaps the previous one exposed: enforcement and topics, then idempotency, the runner class and reducer rows, then idea rows and the upcaster.
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
The ledger is the authority and the state log its projection. Every row that must survive has a registered stem and a projection arm that rebuilds its exact legacy shape.

### Key Components
- **`findUnattributedStateLog`**: a config row in the state log with no `run_initialized` in the ledger proves a direct write.
- **Idempotency key**: `<mode>:input:sha256(event)` unless the caller names one.
- **`unattributed_state_log`**: the runner's class for a lineage the gateway never wrote.

### Data Flow
An event reaches the gateway. The gateway reads the ledger once for provenance and the key, refuses or replays where it must, appends, and refreshes the state log from the ledger.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Gateway append | Authorize, append, project | update: provenance first, idempotent replay | run-open tests |
| Runner lineage validation | Classifies lineage failures | update: new class | `fanout-run` test |
| `run_initialized` (research, review) | Opens a run | update: optional `topic` | init-step tests |
| Reducer rows, idea rows | Hand-written, dropped | update: registered stems through the gateway | reduce-state tests |
| Legacy upcaster | Pinned these rows | update: translates them | ledger-schema tests |

Required inventories:
- Same-class producers: `check-ledger-stem-producers.cjs` reports 75 registered, 23 spoken, 0 violations.
- Consumers of changed symbols: the projection contracts, `fanout-pool` rollups and the workflow YAMLs.
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
| Unit | Gateway, schemas, projector, upcaster, reducer | vitest |
| Integration | Runner with gateway-backed stub lineages | vitest |
| Replay | Luna's real event on a copy of its lineage | `append-mode-event.cjs` |
| Census | Registered and spoken stems | `check-ledger-stem-producers.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 010's brief fix | Internal | Green | Lineages would keep writing directly |
| `compile-command-contracts.cjs` | Internal | Green | The fix-mode renderer would refuse the edited workflows |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a deep-loop run regresses after merge.
- **Procedure**: revert the phase commit and rebuild the compiled contracts. Ledgers written meanwhile carry optional fields old code ignores; new stems would need the revert of their consumers too.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Enforcement + topic ──► Idempotency + runner class + reducer rows ──► Idea rows + upcaster ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Round 1 | Phase 010 | Round 2 |
| Round 2 | Round 1 | Round 3 |
| Round 3 | Round 2 | Verify |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | Replays of the failed lineage |
| Core Implementation | High | Three rounds |
| Verification | Med | The related sweep, census and typecheck |
| **Total** | | **About a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no stored data rewritten
- [x] Feature flag configured: not applicable
- [x] Monitoring alerts set: refusals land in `gateway-refusals.jsonl`

### Rollback Procedure
1. Revert the phase commit.
2. Rerun `compile-command-contracts.cjs --write` for `deep/research` and `deep/review`.
3. Rerun the related deep-loop suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
