---
title: "Implementation Plan: sk-create-diagram import/export tooling"
description: "Port the two stdlib-only extraction scripts and their reference guides, and wire routing into SKILL.md, via a single Deepseek v4 Flash executor dispatch."
trigger_phrases:
  - "diagram import export plan"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/004-import-export-tooling"
    last_updated_at: "2026-08-12T06:38:42.000Z"
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
# Implementation Plan: sk-create-diagram import/export tooling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (stdlib only) + Markdown references |
| **Framework** | `sk-create-skill` reference template |
| **Storage** | `.opencode/skills/sk-doc/sk-create-diagram/scripts/`, `references/` |
| **Testing** | `--help` smoke test on both scripts, `validate_skill_package.py --check` |

### Overview

Single executor dispatch (small, well-bounded scope: 2 scripts + 3 references + one `SKILL.md` edit). Scripts are copied unchanged — no restructuring needed since they are already stdlib-only and self-contained.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 002 `SKILL.md` and `references/` exist.

### Definition of Done

- [x] Both scripts present and pass `--help`.
- [x] All three references present with valid frontmatter.
- [x] `SKILL.md` §11-12 route correctly.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single scoped executor dispatch, orchestrator verification pass.

### Key Components

- **Script port**: byte-for-byte copy, no restructuring.
- **Reference port**: standard reference-frontmatter port, same as phase 002's references.
- **SKILL.md routing edit**: small, targeted addition to an existing file (not a full rewrite).

### Data Flow

`resource-map.md` §2 (scripts) + source references → executor dispatch → produced files → `--help` smoke test → `validate_skill_package.py --check`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scripts/` | Does not exist yet in the packet | Add both extraction scripts | `--help` smoke test |
| `references/` | Design-system + (maybe) type references | Add 3 import/export references | Frontmatter check |
| `SKILL.md` | Has §11-12 stubs from phase 002 | Fill in routing | Manual trace |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm phase 002 landed.
- [x] Compose the dispatch prompt.

### Phase 2: Implementation

- [x] Dispatch the executor.
- [x] Verify output.

### Phase 3: Verification

- [x] `--help` smoke test on both scripts.
- [x] `validate_skill_package.py --check`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | Scripts parse and run | `python3 <script> --help` |
| Structural | Frontmatter, naming | `validate_skill_package.py --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 output | Internal | Pending at authoring time | Nothing to add scripts/references into |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A ported script fails its `--help` smoke test.
- **Procedure**: Re-copy the script directly rather than re-dispatch (it needs zero restructuring, so a direct copy is lower-risk than a second generation pass).
<!-- /ANCHOR:rollback -->
