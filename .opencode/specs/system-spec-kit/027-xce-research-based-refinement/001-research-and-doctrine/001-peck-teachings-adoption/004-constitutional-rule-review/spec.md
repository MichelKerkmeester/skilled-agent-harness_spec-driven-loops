---
title: "Feature Specification: Phase 4: constitutional-rule-review"
description: "Phase 4 (T2): add a read-only review surface that lists constitutional rules with last-confirmed metadata, so stale always-surface rules can be retired by a human."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
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
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-constitutional-rule-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: constitutional-rule-review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-06-02 |
| **Branch** | `001-peck-teachings-adoption` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-current-state-discipline |
| **Successor** | None |
| **Handoff Criteria** | Delivered: diagnostic lists all active constitutional rules with staleness and writes nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Adopt low-risk peck teachings (T3 self-check templates, T4 current-state discipline, T2 constitutional rule review) into system-spec-kit specification.

**Scope Boundary**: A read-only review surface plus a metadata field on constitutional rules. No auto-expiry, no decay-behavior change, no deletion.

**Dependencies**:
- The `constitutional/` rule files (to add metadata to).
- A diagnostic host - DECIDED (see `../001-peck-teachings-for-spec-kit/research/research.md` §5): a standalone read-only script first; `/memory:learn` report mode is the better future wrapper (`/memory:manage` and `/doctor memory` are mutation surfaces).

**Deliverables**:
- Delivered: a `last_confirmed` field and provenance field on each active constitutional rule, plus a diagnostic that lists rules by staleness.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent phase folder name plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The constitutional tier (the always-surface rules) never decays and is never reviewed: each rule is a static file that is exempt from forgetting and surfaces with a 3x boost. A rule that becomes stale or contradicted stays frozen at maximum relevance, outranking everything, with no retirement path. Peck keeps its standing guidance bounded and prunes entries that are no longer true (the peck-adoption phase, T2).

### Purpose
Add a read-only review surface that lists each constitutional rule with a last-confirmed date and computed age, so a human can decide what to refresh or retire.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `last_confirmed` date + `last_confirmed_source` provenance (e.g. git-last-commit) frontmatter field to `constitutional/*.md`, backfilled from git history; compute `review_by` at report time, not stored (research.md §5).
- Build a read-only diagnostic that enumerates `constitutional/*.md` dynamically (exclude README.md; require `importanceTier: constitutional`) and lists every rule with its last-confirmed date and age, sorted by staleness.
- Document a review cadence (e.g. surface rules older than N months).

### Out of Scope
- Automatic expiry, decay, or deletion of constitutional rules.
- Changing the 3x search boost or the always-surface behavior.
- Any change that removes a rule without a human in the loop.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `constitutional/*.md` | Modify | Add a `last_confirmed` field (backfill) |
| `scripts/` (new standalone read-only diagnostic) | Create | Read-only "list rules + staleness"; optional later `/memory:learn` report wrapper |
| `references/` (memory docs) | Modify | Document the review cadence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A diagnostic lists every constitutional rule with last-confirmed date and age | Given the diagnostic runs, when it completes, then it prints every constitutional rule file found (enumerated dynamically — NOT a hardcoded count) with a date and computed age |
| REQ-002 | The diagnostic is read-only | Given the diagnostic runs, when it completes, then no rule file is modified or deleted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | constitutional/*.md carry last_confirmed + provenance | Given any rule file, when inspected, then it has a last_confirmed date and a last_confirmed_source (e.g. git-last-commit) value |
| REQ-004 | A documented review cadence exists | Given the memory docs, when read, then they state when rules should be re-confirmed (e.g. older than N months) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running the diagnostic prints all constitutional rules sorted by staleness.
- **SC-002**: No constitutional rule is auto-deleted or auto-demoted; every retirement stays a human decision.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scope creep into auto-expiry/decay | Silent loss of important rules | Keep strictly read-only / human-in-the-loop this phase |
| Risk | Backfilled last_confirmed dates are guesses | Misleading staleness | Backfill with file git-history date, not invented values |
| Risk | Rule-count drift in docs (constitutional README says 2, prior spec said 14) | Misleading diagnostic / spec | Enumerate dynamically; reconcile the README-vs-spec count during implementation |
| Dependency | Diagnostic host choice | Rework if host changes | RESOLVED (research.md §5): standalone read-only script first; `/memory:learn` report mode as the future wrapper |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Diagnostic completes from local file reads without daemon startup.
- **NFR-P02**: Rule enumeration is dynamic and does not rely on a hardcoded count.

### Security
- **NFR-S01**: Diagnostic performs no writes, deletes, demotions, or memory mutations.
- **NFR-S02**: Stale output is a human review signal only.

### Reliability
- **NFR-R01**: Missing or malformed review metadata is visible in diagnostic output rather than silently ignored.
- **NFR-R02**: Review cadence is documented where constitutional tier behavior is described.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty rule directory: diagnostic prints zero matching rules without writing.
- README file present: diagnostic excludes it because it is not an active rule.
- Missing date: diagnostic reports missing metadata instead of inventing a date.

### Error Scenarios
- Unterminated frontmatter: diagnostic exits with an error.
- Invalid date format: diagnostic marks the rule stale for review.
- Unknown CLI argument: diagnostic exits with usage-compatible error output.

### State Transitions
- A fresh rule becomes stale only by calendar age in report output.
- A human may refresh or retire a rule separately; this phase does neither automatically.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple rule files plus one diagnostic, one reference, and phase docs |
| Risk | 8/25 | Read-only diagnostic and metadata-only rule changes |
| Research | 10/20 | Required backfill from git dates and cadence placement |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- RESOLVED (research.md §5): standalone read-only script first; `/memory:learn` report mode is the future wrapper (not `/memory:manage` or `/doctor memory`, which mutate).
- RESOLVED: use `last_confirmed` (date) + `last_confirmed_source` provenance; compute `review_by` at report time. Cadence threshold is 180 days.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
