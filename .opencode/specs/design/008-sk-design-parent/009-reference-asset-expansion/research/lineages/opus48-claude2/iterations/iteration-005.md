# Iteration 5: design-md-generator expansion matrix

## Focus
Test whether `design-md-generator` is mature enough that expansion is mostly do-NOT-add, and resolve whether gap-10 forward-authoring (stitch) belongs here or is out of scope.

## Findings

### F5.1 — md-generator is the most mature mode by a wide margin [confirmed]
It ships 8 references (`design_md_format`, `component_taxonomy`, `color_role_taxonomy`, `extraction_workflow`, `writing_style_guide`, `quality_checklist`, `anti_patterns`, `troubleshooting`), 4 worked examples with DESIGN.md + writing-notes, 2 assets (`cardinal_rules_card`, `design_md_prompt_template`), a 7-entry `feature_catalog/`, and an embedded Playwright `backend/` (extract→write→validate) [filesystem]. No thin or stale reference surfaced. Its identity is tightly scoped: "the extraction and format-fidelity engine... It captures what already exists" [SOURCE: design-md-generator/SKILL.md:14].

### F5.2 — gap-10 forward-authoring is a DIFFERENT input contract → out of scope for 009 [confirmed; key do-NOT]
`stitch-skill` is **forward authoring**: it *generates* a `DESIGN.md` from taste directives with no live site ("translates anti-slop directives into Stitch's semantic design language") [SOURCE: external/stitch-skill.md:7-21]. md-generator's contract is the inverse: live URL → measured CSS → DESIGN.md, and it explicitly says "Skip this skill when the task is inventing a new design direction... This skill captures; that skill creates" [SOURCE: design-md-generator/SKILL.md:44-45]. The two share only the DESIGN.md *format*. 001-corpus-research routes forward-authoring to a **new `design-spec` child** [SOURCE: 001-corpus-research/research/research.md:102-106], and gap-analysis confirms gap-10 → "new `design-spec`" [SOURCE: gap-analysis.md:21]. Folding authoring into md-generator would change its identity from extractor to extractor+author — an architecture/taxonomy decision, explicitly **out of scope** for 009 (net-new sub-skills + taxonomy excluded). Therefore: do-NOT-add here; defer to the design-spec child decision.

### F5.3 — The only in-scope gap is worked-example aesthetic diversity [confirmed, nice]
The 4 worked examples (vercel, linear, supabase, stripe) are all dev-tool/SaaS minimalist aesthetics [filesystem]. Extractions of editorial, e-commerce, or bold/maximalist brand sites have no gold-standard reference to study. A 5th worked example in a distinct aesthetic family would broaden format coverage. This is the single genuinely in-scope, low-risk addition — and it is only nice-to-have.

## Prioritized Additions (design-md-generator)

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|----|------|-------|--------------------------|----------------|--------|
| MD-A1 | asset (worked example) | `references/examples/<distinct-aesthetic>/` — a 5th DESIGN.md exemplar in a non-SaaS aesthetic (editorial / e-commerce / maximalist) | All 4 current exemplars are SaaS-minimalist; a distinct aesthetic broadens format coverage for extractions of non-SaaS sites. Only nice-to-have. | the v3 format itself + a fresh extraction run | S–M |

## Do-NOT-add (design-md-generator) — the dominant verdict for this mode
- **Forward DESIGN.md / PRODUCT.md authoring (stitch, gap 10)** — different input contract (taste directive → DESIGN.md, no live site); routes to a net-new `design-spec` child per 001 research; net-new sub-skill + identity change = **out of scope for 009**. [if-effective bar: out of scope by charter]
- **New extraction-pipeline references** — the backend (extract/write/validate, 5-viewport crawl, verbatim tokens.json) and its 8 references + feature_catalog are comprehensive; no gap found.
- **Duplicate format/taxonomy references** — `design_md_format`, `component_taxonomy`, `color_role_taxonomy`, `writing_style_guide`, `quality_checklist` already cover the format and authoring rules.
- **A second prompt/cardinal asset** — `cardinal_rules_card` + `design_md_prompt_template` already exist; no second asset is justified.

## Sources Consulted
- `.opencode/skills/sk-design/design-md-generator/SKILL.md` (lines 1–75) + filesystem inventory (references/examples/, assets/, feature_catalog/, backend/)
- `external/stitch-skill.md` (lines 1–30)
- `001-corpus-research/research/research.md` §4 child-5; `gap-analysis.md` row 10

## Assessment
- **newInfoRatio: 0.35** — Low novelty by design: this is a confirming/negative-knowledge iteration. It anchors the do-NOT side of the matrix and validates the if-effective bar (one nice-to-have, the rest correctly out of scope). Important conceptually even at low ratio.
- **Novelty justification:** Establishes md-generator as the explicit "expansion is not effective here" mode and cleanly resolves the gap-10 boundary (forward-authoring is design-spec's surface, not an md-generator expansion).
- **Confidence:** High — the SKILL boundary statement and the stitch contract are explicit and mutually exclusive.

## Reflection
- **Worked:** Reading md-generator's WHEN-NOT-to-use and the stitch overview side by side made the boundary unambiguous.
- **Ruled out:** folding stitch forward-authoring into md-generator (different contract; design-spec's surface; out of scope).
- **Failed:** nothing; the low ratio is the expected, correct result for a mature mode.

## Recommended Next Focus
Iteration 6: cross-cutting synthesis — the `shared/register.md` must-add prerequisite (05) that gates interface+audit additions, the zero-assets pattern across 4 modes, the shared twin artifacts (N1 mock-content, N2 layout gate), and a convergence check before synthesis.
