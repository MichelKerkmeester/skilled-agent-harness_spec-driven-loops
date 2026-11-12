# Iteration 5: The 111 spec-tree test files — inventory bloat that costs no minutes

## Focus

Key question 4: which test files under `specs/` belong to closed packets, and what unique regression coverage would be lost by deleting them. This is the follow-up the iteration-4 recommendation named, and it tests the phase's own premise, since the packet's problem statement counts these files inside "about 1,270 test files".

## Actions Taken

1. Listed every test-shaped file under `specs/` with the same pattern the packet used, and grouped by packet.
2. Classified each path by whether it sits under `scratch/`, `context/`, `baseline/`, `logs/`, a `z_archive` tree, a `fixtures/` seed, or a closed packet's `tests/` directory.
3. Grepped every workflow for a run step that executes anything from the spec tree.
4. Checked whether the two `.test.mjs` files in the hook-injection packet have a live counterpart under `.skilled/hooks`.

## Findings

1. All 111 test-shaped files under `specs/` are captured or archived artifacts, not live suites: 91 sit under `scratch/`, `context/`, `baseline/` or `logs/`, and the remaining 20 are archived packet tests, eval-rig fixture seeds, stress-measurement scripts and one-time history-rewrite script tests. The 77 files in `specs/cli-classifier/003-cli-jev-workflow-integration` are all under `scratch/` or `context/`. [SOURCE: specs/cli-classifier/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/logs/02.vitest.txt:1] [INFERENCE: based on the path classification of every matching file]

2. No CI path runs them. `run-node-tests.mjs` excludes the spec tree wholesale, and the only `specs/` references inside workflows are path filters plus one JSON baseline read in `routing-registry-drift.yml`; no workflow has a run step that executes a file from `specs/`. [SOURCE: .skilled/scripts/run-node-tests.mjs:20] [SOURCE: .github/workflows/routing-registry-drift.yml:335]

3. Deleting them saves zero CI minutes, so they cannot appear in a time-ranked cut list. Their cost is inventory and argument quality: they inflate the census that justified the phase, and the honest live-corpus figure is about 1,159 files rather than 1,270. [INFERENCE: based on findings 1 and 2 plus the spec.md census]

4. The four Python tests under `specs/sk-git/commit-standards/001-crawlable-commit-history` test one-time history-rewrite scripts, not a runtime module. A closed packet's throwaway tooling keeps its tests and its script in the same folder, which is correct, but it means the file count says nothing about the runtime under test. [SOURCE: specs/sk-git/commit-standards/001-crawlable-commit-history/005-history-rewrite/scripts/tests/test_build_commit_plan.py:1]

5. Two files look like live suites and are not: `specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` and `guardrail-negative-controls.test.mjs`. They are the only files with those names anywhere in the tree, so guardrail activation behaviour is tested only in a folder CI never runs. [SOURCE: specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs:1]

## Ruled Out

- Listing spec-tree test files as a time-saving cut: measured at zero run time.
- Counting them as "coverage to preserve": nothing runs them, so there is no coverage to lose.

## Dead Ends

- Treating the phase's 1,270-file figure as the corpus size. It is a `git ls-files` census including archives, not the runnable set.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the packet's problem statement treats 1,270 files as the corpus, while the census includes 111 files that never run. Both numbers are correct about different things; the finding names which one a cut list may use.
- Missing dependencies: whether an equivalent live suite for guardrail activation exists under `.skilled/hooks` was not established; no file with those names exists there, but behaviour could be covered under another name and that was not verified.
- Partial success: path classification and workflow coverage are confirmed; the "no live equivalent" question for finding 5 stays open.

## Sources Consulted

- `git ls-files specs` (111 matching paths, classified)
- `.github/workflows/routing-registry-drift.yml`
- `.skilled/scripts/run-node-tests.mjs`
- `specs/cli-classifier/003-cli-jev-workflow-integration/**` (path listing)
- `specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/`
- `specs/sk-git/commit-standards/001-crawlable-commit-history/005-history-rewrite/scripts/tests/`
- `.skilled/hooks/` (directory listing)

## SCOPE VIOLATIONS

None. Spec-tree files were listed and classified, never opened for modification.

## Assessment

- New information ratio: 0.90
- Questions addressed: "Which test files under `specs/` belong to closed packets, and what unique regression coverage would be lost by deleting them?"
- Questions answered: "Which test files under `specs/` belong to closed packets, and what unique regression coverage would be lost by deleting them?"

## Reflection

- What worked and why: classifying paths rather than reading files. The `scratch/`, `context/`, `baseline/` distribution settled the question in one pass, and the workflow grep settled coverage in another.
- What did not work and why: assuming the census pattern found live suites in the spec tree. Ninety-one of 111 were captured logs or fixtures, which the first group-by-packet view hid.
- What I would do differently: check path shape before packet grouping, because the packet-name grouping made scratch copies look like suites.

## Recommended Next Focus

The 353 `vitest.ts` files under `.skilled/skills/system-spec-kit/runtime`: which suites duplicate each other, re-assert the framework, or test retired code, and what the CLI and runtime projects cost inside the 595 s `spec-kit-check` workflow.
