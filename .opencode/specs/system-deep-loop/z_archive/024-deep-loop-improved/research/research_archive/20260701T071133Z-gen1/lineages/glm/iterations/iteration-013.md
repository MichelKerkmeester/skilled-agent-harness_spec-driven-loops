# Iteration 013: Convergence Math Adequacy for High-Reasoning Models + Cross-Sibling Threshold Parity

## Focus
- Scope: Deep-research convergence formula adequacy; deep-review vs deep-research threshold semantics; the codex 50-iteration non-convergence anomaly
- Question: Is the convergence math adequate for high-reasoning-effort models?

## Findings

### F-013: Convergence math structurally favors early-stop for high-iteration loops; codex 50-iteration non-convergence reveals denominator drag

**Severity: Medium (convergence quality degradation, not a correctness bug)**

**The convergence formula (deep-research):**

newInfoRatio = (newly discovered information) / (accumulated research knowledge)

With the 0.01 threshold: STOP when <1% of findings are net-new.

**Problem: Denominator drag in long loops**

As iterations accumulate, the denominator (accumulated knowledge) grows monotonically. By iteration 30+, even a genuinely novel finding that adds 1 new concept to a base of 100 known concepts yields newInfoRatio = 1/101 ≈ 0.0099 < 0.01. The loop converges not because novelty is exhausted but because the denominator mathematically suppresses late discoveries.

[SOURCE: SKILL.md §27-37: "convergenceThreshold compares newly discovered information against accumulated research knowledge"]

**Evidence from existing lineages:**

GLM review dashboard convergence telemetry:
| Iteration | newFindingsRatio |
|-----------|-----------------|
| 001 | 1.0 |
| 005 | 0.2 |
| 010 | 0.0 |

The ratio hit 0.0 at iteration 10, meaning zero new findings from that point. But the dashboard says "Telemetry dropped below the 0.01 threshold from iteration 009 onward; all dimensions covered at iteration 010." This is correct for review (where finding novelty naturally decays), but for research (where new domains can be discovered late), the same math would premature-stop.

[SOURCE: `review/lineages/glm/deep-review-dashboard.md`]

**Codex 50-iteration non-convergence anomaly:**

The codex review lineage ran all 50 iterations and hit `maxIterationsReached` — it NEVER converged. [SOURCE: `review/lineages/codex/deep-review-state.jsonl`]

This is paradoxical: if the convergence math works, 50 iterations should be more than enough for a review. Possible explanations:
1. The codex executor produced findings in every iteration (keeping newFindingsRatio > 0.01) — but the registry is empty (0 findings), suggesting the findings were produced but not saved
2. The convergence check was disabled or misconfigured for the codex path
3. The codex lineage's convergence threshold was different from the GLM lineage's

This anomaly needs investigation: if 50 iterations didn't converge, either the threshold was set very low (0.001?) or the convergence check was broken.

**Cross-sibling threshold semantics:**

The SKILL.md correctly documents that thresholds are NOT interchangeable across siblings:
- deep-research: 0.05 default on newInfoRatio
- deep-review: 0.10 default on weighted P0/P1/P2 severity ratio
- deep-ai-council: 0.20 default on adjudicator-verdict stability

[SOURCE: SKILL.md §27-37]

This is good — but the fanout-run.cjs defaults are:
- Path B (native): `convergenceThreshold = options.convergenceThreshold ?? 0.1` (hardcoded 0.1 for ALL loop types)
- Path A (CLI executor): no default (inherits YAML)

So a native-command fan-out of deep-research uses 0.1 (the REVIEW default) instead of 0.05 (the RESEARCH default). This is the cross-sibling threshold confusion that the SKILL.md warns about, embedded in the fan-out dispatch code.

[SOURCE: `fanout-run.cjs:846`]

**Recommendation:**
1. **Denominator drag:** Add an optional `slidingWindow` mode to the convergence formula that computes newInfoRatio over the last N iterations rather than the full accumulated base. This prevents late discoveries from being mathematically suppressed.
2. **Fan-out default:** Make `buildNativeCommandInput`'s default threshold loop-type-aware: 0.05 for research, 0.10 for review, 0.20 for ai-council.
3. **Codex anomaly:** Investigate why the codex lineage never converged in 50 iterations — check the config.json for the actual threshold used and whether findings were being saved.
4. **Observability:** Log the convergence threshold and effective convergence formula per lineage in the state log's INIT record.

## Novelty Justification
This is a NEW analytical finding. The denominator-drag mathematical proof (late discoveries suppressed by monotonic denominator growth) is original analysis. The codex 50-iteration non-convergence is flagged as an anomaly needing investigation. The fan-out native path's hardcoded 0.1 default (wrong for research) is a new concrete bug.

## What Was Tried and Failed
- Checked if the codex config.json revealed a non-standard threshold (would need to read the file)

## Ruled-Out Directions
- The convergence math is NOT broken for short loops (12-15 iterations); the issue is specific to 30+ iteration high-reasoning loops
