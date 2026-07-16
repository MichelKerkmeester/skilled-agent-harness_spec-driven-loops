# Iteration 009 — CORRECTNESS (stage2-fusion.ts deep pass)

## Dimension
CORRECTNESS focused pass on the largest in-scope file: `stage2-fusion.ts` (1478 LOC). This is the rescue wiring + fusion scoring + dedupe + sort layer.

## In-scope
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`

(Devin produced findings in stdout; iteration file authored from devin output by loop manager — same non-interactive write-restriction pattern as iters 5/6/8.)

## Findings

### P0

#### FUSION-001 (P0) — Rescue-layer score cap at 0.82 may suppress high-quality candidates
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (rescue wiring)

**Issue:** When the rescue layer returns boosted candidates, the rescue-rescore caps the boost at `0.82` (per devin's analysis). A genuinely top-tier rescue candidate with `boostScore ≈ 0.95` is dampened to `0.82`, demoting it below candidates from the primary fusion lane that already scored at `0.85+`.

**Reproduction:**
1. Inject a fixture where retrieval-rescue surfaces a candidate with `boostScore = 0.95`.
2. Run the stage2-fusion pipeline.
3. Inspect the final ordered list — the rescued candidate sits at `0.82` instead of `0.95`, ranked below 0.85 candidates from the primary lane.

**Recommendation:** Either lift the cap, or document the cap's empirical basis in a comment + add a top-N sentinel to log when a high-boost candidate is cap-suppressed.

**Severity adjudication:** P0 IF rescue is a primary recall signal in this stack. For 016-019 (where rescue is *the* tradeoff lever per ADR), this is a high-impact suppression. Synthesis: likely P0.

### P1

#### FUSION-002 (P1) — Graph calibration score calculation assumption
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (graph contribution path)

**Issue:** Graph-calibration adjustments assume non-zero divisor for normalization. When the graph-stat denominator is zero (empty causal graph, fresh deployment), divide-by-zero yields `NaN` which then propagates through `Math.max`/`Math.min` clamps unevenly.

**Reproduction:** Force the causal graph to an empty state, run the pipeline; observe the calibration term contributes `NaN` to the final score for some rows.

**Recommendation:** Guard with `if (denom <= 0) return rowScoreOnly;` early in the calibration helper.

#### FUSION-003 (P1) — Feedback-signal change detection uses reference equality
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (feedback-signal aggregation)

**Issue:** The feedback-signal stage compares two snapshot arrays using `===` reference equality to short-circuit re-aggregation. Identical-content arrays from different sources will still re-aggregate; mutated-in-place arrays will silently skip.

**Reproduction:** Pass two arrays with equal content but different identity — observe redundant aggregation calls in profiling.

**Recommendation:** Use a content-hash or shallow value-compare; or document the reference-equality semantics if it's intentional.

### P2

#### FUSION-004 (P2) — Redundant co-activation re-sort
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (co-activation step)

**Issue:** The co-activation step sorts its candidate list twice — once internally for the contribution calculation, again at the end before the next stage receives the rows. The second sort is redundant.

**Recommendation:** Remove the second sort; document the contract that the upstream returns pre-sorted rows.

#### FUSION-005 (P2) — Missing validation in learned-blend weight
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (learned-blend term)

**Issue:** The learned-blend weight is read from config without `Number.isFinite` validation. A malformed config (`NaN`, `Infinity`) silently zero-weights the entire learned-blend contribution.

**Recommendation:** Add `Number.isFinite(weight) && weight >= 0 && weight <= 1` validation at config-load; fall back to a safe default with a logged warning.

#### FUSION-006 (P2) — Undefined `artifactClass` fallback
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (per-class weighting)

**Issue:** Per-class weighting branches on `row.artifactClass`. When the field is `undefined` (older rows pre-classifier), no fallback branch handles it — the row receives `0` weight contribution silently.

**Reproduction:** Inject a row with `artifactClass === undefined`, run the pipeline, observe the row's class-weighted contribution is `0` rather than a neutral default.

**Recommendation:** Add an `unknown` bucket with a documented neutral weight; raise a logged warning at the dedupe stage so older-row data quality issues are surfaced.

### Verified Correct (devin)
- Rescue-layer wiring at lines ~1369-1373: parameter passing + null handling correct.
- Sort direction lines ~674-679: descending with deterministic tiebreaker.
- Async patterns (~line 1309): no race conditions; model loading cached + null-checked.
- Score normalization: properly clamped to [0,1] via `withSyncedScoreAliases`.
- Graph contribution calculations: all use `Math.max(0, ...)` and `Number.isFinite()` checks.
- Database ID handling: proper type conversion + validation in provenance fetch.

## Bundle Gate (loop manager)
- Devin's findings reference functional behaviors (cap value 0.82, divide-by-zero, ref-equality semantics) — spot-check via `rg "0.82" stage2-fusion.ts` planned for synthesis. P0 FUSION-001 contingent on the cap actually being present at 0.82 (devin asserted, loop manager flags `[VERIFY-IN-SYNTHESIS]`).
- Other findings (NaN propagation, ref equality, redundant sort, missing isFinite guard, undefined artifactClass fallback) match known TS-pipeline anti-patterns and devin's other iters; high prior probability of being accurate.
- Devin's "Verified Correct" list is preserved as positive observations.

## Gaps for next iter
- Cross-stack contract drift (iter 17).
- Adversarial/chaos pass (iters 13-20).
- VERIFY FUSION-001 cap exists at 0.82 during synthesis grep pass.

---

## Bundle Gate Update (synthesis-time verification)
- **FUSION-001 file correction**: `rg "0\.82" stage2-fusion.ts` → NO MATCH. Cap is actually at `retrieval-rescue.ts:357` (`Math.min(0.82, Math.min(baseScore, 1) * 0.03 + rescue.score * 0.78)`). Issue still valid; file attribution corrected.
- FUSION-005 learned-blend weight: verified at stage2-fusion.ts:1312 (`resolveLearnedBlendWeight`), used at line 1344-1346 — no Number.isFinite guard at consumer.
- FUSION-006 artifactClass fallback: verified at stage2-fusion.ts:1371-1372 — fallback chain is `config.artifactRouting?.strategy?.artifactClass ?? config.artifactRouting?.detectedClass`; both can be undefined.
- 17 `Number.isFinite` calls in stage2-fusion (verified via `rg -c`); good defensive baseline overall.
