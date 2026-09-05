# Iteration 006: Import Direction And Root Resolution

## Dispatcher
- Executor: inline detached OpenCode lineage, `cli-opencode model=llmgateway/gpt-5.6-luna`.
- Write surface: lineage directory only.
- Budget profile: verify.

## Files Reviewed
- `.opencode/skills/system-spec-kit/runtime/cli/evals/import-policy-rules.ts:16-31,81-89`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/import-policy-rules.vitest.ts:6-36`
- `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-registry.ts:30-160`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-registry.vitest.ts:31-55`
- `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:962-971`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:243-257`
- `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:71-77,233-247`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts:10-16,48-84`

## Findings - New
### P1 Findings
1. **Nested import and resolver behavior is source-supported but not replayed** -- `.opencode/skills/system-spec-kit/runtime/cli/evals/import-policy-rules.ts:22-31` -- the policy correctly distinguishes one-level CLI-internal `lib`/`core` from two-level escapes and keeps `handlers`/`shared` broad, while the root registry covers current CLI and runtime consumers. The moved-tree policy and resolver tests remain unexecuted in this lineage.
- Finding class: matrix/evidence
- Scope proof: Direct read of policy implementation, all policy fixtures, resolver inventory and existence assertion.
- Affected surface hints: ["import policy", "root resolver registry", "nested CLI"]
- Claim adjudication: {"type":"claim-adjudication","claim":"The nesting-specific import and root-resolution changes behave correctly","evidenceRefs":["runtime/cli/evals/import-policy-rules.ts:22-31","runtime/cli/tests/import-policy-rules.vitest.ts:15-36","runtime/cli/core/spec-root-registry.ts:30-160"],"counterevidenceSought":"Compared policy regex semantics to every current fixture and checked registry paths by direct source inspection.","alternativeExplanation":"The source and fixtures may be aligned while a runtime resolver path still fails under compiled or symlinked execution.","finalSeverity":"P1","confidence":0.86,"downgradeTrigger":"Authorized AST, resolver and root-registry suites pass against the current build."}

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `import-policy-rules.ts:22-31` | Source policy describes the nesting decision. |
| checklist_evidence | partial | hard | `spec-root-registry.vitest.ts:46-55` | Existence and coverage checks exist but are not replayed. |
| feature_catalog_code | partial | advisory | `spec-root-registry.ts:30-160` | Registry is current for listed consumers, with runtime entries outside CLI. |
| playbook_capability | partial | advisory | `workflow-invariance.vitest.ts:48-84` | Fixture roots use runtime/cli, but execution is pending. |

## Integration Evidence
- `graph-metadata-parser.ts:962-971` now includes both `runtime` and `runtime/cli` workspace roots, but also retains a separate `scripts` root.
- `orchestrator.ts:71-77` resolves validator assets under `runtime/cli`.
- `factory.ts:243-257` detects package root through `runtime/cli` and `shared` landmarks.

## Edge Cases
- The import policy fixture `../../core` is intentionally treated as a runtime escape because the CLI's own `core` is one level below the test file. The regex comment and fixtures agree.
- `runtime/lib/graph/graph-metadata-parser.ts:967` retains `path.join(systemSpecKitRoot, 'scripts')`, which may be a compatibility root for old metadata rather than a live workspace. It is recorded for final adversarial review, not raised as a new P1 without a failing consumer.

## Confirmed-Clean Surfaces
- Resolver inventory entries contain required fields and the test checks both path existence and coverage gaps at `spec-root-registry.vitest.ts:46-55`.
- Shared root detection no longer requires a `runtime/database` directory at `factory.ts:246-253`.

## Ruled Out
- A broad policy regression that permits all relative runtime imports: ruled out by the explicit package and relative fixture matrix at `import-policy-rules.vitest.ts:6-36`.

## Next Focus
- dimension: correctness
- focus area: external consumers, CI workflow paths, hooks and worktree provisioning
- reason: inspect path consumers beyond the package's own source tree
- rotation status: new angle
- blocked/productive carry-forward: source-level import analysis productive; command replay pending
- required evidence: workflows, plugins, doctor routes, worktree session helper and hook configs
- recovery note: none

Review verdict: CONDITIONAL
