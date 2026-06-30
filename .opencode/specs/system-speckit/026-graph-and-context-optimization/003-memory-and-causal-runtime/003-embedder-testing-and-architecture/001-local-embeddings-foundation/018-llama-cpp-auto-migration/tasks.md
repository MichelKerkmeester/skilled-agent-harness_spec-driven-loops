---
title: "Tasks: 018 llama-cpp auto-migration"
description: "Task ledger for pre-flight, migration script refactor, factory refactor, startup hook, tests, docs, and packet close-out."
trigger_phrases:
  - "018 llama cpp tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/018-llama-cpp-auto-migration"
    last_updated_at: "2026-05-13T12:01:28Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded completed task ledger"
    next_safe_action: "Review implementation-summary.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:2180180180180180180180180180180180180180180180180180180180180180"
      session_id: "018-llama-cpp-auto-migration-2026-05-13"
      parent_session_id: "018-llama-cpp-auto-migration-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->
# Tasks: 018 llama-cpp auto-migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Symbol | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Not completed |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T000 | Read critical files and quote `warnIfMigrationPending()` | Done | `scratch/pre-flight-notes.md` |
| T001 | Confirm node-llama-cpp and GGUF model loadability | Done | ESM import sanity printed `ok`; model exists |
| T010 | Export `runMigration()` | Done | migration script export present |
| T011 | Add target already-populated no-op | Done | script and factory skip paths |
| T012 | Export migration status/result types | Done | `MigrationStatus`, `MigrationResults` |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T020 | Replace warning with `runAutoMigrationIfNeeded()` | Done | factory export present |
| T021 | Add opt-out env var handling | Done | `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` |
| T022 | Preserve old warning under opt-out | Done | test asserts exact string |
| T030 | Wire context server hook before DB init | Done | startup awaits migration before `vectorIndex.initializeDb()` |
| T031 | Add failed-migration fallback | Done | startup sets `EMBEDDINGS_PROVIDER=hf-local` and re-resolves config |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| T040 | Add auto-migration Vitest coverage | Done | five scenarios in `embeddings-auto-migration.vitest.ts` |
| T041 | Run targeted Vitest | Done | `scratch/test-output.txt`: 5 passed |
| T042 | Capture test output | Done | `scratch/test-output.txt` |
| T050 | Update `.env.example` | Done | auto-migration block added |
| T051 | Update MCP README | Done | Migration section added |
| T052 | Add runtime config notes | Done | Codex, Claude, Gemini, OpenCode |
| T053 | Spot-check write scope | Done | final `git status --short -- <allowed paths>` check |
| T060 | Author packet docs | Done | seven Level 2 docs present |
| T061 | Strict validate packet | Done | strict validator exited 0 with 0 warnings |
| T062 | Update parent metadata | Done | parent graph metadata points to 018 |
| T063 | Optional smoke | Done | `scratch/end-to-end-smoke.log` captures START and COMPLETE |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] Auto-migration is synchronous in startup before database init.
- [x] Successful migration validates before deletion.
- [x] Failure preserves source and falls back to `hf-local`.
- [x] Opt-out preserves old warning text.
- [x] Targeted Vitest passes all five scenarios.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `scratch/pre-flight-notes.md`
- `scratch/test-output.txt`
- `../017-llama-cpp-default-flip/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
