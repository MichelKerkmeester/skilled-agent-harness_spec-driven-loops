---
name: sk-prompt-small-model
description: Per-model prompt-craft hub for small-model dispatch (DeepSeek-v4-pro + Kimi-k2.7-code + MiniMax-M3 + MiMo-V2.5-Pro via cli-opencode). OWNS the per-model prompt-craft profiles in references/models/ (framework + scaffold + gotchas, mirroring model_profiles.json); executor MECHANICS (binary flags, invocation wrappers) stay in cli-opencode. Advisor co-surfaces it with that executor.
allowed-tools: []
version: 0.8.0.0
---

<!-- Keywords: small-model, deepseek-v4-pro, kimi-k2.7-code, kimi-for-coding, minimax-m3, minimax-coding-plan, minimax-token-plan, minimax-api, haiku, opencode-go, deepseek-api, context-budget, output-verification, model-profiles, structured-permissions, quota-fallback -->

# Small-Model Prompt-Craft Hub

The model-knowledge hub for small-model dispatch: per-model prompt-craft profiles live here in `references/models/` (one profile per active model — framework + scaffold + gotchas). The advisor co-surfaces this skill alongside `cli-opencode`; you read the profile here, then apply executor MECHANICS from `cli-opencode`.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** — before dispatching any active small model, to look up its prompt-craft profile:
- DeepSeek-v4-pro, Kimi-k2.7-code (via `cli-opencode`)
- MiniMax-M3 (via `cli-opencode`)
- MiMo-V2.5-Pro (via `cli-opencode`)
- Optional future target: Claude Haiku
- Asking "what framework / scaffold does small-model X want?" or "where is the small-model X pattern?"

The exact provider, quota pool, and dispatch flags for each path live in the §3 dispatch matrix and the executor `cli-X` skills (MECHANICS), not in this trigger list.

**Keyword Triggers**:
- `small model`, `small-model dispatch`
- Model names: `kimi-k2.7-code`, `deepseek-v4-pro`, `minimax-m3`, `mimo-v2.5-pro`, `haiku`
- Provider names: `opencode-go`, `deepseek-api`, `kimi-for-coding` (Kimi For Coding plan), `minimax-coding-plan` (Token Plan) / `minimax` (Direct API), `minimax-token-plan` / `minimax-api`, `xiaomi-token-plan-ams` (Xiaomi Token Plan Europe) / `xiaomi` (Xiaomi Direct API)
- Pattern names: `context budget`, `output verification`, `model profile`, `structured permissions`, `quota fallback`, `tool scoring`

### Use Cases

#### Prompt-Craft Profile Lookup

Before dispatching a small model, read `references/models/<id>.md` for that model's prompt framework (primary + fallback), pre-planning density, scaffold shape, and known gotchas. The profile mirrors `model_profiles.json` `recommended_frameworks` (DATA) and cites it; the WEIGHT of this skill lives in those on-demand profiles, not in this entry surface.

#### Co-Surfaced Knowledge Hub

The advisor reaches this skill through `enhances` edges from both CLI skills, providing one obvious knowledge entry point regardless of which executor is in use. Use `references/models/_index.md` to pick the right profile; use `references/pattern_index.md` to find executor-owned MECHANICS.

### When NOT to Use

**Do not use for**:
- Frontier-model dispatch (Opus, Sonnet, gpt-5.5) — those are out of scope for the 114 arc
- Looking up binary flags or invocation wrappers — those MECHANICS live in `cli-opencode`, not here
- Adding new runtime logic — this skill carries prompt-craft prose + an index, never shell commands or scripts

---

## 2. SMART ROUTING

### Model Detection

The routing key is the **target model**. Detect it from the model named in the task — a slug
(`minimax-m3`), an alias (`minimax m3`, `deepseek`, `kimi`), or a provider phrase — and normalize
it to a canonical profile id with the alias map. A model name is the one signal that selects which
`references/models/<id>.md` profile to load.

```python
MODEL_ALIASES = {
    "deepseek": "deepseek-v4-pro", "deepseek-v4": "deepseek-v4-pro", "deepseek-v4-pro": "deepseek-v4-pro",
    "kimi": "kimi-k2.7-code", "kimi-k2.7": "kimi-k2.7-code", "kimi-k2.7-code": "kimi-k2.7-code", "kimi-for-coding": "kimi-k2.7-code", "k2p7": "kimi-k2.7-code",
    "minimax-m3": "minimax-m3", "minimax m3": "minimax-m3", "minimax": "minimax-m3",
    "mimo": "mimo-v2.5-pro", "mimo-v2.5-pro": "mimo-v2.5-pro", "mimo pro": "mimo-v2.5-pro",
}
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Resolve the target model id (alias map) — the routing key
    +- Phase 1: Load references/models/_index.md, pick the model
    +- Phase 2: Load references/models/<id>.md for framework + scaffold + gotchas
    +- Phase 3: Follow references/pattern_index.md to executor MECHANICS in the cli-X
```

### Resource Domains

```text
references/
    models/
        _index.md         # Thin per-model index: id -> framework primary; status (ALWAYS)
        <id>.md           # One prompt-craft profile per active model (the hub WEIGHT)
    pattern_index.md      # Locates executor-owned MECHANICS + ship status
assets/
    model_profiles.json   # The registry DATA each profile mirrors
    cli_prompt_quality_card.md  # Canonical cross-CLI quality card
```

Executor MECHANICS and runtime code live elsewhere — a profile points at them, never restates them:

- `.opencode/skills/cli-opencode/references/` and `assets/` (flags, wrappers, permissions)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/` (runtime helpers)

### Resource Loading Levels

| Level       | When to Load                  | Resources                                         |
| ----------- | ----------------------------- | ------------------------------------------------- |
| ALWAYS      | Every skill invocation        | `references/models/_index.md`                     |
| CONDITIONAL | Dispatching a specific model  | `references/models/<id>.md` (its prompt-craft profile) |
| CONDITIONAL | Needing executor MECHANICS    | Follow `references/pattern_index.md` to `cli-opencode` |
| ON_DEMAND   | Adopting Haiku/Flash          | Add a profile + index row + executor metadata (see README) |

### Smart Router Pseudocode

> Pattern: see [`../sk-doc/assets/skill/skill_smart_router.md`](../sk-doc/assets/skill/skill_smart_router.md)
> for the canonical runtime-discovery, guarded-load, routing-key, and fallback reference. This hub
> routes by MODEL: `routing_key` = the canonical model id, resource = `references/models/<id>.md`.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/models/_index.md"
MODELS_DIR = "references/models/"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Name the target small model (slug, alias, or provider)",
    "Confirm the executor (cli-opencode)",
    "Provide the task intent plus one concrete input",
    "Confirm the verification command set before completion",
]

def _guard_in_skill(relative_path):
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)                       # reject paths outside the skill
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources():
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():                                  # deleted folders must not break routing
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {d.relative_to(SKILL_ROOT).as_posix() for d in docs}

def resolve_model_id(task):
    text = (getattr(task, "request", "") or "").lower()
    for alias, model_id in MODEL_ALIASES.items():
        if alias in text:
            return model_id
    return "unknown"

def route_small_model_profile(task):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()

    def load_if_available(relative_path):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)                    # ALWAYS: the model index

    model_id = resolve_model_id(task)
    if model_id == "unknown":                              # Tier 1: no model named
        return {"routing_key": "unknown", "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST, "resources": loaded}

    profile = f"{MODELS_DIR}{model_id}.md"
    if profile not in inventory:                           # Tier 2: known model, profile not authored yet
        return {"routing_key": model_id,
                "notice": f"No prompt-craft profile authored yet for '{model_id}'; see _index.md",
                "resources": loaded}

    load_if_available(profile)                             # Tier 3: load the profile; mechanics follow
    load_if_available("references/pattern_index.md")
    return {"routing_key": model_id, "resources": loaded}
```

The skill-advisor still surfaces this hub via `graph-metadata.json` trigger phrases (lexical) and
the `enhances` edge from `cli-opencode` (graph); the router above is how the resolved
invocation loads the right profile.

---

## 3. HOW IT WORKS

### Hub Workflow

1. **Discover** — The advisor surfaces `sk-prompt-small-model` alongside the relevant CLI skill when an operator names a small model or pattern.
2. **Read the profile** — Open `references/models/<id>.md` for that model's prompt-craft: framework (primary + fallback), pre-planning density, scaffold shape, gotchas — mirrored from `model_profiles.json`.
3. **Apply MECHANICS + dispatch** — Follow `references/pattern_index.md` to the owning `cli-X` for flags/wrappers/budgets/permissions; the prompt-craft (here) and mechanics (`cli-X`) combine in the executor's prompt-pack.

### Dispatch Matrix

| Model | Executor → Provider (quota pool) | Status |
| --- | --- | --- |
| DeepSeek-v4-pro | `cli-opencode` → deepseek-api (deepseek-api) · `cli-opencode` → opencode-go (opencode-go) | active (2 paths) |
| Kimi-k2.7-code | `cli-opencode` → kimi-for-coding (kimi-for-coding) | active (single path; Kimi For Coding plan) |
| MiniMax-M3 | `cli-opencode` → minimax-coding-plan (minimax-token-plan) · `cli-opencode` → minimax (minimax-api) | active — Token Plan (default) + Direct API (pay-per-token) |
| MiMo-V2.5-Pro | `cli-opencode` → xiaomi-token-plan-ams (xiaomi-token-plan) · `cli-opencode` → xiaomi (xiaomi-direct-api) | active — Token Plan (default) + Direct API (pay-per-token) |
| Haiku | `cli-claude-code` → anthropic (anthropic) | optional-unverified |

Canonical source: `sk-prompt-small-model/assets/model_profiles.json` (each entry's `executors` array enumerates the paths above).

### Ownership Boundary

This skill OWNS per-model prompt-craft profiles (`references/models/<id>.md`) and the model registry DATA (`assets/model_profiles.json`); `cli-opencode` owns executor MECHANICS (flags, wrappers, budgets, permissions); `sk-prompt` owns generic framework definitions; `system-spec-kit` owns runtime helpers. See the Skill Boundary Map in §5.

### Adopting a New Provider (Haiku, others)

Follow the single canonical checklist in [`references/pattern_index.md`](./references/pattern_index.md) §4 "Adopting a New Provider" — it is the one source for the adoption steps (registry entry → author the profile → `_index.md` row → this §3 dispatch-matrix row → the dispatching executor's trigger phrase → re-index + verify). Do not maintain a second copy of the steps here. No executor-MECHANICS or code edits are needed when the quota pool is already represented.

---

## 4. RULES

### ALWAYS

1. **Keep the entry surface thin; let the profiles carry the WEIGHT.** SKILL.md ≤ 300 LOC (the §2 smart-router pseudocode is the bulk; everything else stays terse), `references/models/_index.md` ≤ 100 LOC, and `pattern_index.md` ~110 LOC (it also carries the staleness policy + roadmap refs). The per-model prose lives in `references/models/<id>.md`, loaded on-demand — never inline a profile body into SKILL.md.
2. **Mirror the DATA and cite it.** Each profile MUST reflect that model's `recommended_frameworks` (primary, fallback, avoid, pre-planning density, evidence) from `sk-prompt-small-model/assets/model_profiles.json` and cite it as the source of truth. When the registry changes, the profile follows.
3. **Keep trigger phrases honest.** Add a phrase only when a model or profile actually exists. Stale triggers degrade advisor confidence.
4. **Update the index when models ship or move.** `_index.md` and `pattern_index.md` are contracts; broken links and missing rows erode trust.
5. **Honor the in-scope model set** — DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3, MiMo-V2.5-Pro active; Haiku optional. Frontier models (Opus, Sonnet, gpt-5.5) are explicitly out of scope.

### NEVER

1. **Never duplicate EXECUTOR MECHANICS here** — binary flags, invocation wrappers, budgets, and permissions stay in `cli-opencode`. A profile points at them via `pattern_index.md`; it does not restate them.
2. **Never copy generic framework definitions here** — the closed 7-framework set (RCAF / COSTAR / RACE / CIDI / TIDD-EC / CRISPE / CRAFT) is defined once in `sk-prompt`. Profiles link to those definitions and only record the per-model choice + rationale.
3. **Never present carried-forward evidence as fresh.** When a profile's frameworks are inherited (e.g. MiniMax-M3's TIDD-EC contract from benchmark 003, originally run on M2.7), label it carried and name the source benchmark — do not imply a fresh M3 run.
4. **Never add runtime logic here** — no shell commands, no scripts, no agent-config recipes.

### ESCALATE IF

1. A model becomes dispatchable from a NEW executor with conflicting MECHANICS (different flags/wrappers than the existing path). Resolve the mechanics in the owning `cli-X` first; the profile only records prompt-craft, so it must not arbitrate flag conflicts.
2. A profile would need to RESTATE executor flags to be usable. That belongs in `cli-X` — escalate to add/extend the executor reference, then link to it.
3. A new small-model provider arrives that does not fit the existing quota-pool model. Update the registry schema in `sk-prompt-small-model/assets/model_profiles.json` first, then add the profile + index row.

---

## 5. REFERENCES

### Core References

- [`references/models/`](./references/models/) — Per-model prompt-craft profiles (the hub WEIGHT); one `<id>.md` per active model, indexed by [`references/models/_index.md`](./references/models/_index.md)
- [`references/pattern_index.md`](./references/pattern_index.md) — Index locating executor-owned MECHANICS + ship status

### Related Resources (executor MECHANICS + DATA)

- [`references/context_budget.md`](references/context_budget.md) — Canonical budget engine doc
- [`references/output_verification.md`](references/output_verification.md) — Verification pipeline reference (re-homed from cli-devin)
- [`references/quota_fallback.md`](references/quota_fallback.md) — Pool-aware fallback decision matrix (re-homed from cli-devin)
- [`assets/per_model_budgets.json`](assets/per_model_budgets.json) — Per-model token budget defaults
- [`assets/confidence_scoring_rubric.md`](assets/confidence_scoring_rubric.md) — Verification confidence formula (re-homed from cli-devin)
- [`cli-opencode/references/context-budget.md`](../cli-opencode/references/context-budget.md) — cli-opencode budget mirror
- [`cli-opencode/references/permissions-matrix.md`](../cli-opencode/references/permissions-matrix.md) — Structured permissions schema
- [`cli-opencode/assets/permissions-matrix.schema.json`](../cli-opencode/assets/permissions-matrix.schema.json) — JSON Schema for permission rules
- [`cli-opencode/assets/prompt_templates.md`](../cli-opencode/assets/prompt_templates.md) — Executor prompt-pack templates (MiniMax, MiMo scaffolds in mechanics form)
- [`sk-prompt-small-model/assets/model_profiles.json`](./assets/model_profiles.json) — Unified model registry; the DATA each profile mirrors (owned by this skill)
- [`assets/cli_prompt_quality_card.md`](./assets/cli_prompt_quality_card.md) — Canonical cross-CLI prompt quality card (owned by this hub); generic framework definitions live in `sk-prompt`

### Reference Loading Notes

- Load `references/models/_index.md` on every invocation, then the specific `references/models/<id>.md` for the model being dispatched; these are small and carry the prompt-craft.
- Do NOT load executor-owned MECHANICS references through this skill — follow the `pattern_index.md` link and let the operator's existing `cli-opencode` context handle loading.
- The `enhances` edge in `graph-metadata.json` co-surfaces `cli-opencode` automatically; its references load through their own routing.

### Skill Boundary Map

```text
sk-prompt-small-model (this skill)  ← OWNS per-model prompt-craft profiles + indexes + model registry (assets/model_profiles.json)
    |
    +-- cli-opencode                ← owns MECHANICS: DeepSeek/Kimi/MiniMax/MiMo flags + permissions
    +-- sk-prompt                   ← owns generic framework definitions
    +-- system-spec-kit             ← owns runtime helpers (TS code)
```
