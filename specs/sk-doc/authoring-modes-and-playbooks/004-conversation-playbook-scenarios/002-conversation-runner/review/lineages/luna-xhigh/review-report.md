# Deep Review Report: Conversation Runner

**Run:** `fanout-luna-xhigh-1793613625067-f04kmf`  
**Stop reason:** `maxIterationsReached`  
**Iterations:** 7  
**Release readiness:** release-blocking

## 1. Executive Summary

- **Overall verdict: FAIL** — two active P0 findings remain.
- **Active findings:** 2 P0, 4 P1, 2 P2.
- **Advisories:** `false` (the verdict is FAIL).
- **Review scope:** the shared conversation runner, its runner tests and fake subject, the playbook-package validator and parser tests, plus the target packet's requirements and acceptance evidence.
- **Dimension coverage:** 4/4 (correctness, security, traceability, maintainability).
- **Operator review focus:** Review the shared conversation runner and its validator changes: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs, scripts/tests/run-conversation-scenario.test.cjs, scripts/tests/fixtures/fake-subject.cjs, and the json conversation parsing in scripts/validate-playbook-package.cjs with its test. Focus on cleanup on every exit path, the repository snapshot, the scratch guard, the five runtime adapters and the opt-in Codex hook trust and its undo in the user's Codex config. Do not start tmux or run the live runner.
- **Terminal decision:** the last two stabilization passes found no new issue, but unresolved P0 findings fail the legal-stop gate. The loop therefore stopped at its configured seven-iteration ceiling.

## 2. Planning Trigger

`/speckit:plan` is required to address the active P0 and P1 findings. The packet below is built from the reducer registry and the iteration records. P2 items are separated as evidence and trust-restoration follow-ups.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "LUNA-XHIGH-001",
      "severity": "P0",
      "title": "A runtime-project symlink bypasses the scratch boundary",
      "dimension": "correctness",
      "file": ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1430",
      "evidence": "guardScratch checks the scratch parent, then writes through scratch/<runtime> and compares protected leaves against that child's realpath; the refusal tests do not cover a runtime-child link to the repository.",
      "impact": "The runner can place the repository inside the runtime project despite its scratch-only boundary.",
      "recommendation": "Resolve and validate the runtime project before marker or setup writes; reject roots inside the repository or outside canonical scratch.",
      "findingClass": "cross-consumer",
      "scopeProof": "The shared guard feeds all five adapters; existing refusal tests cover the parent path and a linked specs leaf, not the runtime child.",
      "affectedSurfaceHints": ["scratch guard", "setup cwd", "all runtime launch adapters"]
    },
    {
      "id": "LUNA-XHIGH-004",
      "severity": "P0",
      "title": "Codex runs without a host filesystem sandbox",
      "dimension": "security",
      "file": ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1043",
      "evidence": "Codex launch and resume pass --dangerously-bypass-approvals-and-sandbox. startSubject supplies a tmux cwd but no external filesystem sandbox.",
      "impact": "The model can read or alter user and repository files outside scratch without approval; selected-path snapshots cannot undo those effects.",
      "recommendation": "Use an externally enforced filesystem sandbox/container or keep the Codex sandbox enabled.",
      "findingClass": "instance-only",
      "scopeProof": "The Codex adapter passes the explicit bypass flag; no container, OS sandbox, or path restriction wraps the subject process.",
      "affectedSurfaceHints": ["Codex launch adapter", "tmux subject process", "host filesystem"]
    },
    {
      "id": "LUNA-XHIGH-002",
      "severity": "P1",
      "title": "SIGINT during setup leaves the detached setup child running",
      "dimension": "correctness",
      "file": ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2749",
      "evidence": "Setup invokes detached runBoundedCommand without a context before runtime registration; signal cleanup iterates only active runtime contexts. The signal regression interrupts after subject startup.",
      "impact": "Setup or descendant processes can continue after the runner exits on SIGINT/SIGTERM.",
      "recommendation": "Register setup process groups before execution and terminate and verify them in signal cleanup.",
      "findingClass": "class-of-bug",
      "scopeProof": "All setup commands use runBoundedCommand and main calls guardScratch without ctx.",
      "affectedSurfaceHints": ["setup child process group", "signal handlers", "cleanupAll"]
    },
    {
      "id": "LUNA-XHIGH-003",
      "severity": "P1",
      "title": "Setup-time repository writes occur before the baseline snapshot",
      "dimension": "correctness",
      "file": ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2749",
      "evidence": "main awaits guardScratch and its setup commands before runRuntime creates repo-before.txt from snapshotRepo.",
      "impact": "A setup write to a watched repository path becomes baseline state and may not yield REPO_CHANGED.",
      "recommendation": "Take the baseline before setup, or constrain and enforce setup as read-only against watched repository paths.",
      "findingClass": "class-of-bug",
      "scopeProof": "Setup receives CONVERSATION_REPO_ROOT and no snapshot is taken in guardScratch.",
      "affectedSurfaceHints": ["setup commands", "repository snapshot baseline", "REQ-008"]
    },
    {
      "id": "LUNA-XHIGH-005",
      "severity": "P1",
      "title": "Unreadable snapshot subtrees are treated as empty",
      "dimension": "security",
      "file": ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1242",
      "evidence": "walkFiles catches readdirSync errors and returns no files; snapshotRepo has no incomplete-snapshot signal.",
      "impact": "Writes to files under an omitted watched root can leave both snapshots apparently unchanged.",
      "recommendation": "Distinguish missing roots from traversal failures and fail closed when monitored paths cannot be enumerated or hashed.",
      "findingClass": "class-of-bug",
      "scopeProof": "snapshotRepo uses walkFiles for specs and configured state roots, and the shared catch swallows recursive read errors.",
      "affectedSurfaceHints": ["walkFiles", "snapshotRepo", "REPO_CHANGED verdict"]
    },
    {
      "id": "LUNA-XHIGH-008",
      "severity": "P1",
      "title": "Cleanup reports child processes gone without verification",
      "dimension": "maintainability",
      "file": ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1376",
      "evidence": "Timeout signals a child process group and immediately drops its PID. cleanupContext clears remaining child PIDs and hardcodes childrenGone=true; the survivor poll applies only to the pane group.",
      "impact": "A setup/check descendant can survive cleanup and write after the repository snapshot while cleanup reports success.",
      "recommendation": "Keep child groups tracked until close, verify groups and descendants are gone, and report CLEANUP_INCOMPLETE on survivors.",
      "findingClass": "class-of-bug",
      "scopeProof": "All setup/check commands share runBoundedCommand and cleanupContext owns the shared child tracking set.",
      "affectedSurfaceHints": ["setup/check process groups", "timeout handling", "cleanupContext"]
    },
    {
      "id": "LUNA-XHIGH-006",
      "severity": "P2",
      "title": "Removed pre-existing project hook trust is not restored",
      "dimension": "security",
      "file": ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:481",
      "evidence": "restoreHookTrust checks current tables for additions and changed bodies but does not compare pre-run project tables that are now missing.",
      "impact": "A trust-enabled run can report successful cleanup while leaving a prior project trust entry deleted.",
      "recommendation": "Compare the post-run project table set with the snapshot and restore or report missing pre-existing entries.",
      "findingClass": "instance-only",
      "scopeProof": "The existing regression covers added/changed entries and outside-table preservation, not deletion of a pre-existing project table.",
      "affectedSurfaceHints": ["restoreHookTrust", "CODEX_HOME/config.toml"]
    },
    {
      "id": "LUNA-XHIGH-007",
      "severity": "P2",
      "title": "AC-005 is marked Met without evidence for its specs write case",
      "dimension": "traceability",
      "file": ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:571",
      "evidence": "The repoChanged regression appends to the watched state queue; no bound test performs AC-005's separate specs write.",
      "impact": "The acceptance record overstates snapshot coverage and may miss a regression that omits the specs root.",
      "recommendation": "Add a fake specs-write case or narrow AC-005's Given and verification evidence to the tested state-path case.",
      "findingClass": "matrix/evidence",
      "scopeProof": "The only repoChanged regression in the target test writes decision-capture/queue.md.",
      "affectedSurfaceHints": ["AC-005", "snapshotRepo specs root", "repoChanged regression"]
    }
  ],
  "remediationWorkstreams": [
    {"priority": "P0", "items": ["LUNA-XHIGH-001: validate canonical runtime project containment before any write", "LUNA-XHIGH-004: provide external filesystem confinement or remove the Codex sandbox bypass"]},
    {"priority": "P1", "items": ["LUNA-XHIGH-002 and LUNA-XHIGH-008: track and verify setup/check child cleanup on signal, timeout, and exit", "LUNA-XHIGH-003 and LUNA-XHIGH-005: include setup in snapshot coverage and fail closed on incomplete traversal"]},
    {"priority": "P2", "items": ["LUNA-XHIGH-006: detect removed pre-existing project trust entries", "LUNA-XHIGH-007: align AC-005 evidence with both promised write cases"]}
  ],
  "specSeed": ["Clarify that the runtime project itself must resolve beneath canonical scratch before marker or setup writes.", "Specify external confinement for every privileged adapter, including the Codex bypass mode.", "Require setup/signal/timeout cleanup to verify every child group, and fail closed on survivors.", "Define snapshot baseline timing and unreadable-subtree handling.", "Require AC-005 evidence for both specs and watched-state writes.", "Specify whether removed pre-existing hook trust must be restored or reported."] ,
  "planSeed": ["Add a runtime-child symlink refusal regression before marker/setup writes.", "Add Codex sandbox boundary coverage for launch and resume.", "Exercise SIGINT during setup and a detached check/setup descendant timeout; assert no survivor.", "Test setup writes against the repository baseline and simulate unreadable snapshot roots.", "Add the separate specs write to repoChanged coverage.", "Add a trust rollback case for deletion of a pre-existing project hook table."] ,
  "findingClasses": ["cross-consumer", "instance-only", "class-of-bug", "matrix/evidence"],
  "affectedSurfacesSeed": ["guardScratch and project realpath", "five runtime launch adapters", "Codex CLI sandbox and user hook trust config", "setup/check child process groups and signal cleanup", "snapshotRepo traversal and baseline timing", "repoChanged tests and AC-005 evidence", "shared conversation parser consumers"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Status |
|---|---|---|---|---|---|
| LUNA-XHIGH-001 | P0 | A runtime-project symlink bypasses the scratch boundary | correctness | run-conversation-scenario.cjs:1430 | active |
| LUNA-XHIGH-004 | P0 | Codex runs without a host filesystem sandbox | security | run-conversation-scenario.cjs:1043 | active |
| LUNA-XHIGH-002 | P1 | SIGINT during setup leaves the detached setup child running | correctness | run-conversation-scenario.cjs:2749 | active |
| LUNA-XHIGH-003 | P1 | Setup-time repository writes occur before the baseline snapshot | correctness | run-conversation-scenario.cjs:2749 | active |
| LUNA-XHIGH-005 | P1 | Unreadable snapshot subtrees are treated as empty | security | run-conversation-scenario.cjs:1242 | active |
| LUNA-XHIGH-008 | P1 | Cleanup reports child processes gone without verification | maintainability | run-conversation-scenario.cjs:1376 | active |
| LUNA-XHIGH-006 | P2 | Removed pre-existing project hook trust is not restored | security | run-conversation-scenario.cjs:481 | active |
| LUNA-XHIGH-007 | P2 | AC-005 is marked Met without evidence for its specs write case | traceability | run-conversation-scenario.test.cjs:571 | active |

The detailed evidence, impact, scope proof, affected surfaces, and recommendations for every row are in the Planning Packet and iteration records. The reducer registry contains the eight active identities and severity counts; descriptive fields were joined from their structured iteration `findingDetails`.

## 4. Remediation Workstreams

1. **Containment and sandboxing (P0):** validate the canonical runtime project before writes; ensure privileged Codex execution receives an external filesystem sandbox or no longer disables its sandbox.
2. **Process cleanup (P1):** register setup children for signal cleanup; retain timeout group tracking until all descendants are verified gone; return `CLEANUP_INCOMPLETE` on survivors.
3. **Repository integrity (P1):** baseline before setup and fail the run when snapshot traversal or hashing is incomplete.
4. **Codex trust rollback and evidence (P2):** handle deleted pre-existing project trust entries; prove both AC-005 write cases or correct the acceptance evidence.

## 5. Spec Seed

- Make project-root containment apply to the runtime child itself and before marker or setup writes.
- State how every permission-heavy adapter is confined from host filesystem access.
- Define child ownership and survivor verification for setup, check, timeout, SIGINT, SIGTERM, and unexpected exits.
- Define whether snapshot failures fail closed and whether setup mutations are part of the measured run.
- Align AC-005's verification row with its two distinct cases.
- Define restoration behavior for removed pre-existing project hook trust.

## 6. Plan Seed

- Implement canonical project-root validation and add the runtime-child symlink refusal case.
- Establish a supported external sandbox for Codex's launch/resume path.
- Track setup/check process groups across all exits and verify descendants before reporting cleanup success.
- Move or expand snapshot baselining to include setup; surface traversal errors as failures.
- Cover specs writes, unreadable roots, setup-time writes, and child survivors in focused tests.
- Test trust-table deletion and reconcile AC-005 evidence.

## 7. Traceability Status

| Protocol | Status | Evidence and unresolved drift |
|---|---|---|
| `spec_code` (core) | FAIL | REQ-001, REQ-006/007, REQ-008 and NFR-S02 conflict with the observed path and process behavior. |
| `checklist_evidence` (core) | PARTIAL | AC-005 is marked Met although its test covers only the watched-state append. AC-011/T018 remains Unmet. |
| `skill_agent` (overlay) | UNKNOWN | Not established from the declared runner/validator target files. |
| `agent_cross_runtime` (overlay) | UNKNOWN | Not established from the declared runner/validator target files. |
| `feature_catalog_code` (overlay) | UNKNOWN | Not established from the declared runner/validator target files. |
| `playbook_capability` (overlay) | UNKNOWN | Not established from the declared runner/validator target files. |

`AC_COVERAGE`: **advisory-shortfall**. The packet marks 13/14 rows Met, but AC-005's evidence does not cover both of its stated cases; AC-011 is Unmet. On the evidence reviewed, 12/14 rows are fully evidence-backed. Strict recursive packet validation was not run under the lineage's no-out-of-scope-write boundary.

## 8. Deferred Items

- AC-011/T018 strict recursive validation remains outstanding; running `validate.sh` was expressly prohibited by the dispatch.
- Graph upsert and resource-map emission would write outside the lineage, so both were skipped.
- Continuity save through `generate-context.js` would modify packet documents outside the lineage, so phase-save was skipped.
- No tests, live runner, tmux, or actual user Codex configuration were run or changed.

## Dimension Expansion Map

- **Correctness:** covered in iterations 1 and 6.
- **Security:** covered in iterations 2 and 5.
- **Traceability:** covered in iterations 3 and 7.
- **Maintainability:** covered in iteration 4.
- Completed pivots: none. Failed pivots: none. Audited overrides: none.
- Recovery after iteration 6 used a severity recheck and least-reviewed traceability focus. Remaining dimension frontier: none.
- No direction expansion or nested reviewer dispatch occurred.

## 9. Search Ledger

- **Required bug classes:** project boundary, privileged adapter launch, setup signal cleanup, snapshot completeness, process-group cleanup, hook restoration, adapter mapping, parser maintenance, fixture fidelity.
- **Covered by cited searches:** project boundary, privileged adapter launch, setup signal cleanup, snapshot completeness, process-group cleanup, hook restoration.
- **Ruled out as separate defects:** adapter mapping, parser maintenance, fixture fidelity. Coverage gaps remain recorded under cleanup and AC-005 findings.
- **Search debt:** none. **Candidate coverage:** no separate candidateCoverage object was emitted; the latest review-depth ledger carries a cited row for each required class.
- **Graph mode:** `graphless_fallback`; the lineage records direct reads, producer/consumer traces, and negative-test inspection with file evidence. Graph seeding/upsert was skipped because it writes outside the authorized lineage.

## 10. Audit Appendix

### Convergence and coverage

- Severity-weighted `newFindingsRatio` by iteration: `1.00`, `0.4444`, `0.027`, `0.119`, `0`, `0`, `0`.
- Last two passes were below the 0.05 no-progress threshold, which triggered recovery for iteration 7.
- All four dimensions were covered and search debt is empty. Legal convergence remained blocked by two active P0 findings; the configured ceiling produced `maxIterationsReached`.
- Final verdict: **FAIL**. Release readiness: **release-blocking**.
- All seven iteration verifier runs passed. No repository test suite, live runner, tmux, or packet validator was run.

### Execution deviations and boundary

- The graph upsert and resource-map output were skipped because their target is outside this lineage. Continuity generation was also skipped because it writes to packet documents outside the lineage.
- To keep write authority local, the synthesis-closeout event directory is placed under this lineage rather than `/tmp`; its terminal event still goes through the append gateway and reducer.
- The `stuckRecovery` event referencing iteration 6 was appended after the iteration-7 row because the missing workflow record was caught during synthesis. It is gateway-backed; the ledger ordering places it after iteration 7. The seven iteration rows and max-iteration stop reason are unchanged.
- One reducer invocation used a duplicated packet path; the exact reducer command was run immediately afterward. The duplicated target path was absent when checked.

### Sources reviewed

- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs`
- Target `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, and `implementation-summary.md`.
- [Codex CLI option definition](https://github.com/openai/codex/blob/main/codex-rs/utils/cli/src/shared_options.rs).

### Cross-reference appendix

#### Core Protocols

- `spec_code`: FAIL — four requirement areas conflict with implementation evidence.
- `checklist_evidence`: PARTIAL — AC-005 evidence shortfall; AC-011/T018 outstanding.

#### Overlay Protocols

- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: UNKNOWN from the declared review files; no pass is claimed.
