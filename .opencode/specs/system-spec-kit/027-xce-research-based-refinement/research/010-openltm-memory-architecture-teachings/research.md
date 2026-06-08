---
title: "Research — OpenLTM Memory-Architecture Teachings for system-spec-kit Memory"
description: "10-iteration deep-research synthesis mining OpenLTM (open-source LTM plugin; Bun/TS/SQLite/FTS5; MIT) for design teachings transferable to the local single-user system-spec-kit Memory system, with adversarially-checked adopt/adapt/reject/defer verdicts and first-class negative knowledge."
---

# Research — OpenLTM Memory-Architecture Teachings for system-spec-kit Memory

**Session:** `2026-06-08-010-openltm-teachings` · **Executor:** cli-opencode `openai/gpt-5.5-fast --variant xhigh` (read-only) · **Pattern:** orchestrator-driven parallel fan-out (width 5)
**Target:** `external/OpenLtm-main` (OpenLTM — long-term-memory plugin for AI coding agents; Bun + TS; SQLite WAL + FTS5 BM25 + optional sqlite-vec; pluggable embedding providers; lifecycle hooks; janitor; typed knowledge graph; ~29K LOC; MIT — design inspiration only)
**Consumer:** system-spec-kit Memory — LOCAL single-user store (SQLite index + separate ollama-nomic-768d vector store; semantic+lexical triggers; importance tiers; causal edges incl. `contradicts`/`supersedes`; FSRS decay + co-activation; self-maintaining incremental index; shadow-first learning-feedback reducers; spec-folder continuity ladder; 37-tool MCP surface)

---

## 0. Executive summary — the answer to "what do they do differently, what should we copy?"

OpenLTM and system-spec-kit Memory are both single-user, local, SQLite-backed memory systems, so the gap is **design, not scale**. Across 10 subsystems, **our retrieval and decay are already stronger** (fused vector/BM25/FTS/graph/trigger search + FSRS + co-activation beats their FTS-primary candidate generation + fixed half-life decay). OpenLTM's transferable value is **not** in recall power — it is concentrated in **write-path safety, observability, and "propose-don't-mutate" discipline**.

The single highest-value teaching, the four runners-up, and the clearest rejections:

- **★ ADOPT — Scrub secrets before any persistence/index/embed/hash.** OpenLTM runs an ordered regex scrubber at the start of `learn()`, before dedup-hash, FTS, embeddings, and markdown export (`secretsScrubber.ts:17`, `db.ts:307`, `db.ts:352`). FSRS and causal edges do nothing once a secret is embedded into the vector store or written to SQLite — this is a genuine, durable safety gap on our save/index paths.
- **ADOPT (scoped) — Stage auto-mined memories and dedup as *proposals*, never silent durable mutation** (`janitor/promote.ts:89`, `janitor/dedup.ts:211`, `hooks/lib/proposalQueue.ts:14`). We already have shadow-first reducers for *feedback*; the delta is extending that discipline to **memory admission** (transcript/git extraction) and **duplicate merges**, which can corrupt causal lineage if applied blindly.
- **ADAPT — Surface `contradicts`/`supersedes` warnings inline at retrieval**, not only in graph-debug (`graph.ts:235`). We already have the edge types; the delta is presentation where agents consume memories.
- **ADAPT — Actual-pipeline `why_ranked`** (a compact per-result explanation derived from the *real* fused ranker), and **lexical/trigger-deficit → semantic rescue** on the trigger-first fast paths (`db.ts:444`, `explainer.ts:57`).
- **ADAPT — Write-path hardening borrowed from their schema discipline:** normalized provenance source-kind, slim audit + deletion tombstones, explicit vector-degradation state, and (engineering hygiene) file-backed numbered migrations with checksums.
- **✗ REJECT — Their FTS-primary recall wholesale, their display-only blended score, their fixed importance half-lives, and `confirm_count` immortality.** We verified in source that OpenLTM's explainer computes a 0.40/0.35/0.15/0.10 blended score (`explainer.ts:57`) but recall actually **sorts by `decay_score`** (`db.ts:545-550`) — the explanation is not the ranking. Copying that formula would corrupt our feedback reducers. Our FSRS + co-activation already supersede 14/30/90/180-day half-life buckets (`janitor/decay.ts:14-32`).

**Net:** 54 raw teachings → **11 ADOPT / 29 ADAPT / 9 REJECT / 5 DEFER**. After adversarial verification, **1 standout ADOPT (secrets), ~10 genuine ADAPT deltas, 2 ADOPT→ADAPT downgrades (we already reconcile vectors / already have includeTrace), 1 ADAPT→DEFER (self-maintaining FTS makes explicit rebuild migrations marginal).** The recurring theme: **OpenLTM is weaker than us at remembering, but more disciplined than us at writing.**

> **★ Continuation correction (iterations 011–015) — read this before acting on §3.** The operator flagged that our memory is **spec-documentation-based** (authored markdown docs are the source of truth; the DB is a derived index) whereas OpenLTM is **row-based** (a `memories` row written by `learn()`/hooks *is* the memory — OpenLTM's own docs state its `context-summary.md` is "never the source of truth; the DB is" — the exact inverse of us). Five more iterations re-classified every teaching as **TRANSFERS** (storage-agnostic), **DOC-ANALOG** (transfers only if re-shaped for authored docs), or **ROW-COUPLED** (don't port). The result materially corrects §3: the **write-side row mechanics are largely row-coupled and should be dropped, not adapted** — `learn/reinforce`/`confirm_count` (teaching #5), per-row provenance + per-row audit (#6/#7), and row dedup/merge are **REJECT** for us (our docs + git history + continuity ladder already carry that). What genuinely survives and strengthens: **secret scrubbing (#1, unchanged ★)**, retrieval/observability (#3/#4/#8), and a newly-surfaced, high-fit cluster — **per-doc content-fingerprint indexing, FTS-trigger sync, a bounded startup restore panel, PreCompact snapshots that refresh *authored* continuity, and proposal queues reshaped to suggest *handover/continuity doc-patches* (never silent memory rows).** Full re-tiering in **§8**; corrected proposals in `sub-packet-proposals.md`.

---

## 1. Method

A 10-iteration breadth sweep, one OpenLTM subsystem per iteration, each dispatched as a fresh **read-only** `cli-opencode openai/gpt-5.5-fast --variant xhigh` analyst (29–61 tool calls each, reading real source). The **orchestrator wrote every iteration/delta/state artifact** — executors analyzed only — which sidesteps the project Gate-3 executor-write block and is compaction-safe. Iterations ran in two parallel batches of ~5 (`gtimeout -k 60 1200`, `</dev/null`, narrow per-subsystem scope to fit the xhigh timeout). Round 2 = a constructive **synthesis** pass (succeeded) + an **adversarial-verify** pass.

> **Adversarial-pass note (honest disclosure):** the independent gpt-5.5 adversarial dispatch was attempted **three times and reproducibly SIGKILLed (exit 137)** at 1–3 min — the heavy "refute every teaching" reasoning ballooned the opencode process and macOS jetsam reaped it (system memory was >50% free throughout; the constructive synthesis on the same inputs succeeded). To avoid burning further resources, the **adversarial verification in §5 was performed by the orchestrator (Claude Opus 4.8)** against the verified synthesis + the 10 iteration analyses, not by an independent model. Treat §5 verdicts as an in-house skeptical review, not a second independent opinion. Citations in §2–§4 were spot-checked against OpenLTM source (decay formula, secret scrubber, explainer blend, and the decay_score sort key all confirmed).

---

## 2. Per-subsystem comparison (OpenLTM vs system-spec-kit)

| Subsystem | What OpenLTM does (distinctive) | system-spec-kit today | The delta / gap | Net verdict |
| --- | --- | --- | --- | --- |
| Hybrid recall + scoring + explainability | FTS5 lexical candidates first, semantic fallback when results `< limit`, then a post-hoc explainer; **actual sort is `decay_score`, not the explainer score** (`db.ts:425,444,545`; `recall/explainer.ts:57`). | Stronger fused vector/BM25/FTS/graph/trigger search with FSRS + `includeTrace`. | Actual-ranker `why_ranked`; semantic rescue for trigger/lexical deficits. | ADAPT explainability/rescue; **REJECT** their score formula. |
| Importance-weighted decay | Materialized `decay_score`, fixed half-life tiers, confidence multiplier, soft-deprecation/archive (`migrations/011_*:4`; `janitor/decay.ts:17,31`). | FSRS decay, HOT/WARM/COLD states, importance tiers, validation, co-activation. | Optional cached `effective_retrievability`; confidence-aware demotion; archive snapshots. | ADAPT cache/audit ideas; **REJECT** fixed half-lives. |
| Janitor maintenance | Sequential embed/decay/archive/promote/dedup pass with counters; pending-promotion + dedup **proposals** (`janitor/index.ts:75,130`; `promote.ts:89`; `dedup.ts:211`). | Self-maintaining incremental index, embedding reconcile, health, retention sweep. | Low-frequency maintenance *report*; proposal queue for mined memories + dedup. | ADOPT proposal staging; ADAPT reporting; DEFER cron complexity. |
| Lifecycle hooks + injection envelope | Session hooks, bounded startup injection, **PreCompact markdown snapshot**, transcript/git extraction → proposals (`SessionStart.ts:17`; `context.ts:30`; `PreCompact.ts:56`; `EvaluateSession.ts:223`). | Session bootstrap/resume, continuity ladder, hook cache, memory save. | Durable fallback snapshot; fixed emergency line budgets; proposal-based transcript/git learning. | ADAPT. |
| Typed graph + conflict detection | Six relation types, BFS over edges, conflict/reinforcement buckets, "verify before applying" warnings (`schema.sql:95`; `graph.ts:39,235`). | Causal edges, `contradicts`/`supersedes`, causal traversal + boosts. | Present contradictions/supersession **inline during retrieval**; couple suppression to verified record state. | ADAPT. |
| Secret redaction before write | Ordered secret regex scrubber **before** dedup, insert, markdown export, embeddings + relations; typed markers; fail-open weakness (`secretsScrubber.ts:17,100`; `db.ts:307,352`). | Extraction redaction exists, but direct spec-doc save/indexing can persist content into SQLite/vector stores. | Pre-index scrubber across **all** save/index paths, before content hash + embeddings. | **ADOPT** scrubber; REJECT fail-open/content-only scope. |
| Provenance + audit chain | Separate provenance chain + mutation audit with slim before/after snapshots; optional batch provenance on recall; audit survives deletion (`migrations/008_*:1`, `009_*:1`; `dao/provenanceAudit.ts:15`; `db.ts:563`). | Governed provenance fields, mutation/history surfaces, retention audit. | Controlled source-kind taxonomy; on-demand batch provenance; deletion tombstones. | ADAPT; REJECT fail-open audit. |
| Embedding abstraction + degradation | Small provider contract with `disabled`, graceful FTS-only behavior, **split embedding-metadata table**, rebuildable sqlite-vec index (`providers/embeddingProvider.ts:17`; `providers/disabled.ts:12`; `migrations/010_*:5`; `vec/index.ts:108`). | Fixed local ollama-nomic-768d vector shard, embedder health, reconcile. | Explicit degraded embedder state + model/dim/status metadata tied to active shard. | ADAPT; do **not** proliferate providers. |
| Schema/DB migration discipline | Root schema + numbered SQL migrations, checksums, baseline sentinel, explicit FTS-rebuild migration (`migrations.ts:44,72`; `migrations/001_baseline.sql:1`; `migrations/020_fts_coverage.sql:7`). | Inline schema/migration ladder, self-maintained FTS/vector surfaces. | File-backed migration history, checksums, explicit FTS rebuilds, index+vector pair backups. | ADAPT. |
| `learn()` idempotency + cross-plugin contract | Tiny normalized-key learn/reinforce contract, embedding queue, write queue, adapter actors, roadmap for versioned plugin API (`db.ts:321`; `lib/writeQueue.ts:7`; `adapter-opencode/src/tools.ts:50`; `docs/internal/ROADMAP.md:147`). | Broad `memory_save`, validation, 37-tool MCP surface, governed fields. | Narrow atomic `learn/reinforce` API with capability discovery + required actor/provenance. | ADAPT/ADOPT; REJECT unscoped text-key dedupe. |

---

## 3. Ranked transferable teachings

Ranked by value × confidence ÷ risk. "Adversarial" column = orchestrator skeptical review (§5).

| # | Teaching | Evidence (OpenLtm-main) | Target surface | Verdict | Adversarial | Risk · Conf |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Scrub secrets before indexing, hashing, embeddings, FTS & persistence | `secretsScrubber.ts:17,21`; `db.ts:307,314,352` | `memory_save`, `memory_index_scan`, embedding/FTS mutation paths | **ADOPT** | **UPHELD (strong)** | MED · 0.88 |
| 2 | Stage auto-mined memories **and** dedup as proposals, never silent durable mutation | `promote.ts:51,89`; `dedup.ts:211`; `hooks/lib/proposalQueue.ts:14` | Shadow reducers, proposed-memory review queue, dedup queue | **ADOPT** | UPHELD (scope to admission+dedup) | MED · 0.88 |
| 3 | Actual-pipeline `why_ranked` explanation (not display-only scoring) | `recall/explainer.ts:5,57`; `db.ts:545,570` | `memory_search(includeTrace)`, `memory_context(profile=debug)` | ADAPT | UPHELD (partial overlap w/ includeTrace) | LOW · 0.94 |
| 4 | Surface contradiction/supersession warnings inline with retrieval | `graph.ts:235,239`; `db.ts:682`; `schema.sql:50` | `memory_search`, `memory_context`, response formatter | ADAPT | UPHELD (presentation-only delta) | MED · 0.84 |
| 5 | Narrow atomic `learn/reinforce` contract with capability discovery | `db.ts:321,347`; `lib/writeQueue.ts:13`; `ROADMAP.md:147,151` | New small write/read MCP contract beside `memory_save` | ADAPT | UPHELD | MED · 0.87 |
| 6 | Normalized provenance source-kind + on-demand batch provenance | `migrations/008_*:9`; `db.ts:377,563`; `dao/provenanceAudit.ts:89` | `memory_index`, `memory_save`, `memory_search(includeTrace)` | ADAPT | UPHELD | LOW · 0.90 |
| 7 | Slim audit snapshots + deletion lineage that survives cleanup | `migrations/009_*:1,6`; `dao/provenanceAudit.ts:15,18` | Mutation ledger, `memory_delete`, `memory_bulk_delete`, retention sweep | ADAPT | UPHELD | LOW-MED · 0.88 |
| 8 | Explicit vector availability/degradation state (no silent lexical-only) | `providers/embeddingProvider.ts:17`; `providers/disabled.ts:12`; `db.ts:444,457` | `embedder_list`, `memory_health`, `memory_search` trace | ADAPT | UPHELD (partial: we have embedder health) | LOW · 0.90 |
| 9 | Bounded emergency context envelopes + low-tech PreCompact snapshot | `SessionStart.ts:17,20`; `context.ts:30,39`; `PreCompact.ts:56` | Session bootstrap/resume, compaction hook, continuity ladder | ADAPT | UPHELD | LOW · 0.87 |
| 10 | Lexical/trigger-deficit detection → semantic rescue | `db.ts:444,448`; `embeddings.ts:261,301` | `memory_match_triggers`, `memory_quick_search`, fallback policy | ADAPT | UPHELD (scope to trigger-first paths) | MED · 0.87 |
| 11 | Vector/ANN indexes as rebuildable derived surfaces keyed by model/dim | `migrations/010_*:5`; `dao/embeddings.ts:35`; `vec/index.ts:108,119` | Active vector-shard metadata, `memory_embedding_reconcile` | ADOPT | **DOWNGRADE→ADAPT** (we already reconcile; delta is metadata keying) | LOW · 0.88 |
| 12 | Numbered migrations with checksums + baseline sentinel | `migrations.ts:44,72,239`; `migrations/001_baseline.sql:1` | SQLite schema runner, migration history, release discipline | ADAPT | UPHELD (but generic SW hygiene) | MED · 0.90 |
| 13 | Maintenance observability (last-run counters, stale-candidate reports) | `janitor/index.ts:51,130,139`; `janitor/archive.ts:49` | `memory_health`, `memory_index_scan`, retention sweep | ADAPT | UPHELD | LOW · 0.88 |
| 14 | Explicit FTS-rebuild migrations that repopulate source + recreate triggers | `schema.sql:127,132`; `migrations/020_fts_coverage.sql:7,17,24` | FTS5 schema maintenance, `memory_health` repair | ADAPT | **DOWNGRADE→DEFER** (self-maintaining index already covers FTS coverage) | MED · 0.82 |

---

## 4. Cross-cutting themes

| Theme | Synthesis |
| --- | --- |
| **Propose, don't mutate** | OpenLTM's strongest transferable pattern is staging uncertain promotion, transcript extraction, git learning, relation inference, and dedup as *proposals*. We already have shadow-first reducers for feedback — extend that discipline to **memory admission** and **duplicate handling**. |
| **Explain every retrieval path** | The recurring gap is not retrieval power, it's **observability**: actual-ranker contribution, channel availability, provenance source, and contradiction/supersession warnings should be visible *when requested*. |
| **Write-path safety beats retrieval cleverness** | Redaction, provenance, actor requirements, atomic idempotency, and deletion tombstones matter *before* FSRS/causal/co-activation can help. Bad writes become durable bad memory. |
| **Derived surfaces must be rebuildable & auditable** | FTS, vector shards, retrievability caches, and migrations are derived/versioned surfaces — checksums, model/dim metadata, repair reports, and **pair-aware (index+vector) backups**. |

---

## 5. Adversarial verification ledger (orchestrator-performed — see §1 note)

Each ADOPT/ADAPT teaching stress-tested against what system-spec-kit already has (FSRS, causal edges incl. `contradicts`/`supersedes`, co-activation, self-maintaining index, shadow reducers, continuity ladder, embedder health/reconcile, 37-tool MCP).

| # | Teaching (short) | Original | Adversarial verdict | Ground | Reason |
| --- | --- | --- | --- | --- | --- |
| 1 | Pre-index secret scrubber | ADOPT | **UPHELD (strongest)** | none | Real, durable safety gap — nothing downstream undoes an embedded/persisted secret. |
| 2 | Proposals for admission + dedup | ADOPT | **UPHELD** | partially-covered | Shadow-first exists for *feedback*; admission + destructive dedup are not yet gated → genuine extension. |
| 3 | Actual-ranker `why_ranked` | ADAPT | UPHELD | partially-covered | We have `includeTrace`; delta is a compact, *actual-ranker* per-result explanation. Enhancement, not new capability. |
| 4 | Inline contradiction/supersession | ADAPT | UPHELD | partially-covered | We own the edge types already; the delta is **presentation at retrieval** — real but low-novelty on the data model. |
| 5 | Narrow `learn/reinforce` contract | ADAPT | UPHELD | none | 37-tool surface is too broad for cross-tool fact writes; actor/provenance-scoped reinforce is a real seam. |
| 6 | Provenance source-kind enum | ADAPT | UPHELD | none | Controlled enum makes scan/import/promotion/janitor origins machine-auditable beyond freeform strings. |
| 7 | Slim audit + deletion tombstones | ADAPT | UPHELD | none | Separate vector store makes full snapshots costly; slim text/metadata tombstones aid debuggability. |
| 8 | Explicit vector-degradation state | ADAPT | UPHELD | partially-covered | We have embedder health; delta is the **recall-time** degraded signal preventing silent lexical-only answers. |
| 9 | Bounded envelope + PreCompact snapshot | ADAPT | UPHELD | none | Continuity ladder is richer, but a fixed-budget low-tech snapshot is easier to trust under compaction/hook-cache loss. |
| 10 | Trigger-deficit → semantic rescue | ADAPT | UPHELD | none (scoped) | Full search is already fused; rescue only matters on trigger-first fast paths — scope it there. |
| 11 | Vectors as rebuildable derived surfaces | ADOPT | **DOWNGRADE→ADAPT** | already-covered | We already treat vectors as rebuildable (`memory_embedding_reconcile`); the only delta is model/dim/status metadata keying. |
| 12 | Numbered migrations + checksums | ADAPT | UPHELD (caveat) | none | Real auditability gain, but it's **generic engineering hygiene**, not memory-specific — prioritize accordingly. |
| 13 | Maintenance observability | ADAPT | UPHELD | none | Last-run counters + stale-candidate reports add operator trust without a heavy janitor. |
| 14 | Explicit FTS-rebuild migrations | ADAPT | **DOWNGRADE→DEFER** | cost>benefit | Self-maintaining incremental index already keeps FTS coverage; explicit rebuild migrations are marginal for us. |

**Survivors (implement-worthy):** 1 (★), 2, 3, 4, 5, 6, 7, 8, 9, 10, 13 — plus 12 as generic hygiene.
**Downgraded:** 11 (ADOPT→ADAPT, mostly covered), 14 (ADAPT→DEFER, covered by self-maintaining index).
**None fully refuted** — but the standouts are concentrated in write-path safety (1, 2, 6, 7) and observability (3, 4, 8, 13), exactly where a single-user local store benefits without scale assumptions.

---

## 6. Consolidated negative knowledge (do NOT copy)

| Do not copy | Reason | Evidence |
| --- | --- | --- |
| FTS-primary recall architecture wholesale | Simpler candidate generation, not better than our fused vector/BM25/FTS/graph/trigger search. | `db.ts:425,444` |
| Display-only blended ranking scores | Explains with one formula but **sorts by `decay_score`** — copying it would corrupt feedback interpretation. | `recall/explainer.ts:57`; `db.ts:545` |
| Fixed importance half-lives as the relevance model | FSRS + co-activation are more adaptive than 14/30/90/180-day buckets. | `janitor/decay.ts:20,26` |
| Hard `confirm_count` immortality | Repeated confirmations should feed FSRS/validation strength, not make stale facts permanent. | `db.ts:246,258` |
| Fail-open secret scrubbing or audit writes | Persisting original text on scrubber failure, or losing audit silently, is unacceptable for canonical writes. | `secretsScrubber.ts:100`; `db.ts:132` |
| Content-only redaction | Titles, provenance, trigger phrases, summaries can also carry secrets. | `db.ts:350,382` |
| Direct git-diff auto-learn into durable memory | Commit diffs are noisy; route to proposals with provenance review. | `hooks/src/GitCommit.ts:117,132`; `hooks/lib/llmExtract.ts:53` |
| Flat goal/progress/decision/gotcha store replacing spec folders | Our continuity ladder + causal edges + tiers are richer and more auditable. | `context.ts:16,44` |
| `relate()` semantics as-is | `INSERT OR IGNORE` cannot update edge metadata, and `supersedes` does not change record state. | `db.ts:587,603` |
| Unused edge weights / graph-UI machinery | Metadata not consumed by traversal/scoring is dead surface; layout/cluster UI does not improve continuity recall. | `migrations/018_relation_semantics.sql:2`; `graph.ts:51`; `src/cluster.ts:8` |
| Embedding-provider proliferation | Keep local ollama-nomic; improve degraded-state reporting, don't chase many integrations. | `providers/embeddingProvider.ts:7` |
| Single-file DB backup assumptions | Our index DB and active vector shard must be checkpointed **as a pair**. | `migrations.ts:76,231` |
| 200-char normalized text dedupe | Can over-merge across folders/categories/actors; use scoped hashes / atomic upsert. | `dedup.ts:5,6`; `schema.sql:45` |
| Exposing the whole MCP/admin surface as the cross-plugin contract | Other tools need a small versioned read/write subset with actor/provenance requirements. | `ROADMAP.md:147,151`; `adapter-opencode/src/tools.ts:30` |

---

## 7. Per-iteration index

| Iter | Subsystem | Teachings | newInfoRatio | File |
| --- | --- | ---: | ---: | --- |
| 001 | Hybrid recall + blended scoring + explainability | 5 | 0.70 | `iterations/iteration-001.md` |
| 002 | Importance-weighted decay | 5 | 0.62 | `iterations/iteration-002.md` |
| 003 | Janitor maintenance pipeline | 6 | 0.72 | `iterations/iteration-003.md` |
| 004 | Lifecycle hooks + injection envelope | 5 | 0.66 | `iterations/iteration-004.md` |
| 005 | Typed knowledge graph + conflict detection | 5 | 0.64 | `iterations/iteration-005.md` |
| 006 | Secret redaction before write | 5 | 0.68 | `iterations/iteration-006.md` |
| 007 | Provenance + audit chain | 6 | 0.66 | `iterations/iteration-007.md` |
| 008 | Embedding provider abstraction + degradation | 6 | 0.58 | `iterations/iteration-008.md` |
| 009 | Schema/DB design + migration discipline | 6 | 0.55 | `iterations/iteration-009.md` |
| 010 | `learn()` idempotency + cross-plugin contract | 5 | 0.60 | `iterations/iteration-010.md` |
| 011 | Unit-of-memory & storage-model contrast (transfer filter) | 5 | 0.72 | `iterations/iteration-011.md` |
| 012 | Document/continuity surface vs our continuity ladder | 6 | 0.64 | `iterations/iteration-012.md` |
| 013 | Re-test row-write teachings under the doc lens | 5 | 0.58 | `iterations/iteration-013.md` |
| 014 | Indexing & freshness for an authored-doc corpus | 6 | 0.66 | `iterations/iteration-014.md` |
| 015 | Hooks & automation philosophy — auto-mine vs deliberate save | 5 | 0.60 | `iterations/iteration-015.md` |

---

## 8. Corrected re-tiering under the spec-doc lens (iterations 011–015)

**The architectural fact that reframes everything:** OpenLTM's memory unit is a **row** written by `learn()` (`db.ts:317-366`) — its markdown is an "auto-generated… do not edit directly" projection, and `context-summary.md` is explicitly "never the source of truth; the DB is" (`db.ts:709-727`; `docs/03-architecture.md:123-124`). Ours is the **inverse**: authored spec docs + the continuity ladder are the truth; the SQLite index + vector store are derived. So a teaching only cleanly transfers if it is about *content*, *retrieval*, *indexing*, or *session injection* — not about *how a memory is written*.

### 8.1 Storage-fit buckets

| Bucket | Meaning | Teachings |
| --- | --- | --- |
| **TRANSFERS** (storage-agnostic — adopt as-is) | Works the same whether memory is a row or a doc. | Secret scrubbing before persist/index (#1 ★); session-injection snapshot reading the continuity ladder; embeddings as a derived side-index; **opt-in (default-off) automation gates**; **PreCompact snapshot that summarizes existing state (mints nothing)**. |
| **DOC-ANALOG** (transfers only if re-shaped for authored docs) | Good idea, but must target docs/anchors, not rows. | Retrieval `why_ranked` + inline `contradicts`/`supersedes` (key results to **doc path/anchor**, not row IDs); graph edges with **document anchors** as endpoints; **per-doc content-fingerprint** to skip-unchanged re-index / force re-embed on edit; FTS-trigger sync + FTS-rebuild migrations over the derived index; **bounded startup restore panel** with explicit restored / not-restored status; the **goal/decision/progress/gotcha** facet taxonomy as a continuity-summary shape; **proposal queues reshaped to suggest `handover.md` / `_memory.continuity` doc-patches** for review at deliberate save; mid-session progress capture as a non-authoritative handover proposal; a **narrow operational audit for derived-index destructive ops only** (repairs, retention sweeps, MCP deletes). |
| **ROW-COUPLED** (do NOT port — negative knowledge) | Intrinsically tied to the row-write model. | `learn()/reinforce` + `created\|reinforced` + `confirm_count` as truth-strength (repeated authored-doc saves are deliberate edits or no-ops, not epistemic confirmations); **per-row provenance table** (redundant — doc + git + continuity already carry source traceability); **per-row before/after audit of canonical content** (that's git's job over docs); heuristic/semantic **row dedup & merge** (duplicate-looking text can be valid across different authored docs/ladder roles); auto-mining transcript/**git-diff facts into memory** (`extractAndLearn`/`GitCommit`); silent `UpdateContext` DB progress rows that bypass the authored ladder. |

### 8.2 What this changes vs §3

- **Dropped (now ROW-COUPLED REJECT, were ADAPT):** the narrow `learn/reinforce` write contract (#5), normalized per-row provenance source-kind (#6), and slim per-row audit of canonical content (#7). Source traceability for *us* lives in the authored doc + git + continuity frontmatter, not a shadow table. (A *narrow* audit of derived-index repair/retention/delete operations survives as DOC-ANALOG.)
- **Re-shaped (DOC-ANALOG, not a straight port):** "propose-don't-mutate" (#2) becomes **"auto-mining may only emit reviewed `handover.md` / continuity doc-patch suggestions during a deliberate save — never admit a memory directly."** Retrieval explainability + conflict warnings (#3/#4) must key to **doc path/anchor**, not row IDs.
- **Strengthened / newly surfaced (high-fit ADOPT):** **per-doc content-fingerprint indexing** (skip re-embed when a doc is unchanged; force re-index when it changes) — the single best new index-layer win for an *edited-document* corpus; **FTS-trigger sync + rebuild migrations**; a **bounded startup restore panel** with restored/not-restored status; **PreCompact snapshots that refresh authored continuity** rather than a DB-derived truth surface; **opt-in automation gates** as the safe default for any capture.
- **Unchanged:** **secret scrubbing remains #1** — fully storage-agnostic, confirmed by iter-011/013.

→ Proposals (re-tiered): `sub-packet-proposals.md`. Dashboard: `deep-research-dashboard.md`. Registry: `findings-registry.json`.
