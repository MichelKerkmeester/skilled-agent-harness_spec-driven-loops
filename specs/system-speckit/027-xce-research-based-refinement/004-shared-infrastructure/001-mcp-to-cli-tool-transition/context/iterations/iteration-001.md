# Deep Context Iteration 001

## Shared Focus

MCP-to-CLI transition ownership boundaries across `system-code-graph`, `system-skill-advisor`, and `system-spec-kit`.

## Seat Contributions

| seat | result | notes |
|------|--------|-------|
| native-a | succeeded | Found Code Graph schema/dispatcher/readiness invariants, Spec Kit boundary seam, Skill Advisor schemas, and unsafe bridge gaps. |
| native-b | succeeded | Confirmed the same Code Graph and Skill Advisor registries, process-boundary seams, runtime shim conventions, and unsafe bridge gaps. |

## Merged Findings

| unit | agreement | relevance | summary |
|------|-----------|-----------|---------|
| Code Graph schema registry | 2/2 | 0.98 | `CODE_GRAPH_TOOL_SCHEMAS` is the canonical stable tool manifest. |
| Code Graph dispatcher | 2/2 | 0.96 | `handleTool` preserves schema validation and handler routing. |
| Code Graph false-safe read gate | 2/2 | 0.99 | `shouldBlockReadPath` blocks stale or verification-failed graph reads. |
| Spec Kit Code Graph boundary | 2/2 | 0.95 | `callCodeGraphTool` is the process-boundary compatibility seam. |
| Spec Kit tool ownership marker | 2/2 | 0.94 | Code Graph schemas moved out while IDs remain stable. |
| Skill Advisor registry | 2/2 | 0.97 | `TOOL_DEFINITIONS` aggregates advisor and skill-graph tools. |
| Skill Advisor plugin bridge | 2/2 | 0.91 | `callAdvisorTool` is a safe bridge precedent. |
| Skill graph bootstrap proxy removal | 2/2 | 0.88 | Bootstrap points callers to standalone `mk_skill_advisor`. |
| Code Graph OpenCode bridge gap | 2/2 | 0.93 | Direct-import bridge is unsafe; use IPC/launcher-backed replacement. |

## Contradictions

None surfaced.

## Coverage Delta

The recovery sweep covered all three intended slices by direct-read fallback. Code Graph structural query verification remains blocked by a stale/failing gold-query gate.
