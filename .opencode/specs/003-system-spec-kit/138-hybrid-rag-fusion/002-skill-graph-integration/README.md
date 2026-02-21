# Skill Graphs Migration Status

This folder tracks the migration from monolithic `SKILL.md` files to skill graphs (`index.md` + `nodes/`).

The migration is in progress. Some skills are graph-based today, and several are still legacy-only.

## Current State (Filesystem Snapshot)

Snapshot date: 2026-02-20

| Skill | SKILL.md | index.md | nodes | SKILL.md.bak | Migration Status |
|---|---|---|---:|---|---|
| `mcp-code-mode` | Yes | Yes | 6 | Yes | Complete |
| `mcp-figma` | Yes | No | 0 | No | Not started |
| `system-spec-kit` | Yes | Yes | 9 | Yes | Complete |
| `workflows-documentation` | Yes | Yes | 7 | No | Complete |
| `mcp-chrome-devtools` | Yes | No | 0 | No | Not started |
| `sk-code--full-stack` | Yes | No | 0 | No | Not started |
| `workflows-code--opencode` | Yes | No | 0 | No | Not started |
| `workflows-code--web-dev` | Yes | No | 0 | No | Not started |
| `workflows-git` | Yes | No | 0 | No | Not started |

## Progress Summary

- Complete: 3/9 skills (`mcp-code-mode`, `system-spec-kit`, `workflows-documentation`)
- Partially complete: 0/9 skills (none currently in an index-only or partial-node state)
- Not started: 6/9 skills

## What Is Already Working

1. Global wikilink validation is implemented and passing via `check-links.sh`.
2. `workflows-documentation` now includes skill graph guidance and enablement resources:
   - `references/skill_graph_standards.md`
   - `assets/opencode/skill_graph_node_template.md`
   - graph routing in `index.md` and related nodes

## Known Issues

1. REQ-003 is not yet met: not all skills have `index.md` entrypoints.
2. Most skills still have no `nodes/` directory content.
3. `check-links.sh` validates existing graphs, but cannot verify missing graphs that are not created yet.

## Verification Evidence

- File discovery confirms graph coverage is currently limited to 3 skills with `index.md` and node files.
- Link validation command result: `bash .opencode/skill/system-spec-kit/scripts/check-links.sh` -> `All wikilinks are valid.`

## Next Steps

1. Migrate remaining skills in this order: `workflows-git`, `mcp-chrome-devtools`, `mcp-figma`, then `workflows-code--*` variants.
2. For each skill: create `index.md`, create focused nodes, then keep `SKILL.md` as compatibility wrapper.
3. Run global `check-links.sh` after each skill migration batch.
4. Add a manual traversal test pass across multiple skills to validate real agent navigation, not just link existence.
