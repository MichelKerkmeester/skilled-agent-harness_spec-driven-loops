---
title: "Skill Advisor Affordance Evidence: Allowlist Normalizer and Lane Integration"
description: "Affordance hints from tools and resources can now flow into Skill Advisor scoring through a privacy-preserving normalizer. All scoring stays within existing derived_generated and graph_causal lanes. No new scoring lane was introduced."
trigger_phrases:
  - "skill advisor affordance evidence"
  - "affordance normalizer allowlist"
  - "tool resource routing evidence"
  - "derived generated affordance scoring"
  - "graph causal affordance edges"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/003-skill-advisor-affordance-evidence` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

Skill Advisor's compiler allowlist was limited to five entity kinds and could not consume affordance hints from tools or resources. Free-form descriptions from those sources posed a prompt-stuffing risk if passed directly into scoring. An allowlist normalizer was added that strips privacy-sensitive text and extracts only structured fields before forwarding evidence to the existing `derived_generated` and `graph_causal` lanes. The change improves candidate recall for tool-aware routing without widening the graph schema or leaking raw matched phrases in recommendation payloads.

### Added

- `affordance-normalizer.ts`: typed allowlist filter and privacy stripper for affordance inputs
- `AffordanceInput` and `NormalizedAffordance` types in `types.ts`
- Low-weight sanitized affordance evidence under the `derived_generated` lane in `derived.ts`
- Request-local affordance edges with existing multipliers in the `graph_causal` lane in `graph-causal.ts`
- Compile-time `derived.affordances[]` support in the Python `skill_graph_compiler.py`
- `affordance-normalizer.test.ts`: unit tests covering allowlist behavior and privacy stripping
- `lane-attribution.test.ts`: tests confirming no new scoring lane is introduced
- `routing-fixtures.affordance.test.ts`: fixture tests covering recall lift and explicit trigger precedence
- Feature catalog entry for the affordance evidence capability (DQI 87)
- Manual testing playbook entry for validation scenario coverage (DQI 91)

### Changed

- `fusion.ts`: affordances are normalized before they reach lane scoring
- `skill_graph_compiler.py`: `derived.affordances[]` now compiles into existing derived signals and sparse adjacency without adding new entity kinds

### Fixed

- Free-form affordance descriptions were not guarded against prompt-stuffing input. The normalizer now ignores `description` fields and strips instruction-shaped strings before any scoring occurs.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` from `.opencode/skills/system-spec-kit` | PASS |
| `npm run typecheck` from `.opencode/skills/system-spec-kit/mcp_server` | PASS |
| Focused Skill Advisor Vitest affordance/native scorer tests | PASS: 4 files, 20 tests |
| Python Skill Advisor suite | PASS: 53 pass, 0 fail |
| Static `ALLOWED_ENTITY_KINDS` scan | PASS: `{"skill", "agent", "script", "config", "reference"}` |
| Static `EDGE_MULTIPLIER` scan | PASS: `enhances`, `siblings`, `depends_on`, `prerequisite_for`, `conflicts_with` |
| sk-doc DQI for feature catalog entry | PASS: 87 |
| sk-doc DQI for manual playbook entry | PASS: 91 |
| Strict spec validation | PASS after template normalization |

Full `vitest run skill_advisor/tests/` recorded 6 unrelated failures from `.claude/settings.local.json` repo-root drift and `mcp-code-mode/graph-metadata.json` referencing a missing `mcp_server/package.json`. All packet-owned tests pass.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` | Created (NEW) | Allowlist filter and privacy normalizer for structured affordance inputs |
| `mcp_server/skill_advisor/lib/scorer/types.ts` | Modified | Added raw affordance input option to scorer types |
| `mcp_server/skill_advisor/lib/scorer/fusion.ts` | Modified | Normalize affordances before lane scoring runs |
| `mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | Modified | Consume sanitized affordance triggers under `derived_generated` |
| `mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Modified | Consume sanitized affordance edges with existing relation multipliers |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | Modified | Compile `derived.affordances[]` into existing signals and adjacency |
| `mcp_server/skill_advisor/tests/affordance-normalizer.test.ts` | Created (NEW) | Allowlist and privacy behavior tests |
| `mcp_server/skill_advisor/tests/lane-attribution.test.ts` | Created (NEW) | No-new-lane attribution tests |
| `mcp_server/skill_advisor/tests/routing-fixtures.affordance.test.ts` | Created (NEW) | Recall lift and explicit precedence fixture tests |
| `feature_catalog/11--scoring-and-calibration/24-skill-advisor-affordance-evidence.md` | Created (NEW) | Feature capability documentation |
| `manual_testing_playbook/11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md` | Created (NEW) | Manual validation scenario |

### Follow-Ups

- The full Skill Advisor test directory is not green in this checkout. The 6 failing files are outside this packet's scope. Address `.claude/settings.local.json` repo-root drift and the missing `mcp-code-mode/graph-metadata.json` package reference in a dedicated health-fix pass.
- Affordance evidence is intentionally weak by design. It improves candidate recall but does not override explicit author trigger signals. Consider a follow-on benchmark to measure the actual recall delta across a broader routing fixture corpus.
