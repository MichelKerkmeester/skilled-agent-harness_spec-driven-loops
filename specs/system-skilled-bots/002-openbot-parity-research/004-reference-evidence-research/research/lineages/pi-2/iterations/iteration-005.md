# Iteration 5: Phases 005-memory and 006-approval-grants

## Focus
Per-phase evidence for `005-memory` (the memory entry file, its bounds, the prompt block and the `[REMEMBER]` proposal) and `006-approval-grants` (the `grants` object, `classifyAction`, `decideApproval`, the rung ladder and the answer precedence). The two are paired because 006 owns the `grants` field that 005's memory-proposal writer must fill, and because both phases' reference sources are small enough to read completely.

Interpretation chosen: "the reference" for 005 is OpenGhost-main's `memory.js` (MIT), the only bounded memory file in the corpus, plus hermes-muse's staged-write note; for 006 it is OpenBot-main's `docs/approvals.md`, whose ladder the plan names.

## Actions Taken
1. Read the plan's requirement tables for 005 and 006.
2. Read OpenGhost's `memory.js` constants, its load path, its save path and its tidy prompt.
3. Read OpenBot's `docs/approvals.md` in full: the rung order, the answering vocabulary, the recognition table and the credential exception.
4. Compared the plan's bounds, the plan's rung set and the plan's kind detection against each.

## Findings

1. **The plan lifts OpenGhost's three memory bounds but not its compaction, so the reference's answer to a contradiction is missing while the reference's numbers are present.** OpenGhost's limits are `{ text: 400, records: 60, crowded: 28, chars: 3600 }`. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11] The plan refuses a text over 400 characters and an append past 60 entries or 3,600 bytes. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:151] Three of those four numbers are identical, which is the provenance; the fourth, `crowded: 28`, is the trigger for OpenGhost's `TIDY` rewrite — an instruction that merges records about the same thing, drops what is said twice, and where two disagree "keep only what the later one says, with no word of the earlier". [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:12-15] The plan has no compaction step and no contradiction rule: at 60 entries `bots remember` refuses until the operator removes an entry by index. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152] **Observed (both sides) / inferred (the consequence).** Two memory entries that disagree are both injected into every prompt for the life of the file, and the operator's only tool is `--forget`, which names an index and not a contradiction. The evidence does not support copying OpenGhost's fix — an LLM rewrite of an operator-confirmed fact log loses the fact that a person confirmed it, and "the later one wins" is wrong when the earlier one is the correction. What the evidence does support is the plan saying what a contradiction means: either `bots remember` warns when a new entry's text is near-identical to an existing one, or 005's out-of-scope list names the compaction as deferred with a reversal condition, the way 002's two deferrals do. Silence is the only indefensible option, because the bound is the reference's and the reader will assume the rewrite came with it.

2. **OpenGhost's bound is lossy and its save is debounced, and the plan's refusal-and-rewrite choice is the stricter one.** Loading slices the stored items to the record limit and keeps the rest nowhere. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:36] Every save is a 400 ms debounce, and a second window's write triggers a full reload that can overwrite a local change on its way. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:10] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:29-33] The plan refuses an append that would pass the bound and leaves the file byte for byte unchanged, and `--forget` rewrites through a temp file and a rename while copying forward any bytes an append added during the rewrite. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:151] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152] **Observed.** The evidence supports the plan on both counts: a memory file whose entries an operator confirmed must not be silently truncated on load, and a copy-forward rewrite is the only way a concurrent append survives. This is the one place in the two phases where the plan is strictly better than the reference, and it is worth one line in 005's design so a builder does not "simplify" the rewrite into a truncate-and-write.

3. **OpenBot hands a website credential change to the person, and the plan has no equivalent outcome, so an operator can approve an action only the person can perform.** The reference's exception is explicit: a password or credential change on a website "is handed to you: the card says it is yours to do, and offers **I did it myself** and **Don't do it**", because only the person holds the secret. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:47-52] The plan makes `credentials` one of the seven action kinds and lets the ordinary answer set — allow once, deny, and the review options `confirm` and `reject` — decide it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:159] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:163] **Observed.** So a bot that asks to rotate an operator's password can be told `confirm`, the item records `grants.scope: once`, and the run then proceeds to an action the bot cannot complete. The reference's answer is a third outcome on the card, and the plan's item vocabulary already has room for one more option; the cheapest correct change is to refuse `confirm` on a `credentials` grant whose action names a secret only the person holds, and record the person's own completion as the answer. This is the highest-value gap in either phase: it makes the audit trail assert an approval for something that did not happen.

4. **The plan's kind precedence is its own invention, and the reference's recognizer is wider than the plan's question scan.** OpenBot's order is across rungs, not among kinds: "Kinds of action", then "Rules", then "Auto-review", then "Extra vigilant", and "the first answer wins". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-13] The plan instead returns "the strictest kind found anywhere in it, testing `pay`, `credentials`, `delete`, `send`, `share` and `post` in that order". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:160] **Observed.** Two consequences. First, there is nothing in the reference to cite for the order among kinds, so its justification rests on the plan's own example (a payment that also deletes reads as `pay`) and needs its own test rather than a reference cite. Second, the reference recognizes a kind from three surfaces the plan's single question scan cannot see: an app's tool name, a button label (including the exact strings `Remove`, `Comment`, `Reply`), and a key chord (Cmd+Enter or Ctrl+Enter counts as "send"). [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:36-45] It also excludes a signed query string from making an ordinary form a credentials page. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:39] The plan's lifted `tool-name.ts` covers the first surface and nothing covers the other two. For a CLI host, button labels and key chords have no analogue and the exclusion has none either, so the honest record is that the plan's recognizer is narrower than the reference's on purpose — and that a bare `Enter` in a message box is a "send" the reference would catch and the plan will not.

5. **The reference's "an allow reaches a kind only when it was given on that kind's card" is already the plan's rule, and the plan states it as a refusal.** The reference says an ordinary allow does not open a kind, and neither does a typed rule. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:29-31] The plan refuses a standing allow on an item whose `grants.kind` is `other` with `grant-kind-unknown` when a store lands. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:164] **Observed.** No gap; recorded so a later phase does not re-derive the rule from the reference and land a second version of it.

## Ruled Out
- **Copying OpenGhost's LLM tidy as the memory bound's answer.** It rewrites operator-confirmed facts with no record of the rewrite, which contradicts 005's own premise that an entry records who said it.
- **Re-deriving the rung order.** The plan takes the reference's four rungs and adds a `bot` fallback; the reference has no fallback value, so the addition is the plan's and is already documented.
- **Treating 006's unimplemented rungs 2 to 4 as a gap.** The plan names them as not implemented in this phase, with the reason (no store supplies them).

## Dead Ends
- hermes-muse's staged-write note was not opened beyond its path: the prior synthesis already carries it as a lift for proposal review, and 005's proposal path cites it.
- OpenBot's `shared/tool-name.ts` was not re-read: the prior synthesis names it as the lifted classifier and the plan's `classifyAction` cites it.

## Edge Cases
- Ambiguous input: two phases in one iteration again. Both are small-reference phases and 006's grant is written by 005's proposal path, so the pair is a real unit.
- Contradictory evidence: none.
- Missing dependencies: `steer.md` still absent, checked before the iteration.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenGhost-main/memory.js
- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md

## Assessment
- New information ratio: 0.95
- Questions addressed: 005-memory reference model and bounds; 006-approval-grants ladder, recognition and answer vocabulary.
- Questions answered: both phases' evidence questions. 005's compaction is answered negatively (the plan omits it), 006's credential outcome is answered negatively (the reference has a hand-off the plan lacks).

## Reflection
- What worked and why: reading `memory.js`'s constant block before its logic. Four numbers on one line settled the provenance question instantly — three appear verbatim in the plan and the fourth, `crowded: 28`, is the trigger for the mechanism the plan left out. That is a cheaper way to find an omission than reading the plan for what is absent.
- What did not work and why: approaching 006 expecting the rung ladder to be the finding. The plan already carries the ladder faithfully; the value was in the *exception* paragraph below it and in the recognition table, which are the parts a summary of the doc skips.
- What I would do differently: for a doc-driven phase, read the reference document's exceptions and tables, not its numbered list. The list is what the plan already lifted; the exceptions are what it drops.

## Recommended Next Focus
Phase 007-per-bot-apps and 008-vault: the reference's per-bot app and integration model (what an app is, how a bot gets one, what isolates two bots' apps) and the vault and secret-store design (naming, rotation, redaction, what a leak check does), with the failures their tests name.
