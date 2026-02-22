---
description: Generate a styled HTML visual analysis of a plan, SpecKit artifact, or user-guide document
argument-hint: "<doc-file-path> [--artifact <auto|spec|plan|tasks|checklist|implementation-summary|research|decision-record|readme|install-guide>] [--traceability]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS is empty, undefined, or whitespace-only:
    -> STOP IMMEDIATELY
    -> Ask:
        question: "Which document file should I review?"
        options:
          - label: "SpecKit doc"
            description: "spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, research.md, or decision-record.md"
          - label: "User guide"
            description: "README or install-guide style file"
          - label: "Other doc"
            description: "Any explicit markdown file path"
    -> WAIT for user response
    -> Use response as <doc-file-path>
    -> Only THEN continue

IF $ARGUMENTS contains a path:
    -> Continue reading this file
```

**CRITICAL RULES:**
- **DO NOT** infer review target from recent conversation.
- **DO NOT** default to `plan.md` when another document path is provided.
- **DO NOT** skip artifact metadata in output for artifact-aware rendering.

---

# Visual Explainer Plan Review

Generate a structured HTML analysis page for a document with completeness, risks, cross-doc traceability, and recommendations.

---

## 1. PURPOSE

Provide a visual quality review of planning and documentation artifacts so teams can quickly assess structure, coverage gaps, and execution risk before implementation.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with required `<doc-file-path>` and optional:
- `--artifact <auto|spec|plan|tasks|checklist|implementation-summary|research|decision-record|readme|install-guide>`
- `--traceability`

**Backward compatibility:** plain `/visual-explainer:plan-review "<path>/plan.md"` remains fully supported.

**Outputs:** `.opencode/output/visual/plan-review-{doc-name}-{timestamp}.html`

**SpecKit Metadata Contract:**
- `<meta name="ve-artifact-type" content="<artifact>">`
- `<meta name="ve-source-doc" content="<workspace-relative-path>">`
- `<meta name="ve-speckit-level" content="<1|2|3|3+|n/a>">`
- `<meta name="ve-view-mode" content="<artifact-dashboard|traceability-board>">`

**Status:** `STATUS=OK ACTION=create PATH=<output-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` and review resources:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quick_reference.md`
- `references/speckit_artifact_profiles.md`
- `references/speckit_user_guide_profiles.md` (if README/install-guide)
- `references/css_patterns.md`
- `references/navigation_patterns.md`
- `references/quality_checklist.md`

---

## 4. WORKFLOW OVERVIEW

| Step | Name | Purpose | Output |
| --- | --- | --- | --- |
| 1 | Load Inputs | Validate doc path and companion docs | Verified source set |
| 2 | Detect Profile | Map source to artifact/user-guide profile | Profile + required module set |
| 3 | Analyze Content | Score completeness, identify risks and gaps | Review findings |
| 4 | Build Visual | Render dashboard or traceability board | HTML artifact |
| 5 | Validate and Deliver | Run checks, save, open | Final report + status |

---

## 5. INSTRUCTIONS

### Step 1: Load Inputs

- Read `<doc-file-path>` fully.
- If present in same folder (or supplied spec folder), load companion docs:
  - `spec.md`
  - `plan.md`
  - `tasks.md`
  - `checklist.md`
  - `implementation-summary.md`
- Missing companion docs are informational unless required by selected profile.

### Step 2: Detect Artifact and View Mode

- Resolve artifact:
  - explicit `--artifact` wins
  - otherwise infer via profile detector precedence
- Resolve view mode:
  - `traceability-board` when `--traceability` is set
  - otherwise `artifact-dashboard`

### Step 3: Analyze Content

- Compute section and anchor coverage against selected profile.
- Calculate placeholder count.
- Evaluate cross-reference integrity.
- For checklist artifacts, compute checklist evidence density.

### Step 4: Build Visual Report

Required modules by mode:
- `artifact-dashboard`:
  1. Artifact Overview
  2. KPI Row
  3. Section Coverage Map
  4. Risks and Gaps
  5. Evidence Table
- `traceability-board`:
  1. Doc Graph
  2. Cross-Reference Matrix
  3. Missing-Link Diagnostics
  4. Recommendation Panel

### Step 5: Validate and Deliver

- Apply metadata contract in `<head>`.
- Run quality checklist validations.
- Save to `.opencode/output/visual/plan-review-{doc-name}-{timestamp}.html`.
- Open in browser.
- Return structured status.

---

## 6. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Missing `$ARGUMENTS` | Trigger mandatory gate and wait |
| Doc file does not exist | Return `STATUS=FAIL ERROR="Document file not found: <path>"` |
| Artifact inference ambiguous in `auto` mode | Return `STATUS=FAIL` requesting explicit `--artifact` |
| Traceability mode requested without companion docs | Continue with diagnostics and mark missing links explicitly |
| Rendering/validation failure | Return `STATUS=FAIL` with failing stage detail |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=create PATH=<output-path>
SUMMARY="Generated artifact-aware plan review with coverage, risk, and traceability analysis"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:plan-review "specs/007-auth/plan.md"
/visual-explainer:plan-review "specs/007-auth/checklist.md"
/visual-explainer:plan-review "specs/007-auth/spec.md" --traceability
/visual-explainer:plan-review "README.md" --artifact readme
```
