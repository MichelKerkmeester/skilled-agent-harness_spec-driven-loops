I'll review the proposed phase A4 rigorously. Let me first ground myself in the actual codebase and existing research to identify what GPT-5.5 may have missed.Now I have enough grounding. Here's my rigorous second opinion:

---

## Verdict
**AGREE-WITH-CHANGES** — confidence 0.72 — The core idea (externalize MiniMax findings into typed fix-JSON) is sound and well-grounded in the RC ledger, but the spec has an over-optimistic conversion prediction, an under-specified adapter that will silently drop real defects, and a critical circular-dependency risk with the phase-001 predecessor that the spec treats as solved.

---

## What GPT-5.5 got right

1. **Generator != auditor is the correct architecture.** The vision-audit-benchmark.md §3 evidence (GLM confabulating "orange CTA" + `#cccccc`) makes this non-negotiable. Self-Refine's external-refiner variant is the right citation.

2. **Failure-only routing (SHIP-skip) is essential.** The 27 SHIP tiles must not be touched. The `A4_ARM` env-switch isolation is clean and non-destructive.

3. **Adopt-if gate with deterministic gates + MiniMax rescore is the right safety net.** Combining hard-fact DOM/CSS checks with the auditor's judgment prevents both MiniMax false-negatives (the subtle-clip case) and GLM false-fixes.

4. **The RC-keyed approach is grounded.** Every fix type maps to a confirmed RC-id from forensic tile viewing, not abstract best-practice.

5. **A/B comparator (T0 generic vs T1 structured) is necessary.** Without it, you can't prove the typed contract earns its complexity over a simple "try again with the screenshot."

---

## Gaps / risks / errors

### GAP-1: The `classifyFixes` regex will silently miss real defects (RC-1, RC-2)

Looking at the actual audit data, the regex patterns have coverage holes. `accountbeheer-4`'s issue is *"matrix rows (MS Vesta row and 'Live overname' status text collide); matrix content spills past the inner panel — clear overflow and severe z-order/stacking conflict."* The word "spill" IS present so RC-1 fires. But `oci-4`'s issue is *"left SAP card text 'MS V...' is clipped/cut off by the overlapping Verbonden pill"* — the word "clipped" is present so RC-1 fires too. However, `goedkeuringssysteem-4`'s issue is *"Title/description at top-left instead of bottom-left; eyebrow wrapped to two lines and rendered in ALL CAPS; labels inside the navy block read as light/medium grey against deep blue — low contrast."* This has **no overflow language at all** — it's RC-3 + RC-4 + RC-5. The adapter correctly skips RC-1 here. But the real problem is the **node_collision regex**: `/overlap|collid|crowd|popover|node|branch|hub|matrix|diagram|funnel|connector|truncat/i`. The word "node" matches almost any issue that mentions a UI element. `accountbeheer-4`'s issue mentions "matrix rows" → `matrix` matches → RC-2 fires. But accountbeheer-4's real problem is vertical overflow (RC-1), not 2D node collision (RC-2). **The adapter will generate a redundant RC-2 fix for a tile that only needs RC-1.** With `max_fixes_per_tile: 3`, this wastes a slot and sends GLM conflicting instructions.

**Fix:** Tighten the node_collision regex to require a spatial-collision verb near the noun (`/overlap.*node|collid.*card|crowd.*edge/i`), or use a two-pass approach: first classify the primary defect, then only add secondary defects if the issue text contains distinct spatial-collision evidence.

### GAP-2: Phase 001 is a hard predecessor, but its gates don't exist yet and haven't been validated

The spec says "Hard predecessor; do not start this phase until 001 ships." But 001 is still in Draft status with `completion_pct: 0`. The adopt-if gate **critically depends** on 001's `proof_check`, `contrast_check`, and `geometry_check` producing reliable pass/fail signals. If those gates have false-positive rates (passing tiles that should fail) or false-negative rates (failing tiles that should pass), the entire adopt-if mechanism is untrustworthy. The spec doesn't account for the possibility that 001's gates might need iteration before A4 can trust them.

**Fix:** Add a gate-validation step to Phase 1 Setup: run 001's gates on the 27 known-SHIP tiles and confirm <5% false-positive rate, and on the 5 worst FIX tiles and confirm they flag the known defects. If gates are unreliable, A4 must pause.

### GAP-3: The standalone-vs-integrated success criteria reveal a marginal-value problem

SC-001 says A4 converts **>=5/18 standalone** but contributes only **+1-3 net** in the integrated pipeline after A1/A3 overlap. This is an admission that phase 001's prompt hardening + deterministic gate + one repair pass already captures most of the low-hanging fruit (overflow, title position, contrast). The spec's own open question asks: *"is the added latency (~1.3-1.5x full batch) justified, or should A4 collapse into the 001 repair pass?"*

**This is the most important question in the spec, and it's left unanswered.** If the integrated marginal is +1-3 tiles at 1.3-1.5x latency, that's ~2-5 extra GLM calls + 18 MiniMax rescores for a handful of tiles. A cheaper alternative: **fold the MiniMax findings into the 001 repair pass as additional evidence** (one pass, not two). This avoids the double-repair chain (001 repair → A4 repair) and the prompt bloat of stacking two repair contexts.

**Fix:** Either (a) answer the open question before building — run a quick experiment where the 001 repair prompt includes MiniMax findings as supplementary evidence, measure whether it captures the same conversions — or (b) collapse A4 into 001 as an optional evidence injection, not a separate pipeline step.

### GAP-4: The prompt will hit the IFScale instruction-density cliff

The round-2 GLM prompt stacks: reference image + failed render image + previous code + 9 hard invariants + typed fix-JSON (up to 3 fixes, each with `layout_contract` + `verification`) + raw MiniMax evidence + original title/description/treatment. That's easily 3000-5000 tokens of instructions plus two images. IFScale (`arxiv.org/html/2507.11538v1`) shows compliance decays ~exponentially past ~15 constraints and drops sharply. The prompt has ~20+ discrete constraints (9 invariants + per-fix layout_contract + per-fix verification + "do not reinterpret" + "preserve title/icon/glyph/palette" + "return only corrected HTML").

**Fix:** Split the prompt. Send the fix-JSON as structured data (already done), but reduce the prose invariants to 5 hard rules max. Move the layout_contract details into the fix-JSON itself (already partially done — the `layout_contract` field). Remove the redundant "preserve original title, icon/glyph contract, product meaning, and palette" prose since the fix-JSON's `non_regression_snapshot` already covers it.

### GAP-5: The `non_regression_snapshot` is computed from audit metadata, not from rendered output

The snapshot fields (`title_position`, `overflow`, `contrast_exit_0`, `eyebrow_uppercase`, `glyph_contract`) are derived from the audit JSON's boolean flags and regex on the `issue` text. But the audit data is MiniMax's judgment on the rendered pixels, not a deterministic measurement. If MiniMax said `overflow: false` but the 001 gate would flag subtle clipping, the snapshot is wrong and the adopt-if gate might pass a false-fix.

**Fix:** The non-regression snapshot should be computed from the 001 deterministic gate's output on the round-1 HTML, not from the audit JSON flags. This requires running the gate on round-1 before starting A4 — which 001 already does as part of its own pipeline. Consume that output.

### GAP-6: No specified mechanism for the MiniMax rescore in `a4-rescore.mjs`

The spec says `a4-rescore.mjs` "re-audits with MiniMax" but doesn't specify: (a) which MiniMax endpoint/model, (b) what prompt/rubric, (c) whether it uses the same audit format as the 004 run, (d) how to handle MiniMax API failures, (e) whether the rescore uses the same `ship_min` threshold. The 004 run used a specific MiniMax-M3 audit rubric — is that documented somewhere? If the rescore rubric differs from the original, the score delta is not apples-to-apples.

**Fix:** Specify the rescore transport: same MiniMax-M3 endpoint, same audit rubric as 004, same `ship_min` threshold. Add a fallback: if MiniMax rescore fails, use the 001 gate pass/fail as the adoption signal alone.

### RISK-1: Double-repair chain creates confusing provenance

If 001 runs its own failure-only repair pass, then A4 runs another repair pass on the 001-repaired output, GLM sees its own round-2 output as "previous code." This creates a 3-hop chain (original → 001 repair → A4 repair) where each hop can introduce new defects. The spec doesn't clarify whether A4 operates on the original round-1 HTML or the 001-repaired HTML.

**Fix:** A4 should always operate on the **round-1 original HTML**, not the 001-repaired version. If 001 already repaired it and it passed, it's SHIP and A4 skips it (SHIP-skip). If 001 repaired it and it still failed, A4 should work from the original with both sets of findings.

### RISK-2: The adapter regex is a maintenance liability

Five regex patterns with ~40 alternations total, matching against free-text that varies per audit run. If MiniMax changes its phrasing ("spills" → "overflows", "crowding" → "tight"), the adapter silently stops matching. No versioning, no fallback, no confidence score.

**Fix:** Add a catch-all: if `classifyFixes` returns 0 fixes for a FIX tile, log a warning and emit a generic "review this tile's issues manually" fix as a fallback. Track adapter match rate as a metric.

### RISK-3: Over-optimistic 5-7 standalone conversion prediction

The prediction assumes MiniMax findings are directly actionable. But many findings are **judgment calls** ("looks decorative AI-slop", "near-illegible") that require GLM to exercise design taste — exactly what GLM is bad at (RC-7). The adapter converts "funnel shape over the inner panel looks decorative AI-slop" into a `vertical_overflow` fix, but the real problem is aesthetic, not spatial. GLM will likely produce a less-sloppy-but-still-bad funnel, not eliminate it.

**Fix:** Separate the 18 FIX tiles into "mechanical fixes" (overflow, title position, contrast — ~10-12 tiles) and "judgment fixes" (slop, on-brand, glyph taste — ~6-8 tiles). Predict conversion rates separately: ~5-6 for mechanical, ~0-1 for judgment. This gives a more honest 5-7 total but with a tighter bound.

---

## Strongest improvement or alternative

**Collapse A4 into the 001 repair pass as an optional evidence injection.**

Instead of a separate pipeline step with its own adapter, prompt, rescore, and adopt-if gate, extend the 001 repair prompt to optionally include MiniMax findings when available:

```
// In 001's repair driver, after gate failure:
if (minimaxFindings) {
  prompt += `\n\nExternal auditor findings:\n${minimaxFindings}`;
}
```

This gives you 80% of A4's value (MiniMax evidence in the repair prompt) at 20% of the cost (no adapter, no separate rescore, no separate adopt-if gate, no double-repair chain). The typed fix-JSON is nice but the regex adapter is brittle — raw MiniMax evidence attached to the repair prompt is nearly as effective and zero-maintenance.

The remaining 20% (typed fix-JSON enabling precise layout contracts per defect) can be added later as an enhancement if the raw-evidence approach proves insufficient.

**Estimated impact:** +4-6 conversions (vs A4's predicted 5-7) at ~1.05x latency (vs A4's 1.3-1.5x). Saves building 3 new files and a MiniMax rescore integration.

---

## One thing to test or verify before building this phase

**Run the adapter on all 18 FIX audit rows and inspect the output.** Before writing any harness code, feed the 18 `audit-*.json` FIX rows through the `classifyFixes` regex (copy-paste from iter-r3) and verify:

1. Each FIX tile gets 1-3 fixes (not 0, not >3)
2. The defect_type matches the actual issue (not a false regex match)
3. No FIX tile gets a redundant fix (e.g., RC-2 fired for a pure RC-1 overflow)
4. The "judgment" tiles (aangepast-assortiment-5 "AI-slop", kwartaalcijfers-5 "red/orange") get a fix type that's actually actionable, not a generic catch-all

If >3/18 tiles get misclassified fixes, the regex adapter needs a redesign before anything else is built. This is a 30-minute test that de-risks the entire phase.