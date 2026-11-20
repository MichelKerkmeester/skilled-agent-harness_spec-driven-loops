# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `vibe-1`)
- Session: `fanout-vibe-1-1795172940208-84a42n`, generation 1, lineageMode `new`
- Iteration: 1 of 16
- Dimension: correctness
- Frontier node: F-1-001 (depth 1 of 3) -- vector refresh lifecycle
- Operator review focus: the commits `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b` and the ten `docs(specs)` commits, read at HEAD, reporting defects in shipped behavior only.
- How this iteration addressed the focus: it read the two commits that carry the background vector refresh and the semantic lane coverage gate (`31ffd18beab`, `1ccbb3283c6`) at HEAD and reviewed the shipped refresh lifecycle they introduced, which is the first half of the focus's "background vector refresh, semantic lane coverage gate" clause.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1296-1490` (`refreshSkillEmbeddings`, `embeddingCoverage`, `refreshEmbeddingsInBackground`)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:503-553` (`initDb`, `getDb`)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:570-583` (`getDbReadOnly` contract)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:739-746` (`skillDescriptionForEmbedding`)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1500-1640` (`refreshSkillEmbeddingsViaAdapter`)
- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:470-520` (`defaultReindex`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:325-430` (`scoreSemanticShadowLane`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:156-240` (`withSemanticShadowPromptEmbedding`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:526-545` (`buildLaneScores`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13` (default weight)
- `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:437-460` (startup refresh)
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph/refresh-in-background.vitest.ts:106-198`
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph/embedding-coverage.vitest.ts:68-140`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The background refresh's single-flight drops a reindex that lands mid-refresh** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1442` -- `refreshEmbeddingsInBackground` returns the in-flight promise to every later caller instead of scheduling a follow-up pass, and the watcher fires it with `void` after each reindex, so a skill or command added by a reindex that lands while a refresh is running is never embedded by that reindex and stays missing until some later unrelated reindex.
   Finding class: `lost_update`
   Scope proof: the finding is inside the declared review target (`.skilled/skills/system-skill-advisor`) and inside frontier node F-1-001's scope (`skill-graph-db.ts`, `lib/daemon/watcher.ts`).
   Affected surface hints: `advisor_status` `coverageComplete`, the semantic lane's `incomplete_skill_vectors` gate, the watcher's `Watcher skill embeddings` log line.
   Case: the daemon is running with the lane enabled and full coverage. An operator adds `.skilled/skills/new-skill/SKILL.md`. The watcher debounces, `indexSkillMetadata` inserts the new `skill_nodes` row, and `defaultReindex` fires `void refreshEmbeddingsInBackground(skillsRoot)`. While that refresh is still awaiting Ollama for the existing rows, a second file event (the same operator saving a second skill, or a `SKILL.md` edit) triggers a second reindex. The second `refreshEmbeddingsInBackground` call sees `backgroundEmbeddingRefresh` set and returns the first refresh's promise, whose row list was read before the second skill existed. The second skill's vector is never written, `embeddingCoverage().complete` stays `false`, and `scoreSemanticShadowLane` keeps returning `[]` with `disabledReason: 'incomplete_skill_vectors'` until an unrelated third reindex or a daemon restart.

```json
{
  "type": "claim_adjudication",
  "claim": "A reindex that lands while a background embedding refresh is in flight is silently dropped, so the skill or command it added keeps no vector and the semantic lane stays disabled.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1442",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1443",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1478",
    ".skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:494",
    ".skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:496",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:391"
  ],
  "counterevidenceSought": "Checked whether the watcher awaits the refresh before the next flush (it does not: `defaultReindex` returns `result` immediately and the refresh is fired with `void`), whether the refresh re-reads `skill_nodes` after the probe (it does, but only inside the first refresh's own row query, which already ran), and whether a queued follow-up exists anywhere (no queue, no dirty flag, no `finally` re-run).",
  "alternativeExplanation": "The sharing could be intentional and harmless if a later reindex always follows a dropped one. The watcher's `flushPromise` serializes flushes but does not serialize the refresh, and a single skill addition produces exactly one reindex, so no later reindex is guaranteed.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the watcher is shown to await the refresh before draining the next batch, or if a dirty-flag re-run exists outside the reviewed scope."
}
```

2. **The semantic lane's coverage gate opens the read-write database handle from the recommend path** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1326` -- `embeddingCoverage(database?)` falls back to `getDb()`, which runs `initDb()` (directory creation, `recoverMalformedDatabase`, `db.exec(SCHEMA_SQL)`, `ensureSchemaMigrations`), and `scoreSemanticShadowLane` calls it with no argument, contradicting `getDbReadOnly`'s documented contract that the semantic shadow lane must never become a second writer on the daemon-owned skill graph.
   Finding class: `contract_violation`
   Scope proof: the finding is inside the declared review target (`.skilled/skills/system-skill-advisor`) and inside frontier node F-1-001's scope (`skill-graph-db.ts`) plus the lane file the same commit changed.
   Affected surface hints: `getDbReadOnly`'s dual-writer guarantee, `recoverMalformedDatabase` quarantine, `ensureSchemaMigrations`, any non-daemon process that scores prompts with the lane enabled.
   Case: a process that scores prompts without owning the daemon's database handle (the `bench/scorer-bench.ts` and `bench/scorer-calibration.bench.ts` harnesses call `scoreAdvisorPrompt` directly, and any future local scorer would) runs with the semantic lane weight above zero. `withSemanticShadowPromptEmbedding` opens `getDbReadOnly()` and confirms the file exists, then `scoreSemanticShadowLane` calls `embeddingCoverage()`, which calls `getDb()`, which calls `initDb()`. That opens a read-write handle, runs `ensureSchemaMigrations`, and, if the integrity probe reports a genuine corruption reason, runs `recoverMalformedDatabase` against a database the daemon owns.

```json
{
  "type": "claim_adjudication",
  "claim": "The recommend path's new coverage check opens the read-write skill-graph handle, so a non-daemon scorer becomes a second writer and can trigger destructive recovery on the daemon-owned database.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1326",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:549",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:510",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:527",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:579",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:391",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1751"
  ],
  "counterevidenceSought": "Checked whether the daemon always owns the handle before the lane runs (it does, so the production daemon path is a no-op), whether `getDbReadOnly` is what the lane uses for its vector load (it is, at line 1753, with the explicit comment 'Recommend-path read: must not lazily create or migrate the database'), and whether the CLI's local fallback reaches this code (it does not: the CLI's last resort is the checked-in Python scorer, `skill-advisor-cli.ts:47`).",
  "alternativeExplanation": "The call could be deliberate because the coverage check needs the same handle the refresh writes through. It does not: `embeddingCoverage` only reads, and `advisor-status.ts` already passes an explicit database, so the no-argument form is the only read-write caller.",
  "finalSeverity": "P1",
  "confidence": "medium",
  "downgradeTrigger": "Downgrade to P2 if no non-daemon process can score prompts with the semantic lane weight above zero, which would leave the destructive path unreachable in shipped behavior."
}
```

### P2 Findings

1. **The Ollama-unavailable early return reports zero failures** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1466` -- the probe path returns `{embedded: 0, skipped: 0, failed: 0, warnings: [...]}`, while the module's own outage convention at line 1503 says an outage must report every row as failed "so refresh-watchers see an outage signal instead of an empty-corpus-looking zero count".
   Finding class: `diagnostic_inconsistency`
   Scope proof: inside the declared review target and inside frontier node F-1-001's scope.
   Affected surface hints: the watcher's `Watcher skill embeddings: embedded=%d skipped=%d failed=%d` log line at `lib/daemon/watcher.ts:507`, the startup log line at `advisor-server.ts:449`.
   Case: Ollama is stopped and the daemon restarts. The startup refresh probes, finds the backend unavailable, and logs `Startup skill embeddings: embedded=0 skipped=0 failed=0 warnings=embedding backend unavailable: ...`. An operator grepping for a non-zero `failed` count to detect an outage finds nothing; only the trailing warning carries the signal.

2. **The coverage check re-reads every `SKILL.md` on each scored prompt** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1325` -- `embeddingCoverage` selects every `skill_nodes` row and calls `skillDescriptionForEmbedding`, which does `existsSync` plus `readFileSync` plus `parseSkillFrontmatter` per row, and also re-reads and re-parses the command-bridges JSON, on every prompt that reaches the lane.
   Finding class: `hot_path_cost`
   Scope proof: inside the declared review target and inside frontier node F-1-001's scope.
   Affected surface hints: `scoreSemanticShadowLane` latency, the 750 ms `PROMPT_EMBEDDING_DEADLINE_MS` budget, the hook prompt path.
   Case: an operator enables the semantic lane (weight above zero) on a workspace with 58 `SKILL.md` files. Every prompt that reaches `scoreSemanticShadowLane` with a cached vector set performs 58 `readFileSync` calls plus one JSON parse before scoring a single row, inside a path whose own comment budgets 750 ms for the whole call.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md:1`, `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1439` | The feature-catalog page added by `1ccbb3283c6` describes the background refresh; the single-flight drop and the read-write handle are not described there. |
| `checklist_evidence` | notApplicable | - | The review target is a file list, not a spec folder, so there is no `checklist.md` to check evidence against. |

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:494` -- the watcher's `defaultReindex` is the only production caller that fires the background refresh after an index.
- `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:439` -- the daemon's startup refresh, gated on `skillGraphDaemon.active`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:539` -- `buildLaneScores` calls `scoreSemanticShadowLane` unless the lane is in `disabled`, and `disabled` defaults to an empty set (`fusion.ts:1287`), so the lane function runs on every prompt even at weight zero.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13` -- `semantic_shadow` default weight is 0, which is why the coverage gate is only reached once an operator opts in.

## Edge Cases

- **Ambiguity: is the single-flight drop intended?** The test `shares one refresh run across concurrent callers` (`refresh-in-background.vitest.ts:181-197`) asserts `firstResult` equals `secondResult` and that the probe ran once. That test codifies the sharing as correct and does not assert that a change landing mid-refresh is picked up. I kept the finding at P1 because the shipped claim is "keeps every skill and command vector current" and the test does not exercise the mid-refresh change.
- **Contradiction: the module's outage convention versus the new probe path.** `skill-graph-db.ts:1503-1505` says an outage must report every row as failed; the new probe path at `1466-1473` reports zero. I cited both sides and kept the lower severity (P2) because the warning string still carries the outage signal.
- **Missing dependency: no `resource-map.md` in the owning packet**, so the Resource Map Coverage Gate is skipped for this run rather than passed.
- **Partial success: the `getDb()` reach is latent in the daemon.** The daemon owns the handle, so `initDb` returns early there. The finding is recorded at P1 with `confidence: medium` and an explicit downgrade trigger rather than raised to P0, because I could not name a shipped non-daemon scorer that enables the lane.

## Confirmed-Clean Surfaces

- `refreshSkillEmbeddingsViaAdapter` no longer deletes a stale vector on an outage or on a per-row failure (`skill-graph-db.ts:1588-1610`, `1713-1735`), so the "an Ollama outage keeps the old vector" claim holds at the write site.
- `embeddingCoverage` counts a row as `current` only when the stored `model_id` matches the active embedder name and the stored `content_hash` matches the recomputed description hash (`skill-graph-db.ts:1385-1395`), so a stale vector cannot be counted as current.
- `embeddingCoverage` skips rows whose description is empty (`skill-graph-db.ts:1378-1381`), matching the refresh's own empty-description skip.
- The `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH=off` opt-out is checked before any probe or embed (`skill-graph-db.ts:1445-1447`) and is case-insensitive.
- `withSemanticShadowPromptEmbedding` returns before any embed when the lane weight is zero (`semantic-shadow.ts:157-161`), so the default configuration pays no embed cost.

## Ruled Out

- **The refresh can overlap a watcher reindex's database writes.** Ruled out: `indexSkillMetadata` is synchronous and `defaultReindex` calls it before firing the refresh, and better-sqlite3 serializes writes inside the process. The overlap that remains is the dropped reindex, reported as P1-001.
- **The refresh can leak the single-flight slot.** Ruled out: the `finally` block clears `backgroundEmbeddingRefresh` only when the slot still holds this refresh (`skill-graph-db.ts:1481-1485`), so a later refresh is never cleared by an earlier one.
- **A concurrent caller receives a different result than the first caller.** Ruled out: both callers await the same promise object (`skill-graph-db.ts:1443`).
- **The coverage gate scores a stale vector.** Ruled out: `embeddingCoverage().complete` is false whenever any row is stale or missing, and the lane returns `[]` in that case (`semantic-shadow.ts:391-395`).
- **The lane's `no_skill_vectors` branch scores with an empty vector set.** Ruled out: with no cached vectors every `cachedVectors.get` returns undefined and the map step filters every row out.

## Next Focus

- Dimension: correctness
- Focus area: Frontier node F-1-004 -- status and doctor surfaces (`handlers/advisor-status.ts`, `schemas/advisor-tool-schemas.ts`, `.skilled/commands/doctor/assets`, `.skilled/commands/create/assets`)
- Reason: F-1-001's correctness pass is complete and F-1-004 is the second seeded node; the status counts and the doctor exit codes are the other half of the focus's "status and doctor coverage" clause.
- Rotation status: F-1-001 correctness covered; F-1-004 correctness next.
- Blocked/productive carry-forward: productive -- reading the commit diff first and then the HEAD file found both P1s; keep that order.
- Required evidence: the `current`/`stale`/`missing` counts for skills and commands, the `includeSemanticHealth` wiring, and the doctor assets' PASS/DEGRADED/FAIL mapping including exit 75.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
