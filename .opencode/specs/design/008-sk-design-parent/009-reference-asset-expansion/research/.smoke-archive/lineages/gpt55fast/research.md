# sk-design Reference and Asset Expansion Matrix - gpt55fast Lineage

> Session: `fanout-gpt55fast-1782485686835-ykwdkd`  
> Executor: `cli-opencode model=openai/gpt-5.5-fast`  
> Max iterations: 1  
> Artifact directory: `.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/lineages/gpt55fast`

## 1. Verdict
Add a small, high-leverage set of references and reusable assets. Do not change the five-mode architecture, do not create net-new sub-skills, and do not bulk-import the corpus.

The first dependency is shared: a Brand-vs-Product operating register. The current gap analysis marks it as the only must-add and says it gates transforms, model-specific defect tells, remediation, mock-content discipline, and mechanical pre-flight checks [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:16,41,49]. The corpus version of that discipline is explicit: `impeccable` requires choosing `brand.md` when design is the product and `product.md` when design serves the product [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable.md:20-21].

## 2. Shared Prerequisite
| Priority | Type | Addition | Why it raises usefulness | Exact corpus sources | Effort |
|---|---|---|---|---|---|
| P0 | Reference | `shared/register.md` - Brand-vs-Product operating register | Gives every mode the same operating switch for density, motion budget, anti-slop strictness, transformation semantics, and audit severity. Prevents interface/motion/audit from applying brand-drama rules to product tools or product-restraint rules to brand surfaces. | `gap-analysis.md` says register is must-add and gates five other gaps [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:16,41,49]; `impeccable.md` requires selecting brand vs product register [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable.md:20-21]; `bolder.md` and `quieter.md` define different Brand/Product meanings [SOURCE: .opencode/specs/design/008-sk-design-parent/external/bolder.md:12-17], [SOURCE: .opencode/specs/design/008-sk-design-parent/external/quieter.md:12-17]. | M |

## 3. `design-interface`

### Inventory Gaps
- Current interface has strong grounding, token brainstorming, anti-default critique, and self-critique [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:97-120].
- It lacks an explicit transform-verb playbook for `bolder`, `quieter`, and `distill`, even though gap analysis places those transforms in audit/interface mode rather than a new child [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:17,55].
- It lacks reusable pre-flight assets for mechanical checks such as hero fit, bento cell count, eyebrow count, fake screenshot bans, CTA contrast, and real asset strategy. The corpus has those checks in `taste-skill` and `gpt-tasteskill` [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:236-260,910-979], [SOURCE: .opencode/specs/design/008-sk-design-parent/external/gpt-tasteskill.md:22-44,67-74].
- It lacks a compact realistic-content/anti-AI-copy asset; `redesign-skill` and `taste-skill` both call out generic names, fake-perfect numbers, AI cliche verbs, lorem ipsum, and fake product screenshots [SOURCE: .opencode/specs/design/008-sk-design-parent/external/redesign-skill.md:77-89], [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:615-625,654-656].

### Prioritized Additions
| Priority | Type | Addition | Why it raises usefulness | Exact corpus sources | Effort |
|---|---|---|---|---|---|
| P1 | Reference | `references/design-process/transform_verbs.md` | Converts vague user asks like "make it bolder", "make it quieter", and "distill this" into register-aware moves. This is more useful than new style presets because it changes the critique and revision process. | `gap-analysis.md` routes transform verbs to audit/interface mode [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:17,55]; `bolder.md` differentiates brand distinctiveness from product clarity [SOURCE: .opencode/specs/design/008-sk-design-parent/external/bolder.md:12-17]; `quieter.md` differentiates restraint from product noise reduction [SOURCE: .opencode/specs/design/008-sk-design-parent/external/quieter.md:12-17]; `distill.md` supplies simplification criteria [SOURCE: .opencode/specs/design/008-sk-design-parent/external/distill.md:25-44,50-85]. | M |
| P1 | Asset | `assets/interface_preflight_card.md` | A checklist card makes interface output measurably less generic before code handoff. It should include hero fit, bento cell count, eyebrow count, CTA contrast, image strategy, layout repetition, motion motivation, and no fake product UI. | `taste-skill.md` final pre-flight matrix [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:910-979]; hero/bento/mechanical checks [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:236-260]; gpt-taste AIDA and mandatory design plan [SOURCE: .opencode/specs/design/008-sk-design-parent/external/gpt-tasteskill.md:22-44,67-74]. | M |
| P2 | Reference | `references/design-process/realistic_content.md` | Adds concrete copy/data realism rules to prevent the common "AI made that" tell: fake names, fake-perfect numbers, boilerplate action verbs, lorem ipsum, and div-based screenshots. | `gap-analysis.md` flags realistic mock-content/anti-AI-copy as should-add [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:26,45]; `redesign-skill.md` content bans [SOURCE: .opencode/specs/design/008-sk-design-parent/external/redesign-skill.md:77-89]; `stitch-skill.md` anti-pattern list [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:96-113]. | S |
| P3 | Asset | `assets/design_read_dials_card.md` | Gives interface a quick intake card for page kind, audience, vibe, variance, motion, and density. It should feed interface, foundations, and motion without creating a strategy sub-skill. | `taste-skill.md` design read and three dials [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:13-39,43-63]; `stitch-skill.md` density/variance/motion atmosphere axes [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:29-35]. | S |

### Do Not Add
- Do not add a style chooser or preset picker. Current interface already treats aesthetics as critique-against cues, not user-facing vibe options [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:166,173-180].
- Do not add a whole process-lifecycle reference. Gap analysis reclassifies process lifecycle as a scope ruling, not a content gap [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:28-29,44].
- Do not copy `gpt-tasteskill` literally as a GSAP/AIDA mandate; use its mechanical gates where they improve output.

## 4. `design-foundations`

### Inventory Gaps
- Current foundations already covers OKLCH/color, palette theming, typography, layout/responsive, and corpus traceability [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:269-273].
- It lacks a data-visualization top-up, which gap analysis identifies as a should-add for foundations [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:24,51].
- It lacks an asset-level handoff card for static tokens that can be reused by interface, motion, audit, and sk-code. Current success criteria require implementable token roles and breakpoint intent [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:284-289].
- It lacks a compact bridge from design-read dials to static-system choices. `taste-skill` and `stitch-skill` both expose density/variance/motion as global design controls [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:43-63], [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:29-35].

### Prioritized Additions
| Priority | Type | Addition | Why it raises usefulness | Exact corpus sources | Effort |
|---|---|---|---|---|---|
| P1 | Reference | `references/layout/data_visualization.md` | Fills the clearest foundations gap with chart selection, data color semantics, chart accessibility, mobile alternatives, and real-data testing. | Gap analysis routes data visualization to foundations [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:24,51]; data-viz skill covers chart types, data-ink ratio, colorblind-safe palettes, text alternatives, keyboard navigation, mobile table alternatives, and real data [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/data-visualization/SKILL.md:9-45]. | M |
| P2 | Asset | `assets/static_system_handoff_card.md` | Turns foundations output into a reusable handoff: semantic color roles, type roles, spacing scale, layout rules, breakpoints, risks, and contrast evidence. This makes sk-code implementation less guessy. | Current foundations workflow and success criteria [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:214-221,284-289]; `colorize.md` semantic color and balance checks [SOURCE: .opencode/specs/design/008-sk-design-parent/external/colorize.md:59-98,120-149]; `layout.md` spacing/hierarchy and verification [SOURCE: .opencode/specs/design/008-sk-design-parent/external/layout.md:61-112,139-148]. | S |
| P2 | Reference | `references/layout/density_and_structure_params.md` | Imports the useful live-mode idea of explicit density and structure controls as design vocabulary, without implementing live mode. | `layout.md` defines density and structure params [SOURCE: .opencode/specs/design/008-sk-design-parent/external/layout.md:150-168]; `taste-skill.md` uses visual density as a cross-page dial [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:43-63]. | S |
| P3 | Reference | `references/color/greenfield_brand_seed.md` | Covers the nice-to-have N3 gap when no committed brand colors exist, while preserving identity when tokens exist. | Gap analysis flags greenfield brand-seed color as foundations fold-in [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:35]; `impeccable.md` calls for a brand seed only when no existing CSS tokens/theme/brand colors are found [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable.md:21]. | S |

### Do Not Add
- Do not split `color`, `type`, and `layout` into new sub-skills here. Current mode already routes those axes with guarded resource loading [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:98-108,157-205].
- Do not add broad design-research/process material. The prior synthesis keeps the family focused on build-time craft, not full design lifecycle [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:44].
- Do not duplicate parent shared anti-slop/cognitive/token vocabulary; current foundations explicitly says use, do not duplicate, parent vocabulary [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:275-280].

## 5. `design-motion`

### Inventory Gaps
- Current motion already covers motion strategy, micro-interactions, AnimatePresence, performance/reduced-motion, and corpus map [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:81-95,289-293].
- It lacks a concise advanced-effect decision gate for when to use overdrive techniques and when to refuse them.
- It lacks a bridge for interaction-design breadth: states, micro-interactions, gestures, feedback, error handling, and loading are a larger surface than animation alone [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/commands/design-interaction.md:7-17].
- It lacks a reusable motion-budget card tied to Brand-vs-Product register, frequency, purpose, and reduced motion.

### Prioritized Additions
| Priority | Type | Addition | Why it raises usefulness | Exact corpus sources | Effort |
|---|---|---|---|---|---|
| P1 | Asset | `assets/motion_budget_card.md` | Forces every motion recommendation to name purpose, register, frequency, budget, reduced-motion fallback, and performance risk. This makes the current workflow faster to apply. | Current motion workflow requires purpose, budget, timing, material, reduced-motion behavior, and handoff [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:233-244]; `animate.md` frames motion as state/feedback/hierarchy, not decoration [SOURCE: .opencode/specs/design/008-sk-design-parent/external/animate.md:10-18,41-52]; `emil-design-eng.md` requires asking whether animation should exist and what purpose it serves [SOURCE: .opencode/specs/design/008-sk-design-parent/external/emil-design-eng.md:62-94]. | S |
| P1 | Reference | `references/advanced_effects_gate.md` | Converts overdrive into an escalation/reference gate: propose 2-3 directions, require browser verification, use progressive enhancement, target 60fps, and respect reduced motion. | Gap analysis lists advanced rendering/overdrive motion as motion nice-to-have [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:30,51]; `overdrive.md` requires proposing directions before building and active browser iteration [SOURCE: .opencode/specs/design/008-sk-design-parent/external/overdrive.md:19-31]; progressive enhancement/performance rules [SOURCE: .opencode/specs/design/008-sk-design-parent/external/overdrive.md:93-127]. | M |
| P2 | Reference | `references/interaction_handoff_bridge.md` | Makes motion useful for flows without absorbing the entire interaction-design child: state diagram summary, gesture notes, feedback moments, error/loading transition hooks, and handoff boundaries. | Gap analysis assigns emil advanced interaction/gesture craft to motion [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:19]; designer-skills interaction command decomposes states, micro-interactions, animation, gestures, feedback, errors, loading [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/commands/design-interaction.md:7-17]; `emil-design-eng.md` covers buttons, springs, interruptibility, and details that compound [SOURCE: .opencode/specs/design/008-sk-design-parent/external/emil-design-eng.md:26-37,147-195,197-220]. | M |
| P3 | Asset | `assets/reduced_motion_alternatives_card.md` | Quickens compliance by mapping motion types to reduced-motion replacements that preserve state information. | Current motion rules require reduced-motion equivalents [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:243,260,306-310]; `animate.md` requires non-animated alternatives [SOURCE: .opencode/specs/design/008-sk-design-parent/external/animate.md:41,177-180]; `overdrive.md` makes reduced motion non-negotiable [SOURCE: .opencode/specs/design/008-sk-design-parent/external/overdrive.md:109-127]. | S |

### Do Not Add
- Do not make GSAP, scroll hijacking, or overdrive effects defaults. `gpt-tasteskill` is intentionally extreme and conflicts with current motion's "purpose first" rule [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:256-269].
- Do not absorb the full interaction-design corpus into motion. The gap-analysis says `design-interaction` would be a genuinely unowned future surface, but net-new children are out of scope for this lineage [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:23,53-55].
- Do not add advanced rendering examples without a performance and fallback gate.

## 6. `design-audit`

### Inventory Gaps
- Current audit has a solid baseline: severity model, five-dimension score, accessibility/performance, critique/hardening, anti-patterns, and evidence rules [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:82-96,240-263,280-297,312-316].
- It lacks explicit model-specific defect tells even though gap analysis assigns Codex/Gemini tells to audit/shared anti-slop [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:18].
- It lacks an audit-owned remediation triage playbook even though gap analysis routes redesign/remediation to an audit remediate mode [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:22,55].
- It lacks a realistic-content/anti-AI-copy detector and mechanical layout pre-flight detector, both should-add gaps [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:26-27,45].

### Prioritized Additions
| Priority | Type | Addition | Why it raises usefulness | Exact corpus sources | Effort |
|---|---|---|---|---|---|
| P1 | Asset | `assets/slop_detector_card.md` | Gives auditors a short, reusable detector for model tells: Codex ghost cards/over-rounding/sketchy SVG, Gemini image hover, AI purple gradients, generic three-card layouts, fake screenshots, and cliche copy. | Gap analysis routes model-specific defect tells to audit [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:18]; `impeccable.md` includes Gemini and Codex-specific defects [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable.md:69-70,100-108]; `taste-skill.md` lists production-test tells [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:630-672]. | M |
| P1 | Reference | `references/remediation_triage.md` | Lets audit convert findings into prioritized, mode-owned repair work without silently implementing. This fits audit's evidence-first and owner-mapping contract. | Current audit maps each finding to owning sibling or implementation skill [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:250-252,286-287]; `redesign-skill.md` sequences scan, diagnose, fix and prioritizes font, color, states, layout, components, state coverage, and polish [SOURCE: .opencode/specs/design/008-sk-design-parent/external/redesign-skill.md:10-15,159-178]. | M |
| P1 | Asset | `assets/mechanical_preflight_audit_card.md` | Turns subjective anti-slop into measurable checks: eyebrow count, hero fit, bento cell count, section repetition, CTA contrast, forms, mobile collapse, motion motivation. | Gap analysis flags mechanical layout pre-flight [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:27]; `taste-skill.md` final pre-flight matrix [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:910-979]; `gpt-tasteskill.md` mandatory design plan checks [SOURCE: .opencode/specs/design/008-sk-design-parent/external/gpt-tasteskill.md:67-74]. | S |
| P2 | Reference | `references/content_realism_audit.md` | Adds concrete audit criteria for fake names, fake-perfect numbers, placeholder brands, lorem ipsum, AI verbs, and empty/fake product previews. | Gap analysis N1 [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:26]; `redesign-skill.md` content checks [SOURCE: .opencode/specs/design/008-sk-design-parent/external/redesign-skill.md:77-89]; `stitch-skill.md` anti-pattern list [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:96-113]. | S |
| P2 | Reference | `references/accessibility_minimums_quickfix.md` | Current audit references accessibility/performance, but a quickfix reference would make P0/P1 accessibility reports more actionable. | `fixing-accessibility.md` prioritizes accessible names, keyboard, focus/dialogs, semantics, forms/errors, announcements, contrast, media/motion, and tool boundaries [SOURCE: .opencode/specs/design/008-sk-design-parent/external/fixing-accessibility.md:33-46,49-113]. | S |

### Do Not Add
- Do not let audit silently implement fixes. Current audit explicitly ends with next actions and does not implement during review-only requests [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:250-252].
- Do not turn audit into broad code review. Current audit already routes code correctness beyond UI quality to `sk-code-review` and `sk-code` [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:96,343-344].
- Do not score release readiness from missing visual/browser evidence. Current audit forbids invented browser/screenshot evidence and requires caveats [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:280-297,327-333].

## 7. `design-md-generator`

### Inventory Gaps
- Current md-generator is strong for extraction: real CSS to `DESIGN.md`, five responsive viewports, verbatim tokens, and validate/report paths [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:12-28,34-40].
- It already has two assets: `cardinal_rules_card.md` and `design_md_prompt_template.md`, both focused on hallucination-proof extraction/write fidelity [SOURCE: .opencode/skills/sk-design/design-md-generator/assets/cardinal_rules_card.md:24-52], [SOURCE: .opencode/skills/sk-design/design-md-generator/assets/design_md_prompt_template.md:24-30,50-76].
- It lacks a forward-authoring path for DESIGN.md/PRODUCT.md from taste directives; gap analysis identifies that as a should-add but originally names a new `design-spec` child [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:21,53-55]. Because net-new children are out of scope, fold only the authoring reference/template into md-generator.
- It lacks a clear bridge that says when authoring is allowed versus when extraction is required.

### Prioritized Additions
| Priority | Type | Addition | Why it raises usefulness | Exact corpus sources | Effort |
|---|---|---|---|---|---|
| P1 | Reference | `references/authoring_workflow.md` | Adds a forward DESIGN.md authoring path while preserving the existing extraction contract: author only when there is no live site/tokens source and label inferred guidance clearly. | Gap analysis flags forward DESIGN.md/PRODUCT.md authoring [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:21]; `stitch-skill.md` defines DESIGN.md authoring goals and structure [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:17-25,115-162]; current md-generator says extraction captures existing design while interface invents new direction [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:14,42-49]. | M |
| P1 | Asset | `assets/design_md_author_prompt_template.md` | Complements the existing write-phase prompt with an author-from-brief template that includes atmosphere, color roles, typography, component behavior, layout principles, motion philosophy, anti-patterns, and explicit inference labels. | `stitch-skill.md` output format [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:115-162]; current prompt template already shows how to structure non-negotiable cardinal rules and validation [SOURCE: .opencode/skills/sk-design/design-md-generator/assets/design_md_prompt_template.md:50-76]. | M |
| P2 | Asset | `assets/author_vs_extract_decision_card.md` | Prevents misuse by forcing the operator to choose extraction, validation, report, study, or authoring. It protects measured-token work from invented values. | Current router detects extraction, validation, report, and study phases [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:53-60,121-140]; cardinal rules say every value must trace to `tokens.json` or be removed in extraction mode [SOURCE: .opencode/skills/sk-design/design-md-generator/assets/cardinal_rules_card.md:24-52]. | S |
| P3 | Reference | `references/examples/authoring_examples.md` | Adds a few tiny before/after examples for authored style references without expanding the runtime corpus. | `stitch-skill.md` has concrete section examples [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:117-162]; current examples are study artifacts, not resources [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:86-97,100-108]. | S |

### Do Not Add
- Do not weaken extraction fidelity. Existing cardinal rules require every value to trace to tokens, no invented values, and validation score gates [SOURCE: .opencode/skills/sk-design/design-md-generator/assets/cardinal_rules_card.md:34-52].
- Do not absorb interface invention into md-generator. Current family boundary says md-generator captures what exists and interface invents new distinctive direction [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:14,42-45].
- Do not create `design-spec` in this lineage. Gap analysis says new children are findings, not commitments, and the user's scope excludes net-new sub-skills [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:53-59].

## 8. Sequencing
1. Add `shared/register.md` first.
2. Add `design-audit` detector/pre-flight/remediation assets next, because audit gains the most and validates subsequent mode work.
3. Add `design-interface` transform/pre-flight/content assets.
4. Add `design-foundations` data-viz and static-system handoff assets.
5. Add `design-motion` motion-budget and advanced-effect gate.
6. Add `design-md-generator` authoring workflow/templates only after the extraction-vs-author decision card is explicit.

## 9. References
- `.opencode/specs/design/008-sk-design-parent/001-corpus-research/research/research.md`
- `.opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md`
- `.opencode/specs/design/008-sk-design-parent/external/`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
