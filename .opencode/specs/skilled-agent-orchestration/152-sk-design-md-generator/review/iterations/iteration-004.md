# Iteration 4: correctness — per-feature extractors

Reviewed: .opencode/skills/sk-design-md-generator/tool/scripts/a11y-extract.ts, .opencode/skills/sk-design-md-generator/tool/scripts/dark-mode-detect.ts, .opencode/skills/sk-design-md-generator/tool/scripts/framework-detect.ts, .opencode/skills/sk-design-md-generator/tool/scripts/icon-detect.ts, .opencode/skills/sk-design-md-generator/tool/scripts/motion-extract.ts, .opencode/skills/sk-design-md-generator/tool/scripts/design-boundary-detect.ts

Findings: 10 (P0=0 P1=1 P2=9)


## F004-01 [P1] Stroke width detection uses borderTopWidth instead of SVG stroke-width
- File: .opencode/skills/sk-design-md-generator/tool/scripts/icon-detect.ts:156
- Evidence: Line 156: `const bw = parseFloat(el.borderTopWidth);` — ElementStyle.borderTopWidth (types.ts:85) holds the CSS computed `border-top-width`, which for SVG elements defaults to `0px`. SVG stroke-width is a separate attribute/property not captured on ElementStyle at all (no `strokeWidth` field exists in the type). The collector (dom-collector.ts) stores `borderTopWidth: cs.borderTopWidth` but never captures SVG stroke-width numbers. Result: `strokeWidth` (line 161) and `strokeWidthDistribution` (line 167) are near-always null/empty, making icon stroke detection non-functional.
- Fix: Either add a `strokeWidth: number` field to ElementStyle and populate it from computed style `stroke-width` in the DOM collector, or scrape the SVG `stroke-width` attribute directly via `page.evaluate` in icon-detect.

```json
{
"claim": "Stroke width detection uses borderTopWidth instead of SVG stroke-width",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/tool/scripts/icon-detect.ts:156"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F004-02 [P2] extractA11y accepts unused page parameter
- File: .opencode/skills/sk-design-md-generator/tool/scripts/a11y-extract.ts:258
- Evidence: Line 258: function signature `extractA11y(domCollections, interactions, cssAnalyses?, page?)` — the `page` parameter is declared but never referenced in the function body. All page-dependent work is in `extractA11yAsync`.
- Fix: Remove the `page?: Page` parameter from the signature and update callers.


## F004-03 [P2] parseRgb returns null for CSS Color Level 4 shorthand hex values
- File: .opencode/skills/sk-design-md-generator/tool/scripts/a11y-extract.ts:42
- Evidence: Line 32 regex `/{3,8}/` matches 4- and 8-char hex (e.g. #abcd, #rrggbbaa). Line 42 `hex.length >= 6` only handles 6+ char hex; 4-char (CSS Color Level 4 #rgba) and 8-char (#rrggbbaa) fall through to `return null`. For 8-char, bit extraction at design-boundary-detect.ts:47 would also yield wrong channels (see separate finding).
- Fix: Add explicit handling for 4-char and 8-char hex lengths in parseRgb, or tighten the regex to only match lengths the function handles (`{3}|{6}`).


## F004-04 [P2] Skip link detection only works for anchor elements
- File: .opencode/skills/sk-design-md-generator/tool/scripts/a11y-extract.ts:199
- Evidence: Lines 194-199: the element selector finds the first focusable element, but line 199 `if (tag !== 'a') return false` only accepts `<a>` tags. A `<button>` element with inner text 'Skip to main content' is a valid (and common) skip-link pattern that would be missed.
- Fix: Also check `<button>` elements with skip-link text patterns, or broaden the selector to `a[href^='#']` to only match anchor-links.


## F004-05 [P2] Dead no-op filter in toggle button locator
- File: .opencode/skills/sk-design-md-generator/tool/scripts/dark-mode-detect.ts:177
- Evidence: Line 177: `filter({ has: page.locator(':scope') })` — `:scope` as a descendant selector always resolves to the element itself, so the filter never excludes any candidate. It adds overhead (locator resolution per candidate) but never changes the result set.
- Fix: Remove the `filter` call; the locator already correctly selects buttons/checkboxes with dark/theme/mode/light text via `hasText`.


## F004-06 [P2] buildVariableDiff silently drops dark-mode-only variables
- File: .opencode/skills/sk-design-md-generator/tool/scripts/dark-mode-detect.ts:210
- Evidence: Lines 208-213: the diff only includes variables present in `lightMap` (pre-populated from light variables). CSS custom properties that exist only in dark mode (e.g. `--dark-surface`) are never reported, giving a misleading picture of the variable change set.
- Fix: Add a second pass that captures variables unique to dark mode, or change the return type to include `darkOnly: {name,value}[]`.


## F004-07 [P2] SVG data-attribute checks in detectLibrary are unreachable dead code
- File: .opencode/skills/sk-design-md-generator/tool/scripts/icon-detect.ts:143
- Evidence: Line 143: `allClassData.push({ className: el.className, attributes: {} })` always sets `attributes` to an empty object. Lines 57 and 60 in `detectLibrary` check `d.attributes['data-lucide']` and `d.attributes['data-feather']`, which are always `undefined`. Lucide and Feather icon detection can only succeed via className patterns.
- Fix: Populate `attributes` from the actual ElementStyle fields (the type has no generic attribute map), or add a `page.evaluate` step in `detectIconLabels` to collect `data-lucide`/`data-feather` attributes from live SVG elements.


## F004-08 [P2] Dead _domCollections parameter
- File: .opencode/skills/sk-design-md-generator/tool/scripts/motion-extract.ts:98
- Evidence: Line 98: the parameter is named with underscore prefix `_domCollections` and is never referenced in the function body.
- Fix: Remove the parameter from the function signature and update callers.


## F004-09 [P2] Dead assignment: globalColors set never read
- File: .opencode/skills/sk-design-md-generator/tool/scripts/design-boundary-detect.ts:176
- Evidence: Line 176 `globalColors.add(hex)` populates the set inside `detectAnomalies`, but `globalColors` is never referenced afterward — it's built and discarded.
- Fix: Remove the `globalColors` variable and Line 176 assignment, or use it (e.g., to report global-vs-page-unique color ratios).


## F004-10 [P2] hexToRgb returns wrong channels for 8-digit hex with alpha
- File: .opencode/skills/sk-design-md-generator/tool/scripts/design-boundary-detect.ts:47
- Evidence: Lines 42-47: `parseInt(clean, 16)` for 8-char `#RRGGBBAA` produces a 32-bit integer. `(n >> 16) & 255` extracts the GG byte, `(n >> 8) & 255` extracts BB, and `n & 255` extracts AA — the R channel (highest byte) is lost. The color distance comparisons in `scoreColorOverlap` (line 92) would compare wrong RGB tuples for any color token with 8-digit hex.
- Fix: Detect and skip alpha channel: if `clean.length >= 8`, extract `(n >> 24) & 255` for R instead of `>>16`, or strip alpha before parsing.
