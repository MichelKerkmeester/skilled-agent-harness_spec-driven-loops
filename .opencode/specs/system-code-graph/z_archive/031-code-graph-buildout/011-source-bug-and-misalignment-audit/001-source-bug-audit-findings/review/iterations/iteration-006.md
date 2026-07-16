### DR-006-01 [P1] [correctness] CG-013 is still real for direct non-root server starts: marker path follows CWD while the DB path follows the module tree

file: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:22`

evidence:

```ts
20: // 011/002-deferred — because importing core/config here runs resolveCanonicalDbDir at module load
21: // and breaks tests that mock node:fs without realpathSync.native.
22: export const CODE_GRAPH_READINESS_MARKER_BASE_DIR = resolve(
23:   process.cwd(),
24:   process.env.SPECKIT_CODE_GRAPH_DB_DIR || '.opencode/skills/system-code-graph/mcp_server/database',
25: );
```

```ts
20: const defaultDir = resolve(resolveWorkspaceRoot(), '.opencode/skills/system-code-graph/mcp_server/database');
...
47: export const DATABASE_DIR = resolveCanonicalDbDir(envDir ?? defaultDir, resolveWorkspaceRoot());
```

```ts
129: try {
130:   writeCodeGraphReadinessMarker(process.env.MK_CODE_INDEX_ROOT_DIR || process.cwd());
```

why: The DB default is anchored to the `.opencode` segment in `core/config.ts`, so it resolves to the workspace skill-local database even when the process CWD is elsewhere. The readiness marker default is still `process.cwd()` plus the same relative suffix. If the MCP server is started directly from a subdirectory, or by any non-launcher runtime that does not set `SPECKIT_CODE_GRAPH_DB_DIR`, the server reads/writes `code-graph.sqlite` under the real workspace skill directory but publishes `.code-graph-readiness.json` under `<cwd>/.opencode/skills/system-code-graph/mcp_server/database`. Normal `mk-code-index-launcher.cjs` starts are mostly protected because the launcher uses `cwd: root` and injects `SPECKIT_CODE_GRAPH_DB_DIR`, but the code path itself still has the split-brain trigger CG-013 described.

fix: Make the marker use the same resolver as `DATABASE_DIR` without introducing the current test-order problem. A small pure resolver shared by `core/config.ts` and `readiness-marker.ts`, with filesystem-touching canonicalization kept out of marker module load, would remove the CWD dependency.

confidence: 0.96

### DR-006-02 [P1] [correctness] Migration-back ignores `SPECKIT_CODE_GRAPH_DB_DIR`, so override runs can still mutate and seed the default skill-local DB

file: `.opencode/bin/mk-code-index-launcher.cjs:787`

evidence:

```js
205: function resolvedDbDir() {
206:   const candidate = process.env.SPECKIT_CODE_GRAPH_DB_DIR ?? dbDir;
207:   assertPathWithinRoot(candidate, 'SPECKIT_CODE_GRAPH_DB_DIR');
208:   if (fs.existsSync(candidate)) assertPathWithinRoot(candidate, 'SPECKIT_CODE_GRAPH_DB_DIR', true);
209:   return canonicalizePath(candidate);
```

```js
704:   // Set DB dir for the child process (operator-set env var wins).
705:   if (!process.env.SPECKIT_CODE_GRAPH_DB_DIR) {
706:     process.env.SPECKIT_CODE_GRAPH_DB_DIR = resolvedDbDir();
707:   }
```

```js
787:     // Auto-migrate DB from the former shared standalone location back to skill-local.
788:     // The former DB is preserved as a backup (copy, not move).
789:     const formerSharedDbDir = path.join(opencodeDir, '.spec-kit', 'code-graph', 'database');
790:     if (!exists(path.join(dbDir, 'code-graph.sqlite')) && exists(path.join(formerSharedDbDir, 'code-graph.sqlite'))) {
```

```js
799:       for (const file of dbFiles) {
800:         const src = path.join(formerSharedDbDir, file);
801:         const dst = path.join(dbDir, file);
802:         if (exists(src)) {
803:           fs.copyFileSync(src, dst);
```

why: The launcher correctly treats `SPECKIT_CODE_GRAPH_DB_DIR` as the effective DB directory for leases and the child process, but the migration-back block is hard-coded to copy `.opencode/.spec-kit/code-graph/database` into `dbDir`, the default skill-local directory. A test, CI job, or operator run with `SPECKIT_CODE_GRAPH_DB_DIR` set can therefore still create or refresh the production default skill-local database before the child starts against the override. Because the legacy source is intentionally preserved, deleting the default skill-local sqlite later also re-arms the same legacy copy as a migration source, so a reset can resurrect stale legacy state instead of producing a clean first scan.

fix: Resolve the migration target from the same effective DB directory used by `resolvedDbDir()`, or skip legacy migration entirely when `SPECKIT_CODE_GRAPH_DB_DIR` is explicitly set. After a successful default-path migration, quarantine/rename the former shared directory or write a one-shot migration marker so deleting the new DB does not silently re-import the preserved legacy copy.

confidence: 0.90

## Relocation Checks Without New DR Findings

- Remaining `.opencode/.spec-kit` creation paths: I found no current code path in `system-code-graph` that creates the former shared directory. The remaining launcher references treat it as a source/probe only: `legacyLeasePaths()` returns `.opencode/.spec-kit/.../.mk-code-index-launcher.json`, and the migration block only copies when `exists(path.join(formerSharedDbDir, 'code-graph.sqlite'))` is already true.
- Root `.gitignore` covers the active runtime artifacts: `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite*`, `.code-graph-*`, and `.mk-code-index-launcher.*` cover sqlite, WAL/SHM, readiness, owner lease, PID file, and lockdir. The patterns do not ignore `database/vectors/README.md`; `git check-ignore` returned matches for the runtime artifacts and no match for that tracked vectors doc. The standalone skill `.gitignore` gap is still the prior DR-003-03, not a new finding.
- Fresh-clone first scan points at skill-local: with no override, the launcher sets `SPECKIT_CODE_GRAPH_DB_DIR = resolvedDbDir()` and spawns the server with `cwd: root`; `core/config.ts` defaults `DATABASE_DIR` to `.opencode/skills/system-code-graph/mcp_server/database`; `code-graph-db.ts` opens `join(dbDir, 'code-graph.sqlite')`. That confirms first creation is skill-local when no legacy `.spec-kit` sqlite exists.

newFindings: 2, dimension: correctness
