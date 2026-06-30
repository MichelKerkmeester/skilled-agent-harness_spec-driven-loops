# Iteration 3: Prioritized Implementation Backlog

## Focus

Iteration 3 answers Q4 by converting the iteration-2 coverage map into a ranked implementation backlog for a future build phase. This pass does not reopen live `sk-design` content except for one confirmation of the stale shared-path citation; it ranks already-traced techniques by coverage, leverage, effort, and safest home. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-strategy.md:41] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-strategy.md:117]

## Actions Taken

1. Re-read iteration 2 for the refined coverage map, exact target anchors, Q3 conflict decisions, and draft home-by-mode table. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:20] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:47]
2. Re-read iteration 1 for the original corpus inventory and early caution list, especially the distinction between net-new micro-craft and already-covered `sk-design` guidance. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-001.md:15] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-001.md:65]
3. Checked the strategy's non-goals and final focus so the output remains a research backlog, not an implementation patch. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-strategy.md:47] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-strategy.md:129]
4. Confirmed the separate hub cleanup: the `sk-design` hub cites `references/` for the shared base, while iteration 2 found the real shared base lives under `shared/`. This remains outside the corpus-adoption backlog. [SOURCE: .opencode/skills/sk-design/SKILL.md:105] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:45]

## Findings

### Ranked Backlog

| Technique | sk-design target file + anchor | Coverage | Leverage | Effort | Priority | One-line minimal edit |
|---|---|---|---|---|---:|---|
| Concentric border-radius math | `design-foundations/references/layout/layout_responsive.md` after spacing-system rules; `design-audit/references/anti_patterns_production.md` after token drift | Net-new | H | S | 1 | Add `outer radius = inner radius + inset` for close nested surfaces, plus an audit detector for same-radius nested surfaces with small padding. |
| Image-edge pure-rgba outline exception | `design-foundations/references/color/palette_theming.md` after border/stroke role; `design-audit/references/anti_patterns_production.md` after token drift | Net-new | H | S | 2 | Add image outlines as optical separators using inset pure black/white alpha, not tinted neutral tokens or layout borders. |
| Shadow ring vs ghost-card detector | `design-audit/references/anti_patterns_production.md`; cross-link existing ghost-card tells | Partial | H | S | 3 | Detect legitimate shadow rings as border replacements, and flag solid border plus wide shadow stacking as slop. |
| Contextual icon-swap CSS fallback | `design-motion/references/micro_interactions.md` after animation-mechanism guidance or before morphing icons | Partial | H | S | 4 | Add the no-new-dependency fallback: keep both icons in DOM and cross-fade opacity, scale, and blur when Motion is absent. |
| Root-only font smoothing | `design-foundations/references/type/typography_system.md` after pairing or readability guidance | Net-new | H | S | 5 | Add root-only macOS smoothing guidance and explicitly avoid per-component smoothing. |
| Text-wrap line-count caveats | `design-foundations/references/type/typography_system.md` Section 5 | Partial | H | S | 6 | Constrain `balance` to short headings, `pretty` to short-to-medium body/UI text, and neither to long text. |
| `transition: all` audit detector | `design-audit/references/accessibility_performance.md` near broad/permanent `will-change` detector | Partial | H | S | 7 | Add a static-risk detector that flags `transition: all` and asks for named transition properties. |
| Hit-area collision detector | `design-audit/references/anti_patterns_production.md`; reinforce `design-interface/references/design-process/ux_quality_reference.md` only if needed | Partial | H | S | 8 | Keep the 44x44 target and add a check that expanded pseudo-element hit areas do not overlap adjacent controls. |
| Static press-scale escape hatch | `design-motion/references/micro_interactions.md`; optional `motion_pattern_cards.md` handoff note | Partial | M | S | 9 | Add a `static` escape hatch for controls where press-scale feedback would distract or fight the interaction. |
| Shadow-as-border foundations decision matrix | `design-foundations/references/color/palette_theming.md` near surface/depth; optional `shared/design_token_vocabulary.md` terms | Partial | M | M | 10 | Define when shadow rings replace decorative borders, while dividers, tables, and form outlines remain borders. |
| Semantic split/stagger enters | `design-motion/references/motion_strategy.md` near timing/material rules | Partial | M | S | 11 | Say to animate title/body/actions separately instead of one wrapper, with opacity/translate first and bounded blur only after verification. |
| Small fixed-translate exits | `design-motion/references/motion_strategy.md` or `animate_presence_patterns.md` near exit guidance | Partial | M | S | 12 | Add fixed small translate examples for lightweight removals while preserving the existing shorter-exit rule. |
| Optical alignment examples | `design-interface/references/design-process/mechanical_defaults.md`; `design-foundations/references/layout/layout_responsive.md` already has the base concept | Partial | M | S | 13 | Add examples only: asymmetric icons, play triangles, icon-text buttons, and 1-2px optical nudges. |
| Dark-mode white-ring separator | `design-foundations/references/color/palette_theming.md` near surface/depth; `design-foundations/assets/token_starter.md` if token examples are touched | Partial | M | S | 14 | Treat a low-opacity white ring as an optical separator or state ring, not the primary dark-mode elevation system. |
| Dynamic tabular-number framing | `design-foundations/references/type/typography_system.md` data role and verification | Covered | M | S | 15 | Add layout-shift framing for counters, timers, prices, and updating numeric tables, without requiring tabular numerals for decorative numerals. |
| md-generator measured capture reminder | `design-md-generator/SKILL.md` extraction guidance only when measured in source CSS | Covered | L | S | 16 | Preserve measured outlines, shadows, radii, smoothing, and hit-target evidence when extracted; do not author new taste defaults in this mode. |

The top eight are the practical build slice. They are small, high-leverage, and either net-new or enforce an under-covered corpus distinction. The lower ranks are useful but less urgent because `sk-design` already carries most of the underlying concept. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:22] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:37]

### Per-Mode Rollup

| Mode or shared home | Concrete future edits | Leverage read |
|---|---|---|
| `design-foundations` | Add concentric-radius math, image-outline pure-rgba exception, root-only font smoothing, text-wrap caveats, shadow-ring decision matrix, dark-mode white-ring separator, and dynamic-number framing. | Highest-leverage single home. Most net-new corpus craft is a foundations rule before it becomes an audit finding or interface preflight. |
| `design-audit` | Add detectors for same-radius nested surfaces, tinted/layout-affecting image outlines, shadow-ring-vs-ghost-card misuse, hit-area collision, and `transition: all`. | High leverage as enforcement; it turns the craft rules into reviewable failures. |
| `design-motion` | Add contextual icon-swap fallback, static press-scale escape hatch, semantic split/stagger guidance, and small fixed-exit translate examples. | Medium-high; the biggest gap is the icon-swap CSS fallback, while several other motion items are refinements. |
| `design-interface` | Add only lightweight examples or preflight prompts for optical alignment, image-edge outlines, nested radius, and hit-area collision where they affect build judgment. | Medium; use it as a working-screen checklist, not the source of the underlying rule. |
| `design-md-generator` | Preserve measured CSS evidence for outlines, shadows, radii, root font smoothing, and hit-target affordances when present in a live source. | Low for corpus adoption; this mode should extract and document measured style, not invent defaults. |
| `shared` | Optionally add vocabulary for `image-edge outline` and `shadow ring` if multiple modes need the same terms. Keep mechanics in foundations, motion, and audit. | Low-medium; useful for language consistency, risky if it becomes a dumping ground. |

The single highest-leverage home is `design-foundations`, with `design-audit` as the enforcement pair. Iteration 2 already showed that the most promising items land in foundations, motion, or audit, while the hub should remain logic-free. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-001.md:73] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:51]

### Do-Not / Ruled-Out List

- Do not import the corpus's global Review Output Format. `design-audit` already owns severity and findings shape, and the hub must not acquire per-mode output logic. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:43]
- Do not adopt wholesale numeric defaults. Keep the 44x44 hit target instead of globally downgrading to 40px; do not make 100ms stagger a universal default; do not turn blur, radius, or shadow examples into token-agnostic constants. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:44]
- Do not put per-mode design mechanics in the `sk-design` hub. Future build edits belong in mode packets or, narrowly, shared vocabulary. [SOURCE: .opencode/skills/sk-design/SKILL.md:90] [SOURCE: .opencode/skills/sk-design/SKILL.md:92]
- Do not re-adopt already-covered motion rules as if they were new: interruptible transitions, `AnimatePresence initial={false}`, press scale `0.96`, and zero-bounce morphing posture are reinforcement, not backlog drivers. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:31] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:35] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:36]
- Do not make image-edge outlines semantic border tokens, tinted neutral tokens, accent rings, or layout-affecting borders. They are an optical exception. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:42]
- Do not use shadow-as-border to legitimize border-plus-wide-shadow cards. The adoptable rule is replacement, not stacking. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:41]

### Separate Non-Corpus Cleanup

Record a small doc-fix recommendation outside the corpus-adoption backlog: update the `sk-design` hub reference list from `references/anti_slop_principles.md`, `references/cognitive_laws.md`, and `references/design_token_vocabulary.md` to the real `shared/` paths. This is not a make-interfaces-feel-better adoption item; it is a local hub accuracy cleanup found while researching. [SOURCE: .opencode/skills/sk-design/SKILL.md:105] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:45]

### Future Build Definition Of Done

A future build phase is done when the top-ranked corpus-adoption edits land surgically in the named mode files, each edit preserves the iteration-2 conflict decisions, and the diff proves three absences: no global review format import, no hub-level per-mode mechanics, and no wholesale numeric default transplant. The build should also include the separate shared-path doc fix as its own small cleanup item, run the repo's spec validation for the packet, and leave a short implementation summary that maps each changed file back to this backlog.

### Executive Takeaway

The external corpus is not a replacement for `sk-design`; it contributes compact micro-craft that `sk-design` either lacks or currently phrases too broadly. The genuinely net-new/highest-value items are concentric-radius math, pure-rgba image-edge outlines, root-only font smoothing, and a few audit detectors that convert subtle polish failures into reviewable checks. Most motion guidance is already encoded in `sk-design`; the useful adoption there is the contextual icon-swap CSS fallback and a couple of escape hatches, not a new motion doctrine. [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-001.md:57] [SOURCE: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md:64]

## Questions Answered

- **Q4 answered.** The backlog now ranks corpus-adoption work by leverage, effort, coverage status, and exact target home.
- **Per-mode ownership answered.** `design-foundations` is the highest-leverage primary home; `design-audit` is the enforcement pair; `design-motion` receives narrower interaction refinements.
- **Build boundary answered.** The future phase should adopt the top backlog slice, preserve Q3 conflict decisions, and keep the shared-path cleanup separate from corpus adoption.

## Questions Remaining

- No research questions remain inside this three-iteration loop.
- Implementation remains intentionally unstarted. The build phase must still edit, verify, and summarize the target files.

## Next Focus

Synthesis should consolidate iterations 1-3 into the final `research/research.md`, then the separate future build phase can start with priorities 1-8 and the non-corpus shared-path doc fix.
