---
title: cli-claude-code
description: Cross-AI dispatcher that lets a non-Claude runtime delegate a task to Anthropic's Claude Code CLI for deep reasoning, surgical code edits, structured output and agent delegation.
trigger_phrases:
  - "claude code"
  - "claude cli"
  - "delegate to claude"
  - "extended thinking"
  - "deep reasoning"
  - "anthropic"
version: 1.1.0.20
---

# cli-claude-code

> Dispatch a task to Anthropic's `claude` CLI and get back deep reasoning, surgical edits or schema-validated output, without leaving your current runtime.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Deep reasoning, code edits, structured JSON, code review and agent delegation through Anthropic's `claude` CLI |
| **Invoke with** | "claude code", "delegate to claude", "extended thinking" or auto-routing on Anthropic keywords |
| **Works on** | Any external runtime (OpenCode, Copilot, raw shell) that needs to reach the `claude` binary |
| **Produces** | Text or JSON responses, diff-based edits, schema-validated output and agent-delegated analysis |

---

## 2. OVERVIEW

### Why This Skill Exists

A non-Claude assistant has no built-in way to reach the `claude` binary. When a task wants Anthropic-model strengths, like extended-thinking analysis, diff-based edits or `--json-schema` output, the caller either hand-builds fragile `claude -p` invocations and picks flags by trial, or skips the capability. Auth handling, model selection and permission modes all become guesswork. Worse, if the calling assistant is itself Claude Code, a circular self-dispatch burns tokens for no value. This skill standardizes the dispatch, runs an auth pre-flight and guards against self-invocation, so the caller never builds its own CLI wrapper.

### What It Does

cli-claude-code is the single routing point for external runtimes that need Claude Code. A smart router scores the task against intent signals (deep reasoning, code editing, structured output, review, agent delegation) and loads only the references that match. A self-invocation guard checks three layers and refuses to load if the caller is already inside Claude Code. The default dispatch is `claude -p "<prompt>" --model claude-sonnet-4-6 --output-format text`, and deep-reasoning work overrides to `claude-opus-4-6 --effort high`.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-claude-code dispatches to Claude Code and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v claude
```

If nothing prints, install it with `npm install -g @anthropic-ai/claude-code`.

**Step 2: Run the default dispatch.**

```bash
claude -p "Explain the dependency injection in src/app.ts" \
  --model claude-sonnet-4-6 \
  --output-format text \
  2>&1
```

You get a plain-text explanation scoped to the file you named, ending with a cost summary line.

**Step 3: Reach for deep reasoning when the task earns it.**

```bash
claude -p "Analyze the trade-offs between microservices and a monolith for this project" \
  --model claude-opus-4-6 \
  --effort high \
  --output-format text \
  2>&1
```

You get an extended-thinking analysis that weighs alternatives before it commits.

**Step 4: Get schema-validated JSON for a pipeline.**

```bash
claude -p "Analyze src/utils.ts and return function signatures" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array"}}}' \
  --output-format json \
  2>&1
```

You get a JSON object that conforms to the schema you passed, ready to pipe downstream.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt and passes it to `claude -p` with the right model, permission mode and output format. Claude Code processes it with its built-in tools (Edit, Agent, Read, Bash) and returns the result. The caller validates the output and integrates it. The whole round-trip is non-interactive: send the prompt, get the response, exit.

### The Self-Invocation Guard

If the agent reading this skill is itself running inside Claude Code, the skill refuses to load. The guard checks three layers in order:

1. The `$CLAUDECODE` env var, which Claude Code sets on session start.
2. Process ancestry, where a `claude` parent in the tree trips the guard.
3. Lock files under `~/.claude/state/<id>/lock`, which signal an active session.

When any layer matches, the skill returns a refusal and loads nothing. The cli-X family exists for cross-AI delegation. A running CLI skill never dispatches itself.

### Agent Delegation

Route to a specialized agent with `--agent <name>`. In this repo, Claude Code agent definitions resolve from `.opencode/agents/<name>.md` and shape how Claude Code processes the task. The current roster includes:

| Agent | Purpose |
|---|---|
| `ai-council` | Multi-strategy planning with scoped council artifacts |
| `code` | Application-code implementation via `sk-code`; orchestrator-only |
| `context` | Codebase exploration and architecture mapping |
| `debug` | Systematic debugging and root-cause analysis |
| `deep-improvement` | Proposal-only deep-improvement candidate generation |
| `deep-research` | Single-iteration deep research execution |
| `deep-review` | Single-iteration deep review execution |
| `markdown` | Template-first markdown and documentation execution |
| `orchestrate` | Multi-agent coordination |
| `prompt-improver` | Dispatch-ready prompt package generation |
| `review` | Code review and security audit (pair with `--permission-mode plan`) |

Example: `claude -p "Review @src/auth.ts for security issues" --agent review --permission-mode plan --output-format text 2>&1`

### Auth Pre-Flight And Memory Handback

Before the first dispatch the skill checks whether `ANTHROPIC_API_KEY` is set or OAuth is configured. If the key is missing but OAuth exists, it asks before substituting. If neither is configured, it surfaces the login commands and waits. The three options are `export ANTHROPIC_API_KEY=sk-ant-...`, `claude auth login` (OAuth) and `claude setup-token` (CI/CD). When the caller needs to keep a Claude Code session's context, a 7-step Memory Handback extracts it and persists it through `generate-context.js` (full procedure in `system-spec-kit/references/cli/memory_handback.md`).

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-claude-code when a task benefits from extended thinking, surgical diff-based edits, schema-validated JSON or agent delegation through Claude Code's built-in agents. Reach for it too when you want a second-AI opinion on code quality or architecture. Skip it for simple tasks the caller can answer directly, for interactive terminal work (use `claude` directly) and for real-time web search (Claude Code has no `--search` flag, so use OpenCode).

### Sibling Boundaries

The cli-X skills each dispatch to a different provider and never overlap.

| Skill | Provider | When to reach for it |
|---|---|---|
| `cli-claude-code` | Anthropic | Deep reasoning, diff-based edits, `--json-schema` output, agent delegation |
| `cli-opencode` | OpenAI | Sandboxed coding, repo analysis, PR review, web research |
| `cli-opencode` | OpenCode | Full OpenCode runtime dispatch, in-OpenCode parallel sessions |

If you are already inside one runtime, the matching cli-X skill refuses to load. Use a different runtime or exit first.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns code standards and verification. cli-claude-code dispatches the work, sk-code governs the quality of what comes back. |
| `system-spec-kit` | Owns spec folders, memory and continuity. The Memory Handback bridges a Claude Code session back into the caller's spec folder. |
| `sk-prompt-models` | Owns per-model prompt-craft profiles. Consult it before composing a prompt for a profiled model. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: claude` | CLI not installed or PATH not updated | `npm install -g @anthropic-ai/claude-code`, then restart your terminal |
| `401 Unauthorized` | `ANTHROPIC_API_KEY` not set or expired, or OAuth invalid | `export ANTHROPIC_API_KEY=sk-ant-...` or `claude auth login` |
| `Self-invocation refused` | The caller is already inside Claude Code (`$CLAUDECODE` set, `claude` ancestry or a state lock) | Use a different runtime or exit the current Claude Code session first |
| Session ends with a budget warning | The `--max-budget-usd` cap was too low for the task | Raise the cap or switch to Haiku for batch work |
| "Context too large" or truncated output | The prompt references broad paths instead of specific files | Name files with `@./path/to/file` and split large tasks |
| Output does not match the schema | No `--json-schema` passed, or the schema was malformed | Pass a valid `--json-schema '<schema>'` with `--output-format json` |

---

## 7. FAQ

**Q: Why not just call `claude` directly from my shell?**

A: You can. This skill exists for when an external AI assistant (OpenCode, Copilot) needs to dispatch to Claude Code programmatically. It handles model selection, permission modes, auth pre-flight and the self-invocation guard so the calling AI does not have to.

**Q: Sonnet or Opus?**

A: Default to `claude-sonnet-4-6`, which balances speed and cost for most tasks. Switch to `claude-opus-4-6` with `--effort high` when the task needs deep chain-of-thought reasoning, like architecture trade-offs, subtle bug root causes or multi-dimensional analysis.

**Q: When do I use `--permission-mode plan` versus the default?**

A: `plan` mode is read-only. Claude Code explores, analyzes and recommends but cannot write or execute. Use it for review, architecture exploration and audits. The default mode asks before each write. `bypassPermissions` auto-approves everything and needs explicit user consent first.

**Q: How does `--json-schema` guarantee output structure?**

A: You define a JSON schema and Claude Code validates its response against it before returning. If the output does not conform you get an error rather than malformed data, which makes Claude Code a reliable node in a data pipeline.

**Q: What happens if I dispatch to Claude Code from inside Claude Code?**

A: The self-invocation guard detects it (via `$CLAUDECODE`, process ancestry or lock files) and refuses to load. You get a message telling you to use a different runtime, and no tokens are spent on a circular dispatch.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios grouped by category: CLI invocation, permission modes, reasoning and models, agent routing and session continuity.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-claude-code/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md` |
| Behavior | Run the scenarios under `manual_testing_playbook/<NN>--<topic>/` in a live session with valid Anthropic auth |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI flags, commands, models and authentication |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Cross-AI orchestration patterns, where the external AI conducts and Claude Code executes |
| [`references/claude_tools.md`](./references/claude_tools.md) | Unique capabilities and a comparison with OpenCode |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | The agent roster, routing table and invocation patterns |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | Fast-path prompt discipline, the framework table and CLEAR check |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste prompt templates per task |
