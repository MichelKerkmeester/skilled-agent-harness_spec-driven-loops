# Review Iteration 5

## Dimension

Security: verify the runner's trust boundaries, privileged adapter launches, and the handling of user-owned Codex configuration.

This stabilization pass rechecked the complete operator focus: cleanup on setup, timeout, runtime, and signal exits; repository snapshot timing and completeness; the scratch/project boundary; all five runtime adapters; opt-in Codex hook trust and restoration of the user's config; and shared JSON conversation parsing plus its validator test. It also compared the runner and test coverage with the packet's requirements. No new finding survived this pass; the eight previously adjudicated findings remain open.

## Files Reviewed

- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/acceptance-criteria.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/review/lineages/luna-xhigh/steer.md (checked; absent)

## Findings by Severity

### P0 Findings

1. **A runtime-project symlink bypasses the scratch boundary** (LUNA-XHIGH-001; still open)
   - Recheck: `guardScratch` validates the scratch parent, then writes through `scratch/<runtime>` before resolving that project path. Its later containment checks use the resolved project as the boundary. The refusal tests cover a scratch parent inside the repository and a linked `specs` leaf, but not `scratch/<runtime> -> repository`.
   - Evidence: runner lines 1430-1489; tests lines 222-263.

2. **Codex runs without a host filesystem sandbox** (LUNA-XHIGH-004; still open)
   - Recheck: both Codex launch and resume use `--dangerously-bypass-approvals-and-sandbox`; `startSubject` sets a tmux working directory but does not add an OS sandbox. The documented flag explicitly disables sandboxing and expects an external sandbox, which this runner does not provide.
   - Evidence: runner lines 1040-1047 and 1566-1588; [Codex CLI option definition](https://github.com/openai/codex/blob/main/codex-rs/utils/cli/src/shared_options.rs).

### P1 Findings

3. **SIGINT during setup leaves the detached setup child running** (LUNA-XHIGH-002; still open)
   - Setup calls `runBoundedCommand` before runtime context registration and without a cleanup context. The signal handler cleans only registered runtime contexts; its regression sends SIGINT after the subject starts.
   - Evidence: runner lines 1362-1377, 2749-2754, and 1870-1890; test lines 1090-1125.

4. **Setup-time repository writes occur before the baseline snapshot** (LUNA-XHIGH-003; still open)
   - `guardScratch` runs scenario setup before `runRuntime` captures `repo-before.txt`, so a setup write to a watched repository path is part of the baseline and cannot produce `REPO_CHANGED`.
   - Evidence: runner lines 1458-1475, 2352-2354, and 2749-2763; REQ-008 at spec line 173.

5. **Unreadable snapshot subtrees are treated as empty** (LUNA-XHIGH-005; still open)
   - `walkFiles` catches every directory-read error and returns no entries. `snapshotRepo` has no incomplete/error result, so a path omitted in both snapshots can hide later writes.
   - Evidence: runner lines 1239-1284.

6. **Cleanup reports child processes gone without verification** (LUNA-XHIGH-008; still open)
   - A timeout sends SIGKILL to the original child process group and immediately removes its PID from tracking. `cleanupContext` clears remaining child PIDs and hardcodes `childrenGone=true`; only the pane group is checked for survivors. The timeout test uses `sleep 30` and does not assert descendant termination.
   - Evidence: runner lines 1362-1394 and 1834-1863; tests lines 541-568; REQ-006/007 at spec lines 171-172.

### P2 Findings

7. **Removed pre-existing project hook trust is not restored** (LUNA-XHIGH-006; still open)
   - `restoreHookTrust` checks currently present project tables for additions and changed bodies, but not a pre-existing project table removed during a trust-enabled run. The regression covers additions, changed bodies, and an outside-project table, not deletion of an existing project key.
   - Evidence: runner lines 481-535; tests lines 609-667.

8. **AC-005 is marked Met without evidence for its specs write case** (LUNA-XHIGH-007; still open)
   - The `repoChanged` regression appends to a watched state queue; it does not exercise the separate `specs/` write named in AC-005.
   - Evidence: tests lines 571-605; acceptance-criteria line 58.

## Focus Coverage

- Cleanup on every exit path: setup signals (LUNA-XHIGH-002) and child-group verification (LUNA-XHIGH-008) remain open; the pane-group cleanup check does not establish setup/check child cleanup.
- Repository snapshot: setup precedes the baseline (LUNA-XHIGH-003), traversal failures disappear (LUNA-XHIGH-005), and the AC-005 specs-write test is missing (LUNA-XHIGH-007).
- Scratch guard: the runtime project symlink is followed before project-root containment is checked (LUNA-XHIGH-001).
- Five runtime adapters: Claude Code, OpenCode, Codex, Pi, and Devin remain centralized in the adapter table. Codex's launch and resume opt out of sandboxing (LUNA-XHIGH-004); no additional adapter-specific defect was established.
- Codex hook trust and undo in the user's config: trust remains opt-in and restoration preserves outside-project tables, but removal of a pre-existing project table is not restored or reported (LUNA-XHIGH-006). No actual user Codex config was read or changed.
- JSON conversation parsing: runner and validator use the shared parser and reject parser findings; the validator's JSON parsing tests remain consistent. No new parser defect was established.
- Static review only: no tests, live runner, tmux, or actual user config were run or touched.

## Traceability Checks

- spec_code: FAIL — active scratch, privilege, cleanup, and snapshot findings conflict with stated guarantees.
- checklist_evidence: PARTIAL — AC-005 evidence is incomplete; AC-011/T018 remains Unmet.

## SCOPE VIOLATIONS

- The workflow's graph upsert writes to a shared packet graph outside the authorized lineage. Skipped; graphless fallback evidence remains in this lineage.

## Next Dimension

All four configured dimensions have been covered. Continue the security stabilization review if convergence remains blocked; the active P0 findings prevent legal convergence.

## Sources

- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:349-540]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1239-1284]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1335-1395]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1430-1492]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1566-1588]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1771-1891]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2578-2607]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2749-2763]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:208-263]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-605]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:609-686]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:1090-1125]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:189-219]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:420-565]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:166-173]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/acceptance-criteria.md:52-94]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:64-90]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:95-101]

Review verdict: FAIL
