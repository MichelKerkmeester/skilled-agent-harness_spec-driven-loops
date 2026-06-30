# Iteration 041 — Track B (mimo)

## Focus
Un-audited extraction modules (icon/framework/dark-mode/crawl) default-fabrication + starvation audit

## Findings
1. **[P0] dark-mode-detect: supported:true on empty variableDiff** — default-fabrication — When detectMethod finds a trigger (e.g. dark class on <html>, a toggle button, or prefers-color-scheme media query), it sets supported:true even if collectCSSVariables returns identical variables before/after switchToDarkMode. The variableDiff array will be empty, meaning no real dark palette exists. The DESIGN.md §2.5 writer receives supported:true + empty variableDiff and must invent a dark palette. The switchToDarkMode function only handles 4 mechanical triggers; if the site's dark mode requires JS hydration, React context, or a different class name, the CSS won't change but supported remains true.
   - Recommendation: After building variableDiff, gate supported on variableDiff.length > 0 (or at minimum a configurable threshold like 3 changed variables). If diff is empty, fall back to supported:false or a new 'detected-no-diff' state.
   - Evidence: dark-mode-detect.ts:258-265
2. **[P0] icon-detect: determineColorMode returns 'mixed' on empty data** — default-fabrication — Line 78: when svgColors.length === 0, returns 'mixed' instead of null/undefined. The DESIGN.md §12 Iconography writer receives colorMode:'mixed' as a confident claim when no SVG color data was collected. This is the exact same pattern as extractFocusIndicator returning consistent:true on empty data.
   - Recommendation: Return null when svgColors.length === 0. Change return type to 'currentColor' | 'fixed' | 'mixed' | null. Update IconSystemInfo.colorMode type accordingly.
   - Evidence: icon-detect.ts:78
3. **[P1] a11y-extract: extractFocusIndicator returns consistent:true on empty** — default-fabrication (known pattern, confirming scope) — Line 102: when no focusVisibleDiff captures exist, returns { style: {}, consistent: true }. The writer receives a confident 'consistent' claim with zero evidence. Same bug pattern that was already flagged for this module.
   - Recommendation: Return { style: {}, consistent: false } or introduce a tri-state: { style: {}, consistent: null, sampleSize: 0 } to signal 'no data'.
   - Evidence: a11y-extract.ts:101-103
4. **[P1] a11y-extract: altTextCoverage returns 100% when no images exist** — default-fabrication — Line 246: when total === 0, percentage defaults to 100. A site with zero images gets a perfect alt-text score. The DESIGN.md a11y section would claim 100% coverage without any images to assess.
   - Recommendation: Return percentage: 0 or null when total === 0. Add a boolean 'hasImages' or 'applicable' flag.
   - Evidence: a11y-extract.ts:246
5. **[P2] dom-collector: extractLogoColors returns null → starvation** — starvation — When no logo image or SVG is found via the selector list, returns null. The DESIGN.md writer receives no logo colors and must either leave the section empty or invent brand colors. Not a fabrication in the module itself, but creates a starvation path the writer must handle.
   - Recommendation: Document the null return contract. The DESIGN.md template should conditionally render logo colors only when non-null, with a 'not detected' fallback.
   - Evidence: dom-collector.ts:437-550
6. **[P2] framework-detect: Tailwind threshold is single-page, fixed at 20** — correctness — detectTailwind runs on a single page (the first URL) and uses a hard-coded matchCount <= 20 threshold. A minimal Tailwind site or one using @apply extensively might have <20 utility classes visible in the DOM. Also, only the first page is sampled — a site using Tailwind on subpages but not the homepage would be missed.
   - Recommendation: Make threshold configurable. Consider sampling 2-3 pages. Log the actual matchCount at verbose level so users can diagnose false negatives.
   - Evidence: framework-detect.ts:91, extract.ts:402-419
7. **[P2] icon-detect: detectIcons returns null at totalCount < 3 → starvation** — starvation — Line 147: if fewer than 3 SVGs are found, returns null. The DESIGN.md §12 Iconography section receives no data. Correct behavior (can't determine a system from 1-2 icons), but the writer must handle the null gracefully.
   - Recommendation: No code change needed — this is correct. Ensure the DESIGN.md template renders 'insufficient data' when iconSystem is null.
   - Evidence: icon-detect.ts:147
8. **[P2] dark-mode-detect: toggle-button detection is pattern-loose** — correctness — Line 122-137: the toggle detection matches any button with text/aria-label/title containing 'dark', 'theme', 'mode', or 'light'. A 'Subscribe to our newsletter' modal with a 'Light mode' theme selector, or a button reading 'Light reading', would trigger a false positive. Combined with the P0 empty-diff issue, this amplifies false dark-mode claims.
   - Recommendation: Tighten the pattern: require the button to be a [role='switch'] or have aria-pressed, or require the text to match more specifically (e.g., 'dark mode', 'light mode', 'toggle theme').
   - Evidence: dark-mode-detect.ts:122-137

## Questions Answered
- Does icon-detect have the default-fabrication pattern? YES — determineColorMode returns 'mixed' on empty svgColors (line 78)
- Does framework-detect return a guessed framework on weak evidence? NO — returns null for each sub-detector when not found; threshold is fixed but reasonable
- Does dark-mode-detect claim support without a real palette? YES — supported:true when variableDiff is empty (line 258-265), which is the most impactful fabrication
- Is dark-mode §2.5 gating correct? NO — it gates on supported:true, not on variableDiff.length > 0; sites with detection triggers but no actual CSS changes get full dark-mode sections
- Which modules are clean? crawl.ts, css-analyzer.ts (no default-fabrication or starvation patterns found)

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Check report-gen.ts and the DESIGN.md template writer: how does it handle empty variableDiff when darkMode.supported is true? Does it fabricate palettes?
- Audit motion-extract.ts (not in scope but same extraction pipeline) for the same pattern
- Verify whether the §2.5 dark-mode section in the actual DESIGN.md template has a conditional gate on variableDiff.length
- Check if icon-detect's colorMode:'mixed' on empty data has caused incorrect §12 Iconography output in existing DESIGN.md files
- Consider a unified 'no-data sentinel' type (e.g., { _empty: true }) across all extractors to prevent writers from inventing data

## Next Focus
- Check report-gen.ts and the DESIGN.md template writer: how does it handle empty variableDiff when darkMode.supported is true? Does it fabricate palettes?
- Audit motion-extract.ts (not in scope but same extraction pipeline) for the same pattern
- Verify whether the §2.5 dark-mode section in the actual DESIGN.md template has a conditional gate on variableDiff.length
- Check if icon-detect's colorMode:'mixed' on empty data has caused incorrect §12 Iconography output in existing DESIGN.md files
- Consider a unified 'no-data sentinel' type (e.g., { _empty: true }) across all extractors to prevent writers from inventing data

## Summary
3 of 6 audited modules have the default-fabrication pattern. dark-mode-detect.ts is the worst offender (P0): it sets supported:true even when CSS variables don't change between light/dark, forcing the §2.5 writer to invent a dark palette. icon-detect.ts returns colorMode:'mixed' with zero SVG data (P0). a11y-extract.ts (known) returns consistent:true and 100% alt-text on empty data (P1×2). framework-detect.ts, css-analyzer.ts, crawl.ts, and dom-collector.ts are clean or have only P2 starvation paths.
