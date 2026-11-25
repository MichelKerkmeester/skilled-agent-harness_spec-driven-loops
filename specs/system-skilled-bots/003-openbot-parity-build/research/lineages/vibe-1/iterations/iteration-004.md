# Iteration 4: Who may approve, and what happens when two surfaces answer at once (frontier F-2-006)

## Focus

Frontier node F-2-006 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor, 006-approval-grants, 011-messaging-channels): Who may approve: does 011's operators.json roster agree with 001's actor precedence and 006's ladder, and what happens when a channel actor and a terminal actor answer the same item?

I read the three authority surfaces, then the one function they all write through, looking for the race and for the actor each surface records.

## Actions Taken

1. Read the answer path's read-modify-write and its atomicity: `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts:68-120`, `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:159-166`.
2. Checked for a lock around the item: `rg -n "lock|lease|flock|O_EXCL"` over `needs-you.ts` and `answer.ts` returned no lock on the item path.
3. Read 001's actor precedence and its pinned-operator surfaces: `001-activity-and-actor/spec.md:105-132,146,179`.
4. Read 011's roster, link, lockout and approver rules: `011-messaging-channels/spec.md:59,111,122,125,133,146,177,210,224,281` and `011-messaging-channels/acceptance-criteria.md:58,63`.
5. Read 006's ladder inputs: `006-approval-grants/spec.md:96,104`.

## Findings

1. **P1 — two answers to one item race, and the loser's answer is silently replaced.** `answerItem` reads the item, checks its state, writes the answer and then enqueues [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:76-118]. The write is atomic per call [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:159-166], but nothing serializes the read-modify-write: no lock, lease or exclusive create exists on the item path. A terminal answer and a channel answer that arrive together both read `open`, both write, and the last writer's text stands. The resume request id is derived from the item id, so the queue keeps one request and the run continues with whichever answer landed last. **Exact edit**: add to 006 "the answer is written under an exclusive lock on the item file, and an answer that loses the race is refused `item-answered-differently`", and add a test that two concurrent answers leave one answer and one request.

2. **P1 — a channel answer records the host user, not the person who pressed the button.** 011 resolves the linked actor to check the roster [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177] but never says the answer carries that actor, and `answer.ts` fills `by` from `--as` or the OS user [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146]. A channel daemon runs as the host user, so every channel approval would be attributed to the machine's owner — the exact erasure 001 exists to prevent, on the surface 011 adds. **Exact edit**: add to 011 REQ-005 "the answer is written with `--as <linked actor>`, so the item's `by` names the person who pressed", and add it to AC-005.

3. **P1 — the roster's absent-file behaviour is unspecified, so the default is either fail-open or a lockout.** REQ-005 says only an actor named `owner` or listed in `members` may answer [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177], and nothing says what happens when `operators.json` is missing, unreadable or empty. A fail-open reading lets any linked chat approve; a fail-closed reading locks the team out of its own bots. **Exact edit**: add to REQ-005 "an absent, unreadable or empty `operators.json` refuses every channel answer `channel-roster-missing`, and `bots channel link` refuses to link until the roster names at least one actor".

4. **P1 — nothing can write the roster.** 011 creates `operators.json` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:133] and `bots channel link` links a chat to an actor [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:175], but no verb adds that actor to `members`. The first person to link is therefore not a member and cannot approve anything, and the file's shape is never stated. **Exact edit**: add `bots channel roster add <actor>|remove <actor>|list` to 011's deliverables and Files to Change, or state the file's shape and that it is hand-edited.

5. **P2 — the ladder cannot express an actor-aware rule, so the roster is the only actor gate and it is channel-only.** 006's ladder takes kinds, rules, auto-review and extra-vigilant as inputs and no actor [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96], so "only the owner may approve a payment" cannot be written. 011 adds the roster outside the ladder [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:125]. **Exact edit**: add to 006's Out of Scope "an actor-aware rung: the ladder decides whether to ask, and 011's roster decides who may answer from a channel; the terminal needs no roster because it needs the state root".

6. **P2 — one run can have two actors and no phase says so.** 001's precedence is `--as`, then the pinned operator, then the OS user [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146], and a scheduled run's record names the pinned operator [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:150]. A person who answers that run's item with `--as` writes a different name on the answer than the record carries, which is correct and unstated. **Exact edit**: add to 001 "the run record names the actor who dispatched and the answer names the actor who answered; they may differ, and `bots activity` shows the record's".

7. **P2 — the link lockout counts per chat, not per actor.** Five failed code attempts lock that chat for 300 s [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:176], so a person with two chats gets ten attempts and a shared chat locks everyone in it. **Exact edit**: state the choice in REQ-004 — "the lockout is per chat id, so a second chat is a second budget; a shared chat locks every member".

## Questions Answered

- Does 011's roster agree with 001's actor precedence? **No, they never meet.** 001 resolves a name; 011 checks a name against a file; nothing passes the resolved name into the answer (finding 2) and nothing writes the file (finding 4).
- What happens when a channel actor and a terminal actor answer the same item? **The last writer wins, silently** (finding 1). The queue keeps one resume, so the run continues with one of the two answers and no record of the other.

## Questions Remaining

- Are the phase verify commands runnable in this checkout?
- What is still missing after all eleven phases for a small team, and what is overbuilt?
- Does 005's memory block create a prompt-injection path of its own?

## Ruled Out

- Reading 011's transports for the roster check: the check is one function in `channel-link.ts`, and the transports only call it.
- Treating the atomic write as sufficient: it makes one write indivisible, not one read-modify-write, which is the operation that races.

## Dead Ends

- Looking for an existing lock primitive on the item path: the runtime has a run lease and a queue lease, and neither covers the item file. The fix has to add one.

## Edge Cases

- Ambiguous input: "who may approve" could mean the ladder's rung or the roster's membership. I read it as both and reported them separately (findings 1-5).
- Contradictory evidence: none. 011's roster and 001's actor are not in conflict; they are unconnected.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:68-120
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:159-166
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:105-132,146,150
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96,104
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:59,111,122,125,133,146,175-177,210,224,281
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md:58,63

## Assessment

- New information ratio: 0.93
- Questions addressed: the roster's agreement with the actor, the concurrent-answer behaviour
- Questions answered: both, with the roster's own gaps as the larger finding

## Reflection

- What worked and why: reading the write path for a lock, rather than reading the three phases for a policy, found the race in one pass. A policy question about "who may approve" is answered by the code that performs the approval, not by the prose that describes it.
- What did not work and why: I expected 011 to pass the linked actor into the answer and searched for `--as` in 011; it is absent. The absence is the finding, and it took a second grep to be sure it was not spelled another way.
- What I would do differently: for every "who may X" question, trace the value from the identity check to the record write. A check that does not reach the record is a check that does not exist.

## Recommended Next Focus

The parity-gap angle is next: with the interfaces and the authority model mapped, the remaining question is what a small team still cannot do after all eleven phases, and which slices are overbuilt for that team. The strongest candidate is the terminal screen's Rust crate, which is the largest single deliverable and the one whose value depends on the panes it draws.
