---
title: "Tasks: Phase 12: browser-hub-doc-topic"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "browser hub doc topic tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: browser-hub-doc-topic

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

`D` is `.skilled/commands/assets/local-doc-alignment`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Back up `topics.json` (`~/.local/state/local-alignment-backups/20261123-devin-lane/`). Verify: the backup holds `.skilled/commands/assets/local-doc-alignment/topics.json`. Evidence: present, in a backup of 10 files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the `mcp-browser-use` topic (`$D/topics.json`). Verify: `node -e` listing the topic keys prints `mcp-browser-use` last. Evidence: `session-handover, … playbook-run-recording, mcp-browser-use`.
- [x] T003 Record phase 12 in the parent's phase map, handoff table and goal binding table (`../spec.md`, `../goal.md`). Verify: `rg -n '012-browser-hub-doc-topic' ../spec.md ../goal.md` prints three rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run the scope step (`$D/doc-alignment.cjs`). Verify: `scope --topic mcp-browser-use` prints `STATUS=OK`. Evidence: `STATUS=OK doc-alignment: action=scope topic=mcp-browser-use docs=241 lanes=4 checks=4`.
- [x] T005 Run `/local-doc-alignment mcp-browser-use --lanes=devin` (`$D/`). Verify: the run folder holds `report.md` and `battery.json` holds four rows. Evidence: `report.md` present in `~/.local/state/local-doc-alignment/Skilled/20261123T181518Z/`. `battery.json` holds 4 rows, all pass.
- [x] T006 Validate this packet and the parent recursively, strict (`validate.sh`). Verify: every folder prints `RESULT: PASSED`. Evidence: 13 of 13 folders `RESULT: PASSED`, 0 errors, the 2 older warnings only.
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
