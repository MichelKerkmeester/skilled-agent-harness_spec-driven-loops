---
title: "Task Breakdown: Scouted Bugfix Batch 1"
description: "Task list for the verify-first scout -> deep-dive -> implement workflow over the top 5 of 40 scouted candidate defects (10 files)."
trigger_phrases:
  - "scouted bugfix batch 1 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-scouted-bugfix-batch-1"
    last_updated_at: "2026-06-03T05:31:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All scout + deep-dive + implement tasks complete; 5 fixes / 10 files / verified"
    next_safe_action: "Metadata + validate + reconcile"
    blockers: []
    key_files:
      - ".opencode/bin/worktree-reaper.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-1-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Scouted Bugfix Batch 1

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description — evidence`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Scout the codebase — 8 agents enumerated 40 candidate deep-research targets
- [x] T-02 Select the top 5 targets by risk (2 shell, 1 IPC, 2 MCP-server)
- [x] T-03 [P] Run 5 parallel gpt-5.5-fast deep-dives to confirm/refute each headline against the real code
- [x] T-04 Refute the two pre-try lease-leak headlines — all throws precede lease acquisition; the one post-acquisition call swallows its errors; each target still had a real lesser defect
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-05 [P] Run 5 parallel disjoint-file implement agents on the confirmed defects (10 files, no overlap)
- [x] T-06 Fix 1 (worktree-reaper, P1 security): `eval "$@"` → argv-array `"$@"` at 5 call sites; `rm -rf -- "$sd"` end-of-options guard; DRY_RUN uses `%q`
- [x] T-07 Fix 2 (setup-cp-sandbox x3, P1 security): derive REPO_ROOT from BASH_SOURCE; add `validate_sandbox_dir()` rejecting empty/non-abs/`..`/non-`/tmp` before `rm -rf`
- [x] T-08 Fix 3 (advisor IPC, P1 security): port the 4 DR-008 items (canonicalizePath ancestor-realpath, allowedSocketRoots, isWithinAllowedSocketRoot, post-mkdir uid/group-writable stat)
- [x] T-09 Fix 4 (file-watcher, P2 bug): RetryWaker wake-coordination (sticky-after-wakeAll; clears backoff timer) so `close()` wakes in-flight retries; re-enable suite in test:core
- [x] T-10 Fix 5 (memory-index scan, P2 bug): `setInterval` lease heartbeat (expiry/3, min 10s, `.unref()`) started in try, cleared in finally
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-11 Verify Fix 1: `bash -n` + shellcheck clean; LIVE injection test (hostile `$sd` dir name) injection dead; exit-status propagation preserved
- [x] T-12 Verify Fix 2: `bash -n` + 11-input unit test + end-to-end (rejects `$HOME` and `/tmp/../etc`; default path still works)
- [x] T-13 Verify Fix 3: typecheck + build exit 0; faithful to the code-graph DR-008 reference
- [x] T-14 Verify Fix 4: typecheck exit 0; file-watcher suite 22/22 pass incl new close-mid-retry-sleep test
- [x] T-15 Verify Fix 5: typecheck exit 0; cooldown suite 9/9 pass incl new heartbeat test (2 handler-memory-index failures are PRE-EXISTING, DB-fixture deferred block)
- [x] T-16 Builds: system-spec-kit mcp_server `npm run build` exit 0; system-skill-advisor mcp_server build exit 0
- [x] T-17 Orchestrator reviewed every diff; confirmed builds + tests
- [ ] T-18 description.json + graph-metadata.json
- [ ] T-19 validate.sh --strict → 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All scout + deep-dive + implement tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 5 fixes applied / 10 files / each stack-verified
- [ ] Ship tasks (metadata, validate) complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
