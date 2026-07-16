---
title: "Code Graph Child 001: SKILL.md, INSTALL_GUIDE and READMEs Polish"
description: "Targeted edits across SKILL.md, INSTALL_GUIDE.md, ARCHITECTURE.md, README.md, feature_catalog and per-folder mcp_server READMEs. Fixes launcher reference drift, tool-count drift, HVR violations. Adds a why-primer, glossary and situational triggers to SKILL.md."
trigger_phrases:
  - "system-code-graph skill docs polish"
  - "install guide drift fix"
  - "architecture launcher reference fix"
  - "hvr cleanup code graph docs"
  - "plugin bridges import drift"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-16

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/009-system-code-graph-uplift-phase-parent/001-skill-docs-install-guide-and-readmes-polish` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/009-system-code-graph-uplift-phase-parent`

### Summary

The system-code-graph skill docs had accumulated drift and HVR (high-value readability) violations since packet 028 closed. SKILL.md lacked a "why structural indexing matters" primer, a glossary and situational triggers. ARCHITECTURE.md referenced a stale launcher file (`mk-spec-memory-launcher.cjs` instead of `mk-code-index-launcher.cjs`). INSTALL_GUIDE.md showed an outdated version number and tool count. Em dashes were present across 11 authored docs.

All 10 priority findings from research were addressed in a four-batch dependency-ordered sequence. SKILL.md shipped first as the terminology root. INSTALL_GUIDE.md and ARCHITECTURE.md followed. References, feature_catalog and per-folder READMEs closed the sequence. The plugin_bridges README was updated to honestly document post-extraction import drift rather than claim working paths.

### Added

- "Why structural matters" problem-first primer in SKILL.md before section 1
- 7-term glossary in SKILL.md (structural indexing, semantic search, blast radius, readiness, trust state, scope fingerprint, false-safe)
- Three situational triggers in SKILL.md with concrete dispatch scenarios
- "Why this layer matters" primer in `mcp_server/README.md`
- Import drift documentation table in `mcp_server/plugin_bridges/README.md` listing 3 broken paths

### Changed

- SKILL.md continuity frontmatter refreshed to packet 019/001 pointer
- SKILL.md boundary explanation at line 92 expanded with clear rationale
- SKILL.md reference notation at line 56 corrected
- INSTALL_GUIDE.md tool list updated to include `classify_query_intent` at line 17
- INSTALL_GUIDE.md version updated to `1.0.3.1` at line 49
- INSTALL_GUIDE.md tool count corrected to 11 at lines 56 and 197
- ARCHITECTURE.md launcher reference at line 72 corrected to `mk-code-index-launcher.cjs`
- ARCHITECTURE.md database path corrected to skill-local location
- Em dashes removed across 11 in-scope docs (SKILL.md 3, ARCHITECTURE.md 12, INSTALL_GUIDE.md 1, README.md 1, feature_catalog 6, plugin_bridges README 1)
- `mcp_server/README.md` two Oxford commas removed at lines 35 and 40
- `mcp_server/tests/handlers/README.md` two Oxford commas removed at lines 67 and 90

### Fixed

- ARCHITECTURE.md launcher reference pointed at the spec-kit launcher instead of the code-graph launcher. The fix ensures `mk-code-index-launcher.cjs` is referenced on line 72.
- INSTALL_GUIDE.md version and tool count were stale from a prior topology change. Both now reflect the post-decoupling 8-to-11 tool count and version `1.0.3.1`.
- plugin_bridges/README.md claimed working import paths that were broken after extraction. The updated file documents the 3 broken paths explicitly so operators are not misled.

### Verification

| Check | Result |
|-------|--------|
| Em dash sweep across 11 in-scope files | PASS, all 11 files report 0 em dashes via `grep -c` (em-dash pattern) |
| ARCHITECTURE.md launcher reference | PASS, line 72 reads `mk-code-index-launcher.cjs` |
| INSTALL_GUIDE.md known drift (lines 49, 56, 197) | PASS, version `1.0.3.1`, tool count `11` |
| INSTALL_GUIDE.md `classify_query_intent` at line 17 | PASS, present in tool id list |
| SKILL.md primer, glossary and triggers | PASS, all present before section 1 |
| plugin_bridges README drift documentation | PASS, section 1 Overview lists 3 broken import paths |
| Strict-validate child 001 | PASS, exit 0, zero errors |
| Strict-validate parent 019 | PASS, exit 0, zero errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modified | Continuity refresh, why-primer, glossary, situational triggers, boundary explanation expanded, reference notation corrected, 3 em-dash removals |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Modified | `classify_query_intent` added to tool list, version updated to `1.0.3.1`, tool count corrected to 11, em dash at line 240 removed |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modified | Launcher reference corrected at line 72, database path corrected, 12 em-dash removals across sections 4 through 7 |
| `.opencode/skills/system-code-graph/README.md` | Modified | Em dash at line 50 removed, database path drift at line 54 fixed |
| `.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md` | Verified clean | 0 em dashes found (research finding was stale) |
| `.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md` | Verified clean | 0 em dashes found |
| `.opencode/skills/system-code-graph/references/config/database_path_policy.md` | Verified clean | 0 em dashes found |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Modified | 6 em-dash removals at lines 38, 131, 183, 217, 233, 317 |
| `.opencode/skills/system-code-graph/mcp_server/README.md` | Modified | "Why this layer matters" primer added, 2 Oxford commas removed |
| `.opencode/skills/system-code-graph/mcp_server/tests/handlers/README.md` | Modified | 2 Oxford commas removed at lines 67 and 90 |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md` | Modified | Import drift table added documenting 3 broken paths, em dash removed |

### Follow-Ups

- Measure HVR score per doc using `validate_document.py` across all 11 in-scope files. Child 003 owns this pass.
- Fix the 3 broken import paths in `mcp_server/plugin_bridges/README.md` by updating the bridge source to point at current module locations. Out of scope for child 001.
