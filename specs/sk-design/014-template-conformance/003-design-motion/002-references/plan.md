---
title: "Plan: design-motion references/ conformance"
description: "Plan to fix the two confirmed separator-discipline defects, the H2-casing defect, and audit the remaining 4 references files."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author references audit plan"
    next_safe_action: "Read all 7 references files against skill-reference-template.md"
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
# Plan: design-motion references/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | 7 flat markdown reference docs |
| **Governing template** | `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md` |
| **Verification** | Section-by-section diff + `validate.sh` |

### Overview
Two files need a mechanical separator-insertion fix, one needs a heading-case fix, and four need a first-pass full read. All four fix targets are known; the audit targets are not.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `skill-reference-template.md` read in full
- [ ] All 7 `references/*.md` files located

### Definition of Done
- [ ] `motion-strategy.md` and `micro-interactions.md` have `---` before every numbered H2
- [ ] `advanced-craft.md` numbered H2s are ALL-CAPS
- [ ] Remaining 4 files diffed and any confirmed gap fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-diff audit + targeted mechanical fix for the two known formatting defect classes.

### Key Components
- **Separator fix:** insert `---` immediately before each numbered `## N. TITLE` H2 from §3 onward, matching the pattern already used before §1/§2.
- **Casing fix:** rewrite `advanced-craft.md`'s numbered H2 text to ALL-CAPS, preserving numbering and anchors.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `skill-reference-template.md`
- [ ] Read all 7 `references/*.md` files in full

### Phase 2: Core Implementation
- [ ] Fix `motion-strategy.md` separators
- [ ] Fix `micro-interactions.md` separators
- [ ] Fix `advanced-craft.md` H2 casing
- [ ] Diff the remaining 4 files; fix any confirmed gap

### Phase 3: Verification
- [ ] Re-read all 7 files to confirm consistent separator discipline and ALL-CAPS H2s
- [ ] Run `validate.sh` for this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual diff | Separator + heading-case parity vs template | Read + compare |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill-reference-template.md` | Internal | Green | Cannot diff without reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A separator or casing fix collides with existing anchors or breaks a cross-reference.
- **Procedure**: `git checkout -- <file>` restores the pre-fix version.
<!-- /ANCHOR:rollback -->
