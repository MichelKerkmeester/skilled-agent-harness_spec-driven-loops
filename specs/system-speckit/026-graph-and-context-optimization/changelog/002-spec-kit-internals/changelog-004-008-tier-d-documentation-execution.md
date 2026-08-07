---
title: "Devin hooks migration, OLD hook deprecation banners, and playbook cross-reference table delivered"
description: "Executed three Tier D documentation items: migrated Devin hooks configuration to new skill-owner paths, added deprecation banners to all four OLD hook README files, and added a catalog/playbook cross-reference table to the playbook root."
trigger_phrases:
  - "tier d documentation execution"
  - "devin hooks migration"
  - "old hook deprecation banners"
  - "playbook cross-reference table"
  - "008 tier d changelog"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/008-tier-d-documentation-execution` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor`

### Summary

Three Tier D documentation items from the 007 deferred decisions list were completed. The Devin hooks configuration file was migrated to point UserPromptSubmit and SessionStart to their correct new skill-owner paths. Deprecation banners with a 90-day removal window were added to all four OLD hook README directories. A cross-reference table mapping all seven catalog groups to playbook sections was added to the playbook root. Two remaining Tier D items stay as they are per the deferred decisions recommendations.

### Added

- Deprecation banner README for the OLD Devin hook location (this file was previously missing)
- Catalog to playbook cross-reference table in section 17.5 of the manual testing playbook

### Changed

- Devin hooks configuration file updated to route UserPromptSubmit to the system-skill-advisor hook and SessionStart to the system-code-graph hook
- Three existing OLD hook README files updated with deprecation banners and a 90-day removal target
- Deferred decisions document updated to mark F4, F6, and F37 as completed

### Fixed

- None.

### Verification

- `.devin/hooks.v1.json` JSON.parse passed with "JSON parses OK"
- UserPromptSubmit path verified to exist at the new system-skill-advisor location (7002 bytes)
- SessionStart path verified to exist at the new system-code-graph location (8657 bytes)
- All four OLD hook README files carry the "DEPRECATED 2026-05-16" banner
- Playbook section 17.5 contains nine mapping rows covering all seven catalog groups and two playbook-only categories
- `validate.sh --strict` on 008 returned zero errors and zero warnings
- `validate.sh --strict` on all nine packets (parent plus 001 through 008) returned all green

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.devin/hooks.v1.json` | Modified | Routed UserPromptSubmit to the system-skill-advisor hook dist path and SessionStart to the system-code-graph hook dist path |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md` | Modified | Added deprecation banner with a 90-day removal window |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md` | Modified | Added deprecation banner with a 90-day removal window |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md` | Modified | Added deprecation banner with a 90-day removal window |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/README.md` | Created | Created with deprecation banner (file was previously missing from this location) |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Modified | Added cross-reference table in section 17.5 mapping all seven catalog groups and two playbook-only categories to playbook sections |
| `.opencode/skills/system-skill-advisor/references/deferred-decisions.md` | Modified | Marked F4, F6, and F37 as Done with packet 008 citation while preserving original sections as history |

### Follow-Ups

- Devin runtime must restart to pick up the new hook paths from `.devin/hooks.v1.json`
- OLD hook directory removal can proceed after the 90-day deprecation window elapses (target: 2026-08-16) once no remaining consumers point at the old paths
- F35 and F36 remain status quo per deferred decisions document sections 5 and 6
