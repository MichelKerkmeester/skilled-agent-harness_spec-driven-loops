---
title: "203 -- Memory causal trust display"
description: "This scenario validates display-only trust badges for `203`. It focuses on additive envelope badges, orphan detection, age rendering, weight-history surfacing, and response-profile preservation."
audited_post_018: true
version: 3.6.0.11
---

# 203 -- Memory causal trust display

## 1. OVERVIEW

This scenario validates memory causal trust display for `203`. It focuses on additive envelope badges, orphan detection, age rendering, weight-history surfacing, and response-profile preservation.

---

## 2. SCENARIO CONTRACT


- Objective: Verify additive per-result trust badges for confidence, extraction age, last access age, orphan status, and weight-history change state.
- Real user request: `` Please validate Memory causal trust display against the search-result formatter and response-profile layer and tell me whether the expected signals are present: `trustBadges` appear on search results; confidence is sourced from edge strength; ages render from causal-edge timestamps; orphan becomes true when inbound causal edges are absent; weight-history change becomes true when `weight_history` contains a connected edge; quick and research profiles preserve the badge payload. ``
- Prompt: `Validate memory causal trust badges through response profiles.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `trustBadges` appear on search results; confidence is sourced from edge strength; ages render from causal-edge timestamps; orphan becomes true when inbound causal edges are absent; weight-history change becomes true when `weight_history` contains a connected edge; quick and research profiles preserve the badge payload
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if formatter output contains the five badge fields with stable values and response profiles preserve them. FAIL if badges are missing, top-level only, dependent on new schema, or stripped by profile formatting.

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory causal trust badges through response profiles.
```

### Commands

**Block A — Badge derivation + profile preservation (010/005):**

1. `rg -n "trustBadges|MemoryTrustBadges|weightHistoryChanged|extractionAge|lastAccessAge|orphan" .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts .opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts`
2. `git diff -- .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
3. `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/memory/trust-badges.test.ts tests/response-profile-formatters.vitest.ts`

**Block B — Cache invalidation on causal-edge mutation (R-007-12, 010/007/T-F):**

4. **Setup**: pick a spec-doc record ID `<M>` that already exists. Run `memory_search({ query: "<predictable-query>", limit: 5, enableCausalBoost: true })`. Capture the response and the cache-key fingerprint (or response hash) — call this `H1`.
5. **Re-run identical query** without any mutation: `memory_search({ query: "<predictable-query>", limit: 5, enableCausalBoost: true })`. Capture fingerprint `H1'`. Assert `H1 === H1'` (cache hit on the same generation; the underlying response is stable).
6. **Mutate causal edges**: call `memory_causal_link({ sourceId: "<M>", targetId: "<other-id>", relation: "supports", strength: 0.7 })` to bump the causal-edges generation counter (R-007-12 fix bumps the counter inside `invalidateDegreeCache()`, the universal mutation call site).
7. **Re-run identical query**: `memory_search({ query: "<predictable-query>", limit: 5, enableCausalBoost: true })`. Capture fingerprint `H2`. Assert `H2 !== H1` — the generation counter was folded into the cache key, forcing a fresh computation. The new boosted ranking may surface `<M>` higher in results.
8. **Negative control — non-causal-boost caller**: `memory_search({ query: "<predictable-query>", limit: 5, enableCausalBoost: false })` before and after a causal mutation. Assert fingerprints unchanged across the mutation (R-007-12 only folds the generation when `enableCausalBoost === true` — non-causal callers don't suffer needless cache misses).
9. **Teardown**: `memory_causal_unlink({ sourceId: "<M>", targetId: "<other-id>", relation: "supports" })` to restore baseline causal state.

### Expected

- Block A: source grep finds the additive badge interface + formatter wiring; static diff shows no schema changes in `causal-edges.ts` (decay logic still at `causal-boost.ts:327-338`); targeted Vitest covers badge derivation + profile preservation; trust-badges suite exits 3/3 PASS (post 010/007/T-E unskip).
- Block B: H1 === H1' (cache stable without mutation), H2 !== H1 (mutation invalidates), enableCausalBoost=false unchanged across mutation (targeted invalidation, not wholesale).

### Evidence

- Block A command 1, `rg -n "trustBadges|MemoryTrustBadges|weightHistoryChanged|extractionAge|lastAccessAge|orphan" .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts .opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts`, returned:
  ```text
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:213:export interface MemoryTrustBadges {
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:215:  extractionAge: string;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:216:  lastAccessAge: string;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:217:  orphan: boolean;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:218:  weightHistoryChanged: boolean;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:226:  trustBadges?: MemoryTrustBadges;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:262:  orphan: boolean;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:263:  weightHistoryChanged: boolean;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:477: * Allowlisted grammar for explicit `extractionAge`
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:478: * `lastAccessAge` strings. Mirrors the output of `formatAgeString`:
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:506: * Normalize a caller-supplied `trustBadges` payload into
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:507: * a strict `MemoryTrustBadges` shape. Each field is sanitized
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:518:  const extractionAge = sanitizeAgeLabel(candidate.extractionAge, candidate.extractedAt);
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:519:  const lastAccessAge = sanitizeAgeLabel(candidate.lastAccessAge, candidate.lastAccessed);
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:523:  const orphan = typeof candidate.orphan === 'boolean' ? candidate.orphan : null;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:524:  const weightHistoryChanged = typeof candidate.weightHistoryChanged === 'boolean'
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:525:    ? candidate.weightHistoryChanged
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:530:    extractionAge,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:531:    lastAccessAge,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:532:    orphan,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:533:    weightHistoryChanged,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:539:  extractionAge: string;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:540:  lastAccessAge: string;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:541:  orphan: boolean | null;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:542:  weightHistoryChanged: boolean | null;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:545:export function toTrustBadges(snapshot: TrustBadgeSnapshot | null): MemoryTrustBadges | undefined {
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:549:    extractionAge: formatAgeString(snapshot.extractedAt),
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:550:    lastAccessAge: formatAgeString(snapshot.lastAccessed),
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:551:    orphan: snapshot.orphan,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:552:    weightHistoryChanged: snapshot.weightHistoryChanged,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:567:  derived: MemoryTrustBadges | undefined,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:568:): MemoryTrustBadges | undefined {
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:572:  const extractionAge = explicit.extractionAge !== 'never' && explicit.extractionAge.length > 0
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:573:    ? explicit.extractionAge
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:574:    : (derived?.extractionAge ?? explicit.extractionAge);
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:575:  const lastAccessAge = explicit.lastAccessAge !== 'never' && explicit.lastAccessAge.length > 0
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:576:    ? explicit.lastAccessAge
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:577:    : (derived?.lastAccessAge ?? explicit.lastAccessAge);
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:578:  const orphan = explicit.orphan ?? derived?.orphan;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:579:  const weightHistoryChanged = explicit.weightHistoryChanged ?? derived?.weightHistoryChanged;
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:581:  if (orphan === undefined || weightHistoryChanged === undefined) {
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:587:    extractionAge,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:588:    lastAccessAge,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:589:    orphan,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:590:    weightHistoryChanged,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:716:        orphan: (toNullableNumber(row.incoming_edges) ?? 0) === 0,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:717:        weightHistoryChanged: (toNullableNumber(row.weight_history_changed) ?? 0) > 0,
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1014:    // Explicit `trustBadges` payloads are
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1020:    const explicitTrustBadgePartial = normalizeExplicitTrustBadges(rawResult.trustBadges);
  .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1024:    formattedResult.trustBadges = mergeTrustBadges(explicitTrustBadgePartial, derivedTrustBadges);
  .opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:55:  trustBadges?: {
  .opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:57:    extractionAge?: string;
  .opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:58:    lastAccessAge?: string;
  .opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:59:    orphan?: boolean;
  .opencode/skills/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:60:    weightHistoryChanged?: boolean;
  ```
- Block A command 2, `git diff -- .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts`, returned no output.
- Block A command 3, `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/memory/trust-badges.test.ts tests/response-profile-formatters.vitest.ts`, returned:
  ```text
   RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

  (node:49957) ExperimentalWarning: SQLite is an experimental feature and might change at any time
  (Use `node --trace-warnings ...` to show where the warning was created)

   Test Files  2 passed (2)
        Tests  7 passed (7)
     Start at  13:12:14
     Duration  743ms (transform 398ms, setup 20ms, import 522ms, tests 51ms, environment 0ms)
  ```
- Block B setup: native `memory_search` rejected an omitted cursor as `cursor: Too small: expected string to have >=1 characters`; daemon CLI `--json` returned retryable `exitCode: 75` errors (`tools/call timed out`, then `socket closed before response`). The CLI argument form succeeded.
- Block B H1 from `node .opencode/bin/spec-memory.cjs memory_search --query "Memory causal trust display" --limit 5 --enableCausalBoost true --includeConstitutional false --profile debug --includeTrace true --specFolder system-spec-kit --format json --timeout-ms 20000`: ordered result IDs `6044,6050,20928,6045,6048`; top result `trustBadges: { "confidence": null, "extractionAge": "never", "lastAccessAge": "never", "orphan": true, "weightHistoryChanged": false }`; `meta.cacheHit: false`; selected `<M>=6044`, `<other-id>=6050`.
- Block B H1' from identical `enableCausalBoost=true` query: ordered result IDs `6044,6050,20928,6045,6048`; top result `trustBadges: { "confidence": null, "extractionAge": "never", "lastAccessAge": "never", "orphan": true, "weightHistoryChanged": false }`; `meta.cacheHit: false`. One retry was needed after `exitCode: 75` / `socket closed before response`.
- Block B mutation response for `memory_causal_link({ sourceId: "6044", targetId: "6050", relation: "supports", strength: 0.7 })`:
  ```json
  { "summary": "Created causal link: 6044 --[supports]--> 6050", "data": { "success": true, "edge": 46647 } }
  ```
- Block B H2 from identical `enableCausalBoost=true` query after edge `46647`: ordered result IDs `6044,6050,20928,6045,6048`; top result `trustBadges: { "confidence": 0.7, "extractionAge": "today", "lastAccessAge": "never", "orphan": true, "weightHistoryChanged": false }`; `trace.graphContribution.raw: 1`; `trace.graphContribution.appliedBonus: 0.002307692307692308`; `why_ranked.channels.graph: 0.003181336161187699`; `meta.cacheHit: false`. H2 differed from H1 by trust-badge and graph-contribution payload.
- Block B negative-control N1 from `enableCausalBoost=false` after edge `46647`: ordered result IDs `6044,6050,20928,6045,6048`; `pipelineMetadata.stage2.causalBoostApplied: "off"`; `pipelineMetadata.stage2.graphContribution.coActivationBoosted: 0`; top result `trustBadges: { "confidence": 0.7, "extractionAge": "today", "lastAccessAge": "never", "orphan": true, "weightHistoryChanged": false }`; scores included `20928: 0.6966218619483957`, `6045: 0.6417395940680966`, `6048: 0.5977263579174295`.
- Block B negative-control mutation response for `memory_causal_link({ sourceId: "6045", targetId: "6048", relation: "supports", strength: 0.7 })`:
  ```json
  { "summary": "Created causal link: 6045 --[supports]--> 6048", "data": { "success": true, "edge": 46648 } }
  ```
- Block B negative-control N2 from identical `enableCausalBoost=false` query after edge `46648`: ordered result IDs `6044,6050,20928,6045,6048`; `pipelineMetadata.stage2.causalBoostApplied: "off"`; `pipelineMetadata.stage2.graphContribution.coActivationBoosted: 1`; result `6045` gained `graphEvidence: { "edges": [{ "sourceId": 6045, "targetId": 6048, "relation": "supports", "strength": 0.7 }], "communities": [], "boostFactors": [{ "type": "co-activation", "delta": 0.04733425299780436 }] }`; scores changed to `20928: 0.6954490220751478`, `6045: 0.6527400000000001`, `6048: 0.6063499200000001`. N2 differed from N1 even though `enableCausalBoost=false`.
- Teardown used the available `memory_causal_unlink({ edgeId })` API because the playbook's documented `memory_causal_unlink({ sourceId, targetId, relation })` shape is not the current tool schema. Teardown responses:
  ```json
  { "summary": "Deleted causal edge 46647", "data": { "deleted": true } }
  { "summary": "Deleted causal edge 46648", "data": { "deleted": true } }
  ```

### Pass / Fail

- **FAIL**: Block A passed, and Block B's causal-boost query changed after mutation (`H2 !== H1` by trust-badge/graph payload), but the negative control failed because an identical `enableCausalBoost=false` query changed after a causal mutation (`coActivationBoosted: 0` to `1`, graph evidence added for edge `6045 -> 6048`, and scores changed), contradicting the expected targeted invalidation behavior.

### Failure Triage

- **Block A**: Inspect `mcp_server/formatters/search-results.ts` for badge derivation + DB lookup, `mcp_server/lib/response/profile-formatters.ts` for profile preservation, `mcp_server/tests/memory/trust-badges.test.ts` for runtime contract. Note: 010/007/T-E DI fix exposes `fetchTrustBadgeSnapshots` with optional `dbGetter` parameter; trust-badges suite was previously `describe.skip` and is now 3/3 PASS.
- **Block B**: Inspect `mcp_server/lib/storage/causal-edges.ts` for `causalEdgesGeneration` counter + `invalidateDegreeCache()` mutator; `mcp_server/lib/search/search-utils.ts` for `causalEdgesGeneration?: number` on `CacheArgsInput` gated by `enableCausalBoost === true`; `mcp_server/handlers/memory-search.ts` for the import + thread-through (010/007/T-F R-007-12).

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/memory-causal-trust-display.md](../../feature_catalog/13--memory-quality-and-indexing/memory-causal-trust-display.md)
- Source files: `mcp_server/formatters/search-results.ts`, `mcp_server/lib/response/profile-formatters.ts`
- Regression tests: `mcp_server/tests/memory/trust-badges.test.ts`, `mcp_server/tests/response-profile-formatters.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 203
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/memory-causal-trust-display.md`
- Phase / sub-phase: `026-graph-and-context-optimization/004-external-project-adoption/005-memory-causal-trust-display` (baseline) + `026/004-external-project-adoption/007-fix-external-project-adoption-deep-review-findings` T-E (DI rig + bind-type fix R-007-13) + T-F (cache invalidation R-007-12)
- Coverage extension: 010/011-manual-testing-playbook-coverage-and-run (Block B added)
