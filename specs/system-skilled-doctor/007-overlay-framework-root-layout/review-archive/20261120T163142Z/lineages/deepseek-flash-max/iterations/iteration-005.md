# Review Iteration 005

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-005` at depth 1 of 3
- Dimension: security
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its hook clause at the bypass level: whether the guard core, the OpenCode plugin, the git-write gate and the pre-commit hook can each be steered into allowing a write they should refuse, now that the overlay folder sits beside the tree.

## Files Reviewed

- `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:1-169`
- `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:1-50`
- `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:160-215`
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:83-118`
- `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:121-155`
- `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs:147-220`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:64,108-115`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `005-barter-move-overlays-out-of-tree/spec.md:108-115`; `barter-overlay-guard-core.cjs:60-84`; `barter-git-write-gate.mjs:178-187`; `pre-commit:83-92` | All four hooks resolve the folder at the path the spec's file table names, and the guard core and the git-write gate agree on both the applied and the overlay-source copy. |
| `checklist_evidence` | partial | `005-barter-move-overlays-out-of-tree/spec.md:111`; `barter-overlay-guard.test.cjs:121-155`; `barter-overlay-guard-core.test.cjs:160` | The guard core and the plugin carry recorded evidence for their fail-open decisions; the pre-commit hook still has none, which is the test gap iteration 2 raised as `R2-P2-001`. |

## Integration Evidence

- `matchLayout` (`barter-overlay-guard-core.cjs:52-58`) accepts a layout only when the overlay folder is exactly `<parent>/overlays`, the tree holds `.skilled/commands/doctor/scripts/overlay-engine.cjs`, and the folder holds `overlay-manifest.json`. All three conditions are name-locked, so a stray folder carrying a manifest cannot steer the guard.
- `findBarterOverlays` (`:60-84`) resolves the core's own realpath and takes two candidates four levels up: `[<parent>/overlays, <tree>]` for the applied copy and `[<overlays>, <parent>/skilled]` for the overlay-source copy. Each candidate fails the other's anchor because the overlay-source copy holds no `.skilled/commands/doctor` and the applied copy is not named `overlays`.
- `guard` (`:139-158`) canonicalizes both the tree root and the target, skips a path outside the tree, and treats only exit 0 as allow. A non-zero exit carrying a `refuse:` line returns that line; any other non-zero exit throws.
- `guard` passes an absolute `targetPath` to the engine (`:150`), so the engine's cwd-relative resolution cannot be steered by the `sessionDir` the plugin supplies.
- `aiSpeckitRoot` (`barter-git-write-gate.mjs:178-187`) walks exactly five levels from the script realpath. Both copies sit five levels below their anchor (`.skilled/skills/sk-git/scripts/hooks` and `framework/skills/sk-git/scripts/hooks`), so both resolve to `<ai-speckit>` and then probe `<ai-speckit>/overlays/overlay-manifest.json`.
- `pre-commit:83-92` rewrites `TREE_ROOT` to `$TREE_ROOT/skilled` only when the sibling probe fails and an in-tree `overlays/overlay-manifest.json` exists; the engine probe that follows then fails and the hook prints `BLOCKED: the overlay engine is missing` and exits 1.

## Edge Cases

- **`sniffPayload` (`:96-121`) recognizes a fixed field list and the `*** Add|Update|Delete File:` patch form only.** A write tool whose payload uses another field name, or a patch in unified-diff form, yields no paths and the guard allows. Recorded, not raised: this is Barter overlay content that the change did not touch, and decision D6 puts overlay content beyond paths out of scope.
- **`isWriteTool` (`:88-91`) gates on a fixed alias set**, so a runtime that adds a new write tool name bypasses the guard silently. Same scope note as above.
- **`aiSpeckitRoot`'s depth-five walk returns null if the file moves**, which disables the gate rather than failing closed. Recorded, not raised: the walk predates this change, and the move to `overlays/framework/` preserved the depth deliberately.
- **Tests were not re-run** for the containment reason recorded in iteration 1. The bypass judgement rests on the hook source and on the test source that pins each fail-open decision.

## Confirmed-Clean Surfaces

- The guard core's fail-open surface is not silent: every path that can allow an edit it could not judge funnels through `warnCoreFailure` (`barter-overlay-guard.js:19-23`), which writes one stderr line naming the stage and the error.
- The plugin's `tool.execute.before` (`:33-47`) throws only on a returned refusal, so a refusal reaches the runtime as a blocked edit rather than a warning.
- `runNode` (`:123-136`) throws on `result.error`, so a timeout or a buffer overflow becomes a core failure rather than a silent allow with empty output.
- `resolveSessionPath` (`:138-140`) canonicalizes before the containment test, so a path outside the tree that links into it is still guarded, and a path inside the tree that links out is correctly skipped.
- The pre-commit rewrite block cannot be steered into skipping the gate: any rewrite that points `TREE_ROOT` at a folder without the engine exits 1 with `BLOCKED`.
- `SPECKIT_SKIP_OVERLAY_SYNC=1` is the only bypass, and both blocked paths print it as `Bypass: SPECKIT_SKIP_OVERLAY_SYNC=1`, so an operator who skips the gate is told they did.

## Ruled Out

- **A planted `overlays` folder can steer the guard core at a different manifest.** Checked and ruled out: `matchLayout` requires the folder to be exactly `<parent>/overlays`, the tree to hold the engine and the folder to hold the manifest, and `findBarterOverlays` tries only the two anchors its own realpath implies.
- **The plugin's `sessionDir` can steer the guard at a path outside the tree.** Checked and ruled out: `guard` passes an absolute target and canonicalizes it before the containment test.
- **`aiSpeckitRoot` resolves to different roots for the applied and overlay-source copies.** Checked and ruled out: both sit five levels below their anchor and both probe the same sibling manifest.
- **The pre-commit rewrite block can be steered into skipping the overlay gate.** Checked and ruled out: a rewrite that lands on a folder without the engine exits 1 with `BLOCKED`.
- **The guard core's fail-open is silent.** Checked and ruled out: `warnCoreFailure` writes a named stderr line, and `barter-overlay-guard.test.cjs:121-155` asserts exactly one stderr line and no throw.

## Next Focus

- Dimension: traceability
- Focus area: frontier node `F-1-003` -- whether the engine's `framework/` and `root/` layout matches the phase 001 and 002 specs and checklists, including the `adoptSource` naming rule, the `root/skilled` refusal and the capped LAYOUT notice
- Reason: `convergence.cjs` reports `dimensionCoverageGate` failing with `traceability` and `maintainability` missing, so the run cannot stop until both are covered
- Rotation status: third pass on F-1-003; F-1-005 keeps traceability and maintainability open, F-1-007 keeps security, traceability and maintainability open
- Blocked/productive carry-forward: productive -- reading the spec's requirement table beside the code found the LAYOUT overflow mismatch in iteration 1, and the same technique answers the traceability question
- Required evidence: `001-engine-out-of-tree-overlay-folder/spec.md` and `002-engine-framework-root-source-layout/spec.md` requirement rows, their `acceptance-criteria.md` rows, and the engine lines each row cites

Review verdict: CONDITIONAL
