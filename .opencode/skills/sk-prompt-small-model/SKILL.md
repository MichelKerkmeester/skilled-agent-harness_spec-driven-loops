---
name: sk-prompt-small-model
description: Per-model prompt-craft hub for small-model dispatch (SWE-1.6 + DeepSeek-v4-pro + Kimi-k2.6 + Qwen3.6 + GLM-5.1 + MiniMax-M3/M2.7 + MiMo-V2.5-Pro across cli-devin and cli-opencode). OWNS the per-model prompt-craft profiles in references/models/ (framework + scaffold + gotchas, mirroring model-profiles.json); executor MECHANICS (binary flags, invocation wrappers) stay in cli-devin/cli-opencode. Advisor co-surfaces it with those executors.
allowed-tools: []
version: 0.5.0.0
---

<!-- Keywords: small-model, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1, minimax-m3, minimax-2.7, minimax-coding-plan, minimax-token-plan, minimax-api, haiku, gemini-flash, opencode-go, deepseek-api, context-budget, output-verification, model-profiles, structured-permissions, quota-fallback -->

# Small-Model Prompt-Craft Hub

The model-knowledge hub for small-model dispatch: per-model prompt-craft profiles live here in `references/models/` (one profile per active model — framework + scaffold + gotchas). The advisor co-surfaces this skill alongside `cli-devin` or `cli-opencode`; you read the profile here, then apply executor MECHANICS from the relevant `cli-X`.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** — before dispatching any active small model, to look up its prompt-craft profile:
- SWE-1.6 (via `cli-devin`)
- DeepSeek-v4-pro, Kimi-k2.6, GLM-5.1 (via `cli-devin` or `cli-opencode`)
- Qwen3.6 (via `cli-opencode`)
- MiniMax-M3 / MiniMax-2.7 (via `cli-opencode`)
- MiMo-V2.5-Pro (via `cli-opencode`)
- Optional future targets: Claude Haiku, Gemini Flash
- Asking "what framework / scaffold does small-model X want?" or "where is the small-model X pattern?"

The exact provider, quota pool, and dispatch flags for each path live in the §3 dispatch matrix and the executor `cli-X` skills (MECHANICS), not in this trigger list.

**Keyword Triggers**:
- `small model`, `small-model dispatch`
- Model names: `swe-1.6`, `kimi-k2.6`, `deepseek-v4-pro`, `qwen3.6`, `glm-5.1`, `minimax-m3`, `minimax-2.7`, `mimo-v2.5-pro`, `haiku`, `gemini-flash`
- Provider names: `opencode-go`, `deepseek-api`, `minimax-coding-plan` (Token Plan) / `minimax` (Direct API), `minimax-token-plan` / `minimax-api`, `xiaomi-token-plan-ams` (Xiaomi Token Plan Europe), `cognition pro`, `cognition free`
- Pattern names: `context budget`, `output verification`, `model profile`, `structured permissions`, `quota fallback`, `tool scoring`

### Use Cases

#### Prompt-Craft Profile Lookup

Before dispatching a small model, read `references/models/<id>.md` for that model's prompt framework (primary + fallback), pre-planning density, scaffold shape, and known gotchas. The profile mirrors `model-profiles.json` `recommended_frameworks` (DATA) and cites it; the WEIGHT of this skill lives in those on-demand profiles, not in this entry surface.

#### Co-Surfaced Knowledge Hub

The advisor reaches this skill through `enhances` edges from both CLI skills, providing one obvious knowledge entry point regardless of which executor is in use. Use `references/models/_index.md` to pick the right profile; use `references/pattern-index.md` to find executor-owned MECHANICS.

### When NOT to Use

**Do not use for**:
- Frontier-model dispatch (Opus, Sonnet, gpt-5.5) — those are out of scope for the 114 arc
- Looking up binary flags or invocation wrappers — those MECHANICS live in `cli-devin`/`cli-opencode`, not here
- Adding new runtime logic — this skill carries prompt-craft prose + an index, never shell commands or scripts

---

## 2. SMART ROUTING

### Detection & Flow

Discovery happens through skill-advisor `enhances` edges + trigger phrases (no dedicated detection script), then the operator reads the profile and applies executor mechanics:

```text
Prompt mentions small-model name/pattern
    |
    +- Advisor matches trigger phrases (lexical) OR enhances edge from cli-devin/cli-opencode (graph)
    +- Phase 1: Pick the model in references/models/_index.md
    +- Phase 2: Read references/models/<id>.md for framework + scaffold + gotchas
    +- Phase 3: Apply executor MECHANICS (flags, wrappers) from the cli-X
```

### Resource Domains

```text
references/
    models/
        _index.md         # Thin per-model index: id -> framework primary; status
        <id>.md           # One prompt-craft profile per active model (the hub WEIGHT)
    pattern-index.md      # Locates executor-owned MECHANICS + ship status
```

This skill carries prompt-craft PROSE (`references/models/`) plus two thin indexes. It intentionally has no `assets/` and no `scripts/`. Executor MECHANICS and runtime code live elsewhere:

- `.opencode/skills/cli-devin/references/` and `assets/` (flags, wrappers, budgets)
- `.opencode/skills/cli-opencode/references/` and `assets/` (flags, wrappers, permissions)
- `.opencode/skills/sk-prompt/assets/` (model-profiles registry — the DATA profiles mirror)
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` (runtime helpers)

### Resource Loading Levels

| Level       | When to Load                  | Resources                                         |
| ----------- | ----------------------------- | ------------------------------------------------- |
| ALWAYS      | Every skill invocation        | `references/models/_index.md`                     |
| CONDITIONAL | Dispatching a specific model  | `references/models/<id>.md` (its prompt-craft profile) |
| CONDITIONAL | Needing executor MECHANICS    | Follow `references/pattern-index.md` to the `cli-X` file |
| ON_DEMAND   | Adopting Haiku/Flash          | Add a profile + index row + executor metadata (see README) |

### Routing Mechanism

This skill has no runtime router of its own. The skill-advisor surfaces it via `graph-metadata.json` trigger phrases (lexical lane) and the `enhances` edges from `cli-devin`/`cli-opencode` (graph lane). Operators then read the model's profile in `references/models/<id>.md` and follow `references/pattern-index.md` to the executor-owned MECHANICS.

---

## 3. HOW IT WORKS

### Hub Workflow

1. **Discover** — The advisor surfaces `sk-prompt-small-model` alongside the relevant CLI skill when an operator names a small model or pattern.
2. **Read the profile** — Open `references/models/<id>.md` for that model's prompt-craft: framework (primary + fallback), pre-planning density, scaffold shape, gotchas — mirrored from `model-profiles.json`.
3. **Apply MECHANICS + dispatch** — Follow `references/pattern-index.md` to the owning `cli-X` for flags/wrappers/budgets/permissions; the prompt-craft (here) and mechanics (`cli-X`) combine in the executor's prompt-pack.

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

This skill OWNS per-model prompt-craft profiles (`references/models/<id>.md`); `cli-devin`/`cli-opencode` own executor MECHANICS (flags, wrappers, budgets, permissions); `sk-prompt` owns the registry DATA + generic framework definitions; `system-spec-kit` owns runtime helpers. See the Skill Boundary Map in §5.

### Adopting a New Provider (Haiku, Gemini Flash, others)

Profile-plus-metadata adoption keeps the entry surface thin: (1) populate the registry stub in `sk-prompt/assets/model-profiles.json` (set `quota_pool`, `context_length`, `recommended_frameworks`); (2) add a `references/models/<id>.md` profile mirroring + citing that entry; (3) add one row to `references/models/_index.md`; (4) optionally set `fallback_target` and add `graph-metadata.json` trigger phrases; (5) re-index the advisor (`skill_advisor.py --force-refresh`). No executor-MECHANICS or code edits are needed when the quota pool is already represented.

---

## 4. RULES

### ALWAYS

1. **Keep the entry surface thin; let the profiles carry the WEIGHT.** SKILL.md ≤ 200 LOC, `references/models/_index.md` ≤ 100 LOC, and `pattern-index.md` ~110 LOC (it also carries the staleness policy + roadmap refs). The per-model prose lives in `references/models/<id>.md`, loaded on-demand — never inline a profile body into SKILL.md.
2. **Mirror the DATA and cite it.** Each profile MUST reflect that model's `recommended_frameworks` (primary, fallback, avoid, pre-planning density, evidence) from `sk-prompt/assets/model-profiles.json` and cite it as the source of truth. When the registry changes, the profile follows.
3. **Keep trigger phrases honest.** Add a phrase only when a model or profile actually exists. Stale triggers degrade advisor confidence.
4. **Update the index when models ship or move.** `_index.md` and `pattern-index.md` are contracts; broken links and missing rows erode trust.
5. **Honor the in-scope model set** — SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, MiniMax-M3/M2.7, MiMo-V2.5-Pro active; Haiku, Gemini Flash optional. Frontier models (Opus, Sonnet, gpt-5.5) are explicitly out of scope.

### NEVER

1. **Never duplicate EXECUTOR MECHANICS here** — binary flags, invocation wrappers, budgets, and permissions stay in `cli-devin`/`cli-opencode`. A profile points at them via `pattern-index.md`; it does not restate them.
2. **Never copy generic framework definitions here** — TIDD-EC, RCAF, COSTAR, RACE, STAR, etc. are defined once in `sk-prompt`. Profiles link to those definitions and only record the per-model choice + rationale.
3. **Never present carried-forward evidence as fresh.** When a profile's frameworks are inherited (e.g. MiniMax-M3 `status: carried` from MiniMax-2.7), label it carried and name the source benchmark — do not imply a fresh M3 run.
4. **Never add runtime logic here** — no shell commands, no scripts, no agent-config recipes.

### ESCALATE IF

1. A model becomes dispatchable from a NEW executor with conflicting MECHANICS (different flags/wrappers than the existing path). Resolve the mechanics in the owning `cli-X` first; the profile only records prompt-craft, so it must not arbitrate flag conflicts.
2. A profile would need to RESTATE executor flags to be usable. That belongs in `cli-X` — escalate to add/extend the executor reference, then link to it.
3. A new small-model provider arrives that does not fit the existing quota-pool model. Update the registry schema in `sk-prompt/assets/model-profiles.json` first, then add the profile + index row.

---

## 5. REFERENCES

### Core References

- [`references/models/`](./references/models/) — Per-model prompt-craft profiles (the hub WEIGHT); one `<id>.md` per active model, indexed by [`references/models/_index.md`](./references/models/_index.md)
- [`references/pattern-index.md`](./references/pattern-index.md) — Index locating executor-owned MECHANICS + ship status

### Related Resources (executor MECHANICS + DATA)

- [`cli-devin/references/context-budget.md`](../cli-devin/references/context-budget.md) — Canonical budget engine doc
- [`cli-devin/references/output-verification.md`](../cli-devin/references/output-verification.md) — Verification pipeline + scoring rubric pointers
- [`cli-devin/references/quota-fallback.md`](../cli-devin/references/quota-fallback.md) — Pool-aware fallback decision matrix
- [`cli-devin/assets/per-model-budgets.json`](../cli-devin/assets/per-model-budgets.json) — Per-model token budget defaults
- [`cli-devin/assets/confidence-scoring-rubric.md`](../cli-devin/assets/confidence-scoring-rubric.md) — Verification confidence formula
- [`cli-opencode/references/context-budget.md`](../cli-opencode/references/context-budget.md) — cli-opencode budget mirror
- [`cli-opencode/references/permissions-matrix.md`](../cli-opencode/references/permissions-matrix.md) — Structured permissions schema
- [`cli-opencode/assets/permissions-matrix.schema.json`](../cli-opencode/assets/permissions-matrix.schema.json) — JSON Schema for permission rules
- [`cli-opencode/assets/prompt_templates.md`](../cli-opencode/assets/prompt_templates.md) — Executor prompt-pack templates (MiniMax, MiMo scaffolds in mechanics form)
- [`sk-prompt/assets/model-profiles.json`](../sk-prompt/assets/model-profiles.json) — Unified model registry; the DATA each profile mirrors
- [`sk-prompt/references/model-profiles.md`](../sk-prompt/references/model-profiles.md) — Registry schema + adoption protocol
- [`sk-prompt/assets/cli_prompt_quality_card.md`](../sk-prompt/assets/cli_prompt_quality_card.md) — Cross-CLI quality card + generic framework definitions

### Reference Loading Notes

- Load `references/models/_index.md` on every invocation, then the specific `references/models/<id>.md` for the model being dispatched; these are small and carry the prompt-craft.
- Do NOT load executor-owned MECHANICS references through this skill — follow the `pattern-index.md` link and let the operator's existing `cli-X` context handle loading.
- The `enhances` edges in `graph-metadata.json` co-surface `cli-devin` and `cli-opencode` automatically; their references load through their own routing.

### Skill Boundary Map

```text
sk-prompt-small-model (this skill)  ← OWNS per-model prompt-craft profiles + indexes
    |
    +-- cli-devin                   ← owns MECHANICS: SWE-1.6 budget + verification + fallback
    +-- cli-opencode                ← owns MECHANICS: DeepSeek/Kimi/Qwen/MiniMax/MiMo flags + permissions
    +-- sk-prompt                   ← owns model registry (DATA) + generic framework definitions
    +-- system-spec-kit             ← owns runtime helpers (TS code)
```
