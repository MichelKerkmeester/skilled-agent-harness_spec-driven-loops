---
title: "Tasks: Competitor design-tools research"
description: "Task breakdown for the web-heavy 10-iteration parallel-by-model competitor design-tools research. All tasks complete; deliverable is research/research.md."
trigger_phrases:
  - "competitor design tools tasks"
  - "v0 lovable subframe research tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-design-interface/006-competitor-design-tools-research"
    last_updated_at: "2026-06-14T09:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All research tasks complete"
    next_safe_action: "Fold into the 007 keystone build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-006-competitor-design-tools-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Competitor design-tools research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending, `[P]` parallelizable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Create the `006-competitor-design-tools-research` child + `research/`
- [x] Author spec.md (research Level 1, DR-seeded), register in the 148 parent
- [x] Author the 2-lineage web-heavy fan-out config
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] [P] Run lineage `opus48-claude2` (opus-4.8 xhigh, account #2, 5 iters)
- [x] [P] Run lineage `gpt55fast` (gpt-5.5-fast xhigh, web, 5 iters)
- [x] Merge the findings registries (`fanout-merge.cjs`)
- [x] Cross-check (gpt web-verified vs opus model-knowledge); dedup vs 005
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] Rank net-new ideas per skill (ADOPT / ADAPT / SKIP)
- [x] Write canonical `research/research.md` (ranked net-new + negative knowledge + carry-forward)
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 10 iterations executed across 2 lineages
- [x] Net-new ideas deduped vs 005; only sharper/net-new carried forward
- [x] Negative knowledge recorded (anti-default guardrail reconfirmed)
- [x] No change to either skill (research-only honored)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deliverable: `research/research.md`
- Lineage syntheses: `research/lineages/{opus48-claude2,gpt55fast}/research.md`
- Dedup baseline: `../005-claude-design-parity-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
