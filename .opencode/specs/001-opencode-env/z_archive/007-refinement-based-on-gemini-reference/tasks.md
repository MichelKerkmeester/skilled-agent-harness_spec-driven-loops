# Task Breakdown: AGENTS.md Coding Behavior Refinement

<!-- SPECKIT_LEVEL: 3 -->

---

## Task Summary

| Phase | Task Count | P0 | P1 | P2 |
|-------|------------|----|----|----|
| Phase 1: Add Coding Lenses | 3 | 2 | 1 | 0 |
| Phase 2: Integration | 4 | 1 | 3 | 0 |
| Phase 3: Extend Patterns | 2 | 1 | 1 | 0 |
| Phase 4: Quality Gate | 3 | 1 | 2 | 0 |
| **Total** | **12** | **5** | **7** | **0** |

---

## Phase 1: Add Coding Lenses Section

### T-001: Create Coding Analysis Lenses Section [P0]

**Description**: Add new Section 1.1 after Critical Rules defining the 6 coding-focused lenses.

**Content to Add** (after line ~72, before Section 2):

```markdown
### Coding Analysis Lenses (Silent Processing)

Apply these lenses silently when analyzing code requests. Do not announce lens usage.

| Lens | Focus | Detection Questions |
|------|-------|---------------------|
| CLARITY | Simplicity | Is this the simplest code that solves the problem? Are abstractions earned? |
| SYSTEMS | Dependencies | What does this change touch? What calls this? What are the side effects? |
| BIAS | Wrong problem | Is user solving a symptom? Is this premature optimization? Is the framing correct? |
| SUSTAINABILITY | Maintainability | Will future devs understand this? Is it self-documenting? Tech debt implications? |
| VALUE | Actual impact | Does this change behavior or just refactor? Is it cosmetic or functional? |
| SCOPE | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction? |
```

**Acceptance Criteria**:
- [ ] Section placed after Critical Rules, before Mandatory Gates
- [ ] All 6 lenses defined with coding focus
- [ ] "Apply silently" instruction included
- [ ] Detection questions are actionable

**Files**: AGENTS.md (line ~72)
**Est. Effort**: 15 min

---

### T-002: Add Coding Anti-Pattern Detection Table [P0]

**Description**: Add table of coding anti-patterns with trigger phrases and responses.

**Content to Add** (after lens table):

```markdown
### Coding Anti-Patterns (Detect Silently)

| Anti-Pattern | Trigger Phrases | Response |
|--------------|-----------------|----------|
| Over-engineering | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?" |
| Premature optimization | "could be slow", "might bottleneck" | Ask: "Has this been measured? What's the actual performance?" |
| Cargo culting | "best practice", "always should" | Ask: "Does this pattern fit this specific case?" |
| Gold-plating | "while we're here", "might as well" | Flag scope creep. "That's a separate change - shall I note it for later?" |
| Wrong abstraction | "DRY this up" for 2 instances | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep | "also add", "bonus feature" | "That's outside the current scope. Want to track it separately?" |
```

**Acceptance Criteria**:
- [ ] 6 anti-patterns defined
- [ ] Trigger phrases are realistic user language
- [ ] Responses are actionable questions/statements

**Files**: AGENTS.md (after lens table)
**Est. Effort**: 10 min

---

### T-003: Add "Apply Silently" Rule [P1]

**Description**: Add explicit instruction that lenses are internal processing, never announced.

**Content**: "Apply these lenses during code analysis. Do not say 'applying CLARITY lens' or similar. The thinking happens silently; only results surface in responses."

**Acceptance Criteria**:
- [ ] Clear instruction about silent processing
- [ ] Example of what NOT to do
- [ ] Positioned prominently in section

**Files**: AGENTS.md
**Est. Effort**: 5 min

---

## Phase 2: Integration with Existing Sections

### T-004: Integrate SYSTEMS Lens into Request Analysis [P0]

**Description**: Add dependency analysis step to Section 5 Solution Flow (lines 394-409).

**Current Flow**:
```
Gather Context → [Read files, check skills folder]
         ↓
Identify Approach → [What's the SIMPLEST solution that works?]
```

**New Flow**:
```
Gather Context → [Read files, check skills folder]
         ↓
Apply SYSTEMS Lens → [What does this touch? Dependencies? Side effects?]
         ↓
Apply BIAS Lens → [Is this the right problem to solve?]
         ↓
Identify Approach → [What's the SIMPLEST solution that works?]
```

**Acceptance Criteria**:
- [ ] Flow diagram updated with lens steps
- [ ] SYSTEMS and BIAS lenses integrated at correct points
- [ ] Questions are code-focused

**Files**: AGENTS.md (lines 394-409)
**Est. Effort**: 15 min

---

### T-005: Enhance Simplicity First with CLARITY Triggers [P1]

**Description**: Add specific triggers to "Simplicity First" principle (lines 429-432).

**Current**:
```markdown
1. **Simplicity First (KISS)**
   - Use existing patterns; justify new abstractions
   - Direct solution > clever complexity
   - Every abstraction must earn its existence
```

**Add**:
```markdown
   **CLARITY Triggers** (require justification):
   - Creating utility function for <3 use cases
   - Adding configuration for single-use value
   - Introducing abstraction layer without clear boundary
   - Using design pattern where simple code suffices
   - Adding interface for single implementation
```

**Acceptance Criteria**:
- [ ] 5+ specific triggers defined
- [ ] Each trigger is a real coding scenario
- [ ] Triggers map to CLARITY lens detection questions

**Files**: AGENTS.md (lines 429-432)
**Est. Effort**: 10 min

---

### T-006: Add SCOPE Lens to Scope Discipline [P1]

**Description**: Enhance existing scope guidance with SCOPE lens integration.

**Location**: Section 5, after Simplicity First

**Content to Add**:
```markdown
**SCOPE Lens Check**: Does solution complexity match problem complexity?
- Single-line bug → Single-line fix (not refactoring opportunity)
- Config change → Config change (not architectural discussion)
- 3-file feature → 3-file solution (not framework introduction)
```

**Acceptance Criteria**:
- [ ] SCOPE lens connected to existing scope discipline
- [ ] Concrete examples of complexity matching
- [ ] Clear guidance on avoiding scope creep

**Files**: AGENTS.md
**Est. Effort**: 10 min

---

### T-007: Add BIAS Lens to Wrong-Problem Detection [P1]

**Description**: Add guidance for detecting when user is solving wrong problem.

**Location**: Section 5, Request Analysis

**Content to Add**:
```markdown
**BIAS Lens - Wrong Problem Detection**:
Before accepting user's problem framing, verify:
- Is this a symptom or root cause?
- Has the actual issue been measured/reproduced?
- Is this premature optimization without evidence?
- Is user adding complexity to avoid simpler change?

If framing seems wrong, reframe rather than argue:
"Before we add retry logic, let me check if the error handling upstream might be the actual issue."
```

**Acceptance Criteria**:
- [ ] Detection questions are practical
- [ ] Example of reframing provided
- [ ] Connected to BIAS lens

**Files**: AGENTS.md
**Est. Effort**: 10 min

---

## Phase 3: Extend Common Failure Patterns

### T-008: Add 4 Coding Anti-Patterns to Failure Table [P0]

**Description**: Extend Common Failure Patterns table (lines 285-303) with coding-specific patterns.

**Add to table**:

| # | Stage | Pattern | Trigger Phrase | Response Action |
|---|-------|---------|----------------|-----------------|
| 17 | Any | Cargo Culting | "best practice", "always should" | BIAS lens: Does pattern fit THIS case? |
| 18 | Planning | Gold-Plating | "while we're here", "might as well" | SCOPE lens: Is this in original scope? |
| 19 | Implementation | Wrong Abstraction | "DRY", 2 similar blocks | CLARITY lens: Same concept or just similar code? |
| 20 | Planning | Premature Optimization | "might be slow", "could bottleneck" | VALUE lens: Has it been measured? |

**Acceptance Criteria**:
- [ ] 4 patterns added to existing table
- [ ] Patterns use consistent format
- [ ] Lens references included

**Files**: AGENTS.md (lines 285-303)
**Est. Effort**: 10 min

---

### T-009: Update Pattern Enforcement Note [P1]

**Description**: Update the enforcement note to include lens-based detection.

**Current** (line 304):
```
**Enforcement:** STOP → Acknowledge ("I was about to [pattern]") → Correct → Verify
```

**Add**:
```
**Lens-based Detection:** For patterns 17-20, apply relevant lens silently. If triggered, surface the concern naturally without referencing the pattern number or lens name.
```

**Acceptance Criteria**:
- [ ] Note updated for new patterns
- [ ] Silent processing emphasized
- [ ] Connected to lens system

**Files**: AGENTS.md (line ~304)
**Est. Effort**: 5 min

---

## Phase 4: Code Quality Gate Integration

### T-010: Add Lens Validation to Phase 1.5 [P0]

**Description**: Integrate lenses into the Code Quality Gate workflow.

**Location**: workflows-code skill or AGENTS.md Phase 1.5 reference

**Content to Add**:
```markdown
### Phase 1.5 - Code Quality Gate (Lens Validation)

Before claiming implementation complete, verify:
- [ ] **CLARITY**: Is this the simplest solution that works?
- [ ] **SYSTEMS**: Dependencies analyzed, no unexpected side effects?
- [ ] **BIAS**: Solving the stated problem (not a different one)?
- [ ] **SCOPE**: Solution complexity matches problem scope?
- [ ] **VALUE**: Change has actual behavioral impact (not just cosmetic)?
```

**Acceptance Criteria**:
- [ ] 5 lens checkpoints defined
- [ ] Integrated with existing quality gate
- [ ] Questions are verification-focused

**Files**: AGENTS.md or workflows-code skill
**Est. Effort**: 15 min

---

### T-011: Sync Changes to AGENTS.md [P1]

**Description**: Apply all AGENTS.md changes to AGENTS.md for consistency.

**Acceptance Criteria**:
- [ ] All new sections present in AGENTS.md
- [ ] Line numbers may differ but content matches
- [ ] No drift between files

**Files**: AGENTS.md
**Est. Effort**: 10 min

---

### T-012: Test with Sample Coding Requests [P1]

**Description**: Verify lens behavior with test prompts.

**Test Cases**:
1. "Add a utility function for this code" (2 uses) → Should trigger CLARITY lens
2. "This might be slow, let's optimize" → Should trigger BIAS/VALUE lens
3. "Best practice is to use X" → Should trigger BIAS lens
4. "While we're fixing this, let's also..." → Should trigger SCOPE lens

**Acceptance Criteria**:
- [ ] All 4 test cases produce expected lens-informed responses
- [ ] Responses are natural (no lens announcements)
- [ ] Anti-patterns are caught

**Files**: Test session
**Est. Effort**: 15 min

---

## Dependency Graph

```
T-001 (Lenses) ─────┬──► T-004 (SYSTEMS) ──┐
                    │                       │
T-002 (Anti-patterns)──► T-005 (CLARITY) ──┼──► T-008 (Patterns) ──► T-010 (Quality Gate)
                    │                       │                               │
T-003 (Silent rule) ┴──► T-006 (SCOPE) ────┤                               ▼
                         T-007 (BIAS) ─────┘                         T-011 (Sync)
                                                                           │
                                                                           ▼
                                                                     T-012 (Test)
```

---

## Critical Path

**Minimum viable implementation**:
1. T-001: Coding Analysis Lenses Section
2. T-002: Anti-Pattern Detection Table
3. T-004: SYSTEMS Lens in Request Analysis
4. T-008: Extend Common Failure Patterns
5. T-010: Code Quality Gate Integration
6. T-011: Sync AGENTS.md

**Total Critical Path**: 6 tasks, ~75 min
