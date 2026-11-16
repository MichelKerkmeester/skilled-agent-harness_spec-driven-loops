---
title: "Hooks: Fully-Portable Guard Cores"
description: "The AI-runtime lifecycle guard cores of the repo under one root, organized by concern."
trigger_phrases:
  - "hooks tree"
  - "runtime hooks"
  - "portable guard cores"
  - "hook relocation"
  - "dispatch preflight"
  - "mcp route guard"
  - "post edit quality"
  - "task dispatch guard"
---

# Hooks: Fully-Portable Guard Cores

> AI runtime lifecycle guard cores, organized by concern, live in this directory.

---

## 1. OVERVIEW

`.skilled/hooks/` is the single home for every hook concept in the repo. These concern folders hold AI-runtime lifecycle hooks as real code here. They are `ask-surface-guard/`, `cli-dispatch/`, `env-secret-guard/`, `mcp-route-guard/`, `overlay-guard/`, `post-edit-quality/`, `subagent-dispatch-guard/`, `classifier-injection-screen/`, `decision-capture/`, `goal/` and `session-handover/`. The `shared/` folder holds their shared helpers and session readers. The classifier reaches into `cli-classifier` for its Jev gate, transport and measured question.

A further AI-runtime concern, [`goal/`](./goal/README.md), is a cross-runtime sibling of the OpenCode `opencode-goal` plugin. It binds a session to a spec packet whose `goal.md` is the directive. It renders that file's durable slice with the frontmatter stripped, on every turn where that runtime injects at all. Those runtimes are OpenCode, Pi, Devin and DSH per turn, and Cursor and Vibe at session start. Vibe gets the slice again after a compaction.

It keeps only the pointer, liveness and telemetry per session. Pi, Cursor, Devin and DSH reach it through native session identity. OpenCode keeps using `opencode-goal` directly, which imports the same slice module.

See [`injection-contract.md`](./injection-contract.md) for what each AI-runtime hook here actually injects and its visibility to the human operator.

A session-handover concern, documented in [session-handover/](./session-handover/README.md), adds context nudges and runtime-specific arming for Claude, Pi, OpenCode, Codex and Vibe sessions started through skilled-loop. Cursor and Devin join the same loop on the `/speckit:handoff` command trigger only. DSH has no relaunch, because `skilled-loop` does not launch it. Inside skilled-loop the nudge asks for a hop, and outside it only for a note the session keeps through compaction.

The sourced `.skilled/bin/skilled-loop-shell.sh` shim starts every plain interactive runtime launch under a trusted wrapper, a symlinked `.skilled` included. Trusted means inside the sourced checkout, a linked worktree registered to it or a checkout in `SKILLED_LOOP_TRUSTED_CHECKOUTS`.

Each hop adds a line to a gitignored hop history, and `SESSION_HANDOVER_NOTIFY_HOPS` adds an opt-in macOS notice per hand-over. The concern ships on for Claude Code and off elsewhere. Set `SYSTEM_SESSION_HANDOVER_ENABLED=1` to turn it on for every runtime, or `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` to turn it on (`1`) or off (`0`) for one.

This tree is also the full browsable index of every repo-authored hook. A skill-owned hook whose logic is its skill's engine keeps its code in the owning skill. Each one is symlinked in here under `<concern>/<runtime>/`. The symlink is the index entry and the code stays local. One directory therefore shows every hook the repo installs, by concern and runtime.

Every concern except `git-message-gate` honors the master `SYSTEM_HOOKS_DISABLED` switch and its canonical `SYSTEM_<CONCERN>_DISABLED` switch. The message gate has none on purpose. The commit, PR and branch rules carry no bypass on any surface. The place to change them is the rules block in the sk-git templates.

The default is enabled, except `session-handover`, which ships on for Claude Code and off for every other runtime. The flag that decides is `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` when it holds a value. `<RUNTIME>` is `CLAUDE`, `CODEX`, `PI`, `OPENCODE`, `CURSOR`, `DEVIN` or `VIBE`. Next comes `SYSTEM_SESSION_HANDOVER_ENABLED` when it holds one. With both empty or unset, only Claude Code runs it.

So `SYSTEM_SESSION_HANDOVER_ENABLED=1` with `SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED=0` is on for every runtime except Claude Code. The disable switch and the master switch still win over every enable flag. Truthy disable values are `1`, `true`, `yes` and `on`, in any case. The kill-switch index below lists every concern and alias.

This table is the single source of truth for repo-authored hook kill-switch names, apart from the older `MK_*` spellings that `hook-flags.cjs` still honors. All concerns are wired to the shared resolver or its shell equivalent.

| Concern | Canonical flag (`SYSTEM_<CONCERN>_DISABLED`) | Legacy aliases | Default | Effect | Status |
|---|---|---|---|---|---|
| `skill-advisor` | `SYSTEM_SKILL_ADVISOR_DISABLED` | `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` | enabled | inject | wired |
| `spec-gate` | `SYSTEM_SPEC_GATE_DISABLED` | `SPECKIT_SPEC_GATE_DISABLED` | enabled | notice / deny | wired |
| `completion` | `SYSTEM_COMPLETION_DISABLED` | `SYSTEM_COMPLETION_SENTINEL_DISABLED`, `SYSTEM_SPECKIT_COMPLETION_DISABLED` | enabled | warn | wired |
| `decision-capture` | `SYSTEM_DECISION_CAPTURE_DISABLED` | none | enabled | queue (local, for the next save) | wired |
| `ask-surface` | `SYSTEM_ASK_SURFACE_DISABLED` | none | enabled | re-prompt (Claude, DSH, OpenCode, Pi, Vibe) / warn (Codex, Devin) | wired |
| `codex-watchdog` | `CODEX_HOOKS_WATCHDOG_DISABLED` | `CODEX_WATCHDOG_DISABLED` | enabled | warn | wired |
| `permission-policy` | `SYSTEM_PERMISSION_POLICY_DISABLED` | none | enabled | deny | wired |
| `directive-lifecycle` | `SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED` | none | enabled | inject cadence | wired |
| `dispatch` | `CLI_DISPATCH_AUDIT_DISABLED` | `SYSTEM_DISPATCH_DISABLED` (both concerns) | enabled | audit | wired |
| `dispatch-guard` | `SYSTEM_DISPATCH_GUARD_DISABLED` | `SYSTEM_DISPATCH_DISABLED` (both concerns) | enabled | deny (preflight) | wired |
| `post-edit-quality` | `SK_CODE_POST_EDIT_QUALITY_DISABLED` | none | enabled | warn | wired |
| `task-dispatch` | `SYSTEM_TASK_DISPATCH_DISABLED` | none | enabled | warn / deny | wired |
| `mcp-route-guard` | `MCP_ROUTE_GUARD_DISABLED` | none | enabled | warn / audit | wired |
| `overlay-guard` | `SYSTEM_OVERLAY_GUARD_DISABLED` | none | enabled | deny | wired |
| `env-secret-guard` | `SYSTEM_ENV_SECRET_GUARD_DISABLED` | none | enabled | deny | wired |
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
| `session-handover` | `SYSTEM_SESSION_HANDOVER_DISABLED` | `SYSTEM_IN_SESSION_HANDOVER_DISABLED`, and the same second spelling of each enable switch, read only while the main switch is unset or blank | on for Claude Code and off elsewhere, set with `SYSTEM_SESSION_HANDOVER_ENABLED`, per runtime with `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` | inject / arm | wired |

The switch name follows the key, not the folder.

| Concern key | Folder |
|---|---|
| `dispatch` | `cli-dispatch/` |
| `dispatch-guard` | `cli-dispatch/` |
| `task-dispatch` | `subagent-dispatch-guard/` |
| `completion` | `completion-evidence/` |
| `codex-watchdog` | `codex-global-hooks-check/` |
| `hook-install` | `codex-global-hooks-check/` |
| `ask-surface` | `ask-surface-guard/` |
| `injection-screen` | `classifier-injection-screen/` |
| `live-sync` | `git-live-follow/`, `git-primary-reconcile/` |
| `live-follow` | `git-live-follow/` |
| `primary-reconcile` | `git-primary-reconcile/` |

`SYSTEM_SPEC_GATE_ENFORCE` is a separate opt-in control for spec-gate denial, not a kill-switch. The process environment sets it, so `hook-flags.env` cannot. `SPECKIT_DIST_AUTO_REBUILD` controls whether a stale dist is rebuilt. It does not disable the freshness check. The `git-commit-hooks` switch is an emergency off switch for the pre-commit chain. With the switch unset, mass-deletion and comment-hygiene checks remain active.

Flags resolve from two places: the live environment and an optional config file. The environment always wins, so a persisted default can still be overridden for one session.

- **Environment**: set any flag inline (`SYSTEM_SKILL_ADVISOR_DISABLED=1 <command>`), for a session (`export SYSTEM_SPEC_GATE_DISABLED=1`), or in your shell profile.
- **Config file**: copy `hook-flags.env.example` to `hook-flags.env` (in this directory) and uncomment the flags you want off. It uses the same `KEY=value` names, is gitignored (personal to you), and is read by every guard variant. A comment can follow a value after a space or tab, so the example's lines work as soon as you uncomment them. Re-enable a file-disabled hook for one session with e.g. `SYSTEM_SKILL_ADVISOR_DISABLED=0`. `/doctor:env` shows where each switch is set and writes one here after your yes, and the root `.env.example` lists every other setting with its default.

```bash
cp .skilled/hooks/hook-flags.env.example .skilled/hooks/hook-flags.env
# then edit hook-flags.env and uncomment what you want disabled
```

The same file holds two switches that are not hook concerns. They are for people who do not care whether their docs drift from the expected formats. `SPECKIT_SKIP_VALIDATION` switches spec folder validation (`validate.sh`) off. `SKDOC_SKIP_VALIDATION` switches off every sk-doc validator. Both follow the precedence above and take the same truthy values.

`hook_flag_on` in the shell mirror and `isFlagOn` in `hook-flags.cjs` resolve a named switch like these. [ENV-REFERENCE.md](../skills/system-spec-kit/runtime/ENV-REFERENCE.md) and sk-doc's [validation-and-enforcement.md](../skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md) say what each one covers.

---

## 2. CORE PLACEMENT

A core keeps its real code in this tree only when it imports nothing but Node builtins and files inside this tree. It may also shell out to an unrelated checker script by path. It must have no real tie to its owning skill's other content. Each core below meets those terms.

| Concern | Core dependencies | Verdict |
|---|---|---|
| `dispatch` | Node builtins only | Portable |
| `mcp-route-guard` | Node builtins only | Portable |
| `overlay-guard` | Node builtins, plus the overlay engine loaded only when the tree has an overlay folder | Portable |
| `post-edit-quality` | Node builtins + `spawnSync` to unmoved checker scripts (invoked by path, never imported) | Portable |
| `task-dispatch` | Node builtins only | Portable |
| `ask-surface` | Node builtins only (`node:crypto`, `node:fs`, `node:os`, `node:path`) | Portable |
| `env-secret-guard` | Node builtins only (`node:crypto`, `node:fs`, `node:path`) | Portable |

The Jev [`classifier-injection-screen/`](./classifier-injection-screen/README.md) hook is the deliberate exception to that rule. It lives here for hook registration. Its adapter and library import the gate, transport and measured question from `cli-classifier`. The live hook and the offline measurement therefore cannot drift apart.

A portable core has no real dependency on the skill that owns its concern. Those skills keep their own trees at `cli-external-orchestration/cli-opencode/scripts/`, `sk-code/sk-code-quality/scripts/` and `system-deep-loop/runtime/lib/deep-loop/`. A user can therefore adopt or remove the enforcement layer without the skill's knowledge and reference content.

Other hooks keep their code inside their owning skill, because their core logic is that skill's engine. They are `spec-gate-*`, the session-lifecycle hooks and `completion-evidence-stop` in `system-spec-kit`. The skill-advisor brief lives in `system-skill-advisor`. `git-preflight-advisory` lives in `sk-git`, which depends on its own `git-context.mjs` and `git-rule-checks.mjs` rule engine. Each one has an index link under `<concern>/<runtime>/` here and honors the `isHookEnabled` kill-switch.

`hook-adapter-shared.cjs` is a tiny stdin-parsing helper with no dependencies of its own. A local copy sits at `shared/hook-adapter-shared.cjs`. A second, independent ESM sibling lives at `system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs`. That copy serves that skill's `spec-gate-enforce.mjs` and `spec-gate-classify.mjs` adapters for `claude`, `codex`, `cursor` and `devin`, plus `spec-gate/cursor/spec-gate-prebind.mjs`.

Those adapters are not part of the portable set. The `dsh` adapter takes its payload from the DSH runtime and does not import it. The two copies may drift, though this file is small and stable enough that they should not.

---

## 3. DIRECTORY TREE

```text
hooks/
+-- coverage-rationale.md            # why each runtime lacks a concern
+-- injection-contract.md            # what each hook injects and who sees it
+-- hook-flags.env.example           # the switch file template
+-- vitest.config.ts                 # the hooks vitest config and its long-specifier alias
+-- shared/
|   +-- hook-adapter-shared.cjs      # stdin collection + fail-open JSON parse, used by the CommonJS and ESM adapters below
|   +-- hook-flags.cjs, hook-flags.mjs, hook-flags.sh   # the switch resolver in CommonJS, ESM and shell
|   +-- env-aliases.cjs              # copies a legacy env name forward onto its new name
|   +-- session-reader-declarations.mjs   # regenerates or checks the .d.mts declarations beside the session readers
|   +-- session-readers/             # read-only per-runtime session readers (Claude, Codex, Pi, OpenCode, Devin, DSH and Vibe ready, Cursor gated)
|   +-- tests/    dsh-llm.test.mjs, dsh-plugin-harness.mjs, session-readers/
|   `-- dsh/      dsh-llm.mjs (harness package loader), session-role.mjs (fan-out leaf marker)
+-- cli-dispatch/                    # cli-opencode dispatch-shape hard-rule + audit hooks
|   +-- lib/
|   |   +-- dispatch-rule-checks.mjs
|   |   +-- dispatch-rule-checks.test.mjs
|   |   +-- dispatch-audit.mjs
|   |   `-- dispatch-audit.test.mjs
|   +-- claude/   dispatch-preflight-lint.mjs, dispatch-audit-posttooluse.mjs
|   +-- devin/    (same pair)
|   +-- codex/    (same pair)
|   +-- cursor/   dispatch-preflight-lint.mjs, post-tool-use.mjs (indexed proxy: Shell calls chain to the Claude audit)
|   +-- pi/       dispatch-preflight-lint.ts, dispatch-audit.ts (real file; `.pi/extensions/` re-exports them)
|   +-- dsh/      dispatch-preflight-lint.mjs, dispatch-audit.mjs (real file; `.dsh/plugins/repo-guards/adapters/` symlinks to it)
|   +-- opencode/ cli-dispatch-audit.js (browsability symlink -> .opencode/plugins/)
|   +-- tests/    dsh-dispatch.test.mjs
|   `-- vibe/     dispatch-preflight.mjs (browsability symlink -> .vibe/plugins/repo-guards/)
+-- decision-capture/                # operator answers queued per project for the next full-auto save
|   +-- lib/capture-core.mjs, chat-questions.mjs (the chat-candidate detector every sweep shares), their tests
|   +-- claude/   decision-capture-posttooluse.mjs (PostToolUse on AskUserQuestion), fixtures/
|   +-- devin/    decision-capture-posttooluse.mjs (PostToolUse on ask_user_question), its test, fixtures/
|   +-- pi/       decision-capture.ts (tool_result on ask_user_question and question; `.pi/extensions/` re-exports it), its test
|   +-- dsh/      decision-capture.mjs (tools/result on ask_user_question plus a late timed reply; the DSH adapters folder symlinks to it)
|   +-- opencode/ decision-capture.js (browsability symlink -> .opencode/plugins/)
|   +-- vibe/     decision-capture-post-tool.mjs (post_tool), its test
|   +-- bin/      sweep-transcript.mjs (Claude), sweep-opencode.mjs, sweep-devin.mjs, sweep-codex.mjs, sweep-pi.mjs, sweep-dsh.mjs, sweep-vibe.mjs, their tests, fixtures/
|   `-- tests/    dsh-decision-capture.test.mjs
+-- env-secret-guard/                # refuse a read or write of a dotenv file; value-free key list, validation and fingerprint
|   +-- lib/env-secret-guard.cjs, env-secret-watch.cjs (after-call write check and output scan), and their tests
|   +-- command-hook/ env-secret-guard.cjs (one adapter for Claude, Codex, Cursor and Devin; each runtime links to it), env-secret-guard-after.cjs (its after-call entry)
|   +-- cli/      env-secret.cjs (keys, validate, fingerprint for any shell)
|   +-- pi/       env-secret-guard.ts (real file; `.pi/extensions/` re-exports it)
|   +-- dsh/      env-secret-guard.mjs (real file; the DSH adapters folder symlinks to it)
|   +-- opencode/ env-secret-guard.js (browsability symlink -> .opencode/plugins/)
|   +-- vibe/     env-secret-guard.mjs (browsability symlink -> .vibe/plugins/repo-guards/)
|   `-- tests/    dsh-env-secret-guard.test.mjs
+-- mcp-route-guard/                 # native mcp_* call -> Code Mode routing advisory
|   +-- lib/mcp-route-guard.cjs, mcp-route-guard.test.cjs
|   +-- claude/, devin/, codex/      mcp-route-guard.cjs
|   +-- cursor/   mcp-route-guard.mjs
|   +-- pi/       mcp-route-guard.ts (real file; `.pi/extensions/` re-exports it)
|   +-- dsh/      mcp-route-guard.mjs (real file; the DSH adapters folder symlinks to it)
|   +-- opencode/ mcp-route-guard.js (browsability symlink -> .opencode/plugins/)
|   +-- tests/    dsh-mcp-route-guard.test.mjs
|   `-- vibe/     mcp-route-guard.mjs (browsability symlink -> .vibe/plugins/repo-guards/)
+-- overlay-guard/                   # refuse an edit to a file a vendored copy's overlay owns
|   +-- lib/overlay-guard.cjs, overlay-guard.test.cjs
|   +-- claude/, devin/, codex/      overlay-guard.cjs
|   +-- cursor/   overlay-guard.mjs
|   +-- pi/       overlay-guard.ts (real file; `.pi/extensions/` re-exports it)
|   +-- dsh/      overlay-guard.mjs (real file; the DSH adapters folder symlinks to it)
|   +-- opencode/ overlay-guard.js (browsability symlink -> .opencode/plugins/)
|   +-- tests/    dsh-overlay-guard.test.mjs, opencode-overlay-guard.test.mjs
|   `-- vibe/     overlay-guard.mjs (browsability symlink -> .vibe/plugins/repo-guards/)
+-- post-edit-quality/               # comment-hygiene + dist-staleness findings on edit/write
|   +-- lib/post-edit-router.cjs
|   +-- claude/   post-edit-quality.cjs
|   +-- devin/    post-edit-quality.cjs
|   +-- codex/    post-edit-quality.cjs
|   +-- cursor/   post-tool-use.mjs (indexed proxy: Write chains to the Claude check; same file as cli-dispatch/cursor/)
|   +-- pi/       post-edit-quality.ts (real file; `.pi/extensions/` re-exports it)
|   +-- dsh/      post-edit-quality.mjs (real file; the DSH adapters folder symlinks to it)
|   +-- opencode/ sk-code-post-edit-quality.js (browsability symlink -> .opencode/plugins/)
|   +-- tests/    codex-post-edit-quality.test.cjs, devin-post-edit-quality.test.cjs, dsh-post-edit-quality.test.mjs, post-edit-router.test.cjs
|   `-- vibe/     post-edit-quality.mjs (browsability symlink -> .vibe/plugins/repo-guards/)
+-- ask-surface-guard/                          # Sends a turn ending in a prose option menu back to the question tool
|   +-- lib/      ask-surface-core.cjs (detector, verdict, per-turn marker), advisory-stop.cjs (+ tests)
|   +-- fixtures/ the verdict fixtures the detector test reads
|   +-- claude/   ask-surface-stop.cjs (+ test; synchronous Stop, blocks once)
|   +-- codex/    ask-surface-stop.cjs (advisory)
|   +-- devin/    ask-surface-stop.cjs (advisory)
|   +-- pi/       ask-surface-guard.ts (+ test; `.pi/extensions/` re-exports it)
|   +-- dsh/      ask-surface-guard.mjs (+ test; the DSH adapters folder symlinks to it)
|   +-- opencode/ ask-surface-guard.js (browsability symlink -> .opencode/plugins/)
|   +-- vibe/     ask-surface-post-agent.mjs (post_agent)
|   `-- tests/    dsh-ask-surface-guard.test.mjs
+-- classifier-injection-screen/                # Jev screen of fetched web text for instructions aimed at an agent
|   +-- lib/  classifier-injection-advisory.mjs, classifier-screen-fetched-text.mjs
|   |           (+ a co-located test per module)
|   +-- claude/   classifier-injection-screen-posttooluse.mjs (+ test)
|   +-- devin/    classifier-injection-screen-posttooluse.mjs (+ test)
|   +-- opencode/ classifier-injection-screen.js (browsability symlink -> .opencode/plugins/)
|   +-- pi/       classifier-injection-screen.ts (+ test; `.pi/extensions/` re-exports it)
|   +-- dsh/      classifier-injection-screen.mjs (real file; the DSH adapters folder symlinks to it)
|   +-- tests/    dsh-classifier-injection-screen.test.mjs
|   `-- vibe/     classifier-injection-screen.mjs (browsability symlink -> .vibe/plugins/repo-guards/)
+-- subagent-dispatch-guard/         # Task/subagent dispatch guard + Fable-subagent policy
|   +-- lib/subagent-dispatch-guard.cjs
|   +-- claude/   task-dispatch-guard.cjs, fable-subagent-guard.mjs
|   +-- devin/    task-dispatch-guard.cjs
|   +-- cursor/   task-dispatch-guard.mjs
|   +-- pi/       task-dispatch-guard.ts (real file; `.pi/extensions/` re-exports it)
|   +-- dsh/      task-dispatch-guard.mjs (real file; the DSH adapters folder symlinks to it)
|   +-- opencode/ system-deep-loop-guard.js (browsability symlink -> .opencode/plugins/)
|   +-- tests/    dsh-task-dispatch-guard.test.mjs
|   `-- vibe/     deep-loop-guard.mjs (browsability symlink -> .vibe/plugins/repo-guards/)
+-- session-lifecycle/              # skill-owned session-start adapters, plus the real Vibe adapters here
|   `-- vibe/     session-start.mjs, turn-start.mjs, turn-end.mjs, compaction-context.mjs, compaction-post-tool.mjs, their tests, fixtures/
+-- session-handover/              # Claude, Pi, OpenCode, Codex and Vibe context nudge and relaunch adapters
|   +-- bin/session-handover.cjs, history-lookup.mjs
|   +-- claude/handover-compact-pointer.mjs, handover-context-nudge.mjs, handover-stop-arm.mjs, handover-subagent-guard.mjs
|   +-- codex/handover-compact-pointer.mjs, handover-context-nudge.mjs, handover-prompt-seed.mjs, shared.mjs, handover-stop-arm.mjs
|   +-- pi/session-handover.ts, session-handover.test.ts
|   +-- opencode/session-handover.js (browsability symlink -> .opencode/plugins/session-handover.js)
|   +-- vibe/handover-parts.mjs
|   +-- lib/context-usage.cjs, nudge.cjs, relaunch-core.cjs, killer.cjs, goal-handover.cjs, hop-history.cjs, withdraw.cjs
|   `-- tests/ nineteen Node test files plus payload fixtures
`-- goal/                            # cross-runtime passive session-goal tracking (sibling of opencode-goal)
    +-- goal-plugin.md               # the OpenCode plugin contract
    +-- lib/goal-core.cjs, goal-core.test.cjs
    +-- lib/goal-slice.cjs, goal-slice.test.cjs   # packet goal.md projections shared with the OpenCode plugin
    +-- bin/goal.cjs                 # scoped management (bind, resent, log, packet), diagnostics, legacy quarantine
    +-- cursor/   goal-inject.mjs
    +-- devin/    goal-inject.mjs
    +-- pi/       goal-context.ts (real file; `.pi/extensions/` re-exports it)
    +-- dsh/      goal-context.mjs, goal-manage.mjs (real files; the DSH adapters folder symlinks to them)
    +-- vibe/     goal-inject.mjs, goal-vibe.test.mjs
    +-- tests/    dsh-goal.test.mjs
    `-- opencode/ opencode-goal.js (browsability symlink -> .opencode/plugins/)
```

The tree above shows only the concerns whose real code lives in this hub. Every skill-owned concern is also present as per-runtime symlinks under `<concern>/<runtime>/`, with the real code in the owning skill. `session-lifecycle/` is one of those for Claude, Codex, Cursor, Devin, Pi and DSH, but its `vibe/` folder holds real adapters here.

Most link-only folders point into a skill: `completion-evidence/`, `directive-lifecycle/`, `dist-freshness/`, `git-message-gate/`, `git-preflight/`, `permission-policy/`, `session-lifecycle/`, `skill-advisor/` and `spec-gate/`. `codex-global-hooks-check/`, `git-hooks-check/`, `git-live-follow/`, `git-primary-reconcile/` and `git-worktree-guard/` point into `.skilled/bin/`. `session-cleanup/` points into `.skilled/scripts/`. Most folders also hold an `opencode/` link into `.opencode/plugins/`.

Vibe's guard scripts take the OpenCode direction too. `.vibe/hooks.toml` runs each one from `.vibe/plugins/repo-guards/`. So a concern's `vibe/` folder holds a relative symlink back to it, beside any real Vibe adapter that lives here. Among the skill-owned concerns, `spec-gate/vibe/`, `dist-freshness/vibe/`, `git-message-gate/vibe/` and `session-cleanup/vibe/` hold those links.

The bin-backed concerns follow the same pattern. `git-live-follow/` and `git-primary-reconcile/` hold one symlink per runtime into `.skilled/bin/`, and the additional-hooks table below indexes them. `codex-global-hooks-check/` holds three links into `.skilled/bin/` and one into `.opencode/plugins/`. DSH's skill-owned adapters follow it too. `skill-advisor/dsh/`, `spec-gate/dsh/`, `session-lifecycle/dsh/`, `completion-evidence/dsh/`, `git-preflight/dsh/` and `git-message-gate/dsh/` hold index links to the real files in `system-skill-advisor/hooks/dsh/`, `system-spec-kit/runtime/hooks/dsh/` and `sk-git/scripts/hooks/dsh/`.

Pi's portable adapters live here too, in per-concern `pi/` subfolders. They are `ask-surface-guard/pi/`, `cli-dispatch/pi/`, `env-secret-guard/pi/`, `mcp-route-guard/pi/`, `overlay-guard/pi/`, `post-edit-quality/pi/`, `subagent-dispatch-guard/pi/`, `classifier-injection-screen/pi/`, `decision-capture/pi/`, `goal/pi/` and `session-handover/pi/`. Pi auto-discovers `.pi/extensions/`, whose one-line entry files re-export these adapters. Each adapter therefore loads from its own folder, and the imports Pi resolves are relative to that folder. A few adapters also carry a long specifier that does not resolve from the adapter's folder, so under Pi that specifier never loads.

OpenCode (`.opencode/plugins/*.js`) is the runtime whose adapter files cannot live here. Its plugins are real modules in a fixed folder that its loader scans. For browsability, each concern's `opencode/` subfolder holds a relative symlink back into `.opencode/plugins/`. That is the reverse of Pi's direction.

Nothing loads through the OpenCode symlink, because the loader globs only `.opencode/plugins/` and not the tree. It is a documentation mirror, so the tree shows OpenCode beside the other runtimes. Cursor's multiplexed `post-tool-use.mjs` proxy is indexed under both `cli-dispatch/cursor/` and `post-edit-quality/cursor/`, because one live adapter serves both concerns.

DSH follows Pi's layout. Each real adapter lives in a per-concern `dsh/` subfolder, or in its owning skill's `hooks/dsh/` folder with an index link here. `.dsh/plugins/repo-guards/adapters/` holds one relative link per adapter, aimed at the real file. The bundle entry `.dsh/plugins/repo-guards/index.mjs`, which the guards patch loads, imports every adapter through those links.

Node is not Pi's loader. It resolves a link to its real path before it resolves the adapter's own imports. Each DSH adapter's imports are therefore written for its real folder. The adapters that find the checkout from their own file count up from there. Those are `dispatch-audit`, `dispatch-preflight-lint`, `git-preflight-advisory`, `mcp-route-guard` and `session-start-advisories`.

`sync-runtime-mirrors.cjs --check`, which `/doctor:runtime-mirrors` runs, derives one expected link per `.mjs` file in a `dsh/` folder here. It reports a missing link, a stale one or a real file in its place.

---

## 4. KEY FILES

| Concern | Real adapters here | Stays in `.opencode/plugins/` (mirrored at `opencode/` via browsability symlink) |
|---|---|---|
| `dispatch` | claude, devin, codex, cursor (indexed proxy), pi (re-exported from `.pi/extensions/`), dsh (symlinked from `.dsh/plugins/repo-guards/adapters/`) | `cli-dispatch-audit.js` |
| `mcp-route-guard` | claude, cursor, devin, codex, pi (re-exported), dsh (symlinked) | `mcp-route-guard.js` |
| `overlay-guard` | claude, cursor, devin, codex, pi (re-exported), dsh (symlinked) | `overlay-guard.js` |
| `env-secret-guard` | claude, codex, cursor and devin through one `command-hook/` adapter, pi (re-exported), dsh (symlinked) | `env-secret-guard.js` |
| `post-edit-quality` | claude, devin, codex, cursor (indexed proxy), pi (re-exported), dsh (symlinked) | `sk-code-post-edit-quality.js` |
| `injection-screen` | claude, devin, pi (re-exported from `.pi/extensions/`), dsh (symlinked from `.dsh/plugins/repo-guards/adapters/`) | `classifier-injection-screen.js` |
| `task-dispatch` | claude, cursor, devin, pi (re-exported), dsh (symlinked) | `system-deep-loop-guard.js` |
| `goal` | cursor, devin, pi (re-exported), dsh (`goal-context.mjs` and `goal-manage.mjs`, symlinked), plus `lib/` core and slice module + `bin/` manage CLI | `opencode-goal.js` |
| `ask-surface` | claude (blocking Stop), codex and devin (advisory Stop), pi (re-exported from `.pi/extensions/`), dsh (symlinked from `.dsh/plugins/repo-guards/adapters/`), vibe (`post_agent`, loaded by `session-lifecycle/vibe/turn-end.mjs`), plus the `lib/` detector and its fixtures | `ask-surface-guard.js` |
| `decision-capture` | claude and devin (PostToolUse), vibe (`post_tool` on `ask_user_question`), pi (re-exported from `.pi/extensions/`), dsh (symlinked from `.dsh/plugins/repo-guards/adapters/`), plus save-time sweeps in `bin/` that read the Claude, Devin, Pi and DSH sessions, Codex rollouts and OpenCode's SQLite store | `decision-capture.js` |
| session-handover | Claude: context-nudge on PostToolUse / UserPromptSubmit, stop-arm on Stop, compact-pointer on SessionStart after a compaction, and subagent-guard on PreToolUse (Bash and AskUserQuestion), which denies relaunch lifecycle commands run from a sub-agent and a question dialog over a pending hand-over. Pi: `message_end` / `before_agent_start` / `agent_end`. Codex: `handover-prompt-seed.mjs` on UserPromptSubmit, `handover-context-nudge.mjs` on PostToolUse, `handover-stop-arm.mjs` on Stop. Cursor, Devin and DSH run the `/speckit:handoff` command trigger only | `session-handover.js` (real OpenCode adapter) |

`sk-git-preflight-advisory.js` and `cli-dispatch-audit.js` are OpenCode plugins owned by `sk-git` and `cli-opencode`. Both also import `cli-dispatch/lib/dispatch-rule-checks.mjs` and `cli-dispatch/lib/dispatch-audit.mjs` from here.

`shared/hook-adapter-shared.cjs` is the stdin reader for the adapters that parse a raw JSON payload. The CommonJS adapters `require` it. They are `ask-surface-guard/{claude,lib}`, `env-secret-guard/command-hook`, `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs`, `subagent-dispatch-guard/{claude,devin}/task-dispatch-guard.cjs`, `post-edit-quality/{claude,codex,devin}` and `overlay-guard/{claude,codex,devin}/overlay-guard.cjs`. The ESM adapters import `readStdin` from it by name. They are `classifier-injection-screen/{claude,devin}`, `decision-capture/{claude,devin}`, `decision-capture/vibe`, `cli-dispatch/{claude,codex,cursor,devin}` (preflight), `cli-dispatch/{claude,codex,devin}` (audit), `goal/{cursor,devin}`, `mcp-route-guard/cursor`, `overlay-guard/cursor`, `session-handover/{claude,codex}` and `subagent-dispatch-guard/{cursor,claude}`. Every one gives up at a 3000 ms deadline when its host never closes stdin.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Ownership | A core belongs here only when it has no real dependency on a specific skill's other content. If a future core develops one, move it back out. |
| Imports | Cores import Node builtins and files inside this tree only, or shell out to an unmoved checker script by project-root-relative path. Adapters import their concern's own `lib/` (one level up) plus, where needed, the local `shared/hook-adapter-shared.cjs` (two levels up into `../../shared/`). No adapter under this tree imports anything outside it except the Jev `classifier-injection-screen` hook, which imports its gate, transport and measured question from `cli-classifier/shared/scripts/` and the benchmark scorer. |
| Runtime wiring | Each runtime's own config (`.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.codex/hooks.json`) points its command string directly at the real file here. The four runtime discovery mirrors (`.claude/hooks/`, `.cursor/hooks/`, `.devin/hooks/`, `.codex/hooks/`) hold a relative symlink to the same file, for browsability only. Pi, OpenCode and DSH are wired through their own plugin trees: `.pi/extensions/` (one-line entry files that re-export into this tree), `.opencode/plugins/` (real modules that `require` these cores) and `.dsh/plugins/repo-guards/` (the bundle's adapter links). Vibe is wired through `.vibe/hooks.toml`, whose entries run the scripts in `.vibe/plugins/repo-guards/` and the adapters under `<concern>/vibe/` here. |
| Tests | New tests go in the concern's own `tests/` folder, as sk-code's house rule asks, and the DSH adapter tests already live there. Some cores keep a test file beside their code in `lib/`. |

---

## 6. VALIDATION

```bash
# node:test suites
node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .skilled/hooks/shared/hook-flags.test.cjs

# stdin deadline: every ESM adapter exits at the reader's deadline when stdin never closes
node --test .skilled/hooks/shared/hook-adapter-shared.test.cjs .skilled/hooks/shared/hook-stdin-deadline.test.mjs

# dispatch-audit is a vitest suite and cannot run under node --test
.skilled/node_modules/.bin/vitest run --root .skilled/hooks/cli-dispatch/lib dispatch-audit.test.mjs

# The dispatch adapter suites are vitest files. The hooks config's alias serves the literal long specifiers a few Pi adapters keep. They resolve only through the test alias
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/codex/codex-shell-tool.test.mjs .skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.test.ts .skilled/hooks/cli-dispatch/pi/directive-dedup.test.ts
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

Expected result: exit 0, no extension-load error (confirms the import paths in `.pi/extensions/*.ts` resolve).

```bash
node -e "import('./.opencode/plugins/mcp-route-guard.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, no module-resolution error (repeat for `sk-code-post-edit-quality.js`, `system-deep-loop-guard.js`, `cli-dispatch-audit.js`, `sk-git-preflight-advisory.js`).

```bash
grep -n COMMENT_CHECKER .skilled/scripts/git-hooks/pre-commit
```

Expected result: a `COMMENT_CHECKER=${SOURCE_ROOT}/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` line: confirms the primary pre-commit runs its own comment-hygiene gate.

---

## 7. COVERAGE MATRIX

This matrix is the coverage authority for the intentionally uneven runtime surface. A checkmark means a runtime adapter or plugin covers the concern. `by-design` means the behavior is inherent in another named owner rather than a separately indexed adapter.

`n/a` means the runtime exposes no event capable of implementing that concern. `~ partial` means covered for the common case with a known, documented gap. `unverified` means an event may exist but its feasibility for this concern has not been confirmed live, and no adapter is wired.

For the why behind each absence, see [`coverage-rationale.md`](./coverage-rationale.md).

| Concern | Claude | Codex | Cursor | Devin | OpenCode | Pi | DSH | Vibe |
|---|---|---|---|---|---|---|---|---|
| `codex-watchdog` | by-design: OpenCode plugin audits Codex hook installation | by-design: OpenCode plugin audits Codex hook installation | by-design: OpenCode plugin audits Codex hook installation | by-design: OpenCode plugin audits Codex hook installation | ✓ covered | by-design: one `install-codex-hooks.mjs --check` at session start, no long-lived poll | by-design: one `install-codex-hooks.mjs --check` at session start, no long-lived poll | by-design: Vibe reads no `~/.codex/hooks.json` |
| `ask-surface` | ✓ covered | ~ partial: advisory only, Codex Stop documents no block | n/a: Cursor has no question tool | ~ partial: advisory only, Devin Stop documents no block | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `completion` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `decision-capture` | ✓ covered | by-design: the save-time rollout sweep already reads every answer, so a live hook would add a mapping for a reminder only | unverified: no answered question tool call was found to probe | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `directive-lifecycle` | ✓ covered | by-design: embedded in the shared `user-prompt-submit` lifecycle | by-design: embedded in the shared `user-prompt-submit` lifecycle | by-design: embedded in the shared `user-prompt-submit` lifecycle | by-design: embedded in `system-skill-advisor` lifecycle state | by-design: embedded in `prompt-advisor.ts` directive de-dup | by-design: embedded in `prompt-advisor.mjs` directive de-dup | by-design: embedded in the Vibe turn-start advisor part |
| `dispatch` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `dist-freshness` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | by-design: runs `check-dist-staleness.sh --all` bundled into `session-start-advisories.ts` | by-design: runs `check-dist-staleness.sh --all` bundled into `session-start-advisories.mjs` | ✓ covered |
| `git-message-gate` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `git-preflight` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | by-design: the rules stay in sk-git's skill docs, as the plugin classification records |
| `env-secret-guard` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `goal` | by-design: native host goal command, and the packet goal reaches it through the speckit workflows | by-design: native host goal command, as for Claude | ✓ covered (injection + packet read) | ✓ covered (injection only) | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `injection-screen` | ✓ covered | n/a: only web tool is the provider-hosted `web_search`, so no local hook ever sees a fetched page | n/a: the `Fetch` postToolUse payload carries only `url`, `status_code` and `content_length` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `mcp-route-guard` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `overlay-guard` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `permission-policy` | by-design: permission via `PreToolUse` decision, no dedicated permission-request adapter | n/a: fires no permission event at all, so no approval hook exists | by-design: no dedicated permission-request adapter | ✓ covered | by-design: no dedicated permission-request adapter | by-design: no separate approval event beyond `tool_call` | by-design: `tools/pre-execute` already carries the spec-gate and dispatch decisions, and `approval/request` carries no tool arguments to judge | by-design: the dispatch runs `--auto-approve` behind the strict rendered guards |
| `post-edit-quality` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `session-lifecycle` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | by-design: session events run inside the concern plugins (`system-skill-advisor`, `opencode-goal`, `session-cleanup`) | ✓ covered | ✓ covered | ✓ covered |
| `session-handover` | ✓ covered | ✓ covered | by-design: `/speckit:handoff` command trigger, no automatic hop because no usage signal is verified | by-design: `/speckit:handoff` command trigger, no automatic hop because no usage signal is verified | ✓ covered | ✓ covered | by-design: `/speckit:handoff` prompt trigger only, because `skilled-loop` launches no DSH session | ✓ covered |
| `skill-advisor` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `spec-gate` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `task-dispatch` | ✓ covered | n/a: codex-cli 0.160 fires `PreToolUse` on `spawn_agent` (as `collaborationspawn_agent`), but a captured payload carries the spawn message encrypted, so no prompt or target reaches a hook | ✓ covered | ✓ covered | ✓ covered | ~ partial: intercepts direct `subagent` calls, but not yet workflow-nested (`runs.run`) dispatches | ~ partial: guards `subagent` and `subagent_fork` at `tools/pre-execute`, but only logs and never denies | ✓ covered |

Beyond the guard-core concerns above, the hub also indexes every remaining repo-authored hook. One directory then shows them all. These are shared scripts, installers and deployed entrypoints. Their real code lives in `.skilled/bin/`, `.skilled/scripts/`, `.opencode/plugins/` or a skill folder. The hub holds a relative symlink per runtime that has the hook, except OpenCode for `git-worktree-guard`, `git-hooks-check`, `git-live-follow` and `git-primary-reconcile`, which `.opencode/plugins/session-cleanup.js` runs.

| Concern | Runtimes | Real home |
|---|---|---|
| `git-worktree-guard` | claude, codex, cursor, devin + opencode plugin (pi and dsh run it inside `session-start-advisories`) | `.skilled/bin/worktree-guard.sh` |
| `git-hooks-check` | claude, codex, cursor, devin + opencode plugin (pi and dsh run it inside `session-start-advisories`) | `.skilled/bin/check-git-hooks.sh` |
| `git-primary-reconcile` | claude, codex, cursor, devin, pi, dsh + opencode plugin | `.skilled/bin/git-primary-reconcile.sh` |
| `live-sync` (`git-live-follow`) | claude, codex, cursor, devin, pi, dsh + opencode plugin | `.skilled/bin/git-live-follow.sh` |
| `session-cleanup` | claude, codex, cursor, devin + opencode plugin | `.skilled/scripts/session-cleanup.sh`, `.opencode/plugins/session-cleanup.js` |
| `hook-install` | claude, cursor, devin (Codex's user-global file is the cleanup target), plus pi and dsh through `session-start-advisories` | `.skilled/bin/install-codex-hooks.mjs` |
| `dist-freshness` (per-runtime `.sh`) | claude, codex, cursor, devin (pi and dsh run it inside `session-start-advisories`) | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` |

The `session-lifecycle/` and `skill-advisor/` subfolders of Claude, Codex, Cursor and Devin also carry the deployed `.js` entrypoint. It sits beside its `.ts` source as a relative symlink into `system-spec-kit`'s built `dist/hooks/`. The actually-executed file is therefore browsable too.

Those dist symlinks resolve after a build, exactly like the deployed `.<runtime>/hooks/*.js` symlinks the runtimes already use. Pi and DSH keep only their `.ts` or `.mjs` source in those folders. `skill-advisor/opencode/` links the OpenCode plugin itself.

---

## 8. RELATED

- [`injection-contract.md`](./injection-contract.md): what every hook actually injects, the skill-owned ones included.
- Per-concern READMEs: [`cli-dispatch/`](./cli-dispatch/README.md), [`mcp-route-guard/`](./mcp-route-guard/README.md), [`overlay-guard/`](./overlay-guard/README.md), [`env-secret-guard/`](./env-secret-guard/README.md), [`post-edit-quality/`](./post-edit-quality/README.md), [`classifier-injection-screen/`](./classifier-injection-screen/README.md), [`subagent-dispatch-guard/`](./subagent-dispatch-guard/README.md), [`shared/`](./shared/README.md).
- [`../scripts/git-hooks/README.md`](../scripts/git-hooks/README.md): the primary git-hooks installer, whose `pre-commit` carries its own comment-hygiene gate.
- [`../../.claude/hooks/README.md`](../../.claude/hooks/README.md), [`../../.cursor/hooks/README.md`](../../.cursor/hooks/README.md), [`../../.devin/hooks/README.md`](../../.devin/hooks/README.md), [`../../.codex/hooks/README.md`](../../.codex/hooks/README.md): per-runtime discovery mirrors pointing back into this tree.
- [`../../.opencode/plugins/README.md`](../../.opencode/plugins/README.md): the OpenCode plugins that import these cores directly.
- [`../../.pi/extensions/README.md`](../../.pi/extensions/README.md): the Pi extensions that import these cores directly.
- [`../../.dsh/plugins/repo-guards/README.md`](../../.dsh/plugins/repo-guards/README.md): the DSH bundle whose adapter links point back into this tree.

<!-- readme-check
allow-ref hooks/dsh/ | a folder name inside each owning skill rather than a path from here
-->
