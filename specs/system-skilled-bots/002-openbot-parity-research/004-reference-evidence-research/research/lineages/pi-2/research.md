# Reference Evidence for the OpenBot Parity Build: Synthesis

Lineage `pi-2`, fan-out of `/deep:research` over `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research`. Ten iterations, ten reference repositories, fourteen planned phases plus a net-new pass.

## 1. How to Read This

Two deliverables, in the order the topic asks for them. Section 3 answers question 1 — evidence per planned phase, with the file and line that implements the same thing, the licence of the source, where the plan and the reference differ and which side the evidence supports, and the failures the plan does not yet guard. Sections 4 and 5 answer question 2 — what the ten repositories carry that neither the build plan nor the parity synthesis's skip list covers, ranked by value to a small team and sized.

Every claim carries a citation and a marker. **Observed** means the cited line was read and says what the claim says it says. **Inferred** means the claim reasons from cited lines to something they do not state. Nothing here repeats a finding one of the three earlier syntheses already carries; where a finding sits beside an earlier one, the earlier finding is cited and only the increment is claimed.

The one correction a reader should know before starting: the topic's premise about `openhuman-full` is wrong in both halves. It does not carry five vendored crates — it carries twenty-one, totalling about 4.38 million lines of Rust — and `openhuman-main` does have `crates/openhuman-tui`, so the difference between the trees is that `openhuman-full`'s workspace resolves and builds, not that it adds a crate. [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:21-25] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates:1]

## 2. Bottom Line

- **The plan is not thin. It is the most specific artefact in the corpus**, and most of the ten phases this run examined already cite the reference line the phase is derived from. Twelve of this run's forty-nine findings are confirms rather than gaps, and that is the right ratio for a plan at this stage.
- **The highest-value gaps are control-flow, not features.** A 409 that clears a webhook mid-poll, an offset that must advance on a duplicate, a chunk that must be recorded as sent, a credential only the person can change: each is a branch the reference has and the plan does not, and each costs a duplicated message or a false approval if it is missed.
- **One defect is a licence trap and it is already guarded.** `tinychannels-main` and `openhuman-main`/`openhuman-full` are GPL-3.0 in an MIT repository; phase 011's notice requirement already says no tinychannels code is copied, and that sentence has to survive eight children of implementation. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md:133]
- **The net-new surface is wider than the plan or the skip list assumed**, and its three best items are cheap: a reader-set information-flow control from `buzz`, a per-call hooks engine that two repositories implement independently, and a declarative skill-adherence eval from `turnstone`. [SOURCE: specs/system-skilled-bots/context/buzz-main/crates/ifc-core/src/lib.rs:1-18] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:19-37] [SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:1-20]

## 3. Evidence per Phase

Each phase gets its closest reference, the licence of that source, the verdict on plan-versus-reference, and the failures the plan does not guard. "No guard" means the plan names no rule and no test for it.

### 001-activity-and-actor — OpenBot-main, MIT

The lift is faithful: OpenBot's `ACTIVITY_GROUPS` is `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed`, `recurring`, in that order, and the plan requires the same seven ids in the same order and leaves an empty group out. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:22-48] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:166] The reference's third entry kind — a check-in setting — has no analogue, and the plan's `recurring` group is fed by installed schedules instead; a `does: tell` routine shows nothing there until 002's rows exist. That is intended and worth one line in the data model. **Observed.** The licence claim is correct: OpenBot's `LICENSE` is MIT with the line `Copyright (c) 2026 CopilotKit`, which is the copyright line REQ-006 requires. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-3]

**No guard:** the daylight-saving case. The plan computes a next fire "from the cron expression in the machine's local time", and neither `cron-translator.ts` nor `slot-accounting.ts` mentions DST, daylight, timezone or `TZ=`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:173] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:34-40] A `daily 02:30` routine has no slot on a spring-forward night and two on a fall-back night, and OpenBot's routines document gives no rule either. **Observed (absence on three sides) / inferred (the failure).**

### 002-routine-layer — OpenBot-main, MIT

The plan's two tempting additions are already excluded with citations and reversal conditions: the 20-enabled cap because this host has no per-person list, and the first-failure notice because `delivery.onFailure` already reports each failure. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:121] The fatigue rule's ten-failure count, the `enabledAt` reset and the skip-on-missed-window policy all match the reference. **Observed.** A builder should not re-add either exclusion.

**No guard:** the same DST case as 001, and nothing else.

### 003-terminal-screen — openhuman-tui, GPL-3.0, design-only

The plan builds an MIT Rust crate and takes the reference's 24-column and 8-row floor with a drawn 30x7 too-small frame. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation/spec.md:86] Its clean-room rule is explicit: an openhuman path appears in a design document as provenance, never in a worker brief, and `rg -n 'openhuman' crates/bots-tui/src` must match only comment lines. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md:237] The terminal guard — raw mode off, alternate screen left, cursor shown, a `Drop` restore chained in front of the panic hook, and a signal handler that only sets a flag — matches the reference's design one for one. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md:191] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/terminal.rs:1-11] **Observed.**

**No guard, two of them.** (a) No no-panic property: the reference tests `small_terminal_and_unicode_do_not_panic` and measures every string with `unicode_width`, while the plan asserts three comfortable sizes. A model-written question with a CJK character in a 30-column pane is reachable on day one. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render_tests.rs:57] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:15] (b) No render-path secret masking: the plan guards the answer path with a secret-literal refusal and the post-run scan, and the reference masks a secret during render (`masked_login_does_not_render_a_secret`); `redactToken` already exists on the channel side to reuse. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render_tests.rs:38] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md:255]

### 004-computer-exposure — no reference

No repository tells the model its working directory in a prompt line. Turnstone renders it into the filesystem and shell tool descriptions at tool-list build time through `apply_cwd_context(tools, working_dir, workspace_dir)`, which is a different placement with a different property: it survives a mid-run directory change because it is re-rendered with the tools, while a prompt line is static. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/tools.py:208] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/session.py:5147] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:30-50] The plan's one line is the only surface this runtime has, because the executor owns the tool list, so the evidence supports the plan. Its resume rule — refuse a parked prompt naming another working place, correct a shared run whose branch changed — is stricter than either reference, and deliberately so. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:149] **Observed.**

**No guard:** nothing, beyond the inference that a child which `cd`s away sees a stale sentence.

### 005-memory — OpenGhost `memory.js`, MIT

The plan lifts three of OpenGhost's four bounds verbatim: `LIMITS = { text: 400, records: 60, crowded: 28, chars: 3600 }`, and the plan refuses a text over 400 characters and an append past 60 entries or 3,600 bytes. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150-151] Where the plan is stricter, it is right to be: OpenGhost slices to the limit on load, losing the rest, and debounces its save; the plan refuses the append and rewrites through a temp file with copy-forward. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:10,36] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152] **Observed.**

**No guard:** the fourth number. `crowded: 28` is the trigger for OpenGhost's `TIDY` rewrite, which merges duplicates and lets the later statement win a contradiction; the plan has no compaction and no contradiction rule, so two entries that disagree are both injected into every prompt for the life of the file, and `--forget <n>` is the only remedy. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:12-15] Copying the rewrite would be worse — an LLM rewrite of operator-confirmed facts loses the confirmation — so the fix is to say what a contradiction means, or to defer compaction the way 002 defers its two items.

### 006-approval-grants — OpenBot-main, MIT

The rung ladder is taken faithfully: kinds, then rules, then auto-review, then extra vigilant, first answer wins, with a `bot` fallback added and rungs 2 to 4 named as not implemented in this phase. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-13] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:161-162] The reference's rule that an allow reaches a kind only when it was given on that kind's card is already the plan's `grant-kind-unknown` refusal. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:29-31] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:164] **Observed.**

**No guard, two of them.** (a) The credential hand-off: OpenBot gives a website password change to the person, "the card says it is yours to do, and offers **I did it myself** and **Don't do it**", because only the person holds the secret; the plan makes `credentials` a kind the operator can `confirm`, so an item can record `grants.scope: once` for an action the bot cannot perform. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:47-52] That is the highest-value gap in either of these two phases. (b) The recognizer's width: the reference reads tool names, button labels, exact strings (`Remove`, `Comment`, `Reply`), key chords (Cmd+Enter, or `Enter` in a message box) and the page address up to the path, and it excludes a signed query string from making an ordinary form a credentials page; the plan reads one question, so a bare `Enter` that sends is a send the reference catches and this plan will not. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:36-45] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:160]

### 007-per-bot-apps — OpenMausBot and openhuman-full, Apache-2.0 and GPL-3.0

No reference narrows a connector list per run; they narrow per user or per item, so the `apps:` mechanism is net-new and the plan's own framing — "a filter, not a sandbox" — is the honest description. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:105] What is borrowable is the failure path: OpenMausBot detects `ACCESS_TOKEN_SCOPE_INSUFFICIENT`, appends a second content block naming the exact required scope and telling the model "Do not retry", and keeps the provider's original error unchanged. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.ts:1-5] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.test.ts:13-20] **Observed.**

**No guard:** a reachable server whose credential is short. Nothing in 007 or 008 treats that as its own state, so the child retries a call that cannot succeed. `tinymcp` offers the other half — dial the server, browse registries, keep health — at 150,644 lines you would mirror rather than build. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/src/lib.rs:1-6]

### 008-vault — rakazo, Apache-2.0

The plan's vault is measurably stronger than the reference's: it refuses a `security -i` line over 4,096 bytes before the spawn, never prints the program's output, verifies a write by reading it back in constant time, and scans the child's stdout, the run folder and the receipt folder for the value and its base64 and URL-encoded forms. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md:63] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:165-168] The reference's protection is the weaker one, and it reaches the right conclusion anyway: hide the server's error text because "its other errors could echo the value". [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:25-28] **Observed.**

**No guard:** the operator-side access axis. rakazo scopes a stored item to an allow-list of the owner's bots through `VaultBots = { allBots, botIds }`, checked as `allBots || botIds.every(...)`; the plan's only control is the bot's own `secrets:` declaration, so an operator cannot say which bots may use a stored secret, and a definition can name any stored value. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:40-41] [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:72] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:155] A corollary: once that axis exists, `secret-unknown` is the wrong name for a secret that exists but is not allowed, because it sends the operator hunting for something that is there.

### 009-skills — OpenGhost and openhuman-full, MIT and GPL-3.0

The plan's declared `skills:` list, its per-skill wrapper, its two caps and its proposal flow are all packet-internal and well specified; the reference contributes one line worth taking and one mechanism worth ranking. **No guard:** the name grammar. A skill name is joined into `<skilledTree>/.skilled/skills/<name>/SKILL.md` and never validated as a path segment, while OpenGhost applies `^[a-z0-9][a-z0-9-]{0,63}$` before any lookup and 005 already refuses an unsafe bot id "instead of becoming a path". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:10] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:164] **Observed.** The mechanism worth ranking is `tinyskills`' deterministic discovery and collision precedence, which the plan has no rule for, and `turnstone`'s skill-adherence eval, which tests obedience rather than size. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/src/lib.rs:1-6] [SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:1-20] The reference's mention path (`/name` in a message, wrapped so a conversation summary keeps it) is deliberately absent here, and the declared list is the better trade for a governed host. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:9-13]

### 010-conversations — no reference beyond two paragraphs

The transcript records are packet contracts, so the only reference facts are that a group conversation gives each bot its own thread inside one shared transcript and that a bot naming a peer hands off "under the same grants and caps". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:189] The plan excludes bot-to-bot handoff and cites exactly that rule, which is the exclusion that prevents posture escalation: a handoff started under the target bot's own posture would let a `workspace-write` bot reach a `danger-full-access` peer by naming it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:111] **Observed.** No guard needed; the exclusion is the guard.

### 011-messaging-channels — tinychannels-main, GPL-3.0, mirror only

The most evidence-dense phase in the run, and the one with the most control-flow gaps. The wire tables are already cited line by line, the adapter policy is already taken from the reference's four-value enum, and the approval index's in-memory loss is what the file-backed index exists to fix. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:15-30] **Observed.** What follows is what the plan does not guard:

- **A 409 with an active webhook wedges the poller.** The reference calls `deleteWebhook` when the 409 description names a webhook and re-polls immediately; the plan clears the webhook once at start and waits 2 s on any 409, so anything that sets a webhook later loops forever. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1936-1952] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md:212]
- **A deduplicated update must still advance the offset.** The reference advances it on the seen path and has a test named for exactly this (`a_deduplicated_update_still_advances_the_offset`); the plan's wording — "moves past an update only after the seen record is written" — admits a skip that pins the offset and re-fetches the same update forever. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1967-1971] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops_tests.rs:3736-3775] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md:145]
- **The offset should commit after ingress succeeds, not after the seen write.** The reference marks an update acknowledged "only after its provider-owned action or typed ingress has succeeded"; under the plan's ordering a crash between the seen write and ingest loses the message. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1973-1981]
- **One `unknown` state cannot tell a send that never left from a send whose outcome is unknown.** The reference keeps `SendAttemptStarted` and `UnknownAfterSend` and routes both through a `reconcile_unknown_send` port returning `Sent`, `NotSent` or `Unresolved`; the plan's single state is never retried, so a process that died before the HTTP call loses the notice. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/queue.rs:79-90] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/queue.rs:190-240] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:130] The split the evidence supports is two states plus the reconciliation port, and only the second is unretryable.
- **A chunked send must record which chunks landed.** `PartialTextSendError` carries `sent_before_error` and `continuation_message_ids`; the plan cuts at 4,096 bytes and records one entry, so a failure on chunk 3 of 5 and a later retry would duplicate chunks 1 and 2. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_send.rs:928-946] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md:99]
- **Slack's definite non-delivery is distinguishable and the plan does not distinguish it.** `ok: false` on an HTTP 200 means nothing was applied; a 200 with a non-JSON body is `Malformed`, which is uncertain. The plan applies that split to WhatsApp and not to Slack. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:15-21] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:92-105]
- **The button caps are constants the plan does not apply.** Slack caps a label at 75 characters and an action id at 255 bytes, refuses a disabled action, and copies the action id into `value`; the plan's button rule checks only the secret literal, and a truncated action id silently breaks the derived-index lookup. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs:10-11] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs:55-74] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:128]
- **The seen folder has no retention horizon**, and the reference's only sizing datum is a 4,096-entry in-memory window with head eviction plus a process-local offset that resets to zero on restart. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_types.rs:12] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1854] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:21-30]
- **The approval surface's fail-closed path is the one the plan already answers better.** The reference returns `NoReplyContext` and the parked call times out denied; the plan's REQ-006 falls through to `answerItem`, which is the right answer for a second press or a post-crash redelivery. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:110-125] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:128] The lift worth taking from that file is the callback order: the reference acknowledges the callback query before resolving the item, which loses a press on a crash after the ack — the opposite of the plan's index-first ordering. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1978-1990]
- **OpenMausBot has no liftable transport**; its Slack surface is a hosted management URL gated on enterprise portal membership. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/hosted-slack.ts:4-20]

**Licence:** GPL-3.0, and the plan already says no tinychannels code is copied. That sentence is load-bearing across seven children.

### 012-manual-testing-scenarios — tinychannels' conformance kit, GPL-3.0

The plan's five conformance rules already mirror the reference's five assertions, with a line range cited per rule, and they test both directions: R1/R2 cover an undeclared operation being refused with no wire call, R3/R4/R5 cover a declared operation returning a receipt and a matching observation. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md:22-33] **Observed.**

**No guard:** the request a transport builds. The reference kit's header states the rule that closes it — a provider test implements `AdapterFixture` on the provider's own mocked platform, and the kit "never substitutes a synthetic transport for the provider fixture". [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:1-7] The plan's fixture records at the seam and opens no socket, so no rule asserts a Telegram `sendMessage` body, a Slack block, a Signal envelope or a WhatsApp URL. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md:35] A wrong header or a re-serialised signature body passes every rule the plan names, and 012's channel scenarios run on the same fixture.

### 013-skilled-and-doc-alignment — no reference

No repository carries an automated docs-versus-code check, and OpenBot's manifest has no documentation script. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:154-158] Net-new by necessity: the two commands are this repository's own, so the acceptance criteria carry the whole weight — and REQ-004 does, by requiring every finding to be fixed, handed off or rebutted with a reason.

### 014-deep-review — no reference

No reference has a review loop. The phase's one borrowed guard is the suite floor recorded in `review/preflight.json` as `suiteBaseline` rather than quoted, because "a floor quoted from this block would pass a build that deleted a phase's tests". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:94] That is the item a reviewer should confirm is enforced.

## 4. Net-New: What the Ten Repos Have and the Plan Does Not

Ranked by value to a small team with one host and no operator on call; size is what it would cost to mirror the mechanism. Every crate named here is GPL-3.0 when it comes from `openhuman` or `tinychannels`, and mirror-only.

| Rank | Item | Source | Licence | Size | Value |
|------|------|--------|---------|------|-------|
| 1 | Reader-set information-flow control | `buzz` `crates/ifc-core` | Apache-2.0 | one crate in a 7,184-file repo | High: blocks an audience leak no output scan can find |
| 2 | Per-call hooks (`pre_llm_call`, `pre_tool_call`, `post_tool_call`) | `OpenGhost` `rules.js`, `hermes-muse` `plugin.yaml` | MIT | 703 lines of engine; a 12-line declared list | High: two independent implementations, no owning phase |
| 3 | Skill-adherence eval suite | `turnstone` `eval_skill_adherence.json` | Apache-2.0 | 56 lines of data plus a scoring module | High: tests obedience, not size |
| 4 | Silent-when-healthy scheduled probe | `hermes-muse` `health_entry.py` | MIT | 11-line entry point plus a module | High: an unattended host has no other health signal |
| 5 | Inbound event queue with noise filtering | `openhuman-full` `tinyeventqueues` | GPL-3.0 | 89,431 lines | High: the only inbound lever the plan lacks |
| 6 | Deduplicated proactive notices | `hermes-muse`, `OpenBot` `docs/routines.md` | MIT | behaviour, tens of lines | Medium-high: 002 defers the first-failure notice |
| 7 | Connector scope hint | `OpenMausBot` `connector-scope-hint.ts` | Apache-2.0 | ~130 lines plus tests | Medium-high: names the scope, forbids the retry |
| 8 | Portable plugin manifest | `hermes-muse` `plugin.yaml` | MIT | 12 lines | Medium: the shape a distribution step needs |
| 9 | Deterministic skill discovery and collision precedence | `openhuman-full` `tinyskills` | GPL-3.0 | 78,138 lines | Medium: 009 has no collision rule |
| 10 | Document output and extraction | `openhuman-full` `tinydocs` | GPL-3.0 | 83,976 lines | Medium: no phase covers it |
| 11 | MCP server health and registry browsing | `openhuman-full` `tinymcp` | GPL-3.0 | 150,644 lines | Medium: 007's filter is static |
| 12 | Runtime trace schema with replay checking | `buzz` `crates/buzz-conformance` | Apache-2.0 | one crate | Medium: the schema is cheap, the discipline is heavy |
| 13 | Token compression | `openhuman-full` `tinyjuice` | GPL-3.0 | 636,193 lines | Valuable, unreachable |
| 14 | Adapter and test kits as packages | `rakazo` `adapter-kit`, `testkit` | Apache-2.0 | two of fourteen packages | Low: 011's fixture already does this |

The three that a small team would feel in the first month are 1, 2 and 3, and all three are cheap: a label set and an egress check, an event-to-handler table, and a JSON case format. Item 5 is the one with a real implementation cost and the one that changes the run economics of a host that talks to a chat.

## 5. Openhuman-Full, Corrected

`openhuman-full` carries twenty-one vendored crates, not five, totalling about 4.38 million lines: `tiny-artifacts` (6,720), `tinyagents` (510,260), `tinybox` (159,147), `tinybus` (79,755), `tinychannels` (273,669), `tinycomputer` (630,174), `tinyconnectors` (113,104), `tinydocs` (83,976), `tinyeventqueues` (89,431), `tinyflows` (242,273), `tinyhosts` (67,066), `tinyhumans-sdk` (13,407), `tinyjuice` (636,193), `tinymcp` (150,644), `tinymemory` (99,763), `tinysearch` (87,179), `tinysecurity` (288,030), `tinyskills` (78,138), `tinystoragedrivers` (72,569), `tinyvoice` (567,904) and `tinywallet` (129,856). [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:21-25] The five the topic names are the smallest end of the tree. And `crates/openhuman-tui` is present in both trees; what `openhuman-full` has is a workspace whose path dependencies resolve. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates:1]

## Eliminated Alternatives

- **Copying OpenGhost's LLM tidy as the memory bound's answer.** It silently rewrites operator-confirmed facts, which contradicts 005's own premise that an entry records who said it.
- **Mining OpenMausBot for in-tree channel transports.** None exists; its Slack surface is a hosted management URL.
- **Re-deriving the phase 011 wire facts (endpoints, limits, backoff constants).** Plan children 005 and 006 already cite those lines.
- **Ranking only the five vendored crates the topic names.** They are the smallest end of a 21-crate tree.
- **Reading `tinycomputer` and `tinyvoice` for value.** Both are excluded surfaces and their sizes settle the ranking.
- **Treating the missing mention path in 009 or the missing mouse hit-target rule in 003 as defects.** Both are deliberate exclusions with a better alternative in place.

## Divergence Map

- Saturated directions: none recorded; the run stopped at its iteration cap rather than on saturation or convergence. Convergence score at close: 0.92 on the last iteration ratio.
- Pivots taken: none; `convergenceMode` was `default`, not `divergent`, so no Council pivot ran.
- Pivot failures and audited overrides: none.
- Remaining frontier: the four depth-2 nodes opened under F-1-004 (dedupe-window retention, per-transport proof of non-delivery, Slack redelivery order, button-label limits) were answered together in iteration 2 — findings 1, 3, 4 and the confirm for redelivery — so the registry's four open rows are answered in prose and open only in registry terms. Depth 3 was never reached.

## 6. What Is Still Uncertain

- **Whether `signal-cli` keeps events for a disconnected client.** 011's own design names this UNKNOWN and a manual run that would settle it; this run found nothing in the corpus to change that.
- **The DST rule.** Absent on all three sides this run could read — plan, runtime and reference documentation. It needs a decision, not more evidence.
- **Whether the plan's `seen/` retention should be the provider's redelivery horizon.** The reference's 4,096-entry window is the only number in the corpus, and it is a process-lifetime bound rather than a retention policy.
- **The value column of the net-new ranking is judgement.** The size column is measurement. A reader who weighs differently should reorder items 2 through 8 without disputing the sizes.

## 7. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 1 / 5 (the frontier node's own question; the four depth-2 children were answered in iteration 2 but remain open in registry terms)
- Remaining questions: 4
- Per-iteration ratios: 0.92, 0.88, 0.80, 0.90, 0.95, 0.88, 0.88, 0.67, 1.00, 0.92
- Convergence threshold: 0.05 (not the stop mechanism; stop policy was max-iterations)
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted.

## 8. Method Notes

Ten iterations, one per pass, each writing `iterations/iteration-NNN.md` and `deltas/iter-NNN.jsonl` and recording one canonical iteration row through the append gateway. Forty-nine findings across ten iterations, each with a `[SOURCE: path:line]` citation and an observed-or-inferred marker. The most productive single technique was reading the reference's *test list* before its implementation: `a_deduplicated_update_still_advances_the_offset`, `small_terminal_and_unicode_do_not_panic` and `masked_login_does_not_render_a_secret` each name the failure their repo was fixing, which is the part of this deliverable a plan cannot derive from source alone. The least productive was grepping a plan for an absence: a missing rule has no line to cite, so each such finding rests on a cited document plus a search that found nothing, and is marked accordingly.

### Correction log

One provenance defect was introduced and corrected during close-out rather than hidden. The first `synthesis_complete` append read an event file from a temporary directory left by a sibling fan-out lineage, so the ledger carries one row scoped to `fanout-vibe-1-1795763950430-ek4gqy` with `answeredCount` 2 of 2. The correct row was then generated inside this lineage and appended after it: runId `fanout-pi-2-1795763950430-ek4gqy`, ten iterations, 1 of 5 questions answered, stopReason `maxIterationsReached`. The reducer reads the latest `synthesis_complete`, so the terminal state is the correct one; the stray row stays in the append-only ledger and is named here rather than edited away.

## References

- The ten reference repositories under `specs/system-skilled-bots/context/`, each cited at file and line above.
- The build plan: `specs/system-skilled-bots/003-openbot-parity-build/`, fourteen phase folders and `contracts/`.
- The three earlier syntheses: `001-openbot-parity-research/research/research.md`, `002-plan-review-research/research/research.md`, `003-plan-depth-research/research/research.md`.
- The built runtime: `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`.
- This lineage's iteration files: `iterations/iteration-001.md` to `iterations/iteration-010.md`, and its deltas under `deltas/`.
- The resource map for this run's conversions: `resource-map.md`.
