# Iteration 2: Interaction State And Flow Structure

## Focus

This iteration deep-read the `interaction-design` plugin, using the filesystem inventory as the source of truth, and compared its state/flow skills against existing `sk-design` motion and interface/audit targets. The focus was narrow: identify net-new state or flow structure beyond `design-motion`'s existing micro-interaction cards, loading guidance, gesture rules, and reduced-motion requirements.

## Actions Taken

- Confirmed the plugin README lists 15 skills, while the filesystem contains 16 skill directories. The unlisted extra skill is `interfaces-that-feel`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/README.md:3] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:1]
- Deep-read all 16 `interaction-design/skills/*/SKILL.md` files and classified each as adoptable, duplicate, partial enhancement, or out of scope for `sk-design`.
- Compared the corpus against current motion coverage: `micro_interactions.md` already covers hover/active/focus/loading/success/error feedback, loading/waiting, gestures, delight boundaries, morphing icons, and implementation handoff fields. [SOURCE: .opencode/skills/sk-design/design-motion/references/micro_interactions.md:35] [SOURCE: .opencode/skills/sk-design/design-motion/references/micro_interactions.md:110] [SOURCE: .opencode/skills/sk-design/design-motion/references/micro_interactions.md:117]
- Compared the corpus against existing motion pattern cards. The target already has shared fields for owner, purpose, states, timing, properties, and reduced motion, plus cards for feedback, loading, state transition, toast, page transition, gesture, and drag-and-drop. [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:22] [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:103]
- Checked adjacent targets for adoption homes: `design-interface/references/design-process/ux_quality_reference.md`, `design-interface/references/design-process/copy_and_mock_data.md`, and `design-audit/references/critique_hardening.md`. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:74] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:53] [SOURCE: .opencode/skills/sk-design/design-audit/references/critique_hardening.md:66]

## Findings

### 1. The count mismatch is real and resolved

`interaction-design/README.md` declares 15 skills and omits `interfaces-that-feel`; the filesystem inventory has 16. Use the filesystem inventory for coverage, not the README list. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/README.md:3] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:1]

Adoption impact: treat `interfaces-that-feel` as a real corpus skill. It is not a separate lifecycle capability; it is taste-led build craft around felt state, copy, timing, and motion.

### 2. `state-machine` is the strongest net-new motion-adjacent adoption

`state-machine` adds a structure current motion cards only hint at: states, events, transitions, actions, guards, impossible states, entry/exit actions, and mapping each state to a UI representation. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/state-machine/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/state-machine/SKILL.md:24] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/state-machine/SKILL.md:31]

Existing `design-motion` has a state transition card, but it stops at `state A -> state B`, trigger, timing, properties, reduced motion, and checks. It does not ask for events, guards, impossible states, side effects, or a full state-to-UI matrix. [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:103]

Correct home: `design-motion/assets/motion_pattern_cards.md`, with a surgical addition after the current state transition card.

Minimal edit: add a "State Machine Fragment" card for components with async or branching behavior. Fields: owner, states, events, valid transitions, guards, impossible states, entry/exit actions, visible UI per state, feedback channel, reduced-motion/state-only fallback, and test notes. This strengthens motion's state handoff without creating a new interaction mode.

Leverage: high. Effort: low-medium.

### 3. Error and feedback flows belong in audit/interface, not only motion

`error-handling-ux` gives a useful hierarchy: prevention, detection, communication, recovery. It also names context-specific error states for forms, pages, network, empty results, and permissions. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/error-handling-ux/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/error-handling-ux/SKILL.md:34] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/error-handling-ux/SKILL.md:38]

`feedback-patterns` adds a channel and hierarchy model: inline/contextual first, then component-level, page-level, and system-level, with timing rules for confirmations, errors, and persistent status. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/feedback-patterns/SKILL.md:30] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/feedback-patterns/SKILL.md:35] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/feedback-patterns/SKILL.md:40]

Existing audit already checks error prevention/recovery through the Nielsen lens and hardening cases such as offline, timeout, auth, rate limit, server error, concurrent submissions, and permission states. [SOURCE: .opencode/skills/sk-design/design-audit/references/critique_hardening.md:39] [SOURCE: .opencode/skills/sk-design/design-audit/references/critique_hardening.md:66]

Correct home: `design-audit/references/critique_hardening.md`, Section 5 hardening checks, with a short error-path checklist. Interface can cite it from `ux_quality_reference.md`, but audit should own the release-quality gate.

Minimal edit: add "Error path shape" bullets: prevent where possible, detect close to source, communicate what happened/why/next step, preserve input, offer retry/undo/alternate path, keep feedback closest to the action, and test happy/error/retry paths.

Leverage: high. Effort: low.

### 4. Search is a net-new interface flow quality floor

`search-ux` is substantially more specific than current `sk-design` coverage. It treats search as an end-to-end flow: entry, autocomplete, search-as-navigation, result layouts, ranking/relevance, filtering/refinement, zero-results recovery, and persistence/refinement behavior. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:16] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:22] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:44] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/search-ux/SKILL.md:50]

Current interface quality covers accessibility, motion, touch, responsive, forms/feedback, and data visualization, but has no search quality floor. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:21] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:74]

Correct home: `design-interface/references/design-process/ux_quality_reference.md`, after Forms and Feedback or as a compact new Search section.

Minimal edit: add a Search quality floor: descriptive placeholder, clear reset, keyboardable suggestions, recent/trending/predicted suggestion ordering, query persistence, result count/context, visible removable filters, tolerant zero-results recovery, and search-as-navigation exact matches.

Leverage: high for product UI. Effort: medium.

### 5. Forms, onboarding, and navigation add flow structure beyond motion

`form-design` adds a detailed form flow checklist: single-column layout, persistent labels, helper text, input type selection, validation on blur, inline/server errors, multi-step progress, back navigation without data loss, saving progress, and high-stakes review steps. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:32] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:38] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/form-design/SKILL.md:44]

Current interface quality only has two form/feedback bullets, so the corpus is stronger here. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:74]

`onboarding-design` contributes in-scope first-run state structure when stripped of analytics lifecycle work: get to value fast, orient rather than educate, progressive onboarding, skippable setup, sample data/demo mode, dismissible tours, and empty states as onboarding. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/onboarding-design/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/onboarding-design/SKILL.md:14] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/onboarding-design/SKILL.md:35] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/onboarding-design/SKILL.md:41]

`navigation-patterns` adds a useful flow taxonomy: global, local, utility, contextual navigation, pattern selection by structure/platform, orientation, wayfinding, reachability, consistency, scent, and resilient active states. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:32] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:41] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/navigation-patterns/SKILL.md:47]

Correct home: `design-interface/references/design-process/ux_quality_reference.md`.

Minimal edit: expand Section 6 into "Forms, Feedback, and Flow States" or add compact subsections for Form, Search, Navigation, and First-run/Empty states. Keep it pass/fail and build-facing; do not import onboarding analytics, activation metrics, first-click testing, or instrumentation programs.

Leverage: high. Effort: medium.

### 6. `interfaces-that-feel` is adoptable taste craft, with a scope guard

`interfaces-that-feel` adds a state-first translation process: name the felt state, find a physical analogue, extract behavioral properties, then apply them through easing, delay, copy, color, spacing, or duration. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:15]

It also gives copy voice by state and emotional timing principles for loading, empty, user error, system error, success, and onboarding. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:25] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/interfaces-that-feel/SKILL.md:33]

Current copy guidance already bans generic "Oops!" error voice, exclamation-heavy status copy, and unstable action names, but it lacks a positive state-voice table. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:53] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:137]

Correct home: `design-interface/references/design-process/copy_and_mock_data.md`, near the status/error copy rules.

Minimal edit: add a small "Copy by interaction state" table. Keep the positive guidance practical: loading is calm and specific, empty is invitational, user error is clear and directive, system error owns the failure and gives a path, success is warm and brief, onboarding is contextual. Avoid importing brand examples or emotional-design theory as a separate workflow.

Leverage: medium-high. Effort: low.

### 7. Mostly duplicates or small enhancements, not new modes

`animation-principles` duplicates current motion strategy: purpose, timing, easing, staging, reduced motion, performance, and interruptibility are already covered with more concrete values in `design-motion`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/animation-principles/SKILL.md:9] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:35]

`micro-interaction-spec` duplicates the existing motion handoff/card idea, but its "trigger, rules, feedback, loops and modes" wording can inform the state-machine card. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/micro-interaction-spec/SKILL.md:9] [SOURCE: .opencode/skills/sk-design/design-motion/references/micro_interactions.md:149]

`gesture-patterns` mostly duplicates current gesture rules and gesture cards. The only small addition worth considering is explicit conflict resolution language: scroll vs swipe direction lock, tap vs long-press timing, system gesture priority. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/gesture-patterns/SKILL.md:18] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/gesture-patterns/SKILL.md:33] [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:155]

`loading-states` is mostly covered, but has one small useful refinement: duration bands and the "over 10s means detailed progress/time estimate/background option" rule. Existing motion has skeleton/progress/cancel/escape but not the explicit duration ladder. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/interaction-design/skills/loading-states/SKILL.md:20] [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:86]

The cognitive-law skills (`hicks-law`, `millers-law`, `fitts-law`, `doherty-threshold`) should not be imported as separate material. The shared base already contains Hick's, Miller's, Fitts's, and Doherty as common rationale. [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:32] [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:36] [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:40] [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:44]

No new `interaction` mode is justified. The adoptable pieces fit existing homes:

| Corpus skill | Classification | Target |
| --- | --- | --- |
| `state-machine` | Adopt | `design-motion/assets/motion_pattern_cards.md` |
| `error-handling-ux` | Adopt | `design-audit/references/critique_hardening.md` |
| `feedback-patterns` | Adopt partial | `design-audit/references/critique_hardening.md` and `design-interface/references/design-process/ux_quality_reference.md` |
| `search-ux` | Adopt | `design-interface/references/design-process/ux_quality_reference.md` |
| `form-design` | Adopt | `design-interface/references/design-process/ux_quality_reference.md` |
| `onboarding-design` | Adopt partial | `design-interface/references/design-process/ux_quality_reference.md` |
| `navigation-patterns` | Adopt partial | `design-interface/references/design-process/ux_quality_reference.md` |
| `interfaces-that-feel` | Adopt partial | `design-interface/references/design-process/copy_and_mock_data.md` |
| `loading-states` | Small enhancement | `design-motion/assets/motion_pattern_cards.md` |
| `gesture-patterns` | Small enhancement | `design-motion/references/micro_interactions.md` |
| `micro-interaction-spec` | Duplicate plus wording | `design-motion/assets/motion_pattern_cards.md` |
| `animation-principles` | Duplicate | none |
| `hicks-law`, `millers-law`, `fitts-law`, `doherty-threshold` | Duplicate shared rationale | none |

## Questions Answered

- Q1 partially answered for `interaction-design`: the net-new or stronger build/visual capabilities are state-machine modeling, error-path shape, feedback hierarchy, search flow quality, richer form flow rules, first-run/empty-state structure, navigation state/IA pattern checks, and state-specific copy voice. Out-of-scope material inside this plugin is analytics, instrumentation, funnel optimization, usability study programs, and IA validation programs.
- Q2 partially answered: the correct homes are existing modes and references. `state-machine` belongs in `motion` pattern cards; error/feedback hardening belongs in `audit`; form/search/navigation/onboarding flow floors belong in `interface`; felt-state copy belongs in the interface content gate. No new mode is justified.
- Q3 partially answered: the conflict risk is turning `sk-design` into a full interaction-strategy or product-growth suite. The build-facing state/flow checklists are adoptable; measurement, activation metrics, analytics, first-click testing, user research, and validation programs should be ruled out.
- Q4 partially answered with the target-traced backlog above.

## Questions Remaining

- Which individual `visual-critique` skills contain concrete rubric language stronger than audit's current critique/hardening references?
- Which `design-systems` skills are practical system-craft versus lifecycle governance, and where do they map without bloating foundations?
- Does `ui-design` contain net-new operational checklists after excluding already-adopted typography, readable measure, data visualization, and cognitive-law material?
- For the eventual build phase, should the interface quality reference become the single compact home for flow floors, or should search/forms/navigation each get separate references? My read: keep one compact home unless the content grows beyond a single page.

## Next Focus

Deep-read `visual-critique` next. It is the cleanest direct target for `design-audit`, and iteration 1 already identified it as high-leverage. Read all `visual-critique/skills/*/SKILL.md` files plus `design-audit/references/critique_hardening.md`, `design-audit/references/audit_contract.md`, and `design-audit/assets/audit_report_template.md`; produce a dimension-to-target crosswalk and rule out generic critique language that audit already covers.

