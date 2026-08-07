# Iteration 005 — correctness

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:09:37.166Z
- New findings: 2 (of 2 reported; prior total 14)
- Coverage: {"filesExamined":26,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-certificates/deep-research-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-sealed-artifacts/deep-research-artifact-material.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-sealed-artifacts/deep-review-artifact-material.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts"]}

## Summary
Examined the research and review durability paths spanning typed ledger validation, projection folding, sealed artifacts, certificate replay, resume decisions, shadow-parity bindings, and rollback readiness. The certificate and resume paths generally re-derive evidence and fail closed, but two boundary gaps remain. Research projection replay does not enforce contiguous input when starting without a checkpoint. Rollback-window eligibility also credits unauthenticated caller-supplied execution claims.

## Findings
- [P1] F-005-01 Initial research replay silently accepts stream-sequence gaps @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:2106
  - evidence: foldDeepResearchEvents validates and sorts events at line 2101, but its cursor-gap check at lines 2106-2119 executes only when a checkpoint exists. With no checkpoint, a valid run_initialized event at sequence 1 followed by an otherwise independent valid event at sequence 3 is folded and returned as projected. applyEvent's appendSeenEvent path at lines 1654-1680 only checks duplicate event IDs and does not enforce stream continuity or prev-event linkage.
  - recommendation: Apply contiguous-tail validation to fresh folds as well as checkpoint resumes. Track the expected sequence per permitted stream from zero, reject gaps, out-of-order input, and unauthorized stream splits by default, and preserve requireContiguousTail=false as the explicit escape hatch.
- [P1] F-005-02 Rollback-window success count trusts unauthenticated execution claims @ .opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts:605
  - evidence: evaluateDeepReviewRollbackWindow filters executions only by token shape, authority-state text, positive epoch, trusted-completion text, and digest shape at lines 605-612. Lines 613-655 then count connected execution/certificate identities, and line 657 uses that count to make the window eligible_to_close. No execution row is resolved to an authenticated run certificate, receipt, or ledger event, so two fabricated execution IDs with distinct syntactically valid certificate digests satisfy the execution threshold after the calendar minimum.
  - recommendation: Derive qualifying executions from verified certificate or authorized-ledger evidence supplied by the gate, binding execution ID, certificate digest, authority epoch, trusted lifecycle result, and occurrence within the rollback window. Treat unmatched or duplicate claims as unresolved evidence rather than threshold credit.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 5,
  "dimension": "correctness",
  "summary": "Examined the research and review durability paths spanning typed ledger validation, projection folding, sealed artifacts, certificate replay, resume decisions, shadow-parity bindings, and rollback readiness. The certificate and resume paths generally re-derive evidence and fail closed, but two boundary gaps remain. Research projection replay does not enforce contiguous input when starting without a checkpoint. Rollback-window eligibility also credits unauthenticated caller-supplied execution claims.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Initial research replay silently accepts stream-sequence gaps",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts",
      "line": 2106,
      "evidence": "foldDeepResearchEvents validates and sorts events at line 2101, but its cursor-gap check at lines 2106-2119 executes only when a checkpoint exists. With no checkpoint, a valid run_initialized event at sequence 1 followed by an otherwise independent valid event at sequence 3 is folded and returned as projected. applyEvent's appendSeenEvent path at lines 1654-1680 only checks duplicate event IDs and does not enforce stream continuity or prev-event linkage.",
      "recommendation": "Apply contiguous-tail validation to fresh folds as well as checkpoint resumes. Track the expected sequence per permitted stream from zero, reject gaps, out-of-order input, and unauthorized stream splits by default, and preserve requireContiguousTail=false as the explicit escape hatch."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Rollback-window success count trusts unauthenticated execution claims",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts",
      "line": 605,
      "evidence": "evaluateDeepReviewRollbackWindow filters executions only by token shape, authority-state text, positive epoch, trusted-completion text, and digest shape at lines 605-612. Lines 613-655 then count connected execution/certificate identities, and line 657 uses that count to make the window eligible_to_close. No execution row is resolved to an authenticated run certificate, receipt, or ledger event, so two fabricated execution IDs with distinct syntactically valid certificate digests satisfy the execution threshold after the calendar minimum.",
      "recommendation": "Derive qualifying executions from verified certificate or authorized-ledger evidence supplied by the gate, binding execution ID, certificate digest, authority epoch, trusted lifecycle result, and occurrence within the rollback window. Treat unmatched or duplicate claims as unresolved evidence rather than threshold credit."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 26,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-certificates/deep-research-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-sealed-artifacts/deep-research-artifact-material.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-sealed-artifacts/deep-review-artifact-material.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts"
    ]
  }
}
```