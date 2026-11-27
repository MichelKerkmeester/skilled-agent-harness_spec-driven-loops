# Final recommendations for the OpenBot parity build

Written 2026-11-27 from four inputs: the reference-evidence synthesis, the list first given to you and two independent reviews of that list against the overengineering rule. Nothing in the repository was changed.

## The core need

You want to answer two questions from a terminal: what did my bots do and what needs me. The build gives skilled bots that view, plus a few small records, with none of OpenBot's server, database, container stack or desktop shell. The build is dispatched to workers on cheap models, so the plan must be deep enough that a worker never has to make a design decision. This build keeps one operator's state root and reaches the team through linked chats. So every item below is judged by one test: does a small terminal-first team hit this failure, and is this the smallest fix.

## How to read this

- **solid** means the cited lines state the claim. **likely** means part of it is inferred. Section 6 says how far "solid" goes.
- "Needs your yes" marks an item that changes something the plan decided on purpose.
- Where the two reviews disagreed, the item says so and gives the reason for the call in one sentence.
- Path prefixes: `B/` is `specs/system-skilled-bots/003-openbot-parity-build/`. `L/` is `.skilled/skills/system-skilled-bots/runtime/lib/`. `R4/` is `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/`.

What this set costs: one new refusal name, no new BOT.md key, seven tests or fixtures and no change in a module another skill owns. The list as first given would have added about four refusal names, three keys and twelve tests.

## 1. Fix in the build plan before building

### 002 routine layer

1. **Make the fatigue switch work for a bot with a precheck. Likely. Needs your yes.** Today the count of failures in a row stops at the first record that is not a failed run (`B/002-routine-layer/spec.md:173`, `B/002-routine-layer/design/state-machines.md:68`). A precheck skip is such a record (`L/runner.ts:139`). So a bot that skips quiet slots and fails whenever it has work never reaches ten and never switches off. Change `failureStreak` to skip a refusal with no failure class and keep counting. Update REQ-006 and AC-006 (`B/002-routine-layer/acceptance-criteria.md:61`), and add one fixture: failed, `precheck-silent`, failed counts two. The reviews split here. One called the fixture a duplicate of AC-006, which is true, but the rule AC-006 pins is the problem. The effect is reasoned from the lines and was not run.
2. **Tell a scheduled run that it is a firing. Likely.** OpenBot saw a routine read its own instruction as "set up a schedule", do nothing and record success. For a run started by a schedule, add one fixed sentence to the non-interactive preamble (the research places it at `L/dispatch.ts:322`): "This run was started by its schedule. Do the work now. Do not create or change a schedule." Write it in our own words, so no notice entry is needed (OpenBot's text is MIT). A resumed run re-sends the parked prompt as it was, so nothing is added twice. The reviews split between adding it now and waiting for a failure. I add it now because the failure is silent and no prompt golden exists yet to update.
3. **Say what happens when a schedule fires while the bot is busy. Solid.** Add one sentence to REQ-005 (`B/002-routine-layer/spec.md:172`): a fire behind a held lease is refused `lease-held` and never caught up, the same as a missed slot. The runtime already does this (`L/runner.ts:136`). No new test.

### 003 terminal screen

4. **Turn on bracketed paste, so pasted text can never act as keys. Solid.** Without it a pasted `y` approves the open item (`B/003-terminal-screen/005-answer-flow/design/state-machines.md:41`) and a pasted newline on the inbox tab opens the selected row (`B/003-terminal-screen/001-ux-and-component-map/design/key-map.md:52`). The event source has no paste event today (`B/003-terminal-screen/002-architecture-and-contracts/plan.md:70`). The terminal guard enables bracketed paste and disables it on restore. The event source yields a paste as one event. The reducer adds a paste to the text buffer only while typing and ignores it everywhere else. A paste never sends. One test feeds `Paste("y\n")` in the overlay's shortcut mode and on the inbox tab and asserts that no answer was sent. The reference is GPL, so mirror the design and copy no code.
5. **End a cut string with an ellipsis. Likely.** A clipped question draws as if it were complete (`B/003-terminal-screen/004-panes/spec.md:228`). `clip` ends a cut string with `…` inside the width, or `...` under the `--ascii` flag that already exists. Write it fresh.
6. **One clip test with a wide character. Likely.** Put an emoji and a combining mark at the clip column of an inbox question in `tests/panes.rs`. Assert no panic and that the cut never splits a double-width cell. Emoji in bot text is the case this team will meet.

### 005 memory

7. **Forget by id, not by position. Solid on the failure, likely on the design.** Today every later index shifts down after a forget (`B/005-memory/spec.md:152`, `B/contracts/records.md:266`). An operator who lists once, forgets entry 3 and then forgets entry 5 removes the wrong fact with no warning. `--list` prints a short id for each entry, the first 8 hex characters of the SHA-256 of its line, and `--forget <id>` takes it. The stored line keeps its five fields and nothing new is stored. REQ-004's JSON entry gains the id. REQ-005 and the `memory-entry-unknown` text take an id. Two identical lines share an id and either may go. Both reviews reached this form independently. It replaces the stored sixth field the first list proposed.
8. **`memory-full` names its repair. Likely.** The refusal prints the path and the counts and no way out (`B/005-memory/design/mockups.md:280`). Add `bots remember --forget <id>` to its text.

### 006 approval grants

9. **After a deny, tell the bot that no means no. Solid.** Today the resumed prompt says "Granted scope: deny" and then "Continue the work" (`B/006-approval-grants/design/mockups.md:173-174`). When the scope is `deny`, the prompt names the refused action, says the person declined, says not to reach the same result another way and says to report that it was not done. Add one golden beside `resumed-prompt.txt`. Our own words, so no notice (the OpenBot sentence is MIT).
10. **Stop promising the next packet a key that is too wide. Solid.** Two lines commit the future rules store to "a scope bound to bot plus kind" (`B/006-approval-grants/spec.md:205`, `B/006-approval-grants/spec.md:271`). One allow on one delete would then open every delete that bot makes. Replace the phrase with: "a scope the next packet defines. Bot plus kind is too wide." Do not design the replacement key now.

### 008 vault

11. **Scan two more forms of a secret. Solid for hex, likely for base64.** The vault stores each value as lowercase hex in the keychain (`B/008-vault/design/backends.md:41`), yet hex is listed as a form the scan accepts missing (`B/008-vault/design/leak-checks.md:108`). Add the lowercase hex form to the scan at `B/008-vault/design/leak-checks.md:73` and remove hex from the residual row. Also scan standard base64 without padding in place of the padded form. The unpadded text is the start of the padded text, so one entry catches both at no cost. The reviews split between hex only and five forms. I take hex plus the free base64 swap, because no line names how the other three forms would appear here. The source is GPL, so copy no code.
12. **Never put another program's output into an error. Solid.** `secret-store-unreadable` prints a free `<detail>` (`B/contracts/refusals.md:160`), and the plan measured that the keychain tool can echo pieces of a value. Fix one detail phrase per cause in the outcome map, and add one sentence to the refusal contract: a detail is never captured program output.
13. **`secret-unknown` names the secret and the command. Likely.** Today it prints `refused before dispatch (secret-unknown)` and nothing else (`B/008-vault/acceptance-criteria.md:65`). Add the secret's name and `bots secret set <name>`.
14. **Remove the lifted placeholder guard. Solid on the facts. Needs your yes.** The plan lifts rakazo's `secrets-guard.ts` with a refusal name, a test and two notice entries (`B/008-vault/spec.md:102`, `B/008-vault/spec.md:120`, `B/008-vault/tasks.md:79`, `B/008-vault/acceptance-criteria.md:69`). Its placeholder strings are rakazo's own development defaults, such as `dev-secret-change-me-please-32chars`. Nobody here will type them, and a stored placeholder fails loudly at first use. The same file's constant-time compare only checks a local read-back (`B/008-vault/spec.md:165`), which Node's own `crypto.timingSafeEqual` covers. Proposed amendment: drop the file, `secret-placeholder`, the placeholder half of AC-010 and the two notice entries. Keep `secret-empty`. If you decline, keep one literal, the value AC-010 pipes, and still lift nothing. Either way copy no environment check, because rakazo's guard switches itself off under Vitest. The reviews split here. The one that kept the eight constants had not opened the rakazo file.

### 009 skills

15. **Change the label that tells the model a skill is not instructions. Solid on the wording, likely on the effect.** The block says the body is loaded "for reference, not as instructions" (`B/contracts/prompt-sections.md:90`). That works against the reason the phase exists. Reword the first sentence to say the block is a procedure the bot may follow. Keep the second sentence, which says the body cannot change the run's posture.
16. **Tell the model where the skill's files live. Solid.** Skill bodies use relative links, and a child that starts in the checkout resolves them against the wrong folder. Add one line to the `<skill_content>` block (`B/contracts/prompt-sections.md:88-93`) that names the skill's directory and says relative paths resolve against it. Our own words, so no notice (the OpenGhost lines are MIT).
17. **Refuse a bot-drafted skill that holds hidden direction characters. Likely.** `bots skill propose` writes a draft from a run record, and you move it into the skills folder after reading it in a terminal (`B/009-skills/spec.md:104`, `B/009-skills/spec.md:110`). You cannot see a bidi override there. The verb refuses to write a draft that holds U+202A to U+202E, U+2066 to U+2069, U+200B to U+200D, U+2060 or U+FEFF. One refusal name and one test. Variation selectors (U+FE00 to U+FE0F) stay allowed, because most skill files here carry them with ordinary emoji. The check sits at the draft only, so it can never refuse a skill you wrote. The reviews split between building this now and waiting until a body you did not author can load. I build it now because the propose path already makes a bot the author.
18. **Record the name-and-description tier as a weighed alternative. Solid.** One line in the 009 spec. It matters because of the budget in section 6, decision 3.

### 010 conversations

19. **A paste into `bots chat` is one message. Likely.** The loop sends one message per line (`B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:100`), while the plan's own cut rule expects "a long paste" to be one message (`B/010-conversations/001-chat-ux-and-pane-map/design/prompt-boundary.md:71`). A probe on Node v26.13.0 gave three `line` events from one chunk of three lines, so a pasted stack trace would start one run per line. Read a bracketed paste as one draft in the loop. The chat pane gets the same rule from item 4. One test: a three-line paste dispatches at most one run. The reviews split between building this and probing first. The probe has now run and confirms the readline half. GPL reference, design only.

### 011 messaging channels

20. **"Maybe sent" wins over "retry". Solid.** The send queue names no order between a retryable error and one that may have reached the platform (`B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:180-184`). One entry covers every chunk, so a retry after chunk 2 fails sends chunk 1 twice. `channel-queue.ts` moves an entry to `unknown` whenever `sentBeforeError` is true, whatever `retryable` says. A transport sets that flag once any chunk landed. GPL reference, design only.
21. **One three-part error rule for Slack and Telegram. Likely.** A transport error, an unreadable `200` body and a `5xx` are `unknown`. A `429` or `ratelimited` is retryable. Every other error is `failed`. Item 20 cannot be built without this, and a full table per error code is more than a builder needs.
22. **Cut the Slack chunk that carries buttons at 3,000 characters. Solid.** The plan cuts at 3,900 (`B/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md:63`). Slack's section cap is 3,000, so a long approval prompt would never post.
23. **A long button label falls back to the numbered text form. Likely.** Slack caps a button label at 75 characters. When any option label is longer, send that prompt in the numbered-reply form the plan already has for channels without buttons. No new refusal name, because a refusal would leave you with a question that never reached the chat.
24. **Test that the Telegram offset moves past a duplicate. Likely.** AC-009 asserts only that a replay produces nothing new (`B/011-messaging-channels/005-polling-transports/acceptance-criteria.md:57`). That also passes with the offset stuck, and then Telegram resends the same update forever. Assert that the poll after a dropped duplicate of update 20 carries offset 21.
25. **Give 011 the clean-room rule that 003 has. Solid.** The main 011 reference is GPL-3.0 and Skilled is MIT. Phase 003 keeps GPL sources out of the brief of the worker that writes the matching module (`B/003-terminal-screen/001-ux-and-component-map/plan.md:168`). The rules every 011 worker carries have no such line (`B/011-messaging-channels/003-link-roster-and-answer-gate/plan.md:206-212`), and two tasks send a worker into the tinychannels source (`B/011-messaging-channels/005-polling-transports/tasks.md:38-39`). Add the rule. The worker that records wire facts writes a design note, and a different worker writes the transport from that note. Both reviews raised this item's weight.

### 014 deep review

26. **Record the proof that a regression test fails without its fix. Solid.** The plan requires that proof, but the ledger has no cell for it (`B/014-deep-review/design/records.md:215-221`), and CHK-012 only counts the word "regression" (`B/014-deep-review/tasks.md:231`), which the golden ledger does not contain. Add a column holding the command run with the fix reverted and the failing line it printed. Point CHK-012 at that column. Add one sentence: the regression test imports the module the fix changed, never a test helper.

## 2. Plan contradictions and wrong citations to correct

These are the places where a worker would have to choose between two plan lines, or would follow a citation to the wrong code. Fix them all in one pass before any phase is dispatched.

1. **005, what `memory: false` withholds. Solid.** `B/005-memory/spec.md:96` says the shared file only. REQ-010 at `B/005-memory/spec.md:162` says neither file. Rewrite line 96 to match REQ-010.
2. **009, a bot at both caps. Solid.** REQ-003 at `B/009-skills/spec.md:162` and `B/009-skills/design/fixtures.md:128` say such a bot is "always refused". Decision D11 at `B/contracts/decisions.md:35` says it fits. Rewrite both lines, and make the fixture's refusal case name the body size that pushes it over.
3. **011, the conformance fixture. Solid.** `B/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md:35` describes a fake transport that returns a scripted result. Child 007 runs the real transport over a fake platform (`B/011-messaging-channels/007-conformance-hardening-and-proof/plan.md:29`, `:61`). A fake transport passes two of the five rules for any adapter. Rewrite section 2 to the 007 reading.
4. **011, a `5xx` on send. Solid.** The Telegram row calls it retryable (`B/011-messaging-channels/005-polling-transports/spec.md:99`) and the WhatsApp row calls it unknown (`B/011-messaging-channels/006-daemon-and-webhook-transports/spec.md:91`). Make Telegram say unknown, in line with item 20.
5. **003, the sanitizer citation, in two files. Solid.** `B/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:79` and `B/003-terminal-screen/005-answer-flow/spec.md:212` cite openhuman's filter as the model. That filter drops control characters and keeps line feeds. The plan's rule replaces each one with `?`. Name turnstone's `show_controls` as the nearest source and openhuman's `safe_text` as the filter a builder must not copy.
6. **006, the kind order. Likely.** The plan calls its order of action kinds OpenBot's (`B/006-approval-grants/spec.md:99`, T007, `B/006-approval-grants/design/state-machines.md:226`). No OpenBot line states an order. Say it is the plan's own rule and cite the doc's table rows.
7. **006, a notice for a file nobody lifts. Likely.** REQ-010, AC-010 and T040 require an MIT notice naming `shared/tool-name.ts`. No classifier exists in that file. The plan's own fallback at `B/006-approval-grants/plan.md:151` writes the word lists from the doc and drops the notice entry. Take that fallback now and remove the three rows.
8. **001, a second such notice. Solid.** REQ-006 at `B/001-activity-and-actor/spec.md:179`, AC-006 and T028 name `shared/activity-rows.ts` as lifted. The design uses none of its rules. Drop that file from all three. The notice names `activity-groups.ts` only (MIT).
9. **002, an untrue reason. Solid.** `B/002-routine-layer/spec.md:120` leaves out the once-an-hour cap "because no check-in store exists". The floor check reads the cron period and needs no store. Rewrite the reason: the schedule is your own approved file and the 15-minute floor already binds it. Add no second floor.
10. **009, an over-strong sentence. Likely.** `B/009-skills/design/state-machines.md:64` says a name can never leave the skills folder. A symlinked folder does, and `local-webflow` is one. Correct the sentence: the grammar keeps a name inside the folder, a symlinked folder is followed on purpose and the digest pins the bytes actually loaded.
11. **009, a claim the loader does not back. Solid.** `B/009-skills/design/draft-template.md:29` and `:79` say `allowed-tools` limits what a draft grants. A loaded skill is only text in the prompt. Say the key is advisory for a prompt-loaded body.
12. **011, a pointer to a line that does not exist. Likely.** `B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:222` says the unbounded `seen/` folder is deferred "in the parent spec". The parent has no such line. Add it to the parent's out-of-scope list.

## 3. Defer, each with its trigger

1. **Telegram webhook `409` deletes the webhook and polls again.** The plan waits 2 seconds and polls again on every `409` (`B/011-messaging-channels/005-polling-transports/spec.md:212`). Reaching that state needs a second tool using the same bot token, and a restart of `listen` clears it. The reviews split here. I defer because deleting a webhook someone set on purpose is its own surprise on a single-operator runtime. Trigger: an observed `409` loop. If the loop turns out to be silent, print the `409` first.
2. **OpenBot's rule for when a standing answer may be offered.** This build refuses every standing answer, so the rule has nothing to act on. Trigger: the rules-store packet is opened. The row is in `R4/research.md`, phase 006.
3. **Refuse a standing answer for a tell-only routine.** Same reason and same trigger.
4. **Removing a collaborator counts as "share".** Both kinds ask today, so nothing runs unasked. Trigger: a rules store keys an answer on the kind.
5. **A test that the help text lists every verb.** The help block is edited only in 013 (`B/013-skilled-and-doc-alignment/tasks.md:66`), so a test added earlier would fail through every phase before it. 013's one-time check covers the build. The reviews split between a test now and waiting. The earlier review's point holds. Trigger: a verb added after 013 is missing from `--help`. Then add the test, which is cheaper than generating the block.
6. **A retired-names list for the doc check.** One retired name exists, and the first alignment run already flags a wrong command. Trigger: a third retired name, or a stale name found after 013 closes.
7. **A quiet exit when a reader closes the pipe early.** No handler exists in `bots.cjs`, but no probe has shown a bots verb failing. Trigger: a real `bots ... --json | head` prints a stack trace. Then add one handler line. No contract rule and no scenario.
8. **Hide a run that shows as both working and waiting.** The overlap lasts for the few statements between two writes (`L/runner.ts:1116-1120`) and clears on the next read. Trigger: an operator sees the double row, or a script counts activity rows.
9. **Three more encoded forms in the leak scan.** URL-safe base64, lowercase percent-encoding and form encoding. Trigger: a leak shows one of them.

## 4. Backlog of new features

The research says none of these is needed for parity (`R4/research.md:527`). None belongs in this build. They are ordered by how soon the trigger could fire.

1. **Hourly run cap per bot.** The loops it was meant to stop are already closed. A bot's own commit enqueues nothing (`.skilled/scripts/git-hooks/post-commit:133`, `L/dispatch.ts:341`), cron has a 15-minute floor, a request is retried a bounded number of times and only a linked sender starts a run from a chat. Trigger: a trigger whose sender is not a team member, such as a webhook, or a measured cost surprise.
2. **Merge quick group-chat messages into one run.** Runs for one bot are serial and each sees the newest 40 messages. Trigger: a linked group chat where one ask split over quick lines starts several runs. A smaller form to weigh then: skip a queued chat request when a newer message to the same bot is already in the conversation.
3. **Silent health probe.** Trigger: an unattended host's job is found unloaded after the fact. It needs no runtime change. A bot whose precheck reads `bots status --json` and prints `[SILENT]` when all is well does it (`L/runner.ts:567-568`).
4. **Pattern redaction of secrets the vault does not know.** Pattern lists also withhold harmless messages. Trigger: a real leak of an unstored token, or a chat whose readers are not the team.
5. **Live check that a bot follows a loaded skill.** It needs a record of tool calls that the runtime does not keep. Until then, one manual run after item 15 answers the question. Trigger: a skill is reported ignored and run records carry tool calls.
6. **Audience labels on memory and conversations.** The leak path is inferred. The lever that exists today is `memory: false` on a bot linked to a wide chat. Trigger: one bot linked to two chats with different members.
7. **Stall watchdog.** It needs a watcher process or a change in a module another skill owns. A bot that should give up sooner sets a lower `budget.timeoutSeconds` today (`L/definition.ts:82`). Trigger: dispatch becomes async for its own reason, or hung runs are frequent and measured.
8. **A "what would happen if" command.** Only one decider exists in this build. Trigger: the rules store lands and a parked run can have more than one cause.

## 5. Dropped

1. Next-step text on every refusal: the two refusals that need it are items 8 and 13, and a table over 80 refusal names is a new module.
2. Summaries of older chat: already deferred in the plan at `B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:115`.
3. Instant acknowledgement for long requests: the chat loop already prints a working line at dispatch (`B/010-conversations/001-chat-ux-and-pane-map/design/loop-transcript.md:54`).
4. Office document output: a terminal-first team reads markdown.
5. Outgoing URL checks: the runtime calls fixed provider endpoints only.
6. Trace replay checker: built for a multi-tenant relay, which is on the skip list.
7. Package manifest: needed only when bots are shared across repositories.
8. Tool-name wording rule: no surface in this build prints a tool name.
9. A one-hour floor for tell-only routines: it would refuse a legitimate quiet monitor. Only the wording fix in section 2 item 9 remains.
10. Resolve logic for symlinked skill folders: the loader reads the file and the digest pins it. Only the sentence fix in section 2 item 10 remains.
11. Check a question for secrets where it is written: phase 008 already scans the bot's output before the question is parsed (`B/008-vault/design/leak-checks.md:77`).
12. Overlay key test: the overlay blocks other keys by structure, so the test would mirror the code.
13. Unicode whitespace test: it re-tests what the language's whitespace class already does.
14. A new test for a fire behind a busy bot: the behaviour is unchanged and already tested. Item 3 keeps the sentence.
15. A line-copy check over `lib/channel*.ts`: a Rust source and a TypeScript build share no lines, so it would pass whatever happened.
16. Cite buzz in 004: no plan line is wrong, and nothing is built.
17. Cite OpenBot's app-grant types in 007: it serves a packet nobody has planned. The row stays in the research.
18. A note in 010 that later handoffs keep the same grants: handoff is out of scope, and the row stays in the research.

## 6. Open questions and the limits of the evidence

### Questions the research left open

A worker who meets one of these has to decide alone. Settle the first two before their phases are dispatched. All are listed at `R4/research.md:728-735`.

1. Does a Slack message redelivered after a reconnect answer an approval twice? No verified answer. This is the approval path, so it matters most.
2. Does the per-run app filter compare a tool name before or after it is normalised? No verified answer. It affects 007.
3. How are a cron start and a channel message ordered when they arrive together? No verified answer.
4. What dedupe window does a transport need when the provider's offset resets on restart? Partly answered.
5. Which transports can prove a send never left? Partly answered by item 20. No per-transport table exists.

### How far "solid" goes

- The research verified each row with one worker. Its orchestrator opened 20 citations by hand. It says to treat a row as "a verified claim with one reader" (`R4/research.md:676`).
- For this document, the plan and runtime lines behind sections 1 and 2 were opened again by one or both reviewers. That is a second reader for the plan side.
- The reference side mostly still has one reader. Only two reference files were re-opened: rakazo's `secrets-guard.ts` and tinychannels' `slack/blocks.rs`. Claims about crossterm, OpenBot's firing frame, the Telegram and Slack error codes and the tinysecurity redactor rest on the research alone.

### What is inferred

- Item 1: that a precheck bot never reaches ten failures follows from the plan lines. No run showed it.
- Item 2: that a bot here would misread a schedule-style body. This runtime offers no routine tool. Whether any executor gives the child a scheduling tool was not checked.
- Item 11: that a bot can read the hex form back from the keychain without a prompt.
- Item 15: that models skip a skill under the current label. Backlog item 5 is the test that would show it.
- Item 17: that a bot-drafted skill is the realistic way such a character arrives. No skill file holds one today. Two scans agree on that and differ by one on the file count, 61 against 62.
- Item 19: the probe fed a simulated chunk to readline. Nobody pasted into a real terminal.
- Item 23: that the text form can be chosen per prompt. Today it is chosen per channel.
- Item 5: nobody checked whether the answer overlay also clips a long question. If it does, you would approve text you cannot read in full, and that would deserve an item of its own.
- Item 3: the existing test for a held lease was cited by the earlier review at `runtime/tests/runner-kill.vitest.ts:43-47`. I did not read what it asserts.

### Three decisions that are yours

1. **Item 1** overrides a choice REQ-006 made on purpose.
2. **Item 14** removes scope the plan froze. If you decline, the fallback in the item costs one literal.
3. **The skills budget.** The plan states that the four largest of the sixteen skill bodies refuse `skill-too-large` (`B/009-skills/spec.md:93`). A size check on 2026-11-27 agrees. The 20,480-byte total fits one mid-size skill or two small ones. So a bot gets one skill in practice. If that is too few, the name-and-description tier in item 18 is the way out, and it is a new phase and not a fix.
