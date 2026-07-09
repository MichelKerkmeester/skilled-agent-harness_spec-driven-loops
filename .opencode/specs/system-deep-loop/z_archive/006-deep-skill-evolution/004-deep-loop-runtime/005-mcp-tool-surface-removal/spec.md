---
title: "Feature Specification: 004 — MCP Tool Surface Removal"
description: "Delete the 4 deep_loop_graph_* MCP tools (4 schema entries + 5 handler files + 4 registration calls) from system-spec-kit/mcp_server/ after phase 003 lands the .cjs script replacements. Eliminates the MCP layer for deep-loop / coverage-graph operations per user FULL_ISOLATE_NO_MCP directive."
trigger_phrases:
  - "MCP tool surface removal"
  - "delete deep_loop_graph_ tools"
  - "coverage-graph handler delete"
  - "118 phase 004"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/005-mcp-tool-surface-removal"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded L3 spec docs for phase 004"
    next_safe_action: "Await phase 003 shims"
    blockers: ["depends-on:003-script-shim-and-db-relocation"]
    completion_pct: 0
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:1180041180041180041180041180041180041180041180041180041180040000"
      session_id: "118-004-mcp-tool-surface-removal-scaffold"
      parent_session_id: null
---
# Feature Specification: 004 — MCP Tool Surface Removal

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 004 deletes the entire MCP tool surface for the four `deep_loop_graph_*` tools after phase 003 ships the `.cjs` script shims that consumers now invoke directly. The deletion removes five handler files under `mcp_server/handlers/coverage-graph/`, four entries in `tool-schemas.ts`, four entries in `schemas/tool-input-schemas.ts`, and four registration calls in the tools index. No aliases, wrappers, or transition layers remain; the MCP server still starts, and the four tool IDs are absent from `mcp tools list`.

**Key Decisions**: Complete removal with no backward-compat aliases (ADR-001), strict dependency on phase 003 script shims existing first (ADR-001 pre-condition).

**Critical Dependencies**: Phase 003 (`003-script-shim-and-db-relocation/`) MUST ship the four `.cjs` script entry points before this phase deletes the MCP handlers.
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
| **Parent Spec** | `..` (116-deep-skill-evolution/003-deep-loop-runtime phase parent) |
| **Predecessor** | `003-script-shim-and-db-relocation` (must ship first) |
| **Successor** | `005-yaml-workflow-update` |
| **Estimated LOC Removed** | ~500 (5 handler files + 4 schema entries + 4 registrations) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After phases 001 (runtime skill scaffold), 002 (lib migration), and 003 (script shims + DB relocation) complete, the four `deep_loop_graph_*` MCP tools become dead weight: their handlers still live in `system-spec-kit/mcp_server/handlers/coverage-graph/`, their schemas still live in `tool-schemas.ts` and `schemas/tool-input-schemas.ts`, and they still register at server startup, even though no consumer invokes them anymore. The user directive is FULL_ISOLATE_NO_MCP: the MCP layer for deep-loop / coverage-graph must not exist after the migration. Keeping aliases or wrappers leaves the surface intact and defeats the directive.

### Purpose

Delete the four `deep_loop_graph_*` MCP tools cleanly so `mcp tools list` shows four fewer tools, the MCP server still starts without errors, and the consumers (phase 005 YAMLs, phase 006 `/doctor` + system-code-graph playbook) invoke the phase-003 `.cjs` scripts directly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Delete five handler files in `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/`: `convergence.ts`, `upsert.ts`, `query.ts`, `status.ts`, and `index.ts` (handler-registration module)
- Drop four tool definitions from `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`: `deep_loop_graph_convergence`, `deep_loop_graph_upsert`, `deep_loop_graph_query`, `deep_loop_graph_status`
- Drop matching schema entries from `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- Drop the four registration calls from `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` (or whichever file wires the coverage-graph handlers into the MCP tool registry)
- Confirm MCP server still starts cleanly after deletions (`tsc --noEmit` + smoke startup)
- Confirm `mcp tools list` no longer reports the four `deep_loop_graph_*` IDs

### Out of Scope

- Updating workflow YAMLs to call the new scripts (owned by phase 005)
- Updating `/doctor` command + `system-code-graph` playbook (owned by phase 006)
- Test migration / deletion of MCP-specific tests (owned by phase 007)
- Removing or renaming `mk_spec_memory` tool ID itself (preserved per parent invariant)
- Deleting `.cjs` script shims or runtime library files (those moved in phase 003 / 002)
- Touching the runtime skill at `.opencode/skills/deep-loop-runtime/`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` | Delete | Handler for `deep_loop_graph_convergence` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts` | Delete | Handler for `deep_loop_graph_upsert` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts` | Delete | Handler for `deep_loop_graph_query` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts` | Delete | Handler for `deep_loop_graph_status` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts` | Delete | Handler-registration module for the four above |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Drop 4 tool definitions |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Drop 4 schema entries |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Modify | Drop 4 registration calls |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Five handler files deleted | `ls .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/` returns no files (folder either empty or removed) |
| REQ-002 | Four tool definitions removed from `tool-schemas.ts` | `grep -c "deep_loop_graph_" .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` returns 0 |
| REQ-003 | Four schema entries removed from `schemas/tool-input-schemas.ts` | `grep -c "deep_loop_graph_" .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` returns 0 |
| REQ-004 | Four registration calls removed from `tools/index.ts` | `grep -c "deep_loop_graph_\|coverage-graph/" .opencode/skills/system-spec-kit/mcp_server/tools/index.ts` returns 0 |
| REQ-005 | MCP server still compiles | `pnpm --filter @opencode/system-spec-kit run typecheck` exits 0 (or repo equivalent) |
| REQ-006 | MCP server still starts | Smoke start succeeds without throwing on missing handlers |
| REQ-007 | Tools list no longer shows the four IDs | `mcp tools list` does not include `deep_loop_graph_convergence/upsert/query/status` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | No leftover imports referencing deleted handlers | `grep -rn "handlers/coverage-graph" .opencode/skills/system-spec-kit/mcp_server/` returns 0 hits |
| REQ-009 | Phase 003 script shims confirmed present before delete | `ls .opencode/skills/deep-loop-runtime/scripts/*.cjs` returns the 4 expected shims |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five handler files no longer exist on disk under `mcp_server/handlers/coverage-graph/`.
- **SC-002**: Three modified files (`tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `tools/index.ts`) contain zero references to `deep_loop_graph_*` symbols.
- **SC-003**: `tsc --noEmit` on the spec-kit MCP server compiles clean.
- **SC-004**: MCP server starts and serves the remaining tool surface without errors.
- **SC-005**: `mcp tools list` count drops by exactly 4 tools versus pre-phase-004 baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 `.cjs` script shims | High - deleting handlers before shims exist breaks consumers | Hard pre-condition: `ls .cjs` check before any delete (REQ-009) |
| Dependency | Phase 002 runtime libs in `deep-loop-runtime/lib/` | High - shims require runtime libs to work | Verified by phase 003 prior to its merge |
| Risk | Hidden consumer still importing handlers | Medium - other code paths might import handler symbols | `grep -rn` scan across full repo before delete (REQ-008) |
| Risk | TS build cache stale after deletes | Low - cached dist may serve removed symbols briefly | `rm -rf dist/` before final smoke start |
| Risk | Doctor command tries to invoke deleted tool | Medium - `/doctor` updates land in phase 006 | Order constraint enforced by parent phase-map (004 -> 005 -> 006) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: MCP server cold-start time after deletes does not regress by more than 50ms versus pre-phase-004 baseline (deletion should reduce, not increase, startup time).

### Security

- **NFR-S01**: No new exposed handlers, ports, or RPC entry points are introduced; this is delete-only.

### Reliability

- **NFR-R01**: MCP server start success rate over five smoke runs is 5/5 after deletions.

---

## 8. EDGE CASES

### Data Boundaries

- **Empty handler folder after delete**: Either leave `handlers/coverage-graph/` empty or delete the folder; both are acceptable as long as no remaining import references the path.
- **Mixed-export modules**: If `tools/index.ts` re-exports other handler groups in the same statement as the coverage-graph group, the re-export edit must preserve the other groups intact.

### Error Scenarios

- **Phase 003 not landed yet**: REQ-009 fails fast; do not proceed with deletes. Phase 004 stalls and reports blocker.
- **Stale `dist/` referencing deleted handlers**: Clear build cache and re-run typecheck before claiming completion.
- **Hidden consumer found at deletion time**: Halt the deletion, file a follow-on task to retarget that consumer, and re-evaluate phase ordering.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 8 (5 delete + 3 modify), LOC: ~500 removed, Systems: 1 (spec-kit MCP server) |
| Risk | 14/25 | Auth: N, API: Y (MCP tool surface), Breaking: Y (4 tool IDs gone) |
| Research | 6/20 | Investigation needs: grep sweep for hidden consumers across repo |
| Multi-Agent | 4/15 | Workstreams: 1 (single executor + verification gate) |
| Coordination | 12/15 | Dependencies: phase 003 must land first; phases 005/006 follow this one |
| **Total** | **48/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase 003 shims missing or broken at delete time | H | L | Hard precondition check (REQ-009) before any delete |
| R-002 | Hidden import in repo still references deleted handler symbol | M | M | Full-repo `grep -rn` before delete; halt if hits |
| R-003 | TS build cache serves stale handler module after delete | L | M | `rm -rf dist/` then re-typecheck before completion claim |
| R-004 | Doctor or playbook invocation fails between 004 and 006 | M | M | Document the gap; phase 005 + 006 land within same arc |
| R-005 | Backward-compat alias request after merge | L | L | ADR-001 records explicit rejection rationale |

---

## 11. USER STORIES

### US-001: Spec-kit maintainer removes the dead MCP surface (Priority: P0)

**As a** spec-kit maintainer, **I want** the four `deep_loop_graph_*` MCP tools deleted from the server, **so that** the FULL_ISOLATE_NO_MCP directive is realized and the MCP surface only exposes tools that are actually consumed.

**Acceptance Criteria**:

1. Given phase 003 has shipped the four `.cjs` script shims, When phase 004 executes the deletions, Then five handler files are gone and three modified files contain zero `deep_loop_graph_*` references.
2. Given the deletions land, When the MCP server starts, Then it serves the remaining tool surface without errors and `mcp tools list` count drops by exactly four.

### US-002: Deep-loop workflow operator invokes scripts instead of MCP tools (Priority: P1)

**As a** deep-loop workflow operator, **I want** the MCP tool IDs absent after phase 004, **so that** phase 005's YAML rewrites and phase 006's `/doctor` + playbook updates land against a clean target with no shadow tool surface to fall back on.

**Acceptance Criteria**:

1. Given phase 004 completes, When phase 005 begins, Then no workflow YAML can re-bind to a phantom MCP tool because none of the four IDs exist in `tool-schemas.ts` anymore.

---

## 12. OPEN QUESTIONS

- Should the empty `handlers/coverage-graph/` folder be left in place for the brief window between 004 and 006, or removed immediately? **Provisional: remove the folder in this phase; phase 005 + 006 land in the same arc.**
- Are there any other handler files in `mcp_server/handlers/` that import from `coverage-graph/`? **Provisional: none expected; verified by REQ-008 grep sweep prior to delete.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: `../spec.md`
- **Predecessor Phase**: `../003-script-shim-and-db-relocation/`
- **Successor Phase**: `../005-yaml-workflow-update/`
