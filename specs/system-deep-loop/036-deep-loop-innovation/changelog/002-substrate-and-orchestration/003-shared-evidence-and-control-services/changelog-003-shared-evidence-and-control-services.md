---
title: "Changelog: Shared Evidence & Control Services [002-substrate-and-orchestration/003-shared-evidence-and-control-services]"
description: "Changelog for the shared evidence and control services phase: receipts + effect recovery, sealed reference artifacts, blinded adjudication, hierarchical typed budgets, stream-fold gauges, locks/fencing, and continuity identities."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/003-shared-evidence-and-control-services` (Level 2)

### Summary

This phase plans the seven shared evidence and control services that make the transition-authorized ledger usable by the compatibility bridge and every deep-loop mode: receipts and effect recovery, sealed reference artifacts, blinded adjudication, hierarchical typed budgets, stream-fold gauges, locks and fencing, and continuity identities. The services are decomposed into independently planned child contracts behind the phase-006 event envelope, with the additive-dark path remaining non-authoritative. Per the group parent phase map, this phase is in progress; six of the seven children report delivered implementations in their implementation summaries.

### Included Phases

| Phase | Summary |
|---|---|
| `001-receipts-and-effect-recovery` | Plan durable boundary receipts and an effect-recovery gateway that records intent before execution, confirms observed outcomes, and reconciles interrupted external effects without unsafe replay. |
| `002-sealed-reference-artifacts` | Plan immutable, content-addressed reference artifacts whose bytes are sealed, verified on every read, retained by explicit lifecycle policy, and pinned into replay evidence. |
| `003-blinded-adjudication-service` | Plan a shared blinded and counterfactual adjudication service that controls identity and position bias while preserving replayable raw scoring evidence. |
| `004-hierarchical-typed-budgets` | Plan token, cost, iteration, and wall-time budgets that nest from program to iteration, reserve atomically, settle against ledgered spend, and fail closed before dispatch. |
| `005-stream-fold-gauges` | Plan versioned observability gauges as deterministic folds over the transition-authorized ledger, with reproducible progress, novelty, cost, and health values. |
| `006-locks-and-fencing` | Plan the shared concurrency-safety service for ledger append, projections, and per-lineage state via scoped leases and durable monotonic fencing tokens. |
| `007-continuity-identities` | Plan stable lineage, claim, candidate, and mode-session identities that persist across resume, handover, replay, and cross-mode boundaries. |
