---
title: "Tasks: Phase 2: devin-lane"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "devin lane tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: devin-lane

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

`A` is `.skilled/commands/assets/local-skilled-alignment`. `D` is `.skilled/commands/assets/local-doc-alignment`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Back up the ignored files this phase changes (`~/.local/state/local-alignment-backups/20261123-devin-lane/`). Verify: `find` on that folder counts 10 files. Evidence: 10.
- [x] T002 Record the test baseline (`$A/tests/`). Verify: `node --test $A/tests/` prints `pass 92` and `fail 0`. Evidence: 92 pass, 0 fail, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `cli-devin` kind: the model allowlist check in `loadLaneConfig` and the shared builder call in `laneArgs` (`$A/run-lanes.cjs`). Verify: `node --check $A/run-lanes.cjs` exits 0. Evidence: exit 0.
- [x] T004 Add tests for the Devin argv and for a model outside the allowlist (`$A/tests/run-lanes.test.cjs`). Verify: `node --test $A/tests/run-lanes.test.cjs` reports 0 failures. Evidence: 28 pass, 0 fail, including both Devin tests.
- [x] T005 Add the `devin` preset (`$A/executors.json`). Verify: `node -e` reading `presets.devin.kind` prints `cli-devin`. Evidence: `cli-devin deepseek-v4-1-flash-max`.
- [x] T006 Name `cli-devin` among the kinds the runner takes, in all four workflows (`$A/local-skilled-alignment-{auto,confirm}.yaml`, `$D/local-doc-alignment-{auto,confirm}.yaml`). Verify: `rg -c cli-devin` prints at least 1 for each file. Evidence: 2, 2, 1 and 1, and all four parse as YAML.
- [x] T007 Name the `devin` preset in both command docs (`.skilled/commands/local-skilled-alignment.md`, `.skilled/commands/local-doc-alignment.md`). Verify: `rg -n '`devin`'` prints one line in each. Evidence: one line in each.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the whole runner suite (`$A/tests/`). Verify: `pass` is at least 94 and `fail 0`. Evidence: 95 pass, 0 fail, against the 92 baseline. The quality gate on the changed code reported 0 findings and 0 P0 blockers.
- [x] T009 Run `/local-doc-alignment mcp-browser-use --lanes=devin` (`$D/`). Verify: its run folder holds `report.md` and every `lanes/*.status.json` reads `ok`. Evidence: `report.md` present in `~/.local/state/local-doc-alignment/Skilled/20261123T181518Z/`. L1 to L4 status `ok`, L2 after one rerun.
- [x] T010 Run `/local-skilled-alignment` on the 011 commit with `--lanes=devin` (`$A/`). Verify: its run folder holds `report.md` and every `lanes/*.status.json` reads `ok`. Evidence: `report.md` present in `~/.local/state/local-skilled-alignment/Skilled/20261123T181658Z/`. A to D status `ok`.
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
<!-- /ANCHOR:cross-refs -->

---
