# Review Iteration 1

## Dispatcher

- Mode: review, single iteration.
- Target: packet 039 as merged in `bd79708c2f..59e95420f3`.
- Route: `Resolved route: mode=review target_agent=deep-review`.
- Status: complete for the strategy-selected correctness focus.
- Budget profile: scan.

## Dimension

Correctness. The strategy-selected focus was the wrapper change notice and log, records without a handoff, and parked Claude Stop records. The operator focus was also considered: this pass inspected wrapper, record-validation, parked-record and goal-resolution changes visible in the selected source paths. Generated-title carry, question-dialog refusal and the conformance stamp pin remain deferred because their implementation paths were not examined in this pass. No live hop or test suite was run.

## Files Reviewed

- `.skilled/bin/skilled-loop:1208,1472`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:639,1302`
- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:124`
- `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1028,1041`
- `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:940`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice/spec.md:147`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/005-parked-record-escape/spec.md:130`
- The relevant spec excerpts for the generated-title and question-dialog behaviors were used to identify deferred scope; their implementation paths were not reviewed.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **An unavailable startup checksum is treated as proof that the wrapper changed** -- `.skilled/bin/skilled-loop:1472` -- The startup read can produce an empty `started_wrapper_checksum` when the file is briefly unavailable. The later condition checks that the hop checksum is nonempty and differs, but does not require a nonempty startup checksum. Once the file can be read, an empty baseline therefore produces a change notice and a `wrapper-changed` log event even when the on-disk wrapper has the same bytes the running process started with. The notice can mislead the operator into restarting the loop.
   Finding class: correctness
   Scope proof: the baseline and comparison were added in range `bd79708c2f..59e95420f3`; the range diff shows the comparison at line 1472.
   Affected surface hints: `.skilled/bin/skilled-loop` stale-wrapper notice and the `wrapper-changed` event in `relaunch.log`.
   Case: the wrapper checksum read fails during startup while a checkout replaces the file, then a later hop reads the same wrapper bytes successfully.
   Evidence: [SOURCE: .skilled/bin/skilled-loop:1208] [SOURCE: .skilled/bin/skilled-loop:1472] [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice/spec.md:147]

## Traceability Checks

- `spec_code`: partial. The wrapper checksum behavior was compared with the wrapper spec. The no-handoff and parked-record paths were compared with their source and focused tests.
- `checklist_evidence`: deferred. This pass did not audit packet acceptance-criteria completion evidence.
- `skill_agent`: deferred.
- `agent_cross_runtime`: deferred.
- `feature_catalog_code`: deferred.
- `playbook_capability`: deferred.

## Integration Evidence

- Read `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` with `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` for the missing-handoff record behavior. The test also preserves the accepted empty-string handoff case.
- Read `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` with `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` for the parked-record path. The focused test checks that a missing transcript path leaves the record pending and stamps `deferredAt`.
- The tests were inspected but not executed.

## Edge Cases

- A failed startup checksum is distinct from a successful checksum that differs. The current branch handles only the latter reliably.
- The stop-arm spec covers missing transcript, unresolved target and arm failure. This pass directly checked the missing-transcript test and inspected the changed branches.
- The review did not establish live runtime behavior for a hop or for the deferred title, dialog and conformance-pin surfaces.

## Confirmed-Clean Surfaces

- `readRelaunchFile` rejects a record without a string `handoff`; the focused test covers this. A record with an empty-string handoff remains readable, as the existing compatibility test requires.
- The inspected Claude Stop paths keep records pending and call the shared deferral marker when arming cannot proceed.

## Ruled Out

- No finding was raised for empty-string handoffs. The implementation and focused test preserve the recorded behavior.
- No cross-runtime claim was made from the Claude Stop review; the Codex stamp behavior remains governed by the conformance pin and was not re-evaluated here.

## Next Focus

- Dimension: security.
- Focus area: state-directory validation and persisted-record boundaries in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` and `.skilled/hooks/session-relaunch/claude/stop-arm.mjs`.
- Reason: advance to the next uncovered review dimension after the strategy-selected correctness pass.
- Rotation status: advancing from correctness to security.
- Blocked/productive carry-forward: direct range diff plus source, test and spec comparison was productive. Carry the wrapper checksum finding forward. Keep title carry, question-dialog refusal and conformance-pin review deferred.
- Required evidence: inspect state-path and record validation against caller inputs, including refusal behavior on invalid or unsafe state.

## Verdict

Review verdict: PASS
