# Deep Review — Iteration 001 Prompt (rendered, in-process lineage execution)

STATE SUMMARY (auto-generated, review mode):
Iteration: 1 of 5 | Mode: review
Target: specs/sk-doc/062-doc-validation-off-switches (spec-folder)
Dimensions: 0/4 complete | Next: correctness
Findings: P0:0 P1:0 P2:0 active
Traceability: core=pending overlay=pending
Last 2 ratios: N/A -> N/A | Stuck count: 0
Provisional verdict: PENDING | hasAdvisories=false
Next focus: D1 correctness — the switch semantics the rest of the review depends on

Review Target: specs/sk-doc/062-doc-validation-off-switches
Review Mode: spec-folder
Iteration: 1 of 5
Focus Dimension: correctness
Focus Files:
  - .skilled/hooks/shared/hook-flags.cjs
  - .skilled/hooks/shared/hook-flags.sh
  - .skilled/hooks/shared/hook-flags.test.cjs
  - .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh
  - .skilled/skills/sk-doc/shared/scripts/validation-switch.cjs
  - .skilled/skills/sk-doc/shared/scripts/validation_switch.py
  - .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py
  - .skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts
  - .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts
Remaining Dimensions: security, traceability, maintainability
Traceability Protocols:
  - Core: spec_code, checklist_evidence
  - Overlay: feature_catalog_code, playbook_capability (spec-folder applicable); skill_agent, agent_cross_runtime (not applicable unless drift found)
Active Findings: none
State Files:
  - Config: specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/deep-review-config.json
  - State: specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/deep-review-state.jsonl
  - Registry: specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/deep-review-findings-registry.json
  - Strategy: specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/deep-review-strategy.md
Output: Write findings to specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/iterations/iteration-001.md
CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
CONSTRAINT: Target files are READ-ONLY -- never modify code under review
CONSTRAINT: Fan-out lineage -- perform the iteration in-process; no nested CLI dispatch
