---
title: "Goal: Phase 5: tests-and-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "tests and closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/005-tests-and-closeout"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-tests-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: tests-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the relocation engine, the subtrack proposal, archive numbering and the archive mode with vitest suites and real-tree checks, and close the packet with evidence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every suite runs the real script in its own temp repository. No suite moves or writes a file in the real repository. |
| D2 | This phase changes no production behavior. A defect a test exposes is fixed in the phase that owns the code. |
| D3 | The regression claim compares the final `npm test` run with the baseline captured before the first edit of the packet. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx vitest run tests/relocate.vitest.ts tests/suggest-subtracks.vitest.ts tests/archive-numbering.vitest.ts tests/rg-include-archive.vitest.ts tests/validate-archive-recursive.vitest.ts` in `.skilled/skills/system-spec-kit/runtime/cli` exits 0
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 and its fail count is not above the baseline
- [ ] `relocate.mjs --map <sample> --apply` in a throwaway copy exits 0 and a second run exits 0 with nothing to do
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach --strict --recursive` prints `RESULT: PASSED` for the parent and all five children
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
| Planning documents authored | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` in this folder |
| Implementation | Pending | Not started |
| Five suites written | Done | DeepSeek V4.1 Flash through the dsh harness, one file per dispatch, commit 5fefd819e1. relocate 11 cases, suggest-subtracks 5, archive-numbering 4, rg-include-archive 6, validate-archive-recursive 5. The five files together: 31 passed, exit 0. subtrack-tree.mjs unchanged |
| T010 each suite seen failing once | Done | Reported by the five build dispatches with the failing output: one expected value changed, 1 failed, restored, passed. The orchestrator reran all five after the restore, 31 passed, and did not repeat the break |
| Full suite against the baseline | Done | npm test exit 0, 211 files passed and 3 skipped, 2556 tests passed and 20 skipped, 0 failed in every legacy stage, in scratch/final-npm-test.txt. Baseline 206 files and 2524 tests passed, 0 failed. Delta 5 files and 32 tests more, 0 failures in both |
| T012 relocation on the real tree and a clone | Done | Real tree dry run exit 1 with moves=1 moved=0 rewrites=33 identity=1 roots=3 ledger=1 and git status identical. Clone with its own build: --apply exit 0, applied 1 move, sweep ok, validate RESULT: PASSED. Second --apply exit 0 with nothing to do. A clone that borrowed the worktree build failed at repair with dist is stale, and the rerun after a build finished 1 earlier move |
| T013 and AC-008 proposal on a real flat track | Open | No real flat track holds more than eight live packets, cli-classifier holds 6. Fixture demo with 10 packets in the clone: suggest-subtracks exit 0 with a 10-entry map, relocate.mjs --map exit 1 with moves=10 moved=0 rewrites=11 identity=10 roots=3 ledger=10. The row names a real track and no decision record accepts a fixture for it. Open question: does the operator accept the fixture for AC-008 |
| T014 and AC-009 sweep and trigger index | Open | sweep-track-roots.mjs on this worktree exit 0 with all track roots match their declared children and no missing-archive line. generate-trigger-index.mjs --check waits for the index the orchestrator regenerates after these documents |
| T015 archive-only phrase | Done | rg-wrapper.mjs path with skill routing refactor exits 1 with 0 paths. With --include-archive it exits 0 with 2 paths under specs/sk-doc/z_archive/019-skill-routing-refactor, each ending [archived]. The wrapper was run directly, not the slash command |
| Limits and open checklist rows | Open | relocate.vitest.ts stubs six follow-up tools, so the full chain is covered only by the clone run. The deeper than one sub-track message in checkDestinationShape looks unreachable and was left alone. No case covers an empty map, CHK-022. CHK-012, CHK-041, CHK-051 and CHK-003 are not confirmed. spec.md stays at Draft |

### Deviations and findings

| Item | Note |
|------|------|
| Suite file names | The approved plan lists the suites by subject. These docs name the five files. |
| Archive numbering coverage | Phase 003 adds one case to `create-root-numbering.vitest.ts`. The suite here covers the specs root and subtrack depths. |
<!-- /ANCHOR:log -->
