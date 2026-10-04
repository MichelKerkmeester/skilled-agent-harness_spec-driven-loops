# Iteration 1: Shared Jev gate and live integration contract

## Focus
Establish the current shared-gate contract and the patterns used by the four existing Jev-backed integrations before assessing any candidate feature wiring.

## Actions Taken
- Re-read this lineage's config, state log, and strategy; selected the first unchecked question, with no exhausted directions.
- Inspected the shared feature registry/switch/readiness implementation and its focused tests.
- Compared the cite-drift, injection-screen, reviewer verdict-fallback, and D4 hallucination-grader call sites.
- Kept the candidate feature implementations untouched; this was read-only research outside the lineage.

## Findings
1. **P0 — Do not register or invoke candidate Jev paths until feature-specific proof passes.** The shared table currently contains only `cite-drift`, `injection-screen`, `verdict-fallback`, and `hallucination-grader`; an unset switch leaves a registered feature on, with global and per-feature opt-outs resolved before credentials, environment values taking precedence over persisted hook-flags values, and the cite-drift alias retained. Confirmation: before a later wiring change, add a focused registry/switch assertion for each proposed feature and verify unset, global-off, feature-off, persisted-off, and environment-override cases. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:33-55] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:63-105] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:56-149]
2. **P0 — Preserve switch-first, fail-closed readiness and fail-open caller behavior.** `featureReady` returns immediately when a switch is off; otherwise readiness checks for `jev` and runs a bounded `auth status` probe. Existing helper tests assert a disabled feature does not spawn Jev, while the injection hook returns its no-op result on invalid input and when the gate is not ready. Confirmation: use a stub executable/call log to prove zero calls when disabled and the exact legacy behavior when Jev is missing, unauthenticated, timed out, or throws. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:139-185] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:159-229] [SOURCE: .skilled/hooks/injection-screen/claude/injection-screen-posttooluse.mjs:75-93] [SOURCE: .skilled/hooks/injection-screen/claude/injection-screen-posttooluse.mjs:106-110]
3. **P1 — Reuse the existing consumer seams rather than creating a parallel gate.** Citation-drift runs only for in-range citations after its feature switch and credential/version gate; injection-screen gates only the `WebFetch` hook path; reviewer fallback maps `auto` to Jev only when the gate is ready and otherwise keeps `noop`; the benchmark D4 grader invokes its gate only for the 5-dimension scorer in auto mode. Confirmation: an integration review should identify the exact eligible event/operation, the unchanged baseline result, the gate call, and the report or advisory surface for each future consumer. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1440-1449] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1546-1559] [SOURCE: .skilled/hooks/injection-screen/claude/injection-screen-posttooluse.mjs:75-103] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:333-360] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:606-632]
4. **P1 — Keep helper contract tests separate from future consumer-path tests.** The shared tests cover default-on semantics, master/per-feature/alias switches, config fallback and environment precedence, missing credentials/CLI, readiness, and the disabled/no-spawn edge. Those checks validate the helper, but they do not alone prove any of the three candidate call sites preserve user-visible baseline behavior. Confirmation: retain the helper suite and add feature-specific tests only after evidence authorizes a shadow/canary consumer; inject the gate/transport and assert unchanged output on every non-ready path. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:56-149] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:159-229] [INFERENCE: the cited test cases exercise the shared helper, while the candidates are not among the four registered names at .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:38-55]

## Ruled Out
- Adding any candidate to the shared registry during this research: implementation is an explicit non-goal and evidence remains feature-specific.
- Treating “stored credential present” as sufficient proof of product value or deployment authorization.

## Dead Ends
- None. The local gate and four consumer examples directly answered this iteration's question.

## Edge Cases
- Ambiguous input: none; “four proven features” was treated as the four current registry entries, not as a claim that all four have equivalent user-facing risk.
- Contradictory evidence: none found in the inspected gate/call-site sources.
- Missing dependencies: no external dependency was needed for this source-level question.
- Partial success: none.

## Sources Consulted
- `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:33-185`
- `.skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:56-229`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1440-1559`
- `.skilled/hooks/injection-screen/claude/injection-screen-posttooluse.mjs:75-110`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:333-360`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:606-632`

## Assessment
- New information ratio: 0.625.
- Novelty justification: one finding adds specific helper-test coverage detail and three refine already-known gate behavior with current source anchors; the weighted ratio is (1 + 0.5 × 3) / 4.
- Questions addressed: shared-gate contract and patterns from existing integrations.
- Questions answered: “What is the current shared-gate contract, and what do the four proven features show about a safe live integration?”
- Questions remaining: the three feature-specific proof standards and the unified proof-or-retire rule.

## Reflection
- What worked and why: tracing the gate from switch table to readiness helper and then to real callers exposed the true integration boundary and the off/no-credential fallback behavior.
- What did not work and why: none; the sources answered the scoped question without external research.
- What I would do differently: use the measured feature reports and scorer inputs next, rather than re-evaluating the common gate.

## Questions Answered
- What is the current shared-gate contract, and what do the four proven features show about a safe live integration?

## Questions Remaining
- What evidence, corpus, labels, keep rule, power, hardening, integration, and tests would settle spec-track narrowing?
- What evidence, corpus, labels, keep rule, power, hardening, integration, and tests would settle routing clarify default?
- What evidence, controls, hardening, integration, and tests would settle alignment folder suggestion?
- What unified proof-or-retire rule and ranked next step applies across the three candidates?

## Next Focus
Trace feature 017's scorer, repeated-run evidence, and measurement packet to identify a powered, externally valid proof-or-retire path; do not treat the earlier relative keep as deployment evidence.
