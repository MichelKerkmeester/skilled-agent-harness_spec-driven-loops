# Frozen rewrite mapping and exception list (2026-09-20)

Source of truth for the deterministic rewrite. Derived from the two W1 census reports
(`census-w1a.out` — packets 041-045; `census-w1b.out` — packets 046-050), reproduced by the
orchestrator against `git log` and the packet metadata where the reports disagree.

## 1. Destination map

| # | Former path (`specs/`) | New path (`specs/`) | Dest # | stable_id | created_at | git_first_add | status |
|---|------------------------|---------------------|-------:|-----------|------------|---------------|--------|
| 041 | `system-deep-loop/041-cli-pi-devpass-glm-route` | `system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/008-cli-pi-devpass-glm-route` | 008 | `cli-pi-devpass-glm-route` | 2026-09-05T10:59:12Z | 2026-09-05T16:34:20+02:00 | complete |
| 042 | `system-deep-loop/042-deep-loop-test-debt` | `system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/012-deep-loop-test-debt` | 012 | `deep-loop-test-debt` | 2026-09-05T11:40:23Z | 2026-09-05T15:36:51+02:00 | complete |
| 043 | `system-deep-loop/043-review-leaf-protocol` | `system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/005-review-leaf-protocol` | 005 | `review-leaf-protocol` | 2026-09-05T19:16:55Z | 2026-09-05T21:47:58+02:00 | complete |
| 044 | `system-deep-loop/044-cli-pi-devpass-deepseek-route` | `system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/009-cli-pi-devpass-deepseek-route` | 009 | `cli-pi-devpass-deepseek-route` | 2026-09-07T04:48:14.616Z | 2026-09-07T06:51:51+02:00 | complete |
| 045 | `system-deep-loop/045-fanout-write-containment-hardening` | `system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening` | 010 | `fanout-write-containment-hardening` | 2026-09-08T17:47:19Z | 2026-09-08T20:00:51+02:00 | complete |
| 046 | `system-deep-loop/046-synthesis-chat-presentation` | `system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/005-synthesis-chat-presentation` | 005 | `synthesis-chat-presentation` | 2026-09-11T14:03:05Z | 2026-09-11T19:44:00+02:00 | draft |
| 047 | `system-deep-loop/047-deprecate-skill-benchmark` | `system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/006-deprecate-skill-benchmark` | 006 | `deprecate-skill-benchmark` | 2026-09-11T17:07:53Z | 2026-09-11T19:53:21+02:00 | complete |
| 048 | `system-deep-loop/048-fanout-convergence-mode-flag` | `system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/008-fanout-convergence-mode-flag` | 008 | `fanout-convergence-mode-flag` | 2026-09-11T20:55:35.915Z | 2026-09-11T22:55:50+02:00 | complete |
| 049 | `system-deep-loop/049-deep-loop-alignment-review` | `system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review` | 013 | `deep-loop-alignment-review` | 2026-09-15T09:48:33Z | 2026-09-15T11:50:15+02:00 | complete |
| 050 | `system-deep-loop/050-spec-protocol-ledger-events` | `system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/009-spec-protocol-ledger-events` | 009 | `spec-protocol-ledger-events` | 2026-09-19T06:34:57Z | 2026-09-19T08:37:14+02:00 | complete |

Status column: the packet `spec.md` METADATA `**Status**` value (the closure authority, per the `028`
precedent where the gate overrides a stale derived status). `created_at`: `graph-metadata.json`
`created_at` of the packet root. `git_first_add`: oldest `--diff-filter=A` commit for the packet folder.
`045` keeps its 20 children and `049` its 17; only the parent path changes.

## 2. Rewrite rules (deterministic, path-anchored)

Applies to markdown only. Two replacement forms per packet, in this order:

1. `specs/system-deep-loop/<old-slug>` -> `specs/system-deep-loop/036-deep-loop-innovation/<parent>/<new-folder>`
2. `system-deep-loop/<old-slug>` -> `system-deep-loop/036-deep-loop-innovation/<parent>/<new-folder>`

Rule 2 covers track-relative values (`packet_pointer`, JSON values, prose) and is the same rewrite with
the `specs/` prefix optional. Both are anchored on the `system-deep-loop/` prefix, so they never touch
branch names, session ids or bare slugs that do not carry the path prefix. Rewriting is idempotent:
the new paths do not contain any old slug preceded by `system-deep-loop/`.

Target set (markdown, hit-driven):

- Live packet docs inside the ten moved trees: basenames `spec.md`, `plan.md`, `tasks.md`, `goal.md`,
  `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`.
- The five receiving parents' `spec.md` and the four `036` root docs are authored separately (step 7),
  not mechanically rewritten, so deliberate historical mentions stay intact.
- Inter-packet cross-references are covered by the same pass (e.g. `049/spec.md` names `048`).

Census-measured md-rewrite footprint (pre-move): 041=1, 042=1, 043=1, 044=1, 045=55, 046=3, 047=3,
048=4, 049=42, 050=2 -> 113 files.

## 3. Exception list (explicit leaves, with reason)

| Class | Files | Decision |
|-------|-------|----------|
| Ledger / run artifacts (md included) | `045` `research/`, `review/`, `review-archive/`; `049` `review/`; `050` `scratch/dispatch-receipts/`, `scratch/verification-*.md`; `046` lineage research docs; all `*.jsonl`/`*.log`/`*.out`/`*.err`/`*.patch`/`*.frame` | Leave. Append-only provenance; a merge rewrites no run record. |
| Containment snapshots | 743 slug-matching files under `.../containment/{baseline,quarantine}/...` in `specs/sk-communication` and `specs/cli-external-orchestration` | Leave. Recursive historical copies of already-covered artifacts. |
| Unsearchable paths | ~10 chains under `specs/cli-external-orchestration/071-.../research/lineages/swe2/containment/...` where the OS reports `File name too long (os error 63)` | Leave; bytes not inspected. |
| Retrieval pair | `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` | Leave; regeneration is a whole-corpus operation and would sweep the ~13.8k pre-existing unrelated working-tree deletions into this commit. Close-out item. Note: a concurrent session regenerated the three fixtures and staged them on 2026-09-20; this merge neither modified nor commits them. |
| Test fixtures | `runtime/cli/retrieval/fixtures/baseline-readme-verdicts.json` (sk-doc), retrieval corpus fixtures | Leave (my earlier note). No test reads the frozen corpus manifest against disk (verified: `trigger-index.vitest.ts` builds synthetic corpora; `measure-cold-lookup.mjs` is a measurement tool). |
| External live pointers | `specs/agents/009-turn-closeout-next-steps/spec.md` (2 lines) and `.../006-synthesis-presentation/spec.md` (1 line) | Leave for now. Out of `## Critical files` scope; the 2026-09-05 precedent left the analogous `specs/system-speckit/033/017` references untouched. Close-out item for operator decision. |
| External historical narrative | `specs/sk-doc/049-sk-create-frontmatter/009-.../implementation-summary.md`, `specs/system-speckit/033-.../{019-memory-decommission-branch-landing,030-spec-kit-simplification-research}/goal.md`, `specs/system-speckit/033-.../042-v4-doc-freshness/implementation-summary.md`, `specs/cli-external-orchestration/073-.../spec.md` (+ its derived JSON) | Leave. Each narrates a past event at a former path; rewriting would falsify the record. |
| Merge workspace | `036/scratch/merge-041-050/**` | Leave. The operation's own record; excluded from sweeps by design. |
| `.git/COMMIT_EDITMSG` | git-internal | Never touch. |

Additional findings carried to close-out (not blockers):

- `045` children `008`-`020` `goal.md` carry `_memory.continuity.packet_pointer: "scaffold/<child>"` - a
  pre-existing scaffold-era value, not an old session-slug path. Left as-is; noted for the operator.
- The audit found the same scaffold-era pointers under the alignment review: `goal.md` files `002`-`007`,
  `009`, `011`, `013`-`015`, `001-angle-driven-review/acceptance-criteria.md`, and the completion-message
  contract's `acceptance-criteria.md` (`scaffold/046-…`). Same class, same decision: left as-is.
- One nested continuity pointer keeps a `specs/` prefix where every other uses the track-relative form
  (`006-deprecate-skill-benchmark/acceptance-criteria.md:13`); validator-normalized, left as-is.
- `045/graph-metadata.json` still lists eight obsolete scaffold child slugs alongside the 20 live ones;
  derived JSON regenerated from disk in step 6 overwrites the stale list.
- W1b notes `047/plan.md:185` ("Remove `specs/system-deep-loop/047-…`") is an
  executable instruction whose meaning must survive the rewrite; the path-anchored rule preserves it.

## 4. Rewrite receipts and verification

Dry run writes `rewrite-plan.txt` (every occurrence: file, line, old text, new text; skips with reason).
Apply writes `rewrite-applied.txt` plus a `git diff --numstat` capture. Post-apply check: zero remaining
hits in live-doc class apart from the deliberate historical ones, and no file outside the allowlist touched.
