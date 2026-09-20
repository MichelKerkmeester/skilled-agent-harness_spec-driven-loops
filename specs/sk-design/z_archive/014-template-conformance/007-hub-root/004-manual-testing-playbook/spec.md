---
title: "Feature Specification: sk-design hub manual-testing-playbook conformance"
description: "Run the exhaustive audit of every file under `.opencode/skills/sk-design/manual-testing-playbook/` against `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md`. \"Conformant, no changes\" is a legitimate outcome of this leaf."
trigger_phrases:
  - "sk-design hub manual-testing-playbook conformance"
  - "template conformance audit"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/007-hub-root/004-manual-testing-playbook"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec for template-conformance leaf"
    next_safe_action: "Run exhaustive audit against the governing template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: sk-design hub manual-testing-playbook conformance

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
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `003-feature-catalog` |
| **Successor** | `005-benchmark` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/sk-design/manual-testing-playbook/` has not been audited against `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md`. No defects are known yet — this leaf's first task is the exhaustive audit itself.

### Purpose
Run the exhaustive audit of every file under `.opencode/skills/sk-design/manual-testing-playbook/` against `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md`. "Conformant, no changes" is a legitimate outcome of this leaf.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every file listed in the Files to Change table below.
- Structural conformance to `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md`.
- Recording the following as observations (not defects): this is the largest single leaf by file count (~38 files across 10 subdirs) — audit systematically subdir by subdir, not file by file at random.

### Out of Scope
- Anything outside `.opencode/skills/sk-design/manual-testing-playbook/` — sibling leaves and packets own their own scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/md-generator-pipeline/ (4 files) | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/styles-library-utilization/ (5 files) | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/shared-reference-base/ (4 files) | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/advisor-integration/ (4 files) | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/parity-behavior/ (5 files) | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/compiled-routing/ (1 file) | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/fallback-and-resilience/ (2 files) | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/mode-routing/ (6 files) | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/transform-verb-framing/ (2 files) | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/manual-testing-playbook/hub-manager-intake/ (4 files) | Audit/Fix | Audit for conformance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all 11 in-scope file(s)/path(s) against .opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md | Each file read in full and diffed against the template's structural rules; result recorded per-file |

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

- **SC-001**: 100% of the 11 in-scope file(s)/path(s) audited, not a sample
- **SC-002**: Audit outcome recorded even when the result is 'conformant, no changes'
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scope bleed into sibling-owned decisions | Medium | Out-of-scope items named explicitly in this spec |
| Dependency | Governing template availability | Low | Template lives at a fixed repo path: .opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md |
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
- If `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md` doesn't cleanly apply to a given file/dir type: record the judgment call made and why, in this leaf's implementation-summary.md.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 11 file(s)/path(s) in scope |
| Risk | 2/25 | Documentation-only change; no runtime code paths touched |
| Research | 6/20 | Full exhaustive audit required first |
| **Total** | **24/70** | **Level 2** |
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
- **Covers**: `.opencode/skills/sk-design/manual-testing-playbook/`
