---
title: "Verification Checklist: 017 llama-cpp default flip"
description: "Verification evidence for migration, default decision, runtime configs, benchmarks, smoke, rollback, docs, and scope discipline."
trigger_phrases:
  - "017 llama cpp checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/017-llama-cpp-default-flip"
    last_updated_at: "2026-05-13T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded verification checklist"
    next_safe_action: "Use implementation-summary.md for final metrics"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:3170170170170170170170170170170170170170170170170170170170170170"
      session_id: "017-llama-cpp-default-flip-2026-05-13"
      parent_session_id: "017-llama-cpp-default-flip-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 017 llama-cpp default flip

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Must pass or force rollback |
| **[P1]** | Required evidence | Must complete or document |
| **[P2]** | Optional evidence | Can defer if justified |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Factory/provider code read before edits.
  - **Evidence**: `scratch/pre-flight-notes.md`.
- [x] CHK-002 [P0] Existing sqlite store inventoried.
  - **Evidence**: `scratch/migration-targets.md`: source store 2488 rows, 92.29 MiB.
- [x] CHK-003 [P0] Allowed write scope respected.
  - **Evidence**: final touched file list is within the implementation contract.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `llama-cpp` remains explicit provider path and auto-selected when installed.
  - **Evidence**: `EMBEDDINGS_PROVIDER=llama-cpp` benchmark and MCP smoke both execute.
- [x] CHK-011 [P0] Auto mode cascades through Voyage -> OpenAI -> llama-cpp -> hf-local.
  - **Evidence**: `resolveProvider()` selects llama-cpp when the GGUF runtime is installed and falls through to `hf-local` when it is unavailable.
- [x] CHK-012 [P1] Slug follows dtype convention.
  - **Evidence**: migrated sqlite path uses `__768__q8.sqlite`.
- [x] CHK-013 [P1] Migration script is idempotent.
  - **Evidence**: script skips migrated rows and validates sample rows; final clean run reports zero mismatches.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:migration -->
## Migration

- [x] CHK-020 [P0] Source row count recorded.
  - **Evidence**: `source_rows=2488`.
- [x] CHK-021 [P0] Target row count matches source.
  - **Evidence**: `target_rows=2488`.
- [x] CHK-022 [P0] Validation mismatches are zero.
  - **Evidence**: `mismatches=0`.
- [x] CHK-023 [P1] Wall-clock recorded.
  - **Evidence**: `wall_clock_seconds=130.117`.
- [x] CHK-024 [P0] Source sqlite retained.
  - **Evidence**: no delete command was run against the hf-local sqlite.
<!-- /ANCHOR:migration -->

---

<!-- ANCHOR:quality-gate -->
## Retrieval Quality Gate

- [x] CHK-030 [P0] 1k probe ran with 100 queries.
  - **Evidence**: `corpus_size=1000`, `query_count=100`.
- [x] CHK-031 [P0] Recall@5 overlap recorded.
  - **Evidence**: `0.926`.
- [x] CHK-032 [P0] Spearman top-10 recorded.
  - **Evidence**: `0.816125`.
- [x] CHK-033 [P0] Verdict and operator decision control default.
  - **Evidence**: verdict `MILD_DIVERGENCE`; operator accepted the mild divergence and kept llama-cpp in the auto cascade with hf-local fallback.
- [x] CHK-034 [P1] MRR delta recorded.
  - **Evidence**: `0.000455`.
<!-- /ANCHOR:quality-gate -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-035 [P0] Shared and MCP builds pass.
  - **Evidence**: `npm run build` exits 0 in both packages.
- [x] CHK-036 [P0] Scripts typecheck passes.
  - **Evidence**: `cd .opencode/skills/system-spec-kit/scripts && npm run typecheck` exits 0.
- [x] CHK-037 [P1] Config syntax validation passes.
  - **Evidence**: JSON configs parse and `.codex/config.toml` passes the local syntax check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-038 [P0] The default flip resolves to the accepted auto cascade.
  - **Evidence**: auto mode resolves through cloud keys, then llama-cpp when the GGUF runtime is installed, then hf-local.
- [x] CHK-039 [P0] Explicit llama-cpp remains usable.
  - **Evidence**: benchmark and MCP smoke both use explicit llama-cpp.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:benchmark -->
## Benchmark

- [x] CHK-040 [P1] hf-local final p50 recorded.
  - **Evidence**: `35.956375ms`.
- [x] CHK-041 [P1] llama-cpp final p50 recorded.
  - **Evidence**: `6.027083ms`.
- [x] CHK-042 [P1] RSS recorded.
  - **Evidence**: hf-local `1772.266 MB`, llama-cpp `1200.781 MB`.
<!-- /ANCHOR:benchmark -->

---

<!-- ANCHOR:runtime -->
## Runtime And Smoke

- [x] CHK-050 [P0] Codex config notes final auto cascade.
  - **Evidence**: `.codex/config.toml`.
- [x] CHK-051 [P0] Claude config notes final auto cascade.
  - **Evidence**: `.claude/mcp.json`.
- [x] CHK-052 [P0] Gemini config notes final auto cascade.
  - **Evidence**: `.gemini/settings.json`.
- [x] CHK-053 [P0] OpenCode config notes final auto cascade.
  - **Evidence**: `opencode.json`.
- [x] CHK-054 [P1] MCP smoke uses actual launcher path.
  - **Evidence**: `scratch/end-to-end-smoke.md` records JSON-RPC stdio launcher path and PASS.
<!-- /ANCHOR:runtime -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-060 [P0] No sub-agents used.
  - **Evidence**: `SPAWN_AGENT_USED=no`.
- [x] CHK-061 [P0] No git operations performed.
  - **Evidence**: no `git add`, `git commit`, or `git push` commands.
- [x] CHK-062 [P0] No archival files created.
  - **Evidence**: no `.bak`, `_deprecated`, or commented-out archival changes.
- [x] CHK-063 [P0] No cocoindex changes.
  - **Evidence**: no cocoindex files edited.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-064 [P0] Packet docs contain real metrics.
  - **Evidence**: implementation summary records migration, probe, bench, and smoke values.
- [x] CHK-065 [P1] README and env docs reflect llama-cpp auto-selection when installed.
  - **Evidence**: `.env.example` and MCP README describe the Voyage -> OpenAI -> llama-cpp -> hf-local cascade.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P0] Required Level 2 docs present.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`.
- [x] CHK-071 [P0] Metadata files present.
  - **Evidence**: `description.json`, `graph-metadata.json`.
- [x] CHK-072 [P0] Strict validation exits 0.
  - **Evidence**: final strict validator run.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Migration and explicit llama-cpp execution are sound. Operator accepted MILD_DIVERGENCE; llama-cpp stays in the auto cascade when the GGUF runtime is installed, and hf-local remains the fallback.
<!-- /ANCHOR:summary -->
