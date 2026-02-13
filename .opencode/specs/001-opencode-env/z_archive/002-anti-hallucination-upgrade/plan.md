# Implementation Plan

## HIGH PRIORITY (Direct anti-hallucination value)

### 1. Contradiction Detection Pattern
**Location:** Section 2, Common Failure Patterns table (row #17)
**Change:** Add new row
```
| 17 | Any | Internal Contradiction | Conflicting requirements | HALT → State conflict → Request resolution |
```

### 2. Logic Chain Validation
**Location:** Section 5, Phases 5-6 PRE-CHANGE VALIDATION checklist
**Change:** Add new item
```
□ Logic chain sound? (facts cited → reasoning valid → conclusion follows)
```

### 3. Drift Check
**Location:** Section 2, Self-Verification checklist
**Change:** Add new item
```
□ Aligned with ORIGINAL request? (check for scope drift from Turn 1)
```

## MEDIUM PRIORITY (Useful enhancements)

### 4. Intent Classification
**Location:** Section 2, Gate 1 action steps
**Change:** Add step 2
```
2. CLASSIFY INTENT: [Research | Implementation | Debug | Clarify | Review]
```

### 5. Anti-Sycophancy Rule
**Location:** Section 1, Quality Principles
**Change:** Add new bullet
```
**Truth over agreement** - correct misconceptions with evidence; do not agree for flow
```

## Implementation Order
1. #1 Contradiction Detection (highest anti-hallucination value)
2. #3 Drift Check (prevents scope creep)
3. #2 Logic Chain Validation (strengthens reasoning)
4. #5 Anti-Sycophancy (behavioral guidance)
5. #4 Intent Classification (process enhancement)
