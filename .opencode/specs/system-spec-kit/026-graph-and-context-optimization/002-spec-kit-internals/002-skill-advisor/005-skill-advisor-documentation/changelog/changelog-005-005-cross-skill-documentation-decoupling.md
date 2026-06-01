---
title: "Cross-Skill Documentation Decoupling"
description: "Removed 26 cross-skill references from system-spec-kit docs so each skill stands alone. Section 1 of three READMEs now uses prose and bullets with zero tables. Three ARCHITECTURE.md files conform to an identical 8-section template."
trigger_phrases:
  - "cross-skill decoupling"
  - "spec-kit documentation cleanup"
  - "zero tables readme section 1"
  - "architecture conform template"
  - "skill advisor documentation"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/005-cross-skill-documentation-decoupling` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation`

### Summary

The three system-spec-kit docs now describe only spec-kit. The 26 cross-skill references catalogued at Phase 1 are removed, including the entire SKILL-ADVISOR and CODE-GRAPH subsystem sections that lived in spec-kit/ARCHITECTURE.md. Section 1 of every README is prose plus bullets, zero tables. The three ARCHITECTURE.md files share an identical 9-row section list with the same anchor names and the same frontmatter shape; only the subject material differs.

### Added

- None.

### Changed

- 26 cross-skill references removed from spec-kit documentation.
- Spec-kit ARCHITECTURE established as canonical 8-section template for sibling skills.
- Spec-kit README section 1 rewritten as prose and bullets; sibling references removed.
- Spec-kit mcp_server README trigger phrases and inline paths cleaned.
- Spec-kit ARCHITECTURE rewritten to canonical 8-section template.
- Skill-advisor README section 1 tables replaced with prose and bullets.
- Code-graph README section 1 tables replaced with prose and bullets.

### Fixed

- None.

### Verification

- Cross-skill grep on 3 spec-kit docs - PASS, 0 hits
- Section 1 table count in spec-kit/README - PASS, 0 tables
- Section 1 table count in advisor/README - PASS, 0 tables
- Section 1 table count in code-graph/README - PASS, 0 tables
- spec-kit/README em-dash count - PASS, 0 (down from 4)
- ARCHITECTURE section list identical across 3 files - PASS, same 9 rows in same order
- ARCHITECTURE frontmatter shape identical - PASS, same 4 keys with same "Architecture:" title prefix
- Advisor ARCHITECTURE line count - PASS, 210 lines (at 220 target)
- Code-graph ARCHITECTURE line count - PASS, 219 lines (at 220 target)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/README.md` | Modified | Section 1 rewritten as prose and bullets; sibling refs removed; em dashes zeroed |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Trigger phrases scrubbed; inline path refs removed; sibling link deleted |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Modified (full rewrite) | Canonical 8-section template; SKILL-ADVISOR and CODE-GRAPH subsystem sections deleted |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | Section 1 "How This Compares" and "Key Features" tables replaced with prose and bullets |
| `.opencode/skills/system-code-graph/README.md` | Modified | Section 1 "How This Compares" and "Cross-Skill Integration" tables replaced with prose and bullets |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modified (full rewrite) | Conformed to 8-section template; at 210 lines |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modified (full rewrite) | Conformed to 8-section template; at 219 lines |

### Follow-Ups

- Pre-existing parent spec warnings remain; recursive strict-validate will show 2 unrelated warnings.
- Spec-kit ARCHITECTURE lost depth on subsystem detail; operators must consult sibling skill docs.
- HVR scoring not run; em-dash cleanup deferred beyond this packet.
