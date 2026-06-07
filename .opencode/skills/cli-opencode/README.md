---
title: cli-opencode
description: OpenCode CLI orchestrator that dispatches a task into the project's full plugin, skill, MCP and Spec Kit Memory runtime in one shot, plus parallel detached sessions and cross-AI handback.
trigger_phrases:
  - "delegate to opencode"
  - "opencode run"
  - "full plugin runtime"
  - "parallel detached"
  - "cross-ai handback"
  - "share url"
---

# cli-opencode

> Dispatch a task into OpenCode's full project runtime in one shot from any external AI assistant, or spawn a parallel detached session for ablation and worker farms.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | One-shot dispatch into OpenCode's full plugin, skill, MCP and Spec Kit Memory runtime, parallel detached sessions and cross-AI handback |
| **Invoke with** | "delegate to opencode", "opencode run", "parallel detached", "cross-ai handback" or auto-routing on OpenCode keywords |
| **Works on** | Any external runtime (Claude Code, Codex, Gemini, raw shell) and from inside OpenCode for parallel detached workers |
| **Produces** | Structured JSON event streams, code changes with full project context, parallel research sessions and cross-AI handback results |

---

## 2. OVERVIEW

### Why This Skill Exists

A Claude Code, Codex or Gemini session that needs the project's whole runtime has no native path to get it. The memory database, the code graph, every plugin and skill, the MCP toolset: none of that loads from outside. You would hand-build an `opencode run` invocation, pick a model and provider, and hit the non-obvious traps. The dispatch hangs at zero percent CPU if you forget to close stdin. The current OpenCode rejects a top-level `--agent general` without telling you why. If the caller is itself OpenCode, a self-dispatch loops and burns tokens. This skill standardizes the dispatch across three documented use cases and refuses self-invocation.

### What It Does

cli-opencode is the single routing point for runtimes that need an OpenCode dispatch. A smart router scores the prompt against intent signals (external dispatch, parallel detached, cross-AI handback, agent delegation, cross-repo) and loads only the references that match. The default dispatch is `opencode run --model opencode-go/deepseek-v4-pro --variant high --format json --dir <repo-root>`. A three-layer guard refuses self-invocation unless the request is an explicit parallel detached session.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-opencode dispatches to OpenCode and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v opencode
```

If nothing prints, install with `brew install opencode` (macOS) or `curl -fsSL https://opencode.ai/install | bash`.

**Step 2: Run the provider auth pre-flight.**

```bash
opencode providers list
```

Expected when configured: a table of providers with status and default indicators. If `opencode-go` is missing, the skill asks before falling back rather than substituting a model you did not approve.

**Step 3: Run the default dispatch.**

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "Search memory context and return the top findings." \
  </dev/null
```

You get structured JSON events streamed to stdout as the session runs, ending with a final tool-result message. The `</dev/null` is mandatory on non-interactive runs, and you omit `--agent` from every dispatch.

**Step 4: Spawn a parallel detached session (inside OpenCode only).**

```bash
opencode run --share --port 4096 \
  --model opencode-go/deepseek-v4-pro --variant high --format json --dir "$REPO_ROOT" \
  "Run a parallel research branch for the approved spec folder." \
  </dev/null &
```

The session runs in a separate state directory under `~/.opencode/state/<session_id>/`, and `--share` publishes a browser-accessible URL.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt, passes it through the smart router to load matching references, then dispatches `opencode run` with an explicit model, variant, format and directory. OpenCode starts a session that loads every plugin in `opencode.json`, every skill under `.opencode/skills/`, every MCP server and the Spec Kit Memory database. The calling AI parses the JSON event stream incrementally, validates the output and integrates it. The whole round-trip is non-interactive: send the prompt, get the response, exit.

### The Full-Runtime Difference

This is what sets cli-opencode apart from every sibling in the cli-* family. A sibling dispatch sends a raw model behind a thin CLI wrapper, with no plugins, no skills, no MCP tools and no memory database. `opencode run` loads the project wholesale. One command gives the dispatched session access to Spec Kit Memory's tool set, the code graph for structural queries, the skill advisor, sequential thinking and every project-specific plugin. That is the reason you reach for this skill when the task needs project context rather than a model alone.

### The Two Non-Obvious Rules

Two `opencode run` defaults punish operators who learn them the hard way.

**Rule 1: never pass a top-level `--agent`.** Current OpenCode treats named agents like `general` as subagents and rejects them at the top level, so `--agent general` fails the dispatch outright. When no `--agent` is given, the default agent runs, which is what you want for nearly every dispatch. State any agent-profile request in the prompt body, for example "Act as a code-review agent: ...".

**Rule 2: append `</dev/null` to every non-interactive run.** Without closed stdin, `opencode run` hangs at zero percent CPU after the snapshot-cleanup line. A foreground `| tail` happens to bypass this because the upstream pipe stage provides closed stdin, but `> stdout.log 2> stderr.log` does not. Position `</dev/null` after the prompt argument, before the redirects.

### The Self-Invocation Guard

If the agent reading this skill is already inside OpenCode, the skill refuses to load. The guard checks three layers in order:

1. The `$OPENCODE_CONFIG_DIR` env var and any `OPENCODE_*`-prefixed vars, which OpenCode sets on session start.
2. Process ancestry, where an `opencode` parent in the tree trips the guard.
3. Lock files under `~/.opencode/state/<id>/lock`, which signal an active session.

The one exception is an explicit parallel detached request. When the prompt contains "parallel detached", "ablation suite", "worker farm" or "spawn detached", the guard allows the dispatch through because it spawns a separate session id and state directory, not a self-dispatch.

### Provider Auth Pre-Flight

Before the first dispatch in a session the skill runs `opencode providers list`. Seven providers are documented: `opencode-go` (default gateway), `deepseek` (direct API), `minimax-coding-plan` (MiniMax Token Plan, the default MiniMax path), `minimax` (MiniMax Direct API), `xiaomi-token-plan-ams` (Xiaomi Token Plan Europe), `xiaomi` (Xiaomi Direct API) and `openai` (paid premium). If the default `opencode-go` is missing the skill asks before falling back, and it never substitutes a model you did not approve.

### Agent Delegation

OpenCode distinguishes primary agents (directly invokable, like `plan`, `orchestrate` and `ai-council`) from subagents (`context`, `review`, `write`, `debug`, plus the command-owned loop executors). Never pass a top-level `--agent general`. Route generic subagents through `--agent orchestrate`, and let the loop executors stay owned by their parent commands. The full roster lives in `references/agent_delegation.md`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-opencode when a task needs the project's full runtime (the memory database, the code graph, every plugin, skill and MCP tool), when you want a parallel detached session for ablation or worker-farm work, or when a non-Anthropic CLI needs OpenCode as a bridge to a project subsystem like spec-kit, memory or code-graph. Skip it for simple tasks the caller can answer directly, for raw model dispatch where a sibling cli-* is leaner and for the interactive OpenCode TUI.

### Sibling Boundaries

The cli-X skills each dispatch to a different provider and never overlap.

| Skill | Provider | When to reach for it |
|---|---|---|
| `cli-opencode` | OpenCode | Full project runtime, parallel detached sessions, cross-AI handback |
| `cli-claude-code` | Anthropic | Deep reasoning, diff-based edits, `--json-schema` output, agent delegation |
| `cli-codex` | OpenAI | Sandboxed coding, repo analysis, PR review, live web research |
| `cli-devin` | Cognition | Autonomous coding with SWE-1.6 and local-to-cloud handoff |

If you are already inside one runtime, the matching cli-X skill refuses to load. Use a different runtime or exit first.

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns spec folders, memory and continuity. The Memory Handback bridges an OpenCode dispatch back into the caller's spec folder. |
| `sk-code` | Owns code standards and verification. cli-opencode dispatches the work, sk-code governs the quality of what comes back. |
| `mcp-code-mode` | Orchestrates external MCP tool calls. The dispatched OpenCode session has MCP tools loaded natively. |
| `sk-prompt-small-model` | Owns per-model prompt-craft profiles. Consult it before composing a prompt for a profiled model. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: opencode` | CLI not installed or PATH not updated | `brew install opencode` or `curl -fsSL https://opencode.ai/install \| bash`, then restart your terminal |
| Dispatch hangs at 0% CPU after the snapshot line | Missing `</dev/null` on a non-interactive run | Append `</dev/null` before any `> stdout.log 2> stderr.log` redirect |
| `--agent general` fails or warns | Current OpenCode rejects named agents at the top level | Omit `--agent`. State the agent profile in the prompt body. |
| `provider/model not found` or `401 Unauthorized` | The default `opencode-go` is not configured on this machine | Run `opencode providers list`, then `opencode providers login <provider>` for the missing one |
| Empty event stream | Output format defaulted to formatted instead of JSON | Force `--format json` |
| `Self-invocation refused` | The caller is already inside OpenCode (`OPENCODE_*` env, `opencode` ancestry or a state lock) | Use a different runtime, exit the current session or restate with explicit parallel-detached keywords |
| Unknown `--share` or `--variant` flag | Binary older than the documented baseline | Run `opencode --version` and `opencode run --help`, then upgrade |
| Context too large or truncated | The prompt references broad paths instead of specific files | Split large tasks and use `--file` for attachments |

---

## 7. FAQ

**Q: What does the full-runtime dispatch buy over a sibling cli-* skill?**

A: A sibling cli-* skill dispatches to a single provider's binary. cli-opencode dispatches into a session that loads every plugin, skill, MCP server and the Spec Kit Memory database for the project. When the task needs the code graph, memory search or a project-specific plugin, only cli-opencode provides all of them in one shot. When it only needs a model, a sibling is leaner.

**Q: When do I need a parallel detached session?**

A: When you are inside OpenCode and want a second session with its own state and session id. Common patterns are an ablation suite across sessions, a worker farm for parallel research and a `--share` URL for browser inspection. The prompt must contain explicit parallel-session keywords or the self-invocation guard blocks the dispatch.

**Q: Why no top-level `--agent`?**

A: Current OpenCode treats named agents like `general` as subagents and rejects them at the top level, so the dispatch fails outright. The default agent already covers the general case. For a specific profile, describe the role in the prompt body.

**Q: Why does a non-interactive dispatch hang without `</dev/null`?**

A: OpenCode reads stdin at startup before session creation. When stdout and stderr are redirected to files, stdin stays open and the process waits forever. Appending `</dev/null` provides an immediate EOF so the dispatch continues.

**Q: Which model do I pick?**

A: Default to `opencode-go/deepseek-v4-pro --variant high`. OpenCode Go routes through a single gateway and gives elevated reasoning at low cost. Switch to `deepseek/deepseek-v4-pro` for the direct DeepSeek API, `minimax-coding-plan/MiniMax-M3` for the MiniMax Token Plan or `xiaomi-token-plan-ams/mimo-v2.5-pro --variant high` for MiMo through the Xiaomi Token Plan. Use `openai/gpt-5.5` for paid premium dispatches.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios grouped by category: CLI invocation, external dispatch, multi-provider routing, agent routing, session continuity, integration patterns, prompt templates, parallel detached sessions and cross-repo or cross-server dispatch.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-opencode/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` |
| Default dispatch | `opencode run --model opencode-go/deepseek-v4-pro --variant high --format json --dir . "Say hello" </dev/null` returns a JSON event stream ending with a tool-result message |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI subcommands, flags, models, auth and version drift handling |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | The three use cases, the self-invocation guard and the silent-stdin trap |
| [`references/opencode_tools.md`](./references/opencode_tools.md) | Unique value versus sibling cli-* skills |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | Agent roster, primary versus subagent routing and leaf-agent constraints |
| [`references/destructive_scope_violations.md`](./references/destructive_scope_violations.md) | The RM-8 incident and the four-layer prevention playbook |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | Executor-specific model overrides and the CLEAR check |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste prompt templates for each use case and agent |
