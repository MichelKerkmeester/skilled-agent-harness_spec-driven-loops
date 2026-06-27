# Iteration 6: Remaining Corpus Build-Facing Checks

## Focus

This iteration tested whether the remaining corpus outside `interaction-design` and the already-read `ui-design` slice contains high-leverage, build-facing checks not yet captured in the backlog.

The pass focused on two likely sources: all seven `visual-critique` skills, because they map cleanly to `design-audit`, and the build-facing slice of `design-systems`, because it may strengthen tokens, components, themes, localization, and motion without importing governance.

## Actions Taken

- Re-read the current strategy, state log, and prior iteration narratives to avoid repeating the already-covered `interaction-design` and `ui-design` findings. Iteration 5 closed the interaction-design inventory mismatch, and iteration 4 already covered the remaining `ui-design` checklist slice. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research/research/iterations/iteration-005.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research/research/iterations/iteration-004.md:5]
- Used the filesystem inventory as source of truth for the remaining corpus and selected `visual-critique` plus the build-facing `design-systems` subset for this iteration.
- Deep-read all seven `visual-critique` skills: affordance, brand consistency, color, composition, information density, typography, and visual hierarchy.
- Sampled high-signal `design-systems` skills: `component-spec`, `design-token`, `theming-system`, `motion-system`, `icon-system`, `localization-design`, plus `design-system-governance` as a negative control.
- Compared the corpus against live `sk-design` targets: `design-audit/references/critique_hardening.md`, `design-audit/references/audit_contract.md`, `design-audit/references/anti_patterns_production.md`, `design-foundations/assets/token_starter.md`, `design-foundations/references/color/palette_theming.md`, `design-foundations/references/layout/adaptation_matrix.md`, `design-motion/references/motion_strategy.md`, and `design-interface/references/design-process/ux_quality_reference.md`.

## Findings

### 1. Yes: the remaining corpus contains high-leverage build-facing checks

The strongest net-new material is not a new mode. It is a compact audit crosswalk. Current audit guidance already checks cognitive load, Nielsen heuristics, personas, hardening cases, polish, and evidence limits, but it does not name concrete visual critique dimensions in a way an audit agent can scan consistently. [SOURCE: .opencode/skills/sk-design/design-audit/references/critique_hardening.md:20] [SOURCE: .opencode/skills/sk-design/design-audit/references/critique_hardening.md:46] [SOURCE: .opencode/skills/sk-design/design-audit/references/critique_hardening.md:70]

`visual-critique` is stronger here because each skill is already a pass/fail-ish screen critique rubric:

| Corpus skill | Stronger rubric language | Correct sk-design home |
| --- | --- | --- |
| `critique-visual-hierarchy` | Entry point, eye flow, visual weight, and singular earned emphasis. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-visual-hierarchy/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-visual-hierarchy/SKILL.md:26] | `design-audit/references/critique_hardening.md` |
| `critique-composition` | Balance, whitespace, rhythm, and Gestalt grouping. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-composition/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-composition/SKILL.md:28] | `design-audit/references/critique_hardening.md` |
| `critique-information-density` | Cognitive load, content priority, scanning pattern, and progressive disclosure. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-information-density/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-information-density/SKILL.md:28] | `design-audit/references/critique_hardening.md` |
| `critique-affordance` | Clickability signals, state visibility, CTA clarity, and action discoverability. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-affordance/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-affordance/SKILL.md:28] | `design-audit/references/critique_hardening.md` and `design-interface/references/design-process/ux_quality_reference.md` |
| `critique-color` | Measured contrast, palette coherence, semantic color, forced-colors/color-vision checks. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-color/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-color/SKILL.md:28] | `design-audit/references/critique_hardening.md` and `audit_contract.md` |
| `critique-typography` | Scale usage, readability, consistency, token compliance. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-typography/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-typography/SKILL.md:29] | `design-audit/references/critique_hardening.md` |
| `critique-brand-consistency` | Mood, voice, and token compliance, but only when the reference files exist. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-brand-consistency/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-brand-consistency/SKILL.md:14] | `audit_contract.md` evidence rules and `copy_and_mock_data.md` |

Minimal build edit: add a "Visual critique dimension crosswalk" to `design-audit/references/critique_hardening.md` after Section 1 or Section 2. Keep it as a screening lens, not a second score system. Leverage: high. Effort: low-medium.

### 2. Adopt visual-critique's observation/problem/fix shape, but do not import its scoring model

Every `visual-critique` skill uses a useful output rhythm: observation, problem or divergence, fix, and a `pass` / `minor issue` / `major issue` dimension rating. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-affordance/SKILL.md:34] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-brand-consistency/SKILL.md:32] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/visual-critique/skills/critique-color/SKILL.md:33]

`design-audit` already has the correct public severity and reporting contract: P0-P3 findings, five /20 dimensions, evidence rules, and owner routing. [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:15] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:26] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:45]

Minimal build edit: in `audit_contract.md`, add a short note that visual-critique subdimension labels can be used as triage notes, but final findings still map to P0-P3 and the five audit dimensions. This prevents a parallel seven-dimension critique score from creeping into audit.

### 3. Design-systems has adoptable build checks, but governance remains out of scope

`component-spec` is build-facing. Its specification structure covers anatomy, variants, props/API, states, behavior, accessibility, and usage guidelines. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/component-spec/SKILL.md:9] It is stronger than current audit production readiness for component completeness, which currently names missing states, long text overflow, fixed translation containers, RTL issues, offline paths, validation, and media controls. [SOURCE: .opencode/skills/sk-design/design-audit/references/anti_patterns_production.md:58]

Minimal build edit: add a component-contract hardening bullet to `design-audit/references/anti_patterns_production.md` Section 6: reusable components must specify anatomy, variants, all interactive states, responsive behavior, accessibility behavior, and edge cases before they are treated as production-ready. Leverage: high. Effort: low.

`localization-design` is also build-facing when stripped of research/vendor process. It adds exact stress cases missing from the current audit wording: text expansion, RTL mirroring, logical CSS properties, directional icon mirroring, non-Latin script testing, locale-aware date/time/number/currency/address formats, and at least one RTL plus one long-expansion locale before system inclusion. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/localization-design/SKILL.md:18] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/localization-design/SKILL.md:24] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/localization-design/SKILL.md:57] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/localization-design/SKILL.md:62]

Minimal build edit: strengthen `anti_patterns_production.md` Section 6 with an i18n stress row: 130% nav labels, German/Finnish text, one RTL locale, logical properties, directional icon mirroring, and locale-aware numbers/dates/currency. Home could alternatively be `design-foundations/references/layout/adaptation_matrix.md` verification, but audit is the better release gate.

### 4. Theming and motion-system are refinements, not wholesale imports

`theming-system` duplicates much of `palette_theming.md`: semantic tokens, dark mode, brand themes, density, and token-first overrides. The useful additions are high-contrast/dimmed modes, testing every component in every theme, and documenting themeable vs fixed tokens. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/theming-system/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/theming-system/SKILL.md:13] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/theming-system/SKILL.md:25]

`palette_theming.md` already has the stronger posture: semantic token layers, dark surfaces by lightness, color dosage, and verification that text pairs, color meaning, dark surfaces, and hue roles work. [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:50] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:81] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:114]

Minimal build edit: add one verification bullet to `palette_theming.md` Section 8: when multiple themes or density modes are in scope, every component is checked in each mode and fixed-vs-themeable tokens are explicit. Leverage: medium. Effort: low.

`motion-system` is partly duplicate because `motion_strategy.md` already has a concrete timing ladder, easing guidance, staging, materials, and verification. [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:46] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:57] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:93] The useful corpus additions are treating motion as a token layer, limiting duration tokens to 4-6 values, applying reduced-motion overrides globally, and documenting what should not animate. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/motion-system/SKILL.md:11] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/motion-system/SKILL.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/motion-system/SKILL.md:54]

Minimal build edit: add a system-level motion-token note to `motion_strategy.md` verification: product-scale motion should use a small named duration/easing set, global reduced-motion override, and a list of no-motion cases. Leverage: medium. Effort: low.

### 5. Token and icon systems are mostly already covered

`design-token` restates token categories and tiers: color, spacing, typography, elevation, border, motion; global, alias, and component tokens. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/design-token/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/design-token/SKILL.md:16]

`sk-design` already has stronger token scaffolding for color, type, spacing, semantic color, dark surfaces, and handoff checks. [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:20] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:36] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:88] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:122]

`icon-system` adds useful basics around grid, sizes, style, aria labels, pairing icons with text for critical actions, contrast, touch targets, and testing at every size. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/icon-system/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/icon-system/SKILL.md:18] Current `sk-design` already has icon-library, optical alignment, accessible-name, and icon-text checks in interface and motion references. [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:102] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:157] [SOURCE: .opencode/skills/sk-design/design-motion/references/micro_interactions.md:137]

Ruled out: importing token architecture or icon-system docs wholesale. At most, the eventual build phase can add one sentence to the relevant preflight/audit check that critical icon-only actions need text or an accessible name and icon sets should be tested at supported sizes.

### 6. Governance, adoption, and documentation workflows are out of scope

`design-system-governance` is a clean negative control. It is about owners, contribution models, versioning, deprecation, migration support, changelogs, office hours, adoption metrics, and contribution guides. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/design-system-governance/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/design-system-governance/SKILL.md:34] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/design-system-governance/SKILL.md:43] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/design-system-governance/SKILL.md:73]

That material deliberately exceeds `sk-design`. It belongs to design-system operations or team process, not taste-led build/visual guidance. No `design-system-governance`, `visual-critique`, `research`, or `ops` mode is justified from this slice.

## Questions Answered

- Q1 partial: yes, the remaining corpus contains net-new or stronger build-facing checks. The strongest are visual critique dimensions, component completeness, localization stress, theme-mode verification, and system-level motion tokens.
- Q2 partial: correct homes are existing modes and references: visual critique into `design-audit`, component/i18n hardening into `design-audit/references/anti_patterns_production.md`, theme verification into `design-foundations/references/color/palette_theming.md`, and motion-token verification into `design-motion/references/motion_strategy.md`. No new mode is justified.
- Q3 partial: visual critique should not become a separate critique mode or score system, and design-system governance/adoption/versioning/documentation workflows are out of scope.
- Q4 updated: add prioritized backlog items for audit visual-critique crosswalk, audit component/i18n hardening, foundations theme-mode verification, and motion system-level token verification.
- Carried-forward visual-critique question answered: the individual skills do contain concrete rubric language stronger than audit's current critique/hardening reference. The best adoption is a compact dimension crosswalk, not a wholesale import.

## Questions Remaining

- Finish the rest of `design-systems` coverage: which remaining skills are pure docs/lifecycle versus small build-facing checks worth keeping?
- Do `prototyping-testing`, `design-ops`, and `designer-toolkit` contain audit-adjacent material stronger than the now-expanded audit backlog, or are they mostly validation/process wrappers?
- Does the expanded interface flow-floor section remain compact enough after the eventual build edit, or does it need a split then?
- After all remaining plugins are sampled, what is the final priority order across audit, interface, foundations, motion, and explicit ruled-out lifecycle material?

## Next Focus

Deep-read the audit-adjacent subset outside `visual-critique`, `interaction-design`, and `ui-design`: `prototyping-testing/skills/heuristic-evaluation`, `prototyping-testing/skills/accessibility-test-plan`, `design-ops/skills/design-qa-checklist`, `design-ops/skills/design-debt-audit`, `design-ops/skills/design-critique`, plus `designer-toolkit/skills/design-token-audit` and `designer-toolkit/skills/ux-writing`. Compare only their build-facing checks against `design-audit` and `design-interface`; rule out testing programs, ops process, stakeholder process, and reporting.
