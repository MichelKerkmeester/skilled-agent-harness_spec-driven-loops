---
title: "Phase 004: skill-advisor-affordance-evidence"
description: "Skill Advisor added sanitized tool and resource affordance evidence through existing derived and graph-causal lanes without adding a public request surface."
trigger_phrases:
  - "phase 004 changelog"
  - "skill advisor affordance evidence"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-4-2026-05-26-reorg/004-external-project-adoption-dissolved` (Level 2)
> Parent packet: `002-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

Phase 004 let Skill Advisor use sanitized tool and resource affordance hints without expanding graph vocabulary. The normalizer strips or drops risky text and keeps scoring inside existing `derived_generated` and `graph_causal` lanes. Python compiler support projects `derived.affordances[]` into existing signals and adjacency. Public `advisor_recommend` input did not gain a caller-supplied affordance field because that would reopen prompt-stuffing risk.

### Added

- TypeScript affordance normalizer with allowlisted structured fields.
- Scorer option support for raw affordances before lane scoring.
- Python compiler support for `derived.affordances[]`.
- Focused TypeScript and Python regression tests.
- Catalog and manual playbook entries for the feature.

### Changed

- `derived.ts` can add low-weight sanitized evidence under `derived_generated`.
- `graph-causal.ts` can use request-local affordance edges with existing multipliers.
- `fusion.ts` normalizes affordances before scoring.
- Review remediation later documented the public-input defer decision in `AdvisorRecommendInputSchema`.

### Fixed

- Tool and resource hints no longer had to be ignored completely for routing recall.
- Free-form descriptions no longer became trigger sources.
- URLs, email addresses, token-shaped fragments, control characters and instruction-shaped text are stripped or dropped.
- Review remediation later broadened the denylist and shared adversarial fixtures across TypeScript and Python tests.

### Verification

- `npm run build` from `.opencode/skills/system-spec-kit` passed.
- `npm run typecheck` from `.opencode/skills/system-spec-kit/mcp_server` passed.
- Focused Skill Advisor Vitest affordance and scorer tests passed: 4 files, 20 tests.
- Python Skill Advisor suite passed: 53 pass, 0 fail.
- Strict spec validation passed after template normalization.
- Git history for this directory includes `131b57f3a8` and `40dcf80052`.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` | Normalized structured affordance inputs. |
| `mcp_server/skill_advisor/lib/scorer/types.ts` | Added raw affordance scorer option. |
| `mcp_server/skill_advisor/lib/scorer/fusion.ts` | Normalized affordances before lane scoring. |
| `mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | Added sanitized `derived_generated` evidence. |
| `mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Added request-local edges through existing multipliers. |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | Compiled `derived.affordances[]`. |
| `mcp_server/skill_advisor/tests/affordance-normalizer.test.ts` | Normalizer behavior coverage. |
| `mcp_server/skill_advisor/tests/lane-attribution.test.ts` | No-new-lane attribution coverage. |
| `mcp_server/skill_advisor/tests/routing-fixtures.affordance.test.ts` | Recall lift and precedence coverage. |

### Follow-Ups

- Full Skill Advisor directory still had unrelated failures in local hook and metadata fixtures.
- 008 research later found TypeScript and Python parity gaps around `conflicts_with`.
