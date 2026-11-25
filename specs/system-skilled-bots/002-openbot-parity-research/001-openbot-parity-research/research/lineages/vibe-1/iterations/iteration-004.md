# Iteration 4: OpenGhost and openhuman — the two ends of the memory spectrum

## Focus
Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?

This iteration takes the last two repos in the node's scope. They sit at opposite ends: OpenGhost is a 213-line shared memory with hard limits, openhuman is a vendored memory engine with lifecycle hooks and a document brain.

## Actions Taken
1. Read `OpenGhost-main/memory.js` end to end, including the `tidy` acceptance rule.
2. Read `OpenGhost-main/fact-keeper.js` (the post-reply extraction prompt) and `OpenGhost-main/skills.js`.
3. Read `OpenGhost-main/desktop/skills.js` for the skill discovery roots and format.
4. Read `openhuman-main/crates/openhuman-core/src/memory/mod.rs`, `scope.rs` and `tools.rs`.
5. Checked the licence of every reference repo.

## Findings
1. OpenGhost keeps one shared memory of the user as a flat list of short records with hard limits: 400 characters per record, 60 records, and "crowded" at 28 records or 3600 characters total. The whole design fits in one constant. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11]
2. Each record is `{id, text, at, by}` where `by` is `'agent'` or `'user'`. Provenance is a two-value field, not a review state: an agent-written record is live immediately and the user edits or removes it in Settings. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:87]
3. OpenGhost splits per-chat from shared in exactly the way the node asks about: the chat's "record" is a private file per chat that outlives its summaries, and the "memory" is shared by all the user's chats. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/fact-keeper.js:4]
4. Extraction is a separate model call after each reply, and the stated reason is that the working model cannot be trusted to do it: "Models of every size let facts pass by while they work, the weaker ones nearly all of them". [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/fact-keeper.js:4]
5. The extractor is told to write a changed fact as an edit so "no two lines ever disagree", and to prefer the per-chat record when unsure: "a line too many costs little, a lost fact costs much." [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/fact-keeper.js:40]
6. Compaction is a model rewrite, not a delete: `tidy` asks a model to write the memory anew as one whole, merging duplicates and keeping only the later of two disagreeing records. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:12]
7. The tidy result is accepted only on four conditions: non-empty, strictly shorter than what it replaced, memory still switched on, and every source record still present. Records added or changed meanwhile survive untouched. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:145]
8. OpenGhost's skills are the open Agent Skills format (agentskills.io): a folder with a `SKILL.md`, a YAML head with name and description, then instructions, with `scripts/`, `references/` and `assets/` read only when the instructions point at them. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/desktop/skills.js:3]
9. Skill discovery reuses other agents' folders rather than inventing one: `~/.agents/skills`, `~/.claude/skills`, and the same two inside the project, with the project's own winning over the user's of the same name; new skills are written to `~/.agents/skills`. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/desktop/skills.js:9]
10. A skill is invoked by typing `/name` in a message, and its instructions reach the model wrapped in `<skill_content name="...">`, which is also how a chat summary finds them again. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:13]
11. openhuman-main is the opposite end: a full memory subsystem, not a store. It binds a vendored TinyMemory engine with turn hooks (pre-turn pack, post-turn log, compaction recall), a background job queue, a shared "brain" of documents by source type, a `[[memory.sources]]` registry (folder, file, link, github, rss, composio), consent-gated backfill and import, and one `memory` agent tool. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/mod.rs:1]
12. openhuman's per-agent split is configuration, not schema: `identity_pins` maps each agent id to `{agent_id, root, recall}`, so a bot gets its own memory root and its own recall switch. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/scope.rs:13]
13. openhuman's memory tool is budgeted and fails open: a refusal carries `openhuman.memory_budget` metadata and the run continues with "Continue answering the user's request without memory. Do not retry memory in this run." [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/tools.rs:24]
14. The licence split decides what is liftable: OpenBot, OpenGhost and hermes-muse are MIT; openhuman is GPL-3.0; OpenMausBot, rakazo, turnstone and buzz are Apache-2.0. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1]

## Ruled Out
- Copying openhuman's memory subsystem. It is a vendored engine with a job queue, a document brain and a source registry, and it is GPL-3.0. For a small team it is the wrong size and the wrong licence.
- Treating OpenGhost's `by` field as a review gate. An agent-written record is live at once; the user's control is edit and remove, not approve. That is a different trust posture from OpenBot's `reviewState` and the difference matters for the recommendation.

## Dead Ends
- Looking for a skill-proposal path in OpenGhost. Its skills are discovered from folders and installed from a link; there is no proposal queue. The "proposed from use" origin remains an OpenBot-only pattern in this repo set.

## Edge Cases
- Ambiguous input: none. The node names both repos; this iteration reads both.
- Contradictory evidence: OpenBot gates agent-formed memory behind `reviewState: unreviewed` while OpenGhost writes agent records live. Both are defensible and they are not the same claim about the same system, so both are preserved: OpenBot is a multi-tenant product with an admin, OpenGhost is a single-user desktop app. The recommendation must pick one posture explicitly rather than average them.
- Missing dependencies: openhuman's TinyMemory engine is vendored and not read here, so its internal record shape is unknown. Fallback used: the host adapter and the identity pins, which fix the per-agent split and the tool contract. Recorded as a confidence limit.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenGhost-main/memory.js:1-213
- specs/system-skilled-bots/context/OpenGhost-main/fact-keeper.js:1-125
- specs/system-skilled-bots/context/OpenGhost-main/skills.js:1-30
- specs/system-skilled-bots/context/OpenGhost-main/desktop/skills.js:1-30
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/mod.rs:1-60
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/scope.rs:1-40
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/tools.rs:1-40
- specs/system-skilled-bots/context/OpenBot-main/LICENSE:1
- specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1
- specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1
- specs/system-skilled-bots/context/openhuman-main/LICENSE:1

## Assessment
- New information ratio: 1.0
- Questions addressed: How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?
- Questions answered: none fully. All four repos in the node's scope are now evidenced; the mapping onto Skilled skills and the spec-kit is the remaining half.

## Reflection
- What worked and why: reading OpenGhost's `tidy` acceptance rule rather than only its prompt. The prompt is the easy part; the four rejection conditions are what make a model rewrite safe, and they are the part a copy would most likely drop.
- What did not work and why: expecting a proposal queue in OpenGhost. It installs skills from links and folders, so the learning loop simply is not there; recording the absence stops a later iteration from searching for it again.
- What I would do differently: check licences first. openhuman being GPL-3.0 changes it from "the most complete memory system here" to "read it for ideas, do not lift it", and knowing that before reading 30 files would have set the right reading depth.

## Recommended Next Focus
Close F-1-003 by answering it: state the per-bot versus shared memory shape the four repos converge on, the three skill origins and which of them Skilled can support without new machinery, and the concrete mapping onto Skilled skills and the spec-kit. That is a synthesis iteration over evidence already gathered, not a new search.
