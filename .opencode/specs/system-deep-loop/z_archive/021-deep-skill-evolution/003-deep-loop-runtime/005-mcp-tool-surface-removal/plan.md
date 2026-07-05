---
title: "Implementation Plan: 004 — MCP Tool Surface Removal"
description: "Three-phase plan to delete the four deep_loop_graph_* MCP tools (5 handlers + 4 schema entries + 4 registrations) from system-spec-kit/mcp_server/ after phase 003 ships the .cjs script replacements."
trigger_phrases:
  - "MCP tool surface removal plan"
  - "delete coverage-graph handlers"
  - "118 phase 004 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 3-phase delete-only plan for phase 004"
    next_safe_action: "Await phase 003 shims"
    blockers: ["depends-on:003-script-shim-and-db-relocation"]
    key_files:
      - "spec.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:1180041180041180041180041180041180041180041180041180041180040001"
      session_id: "118-004-mcp-tool-surface-removal-plan"
      parent_session_id: null
---
# Implementation Plan: 004 — MCP Tool Surface Removal

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM), Node.js 20+, MCP server runtime |
| **Framework** | Model Context Protocol server (`@modelcontextprotocol/sdk`) |
| **Storage** | None (delete-only; storage owner moved in phase 003) |
| **Testing** | Vitest for unit, smoke MCP startup, `mcp tools list` check |

### Overview

Phase 004 deletes a clean rectangle of the MCP tool surface: five handler files, four tool schema entries, four input-schema entries, and four registration calls. The work is delete-only, gated on phase 003's `.cjs` script shims existing first. The plan splits into Setup (verify dependency phase landed + scan for hidden consumers), Implementation (delete + edit), and Verification (typecheck + smoke start + tools list).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 003 `.cjs` script shims exist at `.opencode/skills/deep-loop-runtime/scripts/`
- [ ] Repo-wide grep for `deep_loop_graph_*` consumers identifies only YAML + doctor + playbook (handled in phases 005 / 006)
- [ ] Repo-wide grep for `handlers/coverage-graph` imports inside `mcp_server/` returns 0 hits outside the deleted files themselves
- [ ] MCP server builds clean on the pre-deletion baseline

### Definition of Done

- [ ] All five handler files deleted
- [ ] All four tool-schema entries removed
- [ ] All four input-schema entries removed
- [ ] All four registration calls removed
- [ ] `tsc --noEmit` exits 0
- [ ] MCP server smoke start succeeds
- [ ] `mcp tools list` no longer lists the four deleted tool IDs
- [ ] No leftover imports of deleted handler paths
- [ ] `checklist.md` items verified with evidence
- [ ] ADR-001 status: Accepted, five checks 5/5 PASS
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Delete-only surface removal. The MCP server keeps its registration architecture (schemas + handler-map + tool index) intact for all other tools; only the coverage-graph rectangle is excised.

### Key Components

- **`tool-schemas.ts`** (`mcp_server/`): central tool-definition list; loses 4 entries.
- **`schemas/tool-input-schemas.ts`** (`mcp_server/schemas/`): JSON-schema validators for each tool input; loses 4 entries.
- **`tools/index.ts`** (`mcp_server/tools/`): wires named handlers into the MCP server's tool-handler map; loses 4 registration calls (and the `import * from '../handlers/coverage-graph/index.ts'` line).
- **`handlers/coverage-graph/`** (`mcp_server/handlers/coverage-graph/`): folder containing the five handler files; deleted in full.

### Data Flow

```
BEFORE (still in place at end of phase 003):

mcp tools list
   |
   v
tool-schemas.ts  ---> 4 deep_loop_graph_* entries
   |
   v
tools/index.ts  ---> handlers/coverage-graph/index.ts ---> 4 handler files
                                                              |
                                                              v
                                                       runtime libs (already in deep-loop-runtime/)

AFTER phase 004:

mcp tools list   (4 fewer entries; other tools intact)

Consumers (phase 003 .cjs scripts) now bypass the MCP layer entirely:
   bash invocation --> deep-loop-runtime/scripts/*.cjs --> runtime libs
```

### Component Diagram

```
                  Before (post-phase-003)                         After phase 004
                  --------------------------                      ----------------
  +----------------------------+                       +----------------------------+
  | system-spec-kit MCP server |                       | system-spec-kit MCP server |
  +-------------+--------------+                       +-------------+--------------+
                |                                                    |
   +------------+------------+                          +------------+------------+
   | tool-schemas.ts         |                          | tool-schemas.ts         |
   |  - 4 deep_loop_graph_*  |                          |  (4 entries removed)    |
   |  - other tools          |                          |  - other tools          |
   +------------+------------+                          +------------+------------+
                |                                                    |
   +------------+------------+                          +------------+------------+
   | tools/index.ts          |                          | tools/index.ts          |
   |  reg(deep_loop_graph_*) |                          |  (4 reg() calls gone)   |
   |  reg(other tools)       |                          |  reg(other tools)       |
   +------------+------------+                          +------------+------------+
                |                                                    |
                v                                                    v
   +------------+------------+                          (handlers/coverage-graph/
   | handlers/coverage-graph/|                            no longer exists; other
   |  convergence.ts         |                            handlers untouched)
   |  upsert.ts              |
   |  query.ts               |
   |  status.ts              |
   |  index.ts               |
   +-------------------------+
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm phase 003 merged and `.cjs` script shims present at `.opencode/skills/deep-loop-runtime/scripts/`
- [ ] Repo-wide grep for `deep_loop_graph_` symbol references; classify hits by file (YAML / `/doctor` / playbook / OTHER)
- [ ] Repo-wide grep for `handlers/coverage-graph` import paths; flag any hit outside the five files marked for deletion
- [ ] Capture pre-deletion `mcp tools list` count as baseline (for SC-005 delta proof)
- [ ] Verify pre-deletion `tsc --noEmit` exits 0

### Phase 2: Implementation

- [ ] Delete `mcp_server/handlers/coverage-graph/convergence.ts`
- [ ] Delete `mcp_server/handlers/coverage-graph/upsert.ts`
- [ ] Delete `mcp_server/handlers/coverage-graph/query.ts`
- [ ] Delete `mcp_server/handlers/coverage-graph/status.ts`
- [ ] Delete `mcp_server/handlers/coverage-graph/index.ts` (handler-registration module)
- [ ] Delete the now-empty `mcp_server/handlers/coverage-graph/` folder
- [ ] Edit `mcp_server/tool-schemas.ts`: remove 4 tool-definition entries (and any local imports that become unused)
- [ ] Edit `mcp_server/schemas/tool-input-schemas.ts`: remove 4 input-schema entries (and any local imports that become unused)
- [ ] Edit `mcp_server/tools/index.ts`: remove 4 registration calls and the `from '../handlers/coverage-graph/...'` import line(s)
- [ ] Clear stale build artifacts: `rm -rf .opencode/skills/system-spec-kit/mcp_server/dist/`

### Phase 3: Verification

- [ ] Run `tsc --noEmit` on the spec-kit MCP server; expect exit 0
- [ ] Repo-wide grep confirms zero `deep_loop_graph_*` symbol references in any TS source under `mcp_server/`
- [ ] Repo-wide grep confirms zero `handlers/coverage-graph` import paths anywhere in repo
- [ ] Smoke-start the MCP server five times; expect 5/5 clean starts (NFR-R01)
- [ ] Call `mcp tools list`; confirm the four deleted IDs are absent and the total count dropped by exactly 4 (SC-005)
- [ ] Cross-check: confirm phase 003 `.cjs` scripts still load and execute (consumers ready for phase 005 / 006)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Coverage Target |
|-----------|-------|-------|-----------------|
| Static | TypeScript compile after deletes | `tsc --noEmit` | Exit 0 required |
| Static | Symbol-reference grep sweep | `grep -rn` / `rg` | Zero hits in `mcp_server/` |
| Smoke | MCP server cold start | Local MCP runtime | 5/5 success runs |
| Surface | Tool-list delta | `mcp tools list` | Exactly -4 tools vs baseline |
| Cross-phase | Phase 003 `.cjs` shim invocation still works | Direct bash invocation | Each of 4 scripts returns expected output |

Unit tests specific to the deleted handlers are out of scope here; their deletion is owned by phase 007.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003-script-shim-and-db-relocation` (phase 003) | Internal (sibling phase) | Pending | HARD - cannot start phase 004 deletes until shims exist |
| `002-lib-runtime-migration` (phase 002) | Internal (sibling phase) | Pending | Indirect - phase 003 depends on phase 002 |
| `system-spec-kit` MCP server build | Internal (toolchain) | Green | If TS build broken pre-phase, baseline cannot be established |
| `tsc` / `pnpm` (TS toolchain) | External | Green | Required for typecheck gate |
| MCP server runtime (`@modelcontextprotocol/sdk`) | External | Green | Required for smoke startup gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TS compile breaks unexpectedly after deletes, MCP server fails to start, or a hidden consumer surfaces post-merge.
- **Procedure**: `git revert` the phase-004 commit (or commit range). Because the five handler files and three edits are localized, the revert is mechanical and does not touch phase 003 shims, phase 002 lib moves, or phase 001 scaffold. After revert, re-run `tsc --noEmit` and smoke-start to confirm the pre-phase-004 baseline is restored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ---> Phase 2 (Implementation) ---> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 (sibling) | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 005 (sibling) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes (grep sweep + baseline capture) |
| Implementation | Medium | 60 minutes (5 deletes + 3 edits + import cleanup) |
| Verification | Low | 30 minutes (typecheck + 5 smoke starts + tool-list diff) |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deletion Checklist

- [ ] Git working tree clean for `.opencode/skills/system-spec-kit/mcp_server/**`
- [ ] Pre-phase commit SHA captured for revert reference
- [ ] `mcp tools list` baseline output captured to scratch
- [ ] Phase 003 sibling state verified (shims present)

### Rollback Procedure

1. **Immediate**: `git revert <phase-004-commit-sha>` (or `git restore` if not yet committed)
2. **Rebuild**: `rm -rf dist/` and re-run `tsc --noEmit`
3. **Smoke-start**: confirm MCP server restarts cleanly and tool count matches baseline
4. **Notify**: update `implementation-summary.md` with the revert reason and link the failing evidence

### Data Reversal

- **Has data migrations?** No - this phase is delete-only at the source-code level. No DB schema, no on-disk state, no migrations.
- **Reversal procedure**: N/A beyond `git revert`.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
                +-----------------------+
                | Phase 002             |
                | (lib-runtime-migration)|
                +-----------+-----------+
                            |
                            v
                +-----------------------+
                | Phase 003             |
                | (script-shim +        |
                |  DB-relocation)       |
                +-----------+-----------+
                            |
                            v
                +-----------------------+
                | Phase 004             |
                | (THIS - MCP tool      |
                |  surface removal)     |
                +-----------+-----------+
                            |
                            v
                +-----------------------+
                | Phase 005             |
                | (yaml-workflow-update)|
                +-----------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup gate | Phase 003 sibling | Verified pre-conditions | Implementation |
| Handler deletes | Setup gate | Empty `coverage-graph/` | Schema edits, tools-index edit |
| Schema edits | Handler deletes (logically) | Cleaned schema files | Typecheck |
| Tools-index edit | Schema edits | Cleaned registration | Typecheck + smoke start |
| Typecheck | All edits | TS compile signal | Smoke start |
| Smoke start | Typecheck | Live MCP server signal | Tool-list delta check |
| Tool-list delta | Smoke start | SC-005 evidence | Phase 005 + 006 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup** - 30 min - CRITICAL (gates everything else)
2. **Handler file deletes (x5)** - 15 min - CRITICAL
3. **Schema + tools-index edits (x3 files)** - 30 min - CRITICAL
4. **Typecheck + import cleanup** - 15 min - CRITICAL
5. **Smoke start + tool-list diff** - 30 min - CRITICAL

**Total Critical Path**: ~2 hours.

**Parallel Opportunities**: The five handler file deletes can run in a single batched git operation. The three file edits (`tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `tools/index.ts`) can be authored in parallel since they share no interleaving lines, then committed together.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup gate passed | Phase 003 shims confirmed; baseline captured | T+30 min |
| M2 | Deletes + edits landed | Five files removed; three files edited; imports cleaned | T+90 min |
| M3 | Verification green | Typecheck 0; 5/5 smoke starts; tool-list delta = -4 | T+120 min |
| M4 | Phase 004 closeout | Checklist verified, ADR-001 accepted, implementation-summary filled | T+150 min |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Complete removal of 4 MCP tools, no backward-compat aliases | User directive FULL_ISOLATE_NO_MCP; aliases would leave the MCP layer intact and contradict the directive |

---
