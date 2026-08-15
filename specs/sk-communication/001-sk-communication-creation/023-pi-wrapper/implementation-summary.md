---
title: "Implementation Summary: Phase 023 Pi Wrapper"
description: "The Pi turn_end-mutation probe returned the expected verdict that the rendered bubble cannot be mutated, so Pi is wired through the CLI-output wrapper in print mode: a print-mode parser maps the final assistant message onto the Pi adapter, projectRuntimeStream routes it through projectMessage() behind the enablement gate, and every disabled, failed, or incapable path passes the byte-exact original through."
trigger_phrases:
  - "pi-wrapper"
  - "turn_end mutation validation"
  - "pi print mode wrapper"
  - "implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/023-pi-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded the Pi verdict and wired print output through the wrapper."
    next_safe_action: "Proceed to phase 024 Devin wrapper wiring."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-023-pi-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The Pi turn_end event only reads the assistant message in-repo, so a handler cannot mutate the rendered bubble."
      - "Pi routes through the CLI-output wrapper in print mode, which surfaces the final assistant message."
      - "The print-mode parser, the projectMessage() routing, and the fail-open fallback are implemented and test-covered."
---
# Implementation Summary: Phase 023 Pi Wrapper

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-pi-wrapper |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pi's integration path is resolved and wired. The `turn_end`-mutation probe returned the expected verdict: a Pi `turn_end` handler only reads the ending assistant message in-repo and cannot mutate the rendered bubble. Pi therefore routes through the CLI-output wrapper in `pi` print mode, which surfaces the final assistant message, with the Pi runtime adapter mapping it onto the assembler event shape and every disabled, failed, or incapable path passing the byte-exact original through.

### Mutation Verdict

The recorded verdict is that `turn_end` cannot mutate the rendered bubble. Pi's native event surface is read-only at the display boundary, so the wrapper print-mode path is the single shipped integration.

### Print-Mode Parser

`src/wrapper/stream-parsers/pi.ts` parses the printed final assistant message (the entire captured text) as a `message-end` envelope. Empty output is unparsed so the wrapper passes the original through untouched.

### Capture-Project-Render Orchestration

`src/wrapper/stream.ts` adds the shared `projectRuntimeStream` entrypoint that parses the print capture through the Pi parser and delegates to `runWrapperProjection`, gating on `isProjectionEnabled()`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/wrapper/stream-parsers/pi.ts` | Created | Pi print-mode parser |
| `src/wrapper/stream.ts` | Created | Parser registry and `projectRuntimeStream` |
| `src/wrapper/stream-types.ts` | Created | Shared stream-capture types and builders |
| `src/wrapper/types.ts` | Modified | Added `CaptureFailureReason` and extended `WrapperRunReasonCode` |
| `src/wrapper/index.ts` | Modified | Exported the stream-capture surface |
| `bin/cli-output-wrapper.mjs` | Modified | Captures and parses the stream when projection is enabled |
| `test/wrapper/stream-pi.test.ts` | Created | Pi capture-project-render and fallback coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase resolved the mutation question first, then wired the single validated path. The parser reuses the pinned Pi adapter plan from `resolveWrapperRuntime`, and `projectRuntimeStream` delegates to `runWrapperProjection`, so the gate, adapter mapping, and fail-open fallback live in the already-tested seam.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship the wrapper print-mode path, not a `turn_end` extension | The probe verdict is that `turn_end` cannot mutate the rendered bubble, so the native extension path cannot project in place |
| Parse print output as the final `message-end` envelope | Reuses the existing Pi adapter mapping and assembler event shape |
| Record the verdict before wiring | Exactly one validated path ships, and the reason is traceable |
| Register all five parsers in one shared registry | One consistent plug-in point serves every wrapper-target runtime |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: `npm run check` passes typecheck, build, public-import smoke, and 70/70 files, 360/360 tests |
| Pi capture-project-render | PASS: `test/wrapper/stream-pi.test.ts` projects print output to `ship the \`release\` build today.` |
| Byte-exact fallback | PASS: disabled, empty print output, and incapable paths return the exact original |
| Launcher capture smoke | PASS: `bin/cli-output-wrapper.mjs` captures and parses print output and passes it through byte-exactly |
| Phase 023 strict validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Native `turn_end` mutation is unavailable.** The rendered Pi bubble is read-only at the display boundary, so print-mode wrapping is the only projection path.
2. **One assistant message per run.** The parser normalizes one final print message per invocation.
3. **Projection config is caller-supplied.** The launcher captures and parses but passes the assistant message through byte-exactly until a provider and policy config is supplied.
<!-- /ANCHOR:limitations -->
