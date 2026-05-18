---
title: "Implementation Plan: Embedder Sidecar Execution"
description: "Implement lazy JSONL embedder sidecars, execution policy routing, health telemetry, tests, and docs."
trigger_phrases:
  - "embedder sidecar execution plan"
  - "sidecar routing plan"
  - "hf-local isolation plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Verified sidecar modules"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-sidecar.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020101111111111111111111111111111111111111111111111111111111"
      session_id: "phase-016-002-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Embedder Sidecar Execution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Spec Kit MCP server |
| **Runtime Boundary** | `child_process.fork()` with JSONL stdio |
| **Testing** | Vitest, TypeScript typecheck, strict spec validation, build |

### Overview
Add a narrow execution layer between embedder call sites and concrete providers. The router chooses direct adapters for out-of-process or remote providers by default, and sidecar clients for local in-process providers where model memory would otherwise bloat the MCP daemon.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research source read: deep-research-005 iteration 010 Finding 5.
- [x] `hf-local`, registry, active embedder schema, query, reindex, and health source read before editing.
- [x] Files to change are frozen to packet scope.

### Definition of Done
- [x] Strict spec validation passes.
- [x] MCP server typecheck passes.
- [x] `embedder-sidecar` Vitest target passes.
- [x] Existing `embedder` Vitest target passes.
- [x] MCP server build passes.
- [x] Integration probe verifies worker reuse and idle respawn.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Execution-router boundary with direct adapters for cheap/runtime-external providers and sidecar adapters for local model runtimes.

### Key Components
- **Sidecar client**: owns worker process lifecycle, JSONL ids, ping timeouts, idle eviction, stderr prefixing, and graceful shutdown.
- **Sidecar worker**: owns provider instantiation inside the child process and returns vectors or structured errors.
- **Execution router**: resolves `SPECKIT_EMBEDDER_EXECUTION`, caches one sidecar per `(provider, model)`, and returns an `EmbedderAdapter`.
- **Health handler**: reads live sidecar metadata without spawning new workers.

### Data Flow
Query and reindex call sites ask the router for an adapter. Direct adapters invoke existing registry/shared providers inside the MCP process. Sidecar adapters send raw texts plus model and dimensions to a child worker; responses return vectors only. The MCP process still performs cache writes, vector table writes, job status updates, and active pointer changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm Rec 5 requirements from iteration 010.
- [x] Read current source and prior 008/009 patterns.
- [x] Establish Level 1 packet.

### Phase 2: Core Implementation
- [x] Add sidecar client and worker modules.
- [x] Add execution router and env policy parsing.
- [x] Wire query and reindex call sites.
- [x] Extend full health report diagnostics.
- [x] Add tests and docs.

### Phase 3: Verification
- [x] Run strict spec validation.
- [x] Run typecheck.
- [x] Run targeted new Vitest.
- [x] Run existing embedder Vitest.
- [x] Run build.
- [x] Run integration probe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Sidecar lazy spawn, reuse, idle eviction, ping respawn, shutdown, error propagation | Vitest with temp worker fixture |
| Policy | `direct`, `sidecar`, and `auto` routing | Vitest |
| Regression | Existing embedder registry/reindex behavior | Vitest `embedder` target |
| Static | Type correctness and build output | TypeScript, npm build |
| Spec | Level 1 packet contract | `validate.sh --strict` |
| Integration | Five requests on one worker, idle eviction, respawn | Node/Vitest probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node child process stdio | Runtime | Green | Sidecar protocol cannot run |
| Shared embedding factory | Runtime | Green | Worker cannot reuse existing provider resolution |
| Active embedder metadata | Internal | Green | Router cannot preserve provider/model precedence |
| Vitest | Test | Green | Sidecar lifecycle coverage unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Sidecar lifecycle instability, query embedding regression, reindex regression, or unacceptable shutdown behavior.
- **Procedure**: Revert the three new embedder execution modules, query/reindex/health wiring, sidecar test, docs, env reference, and this packet. No database migration is introduced by this packet.
<!-- /ANCHOR:rollback -->
