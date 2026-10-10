# Deep Review — Iteration 8

## Dimension

Correctness, narrowed to phase 016 children 001 through 004. This was a static source and test review; tests were not run.

## Files Reviewed

- [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting/spec.md:1]
- [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:302]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:49]
- [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata/spec.md:1]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1002]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts:98]
- [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups/spec.md:1]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:181]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:342]
- [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening/spec.md:1]
- [SOURCE: .github/workflows/trigger-index-rebuild.yml:54]
- [SOURCE: .github/workflows/trigger-index-rebuild.yml:138]
- [SOURCE: .github/workflows/trigger-index-rebuild.yml:139]
- [SOURCE: .github/workflows/trigger-index-rebuild.yml:143]
- [SOURCE: .github/workflows/README.md:50]

## Findings by Severity

### P0

None.

### P1

#### R8-P1-001 — Retry ignores a failed generator before its index-only check

- File: .github/workflows/trigger-index-rebuild.yml:138
- Evidence: The retry shell sets -u and pipefail but not -e at line 54. It invokes the generator without checking its exit status at line 138, then runs an index-only --check at lines 139–141. The following loop checks only whether each sidecar exists at lines 143–150. If generation updates the index and then fails before refreshing an existing sidecar, the index check and file-presence checks can pass while that sidecar remains stale.
- Finding class: instance-only
- Scope proof: The initial generator runs in a separate action step. The retry invocation is the unchecked call in this workflow; its following checks do not establish sidecar freshness.
- Affected surfaces: non-fast-forward retry, trigger-index sidecars
- Recommendation: Fail the retry when generation returns nonzero, then verify all four outputs before committing.
- Claim: A nonzero retry-generation exit can be ignored, allowing a partial rebuild to pass the index-only check while an existing sidecar remains stale.
- Evidence refs: [SOURCE: .github/workflows/trigger-index-rebuild.yml:54], [SOURCE: .github/workflows/trigger-index-rebuild.yml:138], [SOURCE: .github/workflows/trigger-index-rebuild.yml:139], [SOURCE: .github/workflows/trigger-index-rebuild.yml:143]
- Counterevidence sought: The workflow's --check validates the main index, and the sidecar loop checks file existence. I did not inspect the generator's write order.
- Alternative explanation: The generator may write all outputs atomically or fail before changing the index, which would make the partial-write case unreachable.
- Final severity: P1; confidence 0.82.
- Downgrade trigger: Downgrade if the generator is shown to write all outputs atomically and leave no partial sidecar state on a nonzero exit.

### P2

None.

## Traceability Checks

- Core spec-to-code: checked the four scoped claims against their implementations. The retry generator failure path is the one confirmed mismatch.
- Checklist evidence: relevant tests were inspected statically. They were not executed.
- Overlay protocols: not assessed in this correctness pass.

## Verdict

One P1 finding makes this iteration conditional.

## Next Dimension

Defer focus selection to the next dispatch. Do not repeat this correctness pass on children 001 through 004; the remaining dispatch budget is two iterations.

Review verdict: CONDITIONAL
