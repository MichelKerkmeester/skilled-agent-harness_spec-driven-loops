---
description: Generate a styled HTML recap of recent work and progress
argument-hint: "[time-window]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Visual Explainer Recap

Generate a visual recap page summarizing recent work, progress, and next actions for a selected time window.

---

## 1. PURPOSE

Create an at-a-glance progress artifact that combines commit activity, completed work, architectural changes, and upcoming priorities.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with optional `[time-window]` (`3d`, `1w`, `2w`, `1m`, `today`).
**Default:** `1w` when omitted.
**Outputs:** `.opencode/output/visual/recap-{timewindow}-{timestamp}.html`
**Status:** `STATUS=OK ACTION=create PATH=<output-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` and recap resources:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quick_reference.md`
- `references/css_patterns.md`
- `references/navigation_patterns.md`
- `references/quality_checklist.md`

---

## 4. ARGUMENT ROUTING

Parse time-window input:
- Accepted format: `<number><unit>` where `unit` is `d`, `w`, or `m`
- Accepted literal: `today`
- Empty input: use `1w`

Resolve to a concrete date range before collecting data.

---

## 5. INSTRUCTIONS

### Step 1: Gather Evidence

Collect from:
- `git log --since="<resolved-date>" --oneline --stat`
- Recently changed spec folders and implementation summaries
- Recent memory/context files when available
- Diff statistics over the same time window

### Step 2: Build Recap Narrative

Summarize:
- Completed work
- Work in progress
- Major decisions
- Architectural impact
- Trend highlights
- Next-step recommendations

### Step 3: Build Visual Report

Include these sections:
1. Period Summary
2. Timeline
3. Completed Work
4. In Progress
5. Architecture Changes
6. Key Decisions
7. Metrics and Trends
8. Next Steps

Default aesthetic: `data-dense`.

### Step 4: Validate and Deliver

- Run quality checklist validations.
- Save to `.opencode/output/visual/recap-{timewindow}-{timestamp}.html`.
- Open in browser.
- Return structured status.

---

## 6. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Invalid time-window format | Return `STATUS=FAIL ERROR="Invalid time window: <value>"` |
| No activity in range | Generate report with explicit "No activity found" state |
| Data collection command fails | Return `STATUS=FAIL` with command context |
| Render/validation failure | Return `STATUS=FAIL` with failing stage detail |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=create PATH=<output-path>
SUMMARY="Generated progress recap for the selected time window"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:recap
/visual-explainer:recap "2w"
/visual-explainer:recap "1m"
/visual-explainer:recap "today"
```
