---
title: "Tasks: Phase 10: open-ends-cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "open ends cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: open-ends-cleanup

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

- [x] T001 Verify each item against the code and record baselines. Items 1, 3 and 4 hold as stated. Item 2 holds in the other direction: sk-prompt is a class S standalone skill, so the fix lands in the checker, not in hub files. Baselines are in `plan.md` section 2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Item 1: require the OpenCode and Pi binding to sit in the default export, with unused-binding failing fixtures and passing real-adapter fixtures (`git-setup-check.cjs`, `tests/git-setup-check.test.cjs`). FIXED by Luna on the second dispatch (the first halted on the known `xcrun_db` sandbox failure and wrote nothing). New `adapterExportsBinding()` scans the source with a string, comment, template and regex aware scanner and reads the default export: OpenCode needs the key at the top of the returned object, Pi needs `<firstParam>.on('tool_call', handler)` in the body. Eight new failing cases, one new passing test. `git-setup-check.test.cjs` 58/58 to 59/59 outside the sandbox. The real adapters still read `registered` under `--tool=opencode` and `--tool=pi`.
- [x] T003 Item 2: make the parent-hub checker refuse a class S root with exit 2 and a reason, with a test (`parent-skill-check.cjs`, `tests/parent-skill-check-invariants.test.cjs`). REJECTED as a hub defect, FIXED at the cause. sk-prompt is class S (`ci-skill-root-metadata.cjs` reports `OK [S] sk-prompt`, and class S forbids the hub files), so no hub files were added. The checker now prints `ERROR: target is not a parent hub ...` and exits 2 when a root carries neither routing file. A root with one of the two still gets the full audit. Invariants suite 103/103 to 104/104, the seven hubs stay OK, `pre-commit.test.sh` 111/0, `typo-flags` plus `create-journey-proof` 11/11, advisor `parent-skill-check-fixtures` 7/7.
- [x] T004 Item 3: compare distinct findings on both sides of the close-out count check, with tests that fail on the old logic (`synthesis-closeout.cjs`, `synthesis-closeout-latest-record.vitest.ts`). FIXED by Luna on the second dispatch (the first hit the ChatGPT usage limit and wrote nothing). New `countDistinctFindings()` counts by the first `findingKeys()` identity. It applies to the state groups, the missing groups and the registry buckets, and each keyless registry entry still counts once. On the 006 Luna lineage the old code closed `synthesis_incomplete` (registry 36 against 57 identifiable, for 18 distinct findings) and the new code closes `synthesis_complete`. Deep-loop suites went from 142/142 to 144/144.
- [x] T005 Item 4: clear the Human Voice Rules hard blockers without changing meaning, code spans, paths or tables, then run the Hermes sync (`sk-create-command/SKILL.md`, `references/common-pitfalls.md`, `references/worked-example.md`, `references/argument-hints-and-modes.md`, `033-git-setup-customization/spec.md`). FIXED by Luna in three dispatches. The third cleared a semicolon inside a table cell after the orchestrator ruled that the table rule covers structure, not cell punctuation. All five docs report 0 hard blockers and `validate_document.py` VALID. The Hermes sync rewrote one mirror (`PASS: 68`), `package_skill.py` PASS. The SKILL.md edit made the sk-doc compiled-routing manifest stale, and a fourth dispatch re-minted it with the guard's own command.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Mutation check for each code fix. With the original source restored, each new test fails: item 1 reports `registered`, item 2 fails the standalone test, item 3 fails `2 failed | 2 passed`. Each fix was restored and rechecked.
- [x] T007 Run every gate from the final state and record the result lines in `implementation-summary.md`
- [x] T008 Update `implementation-summary.md` and save continuity
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
