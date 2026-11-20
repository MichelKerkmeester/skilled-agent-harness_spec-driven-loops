# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1795172940208-84a42n`, generation 1, lineageMode `new`
- Focus: Frontier node F-1-002, dimension `correctness`
- Review target type: `files`
- Operator review focus: the commit set `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b`, and the ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df`.

### How this iteration addressed the operator review focus

The focus asks for defects in shipped behavior introduced by those commits, read at HEAD with `git show`. This iteration read the semantic-lane surface that commit `31ffd18beab` ("keep every skill and command vector current") and `1ccbb3283c6` ("close the alignment findings on vector coverage") changed, and checked the four questions the F-1-002 node binds. The P1 below is a defect in shipped behavior on the recommend path, not a style observation. The remaining focus commits are untouched by this iteration and stay queued for later dimensions.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:1-431`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:95-155,506-519,580-660`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:274-318,1289-1320`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13,105-111`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:503-546,549-598,1325-1435,1750-1775`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1730`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-cosine.vitest.ts:236-330`
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/semantic-outage-degraded.vitest.ts:1-42`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The semantic coverage gate opens the daemon-owned skill-graph database read-write on the recommend path** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:404` -- `scoreSemanticShadowLane` calls `embeddingCoverage()` with no argument, and `embeddingCoverage(database?)` falls back to `getDb()` at `skill-graph-db.ts:1326`. `getDb()` calls `initDb()` (`skill-graph-db.ts:549-553`), which `mkdirSync`s the database directory, runs `recoverMalformedDatabase` on a genuine-corruption verdict, opens the file read-write, executes `SCHEMA_SQL`, runs `ensureSchemaMigrations`, and writes `schema_version` (`skill-graph-db.ts:503-546`). Every other read on this path is deliberately read-only: `loadSkillEmbeddings` uses `getDbReadOnly()` (`skill-graph-db.ts:1750-1756`), `withSemanticShadowPromptEmbedding` uses `getDbReadOnly()` (`semantic-shadow.ts:172`), and the projection loader opens `new Database(dbPath, { readonly: true, fileMustExist: true })` (`projection.ts:1730`). The module states the invariant it breaks in its own comment at `semantic-shadow.ts:170-172`: "Read-only access: recommend calls must never open the daemon-owned database read-write (dual-writer hazard) or create it when absent." `getDbReadOnly`'s doc comment names the semantic shadow lane as its intended consumer (`skill-graph-db.ts:570-578`). A hook or CLI process that calls `advisor_recommend` therefore becomes a second writer on the daemon-owned SQLite file, and a read path can quarantine the database as a side effect of being asked for coverage.
   Finding class: `correctness`
   Scope proof: the call site is inside the declared review target `.skilled/skills/system-skill-advisor`; the reach is the production branch `projection.source !== 'fixture' && process.env.VITEST !== 'true'` at `semantic-shadow.ts:399`, which is the branch every non-test recommend call takes.
   Affected surface hints: `advisor_recommend` handler, `session-handover` and `vibe-prompt-advisor` hooks, `skill-advisor.cjs` CLI, `advisor_status` semantic-health reporting.
   Case: a hook process calls `advisor_recommend` while the daemon holds the skill-graph database open for writing. `loadSkillEmbeddings` returns at least one cached vector, so the `cachedVectors.size === 0` guard at `semantic-shadow.ts:400` does not fire, and `embeddingCoverage()` opens a second read-write handle. The two writers contend on the WAL; the recommend call either degrades to `skill_embedding_load_failed` through the catch at `semantic-shadow.ts:407-412` or, when the integrity probe reads a transient state as genuine corruption, `recoverMalformedDatabase` moves the daemon's database aside.

```json
{
  "type": "claim",
  "claim": "The semantic lane's coverage gate calls embeddingCoverage() without a database argument, so it resolves to getDb() and opens the daemon-owned skill-graph database read-write from the recommend path, contradicting the read-only invariant the same module states.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:404",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1326",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:549",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:503",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:170",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1750",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1730"
  ],
  "counterevidenceSought": "Checked whether the recommend path already opens the database read-write before the lane runs, which would make this call redundant rather than new. The projection loader opens read-only at projection.ts:1730, loadSkillEmbeddings uses getDbReadOnly at skill-graph-db.ts:1753, and withSemanticShadowPromptEmbedding uses getDbReadOnly at semantic-shadow.ts:172. No earlier read-write open exists on this path. Also checked whether the throw is caught: it is, at semantic-shadow.ts:407-412, so the failure degrades the lane rather than crashing the call.",
  "alternativeExplanation": "The author may have intended embeddingCoverage() to reuse the daemon's existing handle, which getDb() does when the process already owns one. That holds inside the daemon and fails in every secondary process, which is exactly the case getDbReadOnly exists for.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if advisor_recommend is proven to run only inside the daemon process, so getDb() always returns the existing handle and no second writer can exist."
}
```

### P2 Findings

1. **The `incomplete_skill_vectors` reason also fires for a missing command vector** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:405` -- the gate reads `embeddingCoverage().complete`, and `complete` is `skills.total > 0 && incompleteIds.length === 0` (`skill-graph-db.ts:1432`), where `incompleteIds` collects both skill ids (`skill-graph-db.ts:1394-1404`) and command ids (`skill-graph-db.ts:1407-1425`). A stale command vector therefore disables the skill cosine lane and reports a reason that names only skill vectors.
   Finding class: `correctness`
   Scope proof: the reason string is set at `semantic-shadow.ts:405` and surfaced through `getSemanticShadowRuntimeHealth()` into `advisor_status` semantic health.
   Affected surface hints: `advisor_status --include-semantic-health`, `runtimeLaneHealth` in the recommend output.
   Case: every skill vector is current but one command vector is stale. The lane returns no match and reports `incomplete_skill_vectors`; an operator following that reason inspects skills, finds them complete, and has no pointer to the command vector that actually failed the gate.

2. **The fixture-dimension guard is one-directional** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:352-354` -- the guard builds fixture skill vectors only when `promptVector.length === FIXTURE_VECTOR_DIM` (32). It prevents a 32-dim fixture skill vector from being compared with a real 768-dim prompt vector, which the test at `semantic-shadow-cosine.vitest.ts:312-328` covers. It does not prevent the reverse: a 32-dim fixture prompt vector compared against a real 768-dim cached skill vector, because `cachedVectors.get(skill.id) ?? fixtureVectors.get(skill.id)` at `semantic-shadow.ts:415` prefers the cached vector and `cosineSimilarity` reads only `Math.min(left.length, right.length)` dimensions (`semantic-shadow.ts:76-78`).
   Finding class: `correctness`
   Scope proof: the comparison is inside the declared target; the reach is a fixture projection outside `VITEST`, which is a test-fidelity path rather than a production caller, so the finding stays P2.
   Affected surface hints: `semantic-shadow-cosine.vitest.ts` fixture coverage.
   Case: a fixture projection is scored outside `VITEST` while the skill-graph database holds a real 768-dim vector for the same skill id. The 32-dim fixture prompt vector is compared against the 768-dim skill vector over the first 32 dimensions, producing a cosine that reads a prefix rather than the vectors the comment at `semantic-shadow.ts:100-102` says must match in size.

3. **The exact-subset rerank has no coverage gate** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:288-330` -- `scoreSemanticShadowExactSubset` loads cached vectors and returns a match for every skill that has one, silently omitting skills whose vector is missing or stale, and never consults `embeddingCoverage()`. The main lane refuses to score at all in that state (`semantic-shadow.ts:399-413`), so the two functions disagree about what partial coverage permits.
   Finding class: `correctness`
   Scope proof: the function is inside the declared target; its reach is gated by `isAdvisorExactSemanticRerankEnabled()`, which returns false unless the environment flag is set (`fusion.ts:169-172`), so the finding stays P2.
   Affected surface hints: `ADVISOR_EXACT_SEMANTIC_RERANK` flag, RRF fusion rerank ordering.
   Case: the exact rerank flag is enabled and one candidate skill has a stale vector. That candidate keeps its fusion-only score while its peers receive a semantic rerank contribution, so the rerank reorders on unequal evidence without recording that it did.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `semantic-shadow.ts:170-172`, `skill-graph-db.ts:570-578`, `skill-graph-db.ts:1326` | The module's stated read-only contract for recommend calls is contradicted by the coverage gate's `getDb()` resolution. Recorded as R1-P1-001. |
| `checklist_evidence` | notApplicable | `review/deep-review-config.json` `resource_map_present: false` | The review target is a `files` target, not a spec folder, so there is no checklist to reconcile. |

## Integration Evidence

- `advisor_recommend` handler: `advisor-recommend.ts:592-608` wraps scoring in `withSemanticShadowPromptEmbedding` and reads the lane reason before and after the call.
- `advisor_status` semantic health: `getSemanticShadowRuntimeHealth()` at `semantic-shadow.ts:66-68` is the only reader of `disabledReason`.
- Fusion lane health: `buildLaneRuntimeHealth` at `fusion.ts:274-297` marks a lane `runtime_degraded` only when `matchCount === 0`, and `runtimeLiveLaneCount` at `fusion.ts:1314-1316` excludes degraded lanes.

## Edge Cases

- **Ambiguity: which process runs `advisor_recommend`.** The finding's severity depends on whether a secondary process can reach the lane. The code path is proven; the deployment topology is not read in this iteration. Recorded as the P1 `downgradeTrigger` rather than resolved by assumption.
- **Contradiction: two coverage policies in one module.** The main lane refuses to score on incomplete coverage; the exact-subset rerank scores whatever it has. Both are inside the same file. Adjudicated as R1-P2-003 with the opt-in flag as the reach limiter.
- **Missing dependency: no test asserts the read-only invariant.** No test in `semantic-shadow-cosine.vitest.ts` or `semantic-outage-degraded.vitest.ts` asserts that the coverage gate avoids `getDb()`. The absence is recorded, not converted into a pass.

## Confirmed-Clean Surfaces

- Weight 0 skips the embed: `withSemanticShadowPromptEmbedding` returns before any adapter call when `DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow <= 0` (`semantic-shadow.ts:157-162`), and `lane-registry.ts:13` sets `defaultWeight: 0`.
- Weight 0 skips the coverage read: with no active prompt vector and a non-fixture projection, `scoreSemanticShadowLane` returns at `semantic-shadow.ts:355-357` before `loadSkillEmbeddings` and before `embeddingCoverage()`.
- A stale projection returns no match and reports `projection_embedding_stale` (`semantic-shadow.ts:335-338`).
- A missing vector set returns no match and reports `no_skill_vectors` (`semantic-shadow.ts:400-401`), falling through to an empty map rather than scoring.
- A failed prompt embed leaves the live total: the reason is set before `run()` (`semantic-shadow.ts:236-243`), `mergeSemanticShadowRuntimeLaneHealth` marks the lane degraded for any `prompt_embedding_` reason (`advisor-recommend.ts:105-119`), and `buildLaneRuntimeHealth` then excludes it from `runtimeLiveLaneCount` because the failed embed yields `matchCount === 0`.

## Ruled Out

- **`liveLaneCount` over-counts a zero-weight lane.** `semantic_shadow` is `live: true` with weight 0 (`lane-registry.ts:13`), so `runtimeLiveLaneCount` counts it. Ruled out: the field counts live lanes, and the lane is live; its weight is reported separately through `fusion_live_weight_share`.
- **The `|| liveWeightTotal()` fallback in `liveTotal` inflates confidence when every lane is degraded.** Ruled out: with every lane degraded there are no matches to normalize, so the fallback cannot raise a score.
- **`mergeSemanticShadowRuntimeLaneHealth` reads a stale reason.** Ruled out: `withSemanticShadowPromptEmbedding` sets the reason before invoking `run()`, so the read inside the callback observes this call's reason.

## Next Focus

- Dimension: `correctness`
- Focus area: frontier node F-1-005, the claims-against-code question over the changelogs, feature catalog, playbooks, references and `INSTALL-SKILLED.md`, including the ablation result of 156 against 161 correct that set the lane weight to 0.
- Reason: F-1-002 has now covered its `correctness` dimension; F-1-005 is the only other open node and its first uncovered dimension is `correctness`.
- Rotation status: F-1-002 `correctness` complete; F-1-002 `security`, `traceability` and `maintainability` remain.
- Blocked/productive carry-forward: productive — direct reads of the lane, the fusion health builder and the database openers produced a P1 with a named reach.
- Required evidence: `git show` of the doc commits, the changelog and feature-catalog text, and the code each claim names.
- Recovery note: none.

Review verdict: CONDITIONAL
