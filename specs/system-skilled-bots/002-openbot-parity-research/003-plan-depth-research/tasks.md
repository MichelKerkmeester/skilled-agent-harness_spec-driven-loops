---
title: "Tasks: Planning-depth review of the 003 build plan"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "plan depth research tasks"
  - "planning depth review tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Planning-depth review of the 003 build plan

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the fourteen 003 phase packets and their parent (`specs/system-skilled-bots/003-openbot-parity-build/`). Verify: `ls -d specs/system-skilled-bots/003-openbot-parity-build/0{01,02,03,04,05,06,07,08,09,10,11,12,13,14}-* | wc -l` prints 14.
- [x] T002 Read the terminal screen's design contract as the depth benchmark (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md`). Verify: `ls` on that path prints it.
- [x] T003 Probe each executor once and dry-run the fan-out (`research/`). Verify: `research/fanout-config.json` records one Vibe and one opencode executor at 10 iterations each, and the dry run wrote nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the fan-out loop (`research/`). Verify: `research/orchestration-summary.json` records `"total_cli_lineages": 2`.
- [x] T005 Record the opencode quota stop and start the Codex top-up (`research/`). Verify: `research/steering-log.md` records `failure_class: quota` for opencode, and `research/fanout-config-codex-topup.json` records two `cli-codex` lineages at 5 iterations each.
- [x] T006 Synthesize the verdict per phase, the cross-cutting gaps and the fifteen work orders (`research/research.md`). Verify: `grep -c '^### WO-' research/research.md` prints 15 and `grep -c '^| 0[0-9][0-9]-' research/research.md` prints 13.
- [x] T007 Re-check every finding against its cited line and record the regrades (`research/research.md`). Verify: section 8 holds the per-lineage accuracy table and section 7 holds the four regrade tables.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Count the iteration records and the merged registry (`research/`). Verify: `find research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' | wc -l` prints 20 and `research/findings-registry.json` records 102 key findings.
- [x] T009 Check every citation in the synthesis against its source (`research/research.md`). Verify: every citation resolves to an existing file and an in-range line.
- [x] T010 Validate the packet (`spec.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research synthesis**: See `research/research.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---



