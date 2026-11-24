# Iteration 4: Frontier F-2-007 — conversation persistence, multi-bot fan-out and the smallest activity record

## Focus
Frontier node F-2-007 (depth 2, scope OpenBot-main/app/src/lib/groups, OpenBot-main/app/src/lib/bot-lifecycle, .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts): How are conversations persisted and fanned out so several bots can share one thread, and what is the smallest activity record that can be shown after the fact?

## Actions Taken
- Read OpenBot's group-conversation client model and its message shape.
- Read the group-chat header comment again for the fan-out contract.
- Read OpenBot's activity grouping module and its group ids.
- Read skilled bots' run-record types, request record and request queue.
- Confirmed OpenBot's license for reuse.

## Findings
1. OpenBot persists a group conversation as a channel with members and messages read through the conversations API: `listConversationMembers`, `listConversationMessages` and `sendConversationMessage`, with the transcript capped at the newest 200 lines. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts:10-31] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts:136-139]
2. A group message carries more than text: `personId` or `botId` as its author, a status, `answeredBy`, a `consent` record naming bot and server, and optional attachments. That is enough to draw an attributed multi-bot thread and to show which bot answered a question a person was asked. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts:53-72] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts:102-104]
3. Fan-out is per-bot threads on the server, not one agent with many voices: each addressed bot runs the ordinary headless AG-UI path and the shared transcript is the assembly of their answers, with `@Name` addressing one bot and no address meaning every bot in turn. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/channels/group-chat.tsx:42-48]
4. OpenBot's activity grouping is a pure function over two reads: the bot's activity (routines, goals, hand-offs, follow-ups, questions) and the person's tasks. Each entry lands in exactly one group, in this order: needs_you, working, scheduled, done, stopped, failed, recurring; an empty group is omitted. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:6-45]
5. Skilled bots already persists most of what an activity record needs. A run record holds the request join (request id, lease nonce, result event id, fired slot, resumed item), a dispatch snapshot (source, scheduled time, dispatch time, lateness, skipped and held slots), the budget (declared and measured), the exit (reason, failure class, needs-you item), evidence locations (run folder, ledger, receipts, worktree) and delivery entries. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:70-190]
6. Every request producer writes the same record shape, so one drain reads one shape and dedupe works the same way for all of them. The idempotency key comes from the event source and that source's event id (or a caller key), never from a hash of the body, and the request id is derived from the bot and the key so a re-sent event names the request already queued. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:3-18]
7. The queue is a file queue under the user-level state root, keyed by repository identity, where every state change is one rename between sibling folders so two consumers can never claim the same request. A seen-key marker turns a re-sent event into a duplicate, a crash after the marker loses the event rather than running it twice, and a request is quarantined after three attempts. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:3-25]
8. Gap: skilled bots has no transcript store. A conversation today is a chain of runs (request, run record, delivery), not a message log; the smallest change is a conversation id on the request plus one message row per human message, bot delivery and answer, written by the same atomic state writer the queue already uses. [INFERENCE: based on findings 5-7]
9. Gap: no grouping view. The status index has per-bot row states but no needs_you/working/scheduled/done/stopped/failed/recurring grouping; the smallest change is a projection over run records and needs-you items that reuses OpenBot's seven group ids and its pure grouping rule. [INFERENCE: based on findings 4-5]
10. Reuse: OpenBot is MIT-licensed, and `activity-groups.ts` is a small pure module whose only imports are types and two helpers, so its grouping rule can be lifted with attribution rather than re-derived. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-3] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/package.json:4]

## Ruled Out
- Building a server-side group transcript with per-bot threads, as OpenBot does. Skilled bots runs one bot per dispatch in a worktree; the file-chain model already preserves attribution without a message server.
- Reusing OpenBot's channel/member tables directly. They assume a multi-tenant organization and a database, neither of which this team needs.
- Treating the run record as an activity log. It is one record per run; a conversation needs several messages per run.

## Dead Ends
- Looking for a message table in skilled bots' runtime: there is none. Delivery entries record where a result went, not what was said.
- Looking for an activity view in the status index: it stores rows and flags, not a lifecycle grouping.

## Edge Cases
- Ambiguous input: "activity record" could mean the audit trail (what was allowed or refused) or the lifecycle view (what is working, waiting, done). This iteration covers the lifecycle view; the audit trail is already covered by run records and delivery entries.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/channels/group-chat.tsx
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/queries.ts
- specs/system-skilled-bots/context/OpenBot-main/LICENSE
- specs/system-skilled-bots/context/OpenBot-main/package.json
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts
- .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts
- .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts

## Assessment
- New information ratio: 0.89
- Questions addressed: F-2-007 (conversation persistence, multi-bot fan-out, activity record)
- Questions answered: F-2-007

## Reflection
- What worked and why: comparing the message shape with the run-record shape made the missing piece obvious. OpenBot stores messages; skilled bots stores runs. Both are complete records of a different unit, and the gap is a unit, not a field.
- What did not work and why: searching for a groups directory returned nothing because `groups.ts` is a single file; the import path was the reliable clue.
- What I would do differently: read `result-ledger.ts` and `delivery.ts` together with `run-record.ts`, since the message row would be written at the same points those files already handle.

## Recommended Next Focus
Frontier node F-2-008 (depth 2): the smallest sign-in and role model for a few people sharing one machine or host, and which parts of OpenBot's role split and turnstone's RBAC can be dropped.
