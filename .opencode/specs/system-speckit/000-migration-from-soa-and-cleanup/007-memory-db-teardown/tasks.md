---
title: "Tasks: Gated teardown of the system-speckit memory, vector, and eval databases"
description: "Task breakdown for the gated stop-daemons / delete-named-set / optional-rebuild teardown of the memory, vector, and eval databases."
trigger_phrases:
  - "memory db teardown tasks"
  - "context-index sqlite delete tasks"
  - "vectors eval wipe tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored three-phase gated teardown tasks"
    next_safe_action: "Await phase 006 gate and wipe confirmation"
    blockers:
      - "Blocked until system-speckit/000-migration-from-soa-and-cleanup phase 006 (research) has durably saved research.md."
      - "Blocked on a fresh explicit operator 'wipe it' confirmation captured at execution time — never auto-runs."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite"
      - ".opencode/skills/system-spec-kit/mcp_server/database/vectors/"
      - ".opencode/skills/system-spec-kit/mcp_server/database/speckit-eval.db"
      - ".opencode/skills/system-spec-kit/mcp_server/data/search-decisions.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-memory-db-teardown-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Task ordering follows plan.md: gates + daemon stop, then delete, then verify — this is fixed by the brief, not a planning choice."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gated teardown of the system-speckit memory, vector, and eval databases

<!-- SPECKIT_LEVEL: 2 -->

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

*Gates + daemon stop.*

- [B] T001 Confirm `system-speckit/000-migration-from-soa-and-cleanup` phase 006 (research) has durably saved `research.md` — BLOCKED, phase 006 not yet authored at scaffold time
- [B] T002 Capture a fresh, explicit operator "wipe it" confirmation at the literal moment execution begins — BLOCKED, cannot be obtained in advance
- [ ] T003 Stop the `mk_spec_memory` daemon(s) (`.opencode/bin/mk-spec-memory-launcher.cjs`)
- [ ] T004 Verify via `ps aux | grep -i mk-spec-memory-launcher` that no process remains
- [ ] T005 Stop the `mk_code_index` daemon(s) (`.opencode/bin/mk-code-index-launcher.cjs`)
- [ ] T006 Verify via `ps aux | grep -i mk-code-index-launcher` that no process remains
- [ ] T007 Record a pre-delete size/mtime baseline for the excluded databases (`code-graph.sqlite`, `skill-graph*.sqlite`, `council-graph.sqlite`, `deep-loop-graph.sqlite`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Delete the named set only.*

- [B] T008 Delete `context-index.sqlite` and its `.lock`/`.lock-info.json`/`.lock-journal` siblings (`.opencode/skills/system-spec-kit/mcp_server/database/`)
- [B] T009 [P] Delete the 3 vector shard `.sqlite{,-shm,-wal}` files under `vectors/`, preserving `README.md`/`.gitkeep`
- [B] T010 [P] Delete `speckit-eval.db{,-shm,-wal}`
- [B] T011 [P] Delete `.memory-drift-dirty-paths.json` and its `.processing-*` sibling
- [B] T012 [P] Delete `search-decisions.jsonl` and its `.rotated` sibling from `.opencode/skills/system-spec-kit/mcp_server/data/`
- [B] T013 Resolve REQ-007 (`git rm` vs. plain `rm` for the two tracked `checkpoints/*/manifest.json` files), then delete the two `checkpoints/*/` snapshot subdirectories, preserving `checkpoints/README.md`
- [B] T014 Delete `/tmp/mk-spec-memory/daemon-ipc.sock`, only after re-confirming (T004) the owning process has exited

All Phase 2 tasks are `[B]` blocked pending T001/T002/T003-T006, since deletion must not start before the gates clear and the daemons are confirmed stopped.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Confirm every path in the named delete set is gone (`ls -la` per directory: `database/`, `database/vectors/`, `database/checkpoints/`, `data/`, `/tmp/mk-spec-memory/`)
- [ ] T016 Confirm every excluded database is byte-for-byte unchanged vs. the T007 baseline
- [ ] T017 Resolve REQ-008 (whether `/tmp/mk-spec-memory/hf-embed.sock` / `hf-embed-respawn.lock` are in scope) and document the decision
- [ ] T018 Document in `implementation-summary.md` exactly what was deleted, what is rebuildable via `/doctor:update`, and what is permanently lost (eval history, `memory:learn` constitutional-rule provenance, drift/search-decision audit trails)
- [ ] T019 If the operator wants a working index restored, run `/doctor:update` and confirm the daemon restarts cleanly against the now-empty index
- [ ] T020 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (T001/T002/T008-T014 currently blocked on the phase 006 gate and the fresh operator confirmation gate)
- [ ] Manual verification passed (T015-T016)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
