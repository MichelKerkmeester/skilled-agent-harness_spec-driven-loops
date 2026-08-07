# Iteration 4: Maintainability — Tests, Fixture Honesty, Dead Code, Patterns

## Focus
Dimension: maintainability. spec.md §2.5 (tests) and §2.4 (doctrine): test vacuity, missing negative cases, fixture honesty ("does the journey proof assert what it claims?"), the watcher test's hidden cross-package dependency, silent subdir-skip patterns, and dead-code/dead-link sweep across the program's edited docs.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 5 (create-journey-proof.test.cjs, daemon-watcher-new-root-ingestion.vitest.ts, ci-leaf-manifest-freshness.cjs, ci-skill-root-metadata.cjs, lib/leaf-resource-contract.cjs)
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.60

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F006**: Watcher integration test hardcodes a cross-package chokidar path resolved relative to cwd, `system-skill-advisor/mcp-server/tests/daemon-watcher-new-root-ingestion.vitest.ts:216-218`. The "real chokidar" case resolves `join(process.cwd(), '..', '..', 'system-spec-kit', 'mcp-server', 'node_modules', 'chokidar', 'index.js')` — a dependency on a SIBLING package's `node_modules`, not the advisor's own. If `system-spec-kit` hasn't installed chokidar, or the suite is run from a different cwd, the test throws "real chokidar unavailable" and fails (or skips via the throw). This is a hidden, undocumented cross-package coupling that makes the suite's green status contingent on another package's install state. Recommend resolving chokidar from the advisor's own `node_modules` or a workspace-root resolve, and asserting the dependency in the advisor's package manifest.
- **F007**: `create-journey-proof.test.cjs` proves scaffold→gate→doctor coverage but not scaffold-vs-template equivalence, `create-skill/scripts/tests/create-journey-proof.test.cjs:57-75`. It asserts `checked=2 passed=2 failed=0 fixed=2` (scaffold + fix), `fixed=0` on re-run (freshness), and doctor exit 0 with no `FAIL:` lines. It does NOT assert that the hub scaffold's `command-metadata.json` is non-empty, nor that the scaffold's generated/authored files match the `assets/` templates byte-for-byte (spec.md §2.3 asks for "scaffold-vs-template equivalence"). The test's own claim ("scaffold-to-doctor contract coverage") is honest and proven; the gap is that the broader equivalence claim in the spec is not asserted here. Recommend adding a scaffold-vs-template diff assertion or documenting where that equivalence is proven.
- **F008**: Silent subdir-skip `catch { continue; }` is undocumented in two fleet walkers, `ci-leaf-manifest-freshness.cjs:63` (`findManifestDirs`) and `ci-skill-root-metadata.cjs:124` (`findNestedIdentities`). Skipping an unreadable subdir is defensible partial-failure tolerance (a single bad subdir shouldn't fail the whole gate), but neither call site documents the choice, and the top-level `findSkillRoots` (F001) uses the same bare-catch shape for a non-defensible case. Recommend a shared `safeReaddir` helper with a documented per-level policy (re-throw at top level, skip-and-warn for nested walks) so the silent-skip intent is explicit and the top-level case stops being silent.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | partial | advisory | n/a | Catalog claims not re-verified this pass; deferred. |
| playbook_capability | partial | advisory | n/a | Playbook scenarios not re-verified this pass; deferred. |

## Assessment
- New findings ratio: 0.60 (3 new P2 across 5 files — highest ratio, concentrated in test/fixture honesty)
- Dimensions addressed: maintainability
- Novelty justification: All four dimensions are now covered. The findings are test-honesty and pattern-consistency issues, not dead code. No dead code found: every exported symbol in the contract libraries is consumed by the gate, generator, or tests; the `OVERLAY_FILES` empty mechanism is intentionally retained (documented).

## Ruled Out
- "Dead code in the contract libraries": ruled out — `OVERLAY_FILES` (empty) is a deliberately-retained extension mechanism (documented at skill-root-metadata-contract.cjs:109-123); all other exports are consumed.
- "Watcher test vacuity": ruled out — `daemon-watcher-new-root-ingestion.vitest.ts` is thorough: shallow-root-watch, addDir ingestion, nested-dir ignore, real-chokidar end-to-end, delete/recreate cycle symmetry, and unlinkDir retirement are all asserted. The single issue is the cross-package chokidar path (F006), not vacuity.

## Dead Ends
- Searched for missing negative test cases in `command-metadata-schema.cjs`'s validator; the schema test suite (`skill-root-metadata-contract.test.cjs`, `leaf-resource-contract.test.cjs`) covers malformed/missing/forbidden/nested-identity cases. Negative coverage is adequate.

## Recommended Next Focus
Iteration 5 (broaden angles): CI/hooks wiring (spec §2.6) — `routing-registry-drift.yml` trigger coverage and `pre-push` skill-metadata gate semantics — plus a cross-cutting recheck of the highest-blast-radius item (the CI trigger gap for `command-metadata.json`).

Review verdict: PASS
