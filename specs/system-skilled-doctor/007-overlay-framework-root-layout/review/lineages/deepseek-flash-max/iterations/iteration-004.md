# Review Iteration 004

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-003` at depth 1 of 3
- Dimension: security
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its path-safety clause: whether an `overlayDir` can steer the engine outside the tree or the repository, whether a manifest path can escape the overlay folder, and whether the stage folder and the write guards fail closed.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:426-470` (`resolveOverlayDir`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:675-681` (`sourceRelative`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6082-6091` (`containedOverlayPath`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5136-5151` (`stageFolderProblem`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5528-5570` (`strictWriteRefusal`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4128-4160` (`commandGuard` ownership loop)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:165-235` (`isWithin`, destination and removal guards)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4054` (destination escape refusal)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5790-5820` (`stagedUnownedChanges` repository boundary)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:105-205` (sibling accept/refuse matrix and link cases)
- `.skilled/skills/system-skilled-doctor/references/overlays.md:51,96,259`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/spec.md:132,202,226`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/acceptance-criteria.md:67`

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
| `spec_code` | pass | `001-engine-out-of-tree-overlay-folder/spec.md:132`; `overlay-engine.cjs:5790-5820`; `overlays.md:51` | REQ-008 scopes the same-repository refusal to pre-commit, the code enforces it in `stagedUnownedChanges`, and the reference documents it at that scope. The three agree. |
| `checklist_evidence` | pass | `001-engine-out-of-tree-overlay-folder/acceptance-criteria.md:67`; `scratch/evidence/after-engine-suite.txt:154-155` | AC-008 cites the two pre-commit cases by file and line, and the recorded suite output shows both passing. |

## Integration Evidence

- `resolveOverlayDir` (`overlay-engine.cjs:426-470`) is the only reader of the `overlayDir` key, and `overlay-engine-fixes.test.cjs:193-205` pins that by scanning the engine for the key and asserting every hit falls inside the function body.
- `stageFolderProblem` (`:5139-5150`) refuses a stage folder inside the tree and inside the overlay folder, testing both the lexical path and the canonical path, so a symlink into either is caught.
- `commandGuard` (`:4128-4160`) refuses an owned destination, a removal-scheduled destination, and a strict-writes violation before printing `allow`, and returns `EXIT_CONFLICT` on each.
- `references/overlays.md:51` documents the sibling rule, the refusal messages and the pre-commit repository scope; `:96` documents the relayout refusal for a `root/skilled` destination; `:259` documents the stage-folder refusal.

## Edge Cases

- **`containedOverlayPath` (`:6082-6091`) is lexical only**, while `resolveOverlayDir` resolves links. A symlink inside the overlay folder therefore passes the containment test. Recorded, not raised: `git log -S "function containedOverlayPath"` shows it came from `3d39e6a488b`, which `git merge-base --is-ancestor` places before the reviewed range `57c01fb4c11..d42bafc890c`, and its only use is `fs.renameSync` in relayout, which moves the link rather than its target.
- **`strictWriteRefusal` resolves `inputPath` against `process.cwd()`** (`:5531`), so a guard invoked from outside the tree resolves the path outside the tree and returns null. Recorded, not raised: the ownership loop above it (`:4131-4133`) uses the same base, so the whole guard shares one cwd contract, and that contract predates this change.
- **The repository-boundary refusal is conditional on a staged vendored path.** `stagedUnownedChanges` returns at `:5806` when no staged path is vendored, before the boundary check at `:5810-5818`. Recorded, not raised: with nothing vendored staged there is nothing for the gate to judge, and `references/overlays.md:51` places the refusal at the commit check rather than at resolution.
- **Tests were not re-run** for the containment reason recorded in iteration 1. The security judgement rests on the guard source and on the test source that pins it.

## Confirmed-Clean Surfaces

- The sibling gate (`:441-468`) accepts only `../<name>` with no further separator, refuses the tree's own basename, and then compares canonical paths both ways, so a link back into the tree, a case variant on a case-insensitive disk, a dangling link and a self-loop all fall through to the refusal at `:469`.
- The refusal matrix is pinned: five accepted spellings and eight refused ones (`overlay-engine-fixes.test.cjs:107-127`), plus dedicated cases for the tree's own name, a link back to the tree, a dangling link, a self-loop and a case variant (`:130-190`).
- `sourceRelative` (`:675-681`) throws when the resolved path is outside the overlay folder or is the folder itself, so every caller that reaches it fails closed rather than returning a relative path that climbs out.
- Destination traversal is refused at `:174` (`destination escapes the sync root`) and again at `:4054` per entry, and removal paths are checked both lexically and through their canonical parent at `:199` and `:229`, so a symlinked parent cannot carry a removal outside the tree.
- `strictWriteRefusal` (`:5528-5570`) returns a refusal for a new file inside an owned folder, an upstream file an entry keeps, a vendored file no overlay owns, and a new file in the vendored tree; it returns null only for a path outside the tree, a directory, a generated path, a git-ignored path, or a managed path that already exists.
- `stageFolderProblem` refuses a stage folder inside the tree or inside the overlay folder by both spellings, and refuses a non-empty or non-folder stage target.

## Ruled Out

- **A sibling `overlayDir` can point the engine at a folder outside the git repository.** Checked and ruled out as documented behavior: `references/overlays.md:51` scopes the same-repository rule to the commit check, `001-engine-out-of-tree-overlay-folder/spec.md:132` states it as REQ-008 for pre-commit, and `spec.md:226` records the operator resolution in those words. The engine refuses it at `:5810-5818` with the documented line.
- **A manifest `source`, `fragment` or `base` can escape the overlay folder.** Checked and ruled out: `containedOverlayPath` routes every one through `sourceRelative`, which throws on an escape, and `planRelayout` turns the throw into a `refuse:` problem before any write.
- **A symlinked parent can carry a removal outside the tree.** Checked and ruled out: `:229` compares the canonical parent, not just the lexical path.
- **`repin --stage` can be aimed inside the tree or inside the overlay folder.** Checked and ruled out: `stageFolderProblem` tests both spellings of both boundaries.
- **The `overlayDir` key is read anywhere but the setting reader.** Checked and ruled out: the engine-wide scan in `overlay-engine-fixes.test.cjs:193-205` asserts every occurrence sits inside `resolveOverlayDir`.

## Next Focus

- Dimension: security
- Focus area: frontier node `F-1-005` -- the three Barter hooks as a bypass surface: whether the guard core, the OpenCode plugin and the git-write gate can each be made to allow a write they should refuse
- Reason: the operator focus names hook fail-open or fail-closed behavior explicitly, and iteration 2 judged those hooks for correctness rather than for bypass
- Rotation status: second pass on F-1-005; F-1-003 keeps traceability and maintainability open, F-1-007 keeps security, traceability and maintainability open
- Blocked/productive carry-forward: productive -- reading the guard source directly found the silent skip in iteration 2, and the same three files carry the bypass question
- Required evidence: `barter-overlay-guard-core.cjs` `guard` and `matchLayout`, `barter-overlay-guard.js` `warnCoreFailure`, `barter-git-write-gate.mjs` `aiSpeckitRoot`, and the tests that pin each fail-open decision

Review verdict: CONDITIONAL
