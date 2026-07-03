# Remediation Program Decomposition — 028/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory

Gate 3: answered E (phases under 028). Absorption: user chose ABSORB (Group-A + 028/006/002 + 028/006/004 fold in here; phase 013 closes out the old trackers with pointers).
Prereq: GPT-5.5 restructure adopts 030→013, 031→014, 032→015 under 028; this program parent takes 016.
Parent slug: `016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory` (phase parent: spec.md + description.json + graph-metadata.json only; all working docs in children).
Source evidence: scratchpad/memory-search-deep-dive.md (report) + scratchpad/findings-ledger.md (raw ~150 findings). Finding refs below use report §3 numbering (#N) + ledger tags (L#, agent letters).

## RECOMMENDED EXECUTION ORDER
011 → 001 → 002 → 003 → 004 → 005 → 006 → 007 → 008 → 009 → 010 → 012 → 013
Rationale: 011 restores daemon/CLI trust + health truthfulness (and everything after needs a reliable surface); 001–005 are corpus/data repair (biggest visible win, no algorithm churn); 006 makes the one architecture decision that gates all ranking work and lands eval-parity so changes are measurable; 007–008 are the ranking/graph bug batteries; 009 learning loop; 010 perf (after correctness); 012 presentation; 013 closes absorbed trackers.

## CHILDREN (13)

### 001-orphan-sweep-cursor-and-corpus-identity-repair — L3
- Persist orphan-sweep cursor across scans (config table), feed `sweepOrphanIndexRows({cursor})`; drain the 12,352 dead-path rows (#4 🟢, memory-index.ts:684, incremental-index.ts:443).
- Track-prefix identity heal: one-shot migration re-pointing `system-spec-kit/*` rows → `system-speckit/*` where target exists; extend move-reconciliation to track-level renames.
- Repoint `active_memory_projection` inside reconcileMoves (#17, incremental-index.ts:657); extend reconcile to chunked docs (LIMIT 2 guard).
- Collapse dup-hash rows (12,280): keep winner per logical key, delete/deprecate losers WITH read-exclusion honored (dep: 002 predicate); decide `near_duplicate_of` backfill vs drop column.
- Orphan path-resolution hardening: resolve relative stored paths against base before existence check (F P2).
- Legacy `specs/` scope prefix acceptance in normalizeSpecFolderScope; align getSpecsBasePaths vs findSpecDocuments discovery surfaces (F refinements).
- Success gates: orphan rows→0 on full drain; cross-prefix dupes→0; health orphanFiles honest; scoped searches return 1 row per doc.

### 002-archived-tier-and-tombstone-read-exclusions — L3
- Implement 'archived' tier end-to-end: add to VALID_TIERS, settable via memory_update, exclusion honored in every channel, includeArchived param unhardcode (H refinement, E contract; L5 🟢).
- Mark z_archive corpus rows archived (11,086) via migration; retro-demote their critical/important tiers.
- ONE shared active-row predicate (deleted_at IS NULL AND tier NOT IN (deprecated, archived[, constitutional-injected-separately])) applied to: vector, FTS, BM25, graph injection (causal-boost.ts:457,687), summary lane (stage1:167 no-op stub), community members, rescue backfill, trigger cache, keyword fallback, stats/health counts.
- P0 tombstone visibility (#1, memory-crud-delete.ts:82): deleted_at filters everywhere; tombstone mode stops hard-deleting edges; bulk-delete re-tombstone idempotency (H P2).
- Tier write normalization (lowercase) at update/save (#23); `[CRITICAL]`/`[IMPORTANT]` substring→frontmatter-only (H P2 memory-parser.ts:892) + retro-fix mislabeled rows (948 critical audit).
- stats vs health population note + active-vs-raw split (H P2, 🟢 L1).
- Success gates: deprecated/archived rows absent from all channels; delete actually hides; tier distributions sane post-migration.

### 003-content-hash-normalization-and-save-dedup-lanes — L3
- Normalize content-hash input (CRLF/trailing-ws; zero continuity fingerprint/timestamp lines) — kills snapshot churn at source (H OPT-P2 🟢 root cause of L1); dual-compare migration for existing hashes.
- Unify the two `buildContinuityFingerprint` builders (H contract).
- PE-gate: drop same-path exclusion from findSimilarMemories call so UPDATE/REINFORCE reachable (#26, pe-orchestration.ts:66); fix tests that mock it; extend canonical-path guard to SUPERSEDE (G P1 cross-file regex deprecation); PE audit init wiring (dead T-09 logging).
- Transactional complement recheck: gate on recon-enabled + !force; exclude same-path predecessor (#21, memory-save.ts:2618).
- Quality-gate Layer-3 dedup predecessor exclusion (#22).
- Preflight exact-dup same-path exclusion → benign 'unchanged' (H P2).
- Recon conflict path: retire predecessor before insert (unique-index collision, H P1).
- Retire-carry: stop re-stamping 'deprecated' onto successor; dedup/tombstone visibility in save results (resurrect path) (H P2).
- P0 full-auto canonical save self-reject: run POST_SAVE_FINGERPRINT post-promotion (or against pending content); make apply follow-up dispatch the canonical writer (#2, memory-save.ts:1803/3200, atomic-index-memory.ts:360); un-skip parity tests.
- Governance rollback re-activates retired predecessor (H P2); chunked-save rollback transactional note; spec-folder mutex reclaim rename-verify (H P2); BM25 add post-commit (H P2).
- Result-time file-identity collapse in pipeline (same canonical path → keep best) as belt-and-braces (🟢 L1 dedup key id-only, hybrid-search.ts:949).
- Success gates: re-save unchanged file → 'unchanged'; edited re-save → UPDATE/REINFORCE lane; no new deprecated snapshots from timestamp churn; 028-status query returns 1 row.

### 004-embedding-coverage-and-vector-shard-consistency — L3
- Run + schedule memory_embedding_reconcile (367 success-no-vector 🟢); wire into /memory:manage + maintenance cadence.
- retry-manager drain writes through writeActiveVectorPayload (active vec_<dim>) (#16, retry-manager.ts:747); drain embeds same weighted text as sync path + cache-key fix (F P2 ×2); scale drain batch/interval by queue size (8.7k pending → hours not weeks); retry dead-end status rescue (retry@max invisible, F P2).
- embedding_model attribution: normalize the two nomic spellings; backfill empty (27,706) from shard provenance; assert embedder identity at query time (stale-model vectors vs query embedder).
- 'auto' embedder shard-repair sentinel fix (counts vs writes mismatch, F contract).
- Chunking decision: wire chunked indexing into the scan path for >threshold docs OR document single-vector policy + FTS-only tail coverage explicitly; FIX P0 safe-swap self-delete either way (#3 🟢, chunking-orchestrator.ts:488 + appendOnly staging or oldChildIds=old−new); un-skip/cover the update path in tests.
- pendingVectors undercount on updated files (F P2); scan coalescing scope-blind + cancel-cooldown + heartbeat-phantom-lease fixes (F P2 ×3 — or move to 010 if sized out; keep here: same files).
- Success gates: success-row == vector-row counts; pending drains < 24h; big docs searchable beyond embedder window (if chunking chosen).

### 005-trigger-phrase-quality-and-matcher-guards — L2
- Retroactive trigger regeneration for legacy word-soup rows (45% single-word occurrences 🟢 L4): reuse quality-loop extractor; migration batch.
- Write side: auto-fix MERGES with user triggers instead of replacing (G P2 memory-save.ts:537); case-insensitive dedupe + count cap; apostrophe/multi-line parsing fix (H P2 memory-parser.ts:820).
- Matcher: stopword/min-length/IDF guard for single-token matches; per-memory phrase dedup (E P2); archive/deprecated exclusion in cache loader (uses 002 predicate); specFolder prefix matching (#10 memory-triggers.ts:449,269); constitutional rows visible to trigger cache (E refinement — decide + document either way).
- Constitutional hygiene: dedup 70→20 rows, purge /tmp sandbox row, add write guard rejecting constitutional saves from /tmp|sandbox paths (🟢 L5).
- Trigger backfill: failed rows keep failed (attempt cap/backoff); FK cleanup for deleted memories (E P2).
- Perf (hot path): phrase extraction cached by (path, mtime) — stop full-corpus disk re-read per 60s TTL (E OPT 🟢 2.3s warm); batched record fetch (id IN).
- Success gates: match_triggers p50 < 300ms warm; junk single-word matches gone; Gate-1 surfacing returns active-packet docs on resume prompts.

### 006-rescue-layer-ranking-authority-decision — L3 (decision-record REQUIRED)
- Task 1 (prereq for all ranking measurement): eval-parity — route eval-reporting/ablation through executePipeline (C contract: legacy monolith diverges: own co-activation/truncation); fix ablation DB-swap graph-channel closed-connection + rebindDatabaseConsumers rebuild (G P1); eval DB path cwd dependence (G contract).
- The decision: rescue layer (0.03·base + 0.78·lexical, default ON — 026 lexical-grounding-floor lineage) either (a) documented as THE ranking contract → then delete/no-op the neutered upstream signal steps and their write-path costs, or (b) demoted to bounded additive delta / injected-rows-only → then upstream stack becomes real. A/B via fixed query set + prod-mode completeRecall@3 (respect the truncation law from 005-data-quality).
- Encode signal-ordering contract (anything ranking-relevant must run post-rescue or be folded into it) in stage2 docs + a test asserting the contract.
- Dead-battery disposition per decision: composite-scoring/interference/attention-decay modules + O(folder²) write refresh (C P1) — wire or delete.
- Success gates: decision-record with benchmark deltas; stage2 doc == behavior; no signal computed-but-discarded without an explicit doc note.

### 007-ranking-filter-bypass-and-score-scale-fixes — L3 (absorbs Group-A)
- Group-A root cause (absorbed T-0211/T-0212/REQ-214): per-request flag reads vs process-start cache; then verify causal boost applies, community fallback surfaces, context headers inject (031 plan.md Group A).
- Filter-bypass battery: minState inversion (#5 stage4-filter.ts:144); trigger-lane promotion re-applies scope/tier/context/quality (#6 orchestrator.ts:125); rescue-injected rows same (#7 retrieval-rescue.ts:388).
- Score-scale battery: multi-concept similarity mapping (#8 vector-index-queries.ts:586); toHybridResult rrfScore-not-raw (#9 hybrid-search.ts:232) + degradation check on rrfScore (B P2); keyword-lane dedupe/double-count + dead 0.3/0.6 weights (B P2); adaptive-fusion divisor + trigger-weight normalization (B P2); MPAB clamp-at-assignment (B P2); resolveEffectiveScore intentAdjustedScore pinning contract + surrogate threshold gate (D P2); parseFloat falsy-zero knobs (C P2); normalization headroom (sub-1 band or pre-norm boosts) (C P2); recency bonus saturation (C P2).
- Gate fixes: HyDE absolute-relevance gate (#12); graph-FTS OR-tokens (#11 graph-search-fn.ts:161); non-hybrid step-4 blend-not-recompute (#13 🟢); causal-boost typed-traversal scaling (#14); quality-gap fallback wire qualitySignal or delete (D P2); evidence-gap n≤2 (G/B P2); intent-classifier article-optional patterns + word-boundary keywords + per-match normalization (D P2); memory_context intent confidence forwarding (E P2).
- Community: injection existence check + effective-score base + communityDelta recording (C/D P2); community-search token matching (D P2).
- Success gates: adversarial test per fixed bypass; before/after eval on the 006 harness; graphContribution non-zero when boosts real.

### 008-causal-graph-hygiene-and-entity-linker-noise — L3 (absorbs 028/006/002 P1-2, P1-4)
- Entity-linker 'supports' pollution (31,118/33,101 🟢 L8): move memory↔memory entity co-occurrence edges to their own relation (`entity_cooccurrence`) or table; density guard counts numeric-endpoint edges only (D P2); exclude from causal boost unless opted; migration for existing edges.
- recomputeLocal: derive strength from graph state, stop the +0.1 ratchet (D P1); typed-degree weights consistency; onWrite skip when inserted==0.
- Absorbed 028/006/002: causal-edge derived_id identity unification (migration vs live-write defaults); semantic-edge embedding OUT of consolidation BEGIN IMMEDIATE (maintenance-marker refresh).
- causal-links-processor: fuzzy-LIKE fallback → unresolved-with-suggestion (H P2); blocks→contradicts polarity (H P2); numeric refs liveness/parent filters (H refinement).
- entity-linker: normalized incremental matching (D P2); degree-cache invalidation + canonical pair order (D P2); catalog LIMIT 500 ORDER BY + pruning path for entity_catalog/memory_entities (561k rows); per-memory error no full-corpus fallback in save path (D contract).
- Surrogates: real titles (D P2 graph-lifecycle.ts:532) + regenerate 7,108 rows; alias dup provenance fix.
- Community lifecycle: rebuild cadence beyond checkpoint-restore; stable community IDs; fingerprint collision + DB-rebind cache reset (D P2); "Louvain" naming honesty or real modularity (decision).
- Graph-signals: momentum nearest-snapshot lookup (C P2); per-DB cache keys (C P2); pseudo-node filtering in estimateComponentSize/recomputeLocal + dirty-set drain when no refresh fn (D P2).
- Success gates: causal graph relation histogram sane; causal boost (per 007) boosts real causality; graph channel returns candidates on verbose queries.

### 009-learning-feedback-loop-repair — L2 (absorbs 028/006/002 P1-5)
- trackAccess on cache hits (B P2); FSRS last_review ISO format (C P2); last_review not refreshed on empty metadata calls (H OPT).
- learned-feedback: expiry-aware 8-term cap; wire expireLearnedTerms/clearAllLearnedTriggers into /memory:manage; shadow-period MIN(timestamp) retention caveat (G).
- batch-learning: reformulation weighted negative; per-(memory,window) idempotency; SQL aggregation (G P1/P2/OPT).
- corrections: active-pair no-op on retry; delta-based undo (G P2).
- auto-promotion: demotion + hysteresis; per-memory throttle; batched negative counts (G refinement/OPT).
- Absorbed 028/006/002 P1-5: retention spare-only delete stale-snapshot fix; retention extend window widening (G refinement).
- Ledger retention sweeps (feedback_events, shadow_scoring_log, batch_learning_log, audits, memory_conflicts, adaptive_signal_events) with age policies (G P2, C OPT).
- shadow eval: query-scoped relevance labels or unlabeled cycles; empty-holdout non-recording (G P2); true-citation regex fixes + session-scoped uniqueness (G P2/refinement).
- quality-loop: bestScore with bestContent; fix-log honesty (G P2).
- Success gates: repeat-query strengthening observable; promotion/demotion cycle test; ledgers bounded.

### 010-search-hot-path-performance — L2
- Rescue: batched hydration (id IN) + FTS-routed backfill or weak-result gating (B OPT-P1 ×2 — the measured ~1.2s stage2 🟢).
- Graph adjacency cache (C OPT); community single-load map (D OPT); intent-classifier embedding hoist + per-query memoize (D OPT); retrieval-directives + constitutional content caching by mtime (D OPT); envelope single-serialization thread-through (E OPT); keyword_search SQL-side LIMIT/FTS route (F OPT-P1); per-channel fetch 2-3× limit before fusion cap (B OPT); provenance Set hoist (B OPT); BM25 corpus over-fetch gate (B OPT); co-activation heap (C OPT); BFS state dedup (D OPT).
- Scan-side: statSync batching/dir-walk (F OPT-P1); interference refresh disposition executed per 006 decision; alias hygiene scoped scans (F OPT); Path-4 hash fast-path (F OPT); folder-discovery cache TTL probe (F OPT).
- Targets: memory_search p50 < 800ms warm @33k rows; match_triggers < 300ms (from 005); scan event-loop lag warnings gone.

### 011-daemon-freshness-and-health-truthfulness — L2 (FIRST in execution order)
- Dist-freshness deadlock (🟢 Chain C): finalize-dist.mjs writes per-entry source-hash caches post-build; checker trusts hash-cache first; --help/--version/completion exempt from gate; exit taxonomy: stale-dist distinct/non-retryable or 75-documented (uncommitted spec-memory.cjs diff reconciled + committed); recovery text unified; help-text 69/75 alignment (I P1).
- Hook fallback visibility: one-line "Memory: CLI fallback skipped (<reason>)" in startup surface; session_health exposes last-fallback status (I gap 🟢 this session's silent loss).
- Health truthfulness: exclusion-audit content_text column (#24); last-scan read when runtime not initialized (🟢 note); orphanFiles labeled sampled; consistency mismatchedIds capped payload; maintenance lastRun wiring.
- SIGBUS crash investigation: crash-probe receipt analysis, native module (better-sqlite3/sqlite-vec) rebuild check, launcher backoff cap (🟢 launcher log) — timeboxed diagnosis task with mitigation notes.
- memory_stats/health shared population definitions (with 002).
- ExperimentalWarning suppression in CLI spawn (--no-warnings) (I gap).
- Success gates: build → fresh verdict same session; stale-dist visibly surfaced at startup; health numbers reconcile with raw SQL within documented definitions.

### 012-envelope-presentation-and-command-doc-alignment — L2
- Envelope: single casing (kill camelCase+snake_case double emission 🟢 L7); budget enforcement AFTER graphContext/routing/envelope attach (E P2) + remove dead sanity guard (E P2); meta.tokenCount honesty; compact-row snippet floor.
- Progressive disclosure: substitute-or-drop decision (B OPT); cursor scopeKey server-side (#18); page-2 metadata; exhausted-vs-invalid distinction; no dead cursors in cached responses; cursorStore stores ids+snippets only (E).
- Render why (one-token suffix slot) or trace-gate emission (I gap); formatter passes canonicalSource/documentType/_communityFallback (E P1); semantic_match label gated on actual vector attribution (E P2); includeContent per-result cap + truncation marker (E P2); session-dedup mark-after-truncation (E P2); world-summary ORDER BY (E P2); no-input error via standard envelope (E P2).
- CLI: --format text minimal row renderer + omission notice (I gap).
- Command-doc drift battery (I): envelope-fidelity default-ON docs; --intent forms; validate true/false; stats field names; tool-coverage matrix vs allowed-tools; README section order + retention-sweep row; assets/ folder statement; hooks README opencode/ folder + settings.json name + /speckit:resume slug; save_workflow v37→v41 + retired filename checklist removal; memory_system DB_UPDATED_FILE path + 4/5-state model; resume presentation history hint; search.md arg-resolution quoting; manage health status enum; speckit resume "history" hint.
- Dual command-tree sync check (.opencode/commands ↔ .claude/commands) in validate or CI script (I contract).
- Constitutional block suppression after first call in fallback chains (includeConstitutional:false) (I gap); startup truncation at section boundaries (I gap); UserPromptSubmit shim invalid-JSON concat fix (I P2).
- Success gates: 5-result search envelope < 6KB default; zero drifted doc claims on re-audit; text format usable.

### 013-absorb-028-006-review-remediation-closeout — L2
- Formally absorb + close: update 028/006/002 and 028/006/004 specs to point at phases 003/008/009 (002-scope) and the distributed P2 mapping (004-scope); complete the 91-P2 triage table mapping each to {fixed-in-phase-NNN | accept-as-is + reason}; update 028/006 parent spec + graph metadata; reconcile 014-manual-playbook-execution-sweep (ex-031) tasks.md Group-A/deferred rows → point at phase 007; mark 028 parent phase map statuses.
- Sweep the 🟡 findings ledger for anything not mapped by 001–012 → explicit accept-as-is entries with reasons (no silent drops).
- Final program validation: validate.sh --strict across parent+13 children; scoped memory_index_scan; memory save of program state.

## CROSS-CUTTING RULES FOR ALL PHASES
- Every finding fix cites the report/ledger ID in tasks.md (NOT in code comments — comment-hygiene HARD BLOCK).
- 🟡 findings get confirm-before-fix verification task first (finding-is-a-hypothesis).
- Baseline-before-no-regressions: capture vitest baseline + eval numbers before each phase's changes.
- Flags: fixes to default-ON behavior ship direct; behavior-changing ranking work behind flags only if 006 decision requires A/B.
