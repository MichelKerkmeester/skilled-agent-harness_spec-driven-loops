# Deep Research: caura-memclaw (MemClaw) Fleet-Memory Teachings for Spec Kit Memory

<!-- ANCHOR:deep-research-caura-memclaw -->

**Packet:** `027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings`
**Lineage:** `2026-06-06-008-caura-memclaw-teachings` (generation 1, new) · folder-scoped iterations **001-020** (20)
**Executor:** cli-opencode `openai/gpt-5.5-fast --variant high`, read-only, orchestrator-driven parallel fan-out (width 4)
**Target:** `external/caura-memclaw-main` — MemClaw, a production fleet-memory system (multi-tenant, Postgres/pgvector, event-driven, MCP+REST; Apache-2.0)
**Consumer:** Spec Kit Memory — local single-user/single-tenant store (SQLite index + vector store; FSRS decay; importance tiers; causal edges; shadow-first feedback reducers; 37-tool MCP)
**Status:** Converged (adversarial round drove newInfoRatio to 0.25-0.34 on deeply-explored surfaces; all candidate teachings citation-verified against MemClaw source and adjudicated against ground truth).

---

## 1. EXECUTIVE SUMMARY

MemClaw is engineered for the **opposite deployment shape** to Spec Kit Memory: *dozens-to-thousands of agents sharing governed memory under multi-tenant isolation.* Its marquee value — **cross-agent self-improving memory** ("agent #17's mistake stops agents #1-40 repeating it") — has **no single-user analog** and is the single largest block of negative knowledge in this study.

The headline strategic finding concerns **027/008 (learning-feedback reducers)**, the highest-overlap child. MemClaw's feedback loop (`memclaw_evolve` → `memclaw_insights`) applies **direct, immediate, asymmetric** weight mutation (success `+0.10`, failure `-0.15`) to canonical memory weight, persists LLM-generated rules **active at confidence ≥ 0.5 with no shadow state**, and lets low weight feed stale-archival. For a small single-user corpus this is an **anti-pattern**: a single mis-attributed failure can demote a rare-but-correct memory with too few future events to recover it. This **validates 027/008's existing "default-off, shadow-first" stance** and argues 008 should be **scoped down** to event-capture + provenance + diagnostics first, **deferring active reducers** until measured ledger quality proves positive value.

The genuinely transferable teachings are **smaller and hardening-grade**: minimal idempotency receipts, explicit `source_kind` provenance with auto-cannot-overwrite-manual, first-tombstone-timestamp idempotence, natural-key idempotent edge promotion, compact audit for automated mutations, and a lightweight MCP tool-ownership map. Most of these **validate or sharpen existing 027 children (002-006)** rather than adding new scope; the residue that is genuinely new and doesn't fit an existing child is proposed as a small new child **`012-memclaw-derived-memory-hardening`** (see `sub-packet-proposals.md`; numbered 012 to avoid collision with the concurrent `006-peck-source-deep-mining` run's proposed children 009-011).

**XCE signal was near-exhausted (per 005); caura-memclaw re-energizes 027's evidence base** — but mostly as *confirmation* that 027's planned direction is right, plus a short list of concrete hardening additions.

---

## 2. WHAT MEMCLAW IS (architecture, verified)

| Layer | Role | Evidence |
|---|---|---|
| `core-api` | Write pipeline (dedup, enrich, idempotency), recall, MCP server, evolve/insights services | `core-api/src/core_api/pipeline/*`, `mcp_server.py` |
| `core-storage-api` | Postgres/pgvector store; search scoring; soft-delete/archive/purge | `core-storage-api/src/core_storage_api/services/postgres_service.py` |
| `core-worker` | Async consumers for embed/enrich/lifecycle events | `core-worker/src/core_worker/*` |
| `core-operations` | Scheduled retention/insight/lifecycle ops | `core-operations/src/core_operations/*` |
| `common` | Domain models, embedding, enrichment, event bus | `common/models/*`, `common/embedding/*`, `common/events/*` |

Core data model (`common/models/memory.py`): a `memories` row carries `tenant_id/fleet_id/agent_id` scope, `embedding Vector(VECTOR_DIM)` (one **global** dim — no per-row embedder version), `weight`, `content_hash`, `client_request_id` (per-attempt idempotency), `deleted_at` (soft-delete), `status`, `recall_count`/`last_recalled_at`, `supersedes_id` (the **only** memory↔memory link, for contradiction), and an **RDF triple** (`subject_entity_id`/`predicate`/`object_value`). Relationships are **entity-centric**: `entity.py` defines `Relation` (entity↔entity, with `uq_relations_natural_key`) and `MemoryEntityLink` (memory↔entity). **MemClaw has no general memory↔memory causal-edge graph** (`common/models/memory.py:79-83`, `common/models/entity.py:27-62`).

Headline axes (`docs/performance.md`): latency (23ms p50) and token efficiency (96-98% vs full context) at fleet scale; accuracy clusters with Mem0/Zep on LoCoMo/LongMemEval.

---

## 3. METHOD

Orchestrator-driven parallel fan-out (per saved-memory reliability pattern: executors run **read-only**; the orchestrator writes all artifacts, sidestepping the project Gate-3 executor-write block and staying compaction-safe). 20 iterations in 5 rounds of 4:

- **R1-R3 breadth (001-012):** 12 surfaces — write-safety, recall, governance, self-improvement, indexing/enrichment, entity/relationship, lifecycle, event pipeline, ranking/decay, perf/token-efficiency, MCP surface, eval.
- **R4 deep (013-016):** the 4 highest-overlap surfaces, each producing a Spec-Kit-native adoption sketch.
- **R5 adversarial (017-020):** each candidate teaching's cited `file:line` re-verified (catch misattribution) and attacked on over-engineering / redundancy-vs-027 / Postgres→SQLite hazard / cargo-cult.
- **Orchestrator adjudication:** contested refutations resolved against MemClaw ground truth (`memory.py`, `entity.py`, relation/edge grep).

Convergence: newInfoRatio fell from ~0.78 (breadth) to 0.25-0.34 on deeply-explored surfaces in the adversarial round; verdict tally ADOPT 13 / ADAPT 28 / REJECT 3 / DEFER 2 / DOWNGRADE 5 / REFUTED 4 / UPHELD 2.

---

## 4. SURFACE-BY-SURFACE FINDINGS (post-adversarial, calibrated)

### 4.1 Write-safety / idempotency / dedup (→ 002, 006)
MemClaw layers exact content-hash dedup, semantic-band dedup (hard-reject + LLM judge + review queue), and fast-mode advisory `near_duplicate_of`; idempotency is split into HTTP response-replay (`Idempotency-Key`, pending sentinel, 422-on-different-body) and row-level bulk (`client_request_id` + partial unique index `deleted_at IS NULL AND client_request_id IS NOT NULL`). Enrichment is merge-only (agent-provided fields win) — **but metadata keys are still enriched**, so it is not a universal field-source lattice (`merge_enrichment_fields.py:28-50`).
**Calibrated teachings:** minimal local operation receipt (content/op-hash, replay identical retries) — ADAPT, scoped (not the HTTP pending/TTL/poll machinery); merge-only/auto-cannot-overwrite-manual — **validation of 002** (already planned); advisory near-duplicate (deterministic threshold, no LLM judge, never hard-reject) — ADAPT optional.

### 4.2 Self-improving memory (→ 008) — the central finding
`evolve` applies clamped **asymmetric** deltas directly to canonical weight in one bulk SQL update (`evolve_service.py:147-165`, `constants.py:494-503`); failure/partial outcomes trigger LLM rule synthesis persisted **active at conf ≥ 0.5** (`evolve_service.py:904-923`) — **no shadow/probation**. `insights` mines contradictions/failures/stale/divergence/patterns, with genuine hygiene (hallucinated-ID drop, insight-on-insight exclusion, supersession). Search blends `weight` (15%) into score; stale-archival keys off `weight < 0.3` (`postgres_service.py:1606-1644`). **Net:** the *loop shape* is instructive but the *mechanism* (direct asymmetric mutation, confidence-only active rules) is unsafe for a sparse single-user corpus.

### 4.3 Governance / trust tiers / scoping (→ negative knowledge)
Multi-tenant isolation, per-agent trust tiers, fleet/cross-fleet visibility, PII quarantine, suppression — **all reject** (no single-user analog). Surviving concept: a **compact append-only audit for automated mutations** + source-confidence provenance (not access-control tiers).

### 4.4 Indexing / embedding / enrichment (→ 003)
MemClaw uses a **single global `VECTOR_DIM`** (implicit; no per-row embedder version/fingerprint columns). Spec Kit's planned explicit fingerprint + embedder-tuple + derived-state (027/003) **improves on** MemClaw. Grounded residue: `content_hash` + `last_dedup_checked_at` incremental marker.

### 4.5 Entity / relationship / lifecycle (→ 004, 005)
No memory-causal edges (only entity `Relation` + `MemoryEntityLink` + `supersedes_id`). Soft-delete via `deleted_at` (but **not** first-timestamp-idempotent — repeat deletes rewrite the timestamp: `postgres_service.py:418-423`); active/purgeable separated by partial indexes; entity relations use a **natural-key unique constraint** (`uq_relations_natural_key`) for idempotent dedup. **Validates 004 & 005**; adds (a) preserve-first-tombstone-timestamp idempotence, (b) natural-key idempotent promotion + provenance-skip-manual, (c) entity-vs-causal boundary discipline.

### 4.6 Recall ranking / perf / MCP surface / eval (→ mostly redundant)
Spec Kit already has FSRS decay, co-activation, tiers, per-tool token budgets, profiles, `eval_run_ablation`, dashboards. Survivors: a **lightweight MCP tool-ownership map** (reject op-dispatch consolidation — harms LLM discoverability); preserve summary-first where it exists; **one narrow audit** that Spec Kit isn't silently hard-excluding deprecated-but-relevant memories (MemClaw itself hard-excludes `outdated/conflicted` by default — `postgres_service.py:986/1022`); keep benchmark-limitation notes in eval docs (reject adding LLM-judge end-task eval).

---

## 5. SURVIVING TEACHINGS (final, verdict-adjusted)

| # | Teaching | Verdict | Target | Key evidence (MemClaw) |
|---|---|---|---|---|
| T1 | Minimal idempotency receipt for `memory_save/update` (op/content hash, replay identical retries; SQLite txn) | ADAPT (scoped) | 009 / 006 | `idempotency.py:30-53`; `middleware/idempotency.py:158-203`; `memory.py:96-105` |
| T2 | Explicit `source_kind` enum (human/agent/system/import/feedback) + auto-cannot-overwrite-manual/constitutional | VALIDATE+SHARPEN | 002 | `merge_enrichment_fields.py:28-50`; `memory_service.py:1656` |
| T3 | Advisory `near_duplicate_of` (deterministic threshold, no LLM judge, never hard-reject) | ADAPT (optional) | 002/007 | `detect_near_duplicate.py:25-27,106` |
| T4 | **Scope 008 down**: append-only feedback-event log (audit/replay/diagnostics) + defer active reducers | ADAPT (reframe) | 008 | `evolve_service.py:147-165,904-923`; `postgres_service.py:1606-1644` |
| T5 | Reserve system-generated feedback artifact types from user/agent forging | UPHELD | 008 | `enrichment/constants.py:97-110`; `routes/memories.py:101-131`; `mcp_server.py:281-310` |
| T6 | Reject asymmetric damping; use symmetric/soft accumulation + rare-but-correct guard + constitutional immunity | UPHELD | 008 | `constants.py:494-503`; `evolve_service.py:340-375` |
| T7 | Preserve first tombstone timestamp (COALESCE-idempotent soft-delete) | ADAPT (improves on MemClaw) | 004 | `postgres_service.py:418-423,1646-1687` |
| T8 | Partial-index active vs purgeable split (`deleted_at IS NULL` / `IS NOT NULL`) | ADOPT | 004 | `memory.py:96-135` |
| T9 | Natural-key idempotent edge promotion + provenance (skip already-wired manual links) | VALIDATE | 005 | `entity.py:27-50`; migration `001_initial_schema.py:163-165`; `postgres_service.py:2983-3048` |
| T10 | Entity/co-occurrence ≠ causal truth (boundary discipline; defer entity-graph itself) | ADAPT (invariant) / DEFER (graph) | 004/005 | `entity.py:27-62`; `memory.py:79-83`; `memory_service.py:2709-2810` |
| T11 | Compact append-only audit for automated mutations (promoter, tombstone sweeps, bulk deletes, retention) | ADAPT | 002/004/008 | `audit.py:11-25`; `lifecycle_audit.py:24-58` |
| T12 | Lightweight MCP tool-ownership map (NOT op-dispatch consolidation, NOT SemVer governance) | ADAPT (lightweight) | 009 / MCP | `docs/api-surfaces.md:1-74` |
| T13 | Audit that default search isn't silently hard-excluding deprecated-but-relevant memories | ADAPT (audit) | 007/search | `postgres_service.py:986,1022` |
| T14 | content_hash dedup + `last_dedup_checked_at` incremental marker | VALIDATE | 003 | `memory.py:24,33,75-77` |

---

## 6. NEGATIVE KNOWLEDGE LEDGER (do NOT port)

<!-- ANCHOR:ruled-out-directions -->
1. **Multi-tenant scoping** (tenant/fleet/agent dimensions, RLS-style boundaries) — `README.md:253`; `memory.py:19-21`.
2. **Fleet trust tiers** (trust-level ladders for cross-fleet read/write) — `README.md:255`; `routes/evolve.py:104-163`.
3. **Cross-agent propagation & divergence** ("agents learn from each other") — `README.md:36`; `insights_service.py:419-454,1057-1061`.
4. **PII quarantine as a cross-fleet boundary** — `README.md:253`.
5. **pgvector/Postgres-specific machinery** (vector operators, JSONB, `ON CONFLICT`/COALESCE partial indexes literally) — adapt the guarantee, not the shape — `memory.py:96-105`.
6. **Distributed workers / brokers / DLQs** for embed/enrich — a local single-daemon needs the decoupling *pattern*, not Pub/Sub infra — `core-worker/src/core_worker/consumer.py`.
7. **Warm-cache / rate-limit / bulkhead infra** — `memory_service.py:856`.
8. **Public-SemVer external-API governance** (release-please, stable-API tables) for an internal single-user MCP — `README.md:812`.
9. **LLM-judge dedup + human review queues** as default write path — prefer deterministic thresholds — `check_semantic_duplicate.py:187`.
10. **Direct active weight mutation + asymmetric damping** (the 008 anti-pattern) — `evolve_service.py:147-165`; `constants.py:494-503`.
11. **MCP op-dispatch tool consolidation** — harms LLM tool discoverability on a 37-tool surface — `mcp_server.py:735,1169`.
12. **Entity-graph recall** as a built-in — defer absent measured retrieval need — `memory_service.py:2709-2810`.
<!-- /ANCHOR:ruled-out-directions -->

---

## 7. MAPPING TO 027 CHILDREN

| Child | MemClaw verdict | Action |
|---|---|---|
| 002 write-safety | VALIDATED + sharpen | Add `source_kind` enum (T2), minimal idempotency receipt (T1), advisory near-dup (T3), automated-mutation audit (T11) |
| 003 incremental-index | VALIDATED | Spec Kit's explicit fingerprint/version is *better* than MemClaw's implicit global dim; keep `last_dedup_checked_at` idea (T14) |
| 004 causal-edge-tombstones | VALIDATED + sharpen | Add first-timestamp idempotence (T7), partial-index active/purgeable split (T8), entity-vs-causal boundary (T10) |
| 005 metadata-edge-promoter | VALIDATED | Natural-key idempotent promotion + provenance-skip-manual (T9) |
| 006 write-path-reconciliation | VALIDATED | Idempotency receipt (T1); async post-insert-enrichment confirmed sound |
| 007 semantic-trigger-fallback | Minor | Stale/status hard-exclusion audit (T13) |
| 008 learning-feedback-reducers | **MAJOR REFRAME** | Scope down to event-capture + provenance + diagnostics; defer active reducers; reserved feedback types (T5); symmetric damping + rare-but-correct guard + constitutional immunity (T6) |
| **012 (proposed new)** | — | Bundle the genuinely-new additions (T1 idempotency receipts, T12 tool-ownership map, T13 stale-exclusion audit) — see `sub-packet-proposals.md` (012 avoids collision with concurrent peck proposals 009-011) |

---

## 8. CONVERGENCE REPORT

- **Stop reason:** converged — adversarial newInfoRatio 0.25-0.34 on deeply-explored surfaces; every candidate teaching citation-verified; contested refutations adjudicated against MemClaw ground truth.
- **Refutation health:** the adversarial round REFUTED 4 and DOWNGRADED 5 candidate teachings (incl. over-claimed embedder-tuple columns and ungrounded memory-causal-edge promotion), and corrected prior-pass misattributions — evidence the loop was genuinely adversarial, not confirmatory.
- **Residual uncertainty:** MemClaw's *worker-side* embed/enrich idempotency was sampled, not exhaustively traced; not material to the proposal (distributed-worker machinery is negative knowledge anyway).

---

## 9. PROVENANCE

20 iteration narratives (`iterations/iteration-001..020.md`), 20 JSONL deltas (`deltas/`), dispatched prompts + raw stdout/stderr (`prompts/`), combined state (`deep-research-state.jsonl`), reducer-style dashboard + registry (`deep-research-dashboard.md`, `findings-registry.json`). All MemClaw citations are `file:line` into `external/caura-memclaw-main` (Apache-2.0; design inspiration only — no code copied). Total: 133 raw findings, 2.23M tokens, cost 0 (OpenAI oauth subscription).

<!-- /ANCHOR:deep-research-caura-memclaw -->
