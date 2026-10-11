# Iteration 3: Making the Union-of-Surfaces Holdout Independence Rule Enforceable

## Focus

Follow-up to iteration 2's Finding 6: turn the union-of-surfaces synthesis into a concrete, enforceable check. Three parts: (a) complete the union - enumerate every consumer of the three holdout source fixtures, including consumers iteration 2 did not surface; (b) measure the one overlap that matters most (the harder fixture read by both the holdout builder and the lane-weight sweep) to establish whether a partition already exists; (c) state the check's shape and its cheapest in-place home. The dispatch focus text arrived truncated again ("every fixtu..."); the full text was recovered from findings-registry.json and iteration-002.md:28, so no interpretation narrowing was needed. Non-goals respected: no fix is proposed for probe P4, probe P7 or admission scenario DOC-331, and no researched file was modified.

## Actions Taken

1. Re-read research state (config, state log, strategy, findings registry, iteration 1 and 2 narratives) and verified the packet-local write boundary: iterations/iteration-003.md and deltas/iter-003.jsonl were absent; only the two allowed artifacts plus the append gateway's writes were created.
2. Ran symbol-level consumer scans for all three holdout source fixtures (harder-intent-prompt-corpus, skill-advisor-regression-cases, executor-delegation-cases) across .skilled/bin, .skilled/skills/system-skill-advisor and the owning spec packet. A first repo-root scan was abandoned after it did not complete inside 90 seconds; bounded roots produced the full list.
3. Read tests/parity/holdout-independent.vitest.ts in full, tests/scorer/fixtures/harder-intent-prompt-corpus.ts in full, and lane-weight-sweep.vitest.ts spans (imports, hard-corpus map at :153, assertions at :645-666).
4. Measured fixture and holdout geometry by counting prompt rows, labels, and source types, and located the first row of each source type in holdout-prompts.jsonl.
5. Opened the newly surfaced consumers: advisor-validate.ts (corpus loader at :252-255, regression loader at :280-284, delegation loader at :307-313, stratifiedHoldout at :327 used at :677), capture-scorer-eval-baseline.mjs (input constants :36-40, regime :47-58, fixed scoring instant :60-64, dist imports :77-79), and the stress-test and delegation-consumer references.
6. Read the iteration verifier and the markdown findings parser to confirm the output contract shape before writing artifacts (verify-iteration.cjs:243-260 route proof, :385-446 artifact checks; iteration-findings.cjs:7-40 findings parser).

## Findings

1. **The union of surfaces consuming the holdout's source fixtures is wider than iteration 2's two drift surfaces: it now includes the production validation handler and the baseline-capture script, plus two further test consumers.** advisor-validate.ts loads skill-advisor-regression-cases.jsonl (:280-284) and executor-delegation-cases.json (:307-313), and builds its own stratified 40-row holdout from the labeled corpus (:327, :677; loadCorpus reads labeled-prompts.jsonl at :252-255). capture-scorer-eval-baseline.mjs consumes labeled corpus + holdout + ambiguity + delegation to regenerate the committed scorer-eval-baseline.json (:36-40). python-compat-stress.vitest.ts references the regression fixture (:30); executor-delegation.vitest.ts (:58) and scorer-eval-baseline-ratchet.vitest.ts (:75) consume the delegation fixture. The union now has three classes: tuning surfaces (lane sweep on the harder fixture; the bench and shadow-feedback paths from iteration 2), blessing/measurement surfaces (baseline capture, divergence capture), and validation surfaces (holdout gate, both ratchets, the validate handler, the stress suite). [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:280] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:307] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:327] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:677] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:255] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:36] [SOURCE: .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-compat-stress.vitest.ts:30] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts:58] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:75]

2. **The measured harder-fixture geometry makes the current overlap a by-construction subset relation, not an accident: 22 prompt rows, 20 carrying expectedSkill; the holdout takes the 20 holdout-harder rows; the sweep scores all 22 across 7 weight vectors, and no partition or record separates the two uses.** The fixture's array holds 22 entries (:12-:143); two entries (beginning at :61 and :66) omit expectedSkill. holdout-prompts.jsonl carries 66 rows with exactly 20 holdout-harder (rows 1-20; row 21 is the first regression row), 40 holdout-regression and 6 holdout-delegation rows. lane-weight-sweep.vitest.ts maps the full array into HARDER_SWEEP_CORPUS (:153-157), runs 7 weight vectors against it (:74, :656-660), and asserts the corpus is 15-25 entries, all lexical-mis-route (:650-654). [INFERENCE: the 20 holdout-harder rows come from the 22-entry fixture and are therefore a subset of the 22 prompts the sweep scores - the first holdout row's prompt matches the fixture's first entry verbatim (holdout-prompts.jsonl:1 vs harder-intent-prompt-corpus.ts:14), and the labeled-entry count (20) equals the holdout-harder count (20), so the two unlabeled entries are excluded from the holdout while remaining sweep-scored.] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts:61] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts:66] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:21] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:61] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:153] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:645] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:660]

3. **The union rule is enforceable as a static, bidirectional check that extends in place at holdout-independent.vitest.ts: a declared overlap map plus an observed fixture-reference scan, asserted equal.** The file already provides every piece the check needs: family normalization (:45-46), JSONL reading (:49-50), one training-family set (:92), per-row provenance tags (:100-106), and the disjointness assertion itself (:108-113). The extension is three steps: (i) build family sets for every surface that reads a holdout source fixture (the sweep corpus, the divergence union corpus, the baseline-capture inputs of Finding 1's union), (ii) compute the actual overlap between those families and the holdout families, (iii) assert the computed overlap equals a declared map (for example, holdout-harder may overlap lane-weight-sweep; every other pair must be empty). Step (iii) is what forces recording: a new test that starts scoring holdout rows changes the computed overlap and fails CI until the map is amended. [INFERENCE: derived from the file's current structure and Findings 1 and 2.] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:45] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:49] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:92] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:108] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:26]

4. **Regime scoping: the independence-relevant freeze is the same three override deletes in both scoring sites; the capture's extra controls are reproducibility, not independence.** holdout-independent.vitest.ts deletes SPECKIT_ADVISOR_LANE_WEIGHTS_JSON, SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON and SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW (:57-59); capture-scorer-eval-baseline.mjs deletes the same three (:56-58). The capture additionally sets VITEST=true (:55, because the semantic-shadow lane substitutes deterministic fixture vectors under the harness flag) and pins a fixed scoring instant (:60-64, because the derived lane discounts each skill by age). Those two controls make the committed baseline replayable on a later day; they neither widen nor narrow the independence claim, so the union check should not attempt to assert regime equality between the two sites. [INFERENCE: classification from opening both blocks.] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:57] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:59] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:55] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:56] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:60]

5. **Cost/honesty mechanics: the union check is set algebra over family-normalized prompt strings and adds no scoring rerun; its honesty comes from equality between observed references and the declared map, not from a new measurement.** Steps (i)-(iii) of Finding 3 read fixture files and compare sets - the same pattern the existing disjointness test already uses (:108-113) - so marginal cost is bounded by fixture size (22 + 40 + 6 rows against 66 holdout rows), not by the 120-second scoring beforeAll (:98) that dominates the current gate when the whole file runs. The check cannot be made cheaper by weakening it (only ever checking the labeled corpus again); its value is failing on unrecorded overlap. [INFERENCE: based on the existing test's static set operations and the measured fixture and holdout sizes.] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:98] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:108] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts:12]

6. **Boundary synthesis: the union-of-surfaces rule governs holdout independence only; the Q2 cross-path parity check is a separate contract where prompt overlap is expected.** Independence asks whether the prompts that measure generalization were also allowed to influence behavior; parity asks whether two implementations agree on a prompt set, where scoring the same prompts on both paths is the point. Iteration 2 queued the parity question against the existing differential harness (iteration-002.md:84); folding parity into the independence check would invert its meaning, so the two checks should share fixtures and CI habits but never share the overlap rule. [INFERENCE: derived from Findings 1-5 and the framing of Q2.] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-002.md:84] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:108] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:656]

## Questions Answered

- None new this iteration. Q2, Q3 and Q4 remain open.

## Questions Remaining

- Q2: What should a cross-path parity check between skill_advisor.py and .skilled/bin/skill-advisor.cjs compare (top skill, ranked list, confidence, abstain), and when should it fail?
- Q3: How do the evaluation set and the parity check stay cheap to run and honest, given ties at confidence 0.82 and hub admission running in CI with --warn-only?
- Q4: Which existing harnesses, fixtures and CI jobs can each recommendation extend in place, so the move stays as low as possible on the prevent-overengineering reversal-cost order?

## Ruled Out

- Repo-root symbol scan over the whole worktree as the consumer census: it did not complete inside the first 90-second budget; bounded roots (.skilled/bin, .skilled/skills/system-skill-advisor, the 011 spec packet) returned the complete consumer list instead.
- Assuming all three holdout source fixtures co-locate under tests/scorer/fixtures: only harder-intent-prompt-corpus.ts lives there; skill-advisor-regression-cases.jsonl is under runtime/scripts/fixtures and executor-delegation-cases.json under runtime/tests/parity/fixtures. find-by-name, not assumed paths, is the working route.

## Dead Ends

- None this iteration; no direction was eliminated. No candidates for reducer promotion to Exhausted Approaches.

## Edge Cases

- Ambiguous input: dispatch next-focus was truncated at "every fixtu..."; the full text was recovered from findings-registry.json and iteration-002.md, so no narrowed interpretation was required.
- Contradictory evidence: none new this iteration. The prior README-versus-ratchet tension (documented in iteration 2) is unaffected.
- Missing dependencies: none; every planned read succeeded after the bounded scan.
- Partial success: none; all planned research actions completed and all three iteration artifacts were written.
- Scope note: progressiveSynthesis is true (deep-research-config.json:15), but the dispatch's allowed-write list binds writes to this narrative, deltas/iter-003.jsonl and the append gateway's writes; research/research.md does not exist in the packet and was deliberately not created, leaving synthesis to the workflow owner (same treatment as iteration 2).

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/harder-intent-prompt-corpus.ts
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/README.md
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-compat-stress.vitest.ts
- .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs
- .github/workflows/skill-advisor-stress.yml
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-config.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-state.jsonl
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/findings-registry.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-002.md

## Assessment

- New information ratio: 0.75
- Justification: 3 of 6 findings are fully new (the widened consumer union, the measured harder-fixture geometry and subset overlap, the enforcement check shape); 3 are partially new (regime scoping refines iteration 2's freeze inventory, cost/honesty mechanics restate the synthesis concretely, boundary synthesis separates the union rule from the Q2 parity contract). No simplicity bonus is claimed because Q2-Q4 remain open.
- Questions addressed: the iteration-2 follow-up scope (union-of-surfaces enforceability), which hardens Q1's residual caveat.
- Questions answered: none new; Q2, Q3, Q4 remain open.

## Reflection

- What worked and why: symbol-level consumer scans (rg -l on fixture filenames and symbols) turned the union from prose into a finite consumer list, and reading the enforcement test before the builders showed exactly which structures a check can reuse (normalizeFamily, readJsonl, the single TRAINING_FAMILIES set). Counting rows with rg -c plus an eye pass caught the interface-line artifact (23 matches = 22 rows + 1 interface field).
- What did not work and why: the repo-root rg scan over the whole worktree hung past its budget; the failure was scope, not pattern, and bounded roots fixed it. wc against assumed fixture paths failed because the three fixtures are not co-located; find-by-name resolved the real locations.
- What I would do differently: start with bounded roots and verify fixture locations by name before counting anything, rather than discovering the locations through failed commands.

## Recommended Next Focus

Q2 - cross-path parity check content and failure conditions. This iteration sharpens the boundary the next iteration must respect: the union rule constrains independence (which prompts may tune behavior), while the parity check constrains agreement (both paths scoring the same prompts), so the parity design should start from the differential harness rather than from the holdout gate. Unopened leads from the parity directory listing: local-native-divergence-ratchet.vitest.ts (strict top-1 comparison plus the approved-divergence ledger), python-ts-parity.vitest.ts, and the two path entry points named in the topic (skill_advisor.py, .skilled/bin/skill-advisor.cjs), none of which were opened this iteration. Concrete sub-questions: what the check compares beyond strict top-1 (ranked list, confidence, abstain), how its failure conditions relate to the approved-divergence ledger, and where the 0.82 floors force a tie rule before the check can fail meaningfully.
