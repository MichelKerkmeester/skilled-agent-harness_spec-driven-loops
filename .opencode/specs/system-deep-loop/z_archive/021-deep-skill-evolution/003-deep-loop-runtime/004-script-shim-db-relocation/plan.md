---
title: "Implementation Plan: 003 — Script Shim + DB Relocation"
description: "Phased plan to author 4 .cjs entry points (convergence/upsert/query/status) under deep-loop-runtime/scripts/, relocate deep-loop-graph.sqlite into runtime storage, and prove single-owner DB lifecycle through per-invocation open/close."
trigger_phrases:
  - "118/003 plan"
  - "script shim plan"
  - "deep-loop DB relocation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/003-deep-loop-runtime/004-script-shim-db-relocation"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored plan.md scaffold"
    next_safe_action: "Implement scripts after phase 002 closes"
    blockers:
      - "phase-002-incomplete"
    completion_pct: 5
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1180031180031180031180031180031180031180031180031180031180030002"
      session_id: "118-003-plan-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: 003 — Script Shim + DB Relocation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js 18+, CommonJS (`.cjs`) |
| **DB Driver** | `better-sqlite3` (matching current MCP server usage) |
| **Library Source** | `.opencode/skills/deep-loop-runtime/lib/` (established in phase 002) |
| **Reference Pattern** | `.opencode/skills/deep-review/scripts/reduce-state.cjs` |
| **Testing** | Direct script invocation against fixture JSON; smoke gates only at this phase |

### Overview

Phase 003 produces a new file surface — 4 `.cjs` script entry points plus a relocated SQLite DB — without changing any deep-loop runtime semantics. The 4 scripts mirror the 4 `deep_loop_graph_*` MCP tool semantics one-to-one and call the existing library functions that phase 002 moved into `deep-loop-runtime/lib/`. The DB physically moves from the old MCP-server-managed path into `deep-loop-runtime/storage/`, where each script opens and closes its own connection per invocation.

The shared helper `_lib/db-open.cjs` enforces try/finally + close discipline so no script can leak a handle. JSON-on-stdout is the canonical output shape; exit codes are deterministic (0/1/2/3). The phase ends when all 4 scripts smoke-test green against fixture inputs.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 closeout: 13 lib files compiled clean from `deep-loop-runtime/lib/`
- [ ] DB driver version + import pattern confirmed
- [ ] Reference pattern (`reduce-state.cjs`) understood
- [ ] Existing `deep-loop-graph.sqlite` row count baseline captured
- [ ] Interface contract agreed (see ADR-001)

### Definition of Done
- [ ] All 4 `.cjs` scripts created with shebang + CJS shape
- [ ] Shared `_lib/db-open.cjs` helper implements try/finally + close
- [ ] DB copied to new storage path with matching row counts and schema
- [ ] Each script smoke-tested with fixture input (PASS)
- [ ] Each error path returns the correct exit code (0/1/2/3)
- [ ] ADR-001 published with Five Checks 5/5 PASS
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` PASS Level 3
- [ ] checklist.md fully marked with evidence
- [ ] implementation-summary.md populated post-implementation

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-invocation script owner — each `.cjs` entry point opens a SQLite connection, performs one operation, closes the connection, exits. No daemon, no shared state, no inter-process coordination. This is the canonical pattern from `reduce-state.cjs`.

### Key Components

- **`convergence.cjs`**: Reads spec-folder + session-id, opens DB, calls `computeConvergence()`, prints JSON, closes DB.
- **`upsert.cjs`**: Reads events (file or stdin), opens DB, calls upsert library function, closes DB.
- **`query.cjs`**: Reads query parameters, opens DB, calls query library function, prints JSON, closes DB.
- **`status.cjs`**: Opens DB read-only, reports schema version + row count + health, closes DB.
- **`_lib/db-open.cjs`**: Shared `openDatabase()` + `withDatabase(fn)` helper. `withDatabase` wraps `try/finally` to guarantee close even on throw.
- **`storage/deep-loop-graph.sqlite`**: Relocated DB file (copy from old path).

### Data Flow

```
Workflow YAML  ──>  `node convergence.cjs --spec-folder X --session-id Y`
                              │
                              ├──> parse argv (exit 3 on bad flags)
                              ├──> openDatabase(STORAGE_PATH)
                              ├──> computeConvergence(db, specFolder, sessionId)
                              ├──> JSON.stringify(result) → stdout
                              ├──> db.close()  [in finally]
                              └──> process.exit(0|1|2|3)
```

### Component Diagram

```
┌───────────────────────────────────────────────────────────────┐
│            .opencode/skills/deep-loop-runtime/                 │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│   scripts/                                                     │
│   ├── convergence.cjs ─┐                                       │
│   ├── upsert.cjs       │                                       │
│   ├── query.cjs        ├──> require('./_lib/db-open.cjs')      │
│   ├── status.cjs       │            │                          │
│   └── _lib/            │            │                          │
│       └── db-open.cjs ─┘            ▼                          │
│                                ┌──────────────────┐            │
│                                │ openDatabase()   │            │
│                                │ withDatabase(fn) │            │
│                                └────────┬─────────┘            │
│                                         │                      │
│                                         ▼                      │
│   lib/coverage-graph/  ◄────────  require                      │
│   lib/deep-loop/       ◄────────  require                      │
│                                                                │
│   storage/                                                     │
│   └── deep-loop-graph.sqlite  ◄── per-invocation open/close    │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm phase 002 closeout (lib files in `deep-loop-runtime/lib/`)
- [ ] Capture baseline row counts from current `deep-loop-graph.sqlite`
- [ ] Confirm `better-sqlite3` driver version + import pattern
- [ ] Create `deep-loop-runtime/scripts/lib/` directory
- [ ] Create `deep-loop-runtime/storage/` directory (and `.gitignore` if needed)

### Phase 2: Implementation

- [ ] Author `_lib/db-open.cjs` (shared open + close helper)
- [ ] Author `convergence.cjs` (replaces `_convergence` MCP tool)
- [ ] Author `upsert.cjs` (replaces `_upsert` MCP tool; accepts argv + stdin)
- [ ] Author `query.cjs` (replaces `_query` MCP tool)
- [ ] Author `status.cjs` (replaces `_status` MCP tool)
- [ ] Copy `deep-loop-graph.sqlite` from old MCP-server path to new storage path
- [ ] Verify schema + row counts match between locations

### Phase 3: Verification

- [ ] Smoke-test each script with valid fixture input → exit 0 + parseable JSON
- [ ] Fault-injection: missing argv flags → exit 3
- [ ] Fault-injection: missing DB file → exit 2 (`DB_MISSING`)
- [ ] Fault-injection: malformed JSON on stdin → exit 3
- [ ] `lsof` audit: no script leaves the DB open after exit
- [ ] Run `bash .../validate.sh <folder> --strict` and confirm PASS at Level 3
- [ ] Fill in `implementation-summary.md` with concrete what-built + verification rows

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Coverage Target |
|-----------|-------|-------|-----------------|
| Smoke | Each script with valid input | Direct `node` invocation | All 4 scripts |
| Fault injection | Missing flags, bad JSON, missing DB | Shell invocation | Each error path |
| DB integrity | Row counts + schema match | `sqlite3` CLI | Pre/post cp |
| Source audit | Close-on-error discipline | Manual review + lint | All 4 scripts |
| Vitest integration | Phase 007 owns this | Out of scope here | — |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 lib runtime migration | Phase | Pending | Cannot require lib code; phase 003 blocked |
| `better-sqlite3` | External | Existing | Cannot open DB; would need driver swap (out of scope) |
| Existing `deep-loop-graph.sqlite` | Internal | Existing | Must copy without data loss |
| `reduce-state.cjs` reference pattern | Internal | Existing | Reference only; no runtime dep |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Smoke test fails for any script; DB row count mismatch after cp; consumer dispatch from phase 005 reveals semantic drift.
- **Procedure**: Delete new scripts + new DB copy; revert phase 003 commit; leave phase 002 untouched.
- **Rollback Window**: Phases 003 through 008 closeout. Old `deep-loop-graph.sqlite` at MCP-server path is preserved until phase 008 explicitly removes it, so revert is always safe before that window closes.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ─> Phase 2 (Implementation) ─> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 002 closeout | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 004 (MCP handler removal) |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min |
| Implementation | Medium | 3 hours |
| Verification | Medium | 1.5 hours |
| **Total** | | **~5 hours** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline `deep-loop-graph.sqlite` row count captured for each table
- [ ] Old DB path preserved (not deleted)
- [ ] Git working tree clean before starting

### Rollback Procedure
1. **Immediate**: Delete `.opencode/skills/deep-loop-runtime/scripts/*.cjs` + `_lib/`
2. **Storage**: Delete `.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite` (old DB at MCP-server path untouched)
3. **Verify**: Run `git status` — should show only deletions
4. **Notify**: Update phase parent `description.json` to reflect rollback

### Data Reversal
- **Has data migrations?** No (cp is non-destructive; old DB at old path remains the truth)
- **Reversal procedure**: Delete the new copy; old path remains canonical until phase 008.

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────────────┐
│   Phase 002 closeout        │
│ (lib files in runtime)      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Setup (baseline + dirs)    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Author _lib/db-open.cjs    │
└──────────────┬──────────────┘
               │
               ├────────────────────────────┐
               ▼                            ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  Author 4 .cjs scripts      │   │  Copy DB to new storage     │
│  (in parallel)              │   │  plus verify row counts     │
└──────────────┬──────────────┘   └──────────────┬──────────────┘
               │                                 │
               └────────────────┬────────────────┘
                                ▼
                  ┌─────────────────────────────┐
                  │  Smoke test all 4 scripts   │
                  │  plus fault injection       │
                  └──────────────┬──────────────┘
                                 ▼
                  ┌─────────────────────────────┐
                  │  Publish ADR-001 plus       │
                  │  validate.sh --strict       │
                  └─────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Phase 002 closeout | dirs, baseline | All other tasks |
| `_lib/db-open.cjs` | Setup | helper | 4 scripts |
| 4 `.cjs` scripts | `_lib/db-open.cjs`, phase 002 lib | entry points | Smoke tests |
| DB cp | Setup | relocated DB | Smoke tests |
| Smoke tests | Scripts plus DB | confidence | ADR plus closeout |
| ADR-001 | All decisions | doc | Validate |
| validate.sh | All files | PASS verdict | Phase 004 start |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 002 closeout signal** — 0 min (waiting on upstream phase)
2. **Setup (baseline plus dirs)** — 30 min — CRITICAL
3. **Author `_lib/db-open.cjs`** — 30 min — CRITICAL
4. **Author 4 scripts (parallel)** — 90 min — CRITICAL
5. **DB cp plus verify** — 15 min — CRITICAL (can overlap with script authoring)
6. **Smoke test plus fault injection** — 60 min — CRITICAL
7. **ADR plus validate.sh** — 30 min — CRITICAL

**Total Critical Path**: ~4 hours (Setup through Verification)

**Parallel Opportunities**:
- 4 scripts can be authored in parallel after `_lib/db-open.cjs` lands
- DB cp plus verify can overlap with script authoring (independent file surface)
- ADR-001 draft can be started during implementation phase

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | Dirs exist, baseline captured, phase 002 confirmed | Hour 1 |
| M2 | Helper plus scripts authored | All 5 source files present plus CJS-valid | Hour 2.5 |
| M3 | DB relocated | Row counts match between old and new paths | Hour 3 |
| M4 | Smoke tests green | All 4 scripts pass fixture invocation | Hour 4 |
| M5 | ADR plus validate PASS | ADR-001 published; validate.sh --strict PASS Level 3 | Hour 5 |

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:architecture-overview -->
## L3: ARCHITECTURE OVERVIEW

The architecture-overview anchor expands on the §3 ARCHITECTURE section with cross-cutting concerns that show up across all 4 scripts:

- **Shared discipline surface**: The `withDatabase(fn)` helper enforces try/finally + close in one place, removing per-script lifecycle drift.
- **CWD-independence**: All 4 scripts resolve the DB path via `path.resolve(__dirname, "../storage/deep-loop-graph.sqlite")`; workflow YAMLs invoke from varied directories so absolute-path resolution is load-bearing.
- **Stdout JSON envelope**: Single shape `{ ok: true|false, data?, error? }` matches consumer expectations from phase 005 onward.
- **Exit code map**: 0 (ok), 1 (script error), 2 (DB error), 3 (input validation). Documented in every script header block.

<!-- /ANCHOR:architecture-overview -->

---

<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Mitigation Anchor |
|------|-------------------|
| Script leaks DB handle on throw | `withDatabase(fn)` helper enforces try/finally + close; checklist `CHK-011` audits this |
| Workflow YAML invokes wrong script path | Phase 005 grep-tests all references; checklist `CHK-122` cross-checks |
| `better-sqlite3` API drift | Phase 002 validated driver; reuse import pattern verbatim |
| Stale shm/wal lock files | Cleanup step documented in script error messages + runbook |
| DB cp loses rows | Pre/post row-count assertion in tasks `T013`; `cp -p` preserves perms + timestamps |

<!-- /ANCHOR:risk-mitigation -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION GUIDANCE

Implementation can be dispatched to a single AI executor in one pass once phase 002 closes:

1. Confirm phase 002 lib files exist (`ls .opencode/skills/deep-loop-runtime/lib/coverage-graph/`).
2. Capture baseline row counts.
3. Author `_lib/db-open.cjs` first; smoke-test it.
4. Author 4 scripts in parallel after step 3.
5. Copy DB to new path; verify row counts.
6. Smoke-test all 4 scripts; run fault injection.
7. Publish ADR-001; run `validate.sh --strict`.

The dispatch prompt should pin the executor model to a fast non-MCP profile (e.g. `cli-codex gpt-5.5 high fast`) and pre-answer Gate 3 (`E) Skip — phase 003 scope locked`).

<!-- /ANCHOR:ai-execution -->

---

## CROSS-REFERENCES

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md` (ADR-001)
- **Phase Parent**: `../spec.md`
- **Reference Pattern**: `.opencode/skills/deep-review/scripts/reduce-state.cjs`
