---
title: "Implementation Summary: Phase 025 Cursor Output Wrapper"
description: "Cursor output is now wired through the CLI-output wrapper: a non-interactive cursor-agent stdout parser maps the rendered assistant message onto the Cursor adapter, projectRuntimeStream routes it through projectMessage() behind the enablement gate, and every disabled, failed, or incapable path passes the byte-exact original through."
trigger_phrases:
  - "cursor-wrapper"
  - "cursor output wrapper"
  - "cursor-agent stdout projection"
  - "implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/025-cursor-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Wired cursor-agent stdout through the CLI-output wrapper."
    next_safe_action: "Proceed to phase 026 capability and privacy gating."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-cursor-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cursor exposes only input, tool, and lifecycle hooks, so it must route through the CLI-output wrapper."
      - "The cursor-agent non-interactive print flag is confirmed from the CLI before the wrapper relies on it."
      - "The non-interactive stdout parser, the projectMessage() routing, and the fail-open fallback are implemented and test-covered."
---
# Implementation Summary: Phase 025 Cursor Output Wrapper

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-cursor-wrapper |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Cursor is wired through the CLI-output wrapper as the last supported runtime with no native output-transform hook. A non-interactive `cursor-agent` stdout capture is parsed into the Cursor adapter's `agent-message-chunk` envelope, routed through `projectMessage()`, and re-rendered as the projected text, with every disabled, failed, or incapable path passing the byte-exact original through.

### Non-Interactive Parser

`src/wrapper/stream-parsers/cursor.ts` parses the rendered assistant message (the entire captured stdout) as a final `agent-message-chunk` envelope. Empty stdout is unparsed so the wrapper passes the original through untouched.

### Capture-Project-Render Orchestration

`src/wrapper/stream.ts` adds the shared `projectRuntimeStream` entrypoint that parses the stdout capture through the Cursor parser and delegates to `runWrapperProjection`, gating on `isProjectionEnabled()`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/wrapper/stream-parsers/cursor.ts` | Created | Cursor non-interactive parser |
| `src/wrapper/stream.ts` | Created | Parser registry and `projectRuntimeStream` |
| `src/wrapper/stream-types.ts` | Created | Shared stream-capture types and builders |
| `src/wrapper/types.ts` | Modified | Added `CaptureFailureReason` and extended `WrapperRunReasonCode` |
| `src/wrapper/index.ts` | Modified | Exported the stream-capture surface |
| `bin/cli-output-wrapper.mjs` | Modified | Captures and parses the stream when projection is enabled |
| `test/wrapper/stream-cursor.test.ts` | Created | Cursor capture-project-render and fallback coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase consumed the CLI-output wrapper framework without modifying its contract. The parser reuses the pinned Cursor adapter plan from `resolveWrapperRuntime`, and `projectRuntimeStream` delegates to `runWrapperProjection`, so the gate, adapter mapping, and fail-open fallback live in the already-tested seam.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Parse non-interactive stdout as a final `agent-message-chunk` | Reuses the existing Cursor adapter mapping and assembler event shape |
| Extract the rendered stdout as the exact original | The projected surface is the assistant message; raw bytes pass through when parsing fails |
| Confirm the non-interactive print flag from the CLI | An assumed flag would silently no-op or corrupt the capture |
| Register all five parsers in one shared registry | One consistent plug-in point serves every wrapper-target runtime |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: `npm run check` passes typecheck, build, public-import smoke, and 70/70 files, 360/360 tests |
| Cursor capture-project-render | PASS: `test/wrapper/stream-cursor.test.ts` projects stdout to `ship the \`release\` build today.` |
| Byte-exact fallback | PASS: disabled and empty-stdout paths return the exact original |
| Launcher capture smoke | PASS: `bin/cli-output-wrapper.mjs` captures and parses stdout and passes it through byte-exactly |
| Phase 025 strict validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One assistant message per run.** The parser normalizes one rendered message per invocation.
2. **Projection config is caller-supplied.** The launcher captures and parses but passes the assistant message through byte-exactly until a provider and policy config is supplied.
3. **The print flag is a versioned input.** The non-interactive flag is re-confirmed from the CLI on upgrade.
<!-- /ANCHOR:limitations -->
