# Iteration 7: Skill and command linkage — the two paths that never meet

## Focus

Angle 7 (skill and command linkage): which command workflows never load the mode `SKILL.md` their metadata names, and whether a skill recommendation should imply its command. Chosen because iteration 6's mechanism depends on a command and its owner skill being inter-derivable, and that assumption had not been tested.

## Actions Taken

1. Scanned all 45 command files for `skill_agent:` frontmatter and any `.skilled/skills/` path reference.
2. Parsed the three `command-metadata.json` hubs: resolved every `ownerMode` to a real `SKILL.md` and checked whether the declared `choreography` loads one.
3. Read representative command routers from three different families to see what they actually load.

## Findings

1. Command-to-skill linkage is carried in three incompatible ways: a `skill_agent:` comment in the command file (17 commands, all `/doctor:*`), an `ownerMode` plus `choreography` block in metadata (19 commands), or nothing at all. No command carries both, and none carries a field the runtime reads at command time [SOURCE: .skilled/commands/doctor/skill-advisor.md:1].

2. All 19 metadata entries declare a three-step choreography that loads a hub `SKILL.md`, a mode `SKILL.md` and a presentation contract, so the metadata asserts a skill-mediated execution path for every command it describes [SOURCE: .skilled/skills/sk-doc/command-metadata.json:1].

3. Of those 19 `ownerMode` values, 18 resolve to an existing `SKILL.md`; `/create:skill-parent` names `sk-create-skill-parent`, for which no directory and no `SKILL.md` exist, while the string still appears in `sk-doc/mode-registry.json` [SOURCE: .skilled/skills/sk-doc/mode-registry.json:1]. A second mapping is misleading rather than broken: `/design:extract` names `sk-design-md-generator`, an artefact generator rather than an extract mode [SOURCE: .skilled/skills/sk-design/command-metadata.json:1].

4. The command files frequently carry none of that choreography. `.skilled/commands/create/agent.md` contains zero occurrences of `sk-doc`, `sk-create-agent` or `SKILL.md` and routes only to a presentation contract and a workflow YAML in `commands/create/assets/` [SOURCE: .skilled/commands/create/agent.md:12], while its metadata declares the two-skill load. The metadata path and the executed path diverge at the first step.

5. 27 of the 45 command files reference no `.skilled/skills/` path anywhere, so for most commands the skill linkage exists only in a metadata file that no runtime reads when the command runs [SOURCE: .skilled/commands/create/agent.md:1].

6. The flagship chat-only case is the sharpest example: `/speckit:plan` references two spec-kit reference cards and two spec-kit scripts, and never `system-spec-kit/SKILL.md` [SOURCE: .skilled/commands/speckit/plan.md:106]. Even a correct `system-spec-kit` recommendation therefore does not entail the plan command's mode or its gates.

7. Reverse linkage is nearly absent: exactly one `SKILL.md` (deep-research) names its commands and their relationships, and 13 other skills name none [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:294]. So neither direction of the mapping is closed: skill→command fails for 13 skills, command→skill fails for 27 commands.

8. Consequence for the surfacing design: a model that routes to a skill and hand-follows it produces a different process from the same command's YAML workflow, because the command router never loads the skill and the skill never names the command. That is exactly the divergence the packet exists to close, and it is structural rather than a prompting problem [INFERENCE: from findings 4, 5 and 7].

## Answer to the linkage question

Which workflows never load their named mode `SKILL.md`: 27 of 45 reference no skill at all, and even inside the 19 metadata entries the declared choreography is not carried by the command file. Should a skill recommendation imply its command: **no**. Implication in that direction is unsound on two counted cases (one dangling `ownerMode`, one mislabelled) and on 27 commands with no linkage at all. The sound direction is the reverse: the command declares `ownerSkillId` (the data exists in `allow-list.json` as `skillId` and in metadata as `ownerMode`), and the advisor surfaces the command with its owner skill attached, so the recommendation is command-first and the skill is context rather than an inference step.

## Ruled Out

- Inferring a command from a skill recommendation: unsound for 13 skills with no command pointer and for the 27 commands with no skill pointer.
- Treating metadata `choreography` as the executed path: contradicted by `/create:agent`, whose router loads only assets, and by `/speckit:plan`, which loads reference cards rather than the SKILL.md.

## Dead Ends

- Searching for a single canonical command→skill field: there is none. The three existing carriers (`skill_agent`, `ownerMode`, `allow-list.skillId`) are the whole vocabulary, and only `allow-list.skillId` covers commands without metadata.

## Edge Cases

- Ambiguous input: "never load the mode SKILL.md their metadata names" presumes every command has metadata. Selected interpretation: report three populations — 19 with metadata, 17 doctor with `skill_agent` only, 9 with neither (speckit minus nothing, prompt, local-skilled-alignment, and the deep/design commands whose metadata names a mode rather than a skill directory).
- Contradictory evidence: metadata says a command loads two SKILL.md files; the command says it loads assets. Resolved in favour of the command file for execution and the metadata for intent, and the divergence is itself the finding.
- Missing dependency: the 17 doctor YAML workflows were not opened, so whether their YAML loads the `skill_agent` skill is unverified. Recorded as the next narrow check rather than assumed either way.
- Partial success: the `_routes.yaml`-to-bridge linkage was verified in iteration 4; the YAML-to-skill linkage is the remaining gap.

## Questions Answered

- Which command workflows never load the mode SKILL.md their metadata names, and should a skill recommendation imply its command?

## Questions Remaining

- 3 of 9 remain open.

## Sources Consulted

- .skilled/commands/ (all 45 files, frontmatter and skill references)
- .skilled/skills/sk-doc/command-metadata.json, sk-design/command-metadata.json, system-deep-loop/command-metadata.json
- .skilled/skills/sk-doc/mode-registry.json
- .skilled/commands/create/agent.md
- .skilled/commands/speckit/plan.md
- .skilled/skills/system-deep-loop/deep-research/SKILL.md

## Assessment

- New information ratio: 1.0
- Questions addressed: Q7 (linkage), Q6 refinement
- Questions answered: Q7
- Findings: 8, all new

## Reflection

- What worked and why: resolving every `ownerMode` to a real `SKILL.md` and then checking whether the command file carries the same references produced a count in both directions (1 dangling, 27 unlinked) instead of an impression. Reading two routers from different families showed the divergence is systematic, not a doctor quirk.
- What did not work and why: I initially assumed metadata `choreography` described execution because it is written in the imperative. `/create:agent` disproved it in one read. The lesson is that declarative metadata is not evidence of runtime behaviour until the runtime file is opened.
- What I would do differently: sample the executed path first (one command router), then read the metadata — the divergence would have framed the whole count.

## Recommended Next Focus

Angle 8 (measurement): name the benchmark and fixture rows that would separate a missed command from a wrongly started one, starting from the existing bench surfaces (`runtime/bench/scorer-bench.ts`, `runtime/scripts/routing-accuracy/scorer-eval-baseline.json`, the doctor phrase-reach check) and what they currently assert.
