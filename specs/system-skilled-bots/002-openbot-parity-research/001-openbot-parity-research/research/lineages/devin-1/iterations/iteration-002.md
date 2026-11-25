# Iteration 2: Frontier F-1-005 — approvals and the smallest small-team model

## Focus
Frontier node F-1-005 (depth 1, scope OpenBot-main/docs/approvals.md, OpenBot-main/docs/coworkers.md, OpenBot-main/docs/personal-edition.md, .skilled/skills/system-skilled-bots/runtime/lib): How do approvals work in OpenBot and the other repos, and what is the smallest small-team model of who can talk to, approve for and change a bot, compared with skilled bots' needs-you items and run records?

## Actions Taken
- Read OpenBot's approvals policy, answer types and admin controls.
- Read OpenBot's Bot ownership, visibility and team publication model.
- Read OpenBot's personal-edition boundary and its single-user auth fallback.
- Read OpenBot's role vocabulary and the server-side auth rules.
- Read skilled bots' definition approval, needs-you items, answer path and run record modules.
- Read turnstone's RBAC and tool-policy model as the enterprise-shaped comparison.

## Findings
1. OpenBot decides whether to ask with an ordered policy, first match wins: (1) kinds of action — deleting, sending, sharing, posting, paying, changing a password or account settings — ask in every edition by default; (2) rules, where the strictest matching rule wins, so a team rule that asks beats a personal allowance; (3) auto-review when turned on; (4) Extra vigilant, a personal switch that is off unless enabled. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-14]
2. An approval card offers four answers: Allow once, Allow for this conversation (same bot, same tool, same place, same account; it does not reach another conversation, bot or tool), Always allow here (saved as a personal rule), and Deny. An allow reaches only the kind of action it was given on: allowing an ordinary click never opens that site's Send or Place order button. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:21-31]
3. The team edition adds an administrator control per action kind with three settings: Members choose (the default four answers), Ask every time (Allow once and Deny only, and prior allowances for that kind stop applying), and Members do it themselves (the bot never performs it; the person gets "I did it myself" and "Don't do it"). [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:56-67]
4. OpenBot's role vocabulary is exactly three: owner, admin and member. A single function decides administration (`role === "admin" || role === "owner"`), an unknown role is read as member, and the server enforces auth and roles independently of the app. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/auth/roles.ts:1-26] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:418]
5. The personal edition is the smallest possible identity model: one person on their own machine, nobody signs in, one computer, and a single Personal Assistant bot. With no identity provider the server refuses to start unless `OPENBOT_SINGLE_USER=true` declares every request the one fixed administrator, and it still refuses a public address. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:3-8] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:427]
6. Bot ownership and visibility are separate from conversation membership. A person-made bot is owned by that person and package bots are ownerless; visibility is `private` (owner and administrators) or `public` (everyone in the deployment); publishing a Team Bot to people or groups is a separate, revocable record that does not change the bot's own visibility. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md:17-21] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md:53-58]
7. Skilled bots' approval is definition-level, not action-level. An unattended run — a scheduled fire, a queued request, a resume — runs only the exact bytes an operator approved: a hash of `BOT.md` and the repository's `bots/config.json`, kept under the user-level state root where no run can write it, and written only when an operator installs a schedule, enables a bot, or runs a bot by hand. A manual run is never refused for drift, because typing it is the approval. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:3-16]
8. Skilled bots' needs-you item is the human-decision primitive: an unattended run that needs a decision ends instead of waiting and leaves one item under the user-level state root so a run can neither forge nor clear it. Its state (open, answered, expired) is derived from its fields on every read and never stored, so it cannot disagree with them. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:3-12]
9. `bots answer` is the continuation path: it records the operator's answer on the item, enqueues one `resume` request keyed by the item id, then advances the generation stamp. The answer is written before the enqueue so the resumed run is not refused, a duplicate answer stores one request, and the text is checked for secret literals before storage because it reaches the resumed prompt. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:3-17]
10. Skilled bots' run record is the join every later surface reads: the queue links a request to its run through it, delivery appends to it, and the status index is built from it. It lives under the user-level state root, and `awaiting-decision` is a terminal exit for a run that parked a question. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:3-12]
11. Turnstone is the enterprise-shaped version of the same idea: RBAC with admin, operator and viewer roles, plus admin-defined tool policies with `allow`, `deny` and `ask` actions and first-match priority. It is more machinery than a few people need, but the three-word policy vocabulary is the cleanest statement of what an approval layer does. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/governance.md:9-30] [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/governance.md:40-52]
12. Smallest small-team model: skilled bots needs no sign-in system and no owner/admin/member split. It needs one operator identity that is recorded on the acts that already exist — the needs-you answer, the definition approval, the run record — plus one visibility rule per bot (who may run it) and one shared-vs-personal memory scope. OpenBot's owner/admin/member and turnstone's RBAC are both more than a few people on one machine or a shared host require; the part worth copying is the ordered policy (kinds, then rules, then a personal strictness switch), not the role tree. [INFERENCE: based on findings 1-11]

## Ruled Out
- Copying OpenBot's owner/admin/member roles into skilled bots. With no sign-in and no tenant, the roles have nothing to distinguish; the same protection comes from recording who approved what.
- Copying turnstone's full RBAC and permission-string model. It exists to let an administrator delegate across many users and endpoints, a problem a small team does not have.
- Treating `bots answer` as an approval system. It continues a parked run; it does not gate an action before it happens.

## Dead Ends
- Looking for an action-level approval hook in skilled bots' runner. The runtime's only pre-execution gate is the definition hash; there is no per-tool policy layer to extend.
- Using OpenBot's admin "Members do it themselves" setting as a template for a role system. It is a per-action-kind switch, not a role.

## Edge Cases
- Ambiguous input: "who can approve for a bot" could mean human-to-human delegation or bot-to-human approval. Both readings were kept: findings 4-6 cover delegation, findings 1-3 and 7-10 cover the bot's ask.
- Contradictory evidence: none. OpenBot's docs and the app's role helper agree on the three-role vocabulary.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md
- specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md
- specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/auth/roles.ts
- specs/system-skilled-bots/context/turnstone-main/docs/governance.md
- .skilled/skills/system-skilled-bots/runtime/lib/approval.ts
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts

## Assessment
- New information ratio: 0.95
- Questions addressed: F-1-005 (approvals, small-team roles, needs-you and run records)
- Questions answered: F-1-005

## Reflection
- What worked and why: reading the approval module's header comment first gave the design rationale (why definition-level, why outside the run's reach) in three sentences, and the docs then supplied the action-level comparison. Pairing each OpenBot concept with the skilled-bots primitive that already exists kept the gap analysis concrete.
- What did not work and why: grepping for "approval" across OpenMausBot and buzz returned mostly unrelated UI state files; their approval implementations are not named that way. A per-repo README pass would locate them faster than keyword search.
- What I would do differently: read `identity.ts` and `status-index.ts` in the same pass, since the operator identity and the status surface are where the small-team model will actually land.

## Recommended Next Focus
Frontier node F-2-006 (depth 2): how a terminal or TUI presents a conversation with a bot together with its approvals, activity and routine list, and which repo's terminal frontend is worth copying.
