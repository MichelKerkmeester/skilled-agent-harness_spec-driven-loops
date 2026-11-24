# Iteration 6: Mapping a memory review onto a needs-you item

## Focus
Frontier node F-2-004 (depth 2, scope .skilled/skills/system-skilled-bots/, OpenBot-main/api/openapi/memory.yaml): How does an OpenBot memory reviewState (unreviewed, confirmed, edited) map onto a skilled-bots needs-you item?

## Actions Taken
1. Read `feature-catalog/operator-loop/needs-you-items.md` for the item lifecycle and the hold rule.
2. Read `feature-catalog/operator-loop/needs-you-answer.md` for the answer and resume path.
3. Read the `NeedsYouItem` interface and the derived-state type in `runtime/lib/needs-you.ts`.
4. Compared the item shape against OpenBot's `Memory.reviewState` and the proposal evidence field.

## Findings
1. A needs-you item is written by the runner, not by the model: the prompt tells the child to print a `[NEEDS-DECISION] ` line with its question and optional `[OPTION] ` lines, and the runner writes one item and ends the run as `awaiting-decision` with exit 5. [SOURCE: .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md:24]
2. The item shape is `{id, runId, botId, identity, question, options, createdAt, expiresAt, evidence, prompt, specFolder, answer, resumeRequestId}`, and `id` is documented as "The parked run's id, so one run writes at most one item." [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29]
3. Item state is `open | answered | expired` and is "derived from its fields every time it is read and never stored, so it can never disagree with them." [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:49]
4. An open item holds every later run of its bot, refused before dispatch, and the hold lifts once the item is answered or expires. [SOURCE: .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md:28]
5. An item expires after the repository's needs-you expiry, seven days by default, and an expired item is listed as expired without being rewritten. [SOURCE: .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md:26]
6. `bots answer <item-id> <text>` checks the answer for secret literals first, because it reaches the resumed run's prompt, then writes it on the item and enqueues one `resume` request keyed by the item id. [SOURCE: .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md:22]
7. The resumed run's prompt is the parked run's own prompt, then the question, any offered options and the answer, with an instruction to continue from where that run stopped; it binds the same spec folder and reopens the kept worktree. [SOURCE: .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md:26]
8. The item already carries `evidence: string[]`, which is the same field OpenBot's proposal review needs: "the conversations and recordings it was learned from". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:41]
9. The mapping is partial, not direct: a memory review is not run-scoped, but a needs-you item's `id` is the parked run's id and an open item holds the bot. Reusing the item unchanged would hold a bot on every unreviewed fact, which is the opposite of what a memory gate should do. [INFERENCE: based on .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29 and .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md:28]
10. The smallest correct mapping is a review item with the same file shape and the same derived state but no hold and no resume: `id` becomes the memory fact id, `prompt` / `specFolder` / `resumeRequestId` drop out, and `answer` becomes `confirmed | rejected`. That keeps one operator surface (`bots inbox`) and one answer verb. [INFERENCE: based on findings 2, 3 and 9]
11. OpenBot's three-value `reviewState` collapses to two here: `unreviewed` is the item's open state and `confirmed` is the answered state. `edited` is not a third state — it is what the answer text carries when the person rewrites the fact before confirming. [INFERENCE: based on specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:557 and .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md:22]

## Ruled Out
- Reusing `NeedsYouItem` verbatim for memory review. Its `id` is the run id and its open state holds the bot, so a single unreviewed fact would stop every later run of that bot.
- Adding a third `edited` review state. The answer text already carries the rewrite, so a third state would need its own transition rules for no recall benefit.
- A separate review UI. `bots inbox` already lists open items and `bots answer` already resolves them; a second surface would be the "two pages answering the same question" that OpenBot's own rules forbid.

## Dead Ends
- Looking for a non-holding item class in `needs-you.ts`. There is none: `holdForBot` returns a hold for any open item of the bot, so a non-holding review item is a new shape rather than a configuration of the existing one.

## Edge Cases
- Ambiguous input: none. The node names the mapping directly.
- Contradictory evidence: none.
- Missing dependencies: none. The needs-you surface is fully present in this checkout.
- Partial success: none.

## Sources Consulted
- .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md:1-60
- .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md:1-50
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-60
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:244-297
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:557-572

## Assessment
- New information ratio: 0.91
- Questions addressed: How does an OpenBot memory reviewState (unreviewed, confirmed, edited) map onto a skilled-bots needs-you item?
- Questions answered: How does an OpenBot memory reviewState (unreviewed, confirmed, edited) map onto a skilled-bots needs-you item?

## Reflection
- What worked and why: reading the `NeedsYouItem` interface rather than only the feature page. The interface shows `id` is the run id, which is the single fact that turns "reuse the item" into "reuse the item's shape"; the prose page alone would have made the reuse look free.
- What did not work and why: looking for a non-holding item class. `holdForBot` holds on any open item, so the hold is structural, not a flag.
- What I would do differently: read `holdForBot` before the feature page. The hold rule is the constraint that decides the design, and it is four lines of code.

## Recommended Next Focus
The smallest on-disk memory store for a few people on one machine: one JSONL per person plus a per-bot overlay, and where it should live relative to the user-level state root the needs-you items already use.
