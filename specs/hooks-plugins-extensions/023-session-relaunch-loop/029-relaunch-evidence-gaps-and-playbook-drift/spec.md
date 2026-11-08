---
title: "Feature Specification: Phase 29: relaunch-evidence-gaps-and-playbook-drift"
description: "The phase 23 live runs left thin evidence in four places and two playbook lines that disagree with what ran. This phase captures the missing evidence, finds out why Claude needed a retry, records a Pi baseline and corrects the playbook drift against observed output."
trigger_phrases:
  - "relaunch evidence gaps"
  - "phase 29 relaunch evidence gaps and playbook drift"
  - "codex withdraw reply evidence"
  - "playbook import smoke object function"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 29: relaunch-evidence-gaps-and-playbook-drift

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 29 of 29 |
| **Predecessor** | 028-goal-rebind-live-proof-and-docs |
| **Successor** | None |
| **Handoff Criteria** | Each evidence gap has a recorded run, the retry has a named cause or a measured rate, and the playbook lines match observed output |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 29** of the session relaunch loop specification.

**Scope Boundary**: The session-relaunch playbooks, the live evidence for Codex, Claude and Pi, and any code the retry investigation proves defective. Goal behavior is out of scope.

**Dependencies**:
- Phase 023, whose live runs left the gaps.
- Phase 028 is not required, so this phase can run beside the goal phases.

**Deliverables**:
- A recorded Codex withdraw reply.
- A cause or a measured rate for the Claude nudge retry.
- A current Pi suite baseline.
- Two playbook lines corrected against a run.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phase 23 live runs showed that Codex withdraw output was never captured because the wait was 30 seconds, that Claude extra nudge arrived only after one retry, and that the Pi suites were not rerun because no Pi code changed. Two playbook lines also disagree with a run: the OpenCode import smoke is documented as printing `function` but printed `object`, and the shell shim step names a case count that differs from the suite by two (16 documented, 18 observed). Each of these is a claim a reader cannot trust today.

### Purpose
Every claim the relaunch playbooks and live records make is backed by a run that could have shown otherwise.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rerun the Codex withdraw scenario with a wait long enough to see the receiver reply and save the transcript.
- Rerun the Claude extra-nudge scenario several times, record how often it needs a retry, and trace the producer if the first attempt fails (root cause, not a retry loop).
- Run the Pi adapter and extension suites and record the totals as a baseline.
- Run the OpenCode import smoke and the shell shim suite, read what they print, and correct the two playbook lines to match.

### Out of Scope
- Goal persistence work - phases 24 to 28 own it
- New relaunch behavior - this phase corrects evidence and docs, and fixes a defect only if the retry investigation proves one

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md | Modify | The import smoke expectation and the shim case count |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md, session-relaunch-claude.md | Modify | The Codex reply and the Claude nudge evidence notes |
| .skilled/hooks/session-relaunch/ (only if the retry has a producer) | Modify | A fix with a failing-first test |
| scratch/ in this folder | Create | Transcripts, rates and baselines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The Codex withdraw reply is captured with a wait long enough to see it, and the transcript is saved |
| REQ-002 | The Claude extra-nudge retry has a named producer with a failing-first test, or a measured first-attempt rate that shows it is timing alone |
| REQ-003 | Each playbook line that disagreed with a run now states what the run printed, with the command that prints it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A current Pi suite baseline is recorded, with totals and the date |
| REQ-005 | The playbook index and each changed playbook still pass the sk-doc validators |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four evidence gaps and two doc lines each have a recorded run behind them.
- **SC-002**: The relaunch gate still passes at its baseline after any fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex and Claude credentials and quota | A rerun is blocked | Record SKIP and keep the gap named as open |
| Risk | The retry is a real defect with a wide producer | Med | Trace the producer first, add the failing test and fix it at the source |
| Risk | A playbook line is corrected to match a wrong run | Low | Read the command and its exit status and rerun once before editing |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A wait is sized to the reply, not guessed, and the run records how long it took.

### Security
- **NFR-S01**: No key is printed or asked for again.
- **NFR-S02**: A bypass flag runs only after a fresh operator yes.

### Reliability
- **NFR-R01**: A first-attempt failure is counted, not hidden by a second attempt.
- **NFR-R02**: A corrected doc line cites the command that prints the value.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A reply that arrives after the longest wait: recorded as not captured, with the wait used.
- A shim suite whose count changes between runs: recorded and the line names the range.

### Error Scenarios
- A Codex run that cannot start: SKIP with the reason.
- A retry whose producer is a runtime timing: recorded as not ours, with the evidence.

### State Transitions
- A leftover hand-over record from an earlier run: cleared before the rerun.
- A playbook line already correct: left alone and noted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two playbooks, three live reruns |
| Risk | 8/25 | A retry that may hide a defect |
| Research | 10/20 | Root cause of the retry |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- If the retry has no producer in our code, is a measured rate enough to close it? The recommendation is yes, with the rate and the runtime version recorded.
  - Answered: the retry has a measured rate (0 of 7 first-attempt deliveries with an instant tool, 3 of 3 with a 3 s tool, Claude Code 2.1.310) and a named mechanism, a transcript flush that trails the hook by about 0.2 s. The read is in our hook, so the follow-up on the nudge floor stays open for the code owner.
<!-- /ANCHOR:questions -->

---
