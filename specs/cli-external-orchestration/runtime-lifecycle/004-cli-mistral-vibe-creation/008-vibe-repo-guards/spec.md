---
title: "Feature Specification: Phase 8: vibe-repo-guards"
description: "Vibe never evaluates OpenCode's JavaScript plugins, so none of the repository's guards run inside a Vibe session. This phase classifies every plugin as hook, skill or not portable, settles the hook wire format with a fixture, and ports the deny-capable guards as strict Vibe hooks."
trigger_phrases:
  - "vibe repo guards"
  - "phase 8 vibe repo guards"
  - "vibe strict pre_tool hooks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: vibe-repo-guards

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 12 |
| **Predecessor** | 007-dispatch-recognition-and-hard-rules |
| **Successor** | 009-deep-loop-executor-kind |
| **Handoff Criteria** | The classification table covers 21 of 21; each ported guard blocks a crafted violation and allows a clean call; settles the hook wire format |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The guard bundle Vibe loads from `.vibe/` and the classification of every OpenCode plugin. No change to the OpenCode plugins themselves, the dispatch hook library or the executor code.

**Dependencies**:
- 006-vibe-runtime-folder-and-mirrors. It creates `.vibe/config.toml` and `.vibe/SYNC.md`, which this phase extends. The phase plan lists 006 as this phase's only dependency, so 008 does not wait on 007.
- `MISTRAL_API_KEY` for the fixture session, because a hook fires only when an agent turn calls a tool.

**Deliverables**:
- A 21-row classification table in cli-mistral-vibe's `references/guards-and-hooks.md`.
- The settled hook wire format, recorded from a fixture run.
- `.vibe/hooks.toml` and the `.vibe/plugins/repo-guards/` bundle with each ported guard and its fixtures.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Vibe never imports or evaluates OpenCode's JavaScript or TypeScript plugins (research section 6, `vibe/core/plugins/_foreign.py:310`), so every guard this repository runs under OpenCode is absent in a Vibe session. A Vibe agent can edit outside a spec folder, read a secret-bearing env file or commit with a malformed message, and no hook refuses it, because no `.vibe/hooks.toml` exists.

### Purpose
The repository's deny-capable guards run as strict Vibe hooks, and every OpenCode plugin carries a recorded verdict of hook, skill or not portable.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .opencode/plugins | wc -l
      26
$ ls .opencode/plugins/*.js | wc -l
      21
$ ls .opencode/plugins | rg -v '\.js$'
ARCHITECTURE.md
lib
README.md
relative-repo
tests
$ ls .vibe/hooks.toml
ls: .vibe/hooks.toml: No such file or directory
$ ls .dsh/plugins/repo-guards
adapters
index.mjs
lineage-leaf.mjs
README.md
tests
$ [ -z "$MISTRAL_API_KEY" ] && echo "MISTRAL_API_KEY unset"
MISTRAL_API_KEY unset
```
The folder holds 26 entries. The 21 `.js` modules are the plugins, which matches the research count of 21. The other 5 entries are two docs and the `lib`, `relative-repo` and `tests` folders, and none of them is a `.js` module.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Classify all 21 OpenCode plugins as hook, skill or not portable, naming the Vibe event for each hook verdict, in cli-mistral-vibe's `references/guards-and-hooks.md`.
- Settle the hook decision wire format with a fixture `pre_tool` hook before any guard is ported: what the hook receives, and how it allows or denies.
- Port the deny-capable guards research section 6 names as strict `pre_tool` hooks: spec gate, dispatch preflight, env-secret, overlay, MCP-route and git-message. The classification decides whether any other plugin joins them.
- Port post-edit quality as a strict `post_tool` hook.
- Prove each ported guard with a crafted-violation fixture that it blocks and a clean-call fixture that it allows.

### Out of Scope
- Turn-stopping guards, completion-evidence and ask-surface - deferred because Vibe has no strict `post_agent` event, so they are not portable. They are classified as not portable and get no task.
- The session-relaunch loop - deferred because Vibe has no idle or compaction event and only an outer supervisor could drive it. Classified, not ported.
- The ACP supervisor - deferred as an optional second dispatch mode, worth building only after print mode is proven. Guards are proven in print mode only.
- Sandbox mode - deferred because Vibe has no CLI or config field for it. The ported guards are policy checks, not confinement.
- The goal and context bridges (`opencode-goal.js`, `session-history-lookup.js`) - phase 011 builds them as a `session_start` hook. This phase only classifies them.
- Any change to default models - DevPass stays the default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | Modify | 21-row classification table and the settled wire format |
| `.vibe/hooks.toml` | Create | One strict hook entry per ported guard |
| `.vibe/plugins/repo-guards/` | Create | Guard scripts, the wire-format fixture and the per-guard fixtures |
| `.vibe/SYNC.md` | Modify | The guard bundle listed as hand-authored |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every OpenCode plugin has a verdict | The classification table holds 21 rows, one per `.opencode/plugins/*.js` file, each verdict `hook`, `skill` or `not portable` |
| REQ-002 | The hook wire format is settled before any guard is ported | A fixture `pre_tool` hook records its input to a file and denies one call, and `guards-and-hooks.md` quotes the recorded input and the deny reply |
| REQ-003 | Each ported guard blocks its crafted violation | The fixture session shows the deny in the place and shape the REQ-002 fixture recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each ported guard allows a clean call | The clean fixture session shows the call completing, read from the same place as REQ-003 |
| REQ-005 | The hook file loads | Every entry with `strict = true` has type `pre_tool`, `post_tool` or `pre_agent`, and a Vibe run under `--trust` starts without a hook validation error |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The classification table's row count equals `ls .opencode/plugins/*.js | wc -l`.
- **SC-002**: A Vibe session asked to edit a file outside any spec folder has that edit denied by the spec-gate hook.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `MISTRAL_API_KEY`, unset today (Measured Behavior) | High: no hook fires without an agent turn, so the wire format and every guard fixture wait on it | Classification and hook authoring proceed without it. The fixture tasks stay open until the operator exports the key |
| Risk | A denial does not change Vibe's exit code (research section 3), so a guard that never fires looks like a clean run | High | Each fixture reads the deny where the REQ-002 fixture found it, never the exit code |
| Risk | No hook has ever run (research section 12), and whether `export.json` records each tool call's outcome is unverified | Med | The REQ-002 fixture records where the deny is visible before any guard fixture relies on it |
| Risk | A plugin's Claude-format script assumes Claude's input shape, and Vibe's `claude_code` protocol may differ | Med | The wire-format fixture runs first, and each port reads its input as the fixture recorded it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What does a Vibe hook receive and how does it answer? This phase owns the answer and settles it with the fixture before porting.
- Does a ported guard written for the `claude_code` protocol run unchanged, or does it need a Vibe-protocol adapter? The fixture decides it.
<!-- /ANCHOR:questions -->

---
