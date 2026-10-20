---
title: "Tasks: Phase 32: plugin-tests-ci-and-stale-bundles"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "plugin tests ci and stale bundles tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 32: plugin-tests-ci-and-stale-bundles

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Part 1: confirm no workflow runs the plugin suites (`scratch/mutation/before-no-workflow-runs-plugin-tests.txt`) Done: `git grep 'plugins/tests' origin/main -- .github/workflows/` finds nothing, exit 1.
- [x] T002 Take the baselines (`scratch/baseline/`) Done: the plugin suites 436 of 436 in 23 seconds; `worktree-naming.test.sh` PASS=109 FAIL=0; `check-gate-inputs.sh` RESULT: PASSED; `actionlint` exit 0.
- [x] T003 Part 1: trace what the plugin suites import and read (`scratch/trace/`) Done: imports reach `.opencode/plugins`, `.opencode/node_modules`, `.skilled/bin`, `.skilled/hooks`, `.skilled/node_modules` (rolldown) and five skills, among them the compiled spec-kit and advisor runtimes and the sk-vision bundle; reads span skill, command, hook and Pi files across `.skilled`, `.opencode` and `.pi`, plus one archived spec file.
- [x] T004 Part 3: confirm the build rule (`.skilled/skills/sk-git/scripts/worktree-naming.sh`) Done: the build ran only under `[ ! -e "$dir/$pkg/$artifact" ]`, so an existing output was never rebuilt.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Part 3: rebuild a stale output (`.skilled/skills/sk-git/scripts/worktree-naming.sh`) Done: `_wn_output_stale` compares the package's git-tracked files with the output; the build rule records `missing` or `stale` and prints `rebuilding <pkg> (sources newer than <artifact>)` for the second.
- [x] T006 Part 3: test it (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`) Done: ten checks on a git-tracked fixture and a tree outside git, with fixed timestamps: no rebuild when the output is newest, no rebuild for newer untracked files, one rebuild with the message for a newer tracked source, and outside git only a missing output builds.
- [x] T007 Part 1: add the plugin-test workflow (`.github/workflows/opencode-plugin-tests.yml`) Done: Node 22, bun 1.3.9, `provision_worktree "$GITHUB_WORKSPACE"`, then `node --test '.opencode/plugins/tests/*.test.cjs'`; triggers on `.skilled/**`, `.opencode/**`, `.pi/**` and the workflow file.
- [x] T008 Part 2: trigger Spec-Kit Check on the plugins folder (`.github/workflows/spec-kit-check.yml`) Done: `.opencode/plugins/**` and `.skilled/plugins/**` in both the push and the pull-request lists.
- [x] T009 Describe it (`.github/workflows/README.md`, `.skilled/skills/sk-git/SKILL.md`, `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`) Done: README rows for the new workflow and `sk-code-script-tests.yml` and the path-filtered coverage row; one sentence in the sk-git provisioning rule; the provision list header states the new rule.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Part 3: the new checks fail on the old script (`scratch/mutation/old-script-new-tests.txt`) Done: PASS=117 FAIL=2, exit 1: the rebuild-and-message check and the build-count check. The other checks guard against rebuilding too much, which the old script never did, so they are covered by the mutant in T011.
- [x] T011 Part 3: a mutant that counts every file, tracked or not (`scratch/mutation/m1-untracked-counted.txt`) Done: PASS=115 FAIL=4, exit 1, the untracked-file check first; the unmodified script passes 119 of 119.
- [x] T012 Part 3: the rule on a real worktree (`scratch/real-reprovision-*.txt`) Done: after touching `src/plugin.ts`, provision prints `rebuilding .skilled/skills/sk-vision/vision-runtime (sources newer than dist/plugin.js)` and the bundle carries `visionHooksEnabled`; the next run builds nothing. A throwaway detached worktree outside the repository, provisioned fresh and then again, built nothing the second time.
- [x] T013 Part 1: the workflow's command under Node 22 (`scratch/node22-plugin-tests.txt`, `scratch/mutation/broken-plugin-test.txt`) Done: 436 of 436 on Node 22.23.1, exit 0; with one broken test added, 436 pass and 1 fails, exit 1. Node 22 rejects the directory form `node --test .opencode/plugins/tests/`, so the workflow passes a glob.
- [x] T014 Lint the workflows Done: `actionlint` exit 0; `check-gate-inputs.sh` RESULT: PASSED, 0 failures.
- [x] T015 Part 3, review round 1: count the sources a build compiles outside its package (`.skilled/skills/sk-git/scripts/worktree-naming.sh`, `worktree-provision-paths.txt`, `tests/worktree-naming.test.sh`) Done: a list line's fields after the output name extra source paths, and `_wn_output_stale` lists their tracked files with the package's. The spec-kit runtime names `shared`, the CLI names `shared` and `runtime`, and the advisor runtime names its `hooks` and spec-kit `shared`, each read from the build's tsconfig. Two new checks; on the package-only script one fails (`scratch/mutation/package-only-script-source-tests.txt`, PASS=122 FAIL=1); the suite passes 123 of 123, and the real worktree provisions with 0 built.
- [x] T016 Part 1, review round 1: trigger on every input the suites read (`.github/workflows/opencode-plugin-tests.yml`) Done: a retrace that resolves relative paths (`scratch/trace/reads-outside-source-roots.txt`) found `.env.example`, two `.cursor` files, one `.devin` file and one archived spec's graph metadata; the goal-doc check also accepts cited `.claude` and `.codex` paths. Both trigger lists name `.claude/**`, `.codex/**`, `.cursor/**`, `.devin/**`, `.env.example` and that spec folder. `actionlint` exit 0; `check-gate-inputs.sh` RESULT: PASSED.
- [x] T017 Part 3, review round 2: decide staleness from a recorded stamp (`.skilled/skills/sk-git/scripts/worktree-naming.sh`, `tests/worktree-naming.test.sh`, `worktree-provision-paths.txt`, `SKILL.md`) Done: round 2 found that a deleted tracked input never tripped the file-time rule and that a build skipping emission made every later provision rebuild. After each successful build, provisioning now writes a fingerprint of the tracked inputs (`git ls-files -s` over the package and its extra sources, hashed) to a stamp under the worktree's git directory; it rebuilds when the stamp is missing, the fingerprint differs, or a tracked input is newer than the stamp. A stamp that cannot be written never fails provisioning. The suite also sets `GIT_CEILING_DIRECTORIES` for fixtures without their own `.git`, because the suite runs inside its own repository and those fixtures had been read as part of it. Suite PASS=144 FAIL=0; the file-time script fails 16 checks (`scratch/mutation/mtime-script-stamp-tests.txt`), a mutant without the fingerprint comparison fails 9 including deletion (`m2-no-fingerprint-compare.txt`), and a mutant that never records fails 11 including the loop (`m3-never-records.txt`). The real worktree provisions with 0 built once stamps exist (`scratch/real-stamp-provision-1.txt`).
- [x] T018 Correct an overstated record (`implementation-summary.md`) Done: `real-reprovision-1.txt` shows a rebuild before any source was touched, from earlier work in this worktree, so the summary no longer says one rebuild was followed by zero there; the fresh-worktree check in T012 is the clean evidence.
- [x] T019 Part 3, review round 3: fingerprint the work tree (`.skilled/skills/sk-git/scripts/worktree-naming.sh`, `tests/worktree-naming.test.sh`) Done: round 3 found that the index fingerprint missed an unstaged deletion and that the time comparison rebuilt forever for a source with a future modification time. The fingerprint now describes every tracked path as it is on disk (content blob, symlink target, or missing), and no file times are compared. New checks for an unstaged edit, an unstaged deletion and a future modification time; suite PASS=154 FAIL=0; the index-plus-time script fails 7 (`scratch/mutation/index-script-worktree-tests.txt`). The real worktree rebuilt each listed output once for the new fingerprint format, then provisioned with 0 built twice.
- [x] T020 Part 1, review round 3: trigger on the root project markers (`.github/workflows/opencode-plugin-tests.yml`) Done: both lists add `esbuild.config.mjs`, `manifest.json`, `wrangler.toml` and `src/**`; `actionlint` exit 0, `check-gate-inputs.sh` RESULT: PASSED.
- [ ] T021 Review the change read-only with Luna, five rounds at most (`scratch/review/`)
- [ ] T022 Validate this folder strict and 082 recursively, each RESULT: PASSED
- [ ] T023 Part 1: the plugin-test workflow passes on CI at the pushed main commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
