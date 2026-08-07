---
title: "AI Council Strategy: Deep Skills Reference And Asset Alignment Audit"
description: "Single-round in-CLI council audit of completed documentation/resource-alignment work across deep-ai-council, deep-research, and deep-review."
created: "2026-05-24T18:00:00Z"
---

# AI Council Strategy

## Purpose

Audit the Phase 8 validation gate of the deep skills reference and asset alignment work. Three internal seats (all DeepSeek v4 pro via OpenCode CLI) inspect contract agreements, failure modes, and release readiness across the target packet and three deep skill trees.

## Task Framing

**Scope**: Target phase packet `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/003-reference-asset-alignment` and three deep skill packages: `deep-ai-council`, `deep-research`, `deep-review`.

**Question**: Is the documentation/resource alignment work release-ready as-is, or are there blockers that need patching before Phase 9 approval?

## Selected Lenses

| Seat | Lens | Vantage | Mandate |
|---|---|---|---|
| Seat 001 | Analytical | DeepSeek v4 pro | Contract auditor — verify every cross-reference claim against file inventory |
| Seat 002 | Critical | DeepSeek v4 pro | Failure-mode reviewer — find the worst plausible consequence of every inconsistency |
| Seat 003 | Pragmatic | DeepSeek v4 pro | Release integrator — assess from operator workflow perspective |

## Evidence Inputs

- Target packet: spec.md, plan.md, checklist.md, implementation-summary.md, validation-report.md, decision-record.md
- deep-ai-council: README.md (v2.2.0.0), SKILL.md, references/convergence_signals.md, assets/deep_ai_council_config.json, scripts/lib/persist-artifacts.cjs, changelog/v2.2.0.0.md
- deep-research: README.md (v1.13.0.0), SKILL.md, references/state_reducer_registry.md, assets/deep_research_config.json, scripts/reduce-state.cjs, changelog/v1.13.0.0.md
- deep-review: README.md (v1.10.1.0), SKILL.md, references/convergence_signals.md, references/state_outputs.md, references/state_reducer_registry.md, changelog/v1.10.1.0.md

## Convergence Rule

Default `two-of-three-agree`: two of three seats must endorse the same essential plan with no high-severity blocker from cross-critique.

## Known Constraints

- External AI vantages unavailable; all seats are DeepSeek v4 pro, honestly labeled as same-vantage internal deliberation.
- Council is planning-only; writes stay under `ai-council/**`.
- Phase 9 deep-research iterations are out of scope for this audit.
