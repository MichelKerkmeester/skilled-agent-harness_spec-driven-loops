---
title: "Goal: Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach"
    last_updated_at: "2026-11-13T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-subtrack-proposal-and-archive-reach"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let an operator accept a proposed whole-track subtrack map, apply it with one deterministic command that updates every store, and search and validate archived packets on request.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Archive search is opt-in and live: ripgrep plus per-packet JSON. No archive index is committed and CI is unchanged. |
| D2 | Mixed tracks stay forbidden. A subtrack proposal is a whole-track map. |
| D3 | Moving or renumbering a packet is done by `relocate.mjs` alone. No hand edits and no AI fix-up work. |
| D4 | Next-number allocation counts archived packets. |
| D5 | The work runs as five phases, built and verified one at a time. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-relocation-engine | `001-relocation-engine/goal.md` |
| 002-subtrack-proposal | `002-subtrack-proposal/goal.md` |
| 003-subtrack-archive-and-numbering | `003-subtrack-archive-and-numbering/goal.md` |
| 004-archive-search-and-json | `004-archive-search-and-json/goal.md` |
| 005-tests-and-closeout | `005-tests-and-closeout/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In a throwaway copy, `relocate.mjs --map <sample> --apply` exits 0 and a second run exits 0 with nothing to do
- [ ] `suggest-subtracks.mjs --track <flat track with more than 8 live packets>` prints a map that `relocate.mjs --map` accepts in preflight
- [ ] `find specs -mindepth 3 -maxdepth 3 -type d -name z_archive -not -path "specs/*/[0-9][0-9][0-9]-*/*"` prints 40 paths
- [ ] With `specs/demo/001-a` live and `specs/demo/z_archive/007-b` archived, `create.sh --track demo` creates `008-*`
- [ ] A phrase that lives only under `specs/sk-doc/z_archive/` returns a hit labeled `archived` with `--include-archive` and no hit without it
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure absent from the baseline
- [ ] `validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach --strict --recursive` prints `RESULT: PASSED` six times
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
| Planning documents authored for the parent and five children | Done | `spec.md` here, and `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` in each child |
| 001-relocation-engine | Pending | Not started |
| 002-subtrack-proposal | Pending | Not started |
| 003-subtrack-archive-and-numbering | Pending | Not started |
| 004-archive-search-and-json | Pending | Not started |
| 005-tests-and-closeout | Pending | Not started |
| Planning docs for parent and five phases | done | validate.sh --strict --recursive RESULT: PASSED x6, check-goal 5/5 |
| 001-relocation-engine | Closeable | Code in fc218a0d48. acceptance-criteria.md says Closeable: Yes. Real tree dry run of the sample map exit 1 with git status identical, and in a clone --apply exit 0 and a second --apply exit 0 with nothing to do |
| 002-subtrack-proposal | Closeable | Code in b8912b831c, documents in 3f2c1f9d61 and ccfb6a5313. acceptance-criteria.md says Closeable: Yes. The whole-track map was proven on a 10-packet fixture track in a clone |
| 003-subtrack-archive-and-numbering | Closeable | Code and 40 keep files in 5f3e19712e, documents in ccfb6a5313. acceptance-criteria.md says Closeable: Yes. The goal find prints 40 paths, and in a clone 001-a live beside z_archive/007-b gave 008-next-one |
| 004-archive-search-and-json | Open | Code in 05a83a7d88, regenerated metadata in 55e73d37b5, documents in a637944644. 7 of 8 criteria Met. AC-004 and AC-006 closed in this pass. AC-002 and T020 wait for the regenerated trigger index |
| 005-tests-and-closeout | Open | Suites in 5fefd819e1, 31 passed. npm test exit 0 with 211 files and 2556 tests passed, 5 files and 32 tests above the baseline, 0 failed in both. 9 of 11 criteria Met. AC-008 names a real flat track and only a fixture was run. AC-009 waits for the trigger index |
| Completion criteria as observed 2026-11-13 | Open | 1 relocate apply twice in a clone: observed. 2 proposal map: observed on a fixture only, no real flat track holds more than 8 packets. 3 find prints 40: observed. 4 create.sh gives 008: observed. 5 archive-only phrase: observed. 6 npm test exit 0: observed. 7 six RESULT: PASSED lines: observed by the closeout worker. Nothing is pushed or merged |

### Deviations and findings

| Item | Note |
|------|------|
| Open question: description cache command | UNKNOWN which command regenerates `specs/descriptions.json`. Phases 001 and 004 need it. Phase 001 task T002 resolves it. |
| Open question: `speckit-implement.yaml` line 71 | It carries the option C wording that phase 002 changes elsewhere. The approved plan does not name it. |
| Open question: sweep exit code | Whether a subtrack without `z_archive/` changes the `sweep-track-roots.mjs` exit code is undecided. Phase 003 plans an advisory line. |
| Level and phases | `recommend-level.sh --loc 2500 --files 35` returned Level 2 and `recommended_phases: false`. The operator approved five phases anyway. |
| Answered: description cache command | No CLI regenerates `specs/descriptions.json`. The producer is `ensureDescriptionCache` in `runtime/lib/search/folder-discovery.ts`, called from the compiled module. Since phase 004 `archive.sh` calls it after each archive and each restore, on the operator's decision "Commit everything, add hook". The regenerated cache is in commit `55e73d37b5`. |
| Answered: `speckit-implement.yaml` line 71 | Phase 002 changed it. Option C was changed on every surface by operator decision, `speckit-implement.yaml` included, and the phase 002 summary lists the file as modified. |
| Answered: sweep exit code | Phase 003 kept the planned default. The missing-archive line of `sweep-track-roots.mjs` is an advisory diagnostic on the working tree and leaves the exit code alone. The operator has not ruled on it. On this worktree the sweep exits 0 with no missing-archive line. |
| Open question: fixture for the proposal check | Phase 005 AC-008 and completion criterion 2 name a real flat track with more than eight packets. None exists, and the largest holds 6. The check passed on a 10-packet fixture track in a clone. Does the operator accept the fixture through a decision record? |
<!-- /ANCHOR:log -->
