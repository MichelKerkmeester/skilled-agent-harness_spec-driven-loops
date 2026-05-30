---
title: "Feature Specification: Phase 16: script-subfolder-readmes"
description: "Source script subfolders under deep-agent-improvement/scripts lack code-folder READMEs, so a developer cannot orient inside a lane before editing. Only scripts/, lib/, and tests/ have READMEs and they predate the sk-doc code-folder template."
trigger_phrases:
  - "script subfolder readmes"
  - "code folder readme deep-agent-improvement"
  - "scripts lane readme"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/016-script-subfolder-readmes"
    last_updated_at: "2026-05-29T13:30:00Z"
    last_updated_by: "setup-agent"
    recent_action: "Authored Level 2 spec/plan/tasks/checklist for subfolder READMEs"
    next_safe_action: "Build: write 7 new READMEs and audit 3 existing"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/agent-improvement/"
      - ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/"
      - ".opencode/skills/deep-agent-improvement/scripts/shared/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "setup-121-016"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: script-subfolder-readmes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `121-deep-agent-improvement-benchmark-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 19 |
| **Predecessor** | 015-fix-deep-review-findings-for-two-lane-code |
| **Successor** | 017-two-lane-opus-deep-review |
| **Handoff Criteria** | Every source script subfolder holds a sk-doc-aligned code-folder README and all 3 existing READMEs pass the same audit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the two-lane deep-agent-improvement program. The two-lane reorg (phases 008-015) moved scripts into `agent-improvement/`, `model-benchmark/`, and `shared/` lane subtrees, plus a nested `model-benchmark/scorer/` tree. The on-disk lane layout is now stable, but most lane folders have no local README.

**Scope Boundary**: Code-folder READMEs only, under `.opencode/skills/deep-agent-improvement/scripts/`. No script behavior changes. No SKILL.md, references, or assets edits.

**Dependencies**:
- 015-fix-deep-review-findings-for-two-lane-code closed the deep-review findings, so the lane layout is final.
- sk-doc code-folder template at `.opencode/skills/sk-doc/assets/readme/readme_code_template.md`.

**Deliverables**:
- 7 new code-folder READMEs (one per source script subfolder that lacks one).
- 3 existing READMEs audited against the code-folder template and aligned.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The source script tree under `.opencode/skills/deep-agent-improvement/scripts/` is split into two lanes plus shared and a nested scorer subtree, but only `scripts/`, `scripts/lib/`, and `scripts/tests/` carry a README. A developer opening `agent-improvement/`, `model-benchmark/`, `model-benchmark/scorer/`, or `shared/` gets no local orientation and must read every `.cjs` file to learn the folder boundary. The 3 existing READMEs predate the sk-doc code-folder template, so the tree is also inconsistent.

### Purpose
Give every source script subfolder a scannable, sk-doc-aligned code-folder README that states what the folder owns, its key files, and its lane boundary, and bring the 3 existing READMEs into the same shape.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create code-folder READMEs for the 7 source script subfolders that lack one.
- Audit the 3 existing READMEs (`scripts/`, `lib/`, `tests/`) against the code-folder template and align frontmatter and sections.
- Use the sk-doc code-folder template: frontmatter (title, description, trigger_phrases) plus only the sections that apply.

### Out of Scope
- Script behavior changes - this phase is documentation only.
- READMEs for non-source dirs (`node_modules/`, `.vite/`, `model-benchmark/scorer/cache/`) - runtime or vendor artifacts, not source.
- `model-benchmark/scorer/grader/prompts/` - grader prompt markdown, not a code folder.
- `tests/fixtures/low-sample-benchmark/` - test fixture data, already has a fixture README.
- SKILL.md, references/, assets/ edits - other lane surfaces, out of this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/agent-improvement/README.md | Create | Lane A code-folder README (8 agent-improvement scripts) |
| scripts/model-benchmark/README.md | Create | Lane B code-folder README (dispatch-model, run-benchmark, scorer subtree) |
| scripts/model-benchmark/scorer/README.md | Create | 5-dim scorer entrypoint + deterministic/grader/lib subtrees |
| scripts/model-benchmark/scorer/deterministic/README.md | Create | 4 deterministic check scripts |
| scripts/model-benchmark/scorer/grader/README.md | Create | Grader harness + dispute scripts |
| scripts/model-benchmark/scorer/lib/README.md | Create | Grader cache helper (cache.cjs) |
| scripts/shared/README.md | Create | Shared lane: loop-host router + journal/coverage/promotion/reduce helpers |
| scripts/README.md | Modify | Audit + align to code-folder template |
| scripts/lib/README.md | Modify | Audit + align to code-folder template |
| scripts/tests/README.md | Modify | Audit + align to code-folder template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every source script subfolder has a code-folder README | Each of the 7 target subfolders contains README.md with frontmatter title + description + trigger_phrases |
| REQ-002 | READMEs document current behavior with exact names | Each README cites the actual `.cjs` file names and their responsibilities, verified against the folder contents |
| REQ-003 | HVR compliance | No README contains em-dashes or semicolon characters in prose, no banned/setup phrases, no spec packet numbers or phase IDs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Existing 3 READMEs audited and aligned | `scripts/`, `lib/`, `tests/` READMEs match the code-folder template shape (frontmatter + applicable sections) |
| REQ-005 | Lane boundary stated where layers exist | Lane folders (`agent-improvement/`, `model-benchmark/`, `shared/`) state allowed dependency direction or lane boundary |
| REQ-006 | Small folders stay compact | Single-or-double-file folders (`scorer/lib/`) carry only OVERVIEW + KEY FILES (+ BOUNDARIES if needed) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 7 new READMEs created and 3 existing READMEs aligned, all matching the sk-doc code-folder template.
- **SC-002**: Every README is accurate to the current folder contents and scannable before opening source files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | README drifts from script behavior | Med | Read each `.cjs` header before writing its README |
| Risk | Over-long READMEs in small folders | Low | Keep small folders to OVERVIEW + KEY FILES per template guidance |
| Dependency | sk-doc code-folder template | If template changes, sections shift | Pin to the template read at build time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Readability
- **NFR-R01**: Each README is scannable before opening source files (under one screen for small folders).
- **NFR-R02**: Frontmatter carries title, description, and trigger_phrases on every README.

### Consistency
- **NFR-C01**: All READMEs follow the same sk-doc code-folder section order.
- **NFR-C02**: File names and exports match the folder contents exactly.

### Hygiene
- **NFR-H01**: No em-dashes or semicolon characters in prose.
- **NFR-H02**: No spec packet numbers, phase IDs, or migration notes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Folder Boundaries
- Vendor or runtime dirs (`node_modules/`, `.vite/`, `scorer/cache/`): no README, excluded as non-source.
- Prompt markdown (`scorer/grader/prompts/`): no README, not a code folder.
- Fixture data (`tests/fixtures/low-sample-benchmark/`): keeps its existing fixture README.

### Folder Size
- Single-file folder (`scorer/lib/`): OVERVIEW + KEY FILES only, no diagram.
- Multi-file lane folder: include ARCHITECTURE or BOUNDARIES when it speeds orientation.

### Existing READMEs
- Audit may find a section that no longer matches the folder: align it to current contents.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 7 new + 3 audited READMEs, docs only |
| Risk | 4/25 | No behavior change, revertible per file |
| Research | 6/20 | Must read each folder's scripts for accuracy |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- None open. Scope and target subfolders are fixed by the current on-disk tree.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
