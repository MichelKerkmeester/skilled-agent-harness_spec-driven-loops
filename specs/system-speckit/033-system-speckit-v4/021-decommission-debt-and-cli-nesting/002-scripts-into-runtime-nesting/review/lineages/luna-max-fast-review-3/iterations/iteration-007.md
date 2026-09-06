# Iteration 007 — Maintainability: generated-dist alignment

## Focus

Audit whether the moved `runtime/cli` source tree, generated output, and
source-dist alignment checks share the same package boundary.

## Sources reviewed

- `runtime/cli/package.json`
- `runtime/cli/tsconfig.json`
- `runtime/cli/evals/check-source-dist-alignment.ts`
- `runtime/cli/evals/README.md`
- `runtime/cli/lib/dist-freshness.cjs`
- `runtime/scripts/finalize-dist.mjs`
- `runtime/scripts/README.md`

## Findings

### F013 — P1: Source-dist alignment omits the moved CLI dist tree

- **Evidence:** `runtime/cli/package.json:23` invokes
  `evals/check-source-dist-alignment.ts`. The checker resolves the
  system-spec-kit root and its `DIST_TARGETS` enumerate `runtime/dist/*` and
  `scripts/dist`, but no `runtime/cli/dist` target.
- **Impact:** The checker cannot detect orphaned or stale JavaScript emitted
  by the moved CLI package. `runtime/cli/package.json:14` records freshness
  metadata but does not prune orphaned output, and `tsc --build` does not
  remove files left by deleted or moved sources. A stale CLI dist subtree can
  therefore survive the move without being covered by the package's alignment
  gate.
- **Severity:** P1 because the package's advertised source-to-dist integrity
  check excludes its primary moved runtime output.
- **Proof:** direct comparison of the CLI check script, checker target list,
  CLI compiler output directory, and the runtime finalizer's separate package
  scope.

## Coverage

- Files reviewed: 7
- New findings: F013
- Resolved findings: none
- Dimension: maintainability

## Next focus

Inspect wrapper and entrypoint ownership across `runtime/scripts`,
`runtime/cli/dist`, package manifests, and documentation to identify
remaining split-brain execution paths.

Review verdict: FAIL
