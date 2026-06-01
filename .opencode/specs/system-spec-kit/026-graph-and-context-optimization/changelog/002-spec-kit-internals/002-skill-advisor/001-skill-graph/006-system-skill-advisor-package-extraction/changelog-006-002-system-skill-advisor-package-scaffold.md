---
title: "Skill Advisor Package Scaffold: Envelope authored per ADR-001 standalone-MCP shape"
description: "The system-skill-advisor skill folder transitioned from an empty-stub state to a fully authored package envelope. Eleven content files totaling 1108 LOC were created or overwritten per ADR-001's locked standalone-MCP-with-legacy-bridge shape. Parity test failures improved from 5 to 4."
trigger_phrases:
  - "system-skill-advisor scaffold"
  - "advisor package envelope"
  - "skill advisor graph-metadata authored"
  - "standalone-mcp-with-legacy-bridge scaffold"
  - "advisor extraction child 002"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/002-system-skill-advisor-package-scaffold` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The `system-skill-advisor` skill folder existed as a partial-stub state: `SKILL.md` was empty, `graph-metadata.json` was missing entirely. The `feature_catalog/`, `manual_testing_playbook/` and `references/` directories held only `.gitkeep` files. This caused skill-discovery to treat the advisor as an unknown thin skill that occasionally won ambiguous routings, diverging from the Python golden corpus. Two parity test regressions were attributable to the empty-stub pickup.

A cli-codex dispatch authored the full package envelope in a single 11-minute window. Eleven content files (1108 LOC) were created or overwritten to match ADR-001's locked standalone-MCP-with-legacy-bridge shape. `SKILL.md` received proper frontmatter including a `description:` field now visible in the runtime skill index. `graph-metadata.json` was authored with `derived.intent_signals`, `manual.depends_on` and `manual.related_to` populated. An `mcp_server/` stub was created as the drop target for child 003's runtime move. Parity test failures improved from 5 to 4.

### Added

- `INSTALL_GUIDE.md` stub (60 LOC) naming `skill-advisor-launcher.cjs` as the child 004 target
- `graph-metadata.json` (181 LOC) with `derived.intent_signals`, `manual.depends_on` and `manual.related_to` fields
- `references/db-path-policy.md` (64 LOC) documenting the future `mcp_server/database/skill-graph.sqlite` location
- `references/legacy-tool-bridge.md` (46 LOC) capturing the ADR-001 legacy-bridge concept for child 003 readers
- `references/standalone-mcp-shape.md` (50 LOC) capturing the ADR-001 standalone-MCP contract shape
- `feature_catalog/feature_catalog.md` (56 LOC) with one illustrative entry for the MCP surface
- `feature_catalog/06--mcp-surface/01-advisor-recommend.md` (65 LOC)
- `manual_testing_playbook/manual_testing_playbook.md` (84 LOC)
- `manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md` (78 LOC)
- `mcp_server/README.md` (16 LOC) stating "Child 003's drop target" explicitly
- `mcp_server/database/.gitkeep` for the future DB directory

### Changed

- `SKILL.md` rewritten from empty stub to 182 LOC per ADR-001 standalone-MCP semantics. Frontmatter `description:` field now non-empty and visible in the runtime skill index.
- `ARCHITECTURE.md` rewritten from parallel-session content to 104 LOC aligned with ADR-001 standalone-MCP-with-legacy-bridge shape
- `README.md` rewritten from parallel-session content to 111 LOC aligned with the ADR-001 shape

### Fixed

- Skill-discovery treated `system-skill-advisor` as an unknown thin skill because `SKILL.md` was empty and `graph-metadata.json` was absent. Authoring both files resolved this.
- Parity test failure count reduced from 5 to 4. The one resolved failure was caused by the absence of `graph-metadata.json` preventing the TS scorer from projecting the advisor skill correctly.

### Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation 002 | PASS | `validate.sh --strict` 0 errors, 0 warnings |
| Strict spec validation 015/009 | PASS | `validate.sh --strict` 0 errors, 0 warnings |
| Strict spec validation 015 | PASS | `validate.sh --strict` 0 errors, 0 warnings |
| node JSON load (envelope) | PASS | `graph-metadata.json` parses cleanly. `SKILL.md` frontmatter parses. |
| Production advisor code unchanged | PASS | 4 dirty files confirmed as parallel-session state or vitest side-effect via mtime check |
| Parity test delta | PASS | IMPROVED from 5 failures to 4 |
| Vitest skill_advisor (parity test target) | PARTIAL | 4 residual pre-existing failures. Original target of 3 not met. Residual 4 deferred to child 003. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modified (was empty stub) | Rewritten to 182 LOC with full frontmatter and ADR-001 semantics |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modified (was empty stub) | Rewritten to 104 LOC aligned to ADR-001 shape |
| `.opencode/skills/system-skill-advisor/README.md` | Modified (was empty stub) | Rewritten to 111 LOC aligned to ADR-001 shape |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Added (NEW) | 60 LOC stub referencing child 004 launcher |
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | Added (NEW) | 181 LOC with intent signals, depends_on, related_to |
| `.opencode/skills/system-skill-advisor/references/db-path-policy.md` | Added (NEW) | 64 LOC DB-path constraint document |
| `.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md` | Added (NEW) | 46 LOC ADR-001 legacy-bridge reference |
| `.opencode/skills/system-skill-advisor/references/standalone-mcp-shape.md` | Added (NEW) | 50 LOC ADR-001 standalone-MCP contract reference |
| `.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md` | Added (NEW) | 56 LOC catalog index with one MCP surface entry |
| `.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md` | Added (NEW) | 65 LOC illustrative catalog entry |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Added (NEW) | 84 LOC playbook index |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md` | Added (NEW) | 78 LOC happy-path scenario |
| `.opencode/skills/system-skill-advisor/mcp_server/README.md` | Added (NEW) | 16 LOC drop-target stub for child 003 |
| `.opencode/skills/system-skill-advisor/mcp_server/database/.gitkeep` | Added (NEW) | Placeholder for future DB directory |

### Follow-Ups

- Complete the runtime move in child 003. This scaffold phase authored no production code changes. The actual source and DB move belongs to child 003.
- Resolve the 4 remaining parity test failures in child 003 alongside the runtime move. The residual failures are pre-existing and unrelated to the empty-stub collateral resolved here.
- Populate `feature_catalog/` and `manual_testing_playbook/` with full mirror content in child 003 alongside source movement. The current one-entry seeds are illustrative placeholders only.
- Revisit the three `references/` documents as child 003 implementation reveals constraints. The files were authored from ADR-001 principles without live runtime data.
