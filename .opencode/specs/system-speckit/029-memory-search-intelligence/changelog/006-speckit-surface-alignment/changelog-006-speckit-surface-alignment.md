---
title: "Changelog: 008 SpecKit Surface Alignment Remediation"
description: "Changelog entry for the 008 surface-alignment audit, review, remediation phases, and closure docs."
trigger_phrases:
  - "008 surface alignment changelog"
  - "speckit surface alignment remediation"
  - "recorded failure closure changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-07-05

> Spec folder: `.opencode/specs/system-speckit/029-memory-search-intelligence/006-speckit-surface-alignment` (Phase Parent)

### Summary

The 008 remediation packet converted the surface-alignment research into a documented closure arc. The parent audit found documentation-vs-implementation drift across system-speckit surfaces, the Fable review narrowed the record to citation-verified issues, and the child phases executed the audit and remediation sequence. Phases 011 and 012 produced read-only audits for system-code-graph docs and the stress-test plus SKILL.md/changelog surfaces. The paired fix phases then corrected the code-graph and stress-doc findings. Phase 013 shipped the inert `newInfoRatio` warning in the deep-research reducer and phase 014 closed the recorded-but-unactioned detector class with a cap reconciliation, constitutional rule, surfacer, and RED/GREEN test.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-false-now-doc-corrections` | Complete | Corrected false-now documentation drift: added the Track-C supersession pointer and fixed the live `SPECKIT_RETENTION_FORGETTING` flag name in `benchmark-status.md`; confirmed three already-corrected cited surfaces in place. |
| `011-code-graph-doc-audit` | Complete | Read-only audit of system-code-graph documentation. Found six confirmed drift issues and zero inferred findings. |
| `011-fix-code-graph-docs` | Complete | Corrected the six system-code-graph documentation findings with source-backed before/after evidence. |
| `003-stress-and-skillmd-audit` | Complete | Read-only audit of stress-test docs and system-spec-kit SKILL.md/changelog surfaces. Found stress-lane gaps while confirming SKILL.md and changelog current. |
| `002-fix-stress-docs` | Complete | Aligned stress catalog, playbook, and stress_test README surfaces with the shipped automated harness. |
| `013-deep-research-loop-instrumentation` | Complete | Shipped `novelty_signal_inert` warning for flat-high `newInfoRatio` plus focused Vitest coverage. |
| `004-recorded-failure-closure` | Complete | Reconciled the deep-research cap record and shipped the recorded-failure closure route. |

### Added

- New narrative completion docs for the 011 and 012 audit-only phases.
- New narrative completion docs for the 013 reducer-instrumentation and 014 recorded-failure-closure phases.
- A constitutional README registration for `recorded-failure-must-route.md`.

### Changed

- The 008 remediation history is now represented in the 028 changelog tree and chronological timeline.

### Fixed

- Closed the documentation record gap where audit-only phases had reports but no spec, plan, tasks, or implementation summary.
- Closed the program-level narrative gap for the 013 and 014 shipped follow-up phases.

### Verification

- 011 audit report records 6 confirmed and 0 inferred findings.
- 012 audit report records 8 confirmed and 0 inferred findings.
- 013 shipped evidence records `reduce-state.cjs` flat-high `newInfoRatio` warning behavior and focused RED/GREEN tests.
- 014 shipped evidence records the constitutional rule, surfacer, and 4/4 assertion test.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `006-speckit-surface-alignment/011-code-graph-doc-audit/spec.md` | Created | Audit phase spec. |
| `006-speckit-surface-alignment/011-code-graph-doc-audit/plan.md` | Created | Audit phase plan. |
| `006-speckit-surface-alignment/011-code-graph-doc-audit/tasks.md` | Created | Audit task ledger. |
| `006-speckit-surface-alignment/011-code-graph-doc-audit/implementation-summary.md` | Created | Audit delivered-state summary. |
| `006-speckit-surface-alignment/003-stress-and-skillmd-audit/spec.md` | Created | Audit phase spec. |
| `006-speckit-surface-alignment/003-stress-and-skillmd-audit/plan.md` | Created | Audit phase plan. |
| `006-speckit-surface-alignment/003-stress-and-skillmd-audit/tasks.md` | Created | Audit task ledger. |
| `006-speckit-surface-alignment/003-stress-and-skillmd-audit/implementation-summary.md` | Created | Audit delivered-state summary. |
| `006-speckit-surface-alignment/013-deep-research-loop-instrumentation/plan.md` | Created | Shipped implementation plan and evidence. |
| `006-speckit-surface-alignment/013-deep-research-loop-instrumentation/tasks.md` | Created | Shipped task ledger. |
| `006-speckit-surface-alignment/013-deep-research-loop-instrumentation/implementation-summary.md` | Created | Shipped delivered-state summary. |
| `006-speckit-surface-alignment/004-recorded-failure-closure/plan.md` | Created | Shipped implementation plan and evidence. |
| `006-speckit-surface-alignment/004-recorded-failure-closure/tasks.md` | Created | Shipped task ledger. |
| `006-speckit-surface-alignment/004-recorded-failure-closure/implementation-summary.md` | Created | Shipped delivered-state summary. |
| `changelog/changelog-006-speckit-surface-alignment.md` | Created | Program changelog entry for 008. |
| `timeline.md` | Modified | Adds 2026-07-05 remediation milestone. |
| `constitutional/README.md` | Modified | Registers the new constitutional rule. |

### Follow-Ups

- Metadata files for the newly authored docs remain handled separately by the metadata pipeline, per operator instruction.
