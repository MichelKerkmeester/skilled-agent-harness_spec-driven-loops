---
title: "Implementation Summary: Embedding Provider Error Propagation"
description: "Propagated real embedding provider failures through the shared facade while preserving intentional degraded-null fallback behavior."
trigger_phrases:
  - "029 embedding error propagation summary"
  - "retry-manager failure_reason masking summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/029-embedding-error-propagation"
    last_updated_at: "2026-05-14T14:45:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Implemented and verified embedding provider error propagation"
    next_safe_action: "Manual stage and commit"
    blockers:
      - ".git/index.lock creation is EPERM in this sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-029-embedding-error-propagation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-embedding-error-propagation |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Real embedding provider failures now propagate out of the shared single-embedding wrappers. Retry-manager can record the actual provider failure class instead of the misleading "Embedding generation returned null", and caller paths that intentionally degrade still catch locally.

### Error Contract

Single embedding wrappers rethrow after circuit-breaker accounting. Batch embedding still returns null entries for failed items, preserving the intentional batch degradation contract.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/shared/embeddings.ts` | Modified | Rethrow single-wrapper provider failures and keep batch null semantics. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified | Add top-level degraded fallback catch. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts` | Modified | Add two query embedding fallback wrappers. |
| `.opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts` | Modified | Add query embedding fallback wrapper. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts` | Modified | Add T029 facade contract tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts` | Modified | Add T45d failure_reason regression test. |
| `.opencode/specs/system-spec-kit/029-embedding-error-propagation/` | Created | Track this implementation packet. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in the working tree as a scoped patch across the shared facade, three degraded-fallback caller files, and two test files. `reconsolidation-bridge.ts` was inspected and left unchanged because `executeMerge` already catches the `generateEmbedding` callback failure; staging and commit are blocked by `.git/index.lock` EPERM in this sandbox.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rethrow single-wrapper provider failures | Retry-manager and pass-through callers need the real provider error to classify and persist the failure. |
| Keep batch null-array semantics | Batch callers already expect per-item failures to degrade to null entries without rejecting the whole batch. |
| Add wrappers only where null fallback is intentional | Broad wrapping would hide the same bug again under a different shape. |
| Leave reconsolidation pass-through | The callback receiver already catches embedding regeneration failures inside `executeMerge`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS, exit 0. |
| `npx vitest run tests/embeddings.vitest.ts tests/retry-manager.vitest.ts tests/embedding-circuit-breaker.vitest.ts tests/chunking-orchestrator.vitest.ts tests/lazy-loading.vitest.ts` | PASS, exit 0; 5 files and 105 tests passed. |
| `validate.sh --strict` on 029 | PASS after final doc reconciliation. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Git staging is blocked.** The code and packet files are uncommitted because `.git/index.lock` creation returns EPERM.
<!-- /ANCHOR:limitations -->
