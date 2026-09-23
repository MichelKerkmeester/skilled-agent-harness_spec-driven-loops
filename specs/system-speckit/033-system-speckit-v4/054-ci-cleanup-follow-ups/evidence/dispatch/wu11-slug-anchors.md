GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups
Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

PERSONA
You are @markdown, a LEAF documentation executor at depth 1. You make exactly the edit described,
run the named VERIFY commands, and return one handback block. Nested dispatch is illegal: do not start
another pi, cli or agent process. If you cannot finish, stop and report where.

Repo root: the current working directory (all paths from there).

DON'T
- No git state change of any kind (no add, commit, checkout, stash, restore).
- No nested CLI, no agent dispatch, no command beyond the VERIFY commands.
- Do not reword, reorder or "improve" anything outside the EDITS. Do not touch any other file.
- Never put spec paths, packet or phase numbers, or task ids in code comments.
- If an OLD text is not found exactly once, skip that EDIT, do the rest, and report it under
  failures. Never guess a nearby match.

TARGETS: the packet docs of specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot and specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups (18 edits in 6 files)

WHY: strict validation rejects the last_updated_by value because it is not an actor slug. Each acceptance row gains a
file:line anchor so its Verification cell is checkable, AC-003 of the second packet claimed a run that did not happen
in that form, and both implementation summaries gain the rerun on the rebased tree.

Every OLD below occurs exactly once in its file. Replace the whole OLD text with the whole NEW text. A NEW that adds a
line keeps the OLD line and puts the new line right after it. Change nothing else.

EDIT 1 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/goal.md
OLD:     last_updated_by: "cli-pi mimo-v2.6-pro (orchestrated)"
NEW:     last_updated_by: "cli-pi-mimo-v2.6-pro"
END EDIT 1

EDIT 2 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/acceptance-criteria.md
OLD:     last_updated_by: "cli-pi mimo-v2.6-pro (orchestrated)"
NEW:     last_updated_by: "cli-pi-mimo-v2.6-pro"
END EDIT 2

EDIT 3 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/implementation-summary.md
OLD:     last_updated_by: "cli-pi mimo-v2.6-pro (orchestrated)"
NEW:     last_updated_by: "cli-pi-mimo-v2.6-pro"
END EDIT 3

EDIT 4 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/acceptance-criteria.md
OLD:     last_updated_by: "cli-pi mimo-v2.6-pro (orchestrated)"
NEW:     last_updated_by: "cli-pi-mimo-v2.6-pro"
END EDIT 4

EDIT 5 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/implementation-summary.md
OLD:     last_updated_by: "cli-pi mimo-v2.6-pro (orchestrated)"
NEW:     last_updated_by: "cli-pi-mimo-v2.6-pro"
END EDIT 5

EDIT 6 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/acceptance-criteria.md
OLD: | AC-001 | REQ-001 | Given a fan-out snapshot with capture folders an earlier run left in the tree, When the snapshot loop runs in write-containment.ts, Then the snapshot never copies a capture folder into the containment baseline | write-containment.vitest.ts ran the new snapshot test in the baseline content capture group and reported 79 passed | Met | - |
NEW: | AC-001 | REQ-001 | Given a fan-out snapshot with capture folders an earlier run left in the tree, When the snapshot loop runs in write-containment.ts, Then the snapshot never copies a capture folder into the containment baseline | write-containment.vitest.ts ran the new snapshot test in the baseline content capture group and reported 79 passed. Anchor: .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:334. | Met | - |
END EDIT 6

EDIT 7 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/acceptance-criteria.md
OLD: | AC-002 | REQ-002 | Given capture folders an earlier run left in the tree, When the detection forward loop runs in write-containment.ts, Then detection never reports an earlier run capture as a new violation | write-containment.vitest.ts ran the new detection test in the baseline content capture group and reported 79 passed | Met | - |
NEW: | AC-002 | REQ-002 | Given capture folders an earlier run left in the tree, When the detection forward loop runs in write-containment.ts, Then detection never reports an earlier run capture as a new violation | write-containment.vitest.ts ran the new detection test in the baseline content capture group and reported 79 passed. Anchor: .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:351. | Met | - |
END EDIT 7

EDIT 8 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/acceptance-criteria.md
OLD: | AC-003 | REQ-003 | Given the capture output under the containment baseline and quarantine dirs, When git ls-files runs under both capture kinds, Then no capture output is tracked and both capture kinds are ignored through the two .gitignore patterns | git ls-files under both capture kinds reported 0 files and the longest tracked path went from 971 before to 353 after, rechecked after rebase | Met | - |
NEW: | AC-003 | REQ-003 | Given the capture output under the containment baseline and quarantine dirs, When git ls-files runs under both capture kinds, Then no capture output is tracked and both capture kinds are ignored through the two .gitignore patterns | git ls-files under both capture kinds reported 0 files and the longest tracked path went from 971 before to 353 after, rechecked after rebase. Anchor: .gitignore:369. | Met | - |
END EDIT 8

EDIT 9 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/acceptance-criteria.md
OLD: | AC-004 | REQ-004 | Given the fixed tree at the final HEAD, When a fresh worktree is added with git worktree add --detach and removed with plain git worktree remove, Then the removal exits 0 with the folder gone and no worktree entry left | The live removal proof reported both commands exit 0 on a worktree of 115,878 tracked files with the longest absolute path at 448 characters | Met | - |
NEW: | AC-004 | REQ-004 | Given the fixed tree at the final HEAD, When a fresh worktree is added with git worktree add --detach and removed with plain git worktree remove, Then the removal exits 0 with the folder gone and no worktree entry left | The live removal proof reported both commands exit 0 on a worktree of 115,878 tracked files with the longest absolute path at 448 characters. Anchor: evidence/dispatch/evidence.md:58. | Met | - |
END EDIT 9

EDIT 10 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/acceptance-criteria.md
OLD: | AC-005 | REQ-005 | Given the sk-doc README verdict baseline after dropping the 246 capture READMEs from 1,304 entries to 1,058, When test_readme_verdict_parity.py runs, Then the baseline stays in parity | test_readme_verdict_parity.py reported PARITY PASS with 1,058 files and 0 diffs | Met | - |
NEW: | AC-005 | REQ-005 | Given the sk-doc README verdict baseline after dropping the 246 capture READMEs from 1,304 entries to 1,058, When test_readme_verdict_parity.py runs, Then the baseline stays in parity | test_readme_verdict_parity.py reported PARITY PASS with 1,058 files and 0 diffs. Anchor: evidence/dispatch/evidence.md:57. | Met | - |
END EDIT 10

EDIT 11 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/acceptance-criteria.md
OLD: | AC-006 | REQ-006 | Given the two new tests in write-containment.vitest.ts, When each test runs before and after its guard, Then each guard has a test that failed before it and passes after it | Both new tests were red before their guard and pass after it, and the six containment-related test files reported 395 passed and 1 skipped | Met | - |
NEW: | AC-006 | REQ-006 | Given the two new tests in write-containment.vitest.ts, When each test runs before and after its guard, Then each guard has a test that failed before it and passes after it | Both new tests were red before their guard and pass after it, and the six containment-related test files reported 395 passed and 1 skipped. Anchor: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:956. | Met | - |
END EDIT 11

EDIT 12 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/acceptance-criteria.md
OLD: | AC-001 | REQ-001 | Given the spec gate core without the /tmp and /private/tmp location clause and a core test that builds a repository under /tmp, When the core suite runs the new test named a repository rooted under /tmp is gated like any other, Then the gate denies the write under enforcement like it does for any other repository | node --experimental-test-module-mocks --test spec-gate-core.test.mjs reported 108 of 108 pass with TMPDIR=/tmp and with the default temp dir, and the new test failed against the old gate before the change (wu1 and wu2) | Met | - |
NEW: | AC-001 | REQ-001 | Given the spec gate core without the /tmp and /private/tmp location clause and a core test that builds a repository under /tmp, When the core suite runs the new test named a repository rooted under /tmp is gated like any other, Then the gate denies the write under enforcement like it does for any other repository | node --experimental-test-module-mocks --test spec-gate-core.test.mjs reported 108 of 108 pass with TMPDIR=/tmp and with the default temp dir, and the new test failed against the old gate before the change (wu1 and wu2). Anchor: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs:823. | Met | - |
END EDIT 12

EDIT 13 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/acceptance-criteria.md
OLD: | AC-002 | REQ-002 | Given the four spec-gate suites and the runtime root vitest project, When each runs with TMPDIR=/tmp and with the default temp dir, Then no suite regresses and the root project passes | The core suite reported 108 of 108, devin 15 of 15, cursor 17 of 17 and Pi 9 of 9 under both temp dirs, and the runtime root vitest project stood at 1,292 passed, 0 failed, 13 skipped after the communication-projection dist was built | Met | - |
NEW: | AC-002 | REQ-002 | Given the four spec-gate suites and the runtime root vitest project, When each runs with TMPDIR=/tmp and with the default temp dir, Then no suite regresses and the root project passes | The core suite reported 108 of 108, devin 15 of 15, cursor 17 of 17 and Pi 9 of 9 under both temp dirs, and the runtime root vitest project stood at 1,292 passed, 0 failed, 13 skipped after the communication-projection dist was built. Anchor: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1538. | Met | - |
END EDIT 13

EDIT 14 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/acceptance-criteria.md
OLD: | AC-003 | REQ-003 | Given the runtime vitest step in .github/workflows/spec-kit-check.yml without the 4-line TMPDIR workaround, When the step runs on the runner, Then it runs with the runner's default temp dir and passes | grep -c TMPDIR on .github/workflows/spec-kit-check.yml reported 0, and the runtime root vitest project passed 1,292 tests with TMPDIR=/tmp and with the default temp dir (wu3) | Met | - |
NEW: | AC-003 | REQ-003 | Given the runtime vitest step in .github/workflows/spec-kit-check.yml without the 4-line TMPDIR workaround, When the step runs on the runner, Then it runs with the runner's default temp dir and passes | grep -c TMPDIR on .github/workflows/spec-kit-check.yml reported 0, and on the tree rebased onto origin/main the runtime root vitest project passed 1,294 tests with 0 failed under TMPDIR=/tmp and again under the default temp dir (wu3). Anchor: .github/workflows/spec-kit-check.yml:124. | Met | - |
END EDIT 14

EDIT 15 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/acceptance-criteria.md
OLD: | AC-004 | REQ-004 | Given the two manual-testing playbooks corrected in wording and expected count, When a repo-wide search looks for text that describes the /tmp exemption or the old 107 count, Then no such text remains anywhere | A repo-wide search found no other text describing the /tmp exemption or the old 107 count, and the playbooks were fixed in wu4, wu5 and wu7 | Met | - |
NEW: | AC-004 | REQ-004 | Given the two manual-testing playbooks corrected in wording and expected count, When a repo-wide search looks for text that describes the /tmp exemption or the old 107 count, Then no such text remains anywhere | A repo-wide search found no other text describing the /tmp exemption or the old 107 count, and the playbooks were fixed in wu4, wu5 and wu7. Anchor: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md:75. | Met | - |
END EDIT 15

EDIT 16 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/acceptance-criteria.md
OLD: | AC-005 | REQ-005 | Given the six cli-jev probe scripts moved from set -u to set -uo pipefail, When bash -n parses each script and the sk-code drift guards run, Then every script parses and the drift guard reports 0 errors | bash -n on the six scripts reported all ok, and run-all-drift-guards.sh reported all 2 guards passed with Errors 0 against 6 before the change (wu6) | Met | - |
NEW: | AC-005 | REQ-005 | Given the six cli-jev probe scripts moved from set -u to set -uo pipefail, When bash -n parses each script and the sk-code drift guards run, Then every script parses and the drift guard reports 0 errors | bash -n on the six scripts reported all ok, and run-all-drift-guards.sh reported all 2 guards passed with Errors 0 against 6 before the change (wu6). Anchor: .skilled/skills/cli-jev/benchmark/reports/2026-09-20-hub-routing-baseline/raw/hub-routing-run.sh:5. | Met | - |
END EDIT 16

EDIT 17 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/implementation-summary.md
OLD: | Runtime root vitest project with TMPDIR=/tmp | PASS after one local build. First 1,291 passed and 1 failed, since opencode-plugins-folder-purity.vitest.ts could not import the gitignored dist of sk-communication/cli-communication-projection, which this worktree had not built. After building it the project stands at 1,292 passed, 0 failed, 13 skipped |
NEW: | Runtime root vitest project with TMPDIR=/tmp | PASS after one local build. First 1,291 passed and 1 failed, since opencode-plugins-folder-purity.vitest.ts could not import the gitignored dist of sk-communication/cli-communication-projection, which this worktree had not built. After building it the project stands at 1,292 passed, 0 failed, 13 skipped |
| Rerun on the tree rebased onto origin/main | PASS. Runtime root vitest project 1,294 passed, 0 failed, 13 skipped with TMPDIR=/tmp and with the default temp dir. Core 108 of 108, devin 15 of 15 and cursor 17 of 17 under both temp dirs |
END EDIT 17

EDIT 18 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/implementation-summary.md
OLD: | `write-containment.vitest.ts` | PASS. 79 passed |
NEW: | `write-containment.vitest.ts` | PASS. 79 passed |
| `write-containment.vitest.ts` rerun on the tree rebased onto origin/main | PASS. 79 passed |
END EDIT 18

VERIFY - run these, paste each command with its result line
  grep -rc 'cli-pi mimo-v2.6-pro (orchestrated)' specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/*.md specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/*.md | grep -v ':0$'   # expect no output
  grep -c 'Anchor: ' specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/acceptance-criteria.md   # expect 6
  grep -c 'Anchor: ' specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/acceptance-criteria.md   # expect 5
  grep -c 'rebased onto origin/main' specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/implementation-summary.md specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/implementation-summary.md   # expect 1 each

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
