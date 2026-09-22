---
title: "Tasks: restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution

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
## Phase 1: Setup

- [x] T001 Create the 028 packet and the local-only worktree per the operator's choice (specs/system-skill-advisor/028-restore-pi-advisor-brief, .worktrees/059-restore-pi-advisor-brief)
- [x] T002 Provision the worktree's dependency trees via the worktree-naming provision step (advisor runtime, spec-kit, deep-loop)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Either-root probe in `findCliFallbackPaths`: `.skilled` first, `.opencode` fallback, shim+bridge+default DB dir from one found root, upward walk kept (.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts)
- [x] T004 Key the pi dedup receipt on the full delivered contribution; keep `SPECKIT_PI_DIRECTIVE_DEDUP=0` always-full and the session-start/compact resets (.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts)
- [x] T005 Rebuild the advisor package so the compiled hook the extension imports carries both fixes (npm --prefix .skilled/skills/system-skill-advisor/runtime run build)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Stdin smoke of the compiled hook: `status: "ok"`, `freshness: "live"`, brief = `Advisor: live; use sk-doc 0.94/0.12 pass.` (warm 1141 ms; first call 2431 ms = the one-time cold start)
- [x] T007 Worktree advisor status: `ok`, freshness `live`, generation 1, 21 skills, trustState `live`
- [x] T008 Package test battery: 880 passed / 11 failed / 898; the identical 11 failures reproduced on the stash-baseline without the edits (pre-existing; 0 failures in the touched behavior)
- [x] T009 Comment hygiene on both edited sources: exit 0, zero violations
- [x] T010 Derived-identity repair and strict packet validation (see the implementation summary's verification table for the recorded result)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed — interactive pi (from the worktree, or after merging it) with `SPECKIT_PI_ADVISOR_DEBUG=1` shows `brief=head(Live|Stale)` on the first prompt; pending the operator's check
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
