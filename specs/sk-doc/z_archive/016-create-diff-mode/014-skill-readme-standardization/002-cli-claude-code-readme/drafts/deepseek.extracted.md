---
title: cli-claude-code
description: Cross-AI dispatcher that lets non-Claude runtimes delegate tasks to Anthropic's Claude Code CLI for deep reasoning, surgical code editing and structured output.
trigger_phrases:
  - "claude code"
  - "claude cli"
  - "delegate to claude"
  - "extended thinking"
  - "deep reasoning"
  - "anthropic"
---

# cli-claude-code

> Delegate deep reasoning, surgical code edits and structured analysis to Claude Code from any non-Claude runtime, with safe dispatch and handback.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Dispatching tasks from any non-Claude AI runtime to Anthropic's Claude Code CLI |
| **Invoke with** | "claude code", "delegate to claude", "extended thinking" or auto-routing on Anthropic keywords |
| **Works on** | A shell with `claude` and valid Anthropic auth, from any runtime except Claude Code itself |
| **Produces** | Reasoning output, diff-based edits, schema-validated JSON or agent-delegated results ready for integration |

---

## 2. OVERVIEW

### Why This Skill Exists

A non-Claude assistant has no built-in path to the `claude` binary. When a task calls for Anthropic-model strengths — extended-thinking analysis, surgical diff edits or `--json-schema`-validated output — the caller either skips the task or hand-builds fragile `claude -p` invocations with trial-and-error flags, guesses at auth and risks a circular self-dispatch if it is itself Claude Code. This skill standardizes the dispatch and refuses self-invocation, so every non-Claude runtime gets a safe, repeatable path to Anthropic reasoning without building its own CLI wrapper.

### What It Does

cli-claude-code is the dispatcher that lets any external AI assistant invoke Claude Code as a specialist. It provides a smart router that detects intent from the task description and loads the matching references, a 9-agent delegation table for specialized Claude Code agents and a 7-step memory handback protocol that preserves Claude Code session context for the calling runtime. The default invocation is `claude -p "<prompt>" --model claude-sonnet-4-6 --output-format text 2>&1`.

If the caller is already running inside Claude Code the skill refuses to load. Use native Claude Code capabilities instead. For sandboxed OpenAI execution reach for `cli-codex`. For full OpenCode runtime dispatch reach for `cli-opencode`.

---

## 3. QUICK START

**Step 1: Invoke it.** Gate 2 routing fires on Anthropic keywords, or you read the skill directly.

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "delegate deep reasoning to claude" --threshold 0.8
# Output: Recommends cli-claude-code at confidence >= 0.8
```

**Step 2: Run the default dispatch.**

```bash
claude -p "Explain the architecture of src/auth/" \
  --model claude-sonnet-4-6 \
  --output-format text \
  2>&1
```

Success looks like Claude Code's text response streamed to stdout, ending with a cost summary line.

**Step 3: Verify the README structure before you rely on it.**

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-claude-code/README.md --type readme
```

Exit 0 with no issues reported.

---

## 4. HOW IT WORKS

### The Self-Invocation Guard

Before any dispatch the skill checks three signals in order. If `$CLAUDECODE` is set in the environment, if `claude` appears in the process ancestry or if a lock file exists under `~/.claude/state/<id>/lock`, the skill refuses to load. The error message tells the caller to use native Claude Code capabilities or switch to a different runtime. This guard is the first thing the skill does and it cannot be skipped.

### The Dispatch Lifecycle

A dispatch runs through four stages. First, the smart router scores the task against intent signals — deep reasoning, code editing, structured output, review, agent delegation, templates and patterns — and loads the references that match the top two intents. Second, an auth pre-flight checks whether `ANTHROPIC_API_KEY` is set or OAuth is configured. If both are missing the skill asks the user before dispatching. Third, the skill constructs the `claude -p` command with the correct model, permission mode and agent flags. The user's explicit overrides always win over defaults. Fourth, the output is captured with `2>&1`, validated for completeness and integrated back into the calling workflow.

Three models are available. Sonnet (`claude-sonnet-4-6`) is the default for general tasks. Opus (`claude-opus-4-6`) pairs with `--effort high` for deep chain-of-thought reasoning on architecture decisions and root-cause analysis. Haiku (`claude-haiku-4-5-20251001`) is for fast batch work and only on explicit request.

### Agent Delegation

Nine specialized agents shape how Claude Code processes the task inside its session. Route to one with `--agent <name>`.

| Task | Agent | Pair with |
|---|---|---|
| Codebase exploration | `context` | `--permission-mode plan` |
| Systematic debugging | `debug` | default mode |
| Session state capture | `handover` | default mode |
| Multi-agent coordination | `orchestrate` | default mode |
| Evidence gathering | `research` | default mode |
| Code review or audit | `review` | `--permission-mode plan` |
| Spec documentation | `speckit` | default mode |
| Multi-strategy planning | `ai-council` | `--permission-mode plan` |
| Documentation generation | `write` | default mode |

### Memory Handback

When the calling runtime needs to preserve Claude Code session context, the skill runs a 7-step procedure: extract the `MEMORY_HANDBACK` section from the Claude Code output, build a structured JSON payload, scrub secrets, invoke `generate-context.js` and run `memory_index_scan` to index the result. The full procedure lives in `system-spec-kit/references/cli/memory_handback.md`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-claude-code when a task needs extended-thinking analysis, surgical code edits that preserve surrounding code or schema-validated structured output. Reach for it when you want a specialized Claude Code agent to own a subtask. Skip it for simple questions the calling AI can answer directly, for interactive terminal work (use `claude` directly) and for web search (Claude Code has no `--search` flag — use Gemini or Codex).

### Boundaries With Sibling Skills

cli-claude-code dispatches to Anthropic's Claude Code CLI. Three sibling skills dispatch to different runtimes and each owns its lane.

`cli-codex` dispatches to OpenAI's Codex CLI. Use it for sandboxed code execution, OpenAI-model reasoning and web search via `--search`.

`cli-opencode` dispatches a full OpenCode runtime session. Use it for tasks that need the complete OpenCode tool surface: MCP servers, skills, agents and spec-kit integration.

`cli-devin` dispatches to Cognition's Devin for autonomous coding work with optional local-to-cloud handoff.

None of these skills dispatch themselves. Each refuses self-invocation through the same guard pattern.

### Related Skills

| Skill | Relationship |
|---|---|
| `cli-codex` | Dispatches to OpenAI Codex CLI. Use for sandboxed execution and web search. |
| `cli-opencode` | Dispatches a full OpenCode runtime. Use for tasks needing the complete tool surface. |
| `cli-devin` | Dispatches to Devin for autonomous coding work. |
| `sk-code` | Owns code standards and verification. cli-claude-code instructs dispatched sessions to load it for code work. |
| `system-spec-kit` | Owns spec folders and memory. cli-claude-code passes the spec folder to delegated agents and runs the handback protocol. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: claude` | CLI not installed or PATH not updated | `npm install -g @anthropic-ai/claude-code` then restart your terminal |
| "ERROR: Already inside Claude Code session" | The self-invocation guard detected `$CLAUDECODE`, a Claude process in ancestry or a state lock file | Use native Claude Code capabilities or switch to a different runtime |
| `401 Unauthorized` | `ANTHROPIC_API_KEY` not set, expired or OAuth session invalid | Run `claude auth status`. Re-authenticate with `claude auth login` or export a fresh API key |
| Session terminates mid-task with a budget warning | `--max-budget-usd` is too low for the task | Raise the cap or switch to Haiku for batch work |
| "Context too large" or truncated output | The prompt references broad paths instead of specific files | Narrow to `@./path/to/file` instead of `src/` and split large tasks across sessions |

---

## 7. FAQ

**Q: Why does the skill refuse to run inside Claude Code?**

A: Dispatching Claude Code from inside Claude Code is a circular loop that burns tokens for no value. The self-invocation guard catches three signals: the `$CLAUDECODE` environment variable, a `claude` process in the ancestry tree and a lock file under `~/.claude/state/`. If any signal fires the skill stops. Use Claude Code's native tools directly instead.

**Q: When should I use Opus with `--effort high` instead of Sonnet?**

A: Use Opus for architecture trade-off analysis, root-cause debugging of subtle bugs and multi-dimensional decisions where surface-level pattern matching falls short. Opus with `--effort high` runs an internal chain-of-thought that considers alternatives and backtracks before committing to an answer. It costs more and takes longer. Sonnet handles everything else.

**Q: What is the difference between `plan` mode and the default permission mode?**

A: `plan` mode is read-only. Claude Code can explore files, run analysis and produce recommendations but cannot write, edit or execute anything that modifies the system. Use it for code review, architecture exploration and security audits. The default mode asks for approval before each write. `bypassPermissions` auto-approves everything and requires explicit user consent before the skill will use it.

**Q: How does `--json-schema` guarantee valid output?**

A: You define a JSON schema and Claude Code validates its response against it before returning. If the output does not match the schema the request fails rather than returning malformed data. This makes Claude Code a reliable node in data pipelines where downstream systems expect exact formats.

**Q: Can Claude Code search the web?**

A: No. Claude Code has no web search capability. For web research delegate to Gemini CLI (Google Search grounding) or Codex CLI (`--search` flag).

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios across eight categories: CLI invocation, permission modes, reasoning and models, agent routing, session continuity, integration patterns, prompt templates and cost and background processing.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-claude-code/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md` |
| Behavior | Run the playbook scenarios under `manual_testing_playbook/0N--<topic>/` in a live session with valid Anthropic auth |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI flags, commands, models, auth methods and configuration |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Cross-AI orchestration patterns: the external AI conducts, Claude Code executes |
| [`references/claude_tools.md`](./references/claude_tools.md) | Unique capabilities and a 3-way comparison with Gemini CLI and Codex CLI |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | The 9-agent roster, routing table and invocation patterns |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | Fast-path prompt discipline: framework table and CLEAR check |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste prompt templates for common task types |
