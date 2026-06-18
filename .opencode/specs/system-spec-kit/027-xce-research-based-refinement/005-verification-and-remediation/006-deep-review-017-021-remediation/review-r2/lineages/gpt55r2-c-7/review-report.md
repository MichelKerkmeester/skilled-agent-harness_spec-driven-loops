# Deep Review Report - gpt55r2-c-7

## Executive Summary
Verdict: CONDITIONAL

Active findings: P0=0, P1=2, P2=0. `hasAdvisories=false`.

Scope: MCP server infrastructure under `.opencode/skills/system-spec-kit/mcp_server/` and `.opencode/bin/`, excluding search pipeline scope A and store/index/lifecycle scope B except where needed to validate daemon replay behavior.

Stop reason: `maxIterationsReached` after one configured iteration.

## Planning Trigger
Route to remediation planning because two active P1 findings remain. No P0 finding was confirmed, so this is not a release-blocking FAIL, but the daemon/IPC behavior is not clean enough for PASS.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| F001 | P1 | correctness | Documented `tcp://` IPC override is split-brain between server and launcher | `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:180`; `.opencode/bin/spec-memory.cjs:107-108`; `.opencode/bin/lib/launcher-ipc-bridge.cjs:80-87`; `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2320`; `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-212` | active |
| F002 | P1 | correctness | Session proxy replays `memory_save` despite acknowledged non-idempotent secondary-index gap | `.opencode/bin/lib/launcher-session-proxy.cjs:33-47`; `.opencode/bin/lib/launcher-session-proxy.cjs:146-153`; `.opencode/bin/lib/launcher-session-proxy.cjs:649-663` | active |

## Remediation Workstreams
| Workstream | Findings | Action |
| --- | --- | --- |
| IPC endpoint contract | F001 | Make backend `resolveIpcSocketPath` preserve `tcp://` endpoints exactly like launcher bridge, or narrow the public contract and CLI hints so tcp is not advertised for mk-spec-memory. Add a regression that starts the backend with `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:0` and proves the CLI connects to the same endpoint. |
| Replay idempotency | F002 | Either remove `memory_save` from `REPLAYABLE_TOOL_NAMES` until the secondary-index path has an idempotency token, or thread request idempotency through every save-side secondary-index write and cover commit-then-die replay. |

## Spec Seed
- The daemon IPC contract should define one authoritative `SPECKIT_IPC_SOCKET_DIR` resolution rule shared by server bind and launcher client code.
- Mutation replay policy should distinguish fully idempotent operations from partially idempotent operations; `memory_save` should not be replayed across recycle unless all primary and secondary effects are deduplicated by a stable request key.

## Plan Seed
1. Add a failing regression for F001 showing `tcp://` env mismatch between `.opencode/bin/lib/launcher-ipc-bridge.cjs` and `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts`.
2. Patch shared IPC resolver or public docs for F001, then verify both backend bind and CLI client use the same endpoint.
3. Add a replay regression for F002 that simulates backend death after primary `memory_save` commit and before secondary-index completion.
4. Patch F002 by making `memory_save` non-replayable or fully idempotent across secondary index writes.
5. Rerun deep review over maintainability and broader handler request validation.

## Traceability Status
| Protocol | Status | Gate | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | partial | hard | scope spec:6-14; F001-F002 evidence | Scope was reviewed against shipped files; maxIterations=1 limited breadth. |
| checklist_evidence | pass | hard | scope spec:1-17 | No checklist exists for this scope packet. |
| feature_catalog_code | partial | advisory | `ENV_REFERENCE.md:180`; launcher/session proxy evidence | Public env contract drifts from server bind implementation. |
| playbook_capability | partial | advisory | not fully covered | Deferred by iteration ceiling. |

## Deferred Items
- Maintainability pass over handler envelope consistency and error taxonomy.
- Broader handler request-validation pass outside the daemon/IPC hot path.
- Retest after code graph is fresh; this lineage used direct file evidence because graph readiness was stale.

## Audit Appendix
| Item | Result |
| --- | --- |
| Iterations | 1 |
| Executor | cli-opencode model=openai/gpt-5.5-fast |
| Artifact root | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-c-7` |
| Code graph | stale, not used as finding evidence |
| Resource map present at init | false |
| Replay validation | JSONL state has config, iteration, and synthesis records; iteration file ends with canonical verdict line. |
| Final verdict | CONDITIONAL |
