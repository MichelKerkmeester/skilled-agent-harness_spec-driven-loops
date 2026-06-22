# Iteration 020 — Track D (mimo)

## Focus
Sampling precision + per-token provenance (element-level capture, where-used anchor, confidence marking, value-only export)

## Findings
1. **[P0] Element-level provenance lost at clustering** — dom-collector.ts:186-266 captures full per-element computed styles (tag, className, rect, structuralRegion, nearestLandmark) but cluster.ts:576-607 aggregates by RGBA key via addColor(), discarding all selector/element provenance. ColorToken only retains cssVariableNames and sourcePages (URL-level), not which selectors/elements produced each token. A 'where-used' anchor per token (e.g., 'button.btn-primary, nav .cta-link') would let DESIGN.md Section 4 cite concrete selectors alongside frequency, which is strictly more informative than aggregate frequency alone.
   - Recommendation: Extend ColorEntry in cluster.ts with a new Set<string> selectorAnchors. In addColor(), push `${el.tag}.${el.className}` from the source element. Surface as selectorAnchors: string[] on ColorToken in types.ts. Cap at 5 per token to control size. Apply same pattern to ShadowToken and RadiusToken. File: cluster.ts:576-607, types.ts:409-426.
   - Evidence: MiroMiro (hover-to-inspect reads computed DOM styles per element with selector context)
2. **[P1] Structural-region-aware confidence scoring** — cluster.ts:400-435 classifyColorStability() uses page coverage, usage dimensions, CSS variable presence, frequency, and chromaticity — but ignores WHERE in the DOM the token lives. A color appearing only in footer/nav (infrastructure regions) should score higher than one appearing only in random divs. The structuralRegion field is already captured per element in dom-collector.ts:60-74 but never fed into stability classification.
   - Recommendation: In classifyColorStability(), add a signal: if the color's source elements are >=80% in nav/header/footer (infrastructure regions), add +15 score. If >=80% in main/unknown, no bonus. File: cluster.ts:400-435.
   - Evidence: StyleSniff (live DOM sampling -> design system with structural awareness)
3. **[P1] Confidence as promotion gate, not just label** — ColorToken.confidence (types.ts:424) is 'high'|'medium'|'low' based on frequency/pageCoverage. But low-confidence tokens are still promoted to DESIGN.md main sections if they pass the L1/L2 stability gate. The stability classifier (cluster.ts:400-435) and confidence field are computed independently — a token can be L2-stable but low-confidence. The tools described (MiroMiro, StyleSniff) let humans curate; the automated equivalent is refusing to promote low-evidence tokens to main sections.
   - Recommendation: In the WRITE phase (or a new gate in classifyTokenStability), require confidence != 'low' for L1/L2 promotion. Low-confidence tokens drop to L3 (campaign) regardless of stability score. This prevents single-occurrence colors from appearing as system tokens. File: cluster.ts:540-565 (classifyTokenStability).
   - Evidence: Common pattern: user-curated selection in MiroMiro/StyleSniff/Sip
4. **[P1] Value-only templated export for agent consumption** — DESIGN.md is a 17-section prose-heavy document. For agent consumption (e.g., an AI building components), the prose is token-waste — the agent needs only the values. A flat JSON/YAML export with zero prose (just token name → value mappings, grouped by category) would reduce context consumption by ~70% while preserving all actionable data. The data already exists in tokens.json but is raw; a curated value-only export would mirror DESIGN.md's structure without the narrative.
   - Recommendation: Add a --value-only flag to the WRITE phase that emits a parallel .values.json alongside DESIGN.md. Structure: { colors: { brand: [...], structural: [...] }, typography: [...], shadows: [...], radii: [...], spacing: { baseUnit, scale }, components: { button: { primary: { bg, color, radius, ... } } } }. No prose, no personality sentences, no 'Use:' lines. File: new script write-values.ts, or flag in the existing write phase.
   - Evidence: Sip (custom export format templates — value-only output mode)
5. **[P2] Gradient pixel sampling gap** — cluster.ts:244-261 extractGradientColors() parses color stops from CSS gradient strings via regex. This misses: (a) colors that are browser-interpolated between stops (not in the CSS text), (b) gradients applied via background-image on pseudo-elements where the computed value may differ from authored, (c) CSS gradient functions not matching the regex patterns. MiroMiro and Sip sample the RENDERED pixel, not the CSS string — they see the actual composited output.
   - Recommendation: Add a canvas-based gradient sampler to dom-collector.ts: for each gradient element, create an offscreen canvas, render the element's background, sample 5-10 points along the gradient axis, and extract hex values. These 'rendered gradient colors' supplement (not replace) the CSS-string-parsed colors. File: dom-collector.ts:306-337, new function sampleGradientPixels().
   - Evidence: Sip (pixel-perfect loupe sampling) vs current CSS-string parsing
6. **[P2] Opacity-composited color precision gap** — dom-collector.ts:207 reads backgroundColor as a computed value (often rgba with alpha). cluster.ts:579-580 skips fully transparent (a===0) but does NOT composite semi-transparent colors onto their effective background. A color like rgba(0,0,0,0.5) on a white background renders as #808080, but the extraction stores the rgba form. The hex conversion (rgbaToHex) discards alpha entirely. This means two visually identical colors (one opaque, one semi-transparent on white) produce different tokens.
   - Recommendation: In cluster.ts addColor(), when parsed.a < 1.0, composite the color against its effective background. Sample the parent element's backgroundColor; if unavailable, assume #ffffff. Compute composited = alpha * foreground + (1-alpha) * background. Use composited hex as the clustering key while preserving the original rgba in a sourceValue field. File: cluster.ts:576-607.
   - Evidence: Sip/MiroMiro (pixel-perfect sampling sees composited result, not layer inputs)

## Questions Answered
- Q1: Element-level provenance — yes, the data is captured in dom-collector.ts but lost at cluster.ts clustering; adding selectorAnchors to ColorToken is high-value and straightforward.
- Q2: Confidence/provenance gating — confidence field exists but is not a promotion gate; coupling it to stability classification prevents low-evidence token promotion.
- Q3: Value-only export — tokens.json already contains all values; a curated .values.json mirroring DESIGN.md structure without prose is a clean additional output mode.
- Q4: Color precision gaps — gradient CSS-string parsing misses interpolated colors; opacity compositing is not performed; canvas-based sampling would close both gaps.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Implement selectorAnchors on ColorToken + structural-region confidence signal (P0+P1 scope, cluster.ts + types.ts)
- Prototype canvas gradient sampler for dom-collector.ts to validate pixel-sampling accuracy vs CSS-string parsing
- Design .values.json schema and measure context-token reduction vs DESIGN.md for agent consumption
- Audit whether low-confidence tokens currently leak into L1/L2 DESIGN.md sections by inspecting gold-standard examples (stripe, vercel)

## Next Focus
- Implement selectorAnchors on ColorToken + structural-region confidence signal (P0+P1 scope, cluster.ts + types.ts)
- Prototype canvas gradient sampler for dom-collector.ts to validate pixel-sampling accuracy vs CSS-string parsing
- Design .values.json schema and measure context-token reduction vs DESIGN.md for agent consumption
- Audit whether low-confidence tokens currently leak into L1/L2 DESIGN.md sections by inspecting gold-standard examples (stripe, vercel)

## Summary
The extraction pipeline already performs element-level computed-style capture (dom-collector.ts) but discards provenance at the clustering stage (cluster.ts). The highest-value technique is adding selectorAnchors to ColorToken so DESIGN.md can cite 'where used' per token — this data exists but is thrown away during aggregation. Second priority: coupling the existing confidence field to the stability promotion gate so low-evidence tokens are demoted to L3 rather than promoted. Canvas-based gradient/opacity compositing would close the pixel-precision gap vs loupe-based tools.
