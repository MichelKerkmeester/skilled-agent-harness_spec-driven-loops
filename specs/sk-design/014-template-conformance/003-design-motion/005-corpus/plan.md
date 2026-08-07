---
title: "Plan: design-motion corpus/ conformance"
description: "Plan to audit design-motion's corpus/ directory (no authored template) against overview.md rules and package_skill.py."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/005-corpus"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author corpus audit plan"
    next_safe_action: "Read corpus/ tree against overview.md directory rules"
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
# Plan: design-motion corpus/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | Mixed markdown + `.mjs` corpus/test files, no authored skill template |
| **Governing rules** | `create-skill/references/shared/overview.md` (directory purpose) + `package_skill.py` (kebab/file-type) |
| **Verification** | Rule-by-rule structural check + `validate.sh` |

### Overview
Because `corpus/` has no authored template, this is a rules-based structural/naming audit rather than a section-by-section content diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `overview.md` directory rules read in full
- [ ] `package_skill.py` naming/file-type rules identified
- [ ] All 6 files under `corpus/` + `corpus/tests/` located

### Definition of Done
- [ ] Structure and naming checked against both sources
- [ ] Confirmed gaps fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rules-based structural audit (no template diff).

### Key Components
- **Target:** `design-motion/corpus/{README.md,motion-evidence.mjs}` + `corpus/tests/{README.md,fixtures.mjs,motion-evidence.schema.test.mjs,motion-evidence.test.mjs}`.
- **Reference:** `overview.md` directory rules, `package_skill.py` naming checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `overview.md` directory rules
- [ ] Identify `package_skill.py`'s naming/file-type checks

### Phase 2: Core Implementation
- [ ] Check `corpus/` placement and purpose against `overview.md`
- [ ] Check every filename against kebab-case/file-type rules
- [ ] Fix confirmed gaps

### Phase 3: Verification
- [ ] Re-check the fixed structure
- [ ] Run `validate.sh`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual rule check | Directory placement + naming | Read + compare |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `overview.md` | Internal | Green | Cannot check directory purpose without it |
| `package_skill.py` | Internal | Green | Cannot check naming/file-type without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rename or structural fix breaks a script import path.
- **Procedure**: `git checkout -- <path>` restores the pre-fix state; re-verify `motion-evidence.mjs` imports.
<!-- /ANCHOR:rollback -->
