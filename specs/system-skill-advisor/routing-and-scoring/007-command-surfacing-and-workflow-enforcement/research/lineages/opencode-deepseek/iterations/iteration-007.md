# Iteration 7: Skill and command linkage

## Focus

Angle 7 (skill and command linkage): which commands never load the mode `SKILL.md` their metadata names, which skills have no command front door, and whether a skill recommendation should imply its command.

## Actions Taken

- Checked every `command-metadata.json` choreography against the mode `SKILL.md` paths.
- Read the command routers for `/create:skill` and `/deep:research` to see what an executing model actually loads.
- Checked the doctor routers' `skill_agent` tags and their workflow load path.
- Counted which skills have a dedicated command front door.

## Findings

1. All 19 metadata-backed commands declare a choreography that loads a mode `SKILL.md`, and every named mode file exists: `system-deep-loop/deep-research/SKILL.md`, `sk-doc/sk-create-skill/SKILL.md`, `sk-design/sk-design-md-generator/SKILL.md`, and the rest. On paper the linkage is complete. [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:1] [SOURCE: .skilled/skills/sk-doc/command-metadata.json:15]

2. The executing command routers do not load that mode `SKILL.md`. `/create:skill` loads a presentation contract and an auto or confirm YAML, then executes the YAML; `/deep:research` does the same. The mode skill appears only in metadata choreography, not in the router's load list. [SOURCE: .skilled/commands/create/skill.md:20] [SOURCE: .skilled/commands/create/skill.md:28] [SOURCE: .skilled/commands/deep/research.md:84]

3. The workflow YAML does not close the gap: `create-skill-auto.yaml` declares autonomous execution and owns its scaffold steps, and `deep-research-auto.yaml` owns the research loop, neither loading the mode `SKILL.md`. A model that starts the command therefore runs the YAML without ever reading the mode skill the metadata names. [SOURCE: .skilled/commands/create/assets/create-skill-auto.yaml:29] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:26]

4. The 17 doctor commands have no `command-metadata.json` and do not load a mode skill: 11 carry a `skill_agent` owner tag (for example `system-skilled-doctor`), but the routers resolve a target from `_routes.yaml` and load a target YAML. They are command-only workflows with an owner label, not skill-driven workflows. [SOURCE: .skilled/commands/doctor/skill-advisor.md:6] [SOURCE: .skilled/commands/doctor/skill-advisor.md:12]

5. `/prompt:improve` is the exception: it explicitly states that it loads the `sk-prompt` skill. It is the only non-hub command with an in-document skill load. [SOURCE: .skilled/commands/prompt/improve.md:83]

6. Nine skills have no dedicated command front door: `cli-classifier`, `cli-external-orchestration`, `cli-orca`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-git`, `system-skill-advisor` and `system-skilled-doctor`. Four of those appear only as `skill_agent` owners on doctor diagnostic routers, which is not a workflow command for the skill. [SOURCE: .skilled/commands/doctor/git.md:6]

7. A skill recommendation should imply a command only when the selected mode's registry entry records a `command`, as `sk-doc` does for every mode and `system-deep-loop` does for research, review and ai-council. A blanket implication would fabricate commands for the nine skills that have none. [SOURCE: .skilled/skills/sk-doc/mode-registry.json:40] [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:45]

8. Evidence against making the command the primary route: `sk-doc` marks its modes as `metadata` routed by hub membership and says a `command-bridge` mode is "reached only via its command, never advisor-scored", so for those modes the skill hub is the intended front door and the command is an alternative surface. The correct rule is to surface the command beside the skill, not to replace the skill with it. [SOURCE: .skilled/skills/sk-doc/mode-registry.json:13]

## Ruled Out

- Treating metadata choreography as an enforced load: neither the command routers nor the workflow YAML read the mode `SKILL.md`.
- Implying a command for every skill: nine skills have no command, so the implication would invent routes.

## Dead Ends

- Searching for a shared command-to-skill dispatcher: the linkage is declarative metadata plus per-command routers, with no central loader.

## Edge Cases

- Ambiguous input: "never load the mode SKILL.md" could mean never in the router or never in the YAML; both were checked separately and both are true for the 19 metadata commands.
- Contradictory evidence: the metadata says load, the routers do not; the contradiction is recorded rather than resolved because the metadata is descriptive and the router is executable.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/command-metadata.json:1`
- `.skilled/skills/sk-doc/command-metadata.json:15,40`
- `.skilled/skills/sk-design/command-metadata.json:1`
- `.skilled/commands/create/skill.md:20,28`
- `.skilled/commands/deep/research.md:84`
- `.skilled/commands/doctor/skill-advisor.md:6,12`
- `.skilled/commands/doctor/git.md:6`
- `.skilled/commands/prompt/improve.md:83`
- `.skilled/commands/create/assets/create-skill-auto.yaml:29`
- `.skilled/commands/deep/assets/deep-research-auto.yaml:26`
- `.skilled/skills/sk-doc/mode-registry.json:13`
- `.skilled/skills/system-deep-loop/mode-registry.json:45`

## Assessment

- New information ratio: 0.75
- Questions addressed: Which commands never load the mode SKILL.md their metadata names, which skills have no command front door, and should a skill recommendation imply its command?
- Questions answered: Which commands never load the mode SKILL.md their metadata names, which skills have no command front door, and should a skill recommendation imply its command?

## Reflection

- What worked and why: reading the router's actual load list instead of the metadata choreography exposed the gap in one comparison; the metadata describes an intent the executable path does not implement.
- What did not work and why: a first path check resolved alias names as folder names and reported every mode file missing; the real folders use the packet names, and rechecking with those paths showed all files exist.
- What I would do differently: trace one command execution end to end with a transcript, which would show whether a model ever opens the mode skill out of habit even when the router does not require it.

## Recommended Next Focus

Angle 8 (measurement): the benchmark and fixture rows needed for every command group and chat-style prompts, and the metrics that separate a missed command from a wrongly started one.
