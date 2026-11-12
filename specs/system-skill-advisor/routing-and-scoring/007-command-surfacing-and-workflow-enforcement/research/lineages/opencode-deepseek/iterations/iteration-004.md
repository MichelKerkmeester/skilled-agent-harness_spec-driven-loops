# Iteration 4: Run-or-ask policy for 45 commands

## Focus

Angle 4 (run or ask): which commands are safe to start without asking, which need a question first, judged by what they write, cost and can undo, and where that policy should live.

## Actions Taken

- Extracted the doctor route mutation classes from `_routes.yaml`.
- Checked the `command-metadata.json` schema for a safety or mutation field.
- Read the `:auto` and `:confirm` workflow headers for create, deep-research and speckit-plan.
- Read the framework Gate 3 write gate.
- Read the advisor's read-only route gate, which already consumes one mutation class.

## Findings

1. The doctor route manifest is the only command set with an explicit mutation class. Its routes split into 16 `read-only`, 3 `add-only` and 22 `mutates` entries, and each carries a `gate3_location` naming what it writes. [SOURCE: .skilled/commands/doctor/_routes.yaml:69] [SOURCE: .skilled/commands/doctor/_routes.yaml:110]

2. The 19 command-metadata entries carry no mutation or safety field. Their schema is command, ownerMode, description, argumentHint, userIntent, choreography and discriminator, so a model cannot tell from the metadata whether `/create:skill` writes a new package or `/deep:review` only writes a review packet. [SOURCE: .skilled/skills/sk-doc/command-metadata.json:3]

3. Every create command already ships a mode switch with the right semantics: `:auto` runs with no approval prompts and `:confirm` pauses at each step. Deep-research follows the same split (`approvals: none` in auto, `approvals: multi_gate` in confirm), and speckit-plan has both an interactive `step_by_step` branch and an autonomous `approvals: none` branch. [SOURCE: .skilled/commands/create/README.txt:28] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:26] [SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:11] [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:27]

4. The framework already has an ask-before-write rule: Gate 3 fires when a turn will create, edit, delete, move or generate a file, and explicitly does not fire for read-only review, audit, inspect, explain or analysis. It is a backstop after the model has chosen a workflow, not a signal at recommendation time. [SOURCE: AGENTS.md:72]

5. The advisor's only safety mechanism is `readOnlyRouteAllowed`, which consults `skill.readOnly`. A mutating command that passes on a write-intent prompt is recommended with no ask marker, and the brief has no field to carry one. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:686]

6. Recommended policy: carry a three-class safety map in the command inventory (`read-only`, `add-only`, `mutating`) plus the write root named by `gate3_location`; the model may start read-only commands immediately, may start add-only commands when the target path is explicit and bounded, and must ask before mutating commands or when the target is unclear. Put the authoritative class in each command's metadata and keep Gate 3 as the backstop. [INFERENCE: based on the doctor manifest's three classes and the missing field in command-metadata.json]

7. Evidence against always asking for mutating commands: `:auto` is a shipped, first-class mode that intentionally runs without approval, and the create README documents it as a supported mode. A policy that always asks would contradict the user's explicit mode choice, so the run-or-ask default must be overridable by a typed `:auto` or `:confirm` suffix and by an explicit user instruction. [SOURCE: .skilled/commands/create/README.txt:28]

## Ruled Out

- Reusing the `readOnlyRouteAllowed` boolean as the whole policy: it has no ask state and no write root, so it can only suppress a recommendation, not tell the model what to do next.
- A universal "ask first" rule: it contradicts `:auto` and would add a question before every read-only doctor or review command.

## Dead Ends

- Looking for a safety class in `userIntent` or `choreography`: those fields describe intent and load order, not writes.

## Edge Cases

- Ambiguous input: "safe to start" could mean cost-free; the selected interpretation is "bounded writes with a named undo path", and expensive-but-read-only commands are treated as safe to start.
- Contradictory evidence: `:auto` versus an ask-first policy is a real conflict; the resolution is user-intent override, recorded as finding 7.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/commands/doctor/_routes.yaml:69,110,154`
- `.skilled/skills/sk-doc/command-metadata.json:3`
- `.skilled/commands/create/README.txt:28`
- `.skilled/commands/deep/assets/deep-research-auto.yaml:26`
- `.skilled/commands/deep/assets/deep-research-confirm.yaml:11`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:27,68`
- `AGENTS.md:72-73`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:686`

## Assessment

- New information ratio: 0.85
- Questions addressed: Which commands are safe to start without asking, which need a question first, judged by what they write and what they can undo, and where should that run-or-ask policy live?
- Questions answered: Which commands are safe to start without asking, which need a question first, judged by what they write and what they can undo, and where should that run-or-ask policy live?

## Reflection

- What worked and why: the doctor manifest supplied an existing three-class vocabulary, so the recommendation could extend a proven model instead of inventing one.
- What did not work and why: searching command metadata for a safety field found nothing, which is itself the finding.
- What I would do differently: test a mutating doctor command's brief to see whether the model receives any warning at all; the current evidence is the absence of a field rather than a measured miss.

## Recommended Next Focus

Angle 5 (invocation mechanics): whether a model can start a slash command itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and the fallback where it cannot.
