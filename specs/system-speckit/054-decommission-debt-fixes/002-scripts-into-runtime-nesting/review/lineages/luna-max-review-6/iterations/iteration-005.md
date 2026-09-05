# Iteration 005: Generated Outputs And Harness Fail-Closed Behavior

## Dispatcher
- Executor: inline detached OpenCode lineage, `cli-opencode model=llmgateway/gpt-5.6-luna`.
- Write surface: lineage directory only.
- Budget profile: verify.

## Files Reviewed
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js:20-28,2936-2964`
- `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:21-85,817-942`
- `.opencode/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts` (scope-listed)
- `.opencode/skills/system-spec-kit/runtime/cli/package.json:10-24`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-embeddings-factory.cjs:13-31`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-registry.vitest.ts:31-55`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/continuity-freshness.vitest.ts:111-125`
- `implementation-summary.md:213-231`

## Findings - New
### P1 Findings
1. **Shipped-path harness correctness is not independently replayed** -- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js:2939-2946` -- the harness now fails when `anchor-generator.js` is absent, which is the correct fail-closed source behavior, but the packet's full-suite result and dist freshness claim are not replayed in this lineage.
- Finding class: test-isolation
- Scope proof: Direct read of the harness, package `pretest` script and dist-freshness source table.
- Affected surface hints: ["pretest build", "dist freshness", "legacy harness"]
- Claim adjudication: {"type":"claim-adjudication","claim":"Required compiled output is enforced by the moved shipped-path harness","evidenceRefs":["runtime/cli/tests/test-scripts-modules.js:2939-2946","runtime/cli/package.json:18-22"],"counterevidenceSought":"Checked the missing-module branch and the package pretest build chain.","alternativeExplanation":"Source is fail-closed, but a stale or misconfigured build could still fail outside this detached review.","finalSeverity":"P1","confidence":0.86,"downgradeTrigger":"Authorized execution records the harness, build and freshness outputs together."}

### P2 Findings
1. **Dist freshness source candidates intentionally retain `runtime/scripts` but current docs do not explain the distinction consistently** -- `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:55-72` -- the runtime package watches its own `scripts` source candidate while the moved CLI is `runtime/cli`; this is correct for build tooling but easy to confuse with the retired workspace name.
- Finding class: cross-consumer
- Scope proof: Direct comparison of the runtime freshness table, architecture boundary evaluator and current CLI docs.
- Affected surface hints: ["dist freshness", "runtime scripts tooling", "migration docs"]

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `runtime/cli/package.json:18-22` | Package pretest builds before legacy harness, source supports fail-closed behavior. |
| checklist_evidence | partial | hard | `implementation-summary.md:213-231` | Recorded results are detailed but not replayed here. |

## Integration Evidence
- `dist-freshness.cjs:33-53` has a current `system-spec-kit/runtime/cli` entry with default and `is-phase-parent` outputs.
- `test-scripts-modules.js:2942-2946` fails rather than skips when its required output is missing.

## Edge Cases
- The current checkout has no generated `runtime/cli/dist/continuity/generate-context.js` according to direct path inspection, so source-only reads cannot validate compiled entrypoints.
- The test harness itself is ESM package-compatible through `createRequire` at lines 6-9.

## Confirmed-Clean Surfaces
- `runtime/cli/package.json:18-22` places the legacy harness behind `pretest` build execution.
- `spec-root-registry.vitest.ts:46-55` includes an existence assertion and registry gap assertion.

## Ruled Out
- Silent missing-module skip in the reviewed shipped path: ruled out by `test-scripts-modules.js:2942-2946`.

## Next Focus
- dimension: correctness
- focus area: import direction, root discovery and resolver registry completeness
- reason: inspect path semantics that changed with nesting, beyond surface string replacement
- rotation status: new angle
- blocked/productive carry-forward: source review confirms fail-closed harness; build replay remains pending
- required evidence: import policy, package-root discovery, graph key-file roots and spec-root registry
- recovery note: none

Review verdict: CONDITIONAL
