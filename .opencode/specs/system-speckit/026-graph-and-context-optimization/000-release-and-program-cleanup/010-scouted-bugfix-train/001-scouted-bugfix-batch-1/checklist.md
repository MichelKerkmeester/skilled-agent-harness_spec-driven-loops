---
title: "Verification Checklist: Scouted Bugfix Batch 1"
description: "QA verification for the verify-first scout -> deep-dive -> implement workflow and the 5 confirmed-defect fixes across 10 files."
trigger_phrases:
  - "scouted bugfix batch 1 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/001-scouted-bugfix-batch-1"
    last_updated_at: "2026-06-03T05:31:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verification items confirmed via shell live tests + typecheck/build + targeted vitest"
    next_safe_action: "Validate --strict and reconcile"
    blockers: []
    key_files:
      - ".opencode/bin/worktree-reaper.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-1-session"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Scouted Bugfix Batch 1

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (verify-first scout → deep-dive → implement over 5 disjoint targets)
- [x] CHK-003 [P1] Top 5 selected from the 40-candidate scout; disjoint file partition defined
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fixes are defect-driven; no edits beyond the 5 confirmed defects (no scope creep)
- [x] CHK-011 [P0] No spec-path/packet-id introduced into any edited source file as a tracking artifact
- [x] CHK-012 [P1] worktree-reaper preserves exit-status propagation after the eval → argv-array change
- [x] CHK-013 [P1] 5 implement agents touched disjoint file sets (10 files, no overlap)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Each headline confirmed/refuted by a gpt-5.5-fast deep-dive before any edit
- [x] CHK-021 [P0] The two pre-try lease-leak headlines REFUTED (all throws precede lease acquisition; one post-acquisition call swallows errors); leak "fix" NOT applied
- [x] CHK-022 [P1] The 2 handler-memory-index.vitest.ts failures confirmed PRE-EXISTING (DB-fixture deferred block), unrelated to the heartbeat change
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Fix 1 — worktree-reaper: `eval "$@"` → argv-array `"$@"` (5 call sites); `rm -rf -- "$sd"` guard; `%q` DRY_RUN; `bash -n` + shellcheck clean; LIVE injection test injection dead
- [x] CHK-031 [P0] Fix 2 — setup-cp-sandbox (3 copies): BASH_SOURCE REPO_ROOT + `validate_sandbox_dir()`; `bash -n` + 11-input unit + end-to-end (rejects `$HOME`, `/tmp/../etc`; default works)
- [x] CHK-032 [P0] Fix 3 — advisor IPC: 4 DR-008 items ported (canonicalize, allowedSocketRoots, confinement, post-mkdir stat); typecheck + build exit 0
- [x] CHK-033 [P0] Fix 4 — file-watcher: RetryWaker so `close()` wakes in-flight retries; re-enabled in test:core; 22/22 incl close-mid-retry-sleep test
- [x] CHK-034 [P1] Fix 5 — memory-index scan: `setInterval` lease heartbeat (expiry/3, min 10s, `.unref()`) in try, cleared in finally; cooldown 9/9 incl heartbeat test
- [x] CHK-035 [P0] 5 fixes applied across 10 files; 0 skipped
- [x] CHK-036 [P0] Both MCP builds exit 0 (system-spec-kit + system-skill-advisor mcp_server)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] worktree-reaper shell command injection killed (argv-array execution; live injection test confirms)
- [x] CHK-041 [P0] setup-cp-sandbox rejects empty/non-absolute/`..`/non-`/tmp` paths before destructive `rm -rf`
- [x] CHK-042 [P1] advisor IPC socket confined to allowed socket roots (canonicalize + isWithinAllowedSocketRoot + post-mkdir uid/group-writable stat)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks/implementation-summary synchronized to shipped state
- [x] CHK-051 [P2] Refuted-headline rationale recorded (pre-try lease leak vs the real lesser defect per target)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] No temp/scratch artifacts introduced into the repo; edits land only in the 10 confirmed-defect files (+ their tests/package.json)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-03

### Ship status

- [x] CHK-070 [P1] description.json + graph-metadata.json present
- [ ] CHK-071 [P0] `validate.sh --strict` → Errors 0
- [ ] CHK-072 [P1] Completion metadata reconciled across packet docs
<!-- /ANCHOR:summary -->
