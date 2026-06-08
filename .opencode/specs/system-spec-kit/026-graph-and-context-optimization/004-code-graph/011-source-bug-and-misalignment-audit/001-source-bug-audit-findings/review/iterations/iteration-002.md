### DR-002-01 [P1] [correctness] Launcher stale-owner reclaim still bypasses the CG-016/017 CAS fix

file: `.opencode/bin/mk-code-index-launcher.cjs:347`

evidence:

```js
347: function acquireOwnerLeaseFile() {
348:   const currentOwnerLeasePath = ownerLeasePath();
349:   const existing = readOwnerLeaseFile(currentOwnerLeasePath);
```

```js
351:   if (existing) {
352:     const classification = classifyOwnerLease(existing);
353:     if (classification === 'live-owner' || classification === 'unknown-eperm') {
```

```js
373:   writeOwnerLeaseFile(lease);
374:   ownerLeasePid = process.pid;
375:   return { acquired: true, lease, reclaimed: existing };
```

```js
378: function refreshOwnerLeaseFile(ownerPid, patch = {}) {
379:   const lease = readOwnerLeaseFile();
380:   if (!lease || lease.ownerPid !== ownerPid) return false;
381:   writeOwnerLeaseFile({
```

why: The TypeScript `lib/owner-lease.ts` path now has a mutation lock, but the launcher still has its own owner-lease implementation in the startup path. When a stale owner lease exists, two launchers can both read the same stale `existing`, both classify it reclaimable, and both reach `writeOwnerLeaseFile()` with no exclusive create, lock, or re-read CAS. The child-PID refresh path has the same read-then-write TOCTOU and can overwrite a successor lease if ownership changes after line 379.

fix: Remove the duplicate launcher lease implementation or give it the same lock + re-read + identity-compare CAS as `lib/owner-lease.ts`. Cover stale-existing concurrent launcher starts and child-PID refresh supersession with tests.

confidence: 0.91

### DR-002-02 [P1] [correctness] Legacy relocation checks PID leases but never legacy owner leases

file: `.opencode/bin/mk-code-index-launcher.cjs:220`

evidence:

```js
103: const PID_FILE_NAME = '.mk-code-index-launcher.json';
104: const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
```

```js
220: function legacyLeasePaths() {
221:   // After the 2026-05-29 relocation, skill-local (mcp_server/database/) is the PRIMARY path.
222:   // The legacy probe now covers the former shared `.spec-kit` location plus the pre-rename
223:   // `skill/` (singular) typo dir, so a launcher still holding an old-location lease is detected.
224:   return [
225:     path.join(opencodeDir, '.spec-kit', 'code-graph', 'database', PID_FILE_NAME),
```

```js
792:       const dbFiles = [
793:         'code-graph.sqlite',
794:         'code-graph.sqlite-shm',
795:         'code-graph.sqlite-wal',
796:         '.code-graph-readiness.json',
797:         '.mk-code-index-launcher.json',
798:       ];
```

why: The launcher defines `.code-graph-owner.json`, but legacy detection only enumerates `.mk-code-index-launcher.json`, and the migration copy list also omits `.code-graph-owner.json`. A former shared-location child/server can still be the DB owner after its parent launcher PID file is gone or stale. In that state the new launcher neither probes nor bridges the live legacy owner before migrating back to skill-local, producing split-brain old-location and new-location graph writers.

fix: Before any DB copy or new primary owner acquisition, inspect the former shared-location owner lease with the same live/stale classification as the primary owner lease. Refuse or bridge on a live legacy owner; only migrate once both legacy PID and owner leases are absent or reclaimable.

confidence: 0.88

### DR-002-03 [P1] [correctness] Stale mutation-lock cleanup can unlink a successor lock

file: `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:104`

evidence:

```ts
104: function tryAcquireOwnerLeaseMutationLock(canonicalDbDir: string): OwnerLeaseMutationLock | null {
105:   const lockPath = ownerLeaseLockPath(canonicalDbDir);
106:   for (let attempt = 0; attempt < 2; attempt++) {
107:     let fd: number | undefined;
108:     try {
109:       fd = openSync(lockPath, 'wx', 0o600);
```

```ts
122:       const lockPid = readOwnerLeaseMutationLockPid(lockPath);
123:       if (attempt === 0 && lockPid !== null && getProcessLiveness(lockPid) === 'dead') {
124:         try {
125:           unlinkSync(lockPath);
126:           continue;
```

why: The new owner-lease mutation lock uses exclusive create for acquisition, but stale-lock recovery is still read-then-unlink by pathname. If process A reads a dead PID at line 122, process B removes/replaces the stale lock, and then A reaches line 125, A deletes B's live successor lock. A then loops and can acquire its own lock, so two reclaim/refresh paths can enter the lease mutation critical section.

fix: Make stale-lock deletion identity-checked. Store a nonce or full token in the lock file and unlink only if the content still matches the stale lock that was classified, or switch to a lock directory/rename protocol that cannot remove a successor by path alone.

confidence: 0.86

### DR-002-04 [P2] [correctness] Diff parser treats hunk body lines that look like headers as real file headers

file: `.opencode/skills/system-code-graph/mcp_server/lib/diff-parser.ts:159`

evidence:

```ts
159:     if (line.startsWith('--- ')) {
160:       // A new `---` always starts a new file section. If we were
161:       // mid-file from a previous block, flush it first so we never
162:       // mix headers across files.
```

```ts
177:     if (line.startsWith('+++ ')) {
178:       if (currentOldPath === null) {
179:         return { status: 'parse_error', reason: `'+++ ' header before '--- ' header at line ${i + 1}` };
```

```ts
203:     if (inHunkBody) {
204:       // Hunk body lines are ' ', '+', '-', '\\' (no-newline marker)
205:       // or empty (trailing blank). We don't retain them — only
```

why: The `--- ` and `+++ ` header checks run before the `inHunkBody` budget logic. A valid removed line whose content begins `-- ` appears in the diff body as `--- ...`; a valid added line whose content begins `++ ` appears as `+++ ...`. The parser will finalize or reject as if those body lines were file headers, even when `remainingOldLines`/`remainingNewLines` have not been exhausted, causing valid diffs to gain bogus files or return `parse_error`.

fix: Process `inHunkBody` before top-level file-header recognition. Only re-process a `--- ` or `+++ ` line as a header after the hunk body counters reach zero or the parser has explicitly left hunk-body mode.

confidence: 0.84

### DR-002-05 [P2] [correctness] Pure-delete hunks at post-image line 0 cannot overlap 1-based nodes

file: `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:322`

evidence:

```ts
322:       // Use post-image coordinates because callers read symbols
323:       // from the working tree. Pure-delete hunks have no new range,
324:       // so attribute their post-image gap as a zero-length marker.
```

```ts
333:         const overlapsPostImage = rangesOverlap(
334:           node.startLine, nodeLines,
335:           hunk.newStart, hunk.newLines,
336:         );
```

```ts
300:   if (aLines <= 0 || bLines <= 0) {
301:     // Zero-length on one side: treat as a single-line marker at
302:     // `aStart` (or `bStart`) and check point-in-range.
303:     const aPoint = aStart;
304:     const bPoint = bStart;
```

why: Unified diffs can represent a no-context deletion at the start of a file as a pure-delete post-image range like `+0,0`. `detect_changes` passes that zero-length post-image range directly to `rangesOverlap()`, which turns it into marker line `0`. Code graph nodes are 1-based (`startLine`/`endLine`), so no symbol can overlap that marker and the preflight can under-report a valid start-of-file deletion.

fix: Normalize zero-length post-image markers before overlap, e.g. use `Math.max(1, hunk.newStart)` for `newLines === 0`, and add regression coverage for `@@ -1 +0,0 @@` and adjacent-symbol boundary cases.

confidence: 0.82

## Prior P1 Rechecks (Not Counted)

DR-001-02 is confirmed. The migration copy still runs before the strict single-writer owner lease and PID lease checks:

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

DR-001-03 is confirmed. `releaseOwnerLease()` is still an unlocked read-then-unlink with no mutation lock or lease-identity recheck:

```ts
451: export function releaseOwnerLease(dbDir: string, ownerPid: number): boolean {
452:   const canonicalDbDir = resolveCanonicalDbDir(dbDir);
453:   const leasePath = ownerLeasePath(canonicalDbDir);
454:   const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
455:   if (!holder || holder.ownerPid !== ownerPid) return false;
456: 
457:   unlinkSync(leasePath);
```

newFindings: 5, dimension: correctness
