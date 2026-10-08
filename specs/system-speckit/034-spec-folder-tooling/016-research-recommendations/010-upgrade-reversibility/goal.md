---
title: "Goal: upgrade-reversibility"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: upgrade-reversibility

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give `upgrade-legacy --apply` a reversibility record so external users can validate the plan before and after.

### Decisions

Frozen choices, decided 2026-10-08 by the operator. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One manifest per worktree at `<git-dir>/upgrade-legacy.manifest.json`, with `<git-dir>` from `git -C <REPO> rev-parse --absolute-git-dir`, where REPO is the repository the script edits |
| D2 | On a dirty tree, `--apply` writes the manifest before its first change and refuses when it cannot write. Committed trees need no manifest |
| D3 | `--apply` refuses when REPO is not a git repository |
| D4 | The manifest stores real before-image content for each dirty file the run touches: a blob id from `git hash-object -w`, or the file bytes |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Test `upgrade-legacy.vitest.ts::dirty-tree-writes-manifest` passes: `--apply` on a dirty fixture writes the manifest under `git -C <REPO> rev-parse --absolute-git-dir` before any change
- [ ] Test `upgrade-legacy.vitest.ts::manifest-before-image-restores` passes: a dirty file restored from the manifest matches its original bytes
- [ ] Test `upgrade-legacy.vitest.ts::no-git-refuses-apply` passes: `--apply` without git refuses before any write
- [ ] Dry run output includes a "Downgrades" section listing every finding that will transition from error to warning, and `::dirty-tree-idempotent` shows a second run reports zero plan changes
- [ ] README at `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` documents manifest structure, location, before-image content and recovery procedure
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
| Spec and plan written | Done | specs/.../010-upgrade-reversibility/{spec,plan}.md validated --strict |
| Implementation | Pending | To be scheduled |
| Tests | Pending | To be scheduled |

### Deviations and findings

| Item | Note |
|------|------|
| Manifest design decided | 2026-10-08, the operator kept one manifest per worktree and added three fixes: resolve the git dir from REPO with `git -C <REPO> rev-parse --absolute-git-dir` rather than the current directory, refuse `--apply` without git, and store real before-image content. `--git-common-dir` and a path inside `specs/` were considered and rejected |
| Dependency | Phase 009 depends on this phase |
<!-- /ANCHOR:log -->
