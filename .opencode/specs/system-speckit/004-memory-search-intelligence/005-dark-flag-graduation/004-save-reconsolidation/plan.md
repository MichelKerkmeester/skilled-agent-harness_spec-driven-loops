---
title: "Implementation Plan: Save-Reconsolidation Merge Precision"
description: "Builds two self-contained harnesses for the SPECKIT_RECONSOLIDATION_ENABLED benchmark. The precision harness backs up the live corpus and the active vector shard read-only, mines a labeled fixture of content-hash duplicate pairs and same-folder distinct pairs, routes every pair through the production determineAction band and mergeContent line-union, and writes merge precision, recall preservation and threshold separation to results/precision-metrics.json. The gate harness seeds an in-memory database from the live schema text and drives reconsolidate(), hasReconsolidationCheckpoint() and the merge and deprecate writers to verify the checkpoint gate, the default-off byte-identity and the destructive writes, writing twelve checks to results/gate-metrics.json. No production code is changed and no live write occurs. Rejects measuring against the live database or reimplementing the thresholds as the wrong fit for a destructive path."
trigger_phrases:
  - "save reconsolidation merge precision plan"
  - "SPECKIT_RECONSOLIDATION_ENABLED harness"
  - "reconsolidation precision harness backup"
  - "reconsolidation gate write verification"
  - "near duplicate merge precision corpus"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/004-save-reconsolidation"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the two harnesses and ran them, matrix complete"
    next_safe_action: "Author the results tables and the CUT verdict"
    blockers: []
    key_files:
      - "scripts/recon-precision-benchmark.mjs"
      - "scripts/recon-gate-and-writes.mjs"
      - "results/precision-metrics.json"
      - "results/gate-metrics.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Save-Reconsolidation Merge Precision

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Two Node ESM `.mjs` harness scripts driving the compiled TypeScript reconsolidation module |
| **Framework** | Direct imports of the production dist functions, `better-sqlite3` for the corpus backup and the in-memory write check |
| **Storage** | A read-only backup of the live database and its `nomic-embed-text-v1.5` vector shard, plus a throwaway in-memory database, and two metrics rollups |
| **Testing** | A 5920-pair labeled fixture for precision and recall, a twelve-check gate and write verification, both reproducible from the committed scripts |

### Overview

This phase measures the destructive save-time reconsolidation path without changing a line of production code. The precision harness resolves the live database path from config, backs the database and the active vector shard up read-only to a temporary copy, and mines a labeled fixture. Known-duplicate pairs are two active rows sharing one content_hash. Known-distinct pairs are two active rows in one spec folder with a different title and a different content_hash. It reads each row's embedding from the plain `vec_768` table, computes cosine in-process, routes every pair through the production `determineAction` band, and runs the production `mergeContent` line-union to measure recall preservation. It writes merge precision, conflict precision, duplicate merge recall, line preservation and the threshold separation to `results/precision-metrics.json`. The gate harness seeds an in-memory database from the live schema text so every column the writers touch exists, then drives `reconsolidate()`, `hasReconsolidationCheckpoint()` and the merge and deprecate writers to verify the checkpoint gate, the default-off byte-identity and the destructive writes, writing twelve checks to `results/gate-metrics.json`. Measuring against the live database was rejected because the path is destructive, and reimplementing the thresholds was rejected because the production band must be the thing under measurement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Both harnesses run exit 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two read-paths over the production functions, one for precision and one for safety. Neither harness reimplements a threshold or a merge rule. The precision harness reads the band constants and calls `determineAction` and `mergeContent` directly. The gate harness calls `reconsolidate`, `hasReconsolidationCheckpoint` and the writers directly. The only thing the harnesses own is the fixture, the backup safety and the metric arithmetic.

### Key Components

- **`recon-precision-benchmark.mjs`**: the read-only backup of the live database and the active vector shard, the labeled-fixture miner, the cosine reader over `vec_768`, the production-band router and the `mergeContent` recall check, and the `precision-metrics.json` writer.
- **`recon-gate-and-writes.mjs`**: the live-schema reader, the in-memory database seeder, and the twelve checks that drive `reconsolidate`, `hasReconsolidationCheckpoint` and the merge and deprecate writers, and the `gate-metrics.json` writer.
- **The production reconsolidation module**: `determineAction`, `mergeContent`, `reconsolidate`, `MERGE_THRESHOLD` and `CONFLICT_THRESHOLD`, imported from dist and never reimplemented.
- **The production checkpoint gate**: `hasReconsolidationCheckpoint`, imported from dist and exercised against a real `checkpoints` table.

### Data Flow

The precision harness resolves the live database path, backs the database and the vector shard up read-only, mines the duplicate and distinct fixture from the backup, reads each row's embedding from `vec_768`, computes cosine, and routes every pair through `determineAction`. Merge precision is the duplicate fraction of the MERGE-routed pairs, conflict precision is the duplicate fraction of the CONFLICT-routed pairs, and recall preservation is the surviving-new-line fraction through `mergeContent`. The gate harness reads the live schema text, seeds an in-memory database, and drives the production functions at chosen similarities so the checkpoint gate, the default-off byte-identity and the merge and deprecate writes are observable on isolated data. Both harnesses write a single metrics rollup, the source for the data tables and the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a measurement, not a fix, and changes no production surface. It reads the production reconsolidation surfaces and exercises them on isolated data, so the table records what it reads rather than what it changes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/storage/reconsolidation.ts` | The destructive merge and deprecate path and the band thresholds | read and drive `determineAction`, `mergeContent`, `reconsolidate` and the constants | the precision and gate harnesses import them from dist and exercise them, no edit |
| `lib/search/search-flags.ts` | The `isSaveReconsolidationEnabled` opt-in gate and the `isReconsolidationEnabled` core gate | read the gate semantics | the gate harness toggles `SPECKIT_RECONSOLIDATION` and confirms the off path returns null, no edit |
| `handlers/save/db-helpers.ts` | The `hasReconsolidationCheckpoint` per-folder gate | drive the gate | the gate harness confirms absent-false, present-true and folder isolation, no edit |
| `handlers/save/reconsolidation-bridge.ts` | The save-flow bridge that wires the opt-in gate to the checkpoint gate and `reconsolidate` | read the gate chain | the harness mirrors the bridge gate order, no edit |

Required inventories:
- Same-class producers: `rg -n 'determineAction|mergeContent|reconsolidate|MERGE_THRESHOLD|CONFLICT_THRESHOLD' .opencode/skills/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`.
- Consumers of the path: the save bridge gates `reconsolidate` behind `isSaveReconsolidationEnabled` and the checkpoint gate, and the orchestrator gates the merge behind `isReconsolidationEnabled`.
- Matrix axes: 32 content-hash duplicate pairs and 5888 same-folder distinct pairs, each routed through the production band and the `mergeContent` union.
- Algorithm invariant: merge fires at cosine 0.88 and above, deprecate at 0.75 to 0.88, complement below 0.75, read from the production constants and never reimplemented.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the production dist exports `determineAction`, `mergeContent`, `reconsolidate`, the band constants and `hasReconsolidationCheckpoint`
- [x] Confirm the live corpus stores embeddings in the plain `vec_768` table so cosine can be read without sqlite-vec
- [x] Confirm the live schema for the merge and deprecate writers so the in-memory seed is column-complete

### Phase 2: Core Implementation
- [x] Write the precision harness with the read-only backup, the labeled-fixture miner, the production-band router and the `mergeContent` recall check
- [x] Write the gate harness with the live-schema seed and the twelve checkpoint, byte-identity and write checks
- [x] Run both harnesses against the live corpus backup and the in-memory database and write the two metrics rollups

### Phase 3: Verification
- [x] Confirm the live database file is untouched and no reindex was triggered
- [x] Confirm both harnesses exit 0 and the gate harness reports all twelve checks passing
- [x] Author the data tables and the graduation verdict grounded strictly in the metrics rollups
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Precision | Merge and conflict precision over the labeled fixture by the production band | `recon-precision-benchmark.mjs` over the corpus backup |
| Recall | Distinct-line preservation through the production `mergeContent` | `recon-precision-benchmark.mjs` line-union check |
| Safety | The checkpoint gate, the default-off byte-identity and the merge and deprecate writes | `recon-gate-and-writes.mjs` twelve checks on an in-memory database |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The production `determineAction`, `mergeContent`, `reconsolidate` and the band constants | Internal | Green | The harnesses cannot drive the real path without them |
| The production `hasReconsolidationCheckpoint` | Internal | Green | The checkpoint gate cannot be verified without it |
| The live database and its `nomic-embed-text-v1.5` vector shard | Internal | Green | The labeled fixture cannot be mined without the real embeddings |
| The compiled dist build | Internal | Green | The harnesses import the production functions from dist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The benchmark is abandoned or the verdict is revised.
- **Procedure**: Delete the phase folder. No production code, default or corpus was touched, so there is nothing to revert outside the folder.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The precision harness reads a read-only backup and the destructive writes run on an in-memory database
- [x] No production default is flipped and no live corpus write occurs
- [x] Both harnesses exit 0 before the verdict is authored

### Rollback Procedure
1. Delete the phase folder, which removes the harnesses and the metrics
2. Confirm the live database file mtime is unchanged, proving no benchmark write reached it
3. No production code or default needs reverting, since none was touched

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the benchmark reads a corpus backup and writes only an in-memory database and the phase-folder metrics
<!-- /ANCHOR:enhanced-rollback -->

---
