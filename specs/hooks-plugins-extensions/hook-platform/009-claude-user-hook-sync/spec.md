---
title: "Feature Specification: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings"
description: "The operator keeps a hand-made copy of Skilled's Claude hooks in ~/.claude/settings.json, and it went stale when hook folders were renamed, so every Bash call warned that a hook could not resolve. An opt-in SessionStart step now copies the project's hooks block into the user file, and every Claude hook exits quietly in a folder with no .skilled tree."
trigger_phrases:
  - "claude user hook sync"
  - "user level claude settings hooks"
  - "sync claude user hooks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/428-claude-user-hook-sync` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator's `~/.claude/settings.json` carries a hand-made copy of Skilled's Claude hooks. When hook folders were renamed on main, four of its paths stopped existing, so every Bash call printed "mk claude hook could not resolve" until the paths were fixed by hand. Nothing in the repo keeps that copy current, and a copy that ran in a project without a `.skilled` tree would print the same warning on every call.

### Purpose
An operator who opts in gets a user-level copy of Skilled's Claude hooks that each session refreshes from the checkout, and nobody who installs Skilled gets their user settings touched unless they turn it on.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 (path check over ~/.claude/settings.json hooks, before the hand repair)
MISSING PreToolUse .skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs
MISSING PreToolUse .skilled/hooks/task-dispatch/claude/task-dispatch-guard.cjs
MISSING PreToolUse .skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs
MISSING PostToolUse .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs

$ claude -p "Run exactly this shell command with the Bash tool and nothing else: echo dedupe-probe" --model haiku --debug-file dedupe-debug.txt
(after the repair: 19 Skilled hook commands in ~/.claude/settings.json, all byte-identical to .claude/settings.json)
dispatch-preflight-lint.mjs: 1   spec-gate-enforce.mjs: 1   git-preflight-advisory.mjs: 1
git-message-gate.mjs: 1          session-prime.js: 1        worktree-guard.sh: 1
(each count is "finished with status" lines; the user-level Orca hook also ran, so both files were loaded)
```
Claude Code runs a hook once when the user file and the project file register the same command string, so an exact copy adds no second run.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `.skilled/bin/sync-claude-user-hooks.mjs`, which replaces every Skilled-owned hook entry in a user Claude settings file with the project's `hooks` block and keeps every other key and every hook it does not own.
- Register it as a Claude SessionStart step through `hook-registry.json`, gated by a new default-off concern `claude-user-hook-sync` whose enable switch is `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED`.
- Render a `.skilled` presence guard into every Claude hook command, so the copy exits 0 quietly in a project without a `.skilled` tree while the project file and the copy stay byte-identical.
- Move the hook identity, ownership, primary-checkout and atomic-write helpers out of `install-codex-hooks.mjs` into `.skilled/bin/lib/user-hook-file.mjs`, used by both scripts.
- Catalogue the switch in `ENV-REFERENCE.md`, `doctor-env.yaml`, `.env.example` and `hook-flags.env.example`.

### Out of Scope
- Codex, Cursor, Devin, Pi, OpenCode and Vibe user-level files - Codex's installer already removes its user-global copies because Codex runs a duplicate twice, and the other runtimes were not asked for.
- Removing the copy when the switch is turned off - the operator can delete the entries or restore the backup; an automatic removal could erase hooks the operator meant to keep.
- Pinning one checkout as the only source - the script resolves its own checkout from its real path, so a symlinked Skilled syncs from the Skilled checkout itself; a vendored copy is off by default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/sync-claude-user-hooks.mjs` | Create | The sync script and its `--session-start`, `--check`, `--dry-run` modes |
| `.skilled/bin/lib/user-hook-file.mjs` | Create | Shared hook identity, ownership, primary-checkout and atomic-write helpers |
| `.skilled/bin/install-codex-hooks.mjs` | Modify | Import the moved helpers; no behavior change |
| `.skilled/bin/tests/sync-claude-user-hooks.test.cjs` | Create | Merge, switch, worktree, check and guard cases against temp files |
| `.skilled/hooks/shared/hook-flags.cjs` | Modify | `claude-user-hook-sync` in `DEFAULT_OFF` |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | The SessionStart binding and the Claude `requireTree` setting |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs` | Modify | Render the presence guard for a runtime that names `requireTree` |
| `.claude/settings.json` | Modify | Re-rendered by the sync script, never by hand |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` | Modify | Guard rendering case |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.skilled/commands/doctor/assets/doctor-env.yaml`, `.env.example`, `.skilled/hooks/hook-flags.env.example`, `.skilled/bin/README.md` | Modify | Document the switch and the script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With the switch unset, a SessionStart run writes nothing and prints nothing, so an install of Skilled never touches user settings by default |
| REQ-002 | With the switch on, a run from the primary checkout leaves the user file's Skilled-owned hook entries equal to the project's `hooks` block, keeps every non-owned hook and every other key, and writes nothing when nothing differs |
| REQ-003 | Every rendered Claude hook command exits 0 with no output in a project folder that has no `.skilled` entry, and `.claude/settings.json` stays in sync with the registry |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A run from a linked worktree writes nothing in session mode and refuses with a message when run by hand without `--allow-worktree` |
| REQ-005 | The first write keeps a backup of the user file, and every write goes through a temp file and a rename |
| REQ-006 | The Codex installer behaves as before with the moved helpers, proven by its existing tests |
| REQ-007 | `/doctor:env` and the env references list the enable switch |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/bin/tests/sync-claude-user-hooks.test.cjs .skilled/bin/tests/install-codex-hooks-source-root.test.cjs` prints `fail 0`.
- **SC-002**: `node sync-hook-registrations.cjs --check` exits 0, and the hook-registration and parity vitest suites pass.
- **SC-003**: With the switch on in the primary checkout, one session start leaves no Skilled hook in `~/.claude/settings.json` that differs from `.claude/settings.json`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude Code deduplicates identical hook commands across settings files | High: without it, every Skilled hook would run twice in a Skilled repo | Measured above with a debug log; the guard is rendered into the project file too, so the strings stay identical |
| Risk | Claude Code and parallel sessions also write `~/.claude/settings.json` | Med | Read, merge and rename in one short step, skip the write when nothing differs, keep a backup on the first write |
| Risk | Two checkouts with the switch on would overwrite each other's copy | Low | Session mode syncs only from a primary checkout; the switch is per checkout in `hook-flags.env`, and the docs say an environment-wide enable applies to every checkout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A session-start run that changes nothing reads two JSON files and exits within its 5 s hook timeout.

### Security
- **NFR-S01**: The script writes only the target settings file, its backup and a temp file beside it, and never a path from a hook payload.

### Reliability
- **NFR-R01**: A malformed user file is never overwritten; the run exits non-zero and the wrapper prints a named sync message.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a missing user file is created holding only the copied `hooks` block.
- Maximum input: a user file whose groups mix owned and non-owned hooks keeps the non-owned hooks in their group.
- Failure path: a user file that is not a JSON object exits 1 and is left unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One new script and helper module, one renderer setting, one flag, docs |
| Risk | 12/25 | Writes a user file outside the repo; changes every rendered Claude command |
| Research | 6/20 | Hook dedupe measured; the Codex installer's ownership rules reused |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose the per-session copy over a whole-file symlink and over dropping the copy, and asked that it stay off for other installs by default.
<!-- /ANCHOR:questions -->
