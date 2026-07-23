# Iteration 5 — Security Dimension

## Dimension

**Security** — focus on injection / traversal / unsafe filesystem-boundary behavior, predictable-token risks, attack-surface expansion introduced by REQ-009 `background: true` default, and full-scope process-spawn + secrets sweeps.

Workflow: read-only, claim adjudication only. No fixes implemented.

---

## Files Reviewed

| File | REQ coverage | Notes |
|------|--------------|-------|
| `.opencode/bin/lib/model-server-supervision.cjs` | REQ-011 | `resolveModelServerSocketPath` (475-490), `assertSocketDirOwnership` (510-540), `assertSunPathLimit` (498-508), `prepareModelServerDemandTarget` (1279-1332), `unlinkModelServerSocket` (845-852), `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`PATH` (42-43) |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | REQ-009 / REQ-010 / REQ-011 | `crypto.randomUUID()` (460), `buildOwnerLease` (454-468), `acquireOwnerLeaseFile` (512-560), `refreshOwnerLeaseFile` (562-579), `clearOwnerLeaseFile` (611-626), `run()` (1153-1173), `launchServer` (1498-1585), `createModelServerSupervisor` factory (1377-1384), `wrap` of `dbDir: resolvedDbDir` (1091-1103) |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | REQ-011 | `loadModelServerSupervisionModule` (30-37), `resolveModelServerSocketPath` wrapper (943-951), `requireModelServerSupervision` (936-941), `hfControl` factory (991-1012), `run()` (1089-1109), `CHILD_ENV_ALLOWLIST` (99-155) |
| `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts` | REQ-009 | `handleTool` memory_index_scan dispatch (61-72) — strict omitted-only injection confirmed in iter 4; re-verified for attack-surface lens |
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts` | (out-of-REQ-009/010/011 utility) | `process.env.LLM_REFORMULATION_API_KEY` read (1282), `Authorization: Bearer ${apiKey}` (1293), `scrubSecretsDetailed` import (30) — used to redact secrets before durable save |

rg sweeps across all 16 scope files:

- `rg -n 'eval\(|exec\(|child_process|spawnSync|spawn\('` → 28 hits, all reviewable below.
- `rg -n -i 'api[_-]?key|secret[_-]?key|bearer\s|token\s*=|password\s*=\s*["'"][a-zA-Z0-9]{8,}|aws[_-]?(access|secret)|gh[pousr]_[A-Za-z0-9]{20,}'` → no embedded keys/tokens; only `LLM_REFORMULATION_API_KEY` env read, and `validateApiKey` test mocks.

---

## Findings by Severity

| Severity | Count | New in iter 5 |
|----------|-------|---------------|
| P0 | 0 | 0 |
| P1 | 0 | 0 |
| P2 | 0 | 0 |

Cumulative through iter 5: P0=0, P1=1 (P1-001 from iter 1, unchanged), P2=0.

---

## Security-Claim Adjudication

Each focal question states the claim, evidence, counter-evidence sought, alternative explanation, severity, confidence, and any downgrade trigger.

### S-Q1 — REQ-011 canonical-default socket path on `/tmp` mutability

- **Claim:** The hardcoded `/tmp/mk-hf-embed/hf-embed.sock` default is a predictable, world-readable parent directory and could be pre-created by another local user as a malicious socket or symlink before this launcher binds it.
- **Evidence (`model-server-supervision.cjs`):**
  - Default constants: `DEFAULT_MODEL_SERVER_SOCKET_DIR = '/tmp/mk-hf-embed'` (42), `DEFAULT_MODEL_SERVER_SOCKET_PATH = path.join(... /hf-embed.sock)` (43).
  - Resolver: `resolveModelServerSocketPath` falls through to `DEFAULT_MODEL_SERVER_SOCKET_DIR` ONLY when env has neither `HF_EMBED_SERVER_URL` nor `SPECKIT_IPC_SOCKET_DIR` and no `options.dbDir` is supplied (475-490).
  - Perimeter asserts invoked against the canonical path: `prepareModelServerDemandTarget` calls `assertSunPathLimit(socketPath)` (1285) and `assertSocketDirOwnership(socketPath, { statApi, getuid, logger })` (1287) **before** any `mkdirSync` / `unlinkSync` / `listen` — confirming the canonical default does NOT bypass the existing ownership/symlink checks.
  - `assertSocketDirOwnership` (510-540): `lstatSync` → if `isSymbolicLink()` returns `ESOCKETDIRSYMLINK`; if `dirStat.uid !== getuid()` returns `ESOCKETDIRFOREIGN`. Both thrown errors abort the listener boot (`startModelServerDemandListener` → `Promise` reject → outer `catch` releases the respawn lock and rethrows, 1440-1443).
  - `assertSunPathLimit` (498-508): rejects `> 103 bytes` (macOS `sun_path` is 104 with NUL terminator).
- **Counter-evidence sought:**
  - Does anything bypass `assertSocketDirOwnership` for the canonical path? Grep for `mkdirSync(${..., DEFAULT_MODEL_SERVER_SOCKET_DIR`, `unlinkSync(... DEFAULT_MODEL_SERVER_SOCKET_PATH`, `fs.writeFileSync(... /tmp/mk-hf-embed`, `chown`, `chmod` against `/tmp/mk-hf-embed` → no hits outside the assert+mkdir path. `unlinkModelServerSocket` (845-852) is preceded by `assertSocketDirOwnership` in the reclaim EADDRINUSE branch (1415-1416).
  - Is the path used without supervisorial involvement anywhere? No — `hfControl.resolveSocketPath` is the only route to `resolveModelServerSocketPath` outside the lib itself.
- **Alternative explanation:** The check is fail-closed against both symlink and uid-mismatch; the attack surface is genuinely limited to the residual race between `lstatSync` (returned ENOENT) and `mkdirSync` (attacker creates the dir in between). This TOCTOU window is microseconds and inside a single Node.js tick — no documented Node.js primitive lets a different local user reliably hit that window without a kernel-level timing channel. The implements-side `acquireRespawnLockFileAt` (717-787) uses `O_EXCL` for the analogous race on the lockfile, but the dir-assert path does not (intentional: the path is created by `mkdirSync` and the lock lives inside it).
- **Final severity:** **P2** (residual awareness only — the documented attack is the TOCTOU between lstat and mkdir; the macro-level attack is closed). Confidence: 0.85.
- **Downgrade trigger:** If a future change bypasses `assertSocketDirOwnership` for the canonical path (e.g., a new code path that uses `DEFAULT_MODEL_SERVER_SOCKET_PATH` without going through `prepareModelServerDemandTarget`), this becomes P1. The next reviewer should specifically confirm the traversal does not regress in iter 6 (traceability) and the `tools/lifecycle-tools.ts` review surface does not introduce a new direct socket binder.

### S-Q2 — REQ-010 `leaseId` token generator suitability

- **Claim:** `crypto.randomUUID()` is the appropriate token generator for the leaseId fencing use case (cryptographically unpredictable, no information leakage, no realistic collision risk).
- **Evidence (`mk-spec-memory-launcher.cjs:460`):** `leaseId: crypto.randomUUID()`. Per Node.js ≥14.17, `crypto.randomUUID()` returns an RFC 4122 v4 UUID built from `crypto.randomBytes(16)` (or platform `crypto.getRandomValues` on the worker side). 122 bits of randomness; no timestamp, no MAC, no PID components.
- **Counter-evidence sought:**
  - Is the seed CSPRNG? Yes — Node.js v8+ OpenSSL-backed `CSPRNG`. No deterministic-language fallback exists.
  - Is the token leaked anywhere? `leaseId` is written into the lease file (owner-only mode 0o600, `O_EXCL` via `writeOwnerLeaseFileExclusive` 442-451) and the heartbeat refresh page (562-579). It is NEVER logged, returned in stdout, returned in JSON-RPC error, or surfaced in any MCP tool response. Confirmed by `rg -n 'leaseId'`: all hits are local module-internal references.
  - Is there a collision risk? Birthday bound for 122 bits gives ~2^61 IDs before 50% collision probability. The launcher process restarts produce one leaseId per restart; in any realistic deployment (<<10^6 leases) the collision probability is negligible.
- **Alternative explanation:** A non-monotonic counter (e.g., `crypto.randomBytes(32)` base64) would be marginally stronger but functionally equivalent. An attacker who cannot predict or observe the leaseId in their own user space cannot exploit the fence.
- **Final severity:** **PASS** (no finding). Confidence: 0.95.
- **Downgrade trigger:** None applicable. The open P1-001 (leaseId checks do not fence heartbeat replacement or cleanup against a successor interleaving) is a separate token-USE finding, not a token-GENERATION finding, and remains open per iter 1.

### S-Q3 — REQ-009 `background: true` default attack surface

- **Claim:** Defaulting to `background: true` at the MCP tool dispatch boundary introduces unbounded background jobs and resource-exhaustion surface.
- **Evidence (`lifecycle-tools.ts:71`):** `return handleMemoryIndexScan(scanArgs.background === undefined ? { ...scanArgs, background: true } : scanArgs);` — strict omitted-only injection. Explicit `background: false` is preserved.
- **Counter-evidence sought:**
  - Does the surface allow unbounded enqueue? `handleMemoryIndexScan` (iter 4 confirmed) enqueues a per-spec-folder job; status/cancel tools (`memory_index_scan_status`, `memory_index_scan_cancel`) are the only throttle. A caller CAN repeatedly invoke `memory_index_scan` to enqueue many jobs.
  - Is there rate-limit / concurrency cap? The MCP server is a trusted in-process tool boundary; the index-scan job is processed by the existing async worker (iter 4 confirmed bounded producers: `startupScan`, `processFile`, file-watcher, `handleMemoryIndexScan`). Each spec-folder has at most one in-flight scan path; the iter-4 review concluded the default cannot wedge existing internal callers.
  - Does the default change the threat model? No — without the default, callers already could pass `background: true` explicitly. The default is a behavioral convenience, not a privilege escalation.
- **Alternative explanation:** This is a quality-of-service / DoS concern, not a security vulnerability. The MCP tool is generally available to the calling agent; the iter-4 review surface already passed the bound check. The new default does not expand the trust boundary.
- **Final severity:** **PASS** (no finding). Confidence: 0.85.
- **Downgrade trigger:** If a future change adds a no-rate-limit `memory_index_scan` enqueue that bypasses the job-queue, this becomes P2 (DoS amplification). The iter-6 traceability check should confirm the background-mode inject does not regress at the dispatch boundary.

### S-Q4 — Process-spawn sweep: fixed command + arg array, no shell-string concat

- **Claim:** Every process-spawning call site uses a fixed command name + argument array (no shell-string interpolation, no user-controlled command).
- **Evidence (rg sweep across 16 files):**
  - `mk-spec-memory-launcher.cjs:483` — `spawnSync('ps', ['-o', 'ppid=', '-p', String(pid)], { ... })` — fixed command, pid is locally derived (lease file we previously wrote, JSON-parsed, integer-validated). No shell expansion.
  - `mk-spec-memory-launcher.cjs:1153` `run(command, args, options)` — only callers are `buildIfNeeded` (1222-1224) with hardcoded `'npm'` + literal arg arrays. No user input.
  - `mk-spec-memory-launcher.cjs:1516` — `spawn(process.execPath, [...nodeArgs, server], { ... })` — `process.execPath` is system constant; `nodeArgs` is a parsed integer from `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` (line 1232-1248) with `parseInt` + `Number.isFinite` + `> 0` validation; `server` is a constant local path. No shell interpolation.
  - `mk-skill-advisor-launcher.cjs:464` — `spawnSync('ps', ['-p', String(pid), '-o', 'comm='], { ... })` — same pattern, leased pid.
  - `mk-skill-advisor-launcher.cjs:532` — `spawnSync('ps', ['-o', 'ppid=', '-p', String(pid)], { ... })` — same.
  - `mk-skill-advisor-launcher.cjs:1089` `run(command, args, options)` — only callers are `buildIfNeeded` (1175-1176) with `'npm'`.
  - `mk-skill-advisor-launcher.cjs:1276` — `spawn(process.execPath, [server], { ... })` — fixed command, local path.
  - `model-server-supervision.cjs:124` — `spawnSync('ps', ['-eo', 'pid=,ppid=,rss='], { ... })` — fixed.
  - `model-server-supervision.cjs:948` — `spawnFn(process.execPath, [modelServerPath], { ... })` — fixed command, `modelServerPath` is a constant local path derived from `defaultOpencodeDir`.
- **Counter-evidence sought:**
  - Are there any `exec(...)` calls? `rg -n 'exec\('` returns only regex-test patterns (`tool-schemas.ts:82`: `definition.description.match(...)` for parsing, not process execution) and one `database.exec(...)` (`memory-index.ts:368`: `database.exec('CREATE TABLE IF NOT EXISTS config ...')` — sqlite prepared exec, fixed string, no user input).
  - Are there any `eval(...)` calls? `rg -n 'eval\('` returns no hits in the 16 files.
  - Are there any shell invocations (`sh -c`, `bash -c`)? None.
- **Alternative explanation:** N/A — the spawn pattern is uniformly `spawnSync(SPAWN, [ARGS], { ... })` with `shell: false` (default for spawnSync). No command string is ever constructed by concatenation.
- **Final severity:** **PASS** (no finding). Confidence: 0.95.
- **Downgrade trigger:** None applicable.

### S-Q5 — Secrets / hardcoded credentials

- **Claim:** No hardcoded tokens, API keys, or credentials were introduced in any of the 16 files.
- **Evidence (rg sweep):**
  - `memory-save.ts:1282` — `const apiKey = process.env.LLM_REFORMULATION_API_KEY?.trim() ?? '';` — user-supplied env var, not embedded.
  - `memory-save.ts:1293` — `Authorization: Bearer ${apiKey}` — used only when the env var is set; flows to the LLM provider HTTPS endpoint.
  - `context-server.ts:195-246` — `ApiKeyValidation` interface + `API_KEY_VALIDATION_TIMEOUT_MS = 5_000` constant; references `validateApiKey` test mocks only.
  - `memory-save.ts:30` — `import { scrubSecretsDetailed } from '../lib/parsing/secret-scrubber.js';` — actively REDACTS secrets before durable save (security feature, not a leak).
  - `mk-skill-advisor-launcher.cjs:99-155` — `CHILD_ENV_ALLOWLIST` enforces a minimal whitelist of env vars passed to the child process; everything else is filtered. This is a security control.
- **Counter-evidence sought:**
  - Are there any `sk-...`, `ghp_...`, `Bearer xxxxx`, `aws_*`, fixed 32-char hex tokens? rg sweep for these patterns returns no hits across the 16 files.
  - Are lease files (which contain pids and leaseIds) treated as secrets? No — lease files are stored with `mode: 0o600` in the user's DB dir, never logged, never committed to the repo (.gitignored as `.maintenance-active.json` etc.).
- **Alternative explanation:** None.
- **Final severity:** **PASS** (no finding). Confidence: 0.95.
- **Downgrade trigger:** None applicable.

---

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | passed | REQ-009/010/011 spec/content matches code per-file evidence cited above. |
| `checklist_evidence` | core | passed | No new CHK items in this iteration; existing CHK-073, CHK-074, CHK-075 evidence was verified in iter 1-4. The security dimension does not have dedicated CHK items in the original checklist; flagging for iter 6 to consider whether CHK-079 (final acceptance) should be reviewed with a security lens. |
| `skill_agent` | overlay | notApplicable | Not a skill-authoring change. |
| `agent_cross_runtime` | overlay | notApplicable | Not an agent-definition change. |
| `feature_catalog_code` | overlay | notApplicable | Not a feature-catalog change. |
| `playbook_capability` | overlay | notApplicable | Not a playbook change. |

---

## SCOPE VIOLATIONS

None. All reads stayed within the 16-file scope; no writes outside the four allowed paths.

---

## Verdict

**PASS** — security dimension clear across the 16-file scope. Cumulative sentinel ledger unchanged: P0=0, P1=1 (P1-001 from iter 1, lease-USE not lease-GENERATION), P2=0. The five security focal questions are answered with file:line evidence and explicit counter-evidence searches.

All five claims adjudicated at the surface; the open residuals (TOCTOU on `/tmp/mk-hf-embed` lstat-vs-mkdir) are documented as P2 awareness without a concrete exploitable path on a single-process Node.js launcher.

---

## Next Dimension

Per strategy.md §12, the next iteration moves to **TRACEABILITY** (iter 6): cross-check every REQ-006..011 in `spec.md` against its corresponding implementation site + checklist evidence row + test. Verify the `_memory.continuity` frontmatter blocks across spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md are internally consistent and not contradictory. Specifically:

1. REQ-006 — `persistQualityLoopContent` origin-gating in `memory-save.ts` ↔ CHECK-06X row ↔ `handler-memory-index.vitest.ts` test.
2. REQ-007 — warm-owner probe collapse in `launcher-ipc-bridge.cjs` / `launcher-session-proxy.cjs` ↔ CHK-070/071 ↔ `launcher-ipc-bridge-probe.vitest.ts` / `launcher-session-proxy.vitest.ts`.
3. REQ-008 — `fromScan: true` in `processFile` callback ↔ CHK-072 ↔ `context-server.vitest.ts` async-ingest test.
4. REQ-009 — `background: true` default at `lifecycle-tools.ts:71` ↔ CHK-073 ↔ `lifecycle-tools-scan-default.vitest.ts`.
5. REQ-010 — `leaseId` fencing in `mk-spec-memory-launcher.cjs` ↔ CHK-074 ↔ `launcher-spec-memory-lifecycle.vitest.ts` (note: P1-001 remains open).
6. REQ-011 — `DEFAULT_MODEL_SERVER_SOCKET_DIR` short canonical path ↔ CHK-075 ↔ `launcher-model-server-cross-launcher.vitest.ts`.

The CHK-079 final acceptance row should also be reviewed under the traceability lens.
