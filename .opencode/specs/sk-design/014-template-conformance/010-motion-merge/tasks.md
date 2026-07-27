---
title: "Tasks: Merge design-motion into design-interface"
description: "Task breakdown for the four-phase merge: decide the ordering mechanism, move content and resolve collisions, rewire the command/router/test surface, delete design-motion and verify."
trigger_phrases:
  - "motion merge tasks"
  - "design-motion retirement tasks"
  - "restraint gate ordering tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/010-motion-merge"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task breakdown across four gated phases"
    next_safe_action: "Start T001"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Merge design-motion into design-interface
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
## Phase 1: Setup [decide ordering mechanism, load-bearing gate, ~1h]

- [ ] T001 Read commit `b217d74b819`'s diff in full (no path) [20m]
- [ ] T002 Compare `DEFAULT_RESOURCE` vs. preflight §10 row for mechanical enforceability (`design-interface/SKILL.md`, `interface-preflight-card.md`) [20m]
- [ ] T003 Record the chosen mechanism and rationale (`implementation-summary.md`) [10m]
- [ ] T004 [B until T003 passes] HARD STOP CHECK: confirm the mechanism is genuinely enforceable; if not, halt and escalate before Phase 2 [10m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [move content + rewire surface, blocked on Phase 1, ~4h]

### Move content

- [ ] T005 Nest `design-motion/references/*` -> `design-interface/references/motion/` (`references/motion/`) [20m]
- [ ] T006 Nest `design-motion/assets/*` -> `design-interface/assets/motion/` (`assets/motion/`) [15m]
- [ ] T007 Flatten `design-motion/procedures/*` into `design-interface/procedures/` (`procedures/`) [15m]
- [ ] T008 Flatten `design-motion/corpus/*` into `design-interface/corpus/` (`corpus/`) [15m]
- [ ] T009 Resolve collision: `fixtures-motion.mjs` (`corpus/`) [5m]
- [ ] T010 Resolve collision: `motion-card-selection-proof.md` (`manual-testing-playbook/`) [5m]
- [ ] T011 Resolve collision: `motion-no-card-fallback.md` (`manual-testing-playbook/`) [5m]
- [ ] T012 Resolve collision: `motion-direct-fallback-without-subagents.md` (`manual-testing-playbook/`) [5m]
- [ ] T013 Resolve collision: `v1.0.0.0-motion.md` (`changelog/`) [5m]
- [ ] T014 Merge collision: `corpus/README.md` [10m]
- [ ] T015 Merge collision: `corpus/tests/README.md` [10m]
- [ ] T016 Merge collision: `feature-catalog.md` [10m]
- [ ] T017 Merge collision: `manual-testing-playbook.md` [15m]
- [ ] T018 Delete `design-motion/SKILL.md`, `README.md`, `changelog/` (`design-motion/`) [10m]

### Rewire surface

- [ ] T019 Add 5-6 motion intents to `SKILL.md` mirroring `VISUAL_SYSTEM` (`design-interface/SKILL.md`) [30m]
- [ ] T020 Wire the chosen ordering mechanism into `SKILL.md` and/or preflight §10 (`design-interface/SKILL.md`, `interface-preflight-card.md`) [20m]
- [ ] T021 Add matching motion task lane to `command-metadata.json` (`command-metadata.json`) [15m]
- [ ] T022 Add matching motion lane row to `design.md` (`commands/interface/design.md`) [15m]
- [ ] T023 Repoint `next` from motion to `design-reference` (`design-command-surface-check.mjs:358`) [10m]
- [ ] T024 [P] Update `preferSiblingWhen` (`design-command-surface-check.mjs:916`) [10m]
- [ ] T025 [P] Update `typicallyBefore`/`handoff.nextOptions` (`design-command-surface-check.mjs:983,1249`) [15m]
- [ ] T026 Collapse `tieBreak` to declared 2-mode order (`hub-router.json:7`) [10m]
- [ ] T027 Collapse `PAIRED_MODES`; keep `'motion'` axis (`grounding-receipt.mjs:26-30`) [10m]
- [ ] T028 Delete `motion-character-handoff.md` (`shared/evidence-envelopes/`) [5m]
- [ ] T029 Delete `/interface:motion` + runtime mirrors (`.claude/`, `.codex/`, `.cursor/`, `.devin/`) [15m]
- [ ] T030 Update `interface-command-contract.test.mjs:12,36,91` [15m]
- [ ] T031 Update `design-command-surface-check.test.mjs:63-71,94,106,157` and `design-command-surface-check.mjs:37-41` [20m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [~30m]

- [ ] T032 `rg -n "design-motion"` across the hub (excluding history) returns nothing (no path) [10m]
- [ ] T033 Run `design-command-surface-check.mjs`; confirm no two-cycle, correct `tieBreak` (no path) [10m]
- [ ] T034 Both test rosters pass (no path) [10m]
- [ ] T035 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/010-motion-merge --strict` exits 0 (no path) [5m]
- [ ] T036 Mark checklist.md items with evidence (`checklist.md`) [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Phase 1 hard-stop check explicitly passed before Phase 2 began
- [ ] All 9 filename collisions resolved and named
- [ ] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
