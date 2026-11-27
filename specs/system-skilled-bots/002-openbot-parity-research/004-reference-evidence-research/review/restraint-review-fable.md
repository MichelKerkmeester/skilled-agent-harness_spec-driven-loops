# Overengineering review of the final recommendations

Reviewer: fresh read, 2026-11-27. Read-only. Nothing in the repository was changed.

Path prefixes in citations:

- `B/` is `specs/system-skilled-bots/003-openbot-parity-build/`
- `P/` is `specs/system-skilled-bots/002-openbot-parity-research/`
- `R4/` is `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/`
- `S1/` is `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/`
- `L/` is `.skilled/skills/system-skilled-bots/runtime/lib/`
- `C/` is `specs/system-skilled-bots/context/`

Every `[SOURCE: ...]` line below was opened by me in this session. A claim marked "inferred" is my reasoning and no line states it.

Item ids: `G1` to `G8` are the eight top guards, split with a letter where one guard holds several actions. A phase number names an item from "Everything else". `N1` to `N16` are the new features in the list's own order.

## 1. The core need

The operator wants to answer two questions from a terminal: what did my bots do, and what needs me. Today that means reading run folders by hand [SOURCE: B/spec.md:64]. The desire behind it is OpenBot's before-and-after view for a small team, with none of OpenBot's server, database, container stack or desktop shell [SOURCE: B/spec.md:67]. The runtime already holds the hard half, so the gap is a human surface plus a few small records, each closed with a file-backed change [SOURCE: S1/research.md:7].

The research parent exists to say what must be built and how deeply the plan must be specified [SOURCE: P/goal.md:39]. Deep enough means a builder needs no design decision while building [SOURCE: P/spec.md:65] and every phase can be built in one shot [SOURCE: P/spec.md:56]. That depth matters because the build is dispatched to external CLI workers on cheap models, never hand-run [SOURCE: B/spec.md:192], and such a worker cannot stop to ask.

Three groups use the result. The operator decides which plan edits to accept. The build orchestrator and its workers build each phase from the plan documents. The team then drives bots from the terminal and from the chat it already uses [SOURCE: B/011-messaging-channels/spec.md:63].

Done, for the fourth research run, is an evidence pack per build phase: the reference code to lift or mirror and the pitfalls to guard against [SOURCE: P/goal.md:48]. The packet ends at a recommendation and builds nothing [SOURCE: P/goal.md:49]. Done, for the build, is the human surface and the small records, proven by an operator scenario corpus, aligned with the docs and closed by one deep review with no open P0 or P1 [SOURCE: B/goal.md:39].

The need has a hard edge. Enterprise roles, multi-tenant, Kubernetes, managed upgrades, mobile, a container computer, an OAuth server, the desktop app, a browser computer, per-action policy inside the executor and the shared-host mode are all out [SOURCE: B/spec.md:86-100] [SOURCE: S1/research.md:108-116].

Where the sources correct the orchestrator's summary:

1. "A small team" is narrower in the build than in the research. The research scope is "one machine or a shared host" [SOURCE: S1/research.md:15]. The build keeps the state root owner-only, so the roster is single-operator until a later packet [SOURCE: B/spec.md:96] [SOURCE: B/goal.md:50]. The team reaches the bots through linked chats, not through a shared host. A guard that only bites with two operators on one state root has no caller in this build.
2. "Recommendations they can act on directly" covers two different things. Plan fixes are in scope and can be acted on now. The net-new features were asked for only as a ranked list [SOURCE: P/spec.md:85]. The build scope is the ten ranked slices, the channels extension and three closing phases [SOURCE: B/spec.md:78-79]. The research itself says "None of the sixteen is needed for parity with what the plan already promises" [SOURCE: R4/research.md:527]. So the sixteen are a backlog, not build scope.
3. "Pushed back on overengineering more than once" is not stated in any source I was pointed at. It is consistent with them: every part of the first synthesis is framed as the "smallest change" [SOURCE: S1/research.md:15], and the repo rule says to build the bigger thing only after naming what fails at the smaller one [SOURCE: .skilled/repo-rules/prevent-overengineering.md:46-47]. I treat the pushback as given by the orchestrator, not confirmed by me.
4. One point the summary leaves out: every phase is still `Draft` [SOURCE: B/008-vault/spec.md:25], so a plan amendment can be raised before the build starts. That is the cheapest moment to remove scope.

## 2. Verdict

The list is sound where it fixes the plan and overbuilt where it adds to it. Of 66 separate actions, 23 stand as written, 15 should shrink, 13 should wait for a named trigger, 13 should go and 2 deserve more weight than they got. The guards on the approval surface and on channel sends are real and cheap: a paste that approves an item, a deny the bot can work around, a retry that sends a chunk twice, a Slack prompt that never posts. The overengineering sits in four places. First, sixteen new features that the research itself says parity does not need. Second, design work for packets nobody has planned, such as the rules store key and the offer rule. Third, checks imported from a reference with no local failure behind them: the one-hour floor, rakazo's placeholder constants, five extra encodings, symlink handling, the webhook branch and a refusal of "invisible" characters that would refuse 48 of the 61 skill files in this repository as worded. Fourth, tests that re-assert the language or mirror the implementation. Two cheap items are understated: the fatigue rule that never trips for a bot with a precheck, and the clean-room rule that phase 011 lacks while its tasks send a worker into GPL source. As written the list would add about four refusal names, three BOT.md keys and twelve tests or fixtures. After the changes below it adds one refusal name, no key and eight tests.

## 3. Changes to make

Most consequential first. Each entry gives the call, the tie to the core need, the evidence and the wording to use.

### Promote

**002, the fatigue rule (listed as "add one fixture for the deliberate fatigue rule", likely). Promote.**
The plan stops the failure count at the first record that is not a failed run [SOURCE: B/002-routine-layer/spec.md:173] [SOURCE: B/002-routine-layer/design/state-machines.md:68]. A precheck skip is a refusal with a null class [SOURCE: L/runner.ts:136-139]. So a cron bot whose precheck skips the quiet slots and whose run fails whenever there is work never reaches ten in a row. The switch then protects no bot that uses a precheck, which is the common shape for an unattended bot. The consequence is inferred from those lines. No run showed it. The listed action pins the weak rule with a fixture. The cheaper and better move is one changed condition.
Revised wording: "002: in `failureStreak`, skip a null-class refusal and keep counting. Stop only at a completed or parked run. Say so in REQ-006 and in AC-006, which pins the stop rule today [SOURCE: B/002-routine-layer/acceptance-criteria.md:61]. One fixture: failed, `precheck-silent`, failed counts two."

**011, the clean-room rule for workers (listed last in 011, likely). Promote.**
The operator decided twice that no GPL code enters an MIT tree [SOURCE: S1/research.md:157]. Phase 003 keeps GPL sources out of the brief of the worker that writes the matching module [SOURCE: B/003-terminal-screen/001-ux-and-component-map/plan.md:168]. The rules every 011 worker carries name no such rule [SOURCE: B/011-messaging-channels/003-link-roster-and-answer-gate/plan.md:206-212]. Two 011 tasks send a worker into the tinychannels source to record wire facts [SOURCE: B/011-messaging-channels/005-polling-transports/tasks.md:38-39]. 011 has the largest GPL-only reference of the build, and a copied transport is the one mistake a deep review cannot cheaply undo. The fix is one line.
Revised wording: "011: add phase 003's worker rule to the 011 dispatch rules. The worker that records wire facts writes a design note. A different worker writes the transport from that note." Leave the extra line-copy check over `lib/channel*.ts` out unless the orchestrator wants it. Phase 003 relies on a compare by eye, and the same suffices here.

### Shrink

**G7, the one-hour floor for routines that only report. Shrink to a wording fix, and take it out of the top eight.**
OpenBot's cap protects a hosted product from noisy check-ins. Here the author of a `*/15` schedule is the operator, in a file they wrote. A monitor that checks every 15 minutes and stays silent through the existing precheck marker is a legitimate small-team bot [SOURCE: L/runner.ts:567-568]. A one-hour floor would refuse it. The only real defect is that the deferral gives a reason that does not hold [SOURCE: B/002-routine-layer/spec.md:120].
Revised wording: "002: rewrite the out-of-scope line at spec.md:120. The once-an-hour cap is left out on purpose, because the schedule is the operator's own file and the 15-minute floor already binds it."

**G5c, refuse invisible, bidi or zero-width characters in a skill body. Shrink to a named code point set.**
The real path is a bot-drafted skill that an operator reviews in a terminal and cannot fully see. That is worth one check. But "invisible" is not a set. I scanned every `SKILL.md` under `.skilled/skills/`: 61 files. None holds a bidi control and none holds a zero-width character. 48 hold a variation selector (U+FE00 to U+FE0F), which comes with ordinary emoji. A builder who reads "invisible" broadly refuses most of the operator's own skills on the first run. The scan was my own command, run once.
Revised wording: "009: refuse a body that holds U+202A to U+202E, U+2066 to U+2069, U+200B to U+200D, U+2060 or U+FEFF. Variation selectors are allowed. One refusal name, one test with a bidi override."

**G3b and the 008 question on `lib/secrets-guard.ts`. Shrink to no lift at all, raised as a plan amendment.**
The eight constants are rakazo's own development defaults, such as `dev-secret-change-me-please-32chars`, beside an error text about starting Rakazo [SOURCE: C/rakazo-main/packages/core/src/node/secrets-guard.ts:1-15]. No operator of this runtime types those strings. The plan lifts them into a new file with a notice, a refusal name and an acceptance test [SOURCE: B/008-vault/spec.md:120] [SOURCE: B/008-vault/acceptance-criteria.md:69]. The same file carries a constant-time compare that is used only to check a local read-back of the value the operator just typed [SOURCE: B/008-vault/spec.md:165]. Nobody can time that compare, and Node's standard library has one. The listed action deepens the lift by naming all eight constants as a set. A stored placeholder fails at first use with an auth error, which is loud and harmless. This is a judgment on plan scope, so it is an amendment for the operator, not something a builder may cut alone.
Revised wording: "008: propose removing `secrets-guard.ts`, `secret-placeholder`, AC-010's placeholder half and the two notice entries. Keep `secret-empty`. If the operator declines, keep one literal, the value AC-010 pipes, and lift nothing. Either way copy no environment check."

**G3a, five more encoded forms plus lowercase hex. Shrink to the hex form.**
The scan exists to catch an accidental echo. The plan already accepts transformed values as a residual [SOURCE: B/008-vault/design/leak-checks.md:108]. The hex form is different, because the vault itself writes it as the keychain password [SOURCE: B/008-vault/design/backends.md:41], so a bot that reads the item back prints a form the scan misses. That path is inferred, as the research says. The other five forms come from a GPL redactor built for a different threat. No line names a way they appear here.
Revised wording: "008: add the lowercase hex of each vault value to the scanned forms in leak-checks.md section 3, and remove hex from the residual row. Add the other five only when a leak shows one."

**005, a stable short id per memory entry. Shrink to an id derived from the entry, not stored.**
The failure is real for one operator: list once, forget entry 3, then forget entry 5 from the same listing, and a different confirmed fact is gone without a word. The plan shifts every later index after a forget [SOURCE: B/005-memory/spec.md:152] [SOURCE: B/contracts/records.md:266]. The research notes that a stored id changes the line from five fields to six, changes two requirements and spends bytes against the 3,600-byte cap. A short id computed from the line's own bytes when the file is read fixes the same failure with none of that. The derived-id design is my judgment. A collision between two identical lines would need one rule: forget the first.
Revised wording: "005: `--list` prints a short id derived from each entry's bytes, and `--forget <id>` takes it. The stored line keeps five fields. Drop the shift rule from records.md section 7."

**G4b, narrow the next packet's key to bot, kind, checkout and exact action text. Shrink to deleting the premature design.**
`always` and `conversation` are refused in this build, and the plan names the rules store as the next packet's work [SOURCE: B/006-approval-grants/spec.md:205] [SOURCE: B/006-approval-grants/spec.md:271]. The danger is that those two lines already commit that packet to "bot plus kind". Replacing one premature key with a four-part premature key repeats the mistake.
Revised wording: "006: at spec.md:205 and :271, replace 'a scope bound to bot plus kind' with 'a scope the next packet defines. Bot plus kind is too wide, because one allow would open every action of that kind.'"

**G6d, refuse a Slack button label over 75 characters with a named refusal. Shrink to the existing text form.**
The cap is real [SOURCE: C/tinychannels-main/src/providers/slack/blocks.rs:10]. But the plan already turns a buttons prompt into a numbered text form where buttons are not available. A long label is one more case for that path. A new refusal name would leave the operator with a parked question that never reached the chat. The fallback is my judgment, and I did not open the line that defines the text form.
Revised wording: "011: when any option label is over 75 characters, send the Slack prompt in the numbered-reply form."

**002, copy OpenBot's firing frame. Shrink to one sentence in our own words.**
The failure OpenBot hit needs a routine tool, which this runtime does not offer, so the risk here is inferred. It is still worth a sentence, because a run that does nothing and records success is the worst failure for an unattended bot. Lifting three sentences costs a third notice entry, a new block in the shared prompt contract and a never-on-resume rule. A sentence in the existing non-interactive preamble for a schedule-sourced run costs none of those. Resume re-sends the parked prompt as it was, so nothing is added twice.
Revised wording: "002: for a run whose source is a schedule, the preamble adds: 'This run was started by its schedule. Do the work now. Do not create or change a schedule.' Our own words, no notice entry."

**G5b, add OpenGhost's two skill-folder lines (MIT). Shrink to our own words.**
The gap is real: skill bodies use relative links, and a child that starts in the checkout resolves them against the wrong folder. The two lines state a fact, a path and what it means. Writing that fact fresh avoids a notice entry.
Revised wording: "009: inside each skill block, add 'Skill directory: <dir>' and one sentence that relative paths in the skill resolve against it. Written fresh, no notice."

**013, generate the help text from the verb table. Shrink to one unit test.**
The drift is real: the help is a literal array and nothing compares it to `VERB_SPECS` [SOURCE: .skilled/bin/bots.cjs:19] [SOURCE: .skilled/bin/bots.cjs:64] [SOURCE: B/013-skilled-and-doc-alignment/spec.md:97]. The plan checks set equality once, at close [SOURCE: B/013-skilled-and-doc-alignment/design/mockups.md:235]. Moving every description into the table restructures the CLI's help. One test that asserts the same set equality runs on every later change and costs five lines. This is a close call. If 013 rewrites the block anyway, generating it is also acceptable.
Revised wording: "013: add one runtime test that the verbs in `USAGE` and the keys of `VERB_SPECS` are the same set."

**012, a rule that a cut-off command ends quietly, plus one scenario. Shrink to one handler line.**
No EPIPE handling exists today (searched `EPIPE` and `SIGPIPE` in `.skilled/bin/bots.cjs` and `L/`, no hit). The exposure is inferred and needs an output larger than the pipe buffer. The cost of the failure is a stack trace, not lost data. The listed action touches a contract file, the scenario corpus and the review. 012 also rules out new tests of its own [SOURCE: B/012-manual-testing-scenarios/spec.md:114].
Revised wording: "001, when it first edits `bots.cjs`: exit 0 on an `EPIPE` error from stdout. No contract rule, no scenario."

**011, map every Slack and Telegram error. Shrink to a three-bucket rule.**
A builder does need to know which errors are uncertain, or G2 cannot be built. A full error table is more than that. The reference's own shape is a default with a short exception list.
Revised wording: "011: for Slack and Telegram, a transport error, an unreadable body and a 5xx are unknown. A rate limit and the named transient codes are retryable. Everything else is permanent." Fold this into G2.

**002, REQ-005 says a firing behind a busy bot is refused, with a test. Shrink to the sentence.**
The behaviour exists and the existing suites already name `lease-held` (`runtime/tests/retry.vitest.ts`, `runtime/tests/runner-kill.vitest.ts`). I did not read what those tests assert, so "already covered" is inferred. A new test for unchanged behaviour does not earn its place under the repo's test rule.
Revised wording: "002: add one sentence to REQ-005 that a fire behind a held lease is refused and never caught up."

**N3, next-step text on every refusal. Shrink to a one-sentence rule.**
The contract holds 80 refusal rows today (counted with `rg -c` over `B/contracts/refusals.md`). A table of fix sentences for all of them, read by the CLI and the screen, is a new module for a pattern the runtime and the plan already follow case by case [SOURCE: L/status.ts:297] [SOURCE: B/010-conversations/001-chat-ux-and-pane-map/design/loop-transcript.md:56]. The two cases the research found are already in the list under 005 and 008.
Revised wording: "contracts/refusals.md: a refusal whose repair is one command names that command in its detail. No table."

**N4, a silent health probe on `bots status`. Shrink to a documented example bot.**
Silent-when-healthy already exists: a precheck that prints `[SILENT]` skips the run [SOURCE: L/runner.ts:153] [SOURCE: L/runner.ts:567-568], and `bots status` already joins install records with `launchctl print` [SOURCE: L/status.ts:5-8]. A bot whose precheck reads `bots status --json` and stays silent when all is well is the probe, with no runtime change. That a precheck may call `bots status` is inferred. I did not run it.
Revised wording: "013 or the author docs: ship one example BOT.md whose precheck reads `bots status --json`. No new verb or job."

### Defer

**G6b, a webhook 409 deletes the webhook and polls again. Defer.**
The plan clears the webhook when `listen` starts. The failure needs someone to point the same bot token at a webhook while `listen` runs, which on a small team is the operator's own second tool. A restart of `listen` clears it. Trigger: an observed 409 loop, or a second consumer of the token.

**006, copy OpenBot's offer rule. 006, the check-in-only refusal. 006, removing a collaborator is "share". Defer all three.**
All three govern standing answers. This build refuses every standing answer and builds only once and deny [SOURCE: B/006-approval-grants/spec.md:161] [SOURCE: B/006-approval-grants/spec.md:205]. The research itself calls the key question moot today. Writing them into REQ-006 now specifies a packet that does not exist. Trigger: the rules-store packet is opened. The research file already holds the three rows for that day.

**013, the retired-names list. Defer.**
One retired name exists, and the first alignment run already grades a wrong command P0. A list with one entry is not a pattern, and it amends a design frozen at three checks. Trigger: a third retired name, or a stale name found after 013 closes.

**N1, hourly run cap per bot. Defer.**
The list ranks this first as the guard against a trigger that fires in a loop. The loops are already closed. A commit made inside a bot run is skipped, so a bot cannot enqueue itself [SOURCE: .skilled/scripts/git-hooks/post-commit:127-128]. Cron is floored at 15 minutes [SOURCE: B/002-routine-layer/spec.md:172]. A request is tried at most a bounded number of times and then quarantined [SOURCE: L/request-queue.ts:42]. A channel message runs only for a linked sender [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:43]. What remains is a team member typing fast, which is use and not a fault. The item costs a BOT.md key, a second optional key and a refusal name. Trigger: the first trigger whose sender is not a team member, such as a webhook, or a measured cost surprise.

**N2, merge quick group-chat messages. Defer.**
A hold window adds state, a timer and a delay to every message. Runs for one bot are already serial, and each run's prompt carries the newest 40 messages of the conversation [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:164]. Trigger: a linked group chat where duplicate runs are seen. A smaller form to weigh then: skip a queued chat request when a newer human message to the same bot is already in the conversation. That form is my inference.

**N5, pattern redaction of unknown secrets. Defer.**
Pattern lists also produce false hits that withhold a delivery. Known values from the environment and dotenv files are already collected [SOURCE: L/dispatch.ts:249]. Trigger: a real leak, or a bot granted an app that returns credentials.

**N6, stall watchdog. Defer.**
The dispatch blocks the event loop [SOURCE: L/runner.ts:892], so this needs a watcher process or a change in a module another skill owns. The gain is time and a clearer cause, since the wall-clock limit already ends a hung child. The cheapest move exists today: lower `budget.timeoutSeconds` for that bot [SOURCE: L/definition.ts:82]. Trigger: hung runs that are frequent and measured.

**N7, live skill-following check. Defer.**
It needs a tool-call trace the runtime does not record. One manual run of a bot with a skill, after the label change in G5a, answers the open question for now. Trigger: a packet that records tool calls.

**N8, audience labels. Defer.**
The leak path is inferred and memory entries are operator-confirmed. The existing lever is `memory: false` on a bot linked to a wide chat [SOURCE: B/005-memory/spec.md:162]. Trigger: one bot linked to both a private chat and a team channel with shared memory on.

**N9, a what-would-happen-if command. Defer.**
Only rung 1 of the ladder exists, so there is one decider to explain. Trigger: the rules store lands.

**N10, summaries of older chat. Defer.**
The plan already names compaction as a later packet [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:115]. Trigger: a team reports a bot forgetting a long chat.

### Drop

**G5d, resolve symlinks without refusing all of them. Drop.**
Nothing fails today. The loader reads the file and the digest pins the bytes it read. The name grammar keeps a name inside the skills folder [SOURCE: B/009-skills/design/state-machines.md:64]. The item exists only to avoid copying a refusal from a reference that nobody proposed to copy. `local-webflow` is a symlink the operator made on purpose (read with `ls -l`).

**003, check questions for secrets where they are written. Drop.**
Phase 008 already scans the child's output before the decision marker is parsed, "so a parked question therefore never carries a value into a needs-you item" [SOURCE: B/008-vault/design/leak-checks.md:77]. Until 008 lands the question is shown only on the operator's own terminal.

**001, hide a working row whose run id matches an open question. Drop.**
The window is the few statements between the item write and the run record [SOURCE: L/runner.ts:1116-1120]. The effect is one run drawn twice until the next read. No decision can go wrong in that window. Revisit only if an operator reports it.

**003, the overlay key test. Drop.**
Exclusivity is structural, as the research says. The test would mirror the implementation.

**005, the Unicode whitespace test. Drop.**
`collapseText` replaces every whitespace run [SOURCE: B/005-memory/design/module-contract.md:30]. A table of 26 code points re-asserts what the language's whitespace class already does, which the repo's test rule excludes. That the builder will use that class is inferred.

**007, cite OpenBot's app-grant types for the later packet. Drop.**
It builds nothing and no planned phase reads it. The research file already holds the row.

**010, later threads or handoffs keep the same grants and limits. Drop.**
Same reason. Handoff is excluded from 010, and the row stays in the research.

**N11, instant acknowledgement for long requests. Drop.**
The chat loop already prints a working line when a run is dispatched [SOURCE: B/010-conversations/001-chat-ux-and-pane-map/design/loop-transcript.md:54]. A channel-side acknowledgement can be raised if a team asks.

**N12 office document output, N13 outgoing URL checks, N14 trace replay checker, N15 package manifest, N16 tool-name wording rule. Drop all five.**
The research's own "who notices" column says hardly anyone or nobody for each. Two rest on parts the skip list excludes. Listing them invites building them. One line saying they were considered is enough.

## 4. Kept as is

- G1, bracketed paste in the screen and in `bots chat`. A pasted `y` must not approve, and the plan itself expects a long paste to be one message [SOURCE: B/010-conversations/001-chat-ux-and-pane-map/design/prompt-boundary.md:71] while the loop sends one message per line [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:100]. A probe confirms the readline half, see section 6.
- G2, "maybe sent" wins over "retry", and a Telegram 5xx is unknown. The state machine names no order [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:180-184].
- G3c, never put another program's output into the `secret-store-unreadable` detail [SOURCE: B/contracts/refusals.md:160].
- G4a, the resumed prompt after a deny says the person declined and the bot must not reach the result another way [SOURCE: B/006-approval-grants/design/mockups.md:173-174].
- G5a, change the "for reference, not as instructions" label [SOURCE: B/contracts/prompt-sections.md:90].
- G6a, rewrite the conformance fixture to the real adapter over a fake platform. Two plan documents disagree today [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md:35] [SOURCE: B/011-messaging-channels/007-conformance-hardening-and-proof/plan.md:61].
- G6c, cut the button-bearing Slack chunk at 3,000 characters. The plan cuts at 3,900 [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md:63].
- G8, a ledger column for the failing run with the fix removed. CHK-012 counts a word today [SOURCE: B/014-deep-review/tasks.md:231] and the ledger has no proof column [SOURCE: B/014-deep-review/design/records.md:215-221].
- 001, drop the notice for `activity-rows.ts`. Take the drop branch, since the design uses none of its rules [SOURCE: B/001-activity-and-actor/spec.md:179].
- 003, fix the sanitizer citation in component-inventory.md.
- 003, end a cut string with an ellipsis. The `--ascii` flag already exists for the fallback [SOURCE: B/003-terminal-screen/002-architecture-and-contracts/plan.md:68].
- 003, the wide-character test. Use an emoji at the clip column, which is the case this team will meet.
- 004, cite buzz in REQ-001. One line, nothing built.
- 005, fix spec.md:96 against REQ-010 [SOURCE: B/005-memory/spec.md:96] [SOURCE: B/005-memory/spec.md:162].
- 005, `memory-full` names its repair [SOURCE: B/005-memory/design/mockups.md:280].
- 006, credit `docs/approvals.md` and drop `tool-name.ts`. The plan already holds this fallback [SOURCE: B/006-approval-grants/plan.md:151].
- 006, stop calling the kind order OpenBot's [SOURCE: B/006-approval-grants/spec.md:99].
- 008, `secret-unknown` names the secret and the set command [SOURCE: B/008-vault/acceptance-criteria.md:65].
- 009, fix the stale "always refused" line [SOURCE: B/009-skills/spec.md:162] [SOURCE: B/contracts/decisions.md:35].
- 009, say `allowed-tools` is advisory for a prompt-loaded body. Take the advisory branch, because enforcing it needs a tool surface [SOURCE: B/009-skills/design/draft-template.md:29].
- 009, record the name-and-description list as a weighed alternative. See section 5 for why it matters more than its place suggests.
- 011, the test that the offset moves past a duplicate.
- 011, record the unbounded `seen/` folder as out of scope. The plan points at a line that does not exist [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:222].

## 5. Does the list serve the need

Mostly yes for the plan fixes, and no for the additions. The core need is a plan a worker can build in one pass, for a small terminal-first team. The list helps that need most where it removes a contradiction or closes a hole in the approval path. It works against the need where it adds features, keys and refusal names the plan never promised.

What the list misses or buries:

1. **The sentence that frames the sixteen features.** The research says none of them is needed for parity [SOURCE: R4/research.md:527]. The list drops that sentence and presents them "in order", which reads as a queue. An operator who has pushed back on overengineering needs that sentence first.
2. **The contradictions are scattered.** The handoff bar is that a builder needs no design decision [SOURCE: P/spec.md:65]. Six places where the plan contradicts itself are exactly where a worker must decide. They sit in five different spots of the list. They belong together at the top as "fix before the build starts": 005 spec.md:96, 009 "always refused", 011 conformance fixture, 011 Telegram 5xx, 003 sanitizer citation and 006 kind order.
3. **The open questions are gone.** The research leaves five questions open with no verified row, among them whether a Slack envelope redelivered after a reconnect double-answers and whether the per-run app filter compares a tool name before or after normalisation [SOURCE: R4/research.md:730-735]. Each is a decision a worker would have to make alone. A double answer on an approval is the kind of failure this build exists to prevent. The list carries none of them.
4. **"Solid" promises more than was checked.** The research says twenty citations were opened by hand and every other row rests on one verification worker: "Treat a row as a verified claim with one reader, not as a fact with two" [SOURCE: R4/research.md:676]. The list turns that into "solid = confirmed".
5. **The fatigue rule and the 011 clean-room rule.** Both are cheap and both guard something the operator already decided. Both sit low with a "likely" tag. See section 3.
6. **The skills budget.** The plan states that the four largest of the sixteen skill bodies refuse `skill-too-large` [SOURCE: B/009-skills/spec.md:93]. My own size check today agrees: four of sixteen are over the 16,384-byte cap, and the 20,480-byte total fits one mid-size body or two small ones. So a bot gets one skill in practice. The list files the only lever, the name-and-description tier, as an alternative to record. The operator should see that limit stated plainly before 009 is built. Whether one skill per bot is acceptable is their call.
7. **No cost line.** The list gives no count of what it adds. As written: about four refusal names (one inferred, for the second floor), three BOT.md keys, twelve tests or fixtures and one change in a module another skill owns. A reader cannot weigh the list without that.
8. **No file and line.** The research names the line each fix lands on. The rendering drops it, so the operator cannot act on an item without opening the research beside it.

## 6. Comparison with the earlier review

Read only after sections 1 to 5 were written. No call was changed afterwards. Four factual edits were made to those sections after the read. The fatigue wording in section 3 gained the AC-006 citation, which is theirs. The G1 line in section 4 gained a pointer to the probe below. Two line numbers for the chat loop transcript were corrected and two citations were added to N1 and N2, all from my own re-check. The prefix table became a list.

The two reviews agree on most of the list. Both keep the screen paste guard, the "maybe sent" rule, the deny prompt, the label change, the conformance rewrite, the Slack cut at 3,000 and the ledger column. Both promote the 011 clean-room rule. Both shrink the memory id to a derived one, the Slack label to the text form, the one-hour floor to a wording fix and the skill-folder lines to our own words. Both take out the sixteen features, the three standing-answer items and the tests that mirror the language or the implementation. The earlier review counts 68 units and I count 66, because we split the guards differently.

### Where I disagree

1. **002, the fatigue rule. Mine: promote. Earlier: drop as a duplicate of AC-006.** The earlier review is right that AC-006 already pins "the streak stops there" [SOURCE: B/002-routine-layer/acceptance-criteria.md:61], so the fixture as listed adds nothing. It answered whether the fixture is needed and never asked whether the rule is right. A precheck skip is a null-class refusal [SOURCE: L/runner.ts:139], so under the stop rule a bot with a precheck cannot reach ten failures in a row unless ten slots in a row all have work. The research raised exactly this and asked for the choice to be reconsidered. I hold the promote. The AC-006 citation is theirs, and I added it to my wording in section 3.
2. **008, rakazo's placeholder constants. Mine: lift nothing and propose removing the refusal. Earlier: keep the eight constants as one set.** The earlier review did not open the reference repos and says so. The file shows the constants are rakazo's own development defaults beside an error text about starting Rakazo [SOURCE: C/rakazo-main/packages/core/src/node/secrets-guard.ts:1-15]. A guard against strings no operator here will type is a pattern imported without checking fit.
3. **010, bracketed paste in `bots chat`. Mine: keep. Earlier: defer until a probe shows more than one run.** Their call for a probe was fair, so I ran one after reading it. Node v26.13.0, `readline` with `terminal: true`, one chunk holding three lines ended by carriage returns: three `line` events, exit 0. The loop sends one message per line [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:100], and the plan's own cut rule expects "a long paste" to be one message [SOURCE: B/010-conversations/001-chat-ux-and-pane-map/design/prompt-boundary.md:71]. What stays inferred is that a terminal without bracketed paste delivers a paste as those bytes. I did not paste into a real terminal. I hold the keep.
4. **009, invisible characters. Mine: shrink to a named set, built now. Earlier: defer until a body the operator did not author can load.** That trigger is already met inside this build. `bots skill propose` writes a draft from a run record, and the operator moves the draft into the skills folder after a review in a terminal [SOURCE: B/009-skills/spec.md:104] [SOURCE: B/009-skills/spec.md:110]. The author of that text is a bot and the reviewer cannot see a bidi override. Their point that bodies are trusted repository content [SOURCE: B/009-skills/spec.md:175] does sharpen where the check belongs: at the draft, where untrusted text enters. Both scans agree that no skill file holds such a character today.
5. **002, the firing frame. Mine: one sentence in the preamble now. Earlier: defer until a run completes with no work done.** Their reading is closer to the letter of the restraint rule, since the failure is inferred here. I hold the shrink for two reasons. The failure is silent by nature, so the trigger they name may never be noticed. And no prompt golden exists yet, so the sentence costs least now. This is a judgment call and their defer is defensible.
6. **011, the webhook 409. Mine: defer. Earlier: keep.** The plan does wait 2 seconds and poll again on every 409 [SOURCE: B/011-messaging-channels/005-polling-transports/spec.md:212]. I still see no way to reach that state without a second consumer of the same bot token, and deleting a webhook someone set on purpose is its own surprise. I did not check whether the loop prints the 409. If it is silent, the smallest fix is to print it, not to add a branch.
7. **008, the encoded forms. Mine: hex only. Earlier: five forms.** See the next list for the part of their case I accept. For lowercase percent-encoding, form encoding and URL-safe base64 I still find no line that names how the form would appear here.

Smaller differences that lead to the same outcome: they drop the stall watchdog, the what-if command, the chat summaries, the retired-names list and the next-step table where I defer or shrink them. They defer the working-row filter and the health probe where I drop the first and shrink the second to an example bot. None of these is built under either review.

### Where it caught something I missed

1. **Unpadded base64 covers padded.** An unpadded base64 string is a prefix of its padded form, so scanning the unpadded form in place of the padded one widens the scan at no cost. I missed that. It fits beside the hex form.
2. **The help text test would fail if it landed early.** The help block is edited only in 013 [SOURCE: B/013-skilled-and-doc-alignment/tasks.md:66], so my set-equality test can only land at 013's close, where the plan's one-time check already runs. That leaves the test guarding verbs added after 013, which is a future caller. Their defer is the better call.
3. **A second mis-citation for the sanitizer.** The answer-flow spec cites the same openhuman lines for the one sanitizer [SOURCE: B/003-terminal-screen/005-answer-flow/spec.md:212]. I read that line and did not connect it. The fix should cover both files.
4. **The 006 notice.** The plan's fallback says the notice entry is dropped [SOURCE: B/006-approval-grants/plan.md:151]. I cited that line and still kept the item as "credit the doc", which would add a notice for a file nobody lifts. Their wording is right: drop the entry.
5. **A false sentence about symlinks.** I dropped the symlink item whole. They keep one line: the design says a name can never leave the skills folder [SOURCE: B/009-skills/design/state-machines.md:64], and a symlinked folder does. Correcting that sentence is free.
6. **Better evidence for the closed commit loop.** They cite the check itself, the run marker test in the hook [SOURCE: .skilled/scripts/git-hooks/post-commit:133] and the marker set on every child [SOURCE: L/dispatch.ts:341]. I cited the comment above it.
7. **The buzz citation fixes nothing false.** They searched 004 for a line that claims there is no reference and found none. I kept the item by default.

### What the earlier review does not cover

It has no section on whether the list serves the need. So it does not raise the dropped open questions, the "solid" label, the scattered contradictions, the skills budget or the missing cost line from section 5.

## 7. Not checked

- I opened two reference files only: rakazo's `secrets-guard.ts` lines 1 to 30 and tinychannels' `slack/blocks.rs` lines 7 to 11. Every other claim about a reference repo rests on the research.
- The crossterm behaviour behind the screen paste guard. The research opened it in a local cargo registry, and I did not.
- What the existing `lease-held` tests assert. I saw only that two test files name the refusal.
- How the decision overlay draws a long question. If it clips too, the operator approves text they cannot read in full, and the ellipsis item matters more than its place suggests.
- The WhatsApp row's wording on a 5xx. My read of that line was cut short, so the Telegram and WhatsApp disagreement rests on the research.
- Whether Slack takes the numbered text form for one prompt on a channel that declares buttons.
- No bots verb was run. I avoided `bots status` because it may write the state root. The EPIPE exposure stays inferred.
- The paste probe used a simulated chunk on a stream, not a real terminal.
- The skill scan covered `SKILL.md` files only and did not follow the `local-webflow` symlink.
- Which executor kinds a bot may use and whether any gives the child a scheduling tool. The firing-frame call leans on that being possible.
- I did not read the phase documents in full, the second and third syntheses or the regrade log. I read the lines each recommendation touches.
- I verified six of the earlier review's citations and took the rest as written.
- The count of 66 follows my own split of the guards. Another split moves the totals by a few.
- The project gates that ask about a spec folder and skill routing were not run. Nobody is at the prompt, the task is read-only and the one file written sits outside the repository.
