---
title: "Goal: Phase 1: ignore-and-commit-guard"
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
    packet_pointer: "sk-code/013-private-surface-skills/001-ignore-and-commit-guard"
    last_updated_at: "2026-10-23T10:34:19Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files:
      - ".gitignore"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/scripts/git-hooks/tests/pre-commit.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-001-ignore-and-commit-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: ignore-and-commit-guard

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a private `local-*` skill impossible to stage by accident and impossible to commit from any of the eight runtime skill roots, before the first private byte exists.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The guard covers eight roots: `.skilled`, `.opencode`, `.claude`, `.pi`, `.devin`, `.hermes`, `.codex`, `.cursor`. |
| D2 | The guard has no bypass variable and no `lib/gates.tsv` row. |
| D3 | Every ignore rule is written without a trailing slash, so it matches a real directory and a symlink alike. |
| D4 | The guard matches the staged path name, not the content: a renamed copy is committable by design. |
| D5 | Only three tracked files change: the root `.gitignore`, the pre-commit hook and its harness. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` exits 0 and its last line reads `pre-commit gates: 131 passed, 0 failed`.
- [ ] `git check-ignore -v` names a rule for a private path under each of `.skilled`, `.hermes`, `.codex` and `.cursor`, and exits 0.
- [ ] The hook refuses a staged `.skilled/skills/local-probe/SKILL.md` with exit 1, naming the path and `git rm --cached -r`.
- [ ] The hook refuses a staged symlink and a staged gitlink named `local-*` with exit 1, and passes a renamed copy with exit 0.
- [ ] `bash -n .skilled/scripts/git-hooks/pre-commit` exits 0, the guard sits before the comment-hygiene gate, and no `SPECKIT_SKIP_*` read and no `lib/gates.tsv` row exists for it.
- [ ] The phase commit changes only `.gitignore`, `.skilled/scripts/git-hooks/pre-commit` and `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` outside `specs/`, and `git status --porcelain` is empty with HEAD equal to `origin/main`.
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
| Phase opened | Done | Planning documents rewritten for Level 3 on 2026-10-23 |
| Anchor verification | Pending | T002 to T004 re-read the three insertion points at the phase base |
| Guard and ignore rules | Pending | T006 and T007 |
| Harness cases | Pending | T009 to T015, seven cases |
| Harness and probes | Pending | T016 to T019 |
| Review, validation, delivery | Pending | T022 to T027 |

### Deviations and findings

| Item | Note |
|------|------|
| The earlier draft covered six roots | Widened to eight after the research synthesis found `.codex` and `.cursor` outside the matrix; ADR-001 records the choice and both roots carry 77 and 81 tracked paths. |
| The earlier draft diffed against `42b41dd286` | That commit is two commits behind HEAD, and its diff already carries four regenerated retrieval files this phase does not touch. T001 records the phase base instead. |
| The earlier draft bundled a symlink probe with its cleanup | Split into T018 and T019 so each task is one change with its own proof. |
<!-- /ANCHOR:log -->
