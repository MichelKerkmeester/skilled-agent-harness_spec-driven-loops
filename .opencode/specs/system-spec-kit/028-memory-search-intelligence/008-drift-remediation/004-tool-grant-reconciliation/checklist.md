---
title: "Checklist: Agent and Command Tool-Grant Reconciliation"
description: "Verification checklist for remediation phase 4."
trigger_phrases:
  - "028 drift remediation"
  - "checklist: agent and command tool-grant reconciliation"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded checklist for phase 4"
    next_safe_action: "Verify each finding"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: Agent and Command Tool-Grant Reconciliation

<!-- ANCHOR:protocol -->
## Protocol
Mark an item done only after opus re-reads the file and confirms the cited evidence is resolved (or records a false-positive in the ledger).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Ledger entries for 004-tool-grant-reconciliation loaded
- [ ] Cited files present
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Edits minimal and scoped to cited drift
- [ ] Comment hygiene respected (no artifact-ids/spec paths in code comments)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Affected tests/validators re-run where a finding touches code or a test
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security
- [ ] No secrets or scope-violating changes introduced
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] F010 `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` causal-graph YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- [ ] F013 `.claude/agents/context.md` Claude context agent lacks code_graph MCP grant but body instructs its use
- [ ] F017 `.opencode/commands/speckit/complete.md` complete.md allowed-tools missing memory_search required by context_loading step
- [ ] F020 `.claude/agents/deep-review.md` tools: line only exposes detect_changes but body declares code_graph_query + code_graph_context as available tools
- [ ] F029 `.claude/agents/deep-research.md` Claude deep-research agent lacks code_graph MCP grant but wedged-daemon fallback references it
- [ ] F044 `.opencode/commands/speckit/resume.md` resume.md allowed-tools missing session_bootstrap required by recovery ladder
- [ ] F046 `.claude/agents/review.md` tools: line only exposes detect_changes but .opencode/agents/review.md body references it without any code_graph permissions declared
- [ ] F048 `.opencode/agents/context.md` OpenCode context agent declares non-existent MCP server 'code_graph'
- [ ] F049 `.opencode/agents/review.md` OpenCode review agent body uses detect_changes without granting it
- [ ] F050 `.claude/agents/deep-review.md` Claude deep-review agent body references code_graph_query/context not in tools line
- [ ] F054 `.opencode/commands/doctor/update.md` /doctor:update missing L5 Lifecycle + L7 Maintenance tools
- [ ] F055 `.opencode/commands/memory/learn.md` /memory:learn missing memory_context and 16 other spec-memory tools
- [ ] F064 `.opencode/commands/doctor/assets/doctor_memory.yaml` memory YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- [ ] F065 `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` deep-loop YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- [ ] F068 `.opencode/commands/doctor/mcp.md` doctor:mcp has MCP-style flags but no MCP tools in allowed-tools
- [ ] F069 `.opencode/commands/speckit/complete.md` complete.md router omits memory_search used by both complete YAMLs
- [ ] F074 `.claude/agents/context.md` context agent frontmatter omits required code-graph tool grants
- [ ] F075 `.opencode/agents/context.md` Context agent references unregistered MCP server `code_graph`
- [ ] F092 `.opencode/commands/deep/agent-improvement.md` agent-improvement workflow requires memory_search but command disallows it
- [ ] F093 `.opencode/commands/deep/model-benchmark.md` model-benchmark workflow requires memory_search but command disallows it
- [ ] F117 `.opencode/commands/speckit/implement.md` implement.md allowed-tools missing code_graph_query instructed by YAML
- [ ] F148 `.opencode/commands/create/agent.md` /create:agent omits Code Graph allowed tool while asset instructs code_graph_query
- [ ] F149 `.opencode/commands/create/sk-skill.md` /create:sk-skill omits Code Graph allowed tool while asset instructs code_graph_query
- [ ] F150 `.opencode/commands/create/changelog.md` /create:changelog omits Code Graph allowed tool while asset instructs code_graph_query
- [ ] F170 `.opencode/commands/doctor/assets/doctor_code-graph.yaml` Code-graph asset invokes code_graph_scan missing from route mcp_tools
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] No files created or moved outside the cited targets
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary
- [ ] All 25 findings terminal in the ledger
<!-- /ANCHOR:summary -->
