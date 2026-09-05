# Iteration 4 - maintainability: moved-package documentation and runbooks

## Dispatcher

- Execution mode: AUTONOMOUS inline fan-out leaf; no nested executor was dispatched.
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` (`spec-folder`)
- Scope: bounded content-changed set in `scratch/review-scope.txt` (partition 4 of 10, lines 127-168), plus the moved package READMEs and their documented command consumers.

## Focus

Maintainability and operational traceability of the moved package's READMEs, directory diagrams, build commands, and related references after the `scripts/` to `runtime/cli/` move and the `memory/` to `continuity/` rename.

## Files Reviewed

- `.opencode/skills/system-spec-kit/references/config/environment-variables.md`, `.opencode/skills/system-spec-kit/references/debugging/troubleshooting.md`, `.opencode/skills/system-spec-kit/references/memory/memory-system.md`, `.opencode/skills/system-spec-kit/references/memory/save-workflow.md`, `.opencode/skills/system-spec-kit/references/memory/trigger-config.md`, `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`, `.opencode/skills/system-spec-kit/references/structure/folder-routing.md`, `.opencode/skills/system-spec-kit/references/structure/grep-convention.md`, `.opencode/skills/system-spec-kit/references/structure/phase-definitions.md`, `.opencode/skills/system-spec-kit/references/structure/sub-folder-versioning.md`
- `.opencode/skills/system-spec-kit/references/templates/level-selection-guide.md`, `.opencode/skills/system-spec-kit/references/templates/level-specifications.md`, `.opencode/skills/system-spec-kit/references/templates/template-guide.md`, `.opencode/skills/system-spec-kit/references/templates/template-style-guide.md`, `.opencode/skills/system-spec-kit/references/validation/path-scoped-rules.md`, `.opencode/skills/system-spec-kit/references/validation/phase-checklists.md`, `.opencode/skills/system-spec-kit/references/validation/template-compliance-contract.md`, `.opencode/skills/system-spec-kit/references/validation/validation-rules.md`, `.opencode/skills/system-spec-kit/references/workflows/execution-methods.md`, `.opencode/skills/system-spec-kit/references/workflows/intake-contract.md`, `.opencode/skills/system-spec-kit/references/workflows/nested-changelog.md`, `.opencode/skills/system-spec-kit/references/workflows/quick-reference.md`, `.opencode/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md`, `.opencode/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`
- `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.opencode/skills/system-spec-kit/runtime/README.md`, `.opencode/skills/system-spec-kit/runtime/api/README.md`, `.opencode/skills/system-spec-kit/runtime/api/index.ts`
- `.opencode/skills/system-spec-kit/runtime/cli/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/common.sh`, `.opencode/skills/system-spec-kit/runtime/cli/continuity/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/core/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/spec-folder/README.md`, `.opencode/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs`, `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`, `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs`, `.opencode/skills/system-spec-kit/runtime/cli/continuity/fix-memory-h1.mjs`, and the moved CLI helper files listed in the same scope partition.

## Documentation Evidence

- `runtime/cli/README.md` describes its package tree as `scripts/` and lists `memory/`, even though the moved source is under `runtime/cli/continuity/` (`README.md:56-98`). Its key-file table repeats `memory/generate-context.ts` (`README.md:115-138`).
- The same README gives `npm --prefix .opencode/skills/system-spec-kit/scripts run build` as both an entrypoint and validation command (`README.md:190-197`, `227-235`). The old directory has no package manifest, while the declared destination is `runtime/cli`; following this documented command therefore cannot address the moved workspace.
- `runtime/cli/spec-folder/README.md` repeats the obsolete build prefix at lines 85 and 126 and uses the retired shared `/tmp/save-context-data.json` example at line 97. `runtime/cli/core/README.md` retains `scripts/core/` in its overview, topology, directory tree, and build command (`core/README.md:19-24`, `63-78`, `99-132`, `198-208`).
- `runtime/cli/continuity/README.md` has the new continuity folder name but still describes dependencies as `scripts/core`, `scripts/extractors`, `scripts/loaders`, `scripts/renderers`, and `scripts/lib` (`continuity/README.md:52-83`). These paths are not the moved package's on-disk prefixes and make the import topology misleading.

## Finding Evidence

Finding ID F005, severity P1: moved-package READMEs retain the retired `scripts/` path and invalid build commands. These are user-facing operational instructions in files changed by the move, and the command examples point at a directory with no package manifest. The defect is distinct from the packet's scratch execution-plan path because it affects the package's persistent developer/operator documentation and multiple README surfaces.

## Typed Claim-Adjudication

```json
{
  "findingId": "F005",
  "claim": "Moved runtime CLI READMEs retain the retired scripts path and invalid build commands after the workspace moved to runtime/cli.",
  "evidenceRefs": [
    "runtime/cli/README.md:56-98",
    "runtime/cli/README.md:115-138",
    "runtime/cli/README.md:190-235",
    "runtime/cli/spec-folder/README.md:80-127",
    "runtime/cli/core/README.md:19-24,63-78,99-132,198-208",
    "runtime/cli/continuity/README.md:52-83",
    "runtime/cli/package.json (absent)"
  ],
  "counterevidenceSought": [
    "a compatibility package at system-spec-kit/scripts/package.json",
    "a documented alias that makes the old npm prefix resolve to runtime/cli"
  ],
  "alternativeExplanation": "The word scripts may be intended as a conceptual package label, but the README commands use it as a concrete --prefix path and the old path has no package manifest.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "counterevidence"
}
```

## Traceability Checks

- `spec_code`: fail remains active for the missing nested workspace manifest.
- `checklist_evidence`: fail for F005; the moved package's own operational documentation does not resolve to the moved package.
- `feature_catalog_code`: not applicable in this pass.
- `playbook_capability`: fail for F005 and F002; operator-facing build and execution examples retain retired paths.

## Confirmed-Clean Surfaces

- Continuity runtime entrypoint examples in `continuity/README.md:176-188` use `runtime/cli/dist/continuity/` consistently.
- The implementation summary identifies the same destination and continuity writer, so the stale README commands are documentation residue rather than uncertainty about the chosen target.

## Ruled Out

- A valid old-path package alias was not found: `scripts/package.json` is absent and the old directory contains only residual generated/link material.
- The stale README commands are not confined to historical prose; they appear in command blocks labeled entrypoints, commands, and validation.

## Assessment

Dimensions addressed: maintainability, traceability, and operator-facing command correctness. F005 is an active P1. No source or packet files were modified.

## Recommended Next Focus

Build and test topology: inspect root and nested TypeScript/Vitest configurations, package scripts, lockfile workspace links, and test discovery for silent omission of `runtime/cli` coverage.

Review verdict: FAIL
