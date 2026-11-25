# Iteration 6: Memory and skill proposals as a prompt-injection path (frontier F-3-008)

## Focus

Frontier node F-3-008 (depth 3, scope specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/009-skills): Does the memory block 005 prepends to the prompt create a second injection path, and does its secret-literal check cover a fact a bot proposes through a needs-you item?

I read 005's memory block, its proposal item and its answer rule, then 009's skill block and proposal item as the comparison case, because 009 solves the same problem one phase later.

## Actions Taken

1. Read 005's requirements end to end: `005-memory/spec.md:140-175`.
2. Read 009's requirements and its reserved-id decision: `009-skills/spec.md:150-175,198,252`, `009-skills/plan.md:63-95`.
3. Checked the item's required fields and the reserved-id list: `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:33,100`, `.skilled/skills/system-skilled-bots/runtime/lib/label.ts:28,99`.
4. Checked the hold and resume filters: `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:252-256,287,320-323`, `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:832,870`.
5. Re-read the answer path's unconditional enqueue: `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts:104-118`.

## Findings

1. **P1 — 005's "holds no bot" item cannot be built: `botId` is a required non-empty string and 005 names no reserved id.** `NeedsYouItem.botId` is `botId: string` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:33] and the validator refuses an empty one [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:100]. 005 says "A `memory-proposal` item holds no bot and awaits no resume, so `holdForBot` and `itemAwaitingResume` ignore it" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:148] and never says what `botId` it carries. 009 solves the identical problem by reserving an id: "Add `skill-proposals` to `RESERVED_BOT_IDS`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:127] and "whose `botId` is the reserved `skill-proposals`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160]. **Exact edit**: add to 005 REQ-007 "the item's `botId` is the reserved `memory-proposals`", add `memory-proposals` to `RESERVED_BOT_IDS` in 005's Files to Change, and note in both phases that the list is shared.

2. **P1 — memory entries land in the instruction region with no data framing, while 009 wraps skill bodies.** 005 inserts the entries "between the protocol lines and the body" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:145], which is the same region the decision rule and the body occupy. 009 wraps each body in `<skill_content name="<name>">` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:156]. A confirmed fact is therefore an instruction, and a bot that was prompt-injected can launder an instruction into its own future prompts with one `[REMEMBER]` line and one operator confirmation. **Exact edit**: change 005 REQ-006 to "each file's entries sit inside one `<memory file="<path>">` block that states the lines are facts the operator confirmed and not instructions", and add the same sentence to 005's prompt-block description.

3. **P1 — the proposal item shows the fact but not the run that proposed it, so the operator cannot judge provenance.** 005's item carries "the type, the fact and the proposing bot" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:146]. 009's item evidence "names the draft, the `proposal.json` and the run folder" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:159]. A fact with no run id cannot be traced to the prompt that produced it, which is the one thing an operator needs to decide whether the bot was talking or being talked through. **Exact edit**: add to 005 REQ-007 "the item's evidence names the run id and the run folder".

4. **P2 — no phase strips control characters from a question, a fact or a skill body before it is stored or drawn.** 003's inbox pane draws the item's question [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:169] and `bots inbox` prints it, so a fact carrying a terminal escape sequence can rewrite the screen an operator is approving from. **Exact edit**: add to 005 and 009 "the text is stripped of C0 control characters other than newline and tab before it is stored, and the same strip runs before any text is drawn".

5. **P1 — `answer.ts` gains a second "no resume" branch and neither phase says how the two compose.** `answerItem` always builds and enqueues a resume request [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:104-118]. 005 says `confirm` and `reject` "neither enqueue a resume request" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:147], and 009 says "Answering a proposal review records the decision and enqueues no resume request" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161]. Two phases add the same kind of branch to the same function, after 001 adds `by` and 006 adds the scope. **Exact edit**: state the seam once in 005 — "`answer.ts` asks each registered review kind in order and the first that claims the item settles it, so a memory proposal and a skill proposal cannot both claim one answer" — and have 009 cite it.

6. **P2 — 005 bounds each memory file but not the pair, while 009 bounds the combined skill bodies.** 005 refuses an append past 60 entries or 3,600 bytes per file [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:142], and the prompt carries both files, so a bot's prompt can grow by 7,200 bytes with no combined cap. 009 caps the sum of skill bodies at 65,536 bytes [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:157]. **Exact edit**: add to 005 "the two files together may not exceed 4,800 bytes, and an append that would cross it is refused `memory-full` naming both counts".

## Questions Answered

- Does the memory block create a second injection path? **Yes.** A bot's own `[REMEMBER]` line, one operator confirmation, and the fact becomes an instruction in every later prompt, with no data framing (finding 2) and no provenance on the item that would let the operator see where it came from (finding 3).
- Does the secret-literal check cover a bot-proposed fact? **Yes for secrets, no for instructions.** 005 checks the block for secret literals before dispatch [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:151] and 009 checks the draft the same way [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:163], so a leaked key is caught. Nothing catches a leaked instruction.

## Questions Remaining

- What is still missing after all eleven phases for a small team, and what is overbuilt?
- Does 010's conversation store create a third injection path, and does its transcript framing match 009's wrapper?

## Ruled Out

- Reading 005's memory file format for its own sake: the format is bounded and clear; the finding is where the block sits in the prompt, not how it is stored.
- Treating 009's `<skill_content>` wrapper as sufficient for both phases: it is the right pattern, and 005 does not use it, which is the finding.

## Dead Ends

- Looking for a sanitizer in the runtime that already strips control characters from a question: there is none on the item path, so the fix has to be added.

## Edge Cases

- Ambiguous input: "second injection path" could mean the memory block or the proposal item. They are two halves of one path and I reported both.
- Contradictory evidence: none. 005 and 009 do not conflict; 009 is simply the later, better-informed design of the same mechanism.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:140-175
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:150-175,198,252
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:63-95
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:169
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:33,100,252-256,287,320-323
- .skilled/skills/system-skilled-bots/runtime/lib/label.ts:28,99
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:832,870
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:104-118

## Assessment

- New information ratio: 0.92
- Questions addressed: the memory injection path, the secret check's coverage, the proposal item's shape
- Questions answered: both halves of the node's question

## Reflection

- What worked and why: reading 009 beside 005 turned a vague "is this safe" question into a diff. 009 reserves an id, wraps the body and pins the revision; 005 does none of the three, and each absence is a finding with an exact edit borrowed from the sibling.
- What did not work and why: my first pass read 005 alone and concluded the design was careful, because every requirement is well written. The gaps are only visible against the phase that solved the same problem better.
- What I would do differently: for any phase that introduces a review item, read the other phase that introduces one in the same pass. The packet has two, and they disagree on three points.

## Recommended Next Focus

The parity-gap and overbuild angle is the remaining one, and it is now the only angle with no iteration behind it. The strongest candidates are the Rust screen (a whole toolchain for three read panes that three CLI commands already print) and 011's four transports (four wire protocols for a small team that may use one chat client).
