# Iteration 9: `/design:*` Preconditions and Failure Modes

## Focus

[D2-5 / D2] `/design:*` failure modes and preconditions are unnamed at the command layer. This pass did not re-cover D2-1 argument grammar, D2-2 examples, D2-3 sibling discriminators, or D2-4 deliverable shape. It narrowed to the conditions that must be true before a pinned command can do honest work: `md-generator` needs a live renderable URL and tool readiness, `audit` needs a concrete target/evidence source, and `motion` needs a concrete component, interaction, or expected motion behavior.

One correction to the prompt angle: `audit` does not strictly require a built surface. The checked-in child skill says it can review built or planned interfaces, but it does require a resolvable artifact and evidence labels before strong claims. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:267]

## Actions Taken

1. Reviewed iterations 6-8 and the tail of the state log so this pass stayed on the precondition/failure-mode angle rather than examples, sibling boundaries, or output artifacts. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-006.md:1] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-007.md:1] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-008.md:1]
2. Read every current `/design:*` wrapper and `sk-design` mode registry with line numbers to verify what the command surface exposes. [SOURCE: .opencode/commands/design/audit.md:13] [SOURCE: .opencode/commands/design/foundations.md:13] [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/md-generator.md:13] [SOURCE: .opencode/commands/design/motion.md:13] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
3. Read the `md-generator`, `audit`, and `motion` child contracts for real preconditions, fallback prompts, and escalation conditions. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:34] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:159] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:150]
4. Compared the `impeccable-main` command editorial contract and docs pages that explicitly include "When to use it", examples, and "Pitfalls" with alternatives. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:287] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:292]

## Findings

### F1 - The `/design:*` wrappers expose no precondition or failure-mode contract

Evidence:
- All five wrappers still use the generic `argument-hint: "<design request>"`, so the command palette does not communicate required input kinds such as URL, output path, target artifact, component, or interaction. [SOURCE: .opencode/commands/design/audit.md:3] [SOURCE: .opencode/commands/design/foundations.md:3] [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/commands/design/md-generator.md:3] [SOURCE: .opencode/commands/design/motion.md:3]
- Each wrapper has the same instruction shape: read the parent, read the child mode, apply the mode to `$ARGUMENTS`, then return only `STATUS=OK` or `STATUS=FAIL ERROR="<message>"`. None has `Requires`, `Ask first if missing`, `Cannot run when`, `Escalate if`, or `Failure modes` sections. [SOURCE: .opencode/commands/design/audit.md:19] [SOURCE: .opencode/commands/design/audit.md:26] [SOURCE: .opencode/commands/design/md-generator.md:19] [SOURCE: .opencode/commands/design/md-generator.md:26] [SOURCE: .opencode/commands/design/motion.md:19] [SOURCE: .opencode/commands/design/motion.md:26]
- `mode-registry.json` carries routing identity, backend kind, packet names, aliases, and advisor routing. It has no `commandSurface.preconditions`, `failureModes`, `missingInputQuestions`, or `escalationContract` fields. [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:64]

Buildable recommendation:
- Add a `commandSurface.preconditions` block per mode, either in `mode-registry.json` or a sibling command metadata file:
  - `requiredInputKind`: e.g. live URL, concrete target artifact, component/interaction, token system scope.
  - `missingInputQuestion`: the one grouped question to ask before applying the pinned mode.
  - `cannotRunWhen`: deterministic blockers.
  - `escalateIf`: mode-owned failure paths.
  - `routeInstead`: sibling or transport to use when the precondition points elsewhere.
- Generate or drift-check compact wrapper sections: `Requires`, `Ask first if missing`, `Cannot run when`, and `Escalate if`.

Enforceability:
- ENFORCEABLE on the command corpus: a static checker can fail any `/design:*` wrapper missing precondition and failure sections.
- ENFORCEABLE on metadata shape: every mode can be required to declare at least one `requiredInputKind` and one `missingInputQuestion`.
- ADVISORY at runtime: deciding whether a messy prompt already satisfies a precondition can still require judgment.

### F2 - `md-generator` has hard operational prerequisites below the command layer, but `/design:md-generator` hides them

Evidence:
- The child skill's primary path is "URL to DESIGN.md": crawl a live URL, produce `tokens.json`, write `DESIGN.md`, then validate fidelity. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:34]
- It explicitly excludes brief-only authoring, Figma targets, Open Design targets, screenshot-only requests, and unreachable websites; the live site must be renderable with JavaScript. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:46] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:50]
- Its fallback checklist asks to confirm pipeline phase, live JavaScript-rendering URL, and output paths before writing. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:163] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:166]
- Its workflow requires Node/Playwright setup before extraction and names the exact setup command plus the extraction command that takes `<url>` and `--output`. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:290] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:298] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:342]
- It has a clear failure path: if Playwright cannot reach the URL, rendering times out, or no measurable CSS exists, report the specific error, URL, and likely auth/crawler-block condition instead of retrying blindly. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:354]

Buildable recommendation:
- Change `/design:md-generator` from `<design request>` to a concrete grammar such as `<live-url> [--output <dir>] [--validate <DESIGN.md> <tokens.json>] [--report]`.
- Project the child prerequisites into the wrapper:
  - `Requires: live renderable URL, Node 20+, Playwright Chromium, output path outside the skill.`
  - `Ask first if missing: pipeline phase, URL, and output paths.`
  - `Cannot run when: no live site, Figma/Open Design target, screenshot-only request, or auth/crawler block without credentials.`
  - `Escalate if: extraction cannot reach URL, JS render times out, or page emits no measurable CSS.`

Enforceability:
- ENFORCEABLE statically: wrapper and metadata can be checked for URL grammar, Playwright readiness language, and explicit extraction-failure handling.
- ENFORCEABLE preflight at runtime for local tool readiness: `node`, npm dependencies, and Playwright Chromium can be checked before extraction.
- ADVISORY/external for URL reachability and crawler/auth behavior until the actual target is tested.

### F3 - `audit` and `motion` already define missing-input gates, but pinned commands do not surface them

Evidence:
- `audit` asks the agent to confirm a target artifact: file, URL, screenshot, or design plan; it also asks for one concrete input, rendered observation, or expected output. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:159] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:160]
- Its workflow begins by resolving target and register, then stating evidence available and evidence missing; visual claims require visual evidence or a clear caveat. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:267] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:269]
- It forbids invented browser, screenshot, or detector evidence and escalates when the target cannot be resolved to a file, URL, screenshot, or concrete design artifact. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:326] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:331]
- `motion` asks for one concrete input, target component, or expected motion behavior, plus reduced-motion and performance expectations before completion. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:150] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:151]
- `motion` requires a restraint gate, named purpose, motion budget, timing/easing/material choices, reduced-motion behavior, and a pattern card before handoff. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:259] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:269]
- `motion` escalates when performance constraints, devices, or motion sensitivity requirements affect the budget but are unknown, or when the request implies replacing an existing animation system. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:306] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:310]

Buildable recommendation:
- Add mode-specific pinned-command gates:
  - `/design:audit` requires a concrete target artifact plus evidence type; if evidence is missing, the wrapper must instruct the executor to label claims `not-assessed` or ask for a target instead of producing a false ready claim.
  - `/design:motion` requires a target component/interaction/state change plus performance and reduced-motion expectations; if static hierarchy is unclear, route back to `interface` or `foundations`.
- Add precondition replay fixtures:
  - `audit "make this better"` should ask for target/evidence or route to hub, not produce a scored report.
  - `audit src/checkout --evidence screenshot` can proceed with evidence labels.
  - `motion "add premium animation"` should ask for target component/interaction and budget constraints.
  - `motion SettingsDrawer open-close exit` can proceed to a pattern card.

Enforceability:
- ENFORCEABLE on docs and fixtures: obvious under-specified prompts can be expected to ask for missing target/evidence instead of applying the pinned mode.
- PARTLY ENFORCEABLE at runtime: detecting a file path, URL, screenshot mention, component name, or state pair is deterministic in a fixture corpus; judging whether evidence is strong enough remains mode-review work.
- ADVISORY for qualitative decisions such as whether motion is compensating for unclear hierarchy.

### F4 - `impeccable-main` makes preconditions and pitfalls first-class command documentation

Evidence:
- Its contribution guide says each editorial command page has `When to use it`, `How it works`, `Try it`, and `Pitfalls`; pitfalls are explicitly real failure modes with alternatives to use instead. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:287] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:292]
- `/impeccable document` states the precondition for scan mode: enough visual system to document, including colors, typography, at least a button and a card. For no-code projects, it names seed mode and says to re-run scan mode once code exists. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:74] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:83]
- Its pitfalls section calls out running document too early and says to use seed mode instead of fabricating a fake spec. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:109] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:111]
- `/impeccable audit` tells the user they get a document they can paste into a ticket tracker and that audit does not fix anything, then routes fixes to other commands. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/audit.md:70] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/audit.md:72]

Buildable recommendation:
- Borrow the command-doc pattern directly: every `/design:*` wrapper should include compact generated `When this command is ready`, `If missing`, and `Failure modes` sections.
- Keep the richer prose in generated docs if wrapper length is a concern, but make the command wrapper itself carry the minimum blocking contract. Pinned commands are the execution surface, so hidden child-skill preconditions are too late.
- Add a checker that bans "status-only failure" for pinned commands: `STATUS=FAIL` can remain, but it must follow a mode-specific failure contract naming what failed and which next action is safe.

Enforceability:
- ENFORCEABLE for section presence, metadata parity, obvious missing-input fixtures, and non-generic failure language.
- ADVISORY for editorial quality of the wording and whether a human finds the pitfall examples memorable.

## Questions Answered

- Q1: `/design:*` commands need explicit precondition and failure-mode contracts in addition to grammar, examples, sibling discriminators, and deliverables.
- Q1: The first precondition map can be derived from child mode contracts. `md-generator`, `audit`, and `motion` already name enough missing-input and escalation behavior to project into wrappers.
- Q5: Presence, schema shape, metadata parity, and fixture checks are enforceable. Runtime judgment about ambiguous natural-language inputs remains advisory.

## Questions Remaining

- Should preconditions and failure modes live in `mode-registry.json` under `commandSurface`, or should a sibling `command-metadata.json` own all command-facing grammar/docs/checker fields?
- Should command wrappers carry full `Pitfalls` prose, or only the compact blocking contract while generated docs carry richer teaching examples?
- Should under-specified pinned command prompts fail closed with a grouped question, or defer upward to the `sk-design` hub whenever the missing input could imply another mode?
- Which failure signals deserve a machine-readable line, e.g. `MISSING_INPUT="<target-artifact>"` or `BLOCKED_BY="<playwright-url-unreachable>"`, alongside `STATUS=FAIL`?

## Next Focus

Continue D2 with the command metadata home and checker design: define the smallest schema that can project argument hints, examples, sibling discriminators, deliverables, preconditions, and failure modes into wrappers and replay fixtures without moving mode behavior out of child packets.
