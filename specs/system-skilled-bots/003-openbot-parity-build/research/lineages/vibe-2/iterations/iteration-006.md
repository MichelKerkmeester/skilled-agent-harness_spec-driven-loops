# Iteration 6: Security and failure modes — the injection gap and the fatigue miscount

## Focus

Frontier node F-2-007 (depth 2): "Security and failure modes: secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages and answers, concurrent approvals from terminal and chat, prompt injection through memory, skills or chat, and routine `until` and fatigue edge cases."

This iteration tested each named failure mode against the phase requirements and the runtime's existing guards. Two are real defects: no phase addresses prompt injection at all, and the fatigue rule counts a parked run as a failure. Three are narrower: a `kind` collision on the needs-you item, a memory proposal without provenance, and an unspecified `seen/` folder.

## Actions Taken

1. Searched all eleven phase docs for any treatment of prompt injection or untrusted input.
2. Read the runtime's `FAILURE_CLASSES` and the `awaiting-decision` validation against phase 002's fatigue rule.
3. Read the needs-you item's closed key allowlist against the three phases that extend it.
4. Read phase 005's memory-proposal item fields against the memory entry format.
5. Read phase 011's dedupe, replay and `seen/` requirements, and the secret-literal requirements of phases 005, 009, 010 and 011.

## Findings

1. **No phase addresses prompt injection, although the research topic names it and all three injection surfaces are built.** A search for "prompt injection", "injection through", "untrusted input" and "treat … as data" across the eleven phase folders returns nothing. The three surfaces the topic names are all built: phase 005 prepends `memory/shared.md` and `memory/<bot-id>.md` to the prompt (`005-memory/spec.md:94`), phase 009 loads each named `SKILL.md` body into the prompt after the standing body (`009-skills/spec.md:167`), and phases 010 and 011 put conversation and chat text into the prompt (`010-conversations/spec.md:148`, `011-messaging-channels/spec.md:284`). None states that the loaded text is data rather than instruction, and none adds a boundary marker, so a memory entry or a skill body that says "ignore the standing role" is indistinguishable from the standing role. **Severity P1.** Fix: add one requirement to each of `005-memory/spec.md`, `009-skills/spec.md` and `010-conversations/spec.md` — "the loaded block is wrapped in a labelled fence (`<memory>`, `<skill name="…">`, `<transcript>`) and the standing body carries one sentence stating that fenced content is data, not instruction" — and one acceptance row per phase asserting the fence and the sentence appear in the built prompt.

2. **The fatigue rule counts a parked run as a failure, so a bot that asks for approval ten times is switched off.** `FAILURE_CLASSES` includes `operator` (`run-record.ts:50`), and a run that parks a question must carry `exit.class === 'operator'` — `validateRunRecord` refuses `awaiting-decision-class-invalid` otherwise (`run-record.ts:283`). Phase 002's rule says "After a failed run, ten consecutive failures for one bot set the `disabled` switch with reason `failure-streak`" (`002-routine-layer/spec.md:165`). A bot whose work needs an operator answer every time therefore disables itself after ten questions, which is the opposite of the intended fatigue guard. **Severity P1.** Fix: in `002-routine-layer/spec.md` §4 REQ-006, exclude `awaiting-decision` from the streak and count only the `author`, `environment`, `hub` and `budget` classes; add an acceptance row that ten parked runs leave the bot enabled and the streak at zero.

3. **The needs-you item is extended by three phases, two of them add a field called `kind`, and the item's key allowlist is closed.** `ITEM_KEYS` rejects any unknown key with `unknown-key` (`needs-you.ts:51-98`). Phase 001 adds `by` to the answer (`001-activity-and-actor/spec.md:146`), phase 005 adds `kind` and `proposal` to the item (`005-memory/spec.md:116`), and phase 006 adds `grants`, which itself carries an action `kind` (`006-approval-grants/spec.md:94`). The three must land in one order and agree on one key set, and the two `kind`s mean different things. **Severity P1.** Fix: add a Phase Transition Rule naming `needs-you.ts`'s `ITEM_KEYS` as a shared merge point beside `definition.ts` and `state-root.ts`, and rename phase 005's top-level `kind` to `itemKind` so it cannot be read as the action kind.

4. **A memory proposal shows the fact but not its provenance, so an operator confirms attacker-authored text without seeing where it came from.** Phase 005 turns a bot's `[REMEMBER] <type> <fact>` line into a `memory-proposal` item (`005-memory/spec.md:96`) whose fields are `kind` and `proposal` (`005-memory/spec.md:116`). The stored entry carries `actor`, `source` and `date` (`005-memory/spec.md:94`), but the proposal item does not carry the source, so the confirmation screen shows the fact alone. A bot that read a hostile file or page can therefore get its text into shared memory with one operator click. **Severity P1.** Fix: add `source` to the `proposal` object — the run id plus the file or URL the fact came from — and require `bots inbox` to print it on the proposal line.

5. **Phase 011 creates a `seen/` folder and no requirement says what it holds, so a message body could land there unchecked.** `state-root.ts` gains `channelFolder` and `ensureChannelState`, "naming `channels/` and its `queue/` and `seen/` folders" (`011-messaging-channels/spec.md:141`), and the dedupe decision needs only the message id as the event id (`011-messaging-channels/spec.md:284`). Nothing states that `seen/` holds the id and not the text. **Severity P2.** Fix: state in `011-messaging-channels/spec.md` §4 that `seen/` holds one marker file per message id and never the message text, and add an acceptance row that a message carrying a known secret leaves no secret in `seen/`.

## Verified Correct

- **Secret-literal coverage is complete across every phase that writes text.** Phase 005 checks the memory block before dispatch (`005-memory/spec.md:159`), phase 009 checks the skill draft before it is written (`009-skills/spec.md:169`), phase 010 checks the message text (`010-conversations/spec.md:209`), and phase 011 keeps the token out of the config, the queue entry, the log and the run record (`011-messaging-channels/spec.md:245`). All four name the existing `findSecretLiteral`/`collectKnownSecrets` pair, which already guards a body, a question, an answer, a request prompt and a delivery message.
- **Concurrent approvals from terminal and chat are already serialized.** `answer.ts` refuses a second, different answer with `item-answered-differently` (`answer.ts:84-85`), and phase 011's replay risk row relies on exactly that guard (`011-messaging-channels/spec.md:225`).
- **A redelivered chat message starts no second run.** Phase 011 uses the message id as the queue event id (`011-messaging-channels/spec.md:284`), and `request-queue.ts`'s seen-key marker makes a re-sent event a duplicate rather than a second run (`request-queue.ts:14-18`).
- **A lost outbound message is visible rather than silently retried.** Phase 011 records an uncertain send `unknown` and never retries it (`011-messaging-channels/spec.md:250`), which matches `delivery.ts`'s existing `unknown` state (`delivery.ts:55`).
- **Spoofed chat users are denied by default.** An unlinked chat reaches no bot (`channel-unlinked`), five failed code attempts lock the chat for 300 s in a file-backed lockout, and the link binds the chat to the actor who ran `bots channel link` (`011-messaging-channels/spec.md:175-176`).
- **A restart loses no approval prompt.** Phase 011 writes the action id, item id, channel, conversation and choices to a file before the send (`011-messaging-channels/spec.md:178`), and the scenario row proves a press still answers after a restart (`011-messaging-channels/spec.md:209`).

## Questions Answered

- F-2-007 in part: the injection gap and the fatigue miscount are the two real defects; the other named failure modes are either guarded by the runtime or covered by a phase.

## Questions Remaining

- Which planned surfaces duplicate the runtime, ranked by build time saved? (F-2-008)
- Which runtime modules more than one phase modifies, and in what order must they land? (F-2-009)
- The `until` timeout and the `until` failure path are not yet tested. (carried forward)

## Ruled Out

- **Treating the missing injection guard as a runtime defect.** The runtime builds the prompt and could fence the blocks, but the fence and the boundary sentence are prompt content each phase authors, so the fix belongs in the phase specs.
- **Treating `unknown` sends as a lost-message defect.** The state is deliberate: a sender with no acknowledgement cannot claim delivery, and `unknown` is the honest record. The defect would be a silent retry, which the phase forbids.
- **Treating the 300 s lockout as insufficient.** It is file-backed and survives a restart, which is the property that matters for a spoofing attempt.

## Dead Ends

- **Looking for an injection test or a fence in the runtime.** `buildBotPrompt` assembles the body, the request and the context with no labelled fences, so the guard has to be introduced rather than reused.
- **Looking for a `kind` field on the needs-you item today.** `ITEM_KEYS` has no `kind`, so both phases 005 and 006 introduce one and neither sees the other.

## Edge Cases

- **Ambiguous input:** "who may approve" could mean the actor check or the grant scope. Both are covered: the actor check is iteration 1 finding 4 and the grant scope is iteration 5 finding 2.
- **Contradictory evidence:** phase 002 calls a parked run a failure by counting `exit.class`, while the runtime treats `awaiting-decision` as an operator-class outcome rather than a fault. Both are cited; finding 2 records the phase as the defect because the runtime's class list is the shared vocabulary.
- **Missing dependencies:** none.
- **Partial success:** the `until` timeout and failure path were not tested; recorded as a carried-forward question rather than claimed as verified.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:165`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:94,96,116,159`
- `specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:167,169`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148,209`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:141,175-178,209,225,245,250,284`
- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:94`
- `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:50,283`
- `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-98`
- `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts:84-85`
- `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:14-18`
- `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:55`

## Assessment

- New information ratio: 1.0 (all five findings are new to this run)
- Questions addressed: F-2-007
- Questions answered: F-2-007 in part

## Reflection

- **What worked and why:** searching for the absence of a topic, rather than for its presence, is what found the injection gap. Every other angle had a phase that named it; injection had none, and the empty result was the finding.
- **What did not work and why:** the first pass read phase 002's fatigue rule as "failed runs" in the ordinary sense and would have passed it. Reading `FAILURE_CLASSES` and the `awaiting-decision` validation together showed that a parked run is classed `operator`, which is a failure class.
- **What I would do differently:** for every rule that counts something, read the vocabulary it counts against the runtime's enum. The mismatch here is invisible in the phase's own prose.

## Recommended Next Focus

F-2-008, the overbuild ranking by build time saved, then F-2-009, the shared-module landing order. The `until` timeout and failure path remain a carried-forward question for a later iteration.
