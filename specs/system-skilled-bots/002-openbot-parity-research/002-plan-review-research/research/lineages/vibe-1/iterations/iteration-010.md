# Iteration 10: Conversations — the answer that never comes back

## Focus

The last carried-forward question, from iteration 6: does 010's conversation store create a third injection path, and does its transcript framing match 009's wrapper. Widened to the three questions the focus file names: whether a human message is framed as data or instruction, whether a bot can write the conversation file it is later fed, and whether `bots chat` reuses the answer path or writes its own. The frontier is drained, so the focus comes from the strategy's carried-forward list. Evidence: 010's spec against `answer.ts`, `runner.ts` and the executor's sandbox default.

## Findings

1. **P1 — a parked chat run's answer never reaches the conversation, so the transcript shows the question and then nothing.** REQ-007 appends a bot message carrying the question and the item id when a run parks [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:154], and REQ-001 appends the reply when the run completes [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148]. A parked run does not complete: `bots answer` writes the answer and enqueues a separate `resume` request [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:100], which a later drain claims and runs with no chat context. 010's Files to Change touch `runner.ts` for the completed outcome's text [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:117] and `request-drain.ts` for the `requestIds` filter, and neither appends on the resume path; the Out of Scope list does not mention resume at all [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:101-108]. The one outcome that needs a person is the one whose answer the person never sees in the surface they used. **Edit:** in `010/spec.md` add REQ-012: "when a resumed run completes, the drain appends one bot message carrying the item id, the answer text and the run id to the conversation the parked run came from, and a conversation with no parked run appends nothing"; add `runtime/lib/request-drain.ts` and `runtime/lib/answer.ts` to Files to Change with that append; add an acceptance criterion that a chat message which parks, is answered, and resumes leaves three messages in `--transcript` with the answer as the third.

2. **P1 — the transcript is fed as the request prompt with no role framing, and it includes bot-authored messages, so one injected reply is replayed as instruction on every later turn.** REQ-001 says the run is dispatched "with the transcript as the request prompt" and that "The BOT.md body stays the standing role, and the transcript is added after it" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148]. Every message carries a `role` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:150], but nothing in the requirement says the role reaches the prompt as a delimiter, and the runner passes a request prompt through as text. So a bot message and a human message are the same bytes in the same region, and a bot that was once told to ignore its role keeps that sentence in every later turn of the conversation. 009 solved the same problem for skill bodies with a `<skill_content>` wrapper [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:156]; 010 has no equivalent. **Edit:** in `010/spec.md` REQ-001 add "each transcript message is rendered as one line prefixed `<human>` or `<bot>` inside a `<conversation>` block, the block is introduced as a record of what was said rather than as instruction, and a message whose text contains a closing tag is escaped"; add the escaping case to §8 Edge Cases and one assertion to `conversation.vitest.ts`.

3. **P2 — a re-sent message duplicates in the transcript even though the queue suppresses the second run.** REQ-011 makes a human message's id the request's event id, so a re-sent message is a queue duplicate and dispatches no second run [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:163]. The append happens before the dispatch, so the file holds two lines with the same id and `--transcript` draws the message twice, while the run count stays one. The transcript is then the record a person reads to see what they said. **Edit:** in `010/spec.md` REQ-011 add "the append is idempotent on the message id: a message whose id is already in the file is not appended again, and the verb reports `duplicate` on stderr and exits 0"; add the case to `conversation.vitest.ts` and one line to `cli-chat.vitest.ts`.

4. **P2 — a bot declaring `danger-full-access` can append a fake human message to its own conversation, which the next turn replays as instruction.** The conversation file lives under the identity's state root [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148], and the state root is owner-only, so the file's protection is the child's sandbox class rather than its mode. The default class is `workspace-write` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:722-724], which confines writes to the worktree and keeps the state root out of reach; a bot that declares `danger-full-access` is not confined and can append a line with `role: "human"` and any `by` value. The transcript bound then displaces a real message [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:161]. **Edit:** in `010/spec.md` §6 Risks add the row "a full-access bot can rewrite its own transcript" with the mitigation "the conversation reference states that a transcript is a convenience record and not evidence, and the checker's advisory names a bot whose sandbox is `danger-full-access`"; add the advisory id to `feature-catalog/definition/definition-checker.md`.

5. **P2 — the prompt budget is bounded per source and never in total, so a bot with memory, skills and a conversation can build a prompt of about 80 KB.** 005 bounds each memory file at 60 entries and 3,600 bytes, two files [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:247]; 009 bounds a skill at 40,960 bytes and the list at 65,536 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:252]; 010 bounds the transcript at 8,000 characters [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:161]. Each phase names its own constant and no phase owns the sum, so the largest legal prompt is about 80,736 bytes plus the BOT.md body, and no requirement refuses it. **Edit:** in the parent `spec.md` §3 add one line assigning the total to 001: "the prompt builder refuses a prompt over 96,000 bytes as `prompt-too-large`, naming the source that pushed it over", and add the same sentence to 005, 009 and 010's Out of Scope so each phase knows the total is owned elsewhere.

## Ruled Out

- Looking for a conversation-scoped approval grant: 010 defers it to 006 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:106], and 006 owns the `grants` field.
- Looking for a second writer to the conversation file inside the runtime: the CLI is the only writer, and the drain appends nothing today, which is finding 1 rather than a race.
- Treating the append-only file as a torn-write risk: REQ-002 skips a torn last line and reports it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:149], and the append is one line.

## Dead Ends

- Looking for a `bots chat` path that writes its own answer record instead of reusing the queue: the phase adds a `requestIds` filter to `request-drain.ts` so one message runs through the same claim and routing path. That is the reuse the focus asked about, and it is correct.
- Looking for a missing `by` on a chat message: REQ-003 carries it, and 001's actor resolver fills it. No finding.

## Edge Cases

- Ambiguous input: "framing" could mean a delimiter or a role label. The narrower reading (a role label per line inside one block) is the one the fix states, and the wider one (a separate system message) is not available because the runtime has one prompt string.
- Contradictory evidence: none. 010's requirements are internally consistent; the gap is what they leave out.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:101-108,117,148,149,150,154,161,163,174
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:247
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:156,252
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:6-13,100
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:208
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:722-724

## Assessment

- New information ratio: 0.80
- Questions addressed: is the conversation a third injection path, can a bot write it, does chat reuse the answer path
- Questions answered: chat reuses the queue correctly, the transcript is unframed and replays bot text as instruction, a full-access bot can rewrite it, and the parked answer never returns to the conversation

## Reflection

- What worked and why: following the parked run from `bots chat` through `answer.ts` to the drain showed the one path the phase does not touch. The phase's own REQ-007 names the question and stops there, which is exactly where the answer should start.
- What did not work and why: the first pass expected `bots chat` to write its own answer record and looked for a duplicate writer. The `requestIds` filter shows the opposite, so the finding became the missing append rather than a duplicated one.
- What I would do differently: for every verb that dispatches a run, trace the run's three outcomes — completed, parked, failed — and check that each one writes back to the surface that started it. Two of three do here.

## Recommended Next Focus

The synthesis needs the cross-phase conflict list assembled from iterations 1 to 10, and three angles still have uncovered surfaces: 002's routine `until` and fatigue edge cases, 003's Rust crate against the CI workflow it edits (partly covered in iteration 5), and 006's ladder against 011's roster (partly covered in iterations 4 and 7). The next iteration should take 002, because it is the only phase whose runtime behavior has had no security pass.
