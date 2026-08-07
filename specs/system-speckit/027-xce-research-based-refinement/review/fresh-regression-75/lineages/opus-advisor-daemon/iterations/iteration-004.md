# Seat opus-advisor-daemon — iteration 4 (global #15)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-advisor-daemon
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=0

## Analysis

I have traced the full behavior of my assigned slice. Here is my analysis.

## Review: opus-advisor-daemon — feedback calibration shadow-only / non-mutating

**Angle:** shadow-only lane weights truly default-off / non-mutating; no leak into live scoring.

### What I traced (real call paths, not names)

**1. Default-OFF gate is real.** `isAdvisorFeedbackCalibrationEnabled` (feedback-calibration.ts:142-147) returns `false` unless `SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW` is explicitly one of `true/1/yes/on/enabled`. `recordAdvisorFeedbackCalibrationIfEnabled` (255-265) early-returns `null` when disabled — no file write, no computation. Unset env ⇒ no-op. ✓

**2. Output is write-only telemetry, never read back.** The only runtime caller is `validateAdvisor` (advisor-validate.ts:533), the heavy `advisor_validate` tool. Its return value isn't even captured. The report is persisted to a tmp JSONL (`persistAdvisorFeedbackCalibrationRecord`, 241-253) under `tmpdir()/speckit-skill-advisor-calibration/` or an operator-set path. I grepped every non-test/non-dist consumer of the module and the persisted-path/flag symbols: only `feedback-calibration.ts` (self), `weights-config.ts`, and `advisor-validate.ts` reference it. The `weights-config.ts` "match" is just the literal model-name string `'advisor-feedback-calibration-shadow-v1'` (lines 36, 72) — **not** an import; the dependency is the reverse direction. ✓

**3. Live scoring is structurally insulated.** `fusion.ts` sources weights from `DEFAULT_SCORER_WEIGHTS` / `effectiveScorerWeights(laneWeightsOverride)` (fusion.ts:69-81, 336) — never from any calibration report. Shadow lanes get `weightedScore = 0` via `shadowOnly = !isLiveScorerLane(lane)` (fusion.ts:362-366). The live recommend path (`advisor-recommend.ts`) has **zero** calibration/feedback references. ✓

**4. In the production handler path the proposal cannot even propose a weight change.** The handler calls the reducer *without* `laneAttributionBySkill` (advisor-validate.ts:536-542) ⇒ `hasAttribution = false` (feedback-calibration.ts:164) ⇒ every lane signal resolves to `'excluded'`/`no_lane_attribution_excluded`, `proposedDelta = 0` (171-178), `weightDeltas = {}`. So `proposedWeights === currentWeights` and `guardrails.noLaneAttributionFallback = true`. The report's `liveWeightsFrozen/autoPromotion:false/shadowOnly/defaultOff` booleans accurately match observed behavior. ✓

**5. Shadow lane is excluded from the calibration set entirely.** `SCORER_LANES` = `SCORER_LANE_IDS` = the 5 live lanes only; the BM25 shadow lane lives in the separate `SHADOW_SCORER_LANE_DEFINITIONS` (lane-registry.ts:21-29) and is never iterated by the reducer. The `isLiveScorerLane` guard at feedback-calibration.ts:175 is therefore redundant-but-defensive, not a defect.

### Things I considered and rejected as findings
- **Read-modify-write race in `persistAdvisorFeedbackCalibrationRecord`** (247-251): concurrent `advisor_validate` runs could drop a record. Rejected — default-off, gated behind `confirmHeavyRun`, and the data is observe-only telemetry with no live impact. Explicitly shadow/observe-only code, which the brief excludes from defect status.
- **Nonzero threshold deltas in the persisted report when sample count ≥ 8 and unconcentrated** (193-203): real, but it's an isolated JSON report nothing consumes; runtime thresholds come from `DEFAULT_ADVISOR_*_THRESHOLD` constants. No leak.

No P0/P1/P2 defect found on this angle. The shadow calibration lane is genuinely default-off, non-mutating to live weights/thresholds, and architecturally incapable of leaking into the live scorer.

```json
{"seat":"opus-advisor-daemon","model":"claude-opus-4-8","angle":"Advisor feedback calibration: shadow-only lane weights truly default-off / non-mutating; no leak into live scoring.","verdict":"PASS","summary":"Shadow calibration is default-off (env-gated), write-only to a tmp JSONL nothing reads back, and structurally insulated from fusion/recommend. In the production handler path it proposes zero weight deltas. No leak.","files_reviewed":[".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts",".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts",".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts",".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts",".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts",".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts"],"findings":[]}
```
