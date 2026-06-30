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
