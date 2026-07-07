---
title: "Changelog: Save-Reconsolidation Merge Precision [005-dark-flag-graduation/004-save-reconsolidation]"
description: "Chronological changelog for the save-reconsolidation merge precision benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/004-save-reconsolidation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation`

### Summary

This phase benchmarked `SPECKIT_RECONSOLIDATION_ENABLED`, the opt-in gate that lets the save flow run the destructive `reconsolidate()` path which merges near-duplicate memories at cosine 0.88 and deprecates older rows at cosine 0.75. Measured against the production `determineAction` band and `mergeContent` line-union over a read-only backup of the live 17605-row corpus, merge precision on the production same-folder scope is 0.017: for every genuine duplicate the band merges it also merges 56 distinct documents. No threshold rescues the path because the nomic embedder compresses distinct same-folder documents to a p99 of 0.954, deep inside the merge band, while true duplicates sit at cosine 1.000. The safety machinery is sound, all twelve gate and write checks pass, but it gates a cosine band that cannot separate duplicates from distinct documents. Verdict: CUT.

### Added

- `scripts/recon-precision-benchmark.mjs`: precision harness that backs up the live corpus and active vector shard read-only, mines a labeled fixture of 32 duplicate pairs and 5888 distinct pairs, routes every pair through the production `determineAction` band and `mergeContent` line-union in-process, and writes the precision rollup to `results/precision-metrics.json`.
- `scripts/recon-gate-and-writes.mjs`: gate and write harness that seeds a throwaway in-memory database from the live schema text and drives `reconsolidate()`, `hasReconsolidationCheckpoint()` and the merge and deprecate writers across twelve checks, writing results to `results/gate-metrics.json`.
- `results/precision-metrics.json`: merge precision 0.0173 (32 true positives, 1816 false positives), conflict precision 0.000 (0 true positives, 2721 false positives), duplicate merge recall 1.000, line preservation 1.000 for both classes, and the zero-false-positive threshold at 0.973.
- `results/gate-metrics.json`: all twelve gate and write checks passing, covering the checkpoint gate, the default-off byte-identity and the merge and deprecate writes.
- `benchmark-results.md`: full data tables, cosine distribution breakdown, false-positive examples and the CUT verdict with citations to the measured numbers.

### Changed

- No production code was changed. The benchmark reads the production band constants and production functions from dist imports and runs all destructive writes on a throwaway in-memory database. The live database file mtime is unchanged after the runs.

### Fixed

- Nothing was fixed. This is a measurement-only phase. No defects in existing code were identified or remediated.

### Verification

- Precision harness read-only safety: the live database file mtime is unchanged after the run, confirmed by the harness before exit.
- `results/precision-metrics.json` reports merge precision 0.0173, conflict precision 0.000, duplicate merge recall 1.000 and line preservation 1.000 for both classes.
- `results/gate-metrics.json` reports all twelve checks passing.
- `node scripts/recon-precision-benchmark.mjs` reproduces the precision rollup from a read-only corpus backup, exit 0.
- `node scripts/recon-gate-and-writes.mjs` reproduces the gate rollup from an in-memory database, exit 0.
- Strict validation - PASS, `validate.sh --strict` on this phase exits clean.

### Files Changed

- `scripts/recon-precision-benchmark.mjs`: new merge-precision and recall-preservation harness over the labeled corpus fixture.
- `scripts/recon-gate-and-writes.mjs`: new checkpoint-gate, byte-identity and destructive-write verification harness.
- `results/precision-metrics.json`: precision, recall and cosine-separation rollup from the corpus run.
- `results/gate-metrics.json`: gate and write-verification check rollup from the in-memory run.
- `benchmark-results.md`: full data tables and the CUT graduation verdict.

### Follow-Ups

- A deterministic content-hash exact-duplicate merge path is the recommended safe replacement for the cosine-band path this benchmark cuts. Building it is a separate follow-up driven after the verdict lands.
- The assistive reconsolidation shadow path `SPECKIT_ASSISTIVE_RECONSOLIDATION` is already graduated and advisory-only and already captures the non-destructive redundancy-flagging value. No re-measurement is needed.
- The separation numbers are measured on one corpus snapshot under the `nomic-embed-text-v1.5` embedder. A different embedder with more spread between near-identical and merely-related documents could be re-evaluated but the CUT verdict holds for the shipped embedder.
