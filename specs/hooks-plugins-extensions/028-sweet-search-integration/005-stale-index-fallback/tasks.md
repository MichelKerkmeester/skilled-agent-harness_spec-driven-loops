---
title: "Tasks: Phase 5: zero-hit fallback to git-changed spec docs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "stale index fallback tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: zero-hit fallback to git-changed spec docs

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

- [ ] T001 Re-read every cited line range in the phase 3 design (`../003-retrieval-feature-design-research/research/iterations/iteration-002.md`). Verify: each range still holds the named code.
- [ ] T002 Record the test baseline (`.skilled/skills/system-spec-kit/runtime/cli/tests/`). Verify: the retrieval suite's pass and fail counts are written to `scratch/baseline.txt`.
- [ ] T002a Write the query set and runner (`benchmark/queries.txt`, `benchmark/run.sh`). Verify: `wc -l benchmark/queries.txt` matches the count in `plan.md`.
- [ ] T002b Run the before benchmark (`benchmark/before.json`). Verify: one row per query, plus the index sha256 and git status count.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `lib/changed-docs.mjs` with `gitChangedDocs`, `readDeclaredPhrases` and `findStaleFallback` (`changed-docs.mjs`). Verify: a unit call on a temp git repo with one untracked spec lists it.
- [ ] T004 Extract the rank comparator and add `lookupWithFallback()`, which calls `lookup()` with `limit: 0`, merges, recomputes `totalCandidates` and `truncated`, then slices (`lookup-trigger-index.mjs`). Verify: `lookup()` tests still pass unchanged.
- [ ] T005 Add `--no-stale-fallback`, make `main()` async and print the `fallback :` line (`lookup-trigger-index.mjs`). Verify: `--help` usage lists the flag.
- [ ] T006 Add the section 4 note and replace the section 5 determinism paragraph (`retrieval-conventions.md`), and the README paragraph. Verify: `rg -n 'no-stale-fallback' retrieval-conventions.md` prints a line.
- [ ] T007 Write the 18-case matrix plus a merged-count case (`stale-fallback.vitest.ts`). Verify: the file passes.
- [ ] T020 Write the catalog entry and its index row (`feature-catalog/retrieval/stale-index-fallback.md`, `feature-catalog.md`). Verify: `validate_catalog_package.py` exits 0.
- [ ] T021 Write scenario 490 "Stale trigger index fallback" with a real user request ("I just created a new spec folder. Can you find the packet about "retrieval feature design research" for me?"), commands, expected signals (Before an index rebuild the lookup returns `003-retrieval-feature-design-research/spec.md` with exit 0 and a `fallback :` line; with `--no-stale-fallback` it exits 1) and pass/fail, and add its row to section 7.8 (`manual-testing-playbook/retrieval/stale-index-fallback.md`, `manual-testing-playbook.md`). Verify: `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` exits 0.
- [ ] T022 Update every README that describes the changed tool (`.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`, `README.md` (root, Gate 1 paragraph at line 521), `.skilled/commands/speckit/README.txt`). Verify: `rg -n` for each new flag or field finds it in each README that lists flags or fields.
- [ ] T023 Write the changelog entry and bump the skill version (`changelog/v2.12.40.0.md`, `SKILL.md`), plus a line in the open root release notes. Verify: `check-release-coverage.cjs` reports no gap.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run `/local-skilled-alignment :auto --base=<commit before this phase>` on the uncommitted change. Verify: `scope.json` lists only this phase's files and `report.md` exists.
- [ ] T031 Fix every P0 and P1 finding, and fix or record each P2 (files named in `fix-plan.md`). Verify: each fix is in the diff or each skipped P2 has a reason in `implementation-summary.md`.
- [ ] T032 Recheck with `/local-skilled-alignment --recheck=<run folder>` and copy `report.md` and `recheck.md` to `alignment/`. Verify: `recheck.md` shows 0 open P0 and P1 findings.
- [ ] T033 Run the after benchmark and write the comparison (`benchmark/after.json`, `benchmark/results.md`). Verify: the index sha256 and git status count match `before.json`, and every metric row in `plan.md` has a measured value.
- [ ] T008 Run the full retrieval suite before and after. Verify: no new failures versus the baseline.
- [ ] T009 Run the measured command from this spec. Verify: exit 0 and the phase 3 spec path in the results.
- [ ] T010 Validate this phase folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
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
