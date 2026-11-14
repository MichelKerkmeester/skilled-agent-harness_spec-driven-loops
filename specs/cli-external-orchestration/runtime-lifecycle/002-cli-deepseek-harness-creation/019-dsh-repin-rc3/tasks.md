---
title: "Tasks: Phase 19: dsh-repin-rc3"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh repin rc3 tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 19: dsh-repin-rc3

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

`PK` is this packet folder and `EV` is `$PK/evidence`. `DL` is `.skilled/skills/system-deep-loop/runtime`. Commands run from the worktree root. Task ids T004 to T008 match the runbook's probe names.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the installed version, the dist-tags and the rc.3 integrity (`$EV/version.txt`). Verify: `cat $EV/version.txt` prints `0.2.2-rc.3` and `cat $EV/integrity.txt` prints the `sha512-S+4o...` value. Evidence: both files hold those values, and `dist-tags.json` names `next` as `0.2.2-rc.3`.
- [x] T002 List every pin site (`.skilled`). Verify: `rg -n --hidden -g '!specs/**' -g '!.git/**' -g '!**/node_modules/**' -g '!**/changelog/**' '0\.2\.2-rc\.1' .` prints 22 lines in 15 files before the edits. Evidence: 22 lines, 15 files.
- [x] T003 Snapshot `~/.dsh` before any probe (`~/.dsh`). Verify: a `find ~/.dsh` listing with mtimes and sizes is saved outside the checkout. Evidence: 480 entries saved.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T009 Move the 18 pin and stub lines and one escaped test regex to `0.2.2-rc.3` (`$DL/scripts/fanout-run.cjs`). Verify: `rg -n "const DSH_VERSION = '0.2.2-rc.3'" $DL/scripts/fanout-run.cjs` prints one line. Evidence: one line, and the same for `DSH_PINNED_VERSION` in the dispatch hook.
- [x] T010 Record the rc.3 version, integrity and dist-tags in the version table (`.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/cli-reference.md`). Verify: `rg -c 'S\+4oUYVKWuc1' <file>` prints 1. Evidence: 1.
- [x] T011 Restate the four route status lines that named rc.1 (`.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md`). Verify: the T002 search prints only the 3 record lines: the dist-tag capture and the move sentence in `cli-reference.md` and the rc.1 verification date in `providers-and-models.md`. Evidence: those 3 lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 LLM Gateway route probe (`$EV/route-llmgateway.stdout.jsonl`). Verify: `cat $EV/route-llmgateway.exit.txt` prints 0 and the last line is a `final` event with `reason.kind` `completed`. Evidence: exit 0, `completed`, text `OK`, empty stderr, session cwd a temp folder.
- [x] T005 OpenCode Go route probe (`$EV/route-opencode-go.stdout.jsonl`). Verify: the key is set, so the probe runs, and its exit file prints 0 with a `completed` final event. Evidence: exit 0, `completed`, text `OK`.
- [x] T006 Four boundary probes (`$EV/confine-*.stdout.jsonl`). Verify: the cwd write and `echo ok` complete, the `$HOME` write returns a `tool_result` error and leaves no file, and the temp write is recorded. Evidence: inside and bash completed, home `status":"error"` with `file access denied under workspace-write mode` and no file, temp write completed and the file was removed after.
- [x] T007 Maximum reasoning stderr check (`$EV/route-llmgateway.stderr.txt`). Verify: `rg -c UNSUPPORTED_REASONING_EFFORT $EV/route-llmgateway.stderr.txt` prints nothing. Evidence: 0 bytes of stderr, exit 1 from `rg`.
- [x] T008 One fan-out research lineage (`$EV/fanout-lineage.stdout.txt`). Verify: exit 0, the summary reports one succeeded lineage and `completed_with_containment_advisory` 0. Evidence: exit 0, `"succeeded":1`, `completed_with_containment_advisory` 0, 262.7 s, the lineage log ends with a `completed` final event and `FANOUT_LINEAGE_COMPLETE:dsh-rc3`, `iteration-001.md` exists, no `did not activate` line and no `dsh-home-*` folder newer than the run start is left in the temp folder.
- [x] T012 Run the touched suites (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`). Verify: the dispatch hook test and the deep-loop fan-out, combo-matrix and stress cli-adapter tests pass, and the runtime typecheck exits 0. Evidence: `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` prints pass 47, fail 0. From `$DL`, `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts tests/unit/combo-matrix.vitest.ts tests/stress/cli-adapter` prints `Test Files  10 passed (10)` and `Tests  338 passed \| 8 skipped (346)`. `npm run typecheck` exits 0. The first vitest run failed one test, whose regex held an escaped `rc\.1` the literal search missed. That line was fixed and the run repeated.
- [x] T013 Compare `~/.dsh` with the T003 snapshot and scan the evidence for key values (`$EV`). Verify: the listings match and the key scan counts 0. Evidence: the `find ~/.dsh` listing with mtimes and sizes is identical to the T003 snapshot, 480 entries, and a scan of the 110 files in the packet for both key values counts 0 hits.
- [x] T014 Validate the packet (`$PK/spec.md`). Verify: `validate.sh $PK --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Both route probes and the fan-out lineage record exit 0 and `completed`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Runbook**: `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/repin-runbook.md`
- **Closure gate**: See `acceptance-criteria.md`
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

A probe that cannot run is marked `[B]` with its reason, and its route stays untested on rc.3.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The installed release is recorded (T001). Evidence: `version.txt` prints `0.2.2-rc.3`.
- [x] CHK-002 [P0] Every pin site is listed (T002). Evidence: 22 lines in 15 files.
- [x] CHK-003 [P1] Both route keys are present, checked without printing them. Evidence: both present.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The runtime typecheck exits 0 (T012). Evidence: T012.
- [x] CHK-011 [P0] `hard-rules.json` parses as JSON. Check: `node -e "JSON.parse(require('fs').readFileSync(process.argv[1]))" <file>` exits 0. Evidence: exit 0.
- [x] CHK-012 [P1] Only the version string changed on each code line. Check: `git diff --word-diff` on the code files shows only `rc.1` to `rc.3`. Evidence: the word diff.
- [x] CHK-013 [P1] No comment names a spec path, phase or task id. Evidence: no comment line changed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`. Evidence: AC-001 to AC-007.
- [x] CHK-021 [P0] The Gateway probe completes on rc.3 (T004). Evidence: T004.
- [x] CHK-022 [P1] The home write is denied on rc.3 (T006). Evidence: T006.
- [x] CHK-023 [P1] The fan-out lineage completes clean (T008). Evidence: T008.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class is `cross-consumer`: one version string lives in the runtime, the hook, the rules, the docs and the test stubs. Evidence: all 15 files changed.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the T002 search prints only the 3 record lines after the edits, and `rg -n 'rc\\\\?\.1' .skilled` finds no escaped pin left. Evidence: T011.
- [x] CHK-FIX-003 [P0] Consumer inventory: `DSH_VERSION` and `DSH_PINNED_VERSION` are read only by their own files and the tests that import them. Evidence: `rg -n 'DSH_VERSION|DSH_PINNED_VERSION' .skilled -g '!**/node_modules/**'`.
- [x] CHK-FIX-004 [P0] Adversarial case: the dispatch hook test still refuses `0.2.2`, `0.2.2-rc.2` and `latest`, and the fan-out test still refuses a stub reporting `0.2.2-alpha.3`. Evidence: T012.
- [x] CHK-FIX-005 [P1] Matrix axes are route by probe, listed in `plan.md`. Evidence: `plan.md` section 5.
- [x] CHK-FIX-006 [P1] Hostile state: every probe ran with a fresh `DSH_HOME`, never `~/.dsh`, and T013 shows `~/.dsh` unchanged. Evidence: T013.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase commit named in `implementation-summary.md`. Evidence: `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No key value is in any evidence file (T013). Evidence: T013.
- [x] CHK-031 [P0] No probe started in the checkout root. Evidence: each `session` event names a temp cwd.
- [x] CHK-032 [P1] The home write probe left no file in `$HOME`. Evidence: `ls` after the probe reports no such file.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same 15 files and probes. Evidence: all three.
- [x] CHK-041 [P1] The version table names the rc.3 evidence files. Evidence: `cli-reference.md` section 2.
- [x] CHK-042 [P2] The four route status lines name rc.3 and the probe date. Evidence: T011.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe output lives in `evidence/` and the fan-out artifacts in `research/fanout-live/`. Evidence: `ls $PK`.
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`. Evidence: `ls -a $PK/scratch`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
