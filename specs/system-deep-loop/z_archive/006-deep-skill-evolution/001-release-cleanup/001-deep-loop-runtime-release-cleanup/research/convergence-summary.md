---
title: "Convergence Summary: deep-loop-runtime Phase 5a deep-research loop"
description: "10-iter convergence trace with stop reason, novelty trail, dispatch wall-clock, and remediation-packet handoff."
trigger_phrases:
  - "deep-loop-runtime convergence summary"
  - "phase 5a convergence"
  - "discovery-saturation-after-9-iters"
importance_tier: "normal"
contextType: "general"
---

# Convergence Summary — `deep-loop-runtime` Phase 5a

## Stop Reason

**`discovery-saturation-after-9-iters`** (with caveat: the structural `newInfoRatio < 0.05 for 2 consecutive iters` threshold was unreachable on this audit trajectory).

## Convergence Trace

### Per-iter novelty rate

| Iter | newInfoRatio | Verdict |
|------|--------------|---------|
| 1 | 1.00 | CONTINUE |
| 2 | 1.00 | CONTINUE |
| 3 | 1.00 | CONTINUE |
| 4 | 1.00 | CONTINUE |
| 5 | 1.00 | CONTINUE |
| 6 | 1.00 | CONTINUE |
| 7 | 1.00 | CONTINUE |
| 8 | 1.00 | CONTINUE |
| 9 | 1.00 | CONTINUE → SYNTHESIS |
| 10 | n/a (synthesis-only) | **STOP** |

**Trail**: `[1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00]` — 9 consecutive iters at perfect novelty.

### Per-iter absolute finding count

| Iter | Findings (P0/P1/P2) | Novel | Cumulative novel |
|------|--------------------|-------|------------------|
| 1 | 0 / 6 / 5 = 11 | 11 | 11 |
| 2 | 0 / 3 / 2 = 5 | 5 | 16 |
| 3 | 0 / 8 / 0 = 8 | 8 | 24 |
| 4 | 0 / 0 / 2 = 2 | 2 | 26 |
| 5 | 0 / 1 / 1 = 2 | 2 | 28 |
| 6 | 0 / 2 / 2 = 4 | 4 | 32 |
| 7 | 0 / 1 / 0 = 1 | 1 | 33 |
| 8 | 0 / 1 / 1 = 2 | 2 | 35 |
| 9 | 0 / 1 / 0 = 1 | 1 | 36 (DR-029→DR-037 supersede) |
| 10 | 0 / 0 / 0 = 0 | 0 | **36** |

**Trail**: `[11, 5, 8, 2, 2, 4, 1, 2, 1]` = **36 unique findings**, **0 P0 / 23 P1 / 13 P2**.

**Supersede record**: DR-037 (iter 9) supersedes DR-029 (iter 6). DR-029's 4 sites are repackaged + 2 new phrases (changelog/v1.1.0.0.md:63 + SKILL.md:144 phrase B). 37 emitted, 36 unique.

### Per-iter dispatch wall-clock

| Iter | Wall (s) | Executor |
|------|----------|----------|
| 1 | 90 | cli-devin / swe-1.6 |
| 2 | 90 | cli-devin / swe-1.6 |
| 3 | 0 | orchestrator-direct (ADR-002 enumeration precedent) |
| 4 | 86 | cli-devin / swe-1.6 |
| 5 | 92 | cli-devin / swe-1.6 |
| 6 | 34 | cli-devin / swe-1.6 |
| 7 | 19 | cli-devin / swe-1.6 |
| 8 | 25 | cli-devin / swe-1.6 |
| 9 | 47 | cli-devin / swe-1.6 |
| 10 | 0 | orchestrator-direct (synthesis-only) |

**Total cli-devin dispatch wall-clock**: 90 + 90 + 0 + 86 + 92 + 34 + 19 + 25 + 47 = **483s ≈ 8.05 min**.
**Aggregate iter wall-clock incl. orchestrator-direct iters 3 + 10**: same 483s (zero added).
**Wall-clock per novel finding**: 483s / 36 = ~13.4s per finding (cli-devin dispatch only).

### Bayesian-scorer confidence trace

Not computed for this loop. Per ADR-006 phase-4 approval, the convergence model is the simpler `newInfoRatio + consecutiveLowDeltaIters` pair from `deep-research-config.json`. Bayesian scorer integration is `lib/deep-loop/bayesian-scorer.ts` (LOG_ONLY per ADR-004) and was not exercised in this loop's convergence decision path.

## Final Stop Justification

**Primary stop reason**: discovery saturation. Iter 9 closed the last specific named scope from `deep-research-strategy.md` §4 (cross-arc references) and surfaced 1 P1 finding (DR-037 superseding DR-029) that completed the cross-arc citation enumeration. The audit surface reached **finding-discovery saturation**.

**Strategy non-goals invariant**: §2 explicitly forbids ad-hoc surface expansion. Any iter-10 discovery dispatch beyond the 9 strategy-named focus areas would violate the charter.

**Structural threshold trace**:
- Canonical soft-convergence: `newInfoRatio < 0.05 for 2 consecutive iters` → **NEVER FIRED** (all 9 ratios = 1.00; structurally unreachable on this audit trajectory because dense doc surface guaranteed novel findings whenever each iter targeted a sufficiently bespoke focus).
- Operational saturation: `≤2 findings AND 0 P1+ for 2 consecutive iters` → partially satisfied (≤2 findings clause met for 4 consecutive iters 7-9 + a back-iter 5; `0 P1+` clause failed at every iter — each surfaced ≥1 P1).
- Hard cap: 10 iters (per ADR-006 phase-4 approval) → REACHED at iter 10.
- Operator-defined dashboard recommendation at iter 9: "synthesis-only — no new discovery" → followed.

**Iter 10 contribution**: shape, not surface. Synthesis artifacts emitted:
- `research/research.md` — 17-section synthesis with executive summary, transverse patterns, negative knowledge, Eliminated Alternatives, recommendations.
- `research/convergence-summary.md` (this file).
- `research/resource-map.md` — deep-research skill's resource map for iteration outputs.
- `../resource-map.md` — Phase-5 Augmentation section merged with 36 findings.
- `../implementation-summary.md` — Phase-5 sections filled.

## Remediation Packet Handoff

**3 candidates** ready for next-packet dispatch:

| Packet candidate | Scope | Surface count | Readiness |
|------------------|-------|---------------|-----------|
| 1: Council-omission + cross-arc + schema-doc consolidated remediation | DR-016, DR-017..DR-024, DR-031, DR-033, DR-034, DR-035, DR-036, DR-037 (9 findings × 6 artifacts + 19 new catalog/playbook surfaces) | 9 artifacts + 12 new files | Replacement strings READY (iter 7 §C + iter 9 §"DR-037 replacement-string package") |
| 2: Description-drift full-17 catalog-vs-source sweep | DR-025, DR-026, DR-028 confirmed + 10 unsampled features | 17 catalog files + 17 playbook files + 17 source modules | Mechanical sweep — cli-codex gpt-5.5 high fast or pure sed/Edit |
| 3: P1/P2 cross-doc consistency batch | DR-001..DR-011 (iter 1) + DR-027 (iter 5) + DR-030 (iter 6) | SKILL.md, README.md, lib/README.md, graph-metadata.json, changelog/v1.0.0.0.md, changelog/v1.1.0.0.md | Surgical 1-3-line patches per finding |

**Test-coverage gaps** (DR-012, DR-013, DR-014, DR-015) remain LOG_ONLY per ADR-004 — separate follow-on packet under code-edit governance.

## Audit Roll-up

| Metric | Value |
|--------|-------|
| Iterations completed | 10 of 10 (budget) |
| Discovery iters | 9 (iter 3 orchestrator-direct, iters 1-2 + 4-9 cli-devin) |
| Synthesis iters | 1 (iter 10 orchestrator-direct) |
| Total unique novel findings | 36 |
| Severity rollup | 0 P0 / 23 P1 / 13 P2 |
| Re-reports of Phase-2 AF-* findings | 0 |
| LOG_ONLY findings (test-coverage class) | 4 (DR-012, DR-013, DR-014, DR-015) |
| Supersede relationships | 1 (DR-037 supersedes DR-029) |
| SC-007 violations | 0 |
| Bundle gate failures | 0 |
| Bundle gate citation-drift corrections | 2 (iter 6 require-count framing + iter 2/4 off-by-one anchors) |
| Transverse patterns identified (iter 10) | 7 |
| Negative-knowledge results (iter 10) | 20 |
| Remediation-packet candidates | 3 |
| Total dispatch wall-clock | ~483s (~8.05 min) |
| Per-finding dispatch wall-clock | ~13.4s |

## Closure

The deep-research loop closes with discovery saturation, replacement strings ready, and a 3-packet remediation backlog handed off cleanly to the operator. SC-007 holds across the loop; no code edits to `lib/scripts/tests/storage`; ADR-004 LOG_ONLY boundary preserved.

**Next safe action**: dispatch packet candidate 1, OR `/memory:save` this synthesis, OR commit + close the packet.
