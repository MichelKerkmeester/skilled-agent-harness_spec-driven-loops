---
title: "Implementation Summary: Give the deep-research ledger its own spec-protocol events"
description: "Planned, not built: seven research event stems so the gateway records the spec writes a research run makes. The build waits on the operator's go-ahead."
trigger_phrases:
  - "spec protocol ledger events summary"
  - "packet 050 status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/050-spec-protocol-ledger-events"
    last_updated_at: "2026-09-19T06:36:41Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Planned the packet from the run-now precedent"
    next_safe_action: "Get the operator's go-ahead, then replay the fixtures"
    blockers:
      - "A durable ledger format change waits on the operator's go-ahead"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Which side changes: the ledger gets its own events (operator, 2026-09-19)"
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
| **Spec Folder** | 050-spec-protocol-ledger-events |
| **Completed** | Not started |
| **Level** | 2 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. The packet is planned from the stems `b8da689d67` added for run-now and synthesis, which is the template for every file this change touches. `spec.md` fixes the seven stems and their names, and `plan.md` records the legacy row shapes and a rollback note: a reverted runtime cannot read a ledger that already holds one of the new stems.

### Give the deep-research ledger its own spec-protocol events

Planned only.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | - | - |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The decision came from the operator on 2026-09-19, after phase 15 of packet 041 found that no research write-back ever reaches the ledger.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One stem per legacy row, named after it | The upcast stays obvious and lossless |
| Keep the workflow rows in their legacy shape | The upcaster already translates legacy rows; the YAML need not change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build | Not started |
| Planning docs | `validate.sh --strict` on this folder passes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Waits on the operator's go-ahead**, because it changes a durable ledger format.
<!-- /ANCHOR:limitations -->

---
