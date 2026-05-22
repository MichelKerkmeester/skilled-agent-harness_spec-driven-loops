---
title: "Tasks: 003 — Script Shim + DB Relocation"
description: "Task breakdown for authoring 4 .cjs entry points, relocating deep-loop-graph.sqlite, smoke-testing, and ADR-001 publication. Each task lists its file path, effort, and dependencies."
trigger_phrases:
  - "118/003 tasks"
  - "script shim tasks"
  - "deep-loop DB relocation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/003-script-shim-and-db-relocation"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored tasks.md scaffold"
    next_safe_action: "Execute task T001 after phase 002 closes"
    blockers:
      - "phase-002-incomplete"
    completion_pct: 5
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180031180031180031180031180031180031180031180031180031180030003"
      session_id: "118-003-tasks-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: 003 — Script Shim + DB Relocation

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 Setup | T001-T005 | Hour 1 |
| M2 Helper + Scripts | T006-T011 | Hour 2.5 |
| M3 DB Relocated | T012-T014 | Hour 3 |
| M4 Smoke Tests | T015-T024 | Hour 4 |
| M5 ADR + Validate | T025-T030 | Hour 5 |

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Milestone M1]

- [ ] T001 Confirm phase 002 closeout (`ls .opencode/skills/deep-loop-runtime/lib/coverage-graph/`) [10m]
- [ ] T002 Capture baseline row counts from current `deep-loop-graph.sqlite` (record per-table counts in scratch) [15m]
- [ ] T003 Confirm `better-sqlite3` driver version + CJS import pattern (matches MCP server usage) [10m] {deps: T001}
- [ ] T004 [P] Create `.opencode/skills/deep-loop-runtime/scripts/_lib/` directory [5m]
- [ ] T005 [P] Create `.opencode/skills/deep-loop-runtime/storage/` directory + `.gitignore` entry as needed [5m]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Milestone M2 + M3]

### Shared Helper
- [ ] T006 Author `_lib/db-open.cjs` exporting `openDatabase(path)` and `withDatabase(path, fn)` (`.opencode/skills/deep-loop-runtime/scripts/_lib/db-open.cjs`) [30m] {deps: T003}
- [ ] T007 Verify `withDatabase` uses `try/finally` so `db.close()` runs on throw [10m] {deps: T006}

### Script Entry Points (parallelizable)
- [ ] T008 [P] Author `convergence.cjs` (calls `computeConvergence()` from `lib/coverage-graph/`) (`.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`) [40m] {deps: T006}
- [ ] T009 [P] Author `upsert.cjs` (accepts `--events <file>` and `--events -` for stdin) (`.opencode/skills/deep-loop-runtime/scripts/upsert.cjs`) [45m] {deps: T006}
- [ ] T010 [P] Author `query.cjs` (read-only graph query entry point) (`.opencode/skills/deep-loop-runtime/scripts/query.cjs`) [35m] {deps: T006}
- [ ] T011 [P] Author `status.cjs` (schema version + row count + health) (`.opencode/skills/deep-loop-runtime/scripts/status.cjs`) [30m] {deps: T006}

### DB Relocation
- [ ] T012 Copy `deep-loop-graph.sqlite` from old MCP-server path to `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite` (use `cp -p`) [10m] {deps: T005}
- [ ] T013 Verify row counts per table match baseline from T002 (sqlite3 CLI assertions) [15m] {deps: T012}
- [ ] T014 Verify schema string matches baseline (`sqlite3 .schema` diff) [10m] {deps: T013}

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [Milestone M4 + M5]

### Smoke Tests (parallelizable)
- [ ] T015 [P] Smoke `convergence.cjs --spec-folder <fixture> --session-id <id>` → exit 0, JSON parseable [10m] {deps: T008, T013}
- [ ] T016 [P] Smoke `upsert.cjs --spec-folder X --events <file>` → exit 0 + event persisted [10m] {deps: T009, T013}
- [ ] T017 [P] Smoke `query.cjs --spec-folder X --query <q>` → exit 0 + result JSON [10m] {deps: T010, T013}
- [ ] T018 [P] Smoke `status.cjs --spec-folder X` → exit 0 + `{ ok: true, schemaVersion, rowCount }` [5m] {deps: T011, T013}

### Fault Injection
- [ ] T019 [P] Missing `--spec-folder` → exit 3 + `{ code: "MISSING_FLAG" }` (each of 4 scripts) [15m] {deps: T015..T018}
- [ ] T020 [P] Missing DB file (temporarily rename) → exit 2 + `{ code: "DB_MISSING" }` [10m] {deps: T015..T018}
- [ ] T021 [P] Malformed stdin JSON for `upsert.cjs` → exit 3 + parse error [10m] {deps: T016}
- [ ] T022 [P] `convergence.cjs` with unknown spec-folder → exit 3 with helpful message [5m] {deps: T015}

### Audit
- [ ] T023 `lsof` audit: no script holds DB handle after exit (run each script, lsof scan immediately) [20m] {deps: T015..T018}
- [ ] T024 Source review: every script calls `db.close()` in finally block; no early returns leak handles [15m] {deps: T008..T011}

### ADR + Validation
- [ ] T025 Draft ADR-001 (per-invocation DB ownership + 3 alternatives + Five Checks 5/5) (`decision-record.md`) [30m]
- [ ] T026 Verify Five Checks 5/5 PASS (simplicity, performance, maintainability, scope, sustainability) [15m] {deps: T025}
- [ ] T027 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/003-script-shim-and-db-relocation --strict` → PASS Level 3 [10m] {deps: T025}
- [ ] T028 Fill in `implementation-summary.md` with concrete what-built + verification + LOC table [20m] {deps: T023, T024, T026, T027}
- [ ] T029 Mark all `checklist.md` items `[x]` with evidence [15m] {deps: T028}
- [ ] T030 Update `graph-metadata.json` `derived.status` from `planned` → `complete` and refresh `last_save_at` via `/memory:save` [5m] {deps: T029}

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All milestones (M1-M5) achieved
- [ ] All 4 scripts smoke-test PASS
- [ ] All fault-injection paths return the documented exit code
- [ ] DB row count + schema match between old and new paths
- [ ] `lsof` audit clean (no leaked handles)
- [ ] ADR-001 status: `Accepted` with 5/5 PASS
- [ ] `validate.sh --strict` PASS Level 3
- [ ] checklist.md fully verified

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:architecture-tasks -->
## Architecture Tasks (L3)

These cross-cutting tasks are tracked outside the phase flow because they shape multiple scripts simultaneously.

- [ ] AT-001 Define stdout JSON envelope shape: `{ ok: true|false, data?, error?: { code, message, ...context } }` [15m]
- [ ] AT-002 Define exit code map: `0=ok, 1=script error, 2=DB error, 3=input validation` [10m]
- [ ] AT-003 Define DB path resolution: `path.resolve(__dirname, "../storage/deep-loop-graph.sqlite")` (CWD-independent) [10m]
- [ ] AT-004 Define stdin pipe convention for `upsert.cjs`: `--events -` triggers stdin read [10m]
- [ ] AT-005 Document SIGINT handling pattern (best-effort close; `better-sqlite3` is sync) [10m]
- [ ] AT-006 Document script header comment block (purpose, argv shape, exit codes, JSON envelope) [15m]
- [ ] AT-007 Identify shared error-class shape used across all 4 scripts [10m]

<!-- /ANCHOR:architecture-tasks -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Reference Pattern**: `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- **Predecessor Phase**: `../002-lib-runtime-migration/`
- **Successor Phase**: `../004-mcp-tool-surface-removal/`

<!-- /ANCHOR:cross-refs -->
