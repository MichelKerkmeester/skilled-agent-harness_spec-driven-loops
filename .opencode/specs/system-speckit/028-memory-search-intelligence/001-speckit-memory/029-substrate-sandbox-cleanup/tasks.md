---
title: "Tasks: Substrate Stress Harness Sandbox Cleanup [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "substrate sandbox cleanup"
  - "substrate stress harness"
  - "hermetic code graph db cleanup"
  - "sandbox clean flag"
  - "vitest afterall sandbox reap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/029-substrate-sandbox-cleanup"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all sandbox-cleanup tasks for the harness and the test"
    next_safe_action: "Revert the two files if a future run needs the persisted sandbox evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Substrate Stress Harness Sandbox Cleanup

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

- [x] T001 Confirmed the harness writes its evidence, scratch, and the hermetic code-graph DB into `_sandbox/24--local-llm-query-intelligence/` under `REPO_ROOT`, and the DB must stay inside the repo root for the launcher path guard (`.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`)
- [x] T002 Confirmed the test reads the summary TSV after the subprocess exits, so the run-dir cleanup must not run inside the harness when the test is the runner (`.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts`)
- [x] T003 Named the run dir once with a `SANDBOX_RUN_DIR` constant (`.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Added the `--clean` flag to `parseArgs`, defaulting to false, for standalone manual runs that do not need the persisted evidence (`.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`)
- [x] T005 Added the `cleanupSandbox({ clean })` helper that always removes the throwaway hermetic code-graph DB and, when `clean` is true, removes the run dir and then the now-empty `_sandbox/` parent with an `rmdir` that fails closed, all best-effort in try/catch (`.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`)
- [x] T006 Called `cleanupSandbox({ clean })` in the `main()` `finally` block so it runs on every run (`.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`)
- [x] T007 Added the `afterAll` import and an `afterAll` reap that removes the run dir and the empty parent after the suite reads the TSV, without passing `--clean` (`.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirmed `node --check run-substrate-stress-harness.mjs` reports OK and the comment-hygiene check passes on both files with exit 0 (`.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`)
- [x] T009 Confirmed a standalone `node <harness> --clean --scenarios 410 --no-stderr-log` run exits 0 with the `_sandbox` folder fully removed afterward, and `npm run stress:substrate` reports the suite passing with `_sandbox` gone after the run, proving the `afterAll` reap fired only after the TSV was read (`.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
