---
title: "Spec: Investigation P2 Deadcode Drift Comment Cleanup Sweep"
description: "Level 2 child packet for the 68 P2 cleanup findings across embedder reindex, sidecar client, CJS launcher, execution router, sidecar worker, barrel, registry, and schema surfaces."
trigger_phrases:
  - "arc 010 003 005 p2 cleanup"
  - "68 P2 embedder cleanup sweep"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "completed-p2-cleanup-sweep"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts"
    session_dedup:
      fingerprint: "sha256:0100030050100030050100030050100030050100030050100030050100030050"
      session_id: "010-003-005-p2-cleanup"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Behavioral P2s were deferred rather than forced closed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Investigation P2 Deadcode Drift Comment Cleanup Sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Completed |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (010/003) |
| **Closure Rate** | 34 closed / 68 total = 50% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Arc 010/001 recorded 68 P2 cleanup findings across embedder module surfaces. The findings mix safe cleanup with behavior-changing hardening requests, so the packet needs a surgical sweep that closes dead exports, stale comments, helper noise, and type drift while deferring runtime-policy changes.

### Purpose
Close every non-behavioral P2 finding that can be safely changed in the leaf packet, and document any behavioral findings as deferred to a future P1 or dedicated hardening packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cleanup edits in reindex, sidecar-client, ensure-rerank-sidecar, execution-router, sidecar-worker, index, and schema.
- Packet-local spec docs.
- Regression-only verification.

### Out of Scope
- Python sidecar files under `system-rerank-sidecar/`.
- Shared registry implementation under `shared/`.
- Test rewrites to chase test-only export removals.
- Any deletion that changes runtime policy, public response shape, cancellation behavior, or security posture.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | Job-row alias cleanup, status SQL cleanup, shard metadata helper, comment divider cleanup |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modify | Public docs and unused exported type cleanup |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modify | Export pruning and timeout parser split |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modify | Type export cleanup and provider normalization cleanup |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | Modify | Shared input type, request parsing, and dead fallback cleanup |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` | Modify | Barrel stale comments and unused re-exports |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts` | Modify | Single-call helper-chain cleanup |
| `<this-folder>/*` | Modify | Packet documentation and handoff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Scaffold Level 2 packet docs with canonical anchors | Initial strict validation exits 0 |
| REQ-002 | Preserve runtime behavior | Behavioral/security/policy findings are deferred instead of forced |
| REQ-003 | Regression verification | Embedder vitest, launcher vitest, and MCP typecheck pass |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Sweep all 68 registry F-IDs | Checklist marks each F-ID closed or deferred with rationale |
| REQ-005 | Record cleanup choices | Decision record explains non-trivial delete/inline choices |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 68 P2 findings classified as closed or deferred.
- **SC-002**: 34 safe cleanup findings closed without behavioral changes.
- **SC-003**: Deferred list names behavior-changing or out-of-scope rationale.
- **SC-004**: Strict packet validation exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Registry line numbers are stale after prior P1 packets | Medium | Validate against current source and mark already-absent patterns as closed-baseline |
| Risk | Dead export removals can break test-only imports | Medium | Keep or defer exports with known regression-test consumers |
| Risk | Security P2s require behavior changes | High | Defer to P1/hardening packet instead of changing runtime policy in cleanup sweep |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Cleanup should reduce local dead code or drift without adding abstractions.

### Reliability
- **NFR-R01**: Regression suite must remain green after cleanup.

### Safety
- **NFR-S01**: Behavior-changing cleanup candidates must be deferred with rationale.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Test-only exports: defer when removal would require out-of-scope test rewrites.
- Public response shapes: defer snake-to-camel or field rename requests.
- In-memory SQLite: defer null database-dir early-return removal.

### Error Scenarios
- Error text changes are observable and deferred unless purely internal.
- Signal handling and credential-cache changes are deferred as runtime policy.

### State Transitions
- Existing dirty worktree entries outside this packet remain untouched.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Seven source files plus packet docs |
| Risk | 18/25 | Many findings touch public/test/runtime behavior |
| Research | 8/20 | Registry evidence and sibling packet anchors already exist |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Behavior-changing P2s are explicitly deferred.
<!-- /ANCHOR:questions -->
