---
title: "Feature Specification: Phase 66: opencode-v2-default-name"
description: "The side-by-side layout gave the name opencode to OpenCode 1 and hid OpenCode 2 behind an opencode2 launcher, even though the repository expects OpenCode 2. The operator asked for OpenCode 2 to be the default opencode install. OpenCode 2 now answers to opencode and opencode2 on the default opencode.db, OpenCode 1 answers only to an opencode1 launcher on its own opencode-v1.db, and the setup helper and install reference build and describe that layout."
trigger_phrases:
  - "opencode v2 default name"
  - "phase 66 opencode v2 default name"
  - "opencode1 launcher"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 66: opencode-v2-default-name

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
| **Branch** | `main` (uncommitted) |
| **Parent Spec** | ../spec.md |
| **Phase** | 66 of 66 |
| **Predecessor** | 065-drop-old-deepseek-from-pi |
| **Successor** | None |
| **Handoff Criteria** | On this machine `opencode` and `opencode2` report v2 and `opencode1` reports v1, a live run on each answers `OK`, v2's sessions land in `opencode.db` and v1's in `opencode-v1.db`. `opencode-setup.sh both` builds that layout in a throwaway HOME, the new test fails against the previous helper, and the cli-opencode unit tests pass. Commit, push and CI remain the operator's. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 66** of the OpenCode v1/v2 dual-compatibility specification. Phase 062 made dispatch prefer `opencode2`; this phase keeps that resolver and changes which binary each name runs.

**Scope Boundary**: the binaries under `~/.local/bin` and the databases under `~/.local/share/opencode` on this machine, `cli-opencode/scripts/opencode-setup.sh`, a new `opencode-setup-both.test.cjs`, `cli-opencode/references/install-and-versions.md`, this phase's four docs and the parent's phase-map rows. The dispatch resolvers, the playbooks and every `opencode2 run` line stay untouched, because `opencode2` still runs v2.

**Dependencies**:
- The operator's choices: OpenCode 1 moves to `opencode1`, `opencode2` stays v2, and v2 adopts `opencode.db` even though its 271 earlier sessions stay behind in `opencode-v2.db`.
- Both binaries honouring `OPENCODE_DB`, read from each binary and then observed in live runs.

**Deliverables**:
- The machine swap, with byte-exact backups of both earlier names and of `opencode.db`.
- The setup helper's `both` mode rebuilt for the new layout, with a test.
- The install reference rewritten for the new layout.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository expects OpenCode 2, but the side-by-side layout gave the bare `opencode` name to OpenCode 1 and reached OpenCode 2 only through an `opencode2` launcher pinned to `opencode-v2.db`. Typing `opencode` therefore started the fallback version.

### Purpose
`opencode` runs OpenCode 2 on the default database, and OpenCode 1 stays reachable as `opencode1` without ever opening the database OpenCode 2 migrated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Point `~/.local/bin/opencode` and `~/.local/bin/opencode2` at the v2 binary and add an `~/.local/bin/opencode1` launcher that runs v1 on `opencode-v1.db`.
- Copy `opencode.db` to `opencode-v1.db` before v2 first opens it, and keep byte-exact backups.
- Rebuild the setup helper's `both` mode and `check` output for the new layout, with a test.
- Rewrite the install reference's side-by-side, launcher, verification, uninstall and troubleshooting text.

### Out of Scope
- The dispatch resolvers and the 148 `opencode2` lines in docs and playbooks - `opencode2` still runs v2, so they stay correct.
- The v2 pin drift (2.0.32 documented, 2.1.4 installed) and the v1 channel now at 1.19.4 - recorded for the operator, not changed here.
- Importing the 271 sessions in `opencode-v2.db` into `opencode.db` - the operator chose to leave them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modify | `both` links `opencode` and `opencode2` to v2 and writes the `opencode1` launcher; `check` reports all three names |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-both.test.cjs` | Create | Builds the earlier layout in a throwaway HOME and checks the new one |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` | Modify | Describes the new side-by-side layout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `opencode` and `opencode2` run v2 and `opencode1` runs v1 | `--version` prints `opencode v2.1.4`, `opencode v2.1.4` and `1.19.3` |
| REQ-002 | v1 never opens the database v2 migrated | A v1 run adds a session to `opencode-v1.db`, which has no `session_v2` table |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The setup helper builds the same layout | `opencode-setup-both.test.cjs` passes on the new helper and fails on the previous one |
| REQ-004 | The install reference describes the layout that exists | The cli-opencode doc tests pass and no text names the old launcher |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live `opencode run` and a live `opencode1 run` both answer `OK`.
- **SC-002**: `opencode-setup.sh check` reports v2 for `opencode` and `opencode2` and v1 for `opencode1`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | v2 migrates `opencode.db` in place | High | Byte-exact backup in `~/.local/share/opencode/pre-v2-default-20261024/`, and v1 moved to its own copy first |
| Risk | A later npm operation on `opencode-ai` takes the `opencode` name back | Med | The reference says to run `check` after any v1 npm operation and rerun `both` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether `npm install` or `npm uninstall` of `opencode-ai` in `~/.local` replaces, refuses or removes an `opencode` link that points into the v2 prefix was not probed.
<!-- /ANCHOR:questions -->

---
