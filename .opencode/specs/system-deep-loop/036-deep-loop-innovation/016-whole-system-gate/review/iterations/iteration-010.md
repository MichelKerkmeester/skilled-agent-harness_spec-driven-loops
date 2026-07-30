# Iteration 010 — correctness

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:44:50.910Z
- New findings: 4 (of 4 reported; prior total 32)
- Coverage: {"filesExamined":9,"keyPaths":[".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts",".opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md",".opencode/skills/system-deep-loop/runtime/feature-catalog/executor/executor-audit.md"]}

## Summary
I traced fan-out configuration, command construction, subprocess execution, artifact validation, and executor-audit recording across the three focus files. The primary risk is false lineage fulfillment: the runner can accept an incomplete loop based on a top-level report or child-authored synthesis claims without validating the canonical iteration evidence. The fan-out path also constructs detailed invocation provenance but discards it before dispatch, while the JSONL executor audit omits several behavior-defining settings. These gaps leave successful fan-out results substantially less trustworthy than the underlying deep-loop completion contract requires.

## Findings
- [P0] F-010-01 Fan-out fulfills lineages with only a top-level report @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:553
  - evidence: expectedLineageArtifactPaths() requires only review-report.md for review or research.md for research, and findMissingLineageArtifacts() checks only that file is non-empty. After process success, lines 2463-2510 reject missing artifacts using that minimal list; for the normal convergence policy, findMaxIterationsPolicyViolation() performs no state validation. The worker then returns a fulfilled output at line 2541 even if the canonical state JSONL, iteration markdown, deltas, findings registry, or legal synthesis evidence are absent.
  - recommendation: Define and validate the complete per-mode artifact contract before fulfillment: parse the state JSONL, require the expected unique iteration records and files, validate their correspondence, require a legal terminal synthesis event, and verify mode-specific registries/deltas. Treat any missing, malformed, duplicated, or inconsistent evidence as an artifact failure.
- [P0] F-010-02 Max-iteration completion trusts child-authored synthesis counters @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:674
  - evidence: findMaxIterationsPolicyViolation() computes iterationCount, but when findSynthesisRecord() returns a record it never checks the actual iteration files or unique iteration records. Lines 689-697 accept Number(synthesis.totalIterations) and synthesis.stopReason directly; a lineage can therefore emit one synthesis record claiming the configured count, create a non-empty review-report.md, and be fulfilled despite not executing those iterations. Artifact-derived checking at lines 641-658 runs only when no recognizable synthesis event exists.
  - recommendation: Treat synthesis fields as assertions, not evidence. Derive the completed count from unique, valid iteration identities present in both JSONL and iteration files, require an exact one-to-one sequence through the configured cap, and use synthesis.totalIterations and stopReason only as consistency checks against that derived evidence.
- [P1] F-010-03 Fan-out discards invocation provenance before spawning @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2272
  - evidence: finalizeLineageCommand() returns effectiveConfig and invocationFingerprint at lines 1496-1516. The worker destructures only command, args, and input from buildLineageCommand() at lines 2272-2286, dropping both provenance values. The subsequent status-ledger, process, result, and summary paths never bind the spawned command to that generated effective configuration or fingerprint, and fanout-run imports only environment/recursion helpers from executor-audit rather than its receipt path.
  - recommendation: Carry effectiveConfig and invocationFingerprint through the worker, write an intent receipt before spawn and a completion receipt after exit, and include their identifiers in lineage status and orchestration-summary records. Fail closed if the receipt cannot be durably written.
- [P1] F-010-04 Executor JSONL audits collapse materially different dispatches @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:824
  - evidence: buildExecutorAuditRecord() records only kind, model, reasoningEffort, serviceTier, and optional lineageId. It omits sandboxMode, timeoutSeconds, liveTools.webSearch, configDir, governor, executable identity, and invocation fingerprint. Consequently, dispatches with different permission posture, network policy, timeout, or prompt-governor settings can produce identical executor audit blocks.
  - recommendation: Record the resolved behavior-defining configuration rather than the partial source config, including sandbox and permission posture, web-search policy, timeout, executable identity/version, governor digest, and invocation fingerprint. Canonicalize the schema so audit comparison cannot conflate materially different invocations.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 10,
  "dimension": "correctness",
  "summary": "I traced fan-out configuration, command construction, subprocess execution, artifact validation, and executor-audit recording across the three focus files. The primary risk is false lineage fulfillment: the runner can accept an incomplete loop based on a top-level report or child-authored synthesis claims without validating the canonical iteration evidence. The fan-out path also constructs detailed invocation provenance but discards it before dispatch, while the JSONL executor audit omits several behavior-defining settings. These gaps leave successful fan-out results substantially less trustworthy than the underlying deep-loop completion contract requires.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Fan-out fulfills lineages with only a top-level report",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      "line": 553,
      "evidence": "expectedLineageArtifactPaths() requires only review-report.md for review or research.md for research, and findMissingLineageArtifacts() checks only that file is non-empty. After process success, lines 2463-2510 reject missing artifacts using that minimal list; for the normal convergence policy, findMaxIterationsPolicyViolation() performs no state validation. The worker then returns a fulfilled output at line 2541 even if the canonical state JSONL, iteration markdown, deltas, findings registry, or legal synthesis evidence are absent.",
      "recommendation": "Define and validate the complete per-mode artifact contract before fulfillment: parse the state JSONL, require the expected unique iteration records and files, validate their correspondence, require a legal terminal synthesis event, and verify mode-specific registries/deltas. Treat any missing, malformed, duplicated, or inconsistent evidence as an artifact failure."
    },
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Max-iteration completion trusts child-authored synthesis counters",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      "line": 674,
      "evidence": "findMaxIterationsPolicyViolation() computes iterationCount, but when findSynthesisRecord() returns a record it never checks the actual iteration files or unique iteration records. Lines 689-697 accept Number(synthesis.totalIterations) and synthesis.stopReason directly; a lineage can therefore emit one synthesis record claiming the configured count, create a non-empty review-report.md, and be fulfilled despite not executing those iterations. Artifact-derived checking at lines 641-658 runs only when no recognizable synthesis event exists.",
      "recommendation": "Treat synthesis fields as assertions, not evidence. Derive the completed count from unique, valid iteration identities present in both JSONL and iteration files, require an exact one-to-one sequence through the configured cap, and use synthesis.totalIterations and stopReason only as consistency checks against that derived evidence."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Fan-out discards invocation provenance before spawning",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      "line": 2272,
      "evidence": "finalizeLineageCommand() returns effectiveConfig and invocationFingerprint at lines 1496-1516. The worker destructures only command, args, and input from buildLineageCommand() at lines 2272-2286, dropping both provenance values. The subsequent status-ledger, process, result, and summary paths never bind the spawned command to that generated effective configuration or fingerprint, and fanout-run imports only environment/recursion helpers from executor-audit rather than its receipt path.",
      "recommendation": "Carry effectiveConfig and invocationFingerprint through the worker, write an intent receipt before spawn and a completion receipt after exit, and include their identifiers in lineage status and orchestration-summary records. Fail closed if the receipt cannot be durably written."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Executor JSONL audits collapse materially different dispatches",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts",
      "line": 824,
      "evidence": "buildExecutorAuditRecord() records only kind, model, reasoningEffort, serviceTier, and optional lineageId. It omits sandboxMode, timeoutSeconds, liveTools.webSearch, configDir, governor, executable identity, and invocation fingerprint. Consequently, dispatches with different permission posture, network policy, timeout, or prompt-governor settings can produce identical executor audit blocks.",
      "recommendation": "Record the resolved behavior-defining configuration rather than the partial source config, including sandbox and permission posture, web-search policy, timeout, executable identity/version, governor digest, and invocation fingerprint. Canonicalize the schema so audit comparison cannot conflate materially different invocations."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 9,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts",
      ".opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md",
      ".opencode/skills/system-deep-loop/runtime/feature-catalog/executor/executor-audit.md"
    ]
  }
}
```