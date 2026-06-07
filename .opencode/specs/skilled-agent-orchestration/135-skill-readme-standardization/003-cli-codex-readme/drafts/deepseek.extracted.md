---
title: "cli-codex"
description: "Cross-AI dispatcher that lets an external AI assistant delegate a task to OpenAI's Codex CLI for sandboxed coding, repo analysis, diff-aware code review, live web research and agent delegation."
trigger_phrases:
  - "codex"
  - "codex cli"
  - "openai"
  - "web search"
  - "code review"
  - "second opinion"
  - "cross-validate"
---

# cli-codex

> Dispatch a task to OpenAI's `codex` CLI and get back sandboxed code generation, diff-aware review or live web research, with auth, sandbox and model handled for you.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Code generation, code review, web research, architecture analysis and agent delegation through OpenAI's `codex` CLI |
| **Invoke with** | "codex", "code review", "web search", "second opinion" or auto-routing on OpenAI keywords |
| **Works on** | Any external runtime that needs to reach the `codex` binary without hand-building CLI invocations |
| **Produces** | File edits in a sandbox, diff-aware review reports, live web research, architecture analysis and profile-routed agent output |

---

## 2. OVERVIEW

### Why This Skill Exists

An assistant working alone cannot browse the live web mid-task. It has no diff-aware review subcommand and no sandbox to isolate file operations. To reach Codex it must hand-build `codex exec` with the right model, reasoning effort, service tier and sandbox. One wrong flag and the task silently fails. The worst trap: `codex exec` defaults to a read-only sandbox, so edit tasks produce plans and no files. This skill standardizes the dispatch, runs an auth pre-flight and refuses self-invocation. The caller never builds its own CLI wrapper.

### What It Does

cli-codex is the single routing point for external runtimes that need OpenAI's Codex CLI. A smart router scores the task against intent signals (code generation, review, research, architecture, agent delegation) and loads only the references that match. A self-invocation guard checks three detection layers and refuses to load if the caller is already inside Codex. The default dispatch is `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write`, and reasoning effort scales up for harder problems.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-codex dispatches to Codex and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v codex
```

If nothing prints, install it with `npm install -g @openai/codex`.

**Step 2: Check your auth.**

```bash
[ -n "$OPENAI_API_KEY" ] && echo "API key set" || echo "No API key"
codex login status 2>&1
```

You need either `OPENAI_API_KEY` in the environment or a ChatGPT OAuth session from `codex login`. The skill surfaces a prompt if both are missing.

**Step 3: Run the default dispatch.**

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  "Add input validation to src/utils.ts" \
  2>&1
```

You get the file edited in place inside your workspace, with a cost summary line at the end. For a read-only task like review or research, swap the sandbox to `read-only`.

**Step 4: Raise reasoning effort for a hard problem.**

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  "Analyze the trade-offs between the current caching layer and a Redis replacement" \
  2>&1
```

You get an analysis that weighs alternatives before it commits to a recommendation.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt and passes it to `codex exec` with the right model, sandbox and service tier. Codex processes the task with its built-in tools and returns the result. The caller validates the output and integrates it. The whole round-trip is non-interactive: send the prompt, get the response, exit.

### The Two Silent Traps

Two `codex exec` defaults punish operators who do not know them. The README states them up front because the skill catches them, but a reader who learns them here never hits them.

**Trap 1: The read-only default sandbox.** `codex exec` without an explicit `--sandbox` flag runs in `read-only` mode with auto-approve. A task that asks for file edits reads the code, plans the changes and returns a confident summary. No files change. Zero warnings. Always pass `--sandbox workspace-write` for edit tasks, or use `--full-auto` which combines workspace-write sandbox with `on-request` approval. Read-only tasks (review, research, architecture exploration) are fine with the default.

**Trap 2: The silent service-tier fallback.** Without `-c service_tier="fast"`, Codex falls back to whatever the user's `~/.codex/config.toml` sets as default. Cross-AI dispatches need the fast tier, and relying on per-machine config makes the invocation non-reproducible. Pass `-c service_tier="fast"` explicitly every time.

### The Self-Invocation Guard

If the agent reading this skill is itself running inside Codex, the skill refuses to load. The guard checks three layers in order:

1. The `$CODEX_SESSION_ID` env var and any `CODEX_*` env vars, which Codex sets on session start.
2. Process ancestry, where a `codex` parent in the tree trips the guard.
3. Lock files under `~/.codex/state/<id>/lock`, which signal an active session.

When any layer matches, the skill returns a refusal and loads nothing. The cli-X family exists for cross-AI delegation. A running CLI skill never dispatches itself.

### Profile Routing

Route to a specialized profile with `-p <profile>`. Profiles live in `.codex/config.toml` under `[profiles.<name>]` and shape how Codex processes the task. SKILL.md documents six:

| Profile | Task | Pair with |
|---|---|---|
| `review` | Code review and security audit | `--sandbox read-only` |
| `context` | Architecture exploration and codebase mapping | `--sandbox read-only` |
| `research` | Technical research | `--search` |
| `write` | Documentation generation | `--sandbox workspace-write` |
| `debug` | Fresh-perspective debugging | `--sandbox workspace-write` |
| `ai-council` | Multi-strategy planning | `--sandbox read-only` |

The built-in `codex exec review` subcommand does git-diff review directly: `codex exec review "Focus on security" --commit HEAD`.

### Auth Pre-Flight And Memory Handback

Before the first dispatch the skill checks whether `OPENAI_API_KEY` is set or ChatGPT OAuth is configured. If the key is missing but OAuth exists, it asks before substituting. If neither is configured, it surfaces the login commands and waits. The two options are `export OPENAI_API_KEY=sk-...` and `codex login`. When the caller needs to keep a Codex session's context, a 7-step Memory Handback extracts it and persists it through `generate-context.js` (full procedure in `system-spec-kit/references/cli/memory_handback.md`).

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-codex when a task needs sandboxed file edits, live web search, diff-aware code review or profile-routed agent delegation through Codex. Reach for it too when you want a second-model opinion on code quality or architecture. Skip it for simple tasks the caller can answer directly, for interactive terminal work (use `codex` directly) and when the caller is already inside Codex (the self-invocation guard refuses).

### Sibling Boundaries

The cli-X skills each dispatch to a different provider and never overlap.

| Skill | Provider | When to reach for it |
|---|---|---|
| `cli-codex` | OpenAI | Sandboxed coding, repo analysis, PR review, web research |
| `cli-claude-code` | Anthropic | Deep reasoning, diff-based edits, `--json-schema` output, agent delegation |
| `cli-opencode` | OpenCode | Full OpenCode runtime dispatch, in-OpenCode parallel sessions |
| `cli-devin` | Cognition | Autonomous coding via Devin for Terminal |

If you are already inside one runtime, the matching cli-X skill refuses to load. Use a different runtime or exit first.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns code standards and verification. cli-codex dispatches the work, sk-code governs the quality of what comes back. |
| `system-spec-kit` | Owns spec folders, memory and continuity. The Memory Handback bridges a Codex session back into the caller's spec folder. |
| `sk-prompt-small-model` | Owns per-model prompt-craft profiles. Consult it before composing a prompt for a profiled model. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: codex` | CLI not installed or PATH not updated | `npm install -g @openai/codex`, then restart your terminal |
| `401 Unauthorized` or `not authenticated` | `OPENAI_API_KEY` not set or expired, or OAuth invalid | `export OPENAI_API_KEY=sk-...` or `codex login` |
| Task ran but no files changed | `codex exec` defaulted to read-only sandbox (silent no-op on edits) | Add `--sandbox workspace-write` or `--full-auto` |
| Agent asks for spec folder or approval mid-task | Non-interactive `exec` cannot answer prompts | Include `(pre-approved, skip Gate 3)` in the prompt and use `--full-auto` |
| `Self-invocation refused` | The caller is already inside Codex (`$CODEX_SESSION_ID` set, `codex` ancestry or a state lock) | Use a different runtime or exit the current Codex session first |
| "Context too large" or truncated output | The prompt references broad paths instead of specific files | Name files with `@./path/to/file` and split large tasks |
| `unknown option: --reasoning` or `--quiet` | These flags do not exist on `codex exec` | Use `-c model_reasoning_effort="high"` for reasoning effort. There is no quiet flag. |
| No startup context or advisor brief | Native hooks not enabled | Set `[features].codex_hooks = true` and verify `~/.codex/hooks.json` |

---

## 7. FAQ

**Q: Why not just call `codex exec` directly from my shell?**

A: You can. This skill exists for when an external AI assistant (Gemini, Copilot, Devin) needs to dispatch to Codex programmatically. It handles model selection, sandbox mapping, auth pre-flight and the self-invocation guard so the calling AI does not have to.

**Q: What reasoning effort do I pick?**

A: Default to `medium`, which balances speed and depth for most tasks. Raise to `high` for architecture trade-offs, security audits or complex planning. Raise to `xhigh` for the hardest problems. Drop to `low` or `minimal` for trivial lookups.

**Q: The task ran but nothing changed. What happened?**

A: You hit the read-only default sandbox trap. `codex exec` without `--sandbox` defaults to read-only. Codex read your files, planned the changes and reported success, but never wrote a byte. Add `--sandbox workspace-write` or `--full-auto` for any task that edits files.

**Q: Why must I pass `-c service_tier="fast"` every time?**

A: Without it, Codex falls back to whatever your `~/.codex/config.toml` sets as default. Explicit means reproducible: the fast tier routes through a dedicated path, and anyone running the command gets the same behaviour regardless of their local config.

**Q: What flags do not exist on `codex exec`?**

A: `--reasoning`, `--reasoning-effort` and `--quiet` do not exist. Use `-c model_reasoning_effort="medium"` for reasoning effort. There is no quiet flag. Capture stdout with `-o file.txt` when you need the last message to a file.

**Q: `codex exec review` versus a read-only review prompt. Which do I use?**

A: `codex exec review --commit HEAD` runs the built-in diff-aware review subcommand. It sees line-level changes in the commit, which catches things a plain read-only prompt cannot. Use the built-in subcommand for commit review. Use a read-only prompt for reviewing arbitrary files or patterns.

**Q: When do I use cli-codex over cli-claude-code or cli-devin?**

A: Reach for cli-codex when the task needs sandboxed code edits, live web search, diff-aware review or profile routing through Codex. Reach for cli-claude-code when the task needs deep extended thinking or `--json-schema` output. Reach for cli-devin when the task is a large autonomous coding run.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI subcommands, flags, sandbox modes and config reference |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Cross-AI orchestration patterns and workflows |
| [`references/codex_tools.md`](./references/codex_tools.md) | Built-in capabilities: `/review`, `--search`, MCP and sessions |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | Profile roster, routing table and invocation patterns |
| [`references/hook_contract.md`](./references/hook_contract.md) | Native hook contract and Spec Kit Memory startup wiring |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | Fast-path prompt discipline and the CLEAR check |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste prompt templates for common task types |
