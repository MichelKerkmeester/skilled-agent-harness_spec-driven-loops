---
title: "Feature Specification: Legacy and Superseded Artifact Removal"
description: "Benchmark runs, fixtures and changelog files remain on disk after their successors shipped. Several are labelled superseded by their own owning README, and pre-v4 changelogs describe an architecture two restructures out of date."
trigger_phrases:
  - "legacy and superseded removal"
  - "017 phase 004"
  - "findings remediation 004"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/004-legacy-and-superseded-removal"
    last_updated_at: "2026-07-27T08:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase spec from the audit findings"
    next_safe_action: "Wait for phase 001 dispositions before acting"
    blockers: ["Gated on phase 001 triage dispositions"]
    key_files:
      - "spec.md"
      - "../../016-dead-code-and-architecture-audit/findings-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Remediation acts only on findings dispositioned CONFIRMED by phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Legacy and Superseded Artifact Removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 004 of 009 |
| **Findings in scope** | 10 |
| **Blast radius** | Low-Med |
| **Predecessor** | ../003-dead-code-removal/spec.md |
| **Successor** | ../005-misplacement-and-layout/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 004** of the findings remediation program. Source findings: `../../016-dead-code-and-architecture-audit/findings-report.md`.

**Scope Boundary**: This phase acts only on findings that phase 001 dispositioned CONFIRMED.

**Deliverables**:
- Per-finding record of what was done and why.
- `implementation-summary.md` with counts and any deferrals.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Benchmark runs, fixtures and changelog files remain on disk after their successors shipped. Several are labelled superseded by their own owning README, and pre-v4 changelogs describe an architecture two restructures out of date.

### Purpose

Retire artifacts whose live successor already exists, keeping history where it carries value and archiving rather than deleting where provenance matters.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Superseded benchmark runs kept alongside canonical current runs
- Legacy synthetic fixtures the owning README marks superseded by the playbook corpus
- Pre-v4 changelog entries describing a retired architecture, and scaffold-phase changelogs subsumed by later versions
- Leftovers from removed runtime features whose references are now stale

### Out of Scope

- Benchmark tooling itself
- Changelog entries still describing live architecture

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `(superseded benchmark dirs)` | Delete or archive | Runs the owning README labels superseded |
| `(legacy fixtures)` | Delete | Fixtures superseded by the playbook corpus |
| `(pre-v4 changelogs)` | Archive | Consolidate into a single historical summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every retirement cites the successor that supersedes it | Each row names the live replacement |
| REQ-002 | Changelog history is consolidated, not destroyed | A historical summary retains what the removed files recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Stale references to removed runtime features are cleaned up in the same pass | Literal search for the removed name returns only intentional historical mentions |
| REQ-004 | Archived artifacts remain retrievable | Archive location recorded in the phase summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No superseded artifact remains in an active tree.
- **SC-002**: A consolidated historical record replaces the removed changelogs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A benchmark run still cited by an active doc is deleted | Medium | Literal search for each run label before removal |
| Risk | Deleting history that a future audit needs | Medium | Archive rather than delete where provenance is the value |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which findings in this phase does the operator approve for execution?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Audit findings**: `../../016-dead-code-and-architecture-audit/findings-report.md`
- **Phase parent**: `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
