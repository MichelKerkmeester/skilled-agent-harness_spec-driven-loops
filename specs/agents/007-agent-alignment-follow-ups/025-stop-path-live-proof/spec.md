---
title: "Feature Specification: Phase 25: stop-path-live-proof"
description: "The deep-review stop paths for three errors, the time limit and a manual stop were traced by reading, never run end to end, so nothing shows a stop actually reaches the terminal gate record and the verdict. This phase replays each path through the real scripts and runs one live review that hits its time limit."
trigger_phrases:
  - "stop path live proof"
  - "phase 25 stop path live proof"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 25: stop-path-live-proof

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 25 of 25 |
| **Predecessor** | 024-terminal-gates-script |
| **Successor** | 026-closeout-run-identity |
| **Handoff Criteria** | The replay test passes for the error, duration and manual stop reasons, the live run's outcome is recorded with its evidence, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the agent alignment follow-ups. It closes gap 2 from the earlier analysis: the stop paths were traced, never run.

**Scope Boundary**: One new integration test and one live review run whose artifacts live in this folder's `review/`. No production change.

**Dependencies**:
- Phase 24's terminal-gates script, which the replay and the live run both use

**Deliverables**:
- `tests/integration/review-stop-path-replay.vitest.ts`
- A live run record with its state log and verdict
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 15 to 17 made every terminal stop record its gates and fail the verdict on a failed gate, but each step was tested alone. No test runs a stop through the gate record, the append gateway and the reducer's verdict, and no live run has shown the loop agent following the jumps.

### Purpose
Each stop reason is shown to reach the recorded gates and the verdict, by a test that runs the real scripts and by one live run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git ls-files .skilled/skills/system-deep-loop/runtime/tests/integration | grep -c stop-path
0
$ git grep -l terminal_gates_recorded -- .skilled/skills/system-deep-loop/runtime/tests/integration | wc -l
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an integration test that replays the error, duration and manual stop through the stop decision, the terminal gates script, the append gateway and the reducer.
- Run one live `/deep-review :auto` on DeepSeek V4.1 Flash through Pi with `maxDurationMinutes` set to 1 after init, and record what it wrote.

### Out of Scope
- A live manual stop - it needs an operator to pick C at a `:confirm` gate, so it stays an operator walkthrough.
- Changing the stop paths - this phase only proves them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-stop-path-replay.vitest.ts` | Create | Replay test |
| `review/**` in this folder | Create | The live run's artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A stop with failed gates reaches a FAIL verdict through the real scripts, for each stop reason. | The replay test passes and fails when an assertion is broken |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A live run that hits its time limit records the stop, the gates and the verdict. | Its state log holds `maxDurationReached` and a `terminal_gates` row, and its report states the verdict |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime suite fails nothing that passed at baseline, plus the new test.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The append gateway's run-directory authority | Medium | The test copies the setup existing gateway tests use |
| Risk | The live run proves one runtime and one model only | Medium | Recorded as a limit; the replay test covers the scripts for every runtime |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The approach is the earlier analysis's gap 2 proposal.
<!-- /ANCHOR:questions -->

---


