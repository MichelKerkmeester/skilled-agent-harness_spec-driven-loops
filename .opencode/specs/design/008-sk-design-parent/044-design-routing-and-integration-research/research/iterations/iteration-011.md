# Iteration 11: Task-Verb Command Granularity

## Focus

[D2-7 / D2] Granularity gap: which high-value task verbs deserve first-class `/design:*` commands instead of staying buried in references or aliases. The corpus for this pass was `impeccable-main`, with the target verbs `bolder`, `quieter`, `distill`, `harden`, `polish`, `delight`, `colorize`, and `typeset`.

This pass did not re-cover D2-3 sibling discriminators, D2-4 output shape, D2-5 preconditions/failure modes, or D2-6 command-as-task framing. It narrowed to the command granularity threshold: a verb deserves command visibility when it names a repeatable user job, has a distinct reference contract, has specific inputs/failure traps, and maps deterministically to an owner mode.

## Actions Taken

1. Reviewed iterations 8-10 and the current strategy so this pass stayed on task-verb granularity rather than deliverables, preconditions, or mode-vs-task framing. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-008.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-009.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-010.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:33]
2. Read the current `sk-design` hub, command wrappers, and registry to verify the live command surface has five mode-bound wrappers and no first-class task-verb projection. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/commands/design/interface.md:7] [SOURCE: .opencode/commands/design/audit.md:7]
3. Read the Impeccable command table, router, metadata, pin helper, and "designing" page to identify how a mature corpus exposes named edit verbs without turning every verb into a standalone skill. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:120] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:34] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/pin.mjs:28] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/pages/designing/index.astro:175]
4. Read the eight target verb references plus the existing `sk-design` transform-remediation reference to classify first-class vs buried-reference candidates by owned workflow and mode ownership. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/bolder.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/quieter.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/distill.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/harden.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/polish.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/delight.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/colorize.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/typeset.md:1] [SOURCE: .opencode/skills/sk-design/design-audit/references/transform_remediation.md:22]

## Findings

### F1 - Impeccable's granularity model is "one skill, many task commands, optional pins"

Evidence:
- The corpus declares one user-invocable `impeccable` skill with 23 commands underneath it, and says users type commands such as `/impeccable polish` and `/impeccable audit`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:5]
- It explicitly warns not to add standalone skills unless there is a strong reason because `/` menu pollution is real. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:13]
- Despite that warning, its source table gives first-class rows to every target verb in this angle: `polish`, `bolder`, `quieter`, `distill`, `harden`, `colorize`, `typeset`, and `delight`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:131] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:132] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:133] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:134] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:135] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:138] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:139] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:141]
- The router treats a first-word command match as a hard reference load, and if the first word does not match but the intent clearly maps to one command, it loads that command's reference anyway. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:165] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:166]
- Optional top-level shortcuts are generated by a pin helper, but pins redirect to the parent command and only for a fixed valid-command list. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/pin.mjs:28] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/pin.mjs:90] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/pin.mjs:103]

Buildable recommendation:
- Do not add new standalone `sk-design-*` skills and do not add new workflow modes for these verbs. Add command-visible task projections under the existing design family, e.g. `/design:bolder`, `/design:quieter`, `/design:distill`, `/design:harden`, `/design:polish`, `/design:delight`, `/design:colorize`, and `/design:typeset`.
- Give each projection metadata: `command`, `category`, `userIntent`, `argumentHint`, `ownerModes`, `referenceSources`, `requires`, `deferToHubWhen`, `handoffTarget`, and `fixturePrompts`.
- Keep optional top-level pinning as a later ergonomics layer, not the base architecture. The base unit should be command-visible inside `/design:*`.

Enforceability:
- ENFORCEABLE for command inventory and metadata shape: a checker can assert every promoted verb has one metadata row, one wrapper or generated command surface, one owner-mode mapping, and at least one fixture prompt.
- ENFORCEABLE for no-menu-pollution policy: generated standalone shortcuts can be forbidden unless they contain a redirect marker and map to a known command.
- ADVISORY for whether a team wants a top-level shortcut for a particular verb.

### F2 - `sk-design` already contains the verbs, but hides them as aliases or remediation references

Evidence:
- The `sk-design` hub currently exposes five modes only: `interface`, `foundations`, `motion`, `audit`, and `md-generator`. [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/SKILL.md:29]
- The registry likewise has five mode entries and stores routing identity, aliases, and advisor routing; it does not store command-visible task verbs. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]
- The current wrappers are mode bridges: `/design:interface`, `/design:foundations`, `/design:motion`, `/design:audit`, and `/design:md-generator`. Each opens as a bridge into a mode, not as a task-verb command. [SOURCE: .opencode/commands/design/interface.md:7] [SOURCE: .opencode/commands/design/interface.md:9] [SOURCE: .opencode/commands/design/foundations.md:7] [SOURCE: .opencode/commands/design/motion.md:7] [SOURCE: .opencode/commands/design/audit.md:7] [SOURCE: .opencode/commands/design/md-generator.md:7]
- `bolder`, `quieter`, and `distill` are already formally modeled in `sk-design`, but only as an audit-side transform-remediation reference. That reference says audit names and routes the direction; it does not perform the transform. [SOURCE: .opencode/skills/sk-design/design-audit/references/transform_remediation.md:16] [SOURCE: .opencode/skills/sk-design/design-audit/references/transform_remediation.md:22] [SOURCE: .opencode/skills/sk-design/design-audit/references/transform_remediation.md:31]
- The audit skill names `bolder`, `quieter`, and `distill` as routing triggers, which proves these are first-class concepts in the family even though the command layer does not expose them. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:28] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:31] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:100]

Buildable recommendation:
- Promote the eight target verbs to command-visible tasks without making them mode keys:
  - `/design:typeset` -> `foundations`, typography system and hierarchy.
  - `/design:colorize` -> `foundations`, palette strategy and color semantics.
  - `/design:bolder` -> `interface` + `foundations`, register-gated amplification.
  - `/design:quieter` -> `foundations` + `motion`, register-gated reduction.
  - `/design:distill` -> `interface` + `foundations`, IA simplification and visual reduction.
  - `/design:harden` -> `audit` primary, then `sk-code` for accepted implementation fixes.
  - `/design:polish` -> `audit` primary for pre-ship finding triage, with owner-mode routing for accepted fixes.
  - `/design:delight` -> `motion` primary for earned interaction moments, with `interface` for copy/illustration/personality when needed.
- Keep lower-level reference files buried when they are subdimensions rather than jobs: font-loading details, edge-case matrices, motion easing, OKLCH scale math, and individual audit probes should stay references loaded by these task commands.

Enforceability:
- ENFORCEABLE for the owner map: every first-class verb can require at least one existing owner mode and one source reference.
- ENFORCEABLE for fixture routing: prompts such as "make the hero bolder", "tone down this dashboard", "fix the typography", "the colors feel flat", and "harden this form for long German labels" should resolve to the named task projection rather than generic `interface` or `audit`.
- ADVISORY for ambiguous mixed prompts, especially when `bolder` vs `redesign`, `quieter` vs `distill`, or `delight` vs `motion` depends on register and user risk tolerance.

### F3 - All eight target verbs clear the first-class threshold, but with different command strictness

Evidence:
- `typeset` has its own typography workflow: assess font choices, hierarchy, scale, readability, and consistency; then improve font selection, scale, hierarchy, readability, and weight consistency. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/typeset.md:13] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/typeset.md:55]
- `colorize` has a distinct color workflow: assess color absence and opportunities, plan palette strategy, introduce semantic color, accents, tinted surfaces, and color accessibility checks. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/colorize.md:15] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/colorize.md:37] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/colorize.md:52] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/colorize.md:113]
- `bolder` and `quieter` are not vague taste adjectives in the corpus; each has register-specific behavior, assessment gates, transformation dimensions, and failure traps. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/bolder.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/bolder.md:37] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/quieter.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/quieter.md:35]
- `distill` has a simplification workflow across IA, visual simplification, layout simplification, interaction simplification, copy, and code simplification; it is broader than a reference paragraph but narrower than a redesign. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/distill.md:6] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/distill.md:39] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/distill.md:94]
- `harden` has deterministic production-readiness probes: extreme inputs, error scenarios, i18n, overflow, wrapping, RTL, and validation behavior. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/harden.md:3] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/harden.md:7] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/harden.md:15] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/harden.md:23]
- `polish` is a pre-ship workflow with design-system discovery, completeness review, prior critique ingestion, cosmetic-vs-functional triage, and systematic refinement. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/polish.md:7] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/polish.md:17] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/polish.md:38] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/polish.md:45]
- `delight` is command-worthy only when bounded: the corpus says delight belongs at earned moments and must not block usability; product delight is specific moments, not whole pages. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/delight.md:7] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/delight.md:15] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/delight.md:42] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/delight.md:48]
- Impeccable's live mode treats the same verbs as action-specific references and requires action-specific variant axes, which confirms they are behavior-bearing verbs rather than prose-only docs. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/live.md:192] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/live.md:274]

Buildable recommendation:
- First-class now:
  - `typeset`, `colorize`: strict single-discipline commands with foundations ownership.
  - `bolder`, `quieter`, `distill`: strict directional transform commands with register gate and owner-mode routing.
  - `harden`: strict production-readiness command with deterministic probes and accepted-fix handoff.
  - `polish`: broad but first-class pre-ship orchestrator; must require a target and distinguish design QA from implementation.
  - `delight`: first-class but constrained; require a target moment, emotional context, and non-blocking success criteria.
- Not first-class from this angle:
  - Subdimension terms that do not name a user job by themselves, such as "contrast ratio", "font-display", "line clamp", "easing curve", "OKLCH scale", and "pseudo-localization". Keep those as references under the task commands.
- Add `strictness` to the command metadata:
  - `single-axis`: `typeset`, `colorize`, `harden`.
  - `register-gated-transform`: `bolder`, `quieter`, `distill`.
  - `orchestrator`: `polish`.
  - `moment-gated`: `delight`.

Enforceability:
- ENFORCEABLE for strictness categories, owner modes, reference sources, and required input questions.
- ENFORCEABLE for a negative corpus: prompts about `font-display`, `line clamp`, `easing`, and `contrast ratio` should load the relevant references through an owner task/mode rather than generate new top-level commands.
- PARTLY ENFORCEABLE for `delight`: the command can require target moment and non-blocking criteria, but whether the moment earns delight is judgment.
- ADVISORY for final taste outcomes and risk budget.

## Questions Answered

- Q1: The high-value verbs should become command-visible task projections over existing modes, not new modes and not hidden-only references.
- Q1: The eight prompted verbs all clear the first-class threshold, but `delight` needs the strictest guard because it is easiest to misuse as decoration.
- Q5: Command inventory, metadata shape, owner-mode mapping, strictness categories, and fixture routing are enforceable. Taste, register nuance, and whether a surface earns a given transform remain advisory.

## Questions Remaining

- Should task-command metadata live inside `mode-registry.json` under `commandSurface.tasks`, or in a sibling `command-metadata.json` that points back to registry modes?
- Should the implementation create one wrapper file per verb under `.opencode/commands/design/`, or should `/design:refine <verb>` exist as a grouped command while the command palette exposes selected pinned shims?
- Should `polish` be allowed to orchestrate accepted fixes after reporting, or should it stop at a pre-ship design backlog unless the user explicitly asks for implementation?
- How should the fixture suite adjudicate ambiguous prompts like "make this cleaner", which may map to `quieter`, `distill`, `polish`, or `audit` depending on evidence?

## Next Focus

D2-8 should define the task-command metadata home and checker fixtures for this projection: how the registry or a sibling metadata file generates wrappers, routes the eight verbs, rejects subdimension command creep, and proves the command-visible verbs load the right owner modes and references.
