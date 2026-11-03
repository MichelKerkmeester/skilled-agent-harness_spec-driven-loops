# Review Iteration 7

## Dimension

Traceability: recovery pass using narrower finding-to-evidence checks and a severity review of the two open P2s.

After two consecutive zero-novelty iterations, the loop entered recovery. All four dimensions were already covered, so I used the least-reviewed traceability surface: compare the Codex trust rollback and repository-change claims directly with their code, tests, and acceptance criteria, then recheck the remaining P0/P1 evidence. This pass also covered the complete operator focus: cleanup on every exit, repository snapshot, scratch guard, the five runtime adapters, opt-in Codex hook trust and its undo in the user's config, and JSON conversation parsing with its test. Neither P2 has evidence for an upgrade, and no new finding was established.

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
   - The runtime child path is used for marker writes and setup before its realpath is validated. A child symlink to the repository therefore defeats the intended scratch boundary; no existing refusal test covers that child path.
   - Evidence: runner lines 1430-1489; tests lines 222-263.

2. **Codex runs without a host filesystem sandbox** (LUNA-XHIGH-004; still open)
   - Both Codex commands include the option that disables sandboxing. The runner only sets the tmux starting directory and supplies no external confinement.
   - Evidence: runner lines 1040-1047 and 1566-1588; [Codex CLI option definition](https://github.com/openai/codex/blob/main/codex-rs/utils/cli/src/shared_options.rs).

### P1 Findings

3. **SIGINT during setup leaves the detached setup child running** (LUNA-XHIGH-002; still open)
   - Setup runs before a runtime context exists and is launched without a context to track its child. The signal path cleans active contexts only; its regression interrupts after subject startup.
   - Evidence: runner lines 1362-1377, 2749-2754, and 1870-1890; test lines 1090-1125.

4. **Setup-time repository writes occur before the baseline snapshot** (LUNA-XHIGH-003; still open)
   - The pre-run snapshot is produced after `guardScratch` has completed setup, so setup changes to watched paths cannot be observed as run changes.
   - Evidence: runner lines 1458-1475, 2352-2354, and 2749-2763; REQ-008 at spec line 173.

5. **Unreadable snapshot subtrees are treated as empty** (LUNA-XHIGH-005; still open)
   - `walkFiles` swallows directory-read errors, and `snapshotRepo` does not expose an incomplete snapshot to the caller.
   - Evidence: runner lines 1239-1284.

6. **Cleanup reports child processes gone without verification** (LUNA-XHIGH-008; still open)
   - Timeout handling removes a child PID from tracking immediately after signaling its process group. Cleanup then sets `childrenGone=true` without checking that group or descendants; timeout coverage does not assert no child remains.
   - Evidence: runner lines 1362-1394 and 1834-1863; tests lines 541-568; REQ-006/007 at spec lines 171-172.

### P2 Findings

7. **Removed pre-existing project hook trust is not restored** (LUNA-XHIGH-006; still open; P2 retained)
   - The restore pass checks added and changed tables that still exist. It never compares snapshot tables missing from the current config. The test exercises added/changed project entries and an outside-project entry, not removal of a pre-existing key. The observed consequence is an unreported missing prior trust entry; the evidence does not establish a higher-severity impact.
   - Evidence: runner lines 481-535; tests lines 609-667.

8. **AC-005 is marked Met without evidence for its specs write case** (LUNA-XHIGH-007; still open; P2 retained)
   - The only `repoChanged` regression appends to the watched state queue. It does not perform the separately required `specs/` write. This is a verification gap, not evidence that snapshot behavior itself fails for that case.
   - Evidence: tests lines 571-605; acceptance-criteria line 58.

## Focus Coverage

- Cleanup on every exit path: setup interruption and unverified child cleanup remain open (LUNA-XHIGH-002 and LUNA-XHIGH-008).
- Repository snapshot: setup occurs before the baseline, traversal errors are hidden, and the acceptance test misses the `specs/` branch (LUNA-XHIGH-003, LUNA-XHIGH-005, and LUNA-XHIGH-007).
- Scratch guard: the real runtime child is checked only after marker and setup writes (LUNA-XHIGH-001).
- Five runtime adapters: all five remain mapped in the shared adapter table; Codex's sandbox bypass remains the active privilege defect (LUNA-XHIGH-004). No other mapping error was established.
- Codex hook trust and undo: trust is opt-in, existing changed entries are restored, but removed pre-existing project trust entries are not detected (LUNA-XHIGH-006). No user config was read or changed.
- JSON conversation parsing: both consumers use the shared parser and reject its findings; no parser defect was established.
- Recovery result: P2 severities retained; no new findings; the two active P0s still require a FAIL verdict.
- Static review only: no tests, live runner, tmux, or user config was run or touched.

## Traceability Checks

- spec_code: FAIL — scratch-boundary, privilege, cleanup, and snapshot guarantees remain contradicted by implementation paths.
- checklist_evidence: PARTIAL — AC-005 evidence is incomplete; AC-011/T018 remains Unmet.

## SCOPE VIOLATIONS

- Graph upsert and resource-map emission would write outside this lineage. Both are skipped; local graphless fallback evidence is retained.

## Next Dimension

Iteration 7 reaches the configured ceiling. Proceed to synthesis with `maxIterationsReached`; unresolved P0 findings keep the verdict FAIL.

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
