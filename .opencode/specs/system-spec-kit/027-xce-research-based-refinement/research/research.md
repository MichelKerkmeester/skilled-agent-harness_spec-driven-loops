---
title: "027 XCE Research-Based Refinement — Continuation 22 Synthesis (vs closed-026 + CocoIndex deprecation + live reality)"
parts: [continuation-22-061-080]
iterations: "061-080 (20)"
executor: "cli-opencode openai/gpt-5.5-fast --variant xhigh (read-only); orchestrator-written artifacts"
session: "2026-06-05-027-continuation-22-coco-026-drift"
status: "continuation-22-canonical; supersedes prior XCE-adoption framing for 027 planning purposes"
prior_archive: "research-pre-c22-archive.md (pt-01..04 + iterations 030-060)"
merged_at: "2026-06-05"
---

# 027 XCE Refinement — Continuation 22 Synthesis

**Goal.** Revalidate/refine 027's 8 planned phases against (a) the now-CLOSED 026 program, (b) current live system-spec-kit reality, (c) the **CocoIndex deprecation** (purge all coco scope), and (d) the near-exhausted XCE corpus. Per-phase verdict in {UPDATE, REFINE, DRIFT-FIX, REMOVE, ADD}.

> This continuation **complements** the 2026-06-05 relevance-audit (`research/027-relevance-audit-2026-06-05/`), which was single-model + ad-hoc-driver and predated both the coco deprecation and 026's closure. The prior XCE-adoption archive lives at `research-pre-c22-archive.md`.

> **Follow-up applied (2026-06-06):** Phase-0 shipped — (a) CocoIndex purge across the 027 specs (008/002 deleted; refs rewritten); (b) drift reconcile (026-status, continuity pointer, 002 `028/*`+`009→008` refs, `000` child-list); (c) production code fixes (`STATE_LIMITS` export + `DEFAULT_RELATION_TARGETS`/`MEMORY_CAUSAL_OUTPUT_RELATIONS` aligned to canonical `RELATION_TYPES`) — 73 tests green, tsc clean, daemon recycled, **live-verified**; (d) targeted spec rescopes (004 delete-site inventory + handler paths, 007 `storage→search` path sweep + `profile_key`/`input_kind` cache identity). The audit had already propagated 005/006/001 rescopes. Remaining = the actual phase feature implementation (`/speckit:implement`).

---

## 1. Executive Summary

**027's intent is intact. This is a rescope + a CocoIndex amputation + a drift reconcile — not a rewrite. Zero phases are already implemented; nothing structurally blocks the program.**

Three headline results that **correct the prior audit**:

1. **Path drift was overstated.** Only **007** has stale affected-file paths. Phases 002/003/004/005/006/008 already cite live paths. The audit's "packet-wide path-refresh prerequisite" is wrong. *(iter 066)*
2. **The CocoIndex purge is one DELETE + targeted REWRITEs** — `008/002-coco-rerank-consumer` is the only true deletion; everywhere else coco is incidental/provenance text and **no in-scope requirement disappears**. *(iter 061, 062, 067)*
3. **The `028` number has been reused** (`028-026-program-research`). Every `028/*` reference in 027 is stale — coco-028 children are dead, code-graph-028 moved to `z_future/code-graph-and-cocoindex/`. This is a **misrouting hazard** the purge must fix. *(iter 078)*

Also: 002's P0-2 (`created_by` clobber) is **NOT** closed by the shipped conflict guard (distinct code path) — my own Part-1 hypothesis was refuted by live code. *(iter 064)*

---

## 2. Per-Phase Verdict Matrix (the core question)

| Phase | Verdict | Headline | Evidence |
|---|---|---|---|
| **001** peck-teachings | **REFINE (003 only)** | 003-current-state-discipline already mostly INFO; residual "warn" wording to clean. 002/004 as-is. 028-peck fold confirmed. | iter 071 |
| **002** memory-write-safety | **STILL-RELEVANT (minimal repath)** | All 3 P0s real; **P0-2 distinct from shipped conflict guard**; spec already carries correct storage/governance paths. | iter 064, 066 |
| **003** incremental-index | **STILL-RELEVANT (as-is)** | 026 self-maintaining scan + async enrichment are hygiene only; memo/DAG/chunk-fingerprint foundation unbuilt. | iter 068 |
| **004** causal-tombstones | **NEEDS-RESCOPE** | **14 live delete-sites** (audit had 4); `lifecycle_generation`→`edge_lifecycle_generation` (collides with in-memory `causalEdgesGeneration`); stale handler paths (`memory-crud-*`). | iter 069 |
| **005** metadata-promoter | **KEEP-NARROWED** | relation-backfill owns DB backfill; 005 keeps only `parent_id/children_ids/parentChain` + `confidence`/`extraction_method` columns; DROP manual.* + doc-chain; fix internal REQ conflict. | iter 063, 072 |
| **006** write-path/statediff | **NEEDS-RESCOPE** | Sync `DiffAction` for durable rows (hook `memory-save.ts:2534-2640`) + **async pending-marker replay** for enrichment; NOT same-response graph writes. | iter 070 |
| **007** semantic-triggers | **NEEDS-RESCOPE (largest; ship last)** | Rescope cache/schema **identity** to `(content_hash, profile_key, input_kind, model_id, dimensions)` + Nomic-768; `0.84`/`0.04` thresholds dead (Voyage); `028/004` dep → shadow evidence; **stale paths** (storage→search, embeddings→shared). | iter 066, 067 |
| **008** learning-reducers | **REMOVE `002-coco` + REWRITE family** | `008/002-coco-rerank-consumer` = DELETE (keep numbering gap); 001 = REUSE-EXTRACT `batch-learning.ts`; 004 needs `STATE_LIMITS` prod export; 003 needs `DEFAULT_RELATION_TARGETS` align. | iter 061, 065, 074, 075 |

Cross-cutting: **vocab NEEDS-FIX** (iter 075) · **XCE EXHAUSTED** (iter 076) · **parent drift moderate** (iter 073) · **028 all-stale** (iter 078) · **ordering NEEDS minor update** (iter 077).

---

## 3. CocoIndex Purge Manifest

**One DELETE + targeted REWRITEs.** No in-scope requirement/AC disappears (iter 062). Coco substrate (`cocoindex_code/`, `mcp-coco-index/`, `SPECKIT_COCOINDEX_FEEDBACK_RERANK`, coco-028 children) is gone.

### 3a. DELETE (whole sub-phase)
- `008-learning-feedback-reducers/002-coco-rerank-consumer/` — structurally coco-dependent (Python reducer, coco feedback JSONL, coco-index rerank, soft-dep on coco-028). **Keep the numbering gap** (do NOT renumber 003/004/005; renames would cascade). *(iter 061, 074)*

### 3b. REWRITE (strip coco, keep the local requirement)
| Area | Action |
|---|---|
| **008 family** (`spec.md`, `001-aggregator`, `003-causal`, `004-retention`, `005-env-tests`) | Drop coco refs + the `028/006-coco-intent-steering` soft-dep; rewrite "three consumers/five children" → two-consumer `001 → {003,004} → 005`; remove 002 from `005-env-tests/description.json` `manual.depends_on`; fix `008/description.json` + `graph-metadata.json` `children_ids`. *(iter 061, 074)* |
| **002/003/004/006 specs** | Coco is incidental (002 out-of-scope line → REMOVE) or research-basis/vocabulary (003 memoization, 004 lifecycle/tombstone, 006 statediff → REWRITE to local equivalents). Sync the `graph-metadata.json` `causal_summary` strings. *(iter 062)* |
| **007 docs** | `plan.md:248` (028/008-coco), `decision-record.md:220` (028/005-cocoindex-fork), `implementation-summary.md:108` (mcp-coco-index touchpoint) → REMOVE/REWRITE. *(iter 067)* |

---

## 4. 026-Overlap Dedup (reuse, don't duplicate)

| 027 scope | Shipped 026 mechanism | Resolution |
|---|---|---|
| 005 metadata promotion | `relation-backfill.ts` (`lib/causal/`) — DB-chain/lineage/similarity/contradicts as `created_by='auto'` | **Narrow 005**: keep only `parent_id/children_ids/parentChain` index-time promotion + provenance columns; DROP doc-chain/lineage/manual.*. *(iter 063)* |
| 002 P0-2 created_by clobber | causal conflict guard (`hasConflictingValidEdge`/`detectContradictions`) | **Distinct path** — guard protects conflicting-relation invalidation; clobber is `insertEdge` same-key `created_by=?` update. **P0-2 still needed.** *(iter 064)* |
| 008/001 aggregator | `batch-learning.ts` `aggregateEvents`/`weightedScore`/`computedBoost`/min-support | **REUSE-EXTRACT**; add only query-id + first/last timestamps + reconciled `weightedHitCount`. *(iter 065)* |
| 003 incremental index | self-maintaining `memory_index_scan` + async enrichment | **No overlap** — 026 is hygiene; 003 foundation unbuilt; 003 must *preserve* scan lease/orphan/move-reconcile behavior. *(iter 068, 072)* |
| 004 tombstones | checkpoints v2 (`checkpoints.ts:1668` is a delete-site) | Add checkpoint snapshot/restore coverage for the tombstone table. *(iter 069, 072)* |

---

## 5. Path-Drift (corrected: audit overstated — only 007)

Live `lib/` truth: `lib/causal/` **exists** (`relation-backfill.ts`), `lib/storage/` (`causal-edges.ts`, `consolidation.ts`, `incremental-index.ts`), `lib/governance/` (`memory-retention-sweep.ts`), `lib/search/` (`vector-index-schema.ts`, `memory-summaries.ts`, `vector-index-store.ts`, `pipeline/stage4-filter.ts`), `lib/parsing/trigger-matcher.ts`, `lib/feedback/` (`batch-learning.ts`, `feedback-ledger.ts`), `shared/embeddings/` (resolver). `lib/triggers/` **absent**. *(iter 066)*

**Only 007 needs repath:** `storage/vector-index-schema.ts`→`search/…`; `storage/memory-summaries.ts`→`search/…`; `storage/vector-index-store.ts`→`search/…`; `lib/embeddings/*`→`shared/embeddings/{factory,auto-select}.ts`; planned `lib/triggers/semantic-trigger-matcher.ts` has no live dir (live lexical matcher is `lib/parsing/trigger-matcher.ts`). 004 has stale **handler** paths (`memory-health.ts`→`memory-crud-health.ts`, `memory-delete.ts`→`memory-crud-delete.ts`). *(iter 066, 069)*

---

## 6. Parent Drift + 028-Reuse Reconcile

| Drift | Fix |
|---|---|
| 027 `spec.md:86` says 026 "In Progress" | 026 is **Complete** (005 deferred). *(iter 073)* |
| `resource-map.md`/`graph-metadata.json` self-cite `.opencode/specs/...` but packet is `specs/...` | Align root. *(iter 073)* |
| `002/spec.md:64` references nonexistent `027/009-feedback-reducers` | → `008-learning-feedback-reducers`. *(iter 073)* |
| 3-way continuity conflict (frontmatter next-action vs resource-map vs `last_active_child_id=002`) | Reconcile to one pointer. *(iter 073)* |
| `000-release-cleanup` in spec+graph-metadata but not description.json children | Make consistent. *(iter 073)* |
| **All `028/*` refs stale** — number reused by `028-026-program-research` | coco-028 (`005-cocoindex-fork`, `006-coco-intent-steering`, `008-coco-memory-context-extras`) → **REMOVE**; code-graph-028 (`001-004`) → REPOINT to `z_future/code-graph-and-cocoindex/` or evidence-gate; `028/004-adoption-eval` → "equivalent shadow/promotion evidence". **Nothing blocks.** *(iter 078)* |

---

## 7. Vocab/Constants + ADDITIONS

**Vocab NEEDS-FIX** *(iter 075)*: canonical `RELATION_TYPES = {caused, enabled, supersedes, contradicts, derived_from, supports}` (schema CHECK matches). `DEFAULT_RELATION_TARGETS` diverges (omits `enabled`/`derived_from`, adds non-canonical `produced`/`cited_by`) — a **production stats bug** in `memory_causal_stats`, owned by **008/003** before its ENABLED floors. `STATE_LIMITS` (module-local at `lib/search/pipeline/stage4-filter.ts`, only via `__testables`) needs a production export, owned by **008/004**.

**ADDITIONS unlocked by 026 closure** *(iter 072)*: 002 reuse the auto-edge/manual-preservation guard seam; 003 preserve scan lease/orphan/replay + profile-scoped chunk cache keys; 004 add checkpoint/tombstone interaction; 005 add no-duplicate-vs-manual.* requirement; 006 hard sync/async split; 007 carry `profile_key`+`input_kind` in trigger embedding metadata + cache-only hot path; 008 reuse shared conflict/relation vocabulary, depend on 002 tier-basement.

**XCE EXHAUSTED** *(iter 076)*: no net-new memory-system signal; remains evidence-only (semantic→007, steering→local decision tree, impact/architecture→028 code-graph).

---

## 8. Recommended Re-Plan Sequence *(iter 079)*

**Phase 0 (mechanical prereqs — do first, gates everything):**
- **0A CocoIndex purge** (§3): delete `008/002-coco`; rewrite coco refs across 002/003/004/006/007/008; keep numbering gap.
- **0B Parent drift reconcile** (§6): 026-status, root-path, `028/*` cleanup, `009→008`, continuity, `000` child-list.
- **0C Constants/vocab** (§7): align `DEFAULT_RELATION_TARGETS`; export `STATE_LIMITS`.
- **0D Path-refresh 007 only** (§5).

**Implementation order:** `002 ‖ 003` (clean-ship core) → reshaped **008** after 002 (`001 → {003,004} → 005`) → **004** → **005** → **006** → **007 last**. 001 refine folds into Phase 0 docs cleanup.

### Ship-class table
| Phase | Class | Blocking prereq |
|---|---|---|
| 002 | **CLEAN-SHIP** | Phase 0 |
| 003 | **CLEAN-SHIP** | Phase 0 (build on existing scan) |
| 008 (family) | RESCOPE-THEN-SHIP | Phase 0C + 002; delete 002-coco |
| 004 | RESCOPE-THEN-SHIP | 003; 14-site inventory; lifecycle rename |
| 005 | RESCOPE-THEN-SHIP | 004; narrow scope; fix REQ conflict |
| 006 | RESCOPE-THEN-SHIP | 003+005; sync/async split |
| 007 | RESCOPE-THEN-SHIP | ship last; cache/schema identity |
| 001 | RESCOPE-THEN-SHIP | residual warn→INFO wording |
| 008/002-coco | **BLOCKED → DELETE** | dead coco scope |

### Top risks
- 007 cache/schema identity drift → rescope to live Nomic-768/`profile_key`/`input_kind`; ship last.
- 004 delete-site undercount → require the 14-site inventory + tests.
- 006 sync/async conflation → sync DiffAction for rows, async replay for enrichment.
- Cross-cutting coco/028/path drift → mandatory Phase 0 before any code.
- 005 scope creep back into manual.*/doc-chain → keep narrowed.

---

## 9. Convergence Report
- Stop reason: max_iterations (20/20 complete, 061-080).
- Iterations: 061-079 = 19 read-only gpt-5.5-fast xhigh analyses; 080 = synthesis (this doc).
- newInfoRatio trend: 0.74, 0.64, 0.35, 0.72, 0.72, 0.74, 0.86, 0.42, 0.72, 0.72, 0.55, 0.62, 0.72, 0.46, 0.72, 0.05, 0.34, 0.78, 0.18 — high-signal throughout; 076 (XCE) and 079 (synthesis) intentionally low (confirmation/consolidation).
- Method note: single-model (gpt-5.5-fast) per operator choice; complements the prior single-model audit. Load-bearing claims (embedding 768d, coco-rerank dead, 14 delete-sites, 028-reuse) carry direct `file:line`/existence citations in the per-iteration `prompts/iteration-NNN.out` files.

## 10. References
- Per-iteration evidence: `iterations/iteration-061.md` … `iteration-080.md` (+ raw `prompts/iteration-NNN.out`).
- Prior archive: `research-pre-c22-archive.md`.
- Resource map: `specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md`.
- Baseline complemented: `research/027-relevance-audit-2026-06-05/research.md`.
