# Implementation Plan: AGENTS.md Logic Refinement

Step-by-step plan for improving AGENTS.md logical flow and consistency.

---

## 1. APPROACH

### Strategy
Apply TIER 1 (critical) and TIER 2 (quick wins) fixes in a single pass. Each fix is atomic and can be verified independently.

### Phases
1. **Phase 1**: TIER 1 - Critical logic fixes (4 items)
2. **Phase 2**: TIER 2 - Quick wins (3 items)
3. **Phase 3**: Verification against checklist

---

## 2. IMPLEMENTATION STEPS

### TIER 1: Critical Logic Fixes

#### Step 1: Restructure Section 2 Gate Flow
**Location**: Lines 35-97
**Change**: Add clear PRE-EXECUTION and POST-EXECUTION labels

```markdown
### PRE-EXECUTION GATES (pass before ANY tool use)
[Gate 0, 1, 2, 3]
→ EXECUTE TASK

### POST-EXECUTION GATES (pass before claiming done)
[Gate 4, 5]
→ CLAIM COMPLETION
```

#### Step 2: Fix Phase Terminology
**Location**: Line 75, Line 136
**Change**: 
- Line 75: "after Phase 1" → "after user responds to Q1"
- Line 136: "Phase 2:" → "Gate 3 bypass:"

#### Step 3: Fix Section Reference
**Location**: Line 317
**Change**: "(see Section 3)" → "(see §4 Confidence Framework)"

#### Step 4: Define E0/E1/E2
**Location**: Lines 324-337
**Change**: Add inline definitions or simplify to plain English
- E0 = Evidence Level 0 (FACTS) - Verified file paths & code state
- E1 = Evidence Level 1 (LOGIC) - Reasoning chain validity
- E2 = Evidence Level 2 (CONSTRAINTS) - Scope boundaries

### TIER 2: Quick Wins

#### Step 5: Standardize Cross-References
**Locations**: Multiple
**Change**: Convert all to "See §N" format with section name

#### Step 6: Add Version Header
**Location**: After title (line 1)
**Change**: Add version block

#### Step 7: Move generate-context.js Detail
**Location**: Line 23 → Gate 4 (line 83)
**Change**: Remove from Section 1, ensure Gate 4 has full detail

---

## 3. VERIFICATION

- Read document top-to-bottom for flow
- Verify no forward references to undefined terms
- Confirm all gates clearly categorized
- Check all cross-references resolve correctly
