Now I have sufficient grounding. Here is my review.

---

## Verdict
**AGREE-WITH-CHANGES** — confidence 0.78 — the direction is correct but the adapter design has an unnecessary fragility, the prompt block is truncated, and the success prediction isn't stress-tested against the actual audit data.

---

## What GPT-5.5 got right

1. **Generator ≠ auditor is the correct axiom.** The benchmark is unambiguous: GLM-5.2 confabulated a non-existent "orange CTA" and `#cccccc` text (`vision-audit-benchmark.md:49`). Self-audit is contraindicated. The separation is non-negotiable.

2. **Failure-only routing is correct and cheap to enforce.** The 27 SHIP sentinels have `verdict: "SHIP"` in the audit JSON — a single `if` check, not a classifier. Zero risk.

3. **The adopt-if gate pairing deterministic checks + MiniMax rescore is the right defense-in-depth.** MiniMax missed the subtle vertical clip (`vision-audit-benchmark.md:48`), so the 001 geometry/overflow check is a necessary complement.

4. **The layout policy forcing linear/stacked/bounded-lane for RC-1/RC-2 tiles is directionally sound.** The root cause is clear: GLM doesn't compute cumulative heights. Giving it bounded primitives removes the computation burden.

---

## Gaps / risks / errors

### GAP 1 (HIGH): The adapter ignores structured data already in the audit JSON

The audit JSON already contains `overflow: true/false`, `title_at_bottom: true/false`, `readable: true/false`, `on_brand: true/false`. The spec's `classifyFixes` is described as "RC-keyed regex defect classifier mapping MiniMax `issue` text to typed fix objects." This is backwards — the structured booleans directly map to RC-1 (`overflow`), RC-3 (`title_at_bottom`), and RC-5 (correlated with `readable`). Running regex on free-text when structured fields already encode the same information is:
- **Fragile**: "panel rows overflow rounded corners" (goedkeuringssysteem-1) uses "overflow" but "MS Vesta row and 'Live overname' status text collide" (accountbeheer-4:40) doesn't — same RC-1, different language.
- **Unnecessary**: 9/9 audit files have the boolean columns.
- **Creates a phantom maintenance burden**: if MiniMax changes phrasing, the regex breaks but the booleans don't.

**Fix**: `classifyFixes` should consume the boolean columns as the primary signal, use regex only for dimensions without booleans (RC-2 collision, RC-4 casing/glyph, RC-6 glyph mismatch).

### GAP 2 (HIGH): The GLM round-2 prompt block is truncated — invariants 6-9 are missing

The research grounding's "GLM round-2 prompt block" text cuts off mid-sentence at:

> `6. Preserve the original title, icon/`

Invariants 6-9 are unspecified. The spec says "9 hard invariants" but the only complete specification is the contract YAML in the final recommendation. This is a **build-blocker** — an implementer reading the phase docs cannot construct the prompt without guessing the missing invariants.

**Fix**: Reconstruct the full 9 invariants from the YAML contract and the root-cause ledger. Candidate missing invariants from the ledger: (6) preserve title/glyph, (7) no uppercase eyebrow, (8) palette-only hex, (9) contrast gate (WCAG AA).

### GAP 3 (MEDIUM): Forced primitive change may silently destroy information structure

The repair for RC-1/RC-2 tiles forces "stacked-list, linear-flow, or bounded-lane primitives" and forbids "free 2D absolute node placement." But the tiles being repaired were designed as 2D diagrams for a reason:

- **accountbeheer-4** (score 35): A matrix showing fleet ships × status dimensions. Forcing this into a stacked list loses the row/column cross-reference (e.g., "MS Vesta" × "Live overname" is a cell, not a linear item).
- **oci-4** (score 58): A node-link diagram showing SAP↔Verbonden↔Anobel-catalogus relationships. Forcing this into a linear flow loses the topology.
- **goedkeuringssysteem-4** (score 55): Branch cards with approval flows — forcing linear may lose the branching logic.

The success criteria (SC-001) measure only FIX→SHIP conversion and MiniMax score — **not** whether the tile still accurately represents the underlying data. A tile could pass all gates, score SHIP, and be semantically wrong about the fleet data.

No mitigation for information loss exists in the spec.

### GAP 4 (MEDIUM): The success prediction isn't stress-tested against the actual FIX cohort

Let me enumerate the actual 18 FIX tiles from the audit files:

| Tile | Score | `overflow` | `title_at_bottom` | `readable` | `on_brand` | Primary issues |
|------|-------|------------|-------------------|------------|------------|----------------|
| accountbeheer-2 | 78 | false | true | true | false | Off-brand red accent |
| accountbeheer-4 | 35 | true | true | false | false | Overflow + collision |
| oci-2 | 78 | false | true | true | true | Eyebrow overlaps node |
| oci-3 | 72 | false | true | false | true | Too-light grey text |
| oci-4 | 58 | true | true | true | true | Clipped text + broken glyph |
| goedkeuringssysteem-1 | 62 | true | true | true | true | Panel overflow |
| goedkeuringssysteem-3 | 66 | true | true | true | true | CTA overflow |
| goedkeuringssysteem-4 | 55 | false | false | false | false | Title wrong + ALLCAPS + contrast |
| orders-facturen-4 | 52 | true | false | false | true | Title clipped + overflow |
| favorieten-3 | 78 | true | true | true | true | Row clipped |
| favorieten-4 | 62 | true | true | true | false | Popover overflow + glyph |
| prijzen-condities-3 | 62 | true | true | false | false | Chart clipped + 3D slop |
| aangepast-assortiment-3 | 58 | true | false | false | false | Overflow + title wrong |
| + 5 more from audit-een-factuur.json and audit-aangepast-assortiment.json and audit-kwartaalcijfers.json |

**The 5-7 conversion prediction rests on a critical assumption**: that GLM-5.2, given typed fix-JSON with forced primitives, will produce valid output. But the root cause (RC-1) says GLM "lays out N rows/nodes at fixed pixel heights with no constraint solver, never computing cumulative-height." The repair prompt adds constraints but doesn't add computation capability.

The tiles most likely to convert are the **non-geometry, non-2D tiles**: accountbeheer-2 (off-brand red → palette fix), oci-3 (too-light grey → contrast fix), goedkeuringssysteem-4 title position (title wrong → re-position). These are ~3-4 tiles that don't need primitive changes.

The 2D holdouts (accountbeheer-4 matrix, oci-4 node diagram, goedkeuringssysteem-4 branches, orders-facturen-4, prijzen-condities-3 chart) are 5+ tiles that DO need primitive changes. GLM's track record on constrained 2D→linear conversion is unproven. The 5-7 prediction should be split: 3-4 easy palette/title fixes + 1-3 hard primitive conversions. If the hard conversions all fail, the standalone result is 3-4, not 5-7.

### GAP 5 (LOW-MEDIUM): MiniMax rescore bias risk

MiniMax-M3 is both the initial auditor (producing the FIX verdict) and the rescore auditor (judging the repair). While the benchmark shows MiniMax doesn't hallucinate palette violations, there's no evidence about whether MiniMax is biased toward confirming its own prior findings. A model that says "this tile has overflow" might be predisposed to say "the overflow is still there" even after a repair, or conversely, might be lenient on its own flagged issues to avoid appearing inconsistent.

The spec mentions "external auditor" but the rescore uses the same model. A cleaner design would cross-validate with a different vision-capable model (Kimi k2.7, though inconclusive in the benchmark) or rely more heavily on the deterministic gates.

### GAP 6 (LOW): The "SHIP but with issues" population is ignored

Several audit rows have `verdict: "SHIP"` but `issue != "none"`:
- prijzen-condities-1 (score 88, SHIP): "Title sits inside the inner panel top, not on the card itself"
- prijzen-condities-2 (score 85, SHIP): "eyebrow overlap visually"
- prijzen-condities-5 (score 90, SHIP): "header and eyebrow compete for same top row"
- orders-facturen-2 (score 88, SHIP): "timeline progress track renders very faintly low-contrast"
- oci-5 (score 90, SHIP): "gauge arc and figure crisp, palette clean" (this one is actually a positive note)

These are 4 SHIP tiles with real, named issues. Running A4 on them could raise scores from 85-90 to 90-94 with low risk (the issues are minor: positioning, contrast) — but the spec explicitly excludes them ("failure-only"). This is noted in the open questions but not decided. For a program targeting 41pt gap closure, leaving 4 improvable SHIP tiles untouched is a missed opportunity.

---

## Strongest improvement or alternative

**Collapse the regex classifier. Use the audit JSON's boolean columns as the primary classification signal, with the `issue` string as fallback evidence only.**

Concretely:

```javascript
function classifyFixes(row) {
  const fixes = [];
  // Primary: structured booleans (deterministic, no regex fragility)
  if (row.overflow)       fixes.push(rc1Fix(row));
  if (!row.title_at_bottom) fixes.push(rc3Fix(row));
  if (!row.readable)      fixes.push(rc5Fix(row)); // contrast/legibility
  if (!row.on_brand)      fixes.push(rc6Fix(row)); // palette/glyph

  // Secondary: issue-text patterns for dimensions without booleans
  if (/ALL.CAPS|uppercase|text-transform/i.test(row.issue)) fixes.push(rc4Fix(row));
  if (/collid|overlap|crowd|clipp|cut.off/i.test(row.issue) && !row.overflow) fixes.push(rc2Fix(row));

  return fixes.slice(0, 3); // cap at 3
}
```

This eliminates the regex fragility for 4/6 RC dimensions, reduces the maintenance surface, and makes the adapter's behavior predictable from the JSON schema alone. The remaining regex (RC-2 collision, RC-4 casing) operates on small, well-defined patterns.

A second alternative worth considering: **post-process HTML for palette/contrast/title-position fixes instead of full re-generation.** If the issue is "red accent not in palette" (accountbeheer-2), replace the hex value in the HTML string. If the issue is "title at top instead of bottom" (goedkeuringssysteem-4), move the DOM element. This is deterministic, zero-latency, and zero-risk for the unaffected parts of the tile. Reserve full re-generation only for overflow/collision tiles that need restructuring (>50% of the FIX cohort by my count: 10/18 tiles have `overflow: true`).

---

## One thing to test or verify before building this phase

**Run a single-tile smoke test on accountbeheer-4 (score 35, the hardest tile — matrix with overflow + collision) with a hand-crafted fix-JSON.** Feed GLM-5.2 the repair prompt with the typed fix contract, measure whether it produces a valid 480px tile that passes the 001 gates AND still accurately represents the fleet matrix data. If GLM cannot repair the worst tile with ideal input (hand-crafted, no classifier noise), it cannot repair easier tiles with regex-classified input. This is a 15-minute gate that prevents building the entire pipeline around an unvalidated assumption. If it fails, route accountbeheer-4 to the phase 004 skeleton-first path immediately rather than burning A4's retry budget on it.