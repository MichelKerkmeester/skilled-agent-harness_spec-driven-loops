---
title: "Goal: Phase 3: subtrack-archive-and-numbering"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "subtrack archive and numbering goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/003-subtrack-archive-and-numbering"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-subtrack-archive-and-numbering"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: subtrack-archive-and-numbering

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every declared subtrack a tracked `z_archive/` and stop `create.sh` from reusing a number that an archived packet in the same folder holds.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `refresh-track-roots.mjs --apply` is the one writer that seeds `z_archive/.gitkeep`. `sweep-track-roots.mjs` stays read-only and only reports. |
| D2 | The next number is one above the highest numeric prefix in the target folder and in its `z_archive/`. |
| D3 | No existing packet is renumbered in this phase. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `find specs -mindepth 3 -maxdepth 3 -type d -name z_archive -not -path "specs/*/[0-9][0-9][0-9]-*/*"` prints 40 paths
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs` prints no missing-archive line
- [ ] A second `refresh-track-roots.mjs --apply` run leaves `git status --porcelain` unchanged
- [ ] In a scratch tree with `specs/demo/001-a` and `specs/demo/z_archive/007-b`, `create.sh --track demo --skip-branch` creates `specs/demo/008-*`
- [ ] `npx vitest run tests/create-root-numbering.vitest.ts` in `.skilled/skills/system-spec-kit/runtime/cli` exits 0 with the archive case included
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
| T001 declared sub-tracks and archive folders counted | Done | Before the change the find of section 3 printed 0 paths and the sweep listed 40 declared sub-tracks, exit 0, saved in scratch/sweep-before.txt. scratch/baseline.txt is a copy of the phase 001 baseline because the first edit of this phase predates this session |
| Build: archive-aware numbering, ensureArchive and the sweep advisory | Done | DeepSeek V4.1 Flash through the dsh harness on the LLM Gateway route, four dispatches, the fourth a fix. Orchestrator read every diff. Clone: 001-a live and z_archive/007-b gave 008-next-one, 005-c live and z_archive/002-low gave 006-lower. Scratch tree demo/sub: dry run exit 1 nothing written, apply exit 0 .gitkeep present, second apply up to date exit 0, symlink refused exit 2. Sweep advisory... |
| Real tree seeded | Done | refresh-track-roots.mjs --apply wrote 40 .gitkeep files, exit 0. find prints 40 paths. Second apply left git status --porcelain byte-identical. Sweep printed no missing-archive line, exit 0 as in scratch/sweep-before.txt. pre-push tests PASS=50 FAIL=0 |
| Full suite | Done | First npm test exit 1, 3 failures in tests/track-roots.vitest.ts because seeding wrote into a fixture z_archive that holds a packet. Fix: seed only when the z_archive directory is absent. Rerun exit 0, 206 files and 2525 tests passed, baseline 2524, delta is the new numbering test |
| Reference docs | Done | spec-lifecycle-automation.md line 41 and the archive.sh row of runtime/cli/spec/README.md name the sub-track's own z_archive. The refresh and sweep rows describe the seeding and the advisory |
| Decision: sweep exit code | Decided | Planned default kept: the missing-archive line is an advisory diagnostic, working tree only, exit code unchanged. The operator has not ruled on it |
| AC-003 and T012 tracked files | Open | Pre-commit state: git status --porcelain specs listed 40 z_archive entries and git ls-files printed 40 with the files staged. Both rows name the count after the operator's commit, so they stay open until that run |
| CHK-051 scratch cleaned | Open | sweep-before.txt and baseline.txt stay in scratch because T011 and T014 cite them. Remove them when the phase closes |
| Finding: failing run of the new numbering case | Open | The failure before the create.sh change is the report of the build dispatch, not an orchestrator run. AC-005 and CHK-021 say so |
| Deviation: T003 and CHK-003 reworded | Done | Both asked for a baseline captured before the first edit. That edit predates this session, so they now name the reused phase 001 baseline |
| spec.md status | Open | Left at Draft, as in phase 001. A status other than Draft needs repair-derived.cjs --apply after the last edit, and that command was not permitted in the closeout session. Set it when AC-003 closes |
| AC-003 and T012 tracked files | Done | After commit 5f3e19712e git ls-files 'specs/*/*/z_archive/.gitkeep' printed 40 lines |

### Deviations and findings

| Item | Note |
|------|------|
| Open question: sweep exit code | The approved plan says the sweep "reports" a subtrack without `z_archive/`. Whether that changes its exit code is undecided. These docs plan an advisory line. |
| 40 untracked folders | The approved plan says to commit 40 existing folders. They are in the operator's main checkout and not in this worktree, where `find` printed nothing. This phase creates them with the refresh. |
| Plan pointer `create.sh:1605` | `resolve_branch_name` is declared at line 1597. The highest-number loop is at lines 1605 to 1619. |
<!-- /ANCHOR:log -->
