---
description: "Generate a styled HTML visual analysis of a plan or specification document"
argument-hint: "<plan-file-path>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /visual-explainer:plan-review

Generate a styled HTML page analyzing a plan document — showing structure, completeness, risks, and recommendations.

## Skill Activation

Load the `workflows-visual-explainer` skill:
1. Read `.opencode/skill/workflows-visual-explainer/SKILL.md`
2. Load `references/quick_reference.md` (always)
3. Load `references/css_patterns.md` (for styling)
4. Load `references/navigation_patterns.md` (multi-section page)

## Argument Parsing

```
INPUT: $ARGUMENTS
├─ Required: <plan-file-path> — Path to the plan document (usually plan.md or spec.md)
└─ If no arguments: ASK "Which plan file should I review?"
```

## Data Gathering

1. Read the plan file completely
2. Read associated spec files (spec.md, tasks.md, checklist.md) if they exist in the same directory
3. Check for related memory/ context files

## Section Architecture (9 sections)

1. **Plan Overview** — Title, scope, estimated effort, timeline
2. **Completeness Score** — KPI card showing % of standard plan sections present
3. **Structure Map** — Visual representation of plan sections and their relationships
4. **Requirements Coverage** — Table mapping requirements to plan items
5. **Risk Analysis** — Identified risks with severity and mitigation status
6. **Dependency Graph** — Mermaid diagram of task dependencies
7. **Gaps & Missing Items** — What the plan doesn't address that it should
8. **Comparison with Spec** — If spec.md exists, compare plan alignment
9. **Recommendations** — Specific actionable improvements

Default aesthetic: **Editorial** (serif headlines, generous whitespace)

## Output

Save to `.opencode/output/visual/plan-review-{plan-name}-{timestamp}.html`
Open in browser.
