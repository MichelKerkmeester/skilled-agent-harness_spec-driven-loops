# Deep Review Report - gpt55r2-c-5

## Executive Summary
Verdict: CONDITIONAL

- Active findings: P0=0, P1=1, P2=0
- hasAdvisories: false
- Scope: MCP server infrastructure scope C, focused in this lineage on daemon IPC, launcher bridge, CLI front door, and model-server supervision.
- Stop reason: maxIterations reached for this fan-out lineage after one evidence-bearing pass.
- Release readiness state: in-progress

## Planning Trigger
Route to remediation planning for F001. The issue is not a P0 because no data loss or privilege escalation was proven, but it is a required fix because documented TCP IPC can become unavailable or route clients to an incompatible endpoint.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness | Documented `tcp://` IPC override is split between incompatible endpoint resolvers | `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211`; `.opencode/bin/lib/launcher-ipc-bridge.cjs:80-87`; `.opencode/bin/lib/model-server-supervision.cjs:441-450`; `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:963-972`; `.opencode/bin/mk-spec-memory-launcher.cjs:1782-1784` | active |

## Remediation Workstreams
| Workstream | Findings | Action |
|------------|----------|--------|
| TCP endpoint contract | F001 | Make MCP IPC and HF model-server TCP endpoints distinct and consistently resolved, or remove `tcp://` from the daemon IPC contract. Add a regression test for `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:<port>`. |

## Spec Seed
- Clarify whether `SPECKIT_IPC_SOCKET_DIR` is a directory-only daemon IPC setting, a TCP daemon IPC endpoint, or a shared base from which service-specific endpoints are derived.
- If TCP remains supported, require separate MCP bridge and HF model-server endpoint variables or deterministic per-service port derivation.

## Plan Seed
1. Add a failing test showing `resolveIpcSocketPath()` preserves `tcp://` for MCP IPC or rejects it consistently with documentation.
2. Add a failing test showing `launcher-ipc-bridge.getIpcSocketPath()` and `spec-memory-cli.callTool()` target the same endpoint the context server actually binds.
3. Add a failing test showing HF model-server TCP resolution cannot collide with the MCP daemon IPC endpoint.
4. Implement the smallest resolver change that makes these tests pass.

## Traceability Status
| Protocol | Gate | Status | Evidence | Notes |
|----------|------|--------|----------|-------|
| spec_code | hard | partial | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:7-11` | Daemon IPC and CLI front door are explicitly in scope. |
| checklist_evidence | hard | partial | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:13-14` | No checklist exists in the scope folder. |
| feature_catalog_code | advisory | pending | n/a | Not covered within one iteration. |
| playbook_capability | advisory | pending | n/a | Not covered within one iteration. |

## Deferred Items
- Full handler/provider/request-validation sweep remains deferred due the one-iteration fan-out cap.
- Maintainability review remains deferred.
- Feature catalog and playbook overlay checks remain pending.

## Audit Appendix
| Iteration | Focus | Files | Findings | Verdict |
|-----------|-------|-------|----------|---------|
| 1 | correctness-security-daemon-ipc | 6 | P0=0 P1=1 P2=0 | CONDITIONAL |

### Coverage
- Dimensions covered: correctness, security
- Dimensions not covered: traceability, maintainability
- Resource-map gate: skipped because scope folder had no resource-map.md at init

### Replay Validation
- JSONL config, iteration, claim-adjudication, and synthesis records were written.
- Iteration file ends with exact final line `Review verdict: CONDITIONAL`.
- P1 claim adjudication packet is present with required fields and evidence references.

### Evidence Notes
- A local Node check confirmed `path.resolve('tcp://127.0.0.1:65535')` resolves to a filesystem path under the workspace, matching the source-level concern in `resolveIpcSocketPath()`.
