---
title: "Implementation Summary"
description: "Status COMPLETE. Benchmarked the destructive save-time reconsolidation flag SPECKIT_RECONSOLIDATION_ENABLED against the production determineAction band and mergeContent line-union over a read-only backup of the live 17605-row corpus. On a labeled fixture of 32 content-hash duplicate pairs and 5888 same-folder distinct pairs, merge precision is 0.017 and conflict precision is 0.000, because true duplicates sit at cosine 1.000 while the nomic embedder compresses distinct same-folder documents to a p99 of 0.954 and a max of 0.973, so the 0.88 merge band fires on 1816 distinct documents and the 0.75 conflict band on 2721. The merge line-union preserves every line, but the real loss is the deprecation of a distinct predecessor row, confirmed by the destructive writes. A separate in-memory harness confirms the checkpoint gate, the default-off byte-identity and the merge and deprecate writes all behave, twelve of twelve checks pass. Verdict CUT, the cosine band cannot separate duplicates from distinct documents and the destructive path loses information. The 32 true duplicates are exactly the content-hash matches a deterministic exact-duplicate merge would catch with perfect precision."
trigger_phrases:
  - "save reconsolidation merge precision summary"
  - "SPECKIT_RECONSOLIDATION_ENABLED cut verdict"
  - "reconsolidation merge precision recall"
  - "near duplicate merge precision corpus"
  - "reconsolidation destructive path benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/004-save-reconsolidation"
    last_updated_at: "2026-07-06T18:50:00.680Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran both harnesses over the corpus backup and the in-memory database, authored the CUT verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
    blockers: []
    key_files:
      - "results/precision-metrics.json"
      - "results/gate-metrics.json"
      - "benchmark-results.md"
      - "scripts/recon-precision-benchmark.mjs"
      - "scripts/recon-gate-and-writes.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A benchmark of the one destructive candidate in the dark-flag-graduation suite, and the verdict it forces. `SPECKIT_RECONSOLIDATION_ENABLED` is the opt-in gate that lets the save flow run the destructive `reconsolidate()` path, which merges near-duplicate memories at cosine 0.88 and above and deprecates older rows at cosine 0.75 to 0.88, after a per-spec-folder `pre-reconsolidation` checkpoint passes. This phase measured whether that merge cuts corpus redundancy without losing distinct information, against the production band and merge functions over a read-only backup of the live 17605-row corpus, and returned a verdict.

The findings:

**Merge precision is 0.017 on the production scope.** A labeled fixture was mined from the real corpus, 32 known-duplicate pairs (two active rows sharing one content_hash) and 5888 known-distinct pairs (two active rows in one spec folder with a different title and a different content_hash). Every pair was routed through the production `determineAction` band. The 0.88 merge band fired on all 32 duplicates and on 1816 distinct pairs, for a merge precision of 0.0173. The 0.75 conflict (deprecate) band caught 0 duplicates and 2721 distinct pairs, for a conflict precision of 0.000. The destructive path is wrong about fifty-six times for every time it is right. The same-folder scope is the production scope, the exact set `findScopeFilteredCandidates` searches, so this is a prod-path number, not an eval-only artifact.

**The embedder leaves no usable margin.** True duplicates all sit at cosine 1.000. Distinct same-folder documents reach a p50 of 0.842, a p90 of 0.921, a p99 of 0.954 and a max of 0.973. The 0.88 merge band sits between the distinct distribution's p50 and p90, deep inside it. The threshold that would exclude every distinct pair sits above 0.973, which is an exact-match rule in disguise, and at that threshold duplicate recall is still 1.000. The highest-confidence merge false positives are an implementation plan and a feature specification for the same packet at cosine 0.973, distinct documents the band would collapse into one row.

**Recall preservation is a red herring.** The production `mergeContent` is a line-union, so line preservation is 1.000 for both classes, no line is dropped. But the information loss from a wrong merge is not line truncation. It is the deprecation of the predecessor row and the collapse of two distinct documents into one record. The gate-and-writes harness confirms this directly, a merge retires the predecessor through a `supersedes` edge and a conflict marks the existing distinct row `deprecated`.

**The safety machinery is sound.** A sibling in-memory harness seeded from the live schema text drove the production functions and reports all twelve checks passing. The checkpoint gate returns false when absent, true when a folder-scoped row is present, and false for a different folder. The default-off byte-identity holds, with `SPECKIT_RECONSOLIDATION` off `reconsolidate` returns null and the caller uses the normal store. The merge and deprecate writes do exactly what they claim. The engineering is not the problem, the cosine band it gates is.

**Verdict: CUT.** The destructive cosine-band merge loses distinct information on the production corpus and no threshold rescues it. The 32 true duplicates this benchmark found are exactly the content_hash matches, which a deterministic exact-duplicate merge would catch with perfect precision and zero distinct-document risk. That content-hash path, plus the already-graduated assistive shadow path that surfaces high-similarity pairs as advisory recommendations without any destructive write, together deliver the redundancy-flagging value the cut path was meant to provide, without the irreversible merge of distinct documents. The recommendation is to cut `SPECKIT_RECONSOLIDATION_ENABLED` and the cosine-band merge it gates.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The precision harness `scripts/recon-precision-benchmark.mjs` resolves the live database path from config, backs the database and the active `nomic-embed-text-v1.5` vector shard up read-only to a temporary copy, and mines the labeled fixture from the backup. It reads each row's embedding from the plain `vec_768` table, computes cosine in-process so no sqlite-vec extension is needed, routes every pair through the production `determineAction` reading `MERGE_THRESHOLD` and `CONFLICT_THRESHOLD` from the module, and runs the production `mergeContent` line-union for recall. It writes merge precision, conflict precision, duplicate merge recall, line preservation, the cosine distributions and the threshold separation to `results/precision-metrics.json`. The gate harness `scripts/recon-gate-and-writes.mjs` reads the live schema text for the tables the writers touch, seeds a throwaway in-memory database so every column exists with no hand-maintained drift, and drives `reconsolidate()`, `hasReconsolidationCheckpoint()` and the merge and deprecate writers at chosen similarities, writing twelve checks to `results/gate-metrics.json`. No production code was changed, no default was flipped, and the live database file mtime is unchanged after the runs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Measure against the production band, never reimplement it.** The harnesses import `determineAction`, `mergeContent` and the band constants from dist, so the precision number is a verdict on the shipped path, and a future threshold change is reflected automatically.
- **Read-only backup for precision, in-memory database for the destructive writes.** The precision read runs against a backup copy and the write verification runs on a throwaway in-memory database, so the destructive path under measurement can never fire against the live corpus.
- **Define duplicates by content_hash and distinct pairs by a different title and hash in the same folder.** Both labels are objective and corpus-grounded, and the same-folder scope mirrors the production candidate search, so the precision is honest and on the production scope.
- **Treat line preservation as necessary but not sufficient.** Because the destructive loss is predecessor deprecation rather than line truncation, the verdict is grounded in the merge precision and the write effects, not the line-union, which never truncates.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- The precision harness backs up the live database and the active vector shard read-only and reads only the copy, and the live database file mtime is unchanged after the run, so no benchmark write reached the corpus.
- `results/precision-metrics.json` reports merge precision 0.0173 (32 true positives, 1816 false positives), conflict precision 0.000 (0 true positives, 2721 false positives), duplicate merge recall 1.000, line preservation 1.000 for both classes, and the threshold for zero distinct false-positive at 0.973.
- `results/gate-metrics.json` reports all twelve gate and write checks passing, covering the checkpoint gate, the default-off byte-identity and the merge and deprecate writes.
- `node scripts/recon-precision-benchmark.mjs` reproduces the precision rollup from a read-only corpus backup, exit 0.
- `node scripts/recon-gate-and-writes.mjs` reproduces the gate rollup from an in-memory database, exit 0.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **One corpus snapshot, one embedder.** The precision and separation numbers are measured on one read-only backup of the live corpus under the active `nomic-embed-text-v1.5` embedder. A different embedder with more spread between near-identical and merely-related documents could change the separation, but the cut verdict holds for the shipped embedder.
- **The distinct-pair sample is capped to sixty folders.** The largest sixty same-folder groups are sampled for the 5888 distinct pairs. The cap bounds the run on the 17605-row corpus and the largest folders are the densest dedup targets, so the false-positive rate is measured where a merge is most likely to fire, but the absolute pair count would grow with a wider sample.
- **The content-hash exact-duplicate alternative is recommended, not built.** This phase cuts the cosine-band path and names the deterministic content-hash merge as the safe replacement, but building it is a separate follow-up driven after the verdict lands.
- **The assistive shadow path is out of scope.** `SPECKIT_ASSISTIVE_RECONSOLIDATION` is already graduated and advisory-only, and this benchmark does not re-measure it, it only notes that it already captures the non-destructive redundancy-flagging value.
<!-- /ANCHOR:limitations -->
