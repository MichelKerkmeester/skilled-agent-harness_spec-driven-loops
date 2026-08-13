# Iteration 037 — maintainability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T09:09:04.432Z
- New findings: 4 (of 4 reported; prior total 152)
- Coverage: {"filesExamined":19,"keyPaths":[".opencode/commands/deep/assets/deep-review-auto.yaml",".opencode/commands/deep/assets/deep-review-confirm.yaml",".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs",".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",".opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs",".opencode/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts",".opencode/skills/system-deep-loop/runtime/scripts/append-state-record.cjs",".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs"]}

## Summary
I examined the review workflows, iteration verification, reducer parsing, fanout salvage, and leaf artifact persistence paths. The main risk is inconsistent fail-closed behavior: canonical state and delta corruption is sometimes skipped, warned, or replaced by older valid records. I found four concrete defects that can strand retries, drop findings, or allow synthesis to complete over corrupt state. Several advisory catches are intentional and do not affect authority decisions.

## Findings
- [P1] F-037-01 State-log append failure strands the write-once delta and defeats redispatch @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts:243
  - evidence: The writer performs sequential writes for iterationMdPath, deltaPath, and stateLogPath at lines 253-255, then converts any failure into ok:false at lines 256-257. Because the delta is write-once and an existing delta causes rejection at lines 250-251, a successful delta write followed by a failed state-log append leaves a retry unable to complete the iteration.
  - recommendation: Stage all outputs and commit them atomically, or remove only newly-created artifacts when the state-log append fails. Make retries idempotent for matching content before claiming all-or-nothing behavior.
- [P1] F-037-02 Synthesis silently ignores malformed canonical state records @ .opencode/commands/deep/assets/deep-review-auto.yaml:1879
  - evidence: The synthesis helper catches JSON.parse failures and returns an empty array for malformed lines at lines 1879-1891. The resulting stateRecords are used for invariant calculations at lines 1941-1962, and the no-failure branch appends synthesis_complete at lines 1987-2001. A corrupt or lost state row can therefore be omitted before the workflow marks the run complete.
  - recommendation: Use strict shared JSONL parsing for canonical state. Any malformed line must block synthesis completion and produce an explicit corruption or incomplete result.
- [P1] F-037-03 Mechanical iteration verification can accept a stale record after corruption @ .opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:57
  - evidence: The JSONL reader skips malformed lines at lines 57-76. Verification then selects the last parseable matching iteration with findLast at lines 145-159, so a malformed newest append can be ignored in favor of an older valid record. The auto workflow invokes this verifier as the post-dispatch gate at deep-review-auto.yaml lines 1454-1457.
  - recommendation: Track parse failures and fail verification when corruption occurs in the current append region. Never satisfy the current iteration using an older record after a newer malformed append.
- [P1] F-037-04 Malformed delta rows are dropped while the iteration still passes @ .opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:154
  - evidence: loadDeltaPayloads logs a warning and returns parsed records with null placeholders when delta parsing encounters malformed lines at lines 154-170. reduceReviewState later flattens the payloads and filters null values at lines 2093-2099. post-dispatch validation only requires the last parseable iteration record, so malformed finding rows can disappear while the iteration remains valid.
  - recommendation: Parse each review delta strictly and block reduction or completion on any malformed row, or preserve corruption as a blocking state that cannot be filtered away.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 37,
  "dimension": "maintainability",
  "summary": "I examined the review workflows, iteration verification, reducer parsing, fanout salvage, and leaf artifact persistence paths. The main risk is inconsistent fail-closed behavior: canonical state and delta corruption is sometimes skipped, warned, or replaced by older valid records. I found four concrete defects that can strand retries, drop findings, or allow synthesis to complete over corrupt state. Several advisory catches are intentional and do not affect authority decisions.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "State-log append failure strands the write-once delta and defeats redispatch",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",
      "line": 243,
      "evidence": "The writer performs sequential writes for iterationMdPath, deltaPath, and stateLogPath at lines 253-255, then converts any failure into ok:false at lines 256-257. Because the delta is write-once and an existing delta causes rejection at lines 250-251, a successful delta write followed by a failed state-log append leaves a retry unable to complete the iteration.",
      "recommendation": "Stage all outputs and commit them atomically, or remove only newly-created artifacts when the state-log append fails. Make retries idempotent for matching content before claiming all-or-nothing behavior."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Synthesis silently ignores malformed canonical state records",
      "file": ".opencode/commands/deep/assets/deep-review-auto.yaml",
      "line": 1879,
      "evidence": "The synthesis helper catches JSON.parse failures and returns an empty array for malformed lines at lines 1879-1891. The resulting stateRecords are used for invariant calculations at lines 1941-1962, and the no-failure branch appends synthesis_complete at lines 1987-2001. A corrupt or lost state row can therefore be omitted before the workflow marks the run complete.",
      "recommendation": "Use strict shared JSONL parsing for canonical state. Any malformed line must block synthesis completion and produce an explicit corruption or incomplete result."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Mechanical iteration verification can accept a stale record after corruption",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs",
      "line": 57,
      "evidence": "The JSONL reader skips malformed lines at lines 57-76. Verification then selects the last parseable matching iteration with findLast at lines 145-159, so a malformed newest append can be ignored in favor of an older valid record. The auto workflow invokes this verifier as the post-dispatch gate at deep-review-auto.yaml lines 1454-1457.",
      "recommendation": "Track parse failures and fail verification when corruption occurs in the current append region. Never satisfy the current iteration using an older record after a newer malformed append."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Malformed delta rows are dropped while the iteration still passes",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
      "line": 154,
      "evidence": "loadDeltaPayloads logs a warning and returns parsed records with null placeholders when delta parsing encounters malformed lines at lines 154-170. reduceReviewState later flattens the payloads and filters null values at lines 2093-2099. post-dispatch validation only requires the last parseable iteration record, so malformed finding rows can disappear while the iteration remains valid.",
      "recommendation": "Parse each review delta strictly and block reduction or completion on any malformed row, or preserve corruption as a blocking state that cannot be filtered away."
    }
  ],
  "refutations": [
    {
      "id": "F-010-01",
      "verdict": "deepened",
      "reason": "fanout-run.cjs lines 553-570 only require a top-level review-report.md or research.md, while the stronger lineage-state validation is gated to stopPolicy=max-iterations at lines 661-698. Default convergence runs therefore remain able to fulfill a lineage without complete child artifacts."
    }
  ],
  "coverage": {
    "filesExamined": 19,
    "keyPaths": [
      ".opencode/commands/deep/assets/deep-review-auto.yaml",
      ".opencode/commands/deep/assets/deep-review-confirm.yaml",
      ".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts",
      ".opencode/skills/system-deep-loop/runtime/scripts/append-state-record.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs"
    ]
  }
}
```