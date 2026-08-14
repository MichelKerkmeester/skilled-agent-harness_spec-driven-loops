# Iteration 025 — traceability

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T08:03:45.441Z
- New findings: 4 (of 4 reported; prior total 89)
- Coverage: {"filesExamined":163,"keyPaths":[".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/005-resume-adapter/checklist.md",".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-resume-adapter.vitest.ts",".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter/checklist.md",".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts",".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity/checklist.md",".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts",".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts/checklist.md",".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-certificates.vitest.ts",".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections/checklist.md",".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-reducers.vitest.ts"]}

## Summary
I scanned all 56 phase-013 checklists and 55 implementation summaries, then statically enumerated 51 referenced Vitest suites, expanding literal parameterized cases and imported suites. Representative current counts were confirmed structurally, including 260 Model Benchmark rollback cases, 223 Skill Benchmark rollback cases, and 90 Deep Review reducer cases. The material risk is stale, suite-wide evidence: several completed checklists cite obsolete counts and use one undifferentiated passing run to support scenarios that have no corresponding named test. Tests were not executed because this leaf is strictly read-only, so pass status itself remains unverified.

## Findings
- [P1] F-025-01 Deep Review resume checklist certifies scenarios absent from its cited suite @ .opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/005-resume-adapter/checklist.md:60
  - evidence: Lines 59-71 mark replay-frontier, malformed-event, concurrent-resume, changed-fingerprint, finding-lineage, and concurrency requirements complete using the same "focused Vitest 6/6" citation. The current deep-review-resume-adapter.vitest.ts defines 12 cases: eight ordinary tests plus four forged-confirmation parameter cases. Its cases cover compatibility, forged confirmations/checkpoints, certificate-frontier mismatch, split streams, and sequential idempotency, but contain no concurrent resume fixture, same-versus-independent-lineage concurrency fixture, or introduced/fixed/preexisting finding-lineage assertions.
  - recommendation: Reopen checklist items without a matching fixture. Bind each completed item to exact test names and fixture cases, plus the candidate SHA or suite-content digest and discovered test count.
- [P1] F-025-02 Council resume checklist overstates coverage behind obsolete 6/6 evidence @ .opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter/checklist.md:58
  - evidence: Every completed requirement cites the same 6/6 run. The current deep-ai-council-resume-adapter.vitest.ts defines ten tests at lines 1545-1827, covering dispositions, registry trust, fingerprint/version drift, forged effect confirmation, certificate rejection, checkpoint/frontier corruption, cursor splitting, and sequential idempotency. It has no named fixture for worker completion-order invariance, partial deliberation or critique recovery, dispatch-without-result/result-without-fold crashes, or blinded-scorer information leakage, despite lines 59-69 and 85 marking those claims complete.
  - recommendation: Replace the blanket run citation with a requirement-to-test matrix. Add the missing partial-state, crash-boundary, ordering, and information-surface fixtures before retaining those completion marks.
- [P1] F-025-03 Council shadow-parity checklist contradicts its own implementation evidence @ .opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity/checklist.md:44
  - evidence: All completed items state that implementation-summary.md records a focused 26/26 run. The referenced implementation summary instead records 39 tests passed at line 75, and the current deep-ai-council-shadow-parity.vitest.ts statically defines 39 cases after expanding its parameterized matrices. The checklist supplies no source digest that could identify an earlier 26-case suite snapshot.
  - recommendation: Reconcile the recorded run count and bind the evidence to an immutable candidate SHA and suite digest. Map each checklist claim to the relevant subset of the 39 cases.
- [P1] F-025-04 Deep Research certificate evidence uses stale counts and displaced line anchors @ .opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts/checklist.md:67
  - evidence: Lines 67, 72, 83, and 92 cite a 31/31 suite, while the current deep-research-certificates.vitest.ts defines 36 tests. The line-specific evidence is also displaced: line 68 points to test line 859, which is now helper data, while the idempotency/conflict test begins at line 1812; line 101 points to line 938, now fixture timestamp data, while the wrong-kind test begins at line 1908. Following the checklist therefore does not reach the claimed verifier evidence.
  - recommendation: Use stable test names or generated test identifiers instead of raw line numbers. Refresh the count, record the suite-content digest, and verify every completed requirement still maps to a current positive or negative case.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 25,
  "dimension": "traceability",
  "summary": "I scanned all 56 phase-013 checklists and 55 implementation summaries, then statically enumerated 51 referenced Vitest suites, expanding literal parameterized cases and imported suites. Representative current counts were confirmed structurally, including 260 Model Benchmark rollback cases, 223 Skill Benchmark rollback cases, and 90 Deep Review reducer cases. The material risk is stale, suite-wide evidence: several completed checklists cite obsolete counts and use one undifferentiated passing run to support scenarios that have no corresponding named test. Tests were not executed because this leaf is strictly read-only, so pass status itself remains unverified.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Deep Review resume checklist certifies scenarios absent from its cited suite",
      "file": ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/005-resume-adapter/checklist.md",
      "line": 60,
      "evidence": "Lines 59-71 mark replay-frontier, malformed-event, concurrent-resume, changed-fingerprint, finding-lineage, and concurrency requirements complete using the same \"focused Vitest 6/6\" citation. The current deep-review-resume-adapter.vitest.ts defines 12 cases: eight ordinary tests plus four forged-confirmation parameter cases. Its cases cover compatibility, forged confirmations/checkpoints, certificate-frontier mismatch, split streams, and sequential idempotency, but contain no concurrent resume fixture, same-versus-independent-lineage concurrency fixture, or introduced/fixed/preexisting finding-lineage assertions.",
      "recommendation": "Reopen checklist items without a matching fixture. Bind each completed item to exact test names and fixture cases, plus the candidate SHA or suite-content digest and discovered test count."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Council resume checklist overstates coverage behind obsolete 6/6 evidence",
      "file": ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter/checklist.md",
      "line": 58,
      "evidence": "Every completed requirement cites the same 6/6 run. The current deep-ai-council-resume-adapter.vitest.ts defines ten tests at lines 1545-1827, covering dispositions, registry trust, fingerprint/version drift, forged effect confirmation, certificate rejection, checkpoint/frontier corruption, cursor splitting, and sequential idempotency. It has no named fixture for worker completion-order invariance, partial deliberation or critique recovery, dispatch-without-result/result-without-fold crashes, or blinded-scorer information leakage, despite lines 59-69 and 85 marking those claims complete.",
      "recommendation": "Replace the blanket run citation with a requirement-to-test matrix. Add the missing partial-state, crash-boundary, ordering, and information-surface fixtures before retaining those completion marks."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Council shadow-parity checklist contradicts its own implementation evidence",
      "file": ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity/checklist.md",
      "line": 44,
      "evidence": "All completed items state that implementation-summary.md records a focused 26/26 run. The referenced implementation summary instead records 39 tests passed at line 75, and the current deep-ai-council-shadow-parity.vitest.ts statically defines 39 cases after expanding its parameterized matrices. The checklist supplies no source digest that could identify an earlier 26-case suite snapshot.",
      "recommendation": "Reconcile the recorded run count and bind the evidence to an immutable candidate SHA and suite digest. Map each checklist claim to the relevant subset of the 39 cases."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Deep Research certificate evidence uses stale counts and displaced line anchors",
      "file": ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts/checklist.md",
      "line": 67,
      "evidence": "Lines 67, 72, 83, and 92 cite a 31/31 suite, while the current deep-research-certificates.vitest.ts defines 36 tests. The line-specific evidence is also displaced: line 68 points to test line 859, which is now helper data, while the idempotency/conflict test begins at line 1812; line 101 points to line 938, now fixture timestamp data, while the wrong-kind test begins at line 1908. Following the checklist therefore does not reach the claimed verifier evidence.",
      "recommendation": "Use stable test names or generated test identifiers instead of raw line numbers. Refresh the count, record the suite-content digest, and verify every completed requirement still maps to a current positive or negative case."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 163,
    "keyPaths": [
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/005-resume-adapter/checklist.md",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-resume-adapter.vitest.ts",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter/checklist.md",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity/checklist.md",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts/checklist.md",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-certificates.vitest.ts",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/002-reducers-and-projections/checklist.md",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-reducers.vitest.ts"
    ]
  }
}
```