---
title: "Cross-Skill Documentation Decoupling"
description: "System-spec-kit docs carried 26 pre-extraction cross-skill references and Section 1 tables that fragmented overviews. Cross-skill refs were removed, Section 1 converted to prose and bullets, and three ARCHITECTURE.md files conformed to a shared canonical template."
trigger_phrases:
  - "005 cross-skill decoupling"
  - "remove sibling refs from spec-kit"
  - "zero tables readme section 1"
  - "terse arch conform"
  - "cross-skill documentation cleanup"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/005-cross-skill-documentation-decoupling` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation`

### Summary

The three system-spec-kit docs carried 26 cross-skill references leftover from before the Skill Advisor and Code Graph were extracted as separate skills. Section 1 of each README used tables that fragmented what should be prose overviews. All cross-skill references were removed, Readme Section 1 was converted to prose and bullets, and the three ARCHITECTURE.md files were conformed to a shared canonical template so each skill stands alone with a consistent structure.

### Added

- None.

### Changed

- Cross-skill references removed from system-spec-kit docs. The 26 references catalogued in Phase 1 were deleted, and the SKILL-ADVISOR and CODE-GRAPH subsystem sections were removed from the spec-kit architecture document.
- Section 1 of each README converted from tables to prose and bullets.
- System-skill-advisor and system-code-graph ARCHITECTURE.md files conformed to the canonical 8-section template with matching frontmatter shape.
- System-spec-kit README em dashes reduced from 4 to 0.
- Trigger phrases and inline path references to sibling skills scrubbed from the spec-kit MCP server README.

### Fixed

- None.

### Verification

- Cross-skill grep on 3 spec-kit docs: PASS, 0 hits
- Section 1 table count in spec-kit README: PASS, 0 tables
- Section 1 table count in advisor README: PASS, 0 tables
- Section 1 table count in code-graph README: PASS, 0 tables
- spec-kit README em-dash count: PASS, 0 (down from 4)
- ARCHITECTURE section list identical across 3 files: PASS, same 9 rows in same order
- ARCHITECTURE frontmatter shape identical: PASS, same 4 keys with same "Architecture:" title prefix
- advisor ARCHITECTURE line count: PASS, 210 lines (target: at most 220)
- code-graph ARCHITECTURE line count: PASS, 219 lines (target: at most 220)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/README.md` | Modified | Section 1 OVERVIEW rewritten as prose and bullets. Sibling refs removed. Em dashes zeroed. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Trigger phrases scrubbed. Inline path refs removed. Sibling link deleted. |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Modified (full rewrite) | Replaced with canonical 8-section template. Section 5 SKILL-ADVISOR and Section 6 CODE-GRAPH deleted. |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | Section 1 "How This Compares" and "Key Features" tables replaced with prose and bullets. |
| `.opencode/skills/system-code-graph/README.md` | Modified | Section 1 "How This Compares" and "Cross-Skill Integration" tables replaced with prose and bullets. |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modified (full rewrite) | Conformed to 8-section template. Line count targeted at most 210. |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modified (full rewrite) | Conformed to 8-section template. Line count targeted at most 220. |

### Follow-Ups

- Run strict-validate on child 005 and verify exit code 0.
- Fill implementation-summary.md with final evidence.
- Commit on main with reference to 005.
- Push to origin/main.
- Mark all Phase 2 and Phase 3 tasks complete.
- Verify no blocked tasks remain.
