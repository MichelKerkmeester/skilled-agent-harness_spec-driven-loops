# Specification: AGENTS.md Logic Refinement

Improve the logical flow, terminology consistency, and structural clarity of AGENTS.md.

---

## 1. OBJECTIVE

### Problem Statement
AGENTS.md has evolved organically, resulting in:
- Mixed terminology (Phase vs Gate vs Stage)
- Forward references to undefined sections
- Redundant content across multiple locations
- Unclear PRE/POST execution gate separation

### Success Criteria
- [ ] All gates clearly labeled as PRE or POST execution
- [ ] No Phase/Gate terminology confusion in Section 2
- [ ] All cross-references point to correct sections
- [ ] E0/E1/E2 jargon defined or simplified
- [ ] Document version header added

---

## 2. SCOPE

### In Scope
- TIER 1 fixes: Gate flow restructure, terminology fixes, reference corrections
- TIER 2 fixes: Cross-reference standardization, version header, detail relocation

### Out of Scope
- Major section reordering (TIER 3)
- Merging Sections 6 and 7 (TIER 3)
- Adding Quick Reference Card (TIER 4)

---

## 3. ANALYSIS SUMMARY

### Issues Identified (Sequential Thinking MCP - 10 thoughts)

| Category | Count | Priority |
|----------|-------|----------|
| Structural/Logic | 4 | P0 |
| Terminology | 5 | P1 |
| Line-level Fixes | 7 | P1 |
| Redundancy | 5 | P2 |
| Missing Elements | 6 | P2 |

### Key Findings
1. **Gate System Logic** - Gates 0-3 are PRE-execution, Gates 4-5 are POST-execution, but this isn't visually clear
2. **Phase vs Gate** - Lines 75 and 136 use "Phase" terminology within Gate section
3. **Wrong Reference** - Line 317 says "Section 3" but means "Section 4" (Confidence)
4. **Undefined Jargon** - E0/E1/E2 never explained (lines 324-337)
5. **Forward References** - Section 2 references Section 6/7 before defined

---

## 4. CONSTRAINTS

- Maintain backward compatibility with existing agent behavior
- No section reordering in this iteration (too risky)
- All changes must be testable by reading the document flow
