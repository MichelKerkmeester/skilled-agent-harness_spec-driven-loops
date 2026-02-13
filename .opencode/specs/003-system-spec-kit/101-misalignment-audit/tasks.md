# Tasks: System-Spec-Kit Ecosystem Misalignment Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[-]` | In Progress |

**Task Format**: `T### [Priority] Description → CHK-###`

---

## Phase 1: Exploration (Wave 1 - 5 Parallel Agents)

- [x] T001 [P0] Explore system-spec-kit SKILL.md - map structure, sections, tool/template references → CHK-001
- [x] T002 [P0] Explore MCP server - inventory all 22 tools, 7 layers, parameter schemas → CHK-001
- [x] T003 [P0] Explore spec_kit commands - map 7 commands + 13 YAML assets, workflow steps → CHK-001
- [x] T004 [P0] Explore memory commands - map 5 commands, tool references, workflow steps → CHK-001
- [x] T005 [P0] Explore create commands (6 + 6 YAML) + speckit.md agent definition → CHK-001

**Phase Gate**: All 5 component maps complete with inventories

---

## Phase 2: Cross-Cutting Analysis (Wave 2 - 5 Parallel Agents)

- [x] T006 [P0] Analyze SKILL.md ↔ MCP Server alignment (naming, schemas, layers, descriptions) → CHK-002
  - Output: `scratch/analysis-skill-mcp.md`
- [x] T007 [P0] Analyze SKILL.md ↔ Commands alignment (workflows, references, tool usage) → CHK-002
  - Output: `scratch/analysis-skill-commands.md`
- [x] T008 [P0] Analyze Commands ↔ MCP Schemas alignment (parameters, tool names, usage patterns) → CHK-002
  - Output: `scratch/analysis-commands-mcp.md`
- [x] T009 [P0] Analyze Agent ↔ Skill/Commands alignment (references, workflows, capabilities) → CHK-002
  - Output: `scratch/analysis-agent-alignment.md`
- [x] T010 [P0] Internal bug analysis (within-component issues, known issue categories) → CHK-002
  - Output: `scratch/analysis-internal-bugs.md`

**Phase Gate**: All 5 analysis files written to scratch/ with severity-rated findings

---

## Phase 3: Consolidation & Documentation

- [x] T011 [P0] Create spec folder documentation (spec.md, plan.md, tasks.md, checklist.md) → CHK-003
- [x] T012 [P0] Consolidate master findings report - de-duplicate, merge, prioritize all findings → CHK-004
- [x] T013 [P1] Verification pass - cross-check findings, validate no duplicates, confirm evidence → CHK-005

**Phase Gate**: Master report complete, spec folder validated

---

## Completion Criteria

- [x] All Phase 1 exploration tasks complete
- [x] All Phase 2 analysis tasks complete with output files
- [x] Phase 3 consolidation in progress
- [x] All tasks marked `[x]`
- [x] No blocked tasks remaining
- [x] All P0 checklist items verified
- [x] Master findings report ready for fix phase

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Analysis Files**: See `scratch/analysis-*.md`

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001-T005 | CHK-001 (Component coverage) | P0 | [x] |
| T006-T010 | CHK-010 through CHK-014 (Analysis coverage) | P0 | [x] |
| T011 | CHK-030 (Spec folder complete) | P0 | [x] |
| T012 | CHK-031 (Findings consolidated) | P0 | [x] |
| T013 | CHK-023, CHK-024 (Verification pass) | P1 | [x] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Exploration Complete
- [x] All 5 component families mapped
- [x] Tool inventories documented
- [x] Command inventories documented
- [x] Ready for cross-cutting analysis

### Gate 2: Analysis Complete
- [x] All 5 alignment dimensions analyzed
- [x] All findings have severity ratings
- [x] All analysis files written to scratch/
- [x] Evidence (file paths, line numbers) provided for each finding

### Gate 3: Consolidation Complete
- [x] Spec folder documentation created
- [x] Master findings report consolidated
- [x] Zero duplicate findings confirmed
- [x] Findings prioritized for fix phase

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| T012 | ~~Awaiting T011 completion~~ | ~~Medium~~ | ✅ Resolved |
| T013 | ~~Awaiting T012 completion~~ | ~~Low~~ | ✅ Resolved |

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Verification tracking
- Task-to-checklist traceability
- Phase completion gates
- Blocked task tracking
-->
