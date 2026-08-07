---
title: cli-codex
description: Cross-AI dispatcher that delegates tasks to OpenAI's Codex CLI for sandboxed coding, repo analysis, PR review, live web research and a second-model opinion.
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

> Dispatch a task to OpenAI's `codex` CLI and get back sandboxed code generation, live web research or a diff-aware review, without leaving your current runtime.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Sandboxed coding, repo analysis, PR review, live web research and cross-model validation through OpenAI's `codex` CLI |
| **Invoke with** | "codex", "openai", "web search", "second opinion" or auto-routing on Codex keywords |
| **Works on** | Any external runtime (Gemini CLI, Claude Code, Copilot, raw shell) that needs to reach the `codex` binary |
| **Produces** | Code edits in a sandbox, text or structured responses, diff-aware reviews and web-enriched research |

---

## 2. OVERVIEW

### Why This Skill Exists

A non-Codex assistant has no built-in way to reach the `codex` binary. When a task wants OpenAI-model strengths, like sandboxed file edits, live web browsing mid-execution or the `/review` diff-aware workflow, the caller either hand-builds fragile `codex exec` invocations and picks flags by trial, or skips the capability. The worst trap: `codex exec` defaults to a read-only sandbox, so edit tasks fail silently. Auth handling, service-tier selection and reasoning effort all become guesswork. If the calling assistant is itself Codex, a circular self-dispatch burns tokens for no value. This skill standardizes the dispatch, runs an auth pre-flight and guards against self-invocation, so the caller never builds its own CLI wrapper.

### What It Does

cli-codex is the single routing point for external runtimes that need Codex CLI. A smart router scores the task against intent signals (code generation, review, web research, architecture exploration, agent delegation) and loads only the references that match. A self-invocation guard checks three layers and refuses to load if the caller is already inside Codex. The default dispatch is `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "<prompt>"`.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-codex dispatches to Codex CLI and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v codex
```

If nothing prints, install it with `npm i -g @openai/codex`.

**Step 2: Run the default dispatch.**

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  "Create a TypeScript utility that parses CSV files into JSON arrays"
```

You get code written into your workspace, scoped to the prompt you passed, ending with a cost summary line.

**Step 3: Reach for web research when the task needs live data.**

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  --search \
  --sandbox read-only \
  "What changed in the Express.js 5.x release? Search the web for current details."
```

You get a text response sourced from live web results, not a static training cutoff.

**Step 4: Run a diff-aware code review.**

```bash
codex exec review "Focus on security vulnerabilities" --commit HEAD --model gpt-5.5
```

You get a structured review of the latest commit's diff, scoped to the focus area you named.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt and passes it to `codex exec` with the right model, reasoning effort, service tier and sandbox mode. Codex processes it with its built-in tools (file read/write, shell, web search) and returns the result. The caller validates the output and integrates it. The whole round-trip is non-interactive: send the prompt, get the response, exit.

### The Two Traps

**Read-only default sandbox.** `codex exec` without an explicit `--sandbox` flag defaults to `read-only`. The agent reads code and plans changes but cannot write them. Edit tasks fail silently. Always pass `--sandbox workspace-write` (or `--full-auto`) when the task requires file edits.

**Explicit service tier.** Always pass `-c service_tier="fast"` when delegating from another AI. This routes the call through the fast tier instead of relying on whatever the caller's `~/.codex/config.toml` sets as default. Without it, the dispatch may silently fall back to a slower tier.

### The Self-Invocation Guard

If the agent reading this skill is itself running inside Codex, the skill refuses to load. The guard checks three layers in order:

1. The `$CODEX_SESSION_ID` env var and any `CODEX_*`-prefixed vars, which Codex sets on session start.
2. Process ancestry, where a `codex` parent in the tree trips the guard.
3. Lock files under `~/.codex/state/<id>/lock`, which signal an active session.

When any layer matches, the skill returns a refusal and loads nothing. The cli-X family exists for cross-AI delegation. A running CLI skill never dispatches itself.

### Reasoning Effort Levels

The model stays on `gpt-5.5` for every task. Only reasoning effort varies.

| Level | When to use it |
|---|---|
| `none` | Trivial lookups, no reasoning needed |
| `minimal` | Simple formatting or extraction |
| `low` | Straightforward code tasks |
| `medium` | The default. Balances speed and quality for most delegations |
| `high` | Architecture analysis, security audits, complex planning |
| `xhigh` | Maximum depth for the hardest problems |

Set via `-c model_reasoning_effort="<level>"`. There is no `--reasoning-effort` flag.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-codex when a task benefits from sandboxed file operations, live web search via `--search`, the `/review` diff-aware workflow or a second-AI opinion on code quality. Reach for it too when you want to offload generation to a sandboxed runtime while you keep conducting. Skip it for simple tasks the caller can answer directly, for interactive terminal work (use `codex` directly) and for deep extended-thinking analysis (use `cli-claude-code` instead).

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
| `sk-prompt-models` | Owns per-model prompt-craft profiles. Consult it before composing a prompt for a profiled model. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: codex` | CLI not installed or PATH not updated | `npm i -g @openai/codex`, then restart your terminal |
| `401 Unauthorized` or `not authenticated` | `OPENAI_API_KEY` not set or expired, or OAuth invalid | `export OPENAI_API_KEY=sk-...` or `codex login` |
| Task ran but no files changed | `codex exec` defaulted to read-only sandbox | Add `--sandbox workspace-write` or `--full-auto` |
| Agent asks for spec folder or approval | Non-interactive `exec` cannot answer prompts | Include `(pre-approved, skip Gate 3)` in the prompt and use `--full-auto` |
| `Self-invocation refused` | The caller is already inside Codex (`CODEX_*` env set, `codex` ancestry or a state lock) | Use a different runtime or exit the current Codex session first |
| Context too large or truncated output | The prompt references broad paths instead of specific files | Name files with `@./path/to/file` and split large tasks |
| `--reasoning-effort` flag not recognized | That flag does not exist | Use `-c model_reasoning_effort="<level>"` instead |

---

## 7. FAQ

**Q: Why not just call `codex` directly from my shell?**

A: You can. This skill exists for when an external AI assistant (Gemini, Claude Code, Copilot) needs to dispatch to Codex CLI programmatically. It handles model selection, sandbox mode, auth pre-flight and the self-invocation guard so the calling AI does not have to.

**Q: Why must I pass `-c service_tier="fast"` explicitly?**

A: Without it, the dispatch relies on whatever `~/.codex/config.toml` sets as default on the target machine. That may be a slower tier. Explicit means reproducible regardless of who runs it.

**Q: When do I use `--full-auto` versus `--sandbox workspace-write`?**

A: `--full-auto` combines `workspace-write` sandbox with `on-request` approval. It is the low-friction option for unattended orchestration. Use `--sandbox workspace-write` alone when you want the default `untrusted` approval mode (prompts before untrusted operations).

**Q: What is the difference between `/review` and a read-only review prompt?**

A: `codex exec review` is a built-in subcommand that operates on a git diff directly. A read-only review prompt (`--sandbox read-only`) asks Codex to analyze files you name but does not bind to a specific commit. Use `/review` for diff-aware work, the prompt approach for broader analysis.

**Q: When do I pick Codex over Claude Code for a second opinion?**

A: Codex gives you sandboxed file writes, live web search and the `/review` diff-aware workflow. Claude Code gives you extended-thinking analysis, `--json-schema` output and agent delegation through its built-in agents. Pick the one whose strengths match the task.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-codex/README.md --type readme` reports zero issues |
| CLI installed | `command -v codex` prints a path |
| Auth configured | `codex login status` reports logged in or `echo $OPENAI_API_KEY` prints a key |
| Default dispatch works | `codex exec "Say hello" --model gpt-5.5 -c service_tier="fast" --sandbox read-only` returns a greeting |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI subcommands, flags, sandbox modes and config reference |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Cross-AI orchestration patterns and workflows |
| [`references/codex_tools.md`](./references/codex_tools.md) | Built-in capabilities: `/review`, `--search`, MCP and session management |
| [`references/hook_contract.md`](./references/hook_contract.md) | Native hook contract and Spec Kit Memory startup wiring |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | Profile roster, routing table and invocation patterns |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | Fast-path prompt discipline and the CLEAR check |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste prompt templates for common tasks |
