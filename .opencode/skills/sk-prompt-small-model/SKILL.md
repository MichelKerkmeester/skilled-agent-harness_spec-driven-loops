---
name: sk-prompt-small-model
description: Sentinel for small-model optimization patterns covering SWE-1.6 + DeepSeek-v4-pro + Kimi-k2.6 + Qwen3.6 + GLM-5.1 + MiniMax across cli-devin and cli-opencode (DeepSeek API + opencode-go + MiniMax Token Plan `minimax-coding-plan` default / MiniMax Direct API `minimax` providers) dispatch paths. Routing anchor only; real patterns live in cli-devin/references/ and cli-opencode/references/.
allowed-tools: []
version: 0.1.0
---

<!-- Keywords: small-model, swe-1.6, deepseek-v4, kimi-k2.6, qwen3.6, glm-5.1, minimax-m3, minimax-2.7, minimax-coding-plan, minimax-token-plan, minimax-api, haiku, gemini-flash, opencode-go, deepseek-api, context-budget, output-verification, model-profiles, structured-permissions, quota-fallback -->

# Small-Model Optimization Sentinel

A discovery anchor that surfaces alongside `cli-devin` or `cli-opencode` whenever a small-model task is dispatched, then points operators at the executor-owned patterns.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- Dispatching to SWE-1.6 (Cognition free tier) via `cli-devin`
- Dispatching to DeepSeek-v4-pro, Kimi-k2.6, or GLM-5.1 (Cognition Pro plan) via `cli-devin`
- Dispatching to DeepSeek-v4-pro directly via `cli-opencode` + DeepSeek API provider (`DEEPSEEK_API_KEY`, `--pure` required)
- Dispatching to DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, or GLM-5.1 via `cli-opencode` + opencode-go provider (workspace credit pool)
- Dispatching to MiniMax via `cli-opencode` — default MiniMax Token Plan provider `minimax-coding-plan` (`--model minimax-coding-plan/MiniMax-M3-highspeed`, fallback `minimax-coding-plan/MiniMax-M2.7-highspeed`, subscription quota pool `minimax-token-plan`, omit `--agent`); pay-per-token MiniMax Direct API provider `minimax` (`MINIMAX_API_KEY`, `--model minimax/MiniMax-M2.7`, `minimax-api` pool) as the alternative
- Dispatching to MiMo-V2.5-Pro via `cli-opencode` → provider `xiaomi-token-plan-ams`, model `xiaomi-token-plan-ams/mimo-v2.5-pro`, quota pool `xiaomi-token-plan`, omit `--agent` (cheap-iteration sibling `opencode/mimo-v2.5-free` via the opencode-go gateway; best framework COSTAR + lean / RACE fallback per 126/004)
- Optional future targets: Claude Haiku (Anthropic separate quota), Gemini Flash (Google separate quota)
- Asking "where is the small-model X pattern?" — context budget, output verification, model profiles, structured permissions, quota fallback

**Keyword Triggers**:
- `small model`, `small-model dispatch`
- Model names: `swe-1.6`, `kimi-k2.6`, `deepseek-v4`, `qwen3.6`, `glm-5.1`, `minimax-m3`, `minimax-2.7`, `mimo-v2.5-pro`, `haiku`, `gemini flash`
- Provider names: `opencode-go`, `deepseek-api`, `minimax-coding-plan` (Token Plan) / `minimax` (Direct API), `minimax-token-plan` / `minimax-api`, `xiaomi-token-plan-ams` (Xiaomi Token Plan Europe), `cognition pro`, `cognition free`
- Pattern names: `context budget`, `output verification`, `model profile`, `structured permissions`, `quota fallback`, `tool scoring`

### Use Cases

#### Routing Anchor

Surface as a co-recommendation when `cli-devin` or `cli-opencode` is already the primary skill. The advisor reaches this skill through `enhances` edges from both CLI skills, providing one obvious entry point regardless of which executor is in use.

#### Pattern Discovery

Operators read `references/pattern-index.md` to find the canonical location of each small-model pattern. The index lists ownership (which CLI skill owns the pattern) and shipping status per phase.

### When NOT to Use

**Do not use for**:
- Frontier-model dispatch (Opus, Sonnet, gpt-5.5) — those are out of scope for the 114 arc
- Bulk copying of pattern bodies into other skills — the patterns are runtime-specific to their executor
- Adding new runtime logic — this sentinel is documentation routing only

---

## 2. SMART ROUTING

### Primary Detection Signal

Discovery happens through skill-advisor `enhances` edges + trigger phrases, not a dedicated detection script.

```text
Operator prompt mentions small-model name or pattern
    |
    +-- Advisor matches trigger phrases (lexical lane)
    +-- cli-devin or cli-opencode already high-confidence
    +-- enhances edge pulls sk-prompt-small-model into top-3
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Identify whether a small-model executor is involved
    +- STEP 1: Surface sk-prompt-small-model alongside the executor skill
    +- Phase 1: Read references/pattern-index.md
    +- Phase 2: Navigate to the executor-owned pattern file
    +- Phase 3: Apply the pattern from its canonical location
```

### Resource Domains

```text
references/
    pattern-index.md      # The only reference; lists owners + ship status
```

This skill intentionally has no `assets/` and no `scripts/`. The patterns themselves live in:

- `.opencode/skills/cli-devin/references/` and `assets/`
- `.opencode/skills/cli-opencode/references/` and `assets/`
- `.opencode/skills/sk-prompt/assets/` (model-profiles registry)
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` (runtime helpers)

### Resource Loading Levels

| Level       | When to Load             | Resources                     |
| ----------- | ------------------------ | ----------------------------- |
| ALWAYS      | Every skill invocation   | `references/pattern-index.md` |
| CONDITIONAL | Operator names a pattern | Follow link from index to executor-owned file |
| ON_DEMAND   | Adopting Haiku/Flash     | Update the index + executor metadata (see README) |

### Smart Router Pseudocode

The sentinel has no runtime routing of its own. Routing is performed by the skill-advisor through `graph-metadata.json` edges:

```python
# Conceptual — the actual scorer lives in system-skill-advisor
def surface_sk_prompt_small_model(prompt, advisor):
    if matches_trigger(prompt, SMALL_MODEL_TRIGGERS):
        # Lexical lane match
        return ("sk-prompt-small-model", advisor.lexical_score(prompt))
    if "cli-devin" in advisor.top_k(prompt, k=3) or "cli-opencode" in advisor.top_k(prompt, k=3):
        # Graph_causal lane via enhances edge (weight 0.5)
        return ("sk-prompt-small-model", 0.5 * advisor.enhances_weight)
    return None
```

Operators do not invoke a router from inside this skill. They follow `references/pattern-index.md` to the executor-owned file.

---

## 3. HOW IT WORKS

### Sentinel Workflow

1. **Discovery** — Operator mentions a small-model name or pattern; the advisor surfaces `sk-prompt-small-model` alongside the relevant CLI skill.
2. **Index lookup** — Operator reads `references/pattern-index.md` to find the pattern's canonical location and ship status.
3. **Navigate to owner** — Operator opens the linked executor file (e.g. `cli-devin/references/context-budget.md`) for the actual pattern body.
4. **Apply pattern** — Pattern is applied within the executor's prompt-pack or recipe, not from this sentinel.

### Dispatch Matrix

| Model | Executor → Provider (quota pool) | Status |
| --- | --- | --- |
| SWE-1.6 | `cli-devin` → cognition (cognition-free) | active |
| DeepSeek-v4-pro | `cli-devin` → cognition (cognition-pro) · `cli-opencode` → deepseek-api (deepseek-api) · `cli-opencode` → opencode-go (opencode-go) | active (3 paths) |
| Kimi-k2.6 | `cli-devin` → cognition (cognition-pro) · `cli-opencode` → opencode-go (opencode-go) | active (2 paths) |
| Qwen3.6 | `cli-opencode` → opencode-go (opencode-go) | active (single path) |
| GLM-5.1 | `cli-devin` → cognition (cognition-pro) · `cli-opencode` → opencode-go (opencode-go) | active (2 paths) |
| MiniMax-M3 (default) | `cli-opencode` → minimax-coding-plan (minimax-token-plan) | active — MiniMax Token Plan; `MiniMax-M3-highspeed`; fallback → minimax-2.7 |
| MiniMax-M2.7 | `cli-opencode` → minimax-coding-plan (minimax-token-plan) · `cli-opencode` → minimax (minimax-api) | active (2 paths: Token Plan highspeed fallback + pay-per-token Direct API) |
| MiMo-V2.5-Pro | `cli-opencode` → xiaomi-token-plan-ams (xiaomi-token-plan) | active — Xiaomi Token Plan Europe; `mimo-v2.5-pro`; free `opencode/mimo-v2.5-free` sibling |
| Haiku | `cli-claude-code` → anthropic (anthropic) | optional-unverified |
| Gemini Flash | `cli-gemini` → google (google) | optional-unverified |

Canonical source: `sk-prompt/assets/model-profiles.json` (each entry's `executors` array enumerates the paths above).

### Ownership Boundary

| Executor | Owns (Phases 002-006) |
| --- | --- |
| `cli-devin` | SWE-1.6 + Cognition-Pro models (DeepSeek/Kimi/GLM via Devin) — budget defaults, output verification, confidence-scoring rubric, per-model-budgets.json, quota-fallback reference |
| `cli-opencode` | DeepSeek API direct path + opencode-go pool (DeepSeek/Kimi/Qwen/GLM) — budget propagation mirror, permissions matrix schema, structured permissions reference |
| `sk-prompt` | Model-profile registry (`model-profiles.json`) with per-model `executors` array, cross-CLI budget awareness card |
| `system-spec-kit` | Runtime helpers (`bayesian-scorer.ts`, `fallback-router.ts`, `permissions-gate.ts`) |

### Adopting a New Provider (Haiku, Gemini Flash, others)

Metadata-first adoption keeps the sentinel thin:

1. Populate the stub in `sk-prompt/assets/model-profiles.json` (set `quota_pool`, `context_length`, etc.).
2. Optionally set `fallback_target` on existing models that should escalate to the new provider.
3. Add trigger phrases for the new provider in this skill's `graph-metadata.json` if it has a distinct dispatch shape.
4. Mark the relevant rows in `references/pattern-index.md` as shipped.
5. Re-index the advisor (`skill_advisor.py --force-refresh`).

No code edits are required to adopt a new small-model provider when its quota pool is already represented.

---

## 4. RULES

### ALWAYS

1. **Stay thin.** SKILL.md ≤ 200 LOC; pattern-index.md ≤ 100 LOC. If content grows, it belongs in the owning executor skill, not here.
2. **Link to canonical patterns** — every reference in this skill MUST point at an executor-owned file, never duplicate the pattern body.
3. **Keep trigger phrases honest.** Add a phrase only when a new model or pattern actually exists. Stale triggers degrade advisor confidence.
4. **Update the index when downstream phases ship or move files.** The pattern-index is a contract; broken links erode trust.
5. **Honor the in-scope model set** — SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1 required; Haiku, Gemini Flash optional. Frontier models (Opus, Sonnet, gpt-5.5) are explicitly out of scope.

### NEVER

1. **Never add runtime logic here** — no shell commands, no scripts, no agent-config recipes.
2. **Never duplicate executor patterns** — if a new pattern emerges, ship it in the executor that runs it; only update the index here.
3. **Never escalate small→frontier** — the user's rotation is small-only. The quota-fallback engine (Phase 005) is pool-aware, not tier-based.
4. **Never silently drop a stale pattern row.** If a downstream phase deletes a pattern, update the index row to "deprecated" with a one-line reason.

### ESCALATE IF

1. A pattern needs to live in TWO executors (e.g. budget engine in both cli-devin and cli-opencode). Today this is handled via sentinel-style mirror docs (Phase 006). If a true duplicate logic surface emerges, escalate to refactor into a shared asset.
2. Trigger phrases pull this skill into non-small-model prompts above the 0.5 threshold. Tune weights in `graph-metadata.json` and re-index.
3. A new small-model provider arrives that does not fit the existing quota-pool model. Update the registry schema in `sk-prompt/assets/model-profiles.json` first, then propagate.

---

## 5. REFERENCES

### Core References

- [`references/pattern-index.md`](./references/pattern-index.md) — Authoritative index of small-model patterns + owners + ship status

### Related Resources (executor-owned patterns)

- [`cli-devin/references/context-budget.md`](../cli-devin/references/context-budget.md) — Canonical budget engine doc (Phase 004)
- [`cli-devin/references/output-verification.md`](../cli-devin/references/output-verification.md) — Verification pipeline + scoring rubric pointers (Phase 004)
- [`cli-devin/references/quota-fallback.md`](../cli-devin/references/quota-fallback.md) — Pool-aware fallback decision matrix (Phase 005)
- [`cli-devin/assets/per-model-budgets.json`](../cli-devin/assets/per-model-budgets.json) — Per-model token budget defaults
- [`cli-devin/assets/confidence-scoring-rubric.md`](../cli-devin/assets/confidence-scoring-rubric.md) — Verification confidence formula
- [`cli-opencode/references/context-budget.md`](../cli-opencode/references/context-budget.md) — cli-opencode budget mirror (Phase 006)
- [`cli-opencode/references/permissions-matrix.md`](../cli-opencode/references/permissions-matrix.md) — Structured permissions schema (Phase 003)
- [`cli-opencode/assets/permissions-matrix.schema.json`](../cli-opencode/assets/permissions-matrix.schema.json) — JSON Schema for permission rules
- [`sk-prompt/assets/model-profiles.json`](../sk-prompt/assets/model-profiles.json) — Unified model registry (Phase 005)
- [`sk-prompt/references/model-profiles.md`](../sk-prompt/references/model-profiles.md) — Registry schema + adoption protocol
- [`sk-prompt/assets/cli_prompt_quality_card.md`](../sk-prompt/assets/cli_prompt_quality_card.md) — Cross-CLI quality card with Budget Awareness subsection (Phase 006)

### Reference Loading Notes

- Load `references/pattern-index.md` on every invocation; it is small and authoritative.
- Do NOT load executor-owned references through this skill — follow the index link and let the operator's existing skill context handle loading.
- The `enhances` edges in `graph-metadata.json` co-surface `cli-devin` and `cli-opencode` automatically; their references load through their own routing.

### Skill Boundary Map

```text
sk-prompt-small-model (this skill)         ← discovery + index only
    |
    +-- cli-devin                   ← owns SWE-1.6 budget + verification + fallback patterns
    +-- cli-opencode                ← owns DeepSeek/Kimi/Qwen propagation + permissions
    +-- sk-prompt                   ← owns model registry + cross-CLI quality card
    +-- system-spec-kit             ← owns runtime helpers (TS code)
```