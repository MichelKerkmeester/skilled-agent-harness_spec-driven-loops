---
title: cli-opencode
description: OpenCode CLI orchestrator that dispatches a task with the project's full plugin, skill, MCP and Spec Kit Memory runtime from external assistants, parallel detached sessions and cross-AI handback.
trigger_phrases:
  - "delegate to opencode"
  - "opencode run"
  - "full plugin runtime"
  - "parallel detached"
  - "cross-ai handback"
---

# cli-opencode

> Get the project's entire runtime in a single dispatch, from any AI assistant.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | One-shot dispatch into OpenCode's full plugin, skill, MCP and Spec Kit Memory runtime from an external assistant |
| **Invoke with** | "delegate to opencode", "opencode run", "full plugin runtime", "parallel detached" or "cross-ai handback" |
| **Works on** | Any external runtime (Claude Code, Codex, Gemini, raw shell) and in-OpenCode parallel detached sessions |
| **Produces** | JSON event streams, code edits, agent output and session artifacts from the dispatched OpenCode runtime |

---

## 2. OVERVIEW

### Why This Skill Exists

A Claude Code, Codex or Gemini session that needs the project's whole runtime has no native path to get it. The memory database, the code graph, every plugin and skill, the MCP toolset: none of that loads from outside. You would hand-build an `opencode run` invocation, pick a model and provider, and remember the non-obvious traps. The dispatch hangs at zero percent CPU if you forget to close stdin. The current OpenCode rejects a top-level `--agent general` flag without telling you why. If the caller is itself OpenCode, a self-dispatch loops and burns tokens for no value. This skill standardizes the dispatch across three documented use cases and refuses self-invocation.

### What It Does

cli-opencode is the single routing point for runtimes that need OpenCode's full project runtime. A smart router scores the task against intent signals (external dispatch, parallel detached session, cross-AI handback, agent delegation, cross-repo dispatch) and loads only the references that match. The default dispatch is `opencode run --model opencode-go/deepseek-v4-pro --variant high --format json --dir <repo-root>`. The skill runs a provider auth pre-flight before the first dispatch and guards against self-invocation through three detection layers.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-opencode dispatches to OpenCode and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v opencode
```

If nothing prints, install it with `brew install opencode` (macOS) or `curl -fsSL https://opencode.ai/install | bash`.

**Step 2: Run the provider auth pre-flight.**

```bash
opencode providers list
```

You get a table of configured providers and their status. Confirm `opencode-go` appears. If it does not, run `opencode providers login opencode-go` before dispatching.

**Step 3: Run the default dispatch.**

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --variant high \
  --format json \
  --dir /path/to/repo-root \
  "Summarize the architecture of src/" \
  </dev/null
```

You get a JSON event stream with the response, tool calls and a final summary. The `</dev/null` is mandatory on non-interactive runs. Without it, the dispatch hangs at zero percent CPU.

**Step 4: Dispatch to a different provider when the task demands it.**

The skill documents seven configured providers. Here are two alternatives to the default:

```bash
# MiniMax Token Plan (default MiniMax path; omit --agent)
opencode run \
  --model minimax-coding-plan/MiniMax-M3 \
  --format json \
  --dir /path/to/repo-root \
  "Refactor the auth module into separate files" \
  </dev/null
```

```bash
# Xiaomi Token Plan Europe (MiMo; high reasoning preset)
opencode run \
  --model xiaomi-token-plan-ams/mimo-v2.5-pro \
  --variant high \
  --format json \
  --dir /path/to/repo-root \
  "Write unit tests for the payment service" \
  </dev/null
```

The full provider roster and auth commands live in `references/cli_reference.md`.

**Step 5: Run a cross-AI handback when a non-Anthropic CLI needs OpenCode's runtime.**

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --variant high \
  --format json \
  --dir /path/to/repo-root \
  "Spec folder: .opencode/specs/my-feature (pre-approved, skip Gate 3). Run the code graph scan and report findings." \
  </dev/null
```

A non-Anthropic CLI (Codex, Gemini, Copilot) cannot load the project's plugin and MCP runtime on its own. The dispatch uses OpenCode as a bridge to project subsystems like spec-kit, memory, code-graph and the skill advisor.

**Step 6: Dispatch into a different repository.**

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --variant high \
  --format json \
  --dir /path/to/other-repo \
  "List all open TODOs in the codebase" \
  </dev/null
```

The `--dir` flag pins the working directory. OpenCode loads the target repo's plugin, skill and MCP runtime, not the caller's.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt and passes it to `opencode run` with the right model, variant, format and directory. OpenCode loads the project's full plugin, skill, MCP and Spec Kit Memory runtime, processes the task through its internal agent loop and streams JSON events back. The calling AI parses the events incrementally (tool calls, partial messages, final summary) and integrates the result. The whole round-trip is non-interactive: send the prompt, get the response, exit.

### The Two Non-Obvious Rules

Two defaults punish operators who do not know them. A reader who learns them here never hits them.

**Rule 1: always close stdin on non-interactive runs.** Append `</dev/null` to every `opencode run` that is not a live interactive session. Without it, OpenCode inherits the parent terminal's stdin and triggers a reactive-EOF exit path when that stream closes. The dispatch sits at zero percent CPU after the snapshot-prune log line and never progresses. The nine-character redirect provides immediate EOF on stdin, unblocking the dispatch. Position it after the prompt argument, before any `> stdout 2> stderr` redirects.

**Rule 2: never pass a top-level `--agent`.** Current OpenCode treats named agents like `general` as subagents and rejects them at the top level. Passing `--agent general` fails the dispatch outright. When no `--agent` is given, the default agent runs, which is what you want for almost every dispatch. To run as a specific agent profile, describe the role in the prompt body (for example, open with "Act as a code-review agent: ..."). Only pass `--agent <name>` if `opencode run --help` on the installed version confirms top-level acceptance for that agent.

### The Self-Invocation Guard

If the agent reading this skill is itself running inside OpenCode, the skill refuses to load. The guard checks three layers in order:

1. The `$OPENCODE_CONFIG_DIR` env var and any `OPENCODE_*`-prefixed vars, which OpenCode sets on session start.
2. Process ancestry, where an `opencode` parent in the tree trips the guard.
3. Lock files under `~/.opencode/state/<id>/lock`, which signal an active session.

When any layer matches, the skill returns a refusal and loads nothing. The one exception is an explicit parallel-detached request. A prompt that contains "parallel detached", "ablation suite", "worker farm" or "spawn detached" intentionally spawns a separate session with its own session id and state directory, not a self-dispatch, so the guard allows it through.

### Provider Auth Pre-Flight

Before the first dispatch in a session, the skill runs `opencode providers list` and checks which providers are configured. The default `opencode-go` may not be logged in on a given machine. If it is missing, the skill asks the operator which provider to use. It never silently substitutes a model. Seven providers are configured on a typical install: `opencode-go` (gateway, default), `deepseek` (direct API), `minimax-coding-plan` (MiniMax Token Plan), `minimax` (MiniMax Direct API), `xiaomi-token-plan-ams` (Xiaomi Token Plan Europe), `xiaomi` (Xiaomi Direct API) and `openai` (premium alternative). If a later dispatch returns an auth error, the skill invalidates the cache and reruns the pre-flight before retrying.

### Agent Delegation

OpenCode distinguishes primary agents (directly invokable) from subagents (dispatched via the Task tool from a primary). Primary agents are `general`, `plan`, `orchestrate` and `ai-council`. Subagents include `context`, `review`, `write`, `debug`, `deep-research`, `deep-review`, `deep-improvement` and `prompt-improver`. The calling AI stays the conductor: it dispatches to OpenCode, validates the output and integrates the result. The full agent roster and dispatch patterns live in `references/agent_delegation.md`.

### Memory Handback

When the calling AI needs to preserve session context from a dispatch, the skill runs a seven-step Memory Handback procedure: extract the handback section from the output, build structured JSON, scrub secrets, invoke `generate-context.js` and index the result. The full procedure lives in `system-spec-kit/references/cli/memory_handback.md`.

### Destructive-Scope Prevention

A non-interactive dispatch with elevated permissions against a populated worktree applies a four-layer mitigation to prevent scope violations. The dispatch prompt contains literal banned-operations and allowed-write-paths blocks, the `--dir` flag points at a fresh worktree, the main branch status is clean or committed, and multi-phase targets prefer a safer model. The incident that motivated this prevention is documented in `references/destructive_scope_violations.md`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-opencode when a task needs the project's full runtime: the Spec Kit Memory database, the Code Graph semantic index, every plugin, skill and MCP tool. Reach for it too when you want a parallel detached session for ablation or worker-farm work, or when a non-Anthropic CLI needs OpenCode as a bridge to a project subsystem like spec-kit, memory or code-graph.

Skip it for simple tasks the caller can answer directly, for raw model dispatch where a sibling cli-* skill is leaner, for interactive TUI or web UI sessions (which are operator-driven) and for context the calling AI already has loaded.

### Sibling Boundaries

The cli-X skills each dispatch to a different provider and never overlap.

| Skill | Provider | When to reach for it |
|---|---|---|
| `cli-opencode` | OpenCode | Full OpenCode runtime dispatch, in-OpenCode parallel sessions, cross-AI handback |
| `cli-codex` | OpenAI | Sandboxed coding, repo analysis, PR review, web research |
| `cli-claude-code` | Anthropic | Deep reasoning, diff-based edits, `--json-schema` output, agent delegation |
| `cli-devin` | Cognition | Autonomous coding via Devin for Terminal |

If you are already inside one runtime, the matching cli-X skill refuses to load. Use a different runtime or exit first.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns code standards and verification. cli-opencode dispatches the work, sk-code governs the quality of what comes back. |
| `system-spec-kit` | Owns spec folders, memory and continuity. The Memory Handback bridges an OpenCode session back into the caller's spec folder. |
| `mcp-code-mode` | Orchestrates external MCP tool calls. cli-opencode's dispatched session has MCP tools loaded natively. |
| `sk-prompt-models` | Owns per-model prompt-craft profiles. Consult it before composing a prompt for a profiled model. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: opencode` | CLI not installed or PATH not updated | `brew install opencode` or `curl -fsSL https://opencode.ai/install \| bash` |
| Dispatch hangs at 0% CPU | Missing `</dev/null` on a non-interactive run | Append `</dev/null` after the prompt argument |
| `--agent general` fails | Current OpenCode rejects top-level `--agent general` | Drop the flag; describe the role in the prompt body |
| `provider/model not found` or `401 Unauthorized` | The default `opencode-go` is not configured on this machine | Run `opencode providers list` then `opencode providers login opencode-go` |
| Empty event stream | Output format defaults to something the caller cannot parse | Add `--format json` to the invocation |
| `Self-invocation refused` | The caller is already inside OpenCode (`OPENCODE_*` env set, `opencode` ancestry or a state lock) | Use a different runtime or exit the current OpenCode session first |
| Version drift or unknown flags | Installed OpenCode version differs from the baseline | Run `opencode --version` and `opencode run --help`; surface the drift |
| Dispatch returns code with no tests | The dispatched session did not load sk-code verification | Include "load sk-code and run verification" in the prompt body |

---

## 7. FAQ

**Q: What does the full-runtime dispatch buy over a sibling cli-* skill?**

A: A sibling cli-* skill dispatches to a single provider's binary. cli-opencode dispatches into a session that loads every plugin, skill, MCP server and the Spec Kit Memory database for the project. When the task needs the code graph, memory search or a project-specific plugin, only cli-opencode provides all of them in one shot.

**Q: When do I use a parallel detached session?**

A: When you are already inside OpenCode and want a separate session with its own id and state directory. Use cases include ablation suites, worker farms, parallel research branches and share-URL generation. The prompt must contain explicit parallel-session keywords ("parallel detached", "ablation suite", "worker farm", "spawn detached") or the self-invocation guard blocks the dispatch.

**Q: Why can I not pass `--agent general`?**

A: Current OpenCode treats `general` as a subagent and rejects it at the top level. The default agent (used when no `--agent` is given) already covers the general case. To run as a specific profile, state the role in the prompt body.

**Q: Why must I close stdin with `</dev/null`?**

A: OpenCode reads stdin at startup before session creation. In a non-interactive dispatch the parent terminal's stdin may close mid-run, triggering an EOF that stalls the session at zero percent CPU. The `</dev/null` redirect provides immediate EOF on stdin, unblocking the dispatch. It is nine characters that prevent a silent hang.

**Q: Which provider do I pick?**

A: Default to `opencode-go/deepseek-v4-pro --variant high`. It routes through the OpenCode Go gateway and gives elevated reasoning at low cost. Reach for `openai/gpt-5.5` when the task needs OpenAI's model strengths. Use `minimax-coding-plan/MiniMax-M3` for MiniMax Token Plan work and `xiaomi-token-plan-ams/mimo-v2.5-pro` for Xiaomi Token Plan Europe. Run `opencode providers list` to see what is configured on your machine.

**Q: Can I dispatch into a repository that is not my current working directory?**

A: Yes. The `--dir` flag pins the working directory for the dispatched session. OpenCode loads the target repository's plugin, skill and MCP runtime, not the caller's. This is the cross-repo dispatch use case. For remote repositories, `--attach <url>` connects to a running OpenCode server instead.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete subcommands, flags, models, providers and version drift handling |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Three use cases, self-invocation guard, the silent-stdin trap |
| [`references/opencode_tools.md`](./references/opencode_tools.md) | Unique value versus sibling cli-* skills |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | Agent roster, primary versus subagent routing and leaf-agent constraints |
| [`references/destructive_scope_violations.md`](./references/destructive_scope_violations.md) | The RM-8 incident and four-layer prevention playbook |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | Executor-specific model overrides and the CLEAR check |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste prompt templates for each use case and agent |
