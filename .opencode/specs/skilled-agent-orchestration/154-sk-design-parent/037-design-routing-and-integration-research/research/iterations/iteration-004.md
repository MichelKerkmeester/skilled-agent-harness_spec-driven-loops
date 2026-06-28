# Focus

[D1-4 / D1] impeccable shared design-laws not yet adopted: residual numeric craft beyond the 13 already landed, corpus `impeccable-main`.

# Actions Taken

1. Re-read the research strategy and state log to confirm this is iteration 4, research-only, focused on D1 residual corpus craft.
2. Reviewed iterations 1-3 to avoid re-covering harden/optimize/polish, provider AI tell gates, and transform verbs.
3. Searched the real `impeccable-main` corpus for numeric and shared-law guidance, then opened the highest-signal sources: `SKILL.md`, `layout.md`, `typeset.md`, `colorize.md`, `animate.md`, and `live.md`.
4. Compared those source laws against current `sk-design` shared references and mode references: `shared/cognitive_laws.md`, `shared/design_token_vocabulary.md`, `design-foundations` layout/type/color references, `design-motion` strategy, and `design-interface` mechanical/default/live-loop references.

# Findings

## F1 - The remaining shared-law gap is a central numeric law card, not another prose import

Evidence:
- Impeccable keeps cross-cutting numeric rules in the root skill before command-specific routing: contrast thresholds, body line length, hero clamp max, display tracking floor, flex/grid choice, intrinsic grid minimum, z-index scale, motion duration/easing, reduced motion, tinted-neutral chroma, and color commitment percentages all live together in the general rules and new-project rules. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:31] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:38] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:40] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:41] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:49] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:50] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:55] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:57] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:72] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/SKILL.md:74]
- `sk-design` has adopted many individual numbers in mode-local references: foundations carries 4-point spacing, 8-12px tight gaps, 48-96px section gaps, 44px touch targets, 4/8/12 grid columns, and intrinsic `minmax(280px, 1fr)` grids. [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:37] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:40] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:41] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:81] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:90] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:171]
- Typography already carries several adopted numeric laws: 16px mobile body floor, 1.45-1.7 line-height range, 2-3x primary hierarchy contrast, clamp max <= 2.5x min, 45-75 character measure, uppercase tracking around 0.05em to 0.12em, and dark-surface compensation. [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:53] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:54] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:55] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:60] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:92] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:86] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:105]
- The current shared base is conceptual rather than numeric. `cognitive_laws.md` says it is concise rationale vocabulary, and `design_token_vocabulary.md` explicitly says children own the detailed math and implementation guidance behind each token. [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:16] [SOURCE: .opencode/skills/sk-design/shared/cognitive_laws.md:24] [SOURCE: .opencode/skills/sk-design/shared/design_token_vocabulary.md:24] [SOURCE: .opencode/skills/sk-design/shared/design_token_vocabulary.md:28]

Buildable recommendation:
- Add a shared `numeric_design_laws.md` or equivalent shared asset under `sk-design/shared/` that inventories only cross-mode numeric laws and their owners: contrast, readable measure, body floor, display clamp bound, spacing scale, density scaling, touch target floor, timing bands, easing curves, color dosage, dark surface lightness steps, image-edge outline, concentric radius, and live-variant knob bounds.
- Keep ownership explicit: shared card = index and invariants; foundations/motion/interface/audit = detailed application. Do not move all mode logic into shared.
- Add a benchmark check that every numeric law row has `law_id`, value/range, owner mode, enforcement target, source reference, and advisory caveat.

Enforceability:
- ENFORCEABLE on the reference corpus and benchmark fixtures: required rows, owner fields, citations, and per-mode links can be checked deterministically.
- ADVISORY at runtime: the card can prove the law was available and cited; it cannot prove the resulting visual judgment is good without rendered review.

## F2 - Baseline rhythm is the most important residual numeric relationship

Evidence:
- Impeccable's typography reference makes a relational law: body line-height should become the base unit for vertical spacing, with the example `16px * 1.5 = 24px`, and spacing values should then be multiples of that 24px rhythm. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/typeset.md:136] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/typeset.md:138]
- `sk-design` currently holds the relevant pieces separately: the token starter asks for type roles, sizes, line heights, and a 4-point spacing scale, but does not require a baseline rhythm field tying line height to spacing. [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:73] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:75] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:88] [SOURCE: .opencode/skills/sk-design/design-foundations/assets/token_starter.md:90]
- `layout_responsive.md` correctly says space is a design material and defines a 4-point scale, but it does not require the type line-height to set or validate vertical rhythm. [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:24] [SOURCE: .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:37]

Buildable recommendation:
- Add a `baseline rhythm` row to `design-foundations/assets/token_starter.md`: body size, body line-height, computed baseline unit, which spacing tokens align to it, and where deliberate exceptions are allowed.
- Add a short section to `design-foundations/references/layout/layout_responsive.md` that links spacing scale to typographic baseline without abandoning the 4-point scale.
- Add a fixture where an output uses correct individual values but incoherent vertical rhythm; expected result should flag the missing relationship rather than individual token errors.

Enforceability:
- ENFORCEABLE in token-system artifacts: a validator can require the baseline row and check that declared spacing values are either multiples/fractions of the baseline or marked as deliberate exceptions.
- PARTLY ENFORCEABLE in source review when CSS tokens are present.
- ADVISORY in visual quality: optical spacing can intentionally break the math, but the exception should be named.

## F3 - Live-variant numeric knobs are missing as a reusable transport-facing contract

Evidence:
- Impeccable subcommands define concrete live-mode knobs: `layout` requires a density range from 0.6 to 1.4 with step 0.05, and optionally a `structure` steps control. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/layout.md:143] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/layout.md:145] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/layout.md:148] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/layout.md:151]
- `typeset` requires a `scale` range from 0.85 to 1.3 with step 0.05 and supports a pairing steps control. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/typeset.md:114] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/typeset.md:116] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/typeset.md:119] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/typeset.md:122]
- `colorize` requires `color-amount` from 0 to 1 with step 0.05 and allows 1-2 variant-specific parameters on top. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/colorize.md:144] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/colorize.md:146] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/colorize.md:149] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/colorize.md:152]
- Impeccable's live mode also makes parameters part of planning, not decoration after writing; each variant should name 2-3 parameter knobs while preserving identity. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/live.md:190] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/live.md:236] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/.opencode/skills/impeccable/reference/live.md:247]
- `sk-design` has internal Design Read dials and explicitly bans exposing named aesthetic dials as a user-facing style chooser in the real-UI loop. That is good, but it leaves no positive transport-facing schema for cases where a design transport supports variant controls. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:117]

Buildable recommendation:
- Add a transport-facing `variant_parameter_contract.md` under `sk-design/shared/assets/` or a mode-owned interface asset. It should state that knobs are for preview transport control, not a user-facing style-preset menu.
- Define canonical knob schemas for `density`, `type-scale`, `color-amount`, `structure`, and `pairing`, with owner modes and allowed ranges. Keep names grounded in implementation axes, not aesthetic vibes.
- Add tests for any Figma/Open Design/live-preview path that claims variant support: expected output includes 2-3 valid knobs per variant when the transport supports them, and no knobs when the task is a single final direction or the transport has no parameter surface.

Enforceability:
- ENFORCEABLE on generated variant metadata and fixture outputs: JSON schema, knob count, ids, ranges, and mode ownership can be checked.
- ADVISORY for whether a knob is the right design axis for a specific brief.

## F4 - Several apparent numeric gaps are already adopted and should be ruled out

Evidence:
- Motion timing, easing curves, exit duration, instant threshold, material constraints, and reduced-motion verification are already present in `design-motion`. [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:46] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:55] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:61] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:77] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:91] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion_strategy.md:99]
- Color dosage, tinted-neutral chroma, dangerous color pairs, dark-mode lightness steps, image-edge outlines, and ghost-card separation are already present in `design-foundations` color guidance. [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:46] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:77] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:83] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:98] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:102] [SOURCE: .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md:104]
- Mechanical interface defaults such as 2-3 hero lines, 6rem clamp ceiling, 20-word subtext, bento cell counts, eyebrow count, button contrast, 1200-1440px max-width, 80px nav height, and layout repetition caps are already present in `design-interface`. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:45] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:47] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:48] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:61] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:75] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:91] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:111] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:112]

Buildable recommendation:
- Treat these as a negative-knowledge list for later implementation planning. Do not re-port them as duplicate prose.
- If the shared numeric law card is added, reference these current locations as owners rather than copying their full text.

Enforceability:
- ENFORCEABLE as a duplicate-detection guard in a docs benchmark: the corpus can fail if it adds redundant mode-local restatements instead of an owner index.
- ADVISORY for editorial cleanup decisions where some repetition is useful for local readability.

# Questions Answered

- Q5 partially: the D1 backlog should prioritize a shared numeric-law index, baseline-rhythm artifact fields, and a transport-facing variant-parameter contract, while explicitly ruling out already-adopted timing, color, layout, typography, and mechanical-default laws.
- Q2 partially: enforcement should target artifact shape and owner links. The deterministic proof is not "the model has taste"; it is "the numeric law exists once, has an owner, appears in required proof cards or fixtures, and is not duplicated into stale prose."

# Questions Remaining

- Should the shared numeric-law index be a standalone shared reference, or an asset card loaded by `context_loading_contract.md` only when design work enters a numeric/token/motion path?
- Should baseline rhythm become mandatory for every `foundations` token handoff, or only when typography and spacing are both in scope?
- Which transport surfaces actually support parameterized variants today: Figma, Open Design, browser/live preview, or only future workflows?
- Should duplicate-law checks be warning-tier, since some mode-local reminders are useful, or hard fail only when they create conflicting numbers?

# Next Focus

Advance the angle bank to D2 command granularity unless the monitor keeps D1 active. Recommended next pass: use the D1 transform and numeric-law findings as test cases for `/design:*` command specificity, especially whether command surfaces should expose action verbs or route everything through the parent hub plus mode-owned proof cards.
