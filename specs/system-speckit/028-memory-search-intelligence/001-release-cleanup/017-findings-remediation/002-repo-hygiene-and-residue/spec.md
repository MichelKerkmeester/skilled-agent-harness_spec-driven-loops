---
title: "Feature Specification: Repository Hygiene and Residue Removal"
description: "Committed scratch residue, stale and duplicated ignore rules, rotated logs, and dated benchmark output have accumulated in the tree. None of it is load-bearing, but it obscures real signal and inflates every future audit."
trigger_phrases:
  - "repo hygiene and residue"
  - "017 phase 002"
  - "findings remediation 002"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/002-repo-hygiene-and-residue"
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
      session_id: "2026-07-27-028-017-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Remediation acts only on findings dispositioned CONFIRMED by phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Repository Hygiene and Residue Removal

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
| **Phase** | 002 of 009 |
| **Findings in scope** | 10 |
| **Blast radius** | Low |
| **Predecessor** | ../001-findings-triage-and-verification/spec.md |
| **Successor** | ../003-dead-code-removal/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 002** of the findings remediation program. Source findings: `../../016-dead-code-and-architecture-audit/findings-report.md`.

**Scope Boundary**: This phase acts only on findings that phase 001 dispositioned CONFIRMED.

**Deliverables**:
- Per-finding record of what was done and why.
- `implementation-summary.md` with counts and any deferrals.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Committed scratch residue, stale and duplicated ignore rules, rotated logs, and dated benchmark output have accumulated in the tree. None of it is load-bearing, but it obscures real signal and inflates every future audit.

### Purpose

Clear the residue and fix the ignore rules that let it accumulate, so the next sweep starts from a clean baseline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Committed scratch residue such as .DS_Store and .rename-engine-disposable
- Stale and duplicate .gitignore entries, and the rotated-log pattern that misses *.log.N
- The .env.example file silently ignored by the .env.* pattern with no negation
- Dated benchmark output folders committed to the repository
- Redundant .gitkeep files in directories that now have substantial content

### Out of Scope

- Anything not dispositioned CONFIRMED by phase 001
- Benchmark content itself, which phase 004 owns

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gitignore` | Modify | Remove stale and duplicate entries; add missing negation and rotated-log patterns |
| `(residue paths)` | Delete | Committed scratch files confirmed by phase 001 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Only phase-001 CONFIRMED residue is removed | Every deletion traces to a CONFIRMED disposition row |
| REQ-002 | Ignore-rule changes are verified to actually take effect | git check-ignore output recorded before and after |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | .env.example becomes visible to git again | git check-ignore .env.example returns non-zero |
| REQ-004 | No file outside the CONFIRMED residue set is deleted | git status review before commit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All CONFIRMED residue paths are gone and the tree is clean.
- **SC-002**: `git check-ignore` confirms each corrected ignore rule behaves as intended.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A .gitkeep removal drops a directory git can no longer track | Low | Only remove .gitkeep where the directory has other tracked content |
| Risk | An ignore-rule change unexpectedly exposes files meant to stay ignored | Medium | Diff git status before and after each rule change |
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
