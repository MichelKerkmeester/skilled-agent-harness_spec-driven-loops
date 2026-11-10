# Review Iteration 2

## Dimension

Security: filesystem boundary, privilege use, user configuration, and process reliability.

This pass revisited every bound focus area: setup and runtime cleanup; snapshot completeness; scratch containment; all five runtime adapters; Codex hook trust and rollback; and shared JSON conversation parsing. It rechecked the two prior P0/P1 boundary findings and added three findings. No tests, live runner, tmux, actual Codex CLI, or user Codex configuration were run or touched.

## Files Reviewed

- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md
- specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/review/lineages/luna-xhigh/steer.md (checked; absent)

## Findings by Severity

### P0 Findings

1. **A runtime-project symlink bypasses the scratch boundary** (carried from iteration 1; reconfirmed)
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1430
   - Status: confirmed. The guard still checks the scratch parent but not the resolved runtime project before marker writes and setup. The later leaf comparison is relative to projectReal and therefore accepts a repository-root target. See iteration 1, finding LUNA-XHIGH-001.
   - Adversarial recheck: the runtime-project child symlink remains distinct from the previously tested scratch-parent and specs-leaf cases. No second project-root check was found.

2. **Codex runs without a host filesystem sandbox**
   - Case: a Codex conversation or invoked tool reads or writes an absolute path outside the selected scratch project.
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1043
   - Evidence: the adapter starts and resumes Codex with --dangerously-bypass-approvals-and-sandbox at lines 1043 and 1046. The subject launcher only passes ctx.project as tmux's starting directory at lines 1566-1583; it does not wrap the process in a container or OS filesystem sandbox. A working directory does not restrict absolute paths. The snapshot only observes specs and selected state subfolders and runs after the session. The spec says bypassed prompts are safe only because the scratch guard confines the subject (NFR-S02, line 225), but this launch disables Codex's own sandbox. The official [Codex CLI option definition](https://github.com/openai/codex/blob/main/codex-rs/utils/cli/src/shared_options.rs) says the flag skips all confirmation prompts, executes commands without sandboxing, and is intended solely for externally sandboxed environments.
   - User impact: the live Codex model can read or alter files and user config outside scratch without approval. Later detection of selected repository changes cannot prevent or undo those actions.
   - Finding class: instance-only
   - Scope proof: inspected the full adapter table and shared tmux launcher; no isolation wrapper is present. The fake subject writes relative files and does not exercise an actual Codex process.
   - Recommendation: launch Codex inside an external filesystem sandbox/container that preserves the required tmux IPC, or keep the Codex sandbox enabled.

   - Claim adjudication:
     {
       "findingId": "LUNA-XHIGH-004",
       "claim": "The Codex adapter disables its own sandbox while the runner supplies only a working directory, leaving the host filesystem unrestricted by this runner.",
       "evidenceRefs": [
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1040-1047",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1566-1583",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1269-1284",
         "specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:225",
         "specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:97"
       ],
       "counterevidenceSought": "Re-read Codex launch/resume, the tmux subject launcher, repository snapshot scope, NFR-S02 and the adapter plan. No container or OS sandbox wrapper exists. The official Codex CLI source marks this flag extremely dangerous and intended only for externally sandboxed environments.",
       "alternativeExplanation": "The process starts with cwd set to scratch and the spec treats that guard as confinement; a working directory selects relative paths but does not constrain absolute paths or commands when the CLI sandbox is explicitly bypassed.",
       "finalSeverity": "P0",
       "confidence": 0.99,
       "downgradeTrigger": "Downgrade only when the launched Codex process is externally confined to the scratch project and a regression proves absolute writes outside scratch are denied."
     }

### P1 Findings

3. **SIGINT during setup leaves the detached setup child running** (carried from iteration 1; reconfirmed)
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2749
   - Status: confirmed. Main calls the setup guard without a context, detached child tracking is conditional on that context, and the signal test interrupts only after the subject is active. See iteration 1, finding LUNA-XHIGH-002.

4. **Setup-time repository writes occur before the baseline snapshot** (carried from iteration 1; reconfirmed)
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2749
   - Status: confirmed. Setup receives CONVERSATION_REPO_ROOT and finishes before runRuntime captures repo-before.txt. See iteration 1, finding LUNA-XHIGH-003.

5. **Unreadable snapshot subtrees are treated as empty**
   - Case: a monitored directory is writable/searchable by the runner user but unreadable, and a command appends to a known file path within it.
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1242
   - Evidence: walkFiles catches every readdirSync error and returns no entries. It does not distinguish a missing optional root from EACCES or another failed traversal. If the inaccessible tree remains inaccessible across both snapshots, an append to a known writable file inside it is absent from both lists. REQ-008 requires hashes for every file under the monitored trees and fails to account for incomplete traversal.
   - User impact: the run can report a clean repository snapshot after a write to a monitored file that the walker omitted.
   - Finding class: class-of-bug
   - Scope proof: all roots in snapshotRepo use the same recursive walkFiles function; no completeness flag or error collection is returned.
   - Affected surfaces: walkFiles, snapshotRepo, REPO_CHANGED verdict.
   - Recommendation: distinguish missing roots from unreadable or failed traversal and fail the run if a monitored tree cannot be completely enumerated or hashed.
   - Claim adjudication:
     {
       "findingId": "LUNA-XHIGH-005",
       "claim": "The repository snapshot silently omits monitored directories when traversal fails, allowing changes in writable omitted paths to escape comparison.",
       "evidenceRefs": [
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1239-1251",
         ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1269-1284",
         "specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:173"
       ],
       "counterevidenceSought": "Re-read the walker, snapshot producer, and REQ-008. Missing and unreadable roots share the same catch-and-return behavior; there is no warning or failed snapshot result.",
       "alternativeExplanation": "The catch may be intended to tolerate absent optional roots, but it also suppresses EACCES and other traversal errors for roots that the contract says must be hashed.",
       "finalSeverity": "P1",
       "confidence": 0.91,
       "downgradeTrigger": "Downgrade if traversal returns typed completeness evidence and unreadable monitored roots fail the run, with a regression for a writable but unreadable watched directory."
     }

### P2 Findings

6. **Removed pre-existing project hook trust is not restored**
   - Case: a reused scratch project's pre-existing hooks.state table disappears from the user's Codex config during a trust-enabled run.
   - File: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:481
   - Evidence: restoreHookTrust loops over current tables to find additions and changed bodies, then checks only that additions were removed and changed bodies restored. A pre-run project table absent from currentTables is never restored or included in ok, so cleanup can report success despite dropping that user's existing scratch-project trust entry.
   - User impact: an existing trust decision for a reused scratch project can be lost without the hook-trust audit reporting incomplete cleanup.
   - Finding class: instance-only
   - Scope proof: hookTrustUndone tests an added table and a changed body, but no removal of a pre-existing table (test lines 609-667).
   - Recommendation: compare the complete pre-run and post-run project table sets and restore or flag missing pre-existing project tables.
   - This is P2 because the affected state is a project-specific trust entry, not the rest of the user's Codex config.

## Focus Coverage

- Cleanup: the runtime context kills tracked processes and restores hook trust on ordinary cleanup, while setup-phase SIGINT/SIGTERM still leaves a detached child untracked (Finding 3).
- Repository snapshot: setup precedes the baseline (Finding 4), and failed directory enumeration silently omits monitored content (Finding 5).
- Scratch guard: runtime-project symlink still bypasses the current boundary check (Finding 1).
- Five runtime adapters: read each launch/resume definition. The shared launcher only sets tmux cwd; Codex explicitly disables its sandbox (Finding 2). No other adapter-specific issue was established without live execution.
- Codex hook trust and undo: opt-in is explicit; count and restore behavior were traced. Existing changed/added tables restore and unrelated outside-project tables are preserved by the tests. A deleted pre-existing project table remains unverified and is the P2 in Finding 6. No user config was read or changed.
- JSON conversation parsing: the runner and package validator share parseConversationScript; the parser handles JSON syntax/duplicate blocks, and package tests cover parser outcomes. No parser security issue was established.
- Static only: the actual runtimes, test suite, tmux, and user config were not invoked.

## Traceability Checks

- spec_code: FAIL — NFR-S02's confinement assumption does not hold for Codex's no-sandbox launch; REQ-001 also misses the project-child symlink path.
- checklist_evidence: PARTIAL — AC-011/T018 remain marked unmet. No validation command was run.

## LOGIC-SYNC

LOGIC-SYNC REQUIRED: NFR-S02 says scratch containment makes prompt-bypassed adapters safe, while the Codex launch explicitly disables its sandbox and startSubject supplies only a working directory. Record both facts for the packet owner; continue within the bound review scope as directed.

## SCOPE VIOLATIONS

- The workflow's graph upsert would write coverage nodes into the shared packet graph outside this lineage. It remains skipped under the lineage-only write authority; this pass uses the v2 graphless fallback ledger.

## Ruled-Out Directions

- The parser source and validator tests show no separate parser security defect in the bound files.
- The Codex trust option is explicit, the startup declines hook trust when false, and project additions/changes are removed/restored by the fake regression. The out-of-project hook entry is intentionally preserved.

## Next Dimension

Traceability will compare remaining requirements and acceptance evidence against the runner, validator, focused tests, and the documented in-progress state.

## Sources

- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:349-540]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1239-1284]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1359-1395]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1426-1492]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1566-1588]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1824-1891]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:208-263]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:609-686]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:1090-1125]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:189-219]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-549]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:45-78]
- [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:558-565]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:166-173]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:225-229]
- [SOURCE: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/plan.md:95-101]

Review verdict: FAIL
