---
title: "Timeline"
description: "Layout conventions for events positioned in time — hairline baseline, tick marks, alternating event labels, honest time scaling, and milestone accent."
trigger_phrases:
  - "timeline diagram layout"
  - "milestone timeline"
  - "release history"
  - "project milestones"
  - "incident timeline"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Timeline

**Best for:** release history, project milestones, incident timelines, roadmaps, changelog visualizations.

## 1. Layout conventions
- Horizontal hairline baseline across the middle (`stroke-width=1`).
- Tick marks at time boundaries (quarters, months, sprints) with date labels below in Geist Mono.
- Events: small filled circles (`r=4`) on the baseline. Labels alternate above and below to prevent collision, connected to the circle with a 1px hairline drop.
- Major milestones: coral circle (`r=6`) + bold Geist label.
- Time scale must be honest: if intervals are non-equal, space the circles non-equally. Don't fake linear spacing for aesthetics. Break the axis visibly if a region is too dense.

## 2. Anti-patterns
- Equal-spacing events that aren't equally spaced in time.
- Missing axis labels ("what unit is this?").
- Crowded labels without vertical offset — illegible.

## 3. Examples
- `assets/example-timeline.html` — minimal light
- `assets/example-timeline-dark.html` — minimal dark
- `assets/example-timeline-full.html` — full editorial
