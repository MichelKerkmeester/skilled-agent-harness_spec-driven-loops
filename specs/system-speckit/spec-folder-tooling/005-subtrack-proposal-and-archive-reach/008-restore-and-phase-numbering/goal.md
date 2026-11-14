---
title: "Goal: Phase 8: restore-and-phase-numbering"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "restore and phase numbering goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/008-restore-and-phase-numbering"
    last_updated_at: "2026-11-14T06:11:01Z"
    last_updated_by: "markdown-agent"
    recent_action: "Applied the plan verification of 2026-11-14"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-restore-and-phase-numbering"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: restore-and-phase-numbering

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make an archive restore report what happened and never create a mixed track, and stop `create.sh` from giving a new phase the number of an archived one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `relocate.mjs` gains one exit status, 3, for a run whose steps and sweep all passed and whose only failure is a moved packet's validation. Statuses 0, 1 and 2 keep their meaning otherwise. A run that ends on 3 has landed, so the same call again prints `relocate: nothing to do` and exits 0. This amends decision D1 of phase 006 for that one case, and REQ-001 and REQ-012 of phase 001, as the parent `spec.md` Operator Decisions record. |
| D2 | A renumbering restore that ends on status 3 exits 0 and names the packet in a warning. |
| D3 | `archive.sh` holds no copy of the sub-track predicate. It asks the relocate preflight and refuses a restore only on its mixed-track line. Every other preflight result leaves the restore as it is today. |
| D4 | A new phase is numbered above every live and archived phase of its parent, and its predecessor is the highest live phase. |
| D5 | Every finding is reproduced in a `mktemp` copy before its fix, and no code comment names a spec path, a packet number or a finding id. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In a `mktemp` copy with `001-alpha` live and `z_archive/002-gamma` archived in a phase parent, `create.sh --phase --parent <parent> --phase-names delta` creates `003-delta`
- [ ] `archive.sh --restore` onto a taken number, for a packet that fails its own strict validation, prints the `Restored:` line and one warning and exits 0
- [ ] The same restore with `repair-derived.cjs` made to exit 1 prints `Restore did not finish` and exits 1
- [ ] `archive.sh --restore` of a track-level packet into a track that holds sub-tracks exits 1, the folder is still under `z_archive/` and `sweep-track-roots.mjs` exits 0, and an archive followed by a restore with no commit in between exits 0
- [ ] From `.skilled/skills/system-spec-kit/runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/archive-track.vitest.ts tests/archive-numbering.vitest.ts tests/relocate.vitest.ts` exits 0
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
| Implementation | Pending | Not started. Waits for the phase 006 and 007 commits |

### Deviations and findings

| Item | Note |
|------|------|
| Open question: restore exit status | Exit 0 with a warning is the planned default for a restore whose steps all landed, because a plain restore runs no validation and exits 0. The operator may prefer a distinct non-zero status. |
| Open question: sub-track restore command | Whether `relocate.mjs --from <track>/z_archive/NNN-slug --to <track>/<sub>/NNN-slug --apply` works today is UNKNOWN. T001 runs it before the refusal message names it. |
| Findings confirmed by the orchestrator | A9 was re-read in the code by the orchestrator. A6 and A7 are reviewer reports that T001 reproduces before any fix. |
| Plan verified 2026-11-14 | Verifier findings 4, 9, 15 and one point of 17 are applied, with the status 3 wording of finding 1. The verifier confirmed in a scratch copy that the preflight refuses a restore into a grouped track and, with the same exit status 2, a restore after an uncommitted archive. Whether the existing restore cases in `archive-track.vitest.ts` commit in between was not checked. `README.md` and `relocate.vitest.ts` joined Files to Change. |
<!-- /ANCHOR:log -->
