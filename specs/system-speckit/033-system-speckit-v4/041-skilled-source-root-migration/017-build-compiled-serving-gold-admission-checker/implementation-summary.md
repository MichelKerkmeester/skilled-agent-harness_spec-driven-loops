---
title: "Implementation Summary: Phase 17: build-compiled-serving-gold-admission-checker"
description: "Planned, not built: the admission checker that runs a hub's compiled decisions against its playbook's routing gold. The build waits on five decisions."
trigger_phrases:
  - "gold admission checker summary"
  - "phase 17 status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/017-build-compiled-serving-gold-admission-checker"
    last_updated_at: "2026-09-19T05:32:44Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Planned the build"
    next_safe_action: "Answer the open questions in spec.md section 10"
    blockers:
      - "The open questions in spec.md section 10 need the operator's answers"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How does a clarify decision count?"
      - "What coverage floor applies, and to admitted hubs as well as new ones?"
      - "How does multi-mode gold score?"
      - "Repair the flip tool or replace it?"
      - "Should CI block on drift from day one?"
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
| **Spec Folder** | 017-build-compiled-serving-gold-admission-checker |
| **Completed** | Not started |
| **Level** | 2 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned: `spec.md` holds the scope and five open questions, `plan.md` the design, and `tasks.md` the order. The build starts once the questions are answered.

### Phase 17: build-compiled-serving-gold-admission-checker

Planned only.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | - | - |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Planned from phase 15's research and a count of the live gold corpus.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pin scoring in fixtures before the first live run | Otherwise the live corpus shapes the rules it is judged by |
| Start the CI step warn-only | The first run may fail admitted hubs on stale gold, which needs triage before it blocks anyone |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build | Not started |
| Planning docs | `validate.sh --strict` on this folder passes |
| Gold corpus count behind the floors | `rg -l expected_workflow_mode .skilled/skills/<hub>/manual-testing-playbook --max-depth 3` over the five hubs: 74 files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The build is blocked on five decisions** listed in `spec.md` section 10.
<!-- /ANCHOR:limitations -->

---
