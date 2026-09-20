---
title: "Implementation Plan: sk-create-diagram type reference library"
description: "Port all 27 diagram-type references and their example assets via a Deepseek v4 Flash executor dispatch, batched to stay within context budget."
trigger_phrases:
  - "diagram type library plan"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/003-diagram-type-reference-library"
    last_updated_at: "2026-08-12T06:31:38.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan ahead of executor dispatch"
    next_safe_action: "Dispatch after phase 002 lands"
    blockers:
      - "Waiting on phase 002"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-create-diagram type reference library

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference docs + HTML/SVG example assets |
| **Framework** | `sk-create-skill` reference template |
| **Storage** | `.opencode/skills/sk-doc/sk-create-diagram/references/`, `assets/` |
| **Testing** | File-count check, `validate_skill_package.py --check`, spot-check of a sample of files |

### Overview

27 type references averages ~150 lines each (per `resource-map.md` §1), well within a single executor's context budget even at DeepSeek v4 Flash's tighter window; batch into 2 dispatches (14 + 13 types) to keep each dispatch's output size manageable and reduce the chance of truncation or silent drops. The orchestrator verifies file count and a sample of content after each batch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 002 `SKILL.md` and `references/` folder exist and pass `validate_skill_package.py --check`.

### Definition of Done

- [x] 27/27 `type-*.md` files exist.
- [x] 27 canonical + 7 special-pattern example assets exist.
- [x] `SKILL.md` selection-guide table links resolve.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two batched executor dispatches (not one, to bound output size and truncation risk), each independently verified before the next starts.

### Key Components

- **Batch 1**: types architecture, bar, data-flow, dp-integration, dp-security-matrix, er, flowchart, gantt, high-level, it-state, layers, line, loop, medallion (14 types, the larger files).
- **Batch 2**: nested, org-chart, process, pyramid, quadrant, radar, scatter, sequence, state, swimlane, timeline, tree, venn (13 types) plus the 7 special-pattern examples and the `SKILL.md` table update.

### Data Flow

`resource-map.md` §1/§3 → batch 1 dispatch → orchestrator verify → batch 2 dispatch (includes SKILL.md table update) → orchestrator verify → file-count success criterion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/` | Design-system references only (from phase 002) | Add 27 type references | File count, frontmatter spot-check |
| `assets/` | 4 templates + icon gallery (from phase 002) | Add 34 example files | File count |
| `SKILL.md` | Has a selection-guide stub | Fill in every type's link | Link resolution check |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm phase 002 landed and validates.
- [x] Compose the batch 1 dispatch prompt.

### Phase 2: Implementation

- [x] Dispatch batch 1 (14 types).
- [x] Verify batch 1 output.
- [x] Compose and dispatch batch 2 (13 types + special-pattern examples + SKILL.md table).
- [x] Verify batch 2 output.

### Phase 3: Verification

- [x] File-count check: 27 type references, 34 example assets.
- [x] `validate_skill_package.py --check`.
- [x] Confirm `SKILL.md` table links resolve.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Count | File totals match the frozen manifest | `find | wc -l` |
| Structural | Frontmatter, naming | `validate_skill_package.py --check` |
| Link integrity | SKILL.md table resolves | Manual grep + file existence check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 output | Internal | Pending at authoring time | Nothing to add references into |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A batch produces malformed or incomplete files.
- **Procedure**: Discard that batch's files and re-dispatch with a tighter, smaller sub-batch; phase 002's output is untouched either way.
<!-- /ANCHOR:rollback -->
