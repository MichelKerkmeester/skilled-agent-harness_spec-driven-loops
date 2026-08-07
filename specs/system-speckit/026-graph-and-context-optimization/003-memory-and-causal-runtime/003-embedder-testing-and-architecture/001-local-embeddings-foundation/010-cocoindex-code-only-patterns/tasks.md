---
title: "Tasks: Phase 10 — Cocoindex Code-Only Patterns"
description: "Edit settings.yml + DEFAULT_INCLUDED_PATTERNS, delete DB, restart daemon, reindex, verify zero doc-format chunks."
trigger_phrases:
  - "010 tasks code-only patterns"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/010-cocoindex-code-only-patterns"
    last_updated_at: "2026-05-13T06:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks drafted; rebuild in flight"
    next_safe_action: "Wait for rebuild + verify"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140100c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-010-code-only-2026-05-13"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10 — Cocoindex Code-Only Patterns

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

- [x] T001 Inspect current `.cocoindex_code/settings.yml` `include_patterns` (confirm `.md`, `.mdx`, `.txt`, `.rst` present)
- [x] T002 Inspect `cocoindex_code/settings.py` `DEFAULT_INCLUDED_PATTERNS` (confirm same)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove `**/*.md`, `**/*.mdx`, `**/*.txt`, `**/*.rst` from `.cocoindex_code/settings.yml`
- [x] T004 Remove same 4 entries from `cocoindex_code/settings.py` `DEFAULT_INCLUDED_PATTERNS` + add comment referencing 014/010
- [x] T005 `pkill -9 ccc` to remove any stale daemon (so the next `ccc index` spawns fresh under new settings)
- [x] T006 `rm .cocoindex_code/target_sqlite.db` to force clean rebuild under new patterns
- [x] T007 `ccc index` to spawn new daemon + start clean reindex
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Wait for rebuild completion (~30-60 min)
- [ ] T009 Verify zero rows for markdown / mdx / text / rst:
  ```python
  cur.execute("SELECT COUNT(*) FROM code_chunks_vec WHERE language IN ('markdown','mdx','text','rst')")
  assert cur.fetchone()[0] == 0
  ```
- [ ] T010 Verify code languages still indexed (python, typescript, javascript, bash present)
- [ ] T011 Capture pre-vs-post total chunk count in implementation-summary
- [ ] T012 Strict validate exits 0
- [ ] T013 Update parent `graph-metadata.json` (`derived.last_active_child_id` rotation)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-2 tasks `[x]`
- [ ] All Phase 3 tasks `[x]` (rebuild + verify pending)
- [ ] Strict validate exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../004-vec-store-rebuild/implementation-summary.md` + `../009-cocoindex-ipc-fix/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
