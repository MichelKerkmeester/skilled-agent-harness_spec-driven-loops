---
title: "Implementation Summary: Phase 4: history-preview-readability"
description: "History lookup previews now show what a model turn did, its text and each tool call's name and arguments, instead of serialized block objects, and a live Pi receiver used them to recover a detail the note left out."
trigger_phrases:
  - "history preview readability implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-history-preview-readability"
    last_updated_at: "2026-11-15T19:49:21Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-history-preview-readability"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 4: history-preview-readability

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-history-preview-readability |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A receiver browsing a sender's history now sees what each model turn did, such as `bash {"command":"wc -l README.md"}`, instead of `{"type":"toolCall","id":"call-...`. With readable previews, a live Pi receiver found the turn it needed, loaded it and reported the side word the note had left out.

### Phase 4: history-preview-readability

`previewFor` builds a model turn's preview from its projected blocks: each text block as it is, then each tool call as its name and its arguments in compact JSON. Projection has already removed thinking, paging calls and provider signatures, and the secret redaction on main runs before projection, so the preview shows nothing those steps hide. `itemText`, the text search indexes and quotes, uses the same rendering, so a search excerpt reads the same way and a call id is no longer searchable. User-turn previews are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-handover/history/lib/navigator.ts` | Modified | Readable `previewFor` |
| `.skilled/hooks/session-handover/history/tests/history-search-browse.vitest.ts` | Modified | Browse and search preview tests |
| `../scratch/harness/live-hop.sh` | Modified | `PI_ROUTE=deepseek` runs Pi's own default model |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator chose to fix the previews in this packet and rerun Pi on DeepSeek Flash at max thinking. Vibe CLI on deepseek-flash built the change from one brief, the history engine was rebuilt, a mutation check restored the old function, and a live Pi hop ran on the rebuilt engine. A fresh Opus medium agent reviewed the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Name and arguments, not the whole block | The id and type field say nothing about what the turn did, and the arguments do |
| One `turnText` for previews and the search index | The review showed search excerpts still quoting whole blocks, so both read from one rendering |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| History engine suite | PASS: `Tests  142 passed (142)`, against a baseline of 140 |
| Mutation: old `previewFor` restored | `1 failed | 140 passed` |
| Build | `npm run build` exit 0 |
| Live hop `../scratch/runs/live3-pi` | PASS 5/5 on DeepSeek Flash at max thinking. Side word absent from the note, recovered through `browse` and `load` |
| Mutation: old `itemText` restored | `1 failed | 141 passed` |
| Opus medium review | no P0. The P1 (search excerpts still serialized tool-call blocks) and a P2 (a split surrogate at the cut) were fixed, and the search test was added |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A preview is cut at 160 characters.** A turn with long text shows no tool call in its preview. `load` returns the full turn.
<!-- /ANCHOR:limitations -->
