---
title: "Implementation Plan: design-mcp-open-design tests conformance"
description: "Run the exhaustive audit of every file under `.opencode/skills/sk-design/design-mcp-open-design/tests/` against `.opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored tests/ template)`. \"Conformant, no changes\" is a legitimate outcome of this leaf."
trigger_phrases:
  - "design-mcp-open-design tests conformance"
  - "plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/005-design-mcp-open-design/005-tests"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 plan for template-conformance leaf"
    next_safe_action: "Execute Phase 1 audit tasks in tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/tests/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: design-mcp-open-design tests conformance

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
Run the exhaustive audit of every file under `.opencode/skills/sk-design/design-mcp-open-design/tests/` against `.opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored tests/ template)`. "Conformant, no changes" is a legitimate outcome of this leaf.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Governing template identified: `.opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored tests/ template)`
- [ ] Full file list for `.opencode/skills/sk-design/design-mcp-open-design/tests/` enumerated
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
- **File audit**: Read every file under .opencode/skills/sk-design/design-mcp-open-design/tests/ and diff against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored tests/ template)
- **Fix pass**: Apply the minimal structural edit per confirmed gap

### Data Flow
Read file → compare H1/H2 numbering, `---` separators, OVERVIEW intro, and section order against the template → apply fix or record "conformant, no changes."
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate all files under .opencode/skills/sk-design/design-mcp-open-design/tests/
- [ ] Read .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored tests/ template) in full

### Phase 2: Core Implementation
- [ ] Diff each file under .opencode/skills/sk-design/design-mcp-open-design/tests/ against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored tests/ template)
- [ ] Fix any confirmed gap; record 'conformant, no changes' where none found

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
| Governing template | Internal | Green | Path: .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored tests/ template) |
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
| Core Implementation | Low | 30-45 min |
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
