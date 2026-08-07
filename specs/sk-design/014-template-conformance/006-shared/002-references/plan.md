---
title: "Implementation Plan: sk-design shared references conformance"
description: "Audit every file under `.opencode/skills/sk-design/shared/references/` against `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md`, fix the known defects listed above, and confirm the remaining files either conform or get the same fix."
trigger_phrases:
  - "sk-design shared references conformance"
  - "plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/006-shared/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 plan for template-conformance leaf"
    next_safe_action: "Execute Phase 1 audit tasks in tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: sk-design shared references conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill docs), plus non-authored files audited by directory-rule only |
| **Framework** | system-spec-kit template manifest + create-skill asset templates |
| **Storage** | None |
| **Testing** | `validate.sh --recursive --strict` |

### Overview
Audit every file under `.opencode/skills/sk-design/shared/references/` against `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md`, fix the known defects listed above, and confirm the remaining files either conform or get the same fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Governing template identified: `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md`
- [ ] Full file list for `.opencode/skills/sk-design/shared/references/` enumerated
- [ ] Known defects (if any) transcribed from the program brief

### Definition of Done
- [ ] Every file in scope audited against the governing template
- [ ] Confirmed defects fixed to match the template shape
- [ ] `validate.sh` passes for this leaf
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-and-conform: read each file, diff its shape against the governing template, apply the minimal edit that closes the gap.

### Key Components
- **File audit**: Read every file under .opencode/skills/sk-design/shared/references/ and diff against .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md
- **Fix pass**: Apply the minimal structural edit per confirmed gap

### Data Flow
Read file → compare H1/H2 numbering, `---` separators, OVERVIEW intro, and section order against the template → apply fix or record "conformant, no changes."
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate all files under .opencode/skills/sk-design/shared/references/
- [ ] Read .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md in full

### Phase 2: Core Implementation
- [ ] Fix: smart-routing.md: has `## 1. OVERVIEW` but NO intro sentence and NO `---` rule between the H1 (line 14) and §1 (line 16) — template requires H1 -> 1-2 short sentences with no headers -> `---` -> `## 1. OVERVIEW`
- [ ] Fix: structural-fingerprint-cards/card-*.md (all 7 files: card-reciprocal-frame, card-deliberate-seams, card-image-counterweight, card-action-punctuation, card-heading-rail, card-layered-body, card-staged-reveal): numbered but sentence-case H2s, §1 named topically (e.g. 'Regions and composition') rather than 'OVERVIEW', no `---` separators — this is ONE consistent edit repeated seven times, not seven separate judgments, and each file is ~51 lines (under the template's 200-line reference bar)
- [ ] Audit remaining unlisted files under .opencode/skills/sk-design/shared/references/ for the same class of defect

### Phase 3: Verification
- [ ] Re-read all touched files end-to-end
- [ ] Run validate.sh --strict for this leaf
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Header numbering, `---` separators, OVERVIEW presence | Manual diff against template |
| Validation | Spec-folder integrity | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Governing template | Internal | Green | Path: .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix changes meaning, not just structure
- **Procedure**: git checkout -- the affected file and redo the diff more conservatively
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10-15 min |
| Core Implementation | Medium | 1-2 hours |
| Verification | Low | 15 min |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migrations involved (documentation-only leaf)
- [ ] Frozen/historical records (if any in scope) identified and excluded from edits

### Rollback Procedure
1. `git diff` the touched files
2. `git checkout -- <file>` to revert any single file
3. Re-run `validate.sh` to confirm the prior state still validates

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
