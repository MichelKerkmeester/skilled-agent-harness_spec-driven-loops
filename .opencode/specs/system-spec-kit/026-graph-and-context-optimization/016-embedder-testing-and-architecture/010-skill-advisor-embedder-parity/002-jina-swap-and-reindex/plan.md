---
title: "Plan: 022/002 jina swap + reindex"
description: "Phases for skill-advisor jina-v3 activation"
trigger_phrases: ["022/002 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-skill-advisor-embedder-parity/002-jina-swap-and-reindex"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored phases"
    next_safe_action: "Wait for 022/001 then execute Phase 1"
    blockers: ["depends on 022/001"]
    key_files: ["evidence/swap-runbook.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022002"
      session_id: "022-002-jina-swap-and-reindex-plan"
      parent_session_id: "022-002-jina-swap-and-reindex"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 022/002 jina swap + reindex

<!-- ANCHOR:summary -->
## 1. SUMMARY

Stop daemon → call `setActiveEmbedder('jina-embeddings-v3')` → run reindex → restart daemon → smoke-test. Document runbook in `evidence/swap-runbook.md`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Active pointer | `vec_metadata` reports jina-v3 |
| Reindex | exit 0; row count preserved |
| Smoke | `recommend "memory save"` returns sane top-3 |
| Regression | existing vitest suite passes |
| Strict-validate | PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
Operator runs:
  1. ps + kill skill-advisor daemon
  2. node <reindex-script> --embedder jina-embeddings-v3
  3. systemctl/launchctl restart skill-advisor (or let it auto-spawn)
  4. python skill_advisor.py recommend "memory save" → expect top-3 includes system-spec-kit
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight
- Confirm 022/001 shipped
- Snapshot skill-graph.sqlite before swap

### Phase 2: Swap
- Call `setActiveEmbedder('jina-embeddings-v3')`
- Verify `vec_metadata.active_embedder_name`

### Phase 3: Reindex
- Run reindex script (re-embed all skill metadata)
- Capture wall-clock + row count

### Phase 4: Smoke
- 5 sample `recommend` queries
- Verify outputs include expected top-3 picks (system-spec-kit, sk-git, mcp-coco-index, etc)
- Run existing vitest suite

### Phase 5: Document + commit
- Write `evidence/swap-runbook.md`
- Strict-validate + commit + push
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Smoke: 5 hand-picked queries with expected top-3 (sanity baseline)
- Regression: existing skill-advisor test suite
- Performance: capture before/after recommend latency
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 022/001 pluggable layer (BLOCKING)
- jina-v3 model via Ollama (already pulled)
- skill-advisor daemon (operator close required)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Smoke regression > 1/5 queries | Revert to gemma via setActiveEmbedder('embeddinggemma-300m'); reindex |
| Reindex hangs | Kill; restore from skill-graph snapshot |
| Regression in vitest | Rollback as above; investigate |
<!-- /ANCHOR:rollback -->
