# Iteration 1: Licensing and Asset Inventory

## Focus

Establish the checked-in Hallmark license obligations and inventory the Hallmark and shipped `sk-design` surfaces needed for later COPY / ADAPT / LEARN / INSPIRE-NEW / SKIP analysis. This iteration deliberately maps evidence without attempting the broad comparative synthesis reserved for later iterations.

## Actions Taken

1. Read the lineage config, state log, and strategy to confirm iteration 1, the max-iterations stop policy, and the licensing/inventory focus.
2. Inventoried the Hallmark repository, then read its `LICENSE`, `README.md`, `ROADMAP.md`, and `skills/hallmark/SKILL.md`.
3. Inventoried Hallmark's root and nested reference families, including genres, optional theme specs, macrostructures, component archetypes, and verb packets.
4. Inventoried the shipped `sk-design` hub, five mode packets, canonical `/interface:*` command surface, audit/slop assets, md-generator schema/pipeline, and styles corpus/database surfaces.

## Findings

### 1. Licensing Verdict

| Question | Evidence-backed verdict | Later matrix implication |
|---|---|---|
| May Hallmark be used, copied, modified, merged, published, distributed, sublicensed, or sold? | Yes. The checked-in license is MIT and grants all of those rights. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:1-10] | COPY and ADAPT are legally available categories, subject to notice preservation. |
| What must accompany copied material? | The Hallmark copyright notice and MIT permission notice must be included in all copies or substantial portions. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:12-13] | Any substantial textual/code/asset reuse needs an attribution/notice plan at the concrete target path. |
| Is Hallmark provided with warranties? | No. It is provided "AS IS" without warranty, and the authors disclaim liability. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:15-20] | Do not represent copied rules or assets as warranted by Hallmark contributors. |
| Is the README's "Use it, fork it, ship it" the full legal condition? | No. That phrase accurately summarizes permissive intent but omits the notice condition found in the license. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:110-112] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:12-13] | Use the `LICENSE` text, not README shorthand, as the reuse authority. |

**Upfront verdict:** Hallmark content can be copied or adapted into `sk-design`, including redistribution, but copies or substantial portions must retain the Hallmark copyright and MIT permission notice. Purely learning from ideas without copying expression is lower-friction, but the final matrix still needs to distinguish idea-level influence from substantial textual/code/asset reuse. This is a source-text reading, not legal advice.

### 2. Hallmark Asset Inventory

| Family | Concrete inventory | Function/evidence |
|---|---|---|
| Core | `LICENSE`, `README.md`, `ROADMAP.md`, `skills/hallmark/SKILL.md`, `package.json`, `vercel.json` | The README advertises default build plus `audit`, `redesign`, and `study`; `study` can emit portable `design.md`. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:17-25] |
| Human docs | `docs/recipes.md`, `docs/study-examples.md`, `docs/talk-slides.md`, and 20 observed `docs/screenshots/hero-*.jpg` files | Hallmark explicitly classifies recipes and study examples as human-only worked material rather than auto-loaded rules. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:389-391] |
| Root references | `anti-patterns.md`, `assets.md`, `color.md`, `component-cookbook.md`, `contract.md`, `copy.md`, `custom-craft.md`, `custom-theme.md`, `design-md.md`, `export-formats.md`, `floating-nav.md`, `hero-enrichment.md`, `imagery-kit.md`, `interaction-and-states.md`, `layout-and-space.md`, `macrostructures.md`, `microinteractions.md`, `motion.md`, `preview-examples.md`, `responsive.md`, `slop-test.md`, `structure.md`, `study.md`, `typography.md` | Hallmark separates always-load, conditional, end-of-flow, verb-specific, and human-only resources to control context cost. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:348-391] |
| Genre/theme references | Four genre files (`editorial`, `modern-minimal`, `atmospheric`, `playful`) and four observed optional per-theme specs (`carnival`, `cobalt`, `hum`, `lumen`) | The catalog itself has 20 named themes, but only selected themes have eager-load spec files; the rest rely on catalog token data. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:230-240] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:352-355] |
| Structural catalogs | `macrostructures.md` plus 21 numbered macrostructure files; `component-cookbook.md` plus 50 component files covering 9 heroes, 5 section heads, 6 features, 4 CTAs, 4 testimonials, 8 footers, and 14 navs | Hallmark's load pattern is index-then-pick: one macrostructure and only selected component archetypes. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:264-266] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:356-358] |
| Verb packets | `references/verbs/audit.md`, `references/verbs/redesign.md`; `study.md` remains a root verb-specific reference | The top-level skill routes explicit audit/redesign/study behavior and keeps default design as the fourth behavior. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:19-30] |
| Quality gates | `anti-patterns.md`, `slop-test.md`, pre-emit six-axis critique, responsive hard floor, token locking, honest-copy rules | The pre-emit critique revises any axis below 3; the README reports 57 gates while the current skill text refers to 58, so gate-count/version reconciliation is needed before reuse. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:42-56] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13-13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:380-382] |

### 3. Shipped sk-design Inventory and Initial Mapping

| Shipped surface | Concrete assets | Hallmark-facing evidence map (not yet a recommendation) |
|---|---|---|
| Hub/router | `sk-design/SKILL.md`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`, shared register/context/proof contracts | The hub exposes five design-judgment modes and one Open Design transport, keeping per-mode logic out of the hub. [SOURCE: .opencode/skills/sk-design/SKILL.md:13-30] [SOURCE: .opencode/skills/sk-design/mode-registry.json:39-165] |
| Interface mode | `design-interface/SKILL.md`, design-process/design-grounding/aesthetics references, procedure cards, preflight assets, optional corpus adapter | This already owns distinctive direction, redesign, variation sets, anti-default critique, real-UI grounding, and implementation handoff. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:20-32] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:71-93] |
| Foundations mode | `design-foundations/SKILL.md`, color/type/layout/data-viz references, token and contrast assets, procedures | This already owns OKLCH, type, spacing, responsive systems, data visualization, and reusable static tokens. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:19-31] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:72-101] |
| Motion mode | `design-motion/SKILL.md`, decision/strategy/microinteraction/presence/performance references, motion cards/checklists | This already owns animation restraint, timing/easing, micro-interactions, reduced motion, and performance-aware handoff. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:19-30] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:80-113] |
| Audit mode | `design-audit/SKILL.md`, P0-P3 audit contract, accessibility/performance and hardening references, AI fingerprint registry/self-defect assets, `procedures/ai-slop-check.md`, manual slop-hardening playbook | Unlike Hallmark's pass/fail gate list, shipped audit is findings-first, evidence-labelled, owner-mapped, and scored across five dimensions. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:13-30] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:83-116] [SOURCE: .opencode/skills/sk-design/design-audit/procedures/ai-slop-check.md:17-39] |
| md-generator | `design-md-generator/SKILL.md`; 10 core references, 3 assets, 1 procedure, 4 exemplar pairs plus editorial exemplar; TypeScript extract/write/validate/report backend and tests | This is a measured five-viewport Playwright pipeline, not screenshot/URL DNA diagnosis by judgment. It emits verbatim tokens and a validated v3 Style Reference. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:10-14] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:87-120] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:230-259] |
| v3 schema | `backend/scripts/schema-v3.ts` with capabilities, required/conditional sections, CSS/Tailwind Quick Start groups, and hard target/schema/provenance failures | Hallmark `design.md` comparison must be field-level against this existing schema rather than treated as a missing capability. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:90-120] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:151-230] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:250-260] |
| Commands | Canonical `/interface:design`, `/interface:foundations`, `/interface:motion`, `/interface:audit`, `/interface:design-reference`; each has auto, confirm, and presentation assets; `/design:*` remains compatibility aliases | `/interface:design-reference` requires source identity, coverage, output/overwrite policy, extract-write-validate, provenance, and diagnostics on capture failure. [SOURCE: .opencode/skills/sk-design/SKILL.md:32-42] [SOURCE: .opencode/commands/interface/design-reference.md:29-53] |
| Styles corpus | Authoritative flat `styles/<style>/` bundles typically carrying `DESIGN.md`, `design-tokens.json`, canonical JSON, and `source.md`; `styles/_engine/` adapter; rebuildable SQLite/FTS/vector projection in `styles/_db/` | This is an extracted, provenance-aware corpus rather than Hallmark's curated 20-theme catalog. Flat files remain authoritative; persistent retrieval applies rights eligibility before ranking. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:1-5] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:52-65] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:87-100] |

### 4. Roadmap Inventory for Later Iterations

Hallmark's roadmap groups image generation/cache integration, brand-first `design.md`, theme-aware motion tokens, structural variants, a structural cookbook, tactile-rebellion guidance, data visualization, multi-page coherence, codebase study, explainability, negative-capability rationale, emotion-first prompting, sound/haptics, and MCP live-preview feedback. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:7-39]

This is only a candidate inventory. Several items already overlap shipped `sk-design` surfaces (for example variation procedures, data visualization, code/style extraction, motion tokens, and transport/browser verification), so later iterations must compare behavior and evidence before classifying them as gaps.

## Questions Answered

- **Answered:** What does Hallmark's license permit, and what notice obligation applies? It permits use/copy/modification/redistribution/sublicensing/sale under MIT, with the copyright and permission notice included in copies or substantial portions. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:5-13]
- **Partially answered:** Which Hallmark families map to the five modes, commands, audit assets, md-generator, and styles corpus? The concrete surfaces are now inventoried, but gap and strategy classifications remain intentionally deferred.

## Questions Remaining

- Which Hallmark assets are genuinely stronger or absent after file-level comparison with each mode?
- Which slop gates, critique heuristics, schema fields, motion tokens, and design-DNA fields merit COPY, ADAPT, LEARN, INSPIRE-NEW, or SKIP?
- How should curated themes and the extracted styles corpus coexist, if at all?
- Which roadmap items are true gaps rather than duplicates of shipped procedures or infrastructure?
- Where substantial reuse is recommended, what exact target path and MIT notice mechanism should accompany it?

## Ruled Out

- **Ruled out:** Treating README.md's "Use it, fork it, ship it" sentence as the complete licensing contract. The actual MIT text adds a notice-preservation condition. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:110-112] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:12-13]
- **Ruled out:** Treating Hallmark's portable `design.md` as evidence that shipped `sk-design` lacks a design-reference pipeline. The shipped md-generator already has a measured extract-write-validate backend and explicit v3 schema. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:230-259] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:90-120]

## Dead Ends

None. Broad globs were truncated, but narrower family globs and authoritative indexes exposed the concrete grouped inventories needed for this iteration.

## Edge Cases

- The Hallmark README reports 57 slop gates, while the checked-in skill refers to 58. Later gate-level work must inspect `slop-test.md` and use the current enumerated list rather than trusting either summary count. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:13-13] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:344-344]
- MIT's "substantial portions" threshold is not quantified in the checked-in text. Exact reuse decisions should conservatively attach notice when copying meaningful files, tables, catalogs, or prose blocks rather than trying to infer a threshold. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:12-13]
- Hallmark's 20-theme catalog has only four observed per-theme markdown specs; catalog values also live outside the reference tree. A later theme iteration must inspect token/theme implementation, not infer completeness from `references/themes/` alone. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:240-240] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:352-355]
- The styles corpus inventory exceeded a single broad listing. The authoritative architecture and bundle shape are established, but a precise style-count should be obtained in the dedicated corpus/theme iteration rather than guessed here. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:1-5]

## Sources Consulted

- Hallmark `LICENSE`. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:1-21]
- Hallmark `README.md`. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:1-112]
- Hallmark `ROADMAP.md`. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:1-39]
- Hallmark `skills/hallmark/SKILL.md` and inventory of all reference families. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:19-56]
- `sk-design/SKILL.md`, `mode-registry.json`, and `command-metadata.json`. [SOURCE: .opencode/skills/sk-design/SKILL.md:13-42] [SOURCE: .opencode/skills/sk-design/mode-registry.json:39-165]
- The five mode `SKILL.md` files and selected audit/md-generator assets. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:83-116] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:87-120]
- `/interface:design-reference`. [SOURCE: .opencode/commands/interface/design-reference.md:7-80]
- md-generator v3 schema. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:90-120]
- Styles database architecture. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:1-100]

## Assessment

- **Status:** complete for iteration 1's bounded focus.
- **newInfoRatio:** 1.0.
- **Novelty justification:** This first evidence pass established the license authority, notice obligation, complete grouped Hallmark reference inventory, and concrete shipped `sk-design` target map where no prior findings existed.
- **Confidence:** High for the license reading and named architecture surfaces; medium for corpus cardinality because the broad corpus listing was truncated and exact count was intentionally deferred.
- **Convergence:** Not applicable as a stop decision. The configured policy requires exactly 10 iterations; this first pass materially expands the evidence base.

## Reflection

The most productive approach was combining authoritative index text with narrow directory inventories. It avoided reading every catalog leaf while still yielding exact macrostructure/component family sizes and target paths. The key negative knowledge is that several apparent Hallmark "new capabilities" already have shipped analogues in `sk-design`; future iterations must compare quality and behavior, not presence by name.

## Recommended Next Focus

Perform a gate-by-gate comparison of Hallmark `slop-test.md`, `anti-patterns.md`, and pre-emit critique against `design-audit`'s audit contract, AI fingerprint registry, anti-pattern score rubric, self-defect card, and manual slop-hardening playbook. Reconcile the 57/58 count and produce concrete COPY / ADAPT / LEARN / SKIP rows with exact audit target paths and MIT-notice implications.
