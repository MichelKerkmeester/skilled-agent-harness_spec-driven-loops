---
title: "Decision Record: Manual Test Verification and Fixes"
description: "Fable-5 adjudication for the BM25 scoped fill-limit regression and chosen product fix."
trigger_phrases:
  - "Fable-5 bm25 decision"
  - "A-incremental BM25 decision"
  - "scoped fill limit regression decision"
importance_tier: "normal"
contextType: "decision"
parent: "../spec.md"
predecessor: "004-recorded-failure-closure"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/006-speckit-surface-alignment/005-manual-test-verification-and-fixes"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Record Fable-5 BM25 adjudication"
    next_safe_action: "Run strict validation for the surface-alignment parent"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/005-manual-test-verification-and-fixes/decision-record.md"
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/005-manual-test-verification-and-fixes/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-test-verification-and-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Manual Test Verification and Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-05 |
| **Decision Owner** | Fable-5 adjudication requested as "let fable 5 decide" |
| **Scope** | BM25 scoped fill-limit regression |
| **Implemented In** | Commit `e4fcccc320` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:context -->
## 2. CONTEXT

The manual verification and stress harness found that scoped BM25 results could shrink below `limit` because `bm25Search` over-fetched only `candidateLimit = Math.max(limit, limit*3)`. High-TF out-of-scope documents could crowd the candidate set before metadata filtering, leaving too few in-scope survivors. In adversarial fixtures this produced 0 scoped results where the contract expected filled results.

The failure was masked by test drift in `bm25-scope-then-limit-stress.vitest.ts`, specifically the missing `deleted_at` column and an intercept string mismatch. That drift was corrected in the same shipped fix commit.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:decision -->
## 3. DECISION

Fable-5 selected **Decision A: product fix**, with refinement **A-incremental**.

The accepted fix restores corpus-bounded candidate fill for scoped/database searches:

| Condition | Candidate Limit |
|-----------|-----------------|
| `specFolder` or database scope present | `index.getStats().documentCount` |
| No scope/database filter | `limit` |

The refinement keeps the useful performance saving by resolving metadata in rank order in 500-id batches and exiting early once `limit` scoped survivors are found. It does not relax fail-closed guards.
<!-- /ANCHOR:decision -->

---

<!-- ANCHOR:evidence -->
## 4. EVIDENCE

| Evidence | Finding |
|----------|---------|
| 2026-06-11 fix `6c0e1dee207` | Corpus-bounded over-fetch was deliberate scoped-search behavior, and comments remained in the file. |
| 016/010 performance commit `d17b0d7b99` | Introduced `limit*3` while claiming it changed performance "without changing what search returns". |
| Test drift commit `8142e1dae3` | Deleted-column drift masked the scoped fill-limit regression. |
| Empirical A/B | Current behavior showed 0/25 and 0/75 in adversarial scoped fixtures, while `d17b0d7b99~1` produced 3/3. |
| BM25 engine behavior | Both BM25 engines full-sort regardless of `k`, so the `limit*3` cap saved only metadata SELECT volume, not ranking work. |
| Post-fix verification | `stress:harness` 45/45, `hybrid-search.vitest` 102/102, `tsc` clean, regression baseline delta 0. |
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:alternatives -->
## 5. ALTERNATIVES CONSIDERED

| Option | Outcome | Reason |
|--------|---------|--------|
| Straight revert of line 508 | Rejected in favor of A-incremental | Correct, but would re-inflate metadata SELECTs instead of preserving the useful incremental optimization. |
| Option B: relax the test | Rejected | Would declare the core scoped fill-limit contract out-of-contract and bless the regression. |
| Keep `limit*3` as intent | Rejected | Evidence shows the change claimed no behavior difference and regressed deliberate corpus-bounded scoped fill behavior. |
<!-- /ANCHOR:alternatives -->

---

<!-- ANCHOR:consequences -->
## 6. CONSEQUENCES

- Scoped BM25 search again has enough candidates to fill `limit` after scope filtering.
- Metadata SELECT volume remains bounded by rank-ordered 500-id batches and early exit.
- The adversarial stress fixture is valid again after schema/intercept drift correction.
- Future performance work must preserve scoped fill semantics, not only unscoped ranking cost.
<!-- /ANCHOR:consequences -->

---

<!-- ANCHOR:follow-up -->
## 7. FOLLOW-UP

- No further BM25 fill-limit action remains in this phase.
- Lexical-overlap-quality-gate remains a separate FTS/016 owner call and is not covered by this decision.
<!-- /ANCHOR:follow-up -->
