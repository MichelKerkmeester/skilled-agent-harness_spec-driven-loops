# Iteration 9: Memory and skills — the shared/per-bot split and the skill lifecycle

## Focus

Memory and skills: how OpenBot's per-bot and shared memory and its three ways of recording a skill map onto Skilled's skills and the spec-kit, and what the smallest per-bot and shared memory store would be.

## Actions Taken

1. Read OpenBot's memory and skill summary in the eight-part overview.
2. Read the automatic-learning document for the learned-skill pipeline.
3. Read the BOT.md key list and the bot prompt builder.
4. Read the spec-kit retrieval and continuity reference.
5. Read OpenGhost's skill mention parser and its `<skill_content>` wrapper.

## Findings

1. OpenBot splits memory by origin: facts a person adds are shared with all their Bots, while facts a Bot picks up while working stay with that Bot. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:59-63]
2. OpenBot makes a skill in three ways: the person writes it, the person shows the Bot the task once and it records the steps, or OpenBot proposes one from conversations. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:65-70]
3. A learned skill is reviewed before use: its SKILL.md, why it was proposed, and the conversations or recordings it came from are shown with approve and reject, and the personal edition can approve new skills automatically. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:78-88]
4. OpenBot's automatic-learning pipeline is heavy: Intelligence containers, evidence collection, proposed-skill review, per-person spaces and sharing controls; a small team does not need the container or sharing layers. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:10-14] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:31-36] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:69-74]
5. Skilled bots' BOT.md has no memory or skills field; its keys are id, trigger, runtime, budget, enabled, delivery, isolation, sandbox, secrets, precheck and spec_folder. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:94-108]
6. Skilled skills are global SKILL.md directories under `.skilled/skills/`, and the spec-kit's continuity writer routes session context into a packet's own documents rather than a per-bot memory. [SOURCE: .skilled/skills/system-spec-kit/references/memory/memory-system.md:16-32]
7. The bot prompt is built from the BOT.md body, the bound spec folder and the decision rule; it carries no memory and no selected skill content. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:311-338]
8. The smallest memory change is two markdown files under the user state root, one shared and one per bot, prepended to the prompt in that order, with a `bots remember` verb to append and a needs-you item when a Bot proposes a fact. Size S, risk low because it adds text to an existing prompt. [INFERENCE: based on findings 1, 5 and 7]
9. The smallest skill change is a `skills: [name]` list in BOT.md that resolves `.skilled/skills/<name>/SKILL.md` bodies into the prompt, plus a `bots skill propose` draft with needs-you approval; OpenGhost's `/name` mention parser and `<skill_content>` wrapper are liftable MIT patterns. Size M, risk medium because a skill body can be long and the prompt budget must be bounded. [INFERENCE: based on findings 2, 3, 5 and 7] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:1-20]

## Ruled Out

- Copying OpenBot's automatic-learning pipeline: Intelligence containers, per-person spaces and sharing review are enterprise-scale machinery, not a small-team need.
- Making memory a model-written free-for-all: the smallest store is a person-authored shared file plus a per-bot file, with a needs-you item when a Bot wants to add a fact.
- Loading every skill into every prompt: skill bodies are long, so BOT.md must name the few it needs.

## Dead Ends

- Searching BOT.md for a memory or skill key found none; the definition has no such surface today.
- Treating the spec-kit's continuity writer as per-bot memory would conflate project continuity with a Bot's own knowledge.

## Edge Cases

- Ambiguous input: none. The memory and skills pairing is named in the topic.
- Contradictory evidence: none. OpenBot's memory split and skill lifecycle are separate mechanisms that compose.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:59-70
- specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:10-14
- specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:31-36
- specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:69-74
- specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:78-88
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:94-108
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:311-338
- .skilled/skills/system-spec-kit/references/memory/memory-system.md:16-32
- specs/system-skilled-bots/context/OpenGhost-main/skills.js:1-20

## Assessment

- New information ratio: 0.9
- Questions addressed: memory and skills (topic question 4)
- Questions answered: none tracked as a frontier question; this iteration broadens beyond the dealt frontier

## Reflection

- What worked and why: Reading the prompt builder before the memory model showed exactly where memory and skill text would enter a run, so the change stayed a prompt addition rather than a new service.
- What did not work and why: Searching BOT.md for memory keys found none, which is the gap rather than a missing file.
- What I would do differently: Read the spec-kit continuity reference before the OpenBot learning document, so the small-team boundary is set before the enterprise pipeline is described.

## Recommended Next Focus

Apps and computer: how OpenBot's connectors and secret vault compare with MCP and Code Mode, and how a Bot's computer compares with the existing worktree isolation; then the small-team sign-in and roles model.
