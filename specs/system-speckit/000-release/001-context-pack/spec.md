# Phase 001 — Context Pack (deterministic, $0)

> Charter only. Full narrative in `../plan.md` §4 Phase 1. Expand to Level 1 when executed.

## Goal

Build the seed every downstream worker consumes — a deterministic, model-free extraction of the
`v3.6.0.0..HEAD` delta, grouped by the 8 release sections.

## Inputs

- `git log v3.6.0.0..HEAD` (2,826 commits, 97% conventional).
- The ~54 packet paths (`../plan.md` §3).

## Steps

1. Parse commits → records (hash, type, scope, subject, body).
2. Bucket by `(type, scope)`; map scopes → 8 sections.
3. Collapse revert / "restore-clobbered-by-sync" churn pairs (net-zero, exclude from public cut).
4. Segregate ~998 `docs` + internal numbered-scope commits from the public cut.
5. `git diff --stat v3.6.0.0..HEAD -- <paths>` per packet for magnitude.

## Output

- `context-pack.md` — categorized skeleton + per-packet path/diffstat map.

## Exit criteria

- Every commit in range accounted for (public cut + segregated internal).
- Every packet in §3 has a path map + diffstat entry.
