---
title: "Plan: Phase 004 — Trigger Phrases, advisor + code-graph"
description: "Execution plan for adding and improving trigger_phrases across system-skill-advisor (40 files) and system-code-graph (14 files)."
importance_tier: "normal"
contextType: "general"
---
# Plan: Phase 004 — Trigger Phrases, advisor + code-graph

---

## 1. APPROACH

Same derivation algorithm as phase 003. Two skills processed sequentially — each is small enough that one or two agents can handle an entire skill.

Use the same quality floor: 3 phrases minimum, 6 maximum. Phrase #1 always = canonical H3 heading from root catalog.

---

## 2. EXECUTION MODEL

### system-skill-advisor
- Run one agent per category (7 agents)
- Each agent reads: root catalog section + all files in category
- Categories with ≤6 files: single pass
- `06--mcp-surface` (9 files): may need two passes

**Special focus**: existing phrases in skill-advisor snippets use 4 phrases each. Verify they include:
1. Feature canonical name
2. MCP tool name (e.g., `advisor_recommend`, `advisor_status`)
3. Natural language variant
4. Alternative phrasing

### system-code-graph
- All 7 categories combined can be handled by 2-3 agents (small files, 1-4 files per category)
- Agent reads: root catalog + all snippets
- Code-graph snippets currently have 3 phrases — verify quality, add tool function names if missing

---

## 3. EXECUTION ORDER

```
1. Audit current state:
   grep -rL "trigger_phrases" .opencode/skills/system-skill-advisor/feature_catalog/[0-9]*/*.md
   grep -rL "trigger_phrases" .opencode/skills/system-code-graph/feature_catalog/[0-9]*/*.md

2. system-skill-advisor: process all 7 categories (parallel where context allows)

3. system-code-graph: process all 7 categories (single pass or 2-3 agents)

4. Verify: grep -rL "trigger_phrases" both skills → expected: 0
```

---

## 4. VERIFICATION

```bash
# Skill-advisor: all snippets have trigger_phrases
grep -rL "trigger_phrases" \
  .opencode/skills/system-skill-advisor/feature_catalog/[0-9]*/ | wc -l
# Expected: 0

# Code-graph: all snippets have trigger_phrases
grep -rL "trigger_phrases" \
  .opencode/skills/system-code-graph/feature_catalog/[0-9]*/ | wc -l
# Expected: 0

# Both skills combined gap
grep -rL "trigger_phrases" \
  .opencode/skills/system-skill-advisor/feature_catalog/ \
  .opencode/skills/system-code-graph/feature_catalog/ | \
  grep -v "feature_catalog\.md$" | wc -l
# Expected: 0
```
