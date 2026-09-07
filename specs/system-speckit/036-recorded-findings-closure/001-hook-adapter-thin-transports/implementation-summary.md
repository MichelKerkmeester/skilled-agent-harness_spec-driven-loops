---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "hook adapter implementation summary"
  - "spec gate port status"
  - "adapter migration validation evidence"
  - "not started continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/001-hook-adapter-thin-transports"
    last_updated_at: "2026-09-07T18:20:00Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:fdb6ce1457fc709b96f7660a2db6387d4c8ddea1ea44bfbaa9212fa411de649d"
      session_id: "scaffold-001-hook-adapter-thin-transports"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-hook-adapter-thin-transports |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five runtime adapters each copied the same two sequences around the spec-gate core: classify, then build the delivery-observation arguments; evaluate, then append the warning-log event. Both sequences now live once in the core as `runClassifyGate()` and `runEnforceGate()`. `runClassifyGate` returns the Gate 3 question with a deferred observer, so an adapter writes its envelope first and calls `observe()` inside the write callback, which keeps the ordering the core test protects. `runEnforceGate` returns the core's verdict after recording the advisory or would-deny event. Each Node adapter keeps only what its runtime shapes, the tool map, the path extraction and the envelope, and the two pi hooks call the same two functions, which also gives pi the warning-log record it lacked.

### Adapters after the port

Claude, codex, cursor and devin each dropped from a 200-to-230-line pair to 89, 105, 86 and 92 lines. Their `shared.ts` files are lifecycle transport and were not touched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | `runClassifyGate` and `runEnforceGate` |
| `runtime/hooks/{claude,codex,cursor,devin}/spec-gate-classify.mjs` | Modified | Parse and envelope only |
| `runtime/hooks/{claude,codex,cursor,devin}/spec-gate-enforce.mjs` | Modified | Tool map, path extraction and envelope only |
| `runtime/hooks/pi/spec-gate-classify.ts`, `spec-gate-enforce.ts` | Modified | Call the same two functions |
| `runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` | Modified | Three orchestration cases; the source scan follows the observer contract |
| `runtime/hooks/README.md` | Modified | Names the shared call site |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The adapters were rewritten from one template per hook type with the runtime-specific pieces as parameters, then each runtime's own test file ran before the next runtime changed. The pi hooks changed last and the runtime build compiled them. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A deferred observer instead of observing inside the core | The core cannot know when the runtime's stdout write completed; the adapter can |
| Leave every `shared.ts` alone | They are lifecycle transport the phase's own sixth criterion protects |
| Amend the line criterion to the pair | The trio counted the lifecycle files; the lane's finding was about the gate pair |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on the nine `.mjs` files; `npm run build` in runtime | exit 0 |
| `spec-gate-claude`, `codex`, `devin`, `prebind` and core node tests | 13, 14, 15, 16 and 87 pass, 0 fail |
| Five cross-runtime vitest suites | 5 files, 151 tests pass |
| Full runtime project | 104 files, 1,260 tests pass |
| `wc -l` per runtime pair | 89, 105, 86, 92 |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The lifecycle hooks still delegate through spawnSync** That bridge is documented as deliberate and was out of scope.
2. **The pi hooks were compiled, not run live** No pi session was started; their contract is covered by the core test's source scan.
<!-- /ANCHOR:limitations -->

---
