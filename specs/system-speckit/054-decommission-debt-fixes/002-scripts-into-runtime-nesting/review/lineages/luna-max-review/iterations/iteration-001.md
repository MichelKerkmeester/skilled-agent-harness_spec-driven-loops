# Iteration 1 - correctness: workspace topology and runtime entrypoints

## Dispatcher

- Execution mode: AUTONOMOUS inline fan-out leaf; no nested executor was dispatched.
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` (`spec-folder`)
- Scope: target packet plus the bounded content-changed set in `scratch/review-scope.txt` (partition 1 of 10).

## Focus

Correctness of the selected `runtime/cli/` topology, workspace membership, package manifests, and the execution handoff’s executable paths.

## Files Reviewed

- `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`
- `scratch/inventory.md`, `scratch/path-map.json`, `scratch/execute-plan.md`, `scratch/review-scope.txt`
- `.opencode/skills/system-spec-kit/package.json`, `.opencode/skills/system-spec-kit/package-lock.json`, `.opencode/skills/system-spec-kit/tsconfig.json`
- `.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json`, `.opencode/skills/system-spec-kit/runtime/vitest.config.ts`, `.opencode/skills/system-spec-kit/vitest.config.ts`
- `.claude/SYNC.md`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`
- `.github/workflows/changed-packet-validation.yml`, `.github/workflows/command-tree-parity.yml`, `.github/workflows/markdown-link-integrity.yml`, `.github/workflows/strict-pass-freshness-report.yml`

## Findings - New

### P0 Findings

- **F001**: CLI workspace manifest was deleted instead of relocated — `.opencode/skills/system-spec-kit/package.json:6-25` — The root workspace declares `runtime/cli`, but no `runtime/cli/package.json` exists, the old `scripts/package.json` is deleted, and root test scripts still invoke `--workspace=@spec-kit/scripts`; the nested CLI cannot be addressed as the declared workspace.

### P1 Findings

- **F002**: Execution verification retains a retired compiled path — `specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/execute-plan.md:151` — The handoff still runs `runtime/cli/dist/memory/generate-context.js`, while the implementation summary identifies the shipped writer as `runtime/cli/dist/continuity/generate-context.js` at `implementation-summary.md:55-60` and the root smoke scripts use the continuity path.

## Typed Claim-Adjudication

```json
{
  "findingId": "F001",
  "claim": "The declared runtime/cli workspace has no package manifest, while the root package still targets the retired @spec-kit/scripts workspace.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/package.json:6-25",
    ".opencode/skills/system-spec-kit/package-lock.json:11-15",
    ".opencode/skills/system-spec-kit/package-lock.json:1124-1131",
    "git show b4c24846964:.opencode/skills/system-spec-kit/scripts/package.json (absent)",
    "git ls-tree b4c24846964 .opencode/skills/system-spec-kit/runtime/cli/package.json (absent)"
  ],
  "counterevidenceSought": [
    "runtime/cli/package.json",
    "a package manifest supplied through an untracked overlay"
  ],
  "alternativeExplanation": "The package manifest may have been intentionally folded into the root workspace, but the root scripts and package-lock still reference @spec-kit/scripts and no replacement package metadata was found.",
  "finalSeverity": "P0",
  "confidence": 1.0,
  "downgradeTrigger": "counterevidence"
}
```

```json
{
  "findingId": "F002",
  "claim": "The execution handoff names a memory path that no longer matches the shipped continuity writer.",
  "evidenceRefs": [
    "specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/execute-plan.md:151",
    "specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/implementation-summary.md:55-60",
    ".opencode/skills/system-spec-kit/package.json:20-23"
  ],
  "counterevidenceSought": [
    "runtime/cli/dist/memory/generate-context.js",
    "a compatibility shim at the retired memory path"
  ],
  "alternativeExplanation": "The old path could be a compatibility alias, but the current tree has continuity source and no memory directory under runtime/cli.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "counterevidence"
}
```

## Traceability Checks

- `spec_code`: fail for F001; the declared workspace topology does not resolve to a package manifest.
- `checklist_evidence`: partial; the packet records passing workspace/test evidence, but the required workspace manifest and lockfile state are inconsistent.
- `feature_catalog_code`: not applicable in this pass.
- `playbook_capability`: partial; the execution handoff contains an obsolete executable path.

## Confirmed-Clean Surfaces

- `runtime/scripts/` remains present as the separate runtime build-tooling directory, consistent with `implementation-summary.md:60-64` and the collision decision in `scratch/inventory.md:18-36`.
- The root TypeScript project reference points at `runtime/cli/tsconfig.json` (`.opencode/skills/system-spec-kit/tsconfig.json:17-20`), so the missing package manifest is not explained by a missing source tree.

## Ruled Out

- A plain old-path grep was not used as the sole proof; the workspace manifest, lockfile, tree listing, package deletion, and executable handoff were inspected directly.

## Assessment

Dimensions addressed: correctness, traceability. F001 is an active P0 and F002 is an active P1; no source files were modified.

## Recommended Next Focus

Security and path-resolution trust boundaries in the moved CLI, hook fallback candidates, and fixed-depth root calculations; re-check F001/F002 against any newly discovered package or compatibility evidence.

Review verdict: FAIL
