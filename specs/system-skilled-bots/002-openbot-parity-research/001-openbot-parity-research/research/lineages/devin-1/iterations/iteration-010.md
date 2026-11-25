# Iteration 10: Approvals and activity against needs-you, run records and bots status

## Focus
Approvals and activity against our needs-you items, run records and bots status: a direct gap table with the smallest change for each of the two parts. This is the sixth of the nine additional questions, and it closes the fourth pair of the eight-part frame.

## Actions Taken
- Read OpenBot's gateway ordering for a tool call and its audit-row rules.
- Read the distinction OpenBot draws between activity and the audit trail.
- Read OpenBot's placement of Activity and its needs-you board components.
- Read skilled bots' delivery module and result ledger.
- Compared the two records part by part.

## Findings
1. OpenBot's audit trail is written before the action: every tool call returns through a gateway that resolves the target, decides it against the configured policy, writes an audit row, and only then acts — or refuses and names the rule. An action held for a person's approval writes its row when the person answers, and a forwarded action that fails writes a second row. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:7] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:41-52]
2. Every audit row records on whose authority an action was taken, and a routine or a goal asserts that authority. That is the field a small-team model needs and skilled bots does not yet write. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:105]
3. OpenBot distinguishes activity from the record: activity is read from the conversation's own tool results, keeps no copy of its own, and is a window; the audit trail is server-side, survives restarts, and is what an investigation reads. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:172]
4. OpenBot's Activity surface covers everything allowed, refused and failed, appears in Settings for one person and Admin for a team, and a single bot's activity opens from its page beside what it is working on. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:139-154]
5. OpenBot's needs-you surface is a board of rows plus a separate list of stalled hand-offs, which is a view over the same approval inbox rather than a second store. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/needs-you/board.tsx:1-40]
6. Skilled bots' delivery is at most once and separates run outcome from delivery outcome: a send is claimed before it is made, an uncertain result is recorded `unknown` and never retried, delivery starts only after the terminal run record is written, and a message carries the bot id, run id, outcome, evidence pointers, a kept worktree and a needs-you question — never a command line or an environment value, and a body holding a known secret is withheld. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:3-18]
7. Skilled bots' result ledger is one result event per run written through the append gateway, validated, authorized and idempotent, so a retry of a failed write is a replay of the same event rather than a second dispatch. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/result-ledger.ts:3-14]
8. Gap table, approvals: OpenBot gates actions against a policy engine with four answer kinds; skilled bots gates definitions before dispatch and parks human decisions as needs-you items. Skilled bots has no per-action gate and no allowance that survives a conversation. The smallest change is not a policy engine: it is a decision row on the run record for each parked question (item id, question, answer, actor, time), which makes the existing needs-you path auditable. [INFERENCE: based on findings 1-2 and 6-7]
9. Gap table, activity: OpenBot has one audit row per decision and a typed lifecycle view; skilled bots has a run record per run, delivery entries, a result event and a status index. The storage is comparable and in one respect stronger (the authorized, idempotent ledger); the gap is a read surface. The smallest change is one `bots activity` read over run records, delivery entries and result events, grouped with OpenBot's seven group ids. [INFERENCE: based on findings 3-7]
10. Verdict: skilled bots' record is already audit-grade for a single machine. Its two real gaps in this pair are the actor on a decision and a view over the record; neither needs a database, a server, or a new store. [INFERENCE: based on findings 1-9]

## Ruled Out
- Adding an OpenBot-style action policy engine. A bot's actions happen inside an executor whose sandbox and posture are already enforced; a second policy layer would duplicate the executor's own permission model.
- Adding a separate audit database. The run record, delivery entry and result event already form the trail; a second store would be the first place to drift.
- Copying the approvals board as a TUI screen. The board is a filtered list over the inbox; `bots inbox` already lists the same items.

## Dead Ends
- Looking for an audit row in skilled bots' run record: the run record has the outcome and evidence, but not a per-decision row.
- Looking for activity in the status index beyond rows and flags: the index is a summary, not an event log.

## Edge Cases
- Ambiguous input: "activity" could mean the lifecycle view (what is working, waiting, done) or the audit trail (what was allowed, refused, failed). Both were compared; OpenBot itself separates them and the recommendation keeps them separate.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/needs-you/board.tsx
- .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts
- .skilled/skills/system-skilled-bots/runtime/lib/result-ledger.ts
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts

## Assessment
- New information ratio: 0.85
- Questions addressed: approvals and activity against needs-you, run records and status
- Questions answered: approvals/activity gap table

## Reflection
- What worked and why: comparing record-by-record rather than feature-by-feature showed that the storage gap is small and the presentation gap is the real one. The audit-before-action ordering in OpenBot is the one design idea worth borrowing.
- What did not work and why: the needs-you board component is mostly layout; the useful fact was its relationship to the inbox, not its markup.
- What I would do differently: read `status.ts` row rendering alongside `status-index.ts` to see exactly which fields an activity view can show without a new write path.

## Recommended Next Focus
The skip list: enterprise, multi-tenant, Kubernetes, managed upgrades and mobile, each with the evidence that shows why a small team does not need it.
