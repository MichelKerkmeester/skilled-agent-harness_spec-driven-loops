---
title: "Implementation Summary: Phase 3: rewrite-response-by-external-agent command"
description: "Command 2 shipped and verified: one-shot engine-choice projection with a guaranteed flip-off, no shipped-package edits."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/003-rewrite-response-by-external-agent"
    last_updated_at: "2026-08-20T21:58:00Z"
    last_updated_by: "claude"
    recent_action: "Command 2 shipped and verified"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 3: rewrite-response-by-external-agent command

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Phase** | 3 of 10 |
| **Completed** | 2026-08-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/rewrite-response-by-external-agent`, a root OpenCode slash command at `.opencode/commands/rewrite-response-by-external-agent.md`. It runs a one-shot sk-communication projection of a target through a user-chosen engine.

- A mandatory engine gate asks the user to pick: an external `cli-*` skill (all six), native in-context, or a local LLM. Inference is forbidden.
- ON→run→OFF: `COMMUNICATION_PROJECTION_ENABLED` is set inline for the single run (or in a trap-guarded subshell), so it falls away immediately after, even on error. `enablement.local.json` is never written.
- Engine branches: native applies the rubric in-context; the cli-* branch reads the chosen skill's `SKILL.md` then dispatches; the local branch runs the package's `cli-output-wrapper`.
- Display-only: no canonical bytes change. Mirrored into `.claude` and `.cursor`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Authored by a cli-devin Gemini 3.7 Flash HIGH agent under the markdown persona, to the sk-create-command template. The orchestrator verified the result independently and created the runtime mirrors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Built as command-level orchestration that changes no shipped package code, which is the goal's literal reading ("the command asks and routes") and needs no high-blast-radius package edit.
- A first-class `external-cli` package provider — routing the cli-* path through the package's privacy and fidelity pipeline — is recorded as a recommended future hardening, requiring a package change and operator approval.
- The local branch fails closed with setup guidance when no local provider is configured, rather than silently doing nothing.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `check_authored_name_kebab.py .opencode/commands/rewrite-response-by-external-agent.md` → exit 0: PASS kebab-case.
- `validate_document.py .opencode/commands/rewrite-response-by-external-agent.md --type command` → exit 0: VALID, Total issues: 0. Re-run independently by the orchestrator.
- Hygiene grep found no ephemeral artifact labels in the shipped command.
- `.claude` and `.cursor` mirrors resolve.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The cli-* path routes outside the package pipeline, so it does not yet get the package's privacy classification or fidelity validation; the future `external-cli` provider would close that gap.
- The `.codex/prompts/` mirror is deferred (different stub mechanism).
<!-- /ANCHOR:limitations -->
