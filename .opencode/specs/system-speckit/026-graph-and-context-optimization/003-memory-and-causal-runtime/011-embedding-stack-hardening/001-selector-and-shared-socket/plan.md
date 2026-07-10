---
title: "Implementation Plan: Selector fix + shared socket + client resilience"
description: "Swap the hf-local selector probe to /api/health, delete the stale Python import probe and docs, pin a shared HF_EMBED_SERVER_URL in .mcp.json and opencode.json, retry transient ECONNRESET/EPIPE resets, and make the readiness-timeout message actionable."
trigger_phrases:
  - "selector shared socket plan"
  - "hf-local selector fix implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/001-selector-and-shared-socket"
    last_updated_at: "2026-05-29T15:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Delivered; selector + 5-runtime socket + resilience; review fixes; 38 tests green"
    next_safe_action: "Phase 002: server-liveness & supervision hardening"
    blockers: []
    key_files:
      - "shared/embeddings/auto-select.ts"
      - "shared/embeddings/providers/hf-local.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003112"
      session_id: "031-001-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Selector fix + shared socket + client resilience

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (shared + mcp-server), JSON config, Markdown docs |
| **Framework** | system-spec-kit embeddings auto-select + hf-local HTTP client |
| **Storage** | UDS socket path under `/tmp/mk-hf-embed/` |
| **Testing** | vitest plus focused tsc and stale-symbol grep |

### Overview
Foundation phase: make the selector probe the working pure-Node `/api/health` endpoint, pin one shared socket both launchers resolve, and harden the client so transient resets retry and timeout failures are actionable. Reuse the shipped `HfLocalProvider.canLoad` probe instead of inventing a new one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Predecessor: None — foundation phase)

### Definition of Done
- [x] All P0 acceptance criteria met
- [x] Focused tests and static checks for this phase pass
- [x] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Probe-reuse + config-pin: adapt the existing `/api/health` `canLoad` probe into the selector cascade, pin a single canonical socket in both launcher configs, and add narrow client resilience around transient resets and timeout messaging.

### Key Components
- Rewrite `probeHfLocal` (`auto-select.ts:435-449`) to call `HfLocalProvider.canLoad` and map `{available, reason}` to `ProbeOutcome`.
- Delete `defaultPythonImportProbe` (236-249), the `runPythonImportProbe` option (473), and the `ProbeContext` Python field; update the cascade comment (477-479).
- Pin `HF_EMBED_SERVER_URL=unix:///tmp/mk-hf-embed/hf-embed.sock` in both env blocks of `.mcp.json` + `opencode.json`.
- Add `ECONNRESET`/`EPIPE` to `isRetryableReadinessError` (`hf-local.ts:452-455`).
- Branch the `waitForReady` final throw (`hf-local.ts:647-650`) on the last observed loading marker (`isLoadingResponse` @619-620, captured in `lastError`).

### Data Flow
auto-select cascade -> `probeHfLocal` -> `HfLocalProvider.canLoad` probes `/api/health` -> hf-local selected when reachable; both launchers resolve the pinned `HF_EMBED_SERVER_URL` first; the client retries `ECONNRESET`/`EPIPE` and, on final timeout, branches its message on whether the last health response was a loading state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/embeddings/auto-select.ts` | Phase surface | Rewrite `probeHfLocal` to `/api/health`; delete Python probe + option + field; update cascade comment | focused phase tests/static checks |
| `shared/embeddings/providers/hf-local.ts` | Phase surface | Retry `ECONNRESET`/`EPIPE`; branch `waitForReady` final throw | focused phase tests/static checks |
| `.mcp.json` | Phase surface | Pin `HF_EMBED_SERVER_URL` in both env blocks; fix `_NOTE_3_PROVIDERS` | static config diff + grep |
| `opencode.json` | Phase surface | Pin `HF_EMBED_SERVER_URL` in both env blocks | static config diff + grep |
| `INSTALL_GUIDE.md / embedder_architecture.md` | Phase surface | Remove stale Python/sentence-transformers selector docs | doc grep |

Inventory: use targeted `rg` for `probeHfLocal`, `defaultPythonImportProbe`, `runPythonImportProbe`, `HF_EMBED_SERVER_URL`, and `isRetryableReadinessError` before editing. Invariant: a Node-only machine with the server reachable selects hf-local.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm this is the foundation phase (Predecessor: None)
- [x] Inventory affected symbols and tests before editing

### Phase 2: Core Implementation
- [x] Rewrite `probeHfLocal` to call `HfLocalProvider.canLoad` (`/api/health`) [REQ-001]
- [x] Delete `defaultPythonImportProbe`, the `runPythonImportProbe` option, and the `ProbeContext` field; update the cascade comment [REQ-002]
- [x] Pin `HF_EMBED_SERVER_URL` in both env blocks of all 5 runtime configs [REQ-003]
- [x] Add `ECONNRESET`/`EPIPE` to `isRetryableReadinessError` + bounded embed-POST retry (review fix) [REQ-004]
- [x] Branch the `waitForReady` final throw on the last observed state [REQ-005]

### Phase 3: Verification
- [x] Fix stale Python/sentence-transformers selector docs [REQ-006]
- [x] Confirm the pinned socket path stays under the macOS `sun_path` limit and resolves first [REQ-007]
- [x] Add reset-retry + readiness-message regression tests (review fix)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `probeHfLocal` selects hf-local when `/api/health` is reachable and Python is absent; retry classification | vitest |
| Integration | auto-select cascade end to end across the touched surfaces | vitest |
| Static | imports, removed-symbol grep, and TypeScript safety (shared + mcp-server tsc) | rg + tsc |
| Manual | only if socket resolution cannot be fully verified headless | local launcher session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 029 hf-local HTTP client + `/api/health` probe | Internal | Shipped | The new selector reuses `canLoad`; absent it there is no probe to call |
| Predecessor: None | Internal | N/A | Foundation phase; nothing precedes it |
| Focused test harness | Internal | Yellow | Phase cannot be claimed complete without behavior coverage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The probe rewrite or shared-socket pin regresses selection, config resolution, or client behavior.
- **Procedure**: Revert this phase's scoped files only; the Python probe deletion and config pins are independent edits that can be reverted individually without affecting later phases.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
