# Repo Guards Plugin Bundle

---

## 1. OVERVIEW

`repo-guards/` connects DSH events to the repository's shared guard cores. The entrypoint registers adapters, and each adapter translates event data into a core call and delivers the result. Shared cores retain policy ownership.

The bundle injects the selected packet's durable goal slice and session-prime context on `agent/created`. It can add prompt guidance, attach Git advisories or deny a bash call when the shared message contract rejects it.

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
┌──────────────────────┐
│ adapters/*.mjs       │
│ event translation    │
└──────────┬───────────┘
           ▼
┌──────────────────────────────┐
│ Shared hooks and runtimes    │
│ policy and context cores     │
└──────────┬───────────────────┘
           ▼
╭──────────────────────────────╮
│ inject, attach, allow or deny │
╰──────────────────────────────╯
```

Dependency direction: `index.mjs` → adapters → shared hooks and runtime cores. Adapters own DSH event wiring and result delivery. They do not copy policy from shared cores.

---

## 3. DIRECTORY TREE

```text
repo-guards/
+-- index.mjs
+-- adapters/
|   +-- classifier-injection-screen.mjs
|   +-- completion-evidence.mjs
|   +-- dispatch-audit.mjs
|   +-- dispatch-preflight-lint.mjs
|   +-- dsh-llm.mjs
|   +-- git-message-gate.mjs
|   +-- git-preflight-advisory.mjs
|   +-- goal-context.mjs
|   +-- mcp-route-guard.mjs
|   +-- post-edit-quality.mjs
|   +-- prompt-advisor.mjs
|   +-- session-start-context.mjs
|   +-- spec-gate-classify.mjs
|   +-- spec-gate-enforce.mjs
|   `-- task-dispatch-guard.mjs
+-- tests/
|   +-- mcp-route-guard.test.mjs
|   `-- repo-guards.test.mjs
`-- README.md
```

---

## 4. ADAPTER POLICIES

| Adapter | DSH event | Scope | Error policy |
| --- | --- | --- | --- |
| `dispatch-audit` | `tools/post-execute` | `bash` | Log and continue |
| `dispatch-preflight-lint` | `tools/pre-execute` | `bash` | Log and deny on core failure |
| `spec-gate-classify` | `agent/pre-step` | Latest user message | Log and continue |
| `spec-gate-enforce` | `tools/pre-execute` | `write`, `edit`, `apply_patch`, `bash` | Log and deny on core failure |
| `completion-evidence` | `agent/turn-stopping` | Current assistant turn | Log and continue |
| `task-dispatch-guard` | `tools/pre-execute` | `subagent`, `subagent_fork` | Log and continue |
| `post-edit-quality` | `tools/post-execute` | `write`, `edit`, `apply_patch` | Log and continue |
| `mcp-route-guard` | `tools/pre-execute` | `mcp__*` | Log and deny on core failure; deny a `code_mode` tool outside `call_tool_chain`, `list_tools`, `search_tools`, `tool_info` |
| `classifier-injection-screen` | `tools/post-execute` | `web_fetch`, `web_search`, `mcp__*` | Log and continue |
| `goal-context` | `agent/created` | `DSH_SPEC_FOLDER` chat slice | Log and continue |
| `session-start-context` | `agent/created` | Session-prime output | Log and continue |
| `prompt-advisor` | `agent/pre-step` | Latest user message | Log and continue, disabled by default |
| `git-preflight-advisory` | `tools/post-execute` | Bash Git commands | Log and continue, add context |
| `git-message-gate` | `tools/pre-execute` | Bash commands covered by the message contract | Log unexpected errors and continue, deny on `ContractError` |

Context adapters call `agent.inject` or return `additionalContexts`. Their core errors do not block tool calls. They build injected messages with the harness's own `@deepseek-ai/dsh-llm`, which `adapters/dsh-llm.mjs` resolves from the running `dsh` binary, because this checkout has no copy of it.

`dispatch-audit` and `dispatch-preflight-lint` find the checkout from the plugin file, not the session cwd. A dsh session runs in a lineage or scratch folder, where a cwd-relative rule tree would be empty and the lint would allow every command. `git-message-gate` is a policy gate, so a contract violation or unreadable contract returns `deny`.

---

## 5. CONFIGURATION

The guard patch turns the prompt advisor off by default. Set its row flag to `true` to register the adapter.

```yaml
- id: repo-guards
  name: ../plugins/repo-guards/index.mjs
  config:
    adapters:
      promptAdvisor: false
```

Set `DSH_SPEC_FOLDER` to a packet directory, relative to the DSH workspace or as an absolute path inside it. The goal core reads the packet goal and returns its `chatSlice`, which matches the `chat_slice` from `goal.cjs packet`. The adapter injects that string only, without goal frontmatter.

The session-start adapter passes the DSH source value to the compiled `session-prime.js` hook and injects its stdout. It uses the session ID and workspace from the created agent.

---

## 6. VALIDATION

Run these commands from the repository root.

```sh
node --test .dsh/plugins/repo-guards/tests/
```

Expected result: 37 tests pass.

The Git message adapter also uses the fixtures in the shared contract suite:

```sh
node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs
```

Expected result: 38 tests pass.

---

## 7. DEFERRED ADAPTERS

- `session-compact-context`: `compaction/summary` is UNKNOWN in the source event index, which lists only `compaction/summary-error`.
- `session-stop-context`: `agent/disposed` exists, but its source contract does not confirm session shutdown semantics.
- `session-start-advisories`: `agent/created` exists, but the Pi implementation runs several scripts instead of one plain shared function.
- `decision-capture`: `agent/turn-stopping` exists, but the DSH answer-channel semantics are UNKNOWN.

---

## 8. RELATED

- [Guard patch](../../patches/guards.patch.yml)
- [Goal core](../../../.skilled/hooks/goal/lib/goal-core.cjs)
- [Git message contract tests](../../../.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs)
