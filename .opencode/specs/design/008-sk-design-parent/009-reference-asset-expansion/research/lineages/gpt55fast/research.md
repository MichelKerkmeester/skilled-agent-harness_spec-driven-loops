# Deep-Research Synthesis: sk-design Reference and Asset Expansion Matrix

> Packet: `154-sk-design-parent/009-reference-asset-expansion`  
> Lineage: `gpt55fast`  
> Executor metadata: `cli-opencode`, `openai/gpt-5.5-fast`  
> Status: complete after 10 iterations, final `newInfoRatio` 0.03

## 1. Verdict

The highest-leverage expansion is not a bulk import of the external corpus. It is a small set of operational references and prompt-card assets that make the current five-mode family easier to apply without reopening taxonomy or implementation.

Priority order:

1. Add a shared Brand-vs-Product operating register first. Prior gap analysis marks it must-add and says it gates multiple downstream gaps [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:41].
2. Add mechanical preflight and design-read assets for `interface` and `audit`. `taste-skill` has a concrete checklist surface with mechanical checks for theme, color, shape, hero, eyebrow count, bento, copy, motion, reduced motion, mobile collapse, and Core Web Vitals [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:919].
3. Add mode-specific decision matrices where current docs are principle-heavy: data-viz/adaptation for `foundations`, pattern/performance cards for `motion`, evidence/hardening assets for `audit`, and authoring-boundary guidance for `md-generator`.
4. Explicitly do not add process lifecycle, presentation/canvas workflows, net-new children, or extraction-backend sprawl in this phase [SOURCE: .opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/spec.md:53].

## 2. Evidence Baseline

| Surface | Current state | Implication |
|---|---|---|
| `design-interface` | 13 references, no assets; already owns design process, quality floor, grounding, real UI loop, aesthetics cues, and MCP grounding [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:156] | Add operational checklists and intake references, not more style presets. |
| `design-foundations` | 5 references: OKLCH, palette/theming, typography, layout/responsive, corpus map [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:269] | Add targeted decision matrices around register, data-viz color, adaptation, and density. |
| `design-motion` | 5 references: strategy, micro-interactions, AnimatePresence, performance/reduced motion, corpus map [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:289] | Add reusable pattern cards and failure checklists. |
| `design-audit` | 5 references: score/severity, accessibility/performance, critique/hardening, anti-patterns/production, corpus map [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:312] | Add evidence capture and remediation routing, not implementation. |
| `design-md-generator` | mature extraction/write/validate pipeline; eight core docs plus examples and two assets [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:86] | Add forward-authoring boundaries and prompt skeletons, not another extractor. |

## 3. Per-Mode Expansion Matrix

### 3.1 Shared Base

| Priority | Type | Proposed file | What it adds | Sources | Effort |
|---|---|---|---|---|---|
| P0 | Reference | `shared/register.md` | Brand-vs-Product operating register that gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity. | Prior gap analysis marks register must-add [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:16]; `colorize` defines Brand vs Product color behavior [SOURCE: .opencode/specs/design/008-sk-design-parent/external/colorize.md:14]; `animate` defines Brand vs Product motion behavior [SOURCE: .opencode/specs/design/008-sk-design-parent/external/animate.md:14]. | 1.0d |
| P0 | Asset | `shared/assets/register_card.md` | One-page routing card with Brand/Product questions and downstream defaults for interface, foundations, motion, and audit. | Shared base is vocabulary, not workflow replacement [SOURCE: .opencode/skills/sk-design/shared/anti_slop_principles.md:24]. | 0.5d |

Do not add:

- A new `design-strategy` or UX-research child. This phase is not architecture/taxonomy work [SOURCE: .opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/spec.md:53].
- Whole design-process lifecycle docs from `designer-skills-main`; prior analysis classifies process lifecycle as a scope ruling [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:28].

### 3.2 `design-interface`

| Priority | Type | Proposed file | What it adds | Sources | Effort |
|---|---|---|---|---|---|
| P0 | Reference | `references/design-process/brief_to_dials.md` | Design-read to dials map: variance, motion, density; includes use-case presets and how dials affect layout/motion/density choices. | `taste-skill` sets three dials and says every layout, motion, and density decision is gated by them [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:43]. | 0.75d |
| P0 | Asset | `assets/interface_preflight_card.md` | Mechanical pass/fail card for hero, eyebrow count, layout repetition, bento, real imagery, copy audit, motion motivation, reduced motion, mobile collapse, and AI tells. | Corpus preflight checklist [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:919]; gpt-taste mandatory preflight plan [SOURCE: .opencode/specs/design/008-sk-design-parent/external/gpt-tasteskill.md:67]. | 0.5d |
| P1 | Reference | `references/design-process/redesign_intake.md` | Greenfield vs preserve vs overhaul decision tree; audit-before-touching requirements; what never changes silently. | Redesign mode detection and audit-before-touching contract [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:785]. | 0.75d |
| P1 | Reference | `references/design-process/copy_and_mock_data.md` | Visible-copy self-audit, fake-precision rules, one-copy-register rule, and realistic mock-content guidance. | Copy self-audit and fake number rules [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:321]; prior N1 mock-content gap [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:26]. | 0.75d |
| P1 | Reference | `references/design-process/visual_asset_strategy.md` | When to require real images, generated imagery, Simple Icons/devicon logos, and explicit placeholder slots. | `taste-skill` says landing pages and portfolios are visual products and defines asset priority order [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:262]. | 0.5d |
| P2 | Reference subsection | Add optional `AIDA/gapless bento` subsection under `variation_diversity.md` or `brief_to_dials.md` | Landing-page-only structure and bento math, explicitly not default for product UI. | AIDA and gapless bento evidence [SOURCE: .opencode/specs/design/008-sk-design-parent/external/gpt-tasteskill.md:22], [SOURCE: .opencode/specs/design/008-sk-design-parent/external/gpt-tasteskill.md:42]. | 0.5d |

Do not add:

- More aesthetic preset files as the first expansion. `interface` already has aesthetics cues and the higher-leverage gap is operational discipline [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:166].
- GSAP-first or static-forbidden rules as default interface behavior. They are valid only for specific high-variance landing pages, not all interface work [SOURCE: .opencode/specs/design/008-sk-design-parent/external/gpt-tasteskill.md:46].

### 3.3 `design-foundations`

| Priority | Type | Proposed file | What it adds | Sources | Effort |
|---|---|---|---|---|---|
| P1 | Reference | `references/color/register_color.md` | Applies shared Brand/Product register to color dosage, palette ownership, and semantic-vs-expressive color. | `colorize` Brand/Product register [SOURCE: .opencode/specs/design/008-sk-design-parent/external/colorize.md:14]. | 0.5d |
| P1 | Reference | `references/color/data_visualization_color.md` | Chart, heatmap, comparison, category, status, and accessibility color rules. | `colorize` data visualization section [SOURCE: .opencode/specs/design/008-sk-design-parent/external/colorize.md:85]; prior data-viz should-add [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:24]. | 0.75d |
| P1 | Reference | `references/layout/adaptation_matrix.md` | Device/input/context adaptation matrix for mobile, tablet, desktop, print, and constrained contexts. | `adapt` says adaptation is rethinking for context, not scaling pixels [SOURCE: .opencode/specs/design/008-sk-design-parent/external/adapt.md:37]. | 0.75d |
| P2 | Asset | `assets/density_structure_matrix.md` | Quick matrix for spacing scale, rhythm, Flex vs Grid, container queries, card-grid monotony, density and structure params. | `layout` spacing/system and layout-tool guidance [SOURCE: .opencode/specs/design/008-sk-design-parent/external/layout.md:61]; density/structure params [SOURCE: .opencode/specs/design/008-sk-design-parent/external/layout.md:150]. | 0.5d |
| P2 | Reference subsection | Add greenfield brand-seed color note to `palette_theming.md` | Catches prior N3 without creating a large standalone file. | Gap analysis N3 [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:35]. | 0.25d |

Do not add:

- Another OKLCH basics guide. Current foundations already owns OKLCH conversion, palette generation, contrast, gamut, and review output [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:269].
- A foundations split into separate color/layout/type modes. This phase is not taxonomy work [SOURCE: .opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/spec.md:53].

### 3.4 `design-motion`

| Priority | Type | Proposed file | What it adds | Sources | Effort |
|---|---|---|---|---|---|
| P1 | Reference | `references/motion_register.md` | Brand/Product motion budget and default duration differences; prevents scattered brand motion in task UIs and under-animated brand surfaces. | `animate` Brand/Product register [SOURCE: .opencode/specs/design/008-sk-design-parent/external/animate.md:14]. | 0.5d |
| P1 | Asset | `assets/motion_pattern_cards.md` | Cards for loading, feedback, state transitions, page transitions, gesture, toast, drag/drop, hover, and focus patterns with owner/state fields. | `interaction-design` pattern list [SOURCE: .opencode/specs/design/008-sk-design-parent/external/interaction-design.md:10]. | 0.75d |
| P1 | Asset | `assets/animate_presence_checklist.md` | Exit wrapper, exit prop, key, symmetry, presence hook, safeToRemove, mode, and nested-exit checks. | AnimatePresence priority categories and rules [SOURCE: .opencode/specs/design/008-sk-design-parent/external/mastering-animate-presence.md:21]. | 0.5d |
| P1 | Asset | `assets/motion_performance_failure_card.md` | Failure-mode card for layout thrash, scroll polling, endless rAF, mixed systems, layer promotion, paint-heavy effects, and blur. | `fixing-motion-performance` quick reference [SOURCE: .opencode/specs/design/008-sk-design-parent/external/fixing-motion-performance.md:52]. | 0.5d |
| P2 | Reference subsection | Add `polish_details` to `micro_interactions.md` | Concentric radii, optical alignment, tabular numbers, image outlines, scale-on-press, and transition-property rules. | `make-interfaces-feel-better` core principles [SOURCE: .opencode/specs/design/008-sk-design-parent/external/make-interfaces-feel-better.md:19]. | 0.5d |

Do not add:

- Overdrive/advanced rendering as core motion behavior. Prior gap analysis classifies advanced rendering as nice-to-have [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:30].
- A default rule that all interfaces must be motion-rich. Current success criteria require motion not to exhaust the user [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:306].

### 3.5 `design-audit`

| Priority | Type | Proposed file | What it adds | Sources | Effort |
|---|---|---|---|---|---|
| P1 | Reference | `references/evidence_capture.md` | Evidence model for file/source target resolution, browser evidence, deterministic scans, screenshot/overlay notes, and fallback labels. | `critique` requires independent assessment and detector/browser evidence [SOURCE: .opencode/specs/design/008-sk-design-parent/external/critique.md:12]. | 1.0d |
| P1 | Asset | `assets/a11y_quick_fixes.md` | Snippet-level fixes for accessible names, keyboard, focus/dialogs, semantics, forms/errors, announcements, contrast, and motion. | `fixing-accessibility` priority categories and quick fixes [SOURCE: .opencode/specs/design/008-sk-design-parent/external/fixing-accessibility.md:33]. | 0.75d |
| P1 | Reference | `references/hardening_edge_cases.md` | Production-readiness matrix for extreme inputs, API/network errors, permissions, rate limits, concurrency, i18n, RTL, text expansion, and CJK/emoji. | `harden` edge-case assessment [SOURCE: .opencode/specs/design/008-sk-design-parent/external/harden.md:14]. | 0.75d |
| P1 | Reference | `references/transform_remediation.md` | Maps bolder/quieter/distill/redesign verbs to findings, owner mode, and accepted remediation path. | Prior gap analysis flags transform verbs and redesign/remediation as should-adds [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:17]. | 0.75d |
| P2 | Asset | `assets/audit_report_template.md` | Findings-first report skeleton with score, anti-pattern verdict, positive findings, priority issues, owner mapping, and evidence caveats. | `audit` five-dimension score and severity contract [SOURCE: .opencode/specs/design/008-sk-design-parent/external/audit.md:12]. | 0.5d |

Do not add:

- Fix implementation into audit. Current audit integration delegates direction to interface, color/type/layout to foundations, motion to motion, and implementation to sk-code [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:337].
- Full two-sub-agent critique orchestration from `critique.md`; keep only evidence principles unless a later workflow packet owns orchestration.

### 3.6 `design-md-generator`

| Priority | Type | Proposed file | What it adds | Sources | Effort |
|---|---|---|---|---|---|
| P1 | Reference | `references/authoring_boundary.md` | Distinguishes measured extraction, brief-authored Style Reference, and hybrid extension; defines source-of-truth labels and fidelity constraints. | Current cardinal fidelity rule [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:248]; `stitch-skill` forward authoring goal [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:17]. | 1.0d |
| P1 | Asset | `assets/source_of_truth_router_card.md` | Quick card that asks: measured tokens, brief-provided values, inferred style direction, or missing backing data? Prevents fabricated values. | v3 format cardinal rules [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:27]. | 0.5d |
| P1 | Asset | `assets/brief_to_style_reference_prompt.md` | Prompt skeleton for non-extraction authoring that requires explicit labels for measured, brief-provided, inferred, and absent sections. | `stitch-skill` output structure [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:115]; writing guide voice rules [SOURCE: .opencode/skills/sk-design/design-md-generator/references/writing_style_guide.md:29]. | 0.75d |
| P2 | Reference subsection | Add component decision examples to `component_taxonomy.md` | Enriches component selection guide with examples for dialog/toast/banner, card/list/table, dropdown/radio/segmented control where needed. | Current component taxonomy already defines Use lines and decision logic [SOURCE: .opencode/skills/sk-design/design-md-generator/references/component_taxonomy.md:347]. | 0.25d |

Do not add:

- A second extraction backend or crawler path. Current pipeline already extracts, writes, validates, and reports [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:206].
- A rename or new `design-spec` child in this phase. The phase scope excludes taxonomy changes [SOURCE: .opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/spec.md:53].

## 4. Implementation Sequence

| Step | Scope | Why first |
|---|---|---|
| 1 | `shared/register.md` and `shared/assets/register_card.md` | Gates multiple mode decisions and prior gap analysis marks it must-add. |
| 2 | `design-interface/assets/interface_preflight_card.md` plus `brief_to_dials.md` | Highest operator leverage; converts taste corpus into repeatable checks. |
| 3 | `design-audit/references/evidence_capture.md` and `assets/a11y_quick_fixes.md` | Makes review/fix guidance evidence-backed before new content expands. |
| 4 | `foundations` register/data-viz/adaptation references | Completes static visual-system gaps without duplicating basics. |
| 5 | `motion` pattern/performance assets | Packages already-known rules into reusable cards. |
| 6 | `md-generator` authoring boundary and prompt skeleton | Adds forward authoring while protecting cardinal fidelity. |

## 5. Do-Not-Add List

- Do not reopen parent taxonomy or architecture.
- Do not create net-new sub-skills.
- Do not import the full `designer-skills-main` process lifecycle.
- Do not import slides/canvas/poster workflows into the five current modes unless a later scope ruling approves presentation work.
- Do not add generic anti-truncation output guidance; prior analysis classifies `output-skill` as out-of-family [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:36].
- Do not add GSAP-heavy or motion-rich defaults to all interface/motion work.
- Do not expand `md-generator` by inventing values or weakening `tokens.json` fidelity.
- Do not add large references without an associated mode owner and a concrete operator action.

## 6. Residual Risks

- Exact effort estimates are inferred from document size and current skill patterns; implementation should calibrate them against template and validation work.
- Some external corpus advice is aggressive and landing-page-specific. Implementation must label those references as conditional rather than default.
- `md-generator` forward authoring is the highest-risk addition because it can blur measured vs inferred truth. It needs explicit source labels and validation language before use.

## 7. References

### Prior research

- `.opencode/specs/design/008-sk-design-parent/001-corpus-research/research/research.md`
- `.opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md`
- `.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/spec.md`

### Live skill state

- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/shared/anti_slop_principles.md`

### External corpus

- `external/taste-skill.md`
- `external/gpt-tasteskill.md`
- `external/colorize.md`
- `external/layout.md`
- `external/adapt.md`
- `external/interaction-design.md`
- `external/animate.md`
- `external/mastering-animate-presence.md`
- `external/fixing-motion-performance.md`
- `external/make-interfaces-feel-better.md`
- `external/audit.md`
- `external/critique.md`
- `external/fixing-accessibility.md`
- `external/harden.md`
- `external/stitch-skill.md`
