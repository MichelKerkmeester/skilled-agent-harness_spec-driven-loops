---
title: "Feature Specification: Phase 14: dead-runner-and-step-cleanup"
description: "The sharded spec-kit test runner has no caller: the only executable reference is its package.json script entry, and no workflow, hook or script invokes it. The OpenCode dual-version workflow's config-shape step is one definition over a two-entry matrix, so it executes twice. This phase deletes the runner and every reference, and runs the config-shape step once."
trigger_phrases:
  - "dead runner and step cleanup"
  - "phase 14 dead runner and step cleanup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: dead-runner-and-step-cleanup

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 17 |
| **Predecessor** | 013-advisory-checks-blocking-gates |
| **Successor** | 015-hook-suite-job-split |
| **Handoff Criteria** | `git grep -n run-tests-sharded -- ':!specs'` prints nothing, the runtime package JSON parses, the dual-version workflow parses with one config-shape definition guarded to the v1 matrix entry, and `npm test` still maps to `node scripts/run-tests.mjs`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure specification.

**Scope Boundary**: `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs`, the `test:sharded` entry in its `package.json`, five documentation files that name the runner, and the config-shape step in `.github/workflows/opencode-dual-version.yml`. No test file, battery script, hook or other workflow changes.

**Dependencies**:
- Node 22 in CI and Node 26.13.0 locally, because the package JSON and YAML checks run on the interpreter that ships the workflow.
- Python 3 with PyYAML for the workflow parse check, or `ruby -ryaml` as the fallback already used by sibling phases.
- The existing `battery` matrix in `.github/workflows/opencode-dual-version.yml`, whose entries are pinned as `opencode-ai@1.19.4` and `@opencode/cli@2.1.4`.

**Deliverables**:
- `run-tests-sharded.mjs` deleted and `test:sharded` removed from the runtime package scripts.
- Every `sharded` reference removed from `runtime/README.md`, `scripts/README.md`, `tests/README.md`, `ARCHITECTURE.md` and `.env.example`.
- The config-shape step guarded with `if: matrix.family == 'v1'` and its comment extended to say why one execution covers both entries.
- An empty reference grep, a passing JSON parse and a passing YAML parse that shows one guarded definition over two matrix entries.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs` is 44 lines that split the suite into twelve serial shards by default, and nothing invokes it: the only executable reference is its `test:sharded` entry in `package.json`, and the rest are prose. A reader who follows that prose starts twelve worker processes for a suite the default `npm test` already runs in one.

In `.github/workflows/opencode-dual-version.yml`, the config-shape step is at index 3 of 7 in the `battery` job, whose matrix has a `v1` and a `v2` entry. One definition therefore executes twice. The step runs before either OpenCode package is installed, and its battery test injects fixture binaries at `/fixture/bin/opencode` and `/fixture/bin/opencode2` while the other three tests read repository config and docs, so the second execution repeats work that cannot differ by family. The research prices each execution at 19 s (`research/lineages/opencode-go/iterations/iteration-009.md`) and this packet does not re-measure that step.

### Purpose
Delete the dead runner and every reference to it, and let one matrix entry own the config-shape step, so the runtime package documents only entry points that exist and the dual-version workflow stops repeating identical work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-12.

```text
$ git grep -c -e 'run-tests-sharded' -e 'test:sharded' -- ':!specs'
.skilled/skills/system-spec-kit/runtime/README.md:2
.skilled/skills/system-spec-kit/runtime/package.json:1
.skilled/skills/system-spec-kit/runtime/scripts/README.md:4
.skilled/skills/system-spec-kit/runtime/tests/README.md:1

$ rg -n -i 'sharded' .skilled/skills/system-spec-kit/runtime/README.md .skilled/skills/system-spec-kit/runtime/scripts/README.md .skilled/skills/system-spec-kit/runtime/tests/README.md .skilled/skills/system-spec-kit/ARCHITECTURE.md .env.example | wc -l
      12

$ wc -l .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs
      44 .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs

$ python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/opencode-dual-version.yml')); b=d['jobs']['battery']; print('matrix entries:', [e['family'] for e in b['strategy']['matrix']['include']]); print('config-shape step index:', [i for i,s in enumerate(b['steps']) if 'config-shape' in str(s.get('name'))][0], 'of', len(b['steps']), 'steps')"
matrix entries: ['v1', 'v2']
config-shape step index: 3 of 7 steps
```

The first command prints 8 lines in 4 files, so the script entry plus three READMEs are the whole reference surface that names the script outside `specs/`. The second counts 12 lines in 5 documentation files: two are in `ARCHITECTURE.md` and `.env.example`, three more use the word without the script name, and the package script entry is outside its file list. The third sizes the deleted file at 44 lines. The fourth shows one config-shape definition at index 3 of 7, before the install step at index 4, over a matrix of two entries.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `run-tests-sharded.mjs` (44 lines) and remove the `test:sharded` entry from `.skilled/skills/system-spec-kit/runtime/package.json`.
- Remove all 12 `sharded` lines from `runtime/README.md`, `scripts/README.md`, `tests/README.md`, `ARCHITECTURE.md` and `.env.example`, including the `SPECKIT_TEST_SHARDS` example that would configure a deleted runner.
- Add `if: matrix.family == 'v1'` to the config-shape step in `.github/workflows/opencode-dual-version.yml` and extend its comment so the single execution is intentional.
- Keep `npm test`, the other 17 runtime scripts, the four config-shape test paths and the version battery unchanged.

### Out of Scope
- The `--sharded` Level 3 spec-section option named in `references/workflows/execution-methods.md` and `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` - a different feature that shares the word.
- Regenerating `runtime/data/trigger-index.json` or `runtime/cli/retrieval/fixtures/phrase-variants.json` - both are generated data, and the index rebuild owns the stale "sharded test runner" phrase.
- Moving the config-shape step to a job of its own - a new job pays a checkout and provisioning, which is more than the step costs.
- Any other workflow, test, hook or source file, and any re-measurement of the 19 s step.

**Regression exposure**: none. No workflow, hook or script invokes the deleted runner, so its removal stops no check from running. The four config-shape tests still execute once per workflow run, so their coverage is unchanged. The only loss is a manual entry point for a hung suite; `npm test` still bounds a run with a process-group timeout and is the supported recovery path. A later rename of the `v1` matrix entry would silence the config-shape tests, so the step comment records that dependency.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs` | Delete | The 44-line sharded runner with no caller |
| `.skilled/skills/system-spec-kit/runtime/package.json` | Modify | Remove the `test:sharded` script entry |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | Modify | Remove 5 `sharded` lines and change "Two of them" to "One of them" |
| `.skilled/skills/system-spec-kit/runtime/README.md` | Modify | Remove the usage line and rewrite the lane paragraph |
| `.skilled/skills/system-spec-kit/runtime/tests/README.md` | Modify | Remove the entrypoint row, the "use the sharded command" advice and the shard paragraph |
| `.skilled/skills/system-spec-kit/ARCHITECTURE.md` | Modify | Change the `scripts/` directory comment to name the build finalizer and the bounded runner only |
| `.env.example` | Modify | Remove the `SPECKIT_TEST_SHARDS` example line |
| `.github/workflows/opencode-dual-version.yml` | Modify | Guard the config-shape step to the `v1` matrix entry and extend its comment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Delete `run-tests-sharded.mjs` and remove the `test:sharded` script entry. | `test ! -e .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs` exits 0, `git grep -n run-tests-sharded -- ':!specs'` prints nothing, and the package JSON parses with no `test:sharded` key. |
| REQ-002 | Remove every `sharded` line from the three runtime READMEs. | `rg -n -i 'sharded' .skilled/skills/system-spec-kit/runtime/README.md .skilled/skills/system-spec-kit/runtime/scripts/README.md .skilled/skills/system-spec-kit/runtime/tests/README.md` prints nothing. |
| REQ-003 | Run the config-shape step once by guarding it to the `v1` matrix entry. | The step definition carries `if: matrix.family == 'v1'`, the workflow parses, and the battery matrix still lists `v1` and `v2`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Remove the two remaining documentation references outside the READMEs. | `rg -n -i 'sharded' .skilled/skills/system-spec-kit/ARCHITECTURE.md .env.example` prints nothing. |
| REQ-005 | Keep every other runtime entry point unchanged. | `node -e` reads `scripts.test` as `node scripts/run-tests.mjs`, the package holds 17 scripts, and the four config-shape test paths still appear in the step's `run`. |
| REQ-006 | Keep the dual-version workflow's job and step structure. | The YAML parses with jobs `battery,both`, the battery job holds 7 steps, and exactly one config-shape definition remains. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git grep -n run-tests-sharded -- ':!specs'` prints nothing and exits 1.
- **SC-002**: `node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/system-spec-kit/runtime/package.json','utf8'))"` exits 0, and `scripts.test` is `node scripts/run-tests.mjs`.
- **SC-003**: Exactly one config-shape definition carries `if: matrix.family == 'v1'`, and the matrix still holds a `v1` and a `v2` entry.
- **SC-004**: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/opencode-dual-version.yml'))"` exits 0 and the battery job still holds 7 steps.
- **SC-005**: The diff is the eight paths in Section 3 and no test, hook, battery or source file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Python 3 with PyYAML for the workflow parse check | The parse check cannot run | Fall back to `ruby -ryaml`, which is present on macOS and the Ubuntu runner and is already the sibling phase's check |
| Dependency | The `v1` matrix entry as the carrier of the config-shape step | A later rename or removal of that entry silences four tests | The step comment names the dependency, and both entries stay pinned in the same file |
| Risk | The manual sharded run disappears when the suite hangs | Low: no automated path used it | `npm test` bounds a run with a process-group timeout, and the unsharded suite is the supported lane |
| Risk | The generated trigger index keeps the "sharded test runner" phrase after `scripts/README.md` loses it | Low: stale search metadata until the next index rebuild | The index is generated; `trigger-index-rebuild.yml` owns it, and this phase does not hand-edit generated data |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The finding counts two README files, but reading finds three READMEs, `ARCHITECTURE.md` and `.env.example`. Decision: clean all five, because each one documents the runner, its script or its variable, and each would be false after the deletion.
- Does removing the `v2` execution shorten the workflow's wait? Decision: UNKNOWN. It removes the research's 19 s from the `v2` entry; the wait changes only if `v2` is the slower entry, so the guaranteed saving is 19 s of runner time.
- Should the step move to its own job instead of a matrix guard? Decision: no. A new job pays a checkout and provisioning, and the research prices the step at 19 s.
- The brief cites `opencode-go` lineage rank 8, but rank 8 in `research/lineages/opencode-go/research.md:56` is the `run-tests.mjs` embedded Python timeout; the runner is rank 7 at line 55. Decision: leave `run-tests.mjs` unchanged and treat rank 7 as the runner finding.
<!-- /ANCHOR:questions -->

---
