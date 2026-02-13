<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: System-Spec-Kit Improvements Based on Goodspec Analysis

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## EXECUTIVE SUMMARY

Implement 9 improvements to System-Spec-Kit based on comprehensive analysis of the Goodspec framework. The improvements focus on UX patterns (contract gates, status dashboard) while preserving our technical innovations (hybrid search, FSRS decay, causal graph). This work enhances workflow clarity, reduces friction, adds formal scope management, and reviews AGENTS.md alignment.

**Key Decisions**: Adopt Goodspec's explicit confirmation gates, wave-based task organization

**Critical Dependencies**: Existing gate system in AGENTS.md, current command structure in `.opencode/command/spec_kit/`

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Planning |
| **Created** | 2026-02-04 |
| **Branch** | `086-speckit-memory-refinement` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The current System-Spec-Kit lacks explicit user confirmation points (scope often drifts without formal agreement), has no quick status visibility (users must parse multiple files), and provides no formal scope change management (amendments are informal edits). These gaps create friction and inconsistent behavior during AI-assisted development.

### Purpose
Add explicit contract gates, status dashboard, deviation classification, wave-based execution, formal amendment tracking, inline memory saves, and automatic knowledge distillation to create a more predictable, visible, and user-controlled development workflow.

---

## 3. SCOPE

### In Scope

**P0 - Critical (Immediate):**
1. Contract Gates System (SPECIFY + ACCEPT gates)
2. Status Dashboard Command (`/spec_kit:status`)

**P1 - High Priority (Near-term):**
3. Four-Rule Deviation System (R1-R4 classification)
4. Wave-Based Task Execution (W1-W4 structure)
5. Amend Command (`/spec_kit:amend`)

**P2 - Medium Priority (Mid-term):**
6. Inline Memory Save Prefixes (`decision:`, `note:`, `todo:`)
7. Memory Distiller Agent (`@distiller`)
8. AGENTS.md Alignment Review

**P3 - Deferred:**
9. Quick Keywords (monitor user feedback)

### Out of Scope
- Quick Mode for small changes - Removed (Gate 1 D) Skip sufficient)
- Setup Wizard - Removed (manual configuration works)
- Codebase Mapping Command - Removed (via research workflow)
- Additional agents (tester, designer, librarian) - Deferred
- Three-tier boundary system - Deferred to later
- Retrospective template - Deferred

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/plan.md` | Modify | Add SPECIFY GATE after Step 6 |
| `.opencode/command/spec_kit/complete.md` | Modify | Add ACCEPT GATE after Step 14 |
| `.opencode/command/spec_kit/status.md` | Create | New status dashboard command |
| `.opencode/command/spec_kit/amend.md` | Create | New scope amendment command |
| `AGENTS.md` | Modify | Add deviation rules (R1-R4), update gate section |
| `.opencode/skill/system-spec-kit/templates/*/tasks.md` | Modify | Add wave structure, deviation log |
| `.opencode/skill/system-spec-kit/templates/*/spec.md` | Modify | Add amendments section |
| `.opencode/skill/system-spec-kit/references/validation/contract-gates.md` | Create | Contract gates reference |
| `.opencode/skill/system-spec-kit/references/validation/deviation-rules.md` | Create | Deviation rules reference |
| `.opencode/skill/system-spec-kit/references/workflows/wave-execution.md` | Create | Wave execution reference |
| `.opencode/skill/system-spec-kit/references/memory/inline-prefixes.md` | Create | Inline save prefixes reference |
| `.opencode/agent/distiller.md` | Create | Memory distiller agent |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/prefix-detector.js` | Create | Inline prefix detection |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/status-collector.js` | Create | Status data aggregation |
| `AGENTS.md` | Review/Modify | Review for alignment with Goodspec patterns; update agent routing, coding lenses, anti-patterns if needed |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SPECIFY GATE in plan.md | User types "confirm" to lock spec; timestamp recorded; scope hash computed |
| REQ-002 | ACCEPT GATE in complete.md | User types "accept" to approve completion; triggers memory archive |
| REQ-003 | Status dashboard displays active spec | `/spec_kit:status` shows spec folder, tasks progress, memory health |
| REQ-004 | Status subcommands work | `tasks`, `memory`, `timeline` views render correctly |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Four-rule deviation classification | Agent classifies R1/R2/R3/R4 before deviating; documents appropriately |
| REQ-006 | Wave structure in tasks.md | W1-W4 sections with status, dependencies, entry/exit criteria |
| REQ-007 | Wave validation script | `check-wave-markers.sh` validates wave progression |
| REQ-008 | Amend command impact analysis | `/spec_kit:amend` calculates scope change %, affected files, risk |
| REQ-009 | Amendment history in spec.md | Amendments table with ID, date, request, impact, approval |

### P2 - Optional (can defer)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Inline prefix detection | `decision:`, `note:`, `todo:` prefixes auto-save to memory |
| REQ-011 | Subtle save confirmation | `💾 Saved decision` displayed without interrupting flow |
| REQ-012 | Distiller agent definition | `@distiller` extracts patterns, decisions, pitfalls from completed specs |
| REQ-013 | Auto-trigger after completion | Distiller runs automatically after ACCEPT GATE passes |
| REQ-014 | AGENTS.md alignment review | Review AGENTS.md for Goodspec pattern adoption; update agent routing table, add memory-first principle, UI patterns if missing; document decision to adopt/skip each pattern |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Contract gates reduce scope creep incidents by 50% (measured by user-reported untracked scope changes)
- **SC-002**: Status dashboard reduces context recovery time by 60% (time from session start to first action)
- **SC-003**: Deviation rules eliminate inconsistent behavior reports by 70%
- **SC-004**: Wave execution improves multi-agent efficiency by 40% (parallel task completion rate)
- **SC-005**: Amend command tracks 80%+ of scope changes (vs informal edits)
- **SC-006**: Inline saves increase memory coverage by 50% (memories per spec folder)
- **SC-007**: Distiller reduces manual `/memory:learn` usage by 60%

---

## 6. RISKS & DEPENDENCIES

### Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| AGENTS.md gate system | Internal | Green | Cannot add contract gates |
| Existing command patterns | Internal | Green | Must follow patterns |
| Memory MCP tools | Internal | Green | Distiller needs memory_save |
| Template system | Internal | Green | Wave/deviation sections |

### Risks

| Risk ID | Risk | Impact | Likelihood | Mitigation |
|---------|------|--------|------------|------------|
| R-001 | Contract gates add friction | Medium | Low | Make confirm/accept simple; allow bypass for trivial |
| R-002 | Wave structure complexity | Medium | Medium | Optional for Level 1; required Level 2+ |
| R-003 | Inline prefix false positives | Low | Medium | Only detect at line start; ignore code blocks |
| R-004 | Distiller extraction quality | Medium | Medium | Start with manual invoke; auto-trigger later |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P01 | Status command response | <2 seconds |
| NFR-P02 | Inline prefix detection | <50ms per message |
| NFR-P03 | Distiller extraction | <60 seconds per spec folder |

### Security

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-S01 | No sensitive data in prefixes | Warn if detected |
| NFR-S02 | Scope hash integrity | SHA-256 for tamper detection |

### Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-R01 | Status fallback | Graceful degradation if data missing |
| NFR-R02 | Amendment rollback | Revert capability for amendments |

---

## 8. EDGE CASES

| Scenario | Expected Behavior |
|----------|-------------------|
| No active spec folder | Status shows "No active spec" with list of recent |
| SPECIFY GATE declined | Return to planning mode; can re-present |
| ACCEPT GATE issues reported | Classify bug vs missed vs new scope |
| Amendment >30% scope change | Suggest new spec folder instead |
| Inline prefix in code block | Ignore (don't auto-save) |
| Distiller finds no patterns | Create minimal entry with facts only |

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Scope | 82 | 8 features across commands, templates, agents, references + AGENTS.md review |
| Risk | 60 | Workflow changes; well-defined patterns to follow |
| Research | 20 | Goodspec analysis complete; implementation paths clear |
| Multi-Agent | 90 | Distiller agent; potential parallel execution |
| Coordination | 75 | Multiple file types; cross-system integration |
| **TOTAL** | 83 | Level 3+ appropriate |

---

## 10. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Pending | - |
| Plan Review | User | Pending | - |
| Implementation Start | User | Pending | - |
| Completion | User | Pending | - |

---

## 11. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| User | Primary | All features | Direct conversation |
| Future Sessions | Consumer | Memory/distiller | Via memory system |

---

## 12. CHANGE LOG

### v1.1 (2026-02-04)
**Added AGENTS.md review scope**
- ADDED: REQ-014 for AGENTS.md alignment review
- ADDED: AGENTS.md to Files to Change
- ADDED: T028 task in plan.md (Wave 3)
- ADDED: Section 8 in recommendations-report.md with review checklist
- UPDATED: Priority count from 8 to 9 improvements

### v1.0 (2026-02-04)
**Initial specification**
- ADDED: 8 improvements from Goodspec analysis
- ADDED: Requirements for P0/P1/P2 priorities
- ADDED: Success criteria with measurable targets

---

## 13. OPEN QUESTIONS

| Question | Status | Resolution |
|----------|--------|------------|
| Wave structure optional for Level 1? | Resolved | Yes, optional |
| Distiller manual-first or auto? | Resolved | Manual first, auto later |
| Inline prefixes case-sensitive? | Resolved | Case-insensitive |

---

## 14. RELATED DOCUMENTS

- [Analysis Report](./analysis-report.md) - Goodspec vs System-Spec-Kit comparison
- [Recommendations Report](./recommendations-report.md) - Detailed implementation specs
- [Research Notes](./research.md) - Initial research findings
- [AGENTS.md Bloat Analysis](./agents-md-bloat-analysis.md) - Redundancy analysis for T028
