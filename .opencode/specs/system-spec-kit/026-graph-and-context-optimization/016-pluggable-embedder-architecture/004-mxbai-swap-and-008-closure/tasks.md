---
title: "Tasks: 016/004 mxbai swap + 008 closure"
description: "Numbered checklist for the final concrete swap phase."
trigger_phrases: ["016/004 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded tasks stub"
    next_safe_action: "After 016/003 ships; cli-opencode deepseek-v4-pro picks T0.1"
    blockers: ["016/003"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-004-tasks"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/004 mxbai swap + 008 closure

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
- `[x]` = completed | `[ ]` = pending | `[~]` = partial


<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [ ] T0.1: Confirm 016/001, 016/002, 016/003 all shipped on main
- [ ] T0.2: `git pull origin main`
- [ ] T0.3: `ollama pull mxbai-embed-large`
- [ ] T0.4: `mcp__mk_spec_memory__checkpoint_create({name: "pre-016-004-mxbai-swap-<UTC>"})`
- [ ] T0.5: Capture baseline `ps aux | grep mcp-server` + `du -sh database/` for footprint comparison


<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### Swap
- [ ] T1.1: `mcp__mk_spec_memory__embedder_set({name: "mxbai-embed-large-v1"})` — capture jobId
- [ ] T1.2: Poll `embedder_status` every 60 s until `completed`
- [ ] T1.3: Verify active pointer: `embedder_list` shows mxbai-embed-large-v1 active

### Cat-24 re-run
- [ ] T2.1: Dispatch cli-opencode for cat-24/402 (synonymy)
- [ ] T2.2: Dispatch cli-opencode for cat-24/408 (compound concept)
- [ ] T2.3: Dispatch cli-opencode for cat-24/409 (LLM-made-memory recall)
- [ ] T2.4: Append rows to `evidence/cat-24-rerun.jsonl`
- [ ] T2.5: Verify 409 reaches PASS (8/10 top-3) — if not, halt and ADR-002 rollback

### 008 PASS sample re-run
- [ ] T3.1: Pick 20-scenario sample across cat-01, cat-11, cat-15, cat-13, cat-23
- [ ] T3.2: Dispatch cli-devin SWE-1.6 paired for the sample
- [ ] T3.3: Append rows to `evidence/008-pass-sample-rerun.jsonl`
- [ ] T3.4: Verify ≥ 19/20 PASS preserved — if not, halt and ADR-002 rollback

### Benchmark + decision
- [ ] T4.1: Aggregate cat-24-rerun + 008-pass-sample into `evidence/swap-benchmark.csv`
- [ ] T4.2: Measure cosine on known weak pair (target ≥ 0.43)
- [ ] T4.3: Author `decision-record.md` ADR-001 (keep mxbai-embed-large)
- [ ] T4.4: Update packet 008's implementation-summary.md to mark cat-24/409 CLOSED
- [ ] T4.5: Update packet 115's implementation-summary.md to mark SUPERSEDED by 016


<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [ ] T5.1: strict-validate 016/004 exit 0
- [ ] T5.2: strict-validate 008 still exit 0
- [ ] T5.3: Memory save via `/memory:save`
- [ ] T5.4: Commit + push: `feat(016/004): mxbai-embed-large swap — closes 008 cat-24/409 (51/51 FAILs)`


<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
- mxbai-embed-large active
- cat-24/409 PASS
- 008 regression ≤ 5%
- ADR-001 in decision-record.md
- 008 implementation-summary updated (51/51 = 100% FAILs closed)
- 115 marked superseded


<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Blocked by: 016/001, 016/002, 016/003
- Closes: 008 cat-24/409 + supersedes 115
- Phase parent: 016-pluggable-embedder-architecture

<!-- /ANCHOR:cross-refs -->


