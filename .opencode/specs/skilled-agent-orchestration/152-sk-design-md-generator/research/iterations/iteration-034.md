# Iteration 034 — Track D (mimo)

## Focus
Final external sweep (re-extract drift score, incremental merge, survey-completeness)

## Findings
1. **[P0] proof.ts freshness/drift score → DESIGN.md header** — proof.ts computes a coverage score (0-100%) by sampling live-site pixels against the token palette (OKLCH deltaE<12, excluding image regions). This is a drift detector: re-running proof.ts post-extraction reveals whether the source site changed since extraction. The score is currently ephemeral (proof.html/proof-data.json). Borrowable idea: embed a 'freshness stamp' in DESIGN.md header — extractionDate, lastProofDate, coverageScore, driftStatus (FRESH/STALE/UNKNOWN). Consumers (frontend agents, CI) can gate on driftStatus before trusting tokens. Where: DESIGN.md YAML frontmatter or §0 header block.
   - Recommendation: ADOPT — add extractionDate + lastProofCoverage to tokens.json meta (proof.ts already writes proof-data.json; plumb coverage + timestamp back into tokens.meta.freshness). DESIGN.md §0 renders it. When coverage drops >10pp from extraction-time baseline, stamp STALE. LOW cost (~15 LOC plumbing).
   - Evidence: proof.ts:75-143 (scoreColorCoverage), proof.ts:426-436 (proof-data.json output), extract.ts:459-466 (tokens.meta)
2. **[P0] Incremental merge (--merge-with) correctness audit** — mergeTokenSets (cluster.ts:1648-1742) correctly preserves stable tokens: colors merge by deltaE<3 with frequency accumulation, typography by family|size|weight key, shadows/radii by exact value. Incoming tokens that don't match get appended. Frequencies are summed (not replaced), so stable tokens retain historical counts. BUG: no field tracks WHICH extraction pass contributed a token — consumers can't distinguish 'confirmed across 3 extractions' from 'seen once'. Also: merge always takes incoming's non-token fields (components, layout, darkMode, motion, a11y) wholesale (line 1739), silently dropping existing component/motion data if incoming extraction didn't capture those pages.
   - Recommendation: ADOPT two fixes: (1) add lastSeenExtractionDate + extractionCount to each token type (~20 LOC in types.ts + merge logic). (2) Deep-merge components/layout/motion/a11y instead of wholesale replacement — keep existing keys when incoming lacks them (~30 LOC). Defer Tokens Studio two-way sync (conflict resolution UI) as overkill for CLI tool.
   - Evidence: cluster.ts:1648-1742 (full mergeTokenSets), extract.ts:528-539 (merge invocation), cluster.ts:1739 (incoming.overwrite)
3. **[P1] Knapsack multi-brand theming** — Knapsack supports multi-brand token sets (light/dark/high-contrast as parallel token files with shared structure). Our dark-mode detection (extract.ts:340-396) captures darkMode.lightVariables/darkVariables but writes them as a flat diff, not as parallel token sets. Borrowable: emit brand-variant token files (tokens.light.json, tokens.dark.json) alongside base tokens.json, enabling DESIGN.md to document both palettes deterministically.
   - Recommendation: DEFER — current dark-mode variable diff is sufficient for DESIGN.md §2.5. Multi-brand parallel output only needed if we support multi-theme design systems. Revisit if extract.ts --with-dark-pages lands.
   - Evidence: extract.ts:340-396, cluster.ts darkMode merge, iteration-029 item 1
4. **[P1] Zeroheight AI-refinement guardrails** — Zeroheight's AI doc refinement requires human approval before publishing — AI proposes, human disposes. Our WRITE phase lets the AI write all sections unchecked. Borrowable: split WRITE into PROPOSE (AI drafts) + APPROVE (human/validator gates) before final DESIGN.md. This is essentially what iteration-029 item 6 (source sentinels) and item 3 (deterministic formatters) achieve together — but the Zeroheight framing adds a review-step concept.
   - Recommendation: DEFER as separate workflow — already covered by iteration-029 items 3+6 composition (deterministic tables + source sentinels = implicit human-gate on narrative). No additional borrow.
   - Evidence: iteration-029 items 3+6, Zeroheight AI-refinement pattern
5. **[P1] Anima auto-layout-to-flexbox** — Anima converts Figma auto-layout to CSS flexbox/grid with responsive breakpoints. Our extraction captures layout tokens (flex/grid usage, spacing) but doesn't map them to responsive breakpoint patterns. Borrowable: correlate detected CSS breakpoints (extract.ts:471) with layout token usage to emit breakpoint-aware layout guidance in DESIGN.md §4.
   - Recommendation: DEFER — breakpoint data is already captured (tokens.breakpoints). Correlation with layout tokens is a WRITE-phase prompt concern, not a structural change. Low ROI vs other borrows.
   - Evidence: extract.ts:471-484 (breakpoint dedup), tokens.breakpoints field
6. **[P2] Font-converters metrics (woff2 compression ratios)** — Font-converters report woff2 compression ratios, file sizes, and unicode-range coverage. Our extraction detects font families but not file metrics. Borrowable: add font file size + compression ratio to typography tokens for performance guidance.
   - Recommendation: DEFER — font metrics require network fetch of font files (CORS-dependent, fragile). Not worth the extraction complexity for DESIGN.md output.
   - Evidence: font-converters pattern, typography token extraction
7. **[P1] Diez DocsGen deterministic doc generation** — Diez generates API docs directly from typed source objects — zero prose hallucination because the doc IS the token view. This is the same insight as iteration-029 item 3 (deterministic formatters) but Diez goes further: the doc format is derived from the type system, not a template. Borrowable: generate DESIGN.md section schemas from DesignTokens TypeScript types, so format spec and extraction types never drift apart.
   - Recommendation: ADOPT concept — iteration-029 item 3 already captures this. No additional borrow needed beyond formatters.ts plan.
   - Evidence: iteration-029 item 3, Diez DocsGen pattern
8. **[P1] Supernova AGENT-READY MCP endpoint** — Supernova exposes design tokens via MCP for direct agent consumption. Our tokens.json is already agent-readable but not queryable. Borrowable: a thin query CLI (query-token.ts) for structured token lookups without parsing the full JSON.
   - Recommendation: DEFER — already captured as iteration-029 item 22 (P2). tokens.json + jq is sufficient for now.
   - Evidence: iteration-029 item 22, Supernova MCP pattern
9. **[P1] Style Dictionary CTI transform (category-type-item)** — Style Dictionary's CTI (category-type-item) transform auto-classifies tokens by their path structure. Our role assignment is LLM-decided (iteration-029 item 9). Borrowable: deterministic CTI-style role classification from CSS variable name prefixes (--color-*, --font-*, --spacing-*).
   - Recommendation: ADOPT — this IS iteration-029 item 9 (classifyColorRole) + item 18 (prefix-grouped extraction). Combined, they implement CTI deterministically. Prioritize item 9.
   - Evidence: iteration-029 items 9+18, Style Dictionary CTI
10. **[P1] Specify SDTF composition/aliasing** — Specify's SDTF supports token aliasing with $ref pointers and provenance tracking. Our CSS variable cross-referencing (cluster.ts:662-675) discards variable names after matching. Borrowable: preserve CSS variable names as semantic aliases with provenance tags.
   - Recommendation: ADOPT — this IS iteration-029 item 15 (semantic aliasing with CSS-variable provenance). Already captured.
   - Evidence: iteration-029 item 15, Specify SDTF
11. **[P1] Locofy/Builder.io semantic component tagging** — Locofy uses className/ARIA role detection for component identification. Our dom-collector captures these signals (dom-collector.ts:169-171, 193-263) but cluster.ts ignores them for component detection. Borrowable: pre-pass className/role matching before geometric fallback.
   - Recommendation: ADOPT — this IS iteration-029 item 11 (semantic component tagging). Already captured.
   - Evidence: iteration-029 item 11, dom-collector.ts:169-171
12. **[P1] Backlight token-to-code integration** — Backlight connects design tokens directly to component code — tokens drive component rendering. Our pipeline extracts tokens → writes DESIGN.md → consumer reads. Borrowable: emit component-level token bindings (which tokens apply to which component type) as structured data alongside DESIGN.md.
   - Recommendation: DEFER — component-to-token mapping is implicit in selectorAnchors (iteration-029 item 16). Explicit binding format adds complexity without clear consumer.
   - Evidence: iteration-029 item 16, Backlight pattern
13. **[P2] Tokens Studio two-way sync discipline** — Tokens Studio supports bidirectional sync between Figma tokens and JSON files with conflict resolution (local-wins, remote-wins, manual). Our --merge-with is one-directional (incoming overwrites non-token fields). Borrowable: track per-token source-of-truth and detect conflicts when the same token changed in both existing and incoming.
   - Recommendation: DEFER — CLI tool is inherently one-directional (re-extract from live site is always authoritative). Conflict resolution UI is overkill. The extractionCount tracking from Finding #2 is sufficient.
   - Evidence: cluster.ts:1648-1742, Tokens Studio two-way sync pattern
14. **[P2] Polypane/Contrast CIEDE2000 visual distinction** — Already captured as iteration-029 item 20. CIEDE2000 alongside WCAG ratio for near-identical color detection.
   - Recommendation: DEFER — already in iteration-029 as P2.
   - Evidence: iteration-029 item 20
15. **[P2] Stark nearest-compliant-shade remediation** — Already captured as iteration-029 item 21. Binary-search OKLCh lightness for contrast remediation.
   - Recommendation: DEFER — already in iteration-029 as P2.
   - Evidence: iteration-029 item 21

## Questions Answered
- proof.ts drift detection IS a freshness score — coverage % + timestamp → DESIGN.md header stamp (FRESH/STALE) is adoptable at LOW cost
- --merge-with mergeTokenSets correctly preserves stable tokens (deltaE<3 dedup, frequency accumulation) but lacks per-token provenance tracking (extractionCount, lastSeenDate) and silently overwrites non-token fields
- External survey is COMPLETE: 22+ tools given verdicts across iterations 001-034 (design-extract, CSS Stats, Tokens Studio, Style Dictionary, Specify, Supernova, Zeroheight, Knapsack, Anima, Diez, Backlight, Locofy, Builder.io, Polypane, Contrast, Stark, axe-core, MiroMiro, project-wallace, get-custom-properties-style, font-converters, Tokens Studio two-way sync). iteration-029 captures 23 ranked items; this iteration adds 3 NEW findings (freshness stamp, merge provenance, multi-brand theming) and confirms 12 prior-verdict tools as already-captured.
- No new borrowable ideas from un-surveyed tools remain — all tools mentioned in the prompt (Knapsack, Zeroheight, Anima, font-converters) were either already captured in iteration-029 or yield DEFER verdicts

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Prototype freshness stamp: run proof.ts on a gold-standard extraction (stripe), modify tokens.meta.freshness, re-run proof.ts after simulating site change — measure coverage delta threshold for STALE classification
- Implement extractionCount in mergeTokenSets types + merge logic, run --merge-with against two sequential extractions of the same site to verify frequency accumulation correctness
- Audit WRITE-phase prompt for all 'must include' clauses that lack 'when absent, stamp ABSENT' — cross-reference against iteration-029 items 4+7 (evidence-gating + confidence surfacing)

## Next Focus
- Prototype freshness stamp: run proof.ts on a gold-standard extraction (stripe), modify tokens.meta.freshness, re-run proof.ts after simulating site change — measure coverage delta threshold for STALE classification
- Implement extractionCount in mergeTokenSets types + merge logic, run --merge-with against two sequential extractions of the same site to verify frequency accumulation correctness
- Audit WRITE-phase prompt for all 'must include' clauses that lack 'when absent, stamp ABSENT' — cross-reference against iteration-029 items 4+7 (evidence-gating + confidence surfacing)

## Summary
External survey COMPLETE (22+ tools, 23 ranked borrow items in iteration-029 + 3 new findings here). The three NEW findings: (1) P0 — proof.ts coverage score is a ready-made drift detector; plumbing it into tokens.meta.freshness + DESIGN.md header gives consumers a staleness signal at ~15 LOC cost. (2) P0 — mergeTokenSets is correct for token-level dedup but lacks provenance tracking (extractionCount/lastSeenDate) and silently drops existing non-token fields on merge. (3) P1 — Knapsack multi-brand theming is DEFER (covered by dark-mode variable diff). All other prompted tools (Zeroheight, Anima, font-converters, Tokens Studio two-way sync) are either already captured in iteration-029 or yield DEFER verdicts. No new borrowable ideas from un-surveyed tools remain. The iteration-029 top-3 borrows (data-driven sections, deterministic formatters, coverage election) remain the highest-ROI adoption path.
