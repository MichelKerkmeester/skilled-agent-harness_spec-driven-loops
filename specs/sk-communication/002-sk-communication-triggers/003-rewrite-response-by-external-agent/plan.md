---
title: "Implementation Plan: [sk-communication/002-sk-communication-triggers/003-rewrite-response-by-external-agent/plan]"
description: "Plan for authoring the one-shot engine-choice projection command with an explicit ON-run-OFF mechanism and no shipped-package edits."
trigger_phrases:
  - "implementation"
  - "plan"
  - "003"
  - "rewrite"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/003-rewrite-response-by-external-agent"
    last_updated_at: "2026-08-19T04:54:45Z"
    last_updated_by: "claude"
    recent_action: "Planned command 2 authoring"
    next_safe_action: "Update SKILL note and mirrors in phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-rewrite-response-by-external-agent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: rewrite-response-by-external-agent command

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Author one root slash command that projects a target through a user-chosen engine (a cli-* skill, native in-context, or a local LLM) for a single run. Flip `COMMUNICATION_PROJECTION_ENABLED` on inline, run the flow, and let it fall away afterward. Change no shipped package code; orchestrate existing surfaces. Mirror into the Claude and Cursor runtimes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `check_authored_name_kebab.py` and `validate_document.py --type command` both exit 0.
- The ON→run→OFF mechanism is documented explicitly and never persists the flag.
- Hygiene grep confirms no leaked spec ids in the shipped command.
- No file under the projection package `src/` is modified.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

A single markdown command with a mandatory engine gate and three engine branches. Native applies the rubric in-context; the cli-* branch loads `cli-external-orchestration`, reads the chosen skill's `SKILL.md`, and dispatches under inline env scoping; the local branch runs the package's `cli-output-wrapper` under inline env scoping. All branches are display-only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `.opencode/commands/rewrite-response-by-external-agent.md` (new command).
- `.claude/commands/` and `.cursor/commands/` mirrors (new symlinks).
- No package, agent, or skill source is modified by this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the engine roster, the runnable entrypoint, and the activation gate from phase 001.

### Phase 2: Core Implementation
- [x] Author the command with the mandatory engine gate, the three engine branches, and the ON→run→OFF section.
- [x] Create the `.claude` and `.cursor` mirrors.

### Phase 3: Verification
- [x] Run both authoring validators to zero issues and confirm no package source changed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Static: both authoring validators exit 0.
- Invariant: the body sets the flag inline only and never writes `enablement.local.json`.
- Scope: `git status` shows no change under the projection package `src/`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- sk-create-command standard and shared validators.
- `cli-external-orchestration` for the cli-* branch and `cli-output-wrapper` for the local branch.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `.opencode/commands/rewrite-response-by-external-agent.md` and the two mirrors. No package source is touched, so removal fully reverts the phase.
<!-- /ANCHOR:rollback -->
