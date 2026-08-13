---
title: "Changelog: Fan-out Live-Tools Unblock [002-substrate-and-orchestration/005-fanout-live-tools-unblock]"
description: "Changelog for the fan-out live-tools unblock phase: dispatch-only typed liveTools.webSearch policy, fail-closed capability matrix, per-kind command adapters with invocation fingerprints, and deterministic manifest expansion."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/005-fanout-live-tools-unblock` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration`

### Summary

This phase shipped the early, backward-compatible fan-out live-tools unblock on `fanout-run.cjs`: a typed `liveTools.webSearch` policy, a fail-closed executor capability matrix, per-kind command adapters returning command/args/input plus an invocation fingerprint, and a models-by-branches-by-replicas manifest compiler. The change is dispatch-only and preserves every canonical persisted state and event shape. Status is Complete: the runtime change was implemented and verified (141 tests green, empty persistence-shape diff, strict spec validation pass). Cached search remains typed but rejected for every kind until a stable CLI contract exists, and the invocation fingerprint is not yet persisted as a durable receipt (deferred to phase 009).
