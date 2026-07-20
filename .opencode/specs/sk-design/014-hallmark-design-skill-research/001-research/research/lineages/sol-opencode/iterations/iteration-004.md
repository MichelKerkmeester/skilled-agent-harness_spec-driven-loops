# Iteration 4: Interface And Foundations Craft Assets

## Focus

Compare Hallmark color, typography, copy, imagery-kit, custom-theme, custom-craft, hero-enrichment, floating-nav, and responsive guidance against the closest shipped Interface and Foundations references, procedures, and assets. The goal is an exact file-level adoption matrix, not implementation, a preset import, or a new command.

## Actions Taken

1. Read lineage config, canonical state, strategy, registry, and iterations 1-3 before source comparison.
2. Compared the nine Hallmark assets with their closest shipped Interface and Foundations owners.
3. Tested apparent gaps against existing semantic color, type, copy, imagery, direction, prototype, and responsive contracts to avoid duplication.
4. Classified each asset by exact target, verdict, surgical change, value, effort, and licensing treatment.

## Findings

### 1. Color needs one token-boundary clarification, not Hallmark's palette doctrine

Shipped Foundations already has the stronger general system: color register first, semantic jobs, role-stable dark mode, tinted neutrals, and explicit overlay tokens. Hallmark contributes one crisp missing boundary: named palette colors are opaque while transparency is a modifier for overlays and shadows. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/color.md:73-83] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette-theming.md:52-75] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette-theming.md:114-120]

Verdict: ADAPT the opaque-role boundary into palette-theming.md and token-starter.md. Do not import Hallmark's universal one-accent percentages, pure-extreme bans, gradient bans, or OKLCH-only claim; Foundations correctly allows register-specific dosage and compatibility constraints. Value: medium. Effort: low.

### 2. Typography has a concrete fallback-metrics handoff gap

Foundations already defines role-first pairing, fluid bounds, font loading, metric-matched fallbacks, OpenType polish, localization, and zoom checks. It does not name the CSS metric override fields or expose them in the token handoff. Hallmark explicitly names size-adjust, ascent-override, descent-override, and line-gap-override. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/typography.md:207-219] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography-system.md:64-77] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token-starter.md:81-95]

Verdict: ADAPT those proof fields into typography-system.md and token-starter.md, including source/rights and loaded-weight evidence. Do not copy Hallmark's fixed font catalog, tone pairings, bans, family ceiling, or English character buckets; rendered fit and subject evidence remain authoritative. Value: high. Effort: low.

### 3. Copy is mostly duplicate; latency-aware state copy is the narrow gap

Interface already covers concrete verbs, actionable errors, empty-state and CTA formulas, stable action names, register, localization, fake precision, and banned filler more completely than Hallmark. Hallmark adds a useful progression from silent transient waits to named operations and honest progress/expectations, but its 2-second and 10-second cutoffs are not universal. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/copy.md:5-43] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy-and-mock-data.md:53-87] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy-and-mock-data.md:119-136]

Verdict: LEARN by adding measured-latency loading copy to copy-and-mock-data.md and preflight. SKIP the attributed voice-sample corpus: the repository license does not prove Hallmark can relicense third-party quotations. Value: medium-high. Effort: low.

### 4. Imagery needs owned-manifest evidence, never Hallmark asset dependency

Hallmark's imagery document says binaries are not shipped, the manifest is a placeholder, and runtime references use Hallmark-hosted absolute URLs. Its durable idea is role-aware asset metadata and composition constraints, not the corpus or recipes. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:3-11] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:30-46] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:44-65] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:100-128]

Verdict: INSPIRE-NEW within the existing Grounding Record and handoff, not as a command or standalone library. Record rights and stable owned location before composition metadata. Value: medium-high. Effort: medium.

### 5. Custom theme contributes a useful authored-depth fork without a catalog

Hallmark only surfaces custom direction for explicit custom/brand signals, off-catalog multi-attribute direction, mood artifacts, or a singular structural ask; tuned changes palette/type while bespoke changes composition. Shipped aesthetic-direction commits concrete choices and user-signoff axes, while real-ui-loop protects owned-system reuse and subject-specific directions, but neither names authored depth. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:16-32] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:50-79] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/aesthetic-direction.md:17-39] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:57-65] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:97-111]

Verdict: ADAPT precedent-grounded, authored-tuned, and authored-bespoke depth into existing procedure and loop language. Owned systems remain stronger authority; authored values must be labeled authored, not measured. Value: very high. Effort: medium.

### 6. Custom craft exposes an over-broad shipped prohibition

Interface currently bans hand-rolled decorative SVG as fallback and preflight repeats the absolute check. That correctly rejects crude substitute art, but it also rejects deliberately designed, brief-grounded CSS/SVG that has semantic labeling, bounded cost, fallback, reduced motion, and render proof. Hallmark's useful distinction is medium selection and validation; its detailed recipes and vendor hierarchy are brittle. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-craft.md:11-17] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-craft.md:74-97] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy-and-mock-data.md:159-171] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:114-125]

Verdict: ADAPT by banning unvalidated fallback art rather than the medium. Route intentional craft through real-ui-loop's reuse, render, check, and handoff evidence. Value: high. Effort: medium.

### 7. Hero enrichment reveals a direct contract conflict

Hallmark makes typography-only the default and requires media to answer a brief signal. Shipped preflight requires every hero to have a real visual, while the content gate says a pure-text page is incomplete. Those absolutes can manufacture the exact generic decorative media the anti-default process rejects. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/hero-enrichment.md:3-35] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/hero-enrichment.md:431-444] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:44-55] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy-and-mock-data.md:159-167]

Verdict: ADAPT a signature-role decision in preflight, copy-and-mock-data.md, and aesthetic-direction.md. Typography-only is valid when it is the grounded signature; generic text plus a gradient blob still fails. Value: very high. Effort: low-medium.

### 8. Floating nav contributes state-morph invariants, not a reusable recipe

The durable rules are one DOM owner, constant layout geometry, transform-only visual offset, explicit property ownership across states, one timing family, and scroll-handler discipline. Prototype-flow-spec already owns state models, interaction matrices, keyboard, focus, loading, and handoff, but does not require geometry or property-ownership proof for visual morphs. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/floating-nav.md:3-27] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/floating-nav.md:48-87] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/prototype-flow-spec.md:17-39] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:171-190]

Verdict: LEARN through a morph-proof row in prototype-flow-spec.md and preflight. Do not copy timing, threshold, CSS, shadow, or blur recipes. Value: medium. Effort: low-medium.

### 9. Responsive needs a proof matrix, not device doctrine

Foundations has the stronger conceptual model: content-driven breakpoints, container queries, input capability, safe areas, orientation, connection/capability, posture, and real-device verification. Hallmark adds operational probes for wrapped affordances, zero-minimum image tracks, long tokens, theme-specific collapse, and focus-induced scroll jumps. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/responsive.md:5-23] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md:103-131] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation-matrix.md:35-46] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation-matrix.md:120-130] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:100-110]

Verdict: ADAPT a target-derived verification matrix across layout-responsive.md, adaptation-matrix.md, and preflight. Hallmark's four widths are only a possible marketing-web example. Value: high. Effort: medium.

## Candidate Matrix

| Hallmark asset | Exact sk-design target files | Verdict | Surgical concrete change | Value | Effort | Licensing treatment |
|---|---|---|---|---|---|---|
| color.md | design-foundations/references/color/palette-theming.md; design-foundations/assets/token-starter.md | ADAPT | Opaque canonical role tokens; alpha only in named overlay/scrim/shadow/optical roles | Medium | Low | Independent wording; no notice. Direct substantial copy needs Hallmark MIT notice. |
| typography.md | design-foundations/references/type/typography-system.md; design-foundations/assets/token-starter.md | ADAPT | Pairing/source/rights and four fallback-metric override fields plus layout-shift proof | High | Low | Native schema; skip catalog and fixed pairings. |
| copy.md | design-interface/references/design-process/copy-and-mock-data.md; design-interface/assets/interface-preflight-card.md | LEARN / SKIP | Measured-latency loading copy; skip attributed quotations | Medium-high | Low | Idea rewrite needs no notice; quotations require separate rights. |
| imagery-kit.md | design-interface/references/design-process/real-ui-loop.md; design-interface/references/design-process/copy-and-mock-data.md; shared/creation-contract.md | INSPIRE-NEW | Optional owned-asset manifest in existing grounding/handoff | Medium-high | Medium | No hotlink or redistribution; verify each asset's rights separately. |
| custom-theme.md | design-interface/procedures/aesthetic-direction.md; design-interface/references/design-process/real-ui-loop.md | ADAPT | Precedent-grounded vs authored-tuned vs authored-bespoke depth | Very high | Medium | Independent route logic; no presets, stamps, axes, or worked values copied. |
| custom-craft.md | design-interface/references/design-process/real-ui-loop.md; design-interface/references/design-process/copy-and-mock-data.md; design-interface/assets/interface-preflight-card.md | ADAPT | Permit validated brief-grounded CSS/SVG; reject unvalidated fallback art | High | Medium | Adapt evidence contract only; no recipes or volatile vendor claims. |
| hero-enrichment.md | design-interface/assets/interface-preflight-card.md; design-interface/references/design-process/copy-and-mock-data.md; design-interface/procedures/aesthetic-direction.md | ADAPT | Signature-role decision; conditional media proof; typography-only can pass | Very high | Low-medium | Independent correction; skip archetype catalog. |
| floating-nav.md | design-interface/procedures/prototype-flow-spec.md; design-interface/assets/interface-preflight-card.md | LEARN | Geometry/property-ownership/state/input/performance morph proof | Medium | Low-medium | Learn invariants; do not copy exact recipe values. |
| responsive.md | design-foundations/references/layout/layout-responsive.md; design-foundations/references/layout/adaptation-matrix.md; design-interface/assets/interface-preflight-card.md | ADAPT | Target-derived viewport/input/orientation/zoom/content-risk proof matrix | High | Medium | Independent matrix; fixed widths are examples only. |

## Licensing Boundary

Hallmark's MIT grant permits source use, modification, and redistribution when its copyright and permission notice accompany copies or substantial portions. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:5-13] This iteration recommends no COPY rows: independent integration into sk-design's existing contracts avoids importing substantial expression. If implementation later copies tables, recipes, catalogs, or prose blocks, retain the Hallmark notice at repository level and in the copied asset's provenance. Hosted binaries, linked fonts/libraries, third-party quotations, logos, photographs, and generated outputs require separate rights verification; Hallmark's repository license is not evidence that Hallmark owns those rights.

## Ruled Out

- A standalone redesign, variant, theme, craft, hero, imagery, floating-nav, or responsive command. Existing Interface and Foundations owners are sufficient.
- Hallmark's fixed palette percentages, font lists and pairings, 20-theme catalog, CSS/SVG recipe library, eight hero archetypes, or exact floating-nav timing as sk-design presets.
- Mandatory imagery. It conflicts with subject grounding and can produce decorative filler.
- Fixed 320/375/414/768 widths as universal breakpoints. Foundations' target/content/input model remains authoritative.
- Hotlinking or redistributing Hallmark's hosted imagery, and copying attributed voice samples without separate rights evidence.

## Dead Ends

- The known brace-glob limitation recurred: a brace query for the nine Hallmark names returned no matches. Exact paths recovered from prior lineage inventory were readable, so no scope expansion was needed.
- Name parity was not useful for imagery, custom craft, or custom theme because shipped sk-design organizes those concerns under grounding, real-UI, aesthetic-direction, and preflight contracts. Behavioral comparison exposed the actual owners.
- Hallmark's exact recipes contained volatile support, cost, vendor, and bundle claims. Those were not treated as durable guidance; only invariants corroborated by shipped ownership boundaries survived.

## Questions Answered

- All nine assets have an exact target, verdict, concrete change, value, effort, and licensing treatment.
- No direct COPY is justified. Existing sk-design contracts are stronger owners and need independently worded surgical additions.
- The most consequential existing-contract bugs are mandatory hero imagery and the blanket hand-built SVG prohibition.

## Sources Consulted

- Hallmark color, typography, copy, imagery-kit, custom-theme, custom-craft, hero-enrichment, floating-nav, and responsive references. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/color.md:1-95] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/typography.md:1-243] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/copy.md:1-182] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/imagery-kit.md:1-170] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:1-367] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-craft.md:1-626] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/hero-enrichment.md:1-475] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/floating-nav.md:1-89] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/responsive.md:1-138]
- Shipped Foundations palette, token, typography, responsive, and adaptation assets. [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette-theming.md:1-131] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token-starter.md:1-147] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography-system.md:1-129] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout-responsive.md:1-174] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation-matrix.md:1-130]
- Shipped Interface content, real-UI, aesthetic-direction, prototype, preflight, and shared creation contracts. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy-and-mock-data.md:1-203] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:1-131] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/aesthetic-direction.md:1-44] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/prototype-flow-spec.md:1-43] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:1-203] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:1-206]

## Assessment

- Status: complete for iteration 4's bounded focus.
- findingsCount: 9 asset decisions.
- newInfoRatio: 0.83.
- Novelty justification: Six rows establish fully new file-level gaps and three refine prior inventory or responsive overlap into exact existing-file changes; (6 + 3 x 0.5) / 9 = 0.83.
- Confidence: high for file ownership, duplication checks, and direct contract conflicts; medium for future implementation effort because no implementation was attempted.
- Convergence: continue. The stop policy requires ten iterations and this ratio remains well above the 0.05 telemetry threshold.

## Reflection

Comparing behavior rather than filenames prevented duplicate capabilities. The useful Hallmark material is mostly a sharper decision or proof boundary inside an existing owner, not a new mode. The two strongest findings are corrective: required imagery and an absolute SVG ban currently conflict with sk-design's own grounding and proof posture.

## Recommended Next Focus

Compare Hallmark's curated genre/theme mechanics with the shipped styles corpus and relational-exemplar authority model. Determine whether any small anti-default seed layer can improve retrieval without becoming a preset chooser, and resolve the future Hallmark MIT-notice placement question for any implementation that chooses substantial textual reuse.
