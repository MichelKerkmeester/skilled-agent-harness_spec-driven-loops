---
title: Level Decision Matrix
description: Quick reference for selecting the appropriate documentation level using progressive enhancement.
---

# Level Decision Matrix - Complexity Scoring Guide

Quick reference for selecting documentation levels (1-3) based on LOC guidance and complexity factors.

---

## 1. 📖 OVERVIEW

### Purpose

This matrix helps determine the appropriate documentation level for any task. Use it when:
- Starting a new spec folder and need to choose Level 1, 2, or 3
- Scope changes mid-implementation and level escalation may be needed
- Uncertain whether complexity/risk factors should override LOC guidance

### Usage

1. Check LOC estimate against thresholds (<100, 100-499, ≥500)
2. Evaluate secondary factors (complexity, risk, dependencies, testing needs)
3. If factors suggest higher level than LOC indicates, escalate
4. When in doubt, choose the higher level

---

## 2. 📊 DECISION MATRIX TABLE (Progressive Enhancement)

| Level               | LOC Guidance | Required Files                                                      | Adds To Previous        | Use When                             |
| ------------------- | ------------ | ------------------------------------------------------------------- | ----------------------- | ------------------------------------ |
| **1: Baseline**     | <100         | `spec.md` + `plan.md` + `tasks.md` + `implementation-summary.md`    | (foundation)            | All features - minimum documentation |
| **2: Verification** | 100-499      | Level 1 + `checklist.md`                                            | QA checklist            | Needs systematic validation          |
| **3: Full**         | ≥500         | Level 2 + `decision-record.md`                                      | ADR + optional research | Complex/architectural changes        |

**Progressive Enhancement Model:**
```
Level 1 (Baseline):     spec.md + plan.md + tasks.md + implementation-summary.md
                              ↓
Level 2 (Verification): Level 1 + checklist.md
                              ↓
Level 3 (Full):         Level 2 + decision-record.md + optional research.md
```

---

## 3. 🎯 LOC AS SOFT GUIDANCE (Not Enforcement)

**How to count:**
- Count all files being modified
- Include new files being created
- Estimate conservatively (round up when uncertain)

**LOC thresholds suggest (not enforce):**
- **<100 LOC** → Suggests Level 1 (Baseline)
- **100-499 LOC** → Suggests Level 2 (Verification)
- **≥500 LOC** → Suggests Level 3 (Full)

**Key distinction:**
- LOC thresholds are **SOFT GUIDANCE** - use judgment
- **Enforcement is MANUAL** - verify required templates exist before claiming completion
- Risk/complexity can override LOC (e.g., 50 LOC security change = Level 2+)

**Note:** Single typo/whitespace fixes (<5 characters in one file) are exempt from spec requirements.

---

## 4. ⚖️ SECONDARY FACTORS (CAN OVERRIDE LOC)

These factors can push you to a higher level even if LOC suggests lower:

### 1. Complexity
- **Simple refactor** (no new logic) → May stay at lower level
- **Architectural change** (new patterns) → Escalate to higher level
- **Example**: 200 LOC refactor might stay Level 2, but 200 LOC architectural change could be Level 3

### 2. Risk
- **Config cascades** → Higher level (documentation protects against mistakes)
- **Authentication/security changes** → Higher level (security implications)
- **Example**: 50 LOC config change affecting multiple systems → Level 2 (risk trumps LOC)

### 3. Dependencies
- **Single component** → Lower level acceptable
- **Multiple systems affected** → Higher level needed
- **Example**: 80 LOC touching 5 different modules → Level 2 (coordination needed)

### 4. Testing Needs
- **Unit tests only** → Lower level acceptable
- **Integration/E2E tests required** → Higher level needed
- **Example**: 95 LOC requiring complex integration testing → Level 2 (testing strategy needed)

---

## 5. ⚠️ EDGE CASE GUIDANCE

| Scenario                | LOC | Suggested Level | Required Files                  | Rationale                                |
| ----------------------- | --- | --------------- | ------------------------------- | ---------------------------------------- |
| Typo in one file        | 1   | Exempt          | None                            | Truly trivial (<5 chars, single file)    |
| Typo across 5 files     | 5   | Level 1         | spec + plan + tasks             | Multi-file coordination                  |
| 95 LOC feature          | 95  | Level 1         | spec + plan + tasks             | Under threshold, baseline docs           |
| 105 LOC feature         | 105 | Level 2         | L1 + checklist                  | Just over, needs QA validation           |
| Refactor (no new logic) | 200 | Level 2         | L1 + checklist                  | Complexity needs verification            |
| Config cascade          | 50  | Level 2         | L1 + checklist                  | Risk trumps LOC - needs validation       |
| Authentication change   | 80  | Level 2         | L1 + checklist                  | Security implications require QA         |
| System redesign         | 300 | Level 3         | L2 + decision-record            | Architectural decisions must be recorded |
| Multi-team project      | 400 | Level 3         | L2 + decision-record + research | Coordination needs full documentation    |

---

## 6. 🤔 WHEN IN DOUBT

**Choose the higher level.**

**Reasoning:**
- Better to over-document than under-document
- Higher level provides more structure and guidance
- Easier to skip optional sections than add missing documentation later
- Future you will thank present you for the extra context

### Template Style Selection

In addition to level, choose the appropriate template **style**:

| Style | Best For | Path |
|-------|----------|------|
| **Core** (default) | Experienced users, clear requirements | `templates/level_N/` |
| **Verbose** | New users, complex/uncertain requirements | `templates/verbose/core/` |

**Choose Verbose templates when:**
- First time using SpecKit
- Requirements have many unknowns
- Training team members
- Need guidance on expected content quality

---

## 7. 📋 CHECKLIST QUALITY REQUIREMENTS

Level 2+ documentation requires `checklist.md` with specific quality standards:

### Priority Organization (P0/P1/P2)

All checklist items MUST be tagged with priority markers:

| Priority | Meaning       | Action Required                                   |
| -------- | ------------- | ------------------------------------------------- |
| **P0**   | HARD BLOCKER  | Must complete before ANY other work               |
| **P1**   | Must complete | Required for completion OR user-approved deferral |
| **P2**   | Can defer     | Nice-to-have, can defer without approval          |

**Format Example:**
```markdown
## Implementation Checklist

### P0 - Blockers
- [ ] Fix breaking test before proceeding
- [ ] Resolve merge conflict in main.js

### P1 - Required
- [ ] Implement core validation logic
- [ ] Add unit tests for new functions
- [ ] Update documentation

### P2 - Enhancements
- [ ] Add performance optimization
- [ ] Refactor legacy helper functions
```

### Evidence Citation Requirements

Completed checklist items MUST include verification evidence:

**Format:** `[x] Item description - [evidence type: details]`

**Evidence Types:**
- `[verified: grep output]` - Text search confirmation
- `[verified: test pass]` - Test suite confirmation
- `[verified: browser check]` - Manual browser verification
- `[verified: file exists]` - File presence confirmation
- `[verified: review]` - Code review confirmation

**Examples:**
```markdown
- [x] Remove deprecated function - [verified: grep shows 0 matches for 'oldFunction']
- [x] All tests pass - [verified: test pass - 47/47 tests green]
- [x] Modal displays correctly - [verified: browser check - Chrome/Firefox/Safari]
- [x] Config file created - [verified: file exists at config/settings.json]
```

**Validation:** Completion claims are BLOCKED without evidence citations on P0/P1 items.

---

## 8. ✅ VALIDATION RULES REFERENCE

The spec validation system (`validate-spec.sh`) checks documentation quality using these rules:

### Rules by Applicability

| Rule                    | Level 1 | Level 2 | Level 3 | Severity | Description                                    |
| ----------------------- | ------- | ------- | ------- | -------- | ---------------------------------------------- |
| **FILE_EXISTS**         | ✓       | ✓       | ✓       | error    | Required files must exist for the level        |
| **PLACEHOLDER_FILLED**  | ✓       | ✓       | ✓       | warning  | Template placeholders must be replaced         |
| **ANCHORS_VALID**       | ✓       | ✓       | ✓       | warning  | Memory files must have balanced anchor pairs   |
| **CHECKLIST_HAS_ITEMS** | —       | ✓       | ✓       | warning  | checklist.md must contain actionable items     |
| **DECISION_RECORDED**   | —       | —       | ✓       | warning  | decision-record.md must document key decisions |

### Rule Details

**FILE_EXISTS**
- Purpose: Ensures all required files for the documentation level are present
- Applies to: All levels (checks level-specific required files)
- Severity: error (blocks completion)
- Details: Level 1 requires `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`; Level 2 adds `checklist.md`; Level 3 adds `decision-record.md`

**PLACEHOLDER_FILLED**
- Purpose: Detects unfilled template placeholders that indicate incomplete documentation
- Applies to: All levels
- Severity: warning (default)
- Details: Searches for patterns like `[PROJECT_NAME]`, `[DESCRIPTION]`, `{{placeholder}}`, etc.

**ANCHORS_VALID**
- Purpose: Validates that memory files have balanced ANCHOR_START/ANCHOR_END pairs
- Applies to: All levels with `memory/` folders
- Severity: warning (default)
- Details: Each `<!-- ANCHOR_START: id -->` must have matching `<!-- ANCHOR_END: id -->`. Unbalanced anchors break semantic memory indexing.

**CHECKLIST_HAS_ITEMS**
- Purpose: Ensures checklist.md contains actual checklist items, not just template structure
- Applies to: Level 2+ only
- Severity: warning (default)
- Details: Looks for `- [ ]` or `- [x]` patterns indicating actionable items

**DECISION_RECORDED**
- Purpose: Verifies that architectural decisions are documented with rationale
- Applies to: Level 3 only
- Severity: warning (default)
- Details: Checks decision-record.md for decision entries with status and rationale

### Severity Levels

| Severity    | Meaning                                    | Action Required            |
| ----------- | ------------------------------------------ | -------------------------- |
| **error**   | Validation fails, blocks completion claims | Must fix before proceeding |
| **warning** | Issue detected, should address             | Address or acknowledge     |
| **info**    | Informational, no action required          | Optional improvement       |

---

## 9. 🔄 LEVEL MIGRATION DURING IMPLEMENTATION

If scope grows during implementation, escalate by adding the required files:

| From Level | To Level                   | Action                                          | Files to Add |
| ---------- | -------------------------- | ----------------------------------------------- | ------------ |
| 1 → 2      | Add verification           | `checklist.md`                                  |
| 2 → 3      | Add decision documentation | `decision-record.md` (+ optional `research.md`) |

**Changelog example:**
```markdown
## Change Log
- 2025-11-15: Created as Level 1 (simple bug fix) - spec.md, plan.md, tasks.md
- 2025-11-16: Escalated to Level 2 (discovered validation needs) - added checklist.md
- 2025-11-17: Escalated to Level 3 (architectural decision required) - added decision-record.md
```

**Note:** Going down levels is rare (keep higher-level docs even if not all used).

---

## 10. 🚀 QUICK DECISION FLOWCHART

```
Any file modification?
    ↓
Single typo? ──YES──→ Exempt (no spec needed)
(<5 chars, 1 file)
    │
    NO
    ↓
Start with Level 1 (Baseline)
Required: spec.md + plan.md + tasks.md
    ↓
Needs QA validation? ──YES──→ Level 2 (add checklist.md)
(risk, multi-file, testing)
    │
    NO (stay Level 1)
    ↓
Architectural decision? ──YES──→ Level 3 (add decision-record.md)
(complex, arch impact)
    │
    NO (stay current level)
```

**LOC as soft guidance (suggests level):**
- <100 LOC → Suggests Level 1
- 100-499 LOC → Suggests Level 2
- ≥500 LOC → Suggests Level 3

**Override factors (can bump level):**
- High complexity? → Consider higher level
- High risk? → Consider higher level
- Multiple dependencies? → Consider higher level
- Complex testing needs? → Consider higher level

**Final check:** If confidence < 80% on level choice → Ask user or choose higher level.

---

## 11. 🔗 RELATED RESOURCES

### Asset Files
- [parallel_dispatch_config.md](./parallel_dispatch_config.md) - Complexity scoring and agent dispatch
- [template_mapping.md](./template_mapping.md) - Template routing and task mapping

### Reference Files
- [level_specifications.md](../references/templates/level_specifications.md) - Complete Level 1-3 requirements
- [quick_reference.md](../references/workflows/quick_reference.md) - Commands, checklists, and troubleshooting
- [template_guide.md](../references/template_guide.md) - Template selection and quality standards

### Scripts
- [compose.sh](../scripts/templates/compose.sh) - Template composition from core + addendum

### Templates
- [verbose/README.md](../templates/verbose/README.md) - Verbose template usage guide

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
- `workflows-code` - Implementation, debugging, and verification lifecycle