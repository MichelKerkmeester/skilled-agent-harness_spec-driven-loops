---
title: "Feature Specification: 118 — Deep-Loop Full Isolation (No MCP)"
description: "Phase parent for executing user-directive FULL ISOLATE override of 117 SPLIT ruling. Moves ALL deep-loop / coverage-graph infrastructure (13 lib files + 5 MCP handlers + DB + 4 tool registrations) into a new .opencode/skills/deep-loop-runtime/ peer skill. MCP tools replaced by direct .cjs script invocations. Eight phase children execute the migration."
trigger_phrases:
  - "deep-loop full isolation"
  - "deep-loop-runtime peer skill"
  - "MCP removal deep-loop"
  - "118 full isolation implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp"
    last_updated_at: "2026-05-22T18:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase parent + 8 child folders."
    next_safe_action: "Execute phase 001 — runtime-skill-scaffold."
    blockers: []
    completion_pct: 5
    key_files:
      - "001-runtime-skill-scaffold/spec.md"
      - "002-lib-runtime-migration/spec.md"
      - "003-script-shim-and-db-relocation/spec.md"
      - "004-mcp-tool-surface-removal/spec.md"
    session_dedup:
      fingerprint: "sha256:1181181181181181181181181181181181181181181181181181181181180000"
      session_id: "118-deep-loop-full-isolation-phase-parent"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 118 — Deep-Loop Full Isolation (No MCP)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 (phased program) |
| **Priority** | P1 |
| **Status** | Scaffolded; phase 001 next |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `..` (skilled-agent-orchestration track root) |
| **Predecessor** | 117-deep-loop-core-isolation-deliberation (council deliberation; SPLIT ruling overridden) |
| **Successor** | None planned |
| **Handoff Criteria** | Each child phase validates independently; parent recursive validation passes; full vitest sweep green; alignment-drift PASS on all changed scope |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 117 AI Council ruled **SPLIT** — pure runtime libs move to a new `deep-loop-runtime/` peer skill, but MCP handlers + SQLite-schema-owner file (`coverage-graph-db.ts`) stay in `system-spec-kit/mcp_server/` because the council ranked "MCP tool ID stability" and "DB lifecycle in MCP server" as non-negotiable constraints.

**User directive override** (post-117): treat those constraints as relaxable. The 4 deep_loop_graph_* MCP tools have only 2 external consumers outside the deep-* workflow YAMLs (`/doctor` diagnostic + `system-code-graph` playbook scenario), and the tool surface is small (~500 LOC across 5 handler files + 4 schema entries). Replacing MCP-tool dispatch with direct `.cjs` script invocation is the canonical pattern already used by `reduce-state.cjs`. The DB lifecycle can move with the schema-owner code as long as the new owner (deep-loop-runtime scripts) has a single opener/closer.

### Purpose

Execute **FULL ISOLATE + NO MCP** as a phased program: move ALL deep-loop / coverage-graph infrastructure into a new `.opencode/skills/deep-loop-runtime/` peer skill; replace the 4 MCP tools with `.cjs` scripts; update workflow YAML + `/doctor` + `system-code-graph` collateral; split tests by responsibility; final verification + changelog.

> **Phase-parent note:** This parent tracks the child phase map only. Detailed planning, tasks, checklists, decisions, and continuity live inside the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `.opencode/skills/deep-loop-runtime/` peer skill (new)
- Move all 10 `system-spec-kit/mcp_server/lib/deep-loop/*.ts` files into the runtime skill
- Move all 3 `system-spec-kit/mcp_server/lib/coverage-graph/*.ts` files (including `coverage-graph-db.ts`) into the runtime skill
- Author 4 `.cjs` script entry points replacing the MCP tool surface
- Relocate `deep-loop-graph.sqlite` ownership into runtime skill `storage/`
- Delete 5 MCP handler files + 4 tool schema entries from `system-spec-kit/mcp_server/`
- Update 4 workflow YAML files (`spec_kit_deep-{review,research}_{auto,confirm}.yaml`)
- Update `/doctor` (3 files) + `system-code-graph` playbook (1 file) collateral
- Split tests: runtime tests → `deep-loop-runtime/tests/`; remove MCP-specific tests for the deleted tools
- Final verification: vitest sweep, alignment-drift, validate.sh recursive strict
- deep-review SKILL.md version bump + changelog v1.4.0.0
- Resource-map update for 116 arc (deferred from 116/008)

### Out of Scope

- Changing semantics of any existing runtime function (this is relocation + interface swap, not refactor)
- Removing tool IDs that other (non-deep) MCP server features rely on
- Refactoring deep-review/deep-research workflow logic
- Renaming `deep-loop-graph.sqlite` filename
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status | Level |
|-------|--------|-------|--------|-------|
| 001 | `001-runtime-skill-scaffold/` | Create `deep-loop-runtime/` skeleton (SKILL.md, lib/, scripts/, storage/, tests/) | Scaffolded | 2 |
| 002 | `002-lib-runtime-migration/` | Move all 13 lib .ts files (10 deep-loop + 3 coverage-graph) into runtime | Scaffolded | 2 |
| 003 | `003-script-shim-and-db-relocation/` | Create 4 .cjs script entry points + relocate SQLite DB ownership | Scaffolded | 3 |
| 004 | `004-mcp-tool-surface-removal/` | Delete 5 MCP handler files + 4 tool schema entries | Scaffolded | 3 |
| 005 | `005-yaml-workflow-update/` | Update 4 workflow YAMLs to use bash script invocations | Scaffolded | 2 |
| 006 | `006-collateral-doctor-playbook/` | Update /doctor command + system-code-graph playbook scenario | Scaffolded | 2 |
| 007 | `007-test-migration/` | Split tests by responsibility; remove deleted-tool tests | Scaffolded | 2 |
| 008 | `008-verification-changelog-closeout/` | Vitest sweep + alignment-drift + SKILL.md version bump + changelog + resource-map + closeout | Scaffolded | 2 |

### Phase Transition Rules

- **001 → 002**: runtime skill scaffold must exist (folders + SKILL.md) before file moves land
- **002 → 003**: lib files must be in runtime before scripts can require them
- **003 → 004**: script shims must exist + be tested before MCP handlers are removed (consumers swap to scripts first)
- **004 → 005**: MCP tools must be deleted before workflow YAMLs reference their replacements (otherwise tool-name collision)
- **005 → 006**: workflow YAMLs must reference scripts before collateral updates (so /doctor checks the new invocation path)
- **006 → 007**: collateral done before test split (tests verify the post-collateral state)
- **007 → 008**: tests must pass before closeout
- All phases share `mk_spec_memory` MCP tool ID preservation as constraint EXCEPT for the 4 `deep_loop_graph_*` tools which are explicitly removed per user directive

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Runtime skill exists at `.opencode/skills/deep-loop-runtime/` with SKILL.md + folder structure | `ls .opencode/skills/deep-loop-runtime/` |
| 002 | 003 | All 13 lib files moved + tsc compiles clean from new locations | `cd .../deep-loop-runtime && tsc --noEmit` |
| 003 | 004 | 4 .cjs scripts exist + smoke-tested + DB opens from new path | Direct invocation tests pass |
| 004 | 005 | 5 handler files + 4 tool schema entries deleted; MCP server still starts | `mcp tools list` (4 tools absent) |
| 005 | 006 | All 4 YAMLs reference bash scripts (no `mcp_tool: deep_loop_graph_*` left) | `grep -c mcp__mk_spec_memory__deep_loop_graph` returns 0 in YAMLs |
| 006 | 007 | /doctor health-check passes; playbook scenario references new paths | `/doctor deep-loop` + visual review |
| 007 | 008 | Full vitest sweep green; runtime tests under deep-loop-runtime/, MCP-specific tests for removed tools deleted | `pnpm vitest run` (zero failures) |
| 008 | DONE | SKILL.md v1.4.0.0 + changelog + resource-map + alignment-drift PASS + closeout | Final commit lands |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the new `deep-loop-runtime/` skill live alongside `deep-review` and `deep-research` (sibling) or under a `runtime/` namespace? **Decision: peer (sibling), matching the existing skill flat layout.**
- Should we preserve `mcp__mk_spec_memory__deep_loop_graph_*` tool IDs as aliases for backward compat? **Decision: NO — user directive is complete MCP removal; aliases would leave the MCP layer intact.**
- What's the migration plan for `deep-loop-graph.sqlite` data if any historical data exists? **Decision: cp into new storage path during phase 003; old path remains as fallback for ~1 commit window then deleted in phase 008.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Deliberation packet (predecessor)**: `../117-deep-loop-core-isolation-deliberation/`
- **117 ADR-001**: SPLIT ruling (superseded by this packet's user-directive override)
- **Migration outline source**: `../117-deep-loop-core-isolation-deliberation/ai-council/seats/round-001/seat-D-adjudicator.md` §Migration Outline (adapted to FULL_ISOLATE_NO_MCP)
- **Graph Metadata**: `graph-metadata.json`
- **Next active phase**: `001-runtime-skill-scaffold/`
