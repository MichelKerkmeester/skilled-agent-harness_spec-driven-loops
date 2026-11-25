# Iteration 12: The ladder reads a sentence the bot wrote

## Focus

006 approval grants, read line by line as iteration 11 recommended: whether the precedence ladder has an actor input and a rung for every answer surface, whether the `grants` field names what it approves, and whether a grant outlives the item it was given for. The frontier is drained, so the focus comes from the strategy's lowest-coverage area. Evidence: 006's requirements against 001's inbox JSON contract, the three other item writers the packet adds, and 010's conversation scope.

## Findings

1. **P1 — the approval kind is classified from the question's first sentence, which the bot writes, so a bot can put a benign sentence first and have a delete read as `other`.** REQ-001 defines `action` as "the question's first sentence, clipped to 120 characters" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:145], REQ-002 classifies "an action's name" by testing six word lists in order [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:146], and REQ-004 writes the grant at the gate from the parked question [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:148]. The question is bot-authored text, so "I will tidy the notes. Delete the production database?" yields `action: "I will tidy the notes"`, kind `other`, and `bots inbox` prints `other` on a delete. REQ-006 refuses a standing allow on `other` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:150], which caps the damage at `once`, but the operator still approved a delete that was labelled `other`. **Edit:** in `006/spec.md` REQ-001 change `action` to "the whole question, clipped to 120 characters" and REQ-002 to "classify the whole question and return the strictest kind found anywhere in it, so a payment that also deletes reads as `pay`"; add REQ-012: "a question may carry one `[ACTION: <kind>]` line, which the gate parses and prefers over the word lists, and a line naming a kind outside the six is refused `action-kind-invalid`"; add the benign-first-sentence case to `approval-ladder.vitest.ts`.

2. **P2 — three phases add needs-you item writers that never pass through the gate REQ-004 covers, so the packet's own new items are the ones with no grant.** REQ-004 says the gate writes `grants` "so every item written after this phase names what it approves" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:148], and REQ-008 lets an item with `grants: null` validate [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:157]. The packet adds three other writers: 002's fatigue item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:165], 005's memory-proposal item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:146] and 009's proposal review item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:159]. None is the runner's gate, so all three write a null grant and `bots inbox` prints `-` for them, while the `rung: bot` value that exists for exactly this case goes unused [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:216]. **Edit:** in `006/spec.md` add REQ-013: "every item writer fills `grants` with `kind: other`, `rung: bot` and the action in its own words, and a writer that leaves it null is a defect"; add one line to 002, 005 and 009's requirements naming the grant they write, and one acceptance criterion in each that `bots inbox` prints `other` on its item's line.

3. **P2 — `--scope conversation` is accepted in phase 6, has nothing to scope it to until phase 10, and no phase says how it is keyed.** REQ-005 accepts `conversation` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:149], and the phase records the scope on the item and reads it in the resumed prompt rather than in a later item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]. 010 lands conversations four phases later and defers the conversation-scoped grant back to 006 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:106]. So the scope is accepted, recorded and never keyed to a conversation id by any phase; keyed by bot it is `always` under another name, and keyed by nothing it is a word in a record. **Edit:** in `006/spec.md` REQ-001 add `conversationId` to the grant shape and REQ-005 add "`conversation` records the conversation id the item was raised in, and an item raised outside a conversation refuses `conversation` as `grant-scope-unavailable`"; add the refusal to §8 Edge Cases and one assertion to `approval-ladder.vitest.ts`.

4. **P2 — 006 adds `grants` to the item but not to `bots inbox --json`, so the JSON contract 001 fixed and 003 reads omits the grant.** 001's AC-003 fixes the JSON item as "that item's id, bot, state, question, options, timestamps and answer" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:56], and 006's REQ-007 extends only the text line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:156]. 003's inbox pane draws from the JSON, so the pane cannot show the kind, the rung or the scope that 006 exists to add. **Edit:** in `006/spec.md` REQ-007 add "and `bots inbox --json` carries the same grant object on each item"; in `001/acceptance-criteria.md:56` add `grants` to the enumerated fields; and in `003/spec.md` name the grant column the pane draws.

## Ruled Out

- Looking for a rules store that rung 2 needs: `approval-ladder.ts` is a pure function over four inputs, so the strictest-rule rule is testable with an injected list and the phase says so [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:59].
- Looking for a grant that outlives its item: the phase states that `always` is recorded on the item and read by the resumed prompt, not by a later item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]. That is iteration 2's finding and it is already recorded.
- Looking for an actor input on the ladder: iteration 4 recorded that the ladder has none, and 011's roster is the phase that would supply it.

## Dead Ends

- Looking for a missing `deny` path: `deny` is one of the four answers and needs no kind, so an `other` item can always be refused.
- Looking for a secret in the grant: NFR-S02 states a grant is a kind, a phrase, a rung and a scope and never a credential [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:204]. No finding.

## Edge Cases

- Ambiguous input: "the action in the bot's words" could mean the whole question or its first sentence. The requirement says the first sentence, which is the narrower reading and the one that creates the gap.
- Contradictory evidence: REQ-004 says every item names what it approves, while REQ-008 lets a null grant validate. Both are cited; the null path is the one the packet's own new writers take.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104,145,146,147,148,149,150,156,157,204,216,240
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:59
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:56
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:165
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:146
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:159
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:106

## Assessment

- New information ratio: 0.75
- Questions addressed: does the ladder have an actor input and a rung for every surface, does the grant name what it approves, does a grant outlive its item
- Questions answered: the grant names a sentence the bot wrote rather than the action, three of the packet's own item writers leave it null, the conversation scope has no key, and the JSON contract omits it

## Reflection

- What worked and why: reading REQ-001's definition of `action` beside REQ-002's classifier showed that the classifier's input is bot-authored text. That is a one-line comparison and it is the highest-severity finding of the iteration.
- What did not work and why: the first pass looked for a missing rung and found five values for four rungs, which looked like a defect until the edge cases showed `rung: bot` is the degenerate case. The enum is right and the requirement's coverage is wrong.
- What I would do differently: for every field whose value is derived from text a bot writes, ask who chooses the text. Here the bot chooses both the question and which sentence comes first.

## Recommended Next Focus

The synthesis needs the cross-phase conflict list assembled from iterations 1 to 12, and one surface remains: 003's Rust crate against the CI workflow and the `.opencode` mirror, partly covered in iteration 5. The next iteration should take 003's acceptance criteria and the workflow file line by line, because it is the only phase whose deliverable is a second language toolchain and the only one whose verify commands need a toolchain this checkout does not have.
