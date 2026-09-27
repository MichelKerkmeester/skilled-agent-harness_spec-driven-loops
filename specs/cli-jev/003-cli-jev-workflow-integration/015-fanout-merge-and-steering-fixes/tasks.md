---
title: "Tasks: Fan-out Merge Under-count and Per-Iteration Steering"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fanout merge fix tasks"
  - "steer.md prompt tasks"
  - "merge diagnosis tasks"
  - "reconstruction gap tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fan-out Merge Under-count and Per-Iteration Steering

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm the build tree holds both `ac156a7112` and `9fe8526284` with `git merge-base --is-ancestor`, and reread `fanout-merge.cjs:1040-1233` and `fanout-run.cjs:1406-1525` for moved lines (`.skilled/skills/system-deep-loop/runtime/scripts/`). Evidence: `BASE` = `6f47c32dce`; both `git merge-base --is-ancestor` checks printed `both`, and `git diff --stat main 6f47c32dce -- fanout-run.cjs` was empty, so the 11-line difference from `main` is gone and this task is only a record. The `buildLoopPrompt` call site sits at `fanout-run.cjs:3267` at `BASE`, not `:3260`
- [x] T002 Record the baseline pass count of `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts`, run from `.skilled/skills/system-deep-loop/runtime` (`implementation-summary.md`). Evidence at `BASE`: `Test Files 3 passed (3)`, `Tests 214 passed (214)`. The full suite: `Test Files 155 passed (155)`, `Tests 2708 passed | 8 skipped (2716)`
- [x] T003 Replay the current merge over temp copies of each round's `research/lineages/`, outside the worktree, and confirm `sourceFindings` 85, 74 and 65 with `reconstructionGaps` 0 (`implementation-summary.md`). Evidence: the acceptance replay loop run with the `BASE` script as a temp sibling in `runtime/scripts/`, on temp copies under the session scratchpad, printed `001-deep-research 85 0`, `004-deep-research-expansion 74 0` and `007-classifier-deep-research 65 0`, each merge exit 0. The temp script was deleted and `git status` shows no leftover
- [x] T004 Tabulate per lineage per round: registry finding count, count-only `findingsCount` sum and which of markdown, graph or delta evidence matches each iteration's count. Mark each unmatched iteration and total the unmatched findings per round (`implementation-summary.md`). Evidence: the read-only tabulator printed the per-lineage table now in `implementation-summary.md`. Unmatched totals are 0, 13 and 38 findings
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the regression test titled with "short registry" first, from records copied out of `001-deep-research/research/lineages/deepseek/` (its 8-finding registry, iteration records and matching delta `finding` lines), and confirm it fails on the current code (`runtime/tests/unit/fanout-merge.vitest.ts`). Evidence: test "rebuilds a short registry from delta finding records" (brief 05, cursor Grok 4.7). With the `BASE` script swapped in, it failed (`Tests 2 failed | 57 skipped (59)`, exit 1), and the restore was byte-identical (`cmp` exit 0). It was written with the fix in one brief, not before it
- [x] T006 Write the edge test titled with "no iteration matches" from records copied out of `007-classifier-deep-research/research/lineages/grok/`, where no iteration's markdown or delta count matches, expecting the registry kept and the gap counted (`runtime/tests/unit/fanout-merge.vitest.ts`). Evidence: test "keeps a short registry and counts the gap when no iteration matches" (brief 04) copies grok iterations 1 to 3 and 3 registry findings, and asserts `sourceFindings` 3 and `reconstructionGaps` 12 (15 counted, 3 kept)
- [x] T007 Load `deltas/iter-NNN.jsonl` `type: "finding"` records per iteration through `requireRealDirectory` and `resolveOptionalRealFile`, taking the iteration from the record or the file name and the text from `title`, `label`, `finding` or `text` (`runtime/scripts/fanout-merge.cjs`). Evidence: `loadDeltaFindings` in `7de30fb16f` calls `requireRealDirectory` on `deltas/` and `resolveOptionalRealFile` per file, and refuses a symlinked file. Test "fails closed on a symlinked delta file" (brief 14) exits 3 naming "delta source must be a real file"
- [x] T008 Make `researchCandidatesFromIteration` try markdown, graph, then delta by exact count, and return the unmatched count instead of throwing (`runtime/scripts/fanout-merge.cjs`). Evidence: `7de30fb16f` returns `{ candidates, unmatched }` and tries markdown, graph, then delta. One throw stays by design, a structured-array count mismatch, because the existing `lineage_reconstruction_failed` test depends on it
- [x] T009 Change the gate at `:1210` to reconstruct when the registry is empty or holds fewer findings than the count-only sum. Use the rebuild when it outnumbers the registry, else keep the registry, and set `reconstructionGaps` from the unmatched count instead of 0 (`runtime/scripts/fanout-merge.cjs`). Evidence: the replay after the fix prints 134 0, 105 13 and 168 38. Brief 13 moved the kept-registry gap to `registryCount > 0`, so a rebuild that throws still records the gap (test "counts the gap on a kept registry when reconstruction throws", gap 1)
- [x] T010 [P] Add the conditional line to `buildLoopPrompt`: before each iteration, read `<lineageDir>/steer.md` when it exists. Treat it as review input that never overrides the angle or the workflow contract. List it among the iteration's sources when read (`runtime/scripts/fanout-run.cjs`). Evidence: three added prompt lines in `7de30fb16f`, emitted only when `lineage.kind !== 'native'`
- [x] T011 [P] Add the prompt test titled with "steer.md": a CLI lineage prompt carries the absolute `steer.md` path and the words "when it exists" (`runtime/tests/unit/fanout-run.vitest.ts`). Evidence: test "names the lineage steer.md by absolute path for a CLI lineage only". `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts -t "steer.md"` printed `Tests 1 passed | 153 skipped (154)`, exit 0 (rerun at `7de30fb16f`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun the three test files and then the full runtime suite with `npx vitest run --no-coverage`. Report the pass count against the T002 baseline (`implementation-summary.md`). Evidence: the three files printed `Test Files 3 passed (3)`, `Tests 219 passed (219)`, exit 0, which is 214 + 5. The final full suite printed `Test Files 155 passed (155)`, `Tests 2713 passed | 8 skipped (2721)`, exit 0, which is 2708 + 5 with the same 8 skipped. `fanout-merge.vitest.ts` alone at `7de30fb16f`: `Tests 61 passed (61)`, exit 0, against 57 at baseline. The first full run after briefs 04 to 06 failed one existing parity test, repaired by brief 15 (see `implementation-summary.md`)
- [x] T013 Rerun the T003 replay on the fixed code and record per round `sourceFindings` and `reconstructionGaps` against the T004 unmatched totals (`implementation-summary.md`). Evidence: the final replay printed `001-deep-research 134 0`, `004-deep-research-expansion 105 13` and `007-classifier-deep-research 168 38`, each merge exit 0 with 0 `lineage_reconstruction_failed` warnings. The gaps equal the T004 unmatched totals
- [x] T014 Run `git status --short -- specs/cli-jev/003-cli-jev-workflow-integration/*/research` and confirm it prints nothing (`implementation-summary.md`). Evidence: it printed nothing, and no temp directory remains
- [x] T015 Grep the changed code for comment hygiene: no spec path, no packet or phase number and no REQ or task id in a comment (`runtime/scripts/`, `runtime/tests/unit/`). Evidence: the step 10 block over the four files against `6f47c32dce` printed nothing (grep exit 1)
- [x] T016 Update this phase's `implementation-summary.md`, `acceptance-criteria.md` and `goal.md` log with the observed evidence, then run `validate.sh --strict` on this folder. Evidence: this closure. `validate.sh --strict` and `check-goal.cjs` results are in `implementation-summary.md` Verification
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. No manual or live run was planned; the replay and the tests stand in for it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` section 4, REQ-001 to REQ-007
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` sections 3 and 4
- [x] CHK-003 [P1] Dependencies identified and available: both roster commits in the tree, the lineage files tracked. Evidence: T001 printed `both`; the three rounds' lineages stayed tracked and unchanged (T014)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on both changed scripts. Evidence: `node --check` on `fanout-merge.cjs` and `fanout-run.cjs`, exit 0, no output
- [x] CHK-011 [P0] No new warning on stderr from the replay apart from the counted-gap output the fix adds. Evidence: the recorded replay output holds only the three result lines, each merge exit 0, and the final replay records 0 `lineage_reconstruction_failed` warnings
- [x] CHK-012 [P1] A malformed delta line or a record without text fails only that iteration's match. Evidence: a code read of `loadDeltaFindings` in `7de30fb16f`. A line that does not parse, or a finding record without text, adds a `null` to that iteration, and the delta match requires `every(Boolean)`, so only that iteration goes unmatched. No test pins this case
- [x] CHK-013 [P1] Code follows the file's existing patterns: exported pure helpers, path guards, atomic writes. Evidence: the delta reader uses the existing path guards and `inputError`; the export keeps its legacy shape and `module.exports` is unchanged (brief 15). The cross-family review found no P0 or P1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, 7 of 7 Met
- [x] CHK-021 [P0] The three-round replay recorded before and after the fix. Evidence: before 85 0, 74 0, 65 0 (T003); after 134 0, 105 13, 168 38 (T013)
- [x] CHK-022 [P1] The no-match edge case tested. Evidence: T006, plus the throw-gap test from brief 13
- [x] CHK-023 [P1] The full runtime suite passes at the baseline count plus the new tests. Evidence: `Tests 2713 passed | 8 skipped (2721)`, exit 0, against the baseline 2708 passed. Five new tests, not the three the index expected: the review added the throw-gap and symlinked-delta tests
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The merge gap is `class-of-bug` and the steering gap is `instance-only`. Classes: the merge gap `class-of-bug`, the steering gap `instance-only`, the parity regression `cross-consumer`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.. Evidence: `rg -n 'hasUsableResearchFindings|reconstructionGaps|sourceFindings'` over `runtime/scripts` matches `fanout-merge.cjs` (13 lines, the only writer) and `synthesis-closeout.cjs` (2 lines, a reader), rerun read-only at close
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.. Evidence: the consumer `rg` lists `synthesis-closeout.cjs`, `fanout-merge.vitest.ts` and `result-envelopes.vitest.ts`. The TypeScript shadow `.skilled/skills/system-deep-loop/runtime/lib/result-envelopes/legacy-shadow.ts` mirrors the exported reconstruction, and its parity test caught the drift that brief 15 repaired: `result-envelopes.vitest.ts` plus `fanout-merge.vitest.ts` printed `Tests 90 passed (90)`, exit 0
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. The delta reader calls the unchanged, already tested path guards, so no test is added beyond the floor. Deviation from that plan: after the review, brief 14 added a symlinked-delta test
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.. Evidence: `plan.md` affected surfaces lists registry state (4) against evidence per iteration (4). Tests cover short with delta match, short with no match, a kept registry whose rebuild throws and a symlinked delta
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Not applicable unless the change reads an environment variable. N/A: `git show 7de30fb16f` adds no `process.env` read (grep exit 1). The steer path uses `process.cwd()`, which the test resolves the same way
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.. Evidence: fix commit `7de30fb16f`, diff base `6f47c32dce`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: a grep of the added lines in `7de30fb16f` for `process.env`, password, secret, token and apikey printed nothing (exit 1)
- [x] CHK-031 [P0] Delta paths pass the same real-path and symlink checks as iteration files. Evidence: T007
- [x] CHK-032 [P1] The steering line grants no write scope beyond the lineage directory. Evidence: the line names `path.resolve(process.cwd(), lineageDir, 'steer.md')` and says it "grants no write outside the lineage"
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec, plan, tasks, acceptance criteria, goal and summary agree on Complete, and the stale premises are corrected in each
- [x] CHK-041 [P1] Code comments state the durable reason and carry no ephemeral ids. Evidence: T015. The added comments state why a short registry is rebuilt, why a CLI lineage's prompt names `steer.md`, why a kept registry records its gap on a throw and why the export keeps its legacy shape
- [x] CHK-042 [P2] README updated (if applicable). None expected: no owner doc describes the merge's reconstruction rules. N/A: no README changed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the replay and revert copies lived under the session scratchpad and were removed. `scratch/` holds only `.gitkeep` and `briefs/`
- [x] CHK-051 [P1] scratch/ cleaned before completion. Deviation: `scratch/briefs/` is kept on purpose as the record the executors built from, as in phases 012 to 014. Nothing else is in `scratch/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-27. CHK-051 keeps `scratch/briefs/` as a recorded deviation
<!-- /ANCHOR:summary -->

---
