# Iteration 6: Study, Design DNA, Portability, And Exports

## Focus

Compare Hallmark `study`, `design-md.md`, `study.md`, `export-formats.md`, and worked examples against shipped `/interface:design-reference`, `design-md-generator`, the v3 `DESIGN.md` schema, extract-write-validate/report pipeline, and styles database ingestion. The shipped measured pipeline remains canonical; Hallmark is evaluated only for bounded schema, report, provenance, and export extensions.

## Actions Taken

1. Read lineage state, strategy, iteration 5, and its delta before source research.
2. Compared Hallmark's image/URL diagnosis fields and portable-file contract field by field with shipped `DesignTokens`, `ExtractionReport`, v3 schema sections, and validator policy.
3. Traced output naming and portability through `/interface:design-reference`, `schema-v3.ts`, the styles flat-bundle contract, and SQLite indexer artifact roles.
4. Classified screenshot diagnosis, design-DNA fields, provenance, report fields, export formats, and corpus ingestion as existing, absent/useful, weaker, or skip.

## Findings

### 1. Hallmark `study` is a diagnosis workflow; shipped MD-GENERATOR is a measured artifact workflow

Hallmark image mode estimates colour bands, proposes font candidates, and judges visual rhythm; URL mode shallow-fetches HTML/CSS and explicitly cannot judge rhythm. Shipped extraction instead runs Playwright across five viewports, captures computed CSS, interactions, accessibility, dark mode, frameworks, icons, motion, and page coverage, then validates `DESIGN.md` against `tokens.json`. Hallmark's claim that URL values are exact is therefore weaker: declared CSS is not proof of computed use, loaded state, responsive variation, interaction state, or cross-page stability. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:17-36] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md:45-73] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:337-410]

Verdict: preserve `/interface:design-reference` as URL-to-measured-artifact authority. INSPIRE-NEW an optional screenshot-assisted diagnosis report that labels every visual judgment `observed` or `inferred` and never writes estimated values into `tokens.json` or canonical v3 value sections.

### 2. Hallmark's structural-DNA vocabulary is useful, but its named catalogs must not become measured facts

The useful Hallmark fields are `macrostructure`, alternate structure, region roles, hero/pitch/nav/footer archetype, and variation knobs. Shipped v3 already has Components and Layout prose grounded in measured width, alignment, columns, spacing, and observed component states, but has no compact structural-summary object that preserves those relationships for reports or downstream prompts. Hallmark's values are selected from private named catalogs, while shipped extraction can only claim observed geometry and semantics. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:145-158] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:157-173] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:206-209]

Verdict: ADAPT the concept as measured-neutral report fields such as `pageComposition`, `regionRoles`, `columnRelationships`, `dominantHeroPattern`, and `navigationPattern`; do not import H/N/Ft ids, twenty-one macrostructure names, or knobs as canonical schema enums.

### 3. Type and colour DNA already exists in a stronger measured form

Hallmark records type roles/faces/pairing and paper/accent bands, values, hue, and footprint. Shipped tokens already carry exact font family, size, weight, line height, tracking, usage confidence and stability; colours carry exact normalized hex, usage roles, per-page coverage, source pages, confidence, and L1-L4 stability. v3 renders semantic type roles and named colour roles while excluding unstable content values. Hallmark's bands and footprint are lossy summaries, especially in screenshot mode. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:219-234] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:412-443] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:71-123] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md:77-90]

Verdict: SKIP Hallmark bands as token fields. LEARN from their compact diagnosis wording only: derive non-authoritative summaries from measured values for `extraction-report.json` or HTML report display.

### 4. Motion is measured but underrepresented in the v3 document schema

Hallmark's `reveal`, `motion_library`, and anti-pattern observations are narrow, source-level cues. Shipped `MotionSystem` is stronger on measured duration scales, timing functions, keyframes, and reduced-motion support, and interaction capture records transition and state diffs. However, v3 declares a `motion` capability detector without a corresponding Motion section or Quick Start group, so measured motion can disappear from `DESIGN.md` even though it exists in `tokens.json`. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:160-176] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:258-266] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:201-218] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:134-149] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:151-218]

Verdict: ADAPT a conditional `## Motion` extension in `schema-v3.ts`, backed only by measured `motionSystem` and captured transitions. Add formatter/prompt/validator coverage and tests; do not infer a motion library from filenames or copy Hallmark's reveal taxonomy as an enum.

### 5. Content, shape, and texture need different treatment

Hallmark's portable file adds CTA voice and Notes; its diagnosis records treatments such as grain, riso, and glass. Shipped v3 already covers component role/label examples, Do's and Don'ts, imagery, layout, radii, surfaces, elevation, and Agent Prompt Guide. Shape is therefore substantially present through measured radii, borders, shadows, component geometry, and layout. Texture is only free-form under Imagery/Layout and is not a typed measured capability. Content voice is useful only when source text provides enough evidence; it must not become invented brand strategy. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:89-101] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:479-488] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:124-173] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:175-233]

Verdict: keep shape in existing sections. Add optional report-only `textureTreatments` with evidence selectors/screenshots and optional `contentVoiceObservations` with source quotes/counts; promote neither to required v3 sections until extractors and fixtures prove stable evidence.

### 6. Anti-pattern carry-over is useful only as evidence-backed diagnostics

Hallmark stores anti-pattern names in the schema and writes them into `## Notes`, but the examples sometimes prescribe replacements from Hallmark's own canon rather than report source facts. Shipped v3 already has grounded Do's and Don'ts and an absolute rule against asserting systems contradicted by data. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/docs/study-examples.md:37-40] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:487-488] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:27-44] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:175-179]

Verdict: ADAPT `observedRisks[]` into `extraction-report.json`, with rule id, evidence location, confidence, and `measured|inferred` origin. Render only validated observations into Do's and Don'ts; skip Hallmark's universal timing, font-size, contrast-replacement, and catalog prescriptions.

### 7. Provenance is enforced, but the user-visible provenance model is too thin

Shipped tokens store source URLs and extraction date; validation hard-fails missing token provenance and fabrication; the command asks for route/state/viewport/theme provenance. Yet `ExtractionReport` contains no source rights, capture-mode, per-field origin, attestation, viewport list, theme/state coverage, or prompt-injection status, and v3 has no explicit Provenance section. Hallmark's source mode, source classification, remote-safety record, attestation, and confidence note are useful concepts, but its image-mode assumption that the user owns an attached screenshot is not rights evidence. [SOURCE: .opencode/commands/interface/design-reference.md:29-35] [SOURCE: .opencode/commands/interface/design-reference.md:48-53] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:337-345] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:482-496] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:250-273] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:447-477]

Verdict: ADAPT a report-level provenance envelope with `captureMode`, submitted/final URLs, capture timestamp, routes, viewports, themes, states, failed pages, tool version, measured/inferred/absent counts, source-rights status (`known|attested|unknown|restricted`), and safety events. Add a compact `## Provenance` section to v3 only as a deterministic projection; never use attestation to upgrade measurement confidence.

### 8. `DESIGN.md` uppercase must remain canonical

Hallmark matches project case and accepts `design.md` or `DESIGN.md`. Shipped command, skill, schema examples, flat style bundles, legacy manifest, and persistent indexer all use exact uppercase `DESIGN.md`; the SQLite indexer rejects unsupported artifacts and requires a canonical JSON plus uppercase design artifact. Case-flexible emission would split identity on case-sensitive systems and break ingestion. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:47-50] [SOURCE: .opencode/commands/interface/design-reference.md:1-3] [SOURCE: .opencode/skills/sk-design/styles/README.md:5-14] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:86-92] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:264-267]

Verdict: SKIP case matching and keep `DESIGN.md` canonical. If a consumer needs lowercase, generate an explicit non-canonical copy outside corpus ingestion rather than teaching every reader two identities.

### 9. Hallmark's extra export targets are useful, but its delivery and naming are unsafe for this pipeline

Shipped v3 deterministically emits CSS Custom Properties and Tailwind v4 from measured tokens. Hallmark additionally offers DTCG JSON and shadcn variables, but embeds all formats into `design.md`, uses `tokens.json` for DTCG, fixes or transforms values for portability, and includes a hard-coded destructive colour. In shipped MD-GENERATOR, `tokens.json` is the rich extraction authority; reusing that name for a lossy DTCG projection would overwrite or confuse provenance. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:220-248] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/export-formats.md:1-10] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/export-formats.md:214-270] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/export-formats.md:274-316]

Verdict: INSPIRE-NEW optional deterministic post-validate exporters named `design-tokens.dtcg.json` and `shadcn-theme.css`. They must preserve trace links to source token ids, omit unmappable values with diagnostics, never invent destructive/status tokens, and remain separate artifacts rather than bloating `DESIGN.md`.

### 10. Styles DB ingestion must stay curated and explicit

The styles corpus requires a six-role flat bundle, provenance/rights data, canonical JSON, exact artifact hashes, and fail-closed generation publication. MD-GENERATOR emits `tokens.json`, `DESIGN.md`, screenshots, and `extraction-report.json`, not the corpus's canonical JSON, `source.md`, CSS/Tailwind filenames, license status, or stable style UUID. Automatic ingestion would collapse target extraction into reference-corpus publication without review or rights classification. [SOURCE: .opencode/skills/sk-design/styles/README.md:5-14] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:3-23] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:305-344] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:388-396]

Verdict: SKIP automatic ingestion. If promotion becomes a real operator job, add an explicit reviewed adapter that maps validated extraction outputs into the existing six artifacts, requires stable UUID/source/license/rights evidence, and then runs the unchanged indexer transaction. Do not make the indexer accept arbitrary extraction output folders.

## Field-Level Matrix

| Hallmark field / concern | Shipped location | Status | Decision and exact change |
|---|---|---|---|
| `source_mode`, `source_url` | `DesignTokens.meta.sourceUrls`, extraction date; command source contract | Exists, stronger for URLs | Keep measured URL crawl. Extend `types.ts` report provenance with capture mode and submitted/final URL; do not add screenshot values to tokens. |
| `source`, `refusal`, attestation | Command source/allowed-origin preconditions; styles provenance/rights | Partial | Add report-level rights status and attestation evidence; keep eligibility separate from measurement confidence. |
| `remote_safety` | Command allowed-origin policy; crawler safety exists outside v3 fields | Partial | Record safety decisions/events in extraction report, not `DESIGN.md` prose except a compact status. |
| `macrostructure`, alternate | v3 Layout prose; `layoutPatterns` | Useful field absent | Add neutral `pageComposition` report object derived from DOM/geometry; no Hallmark catalog enum. |
| hero/pitch/nav/footer archetypes and knobs | Components, Layout, structural regions, component variants | Partial, measured primitives stronger | Add report `regionRoles[]` and relationships; skip H/N/Ft catalog ids and fixed knobs. |
| display/body/label roles and exact faces | typography levels, font info, semantic roles | Already stronger | No token change. Optionally add deterministic pairing summary to report. |
| pairing logic | Multiple measured families and roles | Implicit | Add report summary only when role assignment is evidence-backed. |
| paper/accent bands, hue, footprint | colour tokens, usedAs, pagesCoverage, sourcePages, confidence, stability | Already stronger | Derive compact display labels; never store lossy bands as authority. |
| density | spacing, section spacing, layout; v3 density prose | Exists, partly inferred | Preserve measured values and label the compact density verdict inferred. |
| asymmetry | alignment, columns, element rectangles; Layout prose | Partial | Add measured geometry summary plus inferred verdict with confidence. |
| `treatments` / texture | gradients, imagery, pseudo-elements, background images; free-form Imagery | Useful field absent | Add optional report `textureTreatments[]` only with selector/value/screenshot evidence; defer v3 section. |
| `reveal`, motion library | motion system, transitions, animations, framework detection | Measured fields stronger; v3 projection weak | Add conditional v3 Motion section and validation; skip guessed library/reveal enum. |
| `anti_patterns` | Do's and Don'ts, validation failures, anti-pattern reference | Useful report field absent | Add evidence-backed `observedRisks[]`; render only validated rows. |
| CTA voice / content voice | Components, examples, Agent Prompt Guide | Partial | Optional report observations from actual copy; no inferred brand strategy or required v3 field. |
| motion stance | `MotionSystem`, reduced-motion and interaction capture | Exists but under-rendered | Conditional Motion section sourced verbatim from tokens. |
| shape | radii, shadows, surfaces, components, spacing/shapes | Already stronger | No new Hallmark-shaped field. |
| Provenance block | token meta, validation hard failures, command evidence ledger | Semantics exist; visible section absent | Deterministically render a compact v3 Provenance section from report/token envelope. |
| per-field confidence | colour/type/stability confidence; prose `[INFERRED]` rule | Partial and uneven | Add origin/confidence to report observations; do not decorate every measured scalar redundantly. |
| `design.md` portability | v3 `DESIGN.md` plus measured `tokens.json` | Exists, materially stronger | Keep uppercase `DESIGN.md`; do not turn measured extraction into a 45-line authored lock file. |
| CSS + Tailwind exports | v3 Quick Start targets | Exists | Preserve deterministic v3 emitters. |
| DTCG + shadcn exports | None | Useful field/output absent | Optional separate post-validate files with traceability and omission diagnostics. |
| styles DB ingestion | Curated six-artifact bundles, manifest/indexer, provenance rights | Exists for corpus; no extraction adapter | Keep explicit reviewed promotion; never auto-ingest extraction output. |

## Candidate Matrix

| Candidate | Exact files | Verdict | HOW they would change | Value | Effort | Licensing distinction |
|---|---|---|---|---|---|---|
| Provenance/coverage envelope | `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts`; `extract.ts`; `report-gen.ts`; `preview-gen.ts`; `.opencode/commands/interface/design-reference.md` | ADAPT | Extend `ExtractionReport` with capture, coverage, origin/confidence summary, rights status, and safety events; populate from existing crawl/config evidence and display in reports/evidence ledger. | High | Medium | Independently define field names and semantics; copying Hallmark schema/prose substantially requires MIT notice. |
| Conditional v3 Provenance section | `backend/scripts/schema-v3.ts`; `formatters-v3.ts`; `build-write-prompt.ts`; `validate.ts`; format docs/tests | ADAPT | Add a deterministic section backed by token/report metadata; hard-fail missing source/capture identity, label rights unknown rather than infer. | High | Medium | Idea-level adaptation, independently implemented. |
| Conditional v3 Motion section | `backend/scripts/schema-v3.ts`; `build-write-prompt.ts`; `validate.ts`; `references/design-md-format.md`; tests | ADAPT | Bind the existing motion capability to a conditional section that projects measured durations, easing, keyframes, transitions, and reduced-motion support. | High | Medium | No Hallmark taxonomy or recipe copying. |
| Structural diagnosis report | `backend/scripts/types.ts`; `dom-collector.ts`; `cluster.ts` or a new bounded extractor; `report-gen.ts`; tests | INSPIRE-NEW | Produce neutral region/composition/relationship fields from DOM and geometry; inferred labels carry evidence and confidence. | Medium-high | High | Do not copy Hallmark macrostructure/archetype catalogs; native measured vocabulary avoids notice. |
| Texture and observed-risk report fields | `backend/scripts/types.ts`; `dom-collector.ts`; `css-analyzer.ts`; `report-gen.ts`; tests | ADAPT | Capture selector-backed texture treatments and detector-backed risks; keep optional until fixture precision is proven. | Medium | Medium-high | Rewrite concepts; copied anti-pattern lists or treatment prose require MIT notice. |
| Screenshot-assisted diagnosis | `procedures/design-system-extraction.md`; `references/extraction-workflow.md`; optional report module/tests | LEARN | Use screenshot only to supplement gestalt/rhythm after URL extraction; mark observations inferred and prohibit writes to measured token fields. | Medium | High | Protocol inspiration only; no Hallmark diagnosis template copying. |
| DTCG and shadcn exporters | New `backend/scripts/export.ts` or narrowly named exporter modules; `types.ts`; `guided-run.ts`; output-policy/docs/tests | INSPIRE-NEW | Run only after validation; emit `design-tokens.dtcg.json` and `shadcn-theme.css`, trace source ids, omit unsupported roles, never invent tokens. | Medium-high | Medium | Standards/format implementation should be authored independently; do not copy Hallmark tables/examples. |
| Reviewed corpus-promotion adapter | New explicit operator under `styles/_harness/`; existing `_engine/manifest.mjs`, `_db/indexer.mjs`, schema tests remain gates | LEARN / DEFER | Map only operator-approved validated outputs into the existing six-artifact bundle, requiring UUID, source, capture date, license and rights evidence before build. | Medium | High | Hallmark license is irrelevant unless Hallmark expression is included; source-site rights remain separately required. |

## Licensing Boundary

Hallmark's MIT license permits use, copying, modification, distribution, sublicensing, and sale only when its copyright and permission notice accompany copies or substantial portions. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:5-13] This iteration recommends independently authored field concepts and pipeline changes, which do not copy Hallmark expression. Copying its structured schema verbatim, diagnosis templates, archetype catalogs, export tables/examples, or substantial protocol prose would require the Hallmark MIT notice. Hallmark's MIT license does not grant rights in third-party websites, screenshots, fonts, photography, template designs, or trademarks; source attestation and corpus reuse rights remain separate checks.

## Ruled Out

- Replacing measured Playwright/computed-CSS extraction with screenshot vision or shallow WebFetch diagnosis.
- Writing image-estimated colours, font candidates, rhythm, or structure into canonical `tokens.json` value fields.
- Importing Hallmark's macrostructure, archetype, theme, reveal, treatment, or anti-pattern catalogs as v3 enums or presets.
- Emitting lowercase `design.md` as an interchangeable canonical artifact.
- Reusing `tokens.json` for a DTCG projection or embedding all export formats inside `DESIGN.md`.
- Inventing shadcn destructive/status tokens when the source has no measured equivalent.
- Automatic ingestion of MD-GENERATOR output into the styles corpus.
- Treating an attached screenshot, public URL, or user attestation as proof of copyright or exact-reuse rights.

## Dead Ends

- Recursive Hallmark globs again returned no files despite known paths; exact paths recovered from prior inventory were readable.
- Name-parity comparison (`macrostructure`, `archetype`, `theme`) overstated gaps. Field-level evidence showed that most underlying colour, type, shape, layout, motion, and component facts already exist under measured native structures.
- Embedding every portable format in `DESIGN.md` looked convenient but conflicts with the validator's compact deterministic targets, creates naming collision with extraction `tokens.json`, and would force the styles corpus to accept unsupported artifacts.

## Questions Answered

- Hallmark's useful net-new contribution is compact diagnosis and provenance vocabulary, not value extraction; shipped measurement remains canonical.
- Structural summary, visible provenance, measured Motion projection, texture/risk observations, and optional DTCG/shadcn exports are bounded extension candidates.
- Type, colour, shape, layout, components, accessibility, interaction states, confidence/stability, and CSS/Tailwind exports already exist in stronger measured forms.
- Uppercase `DESIGN.md` and curated six-artifact styles ingestion must remain canonical.

## Sources Consulted

- Hallmark study behavior, schemas, portable format, exports, examples, README/skill routing, and license. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/study.md:1-509] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/design-md.md:1-116] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/export-formats.md:1-329] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/docs/study-examples.md:1-176] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:490-552] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:20-24] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:1-21]
- Shipped command, mode, schema, extraction, token/report types, and pipeline docs. [SOURCE: .opencode/commands/interface/design-reference.md:1-80] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:234-315] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design-md-format.md:1-300] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md:1-100] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:1-629] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:1-496] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/README.md:15-199]
- Styles corpus and persistent ingestion. [SOURCE: .opencode/skills/sk-design/styles/README.md:1-21] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:1-100] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:86-92] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:305-396] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-510] [SOURCE: .opencode/skills/sk-design/styles/mesh/source.md:1-12]

## Assessment

- Status: complete for iteration 6's bounded focus.
- findingsCount: 10 comparative findings and 7 implementation candidates.
- newInfoRatio: 0.84.
- Novelty justification: Seven findings establish new field-level gaps, extension boundaries, or ingestion/export decisions; three refine known pipeline superiority into exact schema/report changes; `(7 + 3 x 0.5) / 10 = 0.85`, reduced to `0.84` because output-case authority was partially established in iteration 1.
- Confidence: high for field presence, pipeline authority, output casing, and styles-ingestion boundaries; medium for structural/texture extractor feasibility because no implementation or fixture experiment was run.
- Convergence: continue. The max-iterations policy requires ten runs; this iteration resolves the design-DNA/schema family but does not authorize synthesis.

## Reflection

Hallmark's strongest lesson is the usefulness of a compact human diagnosis before reuse. Its weakest assumption is that shallow URL declarations or screenshot estimates can safely become a portable system. The correct integration is to derive diagnosis from shipped measurement, preserve origin/confidence in reports, project only supported fields into v3, and keep exports and corpus promotion explicit.

## Recommended Next Focus

Compare Hallmark's curated themes and genre selection against the styles corpus retrieval/facet model and relational-exemplar authority, determining whether any non-preset theme metadata improves query or critique without weakening target-first evidence.
