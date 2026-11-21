# Review Iteration 001

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-003` at depth 1 of 3
- Dimension: correctness
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its engine-correctness clause: whether the `framework/` + `root/` source layout is correct as the default for every consumer, and whether the one-shot `apply --relayout` migration is safe.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:426-478` (`resolveOverlayDir`, sibling gate)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:2776-2786` (`isUnderRootSkilled`, `rootSkilledProblem`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3406-3436` (`layoutMoves`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3595-3672` (`commandStatus`, LAYOUT notice and cap)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5482-5492` (`adoptSource`, `legacyAdoptSource`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5630-5670` (`adoptUnderLock` root/skilled refusal)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6071-6404` (relayout: plan, backup, move, manifest rewrite, link retarget)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6466-6510` (`main` error boundary)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:899-1740` (layout, cap, relayout, root/skilled suites)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:765-830` (root/skilled blocked-entry suites)
- `.skilled/skills/system-skilled-doctor/SKILL.md:5` (version line)
- `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:16,29,33,51,57`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/spec.md:88,130,134,167,183,192`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/spec.md`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/spec.md:183`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/implementation-summary.md:53-70`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Relayout leaves a half-moved overlay folder when a rename or the manifest write fails after the first move** -- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6384-6392` -- `relayoutUnderLock` states its own invariant at `:6358-6360`: "copies already at their layout paths behind a manifest that still names the old ones is a folder nobody can read, and no backup restores it on its own." The guard that enforces it wraps only `planRelayoutManifest` (`:6362-6367`). The rename loop at `:6384-6389` and the manifest write at `:6391` run unguarded, so a `fs.renameSync` that throws (EACCES on a read-only destination parent, ENOSPC, EIO) or a `writeFileAtomic` that throws at `:6391` propagates to `main`'s catch at `:6497-6502`, which prints `[overlay-engine] <message>` and returns exit 2 with the tree already partly moved and the manifest still naming the old paths. The `relayout-runs/<stamp>/` backup at `:6376-6381` is the only recovery and it is manual.
   Finding class: `incomplete-implementation`
   Scope proof: the finding is inside the declared review target's engine file and names the exact statements that violate the invariant the same function declares.
   Affected surface hints: `overlay-engine.cjs` relayout path; `relayout-runs/` backup contract; the `apply --relayout` operator instruction in `changelog/v1.2.0.0.md:57`.
   Case: a consumer runs `apply --relayout` on a 130-entry folder where one destination parent is read-only. The first 60 copies move, the 61st rename throws, and the run exits 2 with 60 copies at `framework/`/`root/` paths that the manifest does not name.

```json
{
  "type": "claim",
  "claim": "relayoutUnderLock enforces its stated no-half-moved invariant only for the manifest-planning failure, not for the rename loop or the manifest write that follow it",
  "evidenceRefs": [
    ".skilled/commands/doctor/scripts/overlay-engine.cjs:6358-6360",
    ".skilled/commands/doctor/scripts/overlay-engine.cjs:6362-6367",
    ".skilled/commands/doctor/scripts/overlay-engine.cjs:6384-6389",
    ".skilled/commands/doctor/scripts/overlay-engine.cjs:6391",
    ".skilled/commands/doctor/scripts/overlay-engine.cjs:6497-6502"
  ],
  "counterevidenceSought": "Searched for a try/catch, a rollback helper, or a two-phase rename around the loop; found none. Checked whether main() restores anything on error: it only prints and returns EXIT_ERROR. Checked whether the backup is applied automatically on failure: copyForBackup only writes, nothing reads it back in this path.",
  "alternativeExplanation": "The author may have judged a rename inside one folder as unable to fail. It can fail: the destination parent is created with mkdirSync at :6385, which throws on a read-only overlay folder, and renameSync throws on ENOSPC or EIO. The comment at :6358-6360 shows the author considered exactly this end state and chose to prevent it, so the gap is an omission rather than a deliberate trade-off.",
  "finalSeverity": "P1",
  "confidence": "medium",
  "downgradeTrigger": "Downgrade to P2 if the maintainers document that a relayout failure is recovered by hand from relayout-runs/ and add that instruction to the changelog's relayout section."
}
```

### P2 Findings

1. **The LAYOUT overflow line advises `apply --relayout` even when the entries it counts are ones relayout refuses** -- `.skilled/commands/doctor/scripts/overlay-engine.cjs:3658-3660` -- the per-line remedy at `:3652-3655` branches on `isUnderRootSkilled(move.to)` and prints "change the destination or remove the entry" for those entries. The overflow line at `:3659` is unconditional: `LAYOUT   … <n> more; run <engine> apply --relayout`. A manifest with 21 or more off-layout entries whose tail includes a `root/skilled` destination therefore tells the operator to run a command that refuses the whole run at `:6136-6141`, and the operator has no line naming the entry to fix.
   Finding class: `diagnostic-gap`
   Scope proof: the finding is inside the declared review target's engine file and names the two statements whose remedies disagree.
   Affected surface hints: `status` LAYOUT output; `changelog/v1.2.0.0.md:29` which documents the overflow line as always naming relayout; the `root/skilled` refusal contract in `overlay-engine.cjs:6136-6141`.
   Case: a manifest holds 25 off-layout entries where entries 21-25 have destinations under `skilled/`. `status` prints 20 correct lines plus `LAYOUT   … 5 more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`; that command exits 2 naming only the first `root/skilled` entry.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `001-engine-out-of-tree-overlay-folder/spec.md:88,130,134`; `overlay-engine.cjs:426-478,5244-5249,6369-6381` | The sibling gate, the staged layout and the relayout backup paths match REQ-006 and REQ-010 as written. |
| `checklist_evidence` | pass | `002-engine-framework-root-source-layout/tasks.md`; `003-engine-docs-and-release/tasks.md:42,56,58` | Every checked task carries an observed result or a Verify command output; the `root/skilled` and overflow-line tasks cite the engine lines this iteration read. |

## Integration Evidence

- `.skilled/skills/system-skilled-doctor/SKILL.md:5` prints `version: 1.2.0.0`, matching the completion criterion.
- `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:16` names `/doctor:overlay apply --relayout`, matching the completion criterion.
- `barter/ai-speckit/skilled/.skilled-overlays.json` reads `{ "overlayDir": "../overlays" }` and `barter/ai-speckit/overlays/` holds `framework/`, `root/`, `checks/`, `tests/`, `README.md`, `overlay-manifest.json`, `sync-state.json` and `repin-runs/`, matching decision D4 and completion criterion 3.

## Edge Cases

- **Config/dispatch iteration-cap disagreement.** `review/deep-review-config.json` records `maxIterations: 7` while the dispatch binds `config.maxIterations: 24`. The lineage config was written with 24 from the dispatch binding, which is the authority for this run; the root config is a separate file the fan-out root owns. Recorded rather than resolved.
- **`resource-map.md` is absent** from the spec folder, so the Resource Map Coverage Gate is skipped and `resource_map_present` is false. Not treated as a pass.
- **Tests were not re-run.** The containment rule for this lineage forbids running repo tooling that writes outside the lineage directory, and `node --test` writes fixtures under the OS temp directory. Test strength is judged from the suite source and from the recorded evidence under `001-engine-out-of-tree-overlay-folder/scratch/evidence/` and `002-engine-framework-root-source-layout/scratch/evidence/`, not from a fresh run.
- **`barter-overlays` leftovers.** `rg -n barter-overlays` over the repository outside `specs/` returns four hits, all in `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:79,91,96,99`, where it is an arbitrary custom folder name in a fixture, not a reference to Barter's old path. No leftover reference found.

## Confirmed-Clean Surfaces

- `adoptSource` (`overlay-engine.cjs:5484-5488`) maps `.skilled` to `framework`, `.skilled/<rest>` to `framework/<rest>`, and every other key to `root/` with its leading dots dropped, exactly as decision D1 states.
- `isUnderRootSkilled` (`:2778-2782`) normalizes before comparing, so `root/skilled`, `root/skilled/`, `root/./skilled/x` and `root/skilled/x` are all refused; `framework` and `root/skilledfoo` are not.
- `resolveOverlayDir` (`:426-478`) refuses `..`, `.`, absolute paths, backslashes, NUL, deeper climbs (`../a/b`, `../../x`), a sibling carrying the tree's own name, a sibling that resolves inside the tree, and a sibling that contains the tree. A dangling link is refused until it resolves.
- Relayout idempotence holds: `layoutMoves` returns `[]` on a settled tree and `relayoutUnderLock` prints `0 moved` without creating `relayout-runs/` (`:6335-6338`; test `overlay-engine-follow-up.test.cjs:1197-1218`).
- Relayout refuses before writing when a destination already exists, when a source is missing, when two moves nest, when two entries claim one destination, when a field's manifest text changed since planning, and when a destination lands under `root/skilled` (`:6118-6160`, `:6362-6367`).
- The LAYOUT cap prints exactly 20 lines plus one overflow line, and `status --json` keeps all entries in `offLayout` (`:3652-3661`; tests `overlay-engine-follow-up.test.cjs:1541-1570`).
- `pruneEmptyParents` (`:6330-6335`) stops at the overlay root, so a relayout cannot remove `framework/` or `root/` themselves.

## Ruled Out

- **`overlayDir` outside the git repository is not refused by `resolveOverlayDir`.** Checked and ruled out: `001-engine-out-of-tree-overlay-folder/spec.md:132,226` scopes that refusal to `pre-commit`, and `overlay-engine.cjs:5814-5819` implements it there. Decision D2's summary is looser than the child spec, and the child spec outranks it.
- **`repin --stage` copies `relayout-runs/` and `repin-runs/` into the stage.** Checked and ruled out: `001-engine-out-of-tree-overlay-folder/spec.md:183` records the extra overlay-folder copy as an accepted cost under NFR-P01.
- **A `marked-section` entry whose `source` differs from its `fragment` keeps a permanent LAYOUT line.** Checked and ruled out: `layoutMoves` (`:3420-3424`) skips that `source`, and `status` prints from the same function, so no line is emitted for it.
- **`status` fails after a relayout until a follow-up `apply` runs.** Checked and ruled out: `state.files` holds applied hashes only (`:2908`), and `retargetRelayoutLinks` (`:6310-6328`) moves the live link while `planRelayoutManifest` (`:6280-6288`) rewrites the manifest target, so `planLayoutLinks` (`:2473-2479`) sees `current === link.target`.
- **Two destinations collapsing onto one source path** (`.claude/settings.json` and `claude/settings.json` both to `root/claude/settings.json`). Checked and ruled out: `planRelayout`'s `claimed` map (`:6152-6156`) refuses with both source paths named.

## Next Focus

- Dimension: correctness
- Focus area: frontier node `F-1-005` -- the Barter hooks learning both overlay locations and their fail-open/fail-closed behavior
- Reason: the next seeded depth-1 node, and the operator focus names hook fail-open/fail-closed behavior explicitly
- Rotation status: first pass on F-1-005; F-1-003 correctness is complete but the node stays open for its remaining dimensions
- Blocked/productive carry-forward: productive -- reading the engine's refusal and remedy lines produced both findings, so the same technique applies to the hook scripts
- Required evidence: `barter-overlay-guard-core.cjs`, `barter-git-write-gate.mjs`, the OpenCode plugins and the pre-commit hook, each with file:line, read through `git -C barter/ai-speckit`

Review verdict: CONDITIONAL
