---
title: "Feature Specification: Phase 6: sk-code"
description: "[YOUR_VALUE_HERE: What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "sk code"
  - "phase 6 sk code"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: sk-code

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [YOUR_VALUE_HERE: P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-11-04 |
| **Branch** | `scaffold/006-sk-code` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 13 |
| **Predecessor** | 005-mcp-tooling |
| **Successor** | 007-sk-design |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Manually check and refine every skill and mode for readability, layout and structure specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
[YOUR_VALUE_HERE: What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
Read every in-scope sk-code doc file by file and refine it for readability, layout and structure with no claim changed, so the skill meets its sk-doc template and the parent rubric.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
[YOUR_VALUE_HERE: command and its verbatim output]
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- [YOUR_VALUE_HERE: Deliverable 1]
- [YOUR_VALUE_HERE: Deliverable 2]
- [YOUR_VALUE_HERE: Deliverable 3]

### Out of Scope
- [YOUR_VALUE_HERE: Excluded item 1] - [YOUR_VALUE_HERE: why]
- [YOUR_VALUE_HERE: Excluded item 2] - [YOUR_VALUE_HERE: why]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [YOUR_VALUE_HERE: path/to/file.js] | [YOUR_VALUE_HERE: Modify/Create/Delete] | [YOUR_VALUE_HERE: Brief description] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [YOUR_VALUE_HERE: Requirement description] | [YOUR_VALUE_HERE: How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [YOUR_VALUE_HERE: Requirement description] | [YOUR_VALUE_HERE: How to verify it's done] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: [YOUR_VALUE_HERE: Primary measurable outcome]
- **SC-002**: [YOUR_VALUE_HERE: Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [YOUR_VALUE_HERE: System/API] | [YOUR_VALUE_HERE: What if blocked] | [YOUR_VALUE_HERE: Fallback plan] |
| Risk | [YOUR_VALUE_HERE: Risk description] | [YOUR_VALUE_HERE: High/Med/Low] | [YOUR_VALUE_HERE: Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- [YOUR_VALUE_HERE: Question 1 requiring clarification]
- [YOUR_VALUE_HERE: Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---



<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-hub-and-shared/ | [Phase 1 scope] | Pending |
| 2 | 002-sk-code-ci/ | [Phase 2 scope] | Pending |
| 3 | 003-sk-code-frontend/ | [Phase 3 scope] | Pending |
| 4 | 004-sk-code-quality/ | [Phase 4 scope] | Pending |
| 5 | 005-sk-code-review/ | [Phase 5 scope] | Pending |
| 6 | 006-sk-code-skilled/ | [Phase 6 scope] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-hub-and-shared | 002-sk-code-ci | [Criteria TBD] | [Verification TBD] |
| 002-sk-code-ci | 003-sk-code-frontend | [Criteria TBD] | [Verification TBD] |
| 003-sk-code-frontend | 004-sk-code-quality | [Criteria TBD] | [Verification TBD] |
| 004-sk-code-quality | 005-sk-code-review | [Criteria TBD] | [Verification TBD] |
| 005-sk-code-review | 006-sk-code-skilled | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
