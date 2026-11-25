---
title: "Tasks: Build-readiness review of the 003 build plan"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "plan review research tasks"
  - "build readiness review tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Build-readiness review of the 003 build plan

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

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

- [x] T001 Read the eleven 003 phase packets and their parent (`specs/system-skilled-bots/003-openbot-parity-build/`). Verify: `ls -d specs/system-skilled-bots/003-openbot-parity-build/0{01,02,03,04,05,06,07,08,09,10,11}-* | wc -l` prints 11.
- [x] T002 Probe each executor once (`devin`, `vibe`). Verify: `ls research/lineages/*/invocation-metadata.json | wc -l` prints 4, and each records its executor kind and model.
- [x] T003 Dry-run the fan-out (`research/`). Verify: `research/fanout-config.json` records two Devin and two Vibe executors at 13 iterations each, and the dry run wrote nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Run the expansive fan-out loop (`research/`). Verify: `research/orchestration-summary.json` records `"total_cli_lineages": 4`.
- [x] T005 Record the Devin quota stop and confirm the other three lineages cover the four angles (`research/`). Verify: `research/orchestration-summary.json` records `"quota": 2` and `find research/lineages -name 'iteration-*.md' | wc -l` prints 51.
- [x] T006 Synthesize the findings by phase, the cross-phase conflicts, the parity gaps, the overbuild, the security paths, the failure modes and the ranked fix list (`research/research.md`). Verify: `grep -c '^## ' research/research.md` prints 16 and each of the eleven phase folders is named.
- [x] T007 Run the first fix pass over the 003 docs and record the five fresh review rounds (`research/review-2-findings.md` to `research/review-6-findings.md`). Verify: `ls research/review-*-findings.md | wc -l` prints 5.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Count the iteration records and the merged registry (`research/`). Verify: `find research/lineages -name 'iteration-*.md' | wc -l` prints 51 and `research/findings-registry.json` records `"keyFindings": 301`.
- [x] T009 Check every P0 and P1 citation against its source (`research/research.md`). Verify: all 213 citations resolve to an existing file and an in-range line.
- [x] T010 Validate the packet (`spec.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research synthesis**: See `research/research.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---



