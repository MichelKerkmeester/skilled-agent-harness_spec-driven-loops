# Deep Review Strategy - gpt55r2-c-7

## Topic
Review: MCP Server Infrastructure (handlers / providers / daemon)

## Review Dimensions
| Dimension | Status | Notes |
| --- | --- | --- |
| correctness | complete | Found two P1 correctness/contract issues in IPC and replay behavior. |
| security | complete | UDS perimeter hardening was present; tcp exposure was not active because tcp support is currently split-brain. |
| traceability | complete | Scope spec and env/runtime contract compared against implementation. |
| maintainability | pending | Not fully covered before maxIterations=1 ceiling. |

## Completed Dimensions
| Iteration | Dimensions | Verdict |
| --- | --- | --- |
| 001 | correctness, security, traceability | CONDITIONAL |

## Running Findings
| Severity | Count |
| --- | ---: |
| P0 | 0 |
| P1 | 2 |
| P2 | 0 |

## What Worked
- Direct Grep/Read was more reliable than code graph because code_graph_status reported stale graph state.
- Following the IPC flow from public CLI shim to launcher bridge to server bind exposed the tcp split-brain.
- Reading the session proxy replay classifier exposed the explicit non-idempotent replay gap.

## What Failed
- Code graph could not be used as trusted structural evidence because readiness was stale.
- The scope packet has no checklist.md, plan.md, or tasks.md, so checklist evidence could only be marked not applicable for this slice.

## Exhausted Approaches
- UDS symlink and foreign-owner hijack path: direct evidence showed perimeter checks in both shared socket server and CLI connection path.
- Local provider implementation review in mcp_server/lib/providers/embeddings.ts: file is a re-export only.

## Ruled-Out Directions
- Do not report a UDS socket-perimeter P1: `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:336-371` and `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:760-803` already enforce ownership/symlink/mode checks.
- Do not report context-server startup as wholly broken: default `/tmp/mk-spec-memory` UDS path remains the common path; the confirmed break is the documented tcp override.

## Next Focus
Remediate F001 and F002, then rerun at least one more lineage pass over maintainability and broader handler request validation.

## Known Context
- `resource-map.md` not present in the scope packet; skipping resource-map coverage gate.
- Code under review is defined by `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:6-14`.
- Code graph status was stale, so findings use direct file evidence only.

## Cross-Reference Status
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | scope spec:1-17; findings F001-F002 | One max-iteration pass found two required fixes. |
| checklist_evidence | pass | hard | scope spec:1-17 | No checklist.md exists for this fan-out scope. |
| feature_catalog_code | partial | advisory | ENV_REFERENCE.md:180; launcher/session proxy evidence | Public env contract drifts from backend implementation. |
| playbook_capability | partial | advisory | not fully covered | Deferred by maxIterations=1. |

## Files Under Review
| File | Coverage | Notes |
| --- | --- | --- |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md` | read | Scope source. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | sampled | IPC server bind and dispatcher hotspots. |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | sampled | Canonical IPC socket resolver and server bind. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` | read | Re-export surface to shared IPC implementation. |
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | sampled | CLI connection perimeter and daemon call path. |
| `.opencode/bin/spec-memory.cjs` | read | CLI shim. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | sampled | Launcher lease/supervision path. |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | sampled | Client-side socket path and probe path. |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | sampled | Replay classifier and reattach path. |
| `.opencode/bin/lib/model-server-supervision.cjs` | sampled | Model server supervision baseline. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/embeddings.ts` | read | Re-export only. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | sampled | Retry claiming and sanitized provider failure path. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | sampled | Schema surface. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | sampled | Public env contract evidence. |

## Review Boundaries
- artifact_dir: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-c-7`
- maxIterations: 1
- convergenceThreshold: 0.10
- executor: cli-opencode model=openai/gpt-5.5-fast
- no files under review were modified

## Non-Goals
- Do not implement fixes during review.
- Do not review search pipeline scope A or store/index/lifecycle scope B beyond evidence required for IPC/replay claims.

## Stop Conditions
- Stop after one iteration per config.maxIterations.
- Stop immediately on confirmed P0; none found in this lineage.
