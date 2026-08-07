---
title: "022 Local-LLM Legacy Remediation: substrate repair, classified save errors, playbook cleanup"
description: "A 5-batch legacy-cleanup plan was blocked when every memory_save returned a generic E081 error. Scope shifted to substrate repair: env-overridable retry throughput plus classified error codes E085-E089 replacing the E081 catch-all plus removal of retentionPolicy:'ephemeral' from 24-- playbook scenarios that were silently triggering governed-ingest enforcement."
trigger_phrases:
  - "022 substrate repair"
  - "E081 classified error codes"
  - "ephemeral governance silent reject"
  - "retry-throughput env knob"
  - "local-llm legacy remediation scope shift"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/022-local-llm-legacy-remediation`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The 022 plan called for five batched cli-codex dispatches to purge Nomic/MiniLM/legacy-ONNX residue surfaced by the 021 deep-review. When the playbook validation ran (15 scenarios via cli-opencode plus kimi-k2.6), every save-heavy scenario failed with `E081 "An unexpected error occurred"`. That chronic failure blocked the original cleanup work and hid a three-factor substrate problem: multi-daemon contention triggered circuit-breaker flapping, low retry throughput slowed recovery. `retentionPolicy: "ephemeral"` silently triggered governed-ingest enforcement that required six audit fields none of the scenarios provided. Scope shifted from model-name cleanup to substrate repair. Three high-value fixes shipped: env-overridable retry-throughput config plus the E081 catch-all replaced with classified codes E085 through E089 plus all six playbook scenario files cleaned of the ephemeral retentionPolicy. Follow-up work for ADR-002 implementation, build fix plus scenario re-validation was tracked under the sibling 032-substrate-repair-followups packet.

### Added

- Five classified save error codes (E085 `MEMORY_SAVE_GOVERNANCE_REJECTED`, E086 `MEMORY_SAVE_EMBEDDING_FAILED`, E087 `MEMORY_SAVE_SQLITE_BUSY`, E088 `MEMORY_SAVE_DB_ERROR`, E089 `MEMORY_SAVE_VALIDATION_FAILED`) replacing the opaque E081 catch-all
- `classifySaveErrorCode` and `extractSaveErrorDetails` helpers in `response-builder.ts` to route thrown errors to the correct classified code
- Three env-overridable retry config variables (`SPECKIT_RETRY_INTERVAL_MS`, `SPECKIT_RETRY_BATCH_SIZE`, `SPECKIT_RETRY_ENABLED`) on the `BACKGROUND_JOB_CONFIG` constant in `retry-manager.ts`
- Six AI council artifacts under `ai-council/embedding-worker-diagnostic/` documenting the diagnosis, cross-seat critique, convergence plan, decision record, post-execution follow-up with the H4 root cause, plus ADR-002 proposal

### Changed

- `BACKGROUND_JOB_CONFIG` in `retry-manager.ts` changed from hardcoded 5 items per 5 minutes to env-overridable defaults with the same conservative baseline
- All six `24--local-llm-query-intelligence/` scenario files updated to remove `retentionPolicy: "ephemeral"` from `memory_save` calls, replaced with a warning note

### Fixed

- `response-builder.ts` previously wrapped every save-time throw as `E081 "An unexpected error occurred"`, collapsing governance rejects, embedding failures, SQLite contention plus validation errors into one indistinguishable code. Classified dispatch now surfaces the real error type on first response.
- `retentionPolicy: "ephemeral"` in playbook scenarios silently triggered `requiresGovernedIngest()` at `scope-governance.ts:235`, requiring six audit fields no scenario provided, causing 0/15 PASS across the kimi validation run. Removing the parameter restores normal quality-gate rejection with structured feedback.

### Verification

| Check | Result |
|-------|--------|
| `memory_search` returns hybrid vector+FTS results | PASS, similarity 82.75 on smoke test query "substrate health smoke test verify" |
| `memory_save` without ephemeral `retentionPolicy` succeeds (reaches quality gate, not E081) | PASS, returns structured `INSUFFICIENT_CONTEXT_ABORT` rejection with `evidenceCounts` |
| `memory_save` with ephemeral `retentionPolicy` returns E085 (not E081) plus structured issues array | PASS, classifier unit-tested 8/8 cases. Live test confirmed E085 after daemon respawn. |
| Circuit breaker no longer continuously open | PARTIAL. Closed most of the time. Still flaps briefly under heavy retry batches. Tracked in 032/005. |
| 214 historical failed embeddings recovered | PARTIAL. 190 of 214 cleared under new retry throughput config. Remaining 24 tracked in 032/004. |
| CocoIndex daemon reachable | PASS, after killing stuck pid 47883 (24h hung) |
| `npm run build` in `mcp_server/` | FAIL. Pre-existing MCP SDK import errors unrelated to 022 work. Tracked in 032/003. |
| 24-- scenarios re-validated end-to-end | DEFERRED to 032/002-rerun-24-scenarios-suite |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Modified | Env-overridable retry-throughput config via `SPECKIT_RETRY_*` env vars |
| `.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts` | Modified | Added E085 through E089 classified error codes |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | Modified | `classifySaveErrorCode` and `extractSaveErrorDetails` helpers replace the E081 catch-all |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/paraphrase-recall.md` | Modified | Removed ephemeral retentionPolicy. Added warning note. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/causal-graph-link-quality.md` | Modified | Removed ephemeral retentionPolicy. Added warning note. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/causal-coverage-under-bulk-save.md` | Modified | Removed ephemeral retentionPolicy. Added warning note. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/drift-detection-quality.md` | Modified | Removed ephemeral retentionPolicy. Added warning note. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/cross-ai-memory-handoff.md` | Modified | Removed ephemeral retentionPolicy. Added warning note. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/concurrent-multi-ai-safety.md` | Modified | Removed ephemeral retentionPolicy x2 (Phase 1 and Phase 3). Added warning notes. |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/seat-statements.md` (NEW) | Created | Multi-seat AI council diagnosis covering Systems, Empirical, Contrarian perspectives |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/cross-critique.md` (NEW) | Created | Six pairwise critiques across council seats |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/convergence.md` (NEW) | Created | Six-step repair plan with kill-switch |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/decision-record.md` (NEW) | Created | ADR-001 for the substrate repair decisions executed in this session |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/post-execution-followup.md` (NEW) | Created | Documents the H4 governance silent reject root cause the initial council missed |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/adr-002-decouple-retention-from-governance.md` (NEW) | Created | ADR-002 proposing governance-trigger decoupling (4 options weighed. Option A approved by user.) |

### Follow-Ups

- Implement ADR-002 Option A (remove `retentionPolicy: "ephemeral"` as a governance trigger and supply a default ephemeral TTL) in `032/001-governance-retention-decouple`.
- Re-run the full 24-- playbook suite against the post-fix substrate to confirm PASS/FAIL signal is real, tracked in `032/002-rerun-24-scenarios-suite`.
- Fix the three `@modelcontextprotocol/sdk/*` missing-module errors blocking `npm run build` in `mcp_server/`, tracked in `032/003-mcp-server-build-fix`.
- Explicitly clean up the 24 historical failed embeddings that survived the retry throughput increase, tracked in `032/004-failed-embedding-cleanup`.
- Add circuit-breaker instrumentation to surface when and why it flaps under high retry load, tracked in `032/005-stability-instrumentation`.
- Execute the original five-batch model-name-purge scope from 022 (Nomic, MiniLM, hardcoded sqlite paths, ONNX cleanup, generated-asset regeneration) as a separate audit packet once the substrate is stable.
