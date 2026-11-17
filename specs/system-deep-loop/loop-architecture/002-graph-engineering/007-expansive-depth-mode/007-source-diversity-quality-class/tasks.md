---
title: "Tasks: Derive SOURCE quality_class at the graph upsert choke point"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "source diversity quality class tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Derive SOURCE quality_class at the graph upsert choke point

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

`RT` is `.skilled/skills/system-deep-loop/runtime`. `SUITES` is `tests/unit/coverage-graph-signals.vitest.ts tests/integration/convergence-script.vitest.ts tests/integration/upsert-script.vitest.ts tests/unit/deep-research-graph-upsert.vitest.ts`. Every `npx vitest run` runs from `RT`, as in `cd .skilled/skills/system-deep-loop/runtime && npx vitest run SUITES`; run from any other directory it finds no tests.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the green baseline of the four suites (`RT/tests/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and its pass count is written in `scratch/baseline.txt`. Done: 4 files, 69 passed, exit 0 (`scratch/baseline.txt`).
- [x] T002 List every fixture that sets `quality_class` (`RT/tests/`). Verify: `rg -n "quality_class" RT/tests` prints the nine fixture lines named in `spec.md` and no others. Done: 9 lines, the ones spec.md names (convergence-script 49, 50, 70, 71, 112, 653, 654; coverage-graph-signals 67, 68).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the REQ-001 strip-and-path case and the REQ-002 derivation case before any code change (`RT/tests/integration/upsert-script.vitest.ts`). Verify: `cd RT && npx vitest run tests/integration/upsert-script.vitest.ts` reports the two new cases failing. Done: the two SOURCE cases failed on quality_class; the FINDING/review pass-through case passed.
- [x] T004 Export the frozen vocabulary beside `SAFE_METADATA_KEYS` (`RT/lib/coverage-graph/coverage-graph-query.ts`). Verify: `rg -n "Object.freeze" RT/lib/coverage-graph/coverage-graph-query.ts` prints one line within 20 lines of line 123. Done: `SOURCE_QUALITY_CLASS` at :141, 18 lines below `SAFE_METADATA_KEYS` (:123); `npm run -s typecheck` exit 0.
- [x] T005 Strip the leaf value and set the class derived from `path`, then `name`, then `id` for research SOURCE nodes (`RT/scripts/upsert.cjs`). Verify: the REQ-001 and REQ-002 cases pass and the REQ-005 pass-through case passes. Done: `classifySourceLocation` and `deriveSourceQualityClass` in `upsert.cjs`, wired in the node loop; upsert-script 13 passed.
- [x] T006 Add the leaf-value-dropped case on the research upsert path (`RT/tests/unit/deep-research-graph-upsert.vitest.ts`). Verify: `cd RT && npx vitest run tests/unit/deep-research-graph-upsert.vitest.ts` exits 0 with the new case listed. Done: graph-upsert suite 3 passed, the new case stores `repo-code` over a leaf `primary`.
- [x] T007 Move the upsert-seeded fixtures to source paths that derive distinct classes, and add the REQ-004 code-only fixture (a `.cjs` file plus its `.vitest.ts` test) (`RT/tests/integration/convergence-script.vitest.ts`, `RT/tests/unit/coverage-graph-signals.vitest.ts`). Verify: `rg -n "quality_class: '(primary|secondary|tertiary)'" RT/tests` prints nothing, the REQ-004 cases report 2.0 and 1.0, and the code-only fixture reports 2.0 with no `source_diversity_guard` blocker. Done: fixtures moved to paths; REQ-004 cases report 2 and 1 (with `source_diversity_guard`), and the code-only `.cjs` plus `.vitest.ts` case reports 2 with no guard blocker. The rg still matches three strip-case inputs that send `primary` on purpose (REQ-001), so it holds for seeded fixtures only.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the four suites from the final state (`RT/tests/`). Verify: `cd RT && npx vitest run SUITES` exits 0 and the pass count is the baseline plus the new cases. Done: 4 files, 76 passed (69 + 7), exit 0. Fail-before: with only the two source files reverted, the 7 new cases and the derivation-dependent fixtures failed (14 of 50).
- [x] T009 Confirm the vocabulary has one copy (`RT/scripts/upsert.cjs`). Verify: `rg -n "'repo-code'" RT/scripts RT/lib` prints only the constant's line. Done: the rg prints only `coverage-graph-query.ts:142`.
- [x] T010 Write the signal change into the phase changelog note, including that a single-class question still blocks (`implementation-summary.md`). Verify: `rg -n "sourceDiversity" implementation-summary.md` prints the line that states the signal now carries values on normal runs. Done: `implementation-summary.md` Signal change section.
- [B] T011 Write one playbook scenario for the derived classes through `/create:manual-testing-playbook system-deep-loop update --path RT/manual-testing-playbook` (category `coverage-graph/`). Verify: `rg -l "quality_class" RT/manual-testing-playbook/coverage-graph` lists the new scenario. Blocked: the command hard-blocks at its Phase 0 self-check unless run as the `@markdown` agent, which this phase worker cannot start.
- [B] T012 Write the changelog entry for the default-path signal change through `/create:changelog` under `.skilled/skills/system-deep-loop/changelog/` (cross-phase handoff §3). Verify: the entry says source diversity now reads derived classes and that a single-class question still blocks. Blocked: same `@markdown` gate as T011.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The four suites exit 0, no stored research SOURCE class falls outside the vocabulary, and the playbook scenario exists
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source research**: `../research/research.md` §13 (D1), §15 (gaming risk), §18 (D1 honest fix), §20 Slice G
<!-- /ANCHOR:cross-refs -->

---
