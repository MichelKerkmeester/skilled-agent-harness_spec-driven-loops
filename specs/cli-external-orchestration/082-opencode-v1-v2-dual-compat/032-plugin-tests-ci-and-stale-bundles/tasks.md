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
- [ ] T015 Review the change read-only with Luna, five rounds at most (`scratch/review/`)
- [ ] T016 Validate this folder strict and 082 recursively, each RESULT: PASSED
- [ ] T017 Part 1: the plugin-test workflow passes on CI at the pushed main commit
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
