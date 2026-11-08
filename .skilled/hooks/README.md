---
title: "Hooks: Fully-Portable Guard Cores + Git Commit Hooks"
description: "Every 'hook' concept in the repo under one root: AI-runtime lifecycle guard cores organized by concern, plus the git commit-hooks installer, previously two separately-named trees."
trigger_phrases:
  - "hooks tree"
  - "runtime hooks"
  - "portable guard cores"
  - "hook relocation"
  - "git hooks"
  - "dispatch preflight"
  - "mcp route guard"
  - "post edit quality"
  - "task dispatch guard"
---

# Hooks: Fully-Portable Guard Cores + Git Commit Hooks

> AI runtime lifecycle guard cores and the git commit hooks installer share this directory.

---

## 1. OVERVIEW

`.skilled/hooks/` is the single home for every "hook" concept in the repo. Ten concern folders hold AI-runtime lifecycle hooks as real code here: `ask-surface-guard/`, `dispatch/`, `mcp-route-guard/`, `overlay-guard/`, `post-edit-quality/`, `task-dispatch/`, `classifier-injection-screen/`, `decision-capture/`, `goal/` and `session-relaunch/`, plus their shared helpers and session readers in `shared/`. Four of them (`dispatch/`, `mcp-route-guard/`, `post-edit-quality/` and `task-dispatch/`) have no real dependency on the skill they used to live inside, and each was originally nested under a domain skill's own tree (`cli-opencode/scripts/`, `mcp-code-mode/runtime/`, `sk-code/sk-code-quality/scripts/`, `system-deep-loop/runtime/lib/deep-loop/`). `overlay-guard/` and `classifier-injection-screen/` were written here from the start. The classifier reaches into `cli-classifier` for its Jev gate, transport and measured question. Moving those four out means a user can adopt or remove the enforcement layer independently of the skill's own knowledge and reference content.

A further AI-runtime concern, [`goal/`](./goal/README.md), is a cross-runtime sibling of the OpenCode `opencode-goal` plugin. It binds a session to a spec packet whose `goal.md` is the directive, renders that file's durable slice with the frontmatter stripped, on every turn where that runtime injects at all (OpenCode, Pi, Devin and DSH per turn, Cursor at session start), and keeps only the pointer, liveness and telemetry per session. Pi, Cursor, Devin and DSH reach it through native session identity. OpenCode keeps using `opencode-goal` directly, which imports the same slice module.

A sixth folder, [`git/`](./git/README.md), holds the git commit-hooks installer (the pre-commit gate): an unrelated concept from the AI-runtime concerns above, nested here only because both are "hooks" in the everyday sense and the operator wanted one unified tree rather than two similarly-named sibling directories (`hooks/` and `runtime-hooks/`). **`git/pre-commit` is standalone and opt-in**: it is installed only by its own `install-hooks.sh`, and the repository's primary hook, `.skilled/scripts/git-hooks/pre-commit`, carries its own inline comment-hygiene gate and never calls this folder's hook. See [`git/README.md`](./git/README.md) for that installer's own contract, and [`injection-contract.md`](./injection-contract.md) for what each AI-runtime hook here actually injects and its visibility to the human operator.

A session-relaunch concern, documented in [session-relaunch/](./session-relaunch/README.md), adds context nudges and runtime-specific arming for Claude, Pi, OpenCode and Codex sessions started through skilled-loop. Cursor, Devin and DSH join the same loop on the `/speckit:handoff` command trigger only. Inside skilled-loop the nudge asks for a hop, and outside it only for a note the session keeps through compaction. The sourced `.skilled/bin/skilled-loop-shell.sh` shim starts every plain interactive runtime launch under the nearest wrapper, a symlinked `.skilled` included. Each hop adds a line to a gitignored hop history, and `SESSION_RELAUNCH_NOTIFY_HOPS` adds an opt-in macOS notice per hand-over. The concern ships off: set `SYSTEM_SESSION_RELAUNCH_ENABLED=1` to turn it on for every runtime, or `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` to turn it on (`1`) or off (`0`) for one.

### Full index

Beyond those real-code cores, this tree is now the **full browsable index of every repo-authored hook**. Skill-owned hooks whose logic is genuinely their skill's engine still keep their **code** in the owning skill, but each is **symlinked in** here under `<concern>/<runtime>/` (the symlink is the index entry, the code stays local): so one directory shows every hook the repo installs, organized by concern and runtime.

Every concern except `git-message-gate` honors the master `SYSTEM_HOOKS_DISABLED` switch and its canonical `SYSTEM_<CONCERN>_DISABLED` switch. The message gate has none on purpose: the commit, PR and branch rules carry no bypass on any surface, and the place to change them is the rules block in the sk-git templates. The default is enabled, except `session-relaunch`, which ships off and runs on a runtime only once its enable flag is truthy. That flag is `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` when it holds a value, where `<RUNTIME>` is `CLAUDE`, `CODEX`, `PI`, `OPENCODE`, `CURSOR` or `DEVIN`, and `SYSTEM_SESSION_RELAUNCH_ENABLED` when it is empty or unset. So `SYSTEM_SESSION_RELAUNCH_ENABLED=1` with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` is on for every runtime except Claude Code. The disable switch and the master switch still win over every enable flag. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive). See the kill-switch index below for the complete concern and alias inventory.

### Kill-switch index

This table is the single source of truth for repo-authored hook kill-switch names. All concerns are wired to the shared resolver or its shell equivalent.

| Concern | Canonical flag (`SYSTEM_<CONCERN>_DISABLED`) | Legacy aliases | Default | Effect | Status |
|---|---|---|---|---|---|
| `skill-advisor` | `SYSTEM_SKILL_ADVISOR_DISABLED` | `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` | enabled | inject | wired |
| `spec-gate` | `SYSTEM_SPEC_GATE_DISABLED` | `SPECKIT_SPEC_GATE_DISABLED` | enabled | notice / deny | wired |
| `completion` | `SYSTEM_COMPLETION_DISABLED` | `SYSTEM_COMPLETION_SENTINEL_DISABLED`, `SYSTEM_SPECKIT_COMPLETION_DISABLED` | enabled | warn | wired |
| `decision-capture` | `SYSTEM_DECISION_CAPTURE_DISABLED` | none | enabled | queue (local, for the next save) | wired |
| `ask-surface` | `SYSTEM_ASK_SURFACE_DISABLED` | none | enabled | re-prompt (Claude, DSH, OpenCode, Pi) / warn (Codex, Devin) | wired |
| `codex-watchdog` | `CODEX_HOOKS_WATCHDOG_DISABLED` | `CODEX_WATCHDOG_DISABLED` | enabled | warn | wired |
| `permission-policy` | `SYSTEM_PERMISSION_POLICY_DISABLED` | none | enabled | deny | wired |
| `directive-lifecycle` | `SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED` | none | enabled | inject cadence | wired |
| `dispatch` | `CLI_DISPATCH_AUDIT_DISABLED` | `SYSTEM_DISPATCH_DISABLED` (both concerns) | enabled | audit | wired |
| `dispatch-guard` | `SYSTEM_DISPATCH_GUARD_DISABLED` | `SYSTEM_DISPATCH_DISABLED` (both concerns) | enabled | deny (preflight) | wired |
| `post-edit-quality` | `SK_CODE_POST_EDIT_QUALITY_DISABLED` | none | enabled | warn | wired |
| `task-dispatch` | `SYSTEM_TASK_DISPATCH_DISABLED` | none | enabled | warn / deny | wired |
| `mcp-route-guard` | `MCP_ROUTE_GUARD_DISABLED` | none | enabled | warn / audit | wired |
| `overlay-guard` | `SYSTEM_OVERLAY_GUARD_DISABLED` | none | enabled | deny | wired |
| `goal` | `OPENCODE_GOAL_DISABLED` | `OPENCODE_GOAL_PLUGIN_DISABLED` | enabled | inject / tool | wired |
| `git-preflight` | `SK_GIT_PREFLIGHT_DISABLED` | none | enabled | warn | wired |
| `session-lifecycle` | `SYSTEM_SESSION_LIFECYCLE_DISABLED` | none | enabled | inject / teardown | wired |
| `git-worktree-guard` | `SYSTEM_GIT_WORKTREE_GUARD_DISABLED` | `SYSTEM_WORKTREE_GUARD_DISABLED`, `SPECKIT_WORKTREE_GUARD=off` (caller-side) | enabled | warn | wired |
| `git-hooks-check` | `SYSTEM_GIT_HOOKS_CHECK_DISABLED` | `SPECKIT_GIT_HOOKS_GUARD=off` (caller-side) | enabled | warn | wired |
| `live-sync` | `SYSTEM_LIVE_SYNC_DISABLED` | none | enabled | publish / follow / install / reconcile | wired |
| `live-follow` | `SYSTEM_LIVE_FOLLOW_DISABLED` | none | enabled | follow | wired |
| `primary-reconcile` | `SYSTEM_PRIMARY_RECONCILE_DISABLED` | none | enabled | reconcile | wired |
| `dist-freshness` | `SYSTEM_DIST_FRESHNESS_DISABLED` | none | enabled | warn / rebuild | wired |
| `session-cleanup` | `SYSTEM_SESSION_CLEANUP_DISABLED` | none | enabled | teardown | wired |
| `hook-install` | `SYSTEM_HOOK_INSTALL_DISABLED` | none | enabled | cleanup / check | wired |
| `git-commit-hooks` | `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` | none | enabled | deny | wired |
| `injection-screen` | `SYSTEM_INJECTION_SCREEN_DISABLED` | `JEV_FEATURE_INJECTION_SCREEN=0` and `JEV_FEATURES=0` (Jev feature switches, read the other way round) | enabled when a Jev credential is stored | inject (advisory) | wired |
| `session-relaunch` | `SYSTEM_SESSION_RELAUNCH_DISABLED` | none | off, turn on with `SYSTEM_SESSION_RELAUNCH_ENABLED=1`, per runtime with `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` | inject / arm | wired |

`SYSTEM_SPEC_GATE_ENFORCE` is a separate opt-in control for spec-gate denial, not a kill-switch. The process environment sets it, so `hook-flags.env` cannot. `SPECKIT_DIST_AUTO_REBUILD` controls whether a stale dist is rebuilt. It does not disable the freshness check. The `git-commit-hooks` switch is an emergency off switch for the pre-commit chain. With the switch unset, mass-deletion and comment-hygiene checks remain active.

### Setting flags

Flags resolve from two places: the live environment, and an optional config file. The environment always wins, so a persisted default can still be overridden for one session.

- **Environment**: set any flag inline (`SYSTEM_SKILL_ADVISOR_DISABLED=1 <command>`), for a session (`export SYSTEM_SPEC_GATE_DISABLED=1`), or in your shell profile.
- **Config file**: copy `hook-flags.env.example` to `hook-flags.env` (in this directory) and uncomment the flags you want off. It uses the same `KEY=value` names, is gitignored (personal to you), and is read by every guard variant. A comment can follow a value after a space or tab, so the example's lines work as soon as you uncomment them. Re-enable a file-disabled hook for one session with e.g. `SYSTEM_SKILL_ADVISOR_DISABLED=0`. `/doctor:env` shows where each switch is set and writes one here after your yes, and the root `.env.example` lists every other setting with its default.

```bash
cp .skilled/hooks/hook-flags.env.example .skilled/hooks/hook-flags.env
# then edit hook-flags.env and uncomment what you want disabled
```

The same file holds two switches that are not hook concerns, for people who do not care whether their docs drift from the expected formats. `SPECKIT_SKIP_VALIDATION` switches spec folder validation (`validate.sh`) off, and `SKDOC_SKIP_VALIDATION` switches off every sk-doc validator. Both follow the precedence above and take the same truthy values. `hook_flag_on` in the shell mirror and `isFlagOn` in `hook-flags.cjs` resolve a named switch like these. [ENV-REFERENCE.md](../skills/system-spec-kit/runtime/ENV-REFERENCE.md) and sk-doc's [validation-and-enforcement.md](../skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md) say what each one covers.

### Why only these five cores keep their real code here

A core only qualifies to keep its **real code** in this tree when it imports nothing but Node builtins (or shells out to an unrelated, unmoved checker script by path) and has no real tie to its owning skill's other content. Verified per core before it moved or was written here:

| Concern | Core dependencies | Verdict |
|---|---|---|
| `dispatch` | Node builtins only | Portable |
| `mcp-route-guard` | Node builtins only | Portable |
| `overlay-guard` | Node builtins, plus the overlay engine loaded only when the tree has an overlay folder | Portable |
| `post-edit-quality` | Node builtins + `spawnSync` to unmoved checker scripts (invoked by path, never imported) | Portable |
| `task-dispatch` | Node builtins only | Portable |

The Jev [`classifier-injection-screen/`](./classifier-injection-screen/README.md) hook is the deliberate exception to that rule: it lives here for hook registration, but its adapter and library import the gate, transport and measured question from `cli-classifier`, so the live hook and the offline measurement cannot drift apart.

Hooks that did **not** move keep their code inside their owning skill because their core logic genuinely is that skill's engine, not a bolt-on guard: `spec-gate-*`, the session-lifecycle hooks, and `completion-evidence-stop` (`system-spec-kit`), the skill-advisor brief (`system-skill-advisor`), and `git-preflight-advisory` (`sk-git`, depends on its own `git-context.mjs`/`git-rule-checks.mjs` rule engine). Their code stays there, but each now has an index symlink under `<concern>/<runtime>/` here (see Full index above) and honors the `isHookEnabled` kill-switch.

`hook-adapter-shared.cjs`, a tiny stdin-parsing helper with zero dependencies of its own, has its own local copy at `shared/hook-adapter-shared.cjs`. It used to be a single copy inside `system-spec-kit` that adapters here reached back into: a real cross-tree dependency that contradicted the whole point of this relocation (a user adopting the enforcement layer without the skill would still have pulled in a `system-spec-kit` file). A second, independent ESM sibling lives at `system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` for the four `spec-gate-enforce.mjs` adapters of that skill that import it (`claude`, `codex`, `cursor` and `devin`). Those adapters are not part of the fully-portable set, and the `dsh` adapter takes its payload from the DSH runtime and does not import it. The two copies are allowed to drift only in the sense that either could change independently, though in practice this file is small and stable enough that they shouldn't.

---

## 2. DIRECTORY TREE

```text
hooks/
+-- git/                             # git commit-hooks installer (unrelated concept, see OVERVIEW)
|   +-- README.md
|   +-- install-hooks.sh
|   `-- pre-commit                   # standalone, opt-in; the primary hook has its own gate
+-- shared/
|   +-- hook-adapter-shared.cjs      # stdin collection + fail-open JSON parse, used by the CommonJS and ESM adapters below
|   +-- session-readers/             # read-only per-runtime session readers (Claude, Codex, Pi, OpenCode, Devin and DSH ready, Cursor gated)
|   `-- dsh/      dsh-llm.mjs (harness package loader), session-role.mjs (fan-out leaf marker)
+-- dispatch/                        # cli-opencode dispatch-shape hard-rule + audit hooks
|   +-- lib/
|   |   +-- dispatch-rule-checks.mjs
|   |   +-- dispatch-rule-checks.test.mjs
|   |   +-- dispatch-audit.mjs
|   |   `-- dispatch-audit.test.mjs
|   +-- claude/   dispatch-preflight-lint.mjs, dispatch-audit-posttooluse.mjs
|   +-- devin/    (same pair)
|   +-- codex/    (same pair)
|   +-- cursor/   dispatch-preflight-lint.mjs, post-tool-use.mjs (indexed proxy: Shell calls chain to the Claude audit)
|   +-- pi/       dispatch-preflight-lint.ts, dispatch-audit.ts (real file; `.pi/extensions/` symlinks to it)
|   +-- dsh/      dispatch-preflight-lint.mjs, dispatch-audit.mjs (real file; `.dsh/plugins/repo-guards/adapters/` symlinks to it)
|   `-- opencode/ cli-dispatch-audit.js (browsability symlink -> .opencode/plugins/)
+-- decision-capture/                # operator answers queued per project for the next full-auto save
|   +-- lib/capture-core.mjs, chat-questions.mjs (the chat-candidate detector every sweep shares), their tests
|   +-- claude/   ask-capture-posttooluse.mjs (PostToolUse on AskUserQuestion), fixtures/
|   +-- devin/    ask-capture-posttooluse.mjs (PostToolUse on ask_user_question), its test, fixtures/
|   +-- pi/       decision-capture.ts (tool_result on ask_user_question and question; `.pi/extensions/` symlinks to it), its test
|   +-- dsh/      decision-capture.mjs (tools/result on ask_user_question plus a late timed reply; the DSH adapters folder symlinks to it)
|   `-- bin/      sweep-transcript.mjs (Claude), sweep-opencode.mjs, sweep-devin.mjs, sweep-codex.mjs, sweep-pi.mjs, sweep-dsh.mjs, their tests, fixtures/
+-- mcp-route-guard/                 # native mcp_* call -> Code Mode routing advisory
|   +-- lib/mcp-route-guard.cjs, mcp-route-guard.test.cjs
|   +-- claude/, devin/, codex/      mcp-route-guard.cjs
|   +-- cursor/   mcp-route-guard.mjs
|   +-- pi/       mcp-route-guard.ts (real file; `.pi/extensions/` symlinks to it)
|   +-- dsh/      mcp-route-guard.mjs (real file; the DSH adapters folder symlinks to it)
|   `-- opencode/ mcp-route-guard.js (browsability symlink -> .opencode/plugins/)
+-- overlay-guard/                   # refuse an edit to a file a vendored copy's overlay owns
|   +-- lib/overlay-guard.cjs, overlay-guard.test.cjs
|   +-- claude/, devin/, codex/      overlay-guard.cjs
|   +-- cursor/   overlay-guard.mjs
|   +-- pi/       overlay-guard.ts (real file; `.pi/extensions/` symlinks to it)
|   `-- dsh/      overlay-guard.mjs (real file; the DSH adapters folder symlinks to it)
+-- post-edit-quality/               # comment-hygiene + dist-staleness findings on edit/write
|   +-- lib/post-edit-router.cjs
|   +-- claude/   claude-posttooluse.cjs
|   +-- devin/    post-edit-quality.cjs
|   +-- codex/    post-edit-quality.cjs
|   +-- cursor/   post-tool-use.mjs (indexed proxy: Write chains to the Claude check; same file as dispatch/cursor/)
|   +-- pi/       post-edit-quality.ts (real file; `.pi/extensions/` symlinks to it)
|   +-- dsh/      post-edit-quality.mjs (real file; the DSH adapters folder symlinks to it)
|   `-- opencode/ sk-code-post-edit-quality.js (browsability symlink -> .opencode/plugins/)
+-- ask-surface-guard/                          # Sends a turn ending in a prose option menu back to the question tool
|   +-- lib/      ask-surface-core.cjs (detector, verdict, per-turn marker), advisory-stop.cjs (+ tests)
|   +-- fixtures/ ten verdict fixtures the detector test reads
|   +-- claude/   ask-surface-stop.cjs (+ test; synchronous Stop, blocks once)
|   +-- codex/    ask-surface-stop.cjs (advisory)
|   +-- devin/    ask-surface-stop.cjs (advisory)
|   +-- pi/       ask-surface-guard.ts (+ test; `.pi/extensions/` symlinks to it)
|   `-- dsh/      ask-surface-guard.mjs (+ test; the DSH adapters folder symlinks to it)
+-- classifier-injection-screen/                # Jev screen of fetched web text for instructions aimed at an agent
|   +-- lib/  classifier-injection-advisory.mjs, classifier-screen-fetched-text.mjs
|   |           (+ a co-located test per module)
|   +-- claude/   classifier-injection-screen-posttooluse.mjs (+ test)
|   +-- devin/    classifier-injection-screen-posttooluse.mjs (+ test)
|   +-- opencode/ classifier-injection-screen.js (browsability symlink -> .opencode/plugins/)
|   +-- pi/       classifier-injection-screen.ts (+ test; `.pi/extensions/` symlinks to it)
|   `-- dsh/      classifier-injection-screen.mjs (real file; the DSH adapters folder symlinks to it)
+-- task-dispatch/                   # Task/subagent dispatch guard + Fable-subagent policy
|   +-- lib/dispatch-guard.cjs
|   +-- claude/   task-dispatch-guard.cjs, fable-subagent-guard.mjs
|   +-- devin/    task-dispatch-guard.cjs
|   +-- cursor/   task-dispatch-guard.mjs
|   +-- pi/       task-dispatch-guard.ts (real file; `.pi/extensions/` symlinks to it)
|   +-- dsh/      task-dispatch-guard.mjs (real file; the DSH adapters folder symlinks to it)
|   `-- opencode/ system-deep-loop-guard.js (browsability symlink -> .opencode/plugins/)
+-- session-relaunch/              # Claude, Pi, OpenCode and Codex context nudge and relaunch adapters
|   +-- bin/session-relaunch.cjs
|   +-- claude/compact-pointer.mjs, context-nudge.mjs, stop-arm.mjs, subagent-guard.mjs
|   +-- codex/context-nudge.mjs, prompt-seed.mjs, shared.mjs, stop-arm.mjs
|   +-- pi/session-relaunch.ts, session-relaunch.test.ts
|   +-- opencode/session-relaunch.js (browsability symlink -> .opencode/plugins/session-relaunch.js)
|   +-- lib/context-usage.cjs, nudge.cjs, relaunch-core.cjs, killer.cjs, goal-handover.cjs, hop-history.cjs, withdraw.cjs
|   `-- tests/ fourteen Node test files plus payload fixtures
`-- goal/                            # cross-runtime passive session-goal tracking (sibling of opencode-goal)
    +-- lib/goal-core.cjs, goal-core.test.cjs
    +-- lib/goal-slice.cjs, goal-slice.test.cjs   # packet goal.md projections shared with the OpenCode plugin
    +-- bin/goal.cjs                 # scoped management (bind, resent, log, packet), diagnostics, legacy quarantine
    +-- cursor/   goal-inject.mjs
    +-- devin/    goal-inject.mjs
    +-- pi/       goal-context.ts (real file; `.pi/extensions/` symlinks to it)
    +-- dsh/      goal-context.mjs, goal-manage.mjs (real files; the DSH adapters folder symlinks to them)
    `-- opencode/ opencode-goal.js (browsability symlink -> .opencode/plugins/)
```

**Skill-owned concerns are indexed here too**: the tree above shows only the concerns whose *real code* lives in this hub. Every skill-owned concern is additionally present as per-runtime symlinks under `<concern>/<runtime>/` (real code stays in the owning skill, as "Full index + kill-switches" above describes): `skill-advisor/`, `spec-gate/`, `session-lifecycle/`, `completion/`, `directive-lifecycle/`, `git-preflight/`, `git-message-gate/`, `dist-freshness/`, `codex-watchdog/`, and `permission-policy/`. The same pattern covers the bin-backed concerns: `git-live-follow/` and `git-primary-reconcile/` hold one symlink per runtime into `.skilled/bin/` and are indexed in the additional-hooks table below. DSH's skill-owned adapters follow it too: `skill-advisor/dsh/`, `spec-gate/dsh/`, `session-lifecycle/dsh/`, `completion/dsh/`, `git-preflight/dsh/` and `git-message-gate/dsh/` hold index links to the real files in `system-skill-advisor/hooks/dsh/`, `system-spec-kit/runtime/hooks/dsh/` and `sk-git/scripts/hooks/dsh/`.

Pi's portable adapters live here too, in per-concern `pi/` subfolders (`dispatch/pi/`, `mcp-route-guard/pi/`, `overlay-guard/pi/`, `post-edit-quality/pi/`, `task-dispatch/pi/`, `classifier-injection-screen/pi/`, `decision-capture/pi/`, `goal/pi/`, `session-relaunch/pi/`), Pi auto-discovers `.pi/extensions/`, but its loader follows symlinks and resolves each extension's relative imports against the *symlink* path (probe-verified against the installed loader), so `.pi/extensions/` holds relative symlinks back to the real files and every import stays written for the `.pi/extensions/` base. OpenCode (`.opencode/plugins/*.js`) remains the runtime whose adapter files genuinely cannot live here: its plugins are real modules in a fixed folder that its loader scans, so only their path to these cores changed. For browsability, each concern's `opencode/` subfolder holds a *relative symlink back into* `.opencode/plugins/`, the reverse of Pi's direction: nothing loads through the OpenCode symlink (verified: the loader globs only `.opencode/plugins/`, not the tree), it is a documentation mirror so the tree shows OpenCode beside the other runtimes. Cursor's multiplexed `post-tool-use.mjs` proxy is indexed under both `dispatch/cursor/` and `post-edit-quality/cursor/` because one live adapter serves both concerns.

DSH follows Pi's layout. Each real adapter lives in a per-concern `dsh/` subfolder, or in its owning skill's `hooks/dsh/` folder with an index link here, and `.dsh/plugins/repo-guards/adapters/` holds one relative link per adapter aimed at the real file. The bundle entry `.dsh/plugins/repo-guards/index.mjs`, which the guards patch loads, imports every adapter through those links. Node is not Pi's loader: it resolves a link to its real path before it resolves the adapter's own imports, so each DSH adapter's imports are written for its real folder, and the adapters that find the checkout from their own file (`dispatch-audit`, `dispatch-preflight-lint`, `git-preflight-advisory`, `mcp-route-guard`, `session-start-advisories`) count up from there. `sync-runtime-mirrors.cjs --check`, which `/doctor:runtime-mirrors` runs, derives one expected link per `.mjs` file in a `dsh/` folder here and reports a missing link, a stale one or a real file in its place.

---

## 3. KEY FILES

| Concern | Real adapters here | Stays in `.opencode/plugins/` (mirrored at `opencode/` via browsability symlink) |
|---|---|---|
| `dispatch` | claude, devin, codex, cursor (indexed proxy), pi (symlinked from `.pi/extensions/`), dsh (symlinked from `.dsh/plugins/repo-guards/adapters/`) | `cli-dispatch-audit.js` |
| `mcp-route-guard` | claude, cursor, devin, codex, pi (symlinked), dsh (symlinked) | `mcp-route-guard.js` |
| `overlay-guard` | claude, cursor, devin, codex, pi (symlinked), dsh (symlinked) | none: no OpenCode adapter |
| `post-edit-quality` | claude, devin, codex, cursor (indexed proxy), pi (symlinked), dsh (symlinked) | `sk-code-post-edit-quality.js` |
| `injection-screen` | claude, devin, pi (symlinked from `.pi/extensions/`), dsh (symlinked from `.dsh/plugins/repo-guards/adapters/`) | `classifier-injection-screen.js` |
| `task-dispatch` | claude, cursor, devin, pi (symlinked), dsh (symlinked) | `system-deep-loop-guard.js` |
| `goal` | cursor, devin, pi (symlinked), dsh (`goal-context.mjs` and `goal-manage.mjs`, symlinked), plus `lib/` core and slice module + `bin/` manage CLI | `opencode-goal.js` |
| `ask-surface` | claude (blocking Stop), codex and devin (advisory Stop), pi (symlinked from `.pi/extensions/`), dsh (symlinked from `.dsh/plugins/repo-guards/adapters/`), plus the `lib/` detector and its fixtures | `ask-surface-guard.js` |
| `decision-capture` | claude and devin (PostToolUse), pi (symlinked from `.pi/extensions/`), dsh (symlinked from `.dsh/plugins/repo-guards/adapters/`), plus save-time sweeps in `bin/` that read the Claude, Devin, Pi and DSH sessions, Codex rollouts and OpenCode's SQLite store | `decision-capture.js` (no `opencode/` mirror in this tree) |
| session-relaunch | Claude: context-nudge on PostToolUse / UserPromptSubmit, stop-arm on Stop, compact-pointer on SessionStart after a compaction, and subagent-guard on PreToolUse (Bash), which denies relaunch lifecycle commands run from a sub-agent. Pi: `message_end` / `before_agent_start` / `agent_end`. Codex: `prompt-seed.mjs` on UserPromptSubmit, `context-nudge.mjs` on PostToolUse, `stop-arm.mjs` on Stop. Cursor, Devin and DSH run the `/speckit:handoff` command trigger only | `session-relaunch.js` (real OpenCode adapter) |

`sk-git-preflight-advisory.js` and `cli-dispatch-audit.js` (OpenCode plugins owned by `sk-git`/`cli-opencode` respectively) both also import `dispatch/lib/dispatch-rule-checks.mjs` and `dispatch/lib/dispatch-audit.mjs` from here.

`shared/hook-adapter-shared.cjs` is the stdin reader for the adapters that parse a raw JSON payload. The CommonJS adapters `require` it: `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs`, `task-dispatch/{claude,devin}/task-dispatch-guard.cjs`, `post-edit-quality/{claude,codex,devin}` and `overlay-guard/{claude,codex,devin}/overlay-guard.cjs`. The ESM adapters import `readStdin` from it by name: `classifier-injection-screen/{claude,devin}`, `decision-capture/{claude,devin}`, `dispatch/{claude,codex,cursor,devin}` (preflight), `dispatch/{claude,codex,devin}` (audit), `goal/{cursor,devin}`, `mcp-route-guard/cursor`, `overlay-guard/cursor`, `session-relaunch/{claude,codex}` and `task-dispatch/{cursor,claude}`. Every one gives up at a 3000 ms deadline when its host never closes stdin.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Ownership | A core belongs here only when it has no real dependency on a specific skill's other content. If a future core develops one, move it back out. |
| Imports | Cores import Node builtins only, or shell out to an unmoved checker script by project-root-relative path. Adapters import their concern's own `lib/` (one level up) plus, where needed, the local `shared/hook-adapter-shared.cjs` (two levels up into `../../shared/`). No adapter under this tree imports anything outside it except the Jev `classifier-injection-screen` hook, which imports its gate, transport and measured question from `cli-classifier/shared/scripts/` and the benchmark scorer. |
| Runtime wiring | Each runtime's own config (`.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.codex/hooks.json`) points its command string directly at the real file here. The four runtime discovery mirrors (`.claude/hooks/`, `.cursor/hooks/`, `.devin/hooks/`, `.codex/hooks/`) hold a relative symlink to the same file, for browsability only. Pi, OpenCode and DSH are wired through their own plugin trees: `.pi/extensions/` (relative symlinks into this tree), `.opencode/plugins/` (real modules that `require` these cores) and `.dsh/plugins/repo-guards/` (the bundle's adapter links). |
| Tests | New tests go in the concern's own `tests/` folder, as sk-code's house rule asks, and the DSH adapter tests already live there. Older cores still keep a test file beside their code in `lib/`. |

---

## 5. VALIDATION

```bash
# node:test suites
node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .skilled/hooks/shared/hook-flags.test.cjs

# stdin deadline: every ESM adapter exits at the reader's deadline when stdin never closes
node --test .skilled/hooks/shared/hook-adapter-shared.test.cjs .skilled/hooks/shared/hook-stdin-deadline.test.mjs

# dispatch-audit is a vitest suite and cannot run under node --test
.skilled/node_modules/.bin/vitest run --root .skilled/hooks/dispatch/lib dispatch-audit.test.mjs

# The dispatch adapter suites are vitest files; the hooks config's alias resolves the Pi adapters' imports, written for the extension symlink base
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs .skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts .skilled/hooks/dispatch/pi/directive-dedup.test.ts
```

Expected result: all suites pass.

```bash
# DSH adapter tests in each concern's tests/ folder, the bundle's own tests and the DSH session sweep
node --test .skilled/hooks/*/tests/dsh-*.test.mjs .skilled/skills/system-skill-advisor/hooks/tests/dsh-*.test.mjs .dsh/plugins/repo-guards/tests/ .skilled/hooks/decision-capture/bin/sweep-dsh.test.mjs
```

Expected result: all suites pass.

```bash
pi --offline --approve -p "list your available tools" </dev/null
```

Expected result: exit 0, no extension-load error (confirms `.pi/extensions/*.ts`'s relocated import paths resolve).

```bash
node -e "import('./.opencode/plugins/mcp-route-guard.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, no module-resolution error (repeat for `sk-code-post-edit-quality.js`, `system-deep-loop-guard.js`, `cli-dispatch-audit.js`, `sk-git-preflight-advisory.js`).

```bash
grep -n COMMENT_CHECKER .skilled/scripts/git-hooks/pre-commit
```

Expected result: a `COMMENT_CHECKER=${SOURCE_ROOT}/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` line: confirms the primary pre-commit runs its own comment-hygiene gate and never calls this folder's `pre-commit` (see [`git/README.md`](./git/README.md)).

---

## 6. RELATED

- [`injection-contract.md`](./injection-contract.md): what every hook (including the ones that stayed in their skill) actually injects.
- Per-concern READMEs: [`dispatch/`](./dispatch/README.md), [`mcp-route-guard/`](./mcp-route-guard/README.md), [`overlay-guard/`](./overlay-guard/README.md), [`post-edit-quality/`](./post-edit-quality/README.md), [`classifier-injection-screen/`](./classifier-injection-screen/README.md), [`task-dispatch/`](./task-dispatch/README.md), [`shared/`](./shared/README.md).
- [`git/README.md`](./git/README.md): the git commit-hooks installer nested in this tree.
- [`../scripts/git-hooks/README.md`](../scripts/git-hooks/README.md): the primary git-hooks installer, whose `pre-commit` carries its own comment-hygiene gate.
- [`../../.claude/hooks/README.md`](../../.claude/hooks/README.md), [`../../.cursor/hooks/README.md`](../../.cursor/hooks/README.md), [`../../.devin/hooks/README.md`](../../.devin/hooks/README.md), [`../../.codex/hooks/README.md`](../../.codex/hooks/README.md): per-runtime discovery mirrors pointing back into this tree.
- [`../../.opencode/plugins/README.md`](../../.opencode/plugins/README.md): the OpenCode plugins that import these cores directly.
- [`../../.pi/extensions/README.md`](../../.pi/extensions/README.md): the Pi extensions that import these cores directly.
- [`../../.dsh/plugins/repo-guards/README.md`](../../.dsh/plugins/repo-guards/README.md): the DSH bundle whose adapter links point back into this tree.

---

## 7. COVERAGE MATRIX

This matrix is the coverage authority for the intentionally uneven runtime surface. A checkmark means a runtime adapter or plugin covers the concern. `by-design` means the behavior is inherent in another named owner rather than a separately indexed adapter. `n/a` means the runtime exposes no event capable of implementing that concern. `~ partial` means covered for the common case with a known, documented gap. `unverified` means an event may exist but its feasibility for this concern has not been confirmed live, and no adapter is wired.

For the *why* behind each absence, why a runtime has no adapter for a concern, see [`coverage-rationale.md`](./coverage-rationale.md).

| Concern | Claude | Codex | Cursor | Devin | OpenCode | Pi | DSH |
|---|---|---|---|---|---|---|---|
| `codex-watchdog` | by-design: OpenCode plugin audits Codex hook installation | by-design: OpenCode plugin audits Codex hook installation | by-design: OpenCode plugin audits Codex hook installation | by-design: OpenCode plugin audits Codex hook installation | ✓ covered | by-design: one `install-codex-hooks.mjs --check` at session start, no long-lived poll | by-design: one `install-codex-hooks.mjs --check` at session start, no long-lived poll |
| `ask-surface` | ✓ covered | ~ partial: advisory only, Codex Stop documents no block | n/a: Cursor has no question tool | ~ partial: advisory only, Devin Stop documents no block | ✓ covered | ✓ covered | ✓ covered |
| `completion` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `decision-capture` | ✓ covered | by-design: the save-time rollout sweep already reads every answer, so a live hook would add a mapping for a reminder only | unverified: no answered question tool call was found to probe | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `directive-lifecycle` | ✓ covered | by-design: embedded in the shared `user-prompt-submit` lifecycle | by-design: embedded in the shared `user-prompt-submit` lifecycle | by-design: embedded in the shared `user-prompt-submit` lifecycle | by-design: embedded in `system-skill-advisor` lifecycle state | by-design: embedded in `prompt-advisor.ts` directive de-dup | by-design: embedded in `prompt-advisor.mjs` directive de-dup |
| `dispatch` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `dist-freshness` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | by-design: runs `check-dist-staleness.sh --all` bundled into `session-start-advisories.ts` | by-design: runs `check-dist-staleness.sh --all` bundled into `session-start-advisories.mjs` |
| `git-message-gate` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `git-preflight` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `goal` | by-design: native host goal command, and the packet goal reaches it through the speckit workflows | by-design: native host goal command, as for Claude | ✓ covered (injection + packet read) | ✓ covered (injection only) | ✓ covered | ✓ covered | ✓ covered |
| `injection-screen` | ✓ covered | n/a: only web tool is the provider-hosted `web_search`, so no local hook ever sees a fetched page | n/a: the `Fetch` postToolUse payload carries only `url`, `status_code` and `content_length` | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `mcp-route-guard` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `overlay-guard` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | by-design: no adapter, and `/doctor:overlay status` reports an edit made there | ✓ covered | ✓ covered |
| `permission-policy` | by-design: permission via `PreToolUse` decision, no dedicated permission-request adapter | n/a: fires no permission event at all, so no approval hook exists | by-design: no dedicated permission-request adapter | ✓ covered | by-design: no dedicated permission-request adapter | by-design: no separate approval event beyond `tool_call` | by-design: `tools/pre-execute` already carries the spec-gate and dispatch decisions, and `approval/request` carries no tool arguments to judge |
| `post-edit-quality` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `session-lifecycle` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | by-design: session events run inside the concern plugins (`system-skill-advisor`, `opencode-goal`, `session-cleanup`) | ✓ covered | ✓ covered |
| `session-relaunch` | ✓ covered | ✓ covered | by-design: `/speckit:handoff` command trigger, no automatic hop because no usage signal is verified | by-design: `/speckit:handoff` command trigger, no automatic hop because no usage signal is verified | ✓ covered | ✓ covered | by-design: `/speckit:handoff` prompt trigger only, because `skilled-loop` launches no DSH session |
| `skill-advisor` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `spec-gate` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `task-dispatch` | ✓ covered | n/a: codex-cli 0.160 fires `PreToolUse` on `spawn_agent` (as `collaborationspawn_agent`), but a captured payload carries the spawn message encrypted, so no prompt or target reaches a hook | ✓ covered | ✓ covered | ✓ covered | ~ partial: intercepts direct `subagent` calls, but not yet workflow-nested (`runs.run`) dispatches | ~ partial: guards `subagent` and `subagent_fork` at `tools/pre-execute`, but only logs and never denies |

### Additional centralized hooks

Beyond the guard-core concerns above, the hub also indexes every remaining repo-authored hook so one directory shows them all. These are shared scripts, installers, and deployed entrypoints whose real code lives in `.skilled/bin/`, `.skilled/scripts/`, `.opencode/plugins/`, or a skill folder. The hub holds a relative symlink per runtime that has the hook.

| Concern | Runtimes | Real home |
|---|---|---|
| `git-worktree-guard` | claude, codex, cursor, devin + opencode plugin (pi and dsh run it inside `session-start-advisories`) | `.skilled/bin/worktree-guard.sh` |
| `git-hooks-check` | claude, codex, cursor, devin + opencode plugin (pi and dsh run it inside `session-start-advisories`) | `.skilled/bin/check-git-hooks.sh` |
| `git-primary-reconcile` | claude, codex, cursor, devin, pi, dsh + opencode plugin | `.skilled/bin/git-primary-reconcile.sh` |
| `live-sync` (`git-live-follow`) | claude, codex, cursor, devin, pi, dsh + opencode plugin | `.skilled/bin/git-live-follow.sh` |
| `session-cleanup` | claude, codex, cursor, devin + opencode plugin | `.skilled/scripts/session-cleanup.sh`, `.opencode/plugins/session-cleanup.js` |
| `hook-install` | claude, cursor, devin (Codex's user-global file is the cleanup target), plus pi and dsh through `session-start-advisories` | `.skilled/bin/install-codex-hooks.mjs` |
| `dist-freshness` (per-runtime `.sh`) | claude, codex, cursor, devin (pi and dsh run it inside `session-start-advisories`) | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` |

The `session-lifecycle/` and `skill-advisor/` subfolders of Claude, Codex, Cursor and Devin also carry the deployed `.js` entrypoint alongside its `.ts` source: a relative symlink into `system-spec-kit`'s built `dist/hooks/`, so the actually-executed file is browsable too. Those dist symlinks resolve after a build, exactly like the deployed `.<runtime>/hooks/*.js` symlinks the runtimes already use. Pi and DSH keep only their `.ts` or `.mjs` source in those folders, and `skill-advisor/opencode/` links the OpenCode plugin itself.

<!-- readme-check
allow-ref mcp-code-mode/runtime/ | a former location these hooks moved out of
allow-ref runtime-hooks/ | the sibling directory name the operator rejected in favour of one tree
allow-ref hooks/dsh/ | a folder name inside each owning skill, not a path from here; the same sentence names the full paths
-->
