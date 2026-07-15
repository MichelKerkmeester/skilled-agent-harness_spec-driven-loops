---
title: "Summary: 016/004/011 Rerank Model Fit Investigation"
description: "Implementation summary placeholder; updated during/after research execution"
trigger_phrases: ["016/004/011 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation"
    last_updated_at: "2026-05-18T19:22:26Z"
    last_updated_by: "main_agent"
    recent_action: "Completed Phase 1 reranker candidate research and strict validation"
    next_safe_action: "Run gated Phase 2 targeted 8-probe bench after CocoIndex restore"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004011"
      session_id: "016-004-011-summary"
      parent_session_id: "016-004-011"
    completion_pct: 20
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/004/011 Rerank Model Fit Investigation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | In Progress — Phase 2 targeted bench gated |
| Branch | main |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Phase 1 research was completed without running any benchmark. `research.md` now documents the candidate survey, triage rationale, exact `COCOINDEX_RERANK_MODEL` swap commands for MEASURE candidates, and the gated Phase 2 targeted-bench scaffold.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The work used web/model-card research plus local packet/source reads. No `ccc` invocation, no bench, no commit, and no file writes outside this spec folder.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

1. Measure `mixedbread-ai/mxbai-rerank-base-v2` first because it is a current Apache-2.0, Sentence-Transformers-compatible reranker with explicit code/technical retrieval support.
2. Measure `Qwen/Qwen3-Reranker-0.6B` second because it is Apache-2.0, instruction-aware, and code-retrieval scoped, but current CocoIndex cannot pass a code-specific prompt.
3. Treat `hq-bench/coreb-code-reranker` as the most semantically relevant non-drop-in candidate; it needs a follow-up adapter rather than an env-var-only bench.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Concrete verification commands when executed:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation --strict
```

Checklist (filled during/after execution):

- [x] research.md exists with Phase 1 verdict
- [ ] evidence/ has per-candidate measurement output
- [x] strict-validate PASSED on this packet

Validation evidence:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation --strict
```

Result: PASSED with 0 errors and 0 warnings.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

Research-only packet. May produce a SWAP recommendation that requires a follow-on implementation commit.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:commit-handoff -->
## 7. COMMIT HANDOFF

Paths touched in this Phase 1 research turn:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/implementation-summary.md`

No Git commit was created. Phase 2 remains gated and should run only after CocoIndex restore.
<!-- /ANCHOR:commit-handoff -->
