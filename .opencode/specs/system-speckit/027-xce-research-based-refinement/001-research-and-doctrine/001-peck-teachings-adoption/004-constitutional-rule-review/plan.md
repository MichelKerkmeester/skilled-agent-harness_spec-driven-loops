---
title: "Implementation Plan: Phase 4: constitutional-rule-review"
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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review"
    last_updated_at: "2026-06-10T06:19:50Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed rule staleness diagnostic"
    next_safe_action: "Use diagnostic for future reviews"
    blockers: []
    key_files:
      - "constitutional/"
      - "scripts/constitutional-rule-staleness.cjs"
      - "references/memory/memory_system.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-constitutional-rule-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: constitutional-rule-review

<!-- SPECKIT_LEVEL: 2 -->

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
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks/checklist/summary)
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
- [x] Choose the diagnostic host (standalone read-only script)
- [x] Choose the field name (`last_confirmed` date plus provenance)
- [x] Determine backfill source (git last-touch date per rule)

### Phase 2: Core Implementation
- [x] Add the field to each constitutional/*.md (backfilled)
- [x] Build the read-only diagnostic that lists rules by staleness
- [x] Document the review cadence (re-confirm rules older than 180 days)

### Phase 3: Verification
- [x] Diagnostic prints all rules with date + age, sorted by staleness
- [x] Confirm no rule file is modified or deleted by the diagnostic
- [x] Update phase docs; parent changelog left out of scope for this brief
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
| Diagnostic host decision | Internal | Green | Standalone read-only script selected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The field or diagnostic proves unhelpful.
- **Procedure**: `git revert` the field additions and remove the diagnostic. Since it is read-only, no data is at risk.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Backfill source and host decision |
| Core Implementation | Medium | Metadata edits, diagnostic, cadence docs |
| Verification | Medium | Syntax, read-only proof, status, strict validation |
| **Total** | | **Single implementation pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration required
- [x] Diagnostic remains standalone and read-only
- [x] No daemon restart required

### Rollback Procedure
1. Remove the `last_confirmed` metadata fields from rule frontmatter.
2. Remove the standalone diagnostic.
3. Remove the cadence paragraph from the memory reference.
4. Re-run strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: file-level revert only; no database rollback needed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
