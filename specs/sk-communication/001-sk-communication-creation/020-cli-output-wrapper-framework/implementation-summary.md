---
title: "Implementation Summary: Phase 020 CLI-Output Wrapper Framework"
description: "The shared CLI-output wrapper framework is built: a parameterized entrypoint that runs the target runtime in its declared headless, stream, or print mode, captures the assistant output stream, normalizes it through the per-runtime adapters, feeds projectMessage(), and re-renders the projected text with a fail-open byte-exact original passthrough."
trigger_phrases:
  - "cli-output-wrapper-framework"
  - "implementation summary"
  - "wrapper framework"
  - "capture normalize project render"
  - "byte-exact passthrough"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/020-cli-output-wrapper-framework"
    last_updated_at: "2026-08-14T07:56:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the CLI-output wrapper framework and verified the package gate."
    next_safe_action: "Proceed to phase 021 Claude Code wrapper wiring."
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
      session_id: "phase-020-cli-output-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The parameterized wrapper, capture-normalize-project-render seam, launcher, and wrapper test suite ship and pass the package gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 020 CLI-Output Wrapper Framework

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-cli-output-wrapper-framework |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every runtime without a native output-transform hook now shares one projection seam. A single parameterized entrypoint runs the capture-normalize-project-render stage order: resolve the runtime's declared launch mode and adapter, normalize captured envelopes through the existing per-runtime adapters, gate on `isProjectionEnabled()`, feed `projectMessage()`, and re-render the projected text or pass the byte-exact original through.

### Parameterized Wrapper Entrypoint

`src/wrapper/index.ts` exports `runRuntimeWrapper(runtimeId, input)`, the single entrypoint every wrapper-target runtime uses. It resolves the runtime's plan and delegates to `runWrapperProjection`. A runtime without a declared adapter (the native-hook runtime or an unknown id) returns the byte-exact original with `runtime-incapable`.

### Runtime Registry

`src/wrapper/registry.ts` pins the declared launch mode, adapter, path, protocol, and tested versions for the five wrapper-target runtimes: Claude (`headless`), Codex (`stream`), Cursor (`stream`), Devin (`stream`), and Pi (`print`). `resolveWrapperRuntime`, `resolveWrapperLaunchMode`, and `listWrapperRuntimes` expose the plan to operators and to phases 021 through 025.

### Capture-Normalize-Project-Render Orchestrator

`src/wrapper/run.ts` owns the frozen stage order. It consults `isProjectionEnabled()` before any projection, normalizes the captured envelopes through `normalizeWrapperEnvelopes` in `src/wrapper/normalize.ts` (which reuses the per-runtime adapters read-only and fails open on any unsupported, incompatible, or terminal envelope), feeds the assembled message to `projectMessage()`, and hands the terminal to `renderWrapperTerminal` in `src/wrapper/render.ts`. Every disabled, failed, or incapable terminal returns the byte-exact original.

### Launch/Registration Pattern

`bin/cli-output-wrapper.mjs` is the executable operator launch surface. It resolves the runtime plan, reports it, and passes the target command through byte-exactly when projection is disabled, the runtime is incapable, or no per-runtime stream parser is registered yet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/wrapper/types.ts` | Created | Wrapper launch modes, plan, config, and terminal result types |
| `src/wrapper/registry.ts` | Created | Version-pinned runtime plan resolution for the five wrapper-target runtimes |
| `src/wrapper/normalize.ts` | Created | Envelope normalization through the per-runtime adapters |
| `src/wrapper/render.ts` | Created | Render seam mapping the entrypoint terminal to the wrapper result |
| `src/wrapper/run.ts` | Created | Capture-normalize-project-render orchestrator with fail-open fallback |
| `src/wrapper/index.ts` | Created | Parameterized `runRuntimeWrapper` entrypoint and public barrel |
| `src/index.ts` | Modified | Re-export the wrapper surface from the package root |
| `bin/cli-output-wrapper.mjs` | Created | Operator launch/registration executable |
| `test/wrapper/helpers.ts`, `test/wrapper/wrapper.test.ts`, `test/wrapper/failure.test.ts` | Created | Stage-order, gate-matrix, fallback, and canonical-byte coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The wrapper composes the existing package surfaces without changing any of them. It reuses the per-runtime adapters under `src/runtimes`, the `projectMessage()` entrypoint from `src/runtime`, the `isProjectionEnabled()` gate from `src/config`, and the provider transports and contracts already in the package. Verification runs the full package gate plus the strict packet validator, with new tests mirroring the existing `test/` patterns.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One wrapper entrypoint parameterized by runtime | A single seam serves every wrapper-target runtime without re-implementing projection logic per runtime |
| Reuse the per-runtime adapters for envelope normalization | Runtime-specific output mapping stays inside the adapters, not the wrapper |
| Gate on `isProjectionEnabled()` before any projection | The shared default-off gate stays the single operator control across every activation path |
| Fail open to the byte-exact original on every non-accept terminal | The wrapper never corrupts or drops the captured output, matching the fail-open contract |
| A launcher executable as the launch/registration pattern | Operators enable the wrapper through a documented invocation without manual wiring |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: `npm run check` passes typecheck, build, public-import smoke, and 65/65 files, 337/337 tests (319 prior plus 18 new wrapper tests) |
| Wrapper end-to-end | PASS: `test/wrapper/wrapper.test.ts` projects a captured Claude message through a stub transport |
| Byte-exact fallback | PASS: disabled, incapable, terminal-error, normalization-failed, entrypoint-throw, provider-error, and empty-stream branches return the exact original |
| Gate matrix | PASS: flag-on projects and calls the transport; flag-off returns `projection-disabled` without a provider call |
| Registry resolution | PASS: all five wrapper-target runtimes resolve with the correct launch mode, path, protocol, and versions |
| Canonical immutability | PASS: exact-original bytes are byte-equal before and after the pipeline |
| Launcher smoke | PASS: `bin/cli-output-wrapper.mjs --list` lists all five runtimes; disabled and incapable invocations pass through |
| Phase 020 strict validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No per-runtime stream parser is wired yet**: the launcher resolves the plan and passes the target command through byte-exactly until phases 021 through 025 register each runtime's output parser. The capture-normalize-project-render pipeline itself is complete and test-covered.
2. **One assistant message per run**: the wrapper normalizes one message's envelopes per invocation, so a full session is projected message-by-message rather than as a single buffered transform.
3. **Projection config is caller-supplied**: the wrapper accepts the context, prompt, records, policy, and capabilities as input rather than deriving them, so the runtime phases own the per-runtime provider and policy wiring.

### Post-Land Continuation

After this phase lands:

1. Wire the Claude Code runtime end-to-end in phase 021 against `runRuntimeWrapper`.
2. Register each runtime's stream parser so the launcher's capture seam projects rather than passing through.
3. Validate each runtime's exact-original fallback on its real output envelope.
<!-- /ANCHOR:limitations -->
