---
title: "Iteration 10: Implementation phases, gates and risks, plus the lineage frontier status"
trigger_phrases: []
---
# Iteration 10: Implementation phases, gates and risks, plus the lineage frontier status

## Focus

Q9 — group the surviving findings and proposals into phases with owners, gates and risks, and close the lineage's key-question frontier before synthesis. This iteration adds no new source reads; it orders what iterations 1-9 established and states what remains bounded.

## What was read

This iteration is an ordering pass over iterations 1-9 and the archived refinement. No new sources were opened.

## Findings

1. **[NEW] Phase 1 — restore the deterministic gate over the existing corpus before adding any behavior layer.** Owner: `manual-testing-playbook` plus the benchmark tooling that owned the retired replay. Work: make the two-layer scenario contract explicit (routing precondition, behavior verdict), then rebuild the offline deterministic replay over the 28-scenario corpus so the precondition layer is CI-checkable again. Gate: the rebuilt replay must first pass against the current hub unchanged, and the playbook's persisted-evidence and no-mocks policy must survive. Risk: scenario-schema churn; mitigated by adding the two verdict fields additively with defaults. Basis: iteration 5 finding 5, iteration 8 finding 7, proposal 2. [SOURCE: .skilled/skills/sk-code/benchmark/README.md:14-30] [SOURCE: iterations/iteration-009.md finding 2]

2. **[NEW] Phase 2 — grader self-tests and the honesty rows, all additive and parser-safe.** Owner: playbook execution contract plus the review output contract. Work: require machine-checkable detection markers with a negative fixture per checker; add the review coverage-limits section and the consequence-of-inaction bullet; add the report-only lean line; state the anti-fabricated-baseline rule and the restraint-counterweight pairing rule. Gate: the review contract's exact final-line string is unchanged and the rule-copy canary still passes. Risk: downstream parsers key on the final line only, so new sections must sit above it; the canary's delivery-prefix anchors must be re-measured if `AGENTS.md` changes. Basis: iteration 3 findings 1-4, iteration 5 finding 1, proposals 3, 4, 8. [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-005.md finding 1]

3. **[NEW] Phase 3 — reuse evidence and the pending measurement, touching the always-loaded ladder.** Owner: the shared universal standards plus the Lane B sweep lane. Work: add the reuse-evidence step to the ladder and the matching inventory citation to removal proposals; complete the partially-missing standard-library review row; enumerate the artifact classes to search before calling code unused; then add the Lane B size metric as measurement-only, paired with a correctness counterweight and never gating. Gate: the always-loaded document's delivery prefix must stay inside the smaller runtime truncation limit, checked before and after; the metric must not enter any gate. Risk: the ladder lives in the always-loaded universal doc, so an unbounded edit can push a binding clause past the truncation prefix; measure first. Basis: iteration 1 finding 3, iteration 3 finding 8, iteration 7 findings 2 and 4, proposal 7. [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:46] [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:60-100]

4. **[NEW] Phase 4 — guard and documentation hygiene, no behavior change.** Owner: the guard family and the runtime-surface documentation. Work: give the retired router-sync check a successor or a named owner; state the external-anchor requirement for agreement guards; add support-tier and verified-version rows for the runtime surfaces. Gate: the drift guards and the commit-time mirror gate must still run green. Risk: low; the main risk is adding a guard without an anchor, which the new requirement forbids. Basis: iteration 4 findings 4-5, proposals 5 and 6. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:47-52]

5. **[NEW] Phase 5 — deferred until a consumer and a lane exist.** Three items are deliberately not scheduled: the sk-code surface/standards priming payload on the existing session-lifecycle hooks (needs a named consumer and a delivery-prefix decision); doctrine-effect scenarios for the hub's own rules (needs the Phase 1 deterministic layer first and a model-dispatch lane with a control arm); and rec 10's subjective `shrink` row (the Phase 2 lean line covers the information without a per-finding subjective row). Basis: iteration 7 finding 5, iteration 9 findings 1 and 5, archived rec 10. [SOURCE: .skilled/hooks/session-lifecycle/README.md:1-30]

6. **[NEW] Ordering rationale: each phase is gated on the one before it by a measurement, not by preference.** Phase 1 establishes the gate that proves later phases did not break routing; Phase 2 changes output contracts, which the canary then protects; Phase 3 edits the always-loaded ladder, which is why it follows the contract work rather than preceding it; Phase 4 is documentation-only and can run in parallel; Phase 5 waits for prerequisites. No phase claims a size, cost or time saving: per proposal 8, no baseline exists for the hub's own work until a paired measurement runs. Basis: proposals 4 and 8, iterations 5-6 findings. [SOURCE: iterations/iteration-009.md findings 4 and 8]

7. **[NEW, bounded] Frontier status: all nine key questions are answered, and four sub-questions remain explicitly unverified.** Answered: Q1 (doctrine and ladder), Q2 (hooks and activation), Q3 (commands and routing), Q4 (portability and guards), Q5 (verification, measurement, quality enforcement), Q6 (benchmark design), Q7 (prior-refinement reconciliation), Q8 (rejections and original proposals), Q9 (phases). Unverified and carried forward rather than claimed: whether sk-code matches Ponytail's Windows stdin/BOM hook coverage (iteration 5 finding 8); whether the candidate-arm wiring behind `PONYTAIL2_PLUGIN_DIR` works as documented (iteration 6, edge case); whether a hand-rolled-standard-library review row exists under wording the search missed (iteration 7 finding 2); and the current pass state of the `design-restraint` scenarios, whose last recorded verdicts come from a retired harness (iteration 7, edge case).

8. **[NEW] Convergence status: the ratio threshold was not met, and the stop is the iteration cap with the frontier exhausted.** Rolling new-information ratios were 0.5, 0.31, 0.56, 0.56, 0.69, 0.75, 0.5, 0.5, 0.75, 0.3 — above the 0.05 threshold throughout, because each iteration opened a distinct key question rather than re-treading one. The honest terminal reason is `max-iterations-cap-reached` (10/10) with every key question answered and four sub-questions bounded, not a convergence claim. [SOURCE: deep-research-config.json maxIterations 10, convergenceThreshold 0.05]

### Classification roll-up (iteration 10)

| Classification | Findings |
|---|---|
| NEW | 1-6 (phase plan with owners, gates, risks and ordering rationale), 7 (frontier status), 8 (honest convergence status) |
| ALREADY-ADOPTED | none new |
| LOST | none new |

## Ruled Out

- Scheduling any phase on a savings claim: no paired measurement exists for the hub's own work.
- Reinstating the retired harness wholesale: only the deterministic replay layer is needed; the scoring contract and command surface are not.
- Starting Phase 5's priming payload without a named consumer: the archived report's deferral reason is gone, but the consumer question is not answered.

## Dead Ends

- Looking for a phase that can precede the restored gate: none, because every later phase changes either an output contract or the always-loaded ladder, and neither is safe to change unmeasured.

## Edge Cases

- Ambiguous input: phase ownership names surfaces rather than people, because this lineage has no authority over staffing.
- Contradictory evidence: none — the phase order follows the gate dependencies established in iterations 5-8.
- Missing dependencies: Phase 5's doctrine-effect scenarios depend on a model-dispatch lane that this lineage did not verify as available.
- Partial success: findings 7 and 8 record what remains unverified and why the stop reason is the cap.

## Sources Consulted

- .skilled/skills/sk-code/benchmark/README.md:1-30
- .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:46
- .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:60-100
- .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:47-52
- .skilled/hooks/session-lifecycle/README.md:1-30
- specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/deepseek-flash-cline/iterations/iteration-{001..009}.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/deepseek-flash-cline/deep-research-config.json
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:37-88

## Assessment

- New information ratio: 0.3 (phase plan, frontier status and convergence status; no new source evidence)
- Questions addressed: Q9
- Questions answered: Q9

## Reflection

- What worked and why: gating each phase on the measurement that proves it safe produced an order that does not depend on anyone's preference.
- What did not work and why: an earlier draft put the ladder edit in Phase 1; the delivery-prefix risk forced it after the contract work.
- What I would do differently: compute the convergence ratio from the start of the run rather than per iteration, so the terminal reason is visible earlier.

## Recommended Next Focus

None — the key-question frontier is exhausted and the next action is synthesis: `research.md`, the findings registry, the dashboard, the resource map and the terminal ledger events.
