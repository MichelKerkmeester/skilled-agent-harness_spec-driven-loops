# Iteration 2: Approval answer survival, replay and authority (frontier F-2-004)

## Focus

Frontier node F-2-004 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen): Does the approval answer contract survive a restart and a replayed press across the terminal, chat and channel surfaces, and does the grant survive with it?

This is the security and failure-mode angle on the answer contract iteration 1 found split three ways. I read the answer path, the item's derived state, the queue's dedupe rule, 006's scope rule, 011's approval index and token handling, and 008's secret injection, then checked each against the runtime.

## Actions Taken

1. Read the answer path end to end: `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts:60-125`.
2. Read the item's derived state and expiry: `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:46-137,245,323`.
3. Read 006's scope rule and its explicit non-goal about persistence: `006-approval-grants/spec.md:96,104`.
4. Read 011's approval index, reply grammar, token rule and restart claims: `011-messaging-channels/spec.md:112,170-200,209,249,283`.
5. Read 008's secret injection and its dispatch-env risk row: `008-vault/spec.md:147-163,187-189`, then the gate itself at `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1143-1167,1495-1517` and the bots dispatch call site at `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:19,601-612`.
6. Checked the Telegram URL shape in the reference implementation: `specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_tests.rs:268`.

## Findings

1. **P1 — the grant scope is not part of the answer's identity, so a second answer with the same text and a different scope is silently dropped.** `answerItem` refuses only when the text differs: `if (state === 'answered' && item.answer?.text !== input.text) return { ok: false, reason: 'item-answered-differently' }` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:85]. 006 adds `--scope once|conversation|always|deny` and "records the scope on the grant" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96], but never says the scope joins the comparison. So `bots answer item-1 yes --scope once` followed by `bots answer item-1 yes --scope always` returns `duplicate` and the standing allow is lost with no error. **Exact edit**: add to 006 REQ "the answer's identity is its text and its scope: a second answer with the same text and a different scope is refused `item-answered-differently`", and change `answer.ts:85` to compare both fields.

2. **P1 — the `always` scope does not outlive its item, but two surfaces label a control "always".** 006 states "A saved rule that outlives its item - rung 2 has no store in this phase, so an `always` scope is recorded on the item and read by the resumed prompt, not by a later item" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]. 003 binds `a` to `always` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:171] and draws `2 approve always` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:174]. The operator reads "always" and gets "this run". **Exact edit**: change 003 REQ-006/REQ-009 to `a` → `approve for this run` and `2 approve for this run`, or add the rule store to 006 and say so in its scope.

3. **P1 — the Telegram bot token travels in the request URL and no requirement redacts it.** 011 REQ-009 long-polls `getUpdates` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:181], and the Bot API puts the token in the path — the reference implementation builds `https://api.telegram.org/bot123:ABC/getMe` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_tests.rs:268]. 011 REQ-014 says only that the value is "read from the store at send time and never written to the channel config, a queue entry, a log or a run record" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:191], which does not cover a URL rendered inside an error string. **Exact edit**: add to 011 REQ-009 "every URL is rendered with the token replaced by `bot<redacted>` before it reaches an error, a log or a queue entry", and add a test that a failed `getUpdates` prints no token.

4. **P1 — 011 reads the token at send time, but two transports need it before any send.** REQ-014 reads the value "at send time" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:191], while Telegram long polling [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:181] and Slack `apps.connections.open` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:182] need it to open the connection. A transport that resolves the token only when sending cannot start. **Exact edit**: change REQ-014 to "read at `start` and at every send, and never held in a field that outlives the call".

5. **P1 — approval authority is split three ways and no phase states the model.** 011 gates a channel answer on `owner` or `members` in `operators.json` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177]; 003 writes `bots answer` with no check at all [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162]; 006's ladder takes kinds, rules, auto-review and extra-vigilant as inputs and no actor [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96]. So a channel answer is gated and a terminal answer is not, and nothing says why. **Exact edit**: add one sentence to 006's scope: "The host is the authority: a terminal answer needs no roster because it needs the state root. A channel answer adds the `operators.json` roster 011 lands." and have 003 REQ-003 cite it.

6. **P1 — inbound chat text becomes the run prompt with no untrusted framing.** 010 appends the transcript after the BOT.md body as the request prompt [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148], and 011 routes any line that is not an answer into that path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:192]. A chat message is therefore an instruction the bot will follow, from anyone in the chat. No phase says the transcript is data. **Exact edit**: add to 010 REQ-001 "the transcript sits under a fixed `## Conversation` heading that states the lines are untrusted user text and not instructions", and have 011 REQ-015 cite that heading.

7. **P2 — the approval index has no expiry and no removal rule.** 011 REQ-006 writes an entry per prompt before the send [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:178] and no requirement removes it, so the file grows without bound and a stale entry can resolve a press for an item answered hours ago. **Exact edit**: add to REQ-006 "an entry is removed when its item is answered or expired, and a press naming a missing entry is refused `channel-prompt-unknown`".

8. **P2 — an `unknown` send is never retried and never surfaced.** 011 REQ-013 records an uncertain send `unknown` and never retries it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185], and `bots channel list` reports only queue depth [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:196]. A lost approval prompt is therefore invisible. **Exact edit**: add to REQ-019 "`bots channel list` prints the count of `unknown` entries, and `bots channel drain --report` lists them with their idempotency key".

9. **P1 — 008's mitigation for the dispatch-env gate cannot be implemented as written.** 008's risk row says "Widen `assertDispatchEnvAllowed` with the `SKILLED_BOT_SECRET_` prefix in the same change" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:187]. That function admits only exact keys from a per-kind list: `if (!allowed.includes(key)) throw new Error(...)` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1508-1517], and the env the bots runtime passes is already filtered by `isAllowedExecutorEnvKey` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1155] through `dispatchEnv: built.env` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:601-612]. A prefix is admitted by neither, so the secret never reaches the child. **Exact edit**: replace the risk row with "`isAllowedExecutorEnvKey` and `assertDispatchEnvAllowed` both gain a `SKILLED_BOT_SECRET_` prefix rule scoped to the bots dispatch path, and a test asserts `PATH` and a non-prefixed key are still refused".

## Questions Answered

- Does the approval answer contract survive a restart? **Yes for the item and the queue, no for the scope.** The item file and the derived state survive (needs-you.ts:8,137), the request id is derived from the item id so a replay is a queue duplicate (answer.ts:113), and 011's index is written before the send (REQ-006). The scope is lost on a same-text replay (finding 1) and never outlives the item (finding 2).
- Does the grant survive with it? **Only as far as the resumed prompt.** 006 records it on the item and reads it into the prompt; there is no rule store.

## Questions Remaining

- Do 004, 005, 007 and 009 extend the run record and the status index without breaking the schemaVersion 1 validator?
- Are the phase verify commands runnable in this checkout?
- Does 005's memory block create a prompt-injection path of its own, and does its secret-literal check cover a fact a bot proposes?

## Ruled Out

- Reading 011's transports for wire-protocol correctness: the question is about the answer contract, and the transports' own conformance rules (REQ-017) are a separate concern.
- Treating 011's restart claim (NFR-R01) as unverified: it is backed by a file written before the I/O, and the runtime's queue already dedupes by request id.

## Dead Ends

- Looking for a scope field on `NeedsYouAnswer` in the runtime: the answer object holds `text` and `answeredAt` only [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24-27], so 006's scope is a new field on a new object, not an extension of an existing one. That is why the idempotency comparison cannot see it.

## Edge Cases

- Ambiguous input: "survive a restart" could mean the item, the queue entry or the grant. I read it as all three and reported each separately.
- Contradictory evidence: 011 claims a restart loses no prompt (NFR-R01) while its index has no removal rule; both are cited (findings 7 and the answer above) and they are not in conflict — one is about loss, the other about growth.
- Missing dependencies: none. The dispatch-env gate resolved and is on the bots path.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:60-125
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24-27,46-137,245,323
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:19,601-612
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1143-1167,1495-1517
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162,171,174
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96,104
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:147-163,187-189
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:112,170-200,209,249,283
- specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_tests.rs:268

## Assessment

- New information ratio: 0.89
- Questions addressed: restart survival, replay, grant persistence, approval authority
- Questions answered: restart survival and grant persistence, with the scope caveat

## Reflection

- What worked and why: reading the idempotency comparison before reading 006's scope rule made the scope gap obvious in one line. The runtime's own refusal vocabulary (`item-answered-differently`) is the exact hook the fix needs, so the finding arrives with its edit.
- What did not work and why: my first pass assumed 008's risk row was a correct description of the gate. Reading `assertDispatchEnvAllowed` showed an exact-match list, which turns a "widen it" instruction into an unimplementable one. The lesson is that a risk row's mitigation needs the same line-level check as a requirement.
- What I would do differently: check every "widen X" or "extend Y" mitigation against the function's actual matching rule, because a prefix claim against an exact-match list is the most common way a plan looks complete and is not.

## Recommended Next Focus

The run-record and status-index extensions (F-2-005) are the next blocking interface: 004, 005, 007, 008 and 009 all add fields to the same two records, and iteration 1 already found that the record validator refuses any schema version but 1. Reading those five phases against `run-record.ts` and `status-index.ts` in one pass will show whether the packet has one schema story or five.
