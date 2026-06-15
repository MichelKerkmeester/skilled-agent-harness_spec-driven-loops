---
title: cli-claude-code
description: Claude Code CLI executor for Anthropic-backed reasoning, edits, reviews and structured cross-AI handoff.
trigger_phrases:
  - "claude code"
  - "claude cli"
  - "delegate to claude"
  - "extended thinking"
  - "deep reasoning"
  - "anthropic"
---

# cli-claude-code

> Dispatch a task to Anthropic's `claude` CLI and get back deep reasoning, surgical edits or schema-validated output without leaving your current runtime.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Deep reasoning, code editing, structured JSON output, code review and agent delegation through Anthropic's Claude Code CLI |
| **Invoke with** | "claude code", "delegate to claude", "extended thinking" or auto-routing on Anthropic keywords |
| **Works on** | Any external AI runtime (Gemini CLI, Codex CLI, Copilot, raw shell) that needs to reach the `claude` binary |
| **Produces** | Text or JSON responses, diff-based code edits, schema-validated structured output and agent-delegated analysis |

---

## 2. OVERVIEW

### Why This Skill Exists

A non-Claude assistant has no built-in way to reach the `claude` binary. When a task wants Anthropic-model strengths (extended-thinking analysis, diff-based edits, `--json-schema` output), the caller either hand-builds fragile `claude -p` invocations and picks flags by trial, or skips the capability entirely. Auth handling, model selection and permission modes all become guesswork. Worse, if the calling assistant is itself Claude Code, a circular self-dispatch burns tokens for no value. The skill standardizes the dispatch, handles auth pre-flight and guards against self-invocation so the caller never has to think about the plumbing.

### What It Does

cli-claude-code is the single routing point for external AI runtimes that need Claude Code. It runs a smart router that scores intent signals (deep reasoning, code editing, structured output, review, agent delegation) and loads only the references that match. A self-invocation guard checks three layers (the `$CLAUDECODE` env var, process ancestry and lock files) and refuses to load if the caller is already inside Claude Code. The default dispatch uses `claude-sonnet-4-6` with `--output-format text`. For deep-reasoning work you override to `claude-opus-4-6` with `--effort high`.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-claude-code dispatches to Claude Code and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v claude
```

If nothing prints, install it:

```bash
npm install -g @anthropic-ai/claude-code
```

**Step 2: Run the default dispatch.**

```bash
claude -p "Explain the dependency injection pattern in src/app.ts" \
  --model claude-sonnet-4-6 \
  --output-format text \
  2>&1
```

You get a plain-text explanation of the pattern, scoped to the file you named.

**Step 3: Try deep reasoning.**

```bash
claude -p "Analyze the trade-offs between microservices and monolith for this project" \
  --model claude-opus-4-6 \
  --effort high \
  --output-format text \
  2>&1
```

You get an extended-thinking chain-of-thought analysis with the reasoning traces visible in the output.

**Step 4: Get structured JSON output.**

```bash
claude -p "Analyze src/utils.ts and return function signatures" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array"}}}' \
  --output-format json \
  2>&1
```

You get a JSON object that conforms to the schema you passed. Pipe it into any downstream consumer.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt and passes it to `claude -p` with the appropriate model, permission mode and output format. Claude Code processes the prompt using its built-in tools (Edit, Agent, Read, Bash) and returns the result. The calling AI validates the output and integrates it. The entire round-trip is non-interactive: send prompt, get response, exit.

The smart router scores seven intent categories (deep reasoning, code editing, structured output, review, agent delegation, templates and patterns) using weighted keyword matching. It then loads only the reference files that match the winning intent. `references/cli_reference.md` and `assets/prompt_quality_card.md` load on every invocation. Everything else is conditional or on-demand.

### The Self-Invocation Guard

If the agent reading this skill is itself running inside Claude Code, the skill refuses to load. This is not a suggestion. The guard checks three layers in order:

1. The `$CLAUDECODE` env var. Claude Code sets this on session start.
2. Process ancestry. If `claude` appears in the parent process tree, the guard fires.
3. Lock files under `~/.claude/state/<id>/lock`. Their presence signals an active Claude Code session.

When any layer matches, the skill returns a refusal message and loads nothing. The cli-X family exists for cross-AI delegation only. A running CLI skill never dispatches itself.

### Agent Delegation

Route to a specialized agent with `--agent <name>`. Claude Code agents live in `.claude/agents/*.md` and shape how Claude Code processes the task. The roster:

| Agent | Purpose |
|---|---|
| `context` | Codebase exploration and architecture mapping |
| `debug` | Systematic debugging and root-cause analysis |
| `handover` | Session state capture for continuity |
| `orchestrate` | Multi-agent coordination |
| `research` | Evidence gathering and best-practice lookup |
| `review` | Code review and security audit (pair with `--permission-mode plan`) |
| `speckit` | Spec documentation creation |
| `ai-council` | Multi-strategy planning |
| `write` | Documentation generation |

Example: `claude -p "Review @src/auth.ts for security issues" --agent review --permission-mode plan --output-format text 2>&1`

### Auth Pre-Flight

Before the first dispatch in a session, the skill checks whether `ANTHROPIC_API_KEY` is set or OAuth is configured. If the API key is missing but OAuth exists, it asks you before substituting. If neither is configured, it surfaces the login commands and waits. Auth options:

- `export ANTHROPIC_API_KEY=sk-ant-...` (direct API)
- `claude auth login` (interactive OAuth)
- `claude setup-token` (non-interactive CI/CD)

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-claude-code when a task benefits from extended thinking, surgical diff-based edits, schema-validated JSON output or agent delegation through Claude Code's built-in agents. Reach for it too when you need a second-AI opinion on code quality or architecture.

Skip it for simple tasks where CLI overhead is not worth it. Skip it for real-time web search (Claude Code has no `--search` flag; use Gemini or Codex). Skip it when the calling AI already has the context loaded and can act directly.

### Sibling Boundaries

The cli-X skills each dispatch to a different model provider. They never overlap:

| Skill | Provider | When to reach for it |
|---|---|---|
| `cli-claude-code` | Anthropic | Deep reasoning, diff-based edits, `--json-schema` output, agent delegation |
| `cli-codex` | OpenAI | Sandboxed coding, repo analysis, PR review, web research |
| `cli-opencode` | OpenCode | Full OpenCode runtime dispatch, in-OpenCode parallel sessions |
| `cli-devin` | Cognition | Autonomous coding via Devin for Terminal |

If you are already inside one runtime, the corresponding cli-X skill refuses to load (self-invocation guard). Use a different runtime or exit first.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns code standards and verification. cli-claude-code dispatches to Claude Code; sk-code governs the quality of what comes back. |
| `system-spec-kit` | Owns spec folders, memory and continuity. The Memory Handback protocol (7-step extraction via `generate-context.js`) bridges Claude Code session context back into the caller's spec folder. |
| `sk-prompt-small-model` | Owns per-model prompt-craft profiles. When dispatching to a profiled model, consult it before composing the prompt. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: claude` | Claude Code CLI is not installed | `npm install -g @anthropic-ai/claude-code` |
| `401 Unauthorized` | `ANTHROPIC_API_KEY` not set or expired | `export ANTHROPIC_API_KEY=sk-ant-...` or `claude auth login` |
| `Self-invocation refused` | The caller is already inside Claude Code (`$CLAUDECODE` is set) | Use a different runtime or exit the current Claude Code session first |
| `Budget exceeded` error | The `--max-budget-usd` cap was hit | Raise the cap or shrink the prompt scope |
| Context too large, slow response | Broad prompt without file scoping | Name files explicitly with `@./path/to/file` instead of broad prompts |
| Output does not match schema | Prompt did not ask for structured output or schema was malformed | Pass `--json-schema '<valid-json-schema>'` and `--output-format json` |

---

## 7. FAQ

**Q: Why can I not just call `claude` directly from my shell?**

A: You can. This skill exists for when an external AI assistant (Gemini, Codex, Copilot) needs to dispatch to Claude Code programmatically. It handles model selection, permission modes, auth pre-flight and the self-invocation guard so the calling AI does not have to.

**Q: When do I use `--permission-mode plan` versus the default?**

A: Use `--permission-mode plan` for read-only work: code review, architecture exploration, audit. The default mode allows Claude Code to make file edits. Match the permission to the task.

**Q: Sonnet or Opus?**

A: Default to `claude-sonnet-4-6`. It balances speed and cost for most tasks. Switch to `claude-opus-4-6` with `--effort high` when the task needs deep chain-of-thought reasoning (architecture trade-offs, subtle bug root causes, multi-dimensional analysis).

**Q: How does `--json-schema` guarantee output structure?**

A: Claude Code validates its output against the JSON schema you pass. If the response does not conform, Claude Code retries internally. You get a JSON object that matches your schema or an error explaining why it could not.

**Q: What happens if I dispatch to Claude Code from inside Claude Code?**

A: The self-invocation guard detects it (via `$CLAUDECODE`, process ancestry or lock files) and refuses to load. You get a message telling you to use a different runtime. No tokens are wasted on a circular dispatch.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI flags, commands, models and authentication reference |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Cross-AI orchestration patterns (external AI conducts, Claude Code executes) |
| [`references/claude_tools.md`](./references/claude_tools.md) | Unique capabilities and 3-way comparison with Gemini CLI and Codex CLI |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | Agent roster, routing table and invocation patterns |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | Fast-path prompt discipline (framework table and CLEAR check) |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste prompt templates per task |
