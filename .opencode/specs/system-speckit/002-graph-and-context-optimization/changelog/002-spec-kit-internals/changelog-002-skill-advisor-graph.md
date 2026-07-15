---
title: "Phase 002: Skill advisor graph"
description: "Added structured graph metadata to all 21 skill folders, compiled into skill-graph.json (4667 bytes), and integrated graph-derived boosts into the advisor routing pipeline. 44/44 regression cases pass."
trigger_phrases:
  - "phase 002 changelog"
  - "skill advisor graph"
  - "skill-graph.json"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor` (Level 2)
> Parent packet: `002-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor`

### Summary

Added a structured graph metadata system to all 20 routable skill folders plus skill-advisor itself. Each folder now has a `graph-metadata.json` capturing `skill_id`, `family`, `category`, `edges` (depends_on, enhances, siblings, conflicts_with, prerequisite_for), `domains`, and `intent_signals`. A compiler script produces a single `skill-graph.json` at 4667 bytes. The advisor pipeline now applies graph-derived transitive boosts, family affinity, and conflict penalties after the existing phrase-intent stage.

### Added

- 21 per-skill `graph-metadata.json` files (20 routable + skill-advisor).
- `skill_graph_compiler.py` with `--validate-only`, `--pretty`, and `--output` flags.
- Compiled `skill-graph.json` at 4667 bytes (under 5KB target). Contains 6 families, 21 skills, 10 hub skills, sparse adjacency.
- 4 new functions in `skill_advisor.py`: `_load_skill_graph()`, `_apply_graph_boosts()`, `_apply_family_affinity()`, `_apply_graph_conflict_penalty()`.
- 3 call-site insertions in `analyze_request()`.
- Health check extension: `skill_graph_loaded`, `skill_graph_skill_count`.
- 3 new graph-specific regression cases (P1-GRAPH-001/002/003). Suite grew from 41 to 44 cases.

### Changed

- `skill_advisor.py` gained approximately 110 lines for graph loading, three boost functions, and health-check fields.
- 3 existing regression case expectations updated to reflect graph-aware routing.

### Fixed

- Ghost candidate guard added in `_apply_graph_boosts()` and `_apply_family_affinity()` (sub-phase 001 research audit finding).
- Edge gaps filled for 4 skill metadata files (sub-phase 001).
- `intent_signals` now included in compiled output (sub-phase 001, size target relaxed to 4KB).
- `prerequisite_for` edges now compiled into runtime adjacency (sub-phase 001, P0-4 fix).
- `_graph_boost_count` tracking added with 10% confidence penalty when more than 50% of score is graph-derived.

### Verification

- `skill_graph_compiler.py --validate-only`: 21 files pass, zero errors.
- Compiled output: 4667 bytes (under 5KB).
- `--health` reports `skill_graph_loaded: true`, `skill_graph_skill_count: 21`.
- Regression suite: 44/44 pass (100%). Top-1 accuracy: 100%. P0 pass rate: 100%.
- "code review" routes to sk-code-review at 0.95. "use figma to export designs" routes to mcp-figma at 0.95 with `!graph:depends(mcp-figma,0.9)`.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/*/graph-metadata.json` (21 files) | New per-skill graph metadata |
| `skill-advisor/scripts/skill_graph_compiler.py` | New compiler script |
| `skill-advisor/scripts/skill-graph.json` | New compiled graph output |
| `skill-advisor/scripts/skill_advisor.py` | Graph loading, 3 boost functions, 3 call-site insertions, health extension |
| `skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | 3 fixed expectations + 3 new cases |

### Follow-Ups

- Graph metadata must be manually maintained when skills change.
- No conflicts defined yet (all `conflicts_with` arrays are empty).
- Session bootstrap injection not yet implemented.
