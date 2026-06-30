# Focus

[D2-3 / D2] `/design:*` has no when-to-use-vs-sibling discriminator at the command layer, with `impeccable-main` as the comparison corpus.

This pass did not re-cover the D2-1 generic argument-hint gap or the D2-2 missing concrete invocation/examples gap. It narrowed to sibling boundaries: how a user or executor should know whether to use `/design:interface` vs `/design:foundations`, `/design:audit` vs interface pre-flight, or the parent `sk-design` hub instead of a pinned command.

# Actions Taken

1. Reviewed the adjacent D2 findings to avoid duplication. D2-1 already proposed `siblingDiscriminator` and `deferToHubWhen` as fields; D2-2 already proposed examples and returned artifacts. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-005.md:26] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-006.md:59]
2. Read the checked-in `/design:*` wrappers and `sk-design` mode registry to verify what is exposed at the command surface. [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/foundations.md:13] [SOURCE: .opencode/commands/design/audit.md:13] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
3. Read the `sk-design` hub, child mode contracts, and shared context contract to locate the real sibling boundaries already present below the command layer. [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:33] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:36] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:36]
4. Compared the `impeccable-main` command/editorial pattern, especially command catalog categories, "When to use it", and "Pitfalls" sections that explicitly name alternatives and sequence. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:124] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:289] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:292]

# Findings

## F1 - The command wrappers contain a defer sentence, but not a discriminator

Evidence:
- Each wrapper says the hub owns routing and that the pinned command should defer if the request spans more than that mode, but it does not define what counts as "more than" that mode. [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/interface.md:14] [SOURCE: .opencode/commands/design/foundations.md:13] [SOURCE: .opencode/commands/design/foundations.md:14] [SOURCE: .opencode/commands/design/audit.md:13] [SOURCE: .opencode/commands/design/audit.md:14]
- The wrappers then immediately apply the pinned mode to `$ARGUMENTS`; there is no command-layer checklist for "use sibling X instead" before that application step. [SOURCE: .opencode/commands/design/interface.md:24] [SOURCE: .opencode/commands/design/foundations.md:24] [SOURCE: .opencode/commands/design/audit.md:24]
- `mode-registry.json` carries mode identity, packet names, aliases, and advisor routing, but not command-surface fields such as `whenToUse`, `preferSiblingWhen`, `pairWithHubWhen`, or `sequence`. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57]

Buildable recommendation:
- Add a structured `commandSurface.discriminator` block per design mode, either in `mode-registry.json` or a sibling command metadata file:
  - `whenToUse`: owned intent signals.
  - `preferSiblingWhen`: sibling mode, trigger signals, and one-line reason.
  - `pairWithHubWhen`: cases where the parent should compose modes instead of a pinned command forcing one.
  - `sequence`: before/after relationships, such as pre-flight before delivery or audit after a built/planned surface exists.
  - `fixtures`: deterministic prompts that assert the expected mode or hub deferral.
- Generate or drift-check each command wrapper from that metadata with compact sections: `Use this command when`, `Prefer sibling when`, and `Defer to sk-design hub when`.

Enforceability:
- ENFORCEABLE for docs/metadata: a static checker can fail any `/design:*` command missing the three discriminator sections or any mode missing the structured fields.
- ENFORCEABLE for deterministic replay: a fixture corpus can assert that "make tokens/palette" resolves away from `interface` to `foundations`, and "score release readiness" resolves away from interface pre-flight to `audit`.
- ADVISORY at runtime: ambiguous real prompts can still require judgment, especially when a task legitimately spans interface plus foundations plus audit.

## F2 - The sibling boundaries already exist in child skills, but the public command layer hides them

Evidence:
- The hub says generic design prompts default to `interface` unless the prompt is explicitly foundations, motion, audit, or md-generator, and it pairs modes only for clearly separate axes. [SOURCE: .opencode/skills/sk-design/SKILL.md:56]
- The shared context contract makes the "smallest useful mode" rule explicit for narrow advice, but says build/redesign/generation/audit surfaces require a larger bundle: interface for direction/pre-flight, foundations for static systems, and audit evidence refs before audit/release claims. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:33] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:35] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:36] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:40]
- `foundations` explicitly says to use `interface` first for overall direction and to use `audit` for review, scoring, accessibility, or production hardening. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:36] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:38]
- `audit` explicitly says to use `interface` for new visual direction, `foundations` for static token/palette/type/layout plans, and `sk-code` for implementation after accepted findings. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:36] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:37] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:39]
- `interface` owns the mechanical pre-flight gate before delivery, while `audit` owns evidence-backed findings, severity, scoring, and finding order. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:30] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:176] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:134]

Buildable recommendation:
- Derive first-pass discriminator text from the child mode `Use when` and `When NOT to Use` sections, not from invented wrapper prose.
- Concrete initial matrix:
  - `/design:interface`: own new/reshaped UI direction, distinctive look, design read, and pre-flight; prefer `foundations` for static token/color/type/layout systems; prefer `audit` for scored critique, accessibility, hardening, or release-readiness report.
  - `/design:foundations`: own palette/type/layout/responsive/token systems; prefer `interface` when direction or signature concept is not yet chosen; prefer `audit` when the user asks for scoring/hardening.
  - `/design:audit`: own evidence-backed QA, critique, accessibility/performance, production readiness, P0-P3 findings, and score; prefer `interface` for invention/restyling; prefer `foundations` for system design; hand accepted fixes to `sk-code`.

Enforceability:
- ENFORCEABLE on metadata traceability if each discriminator entry stores source citations or mode-owned keywords.
- ENFORCEABLE on wrapper drift if generated sections must cite or mirror those entries.
- PARTLY ENFORCEABLE on router replay: fixtures can prove obvious cases, but boundary wording quality remains advisory.

## F3 - `impeccable-main` shows the missing command-doc pattern: alternatives and sequencing are part of command usability

Evidence:
- The corpus contribution guide requires command docs to include "When to use it" and "Pitfalls"; the pitfalls section is explicitly for real failure modes with alternatives to use instead. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:289] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:292]
- Its catalog categorizes commands by job shape: build commands (`craft`, `shape`, `init`, `document`, `extract`), evaluate commands (`critique`, `audit`), and refine commands (`polish`, `bolder`, `quieter`, `distill`, `harden`). [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:124] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:129] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:131]
- `craft` and `shape` explicitly discriminate full flow vs thinking-only: craft runs discovery through implementation and visual iteration; shape standalone is only for the brief. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:33] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:41] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/shape.md:57]
- `polish` warns that rearchitecting layout means `critique` or `layout` instead; `delight` warns it should follow polish; `document` warns against running too early and states every other command reads DESIGN.md. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/polish.md:45] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/delight.md:42] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/document.md:91] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/document.md:111]

Buildable recommendation:
- Copy the pattern, not the site machinery: keep `/design:*` wrappers compact, but give each one a generated boundary block with alternatives and sequence.
- Store `siblingAlternatives` and `sequence` in metadata so docs, wrappers, and replay tests share one source.
- Add one ambiguous fixture per sibling pair:
  - interface vs foundations: "design a palette/type/token system for this app" should not stay in interface unless direction is also requested.
  - interface pre-flight vs audit: "run the preflight card before shipping this built screen" stays interface; "score production readiness and P0-P3 findings" routes audit.
  - audit vs implementation: "fix these accepted findings" routes to `sk-code` handoff, not audit.

Enforceability:
- ENFORCEABLE for presence, schema shape, and obvious replay expectations.
- ADVISORY for editorial taste: whether a boundary sentence is maximally helpful to a human should be review-scored, not treated as a binary gate.

# Questions Answered

- Q1: The command surface needs more than argument grammar and examples. It needs a sibling discriminator: owned intent, not-owned intent, sibling alternatives, hub-defer conditions, and sequencing.
- Q1: The first discriminator can be derived from existing child mode contracts and the shared context-loading contract; it does not require changing live mode behavior.
- Q5: Static metadata/doc checks and gold replay fixtures are enforceable. Ambiguous real-prompt judgment and prose quality are advisory.

# Questions Remaining

- Should `commandSurface` live directly in `mode-registry.json`, or should routing identity remain separate from a sibling `command-metadata.json` that owns command grammar, examples, discriminators, and docs?
- How many ambiguous replay fixtures are enough per sibling pair before the check becomes brittle?
- Should interface pre-flight be modeled as a sub-mode under `interface`, or just as a discriminator entry that distinguishes pre-delivery self-checks from independent `audit` reports?

# Next Focus

D2 should continue into the concrete command metadata home and drift/replay checker: choose the minimal schema that can generate argument hints, examples, returned artifacts, sibling discriminators, and hub-defer conditions while keeping child-mode logic in the mode packets.
