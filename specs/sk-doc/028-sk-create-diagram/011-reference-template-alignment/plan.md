---
title: "Implementation Plan: sk-create-diagram reference template alignment"
description: "Dispatch plan: deepseek for 4 confirmed-broken files, GPT-5.6-luna-fast (max) for 6 needing deeper audit."
trigger_phrases:
  - "diagram reference alignment plan"
importance_tier: "important"
contextType: "planning"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/011-reference-template-alignment"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch both streams"
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
# Implementation Plan: sk-create-diagram reference template alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference files, template structure comparison |
| **Framework** | `sk-create-skill`'s literal `skill-reference-template.md` contract |
| **Storage** | `.opencode/skills/sk-doc/sk-create-diagram/references/{primitives,import-export,foundations}/` |
| **Testing** | `grep`-based divider/casing scans, `validate_document.py --type reference` |

### Overview

Two dispatches, routed by task shape: `deepseek/deepseek-v4-flash` for 4 files with a confirmed mechanical defect (missing dividers, lowercase titles), `openai/gpt-5.6-luna-fast --variant max` for 6 files needing a deeper judgment audit against the template's intro-duplication and frontmatter-completeness rules. Every claimed change independently re-verified before being accepted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] All 10 named files audited against the template's literal structure and classified confirmed-broken vs. needs-deeper-audit.
- [x] Template ground truth (`skill-reference-template.md`) and 2 cross-check files read and confirmed as the audit baseline.

### Definition of Done

- [x] 4/4 confirmed-broken files fixed for dividers + casing.
- [x] 6/6 audit files reviewed for genuine defects, no manufactured changes.
- [x] `validate_document.py --type reference` run on all 10, results recorded honestly (including the pre-existing overview-section gap).
- [x] `implementation-summary.md` and `checklist.md` written.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Route-by-task-shape dispatch, then independent verification: mechanical divider/casing defects go to the cheaper model as a closed-form fix; files that already pass the mechanical checks go to the stronger model for a genuine judgment audit rather than an assumed fix. Every claimed edit is independently re-diffed and re-validated before being recorded.

### Key Components

- **Stream A** (4 files): `primitive-icons.md`, `export.md`, `import-mermaid.md`, `import-drawio.md` — insert dividers, uppercase titles, touch nothing else.
- **Stream B** (6 files): `primitive-annotation.md`, `-sketchy.md`, `-terminal.md`, `style-guide.md`, `output-spec.md`, `onboarding.md` — audit against the template's intro-duplication rule and frontmatter completeness.
- **Independent verification**: `grep`-based divider/casing recount, `git diff` line-by-line inspection, direct `validate_document.py` runs by the orchestrator.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Audit all 10 named files; classify confirmed-broken vs. needs-deeper-audit.

### Phase 2: Implementation

- [x] Dispatch Stream A (deepseek), verify.
- [x] Dispatch Stream B (GPT-5.6-luna-fast max) — first attempt self-refused, retried with a corrected prompt, verify.

### Phase 3: Verification

- [x] Run `validate_document.py --type reference` on all 10 files.
- [x] Write `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Divider/casing across all 10 files | `grep`-based recount |
| Content integrity | Every edited file | `git diff` line-by-line inspection |
| Contract | All 10 files | `validate_document.py --type reference` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill-reference-template.md` ground truth | Internal | Satisfied | No audit baseline |
| DeepSeek + OpenAI provider auth | External | Satisfied (5 credentials configured) | Dispatch would fail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispatch alters technical content beyond structural formatting, or manufactures a change to an already-conformant file.
- **Procedure**: `git checkout -- <path>` per file; every edited file's diff was independently reviewed before being accepted, so a bad edit is caught before this phase closes, not after.
<!-- /ANCHOR:rollback -->
