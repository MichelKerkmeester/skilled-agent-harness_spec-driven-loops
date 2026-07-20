# Iteration 3: Study, portable design schema, and styles retrieval

## Focus

Compared Hallmark's study diagnosis, structured DNA fields, portable design.md, and exports with /interface:design-reference, design-md-generator v3, canonical style bundles, source attestation, and generation-bound styles retrieval. Brand-first authoring remains separate because the generator requires measurable evidence.

## Findings

1. **Hallmark study is a useful compact diagnosis layer, not a replacement extractor.** Its image/URL modes run surface, type, structure, motion, and rhythm passes, then separate diagnosis, build, and portable-file emission. sk-design already crawls rendered pages at five viewports, captures computed styles and interaction states, and runs accessibility, dark-mode, framework, icon, motion, and boundary detectors. ADAPT a concise measured DNA preview into /interface:design-reference confirm presentation; do not add another public verb or backend. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:11] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:106] [SOURCE: .opencode/skills/sk-design/design-md-generator/feature-catalog/extract/extract.md:20] [SOURCE: .opencode/skills/sk-design/design-md-generator/feature-catalog/extract/extract.md:51]

2. **The strongest reusable schema addition is optional composition DNA.** Hallmark explicitly records macrostructure, alternate structure, hero/pitch/nav/footer archetypes, knobs, density, asymmetry, and treatments. v3 has rich Layout and Components prose but no compact queryable tuple. Add optional compositionDNA to backend/scripts/schema-v3.ts and types.ts with macrostructure, regions, variationKnobs, density, asymmetry, treatments, and evidence labels; render it through existing Layout/Components rather than importing Hallmark's archetype codes. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:210] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:218] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:157] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:206]

3. **Role versus observation should be explicit; screenshot estimates must stay outside measured extraction.** Hallmark separates type roles from faces and color bands from exact values. URL mode fills exact fields; image mode uses nulls or labeled estimates. sk-design requires every rendered value verbatim from tokens.json and forbids filling absent data. Add originClass = measured | inferred and sourceMode to field evidence where missing; reserve estimated bands for a future authored lane. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:219] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:241] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:27] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:43]

4. **Attestation belongs in provenance and eligibility, not portable style prose.** Hallmark separates diagnosis permission from portable emission and records source, date, attestation, and confidence. sk-design's style_provenance is stronger: source/original/screenshot URLs, capture time, license status, rights-known, and evidence scope; exact reuse requires known provenance and allowed rights. Add extractionAuthorization = user-owned | permitted-public-reference | analysis-only at intake and map it to provenance/evidence scope and reuse eligibility. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:447] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:471] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:97] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:153]

5. **v3 omits motion despite already measuring it.** Hallmark's portable file has Motion stance plus easing/duration tokens; study records reveal and motion_library. sk-design extracts transition/animation durations, easing, and choreography, but DESIGN.md and Quick Start omit a motion section. Add conditional Motion to design-md-format.md and the formatter, with observed libraries, primitives, durations, easings, choreography, and reduced-motion evidence; emit Quick Start motion tokens only when measured. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:82] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:93] [SOURCE: .opencode/skills/sk-design/design-md-generator/feature-catalog/extract/extract.md:55] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:235]

6. **Hallmark's compact axes complement full style bundles.** paper band/hue, accent hue/footprint, type roles/pairing, density, asymmetry, treatments, reveal, and macrostructure form a useful query vocabulary. The database already indexes facets, capabilities, token axes, sections, FTS, and vectors. Derive low-cardinality facets during indexing—paper-band, accent-hue, accent-footprint, density, asymmetry, treatment, motion-stance, macrostructure-family—from canonical measured data. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:225] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:237] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:125] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:172]

7. **Portable token/export coverage mostly exists; inline bundling is a regression.** Hallmark emits tokens.css, Tailwind v4, DTCG JSON, and shadcn variables inline on managed projects. A sk-design bundle already has DESIGN.md, css-variables.css, tailwind-v4.css, design-tokens.json, canonical JSON, and source.md. SKIP duplicates inside DESIGN.md. INSPIRE-NEW only an opt-in shadcn sibling adapter when framework detection confirms need. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/export-formats.md:3] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/export-formats.md:320] [SOURCE: .opencode/skills/sk-design/styles/099-supply/source.md:12]

8. **Measured extraction and brand-first authoring must remain separate contracts.** Hallmark can emit the same compact file after either a user-approved build or a study. sk-design routes briefs without measurable sources to interface aesthetic direction, preventing authored values from masquerading as extraction. LEARN from Hallmark's opt-in lock moment, but implement future authoring through design-interface plus design-foundations with originClass = authored; never register it as measured corpus evidence. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:19] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:114] [SOURCE: .opencode/skills/sk-design/design-md-generator/procedures/design-system-extraction.md:35] [SOURCE: .opencode/skills/sk-design/design-md-generator/procedures/design-system-extraction.md:41]

### Field-by-field schema comparison

| Hallmark field | sk-design target | Relationship | Concrete recommendation |
|---|---|---|---|
| source_mode, source_url | canonical source/meta; source.md; provenance DB | overlap | Keep canonical provenance; expose sourceMode in field evidence only. |
| source, refusal | rights/license/evidence scope | partial | Add extractionAuthorization; public URL never implies reuse rights. |
| remote_safety | fetch/runtime safety | deliberate omission | Keep execution telemetry out of portable DESIGN.md. |
| macrostructure, alternate | Layout | partial gap | Add optional compositionDNA.macrostructure with evidence. |
| hero/pitch/nav/footer + knobs | Components + Layout | partial gap | Add generic regions/variationKnobs, not Hallmark H/N/Ft identifiers. |
| display/body/label roles | Typography + Type Scale | overlap | Preserve v3 semantic roles. |
| exact faces | measured typography | stronger overlap | Keep exact faces with origin evidence. |
| pairing_logic | typography prose | minor gap | Add a derived pairing-family-count retrieval facet. |
| paper band/value/hue | Colors + Surfaces | overlap | Derive band/hue facets; verbatim values remain truth. |
| accent band/value/footprint | color role/usage | partial gap | Add derived footprint facet, not universal percentage rules. |
| density | Spacing & Shapes | overlap | Index existing classification. |
| asymmetry | Layout | partial gap | Add measured layout-asymmetry facet. |
| treatments | Imagery/Elevation/custom sections | distributed | Index observed treatments as capabilities. |
| reveal, motion_library | extractor; absent handoff | real gap | Add conditional Motion section and retrieval facets. |
| anti_patterns | Do's and Don'ts | overlap | Keep evidence-grounded v3 wording. |
| System genre/theme/axes | header, intro, Layout | overlap | Optional compositionDNA carries compact axes. |
| color/font/spacing/radius tokens | canonical + exports | stronger overlap | No replacement. |
| easing/duration tokens | extracted, omitted from Quick Start | gap | Render measured motion tokens conditionally. |
| CTA voice | Components | overlap | Keep exact component/state contract. |
| Provenance | source.md, canonical, DB | stronger overlap | Sidecar/structured truth; optional compact DESIGN source line. |
| Notes | Do's and Don'ts | overlap | Keep existing evidence rules. |
| Exports | sibling artifacts | stronger | Separate outputs; optional shadcn adapter. |
| Variants | no confirmed portable equivalent | deferred | Revisit in roadmap/variant pass. |

### Focused reuse matrix

| Hallmark asset | sk-design target | Verdict | Concrete change | Value | Effort |
|---|---|---|---|---|---|
| study diagnosis | /interface:design-reference confirm presentation | ADAPT | Add concise measured DNA preview before write approval. | High | Medium |
| structured study schema | schema-v3/types/indexer | ADAPT | Add compositionDNA and derived facets with evidence. | High | Medium-high |
| image/URL confidence split | authoring boundary/extraction procedure | LEARN | Add originClass/sourceMode; exclude image estimates from measured output. | High | Low-medium |
| emission attestation | design-reference intake + provenance DB | ADAPT | Capture extractionAuthorization and reuse eligibility. | High | Medium |
| compact design.md | design-md-format.md | SKIP | Keep richer v3 Style Reference and validator. | High avoided regression | None |
| Motion stance | format + formatter | ADAPT | Add measured conditional Motion and Quick Start tokens. | Very high | Medium |
| token taxonomy | canonical schema | LEARN | Retain richer taxonomy; review role/value separation. | Medium | Low |
| CSS/Tailwind/DTCG inline exports | existing sibling formatters | SKIP | Existing artifacts cover them. | Medium avoided bloat | None |
| shadcn variables | optional formatter/output policy | INSPIRE-NEW | Add detected, opt-in sibling adapter with tests. | Medium | Medium |
| opt-in lock after build | interface + foundations handoff | INSPIRE-NEW | Define authored-system export lane distinct from extraction. | Medium-high | High |

## Ruled Out

- Replacing v3 DESIGN.md with Hallmark's compact file.
- Adding a public study command when design-reference owns extraction.
- Treating screenshot guesses as measured tokens.
- Persisting remote-fetch safety mechanics in DESIGN.md.
- Embedding four export formats inline.

## Dead Ends

- Hallmark archetype identifiers are cookbook-specific; transfer the region-plus-knobs idea, not the codes.
- Hallmark's assumption that an attached screenshot is safe for portable emission is weaker than sk-design's rights-known reuse gate.

## Edge Cases

- Ambiguous input: DESIGN.md contract could mean human handoff, canonical JSON, or database row; all three were compared at their owning layer.
- Contradictory evidence: Hallmark calls shallow URL/CSS values exact, but that can miss runtime/computed styles; sk-design's rendered multi-viewport extractor is more authoritative.
- Missing dependencies: none.
- Partial success: schema-v3 was sampled through declarations and one canonical bundle rather than exhaustively enumerated; insertion points are supported by format, extractor, database, and bundle evidence.

## Sources Consulted

- [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:191]
- [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:433]
- [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:47]
- [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/export-formats.md:14]
- [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:27]
- [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:124]
- [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:200]
- [SOURCE: .opencode/skills/sk-design/design-md-generator/procedures/design-system-extraction.md:17]
- [SOURCE: .opencode/skills/sk-design/design-md-generator/feature-catalog/extract/extract.md:20]
- [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:97]
- [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:121]
- [SOURCE: .opencode/skills/sk-design/styles/099-supply/source.md:1]

## Assessment

- New information ratio: 0.93
- Novelty justification: Six of seven substantive schema conclusions were new and one refined prior routing.
- Questions addressed: extraction fields, attestation, motion/export gaps, retrieval, measured versus authored lanes.
- Questions answered: Which design.md extraction fields improve the existing MD-generator, styles pipeline, foundations, and motion modes?
- Confidence: high on contracts/ownership; medium on final compositionDNA shape pending exhaustive schema review.

## Reflection

- What worked and why: Comparing human format, extraction, provenance database, retrieval, and a real bundle prevented document/schema conflation.
- What did not work and why: Broad corpus grep produced generated-content noise; focused schema and representative artifacts were better.
- What I would do differently: Start with type declarations plus one bundle, then validate additions against formatters/tests.

## Recommended Next Focus

Compare Hallmark motion.md, microinteractions.md, interaction-and-states.md, and theme motion tokens against design-motion, the motion extractor, and the v3 handoff omission. Define the exact conditional Motion schema and distinguish existing-mode improvements from retrieval facets.
