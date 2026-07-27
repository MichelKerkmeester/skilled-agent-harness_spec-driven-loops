---
title: "Plan: design-md-generator manual-testing-playbook/ conformance"
description: "Plan to audit design-md-generator's 18-file manual-testing-playbook/ tree against manual-testing-playbook-template.md."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/007-manual-testing-playbook"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author manual-testing-playbook audit plan"
    next_safe_action: "Enumerate and read all 18 playbook files against the template"
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
# Plan: design-md-generator manual-testing-playbook/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | 1 root + 17 nested markdown playbook docs across 12 subdirectories |
| **Governing template** | `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md` |
| **Verification** | Section-by-section diff + `validate.sh` |

### Overview
The largest first-pass audit in this theme. Enumerate all 18 files across 12 subdirectories before diffing, with `procedure-card-contract/`'s 3 files called out explicitly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `manual-testing-playbook-template.md` read in full
- [ ] All 18 files enumerated across the root + 12 subdirectories

### Definition of Done
- [ ] All 18 files diffed against the template
- [ ] Confirmed gaps fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-diff audit across a wide, shallow subdirectory tree with one 3-file exception.

### Key Components
- **Target:** `manual-testing-playbook.md` + 11 single-file subdirectories + `procedure-card-contract/` (3 files).
- **Reference:** `manual-testing-playbook-template.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `manual-testing-playbook-template.md`
- [ ] Enumerate all 18 target files by full path

### Phase 2: Core Implementation
- [ ] Diff root `manual-testing-playbook.md` against the template
- [ ] Diff each of the 11 single-file subdirectories
- [ ] Diff all 3 files in `procedure-card-contract/`
- [ ] Fix confirmed gaps

### Phase 3: Verification
- [ ] Re-diff fixed files
- [ ] Run `validate.sh`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual diff | Structure parity vs template, 18 files | Read + compare |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `manual-testing-playbook-template.md` | Internal | Green | Cannot diff without reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix alters content beyond the structural gap, or a file in `procedure-card-contract/` is skipped.
- **Procedure**: `git checkout -- <file>` restores the pre-fix version; re-enumerate the 3-file subdirectory before retrying.
<!-- /ANCHOR:rollback -->
