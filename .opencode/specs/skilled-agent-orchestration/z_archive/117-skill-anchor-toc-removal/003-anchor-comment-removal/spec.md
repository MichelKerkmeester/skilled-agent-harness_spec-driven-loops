---
title: "Feature Specification: Bulk Comment-Anchor Removal"
description: "Remove all standalone ANCHOR / /ANCHOR HTML comment delimiters from in-scope skill markdown, preserving the consumed spec-kit template anchors."
trigger_phrases:
  - "bulk anchor comment removal"
  - "remove ANCHOR comments from skills"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/003-anchor-comment-removal"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Removed standalone anchor comments from skill markdown"
    next_safe_action: "Proceed to phase 004"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Bulk Comment-Anchor Removal

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
~688 in-scope skill markdown files carry `ANCHOR:name` / `/ANCHOR:name` HTML
comment delimiters used as section markers. The user wants these removed from skill docs. They
must be preserved where tooling consumes them (the spec-kit spec-folder generation templates).

### Purpose
Delete every standalone anchor-comment line from in-scope files via the shared transform's
`--anchors` mode, while carving out `system-spec-kit/templates/**` (a consumed generation standard).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All `*.md` under `.opencode/skills/**` except carve-outs.
- Whole-line `ANCHOR:...` and `/ANCHOR:...` comments.

### Out of Scope
- `system-spec-kit/templates/**` (anchors consumed by spec/memory generation + indexing).
- `sk-doc/scripts/tests/**` validator fixtures.
- Inline anchor *mentions* inside prose/backticks/code-fences that document the live spec-kit
  anchor system (these reference, not declare, anchors).
- Non-markdown source files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/**/*.md` (~673) | Modify | Delete standalone anchor comments |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Standalone anchor comments removed | Zero whole-line `<!-- /?ANCHOR -->` in scope |
| REQ-002 | Carve-out preserved | `system-spec-kit/templates/**` anchors intact |
| REQ-003 | Idempotent | Second run = 0 changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No tooling breakage | No script/MCP consumes skill-doc anchors (verified) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero standalone anchor-comment lines remain in scope.
- **SC-002**: Spec-kit template anchors (26 files) preserved; live anchor-system docs intact.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A glued/inline closing marker survives whole-line regex | Stray marker | Post-run grep for glued markers; fix manually (1 found, fixed) |
| Risk | Removing anchors documented as consumed | Broken docs | Carve out templates; preserve doc mentions of the spec-kit anchor system |
| Dependency | python3 | — | Present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
