---
title: "Feature Specification: Phase 5: review-output-additions"
description: "sk-code-review's output does not say what mattered but could not be checked, performance findings do not state their workload, and the removal plan's search line is narrower than Ponytail's."
trigger_phrases:
  - "review output additions"
  - "phase 5 review output additions"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: review-output-additions

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-09 |
| **Branch** | `scaffold/005-review-output-additions` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-webflow-checker-fix |
| **Successor** | 006-guard-retirement-notes |
| **Handoff Criteria** | Review output ends on the exact status line; new check proves it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the sk-code Ponytail 5 refinement specification.

**Scope Boundary**: The sk-code-review output contract, removal plan, finding schema, README example, CR-024 scenario and final-line check, plus the review agent's result-block placement and its runtime mirrors.

**Dependencies**:
- Section 6 of `../001-ponytail-deep-research/research/research.md`

**Deliverables**:
- A "Not checked:" line above the final status line
- A workload note for performance findings
- A reworded User impact field
- A wider removal-plan search line
- A final-line check

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Ponytail's review ends with one line naming what mattered and could not be checked. sk-code-review has no such section, and its rule-copy canary checks only that strings exist, so it cannot prove `Review status:` is still the final line.

### Purpose
Readers of a review know what was not checked, and automation can still rely on the final status line.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a "Not checked:" line to the output contract in `sk-code-review/SKILL.md`, above `Review status:`
- Require a stated workload on performance findings
- Reword User impact to name the cost of deferring the fix
- Extend `removal-plan.md:57` to tests, fixtures, config and string references
- Add a check that review output ends on the exact status line
- Move the review agent's optional result block (AGENT_IO_RESULT) so it no longer follows `Review status:`, in `.skilled/agents/review.md`, then update the hand-kept Claude fork and regenerate the generated runtime mirrors
- Apply the same output changes to the review README's example output, the generated Hermes skill copy, the CR-024 canary scenario and the finding schema in `references/review-core.md`

### Out of Scope
- A separate consequence-of-inaction line - duplicates User impact
- The 20-line function row - open question in the research

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | Output contract |
| `.skilled/skills/sk-code/sk-code-review/assets/removal-plan.md` | Modify | Search line |
| `.skilled/skills/sk-code/sk-code-review/scripts/` | Modify | Final-line check |
| `.skilled/skills/sk-code/sk-code-review/README.md` | Modify | Example output, read by the canary |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Modify | Finding schema: workload note, deferral wording |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/rule-invariant-canary.md` | Modify | Canary scenario |
| `.skilled/agents/review.md` | Modify | Result block placement |
| `.claude/agents/review.md` | Modify | Authored Claude fork, kept in step by hand; checked by `check-agent-mirror-sync.cjs --all` |
| `.codex/agents/review.toml`, `.pi/agents/review.md`, `.hermes/skills/agent-review/SKILL.md` | Regenerate | Generated runtime mirrors of the review agent |
| `.hermes/skills/sk-code-review/SKILL.md` | Regenerate | Generated copy of the review skill |
| `.hermes/skills/sk-code/SKILL.md` | Regenerate | Stale generated copy of the hub, left behind when an earlier phase edited `sk-code/SKILL.md`; the same sync run refreshes it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Final line intact | The new check fails when anything follows `Review status:`, including the optional result block |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Not checked line | The output contract names the line and its position |
| REQ-003 | Rule-copy canary green | `check-rule-copies.js` passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every review states what it did not check
- **SC-002**: No review output breaks the final-line contract
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Review mirrors drift from the contract | Med | Run the rule-copy canary and the mirror check after the edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The final-line check runs inside the rule-copy script, which CI already runs through `.github/workflows/rule-canary-sync.yml`.
<!-- /ANCHOR:questions -->

---


