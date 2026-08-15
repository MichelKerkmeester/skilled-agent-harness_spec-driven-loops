---
title: "Implementation Summary: Phase 022 Codex Wrapper"
description: "Codex output is now wired through the CLI-output wrapper: a JSON-stream parser maps the agent message onto the Codex adapter, projectRuntimeStream routes it through projectMessage() behind the enablement gate, and every disabled, failed, or incapable path passes the byte-exact original through."
trigger_phrases:
  - "codex-wrapper"
  - "codex output projection"
  - "codex exec json stream"
  - "implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/022-codex-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Wired Codex JSON-stream output through the CLI-output wrapper."
    next_safe_action: "Proceed to phase 023 Pi wrapper wiring."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-022-codex-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Codex exposes only input, tool, and lifecycle hooks, so projection wraps the CLI process and its output stream."
      - "The JSON-stream flag is pinned from the CLI reference before the wrapper relies on it."
      - "The JSON-stream parser, the projectMessage() routing, and the fail-open fallback are implemented and test-covered."
---
# Implementation Summary: Phase 022 Codex Wrapper

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-codex-wrapper |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Codex is wired through the CLI-output wrapper. A non-interactive `codex exec --json` capture is parsed into the Codex adapter's `agent-message` envelope, routed through `projectMessage()`, and re-rendered as the projected text, with every disabled, failed, or incapable path passing the byte-exact original through.

### JSON-Stream Parser

`src/wrapper/stream-parsers/codex.ts` parses the newline-delimited JSON-stream capture. The final `agent-message` text is the assistant message; a terminal `error` event is surfaced as an error envelope so the adapter fails open; and an empty, malformed, or message-less stream resolves to the unparsed fallback.

### Capture-Project-Render Orchestration

`src/wrapper/stream.ts` adds the shared `projectRuntimeStream` entrypoint that parses the raw capture through the Codex parser and delegates to `runWrapperProjection`, which gates on `isProjectionEnabled()` and re-renders the projection or the byte-exact original.

### Launcher Capture

`bin/cli-output-wrapper.mjs` resolves the Codex parser, captures the runtime's stdout, and parses it, replacing the prior no-parser passthrough.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/wrapper/stream-parsers/codex.ts` | Created | Codex JSON-stream parser |
| `src/wrapper/stream.ts` | Created | Parser registry and `projectRuntimeStream` |
| `src/wrapper/stream-types.ts` | Created | Shared stream-capture types and builders |
| `src/wrapper/types.ts` | Modified | Added `CaptureFailureReason` and extended `WrapperRunReasonCode` |
| `src/wrapper/index.ts` | Modified | Exported the stream-capture surface |
| `bin/cli-output-wrapper.mjs` | Modified | Captures and parses the stream when projection is enabled |
| `test/wrapper/stream-codex.test.ts` | Created | Codex capture-project-render and fallback coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase consumed the CLI-output wrapper framework without modifying its contract. The parser reuses the pinned Codex adapter plan from `resolveWrapperRuntime`, and `projectRuntimeStream` delegates to `runWrapperProjection`, so the gate, adapter mapping, and fail-open fallback live in the already-tested seam. The JSON-stream flag was pinned from the CLI reference before the wrapper relied on it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Parse JSON-stream into the adapter's `agent-message` envelope | Reuses the existing Codex adapter mapping and assembler event shape |
| Extract the final agent-message text as the exact original | The projected surface is the assistant message; raw transport bytes pass through when parsing fails |
| Pin the JSON-stream flag from the CLI reference before relying on it | An assumed flag set would silently no-op or corrupt the captured stream |
| Register all five parsers in one shared registry | One consistent plug-in point serves every wrapper-target runtime |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: `npm run check` passes typecheck, build, public-import smoke, and 70/70 files, 360/360 tests |
| Codex capture-project-render | PASS: `test/wrapper/stream-codex.test.ts` projects a JSON-stream capture to `ship the \`release\` build today.` |
| Byte-exact fallback | PASS: disabled, empty, malformed, message-less, terminal error, and incapable paths return the exact original |
| Launcher capture smoke | PASS: `bin/cli-output-wrapper.mjs` captures and parses a JSON-stream line and passes it through byte-exactly |
| Phase 022 strict validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One assistant message per run.** The parser normalizes one final agent message per invocation.
2. **Projection config is caller-supplied.** The launcher captures and parses but passes the assistant message through byte-exactly until a provider and policy config is supplied at the embedding boundary.
3. **Flag pinning is a versioned input.** The JSON-stream flag is pinned to the tested CLI version and re-confirmed on upgrade.
<!-- /ANCHOR:limitations -->
