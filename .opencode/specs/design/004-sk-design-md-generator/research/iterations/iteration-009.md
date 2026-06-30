# Iteration 009 — Track A (deepseek)

## Focus
Remaining structural fixes (comparative-framing removal, structured-output mode, adversarial self-review, default-fabrication audit)

## Findings
1. **[P0] A8: comparative framing is built-in fabrication mandate** — format.md §3.4 and style_guide.md §15 REQUIRE at least one sentence comparing the target system to other design systems ("Unlike most systems...", "Where others...", "the conventional choice would be..."). tokens.json contains zero data about other systems — every such claim is fabricated from the writer's subjective priors. The validator (validate.ts) has no check for comparative claims, so they pass silently. The mandate survives precisely because no prior iteration audited the spec docs themselves for fabricated-claim requirements.
   - Recommendation: Remove the comparative-framing mandate from design_md_format.md §3.4 and writing_style_guide.md §15 entirely. Replace with an intra-system comparison pattern: "Unlike [element A] (value X), [element B] uses value Y" — comparing two token-grounded facts within the same system. This preserves the pedagogical value of contrast without requiring knowledge of other design systems.
   - Evidence: design_md_format.md:130 (§3.4 — "at least one sentence in the prose must use a comparative structure: 'Unlike most systems...', 'Where others...', 'This is not...'"); writing_style_guide.md:534-586 (§15 — sentence templates all reference external conventions); validate.ts:241-285 (checkSectionCompleteness — no comparative-claim validation)
2. **[P1] A8: style guide §15 good examples are fabricated claims** — Every "GOOD" example in writing_style_guide.md §15 fabricates a claim about external systems: "Where most systems use neutral gray shadows", "Unlike the convention of bold (700) headlines", "Rather than the typical SaaS approach of warm gray neutrals with a blue CTA". None of these claims are verifiable from tokens.json. They model fabrication as the quality standard, which the WRITE-phase agent will imitate.
   - Recommendation: Rewrite all §15 examples to use intra-system comparisons anchored to token values. E.g.: "Unlike the body text (#64748d, 16px), headlines use #061b31 at 48px weight 300" — both halves traceable to tokens.json.
   - Evidence: writing_style_guide.md:548,554,558,564-566,571,577 (§15 — six good/bad example pairs, all six GOOD versions include unverifiable external claims)
3. **[P0] A11: structured-output for Depth philosophy (Section 6)** — format.md §9 requires 50–100 words of free prose contrasting the system's depth approach with convention. This prose solicits fabricated claims (see A8). Replace with a structured table whose every field is either an enum, a direct token reference, or a short note constrained by token presence.
   - Recommendation: Replace the free-prose "Contrast with conventional approach" paragraph with a structured table:
| Field | Value | Source Token | Note (optional, ≤1 line) |
|-------|-------|-------------|---------------------------|
| depth_category | {chromatic_depth\|shadow_as_border\|luminance_stepping\|utilitarian\|minimal\|unclassified} | n/a (enum) | — |
| dominant_shadow_value | `rgba(50,50,93,0.12) 0px 16px 32px 0px` | tokens.shadows[0].value | — |
| dominant_shadow_count | 45 | tokens.shadows[0].count | — |
| shadow_levels_count | 4 | tokens.shadows[].length | — |
| border_shadows_count | 1 | filtered from tokens.shadows[].blur===0 | — |
If no shadow data exists, the depth_category is `unclassified` and the remaining fields are `null`.
   - Evidence: design_md_format.md:565 (§9 — "Contrast with conventional approach (50–100 words)"); validate.ts:241-285 (checkSectionCompleteness — validates section presence, not content anchoring)
4. **[P0] A11: structured-output for Motion philosophy (Section 6.5)** — format.md §10 requires a "Motion philosophy" (1–2 sentences) and prose descriptions of enter/exit choreography. Even the minimal-fallback text ("The site relies on instant state changes... consider adding subtle transitions") invents a recommendation not grounded in tokens. Replace free prose with token-bound fields.
   - Recommendation: Replace the Motion philosophy free prose with:
| Field | Value | Source Token | Note (≤1 line) |
|-------|-------|-------------|----------------|
| motion_detected | {true\|false} | tokens.motionData !== null | — |
| duration_range | "150ms–600ms" | tokens.motionData[*].duration | formatted min–max |
| easing_primary | "ease" | tokens.motionData[*].easing | most frequent |
| easing_primary_count | 142 | tokens.motionData[*].count | — |
| choreography_observed | {true\|false} | tokens.motionData[*].enterExit | — |
| reduced_motion_detected | {true\|false} | tokens.a11y.reducedMotionSupport | — |
When motion_detected=false, all other fields default to null/undefined. The fallback recommendation ("consider adding...") is deleted — it is advice, not extraction.
   - Evidence: design_md_format.md:589-592 (§10 — "If the site has no observable motion data, write a minimal section documenting the absence... consider adding subtle transitions"); design_md_format.md:598-602 (§10 — "Motion philosophy: 1–2 sentences describing the system's approach to motion")
5. **[P1] A11: structured-output for Focus consistency (Section 9)** — format.md §13.3 documents focus indicators as bullet items ("Buttons: 2px solid #533afd outline with 2px offset"). These are semi-structured but the consistency claim ("focus indicators present on all interactive elements") is free interpretive prose derived from extractFocusIndicator's boolean, which itself is misleading (see A-i). Replace with token-bound fields.
   - Recommendation: Replace the focus indicator prose with:
| Field | Value | Source Token | Note (≤1 line) |
|-------|-------|-------------|----------------|
| focus_detected | {true\|false} | tokens.a11y.focusIndicator !== null | — |
| focus_style_type | {outline\|ring\|underline\|shadow\|none} | tokens.a11y.focusIndicator.style | derived from CSS properties present |
| focus_color | `#533afd` | tokens.a11y.focusIndicator.style['outline-color'] or equivalent | — |
| focus_width | `2px` | tokens.a11y.focusIndicator.style['outline-width'] | — |
| focus_offset | `2px` | tokens.a11y.focusIndicator.style['outline-offset'] | — |
| focus_style_consistent | {true\|false\|null} | tokens.a11y.focusIndicator.consistent | null when focus_detected=false |
When focus_detected=false, all style fields are null and the DESIGN.md section reads "No focus indicators were detected." with no further prose.
   - Evidence: design_md_format.md:798-803 (§13.3 — focus indicator bullet format); a11y-extract.ts:88-128 (extractFocusIndicator — returns {style:{},consistent:true} even when no focus data exists)
6. **[P0] A15: post-write adversarial self-review pass design** — The current pipeline is WRITE → VALIDATE (validate.ts). validate.ts checks phantom-colors, hex format, section completeness, and font anchoring — but does NOT catch prose sentences that lack any token anchor (interpretive claims, comparative sentences, unbounded adjectives). An adversarial self-review pass inserted between WRITE and VALIDATE would: (a) re-read DESIGN.md sentence-by-sentence, (b) classify each as ANCHORED (contains ≥1 token-traceable value) or INTERPRETIVE (no hex/px/weight/radius/font/duration/ratio), (c) emit the INTERPRETIVE list, (d) require the writer to either anchor each sentence to a specific token key or delete it.
   - Recommendation: Insert a SELF-REVIEW step in SKILL.md between WRITE and VALIDATE with this prompt:
---
ADVERSARIAL SELF-REVIEW: Read your DESIGN.md and tokens.json side by side.
For every sentence in DESIGN.md, classify:
- ANCHORED: contains ≥1 value traceable to tokens.json (hex #nnn, nnpx, weight nnn, font name, duration nms, ratio n:1)
- INTERPRETIVE: no token-anchored value
Emit two lists:
1. ANCHORED sentences with their source token key
2. INTERPRETIVE sentences with section + line number
For each INTERPRETIVE sentence, either:
  (a) Add the specific token key/path that supports the claim, OR
  (b) Delete the sentence if no token supports it
This pass MUST return zero INTERPRETIVE sentences before proceeding to validate.ts.
---
Slot location: after the WRITE phase completes writing to <DESIGN_MD_PATH>, before the validate.ts invocation in the prompt template (design_md_prompt_template.md line 54–56).
   - Evidence: design_md_prompt_template.md:54-56 (pipeline: write → validate); validate.ts:287-310 (checkContent — only checks table presence and color count, no prose-anchoring audit); design_md_format.md:565 (§9 — "Contrast with conventional approach" has no anchoring requirement)
7. **[P0] A-i: minTouchTarget returns 0/0 when no interactive elements exist** — a11y-extract.ts:306-325 iterates DOM collections for interactive elements (button, a, input, select, textarea). When none exist (or all have zero-area rects), minWidth/minHeight remain Infinity. Lines 322-325 convert Infinity→0, producing {width:0,height:0}. This is a default fabrication — the DESIGN.md will report "minimum touch target: 0×0" implying a bug rather than "no interactive elements detected."
   - Recommendation: Add a `captured` sentinel. Change minTouchTarget to:
```ts
const minTouchTarget = minWidth === Infinity
  ? { width: null, height: null, captured: false }
  : { width: Math.round(minWidth), height: Math.round(minHeight), captured: true };
```
Update the A11yTokens type to include `captured: boolean` on minTouchTarget. In the DESIGN.md Accessibility Contract, render "No interactive elements detected — touch target data unavailable" when captured=false.
   - Evidence: a11y-extract.ts:322-325 ("width: minWidth === Infinity ? 0 : Math.round(minWidth)"); a11y-extract.ts:306-319 (interactive element iteration)
8. **[P0] A-i: altTextCoverage returns 100% when zero images exist** — a11y-extract.ts:224-249: when document.querySelectorAll('img') returns an empty NodeList, total=0 and percentage returns 100 (line 246: `total > 0 ? ... : 100`). This fabricates a perfect score from absence of data — an empty page gets "100% alt text coverage" which is both misleading and indistinguishable from a page where every image genuinely has alt text.
   - Recommendation: Same `captured` sentinel:
```ts
return {
  withAlt: 0, withoutAlt: 0, total: 0,
  percentage: null,
  captured: total > 0,
};
```
In the DESIGN.md, render "No images detected — alt text coverage unavailable" when captured=false.
   - Evidence: a11y-extract.ts:246 ("percentage: total > 0 ? Math.round((withAlt / total) * 100) : 100"); a11y-extract.ts:227-248 (full function)
9. **[P1] A-i: extractFocusIndicator returns {style:{},consistent:true} on empty data** — a11y-extract.ts:88-128: when interactions array is empty or no captures have focusVisibleDiff, lines 101-103 return {style:{},consistent:true}. This signals "focus indicators are consistent" when in fact NO focus indicators were observed at all. The downstream DESIGN.md will fabricate a claim like "Focus indicators are consistent across all interactive elements" from a null signal.
   - Recommendation: Change return on empty to:
```ts
if (focusStyles.length === 0) {
  return { style: null, consistent: null, captured: false };
}
```
Update A11yTokens.focusIndicator type to `{style: Record<string,string>|null; consistent: boolean|null; captured: boolean}`. In DESIGN.md, render "No focus indicators detected" when captured=false.
   - Evidence: a11y-extract.ts:101-103 ("if (focusStyles.length === 0) { return { style: {}, consistent: true }; }"); a11y-extract.ts:88-128 (full extractFocusIndicator)
10. **[P2] A-i: uniform absent→null convention for all extractors** — The three bugs above share a root pattern: extractors return a fabricated default (0, 100, {}, true) when no data exists, indistinguishable from valid data. A uniform `captured: boolean` sentinel on every nullable extraction field prevents this class of bug. The A11yTokens type and any extractor returning a metric should use `{value}|null + captured:boolean` instead of default-fallback.
   - Recommendation: Add a shared type:
```ts
type Captured<T> = T extends null ? { value: null; captured: false } : { value: T; captured: true };
```
Apply to all a11y-extract.ts extractors: minTouchTarget, altTextCoverage, focusIndicator, reducedMotionSupport (already nullable, add captured). Audit every field in A11yTokens for `captured` coverage. The validate.ts checkContent function should also warn when captured=false fields are rendered as if they have data.
   - Evidence: a11y-extract.ts:322-325,246,101-103 (three parallel default-fabrication sites); a11y-extract.ts:349-356 (return object — A11yTokens type lacks captured fields)

## Questions Answered
- A8: Yes, comparative framing (format §3.4 + style §15) is a built-in structural fabrication mandate — it REQUIRES claims about other design systems that tokens.json cannot verify. Must be removed or constrained to intra-system comparisons.
- A11: Three highest-risk prose sections (Depth philosophy, Motion philosophy, Focus consistency) should be replaced with token-bound templated fields (value | token-key | optional 1-line note). Field shapes defined per section above.
- A15: Post-write adversarial self-review pass designed: sentence-level anchoring audit (ANCHORED vs INTERPRETIVE) slotted between WRITE and VALIDATE. Any INTERPRETIVE sentence must be anchored or deleted before validate.ts runs.
- A-i: The bug pattern IS replicated — minTouchTarget (0/0 on empty), altTextCoverage (100% on empty), extractFocusIndicator ({},true on empty) all fabricate defaults indistinguishable from real data. Uniform absent→null+captured:false convention proposed.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- A8 follow-up: audit all § examples in writing_style_guide.md for external-system claims; rewrite as intra-system comparisons
- A11 follow-up: implement the structured-output field tables in the format spec and update validate.ts to enforce field presence (not free prose)
- A15 follow-up: implement the adversarial self-review as a scripted pre-validate step (or embed in validate.ts as a new checkAnchoring pass)
- A-i follow-up: backfill captured:boolean across all a11y-extract.ts extractors (minTouchTarget, altTextCoverage, focusIndicator, reducedMotionSupport) and update A11yTokens type + downstream consumers
- Cross-cutting: the DesignTokens type (types.ts) needs auditing for other nullable fields that lack captured sentinels — motionData, shadowData, darkMode, etc.
- Cross-cutting: validate.ts checkContent currently warns on missing typography table and low color count but has no anchoring-density check — add a metric: % of sentences containing ≥1 token-traceable value

## Next Focus
- A8 follow-up: audit all § examples in writing_style_guide.md for external-system claims; rewrite as intra-system comparisons
- A11 follow-up: implement the structured-output field tables in the format spec and update validate.ts to enforce field presence (not free prose)
- A15 follow-up: implement the adversarial self-review as a scripted pre-validate step (or embed in validate.ts as a new checkAnchoring pass)
- A-i follow-up: backfill captured:boolean across all a11y-extract.ts extractors (minTouchTarget, altTextCoverage, focusIndicator, reducedMotionSupport) and update A11yTokens type + downstream consumers
- Cross-cutting: the DesignTokens type (types.ts) needs auditing for other nullable fields that lack captured sentinels — motionData, shadowData, darkMode, etc.
- Cross-cutting: validate.ts checkContent currently warns on missing typography table and low color count but has no anchoring-density check — add a metric: % of sentences containing ≥1 token-traceable value

## Summary
Four structural fabrication levers audited. A8 (comparative framing) is a confirmed built-in fabrication mandate — format spec and style guide REQUIRE unverifiable claims about other design systems; must be removed. A11 defines structured token-bound field shapes for the three highest-risk free-prose sections (Depth, Motion, Focus). A15 designs a sentence-level anchoring audit pass to insert between WRITE and VALIDATE. A-i confirms the parallel default-fabrication bug across three extractors (minTouchTarget→0/0, altTextCoverage→100%, focusIndicator→{}/true) and proposes a uniform absent→null+captured:false convention.
