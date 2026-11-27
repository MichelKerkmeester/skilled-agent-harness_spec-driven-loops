# Iteration 5: what OpenBot's shared modules hold that no phase covers

## Focus

Net-new sweep, second half of the topic. `OpenBot-main/shared/` holds twenty-odd framework-free modules, each written as "one declaration read from both sides" because a value written twice drifts. The parity synthesis's skip list covers enterprise roles, multi-tenant, Kubernetes, managed upgrades, mobile, PostgreSQL and the OAuth catalogue; none of these modules is on that list, and none maps onto a phase as it stands. This iteration ranks them by value to a small team and sizes each.

## Actions Taken

1. Listed every `shared/*.ts` module by line count and read the doc header of the nine largest that no phase cites (`learning.ts`, `security-floor.ts`, `what-if.ts`, `orchestration.ts`, `attachments.ts`, `recorder-masking.ts`, `audit-words.ts`, `tool-name-words.ts`, `connect-prompt.ts`).
2. Read `shared/activity-rows.ts`'s `oneRowPerAction` in full, because it is the one module in that tree that speaks directly to a planned phase (001-activity-and-actor).
3. Checked each candidate against the three earlier syntheses and against the 003 phase list so no item is a restatement; every one below is absent from all four.

## Findings

1. **001-activity-and-actor — a rule, not a module.** OpenBot's computer writes an action's row *before* it acts and a second row when the action fails, stops or is refused, both carrying the same `attempt` id; `oneRowPerAction` then drops the optimistic first row whenever its terminal row is loaded beside it, because "[d]rawn as they were, a read of a missing file was two rows, 'Allowed' and 'Did not happen', and the first is the one a reader believes". The plan avoids this by construction — a `working` row comes from a lease side file and disappears when the run ends, while `done` and `failed` come from the index — so the honest finding is that the reference's failure cannot occur here, and the rule worth writing into 001 is the reason: an optimistic row must never be the row a reader believes. Recorded as confirmation with the failure named, because a later phase that adds a "sent" or "started" row will meet it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:55-110] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:172] (observed, plan consequence inferred)

2. **Net-new, rank 1: a "what would happen if" explainer over the real deciders.** `shared/what-if.ts` defines one action shape used by both ends: the server reads a question into a `WhatIfAction` and "runs the real deciders on it in the order the product applies them", the admin page draws the action as chips and the answer as "one row per control". For this build that is the honest answer to a problem the plan creates for itself: 006's ladder names rungs 2 to 4 but implements only rung 1 and the `bot` fallback, so an operator cannot tell which rung would have asked. A `bots what-if` verb that runs 006's `classifyAction` and `decideApproval` over a proposed action — and rows the unimplemented rungs as "not implemented, would ask here" — answers the question without a policy store. Value to a small team: **high**, because it is the only way to see a rule set that is partly deferred, and it makes 007's `apps-unknown-server` and 008's `secret-unknown` refusals visible before a run rather than after one. Size **M**: one action shape, one row per rung, a text and a `--json` form. Licence MIT, so the shape is liftable. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/what-if.ts:1-8] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:161] (observed)

3. **Net-new, rank 2: a bot that hands real work into a thread and comes back with the result.** `shared/orchestration.ts` describes a Bot "as the person's point of contact: it answers the person in words, short asks itself, and hands real work into a task thread of its own, coming back to the conversation with the result", with the tool names, ids and result shapes declared once and read from both sides. The plan's 010-conversations is a `bots chat` verb over an append-only transcript with `@bot` routing, and 003's chat tab is a placeholder; neither has a notion of a *long* ask that leaves the conversation and returns to it, which is exactly what a routine-driven bot produces. Value: **high**, because without it a routine's output arrives as an unrelated notice while the chat stays silent about the work it started. Size **L**: a thread record, a run-to-thread link, a return-to-conversation write, and the pane that draws it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:1-8] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:33] (observed)

4. **Net-new, rank 3: attachment limits declared once for both ends.** `shared/attachments.ts` exists because "the composer refuses a file before uploading it and the server refuses it again on arrival, and those two refusals have to agree. A limit written twice is a limit that drifts, and the drift shows up as a file the composer accepted and the server threw away with no explanation." No phase carries attachments at all: a person who wants a bot to look at a screenshot has to put it in the repository. Value: **medium**, because attachments are the first thing a small team asks for and the last thing the plan should grow ad hoc. Size **M**: one limits table, one refusal pair, and a run-folder path for the file. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/attachments.ts:1-8] (observed)

5. **Net-new, rank 4: the refusal a person can act on when an app is not connected.** `shared/connect-prompt.ts` is "the refusal a person can act on: an app this call needed, that they have not connected — or whose account the vendor has lost, or whose team account nobody has connected — and the answer of the one tool that says what an app is for them without a call having been refused at all", declared once because "a tool that runs on the server reaches the transcript as text meant for a model, so a renderer can only tell this refusal from the others by its wording". The plan's 007 refuses `apps-unknown-server` at parse time and `apps-refused` at dispatch, and 008 refuses `secret-unknown`; none of the three tells the person *what to do next*, and all three reach them as a machine reason. Value: **medium-high**, because it is the difference between a refusal an operator fixes in a minute and one they file. Size **S**: one sentence per refusal plus the app it names. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/connect-prompt.ts:1-10] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:164-175] (observed)

6. **Net-new, rank 5: one wording rule for every surface that names a tool.** `shared/audit-words.ts` and `tool-name-words.ts` derive the What column from the stored name, with two rules worth stating: every phrase is "what was asked for, not what came of it ('Save a file', not 'Saved a file')", and one rule set serves "an app's page, Activity, a conversation's step and an approval", so `GMAIL_SETTINGS_GET_IMAP` reads "Get IMAP settings" everywhere. The plan's activity rows and needs-you questions carry the raw question text and the run's own outcome words; nothing fixes how a tool name is said. Value: **medium**, because a screen read aloud or skimmed is only as good as its labels, and this is the cheapest polish in the corpus. Size **S**: one pure function and a table of verbs. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/audit-words.ts:1-10] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/tool-name-words.ts:1-9] (observed)

7. **Net-new, rank 6 (cautionary): client-side-only redaction, with the size of the mistake on show.** `shared/recorder-masking.ts` is 1,540 lines with a 1,669-line test file, and its header states the design plainly: masking is "applied in the browser before anything leaves it. Intelligence does no server-side redaction, so these functions are the only defence for what reaches it." Its marker is `[redacted]`, chosen to agree with the collector's own. For this build the finding is the opposite of a lift: 008 already does server-side scanning of stdout, the run folder and the receipt folder, and the reference shows what happens when the only defence lives at one end — 3,209 lines of masking plus a test suite twice the size of the module, because every browser surface needs its own copy. Value: **high as a warning, zero as a feature**. Size **0**; the point is to keep the defence on the side that owns the data. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/recorder-masking.ts:1-6] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:168] (observed)

## Ruled Out

- **Ranking `security-floor.ts` (351 lines) as a net-new item.** A signed `security-floor.json` published beside the update feed, which raises a minimum safe app version and shows one notice below it, is real engineering for a product that ships signed desktop installers. This build ships a repository and a CLI, where `git pull` is the update path, so the value to a small team is near zero. Not ranked.
- **Ranking `learning.ts` (335 lines) as a net-new item.** Its per-agent learning targets and its "who reviews what a person's own Learning space proposes" default-to-admins rule is the same question 009's proposal review and 011's roster already answer with `operators.json`; adding a second review-routing mechanism would duplicate the roster.
- **Treating `what-if.ts` as a 006 requirement.** It is not: 006 is a build packet for the grant record and the ladder's first rung, and a what-if verb is a read over deciders that must exist first. It is a net-new candidate for a later packet, and finding 2 says so.

## Dead Ends

- `grep` for `actor|onBehalfOf|actedBy|requestedBy` in `app/src/lib/bot-lifecycle/queries.ts` produced one unrelated comment line, so no claim about how OpenBot attributes a scheduled action to a person is made. The parity synthesis's open question 1 (who is the actor for a scheduled run) therefore remains open on the reference side, and this iteration adds nothing to it.
- The nine headers were read, not the bodies. Each finding's size is an estimate from the module's line count and its stated contract, and is marked as a size, not a measurement.

## Edge Cases

- **Contradictory evidence:** none.
- **Ambiguous input:** "ranked by its value to a small team and give its size" leaves both scales open. The selected scales are three levels (high, medium, low) and T-shirt sizes, with the reason for each rank stated in its finding so a reader can disagree with the rank without re-reading the module.
- **Missing dependency:** none.
- **Partial success:** finding 1 is a confirmation rather than new capability, and finding 7 is a cautionary item with no build. Both are recorded because a ranking with only positives would hide the one item worth *not* doing.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:55-110
- specs/system-skilled-bots/context/OpenBot-main/shared/what-if.ts:1-8
- specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:1-8
- specs/system-skilled-bots/context/OpenBot-main/shared/attachments.ts:1-8
- specs/system-skilled-bots/context/OpenBot-main/shared/connect-prompt.ts:1-10
- specs/system-skilled-bots/context/OpenBot-main/shared/audit-words.ts:1-10
- specs/system-skilled-bots/context/OpenBot-main/shared/tool-name-words.ts:1-9
- specs/system-skilled-bots/context/OpenBot-main/shared/recorder-masking.ts:1-6
- specs/system-skilled-bots/context/OpenBot-main/shared/learning.ts:1-8
- specs/system-skilled-bots/context/OpenBot-main/shared/security-floor.ts:1-8
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:172
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:161
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:164-175
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:168
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:33

## Assessment

- New information ratio: 0.90
- Questions addressed: net-new candidates from `OpenBot-main/shared/`, plus one confirming rule for 001
- Questions answered: none tracked; carried by findings

## Reflection

- **What worked and why:** sorting the tree by line count and reading only the doc headers. The headers in this repo are written as *design rationale* — "one declaration, read from both sides", "the first is the one a reader believes" — so nine files gave nine ranked candidates in two calls, and the biggest file in the tree (a 1,540-line recorder masker) turned out to be the most instructive item precisely because it is the one not to build.
- **What did not work and why:** looking for an actor field in OpenBot's activity queries to close the parity synthesis's open question 1. The queries module names the response shapes, not the SQL, so a grep for `actor` found a comment about pings; the answer would need the server schema, which is out of this iteration's scope.
- **What I would do differently:** read the `shared/` tree in iteration 1. It is the densest concentration of transferable design in the corpus, MIT-licensed, and every module in it is written to be read by two ends at once, which is exactly the property a small team's runtime needs.

## Recommended Next Focus

010-conversations with openhuman's in-process chat surface and turnstone's `cli.py` loop, then 003's residual interaction surface (keys, mouse, themes, `NO_COLOR`), then 012/013/014 with the reference test corpora (`openhuman-full/e2e`, `openhuman-full/tests`, `tinychannels`' conformance fixtures, turnstone's parity fixtures) and the remaining vendored crates as a second net-new sweep.
