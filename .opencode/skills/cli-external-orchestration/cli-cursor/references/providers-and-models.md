---
title: cli-cursor Providers, Models & Invocation
description: The dedicated per-mode catalog of the Cursor provider, the enforced 20-id model allowlist, defaults, the suffix-baked effort lever and dispatch shape reachable through the cli-cursor mode.
trigger_phrases:
  - "cursor providers and models"
  - "which model for cursor dispatch"
  - "cursor allowlist supported models"
  - "cursor default model composer"
  - "cursor grok glm effort suffix"
importance_tier: normal
contextType: implementation
version: 1.3.0.0
---

# cli-cursor Providers, Models & Invocation

The single catalog of the provider, model ids, defaults, effort lever, and dispatch shape the cli-cursor mode can reach. Unlike sibling modes, cli-cursor dispatch is scoped to an ENFORCED 20-id allowlist — this file lists all twenty inline because that list is a safety contract.

---

## 1. OVERVIEW

### Core Principle
One place to answer "which provider, which model, which effort, how to dispatch" for cli-cursor. This mode reaches exactly one backing provider — Cursor — and is deliberately narrow: dispatch is scoped to a hard-enforced 20-id allowlist, and Cursor's own `auto` router is excluded.

### When to Use
- Choosing a `--model <id>` for a `cursor-agent -p` dispatch from within the enforced allowlist
- Selecting a reasoning-effort tier (there is no `--effort` flag — the tier is baked into the id suffix)
- Recalling the default model and the canonical non-interactive invocation shape

### Scope
This file enumerates the provider/model/effort facts and the dispatch envelope. It does NOT own: the full `cursor-agent` flag surface, auth pre-flight, workspace-trust, and troubleshooting (see [cli-reference.md](./cli-reference.md)), the orchestration/dispatch patterns (see [integration-patterns.md](./integration-patterns.md)), or the runtime allowlist enforcement (see §6).

### Authority pointers
- Full CLI flags, subcommands, auth pre-flight, troubleshooting → [cli-reference.md](./cli-reference.md)
- Dispatch envelope + orchestration patterns → [integration-patterns.md](./integration-patterns.md)
- Live full roster on a given install → `cursor-agent --list-models` (150+ ids; NOT this skill's scope — see §2)

---

## 2. PROVIDERS & MODELS

cli-cursor has ONE backing provider — **Cursor** — reached through the `cursor-agent` binary. Cursor's live roster spans 150+ hosted-frontier ids (GPT/Claude/Gemini/Grok/GLM/Kimi families), but **cli-cursor dispatch is scoped to exactly these 20 ids — this is an ENFORCED allowlist, not a reference list.** Dispatching any off-list id HARD-FAILS before a command is built (see §6). `auto` (Cursor's own router) is deliberately EXCLUDED — it can silently resolve to a model outside this set, defeating the point of enforcing one.

### Cursor

Sorted alphabetically by model id, not grouped by family.

| # | Allowed model id | Family | Default? | Notes |
|---|------------------|--------|----------|-------|
| 1 | `composer-2.5` | Composer (Cursor-native) | **Default** | Cursor's own house model; the default absent other direction |
| 2 | `composer-2.5-fast` | Composer (Cursor-native) | — | Low-latency Composer variant for trivial/quick tasks |
| 3 | `cursor-grok-4.5-high` | Grok 4.5 (via Cursor) | — | High thinking tier |
| 4 | `cursor-grok-4.5-high-fast` | Grok 4.5 (via Cursor) | — | High tier, low-latency `-fast` variant |
| 5 | `cursor-grok-4.5-low` | Grok 4.5 (via Cursor) | — | xAI Grok 4.5, low thinking tier |
| 6 | `cursor-grok-4.5-low-fast` | Grok 4.5 (via Cursor) | — | Low tier, low-latency `-fast` variant |
| 7 | `cursor-grok-4.5-medium` | Grok 4.5 (via Cursor) | — | Medium thinking tier |
| 8 | `cursor-grok-4.5-medium-fast` | Grok 4.5 (via Cursor) | — | Medium tier, low-latency `-fast` variant |
| 9 | `cursor-grok-4.6-high` | Grok 4.6 (via Cursor) | — | High thinking tier |
| 10 | `cursor-grok-4.6-high-fast` | Grok 4.6 (via Cursor) | — | High tier, low-latency `-fast` variant |
| 11 | `cursor-grok-4.6-low` | Grok 4.6 (via Cursor) | — | xAI Grok 4.6, low thinking tier |
| 12 | `cursor-grok-4.6-low-fast` | Grok 4.6 (via Cursor) | — | Low tier, low-latency `-fast` variant |
| 13 | `cursor-grok-4.6-medium` | Grok 4.6 (via Cursor) | — | Medium thinking tier |
| 14 | `cursor-grok-4.6-medium-fast` | Grok 4.6 (via Cursor) | — | Medium tier, low-latency `-fast` variant |
| 15 | `cursor-grok-4.6-xhigh` | Grok 4.6 (via Cursor) | — | Extra-high thinking tier — new in 4.6; 4.5 has no xhigh tier |
| 16 | `cursor-grok-4.6-xhigh-fast` | Grok 4.6 (via Cursor) | — | Extra-high tier, low-latency `-fast` variant — new in 4.6 |
| 17 | `glm-5.2-high` | GLM 5.2 (via Cursor) | — | Z.AI GLM 5.2, High tier |
| 18 | `glm-5.2-max` | GLM 5.2 (via Cursor) | — | Z.AI GLM 5.2, Max (paid) tier |
| 19 | `gpt-5.6-luna-max` | GPT-5.6 Luna (via Cursor) | — | Max thinking tier; first GPT-5.6 persona in the allowlist |
| 20 | `gpt-5.6-luna-max-fast` | GPT-5.6 Luna (via Cursor) | — | Max tier, low-latency `-fast` variant |

**Any other id — including `auto`, every other GPT-5.6 persona/tier, and every Claude / Gemini / Kimi id in Cursor's full roster — is out of scope.** Escalate to the operator rather than dispatching or silently substituting the closest-sounding allowed model. Do NOT query `cursor-agent --list-models` to justify an off-list id; that command lists Cursor's full roster, not this skill's scope.

**Grok 4.6 joins Grok 4.5 (2026-08-12).** Cursor's live roster carries both `cursor-grok-4.5-*` and `cursor-grok-4.6-*` families side by side (confirmed via `cursor-agent --list-models`). This skill's curated allowlist adds all 8 4.6 ids alongside the existing 6 4.5 ids — an addition, not a swap. 4.6 ships a fourth tier, `xhigh`, that 4.5 never had. All 8 new ids were dispatch-tested end to end (`cursor-agent -p --model cursor-grok-4.6-high "..."` and `...-xhigh` both returned a live model response), and the parameterized `cursor-grok-4.6[effort=high]` bracket was re-confirmed rejected (`Cannot use this model`, exit 1) before the addition was made.

**GPT-5.6 Luna Max joins the allowlist (2026-08-14).** `gpt-5.6-luna-max` and `gpt-5.6-luna-max-fast` are the first GPT-5.6 persona ids in the curated Cursor scope (18 → 20). Both were confirmed present verbatim in the live `cursor-agent --list-models` output on 2026-08-14 ("GPT-5.6 Luna 1M Max" / "GPT-5.6 Luna Max Fast"). Only the Max tier is curated in-scope — the other Luna tiers (none/low/medium/high/xhigh) and the Sol/Terra personas remain out of scope. Unlike the Grok 4.6 ids, these two were **list-verified only, not dispatch-tested** (operator decision), so this catalog makes no dispatch-test claim for them.

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `composer-2.5` |
| Default effort | baked into the id (Composer has no tier suffix; the default carries no `-low/-medium/-high`) |
| Default approval | `--auto-review` (Smart Auto) |
| Default sandbox | `--sandbox enabled` |
| Default format | `--output-format text` |

```bash
cursor-agent -p "<prompt>" \
  --model composer-2.5 \
  --auto-review \
  --sandbox enabled \
  --output-format text
```

If Cursor is not authenticated, the mode ASKS the operator to run `cursor-agent login` — it never silently swaps a model. See the auth pre-flight decision tree in [cli-reference.md](./cli-reference.md) §3. The exit code is never an availability signal (`cursor-agent -p` exits `0` even on auth failure) — always inspect output text.

---

## 4. REASONING-EFFORT / THINKING LEVER

**cli-cursor has NO separate effort flag.** There is no `--reasoning-effort`, no `--effort`, no `--variant`, and no `model[effort=...]` parameterized bracket. Effort is BAKED INTO the id suffix — you select a tier by choosing the exact enumerated id that carries it.

| Family | How to select effort | Available tiers (as id suffixes) |
|--------|----------------------|----------------------------------|
| Composer | No tier suffix; `-fast` is a latency variant, not an effort tier | `composer-2.5`, `composer-2.5-fast` |
| GLM 5.2 | Pick the exact tiered id | `-high`, `-max` |
| Grok 4.5 | Pick the exact id with the desired tier suffix (each has a `-fast` sibling) | `-low`, `-low-fast`, `-medium`, `-medium-fast`, `-high`, `-high-fast` |
| Grok 4.6 | Pick the exact id with the desired tier suffix (each has a `-fast` sibling) — adds `xhigh` beyond 4.5 | `-low`, `-low-fast`, `-medium`, `-medium-fast`, `-high`, `-high-fast`, `-xhigh`, `-xhigh-fast` |
| GPT-5.6 Luna | Only the Max tier is curated in-scope; `-fast` is the low-latency variant | `gpt-5.6-luna-max`, `gpt-5.6-luna-max-fast` |

**Bracket syntax is rejected outright by the CLI.** Live-tested against installed `cursor-agent 2026.07.23-e383d2b` with `composer-2.5[effort=high]`, Cursor's own `--help` example (`claude-opus-4-8[context=1m,effort=high,fast=false]`), and `cursor-grok-4.5[effort=high]`; each returned `Cannot use this model: ...` with exit 1 before repository dispatch code runs. Use `cursor-grok-4.6-high`, never `cursor-grok-4.6[effort=high]`.

**Id-form footgun.** The CLI-facing ids are DOTTED (`glm-5.2-high`, `glm-5.2-max`, `composer-2.5`) and are what you pass to `--model`. The deep-loop runtime's INTERNAL model uids use dashes instead (`glm-5-2` = "GLM-5.2 High", `glm-5-2-max` = "GLM-5.2 Max"). Do not pass an internal dash-form uid to `cursor-agent --model`, and do not pass a CLI dotted id where the runtime expects its uid — the two namespaces are not interchangeable.

---

## 5. HOW TO INVOKE

### Canonical dispatch shape
```bash
cursor-agent -p --model composer-2.5 "<prompt>"
```

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and terminate stdin:

```bash
MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 cursor-agent -p \
  --model composer-2.5 --auto-review --sandbox enabled --output-format text \
  "<prompt>" </dev/null > stdout.log 2> stderr.log
```

- `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer, and marks the dispatch as an orchestrated sub-session that SHARES the parent worktree (distinct from Cursor's own native `-w` worktree flag).
- `</dev/null` — pair with `cursor-agent -p ... &` inside a `while read` loop so the backgrounded process cannot race the loop for stdin lines. See [integration-patterns.md](./integration-patterns.md) §4.

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs` (executor kind `cli-cursor`), which lives outside this hub — see §6. The runtime is the single Cursor execution adapter; do not build a packet-local wrapper.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Allowlist enforcement (source of truth)** → `CURSOR_SUPPORTED_MODELS` / `isCursorModelAllowed` in [../../../system-deep-loop/runtime/lib/deep-loop/executor-config.ts](../../../system-deep-loop/runtime/lib/deep-loop/executor-config.ts). The 20-id list inline in §2 MIRRORS this array; the code ENFORCES it (a hard-rejecting check runs before any command is constructed). If the two ever diverge, the code wins — update §2 to match.
- **Fan-out dispatcher** → [../../../system-deep-loop/runtime/scripts/fanout-run.cjs](../../../system-deep-loop/runtime/scripts/fanout-run.cjs) (executor kind `cli-cursor`)
- **Per-model prompt-craft profiles** → [../../../sk-prompt/sk-prompt-models/assets/model-profiles.json](../../../sk-prompt/sk-prompt-models/assets/model-profiles.json)
- **Live full roster** → `cursor-agent --list-models` on the target install (NOT this skill's scope)

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `cursor-agent` flags, subcommands, auth pre-flight, model selection (§5), troubleshooting
- [integration-patterns.md](./integration-patterns.md) — cross-AI orchestration patterns, dispatch envelope, model-selection strategy
- [../SKILL.md](../SKILL.md) — cli-cursor mode overview, routing, and the enforced-allowlist rules
