# Iteration 7 - traceability: fixed-depth paths and resolver inventory

## Dispatcher

- Execution mode: AUTONOMOUS inline fan-out leaf; no nested executor was dispatched.
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` (`spec-folder`)
- Scope: bounded content-changed set in `scratch/review-scope.txt` (partition 7 of 10, lines 253-294), with a targeted re-read of the moved resolver registry and its in-scope tests.

## Focus

Whether relative path calculations in the moved CLI and the maintained inventory of spec-root resolver call sites still identify real source files, rather than retaining the old `scripts` topology.

## Files Reviewed

- `.opencode/skills/system-spec-kit/runtime/cli/core/config.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-registry.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-registry.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/architecture-boundary-enforcement.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/dist-freshness-walker.vitest.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-subfolder-resolution.js`
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/frontmatter.mjs`
- `scratch/review-scope.txt` partition 7

## Path Resolution Evidence

- `core/config.ts:75-91` walks upward to the nearest package manifest, while `core/config.ts:250` and `298-299` derive the config, template, and project-root paths from that result. With the required nested package manifest restored, those calculations resolve from `runtime/cli` to the skill root and repository root; in the current checkout they fall through to `runtime/package.json`, which is the downstream consequence already captured by F001.
- `core/workflow.ts:291-316` selects `runtime/cli/retrieval` and walks five levels from that directory to the repository root. The candidate directories and resulting depth are coherent for the moved topology. `retrieval/lookup-trigger-index.mjs:44-46` and `generate-trigger-index.mjs:58-67` likewise resolve their data and fixture paths from the nested CLI and use the same repository depth.
- The moved test helpers generally resolve `dist` relative to `runtime/cli/tests`, and the phase-system shell test copies neighboring `runtime/cli` source files into its temporary fixture. The architecture-boundary tests use synthetic `runtime/cli` paths intentionally to exercise policy parsing; those strings are not production imports.
- `core/spec-root-registry.ts:29-169` is described as the complete maintained inventory of resolver call sites, but twelve entries still identify files under `scripts/core`, `scripts/spec-folder`, `scripts/extractors`, `scripts/spec`, `scripts/graph`, `scripts/utils`, or `scripts/lib`. A bounded existence check found those twelve old paths absent; the corresponding moved sources are under `runtime/cli`.
- `tests/spec-root-registry.vitest.ts:21-36` checks only non-empty fields, a broad `scripts|runtime|shared` prefix, and precedence values. It does not verify that the recorded file paths exist, so the stale inventory remains green under its current test contract.

## Finding Evidence

Finding ID F008, severity P1: the maintained spec-root resolver registry still points twelve resolver entries at the retired `scripts` tree, while the moved implementations live under `runtime/cli`. Its test checks formatting rather than target existence, so resolver-coverage evidence and any review or audit based on this inventory can silently refer to files that are no longer present.

## Typed Claim-Adjudication

```json
{
  "findingId": "F008",
  "claim": "The maintained spec-root resolver registry still points twelve resolver entries at the retired scripts tree, so the registry and its coverage tests cannot identify the moved runtime/cli call sites.",
  "evidenceRefs": [
    "runtime/cli/core/spec-root-registry.ts:29-169",
    "runtime/cli/tests/spec-root-registry.vitest.ts:21-36",
    "runtime/cli/core/config.ts:75-91,250,298-299",
    "runtime/cli/core/workflow.ts:291-316",
    "runtime/cli/retrieval/generate-trigger-index.mjs:58-67",
    "twelve registry paths absent under system-spec-kit/scripts"
  ],
  "counterevidenceSought": [
    "a generator that rewrites the registry paths before consumers use them",
    "a compatibility source tree that materializes the twelve retired paths",
    "a test that resolves each inventory entry to an existing source file"
  ],
  "alternativeExplanation": "The registry may be intended only as historical evidence labels, but its module documentation calls it a complete maintained inventory and its tests present it as a valid coverage contract; no rewrite or compatibility tree was found.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "counterevidence"
}
```

## Traceability Checks

- `spec_code`: fail remains active for F001; the root-resolution calculation also remains dependent on the absent nested manifest.
- `checklist_evidence`: fail for F008; the resolver inventory passes shape checks without proving that its file anchors resolve after relocation.
- `feature_catalog_code`: partial; feature-catalog tables mostly use runtime/cli paths, but the executable inventory is stale.
- `playbook_capability`: fail; a coverage audit driven by `SPEC_ROOT_RESOLVERS` can report evidence for nonexistent source paths.

## Confirmed-Clean Surfaces

- Retrieval index path and repository-root depth calculations are internally consistent for `runtime/cli/retrieval`.
- The direct relative imports used by the inspected CLI tests point at neighboring `runtime/cli` source or generated-output locations.
- The fixed-depth root defect in `config.ts` is coupled to F001 rather than being admitted as a duplicate finding.

## Ruled Out

- Synthetic old-path strings in architecture-boundary and graph-metadata fixture tests are test inputs, not runtime path consumers.
- No additional production relative-import defect was established in the inspected retrieval or test helper files.

## Assessment

Dimensions addressed: traceability of resolver coverage and correctness of fixed-depth path derivation. F008 is an active P1; F001, F003, F004, F005, F006, and F007 remain active.

## Recommended Next Focus

Audit the remaining test harnesses, generated-output checks, and fixture roots for moved-package path assumptions, especially helpers that were formerly launched from `scripts/tests`.

Review verdict: FAIL
