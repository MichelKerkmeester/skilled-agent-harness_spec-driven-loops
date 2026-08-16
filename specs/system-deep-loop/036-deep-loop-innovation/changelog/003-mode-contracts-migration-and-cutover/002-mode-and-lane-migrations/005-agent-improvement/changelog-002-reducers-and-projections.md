---
title: "Changelog: Agent Improvement - Reducers & Projections [003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections]"
description: "Changelog for the agent improvement reducers and projections phase: deterministic reducers that replay the typed event ledger for the agent loop."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement`

### Summary

This phase planned the deterministic reducers and live projections for the Agent Improvement migration: agent-loop proposal generation, AgentIR mutation lineage, evaluator scoring, and convergence state replayed from the typed event ledger while reusing the deep-improvement-common evaluator, canary, and promotion services. Per its implementation summary, the additive-dark Agent Improvement ledger now folds into deterministic AgentIR iteration, artifact, coverage, classification, and mode-status projections over the shared Deep Improvement reducer. Status is complete.
