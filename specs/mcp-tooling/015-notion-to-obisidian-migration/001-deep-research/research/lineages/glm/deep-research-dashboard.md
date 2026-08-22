# Deep Research Dashboard — GLM Lineage

> Auto-generated. Lineage `glm` (cli-devin / GLM-5.2 High). Stop policy: `max-iterations` (10); convergence off. Final state after synthesis.

## Iteration Table

| run | focus | newInfoRatio | findings | status |
|-----|-------|--------------|----------|--------|
| 1 | Importer choice deep-dive (API vs HTML) | 0.82 | 5 | complete |
| 2 | mcp-notion read surface mapping | 0.68 | 4 | complete |
| 3 | mcp-obsidian write surface mapping | 0.64 | 5 | complete |
| 4 | Relations & rollups recovery path | 0.78 | 6 | complete |
| 5 | Formulas 2.0 recovery | 0.55 | 7 | complete |
| 6 | Files, attachments & comments carry-over | 0.71 | 7 | complete |
| 7 | Multi-view databases & nested hierarchy | 0.66 | 5 | complete |
| 8 | Required vs optional plugins (ranked) | 0.58 | 6 | complete |
| 9 | mcp-notion-reads / mcp-obsidian-writes division of labor | 0.62 | 4 | complete |
| 10 | Parity & verification + final method decision | 0.45 | 4 | complete |

## Question Status

10/10 answered

- Q1 Importer choice — answered (iter 1)
- Q2 mcp-notion read surface — answered (iter 2)
- Q3 mcp-obsidian write surface — answered (iter 3)
- Q4 Relations & rollups recovery — answered (iter 4)
- Q5 Formulas 2.0 recovery — answered (iter 5)
- Q6 Files, attachments & comments — answered (iter 6)
- Q7 Multi-view databases & nested hierarchy — answered (iter 7)
- Q8 Required vs optional plugins — answered (iter 8)
- Q9 Division of labor — answered (iter 9)
- Q10 Parity & verification — answered (iter 10)

## Convergence Trend

newInfoRatio: 0.82 → 0.68 → 0.64 → 0.78 → 0.55 → 0.71 → 0.66 → 0.58 → 0.62 → 0.45
Average ≈ 0.65. Non-monotonic by design (broadening angles; no early synthesis). Stop reason: `maxIterationsReached`.

## Dead Ends

- Notion Markdown export (officially discouraged)
- HTML zip as primary for database-heavy spaces (loses databases)
- Content-based inventory via search (title-only)
- database_id where data_source_id required (API 2.0)
- MCP as default write path for unattended migration (needs live app)
- CLI/MCP tool for .base/Dataview authoring (none — file-layer only)
- "Relations/rollups lost on import" (false — auto-converted)
- "Bases cannot do cross-note lookup" (false since v1.9.7)
- "All formulas convert live" (some need static fallback)
- "Comments imported" (gap)
- "External attachments download by default" (opt-in)
- "All views import" (only table)
- "Notion Bases plugin optional for relational workspace" (required for parity)
- "Agent drives Importer UI" (cannot)
- "Full parity for form/map/dashboard" (no equivalent)

## Blocked Stops

_(none — convergence off; stop policy max-iterations)_

## Next Focus

_(lineage complete — synthesis produced; ready for parent orchestrator merge with deepseek lineage)_
