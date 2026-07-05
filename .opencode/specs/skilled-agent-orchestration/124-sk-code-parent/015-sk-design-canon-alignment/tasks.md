---
title: "Tasks: Phase 15 sk-design canon alignment"
description: "Forward-looking task breakdown for the sk-design parent-hub canon alignment phase, with pushed packetKind repair recorded as the only completed task."
trigger_phrases:
  - "sk-design canon tasks"
  - "sk-design changelog symlinks"
  - "sk-design benchmark tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/015-sk-design-canon-alignment"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented; execution pending"
    next_safe_action: "Run T002 by deleting only the five audited hub changelog symlinks."
    blockers:
      - "T008 is blocked on phase 017 canon bundleRules reconciliation."
    key_files:
      - ".opencode/skills/sk-design/changelog/"
      - ".opencode/skills/sk-design/description.json"
      - ".opencode/skills/sk-design/manual_testing_playbook/"
      - ".opencode/skills/sk-design/benchmark/"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/design-interface/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-015-doc-authoring"
      parent_session_id: null
    completion_pct: 15
    open_questions:
      - "T008 remains blocked until phase 017 settles the declarative bundleRules shape."
    answered_questions:
      - question: "Which task is already complete?"
        answer: "T001 packetKind on all five sk-design modes, pushed in commit f8673ff0db."
---
# Tasks: Phase 15 sk-design canon alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [source]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record completed packetKind repair for all five sk-design modes (`.opencode/skills/sk-design/mode-registry.json`) [source: user note; master line 19; commit f8673ff0db]
- [ ] T002 Confirm `.opencode/skills/sk-design/` has no direct edit conflict before execution [source: master lines 61-63]
- [ ] T003 Read sk-design hub files before editing: `SKILL.md`, `mode-registry.json`, `hub-router.json`, changelog entries, and `design-interface/README.md` [source: parent hub canon; read-first rule]
- [ ] T004 Confirm the five audited changelog entries are symlinks, not real packet changelog directories (`.opencode/skills/sk-design/changelog/`) [source: audit P0-9 lines 124-128]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Strict P0 Parent-Hub Fixes
- [ ] T005 Delete hub symlink `changelog/design-audit` and preserve packet changelog directory [source: audit P0-9; master line 20]
- [ ] T006 Delete hub symlink `changelog/design-foundations` and preserve packet changelog directory [source: audit P0-9; master line 20]
- [ ] T007 Delete hub symlink `changelog/design-interface` and preserve packet changelog directory [source: audit P0-9; master line 20]
- [ ] T008 Delete hub symlink `changelog/design-md-generator` and preserve packet changelog directory [source: audit P0-9; master line 20]
- [ ] T009 Delete hub symlink `changelog/design-motion` and preserve packet changelog directory [source: audit P0-9; master line 20]
- [ ] T010 Author sk-design hub `description.json` from parent skill description template (`.opencode/skills/sk-design/description.json`) [source: audit P0-10; master line 21]
- [ ] T011 Scaffold hub `manual_testing_playbook/` for mode classification and transform-verb framing (`.opencode/skills/sk-design/manual_testing_playbook/`) [source: audit P0-11; master line 22]
- [ ] T012 Produce hub `benchmark/` Lane-C baseline (`.opencode/skills/sk-design/benchmark/`) [source: audit P0-12; master line 23]

### P1/P2 Canon Alignment
- [ ] T013 Declare `transform-verbs` in the registry extension block (`.opencode/skills/sk-design/mode-registry.json`) [source: master line 24; parent template lines 215-225]
- [ ] T014 [B] Convert prose Bundle Rule to declarative `bundleRules` after phase 017 reconciles the canon vocabulary (`.opencode/skills/sk-design/hub-router.json` or reconciled target) [source: master lines 24 and 38-46]
- [ ] T015 Fix broken `design-interface/README.md` link to `../sk-code/README.md` (`.opencode/skills/sk-design/design-interface/README.md`) [source: master line 25]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Contract Verification
- [ ] T016 Run strict parent-skill-check for sk-design and require 0 fails [source: master line 26]
- [ ] T017 Confirm check 7a symlinked changelog failure is gone [source: audit P0-9]
- [ ] T018 Confirm check 8a description failure is gone [source: audit P0-10]
- [ ] T019 Confirm check 9a manual_testing_playbook failure is gone [source: audit P0-11]
- [ ] T020 Confirm check 9b benchmark failure is gone [source: audit P0-12]

### Artifact and Scope Verification
- [ ] T021 Verify `design-interface/README.md` no longer has the broken `../sk-code/README.md` link [source: master line 25]
- [ ] T022 Verify benchmark baseline artifacts are present and readable for phase 019 rollup [source: master lines 54-59]
- [ ] T023 Verify the hub playbook did not overwrite the design-audit packet playbook [source: master line 22]
- [ ] T024 Verify git diff is limited to planned sk-design execution files plus this phase folder [source: brief lines 33-36]
- [ ] T025 Update implementation-summary with actual verification evidence after execution [source: brief planned-state rules lines 17-24]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All non-blocked P0 and P1 execution tasks are marked `[x]` with evidence.
- [ ] T014 is either completed after phase 017 or remains explicitly blocked with the phase 017 dependency.
- [ ] Strict parent-skill-check for sk-design reports 0 fails after execution.
- [ ] `implementation-summary.md` is updated from planned state to executed evidence only after verification.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Hub Program**: See `../spec.md`

<!-- /ANCHOR:cross-refs -->
