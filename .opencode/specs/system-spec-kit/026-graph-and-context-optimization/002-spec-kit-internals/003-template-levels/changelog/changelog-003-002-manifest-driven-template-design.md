

---
title: "Template Backend Greenfield Redesign Research Complete"
description: "A 9-iteration autonomous deep-research loop converged on a C+F hybrid manifest-driven design that reduces the spec-kit template surface from 86 source files to 15 while eliminating the Level 1/2/3/3+ taxonomy."
trigger_phrases:
  - "template greenfield redesign research"
  - "manifest driven template design"
  - "capability flags template system"
  - "lazy addon lifecycle"
  - "spec-kit template backend"
importance_tier: "important"
contextType: "research"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/002-manifest-driven-template-design` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

A 9-iteration autonomous deep-research loop converged on a C+F hybrid manifest-driven greenfield template system. The design takes the spec-kit template surface from 86 source files to 15 while eliminating the Level 1/2/3/3+ taxonomy entirely. The chosen design replaces the level scalar with three orthogonal axes (kind plus capabilities plus presets), gives every addon doc an explicit lifecycle owner so stale empty stubs never appear in fresh packets, and drives both the scaffolder and the validator from a single manifest so they cannot drift. The synthesis lives in research/research.md (40.9 KB, 17 sections). Concrete refactor phases are in plan.md. ADR-001 plus ADR-002/003/004 capture the decisions in decision-record.md.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- Deep-research convergence: converged at iter 9, newInfoRatio 0.06 less than threshold 0.10
- 17-section synthesis written: research/research.md 40.9 KB
- Resource map emitted: research/resource-map.md 11.5 KB
- All 10 design questions answered: Q1 through Q10 closed with cited evidence per question
- 5 candidate designs scored: F/B/D/G eliminated with reasoning, C+F hybrid winner
- 3 final open items resolved: ADR-002 (manifest version) plus ADR-003 (template-contract location) plus ADR-004 (phase-parent scaffolding)
- ADR-001 finalized plus Five Checks: 5 out of 5 PASS
- Workflow-invariant constraint pass (iters 10-14): converged at iter 14, newInfoRatio 0.08, ADR-005 added (5 out of 5 Five Checks PASS)
- Cross-validation by independent agent: cli-copilot gpt-5.5 analysis materially refined the design
- 11 public surfaces audited (iter 12): only 2 minor leaks, both fixed in Phase 1 implementation
- 5 AI-conversation scenarios dry-run (iter 13): all 5 preserve level-only vocabulary in user-visible turns

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `spec.md` | Created | Feature specification with greenfield framing, 10 research questions, 5 candidate designs |
| `plan.md` | Created | 3-phase refactor plan with ADR-001 through ADR-004 |
| `decision-record.md` | Created | Architecture decision records ADR-001 through ADR-005 |
| `implementation-summary.md` | Created | Post-convergence outcome documentation |
| `research/research.md` | Created | 40.9 KB synthesis across 17 sections |
| `research/resource-map.md` | Created | 11.5 KB resource mapping |

### Follow-Ups

- None.
