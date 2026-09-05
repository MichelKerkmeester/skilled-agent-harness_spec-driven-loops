# Iteration 6 - correctness: CI, registry, and mirror consumers

## Dispatcher

- Execution mode: AUTONOMOUS inline fan-out leaf; no nested executor was dispatched.
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` (`spec-folder`)
- Scope: bounded content-changed set in `scratch/review-scope.txt` (partition 6 of 10, lines 211-252), plus the four in-scope workflow consumers at lines 5-8.

## Focus

Whether CI installation, the live script registry, hook discovery, and runtime-mirror ownership follow the new `runtime/cli` topology and still resolve the files they advertise.

## Files Reviewed

- `.github/workflows/changed-packet-validation.yml`
- `.github/workflows/strict-pass-freshness-report.yml`
- `.github/workflows/markdown-link-integrity.yml`
- `.github/workflows/command-tree-parity.yml`
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md`
- `.opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json`
- `.opencode/skills/system-spec-kit/runtime/cli/registry-loader.sh`
- `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh`
- `.opencode/skills/system-spec-kit/runtime/cli/spec/test-validation.sh`
- `.opencode/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh`
- `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`
- `scratch/review-scope.txt` partition 6

## Consumer Evidence

- The runtime mirror synchronizer derives its repository root from the moved `runtime/cli/runtime-mirrors` location and derives hooks from the four host configurations. The hook configurations point at `runtime/dist/hooks` or `runtime/hooks`, and no stale `system-spec-kit/scripts` hook path was found. The mirror ownership logic is therefore coherent for this move.
- The workflows still execute `( cd .opencode/skills/system-spec-kit/scripts && npm ci )` (`.github/workflows/changed-packet-validation.yml:28-37` and `.github/workflows/strict-pass-freshness-report.yml:36-45`). The old `scripts/` package directory and manifest are absent, so both in-scope CI setup steps address a deleted workspace. This is a distinct CI consumer defect in addition to the root workspace/lockfile defect already recorded as F001.
- `runtime/cli/scripts-registry.json` identifies itself as the centralized catalog for dynamic discovery (`scripts-registry.json:3-5`), but twelve source entries still use `scripts/...` paths (`scripts-registry.json:25-222`). A bounded existence check found each of those paths absent while the corresponding implementation is under `runtime/cli` (for example `runtime/cli/spec/validate.sh`, `runtime/cli/spec/check-completion.sh`, `runtime/cli/setup/check-prerequisites.sh`, `runtime/cli/tests/test-validation.sh`, and `runtime/cli/check-markdown-links.cjs`). `registry-loader.sh:13-14` resolves the catalog relative to `runtime/cli`, so the stale path values are exposed by the live loader rather than being inert historical prose.
- The first and nested-changelog registry entries point at generated `runtime/cli/dist` artifacts. Those artifacts are not used as static source evidence here because build output is an environment-dependent generated surface; the twelve missing source paths are sufficient for the finding.
- `spec/validate.sh` and `spec/test-validation.sh` themselves resolve neighboring `runtime/cli` paths correctly, and the mirror synchronizer's expected-target calculation is relative and move-safe. No new mirror or hook security bypass was found.

## Finding Evidence

Finding ID F006, severity P1: the centralized script registry retains twelve deleted `scripts/...` source paths after the move. The registry loader reads this catalog from the moved CLI directory, so dynamic discovery and operator queries return non-existent entrypoints even though the implementations now live under `runtime/cli`.

Finding ID F007, severity P1: two in-scope CI workflows still install the deleted `system-spec-kit/scripts` workspace. Those setup steps fail before the workflows can validate changed packets or publish the freshness report, independently of whether the root workspace manifest is repaired.

## Typed Claim-Adjudication

```json
{
  "findingId": "F006",
  "claim": "The centralized script registry still advertises twelve source entrypoints below the deleted scripts tree, so the moved registry loader returns paths that do not exist under the new runtime/cli topology.",
  "evidenceRefs": [
    "runtime/cli/scripts-registry.json:25-222",
    "runtime/cli/registry-loader.sh:13-14",
    "runtime/cli/spec/validate.sh:1-24",
    "runtime/cli/setup/check-prerequisites.sh:1-55",
    "runtime/cli/tests/test-validation.sh:1-12",
    "runtime/cli/check-markdown-links.cjs:1-20",
    "runtime/cli/package.json:absent",
    "system-spec-kit/scripts/package.json:absent"
  ],
  "counterevidenceSought": [
    "a registry consumer that rewrites scripts/... entries before use",
    "a compatibility directory or package alias that materializes every advertised source path"
  ],
  "alternativeExplanation": "The registry may be historical documentation, but its own description calls it a centralized catalog for dynamic discovery and registry-loader.sh reads it as the active query source; no path-rewriting or compatibility tree was found.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "counterevidence"
}
```

```json
{
  "findingId": "F007",
  "claim": "The changed-packet-validation and strict-pass-freshness-report workflows still run npm ci from the deleted system-spec-kit/scripts directory, so both CI setup paths fail before their advertised checks execute.",
  "evidenceRefs": [
    ".github/workflows/changed-packet-validation.yml:28-37",
    ".github/workflows/strict-pass-freshness-report.yml:36-45",
    "system-spec-kit/scripts/package.json:absent",
    "runtime/cli/package.json:absent",
    "scratch/review-scope.txt:5-8"
  ],
  "counterevidenceSought": [
    "a generated compatibility package at system-spec-kit/scripts",
    "a workflow step that creates or redirects the old workspace before npm ci"
  ],
  "alternativeExplanation": "The workflow comments may describe a transitional workspace, but the checkout contains neither the old package manifest nor a redirect and the command is executed unconditionally after root installation.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "counterevidence"
}
```

## Traceability Checks

- `spec_code`: fail remains active for F001; the CI and registry consumers also contradict the packet's claimed completed move.
- `checklist_evidence`: fail for F006 and F007; the claimed verification does not establish that registry entries or CI setup commands resolve after relocation.
- `feature_catalog_code`: partial; feature-catalog references use the new runtime/cli paths, but the operational registry and workflow consumers do not.
- `playbook_capability`: fail; registry-driven discovery and the two CI gates retain retired paths.

## Confirmed-Clean Surfaces

- Hook configuration paths are consistently rooted in `runtime/dist` or `runtime/hooks` and do not reference the deleted scripts tree.
- Runtime-mirror root calculation and relative symlink target calculation are consistent with the moved directory depth.
- The moved shell wrappers use neighboring `runtime/cli` paths for their direct helper calls.

## Ruled Out

- A stale hook mirror was not found in the four configured host hook files.
- The CI failures are not caused solely by the registry: both workflows contain an independent, unconditional `cd .../scripts && npm ci`.
- Generated `dist` absence was not promoted to a source-path finding because the review did not build the environment-dependent artifact surface.

## Assessment

Dimensions addressed: correctness of CI and discovery consumers, traceability of the moved entrypoint catalog, and maintainability of runtime-owned mirror configuration. F006 and F007 are active P1 findings; F001 remains the active P0.

## Recommended Next Focus

Inspect fixed-depth relative imports, shell root helpers, and generated-output references in the remaining runtime/cli partitions for path resolution defects that are not visible in package or CI metadata.

Review verdict: FAIL
