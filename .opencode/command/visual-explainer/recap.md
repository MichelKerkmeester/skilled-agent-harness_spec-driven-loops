---
description: "Generate a styled HTML recap of recent work and progress"
argument-hint: "<time-window> (e.g., 2w, 1m, today)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /visual-explainer:recap

Generate a visual recap page summarizing recent work, progress, and accomplishments.

## Skill Activation

Load the `sk-visual-explainer` skill:
1. Read `.opencode/skill/sk-visual-explainer/SKILL.md`
2. Load `references/quick_reference.md` (always)
3. Load `references/css_patterns.md` (for styling)
4. Load `references/navigation_patterns.md` (multi-section page)

## Argument Parsing

```
INPUT: $ARGUMENTS
├─ Accepts: time window — "2w" (2 weeks), "1m" (1 month), "today", "3d" (3 days)
├─ Default: "1w" (1 week) if no argument provided
└─ Parse: number + unit (d=days, w=weeks, m=months)
```

## Data Gathering

Collect from multiple sources:
1. **Git log** — commits in time window: `git log --since="<date>" --oneline --stat`
2. **Spec folders** — recently modified spec folders with implementation-summary.md
3. **Memory files** — recent memory saves with context
4. **Changed files** — `git diff --stat HEAD@{<time>}..HEAD`

## Section Architecture (8 sections)

1. **Period Summary** — KPI cards: commits, files changed, LOC added/removed, specs completed
2. **Timeline** — Chronological view of major events/milestones
3. **Completed Work** — Table of finished tasks with links to spec folders
4. **In Progress** — Current open work items
5. **Architecture Changes** — Mermaid diagram of components modified
6. **Key Decisions** — Important decisions made during the period
7. **Metrics & Trends** — Chart.js charts showing activity over time
8. **Next Steps** — Upcoming planned work

Default aesthetic: **Data-dense** (small type, tight spacing, max information)

## Output

Save to `.opencode/output/visual/recap-{timewindow}-{timestamp}.html`
Open in browser.
