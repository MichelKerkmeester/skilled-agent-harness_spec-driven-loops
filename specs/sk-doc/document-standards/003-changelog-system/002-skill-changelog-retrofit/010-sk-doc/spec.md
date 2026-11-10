---
title: "Feature Specification: Phase 10: sk-doc changelogs"
description: "Rewrites the 56 legacy sk-doc changelogs into the current sk-create-changelog format with the phase 001 tooling, keeping every fact, then commits them as one sk-doc change."
trigger_phrases:
  - "sk-doc changelog rewrite"
  - "sk-doc changelog retrofit"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: sk-doc changelogs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 16 |
| **Predecessor** | 009-sk-design |
| **Successor** | 011-sk-git |
| **Handoff Criteria** | Every listed file is kept or restored with its reason, and the sk-doc commit is pushed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the skill changelog retrofit.

**Scope Boundary**: The 56 sk-doc changelogs listed in `../scratch/lists/sk-doc.txt`. The pilot already kept 1 of these: sk-create-command v1.0.1.1.

**Dependencies**:
- Phase 001's checker, briefs and driver, frozen after the operator's style approval

**Deliverables**:
- The listed changelogs rewritten in place, or restored with a recorded reason
- One commit for sk-doc, pushed to main
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
56 sk-doc changelogs predate the compact and expanded format that sk-create-changelog now defines. They still carry retired version headers, Files Changed tables or old change-type sections, so this skill's release history reads in an older style than its newest entries.

### Purpose
Every listed sk-doc changelog reads in the current format and still records exactly what shipped in its version.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 56 files in `../scratch/lists/sk-doc.txt`

### Out of Scope
- sk-doc changelogs that already pass the checker - they are already in the current format
- Frontmatter, historical paths and names - the parent's decisions keep them as written

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/**/changelog/**/*.md` (56 listed) | Modify | Rewritten in place in the compact or expanded format |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A listed file is kept only when it passes the shape checker with `--old`, the HVR scan and the fact check | Its record in `../scratch/state.jsonl` has `status: pass`, and a final checker and HVR run over the kept files is clean |
| REQ-002 | A listed file that fails all three attempts equals its original, and its draft is kept | `git diff` is empty for it, and `ls -A ../scratch/failed` lists its draft |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | One commit holds the sk-doc rewrites, and routing and mirrors stay fresh after it | `compiled-route-guard.cjs` and each mirror generator's `--check` pass after the commit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 56 listed files have a pass or a failure with its reason in the state file.
- **SC-002**: The sk-doc commit is on main, with the routing guard and mirror checks clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 style approval | This phase cannot start without it | Met: approved with fixes on 2026-09-24 |
| Risk | A dense file fails its fact check twice | Medium | One `--retry-failed` pass, then the failure is recorded with its reason |
| Risk | Another session edits a sk-doc file during the wave | Medium | Stage only the listed files, and rerun the checker on them before the commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None beyond the retry policy phase 001 settles.
<!-- /ANCHOR:questions -->
