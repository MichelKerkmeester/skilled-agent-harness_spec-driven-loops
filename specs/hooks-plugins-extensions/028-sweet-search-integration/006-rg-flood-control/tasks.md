---
title: "Tasks: Phase 6: one row per file in the ripgrep wrapper"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "rg flood control tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: one row per file in the ripgrep wrapper

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

- [ ] T001 Re-read every cited line range in the phase 3 design (`../003-retrieval-feature-design-research/research/iterations/iteration-003.md`). Verify: each range still holds the named code.
- [ ] T002 Record the test baseline (`.skilled/skills/system-spec-kit/runtime/cli/tests/`). Verify: the retrieval suite's pass and fail counts are written to `scratch/baseline.txt`.
- [ ] T002a Write the query set and runner (`benchmark/queries.txt`, `benchmark/run.sh`). Verify: `wc -l benchmark/queries.txt` matches the count in `plan.md`.
- [ ] T002b Run the before benchmark (`benchmark/before.json`). Verify: one row per query, plus the index sha256 and git status count.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add `DEFAULT_LIMIT` and `shapeRankedMatches()`, and delete `structuredCappedRecipe` (`lib/rg-lane.mjs`). Verify: `rg -n structuredCappedRecipe .skilled` prints nothing.
- [ ] T004 Wire shaping, `--limit`, the new record fields and `SCHEMA_VERSION` 2 into the wrapper (`rg-wrapper.mjs`). Verify: the measured command returns 14 rows.
- [ ] T005 Add the `(+N more in this file)` suffix and `+N more files with M matches` tail to `formatSummary` (`rg-wrapper.mjs`). Verify: human output of the measured command shows the suffixes.
- [ ] T006 Read `record.matchCount` first in the retrofit baseline (`retrofit-convention.mjs:488`) and update `search-presentation.txt` and READMEs. Verify: `retrofit-convention-pipeline.vitest.ts` passes.
- [ ] T007 Add sections 2.1 and 5 contract text (`retrieval-conventions.md`), fix the fixture and add the 11 shaping cases (`rg-wrapper-recipes.vitest.ts`). Verify: the test file passes.
- [ ] T020 Write the catalog entry and its index row (`feature-catalog/retrieval/rg-flood-control.md`, `feature-catalog.md`). Verify: `validate_catalog_package.py` exits 0.
- [ ] T021 Write scenario 491 "Ripgrep one row per file" with a real user request ("Search this packet's research folders for "iteration" and show me which files talk about it. Don't just show me one file twenty times."), commands, expected signals (Each file appears once with `(+N more in this file)`; a tail line reads `+N more files with M matches` when files were hidden; JSON `schemaVersion` is 2) and pass/fail, and add its row to section 7.8 (`manual-testing-playbook/retrieval/rg-flood-control.md`, `manual-testing-playbook.md`). Verify: `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` exits 0.
- [ ] T022 Update every README that describes the changed tool (`.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md`, `.skilled/skills/system-spec-kit/runtime/cli/ops/README.md`, `.skilled/commands/speckit/README.txt`). Verify: `rg -n` for each new flag or field finds it in each README that lists flags or fields.
- [ ] T023 Write the changelog entry and bump the skill version (`changelog/v2.12.41.0.md`, `SKILL.md`), plus a line in the open root release notes. Verify: `check-release-coverage.cjs` reports no gap.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run `/local-skilled-alignment :auto --base=<commit before this phase>` on the uncommitted change. Verify: `scope.json` lists only this phase's files and `report.md` exists.
- [ ] T031 Fix every P0 and P1 finding, and fix or record each P2 (files named in `fix-plan.md`). Verify: each fix is in the diff or each skipped P2 has a reason in `implementation-summary.md`.
- [ ] T032 Recheck with `/local-skilled-alignment --recheck=<run folder>` and copy `report.md` and `recheck.md` to `alignment/`. Verify: `recheck.md` shows 0 open P0 and P1 findings.
- [ ] T033 Run the after benchmark and write the comparison (`benchmark/after.json`, `benchmark/results.md`). Verify: the index sha256 and git status count match `before.json`, and every metric row in `plan.md` has a measured value.
- [ ] T034 Put the three phases' benchmark tables side by side (`benchmark/summary.md`). Verify: it holds the 004, 005 and 006 tables with measured values.
- [ ] T008 Run the full retrieval suite before and after. Verify: no new failures versus the baseline.
- [ ] T009 Validate this phase folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Suite delta versus baseline reported in `implementation-summary.md`
- [ ] Benchmark table and alignment result copied into `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../003-retrieval-feature-design-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
