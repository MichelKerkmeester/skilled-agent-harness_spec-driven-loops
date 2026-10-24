---
title: "Feature Specification: Phase 68: retire-opencode2-name"
description: "The operator asked for only two local OpenCode names, opencode for OpenCode 2 and opencode1 for OpenCode 1. The opencode2 link is gone from this machine, the setup helper retires it, and the skill's commands use opencode. While doing it, OpenCode 1's auto-update was found to reinstall its package and take the opencode name back, so the opencode1 launcher now turns auto-update off."
trigger_phrases:
  - "retire opencode2 name"
  - "phase 68 retire opencode2"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 68: retire-opencode2-name

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 68 of 68 |
| **Predecessor** | 067-opencode-v2-pin-2-1-4 |
| **Successor** | None |
| **Handoff Criteria** | This machine has `opencode` (v2) and `opencode1` (v1) and no `opencode2`; `opencode-setup.sh both` retires `opencode2` and writes a launcher with auto-update off; the skill's v2 commands use `opencode`; the cli-opencode, config-shape and battery suites pass. CI on the pushed commit is the remaining proof. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 68** of the OpenCode v1/v2 dual-compatibility specification. Phase 066 kept `opencode2` as a second v2 name; the operator retired it.

**Scope Boundary**: the names under `~/.local/bin`, `opencode-setup.sh` and its test, the models-form doc test, the cli-opencode docs and playbooks, `run-plugin-scenario.sh`, one feature-catalog sentence and one sk-git reference line. Code that accepts `opencode2` (the resolvers, the version guard, the dispatch lints and the doctor battery) stays, because a plain v2 npm install still ships that name.

**Dependencies**:
- The operator's choice of machine plus repo.

**Deliverables**:
- `opencode2` removed here and retired by the helper.
- 182 documented v2 commands rewritten from `opencode2` to `opencode`.
- The `opencode1` launcher with auto-update off.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three names reached two binaries: `opencode` and `opencode2` both ran OpenCode 2. The operator wants one name per version. OpenCode 1's auto-update also reinstalled its package into `~/.local` and pointed `opencode` back at v1.

### Purpose
`opencode` runs OpenCode 2, `opencode1` runs OpenCode 1, and nothing takes the `opencode` name back.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `~/.local/bin/opencode2`, relink `opencode` to v2, and turn auto-update off in `opencode1`.
- Make `opencode-setup.sh both` retire `opencode2` and write the new launcher.
- Rewrite the documented v2 commands to `opencode`, and say that OpenCode 1 command lines run as `opencode1` side by side.
- Teach the models-form test to tell the v2 and v1 listing forms apart by their flags rather than by the binary name.

### Out of Scope
- Changing the resolver order - checking `opencode2` first still lands on v2 on every layout, while `opencode` first would pick v1 on the earlier layout.
- Rewriting OpenCode 1 command lines to `opencode1` - `opencode` is right on a v1-only machine.
- Reinstalling v1 at the 1.19.3 pin - its auto-update already moved it to 1.19.4.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-opencode/scripts/opencode-setup.sh` | Modify | Retire `opencode2`; launcher turns auto-update off |
| `cli-opencode/scripts/tests/opencode-setup-both.test.cjs` | Modify | Cover the retirement and the launcher |
| `cli-opencode/scripts/tests/opencode2-models-form.test.cjs` | Modify | Classify listings by form |
| cli-opencode docs, playbooks, `run-plugin-scenario.sh`, feature catalog, sk-git worktree reference | Modify | `opencode2` commands to `opencode` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Two local names only | `opencode --version` is v2, `opencode1 --version` is v1, `command -v opencode2` finds nothing |
| REQ-002 | v1 cannot take the name back | The launcher sets `OPENCODE_DISABLE_AUTOUPDATE=1` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Docs name the commands that exist | No `opencode2 <subcommand>` left in cli-opencode docs; models-form test passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cli-opencode suites and CI pass on the pushed commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A reader runs an OpenCode 1 command line as `opencode` side by side | Med | `SKILL.md` and `cli-reference.md` say to run those as `opencode1` |
| Risk | v2's own auto-update installs into the `~/.local` npm prefix | Low | It would still install v2 under `opencode`; not observed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
