---
title: "Tasks: Agent and Command Tool-Grant Reconciliation"
description: "Fix tasks for remediation phase 4."
trigger_phrases:
  - "028 drift remediation"
  - "tasks: agent and command tool-grant reconciliation"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded tasks for phase 4"
    next_safe_action: "Work the fix tasks"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Agent and Command Tool-Grant Reconciliation

<!-- ANCHOR:notation -->
## Task Notation
- [ ] open
- [x] fixed and verified
- [~] false-positive (reason in ledger)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Load ledger entries for 004-tool-grant-reconciliation
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] F010 fix `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` causal-graph YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- [ ] F013 fix `.claude/agents/context.md` Claude context agent lacks code_graph MCP grant but body instructs its use
- [ ] F017 fix `.opencode/commands/speckit/complete.md` complete.md allowed-tools missing memory_search required by context_loading step
- [ ] F020 fix `.claude/agents/deep-review.md` tools: line only exposes detect_changes but body declares code_graph_query + code_graph_context as available tools
- [ ] F029 fix `.claude/agents/deep-research.md` Claude deep-research agent lacks code_graph MCP grant but wedged-daemon fallback references it
- [ ] F044 fix `.opencode/commands/speckit/resume.md` resume.md allowed-tools missing session_bootstrap required by recovery ladder
- [ ] F046 fix `.claude/agents/review.md` tools: line only exposes detect_changes but .opencode/agents/review.md body references it without any code_graph permissions declared
- [ ] F048 fix `.opencode/agents/context.md` OpenCode context agent declares non-existent MCP server 'code_graph'
- [ ] F049 fix `.opencode/agents/review.md` OpenCode review agent body uses detect_changes without granting it
- [ ] F050 fix `.claude/agents/deep-review.md` Claude deep-review agent body references code_graph_query/context not in tools line
- [ ] F054 fix `.opencode/commands/doctor/update.md` /doctor:update missing L5 Lifecycle + L7 Maintenance tools
- [ ] F055 fix `.opencode/commands/memory/learn.md` /memory:learn missing memory_context and 16 other spec-memory tools
- [ ] F064 fix `.opencode/commands/doctor/assets/doctor_memory.yaml` memory YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- [ ] F065 fix `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` deep-loop YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- [ ] F068 fix `.opencode/commands/doctor/mcp.md` doctor:mcp has MCP-style flags but no MCP tools in allowed-tools
- [ ] F069 fix `.opencode/commands/speckit/complete.md` complete.md router omits memory_search used by both complete YAMLs
- [ ] F074 fix `.claude/agents/context.md` context agent frontmatter omits required code-graph tool grants
- [ ] F075 fix `.opencode/agents/context.md` Context agent references unregistered MCP server `code_graph`
- [ ] F092 fix `.opencode/commands/deep/agent-improvement.md` agent-improvement workflow requires memory_search but command disallows it
- [ ] F093 fix `.opencode/commands/deep/model-benchmark.md` model-benchmark workflow requires memory_search but command disallows it
- [ ] F117 fix `.opencode/commands/speckit/implement.md` implement.md allowed-tools missing code_graph_query instructed by YAML
- [ ] F148 fix `.opencode/commands/create/agent.md` /create:agent omits Code Graph allowed tool while asset instructs code_graph_query
- [ ] F149 fix `.opencode/commands/create/sk-skill.md` /create:sk-skill omits Code Graph allowed tool while asset instructs code_graph_query
- [ ] F150 fix `.opencode/commands/create/changelog.md` /create:changelog omits Code Graph allowed tool while asset instructs code_graph_query
- [ ] F170 fix `.opencode/commands/doctor/assets/doctor_code-graph.yaml` Code-graph asset invokes code_graph_scan missing from route mcp_tools
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] opus re-reads every touched file; evidence resolved; scope respected
- [ ] validate.sh on this phase --strict exit 0
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All 25 findings terminal in the ledger.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- ../remediation-ledger.jsonl
<!-- /ANCHOR:cross-refs -->
