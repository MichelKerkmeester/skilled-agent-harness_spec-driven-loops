# Iteration 6: Frontier F-2-009 — shared versus per-person memory, and skills learned from use

## Focus
Frontier node F-2-009 (depth 2, scope OpenBot-main/app/src/components/memory, OpenBot-main/docs, .skilled/skills/system-skilled-bots): How should shared versus per-person memory be scoped when a few people use the same bots, and what does OpenBot's memory model do that skilled bots' per-bot files do not?

## Actions Taken
- Read OpenBot's personal-memory architecture and its edition boundary.
- Read the how-it-works description of shared versus bot memory.
- Read OpenBot's automatic-learning page for skills from use and per-person containers.
- Read skilled bots' BOT.md schema and the runtime library inventory.
- Read turnstone's structured-memory model and openhuman's memory architecture.

## Findings
1. OpenBot's personal memory exists only in the team edition. The personal edition has none at all: OpenBot Desktop's local Intelligence is licensed without memory, so there the memory has no screens, routes, tools or sources. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:370-375]
2. OpenBot splits memory by origin, not by scope picker: facts the person adds are shared with all their bots, while facts a bot picks up while working stay with that bot. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:61-62]
3. OpenBot keeps the provenance record that its memory backend lacks — where a memory came from, its review state, which bot formed it and which source imported it — and applies it before a bot sees anything: a bot-formed memory reaches only the forming bot while it holds the source app, and every call is user-scope with project-scoped results dropped, so one person's bot never sees another person's memory. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:377-383]
4. OpenBot's skills-from-use is a separate learning loop, not memory: completed conversations feed a Learning container, Intelligence proposes skills with their SKILL.md, the reason and the conversations they were learned from, and a person approves or rejects. In the team edition nothing — not a scheduled analysis, not enabling Learning — approves a skill by itself. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:3-5] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:30-35]
5. Learning containers are per person, not per bot: a recording joins the person's own container, a run draws the bot's own published skills first, then the person's, then any skill another person opened, and each person chooses sharing (own bots only, every bot in the deployment, or skill by skill). [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:50-58]
6. Skilled bots' BOT.md schema has no memory field. A definition is id, trigger, runtime, budget, enabled, delivery, posture, precheck, specFolder and body; memory is not part of the contract. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:23-58]
7. The bots runtime has 28 flat modules and none of them is memory; the modules cover contracts and state, schedule, runner and dispatch, isolation and delivery, the request pipeline, the launchd installer and the status index. Memory is simply not a runtime concern today. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:1-16] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:30-50]
8. Turnstone's structured memory is the cleanest small model in the reference set: four types (user, general, feedback, reference), five scopes (global, workstream, user, coordinator, project), an identity tuple of name, scope and scope id, upsert on the same identity, and a body-free metadata index at the first turn with an explicit get to read a body. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/memory.md:1-40]
9. Openhuman's memory is the service-shaped opposite: recall, fetch and store over a pluggable engine, stored in CortexDB, with memory off entirely when no engine is configured. That is a dependency a small team does not need. [SOURCE: specs/system-skilled-bots/context/openhuman-main/docs/gitbooks/en/developing/architecture.md:225]
10. Smallest change for skilled bots: memory as typed files, not a service. Per-bot memory at `bots/<id>/memory.md` and shared memory at `bots/memory.md`, each entry carrying type (user, general, feedback, reference) and provenance (actor, source, bot, date); `bots remember` appends and `bots memory` lists; the runner prepends both files to the prompt. Skills from use stay in the spec-kit loop: a proposed `SKILL.md` is written into a packet's scratch area and reviewed like any other skill, with no Learning service. [INFERENCE: based on findings 2-9]

## Ruled Out
- Building a memory service or embedding store. The reference set's service-shaped memories (OpenBot Intelligence, openhuman CortexDB) exist to serve many users and machines; a few people on one host do not need recall ranking.
- Copying OpenBot's per-person Learning containers. They depend on a hosted backend and a skills marketplace; the same value comes from a proposed SKILL.md reviewed in a packet.
- Giving each bot its own memory schema. The BOT.md contract is already a stable, small frontmatter; memory belongs beside the bot, not inside its definition.

## Dead Ends
- Searching skilled bots' runtime for memory code: there is none, and the library README's module table confirms the absence rather than a gap in the search.
- Reading OpenBot's memory components (`memories.tsx`, `sources.tsx`) for a data model: they are screens over the API, not the model.

## Edge Cases
- Ambiguous input: "shared versus per-person memory" could mean shared across bots or shared across people. Both were answered: OpenBot shares person-added facts across that person's bots, and never shares one person's memory with another person.
- Contradictory evidence: OpenBot's docs say memory is team-edition only, while the how-it-works page describes memory without that qualifier. The architecture page is the more specific statement and was treated as authoritative.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md
- specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md
- specs/system-skilled-bots/context/turnstone-main/docs/memory.md
- specs/system-skilled-bots/context/openhuman-main/docs/gitbooks/en/developing/architecture.md
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts
- .skilled/skills/system-skilled-bots/runtime/lib/README.md

## Assessment
- New information ratio: 0.90
- Questions addressed: F-2-009 (shared versus per-person memory, skills from use)
- Questions answered: F-2-009

## Reflection
- What worked and why: the edition boundary was the decisive fact. OpenBot's memory is a team feature with a hosted backend, which explains why the smallest version for this team is files with provenance rather than a store.
- What did not work and why: the memory screen components say nothing about storage; the architecture page's four bullets carry the whole model.
- What I would do differently: read the spec-kit's memory conventions next, since the shared-memory file should land where the team already looks rather than in a new folder.

## Recommended Next Focus
Routines: how OpenBot's sentence-shaped routines, event starts and until outcomes map onto skilled bots' cron, queue and git-hook triggers, and what the smallest change is for a routine list.
