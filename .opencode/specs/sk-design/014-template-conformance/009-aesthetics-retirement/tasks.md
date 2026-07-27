---
title: "Tasks: Retire the aesthetics reference folder and --mode aesthetic lane"
description: "Task breakdown for the single-commit retirement: delete 5 files, remove the lane across five wiring points, regenerate the manifest, update two citing docs."
trigger_phrases:
  - "aesthetics retirement tasks"
  - "mode aesthetic lane removal tasks"
  - "design-interface aesthetics folder tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/009-aesthetics-retirement"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task breakdown across two phases"
    next_safe_action: "Start T001"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/aesthetics/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Retire the aesthetics reference folder and --mode aesthetic lane
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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [confirm citing sites, ~15m]

- [ ] T001 Confirm all six citing-site groups resolve at their stated locations (`spec.md` Files to Change table) [15m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [retire folder + lane, single commit, ~1.5h]

- [ ] T002 Delete `design-interface/references/aesthetics/minimalist.md` (`minimalist.md`) [2m]
- [ ] T003 Delete `design-interface/references/aesthetics/brutalist.md` (`brutalist.md`) [2m]
- [ ] T004 Delete `design-interface/references/aesthetics/soft.md` (`soft.md`) [2m]
- [ ] T005 Delete `design-interface/references/aesthetics/apple-bento.md` (`apple-bento.md`) [2m]
- [ ] T006 Delete `design-interface/references/aesthetics/README.md` (`README.md`) [2m]
- [ ] T007 Remove `AESTHETICS` intent + `RESOURCE_MAP` entry (`design-interface/SKILL.md`) [15m]
- [ ] T008 Remove `aesthetic` task lane (`command-metadata.json:9,32,123,125`) [15m]
- [ ] T009 Remove `aesthetic` lane row + argument-hint value (`commands/interface/design.md:3,60`) [10m]
- [ ] T010 [P] Update argument-hint mirror (`commands/interface/assets/interface-design-auto.yaml`) [5m]
- [ ] T011 [P] Update argument-hint mirror (`commands/interface/assets/interface-design-confirm.yaml`) [5m]
- [ ] T012 Remove `"aesthetic"` vocabulary entry (`hub-router.json:121`) [5m]
- [ ] T013 Regenerate `leaf-manifest.json` (`leaf-manifest.json`) [10m]
- [ ] T014 [P] Update citation (`design-process/resource-loading-notes.md`) [10m]
- [ ] T015 [P] Update citation (`design-process/real-ui-loop.md`) [10m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [~20m]

- [ ] T016 `rg -n "aesthetic"` across the hub (excluding `changelog/`) returns nothing (no path) [5m]
- [ ] T017 Run design-command-surface checker; confirm lanes match `INTENT_SIGNALS` exactly (no path) [10m]
- [ ] T018 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/009-aesthetics-retirement --strict` exits 0 (no path) [5m]
- [ ] T019 Mark checklist.md items with evidence (`checklist.md`) [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Single commit lands the whole retirement (no partial-state commit)
- [ ] Grep sweep clean
- [ ] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
