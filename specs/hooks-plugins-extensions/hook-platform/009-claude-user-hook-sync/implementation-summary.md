---
title: "Implementation Summary"
description: "An opt-in SessionStart step now keeps the user-level copy of Skilled's Claude hooks equal to the project file, and every Claude hook exits quietly outside a Skilled repo, so a renamed hook can no longer leave a stale copy that warns on every Bash call."
trigger_phrases:
  - "claude user hook sync implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/009-claude-user-hook-sync"
    last_updated_at: "2026-11-16T10:18:26Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented and unit-verified the opt-in Claude user hook sync"
    next_safe_action: "Commit, merge main, ask before pushing, then enable the switch in the primary checkout"
    blockers: []
    key_files:
      - ".skilled/bin/sync-claude-user-hooks.mjs"
      - ".skilled/bin/lib/user-hook-file.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-claude-user-hook-sync"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-claude-user-hook-sync |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Your user-level Claude settings can now carry a copy of Skilled's Claude hooks that refreshes itself at each session start, so a renamed hook folder no longer leaves stale paths that warn on every Bash call. The copy is off by default, and every Claude hook now exits quietly in a project with no `.skilled` tree.

### Opt-in sync of Skilled's Claude hooks into the user-level Claude settings

Set `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED=1` in `hook-flags.env` of your primary checkout. At the next session start, `.skilled/bin/sync-claude-user-hooks.mjs` removes every hook in `~/.claude/settings.json` whose identity sits under `.skilled/` or `.opencode/` and adds the project's `hooks` block in their place. Your model, env, plugins, permissions, status line and any other hooks, such as Orca's, stay as they were. The first write keeps a backup at `~/.claude/settings.json.pre-skilled-hook-sync`.

You can run it by hand too. `--check` reports drift with exit 1, `--dry-run` prints what would change, and `--target`, `--repo` and `--allow-worktree` point it elsewhere. A linked worktree never syncs at session start, and a manual write from one needs `--allow-worktree`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/sync-claude-user-hooks.mjs` | Created | The sync script and its session, check and dry-run modes |
| `.skilled/bin/lib/user-hook-file.mjs` | Created | Hook identity, ownership, primary-checkout and atomic-write helpers moved from the Codex installer |
| `.skilled/bin/install-codex-hooks.mjs` | Modified | Imports the moved helpers; behavior unchanged |
| `.skilled/bin/tests/sync-claude-user-hooks.test.cjs` | Created | Eight cases against temp files and a temp git repo |
| `.skilled/hooks/shared/hook-flags.cjs` | Modified | `claude-user-hook-sync` in `DEFAULT_OFF` with `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED`; kill switch `SYSTEM_CLAUDE_USER_HOOK_SYNC_DISABLED` |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modified | Claude `requireTree: ".skilled"` and the SessionStart binding at group 0, slot 8, timeout 5, silent |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs` | Modified | Renders `{ [ -e .skilled ] \|\| exit 0; } && ` after the `cd` for a runtime that names `requireTree` |
| `.claude/settings.json` | Modified | Re-rendered by the sync script; the only one of the four settings files that changed |
| `.claude/hooks/sync-claude-user-hooks.mjs` | Created | Mirror symlink added by `sync-runtime-mirrors.cjs` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` | Modified | Binding count 118 to 119 and a guard rendering case |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/settings-driven-invocation-parity.vitest.ts` | Modified | SessionStart count 8 to 9 |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | Two switch rows and the default-off sentence |
| `.skilled/commands/doctor/assets/doctor-env.yaml`, `.env.example`, `.skilled/hooks/hook-flags.env.example` | Modified | List the switch |
| `.skilled/bin/README.md` | Modified | Documents the script |
| `.claude/hooks/README.md` | Modified | Mirror count fixed to 31; it said 26 while 32 mirrors existed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The stale paths and the Claude dedupe were measured first, then the Codex suite was run as a baseline before its helpers moved. After the change, the sync suite ran with three mutants, then the Codex, registry, parity, env and doctor suites, then every rendered command in an empty folder, then a sync over a copy of the real user file. The change is in branch `worktrees/428-claude-user-hook-sync`, not yet committed or pushed. Enabling the switch in the primary checkout waits for the push and the operator's go-ahead.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Copy the hooks block, not symlink the whole file or drop the copy | The operator chose it. A whole-file symlink would wipe the operator's model, env, plugins, permissions, status line and Orca hooks. |
| Off by default | The operator asked that an external install never touches user settings unless it is turned on. |
| Render the guard into the project file too | Claude Code runs an identical command string once across settings files. A debug log of a headless `claude -p` run showed each of six Skilled hooks run once while both files listed them, and the user-level Orca hook also ran. A guard only on the copy would break that identity and run every hook twice. |
| Keep a user-level copy for Claude, unlike Codex | `install-codex-hooks.mjs` lines 133 to 137 remove user-global copies because Codex runs duplicates twice. Claude dedupes, so a copy is safe here. |
| Sync only from a primary checkout, with the source taken from the script's real path | Node resolves the entry symlink, so a symlinked Skilled syncs from the Skilled checkout itself. The switch lives per checkout in `hook-flags.env`. |
| Replace every owned entry, not only those in the source | A renamed or dropped hook then leaves the copy. Stale entries were the original bug. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/bin/tests/sync-claude-user-hooks.test.cjs` | PASS, 8 pass, 0 fail. Mutants caught: switch check, worktree check and backup-once removed each fail one named case. |
| `install-codex-hooks-source-root.test.cjs` and `install-codex-hooks.mjs --check` | PASS, 20/0 before and after; `--check` OK on main and worktree |
| `hook-registration-sync.vitest.ts` | PASS, 9/9 |
| `hook-adapter-path-parity.vitest.ts` | PASS, 153/153 |
| Advisor settings parity and stress parity | PASS, 41/41 and 2/2 |
| `env-reference-drift.vitest.ts` | PASS, 5/5 |
| 35 node test files that load `hook-flags.cjs` | PASS, 1087/0 |
| Doctor suites | PASS: hook-wiring 3/0, git-setup-check 83/0, overlay-engine strict 17/0, follow-up 42/0, repin 26/0, quality-gate-layers 10/0, source-root-consumers 9/0 |
| `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` | PASS on the 36-hook registry; exit 0 |
| Rendered Claude commands in an empty folder | PASS, 36 of 36 exit 0 with no output; PreToolUse Bash hooks still run in the repo; env-secret-guard denies a dotenv read the same on main and worktree |
| Sync of a copy of the real `~/.claude/settings.json` | PASS: 20 owned removed, 36 added, 16 non-owned kept; non-hook keys and Orca hooks equal; second `--check` OK |
| Live enable in the primary checkout | Pending, waits for the push |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Turning the switch off leaves the copy in place.** Delete the Skilled entries by hand or restore `~/.claude/settings.json.pre-skilled-hook-sync`.
2. **An environment-wide enable reaches every checkout.** Every primary checkout that can read the switch then syncs, so two of them would overwrite each other. Set the switch in one checkout's `hook-flags.env` instead.
3. **A vendored Skilled copy stays off.** It has its own `hook-flags.env`; enable it there if you want it.
4. **The current copy still holds the old unguarded strings.** Until the first sync after this lands, those strings differ from the project file and would run hooks twice. One sync fixes it.
<!-- /ANCHOR:limitations -->

---


