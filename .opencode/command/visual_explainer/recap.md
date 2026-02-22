---
description: Generate a styled HTML recap of recent work and progress with optional SpecKit document health metrics
argument-hint: "[time-window] [--spec-folder <path>] [--include-doc-health]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Visual Explainer Recap

Generate a visual recap page summarizing recent work, progress, and next actions for a selected time window, with optional SpecKit doc-health coverage.

---

## 1. PURPOSE

Create an at-a-glance progress artifact that combines commit activity, completed work, architectural changes, and optional documentation health signals for a spec folder.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with optional:
- `[time-window]` (`3d`, `1w`, `2w`, `1m`, `today`)
- `--spec-folder <path>`
- `--include-doc-health`

**Default:** `1w` when omitted.

**Outputs:** `.opencode/output/visual/recap-{timewindow}-{timestamp}.html`

**When doc-health lane is enabled:**
- include checklist and implementation-summary progress metrics when files exist
- include SpecKit metadata tags in `<head>`

**Status:** `STATUS=OK ACTION=create PATH=<output-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` and recap resources:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quick_reference.md`
- `references/css_patterns.md`
- `references/navigation_patterns.md`
- `references/speckit_artifact_profiles.md` (if doc-health is enabled)
- `references/quality_checklist.md`

---

## 4. ARGUMENT ROUTING

Parse time-window input:
- accepted format: `<number><unit>` where `unit` is `d`, `w`, or `m`
- accepted literal: `today`
- empty input: use `1w`

Parse doc-health flags:
- `--include-doc-health`: enable documentation metrics lane
- `--spec-folder <path>`: scope docs to that folder

Resolve to a concrete date range before collecting data.

---

## 5. INSTRUCTIONS

### Step 1: Gather Evidence

Collect from:
- `git log --since="<resolved-date>" --oneline --stat`
- diff statistics over the same time window
- if doc-health enabled:
  - spec folder artifact files
  - `checklist.md` completion state
  - `implementation-summary.md` verification status

### Step 2: Build Recap Narrative

Summarize:
- completed work
- work in progress
- major decisions
- architectural impact
- trend highlights
- next-step recommendations

### Step 3: Build Visual Report

Include baseline sections:
1. Period Summary
2. Timeline
3. Completed Work
4. In Progress
5. Architecture Changes
6. Key Decisions
7. Metrics and Trends
8. Next Steps

If doc-health enabled, add:
9. SpecKit Document Health

Default aesthetic: `data-dense`.

### Step 4: Validate and Deliver

- run quality checklist validations
- save to `.opencode/output/visual/recap-{timewindow}-{timestamp}.html`
- open in browser
- return structured status

---

## 6. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Invalid time-window format | Return `STATUS=FAIL ERROR="Invalid time window: <value>"` |
| `--spec-folder` path missing | Return `STATUS=FAIL ERROR="Spec folder not found: <path>"` |
| No activity in range | Generate report with explicit `No activity found` state |
| Data collection command fails | Return `STATUS=FAIL` with command context |
| Render/validation failure | Return `STATUS=FAIL` with failing stage detail |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=create PATH=<output-path>
SUMMARY="Generated progress recap for selected time window with optional SpecKit doc-health metrics"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:recap
/visual-explainer:recap "2w"
/visual-explainer:recap "1m" --include-doc-health
/visual-explainer:recap "today" --spec-folder "specs/007-auth" --include-doc-health
```
