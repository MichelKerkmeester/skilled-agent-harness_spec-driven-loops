---
title: "Tasks: design-interface references conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "references tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/002-references"
    last_updated_at: "2026-07-27T16:13:03Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned tasks.md"
    next_safe_action: "Start T001"
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

# Tasks: design-interface references conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read `skill-reference-template.md` in full
- [x] T002 Enumerate all 29 files with current line counts (verified count via `find references -name "*.md" | wc -l` = 29)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Audit `references/aesthetics/*.md` (5 files) — all conformant, `README.md`'s AT-A-GLANCE-style index and pitch already correct per prior disproven finding
- [x] T004 [P] Audit `references/design-grounding/*.md` (2 files) — both had intros exceeding 1-2 sentences; trimmed, no duplication with Section 1
- [x] T005 [P] Audit `references/design-process/*.md` (11 files) — 8 had intro-length or `---`-separator or missing-OVERVIEW defects, all fixed; `design-principles.md` and `ux-quality-reference.md` conformant as-is
- [x] T006 [P] Audit `references/foundations/*.md` + `color/`, `layout/`, `type/` (10 files) — `design-system-artifact-contract.md` and `smart-router-pseudocode.md` were missing `## 1. OVERVIEW` (fixed + renumbered); `data-viz.md`/`layout/adaptation-matrix.md` intros trimmed; `worked-examples.md` missing 2 `---` separators (fixed)
- [x] T007 [P] Audit `references/mcp-tooling/*.md` (2 files) — `refero-tools.md` missing OVERVIEW (fixed) and citing a broken `tool_surface.md` link (fixed to `tool-surface.md`); `mobbin-tools.md` intro was a 4-line field table, not 1-2 sentences (moved into a new OVERVIEW "Prerequisites" subsection)
- [x] T008 Fix `refero-tools.md` — added `## 1. OVERVIEW` with Purpose/When to Use/Core Principle/Prerequisites, renumbered downstream sections 2-3
- [x] T009 Decide and apply disposition for `refero-tools.md` (fixed), `aesthetics/README.md` (flagged as consolidation candidate, not fixed — 45 lines, no structural defect), `resource-loading-notes.md` (missing intro + 2 `---` separators fixed; the previously-primed "headers not ALL-CAPS" claim stayed disproven), `foundations/corpus-map.md` (flagged as consolidation candidate, not fixed — 51 lines, no structural defect)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `package_skill.py --check` — `strict mode`, PASS, 1 pre-existing warning (SKILL.md word count, out of this child's scope)
- [x] T011 `rg` for cross-references to any consolidated/renamed file — no consolidations were performed (all 29 files retained); `tool_surface.md` -> `tool-surface.md` link fix verified by `os.path.exists`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
