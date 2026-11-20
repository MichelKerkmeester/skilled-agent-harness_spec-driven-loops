# Engine out-of-tree inventory (worker A, @context on Opus, read-only)

Orchestrator spot-checks, all confirmed by reading the lines: `overlay-engine.cjs:4524-4536` (writeBackup), `:6252-6258` (relayout backup), `:4219-4228` (normalizedRelative), `tests/overlay-engine-repin.test.cjs:485` (stage beside the tree), `tests/overlay-engine-fixes.test.cjs:102-105` (refusal test), `tests/overlay-engine-fixtures.cjs:53-69` (fixture layout).

## Breaks: throws with overlayDir '../overlays'
- `:442` resolveOverlayDir refuses `../`. This is the gate that has to open.
- `:4508` backupLeaves `relativeKey(root, leaf)`, reached for the manifest and state keys.
- `:4529-4530` writeBackup `relativeKey(root, ctx.manifestPath)` and `relativeKey(root, ctx.statePath)`. Every live and staged re-pin dies before its first write.
- `:4543-4544, 4571` writeBackup writes `path.join(backupDir, rel)`. A `../` key would also write outside backupDir.
- `:5196` with `:4221-4226` rollbackUnderLock / normalizedRelative rejects `../`, so a rollback cannot restore the manifest pin or sync-state.
- `:6254, 6256, 6257` relayoutUnderLock `relativeKey(ctx.root, move.from.absolute | ctx.manifestPath | runDir)`. Every relayout dies at the backup step. Today the backup holds `runDir/<overlayLabel>/...` (`follow-up.test:1094,1098,1138-1139`).

Design note: `backup.json` keys only tree-relative paths (`:4529-4536`, `:5195`). Overlay-folder files need their own key namespace, written by writeBackup and restored by rollbackUnderLock.

## Breaks: wrong result
- `:5173-5175` stage. Only the tree is copied, and `createContext(stageDir)` resolves `dirname(stageDir)/overlays`.
  - Case A, an unrelated stage folder: `withLock` ENOENT at `:3204`, so the run fails, or it runs against a foreign `overlays/`.
  - Case B, a stage beside the tree: the staged context IS the live overlay folder. It takes the live lock, writes the live repin-runs (`:5034`, `:5062`), and once the backup is fixed it rewrites the live pin (`writePin`, `:4617`) and the live sync-state (`:645`).
  - The repin tests use exactly Case B: tree `workspace/tree`, stage `workspace/stage` (`repin.test:485,525,553,587,754,1003,1032,1055`; `follow-up.test:414,431`).
- `:5104` copyTreeForStage lock skip becomes a no-op.
- `:5707` stagedUnownedChanges. When the tree is the git top level the git path is `../overlays/...`, both pins read as empty, and the pin-change escape at `:5710` never fires, so pre-commit refuses a re-pin commit. When the tree is nested in the repo that also holds the sibling, `posix.join` normalizes the path and it works.
- `assets/doctor-overlay-repin.yaml:76`. The workflow resolves the folder itself and must resolve `../`.

## Display only (about 20 lines)
These print `../overlays/...`, relative to the tree root:
- `:477`, `:2795`, `:2958`, `:3014`, `:3021`, `:3032`, `:3576`, `:3583`, `:3910`, `:4098`, `:4828`, `:4848`, `:5048`, `:5259`, `:5462-5469`, `:5487`, `:5556`, `:5565`, `:5569`, `:6025`, `:6029`.

Tests pin this text at `sync.test:572,579,596`, `repin.test:1038-1039,1102-1103`, `strict.test:173,180,189,194,203,279,554`.

## OK or no-op
- `:457` createContext (join resolves `..`), `:651-654` sourceRelative, `:2645`, `:2652`, `:2767-2770`, `:3362-3384`, `:5382-5384`, `:5439` (allows outside paths), `:5544`, `:5564`, `:5568`, `:5923`, `:5970`, `:6262`.
- `:4670` and `:4988` become vacuous, which is harmless.
- UNCONFIRMED: whether a layout link may target a sibling overlay folder (`:2400-2520`).

## Distinct functions to change
- resolveOverlayDir
- writeBackup
- backupLeaves
- rollbackUnderLock
- repinRun, with stageFolderProblem and copyTreeForStage
- stagedUnownedChanges
- relayoutUnderLock
- optionally loadManifest's message

## Test fixtures
Run with `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs`.

- `fixtures.cjs:53-69` always puts the overlay folder at `workspace/tree/<folder>`.
- `fixes.test:102-105` asserts `../outside` and `a/../../outside` are refused. That must flip for the one-segment sibling, since both normalize to `../outside`.
- No fixture puts the folder outside the tree today.
- The other doctor scripts and `scripts/lib/**` hold no overlay-location references.
