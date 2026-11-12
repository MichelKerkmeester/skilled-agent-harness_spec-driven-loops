# Iteration 001 — Correctness and safety: data-loss paths

## Dispatcher

- Lineage: opus (fan-out), session `fanout-opus-1794439428470-vyb51k`, generation 1
- Executor: cli-claude-code, model claude-opus-5-5, run inline in this process (no nested dispatch)
- Dimension: correctness, with the security-relevant data-loss paths the review focus names first
- Budget profile: verify
- Review focus handling: this iteration took the focus's first half in order: lock takeover, layout link retarget, removal of dropped json-entry items, and `apply --relayout` moves and backups. The strict write checks, the commit check, `status --audit`, the OpenCode adapter and doc-to-engine parity are carried to iteration 2.
- steer.md: not present in the lineage directory at init or before this iteration.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs` lines 250-290 (writeFile, ensureSymlink, removePath), 461-547 (state load and write), 876-935 (item listing), 1040-1160 (dropped-item removal), 1329-1370 (json plan), 1620-1743 (layout link plan and apply), 2117-2176 (analyze), 2225-2329 (lock), 2399-2425 (layoutMoves), 2507-2604 (apply), 4501-4756 (relayout), 4824-4855 (main)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` lines 100-160 (lock tests), 187-330 (link and item test names), 528-646 (relayout fixture and main relayout test)
- `git diff c57b7e4cef^..e97ca56e8d` for the engine, to confirm that link records, item records, lock takeover and relayout are all new in this range

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Relayout leaves a dangling layout link that the next apply refuses to repair when the state has no link record** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:4740 -- `relayoutUnderLock` renames the copies, then `relayoutLinkTargets` rewrites each manifest link whose target reached into a moved copy, and the comment at 4740-4741 promises "the next apply retargets it". The live link is left pointing at the renamed-away path. `planLayoutLinks` (1701-1707) only treats it as a retarget when `isRecordedLink` finds the old target in `state.links`; otherwise it pushes "exists but is not the link to", and `applyUnderLock` (2513-2531) then blocks the whole apply. `state.links` is new in this commit range: `loadState` (486-488) maps a state file written by the earlier engine to `links = {}`, and only a successful apply with the new engine records links (2579-2594). `status` sends the operator straight to `apply --relayout` (2480), and relayout checks nothing about link records before it moves. The same happens for a link the operator made by hand.
   Finding class: state-transition precondition missing
   Scope proof: every path is inside the engine under review; the relayout test fixture sets `layoutLinks: []` (tests/overlay-engine-follow-up.test.cjs:549), so this path is never exercised
   Affected surface hints: overlay-engine.cjs relayoutUnderLock / relayoutLinkTargets / planLayoutLinks; the relayout playbook scenario `manual-testing-playbook/overlays/relayout-moves-sources.md`; the overlay.md relayout step
   Case: a vendored tree whose sync-state.json was written before link records existed, with a layout link whose target is an off-layout overlay folder, runs `status`, then `apply --relayout` as told, then `apply`; the link now dangles and apply prints `BLOCKED  layout: <path> exists but is not the link to <new target>` and changes nothing.

```json
{"type":"claim-adjudication","findingId":"OPUS-I1-P1-001","claim":"apply --relayout can leave a live layout link dangling while the follow-up apply refuses to retarget it, blocking every overlay write until the link is fixed by hand","evidenceRefs":[".skilled/commands/doctor/scripts/overlay-engine.cjs:4740",".skilled/commands/doctor/scripts/overlay-engine.cjs:4633",".skilled/commands/doctor/scripts/overlay-engine.cjs:1701",".skilled/commands/doctor/scripts/overlay-engine.cjs:1706",".skilled/commands/doctor/scripts/overlay-engine.cjs:2513",".skilled/commands/doctor/scripts/overlay-engine.cjs:488",".skilled/commands/doctor/scripts/overlay-engine.cjs:2480",".skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:549"],"counterevidenceSought":"Looked for a precondition in relayoutUnderLock or planRelayout that refuses when a link reaching a moved copy is unrecorded (none); looked for status or relayout writing state.links (only applyUnderLock writes it); looked for a relayout test with layout links (fixture uses an empty list).","alternativeExplanation":"An operator who ran a plain apply with the new engine before relayout has the link recorded and the retarget works; the defect needs a state without that record, which is exactly the upgrade path from the earlier engine or a hand-made link.","finalSeverity":"P1","confidence":0.8,"downgradeTrigger":"Downgrade to P2 if the command docs require a plain apply before apply --relayout, or if relayout is shown to refuse unrecorded links elsewhere."}
```

### P2 Findings

2. **Stale-lock takeover can delete a lock another run has just taken** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:2270 -- `acquireLock` reads the owner line (2261), decides the owner is gone, then calls `unlinkSync` without checking that the file still holds that line. If run B has already removed the same stale lock and created its own in that gap, run A deletes B's live lock and creates its own, so both runs hold "the" lock and write the tree at once. The comment at 2267-2268 says this race only makes the retry report the other run's owner; that holds only when B has removed but not yet recreated the file. The same unchecked read-then-unlink pattern sits in `release` (2294-2295).
   Finding class: concurrency / lock safety
   Scope proof: acquireLock and withLock are the only lock entry points (apply, capture, repin, rollback, adopt and relayout all go through withLock)
   Affected surface hints: overlay-engine.cjs acquireLock; stale-lock-takeover playbook scenario; tests only cover single-run takeover (follow-up.test.cjs:107-160)
   Case: a killed run leaves `.build-lock`; two agents start `apply` at the same moment; B unlinks and recreates the lock between A's read and A's unlink, A deletes B's lock and creates its own, and both runs write the same destinations and sync-state.json.

3. **Dropping an entry deletes an identical item that upstream now carries itself** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:1117 -- `findRecordedIndex` matches a recorded item by identity (or value for a scalar list) only, and the record keeps surviving after upstream adopts the same item, because `planOperation` reports an existing, recorded item as listed (902, 928). When the entry set later drops the item, `removeDroppedItems` deletes the live copy, which is now upstream's line. The deepEqual check (1121) only stops the deletion when the bytes differ.
   Finding class: ownership tracking
   Scope proof: inside the json-entry planner under review
   Affected surface hints: overlay-engine.cjs removeDroppedItems, planOperation reportListed; follow-up test 'apply leaves an upstream item alone when the entry set stops listing it' (follow-up.test.cjs:328) covers only an item upstream held before the overlay added it
   Case: an overlay appends `"foo"` to a scalar list; a later re-pin brings an upstream copy of the list that also contains `"foo"`; the operator then removes `"foo"` from the entry set and runs apply; `"foo"` is gone from the live file although the pinned upstream lists it, and status reports in-sync.

4. **Relayout moves copies one at a time and rewrites the manifest only at the end, with no rollback** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:4732 -- the renames at 4730-4738 run before `rewriteRelayoutManifest` (4742), which can still throw when a field no longer holds the planned path (4672-4673, 4687-4688). A throw there, or a failed `renameSync` part-way through the list, leaves some or all copies moved while the manifest still names the old paths. The backup is written first, but nothing restores it and the run only prints the exception, so the next apply reports the moved entries' sources as missing.
   Finding class: partial-failure atomicity
   Scope proof: relayoutUnderLock is the only writer in the relayout path
   Affected surface hints: overlay-engine.cjs relayoutUnderLock and rewriteRelayoutManifest; the relayout backup is in `relayout-runs/<stamp>`; the docs should say how to restore by hand
   Case: a manifest edited by hand between the load and the rewrite, or a rename that fails with EACCES on the third of five moves, leaves the overlay folder half-moved with a manifest that names the old paths and no restore step.

## Traceability Checks

- spec_code (partial, this iteration): the follow-up tests cover lock takeover for a dead or live pid, a missing pid and another host (follow-up.test.cjs:107-160), link retarget with a recorded link and refusal without one (187-221), dropped-item removal and edit refusal (287-330), and relayout without layout links (602-646). The link rewrite inside relayout has no test.
- checklist_evidence: deferred to iteration 2, which reads the packet's acceptance criteria against the docs.

## Integration Evidence

- `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` is the only test file exercising the paths above; this iteration read its fixtures and test names and did not run it, because the permission layer refused every `node` invocation in this session.

## Edge Cases

- Lineage blocker: the permission layer refused every `node` call in this session: an inline `node -e` builder, a builder script inside the lineage, and `append-mode-event.cjs --help`. The append gateway and the reducer could not run. The canonical iteration record is written to `gateway-events/iteration-001.json` inside the lineage for replay, and `deep-review-state.jsonl` was not hand-written, as the contract requires.
- Ambiguity: the range `c57b7e4cef..e97ca56e8d` excludes c57b7e4cef itself in git semantics. This iteration reviewed `c57b7e4cef^..e97ca56e8d` so the named first commit is included; c57b7e4cef only touches the overlays reference trigger phrases.
- Lock owner detection relies on `process.kill(pid, 0)`; a recycled pid makes a dead owner look alive, which fails safe (refuses), so it is not a finding.

## Confirmed-Clean Surfaces

- Retarget apply (1726-1741) re-checks that the path is still a symlink before unlinking, so a real file or folder that replaced the link is never deleted.
- `removeDroppedItems` refuses an item whose bytes changed since apply (1121-1124) and skips a record whose array or item is gone (1115-1118).
- Two overlays owning one destination are refused in `analyze` (2150), so the per-destination item records cannot be shared across overlays.
- `loadState` validates the new `links` and `items` shapes and treats their absence as "nothing owned" (486-499), which fails safe for retarget and removal.
- Relayout refuses clashing destinations, nested moves, taken layout paths and missing sources before writing anything (4544-4585), and it writes the backup before the first rename.

## Ruled Out

- Shared item records across overlays on one destination: ruled out by the duplicate-destination throw at 2150.
- Retarget deleting a real file: ruled out by the lstat check at 1737-1739.
- Credential copies lost in relayout: a `.env`-named single copy is skipped and its field is not rewritten (4580-4583); an env file inside a moved folder moves with the rename even though the backup skips it, so the bytes are not lost.

## Next Focus

- Dimension: security and traceability
- Focus area: strict write checks (`strictWriteRefusal`, guard), the pre-commit check (`stagedUnownedChanges`), `status --audit` (`auditVendoredTree`), the OpenCode adapter `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` and its test, and whether overlay.md, the assets and overlays.md match the engine (including whether any doc tells the operator to apply before `--relayout`)
- Reason: the review focus's second half; the doc check also decides whether finding 1 keeps P1
- Rotation status: correctness covered; security, traceability, maintainability remain
- Required evidence: file:line reads of the guard, pre-commit and audit functions and of the command docs

Review verdict: CONDITIONAL
