---
title: "Changelog: Fan-out / Fan-in Durable Orchestration [002-substrate-and-orchestration/005-fanout-fanin-durable-orchestration]"
description: "Changelog for the fan-out / fan-in durable orchestration phase: dispatch receipts, result envelopes, resume/salvage, branch IDs and leases and waves, budget-aware fan-in, partial-failure policy, and provenance-balanced reduction."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/005-fanout-fanin-durable-orchestration` (Level 2)

### Summary

This phase makes fan-out and fan-in durable over the canonical ledger, generalizing the shipped `fanout-run.cjs` pool: canonical dispatch receipts, typed result envelopes and resume/salvage, logical branch IDs with leases and waves, conditional budget-aware fan-in, an explicit partial-failure policy, and provenance-balanced reduction. It turns the phase-005 execution surface into durable orchestration contracts over the phase-006 ledger and phase-007 control services. Per the group parent phase map, this phase is in progress; all seven children report delivered implementations in their implementation summaries.

### Included Phases

| Phase | Summary |
|---|---|
| `001-canonical-dispatch-receipts` | Promote each phase-005 resolved leaf invocation into a canonical, authorized, durable pre-spawn ledger receipt so resume can detect prior dispatch intent without duplicating work. |
| `002-result-envelopes-and-resume-salvage` | Plan typed per-leaf result envelopes and ledger-fold resume/salvage that preserves completed work and never re-runs a durably completed leaf. |
| `003-logical-branch-ids-leases-waves` | Establish stable logical branch identities, fenced worker leases, and ordered wave scheduling over the existing capped pool, with canonical ledger records. |
| `004-conditional-budget-aware-fanin` | Plan replay-stable conditional fan-in that awaits only enough durable results, stops on typed-budget floors or evidence sufficiency, and records the reducer input decision. |
| `005-partial-failure-policy` | Define the typed failure taxonomy, deterministic tolerance thresholds, degraded-result contract, and ledger verdict deciding whether fan-in proceeds or aborts. |
| `006-provenance-balanced-reduction` | Plan a deterministic fan-in reducer that deduplicates surviving results, balances contribution across provenance, preserves lineage, and escalates contested merges. |
| `007-fanout-synthesis-lineage-aggregation` | Make deep-research fan-out synthesis consume lineage-owned state in place, repair empty-registry reconstruction, and publish byte-identical canonical and compatibility registries. |
