# Iteration 022 — traceability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:44:49.745Z
- New findings: 3 (of 3 reported; prior total 78)
- Coverage: {"filesExamined":24,"keyPaths":[".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/spec.md",".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/spec.md",".opencode/commands/deep/assets/deep-research-confirm.yaml",".opencode/commands/deep/assets/deep-review-confirm.yaml",".opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/README.md",".opencode/skills/system-deep-loop/runtime/lib/README.md",".opencode/skills/system-deep-loop/mode-registry.json"]}

## Summary
Compared the 013 deep-research and deep-review handoff criteria with the shipped command workflows, runtime/lib families, compatibility helpers, and tests. The typed families are substantial and internally cross-linked, but live workflows still dispatch legacy agents and reducers, while typed mode gates have no non-test callers. Both legacy upcasters recognize only config, iteration, and three lifecycle events, although live workflows emit additional convergence, adjudication, pause, recovery, synthesis, and lock events. The result is library-level migration scaffolding rather than a traceable end-to-end 013 migration.

## Findings
- [P1] F-022-01 013 typed migration families are absent from the shipped research and review execution paths @ .opencode/commands/deep/assets/deep-research-confirm.yaml:1059
  - evidence: The live research workflow validates legacy iteration JSONL and then invokes deep-research/scripts/reduce-state.cjs at line 1059; the review workflow similarly dispatches the legacy deep-review agent and calls runtime/scripts/reduce-state.cjs at line 1195. A source scan found no non-test callers of the deep-research/deep-review typed families or their mode gates. Real runs therefore do not emit the typed event envelopes or produce the 013 migration-gate evidence.
  - recommendation: Add mode-owned adapters that wire both command workflows through the typed schema, reducers, sealed artifacts, certificates, resume adapter, shadow parity, and rollback gate. Add an end-to-end test executing one real run per lane and proving the typed ledger and gate evidence are produced.
- [P1] F-022-02 Research legacy compatibility blocks normal lifecycle events @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:90
  - evidence: recordTarget() recognizes only type=config, type=iteration, and the three mapped event stems resumed, restarted, and blocked_stop. decideDeepResearchCompatibility() returns blocked with unknown-legacy-record when no target exists. The live research workflow emits graph_convergence at line 530, manualStop at line 823, config_warning at line 515, and lock_released at line 1604; these records are neither mapped nor pinned, so ordinary lifecycle logs cannot be losslessly migrated.
  - recommendation: Define a complete mapping or explicit pinning policy for every event emitted by the live research workflow, then run the compatibility adapter against captured real state logs rather than only synthetic unit records.
- [P1] F-022-03 Review legacy compatibility omits the live review event vocabulary @ .opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts:89
  - evidence: The review recordTarget() supports only type=config, type=iteration, and resumed, restarted, or blocked_stop. The live review workflow emits graph_convergence at line 525, claim_adjudication at lines 1184 and 1190, userPaused at line 951, and synthesis_complete at line 1526. None are in the review mapping or pinned set, so a normal review log reaches the unknown-legacy-record blocked path instead of a typed review event.
  - recommendation: Add lossless compatibility mappings or explicit migration dispositions for every review event emitted by the command workflow, and verify them with an end-to-end replay fixture derived from real review state.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 22,
  "dimension": "traceability",
  "summary": "Compared the 013 deep-research and deep-review handoff criteria with the shipped command workflows, runtime/lib families, compatibility helpers, and tests. The typed families are substantial and internally cross-linked, but live workflows still dispatch legacy agents and reducers, while typed mode gates have no non-test callers. Both legacy upcasters recognize only config, iteration, and three lifecycle events, although live workflows emit additional convergence, adjudication, pause, recovery, synthesis, and lock events. The result is library-level migration scaffolding rather than a traceable end-to-end 013 migration.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "013 typed migration families are absent from the shipped research and review execution paths",
      "file": ".opencode/commands/deep/assets/deep-research-confirm.yaml",
      "line": 1059,
      "evidence": "The live research workflow validates legacy iteration JSONL and then invokes deep-research/scripts/reduce-state.cjs at line 1059; the review workflow similarly dispatches the legacy deep-review agent and calls runtime/scripts/reduce-state.cjs at line 1195. A source scan found no non-test callers of the deep-research/deep-review typed families or their mode gates. Real runs therefore do not emit the typed event envelopes or produce the 013 migration-gate evidence.",
      "recommendation": "Add mode-owned adapters that wire both command workflows through the typed schema, reducers, sealed artifacts, certificates, resume adapter, shadow parity, and rollback gate. Add an end-to-end test executing one real run per lane and proving the typed ledger and gate evidence are produced."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Research legacy compatibility blocks normal lifecycle events",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts",
      "line": 90,
      "evidence": "recordTarget() recognizes only type=config, type=iteration, and the three mapped event stems resumed, restarted, and blocked_stop. decideDeepResearchCompatibility() returns blocked with unknown-legacy-record when no target exists. The live research workflow emits graph_convergence at line 530, manualStop at line 823, config_warning at line 515, and lock_released at line 1604; these records are neither mapped nor pinned, so ordinary lifecycle logs cannot be losslessly migrated.",
      "recommendation": "Define a complete mapping or explicit pinning policy for every event emitted by the live research workflow, then run the compatibility adapter against captured real state logs rather than only synthetic unit records."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Review legacy compatibility omits the live review event vocabulary",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts",
      "line": 89,
      "evidence": "The review recordTarget() supports only type=config, type=iteration, and resumed, restarted, or blocked_stop. The live review workflow emits graph_convergence at line 525, claim_adjudication at lines 1184 and 1190, userPaused at line 951, and synthesis_complete at line 1526. None are in the review mapping or pinned set, so a normal review log reaches the unknown-legacy-record blocked path instead of a typed review event.",
      "recommendation": "Add lossless compatibility mappings or explicit migration dispositions for every review event emitted by the command workflow, and verify them with an end-to-end replay fixture derived from real review state."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 24,
    "keyPaths": [
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/spec.md",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/spec.md",
      ".opencode/commands/deep/assets/deep-research-confirm.yaml",
      ".opencode/commands/deep/assets/deep-review-confirm.yaml",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/README.md",
      ".opencode/skills/system-deep-loop/runtime/lib/README.md",
      ".opencode/skills/system-deep-loop/mode-registry.json"
    ]
  }
}
```