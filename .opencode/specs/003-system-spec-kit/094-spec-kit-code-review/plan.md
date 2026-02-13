# Implementation Plan: Spec Kit MCP Server Code Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Shell (Bash), Python |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite (via better-sqlite3) |
| **Testing** | Vitest (.test.ts files) |

### Overview
Comprehensive code review of the entire `system-spec-kit` MCP server codebase (679 files) against the coding standards defined in `workflows-code--opencode/SKILL.md`. The approach uses parallel multi-agent teams: 10 Opus 4.6 agents + 10 Sonnet agents for review, followed by 10 Opus 4.6 agents for targeted bug fixes. Each review agent covers a specific functional area and produces a scored assessment with categorized findings (P0/P1/P2).

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All P0 and P1 bugs fixed
- [x] Review findings documented with scores
- [x] Remaining P2 items catalogued for follow-up

---

## 3. ARCHITECTURE

### Pattern
Multi-agent parallel review with consolidated fix phase

### Key Components
- **Review Agents (20)**: 10 Opus 4.6 + 10 Sonnet, each assigned a distinct code area
- **Fix Agents (10)**: 10 Opus 4.6 agents, each assigned 1-3 specific bugs to fix
- **Standards Reference**: `workflows-code--opencode/SKILL.md` serving as the review rubric
- **Target Codebase**: `system-spec-kit/mcp_server/` (handlers, lib, core) + `scripts/`

### Data Flow
```
Standards Doc (SKILL.md)
    |
    v
Review Agents (parallel) --> Scored Reports (per area)
    |
    v
Consolidated Findings --> Bug List (P0/P1/P2)
    |
    v
Fix Agents (parallel) --> Targeted Patches (per bug)
    |
    v
Verified Source Files (TypeScript)
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & Partitioning
- [x] Identify all code files in scope (679 total)
- [x] Categorize files by functional area (8 review areas)
- [x] Read and understand the coding standards reference (`SKILL.md`)
- [x] Design agent assignment matrix (20 review + 10 fix agents)

### Phase 2: Parallel Review (10 Opus + 10 Sonnet)
- [x] Deploy 10 Opus 4.6 review agents across 10 code areas
- [x] Deploy 10 Sonnet review agents across 10 code areas
- [x] Each agent reviews assigned files against SKILL.md standards
- [x] Each agent produces: score (0-100), P0/P1/P2 findings, fix recommendations
- [x] Handle rate limit failures gracefully (2 Opus, 9 Sonnet hit limits)

### Phase 3: Consolidation & Triage
- [x] Collect all review reports (8 Opus + 1 Sonnet completed)
- [x] Merge findings into unified bug list
- [x] Classify bugs: 5 P0, 24+ P1, ~48 P2
- [x] Calculate weighted average score: 68/100
- [x] Prioritize P0 and P1 bugs for immediate fixing

### Phase 4: Parallel Fix (10 Opus agents)
- [x] Assign 19 bugs across 10 Opus 4.6 fix agents
- [x] Each agent applies surgical fix to assigned bugs
- [x] Use established patterns: collect-then-delete, explicit null checks, NaN guards
- [x] All 10 fix agents completed successfully

### Phase 5: Documentation & Handover
- [x] Document all findings with area scores
- [x] Catalogue remaining P2 items
- [x] Note `dist/` rebuild requirement
- [x] Save session context to memory

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Code Review | All 679 files against SKILL.md | Multi-agent parallel review |
| Pattern Verification | Each fix applies correct pattern | Agent self-verification |
| Manual | Spot-check fixes for correctness | Code reading |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `workflows-code--opencode/SKILL.md` | Internal | Green | Cannot score against standards |
| Opus 4.6 agent capacity | External | Yellow | Rate limits reduce coverage |
| Sonnet agent capacity | External | Red | 9/10 agents rate-limited |
| TypeScript compiler | Internal | Yellow | `dist/` rebuild needed post-fix |

---

## 7. ROLLBACK PLAN

- **Trigger**: Fix introduces regression or breaks MCP server functionality
- **Procedure**: `git revert` the fix commit; each fix is isolated to specific files

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Review) ──► Phase 3 (Triage) ──► Phase 4 (Fix) ──► Phase 5 (Docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup & Partitioning | None | Review |
| Parallel Review | Setup | Triage |
| Consolidation & Triage | Review | Fix |
| Parallel Fix | Triage | Docs |
| Documentation | Fix | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup & Partitioning | Low | 15 minutes |
| Parallel Review (20 agents) | High | 30-45 minutes (parallel) |
| Consolidation & Triage | Medium | 15 minutes |
| Parallel Fix (10 agents) | Medium | 20-30 minutes (parallel) |
| Documentation & Handover | Low | 15 minutes |
| **Total** | | **~1.5-2 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Source files backed up via git
- [ ] `dist/` rebuild scheduled as follow-up
- [x] Changes isolated to specific files (no cross-cutting refactors)

### Rollback Procedure
1. Identify which fix introduced the issue
2. `git revert` the specific commit or restore the file from git history
3. Verify MCP server starts and responds correctly
4. Rebuild `dist/` if needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A -- all changes are source code only

---
