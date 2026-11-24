# Iteration 9: Memory and skills — mapping onto Skilled skills and the spec-kit

## Focus
Memory and skills mapping onto Skilled skills and the spec-kit: how a bot's learned skill becomes a reviewed SKILL.md and where a spec packet owns it. This completes the fourth part of the eight-part frame (skills) and the second half of the memory question.

## Actions Taken
- Read OpenBot's skill definition, its three ways of making one, and its ownership rules.
- Read OpenBot's tool narrowing by skill and its in-conversation authoring card.
- Read the tenant package's `skills.yaml` contract.
- Read the Skilled skill package anatomy and the spec-kit's authored-doc and continuity contracts.
- Read the BOT.md fields that bind a spec folder and a budget.

## Findings
1. An OpenBot skill is a named way of doing a task, called with `/`, and it is made in exactly three ways: the person writes it, the bot records the steps from a demonstration, or OpenBot proposes one from conversations. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:64-70]
2. Skills share the plugin grant table with MCP but have different ownership: a person may create personal skills and attach them only to bots they own, while administrators create deployment skills. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:327-329]
3. OpenBot narrows the tools a run is offered by skill: a bot holding more than a handful of tools is offered, per run, only the tools of the skills that match the message. A skill declares the tools it needs, and the declaration grants nothing because the offer is intersected with what the bot was already granted. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:349-360]
4. Authoring a skill inside a conversation suspends the run on a card showing the command, title and whole instruction; nothing is written until the person presses the button, and the four authoring tools are offered only while the bot holds `skill-creator`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:343-347]
5. A tenant package's `skills.yaml` turns each declared skill into a deployment skill on boot, and its `tools` list is what makes tool narrowing work on a fresh deployment; the `skill-creator` slug is load-bearing because without it writing a skill in the composer quietly does nothing. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:1500-1524]
6. A Skilled skill is a folder with a `SKILL.md` carrying YAML frontmatter (name, description, allowed-tools, version) and optional `ROUTER.md`, references, assets and scripts; the hub reads the skill, then the router, then only the matched leaf resources. [SOURCE: .skilled/skills/sk-doc/SKILL.md:1-10] [SOURCE: .skilled/skills/sk-doc/ROUTER.md:1-20]
7. The spec-kit owns authored spec docs and continuity: a numbered packet with `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md`, strict validation, and a memory-save workflow that refreshes continuity surfaces through one canonical entrypoint. [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:20-60] [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:1-40]
8. Skilled bots' BOT.md body is the standing instruction, and the definition already binds a spec folder and a budget, so a bot run and a spec packet are already connected. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:23-58]
9. Mapping: an OpenBot skill is a Skilled skill package (`SKILL.md`); "recorded from a demonstration" is a proposed `SKILL.md` written with its evidence and reviewed before it is installed; OpenBot's tool narrowing is the skill's `allowed-tools` intersected with the bot's declared MCP servers; deployment skills are the repository's `.skilled/skills/*`; a personal skill is a per-bot body section or a personal skills folder. Memory maps the other way: shared facts belong in the spec-kit's continuity surfaces, bot-picked facts in a per-bot memory file. [INFERENCE: based on findings 1-8]
10. Smallest change: one `bots learn` command that writes a proposed `SKILL.md` plus an evidence note into `specs/<packet>/scratch/proposed-skills/`, and a review step that moves an accepted one to `.skilled/skills/<name>/`. No new format is needed, because `SKILL.md` already carries name, description and allowed-tools, and the spec packet already provides the review trail. [INFERENCE: based on findings 4-8]

## Ruled Out
- Building a skill marketplace or a Learning container. Both exist in OpenBot to distribute skills across many people; a small team installs skills by moving a folder.
- Giving skills their own storage format. `SKILL.md` with frontmatter already holds everything a proposed skill needs.
- Storing learned skills in the BOT.md body. The body is the standing instruction; a skill is a separate, reviewable, reusable unit.

## Dead Ends
- Looking for a skill registry in the bots runtime: there is none; skills live in the Skilled tree, and the bot runtime does not read them.
- Looking for a per-person skill scope in the spec-kit: the packet is the scope, not the person.

## Edge Cases
- Ambiguous input: "skills recorded or proposed from use" could mean the model writing a skill automatically or proposing one for review. OpenBot's own team edition never auto-approves, so review was taken as the required step.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md
- specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md
- .skilled/skills/sk-doc/SKILL.md
- .skilled/skills/sk-doc/ROUTER.md
- .skilled/skills/system-spec-kit/SKILL.md
- .skilled/skills/system-spec-kit/references/memory/save-workflow.md
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts

## Assessment
- New information ratio: 0.90
- Questions addressed: skills from use and their mapping to Skilled skills and the spec-kit
- Questions answered: skills mapping

## Reflection
- What worked and why: the three-way skill origin in OpenBot's how-it-works page maps cleanly onto three existing Skilled surfaces — authoring a skill, proposing one in a packet, installing one in the tree. The mapping needed no new concept.
- What did not work and why: OpenBot's `skills.yaml` is a deployment package format, not a skill format; reading it for schema details mostly confirmed the grant model already found.
- What I would do differently: read one existing `.skilled/skills/*/ROUTER.md` for a skill with references, to see the exact frontmatter a proposed skill must satisfy.

## Recommended Next Focus
Approvals and activity against our needs-you items, run records and bots status: a direct gap table with the smallest change for each of the two parts.
