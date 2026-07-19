---
title: prompt-models
description: Per-model prompt-craft hub for small-model dispatch. Look up a model's prompt framework, scaffold and gotchas here, then apply the executor mechanics from cli-opencode.
trigger_phrases:
  - "small model prompt"
  - "model profile"
  - "cli-opencode"
  - "prompt framework"
  - "small model dispatch"
version: 0.8.0.14
---

# prompt-models

> Before you dispatch any small model, read that model's prompt-craft profile here. The right framework, scaffold and gotchas live in one place. The executor mechanics live in cli-opencode. Each stays clean.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Looking up the prompt framework, scaffold and gotchas for a small model before dispatch |
| **Invoke with** | Advisor co-surfaces this hub alongside cli-opencode when a small model is named |
| **Works on** | DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3, MiMo-V2.5-Pro and optional Haiku |
| **Produces** | A prompt-craft profile (framework, density, scaffold and gotchas) plus a pointer to the executor mechanics |

---

## 2. OVERVIEW

### Why This Skill Exists

Small models do not all want the same prompt shape. MiMo performs best with COSTAR and a lean plan. Kimi-k2.7-code uses COSTAR with TIDD-EC fallback and explicitly avoids RCAF. MiniMax wants TIDD-EC and a dense plan. DeepSeek remains the default-unverified RCAF case. Guess wrong and the model underperforms or ignores half the instructions. Without one source of truth, each dispatch reinvents the framework choice. The fix is a single hub that records each model's framework, scaffold and known traps.

Mixing that prompt-craft with executor mechanics (binary flags, invocation wrappers, budgets, permissions) makes both drift. This hub holds the craft. `cli-opencode` holds the mechanics. Each stays clean and each can change without dragging the other along.

### What It Does

`prompt-models` is the per-model prompt-craft hub for small-model dispatch. It owns one prompt-craft profile per active model in `references/models/`, indexed by `references/models/_index.md`. Each profile records the model's primary and fallback framework, its pre-planning density, a tuned scaffold and a gotchas table. The profiles mirror `assets/model-profiles.json`, the registry that is the source of truth for context length, executors, quota pools and recommended frameworks.

The hub carries no tools and no runtime code. It is reached when the skill advisor co-surfaces it alongside `cli-opencode`. You read the profile here for the prompt-craft, then follow `references/pattern-index.md` to the executor mechanics in `cli-opencode`.

---

## 3. QUICK START

**Step 1: Invoke it.** The advisor surfaces this hub automatically when you name a small model alongside cli-opencode. If the advisor does not fire, load the entry surface directly.

```bash
# Auto-routing through the skill advisor
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "dispatch mimo-v2.5-pro through cli-opencode" --threshold 0.8

# Or read the runtime instructions
Read(".opencode/skills/sk-prompt/prompt-models/SKILL.md")
```

**Step 2: Pick the model.** Open `references/models/_index.md`. It is a thin table: model id, primary framework, fallback, density and status. Find the row for your model.

**Step 3: Read the profile.** Load `references/models/<id>.md`. It gives you the framework (primary and fallback), the pre-planning density, the scaffold shape and the gotchas table. Apply those when you build the prompt.

**Step 4: Cross to the executor.** Open `references/pattern-index.md`. It locates each mechanic (context budget, output verification, quota fallback, permissions schema) by path in `prompt-models` or `cli-opencode`. Load the mechanic your dispatch needs and combine it with the prompt-craft from step 3.

---

## 4. HOW IT WORKS

### The Navigation Chain

Every dispatch follows four steps. First resolve the target model id through the alias map in `SKILL.md` (e.g. `minimax` resolves to `minimax-m3`, `deepseek` resolves to `deepseek-v4-pro`). Then load `references/models/_index.md` to pick the model row and confirm its status. Then load `references/models/<id>.md` for the prompt-craft: the framework, density, scaffold and gotchas. Finally follow `references/pattern-index.md` to the executor mechanics in `cli-opencode`. The prompt-craft from here and the mechanics from `cli-opencode` combine in the executor's prompt-pack.

### The Per-Model Profiles

The weight of this skill lives in `references/models/`. One file per active model, each under 120 lines. A profile records:

- The primary framework and why it was chosen. The model fit score, the benchmark evidence or the carry-forward source.
- The fallback framework: what to switch to if the primary underperforms.
- The pre-planning density: dense for MiniMax (the model needs structure up front), lean for MiMo (the model prefers a light touch), medium for the RCAF default set.
- A tuned scaffold: the section order, headings and word budget the model handles well.
- A gotchas table: the failure modes that operators hit repeatedly, with a concrete fix for each.

Swap a model's framework in one file and every dispatch picks it up. No drift.

### The Framework Map

The framework assignments follow a pattern rather than a pinned count. The set drifts as models are added or retired.

| Model | Primary framework | Pre-planning density | Evidence |
|---|---|---|---|
| deepseek-v4-pro | RCAF | medium | Default, unverified |
| kimi-k2.7-code | COSTAR (fallback TIDD-EC, avoid RCAF) | lean | Empirical (benchmark 007) |
| minimax-m3 | TIDD-EC (fallback RCAF) | dense | Empirical (benchmark 003, run on M2.7; carried to M3) |
| mimo-v2.5-pro | COSTAR (fallback RACE, avoid TIDD-EC and CIDI) | lean | Empirical (benchmark 004) |
| glm-5.2 | COSTAR (fallback TIDD-EC, avoid RCAF) | lean | Empirical (benchmark 008) |

RCAF is the default only for DeepSeek's default-unverified profile. TIDD-EC is the MiniMax choice, backed by a benchmark run. COSTAR is the MiMo and Kimi choice; Kimi uses TIDD-EC as fallback and avoids RCAF based on benchmark 007. The profiles cite their evidence. The generic framework definitions (the closed seven-framework set: RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) are defined once in `sk-prompt`. This hub only records the per-model choice.

### The Registry

`assets/model-profiles.json` is the source of truth. Each profile in `references/models/<id>.md` mirrors one row of that registry: the `recommended_frameworks` block (primary, fallback, avoid and density), the context length, the executors array and the quota pools. When the registry changes, the profile follows. When you need to know a model's dispatch paths or pool limits without reading the prose, open the registry.

### Craft Versus Mechanics

This hub owns prompt-craft and the model registry. The executor skills own mechanics.

What prompt-craft means: which framework to use, how dense the plan should be, what the scaffold looks like and what traps to watch for. All of it is prose in `references/models/<id>.md`.

What mechanics means: the binary flags for the executor CLI, the invocation wrapper, the context budget, the output-verification pipeline and the quota-fallback decision matrix. All of it lives in `cli-opencode`, reachable through `references/pattern-index.md`.

This split keeps each side clean. Change a framework assignment in the profile and the executor flags do not drift. Add a new CLI flag in the executor and the profiles do not need a rewrite.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for `prompt-models` before you dispatch any small model through `cli-opencode`. Reach for it when you need to know which framework a model wants or what its gotchas are. Reach for it when you are authoring a prompt-pack and need the scaffold shape.

Skip it for frontier models (Opus, Sonnet, gpt-5.5). Those are out of scope. Skip it when you are looking for binary flags or invocation wrappers. Those live in `cli-opencode`, not here.

### How the Four Owners Fit Together

Four skills own the small-model dispatch workflow. Each owns one layer and none overlaps.

| Skill | What it owns |
|---|---|
| `prompt-models` (this skill) | Per-model prompt-craft profiles and the model registry data |
| `sk-prompt` | The generic framework definitions (the seven-framework set and CLEAR scoring) |
| `cli-opencode` | Executor mechanics for all active models: flags, wrappers, the permissions schema and budget propagation |
| `system-spec-kit` | Runtime TypeScript helpers used by the executors |

`prompt-models` enhances `cli-opencode` (weight 0.8), so the advisor surfaces this hub next to that executor. The generic framework definitions live in `sk-prompt`. The profiles choose from that set but never restate the definitions. This three-way split means you pick the framework from here, the definition from `sk-prompt` and the mechanics from `cli-opencode`. Each layer changes independently.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| No profile for the model you named | The id resolves but no `<id>.md` exists in `references/models/` | Open `references/models/_index.md` to confirm the model is listed. If it is, author the profile following the checklist in `references/pattern-index.md` |
| The framework feels wrong for the task | The profile records the empirical best, but a task might be an outlier | Check the fallback framework. If both fail, open a benchmark run to test a third choice |
| Profile and registry disagree | The registry (`model-profiles.json`) was updated but the profile was not re-mirrored | Re-mirror the profile from its `model-profiles.json` row |
| Looking for flags or budgets here | Those are executor mechanics, not prompt-craft | Follow `references/pattern-index.md` to the cli-X for the flags and budget files |
| Hub does not surface in the advisor | The model name is missing from the executor's trigger phrases, or the advisor index is stale | Check `SKILL.md` trigger phrases in `cli-opencode`. Run `skill_graph_scan` to re-index |
| A model changed executors | The dispatch matrix row in `SKILL.md` §3 is out of date | Update the dispatch matrix row and the `executors` array in `model-profiles.json` |

---

## 7. FAQ

**Q: What does this hub own that the executors do not?**

A: This hub owns the per-model prompt-craft prose (framework, density, scaffold and gotchas) and the model registry data. The executors own the mechanics: binary flags, invocation wrappers, context budgets, output verification, quota fallback and permissions. One changes without dragging the other.

**Q: How is this different from `sk-prompt`?**

A: `sk-prompt` owns the generic framework definitions (what RCAF is, what TIDD-EC is and the CLEAR scoring rubric). This hub owns the per-model choice of which framework to use. `sk-prompt` says what TIDD-EC means. This hub says MiniMax uses TIDD-EC and why.

**Q: How is this different from `cli-opencode`?**

A: `cli-opencode` owns how you invoke a model: the binary, the flags, the budget and the fallback engine. This hub owns what prompt shape you send once the model is invoked. You read the profile here for the craft, then follow `pattern-index.md` to `cli-opencode` for the mechanics.

**Q: How do I add a new small model?**

A: Follow the adoption checklist in `references/pattern-index.md` §4. The steps are: add a row to `assets/model-profiles.json`, add a row to `references/models/_index.md`, author the profile at `references/models/<id>.md`, add the dispatch matrix row in `SKILL.md` §3 and re-index the advisor. No code changes unless the model needs a new executor path in `cli-opencode`.

**Q: The hub says RCAF is the default for most models. Should I ever use something else?**

A: Yes. The default is RCAF because it works for most models without special tuning. MiniMax and MiMo have empirical evidence that other frameworks perform better. Check the profile for the model you are dispatching. If it says something other than RCAF, use that.

---

## 8. VERIFICATION

The model index and registry record benchmark-backed framework assignments for MiniMax, MiMo and Kimi. DeepSeek's RCAF assignment remains default-unverified.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-prompt/prompt-models/README.md --type readme` reports zero issues |
| SKILL.md structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-prompt/prompt-models/SKILL.md --type skill` reports zero issues |
| Profile mirror check | Diff each profile's framework block against its `model-profiles.json` row |
| Benchmarks | Review the MiniMax benchmark 003, MiMo benchmark 004 and Kimi benchmark 007 evidence cited by `references/models/_index.md` and `assets/model-profiles.json` |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router, the dispatch matrix and the ownership rules |
| [`references/models/_index.md`](./references/models/_index.md) | Thin per-model index: id, framework, fallback, density and status |
| [`references/models/<id>.md`](./references/models/) | One prompt-craft profile per active model (the hub's weight) |
| [`references/pattern-index.md`](./references/pattern-index.md) | Locates each executor-owned mechanic and its ship status |
| [`assets/model-profiles.json`](./assets/model-profiles.json) | The model registry data each profile mirrors |
| [`assets/cli-prompt-quality-card.md`](./assets/cli-prompt-quality-card.md) | Canonical cross-CLI prompt quality card (framework selection, CLEAR, tiers) |
| [`benchmarks/`](./benchmarks/) | Framework bake-off run data and synthesis for MiniMax and MiMo |
