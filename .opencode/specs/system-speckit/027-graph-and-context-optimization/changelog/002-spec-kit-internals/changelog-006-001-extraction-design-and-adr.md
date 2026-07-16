---
title: "Skill Advisor Extraction: Design + ADR Phase 001"
description: "Research-and-design phase that locked ADR-001 (Standalone Advisor MCP With Legacy Tool Bridge). Answered three operator questions. Produced the extraction survey that grounds all subsequent child phases."
trigger_phrases:
  - "skill advisor extraction ADR"
  - "standalone advisor MCP decision"
  - "advisor extraction design phase"
  - "ADR-001 legacy tool bridge"
  - "system-skill-advisor architectural shape"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The skill advisor was buried five levels deep inside `system-spec-kit` with no formal extraction plan. Before any file moves could happen, the architectural shape and three unresolved operator questions needed to be locked so child phases could execute without relitigating the design.

A codex dispatch read the full advisor surface, enumerated four candidate shapes, scored each on six criteria. It locked **Standalone Advisor MCP With Legacy Tool Bridge** as ADR-001. The three operator questions were resolved: `advisor_*` tool ids stay stable. `spec_kit_memory` exposes deprecated proxy tools during a single migration window. `SYSTEM_SKILL_ADVISOR_DB_DIR` is permitted for tests and CI only. A whole-repo consumer survey found 607 matching lines across 154 files, providing the coverage baseline child phases 002-006 need to execute safely.

No advisor source was touched. No skill metadata, tests, runtime configs, nor launcher code was modified.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation | Pass | `validate.sh --strict` passed for packet 001, parent 015/009. 0 errors. 0 warnings. |
| ADR-001 present | Pass | `decision-record.md` exists. Names Standalone Advisor MCP With Legacy Tool Bridge. |
| Survey present | Pass | `research/extraction-survey.md` includes source tree, consumer call sites, registration sites, runtime configs. |
| Consumer grep evidence | Pass | Live consumer grep found 607 matching lines across 154 files after excluding historical spec packets, sandbox content, tests, feature catalogs, playbooks, references. |
| Runtime configs inventoried | Pass | Survey lists `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json` current `spec_kit_memory` entries. |
| Scope control | Pass | Only `decision-record.md`, `research/extraction-survey.md`, `implementation-summary.md` were written. |

### Files Changed

| File | What changed |
|------|--------------|
| `001-extraction-design-and-adr/decision-record.md` (NEW) | ADR-001 locking Standalone Advisor MCP With Legacy Tool Bridge. Alternatives scored on 6 criteria. Operator question answers. Migration sequence. Rollback trigger. |
| `001-extraction-design-and-adr/research/extraction-survey.md` (NEW) | Whole-repo advisor surface inventory covering source tree, 607 consumer call sites, tool registration sites, runtime MCP configs, docs references. |
| `001-extraction-design-and-adr/implementation-summary.md` (NEW) | Delivery record. Key decisions table. Verification evidence for this phase. |

### Follow-Ups

- Survey is point-in-time. Track any new consumer additions that land before child 002-006 execute.
- ADR may need amendment if a later child phase discovers a blocker. Scaffold an amendment packet rather than rewriting ADR-001 in place.
- Re-score ADR-001 alternatives after seeing actual migration friction in child 003-005.
