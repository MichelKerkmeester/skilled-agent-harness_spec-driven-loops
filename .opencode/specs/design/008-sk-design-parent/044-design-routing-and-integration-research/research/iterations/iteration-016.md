# Iteration 16: Command Description Trigger Surface

## Focus

[D2-12 / D2] Command description as auto-trigger keyword surface: does an agent ever pick a specific `/design:*` command from descriptions, or does natural-language routing collapse to the `sk-design` hub? Corpus: `impeccable-main`.

This pass does not re-cover D2-11's metadata-home answer. It assumes the future `command-metadata.json` recommendation from iteration 15, then narrows to what role the description field can honestly play in routing and enforcement.

## Actions Taken

1. Re-read the strategy and prior D2 outputs for pipeline, register, and metadata drift so this pass stayed on the trigger-surface question. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:100] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-013.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-014.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-015.md:1]
2. Read the live `/design:*` wrappers, `sk-design` hub, and mode registry to verify whether command descriptions are part of advisor routing or only command frontmatter. [SOURCE: .opencode/commands/design/interface.md:2] [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/motion.md:2] [SOURCE: .opencode/commands/design/motion.md:13] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]
3. Read `impeccable-main` architecture, source skill, command metadata, pin script, and skill-behavior notes to compare a corpus that explicitly optimizes descriptions and tests sub-command routing. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:10] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:3] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/pin.mjs:90] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/tests/skill-behavior/README.md:67]
4. Replayed two local advisor prompts with the daemon fallback script. Both returned `sk-design` as a skill recommendation, not `/design:motion` or `/design:audit`; the warm socket path failed with exit 75, so only the script replay is evidence.

## Findings

### F1 - Current `/design:*` descriptions do not form an auto-trigger surface; natural-language routing collapses to `sk-design`

- `mode-registry.json` says the advisor routes the single identity `sk-design`; the hub picks the mode, there is no advisor map entry per mode, and the advisor does not read the registry at runtime. [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] [SOURCE: .opencode/skills/sk-design/mode-registry.json:9] [SOURCE: .opencode/skills/sk-design/mode-registry.json:10]
- The hub repeats the same contract: routing is registry-driven, the advisor routes any design query to `sk-design`, and the hub then picks the mode. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] It also says generic design prompts default to `interface` unless another axis dominates. [SOURCE: .opencode/skills/sk-design/SKILL.md:56]
- The live command wrappers have frontmatter descriptions, but their bodies describe direct pinned-mode bridges: `/design:motion` "loads the `motion` mode directly" and defers to the hub when the request spans more than motion. [SOURCE: .opencode/commands/design/motion.md:2] [SOURCE: .opencode/commands/design/motion.md:13] [SOURCE: .opencode/commands/design/motion.md:14] [SOURCE: .opencode/commands/design/motion.md:15] `/design:interface` follows the same pattern. [SOURCE: .opencode/commands/design/interface.md:2] [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/interface.md:14] [SOURCE: .opencode/commands/design/interface.md:15]
- Local advisor replay for "animate this modal with purposeful micro-interactions and reduced motion" returned only `sk-design` at confidence 0.9225. Replay for "audit this UI for accessibility performance responsive anti-slop scoring" returned `sk-design` and `sk-code-review`, not `/design:audit`. [SOURCE: command output from local advisor replay, iteration 16]

Buildable recommendation: treat current `/design:*` descriptions as direct-command/menu metadata, not as a routing guarantee. Add a future command-surface field such as:

```json
{
  "descriptionRole": "direct-command-help",
  "autoTriggerEligible": false,
  "advisorEntrypoint": "sk-design",
  "ownerMode": "motion",
  "deferToHubWhen": ["multiAxis", "ambiguousIntent", "modeConflict"]
}
```

Enforcement label: ENFORCEABLE for static metadata checks and local advisor replay that proves natural-language prompts return `sk-design`; ADVISORY for a live agent's decision to use a command unless the user invoked it or a pinned shortcut exists.

### F2 - `impeccable-main` uses a two-tier model, not free-floating command descriptions

- The corpus architecture deliberately has one user-invocable skill, `impeccable`, with 23 commands underneath it. Users type `/impeccable polish`, `/impeccable audit`, and similar subcommands. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:5]
- Its source skill frontmatter carries the broad auto-trigger-optimized description. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:7] The actual description is a long umbrella surface for design, redesign, shape, critique, audit, polish, adapt, animate, colorize, motion, accessibility, typography, layout, performance, and more. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:3]
- Subcommand routing happens inside the skill after wake-up: if the user invoked a sub-command, setup must read `reference/<command>.md`; if the first word matches a command, it loads the reference; if intent clearly maps to one command, it proceeds as if invoked. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:19] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:165] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:166]
- The corpus only turns command metadata into standalone triggerable shortcuts through `pin.mjs`: generated pinned skills get their own `name`, `description`, `argument-hint`, and `user-invocable: true`, then redirect to `/impeccable <command>`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/pin.mjs:90] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/pin.mjs:94] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/pin.mjs:103] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/pin.mjs:105]
- The corpus' behavior tests are a caution: even explicit `/impeccable polish` and `/impeccable audit` routing failed on the old GPT mini baseline because the model proceeded with the familiar action without loading the command reference. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/tests/skill-behavior/README.md:81] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/tests/skill-behavior/README.md:86] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/tests/skill-behavior/README.md:87]

Buildable recommendation: copy the two-tier enforcement pattern, not the surface wording alone. `sk-design` should keep the broad advisor entrypoint, let the hub choose mode/task projection, and only mark command descriptions `autoTriggerEligible: true` for generated pinned shortcuts that have their own skill/command frontmatter and redirect body.

Enforcement label: ENFORCEABLE for generated pin frontmatter parity and redirect-body checks; ENFORCEABLE for a behavior fixture that proves explicit direct commands load the owner packet; ADVISORY for natural-language intent-to-command choice unless captured by a pinned shortcut or deterministic hub replay.

### F3 - Command descriptions need explicit routing-role metadata, or they become dead weight in enforcement

- Iteration 15 already showed the metadata home: wrappers hand-repeat descriptions and generic argument hints while aliases live in the registry and hub. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-015.md:22] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-015.md:28]
- The new finding is not that descriptions are useless. They are useful for command palette/help, generated docs, and future pinned shortcuts. They are dead weight only if treated as evidence that the agent will auto-select `/design:motion` or `/design:audit` from a plain-language prompt.
- `impeccable-main` separates public command metadata from editorials and pins: `command-metadata.json` is the source for descriptions and argument hints, while pinning creates standalone redirect shims when a shortcut is actually desired. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:10] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:11]

Buildable recommendation: extend the future `sk-design/command-metadata.json` schema from iteration 15 with description-role fields:

```json
{
  "command": "motion",
  "ownerMode": "motion",
  "description": "Animation, transitions, micro-interactions, AnimatePresence, reduced motion.",
  "descriptionRole": ["command-palette", "direct-invocation-help"],
  "hubKeywordProjection": ["motion design", "animate this", "micro-interactions"],
  "pinShortcut": {
    "generated": false,
    "autoTriggerEligibleWhenGenerated": true,
    "redirectTo": "/design:motion"
  },
  "fixtures": {
    "advisorPromptRoutesTo": "sk-design",
    "hubPromptResolvesMode": "motion",
    "directCommandLoadsPacket": "design-motion/SKILL.md"
  }
}
```

Add `design-command-surface-check.mjs` or extend the skill-benchmark harness with four lanes:

- Advisor replay lane: natural-language design prompts must recommend `sk-design`, not a command shim.
- Hub replay lane: the same prompt must resolve to the expected owner mode or defer reason.
- Direct command lane: `/design:<command>` must load the named packet and produce command status.
- Pinned shortcut lane: only generated pins may claim standalone auto-trigger behavior, and they must redirect to the parent command.

Enforcement label: ENFORCEABLE for static schema, wrapper parity, generated pin parity, and trace-based fixture lanes; ADVISORY for whether a description is the best human-facing prose.

## Questions Answered

- Q1/D2: Current `/design:*` descriptions should not be treated as an auto-trigger keyword surface. They do not make the agent pick a specific command in the observed advisor path; the prompt routes to `sk-design`, then the hub/mode router must decide.
- Q1/Q5: The useful command metadata schema needs a `descriptionRole` or equivalent field so "description for command palette" is not confused with "description that deterministically triggers this command."
- Q5: The enforceable implementation is a two-tier replay suite: advisor-to-hub, hub-to-mode, direct-command-to-packet, and optional generated-pin-to-parent-command.

## Questions Remaining

- Should `hubKeywordProjection` be generated from command metadata plus registry aliases, or should hub keywords remain a compatibility list with only required-inclusion checks?
- Should pinned shortcuts be supported for the future `/design:*` family at all, or should the command palette expose direct commands while natural language always starts from the hub?
- Which fixture runner should own the four-lane command-surface replay: a new `design-command-surface-check.mjs` or the deep-improvement skill-benchmark harness?

## Next Focus

Continue D2 by defining the replay fixture format for advisor-to-hub, hub-to-mode, direct-command-to-packet, and generated-pin redirect lanes, including what trace evidence counts as "loaded the owner packet."

Assessment: newInfoRatio 0.59. Novelty is moderate because iteration 15 already established the metadata home, but this pass adds the missing routing-role split and a concrete answer to the dead-weight question: command descriptions are not dead, but their current auto-trigger value is misclassified.
