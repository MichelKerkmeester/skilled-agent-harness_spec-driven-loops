---
title: "Feature Specification: Phase 39: sk-code-opencode-alignment-audit"
description: "No review has checked every OpenCode plugin and hook file against sk-code's SKILLED surface since the v2 bridge, kill-switch and scanner work landed. This phase reviews each tracked file under .opencode/plugins and the .skilled/hooks tree that .opencode/hooks links to, fixes each finding or records why it stays, and leaves one review row per file."
trigger_phrases:
  - "sk code opencode alignment audit"
  - "phase 39 sk code opencode alignment audit"
  - "opencode plugin hook sk-code review"
  - "plugin hook standards alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 39: sk-code-opencode-alignment-audit

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete: the 21 held P0 and P1 findings are fixed in phases 040, 041 and 042, and the last P1, `b05-relaunch-lib-006`, is fixed in phase 048 |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/181-sk-code-opencode-alignment-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 39 of 39 |
| **Predecessor** | 038-plugin-scanner-follow-ups |
| **Successor** | None |
| **Handoff Criteria** | `review.md` has one row per tracked file under `.opencode/plugins` and `.opencode/hooks`, no row has an open P0 or P1, and the plugin, battery and hook suites pass at or above their baselines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 39** of the OpenCode v1 and v2 dual compatibility specification. It carries item 9 of the open-work goal of 2026-10-20: every plugin and hook file in `.opencode` aligns with sk-code.

**Scope Boundary**: the tracked files under `.opencode/plugins/` and under `.skilled/hooks/`, which `.opencode/hooks` links to as one symlink. Files that a symlink inside either tree points at outside it are recorded by their link and reviewed where they live only when that place is inside one of the two trees. `.opencode/plugins/tests/helpers/plugin-inventory.cjs` and its tests are reviewed after phase 038 lands.

**Dependencies**:
- `../009-sk-code-opencode-alignment/`, the first alignment review, which covered the files phases 002 to 008 changed.
- `../035-v2-bridge-plugin-effects/` and `../038-plugin-scanner-follow-ups/`, whose changes this review reads as landed.

**Deliverables**:
- `review.md` with one row per file: path, surface, findings with the sk-code rule each cites, the fix commit or the reason it stays, and final status.
- Fixes for each confirmed finding, each verified by an independent reviewer and by the suites that cover the file.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 009 reviewed 75 changed files. Since then the bridge, the kill switches, the scanner, the session-relaunch hop history and several hook families changed, and nothing reviewed the whole of `.opencode/plugins` or the hook tree behind `.opencode/hooks` against one standard. `verify_alignment_drift.py` with its opt-in checks reports headers, sections and folder READMEs missing across both trees, and it cannot check naming, comment quality, error handling or security, which only a reviewer reads.

### Purpose
Every tracked plugin and hook file has a review row against sk-code's SKILLED surface, and no row carries an open P0 or P1.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A findings-first review of every tracked file in both trees, code against the sk-code SKILLED surface and its language checklists, docs against their sk-doc mode.
- A fix for each confirmed finding, or a recorded reason it stays.
- The verifier's opt-in checks run before and after, with the counts recorded.

### Out of Scope
- Behaviour changes that an operator would notice. They are reported, not made.
- Files a symlink points at outside the two trees, beyond recording the link.
- The scanner helper while phase 038 is changing it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/**` | Modify | Fixes for confirmed findings |
| `.skilled/hooks/**` | Modify | Fixes for confirmed findings |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/039-sk-code-opencode-alignment-audit/` | Create | This packet and `review.md` |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | Phase map row for 039 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every tracked file under `.opencode/plugins` and `.skilled/hooks` has a review row. | A scripted comparison of `git ls-files` for both trees against `review.md` finds no file missing. |
| REQ-002 | No row has an open P0 or P1. | Every P0 and P1 row names a fix commit, verified by the independent reviewer. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every P2 is fixed or carries the reason it stays. | No P2 row is blank in the status column. |
| REQ-004 | No fix breaks a suite. | The plugin suite (458), the battery unit tests (51), the purity test and the hook suites pass at or above their starting counts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every suite that covers a changed file passes on CI at the pushed commit.
- **SC-002**: The verifier's opt-in findings for both trees fall to zero or each remaining one is recorded with its reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A style fix changes behaviour | High | Each fix is one change, its suites rerun, and the reviewer checks the diff |
| Risk | The hook tree serves six runtimes | Med | Runtime adapters are reviewed with their shared core and their own tests |
| Dependency | Phase 038 changes the scanner helper | Low | Review it last, after main carries 038 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
