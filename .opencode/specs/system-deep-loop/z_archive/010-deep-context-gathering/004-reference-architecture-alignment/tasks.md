---
title: "Tasks: deep-context reference-architecture alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "reference alignment tasks"
  - "smart router rewrite tasks"
  - "reference move tasks"
  - "tasks"
  - "template"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/004-reference-architecture-alignment"
    last_updated_at: "2026-06-07T09:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 tasks for the reference-architecture-alignment phase"
    next_safe_action: "Execute the reference move + 8 new refs + router rewrite + citation sweep"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-context/references/convergence.md"
    session_dedup:
      fingerprint: "sha256:db845e0d74e2f0decc7e374fefdc3ca128789fc7e931a977111fcaf95099955f"
      session_id: "dc-134-004-20260607"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Spec/plan/tasks authored; reference work executes in a separate pass"
      - "MOVE the two flat files; mirror deep-research's 4-subfolder layout"
---
# Tasks: deep-context reference-architecture alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm deep-research's subfolder layout and canonical router as the structural template (.opencode/skills/deep-research/SKILL.md, .opencode/skills/deep-research/references/**)
- [ ] T002 Confirm the runtime source surface and the feature_catalog/0N cross-link targets for each new reference (.opencode/skills/deep-context/feature_catalog/**, .opencode/skills/deep-context/scripts/reduce-state.cjs, .opencode/skills/deep-loop-runtime/**)
- [ ] T003 [P] Confirm the old-flat-path citation inventory across the sweep scope (~62 hits) (.opencode/skills/deep-context, .opencode/commands/deep, .opencode/agents/deep-context.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Move references/convergence.md → references/convergence/convergence.md (content-preserving) (.opencode/skills/deep-context/references/convergence/convergence.md)
- [ ] T005 Move references/loop_protocol.md → references/protocol/loop_protocol.md (content-preserving) (.opencode/skills/deep-context/references/protocol/loop_protocol.md)
- [ ] T006 [P] Author convergence_signals.md (5 signals + composite weights + thresholds), cross-linked to feature_catalog/04 (.opencode/skills/deep-context/references/convergence/convergence_signals.md)
- [ ] T007 [P] Author convergence_recovery.md (blocked-stop + stuck recovery), cross-linked to feature_catalog/04 (.opencode/skills/deep-context/references/convergence/convergence_recovery.md)
- [ ] T008 [P] Author convergence_graph.md (loop_type='context' node kinds/relations + evaluateContext), cross-linked to feature_catalog/06 (.opencode/skills/deep-context/references/convergence/convergence_graph.md)
- [ ] T009 [P] Author state_format.md (packet file hub), cross-linked to the README packet layout (.opencode/skills/deep-context/references/state/state_format.md)
- [ ] T010 [P] Author state_jsonl.md (JSONL record types) (.opencode/skills/deep-context/references/state/state_jsonl.md)
- [ ] T011 [P] Author state_outputs.md (dashboard / Context Report / iteration markdown) (.opencode/skills/deep-context/references/state/state_outputs.md)
- [ ] T012 [P] Author state_reducer_registry.md (reduce-state.cjs ownership + dedup/agreement + atomic/jsonl-repair/post-dispatch-validate), cross-linked to feature_catalog/03,05,07 (.opencode/skills/deep-context/references/state/state_reducer_registry.md)
- [ ] T013 [P] Author guides/quick_reference.md (operator cheat sheet; new ALWAYS baseline) (.opencode/skills/deep-context/references/guides/quick_reference.md)
- [ ] T014 Rewrite SKILL.md §2 to the canonical router (INTENT_SIGNALS {weight,keywords}, RESOURCE_MAP→new paths, LOADING_LEVELS ALWAYS=guides/quick_reference.md + ON_DEMAND, helpers, UNKNOWN_FALLBACK_CHECKLIST); trim §3 to pointers; repath §5/§9 (.opencode/skills/deep-context/SKILL.md)
- [ ] T015 [P] Update README structure: reference count, structure tree, reference-table paths (.opencode/skills/deep-context/README.md)
- [ ] T016 Sweep all ~62 old-flat-path citations to the new subfolder paths across feature_catalog, manual_testing_playbook, the command doc, both workflow YAMLs, and the agent doc (.opencode/skills/deep-context/**, .opencode/commands/deep/start-context-loop.md, .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml, .opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml, .opencode/agents/deep-context.md)
- [ ] T017 Regenerate the deep-context skill graph-metadata.json and reindex the skill advisor (.opencode/skills/deep-context/graph-metadata.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Run the sk-doc structure validator on every new reference and the rewritten SKILL.md (green) (.opencode/skills/deep-context/references/**, .opencode/skills/deep-context/SKILL.md)
- [ ] T019 Resolve every router RESOURCE_MAP path against the new inventory (no missing resource) (.opencode/skills/deep-context/SKILL.md)
- [ ] T020 Confirm zero old-flat-path citations remain in the deep-context sweep scope (rg returns zero)
- [ ] T021 [P] No-duplication review of each new reference against its feature_catalog/0N counterpart
- [ ] T022 Run the deep-loop-runtime vitest regression suite (green; loop behavior unchanged) (.opencode/skills/deep-loop-runtime/**)
- [ ] T023 Confirm the skill advisor resolves deep-context with the new reference paths
- [ ] T024 Run validate.sh --strict on the spec folder and reconcile completion metadata across docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] sk-doc structure validators green; zero old-flat-path citations; vitest regression green; advisor resolves
- [ ] No-duplication vs the feature_catalog confirmed (ADR-003)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
- **Phase Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
Level 3 task breakdown - phased reference-architecture alignment onto the deep-context skill
3 phases: Setup (confirm template + source + inventory), Implementation (move + 8 refs + router + README + sweep + metadata), Verification
-->
