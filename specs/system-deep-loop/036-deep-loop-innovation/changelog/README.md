---
title: "Spec 036 Changelog Index"
description: "Mirrored changelog tree for the eight-group topology of spec 036 deep-loop-innovation, one changelog per phase folder at every depth."
trigger_phrases:
  - "036 changelog index"
  - "deep-loop-innovation changelogs"
  - "036 consolidation changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 036 Changelog Index

This directory mirrors the full nested phase structure of `036-deep-loop-innovation` after its consolidation into eight thematic group parents. Every phase folder — at every depth — has a matching folder here containing one `changelog-<basename>.md`. Chronological identity across the whole epic lives in [`../timeline.md`](../timeline.md).

## Topology

| Group | Theme | Direct phases | Changelog files | Root |
|---|---|---:|---:|---|
| `001-research-inputs-and-architecture` | Research Inputs and Architecture | 4 | 8 | [root](./001-research-inputs-and-architecture/changelog-001-research-inputs-and-architecture.md) |
| `002-substrate-and-orchestration` | Substrate and Orchestration | 7 | 41 | [root](./002-substrate-and-orchestration/changelog-002-substrate-and-orchestration.md) |
| `003-mode-contracts-migration-and-cutover` | Mode Contracts, Migration and Cutover | 4 | 76 | [root](./003-mode-contracts-migration-and-cutover/changelog-003-mode-contracts-migration-and-cutover.md) |
| `004-gate-closeout-and-drift` | Gate, Closeout and Drift | 3 | 4 | [root](./004-gate-closeout-and-drift/changelog-004-gate-closeout-and-drift.md) |
| `005-blocker-closeout` | Blocker Closeout | 4 | 5 | [root](./005-blocker-closeout/changelog-005-blocker-closeout.md) |
| `006-runtime-docs-and-integrity-hardening` | Runtime Docs and Integrity Hardening | 11 | 12 | [root](./006-runtime-docs-and-integrity-hardening/changelog-006-runtime-docs-and-integrity-hardening.md) |
| `007-executor-and-cli-hardening` | Executor and CLI Hardening | 7 | 24 | [root](./007-executor-and-cli-hardening/changelog-007-executor-and-cli-hardening.md) |
| `008-review-and-rollback-followup` | Review and Rollback Follow-up | 4 | 5 | [root](./008-review-and-rollback-followup/changelog-008-review-and-rollback-followup.md) |

## Conventions

- **One changelog per phase folder.** A folder that governs `NNN-` child phases uses the `changelog/root.md` template and carries an Included Phases table; a leaf phase uses `changelog/phase.md`.
- **Names are historical.** Where a phase kept its original number through the consolidation, its changelog basename reflects the current on-disk name.
- **Root rollup:** [`changelog-036-root.md`](./changelog-036-root.md) summarizes the whole epic and links each group root.
