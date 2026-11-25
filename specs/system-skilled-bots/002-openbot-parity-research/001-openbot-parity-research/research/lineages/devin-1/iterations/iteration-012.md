# Iteration 12: Reuse — what can be lifted, with repo, path and license

## Focus
Reuse: code that can be lifted directly, with repository, path and license, ranked by how much of the gap it closes. Ninth of the nine additional questions.

## Actions Taken
- Read every reference repo's license file and package metadata.
- Located the smallest high-value modules in OpenBot's shared and bot-lifecycle code.
- Located turnstone's structured-memory implementation and OpenMausBot's team-chat state.
- Checked openhuman's license at the workspace and TUI crate level.

## Findings
1. License map: OpenBot MIT, OpenGhost MIT and hermes-muse MIT; buzz, turnstone, rakazo and OpenMausBot Apache-2.0 (OpenMausBot with an `enterprise/` carve-out); openhuman GPL-3.0-only. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-3] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1-3] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1-3] [SOURCE: specs/system-skilled-bots/context/buzz-main/LICENSE:1-3] [SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:1-3] [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1-3] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md:3-10] [SOURCE: specs/system-skilled-bots/context/openhuman-main/Cargo.toml:35]
2. OpenBot's `shared/tool-name.ts` (MIT) exports `approvalWords` and `approvalPhrase`, the classifier that names what an action is (delete, send, share, post, pay) and how it is phrased. It is the action-kind half of an approval layer and is pure string logic with no UI imports. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts:202-230]
3. OpenBot's `shared/standing-rule.ts` (MIT) exports `offersStandingRule`, the rule that decides when a one-off allowance may become a standing one. It is small and portable beside the classifier. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/standing-rule.ts:21]
4. OpenBot's `shared/activity-rows.ts` (MIT) and `app/src/lib/bot-lifecycle/activity-groups.ts` (MIT) are the activity vocabulary and the seven-group ordering, both written as pure functions away from the screen. They close the activity-view gap almost completely. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:1-30] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:1-45]
5. OpenBot's `app/src/lib/routines/plan.ts` (MIT) is the form-to-plan mapping: answers in, routine/goal/check-in out. It is the closest thing to an executable routine grammar and can be adapted for a `bots routine new` command. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:14-40]
6. Turnstone's `turnstone/core/memory.py` and `memory_index.py` (Apache-2.0) implement the typed, scoped structured memory described in its docs; Apache-2.0 permits reuse with the license and NOTICE and a statement of changes. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/memory.py:1-40] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/memory_index.py:1-30]
7. OpenMausBot's `src/state/team-chats.ts` (Apache-2.0) is a small per-team chat-ownership state with no enterprise dependency; the `enterprise/` carve-out covers a different folder. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/src/state/team-chats.ts:16-42] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md:3-10]
8. openhuman-tui is GPL-3.0-only at both the workspace and the crate, so its code cannot be copied into an MIT or Apache-licensed project without relicensing the combined work. It stays a design reference: transcript plus composer, overlays with single-key answers, slash commands. [SOURCE: specs/system-skilled-bots/context/openhuman-main/Cargo.toml:35] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/Cargo.toml:6]
9. Ranked lifts by gap closed: (1) `activity-groups.ts` plus `activity-rows.ts` (MIT) for the activity view; (2) `tool-name.ts` (MIT) for an approval classifier; (3) `plan.ts` (MIT) for routine authoring; (4) turnstone's memory model and code (Apache-2.0) for typed memory; (5) `team-chats.ts` (Apache-2.0) for multi-bot conversation ownership. Everything else in the reference set is reference-only. [INFERENCE: based on findings 1-8]
10. Attribution mechanics: MIT reuse needs the copyright and permission notice; Apache-2.0 reuse needs the license, any NOTICE file and a statement of changes. Both are satisfied by a `THIRD_PARTY_NOTICES.md` entry per lifted file with its source path and commit. [INFERENCE: standard license terms]

## Ruled Out
- Copying openhuman-tui code. GPL-3.0-only would force the combined work under GPL.
- Copying OpenBot's React approval cards. The logic is in `shared/`, the cards are presentation tied to the web app.
- Copying hermes-muse's kernel state machine. It is MIT but Python and coupled to a host plugin API; the state vocabulary is the reusable part, not the code.

## Dead Ends
- Looking for a NOTICE file in OpenBot: there is none, so MIT attribution is the only obligation.
- Looking for a permissive memory implementation in openhuman: GPL-3.0 rules it out for direct reuse.

## Edge Cases
- Ambiguous input: "code we can lift directly" could include design patterns. The ranking separates liftable files from reference-only designs.
- Contradictory evidence: none. Package metadata and LICENSE files agree in every repo checked.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/LICENSE
- specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts
- specs/system-skilled-bots/context/OpenBot-main/shared/standing-rule.ts
- specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts
- specs/system-skilled-bots/context/turnstone-main/turnstone/core/memory.py
- specs/system-skilled-bots/context/turnstone-main/turnstone/core/memory_index.py
- specs/system-skilled-bots/context/OpenMausBot-main/src/state/team-chats.ts
- specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md
- specs/system-skilled-bots/context/openhuman-main/Cargo.toml
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/Cargo.toml
- specs/system-skilled-bots/context/OpenGhost-main/LICENSE
- specs/system-skilled-bots/context/hermes-muse-main/LICENSE
- specs/system-skilled-bots/context/buzz-main/LICENSE
- specs/system-skilled-bots/context/rakazo-main/LICENSE

## Assessment
- New information ratio: 0.90
- Questions addressed: reuse with repo, path and license
- Questions answered: reuse ranking

## Reflection
- What worked and why: checking licenses first turned a vague "can we reuse this" into a short list. The MIT repos carry the highest-value small modules; the GPL repo carries the best design and no reusable code.
- What did not work and why: the Apache repos' best code is either large (buzz desktop) or database-bound (turnstone memory), so their value is conceptual plus one small file.
- What I would do differently: read `shared/bot-prompt.ts` as well, since the asking guidance is the text a bot needs when it must ask a person.

## Recommended Next Focus
Final synthesis: the eight-part gap table with the smallest change, size and risk for each part, followed by a ranked build order.
