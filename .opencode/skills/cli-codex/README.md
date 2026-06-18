---
title: cli-codex
description: Cross-AI dispatcher that delegates a task to OpenAI's Codex CLI for sandboxed coding, repo analysis, diff-aware PR review, live web research and a second-model opinion.
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
| **Works on** | Any external runtime (Claude Code, Copilot, raw shell) that needs to reach the `codex` binary |
| **Produces** | Code edits in a sandbox, text responses, diff-aware reviews and web-enriched research |

---

## 2. OVERVIEW

### Why This Skill Exists

A non-Codex assistant has no built-in way to reach the `codex` binary. When a task wants OpenAI-model strengths, like sandboxed file edits, live web browsing mid-execution or the diff-aware review workflow, the caller either hand-builds fragile `codex exec` invocations and picks flags by trial, or skips the capability. The worst trap: `codex exec` defaults to a read-only sandbox, so edit tasks fail silently. Auth handling, service-tier selection and reasoning effort all become guesswork. If the calling assistant is itself Codex, a circular self-dispatch burns tokens for no value. This skill standardizes the dispatch, runs an auth pre-flight and guards against self-invocation, so the caller never builds its own CLI wrapper.

### What It Does

cli-codex is the single routing point for external runtimes that need Codex CLI. A smart router scores the task against intent signals (code generation, review, web research, architecture exploration, agent delegation) and loads only the references that match. A self-invocation guard checks three layers and refuses to load if the caller is already inside Codex. The default dispatch is `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write`.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-codex dispatches to Codex and hands the result back to the caller.

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
  "Add input validation to src/utils.ts" \
  2>&1
```

You get the file edited in place inside your workspace, ending with a cost summary line. For a read-only task like review or research, swap the sandbox to `read-only`.

**Step 3: Reach for web research when the task needs live data.**

```bash
codex exec \
  --model gpt-5.5 \
  -c service_tier="fast" \
  --search \
  --sandbox read-only \
  "What changed in the Express.js 5.x release? Search the web for current details." \
  2>&1
```

You get a response sourced from live web results, not a static training cutoff.

**Step 4: Run a diff-aware code review.**

```bash
codex exec review "Focus on security vulnerabilities" --commit HEAD --model gpt-5.5
```

You get a structured review of the latest commit's diff, scoped to the focus area you named.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt and passes it to `codex exec` with the right model, reasoning effort, service tier and sandbox. Codex processes it with its built-in tools (file read/write, shell, web search) and returns the result. The caller validates the output and integrates it. The whole round-trip is non-interactive: send the prompt, get the response, exit.

### The Two Silent Traps

Two `codex exec` defaults punish operators who do not know them. A reader who learns them here never hits them.

**Trap 1: the read-only default sandbox.** `codex exec` without an explicit `--sandbox` runs in `read-only` with auto-approve. A task that asks for file edits reads the code, plans the changes and returns a confident summary. No files change, no warnings. Pass `--sandbox workspace-write` for edit tasks, or `--full-auto`, which combines workspace-write with `on-request` approval. Read-only tasks (review, research, exploration) are fine with the default.

**Trap 2: the silent service-tier fallback.** Without `-c service_tier="fast"`, Codex falls back to whatever the caller's `~/.codex/config.toml` sets as default, which may be a slower tier. Pass it explicitly every time so the dispatch is reproducible.

### The Self-Invocation Guard

If the agent reading this skill is itself running inside Codex, the skill refuses to load. The guard checks three layers in order:

1. The `$CODEX_SESSION_ID` env var and any `CODEX_*`-prefixed vars, which Codex sets on session start.
2. Process ancestry, where a `codex` parent in the tree trips the guard.
3. Lock files under `~/.codex/state/<id>/lock`, which signal an active session.

When any layer matches, the skill returns a refusal and loads nothing. The cli-X family exists for cross-AI delegation. A running CLI skill never dispatches itself.

### Agent Routing And Reasoning Effort

Route to a specialized Codex agent through the repo-local agent surface. `.codex/config.toml` declares `[agents.<name>]` entries whose `config_file` values point at `.codex/agents/<name>.toml`; the `.codex/agents/` directory holds the Codex-side agent files. The roster is larger than the old six-profile set.

| Agent | Task | Pair with |
|---|---|---|
| `code` | Application-code implementation | `--sandbox workspace-write` |
| `context` | Production context retrieval and codebase mapping | `--sandbox read-only` |
| `debug` | Fresh-perspective debugging | `--sandbox workspace-write` |
| `deep-context` | Deep context analysis | `--sandbox read-only` |
| `deep-improvement` | Proposal-only improvement candidates | `--sandbox read-only` |
| `deep-research` | Iterative technical research | `--search` |
| `deep-review` | Iterative code review | `--sandbox read-only` |
| `markdown` | Documentation execution | `--sandbox workspace-write` |
| `orchestrate` | Multi-agent coordination | `--sandbox read-only` |
| `prompt-improver` | Dispatch-ready prompt packages | `--sandbox read-only` |
| `review` | Code review and security audit | `--sandbox read-only` |
| `ai-council` | Multi-strategy planning | `--sandbox read-only` |

The model stays `gpt-5.5` for every task. Only reasoning effort changes, set with `-c model_reasoning_effort="<level>"` across `none`, `minimal`, `low`, `medium` (default), `high` and `xhigh`. There is no `--reasoning-effort` flag.

### Auth Pre-Flight And Memory Handback

Before the first dispatch the skill checks whether `OPENAI_API_KEY` is set or ChatGPT OAuth is configured. If the key is missing but OAuth exists, it asks before substituting. If neither is configured, it surfaces the login commands and waits. The two options are `export OPENAI_API_KEY=sk-...` and `codex login`. When the caller needs to keep a Codex session's context, a 7-step Memory Handback extracts it and persists it through `generate-context.js` (full procedure in `system-spec-kit/references/cli/memory_handback.md`).

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-codex when a task benefits from sandboxed file operations, live web search via `--search`, the diff-aware review subcommand or a second-AI opinion on code quality. Reach for it too when you want to offload generation to a sandboxed runtime while you keep conducting. Skip it for simple tasks the caller can answer directly, for interactive terminal work (use `codex` directly) and for deep extended-thinking analysis (use `cli-claude-code` instead).

### Sibling Boundaries

The cli-X skills each dispatch to a different provider and never overlap.

| Skill | Provider | When to reach for it |
|---|---|---|
| `cli-codex` | OpenAI | Sandboxed coding, repo analysis, PR review, web research |
| `cli-claude-code` | Anthropic | Deep reasoning, diff-based edits, `--json-schema` output, agent delegation |
| `cli-opencode` | OpenCode | Full OpenCode runtime dispatch, in-OpenCode parallel sessions |

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
| `command not found: codex` | CLI not installed or PATH not updated | `npm i -g @openai/codex`, then restart your terminal |
| `401 Unauthorized` or `not authenticated` | `OPENAI_API_KEY` not set or expired, or OAuth invalid | `export OPENAI_API_KEY=sk-...` or `codex login` |
| Task ran but no files changed | `codex exec` defaulted to the read-only sandbox | Add `--sandbox workspace-write` or `--full-auto` |
| Agent asks for spec folder or approval | Non-interactive `exec` cannot answer prompts | Include `(pre-approved, skip Gate 3)` in the prompt and use `--full-auto` |
| `Self-invocation refused` | The caller is already inside Codex (`CODEX_*` env set, `codex` ancestry or a state lock) | Use a different runtime or exit the current Codex session first |
| `unknown option: --reasoning` or `--quiet` | Those flags do not exist on `codex exec` | Use `-c model_reasoning_effort="high"`. There is no quiet flag. Capture output with `-o file.txt` |
| Context too large or truncated output | The prompt references broad paths instead of specific files | Name files with `@./path/to/file` and split large tasks |
| No startup context or advisor brief | Native hooks not enabled | Set `[features].codex_hooks = true` and verify `~/.codex/hooks.json` |

---

## 7. FAQ

**Q: Why not just call `codex exec` directly from my shell?**

A: You can. This skill exists for when an external AI assistant (Claude Code, Copilot) needs to dispatch to Codex programmatically. It handles model selection, sandbox mapping, auth pre-flight and the self-invocation guard so the calling AI does not have to.

**Q: What reasoning effort do I pick?**

A: Default to `medium`, which balances speed and depth for most tasks. Raise to `high` for architecture trade-offs, security audits or complex planning, and `xhigh` for the hardest problems. Drop to `low` or `minimal` for trivial lookups.

**Q: The task ran but nothing changed. What happened?**

A: You hit the read-only default sandbox trap. `codex exec` without `--sandbox` defaults to read-only. Codex read your files, planned the changes and reported success, but never wrote a byte. Add `--sandbox workspace-write` or `--full-auto` for any task that edits files.

**Q: `codex exec review` versus a read-only review prompt. Which do I use?**

A: `codex exec review --commit HEAD` runs the built-in diff-aware subcommand, which sees line-level changes in the commit and catches things a plain prompt cannot. Use it for commit review. Use a read-only prompt for reviewing arbitrary files or patterns.

**Q: When do I pick Codex over Claude Code?**

A: Reach for Codex when the task needs sandboxed edits, live web search or diff-aware review. Reach for cli-claude-code when it needs deep extended thinking or `--json-schema` output.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios grouped by category: CLI invocation, sandbox modes, reasoning effort, agent routing, session continuity, integration patterns, prompt templates and built-in tools.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-codex/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md` |
| Default dispatch | `codex exec "Say hello" --model gpt-5.5 -c service_tier="fast" --sandbox read-only` returns a greeting |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI subcommands, flags, sandbox modes and config reference |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Cross-AI orchestration patterns and workflows |
| [`references/codex_tools.md`](./references/codex_tools.md) | Built-in capabilities: the review subcommand, `--search`, MCP and sessions |
| [`references/hook_contract.md`](./references/hook_contract.md) | Native hook contract and Spec Kit Memory startup wiring |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | Profile roster, routing table and invocation patterns |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | Fast-path prompt discipline and the CLEAR check |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste prompt templates for common tasks |
