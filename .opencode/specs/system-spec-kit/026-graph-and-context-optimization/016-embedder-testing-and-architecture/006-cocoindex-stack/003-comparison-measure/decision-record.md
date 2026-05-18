---
title: "Decision Record: 018/003 CocoIndex embedder comparison"
description: "ADR-001 ratifies the CocoIndex production embedder after fixture benchmark"
trigger_phrases:
  - "ADR-001 cocoindex embedder choice"
  - "code embedder benchmark verdict"
  - "KEEP-JINA-CODE"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-code-embedder-coderank/003-comparison-measure"
    last_updated_at: "2026-05-17T21:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Ratified CocoIndex production embedder as jina-code after primary fixture benchmark"
    next_safe_action: "Keep CocoIndex default on sbert/jinaai/jina-embeddings-v2-base-code"
    blockers: []
    key_files:
      - "evidence/cocoindex-embedder-comparison.jsonl"
      - "evidence/cocoindex-embedder-comparison.csv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018003"
      session_id: "018-003-cocoindex-embedder-adr"
      parent_session_id: "018-003-comparison-measure"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Should CocoIndex keep jina-code or return to gemma?"
        answer: "KEEP-JINA-CODE"
---
# Decision Record: 018/003 CocoIndex embedder comparison

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep jina-code as CocoIndex production embedder

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-17 |
| **Deciders** | main agent |
| **Verdict** | KEEP-JINA-CODE |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to compare the current CocoIndex default (`sbert/jinaai/jina-embeddings-v2-base-code`) against the prior baseline (`sbert/google/embeddinggemma-300m`) using the 018/002 code-retrieval fixture. The benchmark used direct `ccc search --limit 5` calls after a full `ccc reset --force && ccc index` per candidate.

The repo has mirrored skill trees under `.opencode`, `.claude`, `.codex`, and `.gemini`. The JSONL keeps the returned top-3 paths as emitted by `ccc`, while `hit` is normalized across equivalent skill-tree mirrors so `.gemini/skills/.../x.ts` counts as the same source identity as `.opencode/skills/.../x.ts`. Raw exact-path hits were too strict for this repo shape.

### Constraints

- MPS had to be active. Verified `_resolve_device(None) == "mps"` and `Config.from_env().device == "mps"`.
- CocoIndex rescue layer had to remain off. Verified no `rescue` / `SPECKIT_RERANK_LAYER` code exists under `cocoindex_code`.
- No mk-spec-memory queries ran during CocoIndex reindex windows.
- Optional candidates were bounded by wall time. Each full primary reindex took about 24-25 minutes.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep `sbert/jinaai/jina-embeddings-v2-base-code` as the CocoIndex production embedder.

**How it works**: No config flip is needed because `_DEFAULT_MODEL` already points at `sbert/jinaai/jina-embeddings-v2-base-code`. The restored production state ends with the daemon on jina-code and a clean full index: 8,427 files, 127,346 chunks, errors 0.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Top-3 hits | Hit rate | Easy | Medium | Hard | Median ms | P95 ms | Result |
|--------|------------|----------|------|--------|------|-----------|--------|--------|
| **jina-code** (`sbert/jinaai/jina-embeddings-v2-base-code`) | 7/18 | 0.389 | 1 | 4 | 2 | 404 | 590 | Chosen |
| gemma baseline (`sbert/google/embeddinggemma-300m`) | 7/18 | 0.389 | 1 | 4 | 2 | 398 | 4011 | Rejected |
| CodeRankEmbed (`sbert/nomic-ai/CodeRankEmbed`) | Deferred | n/a | n/a | n/a | n/a | n/a | n/a | Optional, not needed for primary verdict |
| bge-code (`sbert/BAAI/bge-code-v1`) | Deferred | n/a | n/a | n/a | n/a | n/a | n/a | Optional, not needed for primary verdict |

**Why this one**: jina-code and gemma tied on top-3 recall after mirror normalization, but jina-code had much better p95 search latency in this run and is code-tuned. With no recall win for gemma, changing away from the current production default is not earned.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Production stays on the code-tuned model already ratified in the surrounding embedder work.
- Search latency avoids the gemma cold outlier observed in this run (`4011 ms` p95 vs `590 ms` for jina-code).
- No config update or operator migration is required.

**What it costs**:
- The fixture did not distinguish jina-code from gemma on top-3 recall. Mitigation: keep the JSONL and runlog so future fixture refinements can compare against the same method.
- Optional CodeRankEmbed and bge-code were not measured in this pass. Mitigation: run a second sweep only if future retrieval failures justify the extra 50+ minutes of reindex time.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Canonical docs outrank source for some queries | Medium | Treat this as a fixture/search-surface finding, not an embedder win for gemma |
| Mirror directories distort exact-path scoring | Medium | Normalize equivalent `.opencode` / `.claude` / `.codex` / `.gemini` skill paths in evidence |
| Optional code-tuned models might beat both primary candidates | Low | Deferred because primary comparison did not justify a production change; run later if needed |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | CocoIndex needed a measured production embedder verdict |
| 2 | **Beyond Local Maxima?** | PASS | Compared current default against the prior baseline with a deterministic fixture |
| 3 | **Sufficient?** | PASS | Primary candidates tied on recall; optional sweeps were not required for a no-change verdict |
| 4 | **Fits Goal?** | PASS | Decision directly controls `_DEFAULT_MODEL` and restore state |
| 5 | **Open Horizons?** | PASS | Evidence files preserve per-pair rows for future candidate sweeps |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `evidence/cocoindex-embedder-comparison.jsonl` records 36 per-pair primary-candidate rows.
- `evidence/cocoindex-embedder-comparison.csv` records aggregate hit and latency metrics.
- No `_DEFAULT_MODEL` or README/INSTALL_GUIDE flip is required.

**How to roll back**: no code/config change shipped. If a future sweep selects another embedder, change `_DEFAULT_MODEL` in `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`, update the registry/docs table, then run `ccc reset --force && ccc index`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
