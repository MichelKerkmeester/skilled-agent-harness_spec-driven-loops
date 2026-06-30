---
title: "Feature Specification: sk-code README"
description: "Rewrite the sk-code skill README in the narrative voice, leading with the surface-aware router and the Iron Law, and correcting the MOTION_DEV-as-a-surface error."
trigger_phrases:
  - "sk-code readme"
  - "sk-code narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/016-sk-code-readme"
    last_updated_at: "2026-06-07T14:07:55Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped sk-code README via deep-context + dual-draft"
    next_safe_action: "Begin phase 017 (sk-doc README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-016"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Corrected MOTION_DEV from a third surface to a cross-stack resource intent (2 surfaces + UNKNOWN); fixed 4-step-vs-5-phase conflation; dropped version, LOC and intent count"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-code README

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
| **Phase** | 16 of 24 |
| **Predecessor** | 015-sk-code-review-readme |
| **Successor** | 017-sk-doc-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified; MOTION_DEV corrected |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16**, the second skill in Batch D (sk-*).

**Scope Boundary**: Only `.opencode/skills/sk-code/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `sk-code/README.md` in the narrative voice with the MOTION_DEV correction.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-code README is a tabular reference card with no problem-first entry point, and it carries a material accuracy error: it presents MOTION_DEV as a third code surface and a valid surface-override value, when SKILL.md and the reference docs define only two surfaces (WEBFLOW, OPENCODE) plus an UNKNOWN fallback, with MOTION_DEV a cross-stack resource intent loaded after surface detection. It also conflates the four-axis routing model with the five-phase lifecycle, and pins a stale version and line count.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the surface-aware router (two surfaces plus UNKNOWN), the five gated phases and the Iron Law, with MOTION_DEV correctly framed as a resource intent and the stale version, line count and intent count dropped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `sk-code/README.md` to the narrative skeleton; correct the surface model and the phase model.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/README.md` | Modify | Narrative-voice rewrite with the MOTION_DEV and phase corrections |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no table of contents |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | MOTION_DEV corrected | Two surfaces (WEBFLOW, OPENCODE) plus UNKNOWN; MOTION_DEV is a resource intent, not a surface or override value |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Phase model correct, drift dropped | Five gated phases distinct from the four-axis routing; no version, line count or intent count; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The surface model, the phases, the Iron Law and the verification commands match SKILL.md; MOTION_DEV is not called a surface; every cited path resolves.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model repeats the MOTION_DEV-as-surface error | A README that misdocuments the routing | Both gather iterations found the error; authoring prompt forbade it; host scanned the draft and confirmed the correct framing |
| Risk | Model conflates routing axes with phases | Confused lifecycle | Context report separated them; draft distinguishes the four-axis routing from the five phases |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The surface model, phases and verification commands verified during the gather.
<!-- /ANCHOR:questions -->
