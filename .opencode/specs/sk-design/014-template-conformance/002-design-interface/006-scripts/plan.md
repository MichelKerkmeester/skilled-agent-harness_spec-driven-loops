---
title: "Implementation Plan: design-interface scripts conformance"
description: "Confirm and document the missing tests/ directory finding; audit README.md and the three checkers against overview.md."
trigger_phrases:
  - "scripts plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/006-scripts"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned plan.md"
    next_safe_action: "Run package_skill.py --check and confirm tests/ absence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: design-interface scripts conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (checkers), Markdown (README) |
| **Framework** | `skill-reference-template.md` §8 directory rules |
| **Storage** | None |
| **Testing** | `package_skill.py --check`; the three checkers' own `--json`/exit-code contracts |

### Overview
Document the confirmed `tests/` gap as a finding for operator decision; audit `README.md` and the three checkers against `overview.md`'s scripts-directory conventions; do not auto-scaffold tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable

### Definition of Done
- [ ] `tests/` finding documented with template citation
- [ ] Operator decision recorded
- [ ] `README.md` + 3 checkers audited
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Directory-rule audit + documented finding; no code architecture change unless the operator approves a `tests/` scaffold.

### Key Components
- **`scripts/README.md`**: directory index, 2-field frontmatter.
- **3 Python checkers**: `baseline_rhythm_check.py`, `contrast_check.py`, `naming_doc_check.py`.
- **`fixtures/naming-doc/`**: positive/negative fixture pair for `naming_doc_check.py`.

### Data Flow
Checkers run against filled artifacts elsewhere in the repo; fixtures validate the checkers themselves.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `find scripts -type d` shows no `tests/`
- [ ] Re-read `skill-reference-template.md` §8

### Phase 2: Core Implementation
- [ ] Audit `README.md` frontmatter against `overview.md` scripts-directory guidance
- [ ] Audit the three `.py` checkers' docstrings/CLI usage against `README.md`'s documented invocation
- [ ] Present the `tests/` finding to the operator with the template citation

### Phase 3: Verification
- [ ] Run `package_skill.py --check`
- [ ] Record the operator's `tests/` decision in `checklist.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Checker | Packet-root conformance | `package_skill.py --check` |
| Manual | Checker CLI usage matches README | Direct invocation of the three scripts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator decision on `tests/` scaffold | Internal | Yellow | Blocks REQ-003 until answered; does not block the audit itself |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A — this packet does not write a `tests/` scaffold without separate operator approval.
- **Procedure**: N/A.
<!-- /ANCHOR:rollback -->
