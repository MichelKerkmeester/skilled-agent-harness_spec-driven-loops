---
title: "Template Levels Phase 010/002: Template greenfield redesign"
description: "A 9-iteration deep-research loop rejected the PARTIAL backward-compat framing and converged on a C+F hybrid manifest-driven design. The redesign eliminates the Level 1/2/3/3+ taxonomy in favor of orthogonal capability flags, introduces lazy command-owned addons, and drives both scaffolder and validator from a single manifest. ADR-001 through ADR-005 formalize the architecture."
trigger_phrases:
  - "phase 010/002 changelog"
  - "template greenfield redesign"
  - "C+F hybrid"
  - "capability flags"
  - "manifest-driven design"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/002-manifest-driven-template-design` (Level 3)
> Parent packet: `026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

The user explicitly rejected the PARTIAL backward-compat framing from phase 001 and asked for a greenfield design that prioritizes simplification. A 9-iteration deep-research loop (cli-codex gpt-5.5 high fast) explored 5 candidate designs (F, C+F hybrid, B, D, G) and converged at iteration 9 (newInfoRatio 0.06).

The chosen design is **C+F hybrid manifest-driven**: eliminate the Level 1/2/3/3+ taxonomy, replace it with three orthogonal axes (kind + capabilities + presets), distinguish human-authored scaffold docs from command/agent-owned lazy addons, and drive both scaffolder and validator from a single source-of-truth manifest (`spec-kit-docs.json`). The design collapses 86 source files down to approximately 15 in `templates/manifest/`.

Five ADRs formalize the decisions: ADR-001 (C+F hybrid chosen), ADR-002 (manifestVersion exact-match policy), ADR-003 (template contract on spec.md only), ADR-004 (phase-parent scaffolds parent only), and ADR-005 (workflow-invariance constraint: preset/capability/kind vocabulary is strictly private, never exposed to users or AI).

### Added

- `research/research.md` (40.9 KB, 17 sections) with synthesized findings, design scoring, and concrete refactor steps.
- `research/resource-map.md` (11.5 KB) with file-by-file blast radius for the follow-on implementation.
- Cross-validation artifacts from claude+copilot merged scope analysis.
- `decision-record.md` with ADR-001 through ADR-005 (5/5 Five Checks PASS).
- `plan.md` with 4 concrete implementation phases (ADD manifest+resolver+renderer+CI-test, MODIFY scaffolder, MODIFY validators, DELETE legacy).
- Deep-review artifacts: 5 iterations and a review report.

### Changed

- Nothing in production code. This packet was investigation-only. The plan it produced drives phase 003.

### Fixed

- Nothing. No production bugs were addressed.

### Verification

- `validate.sh --strict` passed on the scaffolded packet.
- Deep-research loop converged (9 iterations, newInfoRatio 0.06).
- All 10 design questions (Q1-Q10) answered with cited evidence.

### Files Changed

| File | What changed |
|------|--------------|
| `002-manifest-driven-template-design/spec.md` | Greenfield spec with 10 requirements, 5 user stories, 5 candidate designs |
| `002-manifest-driven-template-design/plan.md` | 4-phase implementation plan (ADD, MODIFY scaffolder, MODIFY validators, DELETE legacy) |
| `002-manifest-driven-template-design/tasks.md` | 19 tasks across 3 phases |
| `002-manifest-driven-template-design/decision-record.md` | ADR-001 through ADR-005 |
| `002-manifest-driven-template-design/checklist.md` | Verification gates |
| `002-manifest-driven-template-design/implementation-summary.md` | Research outcomes summary |
| `002-manifest-driven-template-design/research/research.md` | 40.9 KB synthesized findings |
| `002-manifest-driven-template-design/research/resource-map.md` | 11.5 KB file inventory |
| `002-manifest-driven-template-design/research/iterations/` (14 files) | Iterative research output |
| `002-manifest-driven-template-design/research/prompts/` (14 files) | Iteration prompts |
| `002-manifest-driven-template-design/research/deltas/` (14 files) | Delta records |
| `002-manifest-driven-template-design/review/` (5 iterations + report) | Deep review of research |

Three commits touched this phase: `e933c152a7`, `79e97aec92`, `bdb739d973`.

### Follow-Ups

- **Phase 003 (greenfield implementation).** Executes the 4-phase plan from this research output.
- **Phase 004 (deferred followups).** Addresses 10 Gate 7 items deferred from the 003 implementation.
- **Phases 005-008.** Audit and alignment sweeps for skill references, command assets, fleet markers, and archive markers.