# gpt-5.5 xhigh fast Council Review — 026 Restructure Proposal

## Verdict (one-line)
REVISE_BEFORE_EXECUTING

## Per-dimension verdicts
1. Recall improvement: WEAK — iter 040 shows only 3 net hops saved across 5 queries, with 2/5 first-pick improvement and 1 regression. The proof points are useful, but not enough to justify the full restructure. They mainly prove semantic clustering helps large/cross-cutting areas, not that the whole plan improves recall.

2. Merge risk: CONCERN — the mitigations are directionally right, but the proposal over-includes. `resource-map.md` labels several items as “11 PROCEED” even where iter 045 says LOW_PRIORITY or REDESIGN. Specific concern: M1 is LOW_PRIORITY, M6 uses the wrong conservative target, M8/M9 are LOW_PRIORITY, and M10 assumes `000-release-cleanup` is small when the filesystem currently shows 59 child dirs.

3. Delete confidence: CONCERN — iter 048 properly downgrades many iter 030 “HIGH” delete candidates to archive/do-not-delete, but the proposal still phrases the section as “HIGH-confidence pure deletes” while listing archive candidates. Safe execution requires following iter 048’s blast-radius classes exactly.

4. Naming: NIT — noun/domain-first naming is the right convention. The top renames are mostly justified. Tighten final names before execution: use `014-local-embeddings-migration`, pick one of rename-vs-absorb for `015`, and keep `002-resource-map-deep-loop-fix` consistent across all docs/scripts.

5. Implementation cost: REDUCED — full plan cost is not justified by the measured recall gain. Execute high-confidence renames + PROCEED merges only, defer LOW_PRIORITY/REDESIGN work, and keep parent-doc rewrites atomic. Iter 045’s reduced variant claims about 40% effort saved for about 75% benefit; with the parent-doc rewrite and validation queries, that is the cheapest near-80% path.

6. Execution risks:
1. Path ambiguity around `014` - M3/M4 must target `007-code-graph/014-system-code-graph-extraction`, not top-level `014-local-embeddings-migration`. Mitigation: require a full old-path/new-path manifest before any move.
2. Stale parent assumptions - `000-release-cleanup` is not a 2-child wrapper in the current filesystem; it has 59 child dirs and duplicate `006`/`007` prefixes. Mitigation: recatalog `000` before M10, and defer absorbing `015` into it.
3. Delete/reference cleanup drift - iter 048 counts 150 cleanup operations and iter 029 is missing. Mitigation: archive DEEP candidates, delete only CONTAINED candidates in the first pass, and require ref-count proof before cleanup-required deletes.

## Recommended adjustments
- Adjustment 1: Fix the M3/M4 target wording everywhere — target is `007-code-graph/014-system-code-graph-extraction`, not “014 parent.”
- Adjustment 2: Remove LOW_PRIORITY/REDESIGN items from the “11 PROCEED” table. Specifically defer M1, M8, M9, and rewrite M6 to match iter 045’s `009/006 + 009/007 -> 009/002` target.
- Adjustment 3: Defer M10 (`015` into `000`) until `000-release-cleanup` is recataloged and renumbered. Current state contradicts the proposal’s 2-child assumption.
- Adjustment 4: Rewrite the delete section to use only iter 048 action classes: CONTAINED delete, SHALLOW/MEDIUM delete-with-cleanup, DEEP archive. Do not call archive candidates “pure deletes.”
- Adjustment 5: Strengthen recall proof before execution: add sample queries for skill-advisor routing, memory/indexer work, release/security audit, and 010-template-levels. The current 5-query set is too tailored.

## Cheapest variant (if proposing reduced)
- Reduced phase list: keep the 11-phase target as an information architecture, but do not force `015` under `000` yet. Accept a temporary 12-top-level state if that avoids corrupting `000-release-cleanup`.
- Proceed now: 4 top-level renames, corrected code-graph extraction consolidation, `004 -> 003` only with child preservation + decision record, corrected Copilot merge into `009/002`, `013/001 + 013/002`, `014/056 + 014/057`, and archive-only documentation cleanup.
- Defer: `010` rehomes, `014/052 + 053`, `007/035`, empty scaffold cleanup under `010`, `008-skill-advisor` internal restructuring, M10 `015 -> 000`, and all cleanup-required deletes beyond CONTAINED.
- Estimated effort savings: roughly the iter 045 estimate, about 40% less effort than the full plan, while preserving most of the recall gain.

## Final recommendation
Halt and revise the resource-map/spec before execution. Then execute the reduced variant above, with exact path manifests and iter 048 delete classes treated as hard constraints.

COUNCIL_REVIEW_999_COMPLETE