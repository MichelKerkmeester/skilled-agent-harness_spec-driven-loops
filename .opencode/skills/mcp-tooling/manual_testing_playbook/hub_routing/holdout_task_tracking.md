---
id: MT-H03
category: hub_routing
stage: holdout
title: "Blind holdout: task tracking routes to mcp-click-up"
expected_intent: mcp-click-up
expected_resources:
  - mcp-click-up/SKILL.md
blindToRouterKeywords: true
version: 1.0.0.0
---
# MT-H03: Blind holdout — task tracking

Prompt: Close out yesterday's two open items in our project tracker, add a short note on what shipped, and log the hour I spent.

## Expected Behavior

Natural-language task-tracker intent (no "ClickUp"/"cupt" alias, no literal "task management"/"time tracking" vocabulary) should still resolve `mcp-click-up` — closing items, adding notes, and logging time are its daily-ops surface. No other hub mode manages work items.
