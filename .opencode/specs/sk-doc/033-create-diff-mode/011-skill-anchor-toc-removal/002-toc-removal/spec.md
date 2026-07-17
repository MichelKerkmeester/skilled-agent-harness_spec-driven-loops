---
title: "Feature Specification: Bulk TOC Block Removal"
description: "Deterministically remove every ## TABLE OF CONTENTS block from all in-scope skill markdown files, leaving body content and headings intact."
trigger_phrases:
  - "bulk toc removal"
  - "remove table of contents blocks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/011-skill-anchor-toc-removal/002-toc-removal"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Removed all TOC blocks from in-scope skill markdown"
    next_safe_action: "Proceed to phase 003"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Bulk TOC Block Removal

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
384 in-scope skill markdown files carry a `## TABLE OF CONTENTS` block (heading plus a list of anchor links). These add maintenance burden and the user wants them removed.

### Purpose
Remove every TOC block from in-scope files via one idempotent, fence-aware transform, deleting the heading and its link list while preserving all body content and real section headings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All `*.md` under `.opencode/skills/**` except `system-spec-kit/templates/**`.
- The `## TABLE OF CONTENTS` heading + its bullet list + a wrapping `ANCHOR:table-of-contents`.

### Out of Scope
- `ANCHOR` comments generally (handled in phase 003).
- Example TOCs shown *inside* fenced code blocks (preserved — fence-aware).
- Non-markdown files; `system-spec-kit/templates/**`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/**/*.md` (~384) | Modify | Delete TOC blocks |
| `002-toc-removal/strip_toc_anchors.py` | Create | Shared transform tool |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | TOC blocks removed | `rg -l -i "table of contents"` in scope → 0 (outside fences) |
| REQ-002 | No body content lost | `git diff` shows only TOC heading/list + wrapper deletions and blank collapses |
| REQ-003 | Idempotent | Second run produces no changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Independent verification | CLI-Devin/SWE-1.6 sample sweep confirms no collateral edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero `## TABLE OF CONTENTS` headings remain in scope (outside code fences).
- **SC-002**: A sample of changed files renders correctly (no orphaned link lists).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-deletion past TOC | Body content lost | Stop at first non-blank/non-bullet/non-anchor line; fence-aware |
| Risk | Example TOC in a code fence | Damaged example | Skip transformations inside fenced code blocks |
| Dependency | python3 | — | Present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
