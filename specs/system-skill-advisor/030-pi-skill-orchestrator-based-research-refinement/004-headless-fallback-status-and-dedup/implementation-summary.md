---
title: "Implementation Summary: Headless Fallback Status and Dedup"
description: "Not started. This phase is planned: the advisor fallback will say whether the advisor failed, matched nothing or skipped the prompt, name the CLI command on an outage, and stop resending its directives block on repeats."
trigger_phrases:
  - "fallback status summary"
  - "fallback dedup summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/004-headless-fallback-status-and-dedup"
    last_updated_at: "2026-09-26T11:10:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Planned R4 and R6 with verified code anchors"
    next_safe_action: "Wait for 002 to ship, then start with T001"
    blockers:
      - "002-hook-deadline-and-diagnostics has not shipped"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Research Q7: the operator allowed head-only fallback repeats in a known session."
      - "A head before the directives separator is enough for the existing lifecycle split; directive-lifecycle.ts needs no change."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Headless Fallback Status and Dedup

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-headless-fallback-status-and-dedup |
| **Completed** | Not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and waits on 002.

### Planned change

The fallback will open with one line that says what happened: the advisor was unavailable (with the CLI command to run), no skill matched, or the advisor skipped the prompt. With that head in place, Claude and OpenCode keep the head and drop the repeated directives block on later no-route turns, which the operator approved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | None | The planned files are listed in `spec.md` section 3 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning checks read the code: the lifecycle split needs a head before `\nDirectives:` (`hooks/lib/directive-lifecycle.ts:44-47`, `:126-127`), the plugin uses the same separator (`.skilled/plugins/system-skill-advisor.js:70`), and the timeout renderer has no caller outside `runtime/lib/render.ts`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Head the fallback instead of adding a separate dedup store | The existing split already drops the directives block after a head, so R6 needs one condition, not new state |
| Reuse the timeout renderer for the outage head | It has no production caller, and it already exists to mark an outage |
| Keep the full block for unknown sessions | Without a session id there is no proof of a repeat |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Tests and typecheck | Not run. The phase is not implemented |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement --strict --recursive` | RESULT: PASSED on the planning docs, 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Whether a model runs the named command is unknown.** A forced-timeout check after this phase answers it (research Q6).
<!-- /ANCHOR:limitations -->

---
