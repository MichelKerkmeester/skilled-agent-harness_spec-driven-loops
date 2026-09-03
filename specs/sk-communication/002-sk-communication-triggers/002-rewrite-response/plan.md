---
title: "Implementation Plan: Phase 2: rewrite-response command"
description: "Plan for authoring the /rewrite-response in-context self-rewrite command to the sk-create-command standard and mirroring it across runtimes."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/002-rewrite-response"
    last_updated_at: "2026-08-19T04:41:42Z"
    last_updated_by: "claude"
    recent_action: "Planned command 1 authoring"
    next_safe_action: "Proceed to phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-rewrite-response"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: rewrite-response command

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Author one root slash command, `/rewrite-response`, that instructs the active AI to re-render its own most recent reply in sk-communication plain English, in-context, with no model call and no file writes. Distill the self-contained rubric from the package's `COPY_EDITING_INSTRUCTION` and the sk-communication plain-English standard. Mirror the command into the Claude and Cursor runtimes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `check_authored_name_kebab.py` exits 0.
- `validate_document.py --type command` exits 0 with zero issues.
- Independent hygiene grep confirms no leaked spec ids or dev notes in the shipped command.
- `.claude` and `.cursor` mirrors resolve.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

A single markdown command file under `.opencode/commands/`. No code, no package dependency, no tools. The command body carries: an argument-parse step for `--show-original`, a target-locate step for the prior assistant message, a protected-span identification step, the in-context rubric, and a render-and-status step. Cross-runtime mirrors are relative symlinks into the canonical file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `.opencode/commands/rewrite-response.md` (new canonical command).
- `.claude/commands/rewrite-response.md`, `.cursor/commands/rewrite-response.md` (new symlink mirrors).
- No package, agent, or skill file is modified by this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Distill the rubric from `COPY_EDITING_INSTRUCTION` and the sk-communication plain-English standard.

### Phase 2: Core Implementation
- [x] Author the command to the sk-create-command template (frontmatter, sections, examples, status).
- [x] Create the `.claude` and `.cursor` symlink mirrors.

### Phase 3: Verification
- [x] Run the authoring validators to zero issues and confirm the mirrors resolve.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Static: both authoring validators exit 0.
- Structural: the file uses full-integer H2 sections, an argument hint, and structured status.
- Mirror: `cat` through each symlink resolves to the canonical body.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- sk-create-command standard and shared validators.
- The verified plain-English rubric source in the projection package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `.opencode/commands/rewrite-response.md` and the two symlink mirrors. No other surface is affected, so removal fully reverts the phase.
<!-- /ANCHOR:rollback -->
