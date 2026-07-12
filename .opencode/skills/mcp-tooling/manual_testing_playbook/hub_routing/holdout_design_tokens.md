---
id: MT-H02
category: hub-routing
stage: holdout
title: "Blind holdout: design-token extraction routes to mcp-figma"
expected_intent: mcp-figma
expected_resources:
  - mcp-figma/SKILL.md
blindToRouterKeywords: true
version: 1.0.0.0
---
# MT-H02: Blind holdout — design tokens
Prompt: Pull the button component's colors and spacing values out of our shared design file and hand them to the build.
## Expected Behavior
Natural-language design-token intent (no "Figma" alias) should still resolve `mcp-figma`.
