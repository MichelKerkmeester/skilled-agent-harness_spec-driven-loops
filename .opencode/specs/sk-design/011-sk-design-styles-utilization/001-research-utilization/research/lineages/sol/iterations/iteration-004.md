# Iteration 4: Per-Mode Consumption and Coherent-Reference Contract

## Focus

Define and validate the hub-plus-five-mode consumption contract, with deterministic rules for choosing one coherent real style versus bounded synthesis. The selected interpretation is operational rather than implementation-specific: specify candidate and hydration caps, artifact slices, authority boundaries, coherence locks, provenance behavior, and refusal cases. The iteration reuses iteration 3's pinned context-cost measurements, then tests the contract against the directly inspected Kobu and 19–86 styles without averaging token values.

## Actions Taken

1. Re-read the lineage state, reducer strategy, registry, dispatch prompt, and iteration 3 evidence before selecting the strategy's `NEXT FOCUS`.
2. Extracted the hub and all five mode authority/resource boundaries from their current skill contracts.
3. Compared Kobu and 19–86 as two real, materially different style systems, including provenance and identity-bearing sections.
4. Scanned both references for temporal evidence and measured full-reference and section-slice bytes to validate the proposed hydration caps.

## Per-Mode Consumption Contract

All modes receive compact candidate cards before hydration. A card contains style id/title/north-star, source URL and capture timestamp, license-known state, content generation/hash, eligible modes/token axes, available section flags, and artifact byte costs. The five-card default is supported by iteration 3's measured 1,357–1,582-byte top-5 payloads; hydration is mode-specific rather than universal. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:28-45]

| Consumer | Candidate cards | Default one-reference hydration | Bounded synthesis cap and allowed slices | Must never treat as authority |
|---|---:|---|---|---|
| **hub** | 5 | 0 hydrated references; it routes the cards to the selected mode | None; the hub does not synthesize | Corpus rank for mode selection, per-mode judgment, or ready/proof claims; the mode registry and mode contracts retain those roles. [SOURCE: .opencode/skills/sk-design/SKILL.md:140-153] [SOURCE: .opencode/skills/sk-design/SKILL.md:172-184] |
| **interface** | 5 | 1 complete `DESIGN.md` + its `source.md` as the coherent direction to critique and deliberately deviate from | Maximum 2 source styles: one complete anchor plus at most one motion-bearing section from another style when the anchor lacks temporal evidence; no cross-style static-identity synthesis | User-owned design system, pinned brief values, or a copyable preset. Real references are one-at-a-time grounding and are never copied. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:71-90] |
| **foundations** | 5 | 1 bundle's requested `design-tokens.json` paths plus matching `DESIGN.md` rationale sections and `source.md` | Maximum 3 source styles, one exclusive owner for each requested axis among color/surface semantics, typography roles, and spacing/layout rhythm; hydrate only those slices | Exact values to average, automatically reusable fonts/colors, measured extraction truth, or accessibility proof. User pins and downstream contrast checks remain authoritative. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:55-103] |
| **motion** | 5 cards already filtered for a motion-bearing section | 0–1 motion section/snippet + `source.md`; hydrate zero when no temporal evidence exists | Maximum 1 corpus source for timing/material/interaction behavior; a separately selected static anchor may constrain tone but contributes no motion authority | Static aesthetic similarity, incidental words such as “transition,” or reduced-motion/performance proof. The motion restraint and accessibility references remain authoritative. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:51-66] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:97-113] |
| **audit** | 5 | 0–1 intended-reference `Do/Don't`, relevant token/surface section, and `source.md` | Maximum 2 comparison references: the declared intended anchor and one contrast/hard-negative; comparisons do not synthesize a new style | The target UI's observed evidence, WCAG/measurement evidence, severity, or a fix owner. Corpus references only sharpen a finding. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:23-50] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:95-115] |
| **md-generator** | 0 for EXTRACT/WRITE/VALIDATE/REPORT; up to 3 for STUDY | 0 in measured pipeline phases; exactly 1 `DESIGN.md` + `source.md` study pair in STUDY | No multi-style synthesis | Live measured CSS, emitted `tokens.json`, provenance, or validation truth. Study examples teach format only and are never copied. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:10-15] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:54-89] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:109-120] |

## Deterministic ONE-versus-SYNTHESIS Procedure

1. **Resolve authority first.** Record the selected mode, user-pinned axes, existing owned design system, live extraction/target evidence, and proof bar. These outrank corpus material. `md-generator` operational phases and evidence-first audits stop here with zero corpus synthesis. [SOURCE: .opencode/skills/sk-design/SKILL.md:155-184]
2. **Name required dimensions.** Classify the request into composition/component grammar, imagery/signature motif, color/surface semantics, typography roles, spacing/layout rhythm, and motion behavior. Unnamed dimensions remain unset; retrieval may not fill them merely for variety. [INFERENCE: mode ownership in the hub and five mode contracts cited in the per-mode table]
3. **Filter, rank, then show cards.** Apply generation/provenance/license-known and mode/axis eligibility before lexical ranking. Return the mode's card cap; do not hydrate candidates merely because they ranked. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:39-46]
4. **Choose `ONE` by default.** Select one reference when it covers the requested dimensions, conflicts with no higher authority, and its thesis, components, and do/don't rules form a usable coherent whole. Hydrate only the mode's prescribed slices.
5. **Permit `SYNTHESIS` only for an explicit gap.** Synthesis is legal only when no eligible single reference covers independently requested dimensions and the mode table permits it. Assign exactly one source owner to each allowed dimension before hydration. The global cap is 3 sources; lower per-mode caps prevail. A source may own several dimensions, but a dimension may never have two owners.
6. **Apply coherence locks.** Composition/component grammar, imagery/signature motif, and geometry/elevation stay together under one anchor and cannot be imported piecemeal. Foundations may assign color/surface semantics, typography roles, and spacing/layout rhythm to different owners; motion may add one temporal owner. Preserve relationships and rationale, not raw values: no averaging colors, type sizes, spacing values, radii, or timings.
7. **Attach provenance to every applied decision.** Record style id, source URL, capture timestamp, artifact path/generation, owned dimension, and `licenseKnown`. The inspected `source.md` records provenance but no license; therefore exact copying/reuse claims are refused unless separate rights evidence exists. Inspiration and critique must be labeled as such. [SOURCE: .opencode/skills/sk-design/styles/kobu/source.md:3-12] [SOURCE: .opencode/skills/sk-design/styles/19-86/source.md:3-12]
8. **Refuse instead of smoothing conflicts.** Refuse synthesis when source caps are exceeded, ownership overlaps, identity locks conflict, provenance is missing, exact reuse is requested without rights evidence, the corpus lacks evidence for the requested axis, or the result cannot name which source caused each decision. Return to `ONE`, the mode's own references, or request-specific evidence rather than inventing a generic middle.

## Validation Against Contrasting Real Styles

### Coherent `ONE` cases

- **Kobu** is internally coherent as a warm parchment travel gazette: a six-neutral palette, Gill Sans editorial voice plus Fira Mono labels, photography as the sole color, square surfaces with only 5px badges, and 60–80px section rhythm. Its do/don't rules explicitly prohibit accent colors, shadows, larger radii, and alternate typefaces. Hydrating one `DESIGN.md` plus provenance preserves that identity. [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:1-36] [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:56-95] [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:159-177]
- **19–86** is independently coherent as a black-on-white architectural ledger: one hairline typeface at 24px and 490px, 24px rhythm, a permanent numeral watermark, flat rows, no imagery, and no third color. Its do/don't rules prohibit buttons, secondary type, depth, and intermediate hierarchy by weight. [SOURCE: .opencode/skills/sk-design/styles/19-86/DESIGN.md:1-31] [SOURCE: .opencode/skills/sk-design/styles/19-86/DESIGN.md:63-123] [SOURCE: .opencode/skills/sk-design/styles/19-86/DESIGN.md:125-172]

### Synthesis and refusal cases

- A foundations brief that explicitly pins **Kobu-like warm surface semantics** and **19–86-like ledger rhythm** may use two owners, provided the output records those dimensions separately and derives its own values. It may not also combine Kobu photography with 19–86's “no imagery” composition: that crosses the anchor lock and must be refused unless the user's brief resolves the conflict. [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:159-177] [SOURCE: .opencode/skills/sk-design/styles/19-86/DESIGN.md:105-137]
- “Kobu parchment + Fira Mono labels + 19–86 watermark + 490px scale + an averaged 42px section gap” is invalid. It cherry-picks signature motifs from both systems and averages 60–80px with 24px, yielding neither source's coherent model. [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:20-36,56-95] [SOURCE: .opencode/skills/sk-design/styles/19-86/DESIGN.md:15-31,33-61,75-78]
- Neither document has a motion section. Kobu's only temporal hit describes a typographic size transition; 19–86 explicitly forbids animation on its status dot and otherwise mentions page/section transitions descriptively. Motion mode must hydrate zero corpus references for a reduced-motion or choreography claim and use its own temporal evidence instead. [INFERENCE: focused heading/temporal-term scan of both complete `DESIGN.md` files] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:51-66,97-113]
- Either style may serve as the single STUDY pair for `md-generator`, but combining their values into an extraction would violate the mode's measured-source contract. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:10-15,34-46,109-120]

### Context-cost check

Direct measurement found Kobu's full `DESIGN.md` + `source.md` is 21,711 bytes and 19–86's is 17,654 bytes. Axis-only color + typography + spacing slices plus provenance are 5,457 and 3,226 bytes respectively; audit-focused do/don't plus provenance is 2,587 and 2,385 bytes. These results agree with iteration 3's candidate-card-first model: full hydration is affordable for one coherent interface/study reference, while foundations and audit should hydrate narrow slices. [INFERENCE: UTF-8 byte counts and heading-bounded slices from the two inspected style bundles] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:28-45]

## Findings

1. **A single universal payload is unnecessary: five compact cards followed by the table's mode-specific hydration caps covers all six consumers while preserving authority boundaries.** The hub stays logic-free; only interface and md-generator STUDY normally need a complete coherent reference. [SOURCE: .opencode/skills/sk-design/SKILL.md:140-184] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:28-45]
2. **`ONE` should be the default, and `SYNTHESIS` should require a named evidence gap plus exclusive dimension ownership.** A global three-source cap, lower mode caps, and one owner per dimension make the decision reproducible rather than an invitation to blend the top-K. [INFERENCE: synthesis of the six current authority contracts and the Kobu/19–86 conflict test]
3. **The only generally detachable synthesis dimensions are foundations' color/surface semantics, typography roles, spacing/layout rhythm, and motion's temporal behavior; signature composition, imagery, component grammar, and geometry/elevation remain anchor-locked.** This preserves why a style works while allowing explicitly independent axes to be informed separately. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:59-103] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:55-66,97-113] [INFERENCE: contrasting lock failures in the two style references]
4. **Kobu and 19–86 validate both sides of the procedure: each works as one coherent reference, but naive mixing breaks explicit rules on imagery, palette, typography, spacing, and signature scale.** The procedure therefore rejects a plausible-looking but evidence-incoherent generic middle without averaging values. [SOURCE: .opencode/skills/sk-design/styles/kobu/DESIGN.md:1-36,159-177] [SOURCE: .opencode/skills/sk-design/styles/19-86/DESIGN.md:1-31,105-137]
5. **Measured payloads validate full hydration only where coherent identity is required and sliced hydration elsewhere.** The two full reference/provenance pairs cost 17.7–21.7 KB, while three foundations axes cost 3.2–5.5 KB and audit constraints cost 2.4–2.6 KB; top-5 cards previously cost only 1.4–1.6 KB. [INFERENCE: direct UTF-8 byte measurement of the inspected bundles] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:28-45]
6. **Provenance is sufficient for traceability but insufficient for exact-reuse authority.** Both bundles identify Refero/original URLs, UUID, screenshot, and capture time but omit an explicit license/allowed-use field, so the contract can support inspiration and comparison while refusing exact copying absent separate rights evidence. [SOURCE: .opencode/skills/sk-design/styles/kobu/source.md:3-12] [SOURCE: .opencode/skills/sk-design/styles/19-86/source.md:3-12]

## Ruled Out

- Unbounded mixing of top-ranked styles or averaging token values.
- Letting corpus rank override hub routing, user pins, target evidence, mode standards, or live measured extraction.
- Treating incidental temporal words in a static style as motion evidence.
- Using more than one study pair or any corpus synthesis in md-generator's measured phases.

## Dead Ends

- **Top-K-as-palette synthesis:** retrieving several relevant styles and blending their values cannot preserve provenance or a coherent design thesis. Candidate diversity is useful for selection or distinct alternatives, not averaging.

## Edge Cases

- Ambiguous input: none; strategy and dispatch both require the per-mode consumption and ONE-versus-SYNTHESIS contract.
- Contradictory evidence: none. The two styles intentionally conflict and are used as a refusal test, not collapsed into one claim.
- Missing dependencies: explicit license/allowed-use metadata is absent from both inspected provenance files. The fallback is inspiration-only use with refusal of exact-copy authority.
- Partial success: none; the contract covers the hub and all five modes, includes deterministic caps/locks/refusals, and was validated against two real styles. Broader corpus licensing coverage remains unresolved but does not prevent answering the consumption question.

## Sources Consulted

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json:1-75`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl:1-5`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md:11-129`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:8-140,142-548`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/prompts/iteration-4.md:6-48`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md:1-103`
- `.opencode/skills/sk-design/SKILL.md:130-219`
- `.opencode/skills/sk-design/design-interface/SKILL.md:55-114`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:45-119`
- `.opencode/skills/sk-design/design-motion/SKILL.md:45-119`
- `.opencode/skills/sk-design/design-audit/SKILL.md:20-124`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:1-125`
- `.opencode/skills/sk-design/styles/kobu/DESIGN.md:1-235`
- `.opencode/skills/sk-design/styles/kobu/source.md:1-12`
- `.opencode/skills/sk-design/styles/19-86/DESIGN.md:1-182`
- `.opencode/skills/sk-design/styles/19-86/source.md:1-12`
- Read-only temporal-term scans and UTF-8 section-byte measurements for the two style bundles.

## Assessment

- New information ratio: **0.85**
- Novelty calculation: 3 fully new findings + 3 partially new findings = `(3 + 0.5×3) / 6 = 0.75`; add the `+0.10` simplicity bonus because the deterministic contract closes one open question, yielding `0.85`.
- Questions addressed: `What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?`; `Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?`
- Questions answered: `What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?`
- Remaining uncertainty: corpus-wide license-field coverage and the anti-slop proof gate's measurable acceptance criteria are not yet established.

## Reflection

- **What worked and why:** Converting authority boundaries into exact card, hydration, and source caps made the abstract coherence goal testable. The two contrasting references exposed concrete conflict cases, while byte measurements showed the rules are practical rather than merely aesthetic.
- **What did not work and why:** The corpus examples could not validate motion synthesis because neither has a genuine temporal section; incidental words are not sufficient evidence. Their provenance also cannot establish reuse rights.
- **What I would do differently:** Validate the next proof-gate iteration with one motion-bearing style if a manually verified positive exists, while keeping the current zero-hydration refusal as the baseline negative case.

## Recommended Next Focus

Define the anti-slop proof gate for retrieved references: require a source-ownership ledger, coherence-lock check, no-averaging check, deviation statement, provenance/rights label, and mode-specific evidence; then score coherent ONE, permitted bounded SYNTHESIS, and refused-conflict examples against that gate.
