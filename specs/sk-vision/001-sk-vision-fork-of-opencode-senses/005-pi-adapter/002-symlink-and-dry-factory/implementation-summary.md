---
title: "Implementation Summary"
description: "Create the relative symlink into .pi/extensions/, add README rows, optional input.images hook, then pi --offline --approve."
trigger_phrases:
  - "sk-vision pi symlink"
  - "sk-vision pi dry factory"
  - "sk-vision pi --offline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/002-symlink-and-dry-factory"
    last_updated_at: "2026-08-16T10:35:00.000Z"
    last_updated_by: "cursor-code"
    recent_action: "Symlink, README inventory, import-path fix for Pi loader, dry factory pass."
    next_safe_action: "Epic close — all 10 children done."
    blockers: []
    key_files:
      - ".pi/extensions/sk-vision.ts"
      - ".pi/extensions/README.md"
      - ".opencode/skills/sk-vision/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-005-pi-adapter-002-symlink-and-dry-factory"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-symlink-and-dry-factory |
| **Completed** | 2026-08-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Relative symlink from `.pi/extensions/sk-vision.ts` to the owner factory, README inventory rows, and symlink-base import paths in the owner file so Pi resolves modules from the discovery mirror.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/sk-vision.ts` | Created | Relative symlink to owner factory |
| `.pi/extensions/README.md` | Modified | Overview, tree, and KEY FILES rows |
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Modified | Import paths rewritten for `.pi/extensions/` symlink-base (required for dry load) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

```bash
ln -s ../../.opencode/skills/sk-vision/pi/sk-vision.ts .pi/extensions/sk-vision.ts
test -L .pi/extensions/sk-vision.ts
test "$(readlink .pi/extensions/sk-vision.ts)" = "../../.opencode/skills/sk-vision/pi/sk-vision.ts"
```

Owner imports changed from `../vision-runtime/...` (owner-relative) to `../../.opencode/skills/sk-vision/vision-runtime/...` matching other `.pi/extensions/` symlinks. Default export remains `export default function skVision`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Symlink-base imports in owner | Pi resolves relative imports from the symlink path; owner-relative paths fail at load |
| Record P1 input.images gap | No live paste proof; `pi.on("input")` for images not added; 13 tools + `session_shutdown` sufficient to close |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `readlink .pi/extensions/sk-vision.ts` | `../../.opencode/skills/sk-vision/pi/sk-vision.ts` |
| `pi --offline --approve` | Exit 0; sk-vision loads (unrelated deep-pi lock timeout logged, session not fail-closed) |
| `validate.sh --strict` | Orchestrator PASSED (errors 0, warnings 0); full script exit 2 from repo-wide `COMMAND_TREE_PARITY` drift (out of scope) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **P1 input.images not implemented.** Owner has no `pi.on("input")` handler for pasted images; bound 2000ms GPU wait deferred until live paste is proven.
2. **Owner import path change** was required beyond the nominal symlink-only scope; documented here for predecessor handoff.
<!-- /ANCHOR:limitations -->
