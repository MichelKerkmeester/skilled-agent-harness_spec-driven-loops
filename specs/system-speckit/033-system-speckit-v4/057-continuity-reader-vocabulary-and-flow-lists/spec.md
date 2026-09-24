---
title: "Feature Specification: Phase 57: Continuity reader vocabulary and flow lists"
description: "The continuity reader rejected most hand-written continuity blocks: it read flow-style YAML lists as one string, and its list of allowed first words for next_safe_action missed the words those blocks open with."
trigger_phrases:
  - "continuity reader flow lists"
  - "next safe action verbs"
  - "flow style yaml list continuity"
  - "hand written continuity blocks rejected"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 57: Continuity reader vocabulary and flow lists

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 57 of 62 |
| **Predecessor** | 056-corpus-manifest-build-state |
| **Successor** | 058-upgrade-level-section-fragments |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 57** of the system-spec-kit v4 specification, the second of the fix phases planned after phase 051 shipped. The reader it changes is the one the save writer and the resume ladder both use.

**Scope Boundary**: the thin continuity reader and its test file. Existing blocks are not rewritten.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Of 2484 continuity blocks in tracked implementation summaries outside `z_archive`, only 180 passed the reader's checks. Two rules caused most rejections. A flow-style list such as `blockers: ["a", "b"]` was read as one string, so every list field written that way failed. And `next_safe_action` must open with a word from a fixed list that missed the words hand-written blocks actually use: "None", "Commit", "Close", "Execute", "Use" and "Proceed" together open more than 800 blocks. Punctuation after the first word ("None;") also failed the check.

### Purpose
The reader accepts the list syntax and the opening words real blocks use, and still rejects a block whose first word says nothing about what to do next.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read one-level flow lists with plain, single-quoted and double-quoted items.
- Ignore punctuation that ends the first word of `next_safe_action`.
- Add the status words and imperatives hand-written blocks open with to the allowed list.

### Out of Scope
- Rewriting existing blocks. The operator chose no backfill.
- The 12 summaries whose frontmatter the reader cannot parse at all. Their YAML is broken in ways this phase does not address.
- "Replace", which scaffold defaults open with. It stays rejected so the first real save must name a real next action.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts` | Modify | Flow-list parsing, first-word punctuation, wider verb list |
| `.skilled/skills/system-spec-kit/runtime/tests/thin-continuity-record.vitest.ts` | Modify | Tests for hand-written blocks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Flow lists are read as lists. | `["a, b", 'c']` and `[Q1, Q2]` read as two items each; an unclosed list stays text and fails validation. |
| REQ-002 | Real opening words are accepted and empty ones are not. | "None - the phase is closed", "None; nothing left to do", "Commit…", "Close…" and "Hand off…" pass; "Replace template defaults…" and "Operator decides…" still fail. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Nothing that reads continuity regresses. | The save, resume, freshness, path-boundary and quality-gate suites pass; typecheck and the CLI check pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A rescan of the same 2484 blocks finds more valid blocks and no new unparseable file.
- **SC-002**: The new tests fail against the previous reader.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A wider verb list accepts a vague next action | Low | Only words that open at least 10 real blocks were added; nouns such as "Operator" and "Phase" stay out |
| Risk | Flow-list parsing misreads a string that happens to be bracketed | Low | Nested brackets, an unclosed quote or an empty item return the raw text unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator approved the planner's recommendation on 2026-09-23.
<!-- /ANCHOR:questions -->

---
