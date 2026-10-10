---
title: "Goal: Phase 2: leaf-generator-ignores"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores"
    last_updated_at: "2026-10-10T05:34:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-002-leaf-generator-ignores"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: leaf-generator-ignores

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the leaf-manifest walk skip the files git ignores, so a skill holding a stray `__pycache__` reports fresh and the freshness gate reflects only tracked content.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Git decides what is ignored: one `git check-ignore -z --stdin` call per walk, run from the repository root, and the walk makes no other per-file git call. |
| D2 | When git is unavailable or check-ignore exits with a status other than 0 or 1, the walk drops `__pycache__`, `node_modules` and `.DS_Store` path segments and files ending `.pyc`. Exit status 1 means nothing is ignored and is not an error. |
| D3 | A leaf symlink is judged by its own link path, not by its target, because the manifest lists the link path. Only the candidate's directory is resolved with `fs.realpathSync`. This departs from the brief's wording and is recorded in the log. |
| D4 | Tests live in a new `tests/generate-leaf-manifest-ignores.test.cjs`. The change touches only `walkLeafFiles` and its helpers, and every committed `leaf-manifest.json` stays byte-identical. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs; echo "exit=$?"` prints `ok - git-ignored leaf is dropped`, `ok - fallback drops generated noise outside a work tree`, the line `[sk-doc] leaf-manifest ignore filtering coverage passed`, and `exit=0`. This covers REQ-001, REQ-002 and REQ-003.
- [ ] From the repository root, `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs; echo "exit=$?"` prints the last line `checked=14 fresh=14 failed=0` and `exit=0`, and `git status --short -- '*/leaf-manifest.json'` prints nothing. This covers REQ-004.
- [ ] With the probe file `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/__pycache__/probe.cpython-39.pyc` created, the gate command in the previous criterion prints `checked=14 fresh=14 failed=0` and `exit=0`. The probe and its folder are then removed, and `ls` on that folder prints `No such file or directory` and exits 1. This covers REQ-005.
- [ ] From the repository root, `for f in .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs; do node "$f" >/dev/null 2>&1 || echo "FAIL $f"; done` prints nothing. If the Phase 1 baseline in `scratch/baseline-tests.txt` already lists a file with a non-zero status, the same FAIL line may appear for that file and no other. This covers REQ-006.
- [ ] From the repository root, `grep -nE 'REQ-|SC-|T[0-9]{3}|Phase [0-9]|specs/' .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs; echo "exit=$?"` prints nothing and `exit=1`. This covers REQ-008.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Repo rules loaded before the first write (T001) | Done | `REPO RULES:` router read; `prevent-overengineering.md`, `scope-discipline.md` and `evidence-and-proof.md` loaded. Gate 6 files `communication.md`, `communication-prose.md` and `communication-handoff.md` loaded. sk-code JavaScript references loaded for the `.cjs` writes. |
| Baseline freshness gate before any edit (T002) | Done | `node ci-leaf-manifest-freshness.cjs` -> `checked=14 fresh=14 failed=0`, `exit=0` |
| Baseline create-skill tests before any edit (T003, T004) | Done | All 12 `tests/*.test.cjs` exit 0 (`scratch/baseline-tests.txt`). Pre-edit copy saved as `scratch/generate-leaf-manifest.before.cjs`, `cmp` exit 0. |
| Defect reproduced with the probe, negative control (T005) | Done | `STALE sk-code`, `checked=14 fresh=13 failed=1`, `exit=1` (`scratch/repro-before.txt`). Probe removed afterwards. |
| Git drops ignored leaves, the fallback drops generated noise, exit status 1 keeps files (REQ-001 to REQ-003) | Done | `node tests/generate-leaf-manifest-ignores.test.cjs; echo exit=$?` -> `ok - git-ignored leaf is dropped`, `ok - fallback drops generated noise outside a work tree`, `[sk-doc] leaf-manifest ignore filtering coverage passed`, `exit=0` |
| Committed manifests stay byte-identical and the gate prints checked=14 fresh=14 failed=0 (REQ-004) | Done | Gate after the edit: `checked=14 fresh=14 failed=0`, `exit=0`. `git status --short -- '*/leaf-manifest.json'` prints nothing. |
| Gate stays green with the probe present (REQ-005) | Done | With the probe: `checked=14 fresh=14 failed=0`, `exit=0` (`scratch/repro-after.txt`). Probe and folder removed; `ls` -> `No such file or directory`, exit 1. |
| Existing create-skill tests keep their baseline status (REQ-006) | Done | `diff scratch/baseline-tests.txt scratch/after-tests.txt` adds only the new file's `exit=0` line. The FAIL loop prints nothing. |
| Tracked files are never dropped (REQ-007) | Done | `git ls-files --error-unmatch council-graph.sqlite` -> exit 0; `git check-ignore -v` on it -> exit 1, no output |
| Comment-hygiene grep prints nothing (REQ-008) | Done | `grep -nE 'REQ-|SC-|T[0-9]{3}|Phase [0-9]|specs/'` over both code files -> no output, `exit=1` |
| README row present (REQ-009) | Done | `tests/README.md:28`, `exit=0` |
| Strict validation prints RESULT: PASSED | Done | `validate.sh <folder> --strict; echo exit=$?` -> `RESULT: PASSED`, `Errors: 0  Warnings: 0`, `exit=0`, after `repair-derived.cjs --apply`. `check-goal.cjs` -> `RESULT: PASSED (5/5 checks)`. |

### Deviations and findings

| Item | Note |
|------|------|
| Leaf symlinks are judged by their link path | The brief asks for `fs.realpathSync` on each candidate. The plan resolves only the candidate's directory, so a leaf symlink is judged by the path the manifest lists rather than by its target. The two differ only for symlink leaves (plan.md section 3, Helper Contract, step 3). |
| Two constant git calls per walk | `git rev-parse --show-toplevel` runs once per walk, alongside the one `check-ignore`. Neither runs per file. |
| Create-skill `.test.cjs` files are not run in CI | No workflow runs them; `sk-doc-script-tests.yml` runs only `test_*.py`. The new file joins its siblings in the README loop. Wiring them into CI is an operator decision and is out of scope. |
| Tracked files are never dropped | `git check-ignore` without `--no-index` does not report tracked files, so a tracked file that matches an ignore rule stays in its manifest. This is the intended behavior (REQ-007). |
| Compiled router resolved the `.cjs` write to `sk-code-webflow` | The sk-code compiled route returned a frontend surface for a Node CommonJS task. sk-code-opencode's SKILL.md detection rule maps `.skilled/` work with `.cjs` files to its JavaScript standards, so those were loaded. Router finding for the operator; not changed here. |
| Plan risk table and testing section disagree on the fallback precondition | plan.md section 5 has Case 2 assert a non-zero `git rev-parse` status first. plan.md section 6 says the fallback case still passes with TMPDIR inside a work tree, which that assert would fail. The build follows section 5 and tasks T011 and T014, so a TMPDIR inside a work tree fails loudly. Section 6 should be amended to match. This environment is not affected: TMPDIR sits outside every work tree (T006 d). |
| New test file header | The javascript-checklist P0 rule forbids the 78-column box on a new file. Tasks T011 says to copy the sibling banner. The new file uses the MODULE divider instead. |
| Grep expectations in T007 and T008 | Both "one line" expectations predate the helper functions. The helpers also call `spawnSync` and use `FALLBACK_IGNORED_SEGMENTS`, so those greps match more lines. The import is at line 32 and the constant at line 90. The evidence records the real output. |
| README row routed through sk-create-readme | The sk-doc router resolved this to sk-create-readme. That packet covers authoring from local evidence, and this change is one factual row in an existing table, so the row was added without a rewrite. |
<!-- /ANCHOR:log -->
