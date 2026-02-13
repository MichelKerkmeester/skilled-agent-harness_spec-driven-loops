# Implementation Plan: AGENTS.md Coding Behavior Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | OpenCode development environment |
| **Storage** | Git repository |
| **Testing** | AI coding behavior verification |

### Overview
This plan adds 6 coding-focused invisible lenses to AGENTS.md that improve code analysis, detect anti-patterns, and ensure solution complexity matches problem scope. The approach is additive: add new lens section, integrate with Code Quality Gate, extend Common Failure Patterns with code anti-patterns.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (none)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-009)
- [ ] Manual testing complete (AI behavior verification)
- [ ] Docs updated (spec/plan synced)

---

## 3. ARCHITECTURE

### Pattern
**Document Transformation** - Converting instructional format while preserving functional behavior

### Key Components
- **Invisible Lens System**: New Section 1.1 defining 6 silent processing filters
- **Tone & Style Section**: New Section 1.2 with communication guidance
- **Output Rules Section**: New Section 1.3 with prose-first guidance

### Data Flow
```
User Request → [Silent Lens Processing] → Natural Prose Response
              (CERTAINTY, COHERENCE, EVIDENCE, RIGOR, SCOPE, SIMPLICITY)
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Add Coding Lenses Section
- [ ] Create new Section 1.1 "Coding Analysis Lenses" after Critical Rules
- [ ] Document 6 lenses: CLARITY, SYSTEMS, BIAS, SUSTAINABILITY, VALUE, SCOPE
- [ ] Add "apply silently" instruction - do not announce lens usage
- [ ] Add coding anti-pattern detection table

### Phase 2: Integrate with Existing Sections
- [ ] Enhance Section 5 Request Analysis with BIAS lens triggers
- [ ] Add SYSTEMS lens to "gather context" step (dependency analysis)
- [ ] Enhance "Simplicity First" (lines 429-432) with CLARITY lens triggers
- [ ] Integrate SCOPE lens with scope discipline guidance

### Phase 3: Extend Common Failure Patterns
- [ ] Add Pattern #17: Cargo Culting (BIAS lens detection)
- [ ] Add Pattern #18: Gold-Plating (SCOPE lens detection)
- [ ] Add Pattern #19: Wrong Abstraction (CLARITY lens detection)
- [ ] Add Pattern #20: Premature Optimization (VALUE lens detection)
- [ ] Update trigger phrases and response actions

### Phase 4: Code Quality Gate Integration
- [ ] Add lens validation to Phase 1.5 Code Quality Gate
- [ ] Create lens checklist for code review
- [ ] Sync changes to AGENTS.md
- [ ] Test with sample coding requests

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Document structure | Visual inspection |
| Behavioral | AI response patterns | Claude Code test session |
| Regression | Gate functionality | Verify all gates still trigger correctly |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | - | - | - |

---

## 7. ROLLBACK PLAN

- **Trigger**: AI behavior degrades significantly or gates stop functioning
- **Procedure**: Git revert to pre-change commit

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Foundation) ───► Phase 2 (Transform) ───► Phase 3 (Cleanup) ───► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Foundation | None | Transform, Cleanup |
| Transform | Foundation | Cleanup |
| Cleanup | Transform | Verify |
| Verify | Cleanup | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Foundation | Medium | 30-45 min |
| Transform | High | 60-90 min |
| Cleanup | Medium | 30-45 min |
| Verify | Low | 15-30 min |
| **Total** | | **2-4 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (git commit before changes)
- [ ] Current AGENTS.md saved to scratch/
- [ ] Review complete spec.md

### Rollback Procedure
1. Git revert: `git revert HEAD`
2. Verify AGENTS.md restored
3. Confirm AI behavior normal
4. Document what caused rollback

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Git revert only

---

## L3: DEPENDENCY GRAPH

```
┌─────────────────┐
│ Phase 1:        │
│ Foundation      │
│ (Add sections)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 2:        │
│ Transform       │
│ (Convert FW)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 3:        │
│ Cleanup         │
│ (Remove labels) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Phase 4:        │
│ Verify          │
│ (Test + Sync)   │
└─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Invisible Lens Section | None | Lens definitions | Framework conversion |
| Tone Section | None | Style guidance | Prose cleanup |
| Framework Conversion | Lens Section | Silent processing rules | Label removal |
| Label Removal | Framework Conversion | Clean output format | Verification |
| Verification | All above | Validated changes | None |

---

## L3: CRITICAL PATH

1. **Phase 1: Add Lens System** - CRITICAL
2. **Phase 2: Convert Confidence Thresholds** - CRITICAL (most user-visible)
3. **Phase 3: Remove SKILL ROUTING label** - CRITICAL (every response affected)
4. **Phase 4: Behavior verification** - CRITICAL

**Parallel Opportunities**:
- Tone section and Output rules can be written simultaneously in Phase 1
- Multiple framework conversions can happen in parallel in Phase 2

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Foundation Complete | New sections added | End Phase 1 |
| M2 | Lenses Defined | All 6 lenses documented internally | End Phase 2 |
| M3 | Clean Output | No visible labels in prescribed output | End Phase 3 |
| M4 | Verified | AI behavior confirmed natural | End Phase 4 |

---

## L3: ARCHITECTURE DECISION RECORDS

### ADR-001: Coding-Focused Lens System

**Status**: Proposed

**Context**: AGENTS.md lacks systematic coding analysis filters. Need framework for detecting over-engineering, wrong problems, and solution complexity mismatches.

**Decision**: Create 6 coding-focused lenses (CLARITY, SYSTEMS, BIAS, SUSTAINABILITY, VALUE, SCOPE) as silent processing filters applied during code analysis.

**Consequences**:
- Positive: Better code quality outcomes, systematic anti-pattern detection
- Negative: Additional cognitive load for AI processing
- Mitigation: Lenses are lightweight detection questions, not full frameworks

**Alternatives Rejected**:
- Extend existing Five Checks: Would overload that framework
- Add standalone anti-pattern list: Would lack integration with analysis flow

### ADR-002: Integration vs. Standalone Section

**Status**: Proposed

**Context**: Options for adding lenses: new standalone section vs. integrate into existing sections.

**Decision**: Hybrid - new Section 1.1 for lens definitions + integration touchpoints in Sections 5 and Common Failure Patterns.

**Consequences**:
- Positive: Clear reference + practical integration
- Negative: Some redundancy
- Mitigation: Lens definitions in one place, usage integrated throughout

**Alternatives Rejected**:
- Standalone only: Would not affect actual code analysis flow
- Integration only: Would make lenses hard to find and maintain

### ADR-003: Anti-Pattern Detection Strategy

**Status**: Proposed

**Context**: Need systematic way to detect coding anti-patterns (over-engineering, cargo culting, etc.).

**Decision**: Add anti-pattern detection table with trigger phrases and lens-based responses. Extend Common Failure Patterns table with 4 new coding-specific patterns.

**Consequences**:
- Positive: Systematic detection, clear response actions
- Negative: More patterns to check
- Mitigation: Trigger phrases make detection lightweight

---

## DETAILED IMPLEMENTATION GUIDE

### Phase 1: Add Coding Lenses Section

#### 1.1 New Section After Critical Rules

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

#### 1.2 Coding Anti-Pattern Detection Table

```markdown
### Coding Anti-Patterns (Detect Silently)

| Anti-Pattern | Trigger Phrases | Response |
|--------------|-----------------|----------|
| Over-engineering | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?" |
| Premature optimization | "could be slow", "might bottleneck" | Ask: "Has this been measured? What's the actual performance?" |
| Cargo culting | "best practice", "always should" | Ask: "Does this pattern fit this specific case?" |
| Gold-plating | "while we're here", "might as well" | Flag scope creep. "That's a separate change - shall I note it for later?" |
| Wrong abstraction | "DRY this up" for 2 instances | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep in code | "also add", "bonus feature" | "That's outside the current scope. Want to track it separately?" |
```

### Phase 2: Integration Points

#### 2.1 Enhance Request Analysis (Section 5, Line ~400)

Add to Solution Flow:
```markdown
         Gather Context → [Read files, check skills folder]
                    ↓
+        Apply SYSTEMS Lens → [What does this touch? Dependencies? Side effects?]
+                   ↓
+        Apply BIAS Lens → [Is this the right problem to solve?]
+                   ↓
  Identify Approach → [What's the SIMPLEST solution that works?]
```

#### 2.2 Enhance Simplicity First (Section 5, Lines 429-432)

Add CLARITY triggers:
```markdown
1. **Simplicity First (KISS)** - Apply CLARITY lens
   - Use existing patterns; justify new abstractions
   - Direct solution > clever complexity
   - Every abstraction must earn its existence
+  - **Triggers requiring justification**:
+    - Creating new utility function for <3 use cases
+    - Adding configuration for single-use value
+    - Introducing abstraction layer without clear separation
+    - Using design pattern where simple code suffices
```

### Phase 3: Extend Common Failure Patterns

Add to table at lines 285-303:

```markdown
| 17 | Any | Cargo Culting | "best practice", "you should always" | BIAS lens: Does pattern fit THIS case? |
| 18 | Planning | Gold-Plating | "while we're here", "might as well" | SCOPE lens: Is this in original scope? |
| 19 | Implementation | Wrong Abstraction | "DRY", 2 similar blocks | CLARITY lens: Same concept or just similar code? |
| 20 | Planning | Premature Optimization | "might be slow" | VALUE lens: Has it been measured? |
```

### Phase 4: Code Quality Gate Integration

Add lens validation to Phase 1.5 workflow:
```markdown
### Phase 1.5 - Code Quality Gate (Enhanced)

Before claiming implementation complete:
- [ ] CLARITY: Is this the simplest solution?
- [ ] SYSTEMS: Dependencies analyzed, no unexpected impacts?
- [ ] BIAS: Solving the right problem (not symptom)?
- [ ] SCOPE: Solution complexity matches problem?
- [ ] VALUE: Change has actual behavioral impact?
```
