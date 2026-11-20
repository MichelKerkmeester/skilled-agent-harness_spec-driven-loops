---
title: "Goal: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation"
    last_updated_at: "2026-11-20T14:33:59Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-006-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every Skilled-side finding of the extended deep review of the overlay framework/root layout is fixed in the overlay engine, its tests, its docs and the packet record, or rejected with a recorded reason, and the fix is merged into Skilled main with every gate green.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A relayout that fails after its first rename restores every moved copy, the manifest and the links, removes its own backup run and exits 2. A failed restore keeps the backup and names it. |
| D2 | With the tree inside a git repository, a sibling overlay folder that resolves outside the repository's top level or into its `.git` is refused when the context is built, so on every command. A tree in no repository keeps today's behaviour. |
| D3 | Only Skilled is changed. The ai-speckit findings belong to a parallel session, and D-1 belongs to the deep-review workflow's owners. |
| D4 | Engine code lands on `worktrees/481-overlay-framework-root-layout` and merges into main locally with `--no-ff`. Nothing is pushed, fetched or pulled. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] On Skilled main, `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with `fail 0` and more than 250 tests.
- [x] On Skilled main, `node --test --test-name-pattern 'relayout' .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` passes a test that fails a rename mid-run and finds the overlay folder identical to before.
- [x] On Skilled main, a test sees `status` exit 2 with `outside the git repository at` for a sibling outside the repository and for `../.git`, and a test with no repository sees the sibling resolve.
- [x] On Skilled main, `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` and `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` exit 0, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0.
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this phase, phases 002 and 005, and the parent run with `--recursive`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Baseline gates on the branch | Done | engine 250/250, guard 20/20, contract 9/9, each exit 0; `route-validate` exit 0, 32 routes, 11 warnings |
| Engine fixes and tests | Done | branch commits `3aab896957e`, `4ee628578ed`; `@review` APPROVED |
| Merge into Skilled main | Done | `f2a608297c9`; on main engine 262/262, guard 20/20, contract 9/9, `route-validate` exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Third relayout failure line | A rollback that succeeds but cannot delete its backup prints its own line; documented in `references/overlays.md` |
| Hook `GIT_DIR` in the top-level probe | Added after review so a hook-run command does not refuse a valid sibling |
<!-- /ANCHOR:log -->
