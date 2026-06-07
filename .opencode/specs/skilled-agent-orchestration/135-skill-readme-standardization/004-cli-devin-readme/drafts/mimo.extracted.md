---
title: cli-devin
description: Devin CLI orchestrator that dispatches Cognition AI's Devin for Terminal for autonomous coding work with optional local-to-cloud handoff.
trigger_phrases:
  - "devin"
  - "devin cli"
  - "delegate to devin"
  - "swe-1.6"
  - "cloud handoff"
---

# cli-devin

> Dispatch autonomous coding to Devin for Terminal, or hand the session to a cloud VM that finishes the job and returns a PR after you close your laptop.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Autonomous coding via Cognition's Devin for Terminal, with an optional local-to-cloud handoff that keeps working after you disconnect |
| **Invoke with** | "devin", "delegate to devin", "swe-1.6", "cloud handoff" or auto-routing on Devin keywords |
| **Works on** | Any external runtime (Claude Code, Codex, Gemini, OpenCode, raw shell) that needs to reach the `devin` binary |
| **Produces** | Code edits, autonomous task completion and optionally a cloud-hosted session that returns a PR |

---

## 2. OVERVIEW

### Why This Skill Exists

A calling AI that wants Cognition's coding-specialized model, or wants to offload a multi-hour task and walk away, has no clean path to the `devin` binary. It must hand-build the invocation with the right model, permission mode and prompt file, run the auth pre-flight and decide whether to initiate a cloud handoff that transmits repo state to Cognition's cloud and spends Devin units. If the caller is itself a local Devin session, a self-dispatch loops and burns units. This skill standardizes the dispatch, gates the cloud handoff behind operator confirmation and refuses self-invocation.

### What It Does

cli-devin is the single routing point for external runtimes that need Devin for Terminal. A smart router scores the task against intent signals (local dispatch, cloud handoff, ACP bridge, MCP ops, rules and skills, auth) and loads only the references that match. A self-invocation guard checks three layers (env vars, process ancestry, lock files) and refuses to load if the caller is already inside a local Devin session. The one exception is an explicit cloud-handoff request that intentionally migrates the work to a separate Devin cloud sandbox.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-devin dispatches to Devin and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v devin
```

If nothing prints, install it:

```bash
curl -fsSL https://cli.devin.ai/install.sh | bash
```

**Step 2: Run the auth pre-flight.**

```bash
devin auth status
```

Expected output when authenticated: `Authenticated as <handle> · profile=<name>`. If it fails, run `devin auth login` and follow the Codeium/Windsurf bridge flow.

**Step 3: Run the default dispatch.**

```bash
devin --prompt-file /tmp/devin-prompt.md \
  --model swe-1.6 \
  --permission-mode auto \
  --config "$HOME/.config/devin/config.json"
```

You get autonomous code execution against your local codebase. SWE-1.6 runs on the Free tier and does not consume Pro quota.

**Step 4: Switch to a complex model when the task demands it.**

```bash
devin --prompt-file /tmp/devin-prompt.md \
  --model deepseek-v4 \
  --permission-mode auto
```

DeepSeek v4 handles ambiguous, multi-step and reasoning-bound work. Expect dispatches to take 15 minutes or longer on non-trivial tasks.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt (typically via `--prompt-file` for anything over 2KB) and passes it to `devin` with a model and permission mode. Devin runs locally with full access to your codebase, tools and environment. It processes the task through its internal agent loop and returns the result. The calling AI validates the output and integrates it.

For non-interactive and background dispatches, capture stderr and close stdin:

```bash
devin --prompt-file /tmp/prompt.md \
  --model swe-1.6 \
  --permission-mode auto \
  -p > /tmp/devin.log 2>&1 </dev/null &
```

### The Self-Invocation Guard

If the agent reading this skill is itself running inside a local Devin session, the skill refuses to load. The guard checks three layers in order:

1. The `DEVIN_*` env vars, which Devin sets on session start.
2. Process ancestry, where a `devin` parent in the tree trips the guard.
3. Lock files under `~/.config/devin/sessions/<id>/lock`, which signal an active session.

When any layer matches, the skill returns a refusal and loads nothing. The single legitimate exception is an explicit "cloud handoff" request. The cloud handoff spawns a separate Devin cloud sandbox, not a self-dispatch, so the guard allows it through when the prompt contains cloud-handoff keywords and the operator has confirmed.

### The Four-Model Preset

Devin runs four model presets. The skill defaults to SWE-1.6 for context gathering, tool use and clearly defined simple-to-medium code tasks.

| Model | ID | Use |
|---|---|---|
| Cognition SWE-1.6 (default, Free tier) | `swe-1.6` | Context gathering, tool use, simple-to-medium tasks. Does not gate on Pro quota. |
| DeepSeek v4 | `deepseek-v4` | Primary for complex work: ambiguous problems, multi-step reasoning, large refactors. Budget 25+ minutes. |
| GLM 5.1 | `glm-5.1` | Complex fallback for agentic and tool-use-heavy work when DeepSeek v4 does not fit. |
| Kimi k2.6 | `kimi-k2.6` | Complex fallback for large-context work. Can hang around 25 minutes on complex fixtures. |

SWE-1.6 needs a caller-side pre-planning block (ordered steps with acceptance criteria) because it is smaller than the complex models. The contract lives in `sk-prompt-small-model/references/models/swe-1.6.md`.

### Local-to-Cloud Handoff

This is the capability that sets cli-devin apart from every sibling in the cli-* family. When a task is long-running and you want to close your laptop and return to a finished PR, the local Devin session can hand off to a cloud-hosted Devin VM. The cloud session keeps working independently and returns a PR when it finishes.

The handoff is always operator-gated. No cli-devin invocation that mentions "cloud handoff", "hand off to cloud" or `devin cloud` proceeds without your explicit confirmation in the same turn. The cloud session transmits local repo state to Cognition's cloud sandbox and consumes Devin units, so the skill surfaces a confirmation prompt before any handoff invocation.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-devin when a task benefits from Cognition's SWE-1.6 model, when you want to offload a long-running coding job to a cloud VM that returns a PR, or when you need Devin's ACP server bridge or MCP ops surface. Reach for it too when you want a Devin-side perspective as a second opinion.

Skip it for simple tasks where `devin` startup overhead is not worth it. Skip it for raw model dispatch with no autonomous coding loop, where `cli-codex` or `cli-claude-code` is leaner. Skip it when you are already inside a local Devin session (the guard refuses to load).

### Sibling Boundaries

The cli-X skills each dispatch to a different provider and never overlap.

| Skill | Provider | When to reach for it |
|---|---|---|
| `cli-devin` | Cognition | Autonomous coding, local-to-cloud handoff, ACP bridge |
| `cli-codex` | OpenAI | Sandboxed coding, repo analysis, PR review, web research |
| `cli-claude-code` | Anthropic | Deep reasoning, diff-based edits, JSON-schema output |
| `cli-opencode` | OpenCode | Full OpenCode runtime dispatch, in-OpenCode parallel sessions |

If you are already inside one runtime, the matching cli-X skill refuses to load. Use a different runtime or exit first.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns code standards and verification. cli-devin dispatches the work; sk-code governs the quality of what comes back. |
| `system-spec-kit` | Owns spec folders, memory and continuity. The Memory Handback bridges a Devin session back into the caller's spec folder. |
| `sk-prompt-small-model` | Owns per-model prompt-craft profiles. Consult it before composing a prompt for SWE-1.6 or any profiled model. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: devin` | CLI not installed or PATH not updated | `curl -fsSL https://cli.devin.ai/install.sh \| bash`, then restart your terminal |
| `Not authenticated` or auth error | `devin auth` token missing or expired | `devin auth login` (do not auto-login) |
| `Pro · 0% remaining` banner | Only Pro-tier models gate on quota. SWE-1.6 is Free tier. | Switch to `--model swe-1.6` for the duration, or wait for the Pro window to reset |
| Task ran but no files changed | `--permission-mode auto` paused for confirmation in non-interactive mode | Re-dispatch with `--permission-mode dangerous` (operator-approved) or run interactively |
| `Self-invocation refused` | The caller is already inside a local Devin session (DEVIN_* env, devin ancestry or a session lock) | Use a different runtime or exit the current Devin session first |
| Cloud-handoff dispatch refused | Account lacks cloud entitlement or operator did not pre-confirm | Verify account provisioning and restate with explicit cloud-handoff keywords plus operator confirmation |
| Background dispatch hangs at 0% CPU | Missing `</dev/null` so Devin's stdin stays open | Append `</dev/null` to the command |
| Context too large or truncated | The prompt references broad paths instead of specific files | Use `--prompt-file <path>` and split large tasks across multiple dispatches |

---

## 7. FAQ

**Q: Why use Devin instead of Codex or Claude Code?**

A: Reach for Devin when the task benefits from Cognition's SWE-1.6 coding-specialized model, when you want the local-to-cloud handoff for long-running work that returns a PR after you disconnect, or when you need the ACP bridge or MCP ops surface. Reach for cli-codex when you need sandboxed edits or live web search. Reach for cli-claude-code when you need deep extended thinking or JSON-schema output.

**Q: What does the cloud handoff actually cost?**

A: Cloud sessions consume Devin units from your Cognition account. The skill surfaces a confirmation prompt before any handoff so you can approve or decline. The local CLI initiates the handoff but the cloud session runs in a separate sandbox that keeps working independently.

**Q: What is the difference between `auto` and `dangerous` permission modes?**

A: `auto` (the default) auto-approves read-only tools and prompts on write and exec actions. `dangerous` auto-approves all tools, including destructive operations like file deletion and git history rewrite. The skill requires explicit operator approval before escalating to `dangerous`.

**Q: SWE-1.6 versus the complex models. How do I choose?**

A: Default to SWE-1.6 for context gathering, tool use and clearly defined simple-to-medium tasks. It runs on the Free tier and dispatches fast. Switch to DeepSeek v4 when the task is ambiguous, multi-step or reasoning-bound. If DeepSeek v4 does not fit, fall back to GLM 5.1 for agentic and tool-use-heavy work or Kimi k2.6 for large-context work.

**Q: Why does the skill refuse to load inside a Devin session?**

A: The cli-X family exists for cross-AI delegation. If the agent reading this skill is already running inside a local Devin session, dispatching to Devin again creates a circular loop that burns units for no value. The single exception is an explicit cloud-handoff request that migrates to a separate cloud sandbox.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI flags, subcommands, models, auth and config reference |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Three use cases: external dispatch, ACP bridge and cloud-handoff initiation |
| [`references/devin_tools.md`](./references/devin_tools.md) | Unique Devin capabilities and cross-CLI comparison |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | Model, permission-mode and prompt-file routing analog |
| [`references/cloud_handoff.md`](./references/cloud_handoff.md) | Local-to-cloud handoff narrative and operator-confirmation gate |
| [`references/deep-loop-iter-contract.md`](./references/deep-loop-iter-contract.md) | Deep-research and deep-review per-iter contract |
| [`references/agent-config-recipes.md`](./references/agent-config-recipes.md) | Canonical agent-config shapes for research, review and synthesis |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | CLEAR 5-check and framework selection |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste templates for common dispatch shapes |
