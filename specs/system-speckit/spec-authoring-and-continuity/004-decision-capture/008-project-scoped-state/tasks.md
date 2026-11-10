---
title: "Tasks: Phase 8: project-scoped-state"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "project scoped state tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: project-scoped-state

<!-- SPECKIT_LEVEL: 2 -->

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

`$DC` is `.skilled/hooks/decision-capture`. `$RT` is `.skilled/skills/system-spec-kit/runtime`. `$PB` is `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks`. Vitest commands run from `.skilled/skills/system-spec-kit` with `--config vitest.config.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the shared-state baseline (`spec.md` Measured Behavior). Verify: the five commands print the quoted output. Evidence: run 2026-11-03; the scratch matcher printed `1 session-a` for `app-b`. Rerun before the first edit if `main` has moved.
- [x] T002 Record the suite baseline. Verify: `node --test $DC/lib/*.test.mjs $DC/bin/*.test.mjs` reports `fail 0`. Evidence: 2026-11-03, hooks lib and bin 99 of 99; writer and matcher vitest 27 of 27; claude and devin adapters 8 of 8; Pi vitest 10 of 10; `hook-session-stop.vitest.ts` 19 of 19.
- [x] T003 Confirm the ignore rule covers a token subfolder (`.gitignore`). Verify: `git check-ignore -v .skilled/skills/.state/decision-capture/0123456789ab/x.jsonl` prints `.gitignore:132`. Evidence: `.gitignore:132:.skilled/skills/.state/*/*`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the canonical root, `projectToken` and the scoped `queueDir` (`$DC/lib/capture-core.mjs`, `capture-core.test.mjs`). Verify: a test asserts `basename(queueDir(root))` equals the first 12 hex characters of `sha256(realpath(root))`, and that a subfolder, a symlinked path and an exported `GIT_DIR` give the same folder. Evidence: `canonicalRoot` runs `git rev-parse --show-toplevel` through `execFileSync` with `GIT_DIR` and `GIT_WORK_TREE` deleted, then `realpath`, falling back to `realpath` and then `resolve`, memoized per input; the test `queueDir uses the git root for its token across project paths` passes; `capture-core.test.mjs` 25 of 25.
- [x] T005 Dual-read the legacy root in `readQueue` and `readConsumedKeys`, and write only the subfolder (`$DC/lib/capture-core.mjs`, `capture-core.test.mjs`). Verify: a migration case seeds a root queue file and a root consumed row; `readQueue` returns the legacy row, `pendingRecords` drops the legacy-consumed key, and `appendRecords` of a legacy key appends nothing. A two-project case shows `readConsumedKeys(B)` lacks A's key. Evidence: `legacy queue and consumed rows remain visible without receiving new writes` (appending every legacy and consumed key returns `{ appended: 0, skipped: 8 }`) and `consumed keys stay isolated between projects` pass.
- [x] T006 Export `stateDirPath` and the legacy log path, dual-read `readConsumedRows`, write only the project log (`$RT/lib/continuity/decision-record-writer.ts`, `$RT/api/index.ts`). Verify: `rg -n 'export function stateDirPath' $RT/lib/continuity/decision-record-writer.ts` prints one line and the writer suite passes. Evidence: `rg` prints `805:export function stateDirPath`; `legacyConsumedLogPath` is exported at line 811; `api/index.ts` re-exports both at lines 129 and 130; the writer suite passes inside the 52 below.
- [x] T007 Prove ESM and TypeScript agree (`$RT/cli/tests/decision-record-writer.vitest.ts`). Verify: a case imports `capture-core.mjs` dynamically and asserts `queueDir(dir) === stateDirPath(dir)` for a temp git root, its subfolder, a symlink to it and a non-git temp folder; a second case seeds a root consumed row and asserts `recordConsumedKeys` skips that key and leaves the root log byte-identical. Evidence: `matches capture-core paths for git roots, subfolders, symlinks and non-git folders` and `reads legacy consumed rows, skips their keys and leaves the legacy log unchanged` pass.
- [x] T008 Point the matcher at `stateDirPath` (`$RT/cli/continuity/match-decision-table.ts`, `$RT/cli/tests/match-decision-table.vitest.ts`). Verify: `rg -c 'STATE_DIR_SEGMENTS' $RT/cli/continuity/match-decision-table.ts` prints nothing; new cases show `--session` reads a root queue row, `--release` removes a key held only in the root `consumed.jsonl`, `--scan-orphans` skips a root queue file, and a second linked project's session is not listed. Evidence: `rg -c 'STATE_DIR_SEGMENTS'` prints nothing, exit 1; the four new matcher cases pass inside the 52 below.
- [x] T009 [P] Rewrite the structure and cleanup sections (`.skilled/skills/.state/decision-capture/README.md`). Verify: `rg -n 'project-token' .skilled/skills/.state/decision-capture/README.md` prints the structure row, and the file names the legacy root files and the sanctioned `.skilled` link. Evidence: `rg -n 'project-token'` prints `35:| \`<project-token>/\` | Folder | Everything below lives here, one folder per project. ...`; line 25 names the sanctioned link.
- [x] T010 [P] Name the per-project subfolder (`.skilled/hooks/README.md`, `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md`). Verify: `rg -n 'project' .skilled/hooks/README.md` prints the decision-capture line that names the subfolder. Evidence: `127:+-- decision-capture/                # operator answers queued per project for the next full-auto save`; line 29 of the catalog entry names a subfolder named by a hash of the project's real root.
- [x] T011 [P] Resolve the queue folder through `queueDir` in the six playbooks (`$PB/decision-capture-*.md`). Verify: the flat-root check `rg -n 'decision-capture/\*\.jsonl|decision-capture/consumed|decision-capture/\.nudge|maxdepth 1' $PB/decision-capture-*.md` prints nothing. Evidence: it prints nothing, exit 1. The first pattern also matched the new `decision-capture/*/` globs, so it was replaced by this flat-root form. The save-writer steps 3 to 5 had quoted the glob, which never expands; the glob is now outside the quotes, and `wc -l <` on that form printed `1` in a scratch folder.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun every decision-capture suite. Verify: `node --test $DC/lib/*.test.mjs $DC/bin/*.test.mjs` and the claude and devin tests report `fail 0`; the writer, matcher, Pi and `hook-session-stop.vitest.ts` suites report no failure; each count is at or above its T002 baseline. Evidence: hooks `{lib,bin,claude,devin}` 111 of 111, fail 0, exit 0 (baseline 99 plus 8); writer, matcher and session-stop vitest 52 of 52 (baseline 27 plus 19); Pi vitest 10 of 10; OpenCode plugin test pass 6, fail 0. A later rerun printed 109 of 111: both failures are chat-question tests (`chat-questions.test.mjs`, `sweep-transcript.test.mjs`) that read `chat-questions.mjs`, which another phase was editing at that minute and this phase never touched; `capture-core.test.mjs` alone stayed 25 of 25 and the vitest rerun 52 of 52.
- [x] T013 Rerun typecheck, lint and the CLI build (`$RT`). Verify: `npm run -s typecheck`, `npx eslint` on the changed files and `npm run -s build` each exit 0, so `cli/dist/continuity/match-decision-table.js`, which `save.md` runs, carries the change. Evidence: `npm run -s typecheck` exit 0; `npx eslint` on the five changed TS files exit 0; runtime and `cli` `npm run -s build` exit 0; the built matcher holds 4 `stateDirPath` hits.
- [x] T014 Rerun the two-project run in the session scratchpad. Verify: `node demo.mjs app-a app-b` prints `false` twice and the built matcher prints `no session queues with pending records` for `app-b`. Evidence: rerun 2026-11-03 with `app-a` and `app-b` linking `.skilled` to one shared folder: `{"appended":1,"skipped":0}`, then `queueDir(app-a) === queueDir(app-b) after realpath: false` and `readConsumedKeys(app-b) holds app-a key: false`; the row sat at `shared/.skilled/skills/.state/decision-capture/9058749d1bcf/73657373696f6e2d61.jsonl`; the built matcher printed `1 session-a` for `app-a` and `no session queues with pending records` for `app-b`. The scratch folder was deleted.
- [x] T015 Rerun the Measured Behavior greps. Verify: `rg -c "projectToken|stateDirPath"` prints a count for all three files, and `rg -n "STATE_DIR_SEGMENTS ="` prints only the writer. Evidence: `match-decision-table.ts:4`, `decision-record-writer.ts:5`, `capture-core.mjs:2`, exit 0; `STATE_DIR_SEGMENTS =` prints only `decision-record-writer.ts:125`.
- [x] T016 Validate the folder. Verify: `validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/008-project-scoped-state --strict` prints RESULT: PASSED. Evidence: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the scratch two-project run prints `false`, `false` and no pending sessions for `app-b`
- [ ] Every row of `acceptance-criteria.md` reads Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, including the rejected project-local folder in §3
- **Research**: See `../research/research.md` §4 and §13, and `../research/synthesis-review.md`
- **Review finding left open**: See `../review/review-report.md:124-132`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task carries `[B]` and the command output that blocks it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 8. Evidence: 8 rows.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c YOUR_VALUE_HERE plan.md` prints nothing. Evidence: no placeholder, exit 1.
- [x] CHK-003 [P1] Dependencies available: `command -v git codex pi` prints three paths. Evidence: printed `/usr/bin/git`, `codex` and `pi`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The sk-code quality gate over the changed code files reports `NO_BLOCKER_FOUND`. Evidence: `quality-gate.cjs --files` over the seven changed code files, `--lines changed`: `gate=NO_BLOCKER_FOUND exit=0`, findings 0.
- [x] CHK-011 [P0] Runtime typecheck and eslint exit 0. Evidence: `npm run -s typecheck` exit 0; `npx eslint` on the five changed TS files exit 0.
- [x] CHK-012 [P1] Every new catch falls back and never throws: the root lookup ends at `resolve(dir)`, and a test passes a missing directory. Evidence: `canonicalRoot` ends at `resolve(input)` inside nested catches. No committed test passes a missing folder; a scratch probe did, and `queueDir` and `stateDirPath` both returned `<missing>/.skilled/skills/.state/decision-capture/39214508fceb` without throwing.
- [x] CHK-013 [P1] No ephemeral labels in new comments: `git diff -U0 | rg '^\+.*//.*(REQ-|CHK-|T0[0-9]{2}|008)'` prints nothing. Evidence: no hit over the seven changed code files, exit 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` rows AC-001 to AC-012 read Met.
- [x] CHK-021 [P0] The scratch two-project run prints `false`, `false` and no pending sessions for `app-b`. Evidence: T014 printed `false`, `false` and `no session queues with pending records`.
- [x] CHK-022 [P1] Edge cases tested: a non-git folder, a missing folder, a trailing slash and a relative `.` each give a stable token. Evidence: committed tests cover a non-git folder in both runtimes; a scratch probe, run with `GIT_DIR` and `GIT_WORK_TREE` set to another repository, gave the same folder from `queueDir` and `stateDirPath` for a trailing slash, a subfolder and a relative `.`, and a missing folder fell back without throwing.
- [x] CHK-023 [P1] Error scenarios validated: a key held in both the root and the subfolder consumed log is released from both, and appears once in `readConsumedRows`. Evidence: the writer test reads `project:key` once from both logs; a scratch `--release k1` with the key in both logs printed the row twice, exit 0, and left both logs at 0 bytes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: shared state folder `class-of-bug`, non-canonical token root (P1-2) `cross-consumer`, partial dual-read (P1-1) `cross-consumer`, two token implementations (P2-6) `algorithmic`, project-local alternative (P2-5) `instance-only`, recorded as rejected. Evidence: classes listed in the item.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n 'QUEUE_RELATIVE_DIR =|STATE_DIR_SEGMENTS ='` prints only `capture-core.mjs` and the writer. Evidence: prints `capture-core.mjs:40` and `decision-record-writer.ts:125` only.
- [x] CHK-FIX-003 [P0] Consumer inventory completed in `plan.md` FIX ADDENDUM, including the six playbooks that read the flat root. Evidence: `plan.md` FIX ADDENDUM, line 96 lists the six playbooks.
- [x] CHK-FIX-004 [P0] Path adversarial table tests: subfolder, symlinked path, trailing slash, relative `.`, outside git, missing folder and exported `GIT_DIR`, in both runtimes. Evidence: committed tests cover subfolder, symlinked path and outside git in both runtimes and exported `GIT_DIR` in ESM; trailing slash, relative `.` and missing folder ran in the scratch probe against both runtimes.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed in `plan.md`: ten parity rows and one hostile row for the token; three readers by two files by three locations for the migration. Evidence: `plan.md` lines 104 and 105.
- [x] CHK-FIX-006 [P1] Hostile env variant: the token test runs with `GIT_DIR` and `GIT_WORK_TREE` pointing at another repository and gets the same folder. Evidence: the committed test sets `GIT_DIR` only; the scratch probe ran the whole process with both `GIT_DIR` and `GIT_WORK_TREE` on another repository and every shape matched.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the commit that lands this phase. Evidence: landed in `af931860f8` on 2026-11-03, after the hooks (122 of 122), runtime vitest (52 of 52), Pi (10 of 10) and OpenCode plugin (6 of 6) suites, typecheck and lint all passed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or home paths in changed files: `git diff | rg '^\+.*(/Users/|sk-[A-Za-z0-9]{20})'` prints nothing. Evidence: no hit over the seven changed code files, exit 1.
- [x] CHK-031 [P0] Input validation unchanged: the matcher still exits 2 on a `--project-root` that is not a directory. Evidence: `exits 2 in every mode when the project root is not a directory` passes inside the 52.
- [x] CHK-032 [P1] No test writes this repository's state: `git status --porcelain --ignored -- .skilled/skills/.state/decision-capture` lists the same files before and after the suites, and every test uses a temp folder. Evidence: no before listing was taken. After the suites the folder holds two token subfolders, each traced to a live session: `5c421355472b`, this repository's own token, with two `.nudge` files, and `59173e590520`, one `.nudge` from a live session in another linked project. Every new test builds its project with `mkdtemp`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same four code files and the same root rule. Evidence: all three name `capture-core.mjs`, `decision-record-writer.ts`, `api/index.ts` and `match-decision-table.ts`.
- [x] CHK-041 [P1] The state README, the hooks README, the feature catalog and the playbooks agree on `<project-token>/`. Evidence: the state README names `<project-token>/`, the hooks README queues per project, the catalog names the hashed subfolder and the playbooks resolve it through `queueDir`; the broken quoted glob in the save-writer playbook is tracked under T011.
- [x] CHK-042 [P2] The state README states the sanctioned-link exception in one paragraph. Evidence: README line 25, one paragraph.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the two-project run lives in the session scratchpad, never in this repository. Evidence: the two-project run and the probes ran in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: this packet's `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---
