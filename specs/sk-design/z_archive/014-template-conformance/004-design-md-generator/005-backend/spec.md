---
title: "Spec: design-md-generator backend/ structural conformance"
description: "Audit backend/'s structure (package.json, tsconfig, scripts/, tests/, README.md, .npmignore — not dist/ or node_modules/) against directory and naming rules; the only sk-design mode with a real test suite."
trigger_phrases:
  - "design-md-generator backend structure conformance"
  - "backend scripts tests directory rules"
  - "md-generator test suite structural audit"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/005-backend"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author backend structural audit spec"
    next_safe_action: "Enumerate backend/ tree excluding dist/ and node_modules/"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/backend/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-md-generator backend/ structural conformance

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
| **Spec Folder** | 005-backend |
| **Parent** | 004-design-md-generator |
| **Predecessor** | `004-procedures` (map position only; no hard dependency, independently executable) |
| **Successor** | `006-feature-catalog` (map position only; no hard dependency, independently executable) |
| **Phase** | 5 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`backend/` is structurally unlike every other sk-design mode folder: it is a real TypeScript package (`package.json`, `tsconfig.json`, `tsconfig.build.json`, `vitest.config.ts`, `README.md`, `.npmignore`) with `scripts/` (29 `.ts` files) and `tests/` (19 `.ts` files + fixtures, 173 tests total). It has no authored sk-doc template — the closest applicable rule set is the directory-purpose guidance in `overview.md` plus the kebab-case/file-type checks `package_skill.py` enforces. `backend/` is also the only mode folder that satisfies the documented "tests/ required when scripts/ exists" rule, since it is the only mode with real executable tooling and a genuine test suite. Its `dist/` and `node_modules/` subdirectories are gitignored build output and out of scope for a structural audit.

### Purpose
Audit `backend/`'s tracked structure (everything except `dist/` and `node_modules/`) against `overview.md` directory rules and `package_skill.py`'s naming/file-type checks, and fix any confirmed structural gap. A clean read is a legitimate outcome, and the audit should explicitly confirm the "tests/ required when scripts/ exists" rule is satisfied here (it is the one place in `design-md-generator` where it applies).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/design-md-generator/backend/{package.json,package-lock.json,tsconfig.json,tsconfig.build.json,vitest.config.ts,README.md,.npmignore}`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/` (29 `.ts` files + its own `README.md`)
- `.opencode/skills/sk-design/design-md-generator/backend/tests/` (19 `.ts` files + `fixtures/` + its own `README.md`)
- All against `overview.md` directory-purpose rules and `package_skill.py`'s naming/file-type checks — structure only, not code content.

### Out of Scope
- `.opencode/skills/sk-design/design-md-generator/backend/dist/` and `backend/node_modules/` — gitignored build output, explicitly out of scope.
- The separate vestigial `design-md-generator/node_modules/` stub at the packet root (outside `backend/`) — owned by sibling `008-structural-anomalies`, not this child.
- Test logic, script implementation, and the 173 tests' assertions — structural conformance only.
- `design-md-generator`'s other folders (siblings 001-004, 006-008).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-md-generator/backend/**` (excluding `dist/`, `node_modules/`) | Audit (Modify if confirmed) | Structural/naming diff against `overview.md` + `package_skill.py` rules |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `backend/` structure read against `overview.md`, excluding `dist/`/`node_modules/` | Directory purpose/placement checked with cited evidence, gitignored build territory explicitly excluded |
| REQ-002 | Naming/file-type checked against `package_skill.py` | Every tracked filename verified against its mandated convention (kebab-case docs, `.ts` scripts/tests) |
| REQ-003 | "tests/ required when scripts/ exists" rule explicitly confirmed satisfied | `backend/tests/` presence and 173-test count cited as the evidence this mode is the one exception that meets the rule |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Confirmed gaps fixed | Any real gap found under REQ-001/002 fixed in place |
| REQ-005 | Vestigial packet-root `node_modules/` stub correctly attributed away from this child | Confirmed as sibling `008-structural-anomalies`'s scope, not touched here |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `backend/`'s tracked structure passes the `overview.md` + `package_skill.py` checks, or every confirmed gap is fixed.
- **SC-002**: The audit explicitly documents that `backend/` satisfies the "tests/ required when scripts/ exists" rule, since it is the only mode folder where the rule is exercised.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Auditing `dist/`/`node_modules/` by mistake | Wasted effort on gitignored build territory | Explicitly exclude both from the file enumeration before starting |
| Risk | Confusing this child's `backend/node_modules/` scope with the sibling packet-root `node_modules/` stub | Duplicate or misattributed fix effort with `008-structural-anomalies` | Confirm the exact path before attributing any `node_modules/` finding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Full enumeration of all tracked `backend/` files (package config + `scripts/` + `tests/`), not a sample.
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
- **Sibling owning the packet-root node_modules/ stub**: `../008-structural-anomalies/` (if present under the program parent)
