---
title: cli-devin
description: Cross-AI dispatcher that delegates a task to Cognition's Devin CLI for autonomous coding with a four-model preset and the family-unique local-to-cloud handoff.
trigger_phrases:
  - "devin"
  - "devin cli"
  - "delegate to devin"
  - "swe-1.6"
  - "cloud handoff"
  - "cognition devin"
---

# cli-devin

> Dispatch a task to Cognition's `devin` CLI for autonomous coding, then optionally hand the session to a cloud VM that keeps working and returns a PR.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Autonomous coding with a four-model preset, and the family-unique local-to-cloud handoff for long-running work |
| **Invoke with** | "devin", "delegate to devin", "cloud handoff", "swe-1.6" or auto-routing on Devin keywords |
| **Works on** | Any external runtime (Claude Code, Codex, Gemini, OpenCode, raw shell) that needs to reach the `devin` binary |
| **Produces** | Code changes inside your workspace, or a cloud-handoff PR from a Devin VM after you close your laptop |

---

## 2. OVERVIEW

### Why This Skill Exists

When you want Cognition's coding-specialized SWE-1.6 model, or you need to kick off a multi-hour task and walk away, the `devin` binary has no clean dispatch path from an external runtime. You hand-build the invocation, pick between auto and dangerous permission modes and guess whether to pass a prompt file or a positional prompt. If your calling runtime is itself a local Devin session, a self-dispatch loops and burns units. The worst trap: a long task stalls on a write confirmation in auto mode because you are not there to approve it. The skill standardizes the dispatch, gates the cloud handoff behind operator confirmation and refuses self-invocation.

### What It Does

cli-devin is the single routing point for external runtimes that need Devin for Terminal. A smart router scores the task against intent signals (local dispatch, cloud handoff, ACP bridge, MCP operations, permission modes, rules and skills) and loads only the references that match. The default dispatch is `devin --prompt-file /tmp/devin-prompt.md --model swe-1.6 --permission-mode auto`, running a Free-tier model that does not consume Pro quota. When the task needs to run for hours, the local-to-cloud handoff migrates the session to a Cognition cloud VM. A three-layer guard stops you from dispatching from inside a Devin session to yourself.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-devin dispatches to Devin and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v devin
```

If nothing prints, install it with `curl -fsSL https://cli.devin.ai/install.sh | bash`.

**Step 2: Run the default dispatch.**

```bash
devin --prompt-file /tmp/devin-prompt.md \
  --model swe-1.6 \
  --permission-mode auto \
  --config "$HOME/.config/devin/config.json"
```

Devin runs locally with Cognition's coding-specialized model on the Free tier. The output streams to stdout.

**Step 3: Switch to DeepSeek v4 for complex work.**

```bash
devin --prompt-file /tmp/devin-prompt.md \
  --model deepseek-v4 \
  --permission-mode auto
```

DeepSeek v4 handles ambiguous problems, multi-step work and deep reasoning. This consumes Pro quota.

**Step 4: Run the auth pre-flight before your first dispatch.**

```bash
devin auth status
```

Expected: `Authenticated as <handle> · profile=<name>`. If unauthenticated, run `devin auth login`.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt and passes it to `devin` with the right model, permission mode and config. Devin processes it through its internal agent loop with full tool access (file operations, shell commands, MCP servers and custom rules) and returns the result. The caller validates the output and integrates it. The whole round-trip is non-interactive: send the prompt, get the response, exit. For background dispatches, capture stdout and stderr to a log, append `</dev/null` and run in the background.

### The Self-Invocation Guard

If the agent reading this skill is itself running inside a local Devin session, the skill refuses to load. The guard checks three layers in order:

1. Any `DEVIN_*` environment variable, which Devin sets on session start.
2. Process ancestry, where a `devin` parent in the tree trips the guard.
3. Lock files under `~/.config/devin/sessions/<id>/lock`, which signal an active session.

When any layer matches, the skill returns a refusal and loads nothing. The cli-X family exists for cross-AI delegation. A running CLI skill never dispatches itself.

### The Cloud-Handoff Exception

The one case where a local Devin session may still use this skill is an explicit cloud-handoff request. Cloud handoff migrates the session to a separate Devin cloud VM, a different environment with a different session ID, not a self-dispatch. The prompt must include explicit cloud-handoff keywords ("cloud handoff", "hand off to cloud") and the operator must confirm in the same turn. The skill never auto-initiates a handoff because cloud sessions transmit local repo state to Cognition's cloud sandbox and consume Devin units.

### The Four-Model Preset

Devin ships four model presets, and the skill selects one per dispatch.

| Model | ID | When to pick it |
|---|---|---|
| **Cognition SWE-1.6** (default) | `swe-1.6` | Context gathering, tool use and clearly-defined simple-to-medium tasks. Free tier, does not consume Pro quota. |
| **DeepSeek v4** (primary complex) | `deepseek-v4` | Ambiguous problems, multi-step work, deep reasoning, large refactors, root-cause debugging. |
| **GLM 5.1** (complex fallback) | `glm-5.1` | Complex agentic or tool-use-heavy work when DeepSeek v4 does not fit. |
| **Kimi k2.6** (complex fallback) | `kimi-k2.6` | Complex large-context work (long files, sprawling diffs, multi-repo grep) when DeepSeek v4 does not fit. |

The selection strategy is simple. Default to SWE-1.6. When the task is complex, use DeepSeek v4. If DeepSeek v4 does not fit or deliver, fall back to GLM 5.1 for agentic work or Kimi k2.6 for large-context work. Never switch models silently, honor the operator's phrasing.

Two things to know. DeepSeek v4 dispatches can exceed 15 minutes. Set a 25-minute timeout for harnesses using this preset. Kimi k2.6 occasionally hangs around 25 minutes on complex fixtures. Bump the timeout to 30 minutes or accept the failure rate across multiple fixtures.

### Permission Modes

Devin's two permission modes control what the agent can do without a human in the loop.

`auto` is the default. It auto-approves read-only tools (file reads, directory listings, grep) and pauses for confirmation on file modifications and command execution. This is the safe choice for most dispatches.

`dangerous` auto-approves every tool. The skill requires explicit operator approval before it escalates to this mode, and the escalation must be recorded in the dispatch log. Use it only for unattended dispatches where destructive operations are expected and the operator has reviewed them.

### Auth Pre-Flight

Before the first dispatch each session, the skill checks `devin auth status`. Authenticated sessions proceed. Missing or expired tokens surface `devin auth login` and wait. The skill never auto-logins. Auth flows through Cognition's Codeium and Windsurf bridge at `server.codeium.com`. Credentials live at `~/.local/share/devin/credentials.toml` and the config lives at `~/.config/devin/config.json`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-devin when a task benefits from Cognition's coding-specialized SWE-1.6 model, when it needs the local Devin agent loop with MCP servers and custom rules, when you want to try multiple models against the same task or when the work is long enough to hand off to a cloud VM. Skip it for simple one-line lookups the caller can answer directly, for raw model dispatch with no agent loop (cli-codex or cli-claude-code is leaner) and for the interactive Devin TUI slash commands, which are operator-driven and not skill-orchestrated.

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
| `command not found: devin` | CLI not installed or PATH not updated | `curl -fsSL https://cli.devin.ai/install.sh | bash`, then restart your terminal |
| `Not authenticated` or auth error | No active Devin session | Run `devin auth login`. Do not auto-login. |
| `Pro · 0% remaining` banner, complex-model dispatch fails | Pro-tier model quota exhausted | Switch to `--model swe-1.6` (Free tier) for the duration of the Pro window |
| Task ran but no files changed | `--permission-mode auto` paused on a write confirmation | Re-dispatch with operator-approved `--permission-mode dangerous` or run interactively |
| Self-invocation refused | The caller is already inside a local Devin session | Use a sibling cli-* skill, a fresh shell or restate with explicit cloud-handoff keywords |
| Cloud handoff refused | Account lacks cloud entitlement or operator did not confirm | Confirm account provisioning and restate with explicit operator confirmation |
| Background dispatch hangs at 0% CPU | Missing `</dev/null` | Append `</dev/null` so Devin's stdin is closed |
| Context too large or truncated output | Prompt references broad paths instead of specific files | Use `--prompt-file` and split large tasks |

---

## 7. FAQ

**Q: Why not just call `devin` directly from my shell?**

A: You can. This skill exists for when an external AI assistant (Claude Code, Codex, Gemini, OpenCode) needs to dispatch to Devin programmatically. It handles model selection, permission-mode mapping, auth pre-flight and the self-invocation guard so the calling AI does not have to build its own CLI wrapper.

**Q: What does the cloud handoff do and what does it cost?**

A: Cloud handoff migrates your live local Devin session to a Cognition cloud VM. The cloud agent keeps working asynchronously and opens a PR when it is done. You can close your laptop while it runs. It transmits your local repo state to Cognition's cloud sandbox and consumes Devin units. The skill gates every handoff behind an explicit operator confirmation. See `references/cloud_handoff.md`.

**Q: SWE-1.6 or DeepSeek v4? Which do I pick for this task?**

A: Default to SWE-1.6 for clearly-defined simple-to-medium tasks. It is fast, coding-specialized and runs on the Free tier. Reach for DeepSeek v4 when the task is complex: ambiguous requirements, multi-step work, deep reasoning or broad in scope. DeepSeek v4 consumes Pro quota.

**Q: When should I use Devin instead of cli-codex or cli-claude-code?**

A: Reach for Devin when the task needs Cognition's coding-specialized SWE-1.6 model, when it benefits from Devin's internal agent loop with MCP servers and custom rules or when you want the cloud-handoff option. Reach for cli-codex when the task needs sandboxed edits or live web search. Reach for cli-claude-code when it needs deep extended thinking or structured JSON output.

**Q: The task ran but nothing changed. What happened?**

A: You hit the auto permission-mode trap. `--permission-mode auto` pauses on write confirmations. In a non-interactive dispatch, nobody is there to approve. The agent reads your files and plans the changes, but never writes because auto mode blocked the write step. Re-dispatch with operator-approved `--permission-mode dangerous` or run the task interactively.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios grouped by category: CLI invocation, permission modes, model presets, Devin surfaces, session continuity, cloud handoff, self-invocation guard, cross-AI dispatch and ACP bridge.

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
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete CLI subcommands, flags, slash commands and config reference |
| [`references/integration_patterns.md`](./references/integration_patterns.md) | Cross-AI orchestration patterns and workflows |
| [`references/devin_tools.md`](./references/devin_tools.md) | Unique Devin capabilities and cross-CLI comparison |
| [`references/agent_delegation.md`](./references/agent_delegation.md) | Model, permission-mode and prompt-file routing analog |
| [`references/cloud_handoff.md`](./references/cloud_handoff.md) | Local-to-cloud handoff narrative and operator-confirmation gate |
| [`references/deep-loop-iter-contract.md`](./references/deep-loop-iter-contract.md) | Deep-research and deep-review per-iter contract |
| [`references/agent-config-recipes.md`](./references/agent-config-recipes.md) | Canonical agent-config JSON shapes for deep-loop dispatches |
| [`assets/prompt_quality_card.md`](./assets/prompt_quality_card.md) | CLEAR 5-check, framework selection and pre-planning contract |
| [`assets/prompt_templates.md`](./assets/prompt_templates.md) | Copy-paste prompt templates per dispatch type |
