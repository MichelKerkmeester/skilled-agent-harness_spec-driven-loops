# Deep Review Report - gpt55r2-c-1

## Executive Summary
- Verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Iterations: 1 / 1
- Active findings: P0=0, P1=2, P2=0
- hasAdvisories: false
- Release readiness: in-progress
- Scope: MCP server infrastructure handlers/providers/daemon/IPC outside search pipeline and store/index/lifecycle scopes.

## Planning Trigger
Route to remediation planning because two active P1 findings affect governed checkpoint isolation and documented daemon IPC behavior. No P0 was confirmed in this lineage.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | security | Scoped checkpoint callers can match unscoped checkpoints | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1270-1281`, `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:256-265` | active |
| F002 | P1 | correctness | Server IPC resolver breaks documented tcp:// socket override | `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211`, `.opencode/bin/lib/launcher-ipc-bridge.cjs:80-88`, `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:795-803`, `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:180` | active |

## Remediation Workstreams
- Checkpoint scope isolation: make scoped checkpoint matching require actual matching metadata for every supplied tenant/user/agent field, migrate or explicitly classify legacy unscoped checkpoints, and add list/get/restore/delete regression coverage.
- TCP IPC contract: either preserve `tcp://` in `resolveIpcSocketPath()` and add server/CLI integration tests, or remove TCP support from the spec-memory daemon documentation and reject the env value consistently.

## Spec Seed
- Governed checkpoint tools must not treat absent checkpoint metadata as matching a supplied tenant/user/agent scope unless an explicit legacy-unscoped access mode is requested and audited.
- `SPECKIT_IPC_SOCKET_DIR=tcp://host:port` must be supported consistently by the spec-memory CLI, launcher, and backend server, or be documented as unsupported and rejected consistently.

## Plan Seed
- Add failing tests for scoped checkpoint callers attempting to list, restore, and delete unscoped checkpoints.
- Patch storage and handler scope predicates to require exact metadata presence for scoped fields.
- Add a resolver test for `resolveIpcSocketPath()` with `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:0`.
- Patch the server resolver or update documentation and validation to fail fast before launcher/client split-brain.

## Traceability Status
| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | Scope claims were checked against the files supporting F001 and F002 only. |
| checklist_evidence | partial | hard | No checklist.md exists in the scope packet. |
| feature_catalog_code | not-run | advisory | Deferred by maxIterations=1. |
| playbook_capability | not-run | advisory | Deferred by maxIterations=1. |

## Deferred Items
- Full breadth review of all remaining handlers under `mcp_server/handlers/`.
- Full provider retry/failover lifecycle review beyond the spot checks.
- Maintainability pass across daemon launcher and shared supervision code.

## Audit Appendix
- Artifact binding: direct `config.fanout_lineage_artifact_dir` override to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-c-1`; `resolveArtifactRoot` was not run.
- Iteration file: `iterations/iteration-001.md` ends with `Review verdict: CONDITIONAL`.
- Claim adjudication: F001 and F002 include typed packets and were recorded as passed in `deep-review-state.jsonl`.
- Convergence replay: stopped by hard maxIterations=1, not by convergence; dimension coverage incomplete.
- Command evidence: `node -e "const path=require('path'); console.log(path.resolve('tcp://127.0.0.1:65535'))"` returned `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/tcp:/127.0.0.1:65535`.
