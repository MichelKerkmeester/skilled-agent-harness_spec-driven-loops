# Review Iteration 3

## Dimension

Traceability: implementation-to-spec alignment, acceptance evidence, and checklist closure.

This pass traced each safety and parser behavior in the operator focus to REQ-001 through REQ-015, AC-001 through AC-014, the task log, and the recorded test claims. It also rechecked cleanup, repository snapshots, scratch containment, all five adapters, Codex hook trust, and JSON parser consumers.

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
   - REQ-001 refusal evidence covers a scratch parent inside the repository and a project leaf escaping the scratch project. It does not cover scratch/runtime itself resolving to the repository. The shared guard still allows that root before setup.

2. **Codex runs without a host filesystem sandbox** (LUNA-XHIGH-004; still open)
   - NFR-S02 says the scratch guard confines the subject, but the Codex adapter disables its sandbox. The runner gives it a working directory, not a filesystem boundary.

### P1 Findings

3. **SIGINT during setup leaves the detached setup child running** (LUNA-XHIGH-002; still open)
   - REQ-007 covers setup/check children and signals. AC-004's signal evidence covers an interruption mid-turn after the subject starts, not a signal while setup is running.

4. **Setup-time repository writes occur before the baseline snapshot** (LUNA-XHIGH-003; still open)
   - REQ-008 requires before/after snapshots for each run. Setup receives the repository root and completes before the first snapshot.

5. **Unreadable snapshot subtrees are treated as empty** (LUNA-XHIGH-005; still open)
   - REQ-008 says every file in the monitored trees is hashed. Traversal errors are silently ignored.

### P2 Findings

6. **Removed pre-existing project hook trust is not restored** (LUNA-XHIGH-006; still open)
   - The trust test covers addition and body change, but a removed pre-existing table is neither restored nor reported as failure.

7. **AC-005 is marked Met without evidence for its specs write case**
   - Case: AC-005 claims evidence for both a write in specs and an append in watched state.
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:571
   - Evidence: the sole repoChanged test creates a check that appends only to .skilled/skills/.state/decision-capture/queue.md at lines 571-605. The assertion checks that queue path appears in the after snapshot. The test contains no write under specs, despite AC-005's explicit two-case Given.
   - User impact: AC-005's Met status overstates the exercised snapshot evidence; a regression that drops the specs root from snapshotRepo could pass this recorded test evidence.
   - Finding class: matrix/evidence
   - Scope proof: exact search across the bound runner test finds only this REPO_CHANGED test and only the state queue write.
   - Recommendation: add evidence for a fake write under specs or narrow AC-005 to the state-path case actually covered.

## Focus Coverage

- Cleanup: REQ-007 and AC-004 promise cleanup, but the existing signal test only interrupts after subject activation; the setup-child gap remains LUNA-XHIGH-002.
- Repository snapshot: the code hashes specs and configured state roots, but setup begins before its baseline and traversal failures produce no completeness failure (LUNA-XHIGH-003 and 005). AC-005's test only exercises the state root (new finding 7).
- Scratch guard: current refusal cases omit a runtime-project root symlink (LUNA-XHIGH-001).
- Five runtime adapters: the adapter table and REQ-011/AC-007 name the same five runtimes and fixture screens. No separate trace mismatch was established beyond Codex sandbox behavior (LUNA-XHIGH-004).
- Codex hook trust and undo: trust remains opt-in, tests cover project additions/body changes and preserve outside-project tables; deletion of a pre-existing project table remains unverified (LUNA-XHIGH-006).
- JSON conversation parsing: validator and runner share parseConversationScript; loadScript refuses any parser findings, including a duplicate block, and validator maps the same findings to package errors. No parser consistency defect was found.
- Closure evidence: AC-011/T018 remains explicitly Unmet, so packet closure is already blocked pending strict validation. This review did not run that validation.

## Traceability Checks

- spec_code: FAIL — REQ-001, REQ-007, REQ-008 and NFR-S02 have the mismatches documented in the active findings.
- checklist_evidence: PARTIAL — AC-005 is marked Met without the specs-write case in its test; AC-011/T018 is Unmet.

## Scope Violations

- The workflow's graph upsert would write to the shared coverage graph outside this lineage. Skipped; the iteration uses direct code, spec-to-test tracing, and the graphless fallback ledger.

## Ruled-Out Directions

- Runner and validator do not disagree on malformed or duplicate JSON conversation blocks: they share the parser, and loadScript refuses parser findings.
- The five probe screen mappings align with the five runtime names in REQ-011 and AC-007 based on static source/test inspection.

## Next Dimension

Maintainability will inspect lifecycle decomposition, repeated path and state handling, fixture quality, and whether the remaining implementation/test structure makes the recorded guarantees maintainable.

## Sources

- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1239-1492]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2578-2607]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:208-263]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:571-605]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:609-686]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:1090-1125]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:420-565]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:166-185]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:225-229]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/acceptance-criteria.md:52-94]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/tasks.md:64-90]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:95-101]

Review verdict: FAIL
