# Iteration 1: correctness — extraction pipeline

Reviewed: .opencode/skills/sk-design-md-generator/tool/scripts/extract.ts, .opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts, .opencode/skills/sk-design-md-generator/tool/scripts/dom-collector.ts

Findings: 4 (P0=0 P1=1 P2=3)


## F001-01 [P1] 403 and 429 HTTP responses bypass error-handling and are processed as successful pages
- File: .opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts:668
- Evidence: In processPage(), loadPage() returns { status: 403, error: null } for a clean HTTP 403 response. The first error guard (line 643, `if (error)`) is skipped because error is null. The second guard (line 668, `if (status !== null && status >= 400 && status !== 403 && status !== 429)`) explicitly excludes 403 and 429 — presumably expecting the retry block at lines 651-662 to handle them. However, that retry block is gated behind `if (error)` (line 643), which is false for a clean 403/429. The result: 403 and 429 pages fall through both guards and are crawled as normal, extracting CSS tokens from error pages that can poison the design token output. The comment on line 669 ('Rate-limit and forbidden responses already handled above') documents the intent but does not match reality.
- Fix: Restructure the guards to check status before the error-only block, or move the 403/429 retry logic outside the `if (error)` gate. A clean fix: extract status checks first (`if (status === 403 || status === 429) { retry... }`), then handle network errors, then reject other HTTP errors.

```json
{
"claim": "403 and 429 HTTP responses bypass error-handling and are processed as successful pages",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts:668"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F001-02 [P2] PageData.errors array is always empty (dead field)
- File: .opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts:637
- Evidence: At line 637, `const errors: string[] = []` is initialized inside processPage(). No code path ever calls `errors.push(...)`. The field is returned in the PageData object at line 708 as `errors`, always an empty array. Any consumer of `PageData.errors` expecting meaningful per-page error data will be misled — the field suggests runtime error tracking that does not exist.
- Fix: Either remove the field from PageData (and the type definition) if unused, or wire up error-pushing at the catch sites within the try block (e.g., line 713 before re-throwing wrapping exceptions).


## F001-03 [P2] No SVG logo fallback when canvas pixel extraction fails on a found logo image
- File: .opencode/skills/sk-design-md-generator/tool/scripts/dom-collector.ts:487
- Evidence: extractLogoColors() (lines 435-548) has two extraction paths: (1) inline SVG logo if no `<img>` logo is found (lines 453-488), (2) canvas-based pixel analysis if an `<img>` logo IS found (lines 491-548). The SVG path is gated by `if (!logoImg)` at line 453, meaning it only runs when zero `<img>` logo selectors match. If an `<img>` logo IS found but canvas analysis fails (cross-origin taint causes `getImageData` to throw at line 506, caught at line 545 returning `null`), the function exits with `null` without ever attempting the SVG fallback. A page with both a cross-origin logo image AND an inline SVG logo (common pattern: `<img>` as primary with inline SVG in header) would lose all logo colors.
- Fix: Add an SVG fallback attempt in the catch block at line 545 before returning null, or restructure to try SVG extraction regardless of img discovery when canvas analysis fails.


## F001-04 [P2] Hardcoded viewport count (5) in screenshotCount calculation
- File: .opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:535
- Evidence: The report calculates `screenshotCount: crawlResult.pages.length * 5 + (darkModeData.darkScreenshots ? 5 : 0)` at line 535. The value 5 is directly coupled to the length of the VIEWPORTS array in crawl.ts (line 43-49), which also has 5 entries. No shared constant, import, or runtime reference ties these together. If VIEWPORTS changes (e.g., an additional mobile viewport), the extraction report's screenshot count becomes silently incorrect — it would undercount and misrepresent the actual output.
- Fix: Import or derive the viewport count from a shared constant, or compute it dynamically from the crawl result (e.g., `Object.keys(crawlResult.pages[0]?.screenshots ?? {}).length`).
