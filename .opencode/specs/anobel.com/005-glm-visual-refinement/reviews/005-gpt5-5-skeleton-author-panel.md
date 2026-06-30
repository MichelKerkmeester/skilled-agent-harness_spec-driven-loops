# Panel Synthesis — Phase 005: gpt5-5-skeleton-author (A6)

> 5-model second-opinion panel. Advisory only — no spec edits, no implementation.
> Source reviews: `reviews/005-gpt5-5-skeleton-author/review-{glm,mimo,deepseek,kimi,minimax}.md`

## Panel table

| Model | Verdict | Confidence | Top gap | Top improvement |
|-------|---------|-----------|---------|-----------------|
| GLM-5.2 | AGREE-WITH-CHANGES | 0.74 | **No recovery path for a *spatially* invalid skeleton** — REQ-002 checks schema shape, not bbox overlap/containment; GPT-5.5 will emit schema-valid-but-colliding skeletons (RC-2 is exactly this) that silently reach GLM and re-fail | Add a **deterministic spatial validator between GPT-5.5 and GLM** (bboxContainment + pairwiseOverlap + titleZoneClear) and re-escalate once with violated-rule IDs ("node#3 overlaps node#5 by 18px; fix") — make it the P0, not an afterthought |
| MiMo-v2.5-Pro | AGREE-WITH-CHANGES | 0.65 | **Causal gap**: if GLM ignores the deterministic (004) skeleton, it will ignore the GPT-5.5 skeleton too — the bottleneck is GLM obedience, not skeleton quality; and 004 is untested | **Kill this phase; invest the effort in 004's deterministic skeleton quality first.** Build/measure 004; only build A6 if a 3-tile pilot shows GLM obedience (not skeleton quality) is the bottleneck |
| DeepSeek-v4-Pro | AGREE-WITH-CHANGES | 0.72 | GAP-1 no spatial validator (schema-valid ≠ spatially-valid); GAP-2 scaffold-to-GLM handoff untested; GAP-3 GPT-5.5 only addresses RC-1/RC-2, **not RC-3 (title) or RC-4 (casing)** which appear on 3 of the 5 lowest tiles | Add a deterministic geometry validator + one feedback retry (free, validator is code); micro-test whether GLM-5.2 can respect a locked HTML/CSS scaffold (≥85% position preservation) before building |
| Kimi-k2.7 | AGREE-WITH-CHANGES | 0.72 | **Unverified model slug** — spec dispatches `openai/gpt-5.5-fast --variant xhigh` but cli-opencode only documents `gpt-5.5-pro`; plus no enforceable token cap and the prompt omits the actual tile content payload | Insert a deterministic spatial validator + one conditional repair (not blind best-of-2); dry-run the prompt on the 5 worst tiles *today* — verify slug resolves, real token count, schema + spatial validity |
| MiniMax-M3 | AGREE-WITH-CHANGES | 0.72 | The mechanism **re-asks GPT-5.5 to do pixel-precise coordinate math** — exactly the RC-1/RC-2 failure mode; and `$/recovered-tile` is benchmarked against deterministic, when the honest comparator is downgrade-to-linear | Move trust from "GPT-5.5 picks coordinates" to **"GPT-5.5 picks a template + params; a deterministic engine places coordinates"** (8-12 pre-validated templates; output drops to ~150 tokens; validation is a finite enum) |

**Mean confidence: 0.71** (5 AGREE-WITH-CHANGES)

## Consensus (≥3 models agree)

1. **The escalation shape is correct**: paid GPT-5.5 as geometry/skeleton author only, never the renderer, never on linear or already-SHIP tiles; cost-capped at the boundary (≤1 call / ≤4200 tokens / batch budget on `N_2D`) — all 5 endorse.
2. **Schema-valid ≠ spatially-valid; a deterministic spatial validator is mandatory between GPT-5.5 and GLM** — all 5. GPT-5.5 will emit parseable-but-colliding skeletons; validate bbox containment + pairwise overlap + title-zone clearance, then feed violations back for ONE repair (cheaper and stronger than blind best-of-2).
3. **The single-shot assumption is over-optimistic** — all 5. The research's `+1 to +3 @ conf 0.78` is for *the approach*, not one non-iterative call; one more direct placement by a stronger model doesn't solve collision avoidance without a verification loop.
4. **The whole phase depends on an untested upstream (004) and an untested GLM-scaffold-obedience handoff** — glm, mimo, deepseek, kimi, minimax. If GLM rewrites the locked scaffold (the RC-3 failure mode), GPT-5.5's better skeleton delivers zero recovery for paid spend.
5. **The `+3` go/no-go bar is at/above the predicted ceiling — likely self-rejection** — mimo, deepseek, kimi, minimax. P(meeting +3) ≈ 0.33 under a uniform prior; the most likely outcome is rejection *after* spending the budget. Set the bar relative to 004's residual, or add a softer cost-effectiveness criterion.
6. **Add a failure taxonomy to SC-001** — glm, deepseek, kimi: tag each post-escalation failure `invalid_skeleton | collision_present | glm_rewrote_scaffold | still_overflow | downgraded` — otherwise the parent open question (worth-it vs downgrade?) is unanswerable.
7. **Run a cheap 3-5 tile probe before building the router/classifier/accountant** — all 5 (a 4-stage funnel: parses → valid coords → compiles → passes 001 gate).

## Divergence

- **Build it or kill it:** mimo is most aggressive ("kill this phase; fund 004"); minimax reframes the mechanism (template+params) to make it viable; glm/deepseek/kimi keep it but gate it behind a validator + pilot. kimi/minimax also say make A6 *contingent* on 004's measured residual rather than a fixed phase.
- **Root-cause coverage:** deepseek uniquely decomposes — GPT-5.5 can fix RC-1/RC-2 (spatial) but NOT RC-3 (title = instruction-following) or RC-4 (casing = text formatting), which cap the achievable +3 since RC-3/RC-4 dominate 3 of the 5 worst tiles.
- **Coordinate math vs template selection:** minimax's strongest-improvement (GPT-5.5 picks a template enum + params, deterministic expander does the math) is a structural alternative the others don't raise; it converges with phase 004's A7 renderer-first recommendation.
- **Token cap:** kimi (no enforceable cap → truncated JSON), glm (raise to ~6000), minimax (raise to ~8K or shrink schema), deepseek (≤4200 too small for dense tiles) — all agree 4200 is too low, disagree on the number.
- **Cost comparator:** minimax uniquely insists the A/B's third arm must be GPT-5.5 *vs downgrade-to-linear* (what 004 does anyway), not vs deterministic-only — a recovered 2D tile at 70 vs a linear version at 80 is a loss, not a recovery.

## Adopt-worthy improvements GPT-5.5 missed (ranked, cross-model)

1. **Deterministic spatial validator + one conditional repair between GPT-5.5 and GLM** (glm, deepseek, kimi, minimax — 4 models). bboxContainment + pairwiseOverlap + titleZoneClear + rowCap; on failure, re-dispatch once with offending node IDs; downgrade only if repair also fails. Free (it's code), closes the real RC-2 risk, replaces the weak "1 vs best-of-2" question, makes SC-001 diagnosable.
2. **GPT-5.5 picks a template + parameters; a deterministic engine places coordinates** (minimax) — 8-12 pre-validated templates in the 004 schema; prompt output ~150 tokens; validation is a finite enum, not free-form numbers. Bets on GPT-5.5's layout-pattern recognition (good) instead of its coordinate precision (bad). Converges with 004's A7 path.
3. **Make A6 contingent on 004's measured residual, not a fixed phase** (mimo, kimi, minimax) — build/measure 004 first; if the deterministic skeleton recovers 12+ of 18, escalation may be unnecessary. Set the go/no-go to `Y ≥ 3` *additional* recoveries over 004, with a `$/recovered-tile` floor.
4. **5-tile dry probe with the real prompt + real schema before building** (all 5) — measure the 4-stage funnel (parses → valid coords → compiles → passes 001 gate). If c→d <50%, the mechanism is broken; ~$2-5 / 10-30 min.
5. **Acknowledge the RC-3/RC-4 ceiling** (deepseek) — skeleton geometry can't fix title-position or ALL-CAPS-eyebrow; even perfect RC-1/RC-2 fixes only recover tiles where RC-3/RC-4 weren't dominant.
6. **Verify the model slug and add a hard token cap** (kimi, glm, minimax, deepseek) — confirm `openai/gpt-5.5-fast` resolves (`opencode models openai`); add `--max-tokens`/structured-output bound; raise the cap (~6-8K).
7. **Add the tile content payload to the prompt** (kimi) — the shown prompt is only canvas/constraint prose; GPT-5.5 needs the source brief/items/relationships (and possibly the reference image) to author a meaningful skeleton.
8. **GPT-5.5 API failure/timeout handling + a post-render scaffold-compliance DOM check** (glm-via-validator, deepseek, kimi, minimax) — equivalent to GLM's retry/backoff; after render, deterministically verify `data-layout-id`/`top`/`left`/`width`/`height` were preserved or the skeleton effort is wasted.
9. **Fix the `$/recovered-tile` comparator to downgrade-to-linear, and handle a zero denominator** (minimax, kimi) — and add a latency/wall-clock row (9-18 min of paid blocking for 18 tiles).
10. **Fix the absolute/relative coordinate framing in the prompt** (glm) — the prompt mixes absolute (`y=336..368`) and relative (`0..312`) framings without a labeled transform; GPT-5.5 will get it wrong.

## Red flags (≥2 models flag a risk)

- **Re-asks an LLM to do pixel-precise coordinate math — the exact RC-1/RC-2 failure mode** (minimax, deepseek, mimo) — "the central contradiction."
- **No spatial validator: schema-valid colliding skeletons silently re-fail** (all 5).
- **Depends on untested 004 + untested GLM-scaffold obedience** (all 5) — "dead on arrival" if GLM rewrites the scaffold (mimo, deepseek, minimax).
- **`+3` go/no-go ≈ coin-flip, biased toward self-rejection after paid spend** (mimo, deepseek, kimi, minimax).
- **RC-3/RC-4 are out of skeleton scope yet dominate the worst tiles** (deepseek) — caps the achievable lift.
- **Unverified `gpt-5.5-fast` slug + unenforceable token cap** (kimi; cap echoed by glm, deepseek, minimax) — a build-blocker if the slug doesn't resolve.

## Net recommendation

**REVISE → MAKE CONTINGENT (or defer).** Do not build as a fixed phase. Sequence it behind a measured 004: if the deterministic skeleton already recovers most of the 18, this phase may be unnecessary (mimo). If kept, the panel's mandatory changes are: (1) restructure to template-selection + a deterministic expander so GPT-5.5 never emits raw coordinates (minimax — converges with 004 A7); (2) add the deterministic spatial validator + one feedback repair (4-model consensus); (3) re-base the go/no-go on 004's residual with a cost-effectiveness floor and a downgrade-to-linear comparator; (4) verify the slug, cap tokens, and include the content payload. Gate everything behind the 5-tile funnel probe.
