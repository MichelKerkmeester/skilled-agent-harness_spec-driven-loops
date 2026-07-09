---
title: "Decision Record: 003 — Per-Invocation DB Ownership for Deep-Loop Scripts"
description: "ADR-001 captures the choice that the 4 deep-loop-runtime .cjs script entry points own deep-loop-graph.sqlite open + close per invocation (no daemon, no shared state). Includes three rejected alternatives, Five Checks 5/5 PASS evaluation, single-owner invariant rationale, and the script interface contract that consumers depend on."
trigger_phrases:
  - "118/003 ADR-001"
  - "deep-loop per-invocation DB ownership"
  - "script lifecycle decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/004-script-shim-db-relocation"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored ADR-001 with Five Checks 5/5"
    next_safe_action: "Verify ADR-001 status after implementation"
    blockers:
      - "phase-002-incomplete"
    completion_pct: 5
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:1180031180031180031180031180031180031180031180031180031180030005"
      session_id: "118-003-adr-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: 003 — Per-Invocation DB Ownership for Deep-Loop Scripts

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Per-Invocation DB Ownership for the 4 Deep-Loop Script Entry Points

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | Phase 003 author plus 118 phase parent author |
| **Supersedes** | 117 ADR-001 SPLIT ruling (DB stays in MCP server), relaxed per user directive |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 118 user directive overrides the 117 council SPLIT ruling and removes the 4 `deep_loop_graph_*` MCP tools entirely. Their semantics must move to direct `.cjs` script invocations. With the MCP server no longer the consumer of `deep-loop-graph.sqlite`, the DB needs a new lifecycle owner. The choice of owner shapes:

- How concurrent writers are prevented (single-owner invariant)
- How error paths close the connection without leaking
- How consumers (workflow YAMLs, `/doctor`, `system-code-graph` playbook) dispatch
- Whether the runtime depends on any long-lived process

The reference precedent is `.opencode/skills/deep-review/scripts/reduce-state.cjs`, which already runs the per-invocation pattern in production for state-reduction work. That pattern has zero MCP coupling, zero daemon complexity, and zero shared mutable state between invocations.

### Constraints

- Must preserve the single-owner invariant: no two writers may hold the DB at the same time.
- Must not require a daemon, supervisor, or long-lived process to be alive for the deep-loop runtime to function.
- Must work from any CWD (workflow YAMLs invoke from varied working directories).
- Must use the existing `better-sqlite3` driver (driver swap is out of scope for this phase).
- Must keep the SQLite filename and on-disk schema unchanged (this is relocation plus interface translation, not refactor).
- Must allow rollback by leaving the original DB path intact during phases 003 through 008.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Each of the 4 `.cjs` script entry points opens its own SQLite connection on invocation, performs exactly one operation, and closes the connection before exit. No daemon, no shared state, no inter-script coordination.

**How it works**:
- 4 script entry points live under `.opencode/skills/deep-loop-runtime/scripts/`: `convergence.cjs`, `upsert.cjs`, `query.cjs`, `status.cjs`.
- A shared helper `.opencode/skills/deep-loop-runtime/scripts/lib/db-open.cjs` exposes `openDatabase(path)` and `withDatabase(path, fn)`. `withDatabase` wraps a `try/finally` so `db.close()` runs on every exit path (including thrown errors).
- The SQLite file lives at `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite`. Each script resolves this path via `path.resolve(__dirname, "../storage/deep-loop-graph.sqlite")` so CWD does not matter.
- The single-owner invariant is preserved by construction: each script is a single synchronous open, operation, close sequence. There is no overlap because there is no shared process. `better-sqlite3`'s file lock prevents accidental concurrent writers if two scripts somehow race.
- The script interface contract is fixed:
  - **Inputs**: argv flags (`--spec-folder`, `--session-id`, `--events`, `--query`) and optional stdin JSON (for `upsert.cjs` when invoked with `--events -`).
  - **Outputs**: JSON envelope on stdout `{ ok: true, data?: ... }` on success and `{ ok: false, error: { code, message, ...context } }` on failure.
  - **Exit codes**: `0=ok`, `1=script error`, `2=DB error` (missing/locked/schema-mismatch), `3=input validation error` (missing or malformed argv/stdin).
  - **Logging**: human-readable stderr at INFO level for the invocation summary; structured JSON on stdout for all success and failure payloads.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-invocation script ownership** (chosen) | No daemon to manage; single-owner invariant trivially preserved; matches `reduce-state.cjs` precedent; works from any CWD; rollback-friendly; no IPC | Slight per-invocation cold-start cost (DB open ~5-20 ms); each script must implement try/finally discipline | 9/10 |
| Shared daemon (long-lived Node process owning the DB; scripts talk to it via IPC or HTTP) | Amortizes DB open cost; centralizes lock management; matches what the MCP server did | Adds process management complexity (start/stop/restart/supervisor); adds an IPC or HTTP surface; defeats the FULL_ISOLATE_NO_MCP intent by re-introducing a long-lived runtime layer; no precedent in this codebase | 4/10 |
| MCP server retains DB ownership; scripts call back into MCP for graph ops | Reuses existing handler logic; preserves lifecycle behavior | Defeats the explicit FULL_ISOLATE intent; keeps the MCP tool surface alive in a different form; circular dependency on the very layer this packet removes | 2/10 |
| File-based no-DB (replace SQLite with JSONL or directory tree of JSON files) | No driver dep at all; trivially concurrent-safe for append-only ops | Schema is already mature and consumers expect SQL queries; migration cost is enormous; throws away years of indexing plus query work; out of scope | 1/10 |

**Why this one**: Per-invocation ownership is the only option that simultaneously (a) honors the user directive's intent to remove the MCP layer without re-introducing a process supervisor in a new costume, (b) preserves the single-owner invariant trivially without coordination protocols, (c) keeps the existing schema and driver intact, and (d) follows a proven precedent (`reduce-state.cjs`) already running in production. The per-invocation cold-start cost is small and bounded; the alternatives either reintroduce coupling (option 2 and 3) or burn migration cost we explicitly scoped out (option 4).
<!-- /ANCHOR:adr-001-alternatives -->

---

#### Constraint Preserved: Single-Owner Invariant

`deep-loop-graph.sqlite` must have exactly one writer at any moment. Under per-invocation ownership, this is enforced by construction:

1. Each script is a single synchronous chain: `open` → `op` → `close`. There is no `await` between open and close that could yield to another invocation in the same process.
2. There is no shared process. Each invocation is a fresh `node` process; the OS-level file lock from `better-sqlite3` blocks accidental concurrent writers.
3. Workflow YAMLs invoke scripts sequentially within a single deep-loop iteration. The iteration boundary is the natural synchronization point.
4. `/doctor` and `system-code-graph` callers invoke `status.cjs` and `query.cjs` (read-only) which do not race writers.

---

#### Script Interface Contract

The contract is normative; consumers (phase 005 workflow YAMLs, phase 006 collateral) MUST conform.

**Argument shape**:
- `convergence.cjs --spec-folder <path> --session-id <id>` — positional path plus session ID.
- `upsert.cjs --spec-folder <path> --events <file-or-dash>` — `--events -` reads JSON array from stdin.
- `query.cjs --spec-folder <path> --query <name-or-json>` — query selector.
- `status.cjs --spec-folder <path>` — health check, read-only.

**Stdout envelope**:
```json
{ "ok": true, "data": { ... } }
```
or
```json
{ "ok": false, "error": { "code": "DB_MISSING", "message": "human-readable", "path": "..." } }
```

**Exit codes** (deterministic, machine-checkable):
- `0` — success
- `1` — generic script error (uncaught exception, programming bug)
- `2` — DB error (`DB_MISSING`, `DB_LOCKED`, `SCHEMA_MISMATCH`)
- `3` — input validation error (`MISSING_FLAG`, `BAD_JSON`, `UNKNOWN_SPEC_FOLDER`)

**Stderr**: human-readable INFO log of invocation arguments plus DB path; structured stdout JSON is the machine contract.

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Removes the entire MCP transport layer for deep-loop graph ops (the explicit 118 directive).
- Establishes a single, repeatable pattern (`withDatabase`) for any future script that needs DB access.
- Decouples deep-loop runtime from the MCP server lifecycle; the deep-loop-runtime peer skill is self-contained.
- Enables `/doctor` and `system-code-graph` to call `status.cjs` directly without MCP availability.

**What it costs**:
- Slight per-invocation cold-start cost (DB open ~5-20 ms). Mitigation: bounded, well under NFRs, and amortized over iteration-level work.
- Each script author must follow the `try/finally` discipline. Mitigation: the shared `withDatabase` helper makes this the default, not a per-script choice.
- Two file-system locations exist temporarily during phases 003-008 (old MCP-server path plus new runtime path). Mitigation: documented in spec.md scope and the enhanced-rollback section; phase 008 closes this loop.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Script forgets `db.close()` on a thrown error path | M | Shared `withDatabase(fn)` makes try/finally the path of least resistance; source review plus checklist CHK-011 enforce it |
| `better-sqlite3` upgrade introduces breaking API change | L | Driver version pin; CI vitest sweep (phase 007) catches drift |
| Workflow YAML invokes wrong script path | L | Phase 005 grep-tests all references; CHK-122 cross-checks |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The 118 user directive explicitly removes the MCP layer; there is no path forward that retains MCP tools for deep-loop graph ops |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives evaluated (shared daemon, MCP retains DB, file-based no-DB) with explicit scoring and rejection rationale |
| 3 | **Sufficient?** | PASS | Per-invocation ownership is the simplest design that satisfies the single-owner invariant; no extra abstractions invented |
| 4 | **Fits Goal?** | PASS | Directly on the critical path of the 118 arc; gates phases 004 through 008; consumer contract is the load-bearing artifact |
| 5 | **Open Horizons?** | PASS | Pattern is repeatable for any future deep-loop entry point; `withDatabase` extracts to a wider shared helper if needed; no foreclosed evolution paths |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/deep-loop-runtime/scripts/` (new file surface, 4 entry points plus shared helper)
- `.opencode/skills/deep-loop-runtime/storage/` (relocated DB file)
- Workflow YAMLs (phase 005) switch from `mcp_tool: deep_loop_graph_*` to `bash node scripts/*.cjs`
- `/doctor` (phase 006) health probe invokes `status.cjs` directly
- `system-code-graph` playbook (phase 006) references new script paths

**How to roll back**: Phase 003 commit is a single addition (no deletes). Reverting deletes new scripts plus new DB copy; old `deep-loop-graph.sqlite` at the original MCP-server-managed path remains canonical until phase 008 closeout. The rollback window spans phases 003 through 008.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## RELATED DOCUMENTS

- **Phase Spec**: `spec.md`
- **Phase Plan**: `plan.md` (architecture plus critical path)
- **Phase Tasks**: `tasks.md`
- **Phase Checklist**: `checklist.md` (CHK-100..CHK-104 cover ADR-001 verification)
- **Phase Parent**: `../spec.md`
- **Predecessor 117 ADR-001**: `../../003-deep-loop-runtime/001-core-isolation-deliberation/` (SPLIT ruling, superseded)
- **Reference Pattern**: `.opencode/skills/deep-review/scripts/reduce-state.cjs`
