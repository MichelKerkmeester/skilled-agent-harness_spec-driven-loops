# Iteration 024 — traceability

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:55:26.228Z
- New findings: 2 (of 2 reported; prior total 87)
- Coverage: {"filesExamined":24,"keyPaths":[".opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/goal-file-manifest.txt",".opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/spec.md",".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/spec.md",".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/spec.md",".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/spec.md",".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/spec.md",".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema/spec.md",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/legacy-compatibility.ts",".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts",".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/legacy-compatibility.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/skill-benchmark-ledger-schema.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/skill-benchmark-ledger-types.ts"]}

## Summary
Examined the phase-013 improvement-family contracts for deep-improvement-common, agent-improvement, model-benchmark, and skill-benchmark against the shipped runtime/lib ledger-schema, legacy-compatibility, shadow-parity, reducer, resume, certificate, and rollback-gate surfaces. The runtime has substantial additive typed infrastructure for all four families, and model-benchmark/skill-benchmark show tighter version binding in their mode gates than common/agent. Two traceability gaps remain: skill-benchmark legacy compatibility does not delegate shared deep-improvement-common legacy records even though its registry embeds the common event vocabulary, and the common/agent mode gates accept self-reported version bindings rather than comparing them to installed schema/reducer constants. These are concrete mixed-version and gate-evidence risks, not style issues.

## Findings
- [P1] F-024-01 Skill Benchmark cannot migrate shared common legacy lifecycle records @ .opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts:28
  - evidence: The Skill Benchmark compatibility table only maps `benchmark_run_planned` to `skill_benchmark.run_planned` at lines 28-30. For every other non-current record, `recordTarget` returns null and `decideSkillBenchmarkCompatibility` returns `blocked` at lines 147-150. This means legacy shared common lifecycle records such as common session, candidate, and evaluation records handled by `deep-improvement-common-ledger-schema/legacy-compatibility.ts` never reach the common upcaster, even though `skill-benchmark-ledger-types.ts` imports `DeepImprovementCommonEventStems` and `skill-benchmark-ledger-schema.ts` incorporates `deepImprovementCommonEventDefinitions()` into the Skill Benchmark registry.
  - recommendation: Mirror the agent/model variant pattern: delegate unrecognized Skill Benchmark-specific records through `decideDeepImprovementCommonCompatibility` and `upcastLegacyDeepImprovementCommonRecord`, enforce the Skill Benchmark variant scope, and add migration tests for common run, candidate, and evaluation records.
- [P1] F-024-02 Common and Agent Improvement mode gates trust caller-supplied version bindings @ .opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts:320
  - evidence: Deep Improvement Common validates `eventSchemaVersion`, `reducerVersion`, and `projectionVersion` only with `isToken(...)` at lines 320-322, then copies those values into the readiness certificate at lines 1000-1005. Agent Improvement repeats this pattern in `agent-improvement-rollback-gate/mode-gate.ts` lines 222-226. Model Benchmark and Skill Benchmark instead compare these fields with installed envelope, event-schema, reducer, and projection constants. The 013 and 016 contracts require gate evidence to identify the exact installed versions, so common/agent can produce internally consistent readiness certificates carrying stale or incorrect version labels.
  - recommendation: Import the installed envelope, event-schema, reducer, and projection-version constants into the common and agent mode gates and require exact equality, matching the model-benchmark and skill-benchmark gates. Add negative tests using stale but syntactically valid version tokens.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 24,
  "dimension": "traceability",
  "summary": "Examined the phase-013 improvement-family contracts for deep-improvement-common, agent-improvement, model-benchmark, and skill-benchmark against the shipped runtime/lib ledger-schema, legacy-compatibility, shadow-parity, reducer, resume, certificate, and rollback-gate surfaces. The runtime has substantial additive typed infrastructure for all four families, and model-benchmark/skill-benchmark show tighter version binding in their mode gates than common/agent. Two traceability gaps remain: skill-benchmark legacy compatibility does not delegate shared deep-improvement-common legacy records even though its registry embeds the common event vocabulary, and the common/agent mode gates accept self-reported version bindings rather than comparing them to installed schema/reducer constants. These are concrete mixed-version and gate-evidence risks, not style issues.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Skill Benchmark cannot migrate shared common legacy lifecycle records",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts",
      "line": 28,
      "evidence": "The Skill Benchmark compatibility table only maps `benchmark_run_planned` to `skill_benchmark.run_planned` at lines 28-30. For every other non-current record, `recordTarget` returns null and `decideSkillBenchmarkCompatibility` returns `blocked` at lines 147-150. This means legacy shared common lifecycle records such as common session, candidate, and evaluation records handled by `deep-improvement-common-ledger-schema/legacy-compatibility.ts` never reach the common upcaster, even though `skill-benchmark-ledger-types.ts` imports `DeepImprovementCommonEventStems` and `skill-benchmark-ledger-schema.ts` incorporates `deepImprovementCommonEventDefinitions()` into the Skill Benchmark registry.",
      "recommendation": "Mirror the agent/model variant pattern: delegate unrecognized Skill Benchmark-specific records through `decideDeepImprovementCommonCompatibility` and `upcastLegacyDeepImprovementCommonRecord`, enforce the Skill Benchmark variant scope, and add migration tests for common run, candidate, and evaluation records."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Common and Agent Improvement mode gates trust caller-supplied version bindings",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts",
      "line": 320,
      "evidence": "Deep Improvement Common validates `eventSchemaVersion`, `reducerVersion`, and `projectionVersion` only with `isToken(...)` at lines 320-322, then copies those values into the readiness certificate at lines 1000-1005. Agent Improvement repeats this pattern in `agent-improvement-rollback-gate/mode-gate.ts` lines 222-226. Model Benchmark and Skill Benchmark instead compare these fields with installed envelope, event-schema, reducer, and projection constants. The 013 and 016 contracts require gate evidence to identify the exact installed versions, so common/agent can produce internally consistent readiness certificates carrying stale or incorrect version labels.",
      "recommendation": "Import the installed envelope, event-schema, reducer, and projection-version constants into the common and agent mode gates and require exact equality, matching the model-benchmark and skill-benchmark gates. Add negative tests using stale but syntactically valid version tokens."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 24,
    "keyPaths": [
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/goal-file-manifest.txt",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/spec.md",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/spec.md",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/spec.md",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/006-model-benchmark/spec.md",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/spec.md",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema/spec.md",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/legacy-compatibility.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/legacy-compatibility.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/skill-benchmark-ledger-schema.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/skill-benchmark-ledger-types.ts"
    ]
  }
}
```