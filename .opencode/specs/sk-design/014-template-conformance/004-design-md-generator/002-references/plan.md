---
title: "Plan: design-md-generator references/ conformance"
description: "Plan to fix the importance_tier and H2-casing defects, decide the vendor exemplar placement, and audit the remaining references files."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author references audit plan"
    next_safe_action: "Read all 10 root references files and the 4-vendor examples/ tree"
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
# Plan: design-md-generator references/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | 10 flat reference docs + 4-vendor `examples/` tree (12 files) |
| **Governing template** | `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md` |
| **Verification** | Section-by-section diff + frontmatter enum check + `validate.sh` |

### Overview
Two mechanical fixes (enum value, heading case), one first-pass audit of 6 unsampled files, and one genuine placement decision for the vendor exemplar tree that a template diff alone cannot resolve.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `skill-reference-template.md` read in full, including its frontmatter enum rules
- [ ] All 10 root files + 8 `examples/` files located

### Definition of Done
- [ ] `extraction-workflow.md`'s `importance_tier` is a valid enum value
- [ ] `quality-checklist.md`, `writing-style-guide.md`, `design-md-format.md` have ALL-CAPS numbered H2s
- [ ] Remaining 6 files diffed and any confirmed gap fixed
- [ ] Exemplar decision recorded in `decision-record.md` and executed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-diff audit + two mechanical defect-class fixes + one recorded architectural decision.

### Key Components
- **Enum fix:** `extraction-workflow.md` frontmatter `importance_tier` → `normal` or `important`.
- **Casing fix:** rewrite numbered H2 text to ALL-CAPS in the 3 known files, preserving numbering and anchors.
- **Placement decision:** `decision-record.md` weighs relocate-out-of-`references/` vs. document-an-exemption for the 8 `examples/` files, using `overview.md` + `package_skill.py` as the authority for what a sanctioned exemption requires.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `skill-reference-template.md` (including frontmatter enum rules)
- [ ] Read all 10 root files and the 8 `examples/` files

### Phase 2: Core Implementation
- [ ] Fix `extraction-workflow.md`'s `importance_tier` value
- [ ] Fix H2 casing in `quality-checklist.md`, `writing-style-guide.md`, `design-md-format.md`
- [ ] Diff the remaining 6 root files; fix any confirmed gap
- [ ] Draft and decide the exemplar placement in `decision-record.md`
- [ ] Execute the decision (relocate files, or add the exemption note)

### Phase 3: Verification
- [ ] Re-read all fixed root files
- [ ] Confirm no broken cross-reference to `examples/` after the placement decision executes
- [ ] Run `validate.sh` for this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual diff | Structure + frontmatter enum parity vs template | Read + compare |
| Grep sweep | Cross-references to `references/examples/` before/after relocation | `rg -n "references/examples"` |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill-reference-template.md` | Internal | Green | Cannot diff without reference |
| `overview.md` + `package_skill.py` | Internal | Green | Needed to define what a sanctioned exemption requires |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A relocation breaks a cross-reference, or the enum/casing fix collides with an existing anchor.
- **Procedure**: `git checkout -- <path>` restores the pre-fix state; re-grep for cross-references before retrying a relocation.
<!-- /ANCHOR:rollback -->
