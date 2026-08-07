# Phase 015 — Next-Steps Advisory

> **Authoring note**: This document was synthesized by the main agent from the 015 line's empirical record after two cli-codex gpt-5.5 xhigh dispatches were blocked by sandbox boundary + Gate 3 enforcement before they could complete a file write. The core opinionated recommendation (Option 1 below) is codex's verbatim conclusion captured in its first-dispatch log; the supporting structure was filled by the main agent against the 015 packet evidence.

---

## 1. Executive Summary

- **Phase 015 status**: 8 sub-packets shipped on origin/main (`ed22e0e4a` through `48d5470bc`). Cosine lane works at weight 0.05; structurally complete; empirically stuck.
- **Top-1 recommendation**: Open a **routing-calibration packet that attacks explicit/lexical over-fire**, with the cosine lane and `graph_causal` lane treated as confirming evidence rather than guessed fixes.
- **Effort estimate**: Medium-Large (M-L). 400-800 LOC across scorer + tests + corpus instrumentation. 15-25 min codex dispatch for the design phase; 20-40 min for implementation phase.
- **Top risk**: Damping explicit/lexical at the wrong evidence threshold flips correctly-routed prompts. Must be sweep-driven, not heuristic.
- **What to expressly NOT do**: Raise semantic weight above 0.30 to force cosine to matter. The 015/004 + 015/007 evidence proves that path is dead — V6-cosine-dominant at semantic=0.30 produces ZERO flips on either corpus.

---

## 2. Ranked Options (5 candidates)

### Option 1 — Routing-calibration: damp explicit/lexical when their evidence is weak ⭐ RECOMMENDED

- **Mechanism**: Add a per-lane evidence-confidence factor. Right now `explicit_author 0.42 + lexical 0.28` always contribute their full weighted score even when their evidence is weak (a single partial keyword match, an ambiguous skill-name fragment). Introduce a damping factor that reduces lane contribution when its raw evidence is below a threshold, freeing `graph_causal` + `semantic_shadow` to actually decide ambiguous cases. Sweep the damping curve against the existing 24-prompt + 22-harder corpora using the 015/003 sweep harness extended for this lane shape.
- **Expected impact**: This is the only path with a credible mechanism for moving the harder-corpus accuracy (0.2273) upward. The 015/007 evidence (0 flips at every semantic weight from 0.00 to 0.30) shows the cosine lane can't outweigh dominant lanes by raw magnitude alone; damping their over-fire is the same fix from the other side.
- **Effort**: M-L. ~400-800 LOC across `scorer/fusion.ts` (damping), `scorer/lane-registry.ts` (per-lane damping config), Vitest harness extensions, plus an additional sweep dimension.
- **Risk**: Medium. Damping can cause today-correct routings to flip if the threshold is wrong. Must be sweep-driven with the today-correct baseline (1.0000 on the 24-prompt corpus) as a hard floor.
- **If we did this**: Next packet's deliverable = "Lane-evidence damping factor + sweep recommendation". Result either lifts the harder-corpus accuracy materially, or definitively rules out the damping approach.

### Option 2 — Switch embedding model (Gemma → BGE-M3 / nomic / Qwen)

- **Mechanism**: Swap the active embedding provider's model for a different family. Cosine scores might be more discriminating with a different vocabulary or instruction tuning.
- **Expected impact**: Unknown. Same fundamental problem — the lane's relative magnitude is what blocks flipping decisions, not the cosine values' absolute quality. The 015/007 V6-cosine-dominant test (semantic=0.30) already gave the cosine lane a 6× weight bump and still got zero flips. A different model produces different cosine values but the same fusion math.
- **Effort**: M. ~200-400 LOC across factory.ts, the new provider's adapter, sweep re-run.
- **Risk**: Medium-High. Provider swap affects Memory MCP search too — much bigger blast radius than 015 line had.
- **If we did this**: Next packet's deliverable = "BGE-M3 (or similar) provider + comparative sweep". Likely lands the same +0.0 delta but rules out the embedding-model hypothesis.

### Option 3 — Author a HARDER corpus + lexical-blind probes

- **Mechanism**: Author 30-50 additional prompts that the lexical lane is structurally incapable of routing (e.g., prompts that use ONLY domain vocabulary not in any skill's trigger_phrases, or prompts that match the wrong skill's keywords by 2-3× the right skill's keywords). Rerun the sweep against the even-harder corpus.
- **Expected impact**: Low. 015/007's 22-prompt harder corpus already saw zero flips at every weight. Adding more of the same kind probably produces the same result. Useful only if combined with Option 1 to give the damping factor more signal.
- **Effort**: S. ~100-200 lines of fixture authoring + a sweep re-run.
- **Risk**: Low. Test fixtures only; no production changes.
- **If we did this**: Next packet's deliverable = "Corpus v3 + sweep". Provides marginal additional evidence, mostly redundant with 015/007.

### Option 4 — Tune `confidenceThreshold` + `uncertaintyThreshold` instead of lane weights

- **Mechanism**: The advisor returns "unknown" or "ambiguous" when scores fall below `confidenceThreshold` (0.8) or above `uncertaintyThreshold` (0.35). Lower the confidence threshold so the cosine lane's small ~0.023 weighted contribution can push borderline-correct routings over the line.
- **Expected impact**: Mixed. Could improve recall on borderline prompts but also surfaces low-confidence routings to consumers as authoritative — false confidence is worse than abstention.
- **Effort**: S. ~50-100 LOC + threshold-sweep extension.
- **Risk**: Medium. Lowering confidence threshold globally changes the "ambiguous" / "unknown" return rate; downstream consumers may not handle the shift gracefully.
- **If we did this**: Next packet's deliverable = "Threshold sweep + recommendation". Less mechanistic than Option 1; addresses the symptom not the cause.

### Option 5 — Pause the optimization track, let cosine bake against real telemetry

- **Mechanism**: Ship-and-observe. Run the current 0.05 weight in production for 1-4 weeks, collect actual advisor invocations + their outcomes (was the recommended skill the one the user wound up using?), then revisit with real telemetry instead of synthetic 24/22-prompt corpora.
- **Expected impact**: High-quality data, but slow. Builds a feedback corpus that future packets can sweep against authentically.
- **Effort**: S now (instrumentation only), large later when telemetry is consumed.
- **Risk**: Low. No code or metadata change near-term.
- **If we did this**: Next packet's deliverable = "Advisor telemetry capture + reporting harness". Defers the optimization question by 1-4 weeks.

---

## 3. Top-1 Recommendation Expanded — Option 1 (Routing-Calibration)

**Why this beats the other 4:**

The 015 line proved one thing definitively: **the cosine lane has no leverage to overturn explicit/lexical decisions at any weight from 0.00 to 0.30**. This is not a corpus problem (015/007 confirmed) and not a metadata-quality problem (015/006 confirmed). It is a fusion-magnitude problem.

There are only two fusion-magnitude levers: (a) give the cosine lane more weight, (b) reduce the dominant lanes' weight or contribution under specified conditions. Path (a) is empirically dead — V6-cosine-dominant tested it and lost. Path (b) is unexplored and is the only credible remaining lever.

Option 2 (different model) doesn't change the fusion magnitudes. Option 3 (harder corpus) doesn't change anything mechanical. Option 4 (thresholds) trades correctness for recall in a non-targeted way. Option 5 (pause) doesn't act on what we already know.

Option 1 is the only candidate that has a credible mechanism for actually moving the harder-corpus accuracy and is grounded in what the empirical data has already proved. The damping is sweep-driven (using the 015/003 harness, extended for the new dimension), so it inherits the rigor the 015 line built.

**How it interacts with 015's already-shipped work:**

- It builds on: 015/001 cosine lane, 015/003 sweep harness, 015/004 seeded sweep helper, 015/007 harder corpus, 015/008 graph_causal feed.
- It does NOT supersede: 015/002's 0.05 weight stays as the cosine baseline.
- It pivots away from: any further weight-tuning of the cosine lane alone; that path is exhausted.

**Packet placement:**

This is **a new top-level packet under 026**, not 015/009. Reasoning:

- 015 was specifically the "skill advisor semantic lane" track. Damping explicit/lexical is a different shape of intervention — it touches lanes 015 didn't.
- The new packet's natural name would be something like `017-advisor-evidence-damping` or `017-advisor-routing-calibration`.
- 015 stays a closed line documenting "the cosine lane is built, calibrated, and validated; the next track is elsewhere."

---

## 4. What We Expressly NOT Do

**Do not raise semantic weight above 0.30.** 015/007 already tested V6-cosine-dominant at 0.30 and got zero flips on both corpora. Pushing higher would either (a) produce the same zero-flip result, OR (b) start flipping today-correct routings as semantic begins outweighing dominant lanes by raw magnitude. Both outcomes are bad; the first wastes effort, the second causes regressions. The 015/002 ADR-001 already discusses this as the rejected aggressive-weight path. No reason to relitigate.

**Do not author yet another harder corpus.** Diminishing returns. 015/007 took accuracy from 0.6667 → 0.2273 (a -0.44 delta) with 22 fixture prompts — that's already a hard corpus. Adding more prompts of the same kind would just be more data points proving the same conclusion: cosine doesn't flip routings via fusion magnitude. Useful only when combined with Option 1, not as a standalone next step.

**Do not switch embedding models without a hypothesis.** Provider swap (Voyage → BGE-M3 → nomic, etc.) without a specific theory about why the new model would solve the magnitude problem is just rolling the dice. The cosine values are not the issue — the fusion math is. A different model produces different cosine VALUES; the fusion still weights them at 0.05 against the dominant 0.70 explicit+lexical block.

**Do not tune `confidenceThreshold` / `uncertaintyThreshold` blindly.** These thresholds gate whether a recommendation is returned at all. Tuning them produces correctness-vs-recall tradeoffs that aren't the question we're trying to answer. The question is "does cosine influence routing on hard prompts," not "are we returning too few recommendations." Different problem.

**Do not add a 6th lane.** Premature complexity. The 5-lane fusion is already underspecified — `graph_causal` was starved of skill-side input until 015/008 a few hours ago, and the field hasn't had time to stabilize. Adding another lane before understanding why 5 lanes can't flip routings on lexical-saturated prompts is engineering ahead of evidence.

---

## 5. Open Questions (need real telemetry or product decisions)

- **What is the actual distribution of intent-described vs lexical-keyword-rich prompts in real advisor invocations?** If real prompts are >90% lexical-keyword-rich, the 015 work is correctly tuned for production and Option 1's leverage may not actually move real-world routing. The 24+22 synthetic corpora are best-case-for-cosine; live distribution may differ.

- **What outcome are we actually optimizing for?** Recommended-vs-used skill agreement? User-corrected routing rate? Time-to-skill-execution? The 015 line optimized "accuracy on a synthetic corpus" but the production goal hasn't been pinned down.

- **What is the cost of a wrong routing in production?** If wrong routing just shows an inferior recommendation that the user ignores, the cost is small; aggressive damping (Option 1) is safe. If wrong routing autonomously executes a tool against a wrong target, cost is high; damping must be conservative.

- **Is there an even simpler dominant-lane fix available — fixing trigger_phrases on the over-firing skills directly?** The 015/006 packet edited 8 skills' trigger_phrases per the audit. A future audit could specifically find skills whose trigger_phrases match too broadly (causing the over-fire that Option 1's damping addresses).

- **Does the skill-advisor daemon's caching behavior affect any of this?** The daemon caches recommendations. If a daemon-cached "wrong" recommendation persists across many invocations, the production impact of a damping change might be amplified or muted depending on cache TTL.

---

## Appendix: Key Empirical Anchors from the 015 Record

| Packet | Key Finding |
|--------|-------------|
| 015/004 | Original 24-prompt corpus, all 7 weight vectors: `accuracyTotal 0.6667 / intentDescribed 0.3333 / flippedFromBaseline 0` |
| 015/006 | Audit-improved metadata, all 7 vectors: still +0.0000 delta on every metric |
| 015/007 | Harder 22-prompt corpus, all 7 vectors: `accuracyTotal 0.2273 / intentDescribed 0.2273 / flippedFromBaseline 0`. V6-cosine-dominant at semantic=0.30 included. |
| 015/008 | `advisor_recommend("run a deep review")` → `deep-review` with `graph_causal_rawScore=0.24` (was 0 before). Proves skill-side input now reaches the lane. |
| Current production weights | explicit 0.42 / lexical 0.28 / graph_causal 0.13 / derived 0.12 / semantic 0.05 |

The "dominant lanes" referenced throughout this advisory are explicit + lexical = combined 0.70 weight, vs `graph_causal + derived + semantic = 0.30`. Even at V6-cosine-dominant (semantic 0.30), the combined "non-explicit/lexical" weight stays at 0.55 vs explicit+lexical's 0.45 — but routing is still dominated by explicit + lexical because their RAW SCORES on lexical-saturated prompts are 0.30-0.50, swamping cosine's 0.20-0.40 raw scores at any weight.
