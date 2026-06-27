# Iteration 1: Capability Map From Plugin READMEs

## Focus

This iteration read the marketplace `README.md`, each of the 9 plugin `README.md` files, and the top-level `sk-design` mode contracts. The goal was to build a first-pass capability map, classify each plugin against sk-design's build/visual scope, identify the strongest deep-read candidates, and record obvious out-of-scope lifecycle material.

## Actions Taken

- Read the designer-skills-main marketplace index. It frames the local design-practice collection as 97 skills and 30 commands across 9 plugins, spanning research, systems, UX strategy, UI, interaction, testing, design ops, toolkit utilities, and visual critique. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md:63]
- Read all 9 plugin `README.md` files and mapped their declared skill lists against sk-design's five modes: `interface`, `foundations`, `motion`, `audit`, and `md-generator`. [SOURCE: .opencode/skills/sk-design/SKILL.md:23]
- Checked sk-design target boundaries. The hub says the mode packets own design logic, the shared base only supplies vocabulary, and generic design work routes to the smallest useful mode. [SOURCE: .opencode/skills/sk-design/SKILL.md:56]
- Checked target mode coverage for foundations, motion, audit, and shared cognitive laws to avoid re-adopting material that already exists. [SOURCE: .opencode/skills/sk-design/SKILL.md:76]

## Findings

### Capability Map

The corpus is not one design-build skill; it is a whole design lifecycle marketplace. The root README separates skills as domain knowledge units and commands as workflows that chain skills together. That matters because sk-design should adopt sharper build/visual guidance, not command-suite lifecycle orchestration. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md:113]

| Plugin | Declared scope | sk-design classification | Best target |
| --- | --- | --- | --- |
| `ui-design` | Layout grids, color systems, typography, responsive patterns, visual hierarchy, data visualization, illustration, Gestalt/perceptual principles. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/ui-design/README.md:2] | Strongly in scope, but much is already represented. | `foundations`, `interface`, shared `cognitive_laws.md`, `audit` for responsive checks. |
| `interaction-design` | Micro-animations, state machines, gestures, error handling, loading, feedback, cognitive laws, forms, onboarding, navigation, search. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/README.md:2] | Strongly in scope for motion and interaction quality; also has interface/audit-adjacent flows. | `motion` first; `audit` and `interface` for states, errors, forms, onboarding, search. |
| `visual-critique` | Seven critique dimensions: hierarchy, brand consistency, composition, typography, color, affordance, information density. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/README.md:3] | Strongly in scope. It is the cleanest audit-mode fit. | `audit`, plus selected references to `interface` and `foundations`. |
| `design-systems` | Tokens, component specs, pattern libraries, naming, accessibility, theming, icons, motion, governance, localization. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/README.md:2] | Partly in scope. System construction is useful; governance/adoption lifecycle is out of scope. | `foundations`, `audit`, `motion`; governance remains ruled out. |
| `prototyping-testing` | Prototype strategy, scenarios, heuristic evaluation, A/B tests, user flows, wireframes, click tests, accessibility test plans. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/README.md:2] | Mostly adjacent/out of scope. Heuristic evaluation and accessibility tests may strengthen audit; testing program design does not belong in sk-design. | `audit` only for heuristic/accessibility checklist extraction. |
| `design-ops` | Critique frameworks, handoff specs, sprints, review gates, versioning, QA, team workflows, debt, impact reporting. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/README.md:2] | Mostly out of scope. A few QA/debt/critique ideas may inform audit, but ops and handoff workflows belong elsewhere. | `audit` for QA/debt signals; most material ruled out. |
| `designer-toolkit` | Rationale, presentations, case studies, token audits, UX writing, adoption, negotiation. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/README.md:2] | Mixed but mostly adjacent. UX writing and token audit are sk-design-adjacent; presentation/case-study/adoption/negotiation are not. | `interface` copy gates and `audit` token/copy checks only. |
| `design-research` | Personas, empathy maps, journey maps, interviews, usability tests, card sorting, surveys, research repositories. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-research/README.md:3] | Out of scope. Useful upstream input, not sk-design-owned workflow. | None for adoption; cite as upstream context only. |
| `ux-strategy` | Competitive analysis, principles, experience maps, north star, opportunities, briefs, stakeholders, metrics, IA, content strategy, service blueprints. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/ux-strategy/README.md:2] | Mostly out of scope. IA/content can inform interface decisions, but strategic lifecycle ownership is not sk-design's job. | Possibly `interface` intake language later; no mode adoption yet. |

### Alignment With Existing sk-design

The strongest overlap is already encoded in sk-design. The hub explicitly routes visual direction to `interface`, static systems to `foundations`, temporal interaction to `motion`, and critique/hardening to `audit`. [SOURCE: .opencode/skills/sk-design/SKILL.md:23]

The shared cognitive-law base already contains Hick's Law, Miller's Law, Fitts's Law, the Doherty Threshold, the Aesthetic-Usability Effect, Von Restorff, Proximity, and Common Region. That overlaps the `ui-design` and `interaction-design` cognitive-law skills, so those should not be re-imported as separate workflows. [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:32]

`foundations` already names the static-system territory that most of `ui-design` targets: color, type, spacing, layout, hierarchy, grids, responsive adaptation, data visualization, and token vocabulary. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:15]

The foundations corpus map already traces designer-skills-main `typography-scale`, `readable-measure`, and `data-visualization` into existing target files. That makes those skills duplicates unless deep-reading finds a stronger checklist than what is already present. [SOURCE: .opencode/skills/sk-design/design-foundations/references/corpus_map.md:39]

`motion` already owns animation purpose, micro-interactions, loading motion, gesture behavior, feedback, reduced motion, and motion performance boundaries. The `interaction-design` plugin is still high priority, but likely for state-machine/error/search/form specificity rather than generic animation basics. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:23]

`audit` already owns design QA, accessibility, performance, responsive behavior, theming, anti-pattern detection, hardening, severities, and a 5-dimension score. `visual-critique` is probably best adopted as a crosswalk into audit dimensions and owner-routing, not as a new mode. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:15]

### Prioritized Adoption Backlog

1. Add a visual-critique dimension crosswalk to `design-audit`.
   Source: `visual-critique` seven dimensions. Target: `design-audit/references/critique_hardening.md`, `design-audit/references/audit_contract.md`, and `assets/audit_report_template.md`. Leverage: high. Effort: low-medium. Reason: it cleanly strengthens audit's critique vocabulary without changing scope. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/README.md:9]

2. Deep-read `interaction-design` for state-machine, error-flow, feedback, forms, onboarding, navigation, and search patterns.
   Source: plugin README skill list. Target: `design-motion/references/micro_interactions.md`, `design-audit/references/critique_hardening.md`, and `design-interface/references/design-process/ux_quality_reference.md`. Leverage: high. Effort: medium. Reason: sk-design has motion primitives, but this corpus may add better state and flow-level interaction structure. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/README.md:4]

3. Deep-read the in-scope subset of `design-systems`: token, component-spec, theming, icon-system, motion-system, localization, accessibility.
   Source: design-systems skill list. Target: `design-foundations` token/layout/color references, `design-motion` motion-system references, and `design-audit` accessibility/localization hardening. Leverage: medium-high. Effort: medium. Rule out governance and adoption as lifecycle work. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/README.md:4]

4. Deep-read `ui-design` only after checking existing coverage, focusing on layout-grid, color-system, dark-mode, responsive-design, illustration-style, and data-visualization for concrete checklists.
   Source: ui-design skill list. Target: `design-foundations/references/color/*`, `design-foundations/references/layout/*`, `design-foundations/references/data_viz.md`, and `shared/cognitive_laws.md`. Leverage: medium. Effort: low-medium. Reason: typography/readable-measure/data-viz and cognitive laws are already partly adopted. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/ui-design/README.md:4]

5. Park `designer-toolkit` for a later focused pass on UX writing and token audit only.
   Source: toolkit skill list. Target: `design-interface/references/design-process/copy_and_mock_data.md` and `design-audit/references/anti_patterns_production.md`. Leverage: medium. Effort: low. Rule out rationale decks, case studies, adoption, negotiation. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/README.md:4]

### Ruled Out Early

- Do not create a `research`, `strategy`, `ops`, or `testing` mode inside sk-design. The hub already says new modes require escalation, and the current corpus split can be handled by existing modes plus explicit exclusions. [SOURCE: .opencode/skills/sk-design/SKILL.md:96]
- Do not absorb designer-skills-main commands as sk-design workflows. The corpus itself treats commands as chained workflows, while sk-design is a five-mode taste/build/visual family. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md:117]
- Do not adopt design-research discovery, UX strategy, design ops process, stakeholder alignment, impact reporting, case studies, presentations, or adoption strategy into sk-design. They are lifecycle and organizational capabilities, not visual/build craft.

## Questions Answered

- Q1 partially answered: the in-scope domains are UI craft, visual-system specifics, motion/interaction behavior, critique/audit dimensions, and selected design-system construction. The out-of-scope domains are design research, UX strategy lifecycle, design ops, testing program design, governance, adoption, presentations, case studies, negotiation, and stakeholder/reporting work.
- Q2 partially answered: the right homes are mostly existing modes: `visual-critique` -> `audit`; `interaction-design` -> `motion` plus `audit/interface`; `ui-design` and in-scope `design-systems` -> `foundations`; `designer-toolkit` copy/token checks -> `interface/audit`. No new mode is justified from README evidence.
- Q3 partially answered: the main conflict is lifecycle breadth. designer-skills-main spans full design practice; sk-design deliberately owns taste-led build/visual judgment and does not own research, strategy, ops, or validation-program lifecycle work.
- Q4 partially answered: the backlog above is prioritized by alignment and likely leverage, but exact file anchors require deep-reading the individual skill files.

## Questions Remaining

- Which individual `visual-critique` skills contain concrete rubric language stronger than audit's current critique/hardening references?
- Which `interaction-design` skills add net-new state or flow structure beyond motion's existing micro-interaction and reduced-motion guidance?
- Which `design-systems` skills are practical system-craft versus lifecycle governance, and where do they map without bloating foundations?
- Does `ui-design` contain net-new operational checklists after excluding already-adopted typography, readable measure, data visualization, and cognitive-law material?
- The root README says `interaction-design` has 16 skills, while its plugin README lists 15. The next pass should use filesystem skill inventory as the source of truth before declaring coverage complete. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md:73]

## Next Focus

Deep-read `visual-critique` first because it is the cleanest direct fit for `design-audit`: read all seven `visual-critique/skills/*/SKILL.md` files plus `design-audit/references/critique_hardening.md`, `design-audit/references/audit_contract.md`, and `design-audit/assets/audit_report_template.md`. Produce a dimension-to-target crosswalk and separate true audit improvements from duplicate critique language.

Then deep-read `interaction-design`, using the filesystem inventory rather than only the plugin README, because the root/plugin count mismatch could hide an unlisted skill.
