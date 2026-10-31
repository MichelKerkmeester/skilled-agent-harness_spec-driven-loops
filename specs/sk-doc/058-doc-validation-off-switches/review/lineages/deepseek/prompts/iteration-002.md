# Deep Review — Iteration 002 Prompt (rendered, in-process lineage execution)

STATE SUMMARY (auto-generated, review mode):
Iteration: 2 of 5 | Mode: review
Target: specs/sk-doc/062-doc-validation-off-switches (spec-folder)
Dimensions: 1/4 complete | Next: security
Findings: P0:0 P1:0 P2:1 active
Traceability: core=pending overlay=pending
Last 2 ratios: 1.0 -> N/A | Stuck count: 0
Provisional verdict: PENDING | hasAdvisories=false
Next focus: D2 security — parser surface, injection refusal, CI enforcement, .gitignore status

Review Target: specs/sk-doc/062-doc-validation-off-switches
Review Mode: spec-folder
Iteration: 2 of 5
Focus Dimension: security
Focus Files:
  - .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh
  - .skilled/hooks/shared/hook-flags.sh (eval guard surface)
  - .skilled/hooks/shared/hook-flags.cjs (parser + name lookup)
  - .skilled/skills/sk-doc/shared/scripts/validation_switch.py (BOM/CRLF/quotes)
  - .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh (argument handling, report emission)
  - .github/ (CI-enforcement claim), .gitignore (hook-flags.env status), .env.example (bypass-switch reference)
Remaining Dimensions: traceability, maintainability
Traceability Protocols:
  - Core: spec_code, checklist_evidence (scheduled for iteration 3)
  - Overlay: feature_catalog_code, playbook_capability (maintainability/broadening)
Active Findings: F001 (P2, correctness)
State Files:
  - Config: specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/deep-review-config.json
  - State: specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/deep-review-state.jsonl
  - Registry: specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/deep-review-findings-registry.json
  - Strategy: specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/deep-review-strategy.md
Output: Write findings to specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek/iterations/iteration-002.md
CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
CONSTRAINT: Target files are READ-ONLY -- never modify code under review
CONSTRAINT: Fan-out lineage -- perform the iteration in-process; no nested CLI dispatch
