---
title: "Deep Review Report: 014 system-code-graph extraction"
description: "Autonomous deep review of the 7-sub-phase code-graph extraction migration. Verdict: CONDITIONAL — 1 P0 claim-vs-reality mismatch, 1 P1 dead import paths."
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/013-system-code-graph-extraction"
    last_updated_at: "2026-05-14T11:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Deep review converged; review-report.md written"
    blockers: ["P0: stale DB claim mismatch; P1: dead stress-test imports"]
    session_dedup:
      session_id: "013-system-code-graph-extraction-review"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: review-report | v2.2 -->
# Deep Review Report: 014 system-code-graph extraction phase parent

**Target**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/013-system-code-graph-extraction` (phase parent, 7 children)

**Review scope**: ADR-001 + ADR-002 correctness, file move completeness, tool schema migration, opencode.json mutations, launcher correctness, MCP entrypoint, cross-subsystem imports, doctor/update.md path consistency, recalibration metadata, cleanup completeness.

**Review date**: 2026-05-14

**Convergence**: 4 iterations; newInfoRatio < 0.05 after iteration 3.

---

## Verdict

**CONDITIONAL** — 1 P0 claim-vs-reality mismatch confirmed, 1 P1 dead import path confirmed.

The migration's core architecture (standalone MCP topology, tool-id stability, flattened layout, DB ownership, config resolution, launcher pattern, entrypoint correctness) is structurally sound. The P0 finding is a stale database cleanup claim that doesn't match disk state; impact is low (4KB regenerated stub, not the 55MB live index) but the verification evidence is factually incorrect. The P1 finding is two stress-test files with import paths targeting the pre-flattened `mcp_server/code_graph/` directory that no longer exists — these tests would fail to load.

---

## Execution Summary

| Metric | Value |
|--------|-------|
| Iterations run | 4 |
| Dimensions covered | Correctness, Spec-Alignment/Traceability, Completeness, Maintainability |
| Total files audited | 27 |
| P0 findings | 1 |
| P1 findings | 1 |
| P2 findings | 2 |
| Strict validate exit | 0 (PASS) |

---

## Findings

### P0 — Ship-Blocker

#### P0-1: STUB_DB_NOT_DELETED — cleanup claim contradicts disk state

- **Severity**: P0
- **Category**: Correctness / Completeness
- **Source**: `007-mcp-topology-pivot/implementation-summary.md:108`
- **Audit question**: Q10 (cleanup completeness)

**Finding**: The 007 implementation-summary verification block claims:

```
STUB_DB_DELETED=yes
```

and the prose states:

> "The stale stub database at `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite` and sidecars was deleted after `lsof` found no holder."

However, the files still exist on disk:

```text
.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite       (4 KB)
.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite-wal
.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite-shm
```

The 4KB size indicates a regenerated stub (the live 55MB DB is correctly at `system-code-graph/mcp_server/database/code-graph.sqlite`), but the verification claim remains factually incorrect — the stub was not deleted as claimed.

**Evidence**:
- [SOURCE: `.opencode/specs/.../007-mcp-topology-pivot/implementation-summary.md:108`] — `STUB_DB_DELETED=yes`
- [SOURCE: `glob .opencode/skills/system-spec-kit/mcp_server/database/code-graph*`] — 3 files returned
- [SOURCE: `ls -la`] — 4KB stub vs 55MB live DB

**Remediation**: Either delete the stub files and WAL/SHM sidecars (updating the implementation summary if the claim is meant to be true), or correct the verification claim to `STUB_DB_DELETED=no` with a note that it's a regenerated 4KB stub with negligible impact.

---

### P1 — Must-Fix (blocks CONDITIONAL clearance)

#### P1-1: BROKEN_STRESS_TEST_IMPORTS — pre-flattening path references in 2 stress tests

- **Severity**: P1
- **Category**: Correctness
- **Source**: `stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:11-12` and `stress_test/session/gate-d-benchmark-session-resume.vitest.ts:17,31`
- **Audit question**: Q7 (cross-subsystem imports)

**Finding**: Two stress test files in `system-spec-kit/mcp_server/stress_test/` import from `/mcp_server/code_graph/` subdirectory paths that no longer exist. The layout was flattened: runtime code lives at `system-code-graph/mcp_server/{lib,handlers,tools,tests}/`, not `system-code-graph/mcp_server/code_graph/{lib,handlers,tools,tests}/`.

Affected files:

1. `stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts`
   - Line 11: `import { closeDb, initDb } from '../../../../system-code-graph/mcp_server/code_graph/lib/code-graph-db.js';`
   - Line 12: `import { handleCodeGraphQuery } from '../../../../system-code-graph/mcp_server/code_graph/handlers/query.js';`

2. `stress_test/session/gate-d-benchmark-session-resume.vitest.ts`
   - Line 17: `vi.mock('../../../../system-code-graph/mcp_server/code_graph/lib/code-graph-db.js', ...`
   - Line 31: `vi.mock('../../../../system-code-graph/mcp_server/code_graph/lib/ensure-ready.js', ...`

These paths should be:
- `../../../../system-code-graph/mcp_server/lib/code-graph-db.js`
- `../../../../system-code-graph/mcp_server/handlers/query.js`
- `../../../../system-code-graph/mcp_server/lib/ensure-ready.js`

**Evidence**:
- [SOURCE: `grep "code_graph/lib\|code_graph/handlers" stress_test/*.ts`] — 4 matches across 2 files
- [SOURCE: `glob .opencode/skills/system-code-graph/mcp_server/code_graph/**`] — 0 files (directory doesn't exist)
- [SOURCE: `glob .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts`] — file exists at flattened path

**Remediation**: Update the 4 import paths in the 2 stress test files to use the flattened layout (`mcp_server/lib/` and `mcp_server/handlers/` instead of `mcp_server/code_graph/lib/` and `mcp_server/code_graph/handlers/`).

---

### P2 — Advisory

#### P2-1: DOCTOR_DB_PATH_INCONSISTENCY — SUBSYSTEM CONTRACT uses wrong path for code-graph DB

- **Severity**: P2
- **Category**: Spec-Alignment / Documentation
- **Source**: `.opencode/commands/doctor/update.md:214`
- **Audit question**: Q8 (doctor/update.md path consistency)

**Finding**: The SUBSYSTEM CONTRACT table at line 214 lists the code-graph database path as:

```
.opencode/skills/system-code-graph/database/code-graph.sqlite
```

But the actual runtime path (resolved by `config.ts:11`: `resolve(__dirname, '..', 'database')` where `__dirname` is `mcp_server/core/`) is:

```
.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite
```

The MUTATION BOUNDARIES table at line 269 correctly uses the full path with `mcp_server/`. No `database/` directory exists at the skill root level.

**Evidence**:
- [SOURCE: `.opencode/commands/doctor/update.md:214`] — missing `mcp_server/` segment
- [SOURCE: `.opencode/commands/doctor/update.md:269`] — correct path with `mcp_server/`
- [SOURCE: `system-code-graph/mcp_server/core/config.ts:11`] — `DATABASE_DIR` resolves to `mcp_server/database/`
- [SOURCE: `glob .opencode/skills/system-code-graph/database/**`] — 0 files

**Remediation**: Update line 214 to read `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`.

---

#### P2-2: 002 graph-metadata.json causal_summary references superseded topology

- **Severity**: P2
- **Category**: Documentation
- **Source**: `002-scaffold-skill/graph-metadata.json:55`
- **Audit question**: Q9 (recalibration metadata)

**Finding**: 002's `graph-metadata.json` derived `causal_summary` states:

> "The skill remains co-resident under spec_kit_memory per ADR-001 Q3"

This language predates ADR-002 (which superseded ADR-001 Q3 to standalone topology). The 002 implementation-summary correctly acknowledges the supersession, but the graph-metadata.json summary was not updated.

**Evidence**:
- [SOURCE: `002-scaffold-skill/graph-metadata.json:55`] — co-resident language preserved
- [SOURCE: `002-scaffold-skill/implementation-summary.md:88`] — acknowledges ADR-002 supersession

**Remediation**: Update 002's `derived.causal_summary` to note "topology was later changed to standalone by ADR-002 in 014/007" or equivalent.

---

## Items Passed

All 10 audit questions were evaluated. 8 passed without findings:

| Q# | Question | Verdict |
|----|----------|---------|
| Q1 | ADR-001 correctness and internal consistency | PASS |
| Q1b | ADR-002 correctness and internal consistency | PASS |
| Q2 | File moves completeness (108+ source files, 13 stress tests, etc.) | PASS |
| Q3 | Tool schema migration (10 removed from spec-kit, 10 added to system-code-graph) | PASS |
| Q4 | opencode.json mutations (system_code_graph entry, INDEX_* defaults, _NOTE_8) | PASS |
| Q5 | Launcher correctness (system-code-graph-launcher.cjs mirrors spec-kit-memory-launcher.cjs) | PASS |
| Q6 | MCP entrypoint correctness (Server name, transport, tool registration, dispatch) | PASS |
| Q7 | Cross-subsystem handler/hook imports (flattened paths correct) | PASS (except P1-1) |
| Q8 | doctor/update.md MUTATION BOUNDARIES consistency | PARTIAL PASS (P2-1) |
| Q9 | Recalibration metadata (all 7 children derived.status=complete) | PASS |
| Q10 | Cleanup completeness | P0 (P0-1) |

### Q3 — Tool Schema Migration (Detailed Evidence)

- `system-code-graph/mcp_server/tool-schemas.ts` contains exactly 10 ToolDefinition exports: `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_verify`, `code_graph_apply`, `detect_changes`, `ccc_status`, `ccc_reindex`, `ccc_feedback`
- `system-spec-kit/mcp_server/tool-schemas.ts` has a comment block at L561-564 stating migration to system-code-graph per ADR-002; 0 code-graph tool definitions remain
- The 2 remaining `code_graph` string matches in system-spec-kit/tool-schemas.ts are routing hints in `memory_context` (L49) and `memory_search` (L56) descriptions referencing `mcp__system_code_graph__code_graph_query` — correct cross-references
- `system-spec-kit/mcp_server/tools/index.ts:10,124` explicitly omits code-graph dispatch with ADR-002 migration comments

### Q4 — opencode.json (Detailed Evidence)

- New `system_code_graph` MCP server entry present at L38-54
- Launcher command: `node .opencode/bin/system-code-graph-launcher.cjs` — correct
- `_NOTE_8_CODE_GRAPH_SCOPE` moved from spec_kit_memory to system_code_graph — correct
- All 5 `SPECKIT_CODE_GRAPH_INDEX_*` flags default to `"false"` — correct per ADR-002
- Remote API key notes (VOYAGE_API_KEY, OPENAI_API_KEY) correctly retained in spec_kit_memory only

### Q5 — Launcher (Detailed Evidence)

- `.opencode/bin/system-code-graph-launcher.cjs` (259 lines) mirrors `.opencode/bin/spec-kit-memory-launcher.cjs` pattern:
  - Same `.env.local` / `.env` loading logic
  - Same `skillsDir` / `kitDir` / `dbDir` / `lockDir` / `stateFile` structure
  - Same `ensureLayout()` / `buildIfNeeded()` / `acquireBootstrapLock()` / `launchServer()` flow
  - Same signal handling (SIGINT, SIGTERM, SIGHUP)
- Points to `system-code-graph` skill at `.opencode/skills/system-code-graph/`
- Required artifact: `mcp_server/dist/index.js`

### Q6 — MCP Entrypoint (Detailed Evidence)

- `system-code-graph/mcp_server/index.ts` (23 lines)
- Server name: `'system_code_graph'` — correct
- Transport: `StdioServerTransport` — correct
- Tool schemas registered from `CODE_GRAPH_TOOL_SCHEMAS` export
- Dispatch: `codeGraphTools.dispatch(request.params.name, args)` — clean single-dispatch
- No extraneous registration, no co-resident wrapper

### Q7 — Handler/Hook Imports (Detailed Evidence)

All system-spec-kit handler imports use the correct flattened path:
- `context-server.ts:88`: `import * as graphDb from '../../system-code-graph/mcp_server/lib/code-graph-db.js'`
- `memory-context.ts:18-19`: `import ... from '../../../system-code-graph/mcp_server/lib/...`
- `memory-search.ts:27`: `import ... from '../../../system-code-graph/mcp_server/lib/ensure-ready.js'`
- `session-bootstrap.ts:34`: `import ... from '../../../system-code-graph/mcp_server/lib/ops-hardening.js'`
- `session-resume.ts:14-16`: `import ... from '../../../system-code-graph/mcp_server/lib/...`
- `session-health.ts:29`: `import ... from '../../../system-code-graph/mcp_server/lib/ops-hardening.js'`

All use `mcp_server/lib/` (flattened) — not the old `mcp_server/code_graph/lib/`.

### Q9 — Recalibration Metadata (Detailed Evidence)

All 7 children have `derived.status: "complete"`:
- `001-design-and-decision-record` — status: complete, last_save: 2026-05-14T09:13:21Z
- `002-scaffold-skill` — status: complete, last_save: 2026-05-14T09:13:21Z
- `003-physical-move-and-database` — status: complete, last_save: 2026-05-14T09:13:21Z
- `004-rewire-consumers-and-tool-registration` — status: complete, last_save: 2026-05-14T09:13:21Z
- `005-doc-and-runtime-migration` — status: complete, last_save: 2026-05-14T09:13:21Z
- `006-validation-and-cleanup` — status: complete, last_save: 2026-05-14T09:13:21Z
- `007-mcp-topology-pivot` — status: complete, last_save: 2026-05-14T09:24:15Z

All 7 have implementation-summary.md present with filled content.

Phase parent validation: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` → exit 0, 0 errors, 0 warnings.

---

## Remediation Plan

### Before MERGE (blocking CONDITIONAL → PASS)

1. **P0-1**: Either delete the 3 stale code-graph files from `system-spec-kit/mcp_server/database/` (preferred) or update the 007 implementation-summary verification block to accurately reflect disk state.

2. **P1-1**: Fix 4 import paths in the 2 stress-test files:
   - `stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts` (lines 11-12)
   - `stress_test/session/gate-d-benchmark-session-resume.vitest.ts` (lines 17, 31)

### Post-MERGE (advisory cleanup)

3. **P2-1**: Fix doctor/update.md line 214 to use the correct full path `system-code-graph/mcp_server/database/code-graph.sqlite`.

4. **P2-2**: Update 002's graph-metadata.json `derived.causal_summary` to note ADR-002 topology supersession.

---

## Stop Reason

All 10 audit questions evaluated; 4 iterations converged (newInfoRatio < 0.05 after iteration 3). Material findings are stable and confirmed against disk state.

## Release-Readiness State

**CONDITIONAL** — structurally sound with 1 P0 claim-vs-reality mismatch (low impact) and 1 P1 dead import path (would fail test execution). No algorithmic, security, or data-loss risks detected. Core extraction architecture (standalone MCP, stable tool IDs, DB ownership, flattened layout, config resolution) is correct.
