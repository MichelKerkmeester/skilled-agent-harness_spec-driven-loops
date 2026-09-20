---
title: "Implementation Plan: sk-create-diagram scaffold and design system"
description: "Scaffold the packet and author SKILL.md plus the shared design-system references via a Deepseek v4 Flash executor dispatch, verified by the orchestrating session."
trigger_phrases:
  - "diagram scaffold plan"
  - "diagram design system plan"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/002-skill-scaffold-and-design-system"
    last_updated_at: "2026-08-12T06:10:45.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan ahead of executor dispatch"
    next_safe_action: "Dispatch phase 002 executor prompt via cli-opencode"
    blockers: []
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
# Implementation Plan: sk-create-diagram scaffold and design system

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill contract + HTML/SVG template assets |
| **Framework** | `sk-create-skill` authoring contract, `sk-doc` nested workflow packet shape |
| **Storage** | `.opencode/skills/sk-doc/sk-create-diagram/` |
| **Testing** | `scripts/validate_skill_package.py --check`, manual cross-reference read |

### Overview

Dispatch the mechanical port-and-restructure work to a Deepseek v4 Flash executor via `cli-opencode` (model `opencode-go/deepseek-v4-flash`), scoped to the worktree, with `decision-record.md` §6 as the section-order brief. The orchestrating session verifies the output against REQ-001 through REQ-004 and fixes drift directly rather than re-dispatching for small corrections.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 001 `decision-record.md` is complete and strict-validated.
- [x] `cli-opencode` provider pre-flight confirms `opencode-go` is authenticated.

### Definition of Done

- [x] `SKILL.md` exists with valid frontmatter and required section order.
- [x] All 7 design-system reference files exist with full frontmatter blocks.
- [x] All 5 asset files (4 templates + icon gallery) exist.
- [x] `validate_skill_package.py --check` reports no hard failures for phase-002-owned files.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single scoped executor dispatch, then orchestrator verification pass — not a multi-round loop, since the brief is frozen and narrow.

### Key Components

- **Executor dispatch**: one `cli-opencode` call, `--dir` scoped to the worktree, prompt built from `decision-record.md` §6 plus explicit file-by-file instructions.
- **Verification pass**: orchestrator reads every produced file, checks frontmatter, section order, and the mandatory-connector-rules preservation requirement.

### Data Flow

`decision-record.md` §6 + source files in `context/` → executor dispatch → produced `SKILL.md` + `references/*.md` + `assets/*.html` → orchestrator verification → fix-in-place for any drift → `validate_skill_package.py --check`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-doc/sk-create-diagram/` | Does not exist yet | Create the packet skeleton and design-system content | `validate_skill_package.py --check` |
| `context/` | Forked source, read-only | Read for porting only | Never mutated |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Run the `cli-opencode` provider pre-flight (`opencode providers list`).
- [x] Compose the executor dispatch prompt from `decision-record.md` §6 and this spec's §3.

### Phase 2: Implementation

- [x] Dispatch the executor (`opencode-go/deepseek-v4-flash`, `--dir` scoped to the worktree).
- [x] Read every produced file.
- [x] Fix frontmatter, section-order, or content-loss drift directly.

### Phase 3: Verification

- [x] Run `validate_skill_package.py --check` against the packet.
- [x] Confirm the mandatory connector rules and complexity-budget table survived porting.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Frontmatter, section order, naming | `validate_skill_package.py --check` |
| Content-preservation | Connector rules, complexity budget, design tokens | Manual diff against `context/skills/diagram-design/SKILL.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `decision-record.md` | Internal | Complete | Executor has no frozen brief without it |
| `cli-opencode` + `opencode-go` provider | External tool | Confirm at dispatch time | Falls back to orchestrator hand-authoring if unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Executor output is unusable (wrong structure, hallucinated content, missing connector rules).
- **Procedure**: Discard the produced files (nothing outside `sk-create-diagram/` is touched) and either re-dispatch with a tightened prompt or hand-author directly; the worktree isolates this from the main branch regardless.
<!-- /ANCHOR:rollback -->
