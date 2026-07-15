Now I have all the data needed. Here is the factual map:

---

## 1. PURPOSE
`sk-prompt-models` is the per-model prompt-craft knowledge hub for small-model dispatch, owning one prompt-craft profile (framework, scaffold, gotchas) per active model, plus the shared model registry `assets/model-profiles.json`.

## 2. PROBLEM
Every small model (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, MiniMax-M3, MiMo-V2.5-Pro) responds differently to prompt frameworks — MiniMax wants guardrail-heavy TIDD-EC + dense pre-planning, while MiMo wants COSTAR + lean and regresses under TIDD-EC. Without a single, discoverable hub that maps each model to its empirically-tested framework, scaffold shape, and dispatch gotchas, operators either use wrong defaults (detuning output) or must search across five executor skill directories to find the right recipe. Separating prompt-craft (per-model profiles here) from executor mechanics (binary flags, invocation wrappers in `cli-devin`/`cli-opencode`) keeps each concern clean — when a flag changes, only the executor is touched; when a framework choice changes, only the profile is updated.

## 3. MODES & CAPABILITIES
- **Per-model profiles** — seven active profiles (`swe-1.6.md`, `deepseek-v4-pro.md`, `kimi-k2.6.md`, `qwen3.6.md`, `glm-5.1.md`, `minimax-m3.md`, `mimo-v2.5-pro.md`) in `references/models/`, each recording primary/fallback framework, pre-planning density, tuned template snippet, and dispatch gotchas; one historical profile (`minimax-2.7.md`).
- **Model registry** — `assets/model-profiles.json` (version `1.4`) is the canonical structured DATA (context lengths, executor paths, provider/quotapool assignments, recommended_frameworks, capability fields) that every profile mirrors and cites.
- **Prompt-craft vs. mechanics split** — this skill owns the prompt-CRAFT (which framework, what scaffold, pre-planning density, model-specific gotchas); `cli-devin` and `cli-opencode` own the MECHANICS (binary flags, invocation wrappers, per-model budgets, permissions schemas); `sk-prompt` owns the generic 7-framework definitions.
- **Advisor co-surfacing** — the advisor reaches this skill through `enhances` edges (weight 0.5 each) from `cli-devin` and `cli-opencode` in `graph-metadata.json`, so naming any small model surfaces the hub alongside the matching executor.
- **Benchmarks** — five benchmark directories under `benchmarks/` (`001-swe-1.6-eval-loop`, `002-swe-1.6-extraction-rerun`, `003-minimax-prompt-framework`, `004-mimo-prompt-framework`, `005-mimo-minimax-capability-discrimination`) holding real run data; profiles cite these as evidence for framework choices (e.g., benchmark 003 established TIDD-EC/dense for MiniMax; benchmark 004 established COSTAR/lean for MiMo).

## 4. INVOCATION
The skill is reached automatically when an operator names a small model — the advisor co-surfaces it alongside `cli-devin` or `cli-opencode` via the `enhances` edges. The navigation path is: read `references/models/_index.md` to pick the target model and its framework, then read `references/models/<id>.md` for the full profile (framework, pre-planning density, tuned template snippet, dispatch gotchas), then follow `references/pattern-index.md` to locate the executor-owned MECHANICS in `cli-devin` or `cli-opencode`. A profile contains: model identity (slug, context window, quota pool, executor path), recommended framework (primary + fallback), benchmark evidence (scores, confidence, sample run details), a tuned copy-paste-ready template snippet, and a dispatch gotchas table (slug, variant flag, agent policy, quota pool). The skill carries no tools, runtime code, or scripts — it is purely prose profiles and indexes.

## 5. KEY FILES

| Path | Purpose |
|------|---------|
| `SKILL.md` | Runtime entry point: smart router pseudocode, dispatch matrix, hub rules, and skill boundary map |
| `README.md` | Human-facing overview, quick-start, FAQ, and related-document index |
| `graph-metadata.json` | `enhances` edges (cli-devin + cli-opencode at weight 0.5) and trigger phrases consumed by the advisor |
| `description.json` | Memory index metadata: keywords, trigger examples, importance tier (important) |
| `references/models/_index.md` | Thin per-model index: id → framework primary/fallback, pre-planning density, status, and profile link |
| `references/models/swe-1.6.md` | SWE-1.6 profile: RCAF + medium pre-planning, default-unverified |
| `references/models/deepseek-v4-pro.md` | DeepSeek-v4-pro profile: RCAF + medium pre-planning, default-unverified |
| `references/models/kimi-k2.6.md` | Kimi-k2.6 profile: RCAF + medium pre-planning, default-unverified |
| `references/models/qwen3.6.md` | Qwen3.6 profile: RCAF + medium pre-planning, default-unverified |
| `references/models/glm-5.1.md` | GLM-5.1 profile: RCAF + medium pre-planning, default-unverified |
| `references/models/minimax-m3.md` | MiniMax-M3 profile: TIDD-EC + dense pre-planning, empirical (benchmark 003 on M2.7, carried) |
| `references/models/mimo-v2.5-pro.md` | MiMo-V2.5-Pro profile: COSTAR + lean pre-planning (RACE fallback, avoid TIDD-EC/CIDI), empirical (benchmark 004, confidence high) |
| `references/models/minimax-2.7.md` | MiniMax-M2.7 historical profile (benchmark 003 host; active M3 profile carries its contract) |
| `references/pattern-index.md` | Index mapping every executor-owned mechanic to its canonical cli-* location plus ship status; carries the adoption checklist (§4) |
| `assets/model-profiles.json` | Unified model registry (version 1.4, 9 entries): the canonical DATA source each profile mirrors |
| `assets/cli_prompt_quality_card.md` | Canonical cross-CLI prompt quality card: framework selection table, CLEAR checklist, pre-planning density guidance, bundle-gate strictness, prompt-composition precedence (Tiers 1–3) |
| `benchmarks/001-swe-1.6-eval-loop/` | SWE-1.6 evaluation-loop benchmark run data |
| `benchmarks/002-swe-1.6-extraction-rerun/` | SWE-1.6 extraction rerun benchmark data |
| `benchmarks/003-minimax-prompt-framework/` | MiniMax prompt-framework bakeoff (7-fixture rig, 49 dispatches) — establishes TIDD-EC/dense |
| `benchmarks/004-mimo-prompt-framework/` | MiMo prompt-framework bakeoff (10/10 runs) — establishes COSTAR/lean |
| `benchmarks/005-mimo-minimax-capability-discrimination/` | MiMo vs MiniMax capability discrimination runs |
| `changelog/` | Version changelogs (v0.1.0.0 through v0.7.2.0, 10 entries) |

## 6. BOUNDARIES
This skill does **NOT** own:
- **Executor mechanics** — binary flags, invocation wrappers, per-model token budgets, context budget engines, output verification pipelines, quota-fallback logic, structured permissions enforcement, and prompt-pack templates. Those live in `cli-devin/references/`, `cli-devin/assets/`, `cli-opencode/references/`, and `cli-opencode/assets/`.
- **Generic prompt-engineering frameworks** — the canonical 7-framework definitions (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), CLEAR scoring, and DEPTH thinking. Those live in `sk-prompt/`.
- **Runtime logic** — no shell scripts, no TypeScript helpers, no agent-config recipes. Runtime helpers (bayesian-scorer.ts, fallback-router.ts, permissions-gate.ts) live in `system-spec-kit`.

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**
- **No profile authored yet for a model** — the smart router returns a `notice` saying "no prompt-craft profile authored yet" and refers to `_index.md`. The model has a registry row but no profile weight; adopt via `pattern-index.md` §4.
- **Craft-vs-mechanics confusion** — operators looking for flag syntax, invocation wrappers, or budget defaults in the profiles find only framework/scaffold/gotchas prose. The fix is to follow `pattern-index.md` to the owning cli-* file; the hub points at mechanics, never restates them.
- **Hub not surfacing** — trigger phrases in `graph-metadata.json` may be stale; run `skill_advisor.py --force-refresh` and verify with a sample prompt.
- **Profile contradicts the registry** — profile prose drifted from `model-profiles.json`; re-mirror the profile from its registry row.
- **A model is unreachable by name** — the model name is missing from the dispatching executor's `graph-metadata.json` trigger phrases; add it there, then re-index.

**Questions a user actually asks:**
1. "What framework should I use to prompt MiniMax-M3 / MiMo-V2.5-Pro / SWE-1.6?"
2. "Where are the executor flags and invocation wrappers — I don't see them in the profile?"
3. "How do I add a new small-model provider (Haiku, Gemini Flash)?"
4. "What does this hub own versus cli-devin / cli-opencode / sk-prompt?"

## 8. STALE FACTS
The current README.md reports version `0.7.0.0` in its Key Statistics table (line 35), but SKILL.md version is `0.7.2.0` (line 5). The README model count states 7 active profiles with `mimo-v2.5-pro` in the list (line 37), which matches the current `_index.md` and `model-profiles.json`; however the README's version discrepancy is a stale fact. No other inaccuracies found — the active model list, file paths, ownership boundary, and reference structure all match SKILL.md and the real directory contents.