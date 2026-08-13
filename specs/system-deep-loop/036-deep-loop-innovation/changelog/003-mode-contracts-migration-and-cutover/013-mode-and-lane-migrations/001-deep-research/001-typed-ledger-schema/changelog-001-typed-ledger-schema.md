---
title: "Changelog: Deep Research - Typed Ledger Schema [003-mode-contracts-migration-and-cutover/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema]"
description: "Changelog for the deep research typed ledger schema phase: the typed append-only event vocabulary for the deep research mode."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/013-mode-and-lane-migrations/001-deep-research`

### Summary

This phase planned the Deep Research mode event vocabulary over the shared typed append-only ledger: a versioned envelope specialization, typed run lifecycle, question and branch planning, evidence and claim provenance, convergence decisions, synthesis, and memory-save handoff events. It defines events and upcaster hooks only; reducers and projections belong to the next sibling. Per its implementation summary, the additive-dark Deep Research ledger boundary now exposes a typed event union, closed payload and scope contracts, and fail-closed legacy compatibility hooks for the reducer sibling. Status is complete.
