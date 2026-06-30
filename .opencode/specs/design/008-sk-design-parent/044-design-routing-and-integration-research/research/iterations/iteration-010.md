# Focus

[D2-6 / D2] command-as-mode vs command-as-task framing fork: should a `/design:*` command address an internal mode or a user intent?

This pass did not re-cover the prior D2 findings on generic argument hints, examples, sibling discriminators, output contracts, or precondition/failure fields. It narrowed to the command-facing frame: whether pinned commands should say "apply this mode" or "perform this user job, internally bound to this mode."

# Actions Taken

1. Reviewed the last D2 iteration results and state log so this pass would not duplicate the existing command-surface findings. D2-3 already covered sibling discriminators, D2-4 deliverable shape, and D2-5 preconditions/failure modes. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-007.md:16] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-008.md:14] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-009.md:103]
2. Read all checked-in `/design:*` wrappers to verify what the command layer currently tells an executor to do. [SOURCE: .opencode/commands/design/interface.md:9] [SOURCE: .opencode/commands/design/foundations.md:9] [SOURCE: .opencode/commands/design/motion.md:9] [SOURCE: .opencode/commands/design/audit.md:9] [SOURCE: .opencode/commands/design/md-generator.md:9]
3. Read the `sk-design` hub and mode registry to separate internal routing primitives from user-facing command copy. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]
4. Compared `impeccable-main` as the D2 corpus: its public command catalog is phrased as jobs and outcomes, while internal phases and references sit behind those commands. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/README.md:40] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:122] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:47]

# Findings

## F1 - Current pinned commands address internal modes first, not user jobs

Evidence:

- Every `/design:*` wrapper opens as a "Thin bridge" into a `sk-design` mode, then says to "Pin" that mode. This makes the internal `workflowMode` the primary public frame. [SOURCE: .opencode/commands/design/interface.md:9] [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/foundations.md:9] [SOURCE: .opencode/commands/design/foundations.md:13] [SOURCE: .opencode/commands/design/md-generator.md:9] [SOURCE: .opencode/commands/design/md-generator.md:13]
- The instruction heading is "Load and apply the mode"; the execution step says to apply the mode to `$ARGUMENTS`. The wrapper does not first restate the user's job or decide whether the requested task belongs to the pinned command. [SOURCE: .opencode/commands/design/interface.md:19] [SOURCE: .opencode/commands/design/interface.md:24] [SOURCE: .opencode/commands/design/audit.md:19] [SOURCE: .opencode/commands/design/audit.md:24] [SOURCE: .opencode/commands/design/motion.md:19] [SOURCE: .opencode/commands/design/motion.md:24]
- The frontmatter descriptions also end by naming the sk-design mode, e.g. "sk-design interface mode", "sk-design foundations mode", and "sk-design md-generator mode." [SOURCE: .opencode/commands/design/interface.md:2] [SOURCE: .opencode/commands/design/foundations.md:2] [SOURCE: .opencode/commands/design/md-generator.md:2]

Buildable recommendation:

- Change pinned wrappers from command-as-mode to command-as-user-intent. The first paragraph should say what the user is trying to accomplish, e.g. "Use this command to design or reshape a UI surface," then a later `Internal binding` section can say which `workflowMode` and packet it loads.
- Keep the existing command names for compatibility, but stop making "pin/apply mode" the command's main affordance. The command should gate on user intent first, then bind to mode.
- Add a static copy guard for wrappers: frontmatter description, intro, and `PURPOSE` must be generated from `commandSurface.userIntent`, while `workflowMode` may appear only in an explicit internal-binding section.

Enforceability:

- ENFORCEABLE for command files and metadata: a checker can fail wrappers whose opening copy contains banned bridge-first phrases such as "Thin bridge into", "Pin the `<mode>` mode", or "Apply the `<mode>` mode" outside the internal-binding section.
- ENFORCEABLE in replay fixtures for obvious prompts: a pinned command should either accept the user job, ask a missing-input question, or defer to the hub before loading the mode.
- ADVISORY at runtime for ambiguous prompts where the user intent legitimately spans multiple design axes.

## F2 - The registry is already an internal mode map; user intent needs a separate projection

Evidence:

- `mode-registry.json` describes itself as the discriminator for `workflowMode` and `backendKind`, and says the advisor routes one identity, `sk-design`; the hub then picks a mode. [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:9]
- The registry stores `workflowMode`, `backendKind`, packet names, aliases, and advisor routing for each mode. It does not store command intent, command copy, output shape, or framing rules. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:22]
- The hub confirms that `sk-design` is the public advisor-routable home and that it routes by `workflowMode` through `mode-registry.json`; the hub also says per-mode behavior is not flattened. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:62]

Buildable recommendation:

- Add command-facing metadata as either a sibling `command-metadata.json` or a strictly separated `commandSurface` projection inside `mode-registry.json`. The important split is:

```json
{
  "command": "/design:interface",
  "userIntent": {
    "job": "design or reshape a UI surface",
    "ownedSignals": ["redesign UI", "make it look good", "hero section", "component surface"],
    "notModeWords": ["interface mode", "workflowMode"]
  },
  "modeBinding": {
    "workflowMode": "interface",
    "packet": "design-interface"
  },
  "copyGuard": {
    "leadWithUserJob": true,
    "modeBindingSectionRequired": true
  }
}
```

- Generate wrappers from that projection so command files remain user-facing while the internal mode contract stays precise and testable.

Enforceability:

- ENFORCEABLE for schema presence and wrapper drift: a test can assert every mode-bound command has `userIntent`, `modeBinding`, and generated wrapper sections.
- ENFORCEABLE for keeping router logic stable: `workflowMode` remains the only hub discriminator, while command copy reads from the command projection.
- ADVISORY for the exact wording quality of the user job, unless backed by a fixture corpus and human-reviewed copy baseline.

## F3 - `impeccable-main` favors task/job commands, then describes internal phases

Evidence:

- The public README presents commands as actions with "What it does": `craft` is a full shape-then-build flow, `document` generates DESIGN.md, `critique` reviews UX, `audit` runs technical checks, `animate` adds purposeful motion. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/README.md:40] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/README.md:42] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/README.md:44] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/README.md:55]
- The source command table groups commands by job categories: Build, Evaluate, Refine, Enhance, Fix, Iterate. These are user-action categories, not internal packet names. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:122] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:124] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:129] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:137]
- Individual command pages lead with "When to use it" and user outcomes. `craft` says to use it for a new feature from zero, then later explains that it runs `/impeccable shape` internally. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:31] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:33] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/craft.md:47]
- `document` similarly leads with the user-visible readiness condition and output: enough visual system to document, then scan code and write DESIGN.md; the machine-readable sidecar is implementation detail after the user job is clear. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/document.md:72] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/document.md:74] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/site/content/skills/document.md:89]

Buildable recommendation:

- Use `impeccable-main` as the D2 model: `/design:*` docs should be organized around user jobs, expected outputs, and readiness, with mode binding as implementation detail.
- Keep current pinned commands as compatibility aliases, but consider adding user-job aliases later if the command system allows it:
  - `/design:interface` -> "design or reshape a UI surface"
  - `/design:foundations` -> "design the visual system"
  - `/design:motion` -> "choreograph interaction and transition behavior"
  - `/design:audit` -> "assess design quality with evidence"
  - `/design:md-generator` -> "extract a Style Reference DESIGN.md from a live site"

Enforceability:

- ENFORCEABLE for docs shape: generated wrappers can require `Use this command when`, `Returns`, `Internal binding`, and `Defer/Ask when` sections in that order.
- PARTLY ENFORCEABLE for command naming/aliasing: static tests can assert aliases exist and docs mention user jobs, but picking the best verb is still design/editorial judgment.
- ADVISORY for whether a human finds a command name intuitive enough without richer examples.

# Questions Answered

- Q1: A `/design:*` command should address user intent at the command surface. The internal `workflowMode` is still required, but it is a binding, not the public frame.
- Q1: The metadata should derive command behavior from the registry or a sibling metadata file, but the schema must separate `userIntent` from `modeBinding`.
- Q5: Static docs/metadata shape, wrapper drift, bridge-first copy bans, and fixture replay are enforceable. Natural-language judgment about ambiguous user jobs remains advisory.

# Questions Remaining

- Should `commandSurface` live in `mode-registry.json`, or should a sibling `command-metadata.json` own all user-facing command copy, examples, deliverables, preconditions, and framing guards?
- Should the project add new user-job aliases, or only rewrite the existing mode-named wrappers to lead with user intent?
- How strict should the static framing check be: ban mode words in the first wrapper paragraph entirely, or allow them after the user-job sentence?

# Next Focus

Continue D2 with the command metadata home and checker design: decide whether `commandSurface` belongs in `mode-registry.json` or a sibling `command-metadata.json`, and define the smallest fixture/checker suite that prevents regression to command-as-mode framing.
