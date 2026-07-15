---
title: "Checklist: 016/002/006 Ollama encode-path wiring"
description: "Level 2 verification checklist for the shared Ollama query encode path."
trigger_phrases: ["016/006 checklist", "ollama encode path checklist"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring"
    last_updated_at: "2026-05-18T19:15:12Z"
    last_updated_by: "codex"
    recent_action: "Completed Level 2 checklist"
    next_safe_action: "Commit after validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts"
      - ".opencode/skills/system-spec-kit/references/memory/embedder_architecture.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-006-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Checklist: 016/002/006 Ollama encode-path wiring

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified: Ollama, SQLite metadata, package build.
- [x] CHK-004 [P1] Read factory, adapter, registry, profile, and caller surfaces before editing.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] MCP server typecheck passed.
- [x] CHK-011 [P0] Factory/provider code avoids hardcoded secrets and destructive writes.
- [x] CHK-012 [P1] Error handling implemented for unreachable Ollama and dim mismatch.
- [x] CHK-013 [P1] Code follows existing provider/factory patterns.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Explicit Ollama provider returns 1024-dim Jina vectors.
- [x] CHK-021 [P0] Active metadata auto-selects Ollama when `vec_1024` has rows.
- [x] CHK-022 [P1] Missing `vec_1024` table falls back instead of selecting Ollama.
- [x] CHK-023 [P1] Existing Ollama adapter tests still pass.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: cross-consumer encode/index symmetry bug.
- [x] CHK-FIX-002 [P0] Producer inventory completed: shared factory and registry adapter paths.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `generateEmbedding`, `generateDocumentEmbedding`, `generateQueryEmbedding`, and provider metadata.
- [x] CHK-FIX-004 [P0] SQLite table-name and metadata checks use fixed keys and validated dimensions.
- [x] CHK-FIX-005 [P1] Matrix axes listed: explicit provider, active pointer, missing active table, existing adapter.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variants covered by tests that mutate `process.env`.
- [x] CHK-FIX-007 [P1] Evidence pinned to local verification commands in `implementation-summary.md`.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] SQLite metadata reads are read-only.
- [x] CHK-032 [P1] Ollama base URL defaults locally and can be overridden by `OLLAMA_BASE_URL`.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and implementation summary synchronized.
- [x] CHK-041 [P1] Architecture doc added at `references/memory/embedder_architecture.md`.
- [x] CHK-042 [P2] Provider README and SKILL routing map updated.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files limited to test-created OS temp directories.
- [x] CHK-051 [P1] No scratch artifacts left in the packet.
- [x] CHK-052 [P1] Commit handoff lists all source, dist, docs, tests, and spec files.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-18

<!-- /ANCHOR:summary -->
