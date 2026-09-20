---
title: "Spec: design-motion manual-testing-playbook/ conformance"
description: "Audit the 14-file manual-testing-playbook/ tree (root + 7 subdirectories) against manual-testing-playbook-template.md and remediate any confirmed gap."
trigger_phrases:
  - "design-motion manual-testing-playbook conformance"
  - "motion playbook template audit"
  - "motion procedure-card-contract structure"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/007-manual-testing-playbook"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author manual-testing-playbook audit spec"
    next_safe_action: "Enumerate and read all 14 playbook files against the template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-motion manual-testing-playbook/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned — not yet audited |
| **Spec Folder** | 007-manual-testing-playbook |
| **Parent** | 003-design-motion |
| **Predecessor** | `006-feature-catalog` (map position only; no hard dependency, independently executable) |
| **Successor** | `008-changelog` (map position only; no hard dependency, independently executable) |
| **Phase** | 7 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`manual-testing-playbook/` is the largest folder in `design-motion`: a root `manual-testing-playbook.md` plus 7 subdirectories (`advanced-craft/`, `decision/`, `micro-interactions/`, `presence/`, `procedure-card-contract/`, `reduced-motion/`, `strategy/`) holding 13 further files, 14 total. None of it was in the 014 program's seed sample. Two files (`presence/animate-presence-checklist.md`, `reduced-motion/motion-performance-failure-card.md`) share a name with a file in `assets/` (sibling child `003-assets`) — they are separate files at separate paths and both need their own conformance check.

### Purpose
Enumerate and read all 14 files against `manual-testing-playbook-template.md` and fix any confirmed gap. A clean read is a legitimate outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `manual-testing-playbook.md` (root)
- `advanced-craft/advanced-craft-popover-tooltip.md`
- `decision/restraint-gate.md`
- `micro-interactions/micro-interactions-feedback.md`
- `presence/{animate-presence-checklist,animate-presence-exit-rules}.md`
- `procedure-card-contract/{card-selection-proof,direct-fallback-without-subagents,no-card-fallback}.md`
- `reduced-motion/{motion-performance-failure-card,performance-and-reduced-motion}.md`
- `strategy/{async-state-machine-card,motion-pattern-card,purposeful-motion-plan}.md`
- All 14 against `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md`.

### Out of Scope
- `design-motion`'s other folders (siblings 001-006, 008), including the `assets/` copies of the two same-named files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-motion/manual-testing-playbook/**` | Audit (Modify if confirmed) | Diff each of the 14 files against `manual-testing-playbook-template.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 14 files enumerated and exhaustively read against the template | Every file diffed section-by-section with cited evidence |
| REQ-002 | Same-named files disambiguated from `assets/` counterparts | The 2 playbook files edited are the `manual-testing-playbook/` paths, not the `assets/` paths owned by sibling 003 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Confirmed gaps fixed | Any real gap found under REQ-001 fixed in place |
| REQ-004 | All 14 files enumerated before diffing, none missed across 7 subdirectories | Full path list checked off one by one |
| REQ-005 | No unrelated content rewrite | Diff shows only structural/template fixes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 14 `manual-testing-playbook/**` files pass a template diff, or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing a file across 7 subdirectories | Incomplete audit claimed complete | Enumerate all 14 files explicitly before starting |
| Risk | Editing the wrong same-named file (`assets/` vs `manual-testing-playbook/`) | Duplicate or conflicting fix with sibling 003 | Always act on the full path, never the bare filename |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Full read of all 14 files across 7 subdirectories, not a sample.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- None yet — the audit itself will surface any question.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Sibling with same-named files**: `../003-assets/spec.md`
