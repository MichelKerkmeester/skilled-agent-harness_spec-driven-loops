---
title: "016/004: mxbai-embed-large swap + close 008 cat-24/409"
description: "Phase 4 of 016 (final). First concrete swap via the new pluggable mechanism. Swap to mxbai-embed-large-v1, re-run cat-24 scenarios, verify no regression on 008's 56 PASS scenarios, close cat-24/409 to PASS."
trigger_phrases:
  - "016/004 mxbai swap"
  - "close 008 cat-24/409"
  - "first concrete embedder swap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure"
    last_updated_at: "2026-05-17T07:24:00Z"
    last_updated_by: "main_agent"
    recent_action: "Retried mxbai swap; context-length failure"
    next_safe_action: "Fix bounded-context re-index input sizing, then retry mxbai activation"
    blockers: ["mxbai-embed-large-v1 activation failed because full memory input exceeded Ollama context length"]
    key_files:
      - "decision-record.md"
      - "evidence/mxbai-swap-status.json"
      - "evidence/swap-benchmark.csv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-004-scaffold"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# 016/004: mxbai-embed-large swap + close 008 cat-24/409

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Level | 1 |
| Priority | P1 |
| Status | ROLLBACK — adapter mapping fixed; mxbai activation still failed before validation on context-length limits |
| Branch | main |
| Runtime | **cli-opencode** (`--model deepseek/deepseek-v4-pro --pure --format json`) |
| Blocked by | 016/001 + 016/002 + 016/003 |
| Closes | packet 008 cat-24/409 PARTIAL (the remaining 1 of 51 session FAILs) |
| Supersedes | packet 115 (embedding-model eval scaffold — folded into 016's pluggable approach) |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
Use the pluggable mechanism (built in 001/002/003) to perform the first real swap. Target: **mxbai-embed-large-v1** — chosen for cosine-optimized AnglE-loss training that directly addresses the paraphrase weakness behind cat-24/409.

Verify:
1. The end-to-end swap mechanism works on a live corpus
2. cat-24/409 (LLM-made-memory recall) reaches PASS (8/10 top-3)
3. No regression on the 56 PASS scenarios from packet 008
4. Codex K commit `8ec4f1491` SQL+trigger+rerank fixes still effective


<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `ollama pull mxbai-embed-large` (one-time download, ~670 MB)
- `mcp__mk_spec_memory__embedder_set({ name: "mxbai-embed-large-v1" })` — the actual swap
- Re-index 11,434 memories from vec_768 → vec_1024 (~15-25 min wall on M-series Metal)
- Re-run cat-24 scenarios 402, 408, 409 against new model
- Re-run packet 008 PASS sample (cat-01, cat-11, cat-15 selection) for regression check
- Document benchmark results in `evidence/swap-benchmark.csv`
- Author ADR-001 in `decision-record.md` (decision to keep mxbai-embed or roll back)
- Update packet 008's `implementation-summary.md` to mark cat-24/409 closure path
- Update packet 115's `implementation-summary.md` to mark superseded by 016

### Out of Scope
- Evaluating other candidate models (mxbai is THE pick; if it fails, follow-on packet evaluates alternatives)
- Building new MCP tools or adapters (016/003 covered surface; 016/002 covered ollama)
- Code-graph embedder swap (separate concern; this packet only swaps mk-spec-memory)


<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | mxbai-embed-large successfully `ollama pull`-able on dev machine | shell exit 0 |
| REQ-002 | `embedder_set({name: "mxbai-embed-large-v1"})` returns jobId + ETA | MCP call returns 200 |
| REQ-003 | Re-index orchestrator completes 11,434 memories → vec_1024 | `embedder_status` shows `completed` |
| REQ-004 | Active pointer flipped to mxbai-embed-large + vec_1024 | settings read confirms |
| REQ-005 | cat-24/409 re-run reaches PASS (8/10 top-3) | playbook-results.jsonl row updated |
| REQ-006 | Packet 008 PASS sample re-run preserves ≥ 95% PASS rate | rollup CSV |

### P1
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-007 | ADR-001 in `decision-record.md` records keep-or-rollback decision | file exists |
| REQ-008 | Cosine on known weak pair improves ≥ +0.15 over baseline 0.2829 | benchmark CSV row |
| REQ-009 | Memory + CPU footprint within budget (~670 MB idle, ~30-50 ms per embed Metal) | benchmark CSV row |
| REQ-010 | strict-validate 016/004 packet | exit 0 |


<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- SC-001: cat-24/409 PASS — closes the LAST of 51 session FAILs
- SC-002: Zero regression on 008's 56 PASS scenarios (or one minor regression accepted with rationale)
- SC-003: Future swap to a different embedder is one MCP call (the mechanism PROVEN by this swap)


<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Risk: mxbai-embed regresses on existing 008 PASS scenarios → mitigate via 016/003's two-phase commit (active pointer doesn't flip if regression detected in smoke set) + rollback ADR-002 if needed
- Risk: ollama download fails on dev machine → fall back to llama.cpp adapter (future work)
- Risk: 1024-dim vec store ~25% larger → measure actual disk impact, document in ADR
- Dep: 016/001 + 016/002 + 016/003 all shipped on main

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Defer to phase parent (`016-pluggable-embedder-architecture/spec.md`) for orchestration-level open questions.
<!-- /ANCHOR:questions -->
