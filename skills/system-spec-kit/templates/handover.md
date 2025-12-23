# Session Handover Document
<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.0 -->

## 1. Handover Summary

| Field | Value |
|-------|-------|
| **From Session** | [SESSION_ID or DATE] |
| **To Session** | [NEXT_SESSION] |
| **Phase Completed** | [RESEARCH / PLANNING / IMPLEMENTATION] |
| **Handover Time** | [TIMESTAMP] |

---

## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision | Rationale | Impact |
|----------|-----------|--------|
| [DECISION_1] | [WHY] | [FILES/AREAS AFFECTED] |
| [DECISION_2] | [WHY] | [FILES/AREAS AFFECTED] |

### 2.2 Blockers Encountered
| Blocker | Status | Resolution/Workaround |
|---------|--------|----------------------|
| [BLOCKER_1] | [RESOLVED/OPEN] | [HOW IT WAS HANDLED] |

### 2.3 Files Modified
| File | Change Summary | Status |
|------|---------------|--------|
| [FILE_PATH] | [WHAT CHANGED] | [COMPLETE/IN_PROGRESS] |

---

## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** [FILE:LINE_NUMBER]
- **Context:** [WHAT TO FOCUS ON FIRST]

### 3.2 Priority Tasks Remaining
1. [HIGHEST_PRIORITY_TASK]
2. [SECOND_PRIORITY_TASK]
3. [THIRD_PRIORITY_TASK]

### 3.3 Critical Context to Load
- [ ] Memory file: `memory/[FILENAME].md`
- [ ] Spec file: `spec.md` (sections [X, Y, Z])
- [ ] Plan file: `plan.md` (phase [N])

---

## 4. Validation Checklist

Before handover, verify:
- [ ] All in-progress work committed or stashed
- [ ] Memory file saved with current context
- [ ] No breaking changes left mid-implementation
- [ ] Tests passing (if applicable)
- [ ] This handover document is complete

---

## 5. Session Notes

[FREE-FORM NOTES FOR NEXT SESSION]
