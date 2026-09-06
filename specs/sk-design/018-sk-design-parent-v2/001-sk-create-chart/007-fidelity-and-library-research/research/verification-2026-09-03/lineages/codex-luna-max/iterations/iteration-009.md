# Iteration 9: WCAG contrast, SVG focus caveats, and colour guidance

**Run:** 9 of 10  
**Retrieved:** 2026-09-03  
**Baseline:** `research/lineages/deepseek-flash-max/research.md:67,76,106,215`

## Focus

Verify WCAG 2.1 Understanding 1.4.3 and 1.4.11, the CSS-Tricks SVG-title comparison, MDN browser-compat-data issue 16831 and its Chromium 829352 reference, and the authority of colorarchive.org's data-visualization guide.

## Findings

### 1. WCAG 2.1 Success Criterion 1.4.3

- **Verdict:** VERIFIED
- **Live URL:** https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html `[SOURCE: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html]`
- **Resolves:** Yes; current W3C WAI Understanding page.
- **Documented version:** WCAG 2.1, Level AA; the page itself says Understanding Docs are informative explanations rather than the conformance text.
- **Evidence:** The success criterion requires text and images of text to reach at least `4.5:1`, with large text at least `3:1`; it lists incidental text, decoration, invisible text, and logos as exceptions. The page also says the ratios are thresholds and must not be rounded down from a failing value.
- **Corpus verdict:** The pinned palette source defines `textOnSurface: 4.5` and `markOnSurface: 3.0`, and the validator uses the palette gate machinery. This supports the baseline's WCAG mapping for text and large/mark-level contrast, but it does not make every chart shape text or make the Understanding page itself normative. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json:18-26; .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs:163-189]`

### 2. WCAG 2.1 Success Criterion 1.4.11

- **Verdict:** VERIFIED
- **Live URL:** https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html `[SOURCE: https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html]`
- **Resolves:** Yes; current W3C WAI Understanding page.
- **Documented version:** WCAG 2.1, Level AA; the page's explanatory content is informative.
- **Evidence:** The criterion requires at least `3:1` against adjacent colours for visual information required to identify user-interface components/states and parts of graphics required to understand content, with inactive/agent-controlled and essential-presentation exceptions. The guidance explicitly discusses charts/infographics, gradients, dynamic pop-up text, and equivalent information in a table.
- **Corpus verdict:** The pinned source distinguishes `markOnSurface: 3.0` from the deliberately ungated structural `rule` role, and explains the exception in the palette source. The contract separately requires a data table and accessible SVG labeling, which is the equivalent-information path the WCAG guidance recognizes. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json:18-26; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:163-167]`

### 3. CSS-Tricks SVG `<title>` versus HTML `title`

- **Verdict:** UNVERIFIABLE
- **Live URL:** https://css-tricks.com/svg-title-vs-html-title-attribute/ `[SOURCE: https://css-tricks.com/svg-title-vs-html-title-attribute/]`
- **Resolves:** The URL is known, but the live fetch returned HTTP 403 Forbidden, so the article's text and current state could not be checked publicly in this run.
- **Documented version:** No library or standards version could be established.
- **Failure mode:** Access denied by the site; no public page content was available to compare with the claim.
- **Nearest authoritative coverage:** MDN's current SVG `<title>` reference says browsers usually display title text as a tooltip and that it provides an accessible short description; the W3C accessible-SVG draft covers title/desc accessible-name behavior. Those sources support a cautious fallback claim, not any CSS-Tricks-specific statement about touch behavior. `[SOURCE: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title; https://w3c.github.io/writing-accessible-svg/accessible-svg.html]`
- **Corpus verdict:** The corpus's visible labels, rule-10 table, and T1 native titles are present; no claim about touch tooltip delivery is needed to satisfy the contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:163-167; .opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html:139-146,187-190]`

### 4. MDN browser-compat-data issue 16831 and Chromium bug 829352

- **Verdict:** CORRECTED
- **Live URL:** https://github.com/mdn/browser-compat-data/issues/16831 `[SOURCE: https://github.com/mdn/browser-compat-data/issues/16831]`; linked reference: https://bugs.chromium.org/p/chromium/issues/detail?id=829352
- **Resolves:** The MDN issue resolves and remains open. The linked Chromium issue URL resolves at the tracker, but its live page returned no readable issue body in this run.
- **Documented version:** The MDN issue was opened 2022-06-30 and has no browser-version matrix; it is an issue requesting missing compatibility data for tooltip display on focus.
- **What `research.md` said:** It called keyboard-focus tooltips “browser-inconsistent” and cited issue 16831 as the Chromium 829352 caveat.
- **What the sources say:** Issue 16831 labels the item as missing compatibility data, says it concerns tooltip display on focus, and links Chromium 829352 titled “Make the `title` attribute visible on keyboard focus”; it notes the SVG bug was marked duplicate. The issue contains no test results and no completed cross-browser compatibility table. The Chromium tracker did not expose readable details in the live fetch.
- **Corrected wording:** “Keyboard-focus tooltip behavior is not a verified cross-browser contract: MDN issue 16831 requests missing compatibility data and points to Chromium 829352. Treat SVG titles as a hover/accessible-name enhancement, and keep visible labels plus the data table as the keyboard/touch fallback.”
- **Corpus verdict:** T1 titles are shipped in the selected forms, while the contract's resolving SVG label and data table remain the robust non-hover path. The corpus does not add `tabindex` or promise focus-triggered tooltips. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:163-167; .opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html:74-83,139-146,187-190]`

### 5. colorarchive.org data-visualization colour guide

- **Verdict:** CORRECTED
- **Live URL:** https://colorarchive.org/guides/data-visualization-color-guide/ `[SOURCE: https://colorarchive.org/guides/data-visualization-color-guide/]`
- **Resolves:** Yes; the page is live and identifies itself as a ColorArchive guide, last copyright-marked 2026.
- **Documented version:** No standards, research-paper, or library version is declared.
- **What `research.md` said:** It used the guide for the claim that a sequential palette should preserve ordering in grayscale and for the recommendation that single-hue ramps are reliable and colour-blind-safe.
- **What the source says:** The page explicitly recommends a grayscale ordering test, single-hue sequential palettes, and Okabe-Ito/viridis/cividis defaults. However, it is a commercial curated color-library guide with no visible author, method, citations, or independent validation in the retrieved page.
- **Corrected wording:** “ColorArchive offers a useful practical heuristic—check sequential ordering in grayscale and do not rely on hue alone—but it is secondary guidance, not sufficient authority for a normative palette claim. Use W3C WCAG for contrast obligations, Okabe and Ito's Color Universal Design material for the qualitative palette rationale, and Paul Tol's technical notes for palette construction and grayscale/color-vision considerations.” Better sources: https://jfly.uni-koeln.de/color/ and https://sronpersonalpages.nl/~pault/.
- **Corpus verdict:** The pinned corpus has stronger local evidence than this guide for its actual delivery contract: explicit contrast thresholds, ramp step separation, and luminance monotonicity are encoded in the palette source and validator. F4.1 is therefore closed for the shipped palette gates; the external guide should not be the sole rationale. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json:18-26; .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs:163-189]`

## Assessment

Both WCAG citations support the stated AA thresholds, with the important scope distinctions: 1.4.3 applies to text/images of text, and 1.4.11 applies to meaningful non-text graphics and UI indicators. CSS-Tricks could not be checked because the live page returned 403. Issue 16831 and the Chromium reference justify uncertainty around focus-triggered title tooltips, not a proven cross-browser matrix. ColorArchive is live and practically useful but not authoritative enough for a normative palette claim; Okabe/Ito and Paul Tol are the better named sources.

**New-information ratio:** 0.89  
**Answered:** WCAG thresholds and scope, SVG focus-tooltip evidence, and the authority of colorarchive.org; corresponding palette/accessibility corpus status.  
**Correction impact:** Keep the corpus's 4.5:1/3:1 gates, remove any claim that the issue proves browser inconsistency, and cite primary/technical colour sources instead of ColorArchive for normative rationale. Leave the CSS-Tricks citation marked unverified.

## Reflection

- **What worked and why:** W3C's Understanding pages state both the ratios and the exceptions in the same current documents; the MDN issue exposes its evidentiary limits directly.
- **What did not work and why:** CSS-Tricks blocked automated retrieval, and Chromium's issue tracker did not expose a readable body, so neither can support a stronger behavior claim here.
- **What I would do differently:** Treat secondary guidance and issue trackers as corroboration or uncertainty evidence unless they expose method, test data, or normative text.

## Sources Consulted

- https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html
- https://css-tricks.com/svg-title-vs-html-title-attribute/
- https://github.com/mdn/browser-compat-data/issues/16831
- https://bugs.chromium.org/p/chromium/issues/detail?id=829352
- https://colorarchive.org/guides/data-visualization-color-guide/
- https://jfly.uni-koeln.de/color/
- https://sronpersonalpages.nl/~pault/

## Ruled Out

- **Using the CSS-Tricks article as verified evidence:** its live response was 403, so its contents cannot be vouched for.
- **Calling issue 16831 a cross-browser test result:** it is an open missing-data request, not a compatibility matrix.
- **Using ColorArchive as the sole authority for Okabe-Ito or grayscale claims:** the guide is secondary and uncited; use the original CUD material and Paul Tol's technical notes for those rationales.

## Questions Remaining

- Does the final corpus audit show every T1-T10 and C1-C3 status consistently at commit `756a7fcd4c`?
- Which uncited ECharts renderer, responsive, touch, and tooltip claims can be supported by current official documentation?
- What final verdict totals and ranked corrections should phase synthesis report?

## Recommended Next Focus

Run the tenth pass as a full corpus audit against T1-T10/C1-C3 and check the remaining uncited ECharts interaction/renderer claims before synthesis.
