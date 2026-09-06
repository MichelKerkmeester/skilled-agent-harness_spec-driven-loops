# Iteration 008: Test Fixtures, Legacy Vocabulary And Wrapper Boundaries

## Focus
Separate intentional fixture data from live path consumers and inspect runtime wrapper ownership after nesting.

## Sources Reviewed
- `.opencode/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts:48-84,154-184`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-utils.js:15-18`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-export-contracts.js:20-24,180-216`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js:13-16`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/validation-gate-hardening.vitest.ts:9-16`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/normalizer-lint.vitest.ts:9-12`
- `.opencode/skills/system-spec-kit/runtime/scripts/README.md:19-52`
- `.opencode/skills/system-spec-kit/runtime/scripts/finalize-dist.mjs:1-25`
- `.opencode/skills/system-spec-kit/runtime/vitest.stress.config.ts:1-30`

## Findings
### P1, Correctness
- **F015**: The reviewed test fixtures intentionally use old `scripts/*` strings as synthetic session/git history inputs, and `workflow-invariance.vitest.ts:74-84` explicitly classifies legacy phase cleanup debt. These are not live path consumers. The runtime wrapper remains distinct at `runtime/scripts/README.md:19-52`, and no wrapper ownership collision is established.

### P2, Maintainability
- **F016**: Several test names and comments still call `runtime/cli` the scripts workspace, while fixture tests intentionally use `scripts/*` historical values. Without the explicit fixture distinction used by `workflow-invariance`, a future path sweep could either rewrite test data incorrectly or miss a real consumer.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | pass | hard | `workflow-invariance.vitest.ts:74-84`; `runtime/scripts/README.md:19-52` | Fixture and wrapper boundaries are explicit. |
| checklist_evidence | partial | hard | `implementation-summary.md:89-116` | Summary explains the direction flip but not all fixture exclusions. |
| playbook_capability | pass | advisory | `runtime/scripts/README.md:44-52` | Runtime wrapper ownership is documented and distinct. |

## Assessment
- New findings ratio: 0.20
- Dimensions addressed: correctness, maintainability
- Novelty justification: this pass ruled out fixture false positives and admitted only a clarity risk around historical test data.

## Ruled Out
- `scripts/*` fixture strings as live consumers: ruled out by test setup and explicit legacy allowance.
- Runtime wrapper collision: ruled out by current `runtime/scripts` README and finalizer path.

## Recommended Next Focus
Review generated metadata, source manifests and final packet evidence for residual contradictions.

Review verdict: PASS
