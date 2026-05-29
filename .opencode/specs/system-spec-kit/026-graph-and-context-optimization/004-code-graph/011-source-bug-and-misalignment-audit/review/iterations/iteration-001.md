### DR-001-01 [P1] [correctness] `code_graph_status` can still throw before its degraded fallback

file: `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:204`

evidence:

```ts
204:   const snapshot = getGraphReadinessSnapshot(process.cwd());
205:   const freshness = snapshot.freshness;
206:   const storedScope = graphDb.getStoredCodeGraphScope();
207:   const activeScopePolicy = parseIndexScopePolicyFromFingerprint(storedScope) ?? resolveIndexScopePolicy();
208:   const scopeMismatch = storedScope.fingerprint !== activeScopePolicy.fingerprint;
```

```ts
215:   try {
216:     stats = graphDb.getStats();
217:   } catch (err: unknown) {
```

```ts
345: export function getStoredCodeGraphScope(): StoredCodeGraphScope {
346:   const fingerprint = getMetadata(CODE_GRAPH_SCOPE_FINGERPRINT_KEY);
347:   const label = getMetadata(CODE_GRAPH_SCOPE_LABEL_KEY);
348:   const source = getMetadata(CODE_GRAPH_SCOPE_SOURCE_KEY);
```

why: The status handler's degraded envelope only catches `getStats()` and later status-path failures, but `getStoredCodeGraphScope()` is a DB metadata read that runs before either catch block. If the DB is locked, corrupt, or otherwise unavailable, `getMetadata()` can throw before the handler reaches the intended `stats_unavailable` response, so `code_graph_status` can reject instead of returning the promised readiness snapshot.

fix: Move the stored-scope read into the protected status try/catch, or wrap it separately with a safe default stored-scope object so all DB read failures still return the degraded readiness payload.

confidence: 0.91

### DR-001-02 [P1] [correctness] Migration-back copies a live legacy DB before checking the legacy lease

file: `.opencode/bin/mk-code-index-launcher.cjs:787`

evidence:

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

```js
811:     const strictSingleWriter = !isStrictModeDisabled(process.env.MK_CODE_INDEX_STRICT_SINGLE_WRITER);
812:     if (strictSingleWriter) {
813:       const ownerLeaseResult = acquireOwnerLeaseFile();
```

why: The launcher copies `code-graph.sqlite` and WAL/SHM files from the former shared location before it checks whether a live legacy launcher owns that old location. A live old daemon can still be writing the SQLite triplet while the new launcher copies it, and the new skill-local DB can become a stale or inconsistent snapshot that will be used after the old owner exits.

fix: Check the legacy PID/owner lease before migration and refuse/bridge when it is live. Only migrate after the legacy owner is stopped or proven dead, preferably via SQLite backup/checkpoint semantics instead of raw copying a possibly live WAL database.

confidence: 0.87

### DR-001-03 [P1] [correctness] `releaseOwnerLease` can delete a successor lease after reclaim

file: `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:451`

evidence:

```ts
451: export function releaseOwnerLease(dbDir: string, ownerPid: number): boolean {
452:   const canonicalDbDir = resolveCanonicalDbDir(dbDir);
453:   const leasePath = ownerLeasePath(canonicalDbDir);
454:   const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
455:   if (!holder || holder.ownerPid !== ownerPid) return false;
```

```ts
457:   unlinkSync(leasePath);
458:   return true;
```

why: The CAS/TOCTOU remediation added a mutation lock around stale-owner reclaim and refresh, but release still performs an unlocked read-then-unlink. A stale owner that reads its own lease can race with another process reclaiming and writing a successor lease, then unlink the successor lease without revalidating under the same mutation lock. That leaves the active owner without a lease and allows later launchers to create split-brain ownership.

fix: Use the same owner-lease mutation lock in `releaseOwnerLease`, re-read the lease while holding it, and only unlink if the current lease still belongs to the releasing owner, ideally comparing the full lease identity or at least owner PID plus start timestamp.

confidence: 0.78

### DR-001-04 [P2] [correctness] Database path policy still says the latest migration is skill-local to shared

file: `.opencode/skills/system-code-graph/references/config/database_path_policy.md:109`

evidence:

```md
109: The code graph database has moved twice:
110: 
111: 1. **Pre-extraction → skill-local (packet 013).** `system-spec-kit/mcp_server/database/` → `system-code-graph/mcp_server/database/`. Established skill-local DB ownership per ADR-002.
112: 2. **Skill-local → shared spec-kit data dir (packet 019/020 + cross-runtime consolidation).** `system-code-graph/mcp_server/database/` → `.opencode/.spec-kit/code-graph/database/`. The launcher auto-migrates legacy installs on first startup: the SQLite triplet, readiness marker, and launcher state file are **copied** (not moved) so the prior location is preserved as a backup. Configs that still reference the `system_code_graph` MCP server name should be renamed to `mk_code_index`.
```

why: The top of the same policy now declares the current default as skill-local, and the launcher migrates from `.opencode/.spec-kit/code-graph/database/` back to `system-code-graph/mcp_server/database/`. The migration notes still present the opposite direction as the latest state, so operators following the policy get a contradictory migration contract.

fix: Update the migration notes to include the third reversal, mark `.opencode/.spec-kit/code-graph/database/` as the former shared location, and describe the current migration-back behavior consistently with the launcher.

confidence: 0.96

newFindings: 4, dimension: correctness
