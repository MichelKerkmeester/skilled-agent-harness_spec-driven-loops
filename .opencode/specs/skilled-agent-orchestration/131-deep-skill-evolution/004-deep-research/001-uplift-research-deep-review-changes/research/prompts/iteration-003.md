# RCAF DEEP RESEARCH — ITERATION 3 — bilateral coverage verification

## ROLE
Expert verifier. Adversarially check whether the 27 ALREADY-DONE classifications from iter-2 actually shipped for deep-research. File:line evidence required.

## CONTEXT

Iter 3 of 10. Prior iters:
- Iter-1: catalogued 47 changes (C-001..C-047) across 11 types. 18 marked `bilateral: true`.
- Iter-2: classified 47 verdicts. 27 ALREADY-DONE; 3 APPLY (P1); 7 ADAPT (4 P1 + 3 P2); 10 SKIP.

Iter-2 may have **over-claimed ALREADY-DONE**. This iter VERIFIES each ALREADY-DONE claim by reading the actual deep-research artifact.

Read:
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/031-deep-research-uplift-research-deep-review-changes/research/iterations/iteration-002.md`
- `.opencode/specs/.../research/deltas/iter-002.jsonl`

## ACTION

**Step 1: For each of 27 ALREADY-DONE verdicts, verify**

For each C-NNN with verdict ALREADY-DONE, do:
1. Read the cited deep-research artifact (file path from iter-2's `target` field)
2. Confirm the artifact actually contains the claimed change
3. Verdict:
   - **CONFIRMED**: artifact has the change. Keep ALREADY-DONE classification.
   - **PARTIAL**: artifact has SOME of the change but not all. Reclassify to ADAPT (P1 or P2).
   - **MISCLASSIFIED**: artifact does NOT have the change. Reclassify to APPLY (P1).

Cite file:line evidence for each verification.

**Step 2: Sample-check 3 APPLY + 7 ADAPT verdicts**

For at least 3 of the APPLY verdicts and 3 of the ADAPT verdicts from iter-2:
- Re-verify the deep-research target file
- Confirm or refute the "needs uplift" claim
- Re-rate priority if needed

**Step 3: Identify gaps iter-2 might have missed**

Look at the 10 SKIP verdicts. For each, briefly justify why SKIP is correct (e.g. "deep-review-specific test fixture that doesn't apply to research dimensions"). If any SKIP seems wrong, reclassify.

**Step 4: Write iteration-003.md + iter-003.jsonl**

`.opencode/specs/.../research/iterations/iteration-003.md`:

```markdown
# Iteration 3 — Bilateral Coverage Verification (cli-devin swe-1.6)

## Summary
<paragraph: of 27 ALREADY-DONE: N confirmed, N partial, N misclassified>

## ALREADY-DONE Verification Results

| C-NNN | Iter-2 Verdict | Iter-3 Verification | Evidence |
|-------|----------------|---------------------|----------|
| C-NNN | ALREADY-DONE | CONFIRMED | <file:line + quote> |
| C-NNN | ALREADY-DONE | PARTIAL → ADAPT P1 | <gap evidence> |
| C-NNN | ALREADY-DONE | MISCLASSIFIED → APPLY P1 | <missing evidence> |
...

## APPLY + ADAPT Sample Re-Verification

<sample 6 checks: confirm priorities>

## SKIP Justifications

<for each SKIP: one-line reason>

## Updated Cumulative Counts

| Verdict | After Iter-3 |
|---------|--------------|
| APPLY | <count> |
| ADAPT | <count> |
| SKIP | <count> |
| ALREADY-DONE (confirmed) | <count> |

## Convergence Signal

- newFindings (reclassifications): <N>
- newFindingsRatio (vs cumulative): <N/47>
- coverage gate: PASS (all 47 re-checked or sampled)
```

`.opencode/specs/.../research/deltas/iter-003.jsonl`:
```jsonl
{"iter":3,"change_id":"C-NNN","prior_verdict":"ALREADY-DONE","new_verdict":"CONFIRMED|PARTIAL|MISCLASSIFIED","priority":"P0/P1/P2/null","evidence":"<file:line>"}
```

WRITE BOTH FILES via tool calls.

## FORMAT

- file:line citations mandatory
- direct grep / file content quotes
- DO NOT modify files outside `.../119-.../001-.../research/`

After writing both files, print:
`ITER-3 DONE: confirmed=<N>/27, partial=<N>, misclassified=<N>, new APPLY adds=<N>`
