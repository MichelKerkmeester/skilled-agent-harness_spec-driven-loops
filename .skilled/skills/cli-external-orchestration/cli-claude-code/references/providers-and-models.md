---
title: cli-claude-code Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, model id, default, reasoning-effort lever and dispatch shape reachable through the cli-claude-code mode.
trigger_phrases:
  - "claude code providers and models"
  - "which model for claude code dispatch"
  - "claude code effort thinking lever"
  - "claude code default model sonnet"
  - "claude opus sonnet haiku dispatch"
importance_tier: normal
contextType: implementation
version: 1.5.0.5
---

# cli-claude-code Providers, Models & Invocation

The single catalog of the provider, model ids, defaults, `--effort` thinking lever, and dispatch shapes the cli-claude-code mode can reach.

---

## 1. OVERVIEW

### Core Principle
One place to answer "which model, which effort, how to dispatch" for cli-claude-code. This mode is single-provider (Anthropic) and always reaches a small, fixed roster — so this file IS the catalog, with every model id inline.

### When to Use
- Choosing a `--model claude-*` id for a `claude -p` dispatch
- Mapping a desired reasoning depth onto the `--effort` flag
- Recalling the default model and the canonical non-interactive invocation shape

### Scope
This file enumerates the model/effort facts and the dispatch envelope. It does NOT own: the full `claude` flag surface, permission modes, auth pre-flight, and troubleshooting (see [cli-reference.md](./cli-reference.md)), per-model prompt-craft (see §6), or the fan-out / model-enforcement runtime (see §6).

### Authority pointers
- Full CLI flags, subcommands, permission modes, OAuth pre-flight, troubleshooting → [cli-reference.md](./cli-reference.md)
- Dispatch shapes + orchestration patterns → [integration-patterns.md](./integration-patterns.md)
- Live model availability on a given install → the calling environment's `--model` support

---

## 2. PROVIDERS & MODELS

cli-claude-code is single-provider: **Anthropic**. The model string passed to `--model` is always a `claude-*` id. The roster below is complete. Pin the exact id; the CLI also accepts the aliases `opus`, `sonnet`, `haiku` and `fable`, which resolve to the newest id in each family.

### Anthropic

| Model id | Default? | Role | Efforts |
|----------|----------|------|---------|
| `claude-sonnet-5-5` | **Default** | Sonnet 5.5, balanced: general tasks, code generation, reviews | all five |
| `claude-opus-5-5` | no | Opus 5.5, deepest Opus reasoning: architecture, complex trade-offs, subtle root causes | all five |
| `claude-haiku-5-5` | no | Haiku 5.5, fastest and cheapest: classification, formatting, simple queries, batch work. Use when the caller asks for it | all five |
| `claude-fable-5-1` | no | Fable 5.1, the current Fable. The CLI's model catalog names `fable` as its `best` alias | all five |

> **No Fable 5.5 yet.** Claude Code 2.1.293 rejects `claude-fable-5-5` with `unrecognized_model`, and its `fable` alias resolves to `claude-fable-5-1`. Pin `claude-fable-5-1`, or pass `--model fable` to get whichever Fable the installed CLI knows. Recheck with `claude -p --model claude-fable-5-5 --effort low "Reply with OK" </dev/null 2>&1` after a CLI update.

**Replaced ids.** The previous default `claude-sonnet-4-6` and the earlier `claude-sonnet-5` give way to `claude-sonnet-5-5`, and `claude-haiku-4-5-20251001` gives way to `claude-haiku-5-5`. The old ids were not probed when this roster was refreshed, so pin one only after confirming it answers.

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `claude-sonnet-5-5` |
| Default effort | none passed; the child resolves it (see §4) |
| Default format | `--output-format text` |

```bash
claude -p "<prompt>" \
  --model claude-sonnet-5-5 \
  --output-format text \
  2>&1
```

Always append `2>&1` to capture both stdout and stderr. For deep-reasoning work, override with `--model claude-opus-5-5 --effort high`, and raise the effort to `xhigh` or `max` when `high` is not enough. If Claude Code is not authenticated, the mode ASKS the operator to run `claude auth login`; it never substitutes an API key or a different model. See the OAuth pre-flight decision tree in [cli-reference.md](./cli-reference.md) §3 and the SKILL's "Provider Auth Pre-Flight".

**Why Sonnet 5.5 is the default.** It answered a live probe, it is what the `sonnet` alias resolves to, and it keeps the default in the same balanced family as before, so a caller that names no model gets the same cost and depth profile on the current generation. Opus and Fable stay opt-in for work that needs more depth.

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-claude-code expresses reasoning depth through the **`--effort`** flag. Every model in §2 takes all five levels: `low`, `medium`, `high`, `xhigh` and `max`. Claude Code 2.1.293 lists those five values in `claude --help`, and its model catalog marks each roster model with the `effort`, `xhigh_effort` and `max_effort` capabilities.

| Level | Flag | When to use it |
|-------|------|----------------|
| Low | `--effort low` | Classification, formatting, quick lookups, mechanical edits. Fastest and cheapest |
| Medium | `--effort medium` | Routine edits and short reviews. The built-in default of the 5.5 models |
| High | `--effort high` | Standard code generation, reviews and debugging. The usual pairing with Opus |
| Extra high | `--effort xhigh` | Architecture, hard trade-offs, subtle root causes, deep reviews |
| Max | `--effort max` | The hardest problems, where cost is secondary. Pair it with `--max-budget-usd` |

**When the flag is omitted.** The child takes the effort its loaded settings give it, a top-level `effortLevel` or a per-model entry under `modelSettings`, and otherwise the model's built-in default. Those settings set a model's default only. They never remove a level, so `--effort` always reaches all five. Pass `--effort` whenever the depth matters, so the result does not depend on the machine's settings.

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and capture stderr:

```bash
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 claude -p "<prompt>" \
  --model claude-sonnet-5-5 --output-format text 2>&1
```

- `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall on an interactive Gate-3 answer, and marks the run as an orchestrated sub-session so the worktree wrapper exec's in place rather than allocating its own worktree. See [../SKILL.md](../SKILL.md) §4 Rule 13.
- `2>&1` — REQUIRED to capture stderr; without it error and warning messages are lost. See [integration-patterns.md](./integration-patterns.md).
- `-p` (print) is mandatory for non-interactive dispatch; use `--permission-mode plan` for read-only review/analysis.

### Self-invocation guard
A `claude -p` dispatch must never run from inside a Claude Code session (a `$CLAUDECODE`-set, `claude`-in-ancestry, or state-lock signal) — that is a circular self-invocation. The guard is inline in [../SKILL.md](../SKILL.md) §2 "Self-Invocation Guard".

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs`, which lives outside this hub — see §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Fan-out dispatcher + model enforcement** → [fanout-run.cjs](../../../system-deep-loop/runtime/scripts/fanout-run.cjs)
- **Live model availability** → the calling environment's `--model` support on the target install

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `claude` flags, subcommands, permission modes, OAuth pre-flight, troubleshooting
- [integration-patterns.md](./integration-patterns.md) — cross-AI orchestration patterns and dispatch shapes
- [../SKILL.md](../SKILL.md) — cli-claude-code mode overview, routing, and default-invocation contract
