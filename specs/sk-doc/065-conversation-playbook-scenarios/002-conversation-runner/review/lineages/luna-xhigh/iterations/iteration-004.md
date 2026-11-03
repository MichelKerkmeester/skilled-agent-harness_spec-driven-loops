# Review Iteration 4

## Dimension

Maintainability: safe follow-on changes, process ownership, fixture fidelity, and whether the code can uphold its documented cleanup and safety guarantees.

This pass again covered the full operator focus: cleanup paths, repository snapshotting, scratch guard, all five runtime adapters, Codex hook-trust rollback, and shared JSON parsing. It traced child ownership through spawn, timeout, cleanup, and verification, and compared the cleanup assertions with the test fixture and REQ-006/007.

## Files Reviewed

- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/acceptance-criteria.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/review/lineages/luna-xhigh/steer.md (checked; absent)

## Findings by Severity

### P0 Findings

1. **A runtime-project symlink bypasses the scratch boundary** (LUNA-XHIGH-001; still open)
   - Adversarial recheck: the code verifies the scratch parent, follows the child when writing the marker, then compares protected leaves only to that child's real path. The neighboring refusal tests do not validate the project root. No second guard was found.

2. **Codex runs without a host filesystem sandbox** (LUNA-XHIGH-004; still open)
   - Adversarial recheck: Codex's launch and resume include the no-sandbox option. startSubject sets tmux cwd only. The official option contract says this mode is for externally sandboxed environments, and the runner provides none.

### P1 Findings

3. **SIGINT during setup leaves the detached setup child running** (LUNA-XHIGH-002; still open)
   - Setup runs before context registration and its child is not tracked for signal cleanup.

4. **Setup-time repository writes occur before the baseline snapshot** (LUNA-XHIGH-003; still open)
   - The pre-run snapshot begins after setup completes.

5. **Unreadable snapshot subtrees are treated as empty** (LUNA-XHIGH-005; still open)
   - Any directory enumeration error contributes no files and no incomplete-snapshot status.

6. **Cleanup reports child processes gone without verification**
   - Case: a timed-out check/setup child has a descendant that leaves its original process group, or the original group has not exited when timeout handling returns.
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1376
   - Evidence: the timeout callback sends SIGKILL to the original group and immediately calls finish; finish removes the PID from ctx.children before waiting for close. cleanupContext later kills and clears remaining tracked PIDs, then sets childrenGone=true without verifying child groups. The separate pgrep verification only covers the pane group. The timeout regression uses sleep 30 and checks turn status/later-turn suppression, not a detached descendant.
   - User impact: a setup/check process can continue after the runner's cleanup result, possibly writing after the repository snapshot and leaving a child process behind while the run claims cleanup is complete.
   - Finding class: class-of-bug
   - Scope proof: every setup/check uses runBoundedCommand; all child cleanup flows through the same tracking set and childrenGone result.
   - Affected surfaces: setup/check child process groups, timeout handling, cleanupContext.
   - Recommendation: keep timed-out groups tracked until close, verify all child groups and descendants are gone, and fail as CLEANUP_INCOMPLETE when verification fails.
   - Claim adjudication:
     {
       "findingId": "LUNA-XHIGH-008",
       "claim": "The runner does not verify setup/check child groups after signaling them and can report childrenGone=true while an escaped or not-yet-exited descendant remains.",
       "evidenceRefs": [
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1362-1394",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1771-1815",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1834-1863",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-568",
         "specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:171-172"
       ],
       "counterevidenceSought": "Re-read process-group kill, timeout finish, cleanupContext, groupAlive, terminateGroup, timeout regression, and REQ-006/007. Pane descendants are polled, but setup/check child groups are not; timeout coverage uses only sleep 30.",
       "alternativeExplanation": "SIGKILL should terminate members still in the original process group, but a command can create a new session/group, and the timeout path drops tracking before close or descendant verification.",
       "finalSeverity": "P1",
       "confidence": 0.93,
       "downgradeTrigger": "Downgrade if a detached-descendant timeout test proves no child remains and cleanup reports failure when descendant verification fails."
     }

### P2 Findings

7. **Removed pre-existing project hook trust is not restored** (LUNA-XHIGH-006; still open)
   - The restore audit checks additions and body changes, but not a pre-existing table removed during a trust-enabled run.

8. **AC-005 is marked Met without evidence for its specs write case** (LUNA-XHIGH-007; still open)
   - The only repoChanged regression appends to the watched state queue; it does not write into specs as AC-005 states.

## Focus Coverage

- Cleanup: setup-signal handling (LUNA-XHIGH-002) and child-group verification (Finding 6) remain gaps. The pane process group has a poll-and-kill path, but setup/check groups do not have the same survivor proof.
- Repository snapshot: setup precedes the baseline (LUNA-XHIGH-003), traversal errors are swallowed (LUNA-XHIGH-005), and AC-005's specs case is absent from its evidence (LUNA-XHIGH-007).
- Scratch guard: the runtime project root is not checked before marker/setup (LUNA-XHIGH-001).
- Five runtime adapters: the shared adapter table keeps the five runtime names and launch mappings in one place; Codex's unconfined launch is the separate P0 (LUNA-XHIGH-004).
- Codex hook trust and undo: opt-in and changed/added table restoration remain explicit; removed pre-existing scratch trust is not checked (LUNA-XHIGH-006).
- JSON conversation parsing: validator and runner use the same exported parser and the runner rejects any findings; no separate maintainability defect found.
- Static only: no tests, live runner, tmux, or actual user Codex config was run or touched.

## Traceability Checks

- spec_code: FAIL — active cleanup, snapshot, scratch and privilege findings conflict with requirements.
- checklist_evidence: PARTIAL — AC-005 evidence is incomplete; AC-011/T018 remains Unmet.

## SCOPE VIOLATIONS

- The workflow's graph upsert would write into a shared packet graph outside the lineage. Skipped; this review uses graphless search evidence.

## Next Dimension

If the new-finding ratio remains above the convergence threshold, run a focused cleanup/snapshot convergence pass. Otherwise proceed to synthesis.

## Sources

- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1239-1492]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1335-1395]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1566-1588]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1771-1891]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:208-263]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-568]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:609-686]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:1090-1125]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:420-565]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:166-173]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/acceptance-criteria.md:52-94]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:64-90]

Review verdict: FAIL
