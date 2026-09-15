---
title: "Tasks: Phase 16: code standards alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: code standards alignment

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
## Phase 1: Audit

- [x] T001 Load the OpenCode surface standards and the restraint rule (`sk-code`, `repo-rules/`)
  - DONE 2026-09-15: the surface's TypeScript quality standards and style guide, plus the restraint rule's reversal-cost order and its six specific restraints
- [x] T002 Read every block this program added against the file it lives in (`semantics.ts`, `score.mjs`, `generate-prompts.mjs`, `executor-config.ts`)
  - DONE 2026-09-15: one gap found. Four of five exported functions in `semantics.ts` carry TSDoc and the one this program added did not
- [x] T003 Check each block against the restraint ladder (`repo-rules/prevent-overengineering.md`)
  - DONE 2026-09-15: five candidates. One acted on, four declined with a clause each, recorded in the decisions table
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Change what misses

- [x] T004 Document the one undocumented exported function (`src/fidelity/semantics.ts`)
  - DONE 2026-09-15: a TSDoc block naming both parameters, the return and the seam with the claim check, in the format the surface standard shows
- [x] T005 Attempt the one cut the restraint rule appeared to require (`benchmark/reply-harness/score.mjs`)
  - DONE 2026-09-15, and reverted. The retention predicate's second input path looked unreachable because only one case keys on it. Scoring failed on all six frozen sides, because every dimension mechanic runs against every case, so the other six reach that path. The branch was restored
- [x] T006 Record why the branch exists so the mistake is not repeated (`score.mjs`, harness README)
  - DONE 2026-09-15: a comment at the branch and a corrected sentence in the README, both naming that mechanics run across all cases
- [x] T007 Guard the silent failure the audit exposed (`score.mjs`)
  - DONE 2026-09-15: a case that keys on retention without naming its items would have scored a vacuous pass. The scorer now refuses the run
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the package gate (`cli-communication-projection`)
  - DONE 2026-09-15: `npm run check` passed, 83 files and 465 tests, exit 0
- [x] T009 Rescore every frozen benchmark side (`005/runs/`)
  - DONE 2026-09-15: six sides, every weighted mean and every blocking row identical to the committed result
- [x] T010 Prove the new guard fires, and read its exit status (`score.mjs`)
  - DONE 2026-09-15: run against a case set with the field removed, it printed the case id and the reason, exited 1 and wrote no result file
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the package gate, six rescores, the guard proof)
<!-- /ANCHOR:completion -->

---

---

<!-- ANCHOR:verification -->
## Verification Checklist

- [x] CHK-001 [P0] The package gate passes from the final state (T008, 83 files, 465 tests, exit 0)
- [x] CHK-002 [P0] Every frozen benchmark side scores identically (T009, six sides)
- [x] CHK-003 [P0] No branch was removed on an unconfirmed reachability claim (T005, the one attempt failed a run and was reverted)
- [x] CHK-004 [P1] Every exported function this program added carries TSDoc (T004)
- [x] CHK-005 [P1] The TSDoc matches the format the surface standard shows (T004, summary, params, return, seam)
- [x] CHK-006 [P1] The new guard fires, proved by running it (T010, exit 1, no result file written)
- [x] CHK-007 [P1] The guard covers external data rather than typed input (T007, it reads the case file)
- [x] CHK-008 [P1] Each declined cut names the clause that permits it to stay (T003)
- [x] CHK-009 [P2] The reason a restored branch exists is recorded where it is (T006, a comment and the README)
- [x] CHK-010 [P2] Security: no credential or path secret in the diff (not applicable: documentation, one guard and one comment)
- [x] CHK-011 [P2] The packet validates from the final state (validate.sh --strict RESULT: PASSED)

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | 3/3 |
| P1 Items | 5 | 5/5 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-09-15, the package gate, six rescores and a run of the guard against a case set missing the field
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Standards read**: `sk-code/sk-code-opencode` TypeScript references, `repo-rules/prevent-overengineering.md`
<!-- /ANCHOR:cross-refs -->

---



