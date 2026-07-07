---
title: "Feature Specification: 004-sk-doc-type-validation-alignment (skeleton, pre-synthesis)"
description: "Skeleton spec — per-file 1:1 sk-doc template alignment for system-skill-advisor across SKILL.md, ARCHITECTURE.md, INSTALL_GUIDE.md, references/*, feature_catalog/*, manual_testing_playbook/*."
trigger_phrases:
  - "skill-advisor sk-doc alignment"
  - "004 1:1 alignment phase"
  - "sk-doc template alignment skill-advisor"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/004-sk-doc-type-validation-alignment"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded child 004 skeleton"
    next_safe_action: "Fill post-001 synthesis"
    blockers: ["001 research.md required"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 004-sk-doc-type-validation-alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Pending (gated by 001 synthesis) |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Per-file sk-doc template adherence varies across system-skill-advisor doc surfaces. Most surfaces PASS structurally but the manual_testing_playbook is PARTIAL (incomplete legacy ID mapping, count discrepancy), and per-file content alignment needs full 1:1 review against sk-doc templates per the audit's iters 01, 03-13, 15.

### Purpose
Align every doc surface 1:1 with the sk-doc template that owns it: skill_md for SKILL.md, architecture_current_reality for ARCHITECTURE.md, skill_reference_install_guide for INSTALL_GUIDE.md, skill_reference for each references/*, skill_asset_feature_catalog for the catalog parent + per-feature files, manual_testing_playbook for the playbook parent + per-scenario files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Per-file alignment edits for: SKILL.md, ARCHITECTURE.md, INSTALL_GUIDE.md, all 7 references/*, all 7 feature_catalog/* groups + parent, all 9 manual_testing_playbook/* categories + parent
- Specifics filled from 001 iters 01, 03-13, 15

### Out of Scope
- README.md (owned by 003)
- New reference docs (owned by 005)
- Bug fixes (owned by 002)

### Files to Change
[Filled post-synthesis from per-iter findings]

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [TBD per iter] | [TBD] | [TBD] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every doc surface PASSES sk-doc template per validate | Per-file validate result |
| REQ-002 | Manual testing playbook moves PARTIAL → PASS | Legacy mapping complete, counts reconciled, gap-09 documented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 doc surfaces validate clean against sk-doc templates
- **SC-002**: Playbook PARTIAL → PASS verified
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 iters 01, 03-13, 15 findings | Blocker | Cannot author specifics until 001 ships |
| Risk | Renumbering gap-05 / gap-09 breaks checked-in inventory tests | Medium | Decision-doc records explanatory-note path, not renumber |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- gap-05 and gap-09: explanatory note vs renumber? Decision deferred to iter 10 + iter 14
<!-- /ANCHOR:questions -->
