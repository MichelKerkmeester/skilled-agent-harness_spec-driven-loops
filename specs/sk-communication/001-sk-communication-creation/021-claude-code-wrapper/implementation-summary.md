---
title: "Implementation Summary: Phase 021 Claude Code Wrapper"
description: "Claude Code headless output is now wired through the CLI-output wrapper: a stream-json parser maps the assistant message onto the Claude adapter, projectRuntimeStream routes it through projectMessage() behind the enablement gate, and every disabled, failed, or incapable path passes the byte-exact original through."
trigger_phrases:
  - "claude-code-wrapper"
  - "claude code headless projection"
  - "stream-json adapter"
  - "Claude output projection wrapper"
  - "implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/021-claude-code-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Wired Claude Code headless output through the CLI-output wrapper."
    next_safe_action: "Proceed to phase 022 Codex wrapper wiring."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-021-claude-code-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Claude Code exposes no output-transform hook, so headless output is intercepted through the CLI-output wrapper."
      - "The interactive TUI is explicitly out of scope; only headless and print output are interceptable."
      - "The stream-json parser, the projectMessage() routing, and the fail-open fallback are implemented and test-covered."
---
# Implementation Summary: Phase 021 Claude Code Wrapper

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-claude-code-wrapper |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Claude Code is the first wrapper-target runtime wired end-to-end through the CLI-output wrapper. A headless `claude -p --output-format stream-json` capture is parsed into the Claude adapter's `message-display` envelope, routed through `projectMessage()`, and re-rendered as the projected text, with the interactive TUI explicitly out of scope and every disabled, failed, or incapable path passing the byte-exact original through.

### Stream-JSON Parser

`src/wrapper/stream-parsers/claude.ts` parses the newline-delimited stream-json capture. It concatenates assistant text from every `assistant` record's text content parts into the exact original, surfaces a terminal `error` record as an error envelope so the adapter fails open, and resolves an empty, malformed, or message-less stream to the unparsed fallback.

### Capture-Project-Render Orchestration

`src/wrapper/stream.ts` adds the shared `projectRuntimeStream` entrypoint. It parses the raw capture through the runtime's parser, then delegates to the existing `runWrapperProjection` seam, which gates on `isProjectionEnabled()` and re-renders the projection or the byte-exact original. `parseRuntimeStream`, `resolveStreamParser`, and `listStreamParsers` expose the parser registry the launcher uses.

### Launcher Capture

`bin/cli-output-wrapper.mjs` now resolves the Claude parser, captures the runtime's stdout, and parses it, replacing the prior no-parser passthrough. The projection config stays caller-supplied, so the launcher passes the assistant message through byte-exactly and reports the parse outcome.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/wrapper/types.ts` | Modified | Added the `CaptureFailureReason` union and extended `WrapperRunReasonCode` |
| `src/wrapper/stream-types.ts` | Created | Shared stream-capture types and envelope/original builders |
| `src/wrapper/stream-parsers/claude.ts` | Created | Claude headless stream-json parser |
| `src/wrapper/stream-parsers/codex.ts` | Created | Codex JSON-stream parser |
| `src/wrapper/stream-parsers/pi.ts` | Created | Pi print-mode parser |
| `src/wrapper/stream-parsers/devin.ts` | Created | Devin print-mode parser |
| `src/wrapper/stream-parsers/cursor.ts` | Created | Cursor non-interactive parser |
| `src/wrapper/stream.ts` | Created | Parser registry, `parseRuntimeStream`, and `projectRuntimeStream` |
| `src/wrapper/index.ts` | Modified | Exported the stream-capture surface |
| `bin/cli-output-wrapper.mjs` | Modified | Captures and parses the stream when projection is enabled |
| `test/wrapper/stream-helpers.ts` | Created | Shared stub-transport and config helpers |
| `test/wrapper/stream-claude.test.ts` | Created | Claude capture-project-render and fallback coverage |
| `test/wrapper/stream-codex.test.ts` | Created | Codex capture-project-render and fallback coverage |
| `test/wrapper/stream-pi.test.ts` | Created | Pi capture-project-render and fallback coverage |
| `test/wrapper/stream-devin.test.ts` | Created | Devin capture-project-render and fallback coverage |
| `test/wrapper/stream-cursor.test.ts` | Created | Cursor capture-project-render and fallback coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase consumed the CLI-output wrapper framework without modifying its contract. The stream parser reuses the pinned Claude adapter plan from `resolveWrapperRuntime`, and `projectRuntimeStream` delegates to `runWrapperProjection`, so the enablement gate, adapter mapping, and fail-open fallback all live in the already-tested seam. Verification runs the full package gate plus the new per-runtime stream tests against stub streams and a stub transport.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Parse stream-json into the adapter's `message-display` envelope | Reuses the existing Claude adapter mapping and assembler event shape without new projection logic |
| Extract the assistant text as the exact original | The projected surface is the assistant message; raw transport bytes pass through untouched when parsing fails |
| Keep the projection config caller-supplied in the launcher | Provider and policy wiring is the embedding boundary's responsibility, matching the framework contract |
| Register all five parsers in one shared registry | One consistent plug-in point serves every wrapper-target runtime without per-runtime forking |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: `npm run check` passes typecheck, build, public-import smoke, and 70/70 files, 360/360 tests |
| Claude capture-project-render | PASS: `test/wrapper/stream-claude.test.ts` projects a stream-json capture to `ship the \`release\` build today.` |
| Byte-exact fallback | PASS: disabled (`projection-disabled`), empty (`empty-stream`), malformed (`malformed-stream`), message-less (`no-assistant-message`), terminal error (`runtime-failure`), and incapable (`runtime-incapable`) paths return the exact original |
| Launcher capture smoke | PASS: `bin/cli-output-wrapper.mjs` captures and parses a stream-json line and passes it through byte-exactly |
| Phase 021 strict validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Interactive TUI is out of scope.** Only headless `claude -p --output-format stream-json` output is interceptable; the rendered TUI is never captured.
2. **One assistant message per run.** The parser normalizes one final message per invocation, matching the framework's per-message assembly.
3. **Projection config is caller-supplied.** The launcher captures and parses but passes the assistant message through byte-exactly until a provider and policy config is supplied at the embedding boundary.
<!-- /ANCHOR:limitations -->
