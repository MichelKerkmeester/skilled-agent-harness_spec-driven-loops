---
title: "Tasks: 101/005 Deep AI Council Fix-ups and Graph Value Scenarios"
description: "Task list for 2 vitest fixes, 6 value-comparison scenarios, and root playbook + parent updates."
trigger_phrases:
  - "101/005 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/005-deep-multi-ai-council-skill/005-deep-ai-council-fixups-and-graph-value-scenarios"
    last_updated_at: "2026-05-11T08:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All tasks complete and verified"
    next_safe_action: "Phase 005 marked Complete; nothing pending"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts
      - .opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-005-fixups-and-value-scenarios"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/005 Deep AI Council Fix-ups and Graph Value Scenarios

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Diagnose runtime-parity test design issue (Claude translated frontmatter)
- [x] T002 Diagnose persist-artifacts HELPER_PATH staleness (line 15)
- [x] T003 Design 6 value-comparison scenarios DAC-027..DAC-032
- [x] T004 Create packet 005 folder and spec docs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Fix `multi-ai-council-runtime-parity.vitest.ts`: keep OpenCode/Gemini byte-equivalence; treat Claude separately (name + description + tools:)
- [x] T011 Fix `multi-ai-council-persist-artifacts.vitest.ts` line 15: HELPER_PATH -> `.opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs`
- [x] T012 [P] Author DAC-027 `001-unresolved-disagreement-triage-graph-vs-baseline.md`
- [x] T013 [P] Author DAC-028 `002-decision-provenance-audit-graph-vs-baseline.md`
- [x] T014 [P] Author DAC-029 `003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md`
- [x] T015 [P] Author DAC-030 `004-stalled-council-blocker-ranking-graph-vs-baseline.md`
- [x] T016 [P] Author DAC-031 `005-hot-topic-discovery-graph-vs-baseline.md`
- [x] T017 [P] Author DAC-032 `006-mid-run-interruption-recovery-graph-vs-baseline.md`
- [x] T018 Update root `manual_testing_playbook.md`: count 26 -> 32, categories 8 -> 9, coverage note refresh, canonical artifacts list, TOC, new §16 COUNCIL GRAPH VALUE COMPARISON, renumber §17 (was §15) + §18 (was §16), §17 cross-ref row, §18 catalog rows
- [x] T019 Update parent 101 `spec.md`: add phase 005 to Phase Documentation Map + transitions
- [x] T020 Update parent 101 `graph-metadata.json`: append 005 to children_ids; bump last_active_child_id
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Rerun fixed runtime-parity vitest; expect 2/2 passed
- [x] T031 Rerun fixed persist-artifacts vitest; expect tests passed
- [x] T032 Run all 7 council vitests in one batch; expect 0 failures
- [x] T033 Run `validate_document.py` on each new scenario + modified root playbook
- [x] T034 Run `quick_validate.py .opencode/skills/deep-ai-council`
- [x] T035 Cross-link integrity grep for DAC-027..DAC-032 in root playbook
- [x] T036 Run `validate.sh --strict` on packet 005 and parent 101
- [x] T037 Author implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements REQ-001..REQ-006 verified with evidence
- [x] All 7 council vitest files pass cleanly
- [x] `validate.sh --strict` exit 0 on packet 005 and parent 101
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md` (post-implementation)
- **Predecessor**: `../004-deep-ai-council-playbook-graph-coverage/`
- **Anchor docs**: `.opencode/skills/deep-ai-council/references/graph_support.md`
<!-- /ANCHOR:cross-refs -->
