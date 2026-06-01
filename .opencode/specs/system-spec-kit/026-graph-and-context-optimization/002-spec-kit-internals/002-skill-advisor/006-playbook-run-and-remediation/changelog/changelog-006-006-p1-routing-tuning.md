

---
title: "Skill Advisor P1 Routing and Abstention Tuning"
description: "Fixed 5 root-cause classes of residual non-alias P1 regression failures across both the TypeScript and Python scorers. Both regression harnesses now report 0 failures across all 50 cases."
trigger_phrases:
  - "p1 routing tuning"
  - "skill advisor p1 failures"
  - "scorer routing abstention tuning"
  - "phase changelog"
  - "nested changelog"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/006-p1-routing-tuning` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation`

### Summary

Fixed 5 root-cause classes of residual non-alias P1 regression failures across both the TypeScript and Python scorers. The fixes cover terse-phrase routing, CLI-vs-skill disambiguation, breadth abstention, deep-loop colon syntax, and review-target disambiguation. Both regression harnesses now report 0 failures across all 50 cases with P0 at 12/12 each.

### Added

- None.

### Changed

- Domain anchors for terse multi-token phrases (mcp-code-mode webflow/cms, deep-agent-improvement 5d scoring/integration scan/dynamic profile, system-code-graph structural search) now route directly in both scorers via the direct-evidence lane and primaryIntentBonus ranking.
- Breadth abstention floors the code-like top candidate uncertainty for broad greenfield builds and multi-concern optimizations in both scorers. The gate is narrowly gated with narrow-anchor and single-concern bypass paths.

### Fixed

- Class B code-edit disambiguator resolves the CLI-vs-skill conflict so code-edit prompts with no explicit CLI invocation route to sk-code instead of cli-opencode. Fixes OPENCODE-001.
- Class E correction ensures "code audit" routes to sk-code-review over deep-review in the TypeScript scorer. Python was already correct.
- Adversarial routable guards P2-BREADTH-GUARD-001 and P2-BREADTH-GUARD-002 added to the regression fixture set to lock in the over-abstention boundary.

### Verification

- Regression suite (both scorers): 0 failures / 50 cases, P0 12/12 each
- Adversarial routable guards: route to sk-code without over-abstention
- Targets abstain: "build full stack typescript service" and the multi-concern optimize case both abstain correctly
- Parity + corpus tests: green (vitest 66/66, 4 skipped)
- Python unit suite: 57/57
- tsc --noEmit and alignment verifier: clean and passing

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.../lib/scorer/lanes/explicit.ts` | Modify | Class A and D direct-evidence phrase anchors |
| `.../lib/scorer/fusion.ts` | Modify | Class A, C, D, and E ranking logic plus breadth abstention |
| `.../lib/scorer/scoring-constants.ts` | Modify | New routing constants |
| `.../scripts/skill_advisor.py` | Modify | Class A booster calibration, Class B code-edit disambiguator, Class C breadth abstention, Class D phrases |
| `.../scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modify | Adversarial routable guards P2-BREADTH-GUARD-001 and P2-BREADTH-GUARD-002 |

### Follow-Ups

- Class C abstention is intentionally narrow. It fires only when the would-be top is code-like and the prompt is a broad greenfield build with no narrow anchor or a multi-concern optimization with two distinct concern classes. Genuinely terse prompts that the scorer already cannot route confidently abstain for low-confidence reasons unrelated to this gate.
- Signals are domain-meaningful, but the corpus is small. Anchors target specific multi-token phrases and were verified against the 50-case regression suite and the 193-row corpus parity tests, not just the failing rows. The adversarial guards lock in the over-abstention boundary.
