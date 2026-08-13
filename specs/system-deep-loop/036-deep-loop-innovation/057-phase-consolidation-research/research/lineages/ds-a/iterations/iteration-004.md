# Iteration 4: timeline.md Design — Chronological Lineage That Survives Renumbering

## Focus
Design the `timeline.md` record so the "which spec folder was worked on first and which came after" lineage is durable across any renumbering. Derive the canonical order from git first-add timestamps + graph-metadata created_at, and specify schema + placement.

## Findings

### 1. Two timestamp sources exist and partially disagree
- **Git first-add** (`git log --all --follow --diff-filter=A` on each folder's spec.md, surviving the `.opencode/specs → specs/` flip at `606e55cb8a9`): 001 on 07-14; a big batch of 002-017 on 07-15/16; 018 on 07-20; 050 on 07-27; 019/020 on 07-29; 021 on 08-03; 022-032 on 07-31; 033 on 08-08; 035 on 08-07; 047-049 on 08-08; 051 on 08-12; 052 on 08-12; 053-056 on 08-13.
- **graph-metadata `derived.created_at`**: 001/002 on 07-15; 003-017 on 07-16; 018 on 07-19; 050 on 07-27; 019/020 on 07-29; 021 on 07-30; 022-032 on 07-31; 033 on 08-05; 035 on 08-07; 047-049 on 08-08; 051 on 08-12; 052 on 08-12; 053-056 on 08-13.
- Discrepancies: 021 git=08-03 vs gm=07-30; 033 git=08-08 vs gm=08-05; 018 git=07-20 vs gm=07-19. Because the whole 003-017 planning batch was committed nearly simultaneously (07-15/16) and graph-metadata created_at was written during planning (before execution), **neither source alone is a reliable "worked on" order** — git first-add reflects file introduction; created_at reflects spec creation. [SOURCE: git log + graph-metadata, see iteration-001.md]

### 2. Authoritative worked-order signal: `derived.last_save_at` + status
- `graph-metadata.json` `derived.last_save_at` is the best "actively worked" timestamp (continuity save events). Example spread confirms the remediation/execution wave: 016 saved 08-12, 017 saved 08-12, 051 saved 08-12 18:43, 052 saved 08-12 21:11, 053-056 saved 08-13 06:48 — i.e., execution order does NOT match folder number in the later wave (047-049 created before 050 but 050 saved later; 051-056 are newest). [SOURCE: graph-metadata last_save_at per child]
- But `last_save_at` can be backfilled by `generate-context.js` runs that touch the whole tree (many share identical save timestamps, e.g., 007-014 all saved 07-17 13:21), so it is a *bounding* signal, not a strict total order.

### 3. timeline.md design (concrete)

**Purpose:** a human+tool readable, append-only record of the true chronological order each spec folder was created and worked on, keyed by a stable identity that is NOT the folder number.

**Location:**
- Root: `specs/system-deep-loop/036-deep-loop-innovation/timeline.md` (the canonical lineage record).
- Per group parent (after consolidation): each new group parent gets a `timeline.md` scoped to its children. The root one remains canonical.

**Schema (markdown table, machine-parseable):**

```markdown
# Timeline — 036-deep-loop-innovation (chronological lineage record)
> Immutable identity record. Do NOT reorder rows; append only. Renumbering folders MUST NOT change this file.

| chrono_id | folder_slug | band | created_at | git_first_add | last_save_at | status | worked_order |
|-----------|-------------|------|------------|---------------|--------------|--------|--------------|
| T001      | 001-deep-loop-market-research | 000-foundation-and-planning | 2026-07-15T19:00:45Z | 2026-07-14T22:32:08+02 | 2026-07-17T13:31:05Z | complete | 1 |
| T002      | 002-deep-loop-effectiveness-and-fanout | 000-foundation-and-planning | 2026-07-15T19:00:46Z | 2026-07-15T18:45:50+02 | 2026-07-17T13:31:05Z | complete | 2 |
...
```

**Rules:**
1. **`chrono_id`** is the stable key (T001, T002, …) assigned once in the ORIGINAL folder order (git first-add date, tie-broken by folder number for the planning batch). Survives any renumber; it is the join key for migration.
2. **`worked_order`** is the derived execution sequence: git_first_add as primary, created_at as tie-break, last_save_at to break remaining ties; a `notes` column records anomalies (e.g., "part of 07-15/16 planning batch", "repaired/redone in remediation wave").
3. **`band`** column records the new group-parent after consolidation so the timeline doubles as a mapping table.
4. **Append-only invariant:** a new phase child appended at the END with the next chrono_id; never reorder existing rows. Renumbering a folder updates ONLY its `folder_slug`/`band` cells, never `chrono_id`/`worked_order`/created timestamps.
5. **Anti-drift:** the file is generated once (from git log + graph-metadata) and then reviewed; it is a *source document* for the migration mapping (iteration-3 table) so a renumber cannot lose the original order.
6. **Tooling:** a small generator could emit it, but the design requirement is that it exists and is append-only before any rename executes.

### 4. Worked-order (chrono_id) for all 44 children (derived)
1. 001 (07-14) — truly first
2. 002-017 planning batch (07-15/16; order 002→003→004→005→006→007→008→009→010→011→012→013→014→015→016→017 by folder number)
3. 018 (07-19/20)
4. 050 (07-27) — note: 050 was authored EARLY (07-27) despite its 05x number (renumbered later into the defect wave)
5. 019, 020 (07-29)
6. 022-032 (07-31; order 022→023→024→025→026→027→028→029→030→031→032)
7. 021 (07-30/08-03) — created with the 022-032 batch but first committed 08-03
8. 033 (08-05/08-08)
9. 035 (08-07)
10. 047, 048, 049 (08-08)
11. 051 (08-12)
12. 052 (08-12)
13. 053, 054, 055, 056 (08-13)

This is exactly the ordering a renumbering would destroy (050 before 019/020; 021 after 022-032; 047-049 after 033; 051-056 newest). The numbering DOES NOT reflect work order in the 02x-05x range — a key argument for the timeline record.

### 5. Where the migration plan consumes timeline.md
- The iteration-3 mapping table (old→new) must be cross-checked against timeline.md `chrono_id` so nothing is dropped or duplicated.
- After consolidation, the root `timeline.md` and each group-parent `timeline.md` are the only durable place the pre-renumber order survives.

## Assessment
- newInfoRatio: 0.85
- Novelty justification: Established the two-source discrepancy, selected last_save_at as the work-bound signal, defined the timeline.md schema/rules/placement, and produced the full 44-folder worked-order table that renumbering would destroy. Directly answers KQ4.
- Confidence: High (derived from git + graph-metadata; the exact tie-breaks are documented as rules for the generator).

## Reflection
- What worked: cross-referencing three timestamp sources exposed that numbering ≠ work order in the 02x-05x range.
- What failed / ruled out: relying on folder number or either timestamp source alone as the order.

## Recommended Next Focus
Iteration 5: Feasibility verdict (KQ1) consolidation: consolidate all findings into the final recommendation — is it worth it, which shape, what must be true to do it safely — and surface open risks (map-status drift for 053-056, phase-tree.json 17-vs-44, memory re-ingest ordering).
