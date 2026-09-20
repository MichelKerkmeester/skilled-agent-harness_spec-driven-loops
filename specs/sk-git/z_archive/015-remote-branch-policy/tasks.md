---
title: "Tasks: Remote Branch Push Permission Policy"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "remote branch policy"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/015-remote-branch-policy"
    last_updated_at: "2026-07-17T16:01:41Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All 27 tasks completed"
    next_safe_action: "Run strict validate; reconcile checklist.md"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/pre-push"
      - ".opencode/scripts/git-hooks/tests/pre-push.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-015"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Remote Branch Push Permission Policy

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Allowlist Mechanism

- [x] T001 Add `_wn_remote_allowlist_file()` + `is_remote_push_allowlisted()` to §3 VALIDATORS (`.opencode/skills/sk-git/scripts/worktree-naming.sh`)
- [x] T002 Add `validate-remote-allowlist <branch>` CLI dispatch + usage line (`.opencode/skills/sk-git/scripts/worktree-naming.sh`)
- [x] T003 Create comment-only allowlist template (`.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt`)
- [x] T004 Smoke-test the CLI directly for `main`, `skilled/v4.0.0.0`, and an arbitrary branch name before touching the hook
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Pre-Push Hook Permission Gate

- [x] T005 Decouple `SPECKIT_SKIP_PREPUSH_NAMING` from the whole-script early exit; scope it to the naming portion only (`.opencode/scripts/git-hooks/pre-push`)
- [x] T006 Fold the permission gate into the existing per-ref loop: allowlist check → `SPECKIT_ALLOW_REMOTE_PUSH` check → scoped `SPECKIT_AUTOSYNC`/`SPECKIT_LIVE_BRANCH` exception → BLOCK with retry instructions (`.opencode/scripts/git-hooks/pre-push`)
- [x] T007 Update the hook's own header comment (bypass vars, allowlist file path) (`.opencode/scripts/git-hooks/pre-push`)
- [x] T008 [P] Update pre-push's description line (`.opencode/scripts/install-git-hooks.sh`)

### Test Suite Update + Verification

- [x] T009 Update "valid new task branch accepted" scenario for the new default-blocked outcome + add bypass variant (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`)
- [x] T010 Update "legacy update to an existing branch allowed" scenario + add bypass variant (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`)
- [x] T011 Update "SPECKIT_SKIP_PREPUSH_NAMING=1 bypasses the gate entirely" scenario to reflect independent gates + add combined-bypass variant (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`)
- [x] T012 Add `SPECKIT_ALLOW_REMOTE_PUSH=1` to the "owner discovery error fails open" scenario's env (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`)
- [x] T013 [P] Add scenario: custom allowlist-file pattern exempts a new branch (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`)
- [x] T014 [P] Add scenario: `SPECKIT_AUTOSYNC=1` + matching `SPECKIT_LIVE_BRANCH` exempts an update push (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`)
- [x] T015 [P] Add negative scenario: `SPECKIT_AUTOSYNC=1` set but branch != `SPECKIT_LIVE_BRANCH` still blocks (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`)
- [x] T016 [P] Add scenario: `main` push (new and update forms) allowed with zero env vars set (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`)
- [x] T017 Run `pre-push.test.sh`; fix until `PASS=<N> FAIL=0`
- [x] T018 Manual dry-run of a real `git push --dry-run` against a non-allowlisted branch; confirm the printed message is clear and actionable

### sk-git Skill Documentation

- [x] T019 Add "Remote Push Permission Enforcement" subsection to §3 HOW IT WORKS (`.opencode/skills/sk-git/SKILL.md`)
- [x] T020 Add ALWAYS #18 (`.opencode/skills/sk-git/SKILL.md`)
- [x] T021 Write `references/remote-branch-policy.md` (full contract: allowlist format, bypass vars, autosync exception, rationale)
- [x] T022 [P] Update Option 2 push snippet + note (`.opencode/skills/sk-git/references/finish-workflows.md`)
- [x] T023 [P] Cross-link the scoped autosync exception (`.opencode/skills/sk-git/references/continuous-integration.md`)
- [x] T024 [P] Add capability row (`.opencode/skills/sk-git/feature-catalog/feature-catalog.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Root Sync + Close-Out

- [x] T025 Add row to §5 Git Workspace Safety table (`CLAUDE.md`, repo root)
- [x] T026 Write `implementation-summary.md` with evidence (test output, files changed, verification commands run)
- [x] T027 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-git/015-remote-branch-policy --strict`; reconcile `checklist.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `pre-push.test.sh`: `PASS=21 FAIL=0`
- [x] `validate.sh --strict`: exit 0 (confirmed: Errors:0 Warnings:0 PASSED)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Research**: See `research.md`
- **Decision Record**: See `decision-record.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
