# Iteration 2: Residual Holdout-Overlap Risk Across Every Tuning Surface (follow-up to Q1 Finding 6)

## Focus

Follow-up to iteration 1's Finding 6: scope the residual holdout-overlap risk against every tuning surface. Three parts: (a) enumerate every consumer of the three fixtures that feed holdout-prompts.jsonl, (b) establish how wide the holdout-independence check actually is, and (c) inventory the surfaces where the same prompts are scored to choose or drift-check scoring behavior. The strategy next-focus text was truncated at HARDER_INTENT_PRO...; the referenced fixture (harder-intent-prompt-corpus.ts) was opened, so the truncation did not change the selected focus. Non-goal respected: no fix is proposed for probe P4, probe P7, or admission scenario DOC-331.

## Actions Taken

1. Re-read the research state (config, state log, strategy, findings registry, iteration 1 narrative) and verified the packet-local write boundary before any research action.
2. Mapped consumers of HARDER_INTENT_PROMPT_CORPUS, of the holdout path, and of the sweep entry point across the runtime tree with ripgrep; listed the scorer test and bench surface.
3. Read tests/parity/holdout-independent.vitest.ts in full to establish what disjoint is actually asserted against.
4. Read capture-local-native-divergence-ledger.mjs and the header of local-native-divergence-ratchet.vitest.ts; read the collision logic in build-holdout.mjs.
5. Read lane-weight-sweep.vitest.ts (weight vectors and harder-corpus sweep), the score-outcome-rerank.mjs header, the feedback-calibration proposal path (weights-config.ts, feedback-calibration.ts, its test), and the scorer-calibration bench header.
6. Read the iteration verifier and the findings parser to confirm the output contract shape before writing artifacts.

## Findings

1. **The harder-intent corpus has three scoring-path consumers; only one is evaluation.** build-holdout.mjs draws its holdout-harder rows from HARDER_INTENT_PROMPT_CORPUS, but the same fixture is also the sweep corpus of lane-weight-sweep.vitest.ts and one half of the union corpus that capture-local-native-divergence-ledger.mjs recomputes for the Python/native divergence ratchet. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:56] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:26] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:32] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:24]

2. **The holdout-independence gate asserts disjointness against exactly one corpus.** The gate builds TRAINING_FAMILIES from labeled-prompts.jsonl only (CORPUS_PATH at :42, set built at :92) and its disjoint-from-the-training-corpus test filters collisions against that set alone (:108-113). The builder's collision drop is that same single surface (build-holdout.mjs:100, drop at :112-116). So the header's proven-disjoint-from-the-training-corpus claim (:5-11) is a claim about one corpus, not about the fixtures' other scoring uses. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:42] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:92] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:108] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:100] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:112]

3. **The lane-weight sweep scores candidate weight vectors on the harder corpus, and the shipped vector appears in the sweep as V0.** The sweep test name is sweeps candidate lane weight vectors against the harder lexical-mis-route corpus and it asserts 15-25 entries, all lexical-mis-route (:645-660). V0-baseline-015-002 (:76) carries lexical 0.28 (:79), matching the value the feedback-calibration test asserts for DEFAULT_SCORER_WEIGHTS.lexical (0.28); the shipped defaults resolve from RESOLVED_WEIGHTS in lane-registry.ts:105. [INFERENCE: V0 is the shipped default vector because its lexical value matches the asserted default; the other four default values were not opened this iteration and should be confirmed against lane-registry.ts before this is upgraded from inference.] Either way, the same prompts that are 20 of the 66 holdout rows were scored to compare weight vectors, so they are not independent of lane-weight experimentation. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:645] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:76] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:79] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:105] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/advisor-feedback-calibration.vitest.ts:99]

4. **The Python/native divergence ratchet also scores the harder corpus, so the same rows help define the approved-drift baseline.** The ledger capture recomputes the strict Python/native top-1 divergence set used by the ratchet, reading both labeled-prompts.jsonl (:31) and the harder fixture (:32) and running the Python path by spawning python3 against skill_advisor.py (:100-107). The ratchet scores a union prompt corpus (:7), ratchets every current divergence against an approved-divergence ledger (:8) whose honest current-state baseline means new drift fails CI (:9), and asserts the harder slice count equals the fixture length (:283). Python is required by default (:34). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:5] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:31] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:32] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:100] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:7] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:34] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:283]

5. **The remaining scoring-path surfaces each carry a distinct honesty mechanism, and two uses of held-out collide.** The constants file names bench/scorer-calibration.bench.ts as the tuned surface for the threshold and constant values (:6-8), and the bench's calibration baseline shape pins corpusSha and corpusRows (bench :41-45). The outcome-weighted rerank driver builds a reliability fold from a TRAIN split of the labeled corpus and measures ONLY on a disjoint HELD-OUT split (:17-20) - a second, internal meaning of held-out that is not holdout-prompts.jsonl. The feedback-calibration path is shadow-only: records live under tmpdir() (feedback-calibration.ts:35), the model id is advisor-feedback-calibration-shadow-v1 (:61), proposals are built with liveWeightsFrozen true and autoPromotion false and heldOutValidationRequired true (weights-config.ts:37-39), asserted by its test (:88-98), and low-sample outcomes are excluded rather than turned into deltas (:102-121). However, heldOutValidationRequired is a declared field with no bound harness: a runtime scan for the proposal builder and the flag matched only lib/scorer files and tests, so no production consumer binds a proposal to holdout-prompts.jsonl. [INFERENCE: no non-test consumer binds the calibration proposal to the holdout, based on this iteration's ripgrep scan over the runtime tree excluding dist and node_modules.] Live env weight surfaces SPECKIT_ADVISOR_LANE_WEIGHTS_JSON, SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON and SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW are deleted by both the holdout gate (:57-59) and the divergence capture (:58-60) to freeze behavior, and the names also appear in lib/scorer/lane-registry.ts and lib/scorer/lanes/lexical.ts (file-level ripgrep match this iteration); the holdout is therefore measured under frozen defaults only. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:6] [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:41] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:17] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/feedback-calibration.ts:35] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/feedback-calibration.ts:61] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts:37] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/advisor-feedback-calibration.vitest.ts:88] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:57] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:58]

6. **Synthesis - the enforceable shape of independent holdout is a union-of-surfaces rule.** Given Findings 1-5, a held-out set stays honest when its independence assertion spans (i) the training corpus, (ii) every fixture that feeds a scoring-path experiment or drift baseline (the harder fixture feeds three surfaces), and (iii) the named drivers that tune scoring behavior (lane vectors, calibration constants, rerank, feedback calibration). Where overlap is deliberate - the sweep and the parity ratchet legitimately need the harder prompts for drift detection - the overlap must be recorded by prompt-set partition rather than asserted away. This turns iteration 1's caveat into a finite checkable list: one fixture-symbol import graph plus one env-freeze assertion, the pattern both freeze sites already implement in miniature. [INFERENCE: derived from Findings 1-5, all opened this iteration.]

## Ruled Out

- Using tests/scorer/fixtures/README.md's one-test-file-consumes-all-fixtures claim (:27) as the consumer map: true only for tests/scorer consumers and stale for tests/parity, where local-native-divergence-ratchet.vitest.ts also imports the harder fixture (:24). The consumer map came from symbol-level ripgrep instead.

## Dead Ends

- None this iteration; no direction was eliminated. No candidates for reducer promotion to Exhausted Approaches.

## Edge Cases

- Ambiguous input: strategy next-focus was truncated at HARDER_INTENT_PRO...; opening the fixture removed the ambiguity rather than requiring a narrowed interpretation.
- Contradictory evidence: minor scope conflict between tests/scorer/fixtures/README.md:27 and local-native-divergence-ratchet.vitest.ts:24. Resolved as a scope statement (scorer-tree README versus parity-tree test); recorded, not overclaimed.
- Missing dependencies: none; every planned read succeeded.
- Partial success: none.
- Scope note: progressiveSynthesis is true (deep-research-config.json:15), but the dispatch's allowed-write list binds writes to this narrative, deltas/iter-002.jsonl and the append gateway's writes; research/research.md does not exist in the packet and was deliberately not created, leaving synthesis to the workflow owner.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs
- .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/README.md
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/advisor-feedback-calibration.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/feedback-calibration.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts
- .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts
- .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-config.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-state.jsonl
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/findings-registry.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md

## Assessment

- New information ratio: 0.83
- Questions addressed: follow-up scoping of Q1's residual-overlap caveat (Q1 remains answered from iteration 1)
- Questions answered: none new; Q2, Q3, Q4 remain open

## Reflection

- What worked and why: symbol-level ripgrep (rg -l on the fixture symbol and on the holdout path) converted every-tuning-surface from prose into a finite consumer list, and opening each consumer's header gave the overlap semantics directly; the two env-freeze sites proved the live override surfaces exist without reading the registry in full.
- What did not work and why: the first find name-pattern pass mixed unrelated patterns and yielded no signal; filename discovery is weaker than usage discovery here because the connective tissue is imports, not names.
- What I would do differently: read the enforcement test before the builder comments next time - the test is the claim's actual scope, and the comments read wider than the assertion.

## Recommended Next Focus

Q2 - cross-path parity check content and failure conditions. This iteration surfaced the existing differential harness the answer should probably extend: local-native-divergence-ratchet.vitest.ts (strict top-1 Python/native union-corpus comparison, approved-divergence ledger, REQUIRE_PYTHON default-on at :34) plus its capture script, with tests/parity/python-ts-parity.vitest.ts as a second candidate. Concrete open sub-questions: what the parity check should compare beyond strict top-1 (ranked list, confidence, abstain) and how its failure conditions relate to the approved-divergence ledger. Q3's tie rule at 0.82 still needs the scorer tie-break read, and Q4 should start from the surfaces enumerated in Findings 1-5.
