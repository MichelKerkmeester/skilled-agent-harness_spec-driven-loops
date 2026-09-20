---
title: "Implementation Plan: Persona-Injection Contract Design"
description: "How the persona-injection contract is synthesized from the verified P1 inventory and the orchestrate.md + DESIGN_DISPATCH_MANIFEST precedents, then verified deterministically."
trigger_phrases:
  - "persona injection contract plan"
  - "contract design synthesis plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/002-persona-injection-contract"
    last_updated_at: "2026-08-19T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored contract design plan"
    next_safe_action: "Author the contract into scratch/persona-injection-contract.md"
    blockers: []
    key_files:
      - "../001-analysis-inventory/scratch/dispatch-point-inventory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-002-contract"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Persona-Injection Contract Design

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Domain** | OpenCode CLI dispatch contracts + agent-persona injection |
| **Executor** | Orchestrator synthesis (reduce of the verified P1 inventory) |
| **Inputs** | `../001-analysis-inventory/scratch/dispatch-point-inventory.md`; `orchestrate.md` protocol; `DESIGN_DISPATCH_MANIFEST v1` |
| **Output** | `scratch/persona-injection-contract.md` |

### Overview
Phase 002 designs ONE shared contract that P3 (mode SKILLs + hub) and P4 (sk-prompt) each reference. It is a synthesis of the verified P1 inventory plus two existing precedents — not a new mechanism. No shipped file is edited in this phase; the contract only specifies WHAT and WHERE P3/P4 implement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] P1 inventory complete + validated (`001-analysis-inventory`)
- [x] Precedents located (`orchestrate.md:138`; Rule 14 per mode `SKILL.md`)
- [x] Placement target confirmed (`cli-prompt-quality-card.md` is the canonical CLI prompt-craft source)

### Definition of Done
- [ ] Contract covers all 7 required sections
- [ ] Every mechanism verdict traces to P1 `§C`
- [ ] Placement plan names canonical + per-mode + hub homes
- [ ] `validate.sh --strict` passes for this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator reduce: one coherent contract synthesized from the verified inventory, reusing proven precedents rather than inventing a mechanism.

### Key Components
- **The rule + resolution**: invariant + runtime-aware (AGENTS.md §7) persona resolution.
- **Mechanism table**: per dispatch surface, native-load vs inline, from P1 `§C`.
- **Inline block format**: the `DESIGN_DISPATCH_MANIFEST`-style payload wrapper.
- **Placement plan**: canonical home + per-mode Rule + one hub ALWAYS rule.

### Data Flow
1. Read the verified P1 `§C` table.
2. Transcribe verdicts into the contract mechanism table.
3. Define the inline block + exceptions + placement.
4. Orchestrator cross-checks each verdict against P1 before accepting.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the verified P1 inventory + locate the reuse precedents
- [x] Confirm the canonical placement target (`cli-prompt-quality-card.md`)

### Phase 2: Core Implementation
- [x] State the rule + resolution + subtask→persona mapping
- [x] Transcribe the per-surface mechanism table from P1
- [x] Define the inline block format + exceptions + placement

### Phase 3: Verification
- [ ] Cross-check every verdict against P1 `§C`
- [ ] Confirm precedents exist in source
- [ ] Record summary; run validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Traceability | Every `§3` verdict | Cross-read against P1 `dispatch-point-inventory.md` §C |
| Precedent | Reuse claims | Confirm `orchestrate.md:138` + Rule 14 exist in source |
| Completeness | All modes + fanout runtime | Compare contract `§3` rows against the 6 modes + `fanout-run.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| P1 verified inventory | Internal | Green (validated) | No mechanism table without it |
| `orchestrate.md` protocol | Internal | Green | Precedent for the rule |
| `DESIGN_DISPATCH_MANIFEST v1` | Internal | Green | Precedent for the inline block |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Contract is inconsistent with the verified inventory.
- **Procedure**: Discard `scratch/persona-injection-contract.md` and re-synthesize. No shipped file touched, so nothing to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Author ──> Verify ──> Record
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author | P1 inventory | Verify |
| Verify | Author | Record |
| Record | Verify | P3 |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author | Medium | synthesis of P1 output |
| Verify | Low | deterministic cross-read |
| Record | Low | short |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-dispatch Checklist
- [x] No shipped files in scope (design-only phase)
- [x] Output confined to `scratch/`

### Rollback Procedure
1. Delete `scratch/persona-injection-contract.md`.
2. Re-synthesize from the P1 inventory.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:l2-rollback -->
