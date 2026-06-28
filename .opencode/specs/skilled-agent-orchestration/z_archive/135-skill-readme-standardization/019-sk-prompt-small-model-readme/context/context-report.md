# Context Report: sk-prompt-models README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the per-model profiles, the craft-versus-mechanics split, the four-way ownership map and the navigation chain. Both flag the same stale facts (version, and a wrong "five executors" claim).

---

## 1. PURPOSE

`sk-prompt-models` is the per-model prompt-craft hub for small-model dispatch. Before you send work to a small model through cli-devin or cli-opencode, you read that model's profile here for the right prompt framework, scaffold and gotchas, then apply the executor mechanics from the cli-X skill.

## 2. PROBLEM

Different small models want different prompt shapes. MiMo does best with COSTAR and a lean plan, MiniMax wants TIDD-EC and a dense plan, and the rest default to RCAF. Guess wrong and the model underperforms or ignores half the instructions. The fix is one place that records each model's framework, scaffold and known traps. Mixing that prompt-craft with executor mechanics (binary flags, budgets, permissions) makes both drift, so this hub holds the craft and points at the executor for the mechanics, keeping each clean.

## 3. MODES & CAPABILITIES

- Per-model profiles: one `references/models/<id>.md` per active model, each with a primary and fallback framework, a pre-planning density, a tuned scaffold and a gotchas table.
- The registry: `assets/model-profiles.json` is the source of truth the profiles mirror, holding context length, executors, quota pools, strengths and the recommended frameworks.
- Craft versus mechanics: this hub owns the prompt-craft prose and the registry, while cli-devin and cli-opencode own the executor mechanics.
- Advisor co-surfacing: the hub is reached through `enhances` edges (weight 0.5) from both cli-devin and cli-opencode, so it appears next to whichever executor is in use.
- Benchmarks: framework bake-offs back the empirical choices for MiniMax-M3 and MiMo.

## 4. THE FRAMEWORK MAP (verified, model-profiles.json)

| Model | Primary framework | Density | Evidence |
|-------|-------------------|---------|----------|
| swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1 | RCAF | medium | default, unverified |
| minimax-m3 | TIDD-EC (fallback RCAF) | dense | empirical (benchmark) |
| minimax-2.7 | TIDD-EC (fallback RCAF) | dense | historical |
| mimo-v2.5-pro | COSTAR (fallback RACE, avoid TIDD-EC and CIDI) | lean | empirical (benchmark) |

The model set drifts as models are added or retired, so the README should describe the assignment pattern (RCAF as the default, TIDD-EC for MiniMax, COSTAR for MiMo) rather than pin a hard count.

## 5. INVOCATION & NAVIGATION (verified)

The skill carries no tools and no runtime code. It is reached when the advisor co-surfaces it with cli-devin or cli-opencode. The navigation chain (`SKILL.md:79-86`): resolve the target model id, load `references/models/_index.md` to pick the model, load `references/models/<id>.md` for the framework, scaffold and gotchas, then follow `references/pattern-index.md` to the executor mechanics in the relevant cli-X. The prompt-craft from here and the mechanics from the cli-X combine in the executor's prompt-pack.

## 6. THE OWNERSHIP MAP (verified, SKILL.md:214-216)

Four owners, no overlap:
- `sk-prompt-models`: the per-model prompt-craft profiles and the model registry data.
- `cli-devin`: the mechanics for SWE-1.6 plus DeepSeek, Kimi and GLM through its provider, with budget, verification and fallback engines.
- `cli-opencode`: the mechanics for MiniMax and MiMo, with the flags, the permissions schema and budget propagation.
- `sk-prompt`: the generic framework definitions (the closed seven-framework set and CLEAR scoring) that the profiles choose from but never restate.
- `system-spec-kit`: the runtime helpers in TypeScript.

## 7. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | The smart router, the navigation chain, the dispatch matrix and the rules |
| `references/models/_index.md` | The thin per-model index: id to framework, fallback, density and status |
| `references/models/<id>.md` | One prompt-craft profile per active model (the hub's weight) |
| `references/pattern-index.md` | Locates each executor-owned mechanic and its ship status |
| `assets/model-profiles.json` | The model registry data each profile mirrors |
| `assets/cli_prompt_quality_card.md` | The canonical cross-CLI prompt quality card (framework selection, CLEAR, tiers) |
| `benchmarks/` | The framework bake-off run data and synthesis |

## 8. BOUNDARIES

The hub owns prompt-craft, not mechanics. Binary flags, invocation wrappers, budgets and permissions live in cli-devin and cli-opencode, and a profile points at them through `pattern-index.md` rather than restating them. The generic framework definitions live in `sk-prompt`; this hub owns only the per-model choice of which one to use. It carries no shell or scripts. It scopes to small models, so frontier models like Opus, Sonnet and gpt-5.5 are out of scope.

## 9. TROUBLESHOOTING & FAQ MATERIAL

- No profile for a model: the id resolves but no `<id>.md` exists. The router returns a notice pointing at `_index.md`; author the profile per the `pattern-index.md` checklist.
- Looking for mechanics here: flags and wrappers are not here by design. Follow `pattern-index.md` to the cli-X.
- Profile drifted from the registry: re-mirror the profile from its `model-profiles.json` row.
- Hub not surfacing: the model name is missing from the executor's trigger phrases, or the advisor needs a re-index.
- FAQ: what the hub owns versus the executors, how it differs from `sk-prompt` (per-model choice versus generic definitions), how it differs from the cli-X executors (craft versus mechanics), and how to add a new small model.

## 10. STALE FACTS

The narrative template drops version lines and brittle counts, so the drift resolves on rewrite:

- Version: the README says 0.7.0.0, SKILL.md says 0.7.2.0. Drop the version line.
- "Five executors": the README claims prompt-craft cannot drift across five executors. The hub dispatches through two active executors (cli-devin and cli-opencode) plus an optional third (cli-claude-code for haiku). The "five" likely confused the dispatch executors with the five CLI quality-card mirrors. Say two executors plus an optional third.
- The cli-devin and cli-opencode one-line descriptions in the README undercount what each dispatches (cli-devin also handles DeepSeek, Kimi and GLM, not only SWE-1.6).

## 11. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, the hub model and the profiles; iteration 2 verified the framework map, the ownership split, the navigation chain and the stale facts, each cited to a file and line. Both models agreed on the framework assignments and the four-way ownership map, and both found the same version and executor-count drift. Converged before the three-iteration ceiling.
