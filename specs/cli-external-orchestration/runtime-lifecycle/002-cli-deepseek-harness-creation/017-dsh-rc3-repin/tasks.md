---
title: "Tasks: Phase 17: dsh-rc3-repin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh rc3 repin tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: dsh-rc3-repin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

`H` is `.skilled/skills/cli-external-orchestration/cli-deepseek-harness`. `D` is `.skilled/skills/system-deep-loop/runtime`.

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the PATH dsh, its version, the dist-tags and the rc.3 integrity (`scratch/measured-before.txt`). Verify: the file shows `0.2.2-rc.3` and 15 files naming rc.1.
- [x] T002 Confirm the probe keys are set without printing them. Verify: `printenv` reports both keys set.
- [x] T003 Create worktree `worktrees/388-dsh-rc3-repin` and this phase folder. Verify: `ls` lists `spec.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Move the guard pin and its tests to rc.3, and add rc.1 to the refused list (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, its test and README). Verify: `node --test` prints `pass 47`, `fail 0`.
- [x] T005 Move the fan-out pin, the shim and the test stubs, including the escaped regex in the refusal test (`D/scripts/fanout-run.cjs`, `D/tests/`). Verify: the two vitest files print 185 passed.
- [x] T006 Move the hard rule, prompt template and playbook precondition (`H/hard-rules.json`, `H/assets/prompt-templates.md`, `H/manual-testing-playbook/manual-testing-playbook.md`). Verify: `git grep` on them prints no rc.1.
- [x] T007 After the probes pass, move the verified-on lines and the version pin table (`H/SKILL.md`, `H/README.md`, `H/references/providers-and-models.md`, `H/references/cli-reference.md`, `D/tests/stress/cli-adapter/live-contracts.json`). Verify: the pin table names rc.3 and the rc.3 integrity.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Run probes T004 to T007 on rc.3 (`scratch/probes/`). Verify: each run exits 0 with a final `completed` event, the home write is refused and no key value is in the evidence.
- [x] T009 Run probe T008, one deep-research lineage (`research/fanout-rc3/`, `scratch/probes/t008-lineage.*`). Verify: exit 0, `FANOUT_LINEAGE_COMPLETE:dsh-rc3`, 0 containment advisories.
- [x] T010 Check REQ-001. Verify: `git grep -n '0\.2\.2-rc\.1' -- ':!specs'` prints only the refusal case and the dated dist-tags row.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every runbook probe on rc.3 exits 0 with a final `completed` event
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



