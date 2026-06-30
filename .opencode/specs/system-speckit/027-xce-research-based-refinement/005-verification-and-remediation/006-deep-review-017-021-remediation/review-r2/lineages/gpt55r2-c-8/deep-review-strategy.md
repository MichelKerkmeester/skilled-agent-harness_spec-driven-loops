# Deep Review Strategy

## Topic

Review of MCP server infrastructure outside search/store scopes for `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server`.

## Review Dimensions

- [x] correctness: iteration 001 found two active P1 correctness defects in daemon IPC/session replay behavior.
- [x] security: iteration 001 inspected IPC perimeter and daemon bridge paths; no P0 security issue confirmed.
- [x] traceability: iteration 001 mapped scope spec claims to IPC and CLI implementation files.
- [ ] maintainability: not separately covered before `config.maxIterations=1` stopped the lineage.

## Completed Dimensions

| Dimension | Iteration | Verdict | Notes |
| --- | ---: | --- | --- |
| correctness | 001 | CONDITIONAL | F001 and F002 are active P1 findings. |
| security | 001 | PASS | IPC trust-boundary code was sampled; no P0 security finding confirmed. |
| traceability | 001 | CONDITIONAL | Scope matched requested daemon/IPC surface; no checklist exists in scope. |

## Running Findings

| Severity | Active | Delta |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 2 | +2 |
| P2 | 0 | 0 |

## What Worked

- Direct Grep/Read over the requested daemon IPC and launcher files found two concrete defects with file:line evidence.
- Cross-checking server-side socket resolution against CLI bridge resolution exposed a client/server contract split.

## What Failed

- `memory_match_triggers` rejected the provided fan-out session id with `E_SESSION_SCOPE`; review proceeded with direct code evidence as permitted by the scope note.

## Exhausted Approaches

- No MCP daemon calls were required; direct file inspection was sufficient and avoided daemon flake risk noted by the scope.

## Ruled Out Directions

- Search pipeline internals were intentionally not reviewed because scope C excludes scope A.
- Store/index/lifecycle internals were not treated as primary targets except where needed to assess IPC replay impact.

## Next Focus

If another iteration is allowed, cover maintainability and the remaining request-handler/provider surfaces, then replay F001/F002 against tests or targeted repros.

## Known Context

- Artifact root was bound directly from `config.fanout_lineage_artifact_dir` as requested; `resolveArtifactRoot` was not run.
- `resource-map.md` was not present in the provided scope folder, so the resource-map coverage gate was skipped.

## Cross-Reference Status

| Protocol | Gate | Status | Evidence | Notes |
| --- | --- | --- | --- | --- |
| spec_code | hard | partial | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:6-14` | Two implementation defects found in requested IPC/daemon scope. |
| checklist_evidence | hard | N/A | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md:1-20` | Scope folder contains no checklist.md. |
| feature_catalog_code | advisory | not covered | N/A | Max iteration cap reached. |
| playbook_capability | advisory | not covered | N/A | Max iteration cap reached. |

## Files Under Review

| File | Coverage | Notes |
| --- | --- | --- |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md` | read | Scope source. |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | read | Canonical IPC bind/resolve logic re-exported by server. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` | read | Re-export surface. |
| `.opencode/bin/spec-memory.cjs` | read | CLI shim socket-dir contract. |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | read | Launcher bridge client socket resolution/probing. |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | read | Session proxy replay classifier. |
| `.opencode/bin/lib/model-server-supervision.cjs` | read | Model-server supervision sampled. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | read | Launcher lifecycle and proxy wiring sampled. |
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | read | Daemon-backed CLI path sampled. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | read | Handler boundary sampled. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | read | Provider retry sampled. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/embeddings.ts` | read | Provider re-export sampled. |

## Review Boundaries

- Max iterations: 1.
- Output path restriction: all generated artifacts are under the provided lineage artifact directory.
- Code under review is read-only.

## Non-Goals

- No remediation implementation.
- No edits outside the lineage artifact directory.
- No search pipeline or store/index/lifecycle audit beyond IPC-impact cross-checks.

## Stop Conditions

- Stopped because `config.maxIterations=1` was reached after iteration 001.
