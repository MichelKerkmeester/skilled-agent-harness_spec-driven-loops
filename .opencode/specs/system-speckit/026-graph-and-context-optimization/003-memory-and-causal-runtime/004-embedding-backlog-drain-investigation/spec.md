---
title: "Feature Specification: mk-spec-memory embedding-backlog drain and daemon-config investigation"
description: "Convergence-gated deep-research loop into why the mk-spec-memory re-embed pipeline cannot drain a large embedding backlog to 0 failed / 0 pending: retry-queue retention parking, reindex and embedder_set status-commit interaction, and the persistent daemon's env-config-reload behavior."
trigger_phrases:
  - "embedding backlog drain investigation"
  - "mk-spec-memory re-embed non-convergence"
  - "retry queue parking daemon config reload"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation"
    last_updated_at: "2026-05-26T20:43:39Z"
    last_updated_by: "main_agent"
    recent_action: "deep-research-init-cli-codex-gpt55-xhigh-standard"
    next_safe_action: "run-deep-research-iterations"
    blockers: []
    key_files:
      - "research/deep-research-state.jsonl"
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000004"
      session_id: "rsr-2026-05-26T20-43-39Z"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Root cause of mk-spec-memory re-embed non-convergence"
    answered_questions: []
---
# Feature Specification: mk-spec-memory embedding-backlog drain and daemon-config investigation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
<!-- DR-SEED:REQUIREMENTS -->
After the 026 spec-folder reorganization, a bulk re-embed of the mk-spec-memory store (~17k of ~27k rows unembedded) will not converge to a clean state. Pending embeddings are parked as `failed` by two retry-retention limits (`SPECKIT_RETRY_QUEUE_MAX_PENDING` default 1000, `SPECKIT_RETRY_QUEUE_MAX_AGE_MS` default 24h) in `retry-manager.js`; `reindex --force` is content-driven and skips rows already marked `failed`; `embedder_set` writes vectors but statuses do not stick because stale-config daemon workers re-park them; and the persistent multi-process daemon does not reload env config on `/mcp` reconnect, so config fixes and worker kills do not take effect cleanly. The result is a backlog that cannot be driven to `0 failed / 0 pending`.

### Purpose
Run a convergence-gated deep-research loop to establish the definitive root cause(s) and a reproducible, safe operator procedure (plus any minimal code-level fix) to fully re-embed and reconcile a large backlog without parking — research only, no implementation in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- DR-SEED:SCOPE -->

### In Scope
- Iterative deep-research over `retry-manager.js` retention semantics, `reindex` status-commit behavior, `embedder_set` reindex + active-pointer-flip, vec-shard staging vs `memory_index` status reconciliation, and the daemon lifecycle (`mk-spec-memory-launcher.cjs` + IPC bridge + worker respawn / config reload).
- A reproducible drain runbook driving the backlog to `0 failed / 0 pending`, and a recommendation on whether the cap (1000) / max-age (24h) defaults should change.

### Out of Scope
- Implementing the fix here (deferred to a follow-on `/speckit:plan`) - keeps this a read-only investigation.
- Redesigning the embedding provider cascade (ADR-014) or the vector-shard storage architecture - out of the failure surface under study.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run convergence-gated deep-research iterations (cli-codex gpt-5.5 xhigh, standard tier) | Loop runs until convergence or maxIterations with externalized JSONL state and per-iteration artifacts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Produce a root-cause analysis with code-level evidence and a reproducible drain runbook | `research/research.md` documents root cause (file:line) + a step-ordered procedure to reach 0 failed / 0 pending |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Loop reaches convergence or maxIterations with archived iteration files and a coherent findings registry.
- **SC-002**: `research/research.md` identifies the non-convergence root cause(s) with evidence and a validated drain procedure, plus a defaults recommendation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | codex CLI (gpt-5.5) auth + mk-spec-memory codebase access | Loop cannot run | Auth pre-flight verified at setup (smoke test passed) |
| Risk | Resource thrash from back-to-back codex dispatches | Swap pressure | One dispatch at a time with SIGKILL between iterations |
| Risk | Live re-embed jobs mutate the global DB during research | State drift | Iterations are read-only (`--sandbox workspace-write` scoped to packet writes); no embed triggers fired from iterations |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the non-convergence is primarily a retry-retention defaults issue, a status-reconciliation bug, or a daemon config-reload defect (or a compound of all three).

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Deep-research outcome (10 iterations, cli-codex gpt-5.5 xhigh; canonical: `research/research.md`):** Compound root cause — (1) the `embedder_set`/reindex completion transaction writes vectors but never commits `memory_index.embedding_status` (`reindex.js:316-318`); (2) `enforceRetryRetentionLimits()` parks clean `pending`/`retry` rows as `failed` *before* the drain can embed them; (3) daemon retry env is frozen at module load and `/mcp` reconnect has no reload hook. Empirically, **all 17,326 non-success rows already have active vectors** — the backlog is *vector-present but status-stale*, so the immediate fix is a near-free metadata reconciliation (`UPDATE ... embedding_status='success'` for vector-present rows), not re-embedding. Recommended: a guarded `memory_embedding_reconcile()` MCP tool (dry-run/apply) + 3 durable code fixes (reindex status-commit = highest leverage) + non-destructive retention defaults. Implementation deferred to a follow-on `/speckit:plan` packet.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
