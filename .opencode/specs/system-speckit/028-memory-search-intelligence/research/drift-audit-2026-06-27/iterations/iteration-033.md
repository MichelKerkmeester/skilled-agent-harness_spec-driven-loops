# Iteration 33 — kimi

**Angle:** Audit all speckit YAML mcp_integration.tool and mcp_tool keys systematically against their router frontmatter

**Findings:** 5

- **[P1] contradiction** `.opencode/commands/speckit/complete.md:4` — complete.md router omits memory_search used by both complete YAMLs
  - evidence: allowed-tools lists memory_context, memory_save, memory_index_scan but not memory_search; speckit_complete_auto.yaml:448-450 declares 'mcp_integration: tool: memory_search' and speckit_complete_confirm.yaml:475-477 declares the same.
  - fix: Add mcp__mk_spec_memory__memory_search to complete.md allowed-tools frontmatter.
- **[P2] dead** `.opencode/commands/speckit/complete.md:4` — complete.md router allows memory_context never invoked as mcp_tool in complete YAMLs
  - evidence: allowed-tools includes mcp__mk_spec_memory__memory_context, but the only mcp_integration.tool/mcp_tool keys in speckit_complete_auto.yaml are memory_search (448-450) and memory_save (1044-1046), and in speckit_complete_confirm.yaml are memory_search (475-477) and memory_save (1101-1103).
  - fix: Remove mcp__mk_spec_memory__memory_context from complete.md allowed-tools, or add a context-loading step that invokes it as mcp_integration.tool.
- **[P1] dead** `.opencode/commands/speckit/plan.md:4` — plan.md router allows memory_index_scan never invoked as mcp_tool in plan YAMLs
  - evidence: allowed-tools includes mcp__mk_spec_memory__memory_index_scan; speckit_plan_auto.yaml:125-128 uses memory_search and 655-659 uses memory_save; speckit_plan_confirm.yaml:125-128 uses memory_search and 717-720 uses memory_save. No mcp_integration.tool or mcp_tool key equals memory_index_scan.
  - fix: Remove mcp__mk_spec_memory__memory_index_scan from plan.md allowed-tools, or add a real post_save_indexing step that invokes it as mcp_tool.
- **[P1] dead** `.opencode/commands/speckit/implement.md:4` — implement.md router allows memory_index_scan never invoked as mcp_tool in implement YAMLs
  - evidence: allowed-tools includes mcp__mk_spec_memory__memory_index_scan; speckit_implement_auto.yaml:331-334 uses memory_search and 562-564 uses memory_save; speckit_implement_confirm.yaml:308-311 uses memory_search and 591-593 uses memory_save. No mcp_integration.tool or mcp_tool key equals memory_index_scan.
  - fix: Remove mcp__mk_spec_memory__memory_index_scan from implement.md allowed-tools, or add a real post_save_indexing step that invokes it as mcp_tool.
- **[P2] dead** `.opencode/commands/speckit/resume.md:4` — resume.md router over-declares memory and checkpoint tools never invoked as mcp_tool in resume YAMLs
  - evidence: allowed-tools lists memory_stats, memory_delete, memory_update, memory_validate, memory_index_scan, memory_health, checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete; speckit_resume_auto.yaml:84-87 and speckit_resume_confirm.yaml:89-92 use only memory_context as mcp_integration.tool, and speckit_resume_auto.yaml:146-149 and speckit_resume_confirm.yaml:190-193 use only memory_context as mcp_tool. None of those ten tools appear as mcp_integration.tool or mcp_tool keys.
  - fix: Remove the unused memory_stats/delete/update/validate/index_scan/health and checkpoint_* entries from resume.md allowed-tools, or add explicit mcp_tool invocations for them in the resume YAMLs.
