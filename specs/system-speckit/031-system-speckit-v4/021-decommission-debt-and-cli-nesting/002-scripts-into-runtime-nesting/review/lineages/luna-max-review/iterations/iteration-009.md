# Iteration 9 - maintainability: residual tests, fixtures, and executable path strings

## Dispatcher

- Execution mode: AUTONOMOUS inline fan-out leaf; no nested executor was dispatched.
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` (`spec-folder`)
- Scope: bounded content-changed set in `scratch/review-scope.txt` (partition 9 of 10, lines 337-378), with targeted re-reads of residual test, fixture, utility, and runtime support files.

## Focus

Whether the remaining moved tests and fixtures contain additional executable relocation defects beyond F009, while separating historical fixture data and intentionally synthetic old-path strings from live path consumers.

## Files Reviewed

- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-affinity.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-writer-autosave.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/task-enrichment.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-ast-parser.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-bug-regressions.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-dist-freshness.sh`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-embeddings-behavioral.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-export-contracts.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-five-checks.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-frontmatter-backfill.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-integration.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-memory-quality-lane.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-naming-migration.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-subfolder-resolution.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-utils.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json`
- `.opencode/skills/system-spec-kit/runtime/cli/types/README.md`
- `.opencode/skills/system-spec-kit/runtime/cli/utils/README.md`
- `.opencode/skills/system-spec-kit/runtime/cli/utils/template-structure.js`
- `.opencode/skills/system-spec-kit/runtime/cli/validation/README.md`
- `.opencode/skills/system-spec-kit/runtime/cli/validation/generated-metadata-drift.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/validation/generated-metadata-integrity.ts`
- `.opencode/skills/system-spec-kit/runtime/data/README.md`
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`
- `.opencode/skills/system-spec-kit/runtime/lib/MODULE-MAP.md`
- `.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs`
- `scratch/review-scope.txt` partition 9

## Residual Review

- `test-dist-freshness.sh` uses the current `runtime/lib` source and `runtime/dist` artifact, and its rebuild command targets the current runtime package. The root and artifact relationship is coherent for the maintained runtime surface.
- `test-phase-system.sh` copies current `runtime/cli/spec`, `runtime/cli/lib`, and `runtime/cli/templates` fixtures into its temporary repository. Its `runtime/cli` paths are consistent with the moved layout and are not another instance of F009.
- `test-folder-detector-functional.js` and `test-subfolder-resolution.js` derive `runtime/cli/dist` from their test directory and use the expected repository depth. Their synthetic spec-path values are test inputs.
- `test-naming-migration.js` contains retired `scripts/...` values as migration fixtures and expected historical input, not as filesystem lookup roots. The naming assertions intentionally test conversion of those values.
- The remaining Vitest and JavaScript files inspected in this partition resolve production modules through `runtime/cli`, `runtime`, `shared`, or the dedicated deep-loop skill. Old-path strings found in data fixtures and assertions are synthetic, and no additional live path consumer was established.
- The `types`, `utils`, `validation`, runtime-data, hook, and module-map documentation surfaces retain some old topology prose, but that residue is covered by F005's moved-package documentation finding; no separate impact was needed.

## Findings

No new finding was admitted. F009 remains the active correctness finding for the specific harnesses whose paths resolve to absent roots; the other residual old-path strings were confirmed as fixture inputs, assertions, or already-covered documentation residue. F001 through F009 remain active.

## Traceability Checks

- `spec_code`: fail remains active for F001; no new production root consumer was found in this partition.
- `checklist_evidence`: fail remains active for F001/F009; residual tests do not provide evidence that would close either finding.
- `feature_catalog_code`: partial; current runtime paths are used by the inspected executable tests, while F005 covers stale moved documentation.
- `playbook_capability`: partial; current runtime and hook paths are coherent, but the active harness defects still reduce replay confidence.

## Confirmed-Clean Surfaces

- Runtime dist-freshness, phase-system, folder-detector, and subfolder-resolution path calculations match the moved `runtime/cli` topology.
- `test-naming-migration.js` old paths are controlled migration corpus values, not paths opened from disk.
- No additional production hook, validation, or runtime-data path defect was established in this partition.

## Ruled Out

- A second finding for README/topology residue in the remaining support directories was not admitted because F005 already covers the same moved-package documentation contract.
- A finding for old-path strings in migration and metadata fixtures was not admitted because those strings are the explicit inputs under test and are not used as live filesystem roots.

## Assessment

Dimensions addressed: maintainability and traceability of residual test/fixture surfaces. No new findings; the active set remains F001-F009 with F001 as the blocking P0.

## Recommended Next Focus

Perform the final adversarial rescan over partition 10 and then all 420 in-scope paths, checking for missed old roots, stale generated-output references, duplicate findings, and report/state completeness.

Review verdict: FAIL
