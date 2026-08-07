# Iteration 5: Ranked Upgrade Levers and Phased Delivery

## Focus

Answer Q5 with a decision-grade ranking of the complete upgrade portfolio, explicit dependency order, incremental build costs, file/symbol attachment points, phased totals, smart integrations beyond retrieval, and a legal-convergence check. “All upgrade levers” is interpreted as the lever families established by Q1-Q4 plus evidence-compatible control ideas, not a reopening of the predecessor retrieval-substrate decision. Route proof: `mode=research; target_agent=@deep-research; execution=single_iteration`; no sub-agent or CLI executor was used.

## Actions Taken

1. Read the config, append-only state, reducer-owned strategy, registry, and all four prior iteration narratives before selecting Q5; confirmed four prior iteration records, no exhausted approaches, and `progressiveSynthesis: false`.
2. Verified the packet boundary and confirmed `iterations/iteration-005.md` and `deltas/iter-005.jsonl` did not exist.
3. Rechecked the live orchestration seam at `buildPlan`/`runGuided`, the `buildWritePrompt` locked-fact boundary, the deterministic formatter symbols, validator ordering/scoring, and available package scripts. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:151-229] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-154] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:117-238] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:248-496] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:13-20]
4. Consolidated prior schema, calibration, STUDY, leakage, fixture, and CI findings into one non-overlapping dependency/cost model rather than rescanning the corpus. [SOURCE: iterations/iteration-001.md:16-24] [SOURCE: iterations/iteration-002.md:17-25] [SOURCE: iterations/iteration-003.md:17-25] [SOURCE: iterations/iteration-004.md:17-25]

## Findings

1. **The best quality-lift-per-cost sequence begins with one product contract, not retrieval or prose intelligence.** The ranking below treats each cost as a standalone incremental estimate assuming one engineer familiar with TypeScript/Vitest and an already available predecessor retrieval substrate; phase totals below remove overlap in shared types, fixtures, and tests. [INFERENCE: ranking combines the live attachment seams with Q1-Q4's measured quality and dependency evidence]

   | Rank | Upgrade lever | Quality lift | Prerequisite / dependency order | Implementation risk | Rough standalone incremental cost | Named attachment points |
   |---:|---|---|---|---|---:|---|
   | 1 | Versioned v3 manifest + capability-driven Quick Start + schema-drift sentinel | Very high | None; foundation for every later lever | Medium: migration can expose current emitter/reference drift | 4-7 engineer-days | New packet-local backend module such as `scripts/schema-v3.ts`; `formatters-v3.ts::emitQuickStart`; `build-write-prompt.ts::buildWritePrompt`; `validate.ts::checkSectionCompleteness` [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:187-238] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:248-310] |
   | 2 | Compact corpus baseline + de-literalized fixture generator with update/check modes | High | Manifest version and capability vocabulary | Low-medium: deterministic generation and stable IDs are straightforward, but stale hashes must fail closed | 2-3 engineer-days | New `scripts/generate-corpus-fixtures.ts`; new `tests/corpus-fixtures.test.ts`; `package.json::scripts` [SOURCE: iterations/iteration-004.md:21-21] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:13-20] |
   | 3 | Existing-validator integration: hard target/schema/provenance failures separated from stratified corpus warnings | High | Ranks 1-2 | Medium: severity mistakes can reject legitimate minority styles | 2-4 engineer-days incremental | `validate.ts::validateDesignMd`, `CRITICAL_FAILURE_TYPES`, `ValidationResult`; existing report consumer [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:414-496] [SOURCE: iterations/iteration-004.md:19-19] |
   | 4 | Semantic typography-role normalizer with preserved source labels and namespaced extensions | Medium-high | Manifest role vocabulary; fixture strata | Medium: rank collisions and long-tail labels need explicit fallbacks | 2-3 engineer-days | `formatters-v3.ts::emitQuickStart` role derivation plus new normalizer consumed by formatter/manifest [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:193-199] [SOURCE: iterations/iteration-002.md:23-23] |
   | 5 | Bounded STUDY selector/transformer/provenance envelope and optional prompt block | High for prose organization; zero intended effect on measured values | Predecessor card/hydration substrate, ranks 1-2, target-facts digest | Medium-high: rights, injection, and stale-context failure modes | 4-6 engineer-days as one integrated slice | New `scripts/study-context.ts`; `build-write-prompt.ts::buildWritePrompt` after FACTS and before prose task; `guided-run.ts::buildPlan` before WRITE [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-154] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:151-170] [SOURCE: iterations/iteration-003.md:17-23] |
   | 6 | Two-signal source-leak gate with discard-and-retry-without-STUDY | High safety lift, but only after STUDY exists | Rank 5 plus labeled positive/negative fixtures | Medium-high: false positives until calibrated | 3-5 engineer-days | New `scripts/study-leak-check.ts`; `guided-run.ts::runGuided` between authored draft and `validate.ts`; new `tests/study-leak-check.test.ts` [SOURCE: iterations/iteration-004.md:23-25] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:219-229] |
   | 7 | Counterfactual capability probes implemented as target-fact mutation tests | Medium-high verification lift | Ranks 1-3; rank 5 for STUDY mutations | Low-medium: test-only mutations must never become production synthesis | 2-3 engineer-days | New mutation cases in formatter/prompt/validator/corpus-fixture suites; mutate shadow/surface/radius/theme facts and assert only permitted output changes [SOURCE: iterations/iteration-004.md:25-25] [INFERENCE: paired fact mutations test causal attachment more strongly than static snapshots] |
   | 8 | Diversity-preserving calibration watchdog | Medium | Rank 2 baseline strata and rank 3 warnings | Medium: small strata can create noisy rates | 1-2 engineer-days | Extend `corpus-baselines.v1.json` and `tests/corpus-fixtures.test.ts` with per-theme/capability warning-rate budgets, never a global quality score [SOURCE: iterations/iteration-002.md:25-25] [SOURCE: iterations/iteration-004.md:19-21] |
   | 9 | Fuzzy similarity, learned ranking, or prose-quality judge | Low/unproven incremental lift | Labeled leak/quality outcomes from ranks 5-8 | High: opaque thresholds, maintenance, and false confidence | 3-5+ engineer-days | Advisory-only experiment outside pass/fail until precision is measured [SOURCE: iterations/iteration-004.md:35-39] [INFERENCE: current evidence supports exact provenance/value/span controls, not learned enforcement] |

2. **Deliver an MVP before enabling corpus-conditioned prose, then add STUDY as a separately reversible hardening layer.** Phase A **MVP (10-15 engineer-days)** is ranks 1-4 plus the rank-2 check command and the schema-drift portion of rank 7: establish the manifest, complete capability-driven Quick Start, normalize semantic roles, generate compact fixtures/baselines, split hard failures from advisory strata, and wire deterministic freshness checks into existing Vitest/package scripts. Phase B **STUDY hardening (8-12 additional engineer-days)** is ranks 5-7: transform one hydrated bundle, bind it to target facts, add provenance/injection controls, run the leak gate, and execute counterfactual/mutation fixtures. The combined implementation is therefore **18-27 engineer-days**, not the sum of every table range, because the prompt schema, digests, generated fixtures, and integration tests are shared. If the predecessor's checked-manifest/card/hydration substrate is not implemented, add its separately estimated **5-8 engineer-days**, producing **23-35 engineer-days** through hardening. Phase C optional calibration adds **1-2 days** for rank 8; rank 9 remains deferred and is excluded. [SOURCE: iterations/iteration-001.md:18-24] [SOURCE: iterations/iteration-003.md:17-25] [SOURCE: iterations/iteration-003.md:44-44] [SOURCE: iterations/iteration-004.md:17-25] [INFERENCE: phased totals remove duplicated schema, fixture, digest, and test work across standalone estimates]

3. **Three beyond-retrieval ideas are worth preserving, but only two belong in the first delivery.** (1) The **schema-drift sentinel** is first: hash the manifest and assert that formatter emission, prompt instructions, validator-required headings, generated fixtures, and check-mode artifacts all agree; it has high value and fits ranks 1-2 at roughly 1-2 days already included in the MVP. (2) **Counterfactual capability probes** are second: pair each fixture with mutations such as shadow present→absent, surface absent→present, or target digest changed after STUDY, then assert deterministic sections, prose permissions, warnings, and invalidation change causally; this has medium-high value at 2-3 days and belongs at the MVP/hardening boundary. (3) The **diversity-preserving calibration watchdog** is third: track warning rates separately for light/dark/mixed and shadow/surface/radius strata, and block threshold promotion when a minority stratum regresses even if the global rate improves; this has medium value and should remain optional until enough generated outputs exist. None retrieves more examples; each tests contract coherence, causality, or calibration fairness. [SOURCE: iterations/iteration-002.md:17-25] [SOURCE: iterations/iteration-004.md:17-25] [INFERENCE: these controls convert corpus evidence into product invariants without increasing writer context or copy surface]

4. **Explicitly reject high-cost or low-evidence directions.** Do not ship raw or multi-style few-shot prompts, corpus averaging, exact majority schemas, global scalar corpus-quality scores, automatic fixture regeneration in CI, or fuzzy similarity as enforcement; prior evidence already shows coherence, diversity, authority, and false-positive failures. Also reject a vector-database replatform, model fine-tuning, or an LLM-as-judge gate for this upgrade: the mode currently has a small TypeScript/Vitest pipeline with deterministic extension seams, and no measured failure requires those larger systems. Reconsider learned scoring only after labeled output/leak fixtures demonstrate a gap that exact controls cannot close. [SOURCE: iterations/iteration-002.md:27-38] [SOURCE: iterations/iteration-003.md:27-38] [SOURCE: iterations/iteration-004.md:27-39] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:13-33] [INFERENCE: replatforming without an observed residual failure has lower evidence-per-cost than the ranked deterministic controls]

5. **Q1-Q5 now have decision-grade answers, but this iteration cannot itself satisfy the numeric convergence trigger.** The minimum floor is passed and Q5 can be marked answered alongside Q1-Q4; source diversity and file-level attachment evidence are present. However, this iteration's `newInfoRatio` is **0.80**, above the configured **0.05** convergence threshold, so topical coverage is complete while automatic loop convergence still requires the reducer/orchestrator's next convergence decision or a later genuinely low-novelty verification pass. Remaining calibration unknowns are non-blocking for the architecture: exact warning weights/ranges, measured leak-check precision, retrieval-executable packaging, and actual implementation duration. They should be resolved with labeled fixtures and implementation measurements, not more broad corpus research. [SOURCE: deep-research-config.json:3-18] [SOURCE: deep-research-strategy.md:29-45] [SOURCE: deep-research-strategy.md:94-104] [INFERENCE: answered-question completeness and numeric convergence are separate gates under the configured stop policy]

## Ruled Out

- Reopening the predecessor retrieval-substrate comparison: Q5 assumes its checked manifest, deterministic cards, and bounded hydration; absence at implementation time is represented as a separate 5-8 day dependency rather than hidden inside md-generator estimates. [SOURCE: iterations/iteration-003.md:44-44]
- Summing every standalone lever range: shared manifest types, digests, fixtures, and Vitest integration would be double-counted; the phase totals are the decision numbers.
- Putting STUDY in the MVP critical path: schema/emitter/validator coherence and fixtures produce value without adding corpus-conditioned prose risk.
- Treating all-question coverage as proof that the 0.05 convergence threshold fired: the two conditions are reported separately.

## Dead Ends

- Raw/multi-style prompting, exact majority schemas, one global corpus-quality score, automatic CI fixture updates, and uncalibrated fuzzy enforcement remain definitively eliminated and should be reducer-promoted as exhausted directions if they recur. [SOURCE: deep-research-strategy.md:84-91]
- Vector replatforming, fine-tuning, and LLM-judge enforcement have no measured residual problem in this scope; they are high-cost/low-evidence, not deferred implementation tasks. [INFERENCE: the ranked deterministic seams cover every evidenced Q1-Q5 failure class]

## Edge Cases

- Ambiguous input: “all upgrade levers” was narrowed to Q1-Q4 lever families plus directly compatible smart controls; predecessor substrate redesign and implementation were deferred.
- Contradictory evidence: none unresolved. Complete Q1-Q5 coverage does not contradict the unmet numeric convergence threshold; they are distinct gates.
- Missing dependencies: Spec Kit Memory remained unavailable. Costs assume the predecessor retrieval substrate; if absent, add 5-8 engineer-days. Exact executable packaging remains a non-blocking implementation choice.
- Partial success: none for Q5; the ranking, costs, phases, integration points, reject list, smart ideas, and convergence distinction are all supplied. Full loop convergence is intentionally not claimed.

## Sources Consulted

- `deep-research-config.json:3-18`
- `deep-research-strategy.md:26-115`
- `findings-registry.json:5-225`
- `iterations/iteration-001.md:14-24`
- `iterations/iteration-002.md:15-25`
- `iterations/iteration-003.md:15-25`
- `iterations/iteration-004.md:15-25`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:151-229`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:102-154`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:117-238`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:248-496`
- `.opencode/skills/sk-design/design-md-generator/backend/package.json:13-33`

## Assessment

- New information ratio: **0.80**. Two of five findings are fully new decision structures and three partially synthesize prior evidence: `(2 + 0.5 × 3) / 5 = 0.70`, plus the `+0.10` simplicity bonus for resolving Q5 and reducing the open-question set to zero.
- Questions addressed: Q5.
- Questions answered: Q5.
- Key questions remaining: none.
- Non-blocking calibration unknowns: exact warning weights/ranges, labeled leak precision, retrieval executable packaging, and measured implementation duration.
- Confidence: High for dependency order and live attachment points; medium for build-cost ranges and enforcement thresholds until implementation measurements exist.

## Reflection

- What worked and why: Reusing exact Q1-Q4 anchors and narrowly rechecking live symbols produced a file-level plan without broad corpus rereads or duplicated estimates.
- What did not work and why: Existing standalone estimates overlap heavily; treating them as additive would inflate the portfolio, so shared schema/fixture/test work had to be modeled explicitly at phase level.
- What I would do differently: During implementation planning, estimate against one concrete file-change list and labeled fixture count, then replace these research ranges with measured task estimates.

## Recommended Next Focus

Do not reopen broad research. Run one narrow convergence/calibration verification pass against the ranked dependency graph: confirm whether exact warning weights, leak precision, or retrieval packaging changes any phase boundary. If no decision changes, record the resulting low novelty and allow the configured convergence policy to close; otherwise isolate only the changed lever.
