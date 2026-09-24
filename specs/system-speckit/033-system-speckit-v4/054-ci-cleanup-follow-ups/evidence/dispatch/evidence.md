# Phase 054 evidence pack (orchestrator-verified facts, the only source for packet docs)

Every fact below was observed by the orchestrator in worktree 066 on 2026-09-23.
Do not invent any fact that is not here. If a template section has no fact here, write
"N/A - insufficient source context" rather than guessing.

## Identity
- Packet: specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups, Level 2.
- Title: "CI cleanup follow-ups".
- Parent: specs/system-speckit/033-system-speckit-v4, phase 54 of 55. Predecessor 050-ci-cleanup-pi-proof, whose
  loose ends this phase closes. Successor none. Phases 051 to 053 and 055 belong to other sessions and share no files
  with this phase.
- Created 2026-09-23. Work ran 2026-09-23. Status: Complete.
- Worktree .worktrees/066-ci-cleanup-follow-ups, branch worktrees/066-ci-cleanup-follow-ups, rebased onto origin/main.
- Implementation executor: cli-pi with MiMo v2.6 pro through the llmgateway provider. The orchestrator wrote the
  briefs, reviewed every diff and ran every check. Briefs and raw output are in evidence/dispatch/ (wu1 to wu8).

## Problem
- The spec gate (isExemptTargetPath in .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs)
  exempted every write under /tmp and /private/tmp by location. Any path outside the repository is already exempt,
  which covers /tmp scratch space. So the extra rule only mattered for a repository that itself lives under /tmp,
  and there it switched the gate off.
- Test workspaces made under os.tmpdir() hit exactly that where the temp dir is /tmp, as on the Linux CI runner.
  Phase 050 worked around it by pointing TMPDIR at the runner's temp dir in the runtime vitest step of
  .github/workflows/spec-kit-check.yml.
- Measured before the change with TMPDIR=/tmp: the core spec-gate suite failed 16 tests, the devin suite 6 and the
  cursor suite 8.
- Six recorded cli-jev probe scripts carried only "set -u". The shell standard asks for "set -uo pipefail", and these
  six were the sk-code drift guard's 6 remaining errors.

## Purpose
- Gate a repository under /tmp like any other, remove the CI workaround that existed only because of the old rule,
  correct the docs that described it, and clear the drift guard's last errors.

## What changed
1. spec-gate-core.mjs: removed the helper isUnderAnyRoot and the /tmp and /private/tmp clause in isExemptTargetPath.
   The doc comment now says anything outside the repo already covers /tmp scratch space and a repo under /tmp is gated
   like any other. (wu2)
2. spec-gate-core.test.mjs: makeWorkspace takes a base directory (default os.tmpdir()). New test
   "a repository rooted under /tmp is gated like any other" expects deny under enforcement. It failed against the old
   gate and passes after the change. The path-traversal test's comment was reworded to match. (wu1)
3. .github/workflows/spec-kit-check.yml: removed the 4-line TMPDIR workaround (two comment lines, env:, TMPDIR) from
   the "Runtime vitest project" step. (wu3)
4. .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md: step 3 now
   says any fixture location works, /tmp included (wu4). Step 2's expected count moved from 107 to 108 tests, since
   the suite gained one (wu7).
5. .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md: step 1
   no longer says the core exempts /tmp. (wu5)
6. Six cli-jev scripts, set -u to set -uo pipefail: benchmark/reports/2026-09-20-hub-routing-baseline/raw/hub-routing-run.sh
   and cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/ auth-probe.sh, preflight-probe.sh,
   preflight-probe2.sh, probe-matrix.sh, probe-surface.sh. Every pipeline in them starts with printf, so a recorded exit
   code only changes if printf itself fails. (wu6)

## Commits (on branch worktrees/066-ci-cleanup-follow-ups, rebased onto origin/main)
- 7bde922cba fix(system-spec-kit): gate a repository under /tmp like any other
- a06dba0800 fix(cli-jev): run the recorded probe scripts under pipefail

## Verification (all observed)
- Core suite (node --experimental-test-module-mocks --test spec-gate-core.test.mjs): 108 of 108 pass, with TMPDIR=/tmp
  and with the default temp dir.
- devin 15 of 15, cursor 17 of 17 and Pi 9 of 9 spec-gate suites pass with TMPDIR=/tmp and with the default temp dir.
- Runtime root vitest project with TMPDIR=/tmp: 1,291 passed and 1 failed. The failure was
  opencode-plugins-folder-purity.vitest.ts, which could not import the gitignored dist of
  sk-communication/cli-communication-projection. CI builds that dist at spec-kit-check.yml line 84, and this worktree
  had not. After building it, that test passes with TMPDIR=/tmp, so the project stands at 1,292 passed, 0 failed,
  13 skipped.
- grep -c TMPDIR spec-kit-check.yml: 0. bash -n on the six scripts: all ok.
- sk-code drift guards (run-all-drift-guards.sh): all 2 guards passed, Errors 0 (6 before).
- A repo-wide search found no other text describing the /tmp exemption or the old 107 count.
- Rerun on the tree rebased onto origin/main (which added two root-project tests): runtime root vitest project
  1,294 passed, 0 failed, 13 skipped with TMPDIR=/tmp and again with the default temp dir
  (/var/folders/.../T). Core 108 of 108, devin 15 of 15 and cursor 17 of 17 pass under both temp dirs.

## Requirement and acceptance ids (use exactly these)
- REQ-001 (P0): a repository under /tmp is gated like any other. AC-001. Met. Evidence: the new core test, 108 of 108.
- REQ-002 (P0): no spec-gate suite regresses with the temp dir at /tmp or elsewhere. AC-002. Met. Evidence: core,
  devin, cursor and Pi suites above, root project 1,292 passed.
- REQ-003 (P1): CI runs the runtime vitest step with the runner's default temp dir. AC-003. Met. Evidence: grep TMPDIR 0.
- REQ-004 (P1): no doc still describes the /tmp exemption or the old count. AC-004. Met. Evidence: repo-wide search.
- REQ-005 (P1): the six cli-jev scripts run under pipefail and the drift guard reports 0 errors. AC-005. Met. Evidence:
  drift guards Errors 0, bash -n ok.
- Tasks: T001 read the gate and its tests, T002 new /tmp test (red), T003 gate change, T004 run the four gate suites
  under both temp dirs, T005 root project under /tmp, T006 CI workaround removal, T007 playbook wording, T008 playbook
  count, T009 cli-jev pipefail, T010 drift guards, T011 commit, T012 packet docs and parent rows.
  All done.

## Decisions
- Remove the location rule rather than keep the CI workaround. The operator chose this scope on 2026-09-23.
- Keep the out-of-repo exemption, which already covers /tmp scratch space for a repository that lives elsewhere.
- Update the playbook's expected count in the same change, since the change added the test that moved it.

## Out of scope (recorded elsewhere)
- The containment capture fix and the capture untrack: packet
  specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot.
- The phase 030 goal trim: recorded in the log of
  specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/goal.md. Its brief is wu8 in
  this packet's evidence/dispatch/, because the same orchestrator run dispatched it.

## Observation (record, do not fix)
- A fresh worktree does not build the gitignored dists the suites import: the shared package, the skill-advisor
  runtime, the spec-kit runtime and the communication-projection package. Their tests fail to load until built.
