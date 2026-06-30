# Iteration 4: Remaining UI-Design Operational Checklists

## Focus

This iteration answered the carried-forward question: does the rest of `ui-design` contain net-new operational checklists after excluding already-adopted typography, readable measure, data visualization, and cognitive-law material?

The pass deep-read the remaining `ui-design` skills: `layout-grid`, `law-of-common-region`, `color-system`, `spacing-system`, `dark-mode-design`, `responsive-design`, `illustration-style`, `aesthetic-usability`, and `von-restorff-effect`. It compared them against `sk-design` targets in `design-foundations`, `design-interface`, `design-audit`, and the shared cognitive-law register.

## Actions Taken

- Used iteration 3 as the coverage boundary: `visual-hierarchy` and `law-of-proximity` were already sampled there, and the search/forms/navigation split decision had already landed on a compact interface quality reference. [SOURCE: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/iterations/iteration-003.md:49] [SOURCE: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/iterations/iteration-003.md:91]
- Enumerated the `ui-design` filesystem inventory and treated it as the source of truth for this plugin slice: 14 skills plus 4 commands. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/layout-grid/SKILL.md:2] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/responsive-design/SKILL.md:2]
- Compared layout, spacing, grouping, and responsive skills against `design-foundations/references/layout/layout_responsive.md`, which already owns spacing, rhythm, hierarchy, grid, density, responsive adaptation, input method, and safe-area guidance. [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:2] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:35] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:67]
- Compared color and dark-mode skills against `design-foundations/references/color/palette_theming.md` and `design-foundations/assets/token_starter.md`, which already cover semantic roles, dark-mode semantic token remapping, dark surfaces, and contrast verification. [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:50] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:81] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:107]
- Compared cognitive-law and polish skills against `shared/cognitive_laws.md`, `design-interface/references/design-process/design_principles.md`, and `design-audit/references/critique_hardening.md`. [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:48] [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:52] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/design_principles.md:72] [SOURCE: .opencode/skills/sk-design/design-audit/references/critique_hardening.md:78]

## Findings

### 1. The remaining `ui-design` slice has net-new checklist material, but not a new mode

The plugin adds operational detail, not a missing capability family. The correct homes are existing ones: `foundations` for layout/color/spacing/dark/responsive system craft, `interface` for earned visual distinctiveness and media/illustration direction, `audit` for perceived-quality hardening, and `shared/cognitive_laws.md` only if a compact cognitive-law wording needs refinement.

`sk-design` already routes the broad territory: `design-foundations` owns color, typography, layout, spacing, hierarchy, responsive adaptation, themes, and tokens. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:15] The remaining corpus skills mainly strengthen checklists around grid contracts, containment restraint, density modes, dark-mode media, illustration usage, and isolation inflation.

No new mode is justified. A new `ui-design` or `visual-system` mode would duplicate `foundations` and blur the build/visual scope line.

### 2. Adopt grid, density, and containment refinements into `foundations`

`layout-grid` gives a concise grid contract: columns, gutters, margins, breakpoints, grid types, responsive behavior, testing every breakpoint, and intentional grid-breaking for emphasis. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/layout-grid/SKILL.md:10] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/layout-grid/SKILL.md:19] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/layout-grid/SKILL.md:29]

`layout_responsive.md` already has strong layout guidance: use grid for dashboards/page composition, flex for one-dimensional internals, named grid areas for complex breakpoint changes, no nested cards, content-driven breakpoints, and verification for no horizontal scroll, touch targets, and wide-screen survival. [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:67] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:92] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:139]

Minimal build edit: add a compact "grid contract" bullet group under `layout_responsive.md` Section 4 or Verification: define columns/gutters/margins per breakpoint, name what changes at each breakpoint, test the middle breakpoints, and permit grid-breaking only when the visual emphasis is intentional.

`spacing-system` also adds one useful missing operational distinction: compact, comfortable, and spacious density modes. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/spacing-system/SKILL.md:29] `token_starter.md` already records the Brand/Product density choice and a spacing scale. [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:20] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:88] Minimal build edit: add a one-line density-mode rule to `layout_responsive.md` Section 2 or `token_starter.md` Section 4: density changes by stepping through the same spacing scale, not by inventing new values.

`law-of-common-region` is already represented in the shared law register, but the corpus has stronger craft language: use proximity first, add containment only when the boundary must be explicit, limit nested common regions, and use the weakest container that works. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/law-of-common-region/SKILL.md:22] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/law-of-common-region/SKILL.md:33] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/law-of-common-region/SKILL.md:37] This maps to `layout_responsive.md` Section 3/4, where the target already says containers come after proximity and cards are not for every piece of content. [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:56] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:72]

Adoption backlog item: strengthen `foundations` layout with a small grid/density/containment checklist. Home: `design-foundations/references/layout/layout_responsive.md`, plus optional density wording in `design-foundations/assets/token_starter.md`. Leverage: high. Effort: low.

### 3. Color-system is mostly duplicate; dark-mode media checks are the useful gap

`color-system` asks for brand, neutral, semantic, and extended palettes, with text/UI contrast, non-color meaning, tonal scales, usage guidance, color-blindness checks, and dark-mode mappings. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/color-system/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/color-system/SKILL.md:19] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/color-system/SKILL.md:29]

That is already stronger and more specific in `palette_theming.md`: registers, semantic token layers, palette roles, tinted neutrals, dark-mode surfaces, dosage rules, and verification. [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:35] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:50] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:60] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:104]

`dark-mode-design` does add a practical media edge case: dim large bright images, provide dark-variant illustrations/logos, avoid bright media slabs, and keep dark surfaces hierarchical by lightness rather than shadows. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/dark-mode-design/SKILL.md:14] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/dark-mode-design/SKILL.md:24] `palette_theming.md` already owns dark surfaces and optical image separators, but does not explicitly check logos/illustrations/large media in dark mode. [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:81] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:94]

Minimal build edit: add one dark-mode verification bullet to `palette_theming.md` Section 8: logos, illustrations, screenshots, and large media blocks have dark-safe variants or treatment, and do not become unintended glare fields.

Adoption backlog item: dark-mode media treatment check. Home: `design-foundations/references/color/palette_theming.md`, Section 8. Leverage: medium. Effort: low.

### 4. Responsive-design is covered; do not re-import it

`responsive-design` covers fluid/adaptive/mobile-first/content-first strategy, common breakpoints, column drop/reflow/off-canvas/priority-plus patterns, input methods, responsive images, real-device testing, orientation, slow connections, and accessibility at each breakpoint. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/responsive-design/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/responsive-design/SKILL.md:19] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/responsive-design/SKILL.md:24] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/responsive-design/SKILL.md:33]

`adaptation_matrix.md` already exceeds this by treating responsive design as context adaptation across device, input, connection, and usage posture. [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md:35] It also covers input detection, responsive images, content-driven breakpoints, core-functionality preservation, and real-device verification. [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md:66] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md:97] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md:120]

Ruled out: importing `responsive-design` as a separate reference or backlog item. The target is already better. At most, the future build can mention "priority-plus" as an example if navigation/component overflow work grows, but that belongs with the interface flow-floor item from iteration 3, not this foundations pass.

### 5. Illustration-style is a real interface gap if kept build-facing

`illustration-style` contains an operational style contract: geometric vs organic, flat vs dimensional, detailed vs minimal, abstract vs representational, line style, palette subset, dark variants, types of illustration, usage rules, size constraints, grid alignment, animation guidance, display-size testing, and accessibility. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/illustration-style/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/illustration-style/SKILL.md:15] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/illustration-style/SKILL.md:25] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/illustration-style/SKILL.md:31]

`design_principles.md` tells the interface skill to ground hero choices in the subject and make a signature element, but it does not give a compact media/illustration contract when the signature is visual media. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/design_principles.md:36] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/design_principles.md:42] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/design_principles.md:58]

Minimal build edit: add a short "media and illustration contract" paragraph or bullets to `design_principles.md` near the plan section: if using illustration/media, choose one style axis set, derive color from the product palette, define when it appears and when it does not, test at intended sizes, provide dark-safe variants, and never make illustration the only carrier of meaning.

Ruled out: contributor process, reusable illustration libraries, and representation-governance programs. Those are design-system/lifecycle responsibilities unless a concrete build is asking for the asset system.

Adoption backlog item: interface media/illustration contract. Home: `design-interface/references/design-process/design_principles.md`, Section 4. Leverage: medium. Effort: low-medium.

### 6. Von Restorff should strengthen interface restraint, not duplicate cognitive laws

`shared/cognitive_laws.md` already names the Von Restorff effect: distinctive items are memorable, and contrast should make one important action or message stand out rather than making every element louder. [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:52]

The corpus skill is stronger as an operational anti-slop checklist: one or very few items deviate, surrounding items stay visually consistent, the deviation is meaningful, avoid decorative pops of color, avoid multiple competing highlights, pair color with shape/size/weight, audit "isolation inflation", and make the differentiated element survive hover/focus/disabled states and grayscale. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/von-restorff-effect/SKILL.md:14] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/von-restorff-effect/SKILL.md:28] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/von-restorff-effect/SKILL.md:32]

This belongs in `design_principles.md` Section 5, which already says to spend boldness in one place and keep the signature element as the one memorable thing. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/design_principles.md:72]

Minimal build edit: add a compact "earned deviation" rule to interface restraint: one primary visual deviation per screen or section, no decorative accent inflation, and the chosen deviation must survive hover/focus/disabled and non-color checks.

Adoption backlog item: earned-deviation restraint checklist. Home: `design-interface/references/design-process/design_principles.md`, Section 5. Leverage: high. Effort: low.

### 7. Aesthetic-usability mostly reinforces audit polish; user-testing content is out of scope

The corpus version is useful where it names the risk: polish increases perceived usability, but can mask structural problems, especially in trust-critical contexts, rough error states, and inconsistent system usage. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/aesthetic-usability/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/aesthetic-usability/SKILL.md:14] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/aesthetic-usability/SKILL.md:19] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/aesthetic-usability/SKILL.md:21]

The shared register already has the law at a concise level, and `critique_hardening.md` already checks hierarchy, emotional fit, states, copy, accessibility, edge cases, spacing, optical alignment, typography, forms, and responsiveness. [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:48] [SOURCE: .opencode/skills/sk-design/design-audit/references/critique_hardening.md:18] [SOURCE: .opencode/skills/sk-design/design-audit/references/critique_hardening.md:78]

Minimal build edit: add one polish-hardening check to `critique_hardening.md`: in trust-critical flows and state screens, visual inconsistency is not just P3 polish if it makes the product read as broken or unsafe; severity should follow user risk.

Ruled out: importing perceived-quality user studies, first-impression testing, or usability-testing programs into `sk-design`. That belongs to design research/testing workflows.

Adoption backlog item: perceived-quality severity note for audit. Home: `design-audit/references/critique_hardening.md`, Polish Checks. Leverage: medium. Effort: low.

## Questions Answered

- Q1 partially answered for `ui-design`: yes, the remaining plugin contains net-new checklist material, but it is narrow and mostly strengthens existing homes. Adoptable items are grid contracts, density-mode spacing, containment restraint, dark-mode media checks, illustration/media style contracts, earned-deviation restraint, and perceived-quality audit severity.
- Q2 answered for this slice: `foundations` receives layout/spacing/containment and dark-mode media refinements; `interface` receives illustration/media and earned-deviation rules; `audit` receives perceived-quality severity language; no new mode is justified.
- Q3 answered for this slice: wholesale `color-system` and `responsive-design` import is duplicate. Illustration libraries, contributor processes, user-testing programs, perceived-quality studies, and design-system governance are out of scope for sk-design's build/visual phase.
- Q4 updated: add five backlog items: foundations grid/density/containment, foundations dark-mode media verification, interface illustration/media contract, interface earned-deviation rule, and audit perceived-quality severity note.

## Questions Remaining

- Which individual `visual-critique` skills contain concrete rubric language stronger than audit's current critique/hardening references?
- Which `design-systems` skills are practical system-craft versus lifecycle governance, and where do they map without bloating foundations?
- The `interaction-design` root/plugin README skill-count mismatch still needs filesystem confirmation before declaring that plugin fully covered.
- After the eventual build edit, does the expanded interface flow-floor section remain compact enough, or does it need a split then?

## Next Focus

Deep-read `visual-critique` next. Target files: all `external/designer-skills-main/visual-critique/skills/*/SKILL.md` plus `design-audit/references/critique_hardening.md`, `design-audit/references/audit_contract.md`, and `design-audit/assets/audit_report_template.md`. Produce a critique-dimension crosswalk and rule out generic critique language audit already covers.
