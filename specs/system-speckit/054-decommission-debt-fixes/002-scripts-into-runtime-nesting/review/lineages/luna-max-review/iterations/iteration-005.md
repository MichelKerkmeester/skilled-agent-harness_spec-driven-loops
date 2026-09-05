# Iteration 5 - correctness: build and test discovery topology

## Dispatcher

- Execution mode: AUTONOMOUS inline fan-out leaf; no nested executor was dispatched.
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` (`spec-folder`)
- Scope: bounded content-changed set in `scratch/review-scope.txt` (partition 5 of 10, lines 169-210), with direct review of root and nested build/test configuration.

## Focus

Whether the move leaves TypeScript project references, Vitest roots/include globs, package test scripts, freshness inputs, and runtime test boundaries able to discover and exercise the nested CLI.

## Files Reviewed

- `.opencode/skills/system-spec-kit/runtime/cli/core/config.ts`, `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-registry.ts`, `.opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/doctor.sh`, `.opencode/skills/system-spec-kit/runtime/cli/evals/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/evals/check-allowlist-expiry.ts`, `.opencode/skills/system-spec-kit/runtime/cli/evals/check-architecture-boundaries.ts`, `.opencode/skills/system-spec-kit/runtime/cli/evals/check-handler-cycles-ast.ts`, `.opencode/skills/system-spec-kit/runtime/cli/evals/check-no-mcp-lib-imports-ast.ts`, `.opencode/skills/system-spec-kit/runtime/cli/evals/check-no-mcp-lib-imports.ts`, `.opencode/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts`, `.opencode/skills/system-spec-kit/runtime/cli/evals/import-policy-allowlist.json`, `.opencode/skills/system-spec-kit/runtime/cli/evals/import-policy-rules.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/extractors/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/graph/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/kpi/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/lib/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`, `.opencode/skills/system-spec-kit/runtime/cli/lib/shell-common.sh`, `.opencode/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh`, `.opencode/skills/system-spec-kit/runtime/cli/lib/template-utils.sh`, `.opencode/skills/system-spec-kit/runtime/cli/loaders/README.md`
- `.opencode/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts`, `.opencode/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts`, `.opencode/skills/system-spec-kit/runtime/cli/ops/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/ops/process-memory-harness.ts`, `.opencode/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts`, `.opencode/skills/system-spec-kit/runtime/cli/optimizer/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/optimizer/replay-corpus.cjs`, `.opencode/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `.opencode/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs`, `.opencode/skills/system-spec-kit/runtime/cli/renderers/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/resource-map/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs`, `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`, `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`, `.opencode/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs`, `.opencode/skills/system-spec-kit/runtime/cli/rules/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh`, `.opencode/skills/system-spec-kit/runtime/cli/rules/check-normalizer-lint.sh`, `.opencode/skills/system-spec-kit/runtime/cli/runtime`
- `.opencode/skills/system-spec-kit/package.json`, `.opencode/skills/system-spec-kit/package-lock.json`, `.opencode/skills/system-spec-kit/vitest.config.ts`, `.opencode/skills/system-spec-kit/tsconfig.json`, `.opencode/skills/system-spec-kit/runtime/tsconfig.json`, `.opencode/skills/system-spec-kit/runtime/vitest.config.ts`, `.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json`

## Build and Test Evidence

- The root TypeScript project references `runtime/cli/tsconfig.json` (`system-spec-kit/tsconfig.json:17-20`), and the nested config includes the moved CLI source folders while excluding `tests/**/*.vitest.ts` from production compilation (`runtime/cli/tsconfig.json:20-39`). That source/build boundary is coherent.
- The root Vitest config still includes `scripts/tests/**/*.vitest.ts` and does not include `runtime/cli/tests/**/*.vitest.ts` (`system-spec-kit/vitest.config.ts:7-18`). The old test directory has zero regular test files in this checkout, while the moved `runtime/cli/tests/` contains 146 top-level Vitest suites. Root-level Vitest discovery therefore cannot exercise the moved CLI suite through its configured include globs.
- The runtime Vitest config intentionally includes `runtime/tests/**/*.vitest.ts` and excludes `runtime/cli` (`runtime/vitest.config.ts:14-23`), so it does not compensate for the root omission. The nested CLI has no local `vitest.config.*` or package manifest that supplies an alternate discovered root.
- Root `test:root` still invokes `npm run test --workspace=@spec-kit/scripts` (`system-spec-kit/package.json:19-23`), while the lockfile still maps `@spec-kit/scripts` to the deleted `scripts` directory (`package-lock.json:11-15`, `1124-1131`). This is the already-adjudicated workspace defect, but it also means the apparent test command cannot be used as evidence for CLI coverage.
- The moved freshness table points at `runtime/cli` and its current build command (`runtime/cli/lib/dist-freshness.cjs:33-52`), so freshness ownership is updated even though test discovery is not.

## Finding Evidence

Finding ID F003, severity P1: the root Vitest configuration still targets `scripts/tests` and omits `runtime/cli/tests`. Because the old directory is empty and the moved CLI contains 146 suites, a root test run can report only the generic/runtime coverage while silently skipping the relocated CLI tests. This is independent of the missing workspace manifest: even after workspace restoration, the root include contract remains stale unless a nested test configuration fully replaces it.

## Typed Claim-Adjudication

```json
{
  "findingId": "F003",
  "claim": "The root Vitest configuration still includes scripts/tests and omits runtime/cli/tests, so the moved CLI suite is not discovered by the root test configuration.",
  "evidenceRefs": [
    "system-spec-kit/vitest.config.ts:7-18",
    "runtime/vitest.config.ts:14-23",
    "runtime/cli/tsconfig.json:20-39",
    "runtime/cli/tests (146 top-level Vitest suites)",
    "scripts/tests (0 regular files)",
    "system-spec-kit/package.json:19-23"
  ],
  "counterevidenceSought": [
    "a runtime/cli-local Vitest configuration invoked by every supported test entrypoint",
    "a root test wrapper that explicitly enumerates runtime/cli/tests despite the include glob"
  ],
  "alternativeExplanation": "The nested package may be intended to own all CLI tests and the root configuration may be runtime-only, but the root test script invokes the retired scripts workspace and no nested package/config contract exists in the current tree.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "counterevidence"
}
```

## Traceability Checks

- `spec_code`: fail remains active for the declared workspace and lockfile mismatch.
- `checklist_evidence`: fail for F003; the packet reports broad test verification without a resolved proof that the moved CLI suite is discovered.
- `feature_catalog_code`: not applicable in this pass.
- `playbook_capability`: partial; freshness paths are updated, but the configured test proof does not cover the moved test root.

## Confirmed-Clean Surfaces

- TypeScript project references and nested CLI source include globs point at `runtime/cli`.
- The freshness registry and rebuild command use the nested CLI path.
- Runtime tests remain separated from CLI tests by the runtime config's explicit exclusion.

## Ruled Out

- A stale production TypeScript include was not found in the nested CLI config; its source folders are enumerated under the new root.
- The test omission is not explained by a missing test suite: 146 moved CLI Vitest files are present.

## Assessment

Dimensions addressed: correctness of build/test discovery and maintainability of the verification contract. F003 is an active P1. No source or packet files were modified.

## Recommended Next Focus

Hook, CI, and mirror consumers: inspect symlink targets, command wrappers, workflow paths, and generated mirror source/target relationships for mismatched nesting depth or stale package names.

Review verdict: FAIL
