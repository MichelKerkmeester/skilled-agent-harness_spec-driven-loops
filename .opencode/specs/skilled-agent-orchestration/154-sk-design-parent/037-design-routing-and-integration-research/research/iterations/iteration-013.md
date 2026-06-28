# Iteration 13: Design Command Pipeline Handoff

## Focus

[D2-9 / D2] no chaining/handoff between `/design:*` commands - surface the `md-generator -> foundations -> interface -> motion -> audit` pipeline without turning the commands into a silent auto-run chain.

This pass does not re-cover D2-6 command-as-task framing, D2-7 task-verb granularity, or D2-8 interface-lane visibility. It narrows to lifecycle visibility across the five existing mode commands: whether a user or executor can see what each stage accepts, produces, and should hand to next.

## Actions Taken

1. Re-read the current strategy and recent D2 iterations to avoid duplicating the command-as-mode, task-verb, and interface-lane findings. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:33] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-012.md:1]
2. Read all five live `/design:*` wrappers and the `sk-design` registry/hub to verify whether command files expose upstream or downstream handoff. [SOURCE: .opencode/commands/design/md-generator.md:9] [SOURCE: .opencode/commands/design/foundations.md:9] [SOURCE: .opencode/commands/design/interface.md:9] [SOURCE: .opencode/commands/design/motion.md:9] [SOURCE: .opencode/commands/design/audit.md:9] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
3. Read the five mode packets for cross-mode integration points that already imply a lifecycle. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:444] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:343] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:178] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:44] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:277]
4. Compared `impeccable-main` as the D2 corpus for how a design family surfaces shared design context, no-argument recommendations, and ordered flows without forcing users through every command. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:74] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:33] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:152]

## Findings

### F1 - The five `/design:*` wrappers are isolated mode bridges with no pipeline contract

Evidence:

- Each wrapper opens as a "Thin bridge" into one mode, then pins and applies that mode directly to `$ARGUMENTS`. The wrappers all have the same shape: load parent, load one mode packet, apply one mode, return `STATUS=OK` or `STATUS=FAIL`. [SOURCE: .opencode/commands/design/md-generator.md:9] [SOURCE: .opencode/commands/design/md-generator.md:19] [SOURCE: .opencode/commands/design/md-generator.md:24] [SOURCE: .opencode/commands/design/md-generator.md:26] [SOURCE: .opencode/commands/design/foundations.md:9] [SOURCE: .opencode/commands/design/interface.md:9] [SOURCE: .opencode/commands/design/motion.md:9] [SOURCE: .opencode/commands/design/audit.md:9]
- Each purpose section says to defer to the hub if the request spans more than the pinned mode, but it does not name which upstream artifacts the command accepts, what it produces, or which command should receive the result next. [SOURCE: .opencode/commands/design/md-generator.md:13] [SOURCE: .opencode/commands/design/md-generator.md:15] [SOURCE: .opencode/commands/design/foundations.md:13] [SOURCE: .opencode/commands/design/foundations.md:15] [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/interface.md:15] [SOURCE: .opencode/commands/design/motion.md:13] [SOURCE: .opencode/commands/design/motion.md:15] [SOURCE: .opencode/commands/design/audit.md:13] [SOURCE: .opencode/commands/design/audit.md:15]
- `mode-registry.json` lists the five modes and their aliases, but no command pipeline metadata: no `acceptsFrom`, `produces`, `nextCommands`, `proofRequired`, or lifecycle ordering. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]
- The hub can pair modes for clearly separate design axes, but that is a routing rule, not a surfaced pipeline or handoff protocol. [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:62]

Buildable recommendation:

- Add a command-facing lifecycle projection next to the current mode registry, either as `sk-design/command-metadata.json` or a separated `mode-registry.json.commandSurface.pipeline` block.
- Minimum schema per command: `command`, `ownerMode`, `stage`, `acceptsFrom`, `requiredInputs`, `produces`, `nextCommands`, `deferToHubWhen`, `proofRequired`, `statusFields`, and `fixtures`.
- Generate or drift-check the five wrappers so each includes compact `Accepts`, `Returns`, `Next`, `Defer/Ask`, and `Proof` lines. Keep the mode-loading instructions, but put lifecycle affordances in the user-visible wrapper.

Enforceability:

- ENFORCEABLE: a static checker can fail any lifecycle command wrapper missing `Accepts`, `Returns`, `Next`, and `Proof` sections generated from metadata.
- ENFORCEABLE: a registry/metadata checker can require every current mode command to declare at least one produced artifact and zero-or-more explicit next commands.
- ADVISORY: deciding the best natural-language wording for those sections remains editorial unless backed by a human-reviewed copy baseline.

### F2 - The mode packets already encode the pipeline; it is just buried below the command layer

Evidence:

- `md-generator` produces a validated `DESIGN.md` and explicitly says the v3 Style Reference contract is depended on by downstream `interface`, `sk-code`, and AI coding agents. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:339] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:348] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:414] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:421]
- `md-generator`'s integration section already names `interface` as the design-judgment consumer when a `DESIGN.md` extraction feeds new UI direction, and `sk-code` as the implementation consumer. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:444] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:445]
- `foundations` says interface should invent the overall direction first, foundations translates direction into reusable static tokens, and motion/audit consume the resulting system. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:29] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:36] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:48] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:51] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:343] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:345]
- `interface` requires register/dials and preflight before delivery, emits a build manifest when handing UI to `sk-code`, and expects a token system and motion budget in success criteria. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:74] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:78] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:176] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:180] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:252] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:258]
- `motion` pairs with interface and foundations, then hands implementation to `sk-code` with timing, easing, state, reduced-motion fallback, and performance risks. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:44] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:47] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:257] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:270]
- `audit` maps findings back to foundations, motion, interface, spec/extraction, or code implementation; accepted findings become a backlog handoff card, and audit itself does not fix. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:46] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:49] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:277] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:282] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:316] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:384] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:388]

Buildable recommendation:

- Represent the lifecycle as a directed graph in command metadata:
  - `md-generator` produces `DESIGN.md` and `tokens.json`; next: `foundations` for systemization or `interface` for grounded direction.
  - `foundations` produces token/system handoff; next: `interface`, `motion`, or `audit` depending on artifact state.
  - `interface` produces direction/preflight/build manifest; next: `motion` for temporal layer, `audit` for QA, or `sk-code` for implementation.
  - `motion` produces motion spec cards/handoff; next: `audit` or `sk-code`.
  - `audit` produces score/findings/backlog; next: owner-specific command or `sk-code` only after acceptance.
- Do not move this lifecycle logic into the hub body. Keep mode packets authoritative, and let metadata cite the packet sources that justify each edge.

Enforceability:

- ENFORCEABLE: metadata edges can cite source files/lines and be checked against the known five mode keys.
- ENFORCEABLE: fixture replay can assert that prompts like "capture this live site then design a matching landing page" produce a multi-stage plan instead of pinning only `md-generator`.
- ADVISORY: whether to recommend `foundations` before `interface` in a particular creative task depends on whether the user starts from measured CSS, a brief, or an existing token system.

### F3 - `impeccable-main` surfaces shared design context and next-command recommendations

Evidence:

- `document` writes `DESIGN.md` and a machine-readable sidecar, then states that every other command reads `DESIGN.md` on invocation so variants, polishes, audits, and new features inherit the visual system. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:74] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:89] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:91] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:112]
- `document` also says live, craft, and polish nudge users toward documentation when missing, and recommends capturing current state before a large redesign. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:79] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:81]
- `craft` exposes a visible ordered flow: shape, load references, build, visually iterate. It says the full pipeline is structured discovery, reference loading, implementation, and visual iteration. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:8] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:25] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:33] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:45] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:50]
- The parent skill's no-argument behavior is context-aware: it reads project signals and leads with the 2-3 highest-value next commands, but never auto-runs a command; recommendation is confirmed by the user. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:152] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:155] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:158] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:160]

Buildable recommendation:

- Add `/design` or hub-level no-argument guidance that recommends the next 2-3 design commands from context signals, not a static list. Example signals:
  - live URL or captured site but no style reference -> `/design:md-generator`;
  - existing direction but no token scaffold -> `/design:foundations`;
  - brief or UI surface needing visual direction -> `/design:interface`;
  - chosen interaction state needing temporal design -> `/design:motion`;
  - built or specified surface before release -> `/design:audit`.
- Keep the recommendation confirm-only. The command should surface the pipeline and ask/return the next command, not silently run multiple modes.

Enforceability:

- ENFORCEABLE: a fixture corpus can feed synthetic context signals and assert the top recommended commands.
- ENFORCEABLE: wrapper/status checks can require `NEXT_COMMANDS` or `NEXT_OPTIONS` fields for commands that produce handoff artifacts.
- ADVISORY: final ranking among valid next commands is contextual product judgment.

### F4 - The pipeline should be explicit handoff, not automatic command chaining

Evidence:

- Current wrappers already warn not to force a pinned mode when the request spans more than that mode; the correct behavior is defer to the hub. [SOURCE: .opencode/commands/design/md-generator.md:13] [SOURCE: .opencode/commands/design/md-generator.md:15] [SOURCE: .opencode/commands/design/foundations.md:13] [SOURCE: .opencode/commands/design/foundations.md:15] [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/interface.md:15] [SOURCE: .opencode/commands/design/motion.md:13] [SOURCE: .opencode/commands/design/motion.md:15] [SOURCE: .opencode/commands/design/audit.md:13] [SOURCE: .opencode/commands/design/audit.md:15]
- The hub tells agents to keep the smallest useful mode and pair modes only when the prompt has clearly separate axes. [SOURCE: .opencode/skills/sk-design/SKILL.md:56]
- `audit` is explicit that it should end with recommended next actions and not silently implement fixes during review-only work; accepted findings route through handoff. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:278] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:282] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:378]
- The corpus model also says no-argument recommendations should never auto-run a command; the user confirms. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:152]

Buildable recommendation:

- Add a deterministic status protocol:
  - `STATUS=OK PRODUCES="<artifact>" NEXT="<command-or-options>" PROOF="<card-or-evidence>"`
  - `STATUS=DEFER TARGET_COMMAND="<command>" REASON="<why-pinned-mode-is-wrong>"`
  - `STATUS=ASK MISSING_INPUT="<artifact-or-decision>"`
- Add a pipeline replay checker with positive and negative fixtures. Positive: a request to extract from a live site and design a matching UI should surface `md-generator -> interface/foundations`. Negative: a pure "audit this button" prompt must not suggest md-generation or foundations unless evidence is missing.

Enforceability:

- ENFORCEABLE: status fields, metadata edge coverage, and fixture replay are deterministic.
- ENFORCEABLE: silent auto-chain can be forbidden unless the user explicitly asks for an end-to-end flow.
- ADVISORY: deciding when the user wants a full pipeline rather than a next-command suggestion remains runtime judgment.

## Questions Answered

- Q1: Current `/design:*` commands need a lifecycle projection in addition to command-as-user-job framing. The missing fields are `acceptsFrom`, `produces`, `nextCommands`, and proof/status fields.
- Q1/Q5: The existing five-mode packet set already supports the lifecycle; implementation should expose it via metadata and generated wrappers, not by adding a new mode or flattening mode logic into the hub.
- Q5: Handoff visibility, status fields, metadata edges, and replay fixtures are enforceable. Whether to auto-run an end-to-end sequence is advisory and should stay opt-in.

## Questions Remaining

- Should lifecycle metadata live inside `mode-registry.json.commandSurface.pipeline`, or in a sibling `command-metadata.json` that points back to mode keys?
- Should there be a first-class `/design` no-argument menu/recommendation surface, or should each pinned command only return `NEXT_OPTIONS`?
- What exact proof card links one stage's produced artifact to the next stage's accepted input without turning the handoff into self-attestation?

## Next Focus

Continue D2 with the command metadata home and schema: define the smallest lifecycle/task-command metadata shape that covers wrappers, task projections, pipeline handoff, and fixture replay without putting per-mode design logic in the hub.
