---
title: "Tasks: Phase 7: fix the Barter findings from the extended deep review of the overlay layout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "barter review fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: fix the Barter findings from the extended deep review of the overlay layout

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

- `AS` is the ai-speckit checkout. `O` is `AS/overlays`. Every verify result is quoted from ai-speckit's 039 `implementation-summary.md` and commit `5dd004f3faa`, not re-run in this session.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-check the six findings against the hook sources (`O/root/opencode/scripts/git-hooks/pre-commit`). Verify: the 039 record states each finding held when checked against the code.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Fail closed with a staged vendored path and no manifest, print a visible skip otherwise (`O/root/opencode/scripts/git-hooks/pre-commit`). Verify: a throwaway index staging an unowned vendored file makes the live `pre-commit` exit 1.
- [x] T003 Add the lookup, skip and refusal tests and adopt them (`O/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs`). Verify: the file passes 6 of 6.
- [x] T004 Read `overlayDir` from the setting in the three hooks (`O/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs`, the commit gate, `barter-git-write-gate.mjs`). Verify: each hook's tests pass a `"../ovl"` case.
- [x] T005 Load the real vendored bridge in one plugin case (`O/root/opencode/plugins/tests/barter-overlay-guard.test.cjs`). Verify: the case fails with `definePlugin` renamed in the live bridge and passes once it is restored.
- [x] T006 [P] Ignore and name `overlays/relayout-runs/` (`AS/.gitignore`, `O/README.md`). Verify: the commit diff shows both lines.
- [x] T007 [P] Rename the fixture folder to `overlays` (`O/tests/compiled-routing-byte-parity.test.cjs`). Verify: the file passes 5 of 5.
- [x] T008 [P] Quote `../overlays/...` in the guard and status examples (`O/framework/repo-rules/barter-overlay-first.md`). Verify: the examples match `--guard` output from `skilled/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the engine gates at the new place (`AS/skilled`). Verify: `status --audit` prints `RESULT: PASSED`, `in-sync=488`, `checked=136 ok=136 miss=0`, `offLayout=[]`, and `pre-commit` prints `allow` with exit 0.
- [x] T010 Run Barter's checks and tests (`O/checks`, `AS/tests/run-all.sh`). Verify: both checks print `RESULT: PASSED`, 135 overlay tests run with only the 11 baseline failures, `run-all.sh` exits 0 with 8 `PASS`, and `pi list` shows 9 project packages.
- [x] T011 Record the fix in one commit (`AS`). Verify: `git -C AS show --stat 5dd004f3faa` lists 26 files, 705 insertions and 101 deletions.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: ai-speckit commit `5dd004f3faa` and its 039 record
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: `../review/review-report.md` §3
<!-- /ANCHOR:cross-refs -->

---
