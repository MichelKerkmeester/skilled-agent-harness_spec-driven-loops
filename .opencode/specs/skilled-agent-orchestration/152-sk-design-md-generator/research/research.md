# Research: Hardening `sk-design-md-generator` Against Prose Fabrication

**Packet:** 152-sk-design-md-generator | **Status:** COMPLETE | **Iterations:** 24, 26–31, 36–38, 40, 42–43 (15 synthesized)

---

## 1. Executive Summary

The core defect: `validate.ts` awards 99/100 scores to DESIGN.md outputs containing wholesale prose fabrication. The validator performs 6 checks — phantom-color hex-tracing, stability-gating, unknown-font detection, format-consistency, section-header counting, and content presence — but **zero checks read a prose sentence against token ground truth** (`validate.ts:318-350`). A doc scoring 99/100 can contain "A sleek, modern design with elegant depth principles" — none of which has corresponding fields in `tokens.json` (`iter-026:#6`).

The root cause is a double hallucination engine: **(1) extraction bugs** that return fabricated defaults (focus `consistent:true` on empty data at `a11y-extract.ts:101-103`, interaction pipeline gated OFF at `extract.ts:81`, `extractA11yAsync` dead code, deltaE clustering 10× too tight at `cluster.ts:708`); and **(2) structural fabrication mandates** in the format spec, style guide, and prompt template that REQUIRE content (named principles, comparative framing, motion philosophy) without evidence gates or ABSENT-stamp fallbacks.

**Empirical confirmation** (`iter-043`): on the real anobel `tokens.json`, `§6 Shadows = 0 tokens` and `§9 focusIndicator.style = {}` — the exact empty/thin sections where the known hallucinations ("gradient-as-depth," "focus indicators are consistent") occurred. The one section with an existing absence-gate (`§2.5 DarkMode`, gated on `darkMode.supported===true`) correctly produced no invention.

The headline fix is a phased **minimal-viable hardening** (~550 LOC, corrected from the overclaimed ~335 per `iter-036:#1`) that **substantially reduces** both hallucination classes — value fabrication is fixed at the extraction layer (focus/interaction/clustering bugs), prose fabrication is structurally reduced (mandates removed + evidence gates) though not fully eliminated until the full architecture's citation gating (see §7) — followed by an optional **full doc-as-view architecture** (~1200+ LOC) that structurally eliminates the LLM from value-table generation via deterministic `formatters.ts`.

---

## 2. Problem & Root Causes

### 2.1 Hallucination Class 1: Value Fabrication (Extraction Bugs)

**F1. Focus-indicator returns `consistent:true` on empty data** — `a11y-extract.ts:101-103`:
```ts
if (focusStyles.length === 0) { return { style: {}, consistent: true }; }
```
Interaction capture is OFF by default (`extract.ts:81 noInteraction=true`), so `focusStyles` is always empty. The returned `consistent:true` is indistinguishable from legitimately-observed consistency. The AI reads this as confirmation and fabricates focus-indicator prose for §9. **Verdict: REAL** (`iter-024:#2`, `iter-036:#2`).

**F2. Interaction pipeline broken at two points** — (a) `extract.ts:81` defaults `noInteraction=true`, gating `captureInteractions` entirely. (b) When opt-in via `--with-interaction`, `cluster.ts:1294` builds lookup key with `el.tag` ('a'/'div') while `interactionLookup` at line 1288 uses `classifyComponent()` output ('link'/'button') — the keys never match for `<a>` tags and role-based components. Combined: §11 State Matrix (5 state columns × all components → entirely fabricated), §4 Component Stylings (hover/focus/active/disabled → all null), §9 Focus Indicators (style always `{}`). **Verdict: REAL** (`iter-027:#1`, `iter-036:#10`).

**F3. `extractA11yAsync` dead code** — `extractA11yAsync` at `a11y-extract.ts:361-391` returns `tabOrder`, `langAttribute`, `skipLinkDetected`, `altTextCoverage` but is never imported (`extract.ts:19` lists only `extractA11y`) and never called. Only sync `extractA11y` runs at `extract.ts:445`. Additionally, `cssAnalyses` is not passed as 3rd arg, so `reducedMotionSupport` is always undefined. Net: 5 §9 fields always null + §6.5 motion starved. Cluster also contains dead-code a11y duplicate at `cluster.ts:1506-1568` that is overwritten at `extract.ts:469`. **Verdict: REAL** (`iter-027:#2`, `iter-036:#3`).

**F4. DeltaE clustering threshold ~10× too tight** — `cluster.ts:708`: `deltaE(color.oklch, existing.oklch) < 3` with ×100 OKLCH scaling → perceptual threshold ≈0.03, far tighter than human visual threshold. Brand colors like `#3B82F6` and `#60A5FA` (ΔE≈8.1) do NOT merge. Greedy single-pass at `cluster.ts:703-724` commits to first match with no recentering. Per-page frequency division at `cluster.ts:741` (`Math.round(c.frequency / c.pages.size)`) flattens frequency. Net: brand colors split into L4 content-tier and excluded from DESIGN.md — AI invents missing colors. Same threshold bug also at merge path `cluster.ts:1664`. **Verdict: REAL** (`iter-027:#3`, `iter-036:#4`).

### 2.2 Hallucination Class 2: Prose Fabrication (Structural Mandates)

**P1. Validator has zero prose-level checks** — All 6 `validate.ts` checks (`validate.ts:318-350`) are string/hex mechanical: `checkPhantomColors` (hex-tracing), `checkStabilityGating` (L4 color exclusion), `checkUnknownFonts` (font-name tracing), `checkFormatConsistency` (hex-case/weight format), `checkSectionCompleteness` (heading-count), `checkContent` (table presence + color count). NONE reads a prose sentence against token ground truth. A doc scoring 99/100 can be full of "A sleek, modern design with elegant depth principles" — 17 banned adjectives from `quality_checklist.md` DQ-01 and `anti_patterns.md` AP-02 have zero code enforcement (`iter-026:#6`).

**P2. Section completeness is header-only, not data-driven** — `checkSectionCompleteness` at `validate.ts:241-285` enforces 15 v2 section headers via pure string-matching (`mdLower.includes(section.toLowerCase())`) with zero token-data inspection. `design_md_format.md:27-48` marks 15 sections as required 'yes'. Gold-standard audit (`iter-024:#5`): Vercel outputs 10 sections, Stripe 9, Linear 9, Supabase ~9 — the validator demands 15. Five sections (§0 Brand Context, §7 Content & Voice, §11 State Matrix, §12 Iconography, §9 Accessibility) have zero or near-zero backing tokens in typical extractions. The header-enforced requirement forces AI fabrication for data-poor sections.

**P3. Named principles required without evidence gate** — `design_md_format.md §9:544` REQUIRES a named depth principle with "(or a custom name)" escape hatch. `writing_style_guide.md §16+§12` pattern-train technique-as-metaphor names. When `tokens.gradients[]` or `tokens.shadowTokens[]` are empty, the AI invents "gradient-as-depth" from nothing. `design_md_format.md §1:122-128` similarly requires 2-4 named design principles. **Verdict: SCOPED** — evidence-backed principles (e.g., "shadow-as-border" with real frequency data) are high-value prose; fix is evidence-gating, not abolition (`iter-024:#3`, `iter-026:#5`).

**P4. Comparative framing mandate fabricates external claims** — `design_md_format.md §3.4:130` and `writing_style_guide.md §15:534-586` REQUIRE at least one comparative sentence ("Unlike most systems...," "Where others..."). `tokens.json` contains zero data about other design systems — every such claim is fabricated. The §15 GOOD examples themselves model fabrication ("Where most systems use neutral gray shadows") (`iter-026:#4`).

**P5. Motion fallback intermixes observation with invention** — `design_md_format.md §10:586-592` provides fallback prose that blends factual observation ("No transitions detected") with unsolicited recommendation ("consider adding 150ms ease for hover states") — the 150ms/300ms values are fabricated from zero data. This is the template-level root cause of interpretive fabrication (`iter-026:#10`).

**P6. Style-guide vs. format-spec contradiction** — `writing_style_guide.md §10:347` states "A paragraph with zero values is an opinion" — prose without measurable values should be deleted. The format spec simultaneously MANDATES philosophy paragraphs (§9 Depth, §10 Motion, §1 named principles) that routinely contain zero token-extractable values. Both docs are ALWAYS-loaded — the AI receives conflicting instructions simultaneously (`iter-028:#8`).

**P7. `cardinal_rules_card.md` not loaded as pre-write gate** — Documented as "a pre-validate self-check" at `SKILL.md §5:341` but ABSENT from §2 Resource Loading Levels table (`SKILL.md:99-107`). Not loaded under ANY tier. The prompt template inlines six cardinal rules manually, duplicating from the card — three copies of rules with no single source of truth (`iter-026:#11`).

**P8. No WRITE-phase prompt-builder exists** — The WRITE phase is fully manual. No script in `tool/scripts/` builds a constrained prompt from `tokens.json`. The agent receives the raw `DesignTokens` object (~15 nested sections with L1-L4 tokens mixed together) as an unprocessed JSON blob. The cardinal rules at `design_md_prompt_template.md:41-52` are declarative text — they are a wish, not a structural constraint. Fabrication enters at five surfaces: (1) model must navigate raw JSON to find per-section values, (2) must filter by stability class manually, (3) empty conditional sections expressed as boolean/null with no ABSENT signal, (4) no upfront structural guard (validate.ts runs post-hoc), (5) prompt template is a human-filled copy-paste artifact with placeholder slots (`iter-042:#1,#2,#5,#6`).

### 2.3 The Validator's Prose-Blindness

`validate.ts` checks 6 mechanical properties (`validate.ts:318-350`). The scoring at `validate.ts:347` produces a single score conflating value fidelity with prose provenance. A doc with all real hexes but full fabricated prose scores 99/100. Prose fabrication is not just undetected — it is **structurally invisible** to the existing validation infrastructure.

### 2.4 Empirical Confirmation

**Empty sections = invention sites** (`iter-043`). On the real anobel `tokens.json`:

| Section | Tokens | Status | Hallucination Confirmed |
|---------|--------|--------|------------------------|
| §6 Shadows | 0 | EMPTY | "gradient-as-depth" fabricated |
| §9 focusIndicator | style=`{}` | THIN | "focus is consistent" fabricated |
| §2.5 DarkMode | 0 | EMPTY + gate | **Correctly omitted** (proof of concept) |

The one section with an existing absence-gate (`§2.5`, gated on `darkMode.supported===true`) produced **no invention**. Generalizing this gate to §6/§9/§6.5 is empirically validated, not speculative.

Full coverage map: populated sections (§2 15 colors, §3 11 type levels, §4 10 variants, §9 29 contrast pairs, §10 16 breakpoints, §11 34 interactions, §12 535 icons, §17 1245 CSS vars, Radii 11, Gradients 6, Motion 4 durations/4 keyframes, Spacing 5) did NOT fabricate. Only the empty/thin ones did.

---

## 3. Prioritized Recommendations

### TIER-1: Slam-Dunk, Low-Risk (Implement Immediately)

| # | File:Line(s) | Change | What It Fixes | Verdict |
|---|-------------|--------|---------------|---------|
| **A1** | `a11y-extract.ts:101-103` + `extract.ts:81` + `cluster.ts:1294` + `validate.ts:318-350` | Return `{captured:false}` on empty `focusStyles`; flip `noInteraction` default `true→false`; fix `findInteraction` key to use `classifyComponent()`; add `checkA11yFocusProvidence` gate | §9 focus hallucination ("focus indicators are consistent") — confirmed REAL bug | SOUND (`iter-036:#2`) |
| **A2** | `extract.ts:19,303-336,445` + `cluster.ts:1506-1568` | Import+call `extractA11yAsync` per-page; pass `cssAnalyses` as 3rd arg; delete dead-code a11y duplicate | 5 §9 fields (`tabOrder`, `langAttribute`, `skipLinkDetected`, `altTextCoverage`, `reducedMotionSupport`) always null | SOUND (`iter-036:#3`) |
| **A3** (corrected) | `cluster.ts:569` (pre-gate) + `cluster.ts:741,703-724` | **Add coverage-election pre-gate (`pagesCoverage<0.3 → cap L3`) as the primary L4-leak fix** (SOUND/additive, `iter-044`); fix per-page frequency division. **Do NOT blanket-raise deltaE `<3→<10`** — empirically over-merges 9 distinct-color pairs on anobel incl. the two brand navies `#06458c`/`#043367` (`iter-048`); change deltaE only via per-corpus calibration. | L4 one-off colors leak to L2 (the `#646464` case) — fixed by the coverage gate, not by loosening deltaE | **TIER-2 / SCOPED** — coverage-gate SOUND; deltaE-raise REFUTED by measurement (`iter-044`, `iter-048`) |
| **B1** | `validate.ts:241-285` + `design_md_format.md:27-48` | Demote §0/§7/§11/§12 to `Required: conditional(data-driven)`; §6.5 conditional on motion data; §9 conditional on a11y data | Structural fabrication pressure for 5 data-poor sections — **SINGLE HIGHEST-LEVERAGE change** (~40 LOC) | SOUND (`iter-036:#5`) |
| **B2** | `anti_patterns.md` (append) + `SKILL.md §4:297-304` | Add AP-29 "Interpretive Fabrication" + rescope AP-25/AP-26; add NEVER rule #6 prohibiting qualitative fabrication without token traceability | No existing anti-pattern covers asserting design relationships, causal explanations, or philosophical meaning not in tokens.json | SOUND (`iter-028:#2,#3`) |
| **B3** | `design_md_format.md §3.4:130` + `writing_style_guide.md §15:534-586` | Remove comparative-framing mandate; replace with intra-system comparison pattern ("Unlike [element A] (value X), [element B] uses Y") | Every "Unlike most systems..." claim is fabricated from LLM training data, not extraction | SOUND (`iter-026:#4`) |
| **B4** | `design_md_format.md §9:544` + `design_md_prompt_template.md` | Change unconditional "Named principle" to `REQUIRED ONLY when ≥3 shadow/gradient/depth tokens exist across ≥2 crawled pages. When absent, stamp ABSENT`; apply same to §1 and §3 | Named principles invented from zero data ("gradient-as-depth") | SOUND, evidence-backed principles preserved (`iter-024:#3`) |
| **B5** | `design_md_format.md §10:586-592` + `design_md_prompt_template.md` | Replace blended fallback with hard-labeled `OBSERVED:` / `RECOMMENDED:` blocks + mandatory "NOT measured from source" disclaimer | Motion fallback intermixes observation with fabricated advice (150ms/300ms values) | SOUND (`iter-026:#10`) |
| **B6** | `SKILL.md §4:305-311` + `design_md_format.md §22` + `design_md_prompt_template.md` | Add ESCALATE IF item 6 for zero-data sections; add ABSENT-stamp sub-rule; add ABSENT-stamp rule to prompt template | No supported output path for "I have no data for this required section" — model fabricates because that path doesn't exist | SOUND (`iter-028:#5`) |
| **B7** | `SKILL.md §2:103,132` + `design_md_prompt_template.md:39` | Add `cardinal_rules_card.md` to ALWAYS row and EXTRACT_WRITE array; insert authoritative reference in prompt template before inline rules | Cardinal rules doc not loaded under ANY tier; three copies of rules with no single source of truth | SOUND (`iter-026:#11`) |
| **B8** | `writing_style_guide.md §10:347` | Add exception clause: "Required philosophy/narrative sections use an EVIDENCE-BACKED test instead — each claim must cite ≥1 specific token key" | Direct contradiction between style guide (zero-value paragraphs = opinion → delete) and format spec (mandatory philosophy paragraphs) | SOUND (`iter-028:#8`) |
| **B9** | `validate.ts` (new function) | `checkSectionCoverage()`: map each of 17 sections to its `DesignTokens` backing fields; output `SectionCoverageReport` with per-section token count, isEmpty, inventionRisk | All section starvation is mechanically undetectable — no tool can confirm which sections have empty backing data | SOUND (`iter-027:#4`) |

### TIER-2: Scoped, Medium-Effort

| # | Change | What It Fixes |
|---|--------|---------------|
| **C1** | `validate.ts` — `checkProseDiscipline(md)`: scan for BANNED_ADJECTIVES with ±50 char numeric-anchor suppression; WARNING-tier (weight 1pt) only | 17+ banned adjectives with zero code enforcement; numeric-anchor suppression prevents false positives on value-bound prose |
| **C2** | `design_md_prompt_template.md` — insert SELF-REVIEW step: classify each sentence as ANCHORED (token value present) or INTERPRETIVE, require zero INTERPRETIVE before validation | No sentence-level anchoring audit exists between WRITE and VALIDATE |
| **C3** | `validate.ts:100-123` + `types.ts:394` — extend stability gating to non-color tokens: `checkShadowStabilityGating`, `checkGradientStabilityGating`, `checkComponentStabilityGating`; add `stability` field to gradients | ShadowToken/RadiusToken/ComponentGroup/TypographyLevel/Gradients all un-gated — L4 content-tier shadows/radii pass validation |
| **C4** | `validate.ts` — `checkSourceSentinels(md,tokens)`: parse `<!-- source: tokens.<path> -->` HTML comments from raw MD, resolve dotted paths against `DesignTokens`, verify non-empty/non-null; WARNING-tier | No mechanism traces prose claims to token entries; `stripHtmlComments()` already exists at `validate.ts:51-53` |
| **C5** | `writing_style_guide.md` — prepend FABRICATION GATE preamble before §15:529: "ALL named principles, comparative framing claims, intent narratives in §§15-18 are guidance for WHEN evidence exists. They MUST cite ≥1 specific token key" | §§15-18 (Comparative Framing, Named Principle, Frequency Interpretation, Intent Narration) actively solicit interpretive invention beyond tokens.json |
| **C6** | `cluster.ts:400-435` — increase frequency range ±20→±40; add content-signal detector; gate CSS var bonus behind freq≥20; cap L3 when pagesCoverage<0.2 | Single-page content-derived colors reach L2 via CSS var +20/text+border +25 alone |
| **C7** | `cluster.ts:1234-1257` — fix `classifyVariant`: remove fallthrough `return 'Primary'`; add Outline/Tertiary/Link branches; replace hard RGB Destructive heuristic with OKLCH hue range + semantic check | Default-to-Primary masks real variant diversity; hard RGB check false-positives when red IS brand color |
| **C8** | `cluster.ts:1191,1204-1214` — relax Badge geometric thresholds (add `radiusPx>height*0.3` path); relax Card thresholds (lower width floor to 120, padding to 6, childrenCount to ≥1) | Badge misses radius8-24px; Card misses single-child pattern (most common) |
| **C9** | `cluster.ts:374-396,1047-1072` — delete inline `classifyShadow` duplicate; call exported version from `clusterTokens` | Duplicated function with drift risk (26 LOC dead code) |
| **C10** | `a11y-extract.ts:306-338` — add visibility guards: skip elements with `display:none`, `visibility:hidden`, `opacity:0`, off-screen position; for `minFontSize`, skip <8px without `aria-label` | Hidden-element skew in minTouchTarget/minFontSize producing WCAG false violations |
| **C11** | `extract.ts:439` — merge all `cssAnalyses` before passing to `extractMotion` (currently only `cssAnalyses[0]`) | Multi-page sites: keyframes/transitions from pages 2+ silently discarded |
| **C12** | `cluster.ts:799` — raise contrast-pair cap `.slice(0,20)→.slice(0,50)`; lower freq floor `≥5→≥3`; or swap §9 source to uncapped `a11y-extract.ts:265-304` DOM-derived pairs | Lower-frequency semantically important text-on-bg pairs excluded from §2 colorRelationships |

### TIER-3: Defer (Architectural / High-Effort)

| # | Change | Rationale for Deferral |
|---|--------|----------------------|
| **D1** | Full `formatters.ts` (all class-(a) sections) + DTCG-typed `tokens.json` + citation gating + `tokens.css` emission + structured summaries (~600 LOC) | Requires Phase 1-3 extraction stability; Phase A (§2+§3 only, ~200 LOC) can ship independently |
| **D2** | DTCG `$type`/`$value` migration (native `tokens.json`) | Does NOT directly fix prose fabrication — prose claims like "gradient creates atmospheric depth" are a prompt/writer discipline issue, not a type system issue (`iter-024:#4`). HIGH disruption (~200 LOC + breaking change). Phase as parallel `tokens.dtcg.json` first. |
| **D3** | Multi-viewport DOM re-extraction for breakpoint keyChanges | Extraction runs single 1440px viewport (`extract.ts:298`); §10 Collapsing Strategy claims about pixel transitions across breakpoints are entirely fabricated. Requires new extraction capability. |
| **D4** | Gradient structural decomposition (`GradientToken` with decomposed `stops[]`) | Current `GradientInfo` stores only raw CSS strings (`types.ts:124-130`); §6 depth claims require parsed gradient data. |
| **D5** | CIEDE2000 contrast + nearest-compliant-shade remediation | Complementary to WCAG; Stark-style OKLCh lightness binary search for auto-remediation. |
| **D6** | Dual-score split: `valuesScore` (mechanical) + `claimsScore` (prose quality) | Valuable but adds complexity — defer until prose checks (C1-C4) are implemented (`iter-026:#14`). |
| **D7** | §0/§1/§7/§8 architectural gaps — new extraction capabilities for brand context, visual theme, content & voice, do's and don'ts | These sections require semantic/interpretive data (adjectives, tone descriptors) but `DesignTokens` has no corresponding fields (`iter-027:#14`). |

---

## 4. External-Tool Borrow List

### ADOPT-NOW (TIER-1 / Low Cost)

| # | Source Tool | Technique | Adoption | Adoption Cost |
|---|------------|-----------|----------|---------------|
| 1 | **Open Design** (9-section schema) | Data-driven section requirements: sections only required when backing tokens exist; ABSENT-stamp when missing | `validate.ts:241` — make section requirements conditional; `design_md_format.md §1` table — demote §0/§7/§11/§12 to conditional | ~40 LOC |
| 2 | **design-extract** (Manavarya09, 3.3k stars) | Coverage-based token election: pagesCoverage < 0.3 → cap at L3 as hard pre-gate before stability classification | `cluster.ts:569` — additive pre-gate; fix single-page coverage inflation | ~25 LOC |
| 3 | **Diez DocsGen / Supernova / Backlight / Zeroheight / Knapsack / Style Dictionary** | Deterministic value-table rendering: tables generated from typed tokens with zero AI involvement | `formatters.ts` — `formatColorTable()`, `formatTypographyTable()`; Phase A (§2+§3 only) | ~200 LOC (Phase A) |
| 4 | **Zeroheight** | Cite-the-token guardrail: every prose claim references its source token | `validate.ts` — `checkSourceSentinels()` parsing `<!-- source: tokens.<path> -->` HTML comments; `stripHtmlComments()` already exists | ~30 LOC |
| 5 | **CSS Stats** (project-wallace hybrid) | Resolved CSS variable values via `getComputedStyle` + occurrence-band pre-clustering: partition colors by frequency percentile, then perceptual-cluster within bands | `dom-collector.ts` — add resolution pass; `cluster.ts:574-724` — pre-partition into frequency bands | ~70 LOC |

### SCOPED (TIER-2 / Medium Cost)

| # | Source Tool | Technique | Adoption Cost |
|---|------------|-----------|---------------|
| 6 | **Token Studio / Style Dictionary CTI** | Deterministic role assignment (`classifyColorRole`): rank by usage-as dimension dominance; CSS variable name match overrides | ~80 LOC in `cluster.ts` |
| 7 | **Locofy / Builder.io** | Semantic component tagging: className/ARIA role pre-pass before geometric fallback | ~30 LOC in `cluster.ts §7` |
| 8 | **extract-design-system** (arvindrk) | Dual-output pattern: `tokens.css` as `:root{}` CSS custom properties block alongside `tokens.json` | ~50 LOC in `emit-css.ts` |
| 9 | **Specify SDTF / DTCG $ref** | Semantic aliasing with CSS-variable provenance: `aliases[text.primary] = {$ref: '#/colorTokens/hex:...', provenance: '--color-text-primary'}` | ~60 LOC in `cluster.ts` |
| 10 | **MiroMiro** | Element-level selectorAnchors on tokens: `selectorAnchors: string[]` capped at 5 per token | ~20 LOC in `cluster.ts addColor()` |
| 11 | **get-custom-properties-style** | Role-typed CSS variable dedup: prefix-grouped extraction (`--color-*`, `--spacing-*`, `--font-*`); remove `:root`-only scope | ~50 LOC in `dom-collector.ts:105-143` |
| 12 | **a11y-extract.ts internal** (already written) | Real DOM contrast pairs replacing synthetic cross-product: swap §9 source from `cluster.ts colorRelationships` to `a11yTokens.contrastPairs` | ~10 LOC (source swap) |

### DEFER (TIER-3 / High Cost or Low Anti-Fabrication ROI)

| # | Source Tool | Technique | Reason for Deferral |
|---|------------|-----------|---------------------|
| 13 | **W3C DTCG 2025.10 / Style Dictionary v4 / Tokens Studio** | `$type`/`$value` typed token schema | Does NOT fix prose fabrication; HIGH disruption (~200 LOC + breaking change). Phase as parallel `tokens.dtcg.json` first (`iter-024:#4`). |
| 14 | **Polypane / axe-core / Contrast** | CIEDE2000 contrast alongside WCAG ratio | Complementary metric, not anti-fabrication. ~30 LOC in `css-analyzer.ts`. |
| 15 | **Supernova AGENT-READY MCP** | MCP token endpoint for structured agent queries | CLI fallback (`query-token.ts`) gives 80% of value. ~80 LOC. |
| 16 | **StyleSniff** | Structural-region confidence boost: +15 score if ≥80% source elements in nav/header/footer | ~10 LOC in `classifyColorStability`. Low impact. |

---

## 5. Target Architecture

### Doc-as-View: Invert the Artifact Hierarchy

The target architecture makes `tokens.json` (with DTCG-typed spine) the **primary deliverable** and DESIGN.md a **deterministic render** where all value-bearing sections are auto-generated from typed tokens with zero AI involvement.

### Three-Class Section Partition (`iter-030:#1`, `iter-040`)

**Class (a) — DETERMINISTIC** (zero AI, `formatters.ts` auto-renders):
§2 Colors, §2.5 Dark Mode, §3 Typography, §5 Spacing+Radii, §6 Shadow table, §6.5 Duration/Easing tables, §9 Contrast table, §10 Breakpoints, §12 Icon sizing, §17 Token Dictionary. Every value in these sections has a `tokens.json` row. This removes the LLM from the primary hallucination surface for `fontSize`/`fontWeight`/`lineHeight`/`shadow`/`radius` fabrication that `validate.ts` currently cannot catch (only hex values are checked at `validate.ts:57-93`).

**Class (b) — GROUNDED-ANNOTATION** (value table + token-cited AI notes, ≥1 citation per line):
§4 Component Stylings, §5 Whitespace Philosophy, §6 Named Principle, §6.5 Motion Philosophy+Choreography, §8 Do's/Don'ts, §11 State Matrix. AI writes 1-line annotations that MUST cite token values.

**Class (c) — BOUNDED-PROSE** (labeled `[INFERRED]`, ≥2 citations per paragraph):
§0 Brand Context, §1 Visual Theme, §7 Content & Voice, §13 Prompt Guide, §14-16. AI prose marked `[INFERRED]` with each paragraph citing ≥2 token values.

### Deterministic Renderer Pipeline (`iter-030:#2`, `iter-042`)

1. **`formatters.ts`** — reads `tokens.json` (post-cluster, post-DTCG-wrap), emits markdown for all class-(a) sections. Runs BEFORE the AI WRITE phase as a pre-generation step. Types: `formatColorTable()`, `formatTypographyTable()`, `formatShadowTable()`, `formatSpacingTable()`, `formatRadiusTable()`, `formatDarkModeSection()`, `formatMotionTable()`, `formatContrastTable()`, `formatBreakpointTable()`, `formatIconTable()`, `formatTokenDictionary()`.
2. **Prompt-builder** (`build-write-prompt.ts`) — replaces the manual copy-paste template at `design_md_prompt_template.md`. Reads tokens.json + format spec → pre-renders deterministic tables → injects explicit `DATA_AVAILABILITY` markers (PRESENT/ABSENT/EMPTY) for conditional sections → pre-filters by stability class → outputs constrained WRITE prompt with prose zones.
3. **AI WRITE phase** — receives pre-rendered tables + constrained prompt; contractually forbidden from modifying class-(a) sections; writes only class-(b) annotation lines and class-(c) prose.
4. **`validate.ts` upgraded** — full gate chain: (1) pre-render filter (L1/L2 only), (2) hex check (`checkPhantomColors`), (3) format check, (4) citation check (`checkCitationGating`: parse `[token: <path>, <src-section>]` markers), (5) section completeness (three-tier: always/conditional/optional), (6) non-color stability gating.

### Typed Token Spine (DTCG)

`tokens.json` migrated to W3C DTCG 2025.10 format with `$type`/`$value`/`$description` per token enabling: (a) type-gated validation — `validate.ts` can verify values for `$type=duration`, `$type=dimension`, not just `$type=color`; (b) `$description` fields provide prose anchors for class-(b) annotations and class-(c) claims; (c) downstream interop with Style Dictionary, Terrazzo, Theo. Phased: parallel `tokens.dtcg.json` first, native migration once ecosystem adopts.

### Migration Path

- **Phase A (Minimal Viable, ~550 LOC):** formatters.ts for §2+§3 only (~200 LOC) + extraction fixes (~195 LOC) + doc/prompt/validator fixes (~155 LOC). Kills ~60% of value-fabrication surface.
- **Phase B (Full Architecture, ~1200+ LOC):** all class-(a) formatters + DTCG-typed tokens.json + complete citation gating + tokens.css emission + structured summaries. Depends on Phase A validation.

---

## 6. Implementation Plan

### Ship Order (`iter-038`)

**Phase 1: Extraction Data Fixes** (~195 LOC, SHIP FIRST — all downstream fixes depend on accurate tokens)

| Task | Files | LOC | Deps |
|------|-------|-----|------|
| T1 | Focus-indicator + interaction pipeline fix | `a11y-extract.ts:101-103`, `extract.ts:81,118`, `cluster.ts:1294,1298`, `validate.ts:318-350` | ~95 | None |
| T2 | `extractA11yAsync` dead-code wiring | `extract.ts:19,303-336,445` | ~30 | None |
| T3 | DeltaE clustering threshold + coverage pre-gate | `cluster.ts:708,1664,741,703-724,569` | ~50 | None |
| T4 | Interaction default-ON (subsumed in T1) | `extract.ts:81`, `cluster.ts:1294` | ~10 | T1 |
| T5 | Contrast-pairs cap lift | `cluster.ts:799` | ~15 | None |

**Phase 2: Doc/Prompt/Routing Fixes** (~155 LOC, SHIP SECOND — structural removal of fabrication mandates)

| Task | Files | LOC | Deps |
|------|-------|-----|------|
| T6 | Section requirements data-driven (17→10+5) | `validate.ts:241-285`, `design_md_format.md:27-48` | ~45 | T7 |
| T7 | Section coverage map (token→section detection) | `validate.ts` (new `checkSectionCoverage`) | ~60 | None |
| T8 | AP-29 + NEVER-QUALITATIVE | `anti_patterns.md`, `SKILL.md §4` | ~15 | None |
| T9 | Comparative framing mandate removal | `design_md_format.md §3.4:130`, `writing_style_guide.md §15` | ~15 | None |
| T10 | Named-principle conditional on evidence | `design_md_format.md §9:544`, `design_md_prompt_template.md` | ~30 | T1+T2 |
| T11 | Motion fallback OBSERVED/RECOMMENDED | `design_md_format.md §10:586-592` | ~10 | None |
| T12 | ABSENT-stamp + ESCALATE-IF | `SKILL.md §4`, `design_md_format.md §22`, `design_md_prompt_template.md` | ~25 | T8+T10 |
| T13 | Style-guide/format-spec contradiction | `writing_style_guide.md §10:347` | ~5 | T8+T12 |
| T14 | Cardinal-rules-card as pre-write gate | `SKILL.md §2:103,132`, `design_md_prompt_template.md:39` | ~5 | None |

**Phase 3: Validator Semantic Checks** (~220 LOC, SHIP THIRD — only meaningful after extraction is accurate and mandates are removed)

| Task | Files | LOC | Deps |
|------|-------|-----|------|
| T15 | Prose checks (banned adjectives + self-review) | `validate.ts`, `design_md_prompt_template.md` | ~80 | None |
| T16 | Stability gating extend to non-color tokens | `validate.ts:100-123`, `types.ts:394` | ~50 | None |
| T17 | Source-sentinels provenance check | `validate.ts` | ~30 | None |

**Phase 4: Doc-as-View Architecture** (~600 LOC, OPTIONAL/FUTURE — implement after Phase 1-3 stabilize)

| Task | Files | LOC | Deps |
|------|-------|-----|------|
| T22 | Deterministic formatters.ts (Phase A: §2+§3) | `formatters.ts` (new) | ~200 | T1-T5, T3 |
| T23 | Citation-gating validator | `validate.ts` (new `checkCitationGating`) | ~80 | T22 |
| T24 | DTCG parallel output (`tokens.dtcg.json`) | `dtcg-wrap.ts` (new) | ~200 | T3 |
| T25 | `tokens.css` emission | `emit-css.ts` (new) | ~50 | T3 |

### LOC Corrected to ~550 (`iter-036:#1`)

The original ~335 LOC claim was over-counted by ~64% when individual item estimates are summed: 95+30+25+40+15+30+80+50+30+10+15+10+25+5+5+60+25 = **550 LOC**. Realistic scope for the listed changes: ~430–550 LOC (±50). The Phase 4 doc-as-view architecture adds ~600 LOC.

### Regression Guards

1. **DeltaE threshold change**: Before deploying, run against all 4 gold-standard examples (Vercel, Stripe, Linear, Supabase) + anobel — measure change in color token count and any loss of visually distinct brand colors. Update `cluster.test.ts:152-180` with new threshold and add regression tests for known distinct pairs (`iter-036:#9`).
2. **Coverage election pre-gate**: Log L2→L3 demotions in extraction report for user audit.
3. **Interaction default-ON**: `PAGE_TIMEOUT=30s` at `interaction-capture.ts:52` hard-caps per-page cost (NOT ~5min as the plan overclaimed). Worst case: 8 pages × 30s = 4min total. Add `--fast-no-interaction` opt-out (`iter-036:#7`).
4. **Anobel**: Explicitly test before final sign-off — already verified as the empirical ground-truth site (`iter-043`).
5. **Format spec changes** (comparative framing removal, named-principle conditional, motion OBSERVED/RECOMMENDED, ABSENT-stamp, section demotion): **zero regression risk** — they REMOVE fabrication mandates, not data processing logic (`iter-036:#9`).

---

## 7. Open Questions / Accept-Open

### Deferred Architectural Work

1. **Full doc-as-view Phase B** (DTCG native migration, complete formatters.ts, citation gating, tokens.css) — deferred until Phase 1-3 extraction and validator fixes are verified against all 4 gold-standard examples. Phase A (§2+§3 only) can ship independently.
2. **Multi-viewport DOM re-extraction** for §10 breakpoint `keyChanges` — requires new extraction capability (resize viewport, re-collect DOM, diff element positions/sizes). Too heavy for minimal-viable scope.
3. **Gradient structural decomposition** (`GradientToken` with decomposed `stops[]`) — current raw CSS string storage is insufficient for §6 depth claims. Requires regex parser and schema change.
4. **§0/§1/§7/§8 architectural gaps** — these sections require semantic/interpretive data (adjectives, tone descriptors, semantic rules) that `DesignTokens` has no fields for. New extraction capabilities needed.

### Accept-Open Design Decisions

5. **Citation gating proves provenance, not truth** — `checkCitationGating` verifies that `[token: <path>]` markers resolve to real tokens in `tokens.json`, but cannot verify the truth of the AI's interpretive claim about the token (e.g., "the gradient creates atmospheric depth [token: gradients[2].value]" — citation proves the gradient exists, not that it creates depth). Class-(b) and class-(c) sections carry `[INFERRED]` labels; downstream consumers should treat them as AI interpretations. Named-principle classification (`design_md_format.md:544`) requires AI pattern judgment — consider making `formatters.ts` pre-compute candidate principle names from token patterns as constrained options (`iter-036:#8`).
6. **SELF-REVIEW step reliability** — the single-pass LLM classifying its own sentences as ANCHORED/INTERPRETIVE has low reliability without an adversarial second pass. The structural approach (citation-counting via `checkCitationGating`) is mechanically checkable and preferred over relying on LLM self-honesty (`iter-036:#6`).
7. **Banned-adjective lists are inherently brittle** — words like "robust" and "clean" have legitimate non-fabrication uses. MUST be WARNING-tier only (weight ≤1pt), never hard-failure. Numeric-anchor suppression (±50 chars) mitigates but doesn't eliminate false positives (`iter-024:#1`).
8. **DTCG does not directly fix prose fabrication** — the core prose fabrication problem (inventing "gradient-as-depth" philosophy, "consistent focus indicators," vibe paragraphs) is caused by the WRITE phase being instructed to produce interpretive prose with no evidence quotas, not by token type absence. DTCG's real value is downstream interop and cleaner validator architecture. Full migration should NOT block anti-fabrication fixes (`iter-024:#4`).
9. **Evidence-backed named principles are the highest-value prose** — removing mandatory philosophy entirely WOULD lose genuine value. When a named principle is grounded in actual tokens (e.g., "Shadow-as-border" with `0px 0px 0px 1px rgba(0,0,0,0.08)` appearing 4× more than elevation shadows), it communicates the WHY behind the data and is the single most useful part of a design doc for an implementing developer. The fix is evidence-gating (≥3 distinct backing tokens across ≥2 pages), not abolition (`iter-024:#3`).

---

## Verification Summary

| Verdict | Count | Key Items |
|---------|-------|-----------|
| **SOUND** | Focus-indicator bug, extractA11yAsync dead code, deltaE threshold, section-requirements data-driven, AP-29, comparative framing mandate, named-principle evidence-gate, motion fallback, ABSENT-stamp, cardinal-rules routing, style-guide contradiction, section coverage map, coverage election pre-gate, interaction pipeline key mismatch, interaction performance bounded at 30s/page |
| **SOUND-WITH-CAVEAT** | Validator prose checks (WARNING-tier only; SELF-REVIEW unreliable — prefer structural citation counting), deterministic renderer (citation proves grounding not truth), deltaE regression risk (test against gold-standard before deploying) |
| **OVER-CLAIMED** | ~335 LOC claim — corrected to ~550 LOC when individual estimates summed |
| **REFUTED** | None — all six adversarial-verified recommendations have valid core insights; four required scope adjustment to avoid over-engineering or premature disruption |

**Empirical validation (`iter-043`):** Empty sections (§6 Shadows = 0 tokens, §9 focusIndicator.style = `{}`) are the confirmed invention sites. The one section with an existing absence-gate (§2.5 DarkMode) correctly produced no invention — generalizing gates to §6/§9/§6.5 is empirically validated.
---

<!-- ANCHOR:references -->
## References

- Planning: `research-plan.md`, native sub-agent briefs (skill-angles A/B/C, external-tools D, execution recipe)
- Per-track syntheses: `iterations/iteration-026.md` (A), `-027.md` (B), `-028.md` (C), `-029.md` (D borrow list)
- Architecture + integration: `iteration-030.md` (doc-as-view), `iteration-031.md` (cross-track plan)
- Verification: `iteration-024.md`, `iteration-036.md`, `iteration-044.md` (3 adversarial passes)
- Empirical: `iteration-043.md` (section-coverage on real anobel tokens.json)
- Implementation backlog: `iteration-038.md`; per-section ruleset: `iteration-037.md`
- Dashboard + findings: `deep-research-dashboard.md`, `findings-registry.json`, `deltas/`
- Method: 50 iterations, MiMo v2.5 Pro + DeepSeek v4 Pro (high), orchestrator-writes parallel waves, 0 state corruption
<!-- /ANCHOR:references -->

---

## Post-Synthesis Corrections (iter-046 red-team + iter-047 pre-mortem + iter-048 empirical)

The synthesis was adversarially audited and empirically tested. research.md is **SOUND for sign-off** (red-team found 0 critical errors); the following corrections are folded in above:

1. **"kills both hallucination classes" → "substantially reduces"** (iter-046). Value fabrication is fixed at the extraction layer; prose fabrication is structurally reduced but not fully eliminated without the full architecture's citation gating. The doc's own §7 already conceded this.
2. **A3 deltaE-raise REFUTED, demoted TIER-1→TIER-2** (iter-046 + iter-048, independently). Live measurement on anobel: `deltaE<10` would merge **9 distinct-color pairs** (incl. the brand navies `#06458c`/`#043367` and brand reds) vs **0** at `<3`. The L4-leak fix is the **coverage-election pre-gate** (SOUND/additive, iter-044), keeping deltaE tight. deltaE changes only via per-corpus calibration against the gold-standard palettes.
3. **Phase 3 validator checks = detection, not prevention** (iter-046) — they catch fabrication post-hoc; prevention comes from Phase 1-2 + the doc-as-view renderer.
4. **Pre-mortem guards added** (iter-047): interaction-ON default needs a `--fast-no-interaction` opt-out + per-page 30s cap (confirmed); section-demotion needs a false-ABSENT guard (a section's token-detection heuristic must not return empty for a legitimately-present section); focus-shape change (`consistent:true`→`captured:false`) requires updating report-gen/template consumers.

**Method note:** 50 iterations, MiMo v2.5 Pro + DeepSeek v4 Pro (high), orchestrator-writes parallel waves, 3 adversarial-verification passes (iter-024/036/046) + 2 host-run empirical checks (iter-043 section-coverage, iter-048 deltaE), 0 state corruption. The deltaE reversal is the headline example of "measure live before changing."
