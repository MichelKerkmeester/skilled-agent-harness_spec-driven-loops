# RCAF DEEP RESEARCH — ITERATION 3 — bilateral verify + P0 deep-dive

## ROLE
Adversarial verifier. (1) Confirm/refute each of the 4 ALREADY-DONE verdicts by reading deep-agent-improvement code. (2) Deep-dive on the 3 P0 APPLY findings to confirm severity is real.

## CONTEXT

Iter 3 of 10. Prior iters:
- Iter-1: 36 patterns catalogued across 17 types
- Iter-2: 8 APPLY / 2 ADAPT / 22 SKIP / 4 ALREADY-DONE; 3 P0 + 5 P1 + 2 P2

3 P0 findings is unusual (119 had 0). Verify they're real, not over-classified.

## ACTION

**Step 1: Re-read iter-2 outputs**
- `iterations/iteration-002.md` for context
- `deltas/iter-002.jsonl` for full verdict list

**Step 2: Verify each ALREADY-DONE (4 entries)**
For each P-NNN marked ALREADY-DONE:
1. Read the cited deep-agent-improvement file
2. Confirm the pattern actually exists there
3. Verdict: CONFIRMED / PARTIAL → ADAPT P1 / MISCLASSIFIED → APPLY P1

**Step 3: Deep-dive each P0 APPLY (3 entries)**
For each P0:
1. Verify the gap is real (deep-agent-improvement actually lacks this)
2. Verify severity is P0 (not P1/P2)
3. Quantify impact: what breaks WITHOUT this fix?

P0 criteria: would break current deep-agent-improvement runs OR introduces critical correctness issue. P1 = quality / hardening. P2 = nice-to-have.

If any P0 is over-classified, reclassify to P1.

**Step 4: Sample-check 3 of the 8 APPLY verdicts** (non-P0)
Re-verify priority + effort. Look for any that should be promoted to P0 or demoted to P2.

**Step 5: Write iter-003.md + iter-003.jsonl**

`.../iterations/iteration-003.md`:
```markdown
# Iteration 3 — Bilateral Verify + P0 Deep-Dive

## Summary
<paragraph>

## ALREADY-DONE Verification (4)

| P-NNN | Iter-2 Verdict | Iter-3 Verification | Evidence |

## P0 Deep-Dive (3)

### P-NNN — <title>
- Status: CONFIRMED / RECLASSIFIED
- Impact analysis: <what breaks WITHOUT fix>
- Evidence: <file:line>

## APPLY Sample Re-Verify (3)

<sample list>

## Updated Counts

| Category | After Iter-3 |
|----------|--------------|
| Confirmed P0 | <N> |
| Reclassified P0 → P1 | <N> |
| Confirmed P1 | <N> |
| Confirmed ALREADY-DONE | <N> |
```

`.../deltas/iter-003.jsonl`:
```jsonl
{"iter":3,"pattern_id":"P-NNN","prior_verdict":"ALREADY-DONE","new_verdict":"CONFIRMED|PARTIAL|MISCLASSIFIED","priority":"P0|P1|P2|null","evidence":"<file:line>"}
```

After both files:
`ITER-3 DONE: P0-confirmed=<N>/3, ALREADY-DONE-confirmed=<N>/4, reclassifications=<N>`
