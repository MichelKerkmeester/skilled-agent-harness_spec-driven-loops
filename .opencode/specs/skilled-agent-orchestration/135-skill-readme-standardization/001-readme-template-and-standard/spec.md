---
title: "Feature Specification: README template and standard"
description: "Rewrite the sk-doc skill-README template to the narrative changelog voice and ship a golden-example README so every later phase has a concrete, validator-passing standard to follow."
trigger_phrases:
  - "readme template standard"
  - "skill readme narrative voice"
  - "golden example readme"
  - "sk-doc readme template"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/001-readme-template-and-standard"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped narrative template + sk-git golden example"
    next_safe_action: "Begin batch A skill README rewrites (phases 002-005)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/skill/skill_readme_template.md"
      - ".opencode/skills/sk-git/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Narrative voice is expressed within numbered ALL-CAPS H2 sections so the sk-doc validator still passes"
      - "Golden example is sk-git, hand-authored from its real files to lock the standard"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: README template and standard

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
| **Phase** | 1 of 24 |
| **Predecessor** | None |
| **Successor** | 002-cli-claude-code-readme |
| **Handoff Criteria** | Template + golden example ship, both pass sk-doc validation and HVR |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the skill README standardization. It locks the voice and structure that the remaining phases follow.

**Scope Boundary**: The sk-doc skill-README template, any sk-doc reference that describes README structure, and one golden-example README. No other skill README is rewritten in this phase.

**Dependencies**:
- The sk-doc `validate_document.py` readme rules (numbered ALL-CAPS H2, required OVERVIEW).
- The Human Voice Rules in `references/global/hvr_rules.md`.

**Deliverables**:
- A rewritten `skill_readme_template.md` in the narrative voice.
- A golden-example README (`sk-git`) that conforms to it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-doc skill-README template encodes a tabular reference-card layout: a feature inventory, a structure tree and a settings table, with no human entry point. Every new skill README inherits that shape, and it reads nothing like the repo root README or the changelogs. Without a new template, a mass rewrite has no standard to converge on.

### Purpose

Ship a skill-README template in the narrative changelog voice, plus a golden-example README that proves the standard on a real skill, so phases 002 to 024 have a concrete and validator-passing target.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `skill_readme_template.md`: the section model, writing rules, fillable scaffold and validation checklist.
- Update sk-doc references only where they describe README section structure.
- Author the `sk-git` README as the golden example.

### Out of Scope

- The other 21 skill READMEs and the skills index. Those are later phases.
- Any `SKILL.md` runtime file or skill behavior. This phase is documentation-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md` | Modify | Rewrite to the narrative skeleton, rules and checklist |
| `.opencode/skills/sk-git/README.md` | Modify | Golden-example README in the new voice |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template uses the narrative skeleton (pitch, AT A GLANCE, problem-first OVERVIEW, verification close) | The fillable scaffold contains each section in order |
| REQ-002 | Template stays validator-safe | A filled README passes `validate_document.py --type readme` with zero issues |
| REQ-003 | Golden example ships for a real skill | `sk-git/README.md` is rewritten in the new voice |
| REQ-004 | Golden example passes structure validation | `validate_document.py --type readme` reports zero issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Template and example are HVR-clean | No em dashes, semicolons, Oxford-comma lists or hard-blocker words |
| REQ-006 | Writing rules state the numbered ALL-CAPS constraint | Section 3 of the template documents the constraint and why it exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The golden-example README passes `validate_document.py --type readme` with zero issues.
- **SC-002**: A later phase can author a conformant README by filling the scaffold without inventing structure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Narrative voice conflicts with the validator's numbered ALL-CAPS rule | Templates would fail validation | Keep numbered ALL-CAPS headers and carry the voice in prose and structure |
| Dependency | sk-doc readme rules in `template_rules.json` | Defines what a README must contain | Read the rules and design the scaffold to satisfy them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Voice, structure and the golden-example skill were settled at planning.
<!-- /ANCHOR:questions -->
