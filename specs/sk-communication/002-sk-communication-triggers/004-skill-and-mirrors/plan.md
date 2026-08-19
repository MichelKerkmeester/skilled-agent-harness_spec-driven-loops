---
title: "Implementation Plan: Phase 4: SKILL note and cross-runtime mirrors"
description: "Plan for the additive SKILL.md trigger-surface subsection and the Claude and Cursor command mirrors."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/004-skill-and-mirrors"
    last_updated_at: "2026-08-19T04:54:45Z"
    last_updated_by: "claude"
    recent_action: "Planned SKILL note and mirrors"
    next_safe_action: "Run final recursive strict validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-skill-and-mirrors"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: SKILL note and cross-runtime mirrors

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add one additive `### Operator Trigger Commands` subsection to `sk-communication/SKILL.md` that documents both commands and their invariants, and create the `.claude` and `.cursor` symlink mirrors for both commands. Change nothing else in the skill.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The default-off statement in SKILL.md is unchanged.
- Both commands resolve through their `.claude` and `.cursor` mirrors.
- The SKILL edit is additive only.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

One additive markdown subsection placed after the skill's "When NOT to Use" list, plus relative symlinks that follow the established `../../.opencode/commands/` mirror convention.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `.opencode/skills/sk-communication/SKILL.md` (one additive subsection).
- `.claude/commands/` and `.cursor/commands/` (symlink mirrors for both commands).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the SKILL insertion point and the mirror convention.

### Phase 2: Core Implementation
- [x] Add the "Operator Trigger Commands" subsection.
- [x] Create the `.claude` and `.cursor` mirrors for both commands.

### Phase 3: Verification
- [x] Confirm the default-off statement is intact and every mirror resolves.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Grep confirms the new subsection and the intact default-off statement.
- `cat` through each symlink resolves to the canonical command body.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phases 002 and 003 command files.
- The verified cross-runtime symlink mirror model.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the added subsection and delete the four symlinks. No canonical command or package source is affected, so removal fully reverts the phase.
<!-- /ANCHOR:rollback -->
