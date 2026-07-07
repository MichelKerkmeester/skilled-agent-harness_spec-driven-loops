---
title: "Feature Specification: Phase 4: remediation"
description: "Fix 1 P1 + 2 P2 doc-accuracy findings from 7-iteration deep-review of sk-doc reorg. Single small commit on main."
trigger_phrases:
  - "068/004"
  - "remediation"
  - "deep-review-fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "068-sk-doc-organization/004-remediation"
    last_updated_at: "2026-05-05T11:50:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored 004 spec.md after deep-review converged with 1 P1 + 2 P2 actionable findings"
    next_safe_action: "Apply 3 fixes, validate, commit"
    blockers: []
    key_files:
      - .opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md
      - .opencode/skills/sk-doc/references/global/quick_reference.md
      - .opencode/skills/sk-doc/assets/skill/skill_md_template.md
      - .opencode/skills/sk-doc/references/specific/skill_creation.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase4-authoring"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-verify-and-ship |
| **Successor** | None (terminal phase) |
| **Handoff Criteria** | All 3 fixes applied; validate.sh --strict on parent 068 still exits 0; 1 commit on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** (terminal phase) of the sk-doc reorg packet — added after the 7-iteration deep-review (review-report.md) surfaced 1 P1 + 2 P2 doc-accuracy findings that escaped Phase 2's 4-pattern fixed-string substring sweep.

**Scope Boundary**: 3 small targeted doc edits. NO new substring substitutions across active scope. NO mirror replication. NO impact on .claude/.codex/.gemini.

**Dependencies**:
- 7-iteration deep-review converged with CONDITIONAL verdict
- review-report.md authored at `068-sk-doc-organization/review/review-report.md`
- Phases 001-003 shipped on main (commits ccd73ef55, c59679ea7, 851336518, 98cc6b59c)

**Deliverables**:
- P1 fix: `frontmatter_templates.md:770` link `../agents/command_template.md` → `../command_template.md`
- P2 fix: `quick_reference.md:174-189` project-structure tree rewritten to reflect new flat layout
- P2 fix: `skill_md_template.md:593` and `skill_creation.md:56` illustrative-example lists no longer reference deprecated `assets/agents/`
- One commit on main: `feat(sk-doc): remediate review findings (068/004)`

**Changelog**:
- This is the terminal phase. After this commit ships, packet 068 is final.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 2's substring sweep used 4 fixed-string patterns prefixed with `assets/`. Three classes of references escaped: (a) relative-path links inside `assets/documentation/` files using `../agents/...` instead of `assets/agents/...`, (b) ASCII tree diagrams that depict folder structure as visual layout (not amenable to substring substitution), (c) generic illustrative examples listing common subfolder names including the now-deprecated `assets/agents/`.

### Purpose
Close the residual doc-accuracy gap with surgical edits.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix 1 broken cross-link (P1)
- Rewrite 1 ASCII tree diagram (P2)
- Update 2 illustrative-example lines to remove `assets/agents/` reference (P2)
- Validate parent 068
- One commit on main

### Out of Scope
- Phase 1 / Phase 2 / Phase 3 work
- New asset moves or substring substitutions
- `barter/coder/`, `z_archive/`, `.opencode/specs/**` historical records
- `observability/*.jsonl` stale paths (P2-006-A — explicitly OOS per strategy)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md` | Modify (1 line) | L770 link `../agents/command_template.md` → `../command_template.md` |
| `.opencode/skills/sk-doc/references/global/quick_reference.md` | Modify (~16 lines) | L174-189 ASCII tree rewritten to reflect new flat layout |
| `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | Modify (1 line) | L593 illustrative example list no longer mentions `assets/agents/` |
| `.opencode/skills/sk-doc/references/specific/skill_creation.md` | Modify (1 line) | L56 illustrative example list no longer mentions `assets/agents/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | P1-003-A fixed: frontmatter_templates.md:770 link target exists | `test -f .opencode/skills/sk-doc/assets/command_template.md && grep -c "(../command_template.md)" .opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md` returns >=1 |
| REQ-002 | iter4-F1 P2 fixed: quick_reference.md tree shows new flat layout | `rg -c "assets/agents/" .opencode/skills/sk-doc/references/global/quick_reference.md` returns 0 |
| REQ-003 | P2-003-A fixed: skill_md_template.md and skill_creation.md illustrative lists no longer mention `assets/agents/` | `rg -c "assets/agents/" .opencode/skills/sk-doc/assets/skill/skill_md_template.md` returns 0; same for `.../references/specific/skill_creation.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | validate.sh --strict on parent 068 still exits 0 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/054-sk-doc-organization --strict` exits 0 |
| REQ-005 | One commit on main; no surviving feature branch | `git branch --show-current = main`; `git log -1 --format=%s` matches `feat(sk-doc): remediate review findings (068/004)` |
| REQ-006 | Active-scope residual rg still returns 0 | Same residual sweep from Phase 2 D.2 returns 0 hits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 P0 + 3 P1 REQs verified with evidence
- **SC-002**: Packet 068 final — no further remediation needed; review-report.md verdict transitions from CONDITIONAL → SHIPPED

### Given/When/Then Verification Scenarios

**Given** P1-003-A in `frontmatter_templates.md:770`, **When** the link is rewritten to `../command_template.md`, **Then** following the link resolves to `.opencode/skills/sk-doc/assets/command_template.md` (file exists).

**Given** iter4-F1 P2 in `quick_reference.md:174-189`, **When** the tree is rewritten with `agent_template.md`, `command_template.md`, `feature_catalog/`, `testing_playbook/` at assets/ root and no `assets/agents/` line, **Then** `rg -c "assets/agents/" quick_reference.md` returns 0.

**Given** P2-003-A in `skill_md_template.md:593` and `skill_creation.md:56`, **When** illustrative example lists are updated to remove `assets/agents/`, **Then** the remaining examples (`assets/skill/`, `assets/documentation/`, `assets/flowcharts/`) still illustrate the "subfolders are allowed" principle.

**Given** all 3 fixes applied, **When** running `validate.sh --strict` on parent 068, **Then** exit code is 0 with zero errors and zero warnings.

**Given** the commit, **When** running `git log -1 --format='%s' HEAD`, **Then** message matches `feat(sk-doc): remediate review findings (068/004)`.

**Given** the residual sweep from Phase 2's D.2 acceptance check, **When** rerun post-Phase-4, **Then** rg returns 0 hits in active scope.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | review-report.md from 7-iter deep-review | High — Phase 4 scope derives from these findings | Already authored at `review/review-report.md` |
| Risk | Tree-rewrite introduces syntax errors | Low — pre-formatted ASCII | Manual review of rendered tree |
| Risk | P2 fixes change semantics of "subfolders allowed" guidance | Low — illustrative example shorter but same principle | Keep `assets/skill/`, `assets/documentation/`, `assets/flowcharts/` as remaining examples |
| Risk | Adding wrong link target in fix 1 | Low — file existence check at REQ-001 | Manual `test -f` post-edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — all 3 fixes are surgical and well-scoped per review-report.md.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
