---
title: "Implementation Summary: sk-vision 004 opencode adapter"
description: "This child will add a real-file OpenCode plugin at .opencode/plugins/sk-vision.js with 2s auto-inspect grace."
trigger_phrases:
  - "sk-vision opencode summary"
importance_tier: "important"
contextType: "summary"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter"
    last_updated_at: "2026-08-16T07:10:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Noted copy pack in spec.md; plugin file not delivered."
    next_safe_action: "Wait for 003 dist/plugin.js; then author plugin."
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-004-opencode-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-vision 004 opencode adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-opencode-adapter |
| **Completed** | Not yet |
| **Level** | 2 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This child will add `.opencode/plugins/sk-vision.js` as a **real file** after 003 emits `dist/plugin.js`. The plugin file does not exist yet. Use the spec.md re-export bytes. Do not symlink. Do not edit `opencode.json`.

### Plugin Discovery Loader
This child will author a regular file analog to `.opencode/plugins/mk-communication-projection.js`, importing `../skills/sk-vision/vision-runtime/dist/plugin.js`. `test ! -L` must pass.

### Auto-Inspect Configuration
This child will restore dump hooks `event`, `chat.message`, `tool`, and `dispose`. Auto-inspect injects `<SK-VISION>` within 2000ms and never awaits the full GPU run.

### Tools
This child will register: `sk_vision_inspect`, `sk_vision_detect`, `sk_vision_point`, `sk_vision_ocr`, `sk_vision_status`, `sk_vision_segment`, `sk_vision_metadata`, `sk_vision_crop`, `sk_vision_zoom`, `sk_vision_colors`, `sk_vision_diff`, `sk_vision_annotate`, `sk_vision_reverse`. No `sk_vision_query`. No repo-root `opencode.json` plugin array.

### Files This Child Will Create
| File | Description |
|------|-------------|
| `.opencode/plugins/sk-vision.js` | Real-file OpenCode plugin entry |
| `.opencode/plugins/README.md` | Inventory row and config keys |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Close this child only after `test ! -L` passes, the 13 tools register, and `opencode.json` gained no plugin array.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Real File Export: OpenCode plugins in this repo are real JS adapters, not symlinks.
- Auto-Discovery: directory scan only; do not edit repo-root `opencode.json`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate / Check | Target | Result |
|--------------|--------|--------|
| Real-file check | `test -f && test ! -L` | Not run |
| Tool names | 13 dump `sk_vision_*` | Not registered |
| Spec Validation | `validate.sh --strict` on this child | Pending implementation close |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Blocked on `003-runtime-fork` `dist/plugin.js`.
- Pi extension adapter is deferred to `005-pi-adapter`.
<!-- /ANCHOR:limitations -->
