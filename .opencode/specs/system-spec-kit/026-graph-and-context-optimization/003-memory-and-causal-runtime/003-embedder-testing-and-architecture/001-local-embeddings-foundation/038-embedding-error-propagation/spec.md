---
title: "Embedding Provider Error Propagation"
description: "Implementation packet for changing real embedding provider failures from swallowed return-null results into thrown errors, while preserving intentional null fallback for empty input, cached-null paths, circuit-open paths, and batch semantics."
trigger_phrases:
  - "038 embedding error propagation"
  - "embedding generation returned null bug"
  - "generateDocumentEmbedding catch swallow"
  - "retry-manager failure_reason masking"
  - "circuit breaker accounting fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation"
    last_updated_at: "2026-05-14T14:45:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Implemented embedding provider error propagation"
    next_safe_action: "Manual stage and commit"
    blockers:
      - ".git/index.lock creation is EPERM in this sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-038-embedding-error-propagation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "null means empty input, cached-null, or circuit-open."
      - "throw means a real provider failure that callers can record and classify."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Embedding Provider Error Propagation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`generateDocumentEmbedding` catches real provider failures, records a circuit-breaker failure, logs a warning, and returns `null`. That makes retry-manager's provider-error catch unreachable, so rows whose provider actually threw "Input is longer than the context size" are stored with the misleading failure reason "Embedding generation returned null".

### Purpose

Let real provider failures propagate to callers that already know how to record them, while keeping intentional degraded-null behavior at call sites that use null as a fallback signal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Change `generateEmbedding`, `generateDocumentEmbedding`, and `generateQueryEmbedding` catch blocks to rethrow real provider errors after circuit-breaker accounting.
- Keep `generateBatchEmbeddings` returning null entries on per-item failures.
- Add degraded-fallback wrappers at the four caller surfaces where null fallback is intentional.
- Leave seven existing pass-through callers unchanged because their try/catch blocks should activate after this fix.
- Add regression coverage for thrown provider errors, batch null semantics, circuit-breaker increments, and retry-manager failure_reason content.

### Out of Scope

- `.opencode/skills/system-code-graph/` because this packet does not own the code-graph skill.
- `.opencode/specs/system-spec-kit/014-*` and `.opencode/specs/system-spec-kit/028-*` because those packets are shipped.
- `.opencode/skills/system-code-graph/dist/system-spec-kit/shared/` because that path contains an orchestrator-owned uncommitted patch.
- Live MCP child processes because this task forbids killing or restarting them.
- 030 token-aware llama-cpp truncation, which is a separate prior packet in this same session.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings.ts` | Modify | Rethrow real provider failures in single embedding wrappers; keep batch null-array semantics. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | Inspect | Left pass-through because `executeMerge` already catches `generateEmbedding` callback failures. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Add one stage-entry try/catch that returns an empty degraded result. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts` | Modify | Wrap two query embedding calls with null fallback. |
| `.opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts` | Modify | Wrap query embedding call with null fallback. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts` | Modify | Add T029-01 through T029-04. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts` | Modify | Add T45d retry-manager failure_reason regression test. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation/` | Create | Track scope, plan, tasks, verification, and metadata for this packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Real provider failures must throw from single embedding wrappers | Tests prove `generateDocumentEmbedding` and `generateQueryEmbedding` reject with the provider's "Input is longer than the context size" error. |
| REQ-002 | Batch embedding must preserve degraded null-array behavior | A mock per-item provider throw resolves to null entries instead of rejecting. |
| REQ-003 | Circuit-breaker failure accounting must increment on real throws | T029-04 observes the failure counter incrementing by one per real provider throw. |
| REQ-004 | Retry-manager must store the real provider error class or message | T45d proves `failure_reason` does not equal "Embedding generation returned null" and contains provider/context-size evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Four intentional degraded-fallback caller wrappers are added | reconsolidation bridge decision documented; stage1, eval-reporting, and run-ablation return null or stage-empty results on caught throws. |
| REQ-006 | Seven pass-through callers stay unchanged | Plan documents the existing try/catch callers and no edits are made there. |
| REQ-007 | Verification passes | Typecheck, targeted Vitest suite, and strict 029 validation exit 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Provider context-size overflow reaches retry-manager as a thrown error, not a synthetic null result.
- **SC-002**: Downstream call sites that intentionally degrade to null still degrade cleanly.
- **SC-003**: Circuit-breaker state reflects real provider failures.
- **SC-004**: **Given** a provider throws "Input is longer than the context size", **When** retry-manager retries a row, **Then** the database failure reason contains provider/context-size evidence and is not the old null string.
- **SC-005**: **Given** batch embedding receives a throwing item, **When** `generateBatchEmbeddings` runs, **Then** it resolves with null entries instead of rejecting.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Single wrappers now throw | Callers without try/catch could lose degraded search behavior. | Add wrappers only at the four intentional fallback sites and leave existing pass-through try/catch callers intact. |
| Risk | Test mocks can accidentally bypass imported bindings | Retry-manager imports must be spied in the same module shape used by production. | Read existing retry-manager tests before adding T45d. |
| Risk | Dirty parallel-track worktree | Accidental staging can pollute commit scope. | Stage only the 038 packet and files edited for this bug. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
