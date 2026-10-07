# Iteration 6: Q1 - mapping each phase-013 one-off to its permanent owner

## Focus

Read every one-off scratchpad repair script and map it to the permanent tool that should own its function, including coverage gaps where no tool exists.

## Actions Taken

1. Re-read `steer.md` sections 0-2.
2. Read `fix-dup-anchors.mjs`, `add-fm-fields.mjs`, `fix-specfolder.mjs`, `dup-survey.mjs`, `citecheck.mjs`, `census.mjs` in full.
3. Read `repair-derived.cjs` lines 60-438: DERIVABLE/REDERIVABLE allow-lists, `fixDescriptionLevel`, `fixRecordedLocation`, `rederive`, FROZEN_TREES, arg contract.
4. Listed the scratchpad for the remaining lane machinery.

## Findings

1. `fix-dup-anchors.mjs` is a well-specified document-structure healer: pairs markers per id by most-recent-open, deletes a later pair only when it is glued to other anchor markers AND overlaps another pair (a stray template copy), renumbers non-overlapping later pairs `<id>-2/-3`, leaves anything else to a leftovers report; prose is never touched and unmatched-marker files are refused outright. Its dry-run/`--apply` split already matches the fleet's contract. CONFIRMED [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs:1-89]
2. `add-fm-fields.mjs` is largely subsumed by `upgrade-legacy.mjs`'s `fillMissingFrontmatter` (managed set already includes importance_tier and contextType) - except one semantic advantage: it copies the value from the same packet's spec.md before falling back to constants, preserving authored intent that a template default would overwrite. CONFIRMED [SOURCE: scratchpad/add-fm-fields.mjs:1-14,40-52; upgrade-legacy.mjs:313-360]
3. `fix-specfolder.mjs` repairs a derived-from-disk fact - `description.json`'s `specFolder` - that `repair-derived.cjs` does NOT cover: `fixRecordedLocation` only repairs implementation-summary.md's Spec Folder row and `packet_pointer:` frontmatter in five doc names; no code path writes description.json's specFolder field. CONFIRMED gap [SOURCE: scratchpad/fix-specfolder.mjs:1-22; repair-derived.cjs:279-322 (location fix surface),237-277 (level fix only touches `level`)]
4. CONTRADICTION (both sources recorded): repair-derived's FROZEN_TREES comment argues archived snapshots' recorded location is "deliberately the old one, so 'repairing' it ... destroys the very thing the copy was kept to preserve", yet the validator's path-consistency rule keeps failing archived packets whose recorded path differs from disk, and phase 013 chose the validator's side (fix-specfolder.mjs rewrote specFolder inside archives). Either the freeze rationale is wrong about the archive contract or phase 013 falsified 1,935 snapshots' provenance. [SOURCE: repair-derived.cjs:386-389; scratchpad/fix-specfolder.mjs header + apply logs]
5. `citecheck.mjs` is a standalone linter for the `[SOURCE: path:line]` citation contract this lineage itself uses - path existence plus line-range bounds, malformed-citation census. It has no permanent home; it currently lives only in scratchpad. CONFIRMED [SOURCE: scratchpad/citecheck.mjs:1-34]
6. `dup-survey.mjs` and `census.mjs` are read-only diagnostics (duplicate-anchor shape census; NNN-folder packet census including `created_at` provenance and containment-quarantine counts). They produced the evidence that sized the repair but have no operational role afterward. CONFIRMED [SOURCE: scratchpad/dup-survey.mjs:1-21; census.mjs:1-38]
7. The lane machinery (`val-one.sh`, `val-detail.sh`, `fix-queue.sh`, batch task files) reimplements what `upgrade-legacy.mjs` already does - validate-all with a worker pool, batched repair, per-folder reporting - but produces the `### folder / x RULE` grouped-detail report format that drove the whole campaign. CONFIRMED [SOURCE: upgrade-legacy.mjs:257-269,378-415; scratchpad/val-detail.sh]
8. `repair-derived.cjs` internals show hardened craft worth keeping as the pattern: atomic tmp+rename writes preserving file mode (writeAtomic), frontmatter-open regex that skips leading comments/BOM, SPEC_DOC_INTEGRITY repaired only in its recomputable failure mode, `beyond` classification so a clean run is a finding not a definition. CONFIRMED [SOURCE: repair-derived.cjs:69-74,108-115,214-235,353-358]

## Ruled Out

- Keeping the one-offs in a shipped `scripts/` directory as-is: they all hardcode campaign context (TSV inputs, leftover-report side files, scratch paths) and duplicate contracts the permanent tools already enforce; porting the logic beats shipping the scripts.
- Treating `dup-survey.mjs`/`census.mjs` as product features: diagnostics sized this repair; permanent census belongs to the doctor reporting surface, not the corpus repair path.

## Dead Ends

None.

## Edge Cases

- Contradictory evidence: finding 4 (archive recorded-location semantics) is unresolved in the codebase; the validator and repair-derived disagree about whether an archived packet's recorded path should match disk. Phase 013 already picked the validator's interpretation operationally.
- fix-specfolder's `NO FIELD` skip shows the corpus contains description.json files with no specFolder key at all - a shape the permanent tool must report, not invent.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R6.1 | Add a description.json `specFolder` repair to `repair-derived.cjs` beside fixRecordedLocation (derived-from-disk fact, preserve JSON indent + trailing newline, `NO FIELD` reported-not-invented) | Q1 | repair-derived.cjs new fixer + allow-list stays DESCRIPTION_SHAPE | S | Low-Med: JSON field write; keep atomic write + idempotent skip | repair-derived.cjs, tests | fix-specfolder.mjs:1-22 as spec; repair-derived.cjs:237-322 pattern | CONFIRMED gap |
| R6.2 | Port `fix-dup-anchors.mjs` triage (glued+overlapping -> delete; non-overlapping -> renumber; else report) into a `spec/heal-anchors` module run inside upgrade-legacy's doc-edit phase, before heal-spec-docs | Q1 | new module + upgrade-legacy.mjs step list | M | Med: marker surgery must keep "prose never touched" and unmatched-refusal | new module, upgrade-legacy.mjs, tests | fix-dup-anchors.mjs:1-89; upgrade-legacy.mjs:378-415 | CONFIRMED fit |
| R6.3 | Port add-fm-fields' sibling-inheritance value source into upgrade-legacy's fill-frontmatter: look up missing importance_tier/contextType in the same packet's spec.md before template defaults | Q1 | upgrade-legacy.mjs fillMissingFrontmatter | S | Low: narrower fallback order only | upgrade-legacy.mjs | add-fm-fields.mjs:6-14; upgrade-legacy.mjs:313-360 | CONFIRMED |
| R6.4 | Promote `citecheck.mjs` into a permanent linter under the deep-loop or spec CLI (checks [SOURCE: path:line] refs resolve); wire into research-lineage completion checks | Q1, Q5 | new `cli/lint-citations.mjs` + research workflow check | S | Low: read-only | new module, workflow refs | citecheck.mjs:1-34 | CONFIRMED utility; INFERRED home |
| R6.5 | Resolve the archive-location contract conflict in docs: decide whether an archived packet's recorded path is snapshot-provenance (repair-derived's claim) or must equal current disk path (validator's rule), and record the decision in README-repair-derived.md + validation-rules.md before any archive-repair recommendation lands | Q2, Q3 | two docs | S | Low: docs only, but gates R6.1's archive scope | README-repair-derived.md, validation-rules.md | finding 4 evidence | CONFIRMED conflict |
| R6.6 | Give `upgrade-legacy.mjs` a `--report` / grouped-detail output (### folder / x RULE shape) so future campaigns get the per-rule evidence file without scratchpad scraping | Q1, Q5 | upgrade-legacy.mjs output path | S | Low: output format only | upgrade-legacy.mjs | val-detail.sh usage evidence; validate.sh --json exists | CONFIRMED residual need |

Idempotency/reversal/meaning: R6.1 writes a derived fact, skip-when-equal, atomic, reversible by git. R6.2 renames/deletes marker lines only. R6.3 narrows a fallback order. R6.4 is read-only lint. R6.5 is docs. R6.6 is output. None changes authored prose or invents history.

## Sources Consulted

- `steer.md`
- `scratchpad/{fix-dup-anchors,add-fm-fields,fix-specfolder,dup-survey,citecheck,census}.mjs` (full reads)
- `scratchpad/` listing (val-one.sh, val-detail.sh, fix-queue.sh, fix-lanes/)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` (lines 60-438)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` (prior reads: 1-478)

## Assessment

- New information ratio: 0.9 (findings 1-6 all new evidence; 7-8 consolidate)
- Questions addressed: Q1 mapping table is now complete - every one-off has a named owner or a named gap
- Questions answered: Q1 substantially (pending iteration 7's verification that nothing else lurks in fix-lanes briefs)

## Reflection

- What worked: reading the one-offs against repair-derived's actual repair surface exposed the specFolder gap precisely - the one-off existed because the permanent tool's location fix stops at markdown.
- What did not: nothing failed; the archive-semantics conflict surfaced earlier than planned.
- Do differently: check one fix-lanes batch brief to confirm no repair type was missed beyond the six scripts.

## Recommended Next Focus

Iteration 7 (Q1 close): spot-check `fix-lanes/batch-*.task` briefs for repair classes not covered by the six scripts (e.g., missing-doc reconstruction "dated note" worker), and close the ownership table.
