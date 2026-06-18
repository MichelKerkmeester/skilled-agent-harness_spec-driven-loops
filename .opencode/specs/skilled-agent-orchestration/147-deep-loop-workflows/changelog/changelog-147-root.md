---
title: "Changelog: Deep loop workflows root [147-deep-loop-workflows/root]"
description: "Root changelog for the completed deep-loop-workflows consolidation packet."
trigger_phrases:
  - "147 root changelog"
  - "deep-loop workflows root"
  - "consolidation changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows` (Level Phase Parent)

### Summary

Spec 147 turned five public deep-loop skills into one `deep-loop-workflows` hub with five mode packets, one advisor identity and one frozen `deep-loop-runtime` backend. The packet preserved command and agent names while moving the references underneath them, then collapsed advisor graph routing onto the merged node through mode aliases and discriminators. It finished by deleting the old skills, adding the missing `/doctor deep-loop` council graph probe and running a separate system review that found zero P0 issues and left three P1 remediation items outside this packet.

### Included Phases

| Phase | Status | Summary |
|-------|--------|---------|
| [`001-parity-baseline-and-runtime-ownership-adr`](./changelog-147-001-parity-baseline-and-runtime-ownership-adr.md) | Complete | Established the parity baseline and runtime ownership record with no live skill changes. |
| [`002-runtime-backend-promotions`](./changelog-147-002-runtime-backend-promotions.md) | Complete | Promoted shared plumbing into `deep-loop-runtime` while old public entrypoints stayed byte-compatible shims. |
| [`003-merged-hub-and-mode-packets`](./changelog-147-003-merged-hub-and-mode-packets.md) | Complete | Created the one-skill `deep-loop-workflows/` hub with five mode packets and one advisor identity. |
| [`004-command-surface-repoint`](./changelog-147-004-command-surface-repoint.md) | Complete | Repointed `/deep` commands from old skill paths to the merged packet while command names stayed stable. |
| [`005-agent-mirror-repoint`](./changelog-147-005-agent-mirror-repoint.md) | Complete | Repointed the five native deep-loop agents across all runtime mirrors while dispatch contracts stayed unchanged. |
| [`006-advisor-graph-mode-routing`](./changelog-147-006-advisor-graph-mode-routing.md) | Complete | Migrated advisor graph and scoring from five skill IDs to one hub plus mode routing. |
| [`007-governance-consolidation`](./changelog-147-007-governance-consolidation.md) | Complete | Recorded the governance decision and reconciled docs to shipped reality without build work. |
| [`008-framework-docs-sweep`](./changelog-147-008-framework-docs-sweep.md) | Complete | Rewrote framework documentation from the five-skill model to the two-skill model and version-stamped the merged skill. |
| [`009-old-skill-deletion-and-validation`](./changelog-147-009-old-skill-deletion-and-validation.md) | Complete | Added the missing council graph probe after old-skill deletion and reconciled checklist truth. |
| [`010-deep-loop-skill-system-review`](./changelog-147-010-deep-loop-skill-system-review.md) | Conditional pass | Delivered a read-only deep review of the related packet trio with zero P0 and three P1 findings. |

### Added

- Phase 009 added the `/doctor deep-loop` council graph coverage that the destructive deletion gate required.
- Phase 009 recorded CHK-060 as verified because the skill graph rebuild passed with `rejectedEdges=0`.
- Phase 009 created `decision-record.md` to record why byte-identical phase-001 parity replay was descoped and behavioral parity was accepted.
- Phase 010 created its Level-2 review control docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` and `implementation-summary.md`.
- Phase 010 delivered `review/review-report.md` with a conditional pass verdict and ordered remediation plan.

### Changed

- The packet moved generic runtime contracts into `deep-loop-runtime`, then exposed one public `deep-loop-workflows` hub with five mode packets.
- `/deep` commands and native agent mirrors kept their names and dispatch contracts while their skill references moved to the merged packet.
- Advisor graph routing collapsed from five `deep-*` skill IDs to one `deep-loop-workflows` identity plus mode aliases and discriminators.
- Cross-repo framework documentation now describes the two-skill model: `deep-loop-workflows` for public mode routing and `deep-loop-runtime` for the MCP-free backend.
- Phase 009 reconciled the checklist to verified facts after packet-156 review found the missing council graph probe.

### Fixed

- Phase 009 fixed the missing B1 gate by making `/doctor deep-loop` probe `council-graph.sqlite`, not only `deep-loop-graph.sqlite`.
- Phase 010 fixed the review surface and allocation through `review/deep-review-config.json`.
- Phase 010 refuted the broken-requires hypothesis by resolving all 23 cross-skill requires.
- Phase 010 corrected stale validation evidence for packet 153 by re-checking `validate.sh --strict`.

### Verification

| Check | Result |
|-------|--------|
| Phase 009 hub graph metadata | PASS: one hub `graph-metadata.json` exists and per-mode graph metadata is absent. |
| Phase 009 council graph probe | PASS: `/doctor deep-loop` covers both `deep-loop-graph.sqlite` and `council-graph.sqlite`. |
| Phase 009 route validation | PASS: route validation passed. |
| Phase 009 council smoke checks | PASS: status, query and convergence smoke checks passed. |
| Phase 009 old skill deletion | PASS: five old directories deleted. |
| Phase 009 convergence loop types | PASS: convergence loop types verified. |
| Phase 009 edited YAML files | PASS: both edited YAML files passed. |
| Phase 010 adversarial verification | PASS: round-2 adversarial verification refuted or downgraded about seven findings and left three P1 findings. |
| Phase 010 require resolution | PASS: all 23 cross-skill requires resolved. |
| Phase 010 packet 153 validation | PASS: `validate.sh --strict` passed and the stale 85 percent figure was corrected. |
| Phase 010 surviving findings | PASS: the three P1 findings cite concrete files and lines in `review-report.md`. |
| Phase 010 read-only boundary | PASS: no production file mutated and the orchestrator owned all `review/` writes. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | Updated | Added council scope, `council-graph.sqlite` probe logic, `ai-council/**` inventory, council convergence sampling and replay recommendation. |
| `.opencode/commands/doctor/_routes.yaml` | Updated | Widened the `deep-loop` route allowed flags for council and research scoped checks. |
| `checklist.md` | Updated | Marked CHK-060 verified, descoped CHK-065 through a decision record and left four process gates circumstantial. |
| `decision-record.md` | Created | Recorded the CHK-065 descope and accepted behavioral parity evidence. |
| `spec.md` | Created | Created the phase-010 review workspace spec. |
| `plan.md` | Created | Documented phase-010 review scope, dispatch, verification and handoff. |
| `tasks.md` | Created | Recorded the phase-010 review, report and handoff task list. |
| `implementation-summary.md` | Created | Summarized the phase-010 verdict, seat count and remediation handoff. |
| `review/**` | Pre-existing | Referenced the produced review workspace rather than recreating it. |

### Follow-Ups

- Phase 009 leaves CHK-065 descoped because byte-identical phase-001 parity replay is unrecoverable at rewritten paths.
- Phase 010 leaves remediation outside this packet: the three P1 findings, the `skill_creation.md` split and the P2 dead-path sweep land in the named follow-on phase.
- Phase 010 coverage is convergence-bounded, not exhaustive. Full 50-seat coverage remains available on request.
- Phase 010 expects `description.json` and `graph-metadata.json` to be generated by the orchestrator save.
