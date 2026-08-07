---
title: "Feature Specification: design-interface scripts conformance"
description: "Audit design-interface/scripts/ (3 Python checkers + fixtures) against skill-reference-template.md's directory rules; the template's tests/ requirement for scripts/ is unenforced and unmet here."
trigger_phrases:
  - "design-interface scripts conformance"
  - "scripts tests requirement"
  - "missing tests directory"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/006-scripts"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Confirmed no tests/ dir exists despite scripts/ existing"
    next_safe_action: "Run package_skill.py --check and raise the tests/ scaffold question"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/scripts/"
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

# Feature Specification: design-interface scripts conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (tests/ scaffold-vs-exception decision left open for operator) |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance/002-design-interface` |
| **Predecessor** | `005-corpus` |
| **Successor** | `007-feature-catalog` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`scripts/` holds `README.md`, three deterministic Python checkers (`baseline_rhythm_check.py`, `contrast_check.py`, `naming_doc_check.py`), and `fixtures/naming-doc/{compliant.md,violating.md}` used as positive/negative examples for `naming_doc_check.py` itself. `skill-reference-template.md` §8's standard structure table states `tests/` is **REQUIRED** when `scripts/` exists, with ≥80% line coverage and `test_[name].py` naming — this mode has no `tests/` directory under `scripts/`, and no checker in the repo currently flags that gap. `README.md` itself has only a 2-field frontmatter (`title`, `description`), not the full 5-field block other reference/asset files carry.

### Purpose
Confirm the `tests/` gap is real (it is — `find scripts -type d` shows only `fixtures/naming-doc/`, no `tests/`), record it as a finding for operator decision rather than silently scaffolding tests, and separately audit `README.md` and the three checkers against `overview.md`'s scripts-directory guidance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `scripts/README.md`
- `scripts/baseline_rhythm_check.py`, `scripts/contrast_check.py`, `scripts/naming_doc_check.py`
- `scripts/fixtures/naming-doc/compliant.md`, `scripts/fixtures/naming-doc/violating.md`
- The missing `tests/` directory (finding, not automatic fix)

### Out of Scope
- `references/`, `assets/`, `procedures/`, `corpus/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/` — sibling children.
- Writing the actual `tests/` scaffold — this is an operator decision (see Open Questions), not a default action.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/README.md` | Audit | Only 2-field frontmatter; confirm whether scripts-directory READMEs require the full 5-field block |
| `scripts/*.py` | Audit | Confirm each checker's docstrings/CLI usage match `README.md`'s documented invocation |
| `scripts/tests/` (missing) | Finding only | `skill-reference-template.md` §8 requires this when `scripts/` exists; not present, not enforced by any checker |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirm the `tests/` gap and record it as an explicit finding | Finding documented in `checklist.md` with template citation, no silent fix |
| REQ-002 | Audit `README.md` and the three `.py` checkers against `overview.md`'s scripts-directory conventions | Verdict recorded per file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Operator decision on whether to scaffold `tests/` (with `test_[name].py` naming, ≥80% coverage) or record a formal exception for this mode | Decision recorded; if scaffolding, deferred to a follow-up packet since it is new test-authoring work, not a template-conformance fix |
| REQ-004 | Confirm `fixtures/naming-doc/{compliant.md,violating.md}` are correctly named and still exercise `naming_doc_check.py` as documented | Manual invocation confirms both fixtures produce their expected pass/fail result |
| REQ-005 | Confirm no other file exists under `scripts/` beyond `README.md`, the 3 checkers, and `fixtures/naming-doc/` | Fresh `find scripts -type f` matches the scope table |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `tests/` gap is documented with an explicit operator decision — not silently left unaddressed and not silently auto-scaffolded.
- **SC-002**: `README.md` and the three checkers have an explicit conformance verdict against `overview.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Auto-scaffolding `tests/` without operator sign-off would introduce untested test files (fabricated coverage) | Bad-faith conformance ("tests exist" but do not verify anything) | Treat any `tests/` scaffold as a separate, operator-approved follow-up, not this packet's default action |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `design-interface/scripts/` get a `tests/` directory (≥80% coverage, `test_[name].py`) to satisfy `skill-reference-template.md` §8, or should this mode carry a documented, formally-approved exception? This is an operator decision, not a default action this packet takes on its own.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Parent Spec**: `../spec.md`
- **Governing rule**: `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md` §8
- **Directory rules**: `.opencode/skills/sk-doc/create-skill/references/shared/overview.md`
