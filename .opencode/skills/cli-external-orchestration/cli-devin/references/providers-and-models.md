---
title: cli-devin Providers, Models & Invocation
description: The dedicated per-mode catalog of every model id, alias, default, permission-mode lever and dispatch shape reachable through the cli-devin mode.
trigger_phrases:
  - "devin providers and models"
  - "which model for devin dispatch"
  - "devin swe default model"
  - "devin permission mode effort lever"
  - "devin glm swe grok deepseek dispatch"
  - "devin model alias reference"
importance_tier: normal
contextType: implementation
version: 1.3.0.0
---

# cli-devin Providers, Models & Invocation

The single catalog of the models, aliases, defaults, permission-mode lever, and dispatch shapes the cli-devin mode can reach.

---

## 1. OVERVIEW

### Core Principle
One place to answer "which model, which uid, which permission mode, how to dispatch" for cli-devin. This mode is backed by **Cognition's Devin CLI** — a single binary that fronts 37 model families through family slugs, aliases, and model uids. This catalog curates the six families kept in scope for cli-devin: DeepSeek, Gemini, GLM-5.2, GPT-5.6 (Luna Max only), Grok (4.5 and 4.6), and SWE-1.7.

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

Devin resolves models through a single backing service (Cognition) that fronts 37 model families. The value passed to `--model` is a family slug, an alias, or a full model uid. This catalog is a **curated subset** — the six families kept in scope for cli-devin. Model uids, context, and tier are read live from `devin models list`.

### Cognition

Alphabetical by family, then by model uid within each family.

| Family | Model uid | Context | Notes |
|--------|-----------|---------|-------|
| DeepSeek | `deepseek-v4-flash-max` | 1M | DeepSeek V4 Flash, Max thinking tier (added 2026-08-14) |
| DeepSeek | `deepseek-v4-pro` | 1M | DeepSeek V4 Pro (uid `deepseek-v4`) |
| DeepSeek | `deepseek-v4-pro-max` | 1M | DeepSeek V4 Pro, Max thinking tier (added 2026-08-14) |
| Gemini | `gemini-3-7-flash-high` | 1M | Google Gemini 3.7 Flash High thinking tier; family slug `gemini-3.7-flash`, alias `gemini` (added 2026-08-15) |
| GLM-5.2 | `glm-5-2` | 200K | High — free tier |
| GLM-5.2 | `glm-5-2-1m` | 1M | High, 1M context |
| GLM-5.2 | `glm-5-2-max` | 200K | Max (paid) |
| GLM-5.2 | `glm-5-2-max-1m` | 1M | Max, 1M context |
| GLM-5.2 | `glm-5-2-none` | 200K | Reasoning disabled |
| GLM-5.2 | `glm-5-2-none-1m` | 1M | Reasoning disabled, 1M context |
| GPT-5.6 Luna | `gpt-5-6-luna-max` | 1M | Luna Max thinking; cheapest GPT-5.6 persona (added 2026-08-14) |
| GPT-5.6 Luna | `gpt-5-6-luna-max-priority` | 1M | Luna Max, Fast — `-priority` is Devin's Fast suffix (added 2026-08-14) |
| Grok 4.5 | `grok-4-5-high` | 500K | High effort |
| Grok 4.5 | `grok-4-5-low` | 500K | Low effort |
| Grok 4.5 | `grok-4-5-medium` | 500K | Medium effort |
| Grok 4.6 | `grok-4-6-high` | 500K | High effort |
| Grok 4.6 | `grok-4-6-low` | 500K | Low effort |
| Grok 4.6 | `grok-4-6-medium` | 500K | Medium effort |
| Grok 4.6 | `grok-4-6-xhigh` | 500K | Extra-high effort — new in 4.6; 4.5 has no xhigh tier |
| SWE-1.7 | `swe-1-7` | 262K | Max effort — free (beta) |
| SWE-1.7 | `swe-1-7-lightning` | 203K | Lightning speed tier (beta); the `swe` alias resolves here |
| SWE-1.7 | `swe-1-7-medium` | 262K | Medium effort — free (beta) |

### Notes on the roster
- Pass a family slug, alias, or full model uid to `--model` (e.g. `--model swe`, `--model grok-4-6-high`). The `swe` alias currently resolves to `swe-1-7-lightning`; pin the exact uid in scripts for predictability.
- **Grok 4.6 joins Grok 4.5 (2026-08-12).** Devin's live roster carries both a `grok-4.5` family and a `grok-4.6` family side by side (confirmed via `devin models list`). This skill's curated allowlist adds all 4 4.6 uids alongside the existing 3 4.5 uids — an addition, not a swap. 4.6 ships a fourth tier, `xhigh`, that 4.5 never had. All 4 new uids were dispatch-tested end to end (`devin -p --model grok-4-6-high -- "..."` and `...-xhigh` both returned a live model response) before being added.
- **DeepSeek Max tiers + GPT-5.6 Luna Max join (2026-08-14).** `deepseek-v4-flash-max` and `deepseek-v4-pro-max` (the Max thinking tier of each DeepSeek V4 family) and `gpt-5-6-luna-max` + `gpt-5-6-luna-max-priority` (the first GPT-5.6 persona in this catalog) were confirmed present verbatim in the live `devin models list` output on 2026-08-14. Devin encodes the "Fast" speed tier as the `-priority` suffix, not `-fast`, so `gpt-5-6-luna-max-priority` is the Fast variant of Luna Max. Unlike the Grok uids above, these four were **list-verified only, not dispatch-tested** (operator decision).
- **DeepSeek Flash is Max-thinking-only (policy).** Dispatch DeepSeek V4 Flash only via `deepseek-v4-flash-max` — on devin the max thinking tier is baked into the uid, and this roster carries no bare `deepseek-v4-flash`. The sibling cli-pi and cli-opencode surfaces reach the same tier through a flag: their fan-out builders pin `deepseek-v4-flash` to max thinking (`--thinking max` / `--variant max`).
**Gemini 3.7 Flash High joins (2026-08-15).** `gemini-3-7-flash-high` is the first Gemini uid in this catalog (five families → six). Devin labels it "Gemini 3.7 Flash High" with a 1M context window; the minimal/low/medium sibling tiers stay out of scope. The uid was confirmed present verbatim in the live `devin models list` output and **dispatch-tested end-to-end** on 2026-08-15 (probe dispatch returned a live model response, exit 0).
- GLM tier suffixes stack: `-max` = Max reasoning, `-1m` = 1M context, `-none` = reasoning disabled; `glm-5-2` (no suffix) is GLM-5.2 High (free tier).
- This is a curated subset. Devin's full 37-family roster (Claude, GPT, other Gemini, Kimi, older SWE, and the `adaptive` router) is available via `devin models list` but is out of this catalog's scope.
- Subagents dispatched via `run_subagent` take a profile, not a model: `subagent_explore` runs on the cheap default, `subagent_general` inherits the parent model. To pin a model on a write-capable subagent, use a custom `.devin/agents/<name>/AGENT.md` with a `model:` field.

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `swe` (alias → `swe-1-7-lightning`) |
| Default permission mode | `--permission-mode accept-edits` |
| Prompt separator | `--` before the print-mode prompt (required) |

```bash
devin -p \
  --model swe \
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

> Note: `devin -p` defaults to `auto` (read-only). File-modification dispatches silently prompt or no-op unless you pass `--permission-mode accept-edits` (or higher).

`--sandbox` is orthogonal containment, not a fifth permission mode. It enables Devin's OS sandboxing and does not select an additional `--permission-mode` value; combine it with one of the four modes above when containment is required. This separation matches the live `devin --help` surface.

**2. Model thinking level — interactive only.** Some models support configurable reasoning depth, but it is **not exposed as a headless flag**. In an interactive REPL session, cycle the thinking level with `Alt+T` (macOS: `Opt+T`). For non-interactive `-p` dispatch, choose the depth by picking the model instead (`grok-4-6-high`/`-xhigh`, `deepseek-v4-pro-max`/`deepseek-v4-flash-max`, or `gpt-5-6-luna-max` for deep/max reasoning; `swe-1-7-lightning` for minimal), or switch the interactive model with `/model <name>` / `Alt+T`. The Max thinking tier is baked into the uid (`…-max`); the Fast speed tier is the `-priority` suffix (e.g. `gpt-5-6-luna-max-priority`), not a separate flag.

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env, keep the `--` separator, and terminate stdin:

```bash
MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 devin -p \
  --model swe --permission-mode accept-edits \
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

- **Per-model prompt-craft profiles** → `.opencode/skills/sk-prompt/sk-prompt-models/assets/model-profiles.json`
- **Fan-out dispatcher + model enforcement** → `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (executor kind `cli-devin`)
- **Live model ids** → `devin models` on the target install

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `devin` flags, subcommands, auth pre-flight, permission modes, troubleshooting
- [integration-patterns.md](./integration-patterns.md) — dispatch shapes + failure-mode matrix
- [cloud-handoff.md](./cloud-handoff.md) — `/handoff` cloud-session mechanics and state transfer
- [../SKILL.md](../SKILL.md) — cli-devin mode overview, routing, and self-invocation guard
