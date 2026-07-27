---
title: "Plan: design-md-generator assets/ conformance"
description: "Plan to audit design-md-generator's 3 assets/ files against skill-asset-template.md."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/003-assets"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author assets audit plan"
    next_safe_action: "Read all 3 assets files against skill-asset-template.md"
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
# Plan: design-md-generator assets/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | 3 flat markdown asset docs |
| **Governing template** | `.opencode/skills/sk-doc/create-skill/assets/skill/skill-asset-template.md` |
| **Verification** | Section-by-section diff + `validate.sh` |

### Overview
First-pass audit of an unsampled folder; one file (`design-md-prompt-template.md`) needs a consumption-path check before editing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `skill-asset-template.md` read in full
- [ ] All 3 `assets/*.md` files located
- [ ] `design-md-prompt-template.md`'s consumption path confirmed (docs-only vs. runtime-read)

### Definition of Done
- [ ] All 3 files diffed against the template
- [ ] Confirmed gaps fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-diff audit, with a runtime-consumption check gating one file.

### Key Components
- **Target:** `design-md-generator/assets/*.md` (3 files).
- **Reference:** `skill-asset-template.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `skill-asset-template.md`
- [ ] Read all 3 asset files
- [ ] Grep `backend/` for a reference to `design-md-prompt-template.md`

### Phase 2: Core Implementation
- [ ] Diff each file against the template; fix confirmed gaps (runtime-affecting edit only if T-check confirms docs-only)

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
| Grep sweep | Runtime consumption of `design-md-prompt-template.md` | `rg -n "design-md-prompt-template"` |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill-asset-template.md` | Internal | Green | Cannot diff without reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix to `design-md-prompt-template.md` turns out to be runtime-affecting and changes generator behavior.
- **Procedure**: `git checkout -- <file>` restores the pre-fix version.
<!-- /ANCHOR:rollback -->
