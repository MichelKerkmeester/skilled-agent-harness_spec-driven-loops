---
title: "Tasks: Claude Design parity research"
description: "Task breakdown for the 10-iteration parallel-by-model deep-research loop on Claude Design parity for sk-interface-design and mcp-magicpath. All tasks complete; deliverable is research/research.md."
trigger_phrases:
  - "claude design parity tasks"
  - "sk-interface-design mcp-magicpath research tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design/005-claude-design-parity-research"
    last_updated_at: "2026-06-14T08:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All research tasks complete"
    next_safe_action: "Operator reviews the parity recommendation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-005-claude-design-parity-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Claude Design parity research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending, `[P]` parallelizable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Create the `005-claude-design-parity-research` child + `research/`
- [x] Author spec.md (research Level 1, DR-seeded), register in the 148 parent
- [x] Pre-flight: 005 free, gpt-5.5-fast slug, claude account #2 auth + smoke tests
- [x] Author the 2-lineage fan-out config
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] [P] Run lineage `opus48-claude2` (claude-opus-4-8 xhigh, account #2, 5 iters)
- [x] [P] Run lineage `gpt55fast` (openai/gpt-5.5-fast xhigh, 5 iters)
- [x] Merge the findings registries (`fanout-merge.cjs`)
- [x] Host-verify the keystone design-system-inheritance claim via WebFetch
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] Reconcile both lineages; resolve divergences toward the lower-risk option
- [x] Write canonical `research/research.md` (parity scorecard + per-skill recommendations + shared protocol + negative knowledge)
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 10 iterations executed across 2 lineages (5 opus + 5 gpt-5.5)
- [x] Recommendation cross-checks both lineages and calls out divergences
- [x] Negative knowledge recorded (anti-default guardrail preserved)
- [x] No change to either skill (research-only honored)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deliverable: `research/research.md`
- Lineage syntheses: `research/lineages/{opus48-claude2,gpt55fast}/research.md`
- Skills under study: `.opencode/skills/sk-interface-design/`, `.opencode/skills/mcp-magicpath/`
<!-- /ANCHOR:cross-refs -->
