---
description: "Generate a styled HTML visualization from a topic, concept, or terminal output"
argument-hint: "<topic> [--type TYPE] [--style STYLE]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /visual-explainer:generate

Generate a styled, self-contained HTML page that visualizes a topic, concept, or terminal output.

## Skill Activation

Load the `sk-visual-explainer` skill:
1. Read `.opencode/skill/sk-visual-explainer/SKILL.md`
2. Load `references/quick_reference.md` (always)
3. Load `references/css_patterns.md` (always for generate)
4. Load `references/library_guide.md` (if using Mermaid/Chart.js/anime.js)

## Argument Parsing

```
INPUT: $ARGUMENTS
├─ Required: <topic> — The subject to visualize
├─ Optional: --type TYPE — Diagram type (architecture, flowchart, sequence, data-flow, er, state, mindmap, table, timeline, dashboard)
├─ Optional: --style STYLE — Aesthetic (terminal, editorial, blueprint, neon, paper, hand-drawn, ide, data-dense, gradient)
└─ If no arguments: ASK "What would you like to visualize?"
```

## Workflow

Execute the 4-phase workflow from the skill:

### Phase 1: Think
- Analyze the topic and determine audience
- If `--type` not specified: use the diagram type decision guide from `references/quick_reference.md`
- If `--style` not specified: auto-detect based on content and diagram type using `references/css_patterns.md`

### Phase 2: Structure
- Read the matching reference template from `assets/templates/` FRESH (never from memory)
- Determine rendering approach: Mermaid vs Chart.js vs CSS Grid vs HTML table
- Build semantic HTML structure

### Phase 3: Style
- Apply chosen aesthetic from `references/css_patterns.md`
- Use CSS custom properties (`--ve-*` namespace)
- Add light/dark theme support via `prefers-color-scheme`
- Add animations with `prefers-reduced-motion` fallback
- If 4+ sections: add navigation from `references/navigation_patterns.md`

### Phase 4: Deliver
- Run all 9 quality checks from `references/quality_checklist.md`
- Save to `.opencode/output/visual/generate-{desc}-{timestamp}.html`
- Open in browser

## Examples

```
/visual-explainer:generate CI/CD pipeline architecture
/visual-explainer:generate "database schema" --type er --style blueprint
/visual-explainer:generate git branching strategy --type flowchart
```
