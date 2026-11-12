---
title: "Tasks: Phase 14: dead-runner-and-step-cleanup"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dead runner and step cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: dead-runner-and-step-cleanup

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every path is written from the repository root. `R` is `.skilled/skills/system-spec-kit/runtime` and `W` is `.github/workflows/opencode-dual-version.yml`; commands spell both in full.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the runner has no caller and count its references before deleting anything (`.skilled/skills/system-spec-kit/runtime/package.json`). Verify: `bash -c 'printf "refs=%s files=%s\n" "$(git grep -n -e run-tests-sharded -e test:sharded -- ":!specs" | wc -l | tr -d " ")" "$(git grep -l -e run-tests-sharded -e test:sharded -- ":!specs" | wc -l | tr -d " ")"'` prints `refs=8 files=4`.
- [x] T002 Confirm the config-shape step is one definition before the install over a two-entry matrix (`.github/workflows/opencode-dual-version.yml`). Verify: `python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/opencode-dual-version.yml')); b=d['jobs']['battery']; print('matrix entries:', [e['family'] for e in b['strategy']['matrix']['include']]); print('config-shape step index:', [i for i,s in enumerate(b['steps']) if 'config-shape' in str(s.get('name'))][0], 'of', len(b['steps']), 'steps')"` prints `matrix entries: ['v1', 'v2']` and `config-shape step index: 3 of 7 steps`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Delete the 44-line sharded runner (`.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs`). Verify: `bash -c 'test ! -e .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs && echo RUNNER_GONE'` prints `RUNNER_GONE`.
- [x] T004 Remove the `test:sharded` entry from `scripts` (`.skilled/skills/system-spec-kit/runtime/package.json`). Verify: `node -e "const p=JSON.parse(require('fs').readFileSync('.skilled/skills/system-spec-kit/runtime/package.json','utf8')); console.log(p.scripts['test:sharded']===undefined?'test:sharded absent':'still present')"` prints `test:sharded absent`.
- [x] T005 Remove the five `sharded` lines and change "Two of them" to "One of them" (`.skilled/skills/system-spec-kit/runtime/scripts/README.md`). Verify: `bash -c '! rg -q -i sharded .skilled/skills/system-spec-kit/runtime/scripts/README.md && echo SCRIPTS_README_CLEAN'` prints `SCRIPTS_README_CLEAN`.
- [x] T006 Remove the `test:sharded` usage line and rewrite the lane paragraph to name only `test:spec-validation` (`.skilled/skills/system-spec-kit/runtime/README.md`). Verify: `bash -c '! rg -q -i sharded .skilled/skills/system-spec-kit/runtime/README.md && echo RUNTIME_README_CLEAN'` prints `RUNTIME_README_CLEAN`.
- [x] T007 Remove the entrypoint row, the "use the sharded command instead" advice and the shard paragraph (`.skilled/skills/system-spec-kit/runtime/tests/README.md`). Verify: `bash -c '! rg -q -i sharded .skilled/skills/system-spec-kit/runtime/tests/README.md && echo TESTS_README_CLEAN'` prints `TESTS_README_CLEAN`.
- [x] T008 Change the `scripts/` directory comment to name the build finalizer and the bounded runner only (`.skilled/skills/system-spec-kit/ARCHITECTURE.md`). Verify: `bash -c '! rg -q -i sharded .skilled/skills/system-spec-kit/ARCHITECTURE.md && echo ARCHITECTURE_CLEAN'` prints `ARCHITECTURE_CLEAN`.
- [x] T009 Remove the `SPECKIT_TEST_SHARDS` example line and keep `SPECKIT_TEST_RUN_TIMEOUT_MS` (`.env.example`). Verify: `bash -c '! rg -q SPECKIT_TEST_SHARDS .env.example && rg -q SPECKIT_TEST_RUN_TIMEOUT_MS .env.example && echo ENV_CLEAN'` prints `ENV_CLEAN`.
- [x] T010 Add `if: matrix.family == 'v1'` to the config-shape step and extend its comment to say one execution covers both entries (`.github/workflows/opencode-dual-version.yml`). Verify: `python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/opencode-dual-version.yml')); b=d['jobs']['battery']; s=[x for x in b['steps'] if 'config-shape' in str(x.get('name'))]; print('definitions=%d guard=%s entries=%s tests=%d' % (len(s), s[0].get('if'), [e['family'] for e in b['strategy']['matrix']['include']], s[0]['run'].count('.test.cjs')))"` prints `definitions=1 guard=matrix.family == 'v1' entries=['v1', 'v2'] tests=4`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Prove no file names the deleted runner (`.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs`). Verify: `bash -c '! git grep -q run-tests-sharded -- ":!specs" && echo GREP_CLEAN'` prints `GREP_CLEAN`.
- [x] T012 Confirm the package JSON parses and the default entry point still resolves (`.skilled/skills/system-spec-kit/runtime/package.json`). Verify: `node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/system-spec-kit/runtime/package.json','utf8'))" && node -e "const p=JSON.parse(require('fs').readFileSync('.skilled/skills/system-spec-kit/runtime/package.json','utf8')); console.log(p.scripts.test + ' / ' + Object.keys(p.scripts).length)"` prints `node scripts/run-tests.mjs / 17`.
- [x] T013 Confirm the workflow parses and still holds both jobs (`.github/workflows/opencode-dual-version.yml`). Verify: `python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/opencode-dual-version.yml')); print('jobs=' + ','.join(d['jobs'].keys()))"` prints `jobs=battery,both`.
- [x] T014 Confirm the four config-shape tests still run in the remaining execution (`.github/workflows/opencode-dual-version.yml`). Verify: `python3 -c "import yaml; s=[x for x in yaml.safe_load(open('.github/workflows/opencode-dual-version.yml'))['jobs']['battery']['steps'] if 'config-shape' in str(x.get('name'))][0]; print('tests=%d' % s['run'].count('.test.cjs'))"` prints `tests=4`.
- [x] T015 Confirm the diff is exactly the eight named paths (`.env.example`). Verify: `git status --short -- .skilled/skills/system-spec-kit/runtime .skilled/skills/system-spec-kit/ARCHITECTURE.md .env.example .github/workflows/opencode-dual-version.yml | wc -l | tr -d ' '` prints `8`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `git grep -n run-tests-sharded -- ':!specs'` prints nothing
- [x] The runtime package JSON parses and `scripts.test` is `node scripts/run-tests.mjs` with 17 scripts
- [x] The dual-version workflow parses with one config-shape definition guarded to the `v1` entry, two matrix entries and four test paths
- [x] `git status --short -- .skilled/skills/system-spec-kit/runtime .skilled/skills/system-spec-kit/ARCHITECTURE.md .env.example .github/workflows/opencode-dual-version.yml` lists exactly the eight named paths
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../007-test-and-ci-bloat-research/research/research.md` section 4 rank 7, and `../007-test-and-ci-bloat-research/research/lineages/opencode-go/research.md` lines 54 and 55
- **Runner**: See `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs`
- **Workflow**: See `.github/workflows/opencode-dual-version.yml`
<!-- /ANCHOR:cross-refs -->

---
