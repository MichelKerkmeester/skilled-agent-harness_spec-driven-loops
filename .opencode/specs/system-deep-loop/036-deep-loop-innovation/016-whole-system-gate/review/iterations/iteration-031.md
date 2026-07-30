# Iteration 031 — maintainability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T08:38:47.281Z
- New findings: 2 (of 2 reported; prior total 118)
- Coverage: {"filesExamined":18,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-sealed-artifacts/deep-research-artifact-material.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-sealed-artifacts/deep-research-sealed-artifacts.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-rollback-gate.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-rollback-gate.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts"]}

## Summary
I compared the eight mode clones across their durability-family interfaces and traced rollback-gate validation into rollback-window counting, reducers, resume parsing, and sealed-artifact canonicalization. The concrete drift is concentrated in the older deep-research and deep-review gates, which validate selected fields without enforcing the closed evidence contract used by newer variants. Their rollback-window paths also filter malformed execution rows instead of rejecting the evidence set. The reducer, resume, and sealed-artifact paths inspected use consistent typed boundaries; I found two concrete maintainability defects.

## Findings
- [P2] F-031-01 Deep-research and deep-review mode gates silently accept unknown top-level evidence @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts:241
  - evidence: validateTopLevel() checks individual fields and versions but does not enforce a closed GATE_INPUT_KEYS set. The evaluate path then uses that result to build certificateCore without preserving unknown fields. Deep-ai-council, deep-alignment, agent-improvement, and benchmark gates reject unknown top-level keys and have corresponding tests.
  - recommendation: Use a shared strict validator requiring plain objects and exact top-level and nested keys in both legacy clones, then add the unknown-field and prototype parity tests used by the newer modes.
- [P2] F-031-02 Legacy rollback-window clones filter malformed rows instead of rejecting the evidence set @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts:595
  - evidence: evaluateDeepResearchRollbackWindow() parses the window metadata and then filters input.executions to rows matching a trusted-completion predicate; malformed or extra execution objects are silently discarded. Deep-alignment and deep-improvement-common validate exact window keys, lowTraffic, and every execution row before counting successes.
  - recommendation: Centralize rollback-window shape and row validation, make deep-research and deep-review use it, and add malformed-row and unknown-field parity cases before successful executions are counted.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 31,
  "dimension": "maintainability",
  "summary": "I compared the eight mode clones across their durability-family interfaces and traced rollback-gate validation into rollback-window counting, reducers, resume parsing, and sealed-artifact canonicalization. The concrete drift is concentrated in the older deep-research and deep-review gates, which validate selected fields without enforcing the closed evidence contract used by newer variants. Their rollback-window paths also filter malformed execution rows instead of rejecting the evidence set. The reducer, resume, and sealed-artifact paths inspected use consistent typed boundaries; I found two concrete maintainability defects.",
  "findings": [
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Deep-research and deep-review mode gates silently accept unknown top-level evidence",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",
      "line": 241,
      "evidence": "validateTopLevel() checks individual fields and versions but does not enforce a closed GATE_INPUT_KEYS set. The evaluate path then uses that result to build certificateCore without preserving unknown fields. Deep-ai-council, deep-alignment, agent-improvement, and benchmark gates reject unknown top-level keys and have corresponding tests.",
      "recommendation": "Use a shared strict validator requiring plain objects and exact top-level and nested keys in both legacy clones, then add the unknown-field and prototype parity tests used by the newer modes."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Legacy rollback-window clones filter malformed rows instead of rejecting the evidence set",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",
      "line": 595,
      "evidence": "evaluateDeepResearchRollbackWindow() parses the window metadata and then filters input.executions to rows matching a trusted-completion predicate; malformed or extra execution objects are silently discarded. Deep-alignment and deep-improvement-common validate exact window keys, lowTraffic, and every execution row before counting successes.",
      "recommendation": "Centralize rollback-window shape and row validation, make deep-research and deep-review use it, and add malformed-row and unknown-field parity cases before successful executions are counted."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 18,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-sealed-artifacts/deep-research-artifact-material.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-sealed-artifacts/deep-research-sealed-artifacts.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-rollback-gate.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-rollback-gate.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts"
    ]
  }
}
```