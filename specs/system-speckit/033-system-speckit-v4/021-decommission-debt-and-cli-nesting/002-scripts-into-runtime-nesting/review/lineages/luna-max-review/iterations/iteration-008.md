# Iteration 8 - correctness: moved test-harness roots and generated paths

## Dispatcher

- Execution mode: AUTONOMOUS inline fan-out leaf; no nested executor was dispatched.
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` (`spec-folder`)
- Scope: bounded content-changed set in `scratch/review-scope.txt` (partition 8 of 10, lines 295-336), with a targeted re-read of moved test harnesses and their referenced roots.

## Focus

Whether tests moved into `runtime/cli/tests` resolve their package root, shared build output, fixtures, and generated modules from the new nesting, or preserve assumptions from the retired `scripts/tests` location.

## Files Reviewed

- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-embeddings-factory.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/README.md`
- `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/README.md`
- `.opencode/skills/system-spec-kit/shared/dist/`
- `.opencode/skills/system-spec-kit/runtime/cli/dist/`
- `scratch/review-scope.txt` partition 8

## Path Resolution Evidence

- `runtime/cli/tests/test-embeddings-factory.js:13-14` documents consolidation to `shared/`, but calculates `path.join(__dirname, '../../shared/dist')`. From `runtime/cli/tests`, that resolves to `runtime/shared/dist`, which is absent. The existing compiled shared output is at `shared/dist`, requiring one additional parent traversal.
- `runtime/cli/tests/test-phase-validation.js:13-20` calculates the repository root at the moved depth, then uses the singular `.opencode/skill/system-spec-kit` directory and the retired `scripts/spec` and `scripts/tests/fixtures` subtrees. The singular skill directory, `scripts/spec/validate.sh`, and `scripts/tests/fixtures` are absent in this checkout; the moved runtime uses `.opencode/skills/system-spec-kit` and `runtime/cli`.
- `runtime/cli/tests/manual-playbook-runner.js:7-13` has the same singular `.opencode/skill` suffix in its `cwd` detection, but its fallback uses `.opencode/skills/system-spec-kit`. This is a compatibility smell, not a separate failure, because the normal fallback still identifies the current skill root and the report path is an intentional historical fixture target.
- `runtime/cli/tests/test-scripts-modules.js:16-18,2936-2947` correctly establishes `SCRIPTS_DIR` as `runtime/cli/dist`, then constructs the T233 path as `SCRIPTS_DIR/dist/wrap-all-templates.js`. Both the direct and doubled-dist locations are absent, and no matching `wrap-all-templates` artifact was found beneath `runtime/cli` in the checked tree; the test therefore takes its `dist not built` skip path even when the path contract itself is stale.

## Finding Evidence

Finding ID F009, severity P1: the moved CLI test harness retains retired package roots and an extra generated-output segment. The phase-validation and embeddings tests cannot resolve their declared dependencies after relocation, while the wrap-all-templates check can silently skip the shipped-path assertion. This leaves relocation regressions either failing for the wrong reason or untested.

## Typed Claim-Adjudication

```json
{
  "findingId": "F009",
  "claim": "The moved CLI test harness retains retired package roots and an extra dist segment, so phase validation and embeddings checks cannot resolve their dependencies and the wrap-all-templates coverage test can silently skip the shipped-path check.",
  "evidenceRefs": [
    "runtime/cli/tests/test-embeddings-factory.js:13-14",
    "runtime/cli/tests/test-phase-validation.js:13-20",
    "runtime/cli/tests/test-scripts-modules.js:16-18,2936-2947",
    "runtime/shared/dist absent; shared/dist present",
    "retired scripts/spec and scripts/tests/fixtures paths absent"
  ],
  "counterevidenceSought": [
    "a compatibility symlink or generated package root at .opencode/skill/system-spec-kit",
    "a build step that materializes runtime/shared/dist or the retired scripts test tree",
    "a current wrap-all-templates artifact under the doubled dist path"
  ],
  "alternativeExplanation": "These files may be legacy manual harnesses outside the standard test command, but their own entrypoints and assertions present them as executable verification surfaces; no compatibility tree or materializing build step was found.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "counterevidence"
}
```

## Traceability Checks

- `spec_code`: fail remains active for F001; these harnesses add independent consumers of the incomplete nested package contract.
- `checklist_evidence`: fail for F009; the moved test evidence cannot be replayed from the paths recorded in the harnesses.
- `feature_catalog_code`: partial; most maintained CLI tests use `runtime/cli`, but these moved legacy harnesses still encode the retired tree.
- `playbook_capability`: fail; a test run can report a dependency/path failure or a skip instead of exercising the moved implementation.

## Confirmed-Clean Surfaces

- The ordinary TypeScript/Vitest files inspected in this partition use the `runtime/cli` location or synthetic paths explicitly marked as fixtures.
- `manual-playbook-runner.js` has a correct `.opencode/skills` fallback, so its singular suffix was not promoted to an additional finding.
- F009 is separate from F003: F003 concerns root Vitest discovery, while F009 concerns path correctness inside individual moved harnesses.

## Ruled Out

- No compatibility package or symlink was found that would make the singular `.opencode/skill` path valid.
- No current generated module was found at either the direct or doubled `wrap-all-templates` output path, so the observed issue is a stale test path/skip contract rather than a confirmed production module import failure.

## Assessment

Dimensions addressed: correctness of moved test entrypoints and maintainability of generated-output assertions. F009 is an active P1; F001, F003, F004, F005, F006, F007, and F008 remain active.

## Recommended Next Focus

Review the remaining test and fixture files for stale documentation, manual execution roots, and old-path strings that are executable rather than synthetic data; then perform a final adversarial rescan across all ten scope partitions.

Review verdict: FAIL
