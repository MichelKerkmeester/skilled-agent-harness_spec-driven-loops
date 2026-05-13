---
title: "Implementation Plan: 004 Report Generator"
description: "Level 2 plan for eval markdown report generation."
trigger_phrases:
  - "027 006 004 plan"
  - "report generator plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-code-graph-adoption-eval/004-report-generator"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 plan.md"
    next_safe_action: "Implement Report Generator work when dependencies are ready"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-004-report-generator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 004 Report Generator

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Eval reporting library |
| **Storage** | JSONL result rows |
| **Testing** | Vitest via child 005 |

### Overview
Implement report generation over harness result rows, with special care around complete-pair accounting.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child 001 result row schema is available.

### Definition of Done
- [ ] Report computes token and file-read deltas.
- [ ] Incomplete pairs are counted and excluded from paired stats.
- [ ] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure report function over parsed result rows.

### Key Components
- **Row parser**: normalizes success, timeout, and failed rows.
- **Pair grouper**: groups rows by task id and condition.
- **Metric reducer**: computes complete-pair deltas.
- **Markdown renderer**: emits deterministic report text.

### Data Flow
Result rows are parsed, grouped into pairs, reduced to metrics, and rendered into markdown.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm result schema from child 001.

### Phase 2: Core Implementation
- [ ] Implement row grouping and metric reducers.
- [ ] Implement markdown rendering.

### Phase 3: Verification
- [ ] Test complete, incomplete, skipped, and malformed rows.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | pair grouping and metric math | Vitest |
| Integration | report over fixture rows | Child 005 Vitest |
| Validation | Spec folder structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 harness skeleton | Internal | Pending | No stable row schema |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Report generator misstates paired metrics.
- **Procedure**: Disable report generation and preserve raw JSONL until metric reducers are corrected.
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
| Setup | Low | 15 minutes |
| Core Implementation | Medium | 1-2 hours |
| Verification | Medium | 45 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Complete-pair logic has fixture coverage.
- [ ] Markdown output is deterministic.

### Rollback Procedure
1. Stop invoking the report generator from the CLI.
2. Preserve raw JSONL rows.
3. Re-run reducer tests after fixes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete generated markdown report if it is known bad.
<!-- /ANCHOR:enhanced-rollback -->

