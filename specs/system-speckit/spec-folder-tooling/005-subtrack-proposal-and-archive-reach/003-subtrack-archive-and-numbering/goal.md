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

### Deviations and findings

| Item | Note |
|------|------|
| Open question: sweep exit code | The approved plan says the sweep "reports" a subtrack without `z_archive/`. Whether that changes its exit code is undecided. These docs plan an advisory line. |
| 40 untracked folders | The approved plan says to commit 40 existing folders. They are in the operator's main checkout and not in this worktree, where `find` printed nothing. This phase creates them with the refresh. |
| Plan pointer `create.sh:1605` | `resolve_branch_name` is declared at line 1597. The highest-number loop is at lines 1605 to 1619. |
<!-- /ANCHOR:log -->
