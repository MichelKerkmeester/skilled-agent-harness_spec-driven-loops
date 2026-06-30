# Iteration 014 — Track D (mimo)

## Focus
Measured a11y + typography fidelity (CIEDE2000 contrast over all pairs, nearest-compliant shade, OpenType font metrics, axe-style audit)

## Findings
1. **[P0] Real text-on-bg contrast pairs (axe-style DOM audit)** — cluster.ts:798-831 caps at top-20 frequency colors (slice(0,20)) and computes cross-product pairs between them — many pairs never co-occur as actual text-on-bg in the DOM. Meanwhile a11y-extract.ts:265-304 already iterates ALL DOM elements collecting real (el.color, el.backgroundColor) pairs with usage counts — this is the measured data. The §9 Contrast Ratios table should source from a11y-extract.ts contrastPairs (actual DOM pairs sorted by usageCount), not from cluster.ts synthetic cross-product. The writer transcribes measured ratios; no invention possible.
   - Recommendation: Replace §9 Contrast Ratios source from cluster.ts colorRelationships.contrastPairs to a11yTokens.contrastPairs. Add a top-N cap (e.g. 15) on a11y-extract.ts output for DESIGN.md table size. File: a11y-extract.ts already does the work; cluster.ts:798-831 can retain its synthetic pairs for §2 Color Palette cross-reference but §9 must use measured DOM pairs. Phase: WRITE (Phase 2), §9 Accessibility Contract.
   - Evidence: a11y-extract.ts:265-304 (real DOM pair extraction), cluster.ts:798-831 (top-20 synthetic cap)
2. **[P1] Nearest-compliant-shade algorithm for §9 remediation** — Stark's technique: given a failing pair (fg, bg), compute the nearest OKLCh/LCh adjustment to one channel that achieves ≥4.5:1 (AA) or ≥7:1 (AAA) while minimizing perceptual distance (deltaE OKLCh). The codebase already has culori for OKLCh conversion (cluster.ts:678) and deltaE (cluster.ts:348-354). Implementation: for each failing contrastPair, binary-search OKLCh lightness of fg or bg to find the minimum-deltaE compliant shade. Emit as 'Suggested fix: shift fg from #X to #Y (deltaE 2.1, achieves 4.52:1 AA)'. Must be clearly labeled RECOMMENDED (computed suggestion) not OBSERVED (extracted value). Gate: only emit for pairs below 4.5:1 that the writer would otherwise need to invent advice for.
   - Recommendation: Add nearestCompliantShade() to a11y-extract.ts or a new remediation.ts module. Uses culori OKLCh + existing deltaE. Returns {original, suggested, deltaE, targetLevel} per failing pair. Writer annotates §9 rows with '(Recommended fix: shift fg to #Y)' — validated by rule that suggested hex does NOT appear in tokens.colorTokens (so writer can't mistake it for observed). Phase: WRITE (Phase 2), §9 remediation subsection.
   - Evidence: cluster.ts:348-354 (deltaE OKLCh), cluster.ts:678 (culori OKLCh converter), Stark's nearest-compliant algorithm
3. **[P1] Rule-based a11y audit replacing default-true booleans** — a11y-extract.ts:88-128 extractFocusIndicator() returns {consistent: true} when focusStyles.length === 0 (line 102) — a fabricated positive. Also only compares diff key/value shapes, not whether focus is actually visible. Replace with axe-style rule-based findings: count N elements with no :focus-visible outline, count M interactive elements with outline:none or outline:0, report focusIndicator.present (boolean) + focusIndicator.violationCount (number) + focusIndicator.violations[] (sample selectors). The §9 Focus Indicators section then writes 'N of M interactive elements lack visible focus outline' — measured, not default-true.
   - Recommendation: Refactor extractFocusIndicator() in a11y-extract.ts:88-128. Add page.evaluate() scan (like extractTabOrder) counting interactive elements (button/a/input/select/textarea/[role=button]) with no :focus-visible style or outline:0/none. Return {present: boolean, consistent: boolean, violationCount: number, sampleViolations: string[]}. Update A11yTokens type in types.ts:270-275. Phase: EXTRACT (Phase 1), a11y-extract.ts.
   - Evidence: a11y-extract.ts:101-103 (default-true when empty), types.ts:270-275 (A11yTokens.focusIndicator shape)
4. **[P2] OpenType font-metrics extraction via Playwright font access** — §3 Typography documents font-size/weight/line-height from computed CSS but lacks real font metrics: x-height, cap-height, ascent/descent, available OpenType features (liga, tnum, ss01). These come from OpenType name/OS2/head tables in the actual font files. Feasibility: Playwright can access the Font Access API (navigator.fonts.query()) in Chromium 103+ to enumerate local fonts and read their metadata — but this gives table data only for locally-installed fonts, not @font-face web fonts. For web fonts, the .woff2 files would need to be fetched and parsed (opentype.js library). The extraction pipeline already captures fontFaces[].src URLs (dom-collector.ts). Verdict: feasible but high effort; x-height/cap-height are the highest-value metrics for typography fidelity (they determine optical sizing behavior). Lower priority than contrast and a11y fixes.
   - Recommendation: Add font-metrics.ts module using opentype.js (MIT) to parse .woff2 files fetched during crawl. Extract: xHeight, capHeight, ascent, descent, unitsPerEm, otFeatures[] from OS2/head/name tables. Store in TypographyLevel as optional fields. Writer uses in §3 Font Family substitution notes and §3 Hierarchy Notes column. Phase: EXTRACT (Phase 1), new font-metrics.ts. Consider deferring to iteration 15 given complexity.
   - Evidence: dom-collector.ts fontFaces[].src (font URLs available), Playwright Font Access API (Chromium 103+), opentype.js (MIT, npm)

## Questions Answered
- Q1: Yes — §9 should use a11y-extract.ts real DOM pairs, not cluster.ts top-20 synthetic cross-product. Source: a11y-extract.ts:265-304.
- Q2: Yes — nearest-compliant-shade via OKLCh binary search is feasible with existing culori/deltaE. Gate as RECOMMENDED by verifying suggested hex is absent from tokens.colorTokens.
- Q3: Feasible via opentype.js parsing .woff2 font URLs already captured by dom-collector.ts. x-height/cap-height are highest-value metrics. High effort — defer to iteration 15.
- Q4: Yes — extractFocusIndicator() default-true at line 102 is the specific fabrication. Replace with page.evaluate() counting interactive elements without visible focus styles.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Implement nearestCompliantShade() OKLCh binary search in a11y-extract.ts or remediation.ts
- Refactor extractFocusIndicator() to axe-style rule-based audit with violation counts
- Add opentype.js font-metrics.ts for x-height/cap-height extraction from .woff2 URLs
- Audit §9 writer prompt to enforce transcription-only of a11y-extract.ts measured data (no invention)

## Next Focus
- Implement nearestCompliantShade() OKLCh binary search in a11y-extract.ts or remediation.ts
- Refactor extractFocusIndicator() to axe-style rule-based audit with violation counts
- Add opentype.js font-metrics.ts for x-height/cap-height extraction from .woff2 URLs
- Audit §9 writer prompt to enforce transcription-only of a11y-extract.ts measured data (no invention)

## Summary
The highest-value measured technique is replacing §9 contrast source from cluster.ts top-20 synthetic pairs to a11y-extract.ts real DOM text-on-bg pairs (a11y-extract.ts:265-304 already computes this). The second priority is fixing extractFocusIndicator() default-true fabrication (a11y-extract.ts:102) with axe-style violation counting. Nearest-compliant-shade via OKLCh is feasible with existing culori infrastructure. OpenType font-metrics extraction is lower priority/higher effort.
