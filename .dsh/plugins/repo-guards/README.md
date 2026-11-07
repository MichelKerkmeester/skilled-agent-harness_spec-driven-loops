# Repo Guards Plugin Bundle

---

## 1. OVERVIEW

`repo-guards/` connects DSH events to the repository's shared guard cores. The entrypoint registers adapters, and each adapter translates event data into a core call and delivers the result. Shared cores keep policy ownership.

The bundle runs in two compositions. An interactive session, `dsh web` or a headless run with only the guards patch, gets every adapter. A fan-out leaf adds the lineage patch, and its marker row turns off the four adapters that write state or start background work. Everything else, the guards, the context injections and decision capture, runs in both.

---

## 2. ARCHITECTURE

```text
╭──────────────────────╮
│ DSH event            │
╰──────────┬───────────╯
           ▼
┌──────────────────────┐
│ index.mjs            │
│ registers adapters   │
└──────────┬───────────┘
           ▼
┌──────────────────────────────┐
│ adapters/*.mjs (links)       │
│ -> .skilled/hooks/<c>/dsh/   │
│ -> <skill>/hooks/dsh/        │
└──────────┬───────────────────┘
           ▼
┌──────────────────────────────┐
│ Shared hooks and runtimes    │
│ policy and context cores     │
└──────────┬───────────────────┘
           ▼
╭───────────────────────────────╮
│ inject, attach, allow or deny │
╰───────────────────────────────╯
```

Dependency direction: `index.mjs` → adapter links → real adapters → shared hooks and runtime cores. Adapters own DSH event wiring and result delivery. They do not copy policy from shared cores.

### Adapter layout

DSH uses the layout Pi uses. Every file in `adapters/` is a relative link to the real adapter in the hook library: `.skilled/hooks/<concern>/dsh/` for the portable concerns, or the owning skill's `hooks/dsh/` folder for spec-gate, completion, session lifecycle, the skill advisor and the two sk-git adapters, each with an index link in `.skilled/hooks/<concern>/dsh/`. Node resolves a link to its real path before it resolves the adapter's own imports, so each adapter's imports are written for its real folder. The adapters that find the checkout from their own file count up from that folder.

`sync-runtime-mirrors.cjs --check`, which `/doctor:runtime-mirrors` runs, expects one link here per `.mjs` file in a `dsh/` folder of the hook library and reports a missing link, a stale one or a real file in its place. Add an adapter by writing it into its `dsh/` folder, then run the synchronizer without `--check` to create the link.

---

## 3. DIRECTORY TREE

```text
repo-guards/
+-- index.mjs                 # bundle entry the guards patch loads
+-- lineage-leaf.mjs          # marker plugin the lineage patch inserts
+-- adapters/                 # one relative link per adapter, see section 2
|   +-- classifier-injection-screen.mjs, completion-evidence.mjs, decision-capture.mjs
|   +-- dispatch-audit.mjs, dispatch-preflight-lint.mjs, git-message-gate.mjs
|   +-- git-preflight-advisory.mjs, goal-context.mjs, goal-manage.mjs
|   +-- mcp-route-guard.mjs, overlay-guard.mjs, post-edit-quality.mjs, prompt-advisor.mjs
|   +-- session-compact-context.mjs, session-start-advisories.mjs, session-start-context.mjs
|   +-- session-stop-context.mjs, spec-gate-classify.mjs, spec-gate-enforce.mjs
|   +-- task-dispatch-guard.mjs
|   `-- dsh-llm.mjs, session-role.mjs (shared helpers in .skilled/hooks/shared/dsh/)
+-- tests/
|   `-- bundle.test.mjs       # patches, lineage-leaf plugin, advisor row flag, adapter links
`-- README.md
```

Each adapter's tests sit in its concern's `tests/` folder as `dsh-<concern>.test.mjs`, such as `.skilled/hooks/goal/tests/dsh-goal.test.mjs`. The prompt advisor's are in `.skilled/skills/system-skill-advisor/hooks/tests/`. They share the fake plugin context in `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`.

---

## 4. ADAPTER POLICIES

| Adapter | DSH event | Scope | Leaf | Error policy |
| --- | --- | --- | --- | --- |
| `dispatch-audit` | `tools/post-execute` | `bash` | runs | Log and continue |
| `dispatch-preflight-lint` | `tools/pre-execute` | `bash` | runs | Log and deny on core failure |
| `spec-gate-classify` | `agent/pre-step` | Latest operator prompt | runs, off by the runner's `SYSTEM_SPEC_GATE_DISABLED=1` | Log and continue |
| `spec-gate-enforce` | `tools/pre-execute` | `write`, `edit`, `apply_patch`, `bash` | runs, off by the runner's `SYSTEM_SPEC_GATE_DISABLED=1` | Log and deny on core failure |
| `completion-evidence` | `agent/turn-stopping` | Current assistant turn | runs | Log and continue |
| `task-dispatch-guard` | `tools/pre-execute` | `subagent`, `subagent_fork` | runs | Log and continue |
| `post-edit-quality` | `tools/post-execute` | `write`, `edit`, `apply_patch` | runs | Log and continue |
| `mcp-route-guard` | `tools/pre-execute` | `mcp__*` | runs | Log and deny on core failure, and deny a `code_mode` tool outside `call_tool_chain`, `list_tools`, `search_tools` and `tool_info` |
| `classifier-injection-screen` | `tools/post-execute` | `web_fetch`, `web_search`, `mcp__*` | runs | Log and continue |
| `overlay-guard` | `tools/pre-execute` | `write`, `edit`, `apply_patch` | runs | Log and allow, deny only a path an overlay owns |
| `git-preflight-advisory` | `tools/post-execute` | Bash Git commands | runs | Log and continue, add context |
| `git-message-gate` | `tools/pre-execute` | Bash commands covered by the message contract | runs | Log unexpected errors and continue, deny on `ContractError` |
| `goal-context` | `agent/created` | `DSH_SPEC_FOLDER` chat slice | runs | Log and continue |
| `session-start-context` | `agent/created` | Session-prime output | runs | Log and continue |
| `session-compact-context` | `session/event` (`compaction/end`) | Session-prime `compact` output | runs | Log and continue |
| `decision-capture` | `tools/result`, `session/event`, `agent/status` | `ask_user_question` answers and late timed replies | runs, headless has no question tool | Log and continue |
| `prompt-advisor` | `agent/pre-step` | Latest operator prompt | off | Log and continue |
| `goal-manage` | `agent/created`, `agent/pre-step`, `agent/turn-stopping`, `agent/status` | `/goal-dsh`, `dsh_goal`, goal brief, verify note | off | Log and continue |
| `session-start-advisories` | `agent/created` (`startup`) | The six warn-only session-start guards | off | Log each failing guard and continue |
| `session-stop-context` | `agent/disposed` | `session-stop.js` autosave | off | Log and continue |

Context adapters call `agent.inject` or return `additionalContexts`. Their core errors do not block tool calls. They build injected messages and the goal tool with the harness's own `@deepseek-ai/dsh-llm` and `@deepseek-ai/dsh-tools`, which `dsh-llm.mjs` resolves from the running `dsh` binary, because this checkout has no copy of them.

`dispatch-audit`, `dispatch-preflight-lint`, `git-preflight-advisory`, `mcp-route-guard` and `session-start-advisories` find the checkout from their own file, not the session cwd. A dsh session runs in a lineage or scratch folder, where a cwd-relative rule tree would be empty and the lint would allow every command. `git-message-gate` is a policy gate, so a contract violation or unreadable contract returns `deny`.

`goal-manage` and `session-compact-context` wait for the `commands`, `tools` and `agents` services through `ctx.inject`. A bundle-level `inject` would hold every guard until those services exist, and this cordis build has no optional form.

---

## 5. CONFIGURATION

The guards patch turns the prompt advisor on. The lineage patch keeps it off for a fan-out leaf through its marker row, so the flag stays `true` in both compositions.

```yaml
- id: repo-guards
  name: ../plugins/repo-guards/index.mjs
  config:
    adapters:
      promptAdvisor: true
```

Set `DSH_SPEC_FOLDER` to a packet directory, relative to the DSH workspace or as an absolute path inside it. The goal core reads the packet goal and returns its `chatSlice`, which matches the `chat_slice` from `goal.cjs packet`. The adapter injects that string only, without goal frontmatter.

In an interactive session, `/goal-dsh` and the `dsh_goal` tool run the shared manage CLI under this session's scope. The tool takes the OpenCode action set: `set`, `bind`, `unbind`, `resent`, `log`, `packet`, `show`, `clear`, `complete`, `pause`, `history`, `resume`, `doctor` and `health`. The command passes its words to the same CLI, so `/goal-dsh bind <packet>` or `/goal-dsh log <item> | <state> | <evidence>` work as written, and a bare `/goal-dsh` shows the goal. `OPENCODE_GOAL_DISABLED=1` turns the whole goal surface off.

Each session-start guard answers to its own switch: `SYSTEM_GIT_WORKTREE_GUARD_DISABLED`, `SYSTEM_GIT_HOOKS_CHECK_DISABLED`, `SYSTEM_PRIMARY_RECONCILE_DISABLED`, `SYSTEM_LIVE_FOLLOW_DISABLED`, `SYSTEM_DIST_FRESHNESS_DISABLED` and `SYSTEM_HOOK_INSTALL_DISABLED`. `SYSTEM_SESSION_LIFECYCLE_DISABLED` turns off all session-lifecycle adapters.

---

## 6. VALIDATION

Run these commands from the repository root.

```sh
node --test .skilled/hooks/*/tests/dsh-*.test.mjs .skilled/skills/system-skill-advisor/hooks/tests/dsh-*.test.mjs .dsh/plugins/repo-guards/tests/
```

Expected result: 78 tests pass.

```sh
node --test .skilled/hooks/decision-capture/bin/sweep-dsh.test.mjs
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

Expected result: 8 sweep tests pass, and the mirror check prints `PASS` with the `dsh-adapters` tree among its trees.

The Git message adapter also uses the fixtures in the shared contract suite:

```sh
node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs
```

Expected result: 38 tests pass.

---

## 7. RELATED

- [Guard patch](../../patches/guards.patch.yml) and [lineage patch](../../patches/lineage.patch.yml)
- [Hook library](../../../.skilled/hooks/README.md), whose coverage matrix carries the DSH column
- [Goal core](../../../.skilled/hooks/goal/lib/goal-core.cjs)
- [DSH session sweep](../../../.skilled/hooks/decision-capture/bin/sweep-dsh.mjs)
- [Git message contract tests](../../../.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs)
