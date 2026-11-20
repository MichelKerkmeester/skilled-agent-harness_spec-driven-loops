# Review Iteration 003

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-007` at depth 1 of 3
- Dimension: correctness
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its re-pin clause: whether the Barter tree at `ai-speckit/skilled` is a faithful copy of Skilled `063daaee2c1`, whether the pin record in `overlay-manifest.json` agrees with `sync-state.json` and the `v4.1.0.0` changelog, and whether the two overlay-owned changelog links still resolve after the move to `overlays/`.

## Files Reviewed

- `barter/ai-speckit/overlays/overlay-manifest.json` (`pin` block, 133 overlay entries, `sk-git-root` entry)
- `barter/ai-speckit/overlays/sync-state.json` (`pin`, `files` map)
- `barter/ai-speckit/overlays/framework/changelog/skilled-coder/v4.1.0.0.md:310`
- `barter/ai-speckit/skilled/.skilled/changelog/sk-git-skilled` (symlink)
- `barter/ai-speckit/skilled/.skilled/changelog/skilled-coder` (symlink)
- `barter/ai-speckit/overlays/framework/skills/sk-git/sk-git-skilled/changelog/` (link target)
- `barter/ai-speckit/overlays/framework/changelog/skilled-coder/` (link target)
- `barter/ai-speckit/overlays/README.md:60-75,440-460`
- `barter/ai-speckit/skilled/.skilled/commands/doctor/**` (317 files, compared against Skilled `063daaee2c1`)
- `barter/ai-speckit/skilled/.skilled/skills/system-skilled-doctor/**`
- `barter/ai-speckit/skilled/.skilled/hooks/overlay-guard/**`
- `barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/**`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs` (grep for `changelog`)

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
| `spec_code` | pass | `barter/ai-speckit/overlays/overlay-manifest.json` `pin`; `barter/ai-speckit/overlays/sync-state.json` `pin`; `barter/ai-speckit/overlays/framework/changelog/skilled-coder/v4.1.0.0.md:310` | The manifest pin, the sync-state pin and the changelog all name Skilled `063daaee2c19a7a8c9a0fb67f84903894bc08043`, which is the commit the phase 004 goal binds. |
| `checklist_evidence` | pass | `barter/ai-speckit/overlays/sync-state.json` `files`; `barter/ai-speckit/overlays/overlay-manifest.json` (133 entries) | `sync-state.files` holds 485 destination hashes and every one is an overlay destination; no engine file appears in it, so the record distinguishes applied overlay content from the vendored tree. |

## Integration Evidence

- Symlink-aware comparison of every file at Skilled `063daaee2c1` under `.skilled/commands/doctor`, `.skilled/skills/system-skilled-doctor`, `.skilled/hooks/overlay-guard` and `.skilled/hooks/barter-overlay-guard` against `barter/ai-speckit/skilled`: **same=317, diff=6, missing=0**.
- All six differences are overlay-owned and declared in `overlay-manifest.json`: `.skilled/commands/doctor/_routes.yaml` (`adopted-skilled-commands-doctor-routes-yaml`), `assets/symlink-manifest.json` (`doctor-symlink-manifest`), `scripts/symlink-engine.cjs` (`doctor-symlink-engine`), `scripts/tests/symlink-engine.test.cjs` (`doctor-symlink-engine-tests`), `symlink.md` (`doctor-symlink-doc`), `.skilled/skills/system-skilled-doctor/graph-metadata.json` (`system-skilled-doctor-graph-metadata-signals`, json-entry).
- The engine-relevant files are byte-identical: `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/skills/system-skilled-doctor/SKILL.md` and `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` all compare SAME.
- `.skilled/changelog/sk-git-skilled` -> `../../../overlays/framework/skills/sk-git/sk-git-skilled/changelog`, resolves to `barter/ai-speckit/overlays/framework/skills/sk-git/sk-git-skilled/changelog` (holds `v1.0.0.0.md` through `v1.1.2.0.md`).
- `.skilled/changelog/skilled-coder` -> `../../../overlays/framework/changelog/skilled-coder`, resolves to `barter/ai-speckit/overlays/framework/changelog/skilled-coder`.
- `barter/ai-speckit/overlays/framework/changelog/` holds only `skilled-coder`; the sk-git changelogs travel with the `sk-git-root` skill-root entry (`source: framework/skills/sk-git`, `destination: .skilled/skills/sk-git`). `overlays/README.md:449` documents the split as `changelog/  the skilled-coder changelog` under `framework/`, and `:445` lists the sk-git-skilled packet under `skills/`.
- `barter/ai-speckit/overlays/skilled` (the old dot-dropped path) does not exist, so no consumer is still reading the pre-move location.

## Edge Cases

- **The two overlay-owned changelog links are not engine-managed.** `grep -n "changelog" .skilled/commands/doctor/scripts/overlay-engine.cjs` returns nothing, and neither link appears as a manifest entry. Recorded, not raised: `overlays/README.md:67` lists the changelog index under a separate regeneration step, so the links belong to that step rather than to the overlay engine, and both resolve correctly today.
- **`pin.checkout` is an absolute local path** (`/Users/michelkerkmeester/MEGA/Development/Skilled`). Recorded, not raised: `git -C barter/ai-speckit log` shows it was introduced by `d10121d9af8`, before this change, and `overlays/README.md` documents that the re-pin needs the Skilled checkout at the path the manifest names.
- **Tests were not re-run** for the same containment reason recorded in iteration 1: the suites write to OS temp directories outside the lineage. Parity is judged by byte comparison against the pinned commit, which is stronger evidence for a copy-fidelity question than a test run would be.
- **The dispatch binds `maxIterations: 24` while the root `review/deep-review-config.json` says 7.** Carried forward unresolved from iteration 1; the lineage config written at init uses 24.

## Confirmed-Clean Surfaces

- The manifest `pin` block (`upstream: Skilled`, `commit: 063daaee2c19a7a8c9a0fb67f84903894bc08043`, `checkout`) and the `sync-state.json` `pin` string are identical, so the two records cannot disagree about which commit the tree came from.
- `sync-state.files` contains only overlay destinations. A vendored engine file leaking into that map would make `status` read a live edit as an overlay edit; none does.
- `overlays/framework/changelog/skilled-coder/v4.1.0.0.md:310` states the last re-pin moved the tree to Skilled `063daae` and printed `RESULT: PASSED`, which matches the pin block.
- The six declared differences are exactly the files the manifest marks as overlay-owned, so the vendored tree is the pin plus the declared overlay set and nothing else.
- Both changelog links resolve through the sibling folder, which is the layout decision D4 requires.

## Ruled Out

- **The vendored tree has drifted from Skilled `063daaee2c1`.** Checked and ruled out: 317 files compare SAME, 0 are missing, and all 6 differences are declared overlay entries.
- **`.skilled/hooks/overlay-guard/opencode/overlay-guard.js` and `.skilled/hooks/overlay-guard/vibe/overlay-guard.mjs` differ from the pin.** Checked and ruled out: both are symlinks at the pin (mode 120000) and on disk, and a plain `diff` follows them. Their targets match exactly (`../../../../.opencode/plugins/overlay-guard.js` and `../../../../.vibe/plugins/repo-guards/overlay-guard.mjs`). The apparent difference was an artifact of the comparison, not drift.
- **The changelog split leaves the sk-git changelogs unreachable.** Checked and ruled out: they live under `framework/skills/sk-git/sk-git-skilled/changelog`, the `sk-git-root` entry carries them, and `.skilled/changelog/sk-git-skilled` resolves to that folder.
- **A stale `overlays/skilled` path survives the move.** Checked and ruled out: the directory does not exist.

## Next Focus

- Dimension: security
- Focus area: frontier node `F-1-003` -- path safety in the engine: the `resolveOverlayDir` sibling gate, `containedOverlayPath`, `sourceRelative` and `strictWriteRefusal`
- Reason: F-1-003 correctness is complete and its security dimension is the highest-risk remaining pass, because decision D2 makes the sibling gate the only thing keeping an `overlayDir` from naming a folder outside the repository
- Rotation status: second pass on F-1-003; F-1-005 and F-1-007 keep their remaining dimensions open
- Blocked/productive carry-forward: productive -- reading the engine's path helpers directly found the relayout invariant gap in iteration 1, and the same helpers carry the containment checks
- Required evidence: `resolveOverlayDir`, `containedOverlayPath`, `sourceRelative` and `strictWriteRefusal` in `.skilled/commands/doctor/scripts/overlay-engine.cjs`, plus the tests that pin them

Review verdict: CONDITIONAL
