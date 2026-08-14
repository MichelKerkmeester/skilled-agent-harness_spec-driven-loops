---
title: "Implementation Summary: Phase 019 OpenCode Native Plugin"
description: "The first working runtime is wired: an OpenCode plugin registers the chat.message hook, gates projection behind isProjectionEnabled() and a per-plugin kill-switch, and holds the byte-exact original in message-id keyed state for restore."
trigger_phrases:
  - "opencode-native-plugin"
  - "implementation summary"
  - "mk-communication-projection plugin"
  - "chat.message hook projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/019-opencode-native-plugin"
    last_updated_at: "2026-08-14T07:55:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented and verified the OpenCode native projection plugin."
    next_safe_action: "Run the live chat.message render confirmation as the documented manual validation step."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-019-opencode-plugin-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The plugin is built, its tests pass, and the packet validates cleanly."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 019 OpenCode Native Plugin

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-opencode-native-plugin |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The first working runtime is wired: `.opencode/plugins/mk-communication-projection.js` registers the native `chat.message` hook and, when the projection is opted in and the hook is not killed, replaces the assistant text parts with the projected text by calling the Phase 018 `projectMessage()` entrypoint. Every non-accept terminal restores the byte-exact original from message-id keyed plugin state, and any error fails open.

### Plugin

The plugin factory returns a `chat.message` hook. The handler gates first: `isHookEnabled()` (the per-plugin kill-switch) and `isProjectionEnabled()` must both pass before anything is read or mutated. It then resolves the message id, snapshots the original `output.parts` into a bounded in-memory map before any mutation, extracts the assistant text, builds the `projectMessage()` input, and calls the entrypoint. On a `projection` terminal the text parts are replaced with the projected text; on `exact-original` (or any error) the parts are left byte-identical or restored from the snapshot.

### Dual Gate and Fail-Open

Projection is gated by `isProjectionEnabled()` AND the kill-switch. The enablement gate is the package's `isProjectionEnabled()` (default-off, env or git-ignored local file). The kill-switch is `MK_COMMUNICATION_PROJECTION_DISABLED=1`, an operator control that disables the hook class without touching the enablement file. Every path is fail-open: a disabled gate, a missing or malformed `output.parts`, a non-accept projection, or a thrown error all leave the original parts untouched and nothing is thrown into the session. The plugin never writes stdout or stderr.

### Message-Id Snapshot for Byte-Exact Restore

A bounded, oldest-first-evicted map keyed by message id holds the original parts. A repeat invocation for an already-handled message restores the original rather than projecting the projected text a second time. Reads return a fresh clone, so the stored original can never be mutated through the caller.

### Kill-Switch Deviation

The phase plan references a shared `isHookEnabled(concern)` kill-switch module, but no such module exists in the repository (grep of the whole tree returns only this packet's own docs). The plugin implements the hook kill-switch inline as `MK_COMMUNICATION_PROJECTION_DISABLED`, matching the existing per-plugin `MK_*_DISABLED` convention used by `mk-spec-gate`, `mk-speckit-completion`, and `mk-post-edit-quality`. The concern name `communication-projection` is retained for parity with the shared surface the plan assumed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-communication-projection.js` | Created | OpenCode plugin registering the `chat.message` hook with the dual gate, snapshot map, and `projectMessage()` call |
| `.opencode/plugins/tests/mk-communication-projection.test.cjs` | Created | Regression suite covering the gate matrix, restore, snapshot lifecycle, and boundary |
| `019-opencode-native-plugin/` | Completed | Recorded the Level-3 packet with evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The plugin imports `projectMessage`, `isProjectionEnabled`, and `createExactOriginalRecord` directly from the built package at `.opencode/skills/sk-communication/cli-communication-projection/dist/index.js`, mirroring how the existing plugins import their shared cores by path. The hook logic lives in an injectable `createProjectionCore({ projectMessage, isProjectionEnabled, isHookEnabled })` factory so the gate and restore behavior is testable without booting the host or a live provider; the pure part helpers and the input builder are exposed on the default export's `__test` surface, matching the `createCorrelationMap` pattern in `mk-post-edit-quality.js`. The `chat.message` hook in the factory simply forwards to that core.

The input builder translates the current message faithfully: the exact text bytes become an `ExactOriginalRecord`, a completed assistant-message event envelope is assembled, and a context with `transcript: null` and `noContextFallback: 'exact-original'` is supplied. Because the `chat.message` seam exposes only the current message (no transcript), projection conservatively falls back to the byte-exact original rather than rewriting without context; provider and prompt configuration is empty until a later seam supplies the transcript and a confirmed provider route.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Adopt the native `chat.message` hook as the seam | OpenCode is the only runtime with a native output-transform hook; it proves the projection first |
| Hold the original parts in message-id keyed state | The stored session message is mutated, so the original must live elsewhere for byte-exact restore |
| Gate on `isProjectionEnabled()` AND a per-plugin kill-switch | Operators can stop the hook class without touching the enablement file |
| Fall back to the exact original with no transcript at this seam | No bounded context can be selected from a single message, so projection stays a no-op until a later seam supplies the transcript |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plugin regression suite | PASS: `node --test .opencode/plugins/tests/mk-communication-projection.test.cjs` — 17/17 tests |
| Full plugin suite baseline | PASS (scoped): the new file is green; the full `node --test .opencode/plugins/tests/*.test.cjs` shows 12 pre-existing failures in `session-cleanup`, `mk-spec-gate`, `mk-dist-freshness-guard`, and `speckit-goal-offer-contract` that predate this phase and do not touch the projection plugin |
| Package gate | PASS: `cd .opencode/skills/sk-communication/cli-communication-projection && npm run check` — typecheck, build, 65/65 files, 337/337 tests, public-import smoke |
| Gate matrix | PASS: enablement off and kill-switch on both skip `projectMessage()` and leave parts untouched |
| Byte-exact restore | PASS: error, thrown, exact-original, and repeat-invoke paths all leave or restore the original parts byte-identically |
| No terminal output | PASS: console capture around a hook invoke records nothing |
| Phase 019 strict validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live render is a manual step.** Whether a mutated `chat.message` part renders visibly in the OpenCode chat bubble requires a live OpenCode session and cannot be unit-tested. This is a documented manual validation step, not a blocker: the plugin and its fail-open behavior are fully unit-tested, and the canonical original is always recoverable from the snapshot.

2. **No transcript at this seam.** The `chat.message` hook exposes only the current message, so bounded-context selection resolves to absent and projection falls back to the byte-exact original in production until a later phase supplies the transcript and a confirmed provider route.

3. **Provider configuration is empty.** The input carries no provider records, prompt profile, or privacy policy; projection runs only once those are supplied by the capability-and-privacy-gating phase.

### Manual Validation Step

To confirm the live render, run an OpenCode session with `COMMUNICATION_PROJECTION_ENABLED=1` (and `MK_COMMUNICATION_PROJECTION_DISABLED` unset), send a message, and observe whether the assistant text in the chat bubble renders as the projection or the original. With the flag off, or with the kill-switch set, the original must render byte-identically.

### Post-Land Continuation

After this phase lands:

1. Confirm the live `chat.message` render as the manual validation step.
2. Wire the transcript, provider, and privacy configuration at a later seam so a projection can actually render.
3. Reuse the same snapshot and gate model for the wrapper-based runtimes in the following phases.
<!-- /ANCHOR:limitations -->
