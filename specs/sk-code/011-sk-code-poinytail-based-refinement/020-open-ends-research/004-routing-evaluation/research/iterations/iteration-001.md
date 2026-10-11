# Iteration 1: Held-Out Evaluation Set for system-skill-advisor (Q1)

## Focus

Q1: What should a realistic held-out evaluation set for system-skill-advisor look like: its size, the source of its prompts, its negatives, and how it stays held out from the prompts the scorer is tuned against?

Read-only investigation of the repo's existing evaluation machinery under `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy` and its consumers. Ambiguity note: the topic's "current batteries are 17 prompts plus 5 negatives" names the SA-001 probe battery, which is a different layer than the routing-accuracy corpus; this iteration treats both layers explicitly and answers Q1 for the evaluation layer.

## Actions Taken

1. Read research state (config, state JSONL, strategy) and verified the packet-local write boundary before any research action.
2. Located the routing-accuracy harness and read its README, `build-holdout.mjs`, `scorer-eval-baseline.json`, and `scorer-eval-baseline-ratchet.vitest.ts`.
3. Read `score-routing-corpus.py`, `ambiguity-prompts.jsonl` structure, and counted rows/source types/negatives in `labeled-prompts.jsonl` and `holdout-prompts.jsonl`.
4. Read the SA-001 probe battery markdown and `advisor-battery.py` to classify what the 17-positive plus 5-negative battery actually is.
5. Read `lane-weight-sweep.vitest.ts` and `scoring-constants.ts` to identify the tuning surfaces a holdout must stay disjoint from.

## Findings

1. **An independent, fixture-derived holdout already exists and has the recommended shape.** `holdout-prompts.jsonl` holds 66 frozen rows assembled from three separately-authored fixtures: `harder-intent-prompt-corpus.ts` (20 rows), `skill-advisor-regression-cases.jsonl` (40 rows), and `executor-delegation-cases.json` (6 rows). Every row's label is copied from its source fixture's own expected field — the builder states no gold is invented — and per-row provenance is preserved through `source_type` and `origin_fixture` fields so the set is auditable. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:5] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:14] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:1]
2. **Held-out discipline is mechanical, not conventional.** The builder family-normalizes prompts (lowercase, strip punctuation, collapse whitespace) and drops any row that collides with a prompt in `labeled-prompts.jsonl`, the training corpus the explicit-lane rules were tuned against; the committed baseline pins SHA-256 hashes for corpus, holdout, and ambiguity slice; and the ratchet test re-scores every slice against the committed baseline so numbers may only hold, an improvement must be captured into the baseline rather than drift silently, and any corpus or holdout edit forces a conscious re-baseline. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:19] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:100] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:5] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:5]
3. **Negatives are first-class rows and are measured as false fires and abstains.** The labeled corpus carries 18 gold-`none` rows and the holdout carries 6 (P0/P1 abstain and suppression cases such as `P0-ABSTAIN-001` and `suppressed-codex-abstain`); the baseline records `gold_none_false_fire` = 5 and `unknown_count` = 13, and regression cases that expect no result become gold `none` when the holdout is built. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:19] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:22] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:27] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:66] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:70] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:12]
4. **The current working scale and floors give the sizing reference.** Full corpus: 195 rows, top-1 153 (accuracy 0.7846). Holdout: 66 rows, 49 (0.7424). Ambiguity slice: 24 rows, 18 (0.75, tau 0.03). Named buckets: review 31 (0.8065), memory_save 32 (0.8438), delegation 9 (1.0). Ratchet floors: `FULL_CORPUS_FLOOR` = 0.75 and `HOLDOUT_FLOOR` = 0.725, with minimum bucket sizes 31/32/9 below which a slice is treated as statistically meaningless. Prompt sources in the labeled corpus are synthetic and paraphrased: synthetic-realistic 91, synthetic-edge 48, paraphrased-realistic 37, synthetic-command 12; the builder notes harvesting and hand-labeling real advisor-hook telemetry is the legitimate future upgrade and is deliberately not faked. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:14] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:25] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:29] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:30] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:83] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:16]
5. **The 17-positive plus 5-negative SA-001 battery is not a held-out set.** `advisor-battery.py` parses its probes out of a committed markdown table (22 P/N rows) and replays them through the live CLI or the Python advisor; the battery's own header lists the full published probe set, and rows P2 through P10 are openly copied from the labeled corpus, marked "golden set rr-..." in the markdown and named as its golden-set source. Nothing pins the probe set with a hash, and the prompts are visible to anyone editing the scorer. It is an end-to-end smoke battery, not an evaluation of generalization. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:19] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:28] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:125] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:19] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:68]
6. **Residual holdout-overlap risk must be scoped against every tuning surface.** The holdout's independence claim names `labeled-prompts.jsonl` as the training corpus, but the lane-weight sweep scores `HARDER_INTENT_PROMPT_CORPUS` — the same fixture that supplies the 20 "holdout-harder" rows — alongside `INTENT_PROMPT_CORPUS`, across a list of weight vectors. Those rows are therefore disjoint from explicit-lane rule tuning but not from lane-weight experimentation; a realistic held-out set should enumerate all tuning surfaces, including lane weights and any shadow-weight or feedback calibration path, and either stay disjoint from all of them or record the overlap explicitly. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:5] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:26] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:153] [INFERENCE: overlap between the sweep corpus and the 20 holdout-harder rows, from the holdout source_type counts measured this iteration and the sweep imports].

**Synthesis for Q1's four sub-parts** (within the evidence above): size — keep the working scale the ratchet already pins, roughly 50-70 frozen holdout rows over a ~195-row labeled corpus, each named bucket at or above its pinned minimum (31/32/9), plus the 24-row ambiguity slice; expand only through a reviewed re-baseline. Source of prompts — fixture-authored disjoint corpora today (synthetic and paraphrased), real hook telemetry as the deliberate future upgrade, never paraphrases of the training corpus. Negatives — explicit gold-`none` abstain/suppression rows measured as `gold_none_false_fire` and `unknown_count`, not merely "some other skill won". Holdout discipline — family-normalized collision drop against the training corpus, SHA-256-pinned fixtures, and a metric ratchet that forbids silent improvement or regression drift.

## Questions Answered

- Q1: What should a realistic held-out evaluation set for system-skill-advisor look like: its size, the source of its prompts, its negatives, and how it stays held out from the prompts the scorer is tuned against? — Answered with a working precedent (see Findings 1-4), an explicit negative class (Finding 3), and the residual overlap caveat every future set must scope (Finding 6). Status as recorded: `answeredQuestions` carries the exact strategy text.

## Questions Remaining

- Q2: What should a cross-path parity check between skill_advisor.py and .skilled/bin/skill-advisor.cjs compare (top skill, ranked list, confidence, abstain), and when should it fail?
- Q3: How do the evaluation set and the parity check stay cheap to run and honest, given ties at confidence 0.82 and hub admission running in CI with --warn-only?
- Q4: Which existing harnesses, fixtures and CI jobs can each recommendation extend in place, so the move stays as low as possible on the prevent-overengineering reversal-cost order?

## Edge Cases

- Ambiguous input: the topic's "current batteries" phrase spans two layers (SA-001 probe battery vs. routing-accuracy corpus); resolved by treating them separately and stating which layer each finding addresses.
- Contradictory evidence: no flat contradiction; the holdout independence scope versus the lane-weight sweep's reuse of the harder fixture is a recorded tension (Finding 6), not resolved by citing both sides into a single claim.
- Missing dependencies: none.
- Partial success: none; all planned reads succeeded.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py
- .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/README.md
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts
- .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py

## Assessment

- New information ratio: 0.92
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: following artifact names from the strategy's bounded-context snapshot directly into `runtime/scripts/routing-accuracy` surfaced a complete, internally consistent evaluation stack (corpus, holdout builder, baseline, ratchet) in one pass; the holdout's own provenance design answered most of Q1 without requiring synthesis.
- What did not work and why: an early grep for lane-weight-sweep and golden-prompts references in `runtime/package.json` returned nothing (exit 1) because the accuracy harness is script-driven rather than npm-script-driven; switching to fixture and script filename searches was the productive route.
- What I would do differently: for Q2, open the Node/Python parity surfaces directly rather than searching for existing parity documentation first.

## Next Focus

Q2 — cross-path parity check content and failure conditions. Concrete leads discovered this iteration: `runtime/tests/skill-advisor-cli-parity.vitest.ts` and `skill-advisor-cli-dual-client.vitest.ts` already exist; `score-routing-corpus.py` loads `skill_advisor.py` in-process while `advisor-battery.py --via python` replays through the CLI shim with `--force-native` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:59], giving two ready comparison harnesses; and the 0.82 floors in `scoring-constants.ts` (readOnlyRouteAllowedFloor, taskIntentFloor, directScoreFloor) mean top-1 ties can land at the floor, so the parity check must define a tie rule before it can fail meaningfully. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:181] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:186] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:188]
