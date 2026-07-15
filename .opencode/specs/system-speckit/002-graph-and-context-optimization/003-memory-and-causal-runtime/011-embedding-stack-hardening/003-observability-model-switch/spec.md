---
title: "Feature Specification: Observability + safe model-switch + cold-start timeout"
description: "Add a read-only /doctor embeddings route and embedder_status surface, a safe model-switch path (HF_EMBEDDINGS_MODEL allowlist + 404 loadedModel surfacing + dim-drift warning), and align the client/server cold-start timeouts with first-embed download docs."
trigger_phrases:
  - "doctor embeddings read-only observability"
  - "safe model switch dim drift warn"
  - "cold-start timeout alignment 45s 120s"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/003-observability-model-switch"
    last_updated_at: "2026-05-29T16:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped 003 observability + model-switch + cold-start; verified, reviewed, fixed"
    next_safe_action: "Begin phase 004 perf measure-first"
    blockers: []
    key_files:
      - "mcp_server/handlers/embedder-status.ts"
      - "shared/embeddings/providers/hf-local.ts"
      - "shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003131"
      session_id: "031-003-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Predecessor: 002-server-liveness-supervision (status surface reuses the new health fields)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Observability + safe model-switch + cold-start timeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Implemented — verified, reviewed, fixed (2026-05-29) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-server-liveness-supervision |
| **Successor** | 004-perf-instrumentation-batching |
| **Handoff Criteria** | `/doctor embeddings` reports embedder state read-only, model switch is allowlisted with 404 loadedModel surfaced and dim-drift warned, and cold-start timeouts are aligned. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3 of 5** of the embedding-stack hardening decomposition: give operators a read-only view of embedder state, make model switches safe, and stop the client from declaring a healthy-but-downloading server dead.

**Scope Boundary**: Extend `embedder_status` and add a read-only `embeddings` doctor route, add the model-switch allowlist + 404 loadedModel surfacing + dim-drift warning, and align the client/server cold-start timeouts with first-embed download docs. Does NOT include perf instrumentation rollups or batching (phase 004), nor the live validation/flag flip (phase 005). The doctor route is read-only (add-only per Gate 3): no restart/kill verbs.

**Dependencies**:
- Parent packet: `../spec.md`.
- Predecessor: 002-server-liveness-supervision — the status surface reuses the new inference-liveness health fields.

**Deliverables**:
- Extend `embedder_status.ts` to report model-server state (reuse `HfLocalProvider.getMetadata()` + `factory.getProviderInfo()`: requested/effective provider + fallbackReason).
- Add a read-only `embeddings` route to doctor `_routes.yaml` (add-only; no restart/kill verbs — the launcher owns lifecycle).
- Add `HF_EMBEDDINGS_MODEL` to the advisor `CHILD_ENV_ALLOWLIST`; log resolved model+dim on bind.
- Surface the 404 `loadedModel` (currently discarded) and warn on dim drift vs `vec_metadata`.
- Align client `DEFAULT_READY_TIMEOUT=45000` with server `MODEL_LOAD_TIMEOUT=120000` — keep retrying while health reports `loading`.
- Document the first-embed model download (size, `~/.cache/huggingface/hub`, expected wait) in INSTALL_GUIDE + ENV_REFERENCE health-states table.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Operators have no read-only view of embedder state: `embedder_status.ts:68-86` does not report model-server state, requested/effective provider, or fallback reason. Model switches are unsafe: `HF_EMBEDDINGS_MODEL` is not in the advisor allowlist, the 404 `loadedModel` from a model mismatch (`hf-model-server.cjs:507-510`) is discarded at `hf-local.ts:692-693`, and dimension drift vs `vec_metadata` is silent. And the client cold-start timeout (`DEFAULT_READY_TIMEOUT=45000`, `hf-local.ts:27`) is shorter than the server's (`MODEL_LOAD_TIMEOUT=120000`, `hf-model-server.cjs:28`), so a healthy-but-downloading server is declared dead.

### Purpose
Surface embedder state read-only, make model switches safe and observable, and align cold-start timeouts so a downloading server is not killed mid-load.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `embedder_status.ts:68-86` to report model-server state via `getMetadata()` + `factory.getProviderInfo()` (`@747-760`, `@1071-1073`).
- Add a read-only `embeddings` route to doctor `_routes.yaml` (add-only; no restart/kill verbs).
- Add `HF_EMBEDDINGS_MODEL` to the advisor `CHILD_ENV_ALLOWLIST` (`mk-skill-advisor-launcher.cjs:108`); log resolved model+dim on bind.
- Surface the 404 `loadedModel` and warn on dim drift vs `vec_metadata` (mirror the cloud-fallback warning `factory.ts:948-953`).
- Align client `DEFAULT_READY_TIMEOUT` with server `MODEL_LOAD_TIMEOUT`; keep retrying while health reports `loading`.
- Document first-embed download in INSTALL_GUIDE + ENV_REFERENCE health-states table.

### Out of Scope
- Perf instrumentation rollups (p50/p95/queue depth), batching, latch, or cache (phase 004).
- Any doctor verbs that restart/kill the server — the launcher owns lifecycle.
- Live two-launcher validation or the advisor flag flip (phase 005).
- Multi-model residency.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/embedder_status.ts` | Modify | Report model-server state, requested/effective provider, fallbackReason via `getMetadata()` + `getProviderInfo()` |
| `doctor _routes.yaml` | Add | Read-only `embeddings` route (add-only; no restart/kill verbs) |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Add `HF_EMBEDDINGS_MODEL` to `CHILD_ENV_ALLOWLIST`; log resolved model+dim on bind |
| `shared/embeddings/providers/hf-local.ts` | Modify | Surface the 404 `loadedModel`; align `DEFAULT_READY_TIMEOUT`; warn on dim drift |
| `.opencode/bin/hf-model-server.cjs` | Modify | Confirm 404 `loadedModel` payload + `MODEL_LOAD_TIMEOUT` alignment |
| `INSTALL_GUIDE.md / ENV_REFERENCE.md` | Modify | Document first-embed download + health-states table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Embedder state must be observable read-only | `embedder_status` reports model-server state, requested/effective provider, and fallbackReason via `getMetadata()` + `getProviderInfo()` |
| REQ-002 | A read-only doctor route must exist | `_routes.yaml` gains an `embeddings` route that only inspects/reports — no restart/kill verbs (add-only per Gate 3) |
| REQ-003 | Model switch must be allowlisted and logged | `HF_EMBEDDINGS_MODEL` is in the advisor `CHILD_ENV_ALLOWLIST` and the resolved model+dim is logged on bind |
| REQ-004 | A model mismatch must surface the loaded model | The 404 `loadedModel` is surfaced instead of discarded, and a dim drift vs `vec_metadata` emits a warning |
| REQ-005 | Cold-start timeouts must be aligned | The client keeps retrying while health reports `loading` instead of declaring a healthy-but-downloading server dead |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | First-embed download must be documented | INSTALL_GUIDE + ENV_REFERENCE document the download size, `~/.cache/huggingface/hub` location, and expected wait, with a health-states table |
| REQ-007 | The status surface must stay read-only | The doctor route and status handler perform no lifecycle mutation; the launcher remains the only lifecycle owner |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator can read embedder + model-server state via `/doctor embeddings` without mutating anything.
- **SC-002**: A model switch via `HF_EMBEDDINGS_MODEL` is allowlisted, logged, and its dim drift is warned.
- **SC-003**: A model mismatch surfaces the server's `loadedModel` instead of swallowing it.
- **SC-004**: A healthy-but-downloading server is not declared dead before the model finishes loading.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A doctor route could grow lifecycle verbs over time | Med | Keep it read-only/add-only; document that the launcher owns lifecycle |
| Risk | Dim-drift warning could be noisy on intentional model switches | Low | Mirror the existing cloud-fallback warning shape; warn once per bind |
| Risk | Longer client timeout could mask a truly dead server | Med | Only keep retrying while health reports `loading`; pair with the phase-002 loading-age bound |
| Dependency | 002 inference-liveness health fields | High | The status surface and timeout logic reuse the new health fields |
| Dependency | 029 `getMetadata()` + `factory.getProviderInfo()` | High | Reuse the shipped metadata accessors rather than re-deriving state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the `embeddings` doctor route live under a new top-level target or nest under an existing embedder diagnostic?
- Should the dim-drift warning block the switch or only warn and proceed?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
**Given**
**Given**
**Given**
**Given**
**Given**
-->
