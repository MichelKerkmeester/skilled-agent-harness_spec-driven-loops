---
title: "Feature Specification: system-skill-advisor README"
description: "Rewrite the system-skill-advisor skill README in the narrative voice, leading with standalone Gate 2 routing that scores with calibrated confidence and refuses on a stale index."
trigger_phrases:
  - "system-skill-advisor readme"
  - "system-skill-advisor narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/022-system-skill-advisor-readme"
    last_updated_at: "2026-06-07T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped system-skill-advisor README; Batch E 2 of 3"
    next_safe_action: "Begin phase 023 (system-spec-kit README, keep depth)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Three stale facts to correct: embedder single-manifest claim (registry defaults via cascade to a local model, drop the count), advisor_recommend options omit includeAbstainReasons, changelog link points only to v0.2.0"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: system-skill-advisor README

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
| **Phase** | 22 of 24 |
| **Predecessor** | 021-system-code-graph-readme |
| **Successor** | 023-system-spec-kit-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22**, the second skill in Batch E (system-*).

**Scope Boundary**: Only `.opencode/skills/system-skill-advisor/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `system-skill-advisor/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The system-skill-advisor README is a tabular reference card with no problem-first entry point. Its facts are largely accurate, but it does not lead with the distinctive value: standalone Gate 2 routing that picks the right skill with calibrated, prompt-safe confidence and refuses to answer on a stale index rather than fabricate a recommendation. The gather also found three small stale claims to correct.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the five-lane scorer, the nine MCP tools, the four-value trust contract and the boundary with the target skills, system-spec-kit and system-code-graph, preserving the verified facts and correcting the three stale claims.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `system-skill-advisor/README.md` to the narrative skeleton, preserving accurate facts and correcting three stale claims.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/README.md` | Modify | Narrative-voice rewrite of the Gate 2 routing README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no table of contents |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Core facts preserved | Nine MCP tools, the five live lane weights, the four-value trust model and the daemon contract |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Stale facts corrected | Embedder described as a pluggable registry defaulting to a local model (no count), advisor_recommend options include includeAbstainReasons, changelog link points to the directory |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The tools, the lane weights, the trust contract and the boundary match SKILL.md and the source; every cited path resolves.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model repeats the stale single-manifest embedder claim | Inaccurate embedder model | Authoring prompt pinned the corrected description and dropped the count; host verifies the merged draft |
| Risk | Model invents a tool, option or path | Broken reference | Host verified the nine tools and options against the descriptors; all cited paths resolve |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence; one disagreement host-resolved |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The tools, the lane weights, the trust model and the embedder discrepancy resolved during the gather.
<!-- /ANCHOR:questions -->
