---
title: "Implementation Summary: sk-vision 005 pi adapter"
description: "This child will author a Pi ExtensionFactory in the skill tree and relative-symlink it into .pi/extensions/."
trigger_phrases:
  - "sk-vision pi summary"
importance_tier: "important"
contextType: "summary"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter"
    last_updated_at: "2026-08-15T17:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Rewrote planned delivery claims; 13 tools fail-closed."
    next_safe_action: "Wait for 003 core; then author pi/sk-vision.ts."
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-005-pi-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-vision 005 pi adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-pi-adapter |
| **Completed** | Not yet |
| **Level** | 2 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This child will add a native Pi adapter after 003 provides RuntimeClient. The owner file and symlink do not exist yet. `004` is not a code dependency.

### Native Extension Factory
This child will author `.opencode/skills/sk-vision/pi/sk-vision.ts` exporting a valid `ExtensionFactory`. Invalid default export fail-closes the Pi session. Tools register through `pi.registerTool`: `sk_vision_inspect`, `sk_vision_detect`, `sk_vision_point`, `sk_vision_ocr`, `sk_vision_status`, `sk_vision_segment`, `sk_vision_metadata`, `sk_vision_crop`, `sk_vision_zoom`, `sk_vision_colors`, `sk_vision_diff`, `sk_vision_annotate`, `sk_vision_reverse`. Do not invent `sk_vision_query`.

### Relative Symlink Integration
This child will create `.pi/extensions/sk-vision.ts` → `../../.opencode/skills/sk-vision/pi/sk-vision.ts`, analog to `git-preflight-advisory.ts`.

### Files This Child Will Create
| File | Description |
|------|-------------|
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Owner factory and 13 tool registrations |
| `.pi/extensions/sk-vision.ts` | Relative symlink |
| `.pi/extensions/README.md` | Inventory row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Close this child only after `pi --offline --approve` starts without fail-closed, `readlink` is the relative owner path, and the 13 tools register. Optional `input.images` 2s grace, or record the unproven-paste gap.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Skill-Owned Source: canonical file lives in the skill tree; `.pi/extensions/` holds a relative symlink.
- Direct Tool Registration: `pi.registerTool` is primary. MCP and bash JSON-RPC stay fallbacks.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate / Check | Target | Result |
|--------------|--------|--------|
| Symlink Resolution | `readlink` relative owner path | Not created |
| Dry Factory | `pi --offline --approve` | Not run |
| Tool names | 13 dump `sk_vision_*` | Not registered |
| Spec Validation | `validate.sh --strict` on this child | Pending implementation close |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Blocked on `003-runtime-fork` RuntimeClient.
- Live image-paste auto-inspect on Pi may stay unproven; record the gap if so.
- Path-tool execute requires GPU; SKIP live execute when 003 recorded SKIP.
<!-- /ANCHOR:limitations -->
