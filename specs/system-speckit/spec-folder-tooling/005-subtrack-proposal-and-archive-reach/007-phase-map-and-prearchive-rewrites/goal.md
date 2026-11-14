---
title: "Goal: Phase 7: phase-map-and-prearchive-rewrites"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "phase map and prearchive rewrites goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/007-phase-map-and-prearchive-rewrites"
    last_updated_at: "2026-11-14T06:11:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Applied the plan verification of 2026-11-14 and recorded decision D5"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-phase-map-and-prearchive-rewrites"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: phase-map-and-prearchive-rewrites

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave no document naming a moved folder by a name it no longer has, after a phase is renumbered or re-parented and after a packet is restored from `z_archive/` onto a new number.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A bare folder name is rewritten only inside the parent folder of a phase whose parent is unchanged, and only where no letter, digit, underscore or hyphen stands before it. It is never matched across `specs/`, and `session_id` values stay as written. |
| D2 | A dry run prints every rewrite the apply will make. |
| D3 | The pre-archive id is rewritten only when the destination is not under `z_archive/` and no live folder holds it. |
| D4 | Every finding is reproduced in a `mktemp` copy before its fix, and no code comment names a spec path, a packet number or a finding id. |
| D5 | A re-parented phase's rows are removed from the old parent and added to the new one. The move is never refused over those rows, because re-parenting is a shipped capability. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In a `mktemp` copy where `PP` is a phase parent, after `relocate.mjs --renumber PP --apply` moves `003-gamma` to `002-gamma`, `rg -n -e '^003-gamma' -e '[^A-Za-z0-9_-]003-gamma' PP/spec.md PP/goal.md PP/[0-9]*/spec.md PP/[0-9]*/implementation-summary.md` prints nothing
- [ ] A second phase parent with its own `003-gamma`, not in the run, is byte-identical after the run
- [ ] After `003-gamma` is re-parented as `002-gamma`, `rg -n 'gamma' <old parent>/spec.md <old parent>/goal.md <old parent>/[0-9]*/spec.md` prints nothing, and `rg -c '002-gamma/' <new parent>/spec.md` and `rg -c '002-gamma' <new parent>/goal.md` each print 1
- [ ] After `archive.sh --restore` onto a taken number, `rg -n 'zeta/001-old' <the referring file>` prints nothing, and with a live `specs/zeta/001-old` present the same references are unchanged
- [ ] From `.skilled/skills/system-spec-kit/runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents authored | Done | `spec.md`, `plan.md` and `tasks.md` in this folder, 2026-11-14 |
| Implementation | Pending | Not started. Waits for the phase 006 commit |

### Deviations and findings

| Item | Note |
|------|------|
| Answered: re-parent handling | Reviewer A confirmed the renumber case only. The rows are removed from the old parent and added to the new one, recorded as D5. A refusal is not offered, because phase 001 shipped re-parenting and a refusal would regress it. The dangling names this guards against are the plan verifier's inference, and T001 reproduces the case first. |
| Open question: Phase column | Whether any validation rule reads the Phase column number of a map row is UNKNOWN. T001 records it. The number is out of scope until then. |
| Residual against parent D3 | After a renumber or a re-parent the Phase column number, a `Phase N` title and a `Phase N of M` row keep the old number. This phase rewrites folder names only. The parent goal log names the residual. |
| Plan verified 2026-11-14 | Verifier findings 2, 3, 15 and two points of 17 are applied. The old check could not pass, because a scaffold also writes the name into `session_id` values, so the criterion now reads four named file sets with a left-boundary guard. `repair-derived.cjs:103` already holds a Spec Folder row rule, read on 2026-11-14, so T001 decides whether the pass must cover that row. |
| Findings confirmed by the orchestrator | A2 was re-read in the code by the orchestrator. A8 is a reviewer report that T001 reproduces before any fix. |
<!-- /ANCHOR:log -->
