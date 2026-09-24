---
title: "Feature Specification: Phase 13: sk-vision changelogs"
description: "Rewrites the 2 legacy sk-vision changelogs into the current sk-create-changelog format with the phase 001 tooling, keeping every fact, then commits them as one sk-vision change."
trigger_phrases:
  - "sk-vision changelog rewrite"
  - "sk-vision changelog retrofit"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: sk-vision changelogs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 16 |
| **Predecessor** | 012-sk-prompt |
| **Successor** | 014-system-deep-loop |
| **Handoff Criteria** | Every listed file is kept or restored with its reason, and the sk-vision commit is pushed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the skill changelog retrofit.

**Scope Boundary**: The 2 sk-vision changelogs listed in `../scratch/lists/sk-vision.txt`.

**Dependencies**:
- Phase 001's checker, briefs and driver, frozen after the operator's style approval

**Deliverables**:
- The listed changelogs rewritten in place, or restored with a recorded reason
- One commit for sk-vision, pushed to main
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
2 sk-vision changelogs predate the compact and expanded format that sk-create-changelog now defines. They still carry retired version headers, Files Changed tables or old change-type sections, so this skill's release history reads in an older style than its newest entries.

### Purpose
Every listed sk-vision changelog reads in the current format and still records exactly what shipped in its version.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 2 files in `../scratch/lists/sk-vision.txt`

### Out of Scope
- sk-vision changelogs that already pass the checker - they are already in the current format
- Frontmatter, historical paths and names - the parent's decisions keep them as written

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-vision/**/changelog/**/*.md` (2 listed) | Modify | Rewritten in place in the compact or expanded format |
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
| REQ-003 | One commit holds the sk-vision rewrites, and routing and mirrors stay fresh after it | `compiled-route-guard.cjs` and each mirror generator's `--check` pass after the commit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 2 listed files have a pass or a failure with its reason in the state file.
- **SC-002**: The sk-vision commit is on main, with the routing guard and mirror checks clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 style approval | This phase cannot start without it | Met: approved with fixes on 2026-09-24 |
| Risk | A dense file fails its fact check twice | Medium | One `--retry-failed` pass, then the failure is recorded with its reason |
| Risk | Another session edits a sk-vision file during the wave | Medium | Stage only the listed files, and rerun the checker on them before the commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None beyond the retry policy phase 001 settles.
<!-- /ANCHOR:questions -->
