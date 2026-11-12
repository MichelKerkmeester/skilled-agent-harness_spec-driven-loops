# Iteration 6: The system-spec-kit runtime suites — 339 blocking files and 13 that cannot block

## Focus

Key question 2: which test files under `.skilled/skills/*/runtime` are redundant, mirror the implementation, or re-assert framework behavior, and how long each suite takes. This iteration takes the largest runtime tree (352 files, 214 under `runtime/cli` and 136 under `runtime/tests`) and separates the files CI can block on from the files it cannot.

## Actions Taken

1. Enumerated every test-shaped file under `.skilled/skills/system-spec-kit/runtime` and grouped by subdirectory and suffix.
2. Sized the largest suites with `wc -l`.
3. Listed the `.test.mjs` files separately, since the vitest projects' include patterns do not match that suffix.
4. Read the imports of the three basenames that appear in both `cli/tests` and `tests/` to test the duplication hypothesis.

## Findings

1. The tree holds 352 test files: 339 `.vitest.ts` reachable by the `root` and `cli` vitest projects in `spec-kit-check.yml`, and 13 `.test.mjs` files that no vitest project matches, so they execute only through `run-node-tests.mjs` in the report-only advisory job. [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:42] [SOURCE: .skilled/scripts/run-node-tests.mjs:32]

2. Those 13 files are not leftovers: they include `unactioned-recorded-failure-audit.test.mjs`, four `sync-*-dsh` mirror generators, `hook-stdin-deadline.test.mjs`, `gate-3-menu-parity.test.mjs` and `permission-request-policy.test.mjs`. Every one of them can fail without turning a check red, because `advisory-checks.yml` runs them with `continue-on-error: true`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/unactioned-recorded-failure-audit.test.mjs:1] [SOURCE: .github/workflows/advisory-checks.yml:36]

3. `spec-gate-core.test.mjs` is 2,689 lines, the largest test file in the tree, and it is one of the 13 in the non-blocking path. The most thorough suite in the tree is therefore the one that cannot stop a merge. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:1]

4. Three basenames appear in both `cli/tests` and `tests/`: `progressive-validation.vitest.ts`, `continuity-freshness.vitest.ts` and `evidence-marker-audit.vitest.ts`. Reading the imports of each pair shows different construction — the CLI copies drive child processes while the runtime copies exercise modules in-process — so they are layered coverage rather than duplicated suites, and deletion of either side is not supported by this evidence. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/progressive-validation.vitest.ts:1] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/progressive-validation.vitest.ts:1]

5. Eight files carry about 12,100 lines between them (`spec-gate-core` 2,689, `heal-lane-modes` 1,699, `task-enrichment` 1,573, `folder-discovery` 1,395, `graph-metadata-schema` 1,293, `progressive-validation` 1,198, `repair-derived` 1,160, `folder-discovery-integration` 1,115). The one feature tested at two layers is progressive validation, at 1,198 plus 903 lines; that is the strongest narrowing candidate in the tree. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:1] [INFERENCE: based on the wc -l sizes of the eight listed files]

6. The 595 s `spec-kit-check` mean covers 339 vitest files across two projects plus the legacy and bash validation lanes; no per-project duration is stored, so the share taken by any one file stays inferred. The CLI project alone holds 214 of those files. [SOURCE: .github/workflows/spec-kit-check.yml:145] [INFERENCE: based on the file counts per directory]

## Ruled Out

- Deleting the three same-named suite pairs as duplicates: their imports show different layers and different mechanisms.
- Treating the 13 `.test.mjs` files as a small tail: they include the largest and most behaviour-heavy suite in the tree.

## Dead Ends

- Ranking suites by line count as a proxy for run time. A 2,689-line in-process suite can be faster than a 299-line suite that spawns processes, and no per-file timing exists to settle it.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the 13 files look like the primary gate tests (gate menus, permissions, recorded failures) yet sit in the non-blocking job. The contradiction is real and is stated rather than resolved: moving them into the vitest projects is a finding for the ranking, not a deletion.
- Missing dependencies: per-file and per-project CI durations are absent.
- Partial success: file accounting and layering analysis are confirmed; the time share of any single suite is not.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/**` test file listing (352 files)
- `.skilled/skills/system-spec-kit/vitest.config.ts`
- `.skilled/scripts/run-node-tests.mjs`
- `.github/workflows/spec-kit-check.yml`
- `.github/workflows/advisory-checks.yml`
- Sampled suite heads: `progressive-validation.vitest.ts` (both copies), `continuity-freshness.vitest.ts` (both copies)

## SCOPE VIOLATIONS

None.

## Assessment

- New information ratio: 0.90
- Questions addressed: "Which test files under `.skilled/skills/*/runtime` are redundant, mirror the implementation, or re-assert framework behavior, and how long does each suite take?"
- Questions answered: none fully; the blocking/non-blocking split is established and the duplication hypothesis is refuted.

## Reflection

- What worked and why: partitioning by suffix first. The `.test.mjs` / `.vitest.ts` split exposed the non-blocking job as the home of the most important suites, which no amount of reading individual files would have shown.
- What did not work and why: the duplicate-basename hypothesis. Three matches looked like duplication until the imports showed two layers.
- What I would do differently: count node:test versus vitest across the whole corpus before drilling into one tree, so the same split is computed once for every runtime.

## Recommended Next Focus

The same suffix split for `.skilled/skills/system-skill-advisor/runtime` (186 files) and `.skilled/skills/system-deep-loop/runtime` (174 files), together with what the `Skill Advisor Stress Tests` and `Deep-Loop Runtime Tests` workflows run.
