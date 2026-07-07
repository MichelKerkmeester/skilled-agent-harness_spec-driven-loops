### DR-003-01 [P1] [security] Legacy PID lease can bridge MCP traffic to a spoofed `/tmp` socket

file: `.opencode/bin/mk-code-index-launcher.cjs:411`

evidence:

```js
411: function leaseHeldFromFile(filePath, legacyPath = null) {
412:   const lease = readLeaseFile(filePath);
413:   if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath };
414:   const startedAt = lease.startedAt ?? new Date(0).toISOString();
```

```js
415:   try {
416:     process.kill(lease.pid, 0);
417:     return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };
418:   } catch (error) {
```

```js
430:   for (const legacyPath of legacyLeasePaths()) {
431:     if (legacyPath === leasePath()) continue;
432:     const legacy = leaseHeldFromFile(legacyPath, legacyPath);
433:     if (legacy.held || legacy.staleReclaimable) return legacy;
```

```json
68:       "environment": {
69:         "SPECKIT_IPC_SOCKET_DIR": "/tmp/mk-code-index",
70:         "_NOTE_1_DB": "Database lives SKILL-LOCAL at .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite by default (shared across runtimes via the .opencode/skills symlink); SPECKIT_CODE_GRAPH_DB_DIR overrides. Former shared location (.opencode/.spec-kit/code-graph/database/) is migrated back on first launcher startup.",
```

```js
281:   const socketPath = getIpcSocketPath(serviceName, { dbDir });
282:   if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
283:     writeLeaseHeld(' (no-bridge-socket)');
284:     return { action: 'report', reason: 'no-bridge-socket', socketPath };
285:   }
```

```js
287:   const probe = await probeDaemon(socketPath, { timeoutMs: probeTimeoutMs, connect });
288:   if (probe.status !== 'alive') {
289:     process.stderr.write(`[${loggerPrefix}] lease holder pid=${ownerPid} socket=${socketPath} failed liveness probe: ${probe.reason}\n`);
290:     return { action: 'respawn', reason: probe.reason, socketPath };
```

```js
293:   process.stderr.write(`[${loggerPrefix}] bridging to lease holder pid=${ownerPid} socket=${socketPath}\n`);
294:   const bridgeToSocket = bridge ?? bridgeStdioToSocket;
```

why: The new legacy probe accepts any live PID in the former `.opencode/.spec-kit/code-graph/database/.mk-code-index-launcher.json` file as a held lease. The bridge then connects to the configured `/tmp/mk-code-index/daemon-ipc.sock` if it answers the JSON-RPC liveness probe, but it never proves that the socket belongs to the PID named by the legacy lease or to the canonical DB owner. A stale or malicious legacy PID file naming any live process, plus an attacker-controlled local socket at the committed `/tmp` path, can make a new launcher pipe MCP stdio to the wrong daemon. This is distinct from DR-002-02: that finding covers missing legacy owner-lease checks for split-brain migration; this one covers a spoofable lease-to-socket binding on the bridge path.

fix: Do not bridge from a legacy PID file alone. Require a live legacy owner lease with matching canonical DB identity, or verify socket ownership/peer credentials against the recorded owner PID before bridging. At minimum, treat legacy PID-only hits as report-only and force a fresh primary owner acquisition instead of piping client traffic.

confidence: 0.86

### DR-003-02 [P1] [security] DB dir guard can create outside-workspace directories before rejecting a symlink escape

file: `.opencode/skills/system-code-graph/mcp_server/lib/canonical-db-dir.ts:25`

evidence:

```ts
25:       const resolvedWorkspace = resolve(workspaceRoot);
26:       if (!isWithinWorkspace(resolvedWorkspace, resolvedDir)) {
27:         throw new CanonicalDbDirError(
28:           `Code graph DB directory must stay within the workspace root: ${resolvedWorkspace}`,
29:           'OUTSIDE_WORKSPACE',
30:         );
```

```ts
32:       canonicalWorkspace = realpathSync.native(resolvedWorkspace);
33:     }
34:     mkdirSync(resolvedDir, { recursive: true, mode: 0o700 });
35:     const canonicalDir = realpathSync.native(resolvedDir);
36:     if (canonicalWorkspace && !isWithinWorkspace(canonicalWorkspace, canonicalDir)) {
```

why: The pre-check is lexical (`resolve(...)` + `isWithinWorkspace(...)`) and happens before existing path components are canonicalized. If an in-workspace parent component is a symlink to an outside directory, a caller can provide an apparently in-workspace DB override such as `<workspace>/link/db`; line 34 follows the symlink and creates the outside `db` directory, and only then does line 35/36 discover the escape and throw. The DB file is not opened after the throw, but the standalone-storage guard still performs an outside-workspace filesystem mutation before rejecting the path.

fix: Canonicalize the deepest existing prefix before `mkdirSync`, as the launcher already does with `canonicalizeExistingPrefix`, and reject if that prefix resolves outside the workspace. Only create the missing DB directory after the canonical prefix is proven workspace-contained.

confidence: 0.84

### DR-003-03 [P2] [security] Skill-local ignore rules do not protect the primary DB or lease artifacts during standalone skill syncs

file: `.opencode/skills/system-code-graph/.gitignore:5`

evidence:

```md
91: This reverses ADR-002/004/005's consolidation-to-`.spec-kit` decision. **Trade-off:** because the
92: DB now lives inside the (committed, symlinked) skill folder, skill re-sync / reinstall flows must
93: treat `mcp_server/database/` runtime artifacts as gitignored, regenerable state and never overwrite
94: a live DB; the `.gitignore` rules and the launcher migration-back handle this. The SQLite file
95: remains the coordination boundary between in-process imports and MCP tool callers (via `mk_code_index`).
```

```gitignore
111: # Skill-local code-graph DB runtime state (DB relocated here 2026-05-29; keep tracked docs like vectors/README.md)
112: .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite*
113: .opencode/skills/system-code-graph/mcp_server/database/.code-graph-*
114: .opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.*
```

```gitignore
1: node_modules/
2: dist/
3: *.log
4: .deep-research.lock
5: mcp_server/database/*.sqlite-wal
6: mcp_server/database/*.sqlite-shm
```

why: The repository root `.gitignore` does exclude the active DB triplet, readiness marker, owner lease, and launcher files. The skill's own `.gitignore`, however, only ignores the WAL and SHM sidecars. That leaves `mcp_server/database/code-graph.sqlite`, `.code-graph-*`, and `.mk-code-index-launcher.*` unprotected when the skill directory is synced, packaged, or reinstalled as a standalone unit using its local ignore file. Because the DB now sits inside the committed/symlinked skill tree, that gap can leak or clobber live runtime state outside this monorepo's root-ignore context.

fix: Mirror the root runtime-state ignore rules in `.opencode/skills/system-code-graph/.gitignore` while keeping intentional tracked docs/vectors explicitly unignored if needed. Also make reinstall/sync tooling preserve existing `mcp_server/database/` runtime files rather than replacing the directory wholesale.

confidence: 0.80

newFindings: 3, dimension: security
