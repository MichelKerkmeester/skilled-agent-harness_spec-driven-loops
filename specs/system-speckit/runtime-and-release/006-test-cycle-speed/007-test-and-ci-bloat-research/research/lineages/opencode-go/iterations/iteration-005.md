# Iteration 5: Test files under specs/ — the census counted scratch logs, not tests

## Focus

Key question 4: which test files under `specs/` guard retired or closed-packet code rather than shipping behavior. `spec.md` records "about 110 under specs/ (most in specs/cli-classifier/003-cli-jev-workflow-integration)" and treats them as a test surface. This iteration establishes what those files actually are, whether anything runs them, and whether the census itself is sound.

## Actions Taken

1. Counted test-suffixed files under `specs/` with `node_modules` pruned, then recounted against the git index.
2. Split the tracked set by containing directory: `scratch/`, `fixtures/`, `z_archive/`, and everything else.
3. Read sample filenames from the largest packet to identify what the files are.
4. Searched every vitest config and every workflow for a collector that includes `specs/**`.
5. Measured the largest untracked context tree and checked whether git tracks it.

## Findings

1. The tracked test-suffixed surface under `specs/` is 94 files and 53,629 lines. [SOURCE: specs/cli-classifier/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/logs/14.pre.vitest.ts:1]
2. 86 of those 94 files (91%) sit under a `scratch/` directory, 2 under `fixtures/`, and 4 under `z_archive/`. Only 4 tracked files are tests in a live packet location, and those 4 are measurement harnesses under `specs/system-speckit/memory-search-and-knowledge/`. [SOURCE: specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs:1][SOURCE: specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/021-stress-test-enterprise-wiring-expansion/measurements/phase-h-stress.test.ts:1]
3. All 77 files in `specs/cli-classifier/003-cli-jev-workflow-integration` are scratch artifacts, not tests: they are numbered build logs such as `14.pre.vitest.ts` and `15.pre.vitest.ts` under `scratch/w3-build/logs/`. The census counted file suffixes, so a build log with a test-like name became a test. [SOURCE: specs/cli-classifier/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/logs/15.pre.vitest.ts:1]
4. No runner collects any of them: no `vitest.config.*` in the repository roots an include at `specs/`, and no workflow runs a `specs/` test path. They cost zero CI minutes and zero commit minutes. [SOURCE: .skilled/vitest.config.bin.ts:7][SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:18]
5. Because nothing runs them, deleting them saves no run time. The correct correction is to the census: `spec.md`'s "about 110 under specs/" should read 4 real test files, and the phase's test-surface total should drop by the 90 scratch and fixture entries. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:111]
6. There is a latent collection hazard in the naming: the repository's own configs collect `{vitest,test}.ts`, so a future config rooted at the repository root with a `**/*.vitest.ts` include would collect 86 numbered log files as tests and fail. The hazard is latent, not live. [INFERENCE: based on the include globs in the two runtime configs and the `.pre.vitest.ts` filenames in finding 3]
7. The largest untracked context tree, `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main`, is 292 MB and holds 9,869 test files, none tracked by git. It costs disk and editor indexing, never CI time, so it belongs in a workspace-weight finding rather than a run-time one. [INFERENCE: based on `git ls-files` returning 0 paths for that directory and `du -sh` reporting 292M]

## Ruled Out

- Pricing a `specs/` test deletion as a run-time saving: there is no execution path, so the saving is 0 minutes and claiming otherwise would inflate the ranking.
- Recommending that these files be wired into CI so they "earn their keep": that would add run time to a packet whose purpose is to remove it.
- Deleting the 292 MB orca context tree as a test-bloat cut: it is untracked working material belonging to another packet, and deleting it is outside this research scope.

## Dead Ends

- Searching for a hidden runner by packet name (`cli-jev-workflow-integration`) found only benchmark scripts and fixture indices that reference packet paths as data, never a test command.

## Edge Cases

- Ambiguous input: "test files under specs/" could mean tracked files, filesystem files, or files matching a runner's include glob. Selected interpretation: tracked files, because only tracked files are part of the repository. Deferred alternative: the runner-glob interpretation, which finds zero.
- Contradictory evidence: `spec.md` says about 110, the tracker says 94, the filesystem says 9,869, and only 4 are tests. All four measures are true of different questions; the finding names each measure instead of choosing one.
- Missing dependencies: none.
- Partial success: none.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:111`
- `specs/cli-classifier/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/logs/14.pre.vitest.ts:1`
- `specs/cli-classifier/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/logs/15.pre.vitest.ts:1`
- `specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs:1`
- `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/021-stress-test-enterprise-wiring-expansion/measurements/phase-h-stress.test.ts:1`
- `.skilled/vitest.config.bin.ts:7`
- `.skilled/skills/system-spec-kit/runtime/vitest.config.ts:18`
- Measured: 94 tracked specs test-suffixed files / 53,629 lines; 86 under `scratch/`, 2 under `fixtures/`, 4 under `z_archive/`, 4 elsewhere; 9,869 files and 292 MB in the untracked orca context tree.

## Assessment

- New information ratio: 1.0
- Questions addressed: Which test files under specs/ guard retired or closed-packet code rather than shipping behavior?
- Questions answered: Which test files under specs/ guard retired or closed-packet code rather than shipping behavior?

## Reflection

- What worked and why: splitting the tracked set by containing directory turned a plausible test corpus into scratch logs in one command, and reading three filenames confirmed what the suffix count could not.
- What did not work and why: the first pass grouped by packet and produced a confident-sounding "82% in one packet" finding that was technically true and substantively misleading; the directory split corrected it before it reached the delta.
- What I would do differently: classify by path segment (`scratch`, `fixtures`, `z_archive`) before grouping by packet in any future census.

## Recommended Next Focus

The overengineering question for the remaining infrastructure: shared fixtures, setup files and helper layers that every suite loads. Start with `tests/_support/vitest-setup.ts`, which three packages' configs load, and measure whether the shared setup costs each suite more than it saves.
