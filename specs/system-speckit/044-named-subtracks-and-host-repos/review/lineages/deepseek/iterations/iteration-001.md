# Iteration 1 - Correctness

## Dimension

Correctness: track-root discovery in both views, `refresh-track-roots.mjs`, `sweep-track-roots.mjs`, `create.sh` refresh, `validate.sh` recursion, and the parent-derivation repair path. Line numbers below are from the reviewed commit range `ac32d66fed..7714ff26b1`, not from the current HEAD.

## Focus

Track-root discovery, refresh, sweep and flat-track non-regression, checked against REQ-001, REQ-002, REQ-003, REQ-005 and REQ-006.

**Operator review focus:** this iteration covers the named sub-track half of `track-roots`, refresh, sweep and repair-derived; the doctor `project_owned` entry and the host trigger-index docs are carried to iterations 3-5. The operator requirement "never open any `.env` file or any Barter file" was honored: no `.env*` file and no `barter/` path was read.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:59-164` (sub-track discovery helpers and working-tree view)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:214-273` (commit view)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs:75-119`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs:65-126`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:312-391` and `:517-551`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/track-roots.vitest.ts` (diff, sub-track and flat-tree cases)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts:452-512`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/subtrack-tree.mjs:31-107`
- `specs/system-speckit/044-named-subtracks-and-host-repos/spec.md:91-115`
- `specs/system-speckit/044-named-subtracks-and-host-repos/acceptance-criteria.md` (AC-001, AC-002, AC-003, AC-005, AC-006)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The parent repair cannot clear a sub-track parent after a move to the specs root or to another track** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:368` -- `expectedParentId` returns `{known:false}` for any location with fewer than two segments, and its only "clear the old parent" branch (`:384-388`) requires the packet to land directly in the same track. A packet moved from `specs/demo/sub/001-probe` to `specs/001-probe` or to `specs/other/001-probe` therefore keeps `parent_id: "demo/sub"` and `parent_id_review_required: true`; the graph merge then preserves that stored parent over the null re-derive.
   - Finding class: `incomplete_move_repair`
   - Scope proof: `repair-derived.cjs` is the tool named by REQ-005 and by the packet's Files to Change for recomputing `parent_id` after a move; the move destinations are ordinary `specs/` locations.
   - Affected surface hints: `repair-derived.cjs` `expectedParentId`, `graph-metadata-parser.ts` `resolveParentId` (returns null for both destinations), `graph-metadata-parser.ts` `mergeGraphMetadata` (keeps a stored non-null parent and sets the review flag).
   - Case: `mv specs/demo/sub/001-probe specs/001-probe && node repair-derived.cjs --folder specs/001-probe --apply` reports no graph-parent repair and leaves `parent_id: "demo/sub"` in the packet.
   - Claim adjudication:

```json
{"type":"finding","claim":"A packet moved out of a sub-track to the specs root or to another track keeps the stale sub-track parent because expectedParentId has no known parent for that destination.","evidenceRefs":["specs/system-speckit/044-named-subtracks-and-host-repos/review/lineages/deepseek/iterations/iteration-001.md","repair-derived.cjs:368","repair-derived.cjs:384-388","graph-metadata-parser.ts:887-897"],"counterevidenceSought":"Checked the existing move tests (same-track, into-sub-track, between-sub-tracks, undeclared folder) and the parser's null re-derive for both destinations.","alternativeExplanation":"The comment at repair-derived.cjs:359-363 deliberately leaves flat packets to a person, so the omission may be a documented scope limit rather than a defect.","finalSeverity":"P1","confidence":0.82,"downgradeTrigger":"Downgrade to P2 if a move to the specs root or another track is declared out of scope for repair-derived, or if a later iteration shows the merge clears the stale parent on the same run."}
```

### P2 Findings

1. **A symlinked `graph-metadata.json` reads differently in the two views** -- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:154` -- the working tree reads the link target with `readOptionalText`, while the commit view reads the blob object (`:258-262`), which for a symlink is the link text and not JSON. The same pre-existing split exists for a track's own metadata (`:122` versus `:236`). The module's contract says both views reach the same answer; a sub-track whose metadata is a symlink is accepted by the refresh in the working tree and reported unreadable by the pre-push sweep in the commit.
   - Finding class: `view_parity`
   - Scope proof: `readWorkingTreeTracks` and `readCommitTracks` are the two views the module documents as equivalent.
   - Affected surface hints: refresh, sweep `--rev`, pre-push gate.
   - Case: replace `specs/demo/sub/graph-metadata.json` with a relative symlink to a real metadata file, then run `sweep-track-roots.mjs --rev HEAD`; the commit view reports `declared=? actual=? (graph-metadata.json is unreadable)` while the working-tree refresh writes the link target's content.
2. **`repair-derived` treats the literal string `"null"` as absent but does not rewrite it** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:532-538` -- `recorded` is normalized to `null` for comparison, so an archived packet whose `parent_id` is the string `"null"` is considered already correct when the expected parent is `null`; the action is skipped and the literal remains in `graph-metadata.json`. The graph merge normalizes the same field, so the two writers disagree about whether the file still needs repair.
   - Finding class: `repair_idempotence`
   - Scope proof: `fixRecordedLocation` is the repair for recorded locations; the normalization is introduced there.
   - Affected surface hints: `repair-derived.cjs` report counts, later graph merge.
   - Case: an archived packet with `"parent_id": "null"` and no review flag; `repair-derived --apply` reports clean, the file still contains the literal.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | REQ-001/002/003 are implemented at the cited lines; REQ-005 is incomplete for the two move destinations above. |
| `checklist_evidence` | core | partial | AC-001/002/003/006 are supported by the added tests I read; AC-005 does not exercise a move to the specs root or another track. |
| `skill_agent` | overlay | notApplicable | No skill or agent definition is changed by this commit range. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime mirror is changed. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog entry is changed. |
| `playbook_capability` | overlay | notApplicable | No playbook capability is changed. |

## Edge Cases

- The reviewed workspace moved during the run: the packet now lives at `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos` after `26cc92b728a`, while the dispatch-bound lineage path is the older `044-...` path. The named commit range still resolves and the reviewed implementation paths are unchanged, so this is recorded as a workspace conflict, not a code finding.
- A declared sub-track without `graph-metadata.json` is listed by `readWorkingTreeTracks` with `rawMetadata: null`; `refresh-track-roots.mjs` then exits 2 for it, and the sweep reports it unreadable. This is consistent with the documented requirement that a sub-track has a track-root metadata file.
- A parent track's `children` list now includes the sub-track folder name; this is what makes the track's `children_ids` list the sub-track itself and is covered by the fixture expectation `['001-flat-probe', 'sub']`.
- Nested sub-tracks are not supported: `create.sh` and the archive reader accept only one non-numbered level; a deeper value is left alone rather than promoted.

## Confirmed-Clean Surfaces

- Flat-tree non-regression: `readWorkingTreeTracks` keeps the old filter, sort and `spec.md`/metadata gates for flat tracks; the added `flat-tree refresh compatibility` test asserts byte-identical metadata after refresh, and the new diagnostics array is empty for a flat tree.
- Working-tree and commit-view parity for a declared sub-track, a symlinked sub-track, a symlinked `description.json`, and an undeclared folder is asserted by `track-roots.vitest.ts` and matched the code I read.
- Diagnostics stay advisory: the sweep's undeclared-folder and symlink lines do not increment `drifted` and the tests assert exit 0.
- `refresh-track-roots.mjs --track demo/sub` resolves the sub-track identity through `readWorkingTreeTracks`, so `--track demo/missing` exits 2 as required.

## Ruled Out

- "The parent track's children set changed for flat tracks": ruled out by the byte-identical flat-tree test and by the unchanged `numberedChildren` filter.
- "A symlinked sub-track is followed in one view": ruled out by the explicit `entry.isSymbolicLink()` / `mode === '120000'` branches and the parity test.
- "The sub-track's packets are counted in the parent's children as well": ruled out by the fixture expectation and `numberedTreeChildren` filtering only numbered entries.
- "The sweep's diagnostics change its exit code": ruled out by code reading (`drifted` is incremented only for unreadable metadata or a mismatch) and by the test's exit-0 assertion.

## Next Focus

Dimension: security. Focus area: path containment and symlink handling in `create.sh --track <track>/<sub-track>`, `archive.sh`'s new sub-track packet homes, and the doctor `project_owned` mirroring path. Reason: the correctness pass found a move-repair gap; the security pass must test whether a write can escape the specs root through a symlinked sub-track, and whether the archive/doctor link rules keep the same boundary. Rotation status: correctness complete, security next. Required evidence: `validate_track_value`, `SPECS_DIR` construction, `is_declared_subtrack`, `is_packet_home`, `reject_linked_argument`, and the doctor `isHostRelativeLink`/`isWithin` pair. Recovery note: none.

Review verdict: CONDITIONAL
