---
title: "sk-prompt-small-model: Per-Model Prompt-Craft Hub"
description: "The model-knowledge hub that owns per-model prompt-craft profiles and the model registry for small-model dispatch via cli-devin and cli-opencode."
trigger_phrases:
  - "small-model dispatch"
  - "small model prompt-craft"
  - "model profile lookup"
---

# sk-prompt-small-model

The model-knowledge hub for small-model dispatch: it owns one prompt-craft profile per active small model (framework, scaffold, gotchas) plus the model registry.

---

## 1. OVERVIEW

### Purpose

This README orients a human to the hub. The skill owns the per-model prompt-craft profiles in `references/models/` and the model registry in `assets/model-profiles.json`, and the advisor co-surfaces it alongside `cli-devin` or `cli-opencode` whenever a small model is named. Read `SKILL.md` for the runtime router and rules, `references/models/_index.md` to pick a model, and `references/pattern-index.md` to find executor-owned mechanics.

The boundary is sharp. This hub owns prompt-CRAFT (which framework, what scaffold, what gotchas) for each model. The `cli-*` executors own MECHANICS (binary flags, invocation wrappers, budgets, permissions). `sk-prompt` owns the generic framework definitions. A profile here points at mechanics, it never restates them.

### Usage

1. Open `references/models/_index.md` and pick the target model.
2. Read `references/models/<id>.md` for that model's framework, pre-planning density, scaffold, and dispatch gotchas.
3. Follow `references/pattern-index.md` to the owning `cli-*` for the invocation mechanics.
4. To adopt a new provider (Haiku, Gemini Flash), follow the single canonical checklist in `references/pattern-index.md` section 4.

### Key Statistics

| Metric | Value |
|---|---|
| Version | 0.7.0.0 |
| Operating mode | Model-keyed prompt-craft hub |
| Active model profiles | 8 (swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1, minimax-m3, minimax-2.7, mimo-v2.5-pro) |
| References | `models/` (profiles + `_index.md`), `pattern-index.md` |
| Assets | `model-profiles.json` (registry), `cli_prompt_quality_card.md` (canonical card) |
| Scripts | None (intentional) |

### How This Compares

| Capability | This Skill | Related Skill |
|---|---|---|
| Owns per-model prompt-craft profiles | Yes (`references/models/`) | none |
| Owns the model registry | Yes (`assets/model-profiles.json`) | none |
| Owns executor mechanics | No | `cli-devin`, `cli-opencode` |
| Owns generic framework definitions | No | `sk-prompt` (patterns_evaluation, depth_framework) |
| Holds runtime code | No | `system-spec-kit` runtime helpers |

### Key Features

| Feature | What It Does |
|---|---|
| Per-model profiles | One profile per active model: framework (primary plus fallback), pre-planning density, scaffold, gotchas |
| Model-keyed router | Resolves the target model from the task, then loads its profile (see `SKILL.md` section 2) |
| Model registry | `model-profiles.json` is the DATA each profile mirrors and cites |
| Pattern index | Maps each executor-owned mechanic to its canonical `cli-*` location plus ship status |
| Adoption checklist | One canonical protocol for adding a new small-model provider |

---

## 2. QUICK START

**Step 1: Invoke the skill.**

Routing is automatic. Name any small model (`SWE-1.6`, `Kimi-k2.6`, `DeepSeek-v4-pro`, `Qwen3.6`, `GLM-5.1`, `MiniMax-M3`, `MiMo-V2.5-Pro`) and the advisor surfaces this hub alongside the matching `cli-*` executor.

**Step 2: Read the model index, then the profile.**

```bash
cat .opencode/skills/sk-prompt-small-model/references/models/_index.md
cat .opencode/skills/sk-prompt-small-model/references/models/minimax-m3.md
```

Expected result: the index lists every model with its framework and status. The profile gives the framework, density, scaffold, and gotchas for that model.

**Step 3: Verify routing before delivery.**

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "dispatch MiniMax-M3 via cli-opencode" --threshold 0.8
```

Expected result: `sk-prompt-small-model` appears in the top results alongside `cli-opencode`.

---

## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The hub keeps prompt-craft in one place so it cannot drift across the five executors. The weight lives in the on-demand per-model profiles, not in the entry surface. Three properties carry it:

- **Single source of craft.** Each model's framework choice and scaffold live in exactly one profile, mirrored from the registry row.
- **Discoverability.** The advisor co-surfaces the hub with the relevant executor whenever a small model is named.
- **Adoption ergonomics.** Adding a provider is a documented checklist, not a multi-file scramble.

### 3.2 FEATURE REFERENCE

| Feature | Inputs | Output | Primary Resource |
|---|---|---|---|
| Profile lookup | Model name or alias | Framework, density, scaffold, gotchas | [`references/models/`](./references/models/) |
| Model-keyed routing | Operator prompt naming a model | The matching profile loaded | [`SKILL.md`](./SKILL.md) section 2 |
| Mechanic discovery | Pattern name | Path to the owning `cli-*` file | [`references/pattern-index.md`](./references/pattern-index.md) |
| Provider adoption | New provider plus quota-pool category | Registry row, profile, index row | [`references/pattern-index.md`](./references/pattern-index.md) section 4 |

---

## 4. STRUCTURE

```text
sk-prompt-small-model/
+-- SKILL.md                          # Runtime instructions plus the model-keyed smart router
+-- README.md                         # This file, human-facing overview
+-- graph-metadata.json               # enhances edges plus trigger phrases for the advisor
+-- assets/
|   +-- model-profiles.json           # Unified model registry (the DATA profiles mirror)
|   `-- cli_prompt_quality_card.md    # Canonical cross-CLI prompt quality card
+-- references/
|   +-- models/                       # Per-model prompt-craft profiles (_index.md plus one <id>.md each)
|   `-- pattern-index.md              # Index mapping mechanics to their cli-* owners
`-- benchmarks/                       # Relocated benchmark run data + synthesis
```

| Path | Purpose |
|---|---|
| `SKILL.md` | Runtime entry point and the model-keyed smart router |
| `assets/model-profiles.json` | Unified registry, the DATA source each profile mirrors |
| `assets/cli_prompt_quality_card.md` | Canonical cross-CLI quality card the 5 cli cards mirror |
| `references/models/` | Per-model prompt-craft profiles plus `_index.md` |
| `references/pattern-index.md` | Maps every executor-owned mechanic to its canonical location |
| `benchmarks/` | Relocated benchmark datasets and synthesis for the model comparisons |

---

## 5. CONFIGURATION

This skill has no configurable settings. Routing weights live in `graph-metadata.json`:

| Setting | Default | Purpose |
|---|---|---|
| `enhances -> cli-devin` | weight 0.5 | Co-surface the hub when cli-devin is high-confidence |
| `enhances -> cli-opencode` | weight 0.5 | Co-surface the hub when cli-opencode is high-confidence |
| Trigger phrases | model names plus pattern names | Lexical-lane matches in the advisor scorer |

Non-configurable invariants:

- `SKILL.md` stays at or under 300 LOC (the smart-router pseudocode is the bulk).
- A profile records prompt-craft only, never executor mechanics.
- Frontier models (Opus, Sonnet, gpt-5.5) are out of scope.

---

## 6. USAGE EXAMPLES

**Operator dispatches a profiled model**

```text
User request: "compose a MiMo-V2.5-Pro prompt for a refactor via cli-opencode"
Skill routing: model id resolves to mimo-v2.5-pro
Resources loaded: references/models/_index.md, references/models/mimo-v2.5-pro.md, references/pattern-index.md
Expected output: COSTAR + lean scaffold from the profile, plus the cli-opencode invocation mechanics
```

**Dispatch surfaces the hub automatically**

```text
User request: "use cli-devin for SWE-1.6 code review"
Skill routing: cli-devin scores high, the enhances edge surfaces the hub
Resources loaded: cli-devin/SKILL.md plus sk-prompt-small-model/SKILL.md plus the swe-1.6 profile
Expected output: executor instructions and the model's prompt-craft profile in one brief
```

**Adopting a new provider**

```text
User request: "I'm adding Claude Haiku to the rotation. What do I update?"
Skill routing: alias match on "haiku"
Resources loaded: references/pattern-index.md section 4
Expected output: the canonical checklist (registry row, author profile, _index row, dispatch-matrix row, executor trigger, re-index)
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| Hub not surfacing on small-model prompts | Trigger phrases stale or advisor not re-indexed | Run `skill_advisor.py --force-refresh`, verify with a sample prompt |
| A model is unreachable by name | The model name is missing from the dispatching executor's trigger phrases | Add the name to that `cli-*/graph-metadata.json`, then re-index |
| A profile contradicts the registry | Profile prose drifted from `model-profiles.json` | Re-mirror the profile from its registry row |
| A model has no profile | Provider adopted without authoring the profile | Follow `pattern-index.md` section 4 |

---

## 8. FAQ

**Q: What does this hub own versus the executors?**

A: The hub owns prompt-craft (framework, scaffold, gotchas) per model plus the registry. The `cli-*` executors own mechanics (flags, wrappers, budgets, permissions). `sk-prompt` owns the generic framework definitions.

**Q: Where do I add a new pattern or mechanic?**

A: Add it to the executor that runs it, then add a row to `references/pattern-index.md` pointing at the new location. Do not host mechanics here.

**Q: How do I add a new small-model provider?**

A: Follow the canonical checklist in `references/pattern-index.md` section 4. It covers the registry row, the profile, the index rows, the executor trigger, and the re-index.

**Q: Are frontier models supported?**

A: No. The hub scopes to small models. Opus, Sonnet, and gpt-5.5 are out of scope.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the model-keyed router, and the hub rules |
| [`references/models/_index.md`](./references/models/_index.md) | Per-model index: id, framework, density, status |
| [`references/pattern-index.md`](./references/pattern-index.md) | Maps each executor-owned mechanic to its canonical location |
| [`assets/model-profiles.json`](./assets/model-profiles.json) | Unified registry, the DATA each profile mirrors |
| [`graph-metadata.json`](./graph-metadata.json) | `enhances` edges and trigger phrases consumed by the advisor |
| [`../cli-devin/SKILL.md`](../cli-devin/SKILL.md) | SWE-1.6 dispatch surface, owns budget, verification, fallback mechanics |
| [`../cli-opencode/SKILL.md`](../cli-opencode/SKILL.md) | DeepSeek / Kimi / Qwen / GLM / MiniMax / MiMo dispatch surface, owns permissions and budget mechanics |
| [`../sk-prompt/SKILL.md`](../sk-prompt/SKILL.md) | Generic framework definitions and CLEAR scoring |
