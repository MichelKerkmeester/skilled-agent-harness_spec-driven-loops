---
title: "Implementation Plan: Novel Embedding-Drift Monitoring plus Alerting"
description: "Stamps each chunk vector with a per-chunk embedding regime fingerprint and runs a standing report-only detector that alerts on a mixed-regime corpus, so the re-index path gains the mixed-vector guard it never specified."
trigger_phrases:
  - "embedding drift monitor plan"
  - "mixed vector guard plan"
  - "embedding regime fingerprint plan"
  - "embedding context version seam"
  - "embedding drift detector plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/004-novel-research/020-novel-embedding-drift-monitor"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored PLANNED plan for the fingerprint census detector seams"
    next_safe_action: "Build the regime fingerprint field on the vector record"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-028-005-020-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The detector emits findings and alerts only and never re-embeds or mutates a vector"
---
# Implementation Plan: Novel Embedding-Drift Monitoring plus Alerting

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP cache layer and sweep scripts) |
| **Framework** | system-spec-kit embedding cache plus the standing drift-guard set |
| **Storage** | The persistent vector record on disk and the roughly 2022-row corpus |
| **Testing** | vitest unit checks plus a seeded two-regime scratch corpus |

### Overview
This phase gives the re-index path the mixed-vector guard research section 4 names as missing. A per-chunk regime fingerprint composed of `embedding_context_version` plus the model id plus a normalizer fingerprint is stamped on each vector record at the embed seam. A coverage readout counts chunks per live fingerprint and classifies the corpus as single-regime or mixed-regime. A standing report-only detector reads that census and alerts when more than one live regime is present. The detector emits findings and alerts only, never vector rows, so it is floor-bypassing by construction.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive metadata stamp plus a read-only meta-check over the index. The fingerprint binds to the same regime inputs the cache key already uses, and the detector is wired as a standing drift guard rather than a vector-producing change.

### Key Components
- **Regime fingerprint field**: at `embedding-cache.ts` the persistent vector record gains the `embedding_context_version` plus model id plus normalizer fingerprint fields, stored alongside the existing PK near line 157.
- **Embed-seam stamp**: at `shared/embeddings.ts` near the in-process LRU key at lines 309-311 the fingerprint is computed from inputs already in hand so the stamp matches the cache identity byte for byte.
- **Drift detector**: a new `scripts/sweep/detect-embedding-drift.ts` reads the coverage readout, counts live regime fingerprints, and emits a report-only finding plus an alert on a mixed-regime corpus.
- **Regime backfill**: a new `scripts/sweep/backfill-embedding-regime.ts` runs dry-run first and applies only on a flag, stamping the existing corpus through the additive write path so the census reads a real per-regime count.

### Data Flow
A chunk is embedded, the embed seam computes the regime fingerprint from the same inputs the cache key uses, and the cache layer writes that fingerprint onto the vector record. The census scans the records and counts chunks per live fingerprint. The detector reads the census on the standing drift schedule and fires a report-only alert that names the per-regime count when more than one regime is live. No prod-mode read and no source body is touched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `embedding-cache.ts` vector record (PK near line 157) | The persistent vector store with no regime column today | Add the fingerprint fields next to the PK | grep `embedding_context_version` resolves to the new field and the legacy read path is unchanged |
| `shared/embeddings.ts` LRU key (lines 309-311) | The embed seam that builds the cache identity | Compute the fingerprint from the same regime inputs the key uses | a same-regime byte-identity test proves two chunks fingerprint identically |
| `scripts/sweep/detect-embedding-drift.ts` | Does not exist | Create the report-only detector | a two-regime scratch corpus fires a mixed-regime alert and no vector is rewritten |
| `scripts/sweep/backfill-embedding-regime.ts` | Does not exist | Create the dry-run-then-apply backfill | a dry-run reports the would-stamp count and an apply makes the census read a real per-regime count |
| Standing drift-guard set | Holds coverage, storage, and cross-copy guards with no embedding channel | Register the embedding-drift channel | the detector appears in the drift-guard set so a mixed regime is caught on the standing schedule |

Required inventories:
- Same-class producers: `rg -n 'embedding_context_version|embeddingCoverage|coverageThreshold|regime' .opencode/skills/system-spec-kit`.
- Consumers of changed symbols: `rg -n 'embedding_context_version|embedding-cache|detect-embedding-drift' . --glob '*.ts' --glob '*.json' --glob '*.md'`.
- Matrix axes: regime count (single vs mixed), fingerprint state (stamped vs null legacy), drift source (model change vs normalizer-only change), run mode (off vs on).
- Algorithm invariant: the fingerprint is derived from the same regime inputs the cache key uses, and the detector never mutates a vector or a body.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the vector record PK seam near `embedding-cache.ts:157` and the field shape for the new fingerprint columns
- [ ] Confirm the embed seam and the LRU key at `shared/embeddings.ts:309-311` so the stamp matches the cache identity
- [ ] Confirm the standing drift-guard registration contract so the new channel slots next to the coverage and storage guards

### Phase 2: Core Implementation
- [ ] Add the `embedding_context_version` plus model id plus normalizer fingerprint fields to the vector record, default-off
- [ ] Compute and write the fingerprint at the embed seam so two same-regime chunks stamp identically
- [ ] Build the coverage readout that counts chunks per live regime and classifies single-regime or mixed-regime
- [ ] Build `detect-embedding-drift.ts` report-only and register it as a standing drift guard
- [ ] Build `backfill-embedding-regime.ts` dry-run-then-apply over the additive write path

### Phase 3: Verification
- [ ] Same-regime byte-identity test proves two chunks of one regime fingerprint identically
- [ ] Seeded two-regime scratch corpus fires a mixed-regime alert and a single-regime corpus does not
- [ ] Backfill dry-run reports the would-stamp count and an apply makes the census read a real per-regime number
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The fingerprint is derived from the same regime inputs the cache key uses | vitest |
| Integration | The detector verdicts single-regime versus mixed-regime and stays report-only | vitest plus a seeded scratch corpus |
| Manual | A backfill dry-run then apply makes the census read a real per-regime count | the backfill script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 014-chunk-prefix | Internal | Green | This phase is the coverage guard a C1 partial re-embed needs and shares the `embedding_context_version` field |
| 015-prodmode-recall-gate | Internal | Green | This phase protects the C2 prod read from a mixed-regime confound but is not itself C2-gated |
| Standing drift-guard set | Internal | Green | The detector cannot register as a standing channel without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A vector body changes beyond the additive fingerprint field, or the detector mutates a vector or a source doc.
- **Procedure**: Revert the fingerprint field and the embed-seam stamp, drop the detector and backfill scripts, and leave the existing corpus on its prior read path.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1 (Confirm) ────┘
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
| Setup | Low | 1-2 hours |
| Core Implementation | Medium | 5-8 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **8-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The fingerprint field lands default-off so the existing read paths stay byte-identical
- [ ] A same-regime byte-identity baseline is captured before the stamp goes live
- [ ] The detector is report-only and never wired to a re-embed trigger

### Rollback Procedure
1. Disable the fingerprint stamp so the embed seam reverts to its prior identity
2. Drop the `detect-embedding-drift.ts` and `backfill-embedding-regime.ts` scripts
3. Remove the embedding channel from the standing drift-guard set
4. Confirm the existing eval and prod read paths read byte-identical to baseline

### Data Reversal
- **Has data migrations?** Yes, the additive backfill stamps the existing corpus
- **Reversal procedure**: The fingerprint is an additive column, so a revert drops the column read and leaves the vector bodies intact
<!-- /ANCHOR:enhanced-rollback -->
