---
title: "Spec: design-motion corpus/ conformance"
description: "Audit corpus/ (no authored template) against create-skill directory rules and package_skill.py kebab/file-type rules; remediate any confirmed gap."
trigger_phrases:
  - "design-motion corpus conformance"
  - "motion-evidence corpus structure audit"
  - "corpus tests directory rules"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/005-corpus"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author corpus audit spec"
    next_safe_action: "Read corpus/ tree against overview.md directory rules"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/corpus/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-motion corpus/ conformance

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
| **Spec Folder** | 005-corpus |
| **Parent** | 003-design-motion |
| **Predecessor** | `004-procedures` (map position only; no hard dependency, independently executable) |
| **Successor** | `006-feature-catalog` (map position only; no hard dependency, independently executable) |
| **Phase** | 5 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`corpus/` has no authored sk-doc template — it holds `README.md`, `motion-evidence.mjs`, and `tests/` (`README.md`, `fixtures.mjs`, `motion-evidence.schema.test.mjs`, `motion-evidence.test.mjs`). It was not part of the 014 program's seed sample, and there is no template-diff to run — only a structural/naming audit.

### Purpose
Audit `corpus/` against `.opencode/skills/sk-doc/create-skill/references/shared/overview.md` directory rules and the kebab-case/file-type rules `package_skill.py` enforces, and fix any confirmed structural gap.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/design-motion/corpus/README.md`, `motion-evidence.mjs`
- `.opencode/skills/sk-design/design-motion/corpus/tests/` (`README.md`, `fixtures.mjs`, `motion-evidence.schema.test.mjs`, `motion-evidence.test.mjs`)
- All against `overview.md` directory-purpose rules and `package_skill.py`'s naming/file-type checks.

### Out of Scope
- `design-motion`'s other folders (siblings 001-004, 006-008).
- Rewriting `motion-evidence.mjs` logic or the test assertions — structure/naming conformance only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-motion/corpus/**` | Audit (Modify if confirmed) | Structural/naming diff against `overview.md` + `package_skill.py` rules |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `corpus/` structure read against `overview.md` | Directory purpose/placement checked with cited evidence |
| REQ-002 | Naming/file-type checked against `package_skill.py` | Every filename verified kebab-case (non-code) or its mandated extension (`.mjs`/`.test.mjs`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Confirmed gaps fixed | Any real gap found under REQ-001/002 fixed in place |
| REQ-004 | No script import paths broken by a rename | `motion-evidence.mjs` and its test imports still resolve after any structural fix |
| REQ-005 | No unrelated content rewrite | Diff shows only structural/naming fixes, no test-assertion or logic changes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `corpus/` structure and naming pass the `overview.md` + `package_skill.py` checks, or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | No authored template invites a skipped or superficial audit | Real structural gaps missed | Apply `overview.md` directory rules + `package_skill.py` explicitly, not an ad hoc read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Full read of all 6 files in `corpus/` + `corpus/tests/`, not a sample.
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
