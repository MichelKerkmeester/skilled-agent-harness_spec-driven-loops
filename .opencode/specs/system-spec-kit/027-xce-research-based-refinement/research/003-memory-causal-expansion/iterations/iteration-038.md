---
iteration: 038
rq: RQ-N9
phase_target: implementation-sequencing
newInfoRatio: 0.62
verdict: ADAPT
---

# Iteration 038 — RQ-N9: Optimal Implementation Sequence for 027 Memory Phases 002-008

## Summary

This iteration synthesises all prior research (pt-01..04 and iterations 015-029) into a ranked implementation roadmap for the seven memory-system phases remaining in 027 after the 028 split. The ranking maximises value/risk ratio by prioritising correctness safety first, foundational plumbing second, additive features third, and high-uncertainty or cross-boundary work last.

The key conclusion is that **two phases can be merged** (004 into 003), and **one phase-parent (008) should be treated as a delivery shell** rather than an implementation target — its five children are individually sequenced into the main ladder.

---

## Context Files Read

- `002-memory-write-safety/spec.md` — P0 priority, LOC ~50-80 prod + 60-100 tests, no blockers (`002-memory-write-safety/spec.md:59,65`)
- `003-incremental-index-foundation/spec.md` — Level 3, DAG-aware scan planner, no hard blockers beyond schema extensions (`003-incremental-index-foundation/spec.md:43-50,80-130`)
- `004-causal-edge-tombstones/spec.md` — Level 2, depends on causal-edges schema in place; 005 explicitly blocks on 004 (`004-causal-edge-tombstones/spec.md:43-47`; `005-metadata-edge-promoter/spec.md:blockers:- "004"`)
- `005-metadata-edge-promoter/spec.md` — blocks on 004; incremental blast radius because it only writes `auto`-provenance edges and never overwrites manual ones (`005-metadata-edge-promoter/spec.md:REQ-007,REQ-008`)
- `006-write-path-reconciliation/spec.md` — blocks on 003 for DAG action-plan; succeeds 005 in dependency chain (`006-write-path-reconciliation/spec.md:blockers:- "003"`)
- `004-semantic-trigger-fallback/spec.md` — no hard blockers; LOC ~280-430 prod + 180-280 tests; false-positive risk is the primary concern (`004-semantic-trigger-fallback/spec.md:description,LOC budget`)
- `005-learning-feedback-reducers/spec.md` — phase parent with 5 children; child 001-aggregator depends on 002; total family LOC ~70+370+265+385+100 = ~1190 (`005-learning-feedback-reducers/spec.md:57-63`)
- `research/research.md` — merged synthesis; pt-04 per-phase verdicts and open questions (`research/research.md:25-45`)
- `research/sub-packet-amendments.md` — pt-02 amendment: 002 P0 correctness fixes should not wait on eval; P0 ordering decision explicit (`research/sub-packet-amendments.md:Phase 004 amendments`)
- `research/027-xce-research-pt-04/research.md` — Phase 002 KEEP_AS_IS; Phase 008 REVISE_SCOPE; Phase 009 (now 008-family) split recommended (`research/027-xce-research-pt-04/research.md:§2`)
- `research/deltas/iter-029.jsonl` — RQ-B5 synthesis: rerank client extraction is higher-leverage than shared cache; feedback-reducer family LOC estimates confirmed (`research/deltas/iter-029.jsonl:phase_scaffolds`)

---

## Findings

### F-038-001 — Phase 002 is the mandatory first ship because it is a P0 safety blocker for the entire feedback-reducer family

**Verdict**: ADOPT
**Cite**: `002-memory-write-safety/spec.md:49` — "Ordering decision: '009 P0 fixes before reducers' and before all code_graph phases in the refreshed 027 sequence."
**Cite**: `002-memory-write-safety/spec.md:59,65` — Priority P0, LOC ~50-80 prod + 60-100 tests, no blockers.
**Cite**: `005-learning-feedback-reducers/spec.md:59` — 008/001-aggregator "Depends On: 027-xce-research-based-refinement/002-memory-write-safety".

The three P0 fixes (auto-provenance cap broadening, manual-edge overwrite guard, retention-sweep tier basement gap) are small and correctness-critical. Shipping them first unblocks the entire 008 learning-reducer family and prevents silent data corruption in the causal graph before any volume-increasing phases (005, 007) land. Blast radius is minimal — three surgical fixes to existing handlers with no schema changes. Acceptance criteria are fully specified.

**LOC estimate**: ~50-80 production + ~60-100 tests = **~110-180 total**

---

### F-038-002 — Phases 003 and 004 should ship together (MERGE into a single sprint) because 004 is a prerequisite of 005 and shares the same schema migration surface

**Verdict**: ADAPT (recommend merge-sprint, not structural merge of spec files)
**Cite**: `004-causal-edge-tombstones/spec.md:43` — "Successor: 005-metadata-edge-promoter"; "005 depends on this cleanup foundation before increasing generated edge volume."
**Cite**: `005-metadata-edge-promoter/spec.md:blockers:- "004"` — explicit hard blocker.
**Cite**: `003-incremental-index-foundation/spec.md:Predecessor:001-rename, Successor:004-causal-edge-tombstones` — 003 feeds 004 in spec chain.

Phase 003 adds schema columns (`chunk_id`, `chunk_fingerprint`, `memoization_records`, `dependency_edges`) in a schema migration. Phase 004 adds `causal_edge_tombstones` to the same migration surface. Both are Level 2/3 schema-extension-first phases with no runtime-behavior change until downstream callers use the new columns. Running them back-to-back in a single schema migration sprint avoids a second DB-migration deployment window, reduces total test-fixture churn, and removes the "004 depends on 003 schema being stable" sequencing ambiguity.

The spec files should stay separate (each has its own acceptance criteria), but the PR delivery should be batched into one branch. The merge-sprint pattern is already used in the 028 code-graph sequence.

**LOC estimate**: 003 ~160-240 + 004 ~80-120 = **~240-360 total (merge-sprint)**

---

### F-038-003 — Phase 005 has small blast radius and clear acceptance criteria; ships immediately after the 003+004 merge-sprint

**Verdict**: ADOPT
**Cite**: `005-metadata-edge-promoter/spec.md:REQ-004` — "Promoted rows include `created_by='auto'`, `extraction_method='frontmatter'`, `confidence=1.0`."
**Cite**: `005-metadata-edge-promoter/spec.md:REQ-007` — "Auto edges participate in lifecycle cleanup" via 004 tombstone path.
**Cite**: `005-metadata-edge-promoter/spec.md:REQ-008` — "If a manual edge already exists for the same identity, promoter does not reduce strength, evidence, or creator without explicit policy."

Phase 005 is deterministic, idempotent, and additive-only. It never overwrites manual edges, targets only structured frontmatter fields (no LLM extraction), and routes stale-edge cleanup through the 004 tombstone path already in place. The blast radius is bounded to new `auto` rows in `causal_edges`; rollback is safe (delete all rows where `created_by='auto'`). Acceptance criteria cover idempotency (REQ-003), provenance (REQ-004), direction semantics (REQ-005), and unresolvable-target handling (REQ-006).

**LOC estimate**: ~120-200 production + ~80-140 tests = **~200-340 total**

---

### F-038-004 — Phase 006 (statediff reconciliation) has the highest architectural risk of the non-008 phases; should ship after 003+004+005 are proven stable

**Verdict**: ADAPT
**Cite**: `006-write-path-reconciliation/spec.md:blockers:- "003"` — hard dependency on 003 DAG planner.
**Cite**: `006-write-path-reconciliation/spec.md:Predecessor:005-metadata-edge-promoter` — chains after 005.
**Cite**: `006-write-path-reconciliation/spec.md:REQ-004` — "Stale deletes remain guarded by replacement-index success. Existing behavior that defers stale cleanup after failed replacement indexing is preserved in statediff planning."

Phase 006 replaces the existing scattered post-mutation reconciliation pattern with a typed action plan. This is the highest-risk memory-system phase because it touches the write path for all durable projections (`memory_index`, embeddings, causal edges). The action-plan model must preserve existing safety behaviour under REQ-004 (stale-delete guard). It also introduces subscriber dispatch (alias conflict, cache invalidation) which creates new call-ordering sensitivities.

Shipping it after 005 is validated means the auto-edge volume from 005 serves as a realistic load for the new reconciliation layer's idempotency test (REQ-003).

**LOC estimate**: ~200-320 production + ~140-220 tests = **~340-540 total**

---

### F-038-005 — Phase 007 is the highest-value independent phase; can ship in parallel with 006 because it has no schema blockers from 003-005

**Verdict**: ADOPT
**Cite**: `004-semantic-trigger-fallback/spec.md:description` — "Lexical remains primary precision path; semantic adds paraphrase recall as feature-flagged UNION."
**Cite**: `004-semantic-trigger-fallback/spec.md:blockers:[]` — no declared blockers.
**Cite**: `004-semantic-trigger-fallback/spec.md:LOC budget` — ~280-430 production + ~180-280 tests.
**Cite**: `research/deltas/iter-029.jsonl:f-iter010-003` — "cross-encoder.ts is already provider-generic enough to become a shared RerankClient consumed by memory and CocoIndex candidate adapters."

Phase 007's semantic trigger matching reuses the existing Voyage-4 embedding cache and adds a new derived table (`memory_trigger_embeddings`) that is entirely read-alongside the existing lexical path. The feature is gated behind an ENV flag (default-off), which means production systems are unaffected until the shadow-eval period passes. The false-positive risk documented in the spec (`004-semantic-trigger-fallback/spec.md:221-226`) is mitigated by the lexical-first, semantic-UNION design and cognitive-activation guards.

Because 007 has no blockers on 003/004/005/006, it can be developed concurrently with 006 and shipped before or after depending on team capacity.

**LOC estimate**: ~280-430 production + ~180-280 tests = **~460-710 total**

---

### F-038-006 — Phase 008 family should be sequenced as 002-dependency-first, then sub-phases in dependency order; the phase-parent shell is not an implementation target

**Verdict**: ADAPT
**Cite**: `005-learning-feedback-reducers/spec.md:57-63` — child table: 001-aggregator→{002-coco-rerank-consumer, 003-causal-reducer, 004-retention-reducer}→005-env-tests-integration.
**Cite**: `005-learning-feedback-reducers/spec.md:39` — "P0 correctness fixes are owned by 012." [Note: renumbered to 002 in current scaffold.]
**Cite**: `research/027-xce-research-pt-04/research.md:Phase 009` — "split P0 correctness fixes from learning reducers" — already enacted as phase 002.

The 008 family ships last because it depends on 002 (P0 fixes) and because its causal-reducer child (003-causal-reducer ~265 LOC) assumes the tombstone lifecycle from phase 004 is stable before session-trace-inferred edges are written at volume. The recommended delivery order for 008's children is: 001-aggregator → 003-causal-reducer → 004-retention-reducer → 002-coco-rerank-consumer → 005-env-tests-integration. The coco-rerank-consumer is last within the family because it crosses a language boundary (Python) and requires the most external coordination.

**LOC estimate for full 008 family**: ~70+265+385+370+100 = **~1190 total**

---

## Ranked Implementation Roadmap

| Rank | Phase | Title | LOC estimate (prod+tests) | Value | Risk | Rationale |
|------|-------|-------|--------------------------|-------|------|-----------|
| 1 | 000 | Memory Write Safety | ~110-180 | HIGH (P0 safety) | LOW (3 surgical fixes, no schema change) | Blocks entire 008 family; must ship first per pt-04 ordering decision (`002-memory-write-safety/spec.md:49`) |
| 2 | 003+004 | Memoization DAG + Tombstone Lifecycle (merge-sprint) | ~240-360 | HIGH (foundation for 005,006) | MEDIUM (schema migration + DAG planner) | Co-located schema migration reduces deployment windows; 004 is explicit prereq of 005 (`005-metadata-edge-promoter/spec.md:blockers`) |
| 3 | 000 | Metadata Edge Promoter | ~200-340 | HIGH (automatic causal graph population) | LOW (additive-only, idempotent, never overwrites manual edges) | Small blast radius; acceptance criteria fully specified; ships immediately after 003+004 |
| 4 | 000 | Memory Semantic Triggers | ~460-710 | HIGH (recall improvement) | MEDIUM (false-positive risk, mitigated by default-off + guards) | No blockers from 003-006; can develop in parallel with 006; ships when shadow-eval period passes |
| 5 | 000 | Write-Path Reconciliation | ~340-540 | HIGH (write-path correctness) | HIGH (touches all durable projections) | Ships after 005 stable; REQ-004 safety guard must be preserved; highest architectural risk of all non-008 phases |
| 6 | 008/001 | Feedback Aggregation Foundation | ~70-120 | MEDIUM (enables reducer family) | LOW (thin aggregation module, TS only) | First 008 child; unblocks 003-causal-reducer and 004-retention-reducer |
| 7 | 008/003 | Session-Trace Causal Reducer | ~265-380 | HIGH (automated causal graph learning) | MEDIUM (writes auto-inferred edges at session volume) | Depends on 008/001; ships after tombstone lifecycle (004) is stable |
| 8 | 008/004 | Retention Reducer | ~385-520 | HIGH (learned retention/decay) | MEDIUM (modifies retention parameters under feedback signal) | Depends on 008/001; parallel-capable with 008/003 |
| 9 | 008/002 | Coco Rerank Consumer | ~370-500 | MEDIUM (CocoIndex feedback loop) | HIGH (Python cross-boundary, `feedback_rerank_weights` SQLite table) | Depends on 008/001; ships after TS reducers validated to avoid cross-language coupling before trust established |
| 10 | 008/005 | Env+Tests Integration Closeout | ~100-160 | MEDIUM (ENV_REFERENCE flags + integration tests) | LOW (docs + flag wiring) | Last; depends on all four 008 siblings complete |

---

## Merge / Split / Defer Flags

| Phase | Action | Rationale |
|-------|--------|-----------|
| 003+004 | **MERGE-SPRINT** (keep separate specs, ship same branch) | Co-located schema migration; 004 is required prerequisite of 005; saves one deployment window (`004-causal-edge-tombstones/spec.md:43`; `005-metadata-edge-promoter/spec.md:blockers`) |
| 008 (parent) | **TREAT AS DELIVERY SHELL ONLY** | Phase-parent spec.md and graph-metadata.json only; implementation lives in children 001-005 |
| 000 | **KEEP** but can parallelize with 006 | No schema blockers; development can overlap with 006 provided 007 stays default-off until shadow-eval passes |
| None | **DEFER** | No phase is deferral-grade; all seven phases (002-008) have resolved acceptance criteria and no unresolved research debt per pt-04 audit |
| None | **SPLIT** | No phase requires splitting; 002 was already the split of the old 009 Sub-Phase 1 P0 bundle (`002-memory-write-safety/spec.md:31`) |

---

## LOC Grand Total (conservative / aggressive)

| Range | Total LOC (prod+tests) |
|-------|----------------------|
| Conservative | ~1600 |
| Aggressive | ~2560 |

This is consistent with the pt-03 synthesis estimate of ~1400-2520 for the five proposed phases (`research/research.md:31-35`), adjusted for the two additional phases (002 and the 008 family) surfaced by pt-04.
