---
title: "Tasks: ui-ux-pro-max-merge-research"
description: "Task breakdown for the 10-iteration parallel-by-model deep-research loop on merging ui-ux-pro-max into sk-interface-design. All tasks complete; deliverable is research/research.md."
trigger_phrases:
  - "ui-ux-pro-max merge tasks"
  - "sk-interface-design research tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/002-ui-ux-pro-max-merge-research"
    last_updated_at: "2026-06-13T16:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All research tasks complete"
    next_safe_action: "Operator reviews the merge recommendation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-002-ui-ux-pro-max-merge-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: ui-ux-pro-max-merge-research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending
- `[P]` parallelizable
- Evidence in parentheses where applicable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Create the `002-ui-ux-pro-max-merge-research` child + `research/` dir
- [x] Author spec.md (research Level 1, DR-seeded, topic pre-seeded for concurrent-lineage safety)
- [x] Register the child in the 148 parent (children_ids, last_active_child_id, phase map)
- [x] Author the 2-lineage fan-out config (gpt55fast + opus48, 5 iters each, concurrency 2)
- [x] Pre-flight: smoke-test `openai/gpt-5.5-fast --variant xhigh`; confirm async fan-out pool
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] [P] Run lineage `gpt55fast` (cli-opencode, gpt-5.5-fast xhigh, 5 iters) → converged at 4
- [x] [P] Run lineage `opus48` (cli-claude-code, opus-4.8 xhigh, 5 iters) → maxIterations
- [x] Merge the two findings registries (`fanout-merge.cjs`: 2 merged, 0 skipped)
- [x] Read both lineage syntheses and reconcile per-asset verdicts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] Ground-truth the measured CSV row counts vs marketing claims
- [x] Resolve the 5 cross-lineage divergences (recommender role is the crux)
- [x] Write canonical `research/research.md` with the Merge Recommendation
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 9 iterations executed across 2 lineages (5 opus + 4 gpt-5.5, the latter converged)
- [x] Merge recommendation cross-checks both lineages and calls out divergences
- [x] Negative knowledge recorded
- [x] No change made to `sk-interface-design` (research-only scope honored)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deliverable: `research/research.md`
- Lineage syntheses: `research/lineages/{opus48,gpt55fast}/research.md`
- Merged registry: `research/deep-research-findings-registry.json`
- Parent: `../spec.md` (phase map)
<!-- /ANCHOR:cross-refs -->
