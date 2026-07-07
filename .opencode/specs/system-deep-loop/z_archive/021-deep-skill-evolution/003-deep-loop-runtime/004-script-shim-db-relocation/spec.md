---
title: "Feature Specification: 003 — Script Shim + DB Relocation"
description: "Create 4 .cjs script entry points replacing the 4 deep_loop_graph_* MCP tools, and relocate deep-loop-graph.sqlite ownership from system-spec-kit/mcp_server/ to .opencode/skills/deep-loop-runtime/storage/. Scripts own per-invocation open/close DB lifecycle (no daemon)."
trigger_phrases:
  - "118/003 script shim"
  - "deep-loop script shim"
  - "deep-loop DB relocation"
  - "convergence.cjs upsert.cjs query.cjs status.cjs"
  - "deep-loop-runtime storage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/003-deep-loop-runtime/004-script-shim-db-relocation"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded Level 3 spec docs for phase 003"
    next_safe_action: "Implement 4 cjs entry points after phase 002 closes"
    blockers:
      - "phase-002-incomplete"
    completion_pct: 5
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:1180031180031180031180031180031180031180031180031180031180030001"
      session_id: "118-003-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 003 — Script Shim + DB Relocation

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 003 replaces the 4 `deep_loop_graph_*` MCP tools with 4 standalone `.cjs` script entry points and relocates `deep-loop-graph.sqlite` ownership from the MCP-server-managed storage path into the new `deep-loop-runtime/` peer skill. Each script opens its own SQLite connection on invocation, performs the operation, and closes the connection before exit — the canonical "per-invocation owner" pattern already used by `deep-review/scripts/reduce-state.cjs`. This decouples deep-loop runtime from the MCP server lifecycle and removes a tool-surface contract that the 117 council had flagged as load-bearing but is now relaxable per user directive.

**Key Decisions**: Scripts own DB lifecycle per invocation (ADR-001, no shared daemon). Single-owner invariant preserved through synchronous open/close. JSON-on-stdout interface contract with deterministic exit codes (0/1/2/3).

**Critical Dependencies**: Phase 002 must land first (lib files in `deep-loop-runtime/lib/`); existing `deep-loop-graph.sqlite` must be copy-relocatable; `better-sqlite3` (or current driver) must remain compatible across CommonJS script entry points.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Scaffolded |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Estimated LOC** | ~350 (4 scripts plus shared helper plus DB cp logic) |
| **Parent Phase** | `..` (118 phase parent) |
| **Predecessor** | `002-lib-runtime-migration/` |
| **Successor** | `004-mcp-tool-surface-removal/` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 4 `deep_loop_graph_*` MCP tools (`deep_loop_graph_convergence`, `deep_loop_graph_upsert`, `deep_loop_graph_query`, `deep_loop_graph_status`) are dispatched by deep-review and deep-research workflow YAMLs through the MCP transport. After the 118 user directive, the MCP layer must be removed entirely — consumers need to invoke these operations directly without going through `mk_spec_memory` tool dispatch. At the same time, `deep-loop-graph.sqlite` currently lives under `system-spec-kit/mcp_server/storage/` where the MCP server manages its lifecycle. With the MCP handlers removed, the DB no longer has a stable owner.

### Purpose

Author 4 `.cjs` script entry points in `.opencode/skills/deep-loop-runtime/scripts/` that mirror the 4 MCP tool semantics exactly (JSON in, JSON out, deterministic exit codes), and move the SQLite file into the runtime skill's `storage/` directory where each script opens and closes its own connection per invocation. This shifts the DB lifecycle owner from "MCP server process" to "per-invocation script" — the same proven pattern as `reduce-state.cjs`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` (replaces `mcp__mk_spec_memory__deep_loop_graph_convergence`)
- Create `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` (replaces `_upsert`)
- Create `.opencode/skills/deep-loop-runtime/scripts/query.cjs` (replaces `_query`)
- Create `.opencode/skills/deep-loop-runtime/scripts/status.cjs` (replaces `_status`)
- Author a small shared helper (`scripts/lib/db-open.cjs` or inline in each script) for `better-sqlite3` open + close discipline
- Copy existing `deep-loop-graph.sqlite` from current MCP-server-managed location into `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite` (preserving rows + schema)
- Each script requires lib code via the new `deep-loop-runtime/lib/coverage-graph/` and `deep-loop-runtime/lib/deep-loop/` paths (established by phase 002)
- Define interface contract (argv flags, stdin JSON, stdout JSON, exit code semantics) for each script
- Smoke-test each script invocation in isolation against a sample input fixture
- ADR-001 documenting per-invocation DB ownership choice plus alternatives plus Five Checks evaluation

### Out of Scope

- Removing the 5 MCP handler files plus 4 tool schema entries (phase 004)
- Updating workflow YAMLs to reference these scripts (phase 005)
- Updating `/doctor` plus `system-code-graph` playbook collateral (phase 006)
- Test migration (phase 007)
- Final verification plus changelog (phase 008)
- Removing old `deep-loop-graph.sqlite` from MCP-server location (deferred to phase 008 closeout window)
- Renaming the SQLite file or changing schema
- Refactoring deep-loop runtime semantics (this is interface translation only)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Create | Convergence calculation entry point |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Create | Graph event upsert entry point |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Create | Graph state query entry point |
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | Create | DB health/readiness check |
| `.opencode/skills/deep-loop-runtime/scripts/lib/db-open.cjs` | Create | Shared open + close + error helper (optional inline) |
| `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite` | Create (copy) | Relocated SQLite DB from old MCP-server-managed path |
| `.opencode/skills/deep-loop-runtime/storage/.gitignore` | Create | Ignore DB binary if needed (matches existing pattern) |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 4 .cjs script files exist with valid CommonJS shape | `node -c <script>` passes for each; each starts with shebang `#!/usr/bin/env node` |
| REQ-002 | Each script opens plus closes its own DB connection | Source review shows synchronous `db.close()` in all exit paths including error handlers |
| REQ-003 | Scripts parse `--spec-folder` and `--session-id` argv flags | Invoking with missing flags returns exit code 3 plus JSON error |
| REQ-004 | Scripts emit JSON on stdout, exit code 0 on success | Smoke test: each script with valid input prints parseable JSON and exits 0 |
| REQ-005 | DB is relocated, not regenerated | `sqlite3 .../storage/deep-loop-graph.sqlite "SELECT count(*) FROM <known-table>"` matches old DB count |
| REQ-006 | Single-owner invariant preserved | No two scripts can hold the DB simultaneously by design (synchronous open/close per invocation) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Exit code semantics match contract | 0=ok, 1=script error, 2=DB error, 3=input validation error, verified via fault injection |
| REQ-008 | Scripts callable from any CWD | Each resolves DB path via `require.resolve` or `path.resolve(__dirname, ...)`, not relative-to-CWD |
| REQ-009 | Error output is structured JSON on stdout, human-readable on stderr | `{ ok: false, error: { code, message } }` on stdout when exit is non-zero |
| REQ-010 | `convergence.cjs` calls the existing `computeConvergence()` library function unchanged | Imports from `deep-loop-runtime/lib/coverage-graph/` established in phase 002 |
| REQ-011 | `upsert.cjs` accepts events via `--events <json-file>` flag OR stdin pipe | Both modes smoke-tested |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 scripts smoke-test green against fixture inputs before phase 004 begins
- **SC-002**: DB row count plus schema match between old and new SQLite locations (verified with `sqlite3` queries)
- **SC-003**: No script holds a DB handle longer than the duration of its computation (verified by `lsof` or source audit)
- **SC-004**: Each script handles JSON parse errors, missing tables, and missing DB file with the correct exit code
- **SC-005**: ADR-001 published with Five Checks 5/5 PASS

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 (lib runtime migration) | Cannot require lib code | Verify lib path exists plus tsc clean before starting 003 |
| Dependency | `better-sqlite3` driver compatibility | Script open/close may differ from MCP-server usage | Verify version pin matches; use the same import surface |
| Risk | DB cp truncation or partial copy | Data loss between locations | Use `cp -p` plus post-cp row-count check; do NOT delete old DB until phase 008 |
| Risk | CWD-relative path bug | Scripts break when invoked from workflow YAMLs | All paths resolved via `__dirname` |
| Risk | Stale lock file from previous MCP-server access | New script fails to open DB | Document recovery: delete `*.sqlite-shm` and `*.sqlite-wal` if present |
| Risk | Race condition if old MCP handler still alive | Two writers | Phase 004 deletes old handlers; 003 never runs concurrent with old handler in production |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Script cold start (open DB, compute, close) under 200 ms for `status.cjs`
- **NFR-P02**: `convergence.cjs` completes under 2 s on a typical iteration record (matches existing MCP handler latency budget)
- **NFR-P03**: `upsert.cjs` handles 100 events per invocation under 500 ms

### Reliability
- **NFR-R01**: Scripts must close DB on every exit path (normal, error, SIGINT)
- **NFR-R02**: No transient state cached between invocations (each script is fully self-contained)
- **NFR-R03**: Stale lock files do not corrupt the DB (rely on `better-sqlite3` open-time recovery)

### Observability
- **NFR-O01**: Each script logs its invocation arguments plus DB path on stderr at INFO level
- **NFR-O02**: Errors include enough context to diagnose without DB inspection

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Input Boundaries
- **Missing argv flags**: Exit 3 with `{ ok: false, error: { code: "MISSING_FLAG", flag: "<name>" } }`
- **Malformed JSON on stdin**: Exit 3 with parse-error message
- **Unknown spec-folder**: `upsert.cjs` should NOT auto-create; exit 3 with helpful message

### DB Boundaries
- **DB file missing**: Exit 2 with `{ ok: false, error: { code: "DB_MISSING", path } }`
- **DB locked by another process**: Exit 2 with `{ ok: false, error: { code: "DB_LOCKED" } }` after short retry
- **Schema drift**: Exit 2 with `{ ok: false, error: { code: "SCHEMA_MISMATCH", expected, found } }`

### Concurrent Operations
- **Two scripts invoked back-to-back**: Each opens plus closes independently; no shared state; correct by design
- **Workflow retries**: Idempotent for `query.cjs` and `status.cjs`; `upsert.cjs` defers idempotency to schema-level dedup (existing behavior)

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

### LOC Estimate

| Surface | LOC |
|---------|-----|
| 4 `.cjs` entry points | ~280 (avg 70 each) |
| `_lib/db-open.cjs` shared helper | ~60 |
| DB cp logic plus fixture | ~10 |
| **Total** | **~350** |

### Complexity Drivers

| Driver | Score | Rationale |
|--------|-------|-----------|
| New file surface | Medium | 5 new files (4 scripts plus 1 helper); no edits to existing scripts in this phase |
| Cross-phase coordination | Medium | Hard dependency on phase 002 closeout; gates phase 004 start |
| Interface contract design | Medium | Argv plus stdin plus stdout JSON envelope plus exit codes must be precise enough for phase 005 consumer migration |
| DB lifecycle change | High | Owner moves from long-lived MCP process to per-invocation script; single-owner invariant must hold by construction |
| Testing surface | Low | Smoke gates only at this phase; full vitest coverage owned by phase 007 |
| Rollback risk | Low | Add-only commit; old DB preserved at original path until phase 008 |

### Overall Complexity

**Medium**. The change footprint is small and the pattern is well-precedented (`reduce-state.cjs`). The load-bearing risk concentrates in the lifecycle decision (ADR-001) and the precision of the interface contract that phase 005 consumers depend on. The Five Checks evaluation in `decision-record.md` documents why the chosen pattern is the simplest design that meets the constraints.

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | DB cp loses rows | H | L | `cp -p` plus post-cp row-count assertion in plan task |
| R-002 | Script forgets to close DB on error | M | M | Audit plus lint rule; use `try/finally` pattern enforced in code review |
| R-003 | Phase 004 deletes MCP handlers before scripts proven | H | L | Phase ordering enforced; 003 smoke-tests gate before 004 starts |
| R-004 | `better-sqlite3` API surface differs in CJS vs ESM context | M | L | Phase 002 already validates ESM/CJS interop; reuse pattern |
| R-005 | Stale `.sqlite-shm` and `.sqlite-wal` from old MCP-server crashes | M | L | Cleanup step in plan; documented in script error messages |
| R-006 | Workflow YAML invokes wrong script path | L | M | Phase 005 grep-tests all references; not 003's concern but flagged |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Deep-review iteration completes via scripts (Priority: P0)

**As a** deep-review iteration dispatch, **I want** to invoke `convergence.cjs` instead of `mcp__mk_spec_memory__deep_loop_graph_convergence`, **so that** the deep-loop runtime no longer depends on the MCP server.

**Acceptance Criteria**:
1. Given a valid spec-folder plus session-id, when `node convergence.cjs --spec-folder X --session-id Y` runs, then it prints JSON with convergence metrics and exits 0.
2. Given a missing spec-folder argument, when the script runs, then it exits 3 with a clear error JSON.
3. Given the DB file is missing, when the script runs, then it exits 2 with a `DB_MISSING` error code.

### US-002: Graph events upserted via script (Priority: P0)

**As a** deep-review state-reducer, **I want** to pipe graph events through `upsert.cjs`, **so that** state updates persist without MCP transport.

**Acceptance Criteria**:
1. Given a JSON file of events, when `node upsert.cjs --spec-folder X --events events.json` runs, then it upserts each event and exits 0.
2. Given events on stdin, when the script runs with `--events -`, then it reads stdin and upserts.

### US-003: Health check available standalone (Priority: P1)

**As a** /doctor diagnostic, **I want** `status.cjs` to report DB readiness without MCP, **so that** doctor checks remain available when the MCP server is offline.

**Acceptance Criteria**:
1. Given the DB exists and schema is current, when `node status.cjs --spec-folder X` runs, then it prints `{ ok: true, schemaVersion, rowCount }` and exits 0.
2. Given the DB is missing or locked, when the script runs, then it exits 2 with the matching error code.

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the shared open/close helper live in `scripts/lib/` or be inlined per-script for clarity? **Decision: shared helper `scripts/lib/db-open.cjs` to keep error-path discipline consistent (try/finally plus close); each script imports it.**
- Should `upsert.cjs` accept events via stdin pipe, `--events` flag, or both? **Decision: both; `--events -` is the canonical stdin pipe signal.**
- Should we preserve the old `deep-loop-graph.sqlite` at the old path until phase 008? **Decision: YES, keep until 008 closeout window for rollback; remove after final verification.**
- Should `status.cjs` perform schema migration if drift detected? **Decision: NO, out of scope; surface the mismatch via exit 2 plus `SCHEMA_MISMATCH` and let the operator run an explicit migration.**
- Should the scripts log to a dedicated runtime log file? **Decision: NO, stderr only; aggregator owns persistence.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Phase Parent**: `../spec.md`
- **Predecessor Phase**: `../002-lib-runtime-migration/`
- **Successor Phase**: `../004-mcp-tool-surface-removal/`
- **Canonical Pattern Reference**: `.opencode/skills/deep-review/scripts/reduce-state.cjs` (per-invocation DB owner)
