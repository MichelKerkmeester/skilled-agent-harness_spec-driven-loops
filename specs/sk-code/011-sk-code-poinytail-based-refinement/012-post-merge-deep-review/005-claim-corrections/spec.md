---
title: "Feature Specification: Phase 5: claim-corrections"
description: "Two child summaries record numbers that no longer match the tree, and the agent mirror checker's header names only one of the two mirrors it verifies."
trigger_phrases:
  - "claim corrections"
  - "phase 5 claim corrections"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: claim-corrections

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/005-claim-corrections` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-hub-doc-pointers |
| **Successor** | None |
| **Handoff Criteria** | Both recorded numbers match a rerun, the checker header names both mirrors, and the checker's output is unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Fix the confirmed P2 findings of the post-merge review specification.

**Scope Boundary**: Two implementation summaries under the 011 epic, the header comment of `check-agent-mirror-sync.cjs`, and the deep-improvement version line and one changelog.

**Dependencies**:
- Review findings 6 (R10-TRA-001), 7 (R8-TRA-002) and 8 (R10-TRA-002) in `../review/review-report.md`

**Deliverables**:
- A corrected ceiling report row in `008-round-two-recommendations/004-debt-report-and-hermes-gate/implementation-summary.md`
- A corrected test count in `011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md`
- A two-mirror header in `check-agent-mirror-sync.cjs`
- deep-improvement 1.19.2.0 and its changelog

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The debt-report summary says `ceiling-report.sh` prints `markers=0 no-trigger=0 no-signal=0`, but once that packet committed its fixture `scratch/after/probe.py` the report prints `markers=3 no-trigger=1 no-signal=1`. The doc-claims summary says its test file holds "10 in total", but the file has 12 cases. The mirror checker's header says agents mirror to `.claude/agents/` only, though it also verifies `.codex/agents/<name>.toml`.

### Purpose
Every recorded number and header claim the review flagged matches what a rerun or a read shows today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the ceiling report row to keep the original reading and add the current one with its cause
- Change the test count row to "Six new test cases, 12 in total"
- Name both mirrors in the checker header
- Bump deep-improvement to 1.19.2.0 with `changelog/v1.19.2.0.md`

### Out of Scope
- The debt-report `goal.md` log rows, which record dated readings that were true when taken
- Any code in the mirror checker
- README version line of deep-improvement, which earlier bumps left alone

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/implementation-summary.md` | Modify | Ceiling report row with the current reading |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md` | Modify | Test count 12 |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs` | Modify | Header names both mirrors |
| `.skilled/skills/system-deep-loop/deep-improvement/SKILL.md` | Modify | Version 1.19.2.0 |
| `.skilled/skills/system-deep-loop/deep-improvement/changelog/v1.19.2.0.md` | Create | Changelog entry |
| `.hermes/skills/deep-improvement/SKILL.md` | Modify | Regenerated Hermes copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The ceiling row matches a rerun | Line 115 names `markers=3 no-trigger=1 no-signal=1`, and `ceiling-report.sh` ends with that line |
| REQ-002 | The test count matches the file | Line 61 says "Six new test cases, 12 in total", and `grep -c '^test('` on the test file prints 12. Git shows the packet's commits took it from 0 to 6 and from 6 to 12 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The checker header names both mirrors | Lines 6 to 9 name `.claude/agents/<name>.md` and `.codex/agents/<name>.toml`, and `check-agent-mirror-sync.cjs --all` still prints `12 agent(s) checked` with exit 0 |
| REQ-004 | Version 1.19.2.0 | `SKILL.md` and `changelog/v1.19.2.0.md` read 1.19.2.0, the changelog validates with `Total issues: 0`, and Hermes `--check` passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three recorded claims match the tree
- **SC-002**: No code behavior changes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewriting history in a closed packet | Low | The ceiling row keeps the original reading and its timing, and adds the current one, so the record stays true for both moments |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Each correction reproduces with one command.
<!-- /ANCHOR:questions -->

---
