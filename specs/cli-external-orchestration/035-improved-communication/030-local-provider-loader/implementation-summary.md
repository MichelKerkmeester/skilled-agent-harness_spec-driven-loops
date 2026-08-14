---
title: "Implementation Summary: Phase 030 Local Provider Loader"
description: "A shared local-provider loader under src/config turns the operator's enablement.local.json localProvider block into the full projection wiring, and both the OpenCode plugin and the CLI-output wrapper bin consume it so a configured local model projects automatically while absent or malformed config fails closed to the exact original."
trigger_phrases:
  - "local-provider-loader"
  - "local provider loader implementation"
  - "localProvider easy config complete"
  - "implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/030-local-provider-loader"
    last_updated_at: "2026-08-14T18:00:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified the shared local-provider loader and both entry-point wirings."
    next_safe_action: "Consume the loader from operator rollout documentation when the opt-in story is written."
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
      session_id: "phase-030-local-provider-loader-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "One shared loader under src/config turns the operator's localProvider block into the full projection wiring."
      - "Both entry points consume the loader and project when it returns a config, exact-original otherwise; npm run check ends fully green."
---
# Implementation Summary: Phase 030 Local Provider Loader

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-local-provider-loader |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`src/config/local-provider.ts` reads the operator's existing git-ignored `enablement.local.json` and turns its optional `localProvider` block (`kind`, `model`, optional `endpoint`) into the full projection wiring: a local `ProviderModelRecord` built from the shipped presets (Ollama for `ollama`, llama-cpp for `lmstudio` / `llama.cpp` / `openai-compatible` with per-kind default endpoints), a local-only privacy policy (`egressConsent: false`, loopback-derived allow classes), `judgeMode: 'required'`, a concrete local HTTP transport (`createDefaultProviderTransport()`), a shipped copy-editing prompt, and a rewrite-without-context context. Prompt-control capabilities are confirmed through the shipped snapshot-merge path so controls compile. The pure parse/build core is deterministic and network-free, and absent, malformed, unknown-kind, missing-model, or invalid-endpoint config fails closed to null.

`.opencode/plugins/mk-communication-projection.js` and `bin/cli-output-wrapper.mjs` both call `loadLocalProjectionConfig()`. A non-null config supplies the projection input (the plugin merges it into `buildProjectionInput` and switches the context fallback to rewrite-without-context; the wrapper runs `runWrapperProjection` with the config). A null config keeps each entry point's exact-original fallback byte-identical to today, with snapshot/restore, fail-open, and no stdout/stderr preserved.

### Files Delivered

| File | Purpose |
|------|---------|
| `src/config/local-provider.ts` | Shared loader: parse, build, and load the local-provider projection wiring |
| `src/config/index.ts` | Re-export the loader from the package barrel |
| `enablement.local.json.example` | Document the optional `localProvider` block while staying disabled by default |
| `.opencode/plugins/mk-communication-projection.js` | Plugin input builder calls the loader; null keeps the exact-original fallback |
| `bin/cli-output-wrapper.mjs` | Wrapper bin calls the loader and projects when configured, byte-exact otherwise |
| `test/config/local-provider.test.ts` | Loader unit tests: valid wiring, per-kind mapping, fail-closed matrix |
| `test/runtime/local-provider-runtime.test.ts` | Plugin/runtime projection tests: projects, judge required, hosted deny, null fallback, canonical bytes |
| `test/wrapper/local-provider-wrapper.test.ts` | Wrapper tests: projects, provider failure, disabled passthrough |
| `.opencode/plugins/tests/mk-communication-projection.test.cjs` | Plugin loader-path cases: injected config projects, null is byte-exact |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reuses the shipped presets, privacy router, transports, and reject-only judge; no new provider path, adapter, judge, or hosted default was invented. The loader is the single construction seam both entry points consume, so the plugin and wrapper resolve the same record, policy, judge, prompt, and endpoint from the same file. The capability-confirming snapshot-merge follows the package's own test-helper pattern so prompt controls compile against the preset records.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Add one shared loader consumed by both entry points | Accepted | One construction seam for the plugin and wrapper |
| ADR-002 | Fail closed to the exact original on absent or malformed provider config | Accepted | No unproven provider can project and nothing throws |
| ADR-003 | Default the local path to local-only privacy with a required judge | Accepted | No egress and no skipped meaning checks |

See `decision-record.md` for rationale and alternatives.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Loader unit tests | PASS: `test/config/local-provider.test.ts` covers the full wiring, per-kind mapping, endpoint privacy-class derivation, and the fail-closed matrix |
| Plugin/runtime projection | PASS: `test/runtime/local-provider-runtime.test.ts` projects the rewritten text, rejects meaning loss, denies a hosted record before any call, and keeps the null fallback byte-exact |
| Wrapper projection | PASS: `test/wrapper/local-provider-wrapper.test.ts` projects through the wrapper seam and fails open on provider failure |
| Plugin suite | PASS: `node --test .opencode/plugins/tests/mk-communication-projection.test.cjs` — 19/19 tests |
| Package gate | PASS: `npm run check`; `Test Files  76 passed (76)` and `Tests  406 passed (406)`; typecheck, build, and import smoke passed |
| Phase 030 strict validation | PASS: `Errors: 0  Warnings: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

The plugin seam exposes only the current message with no transcript, so a loader config also switches the plugin context fallback from `exact-original` to `rewrite-without-context`. This is the smallest change that lets a configured local provider actually project at the plugin seam; the null path keeps `exact-original` exactly as today. The `loadLocalProjectionConfig()` file-path null behavior is covered by the pure parse matrix and a no-throw test rather than an environment-dependent file assertion, mirroring the enablement gate's own test discipline.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The loader stamps a bounded 7-day capability-expiry window and confirms prompt-control support on the operator's behalf, so a model that genuinely lacks temperature control could still compile its request and fail at the endpoint instead of before the call. The rank-2 environment-variable overlays remain a documented later option.
<!-- /ANCHOR:limitations -->
