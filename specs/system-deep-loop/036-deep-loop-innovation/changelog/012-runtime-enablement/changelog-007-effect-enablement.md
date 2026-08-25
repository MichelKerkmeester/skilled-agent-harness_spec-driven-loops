---
title: "Changelog: Effect Enablement [012-runtime-enablement/007-effect-enablement]"
description: "Fail-closed effect producer at the live fan-out launcher seam, bracketing executor dispatch with durable intent before spawn and confirmation after into the per-lineage effect ledger."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-22

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement`

### Summary

Wired a fail-closed effect producer at the live `fanout-run.cjs` launcher seam. Executor dispatch now routes through the audited effect gateway: durable intent before spawn, confirmation after — into the per-lineage effect ledger the cutover certificate reads.

### What Changed

- Added `dispatchExecutorEffect` in `runtime/lib/deep-loop/fanout-effect-dispatch.ts` wrapping intent, spawn, and confirmation through the shipped effect gateway.
- Replaced direct subprocess spawn in `fanout-run.cjs` with the helper, threading mode and lineage directory the launcher already held.
- Proved fail-closed behavior: no durable intent means no spawn; negative control with perturbed intent append spawns zero children.
- Rewrote two launcher tests that had been loosened on a false serialization rationale to hold under load.

### Status

Complete. 112 tests green across effect-recording and launcher suites; effect recording fails closed by operator ratification.
