---
title: "Tasks: Deep-context native-only default executor pool"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-context native default tasks"
  - "executor pool default tasks"
  - "native only pool tasks"
  - "deep-context pool tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering/006-native-default-executor-pool"
    last_updated_at: "2026-06-07T11:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked native-default tasks complete"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/assets/deep_context_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-134-006-native-default-executor-pool"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-context native-only default executor pool

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Map het-default references via grep across command/YAML/SKILL/README/config
- [x] T002 Confirm config is the default source and `by-model-shared-scope` is a bound enum
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Set `fanout.executors` to 2 native (`deep_context_config.json`)
- [x] T004 Restructure Q-Pool to A) Native (default) / B) Custom + default-policy prose + examples + PRE-BOUND marker (`start-context-loop.md`)
- [x] T005 [P] Update `executor_pool` description line in both YAMLs
- [x] T006 [P] Update SKILL.md description + §3 example label + Quick-Ref default-pool row
- [x] T007 [P] Update README default-executor-pool row
- [x] T008 Soften agent body (canonical) and re-sync `.claude`/`.codex` mirrors
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 `jq` config (2 native, mode unchanged); `rg` het-only-in-Custom; Q-Pool wording
- [x] T010 Mirror body-diff (3-way identical) + Codex TOML parse
- [x] T011 Run `validate.sh --strict` and complete checklist with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
