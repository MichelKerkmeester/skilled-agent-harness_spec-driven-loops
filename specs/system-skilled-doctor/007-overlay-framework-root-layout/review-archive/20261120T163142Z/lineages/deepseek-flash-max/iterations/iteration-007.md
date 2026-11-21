# Review Iteration 007

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-007` at depth 1 of 3
- Dimension: traceability
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its leftover-reference clause: whether any old `barter-overlays` path survives outside the areas the packet exempts, and whether the Barter re-pin's own records still trace to the commit and the release they claim.

## Files Reviewed

- `specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:133-146`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/spec.md:163-180`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/tasks.md:34,47,48,50,64,66,68,72,73,75,111`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/goal.md:90`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/implementation-summary.md:8,17,19,108,109,118,126`
- `barter/ai-speckit/overlays/framework/changelog/skilled-coder/v4.1.0.0.md:1-60,310`
- `barter/ai-speckit/overlays/sync-state.json` (`files` map, scanned for `barter-overlays` values)
- `.skilled/changelog/skilled/v4.1.0.0.md` (existence, as the release the changelog claims)
- `barter/ai-speckit/**` (old-path grep, REQ-008)

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
| `spec_code` | pass | `005-barter-move-overlays-out-of-tree/spec.md:145`; old-path grep over `barter/ai-speckit`; `overlays/overlay-manifest.json` `pin`; `overlays/sync-state.json` `pin` | REQ-008's old-path claim holds exactly, and the pin records agree with the changelog. |
| `checklist_evidence` | pass | `004-barter-repin-and-relayout/tasks.md:64,72,73,75`; `implementation-summary.md:108,109,118,126` | Every re-pin task line carries an observed result with a commit id or run id, and the one blocked task is recorded in five places rather than dropped. |
| `skill_agent` | pass | `barter/ai-speckit/skilled/.skilled/skills/system-skilled-doctor/SKILL.md`; iteration 3 parity comparison | The vendored doctor skill file is byte-identical to Skilled at the pin, so the skill surface the packet ships traces to the commit it claims. |

## Integration Evidence

- REQ-008 of phase 005 (`spec.md:145`) claims that outside spec history, changelogs and `.index/`, `barter-overlays` not preceded by `-` appears only in track-name false positives and one temp-folder fixture name. `grep -rnP "(?<!-)barter-overlays"` over `barter/ai-speckit` excluding `specs/`, `.index/`, `node_modules/`, `dist/`, `repin-runs/`, `.git/` and changelogs returns **zero** lines, so the claim holds with room to spare.
- Every `barter-overlays` hit that does exist is `skilled-barter-overlays`, the spec track name, which is the false positive REQ-008 names.
- `overlays/sync-state.json` holds no value containing `barter-overlays`, so the state record carries no stale link target from the pre-move layout.
- `barter/ai-speckit/overlays/framework/changelog/skilled-coder/v4.1.0.0.md:310` says the last re-pin moved the tree to Skilled `063daae` and printed `RESULT: PASSED`; the manifest and sync-state pins both name `063daaee2c19a7a8c9a0fb67f84903894bc08043`.
- The changelog's "It runs on Skilled v4.1.0.0" traces: `.skilled/changelog/skilled/v4.1.0.0.md` exists, so the release the notes claim is the release the pin carries.
- `004-barter-repin-and-relayout/tasks.md:64` records the live re-pin with run id `20261120T125226Z-a599ac` and the pin commit; `:72` records commit `c8cd005b173`; `:73` records commit `fd6dd18b66d`; `:75` records the post-relayout `apply 0 changed` and `offLayout=0 in-sync=487`.

## Edge Cases

- **Phase 004's REQ-001 verification command names `./barter-overlays/overlay-manifest.json`** (`spec.md:163`), a path that no longer exists after phase 005. Recorded, not raised: REQ-011 (`:178`) explicitly exempts `specs/` from the old-path rule, so the packet has decided that specs may name old paths, and the command was correct when phase 004 ran.
- **`tasks.md:111` is an unchecked box** reading "All tasks marked `[x]` (T014 is `[B]`)". Recorded, not raised: the parenthetical states the exception, and the blocked task is recorded in `goal.md:90`, `implementation-summary.md:17,19,118,126` and `tasks.md:68` with the operator as the next safe action. An honest open item is not a traceability defect.
- **`tasks.md:75` records the sync-state diff as naming `../../barter-overlays/framework/...`**, while the links now resolve through `../../../overlays/framework/...`. Recorded, not raised: the observation was accurate when phase 004 ran, and phase 005 retargeted the links afterwards.
- **The three remaining overlay protocols were not exercised.** `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` have no surface in this node's scope, which is a vendored tree and two state records. Recorded so the coverage claim is not read as broader than it is.
- **Tests were not re-run** for the containment reason recorded in iteration 1.

## Confirmed-Clean Surfaces

- The old-path rule is satisfied with zero exceptions rather than with the two the requirement allows, which is the strongest form the claim can take.
- The pin is recorded in three independent places that agree: the manifest `pin.commit`, the sync-state `pin`, and the changelog's short id.
- The changelog's release claim traces to a real Skilled changelog entry at the same version.
- Every re-pin task line that claims a result names the artifact that proves it: a run id, a commit id, or a printed count.
- The one blocked task is escalated rather than silently closed, and the phase's own completion box is left unchecked to say so.

## Ruled Out

- **An old `barter-overlays` path survives in a doc, test or script.** Checked and ruled out: the REQ-008 grep returns zero lines outside the exempt areas.
- **`sync-state.json` still records a pre-move link target.** Checked and ruled out: no value in the `files` map contains `barter-overlays`.
- **The changelog claims a Skilled release the pin does not carry.** Checked and ruled out: `.skilled/changelog/skilled/v4.1.0.0.md` exists and the pin is the commit the changelog names.
- **The phase closed over an unrecorded blocker.** Checked and ruled out: T014 is recorded in five places with the operator named as the next safe action.
- **The re-pin's task lines claim results without naming the artifact.** Checked and ruled out: each names a run id, a commit id, or a printed count.

## Next Focus

- Dimension: maintainability
- Focus area: frontier node `F-1-003` -- whether the engine's own documentation matches the code it ships: `changelog/v1.2.0.0.md`, `references/overlays.md` and `assets/doctor-overlay-presentation.txt`
- Reason: `convergence.cjs` still reports `dimensionCoverageGate` failing with `maintainability` missing, so the run cannot stop until it is covered
- Rotation status: fourth pass on F-1-003; F-1-005 keeps traceability and maintainability open, F-1-007 keeps maintainability open
- Blocked/productive carry-forward: productive -- reading the reference beside the code settled the repository-boundary question in iteration 4, and the same comparison answers the docs question
- Required evidence: `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md`, `references/overlays.md`, `assets/doctor-overlay-presentation.txt`, and the engine lines each describes

Review verdict: CONDITIONAL
