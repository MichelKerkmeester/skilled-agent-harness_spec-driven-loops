# Iteration 1: OpenBot's memory model — per-bot versus shared, and how a fact is formed

## Focus
Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?

This iteration takes the first half of that node: OpenBot's own memory model, because the other repos can only be judged against a baseline. Skills are deferred to iteration 2.

## Actions Taken
1. Read `OpenBot-main/docs/how-openbot-works.md` §3 "It checks its memory" and the "Two scopes, and a third for teams" section.
2. Read the header comment and the `Memory` / `MemorySource` schemas in `OpenBot-main/api/openapi/memory.yaml`.
3. Grepped the OpenBot tree for memory implementation files to confirm the API spec is the canonical model rather than a generated client.
4. Read the `BOT.md` template and the `bots-author` skill to establish what skilled bots has today.

## Findings
1. OpenBot's memory is a per-person fact store scoped to an organization, not a per-bot store: the collection path is `/api/v2/organizations/{organizationId}/people/{personId}/memories`, so every fact belongs to a person inside one organization. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:17]
2. Shared versus per-bot memory is one store with two discriminators, not two stores. `formedBy` is `person | import | bot | intelligence`, and `formedByBotId` names the bot that formed the fact; the schema says of that bot "Only that Bot recalls it." A person-formed fact has no `formedByBotId`, so every bot recalls it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:563] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:570]
3. The docs state the same split in one sentence: "Facts you add are shared with all your Bots. Facts a Bot picks up while working stay with that Bot." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:61]
4. A memory carries a review state of `unreviewed | confirmed | edited`, and an unreviewed memory is never recalled: "a Bot formed it or a source read it in, and no Bot recalls it until the person accepts it." Bot-formed memory therefore arrives inert and needs a human accept before it can influence a run. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:557]
5. Pausing is a boolean, not a delete: `enabled: false` means "the person has paused it. A paused memory is never recalled." Forgetting is the separate destructive operation. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:554]
6. Memory sources are per-bot app actions with their own sync clock. `MemorySource` requires `botId`, `toolRef` (`appId/toolName`), `args`, `enabled`, `syncStatus` (`idle | running | succeeded | error`), `syncError`, `lastSyncAt` and `nextSyncAt`; `botId` is documented as "The Bot that reads it, and the only one that recalls what it read in." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:640] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:659]
7. Memory is organization-partitioned and cannot leak across organizations: "What their Bots remember in one organization is never listed or recalled in another they belong to, and a memory named from another organization is answered as not found." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:14]
8. A single-person OpenBot keeps no memory at all: "A single-person OpenBot keeps no memory: every operation here answers not found there." Memory is a team-edition primitive, and the docs confirm "The personal edition does not yet" list Memory. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:10] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:150]
9. Where CopilotKit Intelligence is present, OpenBot is not the recall engine: Intelligence "holds a copy of each memory the person accepted and does the recall", and OpenBot's own record is the whole store only without it. The smallest-team reading is that OpenBot's memory is a thin record plus a delegated recall service. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:7]
10. Skilled bots has no memory primitive today. The `BOT.md` template's field set is `id`, `trigger`, `runtime`, `budget`, `enabled`, `delivery`, `isolation`, `sandbox`, `secrets`, `precheck`, `spec_folder`, `version` plus a body — no memory field, no store path, no recall hook. [SOURCE: .skilled/skills/system-skilled-bots/assets/bot-template.txt:1]
11. The only occurrence of "memory" in the bots-author skill is the phrase "Start from the shipped template, never from memory", which is about the author's own recall, not a bot memory feature. [SOURCE: .skilled/skills/system-skilled-bots/bots-author/SKILL.md:59]

## Ruled Out
- Reading the generated TypeScript client under `app/src/lib/api/generated/memory/` as the model source. It is generated from `api/openapi/memory.yaml`, so the spec is the authority and the client adds no semantics.
- Treating `formedBy: intelligence` as a fourth memory scope. It is a provenance value for a fact the backend holds that OpenBot formed no record of, and the schema says such a fact "can be edited or forgotten but not paused" — a storage-origin distinction, not a scope.

## Dead Ends
- Searching for a memory implementation directory under `api/` returned only `api/openapi/memory.yaml`. OpenBot's memory server code is not in this reference checkout, so the model must be read from the spec and docs. This bounds how far "how it is built" can be answered for memory: the contract is available, the implementation is not.

## Edge Cases
- Ambiguous input: none. The node names memory and skills; this iteration takes memory and records skills as the next focus.
- Contradictory evidence: none. The spec and the docs agree on the shared/per-bot split.
- Missing dependencies: OpenBot's memory server implementation is absent from the reference checkout. Fallback used: the OpenAPI contract plus the operator docs, which together fix the data model and the recall rules. Recorded as a confidence limit on any "how it is built" claim.
- Partial success: none. All four planned reads succeeded.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:1-40
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:524-700
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:1-175
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/skills.yaml:294-335
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml:2124-2170
- .skilled/skills/system-skilled-bots/assets/bot-template.txt:1-33
- .skilled/skills/system-skilled-bots/bots-author/SKILL.md:59

## Assessment
- New information ratio: 1.0
- Questions addressed: How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?
- Questions answered: none fully. The memory half of the node is now evidenced; the skills half and the mapping are open.

## Reflection
- What worked and why: going to the OpenAPI spec before the prose docs. The spec carries the discriminators (`formedBy`, `formedByBotId`, `reviewState`, `enabled`) that decide recall, and the docs only restate them; reading the spec first made the docs a confirmation rather than a source of ambiguity.
- What did not work and why: searching for a memory implementation directory. The reference checkout ships the contract, not the server, so an implementation-level answer is not available here and pretending otherwise would have produced an unsupported claim.
- What I would do differently: read the `MemorySource` schema before the `Memory` schema next time. The source is what makes memory grow without a person typing, and knowing that first would have framed the review-state finding as "the gate on automatic growth" rather than as a field description.

## Recommended Next Focus
OpenBot's skills model: the three origins the docs name (written, recorded from a demonstration, proposed from use), the `Skill` schema's `ownerId` / `botIds` / `usableOnYourBots` scoping, and the `LearningProposal` review lifecycle (`pending_review | approved | rejected`, `operation: add | update | remove`, `publishedSkillId`). That completes the OpenBot baseline for F-1-003 before the other repos are compared against it.
