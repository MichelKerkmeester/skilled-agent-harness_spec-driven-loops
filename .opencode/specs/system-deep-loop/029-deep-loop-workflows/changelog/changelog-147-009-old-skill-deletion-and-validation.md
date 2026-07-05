---
title: "Changelog: Old-skill deletion and full-surface validation [147-deep-loop-workflows/009-old-skill-deletion-and-validation]"
description: "Chronological changelog for the old-skill deletion and full-surface validation phase."
trigger_phrases:
  - "phase changelog"
  - "old skill deletion"
  - "doctor deep-loop"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/deep-loops/029-deep-loop-workflows/009-old-skill-deletion-and-validation` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/029-deep-loop-workflows`

### Summary

Packet-156 deep review found the missing guard in phase 009. The headline B1 gate said `/doctor deep-loop` must probe the council graph, `council-graph.sqlite`, not only the deep-loop coverage graph, but that probe had not shipped even though destructive deletion of the five old skills had. This slice added the missing probe and reconciled the checklist to what was genuinely verified.

### Added

- CHK-060 Skill graph rebuild passes with `rejectedEdges=0`.
- `decision-record.md` records the CHK-065 descope. Byte-identical phase-001 parity replay is unrecoverable because the pre-merge baseline sits at rewritten paths, so substitute behavioral-parity evidence was accepted.

### Changed

- CHK-002 Phase-001 parity baseline available.
- CHK-020 Phase 001 baseline evidence exists and covers 5 modes, 8 commands, advisor routing and Lane-D dry-run parity.
- CHK-022 `deep-loop-workflows` has exactly one hub `graph-metadata.json` and no per-mode graph metadata.
- CHK-023 `/doctor deep-loop` covers both `deep-loop-graph.sqlite` and `council-graph.sqlite`.
- CHK-024 Route validation passes.
- CHK-025 Runtime council graph status, query and convergence smoke checks pass.
- `checklist.md` marks CHK-060 verified and CHK-065 descoped on top of the prior twelve. Four process gates, CHK-001, CHK-010, CHK-021 and CHK-030, stay circumstantial. Summary moved to 13 of 18 P0.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| CHK-022 one hub graph metadata | PASS: one hub `graph-metadata.json` verified. |
| CHK-023 B1 council-graph probe | PASS: `/doctor deep-loop` probes `council-graph.sqlite`. |
| CHK-024 route validation | PASS: route validation passed. |
| CHK-025 council status, query and convergence smoke | PASS: status, query and convergence smoke checks passed. |
| CHK-026 five old directories deleted | PASS: five old directories deleted. |
| CHK-064 convergence loop types | PASS: convergence loop types verified. |
| Both edited YAML files | PASS: both edited YAML files passed. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | Modified | Added council scope, council-graph probe and staleness checks, `ai-council/**` inventory, council convergence sampling and council replay recommendation. |
| `.opencode/commands/doctor/_routes.yaml` | Modified | Widened `deep-loop` allowed flags for scoped deep-loop checks. |
| `checklist.md` | Modified | Marked CHK-060 verified with `skill_graph_scan` `rejectedEdges=0` and CHK-065 descoped through `decision-record.md`. |
| `decision-record.md` | Created | ADR-001 records the CHK-065 descope and accepts substitute behavioral-parity evidence. |

### Follow-Ups

- CHK-001 Predecessor: phase 008 green and continuity read.
- CHK-010 Edits stay in this phase's frozen scope, with no adjacent cleanup.
- CHK-011 Changes follow existing project conventions.
- CHK-021 Phase 008 handoff is green before deletion.
- CHK-065 Full phase-001 parity rerun is byte-identical for all five modes and eight commands.
- CHK-030 No secrets introduced.
