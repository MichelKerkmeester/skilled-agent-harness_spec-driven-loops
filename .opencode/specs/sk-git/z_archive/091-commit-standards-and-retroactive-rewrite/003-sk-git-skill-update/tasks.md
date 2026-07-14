---
title: "Phase 003 Tasks: sk-git Skill Update"
description: "Checkbox tasks for applying Phase 002 standards into sk-git across 4 runtime mirrors."
trigger_phrases:
  - "112-sk-git-skill-update tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/091-commit-standards-and-retroactive-rewrite/003-sk-git-skill-update"
    last_updated_at: "2026-07-14T21:12:36Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 003 tasks"
    next_safe_action: "Run pre-flight diffs across 4 runtime mirrors"
    blockers:
      - "Phase 002 must close first"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-tasks-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 003 — sk-git Skill Update

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T### [P0/P1/P2] Description` — P0 = blocker, P1 = required, P2 = optional. Mark `[x]` with brief evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-001 [P0] Confirm Phase 002 closed (7 ADRs Accepted; `commit-standards.md` + `derivation-heuristics.md` exist)
- [ ] T-002 [P0] `diff -r .opencode/skills/sk-git/ .claude/skills/sk-git/` — record pre-existing drift
- [ ] T-003 [P0] Same diff against `.codex/skills/sk-git/` and `.gemini/skills/sk-git/`
- [ ] T-004 [P1] Read Phase 002 outputs into context
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### .opencode canonical edits
- [ ] T-010 [P0] SKILL.md §3 — update type priority per ADR-001
- [ ] T-011 [P0] SKILL.md §3 — update scope derivation per ADR-001
- [ ] T-012 [P0] SKILL.md §3 — add packet-ID handling per ADR-002
- [ ] T-013 [P0] SKILL.md §3 — add trailer policy per ADR-003
- [ ] T-014 [P0] SKILL.md §3 — add special cases per ADR-006
- [ ] T-015 [P0] SKILL.md §3 — add length caps per ADR-007
- [ ] T-016 [P0] Update `assets/commit_message_template.md` with 5+ examples
- [ ] T-017 [P0] Update `references/commit_workflows.md` to link derivation-heuristics
- [ ] T-018 [P1] Refresh GIT-007 manual test if trailer policy shifted

### Mirror sync
- [ ] T-020 [P0] `rsync -a --delete .opencode/skills/sk-git/ .claude/skills/sk-git/`
- [ ] T-021 [P0] `rsync -a --delete .opencode/skills/sk-git/ .codex/skills/sk-git/`
- [ ] T-022 [P0] `rsync -a --delete .opencode/skills/sk-git/ .gemini/skills/sk-git/`
- [ ] T-023 [P0] Verify mirrors are real copies, not symlinks
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-030 [P0] `diff -r .opencode/skills/sk-git/ .claude/skills/sk-git/` empty
- [ ] T-031 [P0] `diff -r .opencode/skills/sk-git/ .codex/skills/sk-git/` empty
- [ ] T-032 [P0] `diff -r .opencode/skills/sk-git/ .gemini/skills/sk-git/` empty
- [ ] T-033 [P0] Run GIT-007 manual scenario; record pass/fail
- [ ] T-034 [P0] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ./003-sk-git-skill-update --strict` exits 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- 4-runtime mirror parity is byte-perfect
- `implementation-summary.md` updated with completion_pct=100
- Parent `graph-metadata.json` `derived.last_active_child_id` advanced to `004-…`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessor: `../002-commit-standards-definition/`
- Successor: `../004-cli-devin-rewrite-prompts/`
<!-- /ANCHOR:cross-refs -->
