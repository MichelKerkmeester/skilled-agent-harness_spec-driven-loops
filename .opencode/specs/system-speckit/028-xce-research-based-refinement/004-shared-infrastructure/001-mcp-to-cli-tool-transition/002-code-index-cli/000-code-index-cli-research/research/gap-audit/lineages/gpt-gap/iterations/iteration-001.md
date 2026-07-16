# Iteration 1: LENS-1 Coverage Cross-Check

## Focus

Reconcile the code-index research parity matrix against the three implementation phase specs. The question: every tool, daemon service, and MCP affordance should be owned by exactly one phase requirement or task, without unowned or double-owned work.

## Findings

- The 8-tool surface is fully captured by the phase plan. The canonical schema exports exactly `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply`, and `detect_changes`; phase 1 owns generated subcommands, validation, blocked-read rendering, exit taxonomy, and auto-spawn plumbing. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:186] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:93]

- Daemon-service preservation is owned without double-counting. The workstream scope keeps launcher, IPC bridge, and handlers unchanged; phase 1 ships the CLI as a second IPC client; phase 2 regression-locks dual-client and dual-spawn/dead-socket behavior. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:81] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:84] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/spec.md:93]

- P1 gap candidate: phase 3 owns runtime wiring, but its affected-surface table is still a placeholder rather than an implementation inventory. The plan says surfaces are enumerated in spec.md, while spec.md only says "Runtime hook adapters + plugin bridge + configs + docs"; actual implementation requires specific hook registration files, runtime config files, and the OpenCode bridge. This is not a phase-1 blocker, but it is a day-one phase-3 discovery trap. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/plan.md:84] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:107]

## Sources Consulted

- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:100]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:101]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:102]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:103]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec.md:119]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/spec.md:119]
- [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec.md:119]

## Assessment

- newInfoRatio: 1.00
- Novelty justification: First pass; all coverage and ownership evidence was new to this lineage.
- Confidence: High for phase ownership; medium for severity of the affected-surface gap because phase 3 is planned-state.

## Reflection

- What worked and why: Reading the parent phase map before child specs made ownership clear.
- What did not work and why: Broad rg hits included historical specs; current phase docs were the reliable source.
- What I would do differently: Start phase-3 audit from runtime config files before reading prose plans.

## Ruled Out

- MCP removal: explicitly out of scope for dual-stack. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:80]

## Dead Ends

- No double-owned D-series work found between phase 1 and phase 2.

## Recommended Next Focus

LENS-2: Map D1-D10 to concrete phase requirements and tasks, and check orphan requirements in both directions.
