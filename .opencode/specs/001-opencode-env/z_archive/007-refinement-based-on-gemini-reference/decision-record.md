# Decision Record: AGENTS.md Coding Behavior Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: Coding-Focused Lens System

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-04 |
| **Deciders** | Development Team |

---

### Context

AGENTS.md lacks systematic coding analysis filters. Current gaps include no framework for detecting over-engineering, no dependency/impact analysis before changes, and no detection of when users are solving the wrong problem. The Gemini reference demonstrates an "invisible lens" pattern where cognitive filters operate silently to improve output quality.

### Constraints
- Must integrate with existing code quality workflows
- Cannot add significant processing overhead
- Lenses should be practical, not academic

---

### Decision

**Summary**: Implement 6 coding-focused invisible lenses that silently improve code analysis.

**Details**: Create lenses (CLARITY, SYSTEMS, BIAS, SUSTAINABILITY, VALUE, SCOPE) that apply during code analysis. Each lens has specific detection questions relevant to coding decisions. Lenses operate silently - they inform responses without being announced.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **6 Coding Lenses** | Systematic, integrated, practical | Additional complexity | 8/10 |
| Extend Five Checks only | Simpler, less change | Would overload existing framework | 5/10 |
| Standalone checklist | Easy to implement | Not integrated with analysis flow | 4/10 |
| No change | No risk | Gaps remain | 2/10 |

**Why Chosen**: Lens approach provides systematic coverage while remaining practical. Integration with existing sections ensures lenses affect actual behavior.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Clear gaps: no over-engineering detection, no dependency analysis |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives considered with trade-offs |
| 3 | **Sufficient?** | PASS | 6 lenses cover major coding decision areas |
| 4 | **Fits Goal?** | PASS | Directly improves code quality outcomes |
| 5 | **Open Horizons?** | PASS | Lenses can be refined/extended, no lock-in |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Systematic detection of over-engineering and scope creep
- Better dependency analysis before changes
- Detection of wrong-problem scenarios
- Integration with existing Code Quality Gate

**Negative**:
- Additional cognitive load during analysis
- Mitigation: Lenses are lightweight detection questions

---

## ADR-002: Anti-Pattern Detection Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-04 |
| **Deciders** | Development Team |

---

### Context

AGENTS.md has a Common Failure Patterns table (16 patterns) but lacks coding-specific anti-patterns like cargo culting, gold-plating, premature optimization, and wrong abstraction.

### Constraints
- Must integrate with existing patterns table format
- Trigger phrases must be realistic user language
- Responses must be actionable

---

### Decision

**Summary**: Add anti-pattern detection table + extend Common Failure Patterns with 4 coding-specific patterns.

**Details**:
1. New "Coding Anti-Patterns" table in lens section with 6 patterns and trigger phrases
2. Extend Common Failure Patterns (lines 285-303) with patterns 17-20

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dual approach (new table + extend existing)** | Comprehensive, integrated | Some redundancy | 8/10 |
| New table only | Clean separation | Not integrated with enforcement | 5/10 |
| Extend existing only | Consistent | Clutters single table | 6/10 |

**Why Chosen**: Dual approach provides both dedicated reference (new table) and integration with existing enforcement mechanisms (extended patterns).

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Coding anti-patterns not currently covered |
| 2 | **Beyond Local Maxima?** | PASS | 3 approaches evaluated |
| 3 | **Sufficient?** | PASS | 6 anti-patterns cover common coding issues |
| 4 | **Fits Goal?** | PASS | Direct detection of code quality issues |
| 5 | **Open Horizons?** | PASS | Table can be extended with new patterns |

**Checks Summary**: 5/5 PASS

---

## ADR-003: Integration vs. Standalone Section

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-04 |
| **Deciders** | Development Team |

---

### Context

Options for lens placement: standalone new section vs. integration into existing sections vs. hybrid.

### Constraints
- Lenses must be findable for reference
- Lenses must actually affect analysis flow

---

### Decision

**Summary**: Hybrid approach - new Section 1.1 for definitions + integration touchpoints.

**Details**:
- New Section 1.1 "Coding Analysis Lenses" with lens definitions and anti-pattern table
- Integration in Section 5 (Request Analysis flow with SYSTEMS/BIAS steps)
- Integration in Common Failure Patterns (4 new patterns)
- Integration in Phase 1.5 Code Quality Gate

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hybrid (definitions + integration)** | Findable + practical | More changes | 8/10 |
| Standalone section only | Clean, easy to find | Won't affect analysis flow | 4/10 |
| Integration only | Affects behavior | Hard to find lens reference | 5/10 |

**Why Chosen**: Hybrid provides both a clear reference section and practical integration that ensures lenses actually get applied.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Need both definition and integration |
| 2 | **Beyond Local Maxima?** | PASS | 3 placement strategies evaluated |
| 3 | **Sufficient?** | PASS | Covers both reference and usage needs |
| 4 | **Fits Goal?** | PASS | Ensures lenses are applied |
| 5 | **Open Horizons?** | PASS | Can add more integration points |

**Checks Summary**: 5/5 PASS

---

## ADR-004: Silent Processing Approach

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-04 |
| **Deciders** | Development Team |

---

### Context

Following the Gemini reference philosophy: "Do not name these lenses. Do not explain them." The question is whether lenses should be announced in output or applied silently.

### Constraints
- Output should be natural, not procedural
- Debugging/transparency concerns
- Gemini reference is explicit about silent application

---

### Decision

**Summary**: Lenses apply silently; only results surface in natural language.

**Details**:
- Add explicit "Apply silently" instruction
- Lenses inform responses but are never announced
- Anti-pattern concerns are raised naturally, not as "BIAS lens triggered"

**Example**:
- BAD: "Applying CLARITY lens: This abstraction may be unnecessary."
- GOOD: "This might be simpler without the extra layer. Are there multiple use cases for this abstraction?"

---

### Consequences

**Positive**:
- Natural, conversational responses
- Users get better advice without procedural noise
- Aligns with Gemini reference philosophy

**Negative**:
- Harder to verify lenses are being applied
- Mitigation: Test cases can verify lens-informed responses

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gemini reference is explicit about silent application |
| 2 | **Beyond Local Maxima?** | PASS | Explicit vs. silent both considered |
| 3 | **Sufficient?** | PASS | Clear instruction covers the requirement |
| 4 | **Fits Goal?** | PASS | Natural code advice is the goal |
| 5 | **Open Horizons?** | PASS | Could add debug mode later if needed |

**Checks Summary**: 5/5 PASS
