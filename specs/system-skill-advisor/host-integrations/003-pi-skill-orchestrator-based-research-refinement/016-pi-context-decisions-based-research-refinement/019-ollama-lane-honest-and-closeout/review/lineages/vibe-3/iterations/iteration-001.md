# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `vibe-3`)
- Session: `fanout-vibe-3-1795172940208-84a42n`, generation 1, lineageMode `new`
- Frontier node: F-1-003 (daemon and launcher liveness), dimension `correctness`
- Operator review focus: the phase-019 commit set at HEAD. This iteration addressed the focus by reading the launcher, heartbeat-watchdog and generation-counter changes of 31ffd18beab and dc3979eb451 at HEAD, plus the vector-coverage code those commits introduced inside the node's `runtime/lib` scope.
- Sources read: `steer.md` (absent at iteration start), `deep-review-config.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, `git show 31ffd18beab`, `git show dc3979eb451`, and the HEAD files cited below.

## Files Reviewed

- `.skilled/bin/system-skill-advisor-launcher.cjs:144`, `:181-190`, `:322-330`, `:355-400`, `:1554-1660`
- `.skilled/bin/launcher-heartbeat-watchdog.vitest.ts` (diff of 31ffd18beab)
- `.skilled/bin/launcher-threshold-env.vitest.ts` (diff of 31ffd18beab)
- `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:52-80`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1325-1432`, `:1565-1615`, `:1750-1800`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:325-420`
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:491-520`
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/liveness.ts:17-20`
- `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:388-394`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:196-240`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The semantic coverage gate opens the read-write database on the recommend path** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:392` -- `scoreSemanticShadowLane` calls `embeddingCoverage()` with no argument, and `embeddingCoverage` defaults its handle to `getDb()` (`skill-graph/skill-graph-db.ts:1326`), which lazily runs `initDb` and therefore creates, migrates or quarantines the database. The same file documents the opposite contract for this exact path: `loadSkillEmbeddings` is annotated "Recommend-path read: must not lazily create or migrate the database" (`skill-graph-db.ts:1751`) and deliberately uses `getDbReadOnly()`. A process that scores without an open handle, which is the documented local fallback (`SPECKIT_SKILL_ADVISOR_FORCE_LOCAL` is allowlisted for exactly that per-process path at `system-skill-advisor-launcher.cjs:161`), now performs a write-side open from a read-only scoring call.
   Finding class: correctness
   Scope proof: `.skilled/skills/system-skill-advisor/runtime/lib` is inside frontier node F-1-003's declared scope and inside the review target.
   Affected surface hints: `advisor_recommend` local fallback, hook processes, `probeStatusIntegrity`'s documented "report rather than quarantine" contract.
   Case: a hook process with no daemon and no open handle calls `advisor_recommend`; `scoreSemanticShadowLane` reaches `embeddingCoverage()`, `getDb()` runs `initDb`, and a corrupt database is quarantined as a side effect of being asked to score.
   Claim adjudication:
   ```json
   {"type":"claim","claim":"The semantic coverage gate opens the read-write database on the recommend path, contradicting the read-only contract the same module documents.","evidenceRefs":["semantic-shadow.ts:392","skill-graph-db.ts:1326","skill-graph-db.ts:1751","system-skill-advisor-launcher.cjs:161"],"counterevidenceSought":"Checked whether every caller already owns a read-write handle (daemon does; the local fallback does not), whether embeddingCoverage has a read-only variant (it does not), and whether the call is guarded by a source check (the guard only skips fixture and VITEST).","alternativeExplanation":"The daemon is the only production caller, so getDb() returns an existing handle and the open never happens.","finalSeverity":"P1","confidence":"medium","downgradeTrigger":"Downgrade to P2 if the local fallback path is proven to always pre-open the database before fusion runs."}
   ```

### P2 Findings

1. **The coverage gate re-scans every vector blob and the command-bridges file on each scoring call** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1406` -- `embeddingCoverage` reads every row of the active-dimension skill vector table, decodes nothing but still transfers every blob, then calls `readCommandEmbeddingSources()` (`:1406`), which locates and parses the command-bridges JSON. `scoreSemanticShadowLane` invokes it once per recommendation (`semantic-shadow.ts:392`), so the cost is paid on the hot path rather than at index time.
   Finding class: maintainability
   Scope proof: same module and node scope as the P1 above.
   Affected surface hints: `advisor_recommend` latency, hook p95 budget.
   Case: a workspace with 100 skills at 768 dimensions transfers roughly 300 KB of vector blobs plus one JSON parse per recommendation, on top of the vector load the lane already performs.

## Traceability Checks

- `spec_code` -- pass -- the D1 claim "full, current vector coverage ... with the doctor checks reading it" is implemented by `embeddingCoverage` (`skill-graph-db.ts:1325`) and surfaced by `advisor-status.ts:196-240`; the doc at `feature-catalog/cli-surface/advisor-status.md` documents `embedded` as current rows, matching the code.
- `checklist_evidence` -- partial -- the packet's completion criteria are recorded in `acceptance-criteria.md`; this iteration verified the launcher and coverage claims only, so the checklist row stays partial until the remaining criteria are read.

## Integration Evidence

- `.skilled/bin/system-skill-advisor-launcher.cjs` -- `createChildEnv` pins `SYSTEM_SKILL_ADVISOR_DB_DIR` to `resolvedAdvisorDbDir()` (`:326-328`), and the server writes its heartbeat to `join(resolveSkillGraphDbDir(), HEARTBEAT_FILE_NAME)` (`advisor-server.ts:391`), which reads the same variable (`skill-graph-db.ts:306`). The watchdog therefore watches the file the child writes.
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/liveness.ts:18` -- `HEARTBEAT_INTERVAL_MS = 15_000` against the launcher's `HEARTBEAT_STALE_MS = 180_000` (`system-skill-advisor-launcher.cjs:1558`), so a healthy server refreshes twelve times inside one stale window.
- `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:55-66` -- `sameDirectory` compares the override against `join(findAdvisorWorkspaceRoot(root), '.skilled/skills/system-skill-advisor/runtime/database')`, which is exactly the launcher's default `path.join(runtimeDir, 'database')` (`system-skill-advisor-launcher.cjs:24`, `:365-367`), so a pinned daemon keeps the shared counter.

## Edge Cases

- The heartbeat verdict now returns `stale` for a never-armed child after `HEARTBEAT_STARTUP_GRACE_MS` (300 s). The first watchdog tick lands at 60 s and the reaper therefore fires between 300 s and 360 s, not at 300 s. Recorded as intended behavior, not a finding.
- `embeddingCoverage` reports `complete: false` whenever no active embedder pointer exists, because every stored vector then falls into the `stale` branch. The lane stays disabled in that state, which is the safe direction; recorded as an ambiguity rather than a finding.
- `createChildEnv(sourceEnv)` pins the database directory from `process.env`, not from `sourceEnv`. The two agree in production because `createChildEnv()` is called with no argument; a caller passing a divergent `sourceEnv` would get the launcher's directory. Recorded as an ambiguity with no reachable caller.

## Confirmed-Clean Surfaces

- `heartbeatVerdict` cannot reap a healthy server: the child writes every 15 s and the stale window is 180 s.
- The generation counter no longer lands beside the database for a pinned daemon: `sameDirectory` canonicalizes both sides through `realpathSync`.
- `OLLAMA_BASE_URL` and `OLLAMA_REQUEST_TIMEOUT_MS` are forwarded unchanged and are read by the daemon's embedding adapter; the new tests assert the forwarding rather than restating the allowlist.
- The stale-vector retention change is safe for scoring: `embeddingCoverage` requires `model_id === active.name` and a matching content hash before a row counts as current, and the lane returns `[]` when coverage is incomplete.

## Ruled Out

- "The 5-minute reaper stops a healthy server": ruled out by the 15 s heartbeat interval against the 180 s stale window.
- "The child gets a different database directory than the launcher": ruled out by the pinned `SYSTEM_SKILL_ADVISOR_DB_DIR` and the shared `resolveSkillGraphDbDir` reader.
- "The generation counter lands beside the wrong database": ruled out by `sameDirectory`'s canonical comparison against the launcher's default directory.

## Next Focus

- Dimension: security
- Focus area: frontier node F-1-003, security pass over the launcher's child environment and the `OLLAMA_*` forwarding
- Reason: correctness is complete for this node; the allowlist and the pinned database directory are the trust-boundary surfaces the node names
- Rotation status: F-1-003 has 1 of 4 dimensions covered
- Blocked/productive carry-forward: productive -- direct diff reads plus HEAD verification found the coverage-gate defect
- Required evidence: the allowlist entries, `createChildEnv` filtering, and any secret-bearing variable that could reach the child
- Recovery note: none

Review verdict: CONDITIONAL
