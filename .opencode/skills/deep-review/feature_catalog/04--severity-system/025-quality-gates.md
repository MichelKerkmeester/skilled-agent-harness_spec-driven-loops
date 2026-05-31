---
title: "Quality gates"
description: "Prevents the review loop from stopping or passing on weak evidence, missing coverage, or unresolved blockers."
trigger_phrases:
  - "quality gates"
  - "legal-stop gate bundle"
  - "premature stop prevention"
  - "dimensionCoverageGate"
  - "blocked-stop event"
---

# Quality gates

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Prevents the review loop from stopping or passing on weak evidence, missing coverage, or unresolved blockers.

The quality-gate system turns convergence from a simple score threshold into a legal-stop decision. It checks whether the review has enough evidence, enough scope coverage, and enough blocker resolution to justify a stop or a clean verdict.

## 2. HOW IT WORKS

### Quality Gates & Validation

The gate model is split across two layers. The contract-level binary gates are Evidence, Scope, and Coverage. The review-specific legal-stop bundle expands that into nine concrete stop checks emitted by `step_emit_blocked_stop` in both `deep_start-review-loop_{auto,confirm}.yaml`:

| Gate | Checks |
|---|---|
| `convergenceGate` | Rolling average, MAD noise floor, and novelty ratio all indicate low-yield churn |
| `dimensionCoverageGate` | Every configured review dimension examined, traceability coverage stabilized |
| `p0ResolutionGate` | No unresolved P0 findings remain active |
| `evidenceDensityGate` | Evidence density across active findings meets the threshold |
| `hotspotSaturationGate` | Review hotspots revisited enough to satisfy saturation |
| `claimAdjudicationGate` | Every new P0/P1 finding carries a typed adjudication packet |
| `fixCompletenessReplayGate` | Security-sensitive fix reruns replay closed gates with producer/consumer/matrix coverage |
| `candidateCoverageGate` | Search debt cleared and required bug classes covered (v2 rollout, passes trivially when inactive) |
| `graphlessFallbackGate` | Required bug classes carry fallback ledger rows when the graph is unavailable (v2 rollout) |

If any required gate fails, STOP is vetoed and the loop appends a `blocked_stop` event with the failing gates and a recovery hint. See `references/convergence/convergence.md` §Section-1 for the authoritative event shape.

### Edge Cases & Caveats

Gate failures also affect verdicts. A quality-gate failure yields FAIL regardless of raw finding counts, and unresolved blockers or missing evidence keep the review in a non-terminal state until a later iteration repairs the packet or closes the gap.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | Lists the required quality guards and marks them blocking before convergence. |
| `references/convergence/convergence.md` | Protocol | Defines the legal-stop bundle, blocked-stop persistence, recovery strategies, and verdict impact. |
| `references/protocol/loop_protocol.md` | Protocol | Applies gate evaluation during the loop and before synthesis. |
| `references/state/state_format.md` | Schema | Defines blocked-stop records, traceability checks, and gate-sensitive registry/report fields. |
| `assets/review_mode_contract.yaml` | Contract | Declares binary quality gates, verdict conditions, and stop thresholds. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md` | Manual scenario | Verifies that failed gates block early stop. |
| `manual_testing_playbook/04--convergence-and-recovery/033-blocked-stop-reducer-surfacing.md` | Manual scenario | Confirms gate failures persist as blocked-stop reducer state. |
| `manual_testing_playbook/06--synthesis-save-and-guardrails/026-review-verdict-determines-post-review-workflow.md` | Manual scenario | Verifies gate outcomes shape the final verdict path. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--severity-system/025-quality-gates.md`
- Primary sources: `SKILL.md`, `references/convergence/convergence.md`, `references/protocol/loop_protocol.md`, `references/state/state_format.md`, `assets/review_mode_contract.yaml`
Related references:
- [024-verdicts.md](024-verdicts.md) — Verdicts
- [026-convergence-signals.md](026-convergence-signals.md) — Semantic convergence signals
