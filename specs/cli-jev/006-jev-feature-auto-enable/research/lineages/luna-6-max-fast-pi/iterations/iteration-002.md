# Iteration 2: Spec-track narrowing proof, power, and hardening

## Focus
Determine whether feature 017's earlier keep or its later margin stop supports deployment, then specify the corpus, decision rule, accuracy probes, hardening, integration and tests needed to settle it.

## Actions Taken
- Re-read the canonical state and strategy; Q1 is recorded, so selected the next planned focus, spec-track narrowing.
- Read the current scorer's test-set construction, frozen verdict rule, aggregation and replay logic.
- Compared the 017 keep, the 049 repeat, the repeat's power analysis, and the improved scorer test suite.
- Treated earlier 017/repeat reports as corroboration and checked them against the implementation and recorded 049 verification.

## Findings
1. **P0 — Keep hard narrowing offline: the paired results are inconclusive, not a keep or a clean kill.** The initial packet-prose run kept Jev at 97/256 against ripgrep at 68/256, but the repeat stopped on margin at Jev 106/270 versus baseline 82/270; its cluster-bootstrap 95% accuracy-delta interval [-0.1185, 0.2760] spans zero. The repeat is a warning against shipping the earlier keep, not proof that Jev is worse. Confirmation: run the pre-registered, powered test on a separate time-held-out set of real Gate 1 requests and require the full floors in Finding 2. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/research.md:49-57] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/implementation-summary.md:90-105] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/goal.md:82-90]
2. **P0 — Pre-register an external-validity and power gate before another model run.** Use a consented, redacted, time-separated sample of actual Gate 1 queries, with independent label provenance, `none`/cross-track cases, and enough observations per track to estimate both traffic-weighted utility and worst-track recall. Predeclare alpha, minimum detectable effect, power, an absolute accuracy floor, and a per-track recall floor against ripgrep and the strongest safe fallback. At the repeat's 0.588 decided-pair win rate, the exact-binomial calculation needs about 217 decided pairs (roughly 431 rows at the current 50.4% decided rate) for 80% power; the 270-row repeat had only 0.399 power at its observed effect. Confirmation: publish the power line and split/power inputs before unblinding, then report paired estimates and a cluster-aware interval by track. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/implementation-summary.md:94] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-002.md:24-38] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:887-894]
3. **P1 — Improve accuracy from observed confusion, not by tuning on the current proxy.** The scorer builds questions from packet descriptions and hash-caps them at 20 rows per track; prior research reports 256 kept of 1,727 usable descriptions, and a small paraphrase probe favored ripgrep 8 to 2. On the repeat, probability-aware aggregation fell to A=102 versus modal A=106 and one-call scored A=103; the shortlist arm was not measured. Do not adopt those arms or edit descriptions based on one favorable sample. Confirmation: diagnose per-track confusion and abstention first, then compare any revised question/options on the same frozen real-request holdout and a second untouched time slice. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:43-50] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:330-365] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/research.md:55-69] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/goal.md:83] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-002.md:47-52]
4. **P1 — Keep the landed reproducibility hardening, but do not mistake it for population validity.** The 049 scorer pins row/question/option and model identity, refuses reuse of a populated output directory, replays recorded rows, reports dropped rows, and computes a whole-track bootstrap; tests cover deterministic bootstrap, pinning, no-overwrite, replay and changed-row drops. These make a run auditable but do not turn packet prose or path-derived labels into real-request evidence. If a later holdout passes, first integrate as a gated, fail-open shadow path that preserves broad search on `none`, low confidence or provider failure; promote only after shadow metrics and live-path tests pass. Confirmation: rerun the scorer suite, independently reproduce the pinned report from its call log, and verify helper-off/missing-auth paths preserve the pre-Jev retrieval result. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1111-1141] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1372-1396] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts:631-657] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts:868-987] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/spec.md:74-85] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:171-185]

## Ruled Out
- Reading the 017 keep as authorization to ship: the 049 repeat changed both corpus and baseline and stopped on margin.
- Reading the repeat as a clean kill: its interval spans zero and its power at the observed effect was 0.399.
- Adopting probability aggregation or a one-call protocol solely because one earlier proxy run improved by one row.
- Treating row/model pinning and replay hardening as a substitute for independent labels and real-request holdout data.

## Dead Ends
- A softer `none` decision rule is not supported as an accuracy fix; prior recorded analysis found no abstained row chose the gold track in any order. Do not tune that threshold without a real holdout. [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-002.md:61-66]

## Edge Cases
- Ambiguous input: none; “prove or retire” was interpreted as deciding deployment eligibility, not requiring a forced keep/kill from underpowered evidence.
- Contradictory evidence: the 017 keep and 049 margin stop differ, but the corpus and baseline changed; preserve both rather than collapsing them into a single verdict.
- Missing dependencies: raw 049 call/report files live outside the repository; the repository's implementation summary and goal capture the repeat, while primary scorer and test sources were read directly.
- Partial success: prior-cited exact power numbers were available in the 006 lineage report; raw calculation script/output was not re-run in this iteration.

## Sources Consulted
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:43-64,330-365,816-894,935-959,1111-1141,1372-1396`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts:631-657,868-987`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/research.md:49-79`
- `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/implementation-summary.md:90-105`
- `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/goal.md:82-90`
- `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/spec.md:74-85`
- `specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max/iterations/iteration-002.md:17-66`

## Assessment
- New information ratio: 0.5.
- Novelty justification: all four findings extend the pre-existing track-narrowing result with direct checks of current scoring code, repeat summary, and 049 tests; each is partially new to this lineage, none is wholly new.
- Questions addressed: feature 017 corpus, labels, keep rule, power, accuracy, hardening, integration and test requirements.
- Questions answered: “What evidence, corpus, labels, keep rule, power, hardening, integration, and tests would settle spec-track narrowing?” — answered as a proof-or-retire protocol; the required real-request holdout does not yet exist.
- Questions remaining: routing clarify default; alignment folder suggestion; the unified cross-feature proof-or-retire standard.

## Reflection
- What worked and why: pairing the original run and the repeat with the current scorer and its tests exposed both the statistical uncertainty and the distinction between reproducibility hardening and external validity.
- What did not work and why: exact 049 raw call logs were unavailable inside the repository; recorded summaries support the reported counts, but the power calculation was not independently rerun here.
- What I would do differently: for the next feature, trace the scorer's replay eligibility check first, then compare authored fixture rows with the actual live event population.

## Questions Answered
- What evidence, corpus, labels, keep rule, power, hardening, integration, and tests would settle spec-track narrowing?

## Questions Remaining
- What evidence, corpus, labels, keep rule, power, hardening, integration, and tests would settle routing clarify default?
- What evidence, controls, hardening, integration, and tests would settle alignment folder suggestion?
- What unified proof-or-retire rule and ranked next step applies across the three candidates?

## Next Focus
Audit feature 020's fixture and replay gate against compiled-router clarify events; keep named-mode accuracy separate from abstention and do not infer production value from the 54-row keep.
