# Iteration 7: Claims audit, each load-bearing claim against two sources

## Focus

Register the lane's load-bearing claims as verified claims, each with the two independent sources that support it and the check that would falsify it, so the coverage graph's claim-verification signal rests on evidence rather than on the absence of a claim.

## Actions Taken

1. Listed every claim the lane's recommendations rest on.
2. Paired each claim with a code or corpus source and a measured or phase source.
3. Re-checked the two claims that had only one source class.
4. Registered the claims with their verification status and source edges.

## Findings

1. Claim C1, the mention guard only fires on a typed command: verified by the guard's own regex entry point and by the refusal row, which carries the prose phrase and still drew the offer on all five runtimes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:414]
2. Claim C2, five of eight fresh decline rows carry a command: verified by the fresh row definitions and by the per-row offer fields in the run lines, which agree exactly across five runtimes and both arms. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl:1]
3. Claim C3, the brief carries a command on 7 of 20 fresh plain rows and on none of the five ask rows: verified by the run lines on all five runtimes and by the corpus row labels that name the expected command and policy. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:16]
4. Claim C4, Claude starts none of its ten start-policy rows: verified by the per-policy summary block and by two raw run lines (`fresh-fit-01`, `fresh-fit-03`) that show the offer, exit 0 and zero changed paths. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/claude.jsonl:1]
5. Claim C5, the policy vocabulary is defined outside the brief: verified by the root doc's four-sentence definition and by the render, which prints the word without a definition. [SOURCE: AGENTS.md:68]
6. The one claim this lane could not verify to two source classes is the attention-dilution inference: the byte split is measured, but no arm moved the directive tail, so it stays an inference with a stated confirmation path and is not registered as a claim. [INFERENCE: from the 218-byte fixed tail and the absent A/B]

## Ruled Out

- Registering the attention-dilution inference as a verified claim: its evidence is one byte measurement and no behavioural contrast.
- Using a single source class for C3: the run lines and the corpus labels are independent records of the same row.

## Dead Ends

- A second measured source for the directive's effect on attention: none exists in the packet.

## Edge Cases

- Ambiguous input: "verified" could mean reproduced by a rerun or confirmed by two independent records. This lane uses the second meaning and says so.
- Contradictory evidence: none. The raw rows and the summary blocks agree.
- Missing dependencies: no rerun of the arm is possible in this lane.
- Partial success: C1 through C5 are registered; the inference is excluded by design.

## Questions Answered

- None new. All four lane questions were answered earlier.

## Questions Remaining

- None.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:414`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/claude.jsonl:1`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:16`
- `AGENTS.md:68`

## Assessment

- New information ratio: 0.20
- Questions addressed: the evidence status of each claim
- Questions answered: none new

## Reflection

- What worked and why: pairing a code or corpus source with a measured source per claim caught that the attention inference had only one class, which is why it is excluded rather than promoted.
- What did not work and why: the graph's claim signal treats a claim with no status as unverified, so an unregistered claim silently held convergence at zero; the fix is to register claims with their status, not to avoid claiming.
- What I would do differently: register claims as they are found instead of at the end.

## Recommended Next Focus

None. The lane is ready for synthesis.
