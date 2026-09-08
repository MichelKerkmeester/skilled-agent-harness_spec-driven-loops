# Iteration 8: Job 2 angle D — test coverage per module and the shared test lane

## Focus

Per-module coverage against the floor (happy path + one edge per public surface): colocated tests, external tests, modules with none. And who actually runs the shared test lane (child-007's CI wiring claim).

## Findings

| # | path:line | Declared purpose | Observed | Severity | Recommendation |
|---|-----------|------------------|----------|----------|----------------|
| R8-01 | `shared/utils/jsonc-strip.ts` + `shared/context-types.ts` | JSONC comment stripping; canonical context types | **Below the coverage floor**: jsonc-strip has 2 production consumers (`runtime/cli/lib/content-filter.ts:11`, `runtime/cli/core/config.ts:11`) and 0 test files anywhere (shared, runtime, CLI); context-types has 1 production consumer (frontmatter-migration.ts:15) and 0 test files. Both are small modules, but the floor is happy-path + one edge per public surface and nothing exercises them. | P2 | document: add one test each (or explicitly waive) |
| R8-02 | `.github/workflows/spec-kit-check.yml:46-47,33` | Shared package gate | **Proof of child-007's wiring claim**: the workflow builds shared (`tsc --build`, :33) and runs `npm --prefix .opencode/skills/system-spec-kit/shared test` (:47). The test lane is invoked in CI; the round-one L6 "test lane not invoked" row is closed. | P2 (verified-positive) | (none) |
| R8-03 | `shared/package.json:12` (test script) | Colocated test globs | The glob set includes `'utils/*.test.ts'` which matches **zero files** today (utils/ has no colocated tests; all utils coverage is external: path-security 2, path-containment 1, token-estimate via tree-thinning.vitest). A glob that matches nothing reads as intended coverage that does not exist. | P2 | fix: drop the `utils/*.test.ts` glob or add the missing tests (see R8-01) |
| R8-04 | coverage inventory | Per-module test presence (recount) | Colocated (10 files): config, auto-select, model-server-constants, profile, registry, parse-frontmatter, secret-scrubber, spec-doc-health, boolean-expr, socket-server. External only: chunking (1), compact-merger (2), budget-allocator (1), gate-3-classifier (2), trigger-extractor (3), unicode-normalization (2), path-security (2), path-containment (1), repo-root (4), rrf-fusion (3), token-estimate (via tree-thinning), review-research-paths (2: cli/tests/review-research-paths.vitest.ts + deep-loop artifact-root.vitest.ts), folder-scoring (2), embeddings factory/provider (via advisor parity + runtime default-model-selection). None: jsonc-strip, context-types (R8-01). | P2 (inventory) | — |
| R8-05 | `shared/predicates/boolean-expr.test.ts` + `config.test.ts` | Script-style tests | Both exist and are in the glob set; config.test.ts is the direct guard for R2-05's telemetry assertion. Verified-positive. | P2 (verified-positive) | (none) |

## Ruled out this iteration

- review-research-paths as uncovered (2 external tests — R8-04 corrects the draft; the seam's relative-require bypass is tested).
- utils/ as uncovered wholesale (three of five utils have external coverage; only jsonc-strip is bare).

## Sources Consulted

- Colocated test inventory (find shared -name '*.test.ts' — 10 files)
- Per-module external-test counts over runtime/tests + runtime/cli/tests (15 modules enumerated)
- `.github/workflows/spec-kit-check.yml:33,46-47`; shared package.json test script
- jsonc-strip + context-types consumer/test sweeps (0 test hits each; 2 and 1 production consumers)

## Assessment

- newInfoRatio: 0.65 — R8-01 (two below-floor modules) and R8-03 (no-op glob) are new; R8-02 verifies the CI wiring; R8-04/R8-05 are inventory/controls. Lower ratio reflects the coverage angle's diminishing novelty after round one's q-tests pass.

## Reflection

- Worked: separating "colocated test exists" from "module is covered" — folder-scoring/factory coverage lives outside shared; review-research-paths looked bare in the colocated list and has two external suites.
- Failed: the first per-module count misspelled glob paths (unit/ dir); corrected by direct sweeps.
- Ruled out: dist tests; archive suites.

## Recommended Next Focus

Iteration 9 (job 2, angle E + job 3): the remaining unverified surfaces — trigger-extractor/context-types semantics (round one verified trigger-extractor; context-types now needs its real role re-read since it was repointed in 009), the `types.ts` crossing-symbol inventory post-barrel (what actually crosses), and job 3: re-examine the four recorded decisions (predicates/boolean-expr citations, 2-spelling pair, advisor isolation, L4 environment) for any new evidence.
