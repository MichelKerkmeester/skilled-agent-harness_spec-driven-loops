---
title: "Plan: Sidecar, Local Model, and Adapter Lifecycle"
description: "Implementation plan for Sidecar, Local Model, and Adapter Lifecycle."
trigger_phrases:
  - "sidecar-local-model-and-adapter-lifecycle"
  - "memory leak 8"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle"
    last_updated_at: "2026-05-22T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "planned-phase-008-sidecar-and-adapter-lifecycle"
    next_safe_action: "implement-sidecar-ledger-adapter-close-and-rss-gate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0808080808080808080808080808080808080808080808080808080808080808"
      session_id: "009-memory-leak-remediation-008"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "This phase is scoped from remediation-map items #11, #12, and #13."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Sidecar, Local Model, and Adapter Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python sidecar, Python CocoIndex daemon/reranker adapters, spec markdown |
| **Framework** | FastAPI rerank sidecar, CocoIndex code MCP server, Spec Kit Memory phase docs |
| **Storage** | Sidecar state directory ledger `.sidecar-ledger.json`, in-memory adapter/embedder caches, spec docs |
| **Testing** | pytest, Python compile checks, strict spec validation |

### Overview
Phase 008 bounds sidecar, adapter, fallback model, HTTP client, and registry embedder lifetimes without broad process termination. The implementation follows the phase-005 exact-identity rule and phase-007 owner-lease shape: reuse only when owner metadata matches, reclaim only dead exact PIDs, and refuse unknown live owners.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source evidence from packets 020 and 024 has been read.
- [x] Remediation-map items #11, #12, and #13 define the accepted scope.
- [x] No-kill safety boundary is explicit: sidecar ledger cleanup may delete stale ledger rows, but must not send process signals.

### Definition of Done
- [ ] REQ-001: sidecar lifecycle has owner metadata, healthy reuse, unknown-owner refusal, and stale exact-PID cleanup.
- [ ] REQ-002: adapter and registry cache cleanup closes nested clients/models idempotently before dropping refs.
- [ ] SC-001 fixtures pass: healthy reuse, unknown-owner refusal, stale exact-PID cleanup, sidecar 5xx fallback RSS, adapter close idempotence.
- [ ] SC-002 docs are updated: parent remediation map/arc spec and this implementation summary carry evidence and handoff.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Sidecar Ledger
Add a Python module under `.opencode/skills/system-rerank-sidecar/scripts/` because the sidecar skill is Python-first. The persistent ledger file lives at `<sidecar-state-dir>/.sidecar-ledger.json` and records rows shaped as:

| Field | Meaning |
|-------|---------|
| `pid` | Spawned sidecar process PID. |
| `port` | HTTP port used for `/health` and `/rerank`. |
| `ownerToken` | Caller/project owner token expected by the current request. |
| `startedAtIso` | Spawn timestamp. |
| `lastHealthIso` | Last successful health check timestamp. |
| `executablePath` | Python executable or command path used to spawn the process. |
| `canonicalConfigHash` | Stable hash for owner-relevant config. |

Ledger writes use atomic temp-file plus `os.replace()` and best-effort directory fsync, matching the phase-004 atomic state pattern.

### Healthy Reuse and Cleanup Rules
- On a new sidecar request, read the ledger and classify each row with PID liveness, health reachability, owner token, and config hash.
- Healthy PID + reachable port + matching owner/config returns `healthy-reusable`; reuse it and update `lastHealthIso`.
- Healthy PID + reachable port + non-matching owner returns `unknown-owner-refuse`; preserve the row and spawn a new sidecar on a different port.
- Dead PID (`ESRCH`) returns `stale-pid-reclaim`; delete the ledger row and spawn fresh.
- EPERM-alive returns `eperm-unknown`; preserve the row and spawn fresh.
- PID alive but port unreachable returns `port-unreachable`; preserve process state and spawn fresh without termination.
- Config mismatch returns `config-hash-mismatch`; preserve the row and spawn fresh.

### Adapter Close Contract
Every reranker adapter and fallback adapter gets `close()` with idempotent no-op behavior after the first call. First close walks nested resources in order: HTTP clients, fallback adapters, model handles, and cache references. `close()` must swallow invalid-state cleanup failures after best-effort release, because shutdown paths should not fail while dropping references.

### Project Close and Registry Cache
The CocoIndex registry is responsible for embedder cache lifecycle. `ProjectRegistry.close_all()` and config refresh/removal paths close stale embedders when the config hash changes or when the registry is torn down. `Project.close()` remains idempotent and cannot interleave with active work because phase 006 already established remove/cancel ordering; this phase adds cache/resource release on the registry side.

### 5xx Fallback RSS Gate
Add a Python helper for sidecar fallback RSS measurement. It accepts before/after RSS readings and a threshold in MB. If the delta is above threshold it returns `P1-escalation-candidate` with logged evidence; otherwise it returns `P2-default`. The default severity remains P2 until phase 010 has benchmark evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Sidecar Ledger
- [ ] Implement `sidecar_ledger.py` with `add_sidecar_row`, `find_reusable_sidecar`, `reclaim_stale`, and `classify_sidecar_owner`.
- [ ] Integrate ledger lookup into `ensure_rerank_sidecar.py` before forking.
- [ ] Preserve unknown live owners and EPERM rows; never mark sidecars eligible for process-sweep termination.

### Phase 2: Adapter and Registry Lifecycle
- [ ] Add idempotent close protocol helpers.
- [ ] Add `close()` to reranker, sidecar, fallback, Jina, and cache paths.
- [ ] Close registry embedder cache entries on close/remove/config-hash eviction.

### Phase 3: RSS Gate
- [ ] Add sidecar 5xx fallback RSS delta helper with default P2 behavior.
- [ ] Cover below-threshold and above-threshold fixture behavior.

### Phase 4: Verification and Documentation
- [ ] Run targeted sidecar/reranker/registry pytest commands.
- [ ] Run Python compile checks for touched modules.
- [ ] Run strict validation for this phase and the parent arc.
- [ ] Update parent remediation map, arc phase map, implementation summary, and commit handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Ledger read/write/classification and stale row reclaim | pytest |
| Unit | Adapter close idempotence and nested client/fallback close | pytest |
| Unit | RSS delta severity gate | pytest |
| Unit/Integration | Registry embedder cache eviction/close-all | pytest |
| Static | Python syntax for touched modules | `python3 -m py_compile` |
| Spec | Phase and parent validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 process sweep exact-identity rule | Internal code pattern | Available | Unknown-owner rows must be preserved. |
| Phase 007 owner lease shape | Internal code pattern | Available | Ledger classification follows the same owner/refusal vocabulary. |
| Phase 006 active-work ordering | Internal lifecycle precondition | Shipped | Registry close relies on remove/cancel quiescence. |
| Phase 002 telemetry harness | Measurement policy | Available | RSS escalation remains benchmark-gated until measured. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: targeted tests fail in touched surfaces, ledger reuse misclassifies owner identity, or registry cleanup breaks post-remove search/index usability.
- **Procedure**: remove ledger integration and helper modules, restore adapter cache behavior, preserve any `.sidecar-ledger.json` evidence file, and rerun the targeted pytest plus strict spec validation.
- **Safety invariant**: rollback must not kill sidecar processes; only ledger rows created by this phase may be overwritten or removed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Sidecar ensure/spawn entrypoint | Read ledger before spawn, reuse matching healthy sidecars, record fresh sidecars | pytest ledger lifecycle fixtures |
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` | New ledger module | Atomic ledger I/O, PID/health/owner classification, stale row reclaim | pytest unit fixtures |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | Reranker adapters and module cache | Add idempotent `close()`, close cache entries, wire fallback RSS gate | reranker pytest fixtures |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/adapter_lifecycle.py` | New close/RSS helper module | Idempotent close helper and RSS delta classification | pytest unit fixtures |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registry.py` and/or `core/project.py` | Project/registry lifecycle | Close cached embedders on remove/refresh/close-all | registry/project pytest fixtures |
| Phase docs | Evidence and handoff | Update plan/tasks/summary/map/status | strict spec validation |
<!-- /ANCHOR:affected-surfaces -->
