---
title: "Regression-Harness Alias-Awareness and Stale Test Path Fix"
description: "Regression harness gold-matching now resolves skill alias drift so renamed skills satisfy fixtures labelled with their old aliases. The lane-weight-sweep test anchors on a stable workspace marker after a packet reorganization removed its previous path."
trigger_phrases:
  - "harness alias awareness"
  - "regression harness alias drift"
  - "lane weight sweep stale path"
  - "skill advisor alias groups"
  - "deep- alias resolution"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/007-harness-alias-and-stale-path` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation`

### Summary

Both regression harnesses compared gold labels with strict string equality, so fixtures labelled with old skill aliases (sk-deep-research, sk-deep-review) failed against the live deep- skill identifiers after a rename. The alias groups in both Python and TypeScript registries were incomplete. The Python groups lacked the sk-deep- entries and neither language had a deep-agent-improvement group. Completing those groups and switching both harnesses to use the existing alias-aware comparison helpers cleared the alias drift without editing the ground-truth fixtures.

### Added
- The deep-agent-improvement alias group in the TypeScript alias registry.
- The sk-deep-research and sk-deep-review entries in the Python deep-research and deep-review alias groups, plus a new deep-agent-improvement alias group in Python.

### Changed
- The Python regression harness gold-matching now uses skill_matches_alias for alias-aware comparison instead of strict string equality.
- The TypeScript regression harness gold-matching now uses skillInAliasSet for alias-aware comparison instead of strict string equality.
- The lane-weight-sweep test resolves the workspace root from the skill package.json instead of a deleted packet path, and sweep reports write to a gitignored skill-local directory instead of recreating stale folders.

### Fixed
- None.

### Verification
- Python regression P0: 12/12, no regression.
- Python deep- alias rows: failures reduced from 13 to 6. RESEARCH-001/002, REVIEW-003/005, and PHRASE-002/003/005 all pass. Top-1 accuracy 0.95.
- TypeScript regression P0: 12/12, no regression.
- TypeScript deep- alias rows: RESEARCH-001/002, REVIEW-003, and PHRASE-003 pass (5 of 7 named rows).
- Full TypeScript vitest: 66/66 files pass, 451 passed, 4 skipped. lane-weight-sweep no longer errors.
- TypeScript compilation (tsc --noEmit): clean.
- All 10 task items completed.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Modified | Added the deep-agent-improvement alias group |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modified | Added sk-deep-research and sk-deep-review to existing alias groups and created a new deep-agent-improvement group |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py` | Modified | Switched gold-matching to skill_matches_alias for alias-aware comparison |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts` | Modified | Switched gold-matching to skillInAliasSet for alias-aware comparison |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/lane-weight-sweep.vitest.ts` | Modified | Anchored workspace root resolution on the skill package.json and redirected sweep reports to a gitignored directory |
| `.gitignore` | Modified | Ignored generated sweep-reports directory |

### Follow-Ups
- TypeScript abstains on P1-PHRASE-002 ("5d scoring") and P1-PHRASE-005 ("dynamic profile"). These still fail in the TypeScript harness but not from alias drift. The TypeScript scorer assigns them confidence below 0.8 and abstains, so there is no top result to alias-match. Python routes them via phrase boosters that TypeScript lacks. Closing this is a scorer-confidence parity change, which this phase explicitly excludes. Tracked as a separate parity item.
- Remaining non-alias P1 cases (P1-MCP-002, P1-OPENCODE-001, P1-FULLSTACK-001, P1-REVIEW-004, P1-PHRASE-004, P1-PHRASE-007) are genuine routing or abstention cases unrelated to alias drift and out of this phase scope.
