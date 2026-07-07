---
title: "Tasks: Phase 3: verify-and-ship"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "068/003 tasks"
  - "verify-and-ship tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "068-sk-doc-organization/003-verify-and-ship"
    last_updated_at: "2026-05-05T08:55:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored tasks.md for Phase 3"
    next_safe_action: "Execute Phase 3: validate.sh --strict, @review opus dispatch, generate-context.js, commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-authoring"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: verify-and-ship

<!-- SPECKIT_LEVEL: 1 -->

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
## Phase 1: Setup (pre-flight)

- [ ] T001 Confirm on `main` branch (`git branch --show-current`)
- [ ] T002 Confirm Phase 1 (commit ccd73ef55) and Phase 2 commits landed (`git log --oneline -5`)
- [ ] T003 Confirm spec folder structure: parent + 001 + 002 + 003 with all required files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation (verification gate)

- [ ] T004 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/054-sk-doc-organization --strict`; must exit 0
- [ ] T005 Dispatch `@review` agent (Opus 4.7, fresh context, read-only) with `sk-code-review` skill loaded
- [ ] T006 Verifier reruns validate.sh + rg residual + diff -rq + tomllib parse-check IN FRESH SHELL
- [ ] T007 Verifier samples 3 random updated files; confirms NEW path-strings present, no content drift
- [ ] T008 Verifier applies Hunter/Skeptic/Referee on `git diff main~2 HEAD`
- [ ] T009 Verifier returns PASS / FAIL_REMEDIATE_VIA_CODEX / FAIL_HALT_TO_USER
- [ ] T010 If FAIL_REMEDIATE: dispatch cli-codex to fix specific issues; re-verify (≤2 retry cycles)
- [ ] T011 If FAIL_HALT: halt to user with diagnostic
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Closeout

- [ ] T012 Run `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` for parent 068 + 3 children
- [ ] T013 Verify graph-metadata.json `derived.last_known_status = "complete"` for each
- [ ] T014 Author `003-verify-and-ship/implementation-summary.md` with verifier outcomes
- [ ] T015 (Optional) Author `.opencode/skills/sk-doc/changelog/v<next>.md` documenting the reorg
- [ ] T016 Stage Phase 3 changes (specific files)
- [ ] T017 Commit: `feat(sk-doc): verify and ship sk-doc reorg (068/003)`
- [ ] T018 Verify `git branch --show-current = main`; `git log --oneline -5` shows clean lineage
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001–T018 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] @review verifier returned VERDICT: PASS
- [ ] Final commit on main; packet 068 shipped
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md` (post-execution)
- **Parent Spec**: See `../spec.md`
- **Predecessor**: `../002-update-and-mirror/implementation-summary.md`
- **Master plan**: `/Users/michelkerkmeester/.claude/plans/reorganize-sk-doc-assets-by-promoting-dynamic-pearl.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
