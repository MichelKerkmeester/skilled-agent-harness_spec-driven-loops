# Iteration 11: The cross-phase conflict list

## Focus

Frontier node F-2-006 (depth 2), deliverable pass: the second half of the research topic's closing requirement — a cross-phase conflict list. This iteration collects every finding that names two or more phases, states the disagreement in one line, and gives the resolution each needs. It adds no new external evidence.

## Findings

1. **The cross-phase conflict list: fourteen conflicts, each with the documents that disagree and the resolution it needs.**

   | # | Conflict | Documents | Disagreement | Resolution | Sev |
   |---|---|---|---|---|---|
   | 1 | `SCHEMA_VERSION` | `001-activity-and-actor/spec.md:114` vs `004-computer-exposure/spec.md:147` | 001 bumps to `'3'`; 004 requires it to stay `'2'` | 004's REQ-006 must say `'3'` and its DoD must print `'3'` | P0 |
   | 2 | `operators.json` | `spec.md:94` vs `011-messaging-channels/spec.md:281` | Parent forbids any child from building it; 011 builds it and REQ-005 needs it | Give it an owner: either 011 builds it and the parent's Out of Scope is amended, or 001 does and 011 depends on 001 | P0 |
   | 3 | `until` | `002-routine-layer/spec.md:164` vs `how-openbot-works.md:41-44` | Prose outcome in the reference, shell command in the plan | Split into `until` (prose) and `until_check` (command) | P0 |
   | 4 | `ITEM_KEYS` | `001-activity-and-actor/spec.md:146`, `005-memory/spec.md:116`, `006-approval-grants/spec.md:94` | Three phases extend a closed allowlist; two add a field named `kind` | One Phase Transition Rule naming `needs-you.ts`; rename 005's to `itemKind` | P1 |
   | 5 | `FRONTMATTER_KEYS` | `002-routine-layer/plan.md:63`, `005-memory/spec.md:118`, `007-per-bot-apps/plan.md:61`, `008-vault`, `009-skills/plan.md:64` | Five phases add a key; no document lists the final set | One row in the parent naming the five keys and their phases | P2 |
   | 6 | `state-root.ts` folders | `002`, `005`, `008`, `009`, `010`, `011` | Six phases add a folder; no phase states the mode | One row in the parent naming the six folders and 0700 | P2 |
   | 7 | `HonoredPosture` | `001-activity-and-actor/spec.md`, `007-per-bot-apps/plan.md:63`, `008-vault` | Two phases add fields with no schema bump | One bump owned by the first phase that adds a field, and a `null` default for the other | P1 |
   | 8 | The actor's name | `001-activity-and-actor/spec.md:146`, `011-messaging-channels/spec.md:174` | `by` on an answer, `actor` on a run record, `sender` on a channel message | Keep `by` and `actor`; rename 011's `sender` to `actor` | P2 |
   | 9 | Message shape | `010-conversations/spec.md:150` vs `011-messaging-channels/spec.md:174` | The two records share only `text` | 011's shape becomes a transport envelope; one adapter in `conversation.ts` | P1 |
   | 10 | Status vocabulary | `001-activity-and-actor/spec.md:143` vs `003-terminal-screen/spec.md:165` | Seven group ids vs six exit-code statuses, no overlap | 003 keys its markers by 001's group id | P1 |
   | 11 | Grant scope | `006-approval-grants/spec.md` vs `011-messaging-channels/spec.md` | A channel approval records no scope | 011's approval path calls `answerItem` with the scope the reply names | P1 |
   | 12 | `buildBotPrompt` | `004-computer-exposure/plan.md:62`, `005-memory/plan.md:61`, `008-vault/spec.md:122`, `009-skills/plan.md:65` | Four phases change one function's input | Every added input optional with a default | P1 |
   | 13 | `executor-audit.ts` | `007-per-bot-apps/plan.md:62`, `008-vault/plan.md:70` | Two phases widen another skill's env allowlist | One refusal acceptance row each | P1 |
   | 14 | `.opencode/bin/bots.cjs` | Nine phases vs three | Six phases edit the primary without the mirror | Every phase that edits `bots.cjs` copies it | P1 |

2. **Three of the fourteen conflicts cannot be fixed by a spec edit; they need an owner decision.** Conflict 2 (`operators.json`) needs someone to decide which phase owns the file. Conflict 3 (`until`) needs someone to decide whether the routine block carries a command at all, which is a product decision about what a routine is. And the shared-host mode — deferred by every phase, recorded in iteration 1 — needs someone to decide whether a two-person team is in scope. Every other conflict has a mechanical resolution that a builder can apply without asking. [INFERENCE: from the resolutions in finding 1]

3. **Five of the fourteen are one shared record with three or more writers, which is a different failure from a two-phase disagreement.** `ITEM_KEYS` has three writers, `FRONTMATTER_KEYS` five, `state-root.ts` six, `HonoredPosture` three and the actor name three. A two-phase conflict is a disagreement; a five-writer record is an accumulation, and no phase can see the final shape because each sees only its own addition. The fix for all five is the same: one row in the parent that lists the final contents, so a builder reads the target rather than inferring it. [INFERENCE: from conflicts 4, 5, 6, 7 and 8]

4. **Two of the fourteen are an output-to-input mismatch, where one phase's JSON is another phase's parse and the shapes were written independently.** Conflict 9 is 010's record read by 011's terminal transport; conflict 10 is 001's `activity --json` read by 003's activity pane. Both consumers declare the dependency and both producers declare the output, and neither pair agrees on the field names. These are the conflicts a build would hit first, because they fail at the first integration run rather than at review. [SOURCE: `010-conversations/spec.md:150`, `011-messaging-channels/spec.md:174`, `001-activity-and-actor/spec.md:143`, `003-terminal-screen/spec.md:165`]

5. **Two of the fourteen live outside the packet, in another skill's runtime and in a mirror file.** Conflict 13 widens `assertDispatchEnvAllowed` in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1508`, which is the deep-loop's security filter, not the bots runtime's. Conflict 14 is the `.opencode/bin/bots.cjs` mirror, which is a byte-identity gate rather than a code path. Neither is visible to a review that reads only the eleven phase folders, and both fail silently: a widened filter still works, and a drifted mirror still runs. [SOURCE: `executor-audit.ts:1508`, `spec.md:139`]

6. **One pair that looks like a conflict is not: 003 consumes 002's `bots routines --json` unchanged and waits for 001's `inbox --json`.** Phase 003's Dependencies name "Phase 002's `bots routines --json`, which the routines pane reads" (`003-terminal-screen/spec.md:48`) and its Out of Scope says "phases 001 and 002 own those verbs, and this phase consumes them unchanged" (`003-terminal-screen/spec.md:116`). Both are declared, both are one-directional, and neither phase's shape is contradicted. It is the one producer-consumer pair in the packet that was written to agree. [SOURCE: `003-terminal-screen/spec.md:48,116`]

## Ruled Out

- **Counting the corrected `channel-approval.ts` finding as a conflict.** Iteration 2 established that 011's index is a message-id-to-item-id map, not a second answer store, so 006 and 011 do not conflict on the answer path; they conflict on the grant scope, which is conflict 11.
- **Listing the 003/002 routines pair as a conflict.** It is declared on both sides and agrees; finding 6 records it as the counter-example.
- **Treating the parent's stale audit trail as a cross-phase conflict.** It is a documentation defect in one document, recorded as P2 in iteration 1, and no two phases disagree because of it.
- **Treating the numeric build order as a conflict.** Every real edge points backwards, so the order satisfies all fourteen; the defects are in the declared graph, recorded in iteration 8.

## Dead Ends

- **Looking for a conflict between 002 and 003 on the routines pane.** 003 reads 002's verb and declares it; there is none.
- **Looking for a conflict between 004 and 007 on the working place.** 004 names the tree in the prompt and 007 filters the apps inside it; the two touch different inputs of the same run and do not overlap.

## Edge Cases

- **Ambiguous input:** "cross-phase conflict list" could mean only the pairs that disagree or every shared record. The list includes both, with the three-or-more-writer records marked in finding 3 so a reader can tell a disagreement from an accumulation.
- **Contradictory evidence:** none new. Conflict 2 is a contradiction between two documents, and both sides are cited.
- **Missing dependencies:** none.
- **Partial success:** the list is built from the packet's recorded findings plus a re-read of the two producer-consumer pairs. A conflict that no iteration noticed and that this pass did not re-read would be missing; the fourteen are the ones the packet holds.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:94,139`
- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:114,143,146`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:164`, `plan.md:63`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:48,116,165`
- `specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147`, `plan.md:62`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:116,118`, `plan.md:61`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:94`
- `specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:61-63`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:122`, `plan.md:70`
- `specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:64-65`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:150`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:174,281`
- `specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:41-44`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1508`

## Assessment

- New information ratio: 0.80 (four findings fully new — the list itself, the owner-decision split, the three-or-more-writer framing and the outside-the-packet pair; two partially new — the producer-consumer mismatch and the non-conflict)
- Questions addressed: F-2-006, deliverable pass
- Questions answered: the cross-phase conflict list

## Reflection

- **What worked and why:** sorting the conflicts by how many writers a record has separated two problems that look alike. A two-phase disagreement needs a decision; a five-writer accumulation needs a target list in the parent, and no phase can produce it.
- **What did not work and why:** the first pass listed every finding that mentioned two phases, which produced twenty-odd rows including pairs that merely touch the same file. Requiring an actual disagreement on a field, a name or a version cut it to fourteen.
- **What I would do differently:** read the producer-consumer pairs first. They are the conflicts that fail at the first integration run, and they were the last thing this iteration checked.

## Recommended Next Focus

The spec-edit list: for each of the 52 findings, the exact edit, so a builder can apply them in one pass without re-reading the review.
