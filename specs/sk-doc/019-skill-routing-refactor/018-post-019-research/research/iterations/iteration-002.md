# Iteration 2: Operational Calibration of Advisor Auto-Routing

## Focus

This iteration tested how advisor confidence and selective auto-routing should be calibrated when `0.82` is produced by categorical scorer branches rather than estimated correctness. The analysis separated three quantities that the current public field partially conflates: ranking strength, policy eligibility, and empirical probability of a correct route.

## Actions Taken

1. Traced `0.82` from the scorer constants through every confidence branch and the final confidence/uncertainty admission gate.
2. Recovered the latest current-source joined evaluation and compared floor frequency, plateau correctness, ambiguity, coverage, and threshold sensitivity.
3. Audited the committed calibration baseline for freshness and probability-calibration evidence.
4. Audited runtime recommendation-outcome and execution-outcome telemetry, including the shadow feedback calibrator and Beta-posterior reliability primitive.
5. Tested global-threshold, acceptance-only, and raw-confidence calibration strategies against the observed quantization and telemetry boundaries.

## Findings

1. **`0.82` is a policy-strength label, not a probability estimate.** The scorer first builds a continuous base from `liveNormalized`, then applies categorical floors for allowed read-only routes, task intent, and direct evidence; a separate branch pins derived-dominant results to `0.72`. Multiple causal paths therefore collapse onto the same public value. The field can remain compatibility-stable, but operators must interpret it as route strength unless a separately fitted correctness probability is emitted. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:380] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/scoring-constants.ts:170]

2. **The best current-source evidence rejects global threshold tuning.** On the 78-row holdout, the joined run produced `57/78` top-1 correctness, `61/78` coverage, and `85.25%` selective precision. Exact `0.82` covered `20/78` holdout rows but only `13/20` were correct; the ambiguity slice's exact-floor plateau was `7/12`. Every confidence threshold from `0.78` through `0.82`, crossed with uncertainty thresholds from `0.30` through `0.40`, produced identical outcomes. Raising confidence to `0.84` cut coverage from `61/78` to `42/78` for only a `2.85`-point selective-precision gain. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/001-research/002-skill-advisor-routing-research/research/iterations/iteration-008.md:15]

3. **The committed probability baseline cannot govern current routing.** It records 200 corpus rows from 2026-04-25, while the current joined study used a 193-row source-loaded corpus and the implementation packet still marks measurement repair and the shadow floor experiment incomplete. Its `0.8-0.9` reliability bin reports `70.59%` accuracy at `0.8457` average confidence, which independently shows over-confidence, but the corpus mismatch makes it historical evidence rather than a release gate. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/bench/scorer-calibration-baseline.json:1] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/012-skill-advisor-routing-fixes/tasks.md:70]

4. **Operational calibration requires a joined decision-outcome record, not acceptance counts alone.** The implementation correctly distinguishes recommendation outcomes (`accepted`, `corrected`, `ignored`) from task execution success; accepting a route does not prove the selected skill completed the task. However, aggregate emitted-confidence metrics and prompt-free outcome stores do not by themselves preserve the decision features needed for calibration: confidence branch, pre-floor base, direct score, ambiguity cluster, runtime, freshness, selected hub/leaf, policy fingerprint, and route risk. Those bounded fields must be joined by an idempotent decision/event identifier before reliability or selective-risk estimates are causally attributable. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/metrics.ts:98] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/metrics.ts:639]

5. **Selective auto-routing should be risk-stratified and lower-bound governed.** Keep the compatibility gates at confidence `0.80` and uncertainty `0.35`; they are admission policy, not calibrated probability. Fit a separate empirical correctness/reliability estimate over sealed outcomes, stratified at minimum by explicit-command versus inferred route, ambiguity state, runtime/freshness, hub/leaf or archetype, and read-only versus mutating/external-effect surface. Auto-route only when the stratum's preregistered lower confidence bound clears its allowed error budget; otherwise clarify or defer. Explicit user routes remain deterministic. Read-only, unambiguous routes may use a more permissive budget. Mutating or external-effect routes may be selected automatically, but authority remains withheld through VERIFY/COMMIT. The existing Beta-posterior primitive supplies conservative cold-start behavior, count floors, distinct-source voting, replay resistance, and no path to false certainty, but it is currently shadow policy rather than evidence that this calibration is live. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/beta-reliability.ts:1] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/beta-reliability.ts:278]

## Questions Answered

- **How should advisor confidence and selective auto-routing be calibrated from operational evidence when the `0.82` floor is a quantized policy value rather than a probability?**
  - **Answered at the policy-method level:** retain `0.80/0.35` as compatibility admission gates, expose or derive a separate empirical correctness estimate, and govern automatic routing by risk-stratified selective error using conservative lower bounds over joined recommendation and execution outcomes.
  - **Numeric risk budgets remain open:** the repository has no current, completed operational outcome study from which to set per-stratum error budgets. Those values must be preregistered and validated on sealed data rather than inferred from the authored corpus.

## Questions Remaining

- What minimum cross-runtime telemetry proves ordered, successful, causally attributable leaf use?
- Does two-tier required/supplemental leaf selection beat monolithic unioning on sealed-holdout recall within a preregistered route budget?
- Do authored route-gold and typed fixtures predict behavior on unseen natural prompts, or are they overfit?
- What per-stratum error budgets should govern low-risk versus mutating/external-effect auto-routing once joined operational outcomes exist?
- The missing primary hypothesis file still prevents direct comparison with the two claimed post-019 surveys.

## Ruled Out Directions

- **Treat exact `0.82` as 82% correctness:** the observed holdout plateau was `13/20`, and multiple categorical branches emit the same value.
- **Tune only the global confidence or uncertainty threshold:** the tested `0.78-0.82` by `0.30-0.40` grid was behaviorally identical, while `0.84` imposed a poor coverage/precision trade.
- **Fit a probability calibrator directly to the post-floor confidence alone:** quantization loses the causal branch and pre-floor ranking information needed to separate materially different cases.
- **Use recommendation acceptance as the sole success label:** acceptance and task execution success are explicitly different signals in the runtime contract.

## Edge Cases and Evidence Limits

- The 193-row joined run is current-source but fixture-based; it is not an unseen natural-prompt production sample.
- The 200-row Brier/ECE baseline is useful historical evidence but stale relative to the current corpus.
- Prompt-free telemetry protects user content, but calibration still needs bounded decision features and a join key; raw prompts are unnecessary.
- Per-skill operational samples can be sparse and concentrated. Count floors, distinct-source requirements, and conservative lower bounds are required before any automatic policy promotion.

## Assessment

- New information ratio: `0.72`
- Novelty justification: prior work established floor saturation; this iteration added the joined-outcome requirement, separated policy strength from correctness probability, and derived a risk-stratified lower-bound rule for selective auto-routing.
- Questions addressed: 1
- Questions answered: 1 at the method level; numeric risk budgets remain unresolved.
- Confidence: high for the quantization and threshold conclusions; medium for the proposed operational policy until sealed runtime outcomes are collected.

## SCOPE VIOLATIONS

- Progressive synthesis would normally update `research/research.md`, and the mode contract normally lets the reducer update strategy state. This dispatch authorizes neither path, so both mutations were left to the workflow reducer.

## Next Focus

Define the minimum cross-runtime decision, dispatch, leaf-start, leaf-finish, and receipt telemetry needed to prove ordered, successful, causally attributable leaf use without storing raw prompts.
