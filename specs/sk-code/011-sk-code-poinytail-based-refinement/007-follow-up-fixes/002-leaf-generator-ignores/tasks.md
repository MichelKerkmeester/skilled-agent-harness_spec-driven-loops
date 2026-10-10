---
title: "Tasks: Phase 2: leaf-generator-ignores"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "leaf generator ignores tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: leaf-generator-ignores

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

All commands run from the repository root, the worktree at `.worktrees/092-sk-code-ponytail-refinement`. Two short names are used below. `GEN` is `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`. `GATE` is `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`. `PKT` is `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores`. Write the full paths into each command. The probe used by T005 and T017 is `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/__pycache__/probe.cpython-39.pyc`, and the builder removes it again after each use.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Load the repository rules this change triggers before the first write: `.skilled/repo-rules/prevent-overengineering.md` (a new test file), `.skilled/repo-rules/scope-discipline.md` (only the files in spec.md) and `.skilled/repo-rules/evidence-and-proof.md` (before any completion claim). Route the `.cjs` writes through `sk-code`. (REPO RULES.md and `.skilled/repo-rules/`). Evidence: the `REPO RULES:` line and the loaded rule names in the goal log. Evidence: Read REPO RULES.md and the three rule files -> loaded (see goal.md LOG). sk-code JavaScript references loaded; compiled-route returned sk-code-webflow, logged as a finding.
- [x] T002 Record the freshness gate baseline (`GATE`): run `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs; echo "exit=$?"`. Expected: the last line is `checked=14 fresh=14 failed=0` and the output ends with `exit=0`. The planner saw this result on 2026-10-10. Evidence: the two lines, copied into the goal log. Evidence: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs; echo exit=$? -> checked=14 fresh=14 failed=0 / exit=0
- [x] T003 Record the create-skill test baseline (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/`): run `for f in .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs; do node "$f" >/dev/null 2>&1; echo "$f exit=$?"; done > specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/scratch/baseline-tests.txt`, then `cat` that file. Expected: one line per test file, each ending `exit=0`. If a file ends with any other status, write its name in the goal log as a pre-existing failure before editing anything. REQ-006 then means "same status as this baseline". Evidence: the saved file. Evidence: loop over tests/*.test.cjs into scratch/baseline-tests.txt; cat -> all 12 lines end exit=0
- [x] T004 Save a reference copy of the generator before any edit: run `cp .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/scratch/generate-leaf-manifest.before.cjs`, then `cmp .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/scratch/generate-leaf-manifest.before.cjs; echo "exit=$?"`. Expected: `cmp` prints nothing and `exit=0`. Later diffs run against this copy, because `git diff` is not allowed in this packet. Evidence: the `exit=0` line. Evidence: cmp generator scratch/generate-leaf-manifest.before.cjs; echo exit=$? -> exit=0
- [x] T005 Reproduce the defect with the probe: run `mkdir -p .skilled/skills/sk-code/sk-code-opencode/assets/scripts/__pycache__ && : > .skilled/skills/sk-code/sk-code-opencode/assets/scripts/__pycache__/probe.cpython-39.pyc`, then run the gate command from T002. Expected: a line beginning `STALE sk-code`, a last line of `checked=14 fresh=13 failed=1`, and `exit=1`. Save the output to `scratch/repro-before.txt`. Then remove the probe: `rm .skilled/skills/sk-code/sk-code-opencode/assets/scripts/__pycache__/probe.cpython-39.pyc && rmdir .skilled/skills/sk-code/sk-code-opencode/assets/scripts/__pycache__`. Confirm with `ls .skilled/skills/sk-code/sk-code-opencode/assets/scripts/__pycache__; echo "exit=$?"`, which expects `No such file or directory` and `exit=1`. Evidence: the saved output and the `exit=1` line. Evidence: gate with probe -> STALE sk-code, checked=14 fresh=13 failed=1, exit=1 (scratch/repro-before.txt); ls of removed __pycache__ -> No such file or directory, exit=1
- [x] T006 Confirm the git behavior the fix depends on, read-only. (a) `printf '.skilled/skills/sk-code/sk-code-opencode/assets/scripts/__pycache__/probe.cpython-39.pyc\0' | git check-ignore -z --stdin; echo "exit=$?"`: expected the path, then a NUL, then `exit=0`. (b) `printf 'README.md\0' | git check-ignore -z --stdin; echo "exit=$?"`: expected only `exit=1`. (c) `git check-ignore -v .skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite; echo "exit=$?"`: expected only `exit=1`, because git does not report tracked files. (d) `(cd "$(node -e 'console.log(require("os").tmpdir())')" && git rev-parse --show-toplevel); echo "exit=$?"`: expected a `not a git repository` message and `exit=128`. Evidence: the four results. Evidence: printf path NUL | git check-ignore -z --stdin -> path and NUL, exit=0; README.md -> exit=1; check-ignore -v council-graph.sqlite -> exit=1, no output; tmpdir rev-parse -> fatal: not a git repository, exit=128

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add the import to `GEN`: insert `const { spawnSync } = require('child_process');` on the line directly after `const path = require('path');`, which is line 31. Evidence: `grep -n "spawnSync" .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` prints one line, numbered 32. Evidence: grep -n "const { spawnSync } = require('child_process')" generator -> 32:const { spawnSync } = require('child_process'); The bare spawnSync grep also matches the helper calls at 99 and 117, so the one-line expectation predates the helpers and the full import line was used.
- [x] T008 Add the constant and the name rule to the HELPERS section of `GEN`: insert `FALLBACK_IGNORED_SEGMENTS` and `fallbackIgnored(rel)` directly above the comment that begins `// Recursively collect packet-root-relative file paths`, which is line 87. Use plan.md section 3, "Key Components", for the contents. Evidence: `grep -n "FALLBACK_IGNORED_SEGMENTS\|function fallbackIgnored" .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` prints two lines, both above the `walkLeafFiles` comment. Evidence: grep -n 'FALLBACK_IGNORED_SEGMENTS|function fallbackIgnored' generator -> 90 const FALLBACK_IGNORED_SEGMENTS and 92 function fallbackIgnored, both above the walk comment at 130 (line 94 is a use inside fallbackIgnored, also matched).
- [x] T009 Add `gitToplevel(cwd)` and `dropGitIgnoredLeaves(packetRoot, rels)` to the HELPERS section of `GEN`, directly after `fallbackIgnored`. Follow plan.md section 3, "Helper Contract", steps 1 to 7, exactly. The exit-status rule is: 0 and 1 are answers, and anything else, including `res.error` and a `null` status, is the name-rule fallback. Use the two comments in plan.md section 3, "Comments to Propose", word for word. Evidence: `node --check .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs; echo "exit=$?"` prints nothing and `exit=0`. Evidence: node --check generator; echo exit=$? -> check exit=0
- [x] T010 Replace the one `return out;` in `walkLeafFiles` with `return dropGitIgnoredLeaves(packetRoot, out);`. The line is 129 before the edit, directly after the `for` loop that ends at line 128. Keep the early `if (!fs.existsSync(start)) return [];` and the three symlink throws unchanged, so they still fire before the filter runs. Evidence: `grep -n "dropGitIgnoredLeaves(packetRoot, out)" .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` prints one line, and `grep -n "return out;" .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` prints nothing and exits 1. Evidence: grep -n 'dropGitIgnoredLeaves(packetRoot, out)' generator -> 172:  return dropGitIgnoredLeaves(packetRoot, out); grep -n 'return out;' -> no output, exit=1
- [x] T011 Create `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs` as plan.md section 5 describes. Use the banner and numbered sections of `generate-leaf-manifest-scopes.test.cjs`. Write `testGitIgnoredLeafIsDropped` and `testFallbackDropsGeneratedNoise`, the run block that prints an `ok - ` line after each case, and the final line `[sk-doc] leaf-manifest ignore filtering coverage passed`. Use `node:` built-ins only. Evidence: `node --check .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs; echo "exit=$?"` prints nothing and `exit=0`. Evidence: node --check tests/generate-leaf-manifest-ignores.test.cjs; echo exit=$? -> check exit=0
- [x] T012 Add the contents row to `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md` section 2. Insert it directly above the `generate-leaf-manifest-scopes.test.cjs` row: `| \`generate-leaf-manifest-ignores.test.cjs\` | Tests that git-ignored leaves are dropped and that the fallback drops generated noise outside a work tree. |`. Evidence: T021 finds the row. Evidence: grep -n generate-leaf-manifest-ignores tests/README.md -> 28: row for generate-leaf-manifest-ignores.test.cjs, exit=0

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify REQ-001 (git drops an ignored leaf): run `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs; echo "exit=$?"`. Expected: an `ok - git-ignored leaf is dropped` line, the summary line, and `exit=0`. Case 1 asserts that `references/generated/out.md` is absent from the leaves. Evidence: the output lines. Evidence: node tests/generate-leaf-manifest-ignores.test.cjs; echo exit=$? -> [sk-doc] leaf-manifest ignore filtering coverage passed, exit=0
- [x] T014 Verify REQ-002 (fallback outside a work tree): the run in T013 must also print `ok - fallback drops generated noise outside a work tree`. Case 2 asserts its precondition, a non-zero `git rev-parse` status, and T006(d) shows the same result by hand. Evidence: the output line and the T006(d) result. Evidence: same run -> ok - fallback drops generated noise outside a work tree; the rev-parse precondition assert passed.
- [x] T015 Verify REQ-003 (exit status 1 is not an error): in the same run as T013, Case 1 walks the `assets/` root, which has no ignored file, and keeps `assets/logo.txt`. Expected: the leaves equal `['assets/logo.txt', 'references/keep.md']`. Evidence: the T013 output. Evidence: same run -> deepEqual ['assets/logo.txt', 'references/keep.md'] passed, so the assets walk kept its file. The git status-1 path is inferred from the per-root call, not captured separately.
- [x] T016 Verify REQ-004 (committed manifests unchanged): run the gate command from T002. Expected: the last line is `checked=14 fresh=14 failed=0` and `exit=0`. Then run `git status --short -- '*/leaf-manifest.json'`. Expected: no output. Evidence: both results. Evidence: node ci-leaf-manifest-freshness.cjs; echo exit=$? -> checked=14 fresh=14 failed=0, exit=0; git status --short -- '*/leaf-manifest.json' -> no output
- [x] T017 Verify REQ-005 (gate green with the probe present): create the probe as T005 does, then run the gate command from T002. Expected: `checked=14 fresh=14 failed=0` and `exit=0`. Save the output to `scratch/repro-after.txt`. Remove the probe and its folder as T005 does, and confirm the removal as T005 does. Evidence: the saved output and the removal check. Evidence: gate with probe -> checked=14 fresh=14 failed=0, exit=0 (scratch/repro-after.txt); probe and folder removed; ls -> No such file or directory, exit=1
- [x] T018 Verify REQ-006 (existing tests keep their status): run the T003 loop, writing to `scratch/after-tests.txt`, then run `diff specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/scratch/baseline-tests.txt specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/scratch/after-tests.txt; echo "exit=$?"`. Expected: the only difference is one added line for `generate-leaf-manifest-ignores.test.cjs exit=0`. `diff` exits 1 because of that addition, so read the lines and do not rely on the exit status alone. Evidence: the diff output. Evidence: diff scratch/baseline-tests.txt scratch/after-tests.txt -> only added line '> .../generate-leaf-manifest-ignores.test.cjs exit=0'; FAIL loop prints nothing
- [x] T019 Verify REQ-007 (tracked files are never dropped): run `git ls-files --error-unmatch .skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite; echo "exit=$?"`, expected the path and `exit=0`. Then run `git check-ignore -v .skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite; echo "exit=$?"`, expected only `exit=1`. The file matches the ignore rule at `.gitignore:144` and is tracked. Evidence: both results. Evidence: git ls-files --error-unmatch council-graph.sqlite; echo exit=$? -> path, exit=0; git check-ignore -v council-graph.sqlite -> no output, exit=1
- [x] T020 Verify REQ-008 (comment hygiene): run `grep -nE 'REQ-|SC-|T[0-9]{3}|Phase [0-9]|specs/' .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs; echo "exit=$?"`. Expected: no output and `exit=1`. The generator had no match before the change, so any match now is new and must be removed. Evidence: the `exit=1` line. Evidence: grep -nE 'REQ-|SC-|T[0-9]{3}|Phase [0-9]|specs/' generator test; echo exit=$? -> no output, exit=1
- [x] T021 Verify REQ-009 (README row present): run `grep -n "generate-leaf-manifest-ignores" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md; echo "exit=$?"`. Expected: one line and `exit=0`. Evidence: grep -n generate-leaf-manifest-ignores tests/README.md -> 28: row, exit=0
- [x] T022 Verify SC-002 (before and after the probe): `scratch/repro-before.txt` from T005 shows `STALE sk-code` and `failed=1` with exit 1. `scratch/repro-after.txt` from T017 shows `checked=14 fresh=14 failed=0` with exit 0. Evidence: `cat` both files. Evidence: scratch/repro-before.txt -> STALE sk-code, checked=14 fresh=13 failed=1, exit=1; scratch/repro-after.txt -> checked=14 fresh=14 failed=0, exit=0
- [x] T023 Verify SC-001 and SC-003 (totals and the new file): the totals from T002 and T016 are identical, `checked=14 fresh=14 failed=0`, and the T013 run prints the summary line with `exit=0`. Evidence: the recorded lines from T002, T016 and T013. Evidence: totals T002 checked=14 fresh=14 failed=0; T016 checked=14 fresh=14 failed=0 (identical); T013 summary line with exit=0
- [x] T024 Verify SC-004 (strict validation, last): run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores --strict; echo "exit=$?"`. Expected: `RESULT: PASSED` and `exit=0`. Then run `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores`, expected `RESULT: PASSED`. Evidence: both result lines. Evidence: validate.sh <folder> --strict; echo exit=$? -> RESULT: PASSED, Errors: 0 Warnings: 0, exit=0 (after repair-derived --apply). check-goal.cjs <folder> -> RESULT: PASSED (5/5 checks).

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` Evidence: T001 to T024 each carry an evidence line above.
- [x] No `[B]` blocked tasks remaining Evidence: no task was blocked.
- [x] Manual verification passed Evidence: the gate, probe, test-loop and hygiene checks above.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
