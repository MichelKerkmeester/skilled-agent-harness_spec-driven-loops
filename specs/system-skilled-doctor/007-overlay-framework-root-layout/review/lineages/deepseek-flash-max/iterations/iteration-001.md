# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `deepseek-flash-max`, cli-mistral-vibe, model `deepseek-flash`)
- Session: `fanout-deepseek-flash-max-1795192401900-xpt66n`, generation 1, lineageMode `new`
- Iteration: 1 of 24
- Dimension: correctness
- Frontier node: F-1-002 (depth 1 of 3), scope `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/commands/doctor/scripts/tests`
- Review target: `specs/system-skilled-doctor/007-overlay-framework-root-layout` (spec-folder)
- Operator review focus: follow-up round after remediation. This iteration addressed the focus by re-verifying every prior-generation engine finding against the current tree rather than against the remediation commit message, then reviewing the new branches for regression.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:426-505` (`resolveOverlayDir`, `gitTopLevelOrNull`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:508-530` (`createContext`, `overlayOutside`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:272-300` (`writeFileAtomic`, `ensureSymlink`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3425-3475` (`layoutMoves` and its JSDoc)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3660-3712` (LAYOUT lines and the overflow remedy)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4624-4700` (`writeBackup`, split passes)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5586-5630` (`strictWriteRefusal`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6293-6600` (`relayoutLinkTargets`, `planRelayoutManifest`, `writeRelayoutManifest`, `retargetRelayoutLink`, `rollbackRelayout`, `relayoutUnderLock`)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1150-1240` (relayout rollback tests)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:760-870` (outside-repository refusal tests)
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87-96,118`
- `.skilled/skills/system-skilled-doctor/references/overlays.md:76,92,96,228,257`
- `git show 3aab896957e` (the remediation commit)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A sibling link that resolves back inside the tree is refused with the wrong reason** -- `.skilled/commands/doctor/scripts/overlay-engine.cjs:478` -- `resolveOverlayDir` accepts a `../<name>` sibling only when it resolves outside the tree (`:466`). When the sibling is a symlink whose target resolves *inside* the tree, the `isWithin` guard at `:466` is false, so the sibling branch is skipped and control reaches the fall-through throw at `:478`, which reports `names a folder outside the tree root`. The folder is inside the tree, not outside it, so the operator is told to look for a path escape that is not there. The refusal itself is correct; only the reason is wrong.
   Finding class: misleading-diagnostic
   Scope proof: the branch is reachable from the documented setting contract, which allows `../<name>` (D2) and does not forbid a link; the sibling branch at `:452-477` is the only place a `../` value can be accepted, and every path through it that does not `return` lands on `:478`.
   Affected surface hints: `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs`, `.skilled/skills/system-skilled-doctor/references/overlays.md`
   Case: a tree at `<ws>/skilled` with `.skilled-overlays.json` naming `"overlayDir": "../linked"`, where `<ws>/linked` is a symlink to `<ws>/skilled/overlays`. `status` exits 2 with `names a folder outside the tree root: ../linked`, although the folder resolves inside the tree.

## Traceability Checks

- `spec_code` -- pass. D2's "may name only a direct sibling, `../<name>`" is enforced at `overlay-engine.cjs:452-477`; the outside-repository refusal the prior generation asked for is at `:470-476` and is reached from `createContext` (`:519`), so it applies to every command rather than to `pre-commit` alone. D1's `framework/` + `root/` rule is stated in the `layoutMoves` JSDoc (`:3435-3443`) and implemented by `adoptSource` (`:5542-5546`).
- `checklist_evidence` -- partial. The packet's live criteria were not re-executed in this iteration; they are scheduled for the traceability iteration. The engine's own suites were read, not run, because this lineage may not write outside its directory and the suites create fixtures under the system temp folder.

## Integration Evidence

- `.skilled/commands/doctor/scripts/overlay-engine.cjs` is the single engine the `/doctor:overlay` command surface (`apply`, `status`, `repin`, `pre-commit`, `guard`) routes through; `main` (`:6636-6667`) dispatches every one of those commands from the same `createContext`, which is why the outside-repository refusal now covers all of them.
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:87-88,96` and `.skilled/skills/system-skilled-doctor/references/overlays.md:92,96` are the two documentation surfaces that describe the LAYOUT remedies and the relayout failure contract; both were read against the engine's actual strings.

## Edge Cases

- **Prior-generation findings re-verified, all fixed.** Each was checked against the current tree, not the commit message:
  - `R1-P1-001` (relayout atomicity): fixed. `relayoutUnderLock` (`:6455-6600`) guards every rename, the manifest write and each relink inside one `try`; `rollbackRelayout` (`:6420-6443`) restores links, manifest bytes, moves and created folders newest-first. Tests at `overlay-engine-follow-up.test.cjs:1196-1226` snapshot the whole overlay folder before and after and assert deep equality plus the absence of `relayout-runs/`.
  - `R1-P2-001--6d7230d0ece0` (outside-repository refusal): fixed at `:470-476`, with tests for the outside folder, the repository's own `.git`, a link pointing outside, a tree in no repository, and a `GIT_DIR` exported by a hook (`overlay-engine-strict-writes.test.cjs:790-870`).
  - `R1-P2-001--4f4ffdfd250a` (LAYOUT remedy): fixed at `:3693-3696` and `:3700-3710`; the overflow line now splits movable from blocked.
  - `R11-P2-001` (strict-write remedy): fixed at `:5603-5615`; the remove-list case names the remove list instead of a copy apply never installs.
  - `R8-P2-001` (docs): fixed at `doctor-overlay-presentation.txt:87-88,96`.
  - `R2-P2-001--4e5c79954247` (`layoutMoves` JSDoc): fixed at `:3435-3443`.
  - `R13-P2-001` (`overlayOutside` duplicated): fixed; the context carries it (`:524`) and the four former recomputations read it (`:4631`, `:5286`, `:5884`, `:6499`).
  - `R13-P2-002` (`writeBackup` readability): fixed at `:4676-4694`; the tree pass and the overlay pass are separate loops.
- **`remove` on a `directory` entry is inert but not refused.** `folderEntryHolding` (`:3945-3960`) honours `entry.remove` for both `directory` and `skill-root` scopes, while `planDirectoryOverlay` (`:1917-2000`) mirrors the whole folder and never reads `remove`. The documented contract names `remove` as a skill-root field (`references/overlays.md:76,228`), so this is a latent inconsistency rather than a defect; recorded, not raised.
- **A backup failure is outside the documented failure contract.** `copyForBackup` (`:6455-6470`) runs before the guarded block, so a failure there exits 2 through `main`'s catch (`:6661-6665`) with a raw `[overlay-engine]` line and leaves a partial `relayout-runs/<stamp>/`. Nothing has moved, so no copy is at risk; recorded as an edge case because the docs promise the one-line contract only for a move, manifest or relink failure.
- **Scope gate.** The prior generation's fan-out root failed the `scope` terminal gate because a fan-out lineage never records `reviewScopeFiles`. This lineage seeds it in `deep-review-config.json` (`.skilled/commands/doctor`, `.skilled/skills/system-skilled-doctor`, `barter/ai-speckit`) so the gate can judge the findings this run actually raises. The workflow defect itself is out of this packet's scope and is not raised as a finding.

## Confirmed-Clean Surfaces

- `rollbackRelayout` ordering: links are restored before the moves they point at, which is safe because `ensureSymlink` (`:290-298`) unlinks and re-creates without requiring the target to exist, and the moves are restored immediately after.
- `retargetRelayoutLink` (`:6381-6397`) records a change in `retargeted` after the unlink and before the new link, so a failed `symlinkSync` still leaves the rollback able to restore the old link.
- `writeFileAtomic` (`:272-288`) writes a temp file and renames, so a throw leaves the manifest bytes untouched and `isManifestWritten` correctly stays false.
- `pruneEmptyParents` runs only after the guarded block succeeds, so a rollback never has to recreate a folder the run removed.
- `strictWriteRefusal`'s `isUnder` closure is used with `Array.prototype.some`, which passes extra arguments that the closure ignores; the replace-list check and the remove-list check therefore compare the same way.

## Ruled Out

- **Relayout can still leave a half-moved folder.** Ruled out: every mutating step is inside the `try` at `:6534-6560`, and the only steps outside it are the backup copies, which run before the first rename.
- **The outside-repository refusal is bypassable through a symlink.** Ruled out: `canonicalPath` resolves the longest existing prefix (`:384-400`), and the test at `overlay-engine-strict-writes.test.cjs:838-850` covers a link pointing outside the repository.
- **`overlayOutside` is stale after a setting change mid-run.** Ruled out: `createContext` is the only producer and every command builds one context per run.
- **The LAYOUT overflow line can advise relayout for a blocked move.** Ruled out: `:3700-3710` partitions `hidden` into `blocked` and `movable` and names each remedy for its own count.

## Next Focus

- Dimension: security
- Frontier node: F-1-002 (engine path safety and remedies)
- Focus area: `.skilled/commands/doctor/scripts/overlay-engine.cjs` path containment, the setting reader, and the guard/pre-commit trust boundary
- Reason: correctness is clean apart from one diagnostic; the same code is the trust boundary for a consumer's overlay folder, so containment and refusal paths need their own pass.
- Rotation status: correctness complete for F-1-002; security next on the same node.
- Blocked/productive carry-forward: none blocked. The `resolveOverlayDir` diagnostic finding is productive for the security pass because the same branch decides containment.
- Required evidence: `isWithin`, `canonicalPath`, `canonicalPathWithoutLeaf`, `resolveRemoveRootPath`, `isProtectedReadPath`, and the `guard`/`pre-commit` entry points.

Review verdict: PASS
