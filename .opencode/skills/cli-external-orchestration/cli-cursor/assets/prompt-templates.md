---
title: Prompt Templates
description: Copy-paste ready prompt templates for common Cursor CLI tasks organized by category with placeholders and examples.
trigger_phrases:
  - "cursor prompt templates"
  - "cursor agent templates"
  - "cursor code generation template"
  - "cursor composer template"
  - "cursor plan ask template"
importance_tier: normal
contextType: implementation
version: 1.2.0.0
---

# Prompt Templates - Cursor CLI

Copy-paste ready prompt templates for common Cursor CLI tasks. Replace `[placeholders]` with your values.

## 1. OVERVIEW

### Purpose

This asset provides structured, copy-paste ready prompt templates for invoking Cursor CLI across common development tasks. Each template includes the full command with flags, placeholder variables, and a concrete example.

### Usage

1. Find the template category matching your task
2. Copy the command
3. Replace `[placeholders]` with actual values
4. Run in your terminal or via Bash tool

### Flag Reference

> **Non-existent flags:** `--reasoning-effort` and the parameterized `model[effort=...]` bracket do NOT exist / are rejected outright by Cursor CLI. Select an effort-suffixed model id (e.g. `cursor-grok-4.6-high`) instead.
> **Exit code caveat:** `-p` always exits `0`, even on auth failure. Every template below assumes the caller inspects output text, not the exit code.
> **Enforced allowlist:** `--model` is scoped to 21 ids — `composer-2.5`/`composer-2.5-fast`, 6 Grok 4.5 tiers, 8 Grok 4.6 tiers, `gemini-3.7-flash-high`, `glm-5.2-{high,max}`, `gpt-5.6-luna-{max,max-fast}`. `auto` and every other Cursor id are rejected before a command is constructed (SKILL.md §3).

| Flag | Purpose |
| ---- | ------- |
| `--model composer-2.5` | Skill default — Cursor's own native model. Override with `cursor-grok-4.6-high` or `glm-5.2-max` for a specific allowed provider/tier — never `auto`, never an id outside the allowlist. |
| `--output-format text` | Skill default — final answer only. Use `json` for a structured envelope with `session_id`/`usage`. |
| `--mode plan` | Read-only planning — no writes regardless of approval flags. |
| `--mode ask` | Read-only Q&A — no writes regardless of approval flags. |
| `--auto-review` | "Smart Auto" — auto-runs safe actions, prompts for the rest. Skill default for write-capable dispatches. |
| `--force` / `--yolo` | "Run Everything" — never prompts. Requires explicit user approval before use. |
| `--sandbox enabled` | OS-level sandbox on — skill default. |
| `--sandbox disabled` | OS-level sandbox off — pairs with `--force` for fully unattended runs. |
| `--trust` | Trusts the workspace without a workspace-trust prompt. |
| `--approve-mcps` | Auto-approves configured MCP servers for this dispatch. |

---

## 2. CODE GENERATION

### Single-File Module

Framework: RCAF

Generate a complete single-file module from a description.

```bash
cursor-agent -p "Create a [description] module in [language]. Requirements: [requirements]. Output a single complete file with all imports, error handling, and comments. Start immediately." \
  --model composer-2.5 --auto-review --sandbox enabled --output-format text
```

**Example:**

```bash
cursor-agent -p "Create a rate limiter module in TypeScript using a sliding window algorithm. Requirements: Express middleware compatible, configurable window size, in-memory store with optional Redis adapter interface. Output a single complete file with all imports, error handling, and comments. Start immediately." \
  --model composer-2.5 --auto-review --sandbox enabled --output-format text
```

### Component / Module Matching Existing Patterns

Framework: RCAF

Generate a component that fits an existing codebase's conventions.

```bash
cursor-agent -p "Create a [language] [format] for [description]. Follow the patterns used in the existing [reference-file]. Include types, exports, error handling, and comments. Output only the code." \
  --model composer-2.5 --auto-review --sandbox enabled --output-format text
```

**Example:**

```bash
cursor-agent -p "Create a TypeScript Zod schema for a UserProfile type. Follow the patterns used in the existing src/schemas/order.ts. Include types, exports, error handling, and comments. Output only the code." \
  --model composer-2.5 --auto-review --sandbox enabled --output-format text
```

---

## 3. CODE REVIEW

### Security-Focused Review

Framework: RCAF

```bash
cursor-agent -p "Review [file/directory] for security vulnerabilities: injection, XSS, auth bypass, secrets exposure. Return JSON: {issues: [{severity, line, description, fix}]}." \
  --mode ask --model composer-2.5 --output-format json
```

**Example:**

```bash
cursor-agent -p "Review src/auth/session.ts for security vulnerabilities: injection, XSS, auth bypass, secrets exposure. Return JSON: {issues: [{severity, line, description, fix}]}." \
  --mode ask --model composer-2.5 --output-format json
```

### Composer-Specific Second Opinion

Use when the task specifically wants Cursor's own native model's perspective, distinct from a hosted-frontier review.

```bash
cursor-agent -p "Review [file/description] and give an independent assessment: [focus-area]." \
  --mode ask --model composer-2.5 --output-format text
```

**Example:**

```bash
cursor-agent -p "Review the newly generated rate-limiter.ts and give an independent assessment: correctness of the sliding-window algorithm under concurrent access." \
  --mode ask --model composer-2.5 --output-format text
```

---

## 4. READ-ONLY EXPLORATION

### Architecture Q&A

```bash
cursor-agent -p "[question about the codebase]" --mode ask --model composer-2.5
```

**Example:**

```bash
cursor-agent -p "How does the retry logic in src/api/client.ts interact with the rate limiter?" --mode ask --model composer-2.5
```

### Multi-Step Plan (No Writes)

```bash
cursor-agent -p "Plan [task]. List the concrete steps and files that would need to change. Do not write anything." \
  --mode plan --model composer-2.5
```

**Example:**

```bash
cursor-agent -p "Plan the migration from REST to GraphQL for the /users endpoint. List the concrete steps and files that would need to change. Do not write anything." \
  --mode plan --model composer-2.5
```

---

## 5. UNATTENDED / FULLY AUTOMATED RUN

**Requires explicit user approval before use** (per `SKILL.md` §4 ⚠️ ESCALATE IF).

```bash
cursor-agent -p "[task]" --model composer-2.5 --force --sandbox disabled
```

**Example:**

```bash
cursor-agent -p "Run the test suite and fix any failures." --model composer-2.5 --force --sandbox disabled
```

---

## 6. SPEC-FOLDER PRE-APPROVAL (GATE 3 BYPASS)

When the calling AI has an active Gate-3 spec folder and needs the delegated Cursor session to skip re-asking:

```bash
cursor-agent -p "Spec folder: [path] (pre-approved, skip Gate 3). [task description]" \
  --model composer-2.5 --auto-review --sandbox enabled
```

**Example:**

```bash
cursor-agent -p "Spec folder: specs/cli-external-orchestration/030-cli-cursor-creation/003-cli-cursor-skill-packet (pre-approved, skip Gate 3). Add a new section to references/cli-reference.md documenting the --header flag." \
  --model composer-2.5 --auto-review --sandbox enabled
```

---

## 7. MCP-DEPENDENT DISPATCH

When the task needs an already-configured MCP server and cannot block on an interactive approval:

```bash
cursor-agent -p "[task using an MCP-provided tool]" \
  --model composer-2.5 --auto-review --sandbox enabled --approve-mcps
```

**Example:**

```bash
cursor-agent -p "Use the configured GitHub MCP server to list open PRs against main and summarize them." \
  --model composer-2.5 --auto-review --sandbox enabled --approve-mcps
```

---

## 8. MEMORY EPILOGUE (HANDBACK)

Append to any dispatch prompt when the calling AI needs to preserve session context afterward — see `SKILL.md` "Memory Handback Protocol" for the full 7-step procedure this feeds into.

```
---
MEMORY_HANDBACK
Summarize (in <200 words): what was attempted, what changed, what remains open, and any blocker. Do not include secrets or credentials.
```
