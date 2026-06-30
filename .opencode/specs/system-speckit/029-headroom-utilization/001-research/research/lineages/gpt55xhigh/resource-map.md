# Resource Map: Headroom Utilization Research

## Primary Headroom Sources

| Source | Used For |
| --- | --- |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:49` | Surface inventory: library, proxy, wrap, MCP, memory, learn, output reduction, CCR. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:60` | Local-first pipeline and core components. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:77` | Library configuration and safety knobs. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:1` | MCP server surface and tool contracts. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/tool_injection.py:1` | CCR tool/system instruction injection behavior. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/wrap.py:1` | Runtime wrap support for Claude, Codex, OpenCode and related tools. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/providers/opencode/runtime.py:17` | OpenCode provider/MCP/plugin config injection. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:1` | Detector-only cache alignment behavior. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:1` | Output token shaping behavior and system-prompt mutation. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/memory/storage_router.py:1` | Cross-agent local memory storage routing and fail-closed project isolation. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/learn.py:1` | `headroom learn` CLI and write/apply behavior. |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/telemetry/beacon.py:1` | Telemetry opt-in implementation and payload behavior. |

## Primary Local Stack Sources

| Source | Used For |
| --- | --- |
| `.opencode/specs/system-spec-kit/029-headroom-utilization/001-research/spec.md` | Research charter, eight key questions, non-goals, stop conditions. |
| `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:27` | Deep-research convergence semantics and routing. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml:94` | Canonical deep-research state paths. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml:756` | Iteration output validation requirements. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml:905` | Final synthesis requirements. |
| `.opencode/skills/system-spec-kit/references/memory/save_workflow.md:291` | Phase parent save routing and generated metadata expectations. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:133` | Generator hardening and strict generated-metadata enforcement. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1246` | Tool input validation and auto-surface dispatch boundary. |
| `.opencode/skills/system-skill-advisor/SKILL.md:55` | Advisor routing model and confidence threshold behavior. |
| `.opencode/skills/cli-codex/references/hook_contract.md:22` | Codex hook injection contract. |
| `.opencode/skills/system-code-graph/references/runtime/tool_surface.md:42` | Code-graph tool families and readiness-gated read paths. |
| `.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:44` | Code-graph freshness/readiness gates. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md:23` | Cross-runtime hook lifecycle and fallback contract. |
| `.opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md:24` | Spec Kit Memory as sole memory write system. |
| `.opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md:43` | Deep workflow ownership and no hand-rolled substitutes. |
