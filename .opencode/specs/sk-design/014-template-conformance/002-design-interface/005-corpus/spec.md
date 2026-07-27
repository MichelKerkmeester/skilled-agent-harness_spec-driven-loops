---
title: "Feature Specification: design-interface corpus conformance"
description: "Audit design-interface/corpus/ (2 .mjs adapters + tests/) against the directory rules in create-skill/references/shared/overview.md and package_skill.py's kebab/file-type checks; no authored template applies."
trigger_phrases:
  - "design-interface corpus conformance"
  - "corpus directory audit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/005-corpus"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Found corpus/README.md has zero frontmatter unlike scripts/README.md"
    next_safe_action: "Audit corpus/ against overview.md rules and package_skill.py"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/corpus/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: design-interface corpus conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance/002-design-interface` |
| **Predecessor** | `004-procedures` |
| **Successor** | `006-scripts` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`corpus/` is not one of the three canonical bundled-resource categories (`scripts/`, `references/`, `assets/`) documented in `create-skill/references/shared/overview.md` §2, so no authored template governs it directly. It holds `README.md` (46 lines, zero YAML frontmatter — not even the minimal title/description pair the sibling `scripts/README.md` carries), two adapters (`relational-exemplar.mjs`, `relationship-blueprint.mjs`), and a `tests/` folder (its own `README.md` plus 4 `.test.mjs`/fixture files). Because there is no reference/asset template to check headers against, the applicable bar is the general directory and naming rules `package_skill.py` enforces (kebab-case, recognized file types) plus the general skill-anatomy conventions in `overview.md`.

### Purpose
Read `corpus/README.md`, both `.mjs` adapters, and the `tests/` subfolder against `overview.md`'s directory-organization principle and `package_skill.py`'s naming/file-type checks. Decide whether the missing frontmatter on `corpus/README.md` is a real gap (informal directory READMEs may be exempt) or a defect to fix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `corpus/README.md`
- `corpus/relational-exemplar.mjs`, `corpus/relationship-blueprint.mjs`
- `corpus/tests/README.md`, `corpus/tests/fixtures.mjs`, `corpus/tests/fixtures-foundations.mjs`, `corpus/tests/relational-exemplar.test.mjs`, `corpus/tests/relationship-blueprint.schema.test.mjs`, `corpus/tests/relationship-blueprint.test.mjs`

### Out of Scope
- `references/`, `assets/`, `procedures/`, `scripts/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/` — sibling children.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `corpus/README.md` | Audit | Zero frontmatter, unlike `scripts/README.md`'s minimal title/description pair — decide if this inconsistency needs fixing |
| `corpus/*.mjs`, `corpus/tests/*.mjs` | Audit | Confirm kebab-case naming and recognized file-type conformance via `package_skill.py` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `package_skill.py --check` run against the packet, with `corpus/` findings isolated | Command output captured, corpus-specific violations (if any) listed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Frontmatter inconsistency between `corpus/README.md` (none) and `scripts/README.md` (minimal) resolved or explicitly accepted | Decision recorded with rationale |
| REQ-003 | Confirm kebab-case naming for `relational-exemplar.mjs`, `relationship-blueprint.mjs`, and all `tests/` files | Verdict recorded |
| REQ-004 | Confirm no other file exists under `corpus/` beyond the 6 accounted for in scope | Fresh `find corpus -type f` matches the scope table |
| REQ-005 | `corpus/tests/README.md` audited alongside the root `corpus/README.md` for the same frontmatter question | Verdict recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check` reports no naming or file-type violations under `corpus/`.
- **SC-002**: The README frontmatter question has an explicit, recorded answer.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding frontmatter to `corpus/README.md` without checking whether the maintainer-facing tone (currently plain narrative prose) should change | Style drift | Keep any frontmatter addition minimal; do not rewrite the existing narrative |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is a directory README for a non-canonical bundled-resource folder (`corpus/` is design-interface-specific, not one of `scripts/references/assets`) required to carry frontmatter at all, or is the current zero-frontmatter narrative style acceptable?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Parent Spec**: `../spec.md`
- **Directory rules**: `.opencode/skills/sk-doc/create-skill/references/shared/overview.md`
- **Checker**: `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py`
