---
title: "Feature Specification: sk-prompt README"
description: "Rewrite the sk-prompt skill README in the narrative voice, leading with the prompt-engineering engine (seven frameworks, DEPTH thinking, CLEAR scoring)."
trigger_phrases:
  - "sk-prompt readme"
  - "sk-prompt narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/020-sk-prompt-readme"
    last_updated_at: "2026-06-07T14:57:42Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped sk-prompt README via deep-context + dual-draft; Batch D complete"
    next_safe_action: "Begin phase 021 (system-code-graph README)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-020"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dropped version; described modes rather than pinning a count (docs disagree 8 vs 9); clarified framework-registry.json is a 5-of-7 code-oriented subset; filled CLEAR floors; fixed one em-dash and two Oxford-list commas in the merge"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-prompt README

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
| **Phase** | 20 of 24 |
| **Predecessor** | 019-sk-prompt-models-readme |
| **Successor** | 021-system-code-graph-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified; registry subset clarified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20**, the sixth skill in Batch D (sk-*) and the batch closer.

**Scope Boundary**: Only `.opencode/skills/sk-prompt/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `sk-prompt/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-prompt README is a tabular reference card with no problem-first entry point, and it carries a stale version line plus mode-count drift (it claims eight modes in one place and lists nine in another because the `$deep`/`$d` and `$s` aliases live in the references but not in the SKILL.md mode table). It does not lead with the distinctive value: an engine that auto-selects a framework, runs a structured thinking pass and scores the output so a prompt ships only when it clears the bar.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the prompt-engineering engine (seven frameworks with auto-selection, DEPTH thinking, CLEAR scoring), with the version dropped, the modes described rather than counted, and the framework registry correctly framed as a five-of-seven code-oriented subset.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `sk-prompt/README.md` to the narrative skeleton; clarify the registry subset and drop the version and mode count.

### Out of Scope

- Any change to SKILL.md, the references or the registry. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/README.md` | Modify | Narrative-voice rewrite of the prompt-engineering engine README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no table of contents |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Core facts accurate | Seven frameworks in patterns_evaluation.md, DEPTH five phases, CLEAR rubric (50, pass 40), modes described not counted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Drift dropped | No version; registry framed as a five-of-seven subset; round counts mode-driven (not "5 to 10"); every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The frameworks, DEPTH phases, CLEAR rubric and modes match SKILL.md and the references; the registry is framed as a subset; every cited path resolves.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model presents framework-registry.json as all seven definitions | Overstated registry | Authoring prompt framed it as a five-of-seven subset; host confirmed the draft says so |
| Risk | Model introduces an em dash or Oxford-list comma | HVR violation | Host scanned the draft, fixed one em dash in an example block and two Oxford-list commas |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The frameworks, DEPTH, CLEAR and modes verified during the gather.
<!-- /ANCHOR:questions -->
