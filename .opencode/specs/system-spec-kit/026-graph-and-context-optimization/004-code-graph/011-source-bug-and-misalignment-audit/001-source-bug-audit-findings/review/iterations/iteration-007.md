### DR-007-01 [P1] [traceability] CG-002 PARTIALLY: BUG-04 enforces enum/minLength/additionalProperties, but not numeric ranges

file: `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:205`, `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:71`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/002-deferred-wip-overlapping-findings/spec.md:69`

evidence:

```ts
205:  * were never enforced and malformed calls reached handlers. We now enforce the
206:  * unambiguous constraints: unknown-key rejection, enum membership, and string
207:  * minLength. Required-field presence is enforced at the dispatcher
208:  * (`getMissingRequiredStringArgs`); numeric range is intentionally left to the
209:  * handler clamps (e.g. `limit`, `maxDepth`) to avoid rejecting values the
210:  * handler safely coerces and bounds. Throws a field-specific Error on the first
```

```ts
71:   if (TOOL_NAMES.has(name)) {
72:     try {
73:       validateToolArgs(name, args);
74:     } catch (err) {
```

```md
69: | CG-002 | Already implemented by in-tree BUG-04 WIP (schema enforcement before dispatch). Fast-fix only changed the error message and broke a test — reverted. |
```

why: Status is PARTIALLY. The deferral reason is directionally right that BUG-04 added pre-dispatch validation, but it is overstated as "schema enforcement": `validateToolArgs()` explicitly leaves numeric `minimum`/`maximum` constraints to handler clamps. The user's requested enum/range verification therefore does not fully pass: enums are enforced before dispatch, ranges are not.

fix: Either enforce numeric `minimum`/`maximum` in `validateToolArgs()` for published number schemas, or update the deferred packet to say BUG-04 only enforces enum/additionalProperties/minLength and intentionally leaves ranges to handler clamps.

confidence: 0.93

### DR-007-02 [P2] [traceability] CG-020 ADDRESSED-BY-WIP: per-file dangling-edge prune was deferred and swept once after scan

file: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:767`, `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:595`

evidence:

```ts
767:     if (!opts.deferDanglingTargetPrune) {
768:       d.prepare(`
769:         DELETE FROM code_edges WHERE
770:           source_id NOT IN (SELECT symbol_id FROM code_nodes) OR
771:           target_id NOT IN (SELECT symbol_id FROM code_nodes)
772:       `).run();
```

```ts
595:       // BUG-03: defer the dangling-target edge prune per-file. A full scan
596:       // persists files one at a time, so a cross-file IMPORTS edge whose target
597:       // lives in a not-yet-persisted file would be pruned here and never
598:       // restored. We sweep once with pruneDanglingEdges() after the loop and
599:       // cross-file resolution, when every target node exists.
600:       persistIndexedFileResult(result, { deferDanglingTargetPrune: true });
```

```ts
710:   // edges are resolved, sweep genuinely-dangling edges ONCE. Per-file
711:   // replaceEdges deferred this prune so forward-referenced cross-file IMPORTS
712:   // edges (importer persisted before the imported file) survived; here their
713:   // targets exist, so only truly-orphaned edges are removed.
714:   if (filesIndexed > 0) {
715:     graphDb.pruneDanglingEdges();
```

why: Status is ADDRESSED-BY-WIP. The unconditional per-file `DELETE ... NOT IN` no longer always runs during scan persistence; scan passes `deferDanglingTargetPrune:true` and runs `pruneDanglingEdges()` once after cross-file resolution. The deferral note that CG-020 was already handled by BUG-03 is accurate.

fix: Close CG-020 as WIP-addressed, or keep it out of the not-fixed reimplementation list. Optional hardening: gate the final sweep on `scanPromotable` if failed-scan pruning is undesired.

confidence: 0.94

### DR-007-03 [P1] [traceability] CG-006 STILL-STANDS: failed scans still report fresh from last persisted timestamp

file: `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:631`, `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:776`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1161`

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

```ts
1161:   // Last scan timestamp
1162:   const lastScan = d.prepare('SELECT MAX(indexed_at) as last FROM code_files').get() as { last: string | null } | undefined;
1163:   const lastScanTimestamp = lastScan?.last ?? null;
```

why: Status is STILL-STANDS. The scan result still computes readiness freshness from `lastPersistedAt`, not `scanPromotable`. A non-promoted scan can record `failedScan` while returning `fresh` / `scan completed and persisted current graph state` if any prior or current row gives `MAX(indexed_at)`.

fix: Build the scan response readiness from promotion state: when `!scanPromotable`, return `freshness:'stale'` with a failed-scan reason even if `lastPersistedAt` is truthy.

confidence: 0.95

### DR-007-04 [P1] [traceability] CG-007 STILL-STANDS: read-only readiness paths still write `last_git_head`

file: `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:494`, `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:849`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:374`

evidence:

```ts
494:     // HEAD pointer may have advanced without touching tracked
495:     // files. Update the stored HEAD so we don't re-classify on every probe.
496:     if (headChanged && headScope === 'out-of-scope' && currentHead) {
497:       setLastGitHead(currentHead);
498:     }
```

```ts
849: export function getGraphReadinessSnapshot(rootDir: string): GraphReadinessSnapshot {
850:   try {
851:     const state = detectState(rootDir);
852:     return {
```

```ts
374: export function setLastGitHead(head: string): void {
375:   setMetadata('last_git_head', head);
376: }
```

why: Status is STILL-STANDS. `getGraphReadinessSnapshot()` still calls `detectState()`, and `detectState()` still calls `setLastGitHead()` on out-of-scope HEAD drift. That contradicts the read-only snapshot contract and means the deferred finding remains open. The deferral reason is broadly accurate that this overlaps readiness-flow WIP, though scan-side HEAD recording already exists elsewhere.

fix: Split detection from mutation: pass a no-mutate option for status/readiness-marker/startup paths, or move the out-of-scope HEAD write into an explicitly mutating readiness path.

confidence: 0.91

### DR-007-05 [P1] [traceability] CG-008 STILL-STANDS: candidate manifest still compares DB tracked rows, not on-disk candidates

file: `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:187`, `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:438`, `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:456`

evidence:

```ts
187: // It does NOT detect brand-new UNTRACKED files: a file that has never been
188: // indexed is absent from `getTrackedFiles()` at both record and compare time,
189: // so it cannot diverge the manifest. Detecting brand-new on-disk files at read
190: // time would require a filesystem walk of the include globs, which the read
191: // path deliberately avoids (NFR-P01: no FS walk on the read path). Brand-new
192: // files are picked up on the next explicit/triggered full `code_graph_scan`,
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

why: Status is STILL-STANDS. The implementation now documents the limitation, but the behavior still cannot detect on-disk-only additions because both baseline and comparison are derived from `graphDb.getTrackedFiles()` DB rows. The deferral reason that the source change lives in active `ensure-ready.ts` WIP remains accurate; the original functional gap is not fixed.

fix: Either feed the candidate manifest from the on-disk include-glob candidate set and accept the read-path filesystem walk, or update the authoritative feature/docs to remove the promise that candidate-manifest drift detects brand-new untracked files between scans.

confidence: 0.94

### DR-007-06 [P1] [traceability] CG-009 STILL-STANDS: destructive recovery operations still lack an operation-level confirm gate

file: `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:415`, `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:268`

evidence:

```ts
415:   if (classification.state === 'hard-stale' && args.confirm !== true) {
416:     recordApplyMetadata({ status: 'aborted', battery: preflight, now });
417:     appendAudit(logPath, 'abort', {
418:       reason: 'hard-stale requires confirm=true',
419:       hardStaleReasons: classification.reasons,
420:     }, now);
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
281:           auditDir: options.auditDir,
282:           now: options.now,
```

why: Status is STILL-STANDS. The only generic confirm gate still depends on `classification.state === 'hard-stale'`. Explicit `recover-sqlite-corruption` and `rollback-bad-apply` dispatch branches still do not require `args.confirm === true` when the graph is fresh or soft-stale. The deferral reason that this was bundled with reverted apply-orchestrator work is accurate.

fix: Add an operation-level confirm requirement for `recover-sqlite-corruption` and `rollback-bad-apply` regardless of freshness classification.

confidence: 0.93

### DR-007-07 [P1] [traceability] CG-010 PARTIALLY: bug still stands, and the deferred reason misstates rollback no-op semantics

file: `.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:261`, `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:468`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/002-deferred-wip-overlapping-findings/spec.md:74`

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

```ts
468:     recordApplyMetadata({ status: 'rolled-back', battery: preflight, now });
469:     return {
470:       status: 'rolled-back',
471:       operation,
472:       classification,
473:       auditLogPath: logPath,
```

```md
74: | CG-010 | rollback-failed status is OVER-BROAD: recovery returns status:failed for a graceful no-op rollback (nothing to restore), which is not data loss. Correct fix needs recovery-procedures to distinguish no-op from error. |
```

why: Status is PARTIALLY. The runtime bug still stands because `applyCodeGraph()` still returns `rolled-back` without checking whether `rollbackBadApply()` restored anything. The deferral reason is wrong in an important detail: when there is nothing to restore, `rollbackBadApply()` returns `status:'ok'` with `restored:false`, not `status:'failed'`. The packet therefore defers CG-010 for a rationale that does not match the actual WIP semantics.

fix: Correct the deferred packet, then fix the code by treating `restored !== true` as a separate outcome from both successful rollback and thrown recovery failure. The orchestrator should not report `rolled-back` unless a baseline was actually restored.

confidence: 0.96

### DR-007-08 [P2] [traceability] CG-037 STILL-STANDS: rollback dry-run still returns no would-be rollback target

file: `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:431`, `.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:135`

evidence:

```ts
431:   if (args.dryRun === true) {
432:     const postflight = await runBattery();
433:     appendAudit(logPath, 'postflight_battery', summarizeBattery(postflight), now);
434:     recordApplyMetadata({ status: 'dry-run', battery: postflight, now });
435:     return {
436:       status: 'dry-run',
```

```ts
135: function findLatestKnownGood(dbDir: string, auditDir: string): string | null {
136:   const roots = [auditDir, dbDir];
137:   const candidates: string[] = [];
138:   for (const root of roots) {
```

why: Status is STILL-STANDS. The generic dry-run branch still short-circuits before operation dispatch and returns no `recovery`, `knownGoodDir`, or rollback target. The only target discovery helper remains private to recovery procedures and is not used by the dry-run branch. The deferral reason that CG-037 was bundled with the reverted apply-orchestrator work is accurate.

fix: For `operation:'rollback-bad-apply'` dry-runs, compute and include the would-be `knownGoodDir`, or correct the playbook to state that dry-run deliberately skips target discovery.

confidence: 0.92

### DR-007-09 [P2] [traceability] CG-013 STILL-STANDS: readiness marker still resolves from `process.cwd()` while config resolves from module ancestry

file: `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:18`, `.opencode/skills/system-code-graph/mcp_server/core/config.ts:20`

evidence:

```ts
18: // fix#1: skill-local DB location (matches core/config.ts DATABASE_DIR when CWD == workspace root).
19: // CG-013 (cwd-divergence: share the canonical resolver) is intentionally deferred — see audit
20: // 011/002-deferred — because importing core/config here runs resolveCanonicalDbDir at module load
21: // and breaks tests that mock node:fs without realpathSync.native.
22: export const CODE_GRAPH_READINESS_MARKER_BASE_DIR = resolve(
23:   process.cwd(),
```

```ts
20: const defaultDir = resolve(resolveWorkspaceRoot(), '.opencode/skills/system-code-graph/mcp_server/database');
21: 
22: function resolveWorkspaceRoot(): string {
23:   // The server module always lives under `<workspace-root>/.opencode/...`, so
24:   // the workspace root is the parent of the `.opencode` segment on THIS file's
```

why: Status is STILL-STANDS. `readiness-marker.ts` still derives the marker base from import-time `process.cwd()`, while `core/config.ts` derives the DB default from the `.opencode` segment in the module path. The file's own comment confirms CG-013 is intentionally deferred, so the deferral reason is accurate.

fix: Share a side-effect-light canonical DB-dir resolver between config and readiness-marker, or explicitly pass the resolved marker base from the launcher/server after tests can mock the filesystem safely.

confidence: 0.95

newFindings: 9, dimension: traceability
