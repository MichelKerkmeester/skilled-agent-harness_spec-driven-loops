---
title: "Feature Specification: Move shared/references/global/* up into shared/references/"
description: "Drop the global/ nesting level under sk-doc's shared/references/, moving its contents up one level and repointing every symlink and referencer, with 0 broken links."
trigger_phrases:
  - "shared refs reorg"
  - "125 sk-doc phase 013"
  - "shared references global flatten"
importance_tier: "important"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/013-shared-refs-reorg"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Spec/plan/tasks authored; reorg not yet started"
    next_safe_action: "Inventory every symlink and reference pointing through global/"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Move shared/references/global/* up into shared/references/

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | `012-quality-control-rename/` |
| **Predecessor** | `012-quality-control-rename/` |
| **Successor** | `014-markdown-agent-sync/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/sk-doc/shared/references/global/` adds a nesting level that carries no meaning beyond "these are the generic, cross-packet references" — a distinction `shared/references/` already makes on its own, since everything under `shared/` is by definition cross-packet. No packet links into this tree via a filesystem symlink; instead, roughly 47 files across the hub (`SKILL.md`, `references/README.md`, other reference docs, and `hub-router.json`) cite the `global/` path directly in prose or JSON, all resolving through the extra segment for no structural benefit.

### Purpose
Drop the `global/` level: move its 6 files (`core_standards.md`, `evergreen_packet_id_rule.md`, `frontmatter_versioning.md`, `hvr_rules.md`, `quick_reference.md`, `validation.md`) up into `shared/references/` directly, then repoint every prose/JSON citation of the old `global/` path, leaving zero broken links. `shared/references/` currently holds nothing but the `global/` subdirectory, so the move itself is a plain relocation with no filename collisions to resolve.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the 6 files under `.opencode/skills/sk-doc/shared/references/global/` up to `.opencode/skills/sk-doc/shared/references/`.
- Repoint every prose/JSON citation of the old `global/` path (`SKILL.md`, `references/README.md`, other reference docs, `hub-router.json`; ~47 files today).
- Remove the now-empty `global/` directory.

### Out of Scope
- Reorganizing `shared/scripts/` or `shared/assets/` (only `shared/references/` is in scope).
- Renaming any individual reference file, only its location.
- The router alignment (011), packet rename (012), and markdown-agent sync (014) — each is its own phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/shared/references/global/*` -> `.opencode/skills/sk-doc/shared/references/*` | Move | Drop the `global/` nesting level (6 files) |
| `.opencode/skills/sk-doc/**/SKILL.md`, `references/README.md`, other reference docs, `hub-router.json` | Update | Repoint ~47 prose/JSON citations of the old `global/` path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `global/` level removed with zero content loss | All 6 files formerly under `shared/references/global/` now live directly under `shared/references/`; the `global/` directory no longer exists |
| REQ-002 | Every citation that pointed through `global/` now resolves directly | No `SKILL.md`, reference doc, or `hub-router.json` entry cites a `global/` path; all resolve to the flattened tree |
| REQ-003 | Zero broken links repo-wide from the move | Link checker reports 0 broken references introduced by this phase |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `parent-skill-check.cjs` still passes with 0 warnings after the move | Canon check re-run shows no new warnings from the path change |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `shared/references/` contains no `global/` subdirectory; its former contents live one level up.
- **SC-002**: Link checker and `parent-skill-check.cjs` both report a clean result after the move.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing one of the ~47 citation sites during the sweep | A stale `global/` path would 404 for a reader or a link checker | Re-run the repo-wide grep for `global/` after the move to confirm 0 remaining hits, not just a fixed known list |
| Dependency | Deterministic move + repoint tooling | A hand-rolled edit-by-edit sweep risks missed citations | Reuse the same move/repoint script pattern established for `create-skill`'s own reference regrouping |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding: `shared/references/` holds only the `global/` subdirectory today, so the move is a plain relocation with no filename collisions.
<!-- /ANCHOR:questions -->
