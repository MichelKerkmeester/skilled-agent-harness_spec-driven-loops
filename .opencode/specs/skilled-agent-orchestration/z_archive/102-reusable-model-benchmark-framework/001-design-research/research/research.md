---
title: "Research: Reusable, config-driven model-benchmark framework for deep-improvement"
description: "Synthesis of a 10-iteration cli-codex gpt-5.5 (high/fast) deep-research loop into how to evolve the one-off prompt-framework benchmark rigs (120/003, 126/004) and deep-improvement Lane B (121) into ONE config/profile-driven benchmark framework. Includes seam architecture, anti-saturation fixture strategy, reuse-vs-net-new mapping, and a prioritized P0/P1/P2 roadmap."
contextType: "research"
importance_tier: "important"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/001-design-research"
    last_updated_at: "2026-06-02T06:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Synthesized 10-iter research into research.md"
    next_safe_action: "Plan implementation phases from the P0/P1/P2 roadmap"
    blockers: []
---

# Research: Reusable, config-driven model-benchmark framework for deep-improvement

> **Method.** 10 iterations of `cli-codex gpt-5.5`, `model_reasoning_effort=high`, `service_tier=fast`, `--sandbox read-only`. The orchestrator (Claude) dispatched; codex investigated repo files directly each iteration and emitted evidence-grounded findings + structured deltas. **All 10 dispatches exited 0 with real findings — zero failures, zero fabricated runs.** codex-cli 0.135.0 has no `--search`, so grounding is repo code + model knowledge — the correct grounding for a design question. Per-iteration detail: `research/iterations/iteration-001..010.md`. Structured deltas: `research/deltas/deltas.jsonl` (64 deltas: 26 P0, 25 P1, 13 P2).

> **Confidence legend.** [H] high (≥0.85, multiple file citations), [M] medium (0.7–0.85, partial evidence or design extrapolation), [L] low (<0.7, plausible but unverified / flagged UNKNOWN by codex).

---

## 1. The problem, restated from evidence

The repo has **three** benchmark efforts that overlap but do not compose:

1. **`120/003`** (MiniMax, 7 fixtures) — `eval-loop/scripts/` with `dispatch-minimax.cjs`, `mutate.cjs` (prompt hill-climb), `score-variant.cjs`, `converge.cjs`, `seed-fixtures.cjs`, `synthesize.cjs`. A full mutation/hill-climb prompt-optimization rig. [H]
2. **`126/004`** (MiMo, lean 2-fixture port) — `eval/` with `run-mimo-bench.cjs`, `frameworks.cjs` (5 hard-coded frameworks rcaf/race/cidi/tidd-ec/costar), `fixtures.cjs` (2 hard-coded code fixtures `chunk`/`parseRange` with hidden tests), `extract.cjs`, `runner-child.cjs`. A framework bake-off rig. [H]
3. **`121` Lane B** (deep-improvement model-benchmark mode) — `scripts/model-benchmark/` with `run-benchmark.cjs` (profile loader + scorer selection + report), `dispatch-model.cjs` (5-executor abstraction + variant mapping), `scorer/score-model-variant.cjs` (5-dim D1–D5 scorer), `scorer/deterministic/*` (4 deterministic gates), `scorer/grader/*` (LLM-judge harness). A generalized model-benchmark mode. [H]

**The gap (iter 1):** Lane B already parameterizes fixtures, executors, scorer selection, and variant→reasoning mapping — but it has **no first-class concept of a prompt-framework bake-off, no sweep/matrix axis, no statistical rigor, and no tiered/anti-saturation fixture taxonomy**. So every new model OR technique OR situation still requires new rig code (exactly what `126/004` had to write). The README claims it can "dispatch a model or prompt framework," but the profile has no framework definitions and the dispatcher treats `variant` purely as executor/reasoning metadata. [H]

**The saturation problem (iter 2, quantified):** In `126/004`, every framework passed every hidden assertion — `assertion_pass_rate = 1` across all ~10 model×framework cells (`results.json` rows; `synthesis-high-reasoning.md` explicitly names the failure mode: "two deterministic pure functions made correctness useless, leaving only format and length"). Two tractable pure functions (`chunk`, `parseRange`) saturated correctness, so the benchmark **could only separate frameworks on format-adherence and brevity** — and a single-sample run (iter 4) meant those margins were ties with no confidence. A reusable framework that ignores this would keep producing misleading "winners." [H]

---

## 2. Proposed architecture — one profile, five seams

The unanimous direction across iterations 1, 7, 9, 10: **build this as an additive EXTENSION of Lane B, not a new rig.** Lane B already owns the hard bones (profile loading, fixture materialization, executor dispatch, 5-dim scoring, report history, a shared loop host). The missing pieces are a **matrix/sweep layer**, a **framework registry**, **harder tiered fixtures**, and **statistics**. [H]

```text
                         ONE benchmark profile  (mode + sweep axes + scoring + sampling + reporting)
                                          │
   ┌──────────────┬───────────────┬───────┴────────┬────────────────┬──────────────┐
   ▼              ▼               ▼                ▼                ▼              ▼
fixture-source  framework-source  dispatcher       scorer           reporter      (stats: cross-cut)
   │              │               │                │                │
artifact JSON   framework        dispatch-model    5dim + det/*     report.json +
+ NEW T3/T4     registry +       .cjs executor     + grader +       history + NEW
fixture packs   slot renderer    routing +         correctness      aggregate.json +
(category/tier/ (RCAF/RACE/...   NEW normalized    GATE             synthesis.md +
hidden oracle)  as DATA)         envelope                           NEW trust verdict
```

**The five seams, each driven by config:**

| Seam | What it does | Driven by profile key |
|------|--------------|-----------------------|
| **fixture-source** | Loads fixtures by category/tier filter; mixes artifact-contract JSON (T1 smoke) with hard T3/T4 code-task fixtures carrying hidden oracles | `fixtureDir`, `fixtureSelection{pack,include,filters{category,tier,hidden_tests}}` |
| **framework-source** | Renders a fixture through a prompt framework via slot interpolation (`{task}`,`{signature}`,`{context}`) — replaces `126/004`'s `render()` closures with data | `frameworks[]` (registry ids or inline) |
| **dispatcher** | Expands the model×executor×variant×framework×fixture×sample matrix and dispatches each cell via the existing 5-executor `dispatch-model.cjs`; returns a normalized `{output,tokens,cost,latency,exit_code}` envelope | `models[]{executor,provider,model_slug,variant}`, `variants[]` |
| **scorer** | Scores each cell as a dimension vector (correctness/format-scope/efficiency/reasoning); correctness is a **GATE**, not a weighted score, once saturated | `scoring{scorer,dimensions[],correctnessGate}` |
| **reporter** | Emits raw `results.json` + grouped `aggregate.json` + human `synthesis.md`; surfaces a **trustworthiness verdict (WINNER/TIE/INCONCLUSIVE)** *before* any leaderboard text; runs saturation auto-detect | `reporting{groupBy,leaderboard,history}` |

**`mode` is a thin selector (iter 9), not new code per situation.** One `mode` field sets sensible defaults (which axis sweeps, default scorer, default leaderboard); the operator just fills the swept axis. The runner never branches on "framework bake-off" — it always does *expand matrix → dispatch cells → score rows → reduce by groupBy*. This is what makes A–F below pure config. [H]

---

## 3. The keystone: config/profile schema (iter 7)

codex mapped **every key `run-benchmark.cjs` reads today** to exact line numbers and confirmed the contract that must not break: `fixtureDir`/`benchmark.fixtureDir` (L96/98), `fixtures`/`benchmark.fixtures` (L99), `profileId`/`id` (L421), `version` (L422), `benchmark.minimumFixtureScore` (L441, default 70), `benchmark.requiredAggregateScore` (L442, default 80), `thresholdDelta` (L449), `family` (L469), `targetPath` (L470), `benchmark.repeatabilityTolerance` (L486, default 0). It does **not** read `outputsDir` or `metrics` (those come from `--outputs-dir` and computed totals). `--scorer pattern|5dim` and `--grader noop` are CLI-only. [H]

**The extension is strictly additive.** New optional keys (`mode`, `models[]`, `frameworks[]`, `variants[]`, `fixtureSelection`, `scoring{dimensions,correctnessGate}`, `sampling`, `reporting`, `execution`) are **ignored by `run-benchmark.cjs` until a higher-level sweep runner consumes them**. `mode` unset = today's Lane B behavior (materialize + score, no sweep). Old keys remain authoritative for legacy scoring. This is the single most important compatibility property: Lane B agent-improvement benchmarks keep working untouched. [H]

The 5-dim scorer **already accepts a rubric vector** via `opts.rubric` (`score-model-variant.cjs:193`) with default D1–D5 weights (L39) — so `scoring.dimensions[]` maps directly onto `rubric.dims` with no scorer rewrite. [H]

**Composition (iter 7, P2):** single-parent `extends` + `overrides` with deep-merge-objects / replace-arrays-wholesale / forbid-multiple-inheritance. Keeps common fixtures/scoring/execution DRY without making resolution hard to debug. [M]

**Validation (iter 7, P0):** a small dependency-free validator — mode enum, executor enum against `KNOWN_EXECUTORS` (`dispatch-model.cjs:105`), scorer enum against `pattern|5dim`, dimension weights sum to `1.0 ± 0.001`, positive sample counts, `confidenceLevel ∈ (0,1)`. [H]

Full example profiles (a `framework-bakeoff` that reproduces `126/004` as pure config, and a minimal MVP profile) are in `research/iterations/iteration-007.md`.

---

## 4. Anti-saturation fixture strategy (iter 2 + the throughline)

This is the design's central correctness obligation. **Five mechanisms compose to fix it (iter 10):**

1. **Correctness as a GATE, not a score (iter 3).** When correctness saturates (every cell = 100%), stop ranking on it. Gate eligibility on `pass_rate ≥ threshold`, then rank survivors on efficiency / format-scope / reasoning. A saturated correctness column can no longer flatten or mislead the leaderboard. [H]
2. **Tiered, harder fixtures (iter 2).** A reusable taxonomy across **task categories** (algorithmic, bug-fix-in-context, refactor, ambiguous-spec, multi-file, long-context, tool-use/agentic, format-adherence) × **difficulty tiers T1–T4**. Retire/demote `chunk`/`parseRange` to T1 smoke; replace ranking fixtures with T3/T4 bug-in-context, multi-file, adversarial, strict-acceptance tasks that frontier models actually vary on. The `120` 7-fixture set (`deepEqual`, path traversal, wrong-CWD, bundle smoke-run) is a grounded precedent for harder fixtures. [H]
3. **Per-dimension separation (iter 3).** Keep format-adherence in its **own** lane — never fold it into a "correctness winner" claim. The `126/004` mistake was presenting a format/length winner as if it were a correctness winner. [H]
4. **Hidden-test anti-overfitting (iter 2).** Generalize `126`'s hidden `tests` array (`fixtures.cjs`/`extract.cjs`): held-out tests + seeded randomized/property cases + adversarial edge pools, so a model cannot pattern-match the visible prompt. Reproducible via seed. [M]
5. **Saturation auto-detect (iter 2/8/10).** Flag any fixture where ≥N independent cells all score 100% correctness with zero variance (practical rule: 3+ frontier models or 15+ dispatches at `assertion_pass_rate=1`); mark `saturation.status` and require an action: `keep` / `promote` (add adversarial cases) / `smoke-only` (demote) / `retire`. [H]

**Reusable fixture-pack schema (iter 2):** JSON+sidecar expressing `{category, tier, prompt, visibleSpec, scope, hidden oracle/tests, scoring hooks, expectedDifficulty, saturation policy}` — so adding a fixture is **data, not code**. [H]

> **Honest UNKNOWN (iter 2/8):** codex found scoring primitives but **no true long-context fixture and no required-tool-use/agentic scoring contract** in the current repo. Those categories are net-new schema extensions, not generalizations of existing behavior. [L]

---

## 5. Statistical rigor (iter 4)

codex confirmed the single-sample limitation directly from evidence: `126/004` ran effectively one sample per cell, and `synthesis-high-reasoning.md` flags that close results are ties with no confidence. `default.json`'s `repeatabilityTolerance: 0` **contradicts** observed run-to-run noise — it is brittle. [H]

Reusable, **dependency-free** (no scipy/numpy) design:

- **Multi-sample:** N runs per `(model × framework × fixture)` cell; aggregate by the metric-appropriate statistic (pass@k or mean-of-n for correctness, median for efficiency/format).
- **`stats.cjs` (NET-NEW):** `mean`, `median`, `mad`, `quantile`, `seededRandom`, `bootstrapPairedDeltaCi`, `pairedWinRate`. MAD over repeated identical configs estimates the **noise floor** (minimum detectable difference).
- **Trustworthiness gate:** declare a `WINNER` only if `N ≥ minSamplesForWinner` **AND** `margin > noiseFloor` **AND** paired 90% CI excludes zero; otherwise emit `TIE` or `INCONCLUSIVE` with a reason (`insufficient_n` / `inside_noise_floor` / `ci_overlaps_zero` / `trusted_margin`).
- **Cost-aware sampling:** `samplesPerCell` configurable per profile; sane defaults N=1 smoke / N=3–5 ranking / N=10 publication. Preflight the cost: `calls = models × executors × variants × frameworks × fixtures × samples` + retry budget.
- **Reuse `120/003` `converge.cjs`:** borrow its `plateauSignal` + `madSignal` *concepts* for early-stop on stabilized top-pair margin/CI-width (not its mutation-exhaustion stop rule). [H]

---

## 6. Model-agnostic dispatch (iter 5)

`dispatch-model.cjs` is **already the universal dispatcher** for 5 executors — it documents params `prompt_file/executor/model/agent/variant/state_dir/mock/mock_mode/cwd/timeout_ms` (L13), routes `cli-opencode/cli-claude-code/cli-codex/cli-gemini/cli-devin` (L105), and maps `variant`→`--variant` (OpenCode, L197) / `--effort` (Claude, L207) / `model_reasoning_effort` (Codex, L215). [H]

**What it does NOT capture, and the one-off rigs do:** `126/004` parses tokens/cost/latency from `opencode run --format json` output (the reuse target). Proposed: a **normalized envelope** `{output, stdout, stderr, latency_ms, exit_code, attempts, tokens_in, tokens_out, cost_usd, executor, provider, model, variant}` for ALL executors — with **nullable** token/cost fields where a CLI does not expose usage (return `null`, never fabricate). Add `--format json` parsing to the `cli-opencode` builder using `126`'s `extractAssistantText` pattern. [H]

**Provider quirks as config, not code (iter 5):** the `--agent` omission lesson (MiniMax/MiMo token-plan providers must omit `--agent general`) and token-plan provider ids (`minimax-coding-plan`, `xiaomi-token-plan-ams`) belong in a **machine-readable capability table**. codex correctly located the canonical registry at `sk-prompt/assets/model-profiles.json` (confirmed to exist, 13.8KB) — promote `model_slug / default_variant / variant_flag / agent_policy / format_mode / quota_pool` there. [H]

> **Honest UNKNOWN (iter 5):** whether the current OpenCode binary's `session.completed` payload actually includes token/cost fields is unverified — codex proved the event-stream *shape* but not the usage fields. Per-executor cost parsers for Claude/Codex/Gemini/Devin are lower-confidence (0.72). [L]

---

## 7. Prompt-framework registry (iter 6)

`126/004`'s `frameworks.cjs` defines each framework as `{id, render(fixture) → prompt}` — a JS closure interpolating `task`/`signature`/`fn_name`. This is **one-off because it is code, not data**. [H]

**Proposed framework-source seam:** a machine-readable registry where a framework = `{id, description, template (named slots {task}/{signature}/{context}/{constraints}), output_contract, applies_to (categories)}`. A single slot renderer with required-slot validation replaces all `render()` closures — adding RCAF/RACE/CIDI/TIDD-EC/COSTAR/CRISPE/CRAFT or a **custom** technique becomes a manifest entry + template file with **zero code**. [H]

- **Location decision (iter 10):** keep canonical framework definitions in `sk-prompt/assets/framework-registry.json` (sk-prompt owns the 7 frameworks); keep benchmark-local output contracts in `deep-improvement`. [M]
- **Pre-planning density as a technique axis (iter 6):** the deterministic `preplanning-regex` scorer already measures it; express "framework + pre-planning level" as a registry variant that injects a planning preamble — a config axis, not new code. [M]
- **Mutation/hill-climb stays OPTIONAL/P2 (iter 6):** `120/003` `mutate.cjs` evolved prompts via section operators + a scoring loop. Map those to reusable mutation operators over framework/technique axes, rendered from metadata — but MVP is the **static** registry bake-off; auto-discovery is later. [M]

---

## 8. Reporting (iter 8)

The reporter is the **direct fix for the 126/004 mis-read risk.** Design:

- **Machine layer:** `results.json` (per-cell raw: model/executor/variant/framework/fixture/sample, dimension scores, tokens/cost/latency, pass/gate) + `aggregate.json` (per groupBy combo: n, mean, median, CI, top-pair delta, saturation status, `WINNER|TIE|INCONCLUSIVE` verdict).
- **Human layer:** `synthesis.md` generated from `aggregate.json` — per-dimension breakdown, leaderboard tables, **trust verdict surfaced BEFORE leaderboard language**, saturation table (which fixtures saturated + action), regression block, reproducibility block.
- **Multi-axis ranking:** `reporting.groupBy` + `rankBy` arrays drive both model-vs-model AND framework-vs-framework leaderboards from the same rows.
- **Regression-over-time + reproducibility:** reuse Lane B's stable `report.json` + immutable `report-history` snapshot pattern, adding `git_sha / profile_hash / fixture_hashes / model_versions / executor_versions / seed / schema_version`. This makes skill-change regression and model-drift trackable. [H]
- Add **nullable** `tokens`/`cost` fields to raw rows now (even before providers expose them) to avoid schema churn later. [M]

---

## 9. Situational modes — all six are config-only (iter 9)

The payoff of the thin-`mode`-selector design: **the only thing that changes between situations is the profile.** [H]

| Mode | Swept axis | Fixed | Reuse vs new |
|------|-----------|-------|--------------|
| **A model-vs-model** | `models[]` | prompt + fixtures | needs sweep machinery |
| **B framework bake-off** (the `126/004` case) | `frameworks[]` | model + fixtures | needs sweep machinery + framework registry |
| **C reasoning-effort ablation** | `variants[]` (high/med/low) | model + prompt + fixtures | needs sweep; `variant` already dispatched |
| **D prompt-vs-prompt** | 2 candidate prompts | model + fixtures | reuses Lane B scoring + a 2-candidate wrapper |
| **E skill-change regression** | run-label (before/after) | profile + fixtures | **closest to Lane B as-is** — agent-improvement before/after + report history is the regression substrate |
| **F capability profiling** | full tiered fixture taxonomy | one model | needs sweep; **the anti-saturation payoff** |

**F is the anti-saturation payoff (iter 9):** a tiered taxonomy × D1–D5 dimensions yields a per-model **capability radar (category × tier × dimension)** where a frontier model still shows weakness even when easy fixtures are saturated. codex independently surfaced corroborating evidence from `122` (tiered fixtures: generated/decontaminated, hand-authored holdout, adversarial/negative, with the T1–T2 gap as a circularity meter) and the `121/002` research.md principle "mode selects implementations while seams stay mode-agnostic." [H]

**Why B needed its own rig historically (iter 9, grounded in `126/004`'s implementation-summary):** Lane B's fixture model did not fit the framework bake-off cleanly — which is exactly the gap this framework closes. [H]

---

## 10. Reuse vs net-new (iter 10)

| Component | Class | Lane B asset it builds on |
|-----------|-------|---------------------------|
| dispatcher | **EXTEND** | `dispatch-model.cjs` executor map + variant forwarding → add normalized envelope |
| scorer | **EXTEND** | `score-model-variant.cjs` (5dim) + `deterministic/*` + `grader/*` → add correctness gate + plugin adapters |
| profile loader | **EXTEND** | `run-benchmark.cjs` profile reading → add additive sweep/scoring/sampling/reporting keys |
| loop/sweep host | **EXTEND** | `shared/loop-host.cjs` → add generic matrix expander, no bespoke branches |
| reduce/report | **EXTEND** | `shared/reduce-state.cjs` + `report.json`/history → grouped aggregate + trust verdict + leaderboard + saturation/regression reducers |
| fixtures (artifact JSON) | **REUSE-AS-IS** | demote to T1 smoke/regression, not ranking |
| framework registry | **NET-NEW** | builds on `126` framework idea; canonical home `sk-prompt/assets` |
| `stats.cjs` | **NET-NEW** | builds on iter-4 design |
| fixture taxonomy/tiers | **NET-NEW** | builds on `120`/`126` fixture lessons |

---

## 11. Prioritized roadmap

### P0 / MVP — make framework-bakeoff + model-vs-model a CONFIG, and make saturation un-misreadable
**Deliverable.** One profile can run `framework-bakeoff` *or* `model-vs-model` by changing config only.
**Pieces (smallest set):**
- Additive profile keys: `mode`, `models[]`, `frameworks[]`, `variants[]`, `scoring.correctnessGate`, `reporting` (`benchmark-profiles/*.json`) + a dependency-free profile validator.
- A **matrix expander** (codex's recommended decision: a *new* `sweep-benchmark.cjs` module that `loop-host.cjs` calls — not embedded) running `models × executors × variants × frameworks × fixtures × samples` with **no mode-specific branches**.
- A **framework registry + slot renderer** (`sk-prompt/assets/framework-registry.json`) so bake-offs are data-driven; replace `126/004` `frameworks.cjs` closures.
- **Reuse** the 5-dim + deterministic scorer; make **correctness a GATE**; report per-dimension separately (`scorer/`, scoring adapter mapping `scoring.dimensions` → `rubric.dims`).
- **A couple of T3/T4 fixtures** with hidden deterministic oracles (enough to prove non-saturation); keep artifact fixtures as smoke only.
- **Reporter emits `WINNER/TIE/INCONCLUSIVE` + saturation status BEFORE leaderboard output.**

**Acceptance.** A profile runs both modes; correctness gates eligibility; the report says `WINNER/TIE/INCONCLUSIVE`; **easy-fixture saturation cannot produce a winner claim.**

### P1 — statistical + operational reliability
- `stats.cjs` (mean/median/MAD/quantile/seeded paired bootstrap CI/noise floor); multi-sample rows; **CI/noise-floor gate on winner claims**.
- `dispatch-model.cjs` normalized envelope with latency + nullable tokens/cost + OpenCode JSON parsing.
- `reduce-state.cjs` grouped leaderboard reducers + saturation auto-detect (fixture/dimension/model/framework/variant).
- Tiered fixture taxonomy + CI fixture pack; taxonomy docs/profiles; replace `default.json` `repeatabilityTolerance:0` with a meaningful default/calibration mode.
**Acceptance.** Multi-sample exists; paired CI/noise floor gates winners; cost/latency reported; CI can fail on regression; `groupBy` leaderboards.

### P2 — optimization + richer analysis
- Optional mutation/hill-climb over framework/technique axes (map `120/003` `mutate.cjs` operators).
- Single-parent profile `extends`/overrides; custom-framework template loading (data-only).
- Per-executor cost parsers (Claude/Codex/Gemini/Devin) where CLIs expose usage.
- Capability radar reducers (category × tier × dimension).
**Acceptance.** Hill-climb mutates axes; profiles extend bases; capability radar renders; custom framework is data-only.

---

## 12. Risks (iter 10)

| Risk | Mitigation |
|------|------------|
| **Dispatch cost blow-up** (sweep × samples = real CLI calls) | Preflight `calls = axes product`; require `samplesPerCell` caps + per-profile budget gates (`cost.max_calls`/`max_usd`). |
| **Grader nondeterminism/cost** | Default `noop`/deterministic; require explicit `llm`; cache by rubric/output/model hash (the grader cache already exists). |
| **Scope sprawl** | P0 explicitly excludes mutation, full stats, custom templates, cost parsers. |
| **Breaking Lane B** | New keys additive + ignored until the sweep runner consumes them; legacy `run-benchmark.cjs` path and old profile keys stay authoritative. |
| **Provider quirks** | Move `agent`/`variant`/`format` policy into capability config; unknown token/cost parsers return `null`, never fabricate. |

## 13. Biggest implementer decisions (iter 10)
1. **Matrix expander = new `sweep-benchmark.cjs`** that `loop-host` calls (not embedded). [recommended]
2. **Framework registry in `sk-prompt/assets`** (canonical defs) + benchmark-local output contracts in `deep-improvement`. [recommended]
3. **Keep `run-benchmark.cjs` as the row scorer**; add the sweep/report layer *around* it. [recommended]
4. **P0 fixtures: only a couple T3/T4**, enough to prove non-saturation. [recommended]
5. **Correctness gate threshold starts at `1.0`** for hidden deterministic tests, configurable for partial-credit fixtures. [recommended]

---

<!-- ANCHOR:references -->
## References (repo evidence)

All findings below are grounded in repo files read directly by `cli-codex gpt-5.5` (read-only) across iterations 1–10. Path corrections applied during the run: `126` lives under `126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/`; `120` under `120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/`.

**deep-improvement Lane B (the extension target):**
- `.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` — profile loader (keys at L96/98/99/421/422/441/442/449/469/470/486), `--scorer pattern|5dim` (L389/391), `--grader noop` (L397), report.json + history (L462/510)
- `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` — params (L13), 5 executors (L105), variant maps (L197/207/215), target_model defaults (L87)
- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs` — `score({...})` (L22/255), DEFAULT_RUBRIC D1–D5 (L39), `opts.rubric` (L193), grader kinds llm/mock/noop (L165)
- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/{bundle-gate,cwd-check,hallucination-flag,preplanning-regex}.cjs` — deterministic gates
- `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/{harness,dispute}.cjs`, `scorer/lib/cache.cjs` — LLM-judge harness + cache
- `.opencode/skills/deep-improvement/scripts/model-benchmark/README.md`
- `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json` — current profile contract
- `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/{fixture-baseline,fixture-improved,fixture-edge}.json` — artifact-contract fixtures
- `.opencode/skills/deep-improvement/scripts/shared/{loop-host.cjs,reduce-state.cjs}` — shared deep-loop runtime (sweep host + reducers)

**126/004 framework bake-off rig (the one-off this generalizes):**
- `.../126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs` — DEFAULT_MODEL (L31), opencode run --format json dispatch (L72), scoring (L189), leaderboard groupBy framework (L252), combos (L117)
- `.../eval/frameworks.cjs` — 5 hard-coded frameworks rcaf/race/cidi/tidd-ec/costar with render() (L28)
- `.../eval/fixtures.cjs` — 2 hard-coded fixtures chunk/parseRange + hidden tests (L8/20)
- `.../eval/{extract,runner-child}.cjs` — extraction + subprocess isolation
- `.../eval/{results-mimo-high,results-minimax-high,results}.json` — per-cell pass rates (saturation evidence, all assertion_pass_rate=1)
- `.../eval/{synthesis-high-reasoning,synthesis}.md` — saturation + single-sample-tie writeups (L12/55/111)
- `.../126-.../004-.../implementation-summary.md` — why a separate rig was built (L109)

**120/003 mutation/hill-climb rig:**
- `.../120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/{mutate,render-variant,loop,score-variant,converge,seed-fixtures,synthesize}.cjs`, `dispatch-minimax.cjs`, `dispatch-swe16.cjs` — converge plateauSignal (L27) + madSignal (L54)

**121 Lane B design + cross-references:**
- `.../121-deep-agent-improvement-benchmark-mode/spec.md`
- `.../121-.../002-research-model-benchmark-implementation/research/research.md` — "mode selects implementations while seams stay mode-agnostic" (L25/34)
- `.../122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/opus/iterations/iteration-003.md` — tiered fixtures / T1–T2 circularity gap (L83)

**Framework + model registries (canonical homes):**
- `.opencode/skills/sk-prompt/assets/model-profiles.json` (confirmed, 13.8KB) — capability/provider registry target
- `.opencode/skills/sk-prompt/SKILL.md`, `.opencode/skills/sk-prompt/references/model-profiles.md` — framework catalog source
<!-- /ANCHOR:references -->
