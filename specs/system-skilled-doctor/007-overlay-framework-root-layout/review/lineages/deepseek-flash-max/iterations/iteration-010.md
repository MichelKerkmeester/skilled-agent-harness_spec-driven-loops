# Review Iteration 010

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-007` at depth 1 of 3
- Dimension: maintainability
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its record-shape clause: whether the pin block, the sync-state record and the layout-link list carry what a later re-pin needs, and whether the two overlay-owned changelog links are tracked rather than hand-maintained.

## Files Reviewed

- `barter/ai-speckit/overlays/overlay-manifest.json` (`schemaVersion`, `pin`, `repin`, `layoutLinks`, `overlays` count)
- `barter/ai-speckit/overlays/sync-state.json` (`schemaVersion`, `pin`, `files`, `links`, `items`, `sets`, `keys`)
- `barter/ai-speckit/overlays/framework/changelog/skilled-coder/v4.1.0.0.md:1-11`
- `barter/ai-speckit/skilled/.skilled/changelog/` (link targets against `layoutLinks`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:73` (`DEFAULT_OVERLAY_FOLDER`)

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
| `spec_code` | pass | `overlay-manifest.json` `layoutLinks`; `sync-state.json` `links`; `barter/ai-speckit/skilled/.skilled/changelog/` | All 19 declared layout links are recorded in sync-state with the same targets, and both overlay-owned changelog links resolve through the sibling folder. |
| `checklist_evidence` | pass | `overlay-manifest.json` `pin`; `sync-state.json` `pin`; `sync-state.json` `schemaVersion` | The pin block carries the three fields a later re-pin needs, and both records declare schema version 2. |
| `skill_agent` | pass | `overlays/framework/changelog/skilled-coder/v4.1.0.0.md:1-11` | The release entry carries the frontmatter the changelog convention requires, including title, description, trigger phrases, importance tier and context type. |

## Integration Evidence

- `overlay-manifest.json` declares `schemaVersion`, `description`, `pin`, `strictWrites`, `repin`, `generated`, `layoutLinks`, `overlays`, `regenerate` and `verifyGenerated`, with 133 overlay entries.
- `pin` carries `upstream`, `commit` and `checkout`, which are the three fields a later re-pin reads: the upstream name, the commit to move to, and the checkout to read it from.
- `sync-state.json` declares `schemaVersion: 2` and holds `pin`, `files` (485 destinations), `links` (19), `items`, `sets` and `keys`. The `links` map is the record of every layout link the engine wrote.
- `layoutLinks` has 19 entries and `sync-state.links` has 19 entries, and every target matches. Both overlay-owned changelog links are declared there: `.skilled/changelog/sk-git-skilled` to `../../../overlays/framework/skills/sk-git/sk-git-skilled/changelog` and `.skilled/changelog/skilled-coder` to `../../../overlays/framework/changelog/skilled-coder`.
- `layoutLinks` carries two `replaces` blocks for `.skilled/changelog/sk-git/parent` and `.skilled/changelog/sk-git/git-barter`, each naming the old `.skilled/changelog/sk-git` link and its `../skills/sk-git/changelog` target, so the engine can retarget a tree that still holds the single old link.
- `sync-state.links` holds no value containing `barter-overlays`, so the record carries no pre-move target.

## Edge Cases

- **This iteration corrects an edge case recorded in iteration 3.** Iteration 3 recorded that the two overlay-owned changelog links are "not engine-managed" because `grep -n "changelog" overlay-engine.cjs` returns nothing. That conclusion was wrong: the engine manages them through the manifest's `layoutLinks` field, which names both paths and both targets, and `sync-state.links` records them. The engine never needs the word `changelog` because the paths arrive as data. The correction does not change any finding; it removes a wrong note from the record.
- **`pin.checkout` is an absolute local path.** Carried forward from iteration 3, where it was ruled out as pre-existing (`d10121d9af8`) and documented. Not re-raised under this dimension.
- **`sync-state.items`, `sets` and `keys` were read for shape, not audited entry by entry.** Recorded so the coverage claim is bounded: the pass verified the record's top-level shape and its link map, not the content of every JSON-edit record.
- **Tests were not re-run** for the containment reason recorded in iteration 1.

## Confirmed-Clean Surfaces

- The pin block carries exactly the three fields a re-pin needs, and both records agree on the commit.
- Both records declare `schemaVersion: 2`, so a later run can tell which shape it is reading.
- The layout-link list and the sync-state link map agree entry for entry, 19 to 19, which is what makes the two changelog links engine-managed rather than hand-maintained.
- The `replaces` blocks give the engine a migration path for a tree that still holds the single old `sk-git` changelog link, so the split into `parent` and `git-barter` does not need a manual step.
- The release entry's frontmatter carries every field the changelog convention names.
- No value in the link map names the pre-move folder.

## Ruled Out

- **The two overlay-owned changelog links are hand-maintained.** Checked and ruled out: `layoutLinks` declares both and `sync-state.links` records both, so the engine writes them.
- **The layout-link list and the sync-state link map disagree.** Checked and ruled out: 19 entries each, every target matching.
- **The pin block lacks a field a later re-pin needs.** Checked and ruled out: `upstream`, `commit` and `checkout` are all present.
- **The sync-state record carries a pre-move link target.** Checked and ruled out: no value in `links` contains `barter-overlays`.
- **The release entry is missing required frontmatter.** Checked and ruled out: title, description, trigger phrases, importance tier and context type are all present.

## Next Focus

- Dimension: cross-reference
- Focus area: the three frontier nodes are complete on all four dimensions; the remaining work is the cross-node synthesis pass that groups the six open findings by root cause and checks that no finding contradicts another
- Reason: every node-and-dimension pair is now covered, so the next pass is the fallback the strategy names when no dimension remains
- Rotation status: all three nodes complete on correctness, security, traceability and maintainability
- Blocked/productive carry-forward: productive -- the correction recorded above came from reading the record shapes rather than the prose, which is the same technique the synthesis pass needs
- Required evidence: the findings registry, the six open findings, and the strategy's exhausted-approach list

Review verdict: CONDITIONAL
