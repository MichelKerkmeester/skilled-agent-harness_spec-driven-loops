---
title: "Feature Specification: sk-code-review README"
description: "Rewrite the sk-code-review skill README in the narrative voice, leading with the stack-agnostic findings-first review baseline and its machine-parsable Review status verdict."
trigger_phrases:
  - "sk-code-review readme"
  - "sk-code-review narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/015-sk-code-review-readme"
    last_updated_at: "2026-06-07T13:52:39Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped sk-code-review README via deep-context + dual-draft"
    next_safe_action: "Begin phase 016 (sk-code README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fixed the README's wrong output contract (Summary then Findings, mandatory Review status line, no phantom Review Context heading); dropped version, reference count and the non-existent assets path"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-code-review README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 24 |
| **Predecessor** | 014-mcp-code-mode-readme |
| **Successor** | 016-sk-code-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified; output contract corrected |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15**, the first skill in Batch D (sk-*).

**Scope Boundary**: Only `.opencode/skills/sk-code-review/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `sk-code-review/README.md` in the narrative voice with the corrected output contract.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-code-review README is a tabular reference card with stray non-numbered headings (`## Findings`, `## Review Context`) breaking the section sequence, and it documents the output contract wrong: it shows `## Findings` before `## Code Review Summary`, invents a `## Review Context` heading that does not exist, and omits the mandatory `Review status:` final line that downstream automation parses. It also miscounts the references (9 versus the real 10) and cites an `assets/` path that does not exist.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the stack-agnostic findings-first baseline (P0/P1/P2, file:line evidence, the baseline-plus-surface model) and the machine-parsable Review status verdict, with the output contract corrected and the stale counts and version dropped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `sk-code-review/README.md` to the narrative skeleton; correct the output contract and the reference set.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code-review/README.md` | Modify | Narrative-voice rewrite with the corrected output contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no stray non-numbered headings |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Output contract corrected | Summary then Findings (P0/P1/P2) then Removal/Iteration Plan then Next Steps, ending with the exact `Review status:` line; no `## Review Context` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Drift dropped | No version line, no reference count, no `assets/` path; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The output contract, severity taxonomy and baseline-plus-surface model match SKILL.md and review_core.md; all 11 cited paths resolve and no `assets/` or `## Review Context` is cited.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model copies the README's wrong output contract | A README that misdocuments the verdict shape | Authoring prompt pinned the correct contract and forbade `## Review Context`; host scanned the draft and confirmed zero leaks |
| Risk | Model cites the non-existent `assets/` path | Broken reference | Context report flagged it; host grepped the draft and found none |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence; both models found the same contract drift |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The output contract, severity taxonomy and reference set verified during the gather.
<!-- /ANCHOR:questions -->
