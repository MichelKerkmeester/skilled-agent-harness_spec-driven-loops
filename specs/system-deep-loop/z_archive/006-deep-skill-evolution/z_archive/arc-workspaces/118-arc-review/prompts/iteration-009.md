# RCAF DEEP REVIEW — ITERATION 9 — cross-finding adjudication

## ROLE
Expert adjudicator. Verify prior findings (iters 1-8) by re-reading the cited file:line. Confirm or refute each P1.

## CONTEXT
Iter 9 of 10. Cumulative findings F-001..F-031: 0 P0 / 15 P1 / 14 P2. Convergence confirmed (last 4 iters: 1, 1, 4, 1 — averaging well below threshold).

## ACTION

This is an **adjudication iter** — not finding new issues, but VERIFYING prior P1 findings to filter out false-positives or stale ones.

For EACH P1 finding (F-001, F-002, F-005, F-006, F-010, F-011, F-014, F-015, F-016, F-017, F-021, F-022, F-026, F-027, F-028) — 15 P1 findings to adjudicate:

1. Read the cited file at the cited line
2. Verify the issue described in the finding is actually present
3. Classify as:
   - **CONFIRMED**: issue is real, fix is needed
   - **OUTDATED**: issue may have existed but is now resolved (e.g. F-001 path validation — was an ENV_ALLOWLIST added in commit f8f3bdcac6 that addresses this?)
   - **MISCATEGORIZED**: actually P2 not P1 (or vice versa)
   - **FALSE-POSITIVE**: not a real issue

For each adjudication, cite file:line evidence.

## OUTPUT

Write to `.opencode/specs/.../review/iterations/iteration-009.md`:
```markdown
# Iteration 9 — Cross-Finding Adjudication

## Summary
<paragraph: confirmed N, outdated N, miscategorized N, false-positive N>

## Per-Finding Adjudication

### F-001 [Missing path validation on CLI args]
- Status: CONFIRMED / OUTDATED / MISCATEGORIZED / FALSE-POSITIVE
- Evidence: <quote from file>
- Action: <keep / drop / reclassify-to-P2>

### F-002 [...]
...

(repeat for all 15 P1 findings)

## Adjudicated Severity Counts
- After adjudication: P0=0 P1=<confirmed_count> P2=<original_P2 + reclassified>
```

Also write `.opencode/specs/.../review/deltas/iter-009.jsonl` with one record per adjudication:
```jsonl
{"iter":9,"adjudicates":"F-001","verdict":"CONFIRMED|OUTDATED|MISCATEGORIZED|FALSE-POSITIVE","new_severity":"P0|P1|P2|drop","evidence":"<quote>"}
```

REQUIRED: write BOTH files via tool calls.

After writing:
`ITER-9 DONE: adjudicated=15/15, confirmed=<N>, outdated=<N>, miscategorized=<N>, false-positive=<N>`
