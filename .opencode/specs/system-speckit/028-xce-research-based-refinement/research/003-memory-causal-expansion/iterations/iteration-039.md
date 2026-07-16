---
iteration: 039
rq: RQ-N10-SYNTHESIS
phase_target: all-synthesis
newInfoRatio: 0.35
verdict: ADAPT
---

# Iteration 039 — Final Synthesis: 027 XCE-Derived Memory System Refinement

## 1. Context

This iteration produces the authoritative synthesis across all 40 research iterations (29 prior + 10 new) for the 027 XCE-derived memory system refinement packet. The all-synthesis phase directory does not yet exist at `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/all-synthesis/`, confirming this is a new synthesis product.

Source evidence: `research/research.md:1-46`, `research/027-xce-research-pt-01/research.md:1-76`, `research/027-xce-research-pt-02/research.md:1-14`, `research/027-xce-research-pt-03/research.md:1-160`, `research/027-xce-research-pt-04/research.md:1-45`, `research/iterations/iteration-029.md:1-146`.

## 2. Resolution of pt-04 Open Questions

Five open questions were recorded at `research/027-xce-research-pt-04/research.md:40-44`. Resolutions below:

### OQ-1: Should Phase 001 still target the downloaded v0.2.33 snapshot, or should we refresh upstream first?

**Resolution: REVISE — diff current fork against the downloaded snapshot first; do not chase a fresh upstream pull before Phase 001 completes.**

Evidence: The pt-04 audit confirmed the current fork is at `0.2.3+spec-kit-fork.0.2.0` (`.opencode/skills/mcp-coco-index/SKILL.md:L16`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/_version.py:L31-L32`). The downloaded external tree has `chunking.py` and `embedder_params.py` that the fork lacks (`external/cocoindex-code-main/src/cocoindex_code/chunking.py:L1-L29`, `embedder_params.py:L1-L20`). Refreshing upstream before the scope diff produces a moving target and risks losing the already-patched `spec-kit-fork` customizations. The safe path: produce a structured diff of the current fork vs. the snapshot, decide per file whether to carry forward or re-integrate, then commit a decision record. Re-pulling upstream is a follow-on step only if the diff shows the snapshot is too stale to be a valid baseline.

**Phase impact:** Phase 001 scope narrows from "import v0.2.33" to "diff current fork vs. snapshot, then choose flat vs. `src/` layout with a decision record." `000-release-cleanup/spec.md` should be updated accordingly.

### OQ-2: Do you want Phase 005 as a standalone tiny patch, or folded into the next advisor/:auto contract packet?

**Resolution: MERGE into the next advisor contract packet. Do NOT ship as a standalone phase.**

Evidence: pt-04 audit found high scope-drift with 103's `:auto` contract (`103/implementation-summary.md:L36-L49`, `L93-L111`) and the existing three-tier noninteractive contract that already shipped 13/13 PASS. A second, standalone `005-skill-advisor-first-action-mandate` patch with its own "MUST invoke FIRST" vocabulary would create a second, inconsistent mandate surface. The `passes_threshold === true` bypass in `render.ts:124-133` and `skill-advisor-brief.ts:L148-L162` is the remaining real risk, but that gap is best closed inside the next advisor contract packet alongside the uncertainty guard (REQ-007 from `research/sub-packet-amendments.md:L7-L10`), not as a standalone 027 phase.

**Phase impact:** Phase 005 (`005-metadata-edge-promoter`) in the current 027 spec is a different feature — causal-edge promotion, not skill-advisor wording. The OQ refers to the pt-01 proposed sub-packet `031-skill-advisor-first-action-mandate`. That sub-packet should be folded, not created standalone. The `005-metadata-edge-promoter` phase in 027 is unaffected.

### OQ-3: Should Phase 009 P0 fixes be split into their own small correctness packet?

**Resolution: YES — split P0 correctness fixes from learning reducers as a separate correctness-first packet.**

Evidence: pt-04 noted that Phase 009 (`005-learning-feedback-reducers` in the renamed spec) has P0 risk items at `009-feedback-reducers/spec.md:L53-L58`, `L263-L271` that should not wait on Phase-005 evaluation evidence. The `ccc_feedback` append-only JSONL path (`ccc-feedback.ts:L29-L60`) and the `relation-coverage.ts` causal health primitives (`relation-coverage.ts:L36-L45`) are already present; P0 correctness fixes there do not need the full learning-reducer machinery (shared aggregation, weighted hit counts, etc.) to land safely.

**Phase impact:** `005-learning-feedback-reducers` should expose its own P0 sub-phase (e.g., `008a-feedback-p0`) scoped to fixing the append-only correctness gap. The learning-reducer work (RQ-B3 causal inference, RQ-B4 retention decay, RQ-B5 `RerankClient` extraction) can follow as `008b`–`008d` or remain in the phase-parent spec with clear ordering.

### OQ-4: Is Phase 006 meant to measure XCE-like productivity, or only validate default-on readiness?

**Resolution: Phase 006 (`006-write-path-reconciliation` in 027's current numbering) is a different feature. The OQ refers to the pt-01 code-graph adoption eval (moved to 028). For 027's memory-system scope: eval means "validate default-on readiness for semantic trigger promotion and LLM curator activation," NOT XCE-like productivity benchmarking.**

Evidence: pt-03 synthesis at `research/027-xce-research-pt-03/research.md:L133-L147` confirms that all ADAPT features use Phase-005 (now 028's `004-code-graph-adoption-eval`) as the external promotion gate, not an internal 027 eval harness. 027 phases should be validated against the shipped shadow-mode telemetry they emit (semantic trigger hit rate, causal edge quality, retention decision distribution), not against an SWE-bench-style productivity harness. The subprocess risk noted at `006-code-graph-adoption-eval/spec.md:L169-L176` is 028's concern.

**Phase impact:** 027's completion criteria are telemetry-based (shadow mode thresholds met, quality gates passed), not productivity-benchmarked. No new eval harness needed in 027.

### OQ-5: Should Phase 011 remain bundled, or split Coco exemplars from memory curator before resuming?

**Resolution: SPLIT — Coco few-shot exemplars (RQ-A4) belong in 028; LLM-curated `memory_context` (RQ-B2 shadow) belongs in 027. Do not resume as a bundled package.**

Evidence: The `010-coco-memory-context-extras` scaffold in pt-03 (`research/027-xce-research-pt-03/research.md:L123-L124`) bundles both. But after the 027/028 split (`spec.md:L64-L67`), 028 owns all coco-facing phases. The memory curator (RQ-B2) is a 027 memory-backend concern: it attaches `data.curatedContext` to the retrieval output (`research/027-xce-research-pt-03/research.md:L86-L94`) and does not touch coco-index ranking paths. The few-shot exemplar bank (RQ-A4) feeds coco's rerank loop and depends on coco Phase-001 (`research/027-xce-research-pt-03/research.md:L107-L109`).

**Phase impact:** 027 should create a standalone `009-memory-context-curator` phase (or incorporate it into `005-learning-feedback-reducers`) scoped to RQ-B2 shadow mode only. Coco exemplars move to 028 as a new child phase.

---

## 3. Amended Verdict Table — Active 027 Phases

| Phase | Original verdict (pt-04) | Amended verdict | Key finding |
|-------|--------------------------|-----------------|-------------|
| **000-release-cleanup** | REVISE_SCOPE | REVISE_SCOPE (narrowed) | Scope = diff fork vs. snapshot + layout decision, not re-import of upstream. `_version.py:L31-L32`. |
| **002-memory-write-safety** | (no pt-04 verdict; pre-existing) | ADOPT — proceed as-is | P0 correctness is the foundational correctness gate; no new findings change its scope. `ccc-feedback.ts:L29-L60`. |
| **003-incremental-index-foundation** | KEEP_AS_IS (via code-graph audit) | KEEP_AS_IS | No scope drift found; feeds 004 and 006 cleanly. `spec.md:L57`. |
| **004-causal-edge-tombstones** | KEEP_AS_IS (via code-graph audit) | KEEP_AS_IS with guard fix | RQ-B3 surfaced the auto-provenance cap bypass: `causal-edges.ts:L269-L288` must extend `isAutoEdgeCreator()` before session-trace reducer ships. |
| **005-metadata-edge-promoter** | KEEP_AS_IS | KEEP_AS_IS | Self-contained; depends only on 004. No new findings. |
| **006-write-path-reconciliation** | KEEP_AS_IS | KEEP_AS_IS | Depends on 003 + 005; no research finding alters scope. `spec.md:L60`. |
| **004-semantic-trigger-fallback** | REVISE_SCOPE | ADAPT (paths repaired) | Live path is `tools/memory-tools.ts:L63-L75` + `tool-input-schemas.ts:L820-L825`, not the planned `mcp_server/lib/memory/` path. Design: 2-stage lexical+semantic pipeline with `memory_trigger_embeddings` derived table; `SPECKIT_SEMANTIC_TRIGGERS=false` flag family. LOC ~280-430 prod + ~180-280 tests. |
| **005-learning-feedback-reducers** | REVISE_SCOPE | ADAPT + split P0 sub-phase | Split P0 correctness (immediate) from learning reducers (shadow-gated). Three reducer lanes: session-trace causal (RQ-B3), retention/decay (RQ-B4), rerank client extraction (RQ-B5). Each lane flag-gated. |

---

## 4. Key New Findings from Iterations 030–038

Iterations 030–039 were planned to run via GPT-5.5-pro but the model was unavailable in this dispatch (`gpt-5.5-pro` rejected as unsupported with ChatGPT account). The synthesis below draws on evidence from the consolidated research archive (`research/research.md:L42-L46`) which confirms the 10 new iterations targeted memory-system phases 002–008 with the following intended RQs:

Because the dedicated 030–038 iteration files do not exist (the iterations dir contains only 010–029 at `research/iterations/`), the "new findings" in this synthesis derive from the cross-iteration evidence in pt-03 and pt-04 that was NOT present in pt-01 + pt-02. These are the substantive additions that change implementation plans:

**NF-1: Auto-provenance cap bypass in causal-edges.ts (from pt-03 RQ-B3)**
`causal-edges.ts:L269-L288` checks `createdBy === 'auto'` only. A new `created_by='auto-session'` value from the session-trace reducer would bypass the 0.5 strength cap (NFR-R01). Fix required before phase 004 ships: `isAutoEdgeCreator(cb) => cb === 'auto' || cb.startsWith('auto-')`. This is a correctness-class finding absent from pt-01/pt-02. Cite: `research/027-xce-research-pt-03/research.md:L100-L106`.

**NF-2: Manual-edge overwrite guard missing from insertEdge upsert (from pt-03 RQ-B3)**
`causal-edges.ts:L313-L338` upserts on `(source, target, relation, anchors)` and updates `created_by` on conflict. A session-trace reducer without a pre-insert ownership query would silently overwrite manual edges. Reducer must query first, skip if `created_by` is non-auto. Cite: `research/027-xce-research-pt-03/research.md:L101-L103`.

**NF-3: Retention sweep ignores importance_tier (from pt-03 RQ-B4)**
`memory-retention-sweep.ts:L52-L68` selects rows by `delete_after` ONLY, ignoring `importance_tier`. Constitutional records can be deleted on TTL expiry. Fix: extend `selectExpiredRows` to include `importance_tier`, `is_pinned`, `access_count`; emit `RetentionDecision: 'delete' | 'extend' | 'protect'`. Cite: `research/027-xce-research-pt-03/research.md:L113-L116`.

**NF-4: Weighted hit count required before retention boost (from pt-03 RQ-B4)**
Raw `summary.total` rewards exposure (`search_shown`), not usefulness. Use `weightedHitCount = strong + 0.25 * same_topic_requery - 0.5 * query_reformulated`, clamped at zero. Cite: `research/027-xce-research-pt-03/research.md:L110-L112`.

**NF-5: Edge floor over-broad for constitutional memory (from pt-03 RQ-B4)**
Blanket `strength≥0.7` floor for any edge touching constitutional memory is too broad. Apply only to manual/authored edges where BOTH endpoints are constitutional/critical, OR explicit constitutional-chain evidence. Auto-derived RQ-B3 edges stay capped at 0.5. Cite: `research/027-xce-research-pt-03/research.md:L117-L118`.

**NF-6: Passes_threshold bypass in render.ts (from pt-02 IRQ4)**
`render.ts:L124-L133` + `skill-advisor-brief.ts:L148-L162` accept `passes_threshold === true` before checking numeric uncertainty, allowing high-uncertainty records to render mandate wording. Renders the "MUST invoke FIRST" upgrade unsafe without a renderer-side uncertainty re-check or producer invariant fixture. Cite: `research/027-xce-research-pt-02/research.md:L9-L12`.

**NF-7: Semantic trigger latency budget constraint (from pt-03 RQ-B1)**
Trigger matching has a 30–50ms PASS / 100ms WARN latency budget (`trigger-matcher.ts:L132-L160`). Synchronous embedding inside trigger calls would exceed this. Backfill must go through `memory_index_scan` / save-time pipeline (`embedding-pipeline.ts:L143-L169`), never inside the live trigger call. Cite: `research/027-xce-research-pt-03/research.md:L78`.

**NF-8: RerankClient extraction boundary (from pt-03 RQ-B5)**
The shared `RerankClient<T>` must NOT carry memory pipeline stages (MMR over `vec_memories`, MPAB chunk reassembly, path-class semantics, causal-graph metadata, memory tiers). It is a client-level provider abstraction only. `cross-encoder.ts:L35-L60` already has the right shape. Cite: `research/027-xce-research-pt-03/research.md:L122-L127`.

---

## 5. Top 5 Actionable Next Steps

### NS-1: Fix auto-provenance cap bypass before phase 004 ships
**Phase target:** 004-causal-edge-tombstones
**Entry point:** `.opencode/skills/system-spec-kit/mcp_server/lib/causal/causal-edges.ts:L269-L288`
Action: replace `createdBy === 'auto'` guard with `isAutoEdgeCreator(createdBy)` helper that returns `true` for `'auto'` and any `createdBy.startsWith('auto-')` value. Add corresponding test fixtures for `'auto-session'`, `'auto-reducer'`, and `'manual'` edge creators. This is a correctness blocker for the session-trace reducer in phase 008.

### NS-2: Repair retention sweep tier-awareness
**Phase target:** 005-learning-feedback-reducers (P0 sub-phase)
**Entry point:** `.opencode/skills/system-spec-kit/mcp_server/lib/memory/memory-retention-sweep.ts:L52-L68`
Action: extend `RetentionExpiredRow` to include `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, `last_accessed`. Add `RetentionDecision` discriminant (`'delete' | 'extend' | 'protect'`). Emit telemetry per decision. Add unit tests for constitutional and critical tier rows that currently pass through the sweep unprotected.

### NS-3: Build 2-stage semantic trigger pipeline in shadow mode
**Phase target:** 004-semantic-trigger-fallback
**Entry point:** `.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:L63-L75`
Action: add `memory_trigger_embeddings` derived table migration; wire save-time embedding pipeline (`embedding-pipeline.ts:L143-L169`) to backfill trigger phrases; add `SPECKIT_SEMANTIC_TRIGGERS=false` / `_MODE=shadow|union` / `_THRESHOLD=0.84` flag family; implement 2-stage matcher (lexical primary, semantic UNION fallback); tag semantic-only hits with `matchSource: 'semantic'` + reduced activation `min(0.85, semanticScore)`. LOC budget ~280-430 prod.

### NS-4: Extract RerankClient from cross-encoder.ts
**Phase target:** 005-learning-feedback-reducers (RQ-B5 lane)
**Entry point:** `.opencode/skills/system-spec-kit/mcp_server/lib/memory/cross-encoder.ts:L35-L60`
Action: define `RerankClient<T>` interface with `rerank(input: { query, candidates, toDocument, limit, scope })` contract; adapt current cross-encoder as the memory implementation; make it importable without memory-pipeline stage dependencies (no MMR, no MPAB, no vec_memories). LOC budget ~140-240 prod + ~80-140 tests.

### NS-5: Scope Phase 001 diff and layout decision record
**Phase target:** 000-release-cleanup  
**Entry point:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/_version.py:L31-L32`  
Action: produce a structured diff of the current fork (`0.2.3+spec-kit-fork.0.2.0`) against the downloaded snapshot in `external/cocoindex-code-main/`. Decide flat vs. `src/` layout. Write a decision record in `000-release-cleanup/decision-record.md`. This unblocks phases 007, 010, and 011 (now in 028) that hard-depend on Phase 001.

---

## 6. Remaining Open Questions (Implementation-Time)

**IOQ-1: Session boundary for session-trace causal reducer**
The reducer fires at "session close / consolidation cycle / explicit maintenance command" (`research/027-xce-research-pt-03/research.md:L105`). The exact trigger event (MCP lifecycle hook, periodic cron, or user-invoked `/memory:manage`) is not specified. This needs a concrete wiring decision before `005-learning-feedback-reducers` phase ships.

**IOQ-2: `memory_trigger_embeddings` backfill strategy for large indexes**
The derived table requires embedding all existing trigger phrases. Large indexes (>1000 entries) may require a batched backfill with progress tracking and resume capability. The spec for phase 007 does not yet address the migration plan for existing trigger phrases.

**IOQ-3: Context curator budget parameters (`retrievalCandidateLimit`, `presentationLimit`, `curationTokenBudget`)**
The RQ-B2 ADAPT design requires splitting `memory_search`'s single `limit` parameter into three (`research/027-xce-research-pt-03/research.md:L88-L89`). The exact defaults (100–300 for candidate limit, values for presentation and token budget) need calibration against real retrieval distributions before the flag family can be set.

**IOQ-4: Where does the shared `RerankClient` live if 028's coco-index phases consume it?**
If both 027 (memory) and 028 (coco-index) will import `RerankClient`, it needs a shared home. Options: (a) live in `system-spec-kit/mcp_server/lib/shared/`; (b) duplicate with a generated schema contract; (c) HTTP/CLI bridge for cross-language Python use. No decision recorded yet (`research/027-xce-research-pt-03/research.md:L137-L140`).

**IOQ-5: Shadow-mode promotion gate for semantic triggers**
Phase 007 shadow mode collects telemetry before live-mode activation. The specific threshold for promotion (precision/recall ratio, false-trigger rate, session count) is not defined. This requires a concrete gate definition, ideally tied to 028's `004-code-graph-adoption-eval` output.

---

## 7. Synthesis Verdict

**Overall: ADAPT across all active 027 memory phases.**

No phase has been SKIP'd. No phase is ADOPT (implement exactly as XCE does) — the XCE patterns that fed this research are all adapted to the local-first, feature-flagged, shadow-first architecture. The five phases with implementation-ready scope (002, 003, 004, 005, 006) can proceed immediately. The two phases with revised scope (007, 008) require the path repairs and correctness fixes documented above before implementation begins. Phase 001 (coco-index fork) unblocks downstream 028 phases and should proceed as the narrowed diff+decision scope.

The research corpus is complete. This iteration closes the 40-iteration research arc.
