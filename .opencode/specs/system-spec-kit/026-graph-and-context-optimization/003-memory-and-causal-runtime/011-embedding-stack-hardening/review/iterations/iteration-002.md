# Deep Review Iteration 002

## Dimension

Security: socket perimeter, sandbox/path handling, env precedence, single-writer/lease discipline, fail-closed behavior, and secret leakage.

Scope class: complex. Code graph and semantic search were unavailable, so this pass used graphless fallback: direct reads of the configured scope, exact `rg` searches for socket/TCP/env/lease/lock/auth terms, and spec/test cross-checks where the security contract was explicit.

## Files Reviewed

- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:266`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:306`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:415`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:835`
- `.opencode/bin/hf-model-server.cjs:81`
- `.opencode/bin/hf-model-server.cjs:146`
- `.opencode/bin/hf-model-server.cjs:629`
- `.opencode/bin/hf-model-server.cjs:697`
- `.opencode/bin/lib/model-server-supervision.cjs:431`
- `.opencode/bin/lib/model-server-supervision.cjs:461`
- `.opencode/bin/lib/model-server-supervision.cjs:1131`
- `.opencode/bin/lib/model-server-supervision.cjs:1259`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:58`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:68`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:236`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:106`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:150`
- `.opencode/bin/mk-skill-advisor-launcher.cjs:537`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:411`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:436`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:449`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:481`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:513`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:836`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:1596`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/001-selector-and-shared-socket/spec.md:101`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/spec.md:57`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:178`

## Findings by Severity

### P0

None.

### P1

#### DR-002-P1-001 [P1] TCP model-server targets can expose unauthenticated embed traffic outside loopback

- File: `.opencode/bin/hf-model-server.cjs:146`
- Claim: `HF_EMBED_SERVER_URL` and `SPECKIT_IPC_SOCKET_DIR` can select arbitrary TCP hosts, and the server/client paths do not restrict those hosts to loopback or require authentication. A mis-set or injected env value can either bind the unauthenticated `/api/embed` endpoint on a non-loopback interface or send memory text to a remote endpoint.
- Evidence: `hf-model-server.cjs:81-96` normalizes `tcp://`, `http://`, and `https://` values to TCP targets without host allowlisting, and `listenOnce()` binds that hostname at `hf-model-server.cjs:146-149`. The request surface exposes `POST /api/embed` without any token/auth check at `hf-model-server.cjs:629-705`. The client path mirrors the same unchecked conversion in `hf-local.ts:266-320` and posts raw input strings to `/api/embed` at `hf-local.ts:835-838`. The launcher allowlist explicitly forwards `HF_EMBED_SERVER_URL` and `SPECKIT_IPC_SOCKET_DIR` into children at `mk-skill-advisor-launcher.cjs:106-110` and `mk-skill-advisor-launcher.cjs:150-153`. The supervised path's Unix-socket ownership guard exits early for TCP at `model-server-supervision.cjs:461-462`, and the demand listener binds TCP hosts directly at `model-server-supervision.cjs:1259-1261`.
- Counterevidence sought: I searched for loopback validation, host allowlists, auth tokens, and tests rejecting non-loopback TCP targets. The only observed TCP tests assert `127.0.0.1` conversion/acceptance, e.g. `launcher-model-server-cross-launcher.vitest.ts:178-179`; I did not find a guard that rejects `0.0.0.0`, LAN addresses, or remote hosts.
- Alternative explanation: Remote TCP might be an intentional escape hatch for advanced deployments. That is not reflected in the hardened socket-perimeter contract, and the endpoint carries embedding inputs that may contain private memory/spec content, so permissive remote transport needs an explicit opt-in boundary and authentication.
- Final severity: P1.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to P2 if a documented deployment contract explicitly permits unauthenticated remote TCP and all embedding inputs are classified non-sensitive; otherwise loopback-only or authenticated TCP should be required.
- Finding class: cross-consumer.
- Scope proof: `rg -n "HF_EMBED_SERVER_URL|SPECKIT_IPC_SOCKET_DIR|tcp://|/api/embed|auth|token|allowlist"` across the scope found the same unchecked TCP parsing in the server, client provider, supervision library, bridge, and launcher env allowlist, with no auth/allowlist guard.
- Affected surface hints: hf-local provider, hf-model-server listener, model-server supervision, launcher env forwarding, embedding text transport.
- Recommendation: Fail closed unless TCP targets are loopback by default. If remote TCP remains supported, require an explicit env such as `SPECKIT_HF_ALLOW_REMOTE_TCP=1` plus a shared bearer token or equivalent request authentication.

#### DR-002-P1-002 [P1] Workflow locks fail open after timeout, re-admitting concurrent standalone writers

- File: `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:436`
- Claim: The workflow's cross-process and per-folder locks return `false` on timeout or unexpected lock errors, but the guarded operation still runs. A slow save or embedding/indexing pass can therefore let a second standalone save proceed concurrently, undermining the single-writer hardening packet.
- Evidence: `acquireFilesystemLock()` returns `false` for non-`EEXIST` lock errors at `workflow.ts:421-424` and after 30 seconds at `workflow.ts:436-438`. `withWorkflowRunLock()` calls it, then executes `operation()` regardless at `workflow.ts:459-463`. The per-folder `description.json`/metadata lock repeats the same fail-open behavior: `acquireSavePfdLock()` returns `false` after 5 seconds at `workflow.ts:513-514`, and `withSavePfdLock()` still executes its operation at `workflow.ts:525-527`. The single-writer spec says standalone saves must preserve the single-writer invariant and skip direct indexing when a daemon is up at `013-standalone-save-second-writer-guard/spec.md:57`, but two daemon-down standalone saves can now overlap after the filesystem lock timeout.
- Counterevidence sought: I checked callers for a hard abort when lock acquisition returns `false`; none exists in `withWorkflowRunLock()` or `withSavePfdLock()`. I also searched the tests for assertions that lock timeout fails closed; the existing Step 11.5 daemon-guard tests cover daemon-up skip and contention diagnostics, not fail-open lock acquisition.
- Alternative explanation: The in-process queue still serializes same-process calls. That does not protect separate `generate-context.js` processes, which is the scenario the filesystem lock is explicitly meant to cover.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 if the direct indexing path is made impossible for all standalone saves regardless of daemon state, or if callers can prove saves always finish under 30 seconds and never run concurrently across processes.
- Finding class: cross-consumer.
- Scope proof: `rg -n "withWorkflowRunLock|acquireFilesystemLock|withSavePfdLock|proceeding without .* lock|2nd writer|single-writer"` ties the fail-open lock code to the standalone save second-writer packet and its tests/specs.
- Affected surface hints: memory save workflow, standalone indexing, description metadata writes, SQLite writer boundary.
- Recommendation: Treat lock acquisition failure as a hard error for write/index phases, or require an explicit unsafe override. For the per-folder lock, fail closed before mutating `description.json`/`graph-metadata.json` rather than proceeding unlocked.

### P2

None new.

## Traceability Checks

- Core `spec_code`: partial. The Unix-socket path has explicit ownership/symlink checks in the supervised model-server path, but the TCP transport and workflow lock fail-open behavior do not match the hardening themes of fail-closed socket perimeter and single-writer discipline.
- Core `checklist_evidence`: partial. Security behavior was checked against source and selected tests, but full checklist coverage remains for the traceability dimension.
- Overlay `skill_agent`: pending.
- Overlay `agent_cross_runtime`: pending.
- Overlay `feature_catalog_code`: partial. Embedding server, launcher, provider, and memory-save workflow surfaces were covered.
- Overlay `playbook_capability`: pending.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. Two new P1 security/reliability issues need remediation before this review can pass.

## Next Dimension

Traceability: verify phase 001-005 and daemon 009/010/012/013 claims against code, tests, and checklist evidence, with special attention to whether the two security findings are documented gaps or untracked regressions.

Review verdict: CONDITIONAL
