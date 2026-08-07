---
title: "Tasks: Phase 9 — Cocoindex IPC Fix"
description: "Task list for diagnosing msgspec truncation in cocoindex_code search responses and the related daemon-stall-at-1335-markdown-rows issue."
trigger_phrases:
  - "009 tasks cocoindex IPC"
  - "T001 T012 cocoindex IPC fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/009-cocoindex-ipc-fix"
    last_updated_at: "2026-05-12T21:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Search-only daemon path patched and verified against isolated source daemon"
    next_safe_action: "Patch Rust core indexing blocker"
    blockers:
      - "Explicit refresh/index still fails in cocoindex._internal.core.abi3.so: RuntimeError: Operation not permitted (os error 1)"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140090a8b0c0000000000000000000000000000000000000000000000000003"
      session_id: "014-009-cocoindex-ipc-2026-05-12"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9 — Cocoindex IPC Fix

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

- [x] T001 Establish minimal failing repro: `cocoindex_code.search query="x" refresh_index=false limit=1` → record exact error + timing
- [x] T002 Capture daemon.log snapshot at the time of failing call (rotate or copy `~/.cocoindex_code/daemon.log` to scratch)
- [x] T003 [P] Test direct sqlite-vec KNN against the same DB to confirm data is healthy (ground truth)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add daemon-side instrumentation: log encoded-bytes length + first 200 hex prefix before `send_bytes` in `_handle_search` (`cocoindex_code/daemon.py`)
- [x] T005 Add client-side instrumentation: log received-bytes length + first 200 hex BEFORE `decode_response` in `client.py:search`
- [x] T006 Reproduce with instrumentation; compare daemon-write bytes vs client-read bytes
- [x] T007 Isolate truncation site (daemon encode / OS socket / client recv); patch the narrowest fix
- [x] T008 [P] Daemon-stall investigation: trace per-language indexing pipeline; identify why it stops at markdown
- [B] T009 If daemon stall is a separate bug: split into a new 010 packet OR fold into this packet's scope
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Search returns `success=true` with ≥1 result on a known-token query
- [B] T011 Daemon completes indexing of source-code languages (.py/.ts/.js/.go/.rs) past the 1335-markdown stall
- [x] T012 Direct sqlite-vec KNN still returns equivalent results (no data regression)
- [x] T013 p95 search latency under 500ms (no large regression vs pre-Setup-A Voyage baseline)
- [x] T014 Strict validate exits 0
- [ ] T015 Update parent `graph-metadata.json` (`derived.last_active_child_id = "...009-cocoindex-ipc-fix"` while active; `derived.status = "completed"` post-merge)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Search and indexing both work end-to-end under Setup A
- [ ] Strict validate exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../004-vec-store-rebuild/implementation-summary.md` §Known Limitations 8-10 describe the bugs this packet addresses
- **Successor**: `../006-bge-m3-hybrid-evaluation/` (gated by this)
<!-- /ANCHOR:cross-refs -->
