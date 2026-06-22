# Deep Review Report: sk-design-md-generator

Generated: 2026-06-21T10:45:21Z · Executor: DeepSeek-v4-pro (--variant high) via cli-opencode · Iterations: 10 · Convergence: 0.907

---

## 1. Executive Summary

**Verdict: CONDITIONAL** (hasAdvisories: True)

Active findings: **P0=0 · P1=13 · P2=30** (43 total)

Scope: the `sk-design-md-generator` skill — 19 TypeScript tool modules + SKILL.md, references, assets, graph-metadata, changelog. Reviewed across all four dimensions (correctness, security, traceability, maintainability) over 10 DeepSeek passes. No P0 blockers. The skill is functional (tsc clean, vitest 50/50, live extraction works) but carries 13 P1 issues — real extraction bugs, input-hardening gaps, and SKILL.md claims that overstate what `validate.ts` actually checks.

## 2. Planning Trigger

`/speckit:plan` is **recommended** to remediate the 13 P1 findings (CONDITIONAL verdict).

```json
Planning Packet
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 13,
    "P2": 30
  },
  "remediationWorkstreams": [
    {
      "name": "Robustness & input hardening",
      "findings": [
        "F003-01",
        "F003-02",
        "F003-03",
        "F003-04",
        "F003-05"
      ]
    },
    {
      "name": "Extraction correctness fixes",
      "findings": [
        "F001-01",
        "F002-01",
        "F002-02",
        "F004-01"
      ]
    },
    {
      "name": "SKILL.md doc-vs-code reconciliation",
      "findings": [
        "F007-01",
        "F007-02",
        "F007-03",
        "F007-04",
        "F008-01"
      ]
    }
  ],
  "specSeed": "Reconcile SKILL.md/validate.ts claims; add input validation + guarded JSON.parse; gate ignoreHTTPSErrors behind an opt-in flag.",
  "planSeed": "P1 fixes first (security + correctness), then traceability doc fixes, then P2 advisories.",
  "findingClasses": {
    "class-of-bug": [
      "F001-01",
      "F002-01",
      "F002-02",
      "F003-01",
      "F003-02",
      "F003-03",
      "F003-04",
      "F004-01",
      "F007-01",
      "F007-02",
      "F007-03",
      "F007-04",
      "F008-01"
    ],
    "instance-only": [
      "F001-02",
      "F001-03",
      "F001-04",
      "F002-03",
      "F003-05",
      "F004-02",
      "F004-03",
      "F004-04",
      "F004-05",
      "F004-06",
      "F004-07",
      "F004-08",
      "F004-09",
      "F004-10",
      "F005-01",
      "F005-02",
      "F005-03",
      "F005-04",
      "F006-01",
      "F006-02",
      "F006-03",
      "F006-04",
      "F006-05",
      "F007-05",
      "F008-02",
      "F008-03",
      "F010-01",
      "F010-02",
      "F010-03",
      "F010-04"
    ]
  },
  "affectedSurfacesSeed": [
    ".opencode/skills/sk-design-md-generator/SKILL.md",
    ".opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts",
    ".opencode/skills/sk-design-md-generator/tool/scripts/extract.ts",
    ".opencode/skills/sk-design-md-generator/tool/scripts/icon-detect.ts",
    ".opencode/skills/sk-design-md-generator/tool/scripts/proof.ts",
    ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts",
    "cluster.ts",
    "css-analyzer.ts",
    "tool/scripts/validate.ts"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P0 (blockers)
_None._

### P1 (required)
- **F001-01** [P1] 403 and 429 HTTP responses bypass error-handling and are processed as successful pages
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts:668`
  - Evidence: In processPage(), loadPage() returns { status: 403, error: null } for a clean HTTP 403 response. The first error guard (line 643, `if (error)`) is skipped because error is null. The second guard (line 668, `if (status !== null && status >= 
  - Fix: Restructure the guards to check status before the error-only block, or move the 403/429 retry logic outside the `if (error)` gate. A clean fix: extract status checks first (`if (status === 403 || status === 429) { retry... }`), then handle 
- **F002-01** [P1] Hue-grouping angular distance formula broken for negative JS modulo
  - Dimension: correctness · `cluster.ts:779`
  - Evidence: The expression `Math.abs(((color.h - other.h + 180) % 360) - 180)` is the standard minimal-angular-distance formula, but it assumes a non-negative modulo. JavaScript's `%` operator preserves the dividend's sign. When `(color.h - other.h + 1
  - Fix: Replace with a sign-safe formula, e.g.: `const d = ((color.h - other.h) % 360 + 360) % 360; Math.min(d, 360 - d) <= 10`, or equivalently `((color.h - other.h + 180) % 360 + 360) % 360 - 180`.
- **F002-02** [P1] parseTransitionShorthand misidentifies CSS property when transition shorthand omits property name
  - Dimension: correctness · `css-analyzer.ts:229`
  - Evidence: Line 229 assigns `tokens[0]` as the `property`. When a transition shorthand omits the property name (valid CSS, e.g. `transition: 0.2s ease` where property defaults to `all`), the first whitespace-separated token is a time value like `0.2s`
  - Fix: Add logic to distinguish time values (matching `/^\d+\.?\d*(s|ms)$/`) from property names; if the first token is a time value, default `property` to `'all'` and shift remaining tokens.
- **F003-01** [P1] SSL certificate validation disabled site-wide
  - Dimension: security · `.opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts:633`
  - Evidence: `ignoreHTTPSErrors: true` passed to `browser.newContext()` on line 633 bypasses all TLS certificate validation. Every page crawled via `processPage` (Phase 1 and Phase 2 discovery) is fetched over a connection that accepts any cert, enablin
  - Fix: Remove `ignoreHTTPSErrors: true`. If certain sites legitimately need it, gate it behind an explicit `--insecure` CLI flag with a warning so the user opts in knowingly.
- **F003-02** [P1] Unvalidated parseInt on --concurrency/--max-pages allows negative/NaN values
  - Dimension: security · `.opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:82`
  - Evidence: `parseInt(args[++i], 10)` at lines 82 and 84 accepts any string. Passing `--concurrency -5` yields `Semaphore(-5)`, whose `active < limit` guard (`0 < -5`) never fires — no pages are crawled. Passing a non-numeric string yields `NaN`, break
  - Fix: Validate with `Math.max(1, parseInt(...))` or reject values < 1 with an error message before constructing the options object.
- **F003-03** [P1] Unguarded JSON.parse on --merge-with file crashes on malformed input
  - Dimension: security · `.opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:497`
  - Evidence: `JSON.parse(fs.readFileSync(options.mergeWith, 'utf-8'))` on line 497 has no try/catch. If the merge file exists but contains invalid JSON, an uncaught `SyntaxError` terminates the process after all crawling and extraction work is already d
  - Fix: Wrap in try/catch; on parse failure, log a warning and continue without merging instead of crashing.
- **F003-04** [P1] Unguarded JSON.parse + readFileSync crashes on missing/corrupt tokens file
  - Dimension: security · `.opencode/skills/sk-design-md-generator/tool/scripts/proof.ts:307`
  - Evidence: `JSON.parse(fs.readFileSync(tokensPath, 'utf-8'))` on line 307 has no try/catch and no `fs.existsSync` pre-check. If `tokensPath` is missing or contains malformed JSON, an uncaught `ENOENT` or `SyntaxError` terminates the process. The `runP
  - Fix: Wrap in try/catch; on failure, print a clear error message and exit gracefully rather than dumping a stack trace.
- **F004-01** [P1] Stroke width detection uses borderTopWidth instead of SVG stroke-width
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/icon-detect.ts:156`
  - Evidence: Line 156: `const bw = parseFloat(el.borderTopWidth);` — ElementStyle.borderTopWidth (types.ts:85) holds the CSS computed `border-top-width`, which for SVG elements defaults to `0px`. SVG stroke-width is a separate attribute/property not cap
  - Fix: Either add a `strokeWidth: number` field to ElementStyle and populate it from computed style `stroke-width` in the DOM collector, or scrape the SVG `stroke-width` attribute directly via `page.evaluate` in icon-detect.
- **F007-01** [P1] Validator checks only 12 of 17 required sections, contradicting SKILL.md's repeated 17-section claim
  - Dimension: traceability · `.opencode/skills/sk-design-md-generator/tool/scripts/validate.ts:213`
  - Evidence: SKILL.md states "17-section DESIGN.md format" at least 10 times (lines 12, 79, 220, 224, 228, 292, 294, 320, 358, 404), but validate.ts v2Sections array (lines 213-226) contains only 12 entries: sections 0-10 and 13, missing sections 11, 12
  - Fix: Either update validate.ts v2Sections to check all 17 sections (add the missing section identifiers), or correct SKILL.md to reflect the actual validator coverage (12 sections checked, not 17).
- **F007-02** [P1] SKILL.md claims validate.ts checks L1-L4 stability rules but no such check is implemented
  - Dimension: traceability · `.opencode/skills/sk-design-md-generator/tool/scripts/validate.ts:284`
  - Evidence: SKILL.md §3 VALIDATE phase (line 229): "Confirm L1/L2/L3/L4 classification rules were followed." The validate.ts module (lines 284-312) has five check functions: checkPhantomColors, checkUnknownFonts, checkFormatConsistency, checkSectionCom
  - Fix: Either add a stability-classification verification function to validate.ts, or remove the claim from SKILL.md's VALIDATE phase description.
- **F007-03** [P1] SKILL.md L1-L4 stability taxonomy (Permanent/System/Campaign/Content) doesn't match code taxonomy (infrastructure/system/campaign/content)
  - Dimension: traceability · `.opencode/skills/sk-design-md-generator/SKILL.md:273`
  - Evidence: SKILL.md §3 table (lines 273-278) defines four layers: L1=Permanent, L2=System, L3=Campaign, L4=Content. But cluster.ts classifyTokenStability functions (lines 400-565) emit layer values as: 'infrastructure' (score >= threshold), 'system' (
  - Fix: Align the taxonomy names between doc and code. Either rename code layers to match SKILL.md (L1/L2/L3/L4 with Permanent/System/Campaign/Content), or update SKILL.md to document the actual layer values output by the clusterer.
- **F007-04** [P1] SKILL.md claims validate output includes "per-error line references" but most validation checks report no line numbers
  - Dimension: traceability · `.opencode/skills/sk-design-md-generator/SKILL.md:230`
  - Evidence: SKILL.md §3 VALIDATE phase (line 230) claims: "Output: validation pass/fail with per-error line references." In validate.ts, checkPhantomColors (line 89) returns { type, value, message } with no line number. checkUnknownFonts (line 145) sam
  - Fix: Either add line-number tracking to all validation checks (tracking position in mdContent), or update SKILL.md to say "per-error line references for format errors only" instead of the universal claim.
- **F008-01** [P1] Validator checks only 12 v2 sections but format spec requires sections 6.5, 11, and 12 as core
  - Dimension: traceability · `tool/scripts/validate.ts:213`
  - Evidence: validate.ts checkSectionCompleteness lists 12 v2 sections (0-10, 13). It is missing `## 6.5. Motion System`, `## 11. State Matrix`, and `## 12. Iconography` — all three are marked REQUIRED in design-md-format.md lines 43-50. The validator w
  - Fix: Add `## 6.5. Motion System`, `## 11. State Matrix`, and `## 12. Iconography` to the v2Sections array in validate.ts:214-226.

### P2 (advisory)
- **F001-02** [P2] PageData.errors array is always empty (dead field)
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts:637`
  - Evidence: At line 637, `const errors: string[] = []` is initialized inside processPage(). No code path ever calls `errors.push(...)`. The field is returned in the PageData object at line 708 as `errors`, always an empty array. Any consumer of `PageDa
  - Fix: Either remove the field from PageData (and the type definition) if unused, or wire up error-pushing at the catch sites within the try block (e.g., line 713 before re-throwing wrapping exceptions).
- **F001-03** [P2] No SVG logo fallback when canvas pixel extraction fails on a found logo image
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/dom-collector.ts:487`
  - Evidence: extractLogoColors() (lines 435-548) has two extraction paths: (1) inline SVG logo if no `<img>` logo is found (lines 453-488), (2) canvas-based pixel analysis if an `<img>` logo IS found (lines 491-548). The SVG path is gated by `if (!logoI
  - Fix: Add an SVG fallback attempt in the catch block at line 545 before returning null, or restructure to try SVG extraction regardless of img discovery when canvas analysis fails.
- **F001-04** [P2] Hardcoded viewport count (5) in screenshotCount calculation
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:535`
  - Evidence: The report calculates `screenshotCount: crawlResult.pages.length * 5 + (darkModeData.darkScreenshots ? 5 : 0)` at line 535. The value 5 is directly coupled to the length of the VIEWPORTS array in crawl.ts (line 43-49), which also has 5 entr
  - Fix: Import or derive the viewport count from a shared constant, or compute it dynamically from the crawl result (e.g., `Object.keys(crawlResult.pages[0]?.screenshots ?? {}).length`).
- **F002-03** [P2] Identical classifyShadow redefined locally, shadowing the exported version
  - Dimension: correctness · `cluster.ts:1044`
  - Evidence: The exported `classifyShadow` at line 374 and the local one at line 1044 are character-for-character identical implementations. The local copy shadows the exported one inside `clusterTokens`. Future edits risk updating only one copy, causin
  - Fix: Delete the local copy at line 1044 and call the exported `classifyShadow` (line 374) directly within `clusterTokens`.
- **F003-05** [P2] --output flag reads undefined when no value follows, default overrides it silently
  - Dimension: security · `.opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:80`
  - Evidence: `output = args[++i]` accesses beyond the array when `--output` is the last argument, yielding `undefined`. The default-path fallback at line 142 (`if (!output)`) masks this, so the bug is non-fatal — but if `--output` is followed by another
  - Fix: Check that `i + 1 < args.length` and that `args[i+1]` does not start with `--` before consuming the value; print an error and exit if the value is missing.
- **F004-02** [P2] extractA11y accepts unused page parameter
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/a11y-extract.ts:258`
  - Evidence: Line 258: function signature `extractA11y(domCollections, interactions, cssAnalyses?, page?)` — the `page` parameter is declared but never referenced in the function body. All page-dependent work is in `extractA11yAsync`.
  - Fix: Remove the `page?: Page` parameter from the signature and update callers.
- **F004-03** [P2] parseRgb returns null for CSS Color Level 4 shorthand hex values
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/a11y-extract.ts:42`
  - Evidence: Line 32 regex `/{3,8}/` matches 4- and 8-char hex (e.g. #abcd, #rrggbbaa). Line 42 `hex.length >= 6` only handles 6+ char hex; 4-char (CSS Color Level 4 #rgba) and 8-char (#rrggbbaa) fall through to `return null`. For 8-char, bit extraction
  - Fix: Add explicit handling for 4-char and 8-char hex lengths in parseRgb, or tighten the regex to only match lengths the function handles (`{3}|{6}`).
- **F004-04** [P2] Skip link detection only works for anchor elements
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/a11y-extract.ts:199`
  - Evidence: Lines 194-199: the element selector finds the first focusable element, but line 199 `if (tag !== 'a') return false` only accepts `<a>` tags. A `<button>` element with inner text 'Skip to main content' is a valid (and common) skip-link patte
  - Fix: Also check `<button>` elements with skip-link text patterns, or broaden the selector to `a[href^='#']` to only match anchor-links.
- **F004-05** [P2] Dead no-op filter in toggle button locator
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/dark-mode-detect.ts:177`
  - Evidence: Line 177: `filter({ has: page.locator(':scope') })` — `:scope` as a descendant selector always resolves to the element itself, so the filter never excludes any candidate. It adds overhead (locator resolution per candidate) but never changes
  - Fix: Remove the `filter` call; the locator already correctly selects buttons/checkboxes with dark/theme/mode/light text via `hasText`.
- **F004-06** [P2] buildVariableDiff silently drops dark-mode-only variables
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/dark-mode-detect.ts:210`
  - Evidence: Lines 208-213: the diff only includes variables present in `lightMap` (pre-populated from light variables). CSS custom properties that exist only in dark mode (e.g. `--dark-surface`) are never reported, giving a misleading picture of the va
  - Fix: Add a second pass that captures variables unique to dark mode, or change the return type to include `darkOnly: {name,value}[]`.
- **F004-07** [P2] SVG data-attribute checks in detectLibrary are unreachable dead code
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/icon-detect.ts:143`
  - Evidence: Line 143: `allClassData.push({ className: el.className, attributes: {} })` always sets `attributes` to an empty object. Lines 57 and 60 in `detectLibrary` check `d.attributes['data-lucide']` and `d.attributes['data-feather']`, which are alw
  - Fix: Populate `attributes` from the actual ElementStyle fields (the type has no generic attribute map), or add a `page.evaluate` step in `detectIconLabels` to collect `data-lucide`/`data-feather` attributes from live SVG elements.
- **F004-08** [P2] Dead _domCollections parameter
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/motion-extract.ts:98`
  - Evidence: Line 98: the parameter is named with underscore prefix `_domCollections` and is never referenced in the function body.
  - Fix: Remove the parameter from the function signature and update callers.
- **F004-09** [P2] Dead assignment: globalColors set never read
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/design-boundary-detect.ts:176`
  - Evidence: Line 176 `globalColors.add(hex)` populates the set inside `detectAnomalies`, but `globalColors` is never referenced afterward — it's built and discarded.
  - Fix: Remove the `globalColors` variable and Line 176 assignment, or use it (e.g., to report global-vs-page-unique color ratios).
- **F004-10** [P2] hexToRgb returns wrong channels for 8-digit hex with alpha
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/design-boundary-detect.ts:47`
  - Evidence: Lines 42-47: `parseInt(clean, 16)` for 8-char `#RRGGBBAA` produces a 32-bit integer. `(n >> 16) & 255` extracts the GG byte, `(n >> 8) & 255` extracts BB, and `n & 255` extracts AA — the R channel (highest byte) is lost. The color distance 
  - Fix: Detect and skip alpha channel: if `clean.length >= 8`, extract `(n >> 24) & 255` for R instead of `>>16`, or strip alpha before parsing.
- **F005-01** [P2] Component variant names not HTML-escaped
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/report-gen.ts:502`
  - Evidence: Line 502: `${cg.variants.map((v: { name: string }) => v.name).join(', ')}` — variant `name` (derived from extracted CSS class names) is injected directly into HTML `<td>` without `esc()` wrapping, unlike every other text field in the templa
  - Fix: Wrap with `esc()`: `cg.variants.map((v) => esc(v.name)).join(', ')`.
- **F005-02** [P2] withTimeout timer never cleared, produces misleading timeout warnings
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/interaction-capture.ts:364`
  - Evidence: The `withTimeout` function (line 356-370) uses `Promise.race` with a `setTimeout` but never calls `clearTimeout`. When the inner promise resolves before the timeout, the `setTimeout` callback still fires later and logs `[interaction-capture
  - Fix: Capture the timer ID (`const id = setTimeout(...)`) and call `clearTimeout(id)` in a `.then/.finally` on the inner promise.
- **F005-03** [P2] Font-family names in HTML comment may break comment structure
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/report-gen.ts:249`
  - Evidence: Line 249: `<!-- Note: ${uniqueFamilies.join(', ')} may be proprietary -->`. Font-family names from `getComputedStyle` can theoretically contain `-->` (e.g. via a crafted @font-face), which would prematurely close the HTML comment and inject
  - Fix: Escape `-->` sequences: `uniqueFamilies.map(f => f.replace(/-->/g, '-- >')).join(', ')`, or place outside the comment.
- **F005-04** [P2] Shadow value not HTML-escaped in Card section (inconsistent with Shadow section)
  - Dimension: correctness · `.opencode/skills/sk-design-md-generator/tool/scripts/preview-gen.ts:233`
  - Evidence: Line 226 escapes shadow values: `box-shadow:${escapeHtml(s.value)}`. But line 233 injects the same `shadows[0].value` raw: `box-shadow:${shadows[0].value}`. If a shadow value contained `"` (e.g. `0 0 0 \"evil\"`), the style attribute would 
  - Fix: Apply `escapeHtml()` consistently: `box-shadow:${escapeHtml(shadows[0].value)}` at line 233.
- **F006-01** [P2] Section dividers duplicated and interleaved across file
  - Dimension: maintainability · `.opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:40`
  - Evidence: The style guide (§4 Standard Section Order) prescribes: 1 IMPORTS → 2 TYPE DEFINITIONS → 3 CONSTANTS → 4 HELPERS → 5 CORE LOGIC → 6 EXPORTS — each section number appears once. extract.ts has section 2 TYPE DEFINITIONS at lines 40 AND 193, s
  - Fix: Reorganize extract.ts so each section number appears once in standard order: move all type definitions to a single section 2, all helpers (printUsage, log, urlToSlug) to section 4, and keep core logic (parseArgs, extract, CLI entry point) i
- **F006-02** [P2] Section 5 (CORE LOGIC) appears before Section 4 (HELPERS)
  - Dimension: maintainability · `.opencode/skills/sk-design-md-generator/tool/scripts/cluster.ts:72`
  - Evidence: Line 72: `// 5. CORE LOGIC` containing `parseColor` function. Line 186: `// 4. HELPERS` containing `hslToRgb`, `clampByte`, etc. The style guide §4 standard order is HELPERS (4) before CORE LOGIC (5). The file places core logic `parseColor`
  - Fix: Move the HELPERS section (lines 186-324: hslToRgb, clampByte, clamp01, rgbaToHex, rgbaKey, extractShadowColors, extractGradientColors, relativeLuminance, wcagContrast, gcd, mode, parsePxValue) before the CORE LOGIC section (parseColor and c
- **F006-03** [P2] Duplicate classifyShadow function: exported version (line 374) and nested version (line 1044)
  - Dimension: maintainability · `.opencode/skills/sk-design-md-generator/tool/scripts/cluster.ts:374`
  - Evidence: `export function classifyShadow` at line 374 and `function classifyShadow` nested inside `clusterTokens` at line 1044 have identical logic (same shadow-splitting, same numeric analysis, same return types). The nested one shadows the exporte
  - Fix: Remove the nested `classifyShadow` at line 1044 and call the exported `classifyShadow` at line 374 instead. If the nested version intentionally differs, document why and rename to avoid collision.
- **F006-04** [P2] CONSTANTS (section 2) and TYPE DEFINITIONS (section 3) are reversed from standard order
  - Dimension: maintainability · `.opencode/skills/sk-design-md-generator/tool/scripts/css-analyzer.ts:24`
  - Evidence: Line 21-23: `// 2. CONSTANTS` contains `TRACKED_PSEUDO_CLASSES`. Line 34-36: `// 3. TYPE DEFINITIONS` contains `CSSSource`. The style guide §4 standard order: 2 TYPE DEFINITIONS, 3 CONSTANTS. The file has them swapped (CONSTANTS first, TYPE
  - Fix: Swap sections: move the `interface CSSSource` block to section 2 TYPE DEFINITIONS and `const TRACKED_PSEUDO_CLASSES` to section 3 CONSTANTS.
- **F006-05** [P2] PageExtraction interface duplicated in cluster.ts and extract.ts instead of shared in types.ts
  - Dimension: maintainability · `.opencode/skills/sk-design-md-generator/tool/scripts/cluster.ts:36`
  - Evidence: `interface PageExtraction` defined at cluster.ts:36 and again at extract.ts:195 with identical shape (`{ url: string; dom: DOMCollection; css?: CSSAnalysis; interactions?: InteractionData }`). Neither imports from the other; TypeScript stru
  - Fix: Move `PageExtraction` to types.ts as an exported interface, then import it from both cluster.ts and extract.ts. Remove the local definitions in both files.
- **F007-05** [P2] WRITE phase (Phase 2) described as automated pipeline step but has no TypeScript implementation
  - Dimension: traceability · `.opencode/skills/sk-design-md-generator/SKILL.md:207`
  - Evidence: SKILL.md §3 (line 207): "Every extraction runs as a sequential pipeline. No phase can be skipped in a full run" and lines 218-224 describe automated WRITE flow: "Read tokens.json... Compose 17-section DESIGN.md... Output: DESIGN.md at the u
  - Fix: Clarify in SKILL.md §3 that EXTRACT and VALIDATE are automated TypeScript tools while WRITE is a handover step performed by the AI agent using tokens.json + design-md-format.md. Remove the implication of full automation.
- **F008-02** [P2] HTML footer in report-gen.ts still contains original project name "design-md-generator"
  - Dimension: traceability · `tool/scripts/report-gen.ts:621`
  - Evidence: Line 621: `<footer class="footer">design-md-generator · ...</footer>`. Similarly proof.ts line 288: `Generated by design-md-generator proof · ...`. These are the original open-source project name and should have been removed during de-attri
  - Fix: Replace with "sk-design-md-generator" or a neutral identity label consistent with the tool's current name in package.json ("design-system-extractor").
- **F008-03** [P2] "17-section" count is repeated across all docs but does not match the format spec or the validator
  - Dimension: traceability · `README.md:4`
  - Evidence: SKILL.md (line 3, 12, etc.), README (line 4, 14, 26, 73, 203), extraction_workflow.md (line 55), cardinal_rules_card.md (line 42), and troubleshooting.md all say "17-section." But design-md-format.md lines 31-53 define 14 numbered core (0-1
  - Fix: Pick a consistent section count that matches the format spec (e.g. "14-section core format" or "18-section v2 format"), update all doc occurrences, and align validate.ts to enforce the same required set defined by design-md-format.md.
- **F010-01** [P2] Version string mismatch between SKILL.md frontmatter and changelog
  - Dimension: maintainability · `.opencode/skills/sk-design-md-generator/SKILL.md:5`
  - Evidence: SKILL.md:5 declares `version: 1.0.0` (three-segment). The changelog file is named `v1.0.0.0.md` and its H1 reads `v1.0.0.0 - First Stable Release` (four-segment). The spec at 152-sk-design-md-generator and graph-metadata.json both lack an e
  - Fix: Align to a single version-segment convention. The house practice for global component changelogs uses four-segment (vA.B.C.D), so update SKILL.md frontmatter `version: 1.0.0.0` to match the changelog, or vice versa.
- **F010-02** [P2] Dead link to tool/README.md in invocation section
  - Dimension: maintainability · `.opencode/skills/sk-design-md-generator/SKILL.md:267`
  - Evidence: SKILL.md:267 reads 'Real extract flags (see `tool/README.md`): ...'. Neither `tool/README.md` nor any README under `tool/` exists on disk (glob returns no files). The only README is at the skill root.
  - Fix: Either ship a minimal `tool/README.md` documenting extract flags, or re-point the reference to `INSTALL_GUIDE.md` which already covers extract flags (line 100-113).
- **F010-03** [P2] Spec continuity key_files points to a non-existent file
  - Dimension: maintainability · `.opencode/specs/skilled-agent-orchestration/152-sk-design-md-generator/spec.md:21`
  - Evidence: spec.md `_memory.continuity.key_files` lists only `".opencode/skills/sk-design-md-generator/tool/design-md-workflow.md"`. Glob confirms no file at that path exists. The shipped skill's canonical format doc is `tool/resources/design-md-forma
  - Fix: Update spec.md `_memory.continuity.key_files` to list the actual shipped files: `tool/resources/design-md-format.md`, `SKILL.md`, `references/extraction_workflow.md`, etc.; or remove the stale entry.
- **F010-04** [P2] Sections 5 (REFERENCES) and 8 (REFERENCES AND RELATED RESOURCES) duplicate content
  - Dimension: maintainability · `.opencode/skills/sk-design-md-generator/SKILL.md:315`
  - Evidence: §5 (line 315-350) and §8 (line 403-415) both enumerate the tool resource docs (design-md-format.md, writing-style-guide.md, etc.), the gold-standard examples (stripe/vercel/linear/supabase), the skill-owned references, the related skills, a
  - Fix: Collapse the overlapping content. Keep §5 as the canonical reference list and reduce §8 to a 2-3 line pointer back to §5 and §2 (the router), removing the duplicated entries.

## 4. Remediation Workstreams

1. **P1 — Security/robustness hardening** (`crawl.ts`, `extract.ts`, `proof.ts`): gate `ignoreHTTPSErrors` behind an explicit `--insecure` flag; validate `parseInt` args (floor at 1, reject NaN); wrap `JSON.parse`/`readFileSync` in try/catch with graceful failure.
2. **P1 — Extraction correctness** (`crawl.ts`, `cluster.ts`, `css-analyzer.ts`, `icon-detect.ts`): fix the 403/429 fall-through past both guards; fix the negative-modulo hue-distance; fix `parseTransitionShorthand` property detection; use real SVG `stroke-width` not `borderTopWidth`.
3. **P1 — SKILL.md ↔ validate.ts reconciliation** (`SKILL.md`, `validate.ts`): the docs claim validate checks all 17 sections, L1-L4 stability rules, and per-error line refs; the validator checks ~12 sections and no stability rules. Either tighten the validator or correct the docs.
4. **P2 advisories** (30): HTML-escaping in report/preview generators, dead `errors` field, hardcoded viewport count, and other robustness/maintainability gaps — backlog.

## 5. Spec Seed

- Make `validate.ts` cover all v2 sections (incl. 6.5) and the L1-L4 stability gates, OR amend SKILL.md to describe the validator's true scope.
- Add a CLI input-validation layer (numeric floors, missing-value guards, opt-in insecure flag).
- Standardize guarded file reads across `extract.ts`/`proof.ts`/`validate.ts`.

## 6. Plan Seed

- Task 1: harden CLI/input + guarded JSON.parse (security P1s).
- Task 2: fix the four extraction correctness P1s with targeted unit tests.
- Task 3: reconcile SKILL.md claims with validate.ts behavior (traceability P1s).
- Task 4: sweep P2 HTML-escaping + cleanup advisories.

## 7. Traceability Status

- Core (spec_code, checklist_evidence): the SKILL.md↔code drift on validation scope is the main unresolved item (4 P1 traceability findings on `validate.ts`/`SKILL.md`).
- Overlay (skill_agent, graph): graph-metadata registration reviewed clean (iteration 9, 0 findings). De-attribution reviewed clean (iteration 8: no residual original-project references in the skill layer).
- AC_COVERAGE: exempt (skill target, not a lifecycle spec-folder under active AC tracking).

## 8. Deferred Items

- The 30 P2 advisories (HTML-escaping, timer cleanup, dead fields, hardcoded constants) do not block the verdict and can be batched into a follow-on hardening pass.

## 9. Search Ledger

*Orchestrated-seat review (read-only DeepSeek passes, orchestrator-written state). Per-dimension coverage: correctness (4 passes), security (1), traceability (2), maintainability (3). No code-graph search-depth state captured (v1 record).*

## 10. Audit Appendix

- Convergence: score 0.907; all 4 dimensions covered; 10/10 iterations; 0 P0.
- Coverage: 19 tool modules + 6 skill-layer docs + graph-metadata, across 10 passes.
- Method: parallel read-only DeepSeek-v4-pro review seats (the deep-review packet structure, canonical state in `review/`), reduced via `reduce-state.cjs`.
- Sources reviewed: `tool/scripts/*.ts`, `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, `references/*`, `assets/*`, `graph-metadata.json`, `changelog/v1.0.0.0.md`.

---

## 11. Remediation Addendum (2026-06-21T12:12:36Z)

All **13 P1 findings remediated** (commit `10a5a7cc88`). The 30 P2 advisories remain as backlog.

| Group | P1s fixed | Files |
|---|---|---|
| Input hardening (security) | parseInt validation, two guarded JSON.parse, TLS bypass gated behind opt-in `--insecure` | extract.ts, proof.ts, crawl.ts |
| Extraction correctness | 403/429 fall-through, circular hue-distance modulo, transition-shorthand token classification, SVG stroke-width (threaded through collector) | crawl.ts, cluster.ts, css-analyzer.ts, icon-detect.ts, types.ts, dom-collector.ts |
| Doc-vs-code drift | validate.ts tightened to check core sections 6.5/11/12; SKILL.md Process Flow corrected to validate.ts's real behavior | validate.ts, SKILL.md |

**Verification:** tsc 0 errors · vitest 50/50 · alignment verifier 0 findings · live extraction green · negative test (`--concurrency 0` now fails loudly) · comment hygiene 0 violations.

**Post-remediation state:** 0 P0, 0 active P1, 30 P2 advisory (backlog). Effective verdict: **PASS (with P2 advisories)**.
