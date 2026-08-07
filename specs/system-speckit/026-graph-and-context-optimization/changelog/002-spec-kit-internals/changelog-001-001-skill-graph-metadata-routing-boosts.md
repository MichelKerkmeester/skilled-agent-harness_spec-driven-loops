---
title: "Skill Advisor Graph: Metadata Files and Routing Boosts"
description: "Added structured graph-metadata.json to all 21 skill folders. Compiled them into a single skill-graph.json. Wired four graph-aware functions into the skill_advisor.py routing pipeline so relationship-based boosts and conflict penalties are applied at routing time."
trigger_phrases:
  - "skill graph metadata routing boosts"
  - "skill_graph_compiler"
  - "graph-metadata.json skill advisor"
  - "skill advisor graph boosts"
  - "skill-graph.json compiled"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/001-skill-graph-metadata-routing-boosts` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph`

### Summary

Skill relationship knowledge was entirely implicit. All 333 boosters (170 single-skill, 32 multi-skill, 131 phrase) were hardcoded in `skill_advisor.py` with no structured representation of how skills relate to each other. Adding a new skill required editing three booster maps by hand. Conflict detection was absent. Session bootstrap had no graph context about skill topology.

Twenty-one per-skill `graph-metadata.json` files were authored across all routable skill folders plus the advisor itself. A `skill_graph_compiler.py` generator validates then compiles them into a 4667-byte `skill-graph.json`. Four new functions were wired into `skill_advisor.py` to apply graph-derived relationship scoring at routing time. The regression suite rose to 44 cases at 100 percent pass rate.

### Added

- `skill_graph_compiler.py` in `system-skill-advisor/mcp_server/scripts/` with four operation modes: discover, validate, compile, CLI
- `skill-graph.json` (4667 bytes, under 5KB target) at `system-skill-advisor/mcp_server/scripts/skill-graph.json` with 6 families, 21 skills, 10 hub skills, sparse adjacency
- 21 per-skill `graph-metadata.json` files across all skill folders (20 routable plus the skill-advisor itself)
- `_load_skill_graph()` lazy loader with global cache in `skill_advisor.py`
- `_apply_graph_boosts()` with snapshot pattern for transitive enhances (0.30), siblings (0.15), depends_on (0.20 damping)
- `_apply_family_affinity()` applying an 8% boost to family members when one has strong signal
- `_apply_graph_conflict_penalty()` adding 0.15 uncertainty for conflicting skill pairs
- Three graph-specific regression cases (P1-GRAPH-001, P1-GRAPH-002, P1-GRAPH-003)

### Changed

- `skill_advisor.py` extended with health-check fields `skill_graph_loaded` and `skill_graph_skill_count`
- `skill_advisor.py` `analyze_request()` now calls `_apply_graph_boosts()`, `_apply_family_affinity()`, `_apply_graph_conflict_penalty()` after PHRASE_INTENT_BOOSTERS and before explicit variant matching
- `skill_advisor_regression_cases.jsonl` updated with three corrected expectations to reflect graph-aware routing behavior

### Fixed

- Routing queries that trigger family co-activation now receive a consistent 8% affinity lift rather than relying on accidentally overlapping intent boosters
- Dependency pull-up for `mcp-figma` correctly surfaces `mcp-code-mode` via graph edge reasoning instead of requiring a separate hardcoded booster

### Verification

| Check | Result |
|---|---|
| `skill_graph_compiler.py --validate-only` on 21 files | PASS. Zero errors. |
| Compiled size check | PASS. 4667 bytes, under 5KB target. |
| Hub skills count | PASS. 10 skills above median inbound edges. |
| `skill_advisor.py --health` reports `skill_graph_loaded` | PASS. `skill_graph_loaded: true`, `skill_graph_skill_count: 21`. |
| Routing spot-check "code review" | PASS. Routes to `sk-code-review` at 0.95. |
| Routing spot-check "use figma to export designs" | PASS. `mcp-figma` at 0.95, `mcp-code-mode` at 0.92 with `!graph:depends(mcp-figma,0.9)` present. |
| Regression suite | PASS. 44 of 44 cases pass (100%). All 12 P0 cases pass. Top-1 accuracy 100%. Command bridge false positives 0%. |

### Files Changed

| File | Action |
|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py` (NEW) | Created. Discovers, validates, compiles per-skill metadata into `skill-graph.json`. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` (NEW) | Created. Generated compiled graph, 4667 bytes, 21 skills, 6 families. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modified. Added `_load_skill_graph`, `_apply_graph_boosts`, `_apply_family_affinity`, `_apply_graph_conflict_penalty`, health check extension, three call-site insertions in `analyze_request()`. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modified. Three stale expectations corrected. Three graph-specific cases added. |
| `.opencode/skills/*/graph-metadata.json` x21 (NEW) | Created. One JSON file per skill folder with `skill_id`, `family`, `category`, `edges`, `domains`, `intent_signals`. |

### Follow-Ups

- Populate `conflicts_with` arrays in per-skill `graph-metadata.json` files as real conflicts are identified. All arrays are currently empty.
- Implement session bootstrap injection so the graph summary is pre-injected into session context rather than loaded lazily at first advisor call.
- Investigate auto-generation of `graph-metadata.json` from SKILL.md analysis to reduce manual maintenance burden as skills are added or renamed.
