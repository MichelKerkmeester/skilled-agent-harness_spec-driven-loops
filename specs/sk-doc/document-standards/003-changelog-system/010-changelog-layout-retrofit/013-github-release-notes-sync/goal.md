---
title: "Goal: Phase 13: github-release-notes-sync"
description: "Every GitHub release body reads in the v4.1.0.0 layout: rebuilt from its rewritten entry, or rewritten from its live body when no entry exists."
trigger_phrases:
  - "github release notes sync goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit/013-github-release-notes-sync"
    last_updated_at: "2026-11-17T18:13:13Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cbc62a39-7ca8-4b5a-989f-a86fdea260ea"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: github-release-notes-sync

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every GitHub release body reads in the v4.1.0.0 layout: rebuilt from its rewritten entry, or rewritten from its live body when no entry exists.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only release bodies change. No tag moves and no release is deleted |
| D2 | Hy4 Flash Free at high thinking through cli-opencode writes whenever it is available. When it is limited or fails, GLM 5.3 Flash at high on the opencode-go provider writes instead. A free model from another family checks the facts, for the 92 bodies that have no entry |
| D3 | A body with an entry is rebuilt by `build_release_notes.py`, never written by hand |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `gh release list --limit 500` counts 152 releases
- [ ] Each of the 60 releases with an entry has a body equal to `build_release_notes.py` output for that entry
- [ ] Each of the 92 releases without an entry has a rewritten body that keeps every code span and number of its old body
- [ ] Every tag still points at the commit it pointed at before this phase
- [ ] `validate.sh --strict` on `013-github-release-notes-sync` prints `RESULT: PASSED`
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
| Goal authored | Done | `check-goal.cjs` on this packet |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
