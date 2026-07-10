---
title: "Spec: Live Decontaminated-Holdout Lane + T1↔T2 Circularity Gate"
description: "Route the fixture corpus through the existing live executor seam (today the fixture path hardcodes the deterministic router) so T2 decontaminated holdouts get a real live resourceRecall, publish the T1↔T2 circularity meter as a real anti-overfit signal, and add an opt-in gate — advisory by default with sample-floor + repeat-median flakiness controls so Mode-A stays the only hard CI gate."
trigger_phrases:
  - "live anti-overfit lane"
  - "circularity meter gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/010-live-anti-overfit-lane"
    last_updated_at: "2026-07-09T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded from fresh-Opus analysis"
    next_safe_action: "Refactor runLegacyFixtures→runFixtures via dispatchScenario; add circularity meter"
    blockers: []
    completion_pct: 5
    open_questions:
      - "Circularity gap threshold + warn-vs-block — operator decision"
    answered_questions: []
---
# Spec: Live Decontaminated-Holdout Lane + T1↔T2 Circularity Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 010-live-anti-overfit-lane |
| **Level** | 3 |
| **Status** | Planned |
| **Sequencing** | After 009 (reuses its fixture-as-scenario normalization); the only phase touching the verdict ladder |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
`runLegacyFixtures` hardcodes `routeSkillResources` and never consults `traceMode`
(`run-skill-benchmark.cjs:96-123`), so a T2 decontaminated holdout is scored only by the keyword
router → routes to nothing → no live anti-overfit signal. Yet the live executor seam already exists
(`dispatchScenario` → `live-executor.runLiveScenario`) and `scoreScenario` already does the
post-dispatch private-gold join with a `liveTier` carve-out. `computeDivergence` + the `divergence`
aggregate param are fully built but DEAD (`run-skill-benchmark.cjs:209`). This phase wires the fixture
corpus through the live seam and turns the T1↔T2 gap (`scenario_authoring.md:52`) into a real,
published anti-overfit meter — the missing "consistency vs judgment" signal the 004 sweep disclosed.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
- Refactor `runLegacyFixtures` → `runFixtures({traceMode, executor})` using `dispatchScenario`; add a
  fixture→scenario adapter feeding the existing `expectedFromScenario`.
- Add `computeCircularityMeter(rows)` (per-tier mean of `dims.d1intra.resourceRecall`), publish
  `report.circularity`, render a report section; reuse `computeDivergence` for router-vs-live
  corroboration.
- Add an opt-in `--anti-overfit-gate` verdict (`CIRCULARITY-WARN` soft / `BLOCKED-BY-OVERFIT` hard),
  gated behind a minimum sample floor + repeat-and-median + live-mode-only.

**Out of scope:** the deterministic over-activation lane + loader scope (phase 009); making Mode-A
non-deterministic (it stays the sole hard CI gate).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** T2 holdouts get a live `resourceRecall` against private gold; the anti-circularity boundary
  holds by construction (gold joined post-dispatch).
- **R2:** The gate is advisory by default; hard-block only behind an explicit flag + sample floor.
- **R3:** Router mode (CI) behavior unchanged; live tested via synthetic NDJSON (no network in CI).
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. Circularity meter published + rendered; gap math + sample-floor status unit-tested.
2. Fixture live path tested via `parseLiveResult` synthetic NDJSON.
3. Existing `--fixtures-dir` e2e passes unchanged in router mode.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Live-gate flakiness* (primary) → advisory default + opt-in flag + sample floor + repeat-median +
  live-only; Mode-A stays deterministic.
- *Fixture-path refactor regressions* → preserve error rows; keep router default.
- *Live cost* → behind `--trace-mode live` + small default N.
- Depends on 009; feeds the phase-011 optimizer's anti-overfit awareness.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
**DECISION NEEDED — circularity gap threshold + warn-vs-block.** Recommendation: default advisory
(`report.circularity` never touches verdict); `CIRCULARITY-WARN` at a chosen gap; hard
`BLOCKED-BY-OVERFIT` reserved for an explicit opt-in flag with the sample floor enforced.
<!-- /ANCHOR:questions -->
