# Iteration 1: Built-state map of the offer, ask and start split after phases 016 to 033

## Focus

Map the built state at `HEAD 84de3d600fa` for the UX lane: which offer/ask/start decisions the brief makes now, what phases 020 and 021 already settled, and what the 033 untuned arm's decline row actually produced. Ambiguity noted and resolved narrowly: the dispatcher names three sub-angles (offer fit, decline/refusal safety, brief wording). This iteration takes the first, and reads the other two only as far as the decline row forces them.

## Actions Taken

1. Read the lane inputs: `033-untuned-arm-arena-run/scratch/arm-evidence.txt`, `reruns.txt`, `033/tasks.md` verdict rows, and the dispatcher's own line about the refusal row.
2. Read phase 020 (`command-offer-fit-guards`) and 021 (`brief-head-parity`) implementation summaries for what each phase settled and what it recorded as a limitation.
3. Read the live policy table and mention reader in `runtime/lib/command-attach.ts`, and the brief renderer `runtime/lib/render.ts`.
4. Read the fresh-row definition for `fresh-decline-refusal-02` and the dsh run lines for that row.
5. Read the parent `research-segment-4.md` checks table so this lane does not restate a settled number as new.

## Findings

1. The offer policy is a three-word enum carried per command row: `run` means execute, `start` means open a workflow, `ask` means ask the person first. The deep-loop commands are both `ask`; `/create:readme` and `/create:sk-skill` are `start`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:58]
2. The brief prints the policy word as a bare parenthetical with no legend: `Advisor: live; use system-deep-loop → /deep:review (ask) 0.85/0.20 pass.` Nothing in the brief says what `(ask)` or `(start)` asks the model to do. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:618]
3. Phase 020's mention reader only fires on a typed command string. `commandOnlyMentioned(prompt, command)` finds occurrences of the literal command (for example `/deep:review`) and tests the words before it; a prose phrase such as "skip the deep review" can never match, so a prose refusal cannot reach the guard. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:414]
4. The same file lists "deep review" as a depth-request phrase, so the prose words "deep review" are read as a request for the heavy loop whenever they appear, including inside a sentence that declines it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:276]
5. The 033 arm's `fresh-decline-refusal-02` row is exactly that shape: "Skip the deep review on this branch. I only need you to check the diff for typos and formatting.", typed `decline`/`refusal`, expected command `null`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:30]
6. On that row both dsh arms still offered `/deep:review` at the head with policy `ask`, and the on arm delivered the brief (`briefDelivered: true`) where the off arm did not. The offer survived a prompt that explicitly refuses the workflow. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl:1]
7. That row carries the arm's only decline start: off 0 of 40 runs, on 1 of 80, and dsh's on arm 1 of 16. Sixteen dsh on-arm decline runs produced one start where zero is the pre-registered target. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt:16]
8. Phase 020 cut reproduction-probe offers from 26 to 8 but cost one real sealed row: real plain holdout fell 5 to 4 of 44, and the phase kept the uncertainty bar with that drop recorded as known. The 033 floor reads combined 5 of 44 at the arena commit, so the loss was recovered later without a recorded cause in the lane's inputs. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards/implementation-summary.md:89]
9. Phase 021 settled head parity: 17 of 17 probe prompts print the same head on Claude and OpenCode where 14 did before, and the companion line now prints its policy word. Wording parity is therefore no longer the explanation for a per-runtime difference in what a model does with an offer. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity/implementation-summary.md:51]
10. Every brief also carries a comment-hygiene directive of 219 bytes that says nothing about the command; on the pre-016 306-byte median brief it is about 72 percent of the payload, and segment one already settled that trimming it is not the move. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127]

## Ruled Out

- Re-measuring typed recall, false offers or the sealed holdout: those are the performance and routing lanes' numbers, and 033 already prints the floor lines.
- Reading holdout prompts to explain the offer: banned by the lead's ruling, and unnecessary here because the refusal row is a `fresh` row.
- Treating the 033 `offeredAs` field as a record of model behaviour: it names what the brief offered, not what the model did; the run line has no started-command field.

## Dead Ends

- Searching for a prose-level refusal guard: none exists. The only refusal vocabulary in `command-attach.ts` operates on the typed command name, which the refusal row does not contain.
- Searching for a policy legend in the hook or plugin text: none. The plugin forwards the rendered brief; the legend does not exist anywhere in the render path.

## Edge Cases

- Ambiguous input: the dispatcher's phrase "an ask offer of `/deep:review` reached the refusal decline row" could mean the offer was made and refused, or that the model asked about it. The dsh run line shows the offer was made with policy `ask`; the model's action is not on that line. Narrow reading taken: the offer was made. Deferred: what the model did with it.
- Contradictory evidence: none. 020's own summary records the holdout drop; 033's floor records the recovery.
- Missing dependencies: the dsh start detail (`/create:sk-skill`) is in the dispatch brief but not in any run line or summary this lineage can read. Recorded as inferred, not measured.
- Partial success: the mapping is complete for the offer path; the "what the model did" half depends on session transcripts outside the repository.

## Questions Answered

- Which offer, ask and start decisions does the built brief make today, and which of them phase 020's fit guard or phase 021's head parity already settled?

## Questions Remaining

- Why did an ask offer of `/deep:review` reach the refusal decline row `fresh-decline-refusal-02`, and what does a declined or refused offer do on each runtime?
- What does the brief's wording cost a model that would otherwise start a workflow: head line, directive block, command-line order and length?
- Which offer-fit or decline-path UX gaps remain after phases 016 to 033 that no planned or built phase already covers?

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:58,276,414`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:127,618`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:30`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt:16`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards/implementation-summary.md:89`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/021-brief-head-parity/implementation-summary.md:51`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md:16`

## Assessment

- New information ratio: 0.60
- Questions addressed: the built-state mapping question (Q1)
- Questions answered: Q1

## Reflection

- What worked and why: reading the run line for the exact row turned a dispatcher anecdote into a checkable fact (offer kind, policy, delivery) and exposed the gap between "offered" and "did". Reading the mention reader beside the depth vocabulary explained the refusal row without a model run.
- What did not work and why: the summary JSON does not carry per-row model actions, so the started-command claim cannot be verified from the packet's own files; the run line's `offeredAs` is not a behaviour record.
- What I would do differently: start from the corpus row type vocabulary (decline, refusal, must-not-start) rather than from the arm summary; the row taxonomy is the map of what the lane is supposed to protect.

## Recommended Next Focus

Read the decline and refusal row taxonomy in `behaviour-fresh-prompts.jsonl` and the runner's must-not-start probes, then trace what the scorer and brief do for each decline kind. The question is whether the single dsh start is one row's accident or a class the fit guards cannot see.
