---
title: "Implementation Plan: Phase 030 Local Provider Loader"
description: "Add a shared local-provider config loader under src/config that turns the operator's enablement.local.json localProvider block into the full projection wiring, wire the OpenCode plugin and the CLI-output wrapper bin to it, and fail closed to the exact original on any absent or malformed provider config."
trigger_phrases:
  - "local-provider-loader"
  - "implementation plan"
  - "localProvider easy config loader"
  - "local LLM auto-used"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/030-local-provider-loader"
    last_updated_at: "2026-08-14T18:00:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified the shared local-provider loader build."
    next_safe_action: "Consume the loader from operator rollout documentation when the opt-in story is written."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-030-local-provider-loader-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The loader core, the two entry-point wirings, and the fail-closed fallback are the completion evidence."
      - "Both the plugin and the wrapper resolve the same provider through the same loader."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 030 Local Provider Loader

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript loader module in the communication-projection package plus JavaScript wiring at the two entry points |
| **Framework** | The shipped `projectMessage()` and `runWrapperProjection()` entrypoints, provider presets, privacy router, and HTTP transports |
| **Storage** | The existing git-ignored `enablement.local.json`; no new persistence |
| **Testing** | Loader unit tests, a plugin/runtime projection test, a wrapper test, plugin test-suite additions, and strict packet validation |

### Overview

Add one shared loader under `src/config/` that turns the optional `localProvider` block in the operator's existing git-ignored enablement file into the full projection wiring: a local `ProviderModelRecord` from the shipped presets, a local-only privacy policy, `judgeMode: 'required'`, a concrete local HTTP transport, and a shipped copy-editing prompt. Wire the OpenCode plugin input builder and the CLI-output wrapper bin to the loader. Missing or malformed provider config fails closed to the exact-original fallback exactly as today, and `npm run check` stays fully green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The Phase 029 research first choice is read end to end and its recommendations are inventoried.
- [x] The shipped presets, privacy router, transports, and reject-only judge surfaces are located.
- [x] Both entry points and their exact-original fallback paths are inventoried.
- [x] The `localProvider` schema and the fail-closed rules are explicit.

### Definition of Done

- [x] The loader returns the full wiring for a valid config and null for absent or malformed input.
- [x] Both entry points call the loader and project when it returns a config, exact-original otherwise.
- [x] Focused tests cover the loader matrix, the plugin/runtime projection path, and the wrapper path.
- [x] `npm run check` ends fully green and Phase 030 passes strict validation with zero errors and warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One shared loader consumed by both entry points. The loader parses the git-ignored enablement file, validates the optional `localProvider` block, constructs the projection wiring from shipped presets and transports, and returns a config object or null. Each entry point calls the loader once per activation; null keeps the byte-exact original.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `parseLocalProjectionConfig` | Pure parse of the parsed file object into the full wiring or null (fail closed) |
| `buildLocalProjectionConfig` | Construct the record, policy, judge, prompt, transport, context, and capabilities from a validated provider config |
| `loadLocalProjectionConfig` | Read and parse `enablement.local.json`, then delegate to the pure core |
| Plugin input builder | Call the loader and merge the config into the `projectMessage` input |
| Wrapper bin | Call the loader after a successful parse and run the wrapper projection |
| Exact-original fallback | Both entry points keep today's byte-exact behavior when the loader returns null |

### Data Flow

`enablement.local.json` -> `loadLocalProjectionConfig()` -> validate `localProvider` -> build record/policy/judge/prompt/transport -> config or null -> entry point projects or falls back to the byte-exact original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/config/` | Enablement gate only | Add the loader and re-export it | Loader unit tests |
| Provider presets, privacy router, transports, reject-only judge | Shipped primitives | Consumed, never modified | Loader config uses them unchanged |
| OpenCode plugin | Empty provider config no-op | Call the loader and merge a non-null config | Plugin test-suite additions |
| CLI-output wrapper bin | Byte-exact passthrough | Call the loader and project when configured | Wrapper test |
| `npm run check` | Package gate | Stays green | typecheck + build + tests + import smoke |
| Packet docs | Planned state | Create Phase 030 and close it | Strict validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read the Phase 029 research end to end and freeze the `localProvider` schema.
- [x] Inventory the shipped presets, router, transports, judge, and the two entry points.
- [x] Freeze the per-kind endpoint defaults and the fail-closed rules.

### Phase 2: Implementation

- [x] Author the loader module under `src/config/` (parse, build, load) and re-export it from the barrel.
- [x] Wire the OpenCode plugin input builder to the loader with the null fallback preserved.
- [x] Wire the CLI-output wrapper bin to the loader with the byte-exact passthrough preserved.
- [x] Extend the committed enablement example to document the optional `localProvider` block.

### Phase 3: Verification

- [x] Author the loader unit tests, the plugin/runtime projection test, the wrapper test, and the plugin test-suite additions.
- [x] Run `npm run check` from the final state until fully green.
- [x] Author and close the Level-3 packet, backfill metadata, and pass strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Loader unit tests | Valid config -> full wiring per kind; absent/malformed/disabled -> null | Vitest (`test/config/local-provider.test.ts`) |
| Runtime projection test | Loader config -> `projectMessage()` projects; null -> exact original | Vitest (`test/runtime/local-provider-runtime.test.ts`) |
| Wrapper test | Loader config -> wrapper projects through `runWrapperProjection()` | Vitest (`test/wrapper/local-provider-wrapper.test.ts`) |
| Plugin test-suite additions | Injected loader config -> real plugin projects; null -> byte exact | `node --test` (`.opencode/plugins/tests/`) |
| Package gate | typecheck, build, all tests, import smoke | `npm run check` |
| Packet integrity | Phase 030 docs and generated metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 029 research design | Internal | Available from Phase 029 | The loader has no design authority |
| Shipped presets, router, transports, judge | Internal | Available | The loader cannot construct the wiring |
| `projectMessage()` and `runWrapperProjection()` | Internal | Available | The entry points cannot project |
| OpenCode plugin and wrapper bin | Internal | Available | The loader has no entry points to wire |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an entry point projects on unsafe or malformed config, a local path egresses content, or a fallback is not byte-exact.
- **Procedure**: revert the loader call at the affected entry point, restore the exact-original fallback, rerun the loader and entry-point tests, confirm `npm run check` is green, and rerun Phase 030 strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Research design and shipped surfaces -> Loader module -> Entry-point wiring -> Tests and package gate -> Packet closeout
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Research and surface inventory | Phase 029 and shipped engine | Loader module |
| Loader module | Complete inventory | Entry-point wiring |
| Entry-point wiring | Loader module | Verification |
| Verification | Wired entry points | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research and surface inventory | Low | 0.5 day |
| Loader module and entry-point wiring | Medium | 1-2 days |
| Tests, package gate, and closeout | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the exact-original fallback behavior at both entry points before wiring.
- [x] Record the shipped preset, router, transport, and judge surfaces as consumed-only.
- [x] Confirm no canonical or transcript change is planned.

### Procedure

1. Restore the loader call or entry-point wiring that regressed.
2. Rerun the loader unit tests and the affected entry-point tests.
3. Confirm `npm run check` is green and strict validation passes.
4. Refresh graph metadata and rerun strict validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert the loader and the two entry-point wirings only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 029 research
        |
        v
Enablement file -> Loader module
        |              |
        +-- presets ---+
        |              |
        v              v
Plugin wiring   Wrapper wiring
        \              /
         v            v
       Package gate + tests
                |
                v
          Packet closeout
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Loader module | Phase 029 design and shipped surfaces | The projection wiring or null | Entry-point wiring |
| Plugin wiring | Loader module | A configured `projectMessage` input or the exact-original fallback | Verification |
| Wrapper wiring | Loader module | A configured wrapper projection or byte-exact passthrough | Verification |
| Verification | Wired entry points | Green package gate and test receipts | Packet closeout |
| Packet closeout | All verification evidence | Strict conformance and graph truth | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read the design and inventory the shipped surfaces** - 0.5 day - critical.
2. **Author the loader and wire both entry points** - 1-2 days - critical.
3. **Run the tests, the package gate, and close the packet** - 1-2 days - critical.

**Parallel opportunities**:

- The loader unit tests and the entry-point wiring proceed on independent surfaces once the loader lands.
- The wrapper test and the plugin test-suite additions run independently.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Research and surface inventory confirmed | Design read and shipped surfaces recorded | Stage 1 |
| M2 | Loader and entry-point wiring complete | Loader returns the wiring or null and both entry points consume it | Stage 2 |
| M3 | Phase handoff accepted | Tests and the package gate pass and strict validation is clean | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: add one shared local-provider loader under `src/config/` that turns the operator's `localProvider` block into the full projection wiring and is consumed by both the OpenCode plugin and the CLI-output wrapper bin, failing closed to the exact original on any absent or malformed config.

**Status**: Accepted and implemented. Full rationale and alternatives are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the predecessor research handoff and the shipped surfaces before authoring the loader.
- Inventory both entry points and their exact-original fallback paths before wiring.
- Keep all writes inside the approved package, plugin, bin, and Phase 030 scopes.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order; evidence cannot precede implementation. |
| TASK-SCOPE | Modify only the package src/test, the OpenCode plugin, the wrapper bin, and this packet. |
| TASK-PROOF | Run focused checks, then rerun the authoritative package gate and strict validation from the final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=030 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If a shipped surface disagrees with the planned loader design, mark the task blocked, preserve the fail-closed exact-original behavior, and update the decision record before resuming.
