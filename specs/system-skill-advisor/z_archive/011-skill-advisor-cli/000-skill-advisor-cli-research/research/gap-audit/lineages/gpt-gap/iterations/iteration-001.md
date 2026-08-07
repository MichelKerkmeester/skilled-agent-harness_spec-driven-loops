# Iteration 1: LENS-1 Coverage Cross-Check

## Focus

Reconcile the feasibility research parity matrix against the three implementation phase specs. Check whether every tool, daemon service, and MCP affordance is owned by exactly one phase requirement or task.

## Findings

1. All nine MCP tools are owned by phase 1's generated-subcommand requirement. The research parity matrix enumerates `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, and `skill_graph_propagate_enhances` [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md:15]. Phase 1 requires all nine subcommands from `TOOL_DEFINITIONS` and help/validation parity [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:119].

2. Mutating tool policy is owned by phase 1 and phase 2 without double-ownership conflict. Phase 1 owns fail-closed behavior for scan/rebuild/propagate-apply [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md:120]. Phase 2 owns regression fixtures for orphan paths and dual-client behavior after the core CLI exists [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:125].

3. P1 GAP: resident-service semantics are only partially owned. The research daemon-loss table names FS watcher auto-rebuild, prompt cache, trust-state daemon evidence, telemetry/shadow sink, IPC bridge, and embedder resolution as resident capabilities a per-call CLI can lose [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md:31]. Phase 2 covers FS-watcher concurrent-client behavior [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:96], and phase 3 covers the warm hook path [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md:93], but no phase requirement/task explicitly preserves telemetry/shadow sink behavior, status trust-state split, or embedder-resolution behavior for graph mutations.

4. The generic `Files to Change` placeholders are not gaps by themselves. The planned phase plan explicitly says affected surfaces are placeholders and will be re-verified at `speckit:plan` time [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/plan.md:84].

## Sources Consulted

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/000-skill-advisor-cli-research/research/lineages/gpt/research.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/003-runtime-integration/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/plan.md`

## Assessment

`newInfoRatio`: 0.88. Novelty is high because this pass turns the broad parity matrix into phase ownership and finds a real resident-service coverage gap.

Confidence: high on tool ownership; medium-high on daemon-service gap because absence is inferred from the named requirements/tasks.

## Reflection

What worked: starting from the research table avoided stale tool counts. What failed: treating placeholder file inventory as a blocker was too broad. Ruled out: reporting planned-state scaffolding as a gap.

## Recommended Next Focus

LENS-2: map D1-D8 to REQs/tasks and search for orphans in both directions.
