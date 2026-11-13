---
title: "Implementation Summary"
description: "Planned, not built. This phase will make a prompt-free hook health record the default with a degraded rate and a record time, narrow the needs-a-mode label to prompts that name the hub, let the top hub name its routed command, drop the OpenCode compiled-route line and fix the brief-cost script and two behaviour-arm counts."
trigger_phrases:
  - "health default and brief refinements implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements"
    last_updated_at: "2026-11-13T07:48:56Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-health-default-and-brief-refinements"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-health-default-and-brief-refinements |
| **Completed** | Not completed. Planned on 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and waits for phase 014 to be committed. T034 rewrites this document from the evidence once the tasks have run.

### Phase 15: health-default-and-brief-refinements

Once built, every hook install except OpenCode will report how its prompt hook runs and how often its answer came from the CLI's local scorer, without the debug variable and without recording what the prompt was about. You will see `(needs a mode)` only on a prompt that names the hub, the head will name the command the top hub routed, OpenCode will send the head entry alone and the brief-cost script will refuse an arm whose heads are all outage lines.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Planned | `spec.md` section 3 lists the 28 files the tasks will change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The plan rests on read-only measurements at `320e7b64d4`: the command capture, the scorer eval, a label probe and a trim probe in a temporary folder, the final-arm summary and the targeted test files, each quoted in `spec.md` section 2.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A health record by default, with the skill label and the error text behind the debug variable | The gate was added for writes nobody read. `hookHealth` and the advisor leg read them now, and the health reader needs neither field |
| The label rule counts 1 floor row of 35, not 0 | `nm-system-skill-advisor-01` names `sk-doc`, the hub that tops it, so a stricter rule would also drop the label from prompts that ask for the hub |
| `promptSessionId` lives in the offer module with no new unit test | The runner runs `main()` on import, and the draft names no test for the session choice, so an inline check and a stored-arm probe prove it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh <this folder> --strict` on the planning documents | PASSED on 2026-11-13 |
| Build checks | Not run. They are T032 and T033 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The brief-cost script may refuse on this machine.** Its hook runs with a sandboxed socket folder, so on a machine where that hook cannot reach a live advisor the run prints `degraded_brief` instead of a cost. The refusal is the intended answer. A cost comes from a run whose hook reaches a live advisor.
<!-- /ANCHOR:limitations -->
