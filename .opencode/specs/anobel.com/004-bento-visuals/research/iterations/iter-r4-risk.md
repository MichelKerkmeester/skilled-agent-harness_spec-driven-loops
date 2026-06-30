SKILL ROUTING: advisor returned ambiguous `cli-opencode` and `sk-prompt-models` above confidence threshold. I’m loading both read-only; no external CLI dispatch is needed for the critique unless the skill contract says otherwise. 
The OpenCode skill confirms no self-dispatch is appropriate from this runtime; the GLM path matters only as model/provider constraints. I’m reading the GLM/MiniMax prompt-craft and budget references so the cost critique is grounded in local model guidance.**Verdict**
The pipeline is directionally right: move spatial reasoning out of prose and into validators/skeletons. Main risk is that it may raise `SHIP` by downgrading or over-gating, not by improving visual quality. Treat the predicted lift as a hypothesis, not a forecast.

**1. Failure Modes**
| Failure Mode | Risk |
|---|---|
| Validator overfit | DOM/CSS gates can pass technically valid but visually dull outputs. `RC-7` slop will not be solved by bbox/contrast alone. |
| False geometry failures | Bbox overlap gates can flag intended connector proximity, shadows, icons, or decorative layering unless the rules distinguish content text from non-content geometry. |
| False geometry passes | DOM boxes miss semantic crowding, awkward rhythm, visual imbalance, connector ambiguity, and text that is readable but compositionally bad. |
| Contrast gate blind spots | Gradients, opacity, anti-aliasing, shadows, blend modes, and screenshots can differ from computed CSS contrast. |
| Repair pass regression | A typed repair can fix overlap while changing copy, hierarchy, casing, glyphs, or semantic grouping. Locking helps, but models still drift. |
| Skeleton quality bottleneck | Skeleton-first moves the hard problem upstream. If skeleton scoring is weak, GLM will faithfully render bad geometry. |
| 2D downgrade inflation | `linear-flow`/`stacked-list` can improve pass rate while reducing the value of diagrams. This is a quality trade, not pure lift. |
| MiniMax audit noise | External visual audit can introduce false positives or subjective taste changes unless measured against human labels first. |
| Direct Z.AI API operational drift | GLM vision via direct API is justified, but bypasses the normal executor path. Auth, endpoint, slug, and payload behavior become pipeline dependencies. |
| Latency tail | Local GLM profile shows observed `6-161s`, avg `~26s`, and about `1/45` transient dispatch failures. A tight timeout will bias the experiment downward. |

**2. Recommendations That Might Not Lift Quality**
| Recommendation | Why It Might Not Lift |
|---|---|
| A2 rubric expansion | GLM-5.2 profile favors lean COSTAR prompting. Long rubric prose risks omission and instruction dilution. Keep metadata short and machine-checked. |
| A4 MiniMax repair adapter | Useful only if MiniMax findings have high precision. Otherwise it adds paid calls and repair churn after deterministic pass already handled obvious failures. |
| A6 GPT-5.5 skeleton author | Likely too expensive as default. Use only when deterministic skeleton/ranker fails on high-value 2D tiles. |
| A7 full Bento Geometry Kernel | Correct architecture, but high engineering cost. It can become a custom renderer project before ROI is proven. |
| Literature-backed lift estimates | Papers support mechanisms, not your tile-specific delta. They justify experiments, not `+N` shipped tiles. |
| One repair pass for 2D layouts | Good for local fixes, weak for fundamentally overcrowded geometry. Dense node/matrix/funnel failures need replanning, not patching. |
| A1 safe linear contract | High pass-rate lift, but may reduce visual richness. It can win by avoiding hard layouts rather than improving them. |

**3. Cost Ceiling**
Assuming GLM dispatch cost is `0` under the Z.AI plan, the real costs are quota, latency, and paid escalation calls.

| Tile Path | Paid Calls | GLM Calls | Expected Wall-Clock |
|---|---:|---:|---|
| Linear pass first try | `0` | `1` | `~30-45s` typical including render/gate |
| Linear fail + one GLM repair | `0` | `2` | `~60-120s` typical, slow tail can hit `3-6 min` |
| 2D with deterministic skeleton | `0` | `1-2` | `~1-3 min` typical |
| 2D skeleton fail + best-of-3 deterministic skeletons | `0` | `2-3` | `~2-5 min` typical |
| 2D with GPT-5.5 skeleton escalation | `1-4 GPT-5.5` | `1-3` | likely `4-12 min` serial, exact paid price unknown |
| MiniMax visual audit added | `+1 MiniMax` | unchanged | add one paid vision/audit latency per audited tile |

Batch ceiling for 45 tiles:

| Scope | Ceiling |
|---|---|
| A1 + gate + one repair, using baseline `18` failures | `45 + 18 = 63` GLM calls, `0` paid calls |
| MiniMax on every tile | `45` paid MiniMax calls, likely unnecessary |
| MiniMax failure-only on baseline failures | up to `18` paid MiniMax calls |
| GPT-5.5 skeleton on all 2D failures | `N_2D * 1-4` paid GPT-5.5 calls |
| Worst paid escalation if every failing tile is high-risk 2D | up to `18 * 4 = 72` GPT-5.5 calls plus up to `18` MiniMax calls |

Exact dollar ceiling is `UNKNOWN` without live token prices and prompt/image sizes. Track ceiling as `paid calls × avg input/output/image tokens × provider price`.

**4. Pilot First**
Pilot in this order:

| Pilot Step | Goal |
|---|---|
| Offline validator calibration on existing 45 renders | Measure false positives/false negatives before spending model calls. |
| A1 prompt + deterministic gate + one GLM repair on a stratified sample | Use 12-15 tiles: linear winners, known 2D failures, borderline contrast/title failures. |
| Shadow MiniMax audit only | Run MiniMax but do not gate on it. Compare precision against human labels. |
| Skeleton-first only on residual 2D failures | Test deterministic skeleton quality before adding GPT-5.5. |
| GPT-5.5 skeleton author only as A/B escalation | Compare against deterministic skeletons on the same failed 2D cases. |

Go/no-go metrics:

| Metric | Suggested Bar |
|---|---|
| Linear no-regression | `>=90%` of prior linear winners still pass and remain semantically equivalent |
| Validator precision | `<15%` human-disagreed blocks |
| Repair safety | `0` copy/casing/glyph regressions on locked fields |
| 2D recovery | at least `+3` recovered tiles in the pilot sample before building A7 |
| Cost | no paid calls in first pilot except shadow MiniMax sample |
| Latency | median per tile under `90s`; slow-tail policy explicit |

**5. Over-Optimistic Lift Assumptions**
| Claim | Concern |
|---|---|
| `34-37/45` from first move | Plausible, but only if “ship” allows safer downgrades. If preserving diagram richness matters, expect lower lift. |
| `39-41/45` optimistic full pipeline | Aggressive for `n=45`. One tile is `2.2 pts`, so `+1` to `+3` tile claims are noisy. Use paired tile-level deltas. |
| A1/A3/A4/A5 contributions | Strongly overlapping. Do not add gains from prompt, repair, skeleton, and audit independently. |
| Skeleton-first `+2` to `+4` | Assumes skeleton scoring predicts real rendered quality and GLM follows the skeleton. Both need proof. |
| MiniMax `+1` to `+3` | Only true if its findings are precise and repairable. Otherwise net effect can be zero or negative. |
| `95-100%` contrast exit-0 | This is mostly tautological if contrast is a hard gate. It proves accepted outputs pass contrast, not that the system shipped more good tiles. |
| Literature transfer | The cited systems support the architecture, but they do not validate GLM-5.2 on your tile distribution. |

Best first move remains A1 + deterministic gate + one repair, but define success as paired quality lift with semantic preservation, not just a higher `SHIP` count.