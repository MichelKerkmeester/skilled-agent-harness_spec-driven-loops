# RCAF DEEP RESEARCH — ITERATION 7 — cross-finding adjudication

## ROLE
Adjudicator. Re-verify all P1 findings (uplift candidates + deep-research-specific gaps + adversarial defects) by reading cited file:line. Confirm or refute.

## CONTEXT

Iter 7 of 10. Cumulative findings to adjudicate:
- From iter-2 (118 applicability mapping): 3 APPLY P1 + 4 ADAPT P1 = 7 P1 candidates (cite specific C-NNN from iter-002 delta)
- From iter-4 (deep-research-specific gaps): 3 P1 (DR-001 reducer state validation, DR-002 progressive synthesis contract, DR-003 convergence detection)
- From iter-5 (adversarial): 1 P1 (DR-006 lexical sort bug at reduce-state.cjs:874)

Total ~11 P1 to adjudicate.

P2 findings (5-7) get a sample-check, not full adjudication.

## ACTION

**Step 1: Read prior iter findings**
- `iterations/iteration-002.md` for APPLY/ADAPT details
- `iterations/iteration-004.md` for DR-001..005
- `iterations/iteration-005.md` for DR-006..008

**Step 2: For each P1 finding, adjudicate**

For each finding:
1. Read the cited file at the cited line
2. Verify the issue
3. Classify:
   - **CONFIRMED**: real issue; keep P1
   - **OUTDATED**: was real but already resolved
   - **MISCATEGORIZED**: actually P2 (less severe than claimed)
   - **FALSE-POSITIVE**: not a real issue

**Step 3: Sample-check P2s**

Sample 3 of the P2 findings. Same classification.

**Step 4: Write findings**

`.../iterations/iteration-007.md` + `.../deltas/iter-007.jsonl`:

```jsonl
{"iter":7,"adjudicates":"DR-006","verdict":"CONFIRMED|OUTDATED|MISCATEGORIZED|FALSE-POSITIVE","evidence":"<quote>"}
```

After both files:
`ITER-7 DONE: adjudicated=<N>, confirmed=<N>, outdated=<N>, miscategorized=<N>, false-positive=<N>`
