# Build-Readiness Review: The Eleven Phase Plans of `003-openbot-parity-build`

**Lineage**: `devin-2` of the `003-openbot-parity-build` fan-out.
**Run**: `fanout-devin-2-1795615532231-nbblrp`, 13 iterations, stop reason `maxIterationsReached`.
**Scope**: the eleven phase plans (`001-activity-and-actor` through `011-messaging-channels`), each with `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`, reviewed against the built runtime and against each other.
**Method**: review of plans, not new design research. Every finding names the phase, the doc and line, the evidence with `[SOURCE: path:line]`, a severity (P0 blocks the build, P1 wrong or missing, P2 polish) and the exact edit that fixes it.

---

## 1. Executive Summary

The packet is structurally sound: every phase's file table names paths that exist or are created by an earlier phase, all fifteen runtime symbols the plans depend on exist, every new verb is genuinely new, every requirement has an acceptance row, and the research's ranked build order is fully covered. The defects are in the contracts between phases, not in their existence.

**Forty findings**: 2 P0, 12 P1, 26 P2. They reduce to one P0 root cause with three consequences, five phase-011 contract gaps, and a set of single-phase edits.

**The one decision that matters most**: phase 001's `SCHEMA_VERSION` bump. It contradicts phase 004's three `'2'` assertions, fails phase 004's `[P0]` checklist gate, and makes both phases' handoff criteria impossible because the runtime refuses to open an index whose stored version differs. Dropping the bump and carrying `actor` as a JSON row field — the way 004 carries its own `RunSummary` additions — closes all three at once.

**The second cluster**: phase 011's `operators.json`. The parent says no child builds it, 011 builds it, no verb writes it, and no phase normalizes actor names for the roster comparison. Four edits, three of them in 011 and one in the parent.

**Security**: two secret paths are open — the keychain's `security ... -w <value>` argv exposure that the vault phase accepts rather than fixes, and the conversation JSONL plus the captured `stdout.log` in the run folder, neither of which is in the vault's literal-check list. A bot that prints its environment writes the value into a file the vault promised would never hold it.

---

## 2. Research Question

Do the eleven phase plans, written in parallel and never checked against the built runtime or against each other, hold up as a build plan for a small team? Four angles:

1. **Plan versus runtime** — do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable?
2. **Cross-phase consistency** — do the phases agree on shared records, and are the build order and dependencies sound?
3. **Parity gaps and overbuild** — what is still missing after all eleven phases, and what is built twice or not needed?
4. **Security and failure modes** — secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages, concurrent approvals, prompt injection, routine `until` and fatigue.

---

## 3. Findings by Phase, Ranked

### 3.1 P0 — Blocks the build (2 findings, one root cause)

**P0-1. Phase 001 and phase 004 contradict each other on `SCHEMA_VERSION`, and the contradiction reaches a `[P0]` task gate and both phases' handoffs.**
- Phase 001's plan says the index "gains the `actor` column and a `SCHEMA_VERSION` bump" and its verify expects `'3'` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:76]`; its task T012 requires `'3'` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md:54]`.
- Phase 004 asserts `'2'` in its plan, its T007 setup check, its T030 "Prove no schema version moved" and its `[P0]` CHK-011 `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:49]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:86]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:141]`.
- The runtime holds `'2'` today `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55]` and `openIndex` throws `schema version <n> is not <current>` when the stored value differs `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:253]`; `status.ts` turns that into `index-unreadable` with the hint `run bots status --rebuild` `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:323]` `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:350]`.
- Both handoffs are therefore impossible as written: 001's "`bots status` still reads an index built before the schema bump" `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:30]` and 004's "an index built before the change still opens without `--rebuild`" `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:32]`.
- **Fix**: remove the bump from `001/plan.md:60,76` and `001/tasks.md:54`, and add one sentence that `actor` rides the index's JSON row the way `RunSummary` does. This makes 004's `'2'` assertions true, keeps both handoffs valid and removes the only P0.

### 3.2 P1 — Wrong or missing (12 findings)

**Phase 011 — messaging channels (4)**
- **P1-2. `operators.json` contradicts the parent scope.** The parent says "No child builds them; 001 lands the actor field alone" `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:94]`, while 011 lists the roster as a deliverable and makes REQ-005 depend on `owner` or `members` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:59]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:133]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177]`; 011 acknowledges the deviation in its decisions `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:281]`. **Fix**: amend `spec.md:94` to say phase 011 lands the minimal two-role roster, and add `operators.json` to the phase-map row 11.
- **P1-3. `operators.json` has no write path.** 011's verbs are `channel list|link|unlink|send|listen|drain`; none adds or removes a roster member, and no path or format is named `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:59]`. **Fix**: add `bots channel roster add|remove <actor> [--role owner|member]` at `<stateRoot>/<identity>/operators.json`, or document the exact path, JSON shape and creation rule plus an acceptance row for a hand-written second member.
- **P1-4. Four `[P0]` checklist rows have no verify command.** `CHK-001`, `CHK-002`, `CHK-020` and `CHK-021` are bare statements `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:153]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:154]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:174]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md:175]`. **Fix**: add the REQ count (19), the file-table count, the `Unmet` count (0) and `npx vitest run tests/channel-conformance.vitest.ts`.
- **P1-5. Concurrent approvals from the terminal and a chat can silently discard the first answer.** `answerItem` reads the item, checks state, then writes, with no lock or compare-and-swap `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:65]` `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:84]`; 006 adds `--scope` to the same path and 011 calls `answerItem` directly `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:149]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:90]`. The resume is deduped by item id `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:105]`; the recorded decision is not. **Fix**: a guarded write (lock file or write-if-unchanged on `answer` plus `answeredAt`) in 006's requirement and 011 REQ-005, plus a concurrent-answer test.

**Phase 005 — memory (2)**
- **P1-6. `--as` is in scope and in REQ-001 but absent from 005's plan and tasks.** The spec lists it three times `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:51]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:93]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:144]`, the acceptance table exercises only the OS-user path `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/acceptance-criteria.md:54]`, and the CLI rejects an option a verb spec does not list `[SOURCE: .skilled/bin/bots.cjs:64]`. **Fix**: add a task adding `as` to `remember`'s options and one acceptance row that reads the actor back through `--list --json`.
- **P1-7. The memory-proposal item contradicts itself on the proposing bot.** REQ-007 says it carries the proposing bot, REQ-008 appends to that bot's file, and REQ-009 says it "holds no bot" `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:151]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152]`; `holdForBot` selects by `botId` and open state with no kind check `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:287]`. **Fix**: carry the proposing bot in `proposalBotId` and a `kind` of `memory-proposal`, and make `holdForBot` and `itemAwaitingResume` skip that kind.

**Phase 003 — terminal screen (1)**
- **P1-8. The terminal's `a` (always) and `n` (deny) keys record scope `once`.** 003 maps them to answer text only `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:166]`, its plan writes only `bots answer` with no option `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:87]`, and 006 records scope from `--scope`, defaulting to `once` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:149]`. **Fix**: 003 writes `bots answer <id> <text> --scope once|always|deny`.

**Phase 006 — approval grants (1)**
- **P1-9. Phase 006's five-rung ladder has no store for rungs 2-5, and `--scope always` is per-item only.** The phase states that no rules store, auto-review switch or extra-vigilant switch exists `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:103]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]`, while REQ-003 walks all five rungs and SC-003 tests them `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:147]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:173]`. **Fix**: land a minimal per-bot `rules.json` that rung 2 reads, or rename the scope to `resume` and state the per-item semantics in REQ-005, the help text and the inbox line.

**Phase 008 — vault (2)**
- **P1-10. The default keychain path exposes the secret in `security`'s argv.** The risk row accepts the `ps` exposure and mitigates only by documenting it `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:189]`, while the keychain is the default on macOS `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:148]`; the decision record accepts the exposure `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:243]`. **Fix**: pass the value on the child's stdin (`security` prompts when `-w` carries no argument) and add an acceptance row that samples the process table during a set.
- **P1-11. The "never the run folder" promise is unenforceable because the child's stdout is captured there.** The runner sets `stdoutLogPath: join(runFolderPath, 'stdout.log')` `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1062]` and the dispatcher writes the child's output there `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:618]`; a bot that prints its environment writes the value in plaintext. **Fix**: add a post-run redaction pass over `stdout.log` with `collectKnownSecrets`, replacing matches with `[redacted: <name>]` and recording the redaction, plus a fixture-bot acceptance row.

**Phase 010 — conversations (1)**
- **P1-12. The conversation JSONL is outside the literal-check list.** NFR-S02 checks the human message before dispatch `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:209]`, but REQ-001 appends before dispatching `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148]` and nothing checks the bot reply; 008's check covers a body, a question, an answer, a request prompt and a delivery message, none of which is a conversation message `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:160]`. **Fix**: check before append for both roles — a matching human message is not appended and the run is refused; a matching bot message is appended with `[redacted: <key>]` and the match recorded.

### 3.3 P2 — Polish (26 findings)

**Cross-cutting (parent spec)**
- **Phase-count metadata stops at ten while an eleventh phase exists.** 001-010 say "Phase N of 10" and 010 says `Successor | None` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:28]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:30]`, while 011 says `11 of 11` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:32]` and the parent map has eleven rows `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:131]`. **Fix**: change "of 10" to "of 11" and set 010's successor.
- **The `.opencode/bin/bots.cjs` mirror row is missing from six phases.** 003/010/011 list both copies `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:143]`; 001/002/005/006/008/009 list only `.skilled` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:118]`, though the files are byte-identical and 003's plan says the mirror is wholesale `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:31]`. **Fix**: add the mirror row or state that a sync step owns it.
- **`THIRD_PARTY_NOTICES.md` is claimed `Create` by four phases.** 001 creates it `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:130]`; 006, 008 and 010 also say `Create` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:132]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:133]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:135]`, while 011 correctly says `Modify` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:160]`. **Fix**: change 006/008/010 to `Modify` with an append description.
- **The parent notice row names the wrong phases.** It lists "001, 002, 008, 009, 010" `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:109]`; 002 has no notice requirement and 009 explicitly decides none `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:254]`, while 006 and 011 require notices `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:159]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:65]`. **Fix**: change the list to "001, 006, 008, 010, 011".
- **No phase owns backup, restore or export of the state root.** The root now holds routines, memory at both levels, secrets, proposals, conversations and channels `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117]`, and no phase or parent section says how it is backed up or restored. **Fix**: add a "State root backup and restore" section to the parent spec with the paths, the 0600 secrets exception and one procedure.

**Phase 001**
- **The run-record field is `by:` in the plan description and `actor` everywhere else, and its group is unnamed.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:3]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:147]`; `RunRecord` is eight named groups `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:218]`. **Fix**: change the description to `actor` and name the group.
- **The activity JSON names no row field, so 003's markers have no input.** 001's groups carry "id, title and rows" `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:144]`; 003 needs a per-row status `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:165]`. **Fix**: name `runId`, `botId`, `status`, `actor`, `at` in REQ-002.
- **The inbox JSON names fields in prose ("bot", "timestamps") rather than keys.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:145]` vs the item keys `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29]`. **Fix**: use `botId`, `createdAt`, `expiresAt` in REQ-003.
- **Actor names have no comparison rule shared with 011's roster.** 001 fills `by` from `--as` or the OS user `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146]`; 011 compares against `operators.json` with no case or trim rule `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md:58]`. **Fix**: state the trim and case rule in both.
- **Phase 001's handoff requires a pre-bump index to open** — see P0-1.

**Phase 002**
- **No misfire policy for a routine start missed while the host slept or the agent restarted.** `starts[0]` renders into the existing trigger `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:160]`; the matrix covers `until` outcomes and switch states `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:99]` but no missed start. **Fix**: name the policy (skip, or run once on next start) and add an acceptance row.
- **The fatigue rule never defines a refusal or a reset.** REQ-006 says ten consecutive failures disable the bot and `bots enable` restarts the count `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:165]`. **Fix**: state whether a refusal counts and whether a success resets the streak.
- **`routines --json` never names `botId`, which 003's pane requires.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:171]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:167]`. **Fix**: add `botId`.
- **The parent phase map misstates 002's dependency.** It says the fatigue switch counts 001's run rows `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122]`, while 002's plan puts the count in `routines/<bot-id>.json` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:62]`. **Fix**: correct the cell or the design.
- **`CHK-002` says "the plan" but greps `spec.md`.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md:158]`. **Fix**: relabel or point at `plan.md`.
- **`scripts/fixtures/` is marked `Create` though it exists.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:146]`. **Fix**: `Modify` plus the subfolder name.

**Phase 003**
- **Six markers do not cover seven groups.** 003 has six `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:165]`; 001 has seven `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:143]`; `scheduled` and `recurring` have no marker and `stale` has no group. **Fix**: extend the table to seven groups plus the stale header flag.

**Phase 004**
- **The notation block says two shell variables and defines three.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:29]`. **Fix**: "Three".

**Phase 005**
- **The memory-proposal item's fields are unnamed.** REQ-007 says it carries the type, fact and bot but names no key `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150]`, while the plan's rollback refers to `kind` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:150]`; `ITEM_KEYS` is explicit `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51]`. **Fix**: name `kind`, `memoryType`, `fact`.
- **Reserved-id proposal items accumulate without bound.** A memory-proposal "holds no bot" `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152]` and skill proposals use `skill-proposals` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160]`, so `holdForBot` never holds them `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:287]`. **Fix**: cap or expire open proposal items (e.g. 20 per identity).

**Phase 006**
- **`grants.rung` allows five values while the doc and handoff name four rungs.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:145]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:158]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:30]`. **Fix**: define `bot` as a fifth rung or drop it.

**Phase 008**
- **The handoff invents a dependency on 009.** It says 009 reads the secrets name grammar and store refusal ids `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:32]`, while 009 never mentions either and reuses the existing literal detector `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:169]`. **Fix**: state that nothing passes between 008 and 009.
- **`CHK-020` counts `Met` rows and expects 13, so a waiver fails the gate.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:165]`. **Fix**: use the `Unmet` count of 0, or count `Met` plus `Waived`.

**Phase 009**
- **`CHK-002` says "the plan" but greps `spec.md`.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/tasks.md:152]`. **Fix**: relabel or point at `plan.md`.
- **`scripts/fixtures/` is marked `Create` though it exists.** `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:142]`. **Fix**: `Modify` plus the subfolder name.

**Phase 010**
- **A bot message's `by` value is unspecified.** REQ-003 says every message carries `by` but defines it only for a human message `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:150]`. **Fix**: state `by: null` (or `bot:<id>`) for a bot message.
- **A lost-reply window exists between a finished run and the appended bot message.** The conversation is append-only and a torn line is skipped `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:149]`, but a crash after the run and before the append leaves no marker. **Fix**: report the gap on read, or add a `--repair` that appends from the run record.

**Phase 011**
- **Five transports in one phase is overbuild for a small team.** The scope names five `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:45]` `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:62]`, the research ranks no messaging slice `[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:137]`, and 011 says it extends the program `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:43]`. **Fix**: split into 011a (adapter, link, lockout, approval index, queue, terminal, Telegram) and 011b (Slack, Signal, WhatsApp).
- **A linked non-approver can dispatch a run but cannot answer the item it parks.** REQ-003 turns any linked message into an enqueue request `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:175]`; REQ-005 refuses the answer `[SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177]`. **Fix**: choose refusal before dispatch or announce the item to every roster member, and add an acceptance row.

---

## 4. Cross-Phase Conflict List

Conflicts where two documents make incompatible claims about the same thing:

| # | Phase A | Phase B | Conflict | Severity |
|---|---------|---------|----------|----------|
| 1 | 001 | 004 | `SCHEMA_VERSION` `'3'` vs `'2'`; both edit `status-index.ts`, and both handoffs require a pre-bump index to open | P0 |
| 2 | 003 | 006 | The terminal's `a`/`n` keys pass answer text only; 006 records scope from `--scope` and defaults to `once` | P1 |
| 3 | parent | 011 | Parent says no child builds `operators.json`; 011 lands it and depends on it | P1 |
| 4 | 001 | 003 | 001's activity JSON names no row status; 003's six markers need one | P2 |
| 5 | 002 | 003 | 002's `routines --json` names no `botId`; 003's pane requires it | P2 |
| 6 | 001 | 003, 011 | 001's inbox JSON names "bot" and "timestamps"; consumers parse `botId`, `createdAt`, `expiresAt` | P2 |
| 7 | 008 | 009 | 008's handoff claims 009 reads the secret grammar and refusal ids; 009 does neither | P2 |
| 8 | parent | 002, 006, 009, 011 | The parent notice row names two phases without a notice and omits two with one | P2 |
| 9 | 001 | 011 | No shared actor-name normalization between `--as`/OS user and the roster comparison | P2 |

---

## 5. Verified Strengths

These were tested and found sound; they are not findings:

- **Every `Modify` path exists** today or is created by an earlier phase; no forward file dependency exists.
- **Every planned symbol exists**: `buildBotPrompt`, `runPrecheck`, `summarizeRecord`, `buildResumedPrompt`, `openIndex`, `ensureIdentityState`, `sharedStatePaths`, `identityStatePaths`, `findSecretLiteral`, `collectKnownSecrets`, `enqueueRequest`, `writeNeedsYouItem`, `readNeedsYouItem`, `needsYouState`, `DELIVERY_CHANNELS`.
- **Every new verb is genuinely new**: `VERB_SPECS` holds exactly the eleven verbs the phases claim `[SOURCE: .skilled/bin/bots.cjs:64]`.
- **The acceptance layer is complete**: every `REQ` has one or more `AC` rows and no `AC` cites a missing `REQ` (7/7, 10/10, 15/15, 9/9, 12/12, 11/11, 9/12, 13/13, 10/10, 11/11, 19/19).
- **The state-root folder list has no collision**: `routines`, `memory` at both levels, `secrets`, `proposals`, `conversations` and `channels` are distinct names through `state-root.ts` `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117]`.
- **`HonoredPosture` needs no validator change** for `apps` or `secretsUsed`: `validateRunRecord` checks group presence and named fields, never the posture keys `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:240]`.
- **`BotDefinition`'s key additions do not collide**: `routine`, `memory`, `apps` and `skills` are four distinct new keys; 008 adds none because `secrets` already exists `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92]`.
- **Phase 011's restart handling is file-backed and tested**: the approval index survives a restart (SC-003), the queue records an uncertain send `unknown` and never retries (SC-005), and the lockout is file-backed.
- **Duplicate messages and answers do not double-dispatch**: the human message id is the request event id, and `answerItem` derives the resume request id from the item id `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:105]`.
- **`holdForBot` prevents real-bot item pile-up**: it holds a bot while one of its own items is open `[SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:287]`.
- **The filtered UTCP config carries references, not values**: `.utcp_config.json` holds `"${FIGMA_API_KEY}"` and `"${GITHUB_PERSONAL_ACCESS_TOKEN}"` `[SOURCE: .utcp_config.json:130]` `[SOURCE: .utcp_config.json:149]`.
- **The research's ranked order is fully covered**: items 1-10 map to phases 001-010 (003 moved up by the operator decision), and item 11 (desktop shell) is correctly not built `[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:141]`.

---

## 6. Fix Order

1. **Phase 001 schema decision** — remove the bump, carry `actor` as a JSON row field. Clears 2 P0 and 1 P1.
2. **Phase 011 roster and checklist** — parent scope sentence, `roster add|remove`, four verify commands. Clears 4 P1.
3. **Phase 005 `--as` and proposal item** — the missing option task, `proposalBotId`/`kind`, named fields. Clears 2 P1.
4. **Phase 003/006 scope** — pass `--scope` from the terminal; decide the ladder's rule store or rename `always`. Clears 2 P1.
5. **Phase 008/010 secret paths** — stdin to `security`, post-run `stdout.log` redaction, conversation literal check. Clears 2 P1.
6. **Parent metadata rows** — phase count, `.opencode` mirror, notice row, backup section. Clears 5 P2.
7. **Remaining single-phase P2s** — the JSON key names, the misfire and fatigue rules, the proposal cap, the checklist count forms.

---

## 7. Parity Gaps and Overbuild

- **Gap**: no state-root backup, restore or export. The root now holds the team's memory, conversations, secrets index, channel links and routine state, and no phase documents how it survives a lost laptop.
- **Overbuild**: phase 011's five transports. The adapter contract plus the terminal plus Telegram proves the design; Slack, Signal and WhatsApp are three wire protocols and three test suites in one phase.
- **Overbuild**: phase 006's five-rung ladder with no store for four rungs. The test supplies inputs the product cannot.
- **Not overbuild**: phase 003's Rust TUI (a recorded operator decision with the GPL alternative rejected) and phase 008's four modules (a mirror of rakazo's liftable vault layer).

---

## 8. Security and Failure Modes

- **Secret paths open**: `security ... -w <value>` argv (008), the conversation JSONL (010), and the run folder's captured `stdout.log` (008's promise vs `runner.ts`).
- **Secret paths closed**: the run record (`DispatchSnapshot` has no env), the filtered UTCP config (`${VAR}` references), `bots secret list` (names only), and outbound delivery (`delivery.ts` literal check).
- **Concurrency**: concurrent terminal and chat answers race on the item file; the resume is deduped, the recorded decision is not.
- **Prompt injection**: no phase states an untrusted-content boundary for memory, skill bodies, chat transcripts or channel messages; the bot body and protocol are not declared authoritative over them.
- **Restarts**: the approval index, lockout and send queue are file-backed and tested; the conversation's lost-reply window and the routine's missed-start policy are not covered.
- **Fatigue**: the ten-failure switch has no refusal/reset definition, and reserved-id proposal items escape `holdForBot` entirely.

---

## 9. Divergence Map

- **Completed pivots**: 0. **Failed pivots**: 0. **Audited overrides**: 0.
- **Saturated directions**: none. The frontier's two nodes (cross-phase records and failure modes) were answered in iterations 1-3; the run then broadened through the four topic angles (plan-vs-runtime file layer, shape layer, JSON contracts, build order, handoffs, parity, security) under the `max-iterations` stop policy.
- **Remaining frontier**: none open; the review's remaining uncertainty is named in Open Questions.

---

## 10. Open Questions

1. **The Rust crate's verify commands were not run.** No `cargo` build was executed; the crate's paths and `DEFAULT_SKILLED_TREE` resolution were read, not compiled.
2. **The channel transports' wire behavior was not tested against providers.** The review read the plans' claims about Telegram, Slack, Signal and WhatsApp; it did not exercise them.
3. **The `security` stdin behavior was not exercised.** The fix for the argv exposure is stated as a behavior the phase must verify.
4. **The `stdout.log` leak was established from the path construction and the capture call**, not from an observed log.
5. **The shared-host model remains a declared non-goal.** Nothing in this review changes that; `operators.json` is the minimal roster a channel needs, not a shared-host identity model.

---

## 11. References

- Phase docs: `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor` through `011-messaging-channels`, each with `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`.
- Runtime: `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`.
- Parity synthesis: `specs/system-skilled-bots/002-openbot-parity-research/research/research.md`.
- Iteration evidence: `iterations/iteration-001.md` through `iteration-013.md`; deltas `deltas/iter-001.jsonl` through `iter-013.jsonl` (40 canonical finding rows).
- Registry note: `findings-registry.json` lists 45 key findings; five are "Verified" observations numbered inside the Findings sections of iterations 6, 7 and 12. The canonical finding set is the 40 delta rows.

---

## Appendix: Convergence Report

- **Stop reason**: `maxIterationsReached` (13 of 13).
- **Iterations**: 13.
- **Frontier questions answered**: 2 of 2 (F-1-002 cross-phase shared records, F-1-006 failure modes); 0 remaining.
- **Findings**: 40 (2 P0, 12 P1, 26 P2).
- **Convergence threshold**: 0.05 (telemetry only; the stop policy is `max-iterations`).
- **Last three iterations**: iteration 11 (closure layer, 3 findings, ratio 1.0); iteration 12 (run folder and child environment, 1 finding, ratio 1.0); iteration 13 (consolidation, 3 findings, ratio 0.6).
- **Divergence summary**: no pivots; two frontier nodes answered, then the four topic angles covered by iterations 3-12. Segment transitions, wave scores and checkpoint metrics are experimental and omitted.
