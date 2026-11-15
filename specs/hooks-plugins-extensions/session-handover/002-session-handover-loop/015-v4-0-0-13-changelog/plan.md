---
title: "Implementation Plan: Phase 15: v4-0-0-13-changelog"
description: "Pick the next free build version, sweep main since v4.0.0.12 for user-visible change, then write the expanded v4.0.0.13 entry through sk-create-changelog with the in-session handover as its headline and run the sk-doc validators."
trigger_phrases:
  - "v4 0 0 13 changelog plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: v4-0-0-13-changelog

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc: sk-create-changelog for the entry, sk-create-with-human-voice for prose |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `extract_structure.py` |

### Overview
One lane. Check the local and upstream changelog folders and tags for the highest version. List what merged to main since the v4.0.0.12 commit and group it by user-visible area. Read the session-relaunch README for every handover fact. Write the entry in the expanded format, then run the three sk-doc checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The entry leads with what a user gets, gives one section per area and ends with the steps a user must take. Detail stays in the component changelogs and the source READMEs.

### Key Components
- **Opening and Why This Release**: the in-session handover in plain words and the problem it removes.
- **What's New at a Glance**: one bullet per user-visible change.
- **In-Session Handover**: the threshold, the note, the hop, the runtimes and the stuck-hop notice.
- **OpenCode 1 and 2** and **Framework Code Standards**: the dual compatibility and the rename, with a bold Breaking line.
- **Upgrade Notes**: the shell line, the Hermes plugin, the Codex approval, the rename and the OpenCode pin.

### Data Flow
Facts flow one way: the session-relaunch README and the merged specs into the entry. The entry adds no fact of its own.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Global release entry | create | `validate_document.py`, `hvr_scan.py`, `extract_structure.py` |
| `cli-opencode` v1.5.0.0 and `sk-code-skilled` v2.0.0.0 component changelogs | Already describe their changes | unchanged | read back |
| GitHub releases | Published release pages | unchanged, no release asked for | none |

Required inventories:
- Highest version: the local and `origin/main` listings of `.skilled/changelog/skilled/` and `git tag -l 'v4.0.0.*'` stop at v4.0.0.12.
- Change scope: the commits on main after `0ead854621`, grouped by spec folder.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | The release entry | `validate_document.py`, `extract_structure.py` |
| Voice | The release entry | `hvr_scan.py` |
| Facts | Every handover claim | Read back against the session-relaunch README |
| Spec | This folder and the parent | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 014 | Internal | Green | The headline would describe unshipped work |
| sk-doc sk-create-changelog and its validators | Internal | Green | No format contract or structure check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the entry states a fact the code or a source doc contradicts.
- **Procedure**: delete or revert `.skilled/changelog/skilled/v4.0.0.13.md`. Nothing depends on it and no release or tag was published.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Version check ──► Scope sweep ──► Read sources ──► Write entry ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Version check | None | Write entry |
| Scope sweep | None | Write entry |
| Read sources | Scope sweep | Write entry |
| Write entry | Version check, read sources | Verify |
| Verify | Write entry | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | A version check and a commit sweep |
| Core Implementation | Low | One doc |
| Verification | Low | Three sk-doc checks and the spec gate |
| **Total** | | **About an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no data changes
- [x] Feature flag configured: not applicable, documentation only
- [x] Monitoring alerts set: not applicable, documentation only

### Rollback Procedure
1. Delete or revert `.skilled/changelog/skilled/v4.0.0.13.md`.
2. Confirm the folder's highest entry is v4.0.0.12 again.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
