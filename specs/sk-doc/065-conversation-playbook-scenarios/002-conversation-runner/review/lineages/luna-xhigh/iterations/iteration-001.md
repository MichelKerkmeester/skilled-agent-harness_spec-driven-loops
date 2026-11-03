# Review Iteration 1

## Dimension

Correctness: logic, behavior, error handling, and boundary guarantees.

This pass also addressed the complete operator review focus. It traced cleanup before and after runtime-context registration, repository snapshot ordering and content hashing, scratch-root resolution, all five runtime adapter definitions, Codex hook trust and restoration, and the shared JSON conversation parser and its tests. It did not start tmux, run the live runner, or execute tests.

## Files Reviewed

- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/acceptance-criteria.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/review/lineages/luna-xhigh/steer.md (checked; absent)

## Findings by Severity

### P0 Findings

1. **A runtime-project symlink bypasses the scratch boundary**
   - Case: the selected runtime directory under an otherwise external, marked scratch directory is a symlink to the repository root.
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1430
   - Evidence: the guard canonicalizes and compares only the scratch parent at lines 1430-1437. It then creates/writes the marker through scratchPath/runtime and runs setup with that path as cwd at lines 1453-1467. The later projectReal value is the symlink target, and the specs/state leaves are checked only against that same target at lines 1478-1489. A repository-root target therefore satisfies the leaf check. The common guard feeds all five adapters; Codex, for example, launches with approval and sandbox bypass flags at line 1043. Refusal coverage tests a scratch parent inside the repo and a linked specs leaf, but not a symlink at scratch/runtime (test lines 222-263).
   - User impact: the runner can write the scratch marker and setup output into the repository, then start a privileged interactive runtime there despite the stated scratch-only boundary.
   - Finding class: cross-consumer
   - Scope proof: one shared guardScratch path is used before every runtime. Static inspection covered all five adapter definitions; the refusal tests cover the neighboring path cases but omit the runtime-project root symlink.
   - Affected surfaces: scratch guard, setup command cwd, Claude Code/OpenCode/Codex/Pi/Devin launch.
   - Recommendation: resolve the runtime project before any marker write or setup command and refuse it if it resolves inside the repository or outside the canonical scratch root.
   - Adversarial self-check: re-read the path resolver, entire guard, five adapter table, REQ-001 and refusal tests. The strongest counterargument is that the leaf containment check catches escapes. It does not: projectReal is itself the symlink target, so repository leaves are treated as contained. The scratch parent check never validates the project child. No in-scope test or caller provides a second project-root check. Keep P0.
   - Claim adjudication:
     {
       "findingId": "LUNA-XHIGH-001",
       "claim": "A runtime child symlink can redirect the project root into the repository before the current containment checks run.",
       "evidenceRefs": [
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1430-1432",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1453-1467",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1478-1489",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1040-1047",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:222-263"
       ],
       "counterevidenceSought": "Re-read the complete scratch guard, path resolution helpers, adapter launches, REQ-001, and refusal tests; no check resolves the project root against repoPath or scratchPath before marker/setup. The linked specs-leaf test does not cover a symlink at scratch/runtime.",
       "alternativeExplanation": "The project is intended to be created below scratch and the marker may appear to establish ownership; however mkdirp and marker writes follow an existing runtime-child symlink, and the later realpath comparison uses that target as the project boundary.",
       "finalSeverity": "P0",
       "confidence": 0.96,
       "downgradeTrigger": "Downgrade if the guard resolves the runtime project before any write, rejects project roots inside the repository or outside the canonical scratch root, and a regression test covers scratch/runtime -> repository."
     }

### P1 Findings

2. **SIGINT during setup leaves the detached setup child running**
   - Case: a setup command is still running when the operator sends SIGINT or SIGTERM.
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2749
   - Evidence: runBoundedCommand starts detached bash children at lines 1359-1367 and tracks them only when ctx.children exists at lines 1371-1377. main calls guardScratch without ctx at lines 2749-2754. The signal handlers call cleanupAll and immediately exit at lines 1884-1890; cleanupAll only visits active runtime contexts. The signal test waits for the subject to start before sending SIGINT, so it does not exercise setup (test lines 1090-1125).
   - User impact: the parent runner can exit while setup or one of its descendants continues running and writing.
   - Finding class: class-of-bug
   - Scope proof: every setup command uses the same runBoundedCommand path; the no-context call is in main's sole guard loop.
   - Affected surfaces: setup process group, signal handlers, cleanupAll.
   - Recommendation: register setup process groups with cleanup before starting them and terminate/verify them on both SIGINT and SIGTERM.
   - Claim adjudication:
     {
       "findingId": "LUNA-XHIGH-002",
       "claim": "A signal during main's setup phase can exit before the detached setup child is registered for cleanup.",
       "evidenceRefs": [
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1362-1377",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2749-2754",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1870-1890",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:1090-1125",
         "specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:172"
       ],
       "counterevidenceSought": "Re-read child tracking, cleanupAll, SIGINT/SIGTERM handlers, main's guard call, and the signal regression. The test covers interruption after subject start, not during setup.",
       "alternativeExplanation": "The setup timeout kills the command group on timeout, but it does not cover an external signal that calls cleanupAll and process.exit before the timeout callback.",
       "finalSeverity": "P1",
       "confidence": 0.95,
       "downgradeTrigger": "Downgrade if a signal during a blocking setup command kills and verifies the entire detached process group and a regression covers both SIGINT and SIGTERM before runtime activation."
     }

3. **Setup-time repository writes occur before the baseline snapshot**
   - Case: a successful setup command writes a file under specs or a watched state subtree.
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2749
   - Evidence: setup executes inside guardScratch at lines 1458-1475 and receives CONVERSATION_REPO_ROOT at lines 1460-1466. main awaits this guard at lines 2749-2754 before runRuntime takes its first snapshot at lines 2352-2354. The after snapshot can therefore equal the post-setup baseline even after setup changed a watched repository file.
   - User impact: a run may report an unchanged repository when its setup phase already modified a watched file, contrary to REQ-008's fail-on-difference guarantee.
   - Finding class: class-of-bug
   - Scope proof: the main-to-guard-to-runRuntime order is the only setup-to-snapshot path; setup has no earlier snapshot.
   - Affected surfaces: setup commands, repository snapshot baseline, REQ-008.
   - Recommendation: capture the repository baseline before setup and compare after setup and runtime, or constrain setup to read-only repository access with an enforced boundary.
   - Claim adjudication:
     {
       "findingId": "LUNA-XHIGH-003",
       "claim": "Repository changes made by setup commands are absent from the before/after comparison because the baseline is captured only after setup returns.",
       "evidenceRefs": [
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1458-1475",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2749-2763",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2352-2354",
         "specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:173"
       ],
       "counterevidenceSought": "Re-read the setup flow, environment passed to setup, snapshot timing, and REQ-008. The runtime snapshot regression covers a check-time append, but not setup-time changes.",
       "alternativeExplanation": "Setup is preparation rather than the interactive runtime; however the workflow runs setup as part of each selected runtime's execution, exposes the repository root to it, and REQ-008 requires repository changes from a run to fail.",
       "finalSeverity": "P1",
       "confidence": 0.86,
       "downgradeTrigger": "Downgrade if the contract expressly excludes setup from repository-integrity checks and setup is made read-only, or if a pre-setup baseline detects setup mutations."
     }

### P2 Findings

None identified in this correctness pass.

## Focus Coverage

- Cleanup: runtime cleanup kills tracked child groups and tears down the pane/server, but the setup-phase signal path is not registered for cleanup (Finding 2).
- Repository snapshot: content hashes cover the configured trees during runtime; setup precedes the first snapshot (Finding 3). Read-failure behavior in tree traversal remains for the security pass.
- Scratch guard: the project child can resolve to the repository before setup and launch (Finding 1).
- Five runtime adapters: inspected all declared launch, restart, startup, and parser bindings. No separate adapter-only correctness defect was confirmed; the shared scratch issue reaches all five.
- Codex hook trust and undo: hooks remain opt-in. The path captures the user's config before Codex launch and restores project-owned tables afterward; the regression checks restoration while preserving an outside-project table and checks opt-out leaves config untouched. No distinct correctness defect confirmed.
- JSON conversation parsing: the validator parses the first recognized block as JSON, diagnoses duplicate blocks, and the runner imports the same parser; regression coverage was read. No separate parser defect confirmed.
- Static only: no tests, runner invocation, tmux, live CLI, or user Codex config was touched.

## Traceability Checks

- spec_code: FAIL — REQ-001, REQ-007, and REQ-008 have the mismatches described above.
- checklist_evidence: PARTIAL — AC-011/T018 remain marked unmet. Validation was not run under the dispatch's no-repository-tooling boundary.

## Scope Violations

- The workflow's step_seed_coverage_graph invokes the shared coverage graph upsert against the packet, outside this lineage's write authority. I skipped that write. Graph data is unavailable; this iteration uses direct source, producer/consumer, and negative-test evidence under the graphless fallback contract.

## Ruled-Out Directions

- The hook restoration test intentionally preserves an external-project hook table while restoring the scratch project's changed/added tables; this is consistent with preserving unrelated user config rather than a missed undo.
- The parser's behavior for an absent block returns an empty result with no diagnostic; package validation has a separate requirement for packages without conversation scenarios, so no contract mismatch was established from that return alone.

## Verdict

FAIL because the confirmed runtime-project symlink escape violates the P0 scratch-only trust boundary. Two P1 cleanup and repository-integrity gaps also require correction.

## Next Dimension

Security will recheck the scratch boundary, the privileged adapter launches, the Codex hook-trust mutation boundary, repository hashing, and signal cleanup before convergence.

## Sources

- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:113-136]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1239-1327]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1359-1395]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1426-1492]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1824-1901]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2344-2466]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2743-2763]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:208-263]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:609-686]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:1090-1125]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:189-219]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-549]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:45-78]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:558-565]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:166-173]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/acceptance-criteria.md:67-94]

Review verdict: FAIL
