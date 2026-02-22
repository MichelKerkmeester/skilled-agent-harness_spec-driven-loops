---
description: Generate a styled HTML visual analysis of a plan or specification document
argument-hint: "<plan-file-path>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    -> STOP IMMEDIATELY
    -> Ask:
        question: "Which plan file should I review?"
        options:
          - label: "Plan file"
            description: "Review an explicit plan.md path"
          - label: "Spec file"
            description: "Review an explicit spec.md path"
          - label: "Task list"
            description: "Review an explicit tasks.md path"
    -> WAIT for user response
    -> Use their response as <plan-file-path>
    -> Only THEN continue

IF $ARGUMENTS contains a path:
    -> Continue reading this file
```

**CRITICAL RULES:**
- **DO NOT** infer the review target from recent conversation.
- **DO NOT** assume which file to review when multiple candidates exist.
- **DO NOT** proceed without an explicit path from `$ARGUMENTS` or user reply.
- The review target MUST be an explicit file path.

---

# Visual Explainer Plan Review

Generate a structured HTML analysis page for a plan/spec document with completeness, risks, and recommendations.

---

## 1. PURPOSE

Provide a visual quality review of planning artifacts so teams can quickly assess structure, coverage gaps, and execution risks before implementation.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with required `<plan-file-path>`.
**Outputs:** `.opencode/output/visual/plan-review-{plan-name}-{timestamp}.html`
**Status:** `STATUS=OK ACTION=create PATH=<output-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` and review resources:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quick_reference.md`
- `references/css_patterns.md`
- `references/navigation_patterns.md`
- `references/quality_checklist.md`

---

## 4. WORKFLOW OVERVIEW

| Step | Name | Purpose | Output |
| --- | --- | --- | --- |
| 1 | Load Inputs | Validate plan path and companion docs | Verified source set |
| 2 | Analyze Content | Score completeness, identify risks and gaps | Review findings |
| 3 | Build Visual | Render multi-section editorial report | HTML artifact |
| 4 | Validate & Deliver | Run checks, save, open | Final report + status |

---

## 5. INSTRUCTIONS

### Step 1: Load Inputs

- Read `<plan-file-path>` fully.
- If present in same directory, also read `spec.md`, `tasks.md`, and `checklist.md`.
- Treat missing companion files as optional context, not hard failure.

### Step 2: Analyze Content

- Compute section completeness against expected planning structure.
- Map requirements to plan items where possible.
- Identify risks, dependencies, and missing work.
- Compare with `spec.md` when available.

### Step 3: Build Visual Report

Generate a report with these sections:
1. Plan Overview
2. Completeness Score
3. Structure Map
4. Requirements Coverage
5. Risk Analysis
6. Dependency Graph
7. Gaps and Missing Items
8. Comparison with Spec
9. Recommendations

Use default aesthetic `editorial` unless user asks otherwise.

### Step 4: Validate and Deliver

- Run quality checklist validations.
- Save to `.opencode/output/visual/plan-review-{plan-name}-{timestamp}.html`.
- Open in browser.
- Return structured status.

---

## 6. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Missing `$ARGUMENTS` | Trigger mandatory gate and wait |
| Plan file does not exist | Return `STATUS=FAIL ERROR="Plan file not found: <path>"` |
| Plan file unreadable | Return `STATUS=FAIL ERROR="Cannot read plan file: <path>"` |
| Rendering/validation failure | Return `STATUS=FAIL` with failing stage detail |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=create PATH=<output-path>
SUMMARY="Generated plan review with completeness, risk, and recommendation analysis"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:plan-review "specs/007-auth/plan.md"
/visual-explainer:plan-review "specs/007-auth/spec.md"
/visual-explainer:plan-review "docs/release-plan.md"
```
