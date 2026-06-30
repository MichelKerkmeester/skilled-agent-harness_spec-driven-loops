# Focus

[D2-1 / D2] `/design:*` generic arg-hint -> real per-mode arg grammar, using the `impeccable-main` corpus as the comparison point.

This pass focused only on the command surface: the five checked-in `/design:*` command files, the `sk-design` hub registry, each mode's own input contract, and the comparable `impeccable` command metadata/router pattern.

# Actions Taken

1. Reviewed the research strategy and current state log to confirm this is iteration 5, research-only, moving from D1 corpus craft into D2 command granularity. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:34] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-state.jsonl]
2. Read all five current command wrappers under `.opencode/commands/design/` with line numbers.
3. Read the `sk-design` hub and `mode-registry.json` to verify whether mode metadata already carries argument grammar or output-shape fields.
4. Read the `impeccable-main` command metadata/router sources and representative command references to compare how a mature design command family exposes command names, target hints, and per-command references.
5. Read the current `sk-design` child mode contracts for `md-generator`, `audit`, `motion`, `foundations`, and `interface` to derive buildable per-mode grammars from existing behavior rather than inventing new modes.

# Findings

## F1 - Every `/design:*` wrapper exposes the same generic argument hint

Evidence:
- `audit`, `foundations`, `interface`, `md-generator`, and `motion` all use the identical frontmatter `argument-hint: "<design request>"`. [SOURCE: .opencode/commands/design/audit.md:3] [SOURCE: .opencode/commands/design/foundations.md:3] [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/commands/design/md-generator.md:3] [SOURCE: .opencode/commands/design/motion.md:3]
- Each wrapper is otherwise a thin bridge that reads the parent hub, reads the child mode, and applies that mode to `$ARGUMENTS`; none states the concrete input shape or expected deliverable. [SOURCE: .opencode/commands/design/audit.md:19] [SOURCE: .opencode/commands/design/audit.md:24] [SOURCE: .opencode/commands/design/md-generator.md:19] [SOURCE: .opencode/commands/design/md-generator.md:24]
- The hub already states the routing discriminator and the five modes, but it only says generic design prompts default to `interface` and that clearly separate axes may pair modes. It does not define public command grammar. [SOURCE: .opencode/skills/sk-design/SKILL.md:43] [SOURCE: .opencode/skills/sk-design/SKILL.md:56]
- `mode-registry.json` is a single source of truth for `workflowMode`, `backendKind`, `packet`, aliases, and advisor routing, but has no `argumentHint`, usage examples, output contract, or sibling-discriminator fields. [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]

Buildable recommendation:
- Extend `mode-registry.json`, or add an adjacent generated `command-metadata.json`, with a `commandSurface` block per mode: `argumentHint`, `usage`, `acceptedInputs`, `outputShape`, `examples`, `siblingDiscriminator`, and `deferToHubWhen`.
- Generate or drift-check `.opencode/commands/design/*.md` frontmatter and a short `Usage` section from that metadata. The wrappers can stay thin, but their public surface should no longer erase the mode-specific input grammar.
- Suggested first grammar:
  - `/design:md-generator <url> --output <spec-output-dir> [--phase extract-write|validate|report|study] [--fast|--max-pages N|--no-interaction]`
  - `/design:audit <target:file|url|screenshot|plan> [--scope full|a11y|performance|responsive|theming|anti-slop|hardening] [--score|--no-score]`
  - `/design:motion <component-or-state> [--concern decision|strategy|micro|presence|performance|advanced] [--library css|motion/react|framer|gsap]`
  - `/design:foundations <axis:color|type|layout|tokens|adaptation|data-viz> <target> [--output plan|tokens|handoff]`
  - `/design:interface <brief-or-target> [--mode build|redesign|directions|preflight] [--register brand|product] [--handoff sk-code]`

Enforceability:
- ENFORCEABLE on the command corpus: parse command frontmatter and generated sections, then fail when a command keeps the generic `<design request>` hint or lacks usage/output fields.
- PARTLY ENFORCEABLE in router replay: a gold prompt corpus can assert that command-specific forms load the intended mode or defer to the hub.
- ADVISORY at runtime: deciding when a messy real request is "one mode" versus "hub should pair modes" still requires judgment.

## F2 - Existing child mode contracts already imply real grammars

Evidence:
- `md-generator` has the most concrete operational grammar today: full extraction starts with a live URL and a required `--output` outside the skill; extraction writes `tokens.json`, write phase builds a prompt from that token file, and validation takes `DESIGN.md` plus `tokens.json`. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:46] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:56] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:67]
- Its backend quick start names the exact extract/build/validate invocations and flags, including `--output`, `--fast`, `--max-pages`, `--no-interaction`, `--extra-urls`, `--merge-with`, and `--insecure`. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/README.md:51] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/README.md:57] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/README.md:142]
- `audit` already defines valid target kinds and output shape: resolve a file, URL, screenshot, design plan, or rendered UI evidence; produce a findings-first P0-P3 report; use the report template for the five-dimension score. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:76] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:267] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:276]
- `motion` already defines a concern grammar: decision/restraint, strategy/timing/easing, micro-interactions, presence, performance, and advanced craft; its fallback checklist asks for the temporal concern, task intent, target component/state, and reduced-motion/performance expectations. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:55] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:121] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:147]
- `foundations` already routes by static axis: color/theme, typography, layout/spacing/grid/responsive, multi-axis tokens, adaptation, and data visualization, and its unknown fallback asks for the static axis plus one concrete target or constraint. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:59] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:87] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:131]
- `interface` already distinguishes brief freedom, pinned axes, build/redesign/multiple-directions/preflight workflows, and required register/dial loading. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:24] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:47] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:73]

Buildable recommendation:
- Do not invent a new command taxonomy yet. Derive the first command grammar mechanically from each child mode's current `WHEN TO USE`, router keys, fallback checklist, and output/handoff contract.
- Add one fixture per mode where the generic hint currently under-specifies the job:
  - `md-generator`: URL plus output path.
  - `audit`: target plus evidence type and scoring scope.
  - `motion`: component/state plus temporal concern.
  - `foundations`: axis plus target and output type.
  - `interface`: brief plus workflow mode and preservation/handoff flags.

Enforceability:
- ENFORCEABLE for docs and generated wrappers: the grammar can be checked against existing child-mode parser keywords and required output contract fields.
- ENFORCEABLE for a deterministic command-fixture corpus: each example can assert expected mode, loaded resources, and output card/report type.
- ADVISORY for the final quality of the resulting design output.

## F3 - `impeccable-main` gives the right enforcement pattern: metadata as source, references as behavior

Evidence:
- The corpus architecture uses one user-invocable skill with 23 commands underneath it. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:5]
- It explicitly treats `scripts/command-metadata.json` as the single source of truth for each command's description and argument hint; both build output and pinning consume it. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:10]
- Adding a command requires both a reference file and a metadata entry with `description + argumentHint`, so the public surface and behavioral file are tied together. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:262] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:267]
- The source skill uses a templated top-level `argument-hint: "[{{command_hint}}] [target]"` and a command router table with per-command references; first-word routing loads the matched reference file, while non-matching clear intent routes to the right command or asks once on ambiguity. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:4] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:120] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:165]
- The metadata itself shows the minimum viable surface: some commands use `[target]`, while commands needing more structure expose `[target] [context (mobile, tablet, print...)]` or `[area (feature, page, component...)]`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:22] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:30] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:90]

Buildable recommendation:
- Adopt the enforcement shape, not necessarily the exact content density: keep `sk-design` as the single advisor-routable hub, but make public command metadata a generated projection from the registry plus child-mode contracts.
- Add a CI-style drift guard: every `.opencode/commands/design/<mode>.md` must match registry metadata for `description`, `argument-hint`, `usage`, and `packet`; every mode registry entry must have a child `SKILL.md`; every child `SKILL.md` must expose at least one target/axis/concern fallback line that feeds command usage.
- Add a router replay benchmark with five command-level "happy path" prompts and five "defer to hub" prompts. Example: `/design:motion redesign this landing page with a new visual identity and animations` should not silently stay motion-only; it should report that interface + motion is required.

Enforceability:
- ENFORCEABLE on a test corpus: registry/command/frontmatter drift, required metadata fields, wrapper generation, and router replay expected-mode assertions are deterministic.
- ADVISORY for natural-language user phrasing outside the fixture corpus.

# Questions Answered

- Q1: Yes, the `/design:*` commands should become specific public surfaces. The right move is not five bulky command files; it is a small per-mode command grammar projected from registry metadata and child-mode contracts.
- Q1: Metadata should derive from `mode-registry.json` or a sibling metadata file that is drift-checked against it. Today the registry is authoritative for mode identity but not for command usage.
- Q5 partially: D2 backlog splits cleanly into enforceable corpus checks (frontmatter, usage, output shape, examples, drift guard, router replay) and advisory runtime judgment (ambiguous multi-axis requests).

# Questions Remaining

- Should `mode-registry.json` absorb public command metadata directly, or should a separate `command-metadata.json` be generated from registry plus child-mode introspection to avoid bloating the routing discriminator?
- Should `/design:interface` expose action verbs from D1 (`bolder`, `quieter`, `distill`, `clarify`, `delight`) as flags/examples, or keep them as router aliases and proof-card intents inside `interface`/`audit`?
- How much of `md-generator`'s backend flag surface belongs in the user-facing command hint versus a shorter wrapper grammar that only names URL and output path?

# Next Focus

Advance to the next D2 angle: design the command metadata schema and drift/replay tests that would make `/design:*` specificity enforceable without moving mode logic out of the child packets.
