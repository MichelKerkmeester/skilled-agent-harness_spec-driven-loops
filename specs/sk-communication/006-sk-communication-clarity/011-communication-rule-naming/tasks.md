---
title: "Tasks: Phase 11: communication rule naming"
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
# Tasks: Phase 11: communication rule naming

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
## Phase 1: Rename and identity

- [x] T001 Rename both files with `git mv`, so history follows each file (`repo-rules/`)
  - DONE 2026-09-15: `handoff-and-questions.md` to `communication-handoff-and-questions.md` and `presenting-decisions.md` to `communication-presenting-decisions.md`. `git diff -M` records both as R100, a pure rename
- [x] T002 Rewrite each renamed file's identity on the pattern phase 003 set (both renamed files)
  - DONE 2026-09-15: title `Rule: Communication handoff and questions` and `Rule: Communication presenting decisions`, each H1 matched, versions to 1.4.0.0 and 1.2.0.0
- [x] T003 Repoint the link between the two renamed rules (`communication-handoff-and-questions.md`)
  - DONE 2026-09-15: its section 4 link to the decision rule now names the prefixed path
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Live references

- [x] T004 The one sentence naming all four reply rules (`AGENTS.md`)
  - DONE 2026-09-15: section 8 now names the four under one shape. `CLAUDE.md` is a symlink to this file, so it follows
- [x] T005 Two trigger rows, two index rows and the scope paragraph (`REPO RULES.md`)
  - DONE 2026-09-15: rows at 49, 50, 68 and 69 repointed, display names became `Communication presenting decisions` and `Communication handoff and questions`, and the fourth-widening paragraph names the prefixed rule
- [x] T006 [P] The inbound link from the reply-shape rule (`repo-rules/communication.md`)
  - DONE 2026-09-15: the sentence recording where the decision half moved now names the prefixed path
- [x] T007 [P] The misread table naming both rules (`sk-create-repo-rule/references/creation-standards.md`)
  - DONE 2026-09-15: both rows renamed, the misread text untouched
- [x] T008 Teach the benchmark that one rule can carry two names (`benchmark/reply-harness/`)
  - DONE 2026-09-15: the coverage case gives the two renamed rules alternative names, `score.mjs` treats a list entry as one item satisfied by any of its names, and the README records why
- [x] T009 The release-notes line naming both rules (v4 changelog)
  - DONE 2026-09-15: the communication-quality subsection names the prefixed paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Prove every rule link resolves (`check-repo-rules.cjs`)
  - DONE 2026-09-15: `RESULT: PASSED (9/9 checks)`, files 12, links 32 all resolve, index summaries match every description
- [x] T011 Prove no live reference names an old path (repo scan)
  - DONE 2026-09-15: `git ls-files` minus `specs/` scanned for both old slugs returns nothing
- [x] T012 Prove no rule sentence changed (`git diff -M`)
  - DONE 2026-09-15: each renamed file shows only its title, H1, version and the one cross-link
- [x] T013 Prove the frozen benchmark stays valid (six rescored sides)
  - DONE 2026-09-15: every weighted mean and every blocking row identical to the committed result, the only change being the alias shape recorded in the coverage row's detail
- [x] T014 Prove nothing else drifted (six fleet synchronizers)
  - DONE 2026-09-15: gate-1 pointers, runtime mirrors, hook registrations, leaf manifests, skill root metadata and compiled routes all report no drift
- [x] T015 Reconcile the parent, which lagged its children (parent `spec.md`)
  - DONE 2026-09-15: the parent read Status Draft while all ten children read Complete, its phase map carried a blank line that split the table and the phase 10 row sat outside it. All three repaired and the phase 11 row added
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the five proof-plan checks, each run from the final state)
<!-- /ANCHOR:completion -->

---

---

<!-- ANCHOR:verification -->
## Verification Checklist

- [x] CHK-001 [P0] Every rule link in the corpus resolves (T010, checker 7/9 reports links=32 all resolve)
- [x] CHK-002 [P0] No live reference names an old path (T011, tracked scan outside `specs/` returns nothing)
- [x] CHK-003 [P0] No rule sentence was added, removed or reworded (T012, the rename diff carries only identity lines and one cross-link)
- [x] CHK-004 [P1] Both renames are recorded as renames, not as a delete and an add (T001, `git diff -M` reports R100 for both)
- [x] CHK-005 [P1] Each renamed file's title and H1 match its filename (T002, both read `Rule: Communication ...`)
- [x] CHK-006 [P1] Each renamed file's version was bumped (T002, 1.4.0.0 and 1.2.0.0)
- [x] CHK-007 [P1] The router's count parity holds (T010, checker 1/9 reports files 12, trigger rows 12, index rows 12)
- [x] CHK-008 [P1] Every index summary still matches its rule's description (T010, checker 9/9)
- [x] CHK-009 [P1] The frozen benchmark sides rescore unchanged (T013, six sides, same means and same blocking rows)
- [x] CHK-010 [P1] The benchmark refuses a case set edited after its prompts were built (T008, the hash guard from phase 005 is untouched and still fires)
- [x] CHK-011 [P1] No fleet mirror drifted (T014, six synchronizers report no drift)
- [x] CHK-012 [P2] Spec archives were left alone (scope, the sweep excludes research logs, run artifacts and containment snapshots)
- [x] CHK-013 [P2] The parent packet no longer contradicts its children (T015, parent Status Complete, phase map repaired)
- [x] CHK-014 [P2] Security: no credential, token or path secret appears in the diff (not applicable: a rename and link edits, no code path and no configuration)
- [x] CHK-015 [P2] The packet validates from the final state (validate.sh --strict RESULT: PASSED)

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | 3/3 |
| P1 Items | 8 | 8/8 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-09-15, the five proof-plan checks run from the final state, then `validate.sh --strict`
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Convention this completes**: phase 003, where the sentence half became `communication-prose.md`
- **Benchmark touched**: phase 005, whose coverage case names every rule file
<!-- /ANCHOR:cross-refs -->

---



