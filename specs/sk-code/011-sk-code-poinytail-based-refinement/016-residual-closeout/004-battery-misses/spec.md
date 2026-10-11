---
title: "Feature Specification: Phase 4: battery-misses"
description: "Retry battery misses P4, P7 and P15 with the smallest change at each root cause, and close any that need a new scorer mechanism."
trigger_phrases:
  - "battery misses"
  - "phase 4 battery misses"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: battery-misses

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/099-residual-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-admission-gold |
| **Successor** | 005-hooks-vitest-scope |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the residual closeout phase parent. It retries item 4 of the residual list: advisor battery misses P4, P7 and P15.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Retry battery misses P4, P7 and P15 with the smallest change at each root cause, and close any that need a new scorer mechanism.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code advisor batteries miss three positive probes. The 015 closeout closed all three as overfitting without trying a metadata fix. P4 (`Write a Vitest covering classifyPrompt() for the resume deep review phrase.`) goes to system-deep-loop, P7 (`Add a packet-local helper that formats Gate 3 confusion-matrix rows for the research summary.`) goes to system-spec-kit on the CLI path, and P15 (`Add a --threshold flag to verify_alignment_drift.py ...`) goes to sk-doc.

### Purpose
Each miss is traced to its root cause. A miss whose cause is missing metadata gets the metadata, the batteries improve with 0 of 5 false positives, and the advisor vitest, parity and regression suites stay green. A miss whose cause is a calibrated scorer rule is closed with the numbers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The three probes' scorer traces
- sk-code `graph-metadata.json` intent signals and the compiled skill graph
- The sk-code release that carries the metadata change

### Out of Scope
- Scorer rules, lane weights and token tables in `fusion.ts` and `lanes/explicit.ts`
- Any probe-specific special case

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/graph-metadata.json` | Modify | One intent signal |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Recompiled |
| sk-code version carriers, `changelog/v2.2.11.0.md`, activation manifest and its authored copy, Hermes copy | Modify, Create | Release 2.2.11.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Batteries improve with no false positive | Both batteries gain at least one probe and stay at 0 of 5 |
| REQ-002 | No suite regresses | Advisor vitest 0 failed; regression suite overall_pass true |
| REQ-003 | Each closed probe names its rule and gap | The rule, its constant and the score gap are recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-090 | Strict validation of this phase passes | validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A change reaches a caller the phase did not name | Med | The gates named in goal.md are rerun from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
