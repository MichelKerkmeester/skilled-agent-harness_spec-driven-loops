---
title: "Tasks: 999 — 026 restructure research"
description: "Task breakdown for the 40-iter deep-research dispatch and synthesis."
trigger_phrases:
  - "999 tasks"
  - "026 restructure tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
    last_updated_at: "2026-05-15T21:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks.md"
    next_safe_action: "Phase 1 dispatch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:5e54e0a4c0a4f08a9f9eaa6f4f88b6e2b5fb1c5d4c2a8f7e2e0c8a5d4f3b2a1c"
      session_id: "999-tasks"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 999 — 026 restructure research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create packet skeleton (6 L1 files: spec / plan / tasks / impl-summary / description / graph-metadata)
- [ ] T002 Strict-validate packet PASS
- [ ] T003 Invoke `/spec_kit:deep-research:auto` with PRE-BOUND ANSWERS (executor=cli-devin, model=swe-1.6, iterations=40, convergence=0.0)
- [ ] T004 Confirm `deep-research-config.json` written under `research/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Dispatch loop

- [ ] T005 Monitor per-iter commit lineage on main (`git log --oneline -10`)
- [ ] T006 Verify per-iter post-dispatch-validate output (iteration file ≥ 1000 bytes, JSONL row appended)
- [ ] T007 Handle hung iter: if a single iter exceeds 1200s, kill, log, advance to next iter; per-iter immediate commit limits loss

### Synthesis

- [ ] T008 After 40th iter commits, trigger synthesis pass (auto-triggered by deep-research command, or manually dispatch cli-devin with synthesis recipe)
- [ ] T009 Confirm `research/research.md` exists, cites every iter, groups findings by track / theme

### Resource map authoring

- [ ] T010 Main agent reads `research/research.md`; authors `resource-map.md` with current-state table + proposed-state target + migration plan + recall-optimization proof points
- [ ] T011 Validate `resource-map.md` via sk-doc
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Strict-validate the 999 packet (exit 0)
- [ ] T013 Final commit of packet on main
- [ ] T014 Surface the proposed restructure to the user; await direction on whether to schedule the follow-on execution packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- 40 iter files committed
- `research/research.md` with full provenance
- `resource-map.md` with target-state layout + migration plan
- Strict-validate exits 0
- User has the proposal in hand
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Iter contract: `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md`
- Recipe: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
- Synthesis recipe: `.opencode/skills/cli-devin/assets/agent-config-synthesis.json`
- YAML wiring: `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` (`if_cli_devin:` branch)
<!-- /ANCHOR:cross-refs -->
