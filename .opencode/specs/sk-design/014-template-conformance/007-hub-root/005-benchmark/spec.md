---
title: "Feature Specification: sk-design hub benchmark conformance"
description: "Run the exhaustive audit of every file under `.opencode/skills/sk-design/benchmark/` against `.opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules (no authored benchmark/ template; these are frozen dated-run-record directories)`. \"Conformant, no changes\" is a legitimate outcome of this leaf."
trigger_phrases:
  - "sk-design hub benchmark conformance"
  - "template conformance audit"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/007-hub-root/005-benchmark"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec for template-conformance leaf"
    next_safe_action: "Run exhaustive audit against the governing template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/benchmark/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: sk-design hub benchmark conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `004-manual-testing-playbook` |
| **Successor** | `006-styles` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/sk-design/benchmark/` has not been audited against `.opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules (no authored benchmark/ template; these are frozen dated-run-record directories)`. No defects are known yet — this leaf's first task is the exhaustive audit itself.

### Purpose
Run the exhaustive audit of every file under `.opencode/skills/sk-design/benchmark/` against `.opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules (no authored benchmark/ template; these are frozen dated-run-record directories)`. "Conformant, no changes" is a legitimate outcome of this leaf.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every file listed in the Files to Change table below.
- Structural conformance to `.opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules (no authored benchmark/ template; these are frozen dated-run-record directories)`.
- Recording the following as observations (not defects): benchmark/compiled-routing/ has no index file while its 7 sibling run-record dirs each have one (e.g. baseline/README.md) — this is a real anomaly, but the FIX is owned by sibling packet 008-structural-anomalies, not this leaf; frozen run records (results.csv, skill-benchmark-report.json/.md, findings-and-recommendations.md, failed-runs.md, source.md) are historical provenance and must NOT be rewritten.

### Out of Scope
- Adding an index file to benchmark/compiled-routing/ — owned by sibling 008-structural-anomalies, this leaf only documents the anomaly.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-design/benchmark/README.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/benchmark/reports/baseline/ | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/benchmark/reports/2026-07-06--after-009--router/ | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/benchmark/reports/2026-07-06--after-012-routing-rigor--router/ | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/benchmark/reports/2026-07-06--after-d3-proxy--router/ | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/benchmark/reports/2026-07-07--after-016-hub-routing--live/ | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/benchmark/reports/2026-07-07--after-018-transport-integration--live/ | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/benchmark/reports/2026-07-07--after-022-coverage-fill--live/ | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/benchmark/reports/compiled-routing/ (3 nested dated run dirs, no index) | Audit/Fix | Audit for conformance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all 9 in-scope file(s)/path(s) against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules (no authored benchmark/ template; these are frozen dated-run-record directories) | Each file read in full and diffed against the template's structural rules; result recorded per-file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fix any defect the audit surfaces | Minimal edit applied; unrelated prose untouched; re-read to confirm |
| REQ-003 | Record observations distinct from defects (legal-but-inconsistent patterns, deliberate absences) | Observations listed in this spec's scope section, not silently fixed or silently dropped |
| REQ-004 | Leave every sibling-owned decision untouched | Out-of-scope items named explicitly; no file outside this leaf's scope is edited |
| REQ-005 | Pass validate.sh --strict for this leaf after the audit/fix pass | CLI run recorded with exit code 0 (or documented residual warning) in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 100% of the 9 in-scope file(s)/path(s) audited, not a sample
- **SC-002**: Audit outcome recorded even when the result is 'conformant, no changes'
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scope bleed into sibling-owned decisions | Medium | Out-of-scope items named explicitly in this spec |
| Dependency | Governing template availability | Low | Template lives at a fixed repo path: .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules (no authored benchmark/ template; these are frozen dated-run-record directories) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — static documentation/config audit

### Security
- **NFR-S01**: No secrets or credentials in scope

### Reliability
- **NFR-R01**: Audit must cover every in-scope file, not a sample
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Files not literally in the given list but discovered during the audit: include them and note the addition.

### Error Scenarios
- If `.opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules (no authored benchmark/ template; these are frozen dated-run-record directories)` doesn't cleanly apply to a given file/dir type: record the judgment call made and why, in this leaf's implementation-summary.md.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 9 file(s)/path(s) in scope |
| Risk | 2/25 | Documentation-only change; no runtime code paths touched |
| Research | 6/20 | Full exhaustive audit required first |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — scope is fully bounded by the known-defects list above and the exhaustive-audit mandate.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Covers**: `.opencode/skills/sk-design/benchmark/`
