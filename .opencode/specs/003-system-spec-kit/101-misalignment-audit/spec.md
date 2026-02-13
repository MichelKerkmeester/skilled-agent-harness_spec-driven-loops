# Feature Specification: System-Spec-Kit Ecosystem Misalignment Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-10 |
| **Branch** | `101-misalignment-audit` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit ecosystem has grown organically across multiple components (SKILL.md, MCP server, 18+ commands, agent definition) without a systematic cross-component alignment check. This has resulted in broken references, phantom templates, architectural gaps where key MCP tools go unused by any command, and naming inconsistencies that create LLM tool-calling traps.

### Purpose
Perform a comprehensive audit of all system-spec-kit ecosystem components to identify and categorize every misalignment, inconsistency, and internal bug -- producing a prioritized findings report that enables a targeted fix phase.

---

## 3. SCOPE

### In Scope
- Analyze system-spec-kit SKILL.md for internal consistency and accuracy
- Analyze MCP server (22 MCP tools across 7 layers) for schema/naming issues
- Analyze spec_kit commands (7 commands + 13 YAML assets) for SKILL.md alignment
- Analyze memory commands (5 commands) for MCP server alignment
- Analyze create commands (6 commands + 6 YAML assets) for ecosystem alignment
- Analyze speckit.md agent for skill/command alignment
- Cross-component alignment analysis across 5 dimensions
- Internal bug hunting for known issue categories
- Consolidate all findings into categorized, severity-rated report

### Out of Scope
- **Fixing the identified issues** - that is phase 2 (separate spec folder)
- **MCP server code bugs** - the codebase is well-maintained; focus is on interface/documentation misalignments
- **Performance testing** of MCP tools
- **User experience testing** of commands

### Components Analyzed

| Component | Path | Scope |
|-----------|------|-------|
| system-spec-kit SKILL.md | `.opencode/skill/system-spec-kit/SKILL.md` | Full document analysis |
| MCP Server | `.opencode/skill/system-spec-kit/mcp_server/` | 22 MCP tools, 7 layers |
| spec_kit Commands | `.opencode/command/spec_kit/` | 7 commands + 13 YAML assets |
| memory Commands | `.opencode/command/memory/` | 5 commands |
| create Commands | `.opencode/command/create/` | 6 commands + 6 YAML assets |
| speckit Agent | `.opencode/agent/speckit.md` | Agent definition |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 alignment dimensions analyzed | Analysis files exist in scratch/ for each dimension |
| REQ-002 | All findings categorized by severity (Critical/Medium/Low) | Every finding has a severity rating with justification |
| REQ-003 | Cross-references verified between analysis files | No contradictory findings across analysis dimensions |
| REQ-004 | Master findings report consolidates all issues | Single document with de-duplicated, prioritized findings |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Recommendations prioritized for fix phase | Each finding has a suggested fix priority |
| REQ-006 | Top 5 critical issues highlighted | Executive summary with highest-impact findings |
| REQ-007 | Component coverage matrix complete | Table showing which components were analyzed and by which dimension |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 5 analysis dimensions produce documented findings with evidence
- **SC-002**: Zero duplicate findings across the 5 analysis files
- **SC-003**: Every finding includes: description, severity, evidence (file:line), and suggested fix category
- **SC-004**: Master report enables phase 2 fix work to begin without re-analysis

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Analysis scope too broad | Medium - May miss subtle issues | Wave-based approach with parallel agents ensures coverage |
| Risk | Findings overlap between dimensions | Medium - Duplicate work | Cross-reference check in consolidation phase |
| Dependency | Access to all component source files | High - Cannot analyze without | Pre-verified: all paths accessible |
| Risk | Severity classification subjective | Low - Different reviewers may rate differently | Use consistent criteria: Critical = broken functionality, Medium = inconsistency, Low = style |

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Completeness
- **NFR-C01**: Every component in scope must be analyzed by at least 2 dimensions
- **NFR-C02**: Analysis must cover both structural (file/section existence) and semantic (content accuracy) issues

### Traceability
- **NFR-T01**: Every finding must reference specific file paths and line numbers where applicable
- **NFR-T02**: Every finding must map to exactly one alignment dimension

### Usability
- **NFR-U01**: Master report must be actionable without re-reading individual analysis files
- **NFR-U02**: Findings must be grouped to enable batch fixing (e.g., all naming issues together)

---

## L2: EDGE CASES

### Analysis Boundaries
- Components that span multiple categories (e.g., SKILL.md references both MCP tools AND commands): Analyze in the most relevant dimension, cross-reference in others
- Findings that are "by design" vs actual bugs: Document as-is, flag ambiguous cases for human review
- Features documented in SKILL.md but not yet implemented: Categorize as "gap" not "bug"

### Classification Ambiguity
- Same root cause manifesting in multiple dimensions: Track as single finding with multiple symptoms
- Severity disagreements: Default to higher severity, note rationale

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 6 components, 40+ files, 22 MCP tools, 18+ commands |
| Risk | 10/25 | Read-only audit, no code changes, no breakage risk |
| Research | 18/20 | Deep cross-component analysis required |
| **Total** | **48/70** | **Level 2** (high scope + research, low risk) |

---

## 7. FINDINGS SUMMARY

### Overview

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | ~10 | Broken references, missing mandatory steps, phantom templates, architectural gaps (3 disproved by post-audit verification, see implementation-summary.md) |
| **Medium** | ~19 | Inconsistencies, missing documentation, workflow gaps, parameter mismatches |
| **Low** | ~11 | Style issues, naming inconsistencies, minor documentation gaps |
| **Total** | **~42** | Across all 5 analysis dimensions |

**Post-Audit Verification Note**: A systematic verification of all 36 findings against current source files found that findings F-002, F-003, and F-004 were inaccurate (the referenced tools/parameters DO exist in current commands), F-007 and F-009 were inaccurate (references were correct or already removed), F-012 was already fixed, and several others were partially correct. See implementation-summary.md for full verification results.

### Top 5 Critical Issues

1. **`memory_context` (L1 unified entry) never used by any command** - The SKILL.md and AGENTS.md designate `memory_context` as the unified entry point (L1), yet zero commands invoke it. This is an architectural gap where the designed primary interface is completely bypassed.

2. **`implement.md` missing `generate-context.js`** - The implement command lacks the mandatory memory save step using `generate-context.js`, violating AGENTS.md's Memory Save Rule which requires this script for all context preservation.

3. **`complete.md` missing PREFLIGHT/POSTFLIGHT** - The full lifecycle command (`complete.md`) has no epistemic learning integration (task_preflight/task_postflight), meaning the most comprehensive workflow produces no learning measurements.

4. **`speckit.md` references "verbose/" templates that don't exist** - The agent definition references `templates/verbose/` as a template source, but this directory does not exist in the system-spec-kit skill, creating a phantom reference that would cause failures.

5. **`memory_match_triggers` uses snake_case while 21 other tools use camelCase** - One MCP tool uses `snake_case` parameter naming (`session_id`, `include_cognitive`) while all 21 other tools use `camelCase`, creating an LLM tool-calling trap where the model applies the majority pattern to the exception.

### Analysis Files

| File | Dimension | Findings |
|------|-----------|----------|
| `scratch/analysis-skill-mcp.md` | SKILL.md ↔ MCP Server | Naming, schema, layer mismatches |
| `scratch/analysis-skill-commands.md` | SKILL.md ↔ Commands | Missing workflows, phantom references |
| `scratch/analysis-commands-mcp.md` | Commands ↔ MCP Schemas | Parameter mismatches, unused tools |
| `scratch/analysis-agent-alignment.md` | Agent ↔ Skill/Commands | Broken references, workflow gaps |
| `scratch/analysis-internal-bugs.md` | Internal bugs | Within-component issues |

---

## 8. OPEN QUESTIONS

- Should "by design" gaps (e.g., memory_context intentionally unused) be tracked differently from bugs?
- What is the acceptable timeline for the phase 2 fix effort?
- Should severity ratings be validated by a second reviewer before fix phase begins?

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
