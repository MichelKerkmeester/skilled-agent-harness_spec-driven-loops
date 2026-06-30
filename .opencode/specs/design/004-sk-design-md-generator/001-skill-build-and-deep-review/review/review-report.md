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