---
title: "Feature Specification: sk-design shared references conformance"
description: "Audit every file under `.opencode/skills/sk-design/shared/references/` against `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md`, fix the known defects listed above, and confirm the remaining files either conform or get the same fix."
trigger_phrases:
  - "sk-design shared references conformance"
  - "template conformance audit"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/006-shared/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec for template-conformance leaf"
    next_safe_action: "Run exhaustive audit against the governing template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: sk-design shared references conformance

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
| **Predecessor** | `001-root-docs` |
| **Successor** | `003-assets` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/sk-design/shared/references/` has not been fully audited against `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md`. Known defects: smart-routing.md: has `## 1. OVERVIEW` but NO intro sentence and NO `---` rule between the H1 (line 14) and §1 (line 16) — template requires H1 -> 1-2 short sentences with no headers -> `---` -> `## 1. OVERVIEW`; structural-fingerprint-cards/card-*.md (all 7 files: card-reciprocal-frame, card-deliberate-seams, card-image-counterweight, card-action-punctuation, card-heading-rail, card-layered-body, card-staged-reveal): numbered but sentence-case H2s, §1 named topically (e.g. 'Regions and composition') rather than 'OVERVIEW', no `---` separators — this is ONE consistent edit repeated seven times, not seven separate judgments, and each file is ~51 lines (under the template's 200-line reference bar).

### Purpose
Audit every file under `.opencode/skills/sk-design/shared/references/` against `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md`, fix the known defects listed above, and confirm the remaining files either conform or get the same fix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every file listed in the Files to Change table below.
- Structural conformance to `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md`.
- Recording the following as observations (not defects): the 7 card-*.md defects are identical in shape — fix the pattern once and apply it uniformly across all 7, then verify each individually.

### Out of Scope
- Anything outside `.opencode/skills/sk-design/shared/references/` — sibling leaves and packets own their own scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-design/shared/references/brand-first-lane.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/references/smart-routing.md | Audit/Fix | Known defect — see spec problem statement |
| .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/schema.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/index.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-reciprocal-frame.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-deliberate-seams.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-image-counterweight.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-action-punctuation.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-heading-rail.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-layered-body.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/shared/references/structural-fingerprint-cards/card-staged-reveal.md | Audit/Fix | Audit for conformance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all 11 in-scope file(s)/path(s) against .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md | Each file read in full and diffed against the template's structural rules; result recorded per-file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fix confirmed defects to match the template | Minimal edit applied; unrelated prose untouched; re-read to confirm |
| REQ-003 | Record observations distinct from defects (legal-but-inconsistent patterns, deliberate absences) | Observations listed in this spec's scope section, not silently fixed or silently dropped |
| REQ-004 | Leave every sibling-owned decision untouched | Out-of-scope items named explicitly; no file outside this leaf's scope is edited |
| REQ-005 | Pass validate.sh --strict for this leaf after the audit/fix pass | CLI run recorded with exit code 0 (or documented residual warning) in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 100% of the 11 in-scope file(s)/path(s) audited, not a sample
- **SC-002**: All known defects fixed or explicitly deferred with a named owner
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scope bleed into sibling-owned decisions | Medium | Out-of-scope items named explicitly in this spec |
| Dependency | Governing template availability | Low | Template lives at a fixed repo path: .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md |
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
- If `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md` doesn't cleanly apply to a given file/dir type: record the judgment call made and why, in this leaf's implementation-summary.md.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 11 file(s)/path(s) in scope |
| Risk | 2/25 | Documentation-only change; no runtime code paths touched |
| Research | 3/20 | Known defects already characterized; confirm remaining files |
| **Total** | **21/70** | **Level 2** |
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
- **Covers**: `.opencode/skills/sk-design/shared/references/`
