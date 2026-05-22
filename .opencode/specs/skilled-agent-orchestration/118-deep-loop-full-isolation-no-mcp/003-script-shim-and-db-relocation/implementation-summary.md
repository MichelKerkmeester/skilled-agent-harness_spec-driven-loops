---
title: "Implementation Summary: 003 — Script Shim + DB Relocation"
description: "Post-implementation summary for phase 003. Records what was built, how it was delivered, key decisions, verification results, and known limitations. Filled after implementation completes; this scaffold version holds the concrete file paths and verification commands that the implementation will exercise."
trigger_phrases:
  - "118/003 summary"
  - "script shim summary"
  - "deep-loop DB relocation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/003-script-shim-and-db-relocation"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored implementation-summary scaffold"
    next_safe_action: "Fill measured rows after implementation"
    blockers:
      - "phase-002-incomplete"
    completion_pct: 5
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1180031180031180031180031180031180031180031180031180031180030006"
      session_id: "118-003-summary-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Summary

> **Status**: scaffold. Concrete file paths and verification commands are stable; LOC counts, measured timings, and post-implementation notes fill in during execution. This document is the canonical handover surface for the phase.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/003-script-shim-and-db-relocation` |
| **Completed** | _set on completion; YYYY-MM-DD_ |
| **Level** | 3 |
| **Actual Effort** | _filled post-implementation (estimated: ~5 hours)_ |
| **LOC Added** | _filled post-implementation (estimated: ~350 across 4 scripts plus helper)_ |
| **Phase Parent** | `..` (118 deep-loop full isolation no mcp) |
| **Predecessor** | `../002-lib-runtime-migration/` |
| **Successor** | `../004-mcp-tool-surface-removal/` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implementation produces a new file surface under `.opencode/skills/deep-loop-runtime/` plus a relocated SQLite DB:

- `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` replaces `mcp__mk_spec_memory__deep_loop_graph_convergence`
- `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` replaces `_upsert`; accepts `--events <file>` or `--events -` (stdin)
- `.opencode/skills/deep-loop-runtime/scripts/query.cjs` replaces `_query`
- `.opencode/skills/deep-loop-runtime/scripts/status.cjs` replaces `_status`; health probe consumed by `/doctor` and `system-code-graph` playbook
- `.opencode/skills/deep-loop-runtime/scripts/_lib/db-open.cjs` shared `openDatabase()` plus `withDatabase(fn)` helper enforcing `try/finally` plus close
- `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite` copied from old MCP-server-managed path; schema plus row counts preserved

### Files Changed

| File | Action | Purpose | LOC |
|------|--------|---------|-----|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Created | Convergence entry point | _filled post-impl_ |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Created | Upsert entry point (argv plus stdin) | _filled post-impl_ |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Created | Query entry point | _filled post-impl_ |
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | Created | Health/readiness probe | _filled post-impl_ |
| `.opencode/skills/deep-loop-runtime/scripts/_lib/db-open.cjs` | Created | Shared open/close helper | _filled post-impl_ |
| `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite` | Created (cp) | Relocated DB | n/a (binary) |
| `.opencode/skills/deep-loop-runtime/storage/.gitignore` | Created | Ignore DB if needed | _filled post-impl_ |
| **Total** | | | _filled post-impl_ |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase is delivered through five sequenced milestones:

1. **M1 Setup**: Confirm phase 002 closeout signal, capture baseline `deep-loop-graph.sqlite` row counts per table, confirm `better-sqlite3` driver version, create `scripts/_lib/` and `storage/` directories.
2. **M2 Helper plus Scripts**: Author `_lib/db-open.cjs` first (shared open/close discipline), then author 4 entry points in parallel (`convergence.cjs`, `upsert.cjs`, `query.cjs`, `status.cjs`). Each script requires the helper and the lib code from `deep-loop-runtime/lib/` established in phase 002.
3. **M3 DB Relocated**: Copy `deep-loop-graph.sqlite` from the old MCP-server-managed path to the new runtime storage path with `cp -p`. Verify per-table row counts match baseline and that `sqlite3 .schema` produces an identical dump.
4. **M4 Smoke Tests**: Invoke each script against fixture inputs; assert exit 0 plus parseable JSON. Run fault-injection cases (missing argv flags → exit 3, missing DB → exit 2, bad stdin JSON → exit 3). Audit with `lsof` that no DB handle leaks past script exit.
5. **M5 ADR plus Validate**: Publish ADR-001 (per-invocation DB ownership) with three rejected alternatives and Five Checks 5/5 PASS. Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` and confirm PASS Level 3.

Execution is dispatched as a single AI run (e.g. `cli-codex gpt-5.5 high fast`) once phase 002 closes; no human-in-the-loop pause is needed for any of the M1 through M5 steps.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Per-invocation DB ownership (ADR-001) | Single-owner invariant via synchronous open/close; matches `reduce-state.cjs` precedent; no daemon; no MCP coupling |
| Shared `withDatabase(fn)` helper in `_lib/db-open.cjs` | Makes `try/finally` plus close the path of least resistance; prevents per-script discipline drift |
| DB path resolved via `path.resolve(__dirname, "../storage/...")` | CWD-independent; workflow YAMLs invoke from varied directories |
| Stdin pipe convention `--events -` for `upsert.cjs` | Canonical UNIX-style convention; explicit at the argv site |
| `better-sqlite3` driver retained | Driver swap is out of scope; existing usage in MCP server provides parity reference |
| Old DB preserved at MCP-server path until phase 008 | Rollback window spans phases 003 through 008; closeout phase removes the old file |

See `decision-record.md` for full ADR-001 documentation including the three rejected alternatives and Five Checks evaluation.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Verification commands and expected outcomes (filled with measured values post-implementation):

| Test Type | Command | Expected | Status |
|-----------|---------|----------|--------|
| Syntax | `for f in .opencode/skills/deep-loop-runtime/scripts/**/*.cjs; do node -c "$f"; done` | exit 0 each | _filled post-impl_ |
| Smoke (convergence) | `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder <fixture> --session-id <id>` | exit 0 plus JSON | _filled post-impl_ |
| Smoke (upsert) | `node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --spec-folder <fixture> --events <events.json>` | exit 0 plus persisted | _filled post-impl_ |
| Smoke (query) | `node .opencode/skills/deep-loop-runtime/scripts/query.cjs --spec-folder <fixture> --query <q>` | exit 0 plus JSON | _filled post-impl_ |
| Smoke (status) | `node .opencode/skills/deep-loop-runtime/scripts/status.cjs --spec-folder <fixture>` | exit 0 plus `{ ok: true, schemaVersion, rowCount }` | _filled post-impl_ |
| Fault: missing flag | `node convergence.cjs` (no args) | exit 3 plus `MISSING_FLAG` | _filled post-impl_ |
| Fault: missing DB | run after temporarily renaming DB | exit 2 plus `DB_MISSING` | _filled post-impl_ |
| Fault: bad stdin JSON | `echo "bad" | node upsert.cjs --spec-folder X --events -` | exit 3 plus parse error | _filled post-impl_ |
| `lsof` audit | `lsof -p <pid>` after script exit | no DB handle remaining | _filled post-impl_ |
| DB integrity | `sqlite3 .../storage/deep-loop-graph.sqlite "SELECT count(*) FROM <table>"` vs baseline | counts match | _filled post-impl_ |
| Spec validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/003-script-shim-and-db-relocation --strict` | PASS Level 3 | _filled post-impl_ |

### NFR Achievement

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | `status.cjs` cold start under 200 ms | _filled post-impl_ | _filled post-impl_ |
| NFR-P02 | `convergence.cjs` under 2 s on typical record | _filled post-impl_ | _filled post-impl_ |
| NFR-P03 | `upsert.cjs` 100 events under 500 ms | _filled post-impl_ | _filled post-impl_ |
| NFR-R01 | `db.close()` on every exit path | source review | _filled post-impl_ |
| NFR-R02 | No transient state cached between invocations | by construction | _filled post-impl_ |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Per-invocation cold start** — Each script pays ~5 to 20 ms to open the DB. Acceptable per ADR-001; bounded and well under NFRs.
2. **No graceful SIGINT close beyond best-effort** — `better-sqlite3` is synchronous; if a script is killed mid-operation, the OS releases the file lock but in-flight work may be lost. Documented in script header blocks.
3. **Two DB locations during phases 003-008** — Old MCP-server path and new runtime path coexist for the rollback window. Phase 008 closes this loop.
4. **No schema migration on drift** — `status.cjs` reports `SCHEMA_MISMATCH` but does not auto-migrate. Operator runs explicit migration per the documented runbook.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:architecture-summary -->
## L3: Architecture Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Per-invocation DB ownership for the 4 script entry points | Accepted (5/5 PASS) | Removes MCP transport coupling; preserves single-owner invariant; matches `reduce-state.cjs` precedent |

The architecture choice has three load-bearing properties:
1. **No long-lived process** — the deep-loop-runtime skill is fully self-contained; no daemon, no supervisor.
2. **Single-owner invariant by construction** — synchronous open/close per script; no shared in-process state.
3. **Consumer contract is stable** — argv plus stdin plus stdout JSON envelope plus exit codes; phase 005 (workflow YAMLs) and phase 006 (collateral) wire against this contract.

<!-- /ANCHOR:architecture-summary -->

---

## Executive Summary (Cross-Cutting)

Phase 003 replaces the 4 `deep_loop_graph_*` MCP tools with 4 standalone `.cjs` script entry points and relocates `deep-loop-graph.sqlite` ownership into the new `deep-loop-runtime/` peer skill. Each script opens its own SQLite connection per invocation and closes it before exit; the canonical "per-invocation owner" pattern from `reduce-state.cjs`. ADR-001 (5/5 PASS) captures the choice. The phase ends when all 4 scripts smoke-test green and `validate.sh --strict` PASSes Level 3, gating phase 004 (MCP handler removal).

---

## Milestone Achievement

| Milestone | Target | Actual | Status |
|-----------|--------|--------|--------|
| M1 Setup | Hour 1 | _filled post-impl_ | _pending_ |
| M2 Helper plus Scripts | Hour 2.5 | _filled post-impl_ | _pending_ |
| M3 DB Relocated | Hour 3 | _filled post-impl_ | _pending_ |
| M4 Smoke Tests Green | Hour 4 | _filled post-impl_ | _pending_ |
| M5 ADR plus Validate PASS | Hour 5 | _filled post-impl_ | _pending_ |

---

## Risks Realized

| Risk ID | Occurred | Impact | Resolution |
|---------|----------|--------|------------|
| R-001 (DB cp loses rows) | _filled post-impl_ | _filled post-impl_ | Pre/post row-count assertion in T013 |
| R-002 (script forgets to close DB) | _filled post-impl_ | _filled post-impl_ | Shared `withDatabase(fn)` enforces `try/finally` |
| R-003 (phase 004 deletes handlers prematurely) | _filled post-impl_ | _filled post-impl_ | Phase ordering enforced via 003 closeout gate |
| R-004 (driver API surface differs) | _filled post-impl_ | _filled post-impl_ | Phase 002 already validated; reuse |
| R-005 (stale shm/wal lock files) | _filled post-impl_ | _filled post-impl_ | Documented in script error messages plus runbook |

---

## What Went Well / Could Improve

### What Went Well
_Filled post-implementation. Candidate notes: shared helper avoided per-script discipline drift; per-invocation pattern matched `reduce-state.cjs` precedent so reviewers had a clear mental model._

### What Could Improve
_Filled post-implementation. Candidate notes: any cold-start cost surprises; any script-author drift caught in review; any unexpected DB lock-file recovery needed._

### Recommendations for Future
_Filled post-implementation. Candidate notes: keep `withDatabase` as the default for any new entry point; consider extracting the JSON-envelope shape into a typed contract; revisit driver pin annually._

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| _filled post-impl_ | _filled post-impl_ | _filled post-impl_ |

---

## Follow-Up Items

- [ ] Phase 004: Delete the 5 MCP handler files plus 4 tool schema entries (depends on 003 smoke tests proven)
- [ ] Phase 005: Update 4 workflow YAML files (`spec_kit_deep-{review,research}_{auto,confirm}.yaml`) to invoke `.cjs` scripts instead of MCP tools
- [ ] Phase 006: Update `/doctor` (3 files) plus `system-code-graph` playbook (1 file) to reference new script paths
- [ ] Phase 007: Test migration; move runtime tests into `deep-loop-runtime/tests/`, remove MCP-specific tests for deleted tools
- [ ] Phase 008: Verification plus closeout; vitest sweep, alignment-drift PASS, `deep-review` SKILL.md v1.4.0.0 bump plus changelog, resource-map update, remove old `deep-loop-graph.sqlite` from MCP-server path
