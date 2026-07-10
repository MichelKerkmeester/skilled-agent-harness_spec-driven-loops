---
title: "Feature Specification: 003 Fixtures"
description: "Labeled eval task JSONL and fixture scaffolds for the code graph adoption harness."
trigger_phrases:
  - "027 006 003 fixtures"
  - "labeled eval tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/004-code-graph-adoption-eval/003-fixtures"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Author labeled task JSONL after 001 lands"
    blockers: ["Depends on 001-harness-skeleton"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-003-fixtures"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 003 Fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-12 |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval` |
| **Depends On** | `001-harness-skeleton` |
| **Estimated LOC** | ~20 data lines plus scaffolds |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The harness needs repeatable local tasks with expected file-read and completeness labels. Without curated fixtures, measured file-read reduction and answer quality become anecdotal.

### Purpose
Create `eval/tasks/labeled-tasks.jsonl` with 12-20 labeled tasks and any lightweight fixture scaffolds needed by the harness.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 12-20 JSONL task rows.
- Expected files-to-read labels.
- Expected completeness keyword labels.
- Fixture loader compatibility with child 001.

### Out of Scope
- Report metric calculations.
- Token DB reads.
- Live provider dispatch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/scripts/dist/eval/tasks/labeled-tasks.jsonl` | Create | 12-20 labeled local eval tasks |
| `mcp_server/scripts/dist/eval/tasks/README.md` | Create/Modify | Fixture schema notes if needed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provide 12-20 valid task rows | JSONL file has at least 12 and no more than 20 valid JSON objects |
| REQ-002 | Each task names expected files | Every row includes `expected_files_to_read` with at least one path |
| REQ-003 | Each task names completeness labels | Every row includes `expected_completeness_keywords` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Tasks target local repository work | Prompts avoid external dependencies and unstable network calls |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Fixture loader can parse all rows.
- Labels support file-reads-avoided and answer-completeness metrics.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 harness skeleton | High | Use its final loader contract |
| Risk | Tasks are too easy | Medium | Include mixed discovery, edit, and review-style prompts |
| Risk | Labels become stale | Medium | Prefer stable system-spec-kit files and validate paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Task rows must be deterministic local prompts.
- **NFR-M01**: Fixture schema should be readable by humans and machines.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Task path no longer exists.
- Duplicate task ids.
- Empty expected keyword list.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | Low | Bounded child packet with a narrow implementation surface |
| Risk | Medium | Integration with the parent harness contract must stay aligned |
| Dependencies | Medium | Depends on the declared predecessor packets |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Predecessor**: `../001-harness-skeleton/spec.md`
<!-- /ANCHOR:related-docs -->

