# Iteration 3: Interface Flow Quality Home

## Focus

This iteration answered the carried-forward build-phase question: should search, forms, and navigation flow floors live in one compact interface quality reference, or split into separate references? The pass also advanced coverage beyond iteration 2 by deep-reading `navigation-patterns` and two `ui-design` structure skills (`visual-hierarchy`, `law-of-proximity`) against the existing `design-interface` targets.

## Actions Taken

- Re-read iteration 2 to avoid repeating the already-completed interaction-design capability map and to preserve its target-traced backlog. [SOURCE: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/iterations/iteration-002.md:49] [SOURCE: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/iterations/iteration-002.md:61]
- Compared the proposed flow-floor additions against `design-interface/references/design-process/ux_quality_reference.md`, which already defines itself as the objective quality floor and says it is used for accessibility, motion, touch, responsive, forms, and charts. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:17] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:29] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:36]
- Checked interface routing and delivery gates. `design-interface/SKILL.md` routes "quality floor" work to the UX quality reference, while mechanical and content gates remain separate because they own different jobs. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:77] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:118] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:214] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:225]
- Deep-read `navigation-patterns` as the missing interaction flow skill from the current focus area, then checked `search-ux` and `form-design` direct source lines for concrete flow-floor bullets. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:8] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:8] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:8]
- Sampled `ui-design` structure skills for support material: `visual-hierarchy` and `law-of-proximity`. These are useful for pass/fail layout scanning, but not enough to justify new references. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/visual-hierarchy/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/law-of-proximity/SKILL.md:14]

## Findings

### 1. Keep one compact interface quality home for flow floors

The right build-phase target is still `design-interface/references/design-process/ux_quality_reference.md`, not three new references. The existing file is explicitly the objective pass/fail quality floor, and interface routing already loads it for "quality floor", forms, accessibility, charts, and related implementation checks. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:17] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:77] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:118]

Minimal edit for the future build phase: expand Section 6 from `FORMS AND FEEDBACK` into `FORMS, SEARCH, NAVIGATION, AND FEEDBACK`, keeping it around 12-18 bullets total. If it grows beyond a single compact screen/page after implementation, split later; splitting before then creates routing and maintenance overhead without adding judgment.

Adoption backlog item: add compact pass/fail bullets for form layout/validation, search entry/results/zero-state, navigation orientation/active states, and feedback/error proximity. Home: `design-interface/references/design-process/ux_quality_reference.md`, around Section 6. Leverage: high. Effort: low-medium.

### 2. Search is adoptable as a quality floor, but search analytics is out of scope

`search-ux` gives concrete build-facing rules: descriptive search input, clear reset, suggestions after 2-3 characters, keyboard navigation, search-as-navigation exact matches, result count, matched-field context, visible filters, removable applied filters, and zero-results recovery. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:16] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:22] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:32] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:44] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:50]

The analytics section should be ruled out for `sk-design`: top queries, zero-results logs, refinement rate, click position, and abandonment are product instrumentation/research concerns, not build/visual craft. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:57]

Minimal edit: add search bullets to the UX quality floor, but phrase them as observable UI states, not measurement programs.

### 3. Forms need a richer quality floor, not a standalone form-design reference

Current `ux_quality_reference.md` has only two form bullets: persistent labels and specific inline errors. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:74] The corpus is stronger: single-column layout, field width as affordance, top-aligned labels, grouped related fields, persistent labels, helper text placement, input type matching, validation on blur, server errors surfaced inline where possible, progress for multi-step forms, back navigation without data loss, progress saving, and discard confirmation. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:14] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:20] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:32] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:38]

Do not import field-level abandonment measurement or user-testing programs into `sk-design`; those remain design research / product optimization. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:53]

Minimal edit: keep the existing accessibility bullets and add a small form-flow floor to Section 6. The pre-flight card already checks form contrast, label placement, error placement, and hit areas, so the UX quality reference should own the broader flow shape while the pre-flight card stays the final binary checklist. [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:78]

### 4. Navigation adds missing orientation and active-state checks

`navigation-patterns` is in scope when stripped down to build-facing checks: global/local/utility/contextual navigation roles, platform fit, pattern selection by structure, orientation, wayfinding, reachability, consistency, scent, and active state resilience. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:32] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:41] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:47]

The target already has mechanical nav checks in `mechanical_defaults.md`: desktop navigation must render on one line, stay under 80px, condense labels or move secondary items if it does not fit, and avoid breaking wide-screen layout. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:112] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:115]

Minimal edit: put semantic navigation checks in the UX quality floor: visible current location, active state not color-only, no mixed nav levels in one component, labels match user language, desktop nav does not wrap, and mobile primary destinations stay reachable. First-click tests and task-based nav validation are out of scope for `sk-design`; they belong to research/testing workflows. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:61]

### 5. UI-design hierarchy/proximity supports compact flow bullets

`visual-hierarchy` and `law-of-proximity` add useful phrasing for scanning and grouping: size, weight, contrast, spacing, position, density, hierarchy levels, one primary action per view, spacing ratios between groups, and label/input proximity. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/visual-hierarchy/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/visual-hierarchy/SKILL.md:22] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/visual-hierarchy/SKILL.md:32] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/law-of-proximity/SKILL.md:14] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/law-of-proximity/SKILL.md:20]

These do not justify a new mode or separate reference. `sk-design` already has foundations for layout/spacing and interface mechanical gates for structural defaults. The adoptable part is a few pass/fail flow-floor clauses: related controls are visually grouped, primary action is unambiguous, labels attach to the right fields, destructive actions are separated, and hierarchy survives a squint scan.

### 6. Reference split rule for the build phase

Use one compact home by default. Split only if the future edit violates one of these constraints:

- The Section 6 addition cannot stay under roughly one compact page.
- The material stops being pass/fail and becomes a how-to playbook.
- The content needs different routing triggers or different ownership than `UX_QUALITY`.
- Search/forms/navigation begin carrying lifecycle content such as analytics, first-click testing, field abandonment measurement, or IA validation programs.

This rule keeps the adoption backlog surgical and protects the core scope line: `sk-design` owns taste-led build/visual quality, not full design-ops, research, or product strategy.

## Questions Answered

- Q1 partially answered for the current slice: adoptable net-new material is search result/zero-state quality, richer form flow rules, navigation orientation/active-state checks, and UI hierarchy/proximity phrasing for scanability. Out-of-scope material is search analytics, first-click testing, task-based nav validation, field-level abandonment measurement, and user-testing programs.
- Q2 answered for this focus: the correct home is `design-interface/references/design-process/ux_quality_reference.md`, Section 6, with `interface_preflight_card.md` and `mechanical_defaults.md` remaining complementary gates rather than new homes.
- Q3 answered for this focus: separate search/forms/navigation references would pull `sk-design` toward lifecycle playbooks. Keep the flow-floor content build-facing and observable.
- Q4 updated: add one high-leverage, low-medium-effort backlog item to expand the interface UX quality floor; rule out separate references until the compact section becomes too large or ownership diverges.

## Questions Remaining

- Which individual `visual-critique` skills contain concrete rubric language stronger than audit's current critique/hardening references?
- Which `design-systems` skills are practical system-craft versus lifecycle governance, and where do they map without bloating foundations?
- Does the rest of `ui-design` contain net-new operational checklists after excluding already-adopted typography, readable measure, data visualization, and cognitive-law material?
- After the eventual build edit, does the expanded flow-floor section remain compact enough, or does it need a split then?

## Next Focus

Deep-read `visual-critique` next. It is the cleanest direct target for `design-audit`: read all `visual-critique/skills/*/SKILL.md` files plus `design-audit/references/critique_hardening.md`, `design-audit/references/audit_contract.md`, and `design-audit/assets/audit_report_template.md`; produce a critique-dimension crosswalk and rule out generic critique language audit already covers.
