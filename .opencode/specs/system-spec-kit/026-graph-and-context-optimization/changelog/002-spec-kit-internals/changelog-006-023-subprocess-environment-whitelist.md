---
title: "Subprocess Environment Whitelist for Skill Advisor"
description: "Hardens the three named advisor subprocess spawn surfaces with explicit environment allowlists and tests that parent secrets do not leak."
trigger_phrases:
  - "018 subprocess env follow-on"
  - "subprocess env whitelist"
  - "advisor env hardening"
  - "skill advisor subprocess environment"
  - "child process env allowlist"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/023-subprocess-environment-whitelist` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The skill advisor launcher, plugin bridge, and Python native bridge each inherited the full parent environment when spawning child processes. This could leak unrelated credentials or operator state into subprocesses. Each spawn surface now passes only runtime-essential environment keys through an explicit allowlist. Tests confirm that secret-like parent keys are not forwarded.

### Added
- Environment variable allowlist enforcement across the three named advisor subprocess spawn surfaces, the launcher, the plugin bridge, and the Python native bridge.

### Changed
- Child process spawn in the skill advisor launcher, plugin bridge, and Python native bridge now passes only runtime-essential environment keys instead of inheriting the full parent environment.
- Advisor tests now assert that secret-like parent environment keys are excluded from child process environments.

### Fixed
- Potential disclosure of unrelated environment variables through uncontrolled parent environment inheritance in advisor subprocess spawn paths.

### Verification
- Focused packet tests passed for all three modified spawn surfaces
- Full advisor Vitest passed with 54 files, 371 tests passed, and 4 skipped
- Strict validation passed for all new packet folders

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Created child env allowlist for npm build and server spawn |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modify | Passed allowlisted env to `StdioClientTransport` |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Passed allowlisted env to the Node native bridge |
| Advisor tests | Modify | Asserted secret-like parent env keys are not forwarded |

### Follow-Ups
- The allowlist intentionally does not cover unrelated subprocesses outside the three named surfaces.
