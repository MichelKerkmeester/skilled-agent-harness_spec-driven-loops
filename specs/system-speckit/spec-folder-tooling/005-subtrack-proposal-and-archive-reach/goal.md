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
    last_updated_at: "2026-11-14T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Folded the completion criteria to seven and cited decision rows Q010 to Q013"
    next_safe_action: "Start phase 006-relocate-resume-and-preflight"
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
| D5 | Phases are built and verified one at a time. 006 to 010 close reviewer A findings 1 to 12 and reviewer B findings 6 to 8 of 2026-11-14. |

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
| 006-relocate-resume-and-preflight | `006-relocate-resume-and-preflight/goal.md` |
| 007-phase-map-and-prearchive-rewrites | `007-phase-map-and-prearchive-rewrites/goal.md` |
| 008-restore-and-phase-numbering | `008-restore-and-phase-numbering/goal.md` |
| 009-proposal-search-and-routing | `009-proposal-search-and-routing/goal.md` |
| 010-real-pipeline-tests | `010-real-pipeline-tests/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In a throwaway copy, `relocate.mjs --map <sample> --apply` exits 0 and a second run exits 0 with nothing to do, and after a late step fails once a rerun exits 0 and the next run prints `nothing to do`
- [ ] `suggest-subtracks.mjs --track <flat track with more than 8 live packets>` prints a map that `relocate.mjs --map` accepts in preflight
- [ ] `find specs -mindepth 3 -maxdepth 3 -type d -name z_archive -not -path "specs/*/[0-9][0-9][0-9]-*/*"` prints 40 paths, `create.sh --track demo` creates `008-*` beside `001-a` and `z_archive/007-b`, and `create.sh --phase --parent` numbers a new phase above an archived one
- [ ] A phrase that lives only under `specs/sk-doc/z_archive/` returns a hit labeled `archived` with `--include-archive` and no hit without it, and the `--json` path record marks the same paths
- [ ] After `relocate.mjs --renumber <phase parent> --apply`, `rg` for a phase's old folder name in its parent `spec.md` prints nothing
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure absent from the baseline, and `relocate-real-pipeline.vitest.ts` exits 1 with the migrate call removed from a scratch `relocate.mjs`
- [ ] `validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach --strict --recursive` prints `RESULT: PASSED` 11 times
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
| Criterion 1 relocate apply twice in a throwaway copy | Done | Clone of the final commit with its own runtime build: relocate.mjs --map sample-map.json --apply exit 0 with applied 1 move(s), sweep ok and validate RESULT: PASSED. A second --apply exit 0 with nothing to do. Clone deleted afterwards |
| Criterion 2 proposal map accepted in preflight | Superseded | Not run on a real flat track, none holds more than 8 live packets and the largest holds 6. Operator answer Q003 Accept the fixture, recorded as ADR-001 in 005-tests-and-closeout/decision-record.md. Fixture in the clone: suggest-subtracks.mjs --track demo exit 0 with a 10-entry map, relocate.mjs --map dry run exit 1 and not 2 with moves=10 moved=0 rewrites=11 identity=10 roots=3 ledger=10 |
| Criterion 3 find prints 40 sub-track archives | Done | The goal find printed 40 paths. 40 keep files in commit 5f3e19712e. sweep-track-roots.mjs exit 0 with no missing-archive line |
| Criterion 4 create.sh numbers above an archived packet | Done | In the clone, specs/demo/001-a live beside specs/demo/z_archive/007-b: create.sh --track demo --skip-branch created 008-next-one. archive-numbering.vitest.ts asserts 008 at specs root, track and sub-track depth, 4 cases pass |
| Criterion 5 archive-only phrase | Done | rg-wrapper.mjs path with skill routing refactor exit 1 with 0 paths. With --include-archive exit 0 with 2 paths under specs/sk-doc/z_archive/019-skill-routing-refactor, each ending [archived]. The wrapper was run directly, not the slash command |
| Criterion 6 npm test against the baseline | Done | At f1cfed3d20: exit 0, 211 files passed and 3 skipped, 2558 tests passed and 20 skipped, 0 failed in every legacy stage, in 005-tests-and-closeout/scratch/final-npm-test.txt. Baseline 206 files and 2524 tests passed. Delta 5 files and 34 tests more, 0 failures in both |
| Criterion 7 strict recursive validation | Done | validate.sh on this folder with --strict --recursive printed RESULT: PASSED six times, run by the final closeout worker after the last document edit and the last repair-derived.cjs --apply |
| Final state 2026-11-13 | Complete | All five phases and the parent spec.md say Complete and every acceptance-criteria.md says Closeable: Yes. No Unmet row is left. Trigger index regenerated in f1cfed3d20 and its check exited 0 with 0 untrusted docs, not rerun after the final closeout edits. Answered: the fixture question is closed by Q003 and ADR-001. Later commits 5fefd819e1, 36b3a68ab7, c21b0cc040 and f1cfed3d20. The final closeout edits are uncommitted. Nothing is pushed or merged |
| Criterion 5 re-proof | Done | The first phrase stopped being archive-only once these documents quoted it. A title phrase from an archived sk-doc packet that no live document holds exits 1 by default and 0 with --include-archive, 4 of 4 lines labeled archived. search.md no longer states a dated result for its example phrase |
| Remediation planned 2026-11-14 | Done | Two code reviews in scratch/review-20261114-*.md. Phases 006 to 010 scaffolded by create.sh --phase --parent at Level 1 and planned. spec.md is In Progress. No code changed |
| 006-relocate-resume-and-preflight | Pending | Planned. Closes A1, A3, A4, A5 and B6 |
| 007-phase-map-and-prearchive-rewrites | Pending | Planned. Closes A2 and A8. Waits for 006 |
| 008-restore-and-phase-numbering | Pending | Planned. Closes A6, A7 and A9. Waits for 006 and 007 |
| 009-proposal-search-and-routing | Pending | Planned. Closes A11, A12, B7 and B8 |
| 010-real-pipeline-tests | Pending | Planned. Closes A10. Waits for 006, 007 and 008 |

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
| Amendment 2026-11-14: decision D5 | D5 said the work runs as five phases. It now names phases 006 to 010 and the findings they close, reviewer A 1 to 12 and reviewer B 6 to 8, on operator decision Q010 in `decision-record.md`. |
| Amendment 2026-11-14: criterion 7 | The count of `RESULT: PASSED` lines went from six to 11, because the parent now has ten children. |
| Amendment 2026-11-14: criteria folded to seven | Each remediation criterion joined the existing criterion on its surface, and the routing check lives in the 009 child goal. Each phase stays observable: 006 in the first criterion, 008 in the third, 009 in the fourth, 007 in the fifth and 010 in the sixth. The fold answers the earlier open question on the count of 12, which `check-goal.cjs` reported as `criteria-count`. |
| Handed to the 008 session | Reviewer B findings 1 to 5 concern the hub vocabulary packet on another session's branch. They are handed to the 008 command surfacing session by operator decision Q013, listed in spec.md and not planned here. |
| Not planned: renumber resume | A stopped `--renumber` run leaves no map to rerun. Reviewer A reports it under the handover claims, not as a numbered finding. Phase 006 lists it as out of scope. |
| Operator decisions 2026-11-14 | Four rows in `decision-record.md`. Q010: remediation runs as new children 006 onward and the parent goal is updated. Q011: the work happens in git worktree 375, created from `origin/main`. Q012: planning and plan verification by fresh Fable 5.2 instances at high effort through claude2, implementation by DeepSeek V4.1 Flash at max reasoning through the dsh harness. Q013: reviewer B findings 1 to 5 go to the 008 command surfacing session. |
| Plan verified 2026-11-14 | An independent verifier returned 17 findings, four of them ones that would have produced a wrong fix or a false done. All 17 are applied in the documents of phases 006 to 010 and here. Phase 006 D5 records the default taken for the first: a moved packet's own validation verdict never keeps a map open. |
| Amendment 2026-11-14: exit status 3 | Phase 008 adds one exit status to `relocate.mjs`. It amends REQ-001 and REQ-012 of phase 001, which is not edited. The record is in spec.md Operator Decisions. |
| Residual against D3 | After a renumber or a re-parent, the Phase column number of a map row, a `Phase N` title and a `Phase N of M` row keep the old number. Phase 007 rewrites folder names only and lists the numbers as out of scope. Not planned. |
<!-- /ANCHOR:log -->
