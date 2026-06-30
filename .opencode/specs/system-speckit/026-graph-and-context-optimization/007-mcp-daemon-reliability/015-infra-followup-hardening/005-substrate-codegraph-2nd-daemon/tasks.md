---
title: "Tasks: Wire a second live code-graph daemon into the substrate stress harness"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "substrate code-graph 2nd daemon tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/005-substrate-codegraph-2nd-daemon"
    last_updated_at: "2026-05-31T05:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored tasks to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003657"
      session_id: "036-005-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Wire a second live code-graph daemon into the substrate stress harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Capture baseline: at HEAD (change stashed) `npm run stress:substrate` is RED (`1 failed | 2 passed`, the runner-harness file)
- [x] T002 Standalone probe: dedicated mk-code-index daemon connects, exposes code_graph_context, a real call returns content (isError=false)
- [x] T003 Root-cause the red baseline from daemon stderr: sun_path EINVAL on in-database socket; confirm allowlist (cwd / os.tmpdir() / /tmp)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `import os`; add CODE_INDEX_DAEMON_STDERR_LOG + `shortSocketDir(slug)` helper that creates os.tmpdir() subdir (run-substrate-stress-harness.mjs)
- [x] T005 Pass SPECKIT_IPC_SOCKET_DIR=shortSocketDir('mem') to the memory daemon env (run-substrate-stress-harness.mjs)
- [x] T006 Add 2nd connectSharedClient for mk-code-index (shortSocketDir('cg'), bridge disabled, maintainer mode off); register in clients + toolNameSets (run-substrate-stress-harness.mjs)
- [x] T007 Extend selectClientForServer to route mk_code_index / mk-code-index (run-substrate-stress-harness.mjs)
- [x] T008 Sync vitest description + 2 stale comments to the two-daemon reality (substrate-runner-harness.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 node --check the harness; harness run → 403=PASS 404=PASS 407=PASS 410=PASS, 0 runner-FAIL
- [x] T010 `npm run stress:substrate` green 3x consecutive (no external env, clean marker each): Test Files 3 passed, Tests 9 passed
- [x] T011 Stash-compare: at HEAD the suite is RED, with the change it is GREEN → confirms the change is the fix
- [x] T012 graph-metadata dirty count 0 before/after every run; comment-hygiene 0; assertions byte-unchanged (vitest +8/-8 comments only)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Two real daemons; 403/404/407 PASS; green by default
- [x] Vitest green 3x; no mass-write; hygiene clean
- [x] Packet strict-validate exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../002-substrate-codegraph-scenarios/` (scenario schema fix)
- **Harness**: `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`
<!-- /ANCHOR:cross-refs -->
