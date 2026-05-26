---
title: "Spec: retrieval + fixture audit (decision gate before Phase 3) [template:level_1/spec.md]"
description: "Diagnostic gate inserted between Phase 2 HOLD and Phase 3 fine-tune. Phase 1 (OFF) and Phase 2 (bge-v2-m3) produced literally identical retrieval metrics (hit-rate@5 0.12, NDCG@10 0.11, recall@5 0.12) on the 50-probe fixture, with 16/50 probes having stale gold_memory_ids. The AI Council (gpt-5.5 xhigh, 3-1 vote) ruled Phase 3 fine-tune cannot succeed without first proving (a) which gold IDs are still valid, (b) whether gold docs even enter the pre-rerank candidate pool, (c) whether direct-handler-replay matches canonical daemon IPC, and (d) whether rerank scores actually change final order. This audit produces a mechanical branch: retrieval work / scoring-integration work / Phase 3 justified."
trigger_phrases:
  - "011/004 retrieval audit"
  - "fixture freshness audit spec-memory"
  - "rerank decision gate"
  - "candidate coverage audit"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit"
    last_updated_at: "2026-05-21T15:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Superseded by 011/005 opt-in closure"
    next_safe_action: "Use 011/005 instead"
    blockers:
      - "Superseded — do not execute"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: retrieval + fixture audit (decision gate before Phase 3)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned (ready to execute) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 0 (decision gate; numeric slot 004) — blocks Phase 3 |
| **Executor** | cli-codex gpt-5.5 high fast |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 1 (OFF baseline) and Phase 2 (bge-reranker-v2-m3) produced **identical retrieval metrics to three sig figs**:

| Metric | Phase 1 (OFF) | Phase 2 (bge-v2-m3) | Delta |
|---|---|---|---|
| hit-rate@5 | 0.12 | 0.12 | 0 |
| NDCG@10 | 0.11 | 0.11 | 0 |
| recall@5 | 0.12 | 0.12 | 0 |
| p95 latency | 557ms | 10591ms | +19× |

A reranker can only reorder candidates it receives. Identical metrics across two completely different rerankers (one is positional fallback; one is a 568M XLM-RoBERTa-large cross-encoder) means **the reranker is not the binding constraint**. The bottleneck is upstream or in the score integration.

Compounding the measurement problem:
- **16 of 50 probes have stale `gold_memory_ids`** in the current `memory_index` (corpus churn since the fixture was frozen on 2026-05-20: embedder migration to nomic-CodeRankEmbed on 2026-05-19, multiple deep-research saves, package count ~1240 vs whatever it was at freeze time).
- **Bench used direct-handler-replay** (`import dist/handlers/memory-search.js`) instead of the canonical daemon IPC socket because the codex sandbox blocked the IPC bind. Parity between the two paths is asserted but not proven.
- **`WEIGHT_RERANKER=0.20` boolean penalty** in `confidence-scoring.ts:38/250/258` is documented but its actual effect on top-N ordering is not measured.

Without resolving these, Phase 3 (3-5 day fine-tune) cannot land. A domain-tuned cross-encoder cannot rescue a gold document that never enters the candidate pool, and it cannot beat OFF if its scores are not affecting final order.

### Purpose

Produce a **mechanical branch decision** for the rerank arc:

| Audit finding | Next arc/phase |
|---|---|
| Gold docs absent from pre-rerank candidates | New retrieval arc (FTS5 / vector / chunking / RRF weights). Phase 3 cancelled or deprioritized. |
| Gold docs present but rerank scores don't change final order | Scoring/integration work (the WEIGHT_RERANKER boolean penalty + score-mixing math in confidence-scoring.ts). Phase 3 deprioritized. |
| Gold docs present, rerank scores work, but rankings are wrong | **Phase 3 fine-tune justified** with a sharp training target ("the model under-ranks doc X for query Y when retrieval surfaces it at position N"). |

### Why this is a hard gate

The AI Council convened 2026-05-21 (gpt-5.5 xhigh fast, 4 seats: Retrieval Architect, Eval Methodologist, ML Pragmatist, Devil's Advocate) voted 3-1 to insert this gate. The dissenting Devil's Advocate argued that the original arc gate (two HOLDs → Phase 3) fired correctly and that audit risks methodology theater. The majority countered that identical OFF-vs-bge numbers are decision-invalidating evidence: the original gate's premise (rerankers compete on quality) doesn't apply when no reranker has leverage over OFF.

Cost: 1-2 hours wall clock vs Phase 3's 3-5 days. Expected value of running the audit even if it just confirms Phase 3 is justified: ~30 minutes of negative information value. Expected value if it invalidates Phase 3: 3-5 days of avoided waste plus a sharper target for the real bottleneck.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

For each of 50 probes in `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json`:

1. **Gold ID resolution**: query the current `memory_index` for each `gold_memory_id`. Classify the probe as:
   - `valid` — gold_memory_id resolves to an active memory row
   - `stale` — gold_memory_id is missing; no replacement found
   - `replaced` — original gold_memory_id is gone but the content at the original `gold_doc_id` resolves to a different `memory_id`
   - `unusable` — both gold_memory_id and gold_doc_id are stale

2. **Pre-rerank candidate coverage**: for each `valid` probe, instrument the search pipeline to log the candidate set at:
   - FTS5 lane top-N (N=20, 50, 100)
   - Vector lane top-N (N=20, 50, 100)
   - Fused/RRF top-N (N=20, 50, 100)
   - Final candidate pool entering Stage 3 rerank

3. **Handler-path parity check**: pick 5 probes spanning the 3 category buckets (arc-context, paraphrase, terminology). Run each through (a) the direct-handler-replay path used by Phase 1+2 and (b) the canonical daemon IPC socket path. Diff the top-20 results. Report parity gaps verbatim.

4. **Rerank score effect**: for each `valid` probe, log:
   - Raw rerank scores per candidate (sigmoid-normalized [0,1])
   - Final blended score (after `WEIGHT_RERANKER` mixing)
   - Position change vs pre-rerank order

5. **Recompute headline metrics on the valid-only subset**: hit-rate@5, NDCG@10, recall@5 using only probes classified `valid` or `replaced`.

6. **Mechanical branch decision**: the implementation-summary's final paragraph names one of the three branches above as the next arc/phase recommendation, with supporting numbers.

### Out of Scope

- **No production patches.** This is a read-only audit + temporary instrumentation. The instrumentation must be removable cleanly (no `lib/search/*` source changes that persist).
- **No fixture rebuild.** If the audit shows the fixture is broken, the rebuild is a separate packet (sibling 011/005 or similar).
- **No model retraining.** Phase 3 is downstream of this audit.
- **No retrieval-pipeline patches.** If retrieval is the bottleneck, the fix is a new arc, not this packet.
- **No cocoindex investigation.** Spec-memory only.

### Files likely to be created (instrumentation, removable)

- `004-retrieval-and-fixture-audit/evidence/probe-classification-2026-05-21.json` — per-probe valid/stale/replaced/unusable
- `004-retrieval-and-fixture-audit/evidence/candidate-coverage-2026-05-21.json` — top-N coverage per lane per probe
- `004-retrieval-and-fixture-audit/evidence/handler-parity-2026-05-21.md` — parity diff narrative
- `004-retrieval-and-fixture-audit/evidence/rerank-effect-2026-05-21.json` — raw + blended scores + position deltas
- `004-retrieval-and-fixture-audit/evidence/valid-subset-metrics-2026-05-21.json` — recomputed headline metrics
- `004-retrieval-and-fixture-audit/scripts/audit_*.{py,ts,mjs}` — temporary audit scripts; either deleted in cleanup OR moved into a tracked benchmarks/ subdir if the operator wants them retained

### Files NOT touched

- `lib/search/cross-encoder.ts`, `lib/search/pipeline/stage3-rerank.ts`, `lib/search/scoring/confidence-scoring.ts` — production source remains unmodified during the audit. If instrumentation requires logging hooks, they go in wrapper code under the audit packet's `scripts/`, not in production files.
- The sidecar — already in a known-good single-model + CPU + fp16 state from the Phase 2 bench attempt; restored to canonical multi-model after.
- The fixture — read-only.
- The memory_index DB — read-only.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 50 probes classified | evidence/probe-classification-*.json has 50 rows; each row has class ∈ {valid, stale, replaced, unusable} |
| REQ-002 | Candidate coverage measured for FTS5 / vector / fused / final | evidence/candidate-coverage-*.json has top-20/50/100 counts per lane per probe (valid + replaced subset) |
| REQ-003 | Handler-path parity established or gap quantified | evidence/handler-parity-*.md states either "identical top-20 across 5/5 probes" OR documents the specific divergences with reqId-level detail |
| REQ-004 | Rerank score effect logged | evidence/rerank-effect-*.json shows raw scores + blended scores + position deltas for at least 30 probes |
| REQ-005 | Recomputed headline metrics on valid-only subset | evidence/valid-subset-metrics-*.json with hit-rate@5 / NDCG@10 / recall@5 on the cleaned probe set |
| REQ-006 | Mechanical branch decision recorded | implementation-summary.md §Branch Decision names one of: RETRIEVAL_WORK, SCORING_INTEGRATION_WORK, PHASE_3_JUSTIFIED — with the supporting numbers cited |
| REQ-007 | Strict-validate exit 0 | both packet and arc parent |
| REQ-008 | No production source modified | git diff after audit shows zero changes under lib/search/ |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Audit scripts either deleted or moved to a non-production location | If retained, paths captured in §Commit Handoff |
| REQ-010 | Arc parent + Phase 3 spec updated to reflect branch decision | 011 spec.md phase-map updated; if RETRIEVAL_WORK or SCORING_INTEGRATION_WORK, 003 spec marked superseded/deprioritized |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: §Branch Decision is supported by the data, not by intuition. Each claim cites an evidence file.
- **SC-002**: Five evidence files exist + are parseable JSON or readable markdown.
- **SC-003**: Zero production source files (`lib/search/**`, `cross-encoder.ts`, `stage3-rerank.ts`, `confidence-scoring.ts`, etc.) modified.
- **SC-004**: Strict-validate exit 0 on packet + arc parent.
- **SC-005**: Phase 3 either justified with sharp target OR explicitly deprioritized with a new arc named.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Daemon IPC socket bind still blocked in codex sandbox | Medium | Handler-parity REQ-003 fails | Dispatch with `network_access=true` + writable IPC dir; if still blocked, fall back to documenting the parity check as "deferred to a non-sandboxed run" and tag REQ-003 as P1 instead of P0 |
| Audit instrumentation requires hooks into production search code | Medium | Scope creep risk; could violate REQ-008 | Build a wrapper script that imports the dist handler + intercepts at the response level. No source edits. If intercept impossible, document the gap. |
| Valid-only subset is too small for statistical power | Medium | Branch decision rests on <20 probes | Recompute power explicitly; if N<20, recommend Phase 0.1 fixture rebuild as a follow-on packet rather than forcing a branch decision |
| Memory blow-up from running canonical daemon + sidecar + audit scripts together | Low (memory guard) | Bench-style mem spike | Same watchdog pattern as Phase 2 bench retry-3 (sidecar RSS < 6GB, codex < 4GB); abort if breached |

Dependencies:

- Phase 1 evidence (`001/evidence/off-baseline-2026-05-21.json`) — read-only, for cross-reference
- Phase 2 evidence (`002/evidence/bge-v2-m3-bench-2026-05-21.json`) — read-only, for cross-reference
- Fixture (`mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json`) — read-only
- Current `memory_index` SQLite DB at `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` — read-only
- The sidecar (running canonical multi-model is fine; bench will request bge-v2-m3 by name when comparing rerank effect)
- The daemon IPC socket (if the sandbox permits — see Risks)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: If the handler-parity check fails (direct-replay diverges from daemon IPC), are Phase 1 + Phase 2 verdicts invalidated? Tentative: yes for ABSOLUTE numbers, but the OFF↔bge-v2-m3 delta of zero is preserved under any shared handler path. Council Seat 2 + 4 already debated this.
- **Q2**: If gold docs are absent from pre-rerank candidates AT ALL Ns (20/50/100), is it the chunking that's wrong, the embedder, or the FTS5 tokenizer? The audit doesn't have to diagnose root cause — just identify which lane(s) miss. A follow-on retrieval packet does root-cause.
- **Q3**: How small can the valid subset be before the branch decision is unreliable? Recommend a hard floor: N >= 20 for a confident branch; N=10-19 for a probabilistic recommendation that still names the most-likely branch; N<10 → recommend fixture rebuild as a hard blocker on any downstream phase.
<!-- /ANCHOR:questions -->
