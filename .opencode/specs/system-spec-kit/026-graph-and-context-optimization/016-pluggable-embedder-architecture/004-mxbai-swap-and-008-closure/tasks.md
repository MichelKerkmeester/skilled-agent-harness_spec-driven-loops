---
title: "Tasks: 016/004 mxbai swap + 008 closure"
description: "Numbered checklist for the final concrete swap phase."
trigger_phrases: ["016/004 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure"
    last_updated_at: "2026-05-17T07:24:00Z"
    last_updated_by: "main_agent"
    recent_action: "Marked retry results after adapter mapping fix exposed context-length activation failure"
    next_safe_action: "Fix bounded-context re-index input sizing before retrying T1.1"
    blockers: ["mxbai-embed-large-v1 activation failed at 0/12929 because full memory input exceeded context length"]
    key_files:
      - "decision-record.md"
      - "evidence/mxbai-swap-status.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-004-tasks"
      parent_session_id: null
    completion_pct: 90
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
- [x] T0.1: Confirm 016/001, 016/002, 016/003 all shipped on main (`HEAD=eb9563fba`, required commits present)
- [x] T0.2: `git pull origin main` (`Already up to date`)
- [x] T0.3: `ollama pull mxbai-embed-large`
- [x] T0.4: `mcp__mk_spec_memory__checkpoint_create({name: "pre-016-004-mxbai-swap-<UTC>"})` (id=3)
- [x] T0.5: Capture baseline `ps aux | grep mcp-server` + `du -sh database/` for footprint comparison


<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### Swap
- [x] T1.1: `mcp__mk_spec_memory__embedder_set({name: "mxbai-embed-large-v1"})` — captured jobId `emb-swap-2026-05-17T07-10-12-183Z-7078e904`
- [x] T1.2: Poll `embedder_status`; status became `failed` at `0/12928`
- [ ] T1.3: Verify active pointer: `embedder_list` shows mxbai-embed-large-v1 active — FAILED; baseline remained active
- [x] T1.4: Follow-up fixed `OllamaAdapter` provider-tag mapping and retried with checkpoint `pre-016-004-retry-20260517T072209Z`
- [x] T1.5: Retry job `emb-swap-2026-05-17T07-22-22-214Z-8a6dcaa9` failed at `0/12929`; direct probe found `{"error":"the input length exceeds the context length"}` for the first 50-row memory batch

### Cat-24 re-run
- [ ] T2.1: Dispatch cli-opencode for cat-24/402 (synonymy) — SKIPPED; mxbai not active
- [ ] T2.2: Dispatch cli-opencode for cat-24/408 (compound concept) — SKIPPED; mxbai not active
- [ ] T2.3: Dispatch cli-opencode for cat-24/409 (LLM-made-memory recall) — SKIPPED; mxbai not active
- [x] T2.4: Append rows to `evidence/cat-24-rerun.jsonl`
- [ ] T2.5: Verify 409 reaches PASS (8/10 top-3) — NOT MET; rollback ADR-003 recorded

### 008 PASS sample re-run
- [x] T3.1: Pick 20-scenario sample across cat-01, cat-11, cat-15, cat-13, cat-23
- [ ] T3.2: Dispatch cli-devin SWE-1.6 paired for the sample — SKIPPED; mxbai not active
- [x] T3.3: Append rows to `evidence/008-pass-sample-rerun.jsonl`
- [ ] T3.4: Verify ≥ 19/20 PASS preserved — NOT MEASURED; activation failed before sample execution, 0/20 executed under mxbai

### Benchmark + decision
- [x] T4.1: Aggregate cat-24-rerun + 008-pass-sample into `evidence/swap-benchmark.csv`
- [ ] T4.2: Measure cosine on known weak pair (target ≥ 0.43) — SKIPPED; mxbai not active
- [x] T4.3: Author `decision-record.md` ADR-001 (ROLLBACK) + ADR-002 failure mode
- [x] T4.3b: Author `decision-record.md` ADR-003 (ROLLBACK after mapping fix; context-length failure mode)
- [x] T4.4: Update packet 008's implementation-summary.md to record 016/004 attempted closure but cat-24/409 remains open
- [x] T4.5: Update packet 115's implementation-summary.md to mark SUPERSEDED by 016's pluggable architecture


<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] T5.1: strict-validate 016/004 exit 0
- [x] T5.2: strict-validate 008 still exit 0
- [ ] T5.3: Memory save via `/memory:save` — attempted; `memory_save` returned E081 even on dry-run
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
