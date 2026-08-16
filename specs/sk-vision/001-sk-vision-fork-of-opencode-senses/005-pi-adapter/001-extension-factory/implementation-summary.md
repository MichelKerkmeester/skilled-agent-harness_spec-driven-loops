---
title: "Implementation Summary"
description: "Author the function default-export factory at .opencode/skills/sk-vision/pi/sk-vision.ts with 13 pi.registerTool calls. Do not symlink yet."
trigger_phrases:
  - "sk-vision pi factory"
  - "sk-vision registerTool"
  - "sk-vision ExtensionFactory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/001-extension-factory"
    last_updated_at: "2026-08-16T10:30:00.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Created pi/sk-vision.ts factory; 13 tools; copy-pack proofs passed."
    next_safe_action: "002-symlink-and-dry-factory"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-005-pi-adapter-001-extension-factory"
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
| **Spec Folder** | 001-extension-factory |
| **Completed** | 2026-08-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Created the Pi extension factory at `.opencode/skills/sk-vision/pi/sk-vision.ts`. Default export is `export default function skVision(pi: ExtensionAPI): void`. Thirteen tools register via `pi.registerTool`; `sk_vision_query` is not registered. `RuntimeClient` and `PhotonProvider` are reused from `vision-runtime/src`. Shutdown handler awaits `client.close()` on `session_shutdown`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Created | Owner ExtensionFactory with 13 tools |
| `spec.md` | Modified | Status Complete; success criteria evidence |
| `tasks.md` | Modified | T001–T008 marked with evidence |
| `plan.md` | Modified | DoD and phase checklists complete |
| `implementation-summary.md` | Modified | Delivery and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented from the copy pack in `spec.md`. Tool execute bodies call `PhotonProvider` methods (inspect branches to query when `question` is set; otherwise caption+scene+ocr). Errors return `SK_VISION_ERROR` text without crashing session start. No edits under `.pi/extensions/` in this child — load-path symlink is child `002-symlink-and-dry-factory`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep this child Level 1 | Smaller scope for a small model; copy pack lives here not on the mid-level parent |
| Stop rules in spec.md | Prevent dump edits, hub JSON, invented tools, and adapter files landing in the wrong child |
| Reuse 003 RuntimeClient + PhotonProvider | Single Python wrapper; no second runtime spawn |
| `ctx.cwd` for projectDir | Matches installed Pi 0.84.2 ExtensionContext; factory constructs provider per tool call |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Exit Code | Result |
|-------|---------|-----------|--------|
| Owner file exists | `test -f .opencode/skills/sk-vision/pi/sk-vision.ts` | 0 | Pass (404 lines) |
| Function default export | `rg 'export default function skVision' .opencode/skills/sk-vision/pi/sk-vision.ts` | 0 | Pass (line 46) |
| 13 registerTool calls | `rg -c 'pi\.registerTool' .opencode/skills/sk-vision/pi/sk-vision.ts` | 0 | Pass (13) |
| No sk_vision_query | `rg 'sk_vision_query' .opencode/skills/sk-vision/pi/sk-vision.ts` | 1 | Pass (no matches) |
| session_shutdown close | `rg 'session_shutdown' .opencode/skills/sk-vision/pi/sk-vision.ts` | 0 | Pass; `await client.close()` |
| 003 deps present | `test -f vision-runtime/src/runtime/client.ts && test -f vision-runtime/src/providers/photon.ts` | 0 | Pass |
| No .pi/extensions in this child | orchestrator gate at factory delivery | 0 | Pass; symlink deferred to 002 |
| validate.sh --strict | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/001-extension-factory --strict` | 2 | Folder RESULT: PASSED (errors=0 warnings=0); exit 2 from repo-wide hook (pre-existing, out of child scope) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Symlink and dry load not done.** Child `002-symlink-and-dry-factory` owns `.pi/extensions/sk-vision.ts`, README rows, and `pi --offline --approve`.
2. **Runtime load not exercised in Pi chat.** Factory registers tools; end-to-end Pi session proof is out of scope for this child.
<!-- /ANCHOR:limitations -->
