---
title: "Plan: design-motion feature-catalog/ conformance"
description: "Plan to audit design-motion's feature-catalog/ root + 3 subdirectories against feature-catalog-template.md."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/006-feature-catalog"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author feature-catalog audit plan"
    next_safe_action: "Read all feature-catalog/ files against feature-catalog-template.md"
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
# Plan: design-motion feature-catalog/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | 1 root + 4 nested markdown feature-catalog docs |
| **Governing template** | `.opencode/skills/sk-doc/create-feature-catalog/assets/feature-catalog-template.md` |
| **Verification** | Section-by-section diff + `validate.sh` |

### Overview
First-pass audit of an unsampled folder with nested subdirectories; enumerate all 5 files before diffing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `feature-catalog-template.md` read in full
- [ ] All 5 files located (root + 3 subdirectories)

### Definition of Done
- [ ] All 5 files diffed against the template
- [ ] Confirmed gaps fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-diff audit across a root file plus nested subdirectories.

### Key Components
- **Target:** `feature-catalog.md`, `build-cards/motion-fill-in-cards.md`, `procedure-cards/motion-procedure-card-inventory.md`, `restraint-gate-and-choreography/{choreography-and-reduced-motion,motion-restraint-gate}.md`.
- **Reference:** `feature-catalog-template.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `feature-catalog-template.md`
- [ ] Enumerate and read all 5 target files

### Phase 2: Core Implementation
- [ ] Diff each file against the template; fix confirmed gaps

### Phase 3: Verification
- [ ] Re-diff fixed files
- [ ] Run `validate.sh`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual diff | Structure parity vs template | Read + compare |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `feature-catalog-template.md` | Internal | Green | Cannot diff without reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix alters content beyond the structural gap.
- **Procedure**: `git checkout -- <file>` restores the pre-fix version.
<!-- /ANCHOR:rollback -->
