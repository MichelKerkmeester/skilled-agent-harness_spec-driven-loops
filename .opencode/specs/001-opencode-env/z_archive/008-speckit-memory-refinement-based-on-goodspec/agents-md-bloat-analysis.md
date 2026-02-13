# AGENTS.md Bloat Analysis

> **Date:** 2026-02-04
> **Related Task:** T028 (AGENTS.md Alignment Review)
> **Status:** Analysis Complete - Implementation Deferred

---

## Summary

The current AGENTS.md is **663 lines** vs Goodspec's **~200 lines**. Analysis reveals significant redundancy, duplicate concepts, and verbose formatting that may reduce effectiveness.

**Potential reduction: ~270 lines (41%)**

---

## Bloat Categories

### 1. DUPLICATE CONTENT (Most Critical)

| Location A | Location B | Duplicate Concept |
|------------|------------|-------------------|
| Lines 73-93 "Coding Analysis Lenses" + "Coding Anti-Patterns" | Lines 305-332 "Common Failure Patterns" #17-20 | Over-engineering, Cargo culting, Gold-plating, Premature optimization appear TWICE |
| Lines 36-40 "Quality Principles" (Section 1) | Lines 459-496 "Core Principles" (Section 5) | Simplicity, scope discipline, evidence-based |
| Lines 291-301 "Before X checkpoints" | Lines 512-535 "PRE-CHANGE VALIDATION" | Overlapping validation checklists |

**Impact:** AI receives conflicting signal strength for same rules. Increases token cost by ~15-20%.

---

### 2. VERBOSE ASCII DIAGRAMS (~100 lines)

Lines 103-171 use large ASCII box diagrams for gates that could be 20 lines of bullet points.

---

### 3. COMMON FAILURE PATTERNS TABLE (Lines 307-329)

20 patterns, but patterns 17-20 **explicitly duplicate** the earlier Coding Anti-Patterns table. Line 332 even acknowledges: "Lens-based Detection (Patterns 17-20)".

---

### 4. SKILLS SECTION REDUNDANCY (Lines 581-663)

Same concept explained 3 ways:
1. "How Skills Work" - flow diagram
2. "Skill Loading Protocol" - 5 steps
3. "Skill Routing (Gate 2)" - another explanation

Plus "Primary Skill: workflows-code" section that belongs IN the skill file, not AGENTS.md.

---

### 5. SECTION 5 OVER-ENGINEERING (Lines 418-535)

~112 lines that largely repeat Section 1's "Quality Principles":
- Solution Flow diagram (20 lines)
- Phases 1-3 checklist (14 lines)
- Phase 4 with 5 sub-principles (40 lines)
- Five Checks Framework (13 lines)
- Phases 5-6 validation (25 lines)

---

## Quantified Impact

| Issue | Lines | % of Total |
|-------|-------|------------|
| ASCII diagrams (could be bullets) | ~100 | 15% |
| Duplicate lenses/anti-patterns | ~40 | 6% |
| Redundant skill explanations | ~40 | 6% |
| Section 5 overlap with Section 1 | ~60 | 9% |
| "Primary Skill" section (belongs elsewhere) | ~30 | 5% |
| **Total Potential Reduction** | **~270** | **41%** |

---

## Comparison: Goodspec vs Ours

| Aspect | Goodspec | Ours |
|--------|----------|------|
| Total lines | ~200 | 663 |
| Key rules | 9 bullet points | 20+ patterns + 6 lenses + tables |
| ASCII art | None | ~100 lines |
| Duplicate content | None | 4+ areas |
| Skill details | Links to skill files | Inline explanation |

---

## Recommendations (When Implementing)

### P0 - Remove Duplicates
1. Delete patterns 17-20 from Common Failure Patterns
2. Consolidate "Quality Principles" (§1) and "Core Principles" (§5)
3. Remove duplicate validation checklists

### P1 - Condense Format
4. Replace ASCII boxes with compact bullet lists
5. Merge the 3 skill loading explanations into 1
6. Move "Primary Skill: workflows-code" to workflows-code/SKILL.md

### P2 - Structural Cleanup
7. Flatten Section 5 - keep only unique content
8. Consider separating reference content from behavioral content

---

## Target State

- **From:** 663 lines with duplicates
- **To:** ~400 lines, no duplicates, cleaner structure
- **Method:** Consolidate, don't delete concepts

---

## Decision

**Analysis only for now.** Cleanup will be considered as part of T028 implementation or as a separate spec folder.
