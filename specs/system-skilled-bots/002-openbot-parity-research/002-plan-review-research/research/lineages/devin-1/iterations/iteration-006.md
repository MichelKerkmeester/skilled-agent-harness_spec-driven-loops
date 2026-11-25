# Iteration 6: Security — messaging channels (011)

## Focus
Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels): Security: in the vault (008), apps (007), approvals (006), memory (005) and channels (011) plans, where can secrets leak into prompts, logs, run records or chat, how are tokens stored, and can a spoofed or unlinked chat user approve or read?

## Actions Taken
1. Read 011 `plan.md` and the security requirements of `spec.md` (REQ-002 to REQ-019) plus the risk table.
2. Verified the runtime surfaces 011 names: `DELIVERY_CHANNELS`, the parked `itemId`, `DECISION_MARKER`/`OPTION_MARKER`, the runner's option fill, and the live `bots channel` / `bots chat` refusals.
3. Searched the packet for `operators.json` and for any concurrency rule on a needs-you answer.
4. Read the pairing-code requirement and its risk row.

## Findings
1. **P0 — phase 011, `spec.md:177` (REQ-005) and `tasks.md:62` (T019): the approver check reads `operators.json`, which no phase creates.** 011 requires that only an actor named `owner` or listed in `members` in `operators.json` may answer from a channel, and T019 adds the roster read; but no `operators.json` exists anywhere, phase 001 explicitly puts "the two-role `operators.json`" out of scope, and phase 006 says "neither is needed to name an approval". The build therefore cannot implement its authorization gate, and the risk row's mitigation ("the roster check is a second gate") names a file that never lands. **Exact edit:** add a create task for a minimal `operators.json` (`{ owner, members[] }`) to 006 (the approval phase) with its exact location and default owner, and make 011 REQ-005/T019 cite it; or replace the check with the 001 actor plus the OS-user rule and state that model instead. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:107] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:100]

2. **P1 — cross-phase, phase 011 with phase 006: concurrent approvals from a terminal and a chat have no rule.** `answer.ts` is a read-modify-write: it reads the item, writes the answer, then enqueues the resume. Nothing in 011 or 006 defines what happens when a terminal `bots answer` and a chat press race on the same item; both can read `answer: null`, the later write wins silently, and the losing answer and its scope are lost with no event. **Exact edit:** add `item-already-answered` as a refusal and write the answer through a compare-and-set (re-read and atomic replace, or an exclusive claim file) in `answer.ts`; add a test that runs two answer paths against one item and asserts one wins and the other is refused. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:60-120] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:178]

3. **P1 — phase 011, `spec.md:191` (REQ-014): the token rule covers the store, config, queue, log and record, but not the question text sent to chat.** REQ-014 names the token; the approval prompt carries the child-authored question and options, and the channel sender can re-render them instead of sending the `deliveryMessage()` body that `delivery.ts:291` already checks with `findSecretLiteral`. A child-authored question holding a stored secret would then reach chat. **Exact edit:** require the channel sender to send only the `deliveryMessage()` output after the literal check, never a re-rendered question, and add the case to the conformance fixture. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:191] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:291]

4. **P2 — phase 011, `spec.md:175` (REQ-003): the pairing code's shape is unspecified.** A one-time code with a 5-failure/300 s lockout is only as strong as its entropy, and REQ-003 never states the length, alphabet, expiry or whether the code is bound to the channel and actor that generated it. **Exact edit:** state the code's length and alphabet (proposed: 8 characters from a 32-symbol unambiguous alphabet), its expiry (10 minutes), and that it is bound to the generating channel and actor. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:175]

5. **P2 — phase 011, `plan.md:94`: the `.opencode/bin/bots.cjs` row repeats the copy-mirror misconception.** `readlink .opencode/bin` prints `../.skilled/bin`, so the file is the same inode; "update - copy the edited file" is a no-op and a copy that replaces the link breaks the mirror. **Exact edit:** replace the row with a `readlink` guard, as phase 004 already does. [SOURCE: .opencode/bin] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:94]

## Ruled Out
- Suspected 011 DoR drift: ruled out. `DELIVERY_CHANNELS` is `['desktop']` at `delivery.ts:45`; the parked entry carries `itemId`; `DECISION_MARKER`/`OPTION_MARKER` are at `dispatch.ts:45-48`; the runner fills `options`; `bots channel list` and `bots chat` both exit 2 today.
- Suspected token leak in the queue or record: ruled out as written — REQ-014 explicitly forbids the token in the config, a queue entry, a log or a run record, and the value is read from the 008 store at send time.
- Suspected webhook signature gap: ruled out — REQ-012 verifies `X-Hub-Signature-256` as an HMAC over the raw body in constant time before any parse.

## Dead Ends
- No dead ends.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: 011's risk row relies on the `operators.json` roster while 001 and 006 both defer that file; the conflict is the P0 finding.
- Missing dependencies: `operators.json` is the missing dependency; it is required state, not optional, so the finding is P0 rather than a fallback note.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md
- .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts
- .opencode/bin (readlink)
- Live CLI output: `bots channel list`, `bots chat my-bot --transcript`

## Assessment
- New information ratio: 1.0
- Questions addressed: F-1-005 for phase 011
- Questions answered: none fully

## Reflection
- What worked and why: searching the whole packet for `operators.json` in one call showed the file is named by three phases and created by none, which is the strongest possible form of a missing-dependency finding.
- What did not work and why: nothing failed; the channel plan's security requirements are unusually complete on tokens and signatures, so the gaps that remain are structural (roster, concurrency) rather than accidental.
- What I would do differently: for a security review, grep the authorization nouns (`owner`, `members`, `operators`, `approver`) across all phases before reading any single plan; the missing owner file would have surfaced in iteration 2.

## Recommended Next Focus
Continue F-1-001 on per-bot apps (007) and vault (008), then 009-011; the security angle has one more pass left to rank findings and check restart/dedupe paths.
