# Iteration 3: What the brief's wording costs, measured against what models did

## Focus

The brief's wording cost: head line, directive block, command-line order and length. The test is whether the wording can explain a model that would otherwise start a workflow, using the byte measurements already captured and the arm's per-policy start counts rather than a new model run.

## Actions Taken

1. Re-read the render path for the head, the companion line, the directives label and the hygiene directive, and recomputed the fixed tail's byte size from the source string.
2. Read the live brief measurement (`medianBytes`, `medianHeadBytes`) from the residual-limits-4 capture.
3. Read the live head capture from phase 015 to see real head shapes.
4. Read the arm's per-policy rows/starts/writes per runtime in the on arm, and the start-policy comparison across arms.
5. Checked the token cap against the measured head size to rule truncation in or out.

## Findings

1. Every brief ends with a fixed 218-byte tail: a 12-byte `Directives:` label plus a 206-byte comment-hygiene directive. On the measured 306-byte median live brief that is 71 percent of the payload, and only 88 bytes are head. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127]
2. The command line itself is a small slice of the head: `system-deep-loop → /deep:review (ask)` is 39 bytes, and the scores plus `pass.` add about 15 more. The command, its owner and its policy are roughly 13 percent of a median brief. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:618]
3. The policy word is printed but never defined. The brief carries no legend for `(run)`, `(start)` or `(ask)`; the only explanatory block is the hygiene directive, which says nothing about commands. A model learns the policy vocabulary from its own context, not from the brief. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:133]
4. At identical brief bytes, start-policy starts differ by runtime in the on arm: Claude 0 of 10, OpenCode 5 of 10, pi 4 of 10, devin 5 of 10 and dsh 7 of 10. Since phase 021 made the head identical across runtimes and the render is one function, the wording cannot be the cause of that spread. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
5. Claude started none of its ten start-policy rows in either arm (off 0 of 10, on 0 of 10) and capped none of them. The advisor-on change added no start in that bucket, so its followed gain (4 of 28 to 6 of 28) came from run or ask rows. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt:1]
6. The ask word does not produce an ask reliably either: on the five ask-policy rows per runtime the on arm started 1 on Claude, 0 on OpenCode, 0 on pi, 2 on devin and 3 on dsh. The policy describes the command's risk, not the model's next action. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
7. The head is not truncated in practice: the token cap is 80 tokens, about 320 characters, against an 88-byte median head, so the command and its policy word always fit. Length is a payload question, not a truncation defect. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:104]
8. Inference, not measurement: a brief whose last sentence is an unrelated HARD BLOCK about code comments spends the reader's final attention on a rule that cannot help it act on the command. This would be confirmed by an A/B on the same rows with the tail moved or removed and the start rate compared; this lineage can read the bytes but cannot run that arm. [INFERENCE: from the 218-byte fixed tail at render.ts:127 and the per-policy start spread in summary-arm.json]

## Ruled Out

- Truncation as a wording defect: the cap is far above the measured head size.
- Head parity as a per-runtime explanation: phase 021 fixed it and the render is shared.
- Cutting the scores and pass mark: settled in segment three section 4 (f), not reopened here.

## Dead Ends

- A per-row brief text in the 033 run lines: they carry the offer fields, not the rendered string, so byte cost has to come from the separate captures.
- A policy-legend test in the repository: no test asserts that a reader can interpret `(ask)` or `(start)`.

## Edge Cases

- Ambiguous input: "wording cost" can mean bytes or comprehension. Both are reported: bytes are measured, comprehension is inference with a stated confirmation path.
- Contradictory evidence: none. The byte captures and the render source agree.
- Missing dependencies: the live brief measurement predates phase 021, which added the policy word to companion lines; the 218-byte tail is unchanged, so the share moves by a few bytes at most.
- Partial success: the per-policy table is read from the arm's summary rather than recomputed from run lines.

## Questions Answered

- What does the brief's wording cost a model that would otherwise start a workflow: head line, directive block, command-line order and length?

## Questions Remaining

- Which offer-fit or decline-path UX gaps remain after phases 016 to 033 that no planned or built phase already covers?

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:104,127,133,618`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/live-brief-ts.json:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/live-heads.txt:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt:1`

## Assessment

- New information ratio: 0.70
- Questions addressed: the wording-cost question (Q3)
- Questions answered: Q3

## Reflection

- What worked and why: putting the byte split beside the per-policy start spread turned a wording question into a disconfirmation. If the brief were the binding constraint, the identical bytes would not produce 0 of 10 on Claude and 7 of 10 on dsh.
- What did not work and why: the 015 live-head capture is pre-016 and cannot stand in for HEAD; it was used only for head shape, not for a current count.
- What I would do differently: pull the per-policy table before the byte table; it names which rows the wording has to move.

## Recommended Next Focus

Finish the gap inventory for the lane: the remaining offer-fit and decline-path gaps that phases 016 to 033 did not cover, each tied to a row, a file line and the confirmation check. The carry-forward candidates are the prose-refusal blind spot, the five-of-eight decline offers, the missing policy legend, and Claude's zero start-policy starts.
