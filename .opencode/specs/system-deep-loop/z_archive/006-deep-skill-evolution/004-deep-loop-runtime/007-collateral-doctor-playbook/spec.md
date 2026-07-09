---
title: "Feature Specification: 118/006 — Update /doctor + system-code-graph Playbook Collateral"
description: "Phase 006 of 118 FULL ISOLATE + NO MCP. Updates 4 collateral files that still reference removed mcp__mk_spec_memory__deep_loop_graph_* MCP tools to invoke deep-loop-runtime .cjs scripts instead."
trigger_phrases:
  - "phase 006 collateral"
  - "doctor deep-loop update"
  - "system-code-graph playbook collateral"
  - "deep_loop_graph mcp removal collateral"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/007-collateral-doctor-playbook"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded Level 2 spec docs for phase 006 collateral update."
    next_safe_action: "Wait for phase 005 (YAML workflow update) completion, then execute T001-T010."
    blockers:
      - "phase 005 must complete first — workflow YAMLs swap to script invocations before collateral updates"
    completion_pct: 0
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1180061180061180061180061180061180061180061180061180061180060000"
      session_id: "118-006-collateral-scaffold"
      parent_session_id: null
---

# Feature Specification: 118/006 — Update /doctor + system-code-graph Playbook Collateral

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Scaffolded |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (118 phase parent) |
| **Predecessor** | `005-yaml-workflow-update` (must complete first) |
| **Successor** | `007-test-migration` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After phases 003 (script shims), 004 (MCP tool surface removal), and 005 (workflow YAML migration), 4 collateral files still reference the deleted `mcp__mk_spec_memory__deep_loop_graph_<X>` MCP tools. These references will fail at runtime: `/doctor deep-loop` health checks will dispatch against tool IDs that no longer exist, and the `system-code-graph` manual playbook scenario will fail assertion gates that probe the removed tool surface.

### Purpose

Replace MCP tool invocations in the 4 collateral files with direct `node .opencode/skills/deep-loop-runtime/scripts/<X>.cjs --health-check` calls. The script output format (JSON to stdout) is preserved by phase 003, so downstream assertions on JSON shape remain valid; only the dispatch path changes.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update `.opencode/commands/doctor.md` to invoke `deep-loop-runtime/scripts/*.cjs` for deep-loop diagnostics
- Update `.opencode/commands/doctor/_routes.yaml` route manifest so deep-loop diagnostic routes point at script paths instead of MCP tool IDs
- Update `.opencode/commands/doctor/update.md` so update/refresh operations targeting deep-loop state call the script shims
- Update `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/deep-loop-graph-convergence-yaml-fire.md` to dispatch the convergence scenario via the new script path
- Preserve assertion semantics: JSON shape of `--health-check` stdout matches the prior MCP tool response shape

### Out of Scope

- Editing the `.cjs` scripts themselves (owned by phase 003)
- Editing workflow YAMLs (owned by phase 005)
- Editing test files (owned by phase 007)
- Renaming or relocating collateral files
- Touching unrelated `/doctor` routes (memory, causal-graph, code-graph, cocoindex, skill-advisor, skill-budget)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor.md` | Modify | Swap deep_loop_graph_status MCP tool refs for script invocations |
| `.opencode/commands/doctor/_routes.yaml` | Modify | Update diagnostic target manifest for deep-loop routes |
| `.opencode/commands/doctor/update.md` | Modify | Replace MCP tool surface refs in refresh ops with script paths |
| `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/deep-loop-graph-convergence-yaml-fire.md` | Modify | Update dispatch path in test scenario |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero `mcp__mk_spec_memory__deep_loop_graph_*` references remain in any of the 4 collateral files | `grep -c` returns 0 across all 4 files |
| REQ-002 | `/doctor deep-loop` health check succeeds against the new script invocation | Direct manual invocation exits 0 with JSON stdout |
| REQ-003 | `system-code-graph` playbook scenario 009 references the new script path | Playbook file lints clean, dispatch line matches script shim contract |
| REQ-004 | No collateral file outside the 4 scope-locked paths is modified | `git diff --stat` shows exactly 4 files changed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `_routes.yaml` mutation class annotations remain accurate after edit | Each updated deep-loop route still tagged `read-only`/`add-only`/`mutates` correctly |
| REQ-006 | Inline narrative in `doctor.md` reflecting the dispatch change is one sentence or less | Diff readability check |
| REQ-007 | Playbook expected-outcome assertions remain valid because JSON shape is preserved | Compare new vs old expected stdout snippet |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/007-collateral-doctor-playbook --strict` exits 0
- **SC-002**: `grep -RIl 'mcp__mk_spec_memory__deep_loop_graph_' .opencode/commands/doctor.md .opencode/commands/doctor/ .opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/deep-loop-graph-convergence-yaml-fire.md` returns zero matches
- **SC-003**: Manual `/doctor deep-loop` invocation succeeds against the runtime skill script paths

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 (YAML workflow update) | Collateral cannot point at scripts until workflow YAMLs are first | Strict phase ordering — do not start 006 until 005 completes |
| Dependency | Phase 003 (script shim) | Scripts must exist at `.opencode/skills/deep-loop-runtime/scripts/*.cjs` | Verify file existence pre-edit |
| Risk | JSON shape drift | If phase 003 changed output schema, playbook assertions break | Compare `--health-check` JSON against legacy tool response snapshot before editing playbook |
| Risk | `_routes.yaml` mutation-class miscategorization | `/doctor` router asks Gate 3 incorrectly per route | Re-read mutation manifest after each route edit |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `/doctor deep-loop` health-check round-trip stays under 2s (script process startup negligible vs MCP tool dispatch)

### Reliability
- **NFR-R01**: All 4 files remain valid markdown / YAML after edit (no parse failures)
- **NFR-R02**: Playbook scenario remains runnable end-to-end without manual fixup

### Maintainability
- **NFR-M01**: Each script invocation in collateral uses the same canonical form: `node .opencode/skills/deep-loop-runtime/scripts/<name>.cjs --health-check`
- **NFR-M02**: No copy-pasted inline implementation details — collateral cites the script path only

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Pre-Edit Conditions
- **Script not yet authored**: Phase 003 incomplete → HALT, do not edit collateral against non-existent paths
- **Phase 005 unmerged**: Workflow YAMLs still reference MCP tools → HALT, ordering violation

### Post-Edit Conditions
- **Stale grep match**: A legitimate historical reference in a code comment that mentions the old tool name → leave in narrative only if clearly historical; otherwise replace
- **`_routes.yaml` parse failure**: YAML indentation broken after edit → re-validate with `yq` or equivalent before commit
- **Playbook scenario references a flag that the new script does not accept**: HALT, escalate to phase 003 for flag parity

### Cross-File Consistency
- All 4 files reference the script with identical path syntax (no `./` vs absolute drift)
- `_routes.yaml` route IDs match `/doctor` body subcommand names

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 4 files, < 30 LOC of diff, single system (`/doctor` + 1 playbook scenario) |
| Risk | 8/25 | No runtime semantics changed; only dispatch path; risk concentrated in `_routes.yaml` mutation-class annotations and JSON shape parity |
| Research | 4/20 | Inventory pre-edit grep counts + JSON shape comparison against phase-003 fixture |
| **Total** | **18/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `doctor/update.md` still mention the legacy MCP tool surface for migration-history clarity, or should it be a clean cutover? **Decision: clean cutover — migration history lives in 118 phase-parent spec.md, not in command surface docs.**
- Should the playbook scenario file be renamed to drop `deep-loop-graph` prefix once it dispatches via scripts? **Decision: NO — filename is referenced from playbook root index; rename is out of scope for this phase.**

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Phase Parent**: `../spec.md`
- **Predecessor Phase**: `../005-yaml-workflow-update/`
- **Successor Phase**: `../007-test-migration/`
- **Script Shim Owner**: `../003-script-shim-and-db-relocation/`
