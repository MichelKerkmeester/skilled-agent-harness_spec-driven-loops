---
title: "Feature Specification: Phase 8: wider-hop-recall-measurement"
description: "The claim-time history lookup was measured on six counted Claude Code runs with one model and one kind of detail. This phase plans a wider rerun on Claude Code, Codex and Vibe, with more runs and with real handoffs, to show how much the lookup helps beyond that sample."
trigger_phrases:
  - "wider hop recall measurement"
  - "phase 8 wider hop recall measurement"
  - "hop recall on codex and vibe"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: wider-hop-recall-measurement

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-15 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every arm on every runtime has its counted runs recorded in one result table, each with its run folder, and the table states its limits. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the history lookup handover integration. Phases 1 to 7 moved the lookup offer to the handover claim and measured it once, on Claude Code only.

**Scope Boundary**: This phase measures. It changes no hook, engine or reader code. A defect the runs expose is recorded and goes to its own packet.

**Dependencies**:
- The history engine build at `.skilled/hooks/session-handover/history/dist/cli.js`, which the lookup arm needs and the baseline arm hides.
- The hop-recall harness in `../001-hop-recall-baseline/scratch/harness/`, which drives Claude Code only today.
- A working Codex and Vibe login, on their own providers, with budget for the runs.

**Deliverables**:
- A harness that runs both arms on Claude Code, Codex and Vibe.
- One result table across runtimes, arms and handoff kinds, with every run folder kept.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The claim-time lookup moved receivers from 0 of 6 correct answers to 3 of 3, but that result rests on six counted runs, one runtime, one model and one synthetic detail. It cannot say whether the lookup helps a Codex or Vibe receiver, or a receiver of a real handoff whose missing detail was not planted.

### Purpose
A wider measurement shows, per runtime, how often a receiver runs the lookup and how often it then answers correctly, against a baseline with the lookup withheld.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n '5,10p' specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/006-docs-and-live-hop-proof/scratch/measurement.md
| Stage | Counted runs | lookup_ran | Correct answer | Receiver said UNKNOWN |
|---|---|---|---|---|
| Before, lookup arm (offer only after a compaction) | 3 | 0 | 0 | 3 |
| Before, baseline arm (lookup core hidden) | 3 | 0 | 0 | 3 |
| After the claim offer, reader not yet fixed | 3 | 3 | 1 | 2 |
| After the claim offer, reader fixed | 3 | 3 | 3 | 0 |
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Point the harness at the engine's new build path, which still names the old runtime path today.
- Extend the harness so one invocation runs either arm on Claude Code, Codex or Vibe.
- Run the synthetic codes task on each runtime, in both arms, with more counted runs than before.
- Run real handoffs in both arms: a sender does a real task and hands over naturally, and the receiver is asked for a detail from the sender's turns that the note left out.
- Record every run in one result table, with its limits, beside the run folders.

### Out of Scope
- Changing the lookup offer, the engine or the readers - a defect the runs expose gets its own packet.
- Pi, OpenCode, Cursor, Devin and DSH - they mint no handover locator, so a claim on them prints no lookup section.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/harness/hop-recall.sh` | Create | A copy of the phase 1 harness with the new build path and a runtime argument |
| `scratch/harness/analyze.py` | Create | A copy of the phase 1 scorer that reads Codex and Vibe transcripts too |
| `scratch/runs/` | Create | One folder per run |
| `scratch/measurement.md` | Create | The result table and its limits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The harness hides and restores the engine build at its new path. | A baseline run leaves `.skilled/hooks/session-handover/history/dist/cli.js` absent during the run and present afterwards, and its `result.json` reads `cliReappeared=0`. |
| REQ-002 | Each runtime runs both arms of the synthetic task. | `scratch/runs/` holds at least the counted runs the open question below settles, per runtime and arm, each with a `result.json`. |
| REQ-003 | A run counts only under the phase 1 rule: a different session claimed the note, the question was asked and the note did not hold the answer. | Every run the table counts has those three fields true in its `result.json`. Every excluded run is named with its reason. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Real handoffs run on each runtime, in both arms. | `scratch/runs/` holds real-handoff runs per runtime and arm, each with the question, the source turn and the receiver's answer. |
| REQ-005 | The result table states its limits. | `scratch/measurement.md` names the runtimes, models, run counts and handoff kinds, and what it cannot show. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/measurement.md` reports `lookup_ran` and correct answers for both arms on Claude Code, Codex and Vibe, each row tied to its run folders.
- **SC-002**: The real-handoff rows report the same two numbers, so the synthetic result can be compared with a natural handoff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex and Vibe provider budget | Runs stop partway, and a runtime ends with too few counted runs to compare | Run one runtime at a time. Codex models run on the GPT provider only, and when a quota runs out, stop and ask the operator rather than switch providers |
| Risk | A rebuild during a baseline run puts the hidden build back | The baseline arm is silently contaminated | The harness records `cliReappeared`, and a contaminated run is excluded and rerun one arm at a time |
| Risk | A sender copies the whole detail into the note | The answer comes from the note, not the lookup | REQ-003 excludes the run, as phase 1 excluded two |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How many counted runs per runtime and arm? Recommended: 10 for the synthetic task and 5 for real handoffs, in each arm on each runtime, so 90 counted runs in all, which the operator confirms against the provider budget before the runs start.
- Which model and effort per runtime? Recommended: each runtime's default model at medium effort, recorded per run.
<!-- /ANCHOR:questions -->

---
