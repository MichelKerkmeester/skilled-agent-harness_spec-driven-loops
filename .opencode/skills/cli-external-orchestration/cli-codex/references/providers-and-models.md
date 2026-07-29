---
title: cli-codex Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, model id, default, reasoning-effort lever and dispatch shape reachable through the cli-codex mode.
trigger_phrases:
  - "codex providers and models"
  - "which model for codex dispatch"
  - "codex reasoning effort lever"
  - "codex default model gpt-5.5"
  - "codex gpt-5.6 luna terra sol"
  - "codex exec model reasoning effort"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# cli-codex Providers, Models & Invocation

The single catalog of the provider, model ids, defaults, `model_reasoning_effort` lever, and dispatch shapes the cli-codex mode can reach.

---

## 1. OVERVIEW

### Core Principle
One place to answer "which model, which effort, how to dispatch" for cli-codex. This mode is single-provider (OpenAI via ChatGPT OAuth) — the choice space is one provider, four models, and one effort ladder capped per model.

### When to Use
- Choosing a `--model` for a `codex exec` dispatch
- Mapping a desired reasoning effort onto `-c model_reasoning_effort=` for a given model (and staying under its ceiling)
- Recalling the default model + effort + service tier and the canonical non-interactive invocation shape

### Scope
This file enumerates the provider/model/effort facts and the dispatch envelope. It does NOT own: the full `codex exec` flag surface, sandbox modes, auth pre-flight, or troubleshooting (see [cli-reference.md](./cli-reference.md)), the cross-AI orchestration patterns (see [integration-patterns.md](./integration-patterns.md)), per-model prompt-craft (see §6), or the fan-out / model-enforcement runtime (see §6).

### Authority pointers
- Full CLI flags, subcommands, sandbox modes, auth pre-flight, troubleshooting → [cli-reference.md](./cli-reference.md)
- Dispatch envelope + orchestration patterns + failure-mode traps → [integration-patterns.md](./integration-patterns.md)
- Routing, default-invocation contract, self-invocation guard → [../SKILL.md](../SKILL.md)

---

## 2. PROVIDERS & MODELS

cli-codex is backed by a single provider — **OpenAI**, authenticated through ChatGPT OAuth only (`codex login`; no API key). The model string passed to `--model` / `-m` is a bare OpenAI slug. All four models run on the `fast` service tier (`-c service_tier="fast"`); each caps at a different reasoning-effort ceiling.

### OpenAI

| Model id | Default? | Effort ceiling / notes |
|----------|----------|------------------------|
| `gpt-5.5` | **Default** | Ceiling `xhigh`; default effort `medium`. General delegation — generation, review, docs, architecture, research |
| `gpt-5.6-luna` | — | Ceiling `max`. Implementation-heavy work wanting deeper reasoning; the `luna-impl` profile pins `max` |
| `gpt-5.6-terra` | — | Ceiling `max`. GPT-5.6 fast sibling; no dedicated config profile — call directly via `-m gpt-5.6-terra` |
| `gpt-5.6-sol` | — | Ceiling `ultra`. Verification / review and the hardest planning — the only model reaching `ultra`; the `sol-verify` profile pins `xhigh` |

`--oss` (local Ollama models) exists as an escape hatch for local experimentation only — not a production dispatch target. See [cli-reference.md](./cli-reference.md) §4.

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `gpt-5.5` |
| Default effort | `-c model_reasoning_effort="medium"` |
| Service tier | `-c service_tier="fast"` |
| Default sandbox | `--sandbox workspace-write` (for edits) / `read-only` (for review/analysis) |

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  "<prompt>"
```

Honor explicit user phrasing verbatim ("Use gpt 5.5 high fast", "Use gpt 5.6 sol ultra"). Model stays on `gpt-5.5` and service tier stays on `fast` unless the user names a different one; keep the effort within the chosen model's ceiling (§4). If Codex is not authenticated, the mode ASKS the user to run `codex login` — it never substitutes an API key or a different model. See the auth pre-flight decision tree in [../SKILL.md](../SKILL.md) §3.

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-codex expresses reasoning effort through the config override **`-c model_reasoning_effort="<level>"`**. There is **no `--reasoning-effort`, `--reasoning`, or `--quiet` flag** — the config override is the only lever. The `fast` service tier is a separate axis set with `-c service_tier="fast"`.

**Effort ladder** (ascending, 8 levels): `none` · `minimal` · `low` · `medium` · `high` · `xhigh` · `max` · `ultra`.

Per-model ceilings — set the effort within the chosen model's cap:

| Model | Effort ceiling | Notes |
|-------|----------------|-------|
| `gpt-5.5` | `xhigh` | Default effort `medium` |
| `gpt-5.6-luna` | `max` | `luna-impl` profile pins `max` |
| `gpt-5.6-terra` | `max` | Callable directly; no dedicated profile |
| `gpt-5.6-sol` | `ultra` | Only model reaching `ultra`; `sol-verify` profile pins `xhigh` |

Selection heuristic: default `gpt-5.5 medium`; raise to `high` / `xhigh` for architecture, security, and complex planning; escalate the model when the task wants reasoning past `xhigh` — `gpt-5.6-luna max` for implementation, `gpt-5.6-sol xhigh` / `ultra` for verification and review; drop to `low` / `minimal` for trivial lookups. Effort can also live in `config.toml`, a `[profiles.<name>]` block, or `plan_mode_reasoning_effort` — see [cli-reference.md](./cli-reference.md) §5.

---

## 5. HOW TO INVOKE

### Canonical dispatch shape
```bash
codex exec --model gpt-5.5 -c model_reasoning_effort="high" "<prompt>"
```

`codex exec` defaults to `--sandbox read-only`, so file-modification tasks silently no-op unless you add `--sandbox workspace-write` (or `--full-auto`). See [integration-patterns.md](./integration-patterns.md).

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and terminate stdin:

```bash
MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 codex exec \
  --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" \
  -c approval_policy=never --sandbox workspace-write \
  "<prompt>" </dev/null > stdout.log 2>&1
```

- `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer, and shares the parent's worktree instead of allocating its own.
- `</dev/null` — REQUIRED when backgrounding `codex exec` inside a `while read … done < file` loop; without it the backgrounded process inherits and drains the loop's stdin, silently dropping most dispatches. See [integration-patterns.md](./integration-patterns.md) §4 → "Silent Stdin Consumption".

### Self-invocation guard
A codex dispatch must not recursively re-enter a session already running inside Codex (detection: `CODEX_SESSION_ID` / any `CODEX_*` env var, `codex` in process ancestry, or `~/.codex/state/<id>/lock`). The guard refuses the dispatch — see [../SKILL.md](../SKILL.md) §2 "Self-Invocation Guard".

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by the shared deep-loop runtime (`fanout-run.cjs`, executor kind `cli-codex`), which lives outside this hub — see §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Per-model prompt-craft profiles** → `.opencode/skills/sk-prompt/sk-prompt-models/assets/model-profiles.json`
- **Fan-out dispatcher** → `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (executor kind `cli-codex`)
- **Named config profiles** (`luna-impl`, `sol-verify`, `review`, `debug`, …) → `.codex/config.toml` `[profiles.<name>]`; roster and routing in [agent-delegation.md](./agent-delegation.md)

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `codex exec` flags, sandbox modes, model table, auth, config, troubleshooting
- [integration-patterns.md](./integration-patterns.md) — cross-AI orchestration patterns + dispatch failure-mode traps
- [../SKILL.md](../SKILL.md) — cli-codex mode overview, routing, default-invocation contract, self-invocation guard
