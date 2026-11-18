---
title: "Hooks: Runtime Guard Cores"
description: "The runtime hook library, one folder per concern, with the switch index, the coverage matrix and the wiring each runtime uses."
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

# Hooks: Runtime Guard Cores

---

## 1. OVERVIEW

`.skilled/hooks/` holds the repository's runtime hooks. Each direct subfolder carries its own README, and most own one concern. Four folders host two related concern keys, and `shared/` holds the helpers the rest import.

A hook reads a runtime event and answers in one of four ways. It adds context for the runtime to inject, refuses a tool call, writes a local record or stays silent. A runtime's adapter converts that runtime's payload and calls a core that holds the policy, so one core serves every runtime that carries the concern.

Current state:

- A concern is on by default. Session handover and the Claude user-hook sync are the exceptions: handover is on for Claude Code only, and the sync waits for its own enable switch.
- Every concern except `git-message-gate` can be silenced. The message gate has no switch, because the commit, PR and branch rules carry no bypass on any surface.
- The folder is also the browsable index of the hooks the repository installs. A concern whose logic is the owning skill's engine keeps its code in that skill and holds a relative link per runtime here.
- Hooks stay out of the way of the work they guard. A host that never closes a payload stream gets an answer at the adapter's deadline rather than no answer.

### Kill-switch index

Two switches silence a concern: the master `SYSTEM_HOOKS_DISABLED` and the concern's own kill switch. A value of `1`, `true`, `yes` or `on`, in any case, switches the concern off. The master wins over every per-concern switch. This table gives each concern here its kill-switch name, apart from the older `MK_*` spellings that `hook-flags.cjs` still honors.

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
| `session-handover` | `SYSTEM_SESSION_HANDOVER_DISABLED` | `SYSTEM_IN_SESSION_HANDOVER_DISABLED` and the same second spelling of each enable switch, read only while the main switch is unset or blank | on for Claude Code and off elsewhere, set with `SYSTEM_SESSION_HANDOVER_ENABLED`, per runtime with `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` | inject / arm | wired |

The switch name follows the concern key, not the folder it sits in.

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

A canonical name departs from the `SYSTEM_` shape when the surface that owns the concern named it, such as `MCP_ROUTE_GUARD_DISABLED` or `SK_GIT_PREFLIGHT_DISABLED`. `env-secret-guard` resolves both of its switches from the environment only, so neither switch can come from `hook-flags.env`.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                        .skilled/hooks/                           │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ A runtime event      │ ─▶ │ <runtime>/ adapter   │ ─▶ │ lib/ core            │
│ from its hook config │    │ payload -> policy    │    │ shared policy        │
└──────────────────────┘    └──────────┬───────────┘    └──────────┬───────────┘
                                       │                           │
                                       ▼                           ▼
                            ┌──────────────────────┐    ┌──────────────────────┐
                            │ shared/ helpers      │    │ One answer           │
                            │ switches, stdin,     │    │ decision, context    │
                            │ session readers      │    │ or a local record    │
                            └──────────────────────┘    └──────────────────────┘

Dependency direction: <runtime>/ adapter ─▶ lib/ core ─▶ shared/ helpers
A core never imports a runtime adapter.
```

Most concerns keep their core in `lib/` and their tests beside it or in `tests/`. Most runtimes get their own adapter folder, while a few concerns share one adapter across the editors, as `env-secret-guard/command-hook/` and `git-preflight/shared/` do. `shared/` sits below all of them, so a concern can use the switch resolver and the stdin helper without reaching into another concern.

### Core placement

A core keeps its real code in this tree only when it imports Node builtins and files inside the tree. It may also run an unrelated checker script by path. It must have no real tie to its owning skill's other content. Each core below meets those terms.

| Concern | Core dependencies | Verdict |
|---|---|---|
| `dispatch` | Node builtins only | Portable |
| `mcp-route-guard` | Node builtins only | Portable |
| `overlay-guard` | Node builtins, plus the overlay engine loaded only when the tree has an overlay folder or an overlay settings file | Portable |
| `post-edit-quality` | Node builtins + `spawnSync` to unmoved checker scripts (invoked by path, never imported) | Portable |
| `task-dispatch` | Node builtins only | Portable |
| `ask-surface` | Node builtins only (`node:crypto`, `node:fs`, `node:os`, `node:path`) | Portable |
| `env-secret-guard` | Node builtins only (`node:crypto`, `node:fs`, `node:path`) | Portable |

The Jev classifier hook in [the classifier injection screen](./classifier-injection-screen/README.md) is the deliberate exception. It lives here for hook registration, and its adapter and library import the gate, transport and measured question from `cli-classifier`. The live hook and the offline measurement therefore cannot drift apart.

Other concerns keep their code in the skill that owns them, because the core logic is that skill's engine. The spec-gate and session-lifecycle hooks live in `system-spec-kit`, as does the completion hook. The advisor brief lives in `system-skill-advisor`, and the git preflight advisory in `sk-git`, which depends on its own rule engine. Each one has a runtime index link here and honors the shared kill-switch. A concern with one shared adapter keeps it in `shared/`, and the editors link it from their discovery mirrors.

`shared/hook-adapter-shared.cjs` parses the raw JSON payload a runtime hands an adapter, and gives up at a 3000 ms deadline when the host never closes the stream. A second, independent ESM sibling serves `system-spec-kit` and its own adapters. The two copies are separate files, so one can change without the other.

---

## 3. DIRECTORY TREE

```text
hooks/
+-- coverage-rationale.md            # why each runtime lacks a concern
+-- injection-contract.md            # what each hook injects and who sees it
+-- hook-flags.env.example           # the kill-switch config template
+-- vitest.config.ts                 # the vitest config for hook suites
+-- ask-surface-guard/               # prose option menus sent back to the question tool
+-- classifier-injection-screen/     # Jev screen of fetched web text
+-- cli-dispatch/                    # CLI dispatch preflight and audit
+-- codex-global-hooks-check/        # Codex user-global hook file drift check
+-- completion-evidence/             # advisories on completion claims
+-- decision-capture/                # operator answers queued for the next save
+-- directive-lifecycle/             # per-session directive delivery
+-- dist-freshness/                  # stale compiled output check and rebuild
+-- env-secret-guard/                # dotenv read and write refusal
+-- git-hooks-check/                 # installed git hook link check
+-- git-live-follow/                 # IDE checkout fast-forward poller
+-- git-message-gate/                # commit, PR and branch message rules
+-- git-preflight/                   # non-blocking git command guidance
+-- git-primary-reconcile/           # primary checkout convergence
+-- git-worktree-guard/              # shared checkout warning
+-- goal/                            # packet-bound session goals
+-- mcp-route-guard/                 # native MCP call routing advisory
+-- overlay-guard/                   # refusal of edits to overlay-owned files
+-- permission-policy/               # Devin permission-request decisions
+-- post-edit-quality/               # comment hygiene and dist checks on write
+-- session-cleanup/                 # teardown cleanup and OpenCode startup guards
+-- session-handover/                # hand-over to a fresh session
+-- session-lifecycle/               # session start, stop and compaction context
+-- shared/                          # switch resolver, stdin helper, session readers
+-- skill-advisor/                   # skill routing context on prompts
+-- spec-gate/                       # spec folder question and policy core
+`-- subagent-dispatch-guard/        # task dispatch and child model policy
```

A folder that holds no real code is still useful. It holds a relative link per runtime entry into the skill or script that owns the code, so the tree shows every hook the repository installs, by concern and runtime.

Each runtime points at those files in its own way.

- Pi discovers `.pi/extensions/`, whose entry files import the adapters under `<concern>/pi/` here or under the owning skill's `pi/` folder. Each adapter therefore loads from its own folder, and the imports Pi resolves are relative to that folder.
- OpenCode loads real modules from `.opencode/plugins/`. The `<concern>/opencode/` folder holds a relative link back into it for browsability, and nothing loads through that link, because the loader scans only its own folder.
- DSH reaches the adapters through `.dsh/plugins/repo-guards/adapters/`, which holds one relative link per adapter. The bundle entry imports each adapter through its link.
- Vibe runs the entries in `.vibe/hooks.toml`, which start the scripts in `.vibe/plugins/repo-guards/` and the adapters under `<concern>/vibe/`.

Node resolves a link to its real path before it resolves that file's imports, so a linked adapter's imports are written for its real folder. `sync-runtime-mirrors.cjs --check` derives one expected DSH link per `.mjs` file in a `dsh/` folder here, and reports a missing link, a stale one or a real file in its place.

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `coverage-rationale.md` | Why a runtime lacks a concern, with a subsection per gap. |
| `injection-contract.md` | Every injection point by content, with its visibility to the operator in each runtime. |
| `hook-flags.env.example` | The local config template, with every switch commented out and each one labeled. |
| `vitest.config.ts` | The vitest config for hook suites, which excludes the files written for `node --test`. |

Each concern folder carries its own README. A larger nested folder carries one too, as `cli-dispatch/lib/` and `session-handover/tests/` show. Open the folder's README before the code.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Ownership | A core belongs here only when it has no real dependency on a specific skill's other content. If a future core develops one, move it back out. |
| Imports | Cores import Node builtins and files inside this tree, or run an unmoved checker script by project-root-relative path. An adapter imports its concern's own `lib/` one level up and, where needed, `shared/hook-adapter-shared.cjs` two levels up. The Jev classifier adapter is the exception, and it imports its gate, transport and measured question from `cli-classifier`. |
| Runtime wiring | Each runtime's own config points its command string at the file here. The four discovery mirrors (`.claude/hooks/`, `.cursor/hooks/`, `.devin/hooks/` and `.codex/hooks/`) hold a relative link to the same file for browsability only. Pi, OpenCode and DSH are wired through their plugin trees, and Vibe through its hook table. |
| Tests | Tests sit in the concern's own `tests/` folder, and some cores keep one beside their code in `lib/`. |

### Configuration

Flags resolve from the live environment and from an optional config file at `.skilled/hooks/hook-flags.env`. The environment always wins, so a persisted default can still be overridden for one session.

- **Environment**: set a flag inline (`SYSTEM_SKILL_ADVISOR_DISABLED=1 <command>`), for a session, or in your shell profile.
- **Config file**: copy `hook-flags.env.example` to `hook-flags.env` beside it and uncomment the switches you want. The file is gitignored, uses the same `KEY=value` names, and a comment may follow a value after a space or tab, so the example's lines work as soon as you uncomment them. Re-enable a file-disabled hook for one session with e.g. `SYSTEM_SKILL_ADVISOR_DISABLED=0`.

A missing or unreadable file leaves every hook as the environment decides, so a broken file never switches a hook off by accident. Running `/doctor:env` shows where each switch is set and writes a config file here after your yes.

Some switches in the file are not hook concerns. `SPECKIT_SKIP_VALIDATION` switches spec folder validation off, and `SKDOC_SKIP_VALIDATION` switches off every sk-doc validator. `SYSTEM_SPEC_GATE_ENFORCE` is the separate opt-in for spec-gate denial, and it must come from the process environment, so the file cannot set it. `hook_flag_on` in the shell mirror and `isFlagOn` in `hook-flags.cjs` resolve a named switch such as these.

[ENV-REFERENCE.md](../skills/system-spec-kit/runtime/ENV-REFERENCE.md) documents the settings the spec-kit engine reads, and the root `.env.example` holds every other setting with its default. sk-doc's [validation-and-enforcement.md](../skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md) covers the validator switches.

### Coverage matrix

This matrix is the coverage authority for the intentionally uneven runtime surface. `✓ covered` means a runtime adapter or plugin covers the concern. `by-design` means the behavior is inherent in another named owner rather than a separately indexed adapter.

`n/a` means the runtime exposes no event capable of implementing that concern. `~ partial` means covered for the common case with a known, documented gap. `unverified` means an event may exist but its feasibility for this concern has not been confirmed live, and no adapter is wired.

For the why behind each absence, see [the coverage rationale](./coverage-rationale.md).

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
| `session-handover` | ✓ covered | ✓ covered | by-design: `/speckit-handoff` command trigger, no automatic hop because no usage signal is verified | by-design: `/speckit:handoff` command trigger, no automatic hop because no usage signal is verified | ✓ covered | ✓ covered | by-design: `/speckit-handoff` prompt trigger only, because `skilled-loop` launches no DSH session | ✓ covered |
| `skill-advisor` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `spec-gate` | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered | ✓ covered |
| `task-dispatch` | ✓ covered | n/a: codex-cli 0.160 fires `PreToolUse` on `spawn_agent` (as `collaborationspawn_agent`), but a captured payload carries the spawn message encrypted, so no prompt or target reaches a hook | ✓ covered | ✓ covered | ✓ covered | ~ partial: intercepts direct `subagent` calls, but not yet workflow-nested (`runs.run`) dispatches | ~ partial: guards `subagent` and `subagent_fork` at `tools/pre-execute`, but only logs and never denies | ✓ covered |

Beyond the guard-core concerns above, the hub also indexes the remaining repo-authored hooks as link-only folders. Their real code lives in `.skilled/bin/`, in `.skilled/scripts/` or in an OpenCode plugin, and four of them have no OpenCode folder because `.opencode/plugins/session-cleanup.js` runs them.

| Concern | Runtimes | Real home |
|---|---|---|
| `git-worktree-guard` | claude, codex, cursor, devin, vibe + opencode plugin (pi and dsh run it inside `session-start-advisories`) | `.skilled/bin/worktree-guard.sh` |
| `git-hooks-check` | claude, codex, cursor, devin, vibe + opencode plugin (pi and dsh run it inside `session-start-advisories`) | `.skilled/bin/check-git-hooks.sh` |
| `git-primary-reconcile` | claude, codex, cursor, devin, pi, dsh, vibe + opencode plugin | `.skilled/bin/git-primary-reconcile.sh` |
| `live-sync` (`git-live-follow`) | claude, codex, cursor, devin, pi, dsh, vibe + opencode plugin | `.skilled/bin/git-live-follow.sh` |
| `session-cleanup` | claude, codex, cursor, devin, vibe + opencode plugin | `.skilled/scripts/session-cleanup.sh`, `.opencode/plugins/session-cleanup.js`, `.vibe/plugins/repo-guards/session-cleanup.mjs` |
| `hook-install` | claude, cursor, devin + opencode plugin (Codex's user-global file is the cleanup target), plus pi and dsh through `session-start-advisories` | `.skilled/bin/install-codex-hooks.mjs` |
| `dist-freshness` (per-runtime `.sh`) | claude, codex, cursor, devin (pi and dsh run it inside `session-start-advisories`) | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` |

The `session-lifecycle/` and `skill-advisor/` folders for Claude, Codex, Cursor and Devin also carry the deployed `.js` entrypoint beside its `.ts` source, as a relative link into `system-spec-kit`'s built `dist/hooks/`. Those links resolve after a build, exactly like the deployed `.<runtime>/hooks/*.js` links the runtimes already use.

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `goal.cjs` | CLI | Bind, log, inspect or clear the goal for a session on a runtime with no goal tool. |
| `session-handover.cjs` | CLI | Prepare, claim or cancel a hand-off note from a shell. |
| `history-lookup.mjs` | CLI | Query the compiled history engine behind the hand-over record. |
| `sweep-transcript.mjs` | CLI | Replay a transcript at save time and append the answers a live hook missed. |
| `env-secret.cjs` | CLI | List keys, validate syntax or fingerprint one value without printing it. |
| `isHookEnabled` | Function | Decide whether a concern runs, for one runtime. |
| `isFlagOn` | Function | Resolve one named switch that is not a hook concern. |
| `hook_flag_on` | Function | The shell mirror of the same resolution, sourced from `hook-flags.sh`. |
| `hook-adapter-shared.cjs` | Module | Read a hook payload from stdin within a deadline. |
| `session-readers/index.mjs` | Module | Load one runtime's session behind a checked session id. |

The hand-over CLI documents itself, which is the fastest way to see its subcommands.

```bash
node .skilled/hooks/session-handover/bin/session-handover.cjs --help
```

Expected result: the `Usage:` line, then one entry per subcommand and its flags. The command exits 0.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/shared/hook-flags.test.cjs .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs
```

Expected result: `pass 95` and `fail 0` in the summary.

```bash
node --test .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs
```

Expected result: `pass 6` and `fail 0`. This suite reads the coverage matrix above, so a matrix edit that breaks its cell vocabulary fails here.

```bash
.skilled/node_modules/.bin/vitest run --root .skilled/hooks/cli-dispatch/lib dispatch-audit.test.mjs
```

Expected result: `Test Files  1 passed (1)` and `Tests  133 passed (133)`. The dispatch-audit suite is a vitest file and cannot run under `node --test`.

---

## 8. RELATED

- [The hook injection contract](./injection-contract.md): what every hook injects, the skill-owned ones included.
- [The coverage rationale](./coverage-rationale.md): why a runtime lacks a concern, by concern.
- Per-concern detail: [the shared helpers](./shared/README.md), [CLI dispatch](./cli-dispatch/README.md), [the MCP route guard](./mcp-route-guard/README.md), [the overlay guard](./overlay-guard/README.md), [the env secret guard](./env-secret-guard/README.md), [post-edit quality](./post-edit-quality/README.md), [the classifier injection screen](./classifier-injection-screen/README.md), [task dispatch](./subagent-dispatch-guard/README.md), [session handover](./session-handover/README.md) and [goal](./goal/README.md).
- [The primary git-hooks installer](../scripts/git-hooks/README.md), whose `pre-commit` carries its own comment-hygiene gate.
- Runtime discovery mirrors: [Claude](../../.claude/hooks/README.md), [Cursor](../../.cursor/hooks/README.md), [Devin](../../.devin/hooks/README.md) and [Codex](../../.codex/hooks/README.md).
- Runtime plugin trees: [OpenCode plugins](../../.opencode/plugins/README.md), [Pi extensions](../../.pi/extensions/README.md), [the DSH bundle](../../.dsh/plugins/repo-guards/README.md) and [Vibe](../../.vibe/README.md).
- [The repository README](../../README.md).
