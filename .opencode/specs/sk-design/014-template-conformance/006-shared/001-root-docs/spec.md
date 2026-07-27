---
title: "Feature Specification: sk-design shared root-docs conformance"
description: "Run the exhaustive audit of every file under `.opencode/skills/sk-design/shared/ (11 root markdown files)` against `no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it`. \"Conformant, no changes\" is a legitimate outcome of this leaf."
trigger_phrases:
  - "sk-design shared root-docs conformance"
  - "template conformance audit"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/006-shared/001-root-docs"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec for template-conformance leaf"
    next_safe_action: "Run exhaustive audit against the governing template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/ (11 root markdown files)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: sk-design shared root-docs conformance

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
| **Predecessor** | None |
| **Successor** | `002-references` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/sk-design/shared/ (11 root markdown files)` has not been audited against `no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it`. No defects are known yet — this leaf's first task is the exhaustive audit itself.

### Purpose
Run the exhaustive audit of every file under `.opencode/skills/sk-design/shared/ (11 root markdown files)` against `no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it`. "Conformant, no changes" is a legitimate outcome of this leaf.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every file listed in the Files to Change table below.
- Structural conformance to `no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it`.
- Recording the following as observations (not defects): shared/ may hold cross-packet vocabulary but must NEVER hold per-mode workflow logic, and must NEVER have its own graph-metadata.json or description.json — confirm this invariant holds for all 11 files as part of the audit.

### Out of Scope
- Anything outside `.opencode/skills/sk-design/shared/ (11 root markdown files)` — sibling leaves and packets own their own scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-design/shared/anti-slop-principles.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/cognitive-laws.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/context-loading-contract.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/creation-contract.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/design-dispatch-boundary.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/design-proof-token.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/design-token-vocabulary.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/numeric-design-laws.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/procedure-card-schema.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/register.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/sk-code-handoff.md | Audit/Fix | Audit for conformance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all 11 in-scope file(s)/path(s) against no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it | Each file read in full and diffed against the template's structural rules; result recorded per-file |

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
| Dependency | Governing template availability | Low | Template lives at a fixed repo path: no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it |
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
- If `no single authored template for loose shared-root contracts; closest structural analog is .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md (numbered OVERVIEW, --- separators) — apply as a judgment call and record it` doesn't cleanly apply to a given file/dir type: record the judgment call made and why, in this leaf's implementation-summary.md.
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
- **Covers**: `.opencode/skills/sk-design/shared/ (11 root markdown files)`
