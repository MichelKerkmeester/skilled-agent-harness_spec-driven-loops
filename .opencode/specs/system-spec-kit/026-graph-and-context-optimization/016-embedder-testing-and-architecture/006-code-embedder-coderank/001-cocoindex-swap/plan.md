---
title: "Plan: 018/001 CocoIndex swap"
description: "Implementation phases for the config default flip + MPS auto-detect + reindex"
trigger_phrases: ["018/001 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-code-embedder-coderank/001-cocoindex-swap"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored implementation phases"
    next_safe_action: "Execute Phase 1: config edits"
    blockers: []
    key_files:
      - "config.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018001"
      session_id: "018-001-cocoindex-swap-plan"
      parent_session_id: "018-001-cocoindex-swap"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 018/001 CocoIndex swap

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three edits to `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`:
1. Flip `_DEFAULT_MODEL` to `sbert/jinaai/jina-embeddings-v2-base-code`
2. Add MPS branch to device resolution
3. Vitest covering the new MPS branch

Then a full CocoIndex reindex + smoke tests.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Code | `_DEFAULT_MODEL` updated, MPS branch added |
| Test | Vitest assertion for MPS branch passes |
| Runtime | Reindex completes without errors |
| Smoke | 3-5 CocoIndex queries return non-empty + Code Graph bridge query returns |
| Strict-validate | Returns PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
config.py:
  _DEFAULT_MODEL  ──▶ used when COCOINDEX_CODE_EMBEDDING_MODEL is unset
  _resolve_device ──▶ chain: env override → CUDA → MPS → CPU
                          new MPS branch                  ↑
```

Code Graph reaches CocoIndex via `system-code-graph/mcp_server/lib/` bridge — transparent to embedder choice as long as CocoIndex response shape is preserved.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Config edits (~10 LOC)
- Edit `_DEFAULT_MODEL`
- Add MPS branch with `torch.backends.mps.is_available()` probe

### Phase 2: Test
- Add vitest asserting MPS branch returns `"mps"` when available

### Phase 3: Model download + reindex
- Trigger sentence-transformers download (auto on first instantiation)
- Run CocoIndex reindex via `cocoindex_refresh_index`
- Capture wall-clock + final `.cocoindex_code/` disk size

### Phase 4: Smoke tests
- 3-5 CocoIndex queries with known answers
- Code Graph bridge query via `code_graph_context`

### Phase 5: Document + commit
- Write `evidence/swap-runbook.md`
- Strict-validate + commit + push
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Unit: vitest assertion for MPS branch
- Integration: smoke tests via MCP for CocoIndex + Code Graph
- The embedder quality itself is validated by 018/003 (benchmark vs gemma)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- PyTorch 2.11.0 with MPS (already in venv)
- sentence-transformers (already in venv)
- 018/002 fixture (used downstream by 018/003)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| MPS bug in jina-code | Operator sets `COCOINDEX_CODE_DEVICE=cpu` |
| jina-code worse than gemma (per 018/003) | Revert `_DEFAULT_MODEL` + reindex |
| Bridge breaks | Hold swap, patch bridge response-shape |
<!-- /ANCHOR:rollback -->
