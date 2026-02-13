# Feature Specification: AGENTS.md Gate Refinement

Simplify the gate system in AGENTS.md by converting low-value gates to constitutional memory rules and removing redundancies.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Level**: 2
- **Tags**: agents, gates, constitutional-memory, simplification
- **Priority**: P1
- **Feature Branch**: `004-agents-gate-refinement`
- **Created**: 2025-12-26
- **Status**: In Progress
- **Input**: User request to analyze gates for low value and constitutional memory candidates

### Problem Statement
The current AGENTS.md gate system has:
1. **Excessive gates**: 4 pre-execution + 4 post-execution gates create cognitive overload
2. **Low-value gates**: Gate 1 (Continuation Validation) and Context Health Monitoring provide minimal enforcement value
3. **Triple redundancy**: Some behaviors are defined in gates, Self-Verification checklist, AND Common Failure Patterns
4. **Mandatory overhead**: Gate 3's skill_advisor.py runs on EVERY request, even when not needed
5. **Unreliable signals**: Context Health Monitoring relies on exchange counts AI cannot reliably track

### Purpose
Reduce gate complexity while maintaining actual enforcement where it matters (Gate 4), by converting procedural rules to constitutional memory and removing redundant content.

### Assumptions
- Gate 2 (Understanding + Context), Gate 3 (Skill Routing), and Gate 4 (Spec Folder) are kept as-is per user request
- Constitutional memory rules will be created for converted gate logic
- The existing deprecated constitutional memory file should be updated

---

## 2. SCOPE

### In Scope
- Convert Gate 1 (Continuation Validation) to constitutional memory rule
- Convert post-execution Memory Context Loading to constitutional memory
- Convert Completion Verification Rule to constitutional memory
- Make Gate 3's skill_advisor.py call optional (advisory, not mandatory per request)
- Remove Context Health Monitoring gate entirely
- Remove redundant items from Self-Verification checklist
- Slim down Common Failure Patterns table to unique patterns only

### Out of Scope
- Modifying Gate 2, Gate 3 core logic, or Gate 4 (user requested keeping these)
- Changing the spec folder requirement or documentation levels
- Modifying tool routing or skill system sections

---

## 3. CHANGES SUMMARY

### Gate 1 (Continuation Validation) - CONVERT TO CONSTITUTIONAL
**Current**: Numbered gate with SOFT BLOCK
**Change**: Move to constitutional memory as behavioral rule
**Rationale**: Very narrow trigger ("CONTINUATION - Attempt" pattern), redundant with Gate 2's memory_match_triggers()

### Memory Context Loading - CONVERT TO CONSTITUTIONAL  
**Current**: Post-execution rule
**Change**: Move to constitutional memory
**Rationale**: Simple procedural rule, not a decision gate

### Completion Verification Rule - CONVERT TO CONSTITUTIONAL
**Current**: Post-execution HARD rule
**Change**: Move to constitutional memory
**Rationale**: Already duplicated in Section 3; better as always-on rule

### Gate 3 (Skill Routing) - MAKE OPTIONAL
**Current**: MANDATORY skill_advisor.py call per request
**Change**: Make advisory - agent can recognize skill-appropriate tasks without mandatory script call
**Rationale**: Adds latency on every request; Section 7 already describes skill routing

### Context Health Monitoring - REMOVE
**Current**: PROGRESSIVE gate with tier-based signals
**Change**: Remove entirely
**Rationale**: AI cannot reliably track exchange counts or detect "frustration keywords" - signals are unreliable

### Self-Verification Checklist - CONSOLIDATE
**Current**: 8 checkbox items, many duplicating gates
**Change**: Remove items that duplicate gates; keep unique checks only
**Rationale**: Reduce redundancy, single source of truth

### Common Failure Patterns - SLIM DOWN
**Current**: 23 patterns, many overlapping with gates
**Change**: Remove patterns that are direct duplicates of gates (#3, #4, #15, #16, #19)
**Rationale**: Single source of truth reduces cognitive load

---

## 4. SUCCESS CRITERIA

- [ ] Gate 1 logic moved to constitutional memory rule
- [ ] Post-execution behavioral rules converted to constitutional memory
- [ ] Gate 3 marked as optional/advisory
- [ ] Context Health Monitoring section removed
- [ ] Self-Verification checklist reduced to non-redundant items
- [ ] Common Failure Patterns reduced by ~5 items
- [ ] AGENTS.md line count reduced by ~100-150 lines

---

## 5. DEPENDENCIES & RISKS

### Dependencies
- Constitutional memory file location: `.opencode/skill/system-spec-kit/constitutional/`
- Existing deprecated file: `specs/003-memory-and-spec-kit/z_archive/030-gate3-enforcement/memory/constitutional-gate-rules.md`

### Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing gates reduces enforcement | Medium | Constitutional memory provides always-on enforcement |
| Agent confusion from changed structure | Low | Changes simplify, not complicate |

---

## 6. OPEN QUESTIONS

- None - scope is well-defined based on analysis

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Validation Checklist**: See `checklist.md`
