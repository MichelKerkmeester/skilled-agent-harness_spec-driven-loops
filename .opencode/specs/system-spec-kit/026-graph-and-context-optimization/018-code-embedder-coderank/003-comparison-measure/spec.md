---
title: "Spec: 018/003 Comparison + ADR-001 ratification"
description: "Run gemma vs CodeRankEmbed (and optional jina-code, bge-code) on 018/002 fixture + author ADR-001 ratifying CocoIndex production embedder"
trigger_phrases:
  - "018/003 comparison measure"
  - "ADR-001 cocoindex embedder choice"
  - "code embedder benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-code-embedder-coderank/003-comparison-measure"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded comparison + ADR packet"
    next_safe_action: "Wait for 018/001 + 018/002; then execute"
    blockers:
      - "depends on 018/001 swap mechanism"
      - "depends on 018/002 fixture"
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018003"
      session_id: "018-003-comparison-measure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 018/003 Comparison + ADR-001 ratification

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (blocked on 018/001 + 018/002) |
| Level | 1 |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After 018/001 (swap mechanism) and 018/002 (fixture), we still don't know which embedder actually wins for OUR repo. Without measurement, the swap is a leap of faith.

Purpose: empirically benchmark candidates against the 018/002 fixture and ratify a production choice in ADR-001.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Run gemma (baseline), CodeRankEmbed, and optionally jina-code + bge-code against 018/002 fixture
- Capture per-pair top-3 hits + latency
- Aggregate per-difficulty + overall scores
- Write `evidence/cocoindex-embedder-comparison.{jsonl,csv}`
- Author ADR-001 ratifying the production choice

Out of scope:
- API-backed embedders (Voyage, OpenAI) — local-only by policy
- Cross-encoder reranker for CocoIndex (separate concern)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Each candidate is benchmarked against the full 018/002 fixture |
| R2 | Per-pair: top-3 IDs + latency captured |
| R3 | Aggregate: top-3 hit count + per-difficulty breakdown + median + p95 latency per embedder |
| R4 | ADR-001 cites specific numbers (no hand-waving) |
| R5 | If winner ≠ `_DEFAULT_MODEL` from 018/001, a one-line config update commit ships |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 5 requirements met
- ADR-001 verdict is one of: KEEP-CODERANK / KEEP-GEMMA / ADOPT-OTHER
- Strict-validate PASSED
- A memory note ratifies the choice for future-session pickup
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Reindex cost**: 3-4 candidates × few minutes each = 30-60 min total
- **Disk usage**: ~1GB total for 4 embedder caches (acceptable)
- **MPS instability under load**: fall back to CPU per candidate if MPS crashes
- **Inconclusive verdict**: if all candidates score similarly, defer choice; document

Dependencies:
- 018/001 swap mechanism (BLOCKING)
- 018/002 fixture (BLOCKING)
- Candidate embedder model downloads (first-run, automatic)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to include jina-code + bge-code in the first sweep, or defer to a second round if CodeRankEmbed shows clear win/loss vs gemma. Decide at measurement time.
<!-- /ANCHOR:questions -->
