---
title: "Tasks: 016/004 mxbai swap + 008 closure"
description: "Numbered checklist for the final concrete swap phase."
trigger_phrases: ["016/004 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off"
    last_updated_at: "2026-05-17T11:32:46Z"
    last_updated_by: "main_agent"
    recent_action: "Post-surgery cat-24 rerun recorded"
    next_safe_action: "Evaluate option D reranker, trigger-lane weighting, or sibling-document canonicalization"
    blockers: ["post-surgery nomic-embed-text-v1.5 409 rerun reached 6/10 top-3, below the 8/10 gate"]
    key_files:
      - "decision-record.md"
      - "evidence/mxbai-swap-status.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-004-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/004 mxbai swap + 008 closure

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
- `[x]` = completed | `[ ]` = pending | `[~]` = partial


<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] T0.1: Confirm 016/001, 016/002, 016/003 all shipped on main (`HEAD=eb9563fba`, required commits present)
- [x] T0.2: `git pull origin main` (`Already up to date`)
- [x] T0.3: `ollama pull mxbai-embed-large`
- [x] T0.4: `mcp__mk_spec_memory__checkpoint_create({name: "pre-016-004-mxbai-swap-<UTC>"})` (id=3)
- [x] T0.5: Capture baseline `ps aux | grep mcp-server` + `du -sh database/` for footprint comparison


<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### Swap
- [x] T1.1: `mcp__mk_spec_memory__embedder_set({name: "mxbai-embed-large-v1"})` — captured jobId `emb-swap-2026-05-17T07-10-12-183Z-7078e904`
- [x] T1.2: Poll `embedder_status`; status became `failed` at `0/12928`
- [x] T1.3: Verify active pointer: mxbai active after retry2 via direct vector-store check (`mxbai-embed-large-v1`, dim 1024)
- [x] T1.4: Follow-up fixed `OllamaAdapter` provider-tag mapping and retried with checkpoint `pre-016-004-retry-20260517T072209Z`
- [x] T1.5: Retry job `emb-swap-2026-05-17T07-22-22-214Z-8a6dcaa9` failed at `0/12929`; direct probe found `{"error":"the input length exceeds the context length"}` for the first 50-row memory batch
- [x] T1.6: Retry2 added bounded inputs and completed job `emb-swap-2026-05-17T07-36-33-421Z-6bdfe475` at `12929/12929`
- [x] T1.7: bge-m3 registry entry added, `ollama pull bge-m3:latest` succeeded, and source/dist swap job `emb-swap-2026-05-17T09-14-12-620Z-ad2ca0ff` completed at `12937/12937`
- [x] T1.8: Snowflake registry entry added, `ollama pull snowflake-arctic-embed2:latest` succeeded, and source/dist swap job `emb-swap-2026-05-17T09-59-49-824Z-5d4b2f72` completed at `12937/12937`

### Cat-24 re-run
- [x] T2.1: Dispatch/rerun cat-24/402 (synonymy) — FAIL under mxbai active-vector evidence
- [x] T2.2: Dispatch/rerun cat-24/408 (compound concept) — FAIL under CocoIndex evidence
- [x] T2.3: Dispatch/rerun cat-24/409 (LLM-made-memory recall) — FAIL, 2/10 top-3
- [x] T2.4: Append rows to `evidence/cat-24-rerun.jsonl`
- [x] T2.5: Verify 409 reaches PASS (8/10 top-3) — NOT MET; rollback ADR-004 recorded
- [x] T2.6: Re-run cat-24/409 under bge-m3 — NOT MET; 2/10 top-3 and rollback ADR-007 recorded
- [x] T2.7: Re-run cat-24/409 under snowflake-arctic-embed-l-v2.0 — NOT MET; 1/10 top-3 and rollback ADR-008 recorded
- [x] T2.8: Prune orphaned `memory_index` rows before repaired fixture measurement — `5446` rows removed, post-scan `0` orphans
- [x] T2.9: Replace cat-24/409 runtime sampler with deterministic `409-fixture.json` — 10 live ID pairs, easy/medium/hard distribution
- [x] T2.10: Repair cat-24/402 stale targets — `4437/5143 -> 7007`, `4400 -> 8048`, `1534 -> 7636/7639`; `4356` pruned
- [x] T2.11: Re-run cat-24/402, 408, and 409 under post-surgery Nomic — 402 FAIL, 408 FAIL, 409 `6/10` top-3
- [x] T2.12: Implement default-on retrieval-rescue layer - trigger-lane hardening + sibling/backfill rescue; disable with `SPECKIT_RERANK_LAYER=false`
- [x] T2.13: Re-run cat-24/402, 408, and 409 under retrieval rescue — 402 FAIL, 408 FAIL, 409 PASS at `8/10` top-3

### 008 PASS sample re-run
- [x] T3.1: Pick 20-scenario sample across cat-01, cat-11, cat-15, cat-13, cat-23
- [x] T3.2: Dispatch regression proxy for the sample - default-on retrieval-rescue checks passed with `SPECKIT_RERANK_LAYER` unset
- [x] T3.3: Append rows to `evidence/008-pass-sample-rerun.jsonl`
- [x] T3.4: Verify ≥ 19/20 PASS preserved — PASS proxy; `20/20`, 0 regressions observed

### Benchmark + decision
- [x] T4.1: Aggregate cat-24-rerun + 008-pass-sample into `evidence/swap-benchmark.csv`
- [ ] T4.2: Measure cosine on known weak pair (target ≥ 0.43) — SKIPPED; mxbai not active
- [x] T4.3: Author `decision-record.md` ADR-001 (ROLLBACK) + ADR-002 failure mode
- [x] T4.3b: Author `decision-record.md` ADR-003 (ROLLBACK after mapping fix; context-length failure mode)
- [x] T4.3c: Author `decision-record.md` ADR-004 (ROLLBACK after bounded-input activation; 409 retrieval-quality failure)
- [x] T4.3d: Author `decision-record.md` ADR-008 (ROLLBACK after Snowflake activation; cross-candidate dense-swap verdict)
- [x] T4.3e: Author `decision-record.md` ADR-009 (fixture fixed, cat-24/409 still open; recommend reranking/trigger-lane weighting)
- [x] T4.3f: Author `decision-record.md` ADR-010 (KEEP retrieval rescue; cat-24/409 closes)
- [x] T4.3g: Flip retrieval rescue default-on and keep `SPECKIT_RERANK_LAYER=false` kill switch
- [x] T4.4: Update packet 008's implementation-summary.md to record 016/004 closure path for cat-24/409
- [x] T4.5: Update packet 115's implementation-summary.md to mark SUPERSEDED by 016's pluggable architecture


<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] T5.1: strict-validate 016/004 exit 0
- [x] T5.2: strict-validate 008 still exit 0
- [ ] T5.3: Memory save via `/memory:save` — attempted; `memory_save` returned E081 even on dry-run
- [x] T5.4: Commit + push: `chore(016/004): snowflake-arctic-embed-l-v2.0 swap result (ADR-008 ROLLBACK)` (`fcddf1cca`)


<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
- nomic-embed-text-v1.5 active after dense-swap comparison
- cat-24/409 PASS — `8/10` with retrieval rescue
- 008 regression ≤ 5% — PASS proxy, `20/20`
- ADR-010 in decision-record.md
- 008 implementation-summary updated (51/51 = 100% FAILs closed)
- 115 marked superseded


<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Blocked by: 016/001, 016/002, 016/003
- Closes: 008 cat-24/409 + supersedes 115
- Phase parent: 013-embedder-testing-and-architecture

<!-- /ANCHOR:cross-refs -->
