---
title: "advisor_validate Alias-Aware Gold Matching"
description: "advisor_validate gold matching now resolves skill aliases so legacy corpus labels match live graph IDs, recovering the accuracy metric from 50.78%/42.5% to 74.09%/65.0%."
trigger_phrases:
  - "advisor_validate alias matching"
  - "F1a corpus accuracy fix"
  - "skill-id drift gold matching"
  - "advisor validate gold comparison"
  - "advisor validate accuracy recovery"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/001-advisor-validate-alias-matching` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation`

### Summary

The advisor_validate gold matching logic compared recommended skill IDs against corpus expected labels using strict equality, causing 53 of 193 rows labelled with legacy skill IDs (sk-deep-research, sk-deep-review) to fail against the live graph IDs. The reported accuracy dropped to 50.78% full-corpus and 42.5% holdout. Gold matching now resolves both sides through `skillMatchesAlias` from the alias groups before comparison, restoring the metric to 74.09% full-corpus and 65.0% holdout with no scorer change.

### Added

- None.

### Changed

- Gold matching in advisor_validate now resolves skill IDs through `skillMatchesAlias` from the alias groups at both match sites, replacing strict equality comparison.

### Fixed

- None.

### Verification

- advisor_validate full-corpus accuracy: 74.09% (from 50.78%), holdout accuracy: 65.0% (from 42.5%)
- No previously-passing row regresses (parity tests green)
- tsc and advisor-validate vitest: clean, pass

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts` | Modify | Alias-aware comparison at both gold-match sites using skillMatchesAlias |

### Follow-Ups

- Eight drifted rows still fail after alias normalization, a prompt-quality vs scorer triage item, not an alias defect.
- Alias-awareness in skill_advisor_regression.py and evaluateRegressionCases shipped later in phase 007.
