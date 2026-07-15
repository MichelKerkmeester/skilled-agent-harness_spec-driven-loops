# Spec-Kit Memory Search Intelligence — Deep Dive Report

**Date:** 2026-07-03 · **Scope:** search intelligence, data quality, indexing, learning loop, commands & presentation
**Method:** live production probing (daemon, CLI, 1.3GB DB read-only) + 8 parallel code audits over ~96k lines + prior-work inventory (packets 028/031) with dedup against known/deferred findings.
**Verification key:** 🟢 = live-reproduced or code-verified by the primary session · 🟡 = agent-verified with quoted code (spot-checked) · known-open items from 031/028-006 are excluded unless new root cause added.

---

## 0. EXECUTIVE VERDICT

The 028/031 remediation waves hardened a lot of code, but the system's *effective* search intelligence today is dominated by two things the remediation didn't reach:

1. **Corpus rot.** 37% of index rows point at files that no longer exist; ~12k duplicate-content rows; a third of the corpus is archived material ranked as active; 43% of rows have no usable vector; 45% of trigger-phrase occurrences are single junk words; 94% of "causal" edges are entity-linker noise. No ranking algorithm can outrun this.
2. **Signal theater.** A large fraction of the ranking stack is computed, logged in telemetry as "applied", and then discarded before it can influence the final order — via the rescue-layer overwrite (0.03·base + 0.78·lexical), the non-hybrid intent recompute, min-max top-pinning + clamps, dead gates (HyDE, quality-gap fallback), and dead subsystems (composite/interference battery, chunking on the scan path).

Separately, the whole memory surface was **down** at session start (SIGBUS crash-loop + a dist-freshness deadlock that a successful build cannot clear), and the failure was silent to the user because hooks fail open and the stale-dist condition is misclassified as "retryable".

---

## 1. LIVE PRODUCTION STATE (all 🟢, measured 2026-07-03)

| Metric | Value | Meaning |
|---|---|---|
| Rows in memory_index | 33,101 | +30 grew during read-only probing (file-watcher; benign) |
| Rows citing dead file paths | **12,352 (37%)** | old `system-spec-kit/` track dir removed; rows survive & rank |
| Cross-prefix duplicate pairs | 7,012 | `system-spec-kit/` vs `system-speckit/` twins |
| Duplicate content_hash parents | 12,280 | same content, multiple rows |
| embedding_status success | 18,833 (57%) | 8,761 pending / 4,247 failed / 1,260 retry — 43% vector-invisible |
| success rows missing vectors | 367 | dual-write desync residue; `memory_embedding_reconcile` **never run** |
| embedding_model attribution | 27,706 empty; 2 spellings of same model | provenance broken |
| z_archive rows | 11,086 (33%) | 272 critical / 4,278 important; `is_archived=0` on ALL rows |
| tier=deprecated rows | 7,340 | superseded snapshots; **still surface at 0.85 score** via lexical channels |
| Constitutional rows | 70 rows / 20 distinct titles | 3.5× duplication + 1 sandbox row from `/tmp` auto-injected into every session priming |
| Trigger phrases | 165,979; 45% single words | "feature"×2,072, "specification"×2,034, "z_archive"×848 |
| Causal edges | 33,101; 31,118 (94%) = entity_linker 'supports' @0.7 | real causal edges ≈ 1,983 |
| Rows ever accessed | **65 / 33,101** | usage-based signals (FSRS/decay/promotion) have no fuel |
| memory_surrogates | 7,108 rows, generated with placeholder titles | "What is Memory 4821?" |
| chunks / partial parents | 0 / 0 | chunking never engaged; 39 docs >50KB (max 193KB) single-vector |
| Search latency | 2.0–2.9s warm; +3.9s first-call auto-surface; 15s cold init | stage2 ~1.2s constant (see §4) |
| memory_match_triggers | 2.3s warm / 17s cold | Gate-1 hot path, per user message |
| Health vs stats | disagree by 7,369 rows | stats silently excludes deprecated; health counts raw |

**Live search-quality reproduction 🟢:** query "packet 028 memory search intelligence status" → ranks 1–4 are **four snapshots of the same spec.md** (1 current path + 3 stale-path/deprecated). Query on dist-freshness → 3 of 5 slots one doc. Trigger match on a resume-style prompt → 5/5 hits from `z_archive` via single-word matches.

---

## 2. ROOT-CAUSE CHAINS (the new, load-bearing findings)

### Chain A — Duplicate/snapshot pollution 🟢
1. `content_hash` = raw sha256, no normalization (`memory-parser.ts:913`) → any CRLF/trailing-ws/`_memory.continuity.last_updated_at` churn = "new content".
2. Same-path re-save/re-index retires the predecessor by setting `importance_tier='deprecated'` (migration v28 pattern; `retirePredecessorForActiveReindex`) instead of deleting.
3. The uniqueness index `idx_memory_logical_key_active_unique` (`vector-index-schema.ts:2403`) is **partial — active rows only** → deprecated snapshots accumulate unboundedly.
4. Deprecated exclusion is **channel-inconsistent**: vector filters them (`vector-index-queries.ts:431`), FTS/BM25/graph/summary do not (summary archive filter is a literal no-op stub, `stage1-candidate-gen.ts:167`; graph injection has no tier filter, `causal-boost.ts:457,687`).
5. Result-time dedup keys on row id only (`hybrid-search.ts:949`), never on file identity → snapshots stack in top-K.
6. The track rename (`system-spec-kit` → `system-speckit`) was never healed: move-reconciliation matches per-folder, not per-track, and the **orphan sweep can never reach the dead rows** (Chain B).

### Chain B — Orphan sweep can't catch up 🟢
`handlers/memory-index.ts:684` calls `sweepOrphanIndexRows({limit: 200})` with **no cursor**; the function defaults cursor=0 and returns `nextCursor`, which is echoed in scan results but **never persisted or fed back**. Every scan re-checks the same ~200 lowest-id rows forever. That is why 12,352 dead-path rows persist while health reports `orphanFiles: 25` (a 200-row sample).

### Chain C — Dist-freshness deadlock took the surface down 🟢
1. `dist-freshness.cjs` per-entry check compares newest **source mtime** vs emitted file (`dist/spec-memory-cli.js`).
2. `tsc --build` skips re-emitting content-identical outputs (git checkout touched source mtimes) → entry mtime never advances.
3. The hash-cache that should break the loop is **only written after an mtime check passes** — it can never bootstrap. `npm run build` exits 0; CLI still refuses. (Live-reproduced twice.)
4. Exit code 75 ("retryable") is wrong for stale-dist (agent I: `spec-memory.cjs:55` uncommitted diff); `--help`/`--version` are also blocked; hooks fail open → **continuity silently dropped every session start**.
5. Independently, the daemon's context-server was crash-looping with **SIGBUS** earlier in the morning (launcher log 05:52–06:07) — self-healed, cause untraced (native module/mmap suspect).

### Chain D — Ranking signals are decorative 🟢/🟡
- **Rescue overwrite (default ON):** final score = `0.03·base + 0.78·lexicalOverlap` for **all** rows (`retrieval-rescue.ts:210` → `stage2-fusion.ts:1425`). Everything before it — learned triggers (+0.7), negative demotions (×0.3), graph/recency/co-activation — is compressed to ≤3.7% of the final ranking. Tests encode this as intended (026 lexical-grounding-floor lineage), but stage2's own architecture doc still presents the 13-step stack as the ranking authority. Only the validation multiplier (runs after, `stage2:1470`) survives.
- **Non-hybrid overwrite:** step-4 intent weighting recomputes score from *raw* similarity/importance/recency and syncs all aliases (`stage2-fusion.ts:1311-1318` 🟢), wiping steps 1a–2d on vector-only searches.
- **Top-pinning:** min-max normalization maps top to exactly 1.0; all later boosts clamp at 1.0 → boosts structurally inert at the top, ties resolved by hash/id (🟡 agent B/C).
- **Gates that never fire:** HyDE low-confidence gate compares 0.45 threshold against normalized scores whose max ≡ 1.0 → never fires with any candidate (`hyde.ts:88` 🟡); quality-gap fallback plan's `qualitySignal` param has no production caller (`query-router.ts:316` 🟡, live-confirmed `engaged:false`); degradation widening reads raw BM25 scale vs 0.02 threshold → never fires when any lexical row exists (`hybrid-search.ts:2652` 🟡).
- **Dead subsystems:** composite-scoring + interference battery have zero production callers while interference recompute burns O(folder²) on every write (🟡 C); chunking/MPAB only wired into memory_save, never the scan path that produced 99.96% of the corpus 🟢.
- Live telemetry corroborates: `causalBoostApplied:"applied"` with `causalBoosted:0`; graphContribution all zeros; `stateStats UNKNOWN:5` 🟢.

### Chain E — The learning loop can't learn 🟡 (fuel measured 🟢)
- 65/33k rows ever accessed; `trackAccess` silently dropped on cache hits (`memory-search.ts:1230`, cache args omit it) → FSRS never strengthens repeats.
- PE-gate REINFORCE/UPDATE lanes unreachable (same-path candidates excluded before the equality check, `pe-gating.ts:172` + `pe-orchestration.ts:88`) → every save is CREATE; tests mask it by mocking.
- Learned-term cap counts expired terms; `expireLearnedTerms` has no callers → memories permanently stop learning after the first 8 terms age out (`learned-feedback.ts:381`).
- `query_reformulated` (a dissatisfaction signal) counted as a **positive** boost in batch learning (`batch-learning.ts:314`).
- Working-memory decay re-applies full decay each prompt and re-adds mention boosts (`working-memory.ts:601-616`) → attention is binary.
- No demotion path or hysteresis for auto-promotion; promotion throttle is global (3/8h across all memories).

---

## 3. BUG INVENTORY (curated; new findings only)

### P0
| # | Finding | Where | Status |
|---|---|---|---|
| 1 | Soft-delete tombstones invisible to every read path (deleted memories stay searchable; edges hard-deleted anyway) | `memory-crud-delete.ts:82-99` | 🟡 dormant (flag opt-in; 0 tombstones live) |
| 2 | Full-auto canonical routed save structurally self-rejects: POST_SAVE_FINGERPRINT validated pre-promotion (validator also writes the snapshot back); advertised "apply" follow-up never dispatches the canonical writer (no non-test caller) | `memory-save.ts:1803,3200` + `spec-doc-structure.ts:1105` + `atomic-index-memory.ts:360` | 🟡 |
| 3 | Chunking safe-swap deletes the just-updated chunk rows (staging dedups to update-in-place; old-ids captured post-staging then bulk-deleted; parent left 'partial' with 500-char summary, mtime-skipped forever) | `chunking-orchestrator.ts:311,488-553` + `vector-index-store.ts:1857` | 🟢 mechanism verified; dormant (chunking never engages on scan path) |

### P1 — retrieval correctness
| # | Finding | Where |
|---|---|---|
| 4 | Orphan sweep cursor never persisted → only ~200 lowest-id rows ever swept (12,352 dead rows live) | `memory-index.ts:684` 🟢 |
| 5 | stage4 default/empty `minState` maps to priority 6 (> HOT) → known-state rows silently dropped; nullifies community injection today, catastrophic if memory_state populates | `stage4-filter.ts:144` 🟡 |
| 6 | Trigger-lane promotion appends rows bypassing tenant/user/agent scope, tier, contextType, quality filters | `orchestrator.ts:125-163` 🟡 |
| 7 | Rescue-injected rows bypass tier/contextType/quality/expiry/embedding-status gates (default ON) | `retrieval-rescue.ts:388` 🟡 |
| 8 | Multi-concept search rows get no similarity/score → effective score 0, ranked by recency/hash | `vector-index-queries.ts:586` 🟡 |
| 9 | `toHybridResult` leaks raw unbounded BM25 scores into `score` (enhanced path re-sorts on it; leftovers clamp to flat 1.0 in pipeline) | `hybrid-search.ts:232` 🟡 |
| 10 | memory_match_triggers `specFolder` filter is exact-match while every other surface is prefix-aware → phase-child recall loss | `memory-triggers.ts:449,269` 🟡 |
| 11 | Graph channel FTS is implicit-AND over all tokens (stopwords incl.) → verbose queries get 0 graph candidates | `graph-search-fn.ts:161` 🟡 |
| 12 | HyDE gate can never fire (normalized-score vs absolute threshold) | `hyde.ts:88,134` 🟡 |
| 13 | Non-hybrid step-4 intent recompute wipes prior boosts | `stage2-fusion.ts:1311` 🟢 |
| 14 | Typed-traversal causal boost cap-saturates → flat max boost, relation priors inert | `causal-boost.ts:520-569` 🟡 |
| 15 | Composite/interference battery dead; interference O(folder²) still on write path | `composite-scoring.ts` module 🟡 |
| 16 | Async-embedding drain writes only `vec_memories`, never active `vec_<dim>` → drained rows success-but-invisible (031 T-0175 class residue; matches live 367) | `retry-manager.ts:747` 🟡 |
| 17 | Move-reconcile doesn't repoint `active_memory_projection` → path reuse makes moved row permanently unsearchable | `incremental-index.ts:657` 🟡 |
| 18 | Progressive-disclosure cursors lose scope binding after page 1 + client-forgeable (tenant leak) | `progressive-disclosure.ts:402` 🟡 |
| 19 | recomputeLocal edge-strength ratchet: every save inflates strengths toward 1.0 (even 0 new edges) | `graph-lifecycle.ts:309` 🟡 |
| 20 | Working-memory decay double-apply + mention-boost re-add | `working-memory.ts:601` 🟡 |

### P1 — save/write correctness
| # | Finding | Where |
|---|---|---|
| 21 | Transactional complement recheck enforces reconsolidation thresholds with recon DISABLED, ignores `force` → E088 aborts on legit re-saves | `memory-save.ts:2618` 🟡 |
| 22 | Quality-gate semantic dedup doesn't exclude own predecessor → re-save rejected as near-dup of itself (enforce mode) | `memory-save.ts:2398` + `save-quality-gate.ts:704` 🟡 |
| 23 | Tier validation lowercases for check, stores raw ('Deprecated' escapes every case-sensitive tier predicate incl. unique-index partition) | `memory-crud-update.ts:254` 🟡 |
| 24 | Health hard-exclusion audit queries nonexistent column `content` → diagnostic can never fire, always 'ok' | `memory-crud-health.ts:463` 🟡 |
| 25 | Batch-learning positive sign for reformulation + restart double-counting; ablation DB swap leaves graph channel on closed connection | `batch-learning.ts:314,472` / `eval-reporting.ts:138` 🟡 |
| 26 | PE-gate REINFORCE/UPDATE unreachable (see Chain E) | `pe-gating.ts:172` 🟡 |
| 27 | Learned-term cap counts expired terms; expiry maintenance unwired | `learned-feedback.ts:381` 🟡 |
| 28 | Envelope-fidelity flag documented default-OFF, actually default-ON; exit-75 taxonomy wrong for stale dist (hooks fail open silently) | `search.md:78` / `spec-memory.cjs:55` 🟢 |

### P2 highlights (full list in agent sections of the ledger)
- `[CRITICAL]`/`[IMPORTANT]` bare substring anywhere in body sets tier (`memory-parser.ts:892`) — explains 948 critical rows incl. 272 in z_archive 🟢(data)/🟡(code).
- Session dedup marks results "sent" before budget truncation → never-shown memories suppressed all session (`memory-search.ts:1652`).
- Evidence-gap Z-score: n=2 always flags a gap (z≡1.0 < 1.3) (`evidence-gap-detector.ts:283`).
- Keyword lane concat double-counts docs when BM25 delegates to FTS5; ablation-tuned 0.3/0.6 channel weights are dead code; trigger weight 1.4 bypasses fusion normalization (2.3× a vector hit).
- Scan coalescing is scope-blind (scoped scan B "succeeds" without scanning); cancelled scan arms the cooldown; lease heartbeat can resurrect a released lease.
- Preflight exact-dup errors on re-saving an unchanged file (duplicate-of-itself); dedup matches tombstoned rows (no resurrect path); retire-carry can re-stamp 'deprecated' onto the successor (invisible new rows reporting success).
- Causal-links fuzzy `LIKE '%ref%'` fallback links the newest matching memory anywhere; 'blocks' stored as reversed 'enabled' (inverted polarity).
- World-summary prelude reads an arbitrary rowid-prefix (bare LIMIT, no ORDER BY) → only the oldest ~75 summaries ever ground the prelude.
- Intent classifier: "how does X work" (no article) earns zero understand evidence; substring keywords ('fix'⊂"prefix", 'spec'⊂"inspect") steal routing.
- LLM reformulation: memory content interpolated unfenced into the prompt (injection vector); cache checked before feature flag; no negative caching (8s stall per deep query on outage).
- Trigger phrases with apostrophes silently dropped by the frontmatter parser; quality auto-fix **replaces** user-authored triggers instead of merging (default ON).
- Community system: memberships frozen at last checkpoint-restore; phantom injected ids for deleted memories; "Louvain" is unweighted label propagation; substring scoring ("art" matches "start").
- Result explainability labels every ranked row `semantic_match`; `why` is computed (default ON) but never rendered anywhere.
- `--format text` renders the summary line only — all result rows silently dropped.
- memory_stats vs memory_health count different populations with no note 🟢.

---

## 4. PERFORMANCE (why search feels slow) 
Measured 🟢: warm search 2.0–2.9s; stage1 0.5–1.5s, stage2 ~1.2s constant for 15–19 candidates; match_triggers 2.3s warm; +3.9s first-call auto-surface; ~15s cold runtime init; RSS ~492MB at 9s uptime.

Dominant causes found 🟡 (attribution inferred, individually verified):
1. **Retrieval-rescue (default ON, every search):** full-table `LIKE` scan over concatenated title/triggers/path/content_text (×10 tokens, LIMIT 250) + **N+1 `SELECT *` hydration per candidate** (`retrieval-rescue.ts:303,336`).
2. **Trigger cache rebuild re-reads every canonical spec doc from disk** on each 60s TTL expiry, synchronously, in the match_triggers hot path (`trigger-matcher.ts:333`).
3. `computeGraphWalkMetrics` rebuilds the full edge adjacency (33k edges) per search, uncached (`graph-signals.ts:576`).
4. `applyCommunityBoost` re-loads + JSON-parses the whole communities table per candidate row (`community-detection.ts:623`).
5. Intent classifier re-embeds the query once per intent (7×) per classification; classification runs 6–8× per deep query (`intent-classifier.ts:502`).
6. Envelope post-processing JSON round-trips the payload up to ~8× (`memory-search.ts:1564-1913`).
7. `keyword_search` fallback pulls the entire table (incl. content_text) into JS with no LIMIT (`vector-index-queries.ts:875`).
8. Scan path: ~2 statSync/row full-table stale checks per scan; O(folder²) interference recompute inside every insert/update tx; per-save 500-edge BFS with shift() dequeue.
9. Default retry drain 5 rows/5min → 8.7k pending vectors ≈ days-weeks to drain 🟢(config)/🟡(rate).

---

## 5. COMMANDS & PRESENTATION (user-facing)
- **Token economics inverted 🟢:** 17.6KB envelope for 5 results; every telemetry block double-emitted in camelCase AND snake_case (`artifactRouting`/`artifact_routing`, `searchDecisionEnvelope`/`search_decision_envelope`, `graphContribution`, `appliedBoosts`); `meta.tokenCount` 6,455 vs enforced budget 3,500 (budget runs before graphContext/envelope attach; results get compacted while metadata survives); progressive disclosure emits empty snippets with `detailAvailable:false`.
- **Constitutional block (~2k tokens) rides every search**; fallback chains in `/memory:search` can pay it multiple times per command.
- **Doc/code drift cluster 🟡:** envelope-fidelity flag doc says default-OFF (actually ON); README documents `--intent:type` colon form (never parsed) and `validate <useful|not>` (actual true/false); stats presentation maps field names the tool doesn't return; hooks README documents a nonexistent `opencode/` folder; schema "v37" vs actual v41; 4-state vs 5-state model drift; `/spec_kit:resume` stale slug.
- **Dual command trees** (`.opencode/commands` + `.claude/commands`) byte-identical with no sync check — silent fork risk.
- **Missing affordances:** no "show more" (cursor exists in schema, no render slot); result `#id`s not surfaced as follow-up commands; page-2+ cursor results carry snippet-only (no title/path/score); exhausted vs invalid cursor indistinguishable; `why` never shown; hook failures invisible (recommend a one-line "Memory: CLI fallback skipped (reason)" in startup surface).
- Trust surface confusion 🟢: top result carried `trustBadges.orphan:true` (wrong) and `confidence.value 0.164 (medium)` on a 0.908-score hit — calibrated-P vs banded-label divergence is by design but reads as broken.

---

## 6. WHAT'S ALREADY KNOWN (don't re-litigate)
Tracked open elsewhere: T-0211 (causal boost never applies — Group A per-request flag-read root cause), T-0212 (community fallback), REQ-214 (context headers), 028/006/002 (derived_id split, semantic-edge embed in BEGIN IMMEDIATE, retention snapshot), 028/006/004 (91 P2 triage), T-0444 (advisor gold labels), T-0372 (session_resume strict), ~22 Phase-2 appendix items. Deliberately not built (with recorded reasons): citation-ledger reranker (data-gated), calibration re-fit (proven non-fix), retrieval-class routing (cut), cosine-band reconsolidation (cut → content-hash planned). This report's findings are additive; overlaps are called out.

---

## 7. RECOMMENDED PRIORITY ORDER

**Wave 1 — Corpus repair (biggest visible win, no algorithm changes):**
1. Persist the orphan-sweep cursor (field already returned; ~5 lines) then let scans drain the 12,352 dead rows.
2. One-shot migration: heal `system-spec-kit/`→`system-speckit/` identity (extend move-reconcile to track prefix), collapse dup-hash rows, purge stale deprecated snapshots (or exclude deprecated from ALL channels via one shared predicate).
3. Implement the archive concept end-to-end: add 'archived' to VALid_TIERS, mark z_archive rows, honor includeArchived.
4. Constitutional cleanup: dedup 70→20, purge the `/tmp` sandbox row, add a write guard (no constitutional rows from /tmp or sandbox folders).
5. Trigger-phrase retroactive regeneration for legacy word-soup rows + write-side merge-not-replace + matcher-side stopword/IDF guard for single tokens + archive exclusion.
6. Normalize content-hash (CRLF/ws/continuity-timestamp zeroing) to stop the snapshot churn at the source.
7. Run `memory_embedding_reconcile` (fix the 367) and raise the retry-drain rate; fix retry-manager to write the active shard (finding 16).

**Wave 2 — Ranking truthfulness:**
8. Decide the rescue layer's role explicitly: either document lexical dominance as the contract and delete/neuter the 13-step stack, or demote rescue to a bounded additive delta. (Everything else in ranking is noise until this is decided.)
9. Fix the flat-out bugs behind that decision: minState inversion, filter bypasses (trigger-lane promotion, rescue injection), multi-concept scores, raw-BM25 leak, HyDE gate, graph-FTS AND, non-hybrid overwrite, causal-boost saturation.
10. Delete or wire the dead battery (composite/interference) and stop the O(folder²) write-tax.
11. Make eval measure production: route eval-reporting through `executePipeline` (it currently exercises the legacy monolith with different co-activation/truncation).

**Wave 3 — Performance:** batch rescue hydration + FTS-route its backfill; cache trigger extraction by (path, mtime); cache graph adjacency; hoist community load; single-serialize the envelope; kill double-emission (pick one casing, ~40% envelope shrink).

**Wave 4 — Learning loop:** PE exclusion param fix; reformulation sign; expiry-aware term cap + wire maintenance into /memory:manage; trackAccess on cache hits; demotion/hysteresis.

**Wave 5 — Ops/presentation:** finalize-dist writes freshness hash-caches (breaks the deadlock); exempt --help/--version; correct exit taxonomy + surface hook fallback status; budget-after-attach; render `why`; text formatter rows; cursor "show more" + follow-up hints; sync check for the dual command trees.

---

*Full per-agent raw findings (~150 items with evidence quotes) live in the session ledger: `scratchpad/findings-ledger.md`. Agent-verified items were spot-checked; anything load-bearing for Waves 1–2 that I did not personally re-read is marked 🟡 and should get a confirm-before-fix pass per the finding-is-a-hypothesis rule.*
