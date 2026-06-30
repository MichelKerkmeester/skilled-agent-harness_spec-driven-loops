# Panel Synthesis — Phase 003: minimax-auditor-in-loop (A4)

> 5-model second-opinion panel. Advisory only — no spec edits, no implementation.
> Source reviews: `reviews/003-minimax-auditor-in-loop/review-{glm,mimo,deepseek,kimi,minimax}.md`

## Panel table

| Model | Verdict | Confidence | Top gap | Top improvement |
|-------|---------|-----------|---------|-----------------|
| GLM-5.2 | AGREE-WITH-CHANGES | 0.80 | The deterministic gate is blind exactly where A4's targets live (RC-2 node collision); your strongest gate is orthogonal to your hardest defect, so `false_fix_rate ≤ 1/18` isn't measurable on that cohort | Before building, **decompose the 18 FIX rows by RC-id**; fold RC-1/RC-3 (procedural) into 001's repair, route RC-2 (gate-blind collision) to phase 004, shrink A4 to a validation harness; add a `classifyFixes` gold-set precision gate (≥85%) + a 2nd-auditor/human spot-check |
| MiMo-v2.5-Pro | AGREE-WITH-CHANGES | 0.72 | `classifyFixes` regex over-fires: the word "node"/"matrix" matches almost any issue, so accountbeheer-4 (pure RC-1 overflow) also gets a redundant RC-2 fix, wasting a slot and sending GLM conflicting instructions | **Collapse A4 into the 001 repair pass** as optional MiniMax-evidence injection — 80% of value at 20% of cost (no adapter, no rescore, no double-repair); ~+4-6 conversions at ~1.05x latency |
| DeepSeek-v4-Pro | AGREE-WITH-CHANGES | 0.78 | The adapter ignores structured booleans already in the audit JSON (`overflow`, `title_at_bottom`, `readable`, `on_brand`) and runs fragile regex on free text instead | Make `classifyFixes` **consume the boolean columns** as the primary signal; regex only for dimensions without booleans (RC-2 collision, RC-4 casing). Also: post-process HTML for palette/contrast/title fixes instead of full re-gen |
| Kimi-k2.7 | AGREE-WITH-CHANGES | 0.72 | **Sequencing conflict**: research `iter-r4-pipeline.md` puts MiniMax→JSON at step 10 (after skeleton-first 7-9), but the plan runs A4 as phase 003 *before* 004/005 — burning round-2 calls on hard 2D tiles skeleton-first is meant to solve | Narrow A4 to a **post-skeleton, post-downgrade audit translator**: let 001 + 004/005 own geometry; A4 handles only RC-5 contrast / RC-6 off-brand / RC-4 casing; for hard 2D, *describe* the defect but route to 004/005 |
| MiniMax-M3 | AGREE-WITH-CHANGES | 0.70 | GLM round-2 compliance on round-1-ignored instructions is the load-bearing assumption with no empirical basis; A4 *adds* a typed-JSON block, increasing prompt density (the RC-3 root cause) | Run a **3-arm A/B (T0 raw issue / T1 typed-JSON / T2 fresh round-1 + distilled rules)** on the 18 FIX tiles — answers "is the typed JSON doing the work, or is any feedback?" and "is A4 even needed vs a cheaper augmented regen?" |

**Mean confidence: 0.74** (5 AGREE-WITH-CHANGES)

## Consensus (≥3 models agree)

1. **Generator ≠ auditor is correct and load-bearing.** All 5 cite the same evidence: GLM confabulates audits (the fake orange CTA + `#cccccc` in `vision-audit-benchmark.md §3`). Keeping MiniMax as auditor + GLM as repairer is the right Self-Refine variant.
2. **The adopt-if gate (deterministic checks + MiniMax rescore + non-regression snapshot) is the right safety net** — all 5.
3. **Failure-only routing (skip the 27 SHIP sentinels) is correct cost discipline** — all 5.
4. **`classifyFixes` regex is the brittle, load-bearing weak link that will misroute fixes** — all 5. A misclassified fix contract is *worse than none* (glm: "instructs the wrong repair"). Concrete misfires named: accountbeheer-4 (RC-1) also tagged RC-2 (mimo, minimax, kimi); "red square"/off-brand red mis-tagged as typography (kimi, minimax).
5. **Marginal value is thin and A4 may belong inside 001 or after 004/005** — glm, mimo, deepseek, kimi all argue some form of collapse/re-sequence. The spec's own SC-001 admits standalone 5-7 → integrated +1-3 after overlap.
6. **The 5-7 conversion prediction is over-optimistic / RC-mix-dependent** — glm, mimo, deepseek, minimax. Procedural RC-1/RC-3 fixes are GLM-doable (and duplicate 001); genuine RC-2 collision is not single-shot fixable. Split the prediction by mechanical (~3-6) vs judgment/2D (~0-1).
7. **Forcing 2D→linear primitives destroys product semantics** — deepseek, kimi (a rights matrix / routing diagram loses cross-product / topology meaning); the adopt-if gate checks defects but not whether the tile still represents the data.

## Divergence

- **Where A4 should sit:** mimo/deepseek → fold into 001 (evidence injection / HTML post-process); kimi → run *after* 004/005 as a translator; glm → shrink to a validation harness keyed on RC-mix; minimax → prove it's needed at all via the 3-arm test first.
- **How to fix the classifier:** deepseek/minimax → use the audit JSON booleans (regex is redundant); mimo → tighten regex to require spatial verb-near-noun; glm → add an ≥85% gold-set precision gate before any generation.
- **T0 comparator design:** glm/kimi/minimax all say the spec's T0 ("generic improve this") is a strawman; a fair T0 must share the same evidence (raw MiniMax issue text + render) and differ only in structure — else the A/B measures schema-vs-no-context, not schema-vs-prose.
- **One-shot vs recurring** (glm): if this is a one-time 45-tile improvement, hand-authoring 18 fix-JSONs (1-2h, zero classification error) dominates building a regex classifier; the adapter only earns its cost if the pipeline regenerates new tile sets repeatedly. The spec never says which.

## Adopt-worthy improvements GPT-5.5 missed (ranked, cross-model)

1. **Use the audit JSON's structured booleans as the primary classification signal** (deepseek, minimax, mimo). `overflow`→RC-1, `title_at_bottom`→RC-3, `readable`→RC-5, `on_brand`→RC-6 already exist in all 9 audit files; reserve regex for RC-2/RC-4 only. Eliminates fragility on 4/6 dimensions.
2. **Tally the 18 FIX findings by RC-id before any code** (glm, minimax) — a 20-min grep over `audit-*.json`. If ≥70% are RC-2 collision, A4 underperforms 5-7 and can't be verified → fund 004 instead. The conversion ceiling is determined by this mix.
3. **Collapse A4 into 001's repair as optional MiniMax-evidence injection** (mimo): `if (minimaxFindings) prompt += "\n\nExternal auditor findings:\n" + minimaxFindings`. ~+4-6 conversions at ~1.05x latency, saves 3 files + the rescore integration.
4. **A `classifyFixes` precision gate on a hand-labeled gold set (≥85%)** measured *before* any round-2 generation (glm). REQ-001 only checks schema-validity, not correctness.
5. **Fix the T0 comparator to share evidence** (glm, kimi, minimax) — or go to a 3-arm T0(raw)/T1(typed)/T2(fresh-regen) design (minimax): if T0≈T1 the schema is decorative; if T2≈T1 the whole phase is unnecessary.
6. **Add a primitive/semantic-consistency check to the adopt-if gate** (deepseek, kimi) — matrix stays matrix, routing stays routing — so A4 can't silently flatten diagrams into lists and score it as a win.
7. **Operate A4 on the round-1 original HTML, not the 001-repaired output** (deepseek) — avoids a 3-hop original→001→A4 repair chain where each hop can introduce defects.
8. **Reconstruct the missing GLM round-2 invariants 6-9** (deepseek) — the research "9 hard invariants" block is truncated at "6. Preserve the original title, icon/"; an implementer can't build the prompt without guessing.
9. **Specify the `a4-rescore.mjs` MiniMax transport** (deepseek): same endpoint, same rubric as the 004 run, same `ship_min`; fallback to the 001 gate if rescore fails — else the score delta isn't apples-to-apples.
10. **Reduce prompt density / split the prompt** (deepseek, minimax): the round-2 stack (2 images + 9 invariants + typed JSON + raw evidence) is ~3000-5000 tokens / ~20+ constraints, past the IFScale cliff that *is* the RC-3 root cause — A4 risks making round-2 compliance worse.

## Red flags (≥2 models flag a risk)

- **`classifyFixes` regex misroutes fixes** (all 5) — the single most-cited risk; a wrong fix contract is worse than none.
- **GLM round-2 compliance unverified + prompt-density increase** (minimax, deepseek) — A4 may amplify the very instruction-density failure (RC-3) it's repairing.
- **Marginal value collapse vs 001 / wrong sequencing vs 004** (glm, mimo, deepseek, kimi) — the central "why this phase, why now" question is unanswered.
- **Forced linearization destroys product semantics with no guard** (deepseek, kimi) — a tile can pass all gates, score SHIP, and be wrong about the fleet/permissions data.
- **Same auditor finds and verifies (confirmation loop)** (glm, deepseek/minimax echo) — MiniMax diagnoses round-1 then rescores round-2 as the SHIP signal; no second-auditor/human spot-check on an 18-tile batch where it's trivially affordable.
- **Over-optimistic 5-7 prediction; judgment fixes won't convert** (glm, mimo, deepseek, minimax).

## Net recommendation

**REVISE / RE-SEQUENCE — strong case to fold or defer.** The external-auditor mechanism is right, but 4 of 5 models argue A4 as a standalone phase-003 is mis-placed: most of its value duplicates 001 (procedural RC-1/RC-3) or belongs after 004/005 (gate-blind RC-2). Minimum bar before any build: (1) tally the 18 FIX by RC-id; (2) replace regex with the audit booleans; (3) decide standalone-vs-fold via the corrected/3-arm A/B; (4) add a precision gate + primitive-consistency check + second-auditor spot-check. If ≥70% of the 18 are RC-2, the panel consensus is to skip A4 and fund 004 instead.
