---
title: "Deep Review Convergence Signals"
description: "Focused reference for severity-weighted stop signals, P0 overrides, quality gates, and graph-aware blocked-stop checks."
trigger_phrases:
  - "deep review convergence signals"
  - "review stop signals"
  - "severity weighted convergence"
  - "review blocked stop"
---

# Deep Review Convergence Signals

This reference names the live stop signals. Use `references/convergence.md` as the hub when you need algorithms, examples, and sibling threshold notes.

---

## 1. OVERVIEW

Deep-review convergence is a release-readiness decision. The loop stops only when severity-weighted findings stabilize, dimension coverage is complete, quality gates pass, and no P0 override is active.

---

## 2. SIGNALS

| Signal | Meaning | Blocks STOP When |
|--------|---------|------------------|
| Severity-weighted new findings | Weighted P0/P1/P2 discovery ratio for the latest iteration | Above the configured threshold |
| Rolling stop average | Stabilized trend across recent iterations | Still above the stop band |
| Dimension coverage | Required review dimensions and traceability overlays covered | Any required dimension is missing |
| Quality-gate bundle | Evidence, scope, coverage, P0, density, hotspot, claim, candidate, graphless gates | Any required gate fails |
| Graph-aware blind spot check | Coverage graph sees unresolved structural gaps | Graph blockers remain active |

---

## 3. P0 OVERRIDE

Any new P0 forces at least one more iteration. The override exists because a new blocker changes the release verdict, even if the rest of the stop math appears stable.

P0 handling requires:

- File and line evidence.
- Adversarial self-check.
- Active registry update.
- Replay in synthesis before PASS is legal.

---

## 4. LEGAL STOP

STOP is legal only when all of these are true:

1. New findings are below threshold.
2. Rolling trend is stable.
3. All required dimensions are covered.
4. The quality-gate bundle passes.
5. No unresolved P0 remains.
6. Graph-aware blockers are absent or explicitly unavailable with fallback evidence.

If any item fails, the workflow emits `blocked_stop` and continues or routes to recovery.

---

## 5. SIBLING CONTRAST

Do not carry thresholds across deep skills:

| Skill | Primary Signal | Default Threshold |
|-------|----------------|-------------------|
| `deep-review` | Severity-weighted P0/P1/P2 new findings | `0.10` |
| `deep-research` | Novelty/newInfoRatio over research knowledge | `0.05` |
| `deep-ai-council` | Planning agreement with critique blocker check | Council-specific, not interchangeable |

---

## 6. RELATED RESOURCES

- `references/convergence.md` for the full stop contract.
- `references/state_outputs.md` for dashboard and report fields that display convergence.
- `references/state_reducer_registry.md` for reducer-owned gate state.
