---
title: cli-devin
description: Cross-AI dispatcher that delegates a task to Cognition's Devin CLI for autonomous coding, with a four-model preset and the family-unique local-to-cloud handoff.
trigger_phrases:
  - "devin"
  - "devin cli"
  - "delegate to devin"
  - "swe-1.6"
  - "cloud handoff"
  - "cognition devin"
---

# cli-devin

> Dispatch a task to Cognition's `devin` CLI for autonomous coding, then optionally hand the session to a cloud VM that keeps working and returns a PR after you close your laptop.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Autonomous coding with a four-model preset, and the family-unique local-to-cloud handoff for long-running work |
| **Invoke with** | "devin", "delegate to devin", "cloud handoff", "swe-1.6" or auto-routing on Devin keywords |
| **Works on** | Any external runtime (Claude Code, Codex, Gemini, OpenCode, raw shell) that needs to reach the `devin` binary |
| **Produces** | Code changes in your workspace, or a cloud-handoff PR from a Devin VM after you disconnect |

---

## 2. OVERVIEW

### Why This Skill Exists

When you want Cognition's coding-specialized SWE-1.6 model, or you need to kick off a multi-hour task and walk away, the `devin` binary has no clean dispatch path from an external runtime. You hand-build the invocation, pick between auto and dangerous permission modes and guess whether to pass a prompt file or a positional prompt. If your calling runtime is itself a local Devin session, a self-dispatch loops and burns units. The worst trap: a long task stalls on a write confirmation in auto mode because you are not there to approve it. The skill standardizes the dispatch, gates the cloud handoff behind operator confirmation and refuses self-invocation.

### What It Does

cli-devin is the single routing point for external runtimes that need Devin for Terminal. A smart router scores the task against intent signals (local dispatch, cloud handoff, ACP bridge, MCP operations, permission modes, rules and skills) and loads only the references that match. The default dispatch is `devin --prompt-file /tmp/devin-prompt.md --model swe-1.6 --permission-mode auto`, running a Free-tier model that does not consume Pro quota. When the task needs to run for hours, the local-to-cloud handoff migrates the session to a Cognition cloud VM. A three-layer guard stops you from dispatching to yourself from inside a Devin session.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-devin dispatches to Devin and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v devin
```

If nothing prints, install it with `curl -fsSL https://cli.devin.ai/install.sh | bash`.

**Step 2: Run the auth pre-flight.**

```bash
devin auth status
```

Expected when authenticated: `Authenticated as <handle> · profile=<name>`. If it fails, run `devin auth login` and follow the Codeium and Windsurf bridge flow.

**Step 3: Run the default dispatch.**

```bash
devin --prompt-file /tmp/devin-prompt.md \
  --model swe-1.6 \
  --permission-mode auto \
  --config "$HOME/.config/devin/config.json"
```

Devin runs locally with Cognition's coding-specialized model on the Free tier, and the output streams to stdout.

**Step 4: Switch to a complex model when the task demands it.**

```bash
devin --prompt-file /tmp/devin-prompt.md \
  --model deepseek-v4 \
  --permission-mode auto
```

DeepSeek v4 handles ambiguous, multi-step and reasoning-bound work. Expect dispatches to take 15 minutes or longer on non-trivial tasks, and this consumes Pro quota.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt (via `--prompt-file` for anything over 2KB) and passes it to `devin` with a model and permission mode. Devin runs locally with full access to your codebase, tools and environment, processes the task through its internal agent loop and returns the result. The calling AI validates the output and integrates it. For background dispatches, capture stderr and close stdin:

```bash
devin --prompt-file /tmp/prompt.md --model swe-1.6 --permission-mode auto -p > /tmp/devin.log 2>&1 </dev/null &
```

### The Self-Invocation Guard

If the agent reading this skill is itself running inside a local Devin session, the skill refuses to load. The guard checks three layers in order:

1. Any `DEVIN_*` env var, which Devin sets on session start.
2. Process ancestry, where a `devin` parent in the tree trips the guard.
3. Lock files under `~/.config/devin/sessions/<id>/lock`, which signal an active session.

The one exception is an explicit cloud-handoff request. The cloud handoff spawns a separate Devin cloud sandbox, not a self-dispatch, so the guard allows it through when the prompt contains cloud-handoff keywords and the operator has confirmed.

### Local-to-Cloud Handoff

This is the capability that sets cli-devin apart from every sibling in the cli-* family. When a task is long-running and you want to close your laptop and return to a finished PR, the local Devin session hands off to a cloud-hosted Devin VM. The cloud session keeps working independently and returns a PR when it finishes. The handoff is always operator-gated: no invocation that mentions "cloud handoff", "hand off to cloud" or `devin cloud` proceeds without your explicit confirmation in the same turn, because the cloud session transmits local repo state to Cognition's cloud sandbox and consumes Devin units.

### The Four-Model Preset

Devin runs four model presets, switchable per dispatch with `--model` or mid-session with `/model`.

| Model | ID | When to pick it |
|---|---|---|
| Cognition SWE-1.6 (default, Free tier) | `swe-1.6` | Context gathering, tool use and clearly-defined simple-to-medium tasks. Does not consume Pro quota. |
| DeepSeek v4 (primary complex) | `deepseek-v4` | Ambiguous problems, multi-step work, deep reasoning, large refactors, root-cause debugging. Budget 25+ minutes. |
| GLM 5.1 (complex fallback) | `glm-5.1` | Agentic or tool-use-heavy work when DeepSeek v4 does not fit. |
| Kimi k2.6 (complex fallback) | `kimi-k2.6` | Large-context work when DeepSeek v4 does not fit. Can hang around 25 minutes on complex fixtures. |

Default to SWE-1.6. When the task is complex, use DeepSeek v4, then fall back to GLM 5.1 for agentic work or Kimi k2.6 for large context. Never switch models silently. SWE-1.6 needs a caller-side pre-planning block (ordered steps with acceptance criteria) because it is smaller, and that contract lives in `sk-prompt-small-model/references/models/swe-1.6.md`.

### Permission Modes

`auto` is the default. It auto-approves read-only tools (file reads, directory listings, grep) and pauses for confirmation on file modifications and command execution, which is the safe choice for most dispatches. `dangerous` auto-approves every tool. The skill requires explicit operator approval before it escalates to `dangerous` and records the escalation in the dispatch log.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-devin when a task benefits from Cognition's SWE-1.6 model, when it needs the local Devin agent loop with MCP servers and custom rules, when you want to try multiple models against the same task, or when the work is long enough to hand off to a cloud VM. Skip it for simple lookups the caller can answer directly, for raw model dispatch with no agent loop (cli-codex or cli-claude-code is leaner) and for the interactive Devin TUI slash commands, which are operator-driven.

### Sibling Boundaries

The cli-X skills each dispatch to a different provider and never overlap.

| Skill | Provider | When to reach for it |
|---|---|---|
| `cli-devin` | Cognition | Autonomous coding with SWE-1.6 and optional cloud handoff for long-running work |
| `cli-codex` | OpenAI | Sandboxed coding, repo analysis, PR review, web research |
| `cli-claude-code` | Anthropic | Deep reasoning, diff-based edits, `--json-schema` output, agent delegation |
| `cli-opencode` | OpenCode | Full OpenCode runtime dispatch, in-OpenCode parallel sessions |

If you are already inside one runtime, the matching cli-X skill refuses to load. Use a different runtime or exit first.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-prompt-small-model` | Owns the SWE-1.6 prompt-craft profile and pre-planning contract. Every SWE-1.6 dispatch must honor its framework and scaffold. |
| `sk-code` | Owns code standards and verification. cli-devin dispatches the work, sk-code governs the quality of what comes back. |
| `system-spec-kit` | Owns spec folders, memory and continuity. The Memory Handback bridges a Devin session back into the caller's spec folder. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: devin` | CLI not installed or PATH not updated | `curl -fsSL https://cli.devin.ai/install.sh \| bash`, then restart your terminal |
| `Not authenticated` or auth error | Devin token missing or expired | `devin auth login` (do not auto-login) |
| `Pro · 0% remaining` banner | Only Pro-tier models gate on quota, and SWE-1.6 is Free tier | Switch to `--model swe-1.6` for the duration, or wait for the Pro window to reset |
| Task ran but no files changed | `--permission-mode auto` paused on a write confirmation in non-interactive mode | Re-dispatch with operator-approved `--permission-mode dangerous`, or run interactively |
| `Self-invocation refused` | The caller is already inside a local Devin session (`DEVIN_*` env, `devin` ancestry or a session lock) | Use a different runtime or exit the current Devin session first |
| Cloud-handoff dispatch refused | Account lacks cloud entitlement or operator did not confirm | Verify account provisioning and restate with explicit cloud-handoff keywords plus operator confirmation |
| Background dispatch hangs at 0% CPU | Missing `</dev/null` so Devin's stdin stays open | Append `</dev/null` to the command |
| Context too large or truncated | The prompt references broad paths instead of specific files | Use `--prompt-file <path>` and split large tasks |

---

## 7. FAQ

**Q: Why use Devin instead of Codex or Claude Code?**

A: Reach for Devin when the task benefits from Cognition's SWE-1.6 coding-specialized model, when you want the local-to-cloud handoff for long-running work that returns a PR after you disconnect, or when you need the ACP bridge or MCP ops surface. Reach for cli-codex when you need sandboxed edits or live web search, and cli-claude-code when you need deep extended thinking or `--json-schema` output.

**Q: What does the cloud handoff do and what does it cost?**

A: Cloud handoff migrates your live local Devin session to a Cognition cloud VM. The cloud agent keeps working asynchronously and opens a PR when it finishes, so you can close your laptop while it runs. It transmits your local repo state to Cognition's cloud sandbox and consumes Devin units, and the skill gates every handoff behind an explicit operator confirmation.

**Q: SWE-1.6 or DeepSeek v4? Which do I pick?**

A: Default to SWE-1.6 for clearly-defined simple-to-medium tasks. It is fast, coding-specialized and runs on the Free tier. Reach for DeepSeek v4 when the task is ambiguous, multi-step, reasoning-bound or broad in scope. DeepSeek v4 consumes Pro quota and can run 15 minutes or longer.

**Q: What is the difference between `auto` and `dangerous` permission modes?**

A: `auto` (the default) auto-approves read-only tools and prompts on write and exec actions. `dangerous` auto-approves all tools, including destructive operations like file deletion and git history rewrite. The skill requires explicit operator approval before escalating to `dangerous`.

**Q: The task ran but nothing changed. What happened?**

A: You hit the auto permission-mode trap. In a non-interactive dispatch nobody is there to approve the write step, so the agent reads your files and plans the changes but never writes. Re-dispatch with operator-approved `--permission-mode dangerous`, or run the task interactively.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios grouped by category: CLI invocation, permission modes, model presets, Devin surfaces, session continuity, cloud handoff, the self-invocation guard, cross-AI dispatch and the ACP bridge.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-devin/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md` |
| Default dispatch | `devin --prompt-file /tmp/smoke.md --model swe-1.6 --permission-mode auto` returns a coherent response |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI flags, subcommands, models, auth and config reference |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Three use cases: external dispatch, ACP bridge and cloud-handoff initiation |
| [`references/devin_tools.md`](./references/devin_tools.md) | Unique Devin capabilities and cross-CLI comparison |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | The model, permission-mode and prompt-file routing analog |
| [`references/cloud_handoff.md`](./references/cloud_handoff.md) | The local-to-cloud handoff narrative and operator-confirmation gate |
| [`references/deep-loop-iter-contract.md`](./references/deep-loop-iter-contract.md) | The deep-research and deep-review per-iter executor contract |
| [`references/agent-config-recipes.md`](./references/agent-config-recipes.md) | Canonical agent-config shapes for research, review and synthesis dispatches |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | CLEAR 5-check, framework selection and the pre-planning contract |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste templates for common dispatch shapes |
