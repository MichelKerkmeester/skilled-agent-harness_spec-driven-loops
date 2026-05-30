# Consolidated Research Report — Lane C "skill-benchmark" Design + `deep-agent-improvement → deep-improvement` Rename

> **Packet:** 122-deep-improvement-skill-benchmark-mode / 001-skill-benchmark-deep-research
> **Synthesis of:** 20 iterations × 4 models (MiniMax-2.7, DeepSeek-v4-pro, GPT-5.5, Opus). Each model ran the same 5 foci: iter1 = RQ1 + RQ7, iter2 = RQ2, iter3 = RQ3 + RQ4, iter4 = RQ5, iter5 = RQ6.
> **Coverage note:** MiniMax iteration-002 (RQ2) produced no findings (preamble only) — MiniMax's RQ2 contribution is therefore absent; RQ2 consensus rests on DeepSeek, GPT-5.5, and Opus. All other model/RQ cells are populated.
> **Citation convention:** cross-model attributions use `[model/iterN]` (e.g. `[opus/i3]`); original first-hand repo/web citations carried by the iterations are preserved as `[SOURCE: …]`.

---

## 1. Executive Summary

**Recommended Lane C design (the consensus, decision-ready):**

- **Five scoring dimensions, unanimous across all 4 models:** **D1 Routing/Activation**, **D2 Unprompted Reference/Asset Discovery**, **D3 Efficiency/Bottlenecks**, **D4 Usefulness (skill-on/skill-off ablation)**, **D5 Structural Connectivity**. D5 is treated as a **hard gate**, not just a weighted score — a dead `RESOURCE_MAP` key or contamination-lint failure caps the verdict regardless of the weighted total `[opus/i1, opus/i4][minimax/i4][gpt55/i4]`.
- **Recommended weights (pending pilot calibration):** D1=25, D2=20, D4=25, D3=15, D5=15 (hard gate). This reconciles the parent-spec baseline (25/25/20/15/15, cited by `[gpt55/i1]`) with the utility-first argument (`[opus/i1]` puts D4 highest at 0.30) and DeepSeek's routing-first (0.30) `[deepseek/i1]`. All four models flag weights as needing empirical tuning on 2–3 pilot skills.
- **D1 splits into two architecturally-distinct sub-scores** (unanimous): **inter-skill** (the `skill-advisor` picks the right skill from all skills) and **intra-skill** (the in-`SKILL.md` smart router loads the right references once selected). Collapsing them destroys the remediation signal `[opus/i3 F1][deepseek/i3 RQ3-B][minimax/i3][gpt55/i3]`.
- **Hint-free dispatch harness = public/private fixture split.** The dispatched prompt contains only a domain-generic task; the expected-resource key (derived from the skill's own `RESOURCE_MAP`) is held out-of-band and read only by the post-run scorer. A **contamination linter** using the routers' own substring logic is a hard pre-dispatch admission gate `[gpt55/i2][deepseek/i2][opus/i2]`.
- **Capture by parsing the tool-call log the runtime already emits** — but canonicalize **every** file-touch verb (Read + `Bash cat`/`rg` + Grep + Glob), not just the `Read` tool, or you under-count loads and falsely score a skill "undiscovered" `[opus/i2 F2]`.
- **The Skill Benchmark Report is a dual artifact** — `report.json` (machine, Lane-B-shaped, CI-diffable) + `report.md` (human, deep-review-shaped, planning-ready), the `.md` rendered from the `.json`. Every finding resolves to a concrete `(file, locus, one-line edit)` and is tagged for direct Lane A or speckit-packet handoff `[opus/i4][gpt55/i4][deepseek/i4][minimax/i4]`.
- **Rename Phase 002 MUST precede Lane C build (Phase 003)** — unanimous. Lane C resolves the skill root dynamically to find `INTENT_SIGNALS`/`RESOURCE_MAP`/`RUNTIME_ASSETS`; building against the old path then renaming breaks every trace-normalization root `[opus/i5][deepseek/i5 F-I5-08][minimax/i5][gpt55/i5]`.

**Headline risks:**

1. **Circularity (RQ4):** trigger-derived fixtures are *mathematically* circular against the substring-matching routers — `X ⊆ X` is a guaranteed false pass. Mitigation requires metamorphic paraphrase + contamination linter + two-author separation, and a published **T1↔T2 (generated↔hand-authored) gap as the circularity meter** `[opus/i3 F6-F8][deepseek/i3][gpt55/i3]`.
2. **Advisor mis-measurement:** the advisor is a **5-lane weighted scorer**, not a keyword matcher; a Lane C check that greps frontmatter substrings ignores 4 of its 5 lanes. Reuse `advisor_recommend`/`advisor_validate` directly `[opus/i3 F2]`.
3. **Repo-specific in-context leak:** the `UserPromptSubmit` advisor/hook brief surfaces the routing answer *into the agent's own context*; if it reaches the dispatched agent, D1/D2/D3 become meaningless. Capture it out-of-band; strip it from the test subject `[opus/i2 F6]`.
4. **Rename dangling references:** advisor has paired TS + Python representations that split-brain if not updated together; negative phrase-penalties go inert and degrade Lane-A/Lane-B disambiguation; generated indexes must rebuild LAST `[minimax/i5][deepseek/i5][gpt55/i5][opus/i5]`.
5. **Harness-broken-vs-skill-weak confound:** a contaminated fixture or broken parser yields a fake score. A top-level `runQuality` block must gate actionability `[opus/i4 F8]`.

---

## 2. Per-RQ Synthesis

### RQ1 — Scoring Dimensions, Weights, Normalization

**Consensus (all 4 models):** Lane C scores *observed runtime utilization*, a behavioral/causal question that none of the three existing surfaces answers — Lane A's 5-dim scores the agent *file* (static), sk-doc scores *doc shape* (DQI, static), and manual-testing playbooks are *human-run deterministic scenarios*, not automated in-the-wild measurement `[opus/i1 F1][minimax/i1][deepseek/i1][gpt55/i1 f-01]`. The five dimensions are unanimous:

| Dim | Measures | Nature |
|---|---|---|
| **D1 Routing/Activation** | Does it fire when it should, stay silent when it shouldn't? (recall, precision, abstention, near-neighbor confusion) | deterministic (advisor scores) + behavioral |
| **D2 Unprompted Discovery** | Right reference opened without being given the path (Hit@k, Recall@k, MRR, cost-weighted precision) | partly deterministic (router replay) + behavioral |
| **D3 Efficiency** | Tool-calls/tokens to reach the needed resource; wasted loads; over-/under-loading | deterministic (counts) |
| **D4 Usefulness** | skill-on vs skill-off outcome delta (ablation); net value = benefit − context cost; harm check | graded (LLM-as-judge) |
| **D5 Structural Connectivity** | Orphan refs, dead router keys, empty intent maps, broken links | static — **hard gate** |

**Weight divergence (the one real disagreement in RQ1):**

| Model | D1 | D2 | D3 | D4 | D5 |
|---|---|---|---|---|---|
| GPT-5.5 (anchors parent-spec R1–R5) `[gpt55/i1 f-02]` | 0.25 | 0.25 | 0.15 | 0.20 | 0.15 |
| DeepSeek `[deepseek/i1]` | 0.30 | 0.20 | 0.15 | 0.25 | 0.10 |
| Opus (utility-first) `[opus/i1 F7]` | 0.25 | 0.20 | 0.15 | **0.30** | 0.10 (gate) |
| MiniMax (iter4, D1 as sub-composite) `[minimax/i4]` | 0.25 | 0.25 | 0.15 | 0.25 | 0.10 |

The cluster is tight: D1≈0.25–0.30, D2≈0.20–0.25, D3=0.15 (unanimous), D4≈0.20–0.30, D5≈0.10–0.15. The split is *why*: GPT-5.5 defers to the parent spec's stated 25/25/20/15/15; Opus argues usefulness must lead because it scores *use*, not shape; DeepSeek leads with routing. **Synthesized recommendation: D1=25, D2=20, D4=25, D3=15, D5=15** — routing and usefulness co-lead, D5 weighted enough to matter but enforced primarily as a gate. **All models flag weights need a 2–3-skill pilot to calibrate** (`[deepseek/i1 OQ]`, `[opus/i4 OQ]`, `[gpt55/i1 OQ]`).

**Normalization (consensus):** score **per-skill fractionally**, NOT cross-skill absolute — skills vary 3→30+ references and 5→20 router keys `[minimax/i1 F11][deepseek/i1 RQ1-B]`. Use baseline→delta (first run sets the skill's own baseline; later runs measure delta) and complexity-relative thresholds (normalize against reference-count × intent-count). Family-relative ranking (compare `deep-*` to `deep-*`) only. No absolute pass/fail until a population baseline of 10+ diverse skills exists `[minimax/i1][deepseek/i1]`.

---

### RQ2 — Hint-Free Dispatch / Capture Harness

*(Consensus rests on DeepSeek, GPT-5.5, Opus; MiniMax iter-002 was empty.)*

**Consensus architecture — public/private fixture split:** Fixtures carry a `public` payload (rendered into the executor prompt: realistic task, target runtime, read/mutation boundary, output contract) and a `private` payload (scorer-only, post-run: `expectedSkill`, `expectedAdvisorLane`, `expectedIntentKeys`, `expectedResources[]`, `expectedAssets[]`, `negativeActivation`, rubric). The dispatcher reads only `public`; the scorer joins both after the process exits `[gpt55/i2 f-01][deepseek/i2 RQ2-B][opus/i2 F4]`. The expected-resource key is derived **mechanically from the skill's own `RESOURCE_MAP[intent]`** and never crosses the dispatch boundary `[deepseek/i2][opus/i2 F4]`.

**Capture mechanism (consensus + one critical refinement):** Parse the tool-call log the runtime already emits — the per-iteration executor `.out` logs the deep-loop runtime already writes mean trace capture is largely a solved sub-problem `[opus/i2 F2][gpt55/i2 f-02][deepseek/i2 RQ2-A]`. DeepSeek enumerates three fidelity tiers: (1) CLI output parse (least invasive, default), (2) tool-proxy wrapper, (3) OpenCode MCP transport intercept (gold standard) `[deepseek/i2]`. **Opus's load-bearing refinement:** the canonicalizer must normalize **every** file-touch verb — `Read`, `Bash(cat …)`, `Bash(rg …)`, `Grep`, `Glob` are all load channels; a parser that counts only `Read` under-counts and falsely scores a skill "undiscovered" `[opus/i2 F2]` [SOURCE: deep-agent-improvement/SKILL.md:4 allowed-tools]. Score against **set membership, not ordered path** — the same task can be solved reading references in any order `[deepseek/i2][opus/i2]`.

**Contamination control (consensus, hard gate):** A pre-dispatch linter rejects any public prompt containing the skill name, any skill-relative path/basename, any `triggers`/`keywords`/`intent_signals` substring, or command names. It uses the **routers' own substring logic**, so "hint-free" is decided by the identical mechanism that would otherwise be gamed `[opus/i2 F5, F7][gpt55/i2 f-04][deepseek/i2 RQ2-C]`. Contamination is a **first-class fixture failure** (fix the fixture, not the skill) `[gpt55/i2]`. Both routers are literal-substring matchers, which makes the keyword leak *mathematically decisive* — a verbatim trigger fires routing "for that reason alone," a guaranteed false pass `[opus/i2 F5]` [SOURCE: deep-agent-improvement/SKILL.md:168-172; system-skill-advisor/SKILL.md:218-222].

**Opus-unique high-value additions (no contradiction from other models, just deeper):**
- **Two capture modes** `[opus/i2 F1]`: Mode A = **router-replay** (run the pure function `route_recursive_agent_resources(task)` over the prompt — deterministic, zero leakage by construction, CI-friendly, the cheap D2 proxy); Mode B = **live dispatch trace** (stochastic, costly, periodic). An **A↔B divergence is itself a finding** (router can reach it, live model doesn't → SKILL.md doesn't signpost the reference inline).
- **Canary/sentinel tokens** in each reference (`<!-- RKEY:a8f3c1 -->`) separate "opened" from "consumed" and survive lossy logs — the BIG-bench canary-GUID technique repurposed `[opus/i2 F3]` (caveat: measure the token's behavioral perturbation first).
- **Strip the advisor/hook brief from the dispatched agent** and capture `advisor_recommend` out-of-band as the D1 signal — the repo-specific leak a generic harness misses `[opus/i2 F6]`.
- **Validity controls** so the harness can detect when *it* is broken: hinted-vs-hint-free calibration arm (scores must rise under injected hints, else trace capture is broken), decoy-skill negative control, k-run repeatability with variance, blind-to-rubric `[opus/i2 F8]`.

GPT-5.5 frames capture in OpenTelemetry terms (span attributes/events, `normalizedResourceId`) and stresses **actual file opens > routing-trace claims because agents hallucinate paths** `[gpt55/i2 f-02, f-06]` [SOURCE: sk-doc/SKILL.md:189]. All three converge that scoring is a **post-run join**: `expectedResources × resource-loads.jsonl × routerTrace.json × outcome verdict` `[gpt55/i2 f-07][deepseek/i2 RQ2-D][opus/i2 F9]`.

---

### RQ3 — Activation Scoring: skill-advisor vs in-SKILL.md router vs both

**Unanimous answer: BOTH, as separate sub-scores.** External (advisor / inter-skill) and internal (smart router / intra-skill) are orthogonal routing layers at different altitudes with different ground truths, failure modes, and remediation owners. A skill can route externally correctly but load wrong references internally, or vice-versa. A single fused number destroys the remediation signal `[opus/i3 F1][deepseek/i3 RQ3-A/B][minimax/i3 F-i3-1/2][gpt55/i3 f-01]`.

| | Inter-skill (advisor) | Intra-skill (smart router) |
|---|---|---|
| **Scope** | global skill set | single skill's references/assets |
| **Decision** | which skill handles this prompt? | which resources load for this intent? |
| **Ground truth** | labeled prompt corpus / `advisor_validate` | the skill's own `RESOURCE_MAP` (no external dataset) |
| **Deterministic?** | No (scorer model) | **Yes** (computable from skill config) |
| **Fix target** | frontmatter triggers/keywords, advisor aliases, graph edges, lane weights | `INTENT_SIGNALS` keywords, `RESOURCE_MAP` entries |

**Sub-score structure — divergence in granularity:**
- **2 sub-scores** (DeepSeek D1a/D1b, MiniMax D1a/D1b, Opus interSkill/intraSkill) → reported as a **2×2 utilization matrix**: *properly utilized* (both pass) / *internal-router regression* (advisor OK, router fails) / *advisor gap* (router OK, advisor fails) / *double fail* `[deepseek/i3 RQ3-C][minimax/i3 F-i3-3]`.
- **3 sub-scores** (GPT-5.5): `advisorActivation` + `skillRouterActivation` + `activationOutcome` (did the agent actually engage the path before acting) `[gpt55/i3 f-01]`.
- **5-stage funnel** (Opus, the most developed — subsumes both): **1 Reachable** (D5 static) → **2 Activated-inter** (advisor top-1, conf ≥0.8, not in ambiguity cluster) → **3 Routed-intra** (router-replay loads gold ref) → **4 Discovered-behavioral** (live model opens it) → **5 Useful-causal** (skill-on beats skill-off). "Properly utilized" = the conjunction; **the first failing stage IS the finding** `[opus/i3 F4]`.

**Opus's decisive RQ3 contributions (first-hand from advisor scorer source, not synthesized):**
- The advisor is a **5-lane weighted scorer**: explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05 — **reuse `advisor_recommend`/`advisor_validate`, do not re-implement keyword matching** `[opus/i3 F2]` [SOURCE: system-skill-advisor/references/scoring/advisor_scorer.md:46-52]. `advisor_validate` already ships corpus top-1 **80.5%** / holdout top-1 **77.5%** — a free calibrated baseline [SOURCE: validation_baselines.md:43-57].
- Two *verifiable* inter-skill failure modes: **derived-dominant confidence cap = 0.72 < the 0.8 invoke bar** (a skill reachable only via derived/generated triggers is structurally un-invokable — fix: add `explicit_author`/`lexical` boost so `directScore > 0.2`); and **ambiguity clusters at the 0.05 margin** (the live `sk-code 0.95/0.16 vs deep-research 0.93/0.16` brief this session is exactly one) `[opus/i3 F3]` [SOURCE: advisor_scorer.md:106,117,127,137].
- **A concrete repo-verified inter-pass/intra-fail bug** proving the two layers must score separately: frontmatter trigger `dynamic profiling` (advisor sees it) vs `INTENT_SIGNALS["INTEGRATION_SCAN"]` keyword `dynamic profile` (in-skill router sees it). `"dynamic profile"` is NOT a substring of `"dynamic profiling"`, so "do dynamic profiling on this agent" passes inter-skill but scores zero intra-skill and fails to load `integration_scanning.md` `[opus/i3 F5]` [SOURCE: deep-agent-improvement/SKILL.md:12 vs :119].

**"Properly utilized" (consensus):** a trace-backed conjunction — the right skill selected AND the right references loaded AND (Opus/GPT-5.5 extend) actually opened/consumed before the decision AND the outcome beats skill-off. Mere `Read(SKILL.md)` or naming the skill is NOT utilization evidence `[gpt55/i3 f-02][opus/i3 F4]` [SOURCE: deep-agent-improvement/SKILL.md:248]. External prior art: MetaTool's split of *tool-usage awareness* vs *tool selection* `[gpt55/i3, opus/i1]` [SOURCE: arxiv.org/abs/2310.03128]; MCP-Bench trajectory-level eval `[gpt55/i3]` [SOURCE: arxiv.org/abs/2508.20453].

---

### RQ4 — Scenario/Fixture Authoring + Anti-Circularity

**The circularity trap (unanimous, and Opus proves it formally):** generating fixture prompts directly from a skill's `trigger_phrases`/`INTENT_SIGNALS` measures keyword-string matching, not real-world discovery. Against literal-substring routers it is `X ⊆ X` — a tautological pass `[opus/i3 F6][deepseek/i3 RQ4-A][gpt55/i3 f-06][minimax/i3 F-i3-7]`. The benchmark's real question is "given a task in domain-generic language, does the AI discover and correctly use this skill?" — not "given the skill's name, does it find it?" `[deepseek/i3]` [SOURCE: 122 spec.md:71].

**Recommended approach — hybrid, tiered, contamination-gated (consensus, with each model contributing a taxonomy):**

- **Opus — 3-tier taxonomy** `[opus/i3 F7]`: **T1** generated-from-self (auto-derived from `WHEN TO USE`/`triggers`/`RESOURCE_MAP`, then **paraphrased + contamination-linted**) → breadth/coverage, circular *unless decontaminated*; **T2** hand-authored holdout (written from the task domain, author blind to `INTENT_SIGNALS`/`RESOURCE_MAP`) → the honesty anchor, non-circular by construction; **T3** adversarial (sibling-skill paraphrases, decoy fixtures whose gold key belongs to another skill, "When NOT to Use" negatives) → stresses precision/abstention. **The T1↔T2 score gap IS the circularity meter** — directly analogous to the advisor team's already-shipped corpus (80.5%) ↔ holdout (77.5%) split; publish it as a first-class output `[opus/i3 F7]` [SOURCE: validation_baselines.md:43-57,98-103].
- **DeepSeek — 3 strategies** `[deepseek/i3 RQ4-B/C]`: golden hand-authored (5–8: 3 positive + 3 negative + 2 near-neighbor) + trigger-paraphrase synthesis (10–20, strict contamination gate, *different model for paraphrase than execution*) + domain-constitution generation (5–10, one degree of separation from triggers, à la Constitutional AI `[SOURCE: arxiv.org/abs/2212.08073]`). Negatives derived from the skill's "When NOT to Use" exclusion classes; total ~20–38 scenarios/skill.
- **GPT-5.5 — 5 fixture origins with a `headlineWeightEligible` flag** `[gpt55/i3 f-04/05/06]`: `gold_hand_authored` (yes), `negative_near_miss` (yes), `trigger_derived_smoke` (capped/diagnostic only), `paraphrase_holdout` (yes), `resource_targeted_probe` (yes if linter passes). Each trigger-derived positive must have a paired near-miss negative AND a paraphrase holdout with trigger words scrubbed — if the original passes but the paraphrase fails, the finding is `trigger_overfit`, not "skill works."
- **MiniMax — source-ranked** `[minimax/i3 F-i3-8/10/11]`: production traffic from skill-graph SQLite (gold standard, zero circularity, requires MCP access) > hand-authored canonical/edge > neighbor-derived > `INTENT_SIGNALS`-derived (high circularity). Seed prompts must describe the **task domain, not the router concept** ("I want to see all surfaces my agent touches" ≠ "run an integration scan").

**Procedural break (Opus, operationalizes the whole RQ):** metamorphic paraphrase (semantics-preserving transformation, then assert routing invariance) + the iter-002 contamination linter + **two-author separation** (gold key derived mechanically from `RESOURCE_MAP` by the scorer side; decontaminated prompt authored from a paraphrased task brief by a different side) — the operational guarantee that "generated from the skill" ≠ "scored against itself" `[opus/i3 F8]`. Plus measure **coverage** (≥1 admitted fixture per `INTENT_SIGNALS` key, per `RESOURCE_MAP` target, per "When NOT to Use" bullet — uncovered keys are themselves dead-key findings) and **dedup** via the skill's own `mutation-coverage.cjs` signature pattern `[opus/i3 F9]`.

---

### RQ5 — Skill Benchmark Report Shape + Remediation Taxonomy

**Dual artifact (unanimous):** machine `report.json` (Lane-B-shaped: `status`, `mode:"skill-benchmark"`, `scoringMethod`, `aggregateScore`, `dimensionScores`, `gates`, `bottlenecks[]`, `scenarioRows[]`, `traceArtifacts`, `variance`, `provenance`) + human `report.md` (deep-review-shaped: executive summary → dimension breakdown → ranked bottlenecks → remediation backlog → methodology/caveats). **The `.md` must be rendered FROM the `.json`** so they cannot drift `[opus/i4 F1][gpt55/i4 f-01][deepseek/i4 RQ5-A/B][minimax/i4 F-i4-3]`. Don't invent a format — *fuse the two report contracts this skill family already ships* (the Lane B benchmark-runner JSON + the 121 deep-review report markdown) `[opus/i4 F1]` [SOURCE: evaluator_contract.md:60-87; 121/.../review-report.md:7-37].

**Scoring rollup (consensus = weighted layer + hard gate):**
- **Weighted layer** (D1–D4, scaled 0–100, mapped to verdict band reusing the existing ≥70 acceptance anchor) `[opus/i4 F2][deepseek/i4 RQ5-C][minimax/i4 F-i4-2]`.
- **Gate layer** — any D5 connectivity failure, contamination-lint failure, or funnel-Stage-1 failure **caps the verdict regardless of the weighted score**. A skill scoring 85 weighted with a dead router key is NOT acceptable, because that dead key frequently *is* the cause of the downstream D2 miss. Copies the existing `applyHardGate()` + immediate-rejection precedent `[opus/i4 F2][gpt55/i4 f-02]` [SOURCE: evaluator_contract.md:114-124].
- MiniMax adds an explicit **3-layer composite** with confidence bands from k-run variance (report `score = X ± Y`; "inconclusive, needs more runs" when variance high) and a `⚠ HARD FINDING` banner for critical D5 `[minimax/i4 F-i4-2]`. GPT-5.5 + Opus + DeepSeek all treat **repeatability as a confidence modifier, not a sixth score** `[gpt55/i4 f-04][opus/i4]`.

**Bottleneck ranking (consensus: by impact/attrition, NOT severity alone):**
- DeepSeek formula: `estimatedImpact = (1 − dimensionScore.normalized) × dimensionWeight × affectedScenarioCount` `[deepseek/i4 RQ5-D]`.
- GPT-5.5 formula: `severityWeight × (1 + prevalenceRatio) × (1 + normalizedScoreImpact) × confidence × remediationReadiness`, with hard gates bypassing weighted sort `[gpt55/i4 f-02]`.
- Opus: ranking reduces to **funnel attrition** — *the stage with the largest single-stage drop-off is the headline bottleneck*; within severity, order by `attrition × fix-locality` (RICE/ICE) `[opus/i4 F3, F5]`.

**Remediation taxonomy (all four supply one; converge on owner-specific finding codes):**
- MiniMax: **16 finding codes** mapped to remediation target + action + `laneAActionable` boolean (e.g. `dead_resource_path`, `orphan_reference`, `overloaded_default`, `advisor_selection_miss`, `ambiguous_neighbor`) `[minimax/i4 F-i4-4]`.
- DeepSeek: **10 categories** (`MISSING_TRIGGER`, `AMBIGUOUS_TRIGGER`, `DEAD_INTENT_KEY`, `ORPHANED_RESOURCE`, `BROKEN_PATH`, `OVER_LOADING`, `UNDER_LOADING`, `CONFUSION_NEAR_NEIGHBOR`, `TOO_BROAD_INTENT`, `MISSING_NEGATIVE_GUIDANCE`) `[deepseek/i4 RQ5-B]`.
- GPT-5.5: **7 owner-grouped families** (Advisor activation / In-skill routing / Resource discoverability / Efficiency / Usefulness / Harness validity / Rename-migration), each finding carrying `ownerSurface`, `evidenceRefs`, `suggestedPatchTarget`, `suggestedChange`, `verificationCommand`, `handoffLane` `[gpt55/i4 f-03]`.
- Opus: **stage-keyed** — the failing funnel stage *selects* the finding class with no human triage; every row resolves to `(file, locus, one-line edit)`, mirroring SARIF's `result→fix→location` `[opus/i4 F4]`.

**Lane A handoff (consensus, the actionability core):** each remediation is structured for direct consumption — `targetFile` (a single bounded `.md`), `action`, `changeDescription`, `verification`. Opus's strongest RQ5 finding: **emit the deep-review Planning-Trigger + Spec/Plan-Seed blocks verbatim** so a downstream `/speckit:plan` or Lane A loop consumes the report with zero translation; tag each workstream `lane-a-candidate` (bounded SKILL.md/frontmatter edits) vs `speckit-packet` (multi-file/structural/retire-merge) `[opus/i4 F6][deepseek/i4 RQ5-D][minimax/i4 F-i4-9]`.

**Opus-unique report-integrity additions:** a top-level **`runQuality` block** (`harnessHealth`: contamination-linter pass, calibration-arm behaved, decoy stayed uncredited; `sampleSufficiency`: k-run variance) that downgrades findings from an unhealthy run to `verify-in-rerun` — designs out "a confident remediation list off a broken benchmark" `[opus/i4 F8]`. A **finding-disposition lifecycle with self-closing re-run** (deterministic D1/D3/D5 auto-verify on re-run — the funnel drop-off that disappears IS the regression test) and a first-class **ACCEPTED-DEFERRAL** disposition for intended design `[opus/i4 F7]`. And **two report artifacts** — per-skill `skill-benchmark-report.{json,md}` + optional cross-skill `routing-matrix-report.json` — because their remediation owners differ (never fix skill A's collision by degrading sibling B) `[opus/i4 F9]`.

**Verdict thresholds** (initial estimates, all flag for calibration): PASS ≥80 & no critical; NEEDS_IMPROVEMENT 50–79 or any HIGH; CRITICAL <50 or any critical `[deepseek/i4 RQ5-E]`. Prior art: Dynabench ("benchmarks must produce actionable insights, not aggregate accuracy") `[deepseek/i4 F-RQ5-G]` [SOURCE: arxiv.org/abs/2104.14337]; Llama 3 eval methodology `[deepseek/i4]`; LangSmith run model + Ragas tool-call F1 `[gpt55/i4 f-05]`.

---

### RQ6 — Rename Impact Map + Safe Ordering (`deep-agent-improvement → deep-improvement`)

**Phase ordering (unanimous):** **Phase 002 rename MUST precede Phase 003 Lane C build.** Lane C resolves the skill root dynamically; building against the old path then renaming breaks every trace-normalization root and files all benchmark traces under a dead skill id. Phase 001 (this research, read-only) may run concurrently with Phase 002 startup `[opus/i5 — but actually deepseek/i5 F-I5-08][minimax/i5 F-I5-08][gpt55/i5 #1][opus/i2 F10]`. Dependency arc: research → rename → Lane C build → final docs/validation.

**Surface census (the models cross-validate magnitude):** Opus: **1063 exact-token occurrences across 200+ files** `[opus/i5 F-1]`; DeepSeek: 44,000+ raw hits but **~12 active-operational files** (overwhelmingly logs/archives/research) `[deepseek/i5 R1]`; MiniMax: 80+ files `[minimax/i5 F-I5-09]`. The reconciliation: the *operational* surface is small (~12–18 files); the bulk is immutable history that must be **excluded**, not renamed.

**Consensus surface buckets (the exhaustive list — see §4 for the full table):** (A) canonical skill package (`git mv` + internal content sweep); (B) commands + 4 YAML assets; (C) 4 runtime agent mirrors + 3 `README.txt` + `.codex/config.toml`; (D) skill-advisor (TS `aliases.ts`/`explicit.ts`/`fusion.ts` + Python `skill_advisor.py` + `skill-graph.json` + regression fixtures + `graph-metadata.json`); (E) cross-skill refs (`deep-loop-runtime`, `cli-opencode` family, `sk-doc/assets/agent_template.md`, `sk-prompt`); (F) root/install docs (`README.md`, `AGENTS.md:349`, `.opencode/skills/README.md`, install guides); (G) generated indexes (`descriptions.json`, per-folder `graph-metadata.json`) — **rebuilt LAST**.

**Highest-risk surface — the advisor (all 4 converge):** it has **paired TS + Python representations** that split-brain if updated separately `[minimax/i5 F-I5-01/10][deepseek/i5 F-I5-02][gpt55/i5 #9][opus/i5 F-4]`. The TS alias group (`aliases.ts:27-32`) holds the canonical key + 4 aliases; `explicit.ts` holds ~10 positive phrase-boosts AND ~7 **negative penalties** targeting the old id for Lane-A-vs-Lane-B disambiguation — these **go inert after rename, degrading disambiguation** (non-breaking but a quality regression) `[minimax/i5 F-I5-02][deepseek/i5 F-I5-02]`. Regenerate, don't blind-edit: run `advisor_rebuild` + `skill_graph_scan` then update regression fixtures (`skill_advisor_regression_cases.jsonl` expects `sk-deep-agent-improvement`) then `advisor_validate` + `skill_graph_validate` + scorer vitest `[opus/i5 F-4][deepseek/i5 F-I5-02]`.

**Decision forks recorded across models (for Phase 002 decision-record):**
1. **Agent identity:** does `@deep-agent-improvement` (the proposal-only Lane A mutator) become `@deep-improvement`, or stay lane-specific? Gates all 4 mirror updates `[gpt55/i5 #5][minimax/i5 F-I5-03][opus/i5]`.
2. **`deep-model-benchmark` alias group:** rename, keep, or deprecate? Naming asymmetry if the skill is `deep-improvement` but a lane stays `deep-model-benchmark` `[minimax/i5 F-I5-05][deepseek/i5 OQ-2]`.
3. **Command verbs:** consensus = **keep stable** (`/deep:start-agent-improvement-loop` still accurately names Lane A; parent spec treats verb rename as a non-goal) `[gpt55/i5 #4][deepseek/i5 OQ-4][minimax/i5][opus/i5]`.
4. **Narrow vs wide scope (Opus's "single biggest scope fork"):** narrow = rename only the skill/agent id; wide = also rename the whole `agent-improvement` token family (command files, `assets/agent-improvement/`, `scripts/agent-improvement/`, **`agent-improvement-state.jsonl`** — which touches resume/continuity readers). Wide should be its own sub-packet `[opus/i5 F-7]`.

**Safe ordering (synthesized from all 4, alias-bridged zero-dangling-window):**
1. *(Bridge, optional)* add `deep-agent-improvement → deep-improvement` to `aliases.ts` if it supports skill-name aliasing; old name keeps resolving `[opus/i5 F-5][gpt55/i5 #2][deepseek/i5 OQ-1]`.
2. Freeze inventory: 4-column table (file | classification active-op/active-doc/generated/historical | action | verification); **denylist** `*/specs/**/iterations/*`, `*/review/**`, `*/research/**`, `*/z_archive/**`, `*.raw.txt` `[minimax/i5 F-I5-09][deepseek/i5 R1][opus/i5 F-1]`.
3. `git mv` skill dir + update `SKILL.md` `name:`/triggers/keywords + content-sweep the moved tree `[deepseek/i5 F-I5-01][opus/i5 F-2]`.
4. Rename all 4 agent mirrors + 3 `README.txt` + `.codex/config.toml` in one changeset `[deepseek/i5 F-I5-03][minimax/i5 F-I5-03][opus/i5 F-3]`.
5. Decide F-7 scope; if wide, rename command/asset-dir/state-file names + update resume/continuity readers.
6. Update advisor TS + Python + graph JSON + fixtures atomically; update/remove negative penalties; update cross-skill refs + root docs.
7. **Regenerate indexes LAST:** `advisor_rebuild` + `skill_graph_scan` (+ `propagate_enhances`), `generate-description.js`, graph-metadata backfill, `code_graph_scan` — regenerating before source re-bakes the old name `[opus/i5 F-6][deepseek/i5 R7]`.
8. Validate gate: `advisor_validate` + `skill_graph_validate` + vitest + a live `skill_advisor.py "[improvement request]"` route-check returning `deep-improvement` + final ACTIVE-path census (expect zero) + `validate.sh --strict`.
9. *(Bridge teardown)* remove the transitional alias once ACTIVE census is clean.

**Hazards (consensus):** `test-fixtures/060-stress-test/.../cp-improve-target.*` are fixture targets, NOT the skill id — sweep references but do NOT rename `cp-improve-target` `[opus/i5 F-9]`; the MCP daemon mass-writes 1400+ `graph-metadata.json` during index regen — scope every commit, never `git add -A` `[opus/i5 F-10]`; `descriptions.json` + archive specs legitimately record old renames — allowlist them so "zero dangling refs" stays achievable `[gpt55/i5 #1][deepseek/i5 R1]`; `generate-context.js` regen of `description.json` is NOT automatic on `git mv` — explicit post-rename step `[minimax/i5 F-I5-06]`.

---

### RQ7 — External Prior Art

Mapped so Lane C reuses proven metrics rather than inventing them. **Coverage caveat for model comparison:** DeepSeek and GPT-5.5 had live web access and actually fetched sources; **Opus's web was permission-gated** so all its citations are flagged `[web-unverified]` (drawn from established knowledge, recommended for later confirmation) `[opus/i1 web-note]`; MiniMax cited a mix.

| Prior art | What transfers to Lane C | Surfaced by |
|---|---|---|
| **BFCL v4** (Berkeley Function Calling) | AST-based correctness; **Irrelevance Detection** = activation precision/abstention; Executor-Relevant = intra-skill routing; latency/cost metrics → D3 | DeepSeek `[deepseek/i1]`, Opus, MiniMax `[SOURCE: gorilla.cs.berkeley.edu/leaderboard.html]` |
| **MetaTool** | tool-usage *awareness* vs tool *selection* split → D1's inter/intra separation; reliability/abstention | GPT-5.5 `[gpt55/i1 f-03]`, Opus `[SOURCE: arxiv.org/abs/2310.03128]` |
| **ToolLLM / ToolBench / ToolEval** | scenario-construction pipeline → fixture gen (RQ4); pass-rate + win-rate → D1 + D4; nDCG retriever eval → D2 | DeepSeek, GPT-5.5, Opus `[SOURCE: arxiv.org/abs/2307.16789]` |
| **MCP-Bench** | fuzzy instructions *without explicit tool names* → hint-free harness; tool-/trajectory-/task-level eval | GPT-5.5 `[gpt55/i1 f-04]` `[SOURCE: arxiv.org/abs/2508.20453]` |
| **Ragas** | context precision/recall, context utilization, tool-call F1, agent goal accuracy → D2/D3 columns | GPT-5.5, Opus `[SOURCE: docs.ragas.io]` |
| **LangSmith** | trajectory eval, run model (inputs/outputs/intermediate steps/feedback), pairwise comparison → D4 ablation, scenarioRows | GPT-5.5 `[gpt55/i1, i4]` |
| **AgentBench / SWE-bench / τ-bench / GAIA / WebArena** | execution-based scoring > final-answer "vibes"; steps/tool-call counts as efficiency metrics → D3 | DeepSeek, GPT-5.5, Opus `[SOURCE: arxiv.org/abs/2308.03688]` |
| **MT-Bench / Chatbot Arena / G-Eval** | LLM-as-judge canon + position/verbosity/self-preference bias mitigations → D4 grader | Opus `[opus/i1 F5]` `[web-unverified]` |
| **Self-RAG** | adaptive-retrieval "was this retrieval necessary?" reflection → D2 "did loading this ref help?" | DeepSeek `[deepseek/i1]` `[SOURCE: arxiv.org/abs/2310.11511]` |
| **Dynabench** | "actionable insights not aggregate accuracy"; human-in-loop loop = run→fix→re-run | DeepSeek `[deepseek/i4 F-RQ5-G]` `[SOURCE: arxiv.org/abs/2104.14337]` |
| **Constitutional AI** | domain-constitution prompt gen (1 degree from triggers) → RQ4 anti-circularity | DeepSeek `[deepseek/i3]` `[SOURCE: arxiv.org/abs/2212.08073]` |
| **APE / Toolformer** | generate instructions from demonstrations not labels; API-call annotation → hint-free fixture gen | DeepSeek `[deepseek/i2]` |
| **BIG-bench canary GUID** | inert marker → "consumed not just opened" + contamination detection | Opus `[opus/i2 F3]` `[web-unverified]` |
| **Metamorphic testing** | semantics-preserving transform + invariance assertion → non-circular T1 fixtures | Opus `[opus/i3 F8]` |
| **Benchmark-leakage research (AAAI)** | public/overfit material inflates capability; private/dynamic test construction | GPT-5.5 `[gpt55/i3]` `[SOURCE: ojs.aaai.org/index.php/AAAI/article/view/41098]` |
| **OpenTelemetry / OpenAI Agents tracing / OpenAI Evals** | span attributes/events for resource-id + scenarioId; schema-backed eval records; deterministic vs model-graded split | GPT-5.5 `[gpt55/i2, i4]` |
| **Large Language Monkeys (Brown et al.)** | coverage scales log-linear with sampling → repeated-sampling stabilizes D4 | MiniMax `[minimax/i1 F6]` `[SOURCE: arxiv.org/abs/2407.21787]` |

---

## 3. Recommended Lane C Design (Concrete, Decision-Ready)

### 3.1 Scoring dimensions + weights

```
Weighted layer (0–100):
  D1 Routing/Activation   25   → interSkill 12 (advisor) + intraSkill 13 (smart router)
  D2 Unprompted Discovery 20   → Hit@k / Recall@k / MRR / cost-weighted precision
  D4 Usefulness (ablation)25   → skill-on − skill-off; net value = benefit − context cost
  D3 Efficiency           15   → calls/tokens to first expected resource; wasted loads
Gate layer (caps verdict regardless of weighted score):
  D5 Structural Connectivity 15 → dead keys, orphan refs, empty intent maps + contamination-lint
Verdict band (calibrate on pilot): PASS ≥80 & no gate hit | CONDITIONAL 50–79 or gate | FAIL <50 or critical gate
Repeatability → confidence modifier (report score ± variance), NOT a 6th score.
```
Weights are the reconciled cluster; **calibrate on a 2–3-skill pilot before trusting absolute thresholds** (unanimous open question). Normalize per-skill (baseline→delta), not cross-skill absolute.

### 3.2 The five-stage funnel (scoring backbone + bottleneck localizer + remediation router, one structure)

`1 Reachable (D5) → 2 Activated-inter (D1 advisor) → 3 Routed-intra (D1 router) → 4 Discovered-behavioral (D2) → 5 Useful-causal (D4)`. Per fixture record `firstFailingStage`; the aggregate funnel's **largest single-stage drop-off is the headline bottleneck** `[opus/i3 F4, opus/i4 F3]`.

### 3.3 Hint-free dispatch/capture harness architecture

```
SCENARIO LOAD  fixture = { public{prompt,runtime,boundary,contract}, private{expectedSkill,
               expectedIntentKeys,expectedResources[],negativeActivation,rubric} }
   │  (private NEVER crosses dispatch boundary; key derived from skill's RESOURCE_MAP)
CONTAMINATION GATE  linter (routers' own substring logic) rejects skill name/path/basename/
   │  trigger/keyword/intent-label/command in public.prompt → FAIL = fixture bug, not skill
DISPATCH  Mode A router-replay (deterministic, default/CI) ‖ Mode B live dispatch (periodic);
   │  reuse dispatch-model.cjs across 5 executors; STRIP advisor/hook brief from subject;
   │  capture advisor_recommend OUT-OF-BAND as D1 inter-skill signal
TRACE PARSE  parse-resource-loads.cjs → {observed_resources[], tool_trace[]}; canonicalize
   │  ALL file-touch verbs (Read + Bash cat/rg + Grep + Glob); set-membership not order
SCORE (post-run join)  expectedResources × resource-loads.jsonl × routerTrace.json × outcome
   │  → D1–D5; advisor 5-lane scorer reused (not re-implemented); k-run variance
VALIDITY CONTROLS  hinted-vs-clean calibration arm | decoy-skill negative control | blind-to-rubric
REPORT  report.json (machine) + report.md (rendered from json) + runQuality block
```

### 3.4 Scorer

- **D1 interSkill** = `advisor_recommend` per fixture + reuse `advisor_validate` corpus/holdout `perSkill[]`; flag derived-dominant 0.72-cap and sub-0.05 ambiguity clusters. **D1 intraSkill** = router-replay loaded-set vs gold `RESOURCE_MAP[intent]` (deterministic, post-hoc from the AI's actual task text).
- **D2** = Hit@k/Recall@k + cost-weighted precision over canonicalized loads; credit only existing inventory paths (reject hallucinated paths).
- **D3** = calls/tokens to first expected resource + wasted-load count + fallback/dead-end counts.
- **D4** = skill-on vs skill-off via Lane B's pluggable `--grader noop|mock|llm`; report quality delta + net value (benefit − context cost) + harm check.
- **D5** = static pre-run: dead `RESOURCE_MAP` keys, orphan refs, empty intent maps, broken intra-skill links — **runs first and gates** the behavioral dimensions.

### 3.5 Report format

Dual artifact (`report.json` Lane-B-shaped + `report.md` deep-review-shaped, md from json). Sections: run header (with resolved skill root + metadata hash for rename invalidation) → corpus integrity → executive scorecard (composite ± confidence, D1–D5, hard-finding banner, 2×2 utilization matrix) → per-dimension drill-down → funnel rollup → **ranked bottlenecks** (each: id, severity P0/P1/P2, stage, finding-class, `file:locus`, evidence trace, likely cause, one-line remediation, `handoffLane`) → `runQuality` block → finding-disposition lifecycle → Planning-Trigger + Spec/Plan seeds (verbatim from deep-review) → artifacts manifest. Optional sidecar `routing-matrix-report.json` (cross-skill).

### 3.6 Mapping to the three pluggable seams + loop-host mode

| Seam | Lane A | Lane B | **Lane C (`--mode=skill-benchmark`)** |
|---|---|---|---|
| **candidate-source** | agent `.md` candidate | model variant | **the skill-under-test** (SKILL.md + references + RESOURCE_MAP) + the fixture corpus (public/private) |
| **dispatcher** | — | `dispatch-model.cjs` (5 executors) | **same dispatcher** + decontamination pre-pass + "must emit tool log" + advisor-brief strip + Mode A/B |
| **scorer** | 5-dim agent rubric | model grader | **new `skill-benchmark` scorer** computing D1–D5; calls `advisor_recommend`/`advisor_validate` out-of-band for D1 |

Net-new surface is small and named: a **parser** (`parse-resource-loads.cjs`), a **scorer** (`skill-benchmark`), the **fixture split** (`fixtures/<id>.prompt.txt` + `fixtures/<id>.expected.json`), and a **report contract** under `assets/skill-benchmark/` (`report_schema.json`, `report_template.md`, `remediation_taxonomy.json`). Keep the default agent-improvement path byte-identical (Lane B's identity-gate precedent) `[opus/i2 F9][gpt55/i4 #1][minimax/i4]`. **Advisory/non-mutating by default** — emit report + handoff JSON; Lane A receives findings as candidate evidence, does not auto-apply `[minimax/i4 #4][opus/i4 F6]`.

---

## 4. Rename Impact Map — Exhaustive Surfaces + Safe Ordering

**Phase gate:** Phase 002 (rename) before Phase 003 (Lane C build) — unanimous. Operational surface ≈ 12–18 files; bulk of the 1063 raw occurrences is immutable history to **exclude**.

| # | Bucket | Concrete surfaces | Treatment | Dangling-ref risk |
|---|---|---|---|---|
| A | **Canonical skill package** | `.opencode/skills/deep-agent-improvement/` (65+ files); `SKILL.md` `name:`/triggers/keywords; README, feature_catalog (~15 pages), manual_testing_playbook (~35 files), references/shared/*, scripts/** READMEs + `.cjs`/`.vitest.ts`, assets/**, changelog, own `graph-metadata.json` | `git mv` then content-sweep moved tree | path refs self-heal via `git mv`; **internal content + `name:` frontmatter survive** and must be swept |
| B | **Commands + YAML** | `commands/deep/start-agent-improvement-loop.md`, `start-model-benchmark-loop.md`; 4 YAML assets (`*_auto.yaml`, `*_confirm.yaml`) — `skill:` field + ~18 script-path refs each | bulk find/replace (~90 edits); **keep command verbs** | YAML `skill:` stale → command fails to resolve skill at runtime |
| C | **4 runtime mirrors** | `.opencode/agents/deep-agent-improvement.md`, `.claude/…md`, `.gemini/…md`, `.codex/…toml` (verify TOML `name` key); 3× `README.txt`; `.codex/config.toml` | rename files + content in **one changeset** | rename dir but not mirrors → `skill deep-agent-improvement not found` on every `/deep:start-…` |
| D | **Skill-advisor (highest risk)** | TS `aliases.ts:27-32` (key + 4 aliases), `explicit.ts:116-138` (~10 boosts + ~7 negative penalties), `fusion.ts`; Python `skill_advisor.py:250` + `:1577-1790` (35+ phrase entries); `skill-graph.json`; `regression_cases.jsonl:42-45`; `native-scorer.vitest.ts`; `system-skill-advisor/graph-metadata.json:70-73` (enhances edge) | update TS+Python **atomically**; regenerate graph; update fixtures; `advisor_rebuild`+`advisor_validate` | split-brain (TS≠Python); negative penalties go **inert** → degraded Lane-A/B disambiguation |
| E | **Cross-skill refs** | `deep-loop-runtime/references/integration_points.md`; `cli-opencode` family (SKILL.md, README, agent_delegation.md, cli_reference.md, prompt_templates.md, playbook); `sk-doc/assets/agent_template.md`; `sk-prompt/graph-metadata.json`; `.opencode/skills/README.md` | sweep active refs; allow historical changelogs | stale cross-skill graph edges |
| F | **Root/install docs** | `README.md`, `AGENTS.md:349`, `.opencode/install_guides/README.md`, `SET-UP - AGENTS.md` | update active routing entries | visible stale agent name every session |
| G | **Generated indexes** | `.opencode/specs/descriptions.json`, per-folder `graph-metadata.json` | **rebuild LAST** (`generate-description.js`, backfill, `code_graph_scan`) | regen-before-source re-bakes old name; memory/graph resolve dead skill |

**Immutable-history denylist (exclude from rename):** `*/specs/**/iterations/*`, `*/review/**`, `*/research/**`, `*/z_archive/**`, `*.raw.txt`, completed packets (119, 117, 116, 106, 108, 102, 121 changelog). `descriptions.json` + archive specs legitimately record prior renames — allowlist `[deepseek/i5 R1][opus/i5 F-1][gpt55/i5 #1]`.

**Special hazards:** (1) `test-fixtures/060-stress-test/.../cp-improve-target.*` — sweep references but DON'T rename the fixture target `[opus/i5 F-9]`. (2) Daemon mass-writes 1400+ metadata files on index regen — scope commits, never `git add -A` `[opus/i5 F-10]`. (3) `description.json` regen is NOT automatic on `git mv` — explicit `generate-context.js` step `[minimax/i5 F-I5-06]`.

**Decision-record items for Phase 002:** agent identity (`@deep-agent-improvement` → `@deep-improvement`?); `deep-model-benchmark` alias fate; command verbs (keep — consensus); narrow vs wide `agent-improvement`-token-family scope (wide touches `agent-improvement-state.jsonl` + continuity readers → own sub-packet); backward-compat alias window vs hard cutover.

**Safe ordering:** see §2/RQ6 (alias-bridge, freeze inventory, git mv + sweep, mirrors lockstep, scope decision, advisor atomic + cross-skill, **regenerate indexes LAST**, validate gate, bridge teardown).

---

## 5. Cross-Model Observations (this sweep doubles as a model comparison)

**Who surfaced what (distinctive contributions):**

- **Opus — deepest first-hand repo grounding; the synthesizer's source of record.** Only model to read the advisor scorer internals (`advisor_scorer.md`: the 5-lane weights, 0.72 derived-cap, 0.05 ambiguity margin), `validation_baselines.md` (80.5%/77.5% corpus/holdout), `evaluator_contract.md`, and the *shipped* 121 deep-review report. Produced the highest-leverage unique findings: the **5-stage funnel**, the **concrete `dynamic profiling`≠`dynamic profile` substring bug**, the **two-capture-mode** design, **canary tokens**, the **advisor-brief in-context leak**, the **T1↔T2 circularity meter**, the **runQuality block**, and **stamp-root-and-auto-invalidate** for rename. Weakness: **web was permission-gated**, so all RQ7 prior art is `[web-unverified]` (needs later confirmation); highest raw census (1063) without the active/immutable split DeepSeek made cleaner.
- **DeepSeek — best external prior-art coverage + most disciplined rename inventory.** Actually web-fetched BFCL v4, ToolLLM/ToolBench, Self-RAG, Constitutional AI, Dynabench, Llama 3. Cleanest active-vs-immutable reconciliation (44k raw → ~12 operational). Strong D1a/D1b post-hoc determinism insight (compute expected resources from the AI's *actual* task text). 10-category remediation taxonomy. Solid but occasionally leans on synthesized weights without the first-hand scorer grounding Opus had.
- **GPT-5.5 — best spec-anchoring + harness engineering discipline.** Uniquely tied weights to the parent spec's own R1–R5 (25/25/20/15/15) rather than inventing them. Strongest on harness *engineering* (public/private split, OpenTelemetry span model, `normalizedResourceId`, hallucinated-path defense). Three-sub-score activation (added `activationOutcome`). Owner-grouped 7-family taxonomy with the richest per-finding field set (`ownerSurface`/`suggestedPatchTarget`/`verificationCommand`/`handoffLane`). The hard-gate-above-weighted-list ranking formula.
- **MiniMax — strongest report taxonomy + surface-class breadth; weakest coverage.** The 16-finding-code remediation taxonomy and the explicit 3-layer composite with confidence bands + hard-finding banner are the most detailed report mechanics. The 11-surface-class rename table is broad. **But iteration-002 (RQ2) produced zero findings (preamble only)** — a real coverage gap — and several MiniMax findings cite `research/research.md` rather than first-hand files, i.e. more synthesis-of-synthesis than independent grounding.

**Convergence quality:** RQ3 (both sub-scores), RQ2 (public/private split + contamination gate + log-parse capture), RQ5 (dual artifact + hard gate + owner-specific taxonomy + Lane A handoff), and RQ6 (rename-before-build + advisor paired-representation risk + regenerate-indexes-last) are **strong 4-model (or 3-model for RQ2) consensus** — high confidence. The one genuine divergence is **D1–D5 weights**, and even there the cluster is tight (D3=0.15 unanimous; disagreement only on the routing-vs-usefulness lead).

**Where a single model is load-bearing (verify before building):** the advisor 5-lane reuse, the 0.72 derived-cap, and the `dynamic profiling` bug are **Opus-only** first-hand claims — high-value but should be re-confirmed against `advisor_scorer.md` + `deep-agent-improvement/SKILL.md:12,119` during Phase 003 (Opus itself flagged the `triggers:` vs `trigger_phrases:` frontmatter-key projection as unverified). The "production traffic from skill-graph SQLite as gold fixtures" path is **MiniMax-only** and depends on MCP query access that may be a Phase-003 infra prerequisite.

---

## 6. Actionable Next Steps

### Phase 002 — Rename (`deep-agent-improvement → deep-improvement`)

- [ ] Write `decision-record.md` resolving the four forks: agent identity (`@deep-improvement`?), `deep-model-benchmark` alias fate, command-verb stability (recommend keep), narrow-vs-wide token-family scope (recommend narrow now; wide as separate sub-packet because it touches `agent-improvement-state.jsonl` + continuity readers).
- [ ] Produce the **4-column freeze inventory** (file | classification | action | verification) from `rg 'deep-agent-improvement'`; apply the immutable-history denylist (`*/iterations/*`, `*/review/**`, `*/research/**`, `*/z_archive/**`, `*.raw.txt`, completed packets) and allowlist `descriptions.json`/archive specs.
- [ ] *(Optional bridge)* add `deep-agent-improvement → deep-improvement` to `aliases.ts` (verify it supports skill-name aliasing) so the old name resolves during transition.
- [ ] `git mv` skill dir; update `SKILL.md` `name:`/triggers/keywords; content-sweep the moved tree (README, feature_catalog, manual_testing_playbook, references, scripts, assets, changelog).
- [ ] Rename all 4 agent mirrors + 3 `README.txt` + `.codex/config.toml` in **one changeset** (verify Codex TOML `name` key, not just prose).
- [ ] Update commands + 4 YAML assets (`skill:` field + script paths, ~90 edits); keep command verbs.
- [ ] Update advisor **atomically**: `aliases.ts` + `explicit.ts` (incl. the ~7 negative penalties — remap or remove) + `fusion.ts` + `skill_advisor.py` (both alias block + phrase matrix) + `skill-graph.json` + `regression_cases.jsonl` + `native-scorer.vitest.ts` + `graph-metadata.json` enhances edge.
- [ ] Update cross-skill refs (`deep-loop-runtime`, `cli-opencode` family, `sk-doc/agent_template.md`, `sk-prompt`) + root docs (`README.md`, `AGENTS.md:349`, install guides).
- [ ] **Regenerate indexes LAST:** `advisor_rebuild` + `skill_graph_scan` (+ `propagate_enhances`), `generate-description.js`, graph-metadata backfill, `code_graph_scan` — scope commits (daemon mass-write hazard), never `git add -A`.
- [ ] Do NOT rename `cp-improve-target` in `test-fixtures/060-stress-test`; sweep references only, re-run stress suite.
- [ ] **Validate gate:** `advisor_validate` + `skill_graph_validate` + scorer/skill vitest + live `skill_advisor.py "[improvement request]"` returns `deep-improvement` + final ACTIVE-path census = zero + `validate.sh --strict`; *(bridge teardown)* remove transitional alias.

### Phase 003 — Lane C Design + Build (`--mode=skill-benchmark`)

- [ ] Confirm the Opus-only load-bearing claims against source before building: advisor 5-lane reuse, the 0.72 derived-dominant cap, the `dynamic profiling`≠`dynamic profile` bug, and the `triggers:`-vs-`trigger_phrases:` frontmatter projection (`advisor_scorer.md` + `deep-agent-improvement/SKILL.md:12,119`).
- [ ] Scaffold the **fixture split** schema: `fixtures/<id>.prompt.txt` (public, dispatched) + `fixtures/<id>.expected.json` (private, scorer-only) with `public{}`/`private{}` objects + `origin`/`seedSource`/`headlineWeightEligible`/`leakagePolicy` metadata.
- [ ] Build the **contamination linter** as a hard pre-dispatch admission gate, using the routers' own substring logic, with denylist + parser roots **derived from live skill metadata at run time** (never hard-coded — survives the rename).
- [ ] Build the **parser** `parse-resource-loads.cjs` canonicalizing ALL file-touch verbs (Read + Bash cat/rg + Grep + Glob) → `{observed_resources[], tool_trace[]}`; set-membership scoring.
- [ ] Build the **dispatcher** extension on `dispatch-model.cjs`: Mode A router-replay (default/CI) + Mode B live dispatch (periodic); **strip the advisor/hook brief** from the subject and capture `advisor_recommend` out-of-band; require tool-log emission.
- [ ] Build the **`skill-benchmark` scorer**: D1 (interSkill via `advisor_recommend`/`advisor_validate` + intraSkill via router-replay) / D2 (Hit@k + cost-weighted precision) / D3 (calls-to-first-resource) / D4 (skill-on/off via Lane B `--grader`) / D5 (static connectivity, runs first, gates); per-fixture `firstFailingStage` + funnel rollup.
- [ ] Implement the **3-tier fixture corpus** (T1 generated-decontaminated / T2 hand-authored holdout / T3 adversarial) with metamorphic paraphrase + two-author separation; publish the **T1↔T2 circularity gap**; assert per-intent/per-resource/per-negative coverage; dedup via mutation-coverage signature.
- [ ] Implement the **validity controls** (hinted-vs-clean calibration arm, decoy-skill negative control, k-run repeatability, blind-to-rubric) and the top-level **`runQuality` block** that downgrades unhealthy-run findings to `verify-in-rerun`.
- [ ] Implement the **dual report**: `report.json` (Lane-B-shaped) + `report.md` rendered from it (deep-review-shaped) under `assets/skill-benchmark/` (`report_schema.json`, `report_template.md`, `remediation_taxonomy.json`); ranked bottlenecks (P0/P1/P2 × attrition × fix-locality); **emit the deep-review Planning-Trigger + Spec/Plan seeds verbatim**; tag workstreams `lane-a-candidate` vs `speckit-packet`; stamp resolved skill root + metadata hash (auto-invalidate stale-root reports).
- [ ] Wire `loop-host.cjs --mode=skill-benchmark` as the third mode (keep default agent-improvement path byte-identical); advisory/non-mutating by default (emit handoff JSON, don't auto-apply).
- [ ] **Calibrate** D1–D5 weights + verdict-band + `runQuality` thresholds on a 2–3-skill pilot before treating scores as absolute; **dogfood Lane C across the Phase 002 rename itself** (identical funnel before/after proves a clean rename; any new D5 dead-key pinpoints a missed reference).

---

*End of consolidated report. Source: 20 iterations × 4 models (MiniMax-2.7, DeepSeek-v4-pro, GPT-5.5, Opus); MiniMax iter-002 empty. All cross-model attributions and carried `[SOURCE: …]` citations preserved inline.*
