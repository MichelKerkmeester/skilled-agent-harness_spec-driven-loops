---
title: "Implementation Plan: Phase 3: constitutional-rule-review [template:level_1/plan.md]"
description: "Add last-confirmed metadata to constitutional rules and a read-only diagnostic that lists them by staleness."
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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/004-constitutional-rule-review"
    last_updated_at: "2026-06-02T10:04:54Z"
    last_updated_by: "planning-author"
    recent_action: "Authored phase plan (planned, not implemented)"
    next_safe_action: "Implement: add last_confirmed field + review diagnostic"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-constitutional-rule-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: constitutional-rule-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown frontmatter + a small diagnostic script |
| **Framework** | system-spec-kit constitutional tier + memory tooling |
| **Storage** | None (reads existing files) |
| **Testing** | Manual run of the diagnostic |

### Overview
Add a `last_confirmed` field to each constitutional rule (backfilled from git history) and build a
read-only diagnostic that lists every rule with its age, sorted by staleness. The diagnostic only
surfaces rules for a human to refresh or retire; it never deletes or demotes anything automatically.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only diagnostic + a metadata field. No change to decay or search-boost behavior.

### Key Components
- **Constitutional rule files**: `constitutional/*.md` gain a `last_confirmed` field.
- **Diagnostic**: a script or `/doctor` / `/memory:manage` route that lists rules by staleness.
- **Docs**: a documented review cadence.

### Data Flow
The diagnostic reads each rule's frontmatter, computes age from `last_confirmed`, and prints the rules sorted oldest-first. It writes nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a bug fix. This phase is additive and read-only: it adds an optional frontmatter
field and a diagnostic that only reads. It does not change the constitutional tier's decay exemption,
search boost, or always-surface behavior, so there is no behavioral surface to inventory.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Choose the diagnostic host (script vs /doctor vs /memory:manage)
- [ ] Choose the field name (`last_confirmed` date vs `review_by` deadline)
- [ ] Determine backfill source (git first-commit / last-touch date per rule)

### Phase 2: Core Implementation
- [ ] Add the field to each constitutional/*.md (backfilled)
- [ ] Build the read-only diagnostic that lists rules by staleness
- [ ] Document the review cadence (e.g. re-confirm rules older than N months)

### Phase 3: Verification
- [ ] Diagnostic prints all rules with date + age, sorted by staleness
- [ ] Confirm no rule file is modified or deleted by the diagnostic
- [ ] Update phase docs + changelog
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Functional | All rules listed with age | Run the diagnostic |
| Safety | Read-only (no writes) | Diff `constitutional/` before/after a run |
| Docs | Cadence documented | Manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| constitutional/*.md | Internal | Green | Source of rules + metadata |
| Diagnostic host decision | Internal | Yellow | Determines where the surface lives |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The field or diagnostic proves unhelpful.
- **Procedure**: `git revert` the field additions and remove the diagnostic. Since it is read-only, no data is at risk.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
