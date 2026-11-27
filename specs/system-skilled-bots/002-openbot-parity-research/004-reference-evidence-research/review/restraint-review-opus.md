# Overengineering review of the final recommendations

Judged against `.skilled/repo-rules/prevent-overengineering.md` (the reversal-cost order in section 1, the option, test and fallback restraints in section 4) and the Restraint Signals table in `AGENTS.md` section 3.

Path prefixes in citations:

- `B/` is `specs/system-skilled-bots/003-openbot-parity-build/`
- `L/` is `.skilled/skills/system-skilled-bots/runtime/lib/`
- `T/` is `.skilled/skills/system-skilled-bots/runtime/tests/`
- `R4/` is `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/`

I opened every cited line myself. A claim the lines do not state is marked "inferred".

## 1. Verdict

Half the list does not earn its place now. I split the list into 68 units: 18 from the eight top guards, 34 from the per-phase list and the 16 net-new features. Of these, 21 are keep, 2 are promote, 11 are shrink, 15 are defer and 19 are drop. The eight top guards mostly hold, because each names a failure the plan has today, such as a paste that approves an item, a resend of chunk 1 or a CHK-012 that cannot pass. The waste follows one pattern. The research imports a reference mechanism whose failure needs a surface this runtime lacks: a routine tool, a tool-call surface, a rules store, an async dispatch or a multi-tenant relay. The research itself says none of the sixteen net-new features is needed for parity [SOURCE: R4/research.md:527]. Beside that sit new tests that repeat an existing test or re-check the language, and new refusal names, notice entries or stored fields where an existing path or a smaller form does the same job. The opposite error is small. Two cheap fixes are understated: a clean-room line is missing from 011's dispatch rules while its workers read GPL source, and a GPL mis-citation sits in a second file.

## 2. Changes to make

Most consequential first. Each entry gives the class, the reason, the evidence and the revised wording.

### 2.1 005 stable short id per memory entry: shrink

Reason: the failure is real, because one operator who forgets 3 and then 5 from the same `--list` removes the wrong fact. An id derived from the line's bytes fixes the shift without the stored sixth field and its byte cost.

Evidence: indexes shift down after every forget [SOURCE: B/005-memory/spec.md:152] [SOURCE: B/contracts/records.md:266]. A stored id changes the shared five-field line and spends bytes against the 3,600-byte cap [SOURCE: B/005-memory/spec.md:150]. The derived id still changes the `--list --json` entry shape (one new field), REQ-005's argument and the `memory-entry-unknown` text [SOURCE: B/005-memory/spec.md:151-152]. It saves only the records.md change and the byte cost. The two-forget race stays accepted [SOURCE: B/005-memory/design/module-contract.md:95].

Revised wording: "005: `--list` prints a short id derived from each entry line, the first 8 hex of its SHA-256, and `--forget <id>` removes the entry whose line hashes to it. The entry line keeps its five fields and nothing new is stored. REQ-004's JSON entry gains the id, and REQ-005 and `memory-entry-unknown` take an id. Two identical lines share an id and either may go. The two-forget race stays accepted."

### 2.2 011 clean-room rule for workers: promote

Reason: GPL text in an MIT build is a real licence failure, and the guard is one dispatch line. The research's `comm -12` check over `lib/` should go, because a Rust source and a TypeScript build share no verbatim lines, so it would pass whatever happened (inferred from the two languages).

Evidence: child 005's wave 0 sends workers into the tinychannels source [SOURCE: B/011-messaging-channels/005-polling-transports/tasks.md:38-39]. The rules every 011 worker carries name no clean-room rule [SOURCE: B/011-messaging-channels/003-link-roster-and-answer-gate/plan.md:206-212]. Phase 003 already states the rule [SOURCE: B/003-terminal-screen/001-ux-and-component-map/plan.md:168].

Revised wording: "011: add phase 003's rule to the 011 dispatch rules. A worker that writes a `lib/channel*.ts` module gets our design files and MIT or Apache references only, and tinychannels paths appear only in design documents as provenance. No line-copy check over `lib/`."

### 2.3 Net-new 6, stall watchdog: drop

Reason: it needs a watcher process or an async dispatch in a module `system-deep-loop` owns, so it crosses a skill boundary to save time an existing bound already caps. An author who wants a shorter hold can lower the bot's own timeout today.

Evidence: the dispatch blocks the event loop, so no heartbeat lands during a run [SOURCE: L/runner.ts:892-893]. The default timeout is 900 seconds [SOURCE: L/definition.ts:82]. `budget` is a BOT.md key whose `timeoutSeconds` the parser reads per bot [SOURCE: L/definition.ts:96] [SOURCE: L/definition.ts:178-187].

Revised wording: "Remove from the list. A bot that should give up sooner sets a lower `budget.timeoutSeconds` in its BOT.md. Revisit only if dispatch becomes async for its own reason, when a stall timer is cheap."

### 2.4 Net-new 1, hourly run cap per bot: defer

Reason: it adds a BOT.md option, a run count and a refusal name, and an option earns its place only when two real callers need different values today. The loops the research names are already closed, including the git-hook loop.

Evidence: one run per bot holds the lease at a time [SOURCE: T/runner-kill.vitest.ts:43-47]. The post-commit hook skips the bots leg when `SKILLED_BOT_RUN_ID` is set [SOURCE: .skilled/scripts/git-hooks/post-commit:133], and dispatch sets that marker on every child [SOURCE: L/dispatch.ts:341], so a bot's own commit enqueues nothing. Cron has a 15-minute floor [SOURCE: B/002-routine-layer/spec.md:172]. The reference caps tool actions, not runs [SOURCE: R4/research.md:489].

Revised wording: "Deferred. Trigger: a measured run loop or a cost surprise that the lease, the post-commit run-marker skip, the 15-minute floor and fatigue all fail to stop, most likely once 011 links a busy group chat."

### 2.5 008 encoded forms in the leak scan: shrink

Reason: the gap is real, but an unpadded base64 string is a substring of its padded form, so one unpadded entry covers both. The lowercase hex form earns its place because it is the vault's own stored form.

Evidence: the scan holds plain, standard base64 and `encodeURIComponent` [SOURCE: B/008-vault/design/leak-checks.md:73]. The keychain item holds lowercase hex [SOURCE: B/008-vault/design/backends.md:41], while hex sits in the accepted residuals [SOURCE: B/008-vault/design/leak-checks.md:108]. The matcher is one pass, so each added form is one list entry [SOURCE: B/008-vault/spec.md:167].

Revised wording: "008: scan unpadded standard base64 in place of the padded form, unpadded URL-safe base64, lowercase percent-encoding, form encoding with a space as `+`, and the lowercase hex form the vault stores. Each unpadded form also matches its padded copy as a substring. Move hex out of the residual row at leak-checks.md:108."

### 2.6 011 Slack label over 75 characters: shrink

Reason: a refusal would withhold the approval prompt and add a refusal name, while the numbered text form already exists for a channel without buttons. Keep the 3,000-character cut, because a longer last chunk is a real send failure.

Evidence: Slack is cut at 3,900 today [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md:63]. `delivery.ts` already queues the M01 text form when a channel lacks buttons [SOURCE: B/011-messaging-channels/004-approval-index-and-send-queue/spec.md:131]. That the choice can be made per prompt as well as per channel is inferred, because today it is made per channel capability.

Revised wording: "011: cut the button-bearing Slack chunk at 3,000 characters. A prompt with an option label over 75 characters is sent on Slack in the numbered text form, M01, and no new refusal name is added."

### 2.7 Net-new 2, merge quick group-chat messages: defer

Reason: it adds a hold state, a window timer and a new outcome value for a cost nobody has measured. Runs for one bot are serial behind its lease, and each chat run reads the newest 40 messages, so a later run sees the earlier fragments (inferred from that window).

Evidence: the conversation block holds the newest 40 messages or 8,000 characters [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:164]. The research places the harm "in the first week of 011", a prediction rather than a failure [SOURCE: R4/research.md:490].

Revised wording: "Deferred. Trigger: 011 is in use and one ask split over quick messages is seen to start several runs that each answer a fragment."

### 2.8 Net-new 11, instant acknowledgement for long requests: drop

Reason: it writes a pending line that the reply later replaces, which contradicts the append-only conversation file. 010 rules out exactly this, because a stream needs a second writer and a partial-message state.

Evidence: [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:109] [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:115].

Revised wording: "Remove from the list. It conflicts with 010's append-only file and its no-stream decision."

### 2.9 009 refuse invisible, bidi or zero-width characters: defer

Reason: it adds a refusal name against an author the plan places outside its boundary, because skill bodies are trusted content the operator wrote. No body in the tree holds such a code point today, and a blanket rule would refuse an emoji built with a zero-width joiner (inferred).

Evidence: REQ-011 says bodies are trusted repository content and not a security boundary [SOURCE: B/009-skills/spec.md:175]. `rg --pcre2` over `.skilled/skills` for U+200B to U+200F, U+202A to U+202E, U+2066 to U+2069 and U+FEFF in `SKILL.md` exited 1 with no match. The gitignored `local-webflow` folder is a symlink into the operator's own project (`ls -l`), so it is operator-authored and does not count as an unreviewed source.

Revised wording: "Deferred. Trigger: a skill body the operator did not author can load, such as skills fetched from elsewhere or a list tier that loads bodies on demand. Then refuse bidi controls and zero-width characters outside emoji sequences, with a refusal name of its own."

### 2.10 002 OpenBot's firing frame: defer

Reason: the failure it fixed in OpenBot needs a routine tool the model can call, and this runtime offers none. Adding it changes the prompt contract, every prompt golden and the notices file for a failure nobody has seen here.

Evidence: the research marks the misreading here as inferred for that reason [SOURCE: R4/research.md:113]. The preamble already says the run is non-interactive [SOURCE: L/dispatch.ts:322]. A resume re-sends the parked prompt without recomposing it [SOURCE: B/contracts/prompt-sections.md:150], so if this is ever built the resume half needs no test of its own.

Revised wording: "Deferred. Trigger: a schedule-sourced run is recorded `completed` with no work done, or a child gains a tool that manages routines. Then add one sentence in our own words to the schedule-sourced preamble, with no notice entry and no separate resume test."

### 2.11 003 sanitizer citation: promote

Reason: a builder who follows openhuman's `theme.rs` citation lands on a filter that drops control characters and keeps line feeds, where the plan's rule replaces each one with `?`. The research names one place, and the same citation backs the one sanitizer in a second place, so both lines need the fix at no cost.

Evidence: [SOURCE: B/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:79] [SOURCE: B/003-terminal-screen/005-answer-flow/spec.md:212]. 004-panes REQ-021 already cites turnstone for the rule [SOURCE: B/003-terminal-screen/004-panes/spec.md:160].

Revised wording: "003: fix the sanitizer citation at component-inventory.md:79 and at 005-answer-flow spec.md:212. Name turnstone's `show_controls` as the replace-family source and state its line feed and tab difference. Name openhuman's `safe_text` as the filter a builder must not simplify to."

### 2.12 bots chat bracketed paste: defer (the screen half is kept in section 3)

Reason: the three-runs claim for the readline loop is unprobed inference, so a cheap probe should come before a bracketed-paste parser in Node. The chat pane is drawn by the screen, so the screen's fix covers it once the reducer accepts a paste into the pane's draft.

Evidence: the research marks the loop claim inferred with no probe [SOURCE: R4/research.md:349]. The loop is a readline loop in the verb [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:156]. The pane is part of the screen and spawns the verb with `--message -` [SOURCE: B/010-conversations/001-chat-ux-and-pane-map/design/pane-contract.md:26]. That the pane reads keys through the screen's crossterm source is inferred from that.

Revised wording: "010: the screen's paste rule also covers the chat pane draft. For the `bots chat` readline loop, first run one probe that pastes three lines. Build bracketed paste in the loop only if that probe starts more than one run."

### 2.13 002 one-hour floor for tell routines: shrink

Reason: a second floor value is a new branch in the checker and the installer that no caller needs. The real defect is the deferral reason, which is untrue because the floor check reads the cron period and not a store.

Evidence: [SOURCE: B/002-routine-layer/spec.md:120] [SOURCE: B/002-routine-layer/spec.md:172].

Revised wording: "002: keep the one 15-minute floor for every cron start. Rewrite the out-of-scope reason at spec.md:120: the author sets a tell routine's cadence in an approved BOT.md, and no caller needs a second floor."

### 2.14 013 generate the help text from the verb table: defer

Reason: 013 already checks at close that the help lists every verb, and no verb is planned after 013, so the remaining drift is a future caller. Generating the block means moving every hand-wrapped description into `VERB_SPECS`, which is past 013's "help block only" scope.

Evidence: [SOURCE: B/013-skilled-and-doc-alignment/tasks.md:66] [SOURCE: B/013-skilled-and-doc-alignment/plan.md:109] [SOURCE: .skilled/bin/bots.cjs:19-55] [SOURCE: .skilled/bin/bots.cjs:64-76].

Revised wording: "Deferred. Trigger: a verb added after 013 is found missing from `--help`. Then add one persistent test that the `USAGE` verb lines equal the `VERB_SPECS` keys, which is cheaper than generating the block."

### 2.15 006 credit docs/approvals.md not tool-name.ts: shrink

Reason: the plan already decided the fallback, and it drops the notice entry. Pointing the notice at a prose doc adds an entry for a file nobody lifts.

Evidence: "The notice entry is then dropped" [SOURCE: B/006-approval-grants/plan.md:151]. REQ-010 names `tool-name.ts` today [SOURCE: B/006-approval-grants/spec.md:173].

Revised wording: "006: take plan.md:151 as written. Drop REQ-010's notice entry and the AC-010 and T040 rows, because no file is lifted."

### 2.16 001 MIT notice for activity-rows.ts: shrink

Reason: none of the file's three rules has an input in the design, so no code is lifted. Naming an idea only to justify a notice is backwards.

Evidence: [SOURCE: B/001-activity-and-actor/spec.md:179] [SOURCE: R4/research.md:101].

Revised wording: "001: drop `shared/activity-rows.ts` from REQ-006, AC-006 and T028. The notice names `activity-groups.ts` only."

### 2.17 009 OpenGhost's two skill-folder lines: shrink

Reason: relative links in a body resolve against the wrong folder today, so the line is needed. Copying OpenGhost's lines would trigger the notice entry the phase decided to avoid, while our own words do not.

Evidence: [SOURCE: B/009-skills/spec.md:112] [SOURCE: B/009-skills/spec.md:266].

Revised wording: "009: add to the `<skill_content>` block one line in our own words that names the skill's directory and says relative paths in the body resolve against it. Copy no line of `skills.js`, so no notice entry is needed."

### 2.18 009 symlinks: shrink

Reason: the defect is a false sentence, because a symlinked skill folder does leave the tree. The loader reads the bytes it follows and the digest pins those bytes, so resolve logic and a recorded resolved path guard nothing today.

Evidence: the design says no name can leave the skills folder [SOURCE: B/009-skills/design/state-machines.md:64], and `.skilled/skills/local-webflow` is a symlink outside the repository (`ls -l`). The digest pin is REQ-011 [SOURCE: B/009-skills/spec.md:175].

Revised wording: "009: correct state-machines.md:64. A name cannot leave the skills folder by its grammar, but a symlinked folder is followed on purpose, and the digest pins the bytes actually loaded."

### 2.19 011 map every Slack and Telegram error: shrink

Reason: the part that can double-send is guard 2. A per-code table with the reference's four transient codes guards cases one default line already settles.

Evidence: the Slack row names only `429` and `ratelimited` [SOURCE: B/011-messaging-channels/005-polling-transports/spec.md:100].

Revised wording: "011: for Slack and Telegram, a transport error, an unreadable `200` body and a `5xx` are `unknown`, a `429` or `ratelimited` is retryable, and every other error is `failed`."

### 2.20 002 busy firing refused, with a test: shrink

Reason: the runtime already refuses a run behind a held lease and a test already proves it. A new gate-file harness would fail for no reason the existing test misses.

Evidence: [SOURCE: T/runner-kill.vitest.ts:43-47] [SOURCE: L/runner.ts:136].

Revised wording: "002: one line in REQ-005. A fire behind a held lease is refused `lease-held` and not caught up, the same as a missed slot. Cite runner-kill.vitest.ts as its proof. No new test."

### 2.21 009 allowed-tools advisory or enforced: shrink

Reason: enforcing needs the executor's tool surface, which the build puts out of scope. Only the advisory reading fits.

Evidence: [SOURCE: B/spec.md:99] [SOURCE: B/009-skills/design/draft-template.md:79].

Revised wording: "009: say at draft-template.md:79 that `allowed-tools` is advisory for a prompt-loaded body and grants nothing at run time."

### 2.22 006 OpenBot's offer rule: defer

Reason: it rules on when a standing answer may be offered, and no standing answer can be recorded. "Copy" also implies an MIT notice for a rule that guards nothing yet.

Evidence: `always` and `conversation` are refused on every item [SOURCE: B/006-approval-grants/spec.md:164].

Revised wording: "Deferred to the rules-store packet. Add one clause to the risk row at spec.md:205: the store must refuse a standing answer for a check-in task, for a hand-off and on top of a deny."

### 2.23 006 check-in-only refusal: defer

Reason: it has the same dependency as 2.22, a store that does not exist. It fits inside that one clause.

Evidence: [SOURCE: B/006-approval-grants/spec.md:164].

Revised wording: "Deferred to the rules-store packet, inside the clause in 2.22."

### 2.24 006 removing a collaborator is share: defer

Reason: both kinds ask, so nothing runs unasked, and the label matters only once a standing answer is keyed by kind. A phrase rule is also more than a word-list change.

Evidence: [SOURCE: B/006-approval-grants/design/fixtures/action-kinds.json:19] [SOURCE: R4/research.md:231].

Revised wording: "Deferred. Trigger: a rules store keys a standing answer on `grants.kind`."

### 2.25 001 hide a working row whose run id matches an open question: defer

Reason: the double row lives in the short gap between writing the item and writing the record, and it corrects itself on the next read (inferred: the gap is short). A filter plus a test that builds that state costs more than the flicker.

Evidence: [SOURCE: L/runner.ts:1116-1120].

Revised wording: "Deferred. Trigger: a consumer of `bots activity --json` counts rows, or the screen shows the double row to an operator."

### 2.26 012 a cut-off command ends quietly, then one scenario: defer

Reason: the bots exposure is inferred, because no probe ran a bots verb. A contract rule, a scenario and a 014 check are three moves for an unseen trace.

Evidence: the research says so [SOURCE: R4/research.md:405]. 012's own pipe carries one short error line [SOURCE: B/012-manual-testing-scenarios/spec.md:75]. `rg` for `EPIPE` and `SIGPIPE` in `bots.cjs` and `L/` exited 1.

Revised wording: "Deferred. Trigger: a real `bots ... --json | head -c 100` prints a stack trace. Then add an EPIPE exit-0 handler in `bots.cjs` and one 012 scenario that cites it."

### 2.27 Net-new 4, silent health probe on bots status: defer

Reason: the read half already exists in `bots status`, and the silent-unless-changed delivery needs a channel to send to. No current requirement asks for unattended alerts.

Evidence: [SOURCE: R4/research.md:492].

Revised wording: "Deferred. Trigger: an unattended host's job is found unloaded, or its queue stalled, after the fact."

### 2.28 Net-new 5, pattern redaction of unknown secrets: defer

Reason: 008 already scans stored values and environment secrets on every run, and a pattern list brings false positives and upkeep for a path nobody has seen leak. A token in a repository file is the deeper fault (inferred).

Evidence: [SOURCE: B/008-vault/design/leak-checks.md:73].

Revised wording: "Deferred. Trigger: 011 sends to a chat whose readers are not the team, or a leak of an unstored token is seen."

### 2.29 Net-new 7, live skill-following check: defer

Reason: no planned phase can host a live-model check, and the run record holds no tool calls to score. The 009 label fix does not need it.

Evidence: [SOURCE: R4/research.md:306].

Revised wording: "Deferred. Trigger: a skill is reported ignored after 009, and a run record carries tool calls to score."

### 2.30 Net-new 8, audience labels: defer

Reason: the leak path is the verifier's own inference, and a small team's chats share members. Labels on every memory entry and conversation are a large addition for that.

Evidence: [SOURCE: R4/research.md:494].

Revised wording: "Deferred. Trigger: one bot is linked to two chats with different members, and a private fact is seen crossing between them."

### 2.31 Net-new 9, what-would-happen-if command: drop

Reason: the "why did it park" question is already answered on the item line. A new verb adds a surface for an answer that already prints.

Evidence: `bots inbox` prints the grant's kind, rung and scope [SOURCE: B/006-approval-grants/spec.md:170].

Revised wording: "Remove from the list."

### 2.32 Net-new 3, next-step text on every refusal: drop as duplicate

Reason: a table read by the CLI and the screen would be a new shared module over every refusal name. The two refusals that need a fix sentence are already items in this list, and 007 already names its fixes.

Evidence: [SOURCE: R4/research.md:499].

Revised wording: "Remove from the list. Covered by the 005 `memory-full` and 008 `secret-unknown` items."

### 2.33 Net-new 10, summaries of older chat: drop as duplicate

Reason: 010 already defers compaction to a later packet. Listing it again adds nothing.

Evidence: [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:115].

Revised wording: "Remove from the list. Already deferred at 010 spec.md:115."

### 2.34 Net-new 12 to 16: drop

Reason: office documents, URL checks, a trace replay checker, a package manifest and a tool-name wording rule each serve a case this team does not have. They serve, in order, a team that does not read markdown, outbound calls to arbitrary hosts, a multi-tenant relay, bots shared across repositories and a surface that prints tool names. This entry covers five units.

Evidence: the research's own "who notices" cells for those rows [SOURCE: R4/research.md:500-504]. Multi-tenant is on the skip list [SOURCE: B/spec.md:90].

Revised wording: "Remove all five from the list."

### 2.35 002 one fixture for the deliberate fatigue rule: drop as duplicate

Reason: AC-006 already asserts that a run refused before dispatch between two failures is not counted and stops the streak. `precheck-silent` is such a refusal.

Evidence: [SOURCE: B/002-routine-layer/acceptance-criteria.md:61] [SOURCE: L/runner.ts:139].

Revised wording: "Remove. AC-006 covers it."

### 2.36 003 check questions for secrets where written: drop as duplicate

Reason: 008's scan runs over the child's output before the decision marker is parsed, so a parked question holding a known secret is redacted before the item is written. That the question comes only from that parsed output is inferred from the order the scan states.

Evidence: [SOURCE: B/008-vault/design/leak-checks.md:71] [SOURCE: B/008-vault/design/leak-checks.md:73] [SOURCE: L/runner.ts:1116].

Revised wording: "Remove. 008 REQ-014 redacts the question before the item is written."

### 2.37 003 overlay key test: drop

Reason: exclusivity is structural, and the existing answer test already proves an unbound key records no answer. A leaked tab switch would not change which item the overlay answers (inferred).

Evidence: [SOURCE: B/003-terminal-screen/001-ux-and-component-map/design/key-map.md:32] [SOURCE: B/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:349] [SOURCE: B/003-terminal-screen/005-answer-flow/spec.md:174].

Revised wording: "Remove."

### 2.38 005 Unicode whitespace test: drop

Reason: a table over every whitespace code point re-checks JavaScript's `\s`, which the test rule forbids. The one-line rule is kept by the parser splitting on line feed.

Evidence: [SOURCE: B/contracts/records.md:266]. That `collapseText` uses `\s` is inferred from its contract [SOURCE: B/005-memory/design/module-contract.md:30].

Revised wording: "Remove."

### 2.39 008 say whether lib/secrets-guard.ts is still lifted: drop as duplicate

Reason: the answer is part of guard 3, which keeps the file. A separate item counts the same fix twice.

Evidence: [SOURCE: B/008-vault/tasks.md:79] [SOURCE: R4/research.md:290].

Revised wording: "Remove. Folded into guard 3: `lib/secrets-guard.ts` stays, holding the eight constants and `timingSafeStringEqual`."

### 2.40 010 later threads or handoffs keep the same grants and limits: drop as duplicate

Reason: the out-of-scope line already records that a handoff runs under the same grants and caps. Nothing is left to add.

Evidence: [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:111].

Revised wording: "Remove. Already at 010 spec.md:111."

### 2.41 004 cite buzz workspace_section in REQ-001: drop

Reason: no plan line claims there is no reference, so the citation fixes nothing false. The correction of the earlier synthesis already lives in the research.

Evidence: `rg` for "no reference", "none in", "counterpart" and "reference code" in 004's spec and plan found no hit.

Revised wording: "Remove."

### 2.42 007 cite OpenBot app-grant types for the later packet: drop

Reason: 007 already cites OpenBot's per-action grants and states its own choice. The finer citation belongs to the later packet's research, where it already is.

Evidence: [SOURCE: B/007-per-bot-apps/spec.md:108].

Revised wording: "Remove."

### 2.43 013 retired-names list: drop

Reason: one retired name is a case, not a pattern, and 012 already replaces it. A fourth check would also amend a frozen design.

Evidence: [SOURCE: B/012-manual-testing-scenarios/spec.md:138] [SOURCE: B/013-skilled-and-doc-alignment/design/records.md:136].

Revised wording: "Remove."

## 3. Kept as is

- Guard 1, the screen: bracketed paste on in the guard, a paste only appends to a draft and never sends, and one test feeds `Paste("y\n")`. A pasted `y` approves today [SOURCE: B/003-terminal-screen/005-answer-flow/design/state-machines.md:41], and the event source has no paste [SOURCE: B/003-terminal-screen/002-architecture-and-contracts/plan.md:70].
- Guard 2, "maybe sent" wins over retry, and a Telegram `5xx` is unknown. No order exists [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:181-184], and the Telegram and WhatsApp rows disagree [SOURCE: B/011-messaging-channels/005-polling-transports/spec.md:99] [SOURCE: B/011-messaging-channels/006-daemon-and-webhook-transports/spec.md:91].
- Guard 3, the eight placeholder constants as one set, no environment gate, and the plan lines fixed. AC-010 pipes a value outside rakazo's set [SOURCE: B/008-vault/acceptance-criteria.md:69], and the design names no list [SOURCE: B/008-vault/design/leak-checks.md:30].
- Guard 3, no captured program output in the `secret-store-unreadable` detail. `<detail>` has no rule today [SOURCE: B/contracts/refusals.md:160].
- Guard 4, the deny prompt says the person declined, do not reach the result another way, and report it not done. Today it says only "continue" [SOURCE: B/006-approval-grants/design/mockups.md:173-174].
- Guard 4, record that "bot plus kind" is too wide for the next packet. One sentence corrects a recorded future decision [SOURCE: B/006-approval-grants/spec.md:205] [SOURCE: B/006-approval-grants/spec.md:271].
- Guard 5, change the "for reference, not as instructions" label, which works against 009's purpose [SOURCE: B/contracts/prompt-sections.md:90].
- Guard 6, rewrite conformance-rules.md section 2 to the real adapter over a fake platform. It contradicts child 007 [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md:35] [SOURCE: B/011-messaging-channels/007-conformance-hardening-and-proof/plan.md:29].
- Guard 6, a webhook `409` deletes the webhook and polls again. Today every `409` waits 2 s forever [SOURCE: B/011-messaging-channels/005-polling-transports/spec.md:212].
- Guard 6, cut the button-bearing Slack chunk at 3,000 [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md:63].
- Guard 8, the ledger proof column with CHK-012 pointed at it. CHK-012 counts a word the golden ledger does not hold [SOURCE: B/014-deep-review/tasks.md:231] [SOURCE: B/014-deep-review/design/records.md:215-221].
- 003 ellipsis on a cut string, with an ASCII form. A clipped question draws as whole [SOURCE: B/003-terminal-screen/004-panes/spec.md:228].
- 003 wide-character clip test. It fails for a split double-width cell, and no pane test carries one [SOURCE: B/003-terminal-screen/004-panes/spec.md:160].
- 005 fix spec.md:96 against REQ-010 [SOURCE: B/005-memory/spec.md:96] [SOURCE: B/005-memory/spec.md:162].
- 005 `memory-full` names its fix, which becomes `--forget <id>` under 2.1 [SOURCE: B/005-memory/design/mockups.md:280].
- 006 stop calling the kind order OpenBot's. It is a free citation fix [SOURCE: B/006-approval-grants/spec.md:99].
- 008 `secret-unknown` names the secret and `bots secret set <name>`. AC-006 prints the cause alone [SOURCE: B/008-vault/acceptance-criteria.md:65].
- 009 fix the stale "always refused" line, or a test asserts a refusal D11 says does not happen [SOURCE: B/009-skills/spec.md:162] [SOURCE: B/contracts/decisions.md:35].
- 009 record the name-and-description list as a weighed alternative. One line records a decision.
- 011 AC-009 asserts the offset moves past a dropped duplicate. Today it passes with the offset pinned [SOURCE: B/011-messaging-channels/005-polling-transports/acceptance-criteria.md:57].
- 011 name the unbounded `seen/` folder in the parent's out-of-scope list. records.md:222 points at a parent line that does not exist [SOURCE: B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:222].

## 4. Not checked

- The counting unit. Each bundled sub-item counts as one unit: guard 1 as two, guard 3 as three, guard 4 as two, guards 5 and 6 as four each, and the others as one. The 34 per-phase items and the 16 net-new features count as listed. That is 68 units.
- I ran no probe: not the chat paste, not EPIPE on a bots verb, not Node readline's paste handling.
- I did not open the reference repos under `specs/system-skilled-bots/context/`. Slack's 3,000 and 75 limits and the webhook `409` text rest on the research's citations of tinychannels.
- I did not check whether the decision overlay wraps or clips the whole question. If it clips, the ellipsis item matters more than its "likely" grade says.
- I did not check that Slack accepts the M01 text form for one prompt when its channel declares buttons. 2.6 marks this as inferred.
- I did not read every phase document in full, only the lines each recommendation touches.
- The verdict rests on my reading against the restraint rule. A second reviewer could move items between shrink and defer.
