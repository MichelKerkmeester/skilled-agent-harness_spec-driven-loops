# Iteration 2: Failure-class taxonomy and the fix ownership map

## Focus

Finish the taxonomy: map each rule class in the detail reports to the mechanism that cleared or still owns it, using the lane briefs (`fix-lanes/batch-*.task`), the 013 plan/tasks, and the baseline TSVs.

## Actions Taken

1. Read `013-corpus-wide-validation-repair/plan.md` (working tree).
2. Read `fix-lanes/batch-01.task` in full (the canonical lane brief; other batches share the format).
3. Inspected `all-baseline.tsv`, `all-failed.txt`, `all-folders.txt` formats and counts (4,408 / 2,083 / 4,408 rows).
4. Diffed rule frequencies across `all-detail.txt` -> `detail2.txt` -> `detail3.txt` to classify each rule as script-cleared vs lane-residual.
5. Re-read `steer.md` (sections 0-1, write scope) before this iteration.

## Findings

1. The lane brief is a nine-rule repair playbook executed per folder: (1) add/move structure only, never prose; (2) wrap existing sections in template anchor ids, dedupe by numbered suffix `-2`; (3) reconstruct missing docs from spec.md + `git log --follow` with a dated first line and "Not recorded" unknowns; (4) fix links only when `rg --files` finds the target, else delink; (5) replace generic trigger phrases with folder-slug + doc-kind; (6) fill scaffolded continuity placeholders; (7) align implementation-summary status to spec.md; (8) set missing level from the folder's own docs; (9) add the template's SPECKIT_TEMPLATE_SOURCE header. CONFIRMED [SOURCE: /private/tmp/.../scratchpad/fix-lanes/batch-01.task lines 1-22].
2. Failure classes split cleanly by fixability. Deterministic re-derivation classes collapsed under scripts: METADATA_DISK_PATH_CONSISTENCY 2,898 -> 6 and GRAPH_METADATA_CHILD_IDENTITY 260 -> 7 across baseline -> detail3 (fix-specfolder.mjs + repair-derived.cjs). Semantic/structural classes remain manual: ANCHORS_VALID 510 -> 235, GREP_CONVENTION 195 -> 152, LEVEL_MATCH 180 -> 131, FILE_EXISTS 180 -> 131, SPEC_DOC_SUFFICIENCY 261 -> 108, TEMPLATE_SOURCE 99 -> 76. CONFIRMED [SOURCE: grep recounts of all-detail.txt and detail3.txt; batch-01.task rules 2-9].
3. The corpus census files exist as TSV/txt rather than JSON: `all-baseline.tsv` = `<folder>\tRESULT: x\tSummary:` rows over 4,408 folders, `all-failed.txt` = 2,083 failing folders. CONFIRMED [SOURCE: scratchpad all-baseline.tsv head, wc -l].
4. The 013 `plan.md` itself is an unscaffolded Level 2 plan template: Technical Context still holds `[e.g., TypeScript, Python 3.11]` and Pattern holds `[MVC | MVVM | ...]` placeholders (working tree). INFERRED consequence: the packet orchestrating the repair would itself trip PLACEHOLDER_FILLED/SCAFFOLD-style rules; also evidence that `create.sh` scaffolds ship placeholder text that nothing forces authors to replace. CONFIRMED the placeholders exist [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/plan.md lines 20-29, 44-52 of the working tree].
5. Lane discipline rules worth preserving in any permanent tool: "Edit only files directly inside your listed folders"; "Never hand-edit graph-metadata.json or description.json" (they are re-derived, not edited); "ignore a child's issue when the child is not on your list"; "at most three rounds per folder". CONFIRMED [SOURCE: fix-lanes/batch-01.task lines 4-6, 20].
6. `repair-derived.cjs` is invoked per folder with `--apply` by lanes after manual edits, i.e. the corpus already treats it as the canonical metadata healer and forbids hand-editing its outputs. CONFIRMED [SOURCE: fix-lanes/batch-01.task lines 5-6].

## Ruled Out

- Reading every `batch-NN.task`: batch-01 already carries the shared rule set; later batches differ only in folder lists (checked file sizes are uniform). The per-batch variance lives in `batch-NN.detail`, which I mine by grep when needed.
- Treating plan.md placeholders in 013 as a validation blocker for the phase: it is evidence about scaffold defaults, not a claim the phase fails validation; I did not run validate.sh (banned).

## Dead Ends

None.

## Edge Cases

- Contradictory evidence: lead counts vs my recount agree; no conflict.
- Missing dependency: `all-todo.txt`/`all-done.txt` lane progress files exist but were not needed for the taxonomy.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R2.1 | Turn the nine lane rules in `fix-lanes/batch-01.task` into the written contract of a corpus heal command (each rule = a named, individually gateable fixer), so the playbook survives the scratchpad | Q1, Q3 | `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` (extend) + a `references/repair/` doc | M | Med: the doc-reconstruction rule (3) is the only one that invents text, and it must keep its dated-note + "Not recorded" markers | heal-spec-docs.cjs, one reference doc | batch-01.task:1-22 is the spec; fix scripts implement the deterministic subset | CONFIRMED need; INFERRED placement |
| R2.2 | Keep generated-metadata files (`graph-metadata.json`, `description.json`) machine-owned permanently: the lane rule "never hand-edit" should be enforced by repair tooling refusing partial manual states, not by convention | Q2, Q5 | `repair-derived.cjs` + validator | S | Low: strengthens an existing boundary | repair-derived.cjs | batch-01.task:5-6 | CONFIRMED |

Idempotency/reversibility: R2.1's fixers inherit the one-off scripts' dry-run/skip-when-equal semantics; each fixer is individually reversible (anchor renames are textual, reconstructions are new files carrying a dated note). No recommendation this iteration changes document prose.

## Sources Consulted

- `steer.md` (lead brief)
- `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/plan.md` (working tree)
- `fix-lanes/batch-01.task` (scratchpad, full read)
- `all-baseline.tsv`, `all-failed.txt`, `all-folders.txt` (scratchpad)
- `all-detail.txt`, `detail3.txt` recounts from iteration 1

## Assessment

- New information ratio: 0.8 (5 of 6 findings new; the rule-count diff partially new since baseline counts were confirmed last iteration)
- Questions addressed: Q1 (which fixes exist and their safety shape), Q2 (taxonomy split by fixability)
- Questions answered: none fully; Q1 and Q2 are scoped for iterations 3-7

## Reflection

- What worked: diffing the three detail snapshots separates "deterministically fixable" from "needs judgment" without reading thousands of lines; the lane brief is the authoritative statement of manual repair semantics.
- What did not: nothing failed.
- Do differently: for Q2 I need the producing side, not the fixing side: read `create.sh`, `archive.sh`, and the templates to show where each class is born.

## Recommended Next Focus

Iteration 3 (Q2 start): trace METADATA_DISK_PATH_CONSISTENCY and GRAPH_METADATA_CHILD_IDENTITY to `archive.sh`/`repair-derived.cjs` behavior, and ANCHORS_VALID/TEMPLATE_SOURCE to template/scaffold defaults.
