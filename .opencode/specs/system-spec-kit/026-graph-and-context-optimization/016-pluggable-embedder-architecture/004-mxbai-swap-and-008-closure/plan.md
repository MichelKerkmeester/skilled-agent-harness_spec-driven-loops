---
title: "Plan: 016/004 mxbai swap + 008 closure"
description: "Execute the swap, run benchmarks, record decision, close 008 cat-24/409."
trigger_phrases: ["016/004 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure"
    last_updated_at: "2026-05-17T11:54:33Z"
    last_updated_by: "main_agent"
    recent_action: "Retrieval-rescue layer closed cat-24/409 at 8/10 top-3"
    next_safe_action: "Keep ADR-010 and evidence rows as closure proof"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-004-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/004 mxbai swap + 008 closure

<!-- ANCHOR:summary -->
## 1. SUMMARY
| Aspect | Value |
|--------|-------|
| Executor | cli-opencode `--model deepseek/deepseek-v4-pro --pure --format json` |
| Storage | `004-mxbai-swap-and-008-closure/evidence/` + `decision-record.md` |
| Testing | Re-run cat-24 + sample cat-01/11/15 against new model |


<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Done
- [x] Nomic active after dense-swap comparison and post-surgery re-index
- [x] cat-24/409 reaches PASS through opt-in retrieval rescue (`8/10`)
- [x] 008 PASS sample preserves ≥ 95% (`20/20` proxy, 0 regressions observed)
- [x] ADR-010 records final KEEP decision for the retrieval-rescue layer
- [x] Evidence rows capture cat-24 and preservation results


<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Pure orchestration — no new code. Uses the surface built by 016/001-003.

```bash
# 0. Prep
git pull origin main                              # ensure 016/001-003 commits present
ollama pull mxbai-embed-large                     # ~670 MB download
checkpoint_create({name: "pre-016-004-mxbai-swap-<UTC>"})  # safety net

# 1. Swap
JOB=$(mcp__mk_spec_memory__embedder_set({name: "mxbai-embed-large-v1"}))
# Poll until done
while [ "$(embedder_status $JOB).status" != "completed" ]; do sleep 30; done

# 2. Re-run cat-24
cli-devin/cli-opencode dispatch with cat-24 scenarios 402, 408, 409
# Append rows to 016/004/evidence/cat-24-rerun.jsonl

# 3. Re-run 008 PASS sample
cli-devin/cli-opencode dispatch with cat-01/002, cat-11/035, cat-15/095, etc.
# Append rows to 016/004/evidence/008-pass-sample-rerun.jsonl

# 4. Aggregate + decide
python3 scripts/aggregate-swap-benchmark.py > evidence/swap-benchmark.csv
# Author decision-record.md ADR-001
```


<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Prep + checkpoint
2. Swap via `embedder_set`
3. Re-run cat-24 (402, 408, 409)
4. Re-run 008 PASS sample (~20 scenarios)
5. Aggregate + ADR-001 decision
6. Update 008 + 115 impl-summary cross-refs
7. Final commit


<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
- cat-24 scenarios via cli-opencode (handle their paraphrase test predicate)
- 008 PASS sample via cli-devin paired (mechanical re-run, ~15 min)
- Footprint measurement: `ps aux` + `du -sh database/`


<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- 016/001 + 016/002 + 016/003 all shipped + working on main
- Ollama installed + `mxbai-embed-large` pulled
- Pre-swap checkpoint via `checkpoint_create`


<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
If cat-24/409 doesn't reach PASS OR 008 regression > 5%:
1. `mcp__mk_spec_memory__embedder_set({name: "embeddinggemma-300m"})` — flips back
2. Active pointer reverts to vec_768 (still intact)
3. Author ADR-002 documenting failed swap + evidence
4. Optional: open 117-embedding-model-evaluation-take-2 to evaluate other candidates

<!-- /ANCHOR:rollback -->

