---
title: "Feature Specification: deep-research README"
description: "Rewrite the deep-research skill README in the narrative voice, leading with the autonomous research loop, externalized state and the convergence stop signal."
trigger_phrases:
  - "deep-research readme"
  - "deep-research narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/010-deep-research-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped deep-research README via deep-context + dual-draft"
    next_safe_action: "Begin phase 011 (deep-review README)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-research/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Version line and hard script count dropped (README/SKILL.md drift); findings-registry named per SKILL.md canonical declaration"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep-research README

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
| **Phase** | 10 of 24 |
| **Predecessor** | 009-deep-loop-runtime-readme |
| **Successor** | 011-deep-review-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10**, the deep-research loop in Batch B.

**Scope Boundary**: Only `.opencode/skills/deep-research/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `deep-research/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-research README is a tabular reference card with a buried Key Statistics block and no problem-first entry point. It carries a version line that disagrees with the SKILL.md frontmatter and a script count that has drifted. It does not lead with the skill's distinctive value: an autonomous research loop that externalizes state to disk and dispatches a fresh LEAF agent per iteration so the context window never fills with stale findings.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the autonomous loop, the externalized state and the convergence stop signal, with the stale version line and hard script count dropped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `deep-research/README.md` to the narrative skeleton; lead with the loop, externalized state and convergence detection.

### Out of Scope

- Any change to SKILL.md or the loop's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-research/README.md` | Modify | Narrative-voice rewrite of the research-loop README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Leads with the distinctive value | QUICK START shows `/deep:start-research-loop:auto "topic"`; HOW IT WORKS covers the lifecycle, externalized state and convergence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Stale drift dropped | No version line and no hard script count; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The loop lifecycle, the state files and the convergence model match SKILL.md and the tree; all 21 cited references, scripts and assets resolve.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft repeats the stale version line or a drifted script count | Inaccurate README | Host dropped both per the template; verified the paths against the tree |
| Risk | Findings-registry filename drift (config asset short form vs SKILL.md canonical) | Reader confusion | Named per the SKILL.md canonical declaration (`deep-research-findings-registry.json`) |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The loop, state files and convergence model verified during the gather.
<!-- /ANCHOR:questions -->
