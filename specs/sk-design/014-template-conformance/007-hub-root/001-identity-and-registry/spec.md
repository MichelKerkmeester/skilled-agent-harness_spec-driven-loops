---
title: "Feature Specification: sk-design hub identity-and-registry conformance"
description: "Run the exhaustive audit of every file under `.opencode/skills/sk-design/ (8 hub-root identity/registry files)` against `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md`. \"Conformant, no changes\" is a legitimate outcome of this leaf."
trigger_phrases:
  - "sk-design hub identity-and-registry conformance"
  - "template conformance audit"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/007-hub-root/001-identity-and-registry"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec for template-conformance leaf"
    next_safe_action: "Run exhaustive audit against the governing template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ (8 hub-root identity/registry files)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: sk-design hub identity-and-registry conformance

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
| **Predecessor** | None |
| **Successor** | `002-changelog` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/sk-design/ (8 hub-root identity/registry files)` has not been audited against `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md`. No defects are known yet — this leaf's first task is the exhaustive audit itself.

### Purpose
Run the exhaustive audit of every file under `.opencode/skills/sk-design/ (8 hub-root identity/registry files)` against `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md`. "Conformant, no changes" is a legitimate outcome of this leaf.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every file listed in the Files to Change table below.
- Structural conformance to `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md`.
- Recording the following as observations (not defects): SKILL.md is 27,192 bytes — confirm it still matches parent-skill-hub-template.md's section order rather than having drifted under its own weight; confirm exactly ONE graph-metadata.json exists for this hub, at the root, per doctrine; confirm hub allowed-tools equals the union of every mode's toolSurface.allowed (checker rule 3j fails on both over- and under-grant) — verify with `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design`; confirm aliases are lowercase and unique across all modes in mode-registry.json (documented, unenforced — so audit manually); command-metadata.json reconciliation to registry `command` fields has enforcement explicitly marked pending upstream — audit for drift but do not treat gaps here as a hard-fail; leaf-manifest.json and command-metadata.json have no dedicated per-file JSON template among create-skill assets — audit them against parent-skill-check.cjs's rule set (2a/2b/8a/8b) rather than a template diff.

### Out of Scope
- Anything outside `.opencode/skills/sk-design/ (8 hub-root identity/registry files)` — sibling leaves and packets own their own scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-design/SKILL.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/README.md | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/description.json | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/graph-metadata.json | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/mode-registry.json | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/hub-router.json | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/leaf-manifest.json | Audit/Fix | Audit for conformance |
| .opencode/skills/sk-design/command-metadata.json | Audit/Fix | Audit for conformance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all 8 in-scope file(s)/path(s) against .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md | Each file read in full and diffed against the template's structural rules; result recorded per-file |

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

- **SC-001**: 100% of the 8 in-scope file(s)/path(s) audited, not a sample
- **SC-002**: Audit outcome recorded even when the result is 'conformant, no changes'
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scope bleed into sibling-owned decisions | Medium | Out-of-scope items named explicitly in this spec |
| Dependency | Governing template availability | Low | Template lives at a fixed repo path: .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md |
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
- If `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md` doesn't cleanly apply to a given file/dir type: record the judgment call made and why, in this leaf's implementation-summary.md.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | 8 file(s)/path(s) in scope |
| Risk | 2/25 | Documentation-only change; no runtime code paths touched |
| Research | 6/20 | Full exhaustive audit required first |
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
- **Covers**: `.opencode/skills/sk-design/ (8 hub-root identity/registry files)`
