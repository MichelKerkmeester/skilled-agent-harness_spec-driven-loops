# Iteration 5: Answering F-1-003 — the memory and skills shape, and its mapping onto Skilled

## Focus
Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?

This is the closing iteration for the node. It adds no new external evidence; it reads the Skilled side and states the answer.

## Actions Taken
1. Read `.skilled/skills/README.txt` for the skill discovery contract.
2. Read the `system-skill-advisor` SKILL.md frontmatter as the richest Skilled frontmatter in the tree.
3. Read the spec-kit continuity ladder and the save path.
4. Re-read the four repos' memory discriminators against each other and against Skilled.

## Findings
1. All four repos converge on one memory store with a scope discriminator, not two stores. OpenBot uses `formedBy` plus `formedByBotId`; openhuman maps each agent to `{agent_id, root, recall}`; OpenGhost keeps one shared memory beside a per-chat record; hermes-muse delegates entirely to the host. No repo keeps a separate "shared memory" and "bot memory" database. [INFERENCE: based on specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:563, specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/scope.rs:13, specs/system-skilled-bots/context/OpenGhost-main/fact-keeper.js:4, specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:3]
2. The smallest workable shape is OpenGhost's: one shared memory file of short records plus a per-chat record file, each record `{id, text, at, by}`, with four hard limits in one constant. It is 213 lines and needs no service, no database and no admin. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11]
3. Skilled already has the skill half. Sixteen skills are discovered automatically from a valid `SKILL.md` frontmatter plus `graph-metadata.json`, and "no manual registration step exists". [SOURCE: .skilled/skills/README.txt:33]
4. Skilled's `SKILL.md` frontmatter is already richer than hermes-muse's three fields and close to OpenBot's `Skill` record: `name`, `description`, `allowed-tools`, `version`, `trigger_phrases`, `keywords`, `intent_signals`. What it lacks is `ownerId`, `botIds` and a review state. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:1]
5. The "written" origin already works with no change: a person writes a `SKILL.md`, the frontmatter and graph metadata make it discoverable, and the advisor routes to it. [SOURCE: .skilled/skills/README.txt:33]
6. The "recorded from a demonstration" origin has no Skilled equivalent and no cheap one. OpenBot delegates it to an external Learning service with recordings, per-person containers and a review queue; the recording path alone needs a browser recorder and a container per person. The smallest honest answer is to skip it and say so. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:62]
7. The "proposed from use" origin maps onto two things Skilled already has: a proposal is a candidate `SKILL.md` written into a proposals folder, and its approval is a needs-you item. That reuses the existing skill discovery and the existing approval surface instead of adding a review UI. [INFERENCE: based on specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2124 and the needs-you item surface in .skilled/skills/system-skilled-bots/]
8. The spec-kit already owns the per-person continuity surface: `handover.md`, then the `_memory.continuity` frontmatter block, written by `generate-context.js` through `/speckit:save`. That is the natural home for a person's shared memory rather than a new store. [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:138]
9. The mapping is therefore asymmetric and small: skills need one new frontmatter field (`bots`) and one new folder (`proposals/`); memory needs one new file per scope and one new command to read and write it. Neither needs a service, a database, a container or a review UI. [INFERENCE: based on findings 3-8]
10. OpenBot's `reviewState` gate is the one behaviour worth copying even at small-team size, because it is exactly what stops a bot's own guess from becoming a fact every other bot recalls. OpenGhost's live-write posture is defensible only because it is single-user; a shared host with several people needs the gate. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:557]
11. The licence position is clean for the two files worth lifting: OpenGhost's `memory.js` and `desktop/skills.js` are MIT, so both can be ported with attribution. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1]

## Ruled Out
- A separate shared-memory store and per-bot memory store. No reference repo does it, and it doubles the write path for no gain.
- Copying OpenBot's `reviewState` as a three-value enum with an `edited` state. Two values (`unreviewed`, `confirmed`) carry the gate; `edited` is a UI affordance, not a recall rule.
- Building the "recorded from a demonstration" origin. It needs a recorder, a container per person and an external analysis service, which is the enterprise shape D3 puts on the skip list.

## Dead Ends
- Searching Skilled for an existing memory store to extend. There is none: the only continuity surface is the spec-kit's per-packet `handover.md` and `_memory.continuity`, which is per-packet, not per-person or per-bot. The gap is real and cannot be closed by configuration.

## Edge Cases
- Ambiguous input: none. The node's question is answered directly.
- Contradictory evidence: OpenBot gates agent-formed memory, OpenGhost does not. Resolved by scope rather than by picking a winner: the gate is required once more than one person shares the host, which is this packet's stated use case (D3, a small team). Recorded as a deliberate choice, not an averaged one.
- Missing dependencies: none new.
- Partial success: none.

## Sources Consulted
- .skilled/skills/README.txt:31-33
- .skilled/skills/system-skill-advisor/SKILL.md:1-25
- .skilled/skills/system-spec-kit/SKILL.md:136-145
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:557-572
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2124-2169
- specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:62
- specs/system-skilled-bots/context/OpenGhost-main/memory.js:11
- specs/system-skilled-bots/context/OpenGhost-main/fact-keeper.js:4
- specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/scope.rs:13
- specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:3

## Assessment
- New information ratio: 0.78
- Questions addressed: How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?
- Questions answered: How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?

## Reflection
- What worked and why: reading the Skilled side only after the four repos were fully evidenced. The mapping fell out of the comparison rather than being designed from Skilled's existing shape, which is why it is asymmetric — skills need almost nothing and memory needs a new file.
- What did not work and why: looking for an existing Skilled memory store to extend. The spec-kit's continuity surfaces are per-packet, so extending them would have conflated "what this packet knows" with "what this person knows", which is the confusion the node exists to prevent.
- What I would do differently: state the skip decision for the recorded-from-a-demonstration origin earlier. It is the largest single piece of OpenBot's skills story and the one a parity effort is most likely to over-scope; naming it as a skip in iteration 2 would have kept the later iterations focused.

## Recommended Next Focus
The depth-2 nodes this iteration's evidence opened: the memory review mapping onto needs-you items, the smallest on-disk store, and the skill proposal mapping. The first of those is the one that decides whether the gate is cheap enough to build.
