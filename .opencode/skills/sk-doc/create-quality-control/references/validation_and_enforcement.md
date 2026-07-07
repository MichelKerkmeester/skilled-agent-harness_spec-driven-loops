---
title: Validation and Enforcement Operations - Mode 1
description: Validation touchpoints, enforcement approval-prompt templates, phase chaining, and troubleshooting for document-quality runs.
trigger_phrases:
  - "validation integration workflow"
  - "enforcement approval prompts"
  - "phase interactions doc quality"
  - "doc quality troubleshooting"
importance_tier: normal
contextType: implementation
version: 1.8.0.1
---

# Validation and Enforcement Operations

How a create-quality-control run validates and enforces standards: the validation touchpoints, the enforcement approval prompts, how phases chain, and what to do when a run breaks. `SKILL.md` §2-§4 owns the executable steps; this file is the overflow detail — the manual validation sequence, the approval-prompt wording, the phase-chaining logic, and troubleshooting.

For execution modes see [workflows.md](./workflows.md). For worked command recipes see [workflow_examples.md](./workflow_examples.md).

---

## 1. OVERVIEW

This file covers how a create-quality-control run validates and enforces standards: the validation touchpoints, the enforcement approval-prompt wording, how the phases chain together, and what to check when a run breaks.

---

## 2. VALIDATION INTEGRATION

> **Note**: These validation patterns are conceptual workflows describing when and how validation should occur. They are not implemented as automated hooks - apply these checks manually using the available scripts.

**Pre-Delivery Format Validation** (MANDATORY for READMEs):
- **When**: Before claiming completion on any README
- **Script**: `python ../shared/scripts/validate_document.py <file>`
- **Action**: Check H2 format and required sections
- **Blocking**: Yes - exit code 1 blocks delivery
- **Auto-fix**: Use `--fix` for safe issues

**Post-Write Validation Pattern** (manual):
- **When**: After Write/Edit operations on `.md` files
- **Script**: `python ../shared/scripts/quick_validate.py <path>`
- **Action**: Filename corrections (ALL CAPS → lowercase, hyphens → underscores)
- **Blocking**: No (logs only)

**Pre-Submit Quality Pattern** (manual):
- **When**: Before finalizing documentation
- **Script**: `python ../shared/scripts/extract_structure.py <file>`
- **Action**: Structure validation + AI-assisted quality assessment
- **Blocking**: Recommend blocking on critical violations

**Manual Validation Workflow**:
```
User saves file
    ↓
Run: python ../shared/scripts/validate_document.py <file>  ← NEW: Format validation
    ├─ Exit 0 → Continue
    └─ Exit 1 → Fix blocking errors → Re-run
    ↓
Run: python ../shared/scripts/quick_validate.py <path>
    ↓
Review output, fix issues
    ↓
Run: python ../shared/scripts/extract_structure.py <file>
    ├─ Safe violations → Fix manually → Re-run
    └─ Critical violations → Address before proceeding
```

---

## 3. ENFORCEMENT WORKFLOWS

> **Note**: These are manual workflow patterns for the AI agent to follow when violations are detected. They are not automated scripts. `SKILL.md` §4 lists the fix steps; the approval-prompt templates below are the wording to surface to the user.

### Workflow 1: Add Missing Frontmatter

**Detection**: SKILL/Command file, no `---` at line 1

**Fix approach**:
1. Determine document type (SKILL vs Command)
2. Ask the user for metadata
3. Insert frontmatter template at line 1

**Approval prompt template**:
```
Missing required frontmatter. Add the following to line 1?

---
name: [skill-name]
description: [Brief description]
allowed-tools: Read, Write, Edit, Bash
---

Options:
A) Add frontmatter as shown
B) Let me edit manually
C) Skip this file
```

### Workflow 2: Fix Section Order

**Detection**: Required sections out of sequence

**Fix approach**:
1. Identify current section order
2. Map to required order for document type
3. Show proposed reordering

**Approval prompt template**:
```
Section order incorrect. Reorder to match standard?

Current: [current order]
Required: [required order]

Options:
A) Reorder automatically
B) Let me reorder manually
C) Skip validation
```

### Workflow 3: Add Missing Sections

**Detection**: Required section absent (e.g., RULES in SKILL)

**Fix approach**:
1. Identify missing sections
2. Generate section template
3. Insert at appropriate position

**Approval prompt template**:
```
Missing required section: [SECTION NAME]

Add template section at line [N]?

## N.  [SECTION NAME]
[Template content]

Options:
A) Add template section
B) Let me add manually
C) Skip this section
```

---

## 4. PHASE INTERACTIONS

**Independent execution**:
- Phase 1 (Enforcement) → Standalone structure validation
- Phase 2 (Optimization) → Standalone content improvement
- Phase 3 (Recommendations) → Standalone review output

**Sequential chaining** (script-assisted review):
```
Phase 1: Extract structure (extract_structure.py)
    ├─ Critical violations in checklist? → STOP
    └─ Valid → Continue
        ↓
Phase 2: AI evaluates JSON output
    ├─ Low quality assessment? → WARNING
    └─ Continue
        ↓
Phase 3: AI provides recommendations
    ├─ Issues found? → REPORT
    └─ Complete
```

**Error handling**:
- Phase 1 critical → Block execution, manual fix required
- Phase 2 weak content → Warning + suggestions, continues
- Phase 3 gaps detected → Report + improvement plan

---

## 5. QUICK TROUBLESHOOTING

| Issue | Cause | Solution |
|-------|-------|----------|
| "Execution blocked" | Critical violation | Read error message, apply suggested fix |
| JSON parse error | Invalid markdown structure | Check for unclosed code blocks or frontmatter |
| Wrong type detected | File location mismatch | Check document type detection in JSON output |
| Checklist failures | Structure issues | Review checklist results in JSON, fix violations |
| Validation not running | Environment difference | Apply checks manually (see Section 1) |
| Safe fix not applied | Permission issue | Check file permissions |

---

## RELATED RESOURCES

- [workflows.md](./workflows.md) - Four execution modes and mode selection
- [workflow_examples.md](./workflow_examples.md) - Worked command examples and batch processing
- [optimization.md](./optimization.md) - Content transformation procedure
- [core_standards.md](../../shared/references/global/core_standards.md) - Document type rules and structural requirements
- [validation.md](../../shared/references/global/validation.md) - Quality scoring and validation workflows
