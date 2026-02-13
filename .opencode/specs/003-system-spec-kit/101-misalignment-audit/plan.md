# Implementation Plan: System-Spec-Kit Ecosystem Misalignment Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown analysis, MCP tool schemas (JSON/TypeScript) |
| **Framework** | OpenCode system-spec-kit ecosystem |
| **Storage** | Spec folder documentation (markdown files) |
| **Testing** | Manual cross-reference verification |

### Overview
This plan executes a 4-phase audit of the system-spec-kit ecosystem using parallel agent waves to maximize coverage while minimizing session time. Phase 1 maps all components individually, Phase 2 performs cross-cutting alignment analysis, Phase 3 hunts for internal bugs, and Phase 4 consolidates findings into a prioritized master report.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (all source files accessible)
- [x] Analysis dimensions defined (5 alignment dimensions + internal bugs)

### Definition of Done
- [x] All 5 analysis files written to scratch/
- [x] Master findings report consolidated
- [x] Spec folder complete (spec.md, plan.md, tasks.md, checklist.md)
- [x] Zero duplicate findings across analysis files (42→36 de-duplicated)
- [x] All findings categorized by severity with evidence

---

## 3. ARCHITECTURE

### Pattern
Wave-based parallel analysis with sequential consolidation

### Key Components
- **Exploration Agents (Wave 1)**: 5 parallel opus agents, each mapping one component family
- **Analysis Agents (Wave 2)**: 5 parallel opus agents, each checking one alignment dimension
- **Bug Hunter (Wave 3)**: 1 agent checking known issue categories within individual components
- **Consolidator (Wave 4)**: 1 agent merging, de-duplicating, and prioritizing all findings

### Data Flow
```
Source Components (6 component families)
    │
    ▼
Wave 1: Exploration (5 parallel agents)
    │ → Component maps, tool inventories, command inventories
    ▼
Wave 2: Cross-cutting Analysis (5 parallel agents)
    │ → Alignment findings with severity ratings
    ▼
Wave 3: Internal Bug Hunt (1 agent)
    │ → Within-component bug findings
    ▼
Wave 4: Consolidation (1 agent)
    │ → De-duplicated master report + spec folder
    ▼
Output: Prioritized findings report ready for fix phase
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Wave-Based Exploration (5 parallel agents)
- [x] T1: Map system-spec-kit SKILL.md structure, sections, references
- [x] T2: Map MCP server tools (22 tools, 7 layers, all schemas)
- [x] T3: Map spec_kit commands (7 commands + 13 YAML assets)
- [x] T4: Map memory commands (5 commands, tool references)
- [x] T5: Map create commands (6 commands + 6 YAML assets) + speckit agent

**Phase Gate**: All 5 component maps complete with tool/command inventories

### Phase 2: Cross-Cutting Analysis (5 parallel agents)
- [x] T6: Analyze SKILL.md ↔ MCP Server alignment (naming, schemas, layers)
- [x] T7: Analyze SKILL.md ↔ Commands alignment (workflows, references)
- [x] T8: Analyze Commands ↔ MCP Schemas alignment (parameters, tool usage)
- [x] T9: Analyze Agent ↔ Skill/Commands alignment (references, workflows)
- [x] T10: Internal bug analysis (within-component issues)

**Phase Gate**: All 5 analysis files written to scratch/ with severity-rated findings

### Phase 3: Consolidation & Documentation
- [x] T11: Create spec folder (spec.md, plan.md, tasks.md, checklist.md)
- [x] T12: Consolidate master findings report (de-duplicate, prioritize)
- [x] T13: Verification pass (cross-check all findings, validate no duplicates)

**Phase Gate**: Master report complete, spec folder validated, zero duplicate findings

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-reference | Verify findings reference real file paths and line numbers | Manual review + Grep |
| De-duplication | Ensure no finding appears in multiple analysis files | Consolidation agent |
| Completeness | Verify all components analyzed by at least 2 dimensions | Coverage matrix |
| Severity validation | Confirm severity ratings use consistent criteria | Manual review |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-spec-kit SKILL.md | Internal | Green | Cannot analyze skill layer |
| MCP server source | Internal | Green | Cannot analyze tool schemas |
| Command files (18+) | Internal | Green | Cannot analyze command layer |
| Agent definition | Internal | Green | Cannot analyze agent alignment |
| Sequential Thinking MCP | Tool | Green | Analysis planning degraded |
| Opus model availability | External | Green | Cannot run parallel agents |

---

## 7. ROLLBACK PLAN

- **Trigger**: Not applicable (read-only audit, no code changes)
- **Procedure**: Analysis files in scratch/ can be deleted; spec folder can be removed if audit is abandoned

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Exploration)
    │
    │  5 parallel agents map components
    │
    ▼
Phase 2 (Analysis) ──────── depends on Phase 1 component maps
    │
    │  5 parallel agents check alignment
    │
    ▼
Phase 3 (Bug Hunt) ──────── depends on Phase 1 + Phase 2 context
    │
    │  1 agent checks internal bugs
    │
    ▼
Phase 4 (Consolidation) ─── depends on Phases 2 + 3 findings
    │
    │  Merge, de-duplicate, prioritize
    │
    ▼
Output: Master findings report
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1: Exploration | None | Analysis, Bug Hunt |
| 2: Analysis | Exploration | Consolidation |
| 3: Bug Hunt | Exploration, Analysis | Consolidation |
| 4: Consolidation | Analysis, Bug Hunt | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1: Exploration | Medium | ~15 min (5 parallel agents) |
| 2: Analysis | High | ~20 min (5 parallel agents) |
| 3: Bug Hunt | Medium | ~10 min (1 agent) |
| 4: Consolidation | Medium | ~15 min (1 agent + spec creation) |
| **Total** | | **~60 min** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No code changes planned (read-only audit)
- [x] All output goes to spec folder and scratch/
- [x] No external system dependencies

### Rollback Procedure
1. Delete scratch/ analysis files
2. Delete spec folder if incomplete
3. No other cleanup needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (documentation-only output)

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
