---
title: cli-devin Providers, Models & Invocation
description: The dedicated per-mode catalog of every model id, alias, default, permission-mode lever and dispatch shape reachable through the cli-devin mode.
trigger_phrases:
  - "devin providers and models"
  - "which model for devin dispatch"
  - "devin adaptive router default"
  - "devin permission mode effort lever"
  - "devin opus sonnet swe glm dispatch"
  - "devin model alias reference"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# cli-devin Providers, Models & Invocation

The single catalog of the models, aliases, defaults, permission-mode lever, and dispatch shapes the cli-devin mode can reach.

---

## 1. OVERVIEW

### Core Principle
One place to answer "which model, which alias, which permission mode, how to dispatch" for cli-devin. This mode is backed by **Cognition's Devin CLI** — a single binary that fronts an intelligent `adaptive` router plus a multi-provider roster (Anthropic, OpenAI, Google, Cognition, and open-source models) through short-name aliases.

### When to Use
- Choosing a `--model <alias>` for a `devin -p` dispatch
- Mapping desired autonomy onto the `--permission-mode` lever (Devin has no headless reasoning-effort flag)
- Recalling the default model and the canonical non-interactive invocation shape

### Scope
This file enumerates the model/alias/default facts and the dispatch envelope. It does NOT own: the full `devin` flag surface, auth pre-flight, session and troubleshooting tables (see [cli-reference.md](./cli-reference.md)), per-model prompt-craft (see §6), or the fan-out / model-enforcement runtime (see §6).

### Authority pointers
- Full CLI flags, subcommands, auth pre-flight, permission modes, troubleshooting → [cli-reference.md](./cli-reference.md)
- Dispatch envelope + failure-mode matrix → [integration-patterns.md](./integration-patterns.md)
- Live model ids on a given install → `devin models`

---

## 2. PROVIDERS & MODELS

Devin resolves models through a single backing service (Cognition). The value passed to `--model` is always a short **alias**; a short name always resolves to the latest version in that family. `adaptive` enables the intelligent model router that auto-selects the best model per task. Run `devin models` for the live roster on a given install.

| Model / alias | Notes (routes to / use case) |
|---------------|------------------------------|
| `adaptive` | **Default.** Intelligent model router — auto-selects the best model per task. General delegation. |
| `opus` | Claude Opus — complex refactoring, architecture changes, deep reasoning, security audits. |
| `sonnet` | Claude Sonnet — balanced coding, implementation, review. |
| `swe` | SWE-1.6 (Cognition) — fast, cost-effective edits, bug fixes, questions. |
| `swe-1-6-fast` | SWE-1.6 Fast — quickest turnaround for straightforward edits and lookups. |
| `gpt` | OpenAI GPT — multi-file refactors, OpenAI-model strengths, test generation. |
| `codex` | OpenAI coding-model (Codex) dispatch through Devin. |
| `gemini` | Google Gemini — Google-model tasks. |
| `deepseek` | DeepSeek — open-source model tasks. |
| `kimi` | Kimi — open-source model tasks. |
| `glm-5-2` | GLM-5.2 — open-source model tasks (base). |
| `glm-5-2-max` | GLM-5.2 max-reasoning variant. |
| `glm-5-2-1m` | GLM-5.2 with 1M context. |
| `glm-5-2-max-1m` | GLM-5.2 max-reasoning + 1M context. |
| `glm-5-2-none` | GLM-5.2 with reasoning disabled. |
| `glm-5-2-none-1m` | GLM-5.2 reasoning-disabled + 1M context. |

### Notes on the roster
- Short aliases (`opus`, `sonnet`, `swe`, `gpt`, `codex`, `gemini`) always resolve to the latest version in that family — pin behavior by always passing `--model` explicitly in scripts.
- The GLM `-max` / `-1m` / `-none` suffixes stack (e.g. `glm-5-2-max-1m` = max reasoning + 1M context); confirm the live suffix set with `devin models`.
- Subagents dispatched via `run_subagent` take a profile, not a model: `subagent_explore` runs on the cheap default (SWE-1.6), `subagent_general` inherits the parent model. To pin a model on a write-capable subagent, use a custom `.devin/agents/<name>/AGENT.md` with a `model:` field.

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `adaptive` |
| Default permission mode | `--permission-mode accept-edits` |
| Prompt separator | `--` before the print-mode prompt (required) |

```bash
devin -p \
  --model adaptive \
  --permission-mode accept-edits \
  -- \
  "<prompt>"
```

If Devin is not authenticated (`devin auth status` not "logged in"), the mode ASKS the operator to run `devin auth login` — it never substitutes a different auth method or a model the user did not approve. See the auth pre-flight decision tree in [cli-reference.md](./cli-reference.md) §3.

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-devin has **no headless reasoning-effort flag** — there is no `--variant` / `--effort` equivalent for non-interactive `devin -p` dispatch. Two distinct levers stand in its place:

**1. Permission mode (`--permission-mode`) — the autonomy lever.** This is what a dispatch actually controls: how much the agent may do without asking, not how hard it "thinks." Choose the least-permissive mode that lets the task complete.

| Mode | Flag | Behavior | Best for |
|------|------|----------|----------|
| Auto | `--permission-mode auto` | Auto-approves read-only tools; prompts for writes/shell | Review, analysis, research (`devin -p` default) |
| Accept Edits | `--permission-mode accept-edits` | Auto-approves workspace edits + read-only; prompts for shell | Code generation, refactoring (**skill default**) |
| Smart | `--permission-mode smart` | Auto-runs actions a fast model judges safe | Trusted workflows with judgment calls |
| Dangerous | `--permission-mode dangerous` | Auto-approves all tools without prompting | Full trust — **requires explicit user approval** |
| Autonomous | `--sandbox` (selects `autonomous`) | OS-sandbox-enforced auto-approval | Unattended execution with OS limits |

> Note: `devin -p` defaults to `auto` (read-only). File-modification dispatches silently prompt or no-op unless you pass `--permission-mode accept-edits` (or higher).

**2. Model thinking level — interactive only.** Some models support configurable reasoning depth, but it is **not exposed as a headless flag**. In an interactive REPL session, cycle the thinking level with `Alt+T` (macOS: `Opt+T`). For non-interactive `-p` dispatch, choose the depth by picking the model instead (`opus` for deep reasoning, `swe-1-6-fast` for minimal), or switch the interactive model with `/model <name>` / `Alt+T`.

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env, keep the `--` separator, and terminate stdin:

```bash
MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 devin -p \
  --model adaptive --permission-mode accept-edits \
  -- "<prompt>" </dev/null > stdout.log 2> stderr.log
```

- `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer, and marks the dispatch as an orchestrated sub-session so the worktree wrapper shares the parent worktree (SKILL.md §4 rules 15–16).
- `--` before the prompt — REQUIRED; without it the prompt can be parsed as CLI flags.
- `</dev/null` — REQUIRED before stdout/stderr redirects (and inside any `while read` loop); `devin -p` inherits the caller's stdin and silently drains it, dropping later dispatches. See [integration-patterns.md](./integration-patterns.md) §4.

### Self-invocation guard
A devin dispatch must not recursively re-enter a session already running inside Devin. The guard is packet-local and inline — see [../SKILL.md](../SKILL.md) §2 "Self-Invocation Guard" (detects `$DEVIN_PROJECT_DIR`, `devin` process ancestry, and active-session credentials).

### Cloud handoff
Devin's unique `/handoff` transfers the current session to a cloud VM (own shell, browser, full repo access) for long-running, browser-dependent, or CI-like work — see [cloud-handoff.md](./cloud-handoff.md).

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs` (executor kind `cli-devin`), which lives outside this hub — see §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Per-model prompt-craft profiles** → `.opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json`
- **Fan-out dispatcher + model enforcement** → `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (executor kind `cli-devin`)
- **Live model ids** → `devin models` on the target install

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `devin` flags, subcommands, auth pre-flight, permission modes, troubleshooting
- [integration-patterns.md](./integration-patterns.md) — dispatch shapes + failure-mode matrix
- [cloud-handoff.md](./cloud-handoff.md) — `/handoff` cloud-session mechanics and state transfer
- [../SKILL.md](../SKILL.md) — cli-devin mode overview, routing, and self-invocation guard
