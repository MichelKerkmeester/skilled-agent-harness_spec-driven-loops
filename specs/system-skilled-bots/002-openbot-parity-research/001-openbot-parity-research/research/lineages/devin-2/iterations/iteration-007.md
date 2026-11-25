# Iteration 7: Approvals and activity against needs-you items, run records and bots status

## Focus

Approvals and activity: how OpenBot's approval rules and activity record compare with skilled bots' needs-you items, run records and `bots status`, and what the smallest terminal approvals inbox and activity feed would be.

## Actions Taken

1. Read OpenBot's approvals document for the decision order, answer card and action recognition.
2. Re-read the approvals/activity summary in the eight-part overview.
3. Read the skilled-bots definition-approval module.
4. Read the needs-you item store and the answer path.
5. Read the status index snapshot and the `bots status`/`bots inbox`/`bots answer` verbs.

## Findings

1. OpenBot decides approval in a fixed order: action kinds first (delete, send, share, post, pay, credentials), then matching rules, then auto-review, then Extra vigilant, with the strictest matching rule winning. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-18]
2. OpenBot's card offers four answers: allow once, allow for this conversation, always allow here (saved as a rule), and deny; every answered action still lands on the audit trail. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:20-31]
3. OpenBot recognizes an action by its name, tool name or button label, and treats an app-declared destructive hint from an MCP server, Composio or Arcade as a delete. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:60-84]
4. OpenBot defines approvals as the check before an action and activity as the record after it: what was read, changed, sent, refused and approved. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:86-96]
5. Skilled bots' existing "approval" is authoring integrity, not action approval: it hashes BOT.md and `bots/config.json` and refuses an unattended run whose bytes differ from what an operator approved at install, enable or manual run. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:1-14]
6. Needs-you items are the action-approval analogue for parked runs: a run that needs a human ends, leaves one durable item whose open/answered/expired state is derived from its fields, `bots inbox` lists items and `bots answer` records the answer and enqueues the resume. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-10] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:135-212] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:1-14] [SOURCE: .skilled/bin/bots.cjs:31] [SOURCE: .skilled/bin/bots.cjs:46]
7. The status index already stores one row per run, delivery and item, and `bots status` shows each installed bot's last run and delivery plus open needs-you items, but there is no chronological activity view over those rows. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:1-14] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:126-133] [SOURCE: .skilled/bin/bots.cjs:48]
8. The smallest terminal approvals inbox is `bots inbox --json` plus the existing answer path, and the smallest activity feed is a `bots activity` verb over the status index's run rows with bot and outcome filters; neither needs a new store. Per-action policy (send, delete, pay) needs a hook inside the executor and is a later packet, with OpenGhost's MIT hook-compatible rules engine as the liftable layer. [INFERENCE: based on findings 1-7] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:1-10]

## Ruled Out

- Reusing the definition-approval hash as an action-approval policy: it proves which bytes may run, not which actions a run may take.
- Adding a new approvals database: needs-you items already model the parked-run question and answer, and the status index already indexes them.
- Copying OpenBot's action-recognition table wholesale: it is tuned to browser and app tool names, and skilled bots' executor exposes a different tool surface.

## Dead Ends

- Searching skilled bots for a per-action approval policy found only the definition-approval module and the executor sandbox, which operate at different layers.
- Treating `bots status` as an activity feed would lose chronology; it is a snapshot of last run and delivery, not a list of events.

## Edge Cases

- Ambiguous input: none. The approvals/activity pairing is named in the topic.
- Contradictory evidence: none. The OpenBot prose and skilled-bots modules describe different approval layers without conflicting.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-31
- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:60-84
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:86-96
- .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:1-14
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-10
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:135-212
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:1-14
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:1-14
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:126-133
- .skilled/bin/bots.cjs:31
- .skilled/bin/bots.cjs:46
- .skilled/bin/bots.cjs:48
- specs/system-skilled-bots/context/OpenGhost-main/rules.js:1-10

## Assessment

- New information ratio: 0.9
- Questions addressed: approvals and activity (topic question 6)
- Questions answered: none tracked as a frontier question; this iteration broadens beyond the dealt frontier

## Reflection

- What worked and why: Reading the needs-you store and the status index before the OpenBot approval doc made the layering clear: storage and resume already exist, and the gap is presentation plus per-action policy.
- What did not work and why: Searching for an action-approval policy found only authoring approval, which shares the word but not the layer.
- What I would do differently: Read the status index schema before `bots status`, so the activity feed's data source is established before the verb is assessed.

## Recommended Next Focus

Conversations: how a terminal chat with a bot and its memory could reuse the bots CLI, run records and needs-you resume path, and which repos ship a terminal UI or conversation shell worth copying (turnstone, openhuman, buzz, OpenGhost). Then memory and skills.
