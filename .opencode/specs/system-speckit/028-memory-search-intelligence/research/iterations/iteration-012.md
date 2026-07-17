# Iteration 12: Runtime Tests for Review and Council Fallback Contracts

## Focus

This iteration audited runtime implementation and tests for the deep-review and AI-council fallback contracts documented in iteration 11: review-depth graphless fallback tests, council status recovery payload assembly, council convergence three-state decisions, and whether tests are active or manual/TODO-only.

Ambiguity note: the full runtime surface includes all deep-loop runtime scripts. I selected the narrow fallback/staleness contract slice: `status.cjs`, council convergence logic, council graph integration tests, and review-depth convergence/validator tests.

## Findings

1. Council `status.cjs` implements a recovery payload directly in the runtime response: it marks readiness as `empty` or `ready`, declares `sourceOfTruth: derived_from_ai_council_artifacts`, includes bounded cleanup and safe replay actions, returns counts/schema version, and only computes signals when nodes exist. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/status.cjs:137] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/status.cjs:147] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/status.cjs:163]
2. Council convergence runtime implements the three-state false-safe prevention contract: empty graphs return `STOP_BLOCKED`; populated graphs compute signals/blockers/trace; blocking findings produce `STOP_BLOCKED`, all passing trace entries produce `STOP_ALLOWED`, and otherwise the result is `CONTINUE`. [SOURCE: .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:171] [SOURCE: .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:188] [SOURCE: .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:192]
3. Council graph integration tests are active and cover the key branches: status empty returns recovery mode `derived_replay`, ready status returns signals, convergence blocks empty/unresolved-critical graphs, returns `CONTINUE` for non-blocking threshold failures, and returns `STOP_ALLOWED` for passing council signals. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:211] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:236] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:265] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:281]
4. Review-depth graphless fallback has active test coverage, but one key convergence fixture is a workflow-text assertion rather than an executed workflow: it checks the auto/confirm YAML contains `candidateCoverageGate`, `graphlessFallbackGate`, required `searchLedger` wording, `unavailable_blocked`, and blocked-stop JSON wiring. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:20] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:24] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:27]
5. Review-depth validator tests are stronger at the record-schema layer: they actively fail non-trivial v2 records with missing `searchLedger`, uncited ledger rows, broken linked finding IDs, and shallow active finding details. This supports fallback evidence quality, but it does not by itself prove the full stop-gate workflow execution path. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:153] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:157] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:171] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:186]

## Ruled Out

- Treating council false-safe prevention as documentation-only was ruled out: both runtime code and active tests cover empty graph blocking, unresolved-critical blocking, continue, and stop-allowed branches. [SOURCE: .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:171] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:236]
- Treating review-depth fallback as untested was ruled out: active tests cover YAML contract presence and validator-level ledger failures, though not full workflow execution. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:20] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:153]

## Dead Ends

- No runtime test in the inspected review-depth slice executes a full deep-review run through `step_check_convergence`; the strongest inspected test for `graphlessFallbackGate` is a workflow YAML string assertion. This should be carried forward as a coverage-depth gap rather than absence of any coverage.

## Edge Cases

- Ambiguous input: “runtime implementation and tests” could include every deep-loop runtime integration test. I selected the fallback/staleness files named by iteration 11.
- Contradictory evidence: Council references promise robust false-safe prevention and the inspected runtime/tests largely support it. Review-depth references promise a workflow stop gate, while inspected tests prove YAML wiring and validation rules more than full workflow execution.
- Missing dependencies: Code graph remained stale/untrusted; direct `Glob`, `Grep`, and `Read` evidence was used. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: The pass inspected runtime code and tests but did not execute the tests.

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/scripts/status.cjs:137`
- `.opencode/skills/deep-loop-runtime/scripts/status.cjs:147`
- `.opencode/skills/deep-loop-runtime/scripts/status.cjs:163`
- `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:171`
- `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:188`
- `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:192`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:211`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:236`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:265`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:281`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:20`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:24`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:27`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:153`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:157`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:171`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:186`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Where do docs claim coverage that tests or code no longer support?
  - Where does implemented behavior lack corresponding benchmark or test coverage?
  - Which gaps affect code graph and deep-loop workflow reliability?
- Questions answered:
  - Council graph status/convergence has active runtime and test support for key anti-false-safe branches.
  - Review-depth fallback has active YAML contract and validator tests, but inspected coverage is shallower than a full workflow-runner convergence test.

## Reflection

- What worked and why: Glob plus targeted grep/read quickly mapped documented contracts to concrete scripts and tests.
- What did not work and why: This iteration did not run tests, so it cannot claim current green test execution, only presence and intent of active test files.
- What I would do differently: Next pass should audit command/README/manual surfaces for whether they overstate review-depth workflow execution coverage versus the actual test depth.

## Recommended Next Focus

Audit documentation claims around review-depth v2 test coverage and workflow-runner integration: feature catalogs, README/changelog entries, and manual playbooks that may imply fully executed graphless fallback behavior when inspected tests are mostly YAML/validator-level.
