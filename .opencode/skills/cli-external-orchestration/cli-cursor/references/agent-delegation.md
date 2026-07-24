---
title: "Cursor Agent Delegation Reference"
description: "Reference for delegating tasks to Cursor CLI via its plan/ask/default execution-mode model, plus its native subagent skill system."
trigger_phrases:
  - "cursor agent delegation"
  - "cursor execution mode dispatch"
  - "delegate task to cursor"
  - "cursor conductor executor model"
  - "cursor mode ask plan"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Cursor Agent Delegation Reference

Routing reference for delegating tasks to Cursor CLI.

---

## 1. OVERVIEW

### Core Principle

The calling AI decides WHAT to do, Cursor CLI decides HOW to do it within the delegated scope.

### Purpose

Documents how any AI assistant orchestrates Cursor CLI through its execution-mode model. Unlike Codex's `-p <profile>` TOML-profile system, Cursor CLI has no repo-local agent-persona files of its own — delegation is governed by three execution modes (default, `--mode plan`, `--mode ask`) plus model selection, not a named-profile roster.

### When to Use

- Delegating supplementary implementation or analysis tasks to Cursor CLI
- Cross-AI code review or a Composer-specific second opinion
- Read-only architecture exploration before committing to a write-capable dispatch
- Tasks that specifically want Cursor's own subagent/skill system (`~/.cursor/skills-cursor/`) noted for context, though it is editor/CLI-native tooling this packet does not orchestrate directly

---

## 2. ORCHESTRATION MODEL

```
Calling AI (CONDUCTOR)
  |
  |-- Analyzes task, selects execution mode + model
  |-- Constructs cursor-agent CLI command with -p and --mode/--model flags
  |-- Delegates via Bash tool
  |
  v
Cursor CLI (EXECUTOR)
  |
  |-- Runs in the selected execution mode (default / plan / ask)
  |-- Executes with the selected model and approval flags
  |-- Returns output to stdout
  |
  v
Calling AI (CONDUCTOR)
  |
  |-- Validates output quality (text inspection, never trusting exit code alone)
  |-- Integrates into workflow
  |-- Decides next step
```

### Invocation Pattern

Cursor CLI tasks are routed using `--mode` (execution mode) and `--model` (which model). There is no `-p <profile>` flag analog — model and mode ARE the delegation surface.

```bash
# Default agent mode (read-write, gated by approval flags)
cursor-agent -p "Fix the authentication bug in src/auth/handler.ts" \
  --model auto --auto-review --sandbox enabled

# Read-only planning mode
cursor-agent -p "Plan the migration from REST to GraphQL" \
  --mode plan --model auto

# Read-only Q&A mode
cursor-agent -p "Explain how the retry logic works in src/api/client.ts" \
  --mode ask --model auto
```

---

## 3. EXECUTION MODE ROSTER

| Mode | Flag | Read/Write | Best For |
|------|------|------------|----------|
| **Default agent** | (none) | Read-write, gated by `--auto-review`/`--force`/unflagged-prompt | Code generation, fixes, refactoring |
| **Plan** | `--mode plan` (shorthand: `--plan`) | Read-only | Multi-step planning without any file writes |
| **Ask** | `--mode ask` | Read-only | Q&A, architecture exploration, code explanation |

Approval flags (`--auto-review`/`--force`) have no effect in `--mode plan`/`--mode ask` — both modes are read-only regardless of what approval flag is passed, since there is nothing for the model to write.

---

## 4. TASK-TYPE ROUTING TABLE

| Task Type | Execution mode | Model guidance |
|-----------|-----------------|------------------|
| Code review / bug detection | Default agent, `--sandbox enabled`, no write approval needed for the review itself | `auto` or `composer-2.5` for a Cursor-native opinion |
| Architecture exploration | `--mode ask` | `auto`, or a high-effort id (`gpt-5.2-high`) for deep analysis |
| Multi-step planning | `--mode plan` | `auto` |
| Code generation / file edits | Default agent, `--auto-review` (or `--force` for unattended runs) | `auto` for general work, `composer-2.5` for a Cursor-native attempt |
| Composer-specific validation | Default agent or `--mode ask` | `composer-2.5`/`composer-2.5-fast` explicitly |

---

## 5. CURSOR'S NATIVE SUBAGENT SYSTEM (CONTEXT, NOT ORCHESTRATED HERE)

`~/.cursor/skills-cursor/` holds Cursor's own skill/subagent system, confirmed live on the reference machine: `automate`, `babysit`, `canvas`, `create-hook`, `create-rule`, `create-skill`, `create-subagent`, `loop`, `migrate-to-skills`, `sdk`, `shell`, `split-to-prs`, `statusline`, `update-cli-config`, `update-cursor-settings`. The presence of `create-subagent` confirms Cursor supports subagents natively, and `create-hook`/`create-rule` confirm native hooks/rules authoring.

This is Cursor-editor-native tooling, not a delegation surface this packet's dispatch adapter controls — a dispatched `cursor-agent -p` session may use its own internal subagents as part of fulfilling the prompt, but this packet does not route to a specific one by name the way `cli-codex` routes to a named `-p <profile>`. Document this distinction accurately rather than inventing a profile-style routing table Cursor does not expose.

---

## 6. SESSION CONTINUITY

Cursor CLI supports session continuation via `--resume [chatId]` and `--continue`, distinct from a named-profile system:

```bash
# Continue the most recent session
cursor-agent -p "Now add tests for what you just implemented" --continue --model auto

# Resume a specific chat by id (id surfaces in --output-format json's session_id field)
cursor-agent -p "Continue implementing the rate limiter" \
  --resume "$SESSION_ID" --model auto --auto-review --sandbox enabled
```

### When to Use Each Operation

| Operation | When to Use |
|-----------|--------------|
| `--continue` | Immediately following up on the most recent dispatch |
| `--resume <chatId>` | Returning to a specific earlier session by its known id |
| New session (neither flag) | Fresh context; prior session is not relevant, or re-providing context via the prompt is simpler than tracking a session id |

### Considerations

- For cross-AI orchestration, it is often simpler to re-provide context in the prompt than to manage `--resume` ids across multiple `cursor-agent -p` calls from a different orchestrating runtime.
- Capture `session_id` from `--output-format json` output when a later `--resume` is anticipated.
