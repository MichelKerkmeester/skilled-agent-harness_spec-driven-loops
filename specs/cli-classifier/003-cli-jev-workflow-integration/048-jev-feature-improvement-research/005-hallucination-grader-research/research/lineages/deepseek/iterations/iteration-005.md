---
title: "Iteration 5: What a default-on integration needs, costs, and risks"
trigger_phrases: []
---
# Iteration 5: What a default-on integration needs, costs, and risks

## Focus

Q5. Define what turning the D4 grader on by default would require: which backend the evidence covers, the plumbing and semantics that must change first, the recurring cost shape, and the ranked risk register — anchored on the 024 decisions that deliberately left wiring to a later operator-opened phase.

## Actions Taken

1. Read the 024 goal decision table (D1, D5) and the spec's out-of-scope boundary on wiring.
2. Read the opt-in 5-dimension scorer catalog entry (defaults for scorer and grader) and the runner's grader validation and family-collision guard.
3. Read the benchmark automation workflow's promotion steps to bound the blast radius.
4. Read a capability profile and the default profile for output-volume shapes and the repeatability-tolerance precedent.
5. Re-read the harness cache keying and the fanout budget guard as cost-control precedents.

## Findings

1. **The measured keep covers the jev column, not the `llm` grader.** The 047 result validates the hosted jev backend (jev 0.6.2, provider official, model jev-1.13.0) on this corpus. The `--grader llm` path is a different implementation (Claude CLI with the D4 rubric) that this arm never measured, and the frozen keep rule applies "per backend column" (REQ-005). Wiring a jev grader kind was explicitly out of 024's scope ("Adding a `jev` or `deem` grader kind to the runner... Offline only"), and D5 says a keep wires nothing: "a grader kind needs a later phase the operator opens". Any default-on proposal must therefore pick its backend and measure that backend, not inherit the jev number. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/goal.md:48,52] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:94,135] [SOURCE: file:~/.skilled/.labels/runs/047-024-jev-20261002/report.json]

2. **Failure semantics must change before default-on.** In the current 5-dim path a dispatch or parse failure becomes `score: 0.0` — maximal hallucination for a measurement that did not happen; 024's D1 explicitly left "the failed grade's 0.0 unchanged". A default-on grader that can be offline (no credential, no CLI, no network) will silently deflate every affected score unless the dimension gains an unmeasured/unavailable representation that is excluded rather than zeroed, plus a retry path. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/goal.md:48] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:217-229] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:427-438]

3. **The defaults are deliberately hermetic and attributed.** `--scorer pattern` and `--grader noop` are the defaults; `--scorer 5dim` and `--grader llm` are opt-in, and both reports and the `benchmark_run` record stamp `scoringMethod` and `grader` so results are attributable. Turning a grader on by default changes what every future run measures and breaks comparability with historical reports unless the change is versioned and re-baselined. [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md:23-27] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:577,590,737-740]

4. **Family collision and credentials already have guard rails — default-on must respect them.** An `llm` grader that shares a model family with any generator is refused unless `--allow-same-family` is passed, with the error naming same-family grading as the score-inflation mechanism. The jev gate skips without a credential, and the Claude dispatch fails without the CLI. A default-on mode therefore needs a stated independent grader model, an explicit degraded/offline story, and no silent fallback to `mock`. [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:590-592,621-634] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:436-480]

5. **Cost shape: one grader call per scored output per pass, replicable only through the cache.** The 5-dim scorer builds one grader function and calls it per output (`score-model-variant.cjs:295-306`); the harness caches each result under a run-scoped root keyed by variant, fixture, rubric, dimension, output hash, and model+prompt identity, so repeated scoring of unchanged outputs is free but every new output pays once. Recorded jev arm cost was 169 calls for 56 rows (~93k estimated input tokens). A capability profile shape (4 fixtures x 2 models x 5 samples = 40 outputs) implies 40 D4 calls per uncached 5-dim pass — derived from the profile files, not observed. There is no per-run cost cap in the benchmark runner; the fanout runtime's cost-unit guard (`DEFAULT_MAX_COST_UNITS_PER_LINEAGE = 72`) is the in-repo precedent for one. [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:295-306] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:388-417,458-465] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:105-135] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v2.json] [SOURCE: file:.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1047] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:712]

6. **Allowlists must land first.** The `llm` grader's rubric scores against `fixture.allowlist.cli_flags` and `allowlist.symbols`, and all 21 fixtures carry none; default-on without populated allowlists hands the grader an empty anchor — the same pathology iteration 1 reproduced for the deterministic check. [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md:22-27] [SOURCE: command:in-memory reproduction (fp=34/47)]

7. **The blast radius today is advisory.** The autonomous benchmark workflow's candidate step only "report[s] a promotion recommendation without mutating a canonical target" and "must not invoke the promotion helper or create an approval receipt"; the session outcome enum includes `advisoryOnly`. So a default-on grader changes scores in reports that feed operator decisions — it cannot promote a model by itself. That bounds risk but also means the report numbers are the product; their trustworthiness is the stake. [SOURCE: file:.skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:233-245] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/autonomous-promotion-authority.vitest.ts:11-19]

8. **Noise is already a first-class concern in this system.** The default profile sets `repeatabilityTolerance: 0.03` with a calibration note that "deltas at or below it should be read as ties, not improvements", because single-sample cells carry run-to-run noise. A default-on D4 grader introduces exactly that kind of noise into 15% of the weighted score (sampled noul; the recorded arm already shows one flip), so the tolerance framing — or multi-sample D4 with a tie rule — should apply to D4 scores too. [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json] [SOURCE: file:~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:53-58]

9. **The remaining trust debt is the measurement's, and it would circulate with the default.** Default-on would put this judgment in front of every benchmark reader; Q3's caveats travel with it: single-labeler labels with no adjudication, fixture-clustered rows treated as independent, a nominal p_win above a 15-feature Bonferroni threshold, and a corpus covering one hallucination family on cooperative text. The 024 goal already conditions wiring on a later operator-opened phase; that phase should carry the Q3 fixes, not just the wiring. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/goal.md:52] [SOURCE: derived: iteration-3 findings]

**Answer to Q5.** Requirements, in order: (1) choose the backend and measure it — jev wiring is a new operator-opened phase, the `llm` path needs its own agreement run; (2) give grader unavailability a real representation and stop scoring failures as 0.0; (3) version and re-baseline the default change because reports are stamped and compared; (4) keep hermetic no-op behavior for offline/CI runs and document the degraded modes; (5) populate fixture allowlists so either backend has its anchor; (6) add a cost cap or scope default-on to gated runs, with the run-scoped cache as the repeat-cost control; (7) carry the Q3 trust fixes into the wiring phase. Cost: one call per scored output per uncached pass (recorded jev reference: 169 calls / ~93k estimated tokens for 56 outputs), so cost tracks output volume, not wall-clock; the cache makes reruns free. Risk register, ranked: evidence transfer across backends; failure-as-0.0; score noise read as signal; same-family inflation; cache staleness; injection from graded outputs (defenses untested on adversarial corpora); cost drift without a cap; and the measurement's own trust debt circulating at larger scale. Blast radius is bounded to advisory reports today.

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/{goal.md,spec.md}` (D1, D5; out-of-scope wiring)
- `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md`
- `run-benchmark.cjs` (defaults, validation, family guard, report stamping)
- `scorer/grader/harness.cjs`, `scorer/lib/cache.cjs`, `scorer/score-model-variant.cjs`
- `assets/model-benchmark/benchmark-profiles/{default.json,capability-m3-vs-mimo-v2.json}`
- `.skilled/commands/deep/assets/deep-model-benchmark-auto.yaml` (promotion steps)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (cost-unit guard precedent)
- `~/.skilled/.labels/runs/047-024-jev-20261002/{report.json,calls.jsonl}` (read-only)

## Assessment

- **newInfoRatio: 0.80.** The backend-transfer requirement, failure semantics, cost shape, and advisory-only blast radius are new; the trust-debt carryover consolidates iteration 3.
- **Confidence:** high for the contracts and guards (read from source); the per-pass call count for the `llm` path is derived from the scorer's per-output call structure and profile shapes, not observed in a run.

## Reflection

- Worked: reading the goal decision table first made the integration question precise — the phase's own boundary (a keep wires nothing) anchors every requirement.
- Failed: nothing attempted failed.
- Ruled out: treating the jev keep as evidence for the `llm` grader, and treating promotion as an automatic consequence of scores (the workflow is advisory-only by test).

## Recommended Next Focus

Synthesis: consolidate all five answers into the ranked recommendation list with the convergence record.
