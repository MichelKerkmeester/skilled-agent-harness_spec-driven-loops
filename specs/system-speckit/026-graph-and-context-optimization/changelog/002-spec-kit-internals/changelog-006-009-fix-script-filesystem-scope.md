---
title: "Fix advisor-script filesystem-scope resolution bugs"
description: "Two production path fixes in skill_graph_compiler.py and skill_advisor.py corrected SKILLS_DIR and SKILL_GRAPH_SQLITE_PATH to resolve one directory too high. Both Python smoke tests passed. Vitest improved from 279/287 to 280/287."
trigger_phrases:
  - "fix script filesystem scope"
  - "SKILLS_DIR resolution bug"
  - "SKILL_GRAPH_SQLITE_PATH fix"
  - "skill_graph_compiler path fix"
  - "skill_advisor sqlite path"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/009-fix-script-filesystem-scope` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

Two production advisor scripts resolved filesystem paths one directory too high. `skill_graph_compiler.py` set `SKILLS_DIR` to `.opencode/` instead of `.opencode/skills/`, causing skill graph compilation to scan non-skill trees. `skill_advisor.py` set `SKILL_GRAPH_SQLITE_PATH` under the skill root instead of `mcp_server/database/`, so the Python parity shim probed the wrong database location.

Two surgical one-line edits corrected each path constant. Python smoke tests confirmed both constants now resolve to the correct target. Vitest pass count improved from 279/287 to 280/287 with no regressions. Strict validation passed for all three validation levels: packet, parent, grandparent.

### Added

None.

### Changed

- `SKILLS_DIR` in `skill_graph_compiler.py` now resolves to `.opencode/skills/` by removing one extra `..` from the path chain
- `SKILL_GRAPH_SQLITE_PATH` in `skill_advisor.py` now resolves to `mcp_server/database/skill-graph.sqlite` by correcting the directory segment

### Fixed

- `skill_graph_compiler.py` scanned `.opencode/` instead of `.opencode/skills/` when building the skill graph. Removing one `..` from `SKILLS_DIR` restored the correct compilation scope.
- `skill_advisor.py` probed `system-skill-advisor/database/skill-graph.sqlite` instead of `system-skill-advisor/mcp_server/database/skill-graph.sqlite`. Correcting the path segment aligned the shim with the package-local database policy.

### Verification

| Check | Result | Evidence |
|-------|--------|---------|
| Bug 1 smoke (`SKILLS_DIR`) | Pass | Python smoke prints and asserts path ending in `/.opencode/skills`. |
| Bug 2 smoke (`SKILL_GRAPH_SQLITE_PATH`) | Pass | Python smoke prints and asserts `mcp_server/database/skill-graph.sqlite`. |
| Vitest baseline | Fail expected | `279 passed / 287 total`, 5 failed, 3 skipped (pre-existing). |
| Vitest after | Improved | `280 passed / 287 total`, 4 failed, 3 skipped (one additional test unblocked). |
| Packet 009 strict validation | Pass | `validate.sh .../009-fix-script-filesystem-scope --strict` exits 0. |
| Parent strict validation | Pass | `validate.sh .../006-system-skill-advisor-package-extraction --strict` exits 0. |
| Grandparent strict validation | Pass | `validate.sh .../001-skill-graph --strict` exits 0. |
| `description.json` parse | Pass | Node `JSON.parse` exits 0. |

### Files Changed

| File | Action | What changed |
|------|--------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py` | Modified | `SKILLS_DIR` now resolves to `.opencode/skills/` instead of `.opencode/`. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modified | `SKILL_GRAPH_SQLITE_PATH` now resolves to `mcp_server/database/skill-graph.sqlite`. |

### Follow-Ups

- The advisor package Vitest suite remains partially red. Remaining 7 failures are pre-existing and outside the scope of this packet. A future packet should investigate and close them.
- The worktree contained unrelated pre-existing changes at dispatch time. Review whether any are related to advisor path behavior before the next refactor pass.
