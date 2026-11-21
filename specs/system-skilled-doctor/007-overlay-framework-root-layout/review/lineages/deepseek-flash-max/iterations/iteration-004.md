# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `deepseek-flash-max`, cli-mistral-vibe, model `deepseek-flash`)
- Session: `fanout-deepseek-flash-max-1795192401900-xpt66n`, generation 1, lineageMode `new`
- Iteration: 4 of 24
- Dimension: correctness
- Frontier node: F-1-006 (depth 1 of 3), scope `barter/ai-speckit/skilled/.skilled/commands/doctor`, `barter/ai-speckit/overlays/sync-state.json`, `barter/ai-speckit/overlays/overlay-manifest.json`
- Review target: `specs/system-skilled-doctor/007-overlay-framework-root-layout` (spec-folder)
- Operator review focus: this iteration addressed the focus's "re-pin onto b5a630c" and "leftover barter-overlays references" clauses by diffing the vendored engine-relevant files against the pin and by sweeping both repositories for the old folder name.

## Files Reviewed

- `barter/ai-speckit/overlays/overlay-manifest.json` (pin block, 134 entries)
- `barter/ai-speckit/overlays/sync-state.json` (pin, record keys)
- `barter/ai-speckit/skilled/.skilled-overlays.json`
- `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` (byte-diffed against `b5a630c6efa`)
- `barter/ai-speckit/skilled/.skilled/skills/system-skilled-doctor/references/overlays.md` (byte-diffed)
- `barter/ai-speckit/skilled/.skilled/skills/system-skilled-doctor/SKILL.md` (byte-diffed, version line)
- `barter/ai-speckit/skilled/.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` (byte-diffed)
- `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` (byte-diffed)
- `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` (byte-diffed)
- `barter/ai-speckit/.gitignore:68-69`, `barter/ai-speckit/overlays/README.md:152,458-459`
- `git -C barter/ai-speckit show 488ea9f49f5` (the re-pin commit)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The committed overlay manifest pins an absolute local checkout path** -- `barter/ai-speckit/overlays/overlay-manifest.json:7` -- `pin.checkout` is committed as `/Users/michelkerkmeester/MEGA/Development/Skilled`, one developer's working copy. The engine documents a relative form and reads it from the tree root (`references/overlays.md:128`), so a relative value would serve every clone. On any other clone the absolute path does not exist, so `status --audit` prints `no upstream checkout at the pin, so ... skipped` (`references/overlays.md:119`) and a `json-entry` drop with no readable pinned copy is refused (`references/overlays.md:62`). The manifest is a shared file, so the value travels to every developer.
   Finding class: portability
   Scope proof: the file is tracked (`git show HEAD:overlays/overlay-manifest.json` carries the absolute path), and the engine reads `pin.checkout` for the audit and for the pinned-copy restore, so the value is load-bearing rather than documentation.
   Affected surface hints: `barter/ai-speckit/overlays/overlay-manifest.json`, `barter/ai-speckit/overlays/README.md`, `.skilled/skills/system-skilled-doctor/references/overlays.md`
   Case: a second developer clones `ai-speckit` to `/home/dev/ai-speckit`. `node skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs status --audit` reports the audit skipped, and dropping a `json-entry` `set` is refused because no pinned copy can be read.

## Traceability Checks

- `spec_code` -- pass. D4 holds exactly: `barter/ai-speckit/skilled/.skilled-overlays.json` prints `{ "overlayDir": "../overlays" }` and sits inside the vendored copy. The pin is recorded in the two live places that carry it and they agree: `overlays/overlay-manifest.json:6` and `overlays/sync-state.json:3` both name `b5a630c6efaf30d36bb18e2bae875b03ab8f4600`.
- `checklist_evidence` -- pass for the Barter-side criteria. Four of the packet's six completion criteria were executed read-only in this iteration and all four pass:
  - `cat .skilled-overlays.json` prints `{ "overlayDir": "../overlays" }`.
  - `ls -d barter-overlays` fails with `No such file or directory`.
  - `status --json` reports `"result": "PASSED"` with `"offLayout": []` and 488 in-sync records.
  - `--guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 and names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`.
  The two Skilled-side criteria are scheduled for the maintainability iteration.

## Integration Evidence

- `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` is byte-identical to `.skilled/commands/doctor/scripts/overlay-engine.cjs` at `b5a630c6efa`, and the engine did not change between `b5a630c6efa` and `HEAD` (`git diff --stat` over the engine, its tests and the doctor skill is empty).
- `barter/ai-speckit/skilled/.skilled/skills/system-skilled-doctor/references/overlays.md`, `.../SKILL.md`, `.../assets/doctor-overlay-presentation.txt`, `.../tests/overlay-engine-follow-up.test.cjs` and `.../tests/overlay-engine-strict-writes.test.cjs` are each byte-identical to their `b5a630c6efa` versions.
- `barter/ai-speckit/skilled/.skilled/skills/system-skilled-doctor/SKILL.md:5` prints `version: 1.2.0.0`, matching the packet's release criterion.
- `barter/ai-speckit/.gitignore:69` carries `/overlays/relayout-runs/` beside `/overlays/repin-runs/`, and `overlays/README.md:459` lists `relayout-runs/` as a local backup folder that is not committed.

## Edge Cases

- **Prior-generation findings re-verified, all fixed.**
  - `R3-P2-001` (`relayout-runs` not ignored): fixed at `.gitignore:69` and documented at `overlays/README.md:459`.
  - `R3-P2-002` (leftover `barter-overlays` fixture name): fixed. A sweep of both repositories for `barter-overlays` outside `specs/` and `z_archive/` returns only the spec track name `skilled-barter-overlays`, which is a directory name rather than a path to the old overlay folder.
- **The re-pin commit is large by nature.** `488ea9f49f5` touches 112 files and 78k lines because it re-vendors the whole tree onto `b5a630c`. The engine-relevant subset was diffed file by file rather than judged by the commit size.
- **`overlays/repin-runs/` exists in the working tree.** It is gitignored at `.gitignore:68`, so it is local state rather than a committed artifact.
- **The guard's refusal is the new remove-list remedy.** `--guard` on `sk-git-skilled/SKILL.md` prints the branch added at `overlay-engine.cjs:5603-5615`, naming the remove list and the `../overlays/framework/...` copy path. This is the same branch iteration 1 verified as fixed, exercised here against the real Barter manifest.

## Confirmed-Clean Surfaces

- The pin is consistent across the two files that carry it, and `sync-state.json` carries the full record set (`files`, `links`, `items`, `sets`, `keys`) rather than a bare hash map.
- The vendored engine, its two remediation test suites, the doctor skill, its overlay reference and the presentation text all match the pin byte for byte, so the re-pin did not silently drop the remediation.
- `status --json` reports 488 in-sync records with no `overlay-edited`, `live-edited`, `both-changed`, `upstream-moved` or `cannot-apply` record, so the overlays apply cleanly on the new pin.
- The old `barter-overlays` folder is gone from the tree and no live file names it as a path.

## Ruled Out

- **The re-pin dropped the engine remediation.** Ruled out: the vendored engine is byte-identical to `b5a630c6efa`, which carries `3aab896957e`.
- **The pin is recorded inconsistently.** Ruled out: `overlay-manifest.json:6` and `sync-state.json:3` name the same commit.
- **A live `barter-overlays` path reference survives.** Ruled out: every remaining hit is the spec track name `skilled-barter-overlays`.
- **The overlays no longer apply on the new pin.** Ruled out: `status --json` reports PASSED with an empty `offLayout`.
- **The release version did not reach the vendored copy.** Ruled out: `SKILL.md:5` prints `version: 1.2.0.0`.

## Next Focus

- Dimension: traceability
- Frontier node: F-1-006 (re-pin parity)
- Focus area: the packet's phase 004 and 005 records against the re-pin evidence, and the two Skilled-side completion criteria
- Reason: correctness is covered for this node; the remaining question is whether the packet's own records describe the re-pin and the move accurately.
- Rotation status: correctness complete for F-1-006; traceability next on the same node.
- Blocked/productive carry-forward: the absolute `pin.checkout` finding is productive for the traceability pass because the packet's phase 005 record should say whether the checkout is meant to be committed.
- Required evidence: phase 004 and 005 `spec.md`, `implementation-summary.md` and `acceptance-criteria.md`, plus the Skilled-side release criteria.

Review verdict: PASS
