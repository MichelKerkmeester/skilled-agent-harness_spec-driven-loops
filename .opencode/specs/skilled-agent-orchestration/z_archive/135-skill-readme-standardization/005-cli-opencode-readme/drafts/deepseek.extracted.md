---
title: cli-opencode
description: OpenCode CLI orchestrator that dispatches tasks into the full plugin, skill, MCP and Spec Kit Memory runtime in one shot, plus parallel detached sessions and cross-AI handback.
trigger_phrases:
  - "opencode run"
  - "delegate to opencode"
  - "full plugin runtime"
  - "parallel detached"
  - "cross-ai handback"
  - "share url"
  - "ablation suite"
  - "worker farm"
  - "memory search"
  - "session bootstrap"
---

# cli-opencode

> Dispatch a task from any external AI runtime into OpenCode's full project runtime in one shot, or spawn a parallel detached session for ablation, worker farms and cross-AI handback.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | One-shot dispatch into OpenCode's full plugin, skill, MCP and Spec Kit Memory runtime, parallel detached sessions and cross-AI handback from non-Anthropic CLIs |
| **Invoke with** | "delegate to opencode", "opencode run", "parallel detached", "cross-ai handback" or auto-routing on OpenCode keywords |
| **Works on** | Any external runtime (Claude Code, Codex, Gemini, Copilot, raw shell) and from inside OpenCode for parallel detached workers |
| **Produces** | Structured JSON event streams, code changes with full project context, parallel research sessions and cross-AI spec-kit handback results |

---

## 2. OVERVIEW

### Why This Skill Exists

An external AI runtime (Claude Code, Codex, Copilot, Gemini) that needs the project's memory database, code graph and every plugin has no native way to load them. It would hand-build an `opencode run` invocation, guess at flags and hit the non-obvious traps: a silent stdin hang on redirect, a top-level `--agent` that gets rejected. If the caller is itself OpenCode, a self-dispatch loops and burns tokens. The skill standardizes the dispatch across three use cases, runs an auth pre-flight and refuses self-invocation.

### What It Does

cli-opencode is the single routing point for external runtimes that need an OpenCode dispatch. A smart router scores the prompt against intent signals (external dispatch, parallel detached, cross-AI handback, agent delegation, cross-repo) and loads only the references that match. The default dispatch is `opencode run --model opencode-go/deepseek-v4-pro --variant high --format json --dir <repo-root>`. A three-layer guard refuses self-invocation unless the request is an explicit parallel detached session. It does not write application code or manage spec folders. `sk-code` owns code standards and tests, and `system-spec-kit` owns spec folders, memory and continuity.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v opencode
```

If nothing prints, install with `brew install opencode` (macOS) or `curl -fsSL https://opencode.ai/install | bash`.

**Step 2: Run the auth pre-flight.**

```bash
opencode providers list
```

Expected when configured: a table of providers with status and default indicators. If `opencode-go` is missing, the skill asks before falling back.

**Step 3: Run the default dispatch.**

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "Spec folder: <path> (pre-approved, skip Gate 3). Search memory context and return the top findings." \
  2>&1
```

You get structured JSON events streamed to stdout as the session runs, ending with a final tool-result message. Omit `--agent` from every dispatch. State any agent-profile request in the prompt body instead.

**Step 4: Spawn a parallel detached session (inside OpenCode only).**

```bash
opencode run --share --port 4096 \
  --model opencode-go/deepseek-v4-pro \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "Run iteration 3 of the research loop for the approved spec folder." \
  2>&1 </dev/null &
```

The session runs in a separate state directory under `~/.opencode/state/<session_id>/`. The `--share` flag publishes a browser-accessible URL. Always append `</dev/null` on non-interactive dispatches.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt, passes it through the smart router to score intents and load matching references, then dispatches `opencode run` with an explicit model, variant, format and directory. OpenCode starts a session that loads every plugin in `opencode.json`, every skill under `.opencode/skills/`, every MCP server and the Spec Kit Memory database. The calling AI parses the JSON event stream incrementally, validates the output and integrates it. The whole round-trip is non-interactive: send the prompt, get the response, exit.

### The Full-Runtime Difference

This is what sets cli-opencode apart from every sibling in the cli-* family. A sibling dispatch sends a raw model behind a thin CLI wrapper: no plugins, no skills, no MCP tools, no memory database. `opencode run` loads the project wholesale. One command gives the dispatched session access to Spec Kit Memory's 37 tools, the code graph for structural queries, the skill advisor, sequential thinking and every project-specific plugin. That is the reason you reach for this skill when the task needs project context.

### The Two Non-Obvious Rules

Two `opencode run` defaults punish operators who learn them the hard way.

**Rule 1: never pass a top-level `--agent`.** Current opencode treats named agents like `general` as subagents and rejects them at the top level. `--agent general` fails the dispatch outright. When no `--agent` is given, the default agent runs, which is what you want for nearly every dispatch. State any agent-profile request in the prompt body (for example, "Act as a code-review agent: …").

**Rule 2: append `</dev/null>` to every non-interactive run.** Without closed stdin, `opencode run` hangs at 0% CPU after the snapshot cleanup line. A foreground `| tail` happens to bypass this because the upstream pipe stage provides closed stdin, but `> stdout.log 2> stderr.log` does not. Append `</dev/null` before the redirects and the dispatch unblocks.

### The Self-Invocation Guard

If the agent reading this skill is already inside OpenCode, the skill refuses to load. The guard checks three layers in order:

1. Any `OPENCODE_*` env var, which OpenCode sets on session start.
2. Process ancestry, where an `opencode` parent in the tree trips the guard.
3. Lock files under `~/.opencode/state/<id>/lock`, which signal an active session.

The one exception is an explicit parallel detached request. When the prompt contains "parallel detached", "ablation suite", "worker farm", "parallel research" or "share URL", the guard allows the dispatch through because it spawns a separate session id and state directory, not a self-dispatch.

### Provider Auth Pre-Flight

Before the first dispatch in a session the skill runs `opencode providers list`. Seven providers are documented: `opencode-go` (default gateway), `deepseek` (direct API), `minimax-coding-plan` (MiniMax Token Plan, default MiniMax path), `minimax` (MiniMax Direct API), `xiaomi-token-plan-ams` (Xiaomi Token Plan Europe), `xiaomi` (Xiaomi Direct API) and `openai` (paid premium). If the default `opencode-go` is missing the skill asks before falling back. It never substitutes a model you did not approve.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-opencode when a task needs the full project runtime (plugins, skills, MCP, memory), when you want a parallel detached session for ablation or worker farms, or when a non-Anthropic CLI needs spec-kit workflows that only OpenCode can load. Reach for it too when you want to dispatch deep-research or deep-review loops through their parent commands. Skip it for simple tasks the caller can answer directly, for raw model dispatch (a sibling cli-* is leaner) and for the interactive OpenCode TUI.

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
| `sk-prompt-models` | Owns per-model prompt-craft profiles. Consult it before composing a prompt for a profiled small model. |
| `mcp-code-mode` | Provides external MCP tool access from within the dispatched session. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: opencode` | CLI not installed or PATH not updated | `brew install opencode` (macOS) or `curl -fsSL https://opencode.ai/install \| bash`, then restart your terminal |
| `provider/model not found` or `401 Unauthorized` | Provider not configured or credentials expired | Run `opencode providers list`, then `opencode providers login <provider>` for the missing one |
| Dispatch hangs at 0% CPU after snapshot line | Missing `</dev/null` on a non-interactive run | Append `</dev/null` before any `> stdout.log 2> stderr.log` redirect |
| `Self-invocation refused` | Caller is already inside OpenCode (`OPENCODE_*` env, `opencode` ancestry or a state lock) | Use a different runtime, exit the current OpenCode session or restate with explicit parallel-detached keywords |
| `--agent general` fails or warns | Current opencode rejects named agents at the top level | Omit `--agent`. State the agent profile in the prompt body. |
| Empty event stream | Output format defaulted to formatted instead of JSON | Force `--format json` |
| `unknown option --share` or `--variant` | Binary older than the v1.3.17 baseline | Run `opencode --version` and `opencode run --help`. Upgrade or use closest analogue flags. |
| Context too large or truncated | Prompt references broad paths instead of specific files | Split large tasks and use `--file` for file attachments |

---

## 7. FAQ

**Q: Why use cli-opencode instead of a sibling cli-* skill?**

A: The sibling skills dispatch a raw model. cli-opencode loads the project's full runtime: every plugin, every skill, every MCP tool and the Spec Kit Memory database. You get 37 memory tools, the code graph, the skill advisor and sequential thinking in one dispatch. When the task needs project context, use cli-opencode. When it only needs a model, a sibling is leaner.

**Q: When do I need a parallel detached session?**

A: When you are inside OpenCode and want a second session with its own state and session id. Common patterns: running an ablation suite across multiple sessions, spawning a worker farm for parallel research or generating a `--share` URL for browser inspection. The detached session leaves your current session untouched.

**Q: Why no top-level `--agent`?**

A: Current opencode treats named agents like `general` as subagents and rejects them at the top level. The dispatch fails outright. When no `--agent` is given, the default agent runs, which covers nearly every use case. For a specific agent profile, describe the role in the prompt body.

**Q: Why does a non-interactive dispatch hang without `</dev/null`?**

A: opencode reads stdin at startup before session creation. When stdout and stderr are redirected to files, stdin stays open and the process waits forever. Appending `</dev/null` provides an immediate EOF so the dispatch continues.

**Q: Which model do I pick?**

A: Default to `opencode-go/deepseek-v4-pro --variant high`. OpenCode Go routes through a single gateway and gives elevated reasoning at low cost. Switch to `deepseek/deepseek-v4-pro` for the direct DeepSeek API, `minimax-coding-plan/MiniMax-M3` for the MiniMax Token Plan or `xiaomi-token-plan-ams/mimo-v2.5-pro --variant high` for MiMo through the Xiaomi Token Plan. Use `openai/gpt-5.5-pro` for paid premium dispatches.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios grouped by category: CLI invocation, external dispatch, multi-provider routing, agent delegation, session continuity, integration patterns, prompt templates, parallel detached sessions and cross-repo dispatch.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-opencode/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` |
| Default dispatch | `opencode run --model opencode-go/deepseek-v4-pro --variant high --format json --dir . "Say hello" 2>&1` returns a JSON event stream ending with a tool-result message |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI subcommands, flags, models, auth and version drift |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Three use cases, decision tree, self-invocation guard and the silent-stdin trap |
| [`references/opencode_tools.md`](./references/opencode_tools.md) | Unique capabilities and cross-CLI comparison |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | Agent roster, routing matrix and leaf-agent constraints |
| [`references/destructive_scope_violations.md`](./references/destructive_scope_violations.md) | The RM-8 incident and four-layer prevention playbook |
| [`references/context-budget.md`](./references/context-budget.md) | Token budget guidance per model and variant |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | Framework selection, CLEAR 5-check and per-model overrides |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste templates for every use case, agent and handback pattern |
