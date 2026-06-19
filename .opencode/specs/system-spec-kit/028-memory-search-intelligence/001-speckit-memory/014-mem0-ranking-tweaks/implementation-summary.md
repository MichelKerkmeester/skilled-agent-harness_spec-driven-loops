---
title: "Implementation Summary: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)"
description: "Planning-state summary for the 06 external-memory-systems cheap ranking + extraction bundle. NOT IMPLEMENTED — this phase was authored as a re-plan; all 8 distinct candidates are PENDING with zero 030 commit coverage."
trigger_phrases:
  - "mem0 ranking tweaks summary 028"
  - "bm25 calibration implementation status"
  - "cascade extraction summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/014-mem0-ranking-tweaks"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning-state docs"
    next_safe_action: "Run gate-zero corpus reindex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-014-mem0-ranking-tweaks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

> **Status: PLANNING-STATE — NOT IMPLEMENTED.** This phase folder was authored as a re-plan deliverable. No candidate code has been written. All 8 distinct candidates are PENDING; none has a Wave-0 Wave-0 commit (a per-ID grep of the Wave-0 evidence returns zero matches for every requested ID). This summary records the planned scope and gating; it will be filled with real evidence when the phase is built.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/014-mem0-ranking-tweaks |
| **Completed** | Not started (planning-state) |
| **Level** | 2 |
| **Actual Effort** | 0 (planning only) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet — planning-state. The phase plans the **Mem0 ranking + extraction bundle**: query-length BM25 sigmoid calibration, entity cardinality penalty, spaCy lemmatization, declarative regex entity config, multi-pass cascade extraction, write-time LLM memory-linking, separate entity-store boost, and the verify-first content-hash reprocessing trigger.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Problem, scope, per-candidate STATUS (all PENDING) + research-cited acceptance criteria |
| `plan.md` | Created | Approach, gate-zero sequencing, shared-infra deps |
| `tasks.md` | Created | Setup / Implementation / Verification breakdown (all `[ ]` pending) |
| `checklist.md` | Created | Verification checklist (all unverified, planning-state) |
| `implementation-summary.md` | Created | This planning-state summary |

> Production code under `mcp_server/` (search pipeline, extraction, save handlers) + `shared/algorithms/rrf-fusion.ts` is named in the spec/plan seams but NOT yet modified.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Planning-state — no code delivered. The re-plan was authored by reading the authoritative 028 research: the `007-memory-systems` child (iterations 001/002/007/009/019 + deltas), `synthesis/06-memory-systems-findings.md`, and the roadmap MEMORY-SYSTEMS addendum. Per-candidate seam, evidence class, leverage/effort, and the adversarial-verify verdicts (iter-6 / iter-9) were pulled into the spec scope table; STATUS was set PENDING for all after a per-ID cross-check against the 030 Wave-0 done-record (zero matches). When built, the phase will execute Phase 1 (gate-zero reindex + always-on config), Phase 2 (flag-gated ranking + additive extraction), Phase 3 (parity, unit, reindexed recall benchmarks), with each candidate landing as a separate reversible change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| All 8 candidates marked PENDING | None appears in the 030 Wave-0 done-record (030 §14 cross-check = zero matches); this bundle was absent from the flat Wave-0 |
| 11 requested IDs collapse to 8 distinct candidates | `M0-`/`M-` prefix duplicates name the same 3 ranking candidates (BM25 calibration, cardinality penalty, lemmatization) |
| Gate-zero reindex precedes ranking work | Recall is unmeasurable against a ~25%-cold index (synthesis/06 + 07; regression-baseline rule) |
| Ranking tweaks flag-gated default-off | 027 doctrine: new results-affecting intelligence ships shadow-gated, earns activation on live evidence |
| Declarative regex config ships always-on | Correctness/config-class refactor; parity-proven equivalence to the inline 5 rules |
| Candidate 7 treated as shared-infra | No entity *vector* index exists; a scoring-only attempt is impossible (iter-6 REFINE) |
| Candidate 8 is verify-first | May collapse to NO-TRANSFER vs the existing `memory_index_scan` reindex path (iter-19 needs-verify) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Unit | Not run | - | Planning-state |
| Recall benchmark | Not run | - | Gated on the gate-zero reindex |
| Parity | Not run | - | Candidate 4 config equivalence pending |
| Checklist | Not started | 0% | All items `[ ]` (planning-state) |
| Strict validation | Pass | - | `validate.sh --strict` green on the doc set |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Default-off path adds zero recall latency | Not measured | Pending |
| NFR-P02 | Cascade + linking bound extra LLM passes | Not measured | Pending |
| NFR-C01 | Config reproduces 5 rules exactly | Not verified | Pending parity test |
| NFR-C02 | No ranking default-on without reindexed baseline | Enforced by plan | Pending build |
| NFR-R01 | Every candidate independently reversible | By design | Pending build |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No benefit numbers** — every leverage/effort tag is structural inference; none is benchmarked (028 roadmap caveat).
2. **Gate-zero dependency** — no recall candidate (1-3, 7) can be measured until the corpus reindex restores the ~25% cold rows.
3. **Candidate 7 blocked** — the entity-store boost needs a new entity vector index (shared-infra), and may belong to the Wave-2 semantic-edge-layer initiative.
4. **Candidate 8 unverified** — content-hash reprocessing may already be covered by the reindex path (would close as NO-TRANSFER).
5. **spaCy dependency open** — candidate 3's lemmatizer choice (heavy spaCy vs lightweight) is unresolved.
6. **Memory-ID-graph constraint** — the causal graph is memory-ID → memory-ID (not entity-node), so candidate 6 needs a reframe before build (iter-6 systemic finding).
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| None | None | Planning-state; no implementation deviations to record yet |
<!-- /ANCHOR:deviations -->
