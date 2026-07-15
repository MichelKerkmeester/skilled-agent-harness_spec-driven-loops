---
title: "Implementation Plan: Embedding Provider Error Propagation"
description: "Plan for rethrowing real embedding provider failures while preserving intentional degraded-null fallback semantics at selected callers."
trigger_phrases:
  - "038 embedding error propagation plan"
  - "retry-manager failure_reason masking plan"
  - "circuit breaker accounting fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation"
    last_updated_at: "2026-05-14T14:45:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Implemented embedding provider error propagation"
    next_safe_action: "Manual stage and commit"
    blockers:
      - ".git/index.lock creation is EPERM in this sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts"
      - ".opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-038-embedding-error-propagation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Embedding Provider Error Propagation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, shared embeddings facade |
| **Framework** | system-spec-kit MCP server and scripts |
| **Storage** | SQLite `memory_index.failure_reason` for retry-manager regression |
| **Testing** | `npx tsc --noEmit`, targeted Vitest suites, strict spec validation |

### Overview

The fix changes the single embedding facade wrappers from catch-and-null to catch-account-and-throw. Callers that already own persistence or retry behavior will receive the original provider error, while four intentionally degraded surfaces catch the throw and return the same null/empty fallback they used before.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Live bug reproduction and failing row behavior are documented.
- [x] Four fallback wrappers and seven pass-through callers are identified.
- [x] Gate 3 was pre-answered for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/038-embedding-error-propagation`.

### Definition of Done

- [x] Single embedding wrappers rethrow real provider failures.
- [x] Batch wrapper preserves null-array semantics.
- [x] Degraded-fallback callers catch and return null or stage-empty results.
- [x] Retry-manager regression test proves failure_reason is no longer the misleading null string.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Explicit error contract at the shared facade.

### Contract Clarification

| Outcome | Meaning | Examples |
|---------|---------|----------|
| `null` | Empty input, cached-null path, or circuit-open path | Empty query/document, circuit breaker open, intentional degraded fallback wrapper |
| `throw` | Real provider failure | Context-size overflow, provider runtime failure, timeout |

### Four Caller Wrappers

| Caller | Wrapper Shape | Reason |
|--------|---------------|--------|
| `handlers/save/reconsolidation-bridge.ts` | Pass-through after receiver inspection | `executeMerge` catches `generateEmbedding` callback failures and stores merged content without a refreshed embedding. |
| `lib/search/pipeline/stage1-candidate-gen.ts` | One top-level catch at stage entry | Stage1 should return a stage-empty result rather than fail the whole search path. |
| `handlers/eval-reporting.ts` | Two local try/catch wrappers | Eval reporting can proceed without vector similarity on provider failure. |
| `scripts/evals/run-ablation.ts` | One local try/catch wrapper | Ablation script can record null embedding and continue. |

### Seven Pass-through Callers

No edits planned because each existing caller already has a try/catch or provider-failure handling boundary that should activate once the facade rethrows:

| Caller | Existing Handling |
|--------|-------------------|
| `mcp_server/lib/providers/retry-manager.ts:629` | Regression-fix target; catch should record actual failure reason. |
| `mcp_server/handlers/save/embedding-pipeline.ts:155` | Existing catch handles save-path embedding failure. |
| `mcp_server/handlers/memory-crud-update.ts:108` | Existing catch handles CRUD update degradation. |
| `mcp_server/handlers/chunking-orchestrator.ts:281` | Existing catch handles chunk embedding failure. |
| `mcp_server/lib/search/vector-index-queries.ts:592` | Existing catch handles vector query fallback. |
| `mcp_server/lib/search/hyde.ts:328` | Existing catch handles HyDE fallback. |
| `mcp_server/handlers/save/post-insert.ts:352` | Existing catch handles post-insert failure. |

### Circuit Breaker

`recordEmbeddingFailure()` already increments shared circuit-breaker state. Rethrowing after that call means real provider failures now count correctly and still propagate to caller-specific persistence or fallback logic.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/embeddings.ts` single wrappers | Swallow real provider failures as `null` | Rethrow after failure accounting | T029-01, T029-02, T029-04 |
| `shared/embeddings.ts` batch wrapper | Converts item failures to null entries | Keep semantics and add verbose error count | T029-03 |
| Retry manager | Retries and records failure reason | No production edit planned; existing catch should activate | T45d |
| Search/eval fallback callers | Preserve degraded behavior | Add local wrapper at four selected sites | Targeted TypeScript and existing tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation

- [x] Confirm provider failure is swallowed in `shared/embeddings.ts`.
- [x] Confirm retry-manager catch is dead while facade returns null.
- [x] Read reconsolidation similarity callback receiver before choosing wrapper or pass-through.

### Phase 2: Implementation

- [x] Change `generateEmbedding`, `generateDocumentEmbedding`, and `generateQueryEmbedding` catch blocks to rethrow.
- [x] Keep `generateBatchEmbeddings` resolving null entries and add verbose-mode error-count logging.
- [x] Leave reconsolidation callback pass-through because receiver catches.
- [x] Add one top-level try/catch around stage1 candidate generation.
- [x] Add two eval-reporting query wrappers.
- [x] Add one run-ablation query wrapper.
- [x] Add T029-01 through T029-04 to `embeddings.vitest.ts`.
- [x] Add T45d to `retry-manager.vitest.ts`.

### Phase 3: Verification

- [x] Run `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit`.
- [x] Run targeted Vitest suites for embeddings, retry-manager, circuit breaker, chunking orchestrator, and lazy loading.
- [x] Run strict validation on the 038 packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | shared facade, MCP server callers, script caller | `npx tsc --noEmit` |
| Unit | single wrapper throws and batch null semantics | `tests/embeddings.vitest.ts` |
| Regression | retry-manager failure_reason persistence | `tests/retry-manager.vitest.ts` |
| Safety net | existing circuit, chunking, lazy-loading behavior | requested targeted Vitest group |
| Spec validation | 038 packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing retry-manager test fixtures | Internal | Yellow | T45d needs a known-good row setup from current tests. |
| Search stage result shape | Internal | Yellow | Stage-empty fallback must match existing return types. |
| Dirty worktree and blocked git index | Workflow | Yellow | Commits may be recorded as uncommitted if `.git/index.lock` remains blocked. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Existing degraded search/save paths start surfacing provider errors to users.
- **Procedure**: Revert the 038 changes in `shared/embeddings.ts`, caller wrappers, tests, and packet docs. Then rerun the targeted Vitest group to confirm old catch-and-null behavior is restored.
<!-- /ANCHOR:rollback -->
