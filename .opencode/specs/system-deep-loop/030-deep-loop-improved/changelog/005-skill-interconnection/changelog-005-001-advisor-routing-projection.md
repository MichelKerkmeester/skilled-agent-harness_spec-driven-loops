---
title: "Changelog: Advisor Routing Projection Generator and workflowMode Publication [005-skill-interconnection/001-advisor-routing-projection]"
description: "Chronological changelog for the Advisor Routing Projection Generator and workflowMode Publication phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/005-skill-interconnection/001-advisor-routing-projection` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-deep-loop-improved/005-skill-interconnection`

### Summary

Auto-generated alias projection from the mode-registry with a hash drift-guard, and published the resolved workflowMode in advisor responses. 29 advisor tests pass; typecheck/drift green.

### Added

- No new additions recorded.

### Changed

- Auto-generated alias projection from the mode-registry with a hash drift-guard, and published the resolved workflowMode in advisor responses. 29 advisor tests pass; typecheck/drift green.

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Modified | advisor registry-projection drift guard + workflowMode |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Modified | advisor registry-projection drift guard + workflowMode |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Modified | advisor registry-projection drift guard + workflowMode |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modified | advisor registry-projection drift guard + workflowMode |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Modified | advisor registry-projection drift guard + workflowMode |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts` | Modified | advisor registry-projection drift guard + workflowMode |
| `.opencode/commands/create/assets/create_parent_skill_auto.yaml` | Modified | advisor registry-projection drift guard + workflowMode |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
