---
title: "Worktree Guard Hook: Git Worktree Safety"
description: "SessionStart guard that warns when a top-level AI session runs on the shared checkout instead of an isolated worktree. Eight runtimes run it and four folders here link to it."
trigger_phrases:
  - "worktree guard hook"
  - "worktree safety"
  - "shared checkout warning"
  - "claude worktree guard"
  - "sessionstart isolation guard"
  - "codex worktree guard"
  - "cursor worktree guard"
  - "devin worktree guard"
importance_tier: "normal"
contextType: "reference"
---

# Worktree Guard Hook: Git Worktree Safety

---

## 1. OVERVIEW

`git-worktree-guard/` indexes one guard, the script `bash .skilled/bin/worktree-guard.sh` that runs at session start. The script warns when a top-level AI session runs on the shared checkout. That session belongs in an isolated worktree, which is the repository's model.

Two sessions on one working tree can collide over shared files and shared MCP databases. The model is one worktree per session, so the guard names the off-model state.

The warning names the current branch and the isolation command. It points the operator at `worktree-session.sh`, which launches the next session inside its own worktree.

A SessionStart hook cannot move an already-started process into a worktree, but it can warn. This guard does exactly that, and it never blocks the session.

The guard is advisory, so it prints one line to stderr and always exits 0. A session the operator chose to run on the shared checkout therefore never blocks.

Four folders here hold one relative symlink each into `.skilled/bin/`. Eight runtimes run the real script. Four register it in `hook-registry.json`. Three run it from their own session-start code: OpenCode, Pi and DSH. Vibe reaches it through the session-lifecycle hook.

---

## 2. HOW IT WORKS

The script runs its checks in order, and each one can end the run early.

1. It reads `SPECKIT_WORKTREE_GUARD` first, and a value of `off` exits 0 at once.
2. It sources `.skilled/hooks/shared/hook-flags.sh` from the repository root, then reads two switches. The legacy `SYSTEM_WORKTREE_GUARD_DISABLED` alias is checked first, then `hook_enabled git-worktree-guard`, and either one disables the guard. A missing resolver leaves the guard enabled. The shared switch is read only inside a git repository.
3. It skips orchestrated children, because `AI_SESSION_CHILD=1` marks a child that shares the parent's tree.
4. It compares `git-dir` with `git-common-dir`, and a missing `git-dir` means no repository. A linked worktree gives `git-dir != git-common-dir`, so it is already isolated and stays silent.

Wire it into any runtime's SessionStart chain as `bash /abs/path/.skilled/bin/worktree-guard.sh`, beside the other guards.

The script starts the numbered-worktree sweep before it compares the two directories. A linked worktree therefore starts the sweep too. It runs `worktree-reaper.sh --numbered` detached, so the hook returns at once. At most one sweep starts per six hours. A stamp file in the shared git directory tracks that window. Every later session start inside the window spawns nothing.

The stamp is `worktree-reaper-numbered.stamp`, written before the sweep starts. A stamp that cannot be written spawns nothing, so a read-only git directory stays quiet. The sweep's output lands in `worktree-reaper-numbered.log` beside the stamp. `SPECKIT_WORKTREE_AUTOREAP=0` stops the sweep alone, and the guard's own switches stop both.

On the shared checkout the script prints one line to stderr:

```text
[worktree-guard] This top-level session is running on the shared '<branch>' checkout, not an isolated worktree. Concurrent AI sessions here can collide (shared working tree + MCP databases). To isolate next time, launch via: bash .skilled/bin/worktree-session.sh <runtime>. (silence: SPECKIT_WORKTREE_GUARD=off)
```

The guard stays advisory. It warns on stderr and never blocks git or a session. Its scope is the top-level session on the shared checkout. A linked worktree is already isolated. An orchestrated child shares the parent's tree on purpose, so both stay silent.

It fails open, so a non-repository directory exits 0 with no warning. The script is bash only and imports nothing outside the repository. The real code stays in `.skilled/bin/`, and the four folders here hold relative symlinks.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `SessionStart [id worktree-guard, timeout 3]` | `claude/worktree-guard.sh` | `.skilled/bin/worktree-guard.sh` | The warning line on stderr only. |
| Codex | `SessionStart [id worktree-guard, timeout 3]` | `codex/worktree-guard.sh` | `.skilled/bin/worktree-guard.sh` | The warning line on stderr only. |
| Cursor | `sessionStart [id worktree-guard, timeout 10]` | `cursor/worktree-guard.sh` | `.skilled/bin/worktree-guard.sh` | The warning line on stderr only. |
| Devin | `SessionStart [id worktree-guard, timeout 3]` | `devin/worktree-guard.sh` | `.skilled/bin/worktree-guard.sh` | The warning line on stderr only. |
| OpenCode | `session.created` | None | `.opencode/plugins/session-cleanup.js` | One line in the system context, once per session. |
| Pi | `session_start` | None | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | The warning as a Pi notification. |
| DSH | `agent/created` | None | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | The warning as an injected notice. |
| Vibe | `session_start` | None | `.vibe/plugins/repo-guards/session-cleanup.mjs` | The warning in the session-start additional context. |

Session start continues on every runtime, because the guard never blocks a turn.

Claude, Codex, Cursor and Devin register the guard in `hook-registry.json` under the id `worktree-guard`. Claude, Codex and Devin give it 3 seconds and Cursor gives it 10. Each registration runs `bash .skilled/bin/worktree-guard.sh`, and Claude, Codex and Devin change into the project directory first.

On those four runtimes the warning reaches stderr only. A human watching the terminal sees it, and the model never does. A run that cannot start the script adds a drift envelope. Claude and Codex return `additionalContext`, and Cursor returns `permission: "allow"` with one `agent_message`. Devin has no fallback, so a failed run adds no envelope.

Pi runs the script from its `session_start` handler, on the `startup` and `new` reasons. It shows the warning with `ctx.ui.notify`, which does nothing in print mode. DSH runs it on `agent/created` for a startup session. It injects the warning as a notice. A fan-out leaf skips it on DSH.

OpenCode runs the script from the plugin's `event` callback on `session.created`. The plugin waits up to 8 seconds. It appends the warning to the system context once per session.

Vibe runs the guard too. `.vibe/hooks.toml` calls `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` at `session_start`. That hook runs `.vibe/plugins/repo-guards/session-cleanup.mjs`, which reuses `.opencode/plugins/session-cleanup.js`. It fires that plugin's `session.created` event and returns the warnings as `additional_context`. It skips when the `session-cleanup` concern is off.

---

## 4. DIRECTORY TREE

```text
git-worktree-guard/
+-- README.md
+-- claude/   worktree-guard.sh -> ../../../bin/worktree-guard.sh
+-- codex/    worktree-guard.sh -> ../../../bin/worktree-guard.sh
+-- cursor/   worktree-guard.sh -> ../../../bin/worktree-guard.sh
`-- devin/    worktree-guard.sh -> ../../../bin/worktree-guard.sh
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/bin/worktree-guard.sh` | The guard. It reads the switches, skips children, compares the two git directories, starts the sweep and warns on stderr. |
| `.skilled/bin/worktree-session.sh` | The launcher the warning names as the fix. It starts a runtime inside an isolated worktree. Not in this folder. |
| `.skilled/bin/worktree-reaper.sh` | The sweep the guard starts with `--numbered`. It removes a finished numbered worktree and keeps a busy one. |
| `.skilled/hooks/shared/hook-flags.sh` | The shared shell resolver. It answers `hook_enabled git-worktree-guard` and the legacy alias. |
| `.opencode/plugins/session-cleanup.js` | The OpenCode plugin. It runs the guard with the other startup guards and surfaces the warning once. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | The Pi adapter. It runs the guard at session start and shows the warning as a notification. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | The DSH adapter. It runs the guard on `agent/created` and injects the warning. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Holds the `worktree-guard` entry for Claude, Codex, Cursor and Devin. |

---

## 6. CONFIGURATION

The guard is on by default. A switch is on when its value is `1`, `true`, `yes` or `on`. The case does not matter, so `ON` and `on` both count.

| Switch | Effect |
|---|---|
| `SYSTEM_GIT_WORKTREE_GUARD_DISABLED=1` | The canonical kill-switch. The shared resolver reports the concern as off, so the guard exits 0. |
| `SYSTEM_WORKTREE_GUARD_DISABLED=1` | The legacy alias. The script checks it before the canonical switch. |
| `SPECKIT_WORKTREE_GUARD=off` | The caller-side switch. It is read first, before the shared resolver. |
| `SYSTEM_HOOKS_DISABLED=1` | The master switch. It turns off this concern with every other repository hook. |
| `AI_SESSION_CHILD=1` | Not a kill-switch. It marks an orchestrated child, which never warns. |
| `SPECKIT_WORKTREE_AUTOREAP=0` | Stops the numbered sweep alone. The guard still warns. |
| `SPECKIT_WORKTREE_REAPER` | Names another reaper script. The default sits beside the guard. |

Set a switch inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `hook-flags.env.example`. The environment wins over the file, so a persisted default stays overridable.

---

## 7. VALIDATION

Run these commands from the repository root.

```bash
bash .skilled/bin/worktree-guard.sh; echo "exit: $?"
```

The first command prints `exit: 0` and a `[worktree-guard] ...` warning line on the shared checkout. Inside a linked worktree it prints nothing at all.

```bash
SPECKIT_WORKTREE_GUARD=off bash .skilled/bin/worktree-guard.sh; echo "exit: $?"
```

The second command silences the guard through the caller-side switch. It prints `exit: 0` and nothing else, because the switch short-circuits.

```bash
AI_SESSION_CHILD=1 bash .skilled/bin/worktree-guard.sh; echo "exit: $?"
```

The third one exercises the orchestrated-child exemption and prints `exit: 0` alone.

```bash
find .skilled/hooks/git-worktree-guard -type l | wc -l
```

The last command counts the links in this folder, and the expected result is `4`.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../shared/README.md`](../shared/README.md): the switch resolver the guard sources.
- [`../session-lifecycle/README.md`](../session-lifecycle/README.md): the session-start adapters that run the guard on Pi and DSH.
- [`../../skills/sk-git/`](../../skills/sk-git/): the git workflow skill that owns worktree policy.
- [`../../bin/worktree-session.sh`](../../bin/worktree-session.sh): the launcher the warning names as the fix.
- [`../../bin/worktree-reaper.sh`](../../bin/worktree-reaper.sh): the sweep the guard starts.
