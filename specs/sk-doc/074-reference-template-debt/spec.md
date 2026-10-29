---
title: "Feature Specification: Bring every skill reference doc that fails the reference format up to it"
description: "Phase parent for the tracked skill reference docs that fail validate_document.py: the 34 diagram references first, then the rest, each fixed without changing routing or breaking a section reference, or exempted with a recorded reason."
trigger_phrases:
  - "reference template debt phase parent spec"
  - "reference format debt"
  - "reference doc overview section"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/074-reference-template-debt"
    last_updated_at: "2026-10-29T23:59:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Landed the exact-suffix format-spec exemption; all 454 references read 445 OK, 0 FAIL, 9 SKIPPED"
    next_safe_action: "Commit the packet"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/sk-doc/shared/assets/template-rules.json"
      - ".skilled/skills/sk-doc/scripts/tests/test_format_spec_exclusion.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-277-reference-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Bring every skill reference doc that fails the reference format up to it

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/277-reference-template-debt` |
| **Parent Spec** | None |
| **Parent Packet** | sk-doc/074-reference-template-debt |
| **Predecessor** | sk-doc/071-readme-reference-debt |
| **Successor** | None |
| **Handoff Criteria** | Each child validates strict on its own and records its per-file validator counts, its routing replay and the proof that every section reference still lands on the same heading |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The reference format asks every tracked `references/**/*.md` doc (READMEs aside) for an overview section, numbered ALL-CAPS sections in sequence and a `---` rule between sections. Running `validate_document.py` over the 454 such files in this worktree finds 61 that fail, 4 that the validator skips as fixtures and 389 that pass. The failures hide in docs that other files cite by section number, so a careless renumber would break those citations without any validator noticing.

### Purpose
Bring every failing reference doc to the format with no change to routing and no section reference that points somewhere new. Where a doc cannot be fixed without breaking citations, or is a sample output rather than a reference, record the decision and the smallest exemption that would fit.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 34 failing `sk-design-diagram` references: the 27 type files, the catalog, three import and export procedures, the output spec, the derivation record and the icon primitive
- The 27 failing references elsewhere, each fixed or exempted with a reason
- The section references that cite a renumbered doc, wherever they sit

### Out of Scope
- Resource paths, routing vocabulary and every `ROUTER.md`, `hub-router.json` and `mode-registry.json` file
- The validator itself, apart from one exact-suffix exemption list and its test
- READMEs, which `audit_readmes.py` and its own packets cover
- Prose quality inside the docs, which is kept as written

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-design/sk-design-diagram/references/**/*.md` | Modify | 001 | Overview section, renumbered sections, capitalised titles, section rules |
| `.skilled/skills/**/references/**/*.md` (22 files) | Modify | 002 | Same treatment, one skill at a time |
| `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` and 10 playbook scenarios | Modify | 002 | Section citations that followed the four repo-rule references |
| `.skilled/skills/*/changelog/` newest entry (12 components) | Modify | 002 | One bullet each |
| `.hermes/skills/sk-create-repo-rule/SKILL.md` | Regenerate | 002 | Generated copy of the edited skill contract |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` and `scripts/tests/test_format_spec_exclusion.py` | Modify, Create | 002 | Skip the DESIGN.md format spec and its four samples by exact path suffix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-diagram-references/ | Bring the 34 diagram references to the format with one script and a before and after proof for every section reference | Complete |
| 2 | 002-remaining-references/ | Fix or exempt the other failing references and update the files that cite them | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-diagram-references | 002-remaining-references | All 34 diagram references report 0 issues and the proof table has no mismatch | `validate_document.py` on each file and the table summary |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None. The four sample `DESIGN.md` files and `design-md-format.md` leave the failing list through `FORMAT_SPEC_FILES`, five exact path suffixes in `validate_document.py` with a test, recorded as Accepted in phase 002's `decision-record.md`. The sweep over all 454 references reads 445 OK, 0 FAIL, 9 SKIPPED.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
