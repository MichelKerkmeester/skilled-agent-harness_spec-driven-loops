---
title: "Feature Specification: Code Graph Documentation Audit"
description: "Read-only audit of system-code-graph documentation against shipped 028 code-graph behavior."
trigger_phrases:
  - "code graph doc audit"
  - "system-code-graph documentation alignment"
  - "doc-symbol lane audit"
  - "parser resilience documentation gap"
importance_tier: "normal"
contextType: "general"
parent: "system-code-graph"
predecessor: "002-false-now-doc-corrections"
successor: "011-fix-code-graph-docs"
_memory:
  continuity:
    packet_pointer: "system-code-graph/005-code-graph-doc-audit"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Complete code graph documentation audit"
    next_safe_action: "Run strict validation for the audit phase"
    blockers: []
    key_files:
      - ".opencode/specs/system-code-graph/005-code-graph-doc-audit/review-report.md"
      - ".opencode/specs/system-code-graph/005-code-graph-doc-audit/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "code-graph-doc-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Code Graph Documentation Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | Current worktree, no commit requested |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 008 parent identified a coverage gap for system-code-graph documentation after the 028 code-graph work. The task was not to fix code or docs directly, but to run a read-only adversarial audit that could separate current documentation from stale, false, or incomplete coverage.

### Purpose

Produce a cited review report that names confirmed documentation drift in `.opencode/skills/system-code-graph/**`, distinguishes those findings from areas already current, and provides a reliable handoff for follow-up remediation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit `SKILL.md`, `README.md`, `ARCHITECTURE.md`, `INSTALL_GUIDE.md`, `feature_catalog/**`, `manual_testing_playbook/**`, `references/**`, and `changelog/**` for system-code-graph.
- Compare documentation claims against `.opencode/specs/system-code-graph/001-code-graph-core/**` and live `mcp_server/` implementation evidence.
- Record confirmed findings with file-line citations in `review-report.md`.

### Out of Scope

- Runtime code edits.
- Documentation fixes in the audited skill.
- Tests, generated metadata, or git commits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review-report.md` | Created | Read-only audit report with six confirmed findings. |
| `spec.md` | Created | This completion spec. |
| `plan.md` | Created | Audit execution and verification plan. |
| `tasks.md` | Created | Audit task ledger. |
| `implementation-summary.md` | Created | Delivered audit summary and evidence ledger. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit the named system-code-graph documentation surfaces. | `review-report.md:3-4` records the target surface and read-only mode. |
| REQ-002 | Separate confirmed findings from inferred claims. | `review-report.md:12` and `review-report.md:114` state 6 confirmed and 0 inferred findings. |
| REQ-003 | Identify behavior-level documentation drift. | F1 and F2 document the doc-symbol lane and parser transient/fatal retry documentation gaps at `review-report.md:29-55`. |
| REQ-004 | Identify topology and precision drift. | F3 through F6 document handler, parser-package, version, and cataloging precision drift at `review-report.md:57-87`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Call out current areas so follow-up work does not over-correct. | `review-report.md:91-99` records the no-finding surfaces. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The audit report gives a severity-ranked list of confirmed findings.
- **SC-002**: Each finding includes the documentation claim and the implementation or topology evidence used to validate it.
- **SC-003**: The report is read-only and does not modify audited code or docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Audit premise overstates prior coverage gaps | Could over-correct already current docs | `review-report.md:16-23` corrects the premise to "partially audited, with specific confirmed gaps." |
| Risk | Finding based only on stale docs | Could create false remediation work | The report records 0 inferred findings and cites opened source files. |
| Dependency | Live source and docs are available | Needed for file-line evidence | The audit read live source and docs directly. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence Quality

- **NFR-E01**: Findings must be confirmed against direct file reads, not inferred from summary prose.
- **NFR-E02**: The report must preserve a concise evidence ledger for follow-up executors.

### Scope Control

- **NFR-S01**: Audit execution must remain read-only.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Already remediated surfaces**: Record as current rather than count as drift.
- **Partially documented features**: Scope the finding to the missing or false claim only.
- **Topology docs**: Treat non-existent directories as documentation navigation defects, not runtime defects.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
