# Publication and topology measurement — phase 007 execution notes

## Canary and topology

- Canary case added to `007-sk-doc/fixtures/canary-cases.v1.json`:
  `single-create-goal`, prompt `/create:goal`, expected `route`/`single`/
  `[sk-create-goal]`, gold intent `sk-create-goal`, gold resource
  `sk-create-goal/SKILL.md` — the shape every command-declaring mode's case uses.
- Canary gate (every fixture case through the hub's own `loadSnapshot` +
  `evaluateCanary`, asserting each case's expected action, selection kind and
  modes): **22 of 22 rows green**, including `single-create-goal -> route
  [sk-create-goal]`. Exit 0. Run after the publication, against the final
  serving fixture.
- Harness live-topology counts: this repository's sk-doc harness
  (`007-sk-doc/harness/build-artifacts.cjs`) derives the four counts live from
  `mode-registry.json` at snapshot build time; nothing is hand-pinned (a search
  for the pinned numbers the older harness carried finds none in this tree).
  Observed after registration: **destinations 15, projection rows 15, distinct
  identity tuples 15, distinct packets 14** (before: 14/14/14/13). The gap the
  counts encode — modes outnumber packets because one packet backs two modes —
  is unchanged. No source digests are hand-pinned in this repo's fixture or
  harness either; the source hashes regenerate inside the compiled policy, so
  there was nothing to re-pin by hand.

## Publication sequence (all commands, in order)

1. `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-doc --skill-root .skilled/skills/sk-doc`
   -> exit 0, policy `d88fd60a…`, generation 5, manifest refreshed (runtime root).
2. `node .skilled/bin/compiled-route-sync.cjs` -> **exit 1**: `MOVE-SIMULATION
   FAILED: promoted closure failed to resolve hubs: sk-doc`. Cause: the authored
   activation manifest under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/` still pinned the pre-change policy
   hash, and the rebuild promotes authored bytes (`compiled-route-guard.cjs`
   named it `sk-doc authored-drift`). No rollback was retained (the failure was
   pre-publish), so there was nothing to revert.
3. Fix the cause, via the compiled-route tool only:
   `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-doc --skill-root .skilled/skills/sk-doc --runtime-root specs/sk-doc/019-skill-routing-refactor/015-router-unification-program`
   -> exit 0, authored manifest re-minted to the same bytes
   (fingerprint `d47b8cb1…` on both copies).
4. `node .skilled/bin/compiled-route-sync.cjs` -> exit 0, 62 closure files
   promoted, rollback retained at
   `.skilled/bin/lib/compiled-routing.rollback-21918-1790401555319`.
5. Gates: `compiled-route-status.cjs --all --no-probe` -> all seven hubs
   `compiled-serving`; `compiled-route-sync.cjs --verify` -> `move-simulation OK:
   all 7 hubs resolve; 0 reads under .opencode/specs`; `compiled-route-guard.cjs`
   -> all hubs fresh, runtime matches source; kill-switch probe
   (`SPECKIT_COMPILED_ROUTING=0 node .skilled/bin/compiled-route.cjs --hub sk-doc
   --prompt "create packet goal"`) -> `{"servingAuthority":"legacy"}` sentinel;
   `compiled-route-admission.cjs --all` -> sk-doc `pass` (24 pass, 0 drift).
6. `node .skilled/bin/compiled-route-sync.cjs --finalize …rollback-21918-1790401555319`
   -> first attempt exit 1 `serving closure changed after publication` because
   the canary case had been re-applied to the serving fixture before finalize and
   the publication contract fingerprints closure bytes. The fixture was restored
   byte-exactly to the published copy, finalize then succeeded (exit 0,
   `reconciled 0 external manifest(s)`, rollback directory removed), and the
   canary case was re-applied to the serving fixture afterwards.
7. Final canary gate on the final fixture: 22 of 22 green. Final
   `compiled-route-status.cjs --all --no-probe`: every hub `compiled-serving`.
   No lock file, rollback, staging or failed directory remains under
   `.skilled/bin` (dotfile sweep included).

## One observation for the follow-up phase (fixture source-of-truth)

The serving closure is rebuilt from the authored tree under
`specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/`, and
the rebuild copies `009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json`
from there. This dispatch's write boundary covers the runtime copy
(`.skilled/bin/lib/compiled-routing/...`) only; the authored copy under `specs/`
is read-only here. The `single-create-goal` case therefore lives in the serving
(runtime) fixture now, and a future `compiled-route-sync.cjs` rebuild will
restore the authored copy and drop the case unless someone mirrors it into the
authored fixture (same one-case insertion) before rebuilding. The same lockstep
shows in the repository's own history, where both fixture copies move in one
commit.

## Mechanism deviations (recorded per execution doctrine)

- The two hub JSON files were written whole with the write tool per the persona
  contract; one keyword-order slip in `hub-router.json` was caught by the
  deep-equality check and corrected by a second whole-file write.
- Restoring the fixture to its published bytes used a byte-exact `cp` from the
  pre-change backup, because the publication contract fingerprints closure file
  bytes and only a byte-exact restore can satisfy it.

## Orchestrator follow-up: authored fixture mirrored and republished

The operator approved mirroring the canary case into the authored source on 2026-09-26.

1. The worker's whole-file writes had dropped the trailing newline from five files. It was restored in the runtime canary fixture, `graph-metadata.json`, `description.json`, `ROUTER.md` and `SKILL.md`.
2. The runtime fixture was copied byte for byte to the authored fixture under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/fixtures/`. `cmp` confirmed they match. The diff against HEAD is the one `single-create-goal` case.
3. `compiled-route-manifest.cjs refresh --hub sk-doc` ran on the runtime root and again with `--runtime-root` on the authored root. Both exited 0 with policy `19c1fdd9…`, and the two manifests are byte-identical.
4. `compiled-route-sync.cjs` promoted 62 closure files and retained a rollback.
5. Gates:
   - `compiled-route-status.cjs --all`: all seven hubs `compiled-serving`.
   - `--verify`: `move-simulation OK: all 7 hubs resolve`.
   - `compiled-route-guard.cjs`: all hubs fresh, runtime matches source.
   - Kill-switch: `{"servingAuthority":"legacy","hubId":"sk-doc"}`.
   - Canary run through `loadSnapshot` and `evaluateCanary`: 22 pass, 0 fail, with `single-create-goal -> route single [sk-create-goal]`.
   - `compiled-route-admission.cjs --all`: sk-doc `pass` (24 pass, 0 drift). sk-design shows 1 drift with no sk-design input changed; CI runs admission `--warn-only`.
6. `--finalize` exited 0 and removed the rollback. No lock, rollback or publication-state file remains.
7. A replay after the republish matches the pre-republish replay row for row (`routing-replay-final.txt`).
