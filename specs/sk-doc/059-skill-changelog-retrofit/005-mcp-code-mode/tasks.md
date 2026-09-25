---
title: "Tasks: Phase 5: mcp-code-mode changelogs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-code-mode changelog rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: mcp-code-mode changelogs

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 001 records the operator's style approval: approved with fixes, 2026-09-24
- [x] T002 Confirm the mcp-code-mode files are clean in git before the run (`../scratch/lists/mcp-code-mode.txt`): each saved original matches its file at `HEAD` byte for byte
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the driver over the list (`../scratch/rewrite-driver.cjs --list ../scratch/lists/mcp-code-mode.txt --state ../scratch/state.jsonl`): eight of nine passed on their first dispatch and v1.0.0.0 at its second attempt
- [x] T004 Retry the failures once with `--retry-failed`, and record the reason for any that still fail: no run failed a file. Review overturned three passes and the strengthened re-check failed one, and each retry kept its file
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the checker with `--old` and `hvr_scan.py` over every kept file: `wave-verify.cjs` reports 9 kept, 0 failed, 0 problems
- [x] T006 Read a sample of the kept files old beside new: an Opus review read all nine beside their originals, and each has a clean review of its current text
- [x] T007 Commit the kept mcp-code-mode files only, then run `compiled-route-guard.cjs` and each mirror generator's `--check`: commit `24c9ce3828` holds the nine rewrites, and the guard and all nine `sync-*.cjs --check` runs exit 0
- [x] T008 Push to main and run `validate.sh --strict` on this phase: `git branch -r --contains 24c9ce3828` lists `origin/main`, and validation reports `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every listed file has a pass or a recorded failure in `../scratch/state.jsonl`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tooling**: See `../001-tooling-and-pilot/`
<!-- /ANCHOR:cross-refs -->
