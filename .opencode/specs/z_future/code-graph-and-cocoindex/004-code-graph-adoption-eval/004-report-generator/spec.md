---
title: "Feature Specification: 004 Report Generator"
description: "Markdown report generator for token-reduction and file-reads-avoided eval metrics."
trigger_phrases:
  - "027 006 004 report generator"
  - "eval report generator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/004-code-graph-adoption-eval/004-report-generator"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement report generator after 001 lands"
    blockers: ["Depends on 001-harness-skeleton"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-004-report-generator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 004 Report Generator

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
| **Estimated LOC** | ~50 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Raw harness JSONL is not enough to decide whether code_graph adoption produced a meaningful productivity lift. The harness needs a report that computes paired metrics and accounts for skipped or incomplete rows.

### Purpose
Create `lib/eval/report-generator.ts` to summarize token reduction, file reads avoided, complete/incomplete pair counts, and report-ready verdicts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read harness result rows.
- Compute token-reduction deltas.
- Compute file-reads-avoided summaries.
- Count skipped, incomplete, and complete pairs separately.
- Render markdown report output.

### Out of Scope
- Token DB reads.
- Task fixture authoring.
- Live subprocess dispatch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/eval/report-generator.ts` | Create | Eval report generator |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compute token reduction | Report includes baseline, after, and delta token totals |
| REQ-002 | Compute file reads avoided | Report includes file-read reduction summary |
| REQ-003 | Separate complete/incomplete pairs | Paired stats include only complete baseline/after pairs |
| REQ-004 | Render markdown | Report output is readable and committed/generated as markdown |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Include skipped row accounting | Report counts skipped rows and explains exclusions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Report clearly states whether token usage and file reads improved.
- Incomplete rows cannot silently corrupt paired statistics.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 harness skeleton | High | Use final result row schema |
| Risk | Incomplete pairs skew results | High | Count incomplete rows separately |
| Risk | Report math diverges from labels | Medium | Cover with child 005 fixtures |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-M01**: Report output must be deterministic for the same input rows.
- **NFR-R01**: Malformed rows should be reported, not ignored.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Baseline exists without after row.
- After exists without baseline row.
- Metrics are null for a failed row.
- Token counts are missing but file-read metrics exist.
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

