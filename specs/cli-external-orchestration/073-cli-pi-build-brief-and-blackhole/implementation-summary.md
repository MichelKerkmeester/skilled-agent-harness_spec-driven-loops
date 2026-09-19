---
title: "Implementation Summary: Tell cli-pi dispatchers to scope build briefs to one change and to switch off pi-blackhole in children"
description: "The cli-pi skill now asks for one change per build brief and for pi-blackhole to be switched off in a dispatched child, the two causes of a forty-minute build that never edited."
trigger_phrases:
  - "cli-pi build brief summary"
  - "pi blackhole passive child"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/073-cli-pi-build-brief-and-blackhole"
    last_updated_at: "2026-09-19T07:54:19Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added rule 12 and the pi-blackhole gotcha to cli-pi"
    next_safe_action: "Carry the variable into the child envelope once providers-and-models.md is free"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-pi/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the child envelope in providers-and-models.md carry PI_BLACKHOLE_PASSIVE too?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 073-cli-pi-build-brief-and-blackhole |
| **Completed** | 2026-09-19 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A dispatcher reading the cli-pi skill now learns the two things that sank a build: send one change per brief, and switch pi-blackhole off in the child.

### Tell cli-pi dispatchers to scope build briefs to one change and to switch off pi-blackhole in children

ALWAYS rule 12 asks for one change per build brief, naming the file, the edit and the check, with changes chained as separate dispatches. A new Dispatch-Critical Gotcha explains that the operator's global packages load in a child, that pi-blackhole compacts mid-run at 272,000 tokens and makes a still-reading child start over, and that `PI_BLACKHOLE_PASSIVE=true` switches it off. The packet is at 1.5.4.0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modified | Rule 12, the gotcha, version 1.5.4.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.4.0.md` | Created | Changelog |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cause came from the failed child's pi transcript: 141 tool calls, none an edit, a compaction entry with `tokensBefore: 273996` and `fromHook: true`, and the child's own "No edits have landed yet" after it. The operator chose these two fixes on 2026-09-19.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the variable in `SKILL.md`, not yet in the envelope | `references/providers-and-models.md` holds another session's uncommitted edits |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on `SKILL.md` | Valid, 0 issues |
| `validate_document.py` on the changelog | Valid, 0 issues |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The child envelope does not carry the variable yet**, for the reason above.
<!-- /ANCHOR:limitations -->
