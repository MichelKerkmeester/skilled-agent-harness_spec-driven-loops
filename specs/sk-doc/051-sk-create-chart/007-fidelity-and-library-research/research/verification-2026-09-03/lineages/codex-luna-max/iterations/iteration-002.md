# Iteration 2: D3 tick generation, formatting, and color schemes

**Run:** 2 of 10  
**Retrieved:** 2026-09-03  
**Baseline:** `research/lineages/deepseek-flash-max/research.md:43,53-57,67`

## Focus

Verify the D3 `d3-scale`, `d3-array`, `d3-format`, and `d3-scale-chromatic` citations, including the 1/2/5 tick family and whether the old GitHub fragment is a usable citation target.

## Findings

### 1. `d3-scale` v4.0.2 tick, format, and nice APIs

- **Verdict:** VERIFIED
- **Live URL:** https://github.com/d3/d3-scale/blob/v4.0.2/README.md `[SOURCE: https://github.com/d3/d3-scale/blob/v4.0.2/README.md]`
- **Resolves:** Yes; the repository page is explicitly on tag `v4.0.2`.
- **Documented version:** `d3-scale v4.0.2`.
- **Evidence:** The tagged README says `continuous.ticks([count])` returns approximately the requested number of uniformly spaced, human-readable values within the domain; `tickFormat` automatically computes precision from the fixed tick interval; and `nice` extends the domain to round values. It also says the count is only a hint. These are the exact behaviors attributed in the baseline.

### 2. `d3-array` ticks and the 1/2/5 family

- **Verdict:** CORRECTED
- **Live URL checked:** https://github.com/d3/d3-array#ticks `[SOURCE: https://github.com/d3/d3-array#ticks]`
- **Resolves:** The URL resolves to the current `d3-array` repository, but the rendered page does not expose a `#ticks` section or the tick API text; the fragment is therefore a poor citation target for the claim.
- **Documented version:** Repository `main` page; no stable release is identified by the URL.
- **What the baseline said:** `d3-array#ticks` supports a power-of-ten times `1`, `2`, or `5` family and avoids floating-point drift through integer tick computation.
- **Correct source and wording:** The authoritative current page is https://d3js.org/d3-array/ticks. It says `ticks(start, stop, count)` returns approximately `count + 1` uniformly spaced, nicely rounded values and that each is a power of ten multiplied by `1`, `2`, or `5`; it also says `tickIncrement` uses integer steps to represent returned ticks as precisely as possible in IEEE 754. The corrected citation should use the official page, and should say “approximately count + 1” rather than implying a fixed count. `[SOURCE: https://d3js.org/d3-array/ticks]`

### 3. D3 SI-prefix formatting

- **Verdict:** VERIFIED
- **Live URL:** https://d3js.org/d3-format `[SOURCE: https://d3js.org/d3-format]`
- **Resolves:** Yes; official D3 documentation.
- **Documented version:** The D3 site identifies release `7.9.0`; the page does not separately state the `d3-format` package semver.
- **Evidence:** The format-type table defines `s` as decimal notation with an SI prefix, rounded to significant digits, and the examples show `d3.format('.2s')(42e6)` producing `42M`. This supports the baseline's use of D3's SI formatter as a reference for human-readable numbers.

### 4. `d3-scale-chromatic`

- **Verdict:** VERIFIED
- **Live URL:** https://d3js.org/d3-scale-chromatic `[SOURCE: https://d3js.org/d3-scale-chromatic]`
- **Resolves:** Yes; official D3 documentation.
- **Documented version:** The D3 site identifies release `7.9.0`; the module page does not separately state its package semver.
- **Evidence:** The page says the module supplies sequential, diverging, and categorical color schemes designed for `d3-scale`, with most schemes derived from ColorBrewer and sequential/diverging schemes interpolated from discrete schemes. The linked categorical page lists `schemeCategory10`, `schemeTableau10`, and other named arrays. The baseline's description of the module is accurate.

## Corpus at commit `756a7fcd4c228b1faeddbf10f449cfbc2409656f`

- **Tick ladder:** The corpus has a deliberately finer local ladder `[1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]` and derives the ceiling from `niceStep`; `bar-columns.html` uses it at lines 132-150 and prints ticks by integer index at lines 156-160. This matches the human-readable/niced outcome but is not D3 code. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html:132-160]`
- **Auto-precision and dust protection:** `bar-columns.html` defines `fmt` with fixed six-decimal cleanup, comma grouping, and an em dash for non-finite values at lines 112-130; `candlestick.html` uses `floor + step * t` rather than repeated addition at lines 172-181. T2 is closed in the shipped commit. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html:112-130; .opencode/skills/sk-doc/sk-create-chart/assets/templates/candlestick.html:172-181]`
- **D3 color schemes:** The corpus does not import `d3-scale-chromatic`; its color choices are pasted into the local palette source and validated by the corpus gates. This is a deliberate contract-compatible equivalent, not a missing runtime dependency. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:157-160; .opencode/skills/sk-doc/sk-create-chart/references/color-system.md:1-12]`

## Assessment

The D3 behaviors are current and well supported. The only correction is citation hygiene: replace the GitHub `#ticks` fragment with `https://d3js.org/d3-array/ticks` and qualify the result as approximately `count + 1`. The commit-pinned corpus has closed the formatter and floating-point tick-loop gap; it remains intentionally dependency-free and does not need D3's runtime color-scheme package.

**New-information ratio:** 0.88  
**Answered:** D3 tick/nice/tickFormat behavior, the 1/2/5 family, SI formatting, and color-scheme module scope.  
**Correction impact:** Update the citation and wording for d3-array; do not change T2, which is already implemented at the pinned commit.

## Reflection

- **What worked and why:** The tagged d3-scale README and current D3 API pages expose both semantic behavior and version context.
- **What did not work and why:** The GitHub repository fragment did not render the requested API section, so it could not carry the claim by itself.
- **What I would do differently:** Prefer the D3 API site's per-function page for fragment-sensitive citations, retaining a tag URL only when the tag itself is the point.

## Sources Consulted

- https://github.com/d3/d3-scale/blob/v4.0.2/README.md
- https://github.com/d3/d3-array#ticks
- https://d3js.org/d3-array/ticks
- https://d3js.org/d3-format
- https://d3js.org/d3-scale-chromatic

## Ruled Out

- **Adding D3 as a runtime dependency:** The corpus contract forbids remote resources and package-manager delivery; the local ladder and formatter already provide the required static behavior. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-160]`

## Questions Remaining

- Which current Vega-Lite pages support the mark/encoding, auto-guide, sizing, legend, formatting, and transform claims?
- Which versioned Vega-Lite axis defaults changed between v1, v4, and current?

## Recommended Next Focus

Current Vega-Lite specification, size, legend, format, and transform documentation, followed by a comparison with the versioned v1/v4 axis and scale pages.
