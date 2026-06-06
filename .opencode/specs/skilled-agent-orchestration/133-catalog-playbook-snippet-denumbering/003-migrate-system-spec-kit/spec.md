---
title: "Feature Specification: Migrate system-spec-kit (Wave A) [133/003-migrate-system-spec-kit/spec]"
description: "De-number all 673 per-feature snippet files in the system-spec-kit feature catalog and manual testing playbook (the largest package, ~44% of total), rewrite their references, and apply the two collision resolutions, verified per category."
trigger_phrases:
  - "migrate system-spec-kit snippets denumber"
  - "wave A system-spec-kit catalog playbook"
  - "133 phase 003"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/003-migrate-system-spec-kit"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 003 spec during 133 scaffold"
    next_safe_action: "Populate tasks/checklist on entry; run after 002 dry-run green"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Migrate system-spec-kit (Wave A)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned (tasks/checklist populated on entry) |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`system-spec-kit` is the largest catalog/playbook package: 673 numbered snippet files (308 feature_catalog + 365 manual_testing_playbook) across ~67 category folders. It is isolated in its own wave because its size dominates total risk and it holds the only 2 known slug collisions.

### Purpose
Apply the phase-002 tool to the system-spec-kit catalog and playbook trees, de-numbering all 673 files, rewriting their references, and applying the approved collision resolution — verified per category folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/system-spec-kit/feature_catalog/**` — 308 files.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/**` — 365 files.
- Both root docs' links + in-tree self/neighbor references.
- The 2 collision resolutions in `manual_testing_playbook/16--tooling-and-scripts/`.

### Out of Scope
- Other skills (waves B/C).
- system-spec-kit's own `.opencode/specs/**` historical referrers (D2).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/feature_catalog/NN--*/[0-9]*-*.md` | Rename | 308 catalog snippets de-numbered |
| `system-spec-kit/manual_testing_playbook/NN--*/[0-9]*-*.md` | Rename | 365 playbook snippets de-numbered |
| `system-spec-kit/{feature_catalog,manual_testing_playbook}/*.md` (roots) | Modify | Link rewrites |
| `.../16--tooling-and-scripts/{219,235,243,250}-*.md` | Rename/Resolve | Apply collision resolution from phase 002 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero numbered snippet files remain under system-spec-kit | `rg --files | rg 'system-spec-kit/(feature_catalog|manual_testing_playbook)/.*/[0-9]{2,3}-[a-z].*\.md$'` = 0 |
| REQ-002 | Root entry count == per-feature file count (both packages) | Count reconciliation script passes |
| REQ-003 | Collisions resolved without data loss | The 4 files' content preserved under new distinct slugs (or intentional merge) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No broken intra-package links | Link-check across both trees = 0 broken |
| REQ-005 | `validate.sh` on system-spec-kit playbook root stays green | Exit 0/1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 673 files de-numbered; category folders intact; history preserved via `git mv`.
- **SC-002**: Per-category link-check + count reconciliation pass.
- **SC-003**: Collision files preserved and addressable under new names.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Volume (673) → partial/interrupted run | Med | Per-category batches; scoped commits after each category |
| Risk | git-index race (concurrent sessions) | Med | `git commit --only -- <category paths>`; verify `git show --stat` (D3) |
| Dependency | Phase 002 tool + collision decision | Blocking | Must be green first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 673 files, 2 packages |
| Risk | 14/25 | Mechanical but high-volume; collisions |
| Research | 2/20 | Tool does the work |
| **Total** | **38/70** | **Level 2 (upper)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Populate tasks.md/checklist.md on entry (per-category task list generated from the phase-002 manifest).
<!-- /ANCHOR:questions -->
