# Iteration 13: Review-Depth v2 Coverage Claims vs Workflow-Runner Test Depth

## Focus

This iteration audited documentation claims around review-depth v2 test coverage and workflow-runner integration. It compared deep-review README/catalog/playbook claims and deep-loop-runtime test summaries against the actual review-depth convergence fixture shape identified in iteration 12.

Ambiguity note: “documentation claims” could include all review-depth v2 docs. I selected the narrow slice most likely to overstate coverage: README summaries, feature catalog validation rows, manual playbook scenario wording, and runtime integration-test documentation.

## Findings

1. The deep-review README accurately states the intended nine-gate legal-stop model, including candidate coverage and graphless fallback, and says failed gates persist `blocked_stop` with recovery focus. This is a contract claim, not a test-depth claim. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/README.md:94] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/README.md:98]
2. The deep-review quality-gates feature catalog also accurately mirrors the nine-gate event model and lists `graphlessFallbackGate` as requiring fallback ledger rows when the graph is unavailable; it does not claim an end-to-end workflow-runner test. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/quality-gates.md:27] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/quality-gates.md:38] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/quality-gates.md:41]
3. The deep-review manual playbook root over-compresses the evidence level: it says the review-depth v2 category “validate[s]” graphless fallback and stop-gate blockers, while the scenario file itself discloses that `review-depth-convergence.vitest.ts` is marked/pending workflow-runner integration and that a manual harness is required today. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/manual_testing_playbook.md:751] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:31]
4. The actual inspected review-depth convergence test checks YAML text, not workflow execution: it reads `deep_review_auto.yaml` and `deep_review_confirm.yaml` and asserts they contain `candidateCoverageGate`, `graphlessFallbackGate`, the `searchLedger` requirement, `unavailable_blocked`, and blocked-stop JSON wiring. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:20] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:22] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:24]
5. Deep-loop-runtime documentation has the clearest overstatement risk: the integration README describes end-to-end coverage that spawns `.cjs` script entry points and touches SQLite, then lists `review-depth-convergence.vitest.ts` as “review convergence signals,” while the feature catalog calls the same file “Review-depth convergence fixture coverage.” Those labels are broader than the inspected YAML-string fixture and should distinguish script-spawn tests from static workflow-contract checks. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/README.md:3] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/README.md:12] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/README.md:25] [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/script-entry-points/convergence-script.md:47] [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/coverage-graph/coverage-graph-signals.md:47]

## Ruled Out

- Treating all review-depth docs as overclaiming was ruled out. The README and quality-gates catalog describe the intended runtime contract without explicitly claiming workflow-runner test execution. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/README.md:98] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/quality-gates.md:27]
- Treating the graphless fallback TODO as hidden was ruled out. The dedicated manual scenario openly says workflow-runner integration is pending and a manual harness is required today. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:31]

## Dead Ends

- No inspected documentation proved a full automated workflow-runner test for `graphlessFallbackGate`; the closest runtime-side evidence remains YAML-contract and validator-fixture coverage.

## Edge Cases

- Ambiguous input: I limited the pass to review-depth v2 graphless fallback/test-depth claims, not all deep-review test coverage.
- Contradictory evidence: Some docs say “validate” or “end-to-end,” while the scenario and test file show a static workflow fixture plus manual harness. I preserved both and classified it as evidence-level mismatch, not a false claim across all docs.
- Missing dependencies: Code graph remained stale/untrusted; direct `Read`/`Grep` evidence was used. [SOURCE: .opencode/specs/system-speckit/004-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: Tests were inspected but not executed; conclusions are about documentation/test-shape alignment, not current test pass/fail status.

## Sources Consulted

- `.opencode/skills/deep-loop-workflows/deep-review/README.md:94`
- `.opencode/skills/deep-loop-workflows/deep-review/README.md:98`
- `.opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/quality-gates.md:27`
- `.opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/quality-gates.md:38`
- `.opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/quality-gates.md:41`
- `.opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/manual_testing_playbook.md:751`
- `.opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/review-depth-v2-rollout/stop-gate-graphless-fallback.md:31`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:20`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:22`
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:24`
- `.opencode/skills/deep-loop-runtime/tests/integration/README.md:3`
- `.opencode/skills/deep-loop-runtime/tests/integration/README.md:12`
- `.opencode/skills/deep-loop-runtime/tests/integration/README.md:25`
- `.opencode/skills/deep-loop-runtime/feature_catalog/script-entry-points/convergence-script.md:47`
- `.opencode/skills/deep-loop-runtime/feature_catalog/coverage-graph/coverage-graph-signals.md:47`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which docs describe outdated, missing, or over-compressed behavior?
  - Where do docs claim coverage that tests no longer or do not fully support?
  - Which gaps affect deep-loop workflow reliability?
- Questions answered:
  - Deep-review contract docs are mostly accurate about the gate model.
  - Runtime/manual test documentation should distinguish review-depth static workflow-contract checks from true end-to-end script/workflow execution.
  - The graphless fallback manual scenario is honest about pending workflow-runner integration, but root/index summaries can obscure that limitation.

## Reflection

- What worked and why: Comparing summary docs to the dedicated scenario and actual test file exposed where evidence-level wording diverges.
- What did not work and why: The reducer-owned strategy stayed stale, so the iteration relied on the latest synthesis recommendation.
- What I would do differently: Next pass should audit analogous documentation-vs-test-depth claims for the council graph value scenarios and status/convergence feature catalogs.

## Recommended Next Focus

Audit AI-council graph documentation/test-depth claims: compare manual playbook and feature catalog claims for status recovery, convergence safety, and value-comparison scenarios against the actual council integration/value test files.
