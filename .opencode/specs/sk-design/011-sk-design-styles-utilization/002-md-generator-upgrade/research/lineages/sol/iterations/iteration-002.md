# Iteration 2: Corpus-Calibrated Schema and Vocabulary

## Focus

This iteration answered Q2 by deterministically measuring all 1,290 complete style bundles for section presence and relative order, Quick Start field coverage, token-category/cardinality vocabulary, semantic typography roles, and meaningful absence patterns. It compared those distributions with the current v3 reference and `emitQuickStart` implementation while treating frequency as calibration evidence rather than a quality vote.

## Actions Taken

1. Verified the detached packet boundary and confirmed that `iteration-002.md` and `iter-002.jsonl` did not exist before research.
2. Scanned all 1,290 `DESIGN.md` and `design-tokens.json` pairs with deterministic Python counters for headings, heading sequences, Quick Start fields, token paths, themes, and conditional absences.
3. Read the current v3 section-presence, semantic typography-role, and Quick Start contracts.
4. Read the live v3 formatter/emitter and one complete corpus bundle (`099-supply`) vertically to check what the aggregate counters represented.
5. Narrowly re-read corpus anomalies after the aggregate pass: the single core-order exception, ten shadow-without-Elevation bundles, two spacing-category absences, and six Imagery absences. The first anomaly probe had an f-string quoting error; the corrected probe completed without an evidence gap.

## Findings

1. **Use a versioned schema with a stable spine, explicit conditional sections, and extension slots—not an exact corpus-majority sequence.** Seven H2 sections occurred in all 1,290 bundles (`Tokens — Colors`, `Tokens — Typography`, `Tokens — Spacing & Shapes`, `Components`, `Do's and Don'ts`, `Agent Prompt Guide`, and `Quick Start`); `Surfaces` occurred in 1,266, `Elevation` in 1,201, `Imagery` in 1,284, `Layout` in 1,239, and `Similar Brands` in 1,283. Core relative order held in 1,289/1,290 bundles, but 748 bundles had at least one extra H2 and the corpus contained 448 distinct extra-H2 labels. Therefore a calibrated manifest should encode `required`, `conditional/capability`, and ordered `extension-slot` states while flagging—not automatically rejecting—unknown sections. Rough build cost: **2–4 engineer-days** for the shared manifest and tests already scoped in iteration 1; extension-slot and capability metadata fit inside that estimate. [SOURCE: command: deterministic Python scan of `.opencode/skills/sk-design/styles/*/DESIGN.md`; outputs `BUNDLES=1290`, `CORE_RELATIVE_ORDER_OK=1289/1290`, `EXTRA_H2_BUNDLES=748/1290`, `UNIQUE_EXTRA_H2=448`, and `TOP_H2`] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:284-300] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/findings-registry.json:51-58]

2. **Quick Start needs a capability matrix shared by schema, emitter, and validator.** Both `### CSS Custom Properties` and `### Tailwind v4` appeared in 1,290/1,290 Quick Starts. Prefix coverage was universal for `--color-*`, `--font-*`, `--text-*`, `--leading-*`, `--font-weight-*`, and `--radius-*`, but conditional for tracking (1,007), spacing (1,288), page width (1,078), section gap (1,257), element gap (1,283), shadows (522), and surfaces (1,266). The live emitter only builds colors, text/leading, spacing, page width, and radius; it omits font-family, tracking, weight, shadow, and surface groups that the reference describes. A shared manifest should specify each group's source, requiredness, omission predicate, and CSS-vs-Tailwind eligibility, then drive both emission and consistency validation. Rough build cost: **2–4 engineer-days** for manifest-driven emission plus focused formatter/validator tests. [SOURCE: command: deterministic Quick Start scan over 1,290 corpus `DESIGN.md` files; outputs `QUICK_BOTH=1290/1290` and `QUICK_PREFIX_BUNDLE_COVERAGE`] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:235-280] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:187-238] [INFERENCE: estimate is bounded to one emitter, the shared manifest, and focused tests at the iteration-1 attachment points]

3. **Calibrate token vocabulary as category presence plus distributions, never fixed counts or averaged values.** `color`, `font`, and `typography` were present in every JSON bundle; `spacing` appeared in 1,288, `surface` in 1,266, `radius` in 1,124, and `shadow` in only 522. Per-bundle medians (p10–p90) were color 9 (4–16), font 2 (1–5), typography 18 (8–36), spacing 12 (7–16), surface 4 (2–5), radius 3 (0–8), and shadow 0 (0–3). The schema should therefore version category names and value shapes while using family/capability-aware ranges only as diagnostics; it must not force median cardinalities or synthesize missing categories. Rough build cost: **1–2 engineer-days** for a checked corpus-summary generator and range artifact consumed by later validation work. [SOURCE: command: deterministic JSON scan of `.opencode/skills/sk-design/styles/*/design-tokens.json`; output `CATEGORY_COUNTS per_bundle present,min,p10,median,p90,max` and `JSON_FAILURES=0`] [SOURCE: .opencode/skills/sk-design/styles/099-supply/design-tokens.json:1-220] [INFERENCE: estimate covers summary generation and serialization, not extraction changes]

4. **Typography needs a semantic-role normalizer with an extensible vocabulary; raw JSON scale keys and DOM-tag fallbacks are not the contract.** Corpus Type Scale tables strongly support the current semantic core—caption 1,160 bundles, display 1,152, heading 1,110, body 1,070, subheading 1,051, heading-sm 964, heading-lg 786, and body-sm 688—but also contain meaningful roles such as body-lg 275, display-xl 113, display-lg 100, micro 39, hero 35, and eyebrow 23. By contrast, JSON typography keys are size-like (`base`, `5xl`, `sm`, suffixed variants), while the live emitter derives roles from `h1`–`h6` or opaque `tN`. Define a stable core role enum plus namespaced/validated extensions, rank-map measured sizes into it, and preserve source labels as metadata. Rough build cost: **2–3 engineer-days** for role normalization, collision handling, and fixtures. [SOURCE: command: deterministic Type Scale table scan over 1,290 corpus `DESIGN.md` files; output `TYPOGRAPHY_ROLES occurrence,bundles`] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:94-122] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:193-199] [SOURCE: .opencode/skills/sk-design/styles/099-supply/DESIGN.md:21-38]

5. **Absence and family variance should become first-class calibration dimensions and anomaly fixtures.** The corpus spans 876 light, 282 dark, and 132 mixed themes. Only 522 bundles have shadow tokens; 689 bundles correctly retain an Elevation section with zero shadows to explain flat depth, while ten have shadow tokens but omit Elevation. Surface-token presence and Surfaces-section presence both equal 1,266, whereas all 1,290 Quick Starts expose radius variables despite only 1,124 JSON bundles having a top-level radius category. These patterns support stratified baselines by theme and capability flags, plus explicit fixtures for flat systems, missing capabilities, and contract mismatches; they do not support homogenizing all families. Rough build cost: **2–3 engineer-days** for stratified summaries and a compact anomaly-fixture set. [SOURCE: command: deterministic corpus calibration; outputs `THEMES`, `CATEGORY_COUNTS`, `ABSENCE_CORRELATIONS`, and Quick Start prefix coverage] [SOURCE: command: narrow anomaly probe; outputs `preply core-order`, ten named `shadow-without-elevation` bundles, `aaply`/`aaron-poe-co` spacing absences, and six Imagery absences] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:284-300] [INFERENCE: estimate covers generated summaries and selected fixtures, not corpus rewriting]

## Ruled Out

- Requiring every corpus-common section: even high-frequency sections have meaningful capability-driven absences, and frequency is not quality.
- Enforcing one exact H2 sequence: 748 bundles contain extension sections and one bundle changes core relative order; exact-sequence validation would conflate extension diversity with failure.
- Setting fixed token counts from corpus medians: p10–p90 ranges are wide and category presence is conditional.
- Treating all observed typography labels as a closed enum: the long tail contains legitimate style-specific roles.

## Dead Ends

- Corpus-majority homogenization is definitively unsuitable for schema calibration; use a stable spine plus conditional capabilities and extension slots.
- Raw JSON typography keys (`base`, `5xl`, suffixed variants) cannot serve as semantic output roles.
- Quick Start field presence cannot be inferred solely from top-level token-category presence; radius is the concrete counterexample requiring provenance/capability validation.

## Edge Cases

- Ambiguous input: None; Q2 and its requested measurements were explicit.
- Contradictory evidence: The corpus has `--radius-*` in 1,290 Quick Starts but a top-level `radius` JSON category in only 1,124 bundles; one bundle also reverses Agent Prompt Guide/Layout order. These are preserved as contract-mismatch fixtures, not resolved by majority vote.
- Missing dependencies: Spec Kit Memory remained unavailable from initialization; canonical state, direct corpus files, and current target sources were sufficient.
- Partial success: One narrow Python probe failed on local f-string quoting, then succeeded with corrected formatting; no source or coverage remained missing, so status is `complete`.

## Sources Consulted

- Deterministic Python scans over `.opencode/skills/sk-design/styles/*/DESIGN.md` and `design-tokens.json` (1,290 complete pairs, zero JSON failures).
- `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:71-300`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/formatters-v3.ts:117-239`
- `.opencode/skills/sk-design/styles/099-supply/DESIGN.md:1-333`
- `.opencode/skills/sk-design/styles/099-supply/design-tokens.json:1-220`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/findings-registry.json:36-74`

## Assessment

- New information ratio: 1.00 (5 fully new, 0 partially new, 0 redundant).
- Questions addressed: Q2.
- Questions answered: Q2.
- Remaining questions: Q3, Q4, Q5.
- Confidence: High for corpus distributions and live-schema comparisons; medium for build costs, which are bounded engineering estimates rather than measured implementation durations.

## Reflection

- What worked and why: A complete deterministic scan separated structural invariants from optional capabilities, while a vertical sample and live-source comparison prevented aggregate counts from becoming context-free recommendations.
- What did not work and why: The first narrow anomaly command had a quoting bug; replacing the nested f-string expression with `%` formatting fixed the probe. A single global distribution also could not express design quality, so theme/capability strata were retained explicitly.
- What I would do differently: Predefine the anomaly report in the first scan so the narrow retry is unnecessary, and emit machine-readable per-family histograms for direct fixture generation in Q4.

## Recommended Next Focus

Investigate Q3: define a bounded study-pair selection and transformation protocol using the calibrated schema/capability metadata—especially theme, shadow/surface/radius capabilities, semantic typography roles, and extension slots—and specify anti-copy/provenance gates at the iteration-1 pre-WRITE insertion point.
