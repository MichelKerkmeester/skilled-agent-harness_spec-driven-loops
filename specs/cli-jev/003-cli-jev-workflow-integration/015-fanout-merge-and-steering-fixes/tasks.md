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

- [ ] T001 Confirm the build tree holds both `ac156a7112` and `9fe8526284` with `git merge-base --is-ancestor`, and reread `fanout-merge.cjs:1040-1233` and `fanout-run.cjs:1406-1525` for moved lines (`.skilled/skills/system-deep-loop/runtime/scripts/`)
- [ ] T002 Record the baseline pass count of `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts`, run from `.skilled/skills/system-deep-loop/runtime` (`implementation-summary.md`)
- [ ] T003 Replay the current merge over temp copies of each round's `research/lineages/`, outside the worktree, and confirm `sourceFindings` 85, 74 and 65 with `reconstructionGaps` 0 (`implementation-summary.md`)
- [ ] T004 Tabulate per lineage per round: registry finding count, count-only `findingsCount` sum and which of markdown, graph or delta evidence matches each iteration's count. Mark each unmatched iteration and total the unmatched findings per round (`implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the regression test titled with "short registry" first, from records copied out of `001-deep-research/research/lineages/deepseek/` (its 8-finding registry, iteration records and matching delta `finding` lines), and confirm it fails on the current code (`runtime/tests/unit/fanout-merge.vitest.ts`)
- [ ] T006 Write the edge test titled with "no iteration matches" from records copied out of `007-classifier-deep-research/research/lineages/grok/`, where no iteration's markdown or delta count matches, expecting the registry kept and the gap counted (`runtime/tests/unit/fanout-merge.vitest.ts`)
- [ ] T007 Load `deltas/iter-NNN.jsonl` `type: "finding"` records per iteration through `requireRealDirectory` and `resolveOptionalRealFile`, taking the iteration from the record or the file name and the text from `title`, `label`, `finding` or `text` (`runtime/scripts/fanout-merge.cjs`)
- [ ] T008 Make `researchCandidatesFromIteration` try markdown, graph, then delta by exact count, and return the unmatched count instead of throwing (`runtime/scripts/fanout-merge.cjs`)
- [ ] T009 Change the gate at `:1210` to reconstruct when the registry is empty or holds fewer findings than the count-only sum. Use the rebuild when it outnumbers the registry, else keep the registry, and set `reconstructionGaps` from the unmatched count instead of 0 (`runtime/scripts/fanout-merge.cjs`)
- [ ] T010 [P] Add the conditional line to `buildLoopPrompt`: before each iteration, read `<lineageDir>/steer.md` when it exists. Treat it as review input that never overrides the angle or the workflow contract. List it among the iteration's sources when read (`runtime/scripts/fanout-run.cjs`)
- [ ] T011 [P] Add the prompt test titled with "steer.md": a CLI lineage prompt carries the absolute `steer.md` path and the words "when it exists" (`runtime/tests/unit/fanout-run.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Rerun the three test files and then the full runtime suite with `npx vitest run --no-coverage`. Report the pass count against the T002 baseline (`implementation-summary.md`)
- [ ] T013 Rerun the T003 replay on the fixed code and record per round `sourceFindings` and `reconstructionGaps` against the T004 unmatched totals (`implementation-summary.md`)
- [ ] T014 Run `git status --short -- specs/cli-jev/003-cli-jev-workflow-integration/*/research` and confirm it prints nothing (`implementation-summary.md`)
- [ ] T015 Grep the changed code for comment hygiene: no spec path, no packet or phase number and no REQ or task id in a comment (`runtime/scripts/`, `runtime/tests/unit/`)
- [ ] T016 Update this phase's `implementation-summary.md`, `acceptance-criteria.md` and `goal.md` log with the observed evidence, then run `validate.sh --strict` on this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available: both roster commits in the tree, the lineage files tracked
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` passes on both changed scripts
- [ ] CHK-011 [P0] No new warning on stderr from the replay apart from the counted-gap output the fix adds
- [ ] CHK-012 [P1] A malformed delta line or a record without text fails only that iteration's match
- [ ] CHK-013 [P1] Code follows the file's existing patterns: exported pure helpers, path guards, atomic writes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The three-round replay recorded before and after the fix
- [ ] CHK-022 [P1] The no-match edge case tested
- [ ] CHK-023 [P1] The full runtime suite passes at the baseline count plus the new tests
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The merge gap is `class-of-bug` and the steering gap is `instance-only`
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. The delta reader calls the unchanged, already tested path guards, so no test is added beyond the floor
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Not applicable unless the change reads an environment variable
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Delta paths pass the same real-path and symlink checks as iteration files
- [ ] CHK-032 [P1] The steering line grants no write scope beyond the lineage directory
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments state the durable reason and carry no ephemeral ids
- [ ] CHK-042 [P2] README updated (if applicable). None expected: no owner doc describes the merge's reconstruction rules
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not verified yet. The phase is Planned
<!-- /ANCHOR:summary -->

---
