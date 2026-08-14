# timeline.md — Reference Design (ds-a research deliverable)

> Design artifact produced by the ds-a fan-out research lineage. This is the PROPOSED schema/placement for the real `timeline.md` that must be generated and committed at `specs/system-deep-loop/036-deep-loop-innovation/timeline.md` BEFORE any consolidation rename executes. This file documents the design; it is not yet the canonical timeline.

## Purpose
Record the true chronological order in which each 036 spec folder was created and worked, keyed by a stable identity that is NOT the folder number, so the lineage survives any renumbering.

## Canonical location
- Root: `specs/system-deep-loop/036-deep-loop-innovation/timeline.md`
- After consolidation: one scoped `timeline.md` per group parent; root remains canonical.

## Schema
```markdown
# Timeline — 036-deep-loop-innovation (chronological lineage record)
> Immutable identity record. Do NOT reorder rows; append only.
> Renumbering folders MUST NOT change chrono_id / worked_order / created timestamps.

| chrono_id | folder_slug | band | created_at | git_first_add | last_save_at | status | worked_order |
|-----------|-------------|------|------------|---------------|--------------|--------|--------------|
| T001      | 001-deep-loop-market-research | 000-foundation-and-planning | 2026-07-15T19:00:45Z | 2026-07-14T22:32:08+02:00 | 2026-07-17T13:31:05Z | complete | 1 |
```

## Rules
1. `chrono_id` (T001, T002, …) is the stable key, assigned once in original git-first-add order (tie-break by folder number for the 07-15/16 planning batch).
2. `worked_order` is the derived execution sequence: git_first_add primary → created_at tie-break → last_save_at final tie-break; `notes` column records anomalies (planning batch, remediation rework).
3. `band` records the post-consolidation group parent so the timeline doubles as the old→new mapping.
4. Append-only: new children get the next chrono_id at the end; never reorder rows. A rename updates only `folder_slug`/`band`, never chrono_id/worked_order/timestamps.
5. Generated once from `git log --all --follow --diff-filter=A` + child `graph-metadata.json`, then reviewed and committed before any rename.

## Derived worked order (all 44 children)
1. 001 (git 2026-07-14) — truly first
2. 002→017 planning batch (07-15/16, by folder number)
3. 018 (07-19/20)
4. 050 (07-27) — authored early despite 05x number
5. 019, 020 (07-29)
6. 022→032 (07-31, by folder number)
7. 021 (created 07-30, first commit 08-03)
8. 033 (08-05/08-08)
9. 035 (08-07)
10. 047, 048, 049 (08-08)
11. 051 (08-12)
12. 052 (08-12)
13. 053, 054, 055, 056 (08-13)

## Why this survives renumbering
The current numbering already diverges from work order: 050 worked before 019/020; 021 after 022-032; 047-049 after 033. Without this record, a renumber irretrievably loses that order.
