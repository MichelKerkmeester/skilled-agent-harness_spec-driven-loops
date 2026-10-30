---
title: "Implementation Summary"
description: "Planned stub: nothing is changed yet. This phase will add the Hermes skills check to /doctor:runtime-mirrors and fix stale router wording in a skill template."
trigger_phrases:
  - "mirror and template fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/009-mirror-and-template-fixes"
    last_updated_at: "2026-10-30T05:21:20Z"
    last_updated_by: "template-author"
    recent_action: "Authored the planned stub"
    next_safe_action: "Start Phase 1 setup tasks in tasks.md; no dependency blocks them"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-mirror-and-template-fixes"
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
| **Spec Folder** | 009-mirror-and-template-fixes |
| **Status** | Planned |
| **Completed** | Not yet |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and has not started.

### Phase 9: mirror-and-template-fixes

When this phase ships, `/doctor:runtime-mirrors` will report drift in the generated Hermes skill copies the same way CI does, and the leaf-manifest config template will point authors at the sibling `ROUTER.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Planned | The planned file list is in `spec.md` section 3 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The proof plan is route-validate, the new contract test, the doctor suite and an `rg` sweep, as `plan.md` section 5 lists.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add the line to both the route and the YAML in one change | `route-validate.py` fails when a `script_invocations` script is not invoked by the YAML |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec folder validation | Pending: run `validate.sh --strict` at close |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not started.** Every limit will be recorded here when the phase closes.
<!-- /ANCHOR:limitations -->

---


