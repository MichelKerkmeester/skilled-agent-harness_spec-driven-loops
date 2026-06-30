---
title: "Implementation Plan: sk-code Manual Testing Playbook Motion.dev Refinement"
description: "Plan for extending the existing sk-code manual testing playbook with motion.dev, animation regression, cross-browser, and performance-gate scenarios while preserving sk-doc package structure."
trigger_phrases:
  - "sk-code playbook plan"
  - "motion.dev playbook plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/001-playbook"
    last_updated_at: "2026-05-05T07:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Defined Packet 1 implementation sequence"
    next_safe_action: "Create playbook scenarios and run strict validation"
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-code Manual Testing Playbook Motion.dev Refinement

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc manual testing playbook package contract |
| **Storage** | Repository files only |
| **Testing** | Spec-kit strict validation and structural file review |

### Overview
Extend the current sk-code manual testing playbook without changing its architecture. The implementation adds two category folders, writes seven per-feature scenario files, updates the root directory page, and verifies the packet spec folder with strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing root playbook read and confirmed aligned with sk-doc structure.
- [x] sk-doc playbook creation reference and templates read.
- [x] Parent spec and in-repo motion.dev anchors read.
- [x] Packet boundaries confirmed: no references/motion_dev population and no sk-code metadata edits.

### Definition of Done
- [x] New scenario files have frontmatter and five required sections. Evidence: section-count check returned 5 required sections for each new scenario file.
- [x] Root playbook counts, TOC, category summaries, and cross-reference sections are synchronized. Evidence: root playbook now reports 17 deterministic scenarios across 6 categories and indexes MR/CB scenarios.
- [x] Strict spec validation exits 0. Evidence: `validate.sh 001-playbook --strict --verbose` returned exit 0.
- [x] Changed files remain inside approved scope. Evidence: Packet 1 edits are limited to `001-playbook/` and `.opencode/skills/sk-code/manual_testing_playbook/`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Split manual testing playbook package:
- root `manual_testing_playbook.md` acts as directory, review surface, and summary index.
- numbered category folders group scenario files.
- one per-feature Markdown file owns each scenario contract.

### Key Components
- **Root playbook**: global protocol, category summaries, automated-test cross-reference, and feature index.
- **MR category**: motion.dev API smoke, CDN version pinning, reduced-motion, and regression-baseline scenarios.
- **CB category**: browser compatibility, Core Web Vitals, and GPU/compositing scenarios.
- **Packet docs**: Level 2 spec, plan, tasks, and checklist for execution traceability.

### Data Flow
Operators start at the root playbook, choose a scenario from the category summary or cross-reference index, then execute the exact per-feature prompt and command sequence. Evidence is captured under `/tmp/` paths named by scenario ID.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read sk-doc playbook guidance and templates.
- [x] Read existing sk-code playbook root and representative scenario files.
- [x] Read parent spec and motion.dev usage anchors.

### Phase 2: Core Implementation
- [x] Create Level 2 planning docs in the approved child spec folder. Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and validator-required `implementation-summary.md` exist.
- [x] Add `05--motion-dev-and-animation-regression/` with MR-001 through MR-004. Evidence: four MR files exist under the new category folder.
- [x] Add `06--cross-browser-and-performance-gates/` with CB-001 through CB-003. Evidence: three CB files exist under the new category folder.
- [x] Patch the root playbook overview, TOC, new summaries, and indexes. Evidence: root playbook sections 11, 12, 13, and 14 are present.

### Phase 3: Verification
- [x] Review file paths against allowed scope. Evidence: new files are under `001-playbook/`, `05--motion-dev-and-animation-regression/`, and `06--cross-browser-and-performance-gates/`.
- [x] Run strict spec validation. Evidence: strict validator returned exit 0.
- [x] Record final validation result and scenario inventory. Evidence: `implementation-summary.md` and final response include validation and scenario IDs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template validation | Child spec folder anchors and frontmatter | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Structural review | Playbook package shape and per-feature section order | `find`, `rg`, manual read |
| Scope review | Ensure no edits outside allowed directories | `git status --short` |
| Alignment review | sk-doc playbook contract and deterministic prompt quality | sk-doc templates and examples |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc playbook templates | Internal documentation | Green | Cannot verify scenario shape |
| Motion.dev docs URLs | External documentation | Green | Scenario citations would be weaker |
| Existing sk-code playbook | Internal documentation | Green | Root updates could drift from local style |
| Spec-kit validator | Internal script | Green | Cannot claim packet validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: strict validation cannot pass after three fix attempts, or root playbook structure conflicts with sk-doc standards.
- **Procedure**: remove the two new category folders and revert the root playbook changes from this packet only; leave unrelated dirty working-tree changes untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) -> Phase 2 (Implementation) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet 2 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30-45 minutes |
| Core Implementation | Medium | 2-3 hours |
| Verification | Medium | 30-60 minutes |
| **Total** | | **3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Changes are documentation-only.
- [x] No production runtime files are modified.
- [x] Existing playbook scenario IDs are preserved.

### Rollback Procedure
1. Remove `05--motion-dev-and-animation-regression/`.
2. Remove `06--cross-browser-and-performance-gates/`.
3. Revert only the Packet 1 edits in `manual_testing_playbook.md`.
4. Re-run strict spec validation if packet docs remain.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
