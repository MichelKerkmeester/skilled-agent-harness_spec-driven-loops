# Iteration 038 — Track I (deepseek)

## Focus
Ordered implementation backlog (phased tasks, file targets, per-change validation, ship order)

## Findings
1. **[P0] Phase 1: Kill Hallucination Class 1 — Extraction Data Fixes** — ~195 LOC across 5 files. Kills both known hallucination classes by fixing root extraction + validation bugs.
   - Recommendation: SHIP FIRST. All Phase 2+ tasks depend on accurate tokens.
   - Evidence: iteration-031:#1-#3,#10,#17; iteration-027:#1-#3
2. **[P0] T1: focus-indicator-interaction-pipeline fix** — a11y-extract.ts:101-103 + extract.ts:81 + cluster.ts:1294 — ~95 LOC. Fixes (1) empty focusStyles→consistent:true (a11y-extract.ts:101-103), (2) interaction OFF by default (extract.ts:81 noInteraction=true), (3) findInteraction tag-vs-componentType key mismatch (cluster.ts:1294). Also add captured:boolean to focusIndicator/make altTextCoverage+minTouchTarget sentinel-aware.
   - Recommendation: a11y-extract.ts:101-103 return {captured:false}; extract.ts:81 noInteraction=true→false; extract.ts:118 add --fast-no-interaction opt-out; cluster.ts:1294 use classifyComponent() for key; cluster.ts:1298 invert fallback direction; a11y-extract.ts:322-325/246 add captured sentinels; validate.ts add checkA11yFocusProvidence gate. Test: run against anobel.com — verify §9 Focus Indicators contains real data (not empty {}) and captured is true.
   - Evidence: iteration-031:#1; iteration-027:#1; iteration-026:#1,#2; iteration-024:#2; iteration-029:#5
3. **[P0] T2: extractA11yAsync dead-code wiring** — extract.ts:19 + extract.ts:303-336 + extract.ts:445 — ~30 LOC. extractA11yAsync never imported/called; cssAnalyses never passed as 3rd arg → 5 §9 fields always null. Also delete dead-code cluster.ts:1506-1568.
   - Recommendation: extract.ts:19 import extractA11yAsync; per-page loop call while Page alive; extract.ts:445 pass cssAnalyses as 3rd arg; delete cluster.ts:1506-1568. Test: run extraction — verify a11yTokens.tabOrder/skipLinkDetected/altTextCoverage/langAttribute/reducedMotionSupport are non-null when data exists.
   - Evidence: iteration-031:#2; iteration-027:#2
4. **[P0] T3: deltaE clustering threshold fix + coverage election pre-gate** — cluster.ts:708 + cluster.ts:569 + cluster.ts:400-435 — ~50 LOC. deltaE<3 (≈0.03 perceptual diff) too tight; greedy single-pass no recentering; per-page freq inflation. Coverage election additive pre-gate: pagesCoverage<0.3 → cap L3.
   - Recommendation: cluster.ts:708 raise <3→<10; post-merge freq-weighted mean recomputation + union page sets; cluster.ts:741 use actual per-page freq; cluster.ts:569 add pre-classification HARD GATE; single-page coverage as frequencyPercentile. Test: extract stripe.com — verify #3B82F6 and #60A5FA merge into single brand cluster or L3; no single-page decorative colors reach L2.
   - Evidence: iteration-031:#3,#17; iteration-027:#3; iteration-029:#2
5. **[P0] T4: interaction-default-ON + component-key fix (subsumed in T1)** — extract.ts:81 + cluster.ts:1294 — ~10 LOC. Boolean flip + key fix un-starves §11 State Matrix, §4 Component Stylings, §9 Focus Indicators. Depends: T1 (bundled).
   - Recommendation: Included in T1 above. Separate entry for task granularity; verifies interactionLookup.findInteraction key fix independently. Test: extract with interaction ON — verify §11 state column data is non-null for detected components.
   - Evidence: iteration-031:#10; iteration-027:#1
6. **[P0] T5: contrast-pairs cap lift + uncapped source** — cluster.ts:799 — ~15 LOC. contrastPairs capped at top-20 with freq≥5 floor. Raise to .slice(0,50) with freq≥3 floor, OR swap §9 source from cluster.ts to uncapped a11y-extract.ts DOM-derived pairs.
   - Recommendation: cluster.ts:799 raise slice + lower freq floor; optionally replace §2 colorRelationships source with a11yTokens.contrastPairs. Test: verify semantically important lower-frequency text-on-bg pairs appear in §9.
   - Evidence: iteration-031:#21; iteration-027:#5
7. **[P0] Phase 2: Kill Hallucination Class 2 — Doc/Prompt/Routing Fixes** — ~160 LOC across 5 docs. Structural fixes to format spec, style guide, SKILL.md, anti_patterns.md, prompt template — eliminating fabrication-pressure language.
   - Recommendation: SHIP SECOND. Depends: Phase 1 (accurate tokens needed for conditional gates). No code-level dependency on T1-T5 but data-driven section requirements need section-coverage-map (T7).
   - Evidence: iteration-031:#4-#7,#11-#15; iteration-028:#1-#8
8. **[P0] T6: section-requirements data-driven (17→10 core + 5 conditional)** — validate.ts:241-285 + design_md_format.md §1 — ~45 LOC. Demote §0/§7/§11/§12 to conditional(data-driven); §6.5 conditional on motion data; §9 conditional on any a11y data. HIGHEST-LEVERAGE single change. Depends: T7 (section-coverage-map).
   - Recommendation: validate.ts:241 make requirements conditional: §2.5 requires darkMode.supported===true, §6.5 requires motion data present, §12 requires iconSystem.detected===true, §9 requires any a11y data beyond defaults. design_md_format.md §1 demote §0/§7/§11/§12 to 'Required: conditional(data-driven)'. Test: extract stripe.com → verify only 9-10 sections are required; data-poor sections omit silently. Gold standard: Vercel 10, Stripe 9, Linear 9, Supabase ~9.
   - Evidence: iteration-031:#4; iteration-026:#3; iteration-028:#7; iteration-029:#1; iteration-024:#5
9. **[P0] T7: section-coverage-map (token→section detection)** — validate.ts — ~60 LOC new checkSectionCoverage() function. Maps each of 17 DESIGN.md sections to its DesignTokens backing fields. No token→section coverage map currently exists. Depends: none (standalone new function).
   - Recommendation: New checkSectionCoverage(): §2→colorTokens, §3→typographyLevels, §4→components[].variants, §6→shadowTokens+gradients, §6.5→motionSystem, §9→a11yTokens, §10→breakpoints, §11→components[].variants[].hoverChanges, §12→iconSystem. Output SectionCoverageReport with per-section tokenCount/isEmpty/inventionRisk. Test: run against 4 gold-standard examples — confirm §0/§7/§11/§12 show empty backing token sets.
   - Evidence: iteration-031:#16; iteration-027:#4
10. **[P0] T8: AP-29 Interpretive Fabrication + NEVER-QUALITATIVE** — anti_patterns.md + SKILL.md §4 — ~15 LOC. Add AP-29 (Interpretive Fabrication) to anti_patterns.md; add NEVER rule #6 to SKILL.md §4; rescope AP-25/AP-26 to 'applies only when backing token data exists'. Depends: none (doc-only).
   - Recommendation: anti_patterns.md append AP-29; SKILL.md §4 append NEVER rule #6: 'NEVER assert a design relationship, causal explanation, named principle, design philosophy, comparative claim about other systems, or interpretive narrative that cannot be traced directly to a specific measurable value in tokens.json.' Test: adversarial review — verify both docs are ALWAYS-loaded and AP-29 is traceable by grep.
   - Evidence: iteration-031:#11; iteration-028:#2,#3
11. **[P0] T9: comparative-framing mandate removal** — design_md_format.md §3.4 + writing_style_guide.md §15 — ~15 LOC. Remove comparative-framing mandate ('Unlike most systems...'). Replace with intra-system comparison patterns. Depends: none (doc-only).
   - Recommendation: design_md_format.md §3.4:130 remove comparative-framing mandate, add intra-system pattern. writing_style_guide.md §15:534-586 rewrite GOOD examples with intra-system comparisons. Test: grep design_md_format.md and writing_style_guide.md for 'Unlike most' / 'Where others' — verify zero hits.
   - Evidence: iteration-031:#5; iteration-026:#4
12. **[P0] T10: named-principle conditional on evidence** — design_md_format.md §9 + design_md_prompt_template.md — ~30 LOC. Change §9 'Named principle' from unconditional to 'REQUIRED ONLY when ≥3 shadow/gradient/depth tokens exist across ≥2 pages. When absent, stamp ABSENT.' Apply same evidence-gate to §1 design principles and §3 named strategies. Depends: T1+T2 (accurate tokens needed for token counting).
   - Recommendation: design_md_format.md §9:544 + design_md_prompt_template.md: add evidence-gate + ABSENT-stamp. Test: A/B test prompt with empty shadow/gradient tokens — verify output stamps ABSENT rather than inventing 'gradient-as-depth'.
   - Evidence: iteration-031:#6; iteration-026:#5; iteration-028:#1; iteration-029:#4; iteration-024:#3
13. **[P0] T11: motion-fallback OBSERVED vs RECOMMENDED boundary** — design_md_format.md §10:586-592 — ~10 LOC. Current blended fallback intermixes fact with invention ('consider adding 150ms ease'). Hard-labeled OBSERVED/RECOMMENDED blocks with mandatory disclaimer. Depends: none (format spec only).
   - Recommendation: design_md_format.md §10:586-592 replace with hard-labeled OBSERVED: + RECOMMENDED: blocks. design_md_prompt_template.md mandate labels + disclaimer. Test: generate DESIGN.md with zero motion data — verify output has OBSERVED/RECOMMENDED labels with 'NOT measured from source' disclaimer.
   - Evidence: iteration-031:#12; iteration-026:#10; iteration-028:#4
14. **[P0] T12: ABSENT-stamp + ESCALATE-IF for zero-data sections** — SKILL.md §4 + design_md_format.md §22 + design_md_prompt_template.md — ~25 LOC. Add ESCALATE IF item 6 for when required sections lack backing token data. Add ABSENT-stamp rule. Depends: T8 (AP-29 establishes the principle); T10 (provides evidence-gate).
   - Recommendation: SKILL.md §4 add ESCALATE IF item 6; design_md_format.md §22 add ABSENT-stamp sub-rule; design_md_prompt_template.md add ABSENT-stamp rule. Test: extract site with no motion data — verify ESCALATE IF path activates and output stamps ABSENT.
   - Evidence: iteration-031:#13; iteration-028:#5
15. **[P0] T13: style-guide-vs-format-spec contradiction resolve** — writing_style_guide.md §10:347 — ~5 LOC. Direct contradiction: style guide says zero-value paragraphs are opinion → delete; format spec mandates philosophy paragraphs with zero token values. Depends: T8+T12 (establish resolution framework).
   - Recommendation: writing_style_guide.md §10:347 add exception clause: 'Required philosophy/narrative sections use an EVIDENCE-BACKED test: each claim must cite ≥1 specific token key from tokens.json. A paragraph with zero token citations is still opinion → stamp ABSENT.' Test: verify both docs loaded together produce consistent output (no post-hoc contradiction).
   - Evidence: iteration-031:#15; iteration-028:#8
16. **[P0] T14: cardinal-rules-card as pre-write gate** — SKILL.md §2 + design_md_prompt_template.md — ~5 LOC. cardinal_rules_card.md absent from Resource Loading Levels table. Not loaded under ANY tier. Add to ALWAYS row. Depends: none (routing fix).
   - Recommendation: SKILL.md §2 line 103 add assets/cardinal_rules_card.md to ALWAYS row; SKILL.md §2 RESOURCE_MAP line 132 add to EXTRACT_WRITE; design_md_prompt_template.md insert authoritative reference before inline rules. Test: verify cardinal_rules_card.md loads in ALWAYS tier (check session resource load list).
   - Evidence: iteration-031:#14; iteration-026:#11; iteration-028:#6
17. **[P0] Phase 3: Validator Semantic Checks** — ~220 LOC in validate.ts. Add prose-level checks, stability gating for non-color tokens, source-sentinels. Depends: Phase 1+2 (valid data needed for meaningful checks).
   - Recommendation: SHIP THIRD. Validator checks are only meaningful after extraction fixes produce accurate tokens and format/docs stop demanding fabrication.
   - Evidence: iteration-031:#7-#9; iteration-026:#6-#9
18. **[P0] T15: validator prose checks (banned adjectives + adversarial self-review)** — validate.ts + design_md_prompt_template.md — ~80 LOC. All 6 current validator checks are mechanical — zero read prose sentences against token ground truth. Add checkProseDiscipline() with banned adjectives + numeric-anchor suppression. Add adversarial SELF-REVIEW step between WRITE and VALIDATE. Depends: none (additive).
   - Recommendation: validate.ts add checkProseDiscipline(md): scan for BANNED_ADJECTIVES with ±50 char numeric-anchor suppression. WARNING-tier (weight 1pt). design_md_prompt_template.md insert SELF-REVIEW step: classify each sentence ANCHORED/INTERPRETIVE, require zero INTERPRETIVE. Test: feed fabricated-output doc through validator — verify banned adjectives are flagged; verify SELF-REVIEW catches interpretive sentences.
   - Evidence: iteration-031:#7; iteration-026:#6,#7
19. **[P0] T16: stability-gating extend to non-color tokens** — validate.ts:100-123 + types.ts:394 — ~50 LOC. checkStabilityGating only iterates colorTokens. ShadowToken/RadiusToken/ComponentGroup/TypographyLevel/Gradients all un-gated. Add checkShadowStabilityGating/checkGradientStabilityGating/checkComponentStabilityGating. Add stability field to gradients. Depends: none (additive).
   - Recommendation: validate.ts add per-token-type stability checks: cross-reference box-shadow CSS strings against tokens.shadowTokens; linear-gradient/radial-gradient against tokens.gradients; component type names against tokens.components. types.ts:394 add stability?:StabilityClassification to gradients. Test: feed fabricated shadow claim into validator — verify checkShadowStabilityGating flags L4 content-tier shadows in DESIGN.md.
   - Evidence: iteration-031:#8; iteration-026:#8
20. **[P0] T17: source-sentinels provenance check** — validate.ts — ~30 LOC. Inline <!-- source: tokens.<path> --> HTML comments make claims auditable. stripHtmlComments() already exists at validate.ts:51-53. Depends: none (additive, uses existing infrastructure).
   - Recommendation: validate.ts add checkSourceSentinels(md,tokens): parse HTML comments from raw MD, extract source: tokens.<path> entries, resolve dotted paths against DesignTokens, verify non-empty/non-null. WARNING-tier. design_md_prompt_template.md add cardinal rule for sentinels. Test: generate doc with source: comments → verify validate.ts resolves paths correctly and flags stale references.
   - Evidence: iteration-031:#9; iteration-026:#9; iteration-029:#6; iteration-024:#1
21. **[P1] T18: per-token confidence surfacing + role assignment** — cluster.ts + design_md_prompt_template.md — ~60 LOC. ColorToken.confidence already computed but never surfaced to writer. Add classifyColorRole() for deterministic usage-as role assignment. Depends: T3 (clean tokens), T4 (interaction accuracy).
   - Recommendation: Plumb confidence to WRITE prompt: strong claims only from high-confidence tokens. Add classifyColorRole() in cluster.ts: CSS var name overrides algorithmic usage-as dominance. Test: extract stripe.com → verify role assignment matches CSS var naming; verify low-confidence tokens are flagged in WRITE prompt.
   - Evidence: iteration-031:#23; iteration-029:#7,#9
22. **[P1] T19: interaction-data propagation fixes (B-track extras)** — cluster.ts + a11y-extract.ts — ~120 LOC across 4 files. Six additional extraction fixes: (1) multi-page motion extraction, (2) frequency range in stability scoring, (3) classifyVariant fallthrough + Destructive heuristic, (4) Badge/Card geometric thresholds, (5) inline classifyShadow dedup, (6) visibility guards. Depends: T1 (interaction ON first).
   - Recommendation: Order: merge cssAnalyses before extractMotion; increase freq range ±20→±40; fix classifyVariant with OKLCH hue range; relax Badge/Card thresholds; delete inline classifyShadow; add visibility guards in a11y-extract.ts. Test: extract multi-page site → verify motion data from pages 2+ present; verify Badge/Card detection on dense UI sites.
   - Evidence: iteration-031:#22; iteration-027:#6-#11
23. **[P1] T20: style-guide fabrication gate preamble** — writing_style_guide.md §§15-18 — ~10 LOC. §§15-18 (Comparative Framing/Named Principle/Frequency Interpretation/Intent Narration) actively solicit interpretive invention. Prepend FABRICATION GATE preamble. Depends: T8+T13 (establishes framework).
   - Recommendation: writing_style_guide.md prepend before §15 line 529: 'GATE: ALL named principles, comparative framing claims, intent narratives, and frequency interpretations in this document's following sections (§§15-18) are guidance for WHEN evidence exists. They MUST cite ≥1 specific token key from tokens.json.' Test: verify preamble loads before §§15-18 when resource is loaded.
   - Evidence: iteration-031:#20; iteration-028:#9
24. **[P1] T21: CSS var resolution + role-typed dedup + semantic component tagging** — dom-collector.ts + cluster.ts — ~100 LOC across 3 files. (1) CSS var resolution via getComputedStyle; (2) prefix-grouped per-role CSS var extraction; (3) className/ARIA role pre-pass for component detection before geometric fallback. Depends: none (extraction enhancement).
   - Recommendation: dom-collector.ts add resolution pass; replace flat CSS var extraction with prefix-grouped per-role; cluster.ts §7 add className/ARIA role pre-pass. Test: extract tailwindui.com → verify var()-referenced colors resolved; verify btn/card detected by className before geometric fallback.
   - Evidence: iteration-031:#24; iteration-029:#8,#11,#18
25. **[P2] Phase 4 (Optional): Doc-as-View Architecture** — ~600 LOC. Deterministic formatters.ts + DTCG parallel output + tokens.css + citation gating + full prose accountability. Deferred until Phase 1-3 stabilize extraction.
   - Recommendation: CONDITIONAL — implement only after Phase 1-3 verified working against gold-standard examples. Phase A (~200 LOC formatters.ts for §2+§3) has highest ROI; Phase B (~400 LOC full formatters + DTCG + citation gating) requires Phase A validation.
   - Evidence: iteration-031:#18,#19,#25,#26; iteration-030:#1-#7
26. **[P2] T22: Deterministic formatters.ts — Phase A (color + typography tables)** — tool/scripts/formatters.ts (new) — ~200 LOC. formatColorTable() + formatTypographyTable() auto-render §2+§3 from tokens.json. Eliminates ~60% of value-fabrication surface. Depends: T1-T5 (accurate tokens), T3 (clean cluster output).
   - Recommendation: New formatters.ts: formatColorTable() emits hex/role/freq/css-var paginated table; formatTypographyTable() emits hierarchy/scale/weight/font-size/line-height table. SKILL.md WRITE phase: run formatters first → AI receives pre-rendered tables + is forbidden from modifying. Test: compare formatter output against hand-written stripe.com DESIGN.md §2+§3 — verify 100% hex match, 0 fabricated values.
   - Evidence: iteration-031:#18; iteration-030:#1,#2,#6
27. **[P2] T23: citation-gating validator** — validate.ts — ~80 LOC. checkCitationGating(): parse [token: <path>] markers, verify against tokens.json. Class-(b) ≥1 citation/line; Class-(c) ≥2 citations/paragraph. Depends: T22 (formatters define which sections are auto-rendered vs annotated).
   - Recommendation: validate.ts add checkCitationGating(): resolve citation paths against DesignTokens, flag unreferenced prose claims. Test: feed doc with fabricated §1 principles → verify uncited claims flagged as FAILURES.
   - Evidence: iteration-031:#19; iteration-030:#3
28. **[P2] T24: DTCG parallel output (tokens.dtcg.json)** — tool/scripts/dtcg-wrap.ts (new) — ~200 LOC. DTCG $type/$value parallel output — zero breaking changes. Enables downstream interop + type-gated validation. Depends: T3 (clean cluster output).
   - Recommendation: New dtcg-wrap.ts: wrap ColorToken→{ $type:'color', $value:hex }, TypographyLevel→{ $type:'typography' }, etc. Run as post-cluster phase. Test: validate tokens.dtcg.json against W3C DTCG 2025.10 schema.
   - Evidence: iteration-031:#25; iteration-030:#4; iteration-029:#19
29. **[P2] T25: tokens.css emission** — tool/scripts/emit-css.ts (new) — ~50 LOC. Transform tokens.json → tokens.css as :root{} CSS custom properties. Test: verify output CSS parses correctly and references match tokens.json values.
   - Recommendation: New emit-css.ts: group by category (--color-*, --font-*, --shadow-*, --radius-*, --spacing-*). Run as Phase 1d after cluster. Test: diff tokens.css against known CSS var values.
   - Evidence: iteration-031:#26; iteration-030:#7; iteration-029:#12

## Questions Answered
- What is the optimal ship order? Extraction fixes (Phase 1) FIRST — all doc/validator/architecture fixes depend on accurate token data.
- What are the MINIMAL-VIABLE task boundaries? T1-T17 (~335 LOC) kills both hallucination classes 1 (value fabrication) and 2 (prose fabrication).
- What is the single highest-leverage change? T6 (section-requirements data-driven) — ~45 LOC eliminating structural fabrication pressure across 5 data-poor sections.
- What does Phase 4 (doc-as-view) depend on? All Phase 1-3 tasks must be verified working; formatters.ts Phase A (§2+§3 only) can ship independently.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Prototype formatters.ts against stripe/tokens.json — measure % of DESIGN.md lines replaced, hex fidelity improvement, context-token reduction
- A/B test evidence-gated philosophy prompt vs current mandatory prompt against same tokens.json — measure fabrication rate per section
- Implement coverage-election pre-gate in cluster.ts, run against gold-standard examples — quantify L2→L3 demotion count
- Audit design_md_prompt_template.md for ALL clauses demanding content when data absent — catalog every 'must include' lacking ABSENT fallback
- Design DTCG $description taxonomy per $type so auto-generated prose is parameterized not invented
- Benchmark default-on interaction capture extraction time against real sites to confirm opt-out viability

## Next Focus
- Prototype formatters.ts against stripe/tokens.json — measure % of DESIGN.md lines replaced, hex fidelity improvement, context-token reduction
- A/B test evidence-gated philosophy prompt vs current mandatory prompt against same tokens.json — measure fabrication rate per section
- Implement coverage-election pre-gate in cluster.ts, run against gold-standard examples — quantify L2→L3 demotion count
- Audit design_md_prompt_template.md for ALL clauses demanding content when data absent — catalog every 'must include' lacking ABSENT fallback
- Design DTCG $description taxonomy per $type so auto-generated prose is parameterized not invented
- Benchmark default-on interaction capture extraction time against real sites to confirm opt-out viability

## Summary
Ship Phase 1 (T1-T5, ~195 LOC) first: fixes the root extraction bugs (focus/empty, a11y dead code, deltaE clustering, coverage pre-gate) that starve the token pipeline — all downstream fixes depend on accurate tokens. Ship Phase 2-3 (T6-T17, ~140 LOC docs + ~220 LOC validator) second: makes section requirements data-driven, adds AP-29 + ABSENT-stamp + NEVER-QUALITATIVE to eliminate the structural fabrication demand, then gates the output with banned-word checks, non-color stability gating, and source-sentinel provenance — this ~335 LOC MINIMAL-VIABLE path kills both hallucination classes (value fabrication + prose fabrication) validated against 4 gold-standard examples (Vercel 10, Stripe 9, Linear 9, Supabase ~9 sections).
