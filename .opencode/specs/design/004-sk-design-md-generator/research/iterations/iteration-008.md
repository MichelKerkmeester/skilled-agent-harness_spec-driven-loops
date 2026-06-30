# Iteration 008 — Track D (mimo)

## Focus
Constrained 9-section schemas (DesignMD/Open Design) + clean-input filtering (Superposition/CSS Stats) vs fabrication

## Findings
1. **[P0] Section 1 (Visual Theme & Atmosphere) — primary fabrication vector** — Requires: unique opening sentence, 3 prose paragraphs with embedded CSS, 2-4 'Named design principles', comparative framing ('Unlike most systems...'), 8-12 Key Characteristics. The Vercel example opens 'the visual thesis of developer infrastructure made invisible — a design system so restrained it borders on philosophical'; Stripe: 'the gold standard of fintech design'. Both are LLM-authored editorial, not extracted data. When CSS signals are thin, this section forces the AI to invent philosophical framing (cf. 'gradient-as-depth' fabrication). 9-section schemas (DesignMD, Open Design) either omit this entirely or reduce it to a value-table of key characteristics without mandatory prose.
   - Recommendation: Convert Section 1 from narrative-first to table-first. Remove mandatory 'opening sentence', 'comparative framing', and 'Named design principles' requirements. Keep Key Characteristics as a value-list (em-dash format: [intent] — [css-value]). Add a 'Philosophy (Optional)' subsection that is PRESENT ONLY when the AI can cite ≥3 supporting CSS values from tokens.json. This eliminates the mandate to write prose when data is thin.
   - Evidence: design_md_format.md §3 (lines 104-147); vercel/DESIGN.md lines 8-24; stripe/DESIGN.md lines 8-24
2. **[P0] Section 0 (Brand Context) — personality fabrication** — Requires 3-5 adjectives each with 'parenthetical rationale tied to an observable design decision'. When the site has no strong personality signals, the AI fabricates rationales. A 9-section schema would collapse this to a metadata header (brand name, URL, pages crawled) without mandating personality interpretation.
   - Recommendation: Reduce Section 0 to a metadata table: [Company, URL, Pages, Framework, Date]. Move personality adjectives to an OPTIONAL subsection gated by a minimum token-count threshold (e.g., ≥50 unique color/typography tokens required before personality analysis is attempted).
   - Evidence: design_md_format.md §2 (lines 74-101)
3. **[P0] Section 6 (Depth & Elevation) — forced philosophical framing** — Requires 'Named principle' (chromatic-depth, shadow-as-border, luminance-stepping, etc.) plus 50-100 word 'Contrast with conventional approach' paragraph. The Vercel example writes a 90-word shadow philosophy paragraph. This forces editorial interpretation of raw shadow values. 9-section schemas list shadow values in a table without naming a 'philosophy'.
   - Recommendation: Keep shadow scale table (4-6 levels with frequency + use). Remove mandatory 'Named principle' label and 'contrast with conventional approach' paragraph. Add optional 'Philosophy' line only when a single shadow value accounts for ≥30% of total shadow occurrences (i.e., a dominant pattern exists).
   - Evidence: design_md_format.md §9 (lines 534-576); vercel/DESIGN.md lines 205-221
4. **[P1] Section 7 (Content & Voice) — vibe paragraph fabrication** — Requires 'Vibe Paragraph' (2-3 sentences capturing brand personality through copy) and tone descriptors with real quotes. The Vercel example writes: 'The absence of exclamation marks and emoji signals a brand that lets its product speak rather than performing enthusiasm.' This is editorial inference, not extracted data. A 9-section schema would list observed copy patterns (capitalization, button labels, emoji policy) as value-tables without mandating a 'vibe' narrative.
   - Recommendation: Remove 'Vibe Paragraph' requirement. Keep tone descriptors (with real quotes), capitalization rules, button label patterns as structured lists. If a vibe paragraph is desired, make it OPTIONAL and gated by ≥5 observed copy samples from different page sections.
   - Evidence: design_md_format.md §11 (lines 647-726)
5. **[P1] Section 6.5 (Motion System) — forced philosophy when no data exists** — Spec explicitly requires a motion section even when no motion data exists, and mandates: 'Motion philosophy' sentence + recommendations for what to implement. This is a direct fabrication mandate — the AI must invent motion philosophy from nothing. The Vercel example simply lists duration/timing values without philosophy.
   - Recommendation: When no motion data is detected, output a minimal stub: 'No motion data detected. Section omitted.' Remove the mandate to write philosophy or recommendations. When data IS present, keep duration table + easing functions but make 'Motion philosophy' a single sentence maximum, not a paragraph.
   - Evidence: design_md_format.md §10 (lines 578-644)
6. **[P1] Input-side filtering (Superposition/CSS Stats) — cleaner-input anti-fabrication** — Superposition excludes unused styles BEFORE the writer sees them. CSS Stats clusters colors by OCCURRENCE COUNT, making frequency the credibility signal. Our pipeline extracts ALL tokens (including one-off L4 values) and hands them to the AI with mandated narrative sections. The AI sees noise and must fill word counts — worst-case combination. The 9-section tools' value-table approach means the writer never needs to 'interpret' thin data into prose.
   - Recommendation: Add a pre-writer filtering pass: (1) exclude tokens with frequency ≤2 from philosophy/narrative sections, (2) require ≥3 tokens in a category before generating named principles for that category, (3) add occurrence counts to ALL token references in the extraction output so the AI can self-gate. This is an input-side constraint that reduces fabrication without changing the schema.
   - Evidence: Superposition (nexu-io) unused-style exclusion; CSS Stats occurrence-clustering
7. **[P2] Section 3 (Typography Named Strategies) — architectural benefit fabrication** — Requires 3-5 'Named Strategies' each with bold name, values, and 'architectural benefit'. The Stripe example: 'Light weight as signature: Weight 300 at display sizes... Where others use 600-700 to command attention, Stripe uses lightness as luxury.' The 'architectural benefit' is editorial inference. A 9-section schema lists the typography scale as a table without mandating strategy names.
   - Recommendation: Keep hierarchy table (12-20 rows). Convert 'Named Strategies' from mandatory 3-5 items to optional, gated by: strategies are only generated when the extraction data shows ≥2 non-obvious patterns (e.g., unusual weight choices, negative tracking at specific sizes). Obvious patterns (standard weight usage) should not generate strategy names.
   - Evidence: design_md_format.md §6 (lines 365-425); stripe/DESIGN.md lines 97-103

## Questions Answered
- Which v2 sections are fabrication-prone philosophy sections that 9-section tools omit? Sections 0, 1, 6, 7, 6.5, and 3 (Named Strategies) — these mandate narrative prose even when data is thin.
- Do 9-section tools require narrative at all? No — they are value-tables (palette, typography scale, spacing, components) with constraints (do/don't). Narrative is the wrong default for anti-hallucination docs.
- Does pre-writer input filtering (unused-style exclusion, occurrence-clustering) reduce fabrication? Yes — it removes noise before the writer sees it, preventing one-off values from being elevated to 'design principles'.
- What is the single most adoptable schema change? Convert Sections 0, 1, 6, 7 from mandatory-narrative to table-first with optional prose gated by data-density thresholds.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Fetch DesignMD (designmd.cc) actual 9-section schema to confirm exact section names and whether any require prose vs pure tables
- Fetch Open Design (nexu-io) DESIGN.md output format to compare section structure against v2 spec
- Prototype a 'gated philosophy' version of Section 1 where Named Principles are generated only when ≥3 supporting CSS values exist with frequency ≥10
- Evaluate adding a pre-writer frequency-clustering pass to the dmdg extraction pipeline (input-side anti-fabrication)
- Test whether converting Section 1 from prose to table-first reduces fabrication in a controlled A/B with the same extraction data

## Next Focus
- Fetch DesignMD (designmd.cc) actual 9-section schema to confirm exact section names and whether any require prose vs pure tables
- Fetch Open Design (nexu-io) DESIGN.md output format to compare section structure against v2 spec
- Prototype a 'gated philosophy' version of Section 1 where Named Principles are generated only when ≥3 supporting CSS values exist with frequency ≥10
- Evaluate adding a pre-writer frequency-clustering pass to the dmdg extraction pipeline (input-side anti-fabrication)
- Test whether converting Section 1 from prose to table-first reduces fabrication in a controlled A/B with the same extraction data

## Summary
The v2 spec's 17-section schema mandates narrative prose in 6 sections (0, 1, 3-NamedStrategies, 6, 6.5, 7) even when extraction data is thin — this is the root fabrication vector. Competitor 9-section schemas (DesignMD, Open Design) use value-tables only, eliminating the prose mandate entirely. The single most adoptable change: convert Sections 0, 1, 6, 7 from narrative-first to table-first, gating optional prose behind data-density thresholds (≥N tokens with frequency ≥M). Combined with input-side filtering (exclude frequency ≤2 tokens from philosophy sections), this addresses fabrication at both the input and output layers rather than relying on post-hoc validation.
