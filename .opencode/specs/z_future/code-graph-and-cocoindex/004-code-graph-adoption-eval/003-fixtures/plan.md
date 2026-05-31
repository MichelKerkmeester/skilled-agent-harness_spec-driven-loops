---
title: "Implementation Plan: 003 Fixtures"
description: "Level 2 plan for labeled task fixtures."
trigger_phrases:
  - "027 006 003 plan"
  - "fixtures plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval/003-fixtures"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 plan.md"
    next_safe_action: "Implement Fixtures work when dependencies are ready"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-003-fixtures"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 003 Fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSONL fixture data |
| **Framework** | Eval harness task loader |
| **Storage** | Local repository fixture file |
| **Testing** | JSONL parse tests via child 005 |

### Overview
Curate the labeled local task set used by both baseline and after conditions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child 001 fixture loader contract is available.
- [ ] Candidate local task surfaces are selected.

### Definition of Done
- [ ] JSONL contains 12-20 valid task rows.
- [ ] Expected files and completeness keywords exist for every task.
- [ ] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Static JSONL task catalog loaded by the harness.

### Key Components
- **Task id**: stable unique id.
- **Prompt**: local repo task instruction.
- **Expected files**: file-read label set.
- **Completeness keywords**: answer quality label set.

### Data Flow
The harness loads JSONL rows, expands each task across baseline and after conditions, and uses labels during metric computation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Select candidate task surfaces.

### Phase 2: Core Implementation
- [ ] Author JSONL rows.
- [ ] Add fixture schema notes if needed.

### Phase 3: Verification
- [ ] Parse all rows.
- [ ] Confirm expected file paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | JSONL parse and schema validation | Vitest |
| Manual | Label quality spot check | Reviewer |
| Validation | Spec folder structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 harness skeleton | Internal | Pending | Fixture path/schema may drift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Task labels prove stale or low quality.
- **Procedure**: Remove bad rows and re-run fixture validation before live eval.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 001 | Core implementation |
| Core implementation | Setup | Child 005 |
| Verification | Core implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30 minutes |
| Core Implementation | Medium | 1-2 hours |
| Verification | Low | 30 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Task ids are unique.
- [ ] Expected files exist.

### Rollback Procedure
1. Remove or replace stale task rows.
2. Re-run JSONL parse validation.
3. Re-run strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Revert fixture rows.
<!-- /ANCHOR:enhanced-rollback -->

