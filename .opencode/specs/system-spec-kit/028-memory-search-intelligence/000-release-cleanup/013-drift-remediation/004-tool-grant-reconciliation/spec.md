---
title: "Feature Specification: Agent and Command Tool-Grant Reconciliation"
description: "Remediation phase 4 of 6: 25 drift findings (P1 20, P2 5). Each is verified real, fixed by gpt-5.5 high, re-verified by opus."
trigger_phrases:
  - "028 drift remediation"
  - "feature specification: agent and command tool-grant reconciliation"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded phase 4 from the remediation ledger"
    next_safe_action: "Triage and fix the 25 findings"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Agent and Command Tool-Grant Reconciliation

<!-- ANCHOR:metadata -->
## 1. METADATA
- Track: 008-drift-remediation, phase 4 of 6
- Findings: 25 (P1 20, P2 5)
- Ledger: ../remediation-ledger.jsonl (phase=004-tool-grant-reconciliation)
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The 028 drift audit surfaced 25 evidence-backed findings in this surface area: doc/config/test reality drifted from code.
### Purpose
Verify each against the real file, fix the genuine ones with minimal scoped edits, re-verify, and leave every ledger entry terminal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
The 25 findings in REQUIREMENTS.
### Out of Scope
Findings in other phases; adjacent cleanup not cited by a finding.
### Files to Change
- `.opencode/commands/doctor/assets/doctor_causal-graph.yaml`
- `.claude/agents/context.md`
- `.opencode/commands/speckit/complete.md`
- `.claude/agents/deep-review.md`
- `.claude/agents/deep-research.md`
- `.opencode/commands/speckit/resume.md`
- `.claude/agents/review.md`
- `.opencode/agents/context.md`
- `.opencode/agents/review.md`
- `.opencode/commands/doctor/update.md`
- `.opencode/commands/memory/learn.md`
- `.opencode/commands/doctor/assets/doctor_memory.yaml`
- `.opencode/commands/doctor/assets/doctor_deep-loop.yaml`
- `.opencode/commands/doctor/mcp.md`
- `.opencode/commands/deep/agent-improvement.md`
- `.opencode/commands/deep/model-benchmark.md`
- `.opencode/commands/speckit/implement.md`
- `.opencode/commands/create/agent.md`
- `.opencode/commands/create/sk-skill.md`
- `.opencode/commands/create/changelog.md`
- `.opencode/commands/doctor/assets/doctor_code-graph.yaml`
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### Required (complete OR user-approved deferral)
- F010 [P1 misalignment] `.opencode/commands/doctor/assets/doctor_causal-graph.yaml:57-60` causal-graph YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- F013 [P1 drift] `.claude/agents/context.md:4` Claude context agent lacks code_graph MCP grant but body instructs its use
- F017 [P1 misalignment] `.opencode/commands/speckit/complete.md:4` complete.md allowed-tools missing memory_search required by context_loading step
- F020 [P1 misalignment] `.claude/agents/deep-review.md:4` tools: line only exposes detect_changes but body declares code_graph_query + code_graph_context as available tools
- F029 [P1 drift] `.claude/agents/deep-research.md:4` Claude deep-research agent lacks code_graph MCP grant but wedged-daemon fallback references it
- F044 [P1 misalignment] `.opencode/commands/speckit/resume.md:4` resume.md allowed-tools missing session_bootstrap required by recovery ladder
- F046 [P1 misalignment] `.claude/agents/review.md:4` tools: line only exposes detect_changes but .opencode/agents/review.md body references it without any code_graph permissions declared
- F048 [P1 misalignment] `.opencode/agents/context.md:20-22` OpenCode context agent declares non-existent MCP server 'code_graph'
- F049 [P1 misalignment] `.opencode/agents/review.md:6-19` OpenCode review agent body uses detect_changes without granting it
- F050 [P1 drift] `.claude/agents/deep-review.md:4` Claude deep-review agent body references code_graph_query/context not in tools line
- F054 [P1 misalignment] `.opencode/commands/doctor/update.md:4` /doctor:update missing L5 Lifecycle + L7 Maintenance tools
- F055 [P1 misalignment] `.opencode/commands/memory/learn.md:4` /memory:learn missing memory_context and 16 other spec-memory tools
- F064 [P1 misalignment] `.opencode/commands/doctor/assets/doctor_memory.yaml:50-53` memory YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- F065 [P1 misalignment] `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:59-62` deep-loop YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- F068 [P1 dead] `.opencode/commands/doctor/mcp.md:3-4` doctor:mcp has MCP-style flags but no MCP tools in allowed-tools
- F069 [P1 contradiction] `.opencode/commands/speckit/complete.md:4` complete.md router omits memory_search used by both complete YAMLs
- F074 [P1 misalignment] `.claude/agents/context.md:4` context agent frontmatter omits required code-graph tool grants
- F075 [P1 dead] `.opencode/agents/context.md:22` Context agent references unregistered MCP server `code_graph`
- F092 [P1 misalignment] `.opencode/commands/deep/agent-improvement.md:4` agent-improvement workflow requires memory_search but command disallows it
- F093 [P1 misalignment] `.opencode/commands/deep/model-benchmark.md:4` model-benchmark workflow requires memory_search but command disallows it
- F117 [P2 misalignment] `.opencode/commands/speckit/implement.md:4` implement.md allowed-tools missing code_graph_query instructed by YAML
- F148 [P2 misalignment] `.opencode/commands/create/agent.md:4` /create:agent omits Code Graph allowed tool while asset instructs code_graph_query
- F149 [P2 misalignment] `.opencode/commands/create/sk-skill.md:4` /create:sk-skill omits Code Graph allowed tool while asset instructs code_graph_query
- F150 [P2 misalignment] `.opencode/commands/create/changelog.md:4` /create:changelog omits Code Graph allowed tool while asset instructs code_graph_query
- F170 [P2 misalignment] `.opencode/commands/doctor/assets/doctor_code-graph.yaml:244` Code-graph asset invokes code_graph_scan missing from route mcp_tools
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Every listed finding terminal in the ledger (fixed+verified or false-positive with reason).
- opus re-read confirms evidence resolved and scope respected.
- validate.sh --strict exit 0 for this phase.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS
- A fix touches more than the cited drift (scope creep) -> opus verifies scope per file.
- A finding is a false positive -> triage before fixing; never fix a phantom.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- No behavior regressions; edits are doc/config/test alignment only.
- Comment hygiene: no artifact-ids or spec paths in code comments.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES
- Same file cited by multiple findings -> batch edits, verify once per file.
- Evidence line numbers shifted since the audit -> verify by content, not line.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS
None open; deferrals (if any) are recorded as false-positive with reason in the ledger.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## 10. RELATED DOCS
- ../remediation-ledger.jsonl
- ../../research/drift-audit-2026-06-27/converged-report.md
<!-- /ANCHOR:related-docs -->
