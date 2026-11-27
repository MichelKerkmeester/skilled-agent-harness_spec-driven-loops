# Iteration 5: Phases 004-computer-exposure and 005-memory

## Focus

Phases 004-computer-exposure and 005-memory: which reference files implement the same thing, what a builder should lift or mirror, where the plan differs from the reference and which side the evidence supports, and which failures the plan does not yet guard against.

Both phases are small and both have a naming problem. 004 is called "computer exposure" and the reference's "computer" is a browser container the plan explicitly excludes; 005 is called "memory" and the reference's memory is a pluggable engine with a token-budgeted compile. This iteration fixes what each word means before recording a gap.

## Actions Taken

1. Read `OpenBot-main/shared/computer-control.ts` for the handoff state machine, its terminal states and its restart-recovery flag.
2. Read the plan's 004 REQ-001 to REQ-008 and its scope boundary.
3. Read `openhuman-full/vendor/tinymemory/README.md` for the recall/fetch/store model, the `context.md` compiler and the conformance suite.
4. Read `OpenBot-main/shared/learning.ts` for the per-bot memory setting and its review default.
5. Read the plan's 005 REQ-001 to REQ-005 and its scope boundary.

## Findings

1. **004 — the word "computer" means two different things, and the plan is right to exclude the reference's.** OpenBot's computer is a browser container with a durable handoff: `HandoffStatus` is `waiting`, `taken`, `completed`, `cancelled`, `expired` or `interrupted`, `HandoffSource` is `model`, `cloudflare`, `visible-challenge` or `manual`, and `ComputerControlState` carries `holder: "bot" | "human"`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts:1-50] *(observed)* The plan's 004 is one prompt line naming a directory, a branch and a run folder, and it states that "The browser computer OpenBot ships stays out". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42] *(observed)* The plan is right. The risk is documentation: 013 must not let "computer exposure" read as "the computer", because a reader who opens `computer-control.ts` expecting the phase's subject finds a browser handoff instead.

2. **004 — the reference re-checks the world on a resume and the plan refuses the resume, and the plan's answer is the cheaper one.** `ComputerControlState.resumeSnapshotRequired` is documented as "A person had the page when the computer stopped, so they must check it before the Bot acts". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts:47-50] *(observed)* The plan's REQ-007 refuses a resume whose parked prompt names another working place, with the detail `the parked prompt names another working place`, and no child starts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:149] *(observed)* Both solve the same problem — a resume must not act on a world that moved. The plan refuses; the reference re-checks. The evidence supports the plan, because a file-backed run has no page to re-check and a refusal is the only answer it can enforce.

3. **004 — the reference has a restart-recovery rule the plan has no counterpart for.** `HandoffRequest.keepsPage` is "Set only on a request a restart interrupted while it still holds its page: the one case a later request may reopen that page. A stop or reset clears it, and so does the help TTL running out." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts:28-33] *(observed)* The plan's 004 covers a resume (REQ-007) and a run refused before or at the isolation step (REQ-008), and nothing about a run interrupted by a restart of the runtime itself. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:155] *(observed)* The reference's rule is narrow and worth mirroring as a sentence: only an interrupted run may reuse its working place, and a stop or a reset clears that permission.

4. **005 — the reference's memory is a budgeted compile, and the plan's byte bound is the same idea at a smaller scale.** tinymemory offers "recall, fetch and store over pluggable engines, a token-budgeted `context.md` compiled from whatever is stored". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/README.md:3-6] *(observed)* The plan's 005 is two files with a 60-entry and 3,600-byte bound and a prompt block. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150] *(observed)* The plan's byte bound is the reference's token budget with the tokeniser removed, which is the right call for a file a person also reads. The plan should cite the budgeted-compile idea as what it mirrors, because a builder who opens tinymemory will otherwise try to port an engine and a namespace tree.

5. **005 — the reference fixes memory scope at the host and the plan does the same, independently.** tinymemory's agent tools "let a model use memory without ever choosing whose memory it touches". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/README.md:3-5] *(observed)* The plan's 005 has a shared file and a per-identity file, and the bot never chooses which it reads. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:149] *(observed)* Two independent designs reached the same rule, which is the strongest evidence in this phase that the rule is right. Record it as confirmation, not as a gap.

6. **005 — the reference ships a conformance suite and an in-memory reference engine, and the plan has neither.** `tinymemory-api`'s `conformance` feature "adds the suite every engine must pass and an in-memory reference engine". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/README.md:33-36] *(observed)* The plan's 005 tests the file through the verb. A conformance suite plus an in-memory reference is the pattern for a store with a bound, because it separates "the bound is right" from "the file write is right". 012 should own it for 005 and 008, the two phases with a bounded store.

7. **005 — the reference's per-bot memory setting is three-state and the plan's is a boolean.** `LearningSettings.agents` is `Record<string, LearningTarget | null>` where "Missing inherits the default; null explicitly excludes this Bot". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/learning.ts:1-8] *(observed)* The plan's `memory` key is "a boolean, default true". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:120] *(observed)* A boolean cannot express "inherit" against "exclude" once a default can change under an existing definition. For a file-backed BOT.md with no inheritance chain the boolean is right, and the three-state matters only if a later phase adds a repository-wide default; 005 should record that condition rather than the gap.

8. **005 — the reference approves a memory proposal without review by default and the plan raises a needs-you item, and the plan is right.** `LearningSettings.autoApprove` is "Whether proposals are approved without a review. Only the personal edition reads it; there, missing means true." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/learning.ts:9-12] *(observed)* The plan's 005 raises a needs-you item to confirm a fact a bot proposes. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:40] *(observed)* The defaults are opposite and the plan's is the safe one: a memory entry is read into every later prompt as an operator-confirmed fact, so an unreviewed one is a claim the operator never made. This is the strongest 005 finding and 014 should name it as a deliberate divergence.

9. **005 — the plan closes the bot-writes-memory hole the reference leaves open.** The plan refuses the write forms under the child marker, "so a bot child cannot append a fact that every later prompt would read as one an operator confirmed", and leaves `--list` allowed. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:148] *(observed)* The reference's `autoApprove` default is the same hole from the other side: the bot's proposal lands without review. The plan's child-marker refusal is the mechanism the reference has no equivalent for, and it is the one line a builder must not drop when lifting the entry shape.

## Ruled Out

- **Reading `computer-control.ts` as 004's reference implementation.** The plan excludes the browser computer; the file is a handoff state machine for a page the plan does not have. Recorded as finding 1.
- **Porting tinymemory's engine or namespace tree into 005.** The plan's two files and one bound are the right size; the reference's three crates and a namespace tree are not. Recorded as finding 4.
- **A three-state `memory` key as a gap.** The plan's boolean is right for a file with no inheritance chain. Recorded as finding 7 with the condition that would change it.

## Dead Ends

- `OpenBot-main/docs/` has no memory document; the memory surface is `shared/learning.ts` and `docs/automatic-learning.md`. Do not look for `docs/memory.md`.
- `OpenBot-main/shared/computer-control.ts` as a source for the plan's working-place line — the two share only the word "computer".

## Edge Cases

- Ambiguous input: "computer exposure" and "memory" each name a different thing in the plan and in the reference. Selected interpretation: record the naming collision first, then compare the mechanisms the plan actually builds. Deferred: nothing.
- Contradictory evidence: none. The two defaults in finding 8 are opposite by design, not in conflict.
- Missing dependencies: `OpenBot-main/server/` is absent, so the Learning review path cannot be read. Fallback: the settings type, which states the default in its own comment. Confidence impact: the review *flow* is inferred from the type, not read.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts:1-50
- specs/system-skilled-bots/context/OpenBot-main/shared/learning.ts:1-30
- specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/README.md:1-40
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42-48,143-155
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:40-47,83,120-132,148-152

## Assessment

- New information ratio: 0.95
- Questions addressed: the topic's first question for phases 004 and 005.
- Questions answered: 004's naming collision, the resume-versus-recheck difference and the missing restart-recovery rule; 005's budgeted-compile mirror, the host-fixed scope confirmation, the conformance-suite gap, the three-state setting condition and the two opposite review defaults.

## Reflection

- What worked and why: fixing what each word means before comparing mechanisms. Both phases are named after a reference concept they do not implement, and a comparison that skipped that step would have produced four false gaps — a missing browser handoff, a missing memory engine, a missing namespace tree and a missing three-state key.
- What did not work and why: searching `OpenBot-main/docs/` for a memory document returned nothing, because the reference has no memory doc; its memory surface is a settings type and an automatic-learning doc. The search cost one call and taught the shape of the repo.
- What I would do differently: for a phase whose name is a reference word, read the plan's scope boundary first and the reference second, and write the naming difference down before any mechanism comparison.

## Recommended Next Focus

Phases 009-skills and 010-conversations, the two phases with the most reference surface left unread. The specific next reads are `openhuman-full/vendor/tinyskills/` for the bundle grammar 009 needs, and `OpenBot-main/docs/conversations.md` plus `shared/orchestration.ts` for 010. The open question this iteration leaves is whether 012 should own a conformance suite for both bounded stores (005's memory file and 008's secrets index) or whether each phase keeps its own.
