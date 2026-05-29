### DR-009-01 [CONFIRMED-REAL] DR-002-01 — P1 correctness / `.opencode/bin/mk-code-index-launcher.cjs:347` / launcher CAS bypass remains

evidence:

```js
347: function acquireOwnerLeaseFile() {
348:   const currentOwnerLeasePath = ownerLeasePath();
349:   const existing = readOwnerLeaseFile(currentOwnerLeasePath);
350: 
351:   if (existing) {
```

```js
373:   writeOwnerLeaseFile(lease);
374:   ownerLeasePid = process.pid;
375:   return { acquired: true, lease, reclaimed: existing };
```

why: Confirmed. The stale-existing path still writes the replacement owner lease by pathname with no mutation lock, no re-read, and no identity compare. The TypeScript `owner-lease.ts` CAS remediation does not protect this launcher-local implementation, so the claimed CG-016/017 protection is bypassed on the actual startup path.

fix: Remove the duplicate launcher owner-lease implementation or route it through the same locked CAS/identity-compare primitive as `mcp_server/lib/owner-lease.ts`.

confidence: 0.90

### DR-009-02 [CONFIRMED-REAL] DR-002-02 — P1 correctness / `.opencode/bin/mk-code-index-launcher.cjs:220` / legacy owner leases are not probed

evidence:

```js
224:   return [
225:     path.join(opencodeDir, '.spec-kit', 'code-graph', 'database', PID_FILE_NAME),
226:     path.join(opencodeDir, 'skill', 'system-code-graph', 'mcp_server', 'database', PID_FILE_NAME),
227:   ].map(canonicalizePath);
```

```js
792:       const dbFiles = [
793:         'code-graph.sqlite',
794:         'code-graph.sqlite-shm',
795:         'code-graph.sqlite-wal',
796:         '.code-graph-readiness.json',
797:         '.mk-code-index-launcher.json',
```

why: Confirmed. The relocation compatibility path only enumerates legacy PID lease files and the migration copy list still omits `.code-graph-owner.json`. A live old-location owner lease can therefore be invisible to the new primary launcher before migration-back and primary acquisition.

fix: Add legacy owner-lease probing for former shared locations before migration or bridging, and include owner-lease state in the live-owner decision rather than treating PID leases as sufficient.

confidence: 0.88

### DR-009-03 [CONFIRMED-REAL] DR-002-03 — P1 correctness / `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:122` / mutation-lock stale cleanup can unlink successor

evidence:

```ts
122:       const lockPid = readOwnerLeaseMutationLockPid(lockPath);
123:       if (attempt === 0 && lockPid !== null && getProcessLiveness(lockPid) === 'dead') {
124:         try {
125:           unlinkSync(lockPath);
126:           continue;
```

why: Confirmed. The newly added mutation lock uses exclusive create for acquisition, but stale-lock recovery deletes the path after only reading a PID. If another process replaces the stale lock between the read and `unlinkSync`, this code can remove the successor's live lock and admit concurrent lease mutation.

fix: Store and compare a lock nonce/token before unlink, or use a lock-directory protocol with identity-checked stale reclaim and identity-checked release.

confidence: 0.86

### DR-009-04 [CONFIRMED-REAL] DR-003-01 — P1 security / `.opencode/bin/mk-code-index-launcher.cjs:411` / PID-only legacy bridge can target spoofed socket

evidence:

```js
411: function leaseHeldFromFile(filePath, legacyPath = null) {
412:   const lease = readLeaseFile(filePath);
413:   if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath };
414:   const startedAt = lease.startedAt ?? new Date(0).toISOString();
415:   try {
416:     process.kill(lease.pid, 0);
```

```js
281:   const socketPath = getIpcSocketPath(serviceName, { dbDir });
282:   if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
283:     writeLeaseHeld(' (no-bridge-socket)');
284:     return { action: 'report', reason: 'no-bridge-socket', socketPath };
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

why: Confirmed. A legacy PID lease proves only that some PID is live. The bridge then probes the configured socket and pipes stdio to it without proving the socket belongs to that PID or the canonical owner lease. With the committed `/tmp/mk-code-index` socket directory, this remains a real spoofing gap.

fix: Do not bridge from a legacy PID lease alone. Require a matching owner lease or verify Unix peer credentials/socket ownership against the recorded owner identity.

confidence: 0.85

### DR-009-05 [PRE-EXISTING] DR-003-02 — P1 security / `.opencode/skills/system-code-graph/mcp_server/lib/canonical-db-dir.ts:25` / real symlink escape mutation, not session-owned

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

why: Real but pre-existing. The lexical workspace check still happens before `mkdirSync`, so an in-workspace symlink parent can cause an outside-workspace directory creation before the canonical rejection. However `canonical-db-dir.ts` is unchanged from baseline `0ef38d58`, so this is not introduced by the reviewed session.

fix: Canonicalize the deepest existing prefix before creating missing path segments, then reject outside-workspace prefixes before `mkdirSync`.

confidence: 0.84

### DR-009-06 [PRE-EXISTING] DR-001-01 — P1 correctness / `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:204` / fallback can still be bypassed by stored-scope read

evidence:

```ts
204:   const snapshot = getGraphReadinessSnapshot(process.cwd());
205:   const freshness = snapshot.freshness;
206:   const storedScope = graphDb.getStoredCodeGraphScope();
207:   const activeScopePolicy = parseIndexScopePolicyFromFingerprint(storedScope) ?? resolveIndexScopePolicy();
```

```ts
345: export function getStoredCodeGraphScope(): StoredCodeGraphScope {
346:   const fingerprint = getMetadata(CODE_GRAPH_SCOPE_FINGERPRINT_KEY);
347:   const label = getMetadata(CODE_GRAPH_SCOPE_LABEL_KEY);
348:   const source = getMetadata(CODE_GRAPH_SCOPE_SOURCE_KEY);
```

why: Real but pre-existing. `getStoredCodeGraphScope()` can hit the DB before the `getStats()` degraded fallback begins. The reviewed diff only removed the readiness-marker write from status; this stored-scope read was already before the stats catch at baseline, so the crash gap is not session-introduced.

fix: Move stored-scope retrieval into the degraded envelope or make it best-effort with safe null scope fields when DB metadata reads fail.

confidence: 0.88

### DR-009-07 [CONFIRMED-REAL] DR-001-02 — P1 correctness / `.opencode/bin/mk-code-index-launcher.cjs:787` / migration-back copies before lease checks

evidence:

```js
787:     // Auto-migrate DB from the former shared standalone location back to skill-local.
788:     // The former DB is preserved as a backup (copy, not move).
789:     const formerSharedDbDir = path.join(opencodeDir, '.spec-kit', 'code-graph', 'database');
790:     if (!exists(path.join(dbDir, 'code-graph.sqlite')) && exists(path.join(formerSharedDbDir, 'code-graph.sqlite'))) {
```

```js
811:     const strictSingleWriter = !isStrictModeDisabled(process.env.MK_CODE_INDEX_STRICT_SINGLE_WRITER);
812:     if (strictSingleWriter) {
813:       const ownerLeaseResult = acquireOwnerLeaseFile();
```

why: Confirmed. The session's migration-back reversal copies the former shared SQLite triplet before owner-lease and PID-lease checks. A live old-location writer can still be writing the source triplet while the new launcher copies it into the skill-local primary path.

fix: Probe legacy PID and owner leases before copying, and migrate only after the legacy owner is absent or safely stopped. Prefer SQLite backup/checkpoint semantics over raw WAL triplet copying.

confidence: 0.87

### DR-009-08 [PRE-EXISTING] DR-001-03 — P1 correctness / `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:451` / release race remains, but predates baseline

evidence:

```ts
452:   const canonicalDbDir = resolveCanonicalDbDir(dbDir);
453:   const leasePath = ownerLeasePath(canonicalDbDir);
454:   const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
455:   if (!holder || holder.ownerPid !== ownerPid) return false;
456: 
457:   unlinkSync(leasePath);
```

why: Real but pre-existing. `releaseOwnerLease()` still does an unlocked read-then-unlink and can delete a successor lease after a race. The function body is unchanged from baseline; the session added locks to acquire/refresh but did not change release.

fix: Put release under the same mutation lock and re-read/compare full lease identity before unlinking.

confidence: 0.82

### DR-009-09 [PRE-EXISTING] DR-006-01 — P1 correctness / `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:22` / CG-013 still stands as deferred cwd divergence

evidence:

```ts
22: export const CODE_GRAPH_READINESS_MARKER_BASE_DIR = resolve(
23:   process.cwd(),
24:   process.env.SPECKIT_CODE_GRAPH_DB_DIR || '.opencode/skills/system-code-graph/mcp_server/database',
25: );
```

```ts
20: const defaultDir = resolve(resolveWorkspaceRoot(), '.opencode/skills/system-code-graph/mcp_server/database');
```

```ts
47: export const DATABASE_DIR = resolveCanonicalDbDir(envDir ?? defaultDir, resolveWorkspaceRoot());
48: 
49: if (!existsSync(DATABASE_DIR)) {
50:   mkdirSync(DATABASE_DIR, { recursive: true });
```

why: Real but pre-existing/deferred. The marker default is still import-time `process.cwd()` while `DATABASE_DIR` is module-root anchored. The concrete suffix changed during relocation, but the cwd-vs-module-root divergence already existed at baseline and is explicitly marked CG-013 deferred.

fix: Share a side-effect-light DB-dir resolver between config and readiness marker, or pass the resolved marker base from server bootstrap after DB config is resolved.

confidence: 0.94

### DR-009-10 [CONFIRMED-REAL] DR-006-02 — P1 correctness / `.opencode/bin/mk-code-index-launcher.cjs:787` / migration-back ignores override target

evidence:

```js
205: function resolvedDbDir() {
206:   const candidate = process.env.SPECKIT_CODE_GRAPH_DB_DIR ?? dbDir;
207:   assertPathWithinRoot(candidate, 'SPECKIT_CODE_GRAPH_DB_DIR');
```

```js
789:     const formerSharedDbDir = path.join(opencodeDir, '.spec-kit', 'code-graph', 'database');
790:     if (!exists(path.join(dbDir, 'code-graph.sqlite')) && exists(path.join(formerSharedDbDir, 'code-graph.sqlite'))) {
791:       fs.mkdirSync(dbDir, { recursive: true, mode: 0o700 });
```

```js
799:       for (const file of dbFiles) {
800:         const src = path.join(formerSharedDbDir, file);
801:         const dst = path.join(dbDir, file);
```

why: Confirmed. The child process and lease helpers honor `SPECKIT_CODE_GRAPH_DB_DIR` through `resolvedDbDir()`, but the migration-back block still targets the default `dbDir`. An override run can therefore seed or refresh the production skill-local DB before launching against the override.

fix: Use the effective resolved DB directory for migration, or skip legacy migration whenever `SPECKIT_CODE_GRAPH_DB_DIR` is explicitly set.

confidence: 0.90

### DR-009-11 [CONFIRMED-REAL] DR-007-01 — P2 traceability / `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:200` / CG-002 is partial, severity downgraded

evidence:

```ts
203:  * Previously this only checked tool existence and object-shape, so the
204:  * advertised `additionalProperties:false`, `enum`, and `minLength` constraints
205:  * were never enforced and malformed calls reached handlers. We now enforce the
206:  * unambiguous constraints: unknown-key rejection, enum membership, and string
207:  * minLength. Required-field presence is enforced at the dispatcher
208:  * (`getMissingRequiredStringArgs`); numeric range is intentionally left to the
```

```ts
240:   for (const [key, value] of Object.entries(rawInput)) {
241:     const prop = properties[key];
242:     if (!prop || value === undefined || value === null) {
243:       continue;
244:     }
245:     const enumValues = prop.enum as unknown[] | undefined;
```

```ts
251:     const minLength = prop.minLength as number | undefined;
252:     if (typeof minLength === 'number' && typeof value === 'string' && value.length < minLength) {
253:       throw new Error(
254:         `Invalid arguments for ${toolName}: field '${key}' must be at least ${minLength} character(s)`,
255:       );
```

why: Confirmed but corrected severity is P2, not P1. The BUG-04 validator intentionally enforces unknown keys, enums, and string `minLength`, while numeric schema ranges remain handler-clamped. That is a traceability overstatement in the deferred note, but the query schema maxima now match handler clamps and the runtime safely bounds the numeric values.

fix: Either enforce numeric `minimum`/`maximum` in `validateToolArgs()` or update the deferred/acceptance language to say numeric ranges are intentionally handler-clamped.

confidence: 0.91

### DR-009-12 [PRE-EXISTING] DR-007-03 — P1 traceability / `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:631` / CG-006 still stands in BUG-06 path

evidence:

```ts
631:   const scanPromotable = !severeParseErrorScan && structuralErrors.length === 0;
632:   const failedScanErrors = [
633:     ...structuralErrors,
634:     ...errors.filter(error => !structuralErrors.includes(error)),
635:   ].slice(0, 10);
636:   const failedScan = scanPromotable
```

```ts
776:   const readinessBlock = buildReadinessBlock({
777:     freshness: lastPersistedAt ? 'fresh' : 'empty',
778:     action: fullReindexTriggered || !effectiveIncremental ? 'full_scan' : 'selective_reindex',
779:     inlineIndexPerformed: true,
780:     reason: lastPersistedAt
781:       ? 'scan completed and persisted current graph state'
```

why: Real but pre-existing/deferred. A failed/non-promotable scan can still return freshness from `lastPersistedAt`, so a prior persisted timestamp can produce `fresh` wording. The relevant behavior is in the active BUG-06 scan flow and was deferred rather than fixed by this session.

fix: When `!scanPromotable`, build scan response readiness from failed-scan state, not from `lastPersistedAt` alone.

confidence: 0.93

### DR-009-13 [PRE-EXISTING] DR-007-04 — P1 traceability / `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:494` / CG-007 read-only write still stands

evidence:

```ts
494:     // HEAD pointer may have advanced without touching tracked
495:     // files. Update the stored HEAD so we don't re-classify on every probe.
496:     if (headChanged && headScope === 'out-of-scope' && currentHead) {
497:       setLastGitHead(currentHead);
```

```ts
849: export function getGraphReadinessSnapshot(rootDir: string): GraphReadinessSnapshot {
850:   try {
851:     const state = detectState(rootDir);
```

why: Real but pre-existing/deferred. `getGraphReadinessSnapshot()` still calls `detectState()`, and `detectState()` can write `last_git_head` in an ostensibly read-only readiness path. The behavior remains open in the deferred BUG-06 readiness work, not in the session's completed fixes.

fix: Split read-only detection from mutating freshness normalization, or add a no-mutate option used by status/startup/snapshot callers.

confidence: 0.90

### DR-009-14 [PRE-EXISTING] DR-007-05 — P1 traceability / `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:187` / CG-008 limitation still stands

evidence:

```ts
187: // It does NOT detect brand-new UNTRACKED files: a file that has never been
188: // indexed is absent from `getTrackedFiles()` at both record and compare time,
189: // so it cannot diverge the manifest. Detecting brand-new on-disk files at read
190: // time would require a filesystem walk of the include globs, which the read
```

```ts
438:   // Condition (c): Check file mtime drift on tracked files
439:   const trackedFiles = graphDb.getTrackedFiles();
440:   if (trackedFiles.length === 0) {
```

```ts
456:   // Detect untracked-indexable drift via the candidate manifest.
457:   // If the on-disk indexable cardinality or digest diverges from the stored
458:   // baseline, flip to stale + full_scan even when individual mtimes look fine.
459:   const manifestDrift = detectCandidateManifestDrift(trackedFiles);
```

why: Real but pre-existing/deferred. The current implementation and comments confirm the manifest compares DB-tracked rows, not on-disk index candidates, so it cannot detect brand-new untracked indexable files. This is explicitly deferred in the BUG-06 readiness path.

fix: Source the manifest from the on-disk include-glob candidate set, or update the authoritative contract to remove the promise that candidate-manifest drift detects untracked additions between scans.

confidence: 0.94

### DR-009-15 [PRE-EXISTING] DR-007-06 — P1 traceability / `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:415` / CG-009 confirm gate still stands outside reviewed code changes

evidence:

```ts
415:   if (classification.state === 'hard-stale' && args.confirm !== true) {
416:     recordApplyMetadata({ status: 'aborted', battery: preflight, now });
417:     appendAudit(logPath, 'abort', {
418:       reason: 'hard-stale requires confirm=true',
```

```ts
268:     case 'recover-sqlite-corruption':
269:       return {
270:         recovery: await recoverSqliteCorruption({
271:           dbDir,
272:           auditDir: options.auditDir,
273:           now: options.now,
```

```ts
277:     case 'rollback-bad-apply':
278:       return {
279:         recovery: await rollbackBadApply({
280:           dbDir,
```

why: Real but pre-existing/deferred. Destructive recovery operations still have no operation-level `confirm` requirement when the graph is not hard-stale. `apply-orchestrator.ts` is not changed in the reviewed diff, and CG-009 is explicitly recorded as deferred.

fix: Require `confirm:true` for `recover-sqlite-corruption` and `rollback-bad-apply` regardless of freshness classification.

confidence: 0.92

### DR-009-16 [CONFIRMED-REAL] DR-007-07 — P1 traceability / `.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:261` / CG-010 stands and deferred reason is wrong

evidence:

```ts
261:   try {
262:     closeDb();
263:     moveTriplet(dbDir, quarantineDir);
264:     knownGoodDir = findLatestKnownGood(dbDir, auditDir);
265:     if (knownGoodDir) {
266:       assertInside(dbDir, knownGoodDir);
```

```ts
280:     return {
281:       procedureId: 'CG-RP-003',
282:       status: 'ok',
283:       quarantineDir,
284:       ...(knownGoodDir ? { knownGoodDir } : {}),
285:       restored,
```

```md
74: | CG-010 | rollback-failed status is OVER-BROAD: recovery returns status:failed for a graceful no-op rollback (nothing to restore), which is not data loss. Correct fix needs recovery-procedures to distinguish no-op from error. |
```

why: Confirmed. The runtime bug still stands because the apply orchestrator reports rollback success without checking `recovery.restored`, and the newly added deferred packet is factually wrong: no-op rollback returns `status:'ok'` with `restored:false`, not `status:'failed'`.

fix: Correct the deferred packet, then make the orchestrator distinguish `restored:true`, `restored:false`, and failed recovery instead of reporting `rolled-back` for all rollback calls.

confidence: 0.96

newFindings: 9, dimension: correctness
