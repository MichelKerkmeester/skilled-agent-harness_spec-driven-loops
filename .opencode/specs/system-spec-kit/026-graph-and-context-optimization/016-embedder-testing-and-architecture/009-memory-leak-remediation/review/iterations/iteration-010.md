# Iteration 010 — security

## Metadata
- Iteration: 10 of 10
- Dimension: security
- Timestamp: 2026-05-22T17:46:27Z
- Findings this iter: 6

## Summary
This final security pass re-read the existing review state, all prior iteration reports, the current registry, the 13 phase implementation summaries, and the security-sensitive lifecycle surfaces across deep-loop dispatch, Code Graph launch/readiness/IPC helpers, rerank sidecar ownership, and process inventory tooling. I found six novel issues: five required security gaps around secret-bearing environment propagation, shell execution from persisted metadata, project-local dotenv injection, owner-token disclosure/spoofing, and one lower-severity IPC cleanup footgun.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### Deep-loop external executors inherit the full parent environment
- **Fingerprint:** `security:deep-loop-executor:parent-env-secret-leak`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:275`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:454`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:546`
- **Evidence:** `buildExecutorDispatchEnv()` starts with `const nextEnv = { ...parentEnv }` and only appends `SPECKIT_CLI_DISPATCH_STACK`. Both sync and async executor paths pass that full object as `env`.
- **Reasoning:** Non-native deep-loop dispatch can spawn `codex`, `gemini`, `claude`, `opencode`, or `devin`. Passing the entire parent process environment gives every selected executor all unrelated secrets present in the orchestrator environment, not just the credentials and runtime state it needs. That broadens blast radius across vendors and local subprocesses, and it contradicts the sidecar launcher’s stricter allowlist posture.
- **Suggested fix:** Build executor-specific env allowlists. Include only required runtime credentials, HOME/PATH/locale/temp basics, and the dispatch-stack guard; explicitly drop unrelated `*_API_KEY`, `*_TOKEN`, and provider credentials unless the selected executor needs them.

#### Code Graph launcher lets project dotenv inject Node runtime options
- **Fingerprint:** `security:code-graph-launcher:dotenv-node-options-injection`
- **File(s):** `.opencode/bin/mk-code-index-launcher.cjs:57`, `.opencode/bin/mk-code-index-launcher.cjs:378`, `.opencode/bin/mk-code-index-launcher.cjs:519`
- **Evidence:** The launcher loads `.env.local` and `.env` into `process.env`, then passes `env: process.env` to both the build subprocess and the MCP server child.
- **Reasoning:** A project-local dotenv value such as `NODE_OPTIONS=--require ...` or other Node/npm control variables is honored by the child Node processes before the Code Graph server code starts. Starting the MCP launcher in a repository should not execute arbitrary project-controlled Node preload hooks as part of a lifecycle helper.
- **Suggested fix:** Treat dotenv input as a narrow configuration source. Allow only the documented `SPECKIT_CODE_GRAPH_*`, `MK_CODE_INDEX_*`, and needed index-scope keys, and explicitly remove Node execution-control variables such as `NODE_OPTIONS`, `NODE_PATH`, and npm lifecycle variables before spawning build/server children.

#### Stored Code Graph metadata is interpolated into a shell command
- **Fingerprint:** `security:code-graph-ensure-ready:git-diff-shell-interpolation`
- **File(s):** `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:107`, `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:109`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:370`
- **Evidence:** `getLastGitHead()` returns the `last_git_head` metadata value directly from SQLite, and `getGitDiffFilePaths()` executes ``git diff --name-only ${fromSha}..${toSha}`` through `execSync()`.
- **Reasoning:** The current HEAD comes from Git, but the stored HEAD is persisted data. If the metadata row is corrupted or attacker-controlled, the shell-form `execSync` treats it as command text. This turns a readiness check into a command-injection path even though Git can be invoked safely with argument arrays.
- **Suggested fix:** Validate both refs against a strict commit/ref regex before use, and replace shell-form `execSync` with `execFileSync('git', ['diff', '--name-only', `${fromSha}..${toSha}`], ...)`.

#### Process inventory emits raw owner tokens in command lines
- **Fingerprint:** `security:process-memory-harness:owner-token-command-leak`
- **File(s):** `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:143`, `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:181`, `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:570`, `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:106`
- **Evidence:** The harness recognizes owner-token markers such as `SPECKIT_OWNER_TOKEN=` and `--owner-token`, but `parsePsOutput()` stores the raw `COMMAND` field and both the inventory and sweep plan print it unchanged.
- **Reasoning:** Owner tokens are part of the exact-identity proof used to decide whether processes belong to this project. Emitting raw command lines into JSON snapshots, benchmark artifacts, or runbook output can disclose those tokens and let later local tooling or logs weaken the same ownership boundary the sweep is trying to enforce.
- **Suggested fix:** Redact known secret-bearing argv/env fragments before storing `command` in `ProcessRow`, and add tests for `--owner-token value`, `--owner-token=value`, `SPECKIT_OWNER_TOKEN=value`, plus common `*_API_KEY`/`*_TOKEN` variants.

#### Rerank reusable-sidecar ownership token is predictable
- **Fingerprint:** `security:rerank-sidecar:predictable-ledger-owner-token`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:86`, `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:177`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:158`
- **Evidence:** Without `RERANK_SIDECAR_OWNER_TOKEN`, the owner token is `sha256(project_root)`. Ledger reuse then accepts rows whose token and config hash match and whose port passes the caller-supplied health check.
- **Reasoning:** The default owner token is not secret; any local process that can infer the project path can compute it. Combined with a forged ledger row and a localhost service answering `/health`, `ensure_rerank_sidecar()` can return an attacker-controlled reusable port without spawning the intended sidecar. This is distinct from the spawn-time port race because it attacks the ledger reuse path.
- **Suggested fix:** Generate a random per-install or per-state-dir owner token with `0600` permissions, require health responses to echo an unguessable owner/config nonce, and reject reusable rows whose owner proof is deterministic.

### P2 — Suggestions

#### IPC bridge unlinks any existing `daemon-ipc.sock` path
- **Fingerprint:** `security:code-graph-ipc:unlink-existing-socket-path`
- **File(s):** `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:58`, `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:146`, `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:153`
- **Evidence:** `SPECKIT_IPC_SOCKET_DIR` controls the socket directory. On `EADDRINUSE`, the bridge calls `fs.unlinkSync(socketPath)` and retries without checking the existing file type, owner, or whether the path is inside the canonical DB directory.
- **Reasoning:** The filename is fixed, so this is not arbitrary-path deletion, but a misconfigured or hostile `SPECKIT_IPC_SOCKET_DIR` can make startup remove an existing `daemon-ipc.sock` entry it did not create. For an IPC bridge that exposes MCP traffic, cleanup should be owner-aware and should not delete an unknown filesystem object simply because bind failed.
- **Suggested fix:** Constrain the default socket path to the canonical DB directory unless an explicit maintainer override is enabled, `lstat` the existing path, only unlink sockets owned by the current uid with expected permissions, and otherwise fail closed with an actionable error.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 60
- New-findings ratio: 0.10
- Continue / converged signal: `converged`

## Files Touched (this iter)
- `iterations/iteration-010.md`
- `deltas/iter-010.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-dashboard.md`
