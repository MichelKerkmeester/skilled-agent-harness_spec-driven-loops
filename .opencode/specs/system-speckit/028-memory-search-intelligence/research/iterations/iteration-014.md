# Iteration 14: AI-Council Graph Documentation and Test-Depth Claims

## Focus

This iteration audited AI-council graph documentation/test-depth claims for status recovery, convergence safety, and value-comparison scenarios. It compared manual playbook summaries and feature-catalog claims against actual council graph integration and value-scenario test files.

Ambiguity note: the focus could include all AI-council tests. I selected the graph-related claims named by iteration 13: DAC-024 status recovery, DAC-023/DAC-029 convergence safety, and DAC-027..DAC-032 value-comparison scenarios.

## Findings

1. The AI-council manual playbook makes concrete graph-status and value claims: DAC-024 requires readiness/counts/schema/signals plus namespace-scoped recovery with no false-safe empty success, while DAC-027..DAC-032 claim graph-vs-baseline value comparisons across disagreement triage, provenance, convergence safety, blocker ranking, hot-topic discovery, and interruption recovery. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:337] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:357] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:373]
2. The manual playbook’s automated-test cross-reference is strong for graph integration and value scenarios: it maps `council-graph-script.vitest.ts` to DAC-019..024 and `council-graph-value-scenarios.vitest.ts` to DAC-027..032. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:399] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:409]
3. The actual council graph script test backs the status/convergence claims with active assertions: empty status returns `readiness: empty`, `signals: null`, and `recovery.mode: derived_replay`; convergence returns `STOP_BLOCKED` for empty/unresolved-critical graphs, `CONTINUE` for non-blocking failures, and `STOP_ALLOWED` for passing signals. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:211] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:236] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:265] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:281]
4. The value-scenario test file actively enumerates DAC-027 through DAC-032 and compares graph and no-graph baseline outputs, file reads, runtime calls, and a metrics ratio. This supports the playbook’s value-comparison claim at the harness level. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:20] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:37] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:40]
5. There is a documentation precision gap in the AI-council feature catalog: the DAC-029 catalog labels the manual playbook scenario as “Automated test” even though its role is a manual scenario contract, and the individual DAC fixture files are thin wrappers around centralized `buildScenarioFixture`. That means the automated value claim is real, but per-scenario evidence is less self-describing than the feature catalog suggests. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md:47] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md:51] [SOURCE: .opencode/skills/deep-loop-runtime/tests/fixtures/council-value/dac-032.ts:5]

## Ruled Out

- Treating AI-council graph status/convergence claims as documentation-only was ruled out because `council-graph-script.vitest.ts` actively asserts the core branches and recovery payload. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:211] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:236]
- Treating value-comparison scenarios as absent was ruled out because the integration test explicitly runs DAC-027..DAC-032 fixtures. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:20]

## Dead Ends

- The import-implied `.js` fixture path for DAC-032 did not exist on disk, but a matching `.ts` fixture exists. This appears to be TypeScript module-resolution convention rather than missing coverage; still, the per-scenario fixture itself is only a thin `buildScenarioFixture('DAC-032')` wrapper. [SOURCE: .opencode/skills/deep-loop-runtime/tests/fixtures/council-value/dac-032.ts:1]

## Edge Cases

- Ambiguous input: I scoped this pass to graph-status/convergence/value test-depth claims, not every AI-council playbook scenario.
- Contradictory evidence: The feature catalog labels a manual playbook scenario as “Automated test,” while the true automated test is a separate integration file. I preserved both rather than collapsing them.
- Missing dependencies: The direct `.js` fixture path was absent; glob showed `.ts` fixtures instead, and the `.ts` file was read as fallback evidence.
- Partial success: Tests were inspected but not executed; this iteration verifies claimed coverage shape, not current pass/fail status.

## Sources Consulted

- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:337`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:357`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:373`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:399`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:409`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:211`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:236`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:265`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:281`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:20`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:37`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:40`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md:47`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md:51`
- `.opencode/skills/deep-loop-runtime/tests/fixtures/council-value/dac-032.ts:5`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Where do docs claim coverage that tests or code do/do not support?
  - Which feature catalogs or manual playbooks describe over-compressed behavior?
  - Which gaps affect deep-loop and graph workflow reliability?
- Questions answered:
  - AI-council status/convergence claims are strongly supported by active integration tests.
  - AI-council value-comparison claims are supported by an integration harness for DAC-027..032.
  - Some feature-catalog wording should distinguish manual scenario contracts from automated tests and note centralized fixture generation.

## Reflection

- What worked and why: Comparing playbook cross-reference rows with actual integration tests quickly separated real coverage from label precision issues.
- What did not work and why: The first direct fixture read used the `.js` import path and missed the `.ts` source file; a narrow glob resolved the location.
- What I would do differently: Next pass should audit system-spec-kit docs for deep-loop test cross-reference wording to see whether this “manual scenario as automated test” label pattern occurs outside AI-council.

## Recommended Next Focus

Audit cross-skill test-reference labeling patterns: feature catalogs and playbooks that label manual scenario contracts, runtime integration fixtures, and true automated tests inconsistently across system-spec-kit, deep-loop-runtime, and deep-loop-workflows.
