---
title: "Implementation Plan: Observability + safe model-switch + cold-start timeout"
description: "Add a read-only /doctor embeddings route and embedder_status surface, a safe model-switch path (HF_EMBEDDINGS_MODEL allowlist + 404 loadedModel surfacing + dim-drift warning), and align the client/server cold-start timeouts with first-embed download docs."
trigger_phrases:
  - "observability model-switch plan"
  - "doctor embeddings cold-start timeout implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/003-observability-model-switch"
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 plan for observability + safe model-switch + cold-start timeout"
    next_safe_action: "Implement phase 003"
    blockers: []
    key_files:
      - "mcp_server/handlers/embedder_status.ts"
      - "shared/embeddings/providers/hf-local.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003132"
      session_id: "031-003-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Observability + safe model-switch + cold-start timeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp-server handlers + shared embeddings), Node CJS launcher, YAML doctor routes, Markdown docs |
| **Framework** | system-spec-kit embedder_status + doctor `_routes.yaml` + hf-local client |
| **Storage** | `vec_metadata` for dim-drift comparison |
| **Testing** | vitest for status payload + 404-surfacing + dim-drift; doctor route smoke; tsc |

### Overview
Make the embedder observable and switchable safely: read-only status + doctor route reusing the phase-002 health fields, an allowlisted model switch that surfaces the 404 loaded model and warns on dim drift, and aligned cold-start timeouts so a downloading server is not declared dead.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified (Predecessor: 002-server-liveness-supervision)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] Focused tests and static checks for this phase pass
- [ ] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only surfacing + safe-switch: expose state through existing metadata accessors without lifecycle verbs, gate model changes through an allowlist with explicit drift/mismatch signals, and align timeouts so health-driven retry replaces a fixed deadline.

### Key Components
- `embedder_status.ts:68-86` extended with `getMetadata()` (`@747-760`) + `factory.getProviderInfo()` (`@1071-1073`).
- Read-only `embeddings` route in doctor `_routes.yaml` (add-only; no restart/kill).
- `HF_EMBEDDINGS_MODEL` added to `CHILD_ENV_ALLOWLIST` (`mk-skill-advisor-launcher.cjs:108`); resolved model+dim logged on bind.
- 404 `loadedModel` (`hf-model-server.cjs:507-510`) surfaced instead of discarded (`hf-local.ts:692-693`); dim-drift warning mirrors `factory.ts:948-953`.
- Client `DEFAULT_READY_TIMEOUT` (`hf-local.ts:27`) aligned with server `MODEL_LOAD_TIMEOUT` (`hf-model-server.cjs:28`); retry while `loading`.

### Data Flow
operator calls `/doctor embeddings` -> read-only handler reads `getMetadata()` + `getProviderInfo()` -> reports requested/effective provider + fallbackReason + model-server state; a model switch resolves `HF_EMBEDDINGS_MODEL` -> logs model+dim -> on mismatch surfaces the 404 `loadedModel` and warns on dim drift; the client retries while health reports `loading`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/handlers/embedder_status.ts` | Phase surface | Report model-server state + provider info | status-payload vitest |
| `doctor _routes.yaml` | Phase surface | Add read-only `embeddings` route | doctor route smoke |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Phase surface | Allowlist `HF_EMBEDDINGS_MODEL`; log model+dim | static check + bind log |
| `shared/embeddings/providers/hf-local.ts` | Phase surface | Surface 404 loadedModel; align timeout; dim-drift warn | 404-surfacing + dim-drift vitest |
| `.opencode/bin/hf-model-server.cjs` | Phase surface | Confirm 404 payload + timeout constants | static check |
| `INSTALL_GUIDE.md / ENV_REFERENCE.md` | Phase surface | Document first-embed download + health-states table | doc grep |

Inventory: use targeted `rg` for `embedder_status`, `getProviderInfo`, `loadedModel`, `DEFAULT_READY_TIMEOUT`, `MODEL_LOAD_TIMEOUT`, and `CHILD_ENV_ALLOWLIST` before editing. Invariant: the surface stays read-only; the launcher owns lifecycle.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase predecessor handoff is satisfied (002-server-liveness-supervision)
- [ ] Inventory affected status/route/model-switch symbols and tests before editing

### Phase 2: Core Implementation
- [ ] Extend `embedder_status` with model-server state + provider info [REQ-001]
- [ ] Add the read-only `embeddings` doctor route (no restart/kill verbs) [REQ-002]
- [ ] Allowlist `HF_EMBEDDINGS_MODEL`; log resolved model+dim on bind [REQ-003]
- [ ] Surface the 404 `loadedModel`; warn on dim drift vs `vec_metadata` [REQ-004]
- [ ] Align client `DEFAULT_READY_TIMEOUT` with server `MODEL_LOAD_TIMEOUT`; retry while `loading` [REQ-005]

### Phase 3: Verification
- [ ] Document first-embed download + health-states table [REQ-006]
- [ ] Confirm the doctor route + status handler perform no lifecycle mutation [REQ-007]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | status payload shape, 404 loadedModel surfacing, dim-drift warning | vitest |
| Integration | doctor `embeddings` route read-only smoke | vitest + route runner |
| Static | imports, allowlist diff, timeout-constant grep, and TypeScript safety | rg + tsc |
| Manual | only if model-switch download behavior cannot be verified headless | local launcher session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-server-liveness-supervision | Internal | Pending | The status surface and timeout retry reuse the new inference-liveness health fields |
| 029 `getMetadata()` + `factory.getProviderInfo()` | Internal | Shipped | Reuse the shipped metadata accessors |
| Doctor `_routes.yaml` manifest | Internal | Shipped | The new route must declare a read-only mutation class per Gate 3 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The status surface, doctor route, or model-switch changes regress reporting, routing, or provider selection.
- **Procedure**: Revert this phase's scoped files only, preserving phases 001-002; the read-only route, the allowlist entry, and the timeout alignment are independent edits that can be reverted individually.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
