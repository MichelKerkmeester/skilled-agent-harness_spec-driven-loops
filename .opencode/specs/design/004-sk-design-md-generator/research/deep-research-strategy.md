---
title: Deep Research Strategy - sk-design-md-generator hardening
description: Session tracking for the 50-iteration deep-research loop hardening sk-design-md-generator against prose hallucination and surveying external design-extraction tools.
trigger_phrases:
  - "design md generator research strategy"
  - "sk-design-md-generator hardening research"
  - "prose hallucination prevention research"
  - "design extraction tool survey"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - sk-design-md-generator hardening

Runtime tracking for the 50-iteration deep-research loop. Driven by the host orchestrator in parallel waves (MiMo v2.5 Pro + DeepSeek v4 Pro, high). Full plan: `research-plan.md`.

## 1. OVERVIEW

### Purpose

Persistent brain for the session. Records what to investigate (4 tracks), what worked/failed, and where to focus next. Read at every wave.

---

## 2. TOPIC

Harden `sk-design-md-generator` against WRITE-phase **prose hallucination** (interpretive claims not grounded in `tokens.json`, e.g. "gradient-as-depth replaces shadow elevation", "focus indicator is consistent") and improve backend script logic, skill context engineering, and DESIGN.md generation quality. Track D surveys external design-token / DESIGN.md / CSS-extraction tools and GitHub repos for borrowable fidelity / anti-fabrication techniques (>=20 of 50 iterations).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] A: How do we stop the WRITE phase asserting interpretive relationships/causes/consistency not present in tokens.json (prompt, style-guide, format-spec constraints)?
- [ ] A: What mechanical validator extension catches prose fabrication — claims-to-token provenance, banned interpretive phrases, the focus-"consistent" cross-check?
- [ ] B: Which extraction gaps force the writer to invent (focus default-off, a11y async half never called, single-page motion, contrast top-20 cap, gradient non-decomposition)?
- [ ] B: How accurate are OKLCH clustering + L1-L4 stability gating + component/variant classification, and where do they corrupt fidelity?
- [ ] C: Which resource-doc / prompt-template / format-spec requirements actively SOLICIT fabrication (mandatory "named principle", comparative framing, required philosophy paragraphs)?
- [ ] D: What do the best external extractors (DesignMD, design-extract, extract-design-system, Superposition, project-wallace, Style Dictionary, Open Design, CSS Stats) do for extraction fidelity + anti-fabrication + DESIGN.md narrative, and what is borrowable?
- [ ] RESERVED (never mark answered): What new angles, risks, or cross-track connections emerge as research broadens? Keep open to prevent early convergence.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not rewriting the extractor from scratch; favor surgical, evidence-backed hardening.
- Not shipping changes in this loop — output is a prioritized recommendation set + external-tool survey. Implementation is a later packet.
- Not researching Figma-only or paid-SaaS internals beyond what is publicly borrowable.

---

## 5. STOP CONDITIONS

- Hard cap: 50 iterations reached (the ONLY intended stop). No early convergence.
- The RESERVED key question stays permanently open; angles broaden every wave.
- Pause only via `research/.deep-research-pause` sentinel or explicit operator instruction.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Track E: Statically check writing_style_guide.md for all pattern instructions that can generate unverifiable prose — identify every 'must include' / 'required' clause that lacks a corresponding validate.ts check. (iteration 1)
- Track B: Catalog EVERY prose-claim category across the 17 DESIGN.md sections that has zero token binding — starting with brand personality adjectives (design_md_format.md §2), motion philosophy (design_md_format.md §10: 'Motion serves as confirmation, not decoration'), and content-voice tone descriptors (design_md_format.md §11) — all of which the style guide demands be evocative and named but none of which validate.ts checks. (iteration 1)
- RESERVED: emergent angles/risks (permanently open) (iteration 1)
- Track C: Extend the source-provenance sentinel concept to the cardinal-rules card — add a rule 'Every prose claim about a design property (focus consistency, depth theory, motion philosophy absence) cites a token-key path or is flagged as inference' to cardinal_rules_card.md checklist (line 33-44). (iteration 1)
- Track D: Interaction capture default (OFF) vs. a11y contract requirement — the system defaults extract.ts to skip interaction capture, yet §9 Accessibility Contract is a REQUIRED section. The default extraction mode guarantees the A11yTokens are incomplete. Should extraction warn/error when --no-interaction is default and the DESIGN.md will include Focus Indicators? (iteration 1)
- Track A-i: Audit all A11yTokens fields for default-fabrication — does minTouchTarget report 0/0 similarly when no interactive elements found? Does altTextCoverage.percentage return 100 on empty? (a11y-extract.ts:322-326, 224-249 — parallel bug pattern.) (iteration 1)
- Test whether default-on interaction capture changes extraction time enough to justify the off-default (current PER_ELEMENT_TIMEOUT=6s × MAX_ELEMENTS=50 = 5min worst case per page) (iteration 2)
- Quantify: on a real extraction (e.g. stripe.com), what % of DESIGN.md sections have zero-backing-token fields — run extract, count empty/null token fields, cross-reference with §requirements (iteration 2)
- Audit the WRITE-phase prompt: does it instruct the AI to note 'no data' or does it implicitly require content for every cell/field, forcing fabrication (iteration 2)
- Investigate whether the validate.ts script catches fabricated values or only checks format/structure (iteration 2)
- Analyze DTCG 2025.10 spec for which $type values map meaningfully to the 17 DESIGN.md sections — which types are structural anchors vs. which are supplementary, to build the minimum viable tokens.dtcg.json schema (iteration 3)
- Deep-fetch design-extract/designlang (github Manavarya09, 3.3k stars) — study exact coverage threshold algorithm, multi-platform emitter architecture, MCP server design, and how coverage-based election handles shared-foundation tokens across independent surfaces (iteration 3)
- Compare DesignMD's 9-section schema contracts section-by-section against sk-design-md-generator's 17-section contracts to identify where DesignMD's constrained sections prevent fabrication that our open-ended sections permit (iteration 3)
- Audit current cluster.ts stability classifier against a known fabrication case (e.g., a real tokens.json where a one-off gradient got classified L2) to quantify the page-coverage vs. element-frequency scoring imbalance with real numbers (iteration 3)
- A6 implementation: write the gradient stability classification in cluster.ts (classifyGradientStability) and the three new check functions with test fixtures for L4 shadow/gradient/component content in DESIGN.md prose (iteration 4)
- A12 hardening: enumerate all backtick-wrapped values in 10 production DESIGN.md files to measure the false-positive rate of strict-allowlist mode vs current heuristic mode (iteration 4)
- A7 calibration: run the banned-word check against 5 existing DESIGN.md outputs to tune the numeric-anchor window size and identify additional false-positive patterns (iteration 4)
- A10 consumer impact: audit all callers of validateDesignMd (CLI, report-gen.ts, proof.ts) to understand how dual-score output affects exit codes and report rendering (iteration 4)
- Check whether `childrenCount` in ElementStyle correctly counts only direct element children or is inflated by text-node children in the DOM collector (iteration 5)
- Cross-validate deltaE vs DE2000/CIEDE2000 — the ×100 scaling may not correspond to any standard perceptual metric; consider switching to culori's built-in deltaEOK (iteration 5)
- Benchmark cluster accuracy against a labeled ground-truth dataset of 5–10 design systems (Material, Ant, Tailwind UI, etc.) (iteration 5)
- Audit the DESIGN.md writer for how L2/L3 tokens are rendered — does it respect 'Subject to change' annotation or inline L3 tokens as if canonical? (iteration 5)
- Trace the AP-25 (Unnamed Principles) and AP-26 (Convention Assumption) anti-patterns: they currently ENFORCE the fabrication solicitation by defining the ABSENCE of fabricated narrative as an anti-pattern. Should they be rescoped or retired? (iteration 6)
- Audit the four gold-standard examples (stripe, vercel, linear, supabase DESIGN.md + tokens.json pairs) for frequency of fabricated philosophy vs. evidence-backed philosophy — how many named principles in the exemplars actually trace to token keys? (iteration 6)
- Investigate whether the prompt template's cardinal-rules numbering (1-6 currently) should be restructured so the anti-fabrication rule reads as the NEW rule 1 (strongest priming position) rather than appended as rule 7. (iteration 6)
- Check whether the validate.ts script could be extended to detect 'philosophy without evidence' — flag any narrative paragraph in a mandatory section that contains zero token-key citations. (iteration 6)
- Deepen: host-fetch W3C DTCG 2025.10 Editor's Draft for the full $type enumeration (color, dimension, shadow, typography, gradient, cubicBezier, transition, strokeStyle, border, duration — which ones map to our DesignTokens fields?), composite token referencing syntax ($id + $extensions), and group/alias resolution rules (iteration 7)
- Deepen: host-fetch design-extract repo for exact coverage election threshold semantics (is it pagesCoverage >= threshold or a more nuanced 'canonical page count' metric?), DTCG composite token $id referencing mechanics, and the CSS health audit + WCAG report card architecture which would complement our a11y validation (iteration 7)
- Fetch DesignMD (designmd.cc) actual 9-section schema to confirm exact section names and whether any require prose vs pure tables (iteration 8)
- Evaluate adding a pre-writer frequency-clustering pass to the dmdg extraction pipeline (input-side anti-fabrication) (iteration 8)
- Fetch Open Design (nexu-io) DESIGN.md output format to compare section structure against v2 spec (iteration 8)
- Prototype a 'gated philosophy' version of Section 1 where Named Principles are generated only when ≥3 supporting CSS values exist with frequency ≥10 (iteration 8)
- Test whether converting Section 1 from prose to table-first reduces fabrication in a controlled A/B with the same extraction data (iteration 8)
- A-i follow-up: backfill captured:boolean across all a11y-extract.ts extractors (minTouchTarget, altTextCoverage, focusIndicator, reducedMotionSupport) and update A11yTokens type + downstream consumers (iteration 9)
- A11 follow-up: implement the structured-output field tables in the format spec and update validate.ts to enforce field presence (not free prose) (iteration 9)
- Cross-cutting: validate.ts checkContent currently warns on missing typography table and low color count but has no anchoring-density check — add a metric: % of sentences containing ≥1 token-traceable value (iteration 9)
- Cross-cutting: the DesignTokens type (types.ts) needs auditing for other nullable fields that lack captured sentinels — motionData, shadowData, darkMode, etc. (iteration 9)
- A8 follow-up: audit all § examples in writing_style_guide.md for external-system claims; rewrite as intra-system comparisons (iteration 9)
- A15 follow-up: implement the adversarial self-review as a scripted pre-validate step (or embed in validate.ts as a new checkAnchoring pass) (iteration 9)
- Audit the DESIGN.md writer (generate-design-md.ts or Claude Code prompt) against a populated SectionCoverageReport to confirm which sections currently get invented content when token sets are thin. (iteration 10)
- Verify that adding checkSectionCoverage to validate.ts doesn't break existing scoring — phantom-color and missing-section are already hard-fail critical types; section coverage should be a warning (not hard-fail) for thin sections and an optional hard-fail gate for empty sections. (iteration 10)
- Test gradient regex decomposition against real-world gradient strings (nested rgba, multiple backgrounds, legacy -webkit- prefixes, conic gradients) to establish parser reliability. (iteration 10)
- Benchmark multi-viewport DOM re-extraction cost — the crawl already opens/closes browser contexts per page; adding 3-5 viewport resizes may be marginal or substantial depending on page count. (iteration 10)
- Define the exact DTCG token schema for each of the 8 token categories (color, typography, shadow, radius, spacing, motion, gradient, component) with $type and $value shapes (iteration 11)
- Map each of the 17 DESIGN.md sections to deterministic-vs-AI classification with specific formatter function signatures (iteration 11)
- Design the semantic alias computation rules for primary/secondary/surface/text/accent roles from frequency+usage data (iteration 11)
- Prototype dtcg-wrap.ts against existing stripe/tokens.json to measure migration effort (iteration 11)
- deepen: quantify the var()-chain resolution gap — what % of cssVariables[] entries in real extractions (stripe, vercel examples) are currently unlinked to colorTokens due to var() indirection? (iteration 12)
- deepen: benchmark the occurrence-band pre-clustering against the current greedy perceptual-only approach on the gold-standard examples to measure token-count inflation/deflation (iteration 12)
- deepen: prototype the role-typed extraction on one example site and compare the resulting cssVariables[] array size and composition against the current flat output (iteration 12)
- Implement AP-29 and the prose-fidelity check function (checkProseFidelity) in validate.ts—specific regex patterns for banned adjectives, recommendation-without-disclaimer detection, named-principle presence. (iteration 13)
- Add sentinel generation to the prompt template and sentinel validation to validate.ts—define the exact `<!-- src: ... -->` format and proximity tolerance. (iteration 13)
- Wire data-driven section requirements into checkSectionCompleteness—requires tokens.json schema inspection to confirm motion/iconography/darkMode field paths. (iteration 13)
- Implement fidelity-audit.ts as a standalone validator script (or as a --prose flag on validate.ts) that runs the anti-pattern checks validate.ts currently cannot. (iteration 13)
- Test the OBSERVED/RECOMMENDED boundary through the full pipeline: extract → write with new template → validate with new data-driven checks—confirm no fabricated values survive. (iteration 13)
- Audit §9 writer prompt to enforce transcription-only of a11y-extract.ts measured data (no invention) (iteration 14)
- Implement nearestCompliantShade() OKLCh binary search in a11y-extract.ts or remediation.ts (iteration 14)
- Refactor extractFocusIndicator() to axe-style rule-based audit with violation counts (iteration 14)
- Add opentype.js font-metrics.ts for x-height/cap-height extraction from .woff2 URLs (iteration 14)
- deepen: protopyte the className/role pre-pass in a shadow branch of cluster.ts to measure the fidelity improvement over pure geometry on 3 benchmark sites (iteration 15)
- deepen: trace the WRITE phase LLM instruction for §11 to identify which prompt fragment causes invention when state diffs are null — the format spec says 'use - when state applies but was not observed' but the writer interprets 'required section' as 'must produce content' (iteration 15)
- deepen: map each geometric heuristic (Badge/Card/Hero/Nav) against the className+role already collected to quantify false-positive rate — run cluster.ts against a DESIGN.md of a known component library to measure misdetection (iteration 15)
- deepen: compare Anima's specific Auto Layout→Flexbox mapping algorithm against our collected flex/grid token set to design the aggregation schema — what Anima infers from Figma we can infer from computed CSS (iteration 15)
- deepen: prototype the multi-file manifest output against the existing stripe example — benchmark writer citation accuracy (can an agent locate 'stripe's primary brand color' faster in manifest vs flat?); measure with a citation-time micro-benchmark (iteration 16)
- deepen: map specific cssVariableName patterns from 4 example sites (stripe/vercel/linear/supabase) to proposed alias keys — prove the alias extraction would actually work on real CSS variable naming conventions (iteration 16)
- deepen: analyze DTCG 2025.10 $extensions field — could we embed our stability classification (infrastructure/system/campaign/content) as a DTCG-compliant extension rather than a custom stability field? (iteration 16)
- deepen: benchmark whether splitting WRITE into auto-render + AI-annotate actually reduces validate.ts failure rate on the four example sites (stripe, vercel, linear, supabase) (iteration 17)
- deepen: design the render-tables.ts output format for deterministic sections — which markdown table structure best serves both human readers and agent parsers (iteration 17)
- deepen: design the human-annotation delimiter convention — HTML comments vs frontmatter vs a sidecar YAML — for the merge-update preservation model (iteration 17)
- deepen: prototype the cite-the-token annotation format and validate.ts enhancement — what's the minimal change to make numeric citations machine-checkable (iteration 17)
- Deepen: Compare Open Design's deterministic re-render DESIGN.md schema section-by-section against our format spec to identify exactly which content-type constraints prevent fabrication in each section (iteration 18)
- Deepen: If Open Design's DESIGN.md output format is publicly documented in their repo, extract the exact 9-section schema contract (section names, content types, constraints) for direct comparison with our design_md_format.md sections (iteration 18)
- Deepen: Run a controlled experiment: generate DESIGN.md with current WRITE prompt vs with evidence-quota-augmented prompt vs with vibe-paragraph-removed prompt, then measure hex fidelity AND prose-accuracy against ground-truth tokens (iteration 18)
- Deepen: Benchmark the 4 gold-standard example DESIGN.md outputs against their source tokens.json to quantify: (a) how many atmosphere claims are supported by >=3 token values, (b) how many named principles have zero token evidence, (c) whether any Section 7 vibe-paragraph claims contradict observed UI text (iteration 18)
- Deepen: Study the SKILL.md prompt architecture of extract-design-system — how does its skill prompt structure (phase detection, resource loading, cardinal rules) compare to ours? Is its prompt shorter/more constrained/less interpretive? (iteration 18)
- Verify B13 fix does not introduce false-positive interaction matches across unrelated components (current fallback class-substring direction can over-match) (iteration 19)
- Check if other files (writer/MD generator) import the exported classifyShadow and would break if its signature changes during dedup (iteration 19)
- The cluster.ts a11y computation (lines 1506-1568) produces focusIndicator/contrastPairs/minTouchTarget/minFontSize that is always discarded — ~60 lines of dead code that should be removed (iteration 19)
- Audit interactionLookup dedup: only one capture per first-class-prefix is stored — could two variants share the same prefix and overwrite each other's interaction data? (iteration 19)
- Prototype canvas gradient sampler for dom-collector.ts to validate pixel-sampling accuracy vs CSS-string parsing (iteration 20)
- Implement selectorAnchors on ColorToken + structural-region confidence signal (P0+P1 scope, cluster.ts + types.ts) (iteration 20)
- Audit whether low-confidence tokens currently leak into L1/L2 DESIGN.md sections by inspecting gold-standard examples (stripe, vercel) (iteration 20)
- Design .values.json schema and measure context-token reduction vs DESIGN.md for agent consumption (iteration 20)
- Ablation study: generate two DESIGN.md files from the same tokens.json — one with full narrative (current) and one with value-tables-only (fabrication-safe). Compare hex accuracy, role assignment, and information density (iteration 21)
- Test the dynamic OKLCH threshold (chroma-scaled) against the fixed deltaE<3 threshold on the gold-standard examples to quantify merge accuracy (iteration 21)
- Port color_role_taxonomy.md's identification signals into a deterministic classifyColorRole() in cluster.ts and measure agreement with gold-standard DESIGN.md role assignments (iteration 21)
- Calibrate L1-L4 thresholds against known design systems (Material Design, Polaris, Atlassian) — run the stability classifier on their tokens.json and measure precision/recall against published token catalogs (iteration 21)
- deepen: DTCG $description field taxonomy — define description templates per $type (color: frequency+role+contrast; dimension: scale-position+usage+responsive; shadow: level+technique+component) so auto-generated prose is parameterized, not invented (iteration 22)
- deepen: DESIGN.md claim-verification protocol — for each of 17 sections, specify which DTCG $type(s) a claim must cite; implement in validate.ts as DTCG-conformance gate (iteration 22)
- deepen: prototype DTCG token schema adapter for extract.ts — map current flat tokens.json fields to DTCG $type/$value/$description/composite structures (iteration 22)
- Benchmark deterministic-tables vs AI-written tables: run controlled experiment on 4 gold-standard examples measuring hex fidelity + prose accuracy (iteration 23)
- Prototype dtcg-wrap.ts against stripe/tokens.json to measure DTCG migration effort and validate type-gated validation reduces failure rate (iteration 23)
- Audit whether low-confidence tokens leak into L1/L2 DESIGN.md sections in gold-standard examples (iter-020 P1 confidence-gate gap) (iteration 23)
- Design .values.json schema from iter-020 P1 and measure context-token reduction vs DESIGN.md for agent consumption (target: ~70% reduction) (iteration 23)
- Audit the WRITE-phase prompt template (design_md_prompt_template.md) for all clauses that demand content when data is absent — catalog every 'must include' / 'required' that lacks a 'when absent, stamp ABSENT' fallback (iteration 24)
- Prototype the inline `<!-- source: tokens.x -->` sentinel mechanism: parse sentinels from raw MD via stripHtmlComments path, resolve dotted paths against DesignTokens, verify non-empty/non-null — measure false-positive rate on 3 real DESIGN.md outputs (iteration 24)
- A/B test: generate DESIGN.md with current mandatory-philosophy prompt vs evidence-gated philosophy prompt (same tokens.json) — measure fabrication rate per section (iteration 24)
- Implement coverage-election as additive pre-gate in cluster.ts, run against existing stripe/vercel tokens.json to quantify L2→L3 demotion count (iteration 24)
- study whether L2/L3 boundary tokens are the highest-fabrication-risk class (campaign tokens have thin evidence but are allowed with caveats) (iteration 25)
- deepen per-section evidence-level computation (which dimensions map to which DESIGN.md sections, what thresholds define FULL/PARTIAL/ABSENT/FABRICATED) (iteration 25)
- spec the evidence-level output schema for the validator enhancement (iteration 25)
- Audit design_md_prompt_template.md for ALL clauses demanding content when data is absent — catalog every 'must include' without ABSENT fallback (iteration 26)
- A/B test: evidence-gated named-principle prompt vs current mandatory-philosophy prompt — measure fabrication rate per section (iteration 26)
- Prototype inline source sentinel mechanism: parse sentinels from raw MD, resolve dotted paths against DesignTokens, measure false-positive rate on 3 real DESIGN.md outputs (iteration 26)
- Backfill captured:boolean across all a11y-extract.ts extractors and audit DesignTokens for other nullable fields lacking sentinels (iteration 26)
- Implement data-driven section requirements in checkSectionCompleteness — requires tokens.json schema inspection to confirm field paths for each conditional section (iteration 26)
- Benchmark default-on interaction capture extraction time (PER_ELEMENT_TIMEOUT=6s × MAX_ELEMENTS=50 = 5min worst case per page) to determine if opt-in was justified (iteration 27)
- Audit DESIGN.md writer prompt: does it instruct AI to note 'no data' or implicitly require content for every cell/field, forcing fabrication when backing tokens are empty (iteration 27)
- Benchmark multi-viewport DOM re-extraction cost — crawl already opens/closes browser contexts per page; adding 3-5 viewport resizes may be marginal or substantial (iteration 27)
- Quantify on real extraction (e.g. stripe.com): what % of DESIGN.md sections have zero-backing-token fields — run extract, count empty/null token fields, cross-reference with section requirements (iteration 27)
- Verify B13 fix (componentType key in findInteraction) does not introduce false-positive interaction matches across unrelated components with same tag+class prefix (iteration 27)
- Test gradient regex decomposition against real-world gradient strings (nested rgba, multiple backgrounds, legacy -webkit- prefixes, conic gradients) to establish parser reliability (iteration 27)
- Trace AP-25 (Unnamed Principles) and AP-26 (Convention Assumption) anti-patterns — they currently ENFORCE fabrication solicitation by defining the ABSENCE of fabricated narrative as an error. Should they be rescoped or retired? (iteration 28)
- Audit the four gold-standard examples (stripe/vercel/linear/supabase DESIGN.md + tokens.json pairs) for: (a) how many named principles actually trace to token keys, (b) how many atmosphere claims have ≥3 backing token values, (c) whether any vibe-paragraph claims contradict observed UI text (iteration 28)
- Re-scope cardinal rules numbering: should the anti-fabrication rule read as rule 1 (strongest priming position) rather than appended? (iteration 28)
- Implement the ABSENT-stamp mechanism end-to-end: apply to all 17 sections in format spec, wire into prompt template cardinal rules, and add to ESCALATE IF routing path (iteration 28)
- Benchmark the prompt template with evidence-gated philosophy vs. current unconditional prompt against the same tokens.json to measure fabrication rate per section (iteration 28)
- Audit WRITE-phase prompt template for all 'must include' clauses lacking 'when absent, stamp ABSENT' fallback (iteration 29)
- Implement coverage-election pre-gate in cluster.ts, run against gold-standard examples to quantify L2→L3 demotion count (iteration 29)
- Prototype DTCG parallel output (tokens.dtcg.json) against stripe/tokens.json to measure migration effort (iteration 29)
- A/B test: generate DESIGN.md with current mandatory-philosophy prompt vs evidence-gated prompt — measure fabrication rate per section (iteration 29)
- Design DTCG $description taxonomy per $type (color: frequency+role+contrast; dimension: scale-position+usage+responsive; shadow: level+technique+component) so auto-generated prose from $description fields is parameterized, not invented (iteration 30)
- Benchmark Phase A (only §2+§3 auto-rendered) vs full Phase B against 4 gold-standard examples: measure hex fidelity, weight/lineHeight/shadow value accuracy, and validation score delta (iteration 30)
- Prototype formatters.ts against stripe/tokens.json to measure: (a) exact % of DESIGN.md lines replaced, (b) end-to-end hex fidelity improvement, (c) context-token reduction for agent consumers (iteration 30)
- Design the citation syntax for checkCitationGating(): markdown-compatible format that survives rendering but is parseable by validate.ts — options: HTML comment (<!-- token: ... -->), backtick annotation (`token:...`), or reference-style links ([^token-1]) (iteration 30)
- Audit whether low-confidence tokens (cluster.ts confidence < 0.5) leak into gold-standard DESIGN.md examples — confirms the need for pre-render confidence gating in formatters.ts (iteration 30)
- Prototype formatters.ts against stripe/tokens.json — measure exact % of DESIGN.md lines replaced, end-to-end hex fidelity improvement, context-token reduction for agent consumers (iteration 31)
- Audit design_md_prompt_template.md for ALL clauses demanding content when data absent — catalog every 'must include' lacking ABSENT fallback (iteration 31)
- Implement coverage-election pre-gate in cluster.ts, run against gold-standard examples — quantify L2→L3 demotion count (iteration 31)
- A/B test evidence-gated philosophy prompt vs current mandatory prompt against same tokens.json — measure fabrication rate per section (iteration 31)
- Benchmark default-on interaction capture extraction time against real sites to confirm opt-out is viable for speed-critical runs (iteration 31)
- Design DTCG $description taxonomy per $type so auto-generated prose from $description fields is parameterized, not invented (iteration 31)
- Quantify: run the prevalence gate on a real 5-page extraction to measure how many colorMap entries it eliminates vs. how many system tokens it preserves (iteration 32)
- Gradient stops: extractGradientColors (cluster.ts:244-261) feeds colors into the same colorMap — should gradient-derived colors have a separate prevalence threshold since gradients inherently use unique stop colors? (iteration 32)
- Edge case: CSS-variable-defined colors (e.g., --gray-500: #646464) that appear on 1 page — should CSS var presence override the page-count gate? (iteration 32)
- deepen: extraction feasibility — can the DOM collector reliably decompose box-shadow strings into {color, offsetX, offsetY, blur, spread} given browser-computed style variations (rgba vs rgb vs hex, inset keyword, multiple shadows)? (iteration 33)
- deepen: author a ReferenceCompositeToken type that wraps a composite value + alias label + provenance (CSS variable or DOM source) as a generic pattern for TypographyRole, ColorRole, BorderToken, ShadowToken (iteration 33)
- deepen: format-spec impact — if tokens carry typed aliases, does design_md_format.md §2 color naming rule ('Descriptive brand-specific name, never Blue 1') change to 'Use CSS variable-derived role name when available; invent only when no variable exists'? (iteration 33)
- deepen: quantify fabrication reduction — count how many invented strings (role names, color names, personality sentences) per DESIGN.md section with current vs composite pipeline (iteration 33)
- Audit WRITE-phase prompt for all 'must include' clauses that lack 'when absent, stamp ABSENT' — cross-reference against iteration-029 items 4+7 (evidence-gating + confidence surfacing) (iteration 34)
- Prototype freshness stamp: run proof.ts on a gold-standard extraction (stripe), modify tokens.meta.freshness, re-run proof.ts after simulating site change — measure coverage delta threshold for STALE classification (iteration 34)
- Implement extractionCount in mergeTokenSets types + merge logic, run --merge-with against two sequential extractions of the same site to verify frequency accumulation correctness (iteration 34)
- Map the DTCG alias syntax ($value="{path.to.token}") to DESIGN.md citation anchors—how the validator verifies §3 table rows cite the correct TypographyLevel.id (iteration 35)
- Spec the DTCGView projection interface in types.ts—exact TypeScript types for the typed alias layer (iteration 35)
- Design the id generation algorithm: which canonical properties per token kind produce stable, collision-resistant hashes (iteration 35)
- Prototype the $type classifier for ShadowToken: parse 'rgba(0,0,0,0.04) 0px 1px 2px 0px' into {color, offsetX, offsetY, blur, spread} for auto-level-assignment (iteration 35)
- Verify that the cluster.ts duplicate a11y computation (lines 1547-1568) is genuinely dead — trace the call chain from extract.ts to confirm overwrite (iteration 36)
- Benchmark interaction-ON default against real-world sites (Vercel, Stripe) — confirm 30s/page budget holds (iteration 36)
- Audit design_md_prompt_template.md for ALL clauses demanding content when data absent — the plan identifies format spec mandates but the prompt template may have additional fabrication-forcing clauses (iteration 36)
- Prototype formatters.ts against stripe/tokens.json — the architecture claim that this works is currently unverified against real extracted tokens (iteration 36)
- Run deltaE threshold change against all 4 gold-standard examples + anobel — measure color palette delta before/after (iteration 36)
- Build a token-coverage audit: for each section, count how many claims have grounding tokens vs how many are pure inference (iteration 37)
- Implement the anti-fabrication ruleset as a validator that checks each section against its rules before publishing (iteration 37)
- Create a writer contract: for each section, define the exact prose template that enforces the grounding rules (e.g. §1 opening must embed 2+ tokens) (iteration 37)
- Catalog the specific banned comparative framings (the 'unlike most systems' corpus problem) and propose a grounded alternative template (iteration 37)
- Benchmark default-on interaction capture extraction time against real sites to confirm opt-out viability (iteration 38)
- Prototype formatters.ts against stripe/tokens.json — measure % of DESIGN.md lines replaced, hex fidelity improvement, context-token reduction (iteration 38)
- Design DTCG $description taxonomy per $type so auto-generated prose is parameterized not invented (iteration 38)
- iter-44: AUDIT UN-INSPECTED SCRIPTS — Audit icon-detect.ts, framework-detect.ts, dark-mode-detect.ts, and crawl.ts for the 'fabricated-default-on-empty-data' bug class (parallel to focus-indicator pattern). (iteration 39)
- iter-43: EMPIRICAL CLOSING WAVE PART 3 — A/B test evidence-gated vs mandatory-philosophy prompt on 2 examples. Implement+quantify coverage-election pre-gate against gold-standard tokens.json. (iteration 39)
- iter-40: EXECUTE PROMPT TEMPLATE ABSENT-FALLBACK AUDIT — the most-repeated open question. Read design_md_prompt_template.md line-by-line, catalog every 'must include' without fallback. Resolve §9 vs §6.5 demotion inconsistency. (iteration 39)
- iter-41: EMPIRICAL CLOSING WAVE PART 1 — Run deltaE<10 threshold change against all 4 gold-standard examples + anobel. Measure color token count delta + brand color loss. Update cluster.test.ts. (iteration 39)
- iter-42: EMPIRICAL CLOSING WAVE PART 2 — Prototype formatters.ts Phase A (§2 Colors + §3 Typography) against stripe/tokens.json. Measure auto-generated vs AI-written line ratio, value accuracy delta. (iteration 39)
- Add an ABSENT-stamp and inference-label validator to validate.ts (or a companion prose-fidelity check script) (iteration 40)
- Implement the cardinal-rules rewrite (Rules 7-10) into design_md_prompt_template.md and cardinal_rules_card.md, keeping cardinal_rules_card.md as the machine-readable mirror (iteration 40)
- Audit the EXTRACT-phase prompt template (extraction_prompt.md) for the same fabrication-gap classes (unconstrained prose, missing ABSENT stamps, unlabeled inference) (iteration 40)
- Dry-run the rewritten prompt against a deliberately gapped token set (e.g., zero motion, zero ARIA, only 3 colors) and measure section-level ABSENT stamp rate vs. invention rate (iteration 40)
- Check if icon-detect's colorMode:'mixed' on empty data has caused incorrect §12 Iconography output in existing DESIGN.md files (iteration 41)
- Audit motion-extract.ts (not in scope but same extraction pipeline) for the same pattern (iteration 41)
- Check report-gen.ts and the DESIGN.md template writer: how does it handle empty variableDiff when darkMode.supported is true? Does it fabricate palettes? (iteration 41)
- Verify whether the §2.5 dark-mode section in the actual DESIGN.md template has a conditional gate on variableDiff.length (iteration 41)
- Consider a unified 'no-data sentinel' type (e.g., { _empty: true }) across all extractors to prevent writers from inventing data (iteration 41)
- Check whether any existing examples (stripe/vercel/linear/supabase DESIGN.md files) contain fabricated values vs. their matching tokens.json — this quantifies the fabrication rate in the current manual pipeline. (iteration 42)
- Audit tool/resources/design_md_format.md for the v2 section specification — what are the exact 17 section names and their required fields? The prompt-builder hardcodes or reads these. (iteration 42)
- Trace how validate.ts's section-completeness check maps to DESIGN.md section names — does it validate by heading regex? This determines which section names the prompt-builder must emit. (iteration 42)
- Design the prompt-builder's output format: what does the constrained WRITE prompt look like (section-by-section mockup of pre-rendered tables + prose zones + DATA_AVAILABILITY blocks)? (iteration 42)
- Design the builder's integration with the existing TypeScript types (types.ts: DesignTokens) so it can consume tokens.json with full type safety. (iteration 42)
- Measure deltaE<10 vs <3 clustering on the same tokens (deferred — needs cluster.ts harness) (iteration 43)
- Benchmark interaction capture wall-clock time on 3 real-world sites (JS-heavy, CSS-heavy, static) to confirm 15s PAGE_TIMEOUT is sufficient (iteration 44)
- Verify that removing dead-code clusterTokens a11y (lines 1506-1568) doesn't break the mergeTokenSets path (cluster.ts:1648+) which may read a11yTokens from clusterTokens output (iteration 44)
- Cross-validate deltaE<8 on a golden dataset of 10 design systems to confirm no functional-color merge regressions (iteration 44)
- Verify classifyByTagRole parity with classifyComponent for ALL tag/role combos including implicit roles (a/button/input without role attr) (iteration 44)
- Red-team research.md itself; pre-mortem the Phase-1 ship; deltaE<3-vs-<10 empirical (deferred). (iteration 45)
- Calibrate the deltaE threshold claim: measure color-token counts before/after deltaE <3 vs <10 on the existing examples to quantify merge risk. (iteration 46)
- Verify the regression-guard claims: do the 4 gold-standard examples (Stripe, Vercel, Linear, Supabase) actually exist with tokens.json at the claimed paths in tool/examples/? (iteration 46)
- Verify the `interaction-capture.ts` componentType derivation path to confirm or refute the classifyComponent() attribution. (iteration 46)
- Test whether the 'ABSENT-stamp' pattern (proposed B6) is actually in the design_md_format.md §22 or whether §22 exists at all — the citation design_md_format.md §22 is unverified. (iteration 46)
- Enumerate the exact banned-adjective list and test against all 4 gold-standard DESIGN.md files for false positives (iteration 47)
- Prototype deltaE threshold at 5/7/10 and measure merge quality on Tailwind/Material/Vercel palettes (iteration 47)
- Run gold-standard extractions with interaction ON to measure actual time delta and token diff (iteration 47)
- Audit cluster.ts:1506-1568 dead-code a11y path — confirm extract.ts:469 overwrite covers all fields or delete the duplicate (iteration 47)
- Define the SectionDataMap type with exact DesignTokens dot-paths for each conditional section (iteration 47)
- Re-measure deltaE on the 4 gold-standard examples to set a defensible per-corpus threshold (future packet). (iteration 48)
- RESERVED: emergent angles/risks (permanently open). (iteration 49)
- Implementation is a separate future packet (this loop is research-only by design). (iteration 50)
- RESERVED: emergent angles/risks (permanently open — the loop ends by cap, not exhaustion). (iteration 50)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
RESERVED: emergent angles/risks (permanently open — the loop ends by cap, not exhaustion).

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Two confirmed hallucinations, root causes traced (planning phase):
- "focus indicator is consistent" -> `a11y-extract.ts:101-103 extractFocusIndicator` returns `{consistent:true}` when `focusStyles.length===0`; interaction capture is OFF by default (`extract.ts:81`, `--fast` forces off). Fabricated boolean laundered into prose by `design_md_format.md` §13.
- "gradient-as-depth replaces shadow elevation" -> actively SOLICITED by `writing_style_guide.md` §12/§16 (Named Principle Pattern) + `design_md_format.md` §9 (Depth & Elevation REQUIRES a named principle), with zero token-provenance binding.
- The validator (`validate.ts:318 validateDesignMd`) runs 6 checks (phantom-color, stability-gating, unknown-fonts, format-consistency, section-completeness, content) — NONE reads a prose sentence for truth. A fabricated interpretive claim with real hexes scores ~99 and PASSES.

Pipeline: EXTRACT (script -> tokens.json) -> WRITE (AI authors DESIGN.md) -> VALIDATE (validate.ts). Earlier this session: added `checkStabilityGating` (L4 hard-fail); 4 semantic errors + 1 prose hallucination found by independent review. Planning docs: `research-plan.md`, `planning/01-skill-angles-abc.md`, `planning/02-external-tools-d.md`, `planning/03-execution-recipe.md`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 50 (hard cap = only stop)
- Convergence threshold: 0 (disabled); stuckThreshold 999
- Executors: cli-opencode -> opencode-go/mimo-v2.5-pro + opencode-go/deepseek-v4-pro, both --variant high
- Track allocation: A ~10, B ~9, C ~8, D >=23 (>=20 required) external tools/repos
- Per-wave: <=3 concurrent CLI seats (launch-race ceiling); host writes all state; reduce-state per wave
- Progressive synthesis: true; research/research.md = workflow-owned canonical output
- Machine-owned sections: reducer controls 3, 6, 7-11A
- Pause sentinel: research/.deep-research-pause
- Monitoring: host checks seats ~every 3 min for stalls
- Started: 2026-06-22
