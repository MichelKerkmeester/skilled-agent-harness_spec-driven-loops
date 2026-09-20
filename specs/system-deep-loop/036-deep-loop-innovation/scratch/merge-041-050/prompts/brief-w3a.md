# W3a brief: mechanical audit of a completed packet-nesting merge

A structural merge is done and UNCOMMITTED in the working tree: ten packets moved from
`specs/system-deep-loop/041-…` … `050-…` into five group parents under
`specs/system-deep-loop/036-deep-loop-innovation/`, references were rewritten, derived JSON was
regenerated, and four root documents plus five parent maps were authored.

You are the independent mechanical auditor. You are read-only: write no files, run no shell commands
(you have only `read`, `grep`, `find`, `ls`). Reproduce or refute each numbered claim below from the
files themselves. Report per claim: VERDICT (CONFIRMED / REFUTED / PARTIAL), the evidence you used,
and — for anything unexplained — exactly what you found. Do not accept any number here as given.

## Destination map (ground truth)

| Packet | New location (`specs/system-deep-loop/036-deep-loop-innovation/…`) |
|---|---|
| 041-cli-pi-devpass-glm-route | `007-executor-and-cli-hardening/008-cli-pi-devpass-glm-route` |
| 042-deep-loop-test-debt | `006-runtime-docs-and-integrity-hardening/012-deep-loop-test-debt` |
| 043-review-leaf-protocol | `008-review-and-rollback-followup/005-review-leaf-protocol` |
| 044-cli-pi-devpass-deepseek-route | `007-executor-and-cli-hardening/009-cli-pi-devpass-deepseek-route` |
| 045-fanout-write-containment-hardening | `007-executor-and-cli-hardening/010-fanout-write-containment-hardening` |
| 046-synthesis-chat-presentation | `003-mode-contracts-migration-and-cutover/005-synthesis-chat-presentation` |
| 047-deprecate-skill-benchmark | `003-mode-contracts-migration-and-cutover/006-deprecate-skill-benchmark` |
| 048-fanout-convergence-mode-flag | `002-substrate-and-orchestration/008-fanout-convergence-mode-flag` |
| 049-deep-loop-alignment-review | `006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review` |
| 050-spec-protocol-ledger-events | `002-substrate-and-orchestration/009-spec-protocol-ledger-events` |

## Claims to test

1. **No old paths left in live documents.** A grep for `system-deep-loop/04[1-9]-` and
   `system-deep-loop/050-` over `specs/system-deep-loop/036-deep-loop-innovation/**/*.md`, excluding
   `/scratch/`, should yield hits in exactly three classes and nothing else: (a) preserved run records
   (any path containing `/research/`, `/review/` or `/review-archive/`), (b) `timeline.md` rows 64-73
   (`path_at_baseline` cells), (c) the merged-children block in `spec.md`. The orchestrator's count was
   447 hit lines: 432 run-record, 15 authored (5 `spec.md` + 10 `timeline.md`). Reproduce, classify,
   and report any line you cannot place in one of those classes. Also check that no file under a
   `/research/`, `/review/` or `/review-archive/` path was edited: those files must still carry the old
   path strings they carried before the move (a rewritten run record would be a defect).
2. **Metadata parentage.** For each of the ten destinations: `description.json.specFolder` and
   `graph-metadata.json.packet_id`/`spec_folder` equal the folder's canonical
   `system-deep-loop/036-deep-loop-innovation/<parent>/<folder>` id, and `parent_id` equals the
   containing parent's `packet_id`. Also check three descendants of your choice under `045`'s and
   `049`'s trees. Also check the markdown `_memory.continuity.packet_pointer` in each destination's
   first existing file of `implementation-summary.md`, `handover.md`, `spec.md`, `plan.md`,
   `tasks.md`, `decision-record.md`: it must already be the nested id, not the old top-level one.
3. **Parent and root inventories.** The five receiving parents' `graph-metadata.json.children_ids`
   equal their on-disk numbered children, and their `spec.md` PHASE DOCUMENTATION MAP tables list
   exactly those children with the expected new rows (002: 9, 003: 6, 006: 13, 007: 10, 008: 5).
   The 036 root lists exactly 28 direct children in both `graph-metadata.json.children_ids` and its
   `spec.md` PHASE MAP & OUTCOMES / PHASE DOCUMENTATION MAP tables; its 28 rows must not have grown.
4. **Per-packet file parity.** On-disk counts (md/json/other/total) for the ten, after the merge:
   041 4/2/1/7, 042 4/2/1/7, 043 4/2/1/7, 044 4/2/0/6, 045 278/202/338/818, 046 5/2/1/8,
   047 5/2/1/8, 048 4/2/0/6, 049 158/62/129/349, 050 7/4/1/12 — identical to the recorded pre-move
   census. Reproduce for all ten.
5. **Nothing else moved in.** Confirm there is no numbered directory left at the top level of
   `specs/system-deep-loop/` apart from `036-deep-loop-innovation` and `037-graph-engineering`, and
   that `z_archive/` is untouched. Confirm no file outside `036-deep-loop-innovation/` mentions any of
   the ten old paths in a way that changed (spot-check `.skilled/**/*.md` for old-path mentions:
   expected zero).
6. **Derived JSON freshness.** For the ten destinations and one descendant of each of 045/049, the two
   generated JSON files must be newer than the reference rewrite (their `lastUpdated`/timestamps
   differ from pre-move values is not enough — check the content reflects the nested path, which claim
   2 covers). Additionally: the parent `002`'s and `007`'s `graph-metadata.json` must name the new
   children in `children_ids` while keeping their existing manual relations (`depends_on`,
   `supersedes`, `related_to`) non-empty where they were non-empty before.

## Boundaries

- Read-only. No writes, no shell. Base every verdict on file content you actually read.
- Distinguish "file absent" from "value wrong"; report exact paths and line numbers.
- If a claim is only partly right, say which part and show what is true instead.
- Close with `W3A AUDIT COMPLETE` and nothing after it.
