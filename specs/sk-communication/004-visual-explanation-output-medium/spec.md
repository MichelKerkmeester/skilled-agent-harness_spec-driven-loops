---
title: "Feature Specification: the visual explanation lane renders where a reader can see it"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: the visual explanation lane renders where a reader can see it

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `scaffold/004-visual-explanation-output-medium` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[One-sentence outcome statement. What does success look like?]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

### Out of Scope
- [Excluded item 1] - [why]
- [Excluded item 2] - [why]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [path/to/file.js] | [Modify/Create/Delete] | [Brief description] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [Requirement description] | [How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [Requirement description] | [How to verify it's done] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---

## The defect

`/rewrite:explain-visually` exists to render "the smallest visual that makes the point land". It was
display-only by default, so its output was a Mermaid block fenced in the reply. In a terminal that
displays as its own source text: the reader gets the diagram's code, not the diagram. The command
failed its stated purpose at the last step, every time, by design.

The escape hatch did not escape. `--artifact` wrote a self-contained HTML file into the session
scratchpad — a temporary directory the reader never opens, with no link and no viewer. Neither path
put a rendered visual in front of anyone.

The default was stated identically in four places, so the behaviour was consistent and consistently
wrong: the command contract, the skill's lane table and its command list, the modality reference, and
the skill README.

## The fix

Publishing is the default and `--inline` is the opt-out. A published page renders Mermaid natively,
so the same fenced block becomes a diagram rather than source. The reply carries the link and one
line; the page carries the explanation.

Where a runtime exposes no publish surface, the command writes the file, names the path, and says
plainly that it is a file rather than a link. It does not silently fall back to fenced source, because
that is the failure this change exists to remove.

`--inline` remains for something small enough to read as source, and the contract says out loud what
it costs, so the choice is informed rather than accidental.

## Scope

Four files: the command contract, `SKILL.md`, `references/visual-explanation.md`, and `README.md`.
No script, no runtime adapter, and nothing in the projection lane, which has a different risk profile
and its own default-off posture that this change deliberately does not touch.
