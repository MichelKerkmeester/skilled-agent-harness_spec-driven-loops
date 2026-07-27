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
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-reconciler"
    recent_action: "Marked T001-T036 against commit c1981d2b91 with T032 left open"
    next_safe_action: "Close T032 by clearing 4 design-motion path references in 3 files"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
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

**Delivered** in commit `c1981d2b91`.

- [x] T001 Read commit `b217d74b819`'s diff in full (no path) [20m]
- [x] T002 Compare `DEFAULT_RESOURCE` vs. preflight §10 row for mechanical enforceability (`design-interface/SKILL.md`, `interface-preflight-card.md`) [20m] — both judged necessary but neither sufficient alone
- [x] T003 Record the chosen mechanism and rationale (`implementation-summary.md`) [10m] — three redundant mechanisms, recorded in Key Decisions
- [x] T004 HARD STOP CHECK: confirm the mechanism is genuinely enforceable; if not, halt and escalate before Phase 2 [10m] — not triggered; enforceability confirmed at `design-interface/SKILL.md:148-153`, where all six `MOTION_*` `RESOURCE_MAP` entries open with `references/motion/animation-decision-framework.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [move content + rewire surface, blocked on Phase 1, ~4h]

**Delivered** in commit `c1981d2b91`.

### Move content

- [x] T005 Nest `design-motion/references/*` -> `design-interface/references/motion/` (`references/motion/`) [20m] — 7 files resolve at the new path
- [x] T006 Nest `design-motion/assets/*` -> `design-interface/assets/motion/` (`assets/motion/`) [15m] — 3 files
- [x] T007 Flatten `design-motion/procedures/*` into `design-interface/procedures/` (`procedures/`) [15m] — `interaction-states-pass.md`, no collision
- [x] T008 Flatten `design-motion/corpus/*` into `design-interface/corpus/` (`corpus/`) [15m] — `motion-evidence.mjs` (882 lines) plus its two tests
- [x] T009 Resolve collision: `fixtures-motion.mjs` (`corpus/`) [5m] — suffix; sits beside `fixtures.mjs` and `fixtures-foundations.mjs`
- [x] T010 Resolve collision: `motion-card-selection-proof.md` (`manual-testing-playbook/`) [5m] — `motion-` prefix, matching `foundations-card-selection-proof.md`
- [x] T011 Resolve collision: `motion-no-card-fallback.md` (`manual-testing-playbook/`) [5m] — `motion-` prefix
- [x] T012 Resolve collision: `motion-direct-fallback-without-subagents.md` (`manual-testing-playbook/`) [5m] — `motion-` prefix
- [x] T013 Resolve collision: `v1.0.0.0-motion.md` (`changelog/`) [5m] — **deviation:** the motion `changelog/v1.0.0.0.md` was deleted (21 lines), not renamed. A retired mode's release history is packet ceremony the merged sub-area does not carry
- [x] T014 Merge collision: `corpus/README.md` [10m] — `+15`; `motion-evidence.mjs` documented as relocated from the retired mode
- [x] T015 Merge collision: `corpus/tests/README.md` [10m] — `11 +-`
- [x] T016 Merge collision: `feature-catalog.md` [10m] — `82 ++-`
- [x] T017 Merge collision: `manual-testing-playbook.md` [15m] — 13 motion scenarios relocated into section 24; index moved to 43 scenarios across 25 categories
- [x] T018 Delete `design-motion/SKILL.md`, `README.md`, `changelog/` (`design-motion/`) [10m] — `design-motion/` does not resolve on disk

### Rewire surface

- [x] T019 Add 5-6 motion intents to `SKILL.md` mirroring `VISUAL_SYSTEM` (`design-interface/SKILL.md`) [30m] — six shipped: `MOTION_DECISION`, `_STRATEGY`, `_MICRO_INTERACTIONS`, `_PRESENCE`, `_PERFORMANCE`, `_ADVANCED_CRAFT`
- [x] T020 Wire the chosen ordering mechanism into `SKILL.md` and/or preflight §10 (`design-interface/SKILL.md`, `interface-preflight-card.md`) [20m] — ALWAYS row at `SKILL.md:87`, gate first in all six `RESOURCE_MAP` entries at `:148-153`, numbered instruction 11 at `:269`, plus preflight §10
- [x] T021 Add matching motion task lane to `command-metadata.json` (`command-metadata.json`) [15m] — six `motion-*` lanes
- [x] T022 Add matching motion lane row to `design.md` (`commands/interface/design.md`) [15m] — six lane rows at `design.md:63-68`
- [x] T023 Repoint `next` from motion to `design-reference` (`design-command-surface-check.mjs:358`) [10m] — checker reports no two-cycle
- [x] T024 [P] Update `preferSiblingWhen` (`design-command-surface-check.mjs:916`) [10m]
- [x] T025 [P] Update `typicallyBefore`/`handoff.nextOptions` (`design-command-surface-check.mjs:983,1249`) [15m]
- [x] T026 Collapse `tieBreak` to declared 2-mode order (`hub-router.json:7`) [10m] — `["interface", "md-generator", "design-mcp-open-design"]`, the two modes plus the transport
- [x] T027 Collapse `PAIRED_MODES`; keep `'motion'` axis (`grounding-receipt.mjs:26-30`) [10m] — `['design-interface', 'design-md-generator']`; `ALLOWED_INFLUENCE_AXES` still ends in `'motion'`
- [x] T028 Delete `motion-character-handoff.md` (`shared/evidence-envelopes/`) [5m] — 98 lines; only `owned-asset-manifest.md` remains in that directory
- [x] T029 Delete `/interface:motion` + runtime mirrors (`.claude/`, `.codex/`, `.cursor/`, `.devin/`) [15m] — command (83 lines) plus `.codex/prompts/`, `.cursor/commands/`, `.devin/skills/` mirrors and the three `.claude/` command assets
- [x] T030 Update `interface-command-contract.test.mjs:12,36,91` [15m] — 8/8 pass
- [x] T031 Update `design-command-surface-check.test.mjs:63-71,94,106,157` and `design-command-surface-check.mjs:37-41` [20m] — 7/7 pass
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [~30m]

**Delivered** except T032; commands re-run against the current working tree.

- [ ] T032 `rg -n "design-motion"` across the hub (excluding history) returns nothing (no path) [10m] — **OPEN.** 4 occurrences remain outside `benchmark/` and `changelog/`: `feature-catalog/procedure-card-system/procedure-card-inventory.md:40` and `feature-catalog/styles-library-utilization/per-mode-consumers.md:42,52` cite `design-motion/` paths that no longer resolve; `manual-testing-playbook/mode-routing/motion-mode.md:16` is accurate prose about the retired mode
- [x] T033 Run `design-command-surface-check.mjs`; confirm no two-cycle, correct `tieBreak` (no path) [10m] — `STATUS=VALID STAGE=complete`, `commands=2 aliases=6`, `invalid=0 drift=0`
- [x] T034 Both test rosters pass (no path) [10m] — `interface-command-contract` 8/8, `design-command-surface-check` 7/7
- [x] T035 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/010-motion-merge --strict` exits 0 (no path) [5m]
- [x] T036 Mark checklist.md items with evidence (`checklist.md`) [10m] — 13 of 14 ticked; CHK-060 left open against T032
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — 35 of 36; T032 stays open on 4 stale path references
- [x] No `[B]` blocked tasks remaining
- [x] Phase 1 hard-stop check explicitly passed before Phase 2 began
- [x] All 9 filename collisions resolved and named
- [x] Checklist.md fully verified — 13 of 14 ticked, CHK-060 open by design
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
