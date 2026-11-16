# Iteration 4: The remaining UX gaps and what would confirm each fix

## Focus

The lane's final question: which offer-fit or decline-path UX gaps remain after phases 016 to 033 that no planned or built phase already covers. Each gap is tied to a row, a file line and a confirmation check, so the lead can build or decline it without re-deriving the evidence.

## Actions Taken

1. Read phase 023's sealed fit measurement to separate a known count from a new mechanism.
2. Read phases 024, 027 and 031 for the refusal and question work already built, and their own limitations.
3. Read the parent `goal.md` rows for B-5, the outcome target and the arm verdict.
4. Re-read the attach gates against the five offered decline rows to attribute each one.
5. Checked the packet for phases after 033 and found none.

## Findings

1. The decline offer rate is already a recorded, deliberately untuned number: phase 023 measured a command on 8 of its 24 sealed decline rows. The fresh set's 5 of 8 is the same defect on a second sample, and the arm's run lines show it is identical on all five runtimes and both arms. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence/implementation-summary.md:55]
2. The mechanism splits 4 + 1. Four offers are prose mentions the typed-command guard cannot see; the fifth is the named small-edit exclusion for `/create:changelog`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:494]
3. Recommendation R1: make the mention reader see the prose name a command's own depth phrase, so a sentence that declines "the deep review" is read as a refusal. Measured basis: 4 of the 8 decline rows lose their command. Confirmation: those four rows print no command through the render probe, typed recall stays 24 of 44, false offers stay 0 of 35, and real plain holdout stays at least 5 of 44. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:276]
4. Recommendation R2: add `/create:changelog` to the small-edit gated set. Measured basis: 1 of the 8 decline rows (`fresh-decline-small-edit-02`) and no other row in the fresh set. Confirmation: that row prints no command, and the tune rows that ask for a changelog keep theirs. Phase 020's own record is the caution: a wider gate failed three times before it was narrowed to three commands, so one command is the smallest extension that can be judged. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:339]
5. Recommendation R3: when the head is next changed, define the policy word once. The brief prints `(ask)`, `(start)` and `(run)` with no legend, and the same bytes produced 0 of 10 starts on Claude against 7 of 10 on dsh. This is not a separate change: B-5 (reword the head so the command reads as an option) is already waiting on the operator, so the legend belongs inside that decision, not beside it. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:231]
6. Recommendation R4: treat Claude's 0 of 10 start-policy starts as the largest measured start gap in the arm. It is not a wording gap, because the head is identical across runtimes and Claude capped none of the ten; the next evidence is a Claude-only run of those ten rows on the post-016 listing that already shows 44 of 44 commands. The causation belongs to the cross-CLI lane; the UX consequence is that `(start)` on Claude is an instruction the runtime may not let the model follow. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
7. Recommendation R5: restate the parent outcome target so offer-fit owns only the offer half. The one decline start began `/create:sk-skill` while `/deep:review` was offered, and dsh acted with no tracked workflow on 5 of its 28 on-arm rows; no offer-fit change can prevent a model inventing a different workflow. The target's "0 commands started on a decline row" therefore needs a second owner: the model's own path choice. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
8. No phase in this packet after 033 covers R1, R2, R3 or R4: the last phase is 033, the packet's next step is the segment-five research merge, and phase 031 names the decline rows as explicitly outside what the floors can measure. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/031-alignment-findings-remediation/implementation-summary.md:140]

## Recommendations

| Id | Change | Measured basis | Confirmation | Floor risk |
|----|--------|----------------|--------------|------------|
| R1 | Extend the mention reader from typed command names to a command's own depth phrase | 4 of 8 fresh decline rows lose their offer | The four rows print no command; typed 24 of 44, false offers 0 of 35, real holdout at least 5 of 44 | Medium: a real request that says "the deep review" in passing could lose its offer |
| R2 | Add `/create:changelog` to the small-edit gated set | 1 of 8 fresh decline rows | `fresh-decline-small-edit-02` prints no command; changelog tune rows keep theirs | Low: one command; phase 020's gate history is the caution |
| R3 | Define the policy word inside the B-5 head decision | 0 of 10 vs 7 of 10 starts at identical bytes; no legend in the render | A render test shows the legend; the B-5 arm judges the head | Low on bytes: the tail already carries 218 bytes |
| R4 | Measure Claude's start-policy silence on the ten rows after the listing fix | 0 of 10 starts, 0 capped, 44 of 44 commands visible | A Claude-only run shows any start above zero, or names the runtime limit | None to the other runtimes |
| R5 | Split the decline target between offer fit and model path choice | 1 substituted start; dsh 5 of 28 acted with no workflow | The next arm reports offers and starts separately on decline rows | None: a reporting change |

## Ruled Out

- Presenting the 8-of-24 decline offer count as new: phase 023 recorded it and left it untuned on purpose.
- A head rewrite as this lane's recommendation: B-5 already holds that decision with the operator.
- A policy legend as a standalone build: it costs bytes on every brief and belongs inside B-5.

## Dead Ends

- A phase after 033 that owns these gaps: none exists in the packet.
- A decline-row guard that could stop a substituted start: the start came from the model's own route, not from the offer.

## Edge Cases

- Ambiguous input: "no planned phase covers it" could mean the parent goal has no row for it. Checked: the goal records the 023 count and B-5, and records no row for R1, R2 or R4.
- Contradictory evidence: phase 023's 8 of 24 and the fresh set's 5 of 8 differ in rate because the samples and row mixes differ; both are offer counts, not start counts, and both are consistent with the mechanism.
- Missing dependencies: the fresh set and the sealed fit set are different samples; the lane cannot map one row-for-row onto the other without printing sealed text, so the two counts are reported separately.
- Partial success: R3 and R4 cannot be confirmed inside a read-only lane; their confirmation paths are named instead.

## Questions Answered

- Which offer-fit or decline-path UX gaps remain after phases 016 to 033 that no planned or built phase already covers?

## Questions Remaining

- None in this lane's key-question set.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence/implementation-summary.md:55`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/031-alignment-findings-remediation/implementation-summary.md:140`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:231`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:276,339,494`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt:1`

## Assessment

- New information ratio: 0.45
- Questions addressed: the gap inventory (Q4)
- Questions answered: Q4

## Reflection

- What worked and why: separating the recorded count (023) from the mechanism (typed-command-only guard) kept the lane from re-selling a known number as a discovery, and the row-by-row attribution made each recommendation measurable.
- What did not work and why: the sealed fit sample cannot be joined to the fresh sample without printing sealed text, so the two decline rates cannot be pooled honestly.
- What I would do differently: read the goal rows before the phase summaries; one goal line (B-5) would have kept R3 inside an existing decision from the start.

## Recommended Next Focus

Verification pass: check each recommendation's floor-risk claim against the tests and guards that already exist, and confirm that no recommendation contradicts a settled decision (trims, scores, Gate 2, the 44-command listing).
