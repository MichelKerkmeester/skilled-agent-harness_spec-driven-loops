---
title: "Feature Specification: Phase 30: nested-worktree-battery"
description: "Inside a worktree nested in the main checkout, the doctor battery's v2 plugin-active leg failed all 17 plugins while a plain checkout and CI passed. OpenCode 2 merges every ancestor `.opencode`, so the outer checkout's plugins register first and the worktree's copies fail as duplicate IDs. This phase makes the battery judge the root's own plugins there and documents the shadowing for real sessions."
trigger_phrases:
  - "nested worktree battery"
  - "phase 30 nested worktree battery"
  - "duplicate plugin id worktree"
  - "opencode 2 ancestor opencode folder"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 30: nested-worktree-battery

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/169-nested-worktree-battery` |
| **Parent Spec** | ../spec.md |
| **Phase** | 30 of 30 |
| **Predecessor** | 025-cli-opencode-docs-and-listings |
| **Successor** | None |
| **Handoff Criteria** | The battery passes v2 in a nested worktree with an `isolated:` line, still uses normal discovery in a plain checkout, and the Dual-Version Battery passes on CI at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the OpenCode v1 and v2 dual-compatibility specification. It closes item 7 of the open-work list of 2026-10-20: the battery inside a nested worktree.

**Scope Boundary**: The doctor battery's v2 read, its test file, and the two documents that describe the battery and worktrees. The plugins themselves and the CI workflow do not change.

**Dependencies**:
- Group 025's finding that the battery fails v2 `plugin-active` inside a nested worktree (`../025-cli-opencode-docs-and-listings/implementation-summary.md`).
- OpenCode 2.0.32 (`opencode2`) and OpenCode 1.19.3 (`opencode`) installed locally, probed only through private servers on throwaway ports and data folders.

**Deliverables**:
- A battery that isolates the v2 read only when an ancestor plugin folder exists, and says so in the plugin-active result.
- Tests that fail on the old battery, with the mutation runs under `scratch/mutation/`.
- The root-cause evidence under `scratch/rootcause/`.
- A known limit in `.opencode/plugins/ARCHITECTURE.md` and a troubleshooting entry in the sk-git worktree reference.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Run inside `.worktrees/NNN-slug`, the battery's v2 leg reported all 17 plugin files failed, while the same battery passed in a plain clone and on CI. The private server's plugin read shows why: 17 entries from the main checkout's `.opencode/plugins` are active and the worktree's 17 are `failed` with `Duplicate plugin ID`. OpenCode 2.0.32 collects `.opencode` from every ancestor folder with no stop at the repository root, while OpenCode 1.19.3 stops at the worktree root. So the battery could not judge a nested worktree, and a real OpenCode 2 session there runs the main checkout's plugin code.

### Purpose
The battery judges the root's own plugins in any checkout layout and names the shadowing when it happens, and the docs tell a person why a worktree's plugin change has no effect on OpenCode 2.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Detect ancestor `.opencode/plugins` folders above the battery root.
- Start the private v2 server with `OPENCODE_CONFIG_PROJECT_DISABLE=1` and `OPENCODE_CONFIG_DIR=<root>/.opencode` only when one exists.
- Name each ancestor folder in an `isolated:` line of the plugin-active result.
- Document the shadowing for real sessions.

### Out of Scope
- Changing how real OpenCode 2 sessions start in worktrees, for example in `worktree-naming.sh` or a launcher. That is a behavior change for every session, so it is recorded, not made.
- Upstream OpenCode 2 behavior. The walk has no stop bound in 2.0.32, and the switches it reads are the supported way around it.
- The v1 legs. OpenCode 1.19.3 passes in the nested worktree already.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modify | `ancestorPluginDirs`, `v2ServerEnv`, the `isolated:` note in `legPluginActive` |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modify | Fake server that behaves like OpenCode 2 under an outer checkout (and like one that ignores the switches), seven nested tests, plain-root assertions with a clean environment |
| `.opencode/plugins/ARCHITECTURE.md` | Modify | The battery paragraph and a known limit |
| `.skilled/skills/sk-git/references/worktree-workflows.md` | Modify | A troubleshooting entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The root cause is confirmed by evidence, not inferred | `scratch/rootcause/summary.txt`: the duplicate-ID read, the plain-clone pass and the OpenCode 2 source lines |
| REQ-002 | The v2 battery passes in a nested worktree and names the shadowing | `--family=v2` exits 0 in worktree 169; plugin-active details start with `isolated:` |
| REQ-003 | A plain checkout keeps normal discovery | The new battery in the plain clone exits 0 with no `isolated:` line; the plain-root test asserts both switches are unset |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every new test fails on the old code or a mutant | `scratch/mutation/m1` to `m7` each fail at least one test |
| REQ-005 | The docs explain the shadowing for real sessions | The ARCHITECTURE.md known limit and the worktree troubleshooting entry |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The battery's v2 legs pass in worktree 169 and in a plain clone, and CI's Dual-Version Battery passes at the pushed commit.
- **SC-002**: The battery test suite passes, with the new tests failing on the old battery and on each mutant.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode 2 reading `OPENCODE_CONFIG_PROJECT_DISABLE` and `OPENCODE_CONFIG_DIR` | A later release could rename or ignore them | An isolated read fails plugin-active on any entry from an ancestor folder and command-listed on any ancestor-only command, so ignored switches fail loudly instead of passing |
| Risk | The isolated read tests a different discovery path from a real session | Low | It runs only when an ancestor plugin folder exists; CI and plain checkouts keep project discovery, and the result says it was isolated |
| Risk | A plugin folder in a home-level ancestor, such as `~/.opencode/plugins`, also triggers isolation | Low | The result names the folder, and the root's own plugins are still judged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `worktree-naming.sh` or the cli-opencode docs tell agents to start OpenCode 2 with the two switches inside `.worktrees/`? Recorded as a follow-up, not decided here.
<!-- /ANCHOR:questions -->

---
