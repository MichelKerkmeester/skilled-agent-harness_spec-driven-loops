# Iteration 005: Correctness, Generated Outputs And Runtime Boundaries

## Focus
Review source/dist mapping, runtime and CLI output boundaries, package freshness metadata and the moved test harness assumptions.

## Sources Reviewed
- `.opencode/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts:56-92,146-240,269-337`
- `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:21-85,143-180`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js:13-23,2936-2989`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-embeddings-factory.cjs:13-31`
- `.opencode/skills/system-spec-kit/runtime/tsconfig.json:31-63`
- `.opencode/skills/system-spec-kit/runtime/package.json:12-29`
- `.opencode/skills/system-spec-kit/runtime/cli/package.json:10-24`

## Findings
### P1, Correctness
- **F009**: Source/dist alignment now includes `runtime/cli` at `check-source-dist-alignment.ts:150-155`, and freshness metadata identifies `system-spec-kit/runtime/cli` at `dist-freshness.cjs:33-40`. The primary moved output boundary is represented consistently. However, `test-scripts-modules.js:2939-2944` still skips the shipped-path assertion whenever compiled output is absent, so the test does not fail closed on a missing required build artifact.

### P2, Maintainability
- **F010**: `test-embeddings-factory.cjs:13-31` uses `../../../shared/dist` from `runtime/cli/tests`, which resolves to `system-spec-kit/shared/dist` and is structurally correct, but its comments and variable name continue to call the moved package `scripts`. This is documentation residue rather than a path defect.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `check-source-dist-alignment.ts:150-155`; `test-scripts-modules.js:2939-2944` | Source/dist target is current, but a missing dist can be reported as a skip. |
| checklist_evidence | partial | hard | `implementation-summary.md:213-216,231-244` | Summary claims alignment and tests, but this lineage cannot replay the test behavior. |

## Assessment
- New findings ratio: 0.60
- Dimensions addressed: correctness, maintainability
- Novelty justification: current source/dist target wiring was confirmed; only skip-on-missing-output behavior was admitted.

## Ruled Out
- Runtime package accidentally compiling CLI: ruled out by `runtime/tsconfig.json:48-51` and the explicit `cli/**` exclusion.
- Embeddings harness resolving `runtime/shared`: ruled out by direct path arithmetic from `tests/`.

## Recommended Next Focus
Review relative imports, root calculations and consumers that depend on `runtime/api` or generated validation output.

Review verdict: CONDITIONAL
