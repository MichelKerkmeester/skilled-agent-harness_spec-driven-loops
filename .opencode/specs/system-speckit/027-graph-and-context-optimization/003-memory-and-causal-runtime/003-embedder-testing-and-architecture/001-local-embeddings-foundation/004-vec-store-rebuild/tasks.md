---
title: "Tasks: Phase 4 — Vec-Store Rebuild"
description: "Task list for memory + cocoindex rebuild, including the wedge-recovery workaround and DELETE+rescan path that bypasses the embedding_status dedup."
trigger_phrases:
  - "004 tasks vec-store"
  - "T001 T012 vec rebuild"
  - "memory delete pending rescan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/004-vec-store-rebuild"
    last_updated_at: "2026-05-12T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks marked through memory rebuild; T009-T010 blocked"
    next_safe_action: "Run /mcp reconnect cocoindex_code"
    blockers:
      - "T008-T010 blocked on /mcp reconnect cocoindex_code"
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140040c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-004-vec-rebuild-2026-05-12"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4 — Vec-Store Rebuild

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `.env.local` loaded into MCP child (log: `[spec-kit-memory-launcher] loaded 3 env(s) from .env.local`)
- [x] T002 Confirm memory provider = `hf-local`, model = `onnx-community/embeddinggemma-300m-ONNX`, dim = 768 via `memory_health`
- [x] T003 [P] Confirm HF cache contents (Qwen3 safetensors + ONNX model variants + symlink)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete stale CocoIndex DB: `rm /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.cocoindex_code/target_sqlite.db` (2.0GB MiniLM)
- [x] T005 First `memory_index_scan` — all 2459 deferred due to MCP child provider wedge (model load stderr stopped at "Attempting device: mps"; retry-manager opened circuit breaker after 5 failures)
- [x] T006 Wedge recovery: kill launcher (pid 30540), user reconnects via `/mcp reconnect spec_kit_memory` → fresh child loads `.env.local`, lazy-loads model cleanly on first call (mps unavailable → cpu fallback, 993ms cold)
- [x] T007 DELETE+rescan workaround: direct sqlite3 `DELETE FROM memory_index WHERE embedding_status IN ('pending','retry')` (FTS auto-cascades via trigger), then `memory_index_scan` — `embedding_cache` hits avoid re-running model inference, 2112 rows finalized with `embedding_status='success'`
- [x] T008 Kill stale `ccc run-daemon` (pid 2379, started before user runtime restart, holding pre-Setup-A env)
- [x] T008a Discover cross-repo editable install drift (Public venv pointing at Barter source); `pip install -e .` from Public to self-pin; save memory note
- [x] T008b Update `~/.cocoindex_code/global_settings.yml` from `voyage/voyage-code-3` to `google/embeddinggemma-300m` / `sentence-transformers` (backup at `.pre-014-004.bak`)
- [x] T009 User ran `/mcp reconnect cocoindex_code` (twice — once before the editable-install fix, once after); fresh MCP server respawned with Setup A env
- [x] T010 `cocoindex_code.search refresh_index=true` triggered Qwen3 rebuild — daemon spawned on Metal, created `target_sqlite.db` with 768-dim schema, started indexing markdown files (1335 chunks in first 3 min)
- [B] T010a Diagnose `msgspec.DecodeError: Input data was truncated` on search responses — upstream cocoindex IPC bug, deferred to follow-on packet
- [B] T010b Profile and improve indexing rate (currently ~10 rows/s on Metal, ~10-20× slower than handover estimate) — deferred to follow-on
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Memory side verified: `memory_health` → `healthy=true`, `vecRowsTotal=2112`, `circuitBreakerOpen=false`, `queueDepth=0`; `memory_quick_search` returns hybrid result with 88.39% similarity
- [x] T012a CocoIndex schema verified: `embedding float[768]` in `code_chunks_vec` (matches EmbeddingGemma-300m native dim)
- [B] T012b CocoIndex end-to-end search verification: blocked on T010a (msgspec truncation)
- [x] T013 Update spec/plan/tasks/implementation-summary with actual outcomes + wedge incident notes
- [ ] T014 Strict validate: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/004-vec-store-rebuild --strict` exits 0
- [ ] T015 Update parent `graph-metadata.json` (`derived.last_active_child_id = "...004-vec-store-rebuild"`, `derived.status = "completed"` once cocoindex done)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 tasks marked `[x]`
- [x] Memory rebuild side of Phase 2 marked `[x]` (T004-T007)
- [ ] All `[B]` blocked tasks resolved (T009-T010, T012)
- [ ] Manual verification passed
- [ ] Strict validate exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Outcomes**: See `implementation-summary.md`
- **Predecessor**: `../003-mcp-config-rollout/implementation-summary.md`
- **Successor**: `../005-q4-quantization/` (gated on this packet's baseline)
<!-- /ANCHOR:cross-refs -->
