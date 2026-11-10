# Edit Evidence D — Smart-Router Partial Alignment Follow-on

Date: 2026-05-15
Trigger: Post-058 follow-up. User asked "check if the skill.md smart routers of skill advisor and code graph are aligned with sk doc router template" + chose option 2 (partial adoption).

## Context

The sk-doc smart-router template (`.opencode/skills/sk-doc/assets/skill/skill_smart_router.md`) defines 4 canonical patterns plus structural safeguards. The 2 system skills' SMART ROUTING sections did not adopt those patterns because their routing shape is intent → MCP-tool, not intent → resource-file load. Option 2 (partial adoption) adds three template-aligned elements to each SKILL.md without forcing the full 4-pattern pseudocode:

1. Explicit routing-key derivation
2. Multi-tier fallback contract
3. Anti-pattern callouts

## Edits applied

### system-skill-advisor/SKILL.md

Added 3 H3 subsections inside the existing SMART ROUTING anchor (between resource-domains list and anchor close):

- **`### Routing key`**: defines the routing key as the prompt's intent class, scored by `advisor_recommend` against indexed skill metadata + hook signals + graph relations. Notes operator override via explicit skill names.
- **`### Fallback contract`**: 3-tier fallback (low confidence → top-3 candidates; advisor MCP unavailable → keyword fallback with degraded mode announce; empty result → disambiguation checklist).
- **`### Anti-patterns`**: 3 anti-patterns (static skill inventories, hardcoded tool IDs in caller code, returning single recommendation when top 2 scores are within 0.1).

File grew 215 → 230 lines (+15).

### system-code-graph/SKILL.md

Added 3 H3 subsections inside the existing smart-routing anchor (between the standalone-MCP-name line and anchor close):

- **`### Routing key`**: natural-language intent class returned by `code_graph_classify_query_intent` (structural / semantic / hybrid). Operator override via direct tool naming.
- **`### Fallback contract`**: 3-tier (unclassifiable intent → ask for concrete artifact; MCP unavailable → stop, no text-search fallback; graph not ready → scan first then retry).
- **`### Anti-patterns`**: 3 anti-patterns (hardcoded tool lists, using `code_graph_query` without classification, treating `detect_changes` as a general query tool).

File grew 148 → 164 lines (+16).

## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type skill` on system-skill-advisor/SKILL.md | VALID, 0 issues |
| `validate_document.py --type skill` on system-code-graph/SKILL.md | VALID, 0 issues |
| Anchor pair balance | Preserved (no new anchors needed; additions sit inside existing `2-smart-routing` and `smart-routing` anchor pairs) |
| HVR voice | No em dashes, semicolons in prose, oxford commas, banned words in the added content |
| Voice consistency | Matches existing SKILL.md prose density |

## Why not full template adoption

The sk-doc smart-router template is a resilience pattern for skills that dynamically load reference docs from `references/` / `assets/` via `rglob("*.md")` + path-guarded `load()`. Both target skills route to MCP tool calls instead of file loads. Patterns 1 (Runtime Discovery), 2 (Existence-Check Before Load) and 4's "load fallback resource" mechanics do not map to MCP-tool routing. Pattern 3 (Extensible Routing Key) and Pattern 4's "graceful fallback" semantics DO map and are now reflected in the prose contract.

If either skill grows a reference-loading router later, the full pseudocode template should be adopted at that point.
