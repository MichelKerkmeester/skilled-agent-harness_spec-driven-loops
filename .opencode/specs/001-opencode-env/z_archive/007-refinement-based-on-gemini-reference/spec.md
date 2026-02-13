<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: AGENTS.md Coding Behavior Refinement

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.0 -->

---

## EXECUTIVE SUMMARY

Refine AGENTS.md to adopt coding-focused "invisible lenses" from the Gemini reference philosophy, improving how the AI analyzes code, detects anti-patterns, evaluates solutions, and provides implementation guidance. The goal is better code quality outcomes through smarter silent processing filters.

**Key Decisions**: 6 coding-focused lenses, anti-pattern detection, solution evaluation framework

**Critical Dependencies**: None (self-contained document refactoring)

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-04 |
| **Branch** | `007-agents-refinement-gemini` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
AGENTS.md lacks **coding-specific cognitive filters** that would improve code quality outcomes. Current gaps:
- No systematic detection of **over-engineering** or premature optimization
- No framework for evaluating **code solution trade-offs** (performance vs. readability)
- Missing guidance on **dependency/system analysis** before making changes
- No filter for identifying **wrong problem framing** in user requests
- Limited guidance on **matching solution complexity to problem complexity**
- No explicit anti-pattern detection (cargo culting, gold-plating, scope creep in code)

### Purpose
Add **6 coding-focused invisible lenses** to AGENTS.md that silently improve code analysis, detect anti-patterns, evaluate solutions against multiple criteria, and ensure implementations are appropriate to the actual problem scope.

---

## 3. SCOPE

### In Scope
- Add 6 coding-focused invisible lenses to Section 1 or new Section 1.1
- Integrate lenses with existing code quality workflows (Phase 1.5 Code Quality Gate)
- Add anti-pattern detection guidance (over-engineering, cargo culting, gold-plating)
- Add solution evaluation framework (complexity vs. problem scope)
- Enhance "Simplicity First" principle with concrete coding triggers

### Out of Scope
- Skills system restructuring - separate concern
- Agent routing changes - depends on skill system
- Memory system changes - stable infrastructure
- Communication style changes - focus is on coding behaviors

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| AGENTS.md | Modify | Primary target - all 8 sections affected |
| AGENTS.md | Modify | Mirrors AGENTS.md - sync required |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define 6 coding-focused invisible lenses | CLARITY, SYSTEMS, BIAS, SUSTAINABILITY, VALUE, SCOPE lenses documented |
| REQ-002 | Add over-engineering detection | Triggers: unnecessary abstraction, premature optimization, speculative features |
| REQ-003 | Add solution complexity matching | Framework: match solution complexity to problem complexity |
| REQ-004 | Integrate with Code Quality Gate | Lenses applied during Phase 1.5 validation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Add code anti-pattern detection | Cargo culting, gold-plating, scope creep triggers |
| REQ-006 | Add dependency analysis lens | Check feedback loops, coupling, affected areas before changes |
| REQ-007 | Add wrong-problem detection | Identify when user is optimizing wrong thing |
| REQ-008 | Enhance Simplicity First with code triggers | Specific code scenarios that trigger simplicity check |
| REQ-009 | Add trade-off evaluation framework | Performance vs. readability vs. maintainability guidance |

---

## 5. SUCCESS CRITERIA

- **SC-001**: 6 coding-focused invisible lenses documented in AGENTS.md
- **SC-002**: Over-engineering triggers explicitly defined
- **SC-003**: Solution complexity matching framework integrated
- **SC-004**: Code anti-pattern detection guidance added
- **SC-005**: Lenses integrated with existing Code Quality Gate workflow

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Loss of process clarity | Medium | Document lens behaviors thoroughly; internal only |
| Risk | Gate functionality degradation | High | Preserve gate logic, only change output format |
| Risk | Inconsistency with other documents | Medium | Update AGENTS.md in sync |
| Dependency | None | N/A | Self-contained refactoring |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No impact on response generation speed

### Security
- **NFR-S01**: Maintain all safety gates (Four Laws unchanged)

### Reliability
- **NFR-R01**: Preserve all functional behaviors from current AGENTS.md

---

## 8. EDGE CASES

### Data Boundaries
- Empty/minimal requests: Short responses should remain short
- Complex multi-step tasks: Prose reasoning without checkbox scaffolding

### Error Scenarios
- Conflicting lens guidance: Priority order documented
- Gate fails: Behavior unchanged, only output format changes

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 2, LOC: ~400, Systems: 1 |
| Risk | 15/25 | Breaking: N, API: N, Behavioral: Y |
| Research | 15/20 | Completed 4-agent exploration |
| Multi-Agent | 10/15 | 4 worker agents used |
| Coordination | 5/15 | Single document focus |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Loss of gate visibility confuses users | M | L | Keep gates functional, only remove labels from output |
| R-002 | Lens system too abstract | M | M | Document clear mapping from current to new |
| R-003 | Sync drift between AGENTS.md and AGENTS.md | L | M | Update both in same commit |
| R-004 | Over-softening critical safety rules | H | L | Four Laws remain explicit, only reduce secondary emphasis |

---

## 11. USER STORIES

### US-001: Over-Engineering Detection (Priority: P0)

**As a** developer requesting code changes, **I want** the AI to detect when I'm over-engineering, **so that** I get simpler, more appropriate solutions.

**Acceptance Criteria**:
1. Given a request for "add abstraction layer for future flexibility", When AI processes request, Then it flags premature optimization and suggests simpler alternative
2. Given a request with 3 lines of duplicated code, When AI responds, Then it does NOT suggest creating a utility function (YAGNI)

---

### US-002: Wrong Problem Detection (Priority: P0)

**As a** developer describing a bug, **I want** the AI to identify if I'm solving the wrong problem, **so that** I fix root causes not symptoms.

**Acceptance Criteria**:
1. Given a request to "add retry logic", When the real issue is incorrect error handling, Then AI identifies the actual problem first
2. Given a performance complaint, When AI analyzes, Then it asks diagnostic questions before suggesting optimizations

---

### US-003: Solution Complexity Matching (Priority: P1)

**As a** developer, **I want** AI suggestions to match the complexity of my problem, **so that** simple problems get simple solutions.

**Acceptance Criteria**:
1. Given a single-file bug fix, When AI responds, Then solution doesn't introduce new abstractions
2. Given a request for config change, When AI responds, Then it doesn't suggest architectural refactoring

---

### US-004: Dependency Impact Analysis (Priority: P1)

**As a** developer modifying shared code, **I want** the AI to analyze dependency impacts, **so that** I understand what my changes affect.

**Acceptance Criteria**:
1. Given a change to a utility function, When AI plans implementation, Then it identifies all callers
2. Given a change to a module interface, When AI responds, Then it flags breaking change risks

---

## 12. OPEN QUESTIONS

- Q1: Should invisible lenses have documented names internally, or remain truly unnamed?
  - **Proposal**: Document internally for maintainability, instruct AI not to expose
- Q2: How strict on emoji removal - all, or keep functional ones (warning, etc.)?
  - **Proposal**: Remove decorative, keep functional warning indicators

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

## APPENDIX A: CODING-FOCUSED INVISIBLE LENSES

### The Six Coding Lenses (Derived from Gemini Reference)

| Lens | Focus | Coding Application |
|------|-------|-------------------|
| CLARITY | Code simplicity | Cut unnecessary abstractions. Direct solution > clever complexity. Is this the simplest code that works? |
| SYSTEMS | Dependencies | Analyze feedback loops, coupling, affected areas. What does this change touch? What calls this? |
| BIAS | Wrong problem | Is user optimizing the wrong thing? Premature optimization? Solving symptom not cause? |
| SUSTAINABILITY | Maintainability | Is this code maintainable long-term? Will future devs understand it? Technical debt implications? |
| VALUE | Actual impact | Does this change actually matter? Focus on code that changes behavior, not cosmetic refactoring. |
| SCOPE | Complexity match | Does solution complexity match problem complexity? Single-line fix shouldn't need new abstraction. |

**Key Rule**: Apply these lenses silently during code analysis. Do not announce "running BIAS lens" - just apply the thinking.

### Coding Anti-Patterns to Detect

| Anti-Pattern | Trigger Phrases | Detection Question |
|--------------|-----------------|-------------------|
| Over-engineering | "for flexibility", "future-proof", "just in case" | Is this solving a problem that exists now? |
| Premature optimization | "might be slow", "could be bottleneck" | Has performance been measured? |
| Cargo culting | "best practice", "always do this" | Does this pattern apply to this specific case? |
| Gold-plating | "while we're here", "might as well" | Is this in the original scope? |
| Wrong abstraction | "DRY", "reuse" for 2 instances | Are these actually the same concept or just similar code? |
| Scope creep | "also", "additionally", "bonus" | Does this solve the stated problem? |

### Integration with Existing AGENTS.md

| Current Section | Lens Integration |
|-----------------|-----------------|
| Section 1: Critical Rules | Add lenses as silent processing requirement |
| Section 5: Request Analysis | Apply BIAS and SCOPE lenses during analysis |
| Phase 1.5: Code Quality Gate | Apply all 6 lenses as validation criteria |
| Common Failure Patterns | Add lens-based detection for patterns #1, #2, #4 |

---

## APPENDIX B: CURRENT STATE ANALYSIS (Coding Gaps)

### Gap 1: No Systematic Over-Engineering Detection
**Current**: Section 1 mentions "avoid over-engineering" but no triggers or detection framework
**Lines**: 37-38 (generic statement only)
**Missing**: Specific triggers, detection questions, examples

### Gap 2: No Dependency/Systems Analysis Framework
**Current**: No guidance on analyzing code dependencies before changes
**Impact**: Changes may break callers, introduce coupling, miss side effects
**Missing**: SYSTEMS lens equivalent - feedback loops, coupling, affected areas

### Gap 3: No Wrong-Problem Detection
**Current**: Section 5 focuses on "what is requested" but not "is this the right request"
**Lines**: 390-409 (Request Analysis flow)
**Missing**: BIAS lens equivalent - detecting when user is solving wrong problem

### Gap 4: No Solution Complexity Matching
**Current**: "Simplicity First" principle exists but lacks code-specific triggers
**Lines**: 429-432 (generic KISS statement)
**Missing**: SCOPE lens equivalent - match solution complexity to problem size

### Gap 5: Limited Anti-Pattern Detection
**Current**: Common Failure Patterns table (lines 285-303) has 16 patterns
**Missing**: Coding-specific anti-patterns: cargo culting, gold-plating, wrong abstraction
**Opportunity**: Extend patterns table with lens-based detection

### Gap 6: No Value/Impact Assessment
**Current**: No framework for "does this change actually matter?"
**Missing**: VALUE lens equivalent - focus on code that changes behavior
