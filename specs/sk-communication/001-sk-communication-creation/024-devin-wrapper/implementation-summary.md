---
title: "Implementation Summary: Phase 024 Devin Wrapper"
description: "Devin output is now wired through the CLI-output wrapper: a `devin -p` print-mode parser maps the single printed assistant message onto the Devin adapter, projectRuntimeStream routes it through projectMessage() behind the enablement gate, and every disabled, failed, or incapable path passes the byte-exact original through."
trigger_phrases:
  - "devin-wrapper"
  - "devin -p print projection"
  - "devin runtime adapter wiring"
  - "implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/024-devin-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Wired Devin print output through the CLI-output wrapper."
    next_safe_action: "Proceed to phase 025 Cursor wrapper wiring."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-024-devin-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Devin exposes only input, tool, and session-lifecycle hooks, so the CLI-output wrapper is the only integration path."
      - "A `devin -p` run is single-turn, non-interactive, and prints the final assistant message."
      - "The print-mode parser, the projectMessage() routing, and the fail-open fallback are implemented and test-covered."
---
# Implementation Summary: Phase 024 Devin Wrapper

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-devin-wrapper |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Devin is wired through the CLI-output wrapper. A non-interactive `devin -p` capture is parsed into the Devin adapter's `agent-message-chunk` envelope, routed through `projectMessage()`, and re-rendered as the projected text, with every disabled, failed, or incapable path passing the byte-exact original through.

### Print-Mode Parser

`src/wrapper/stream-parsers/devin.ts` parses the single printed assistant message (the entire captured text) as a final `agent-message-chunk` envelope. Empty output is unparsed so the wrapper passes the original through untouched.

### Capture-Project-Render Orchestration

`src/wrapper/stream.ts` adds the shared `projectRuntimeStream` entrypoint that parses the print capture through the Devin parser and delegates to `runWrapperProjection`, gating on `isProjectionEnabled()`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/wrapper/stream-parsers/devin.ts` | Created | Devin print-mode parser |
| `src/wrapper/stream.ts` | Created | Parser registry and `projectRuntimeStream` |
| `src/wrapper/stream-types.ts` | Created | Shared stream-capture types and builders |
| `src/wrapper/types.ts` | Modified | Added `CaptureFailureReason` and extended `WrapperRunReasonCode` |
| `src/wrapper/index.ts` | Modified | Exported the stream-capture surface |
| `bin/cli-output-wrapper.mjs` | Modified | Captures and parses the stream when projection is enabled |
| `test/wrapper/stream-devin.test.ts` | Created | Devin capture-project-render and fallback coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase consumed the CLI-output wrapper framework without modifying its contract. The parser reuses the pinned Devin adapter plan from `resolveWrapperRuntime`, and `projectRuntimeStream` delegates to `runWrapperProjection`, so the gate, adapter mapping, and fail-open fallback live in the already-tested seam.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Parse `devin -p` print output as a final `agent-message-chunk` | Reuses the existing Devin adapter mapping and assembler event shape |
| Extract the printed text as the exact original | The projected surface is the assistant message; raw bytes pass through when parsing fails |
| Register all five parsers in one shared registry | One consistent plug-in point serves every wrapper-target runtime |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: `npm run check` passes typecheck, build, public-import smoke, and 70/70 files, 360/360 tests |
| Devin capture-project-render | PASS: `test/wrapper/stream-devin.test.ts` projects print output to `ship the \`release\` build today.` |
| Byte-exact fallback | PASS: disabled and empty-output paths return the exact original |
| Launcher capture smoke | PASS: `bin/cli-output-wrapper.mjs` captures and parses print output and passes it through byte-exactly |
| Phase 024 strict validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One assistant message per run.** The parser normalizes one final print message per invocation.
2. **Projection config is caller-supplied.** The launcher captures and parses but passes the assistant message through byte-exactly until a provider and policy config is supplied.
3. **Single-turn print behaviour is a versioned input.** The `devin -p` shape is re-confirmed from the CLI on upgrade.
<!-- /ANCHOR:limitations -->
