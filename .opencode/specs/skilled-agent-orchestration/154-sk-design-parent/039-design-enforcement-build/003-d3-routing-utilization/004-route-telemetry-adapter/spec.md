---
title: "D3-R4 — routeTelemetry adapter + miss-rate metrics"
description: "Extend router-replay.cjs output with routeTelemetry and add reducer miss-rate metrics that separate unobserved from observed-wrong routes."
trigger_phrases:
  - "d3-r4 route telemetry adapter"
  - "route miss rate design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R4 — routeTelemetry adapter + miss-rate metrics

## 1. OBJECTIVE
Extend `router-replay.cjs` output with a `routeTelemetry` record and add reducer metrics — `telemetryMissingRate`, `routeMissRate`, `aliasMissRate`, `bundleMissRate`, `proofFailRate` — that report "unobserved" routes separately from "observed-wrong" routes.

## 2. WHY
`telemetryMissingRate=1.000` across 55 prompt scenarios today: routing is entirely unobserved, so a miss cannot be distinguished from silence. Without per-axis miss rates the residual live miss-rate stays assumed instead of measured.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` (+ reducer)
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Emit `routeTelemetry` `{workflowMode, matchedAliases, defaultApplied, deferReason, backendKind, packet}` from replay.
- Add reducer metrics for telemetry/route/alias/bundle/proof miss rates.
- Report "unobserved" vs "observed-wrong" as distinct buckets.

## 5. ACCEPTANCE
- A replay run emits `routeTelemetry` for every scenario and the reducer reports a finite `routeMissRate` (today `telemetryMissingRate=1.000` collapses to a measured rate).

## 6. EVIDENCE
- `router-replay.cjs:257` — output assembly point to extend with telemetry.
- Source: `research/research.md` §6 (D3-R4).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
