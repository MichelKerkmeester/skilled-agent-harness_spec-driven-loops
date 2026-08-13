# Iteration 030 — traceability

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T08:32:13.242Z
- New findings: 3 (of 3 reported; prior total 115)
- Coverage: {"filesExamined":27,"keyPaths":[".opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md",".opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/intra-routing-recall/",".opencode/skills/system-deep-loop/deep-review/SKILL.md",".opencode/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md",".opencode/skills/system-deep-loop/runtime/manual-testing-playbook/",".opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/permissions-gate.md",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/permissions-gate.vitest.ts",".opencode/skills/system-deep-loop/runtime/package.json",".opencode/commands/deep/assets/deep-review-auto.yaml",".claude/agents/deep-review.md",".opencode/agents/deep-review.md",".codex/agents/deep-review.toml"]}

## Summary
I sample-traced deep-review and runtime catalogs through their manual scenarios, implementation modules, tests, workflow YAML, and runtime-agent mirrors. The permissions-gate catalog accurately discloses that its tested implementation has no production callers, so I found no new capability inflation there. The manual certification surface is weaker: four routing scenarios are excluded from release coverage, fourteen prescribed test commands resolve to nonexistent directories, and contradictory verdict enums permit READY with incomplete evidence. The previously reported detect_changes portability blocker is no longer supported by the current agent contract because all mirrors explicitly continue when the tool is unavailable.

## Findings
- [P1] F-030-01 Release coverage omits intra-routing recall scenarios @ .opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:31
  - evidence: The root inventory declares 51 scenarios across nine categories and its canonical-artifact list omits intra-routing-recall/. Four additional scenario files exist there as DV-R01 through DV-R04, each with category, expected intent, expected resources, and an exact prompt. The release rule at lines 105-111 measures only scenarios defined by the root index, so it can report 100% coverage without executing these four shipped routing scenarios.
  - recommendation: Add intra-routing-recall to the canonical inventory and coverage map, include DV-R01..DV-R04 in the total and readiness denominator, and validate that every scenario-shaped file under the playbook is indexed exactly once.
- [P1] F-030-02 Fourteen manual scenarios prescribe test commands with dead runtime paths @ .opencode/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/coverage-graph-fuzzy-merge.md:45
  - evidence: The scenario requires `cd .opencode/skills/runtime/`, but that directory does not exist; the live package is `.opencode/skills/system-deep-loop/runtime/package.json`. Seven fan-out scenarios instead change into system-spec-kit/mcp-server and invoke `../../runtime/...`, which resolves to the same missing `.opencode/skills/runtime` location. Across the runtime playbook, fourteen scenario files contain one of these dead path forms, so their mandatory EXIT-0 validation cannot execute as documented.
  - recommendation: Run tests from `.opencode/skills/system-deep-loop/runtime` using its package test script, repair every stale relative target, and add a documentation check that resolves each prescribed cwd and test path before accepting the playbook.
- [P1] F-030-03 Release rules accept a verdict forbidden by the execution policy @ .opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:9
  - evidence: The execution policy says the only acceptable classifications are PASS, FAIL, or SKIP. Lines 89-98 separately define PARTIAL for both scenarios and features, while lines 105-109 allow READY whenever no feature is FAIL and critical scenarios pass. A non-critical scenario with incomplete evidence can therefore become PARTIAL and still permit READY despite PARTIAL being prohibited by the governing policy.
  - recommendation: Define one verdict enum for scenario, feature, and release aggregation. If PARTIAL remains valid, state it in the execution policy and make release readiness explicitly reject unresolved PARTIAL evidence; otherwise remove PARTIAL from all subordinate rules.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 30,
  "dimension": "traceability",
  "summary": "I sample-traced deep-review and runtime catalogs through their manual scenarios, implementation modules, tests, workflow YAML, and runtime-agent mirrors. The permissions-gate catalog accurately discloses that its tested implementation has no production callers, so I found no new capability inflation there. The manual certification surface is weaker: four routing scenarios are excluded from release coverage, fourteen prescribed test commands resolve to nonexistent directories, and contradictory verdict enums permit READY with incomplete evidence. The previously reported detect_changes portability blocker is no longer supported by the current agent contract because all mirrors explicitly continue when the tool is unavailable.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Release coverage omits intra-routing recall scenarios",
      "file": ".opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md",
      "line": 31,
      "evidence": "The root inventory declares 51 scenarios across nine categories and its canonical-artifact list omits intra-routing-recall/. Four additional scenario files exist there as DV-R01 through DV-R04, each with category, expected intent, expected resources, and an exact prompt. The release rule at lines 105-111 measures only scenarios defined by the root index, so it can report 100% coverage without executing these four shipped routing scenarios.",
      "recommendation": "Add intra-routing-recall to the canonical inventory and coverage map, include DV-R01..DV-R04 in the total and readiness denominator, and validate that every scenario-shaped file under the playbook is indexed exactly once."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Fourteen manual scenarios prescribe test commands with dead runtime paths",
      "file": ".opencode/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/coverage-graph-fuzzy-merge.md",
      "line": 45,
      "evidence": "The scenario requires `cd .opencode/skills/runtime/`, but that directory does not exist; the live package is `.opencode/skills/system-deep-loop/runtime/package.json`. Seven fan-out scenarios instead change into system-spec-kit/mcp-server and invoke `../../runtime/...`, which resolves to the same missing `.opencode/skills/runtime` location. Across the runtime playbook, fourteen scenario files contain one of these dead path forms, so their mandatory EXIT-0 validation cannot execute as documented.",
      "recommendation": "Run tests from `.opencode/skills/system-deep-loop/runtime` using its package test script, repair every stale relative target, and add a documentation check that resolves each prescribed cwd and test path before accepting the playbook."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Release rules accept a verdict forbidden by the execution policy",
      "file": ".opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md",
      "line": 9,
      "evidence": "The execution policy says the only acceptable classifications are PASS, FAIL, or SKIP. Lines 89-98 separately define PARTIAL for both scenarios and features, while lines 105-109 allow READY whenever no feature is FAIL and critical scenarios pass. A non-critical scenario with incomplete evidence can therefore become PARTIAL and still permit READY despite PARTIAL being prohibited by the governing policy.",
      "recommendation": "Define one verdict enum for scenario, feature, and release aggregation. If PARTIAL remains valid, state it in the execution policy and make release readiness explicitly reject unresolved PARTIAL evidence; otherwise remove PARTIAL from all subordinate rules."
    }
  ],
  "refutations": [
    {
      "id": "F-028-02",
      "verdict": "refuted",
      "reason": "The current Claude agent lacks detect_changes in its declared tools, but `.claude/agents/deep-review.md` lines 157-158 explicitly says that if detect_changes is blocked or unavailable, the reviewer must disclose the missing structural-impact analysis and continue with plain git-diff review. The OpenCode and Codex mirrors carry the same fallback. The tool remains preferred for local diffs, but it is not currently a blocking runtime requirement."
    }
  ],
  "coverage": {
    "filesExamined": 27,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md",
      ".opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/intra-routing-recall/",
      ".opencode/skills/system-deep-loop/deep-review/SKILL.md",
      ".opencode/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md",
      ".opencode/skills/system-deep-loop/runtime/manual-testing-playbook/",
      ".opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/permissions-gate.md",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/permissions-gate.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/package.json",
      ".opencode/commands/deep/assets/deep-review-auto.yaml",
      ".claude/agents/deep-review.md",
      ".opencode/agents/deep-review.md",
      ".codex/agents/deep-review.toml"
    ]
  }
}
```