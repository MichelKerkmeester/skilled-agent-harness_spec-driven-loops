---
title: "Implementation Plan: Phase 1: self-check-templates [template:level_1/plan.md]"
description: "Add concise self-check + failure-mode guidance blocks to three manifest templates; verify scaffolds still validate."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/002-self-check-templates"
    last_updated_at: "2026-06-10T04:32:22Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed self-check guidance in manifest templates"
    next_safe_action: "Proceed to next peck phase when ready"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-self-check-templates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: self-check-templates

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates |
| **Framework** | system-spec-kit manifest templates |
| **Storage** | None |
| **Testing** | `validate.sh --strict` on a throwaway scaffold |

### Overview
Add a short self-check + failure-modes guidance block to the spec, plan, and checklist manifest
templates. Ship the block as HTML-comment guidance (the pattern templates already use for voice
guides) so header validation is untouched. Verify by scaffolding a throwaway folder and validating it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met - guidance renders in a Level 2 smoke scaffold
- [x] Tests passing - smoke scaffold strict validation passed
- [x] Docs updated - phase docs reconciled with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template edit. No runtime code; guidance is authored into the manifest templates.

### Key Components
- **The three manifest templates**: `spec.md.tmpl`, `plan.md.tmpl`, `checklist.md.tmpl`.
- **The self-check block**: a small HTML-comment guidance section added to each.

### Data Flow
`create.sh` renders the manifest templates into a scaffold; the new guidance rides along into every new spec folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase edits authoring templates only; it changes no producer/consumer behavior,
schema, or security surface, so there is no affected-surface inventory to perform.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory the current content of the three manifest templates
- [x] Confirm the comment-guidance approach (vs a tracked section)
- [x] Draft the self-check + failure-modes copy (one block, reused with per-doc tweaks)

### Phase 2: Core Implementation
- [x] Add the block to `spec.md.tmpl`
- [x] Add the block to `plan.md.tmpl`
- [x] Add the block to `checklist.md.tmpl`

### Phase 3: Verification
- [x] Scaffold a throwaway folder and confirm the blocks render
- [x] `validate.sh --strict` green on the scaffold
- [x] Update phase docs; parent changelog remains out of scope for this phase
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Scaffold still validates | `validate.sh --strict` |
| Visual | Blocks render and read well | Manual review of a scaffold |
| Regression | No new header/section errors | `validate.sh` on an existing folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| create.sh renderer | Internal | Green | Blocks would not reach scaffolds |
| TEMPLATE_HEADERS validator | Internal | Green | Determines comment-vs-section choice |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Blocks cause validation regressions or read poorly.
- **Procedure**: `git revert` the three template edits. No data or schema migration is involved.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
