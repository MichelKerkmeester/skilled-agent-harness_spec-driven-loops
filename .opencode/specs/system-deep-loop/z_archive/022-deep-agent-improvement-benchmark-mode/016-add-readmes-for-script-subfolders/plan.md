---
title: "Implementation Plan: Phase 16: script-subfolder-readmes"
description: "Author one sk-doc-aligned code-folder README per source script subfolder under deep-agent-improvement/scripts and align the 3 existing READMEs, reading each folder's scripts first so responsibilities are accurate."
trigger_phrases:
  - "script subfolder readmes plan"
  - "code folder readme plan"
  - "scripts lane readme plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/016-add-readmes-for-script-subfolders"
    last_updated_at: "2026-05-29T13:30:00Z"
    last_updated_by: "setup-agent"
    recent_action: "Authored Level 2 plan for subfolder READMEs"
    next_safe_action: "Build: write 7 new READMEs and audit 3 existing"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/readme/readme_code_template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "setup-121-016"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: script-subfolder-readmes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs over Node.js CJS scripts |
| **Framework** | sk-doc code-folder README template |
| **Storage** | README.md files in source script subfolders |
| **Testing** | validate.sh --strict + manual accuracy review against each folder |

### Overview
Read the scripts inside each source subfolder, then author one code-folder README per subfolder using the sk-doc template. Include only the sections that apply to the folder size and structure. Audit the 3 pre-existing READMEs against the same template and align them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (sk-doc template, final lane layout)

### Definition of Done
- [ ] All 7 new READMEs created
- [ ] All 3 existing READMEs audited and aligned
- [ ] checklist.md items marked with evidence
- [ ] validate.sh --strict PASSED
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation per source folder. Each README maps to exactly one subfolder boundary.

### Key Components
- **Lane A READMEs**: `agent-improvement/` (8 scripts).
- **Lane B READMEs**: `model-benchmark/` and its nested `scorer/`, `scorer/deterministic/`, `scorer/grader/`, `scorer/lib/`.
- **Shared README**: `shared/` (loop-host router + journal/coverage/promotion/reduce/materialize helpers).
- **Audit targets**: existing `scripts/`, `lib/`, `tests/` READMEs.

### Data Flow
For each folder: read the script headers, map files to responsibilities, select template sections, write README, then validate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase adds documentation only and touches no producer, consumer, policy, schema, or security surface. No script logic changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm target subfolders from the on-disk tree
- [x] Read the sk-doc code-folder template
- [x] Read script headers in each target folder

### Phase 2: Core Implementation
- [ ] Write `shared/README.md` (router lane)
- [ ] Write `agent-improvement/README.md` (Lane A)
- [ ] Write `model-benchmark/README.md` and the 4 scorer-subtree READMEs (Lane B)
- [ ] Audit + align `scripts/`, `lib/`, `tests/` READMEs

### Phase 3: Verification
- [ ] Accuracy review each README against its folder
- [ ] HVR sweep (no em-dashes, no semicolons in prose, no banned phrases, no phase IDs)
- [ ] validate.sh --strict PASSED
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict validate | Spec folder docs | validate.sh --strict |
| Accuracy review | README vs folder contents | Read + manual diff |
| HVR sweep | Prose hygiene | rg for em-dash and semicolon characters |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc code-folder template | Internal | Green | Cannot align section shape |
| Final lane layout (015 done) | Internal | Green | Folder targets could shift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A README is inaccurate or breaks validate.
- **Procedure**: Revert the offending README file. No script or behavior rollback is involved since this phase is docs only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Write READMEs) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Write READMEs |
| Write READMEs | Setup | Verify |
| Verify | Write READMEs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done at setup |
| Write READMEs | Med | 7 new + 3 audited |
| Verification | Low | Strict validate + accuracy review |
| **Total** | | **One build pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each README read back against its folder before commit
- [ ] HVR sweep clean
- [ ] validate.sh --strict PASSED

### Rollback Procedure
1. Identify the inaccurate or failing README.
2. Revert that single README file.
3. Re-run validate.sh --strict to confirm the rest still pass.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, documentation only
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
