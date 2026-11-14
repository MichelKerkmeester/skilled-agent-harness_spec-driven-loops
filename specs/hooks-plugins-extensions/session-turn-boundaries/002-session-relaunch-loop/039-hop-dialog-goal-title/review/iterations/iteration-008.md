# Review Iteration 008

## Dispatcher

Mode: review. Target agent: deep-review. Resolved route: mode=review target_agent=deep-review. Run: run-008.

## Dimension

Traceability, second angle: compare the Claude and Pi/OpenCode relaunch playbooks, the session-relaunch README and the sk-git rebase sentence with the implementation described by each. The review followed bd79708c2f..59e95420f3 and used the verify budget profile. No tests were run.

## Files Reviewed

- .skilled/hooks/session-relaunch/README.md:112
- .skilled/bin/skilled-loop:1208, .skilled/bin/skilled-loop:1472
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:256
- .skilled/hooks/session-relaunch/claude/stop-arm.mjs:136, .skilled/hooks/session-relaunch/claude/stop-arm.mjs:138
- .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:940, .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:963
- .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:78
- .skilled/skills/sk-git/SKILL.md:322
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:673
- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2828

## Findings - New

No new finding ID. One P2 refinement was recorded against active finding R1-P2-001.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **README treats an empty startup checksum as proof that the wrapper did not change** -- .skilled/bin/skilled-loop:1472 -- This refines active finding R1-P2-001 with a newly changed documentation claim. The README says an empty checksum produces no notice or log entry, but the wrapper does not validate the startup checksum before storing it. If that first read is empty and a later hop read succeeds, the non-empty hop checksum differs from the empty baseline and the wrapper emits the notice and wrapper-changed event.
Finding class: matrix/evidence
Scope proof: The README assertion and wrapper checksum comparison are in the declared target. The range diff shows the README claim was added in bd79708c2f..59e95420f3, and the current wrapper lines show the empty-startup case is not guarded.
Affected surface hints: wrapper startup checksum; hop-time checksum comparison; stderr notice; relaunch.log wrapper-changed event.
Case: The wrapper checksum read is empty before the first runtime launch, then a later hop reads the unchanged wrapper file successfully.
Evidence: [SOURCE: .skilled/hooks/session-relaunch/README.md:112] [SOURCE: .skilled/bin/skilled-loop:1208] [SOURCE: .skilled/bin/skilled-loop:1472]

## Traceability Checks

- playbook_capability: partial. The Claude missing-transcript claim matches its Stop adapter and focused test. The wrapper checksum paragraph contradicts the startup-baseline behavior. Pi/OpenCode implementation evidence is blocked by the declared scope.
- spec_code: partial. One existing P2 was refined; this pass did not complete the packet-wide requirement crosswalk.
- checklist_evidence: deferred.
- skill_agent: deferred.
- agent_cross_runtime: deferred.
- feature_catalog_code: deferred.

## Integration Evidence

- .skilled/hooks/session-relaunch/README.md to .skilled/bin/skilled-loop: the paragraph at README line 112 describes the startup checksum and the hop-time comparison at wrapper lines 1208 and 1472. The non-empty hop guard leaves an empty startup baseline unhandled.
- session-relaunch-claude.md to stop-arm.mjs and claude-adapters.test.cjs: the playbook at line 256 says a missing transcript path stamps deferredAt. The adapter calls markParked after logging missing-transcript-path, and the test asserts the stamp and log event at lines 940-965.
- The Pi/OpenCode playbook was read, but its adapter implementation is outside this target, so runtime behavior remains blocked.
- The changed sk-git sentence at line 322 was read, but its rebase-id implementation is outside this target, so its implementation claim remains blocked.

## Edge Cases

- An empty checksum at the hop-time read is guarded. An empty checksum at startup is stored at line 1208 and later compared at line 1472, which is the false-notice case.
- The saved strategy had marked playbook_capability blocked when no scenario was selected. This dispatch named the Claude and Pi/OpenCode scenarios, so this pass used the newly selected cases and recorded the out-of-scope implementation limits.
- The Pi/OpenCode and sk-git implementation claims were not treated as passes because their implementation files were not in the declared target.

## Confirmed-Clean Surfaces

- The Claude missing-transcript Stop path preserves pending state, marks the record deferred and logs missing-transcript-path, as the changed playbook sentence states.

## Ruled Out

- The changed Claude playbook statement about deferredAt is supported by stop-arm.mjs and claude-adapters.test.cjs.
- The wrapper notice behavior for a non-empty changed checksum is consistent with the README. The mismatch is limited to an empty startup baseline.

## Next Focus

Select another traceability pair only if both the documentation and implementation files are in the declared target. The Pi/OpenCode adapter mapping and the sk-git rebase-id implementation remain blocked by scope. Do not repeat the wrapper checksum baseline or Claude missing-transcript checks.

## Verdict

PASS. One active P2 advisory remains. There are no P0 or P1 findings in this iteration.

Review verdict: PASS
