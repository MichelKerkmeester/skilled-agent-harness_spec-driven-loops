---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Study the Hallmark design skill and determine what can be copied or adapted, learned from to improve existing sk-design modes and commands, used as inspiration for new capabilities, or skipped; ground every recommendation in Hallmark and sk-design evidence and honor Hallmark's license.
- Started: 2026-07-20T05:29:12Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-sol-opencode-1784525177424-b0sf31
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Licensing verdict and complete Hallmark/sk-design asset inventory | - | 1.00 | 8 | complete |
| 2 | Gate-by-gate Hallmark slop and audit comparison against shipped sk-design design-audit | - | 0.82 | 17 | complete |
| 3 | Hallmark default build and redesign behavior versus shipped interface and foundations contracts | - | 0.86 | 11 | complete |
| 4 | Hallmark color, typography, copy, imagery, custom direction, hero craft, floating navigation, and responsive quality versus shipped Interface and Foundations assets | - | 0.83 | 9 | complete |
| 5 | Hallmark motion, microinteractions, and interaction states versus shipped Motion, /interface:motion, Foundations tokens, and Interface state guidance | - | 0.81 | 8 | complete |
| 6 | Hallmark study, design-DNA schema, portable design.md, export formats, and styles ingestion versus shipped MD-GENERATOR | - | 0.84 | 10 | complete |
| 7 | Hallmark curated themes and genre/custom selection versus the 1,290-bundle sk-design corpus, retrieval rights gates, and relational-exemplar authority | architecture | 0.86 | 7 | complete |
| 8 | Hallmark ROADMAP proposals versus shipped sk-design modes and /interface:* commands | roadmap-and-capability-boundary | 0.72 | 9 | complete |
| 9 | Remaining Hallmark assets and roadmap boundaries for data visualization, tactile craft, generated media, preview transport, sound, and haptics | remaining-assets-and-future-integrations | 0.67 | 8 | complete |
| 10 | Final coverage and contradiction audit across the complete Hallmark inventory and prior findings | coverage-contradiction-and-plan-inputs | 0.68 | 6 | complete |

- iterationsCompleted: 10
- keyFindings: 8
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What does Hallmark's license permit us to copy, adapt, and redistribute, and what attribution or notice obligations apply? [resolved in iteration 10]
- [x] Which Hallmark assets map to sk-design interface, foundations, audit, md-generator/design-reference, and motion, and what concrete gaps exist in each target? [resolved in iteration 10]
- [x] Which Hallmark slop gates, pre-emit critique heuristics, schemas, motion tokens, and design-DNA fields are absent or weaker in sk-design? [resolved in iteration 10]
- [x] Is Hallmark's curated twenty-theme model a useful complement to sk-design's extracted styles corpus, and if so how should the two models coexist? [resolved in iteration 10]
- [x] Which redesign, variant, brand-first, data-visualization, tactile, and image-hook roadmap ideas merit existing-mode adaptation, new capabilities, or rejection? [resolved in iteration 10]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None.

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▆▄▅▅▅▄▄▄▄▄▅▅▅▃▂▁▁▁▁
- score sparkline: █▆▄▅▅▅▄▄▄▄▄▅▅▅▃▂▁▁▁▁
- Last 3 ratios: 0.72 -> 0.67 -> 0.68
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.68
- coverageBySources: {"code":75,"other":99}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Ruled out:** Treating Hallmark's portable `design.md` as evidence that shipped `sk-design` lacks a design-reference pipeline. The shipped md-generator already has a measured extract-write-validate backend and explicit v3 schema. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:230-259] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:90-120] (iteration 1)
- **Ruled out:** Treating README.md's "Use it, fork it, ship it" sentence as the complete licensing contract. The actual MIT text adds a notice-preservation condition. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/README.md:110-112] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:12-13] (iteration 1)
- **Ruled out:** Copying all 58 gates into `design-audit`. Several are Hallmark-runtime state checks, several duplicate shipped token/accessibility/hardening rules, and several universal bans conflict with the shipped hypothesis-and-register posture. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:3-5] [SOURCE: .opencode/skills/sk-design/design-audit/procedures/ai-slop-check.md:33-39] (iteration 2)
- **Ruled out:** Replacing shipped P0-P3 severity with Hallmark's critical/major/minor labels. The shipped severity is tied to user and release impact, while Hallmark's critical category includes style signatures that need not block a user task. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/anti-patterns.md:9-15] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit-contract.md:36-45] (iteration 2)
- **Ruled out:** Treating README's 57 as evidence that one gate was deleted. The current list explicitly says 58 and contains integer gates 1-57 plus `38a`. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:1-3] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/slop-test.md:98-106] (iteration 2)
- A one-to-one gate count against the nine-row registry is not meaningful: the registry intentionally contains model fingerprints, while many Hallmark gates belong to accessibility, responsive, theming, or Hallmark-private state. Comparison therefore used behavioral coverage rather than raw row parity. [SOURCE: .opencode/skills/sk-design/design-audit/assets/ai-fingerprint-registry.json:1-92] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:139-152] (iteration 2)
- The initial Hallmark brace glob returned no matches despite known files. Direct reads of the exact iteration-1 paths resolved the inventory without changing scope. (iteration 2)
- **Copying the 21 macrostructures or 50 component archetypes as sk-design presets.** This conflicts with subject grounding and the no-reusable-preset guard. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:111-116] (iteration 3)
- **Replacing foundations responsive guidance with fixed viewport recipes.** Existing foundations adapts across viewport, input, capability, and posture, which is the stronger abstraction. [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation-matrix.md:35-60] (iteration 3)
- **Separate redesign mode or command.** Existing interface triggers, redesign lane, and preserve/overhaul intake already provide the equivalent; the observed gap is multi-surface coherence inside the existing reference. [SOURCE: .opencode/commands/interface/design.md:55-59] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/redesign-intake.md:35-70] (iteration 3)
- **Separate variant command.** Existing `directions`, seed-of-thought, wireframe, and variation-set contracts already own it, and the procedure cards explicitly remain private. [SOURCE: .opencode/skills/sk-design/design-interface/procedures/variation-set.md:19-27] [SOURCE: .opencode/skills/sk-design/design-interface/procedures/wireframe-exploration.md:19-27] (iteration 3)
- A brace glob for the named Hallmark files returned no matches, repeating the repository glob limitation noted in iteration 2. Exact paths from iteration 1's inventory were readable and supplied complete evidence; no scope expansion was needed. (iteration 3)
- Searching shipped interface/foundations for `macrostructure` found no native catalog, but absence alone did not justify importing Hallmark's catalog because shipped guidance explicitly rejects reusable presets. The useful comparison therefore moved from name parity to behavioral mechanisms. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/variation-diversity.md:111-116] (iteration 3)
- A standalone redesign, variant, theme, craft, hero, imagery, floating-nav, or responsive command. Existing Interface and Foundations owners are sufficient. (iteration 4)
- Fixed 320/375/414/768 widths as universal breakpoints. Foundations' target/content/input model remains authoritative. (iteration 4)
- Hallmark's exact recipes contained volatile support, cost, vendor, and bundle claims. Those were not treated as durable guidance; only invariants corroborated by shipped ownership boundaries survived. (iteration 4)
- Hallmark's fixed palette percentages, font lists and pairings, 20-theme catalog, CSS/SVG recipe library, eight hero archetypes, or exact floating-nav timing as sk-design presets. (iteration 4)
- Hotlinking or redistributing Hallmark's hosted imagery, and copying attributed voice samples without separate rights evidence. (iteration 4)
- Mandatory imagery. It conflicts with subject grounding and can produce decorative filler. (iteration 4)
- Name parity was not useful for imagery, custom craft, or custom theme because shipped sk-design organizes those concerns under grounding, real-UI, aesthetic-direction, and preflight contracts. Behavioral comparison exposed the actual owners. (iteration 4)
- The known brace-glob limitation recurred: a brace query for the nine Hallmark names returned no matches. Exact paths recovered from prior lineage inventory were readable, so no scope expansion was needed. (iteration 4)
- A new theme-motion, microinteraction, interaction-state, or reduced-motion command; `/interface:motion` and existing mode assets already own the jobs. (iteration 5)
- A universal eight-state requirement for every element; applicability plus explicit N/A is more accurate. (iteration 5)
- Copying exact duration, easing, spring, stagger, tooltip, toast, or drag recipes into shipped guidance. (iteration 5)
- Hallmark's global `150ms !important` reduced-motion recipe and absolute transform/opacity-only rule. (iteration 5)
- Hallmark's ten-theme duration multiplier table as presets; values are unvalidated against target identity, frequency, input, runtime, and device evidence. (iteration 5)
- Raw recipe-count comparison was not useful: Hallmark is a broad catalog while shipped Motion uses purpose/state cards and routes advanced implementation mechanics separately. (iteration 5)
- Recursive globbing did not locate the three known Hallmark files, repeating the lineage's glob limitation. Exact inventory paths were readable and complete. (iteration 5)
- Theme-name parity was rejected because shipped sk-design uses Brand/Product posture plus target-specific direction, not a reusable style chooser. (iteration 5)
- Automatic ingestion of MD-GENERATOR output into the styles corpus. (iteration 6)
- Embedding every portable format in `DESIGN.md` looked convenient but conflicts with the validator's compact deterministic targets, creates naming collision with extraction `tokens.json`, and would force the styles corpus to accept unsupported artifacts. (iteration 6)
- Emitting lowercase `design.md` as an interchangeable canonical artifact. (iteration 6)
- Importing Hallmark's macrostructure, archetype, theme, reveal, treatment, or anti-pattern catalogs as v3 enums or presets. (iteration 6)
- Inventing shadcn destructive/status tokens when the source has no measured equivalent. (iteration 6)
- Name-parity comparison (`macrostructure`, `archetype`, `theme`) overstated gaps. Field-level evidence showed that most underlying colour, type, shape, layout, motion, and component facts already exist under measured native structures. (iteration 6)
- Recursive Hallmark globs again returned no files despite known paths; exact paths recovered from prior inventory were readable. (iteration 6)
- Replacing measured Playwright/computed-CSS extraction with screenshot vision or shallow WebFetch diagnosis. (iteration 6)
- Reusing `tokens.json` for a DTCG projection or embedding all export formats inside `DESIGN.md`. (iteration 6)
- Treating an attached screenshot, public URL, or user attestation as proof of copyright or exact-reuse rights. (iteration 6)
- Writing image-estimated colours, font candidates, rhythm, or structure into canonical `tokens.json` value fields. (iteration 6)
- A user-visible curated-theme chooser or silent fallback to one native archetype when corpus retrieval returns `no-fit`. (iteration 7)
- Allowing archetype labels to bypass provenance/exact-reuse rights, average source values, or upgrade source confidence. (iteration 7)
- Broad text search for the literal reported cardinality produced numeric false positives inside extracted style data. A structural census of canonical files and six-role siblings supplied the exact count. (iteration 7)
- Importing Hallmark's twenty names, four genre labels, theme token combinations, or four detailed theme specifications as sk-design facets or presets. (iteration 7)
- Name-parity mapping between Hallmark themes and corpus styles remains blocked: it would turn descriptive labels into pseudo-presets and discard source-specific relationships. (iteration 7)
- Treating all twenty Hallmark themes as equally specified; only four per-theme specification files exist. (iteration 7)
- A cookbook of copied HTML/CSS would create a parallel implementation library and reusable defaults; only the abstract decision-card shape survives. (iteration 8)
- A new multi-page extraction relationship type; `DesignBoundary` already represents the measured relationship. (iteration 8)
- A public `variant` alias: the shipped `directions` lane already names the job clearly. (iteration 8)
- A separate `variant`, `redesign`, `study`, or `explain` command. (iteration 8)
- Cognitive-law rationales invented for every anti-pattern regardless of evidence. (iteration 8)
- Emotion labels as themes, dials, or style choices. (iteration 8)
- Filename parity overstates gaps. `variant`, `study`, and `explain` map to shipped directions, extraction, and proof artifacts under different names. (iteration 8)
- Hallmark theme names, curated themes, duration multipliers, or structural sketches as presets. (iteration 8)
- One universal `design.md` contract cannot serve both measured extraction and forward authoring without destroying provenance semantics. (iteration 8)
- The sibling `sol-codex` lineage contains its own completed run 8, but it is independent evidence and was not used as a write target or state authority for this lineage. (iteration 8)
- Treating a generated brand artifact as extracted `DESIGN.md`, or weakening measured extraction to admit brief-authored values. (iteration 8)
- `preview-examples.md` demonstrates Hallmark's own presets; abstracting those examples into a sk-design catalog would revive an exhausted direction. (iteration 9)
- A `tactile` theme, dial, preset, or trend mandate. (iteration 9)
- A Nanobanana-specific core hook, prompt-hash cache, or generated-image provider lock. (iteration 9)
- A new live-preview MCP server or automated render-to-acceptance loop. (iteration 9)
- A provider catalog or copied price/license table inside sk-design; those facts are volatile and source-specific. (iteration 9)
- A rendered preview is not a quality verdict. Existing transport output remains subordinate to Interface/Audit judgment and proof gates. (iteration 9)
- A reusable image-led `Plate` theme. (iteration 9)
- A second `data-viz.md` or standalone charts command. (iteration 9)
- Filename parity again overstated gaps: Hallmark's proposed `data-viz.md` maps to a complete shipped Foundations reference. (iteration 9)
- General web haptics guidance without a supported target runtime and current user-value path. (iteration 9)
- Hallmark's provider counts, costs, model versions, and license shorthand are snapshots, not durable implementation authority. (iteration 9)
- Tool capability is not product justification: Open Design can generate image, video, or audio, but transport availability does not establish that a surface needs those media. (iteration 9)
- Treating generated-media watermarks, URLs, or user-supplied references as proof of copyright or exact-reuse rights. (iteration 9)
- Direct COPY as the default strategy; wholesale gates, catalogs, themes, recipes, tables, examples and schemas add attribution/preset risk without beating native owners. [SOURCE: iteration-002.md:55-57] (iteration 10)
- Hallmark themes/genres/macrostructures/components as presets, selectors, facets, bundles, enums or fallback values. [SOURCE: iteration-007.md:64-74] (iteration 10)
- Lowercase `design.md`, screenshot-estimated canonical tokens, automatic styles ingestion, or authored values in measured Style Reference artifacts. [SOURCE: iteration-006.md:120-129] (iteration 10)
- Name/filename parity repeatedly overstated gaps; behavioral owner mapping is final. [SOURCE: iteration-008.md:116-120] [SOURCE: iteration-009.md:115-121] (iteration 10)
- New redesign, variant, study, explain, theme-motion, chart, tactile, hero, imagery, floating-nav or live-preview commands/servers. [SOURCE: iteration-008.md:106-114] [SOURCE: iteration-009.md:104-113] (iteration 10)
- Provider locks/catalogs, prompt-hash caching of sensitive inputs, hotlinking, or treating watermark/URL/attestation as rights proof. [SOURCE: iteration-009.md:104-113] (iteration 10)
- Raw catalog/gate counts do not establish product value; only evidence-backed gaps with native owners survive. [SOURCE: iteration-002.md:77-80] [SOURCE: iteration-005.md:84-88] (iteration 10)
- Route-proof wording is provenance metadata and cannot support a Hallmark adoption finding. [INFERENCE: based on iteration-008.md:3-10 and iteration-009.md:3-8] (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Where should a future Hallmark MIT notice live if implementation chooses substantial textual reuse despite the idea-level recommendation?

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
