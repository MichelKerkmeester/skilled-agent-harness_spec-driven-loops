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
version: 1.0.0.0
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

cli-claude-code is single-provider: **Anthropic**. The model string passed to `--model` is always a `claude-*` id. The roster below is complete — pin the exact id the target CLI accepts.

| Model id | Default? | Notes (tier / use case) |
|----------|----------|-------------------------|
| `claude-opus-4-8` | — | Current flagship (Claude 5-era Opus) — deepest reasoning, highest quality; architecture, complex trade-offs, extended thinking |
| `claude-sonnet-5` | — | Current-generation balanced (Claude 5 family) — general tasks, code generation, reviews |
| `claude-fable-5` | — | Current-generation Claude 5 family dispatch |
| `claude-opus-4-6` | — | Prior-generation deep reasoning — architecture, complex trade-offs, extended thinking (`--effort high`) |
| `claude-sonnet-4-6` | **Default** | Prior-generation balanced — **current skill default** for most tasks |
| `claude-haiku-4-5-20251001` | — | Fastest, most cost-effective — classification, formatting, simple queries, batch ops; use only when explicitly requested |

> The default pin is `claude-sonnet-4-6`. `claude-opus-4-8` / `claude-sonnet-5` / `claude-fable-5` are the current Claude generation and are selectable via `--model` where the calling environment supports them — name a current-generation id explicitly when you want it.

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `claude-sonnet-4-6` |
| Default effort | (none — standard reasoning depth) |
| Default format | `--output-format text` |

```bash
claude -p "<prompt>" \
  --model claude-sonnet-4-6 \
  --output-format text \
  2>&1
```

Always append `2>&1` to capture both stdout and stderr. For deep-reasoning work, override with `--model claude-opus-4-6 --effort high`. If Claude Code is not authenticated, the mode ASKS the operator to run `claude auth login` — it never substitutes an API key or a different model. See the OAuth pre-flight decision tree in [cli-reference.md](./cli-reference.md) §3 and the SKILL's "Provider Auth Pre-Flight".

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-claude-code expresses reasoning depth through the **`--effort`** flag (extended-thinking tiers). Default skill behavior omits the flag (standard depth).

| Level | Flag | Behavior |
|-------|------|----------|
| Default | (no flag) | Standard reasoning depth |
| High | `--effort high` | Extended thinking with deep chain-of-thought — pair with Opus for architecture / complex trade-offs |
| Low | `--effort low` | Faster, less detailed responses |

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and capture stderr:

```bash
MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 claude -p "<prompt>" \
  --model claude-sonnet-4-6 --output-format text 2>&1
```

- `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall on an interactive Gate-3 answer, and marks the run as an orchestrated sub-session so the worktree wrapper exec's in place rather than allocating its own worktree. See [../SKILL.md](../SKILL.md) §4 Rule 13.
- `2>&1` — REQUIRED to capture stderr; without it error and warning messages are lost. See [integration-patterns.md](./integration-patterns.md).
- `-p` (print) is mandatory for non-interactive dispatch; use `--permission-mode plan` for read-only review/analysis.

### Self-invocation guard
A `claude -p` dispatch must never run from inside a Claude Code session (a `$CLAUDECODE`-set, `claude`-in-ancestry, or state-lock signal) — that is a circular self-invocation. The guard is inline in [../SKILL.md](../SKILL.md) §2 "Self-Invocation Guard".

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs`, which lives outside this hub — see §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Per-model prompt-craft profiles** → [model-profiles.json](../../../sk-prompt/sk-prompt-models/assets/model-profiles.json)
- **Fan-out dispatcher + model enforcement** → [fanout-run.cjs](../../../system-deep-loop/runtime/scripts/fanout-run.cjs)
- **Live model availability** → the calling environment's `--model` support on the target install

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `claude` flags, subcommands, permission modes, OAuth pre-flight, troubleshooting
- [integration-patterns.md](./integration-patterns.md) — cross-AI orchestration patterns and dispatch shapes
- [../SKILL.md](../SKILL.md) — cli-claude-code mode overview, routing, and default-invocation contract
