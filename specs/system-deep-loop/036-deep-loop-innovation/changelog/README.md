---
title: "Spec 036 Changelog Index"
description: "Mirrored changelog tree for spec 036 deep-loop-innovation — the eight consolidated group parents (001-008) plus later phases 009-012 — one changelog per phase folder at every depth."
trigger_phrases:
  - "036 changelog index"
  - "deep-loop-innovation changelogs"
  - "036 consolidation changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 036 Changelog Index

This directory mirrors the full nested phase structure of `036-deep-loop-innovation` — the eight thematic group parents from its consolidation (`001`–`008`) plus the later top-level phases `009`–`012`. Every phase folder — at every depth — has a matching changelog here: a folder governing `NNN-` children carries a `changelog-<basename>.md` root inside its own subfolder, and a leaf phase carries a flat `changelog-<basename>.md` in its parent's folder. Chronological identity across the whole epic lives in [`../timeline.md`](../timeline.md).

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
| `009-innovation-gap-remediation` | Innovation Gap Remediation | 5 | 6 | [root](./009-innovation-gap-remediation/changelog-009-innovation-gap-remediation.md) |
| `010-weak-model-loop-adherence` | Weak-Model Loop Adherence (leaf phase) | 0 | 1 | [changelog](./changelog-010-weak-model-loop-adherence.md) |
| `011-cli-pi-fanout-execution` | cli-pi Fan-Out Execution (leaf phase) | 0 | 1 | [changelog](./changelog-011-cli-pi-fanout-execution.md) |
| `012-runtime-enablement` | Runtime Enablement | 11 | 17 | [root](./012-runtime-enablement/changelog-012-runtime-enablement.md) |

## Conventions

- **One changelog per phase folder.** A folder that governs `NNN-` child phases uses the `changelog/root.md` template and carries an Included Phases table; a leaf phase uses `changelog/phase.md`.
- **Names are historical.** Where a phase kept its original number through the consolidation, its changelog basename reflects the current on-disk name.
- **Root rollup:** [`changelog-036-root.md`](./changelog-036-root.md) summarizes the whole epic and links each group root.
- **Whole-epic rollup:** [`changelog-036-epic.md`](./changelog-036-epic.md) is the comprehensive changelog covering all twelve groups (`001`–`012`) end to end, synthesized from every group-root changelog.
