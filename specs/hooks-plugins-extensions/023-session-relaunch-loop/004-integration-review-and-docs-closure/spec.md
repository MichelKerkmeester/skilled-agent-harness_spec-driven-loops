---
title: "Feature Specification: Phase 4: integration-review-and-docs-closure"
description: "Phase 004 reviews the union of files changed by phases 001 to 003, lands the cross-phase doc rollup, runs the final live relaunch on every AUTO runtime and closes the packet."
trigger_phrases:
  - "integration review and docs closure"
  - "phase 4 integration review and docs closure"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: integration-review-and-docs-closure

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phase 004 is Complete. The cross-phase review, doc rollup, quality checks, live runs and final-state closure are recorded, and recursive strict validation reports RESULT: PASSED.

**Key Decisions**: The orchestrator verifies findings before fixes. Live runs follow AUTO verdicts. Phase-specific docs stay in their phases. Closure ran from the final state.

**Critical Dependencies**: phases 001 to 003 must be Done so the union of changed files, the recorded spike verdicts and the G0.5 baseline numbers exist

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-16 |
| **Branch** | `worktrees/142-session-relaunch-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-command-trigger-runtimes |
| **Successor** | None |
| **Handoff Criteria** | All five AC seeds are Met, Gate PG passes and the 004 closure list passes from the final state, including recursive strict validation reporting RESULT: PASSED. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Session relaunch loop: auto-handoff near the context limit with a fresh session in the same terminal specification.

**Scope Boundary**: Review, rollup and closure only. The review covers the union of files changed by phases 001 to 003. This phase adds no feature code of its own beyond the fixes the review confirms, and phase-specific docs stay in their own phases.

**Dependencies**:
- Phase 001, 002 and 003 deliverables on disk: the session-relaunch concern, `skilled-loop`, the `/speckit:handoff` command and mirrors, the per-phase docs and the playbook scenarios.
- The spike verdicts recorded by phases 002 and 003. The verdict model is defined in phase 002 and applied in phase 003: AUTO when the usage signal, the nudge API, the arm event and the seed are all verified, COMMAND-ONLY when usage, nudge or arm is unverified, and BLOCKED when the seed cannot be verified. This phase consumes the model rather than defining it: lane 4.5 live-runs every runtime whose verdict is AUTO, and COMMAND-ONLY or BLOCKED runtimes ship on the command trigger under H13.
- The G0.5 baseline numbers in `scratch/run-ledger.md`, which the sync, mirror and drift checks are measured against.
- `tmux` for the detached live runs, and the `codex` and `devin` CLIs confirmed logged in at G0.3 for the review, fix and doc dispatches.

**Deliverables**:
- The cross-phase review report: every finding carries a severity, a file and line, and a repro.
- One fix dispatch per confirmed P0 or P1 finding, one change each, then a re-review. The P2 findings are listed.
- The doc rollup: the root `README.md` `skilled-loop` mention, the system-spec-kit `README.md` continuity section and the final catalog and playbook indexes.
- The quality pass over every touched doc: `validate_document.py`, a recorded `extract_structure.py` DQI with checklist failures fixed and `hvr_scan.py` clean or each hit justified.
- A live-run record per AUTO runtime and the closure evidence: recursive strict validation, reconciled completion metadata and the final honest status.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 001 to 003 each reviewed their own lane outputs, but no single pass covers the union of files the packet changed. The cross-phase docs (the root README, the system-spec-kit README and the catalog and playbook indexes) do not yet mention the relaunch loop, the touched docs have no recorded quality pass, the AUTO runtimes lack a final live-run record and the packet has no closure evidence.

### Purpose

Verify the whole change set end to end, land the cross-phase doc rollup, prove the loop live on every AUTO runtime and close the packet with reconciled evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lane 4.1: a read-only cross-phase review over the union of changed files, with a severity, a file and line, and a repro on every finding.
- Lane 4.2: orchestrator verification of every P0 and P1 finding, one fix dispatch per confirmed finding with one change each, then a re-review.
- Lane 4.3: the root `README.md` `skilled-loop` mention through the normal README mode, the system-spec-kit `README.md` continuity section and the final catalog and playbook indexes.
- Lane 4.4: `sk-create-quality-control` over every doc touched, the human-voice pass through `sk-create-with-human-voice` and the orchestrator's rerun of the scans.
- Lane 4.5: the final live run on every runtime whose verdict is AUTO, using the phase 001 live-run procedure.
- Lane 4.6: closure from the final state, including recursive strict validation, acceptance-criteria evidence, completion-metadata reconciliation, temporary-output cleanup, the lane file-list scope check and the final honest status.

### Out of Scope
- Phase-specific docs - they stay in their own phases.
- New features or scope beyond the confirmed findings - the fix loop repairs what the review confirms, nothing more.
- Automatic triggers, adapters, wrapper arms or command mirrors - phases 001 to 003 own those.
- Live runs on runtimes whose verdict is COMMAND-ONLY or BLOCKED - they ship on the command trigger only and H13 reports PARTIAL at closure.
- Commits, pushes or merges - out for the whole run. The final status names any action left to the operator.
- Changing `autoCompactEnabled` or `autoCompactWindow`, or adding resume flags to the wrapper - out for the whole run.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Root `README.md` | Modify | `skilled-loop` mention through the normal README mode |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Continuity section |
| `feature-catalog.md` index and the manual-testing-playbook index | Modify | Final entries equal to the files on disk by name |
| Files named by confirmed P0 and P1 findings | Modify | One change per confirmed finding, dispatched one at a time |
| `004-integration-review-and-docs-closure` packet docs | Modify | Review, live-run and closure evidence in `implementation-summary.md`, `tasks.md` and `acceptance-criteria.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Run the cross-phase review over the union of changed files under a read-only instruction. Each finding carries a severity, a file and line, and a repro. Verify every P0 and P1 finding before fixing, dispatch one fix per confirmed finding with one change each, then re-review. No confirmed P0 or P1 remains open and the P2 findings are listed. |
| REQ-002 | Update the root `README.md` with a `skilled-loop` mention through the normal README mode, add the continuity section to the system-spec-kit `README.md` and finalize the catalog and playbook indexes so the index entries equal the files on disk by name. |
| REQ-003 | Record every touched doc with `git diff --name-only` against baseline plus the new untracked `.md` files. Each passes `validate_document.py`, the `extract_structure.py` DQI is recorded and its checklist failures are fixed, and `hvr_scan.py` is clean or each hit is justified. |
| REQ-004 | Record a live run per runtime whose spike verdict is AUTO, using the phase 001 live-run procedure: detached tmux, `SKILLED_LOOP_ID` unset, `SESSION_RELAUNCH_THRESHOLD=0.05`, the nudge, the open to claimed to done note transitions, one hop line, the fresh seeded session and the forced-failure check. |
| REQ-005 | Pass the closure checks from the final state: `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` gives RESULT: PASSED, every acceptance-criteria row has evidence, completion metadata is reconciled across spec, tasks, implementation-summary and goal files, task-created temporary output is removed, every file changed against baseline belongs to a lane file list, and the final honest status is sent. |

### P1 - Required (complete OR user-approved deferral)

No additional P1 requirements are defined. Section 7 of the approved plan makes every acceptance-criteria seed necessary for phase Done.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No confirmed P0 or P1 finding remains open and the P2 findings are listed (AC-001).
- **SC-002**: The root README, the spec-kit README and the catalog and playbook indexes are updated, the index entries equal the files on disk by name, and every touched doc passes its validators (AC-002, AC-003).
- **SC-003**: A live-run record exists per AUTO runtime and recursive strict validation reports RESULT: PASSED (AC-004, AC-005).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 to 003 deliverables and recorded spike verdicts | Lane 4.1 has nothing to review and lane 4.5 has no AUTO list | Phase order in the run: 001 to 003 land first and each passes its seeds and Gate PG |
| Dependency | G0.5 baseline numbers in the ledger | The closure checks lose their comparison point | Baseline captured before any write and deltas measured against it |
| Risk | The review confirms P0 or P1 defects | Closure waits on the fix loop | One fix per confirmed finding, one change each, then re-review. H4 after three failed fixes on one symptom |
| Risk | A live run cannot be driven even in tmux | No live-run record for that runtime | H10: record it, continue other work, give the operator the exact command and make no completion claim for that runtime |
| Risk | A sync or mirror run changes more than this phase's rows | Generated output is wrong | H8: do not accept the output and report the extra hunks |
| Risk | Verdicts land COMMAND-ONLY or BLOCKED | Some runtimes get no live run | H13: ship them on the command trigger and report PARTIAL at closure |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: On a forced failure during a live run, the file is un-armed and a notification carrying the manual command arrives within 30 seconds.

### Security
- **NFR-S01**: The review confirms the killer never signals a pid outside the wrapper's descendants and the wrapper never acts without `SKILLED_LOOP_ID` (the H9 guard).

### Reliability
- **NFR-R01**: Every relaunch and decline appends to `relaunch.log`, and each live-run record captures the hop line for its runtime.

---

## 8. EDGE CASES

### Data Boundaries
- Empty finding set: the review lane closes with zero fix dispatches and AC-001 passes on the recorded report.
- No AUTO verdicts: lane 4.5 runs nothing, H13 applies and closure reports PARTIAL.

### Error Scenarios
- A fix dispatch exits 0 with an empty diff: rejected under H7 and re-dispatched narrower.
- A stalled dispatch: killed by its captured PID and re-dispatched once under H5. A second stall on the same lane goes to H4.
- A live run that cannot be driven even in tmux: recorded under H10 with the exact command for the operator.

---

## 9. COMPLEXITY ASSESSMENT

The approved plan does not assign numeric complexity scores to phase 004.

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | N/A | The plan does not score this dimension. |
| Risk | N/A | The plan does not score this dimension. |
| Research | N/A | The plan does not score this dimension. |
| Multi-Agent | N/A | The plan does not score this dimension. |
| Coordination | N/A | The plan does not score this dimension. |
| **Total** | **N/A** | **Level 3 packet, as declared in the scaffold.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The review confirms P0 or P1 defects that survive fixes | H | M | Verified findings only, one fix each, re-review. H4 escalation after three failed fixes on one symptom |
| R-002 | A live run cannot be driven even in tmux | M | L | H10: record the command and evidence and make no completion claim for that runtime |
| R-003 | A sync or mirror run changes more than this phase's rows | M | L | H8: reject the output and report the extra hunks |
| R-004 | Verdicts land COMMAND-ONLY or BLOCKED for some runtimes | M | M | H13: command trigger only for those runtimes, PARTIAL reported at closure |

---

## 11. USER STORIES

### US-001: Verified cross-phase review (Priority: P0)

**As an** operator, **I want** a review of the whole change set where every P0 and P1 finding is verified before a fix lands, **so that** no confirmed defect ships unreviewed and no fix dispatches on noise.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Proven loop and honest closure (Priority: P1)

**As an** operator, **I want** the relaunch loop proven live on every AUTO runtime and the packet closed with reconciled evidence, **so that** closure reflects what was actually observed.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Which findings does the cross-phase review confirm as P0 or P1, and which fixes do they need? Open until lanes 4.1 and 4.2 land.
- Which runtimes carry an AUTO verdict and need a lane 4.5 live run? Settled by the phase 002 and 003 spike records.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

