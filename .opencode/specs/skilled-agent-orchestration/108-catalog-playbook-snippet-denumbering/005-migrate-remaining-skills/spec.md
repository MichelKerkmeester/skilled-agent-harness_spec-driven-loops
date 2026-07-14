---
title: "Feature Specification: Migrate Remaining Skills (Wave C) [133/005-migrate-remaining-skills/spec]"
description: "De-number the remaining ~310 per-feature snippet files across system-code-graph and all cli-*, sk-*, and mcp-* skills, running parallel MiMo agents per skill with scoped per-skill commits."
trigger_phrases:
  - "migrate remaining skills denumber"
  - "wave C cli sk mcp skills"
  - "133 phase 005"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering/005-migrate-remaining-skills"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 005 spec during 133 scaffold"
    next_safe_action: "Populate per-skill tasks on entry; run after 002 green"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Migrate Remaining Skills (Wave C)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The remaining ~310 numbered snippet files live in twelve smaller skills (system-code-graph + 4 cli-* + 5 sk-* + 3 mcp-*), most of which are playbook-only. They are low-risk independent units that complete the migration surface.

### Purpose
Finish the snippet migration by de-numbering the remaining skills in parallel, the same per-skill pattern as wave B, leaving only the cross-cutting reference sweep for phase 006.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (skill | total numbered snippets)
- `system-code-graph` — 36 (14 catalog + 22 playbook)
- `cli-opencode` — 33 · `cli-devin` — 28 · `cli-codex` — 27 · `cli-claude-code` — 26
- `sk-prompt` — 28 · `sk-code` — 24 · `sk-doc` — 20 · `sk-git` — 22 · `sk-code-review` — 18
- `mcp-code-mode` — 26 · `mcp-chrome-devtools` — 22

### Out of Scope
- Waves A/B skills.
- `z_future/backup` catalogs/playbooks (frozen).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `{system-code-graph,cli-*,sk-*,mcp-code-mode,mcp-chrome-devtools}/{feature_catalog,manual_testing_playbook}/**` | Rename | ~310 snippets de-numbered |
| each skill's root docs | Modify | Link rewrites |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero numbered snippet files remain in these skills | per-skill `rg --files | rg '/[0-9]{2,3}-[a-z]'` = 0 |
| REQ-002 | Each skill's count reconciled | per-skill root==files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No broken intra-skill links | per-skill link-check = 0 |
| REQ-004 | After this wave, the ONLY remaining numbered snippets repo-wide are frozen (z_future/z_archive/worktrees) | global active-scope grep = 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: ~310 files de-numbered; all 20 active skills now snippet-number-free.
- **SC-002**: Global active-scope numbered-snippet grep returns zero (excluding frozen set).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | sk-doc migrating its OWN playbook while it defines the standard | Low | Phase 001 already shipped the standard; sk-doc playbook is just another tree |
| Dependency | Phase 002 tool | Blocking | Must be green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Rename history preserved (git R-status); no data loss.

### Security
- **NFR-S01**: Renames performed in an isolated worktree; no secrets touched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Digit-initial slugs (e.g. `4-stage-pipeline-architecture.md`) preserved — only the leading NNN- sequence prefix is stripped.
- Category folders `NN--category-name` kept; never stripped.

### Error Scenarios
- A slug collision makes the tool abort (exit 2) with zero writes; resolved manually before the run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 310 files, 12 skills |
| Risk | 8/25 | Low-risk, mostly playbook-only |
| Research | 2/20 | Tool-driven |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Populate per-skill tasks/checklist on entry (12 sub-units from the phase-002 manifest).
<!-- /ANCHOR:questions -->
