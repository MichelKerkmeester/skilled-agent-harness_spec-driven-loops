---
title: "Tasks: Phase 12: advisor-suite-parallel-trial"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisor suite parallel trial tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: advisor-suite-parallel-trial

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

Every path is written from the repository root. `A` is `.skilled/skills/system-skill-advisor/runtime`. `P` is `specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial`. Commands spell both in full.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the serial setting and the measured CI reference (`.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`). Verify: `rg -n 'fileParallelism' .skilled/skills/system-skill-advisor/runtime/vitest.config.ts` prints `40:    fileParallelism: false,`.
- [ ] T002 Create the trial log with the runs table (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md`). The table header is `| Run | Config | Result | real (s) | vitest Duration (s) | Test Files | Tests |`, and the file also carries `## Gate` with the four summary lines T011 writes. Verify: `rg -c '^\| Run \| Config \| Result \|' specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` prints `1`.
- [ ] T003 Build the advisor runtime (`.skilled/skills/system-skill-advisor/runtime/package.json`). Verify: `bash -c 'npm --prefix .skilled/skills/system-skill-advisor/runtime run build >/dev/null && ls .skilled/skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js'` prints the path.
- [ ] T004 Refresh the skill-graph database the default suite reads (`.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`). Verify: `bash -c 'node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format text >/dev/null && test -s .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite'` exits 0.
- [ ] T005 Run the unmodified suite once and record the baseline (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md`). Run `(cd .skilled/skills/system-skill-advisor/runtime && bash -c 'set -o pipefail; /usr/bin/time -p npm test 2>&1 | tail -8')`, then write the row `| Baseline | serial | pass | <real> | <Duration> | <Test Files> | <Tests> |`. If the run fails, write `fail` and stop: a trial cannot attribute a failure the unmodified suite already has. Verify: `rg -c '^\| Baseline \| serial \| pass \|' specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` prints `1`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Replace the single serial config with the `parallel` and `serial` projects (`.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`). Use the shape in `plan.md` section 3: one `SERIAL_FILES` list, `fileParallelism: true` with `sequence.groupOrder: 0` for the parallel project, and `fileParallelism: false` with `sequence.groupOrder: 1` for the serial project. Keep the `SPECKIT_RUN_STRESS` branch's single-config behavior. Verify: `rg -n 'fileParallelism' .skilled/skills/system-skill-advisor/runtime/vitest.config.ts` prints exactly two lines, one holding `fileParallelism: true` and one holding `fileParallelism: false`.
- [ ] T007 Confirm the two projects collect 149 and 12 files (`.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`). Verify: `bash -c 'cd .skilled/skills/system-skill-advisor/runtime && printf "serial %s\n" "$(./node_modules/.bin/vitest list --project serial --filesOnly | wc -l | tr -d " ")" && printf "parallel %s\n" "$(./node_modules/.bin/vitest list --project parallel --filesOnly | wc -l | tr -d " ")"'` prints `serial 12` and `parallel 149`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run trial 1 and record it (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md`). Run the same timed command as T005 and write `| Trial 1 | projects | pass | <real> | <Duration> | <Test Files> | <Tests> |`, or `fail` when the run fails. Verify: `rg -c '^\| Trial 1 \| projects \| pass \|' specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` prints `1`.
- [ ] T009 Run trial 2 and record it (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md`). Run the same timed command back to back with trial 1 and write the `Trial 2` row. Verify: `rg -c '^\| Trial 2 \| projects \| pass \|' specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` prints `1`.
- [ ] T010 Run trial 3 and record it (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md`). Run the same timed command back to back with trials 1 and 2 and write the `Trial 3` row. Verify: `rg -c '^\| Trial 3 \| projects \| pass \|' specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` prints `1`.
- [ ] T011 Compute the median, the saving and the decision (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md`). Take the median of the three `real` values with `printf '%s\n' <t1> <t2> <t3> | sort -n | sed -n 2p`, compute `Saved = (Baseline - Median) / Baseline * 100` to one decimal, and write `Baseline:`, `Median:`, `Saved:` and `Decision:` as four separate lines. Derive the saving a second way before writing it. Verify: `awk -F': ' '/^\| Trial [123] \| projects \| pass \|/ { p++ } /^Baseline:/ { b=$2+0 } /^Median:/ { m=$2+0 } /^Saved:/ { s=$2+0 } /^Decision:/ { d=$2 } END { r=(b-m)/b*100; good=((p==3 && r>=10 && s>=10 && d=="Keep") || (!(p==3 && r>=10 && s>=10) && d=="Revert")); same=(s-r<0.05 && s-r>-0.05); print (good && same ? "GATE CONSISTENT" : "GATE INCONSISTENT") }' specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` prints `GATE CONSISTENT`.
- [ ] T012 Apply the keep-or-revert decision to the config (`.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`). Keep both projects when the decision is Keep. When it is Revert, restore the single `fileParallelism: false` test option and delete the `projects` array. Verify: `bash -c 'k=$(rg -c "fileParallelism: true" .skilled/skills/system-skill-advisor/runtime/vitest.config.ts || true); d=$(rg -c "^Decision: Keep" specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md || true); [ "${k:-0}" = "${d:-0}" ] && echo MATCH'` prints `MATCH`.
- [ ] T013 Confirm the configured suite still collects every file (`.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`). Verify: `bash -c 'cd .skilled/skills/system-skill-advisor/runtime && ./node_modules/.bin/vitest list --filesOnly | wc -l | tr -d " "'` prints `161`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` holds the four summary lines, and the gate check prints `GATE CONSISTENT`
- [ ] The decision and config check prints `MATCH`
- [ ] No file under `.skilled/skills/system-skill-advisor/runtime/tests` changed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Pattern**: See `.skilled/skills/system-deep-loop/runtime/vitest.config.ts`
- **Research**: See `../007-test-and-ci-bloat-research/research/research.md` section 4, rank 5
<!-- /ANCHOR:cross-refs -->

---
