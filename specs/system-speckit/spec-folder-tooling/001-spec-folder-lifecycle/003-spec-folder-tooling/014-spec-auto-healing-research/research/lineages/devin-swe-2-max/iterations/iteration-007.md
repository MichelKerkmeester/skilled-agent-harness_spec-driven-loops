# Iteration 7: Q1 close - the worker-lane playbook is the residual repair contract

## Focus

Verify what repair classes the 43 worker-lane briefs cover beyond the six scripts, and complete the one-off-to-owner ownership table.

## Actions Taken

1. Re-read `steer.md` (contract refresh).
2. Read `fix-lanes/batch-01.task` through `batch-05.task` in full; listed all 43 task files.
3. Normalized batch numbers and hashed all 43 briefs - confirmed a single identical playbook.
4. Counted folders: 43 lanes covering exactly 474 folders, matching detail3.txt's residual set.

## Findings

1. All 43 lane briefs carry ONE identical 9-rule playbook (normalized md5 all equal), applied to exactly 474 folders - the residual after scripted fixes drained the derivable classes. The playbook is the de-facto repair contract the permanent tooling does not yet implement. CONFIRMED [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-lanes/batch-01.task (identical modulo batch number in all 43)]
2. The playbook's governing invariant is "Never change what a document says. Add or move structure only: anchor markers, template header comments, frontmatter fields" - the same boundary heal-spec-docs and repair-derived enforce, which means the whole playbook is automatable in principle, not only in the six classes already scripted. CONFIRMED [SOURCE: batch-01.task rule 1]
3. Rule-by-rule ownership map: (a) anchor wrap/renumber -> fix-dup-anchors port + heal-spec-docs anchor matching; (b) missing-doc reconstruction "from spec.md and git log --follow" with a dated `> Reconstructed on ...` line and "Not recorded" placeholders -> partially mechanical (skeleton is derivable; git-history fill is agentic); (c) broken link repoint-or-unlink -> mechanical; (d) generic trigger phrase -> slug+kind rewrite (template-phrase-cleanup already did the template-default subset); (e) continuity placeholders -> constants, archive-aware; (f) impl-summary status follows spec.md -> directional sync; (g) invalid level -> folder-structure.md sec 3 inference; (h) missing template header -> heal-spec-docs already owns it. CONFIRMED [SOURCE: batch-01.task rules 2-9; heal-spec-docs.cjs:36-56]
4. The lanes also encode operational discipline worth keeping: validate only your own folders, never hand-edit graph-metadata.json or description.json, always run repair-derived --folder --apply after edits, at most three validation rounds per folder, report unresolved residue per folder. These are exactly the properties upgrade-legacy already enforces structurally (doc edits first, derivation last, per-folder reporting). CONFIRMED [SOURCE: batch-01.task preamble + gate; upgrade-legacy.mjs:378-415]
5. No repair class in the residual 474 lies outside the playbook's nine rules - meaning the permanent-tool coverage gap is precisely enumerable: rules 3 (doc reconstruction), 4 (links), 5 (generic phrases), 6 (continuity placeholders), 7 (status sync), 8 (level inference into docs) have no scripted owner today; rules 2 and 9 are partially owned. CONFIRMED (by playbook enumeration vs the six scripts + heal-spec-docs + repair-derived surfaces)
6. The reconstruction rule's dated note is the honest version of doc creation - "It was not written at the time" plus "Not recorded" for anything sources do not show. It satisfies the research's never-invent-history constraint only because the date is the repair date and unverifiable content is marked absent rather than fabricated. Any automation of rule 3 must keep both. CONFIRMED [SOURCE: batch-01.task rule 3]

## Ruled Out

- Fully automating rule 3 (missing-doc reconstruction) end-to-end: the git-history fill portion requires judgment about what "the folder's own spec.md and git log" show; automating only the honest skeleton (template + dated note + Not recorded) is the safe subset.
- Teaching repair-derived the doc-side rules (links, phrases, status sync): wrong tool - it owns derived facts, not document structure; these belong to a heal-spec-docs-family surface.

## Dead Ends

- The `detail/` subdirectory of the scratchpad is empty (0 files) - the per-batch .detail files carry the content.

## Edge Cases

- The playbook's rule 8 sends agents to `references/structure/folder-structure.md` section 3 for level inference - a manual lookup that should be a function (doc set -> level), mirroring how repair-derived already infers description.json level from declared markers.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R7.1 | Promote the 9-rule playbook into a documented "structural healing contract" inside heal-spec-docs.cjs's README (or a new HEALING.md), then implement the mechanical rules: 4 (repoint-or-unlink), 6 (continuity placeholders, archive-aware), 7 (impl-summary status follows spec.md), 5 (generic-phrase rewrite to slug+kind) | Q1 | heal-spec-docs.cjs + README or new HEALING.md | M | Med: doc-structure edits; keep structure-only invariant + provenance note on every write | heal-spec-docs.cjs, docs, tests | batch-01.task rules 1,4-7; heal-spec-docs.cjs:1-56 | CONFIRMED contract, INFERRED effort |
| R7.2 | Add a `--reconstruct` mode that creates a missing required doc as skeleton-only: matching template + `> Reconstructed on <date> ... It was not written at the time.` + "Not recorded" placeholders; never fills content. Human/agent fill stays manual | Q1, Q3 | heal-spec-docs.cjs or a `reconstruct-doc` step in upgrade-legacy | M | Med: creates files (still reversible via git; content is honest-skeleton by construction) | healer + upgrade step + tests | batch-01.task rule 3 | CONFIRMED need |
| R7.3 | Extract level inference (existing docs -> level) as a shared lib used by repair-derived's level fix and any doc-side level repair, replacing rule 8's manual lookup | Q1 | new small lib + repair-derived + healer | S | Low: read-only inference shared | lib + two callers | batch-01.task rule 8; repair-derived.cjs:174-189 declaredLevel | CONFIRMED |
| R7.4 | Keep the lane discipline as permanent upgrade-legacy behavior documentation: doc edits before derivation, per-folder residue report, bounded repair rounds | Q1 | README-repair-derived.md or upgrade-legacy header docs | S | Low: docs | docs | batch-01.task gate section | CONFIRMED |

Idempotency/reversal/meaning: all four keep dry-run-first, skip-when-equal, structure-only edits, and honest-skeleton reconstruction. Rule-3 automation writes new files - reversible via git, and the dated note prevents provenance fraud by construction.

## Sources Consulted

- `steer.md`
- `scratchpad/fix-lanes/batch-{01..43}.task` (identical playbook, verified by normalized hash)
- `scratchpad/fix-lanes/batch-{01..43}.txt` (474 folders total)
- `scratchpad/detail3.txt` (residual census reference)
- `heal-spec-docs.cjs`, `repair-derived.cjs`, `upgrade-legacy.mjs` (prior reads)

## Assessment

- New information ratio: 0.75 (finding 1-3,5-6 new; 4 consolidates)
- Questions addressed: Q1 fully mapped - six scripts + nine playbook rules all have owner or gap assignments
- Questions answered: Q1 (ownership table complete; recommendation set R4.1, R6.1-R6.6, R7.1-R7.4)

## Reflection

- What worked: hashing the 43 briefs after normalization proved the playbook is singular - one contract, not 43 ad-hoc ones.
- What did not: nothing.
- Do differently: earlier enumeration of the lane dir would have avoided re-reading briefs.

## Recommended Next Focus

Iteration 8 (Q3 deep): how `/doctor:update` could schedule corpus healing - examine `release-update.cjs` apply verification steps and where an upgrade-legacy dry-run would slot; check `changed-packet-validation.yml` for the CI-side equivalent.
