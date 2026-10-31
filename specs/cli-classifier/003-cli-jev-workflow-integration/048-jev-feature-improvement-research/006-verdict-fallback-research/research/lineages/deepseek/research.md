---
title: "Deep Research: Improving the Jev Reviewer Verdict Fallback [lineage: deepseek]"
description: "Five-iteration evidence review of the Jev reviewer verdict fallback keep: its result drivers, accuracy and cost levers, measurement trustworthiness, adjacent .skilled uses, and default-on integration requirements."
trigger_phrases:
  - "Jev reviewer verdict fallback research"
  - "reviewer verdict fallback accuracy"
  - "verdict fallback default-on"
  - "score-verdict-fallback research"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Reviewer Verdict Fallback

Five inline iterations examined the measured keep, the call log behind it, the corpus and label
provenance, the deterministic extractors it could generalize to, and the shape of a default-on
integration. The answers below separate reported measurements from arithmetic recomputed over the
recorded artifacts and from forward-looking proposals.

## Table of Contents

1. Research Metadata
2. Request Summary
3. What Drove the Result
4. Raising Accuracy and Lowering Cost
5. Making the Measurement More Trustworthy
6. Other `.skilled` Judgment Opportunities
7. Default-On Integration: Requirements, Cost, and Risk
8. Confirmed, Inferred, and Unknown
9. Scope and Non-Goals
10. Recommendation
11. Eliminated Alternatives
12. Divergence Map
13. Open Questions
14. Staged Evaluation Plan
15. Evidence Ledger
16. Method and Evidence Limits
17. References
18. Convergence Report

---

## 1. Research Metadata

- **Research ID**: cli-jev/048/006, detached lineage `deepseek`
- **Feature**: `cli-jev/025-reviewer-verdict-fallback`
- **Status**: Complete for this five-iteration research pass. No implementation or promotion decision was made.
- **Date**: 2026-10-03
- **Executor**: inline `cli-pi`, model `deepseek-v4.1-flash`, reasoning max
- **Iterations**: 5 of 5, new-information ratios 0.90, 0.85, 0.85, 0.82, 0.80
- **Stop policy**: `max-iterations`, forced depth 5; the terminal synthesis record carries `stopReason: maxIterationsReached`
- **Measured result under review**: `verdict jev: keep K=24 M=24 A=24 B=8 W=16 L=0 F=0 p_win=0.00001526 p_loss=1.000`, baselines majority 8 of 24 and loose 0 of 24, run `~/.skilled/.labels/runs/047-025-jev-20261002`
- **Write surface**: `.../006-verdict-fallback-research/research/lineages/deepseek/` only

## 2. Request Summary

Explain the measured keep and what drove it, identify ways to raise the fallback's accuracy or lower
its cost, make the measurement more trustworthy, locate other `.skilled` surfaces where the same
judgment would pay off, and define what a default-on integration would need, cost and risk. The
fallback decides one of `pass`, `fail`, `block` for a reviewer output the deterministic
`extractVerdict` pattern misses; the scorer replays the pattern with zero calls and runs a Jev arm
only behind `--jev` past a 12-label gate. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:34-60] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/006-verdict-fallback-research/spec.md]

## 3. What Drove the Result

**The keep is a perfect column against a one-third baseline on a corpus built to be missed.** With
K=M=24, A=24, B=8, W=16, L=0, F=0: coverage `240 >= 216`, margin `160 >= 24`, flips `0 <= 7.2`, and
the sign test `p_win = binomialTail(16,16) = 2^-16 = 1.5259e-5`. The sign test is the only binding
gate: at n=16, W=12 is the smallest passing win count (`p=0.0384`) and W=11 fails (`p=0.1051`).
[SOURCE: score-verdict-fallback.cjs:348-357] [SOURCE: ~/.skilled/.labels/runs/047-025-jev-20261002/report.json]

**The baseline is the majority class at exactly K/3 because the labels are a forced 8/8/8
rotation.** `chooseBaseline` prefers the loose rule only when it is at least as good; the labels are
pass 8, fail 8, block 8; majority `pass` is right on 8 rows and the loose rule on 0, so `majority` is
chosen and B=8 by construction. [SOURCE: score-verdict-fallback.cjs:294-311] [SOURCE: ~/.skilled/.labels/025-outputs.jsonl]

**The corpus avoids the exact tokens both zero-call readers need.** Across the 24 prose reports there
are zero whole-word `pass|fail|block` tokens while inflected forms appear (`fails` x2, `failed`,
`failure`, `passed`, `blocker` x3). `extractVerdict` fires only on a line that is just the verdict
word (optionally prefixed by `verdict|result|status` plus a separator); `loosePick` reads only whole
verdict words. Both are evaded; a human reader still sees the verdict. [SOURCE: reviewer-scorer.cjs:117-123] [SOURCE: score-verdict-fallback.cjs:279-282] [SOURCE: token census over `~/.skilled/.labels/025-outputs.jsonl`]

**The scored population is the operator-named outputs file, not the shipped fixtures.** The same run
prints `fixture cases: 8 hits: 8 misses: 0` and `outputs rows: 24 hits: 0 misses: 24`; the four
`reviewer-*` fixtures all write `VERDICT:` lines, so no fixture miss enters the arm. [SOURCE: ~/.skilled/.labels/runs/047-025-jev.stdout.txt] [SOURCE: reviewer-regression.json]

**Jev's column was unanimous and stable.** 73 calls (1 auth test plus 24 rows x 3 orders), all
`measured`; modal pick equals label on all 24 rows; F=0; lowest `pickProb` 0.96, mean 0.998; p50 334
ms, p95 377 ms; `jev-1.13.0` from provider `official` under `jev 0.6.2`; `labels_sha256` matched the
measured file. [SOURCE: ~/.skilled/.labels/runs/047-025-jev-20261002/calls.jsonl recomputed] [SOURCE: stdout.txt]

**The labels are the author's intent, re-read.** The committed `025-intended.jsonl` cycles
`pass`, `fail`, `block` by row id and the measured labels match it 24 of 24; `results.md` records the
corpus as "24 reviewer reports written by DeepSeek V4.1 Flash" with a "delegated arbiter, blind, 24
rows (matched the author's intended verdict on 24 of 24)". [SOURCE: 047-measure-every-jev-feature/scratch/fixtures/025-intended.jsonl] [SOURCE: 047-measure-every-jev-feature/scratch/evidence/results.md:14]

## 4. Raising Accuracy and Lowering Cost

**The protocol spends three calls per miss plus one auth call.** 73 planned calls for 24 rows;
16,767 estimated input tokens from a ceil(chars/4) heuristic; serial time about 24 s at p50 334 ms.
[SOURCE: score-verdict-fallback.cjs:42,700-708] [SOURCE: stdout.txt]

**Order rotation bought no accuracy on this corpus; the one-call variant is recomputable.** Every
row's three order picks are identical (F=0, modal top=3 on all 24 rows) and the lowest `pickProb` is
0.96, so a one-call protocol would have produced identical picks and a confirm-on-uncertainty
protocol would also have used 24 calls. The three-order design exists to detect option-position
bias; one run cannot prove bias absent. [SOURCE: calls.jsonl recomputed] [SOURCE: score-verdict-fallback.cjs:418-419,775-830]

**Cost is unrecorded even though the client reports usage.** `calls.jsonl` drops the `jev` response's
`usage.input_tokens`/`usage.output_tokens`; the only cost figure is the pre-run character estimate,
and `jev auth test` is a billed call. [SOURCE: score-verdict-fallback.cjs:702-708,758-773] [SOURCE: cli-jev/benchmark/reports/2026-09-20-authenticated-verification/skill-benchmark-report.md:64] [SOURCE: cli-jev/references/providers-and-models.md:148]

**A cache precedent exists in the same pipeline and is unused here.** The eval rig keeps an
append-only cache keyed by input bundle and grader model build hash; the fallback records none, so
reruns re-pay every call even though `requalify` provides the invalidation seam. [SOURCE: scorer/lib/cache.cjs:1-45] [SOURCE: score-verdict-fallback.cjs:845-850]

**The regex is narrower than plausible natural formats, and this corpus cannot price a widening.**
Probed against the shipped `extractVerdict`: `VERDICT: FAIL`, `Verdict: pass.`,
`verdict - fail`, `Status: BLOCK` hit; `**VERDICT: FAIL**`, `Verdict: **FAIL**`,
`# VERDICT: FAIL`, `Final verdict: pass`, `Verdict: pass — stale evidence`,
`Verdict: FAIL (stale evidence)` and `Conclusion: pass` miss. [SOURCE: reviewer-scorer.cjs:117-123] [SOURCE: regex probe recomputation]

**The production grader path is heavier than the Jev path.** `--grader llm` dispatches a
process-isolated CLI (`cli-opencode` default, also `cli-claude-code`, default timeout 600 s) versus
a hosted call at p50 334 ms; a Jev backend keeps the same three-key contract and drops process
overhead. [SOURCE: reviewer-scorer.cjs:155-167] [SOURCE: dispatch-model.cjs:139-141,437-472,490-536]

## 5. Making the Measurement More Trustworthy

**The corpus is synthetic and authored by the same model family as this lineage's executor, at a
100 percent miss rate by construction.** [SOURCE: results.md:14] [SOURCE: iteration 3 finding 1]

**The labels are author intent re-read with no per-row decisions record.** The 042 labeling card
records 025 as blocked; 047 D4 allowed a purpose-built fixture to fill the gate; 047's evidence
directory holds only `results.md`, so unlike feature 035 there is no blind-draft pair, no arbitration
trail, and no corpus authoring record beyond one prose row. [SOURCE: 042-label-drafting-and-confirmation/scratch/evidence/card-025.md] [SOURCE: 042 goal.md D1-D3] [SOURCE: 047 goal.md D1,D4] [SOURCE: 047 scratch/evidence listing]

**The keep's uncertainty is wide at 24 rows.** Clopper-Pearson one-sided 95 percent lower bound for
24/24 is 0.1173 (accuracy at least 88.27 percent); Wilson 95 percent is [0.862, 1.000]; about 59 rows
would be needed to surface a 5 percent per-class error rate at 95 percent probability. [SOURCE: recomputation]

**Both baselines sit at their floor by construction.** The 8/8/8 rotation fixes majority at K/3 and
token avoidance drives loose to 0; natural text would strengthen both, so the margin has no realistic
zero-call competitor in this run. [SOURCE: iterations 1-2]

**The report records corpus identity but not instrument identity or provenance.** `report.json`
carries question/options hash and `labels_sha256` plus per-column model data, but no repo commit,
scorer/profile version, run time, corpus authoring model or labeling method; the measured labels are
an untracked home file. [SOURCE: report.json] [SOURCE: results.md:14]

**Natural-miss prevalence is unmeasured and no instrument produces it.** The `--reports` census can
count `pattern`/`llm-grader`/`none` per `reviewer-report.json`, but no such report exists anywhere
and live reviewer runs keep only a 16-character output hash; feature 025's open questions record the
need for an opt-in output save. [SOURCE: score-verdict-fallback.cjs:244-258,1030-1044] [SOURCE: reviewer-scorer.cjs:203] [SOURCE: 025 spec.md section 7]

**The mechanical foundations are sound and worth keeping.** Exact BigInt binomial tails; printed
labels hash; `requalify` on provider/model change; per-call exit and latency logging; pre-call gates;
`expectedVerdict` never scored; no model writes a label inside the scorer. [SOURCE: score-verdict-fallback.cjs:317-357,758-773,845-850,1059-1077]

## 6. Other `.skilled` Judgment Opportunities

Ranked by fit, seam and evidence in hand:

1. **Reviewer scorer grader slot** — `classifyWithGrader` fires exactly on a regex miss under
   `--grader llm`; a `jev` grader value reuses the frozen question, keys and this keep. Evidence:
   this run. Missing: the grader value and enablement. [SOURCE: reviewer-scorer.cjs:155-171,273-279] [SOURCE: 025 spec.md Out of Scope]
2. **Residue flagger skipped rows** — the deep-review report-table parser keeps only exact
   `P0/P1/P2` rows and emits `skipped`; deep-review's FAIL/CONDITIONAL/PASS ladder inherits what it
   missed. Evidence: 033 killed flagging on precision, so severity classification would be a new
   question with a ready corpus source. [SOURCE: deep-review/scripts/score-residue-flagger.cjs:139-206,335,353-363]
3. **Hallucination flag semantic gap** — the allowlist extractor already pairs with a semantic
   grader, and 024 kept at A=55 B=47; integration, not proof, is what remains. [SOURCE: deterministic/hallucination-flag.cjs header] [SOURCE: results.md 024 row]
4. **Deliverable extractor low path** — without tags or fences the extractor returns the whole
   transcript at `low` confidence and scoring may grade reasoning; a region judgment fills that path.
   [SOURCE: shared/extract-deliverable.cjs:8-13,30-38] [SOURCE: run-benchmark.cjs:188-205]
5. **Preplanning regex zero path** — a plan in prose scores `0.0`; a presence judgment could
   re-grade. [SOURCE: deterministic/preplanning-regex.cjs header]
6. **Deliberate non-candidate: runtime completion detection** — `fanout-run.cjs` already resolves
   missing stop reasons from on-disk artifacts; a model read would reintroduce self-report trust.
   [SOURCE: runtime/scripts/fanout-run.cjs:907-929,943-969]

## 7. Default-On Integration: Requirements, Cost, and Risk

**One concrete home exists today: the benchmark lane's grader branch, where the fallback would be
inert.** `scoring_method=reviewer` routes to `reviewer-scorer.cjs` with `--grader noop|mock|llm`
behind `SPECKIT_REVIEWER_BENCHMARKS`; the shipped profile has 8 fixture hits and 0 misses, so a Jev
grader would never fire until miss-case fixtures exist. [SOURCE: deep-model-benchmark-auto.yaml:39-65,204-206] [SOURCE: reviewer-regression.json] [SOURCE: stdout.txt census line]

**The change set is small and enumerable.** A `jev` grader value reusing the frozen question and
options; a `verdictMethod` naming decision because D4 keys on `llm-grader`; availability and skip
behavior (PATH, exact `jev 0.6.2`, `auth status`, recorded skip versus silent green); a payload
policy for text leaving the machine; usage/model/latency telemetry with `requalify`; and an opt-in
enablement order consistent with 047 D6 and 025 D5. [SOURCE: reviewer-scorer.cjs:155-171,235] [SOURCE: score-verdict-fallback.cjs:505-548,845-850] [SOURCE: 047 goal.md D6] [SOURCE: 025 spec.md REQ-007]

**Cost at benchmark volume is small.** 73 calls for 24 rows in the measured protocol; the
one-call variant would use 24 calls with identical picks on this corpus; the reviewer profile has 4
fixtures (8 merged cases). A batched `jev run` carrying the three option orders as named questions
on one state is untested. Cost matters only if the fallback reaches high-volume review traffic,
outside this phase. [SOURCE: iterations 2 and 5] [SOURCE: cli-jev/references/cli-reference.md:49,118-122]

**Risk ledger, ordered by what would invalidate a decision.** (1) Corpus validity first. (2) Egress:
reviewer outputs and diffs leave the machine; the payload rule and cli-jev's "state is a secret"
boundary must be policy. (3) False confidence: 24/24 floors at 88.3 percent one-sided and a
fail-to-pass error is asymmetric; per-class reporting and abstention or advisory-only use are
prerequisites. (4) Drift: the exact version pin and `requalify` only work against a stored report.
(5) Forced choice: no abstain key; `block` is the "cannot give a verdict" term. (6) Cost creep:
3 calls per miss times unknown volume; one-call, batching, caching and a budget cap mitigate.
[SOURCE: iterations 2-3 and 5]

**The measurement-to-integration loop is designed end to end and has never run.** Reviewer runs
persist `reviewer-report.json`; the fallback census reads its `verdictMethod` counts; misses would be
labeled and judged by the same keep rule. The missing piece is capture, not code. [SOURCE: score-verdict-fallback.cjs:244-258,1030-1044] [SOURCE: reviewer-scorer.cjs:203,280-300] [SOURCE: deep-model-benchmark-auto.yaml:152,209]

## 8. Confirmed, Inferred, and Unknown

**Confirmed (read or recomputed):** every printed count and its arithmetic; the forced label balance
and its effect on B; the exact-token avoidance; the unanimous stable column and latency; the intent
match 24/24; the Q3 record gaps; the transfer seams; the workflow route and the inertness of an
enabled fallback on the shipped fixtures.

**Inferred:** that a natural reviewer-miss corpus would behave differently (no such corpus exists);
that a regex widening or one-call protocol holds outside this sample (both are recomputed proposals,
not measurements); that the same discipline transfers to the ranked candidate surfaces (judgment
from shape, with each candidate's missing measurement stated).

**Unknown:** the natural miss rate in review traffic; token or dollar cost per call; whether order
bias is truly absent beyond this corpus; whether a natural-corpus keep survives a realistic baseline;
whether batched `run` prices below three separate calls.

## 9. Scope and Non-Goals

In scope: reading and recomputing the recorded measurement, auditing provenance, inventorying
transfer seams, and ranking proposals. Out of scope: changing the scorer, fixtures, labels or
profile; running a live re-measurement; wiring any grader; any write outside this lineage directory.
[SOURCE: 006 spec.md Scope; 025 spec.md Out of Scope]

## 10. Recommendation

Ranked for a build phase; each item carries its basis and effort. Required versus optional is
marked.

1. **Required: build the natural-miss corpus with independent labels before any default change.**
   Capture reviewer outputs (opt-in save or collected sessions), label misses with two blind drafts
   plus an arbiter blind to intent, and report per-class metrics. Basis: Section 5. Effort: medium.
   Risk: low, no behavior change.
2. **Required: extend the report trust package.** Record repo commit, scorer/profile version, run
   time, corpus provenance, usage/cost, and print binomial confidence intervals plus per-class
   confusion while keeping `labels_sha256`. Basis: Section 5. Effort: small. Risk: none.
3. **Recommended: seed the protocol change.** One call, plus a second only on a missing or
   low-confidence pick; record `usage` tokens; cache content-hash results with model identity.
   Basis: Section 4. Effort: small. Risk: needs a fresh run to price.
4. **Recommended: add `jev` as an opt-in grader and add miss-case fixtures to
   `reviewer-regression`.** Keep the default unchanged until items 1-2 land; update D4 and mismatch
   text in the same change. Basis: Sections 5 and 7. Effort: small to medium. Risk: low, inert
   until fixtures exist.
5. **Recommended: reuse the shared question/options/transport discipline for the next candidates,
   residue severity first, through one harness.** Basis: Section 6. Effort: medium. Risk: none
   measured yet.
6. **Optional: price a regex widening study and a batched `run` protocol on the natural corpus.**
   Basis: Section 4. Effort: one run each. Risk: cheap either way.
7. **Not recommended: any model read in runtime completion detection.** Basis: Section 6. Risk:
   reintroduces self-report trust.

## 11. Eliminated Alternatives

- **Flipping the grader default on the current corpus.** The fallback is inert on the shipped
  fixtures and the only miss population is synthetic; the flip would rest on a corpus-bound keep
  (Sections 3 and 7).
- **Treating 24/24 as a precision level or an error rate.** The interval is wide and per-class
  errors are unobservable at 8 rows per class (Section 5).
- **Treating the two zero-call baselines as realistic competitors.** Both sit at their floor by
  construction (Section 5).
- **Treating `F=0` as proof that option order does not matter.** It is one corpus with unanimous
  picks; bias absence needs its own design (Section 4).
- **Treating the version pin as drift protection.** It needs a stored report to compare against
  (Section 7).
- **Treating already-measured 047 features as transfer answers.** Their verdicts show where the
  judgment was tested, not where the shape remains available (Section 6).

## 12. Divergence Map

No divergent pivots were taken in this lineage. Saturated directions: none recorded. Failed pivots:
none. Audited overrides: none. Remaining frontier: the untested proposals in Section 10 items 3-6
and the natural-corpus prerequisite in item 1.

## 13. Open Questions

- What is the natural miss rate of `extractVerdict` on real reviewer outputs, and what does the
  fallback score there against realistic baselines?
- Does the one-call or confirm-on-uncertainty protocol hold on a fresh corpus with near-boundary
  picks, and does a batched `run` request price below three calls?
- Does a regex widening (bold, heading, adjective-prefixed, em-dash and trailing-content forms)
  cut fallback demand without harming deterministic precision?
- Which payload policy will govern reviewer text leaving the machine in a default-on setting?
- Does the residue-severity candidate produce a corpus large enough for its own keep rule?
- How should `block` function as the abstention term when a fallback answer is uncertain?

## 14. Staged Evaluation Plan

1. Capture and label a natural-miss corpus (Section 10 item 1); land the trust package (item 2).
2. Re-run the keep on that corpus with the unchanged rule and the two zero-call baselines.
3. Price the protocol change (one-call / confirm-on-uncertainty / batched `run`) and the widening
   study on the same corpus.
4. Add `jev` as an opt-in grader with miss-case fixtures; verify the fallback path exercises and
   D4/mismatch accounting stays correct.
5. Only then decide on a default-on change, with the payload policy and skip behavior published.

## 15. Evidence Ledger

- Scorer: `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:34-60,146-159,212-220,244-258,279-311,317-357,405-432,505-548,700-863,845-850,887-947,975-976,1030-1044,1059-1077`
- Reviewer scorer: `.../lib/reviewer-scorer.cjs:117-123,155-171,203,235,273-300`
- Dispatch and cache: `.../dispatch-model.cjs:139-141,437-472,490-536`; `.../scorer/lib/cache.cjs:1-45`
- Profile and fixtures: `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json`; `.../benchmark-fixtures/reviewer-*.json`
- Run artifacts (external): `~/.skilled/.labels/runs/047-025-jev-20261002/{report.json,calls.jsonl}`; `~/.skilled/.labels/runs/047-025-jev.stdout.txt`; labels `~/.skilled/.labels/025-outputs.jsonl`
- 047 records: `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14`; `scratch/fixtures/025-{outputs,intended}.jsonl`; `goal.md` D1, D4, D6
- 042 records: `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-025.md`; `goal.md` D1-D3
- Feature 025: `spec.md` (Keep Rule, Out of Scope, REQ-007, section 7); `goal.md` D1-D5; `implementation-summary.md`
- Workflow route: `.skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:39-65,152,204-209`
- Client: `.skilled/skills/cli-classifier/cli-jev/references/cli-reference.md:38-66,118-122`; `providers-and-models.md:122-148`; `SKILL.md`
- Transfer seams: `deep-review/scripts/score-residue-flagger.cjs:139-206,335,353-363`; `shared/extract-deliverable.cjs:8-13,30-38`; `run-benchmark.cjs:188-205`; `deterministic/{preplanning-regex,hallucination-flag}.cjs` headers; `runtime/scripts/fanout-run.cjs:907-929,943-969`
- This lineage: `iterations/iteration-001..005.md`; `deltas/iter-001..005.jsonl`; `deep-research-strategy.md`

## 16. Method and Evidence Limits

- All iteration work ran inline in one lineage; no nested executor was dispatched.
- Counterfactuals (order stability, confidence intervals, regex probes, token censuses, one-call
  recomputation) are recomputations over recorded artifacts, not new measurements; they are labeled
  as such throughout.
- The natural-miss population does not exist; every claim about real reviewer outputs is conditional
  and marked inferred or unknown.
- The corpus authoring prompt and the arbiter's raw output were not found; the provenance finding
  rests on the one `results.md` row plus the committed intent file.
- One lineage produced this synthesis; its integration and transfer judgments are single-lens
  readings and are marked as such where they go beyond the data.

## 17. References

- Scorer and tests: `score-verdict-fallback.cjs`, `tests/verdict-fallback.vitest.ts`, `lib/README.md`
- Reviewer path: `reviewer-scorer.cjs`, `reviewer-regression.json`, `reviewer-schema.md`
- Measurement docs: `feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md`, `manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md`
- Run artifacts (external): `~/.skilled/.labels/runs/047-025-jev-20261002/`, `~/.skilled/.labels/025-outputs.jsonl`
- Feature packet: `025-reviewer-verdict-fallback/`; measurement packet: `047-measure-every-jev-feature/`; labeling packet: `042-label-drafting-and-confirmation/`
- Sibling research for method precedent: `048-jev-feature-improvement-research/004-injection-screen-research/research/lineages/deepseek/research.md`

## 18. Convergence Report

- **Stop reason**: `maxIterationsReached` (stop policy `max-iterations`, forced depth)
- **Total iterations**: 5 of 5, all `complete`
- **Questions answered**: 5 of 5 (Q1 result decomposition, Q2 accuracy and cost, Q3 trustworthiness, Q4 transfer surfaces, Q5 default-on integration)
- **Average new-information ratio**: 0.844 (0.90, 0.85, 0.85, 0.82, 0.80, a smooth decay with no stuck or error iteration)
- **Remaining questions**: the six in Section 13, all either capability checks or untested proposals
- **Convergence threshold**: 0.05, telemetry only under the max-iterations cap; the ratio never approached it, and the cap decided the stop
- **Quality guards**: five distinct focus areas with independent source families per iteration (scorer code, run artifacts, provenance records, cross-surface parsers, workflow route). No iteration leaned on a single weak source; the one-line 047 provenance row is the thinnest source and is cited as a limit, not a pillar.
- **Divergence summary**: no divergent pivots recorded.
