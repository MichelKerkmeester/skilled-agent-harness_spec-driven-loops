---
title: "Implementation Plan: Persona-Injection Enforcement Verification"
description: "How the objective persona-injection sweep, the recursive validate gate, and the regression delta are run and recorded to close the packet."
trigger_phrases:
  - "persona injection verification plan"
  - "final sweep gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/005-verification"
    last_updated_at: "2026-08-19T11:39:00Z"
    last_updated_by: "claude"
    recent_action: "Sweep + recursive gate + regression delta recorded"
    next_safe_action: "Operator review, then merge to v4"
    blockers: []
    key_files:
      - "scratch/persona-injection-sweep.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-005-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Persona-Injection Enforcement Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Domain** | Objective verification of the persona-injection enforcement across two trees |
| **Executor** | Orchestrator-run deterministic sweep (grep/audit) + `validate.sh` |
| **Inputs** | The P3/P4 edits (6 modes + hub + canonical card) |
| **Output** | `scratch/persona-injection-sweep.md` + the recursive validate result |

### Overview
Phase 005 proves the enforcement is complete and regression-free. The sweep is deterministic grep/audit (authoritative for a presence/absence proof); the packet gate is `validate.sh --recursive --strict`. No shipped file is edited in this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] P3 + P4 complete + validated
- [x] All dispatch surfaces enumerated (6 modes, hub, card, 6 thin cards)

### Definition of Done
- [x] Sweep confirms the rule on every surface + the negative proof
- [x] `validate.sh --recursive --strict` = 5/5 PASSED, Errors:0
- [x] Regression delta recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic completeness audit + authoritative gate. The sweep enumerates every dispatch surface; a negative-proof grep confirms no sanctioned persona-less path; the packet gate confirms the docs are structurally clean.

### Key Components
- **Presence sweep**: rule in 6 modes + hub + canonical card §6; each mode cites the card.
- **Negative proof**: `rg` for any rule sanctioning a bare/persona-less dispatch → none.
- **Thin-card check**: 6 thin cards delegate to the canonical card.
- **Gate**: `validate.sh --recursive --strict` across the packet.

### Data Flow
1. Enumerate dispatch surfaces across the two trees.
2. Grep each for the persona rule / canonical reference.
3. Run the negative-proof grep.
4. Run the recursive gate; record the regression delta.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate the dispatch surfaces (6 modes, hub, canonical card, 6 thin cards)
- [x] Define the presence + negative-proof grep patterns

### Phase 2: Core Implementation
- [x] Run the presence sweep (rule in every surface; each mode cites the card)
- [x] Run the negative-proof sweep + the thin-card delegation check
- [x] Record results in `scratch/persona-injection-sweep.md`

### Phase 3: Verification
- [x] Run `validate.sh --recursive --strict` on the packet (5/5 Errors:0)
- [x] Record the regression delta (docs-only, no functional regression)
- [x] Confirm no shipped file changed in this phase (`git status` scoped)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Presence | 6 modes + hub + card | `grep` for the rule + canonical reference |
| Negative proof | All SKILLs | `rg` for persona-less-dispatch sanction → expect none |
| Delegation | 6 thin cards | `grep` for canonical-card delegation |
| Gate | Whole packet | `validate.sh --recursive --strict` = 5/5 Errors:0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| P3 mode + hub edits | Internal | Green | Nothing to verify |
| P4 canonical section | Internal | Green | Reference target missing |
| `validate.sh` | Internal tool | Green | No authoritative gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The sweep finds a missing surface or a persona-less-dispatch sanction.
- **Procedure**: Reopen the owning phase (P3 for a mode/hub gap, P4 for the card) and fix; re-run the sweep. This phase edits no shipped file, so nothing to revert here.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Enumerate ──> Sweep ──> Gate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Enumerate | P3 + P4 | Sweep |
| Sweep | Enumerate | Gate |
| Gate | Sweep | Packet done |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Enumerate | Low | list surfaces |
| Sweep | Low | grep/audit |
| Gate | Low | one recursive validate |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-dispatch Checklist
- [x] Read-only phase; no shipped file in scope
- [x] Sweep output confined to `scratch/`

### Rollback Procedure
1. No shipped-file change to revert.
2. If a gap is found, reopen the owning phase and fix there.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:l2-rollback -->
