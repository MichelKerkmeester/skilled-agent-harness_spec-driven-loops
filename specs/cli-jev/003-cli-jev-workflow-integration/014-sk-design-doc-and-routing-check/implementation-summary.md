---
title: "Implementation Summary: sk-design Rule 6, Gate Docs and Routing Accuracy (Planned)"
description: "Nothing is built yet. This phase is Planned: its documents describe a rewrite of sk-design's stale rule 6, an owner choice on the md-generator's 80-point gate docs and a replay that records the hub's first routing accuracy number."
trigger_phrases:
  - "sk-design rule 6 summary"
  - "md-generator gate status"
  - "sk-design routing accuracy status"
  - "phase 14 planned"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check"
    last_updated_at: "2026-09-27T14:30:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the planning documents from the owner-fix brief and research section 8"
    next_safe_action: "Get the owner's gate choice, then run the baselines in tasks.md Phase 1"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which md-generator gate option does the owner choose"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-sk-design-doc-and-routing-check |
| **Completed** | Not completed. Status is Planned |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is Planned, and no sk-design file has changed.

### Phase 14: sk-design-doc-and-routing-check

The plan fixes three things in `sk-design`. Rule 6 in the hub's `SKILL.md` will match the compiled route the front door returns today. The md-generator's gate docs will match its code, or the code will match the docs, whichever the owner picks. The hub will get its first recorded routing accuracy number, and the SD-007 routing drift that number exposes will be diagnosed and fixed with the owner's yes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Planned | `spec.md` section 3 lists the files the build will change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written from live read-only checks on 2026-09-27: two compiled routes, the kill-switch sentinel, the admission harness and a same-class `rg` over the md-generator docs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recommend option A, docs follow the code | The code's zero-hard-failure gate is stricter than the documented 80-point rule, so enforcing 80 would pass documents the code fails today |
| Use the existing admission harness plus a front-door run script | The harness reads gold only from the hub's own playbook, 4 of 53 scenarios. A run script covers the other 49 without changing any harness |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build verification | Not run. Nothing is built |
| Phase document validation | See the phase's `validate.sh --strict` run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gate change and the SD-007 fix wait on the owner.** Rule 6 and the replay can land first.
<!-- /ANCHOR:limitations -->

---
