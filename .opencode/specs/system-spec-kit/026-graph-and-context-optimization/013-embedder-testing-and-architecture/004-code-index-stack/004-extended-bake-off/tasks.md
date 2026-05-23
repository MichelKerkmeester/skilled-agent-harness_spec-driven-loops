---
title: "Tasks: 016/006/004 Extended Bake-Off"
description: "Tasks for nomic + stella benchmark"
trigger_phrases:
  - "016/006/004 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off"
    last_updated_at: "2026-05-18T00:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks"
    next_safe_action: "T001 pre-pull models"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000006004"
      session_id: "016-006-004-extended-bake-off-tasks"
      parent_session_id: "016-006-004-extended-bake-off"
    completion_pct: 5
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/006/004 Extended Bake-Off

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pre-pull nomic-CodeRankEmbed via `python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('nomic-ai/CodeRankEmbed', trust_remote_code=True)"`; verify model card + load
- [ ] T002 Pre-pull stella via `python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('dunzhang/stella_en_400M_v5', trust_remote_code=True)"`; verify load
- [ ] T003 Snapshot current CocoIndex index (note size + jina-code state for restore)
- [ ] T004 Author `evidence/run-extended-bake-off.sh` (extending 018/003 ad-hoc approach into a reusable script)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Run benchmark for nomic-CodeRankEmbed; on first-failure retry once with `--foreground`
- [ ] T006 Run benchmark for stella_en_400M_v5; verify vec_1024 schema created
- [ ] T007 Capture results to `evidence/cocoindex-embedder-comparison-extended.csv` + `.jsonl` + `runlog.txt`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Generate `evidence/comparison-table.md` (4 rows: jina-code/gemma from 018/003 + nomic/stella from this packet)
- [ ] T009 If any candidate beats jina-code's 38.9% by ≥3 pp: author ADR-002 in `decision-record.md`
- [ ] T010 Restore CocoIndex to jina-code baseline (operator-safety)
- [ ] T011 Update implementation-summary.md with findings + recommendations
- [ ] T012 Strict-validate `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict`
- [ ] T013 Commit + push (strict-scope)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

13 tasks `[x]`. Comparison table complete. Either ADR-002 ships OR `decision-record.md` documents "no improvement found". CocoIndex restored to jina-code baseline.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md` (016/004-code-index-stack)
- Baseline data: `../003-comparison-measure/evidence/cocoindex-embedder-comparison.csv`
- Fixture: `../002-baseline-fixture/evidence/code-retrieval-fixture.json`
- Registry: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py`
<!-- /ANCHOR:cross-refs -->
