---
title: "Research Report: External Memory Systems — Search-Intelligence Mining (028 child 007)"
description: "4-model mining of Mem0, Graphiti/Zep, Letta/MemGPT, Cognee for novelty-diffed Memory MCP (+ Advisor, Deep-Loop) improvements. PARTIAL — first wave banked (3-4 systems), remaining iterations handed off."
trigger_phrases:
  - "028 memory systems research report"
  - "mem0 graphiti letta cognee findings"
  - "agent memory search intelligence mining"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-memory-systems"
    last_updated_at: "2026-06-17T10:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Banked first-wave iters 1-3 (Mem0/Cognee/Graphiti, 19 candidates); Letta via DeepSeek pending"
    next_safe_action: "Resume per the CONTINUATION RECIPE below; debug Kimi or reassign its lineage"
    blockers: []
    key_files:
      - "research/research.md"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-028-007-memory-systems"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

# Research Report: External Memory Systems — Search-Intelligence Mining

> **Status: PARTIAL (first wave banked).** 4-model sweep (DeepSeek v4 Pro · MiMo v2.5 Pro · Kimi K2.7 · Opus 4.8) mining Mem0, Graphiti/Zep, Letta/MemGPT, Cognee for Memory MCP (+ Advisor fusion, Deep-Loop continuity). Every candidate is novelty-tagged vs already-mined work (aionforge + galadriel [028]; OpenLTM + memclaw [027]). Research-only.

## Progress (banked)
| Iter | Model | System | Candidates | Status |
|---|---|---|---|---|
| 1 | DeepSeek v4 Pro | Mem0 | 5 | ✅ banked |
| 2 | Opus 4.8 (claude2) | Cognee | 8 (+novelty-diff) | ✅ banked |
| 3 | MiMo v2.5 Pro | Graphiti/Zep | 6 | ✅ banked |
| 4 | DeepSeek (Kimi reassigned — timed out 2×) | Letta/MemGPT | 5 | ✅ banked |

**24 candidates banked across all 4 systems.** Per-iteration detail: `iterations/iteration-00{1..4}.md` + `deltas/iter-00{1..4}.jsonl`.

## Top picks so far (by leverage × effort)
- **CG-uuid5-entity-merge** (Cognee, NET-NEW, **H/S**) — deterministic `uuid5(normalized-name)` entity identity → same name auto-merges at write, zero LLM. → causal-graph entity creation.
- **CG-composite-edge-dedup** (Cognee, NET-NEW, **H/S**) — edges dedup on `src+rel+tgt` key → idempotent relationship writes. → `causal-edges.ts`.
- **GR-llm-fact-invalidation** (Graphiti, EXTENDS C3-A/B, **H/M**) — LLM-discovered contradictions close old edges with event-time `invalid_at = new.valid_at` (vs internal rule-based `invalid_at = now()`).
- **M0-entity-store-boost** (Mem0, NET-NEW, H/M) — separate entity vector index boosting linked memories at search.
- **GR-fact-embedding-on-edge** (Graphiti, NET-NEW, M/M) — semantic embedding on edges → semantic edge dedup + similarity edge retrieval.
- **CG-iterative-context-extension** (Cognee, NET-NEW, H/M) — answer-as-next-query graph retrieval with convergence stop.

## Per-system findings
- **Mem0** (iter 1): entity-store boost, adaptive channel-gated additive fusion (alt to RRF), query-length-adaptive BM25 sigmoid (EXTENDS aionforge), entity cardinality penalty, LLM memory-linking at extraction (EXTENDS memclaw).
- **Cognee** (iter 2): uuid5 entity-merge, composite-edge dedup, incremental edge merge, ontology canonicalization, iterative context-extension retrieval, neighborhood rescore ranking (EXTENDS Mem0), cascade extraction (EXTENDS Mem0), schema-driven edges. Supersedes Mem0's dedup half (zero-LLM).
- **Graphiti** (iter 3): 5-timestamp edge (EXTENDS C3-B), LLM fact-invalidation (EXTENDS C3-A/B), episode provenance, fact-embedding-on-edge, episode-window context; **NO-TRANSFER** on 3-channel RRF (ours is a superset).
- **Letta** (iter 4, DeepSeek — Kimi reassigned): self-edit char-limit blocks (EXTENDS C7-A, H/M — model-aware eviction vs blind cap), compaction fallback ladder (NET-NEW), sliding-window %-keep (EXTENDS C7-A), external-memory-size-injected-into-prompt, approx token counter (bytes/4×1.3).

## Honest status / open issues
- **Kimi K2.7 timeout — DIAGNOSED (not broken).** `kimi-for-coding/k2p7 --variant high` timed out 2× at 600s with **zero stdout**, but its 65 KB **stderr shows it was working productively the whole time** — it read `external/letta/` by explicit path (`rg --no-ignore` + explicit `Read`s; the gitignore-fix worked) and simply **over-explored past the 600s budget** (many file reads across agent_manager/block_manager/orm/context-window/passage/archive) before reaching the final-output stage. opencode writes only the *final* assistant message to stdout, so a mid-stream `gtimeout` kill = 0 bytes. Root cause: **under-budgeted + over-scoped at high reasoning on a 1185-file repo** (DeepSeek finished the same task because it's more decisive). **Fix for the Kimi lineage:** (a) timeout **1200s+**, (b) hard per-seat scope + read-cap in the prompt ("read ≤N files then emit, do not keep browsing"), optionally (c) drop `--variant high`. A confirming tight+1200s relaunch was dispatched.
- **Proven contracts:** `deepseek/deepseek-v4-pro --variant high`, `xiaomi/mimo-v2.5-pro --variant high` (both via `opencode run`), and Opus via claude2 (`-p --model opus --permission-mode bypassPermissions` + read-only prompt — NOT plan mode, which truncates stdout).
- **gitignore gotcha:** `external/` is gitignored, so opencode Glob/grep cannot discover the cloned repos. Seats MUST `ls` + Read/`cat` explicit paths. (MiMo fell back to fetching Graphiti from GitHub — valid, but line numbers are approximate.)
- No benefit numbers measured; all leverage/effort are structural inference.

## CONTINUATION RECIPE (turnkey — for the next session)

**State:** iters 1-3 banked (Mem0/Cognee/Graphiti); iter 4 (Letta) via DeepSeek may be banked by the time you resume (check `iterations/` + `deltas/` + `deep-research-state.jsonl`). ~36 of 40 iterations remain.

**Per-lineage plan (10 iters each):** DeepSeek = deep-extract algorithmic cores; MiMo = broad cross-system sweep (1M ctx); Kimi = seam-map to our TS internals (BLOCKED — see above); Opus = adversarial-verify + novelty-diff + synthesis.

**Dispatch (verify slugs live with `opencode providers list` / `opencode models <provider>`):**
```
opencode run --model deepseek/deepseek-v4-pro --variant high --dir <ROOT> "<prompt>" </dev/null
opencode run --model xiaomi/mimo-v2.5-pro --variant high --dir <ROOT> "<prompt>" </dev/null
USER=$USER LOGNAME=$LOGNAME CLAUDE_CONFIG_DIR=$HOME/.claude-account2 CLAUDE_CODE_OAUTH_TOKEN=$(<~/.claude-account2/.oauth-token) gtimeout -k 30s 600s /Users/michelkerkmeester/.superset/bin/claude -p --model opus --permission-mode bypassPermissions "<prompt>" </dev/null
```
Concurrency: ≤2 `opencode run` at once (launch-race). claude2 runs in parallel. Each seat READ-ONLY; prompt every external-repo seat with the gitignore-access note (ls + explicit Read, not Glob).

**Orchestrator-writes per iteration:** append a `{"type":"iteration","iteration":N,...,"model":...,"graphEvents":[...]}` row to `deep-research-state.jsonl`, write `iterations/iteration-NNN.md`, write `deltas/iter-NNN.jsonl` (iteration row + finding/candidate rows). Prompt files live in `/tmp/028-007/`.

**Angles still to mine:** deeper Mem0 ADD/UPDATE/DELETE/NOOP merge logic + relevance scoring; Graphiti `resolve_extracted_edge` dedup + community detection; Cognee retrievers (graph_completion, summaries) + DLT pipeline; Letta block-eviction + sleep-time compute + archival rerank; cross-cutting determinism/idempotency; Advisor-fusion + Deep-Loop-continuity transfers; then Opus adversarial-verify + the GO/no-go novelty-diff synthesis.

**Finish:** run `reduce-state.cjs <child>`; write `synthesis/06-memory-systems-findings.md` (before→after, matching `05`) + roadmap addendum + `00-index` update; `validate.sh --strict` (parent 0/0); commit scoped + push.
