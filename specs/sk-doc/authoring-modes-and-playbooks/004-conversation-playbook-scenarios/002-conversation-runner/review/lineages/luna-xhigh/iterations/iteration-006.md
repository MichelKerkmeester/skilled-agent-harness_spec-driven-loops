# Review Iteration 6

## Dimension

Correctness: cross-check the implementation's observable outcomes against cleanup, containment, snapshot, and trust requirements.

All configured dimensions were already covered, so this pass used the workflow's cross-reference fallback. It compared the runner's entry/exit paths with REQ-001, REQ-006 through REQ-008, AC-001, AC-004, and AC-005, then rechecked their producer, cleanup, and test paths. It also covered the full operator focus: cleanup on every exit path, repository snapshot, scratch guard, all five runtime adapters, opt-in Codex hook trust and undo in the user's config, and JSON conversation parsing with its test. No new finding was established; the eight open findings remain.

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
   - `guardScratch` writes the project marker before resolving the runtime child. It later treats the child realpath as the project boundary, so a child link to the repository passes its leaf checks. Existing refusal coverage tests a linked `specs` leaf, not a linked runtime project.
   - Evidence: runner lines 1430-1489; tests lines 222-263.

2. **Codex runs without a host filesystem sandbox** (LUNA-XHIGH-004; still open)
   - The Codex launch and resume arguments disable sandboxing. A tmux working directory only selects the initial directory; it does not confine filesystem access.
   - Evidence: runner lines 1040-1047 and 1566-1588; [Codex CLI option definition](https://github.com/openai/codex/blob/main/codex-rs/utils/cli/src/shared_options.rs).

### P1 Findings

3. **SIGINT during setup leaves the detached setup child running** (LUNA-XHIGH-002; still open)
   - Setup executes before runtime context registration and is launched without a context. Signal cleanup iterates only registered contexts; the test interrupts after a subject process is visible.
   - Evidence: runner lines 1362-1377, 2749-2754, and 1870-1890; test lines 1090-1125.

4. **Setup-time repository writes occur before the baseline snapshot** (LUNA-XHIGH-003; still open)
   - Setup completes in `guardScratch` before `runRuntime` takes the pre-run snapshot. A setup write to a watched path is therefore invisible to the before/after comparison.
   - Evidence: runner lines 1458-1475, 2352-2354, and 2749-2763; REQ-008 at spec line 173.

5. **Unreadable snapshot subtrees are treated as empty** (LUNA-XHIGH-005; still open)
   - `walkFiles` catches directory-read errors and returns no files; `snapshotRepo` has no incomplete-snapshot result to fail the run.
   - Evidence: runner lines 1239-1284.

6. **Cleanup reports child processes gone without verification** (LUNA-XHIGH-008; still open)
   - The timeout callback kills the original process group and immediately drops its PID from tracking. Cleanup clears any remaining PIDs and sets `childrenGone=true`; unlike the pane group, setup/check groups have no survivor poll. The regression checks timeout outcome and later-turn suppression, not child death.
   - Evidence: runner lines 1362-1394 and 1834-1863; tests lines 541-568; REQ-006/007 at spec lines 171-172.

### P2 Findings

7. **Removed pre-existing project hook trust is not restored** (LUNA-XHIGH-006; still open)
   - The restoration pass handles added tables and changed bodies that remain present, but does not detect a pre-existing project table removed during the opt-in run. The test covers additions, changed bodies, and an outside table only.
   - Evidence: runner lines 481-535; tests lines 609-667.

8. **AC-005 is marked Met without evidence for its specs write case** (LUNA-XHIGH-007; still open)
   - The regression appends to the watched state queue but does not perform the separate `specs/` write in AC-005.
   - Evidence: tests lines 571-605; acceptance-criteria line 58.

## Focus Coverage

- Cleanup on every exit path: setup-phase signal handling (LUNA-XHIGH-002) and setup/check child survivor verification (LUNA-XHIGH-008) remain incomplete; the pane-only check does not prove both REQ-007 branches.
- Repository snapshot: setup precedes the baseline (LUNA-XHIGH-003), recursive read errors can hide content (LUNA-XHIGH-005), and the AC-005 specs-write case is not exercised (LUNA-XHIGH-007).
- Scratch guard: the runtime child is written through before its realpath is checked against the repository (LUNA-XHIGH-001).
- Five runtime adapters: the table covers Claude Code, OpenCode, Codex, Pi, and Devin; the Codex no-sandbox launch remains a P0 (LUNA-XHIGH-004), with no additional mapping defect established.
- Codex hook trust and undo: trust is opt-in and outside-project entries are preserved, but deleting an existing project trust key is not restored or reported (LUNA-XHIGH-006). The user's Codex config was not accessed.
- JSON conversation parsing: runner and validator still consume the shared parser and reject its findings; no new parser inconsistency was found.
- Static review only: no test command, live runner, tmux, or user config was run or touched.

## Traceability Checks

- spec_code: FAIL — active containment, privilege, cleanup, and snapshot findings conflict with the packet's guarantees.
- checklist_evidence: PARTIAL — AC-005 evidence is incomplete; AC-011/T018 remains Unmet.

## SCOPE VIOLATIONS

- The graph upsert would write to a shared packet graph outside the authorized lineage. It remains skipped; graphless fallback evidence is recorded locally.

## Next Dimension

All dimensions remain covered. If the no-progress threshold triggers recovery, pivot to the least-reviewed correctness path and recheck the cleanup and repository-boundary guarantees at narrower function scope.

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
