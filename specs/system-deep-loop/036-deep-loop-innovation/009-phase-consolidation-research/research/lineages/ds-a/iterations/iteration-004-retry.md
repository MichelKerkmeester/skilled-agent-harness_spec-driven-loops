# Iteration 4 (Retry): Re-verify timeline.md Design — Chronological Lineage Survival

## Focus
Re-verify the existing iteration-004.md evidence for the timeline.md design (chronological lineage survival under renumbering). Do not broaden scope. Independently confirm each load-bearing claim retained: (a) two timestamp sources exist and partially disagree; (b) `derived.last_save_at` is the work-bound signal; (c) the timeline.md schema/rules/placement; (d) the worked-order (chrono_id) table for all 44 children; (e) how the migration plan consumes timeline.md. Prior iteration-004.md and its state row are immutable evidence.

## Actions Taken
1. Read prior evidence: `iteration-004.md`, lineage `timeline.md` (design artifact), `findings-registry.json`, parent `graph-metadata.json`, and the iter-003 delta as the schema template. [Read]
2. Independently extracted `derived.created_at` / `derived.last_save_at` / `status` from every 036 child `graph-metadata.json` (all 44, Python batch). [Bash]
3. Re-derived git first-add dates (`git log --all --follow --diff-filter=A` on each `spec.md`) for 22 folders spanning every worked-order band, including all anomalous members (001, 018, 019, 020, 021, 022, 023, 032, 033, 035, 047, 048, 049, 050, 051, 052, 053, 054, 055, 056). [Bash]
4. Confirmed the prior lineage `timeline.md` design artifact (schema, rules, worked-order table) is internally consistent with the re-derived data.

## Findings

1. **Two-source discrepancy confirmed for 018 and 033; NOT confirmed for 021 (correction).**
   - 018: git first-add 2026-07-20 vs graph-metadata created 2026-07-19 — confirmed. [SOURCE: git log; 018-drift-census-and-plan-revalidation/graph-metadata.json]
   - 033: git first-add 2026-08-08 vs graph-metadata created 2026-08-05 — confirmed. [SOURCE: git log; 033-identity-and-lock-ownership-hardening/graph-metadata.json]
   - 021: prior evidence claimed git=08-03 vs gm=07-30. Independent re-derivation on the `spec.md` anchor gives **git first-add = 2026-07-30**, matching graph-metadata created 2026-07-30T19:43:41Z. The 08-03 value is not reproducible on the spec.md anchor and must have come from a different tracked file or flag. [SOURCE: git log 021-completion-evidence-reconcile/spec.md; 021-completion-evidence-reconcile/graph-metadata.json]. This changes nothing about the *conclusion* (numbering ≠ work order) but invalidates one cited discrepancy and forces the anchor-file rule below.

2. **`derived.last_save_at` work-bound signals confirmed exactly.**
   - 015/016/017 saved 08-12 10:48 (whole-system-gate closeout cluster); 051 saved 08-12 18:43:57; 052 saved 08-12 21:11:53; 053-056 saved 08-13 06:48:30-31. The backfill-timestamp cluster is also reproduced: 007, 008, 010, 011, 012, 014 all share last_save_at 07-17 13:21 (generated-tree save), confirming `last_save_at` is a bounding signal, not a strict total order. [SOURCE: per-child graph-metadata.json, Python extraction]

3. **Worked-order / chrono_id thesis confirmed: numbering diverges from work order in the 02x-05x range.**
   - 050 authored 07-27 (created 2026-07-27T16:10:09Z, git first-add 07-27) — before 019/020 (07-29) and before the 022-032 batch (07-31). 047-049 created 08-08 after 035 (08-07). 051/052 (08-12) and 053-056 (08-13) are the newest. The 001 first-add of 07-14 and the 002-017 planning batch on 07-15/16 are reproduced. [SOURCE: git log; per-child graph-metadata.json]

4. **timeline.md design (schema, rules, placement) confirmed internally consistent** with the re-derived data, with one required refinement:
   - The 021 anchor ambiguity means rule 2 (worked_order derivation) MUST pin the git anchor: `git_first_add` = first-add date of `spec.md`, or the earliest first-add across all tracked docs if spec.md was added later (record `git_first_add_anchor` explicitly). Without an anchor-file rule the 021-type discrepancy is non-deterministic. [INFERENCE: based on the 021 re-derivation and iteration-004 schema rules 1-2]

5. **Migration-consumption of timeline.md confirmed as designed** — the iteration-3 old→new mapping is cross-checked against chrono_id so nothing is dropped or duplicated; root `timeline.md` + per-group-parent `timeline.md` are the only durable pre-renumber order. This design already exists as a lineage deliverable at `research/lineages/ds-a/timeline.md` (proposal artifact, not yet canonical). [SOURCE: lineages/ds-a/timeline.md; iteration-004.md:63-65]

## Questions Answered
- KQ4 (retained answer, re-confirmed): timeline.md design is an append-only table keyed by stable chrono_id with created_at / git_first_add / last_save_at / worked_order; generated from git first-add + graph-metadata before any rename; renames update only folder_slug/band. Refinement: git_first_add must be anchor-pinned to spec.md.

## Questions Remaining
- None new within this focus. (Open item already recorded elsewhere: exact file/anchor that produced the prior 021 git=08-03 value — resolved by the anchor-file rule.)

## Assessment
- New information ratio: 0.30
- Novelty justification: Confirmation-dominant retry of iteration-004; 4 of 5 findings re-confirm prior evidence, 1 finding (021 git anchor) is a factual correction that yields one design refinement (anchor-file rule) — the only genuinely new information.
- Confidence: High (all timestamps independently re-derived from git log and on-disk child graph-metadata).

## Sources Consulted
- `specs/system-deep-loop/036-deep-loop-innovation/graph-metadata.json` (parent: created 07-16, last_save 08-09, 44 children_ids)
- `specs/system-deep-loop/036-deep-loop-innovation/{001,018,019,020,021,022,023,032,033,035,047,048,049,050,051,052,053,054,055,056}-*/graph-metadata.json`
- `git log --all --follow --diff-filter=A --format=%ad --date=format:%Y-%m-%d` per spec.md (22 folders)
- `specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-a/timeline.md`
- `.../ds-a/iterations/iteration-004.md` (immutable prior evidence)
- `.../ds-a/findings-registry.json`, `.../ds-a/deltas/iter-003.jsonl` (schema template)

## SCOPE VIOLATIONS
- None. All writes confined to the three allowed paths (retry narrative, state JSONL append, delta file). No investigated file, reducer-owned file, or timeline.md was modified.

## Next Focus
None — KQ4 already answered; this retry repaired the missing delta artifact and route-proof. The reducer may mark the 021 anchor refinement for inclusion in the final synthesis / migration-plan execution rules.
