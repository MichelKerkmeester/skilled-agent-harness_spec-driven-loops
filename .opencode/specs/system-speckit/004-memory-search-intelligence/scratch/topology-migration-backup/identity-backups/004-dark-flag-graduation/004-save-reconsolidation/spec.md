---
title: "Spec: Save-Reconsolidation Merge Precision"
description: "Benchmarks the opt-in save-time reconsolidation flag SPECKIT_RECONSOLIDATION_ENABLED, the gate that lets the destructive reconsolidate() path merge near-duplicate memories at cosine 0.88 and deprecate older rows at cosine 0.75. The question is whether save-time near-duplicate merge cuts corpus redundancy without losing distinct information. Measured against the production determineAction band and mergeContent line-union over a read-only backup of the live 17605-row corpus, using a labeled fixture of 32 known-duplicate pairs (same content_hash) and 5888 known-distinct pairs (same folder, different title and hash). Merge precision is 0.017 and conflict precision is 0.000 because the nomic embedder compresses distinct same-folder documents to cosine 0.88 and above, while true duplicates sit at 1.000. A separate in-memory harness verifies the checkpoint gate, the default-off byte-identity and the merge and deprecate writes. Verdict CUT, the destructive path loses distinct information on the production corpus and a content-hash exact-duplicate path is the safe alternative."
trigger_phrases:
  - "save reconsolidation merge precision"
  - "SPECKIT_RECONSOLIDATION_ENABLED benchmark"
  - "reconsolidation merge precision recall"
  - "near duplicate merge precision corpus"
  - "reconsolidation cut verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/004-dark-flag-graduation/004-save-reconsolidation"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the precision and gate harnesses, authored the CUT verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/recon-precision-benchmark.mjs"
      - "scripts/recon-gate-and-writes.mjs"
      - "results/precision-metrics.json"
      - "results/gate-metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Save-Reconsolidation Merge Precision

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`SPECKIT_RECONSOLIDATION_ENABLED` is the opt-in gate that lets the save flow run the destructive `reconsolidate()` path. When it is on, a save searches the same spec folder for similar memories and routes the top match by cosine similarity. At cosine 0.88 and above it MERGES, inserting a combined row and retiring the predecessor through a `supersedes` edge. At cosine 0.75 to 0.88 it deprecates the older row. The path is further gated on a per-spec-folder `pre-reconsolidation` checkpoint so a destructive merge never fires without an explicit safety snapshot. The flag is held default-off, so the path has never been measured against the real corpus on the production scope, and nobody knows whether near-duplicate merge cuts redundancy without losing distinct information.

This is the one destructive candidate in the dark-flag-graduation suite. A merge deprecates a row and collapses two records into one. If the merge band fires on documents that are distinct rather than duplicate, the path destroys information that was never recoverable from the merged row. So the central risk is not a missed dedup, it is a wrong merge.

### Purpose

Measure merge precision and recall preservation for the save-time reconsolidation path on the production same-folder scope, against a read-only backup of the live corpus, and return a graduate, refine, or cut verdict. Merge precision asks whether the pairs the band merges are genuinely near-duplicate rather than distinct rows that happen to be similar. Recall preservation asks whether any distinct fact is lost when a merge or a deprecation fires. Because the path is destructive, the honest bar is conservative, a graduate verdict requires near-perfect merge precision with zero distinct-information loss.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A labeled fixture of known-duplicate pairs (two active rows sharing one content_hash, exact textual duplicates) and known-distinct pairs (two active rows in one spec folder with a different title and a different content_hash, distinct documents), mined from the real corpus on a read-only backup
- Merge precision and conflict precision measured by routing every labeled pair through the production `determineAction` band, reading `MERGE_THRESHOLD` and `CONFLICT_THRESHOLD` from the production module
- Recall preservation measured by running the production `mergeContent` line-union on the pairs and checking that no distinct new line is dropped
- Verification of the checkpoint gate, the default-off byte-identity and the merge and deprecate writes on an isolated in-memory database seeded with the live production schema
- A graduate, refine, or cut verdict for `SPECKIT_RECONSOLIDATION_ENABLED` grounded strictly in the measured precision and recall numbers

### Out of Scope

- Graduating `SPECKIT_RECONSOLIDATION_ENABLED` to default-on, which is a separate decision this benchmark informs but does not enact
- Any change to `MERGE_THRESHOLD`, `CONFLICT_THRESHOLD`, the merge writer or the checkpoint gate, which are read and exercised as-is
- The assistive reconsolidation path `SPECKIT_ASSISTIVE_RECONSOLIDATION`, which is shadow-only and advisory and is its own already-graduated feature
- A reindex of the corpus or any write to the live database. Every measurement reads a read-only backup and every destructive write runs on a throwaway in-memory database

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/recon-precision-benchmark.mjs | Create | The merge-precision and recall-preservation harness over the labeled corpus fixture |
| scripts/recon-gate-and-writes.mjs | Create | The checkpoint-gate, byte-identity and destructive-write verification harness |
| results/precision-metrics.json | Create | The precision, recall and separation rollup |
| results/gate-metrics.json | Create | The gate and write-verification check rollup |
| benchmark-results.md | Create | The full data tables and the graduation verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The benchmark runs only against a read-only backup of the live corpus, never the live database, and triggers no reindex | the precision harness backs up the database and the active vector shard read-only and reads only the copy, the live database file is untouched |
| REQ-002 | Merge precision and conflict precision are measured by the production `determineAction` band over a labeled fixture mined from the real corpus | `precision-metrics.json` reports the merge and conflict true-positive and false-positive counts and the precision, with the thresholds read from the production module |
| REQ-003 | Recall preservation is measured by the production `mergeContent`, and the distinct-information-loss mechanism is named | `precision-metrics.json` reports the line preservation and states that the real loss is predecessor deprecation, not line truncation |
| REQ-004 | The checkpoint gate, the default-off byte-identity and the merge and deprecate writes are verified against the production functions | `gate-metrics.json` reports the gate and write checks all passing |
| REQ-005 | The phase returns one of GRADUATE, REFINE or CUT with every verdict claim traced to a measured number | `benchmark-results.md` states the verdict and cites values present in `precision-metrics.json` or `gate-metrics.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The separation between true duplicates and distinct documents is quantified | `precision-metrics.json` reports the duplicate and distinct cosine distributions and the threshold that would give zero distinct false-positive |
| REQ-007 | Both harnesses are reproducible from the committed scripts | `node scripts/recon-precision-benchmark.mjs` and `node scripts/recon-gate-and-writes.mjs` rebuild the metrics, exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A labeled fixture mined from the real corpus and a merge-precision number measured by the production band over it, against a read-only backup
- **SC-002**: A recall-preservation measurement that names the actual distinct-information-loss mechanism of the destructive path
- **SC-003**: A gate and write verification that proves the checkpoint gate, the default-off byte-identity and the merge and deprecate writes behave as documented
- **SC-004**: A graduate, refine, or cut verdict for `SPECKIT_RECONSOLIDATION_ENABLED` grounded strictly in the measured numbers, conservative because the path is destructive
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A destructive write leaks onto the live corpus | Irreversible corpus damage | The precision harness reads a read-only backup and the active vector shard copy, and the write verification runs on a throwaway in-memory database, so no write ever reaches the live database |
| Risk | The labeled fixture mislabels distinct pairs as duplicates or the reverse | A precision number that does not reflect reality | Duplicates are defined by an exact content_hash match and distinct pairs by a different title and a different content_hash in the same folder, both objective and corpus-grounded, and the same-folder scope mirrors the production candidate search |
| Risk | The benchmark measures an eval scope the production path never reaches | An eval-only artifact | The fixture is restricted to same-folder pairs, exactly the scope `findScopeFilteredCandidates` searches, so the precision is on the production scope |
| Dependency | The production `determineAction`, `mergeContent`, `reconsolidate`, `hasReconsolidationCheckpoint` and the dist build | The harnesses cannot drive the real path without them | The compiled dist exports all of them, imported directly, so no threshold or merge rule is reimplemented |
| Dependency | The live database and its active vector shard | The fixture cannot be mined without the real embeddings | The corpus and the `vec_768` embedding table are read read-only from a backup copy |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The precision harness reads embeddings from the plain `vec_768` table and computes cosine in-process, so it needs no sqlite-vec extension and no embedding round-trip
- **NFR-P02**: The same-folder distinct-pair sample is capped to the largest sixty folders so the run stays bounded on the 17605-row corpus while still covering the densest dedup targets

### Security
- **NFR-S01**: Every corpus read runs against a read-only backup and the destructive writes run on an in-memory database, so no benchmark cell mutates the live memory database
- **NFR-S02**: The benchmark never flips a default and never writes the live corpus, so the destructive path under measurement cannot fire against real data

### Reliability
- **NFR-R01**: The harnesses read `MERGE_THRESHOLD` and `CONFLICT_THRESHOLD` from the production module rather than hardcoding them, so a future tuning change is reflected automatically
- **NFR-R02**: The write verification seeds the in-memory database from the live schema text, so every column the merge and deprecate writers touch exists with no hand-maintained drift
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A true-duplicate pair at cosine exactly 1.000: the band routes it to MERGE, which is correct, and `mergeContent` returns the existing content because every incoming line already exists
- A distinct pair at cosine 0.94: the band routes it to MERGE, which is wrong, and the merge would deprecate a distinct document, the false-positive the precision number counts
- A folder with one row: no pair exists, so the folder contributes nothing to the fixture and is skipped by the minimum-rows filter

### Error Scenarios
- The active vector shard is missing: the precision harness throws before any measurement rather than reporting a partial number
- A row has no embedding in `vec_768`: the pair is skipped rather than scored against a zero vector

### State Transitions
- Checkpoint absent to present: the gate returns false with no `pre-reconsolidation` row and true once a folder-scoped row is present, and a different folder stays false
- Flag off to on: with `SPECKIT_RECONSOLIDATION` off `reconsolidate` returns null and the caller uses the normal store, which is the default-off byte-identity
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Two self-contained harness scripts, no production code change, reads-only against a backup plus an in-memory write check |
| Risk | 10/25 | The path under measurement is destructive, so the harness safety is the load-bearing control, mitigated by read-only backup and in-memory writes |
| Research | 18/20 | A labeled fixture of 5920 corpus pairs, merge and conflict precision, recall preservation, threshold separation, and a twelve-check gate and write verification |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether a content-hash exact-duplicate merge path, which would merge only the 32 cosine-1.000 pairs and never a distinct document, is worth building as the safe replacement for the cosine-band path this benchmark cuts
- Whether the assistive reconsolidation shadow path, which surfaces high-similarity pairs as advisory recommendations without any destructive write, already captures the redundancy-flagging value the cut path was meant to deliver
<!-- /ANCHOR:questions -->
